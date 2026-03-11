// Seed-скрипт для заполнения базы данных компаниями
// Автоматически сгенерировано: 2026-03-11T19:27:47.432Z
// Запуск: bun run db:seed

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Данные категорий
const categories = [
  {
    "key": "audio",
    "title": "Аудио-аналитика",
    "description": "Технологии распознавания и синтеза речи, голосовые помощники",
    "marketSize": "7+ млрд ₽",
    "growth": "+25% в год",
    "iconName": "Mic"
  },
  {
    "key": "dl",
    "title": "Глубокое обучение (Deep Learning)",
    "description": "Нейронные сети для сложных задач машинного обучения",
    "marketSize": "Основа всех ИИ-решений",
    "growth": "+30% глобальный рост",
    "iconName": "Brain"
  },
  {
    "key": "gen",
    "title": "Генеративный ИИ",
    "description": "Создание контента: изображения, видео, аудио, текст",
    "marketSize": "Быстрорастущий сегмент",
    "growth": "Экспоненциальный рост",
    "iconName": "Sparkles"
  },
  {
    "key": "llm",
    "title": "LLM (Чат-боты)",
    "description": "Большие языковые модели для генерации текста и диалогов",
    "marketSize": "Входит в топ сегменты рынка ИИ",
    "growth": "Активное развитие с 2023 года",
    "iconName": "MessageSquare"
  },
  {
    "key": "video",
    "title": "Видео-аналитика",
    "description": "Компьютерное зрение, распознавание лиц, анализ видеопотоков",
    "marketSize": "22,6 млрд ₽",
    "growth": "+14% в год до 2030",
    "iconName": "Video"
  }
]

