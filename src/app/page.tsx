'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  MessageSquare, 
  Mic, 
  Video, 
  Brain, 
  Sparkles, 
  TrendingUp, 
  Building2, 
  DollarSign,
  ExternalLink,
  Rocket,
  Target,
  BarChart3,
  Layers,
  AlertTriangle,
  PieChart,
  LayoutGrid,
  List,
  Shield,
  Server,
  Calculator,
  CheckCircle,
  XCircle,
  Minus,
  Search,
  X
} from 'lucide-react'

// Текущий год
const CURRENT_YEAR = 2026

// Общий обзор рынка (источники: TAdviser, РБК, НИУ ВШЭ)
const marketOverview = {
  totalMarket: '433 млрд ₽',
  totalMarketNote: 'Big Data + ИИ (2024-2025)',
  directMarket: '117,7 млрд ₽',
  directMarketNote: 'Рынок ИИ напрямую (РБК)',
  investments: '305 млрд ₽',
  investmentsNote: 'Инвестиции в ИИ (TAdviser)',
  growth: '+38%',
  growthSource: 'РБК',
  companies: '150+',
  forecast2030: '11,6 трлн ₽',
  forecast2030Note: 'Вклад ИИ в ВВП РФ (НИУ ВШЭ)'
}

// Типизация компании
interface Company {
  name: string
  inn?: string
  url: string
  description: string
  features: string[]
  status: 'leader' | 'active'
  revenue?: string
  alsoIn?: string[]
}

