import { useTranslation } from "react-i18next";
import "./LanguageToggle.css";

export function LanguageToggle() {
  const { i18n } = useTranslation();

  return (
    <div className="lang-toggle">
      <button
        type="button"
        className={`lang-toggle__btn ${i18n.language === "en" ? "is-active" : ""}`}
        onClick={() => i18n.changeLanguage("en")}
      >
        English
      </button>
      <button
        type="button"
        className={`lang-toggle__btn ${i18n.language === "bn" ? "is-active" : ""}`}
        onClick={() => i18n.changeLanguage("bn")}
      >
        বাংলা
      </button>
    </div>
  );
}