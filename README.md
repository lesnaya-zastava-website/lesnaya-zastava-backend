# Гайд по развертыванию

Этот документ описывает процесс развертывания Strapi приложения с использованием PM2 и Apache.

## Предварительные требования

- Node.js (версия 18.x - 22.x)
- npm (версия >= 6.0.0)
- PM2 (глобально установлен)
- Apache2 с модулями `proxy` и `proxy_http`

## Шаг 1: Установка зависимостей

Перейдите в директорию проекта и установите все необходимые зависимости:

```bash
cd /home/user/Documents/Praktika/lesnaya-zastava-backend
npm install
```

**Примечание:** В проекте используется флаг `--legacy-peer-deps` для разрешения конфликтов зависимостей между `react-router-dom` v6 (требуется Strapi 5.16.0) и v5 (требуется плагином `strapi-api-forms`). Этот флаг настроен автоматически через файл `.npmrc`.

## Шаг 2: Сборка проекта (если необходимо)

Перед развертыванием убедитесь, что проект собран:

```bash
npm run build
```




## Шаг 3: Остановка всех процессов PM2

Перед запуском нового процесса необходимо остановить все существующие процессы PM2:

```bash
pm2 delete all
```

Или если вы хотите остановить только процессы, связанные с этим проектом:

```bash
pm2 stop all
pm2 delete all
```

## Шаг 4: Запуск приложения через PM2

Запустите приложение с помощью PM2:

```bash
pm2 start npm --name "lesnaya-zastava-backend" -- run start
```

Или используйте более подробную команду с настройками:


### Полезные команды PM2

- Просмотр статуса процессов: `pm2 status`
- Просмотр логов: `pm2 logs lesnaya-zastava-backend`
- Мониторинг: `pm2 monit`
- Сохранение конфигурации для автозапуска: `pm2 save`
- Настройка автозапуска при перезагрузке системы: `pm2 startup`

## Шаг 5: Настройка Apache проксирования

### 5.1. Включение необходимых модулей Apache

Убедитесь, что модули `proxy` и `proxy_http` включены:

```bash
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo systemctl restart apache2
```

### 5.2. Создание конфигурации виртуального хоста

Создайте файл конфигурации Apache (например, `/etc/apache2/sites-available/lesnaya-zastava-backend.conf`):

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    # Или используйте IP адрес: ServerName 192.168.1.100

    # Проксирование на Strapi (порт 1337 по умолчанию)
    ProxyPreserveHost On
    ProxyPass / http://localhost:1337/
    ProxyPassReverse / http://localhost:1337/

    # Логирование
    ErrorLog ${APACHE_LOG_DIR}/lesnaya-zastava-backend_error.log
    CustomLog ${APACHE_LOG_DIR}/lesnaya-zastava-backend_access.log combined
</VirtualHost>
```

### 5.3. Активация виртуального хоста

Активируйте созданный виртуальный хост:

```bash
sudo a2ensite lesnaya-zastava-backend.conf
sudo systemctl reload apache2
```

### 5.4. Настройка для HTTPS (опционально)

Если у вас есть SSL сертификат, создайте конфигурацию для HTTPS:

```apache
<VirtualHost *:443>
    ServerName your-domain.com

    SSLEngine on
    SSLCertificateFile /path/to/your/certificate.crt
    SSLCertificateKeyFile /path/to/your/private.key
    SSLCertificateChainFile /path/to/your/chain.crt

    ProxyPreserveHost On
    ProxyPass / http://localhost:1337/
    ProxyPassReverse / http://localhost:1337/

    ErrorLog ${APACHE_LOG_DIR}/lesnaya-zastava-backend_ssl_error.log
    CustomLog ${APACHE_LOG_DIR}/lesnaya-zastava-backend_ssl_access.log combined
</VirtualHost>
```

## Полный скрипт развертывания

Для удобства можно создать скрипт развертывания (`deploy.sh`):

```bash
#!/bin/bash

# Переход в директорию проекта
cd /home/user/Documents/Praktika/lesnaya-zastava-backend

# Установка зависимостей
echo "Установка зависимостей..."
npm install

# Сборка проекта
echo "Сборка проекта..."
npm run build

# Остановка всех процессов PM2
echo "Остановка процессов PM2..."
pm2 delete all

# Запуск приложения через PM2
echo "Запуск приложения через PM2..."
pm2 start npm --name "lesnaya-zastava-backend" -- run start

# Сохранение конфигурации PM2
pm2 save

echo "Развертывание завершено!"
echo "Проверьте статус: pm2 status"
echo "Просмотр логов: pm2 logs lesnaya-zastava-backend"
```

Сделайте скрипт исполняемым:

```bash
chmod +x deploy.sh
```

Запустите его:

```bash
./deploy.sh
```

## Переменные окружения

Убедитесь, что у вас настроены необходимые переменные окружения. Создайте файл `.env` в корне проекта (если его еще нет):

```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=your-app-keys-here
# Добавьте другие необходимые переменные
```

## Проверка работы

После развертывания проверьте:

1. Статус PM2: `pm2 status`
2. Логи приложения: `pm2 logs lesnaya-zastava-backend`
3. Доступность через Apache: откройте браузер и перейдите на ваш домен или IP адрес
4. API доступность: `curl http://localhost:1337/api` или через прокси

## Обновление приложения

Для обновления приложения выполните те же шаги:

```bash
# 1. Обновление кода (git pull или другой способ)
git pull

# 2. Установка новых зависимостей
npm install

# 3. Сборка проекта
npm run build

# 4. Перезапуск через PM2
pm2 delete all
pm2 start npm --name "lesnaya-zastava-backend" -- run start
pm2 save
```

## Устранение неполадок

### Проблема: PM2 не запускает приложение

- Проверьте логи: `pm2 logs lesnaya-zastava-backend`
- Убедитесь, что порт 1337 свободен: `netstat -tulpn | grep 1337`
- Проверьте переменные окружения в файле `.env`

### Проблема: Apache не проксирует запросы

- Проверьте, что модули включены: `apache2ctl -M | grep proxy`
- Проверьте конфигурацию: `sudo apache2ctl configtest`
- Проверьте логи Apache: `sudo tail -f /var/log/apache2/error.log`
- Убедитесь, что Strapi запущен и доступен на `http://localhost:1337`

### Проблема: 502 Bad Gateway

- Убедитесь, что приложение запущено через PM2: `pm2 status`
- Проверьте, что приложение слушает на правильном порту
- Проверьте настройки `HOST` и `PORT` в `.env` файле

