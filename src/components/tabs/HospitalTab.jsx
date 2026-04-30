import { useEffect, useMemo, useState } from 'react'
import PortalShell, { StatusBadge, StageTrack } from '../portal/PortalShell'
import styles from '../portal/PortalShell.module.css'

const TIER_COLOR = { Platinum:'#7c3aed', Gold:'#d97706', Silver:'#6b7280' }

function HospitalCard({ item }) {
  const sp = Array.isArray(item.specialties) ? item.specialties : []
  return (
    <div className={styles.card} style={{ '--card-accent': '#0a6ebd' }}>
      <div className={styles.cardHead}>
        <div style={{ display:'flex', gap:12, alignItems:'flex-start', flex:1 }}>
          <div className={styles.avatar}>🏥</div>
          <div style={{ flex:1 }}>
            <div className={styles.cardName}>{item.name}</div>
            <div className={styles.cardSub}>{item.type} · {item.city}</div>
            <StageTrack status={item.status} />
          </div>
        </div>
        <StatusBadge status={item.status} />
      </div>

      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
        <span style={{ fontSize:12, fontWeight:700, padding:'3px 10px', borderRadius:100,
          color: TIER_COLOR[item.tier] || '#6b7280',
          background: `${TIER_COLOR[item.tier] || '#6b7280'}18`,
          border: `1px solid ${TIER_COLOR[item.tier] || '#6b7280'}30` }}>
          {item.tier === 'Platinum' ? '💎' : item.tier === 'Gold' ? '🏆' : '🥈'} {item.tier} Partner
        </span>
      </div>

      <div className={styles.metaGrid}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Bed Capacity</span>
          <span className={styles.metaValue}>🛏️ {item.beds}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Contact Person</span>
          <span className={styles.metaValue}>{item.contact}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Phone</span>
          <span className={styles.metaValue} style={{ fontSize:11 }}>{item.phone}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Onboarded</span>
          <span className={styles.metaValue}>{item.joined}</span>
        </div>
      </div>

      {sp.length > 0 && (
        <div className={styles.tagRow}>
          {sp.map(s => <span key={s} className={styles.tag}>{s}</span>)}
        </div>
      )}

      {item.url && (
        <a href={item.url} target="_blank" rel="noopener noreferrer"
          style={{ display:'flex', alignItems:'center', gap:6,
            fontSize:11.5, fontWeight:600, color:'var(--primary)',
            textDecoration:'none', padding:'6px 10px',
            background:'var(--primary-light)', borderRadius:8, width:'fit-content' }}>
          🌐 {item.url.replace('https://www.', '')}
        </a>
      )}

      <div className={styles.cardActions}>
        <button className={styles.actionBtn}>👁 View</button>
        <button className={styles.actionBtn}>📞 Call</button>
        <button className={styles.actionBtn}>📋 MOU</button>
      </div>
    </div>
  )
}

export default function HospitalTab() {
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/hospitals')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { setHospitals(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const stats = useMemo(() => {
    const active = hospitals.filter(h => h.status === 'active')
    const beds   = hospitals.reduce((s, h) => s + Number(h.beds || 0), 0)
    const cities = new Set(hospitals.map(h => h.city).filter(Boolean)).size
    return [
      { icon:'🏥', value: String(hospitals.length),        label:'Hospitals in Network' },
      { icon:'✅', value: String(active.length),           label:'Active & Live'         },
      { icon:'🛏️', value: beds.toLocaleString('en-IN'),    label:'Total Beds Managed'    },
      { icon:'🌆', value: String(cities),                  label:'Cities Covered'        },
    ]
  }, [hospitals])

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:300, color:'rgba(255,255,255,.4)', fontSize:15 }}>
      Loading hospitals…
    </div>
  )

  return (
    <PortalShell
      config={{ title:'Hospital Portfolio', icon:'🏨', color:'#0a6ebd' }}
      stats={stats}
      items={hospitals}
      searchKeys={['name','city','type','tier']}
      renderCard={item => <HospitalCard key={item.id} item={item} />}
    />
  )
}
