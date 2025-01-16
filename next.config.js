/** @type {import('next').NextConfig} */
module.exports = {
  i18n: {
    locales: ['en', 'ru'], // Доступные локали
    defaultLocale: 'ru', // Локаль по умолчанию
    localeDetection: false, // Отключение автоматического определения языка
  },
};
