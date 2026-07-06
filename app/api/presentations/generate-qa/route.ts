import { NextResponse } from 'next/server'
import { streamText, convertToModelMessages } from 'ai'
import { list } from '@vercel/blob'
import JSZip from 'jszip'

// Curated FAQs derived from the RentalGuardian Damage Claims Portal training guide.
// Used as a reliable fallback when live AI generation is unavailable.
const FALLBACK_QUESTIONS = [
  {
    question: 'What types of claims can I submit through the RentalGuardian Damage Claims Portal?',
    answer:
      'The portal is for guest-caused accidental damage claims. You submit your loss details through the guided intake portal at https://intake.sedgwick.com/u/2530/intake, right from your mobile device or computer.',
  },
  {
    question: 'What do I need before I start a claim?',
    answer:
      'You must include at least 2 photos (the damaged item and a related invoice or receipt) to proceed. Each file must be 6 MB or smaller, and all fields marked with an asterisk (*) are required to submit.',
  },
  {
    question: 'How long do I have to submit a claim?',
    answer:
      'Please submit your claim within 14 days after the guest checks out. You can share any additional details within 45 days after checkout.',
  },
  {
    question: 'Does the portal save my progress?',
    answer:
      'No. The portal does not save progress, and if it sits idle for more than 20 minutes you must restart. The guided form is designed to take about 10 minutes to complete.',
  },
  {
    question: 'How do I add damaged items and photos?',
    answer:
      'Click "Add" to enter damaged items one at a time, attaching photos for each item and indicating whether the structure or contents were affected. Provide an estimated value per item (or enter $1 if uncertain); receipts and invoices can be added later in the portal.',
  },
  {
    question: 'What happens after I submit my claim?',
    answer:
      'A confirmation screen appears with your claim number—copy and save it, since you will need it to register and track your claim. Allow up to 24 hours after submission before tracking, and note that unsubmitted claims are not received.',
  },
  {
    question: 'How do I track my claim and communicate with the claims team?',
    answer:
      'Sign in at https://www.mysedgwick.com/rentalguardian, where claims are managed by our partner Sedgwick. New users register with their last name, address (city, state, postal code), and claim number, then use the Claim Dashboard and Communication Center to track updates and message their examiner.',
  },
  {
    question: 'When will I be paid, and who do I contact for help?',
    answer:
      'Claims are typically payable within 30 days after a decision is finalized, via Electronic or Mail (Mail is the default). For technical questions call 860.626.9943 or email Robin.Doran@sedgwick.com; for RentalGuardian support, email support@rentalguardian.com or call (888) 885-5550 (Prompt 2), M–S, 8:30 AM–5:30 PM EST.',
  },
]

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

    const hasPptx = blobs.some(
      (blob) => blob.pathname.endsWith('.pptx') || blob.pathname.endsWith('.ppt'),
    )
    
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
      // No extractable text — fall back to curated FAQs if a presentation exists.
      return NextResponse.json({ questions: hasPptx ? FALLBACK_QUESTIONS : [] })
    }
    
    // Try to generate fresh Q&A using AI. If the AI Gateway is unavailable
    // (e.g. billing/credits) or returns unparseable output, fall back to the
    // curated FAQs derived from the presentation content.
    try {
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

      // Clean up the response - remove markdown code blocks if present
      const cleanedResponse = fullResponse
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim()

      const questions = JSON.parse(cleanedResponse)
      if (Array.isArray(questions) && questions.length > 0) {
        return NextResponse.json({ questions })
      }
      // Empty or invalid shape — use curated fallback.
      return NextResponse.json({ questions: FALLBACK_QUESTIONS })
    } catch (aiError) {
      console.error('AI Q&A generation unavailable, using fallback:', aiError)
      return NextResponse.json({ questions: FALLBACK_QUESTIONS })
    }
  } catch (error) {
    console.error('Error generating Q&A:', error)
    // Last-resort fallback so the FAQ section still renders useful content.
    return NextResponse.json({ questions: FALLBACK_QUESTIONS })
  }
}
