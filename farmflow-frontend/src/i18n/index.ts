import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Static resource imports (start simple)
import en from "../locales/en/common.json";
import hi from "../locales/hi/common.json";
import mr from "../locales/mr/common.json";
import gu from "../locales/gu/common.json";
import te from "../locales/te/common.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: en },
      hi: { common: hi },
      mr: { common: mr },
      gu: { common: gu },
      te: { common: te },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "hi", "mr", "gu", "te"],
    ns: ["common"],
    defaultNS: "common",
    detection: {
      order: ["querystring", "localStorage", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: { escapeValue: false },
    returnNull: false,
  });

// Keep <html lang="..."> accurate
i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng || "en";
});

export default i18n;
