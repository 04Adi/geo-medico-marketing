import PortalShell, { StatusBadge, StageTrack } from '../portal/PortalShell'
import styles from '../portal/PortalShell.module.css'

const LABS = [
  { id:1, name:'Neuberg Diagnostics',  city:'Bhubaneswar', area:'Ashok Nagar',    contact:'Dr. S. Mohanty',  phone:'+91-674-2391-111', cert:['NABL','ISO 15189'],  homeCollection:true,  tests:['HbA1c','FBS','Lipids','eGFR','CBC'],  testCount:480, status:'active',     joined:'Jan 2024', url:'https://www.neubergdiagnostics.com' },
  { id:2, name:'Thyrocare (Agilus)',   city:'Mumbai',      area:'Turbhe, Navi Mumbai', contact:'Mr. Anil Jain', phone:'+91-22-6900-1111', cert:['NABL','CAP'],   homeCollection:true,  tests:['Thyroid','Diabetes Panel','Metabolic'], testCount:1240, status:'active',    joined:'Oct 2023', url:'https://www.thyrocare.com' },
  { id:3, name:'Redcliffe Labs',       city:'Delhi',       area:'Lajpat Nagar',   contact:'Ms. Priya Arora', phone:'+91-11-4567-8900', cert:['NABL'],             homeCollection:true,  tests:['CBC','LFT','RFT','HbA1c'],             testCount:867, status:'active',     joined:'Nov 2023', url:'https://www.redcliffelabs.com' },
  { id:4, name:'SRL Diagnostics',      city:'Bangalore',   area:'Koramangala',    contact:'Mr. Rohit Kumar', phone:'+91-80-4042-0000', cert:['NABL','ISO'],       homeCollection:true,  tests:['Oncology','Genetics','Routine'],        testCount:654, status:'active',     joined:'Dec 2023', url:'https://www.srlworld.com' },
  { id:5, name:'Metropolis Healthcare',city:'Chennai',     area:'Anna Nagar',     contact:'Dr. Meena',       phone:'+91-44-4298-7000', cert:['NABL','CAP'],       homeCollection:false, tests:['Pathology','Microbiology','Serology'],  testCount:423, status:'active',     joined:'Jan 2024', url:'https://www.metropolisindia.com' },
  { id:6, name:'Dr. Lal PathLabs',     city:'Delhi',       area:'Rohini',         contact:'Mr. Vikas Garg',  phone:'+91-11-3030-3030', cert:['NABL','ISO 15189'], homeCollection:true,  tests:['Routine','Specialised'],               testCount:0,   status:'onboarding', joined:'Mar 2024', url:'https://www.lalpathlabs.com' },
  { id:7, name:'Vijaya Diagnostics',   city:'Hyderabad',   area:'Banjara Hills',  contact:'Dr. Ravi Teja',   phone:'+91-40-2355-7777', cert:['NABL'],             homeCollection:true,  tests:['Radiology','Pathology'],               testCount:0,   status:'lead',       joined:'—',        url:'https://www.vijayadiagnostic.com' },
]

const STATS = [
  { icon:'🔬', value:'7',    label:'Labs in Network',         trend: 8  },
  { icon:'✅', value:'5',    label:'NABL Certified & Active', trend: 0  },
  { icon:'🧪', value:'4,664',label:'Tests This Month',        trend: 14 },
  { icon:'🏠', value:'6',    label:'Home Collection Available'          },
]

function LabCard({ item }) {
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
        {item.cert.map(c => (
          <span key={c} style={{ fontSize:11, fontWeight:700, padding:'3px 9px', borderRadius:100,
            background:'#f0edff', color:'#5a4fcf' }}>🏅 {c}</span>
        ))}
        {item.homeCollection && (
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
          <span className={styles.metaValue}>{item.status === 'active' ? item.testCount : item.joined}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Key Tests</span>
          <span className={styles.metaValue} style={{ fontSize:11 }}>{item.tests.slice(0,2).join(', ')}</span>
        </div>
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
        <button className={styles.actionBtn}>📋 SOPs</button>
        {item.status === 'lead' && (
          <button className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}>➕ Empanel</button>
        )}
      </div>
    </div>
  )
}

export default function LabTab() {
  return (
    <PortalShell
      config={{ title:'Lab & Diagnostics Portfolio', icon:'🔬', color:'#6c5ce7', addLabel:'Empanel Lab' }}
      stats={STATS}
      items={LABS}
      searchKeys={['name','city','area','contact']}
      renderCard={item => <LabCard key={item.id} item={item} />}
    />
  )
}
