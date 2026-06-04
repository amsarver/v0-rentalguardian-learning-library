import { streamText, convertToModelMessages, UIMessage } from 'ai'
import { list } from '@vercel/blob'
import JSZip from 'jszip'

export const maxDuration = 60

// Extract text from PPTX XML content
function extractTextFromXml(xml: string): string {
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

// Get all presentation content for context
async function getPresentationContext(): Promise<string> {
  try {
    const { blobs } = await list({ prefix: 'presentations/' })
    const contextParts: string[] = []
    
    for (const blob of blobs) {
      if (blob.pathname.match(/\.(pptx?)$/i)) {
        try {
          const response = await fetch(blob.url)
          const arrayBuffer = await response.arrayBuffer()
          const text = await extractTextFromPptx(arrayBuffer)
          const title = blob.pathname.split('/').pop()?.replace(/\.(pptx?)$/i, '') || 'Untitled'
          
          if (text) {
            contextParts.push(`=== Presentation: ${title} ===\n${text}`)
          }
        } catch (err) {
          console.error(`[v0] Failed to extract text from ${blob.pathname}:`, err)
        }
      }
    }
    
    return contextParts.join('\n\n')
  } catch (error) {
    console.error('[v0] Error getting presentation context:', error)
    return ''
  }
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()
  
  // Get presentation content for context
  const presentationContext = await getPresentationContext()
  
  const systemPrompt = `You are a helpful assistant for RentalGuardian's Learning Library. You help clients understand the content in the training presentations and answer questions about RentalGuardian's products and services.

${presentationContext ? `Here is the content from the uploaded presentations that you can reference to answer questions:

${presentationContext}

When answering questions:
- Reference specific information from the presentations when relevant
- If you don't find the answer in the presentations, let the user know
- Be friendly and professional
- Keep responses clear and concise` : 'No presentations have been uploaded yet. Please let the user know they can upload presentations to get answers based on that content.'}
`

  const result = streamText({
    model: 'openai/gpt-4o-mini',
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse()
}
