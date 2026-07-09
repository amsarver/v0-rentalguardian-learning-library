export interface QAItem {
  question: string
  answer: string
}

/**
 * Curated FAQs derived from the current RentalGuardian Damage Claims resources:
 * the "Damage Claims FAQ" (Last Updated July 2026) and the "RentalGuardian
 * Damage Claims Portal Training" guide. Used as a reliable, up-to-date source
 * for the FAQ section and the chat assistant whenever live AI is unavailable.
 */
export const CURATED_FAQS: QAItem[] = [
  {
    question: 'What is the RentalGuardian Damage Claims Portal for?',
    answer:
      'It is used to submit a damage claim for guest-caused accidental damage that occurred during a stay. The guided portal collects all the details needed to review and process your claim, and is powered by a claims submission tool called Smart.ly.',
  },
  {
    question: 'Who should complete the claim, and what do I need before starting?',
    answer:
      'The property owner, manager, or authorized representative reporting the damage should complete the form. Have ready: when the damage was reported, the related reservation/booking details, property/unit information, a description of the damage, and supporting documentation such as photos, invoices, and receipts.',
  },
  {
    question: 'How long does it take, and can I save my progress?',
    answer:
      'The guided, step-by-step form takes about 10 minutes when your information is prepared in advance. The portal does not save progress—if the session is idle for more than 20 minutes, you must close the URL and start again.',
  },
  {
    question: 'When do I need to submit my claim?',
    answer:
      'Submit your claim within 14 days after the guest checks out, and you can share any additional details within 45 days after checkout. You must include at least 2 photos (the damaged item and a related invoice/receipt) to proceed.',
  },
  {
    question: 'What files can I upload, and are there size limits?',
    answer:
      'Smart.ly supports images (JPG, JPEG, PNG, GIF) and documents (PDF, DOC, DOCX, TXT). Each file must be 6 MB or smaller, and all uploaded files together must stay under 29 MB. Videos are not supported—capture clear screenshots instead and notify your adjudicator if additional video evidence is available.',
  },
  {
    question: 'What happens after I submit my claim, and does AI decide the outcome?',
    answer:
      'Allow up to 24 hours for an adjuster to review and link your claim to the appropriate policy, after which you receive a claim number. No—AI does not approve or deny claims; all claim decisions are made by a Sedgwick examiner.',
  },
  {
    question: 'How do I track my claim and get updates?',
    answer:
      'Once you have a claim number, register and log in to the mySedgwick claim portal using your claim number along with your last name and address (city, state, and postal code). There you can track your claim status, receive updates, and communicate directly with your assigned examiner.',
  },
  {
    question: 'How are approved claims paid, and how do I enroll in direct deposit?',
    answer:
      'Payments are issued directly by Sedgwick after the claim is finalized. In the claim portal, go to Direct Deposit Enrollment and choose Electronic Payment (direct deposit) or Mail (Mail is the default if no preference is selected). For direct deposit, provide your bank routing and account numbers, then authorize and submit—processing takes 7–10 business days.',
  },
  {
    question: 'What should I do if I made a mistake or my upload failed?',
    answer:
      'If you made a mistake, contact your examiner on mySedgwick immediately with the corrected information. If an upload fails, confirm each file is under 6 MB (and all files under 29 MB total), retry the upload, and contact support if the issue persists.',
  },
  {
    question: 'Who do I contact for help?',
    answer:
      'For assistance, contact RentalGuardian Support at support@rentalguardian.com or (888) 885-5550 (Prompt 2), available Mon–Sat, 8:30 AM–5:30 PM EST. For technical questions about a claim submission, contact 860.626.9943 or Robin.Doran@sedgwick.com, or reach your assigned examiner through the mySedgwick claims tracking portal.',
  },
]

/**
 * Very lightweight keyword retrieval used by the chat assistant when live AI is
 * unavailable. Returns the most relevant curated FAQ answers for a question.
 */
export function findRelevantFaqs(query: string, limit = 3): QAItem[] {
  const stopwords = new Set([
    'the', 'a', 'an', 'is', 'are', 'do', 'i', 'to', 'for', 'of', 'and', 'my',
    'how', 'what', 'when', 'who', 'can', 'you', 'me', 'in', 'on', 'it', 'this',
    'that', 'with', 'get', 'need', 'should', 'if', 'or', 'be', 'will',
  ])
  const terms = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2 && !stopwords.has(t))

  if (terms.length === 0) return []

  const scored = CURATED_FAQS.map((faq) => {
    const haystack = `${faq.question} ${faq.answer}`.toLowerCase()
    let score = 0
    for (const term of terms) {
      if (haystack.includes(term)) score += 1
    }
    return { faq, score }
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, limit).map((s) => s.faq)
}