// Данные компаний по категориям
const companiesByCategory: Record<string, Array<{
  name: string
  inn?: string
  url: string
  description: string
  features: string[]
  status: 'leader' | 'active'
  revenue?: string
  alsoIn?: string[]
  isPartner?: boolean
}>> = {
  "audio": {
    "leaders": [
      {
        "name": "Just AI",
        "inn": "7813286694",
        "url": "https://just-ai.com/",
        "description": "Aimyvoice - маркетплейс готовых голосов. Голосовые чат-боты. Платформа JAICP. 14 лет опыта.",
        "features": [
          "TTS",
          "Голосовые боты",
          "Aimyvoice",
          "STT"
        ],
        status: 'leader' as const,
        "revenue": "633 млн ₽",
        "alsoIn": [
          "LLM"
        ]
      },
      {
        "name": "BSS",
        "inn": "7726587769",
        "url": "https://bssys.com/",
        "description": "Речевая аналитика, голосовая биометрия, тренажёр оператора. Топ-10 рынка ИИ.",
        "features": [
          "Речевая аналитика",
          "Биометрия",
          "Суфлёр",
          "Тренажёр"
        ],
        status: 'leader' as const,
        "revenue": "Топ-10 рынка",
        "alsoIn": [
          "LLM"
        ]
      },
      {
        "name": "Naumen",
        "inn": "6671111140",
        "url": "https://www.naumen.ru/",
        "description": "Речевая аналитика для контакт-центров. Распознавание речи, анализ звонков, контроль качества.",
        "features": [
          "Речевая аналитика",
          "ASR",
          "Контакт-центры",
          "Sentiment"
        ],
        status: 'leader' as const,
        "revenue": "Лидер контакт-центров"
      },
      {
        "name": "VS Robotics",
        "inn": "7736303529",
        "url": "https://vsrobotics.ru/",
        "description": "Голосовые роботы для контакт-центров. Распознавание речи, анализ эмоций, транскрибация.",
        "features": [
          "Голосовой робот",
          "ASR",
          "Эмоции",
          "Транскрибация"
        ],
        status: 'leader' as const,
        "revenue": "Активный игрок"
      }
    ],
    "others": [
      {
        "name": "Neovox",
        "inn": "7723813089",
        "url": "https://neovox.ru/",
        "description": "Речевая аналитика, транскрибация",
        "features": [
          "ASR",
          "Аналитика"
        ],
        status: 'active' as const
      }
    ]
  },
  "dl": {
    "leaders": [
      {
        "name": "MWS AI (МТС)",
        "inn": "7707767501",
        "url": "https://mts.ai/",
        "description": "ML-решения, Kodify (генерация кода). Полный цикл AI-разработки. Консалтинг и интеграция.",
        "features": [
          "ML",
          "Kodify",
          "Консалтинг",
          "Интеграция"
        ],
        status: 'leader' as const,
        "revenue": "51.4 млрд ₽",
        "alsoIn": [
          "LLM",
          "Аудио",
          "Видео"
        ]
      },
      {
        "name": "Яндекс.Облако",
        "inn": "7704458262",
        "url": "https://yandex.cloud/ru",
        "description": "Yandex AI Studio - платформа для ML. Обучение моделей, инференс, AutoML. GPU кластеры.",
        "features": [
          "ML-платформа",
          "GPU",
          "AutoML",
          "Инференс"
        ],
        status: 'leader' as const,
        "revenue": "1.34 млрд ₽",
        "alsoIn": [
          "LLM"
        ]
      },
      {
        "name": "Норд Клан",
        "inn": "7325165872",
        "url": "https://nordclan.com/",
        "description": "ML-платформа для промышленности. ML Sense, нейросети для контроля качества. Лидеры цифровизации.",
        "features": [
          "ML Sense",
          "Нейросети",
          "Промышленность",
          "CV"
        ],
        status: 'leader' as const,
        "revenue": "Лидер цифровизации",
        "alsoIn": [
          "Видео"
        ]
      },
      {
        "name": "Сбер.AI",
        "inn": "no-inn-dl-Сбер.AI",
        "url": "https://sber.ai/",
        "description": "Экосистема решений на базе DL. MLOps, предобученные модели, NLP, CV. Полный цикл AI-разработки.",
        "features": [
          "MLOps",
          "Предобученные модели",
          "NLP",
          "CV"
        ],
        status: 'leader' as const,
        "revenue": "Лидер экосистемы"
      },
      {
        "name": "Cloud.ru",
        "inn": "7736279160",
        "url": "https://cloud.ru/",
        "description": "Evolution AI Factory - платформа для GenAI и ML. Распределённое обучение, ML Inference, GPU NVIDIA.",
        "features": [
          "AI Factory",
          "ML Inference",
          "Distributed Train",
          "GPU"
        ],
        status: 'leader' as const,
        "revenue": "Лидер облачного ИИ"
      },
      {
        "name": "Napoleon IT",
        "inn": "7453230164",
        "url": "https://napoleonit.ru/",
        "description": "ML-разработка, нейросети. AI TALENT HUB с ИТМО. Data Science, Computer Vision.",
        "features": [
          "ML",
          "Нейросети",
          "Data Science",
          "Обучение"
        ],
        status: 'leader' as const,
        "revenue": "Активный игрок"
      }
    ],
    "others": [
      {
        "name": "Content AI",
        "inn": "9715416652",
        "url": "https://contentai.ru/",
        "description": "ML для обработки документов",
        "features": [
          "ML",
          "OCR"
        ],
        status: 'active' as const,
        "revenue": "1.2 млрд ₽",
        "alsoIn": [
          "Видео"
        ]
      },
      {
        "name": "Автомакон",
        "inn": "5003074225",
        "url": "https://automacon.ru/",
        "description": "Big Data и ML",
        "features": [
          "Big Data",
          "ML"
        ],
        status: 'active' as const,
        "revenue": "Активный интегратор",
        "alsoIn": [
          "Видео"
        ]
      },
      {
        "name": "Юзтех",
        "inn": "9723236163",
        "url": "https://usetech.ru/",
        "description": "ML и компьютерное зрение",
        "features": [
          "ML",
          "CV"
        ],
        status: 'active' as const,
        "revenue": "Активный игрок",
        "alsoIn": [
          "Видео"
        ]
      },
      {
        "name": "ZeBrains",
        "inn": "7325145393",
        "url": "https://zebrains.ru/",
        "description": "ML-решения",
        "features": [
          "AI/ML",
          "PR"
        ],
        status: 'active' as const,
        "alsoIn": [
          "Видео"
        ]
      },
      {
        "name": "SimbirSoft",
        "inn": "7300044805",
        "url": "https://www.simbirsoft.com/",
        "description": "ML и глубокое обучение",
        "features": [
          "ML",
          "DL"
        ],
        status: 'active' as const
      },
      {
        "name": "Terabit Digital",
        "inn": "9721112109",
        "url": "https://terabit.ai/",
        "description": "ML-разработка под ключ",
        "features": [
          "ML",
          "AI"
        ],
        status: 'active' as const
      }
    ]
  },
  "gen": {
    "leaders": [
      {
        "name": "Ainergy",
        "inn": "7840113080",
        "url": "https://ainergy.ru/",
        "description": "Корпоративная платформа генеративного ИИ. Работает в закрытом контуре. Low-code интеграция.",
        "features": [
          "GenAI",
          "On-premise",
          "Low-code",
          "Корпоративный"
        ],
        status: 'leader' as const,
        "revenue": "4.2 млн ₽",
        "alsoIn": [
          "LLM"
        ]
      },
      {
        "name": "Rubbles",
        "inn": "7725806256",
        "url": "https://rubbles.ru/",
        "description": "Rubbles Generative AI Suite - платформа генеративных моделей для крупного бизнеса. On-premise.",
        "features": [
          "GenAI Suite",
          "On-premise",
          "Enterprise",
          "Безопасность"
        ],
        status: 'leader' as const,
        "revenue": "704.9 млн ₽",
        "alsoIn": [
          "LLM"
        ]
      },
      {
        "name": "Kandinsky (Сбер)",
        "inn": "no-inn-gen-Kandinsky (Сбер)",
        "url": "https://fusionbrain.ai/",
        "description": "Kandinsky 5.0 - флагманская российская нейросеть для генерации изображений и видео по текстовому описанию на русском.",
        "features": [
          "Генерация изображений",
          "Генерация видео",
          "Русский язык",
          "API"
        ],
        status: 'leader' as const,
        "revenue": "Лидер генерации"
      },
      {
        "name": "Шедеврум (Яндекс)",
        "inn": "no-inn-gen-Шедеврум (Яндекс)",
        "url": "https://yandex.ru/",
        "description": "Мобильное приложение для генерации изображений с помощью ИИ. Интеграция с экосистемой Яндекса.",
        "features": [
          "Генерация изображений",
          "Мобильное приложение",
          "Стили",
          "Фильтры"
        ],
        status: 'leader' as const,
        "revenue": "Лидер генерации"
      },
      {
        "name": "GigaChat (Сбер)",
        "inn": "no-inn-gen-GigaChat (Сбер)",
        "url": "https://giga.chat/",
        "description": "Генерация изображений вместе с текстом. Интеграция с Fusion Brain. Мульти-модальная генерация.",
        "features": [
          "Генерация текста",
          "Генерация изображений",
          "Мульти-модальность"
        ],
        status: 'leader' as const,
        "revenue": "Лидер рынка",
        "alsoIn": [
          "LLM"
        ]
      },
      {
        "name": "Yandex",
        "inn": "no-inn-gen-Yandex",
        "url": "https://ya.ru/ai/index",
        "description": "YandexGPT + YandexART. Полный цикл генеративного ИИ. Текст, изображения, код.",
        "features": [
          "Генерация текста",
          "Генерация изображений",
          "YandexART"
        ],
        status: 'leader' as const,
        "revenue": "Лидер рынка",
        "alsoIn": [
          "LLM",
          "Аудио"
        ]
      }
    ],
    "others": [
      {
        "name": "3iTech",
        "inn": "7716554066",
        "url": "https://3itech.ru/",
        "description": "Генеративный AI",
        "features": [
          "GenAI",
          "Речь"
        ],
        status: 'active' as const,
        "revenue": "Активный рост",
        "alsoIn": [
          "LLM",
          "Аудио"
        ]
      }
    ]
  },
  "llm": {
    "leaders": [
      {
        "name": "GigaChat (Сбер)",
        "inn": "no-inn-llm-GigaChat (Сбер)",
        "url": "https://giga.chat/",
        "description": "Флагманская LLM Сбера. Генерация текста, изображений, диалоги. Интеграция с Fusion Brain для генерации визуального контента.",
        "features": [
          "Генерация текста",
          "Генерация изображений",
          "API",
          "Enterprise"
        ],
        status: 'leader' as const,
        "revenue": "Лидер рынка",
        "alsoIn": [
          "Генерация"
        ]
      },
      {
        "name": "YandexGPT",
        "inn": "no-inn-llm-YandexGPT",
        "url": "https://ya.ru/ai/index",
        "description": "Флагманская LLM Яндекса. Версия 4 сопоставима с GPT-4o. Глубокая интеграция с экосистемой Яндекса.",
        "features": [
          "Генерация текста",
          "RAG",
          "API",
          "Yandex 360"
        ],
        status: 'leader' as const,
        "revenue": "Лидер рынка",
        "alsoIn": [
          "Аудио",
          "Генерация"
        ]
      }
    ],
    "others": [
      {
        "name": "CorpGPT (Нейросети)",
        "inn": "7733349229",
        "url": "https://corpgpt.ru/",
        "description": "No-code платформа для ИИ-агентов",
        "features": [
          "No-code",
          "Enterprise"
        ],
        status: 'active' as const
      },
      {
        "name": "meetAI",
        "inn": "9705223482",
        "url": "https://mymeet.ai/ru/",
        "description": "ИИ-ассистент для встреч",
        "features": [
          "Транскрибация",
          "Отчёты"
        ],
        status: 'active' as const
      },
      {
        "name": "GPTZATOR (Lad)",
        "inn": "5260320971",
        "url": "https://gptzator.ru/",
        "description": "Корпоративный поиск и RAG",
        "features": [
          "RAG",
          "Поиск"
        ],
        status: 'active' as const
      },
      {
        "name": "PROсковья (1С)",
        "inn": "9713015920",
        "url": "https://1cproconsulting.ru/proskovya",
        "description": "ИИ для 1С на базе LLM",
        "features": [
          "1С",
          "LLM"
        ],
        status: 'active' as const
      },
      {
        "name": "AutoFAQ",
        "inn": "5047186705",
        "url": "https://autofaq.ai/",
        "description": "Чат-боты для поддержки",
        "features": [
          "Поддержка",
          "Xplain"
        ],
        status: 'active' as const
      },
      {
        "name": "Robin (Softline)",
        "inn": "9725114756",
        "url": "https://slsoft.ru/products/robin/",
        "description": "RPA + ИИ-ассистент",
        "features": [
          "RPA",
          "Ассистент"
        ],
        status: 'active' as const
      },
      {
        "name": "Шерпа Роботикс",
        "inn": "3019027499",
        "url": "https://sherparpa.ru/",
        "description": "RPA + ИИ-агенты",
        "features": [
          "RPA",
          "Автоматизация"
        ],
        status: 'active' as const
      },
      {
        "name": "Рег.облако",
        "inn": "7733568767",
        "url": "https://reg.cloud/",
        "description": "ИИ-ассистент в облаке",
        "features": [
          "Ассистент",
          "Облако"
        ],
        status: 'active' as const
      },
      {
        "name": "Directum",
        "inn": "1835056809",
        "url": "https://www.directum.ru/",
        "description": "Документооборот с ИИ",
        "features": [
          "Документы",
          "ИИ"
        ],
        status: 'active' as const
      }
    ]
  },
  "video": {
    "leaders": [
      {
        "name": "VisionLabs",
        "inn": "no-inn-video-VisionLabs",
        "url": "https://visionlabs.ru/",
        "description": "Лидер рынка компьютерного зрения в России. Биометрия, видеоаналитика, распознавание лиц. Международное присутствие.",
        "features": [
          "Распознавание лиц",
          "Биометрия",
          "Видеоаналитика",
          "CV"
        ],
        status: 'leader' as const,
        "revenue": "Лидер рынка"
      },
      {
        "name": "VizorLabs",
        "inn": "no-inn-video-VizorLabs",
        "url": "https://vizorlabs.ru/",
        "description": "Лидер промышленной видеоаналитики. Мониторинг безопасности труда, контроль СИЗ, детекция нарушений.",
        "features": [
          "Промышленная CV",
          "Безопасность",
          "СИЗ",
          "Мониторинг"
        ],
        status: 'leader' as const,
        "revenue": "Лидер пром. аналитики"
      }
    ],
    "others": [
      {
        "name": "Сбер Бизнес Софт",
        "inn": "7730269550",
        "url": "https://sberbs.ru/",
        "description": "CV-решения",
        "features": [
          "CV",
          "ИИ"
        ],
        status: 'active' as const,
        "revenue": "Лидер экосистемы",
        "alsoIn": [
          "LLM",
          "Генерация"
        ]
      },
      {
        "name": "Наносемантика",
        "inn": "7703761097",
        "url": "https://nanosemantics.ai/",
        "description": "CV-решения, аватары",
        "features": [
          "CV",
          "Аватары"
        ],
        status: 'active' as const,
        "revenue": "Лидер NLP",
        "alsoIn": [
          "LLM",
          "Аудио"
        ]
      }
    ]
  }
}

