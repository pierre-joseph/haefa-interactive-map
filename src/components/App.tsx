import ReferralMap from "./ReferralMap";
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from "./LanguageToggle";
import "./App.css";

function App() {
  const { t } = useTranslation();

  return (
    <main className="app-shell">
      <div className="app-shell__inner">
        <section className="app-hero">
          <div className="app-hero__logo-wrap" aria-hidden="true">
            <img src="/logo.png" alt="" className="app-hero__logo" />
          </div>
          <div className="app-hero__copy">
            <h1 className="app-hero__title">{t('appHeader.title')}</h1>
            <p className="app-hero__lede">
              {t('appHeader.description')}
            </p>
            <p className="app-hero__lede">
              {t('appHeader.learnMore')}
              <a href="https://www.haefa.org/" className="app-hero__link" target="_blank" rel="noreferrer">
                {t('appHeader.linkText')}
              </a>
              .
            </p>
          </div>
          <LanguageToggle />
        </section>

        <section className="app-map-panel" aria-label="Interactive referral map">
          <ReferralMap />
        </section>
      </div>
    </main>
  )
}

export default App
