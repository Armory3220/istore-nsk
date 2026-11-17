# Этап 1: Сборка React-приложения
FROM node:22-alpine AS builder

WORKDIR /app

# Копируем файлы зависимостей и устанавливаем библиотеки
COPY package*.json ./
RUN npm ci

# Копируем весь код проекта
COPY . .

# Передаем переменные окружения Supabase на этапе сборки
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Собираем проект в папку dist
RUN npm run build

# Этап 2: Запуск легкого веб-сервера Nginx для раздачи сайта
FROM nginx:alpine

# Копируем собранный сайт из первого этапа
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем нашу конфигурацию маршрутизации
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
