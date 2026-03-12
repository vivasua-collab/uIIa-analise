// Seed-скрипт для заполнения базы данных компаниями
// Версия: 2.0.0
// Дата: 2026-03-12
// Запуск: bun run db:seed

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Функция для проверки валидности ИНН (только цифры)
function isValidInn(inn: string | undefined | null): inn is string {
  if (!inn) return false
  return /^\d+$/.test(inn)
}

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

// ==========================================
// МАТЕРИНСКИЕ КОМПАНИИ (экосистемы)
// ==========================================
const parentCompanies = [
  {
    "name": "Сбер",
    "inn": "7707083893",
    "url": "https://www.sberbank.ru/",
    "description": "ПАО Сбербанк - крупнейший банк России, экосистема финансовых и технологических услуг",
    "features": ["Экосистема", "Финтех", "ИИ"],
    status: 'leader' as const,
  },
  {
    "name": "Яндекс",
    "inn": "7736207543",
    "url": "https://yandex.ru/",
    "description": "Яндекс - одна из крупнейших IT-компаний России, поисковая система и экосистема сервисов",
    "features": ["Экосистема", "Поиск", "ИИ"],
    status: 'leader' as const,
  },
  {
    "name": "МТС",
    "inn": "7740000076",
    "url": "https://www.mts.ru/",
    "description": "ПАО МТС - крупнейший телекоммуникационный оператор и провайдер цифровых услуг",
    "features": ["Телеком", "Экосистема", "ИИ"],
    status: 'leader' as const,
  },
  {
    "name": "Ростелеком",
    "inn": "7712843817",
    "url": "https://www.rt.ru/",
    "description": "ПАО Ростелеком - крупнейший провайдер цифровых услуг и решений в России",
    "features": ["Телеком", "Гос", "ИИ"],
    status: 'leader' as const,
  },
  {
    "name": "VK",
    "inn": "7842334464",
    "url": "https://vk.com/",
    "description": "VK (ВКонтакте) - социальная сеть и экосистема цифровых сервисов",
    "features": ["Соцсеть", "Экосистема", "ИИ"],
    status: 'leader' as const,
  },
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
  parentInn?: string
}>> = {
  "audio": [
    {
      "name": "Just AI",
      "inn": "7813286694",
      "url": "https://just-ai.com/",
      "description": "Aimyvoice - маркетплейс готовых голосов. Голосовые чат-боты. Платформа JAICP. 14 лет опыта.",
      "features": ["TTS", "Голосовые боты", "Aimyvoice", "STT"],
      status: 'leader',
      "revenue": "633 млн ₽",
      "alsoIn": ["LLM"]
    },
    {
      "name": "BSS",
      "inn": "7726587769",
      "url": "https://bssys.com/",
      "description": "Речевая аналитика, голосовая биометрия, тренажёр оператора. Топ-10 рынка ИИ.",
      "features": ["Речевая аналитика", "Биометрия", "Суфлёр", "Тренажёр"],
      status: 'leader',
      "revenue": "Топ-10 рынка",
      "alsoIn": ["LLM"]
    },
    {
      "name": "Naumen",
      "inn": "6671111140",
      "url": "https://www.naumen.ru/",
      "description": "Речевая аналитика для контакт-центров. Распознавание речи, анализ звонков, контроль качества.",
      "features": ["Речевая аналитика", "ASR", "Контакт-центры", "Sentiment"],
      status: 'leader',
      "revenue": "Лидер контакт-центров"
    },
    {
      "name": "VS Robotics",
      "inn": "7736303529",
      "url": "https://vsrobotics.ru/",
      "description": "Голосовые роботы для контакт-центров. Распознавание речи, анализ эмоций, транскрибация.",
      "features": ["Голосовой робот", "ASR", "Эмоции", "Транскрибация"],
      status: 'leader',
      "revenue": "Активный игрок"
    },
    {
      "name": "Neovox",
      "inn": "7723813089",
      "url": "https://neovox.ru/",
      "description": "Речевая аналитика, транскрибация",
      "features": ["ASR", "Аналитика"],
      status: 'active'
    },
    {
      "name": "3iTech",
      "inn": "7716554066",
      "url": "https://3itech.ru/",
      "description": "Генеративный AI и речевые технологии",
      "features": ["GenAI", "Речь", "TTS", "ASR"],
      status: 'active',
      "revenue": "Активный рост",
      "alsoIn": ["LLM", "Генерация"]
    },
    {
      "name": "Центр речевых технологий",
      "inn": "7813277773",
      "url": "https://speechpro.ru/",
      "description": "Голосовая биометрия, распознавание и синтез речи. Решения для безопасности.",
      "features": ["Биометрия", "TTS", "ASR", "Безопасность"],
      status: 'leader',
      "revenue": "Лидер биометрии"
    }
  ],
  "dl": [
    {
      "name": "МТС AI",
      "inn": "7707767501",
      "url": "https://mts.ai/",
      "description": "ML-решения, Kodify (генерация кода). Полный цикл AI-разработки. Консалтинг и интеграция.",
      "features": ["ML", "Kodify", "Консалтинг", "Интеграция"],
      status: 'leader',
      "revenue": "51.4 млрд ₽",
      "alsoIn": ["LLM", "Аудио", "Видео"],
      "parentInn": "7740000076"
    },
    {
      "name": "Яндекс.Облако",
      "inn": "7704458262",
      "url": "https://yandex.cloud/ru",
      "description": "Yandex AI Studio - платформа для ML. Обучение моделей, инференс, AutoML. GPU кластеры.",
      "features": ["ML-платформа", "GPU", "AutoML", "Инференс"],
      status: 'leader',
      "revenue": "1.34 млрд ₽",
      "alsoIn": ["LLM"],
      "parentInn": "7736207543"
    },
    {
      "name": "Норд Клан",
      "inn": "7325165872",
      "url": "https://nordclan.com/",
      "description": "ML-платформа для промышленности. ML Sense, нейросети для контроля качества. Лидеры цифровизации.",
      "features": ["ML Sense", "Нейросети", "Промышленность", "CV"],
      status: 'leader',
      "revenue": "Лидер цифровизации",
      "alsoIn": ["Видео"]
    },
    {
      "name": "Сбер.AI",
      "url": "https://sber.ai/",
      "description": "Экосистема решений на базе DL. MLOps, предобученные модели, NLP, CV. Полный цикл AI-разработки.",
      "features": ["MLOps", "Предобученные модели", "NLP", "CV"],
      status: 'leader',
      "revenue": "Лидер экосистемы",
      "parentInn": "7707083893"
    },
    {
      "name": "Cloud.ru",
      "inn": "7736279160",
      "url": "https://cloud.ru/",
      "description": "Evolution AI Factory - платформа для GenAI и ML. Распределённое обучение, ML Inference, GPU NVIDIA.",
      "features": ["AI Factory", "ML Inference", "Distributed Train", "GPU"],
      status: 'leader',
      "revenue": "Лидер облачного ИИ"
    },
    {
      "name": "Napoleon IT",
      "inn": "7453230164",
      "url": "https://napoleonit.ru/",
      "description": "ML-разработка, нейросети. AI TALENT HUB с ИТМО. Data Science, Computer Vision.",
      "features": ["ML", "Нейросети", "Data Science", "Обучение"],
      status: 'leader',
      "revenue": "Активный игрок"
    },
    {
      "name": "Content AI",
      "inn": "9715416652",
      "url": "https://contentai.ru/",
      "description": "ML для обработки документов",
      "features": ["ML", "OCR"],
      status: 'active',
      "revenue": "1.2 млрд ₽",
      "alsoIn": ["Видео"]
    },
    {
      "name": "Автомакон",
      "inn": "5003074225",
      "url": "https://automacon.ru/",
      "description": "Big Data и ML",
      "features": ["Big Data", "ML"],
      status: 'active',
      "revenue": "Активный интегратор",
      "alsoIn": ["Видео"]
    },
    {
      "name": "Юзтех",
      "inn": "9723236163",
      "url": "https://usetech.ru/",
      "description": "ML и компьютерное зрение",
      "features": ["ML", "CV"],
      status: 'active',
      "revenue": "Активный игрок",
      "alsoIn": ["Видео"]
    },
    {
      "name": "ZeBrains",
      "inn": "7325145393",
      "url": "https://zebrains.ru/",
      "description": "ML-решения",
      "features": ["AI/ML", "PR"],
      status: 'active',
      "alsoIn": ["Видео"]
    },
    {
      "name": "SimbirSoft",
      "inn": "7300044805",
      "url": "https://www.simbirsoft.com/",
      "description": "ML и глубокое обучение",
      "features": ["ML", "DL"],
      status: 'active'
    },
    {
      "name": "Terabit Digital",
      "inn": "9721112109",
      "url": "https://terabit.ai/",
      "description": "ML-разработка под ключ",
      "features": ["ML", "AI"],
      status: 'active'
    }
  ],
  "gen": [
    {
      "name": "Ainergy",
      "inn": "7840113080",
      "url": "https://ainergy.ru/",
      "description": "Корпоративная платформа генеративного ИИ. Работает в закрытом контуре. Low-code интеграция.",
      "features": ["GenAI", "On-premise", "Low-code", "Корпоративный"],
      status: 'leader',
      "revenue": "4.2 млн ₽",
      "alsoIn": ["LLM"]
    },
    {
      "name": "Rubbles",
      "inn": "7725806256",
      "url": "https://rubbles.ru/",
      "description": "Rubbles Generative AI Suite - платформа генеративных моделей для крупного бизнеса. On-premise.",
      "features": ["GenAI Suite", "On-premise", "Enterprise", "Безопасность"],
      status: 'leader',
      "revenue": "704.9 млн ₽",
      "alsoIn": ["LLM"]
    },
    {
      "name": "Kandinsky",
      "url": "https://fusionbrain.ai/",
      "description": "Kandinsky 5.0 - флагманская российская нейросеть для генерации изображений и видео. Продукт экосистемы Сбера.",
      "features": ["Генерация изображений", "Генерация видео", "Русский язык", "API"],
      status: 'leader',
      "revenue": "Лидер генерации",
      "parentInn": "7707083893"
    },
    {
      "name": "Шедеврум",
      "url": "https://yandex.ru/shedevrum",
      "description": "Мобильное приложение для генерации изображений с помощью ИИ. Интеграция с экосистемой Яндекса.",
      "features": ["Генерация изображений", "Мобильное приложение", "Стили", "Фильтры"],
      status: 'leader',
      "revenue": "Лидер генерации",
      "parentInn": "7736207543"
    },
    {
      "name": "GigaChat",
      "url": "https://giga.chat/",
      "description": "Генерация изображений вместе с текстом. Интеграция с Fusion Brain. Мульти-модальная генерация.",
      "features": ["Генерация текста", "Генерация изображений", "Мульти-модальность"],
      status: 'leader',
      "revenue": "Лидер рынка",
      "alsoIn": ["LLM"],
      "parentInn": "7707083893"
    },
    {
      "name": "YandexART",
      "url": "https://ya.ru/ai/index",
      "description": "YandexGPT + YandexART. Полный цикл генеративного ИИ. Текст, изображения, код.",
      "features": ["Генерация текста", "Генерация изображений", "YandexART"],
      status: 'leader',
      "revenue": "Лидер рынка",
      "alsoIn": ["LLM", "Аудио"],
      "parentInn": "7736207543"
    }
  ],
  "llm": [
    {
      "name": "GigaChat",
      "url": "https://giga.chat/",
      "description": "Флагманская LLM Сбера. Генерация текста, изображений, диалоги. Интеграция с Fusion Brain для генерации визуального контента.",
      "features": ["Генерация текста", "Генерация изображений", "API", "Enterprise"],
      status: 'leader',
      "revenue": "Лидер рынка",
      "alsoIn": ["Генерация"],
      "parentInn": "7707083893"
    },
    {
      "name": "YandexGPT",
      "url": "https://ya.ru/ai/index",
      "description": "Флагманская LLM Яндекса. Версия 4 сопоставима с GPT-4o. Глубокая интеграция с экосистемой Яндекса.",
      "features": ["Генерация текста", "RAG", "API", "Yandex 360"],
      status: 'leader',
      "revenue": "Лидер рынка",
      "alsoIn": ["Аудио", "Генерация"],
      "parentInn": "7736207543"
    },
    {
      "name": "CorpGPT (Нейросети)",
      "inn": "7733349229",
      "url": "https://corpgpt.ru/",
      "description": "No-code платформа для ИИ-агентов",
      "features": ["No-code", "Enterprise"],
      status: 'active'
    },
    {
      "name": "meetAI",
      "inn": "9705223482",
      "url": "https://mymeet.ai/ru/",
      "description": "ИИ-ассистент для встреч",
      "features": ["Транскрибация", "Отчёты"],
      status: 'active'
    },
    {
      "name": "GPTZATOR (Lad)",
      "inn": "5260320971",
      "url": "https://gptzator.ru/",
      "description": "Корпоративный поиск и RAG",
      "features": ["RAG", "Поиск"],
      status: 'active'
    },
    {
      "name": "PROсковья (1С)",
      "inn": "9713015920",
      "url": "https://1cproconsulting.ru/proskovya",
      "description": "ИИ для 1С на базе LLM",
      "features": ["1С", "LLM"],
      status: 'active'
    },
    {
      "name": "AutoFAQ",
      "inn": "5047186705",
      "url": "https://autofaq.ai/",
      "description": "Чат-боты для поддержки",
      "features": ["Поддержка", "Xplain"],
      status: 'active'
    },
    {
      "name": "Robin (Softline)",
      "inn": "9725114756",
      "url": "https://slsoft.ru/products/robin/",
      "description": "RPA + ИИ-ассистент",
      "features": ["RPA", "Ассистент"],
      status: 'active'
    },
    {
      "name": "Шерпа Роботикс",
      "inn": "3019027499",
      "url": "https://sherparpa.ru/",
      "description": "RPA + ИИ-агенты",
      "features": ["RPA", "Автоматизация"],
      status: 'active'
    },
    {
      "name": "Рег.облако",
      "inn": "7733568767",
      "url": "https://reg.cloud/",
      "description": "ИИ-ассистент в облаке",
      "features": ["Ассистент", "Облако"],
      status: 'active'
    },
    {
      "name": "Directum",
      "inn": "1835056809",
      "url": "https://www.directum.ru/",
      "description": "Документооборот с ИИ",
      "features": ["Документы", "ИИ"],
      status: 'active'
    }
  ],
  "video": [
    {
      "name": "VisionLabs",
      "url": "https://visionlabs.ru/",
      "description": "Лидер рынка компьютерного зрения в России. Биометрия, видеоаналитика, распознавание лиц. Международное присутствие.",
      "features": ["Распознавание лиц", "Биометрия", "Видеоаналитика", "CV"],
      status: 'leader',
      "revenue": "Лидер рынка"
    },
    {
      "name": "VizorLabs",
      "url": "https://vizorlabs.ru/",
      "description": "Лидер промышленной видеоаналитики. Мониторинг безопасности труда, контроль СИЗ, детекция нарушений.",
      "features": ["Промышленная CV", "Безопасность", "СИЗ", "Мониторинг"],
      status: 'leader',
      "revenue": "Лидер пром. аналитики"
    },
    {
      "name": "Сбер Бизнес Софт",
      "inn": "7730269550",
      "url": "https://sberbs.ru/",
      "description": "CV-решения",
      "features": ["CV", "ИИ"],
      status: 'active',
      "revenue": "Лидер экосистемы",
      "alsoIn": ["LLM", "Генерация"],
      "parentInn": "7707083893"
    },
    {
      "name": "Наносемантика",
      "inn": "7703761097",
      "url": "https://nanosemantics.ai/",
      "description": "CV-решения, аватары",
      "features": ["CV", "Аватары"],
      status: 'active',
      "revenue": "Лидер NLP",
      "alsoIn": ["LLM", "Аудио"]
    }
  ]
}

