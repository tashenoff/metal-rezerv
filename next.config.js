/** @type {import('next').NextConfig} */
module.exports = {
  i18n: {
    locales: ['en', 'ru'], // Доступные локали
    defaultLocale: 'ru', // Локаль по умолчанию
    localeDetection: false, // Отключение автоматического определения языка
  },
  
  // Явно указываем переменные окружения, которые должны быть доступны на клиенте
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  },
};
