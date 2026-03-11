# Аналитический портал ИИ в России

Интерактивная презентация-аналитика российского рынка искусственного интеллекта.

## Функционал

- Анализ 50+ компаний по 5 технологическим направлениям
- Поиск по компаниям с подсветкой результатов
- Расчёты развёртывания On-Premise решений
- Анализ рисков ИИ-пузыря
- Два режима отображения (Классический и Компактный)
- База данных компаний (SQLite + Prisma)
- CRUD операции с компаниями (добавление, редактирование)
- Метка "Партнёр" для компаний

## Технологии

| Категория | Технология |
|-----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Database | Prisma ORM + SQLite |
| Icons | Lucide React |
| Runtime | Bun (рекомендуется) или Node.js 20+ |

---

## Установка на чистую систему Debian 12

### 1. Подготовка системы

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка необходимых системных пакетов
sudo apt install -y curl wget git build-essential sqlite3 libsqlite3-dev

# Установка Node.js 20 (опционально, если используете Node.js)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Установка Bun (рекомендуется)
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc
```

### 2. Проверка установки

```bash
# Проверка Node.js (если установлен)
node --version   # должно быть v20.x.x или выше
npm --version    # должно быть 10.x.x или выше

# Проверка Bun
bun --version    # должно быть 1.x.x или выше

# Проверка Git
git --version

# Проверка SQLite
sqlite3 --version
```

### 3. Загрузка проекта с GitHub

```bash
# Клонирование репозитория (ветка main3 - актуальная версия)
git clone -b main3 https://github.com/vivasua-collab/uIIa-analise.git
cd uIIa-analise

# Установка зависимостей
bun install

# Или через npm (если не установлен Bun)
npm install
```

### 4. Инициализация базы данных

```bash
# Создание базы данных и применение схемы
bun run db:push

# Заполнение базы начальными данными (39 компаний)
bun run db:seed

# Или через npm
npm run db:push
npm run db:seed
```

### 5. Запуск

```bash
# Режим разработки (с авто-перезагрузкой)
bun run dev

# Продакшен сборка
bun run build
bun run start

# Или через npm
npm run dev
npm run build
npm run start
```

Приложение будет доступно по адресу: http://localhost:3000

---

## ⚠️ ВАЖНО: Сохранение данных при обновлении

### Как это работает

| Файл | В Git | Описание |
|------|-------|----------|
| `prisma/seed.ts` | ✅ Да | Начальные данные 39+ компаний |
| `db/custom.db` | ❌ Нет | Ваша рабочая база (защищена) |
| `prisma/export-to-seed.ts` | ✅ Да | Скрипт экспорта данных |

### Проблема
База данных SQLite хранится в файле `db/custom.db`. Этот файл **НЕ** попадает в Git (добавлен в `.gitignore`), что защищает ваши данные от перезаписи при `git pull`.

**Но это значит:** при клонировании репозитория на новом месте база будет пуста, а seed-файл содержит только начальные данные (без ваших добавлений).

### Перед обновлением ОБЯЗАТЕЛЬНО сделайте бэкап!

```bash
# Создание резервной копии базы данных
cp db/custom.db db/custom.db.backup.$(date +%Y%m%d_%H%M%S)

# Или выгрузка в SQL
sqlite3 db/custom.db .dump > backup_$(date +%Y%m%d).sql
```

### Безопасное обновление проекта

```bash
cd /путь/к/uIIa-analise

# 1. БЭКАП БАЗЫ ДАННЫХ (ОБЯЗАТЕЛЬНО!)
cp db/custom.db db/custom.db.backup

# 2. Сохранение локальных изменений (если есть)
git stash

# 3. Получение последних изменений
git fetch origin main3
git pull origin main3

# 4. Обновление зависимостей
bun install

# 5. Применение миграций БД (если изменилась схема)
bun run db:push

# 6. Проверка, что база на месте
ls -la db/custom.db

# Если база пуста или отсутствует - восстановить из бэкапа:
# cp db/custom.db.backup db/custom.db
```

### 🔄 Экспорт данных в seed-файл (перед git push!)

**Важно!** Если вы добавили новые компании через интерфейс, они есть только в вашей локальной БД. Чтобы они попали на GitHub, нужно экспортировать их в seed-файл:

```bash
# Экспорт текущих данных из БД в prisma/seed.ts
bun run db:export

# Проверить изменения
git diff prisma/seed.ts

