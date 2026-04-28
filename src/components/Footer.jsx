import styles from './Footer.module.css'

const LINKS = {
  Services: ['Find a Doctor', 'Book Lab Tests', 'Order Medicines', 'Emergency Ambulance', 'Virtual Consultation', 'POD Kiosks'],
  'For Providers': ['Join as Doctor', 'Hospital Onboarding', 'Pharmacy Partner', 'Diagnostic Lab Partner', 'Ambulance Fleet Partner'],
  Company: ['About GeoMedico', 'Our Mission', 'Press & Media', 'Careers', 'Investor Relations', 'Blog'],
  Support: ['Help Centre', 'Contact Us', 'Privacy Policy', 'Terms of Service', 'Grievance Redressal', 'DISHA Compliance'],
}

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>G</div>
              <div>
                <div className={styles.logoName}>GeoMedico</div>
                <div className={styles.logoTag}>Healthcare Ecosystem</div>
              </div>
            </div>
            <p className={styles.tagline}>
              Connecting every Indian to quality healthcare — from the nearest clinic to the farthest village.
              Powered by AI. Driven by humanity.
            </p>
            <div className={styles.certBadges}>
              <span className={styles.cert}>✅ NABH Compliant</span>
              <span className={styles.cert}>🔒 ISO 27001</span>
              <span className={styles.cert}>🏥 DISHA Act</span>
              <span className={styles.cert}>♿ Accessible</span>
            </div>
            <div className={styles.socials}>
              <a href="#" className={styles.social} aria-label="Twitter">𝕏</a>
              <a href="#" className={styles.social} aria-label="LinkedIn">in</a>
              <a href="#" className={styles.social} aria-label="YouTube">▶</a>
              <a href="#" className={styles.social} aria-label="Instagram">📷</a>
            </div>
          </div>

          <div className={styles.links}>
            {Object.entries(LINKS).map(([group, items]) => (
              <div key={group} className={styles.linkGroup}>
                <h4 className={styles.groupTitle}>{group}</h4>
                <ul>
                  {items.map(item => (
                    <li key={item}><a href="#">{item}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© 2026 GeoMedico Health Technologies Pvt. Ltd. All rights reserved. CIN: U85100MH2020PTC123456</p>
          <div className={styles.stores}>
            <button className={styles.storeBtn}>
              <span>🍎</span>
              <div>
                <div className={styles.storeSub}>Download on the</div>
                <div className={styles.storeName}>App Store</div>
              </div>
            </button>
            <button className={styles.storeBtn}>
              <span>▶</span>
              <div>
                <div className={styles.storeSub}>Get it on</div>
                <div className={styles.storeName}>Google Play</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
