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

---

## Установка на Debian 12

### 1. Подготовка системы

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Установка Bun (рекомендуется)
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc
```

### 2. Загрузка проекта с GitHub (ветка main2)

```bash
# Клонирование репозитория
git clone -b main2 https://github.com/vivasua-collab/uIIa-analise.git
cd uIIa-analise

# Установка зависимостей
bun install
```

### 3. Запуск

```bash
# Режим разработки
bun run dev

# Продакшен сборка
bun run build
bun run start
```

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

```bash
# Создание файла сервиса
sudo nano /etc/systemd/system/uIIa-analise.service
```

```ini
[Unit]
Description=UIIA Analise - AI Analytics Portal
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/uIIa-analise
ExecStart=/usr/bin/bun run start
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Активация
sudo systemctl daemon-reload
sudo systemctl enable uIIa-analise
sudo systemctl start uIIa-analise
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

## Лицензия

MIT License
