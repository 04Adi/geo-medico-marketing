import styles from './StatsStrip.module.css'

const STATS = [
  { value: '50M+',    label: 'Patients Served',       icon: '👥' },
  { value: '1,20,000+', label: 'Verified Doctors',    icon: '👨‍⚕️' },
  { value: '8,500+',  label: 'Hospitals On Network',  icon: '🏥' },
  { value: '25,000+', label: 'Pharmacies & Labs',     icon: '💊' },
  { value: '4 Min',   label: 'Avg Ambulance Response', icon: '🚑' },
  { value: '500+',    label: 'Cities Covered',        icon: '🌍' },
]

export default function StatsStrip() {
  return (
    <section className={styles.strip}>
      <div className="container">
        <div className={styles.grid}>
          {STATS.map(s => (
            <div key={s.label} className={styles.item}>
              <span className={styles.icon}>{s.icon}</span>
              <div className={styles.value}>{s.value}</div>
              <div className={styles.label}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
