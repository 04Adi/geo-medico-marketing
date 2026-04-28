import { useState } from 'react'
import Header from './components/Header'
import EcosystemHero from './components/EcosystemHero'
import TabNav from './components/TabNav'
import PatientTab from './components/tabs/PatientTab'
import DoctorTab from './components/tabs/DoctorTab'
import HospitalTab from './components/tabs/HospitalTab'
import PharmacyTab from './components/tabs/PharmacyTab'
import LabTab from './components/tabs/LabTab'
import AmbulanceTab from './components/tabs/AmbulanceTab'
import PodTab from './components/tabs/PodTab'
import VirtualCareTab from './components/tabs/VirtualCareTab'
import StatsStrip from './components/StatsStrip'
import Footer from './components/Footer'
import FortisPodPage from './pages/FortisPodPage'
import './App.css'

const TABS = [
  { id: 'overview',    label: 'Overview',          icon: '🌐' },
  { id: 'patient',     label: 'Patient',           icon: '🏥' },
  { id: 'doctor',      label: 'Doctor',            icon: '👨‍⚕️' },
  { id: 'hospital',    label: 'Hospital',          icon: '🏨' },
  { id: 'pharmacy',    label: 'Pharmacy',          icon: '💊' },
  { id: 'lab',         label: 'Lab & Diagnostics', icon: '🔬' },
  { id: 'ambulance',   label: 'Ambulance',         icon: '🚑' },
  { id: 'pod',         label: 'POD Healthcare',    icon: '📦' },
  { id: 'virtualcare', label: 'Virtual Care',      icon: '💻' },
]

const TAB_COMPONENTS = {
  patient:     <PatientTab />,
  doctor:      <DoctorTab />,
  hospital:    <HospitalTab />,
  pharmacy:    <PharmacyTab />,
  lab:         <LabTab />,
  ambulance:   <AmbulanceTab />,
  pod:         <PodTab />,
  virtualcare: <VirtualCareTab />,
}

export default function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [page, setPage] = useState('home')   // 'home' | 'fortis-pod'

  if (page === 'fortis-pod') {
    return (
      <>
        <Header
          onTabChange={setActiveTab}
          onShowFortisPod={() => setPage('fortis-pod')}
        />
        <FortisPodPage onBack={() => { setPage('home'); window.scrollTo(0, 0) }} />
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header
        onTabChange={setActiveTab}
        onShowFortisPod={() => { setPage('fortis-pod'); window.scrollTo(0, 0) }}
      />
      <TabNav tabs={TABS} active={activeTab} onChange={setActiveTab} />
      <main className="tab-content">
        {activeTab === 'overview' ? (
          <>
            <EcosystemHero onTabChange={t => { setActiveTab(t); window.scrollTo(0, 0) }} />
            <StatsStrip />
            <div style={{
              background: 'linear-gradient(135deg, #0c1c3a 0%, #1e1a05 100%)',
              borderBottom: '1px solid rgba(255,215,0,.15)',
              padding: '20px 0',
            }}>
              <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 28 }}>🏛️📦</span>
                  <div>
                    <div style={{ color: '#ffd700', fontWeight: 800, fontSize: 15 }}>
                      NEW — Fortis Diabetes POD · Bhubaneswar
                    </div>
                    <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 13, marginTop: 2 }}>
                      Fortis-authorized diabetes care — doctors, pharmacy &amp; lab — now in your city
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => { setPage('fortis-pod'); window.scrollTo(0, 0) }}
                  style={{
                    background: 'linear-gradient(135deg,#f59e0b,#fb923c)',
                    color: 'white', border: 'none', borderRadius: 10,
                    padding: '10px 22px', fontSize: 14, fontWeight: 700,
                    cursor: 'pointer', whiteSpace: 'nowrap',
                    fontFamily: 'var(--font-sans)',
                    boxShadow: '0 6px 20px rgba(245,158,11,.4)',
                  }}>
                  Explore Fortis POD →
                </button>
              </div>
            </div>
          </>
        ) : (
          TAB_COMPONENTS[activeTab]
        )}
      </main>
      <Footer />
    </>
  )
}
