export interface QAItem {
  question: string
  answer: string
}

/**
 * Curated FAQs derived from the current RentalGuardian Learning Library
 * resources: "Damage Claims FAQs", "Home Guardian Overview", "Travel Guardian
 * Overview", "Billing Overview", and the "Past Due Balance Resolution Guide".
 * Used as a reliable, up-to-date source for the FAQ section and the chat
 * assistant whenever live AI is unavailable.
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
      'The current process does not have a specific submission deadline—claims should be reported as soon as reasonably practical after a loss is discovered. You must include at least 2 photos (the damaged item and a related invoice/receipt) to proceed, and after submission you should allow up to 24 hours before tracking your claim.',
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
      'For assistance, contact RentalGuardian Support at support@rentalguardian.com or (888) 885-5550 (Prompt 2), available Mon–Sat, 8:30 AM–5:30 PM EST. For technical questions about a claim submission, contact 860.626.9943 or Robin.Doran@sedgwick.com, or reach your assigned examiner through the mySedgwick claims tracking portal. For travel insurance claims, travelers can reach the travel claims team at 833-610-0736 (Prompts 1, 1, 3).',
  },
  {
    question: 'What is Home Guardian Plus and what does it cover?',
    answer:
      'Home Guardian Plus is a damage and liability protection program for short-term and vacation rentals that protects both property managers and homeowners against accidental guest-caused damage. It includes four types of protection: Contents ($500–$25,000, e.g. damaged TVs, furniture, appliances, carpet stains), Liability (up to $1,000,000 for guest bodily injury claims), Real Property (up to $1,000,000 for major dwelling damage like kitchen fires or water overflows), and Bed Bug (up to $15,000 for extermination, soft-furnishing replacement, and lost rental income after 72 hours).',
  },
  {
    question: 'How are Home Guardian liability claims handled?',
    answer:
      'Liability claims are adjudicated by a third-party adjudicator. Unlike contents claims, RentalGuardian does not have direct access to liability claim status—the adjudicator will reach out to you, or you can contact support@rentalguardian.com for updates.',
  },
  {
    question: 'What documentation is required for a Home Guardian damage claim?',
    answer:
      'Provide dated photographs of the damage, a paid invoice or receipt for the repair or replacement showing a $0 balance due, pre-approval review if required for the claim type, records confirming the date the guest caused the damage, and dated documentation for late or extended claims. Non-occupant theft claims require a copy of a police report, and mysterious disappearance or theft may not be a covered peril.',
  },
  {
    question: 'What should I know to submit a successful Home Guardian claim?',
    answer:
      'Claims must reflect accidental guest-caused damage tied to a valid reservation, and only 1 claim is allowed per reservation—wait until the guest checks out if there are multiple damages. Smoking or excessive-cleaning claims may require proof of the rental agreement, and you should review your address details if you are not enrolled in ACH payments. Under the principle of indemnity, claims are approved at the replacement cost of the damaged item for like kind, quality, and value—upgrades are allowed but are not covered beyond that amount.',
  },
  {
    question: 'What travel insurance products does RentalGuardian offer?',
    answer:
      'There are two products. Base Travel Protection reimburses up to 100% of non-refundable trip costs for Trip Cancellation, Trip Interruption, and Trip Delay across 30+ covered reasons (such as illness, injury, medical emergencies, death in the family, and natural disasters; coverage can vary by state). Cancel For Any Reason (CFAR) is an optional enhancement that reimburses up to 60% of non-refundable trip costs; the traveler must cancel at least 48 hours before check-in, and it is available to U.S. and Canadian residents only (not New York, Puerto Rico, the U.S. Virgin Islands, or international residents).',
  },
  {
    question: 'When can travelers purchase or change travel insurance?',
    answer:
      'Base Travel Protection can be purchased up to 24 hours before the trip start date, even if the guest did not buy it at booking. CFAR must be purchased within 14 days of the original booking (the date of first deposit). Travelers have a 15-day free look period for a full premium refund; after that, payment is final, and no changes or refunds are allowed once check-in happens. If the trip cost increases, have the traveler contact support@rentalguardian.com to increase the policy before the trip start date. Each reseller also has a co-branded microsite for initial and second-chance purchases.',
  },
  {
    question: 'Who owns a travel policy, and can resellers see claim details?',
    answer:
      'The traveler is the named insured and owns the policy—all claim decisions, communications, and payments go to the traveler. Because of HIPAA and privacy requirements, resellers and property management companies cannot access claim details. Resellers can direct travelers to the travel claims team at 833-610-0736 (Prompts 1, 1, 3) and encourage prompt filing; travelers may choose to share their status with you.',
  },
  {
    question: 'How do travel claims work, and what are common exclusions?',
    answer:
      'The traveler files and updates the claim by phone, online, or digitally, and each update can take up to 15 business days (longer in peak seasons like hurricane season). Proof of payment, proof of cancellation, and traveler details are required, and payments are typically issued to the traveler. Common exclusions include policies purchased after a named storm or after the trip was already cancelled, pre-existing medical conditions, acts of war, and trips booked with credit card points or loyalty rewards. Neither RentalGuardian nor resellers can guarantee a claim outcome, and premiums for denied claims are non-refundable.',
  },
  {
    question: 'When is Damage Protection billed?',
    answer:
      'Damage Protection is billed in the month the reservation checks in—a stay booked weeks or months ahead is not charged until the month the guest arrives, because billing is tied to when coverage is active. It covers short- and mid-term stays (long-term stays are not part of the model). Charges apply per coverage period based on your selected level, and longer stays are billed in installments (for example, a 30-day product covering a 60-day stay is billed as two 30-day installments), up to the maximum allowable stay of 180 days.',
  },
  {
    question: 'When is Travel Protection billed, and how does compensation work?',
    answer:
      'Travel Protection is billed in the month the policy is booked (based on the booking date, not the stay date). For microsite bookings, the traveler is charged immediately by RentalGuardian and compensation to the property manager is issued the following month via paper check by default (contact accounting@insurestays.com for ACH). For PMC bookings, the property manager collects funds from the traveler and RentalGuardian bills them that same month—you keep the difference as your compensation.',
  },
  {
    question: 'How is Booking Guardian billed, and can it be canceled?',
    answer:
      'Booking Guardian coverage is applied to every booking (including rebookings) and is charged at check-in, billed in the month of check-in. Once placed, it cannot be removed or canceled and stays active for the entire reservation.',
  },
  {
    question: 'What are the refund and cancellation rules for each product?',
    answer:
      'Damage Protection cancellations are accepted up to 1 day before check-in with proof; same-day and post-check-in requests are automatically denied. Travel Protection offers a Free Look Period (often 15 days from purchase, per policy) during which travelers can cancel for a full refund—within this window you can also add travelers by cancelling and reissuing (max 10 per policy). After the free look period, policies cannot be decreased or canceled, though you may increase the trip cost and collect the difference from the guest. Booking Guardian does not accept any refunds or cancellations.',
  },
  {
    question: 'How must Travel Protection premiums be handled (trust accounting)?',
    answer:
      'Per Section 8 of the Coverage Authorization Agreement, program premiums held prior to remittance are held in trust and must be kept in a separate trust account—never commingled with other funds. This fiduciary responsibility ensures timely remittance, and insurance premiums are non-refundable and should stay separate from trip costs.',
  },
  {
    question: 'What payment methods are used and when are payments processed?',
    answer:
      'Effective mid-2025, all new clients are enrolled in automated billing via credit card or ACH, and RentalGuardian strongly recommends ACH to streamline payments and eliminate paper checks. All payments are processed on the last day of each month, and a sales receipt detailing what was billed is sent to the account\'s accounting contact. You can enroll in ACH at rentalguardian.com/ach-form.',
  },
  {
    question: 'How do I view my billing details in the portal?',
    answer:
      'Sign in to the RentalGuardian portal and click the blue "Pay Now" button on the dashboard to open a running invoice anytime. You can see an account snapshot (name, total balance due, account number), filter transactions by All Due, Past 12 Months, Year to Date, or a custom date range, review each policy\'s details, and use Export Policies to download the list. Pay Now can be used to review billing at any time without making a payment, and changing the range only changes the view—not your balance.',
  },
  {
    question: 'Who do I contact for billing questions?',
    answer:
      'For general billing inquiries, contact the RentalGuardian Support team at support@rentalguardian.com. For escalated billing or invoicing requests, contact accounting@insurestays.com. This billing structure applies consistently across all RentalGuardian clients and products.',
  },
  {
    question: 'How do I resolve a past-due balance?',
    answer:
      'Sign in to the RentalGuardian portal and click the blue "Pay Now" button on the dashboard to open your running invoice and review the amount due. Submit payment using your enrolled method—credit card or ACH (ACH is strongly recommended; enroll at rentalguardian.com/ach-form). The interactive Past Due Balance Resolution Guide in the Billing and Payments section walks through each step, and you can contact support@rentalguardian.com or (888) 885-5550 (Prompt 2) for help.',
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
