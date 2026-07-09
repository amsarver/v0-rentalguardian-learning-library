import {
  streamText,
  convertToModelMessages,
  createUIMessageStreamResponse,
  createUIMessageStream,
  UIMessage,
} from 'ai'
import { getAllResourceContent } from '@/lib/presentation-content'
import { findRelevantFaqs } from '@/lib/faq-knowledge'

export const maxDuration = 60

function getUIMessageText(msg: UIMessage | undefined): string {
  if (!msg?.parts || !Array.isArray(msg.parts)) return ''
  return msg.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('')
}

// Build a helpful answer from the curated knowledge base when live AI is
// unavailable, so the assistant still responds with current information.
function buildFallbackAnswer(question: string): string {
  const matches = findRelevantFaqs(question, 2)
  if (matches.length === 0) {
    return "I can share information straight from the RentalGuardian Damage Claims resources. Try asking about filing a claim, required photos, file upload limits, claim tracking in mySedgwick, payments and direct deposit, or how to contact support."
  }
  const body = matches.map((m) => `**${m.question}**\n${m.answer}`).join('\n\n')
  return `${body}\n\nFor anything else, contact RentalGuardian Support at support@rentalguardian.com or (888) 885-5550 (Prompt 2).`
}

// Stream a final answer string back in the UI message stream protocol.
function respondWith(answer: string) {
  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      const id = 'msg-' + Date.now()
      writer.write({ type: 'text-start', id })
      writer.write({ type: 'text-delta', id, delta: answer })
      writer.write({ type: 'text-end', id })
    },
  })
  return createUIMessageStreamResponse({ stream })
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()
  const latestQuestion = getUIMessageText(messages[messages.length - 1])

  // Gather current content from all resources (PowerPoint + PDF).
  let presentationContext = ''
  try {
    const resources = await getAllResourceContent()
    presentationContext = resources
      .map((r) => `=== Resource: ${r.title} ===\n${r.text}`)
      .join('\n\n')
  } catch (error) {
    console.error('[v0] Error building presentation context:', error)
  }

  const systemPrompt = `You are a helpful assistant for RentalGuardian's Learning Library. You help clients understand the training resources and answer questions about RentalGuardian's damage claims process, products, and services.

${
    presentationContext
      ? `Here is the content from the current resources that you can reference to answer questions:

${presentationContext}

When answering questions:
- Reference specific information from the resources when relevant
- If you don't find the answer in the resources, let the user know
- Be friendly and professional
- Keep responses clear and concise`
      : 'No resources have been uploaded yet. Please let the user know they can upload resources to get answers based on that content.'
  }
`

  // Attempt live AI generation. Buffer the output so that if the AI Gateway is
  // unavailable (e.g. billing/credits), we can fall back cleanly to curated
  // answers instead of returning a broken stream.
  try {
    const result = streamText({
      model: 'openai/gpt-4o-mini',
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      abortSignal: req.signal,
    })

    let answer = ''
    for await (const chunk of result.textStream) {
      answer += chunk
    }

    if (answer.trim().length > 0) {
      return respondWith(answer)
    }
    return respondWith(buildFallbackAnswer(latestQuestion))
  } catch (error) {
    console.error('[v0] Chat model unavailable, using fallback:', error)
    return respondWith(buildFallbackAnswer(latestQuestion))
  }
}
