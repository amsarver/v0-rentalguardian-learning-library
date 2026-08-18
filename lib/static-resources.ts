import type { CategoryId } from './categories'

/**
 * Resources that are not stored in Blob storage (e.g. interactive, externally
 * hosted guides) but still belong in the Learning Library. Defined once here so
 * that:
 *   1. the library UI can display them, and
 *   2. the FAQ generator and chat assistant stay synced to their content via
 *      `getAllResourceContent()`.
 *
 * The `content` field is the plain-text description of the resource that feeds
 * the AI + FAQ pipeline (interactive demos can't be scraped server-side, so we
 * describe their substance here, grounded in the current billing resources).
 */
export interface StaticResource {
  url: string
  pathname: string
  title: string
  fileType: 'link'
  category: CategoryId
  content: string
}

export const STATIC_RESOURCES: StaticResource[] = [
  {
    url: 'https://inhabit.navattic.com/e4110c9g?g=cms6heh46000000iq8m2lno3w&s=0',
    pathname: 'static/past-due-balance-resolution-guide',
    title: 'Past Due Balance Resolution Guide',
    fileType: 'link',
    category: 'billing',
    content: `The Past Due Balance Resolution Guide is an interactive, step-by-step walkthrough that shows RentalGuardian clients how to review and pay a past-due (overdue) balance in the RentalGuardian portal. It complements the Billing Overview by demonstrating the actual steps involved.

Key steps and information covered:
- Sign in to the RentalGuardian portal and locate any past-due or outstanding balance from the dashboard.
- Click the blue "Pay Now" button on the dashboard to open your running invoice and review the amount due. You can filter transactions by All Due, Past 12 Months, Year to Date, or a custom date range, and review each policy's details.
- Submit a payment for the outstanding balance using an enrolled payment method (credit card or ACH). RentalGuardian strongly recommends ACH to streamline payments and eliminate paper checks; you can enroll in ACH at rentalguardian.com/ach-form.
- All payments are processed on the last day of each month, and a sales receipt detailing what was billed is sent to the account's accounting contact.
- For help resolving a past-due balance, contact RentalGuardian Support at support@rentalguardian.com or (888) 885-5550 (Prompt 2). For escalated billing or invoicing requests, contact accounting@insurestays.com.`,
  },
]
