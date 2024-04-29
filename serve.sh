#!/bin/bash

# Перейдите в директорию, где находится ваш ecosystem.config.js
cd /var/www/bots/portret-hr-bot

# Установите PM2 (если его еще нет)
# npm install pm2 -g

# Запустите приложение с использованием PM2 и указанием конфигурационного файла
pm2 start ecosystem.config.js

# Опционально: сохраните список приложений PM2
pm2 save

# Опционально: настройте автозапуск PM2 при перезагрузке сервера
pm2 startup
