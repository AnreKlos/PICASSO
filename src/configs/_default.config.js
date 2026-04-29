export const defaultConfig = {
  meta: {
    slug: 'picasso',
    name: 'PICASSO',
    brand: {
      name: 'PICASSO',
      slug: 'picasso',
    },
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
    coordinates: { lat: 53.227, lng: 34.31 },
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
    policyUrl: null,
  },

  content: {
    promotion: {
      title: 'Особое предложение',
      text: 'Для новых клиентов — приятный бонус при первой записи. Узнайте подробности у нашего консьержа или по телефону.',
    },
  },

  copyrightYear: 2026,

  sections: {
    hero: {
      enabled: true,
      photo: '/images/hair/hair_1.webp',
      titleLine1: 'Салон эстетики',
      cityLine: 'в Брянске',
      lead: 'Макияж, маникюр, брови и уход — всё в одном месте. Запишитесь онлайн за 30 секунд.',
      ctaLabel: 'Записаться',
    },
    advantages: { enabled: true },
    promotion: { enabled: true },
    services: {
      enabled: true,
      items: [
        { title: 'Макияж', short: 'Дневной и вечерний', priceFrom: 'от 2 000 ₽' },
        { title: 'Маникюр', short: 'С покрытием гель-лак', priceFrom: 'от 1 500 ₽' },
        { title: 'Оформление бровей', short: 'Коррекция и окрашивание', priceFrom: 'от 800 ₽' },
      ],
    },
    gallery: {
      enabled: true,
      items: [
        '/images/hair/hair_1.webp',
        '/images/hair/hair_2.webp',
        '/images/hair/hair_3.webp',
      ],
    },
    beforeAfter: { enabled: false, items: [] },
    team: { enabled: true },
    reviews: {
      enabled: true,
      items: [
        { author: 'Анна', text: 'Прекрасный салон, всё на высшем уровне. Буду приходить снова!' },
        { author: 'Мария', text: 'Мастера очень внимательны к деталям. Результат превзошёл ожидания.' },
      ],
    },
    about: {
      enabled: true,
      text: 'Салон эстетики PICASSO — место где каждая деталь вашего образа продумана до мелочей. Работаем только с проверенными материалами.',
    },
    faq: { enabled: true },
    bookingContacts: { enabled: true },
  },

  features: {
    chatWidget: {
      enabled: true,
      tooltipDelayMs: 8000,
      mountDelayMs: 3000,
      greeting: 'Здравствуйте! Я цифровой консьерж {{brandName}}. Чем могу помочь?',
    },
  },
}

export default defaultConfig;
