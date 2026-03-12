# Документация элементов окружения

## Структура проекта

```
uIIa-analise/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Главная страница (весь UI)
│   │   ├── layout.tsx         # Корневой layout
│   │   ├── globals.css        # Глобальные стили Tailwind
│   │   └── api/               # API маршруты
│   │       ├── categories/    # API категорий
│   │       ├── companies/     # API компаний (CRUD)
│   │       └── comments/      # API комментариев
│   ├── components/            # React компоненты
│   │   ├── ui/               # UI компоненты shadcn/ui
│   │   ├── CompanyFormDialog.tsx    # Форма редактирования компании
│   │   ├── DeleteConfirmDialog.tsx  # Диалог подтверждения удаления
│   │   └── CommentsDialog.tsx       # Диалог комментариев
│   ├── hooks/
│   │   └── use-toast.ts       # Хук для уведомлений
│   └── lib/
│       ├── utils.ts           # Утилиты (cn для классов)
│       └── db.ts              # Prisma клиент
├── prisma/
│   ├── schema.prisma          # Схема базы данных
│   ├── seed.ts                # Начальные данные
│   ├── export-to-seed.ts      # Экспорт данных
│   └── import-companies.ts    # Импорт компаний из JSON
├── db/
│   └── custom.db              # База данных SQLite (в .gitignore)
├── public/                     # Статические файлы
├── package.json               # Зависимости
├── tailwind.config.ts         # Конфигурация Tailwind CSS
├── tsconfig.json              # Конфигурация TypeScript
└── README.md                  # Документация
```

## База данных (Prisma + SQLite)

### Модели

#### Company
```prisma
model Company {
  id          String     @id @default(cuid())
  name        String
  inn         String?    @unique   // ИНН (null если нет)
  url         String
  description String
  features    String               // JSON array
  status      String               // "leader" или "active"
  revenue     String?
  alsoIn      String?              // JSON array
  categoryId  String
  category    Category  @relation(...)
  isCustom    Boolean   @default(false)
  isPartner   Boolean   @default(false)
  comments    Comment[]
  createdAt   DateTime
  updatedAt   DateTime
}
```

#### Category
```prisma
model Category {
  id          String
  key         String     @unique   // llm, audio, video, dl, gen
  title       String
  description String
  marketSize  String
  growth      String
  iconName    String
  companies   Company[]
}
```

#### Comment
```prisma
model Comment {
  id        String   @id @default(cuid())
  text      String
  author    String?
  companyId String
  company   Company  @relation(..., onDelete: Cascade)
  createdAt DateTime
  updatedAt DateTime
}
```

### Связывание комментариев
Комментарии связываются с компаниями:
1. **По ИНН** (если заполнен и не пустой) - компании с одинаковым ИНН имеют общие комментарии
2. **По имени** (если ИНН отсутствует) - компании с одинаковым названием имеют общие комментарии

### Очистка ИНН
- Значения `no-inn-*` автоматически заменяются на `null`
- Пустые строки ИНН заменяются на `null`
- Связывание по пустым полям НЕ производится

## Элементы UI

### Вкладки (Tabs)
| ID вкладки | Название | Описание |
|------------|----------|----------|
| `overview` | Обзор | Общая статистика рынка ИИ |
| `llm` | LLM | Большие языковые модели и чат-боты |
| `audio` | Аудио | Аудио-аналитика и речевые технологии |
| `video` | Видео | Видео-аналитика и компьютерное зрение |
| `dl` | DL | Глубокое обучение (Deep Learning) |
| `gen` | Генерация | Генеративный ИИ |
| `compare` | Сравнение | Сравнение On-Premise решений |
| `risks` | Риски | Риски ИИ-пузыря |
| `manage` | Управление | CRUD для компаний |

### Карточки компаний

#### LeaderCard (большая карточка)
- Используется для топ-6 лидеров в каждой категории
- **Партнёр:** светло-голубой фон (`bg-sky-50/50`)
- **Кнопка комментариев:** иконка MessageCircle с счётчиком

#### MiniCard (маленькая карточка)
- Используется для остальных компаний
- **Партнёр:** бейдж "P" голубого цвета

### Бейджи направлений (directionColors)
| Направление | Цвет |
|-------------|------|
| LLM | Синий (`blue-500`) |
| Аудио | Фиолетовый (`purple-500`) |
| Видео | Оранжевый (`orange-500`) |
| DL | Бирюзовый (`teal-500`) |
| Генерация | Розовый (`pink-500`) |

## API Endpoints

### /api/companies
- `GET` - список компаний с фильтрацией
- `POST` - создание компании

### /api/companies/[id]
- `GET` - получение компании
- `PUT` - обновление компании
- `DELETE` - удаление компании

### /api/categories
- `GET` - список категорий

### /api/comments
- `GET ?companyId=xxx` - комментарии компании (связывание по ИНН/имени)
- `POST` - создание комментария (для всех связанных компаний)

### /api/comments/[id]
- `DELETE` - удаление комментария

## Зависимости

| Пакет | Версия | Назначение |
|-------|--------|------------|
| next | ^16.1.1 | Фреймворк |
| react | ^19.0.0 | UI библиотека |
| prisma | ^5.22.0 | ORM |
| @prisma/client | ^5.22.0 | Prisma клиент |
| lucide-react | ^0.525.0 | Иконки |
| @radix-ui/react-* | various | Примитивы UI |

## Переменные окружения

Файл `.env`:
```
DATABASE_URL="file:./db/custom.db"
```

Файл `.env.example` (в Git):
```
DATABASE_URL="file:./db/custom.db"
```

## Команды

| Команда | Описание |
|---------|----------|
| `bun run dev` | Запуск в режиме разработки (порт 3000) |
| `bun run build` | Сборка для продакшена |
| `bun run lint` | Проверка ESLint |
| `bun run db:push` | Применить схему Prisma |
| `bun run db:seed` | Заполнить БД начальными данными |
| `bun run db:export` | Экспорт данных в seed.ts |
| `bun run db:import` | Импорт компаний из JSON |
| `bun run db:studio` | Prisma Studio (GUI) |
