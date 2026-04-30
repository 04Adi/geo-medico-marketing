import { useEffect, useMemo, useState } from 'react'
import { MapPin, Clock, Truck, ExternalLink, Phone, Pill, CheckCircle2, Package, Thermometer } from 'lucide-react'
import PortalShell, { StatusBadge, StageTrack } from '../portal/PortalShell'
import styles from '../portal/PortalShell.module.css'

const GREEN = '#00b894'
const GREEN_LIGHT = '#e0f7f1'
const GREEN_DARK = '#00695c'

function PharmacyCard({ item }) {
  return (
    <div className={styles.card} style={{ '--card-accent': GREEN, borderRadius: 11 }}>
      <div className={styles.cardHead}>
        <div style={{ display:'flex', gap:12, alignItems:'flex-start', flex:1 }}>
          <div className={styles.avatar} style={{ background: GREEN_LIGHT, borderColor: `${GREEN}28`, borderRadius: 11, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Pill size={22} color={GREEN} />
          </div>
          <div style={{ flex:1 }}>
            <div className={styles.cardName}>{item.name}</div>
            <div className={styles.cardSub} style={{ display:'inline-flex', alignItems:'center', gap:3 }}>
              <MapPin size={11} /> {item.area}, {item.city}
            </div>
            <StageTrack status={item.status} />
          </div>
        </div>
        <StatusBadge status={item.status} />
      </div>

      <div className={styles.metaGrid}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Owner / Contact</span>
          <span className={styles.metaValue}>{item.owner}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Phone</span>
          <span className={styles.metaValue} style={{ fontSize:11 }}>{item.phone}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Hours</span>
          <span className={styles.metaValue} style={{ display:'inline-flex', alignItems:'center', gap:3 }}>
            <Clock size={12} /> {item.hours}
          </span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>{item.status === 'active' ? 'Rx Orders/Month' : 'Joined'}</span>
          <span className={styles.metaValue}>{item.status === 'active' ? item.rx_orders : item.joined}</span>
        </div>
      </div>

      <div className={styles.tagRow}>
        {item.delivery && (
          <span className={styles.tag} style={{ background: GREEN_LIGHT, color: GREEN_DARK, display:'inline-flex', alignItems:'center', gap:4 }}>
            <Truck size={11} /> Home Delivery
          </span>
        )}
        {item.cold_chain && (
          <span className={styles.tag} style={{ background: GREEN_LIGHT, color: GREEN_DARK, display:'inline-flex', alignItems:'center', gap:4 }}>
            <Thermometer size={11} /> Cold Chain
          </span>
        )}
        <span className={styles.tag} style={{ background: GREEN_LIGHT, color: GREEN_DARK }}>Fortis Partner</span>
      </div>

      {item.url && (
        <a href={item.url} target="_blank" rel="noopener noreferrer"
          style={{ display:'inline-flex', alignItems:'center', gap:6,
            fontSize:11.5, fontWeight:600, color: GREEN,
            textDecoration:'none', padding:'6px 10px',
            background: GREEN_LIGHT, borderRadius:8 }}>
          <ExternalLink size={12} />
          {item.url.replace('https://www.', '').replace('https://', '')}
        </a>
      )}

      <div className={styles.cardActions}>
        <button className={styles.actionBtn}>View</button>
        <button className={styles.actionBtn} style={{ display:'inline-flex', alignItems:'center', gap:5 }}>
          <Phone size={13} /> Call
        </button>
        <button className={styles.actionBtn}>Contract</button>
      </div>
    </div>
  )
}

export default function PharmacyTab() {
  const [pharmacies, setPharmacies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/pharmacies')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { setPharmacies(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const stats = useMemo(() => {
    const active   = pharmacies.filter(p => p.status === 'active')
    const rxOrders = active.reduce((s, p) => s + Number(p.rx_orders || 0), 0)
    const withDel  = pharmacies.filter(p => p.delivery).length
    return [
      { icon: <Pill size={20} color={GREEN} />,         value: String(pharmacies.length),  label:'Pharmacies'            },
      { icon: <CheckCircle2 size={20} color={GREEN} />, value: String(active.length),       label:'Active Partners'        },
      { icon: <Package size={20} color={GREEN} />,      value: String(rxOrders),            label:'Rx Orders This Month'  },
      { icon: <Truck size={20} color={GREEN} />,        value: String(withDel),             label:'With Home Delivery'     },
    ]
  }, [pharmacies])

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:300, color:'rgba(255,255,255,.4)', fontSize:15 }}>
      Loading pharmacies…
    </div>
  )

  return (
    <PortalShell
      config={{ title:'Pharmacy Portfolio', icon:<Pill size={22} color={GREEN} />, color: GREEN }}
      stats={stats}
      items={pharmacies}
      searchKeys={['name','city','area','owner']}
      renderCard={item => <PharmacyCard key={item.id} item={item} />}
    />
  )
}
