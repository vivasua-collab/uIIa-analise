# Настройка SSL (HTTPS) для UIIA Analise

Инструкция по настройке защищённого HTTPS-соединения с использованием Nginx и Let's Encrypt.

---

## 1. Установка Nginx

```bash
sudo apt update
sudo apt install -y nginx
```

### Базовая конфигурация (HTTP)

```bash
sudo nano /etc/nginx/sites-available/uIIa-analise
```

### Содержимое конфигурации

```nginx
server {
    listen 80;
    server_name ваш-домен.ru www.ваш-домен.ru;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Активация конфигурации

```bash
sudo ln -s /etc/nginx/sites-available/uIIa-analise /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

---

## 2. Установка Certbot (Let's Encrypt)

```bash
# Установка Certbot с плагином для Nginx
sudo apt install -y certbot python3-certbot-nginx
```

---

## 3. Получение SSL-сертификата

### Автоматический способ (рекомендуется)

```bash
# Автоматическое получение и настройка SSL
sudo certbot --nginx -d ваш-домен.ru -d www.ваш-домен.ru
```

В процессе выполнения:
1. Введите email для уведомлений
2. Примите условия использования (AGREE)
3. Выберите редирект HTTP → HTTPS (рекомендуется)

### Ручной способ (если нужно больше контроля)

```bash
# Только получение сертификата
sudo certbot certonly --nginx -d ваш-домен.ru -d www.ваш-домен.ru
```

---

## 4. Ручная настройка SSL в Nginx

Если вы получили сертификат вручную, добавьте SSL-конфигурацию:

```bash
sudo nano /etc/nginx/sites-available/uIIa-analise
```

### Полная конфигурация с SSL

```nginx
# Редирект HTTP → HTTPS
server {
    listen 80;
    server_name ваш-домен.ru www.ваш-домен.ru;
    return 301 https://$server_name$request_uri;
}

# HTTPS сервер
server {
    listen 443 ssl http2;
    server_name ваш-домен.ru www.ваш-домен.ru;

    # SSL сертификаты Let's Encrypt
    ssl_certificate /etc/letsencrypt/live/ваш-домен.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ваш-домен.ru/privkey.pem;

    # Рекомендуемые SSL настройки
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;

    # Современные протоколы
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # HSTS (опционально, для большей безопасности)
    add_header Strict-Transport-Security "max-age=63072000" always;

    # Проксирование на Next.js
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Применение конфигурации

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 5. Автоматическое обновление сертификатов

Certbot автоматически настраивает cron-задачу для обновления.

### Проверка автообновления

```bash
# Тестовый запуск (dry-run)
sudo certbot renew --dry-run
```

### Статус таймера

```bash
sudo systemctl status certbot.timer
```

### Ручное обновление

```bash
sudo certbot renew
sudo systemctl reload nginx
```

---

## 6. Проверка SSL

### Проверка в браузере
- Откройте `https://ваш-домен.ru`
- Убедитесь, что значок замка отображается корректно

### Онлайн-проверка
- [SSL Labs SSL Test](https://www.ssllabs.com/ssltest/)
- Введите ваш домен для детального анализа

### Проверка через curl

```bash
curl -I https://ваш-домен.ru
```

---

## 7. Устранение неполадок

### Проблема: Сертификат не получен

```bash
# Проверка доступности порта 80
sudo ufw allow 80
sudo ufw allow 443

# Проверка статуса Nginx
sudo systemctl status nginx

# Логи Certbot
sudo journalctl -u certbot --no-pager
```

### Проблема: Сайт недоступен по HTTPS

```bash
# Проверка конфигурации Nginx
sudo nginx -t

# Проверка порта 443
sudo ss -tlnp | grep :443

# Логи Nginx
sudo tail -f /var/log/nginx/error.log
```

### Проблема: Сертификат истёк

```bash
# Принудительное обновление
sudo certbot renew --force-renewal
sudo systemctl reload nginx
```

---

## 8. Дополнительная безопасность

### Ограничение доступа по IP (опционально)

```nginx
# В секцию server
allow 192.168.1.0/24;  # Разрешить подсеть
deny all;              # Запретить остальным
```

### Rate Limiting (защита от DDoS)

```nginx
# В http секцию /etc/nginx/nginx.conf
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

# В location /
limit_req zone=api_limit burst=20 nodelay;
```

### Gzip сжатие

```nginx
# В секцию server
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
gzip_min_length 1000;
```

---

## 9. Полезные команды

| Команда | Описание |
|---------|----------|
| `sudo nginx -t` | Проверка конфигурации |
| `sudo systemctl reload nginx` | Перезагрузка конфигурации |
| `sudo systemctl restart nginx` | Перезапуск Nginx |
| `sudo certbot certificates` | Список сертификатов |
| `sudo certbot revoke --cert-path ...` | Отзыв сертификата |
| `sudo tail -f /var/log/nginx/access.log` | Логи доступа |
| `sudo tail -f /var/log/nginx/error.log` | Логи ошибок |

---

## Структура сертификатов

```
/etc/letsencrypt/
├── live/
│   └── ваш-домен.ru/
│       ├── cert.pem        # Сертификат домена
│       ├── chain.pem       # Цепочка промежуточных сертификатов
│       ├── fullchain.pem   # Полная цепочка (для Nginx)
│       └── privkey.pem     # Приватный ключ
└── renewal/
    └── ваш-домен.ru.conf   # Настройки обновления
```

---

## Лицензия

MIT License