async function main() {
  console.log('🌱 Начало заполнения базы данных...')
  console.log('📅 Дата:', new Date().toISOString())

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

  // Очищаем базу данных перед заполнением
  console.log('\n🗑️ Очистка старых данных...')
  await prisma.comment.deleteMany()
  await prisma.company.deleteMany()
  console.log('  ✓ Данные очищены')

  // Карта ИНН -> ID для связывания
  const innToId: Map<string, string> = new Map()
  
  // Создаём специальную категорию для материнских компаний
  const parentCategory = await prisma.category.findFirst({
    where: { key: 'dl' }
  })
  
  if (!parentCategory) {
    throw new Error('Категория dl не найдена')
  }

  // Создаём материнские компании
  console.log('\n🏢 Создание материнских компаний (экосистем)...')
  for (const company of parentCompanies) {
    const validInn = isValidInn(company.inn) ? company.inn : null
    
    const created = await prisma.company.create({
      data: {
        name: company.name,
        inn: validInn,
        url: company.url,
        description: company.description,
        features: JSON.stringify(company.features),
        status: company.status,
        categoryId: parentCategory.id,
      },
    })
    
    if (validInn) {
      innToId.set(validInn, created.id)
    }
    console.log(`  ✓ ${company.name} (ИНН: ${validInn})`)
  }

  // Создаём компании по категориям
  console.log('\n🏢 Создание компаний...')
  let totalCompanies = 0

  for (const [catKey, companies] of Object.entries(companiesByCategory)) {
    const category = await prisma.category.findUnique({ where: { key: catKey } })
    if (!category) continue

    for (const company of companies) {
      const validInn = isValidInn(company.inn) ? company.inn : null
      
      // Определяем parentCompanyId если есть parentInn
      let parentCompanyId: string | null = null
      if (company.parentInn && innToId.has(company.parentInn)) {
        parentCompanyId = innToId.get(company.parentInn)!
      }
      
      const created = await prisma.company.create({
        data: {
          name: company.name,
          inn: validInn,
          url: company.url,
          description: company.description,
          features: JSON.stringify(company.features),
          status: company.status,
          revenue: company.revenue,
          alsoIn: company.alsoIn ? JSON.stringify(company.alsoIn) : null,
          isPartner: company.isPartner || false,
          categoryId: category.id,
          parentCompanyId: parentCompanyId,
        },
      })
      
      // Сохраняем ИНН для связи с дочерними (если понадобится)
      if (validInn) {
        innToId.set(validInn, created.id)
      }
      
      totalCompanies++
    }

    console.log(`  📊 ${category.title}: ${companies.length} компаний`)
  }

  console.log(`\n✅ Готово! Всего создано ${totalCompanies + parentCompanies.length} компаний`)

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
    const withInn = await prisma.company.count({
      where: { categoryId: cat.id, inn: { not: null } },
    })
    console.log(`  ${cat.title}: ${cat._count.companies} компаний (${leaders} лидеров, ${withInn} с ИНН)`)
  }

  // Проверка связей с материнскими компаниями
  const withParent = await prisma.company.count({
    where: { parentCompanyId: { not: null } }
  })
  console.log(`\n🔗 Компаний с материнской компанией: ${withParent}`)

  // Проверка дубликатов по имени
  console.log('\n📋 Проверка дубликатов по имени:')
  const allCompanies = await prisma.company.findMany({
    select: { name: true, inn: true, category: { select: { title: true } } }
  })
  
  const nameCounts: Record<string, number> = {}
  for (const c of allCompanies) {
    nameCounts[c.name] = (nameCounts[c.name] || 0) + 1
  }
  
  for (const [name, count] of Object.entries(nameCounts)) {
    if (count > 1) {
      console.log(`  ⚠️ ${name}: ${count} записей в разных категориях`)
      const duplicates = allCompanies.filter(c => c.name === name)
      for (const d of duplicates) {
        console.log(`    - ${d.category.title}${d.inn ? ` (ИНН: ${d.inn})` : ' (без ИНН)'}`)
      }
    }
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
