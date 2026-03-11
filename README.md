# Аналитический портал ИИ в России

Интерактивная презентация-аналитика российского рынка искусственного интеллекта.

## Функционал

- Анализ 50+ компаний по 5 технологическим направлениям
- Поиск по компаниям с подсветкой результатов
- Расчёты развёртывания On-Premise решений
- Анализ рисков ИИ-пузыря
- Два режима отображения (Классический и Компактный)

## Технологии

| Категория | Технология |
|-----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Icons | Lucide React |
| Runtime | Bun (рекомендуется) или Node.js 20+ |

---

## Установка на чистую систему Debian 12

### 1. Подготовка системы

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка необходимых системных пакетов
sudo apt install -y curl wget git build-essential

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
```

### 3. Загрузка проекта с GitHub (ветка main2)

```bash
# Клонирование репозитория
git clone -b main2 https://github.com/vivasua-collab/uIIa-analise.git
cd uIIa-analise

# Установка зависимостей
bun install

# Или через npm (если не установлен Bun)
npm install
```

### 4. Запуск

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

## Обновление проекта на локальном Debian

### Быстрое обновление

```bash
cd /путь/к/uIIa-analise

# Сохранение локальных изменений (если есть)
git stash

# Получение последних изменений с ветки main2
git fetch origin main2
git checkout main2
git pull origin main2

# Обновление зависимостей
bun install

# Перезапуск (если запущен как сервис)
sudo systemctl restart uIIa-analise
```

### Полное обновление с пересборкой

```bash
cd /путь/к/uIIa-analise

# Остановка сервиса
sudo systemctl stop uIIa-analise

# Обновление кода
git fetch origin main2
git checkout main2
git pull origin main2

# Очистка старой сборки
rm -rf .next node_modules

# Переустановка и сборка
bun install
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
| LLM / Чат-боты | 19 | 6 |
| Аудио-аналитика | 8 | 6 |
| Видео-аналитика | 10 | 6 |
| Deep Learning | 12 | 6 |
| Генеративный ИИ | 7 | 6 |

---

## Структура проекта

```
uIIa-analise/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Главная страница
│   │   ├── layout.tsx        # Layout
│   │   └── globals.css       # Глобальные стили
│   └── components/
│       └── ui/               # shadcn/ui компоненты
├── public/                   # Статические файлы
├── tailwind.config.ts        # Конфигурация Tailwind
├── package.json              # Зависимости
├── README.md                 # Документация
├── SSL.md                    # Инструкция по настройке HTTPS
└── worklog.md                # История изменений
```

---

## Лицензия

MIT License
