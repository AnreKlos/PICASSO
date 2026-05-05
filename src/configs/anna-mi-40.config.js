export const annaMiConfig = {
  meta: {
    slug: 'anna-mi',
    brand: {
      name: 'Анна-Mi',
      shortName: 'Анна-Mi',
      slug: 'anna-mi',
      tagline: ''
    },
    name: 'Анна-Mi',
    fullName: 'Анна-Mi — beauty',
    tagline: 'beauty',
    city: 'Брянск'
  },
  contacts: {
    phone: '',
    phoneRaw: '',
    phones: [],
    whatsapp: '',
    address: 'Брянск, ул. Богдана Хмельницкого, 16',
    additionalAddresses: [],
    workingHours: 'Закрыто до 9:00 AM',
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
      titleLine1: 'Моностудия',
      titleLine1Small: 'по созданию образа',
      titleLine1SmallSize: 'default',
      titleLine2: 'Анна-Mi',
      topLabel: 'Премиум студия красоты',
      lead: 'Подчеркнем вашу индивидуальность и соберем образ под событие и настроение.'
    },
    promotion: {
      enabled: true
    },
    serviceCarousel: {
      enabled: false,
      items: []
    },
    services: {
      enabled: false,
      items: []
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
    },
    price: {
      enabled: false,
      groups: []
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
    services: false,
    faq: false,
    reviews: true,
    about: false,
    contacts: true,
    promotions: true
  }
};

export default annaMiConfig;
