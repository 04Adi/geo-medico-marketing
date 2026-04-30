import { useEffect, useMemo, useState } from 'react'
import PortalShell, { StatusBadge, StageTrack } from '../portal/PortalShell'
import styles from '../portal/PortalShell.module.css'

function LabCard({ item }) {
  const cert  = Array.isArray(item.cert)  ? item.cert  : []
  const tests = Array.isArray(item.tests) ? item.tests : []
  return (
    <div className={styles.card} style={{ '--card-accent': '#6c5ce7' }}>
      <div className={styles.cardHead}>
        <div style={{ display:'flex', gap:12, alignItems:'flex-start', flex:1 }}>
          <div className={styles.avatar}>🔬</div>
          <div style={{ flex:1 }}>
            <div className={styles.cardName}>{item.name}</div>
            <div className={styles.cardSub}>📍 {item.area}, {item.city}</div>
            <StageTrack status={item.status} />
          </div>
        </div>
        <StatusBadge status={item.status} />
      </div>

      <div className={styles.tagRow}>
        {cert.map(c => (
          <span key={c} style={{ fontSize:11, fontWeight:700, padding:'3px 9px', borderRadius:100,
            background:'#f0edff', color:'#5a4fcf' }}>🏅 {c}</span>
        ))}
        {item.home_collection && (
          <span style={{ fontSize:11, fontWeight:700, padding:'3px 9px', borderRadius:100,
            background:'#e0fff8', color:'#00806a' }}>🏠 Home Collection</span>
        )}
      </div>

      <div className={styles.metaGrid}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Contact</span>
          <span className={styles.metaValue}>{item.contact}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Phone</span>
          <span className={styles.metaValue} style={{ fontSize:11 }}>{item.phone}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>{item.status === 'active' ? 'Tests/Month' : 'Joined'}</span>
          <span className={styles.metaValue}>{item.status === 'active' ? item.test_count : item.joined}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Key Tests</span>
          <span className={styles.metaValue} style={{ fontSize:11 }}>{tests.slice(0,2).join(', ')}</span>
        </div>
      </div>

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
        <button className={styles.actionBtn}>📋 SOPs</button>
      </div>
    </div>
  )
}

export default function LabTab() {
  const [labs, setLabs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/labs')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { setLabs(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const stats = useMemo(() => {
    const active      = labs.filter(l => l.status === 'active')
    const nablActive  = active.filter(l => Array.isArray(l.cert) && l.cert.includes('NABL')).length
    const totalTests  = active.reduce((s, l) => s + Number(l.test_count || 0), 0)
    const withHome    = labs.filter(l => l.home_collection).length
    return [
      { icon:'🔬', value: String(labs.length),                       label:'Labs in Network'          },
      { icon:'✅', value: String(nablActive),                        label:'NABL Certified & Active'  },
      { icon:'🧪', value: totalTests.toLocaleString('en-IN'),        label:'Tests This Month'         },
      { icon:'🏠', value: String(withHome),                          label:'Home Collection Available' },
    ]
  }, [labs])

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:300, color:'rgba(255,255,255,.4)', fontSize:15 }}>
      Loading labs…
    </div>
  )

  return (
    <PortalShell
      config={{ title:'Lab & Diagnostics Portfolio', icon:'🔬', color:'#6c5ce7' }}
      stats={stats}
      items={labs}
      searchKeys={['name','city','area','contact']}
      renderCard={item => <LabCard key={item.id} item={item} />}
    />
  )
}
