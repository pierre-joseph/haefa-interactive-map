import ReferralMap from "./ReferralMap";
import "./App.css";

function App() {
  return (
    <main className="app-shell">
      <div className="app-shell__inner">
        <section className="app-hero">
          <div className="app-hero__logo-wrap" aria-hidden="true">
            <img src="/logo.png" alt="" className="app-hero__logo" />
          </div>
          <div className="app-hero__copy">
            <h1 className="app-hero__title">HAEFA Interactive Referral Map</h1>
            <p className="app-hero__lede">
              This interactive referral map supports HAEFA&apos;s work with Rohingya refugees and
              other forcibly displaced communities in Bangladesh. It visualizes healthcare facilities
              and health clinics in the Kutupalong-Balukhali Megacamp Region and their available resources. This map
              is used to support referrals and coordination of care for patients in need of specialized services.
            </p>
            <p className="app-hero__lede">
              Learn more at{" "}
              <a href="https://www.haefa.org/" className="app-hero__link" target="_blank" rel="noreferrer">
                www.haefa.org
              </a>
              .
            </p>
          </div>
        </section>

        <section className="app-map-panel" aria-label="Interactive referral map">
          <ReferralMap />
        </section>
      </div>
    </main>
  )
}

export default App
