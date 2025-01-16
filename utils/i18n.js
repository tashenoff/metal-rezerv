import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
    fallbackLng: 'en', // Язык по умолчанию
    supportedLngs: ['en', 'ru'],
    lng: 'ru',  // Устанавливаем русский как язык по умолчанию
    debug: true,
    resources: {
      en: {
        common: require('../public/locales/en/common.json'),
      },
      ru: {
        common: require('../public/locales/ru/common.json'),
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });
  

export default i18n;
