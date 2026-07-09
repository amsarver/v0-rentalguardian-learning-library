import { list } from '@vercel/blob'
import JSZip from 'jszip'

export interface ResourceContent {
  title: string
  text: string
}

/** Extract visible text from a PPTX/PPT file. */
async function extractTextFromPptx(arrayBuffer: ArrayBuffer): Promise<string> {
  const zip = await JSZip.loadAsync(arrayBuffer)
  const slideFiles = Object.keys(zip.files)
    .filter((name) => name.match(/ppt\/slides\/slide\d+\.xml$/))
    .sort((a, b) => {
      const numA = parseInt(a.match(/slide(\d+)/)?.[1] || '0')
      const numB = parseInt(b.match(/slide(\d+)/)?.[1] || '0')
      return numA - numB
    })

  const slideTexts: string[] = []
  for (const slideFile of slideFiles) {
    const content = await zip.file(slideFile)?.async('string')
    if (!content) continue
    const matches = content.match(/<a:t[^>]*>([^<]*)<\/a:t>/g) || []
    const text = matches
      .map((m) => m.replace(/<a:t[^>]*>/, '').replace(/<\/a:t>/, '').trim())
      .filter(Boolean)
      .join(' ')
    if (text) slideTexts.push(text)
  }
  return slideTexts.join('\n\n')
}

/** Extract text from a PDF file. Image-only PDFs will yield little or no text. */
async function extractTextFromPdf(arrayBuffer: ArrayBuffer): Promise<string> {
  // Use the legacy build so pdfjs runs in a Node server environment without a worker.
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const data = new Uint8Array(arrayBuffer)
  const doc = await getDocument({ data, useSystemFonts: true }).promise

  const pageTexts: string[] = []
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i)
    const textContent = await page.getTextContent()
    const text = textContent.items
      // @ts-expect-error - pdfjs TextItem has a `str` field
      .map((item) => (typeof item.str === 'string' ? item.str : ''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
    if (text) pageTexts.push(text)
  }
  return pageTexts.join('\n\n')
}

function titleFromPathname(pathname: string): string {
  return (
    pathname
      .split('/')
      .pop()
      ?.replace(/^\d+-/, '')
      .replace(/\.(pptx?|pdf)$/i, '') || 'Untitled'
  )
}

/**
 * Fetch and extract text from every resource in Blob storage (PowerPoint + PDF).
 * Returns one entry per resource that yielded usable text.
 */
export async function getAllResourceContent(): Promise<ResourceContent[]> {
  const { blobs } = await list({ prefix: 'presentations/' })
  const results: ResourceContent[] = []

  for (const blob of blobs) {
    const isPptx = /\.pptx?$/i.test(blob.pathname)
    const isPdf = /\.pdf$/i.test(blob.pathname)
    if (!isPptx && !isPdf) continue

    try {
      const response = await fetch(blob.url)
      const arrayBuffer = await response.arrayBuffer()
      const text = isPptx
        ? await extractTextFromPptx(arrayBuffer)
        : await extractTextFromPdf(arrayBuffer)

      if (text && text.trim()) {
        results.push({ title: titleFromPathname(blob.pathname), text: text.trim() })
      }
    } catch (error) {
      console.error(`[v0] Failed to extract text from ${blob.pathname}:`, error)
    }
  }

  return results
}
