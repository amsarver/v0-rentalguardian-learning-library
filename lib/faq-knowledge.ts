export interface QAItem {
  question: string
  answer: string
}

/**
 * Curated FAQs derived from the current RentalGuardian Learning Library
 * resources: "How to Submit a Damage Claim", "Home Guardian Overview", "Travel Guardian
 * Overview", "Billing Overview", and the "Past Due Balance Resolution Guide".
 * Used as a reliable, up-to-date source for the FAQ section and the chat
 * assistant whenever live AI is unavailable.
 */
export const CURATED_FAQS: QAItem[] = [
  {
    question: 'What do I need before starting a damage claim?',
    answer:
      'Have the following ready: reservation details, payee contact information, incident details, the repair or replacement cost, dated photos of the damage, and a paid invoice or receipt showing payment in full.',
  },
  {
    question: 'How do I start a damage claim in the RentalGuardian Portal?',
    answer:
      'Log in to the RentalGuardian Property Manager Portal and select the Claims button on the main dashboard. Locate the reservation coverage by choosing a Search Field, entering the Search Value, and clicking Search, then click Open Claim to begin.',
  },
  {
    question: 'How do I find the reservation coverage for a claim?',
    answer:
      'You can search by Booking/Reservation Number, Record ID, Certificate Number, Customer Name, Customer Phone Number, or Customer Email Address. Most property management companies find the Booking/Reservation Number to be the quickest and most accurate search method.',
  },
  {
    question: 'What sections are in the claim submission?',
    answer:
      'There are four sections, and each must be completed before the claim is submitted: (1) Contact Information, (2) Incident Details, (3) Documentation, and (4) Submission.',
  },
  {
    question: 'What contact information is required?',
    answer:
      'Enter the payee information exactly as it should appear for claim payment: the full name of the individual or business receiving payment, the complete mailing address where payment should be sent, and an email address. That email address will receive all future claim correspondence and status updates.',
  },
  {
    question: 'What incident details should I provide?',
    answer:
      'Include who discovered the damage, the date it was discovered, the total repair or replacement cost, a description of the damage, and how it was repaired or replaced. The more detailed and accurate the information, the faster the claim can be evaluated and processed.',
  },
  {
    question: 'What documentation is required for a damage claim?',
    answer:
      'At minimum, upload at least one dated photograph showing the damage and at least one invoice or receipt showing payment made in full with no remaining balance. Recommended extras include multiple photos, before-and-after photos, additional receipts or contractor documentation, and any communication that supports the claim.',
  },
  {
    question: 'What should I check before submitting, and what happens next?',
    answer:
      'Confirm the payee information, mailing address, and email are accurate; the incident details and repair or replacement cost are complete; required documentation is uploaded; and any required acknowledgment or initials are completed. After submission the claim enters review, and status updates are sent to the email address provided in Section 1.',
  },
  {
    question: 'How can I help my claim get processed faster?',
    answer:
      'Make sure photos are clear and dated, receipts show payment in full, damage descriptions are detailed and specific, contact information is complete and accurate, and all supporting evidence is uploaded before you submit.',
  },
  {
    question: 'Who do I contact for help?',
    answer:
      'For assistance, contact RentalGuardian Support at support@rentalguardian.com or (888) 885-5550 (Prompt 2), available Mon–Sat, 8:30 AM–5:30 PM EST. For travel insurance claims, travelers can reach the travel claims team at 833-610-0736 (Prompts 1, 1, 3).',
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
