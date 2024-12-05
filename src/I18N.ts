import i18next from "i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector/cjs";
import en from "./dictionaries/en.json";
import ja from "./dictionaries/ja.json";

const STORAGE_KEY = "in_renderer_i18n" as const;

i18next.use(I18nextBrowserLanguageDetector).init({
  fallbackLng: "en",
  detection: {
    lookupCookie: STORAGE_KEY,
    lookupLocalStorage: STORAGE_KEY,
    lookupSessionStorage: STORAGE_KEY,
  },
  resources: {
    en: {
      translation: en,
    },
    ja: {
      translation: ja,
    },
  },
});

export const i18n = i18next;