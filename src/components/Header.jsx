import { useState, useEffect } from 'react'
import styles from './Header.module.css'

export default function Header({ onTabChange }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const handleLogin = (type) => {
  window.location.href = `https://geomedico.com/login?persona=${type}`;
   };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className="container">
        <nav className={styles.nav}>
          <a href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <span>G</span>
            </div>
            <div className={styles.logoText}>
              <span className={styles.logoMain}>GeoMedico</span>
              <span className={styles.logoSub}>Healthcare Ecosystem</span>
            </div>
          </a>

          <ul className={`${styles.navLinks} ${mobileOpen ? styles.open : ''}`}>
            <li><a href="#services" onClick={() => setMobileOpen(false)}>Services</a></li>
            <li><a href="#about" onClick={() => setMobileOpen(false)}>About</a></li>
            <li><a href="#network" onClick={() => setMobileOpen(false)}>Network</a></li>
            <li><a href="#contact" onClick={() => setMobileOpen(false)}>Contact</a></li>
          </ul>

          <div className={styles.navActions}>
            <button onClick={() => handleLogin("patient")}>Login</button>
            <button onClick={() => handleLogin("patient")}>Get Started</button>
          </div>

          <button
            className={styles.hamburger}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </nav>
      </div>
    </header>
  )
}
