/**
 * Returns the effective section order for the template.
 * Uses config.sectionsOrder if provided, otherwise falls back to DEFAULT_SECTIONS_ORDER.
 * This is the single source of truth for section order used by both
 * BeautyTemplate (rendering) and getAvailableSections (navigation).
 */

const DEFAULT_SECTIONS_ORDER = [
  'hero',
  'advantages',
  'about',
  'serviceCarousel',
  'services',
  'gallery',
  'reviews',
  'faq',
  'bookingContacts',
]

export function getSectionOrder(config) {
  if (Array.isArray(config.sectionsOrder) && config.sectionsOrder.length > 0) {
    return config.sectionsOrder
  }
  return DEFAULT_SECTIONS_ORDER
}
