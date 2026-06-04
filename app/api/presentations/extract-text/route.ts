import { type NextRequest, NextResponse } from 'next/server'
import { list } from '@vercel/blob'
import JSZip from 'jszip'

// Extract text from PPTX XML content
function extractTextFromXml(xml: string): string {
  // Extract text from <a:t> tags (PowerPoint text elements)
  const textMatches = xml.match(/<a:t[^>]*>([^<]*)<\/a:t>/g) || []
  const texts = textMatches.map(match => {
    const content = match.replace(/<a:t[^>]*>/, '').replace(/<\/a:t>/, '')
    return content.trim()
  }).filter(t => t.length > 0)
  
  return texts.join(' ')
}

// Extract all text from a PPTX file
async function extractTextFromPptx(arrayBuffer: ArrayBuffer): Promise<string> {
  const zip = await JSZip.loadAsync(arrayBuffer)
  const slideTexts: string[] = []
  
  // Find all slide files
  const slideFiles = Object.keys(zip.files)
    .filter(name => name.match(/ppt\/slides\/slide\d+\.xml$/))
    .sort((a, b) => {
      const numA = parseInt(a.match(/slide(\d+)/)?.[1] || '0')
      const numB = parseInt(b.match(/slide(\d+)/)?.[1] || '0')
      return numA - numB
    })
  
  for (const slideFile of slideFiles) {
    const content = await zip.file(slideFile)?.async('string')
    if (content) {
      const text = extractTextFromXml(content)
      if (text) {
        slideTexts.push(text)
      }
    }
  }
  
  return slideTexts.join('\n\n')
}

export async function GET(request: NextRequest) {
  try {
    // List all presentations from Blob storage
    const { blobs } = await list({ prefix: 'presentations/' })
    
    const presentationTexts: { title: string; content: string; url: string }[] = []
    
    for (const blob of blobs) {
      if (blob.pathname.match(/\.(pptx?)$/i)) {
        try {
          // Fetch the file
          const response = await fetch(blob.url)
          const arrayBuffer = await response.arrayBuffer()
          
          // Extract text
          const text = await extractTextFromPptx(arrayBuffer)
          const title = blob.pathname.split('/').pop()?.replace(/\.(pptx?)$/i, '') || 'Untitled'
          
          presentationTexts.push({
            title,
            content: text,
            url: blob.url,
          })
        } catch (err) {
          console.error(`[v0] Failed to extract text from ${blob.pathname}:`, err)
        }
      }
    }
    
    return NextResponse.json({ presentations: presentationTexts })
  } catch (error) {
    console.error('[v0] Error extracting presentation text:', error)
    return NextResponse.json({ error: 'Failed to extract text' }, { status: 500 })
  }
}