// Данные по технологиям с разделением на топ-6 и остальные
const techData = {
  llm: {
    title: 'LLM (Чат-боты)',
    description: 'Большие языковые модели для генерации текста и диалогов',
    marketSize: 'Входит в топ сегменты рынка ИИ',
    growth: 'Активное развитие с 2023 года',
    icon: MessageSquare,
    leaders: [
      {
        name: 'GigaChat (Сбер)',
        url: 'https://giga.chat/',
        description: 'Флагманская LLM Сбера. Генерация текста, изображений, диалоги. Интеграция с Fusion Brain для генерации визуального контента.',
        features: ['Генерация текста', 'Генерация изображений', 'API', 'Enterprise'],
        status: 'leader' as const,
        revenue: 'Лидер рынка',
        alsoIn: ['Генерация']
      },
      {
        name: 'YandexGPT',
        url: 'https://ya.ru/ai/index',
        description: 'Флагманская LLM Яндекса. Версия 4 сопоставима с GPT-4o. Глубокая интеграция с экосистемой Яндекса.',
        features: ['Генерация текста', 'RAG', 'API', 'Yandex 360'],
        status: 'leader' as const,
        revenue: 'Лидер рынка',
        alsoIn: ['Аудио', 'Генерация']
      },
      {
        name: 'MWS AI (МТС)',
        inn: '7707767501',
        url: 'https://mts.ai/',
        description: 'Платформа MWS GPT. ИИ-агенты на любых моделях. До 100 тыс. диалогов в день. Kodify для генерации кода.',
        features: ['MWS GPT', 'ИИ-агенты', 'Kodify', 'NLP'],
        status: 'leader' as const,
        revenue: '51.4 млрд ₽',
        alsoIn: ['Аудио', 'Видео', 'DL']
      },
      {
        name: 'Just AI',
        inn: '7813286694',
        url: 'https://just-ai.com/',
        description: 'Платформа JAICP для чат-ботов и голосовых ассистентов. Jay Copilot, Caila. 14 лет опыта в разговорном AI.',
        features: ['JAICP', 'Чат-боты', 'Голосовые боты', 'RAG'],
        status: 'leader' as const,
        revenue: '633 млн ₽',
        alsoIn: ['Аудио']
      },
      {
        name: 'Яндекс.Облако',
        inn: '7704458262',
        url: 'https://yandex.cloud/ru',
        description: 'ML-платформа Yandex AI Studio. Обучение и развертывание моделей. AutoML, инференс LLM.',
        features: ['ML-платформа', 'LLM инференс', 'AutoML', 'GPU'],
        status: 'leader' as const,
        revenue: '1.34 млрд ₽',
        alsoIn: ['DL']
      },
      {
        name: 'Сбер Бизнес Софт',
        inn: '7730269550',
        url: 'https://sberbs.ru/',
        description: 'ИИ-платформа для бизнеса. Готовые сервисы на основе ИИ. Интеграция с экосистемой Сбера.',
        features: ['ИИ-платформа', 'Чат-боты', 'CV-решения', 'Интеграции'],
        status: 'leader' as const,
        revenue: 'Лидер экосистемы',
        alsoIn: ['Видео', 'Генерация']
      }
    ],
    others: [
      { name: 'CorpGPT (Нейросети)', inn: '7733349229', url: 'https://corpgpt.ru/', description: 'No-code платформа для ИИ-агентов', features: ['No-code', 'Enterprise'], status: 'active' as const },
      { name: 'meetAI', inn: '9705223482', url: 'https://mymeet.ai/ru/', description: 'ИИ-ассистент для встреч', features: ['Транскрибация', 'Отчёты'], status: 'active' as const },
      { name: 'GPTZATOR (Lad)', inn: '5260320971', url: 'https://gptzator.ru/', description: 'Корпоративный поиск и RAG', features: ['RAG', 'Поиск'], status: 'active' as const },
      { name: 'PROсковья (1С)', inn: '9713015920', url: 'https://1cproconsulting.ru/proskovya', description: 'ИИ для 1С на базе LLM', features: ['1С', 'LLM'], status: 'active' as const },
      { name: 'AutoFAQ', inn: '5047186705', url: 'https://autofaq.ai/', description: 'Чат-боты для поддержки', features: ['Поддержка', 'Xplain'], status: 'active' as const },
      { name: 'Robin (Softline)', inn: '9725114756', url: 'https://slsoft.ru/products/robin/', description: 'RPA + ИИ-ассистент', features: ['RPA', 'Ассистент'], status: 'active' as const },
      { name: 'Ainergy', inn: '7840113080', url: 'https://ainergy.ru/', description: 'Корпоративный генеративный ИИ', features: ['GenAI', 'On-premise'], status: 'active' as const, alsoIn: ['Генерация'] },
      { name: 'Шерпа Роботикс', inn: '3019027499', url: 'https://sherparpa.ru/', description: 'RPA + ИИ-агенты', features: ['RPA', 'Автоматизация'], status: 'active' as const },
      { name: 'Rubbles', inn: '7725806256', url: 'https://rubbles.ru/', description: 'GenAI Suite для бизнеса', features: ['GenAI', 'Suite'], status: 'active' as const, revenue: '704.9 млн ₽', alsoIn: ['Генерация'] },
      { name: 'Рег.облако', inn: '7733568767', url: 'https://reg.cloud/', description: 'ИИ-ассистент в облаке', features: ['Ассистент', 'Облако'], status: 'active' as const },
      { name: 'Наносемантика', inn: '7703761097', url: 'https://nanosemantics.ai/', description: 'Чат-боты, виртуальные ассистенты', features: ['NLP', 'Чат-боты'], status: 'active' as const, alsoIn: ['Аудио', 'Видео'] },
      { name: 'Directum', inn: '1835056809', url: 'https://www.directum.ru/', description: 'Документооборот с ИИ', features: ['Документы', 'ИИ'], status: 'active' as const },
      { name: 'BSS', inn: '7726587769', url: 'https://bssys.com/', description: 'Чат-платформа, речевая аналитика', features: ['Чат-платформа', 'Аналитика'], status: 'active' as const, alsoIn: ['Аудио'] }
    ]
  },
  audio: {
    title: 'Аудио-аналитика',
    description: 'Технологии распознавания и синтеза речи, голосовые помощники',
    marketSize: '7+ млрд ₽',
    growth: '+25% в год',
    icon: Mic,
    leaders: [
      {
        name: 'Just AI',
        inn: '7813286694',
        url: 'https://just-ai.com/',
        description: 'Aimyvoice - маркетплейс готовых голосов. Голосовые чат-боты. Платформа JAICP. 14 лет опыта.',
        features: ['TTS', 'Голосовые боты', 'Aimyvoice', 'STT'],
        status: 'leader' as const,
        revenue: '633 млн ₽',
        alsoIn: ['LLM']
      },
      {
        name: 'Naumen',
        inn: '6671111140',
        url: 'https://www.naumen.ru/',
        description: 'Речевая аналитика для контакт-центров. Распознавание речи, анализ звонков, контроль качества.',
        features: ['Речевая аналитика', 'ASR', 'Контакт-центры', 'Sentiment'],
        status: 'leader' as const,
        revenue: 'Лидер контакт-центров'
      },
      {
        name: '3iTech',
        inn: '7716554066',
        url: 'https://3itech.ru/',
        description: 'Вендор речевых технологий с ИИ. Генеративный AI для бизнеса. Решения для CX.',
        features: ['Речевые технологии', 'GenAI', 'CX', 'Биометрия'],
        status: 'leader' as const,
        revenue: 'Активный рост',
        alsoIn: ['LLM', 'Генерация']
      },
      {
        name: 'BSS',
        inn: '7726587769',
        url: 'https://bssys.com/',
        description: 'Речевая аналитика, голосовая биометрия, тренажёр оператора. Топ-10 рынка ИИ.',
        features: ['Речевая аналитика', 'Биометрия', 'Суфлёр', 'Тренажёр'],
        status: 'leader' as const,
        revenue: 'Топ-10 рынка',
        alsoIn: ['LLM']
      },
      {
        name: 'Наносемантика',
        inn: '7703761097',
        url: 'https://nanosemantics.ai/',
        description: 'Голосовые ассистенты и виртуальные собеседники. NLP, речевые технологии. Основана в 2005.',
        features: ['Голосовые ассистенты', 'NLP', 'Диалоги', 'Аватары'],
        status: 'leader' as const,
        revenue: 'Лидер NLP',
        alsoIn: ['LLM', 'Видео']
      },
      {
        name: 'VS Robotics',
        inn: '7736303529',
        url: 'https://vsrobotics.ru/',
        description: 'Голосовые роботы для контакт-центров. Распознавание речи, анализ эмоций, транскрибация.',
        features: ['Голосовой робот', 'ASR', 'Эмоции', 'Транскрибация'],
        status: 'leader' as const,
        revenue: 'Активный игрок'
      }
    ],
    others: [
      { name: 'Neovox', inn: '7723813089', url: 'https://neovox.ru/', description: 'Речевая аналитика, транскрибация', features: ['ASR', 'Аналитика'], status: 'active' as const },
      { name: 'MWS AI (МТС)', inn: '7707767501', url: 'https://mts.ai/', description: 'Речевые технологии', features: ['NLP', 'ASR'], status: 'active' as const, alsoIn: ['LLM', 'Видео', 'DL'] }
    ]
  },
  video: {
    title: 'Видео-аналитика',
    description: 'Компьютерное зрение, распознавание лиц, анализ видеопотоков',
    marketSize: '22,6 млрд ₽',
    growth: '+14% в год до 2030',
    icon: Video,
    leaders: [
      {
        name: 'VisionLabs',
        url: 'https://visionlabs.ru/',
        description: 'Лидер рынка компьютерного зрения в России. Биометрия, видеоаналитика, распознавание лиц. Международное присутствие.',
        features: ['Распознавание лиц', 'Биометрия', 'Видеоаналитика', 'CV'],
        status: 'leader' as const,
        revenue: 'Лидер рынка'
      },
      {
        name: 'VizorLabs',
        url: 'https://vizorlabs.ru/',
        description: 'Лидер промышленной видеоаналитики. Мониторинг безопасности труда, контроль СИЗ, детекция нарушений.',
        features: ['Промышленная CV', 'Безопасность', 'СИЗ', 'Мониторинг'],
        status: 'leader' as const,
        revenue: 'Лидер пром. аналитики'
      },
      {
        name: 'Content AI',
        inn: '9715416652',
        url: 'https://contentai.ru/',
        description: 'Интеллектуальная обработка документов. OCR, потоковое сканирование, нейросети для чтения документов.',
        features: ['OCR', 'Обработка документов', 'Сканирование', 'CV'],
        status: 'leader' as const,
        revenue: '1.2 млрд ₽',
        alsoIn: ['DL']
      },
      {
        name: 'Норд Клан',
        inn: '7325165872',
        url: 'https://nordclan.com/',
        description: 'ML Sense - машинное зрение для промышленности. Контроль качества, детекция дефектов. Лидеры цифровизации 2025.',
        features: ['ML Sense', 'Контроль качества', 'Дефекты', 'Промышленность'],
        status: 'leader' as const,
        revenue: 'Лидер цифровизации',
        alsoIn: ['DL']
      },
      {
        name: 'Автомакон (Неурус)',
        inn: '5003074225',
        url: 'https://automacon.ru/',
        description: 'Неурус - промышленная видеоаналитика. AI-видеоаналитика для ритейла, контроль качества, мониторинг.',
        features: ['Промышленная CV', 'Ритейл', 'AI-аналитика', 'Big Data'],
        status: 'leader' as const,
        revenue: 'Активный интегратор',
        alsoIn: ['DL']
      },
      {
        name: 'Юзтех',
        inn: '9723236163',
        url: 'https://usetech.ru/',
        description: 'Компьютерное зрение и машинное обучение. Системы машинного зрения для СИЗ, детектирование объектов.',
        features: ['CV', 'ML', 'СИЗ', 'Детектирование'],
        status: 'leader' as const,
        revenue: 'Активный игрок',
        alsoIn: ['DL']
      }
    ],
    others: [
      { name: 'ZeBrains', inn: '7325145393', url: 'https://zebrains.ru/', description: 'CV для поиска дефектов', features: ['CV', 'ML'], status: 'active' as const, alsoIn: ['DL'] },
      { name: 'MWS AI (МТС)', inn: '7707767501', url: 'https://mts.ai/', description: 'Компьютерное зрение', features: ['CV', 'NLP'], status: 'active' as const, alsoIn: ['LLM', 'Аудио', 'DL'] },
      { name: 'Сбер Бизнес Софт', inn: '7730269550', url: 'https://sberbs.ru/', description: 'CV-решения', features: ['CV', 'ИИ'], status: 'active' as const, alsoIn: ['LLM', 'Генерация'] },
      { name: 'Наносемантика', inn: '7703761097', url: 'https://nanosemantics.ai/', description: 'CV-решения, аватары', features: ['CV', 'Аватары'], status: 'active' as const, alsoIn: ['LLM', 'Аудио'] }
    ]
  },
  dl: {
    title: 'Глубокое обучение (Deep Learning)',
    description: 'Нейронные сети для сложных задач машинного обучения',
    marketSize: 'Основа всех ИИ-решений',
    growth: '+30% глобальный рост',
    icon: Brain,
    leaders: [
      {
        name: 'Сбер.AI',
        url: 'https://sber.ai/',
        description: 'Экосистема решений на базе DL. MLOps, предобученные модели, NLP, CV. Полный цикл AI-разработки.',
        features: ['MLOps', 'Предобученные модели', 'NLP', 'CV'],
        status: 'leader' as const,
        revenue: 'Лидер экосистемы'
      },
      {
        name: 'Яндекс.Облако',
        inn: '7704458262',
        url: 'https://yandex.cloud/ru',
        description: 'Yandex AI Studio - платформа для ML. Обучение моделей, инференс, AutoML. GPU кластеры.',
        features: ['ML-платформа', 'GPU', 'AutoML', 'Инференс'],
        status: 'leader' as const,
        revenue: '1.34 млрд ₽',
        alsoIn: ['LLM']
      },
      {
        name: 'Cloud.ru',
        inn: '7736279160',
        url: 'https://cloud.ru/',
        description: 'Evolution AI Factory - платформа для GenAI и ML. Распределённое обучение, ML Inference, GPU NVIDIA.',
        features: ['AI Factory', 'ML Inference', 'Distributed Train', 'GPU'],
        status: 'leader' as const,
        revenue: 'Лидер облачного ИИ'
      },
      {
        name: 'MWS AI (МТС)',
        inn: '7707767501',
        url: 'https://mts.ai/',
        description: 'ML-решения, Kodify (генерация кода). Полный цикл AI-разработки. Консалтинг и интеграция.',
        features: ['ML', 'Kodify', 'Консалтинг', 'Интеграция'],
        status: 'leader' as const,
        revenue: '51.4 млрд ₽',
        alsoIn: ['LLM', 'Аудио', 'Видео']
      },
      {
        name: 'Норд Клан',
        inn: '7325165872',
        url: 'https://nordclan.com/',
        description: 'ML-платформа для промышленности. ML Sense, нейросети для контроля качества. Лидеры цифровизации.',
        features: ['ML Sense', 'Нейросети', 'Промышленность', 'CV'],
        status: 'leader' as const,
        revenue: 'Лидер цифровизации',
        alsoIn: ['Видео']
      },
      {
        name: 'Napoleon IT',
        inn: '7453230164',
        url: 'https://napoleonit.ru/',
        description: 'ML-разработка, нейросети. AI TALENT HUB с ИТМО. Data Science, Computer Vision.',
        features: ['ML', 'Нейросети', 'Data Science', 'Обучение'],
        status: 'leader' as const,
        revenue: 'Активный игрок'
      }
    ],
    others: [
      { name: 'Content AI', inn: '9715416652', url: 'https://contentai.ru/', description: 'ML для обработки документов', features: ['ML', 'OCR'], status: 'active' as const, alsoIn: ['Видео'] },
      { name: 'Юзтех', inn: '9723236163', url: 'https://usetech.ru/', description: 'ML и компьютерное зрение', features: ['ML', 'CV'], status: 'active' as const, alsoIn: ['Видео'] },
      { name: 'Автомакон', inn: '5003074225', url: 'https://automacon.ru/', description: 'Big Data и ML', features: ['Big Data', 'ML'], status: 'active' as const, alsoIn: ['Видео'] },
      { name: 'ZeBrains', inn: '7325145393', url: 'https://zebrains.ru/', description: 'ML-решения', features: ['AI/ML', 'PR'], status: 'active' as const, alsoIn: ['Видео'] },
      { name: 'SimbirSoft', inn: '7300044805', url: 'https://www.simbirsoft.com/', description: 'ML и глубокое обучение', features: ['ML', 'DL'], status: 'active' as const },
      { name: 'Terabit Digital', inn: '9721112109', url: 'https://terabit.ai/', description: 'ML-разработка под ключ', features: ['ML', 'AI'], status: 'active' as const }
    ]
  },
  gen: {
    title: 'Генеративный ИИ',
    description: 'Создание контента: изображения, видео, аудио, текст',
    marketSize: 'Быстрорастущий сегмент',
    growth: 'Экспоненциальный рост',
    icon: Sparkles,
    leaders: [
      {
        name: 'Kandinsky (Сбер)',
        url: 'https://fusionbrain.ai/',
        description: 'Kandinsky 5.0 - флагманская российская нейросеть для генерации изображений и видео по текстовому описанию на русском.',
        features: ['Генерация изображений', 'Генерация видео', 'Русский язык', 'API'],
        status: 'leader' as const,
        revenue: 'Лидер генерации'
      },
      {
        name: 'Шедеврум (Яндекс)',
        url: 'https://yandex.ru/',
        description: 'Мобильное приложение для генерации изображений с помощью ИИ. Интеграция с экосистемой Яндекса.',
        features: ['Генерация изображений', 'Мобильное приложение', 'Стили', 'Фильтры'],
        status: 'leader' as const,
        revenue: 'Лидер генерации'
      },
      {
        name: 'GigaChat (Сбер)',
        url: 'https://giga.chat/',
        description: 'Генерация изображений вместе с текстом. Интеграция с Fusion Brain. Мульти-модальная генерация.',
        features: ['Генерация текста', 'Генерация изображений', 'Мульти-модальность'],
        status: 'leader' as const,
        revenue: 'Лидер рынка',
        alsoIn: ['LLM']
      },
      {
        name: 'Yandex',
        url: 'https://ya.ru/ai/index',
        description: 'YandexGPT + YandexART. Полный цикл генеративного ИИ. Текст, изображения, код.',
        features: ['Генерация текста', 'Генерация изображений', 'YandexART'],
        status: 'leader' as const,
        revenue: 'Лидер рынка',
        alsoIn: ['LLM', 'Аудио']
      },
      {
        name: 'Rubbles',
        inn: '7725806256',
        url: 'https://rubbles.ru/',
        description: 'Rubbles Generative AI Suite - платформа генеративных моделей для крупного бизнеса. On-premise.',
        features: ['GenAI Suite', 'On-premise', 'Enterprise', 'Безопасность'],
        status: 'leader' as const,
        revenue: '704.9 млн ₽',
        alsoIn: ['LLM']
      },
      {
        name: 'Ainergy',
        inn: '7840113080',
        url: 'https://ainergy.ru/',
        description: 'Корпоративная платформа генеративного ИИ. Работает в закрытом контуре. Low-code интеграция.',
        features: ['GenAI', 'On-premise', 'Low-code', 'Корпоративный'],
        status: 'leader' as const,
        revenue: '4.2 млн ₽',
        alsoIn: ['LLM']
      }
    ],
    others: [
      { name: '3iTech', inn: '7716554066', url: 'https://3itech.ru/', description: 'Генеративный AI', features: ['GenAI', 'Речь'], status: 'active' as const, alsoIn: ['LLM', 'Аудио'] }
    ]
  }
}

