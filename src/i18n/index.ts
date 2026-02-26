import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

i18n
  .use(Backend) // 🔥 lazy load translation
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'uz',
    supportedLngs: ['uz', 'ru', 'en', 'tj'],

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    backend: {
      loadPath: `${import.meta.env.BASE_URL}locales/{{lng}}.json`,
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },

    load: 'languageOnly',
    cleanCode: true,
  });

export default i18n;