# Отправить на GitHub
git add prisma/seed.ts
git commit -m "Обновление списка компаний"
git push origin main3
```

### Структура файлов базы данных

| Файл | Описание | В Git? |
|------|----------|--------|
| `db/custom.db` | Основная база данных | ❌ Нет (защищено) |
| `db/*.db-journal` | Временные файлы SQLite | ❌ Нет |
| `prisma/schema.prisma` | Схема базы данных | ✅ Да |
| `prisma/seed.ts` | Начальные данные (39 компаний) | ✅ Да |

---

## Обновление проекта

### Быстрое обновление

```bash
cd /путь/к/uIIa-analise

# Бэкап базы!
cp db/custom.db db/custom.db.backup

# Обновление кода
git stash
git pull origin main3

# Обновление зависимостей и схемы
bun install
bun run db:push

# Перезапуск (если запущен как сервис)
sudo systemctl restart uIIa-analise
```

### Полное обновление с пересборкой

```bash
cd /путь/к/uIIa-analise

# Остановка сервиса
sudo systemctl stop uIIa-analise

# БЭКАП БАЗЫ!
cp db/custom.db db/custom.db.backup.$(date +%Y%m%d)

# Обновление кода
git fetch origin main3
git pull origin main3

# Очистка старой сборки
rm -rf .next node_modules

# Переустановка и сборка
bun install
bun run db:push
bun run build

# Запуск сервиса
sudo systemctl start uIIa-analise
```

### Проверка статуса

```bash
# Статус сервиса
sudo systemctl status uIIa-analise

# Логи сервиса
sudo journalctl -u uIIa-analise -f

# Проверка версии
git log -1 --oneline

# Проверка базы данных
ls -la db/custom.db
sqlite3 db/custom.db "SELECT COUNT(*) FROM Company;"
sqlite3 db/custom.db "SELECT COUNT(*) FROM Company WHERE isPartner=1;"
```

---

## Экспорт и импорт данных

### Экспорт базы в SQL

```bash
# Полный дамп базы
sqlite3 db/custom.db .dump > database_dump.sql

# Только данные компаний (для переноса)
sqlite3 db/custom.db "SELECT * FROM Company;" > companies_export.csv
```

### Импорт данных

```bash
# Восстановление из SQL дампа
cat database_dump.sql | sqlite3 db/custom.db

# Или из бэкапа
cp db/custom.db.backup db/custom.db
```

---

## Запуск как сервис systemd

### Создание файла сервиса

```bash
sudo nano /etc/systemd/system/uIIa-analise.service
```

### Содержимое файла сервиса

```ini
[Unit]
Description=UIIA Analise - AI Analytics Portal
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/uIIa-analise
ExecStart=/home/ВАШ_ПОЛЬЗОВАТЕЛЬ/.bun/bin/bun run start
Restart=on-failure
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

> **Важно:** Замените `ВАШ_ПОЛЬЗОВАТЕЛЬ` на реальное имя пользователя, у которого установлен Bun.

### Активация сервиса

```bash
# Создание директории (если её нет)
sudo mkdir -p /var/www
sudo chown www-data:www-data /var/www

# Копирование проекта
sudo cp -r /путь/к/uIIa-analise /var/www/uIIa-analise
sudo chown -R www-data:www-data /var/www/uIIa-analise

# Активация
sudo systemctl daemon-reload
sudo systemctl enable uIIa-analise
sudo systemctl start uIIa-analise
```

---

## Настройка Nginx и SSL (HTTPS)

Подробная инструкция по настройке Nginx, получению SSL-сертификатов Let's Encrypt и настройке HTTPS находится в отдельном файле: **[SSL.md](./SSL.md)**

### Кратко:

```bash
# Установка Nginx и Certbot
sudo apt install -y nginx certbot python3-certbot-nginx

# Получение SSL-сертификата (автоматическая настройка)
sudo certbot --nginx -d ваш-домен.ru
```

---

## Рынок ИИ в России

| Показатель | Значение | Источник |
|------------|----------|----------|
| Big Data + ИИ | 433 млрд ₽ | TAdviser |
| Рынок ИИ напрямую | 117,7 млрд ₽ | РБК |
| Инвестиции в ИИ | 305 млрд ₽ | TAdviser |
| Темп роста | +38% | РБК |
| Прогноз 2030 | 11,6 трлн ₽ | НИУ ВШЭ |

## Компании в базе

| Направление | Компаний | Лидеров |
|-------------|----------|---------|
| LLM / Чат-боты | 11 | 2 |
| Аудио-аналитика | 5 | 4 |
| Видео-аналитика | 4 | 2 |
| Deep Learning | 12 | 6 |
| Генеративный ИИ | 7 | 6 |
| **Итого уникальных** | **39** | **20** |

---

## Структура проекта

```
uIIa-analise/
├── db/
│   └── custom.db              # База данных SQLite (НЕ в Git!)
├── prisma/
│   ├── schema.prisma          # Схема базы данных
│   └── seed.ts                # Начальные данные (39 компаний)
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── categories/    # API категорий
│   │   │   └── companies/     # API компаний (CRUD)
│   │   ├── page.tsx           # Главная страница
│   │   ├── layout.tsx         # Layout
│   │   └── globals.css        # Глобальные стили
│   ├── lib/
│   │   └── db.ts              # Клиент Prisma
│   └── components/
│       ├── ui/                # shadcn/ui компоненты
│       ├── CompanyFormDialog.tsx  # Форма редактирования
│       └── DeleteConfirmDialog.tsx # Диалог удаления
├── public/                    # Статические файлы
├── tailwind.config.ts         # Конфигурация Tailwind
├── package.json               # Зависимости
├── README.md                  # Документация
├── SSL.md                     # Инструкция по настройке HTTPS
├── checkpoints_03_11.md       # Чекпоинты разработки
└── worklog.md                 # История изменений
```

---

## Полезные команды

| Команда | Описание |
|---------|----------|
| `bun run dev` | Запуск в режиме разработки |
| `bun run build` | Продакшен сборка |
| `bun run start` | Запуск продакшен сервера |
| `bun run lint` | Проверка кода ESLint |
| `bun run db:push` | Применить схему Prisma к БД |
| `bun run db:seed` | Заполнить БД начальными данными |
| `bun run db:export` | Экспорт данных в seed-файл (перед git push) |
| `bun run db:studio` | Открыть Prisma Studio (GUI для БД) |

---

## Устранение неполадок

### База данных пуста после обновления

```bash
# Проверить наличие бэкапа
ls -la db/*.backup*

# Восстановить из бэкапа
cp db/custom.db.backup db/custom.db

# Если бэкапа нет - пересоздать из seed
bun run db:push
bun run db:seed
```

### Ошибка "database is locked"

```bash
# Удалить journal файл
rm -f db/custom.db-journal

# Перезапустить приложение
```

### Ошибка Prisma после обновления схемы

```bash
# Перегенерировать клиент
bun run db:push

# Если не помогло - пересоздать БД (ВНИМАНИЕ: потеря данных!)
rm db/custom.db
bun run db:push
bun run db:seed
```

---

## Лицензия

MIT License
