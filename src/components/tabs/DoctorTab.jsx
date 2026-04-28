import PortalShell, { StatusBadge, StageTrack } from '../portal/PortalShell'
import styles from '../portal/PortalShell.module.css'

const DOCTORS = [
  { id:1,  name:'Dr. Priya Sharma',    specialty:'Cardiologist',    city:'Mumbai',       exp:14, rating:4.8, consults:127, fee:'₹800',  status:'active',     avatar:'👩‍⚕️', qual:'MD (Cardiology)', verified:true,  joined:'Jan 2024' },
  { id:2,  name:'Dr. Rajesh Kumar',    specialty:'Diabetologist',   city:'Delhi',        exp:18, rating:4.9, consults:203, fee:'₹1000', status:'active',     avatar:'👨‍⚕️', qual:'DM (Endo)',       verified:true,  joined:'Feb 2024' },
  { id:3,  name:'Dr. Ananya Mehta',    specialty:'Gynecologist',    city:'Bangalore',    exp:11, rating:4.7, consults:89,  fee:'₹700',  status:'active',     avatar:'👩‍⚕️', qual:'MD (OBG)',        verified:true,  joined:'Mar 2024' },
  { id:4,  name:'Dr. Suresh Patel',    specialty:'Orthopedic',      city:'Ahmedabad',    exp:16, rating:4.6, consults:156, fee:'₹900',  status:'active',     avatar:'👨‍⚕️', qual:'MS (Ortho)',      verified:true,  joined:'Nov 2023' },
  { id:5,  name:'Dr. Kavitha Reddy',   specialty:'Neurologist',     city:'Hyderabad',    exp:13, rating:4.8, consults:67,  fee:'₹1200', status:'active',     avatar:'👩‍⚕️', qual:'DM (Neuro)',      verified:true,  joined:'Dec 2023' },
  { id:6,  name:'Dr. Amit Singh',      specialty:'Pediatrician',    city:'Kolkata',      exp:9,  rating:4.9, consults:212, fee:'₹600',  status:'active',     avatar:'👨‍⚕️', qual:'MD (Paed)',       verified:true,  joined:'Oct 2023' },
  { id:7,  name:'Dr. Lakshmi Nair',    specialty:'Dermatologist',   city:'Chennai',      exp:8,  rating:4.5, consults:94,  fee:'₹650',  status:'active',     avatar:'👩‍⚕️', qual:'MD (Derm)',       verified:true,  joined:'Jan 2024' },
  { id:8,  name:'Dr. Vikram Joshi',    specialty:'Psychiatrist',    city:'Pune',         exp:12, rating:null,consults:0,   fee:'₹950',  status:'onboarding', avatar:'👨‍⚕️', qual:'MD (Psych)',      verified:false, joined:'Apr 2024' },
  { id:9,  name:'Dr. Pooja Agarwal',   specialty:'ENT Specialist',  city:'Jaipur',       exp:7,  rating:null,consults:0,   fee:'₹700',  status:'onboarding', avatar:'👩‍⚕️', qual:'MS (ENT)',        verified:false, joined:'Apr 2024' },
  { id:10, name:'Dr. Mohan Das',       specialty:'General Physician',city:'Bhubaneswar', exp:15, rating:null,consults:0,   fee:'₹400',  status:'onboarding', avatar:'👨‍⚕️', qual:'MBBS, MD',       verified:false, joined:'Apr 2024' },
  { id:11, name:'Dr. Sanjay Verma',    specialty:'Urologist',       city:'Lucknow',      exp:10, rating:null,consults:0,   fee:'₹800',  status:'lead',       avatar:'👨‍⚕️', qual:'MCh (Uro)',       verified:false, joined:'—' },
  { id:12, name:'Dr. Ritu Sharma',     specialty:'Endocrinologist', city:'Chandigarh',   exp:8,  rating:null,consults:0,   fee:'₹900',  status:'lead',       avatar:'👩‍⚕️', qual:'DM (Endo)',       verified:false, joined:'—' },
]

const STATS = [
  { icon:'👨‍⚕️', value:'12',   label:'Total Doctors',        trend: 15 },
  { icon:'✅',    value:'7',    label:'Active & Verified',    trend: 8  },
  { icon:'⭐',    value:'4.75', label:'Avg Platform Rating'             },
  { icon:'🩺',    value:'948',  label:'Consults This Month',  trend: 22 },
]

function DoctorCard({ item }) {
  return (
    <div className={styles.card} style={{ '--card-accent': '#0a6ebd' }}>
      <div className={styles.cardHead}>
        <div style={{ display:'flex', gap:12, alignItems:'flex-start', flex:1 }}>
          <div className={styles.avatar}>{item.avatar}</div>
          <div style={{ flex:1 }}>
            <div className={styles.cardName}>
              {item.name}
              {item.verified && <span title="Verified" style={{ marginLeft:6, fontSize:12 }}>✅</span>}
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
          <span className={styles.metaValue}>📍 {item.city}</span>
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
          ⭐ <span className={styles.ratingVal}>{item.rating}</span>
          <span>patient rating</span>
        </div>
      )}

      <div className={styles.cardActions}>
        <button className={styles.actionBtn}>👁 Profile</button>
        <button className={styles.actionBtn}>📞 Call</button>
        <button className={styles.actionBtn}>✉️ Message</button>
        {item.status === 'lead' && (
          <button className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}>
            ➕ Onboard
          </button>
        )}
      </div>
    </div>
  )
}

export default function DoctorTab() {
  return (
    <PortalShell
      config={{ title:'Doctor Portfolio', icon:'👨‍⚕️', color:'#0a6ebd', addLabel:'Onboard Doctor' }}
      stats={STATS}
      items={DOCTORS}
      searchKeys={['name','specialty','city','qual']}
      renderCard={item => <DoctorCard key={item.id} item={item} />}
    />
  )
}
