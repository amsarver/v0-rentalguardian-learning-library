import { NextResponse } from 'next/server'
import { streamText, convertToModelMessages } from 'ai'
import { list } from '@vercel/blob'
import JSZip from 'jszip'

// Extract text from PPTX file
async function extractTextFromPptx(url: string): Promise<string> {
  try {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    const zip = await JSZip.loadAsync(arrayBuffer)
    
    const textContent: string[] = []
    const slideFiles = Object.keys(zip.files)
      .filter(name => name.match(/ppt\/slides\/slide\d+\.xml$/))
      .sort()
    
    for (const slideFile of slideFiles) {
      const content = await zip.files[slideFile].async('string')
      const textMatches = content.match(/<a:t>([^<]*)<\/a:t>/g) || []
      const slideText = textMatches
        .map(match => match.replace(/<\/?a:t>/g, ''))
        .filter(text => text.trim())
        .join(' ')
      
      if (slideText) {
        textContent.push(slideText)
      }
    }
    
    return textContent.join('\n\n')
  } catch (error) {
    console.error('Error extracting text:', error)
    return ''
  }
}

export async function GET() {
  try {
    // Get all presentations
    const { blobs } = await list({ prefix: 'presentations/' })
    
    if (blobs.length === 0) {
      return NextResponse.json({ questions: [] })
    }
    
    // Extract text from all presentations
    const allContent: string[] = []
    for (const blob of blobs) {
      if (blob.pathname.endsWith('.pptx') || blob.pathname.endsWith('.ppt')) {
        const text = await extractTextFromPptx(blob.url)
        if (text) {
          const title = blob.pathname.split('/').pop()?.replace(/^\d+-/, '') || 'Presentation'
          allContent.push(`--- ${title} ---\n${text}`)
        }
      }
    }
    
    if (allContent.length === 0) {
      return NextResponse.json({ questions: [] })
    }
    
    // Generate Q&A using AI
    const result = await streamText({
      model: 'openai/gpt-4o-mini',
      messages: await convertToModelMessages([
        {
          role: 'user',
          parts: [{
            type: 'text',
            text: `Based on the following presentation content, generate exactly 6 frequently asked questions with concise answers. Focus on the most important and practical information that clients would want to know.

Format your response as a JSON array with objects containing "question" and "answer" fields. Keep answers to 2-3 sentences max.

Presentation Content:
${allContent.join('\n\n')}

Respond ONLY with the JSON array, no other text.`
          }]
        }
      ])
    })
    
    // Collect the full response
    let fullResponse = ''
    for await (const chunk of result.textStream) {
      fullResponse += chunk
    }
    
    // Parse JSON response
    try {
      // Clean up the response - remove markdown code blocks if present
      const cleanedResponse = fullResponse
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim()
      
      const questions = JSON.parse(cleanedResponse)
      return NextResponse.json({ questions })
    } catch {
      console.error('Failed to parse Q&A response:', fullResponse)
      return NextResponse.json({ questions: [] })
    }
  } catch (error) {
    console.error('Error generating Q&A:', error)
    return NextResponse.json({ error: 'Failed to generate Q&A' }, { status: 500 })
  }
}
