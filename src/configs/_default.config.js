export const defaultConfig = {
  meta: {
    slug: 'beauty-master',
    name: 'Beauty Ma',
    brand: {
      text: 'Beauty Ma',
    },
    fullName: 'Beauty Salon Demo',
    tagline: 'Premium Beauty Studio',
    city: 'Москва',
  },

  contacts: {
    phone: '+7 (999) 123-45-67',
    phoneRaw: '+79991234567',
    address: 'г. Москва, ул. Демо, 1',
    addressNote: 'вход с улицы',
    hours: 'Ежедневно 10:00 — 20:00',
    hoursNote: 'Без выходных',
    whatsapp: '+79991234567',
    coordinates: { lat: 55.7558, lng: 37.6173 },
  },

  social: [
    { href: 'https://vk.com/demo', label: 'ВКонтакте Demo', short: 'VK' },
    { href: 'https://instagram.com/demo', label: 'Instagram Demo', short: 'IG' },
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
      photo: '/templates/beauty-master/hero/demo-hero.webp',
      titleLine1: 'Салон эстетики',
      cityLine: 'в Москве',
      lead: 'Макияж, маникюр, брови и уход — всё в одном месте. Запишитесь онлайн за 30 секунд.',
      ctaLabel: 'Записаться',
    },
    advantages: {
      enabled: true,
    },
    promotion: {
      enabled: true,
    },
    serviceCarousel: {
      enabled: true,
      title: 'Услуги и цены',
      items: [
        {
          title: 'Макияж',
          short: 'Дневной и вечерний',
          priceFrom: 'от 2 000 ₽',
          description: 'Профессиональный макияж для любого случая. Дневной, вечерний, свадебный макияж с учётом особенностей вашего лица.',
          image: '/templates/beauty-master/services/demo-service-1.webp',
        },
        {
          title: 'Маникюр',
          short: 'С покрытием гель-лак',
          priceFrom: 'от 1 500 ₽',
          description: 'Классический и аппаратный маникюр с покрытием гель-лак. Используем только качественные материалы.',
          image: '/templates/beauty-master/services/demo-service-2.webp',
        },
        {
          title: 'Оформление бровей',
          short: 'Коррекция и окрашивание',
          priceFrom: 'от 800 ₽',
          description: 'Коррекция формы бровей, окрашивание хной или краской, ламинирование для идеального вида.',
          image: '/templates/beauty-master/services/demo-service-3.webp',
        },
        {
          title: 'Уход за кожей',
          short: 'Чистка и увлажнение',
          priceFrom: 'от 2 500 ₽',
          description: 'Профессиональный уход за кожей лица: чистка, пилинг, увлажнение и питание.',
          image: '/templates/beauty-master/services/demo-service-4.webp',
        },
        {
          title: 'Сложное окрашивание',
          short: 'Балаяж, омбре, аirtouch',
          priceFrom: 'от 3 000 ₽',
          description: 'Сложные техники окрашивания для создания индивидуального образа. Балаяж, омбре, аirtouch.',
          image: '/templates/beauty-master/services/demo-service-5.webp',
        },
      ],
    },
    services: {
      enabled: true,
      items: [
        { title: 'Макияж', short: 'Дневной и вечерний', priceFrom: 'от 2 000 ₽', image: '/templates/beauty-master/services/demo-service-1.webp' },
        { title: 'Маникюр', short: 'С покрытием гель-лак', priceFrom: 'от 1 500 ₽', image: '/templates/beauty-master/services/demo-service-2.webp' },
        { title: 'Оформление бровей', short: 'Коррекция и окрашивание', priceFrom: 'от 800 ₽', image: '/templates/beauty-master/services/demo-service-3.webp' },
      ],
    },
    gallery: {
      enabled: true,
      items: [
        '/templates/beauty-master/gallery/demo-gallery-1.webp',
        '/templates/beauty-master/gallery/demo-gallery-2.webp',
        '/templates/beauty-master/gallery/demo-gallery-3.webp',
        '/templates/beauty-master/gallery/demo-gallery-4.webp',
        '/templates/beauty-master/gallery/demo-gallery-5.webp',
        '/templates/beauty-master/gallery/demo-gallery-6.webp',
      ],
    },
    beforeAfter: {
      enabled: false,
      items: [],
    },
    team: {
      enabled: true,
      items: [
        {
          name: 'Анна Демо',
          role: 'Топ-мастер',
          exp: 'Опыт 10+ лет',
          specialty: 'Макияж, уход',
          image: '/templates/beauty-master/team/demo-team-1.webp',
          details: [
            'Опыт работы 10 лет',
            'Макияж любой сложности',
            'Уход за кожей лица',
          ],
        },
        {
          name: 'Мария Демо',
          role: 'Мастер-универсал',
          exp: 'Опыт 5+ лет',
          specialty: 'Маникюр, брови',
          image: '/templates/beauty-master/team/demo-team-2.webp',
          details: [
            'Опыт работы 5 лет',
            'Маникюр с покрытием',
            'Оформление бровей',
          ],
        },
      ],
    },
    reviews: {
      enabled: true,
      items: [
        { author: 'Анна', text: 'Прекрасный салон, всё на высшем уровне. Буду приходить снова!' },
        { author: 'Мария', text: 'Мастера очень внимательны к деталям. Результат превзошёл ожидания.' },
        { author: 'Елена', text: 'Отличное обслуживание, уютная атмосфера. Рекомендую!' },
        { author: 'Ольга', text: 'Понравилось всё — от приёма до результата. Спасибо мастерам!' },
      ],
    },
    about: {
      enabled: true,
      text: 'Салон эстетики Beauty Master — место где каждая деталь вашего образа продумана до мелочей. Работаем только с проверенными материалами и профессиональной косметикой.',
      images: [
        '/templates/beauty-master/about/demo-about-1.webp',
        '/templates/beauty-master/about/demo-about-2.webp',
      ],
    },
    faq: {
      enabled: true,
      items: [
        {
          question: 'Как записаться на услугу?',
          answer: 'Вы можете записаться онлайн через форму на сайте или позвонить нам по телефону.',
        },
        {
          question: 'Есть ли скидка для новых клиентов?',
          answer: 'Да, для новых клиентов предусмотрена специальная акция. Узнайте подробности у администратора.',
        },
        {
          question: 'Какие материалы используете?',
          answer: 'Мы используем только профессиональную косметику и проверенные материалы от ведущих брендов.',
        },
        {
          question: 'Можно ли отменить запись?',
          answer: 'Да, вы можете отменить запись за 24 часа до визита без штрафных санкций.',
        },
      ],
    },
    bookingContacts: {
      enabled: true,
    },
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

export default defaultConfig
