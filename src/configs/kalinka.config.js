const kalinkaServicesItems = [
  {
    title: 'Парикмахерский зал',
    short: 'Стрижки, окрашивание, ламинирование, укладки',
    description: 'Стрижки, окрашивание, ламинирование и укладки для повседневных и праздничных образов.',
    priceFrom: 'от 1200 ₽',
    image: '/kalinka/hero/portrait_professional_beauty.jpg',
  },
  {
    title: 'Маникюр и педикюр',
    short: 'Классический маникюр, гель-лак, smart-педикюр, наращивание',
    description: 'Классический маникюр, гель-лак, smart-педикюр и наращивание с аккуратной архитектурой.',
    priceFrom: 'от 1500 ₽',
  },
  {
    title: 'Брови',
    short: 'Коррекция, окрашивание, ламинирование',
    description: 'Коррекция, окрашивание и ламинирование для выразительного и естественного результата.',
    priceFrom: 'от 700 ₽',
  },
  {
    title: 'Ресницы',
    short: 'Наращивание, ламинирование',
    description: 'Наращивание и ламинирование ресниц под желаемую выразительность взгляда.',
    priceFrom: 'от 1500 ₽',
  },
  {
    title: 'Макияж',
    short: 'Дневной, вечерний, свадебный',
    description: 'Дневной, вечерний и свадебный макияж с учётом освещения, дресс-кода и формата события.',
    priceFrom: 'от 2000 ₽',
  },
]

