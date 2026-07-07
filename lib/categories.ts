export type CategoryId = 'damage' | 'travel' | 'billing'

export interface Category {
  id: CategoryId
  label: string
  description: string
}

export const CATEGORIES: Category[] = [
  {
    id: 'damage',
    label: 'Damage Protection Resources',
    description: 'Guides and training for the damage claims process and related coverage.',
  },
  {
    id: 'travel',
    label: 'Travel Protection Resources',
    description: 'Materials covering travel protection products and traveler support.',
  },
  {
    id: 'billing',
    label: 'Billing and Payments',
    description: 'Billing and payment resources for all RentalGuardian clients.',
  },
]

export const DEFAULT_CATEGORY: CategoryId = 'damage'

const CATEGORY_STORAGE_KEY = 'rg-categories'

/**
 * Infer a sensible default category from a presentation's title.
 * Falls back to the default category when no keywords match.
 */
export function inferCategory(title: string): CategoryId {
  const normalized = title.toLowerCase()
  if (/(billing|payment|payments|invoice|invoicing|pay|payout)/.test(normalized)) {
    return 'billing'
  }
  if (/(travel|trip|traveler|traveller)/.test(normalized)) {
    return 'travel'
  }
  if (/(damage|claim|claims|sedgwick|portal)/.test(normalized)) {
    return 'damage'
  }
  return DEFAULT_CATEGORY
}

/** Read the stored category overrides (keyed by presentation URL). */
export function getStoredCategories(): Record<string, CategoryId> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(CATEGORY_STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

/** Persist a category assignment for a given presentation URL. */
export function setStoredCategory(url: string, category: CategoryId) {
  if (typeof window === 'undefined') return
  const current = getStoredCategories()
  current[url] = category
  localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(current))
}

/** Resolve the category for a presentation: stored override wins, else inferred. */
export function resolveCategory(url: string, title: string): CategoryId {
  const stored = getStoredCategories()
  return stored[url] || inferCategory(title)
}