// Цвета для бейджей направлений
const directionColors: Record<string, string> = {
  'LLM': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  'Аудио': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  'Видео': 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  'DL': 'bg-teal-500/10 text-teal-600 border-teal-500/20',
  'Генерация': 'bg-pink-500/10 text-pink-600 border-pink-500/20'
}

// ============================================
// КОМПОНЕНТ: Карточка лидера (большая)
// ============================================
function LeaderCard({ company, isHighlighted }: { company: Company; isHighlighted?: boolean }) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <Card 
      className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/30 h-full flex flex-col
        ${isHighlighted ? 'ring-2 ring-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/30' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-bold truncate">{company.name}</CardTitle>
            {company.inn && (
              <CardDescription className="text-xs text-muted-foreground mt-1">
                ИНН: {company.inn}
              </CardDescription>
            )}
          </div>
          <div className="flex flex-col gap-1 items-end flex-shrink-0">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 whitespace-nowrap">
              Лидер
            </Badge>
            {company.revenue && (
              <Badge variant="secondary" className="text-xs whitespace-nowrap max-w-full truncate">
                {company.revenue}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-shrink-0">
          {company.description}
        </p>
        <div className="flex flex-wrap gap-1.5 flex-shrink-0">
          {company.features.map((feature, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {feature}
            </Badge>
          ))}
        </div>
        {company.alsoIn && company.alsoIn.length > 0 && (
          <div className="pt-2 border-t flex-shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
              <Layers className="h-3 w-3" />
              <span>Также специализируется на:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {company.alsoIn.map((area, idx) => (
                <Badge key={idx} variant="outline" className={`text-xs ${directionColors[area] || ''}`}>
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        )}
        <div className="mt-auto pt-3">
          <Button 
            variant={isHovered ? "default" : "outline"}
            size="sm" 
            className="w-full transition-all"
            onClick={() => window.open(company.url, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Перейти на сайт
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================
// КОМПОНЕНТ: Мини-карточка
// ============================================
function MiniCard({ company, isHighlighted }: { company: Company; isHighlighted?: boolean }) {
  return (
    <Card className={`group hover:shadow-md transition-all duration-200 hover:border-primary/30 h-full flex flex-col
      ${isHighlighted ? 'ring-2 ring-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/30' : ''}`}>
      <CardContent className="p-3 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{company.name}</h4>
            {company.revenue && (
              <p className="text-xs text-muted-foreground truncate">{company.revenue}</p>
            )}
          </div>
          {company.alsoIn && company.alsoIn.length > 0 && (
            <div className="flex gap-0.5 flex-shrink-0">
              {company.alsoIn.slice(0, 2).map((area, idx) => (
                <Badge key={idx} variant="outline" className={`text-[10px] px-1 whitespace-nowrap ${directionColors[area] || ''}`}>
                  {area}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-2 flex-1">
          {company.description}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-wrap gap-1">
            {company.features.slice(0, 2).map((feature, idx) => (
              <Badge key={idx} variant="secondary" className="text-[10px]">
                {feature}
              </Badge>
            ))}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-xs"
            onClick={() => window.open(company.url, '_blank')}
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================
// КОМПОНЕНТ: Секция категории (Вариант A)
// ============================================
function CategorySectionVariantA({ 
  title, description, marketSize, growth, leaders, others, icon: Icon,
  searchQuery = '', companyMatchesSearch = () => false
}: { 
  title: string
  description: string
  marketSize: string
  growth: string
  leaders: Company[]
  others: Company[]
  icon: React.ElementType
  searchQuery?: string
  companyMatchesSearch?: (company: Company, query: string) => boolean
}) {
  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
      </div>

      {/* Метрики */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <DollarSign className="h-4 w-4" />
              <span>Размер рынка</span>
            </div>
            <p className="text-xl font-bold mt-1">{marketSize}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>Рост</span>
            </div>
            <p className="text-xl font-bold mt-1">{growth}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500/5 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Target className="h-4 w-4" />
              <span>Лидеров</span>
            </div>
            <p className="text-xl font-bold mt-1 text-emerald-600">{leaders.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Building2 className="h-4 w-4" />
              <span>Всего</span>
            </div>
            <p className="text-xl font-bold mt-1">{leaders.length + others.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Топ-6 лидеров */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-emerald-600" />
          Лидеры рынка
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {leaders.map((company, idx) => (
            <LeaderCard key={idx} company={company} isHighlighted={companyMatchesSearch(company, searchQuery)} />
          ))}
        </div>
      </div>

      {/* Остальные игроки */}
      {others.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Другие игроки ({others.length})
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {others.map((company, idx) => (
              <MiniCard key={idx} company={company} isHighlighted={companyMatchesSearch(company, searchQuery)} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// КОМПОНЕНТ: Секция категории (Вариант B - Компактный)
// ============================================
function CategorySectionVariantB({ 
  title, description, marketSize, growth, leaders, others, icon: Icon,
  searchQuery = '', companyMatchesSearch = () => false
}: { 
  title: string
  description: string
  marketSize: string
  growth: string
  leaders: Company[]
  others: Company[]
  icon: React.ElementType
  searchQuery?: string
  companyMatchesSearch?: (company: Company, query: string) => boolean
}) {
  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground mt-1">{description}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary">{marketSize}</Badge>
            <Badge variant="secondary">{growth}</Badge>
            <Badge variant="outline" className="text-emerald-600">{leaders.length} лидеров</Badge>
          </div>
        </div>
      </div>

      {/* Горизонтальный скролл лидеров */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-emerald-600" />
          Лидеры рынка
        </h3>
        <ScrollArea className="w-full">
          <div className="flex gap-4 pb-4">
            {leaders.map((company, idx) => (
              <div key={idx} className="w-[280px] flex-shrink-0 h-full">
                <LeaderCard company={company} isHighlighted={companyMatchesSearch(company, searchQuery)} />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Остальные - таблица */}
      {others.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <List className="h-5 w-5" />
            Другие игроки ({others.length})
          </h3>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium">Компания</th>
                      <th className="text-left p-3 text-sm font-medium hidden md:table-cell">Описание</th>
                      <th className="text-left p-3 text-sm font-medium hidden lg:table-cell">Технологии</th>
                      <th className="p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {others.map((company, idx) => (
                      <tr key={idx} className="border-t hover:bg-muted/30">
                        <td className="p-3">
                          <div>
                            <p className="font-medium text-sm">{company.name}</p>
                            {company.revenue && <p className="text-xs text-muted-foreground">{company.revenue}</p>}
                          </div>
                        </td>
                        <td className="p-3 hidden md:table-cell">
                          <p className="text-sm text-muted-foreground line-clamp-1">{company.description}</p>
                        </td>
                        <td className="p-3 hidden lg:table-cell">
                          <div className="flex gap-1 flex-wrap">
                            {company.features.slice(0, 2).map((f, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">{f}</Badge>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <Button variant="ghost" size="sm" onClick={() => window.open(company.url, '_blank')}>
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// ============================================
// КОМПОНЕНТ: Блок рисков ИИ-пузыря
// ============================================
function BubbleRiskBlock() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-amber-500/10">
          <AlertTriangle className="h-6 w-6 text-amber-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">Риски ИИ-пузыря</h2>
          <p className="text-muted-foreground mt-1">Параллели с пузырём доткомов (2000) и прогноз для рынка ИИ</p>
        </div>
      </div>

      {/* Индикаторы риска */}
      <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            Индикаторы риска
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Спекулятивные инвестиции</span>
                <span className="text-red-500">🔴 Критический</span>
              </div>
              <Progress value={90} className="h-2 bg-red-500/20 [&>div]:bg-red-500" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Переоценённые оценки</span>
                <span className="text-orange-500">🟠 Высокий</span>
              </div>
              <Progress value={75} className="h-2 bg-orange-500/20 [&>div]:bg-orange-500" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Нереалистичные ожидания</span>
                <span className="text-red-500">🔴 Критический</span>
              </div>
              <Progress value={85} className="h-2 bg-red-500/20 [&>div]:bg-red-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Сравнение с доткомами */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3">💥 Доткомы (2000)</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span>Оценки компаний x100 от реальной выручки</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span>Бизнес-модели "рост любой ценой"</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span>90% стартапов закрылись за 2 года</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>Остались технологические гиганты</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3">🤖 ИИ ({CURRENT_YEAR})</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>Аналогичный ажиотаж вокруг генеративного ИИ</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>Многие проекты без монетизации</span>
              </li>
              <li className="flex items-start gap-2">
                <Minus className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>Ожидается консолидация рынка</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>Технологии реальны и полезны</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Прогноз */}
      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Прогноз при "сдутии" пузыря
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="font-medium text-emerald-600 mb-2">✅ Выживут:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• LLM, CV, ASR технологии</li>
                <li>• Компании с выручкой &gt;500 млн ₽</li>
                <li>• Экосистемные игроки (Сбер, Яндекс)</li>
                <li>• B2B-решения с измеримым ROI</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-amber-600 mb-2">⚠️ Высокий риск:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Генеративные модели без монетизации (70%)</li>
                <li>• Переоценённые LLM-проекты (60%)</li>
                <li>• Стартапы без unit-экономики (90%)</li>
                <li>• Консьюмер-приложения (50%)</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-blue-600 mb-2">📈 Индикаторы краха:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Падение венчурных инвестиций</li>
                <li>• Активность M&amp;A и консолидация</li>
                <li>• Требования к прибыльности</li>
                <li>• Снижение оценок стартапов</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Вывод */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Вывод:</strong> В отличие от пузыря доткомов, технологии ИИ реальны и приносят пользу. 
            Однако текущие оценки многих компаний завышены. При "сдутии" пузыря выживут компании с 
            реальным продуктом, выручкой и измеримым ROI. Рекомендуется фокусироваться на B2B-решениях 
            с чёткой бизнес-моделью.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================
// КОМПОНЕНТ: Сравнение закрытого контура
// ============================================
function OnPremiseComparison() {
  // Расчёты для 1000 пользователей
  const calculations = {
    // Вариант 1: CorpGPT On-Premise
    corpgpt: {
      licenseYearly: 500000, // ₽/год по тарифу Корпорация
      deployment: 1500000, // единоразово (оценка)
      hardware: 8000000, // сервер с GPU (A100/H100)
      maintenance: 600000, // ₽/год поддержка
      admin: 1200000, // ₽/год администратор (0.5 FTE)
      totalYear1: 11800000, // год 1
      totalYear2Plus: 2300000, // год 2+
    },
    // Вариант 2: Облачный LLM
    cloud: {
      perUser: 18000, // ₽/год на пользователя
      users: 1000,
      totalYearly: 18000000, // ₽/год
    },
    // Вариант 3: Своя инфраструктура
    ownInfra: {
      hardware: 15000000, // 2x A100 сервер
      setup: 3000000, // настройка и внедрение
      admin: 2400000, // ₽/год (1 FTE)
      electricity: 600000, // ₽/год
      totalYear1: 21000000,
      totalYear2Plus: 3000000,
    }
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-primary/10">
          <Server className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">Закрытый контур ИИ</h2>
          <p className="text-muted-foreground mt-1">Сравнение вариантов развёртывания для 1000 активных пользователей</p>
        </div>
      </div>

      {/* Варианты */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* CorpGPT On-Premise - только ПО, серверы отдельно */}
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-primary" />
              CorpGPT On-Premise
            </CardTitle>
            <CardDescription>ПО для закрытого контура (серверы отдельно)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Лицензия (год):</span>
                <span className="font-medium">500 000 ₽</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Развёртывание:</span>
                <span className="font-medium">~1 500 000 ₽</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Сервер (GPU):</span>
                <span className="font-medium">~8 000 000 ₽</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Поддержка/админ:</span>
                <span className="font-medium">1 800 000 ₽/год</span>
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between font-semibold">
                <span>Год 1:</span>
                <span className="text-emerald-600">11,8 млн ₽</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Год 2+:</span>
                <span>2,3 млн ₽/год</span>
              </div>
            </div>
            <div className="flex gap-1 flex-wrap">
              <Badge variant="outline" className="text-xs">Быстрый запуск</Badge>
              <Badge variant="outline" className="text-xs">Поддержка вендора</Badge>
              <Badge variant="outline" className="text-xs">Только ПО</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Облачный LLM */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Облачный LLM
            </CardTitle>
            <CardDescription>SaaS-подписка (GigaChat, YandexGPT)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">На пользователя:</span>
                <span className="font-medium">~18 000 ₽/год</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Пользователей:</span>
                <span className="font-medium">1 000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Интеграция:</span>
                <span className="font-medium">~500 000 ₽</span>
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between font-semibold">
                <span>Год 1:</span>
                <span className="text-blue-600">18,5 млн ₽</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Год 2+:</span>
                <span>18 млн ₽/год</span>
              </div>
            </div>
            <div className="flex gap-1 flex-wrap">
              <Badge variant="outline" className="text-xs">Нет железа</Badge>
              <Badge variant="outline" className="text-xs">Масштабируемость</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Своя инфраструктура */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Server className="h-5 w-5 text-purple-600" />
              Своя инфраструктура
            </CardTitle>
            <CardDescription>Open-source LLM (LLaMA, Mistral)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Серверы (2x A100):</span>
                <span className="font-medium">~15 000 000 ₽</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Настройка:</span>
                <span className="font-medium">~3 000 000 ₽</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Администратор:</span>
                <span className="font-medium">2 400 000 ₽/год</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Электричество:</span>
                <span className="font-medium">600 000 ₽/год</span>
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between font-semibold">
                <span>Год 1:</span>
                <span className="text-purple-600">21 млн ₽</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Год 2+:</span>
                <span>3 млн ₽/год</span>
              </div>
            </div>
            <div className="flex gap-1 flex-wrap">
              <Badge variant="outline" className="text-xs">Полный контроль</Badge>
              <Badge variant="outline" className="text-xs">Без зависимостей</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Сравнительная таблица */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Сравнение за 3 года
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">Критерий</th>
                  <th className="text-center p-3 font-medium">CorpGPT On-Premise</th>
                  <th className="text-center p-3 font-medium">Облачный LLM</th>
                  <th className="text-center p-3 font-medium">Своя инфраструктура</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-3 font-medium">Стоимость за 3 года</td>
                  <td className="p-3 text-center text-emerald-600 font-semibold">16,4 млн ₽</td>
                  <td className="p-3 text-center">54,5 млн ₽</td>
                  <td className="p-3 text-center">27 млн ₽</td>
                </tr>
                <tr className="border-t bg-muted/20">
                  <td className="p-3">Время запуска</td>
                  <td className="p-3 text-center text-emerald-600">2-4 недели</td>
                  <td className="p-3 text-center text-emerald-600">1-2 недели</td>
                  <td className="p-3 text-center">2-3 месяца</td>
                </tr>
                <tr className="border-t">
                  <td className="p-3">Безопасность данных</td>
                  <td className="p-3 text-center text-emerald-600">⭐⭐⭐⭐⭐</td>
                  <td className="p-3 text-center">⭐⭐⭐</td>
                  <td className="p-3 text-center text-emerald-600">⭐⭐⭐⭐⭐</td>
                </tr>
                <tr className="border-t bg-muted/20">
                  <td className="p-3">Требуемые компетенции</td>
                  <td className="p-3 text-center text-emerald-600">Низкие</td>
                  <td className="p-3 text-center text-emerald-600">Низкие</td>
                  <td className="p-3 text-center">Высокие</td>
                </tr>
                <tr className="border-t">
                  <td className="p-3">Поддержка</td>
                  <td className="p-3 text-center text-emerald-600">Вендор</td>
                  <td className="p-3 text-center text-emerald-600">Вендор</td>
                  <td className="p-3 text-center">Своими силами</td>
                </tr>
                <tr className="border-t bg-muted/20">
                  <td className="p-3">Соответствие 152-ФЗ</td>
                  <td className="p-3 text-center text-emerald-600">✅ Да</td>
                  <td className="p-3 text-center">⚠️ Договор</td>
                  <td className="p-3 text-center text-emerald-600">✅ Да</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Плюсы и минусы */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-emerald-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-emerald-600">
              <CheckCircle className="h-5 w-5" />
              Преимущества закрытого контура
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>Полный контроль над данными (152-ФЗ, гостайна)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>Нет зависимости от внешних сервисов и санкций</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>Низкая стоимость владения после окупаемости</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>Возможность кастомизации под задачи компании</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>Предсказуемые расходы (нет Pay-per-Use)</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card className="border-red-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              Недостатки закрытого контура
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span>Высокие первоначальные инвестиции (CAPEX)</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span>Требуется квалифицированный персонал</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span>Модель может устаревать без обновлений</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span>Ограниченная масштабируемость железа</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span>Ответственность за доступность на вас</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Рекомендация */}
      <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Рекомендация для 1000 пользователей
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Для организаций с требованиями к безопасности данных и бюджетом от 10 млн ₽ на внедрение 
            рекомендуется <strong>CorpGPT On-Premise</strong> как оптимальное соотношение цена/качество:
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="font-medium text-emerald-600">ROI за 3 года</p>
              <p className="text-2xl font-bold">38 млн ₽</p>
              <p className="text-muted-foreground">экономия vs облако</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="font-medium text-emerald-600">Окупаемость</p>
              <p className="text-2xl font-bold">8 месяцев</p>
              <p className="text-muted-foreground">по сравнению с облаком</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="font-medium text-emerald-600">Стоимость на пользователя</p>
              <p className="text-2xl font-bold">5 500 ₽/год</p>
              <p className="text-muted-foreground">со 2-го года</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ссылка */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Подробнее о CorpGPT On-Premise</p>
              <p className="text-sm text-muted-foreground">Официальный сайт и документация</p>
            </div>
            <Button onClick={() => window.open('https://corpgpt.ru/', '_blank')}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Перейти на сайт
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================
// ГЛАВНЫЙ КОМПОНЕНТ
// ============================================
export default function Home() {
  const [activeTab, setActiveTab] = useState('overview')
  const [viewVariant, setViewVariant] = useState<'A' | 'B'>('A')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Функция проверки совпадения компании с поисковым запросом
  const companyMatchesSearch = (company: Company, query: string): boolean => {
    if (!query.trim()) return false
    const q = query.toLowerCase()
    return (
      company.name.toLowerCase().includes(q) ||
      company.description.toLowerCase().includes(q) ||
      company.features.some(f => f.toLowerCase().includes(q)) ||
      !!(company.inn && company.inn.includes(q)) ||
      !!(company.revenue && company.revenue.toLowerCase().includes(q))
    )
  }

  // Определение вкладок с результатами поиска
  const getTabsWithResults = (query: string): string[] => {
    if (!query.trim()) return []
    const tabs: string[] = []
    Object.entries(techData).forEach(([key, data]) => {
      const allCompanies = [...data.leaders, ...data.others]
      if (allCompanies.some(c => companyMatchesSearch(c, query))) {
        tabs.push(key)
      }
    })
    return tabs
  }
  
  const tabsWithResults = getTabsWithResults(searchQuery)
  
  const allLeaders = [...techData.llm.leaders, ...techData.audio.leaders, 
    ...techData.video.leaders, ...techData.dl.leaders, ...techData.gen.leaders]
  const uniqueCompanies = new Set(allLeaders.map(c => c.name)).size

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">ИИ в России {CURRENT_YEAR}</h1>
                <p className="text-sm text-muted-foreground">Аналитический обзор рынка: {uniqueCompanies}+ лидеров</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="hidden sm:flex">
                <BarChart3 className="h-3 w-3 mr-1" />
                Аналитика
              </Badge>
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Поиск по компаниям..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 w-[200px] md:w-[300px] rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <ScrollArea className="w-full">
            <TabsList className="grid w-max grid-cols-8 h-auto gap-1 p-1">
              <TabsTrigger value="overview" className="flex items-center gap-2 py-2 px-3">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Обзор</span>
              </TabsTrigger>
              <TabsTrigger value="llm" className="flex items-center gap-2 py-2 px-3 relative">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">LLM</span>
                {tabsWithResults.includes('llm') && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full" />
                )}
              </TabsTrigger>
              <TabsTrigger value="audio" className="flex items-center gap-2 py-2 px-3 relative">
                <Mic className="h-4 w-4" />
                <span className="hidden sm:inline">Аудио</span>
                {tabsWithResults.includes('audio') && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full" />
                )}
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center gap-2 py-2 px-3 relative">
                <Video className="h-4 w-4" />
                <span className="hidden sm:inline">Видео</span>
                {tabsWithResults.includes('video') && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full" />
                )}
              </TabsTrigger>
              <TabsTrigger value="dl" className="flex items-center gap-2 py-2 px-3 relative">
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">DL</span>
                {tabsWithResults.includes('dl') && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full" />
                )}
              </TabsTrigger>
              <TabsTrigger value="gen" className="flex items-center gap-2 py-2 px-3 relative">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Генерация</span>
                {tabsWithResults.includes('gen') && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full" />
                )}
              </TabsTrigger>
              <TabsTrigger value="compare" className="flex items-center gap-2 py-2 px-3">
                <Calculator className="h-4 w-4" />
                <span className="hidden sm:inline">Сравнение</span>
              </TabsTrigger>
              <TabsTrigger value="risks" className="flex items-center gap-2 py-2 px-3">
                <AlertTriangle className="h-4 w-4" />
                <span className="hidden sm:inline">Риски</span>
              </TabsTrigger>
            </TabsList>
          </ScrollArea>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Hero Stats */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-5 w-5" />
                    <span>Рынок Big Data + ИИ</span>
                  </div>
                  <p className="text-3xl font-bold mt-2">{marketOverview.totalMarket}</p>
                  <p className="text-sm text-muted-foreground mt-1">{marketOverview.totalMarketNote}</p>
                  <p className="text-xs text-emerald-600 mt-0.5">Рынок ИИ напрямую: {marketOverview.directMarket}</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="h-5 w-5" />
                    <span>Темп роста</span>
                  </div>
                  <p className="text-3xl font-bold mt-2">{marketOverview.growth}</p>
                  <p className="text-sm text-muted-foreground mt-1">Источник: {marketOverview.growthSource}</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-5 w-5" />
                    <span>Игроков рынка</span>
                  </div>
                  <p className="text-3xl font-bold mt-2">{marketOverview.companies}</p>
                  <p className="text-sm text-muted-foreground mt-1">Источник: Smart Ranking</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Rocket className="h-5 w-5" />
                    <span>Прогноз 2030</span>
                  </div>
                  <p className="text-3xl font-bold mt-2">{marketOverview.forecast2030}</p>
                  <p className="text-sm text-muted-foreground mt-1">{marketOverview.forecast2030Note}</p>
                </CardContent>
              </Card>
            </div>

            {/* Market Structure */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Структура рынка ИИ в России
                </CardTitle>
                <CardDescription>
                  Основные технологические направления по данным TAdviser ({CURRENT_YEAR})
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Компьютерное зрение / Видеоаналитика</span>
                      <span className="text-sm text-muted-foreground">69%</span>
                    </div>
                    <Progress value={69} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">Источник: TAdviser 2025</p>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">NLP / Речевые технологии</span>
                      <span className="text-sm text-muted-foreground">52%</span>
                    </div>
                    <Progress value={52} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">Включает LLM, чат-боты, аудио</p>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">LLM (отдельно)</span>
                      <span className="text-sm text-muted-foreground">35 млрд ₽</span>
                    </div>
                    <Progress value={30} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">Источник: МТС / ICT Moscow</p>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Генеративный ИИ</span>
                      <span className="text-sm text-muted-foreground">Быстрорастущий</span>
                    </div>
                    <Progress value={15} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">Этап перехода от интереса к внедрению</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Companies by Category */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    LLM / Чат-боты
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{techData.llm.leaders.length + techData.llm.others.length}</p>
                  <p className="text-sm text-muted-foreground">компаний</p>
                  <p className="text-xs text-emerald-600 mt-1">{techData.llm.leaders.length} лидеров</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Mic className="h-4 w-4" />
                    Аудио-аналитика
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{techData.audio.leaders.length + techData.audio.others.length}</p>
                  <p className="text-sm text-muted-foreground">компаний</p>
                  <p className="text-xs text-emerald-600 mt-1">{techData.audio.leaders.length} лидеров</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Видео-аналитика
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{techData.video.leaders.length + techData.video.others.length}</p>
                  <p className="text-sm text-muted-foreground">компаний</p>
                  <p className="text-xs text-emerald-600 mt-1">{techData.video.leaders.length} лидеров</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Deep Learning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{techData.dl.leaders.length + techData.dl.others.length}</p>
                  <p className="text-sm text-muted-foreground">компаний</p>
                  <p className="text-xs text-emerald-600 mt-1">{techData.dl.leaders.length} лидеров</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Генеративный ИИ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{techData.gen.leaders.length + techData.gen.others.length}</p>
                  <p className="text-sm text-muted-foreground">компаний</p>
                  <p className="text-xs text-emerald-600 mt-1">{techData.gen.leaders.length} лидеров</p>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Дополнительно
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('compare')}>
                      <Calculator className="h-4 w-4 mr-2" />
                      Сравнение решений
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('risks')}>
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Риски пузыря
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sources */}
            <Card className="bg-muted/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Источники данных</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline">TAdviser</Badge>
                  <Badge variant="outline">Smart Ranking</Badge>
                  <Badge variant="outline">CNews</Badge>
                  <Badge variant="outline">ICT Moscow</Badge>
                  <Badge variant="outline">Forbes Russia</Badge>
                  <Badge variant="outline">РБК Тренды</Badge>
                  <Badge variant="outline">Компьютерра</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Category Tabs */}
          {(['llm', 'audio', 'video', 'dl', 'gen'] as const).map((cat) => (
            <TabsContent key={cat} value={cat}>
              {/* View Variant Selector */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-muted-foreground">Вариант отображения:</span>
                <div className="flex gap-1">
                  <Button 
                    variant={viewVariant === 'A' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setViewVariant('A')}
                  >
                    <LayoutGrid className="h-4 w-4 mr-1" />
                    Классический
                  </Button>
                  <Button 
                    variant={viewVariant === 'B' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setViewVariant('B')}
                  >
                    <List className="h-4 w-4 mr-1" />
                    Компактный
                  </Button>
                </div>
              </div>

              {viewVariant === 'A' ? (
                <CategorySectionVariantA 
                  title={techData[cat].title}
                  description={techData[cat].description}
                  marketSize={techData[cat].marketSize}
                  growth={techData[cat].growth}
                  leaders={techData[cat].leaders}
                  others={techData[cat].others}
                  icon={techData[cat].icon}
                />
              ) : (
                <CategorySectionVariantB 
                  title={techData[cat].title}
                  description={techData[cat].description}
                  marketSize={techData[cat].marketSize}
                  growth={techData[cat].growth}
                  leaders={techData[cat].leaders}
                  others={techData[cat].others}
                  icon={techData[cat].icon}
                />
              )}
            </TabsContent>
          ))}

          {/* Compare Tab */}
          <TabsContent value="compare">
            <OnPremiseComparison />
          </TabsContent>

          {/* Risks Tab */}
          <TabsContent value="risks">
            <BubbleRiskBlock />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Аналитическая презентация российского рынка ИИ
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Данные актуальны на {CURRENT_YEAR} год • {uniqueCompanies}+ лидеров
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
