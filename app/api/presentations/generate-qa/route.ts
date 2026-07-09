import { NextResponse } from 'next/server'
import { streamText, convertToModelMessages } from 'ai'
import { getAllResourceContent } from '@/lib/presentation-content'
import { CURATED_FAQS } from '@/lib/faq-knowledge'

export const maxDuration = 60

export async function GET() {
  try {
    // Extract text from every resource in Blob storage (PowerPoint + PDF).
    const resources = await getAllResourceContent()

    if (resources.length === 0) {
      // Nothing readable to build from — surface the curated FAQs so the
      // section still shows accurate, current content.
      return NextResponse.json({ questions: CURATED_FAQS })
    }

    const allContent = resources.map((r) => `--- ${r.title} ---\n${r.text}`)

    // Try to generate fresh Q&A using AI. If the AI Gateway is unavailable
    // (e.g. billing/credits) or returns unparseable output, fall back to the
    // curated FAQs derived from the current resources.
    try {
      const result = await streamText({
        model: 'openai/gpt-4o-mini',
        messages: await convertToModelMessages([
          {
            role: 'user',
            parts: [
              {
                type: 'text',
                text: `Based on the following resource content, generate 8 frequently asked questions with concise answers. Focus on the most important and practical information that clients would want to know.

Format your response as a JSON array with objects containing "question" and "answer" fields. Keep answers to 2-3 sentences max.

Resource Content:
${allContent.join('\n\n')}

Respond ONLY with the JSON array, no other text.`,
              },
            ],
          },
        ]),
      })

      let fullResponse = ''
      for await (const chunk of result.textStream) {
        fullResponse += chunk
      }

      const cleanedResponse = fullResponse
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim()

      const questions = JSON.parse(cleanedResponse)
      if (Array.isArray(questions) && questions.length > 0) {
        return NextResponse.json({ questions })
      }
      return NextResponse.json({ questions: CURATED_FAQS })
    } catch (aiError) {
      console.error('AI Q&A generation unavailable, using curated FAQs:', aiError)
      return NextResponse.json({ questions: CURATED_FAQS })
    }
  } catch (error) {
    console.error('Error generating Q&A:', error)
    // Last-resort fallback so the FAQ section still renders useful content.
    return NextResponse.json({ questions: CURATED_FAQS })
  }
}
