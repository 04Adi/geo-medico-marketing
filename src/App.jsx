import { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import TabNav from './components/TabNav'
import TabHero from './components/TabHero'
import FeatureGrid from './components/FeatureGrid'
import HowItWorks from './components/HowItWorks'
import StatsStrip from './components/StatsStrip'
import AppCTA from './components/AppCTA'
import Footer from './components/Footer'
import OfferBanner from './components/OfferBanner'
import './App.css'

export default function App() {
  const [activeTab, setActiveTab] = useState('doctor')
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const TABS = [
    {
      id: 'doctor',
      label: 'Find Doctor',
      icon: '👨‍⚕️',
      badge: 'Specialist Doctors',
      heading: 'Book Your Doctor',
      subheading: 'Appointment in Minutes',
      desc: 'Connect with verified doctors across multiple specializations. Get instant appointment confirmations and real-time queue updates. Video or phone consultations available 24/7.',
      emoji: '👨‍⚕️',
      accent: '#0a6ebd',
      tags: ['Verified Doctors', 'Instant Booking', 'Real-time Queue', 'Expert Consultation'],
      features: [
        {
          icon: '🔍',
          title: 'Smart Doctor Discovery',
          desc: 'Find specialists near you with ratings, availability, and real experience',
          color: '#e3f2fd',
          iconBg: '#bbdefb',
        },
        {
          icon: '⏱️',
          title: 'Queue Position Tracking',
          desc: 'Know exactly when your turn is. Real-time updates on consultant status',
          color: '#e3f2fd',
          iconBg: '#bbdefb',
        },
        {
          icon: '💬',
          title: 'Multi-Channel Booking',
          desc: 'Book via app, voice call, or chat bot. Multiple ways for your convenience',
          color: '#e3f2fd',
          iconBg: '#bbdefb',
        },
        {
          icon: '📋',
          title: 'Digital Prescriptions',
          desc: 'Receive prescriptions instantly. No paperwork, just digital records',
          color: '#e3f2fd',
          iconBg: '#bbdefb',
        },
      ],
      steps: [
        { num: 1, icon: '🔍', title: 'Search Doctor', desc: 'Find specialists by location, experience, or specialization' },
        { num: 2, icon: '📅', title: 'Choose Time', desc: 'Select available appointment slot that fits your schedule' },
        { num: 3, icon: '✓', title: 'Confirm & Join Queue', desc: 'Get instant confirmation with your queue position' },
        { num: 4, icon: '💬', title: 'Consultation', desc: 'Join call at your scheduled time for instant diagnosis' },
      ],
      howItWorksTitle: 'How Doctor Appointment Works',
    },
    {
      id: 'hospital',
      label: 'Hospital',
      icon: '🏥',
      badge: 'Quality Healthcare',
      heading: 'Access Best Hospitals',
      subheading: 'Bed Booking & Emergency Care',
      desc: 'Find multi-specialty hospitals with real-time bed availability. Check emergency services, ICU facilities, and specialist availability instantly. Direct bed booking with no middlemen.',
      emoji: '🏥',
      accent: '#00b894',
      tags: ['Real-time Beds', '24/7 Emergency', 'Multi-specialty', 'Direct Booking'],
      features: [
        {
          icon: '🛏️',
          title: 'Real-Time Bed Availability',
          desc: 'Check available beds, ICU, and wards in real-time across partner hospitals',
          color: '#e8f5e9',
          iconBg: '#c8e6c9',
        },
        {
          icon: '🚨',
          title: 'Emergency Services',
          desc: '24/7 emergency care with ambulance dispatch and critical care units',
          color: '#e8f5e9',
          iconBg: '#c8e6c9',
        },
        {
          icon: '👨‍⚕️',
          title: 'Specialist Doctors On-Site',
          desc: 'Check resident specialists and their availability at each hospital',
          color: '#e8f5e9',
          iconBg: '#c8e6c9',
        },
        {
          icon: '💳',
          title: 'Pre-Admission Booking',
          desc: 'Book beds in advance, reserve specialist time, and confirm services',
          color: '#e8f5e9',
          iconBg: '#c8e6c9',
        },
      ],
      steps: [
        { num: 1, icon: '🏥', title: 'Search Hospital', desc: 'Find nearby hospitals with real-time bed status and availability' },
        { num: 2, icon: '🛏️', title: 'Check Beds', desc: 'View available general wards, ICU beds, and specialized units' },
        { num: 3, icon: '👨‍⚕️', title: 'Select Specialist', desc: 'Choose from on-site doctors or request specific specialist' },
        { num: 4, icon: '📋', title: 'Book & Admit', desc: 'Complete pre-admission paperwork and get instant confirmation' },
      ],
      howItWorksTitle: 'How Hospital Booking Works',
    },
    {
      id: 'lab',
      label: 'Lab Tests',
      icon: '🔬',
      badge: 'Diagnostic Tests',
      heading: 'Book Lab Tests',
      subheading: 'Home Sample Collection',
      desc: 'Get certified lab tests done from home. NABL certified labs with home sample collection. Results online within 24 hours with doctor interpretation included.',
      emoji: '🔬',
      accent: '#6c5ce7',
      tags: ['Home Collection', 'NABL Certified', 'Fast Results', 'Doctor Interpretation'],
      features: [
        {
          icon: '🏠',
          title: 'Home Sample Collection',
          desc: 'Lab technicians come to your home. No need to visit labs anymore',
          color: '#f3e5f5',
          iconBg: '#e1bee7',
        },
        {
          icon: '⚡',
          title: 'Fast Results',
          desc: '24-48 hour report delivery with doctor interpretation included free',
          color: '#f3e5f5',
          iconBg: '#e1bee7',
        },
        {
          icon: '✓',
          title: 'NABL Certified Labs',
          desc: 'All partner labs are NABL certified for accurate and reliable results',
          color: '#f3e5f5',
          iconBg: '#e1bee7',
        },
        {
          icon: '📊',
          title: 'Health Reports Online',
          desc: 'Access all your health reports anytime, anywhere in one place',
          color: '#f3e5f5',
          iconBg: '#e1bee7',
        },
      ],
      steps: [
        { num: 1, icon: '🔬', title: 'Select Test', desc: 'Choose from 1000+ health tests available on GeoMedico' },
        { num: 2, icon: '📍', title: 'Schedule Collection', desc: 'Pick convenient date and time for home sample collection' },
        { num: 3, icon: '👤', title: 'Technician Arrives', desc: 'Certified technician collects sample from your home' },
        { num: 4, icon: '📋', title: 'Get Results', desc: 'Receive reports online with doctor interpretation' },
      ],
      howItWorksTitle: 'How Lab Booking Works',
    },
    {
      id: 'ambulance',
      label: 'Ambulance',
      icon: '🚑',
      badge: 'Emergency Response',
      heading: 'Emergency Ambulance',
      subheading: 'Average 4-Minute Response',
      desc: 'Get ambulance in minutes during medical emergencies. GPS-tracked vehicles with trained paramedics. Direct routing to preferred hospitals with real-time tracking.',
      emoji: '🚑',
      accent: '#fd7272',
      tags: ['4-Min Response', 'Trained Paramedics', 'GPS Tracking', 'Hospital Routing'],
      urgent: true,
      features: [
        {
          icon: '⚡',
          title: '4-Minute Average Response',
          desc: 'Emergency ambulance dispatch within 4 minutes of call in most areas',
          color: '#ffebee',
          iconBg: '#ffcdd2',
        },
        {
          icon: '🚑',
          title: 'Trained Paramedics',
          desc: 'All ambulances staffed with trained paramedics and emergency equipment',
          color: '#ffebee',
          iconBg: '#ffcdd2',
        },
        {
          icon: '📍',
          title: 'GPS Tracking',
          desc: 'Real-time GPS tracking of ambulance. Know ETA and location anytime',
          color: '#ffebee',
          iconBg: '#ffcdd2',
        },
        {
          icon: '🏥',
          title: 'Hospital Routing',
          desc: 'Direct routing to your preferred hospital with bed pre-allocation',
          color: '#ffebee',
          iconBg: '#ffcdd2',
        },
      ],
      steps: [
        { num: 1, icon: '🆘', title: 'Emergency SOS', desc: 'One-tap SOS button or call 1800-MEDICO-1 instantly' },
        { num: 2, icon: '📍', title: 'Location Shared', desc: 'Your location is auto-shared with nearest ambulance' },
        { num: 3, icon: '🚑', title: 'Dispatch in 2 Mins', desc: 'Ambulance dispatched within 2 minutes with paramedic team' },
        { num: 4, icon: '🏥', title: 'Hospital Admission', desc: 'Direct admission to preferred hospital with pre-booked bed' },
      ],
      howItWorksTitle: 'How Emergency Service Works',
    },
    {
      id: 'pod',
      label: 'POD Kiosk',
      icon: '📦',
      badge: 'Healthcare Kiosks',
      heading: 'POD Health Kiosks',
      subheading: 'Self-Care Monitoring Stations',
      desc: 'AI-powered health monitoring kiosks at your neighborhood. Get health checkups, vital monitoring, and health reports instantly. Available 24/7 at 500+ locations.',
      emoji: '📦',
      accent: '#ff9f43',
      tags: ['AI Monitoring', '24/7 Available', 'Instant Reports', '500+ Locations'],
      features: [
        {
          icon: '🔬',
          title: 'Health Monitoring',
          desc: 'Monitor BP, heart rate, temperature, oxygen, and blood glucose instantly',
          color: '#fff8e1',
          iconBg: '#ffe082',
        },
        {
          icon: '🤖',
          title: 'AI Health Assessment',
          desc: 'Get instant health assessment based on vital readings and symptoms',
          color: '#fff8e1',
          iconBg: '#ffe082',
        },
        {
          icon: '📊',
          title: 'Health Reports',
          desc: 'Generate detailed health reports and track trends over time',
          color: '#fff8e1',
          iconBg: '#ffe082',
        },
        {
          icon: '🚀',
          title: 'Nearby Consultations',
          desc: 'Get recommended doctors if further checkup needed from kiosk itself',
          color: '#fff8e1',
          iconBg: '#ffe082',
        },
      ],
      steps: [
        { num: 1, icon: '📍', title: 'Find POD Kiosk', desc: 'Locate nearest POD kiosk from app (500+ locations in cities)' },
        { num: 2, icon: '🔬', title: 'Health Checkup', desc: 'Insert arm for automatic vital signs monitoring and assessment' },
        { num: 3, icon: '🤖', title: 'AI Analysis', desc: 'AI analyzes readings and provides instant health insights' },
        { num: 4, icon: '📱', title: 'Save & Share', desc: 'Reports sent to your phone and can be shared with doctors' },
      ],
      howItWorksTitle: 'How POD Kiosk Works',
    },
  ]

  const currentTab = TABS.find(t => t.id === activeTab) || TABS[0]

  return (
    <div className="app">
      <Header onTabChange={setActiveTab} />
      <Hero onTabChange={setActiveTab} />
      <OfferBanner />
      
      {/* About GeoMedico Section */}
      <section className="section about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-left">
              <h2 className="section-heading">About GeoMedico</h2>
              <p className="about-desc">
                GeoMedico is revolutionizing healthcare in India by making quality medical services accessible to everyone, everywhere. We connect patients with verified doctors, hospitals, diagnostic labs, pharmacies, and emergency services through our innovative geo-location powered platform.
              </p>
              <div className="about-mission">
                <h3>Our Mission</h3>
                <p>
                  To ensure every Indian, from the nearest city clinic to the farthest village, has access to world-class healthcare services powered by artificial intelligence and driven by humanity.
                </p>
              </div>
              <div className="about-stats">
                <div className="stat">
                  <div className="stat-number">50M+</div>
                  <div className="stat-label">Patients Connected</div>
                </div>
                <div className="stat">
                  <div className="stat-number">1,20,000+</div>
                  <div className="stat-label">Doctors Verified</div>
                </div>
                <div className="stat">
                  <div className="stat-number">8,500+</div>
                  <div className="stat-label">Hospitals</div>
                </div>
                <div className="stat">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Cities Covered</div>
                </div>
              </div>
            </div>
            <div className="about-right">
              <div className="about-visual">
                <div className="visual-item v1">
                  <div className="visual-icon">👨‍⚕️</div>
                  <div className="visual-text">Verified Doctors</div>
                </div>
                <div className="visual-item v2">
                  <div className="visual-icon">🏥</div>
                  <div className="visual-text">Hospitals</div>
                </div>
                <div className="visual-item v3">
                  <div className="visual-icon">🔬</div>
                  <div className="visual-text">Labs</div>
                </div>
                <div className="visual-item v4">
                  <div className="visual-icon">💊</div>
                  <div className="visual-text">Pharmacies</div>
                </div>
                <div className="visual-item v5">
                  <div className="visual-icon">🚑</div>
                  <div className="visual-text">Ambulance</div>
                </div>
                <div className="visual-item v6">
                  <div className="visual-icon">📦</div>
                  <div className="visual-text">POD Kiosk</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Tabs */}
      <TabNav tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {/* Dynamic Tab Content */}
      <TabHero
        badge={currentTab.badge}
        heading={currentTab.heading}
        subheading={currentTab.subheading}
        desc={currentTab.desc}
        emoji={currentTab.emoji}
        accent={currentTab.accent}
        tags={currentTab.tags}
        urgent={currentTab.urgent}
      />

      <section className="section features-section">
        <div className="container">
          <div className="section-heading text-center">
            <h2>Why Choose GeoMedico for {currentTab.label}?</h2>
          </div>
          <FeatureGrid features={currentTab.features} />
        </div>
      </section>

      <HowItWorks
        title={currentTab.howItWorksTitle}
        steps={currentTab.steps}
        accent={currentTab.accent}
      />

      <StatsStrip />

      <AppCTA
        title="Download GeoMedico App Now"
        desc="Healthcare at your fingertips. One app for all your medical needs. Available on iOS and Android."
        accent={currentTab.accent}
        stats={[
          { val: '4.8★', lbl: 'App Rating' },
          { val: '50M+', lbl: 'Downloads' },
          { val: '24/7', lbl: 'Customer Support' },
        ]}
      />

      <Footer />
    </div>
  )
}
