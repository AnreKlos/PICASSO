export const moodConfig = {
  meta: {
    slug: 'mood',
    brand: {
      name: 'Mood',
      shortName: 'Mood',
      slug: 'mood',
      tagline: 'Салон красоты на Московском проспекте в Брянске — стрижка и маникюр.'
    },
    name: 'Mood',
    fullName: 'Mood — Салон красоты на Московском проспекте в Брянске — стрижка и маникюр.',
    tagline: 'Салон красоты на Московском проспекте в Брянске — стрижка и маникюр.',
    city: 'Брянск',
    awards: [
      {
        type: 'good_place',
        year: '2026',
        label: 'Хорошее место 2026'
      }
    ]
  },
  contacts: {
    phone: '+7 (999) 705-00-04',
    phoneRaw: '+79997050004',
    phones: [
      '+7 (999) 705-00-04'
    ],
    whatsapp: '+79997050004',
    address: 'Брянск, Московский проспект, 10/11',
    addressNote: 'этаж 1',
    additionalAddresses: [],
    workingHours: 'ежедневно, 10:00–20:00',
    hours: 'ежедневно, 10:00–20:00',
    coordinates: {
      lat: 53.218046,
      lng: 34.38851
    }
  },
  booking: {
    url: 'https://dikidi.ru/1188146'
  },
  social: [
    {
      href: 'https://vk.com/mood32',
      label: 'ВКонтакте Mood',
      short: 'VK'
    },
    {
      href: 'https://taplink.cc/nikitina_lyuda',
      label: 'TapLink Mood',
      short: 'TL'
    },
    {
      href: 'https://wa.me/79997050004',
      label: 'WhatsApp Mood',
      short: 'WA'
    }
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
    'price',
    'gallery',
    'reviews',
    'about',
    'faq',
    'bookingContacts'
  ],
  copyrightYear: 2026,
  sections: {
    hero: {
      enabled: true,
      image: '/mood/hero/photo_1.jpg',
      imageAlt: 'Маникюр нюдовый гель-лак квадратная форма',
      titleLine1: 'Студия красоты',
      titleLine1Small: 'по созданию образа',
      titleLine1SmallSize: 'default',
      titleLine2: 'Mood',
      topLabel: 'Брянске · запись онлайн',
      lead: 'Студия красоты в Брянске. рейтинг 5.0 на основе 169 отзывов. награда «Хорошее место 2026».',
      ctaLabel: 'Записаться'
    },
    promotion: {
      enabled: true
    },
    services: {
      enabled: true,
      items: [
        {
          title: 'SMART педикюр без покрытия гель-лаком',
          short: 'У нас в салоне есть грейдирование мастеров . Мастера  , топ-',
          description: 'У нас в салоне есть грейдирование мастеров . Мастера  , топ-мастера  . \nВсе специалисты проходят регулярные обучения и повышения квалификации.\nПо стоимости вы можете проконсультироваться у администратора.',
          priceFrom: '1500 ₽',
          image: 'https://avatars.mds.yandex.net/get-sprav-products/2791887/2a0000019706497a569589f4319a429a6a12/orig'
        },
        {
          title: 'SMART педикюр с покрытием гель-лаком',
          short: 'У нас в салоне есть грейдирование мастеров . Мастера  , топ-',
          description: 'У нас в салоне есть грейдирование мастеров . Мастера  , топ-мастера  . \nВсе специалисты проходят регулярные обучения и повышения квалификации.\nПо стоимости вы можете проконсультироваться у администратора.',
          priceFrom: '2000 ₽',
          image: 'https://avatars.mds.yandex.net/get-sprav-products/4079840/2a000001928cb13b8e3c13eb6c3436ea9fb7/orig'
        },
        {
          title: 'Обработка пальчиков с покрытием',
          short: 'У нас в салоне есть грейдирование мастеров . Мастера  , топ-',
          description: 'У нас в салоне есть грейдирование мастеров . Мастера  , топ-мастера  . \nВсе специалисты проходят регулярные обучения и повышения квалификации.\nПо стоимости вы можете проконсультироваться у администратора.',
          priceFrom: '1600 ₽',
          image: 'https://avatars.mds.yandex.net/get-sprav-products/2701203/2a0000019717adae517354b7e9796ed4e4e8/orig'
        },
        {
          title: 'Маникюр классический',
          short: 'У нас в салоне есть грейдирование мастеров . Мастера  , топ-',
          description: 'У нас в салоне есть грейдирование мастеров . Мастера  , топ-мастера  . \nВсе специалисты проходят регулярные обучения и повышения квалификации.\nПо стоимости вы можете проконсультироваться у администратора.',
          priceFrom: '1000 ₽',
          image: 'https://avatars.mds.yandex.net/get-sprav-products/1530321/2a0000019a2f042cdae83e8a23834102f222/orig'
        },
        {
          title: 'Наращивание ногтей',
          short: 'У нас в салоне есть грейдирование мастеров . Мастера  , топ-',
          description: 'У нас в салоне есть грейдирование мастеров . Мастера  , топ-мастера  . \nВсе специалисты проходят регулярные обучения и повышения квалификации.\nПо стоимости вы можете проконсультироваться у администратора.',
          priceFrom: '2200 ₽',
          image: 'https://avatars.mds.yandex.net/get-sprav-products/13672565/2a0000019a2f067dbd0690d6563265f3aa84/orig'
        },
        {
          title: 'снятие нашего покрытия + маникюр + покрытие однотонное',
          short: 'У нас в салоне есть грейдирование мастеров . Мастера  , топ-',
          description: 'У нас в салоне есть грейдирование мастеров . Мастера  , топ-мастера  . \nВсе специалисты проходят регулярные обучения и повышения квалификации.\nПо стоимости вы можете проконсультироваться у администратора.',
          priceFrom: '1800 ₽',
          image: 'https://avatars.mds.yandex.net/get-sprav-products/3912342/2a0000019a2f08a071d9033a9e955e6d48b2/orig'
        },
        {
          title: 'Однотонное глянцевое окрашивание',
          short: 'Цена зависит от длины , густоты и исходного цвета волос. \nТа',
          description: 'Цена зависит от длины , густоты и исходного цвета волос. \nТак же у нас в салоне есть грейдирование мастеров . Мастера  , топ-мастера , мастера-эксперты . \nВсе специалисты проходят регулярные обучения и повышения квалификации.\nПо стоимости вы может...',
          priceFrom: '5000 ₽',
          image: 'https://avatars.mds.yandex.net/get-sprav-products/13059590/2a0000018fabfbcac32c346804f695182c89/orig'
        },
        {
          title: 'Airtouch',
          short: 'Цена зависит от длины , густоты и исходного цвета волос. \nТа',
          description: 'Цена зависит от длины , густоты и исходного цвета волос. \nТак же у нас в салоне есть грейдирование мастеров . Мастера  , топ-мастера , мастера-эксперты . \nВсе специалисты проходят регулярные обучения и повышения квалификации.\nПо стоимости вы может...',
          priceFrom: '8000 ₽',
          image: 'https://avatars.mds.yandex.net/get-sprav-products/13852611/2a0000019a2bce483165637898e5decc37e4/orig'
        },
        {
          title: 'Выход из темного',
          short: 'Цена зависит от длины , густоты и исходного цвета волос. \nТа',
          description: 'Цена зависит от длины , густоты и исходного цвета волос. \nТак же у нас в салоне есть грейдирование мастеров . Мастера  , топ-мастера , мастера-эксперты . \nВсе специалисты проходят регулярные обучения и повышения квалификации.\nПо стоимости вы может...',
          priceFrom: '9000 ₽',
          image: 'https://avatars.mds.yandex.net/get-sprav-products/2994796/2a0000019a2ef7ae9e6935df524d9b334336/orig'
        },
        {
          title: 'Мелирование',
          short: 'Цена зависит от длины , густоты и исходного цвета волос. \nТа',
          description: 'Цена зависит от длины , густоты и исходного цвета волос. \nТак же у нас в салоне есть грейдированмастеров . Мастера  , топ-мастера , мастера-эксперты . \nВсе специалисты проходят регулярные обучения и повышения квалификации.',
          priceFrom: '4000 ₽',
          image: 'https://avatars.mds.yandex.net/get-sprav-products/3912342/2a0000019a2f002e8135ea5f1804d8de7351/orig'
        }
      ]
    },
    gallery: {
      enabled: true,
      title: 'Наши работы',
      subtitle: 'Каждая деталь имеет значение',
      items: [
        {
          src: '/mood/gallery/photo_1.jpg',
          alt: 'Результат перманентного макияжа бровей и межресничной стрелки',
          description: 'Сравнение до и после процедуры перманентного макияжа бровей и межресничной стрелки.',
          marketingGrade: 8,
          fitScore: 10,
          category: 'work_result',
          serviceRef: 'other'
        },
        {
          src: '/mood/gallery/photo_2.jpg',
          alt: 'Наращивание ресниц: мастер выбирает ресницы пинцетом',
          description: 'Мастер держит пинцет и выбирает ресницы для наращивания с палетки.',
          marketingGrade: 8,
          fitScore: 10,
          category: 'master_at_work',
          serviceRef: 'lashes'
        },
        {
          src: '/mood/gallery/photo_3.jpg',
          alt: 'Результат окрашивания волос: длинные, прямые, блестящие волосы.',
          description: 'Женщина с длинными, прямыми, окрашенными волосами в черном пеньюаре.',
          marketingGrade: 8,
          fitScore: 10,
          category: 'work_result',
          serviceRef: 'coloring'
        },
        {
          src: '/mood/gallery/photo_4.jpg',
          alt: 'Женщина со светлыми волосами после процедуры в салоне',
          description: 'Молодая женщина с красивыми светлыми волосами, демонстрирующая результат окрашивания или укладки.',
          marketingGrade: 8,
          fitScore: 10,
          category: 'work_result',
          serviceRef: 'hair_treatment'
        },
        {
          src: '/mood/gallery/photo_5.jpg',
          alt: 'Женская стрижка и окрашивание в светлый блонд',
          description: 'Женская стрижка и окрашивание в светлый блонд с ровным срезом.',
          fitScore: 10,
          category: 'work_result',
          serviceRef: 'haircut'
        },
        {
          src: '/mood/gallery/photo_6.jpg',
          alt: 'Стрижка и окрашивание блонд',
          description: 'Женская стрижка и окрашивание блонд с плавным переходом от темных корней к светлым кончикам. Волосы уложены и выглядят ухоженными.',
          fitScore: 10,
          category: 'work_result',
          serviceRef: 'haircut'
        }
      ]
    },
    team: {
      enabled: false,
      items: []
    },
    reels: {
      enabled: false,
      items: [
        {
          id: 'vplvfgmdtqv3hxrk7ybe',
          thumbnail: 'https://avatars.mds.yandex.net/get-vh/16499410/2a0000019a2952de4201016a7f6d3579a56c/orig',
          video: 'https://runtime.strm.yandex.ru/player/video/vplvfgmdtqv3hxrk7ybe',
          width: 1080,
          height: 1350
        },
        {
          id: 'vplv7mdxhwtpyl67nqtz',
          thumbnail: 'https://avatars.mds.yandex.net/get-vh/13740974/2a0000019bc1a37989ecae8b5371c7a4ea53/orig',
          video: 'https://runtime.strm.yandex.ru/player/video/vplv7mdxhwtpyl67nqtz',
          width: 1080,
          height: 1920
        },
        {
          id: 'vplv5wdohxfmlltrx2f7',
          thumbnail: 'https://avatars.mds.yandex.net/get-vh/16401881/2a0000019bc1a0b3e0f73137bc1a1d8a21de/orig',
          video: 'https://runtime.strm.yandex.ru/player/video/vplv5wdohxfmlltrx2f7',
          width: 720,
          height: 1280
        },
        {
          id: 'vplvygldykd2fctcdpbk',
          thumbnail: 'https://avatars.mds.yandex.net/get-vh/6549758/2a0000018e5c73ee9837a34555b51b98a46e/orig',
          video: 'https://runtime.strm.yandex.ru/player/video/vplvygldykd2fctcdpbk',
          width: 1080,
          height: 1920
        },
        {
          id: 'vplvujdq5igwco56uvsq',
          thumbnail: 'https://avatars.mds.yandex.net/get-vh/13965829/2a0000019be709a8939eb8f8389b64965d57/orig',
          video: 'https://runtime.strm.yandex.ru/player/video/vplvujdq5igwco56uvsq',
          width: 1438,
          height: 2558
        },
        {
          id: 'vplvsytyzl23muzs6a6d',
          thumbnail: 'https://avatars.mds.yandex.net/get-vh/14711823/2a000001994ce620ab92a862aaa6a882acca/orig',
          video: 'https://runtime.strm.yandex.ru/player/video/vplvsytyzl23muzs6a6d',
          width: 2160,
          height: 3840
        },
        {
          id: 'vplvvlixbuckphhvh3ae',
          thumbnail: 'https://avatars.mds.yandex.net/get-vh/14711823/2a0000019ae931645ac4e11acec3dd32ee40/orig',
          video: 'https://runtime.strm.yandex.ru/player/video/vplvvlixbuckphhvh3ae',
          width: 1080,
          height: 1920
        },
        {
          id: 'vplvyonjqo4o4oq5rlfj',
          thumbnail: 'https://avatars.mds.yandex.net/get-vh/16277283/2a000001994cec82cec4cb94936a195a63d4/orig',
          video: 'https://runtime.strm.yandex.ru/player/video/vplvyonjqo4o4oq5rlfj',
          width: 1080,
          height: 1920
        },
        {
          id: 'vplvgxsrl7vtqc4fzywz',
          thumbnail: 'https://avatars.mds.yandex.net/get-vh/10268831/2a0000019ae933a8b2a765b5e6e3d06a9865/orig',
          video: 'https://runtime.strm.yandex.ru/player/video/vplvgxsrl7vtqc4fzywz',
          width: 1080,
          height: 1920
        }
      ]
    },
    reviews: {
      enabled: true,
      items: [
        {
          author: 'Альбина Можаева',
          text: 'Обслуживание очень хорошее,Настя- мастер своего дела, хожу к Насте 5год,мне очень нравится,делает ресницы качественно и быстро. Хожу с ресницами 1,5-2 месяца. Я очень довольна работой своего мастера, рекомендую. В салоне прекрасная атмосфера, лёгкая музыка, просто лежишь и наслаждаешься, а встаёшь уже красивая с ресницами. Девочки все вежливые и приятные. Предлагают горячие напитки: кофе, чай. Очень мне понравился кофе с корицей, огонь. Спасибо Александре, очень мне было вкусно. Всем знакомым буду рекомендовать салон красоты Mood.',
          rating: 5,
          date: '2026-02-10',
          businessReply: 'Спасибо большое за ваш тёплый отзыв 🌸\nБудем рады видеть вас снова 🙏🏽♥️'
        },
        {
          author: 'Александра',
          text: 'Сегодня была на окрашивании волос после долгого перерыва в технике Airtouch, и хочется поблагодарить топ специалиста Марию! \nПодобранный цвет для тонирования, техника окрашивания и состояние волос после процедуры просто идеальное👍🏼. Мне кажется я нашла своего мастера 🫶🏼\nОднозначно рекомендую тем,кто хочет сделать сложное окрашивание. \nМария - очень грамотный высококвалифицированный профессионал своего дела!❤️',
          rating: 5,
          date: '2026-02-15',
          businessReply: 'Спасибо большое за ваш тёплый отзыв 🌸\nБудем рады видеть вас снова 🙏🏽♥️'
        },
        {
          author: 'Ольга Александровна',
          text: 'Сегодня была записана  к начинающему мастеру на маникюр к Анисовой Екатерине. Все отлично было сделано и я осталась довольна. Иногда подходила мастер и контролировала работу, советовала как лучше сделать, так как один ноготь был у меня немного сломан . Так же от большого количества цветов не могла подобрать каким покрасить (глаза разбегаются, и хочется всеми накрасить), но помогли подобрать. В салоне очень чисто, играла легкая музыка. Весь персонал очень приветливый. Расположение салона в удобном месте. Мягкая мебель, удобные кресла. Еще мне понравились то что пришла девушка на стрижку и окрашивание волос, так мастер как только подстригла, то сразу убрала и только потом начала делать окрашивание волос. И это большой плюс. Большое вам спасибо за оказанную услугу.\nДелала 26 августа  сегодня 16 сентября маникюр все еще держится только ногти отросли)). После такого срока 22 дня , могу сказать, что маникюр сделан качественно. И если бы еще раз пригласили бы на 💅 с удовольствием согласилась бы.',
          rating: 5,
          date: '2025-09-16',
          businessReply: 'Спасибо большое за ваш тёплый отзыв 🌸\nБудем рады видеть вас снова 🙏🏽♥️'
        }
      ]
    },
    about: {
      enabled: true,
      showImages: true,
      text: 'Салон красоты MOOD в Брянске на Московском проспекте, 10/11. Предлагаем стрижки от 500 ₽ и другие услуги по уходу за собой. Рейтинг 5.0 из 5 на Яндекс.Картах с 269 отзывами.',
      images: [
        {
          src: '/mood/about/photo_1.jpg',
          alt: 'Интерьер салона красоты: рабочие места для маникюра и парикмахерских услуг',
          description: 'Светлый и современный интерьер салона красоты с рабочими местами для маникюра и парикмахерских услуг, оборудованными зеркалами и удобными креслами.',
          marketingGrade: 7,
          fitScore: 10,
          category: 'interior'
        },
        {
          src: '/mood/about/photo_2.jpg',
          alt: 'Кресла в салоне красоты',
          description: 'Уютные кресла с велюровой обивкой и стразами в салоне красоты.',
          marketingGrade: 7,
          fitScore: 10,
          category: 'interior'
        }
      ]
    },
    faq: {
      enabled: true,
      items: [
        {
          q: 'Где находится салон?',
          a: 'Салон находится по адресу Брянск, Московский проспект, 10/11.'
        },
        {
          q: 'Какая стоимость стрижки?',
          a: 'Стоимость стрижки от 500 ₽.'
        },
        {
          q: 'Можно ли записаться онлайн?',
          a: 'Уточните возможность записи по телефону: 8317037-1377, 86184945407 или +7 999 705 00 04.'
        }
      ]
    },
    bookingContacts: {
      enabled: true,
      showMap: true
    },
    price: {
      enabled: true,
      title: 'Прайс',
      subtitle: null,
      note: 'Окончательная стоимость уточняется при записи.',
      groups: [
        {
          title: null,
          items: [
            {
              title: 'SMART педикюр без покрытия гель-лаком',
              price: '1500 ₽',
              priceFrom: false,
              duration_min: null,
              description: 'У нас в салоне есть грейдирование мастеров . Мастера  , топ-мастера  . \nВсе специалисты проходят регулярные обучения и повышения квалификации.\nПо стоимости вы можете проконсультироваться у администрат'
            },
            {
              title: 'SMART педикюр с покрытием гель-лаком',
              price: '2000 ₽',
              priceFrom: false,
              duration_min: null,
              description: 'У нас в салоне есть грейдирование мастеров . Мастера  , топ-мастера  . \nВсе специалисты проходят регулярные обучения и повышения квалификации.\nПо стоимости вы можете проконсультироваться у администрат'
            },
            {
              title: 'Обработка пальчиков с покрытием',
              price: '1600 ₽',
              priceFrom: false,
              duration_min: null,
              description: 'У нас в салоне есть грейдирование мастеров . Мастера  , топ-мастера  . \nВсе специалисты проходят регулярные обучения и повышения квалификации.\nПо стоимости вы можете проконсультироваться у администрат'
            },
            {
              title: 'Маникюр классический',
              price: '1000 ₽',
              priceFrom: false,
              duration_min: null,
              description: 'У нас в салоне есть грейдирование мастеров . Мастера  , топ-мастера  . \nВсе специалисты проходят регулярные обучения и повышения квалификации.\nПо стоимости вы можете проконсультироваться у администрат'
            },
            {
              title: 'Наращивание ногтей',
              price: '2200 ₽',
              priceFrom: false,
              duration_min: null,
              description: 'У нас в салоне есть грейдирование мастеров . Мастера  , топ-мастера  . \nВсе специалисты проходят регулярные обучения и повышения квалификации.\nПо стоимости вы можете проконсультироваться у администрат'
            },
            {
              title: 'снятие нашего покрытия + маникюр + покрытие однотонное',
              price: '1800 ₽',
              priceFrom: false,
              duration_min: null,
              description: 'У нас в салоне есть грейдирование мастеров . Мастера  , топ-мастера  . \nВсе специалисты проходят регулярные обучения и повышения квалификации.\nПо стоимости вы можете проконсультироваться у администрат'
            },
            {
              title: 'Однотонное глянцевое окрашивание',
              price: '5000 ₽',
              priceFrom: false,
              duration_min: null,
              description: 'Цена зависит от длины , густоты и исходного цвета волос. \nТак же у нас в салоне есть грейдирование мастеров . Мастера  , топ-мастера , мастера-эксперты . \nВсе специалисты проходят регулярные обучения '
            },
            {
              title: 'Airtouch',
              price: '8000 ₽',
              priceFrom: false,
              duration_min: null,
              description: 'Цена зависит от длины , густоты и исходного цвета волос. \nТак же у нас в салоне есть грейдирование мастеров . Мастера  , топ-мастера , мастера-эксперты . \nВсе специалисты проходят регулярные обучения '
            },
            {
              title: 'Выход из темного',
              price: '9000 ₽',
              priceFrom: false,
              duration_min: null,
              description: 'Цена зависит от длины , густоты и исходного цвета волос. \nТак же у нас в салоне есть грейдирование мастеров . Мастера  , топ-мастера , мастера-эксперты . \nВсе специалисты проходят регулярные обучения '
            },
            {
              title: 'Мелирование',
              price: '4000 ₽',
              priceFrom: false,
              duration_min: null,
              description: 'Цена зависит от длины , густоты и исходного цвета волос. \nТак же у нас в салоне есть грейдированмастеров . Мастера  , топ-мастера , мастера-эксперты . \nВсе специалисты проходят регулярные обучения и п'
            }
          ]
        }
      ]
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
    gallery: true,
    team: false,
    services: true,
    faq: true,
    reviews: true,
    about: true,
    contacts: true,
    promotions: true,
    price: true
  },
  _meta: {
    builder_version: '2.0',
    card_schema: 2,
    qualification: {
      qualified: true,
      reason: 'OK',
      score: 100,
      checks: {
        rating: true,
        reviews: true,
        photos: true,
        services: true,
        contact: true
      },
      details: {
        rating: 5.0,
        review_count: 169,
        unique_aspect_photos: 43,
        services_with_photos: 10,
        contact_channels: [
          'taplink',
          'vk',
          'website',
          'whatsapp',
          'booking'
        ]
      }
    }
  }
};

export default moodConfig;
