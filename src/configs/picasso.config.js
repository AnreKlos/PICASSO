export const picassoConfig = {
  meta: {
    name: 'PICASSO',
    fullName: 'Салон эстетики PICASSO',
    tagline: 'Premium Beauty Studio',
    city: 'Брянск',
  },

  contacts: {
    phone: '+7 (920) 851-01-05',
    phoneRaw: '+79208510105',
    address: 'г. Брянск, Московский просп., 106',
    addressNote: 'вход с улицы',
    hours: 'Ежедневно 10:00 — 19:00',
    hoursNote: 'Без выходных',
    whatsapp: '+79208510105',
    coordinates: { lat: null, lng: null },
  },

  social: [
    { href: 'https://vk.com/picasso_salon', label: 'ВКонтакте PICASSO', short: 'VK' },
    { href: 'https://instagram.com/picasso_salon', label: 'Instagram PICASSO', short: 'IG' },
  ],

  tokens: {
    GOLD: '#C9A87A',
    GOLD_DIM: '#A68B5A',
    GOLD_BRIGHT: '#D4B88A',
    TEXT: '#F0EBE3',
    TEXT_SOFT: '#B5AFA7',
    MUTED: '#9A938B',
    BG: '#0E0C0B',
    CHOCOLATE: '#151210',
    SURFACE: '#1A1714',
    SURFACE_L: '#262220',
    BORDER: 'rgba(255,255,255,0.06)',
    BORDER_H: 'rgba(255,255,255,0.14)',
    EASE: [0.16, 1, 0.3, 1],
  },

  legal: {
    showInFooter: true,
    placeholder: 'Реквизиты предоставим при заключении договора',
  },

  content: {
    promotion: {
      title: 'Особое предложение',
      text: 'Для новых клиентов — приятный бонус при первой записи. Узнайте подробности у нашего консьержа или по телефону.',
    },
  },

  copyrightYear: 2026,

  sections: {
    hero: { enabled: true },
    advantages: { enabled: true },
    promotion: { enabled: true },
    services: { enabled: true },
    gallery: { enabled: true },
    team: { enabled: true },
    reviews: { enabled: true },
    about: { enabled: true },
    faq: { enabled: true },
    bookingContacts: { enabled: true },
  },

  features: {
    chatWidget: {
      enabled: true,
      tooltipDelayMs: 8000,
      mountDelayMs: 3000,
    },
  },
}

export default picassoConfig;
