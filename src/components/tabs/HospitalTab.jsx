import PortalShell, { StatusBadge, StageTrack } from '../portal/PortalShell'
import styles from '../portal/PortalShell.module.css'

const HOSPITALS = [
  { id:1,  name:'Apollo Hospitals',        city:'Chennai',      type:'Multi-Specialty', beds:520, tier:'Platinum', specialties:['Cardio','Onco','Neuro'],      status:'active',     contact:'Mr. Ravi Nair',    phone:'+91-44-2829-3333', joined:'Oct 2023', url:'https://www.apollohospitals.com' },
  { id:2,  name:'Fortis Hospital Mulund',  city:'Mumbai',       type:'Multi-Specialty', beds:380, tier:'Gold',     specialties:['Ortho','Cardio','Gastro'],    status:'active',     contact:'Ms. Preeti Joshi',  phone:'+91-22-6799-7000', joined:'Nov 2023', url:'https://www.fortishealthcare.com' },
  { id:3,  name:'Max Healthcare Saket',    city:'Delhi',        type:'Multi-Specialty', beds:600, tier:'Platinum', specialties:['Cardio','Neuro','Transplant'], status:'active',     contact:'Mr. Deepak Gupta',  phone:'+91-11-2651-5050', joined:'Sep 2023', url:'https://www.maxhealthcare.in' },
  { id:4,  name:'Manipal Hospital',        city:'Bangalore',    type:'Multi-Specialty', beds:450, tier:'Gold',     specialties:['Cardio','Ortho','Onco'],      status:'active',     contact:'Dr. Suresh Kumar',  phone:'+91-80-2502-4444', joined:'Dec 2023', url:'https://www.manipalhospitals.com' },
  { id:5,  name:'KIMS Hospitals',          city:'Hyderabad',    type:'Multi-Specialty', beds:400, tier:'Gold',     specialties:['Neuro','Cardio','Gastro'],    status:'active',     contact:'Ms. Vidya Reddy',   phone:'+91-40-4488-5000', joined:'Jan 2024', url:'https://www.kimshospitals.com' },
  { id:6,  name:'Care Hospitals',          city:'Hyderabad',    type:'Multi-Specialty', beds:250, tier:'Silver',   specialties:['Cardio','Nephro'],            status:'onboarding', contact:'Mr. Kiran Rao',     phone:'+91-40-3041-8888', joined:'Mar 2024', url:'https://www.carehospitals.com' },
  { id:7,  name:'Medanta Lucknow',         city:'Lucknow',      type:'Multi-Specialty', beds:350, tier:'Gold',     specialties:['Cardio','Ortho','Onco'],      status:'onboarding', contact:'Dr. Anil Saxena',   phone:'+91-522-4500-555',  joined:'Apr 2024', url:'https://www.medanta.org' },
  { id:8,  name:'KIMS Bhubaneswar',        city:'Bhubaneswar',  type:'Multi-Specialty', beds:200, tier:'Silver',   specialties:['Ortho','Cardio'],             status:'lead',       contact:'Mr. Sarat Panda',   phone:'+91-674-6660-000', joined:'—',        url:'https://www.kimshospitals.com' },
  { id:9,  name:'Sparsh Hospital',         city:'Bangalore',    type:'Orthopedic',      beds:120, tier:'Silver',   specialties:['Ortho','Spine','Sports'],     status:'lead',       contact:'Dr. Praveen',       phone:'+91-80-4600-1000', joined:'—',        url:'https://www.sparshospital.com' },
]

const STATS = [
  { icon:'🏥', value:'9',    label:'Hospitals in Network',  trend: 12 },
  { icon:'✅', value:'5',    label:'Active & Live',          trend: 0  },
  { icon:'🛏️', value:'3,270',label:'Total Beds Managed'                },
  { icon:'🌆', value:'7',    label:'Cities Covered',         trend: 5  },
]

const TIER_COLOR = { Platinum:'#7c3aed', Gold:'#d97706', Silver:'#6b7280' }

function HospitalCard({ item }) {
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
          background: `${TIER_COLOR[item.tier]}18` || '#f3f4f6',
          border: `1px solid ${TIER_COLOR[item.tier]}30` }}>
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

      <div className={styles.tagRow}>
        {item.specialties.map(s => (
          <span key={s} className={styles.tag}>{s}</span>
        ))}
      </div>

      {item.url && (
        <a href={item.url} target="_blank" rel="noopener noreferrer"
          style={{ display:'flex', alignItems:'center', gap:6,
            fontSize:11.5, fontWeight:600, color:'var(--primary)',
            textDecoration:'none', padding:'6px 10px',
            background:'var(--primary-light)', borderRadius:8,
            width:'fit-content' }}>
          🌐 {item.url.replace('https://www.', '')}
        </a>
      )}

      <div className={styles.cardActions}>
        <button className={styles.actionBtn}>👁 View</button>
        <button className={styles.actionBtn}>📞 Call</button>
        <button className={styles.actionBtn}>📋 MOU</button>
        {item.status === 'lead' && (
          <button className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}>➕ Onboard</button>
        )}
      </div>
    </div>
  )
}

export default function HospitalTab() {
  return (
    <PortalShell
      config={{ title:'Hospital Portfolio', icon:'🏨', color:'#0a6ebd', addLabel:'Add Hospital' }}
      stats={STATS}
      items={HOSPITALS}
      searchKeys={['name','city','type','tier']}
      renderCard={item => <HospitalCard key={item.id} item={item} />}
    />
  )
}
