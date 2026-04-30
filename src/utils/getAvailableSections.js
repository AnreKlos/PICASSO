/**
 * Returns available sections for navigation based on config and data
 * MVP skeleton: Nav, Hero, at least one service block, Gallery, Reviews, FAQ, BookingContacts, Footer, StickyBar
 */

import { getSectionOrder } from './getSectionOrder'

export function getAvailableSections(config) {
  const { sections = {}, block_flags = {} } = config
  const sectionOrder = getSectionOrder(config)

  // Helper to check if section is enabled by block_flags
  const isBlockEnabled = (blockKey) => block_flags[blockKey] !== false

  // Helper to check section enabled property
  const isSectionEnabled = (sectionKey) => sections[sectionKey]?.enabled !== false

  // Build metadata map for all sections
  const sectionMetadata = {}

  // === Services (carousel or regular) ===
  const hasServiceCarousel = isSectionEnabled('serviceCarousel') &&
    Array.isArray(sections.serviceCarousel?.items) &&
    sections.serviceCarousel.items.length >= 3

  const hasServices = isSectionEnabled('services') &&
    Array.isArray(sections.services?.items) &&
    sections.services.items.length >= 3

  if (hasServiceCarousel || hasServices) {
    sectionMetadata['services'] = {
      key: 'services',
      label: 'Прайс',
      anchorId: 'prices',
      enabled: true,
      inNav: true,
      hasData: true
    }
  }

  // === Gallery (minimum 3 photos) ===
  const galleryItems = Array.isArray(sections.gallery?.items)
    ? sections.gallery.items
    : []
  const hasGallery = isBlockEnabled('gallery') &&
    isSectionEnabled('gallery') &&
    galleryItems.length >= 3

  if (hasGallery) {
    sectionMetadata['gallery'] = {
      key: 'gallery',
      label: 'Работы',
      anchorId: 'gallery-section',
      enabled: true,
      inNav: true,
      hasData: true
    }
  }

  // === Reviews (minimum 2 reviews) ===
  const reviewsItems = Array.isArray(sections.reviews?.items)
    ? sections.reviews.items
    : []
  const hasReviews = isBlockEnabled('reviews') &&
    isSectionEnabled('reviews') &&
    reviewsItems.length >= 2

  if (hasReviews) {
    sectionMetadata['reviews'] = {
      key: 'reviews',
      label: 'Отзывы',
      anchorId: 'reviews-section',
      enabled: true,
      inNav: true,
      hasData: true
    }
  }

  // === FAQ (always available in MVP) ===
  const hasFaq = isBlockEnabled('faq') &&
    isSectionEnabled('faq')

  if (hasFaq) {
    sectionMetadata['faq'] = {
      key: 'faq',
      label: 'FAQ',
      anchorId: 'faq-section',
      enabled: true,
      inNav: true,
      hasData: true
    }
  }

  // === About (optional) ===
  const aboutText = sections.about?.text
  const hasAbout = isBlockEnabled('about') &&
    isSectionEnabled('about') &&
    aboutText && aboutText.trim().length >= 20

  if (hasAbout) {
    sectionMetadata['about'] = {
      key: 'about',
      label: 'О салоне',
      anchorId: 'about-section',
      enabled: true,
      inNav: true,
      hasData: true
    }
  }

  // === Team (optional, minimum 1 master) ===
  const team = Array.isArray(config.team) ? config.team : []
  const realTeam = team.filter(item => item?.name)
  const hasTeam = isBlockEnabled('team') &&
    isSectionEnabled('team') &&
    realTeam.length >= 1

  if (hasTeam) {
    sectionMetadata['team'] = {
      key: 'team',
      label: 'Мастера',
      anchorId: 'team-section',
      enabled: true,
      inNav: true,
      hasData: true
    }
  }

  // === BeforeAfter (optional) ===
  const beforeAfterItems = Array.isArray(sections.beforeAfter?.items)
    ? sections.beforeAfter.items
    : []
  const hasBeforeAfter = isBlockEnabled('beforeAfter') &&
    isSectionEnabled('beforeAfter') &&
    beforeAfterItems.length >= 1

  if (hasBeforeAfter) {
    sectionMetadata['beforeAfter'] = {
      key: 'beforeAfter',
      label: 'До/после',
      anchorId: 'beforeAfter-section',
      enabled: true,
      inNav: true,
      hasData: true
    }
  }

  // === Reels (optional) ===
  const reelsItems = Array.isArray(sections.reels?.items)
    ? sections.reels.items
    : []
  const hasReels = isSectionEnabled('reels') &&
    reelsItems.length >= 1

  if (hasReels) {
    sectionMetadata['reels'] = {
      key: 'reels',
      label: 'Reels',
      anchorId: 'reels-section',
      enabled: true,
      inNav: false, // Usually not in nav
      hasData: true
    }
  }

  // === Promotion (optional, not in nav) ===
  const promotionTitle = sections.promotion?.title
  const promotionText = sections.promotion?.text
  const hasPromotion = isBlockEnabled('promotions') &&
    isSectionEnabled('promotion') &&
    (promotionTitle || promotionText)

  if (hasPromotion) {
    sectionMetadata['promotion'] = {
      key: 'promotion',
      label: 'Акция',
      anchorId: 'promotion-section',
      enabled: true,
      inNav: false,
      hasData: true
    }
  }

  // === Advantages (not in nav) ===
  const hasAdvantages = isSectionEnabled('advantages')
  if (hasAdvantages) {
    sectionMetadata['advantages'] = {
      key: 'advantages',
      label: 'Преимущества',
      anchorId: 'advantages-section',
      enabled: true,
      inNav: false,
      hasData: true
    }
  }

  // === Hero (always, not in nav) ===
  sectionMetadata['hero'] = {
    key: 'hero',
    label: 'Hero',
    anchorId: 'hero-section',
    enabled: true,
    inNav: false,
    hasData: true
  }

  // === BookingContacts (always) ===
  sectionMetadata['bookingContacts'] = {
    key: 'bookingContacts',
    label: 'Запись',
    anchorId: 'bookingContacts-section',
    enabled: true,
    inNav: false, // Has separate CTA button
    hasData: true
  }

  // === ServiceCarousel (alias for services nav, if exists) ===
  if (hasServiceCarousel) {
    sectionMetadata['serviceCarousel'] = {
      key: 'serviceCarousel',
      label: 'Услуги',
      anchorId: 'service-carousel',
      enabled: true,
      inNav: true,
      hasData: true
    }
  }

  // Build final array following sectionOrder
  const available = []
  const seenKeys = new Set()

  for (const sectionKey of sectionOrder) {
    // Direct match
    if (sectionMetadata[sectionKey] && !seenKeys.has(sectionKey)) {
      available.push(sectionMetadata[sectionKey])
      seenKeys.add(sectionKey)
    }
    // Handle serviceCarousel -> services alias for nav
    if (sectionKey === 'serviceCarousel' && sectionMetadata['services'] && !seenKeys.has('services')) {
      available.push(sectionMetadata['services'])
      seenKeys.add('services')
    }
  }

  // Add any remaining sections not in sectionOrder (append at end)
  for (const [key, metadata] of Object.entries(sectionMetadata)) {
    if (!seenKeys.has(key)) {
      available.push(metadata)
    }
  }

  return available
}

/**
 * Returns nav items (sections that should appear in navigation menu)
 */
export function getNavItems(config) {
  const available = getAvailableSections(config)
  return available.filter(section => section.inNav)
}
