import { useEffect, useMemo, useState } from 'react'
import { MapPin, Star, BadgeCheck, Phone, Mail, Users, CheckCircle2, Stethoscope } from 'lucide-react'
import PortalShell, { StatusBadge, StageTrack } from '../portal/PortalShell'
import styles from '../portal/PortalShell.module.css'

const BLUE = '#0a6ebd'
const BLUE_LIGHT = '#e8f4ff'

function DoctorCard({ item }) {
  return (
    <div className={styles.card} style={{ '--card-accent': BLUE, borderRadius: 11 }}>
      <div className={styles.cardHead}>
        <div style={{ display:'flex', gap:12, alignItems:'flex-start', flex:1 }}>
          <div className={styles.avatar} style={{ background: BLUE_LIGHT, borderColor: `${BLUE}28`, borderRadius: 11, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Stethoscope size={22} color={BLUE} />
          </div>
          <div style={{ flex:1 }}>
            <div className={styles.cardName}>
              {item.name}
              {item.verified && (
                <span title="Verified" style={{ marginLeft:6, display:'inline-flex', verticalAlign:'middle' }}>
                  <BadgeCheck size={15} color="#16a34a" />
                </span>
              )}
            </div>
            <div className={styles.cardSub}>{item.specialty} · {item.qual}</div>
            <StageTrack status={item.status} />
          </div>
        </div>
        <StatusBadge status={item.status} />
      </div>

      <div className={styles.metaGrid}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>City</span>
          <span className={styles.metaValue} style={{ display:'inline-flex', alignItems:'center', gap:3 }}>
            <MapPin size={12} /> {item.city}
          </span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Experience</span>
          <span className={styles.metaValue}>{item.exp} years</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Consult Fee</span>
          <span className={styles.metaValue}>{item.fee}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>{item.status === 'active' ? 'Consults/Month' : 'Joined'}</span>
          <span className={styles.metaValue}>{item.status === 'active' ? item.consults : item.joined}</span>
        </div>
      </div>

      {item.rating && (
        <div className={styles.ratingRow}>
          <Star size={13} fill="#f59e0b" color="#f59e0b" />
          <span className={styles.ratingVal}>{Number(item.rating).toFixed(1)}</span>
          <span>patient rating</span>
        </div>
      )}

      <div className={styles.cardActions}>
        <button className={styles.actionBtn}>Profile</button>
        <button className={styles.actionBtn} style={{ display:'inline-flex', alignItems:'center', gap:5 }}>
          <Phone size={13} /> Call
        </button>
        <button className={styles.actionBtn} style={{ display:'inline-flex', alignItems:'center', gap:5 }}>
          <Mail size={13} /> Message
        </button>
      </div>
    </div>
  )
}

export default function DoctorTab() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/doctors')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { setDoctors(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const stats = useMemo(() => {
    const active = doctors.filter(d => d.status === 'active')
    const rated  = active.filter(d => d.rating)
    const avgRating = rated.length
      ? (rated.reduce((s, d) => s + Number(d.rating), 0) / rated.length).toFixed(2)
      : '—'
    const totalConsults = doctors.reduce((s, d) => s + Number(d.consults || 0), 0)
    return [
      { icon: <Users size={20} color={BLUE} />,        value: String(doctors.length),                                         label: 'Total Doctors'       },
      { icon: <CheckCircle2 size={20} color={BLUE} />, value: String(active.filter(d => d.verified).length),                  label: 'Active & Verified'   },
      { icon: <Star size={20} color={BLUE} />,         value: avgRating,                                                       label: 'Avg Platform Rating' },
      { icon: <Stethoscope size={20} color={BLUE} />,  value: String(totalConsults),                                           label: 'Consults This Month' },
    ]
  }, [doctors])

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:300, color:'rgba(255,255,255,.4)', fontSize:15 }}>
      Loading doctors…
    </div>
  )

  return (
    <PortalShell
      config={{ title:'Doctor Portfolio', icon:<Stethoscope size={22} color={BLUE} />, color: BLUE }}
      stats={stats}
      items={doctors}
      searchKeys={['name','specialty','city','qual']}
      renderCard={item => <DoctorCard key={item.id} item={item} />}
    />
  )
}