export const kalinkaConfig = {
  meta: {
    slug: 'kalinka',
    brand: {
      name: 'Калинка-Малинка',
      slug: 'kalinka',
      tagline: 'Моно-студия по созданию образа',
    },
    name: 'Калинка-Малинка',
    fullName: 'Калинка-Малинка — моно-студия по созданию образа',
    tagline: 'Моно-студия по созданию образа',
    city: 'Брянск',
  },

  contacts: {
    phone: '8 (4832) 344-388',
    phoneRaw: '+74832344388',
    phones: ['8 (4832) 344-388'],
    whatsapp: '+79100344388',
    address: 'ул. Советская, 122, Брянск',
    coordinates: { lat: 53.2551, lng: 34.3408 },
    additionalAddresses: ['ул. Фокина, 37А, Брянск', 'ул. Советская, 122, Брянск'],
    workingHours: 'ежедневно с 10:00 до 20:00',
    vk: 'https://vk.com/club19553830',
  },

  booking: {
    url: 'https://n411317.yclients.com',
  },

  social: [
    { href: 'https://vk.com/club19553830', label: 'ВКонтакте Калинка-Малинка', short: 'VK' },
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
      title: 'Особое предложение для новых клиенток',
      text: 'Для первого визита мы подготовили приятный бонус. Оставьте заявку, и администратор подскажет подходящую услугу и удобное время.',
    },
  },

  sectionsOrder: [
    'hero',
    'serviceCarousel',
    'promotion',
    'reels',
    'gallery',
    'services',
    'reviews',
    'about',
    'faq',
    'bookingContacts',
  ],

  copyrightYear: 2026,

  sections: {
    hero: {
      enabled: true,
      image: '',
      video: '/kalinka/hero/hero_bg.webm',
      titleLine1: 'Моностудия образа',
      titleLine2: 'Калинка‑Малинка',
      topLabel: 'Брянск · Запись онлайн 24/7',
      lead: 'Причёска, маникюр, макияж, брови — всё в одном визите. Без беготни по городу.',
    },
    serviceCarousel: {
      enabled: true,
      title: 'Услуги и цены',
      items: kalinkaServicesItems.map((item) => ({
        name: item.title,
        price: item.priceFrom,
        image: item.image || '/kalinka/hero/portrait_best_shot.jpg',
        description: item.description,
      })),
    },
    promotion: { enabled: true },
    advantages: { enabled: false },
    services: {
      enabled: true,
      items: kalinkaServicesItems,
    },
    gallery: {
      enabled: true,
      title: 'Наши работы',
      subtitle: 'Каждая деталь имеет значение',
      items: [
        '/kalinka/gallery/eyelashes_makeup_process.jpg',
        '/kalinka/gallery/glitter_lips.jpg',
        '/kalinka/gallery/eyeshadow_makeup.jpg',
        '/kalinka/gallery/manicure_pink_nails.jpg',
        '/kalinka/gallery/eyelashes_eyebrows_detail.jpg',
        '/kalinka/gallery/makeup_face_body_art.jpg',
        '/kalinka/gallery/makeup_portrait_beauty.jpg',
        '/kalinka/gallery/makeup_artistry_beauty.jpg',
      ],
    },
    team: {
      enabled: false,
      items: [],
    },
    reels: {
      enabled: true,
      title: 'Из жизни студии',
      subtitle: 'Образы, мастера, атмосфера',
      items: [
        {
          type: 'vk',
          embedUrl: 'https://vk.com/video_ext.php?oid=-19553830&id=456241831&hash=',
          externalUrl: 'https://vk.com/club19553830',
          title: 'Образы студии',
        },
        {
          type: 'vk',
          embedUrl: 'https://vk.com/video_ext.php?oid=-19553830&id=456241859&hash=',
          externalUrl: 'https://vk.com/club19553830',
          title: 'Работы мастеров',
        },
        {
          type: 'vk',
          embedUrl: 'https://vk.com/video_ext.php?oid=-19553830&id=456241867&hash=',
          externalUrl: 'https://vk.com/club19553830',
          title: 'Атмосфера салона',
        },
        {
          type: 'vk',
          embedUrl: 'https://vk.com/video_ext.php?oid=-19553830&id=456241873&hash=',
          externalUrl: 'https://vk.com/club19553830',
          title: 'Маникюр',
        },
        {
          type: 'vk',
          embedUrl: 'https://vk.com/video_ext.php?oid=-19553830&id=456241886&hash=2f315687baf928ffd0',
          externalUrl: 'https://vk.com/club19553830',
          title: 'Создание образа',
        },
        {
          type: 'vk',
          embedUrl: 'https://vk.com/video_ext.php?oid=-19553830&id=456241900&hash=',
          externalUrl: 'https://vk.com/club19553830',
          title: 'Идеальные брови',
        },
      ],
    },
    reviews: {
      enabled: true,
      items: [
        {
          author: 'Мария',
          text: 'Сделали невероятно красивый маникюр, клиентоориентированность 10/10, починили ноготь в течение 3 гарантийных дней',
        },
        {
          author: 'Анна',
          text: 'Была у мастеров на макияж и причёску в 4 руки. Премиум образ услуга. Мне очень понравилось! Столько комплиментов было!',
        },
        {
          author: 'Елена',
          text: 'Делала макияж на свадьбу у Алины и причёску у Татьяны. Очень приятные девушки. Макияж продержался отлично.',
        },
        {
          author: 'Ольга',
          text: 'Всегда красивое место и красивые люди. Искала для себя услугу японского маникюра, осталась очень довольна.',
        },
        {
          author: 'Виктория',
          text: 'Отличные мастера, вежливые и компетентные в своем деле.',
        },
      ],
    },
    about: {
      enabled: true,
      showImages: false,
      text: 'Калинка-Малинка — моно-студия по созданию образа. Наши специалисты дополнят ваш повседневный образ качественным маникюром, педикюром и оформлением бровей, а также создадут стойкий макияж и причёску для самого важного торжества. Наша главная задача — подчеркнуть вашу индивидуальность.',
    },
    faq: {
      enabled: true,
      items: [
        {
          q: 'Нужна ли запись заранее?',
          a: 'Да, мы работаем по предварительной записи. Это позволяет уделить каждому клиенту максимум времени.',
        },
        {
          q: 'Можно ли прийти вдвоём?',
          a: 'Конечно! Мы делаем парные процедуры — это популярная услуга перед торжествами.',
        },
        {
          q: 'Сколько длится создание полного образа?',
          a: 'В среднем 1-2 часа. Точное время зависит от выбранных процедур.',
        },
        {
          q: 'Можно ли собрать образ к свадьбе или выпускному в одном месте?',
          a: 'Да, мы можем собрать цельный образ: причёска, макияж, брови и финальные штрихи в одном визите.',
        },
        {
          q: 'Что взять с собой на первый визит?',
          a: 'Достаточно фото-референсов и пары слов о желаемом результате. Всё остальное подберём на консультации с мастером.',
        },
      ],
    },
    bookingContacts: {
      enabled: true,
      showMap: true,
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

export default kalinkaConfig
