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
      "description": "Digital2Speech - речевая аналитика, голосовая биометрия. Топ-10 рынка ИИ.",
      "features": ["Digital2Speech", "Речевая аналитика", "Биометрия", "Суфлёр"],
      status: 'leader',
      "revenue": "3.1 млрд ₽",
      "alsoIn": ["LLM"]
    },
    {
      "name": "Naumen",
      "inn": "6671111140",
      "url": "https://www.naumen.ru/",
      "description": "Naumen Speech AI, Erudite - речевая аналитика для контакт-центров. Контроль качества, поиск.",
      "features": ["Speech AI", "Erudite", "Контакт-центры", "Enterprise Search"],
      status: 'leader',
      "revenue": "1.45 млрд ₽"
    },
    {
      "name": "VS Robotics",
      "inn": "7736303529",
      "url": "https://vsrobotics.ru/",
      "description": "Голосовые роботы для контакт-центров. Робот-оператор, речевая аналитика, платформа для разметки данных.",
      "features": ["Робот-оператор", "Речевая аналитика", "Разметка данных", "Транскрибация"],
      status: 'leader',
      "revenue": "2.4 млрд ₽"
    },
    {
      "name": "Neovox",
      "inn": "7723813089",
      "url": "https://neovox.ru/",
      "description": "Голосовые роботы, чат-боты, RPA, речевая аналитика.",
      "features": ["Голосовые роботы", "Чат-боты", "RPA", "Речевая аналитика"],
      status: 'active',
      "revenue": "67 млн ₽"
    },
    {
      "name": "3iTech",
      "inn": "7716554066",
      "url": "https://3itech.ru/",
      "description": "3i TouchPoint Analytics, 3iLLM - речевые технологии и генеративный AI.",
      "features": ["3iLLM", "TouchPoint Analytics", "TTS", "ASR"],
      status: 'leader',
      "revenue": "417 млн ₽",
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
      "revenue": "24.4 млрд ₽",
      "alsoIn": ["LLM", "Генерация"]
    },
    {
      "name": "Napoleon IT",
      "inn": "7453230164",
      "url": "https://napoleonit.ru/",
      "description": "ML-разработка, Computer Vision. AI TALENT HUB с ИТМО. Заказчики: Магнит, Лента, Hoff.",
      "features": ["ML", "Computer Vision", "Data Science", "Обучение"],
      status: 'leader',
      "revenue": "413 млн ₽",
      "alsoIn": ["Видео"]
    },
    {
      "name": "Content AI",
      "inn": "9715416652",
      "url": "https://contentai.ru/",
      "description": "ContentCapture, ContentReader PDF, Intelligent Search - обработка документов и поиск.",
      "features": ["ContentCapture", "OCR", "Intelligent Search", "PDF"],
      status: 'leader',
      "revenue": "1.2 млрд ₽",
      "alsoIn": ["LLM", "Видео"]
    },
    {
      "name": "Автомакон",
      "inn": "5003074225",
      "url": "https://automacon.ru/",
      "description": "BI-системы, нейроанализ отзывов, AiDoc, ИИ-ассистенты. Интегратор ИИ-решений.",
      "features": ["BI", "Нейроанализ", "AiDoc", "Ассистенты"],
      status: 'active',
      "revenue": "750 млн ₽",
      "alsoIn": ["LLM"]
    },
    {
      "name": "Юзтех",
      "inn": "9723236163",
      "url": "https://usetech.ru/",
      "description": "Цифровые двойники рисков, CV, LLM, речевая аналитика, рекомендательные системы.",
      "features": ["Цифровые двойники", "CV", "LLM", "Речевая аналитика"],
      status: 'active',
      "revenue": "965 млн ₽",
      "alsoIn": ["Видео", "LLM", "Аудио"]
    },
    {
      "name": "ZeBrains",
      "inn": "7325145393",
      "url": "https://zebrains.ru/",
      "description": "Цифровые сотрудники (ИИ-агенты), Virtual try-on, модели прогнозирования, CV.",
      "features": ["ИИ-агенты", "Virtual try-on", "Прогнозирование", "CV"],
      status: 'active',
      "revenue": "227 млн ₽",
      "alsoIn": ["Видео", "LLM"]
    },
    {
      "name": "SimbirSoft",
      "inn": "7300044805",
      "url": "https://www.simbirsoft.com/",
      "description": "ML и глубокое обучение. Заказчики: Аскона, Технониколь, HeadHunter, Татнефть, ВкусВилл.",
      "features": ["ML", "DL", "Интеграция", "Разработка"],
      status: 'active',
      "revenue": "476 млн ₽"
    },
    {
      "name": "Terabit Digital",
      "inn": "9721112109",
      "url": "https://terabit.ai/",
      "description": "ML-разработка под ключ",
      "features": ["ML", "AI"],
      status: 'active'
    },
    {
      "name": "Онланта (ГК Ланит)",
      "inn": "7722653629",
      "url": "https://onlanta.ru/",
      "description": "Onlanta AI Hub - платформа генеративного ИИ для корпоративного сектора. Входит в ГК Ланит.",
      "features": ["AI Hub", "GenAI", "Enterprise", "Платформа"],
      status: 'active',
      "revenue": "3.5 млрд ₽",
      "alsoIn": ["LLM", "Генерация"]
    },
    {
      "name": "Red_mad_robot",
      "inn": "7703435262",
      "url": "https://redmadrobot.ru/",
      "description": "RAG, LLM, VLM решения. Цифровые продукты для крупного бизнеса. RAG-системы, векторные БД.",
      "features": ["RAG", "LLM", "VLM", "Vector DB"],
      status: 'active',
      "revenue": "1.1 млрд ₽",
      "alsoIn": ["LLM"]
    },
    {
      "name": "ITFB Group",
      "inn": "7702775650",
      "url": "https://itfbgroup.ru/",
      "description": "Polina AI, EasyDoc - ИИ-решения для документооборота и аналитики.",
      "features": ["Polina AI", "EasyDoc", "Документы", "Аналитика"],
      status: 'active',
      "revenue": "505 млн ₽",
      "alsoIn": ["LLM"]
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
      "description": "No-code платформа для ИИ-агентов. Заказчики: Норникель, Сколково, Ростелеком, Росатом.",
      "features": ["No-code", "CorpGPT", "Enterprise", "RAG"],
      status: 'leader',
      "revenue": "20.5 млн ₽"
    },
    {
      "name": "meetAI",
      "inn": "9705223482",
      "url": "https://mymeet.ai/ru/",
      "description": "ИИ-ассистент для встреч и проектов. Заказчики: Контур, Сбер, Яндекс, Ozon.",
      "features": ["Транскрибация", "Отчёты", "Встречи", "Проекты"],
      status: 'active',
      "revenue": "7.8 млн ₽"
    },
    {
      "name": "GPTZATOR (Lad)",
      "inn": "5260320971",
      "url": "https://gptzator.ru/",
      "description": "Корпоративный поиск и RAG. Заказчик: Газпромтранс.",
      "features": ["RAG", "Корпоративный поиск", "Конференц-связь", "LLM"],
      status: 'active',
      "revenue": "63 млн ₽"
    },
    {
      "name": "PROсковья (1С)",
      "inn": "9713015920",
      "url": "https://1cproconsulting.ru/proskovya",
      "description": "ИИ для 1С на базе LLM. Интеграция с экосистемой 1С.",
      "features": ["1С", "LLM", "Интеграция", "Автоматизация"],
      status: 'active',
      "revenue": "26 млн ₽"
    },
    {
      "name": "AutoFAQ",
      "inn": "5047186705",
      "url": "https://autofaq.ai/",
      "description": "AutoFAQ, Xplain AI Copilot - чат-боты для поддержки. Ростелеком, Газпромбанк, ВТБ, МТС.",
      "features": ["Чат-боты", "Xplain", "Поддержка", "Copilot"],
      status: 'leader',
      "revenue": "161 млн ₽"
    },
    {
      "name": "Robin (Softline)",
      "inn": "9725114756",
      "url": "https://slsoft.ru/products/robin/",
      "description": "RPA + ИИ-ассистент. Заказчики: Аэрофлот, РусГидро, Газпром, РЖД.",
      "features": ["RPA", "Ассистент", "Автоматизация", "Cloud"],
      status: 'leader',
      "revenue": "599 млн ₽"
    },
    {
      "name": "Шерпа Роботикс",
      "inn": "3019027499",
      "url": "https://sherparpa.ru/",
      "description": "Sherpa AI Server - RPA + ИИ-агенты. Заказчики: Лемана Про, билайн, Северсталь.",
      "features": ["Sherpa AI Server", "RPA", "ИИ-агенты", "Автоматизация"],
      status: 'leader',
      "revenue": "95 млн ₽"
    },
    {
      "name": "Рег.облако",
      "inn": "7733568767",
      "url": "https://reg.cloud/",
      "description": "ИИ-ассистент в облаке. Заказчики: Boxberry, РБК, Фабрика данных.",
      "features": ["ИИ-ассистент", "Облако", "Enterprise", "SaaS"],
      status: 'leader',
      "revenue": "3.6 млрд ₽"
    },
    {
      "name": "Directum",
      "inn": "1835056809",
      "url": "https://www.directum.ru/",
      "description": "ИИ-сервисы Ario (OCR, ML, LLM, NLP). Документооборот с ИИ.",
      "features": ["Ario", "OCR", "LLM", "NLP"],
      status: 'leader',
      "revenue": "2.2 млрд ₽"
    }
  ],
  "video": [
    {
      "name": "VisionLabs",
      "inn": "7701954054",
      "url": "https://visionlabs.ru/",
      "description": "Лидер рынка компьютерного зрения в России. Биометрия, видеоаналитика, распознавание лиц. Входит в экосистему МТС.",
      "features": ["Распознавание лиц", "Биометрия", "Видеоаналитика", "CV"],
      status: 'leader',
      "revenue": "1.1+ млрд ₽",
      "parentInn": "7740000076"
    },
    {
      "name": "VizorLabs",
      "inn": "7731395981",
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
      "description": "DialogOS, NLab Speech (ASR/TTS), NLab Marker - CV-решения, аватары, чат-боты.",
      "features": ["DialogOS", "NLab Speech", "CV", "Аватары"],
      status: 'leader',
      "revenue": "372 млн ₽",
      "alsoIn": ["LLM", "Аудио"]
    },
    {
      "name": "АСТ",
      "inn": "7724244406",
      "url": "https://acti.ru/",
      "description": "Neurotrack - интеллектуальная видеоаналитика. Решения для транспорта, безопасности, промышленности.",
      "features": ["Neurotrack", "Видеоаналитика", "LPR", "Безопасность"],
      status: 'active',
      "revenue": "1.2 млрд ₽"
    },
    {
      "name": "Rubius",
      "inn": "7017252288",
      "url": "https://rubius.com/ru",
      "description": "CV-системы для контроля качества, прогноз спроса, управление доступностью товаров.",
      "features": ["CV", "Прогнозирование", "Контроль качества", "Ритейл"],
      status: 'active',
      "revenue": "Активный игрок"
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
