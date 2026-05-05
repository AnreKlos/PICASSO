export const moodConfig = {
  meta: {
    slug: 'mood',
    brand: {
      name: 'MOOD',
      shortName: 'MOOD',
      slug: 'mood',
      tagline: ''
    },
    name: 'MOOD',
    fullName: 'MOOD — beauty',
    tagline: 'beauty',
    city: 'Московский пр.'
  },
  contacts: {
    phone: '8317037-1377',
    phoneRaw: '83170371377',
    phones: [
      '8317037-1377',
      '86184945407',
      '+7 999 705 00 04'
    ],
    whatsapp: '83170371377',
    address: 'Брянск, Московский просп., 10/11',
    additionalAddresses: [],
    workingHours: 'Закрыто до 10:00 AM',
    vk: ''
  },
  booking: {},
  social: [],
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
    EASE: [
      0.16,
      1,
      0.3,
      1
    ]
  },
  legal: {
    showInFooter: true,
    placeholder: 'Реквизиты предоставим при заключении договора'
  },
  content: {
    promotion: {
      title: 'Особое предложение для новых клиентов',
      text: 'Оставьте заявку — администратор подберет подходящую услугу и удобное время визита.'
    }
  },
  sectionsOrder: [
    'hero',
    'promotion',
    'services',
    'gallery',
    'team',
    'reviews',
    'about',
    'faq',
    'bookingContacts'
  ],
  copyrightYear: 2026,
  sections: {
    hero: {
      enabled: true,
      image: '',
      titleLine1: 'Сеть салонов',
      titleLine1Small: 'красоты в Московский пр.',
      titleLine1SmallSize: 'default',
      titleLine2: 'MOOD',
      topLabel: 'Московский пр. · онлайн-запись',
      lead: 'Профессиональные услуги в нескольких локациях города.'
    },
    promotion: {
      enabled: true
    },
    serviceCarousel: {
      enabled: false,
      items: []
    },
    services: {
      enabled: true,
      items: [
        {
          title: 'Mood5Стрижка: от',
          short: 'Mood5Стрижка: от',
          description: 'Работа по форме лица и структуре волос с фиксацией результата.',
          priceFrom: '500 ₽'
        }
      ]
    },
    gallery: {
      enabled: false,
      title: 'Наши работы',
      subtitle: 'Каждая деталь имеет значение',
      items: []
    },
    team: {
      enabled: false,
      items: []
    },
    reels: {
      enabled: false,
      items: []
    },
    reviews: {
      enabled: false,
      items: []
    },
    about: {
      enabled: false,
      showImages: false,
      text: '',
      images: []
    },
    faq: {
      enabled: false,
      items: []
    },
    bookingContacts: {
      enabled: true,
      showMap: true
    }
  },
  features: {
    chatWidget: {
      enabled: true,
      tooltipDelayMs: 8000,
      mountDelayMs: 3000,
      greeting: 'Здравствуйте! Я цифровой консьерж {{brandName}}. Чем могу помочь?'
    }
  },
  block_flags: {
    hero: true,
    gallery: false,
    team: false,
    services: true,
    faq: false,
    reviews: true,
    about: false,
    contacts: true,
    promotions: true
  }
};

export default moodConfig;