async function main() {
  console.log('🌱 Начало заполнения базы данных...')
  console.log('📅 Дата: 2026-03-11T19:27:47.433Z')

  // Создаём категории
  console.log('\n📁 Создание категорий...')
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { key: cat.key },
      update: cat,
      create: cat,
    })
    console.log(`  ✓ ${cat.title}`)
  }

  // Создаём компании
  console.log('\n🏢 Создание компаний...')
  let totalCompanies = 0

  for (const [catKey, data] of Object.entries(companiesByCategory)) {
    const category = await prisma.category.findUnique({ where: { key: catKey } })
    if (!category) continue

    // Лидеры
    for (const company of data.leaders || []) {
      await prisma.company.upsert({
        where: {
          inn: company.inn || `no-inn-${catKey}-${company.name}`,
        },
        update: {
          name: company.name,
          url: company.url,
          description: company.description,
          features: JSON.stringify(company.features),
          status: 'leader',
          revenue: company.revenue,
          alsoIn: company.alsoIn ? JSON.stringify(company.alsoIn) : null,
          isPartner: company.isPartner || false,
          categoryId: category.id,
        },
        create: {
          name: company.name,
          inn: company.inn || `no-inn-${catKey}-${company.name}`,
          url: company.url,
          description: company.description,
          features: JSON.stringify(company.features),
          status: 'leader',
          revenue: company.revenue,
          alsoIn: company.alsoIn ? JSON.stringify(company.alsoIn) : null,
          isPartner: company.isPartner || false,
          categoryId: category.id,
        },
      })
      totalCompanies++
    }

    // Остальные
    for (const company of data.others || []) {
      await prisma.company.upsert({
        where: {
          inn: company.inn || `no-inn-${catKey}-${company.name}`,
        },
        update: {
          name: company.name,
          url: company.url,
          description: company.description,
          features: JSON.stringify(company.features),
          status: 'active',
          revenue: company.revenue,
          alsoIn: company.alsoIn ? JSON.stringify(company.alsoIn) : null,
          isPartner: company.isPartner || false,
          categoryId: category.id,
        },
        create: {
          name: company.name,
          inn: company.inn || `no-inn-${catKey}-${company.name}`,
          url: company.url,
          description: company.description,
          features: JSON.stringify(company.features),
          status: 'active',
          revenue: company.revenue,
          alsoIn: company.alsoIn ? JSON.stringify(company.alsoIn) : null,
          isPartner: company.isPartner || false,
          categoryId: category.id,
        },
      })
      totalCompanies++
    }

    console.log(`  ✓ ${category.title}: ${(data.leaders?.length || 0) + (data.others?.length || 0)} компаний`)
  }

  console.log(`\n✅ Готово! Всего создано ${totalCompanies} компаний`)

  // Статистика
  const stats = await prisma.category.findMany({
    include: {
      _count: { select: { companies: true } },
    },
  })

  console.log('\n📊 Статистика:')
  for (const cat of stats) {
    const leaders = await prisma.company.count({
      where: { categoryId: cat.id, status: 'leader' },
    })
    console.log(`  ${cat.title}: ${cat._count.companies} компаний (${leaders} лидеров)`)
  }
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
