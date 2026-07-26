import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import bn from "./locales/bn.json";
import { formatNumber } from "./components/FormatNumber";
 
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    bn: { translation: bn },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, 
  },
});
 
i18n.services.formatter?.add("banglaNumber", (value, lng) =>
  formatNumber(value, lng ?? "en")
);
 
export default i18n;