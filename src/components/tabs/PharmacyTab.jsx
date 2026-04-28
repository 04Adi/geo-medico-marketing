import PortalShell, { StatusBadge, StageTrack } from '../portal/PortalShell'
import styles from '../portal/PortalShell.module.css'

const PHARMACIES = [
  { id:1, name:'MedPlus – Saheed Nagar', city:'Bhubaneswar', area:'Saheed Nagar',     owner:'Ramesh Pattnaik', phone:'+91-674-2540-100', hours:'24×7',     delivery:true,  coldChain:true,  rxOrders:142, status:'active',     joined:'Jan 2024', url:'https://www.medplusmart.com' },
  { id:2, name:'Apollo Pharmacy',         city:'Mumbai',       area:'Andheri West',    owner:'Anjali Shah',     phone:'+91-22-2674-0000', hours:'6AM–11PM', delivery:true,  coldChain:true,  rxOrders:218, status:'active',     joined:'Nov 2023', url:'https://www.apollopharmacy.in' },
  { id:3, name:'Wellness Forever',        city:'Pune',         area:'Koregaon Park',   owner:'Nitin Deshpande', phone:'+91-20-4120-7777', hours:'8AM–10PM', delivery:true,  coldChain:false, rxOrders:96,  status:'active',     joined:'Dec 2023', url:'https://www.wellnessforever.com' },
  { id:4, name:'Frank Ross Pharmacy',     city:'Kolkata',      area:'Park Street',     owner:'Subir Ghosh',     phone:'+91-33-2229-6000', hours:'9AM–9PM',  delivery:false, coldChain:false, rxOrders:74,  status:'active',     joined:'Jan 2024', url:null },
  { id:5, name:'Jan Aushadhi Centre',     city:'Hyderabad',    area:'Jubilee Hills',   owner:'Venkat Rao',      phone:'+91-40-2355-1000', hours:'9AM–8PM',  delivery:false, coldChain:false, rxOrders:53,  status:'active',     joined:'Feb 2024', url:'https://janaushadhi.gov.in' },
  { id:6, name:'Netmeds Hub',             city:'Chennai',      area:'T. Nagar',        owner:'Arun Kumar',      phone:'+91-44-2434-0000', hours:'8AM–10PM', delivery:true,  coldChain:true,  rxOrders:0,   status:'onboarding', joined:'Mar 2024', url:'https://www.netmeds.com' },
  { id:7, name:'Guardian Pharmacy',       city:'Delhi',        area:'Connaught Place', owner:'Harpreet Singh',  phone:'+91-11-2341-5000', hours:'24×7',     delivery:true,  coldChain:false, rxOrders:0,   status:'onboarding', joined:'Apr 2024', url:null },
  { id:8, name:'City Medicals',           city:'Jaipur',       area:'MI Road',         owner:'Deepak Sharma',   phone:'+91-141-2374-000', hours:'9AM–9PM',  delivery:false, coldChain:false, rxOrders:0,   status:'lead',       joined:'—',        url:null },
]

const STATS = [
  { icon:'💊', value:'8',   label:'Pharmacies',            trend: 10 },
  { icon:'✅', value:'5',   label:'Active Partners',        trend: 0  },
  { icon:'📦', value:'583', label:'Rx Orders This Month',  trend: 18 },
  { icon:'🏠', value:'6',   label:'With Home Delivery'                },
]

function PharmacyCard({ item }) {
  return (
    <div className={styles.card} style={{ '--card-accent': '#00b894' }}>
      <div className={styles.cardHead}>
        <div style={{ display:'flex', gap:12, alignItems:'flex-start', flex:1 }}>
          <div className={styles.avatar}>💊</div>
          <div style={{ flex:1 }}>
            <div className={styles.cardName}>{item.name}</div>
            <div className={styles.cardSub}>📍 {item.area}, {item.city}</div>
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
          <span className={styles.metaValue}>🕐 {item.hours}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>{item.status === 'active' ? 'Rx Orders/Month' : 'Joined'}</span>
          <span className={styles.metaValue}>{item.status === 'active' ? item.rxOrders : item.joined}</span>
        </div>
      </div>

      <div className={styles.tagRow}>
        {item.delivery  && <span className={styles.tag}>🛵 Home Delivery</span>}
        {item.coldChain && <span className={styles.tag}>❄️ Cold Chain</span>}
        <span className={styles.tag}>💊 Fortis Partner</span>
      </div>

      {item.url && (
        <a href={item.url} target="_blank" rel="noopener noreferrer"
          style={{ display:'flex', alignItems:'center', gap:6,
            fontSize:11.5, fontWeight:600, color:'var(--primary)',
            textDecoration:'none', padding:'6px 10px',
            background:'var(--primary-light)', borderRadius:8,
            width:'fit-content' }}>
          🌐 {item.url.replace('https://www.', '').replace('https://', '')}
        </a>
      )}

      <div className={styles.cardActions}>
        <button className={styles.actionBtn}>👁 View</button>
        <button className={styles.actionBtn}>📞 Call</button>
        <button className={styles.actionBtn}>📋 Contract</button>
        {item.status === 'lead' && (
          <button className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}>➕ Onboard</button>
        )}
      </div>
    </div>
  )
}

export default function PharmacyTab() {
  return (
    <PortalShell
      config={{ title:'Pharmacy Portfolio', icon:'💊', color:'#00b894', addLabel:'Add Pharmacy' }}
      stats={STATS}
      items={PHARMACIES}
      searchKeys={['name','city','area','owner']}
      renderCard={item => <PharmacyCard key={item.id} item={item} />}
    />
  )
}
