import { useEffect, useRef, useState } from 'react'
import styles from './AdminPage.module.css'

const ADMIN_PASSWORD = 'GeoAdmin@2024'

// ─── Reusable primitives ──────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div className={styles.fieldGroup}>
      <label>{label}</label>
      {children}
    </div>
  )
}

function Inp({ ...props }) {
  return <input className={styles.input} {...props} />
}

function Sel({ children, ...props }) {
  return <select className={styles.input} {...props}>{children}</select>
}

function Txa({ ...props }) {
  return <textarea className={`${styles.input} ${styles.textarea}`} {...props} />
}

function Check({ label, checked, onChange }) {
  return (
    <label className={styles.checkLabel}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  )
}

function SaveBtn({ saving, saved, onClick, label = 'Save' }) {
  return (
    <button
      className={`${styles.saveBtn} ${saved ? styles.saveBtnDone : ''}`}
      onClick={onClick}
      disabled={saving}
    >
      {saving ? '…' : saved ? '✓ Saved' : label}
    </button>
  )
}

function DeleteBtn({ onClick }) {
  return <button className={styles.deleteBtn} onClick={onClick}>🗑️ Delete</button>
}

function EditBtn({ onClick }) {
  return <button className={styles.editBtn} onClick={onClick}>✏️ Edit</button>
}

function CancelBtn({ onClick }) {
  return <button className={styles.cancelBtn} onClick={onClick}>Cancel</button>
}

// ─── Login ────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) { sessionStorage.setItem('gm_admin', '1'); onLogin() }
    else { setErr(true); setPw('') }
  }

  return (
    <div className={styles.loginWrap}>
      <div className={styles.loginCard}>
        <div className={styles.loginIcon}>🔐</div>
        <h1 className={styles.loginTitle}>GeoMedico Admin</h1>
        <p className={styles.loginSub}>Enter admin password to continue</p>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <input type="password" placeholder="Admin password" value={pw}
            onChange={e => { setPw(e.target.value); setErr(false) }}
            className={`${styles.loginInput} ${err ? styles.loginInputErr : ''}`} autoFocus />
          {err && <p className={styles.loginErr}>Incorrect password.</p>}
          <button type="submit" className={styles.loginBtn}>Sign In</button>
        </form>
      </div>
    </div>
  )
}

// ─── Stats section ────────────────────────────────────────────────────────────
function StatRow({ stat, onSaved }) {
  const [form, setForm] = useState({ value: stat.value, label: stat.label, icon: stat.icon })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch(`/api/stats/${stat.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      onSaved(await res.json())
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } catch { alert('Save failed.') }
    finally { setSaving(false) }
  }

  return (
    <div className={styles.statRow}>
      <input className={`${styles.input} ${styles.inputIcon}`} value={form.icon}
        onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} title="Emoji icon" />
      <input className={`${styles.input} ${styles.inputVal}`} value={form.value}
        onChange={e => setForm(f => ({ ...f, value: e.target.value }))} placeholder="Value" />
      <input className={`${styles.input} ${styles.inputLabel}`} value={form.label}
        onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="Label" />
      <SaveBtn saving={saving} saved={saved} onClick={handleSave} />
    </div>
  )
}

function StatsSection() {
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(d => { setStats(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>📊 Stats Strip</h2>
        <p className={styles.sectionDesc}>Edit the headline numbers shown on the public site.</p>
      </div>
      {loading ? <p className={styles.loadingMsg}>Loading…</p> : (
        <div className={styles.statsList}>
          <div className={styles.statRowHead}><span>Icon</span><span>Value</span><span>Label</span><span /></div>
          {stats.map(s => <StatRow key={s.id} stat={s} onSaved={u => setStats(prev => prev.map(x => x.id === u.id ? u : x))} />)}
        </div>
      )}
    </div>
  )
}

// ─── Campaigns section ────────────────────────────────────────────────────────
function CampaignItem({ campaign, onUpdated, onDeleted }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ title: campaign.title, description: campaign.description })
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef()

  async function handleSave() {
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('title', form.title); fd.append('description', form.description)
      if (file) fd.append('image', file)
      const res = await fetch(`/api/campaigns/${campaign.id}`, { method: 'PUT', body: fd })
      onUpdated(await res.json()); setEditing(false); setFile(null); setPreview(null)
    } catch { alert('Save failed.') } finally { setSaving(false) }
  }

  const imgSrc = preview || campaign.image_url
  return (
    <div className={styles.campItem}>
      <div className={styles.campThumb}>
        {imgSrc ? <img src={imgSrc} alt={campaign.title} /> : <div className={styles.campThumbPlaceholder}>📢</div>}
      </div>
      {editing ? (
        <div className={styles.campEdit}>
          <Inp value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Title" />
          <Txa value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="Description" />
          <div className={styles.campEditActions}>
            <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }}
              onChange={e => { setFile(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])) }} />
            <button className={styles.uploadBtn} type="button" onClick={() => fileRef.current?.click()}>
              {file ? '📷 Image selected' : '📷 Change Image'}
            </button>
            <SaveBtn saving={saving} saved={false} onClick={handleSave} />
            <CancelBtn onClick={() => { setEditing(false); setFile(null); setPreview(null) }} />
          </div>
        </div>
      ) : (
        <div className={styles.campInfo}>
          <h4 className={styles.campTitle}>{campaign.title}</h4>
          <p className={styles.campDesc}>{campaign.description || <em style={{ opacity:.4 }}>No description</em>}</p>
          <span className={styles.campDate}>{new Date(campaign.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span>
        </div>
      )}
      {!editing && (
        <div className={styles.campActions}>
          <EditBtn onClick={() => setEditing(true)} />
          <DeleteBtn onClick={async () => {
            if (!window.confirm(`Delete "${campaign.title}"?`)) return
            await fetch(`/api/campaigns/${campaign.id}`, { method:'DELETE' })
            onDeleted(campaign.id)
          }} />
        </div>
      )}
    </div>
  )
}

function AddCampaignForm({ onAdded }) {
  const [form, setForm] = useState({ title: '', description: '' })
  const [file, setFile] = useState(null); const [preview, setPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef()

  async function handleSubmit(e) {
    e.preventDefault(); if (!form.title.trim()) return; setSaving(true)
    try {
      const fd = new FormData(); fd.append('title', form.title); fd.append('description', form.description)
      if (file) fd.append('image', file)
      const res = await fetch('/api/campaigns', { method: 'POST', body: fd })
      onAdded(await res.json()); setForm({ title:'', description:'' }); setFile(null); setPreview(null)
      if (fileRef.current) fileRef.current.value = ''
    } catch { alert('Failed to add.') } finally { setSaving(false) }
  }

  return (
    <form className={styles.addForm} onSubmit={handleSubmit}>
      <h3 className={styles.addTitle}>Add New Campaign</h3>
      <div className={styles.addGrid}>
        <div className={styles.addImgWrap}>
          <div className={styles.addImgPreview} onClick={() => fileRef.current?.click()}>
            {preview ? <img src={preview} alt="preview" /> : <div className={styles.addImgPlaceholder}><span>🖼️</span><span>Click to upload</span></div>}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }}
            onChange={e => { setFile(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])) }} />
          <button type="button" className={styles.uploadBtn} onClick={() => fileRef.current?.click()}>
            {file ? '📷 Change Image' : '📷 Upload Image'}
          </button>
        </div>
        <div className={styles.addFields}>
          <Field label="Campaign Title *"><Inp value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Free Diabetes Screening Camp" required /></Field>
          <Field label="Description"><Txa value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} placeholder="Brief description…" /></Field>
          <button type="submit" className={styles.addBtn} disabled={saving}>{saving ? 'Adding…' : '+ Add Campaign'}</button>
        </div>
      </div>
    </form>
  )
}

function CampaignsSection() {
  const [campaigns, setCampaigns] = useState([]); const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch('/api/campaigns').then(r => r.json()).then(d => { setCampaigns(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>📢 Campaign Cards</h2>
        <p className={styles.sectionDesc}>These cards appear in the rotating carousel on the homepage.</p>
      </div>
      <AddCampaignForm onAdded={c => setCampaigns(p => [c, ...p])} />
      <div className={styles.campListHeader}><h3>Existing Campaigns ({campaigns.length})</h3></div>
      {loading ? <p className={styles.loadingMsg}>Loading…</p> : campaigns.length === 0 ? (
        <div className={styles.emptyState}><span>📭</span><p>No campaigns yet.</p></div>
      ) : (
        <div className={styles.campList}>
          {campaigns.map(c => (
            <CampaignItem key={c.id} campaign={c}
              onUpdated={u => setCampaigns(p => p.map(x => x.id === u.id ? u : x))}
              onDeleted={id => setCampaigns(p => p.filter(x => x.id !== id))} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Testimonials section ─────────────────────────────────────────────────────
function AddTestimonialForm({ onAdded }) {
  const [form, setForm] = useState({ name:'', role:'', content:'', rating:'5' })
  const [file, setFile] = useState(null); const [preview, setPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef()

  async function handleSubmit(e) {
    e.preventDefault(); setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k,v]) => fd.append(k,v))
      if (file) fd.append('image', file)
      const res = await fetch('/api/testimonials', { method:'POST', body: fd })
      onAdded(await res.json()); setForm({ name:'', role:'', content:'', rating:'5' }); setFile(null); setPreview(null)
    } catch { alert('Failed to add.') } finally { setSaving(false) }
  }

  return (
    <form className={styles.addForm} onSubmit={handleSubmit}>
      <h3 className={styles.addTitle}>Add Testimonial</h3>
      <div className={styles.addGrid2}>
        <Field label="Name *"><Inp value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Patient / Partner name" required /></Field>
        <Field label="Role / Location"><Inp value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="e.g. Patient, Mumbai" /></Field>
        <Field label="Rating (1–5)">
          <Sel value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))}>
            {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ★</option>)}
          </Sel>
        </Field>
        <Field label="Avatar (optional)">
          <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }}
            onChange={e => { setFile(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])) }} />
          <button type="button" className={styles.uploadBtn} onClick={() => fileRef.current?.click()}>
            {preview ? '✓ Image selected' : '📷 Upload Photo'}
          </button>
        </Field>
        <div style={{ gridColumn:'1/-1' }}>
          <Field label="Testimonial Content *">
            <Txa value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={3} placeholder="What did they say about GeoMedico?" required />
          </Field>
        </div>
        <button type="submit" className={styles.addBtn} disabled={saving}>{saving ? 'Adding…' : '+ Add Testimonial'}</button>
      </div>
    </form>
  )
}

function TestimonialsSection() {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch('/api/testimonials').then(r => r.json()).then(d => { setItems(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>💬 Testimonials</h2>
        <p className={styles.sectionDesc}>These appear below the registration form on the homepage.</p>
      </div>
      <AddTestimonialForm onAdded={t => setItems(p => [t, ...p])} />
      <div className={styles.campListHeader}><h3>Existing Testimonials ({items.length})</h3></div>
      {loading ? <p className={styles.loadingMsg}>Loading…</p> : items.length === 0 ? (
        <div className={styles.emptyState}><span>💬</span><p>No testimonials yet.</p></div>
      ) : (
        <div className={styles.entityList}>
          {items.map(t => (
            <div key={t.id} className={styles.entityRow}>
              <div className={styles.entityAvatar}>{t.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()}</div>
              <div className={styles.entityInfo}>
                <strong>{t.name}</strong>
                {t.role && <span style={{ color:'#64748b', marginLeft:8, fontSize:12 }}>{t.role}</span>}
                <span style={{ marginLeft:8 }}>{'★'.repeat(t.rating)}</span>
                <p className={styles.entityDesc}>{t.content}</p>
              </div>
              <div className={styles.campActions}>
                <DeleteBtn onClick={async () => {
                  if (!window.confirm('Delete this testimonial?')) return
                  await fetch(`/api/testimonials/${t.id}`, { method:'DELETE' })
                  setItems(p => p.filter(x => x.id !== t.id))
                }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Generic entity CRUD helper ───────────────────────────────────────────────
function useEntityCRUD(endpoint) {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch(endpoint).then(r => r.json()).then(d => { setItems(d); setLoading(false) }).catch(() => setLoading(false))
  }, [endpoint])
  async function remove(id) {
    await fetch(`${endpoint}/${id}`, { method:'DELETE' }); setItems(p => p.filter(x => x.id !== id))
  }
  async function save(id, body) {
    const res = await fetch(`${endpoint}/${id}`, { method:'PUT', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(body) })
    const updated = await res.json(); setItems(p => p.map(x => x.id === updated.id ? updated : x)); return updated
  }
  async function create(body) {
    const res = await fetch(endpoint, { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(body) })
    const created = await res.json(); setItems(p => [created, ...p]); return created
  }
  return { items, loading, remove, save, create }
}

// ─── Doctors section ──────────────────────────────────────────────────────────
const STATUS_OPTS = ['lead','onboarding','active','inactive']

function DoctorAddForm({ onCreate }) {
  const EMPTY = { name:'', specialty:'', city:'', exp:'', rating:'', consults:'', fee:'', status:'lead', qual:'', verified:false, joined:'' }
  const [form, setForm] = useState(EMPTY); const [saving, setSaving] = useState(false)
  const s = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handle(e) {
    e.preventDefault(); setSaving(true)
    try { await onCreate(form); setForm(EMPTY) } catch { alert('Failed.') } finally { setSaving(false) }
  }
  return (
    <form className={styles.addForm} onSubmit={handle}>
      <h3 className={styles.addTitle}>Add Doctor</h3>
      <div className={styles.formGrid}>
        <Field label="Name *"><Inp value={form.name} onChange={s('name')} required placeholder="Dr. Full Name" /></Field>
        <Field label="Specialty"><Inp value={form.specialty} onChange={s('specialty')} placeholder="e.g. Cardiologist" /></Field>
        <Field label="City"><Inp value={form.city} onChange={s('city')} placeholder="City" /></Field>
        <Field label="Experience (years)"><Inp type="number" value={form.exp} onChange={s('exp')} placeholder="e.g. 10" /></Field>
        <Field label="Consultation Fee"><Inp value={form.fee} onChange={s('fee')} placeholder="e.g. ₹800" /></Field>
        <Field label="Qualification"><Inp value={form.qual} onChange={s('qual')} placeholder="e.g. MD (Cardiology)" /></Field>
        <Field label="Status"><Sel value={form.status} onChange={s('status')}>{STATUS_OPTS.map(o => <option key={o} value={o}>{o}</option>)}</Sel></Field>
        <Field label="Joined"><Inp value={form.joined} onChange={s('joined')} placeholder="e.g. Jan 2024" /></Field>
        <Field label="Rating (for active)"><Inp type="number" step="0.1" min="1" max="5" value={form.rating} onChange={s('rating')} placeholder="e.g. 4.8" /></Field>
        <Field label="Consults / Month"><Inp type="number" value={form.consults} onChange={s('consults')} placeholder="e.g. 127" /></Field>
        <div style={{ gridColumn:'1/-1' }}><Check label="Verified doctor" checked={form.verified} onChange={e => setForm(f => ({ ...f, verified: e.target.checked }))} /></div>
        <button type="submit" className={styles.addBtn} disabled={saving}>{saving ? 'Adding…' : '+ Add Doctor'}</button>
      </div>
    </form>
  )
}

function EntityRowDoctor({ item, onSave, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name:item.name, specialty:item.specialty, city:item.city, exp:String(item.exp), rating:item.rating || '', consults:String(item.consults), fee:item.fee, status:item.status, qual:item.qual, verified:item.verified, joined:item.joined })
  const [saving, setSaving] = useState(false); const [saved, setSaved] = useState(false)
  const s = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handle() {
    setSaving(true)
    try { await onSave(item.id, form); setSaved(true); setTimeout(() => { setSaved(false); setEditing(false) }, 1200) }
    catch { alert('Save failed.') } finally { setSaving(false) }
  }

  if (!editing) return (
    <div className={styles.entityRow}>
      <div className={styles.entityInfo}>
        <strong>{item.name}</strong>
        <span className={styles.entityMeta}>{item.specialty} · {item.city} · {item.status}</span>
      </div>
      <div className={styles.campActions}><EditBtn onClick={() => setEditing(true)} /><DeleteBtn onClick={() => { if(window.confirm('Delete?')) onDelete(item.id) }} /></div>
    </div>
  )

  return (
    <div className={styles.entityEditWrap}>
      <div className={styles.formGrid}>
        <Field label="Name"><Inp value={form.name} onChange={s('name')} /></Field>
        <Field label="Specialty"><Inp value={form.specialty} onChange={s('specialty')} /></Field>
        <Field label="City"><Inp value={form.city} onChange={s('city')} /></Field>
        <Field label="Exp (yrs)"><Inp type="number" value={form.exp} onChange={s('exp')} /></Field>
        <Field label="Fee"><Inp value={form.fee} onChange={s('fee')} /></Field>
        <Field label="Qualification"><Inp value={form.qual} onChange={s('qual')} /></Field>
        <Field label="Status"><Sel value={form.status} onChange={s('status')}>{STATUS_OPTS.map(o => <option key={o} value={o}>{o}</option>)}</Sel></Field>
        <Field label="Joined"><Inp value={form.joined} onChange={s('joined')} /></Field>
        <Field label="Rating"><Inp type="number" step="0.1" value={form.rating} onChange={s('rating')} /></Field>
        <Field label="Consults"><Inp type="number" value={form.consults} onChange={s('consults')} /></Field>
        <div style={{ gridColumn:'1/-1' }}><Check label="Verified" checked={form.verified} onChange={e => setForm(f => ({ ...f, verified: e.target.checked }))} /></div>
      </div>
      <div className={styles.campEditActions}><SaveBtn saving={saving} saved={saved} onClick={handle} /><CancelBtn onClick={() => setEditing(false)} /></div>
    </div>
  )
}

function DoctorsSection() {
  const { items, loading, remove, save, create } = useEntityCRUD('/api/doctors')
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>👨‍⚕️ Doctors</h2>
        <p className={styles.sectionDesc}>Manage the doctor network shown in the Doctor tab.</p>
      </div>
      <DoctorAddForm onCreate={create} />
      <div className={styles.campListHeader}><h3>Doctors ({items.length})</h3></div>
      {loading ? <p className={styles.loadingMsg}>Loading…</p> : (
        <div className={styles.entityList}>
          {items.map(item => <EntityRowDoctor key={item.id} item={item} onSave={save} onDelete={remove} />)}
        </div>
      )}
    </div>
  )
}

// ─── Hospitals section ────────────────────────────────────────────────────────
const TIER_OPTS = ['Platinum','Gold','Silver']

function HospitalAddForm({ onCreate }) {
  const EMPTY = { name:'', city:'', type:'Multi-Specialty', beds:'', tier:'Silver', specialties:'', status:'lead', contact:'', phone:'', joined:'', url:'' }
  const [form, setForm] = useState(EMPTY); const [saving, setSaving] = useState(false)
  const s = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handle(e) {
    e.preventDefault(); setSaving(true)
    try { await onCreate(form); setForm(EMPTY) } catch { alert('Failed.') } finally { setSaving(false) }
  }
  return (
    <form className={styles.addForm} onSubmit={handle}>
      <h3 className={styles.addTitle}>Add Hospital</h3>
      <div className={styles.formGrid}>
        <Field label="Name *"><Inp value={form.name} onChange={s('name')} required placeholder="Hospital name" /></Field>
        <Field label="City"><Inp value={form.city} onChange={s('city')} placeholder="City" /></Field>
        <Field label="Type"><Inp value={form.type} onChange={s('type')} placeholder="e.g. Multi-Specialty" /></Field>
        <Field label="Beds"><Inp type="number" value={form.beds} onChange={s('beds')} placeholder="e.g. 500" /></Field>
        <Field label="Tier"><Sel value={form.tier} onChange={s('tier')}>{TIER_OPTS.map(o => <option key={o} value={o}>{o}</option>)}</Sel></Field>
        <Field label="Status"><Sel value={form.status} onChange={s('status')}>{STATUS_OPTS.map(o => <option key={o} value={o}>{o}</option>)}</Sel></Field>
        <Field label="Specialties (comma-sep)"><Inp value={form.specialties} onChange={s('specialties')} placeholder="Cardio, Ortho, Neuro" /></Field>
        <Field label="Contact Person"><Inp value={form.contact} onChange={s('contact')} placeholder="Name" /></Field>
        <Field label="Phone"><Inp value={form.phone} onChange={s('phone')} placeholder="+91-xx-xxxx-xxxx" /></Field>
        <Field label="Joined"><Inp value={form.joined} onChange={s('joined')} placeholder="e.g. Jan 2024" /></Field>
        <Field label="Website URL"><Inp type="url" value={form.url} onChange={s('url')} placeholder="https://…" /></Field>
        <button type="submit" className={styles.addBtn} disabled={saving}>{saving ? 'Adding…' : '+ Add Hospital'}</button>
      </div>
    </form>
  )
}

function EntityRowHospital({ item, onSave, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name:item.name, city:item.city, type:item.type, beds:String(item.beds), tier:item.tier, specialties: Array.isArray(item.specialties) ? item.specialties.join(', ') : '', status:item.status, contact:item.contact, phone:item.phone, joined:item.joined, url:item.url||'' })
  const [saving, setSaving] = useState(false); const [saved, setSaved] = useState(false)
  const s = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handle() {
    setSaving(true)
    try { await onSave(item.id, form); setSaved(true); setTimeout(() => { setSaved(false); setEditing(false) }, 1200) }
    catch { alert('Save failed.') } finally { setSaving(false) }
  }

  if (!editing) return (
    <div className={styles.entityRow}>
      <div className={styles.entityInfo}>
        <strong>{item.name}</strong>
        <span className={styles.entityMeta}>{item.city} · {item.tier} · {item.status} · {item.beds} beds</span>
      </div>
      <div className={styles.campActions}><EditBtn onClick={() => setEditing(true)} /><DeleteBtn onClick={() => { if(window.confirm('Delete?')) onDelete(item.id) }} /></div>
    </div>
  )

  return (
    <div className={styles.entityEditWrap}>
      <div className={styles.formGrid}>
        <Field label="Name"><Inp value={form.name} onChange={s('name')} /></Field>
        <Field label="City"><Inp value={form.city} onChange={s('city')} /></Field>
        <Field label="Type"><Inp value={form.type} onChange={s('type')} /></Field>
        <Field label="Beds"><Inp type="number" value={form.beds} onChange={s('beds')} /></Field>
        <Field label="Tier"><Sel value={form.tier} onChange={s('tier')}>{TIER_OPTS.map(o => <option key={o} value={o}>{o}</option>)}</Sel></Field>
        <Field label="Status"><Sel value={form.status} onChange={s('status')}>{STATUS_OPTS.map(o => <option key={o} value={o}>{o}</option>)}</Sel></Field>
        <Field label="Specialties (comma-sep)"><Inp value={form.specialties} onChange={s('specialties')} /></Field>
        <Field label="Contact Person"><Inp value={form.contact} onChange={s('contact')} /></Field>
        <Field label="Phone"><Inp value={form.phone} onChange={s('phone')} /></Field>
        <Field label="Joined"><Inp value={form.joined} onChange={s('joined')} /></Field>
        <Field label="Website URL"><Inp value={form.url} onChange={s('url')} /></Field>
      </div>
      <div className={styles.campEditActions}><SaveBtn saving={saving} saved={saved} onClick={handle} /><CancelBtn onClick={() => setEditing(false)} /></div>
    </div>
  )
}

function HospitalsSection() {
  const { items, loading, remove, save, create } = useEntityCRUD('/api/hospitals')
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>🏥 Hospitals</h2>
        <p className={styles.sectionDesc}>Manage the hospital network shown in the Hospital tab.</p>
      </div>
      <HospitalAddForm onCreate={create} />
      <div className={styles.campListHeader}><h3>Hospitals ({items.length})</h3></div>
      {loading ? <p className={styles.loadingMsg}>Loading…</p> : (
        <div className={styles.entityList}>
          {items.map(item => <EntityRowHospital key={item.id} item={item} onSave={save} onDelete={remove} />)}
        </div>
      )}
    </div>
  )
}

// ─── Pharmacies section ───────────────────────────────────────────────────────
function PharmacyAddForm({ onCreate }) {
  const EMPTY = { name:'', city:'', area:'', owner:'', phone:'', hours:'', delivery:false, cold_chain:false, rx_orders:'', status:'lead', joined:'', url:'' }
  const [form, setForm] = useState(EMPTY); const [saving, setSaving] = useState(false)
  const s = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handle(e) {
    e.preventDefault(); setSaving(true)
    try { await onCreate(form); setForm(EMPTY) } catch { alert('Failed.') } finally { setSaving(false) }
  }
  return (
    <form className={styles.addForm} onSubmit={handle}>
      <h3 className={styles.addTitle}>Add Pharmacy</h3>
      <div className={styles.formGrid}>
        <Field label="Name *"><Inp value={form.name} onChange={s('name')} required placeholder="Pharmacy name" /></Field>
        <Field label="City"><Inp value={form.city} onChange={s('city')} /></Field>
        <Field label="Area"><Inp value={form.area} onChange={s('area')} /></Field>
        <Field label="Owner / Contact"><Inp value={form.owner} onChange={s('owner')} /></Field>
        <Field label="Phone"><Inp value={form.phone} onChange={s('phone')} /></Field>
        <Field label="Hours"><Inp value={form.hours} onChange={s('hours')} placeholder="e.g. 9AM–9PM" /></Field>
        <Field label="Status"><Sel value={form.status} onChange={s('status')}>{STATUS_OPTS.map(o => <option key={o} value={o}>{o}</option>)}</Sel></Field>
        <Field label="Rx Orders / Month"><Inp type="number" value={form.rx_orders} onChange={s('rx_orders')} /></Field>
        <Field label="Joined"><Inp value={form.joined} onChange={s('joined')} /></Field>
        <Field label="Website URL"><Inp type="url" value={form.url} onChange={s('url')} placeholder="https://…" /></Field>
        <div style={{ gridColumn:'1/-1', display:'flex', gap:20 }}>
          <Check label="Home Delivery" checked={form.delivery} onChange={e => setForm(f => ({ ...f, delivery: e.target.checked }))} />
          <Check label="Cold Chain" checked={form.cold_chain} onChange={e => setForm(f => ({ ...f, cold_chain: e.target.checked }))} />
        </div>
        <button type="submit" className={styles.addBtn} disabled={saving}>{saving ? 'Adding…' : '+ Add Pharmacy'}</button>
      </div>
    </form>
  )
}

function EntityRowPharmacy({ item, onSave, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name:item.name, city:item.city, area:item.area, owner:item.owner, phone:item.phone, hours:item.hours, delivery:item.delivery, cold_chain:item.cold_chain, rx_orders:String(item.rx_orders), status:item.status, joined:item.joined, url:item.url||'' })
  const [saving, setSaving] = useState(false); const [saved, setSaved] = useState(false)
  const s = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handle() {
    setSaving(true)
    try { await onSave(item.id, form); setSaved(true); setTimeout(() => { setSaved(false); setEditing(false) }, 1200) }
    catch { alert('Save failed.') } finally { setSaving(false) }
  }

  if (!editing) return (
    <div className={styles.entityRow}>
      <div className={styles.entityInfo}>
        <strong>{item.name}</strong>
        <span className={styles.entityMeta}>{item.area}, {item.city} · {item.status} {item.delivery ? '· 🚚' : ''}{item.cold_chain ? ' ❄️' : ''}</span>
      </div>
      <div className={styles.campActions}><EditBtn onClick={() => setEditing(true)} /><DeleteBtn onClick={() => { if(window.confirm('Delete?')) onDelete(item.id) }} /></div>
    </div>
  )

  return (
    <div className={styles.entityEditWrap}>
      <div className={styles.formGrid}>
        <Field label="Name"><Inp value={form.name} onChange={s('name')} /></Field>
        <Field label="City"><Inp value={form.city} onChange={s('city')} /></Field>
        <Field label="Area"><Inp value={form.area} onChange={s('area')} /></Field>
        <Field label="Owner"><Inp value={form.owner} onChange={s('owner')} /></Field>
        <Field label="Phone"><Inp value={form.phone} onChange={s('phone')} /></Field>
        <Field label="Hours"><Inp value={form.hours} onChange={s('hours')} /></Field>
        <Field label="Status"><Sel value={form.status} onChange={s('status')}>{STATUS_OPTS.map(o => <option key={o} value={o}>{o}</option>)}</Sel></Field>
        <Field label="Rx Orders"><Inp type="number" value={form.rx_orders} onChange={s('rx_orders')} /></Field>
        <Field label="Joined"><Inp value={form.joined} onChange={s('joined')} /></Field>
        <Field label="Website"><Inp value={form.url} onChange={s('url')} /></Field>
        <div style={{ gridColumn:'1/-1', display:'flex', gap:20 }}>
          <Check label="Home Delivery" checked={form.delivery} onChange={e => setForm(f => ({ ...f, delivery: e.target.checked }))} />
          <Check label="Cold Chain" checked={form.cold_chain} onChange={e => setForm(f => ({ ...f, cold_chain: e.target.checked }))} />
        </div>
      </div>
      <div className={styles.campEditActions}><SaveBtn saving={saving} saved={saved} onClick={handle} /><CancelBtn onClick={() => setEditing(false)} /></div>
    </div>
  )
}

function PharmaciesSection() {
  const { items, loading, remove, save, create } = useEntityCRUD('/api/pharmacies')
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>💊 Pharmacies</h2>
        <p className={styles.sectionDesc}>Manage the pharmacy network shown in the Pharmacy tab.</p>
      </div>
      <PharmacyAddForm onCreate={create} />
      <div className={styles.campListHeader}><h3>Pharmacies ({items.length})</h3></div>
      {loading ? <p className={styles.loadingMsg}>Loading…</p> : (
        <div className={styles.entityList}>
          {items.map(item => <EntityRowPharmacy key={item.id} item={item} onSave={save} onDelete={remove} />)}
        </div>
      )}
    </div>
  )
}

// ─── Labs section ─────────────────────────────────────────────────────────────
function LabAddForm({ onCreate }) {
  const EMPTY = { name:'', city:'', area:'', contact:'', phone:'', cert:'', home_collection:false, tests:'', test_count:'', status:'lead', joined:'', url:'' }
  const [form, setForm] = useState(EMPTY); const [saving, setSaving] = useState(false)
  const s = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handle(e) {
    e.preventDefault(); setSaving(true)
    try { await onCreate(form); setForm(EMPTY) } catch { alert('Failed.') } finally { setSaving(false) }
  }
  return (
    <form className={styles.addForm} onSubmit={handle}>
      <h3 className={styles.addTitle}>Add Lab</h3>
      <div className={styles.formGrid}>
        <Field label="Name *"><Inp value={form.name} onChange={s('name')} required placeholder="Lab name" /></Field>
        <Field label="City"><Inp value={form.city} onChange={s('city')} /></Field>
        <Field label="Area"><Inp value={form.area} onChange={s('area')} /></Field>
        <Field label="Contact Person"><Inp value={form.contact} onChange={s('contact')} /></Field>
        <Field label="Phone"><Inp value={form.phone} onChange={s('phone')} /></Field>
        <Field label="Certifications (comma-sep)"><Inp value={form.cert} onChange={s('cert')} placeholder="NABL, CAP, ISO 15189" /></Field>
        <Field label="Key Tests (comma-sep)"><Inp value={form.tests} onChange={s('tests')} placeholder="HbA1c, CBC, LFT…" /></Field>
        <Field label="Status"><Sel value={form.status} onChange={s('status')}>{STATUS_OPTS.map(o => <option key={o} value={o}>{o}</option>)}</Sel></Field>
        <Field label="Tests / Month"><Inp type="number" value={form.test_count} onChange={s('test_count')} /></Field>
        <Field label="Joined"><Inp value={form.joined} onChange={s('joined')} /></Field>
        <Field label="Website URL"><Inp type="url" value={form.url} onChange={s('url')} placeholder="https://…" /></Field>
        <div style={{ gridColumn:'1/-1' }}>
          <Check label="Home Collection Available" checked={form.home_collection} onChange={e => setForm(f => ({ ...f, home_collection: e.target.checked }))} />
        </div>
        <button type="submit" className={styles.addBtn} disabled={saving}>{saving ? 'Adding…' : '+ Add Lab'}</button>
      </div>
    </form>
  )
}

function EntityRowLab({ item, onSave, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name:item.name, city:item.city, area:item.area, contact:item.contact, phone:item.phone, cert: Array.isArray(item.cert) ? item.cert.join(', ') : '', home_collection:item.home_collection, tests: Array.isArray(item.tests) ? item.tests.join(', ') : '', test_count:String(item.test_count), status:item.status, joined:item.joined, url:item.url||'' })
  const [saving, setSaving] = useState(false); const [saved, setSaved] = useState(false)
  const s = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handle() {
    setSaving(true)
    try { await onSave(item.id, form); setSaved(true); setTimeout(() => { setSaved(false); setEditing(false) }, 1200) }
    catch { alert('Save failed.') } finally { setSaving(false) }
  }

  if (!editing) return (
    <div className={styles.entityRow}>
      <div className={styles.entityInfo}>
        <strong>{item.name}</strong>
        <span className={styles.entityMeta}>{item.area}, {item.city} · {item.status} · {Array.isArray(item.cert) ? item.cert.join(', ') : ''}</span>
      </div>
      <div className={styles.campActions}><EditBtn onClick={() => setEditing(true)} /><DeleteBtn onClick={() => { if(window.confirm('Delete?')) onDelete(item.id) }} /></div>
    </div>
  )

  return (
    <div className={styles.entityEditWrap}>
      <div className={styles.formGrid}>
        <Field label="Name"><Inp value={form.name} onChange={s('name')} /></Field>
        <Field label="City"><Inp value={form.city} onChange={s('city')} /></Field>
        <Field label="Area"><Inp value={form.area} onChange={s('area')} /></Field>
        <Field label="Contact"><Inp value={form.contact} onChange={s('contact')} /></Field>
        <Field label="Phone"><Inp value={form.phone} onChange={s('phone')} /></Field>
        <Field label="Certifications (comma-sep)"><Inp value={form.cert} onChange={s('cert')} /></Field>
        <Field label="Key Tests (comma-sep)"><Inp value={form.tests} onChange={s('tests')} /></Field>
        <Field label="Status"><Sel value={form.status} onChange={s('status')}>{STATUS_OPTS.map(o => <option key={o} value={o}>{o}</option>)}</Sel></Field>
        <Field label="Tests/Month"><Inp type="number" value={form.test_count} onChange={s('test_count')} /></Field>
        <Field label="Joined"><Inp value={form.joined} onChange={s('joined')} /></Field>
        <Field label="Website"><Inp value={form.url} onChange={s('url')} /></Field>
        <div style={{ gridColumn:'1/-1' }}>
          <Check label="Home Collection" checked={form.home_collection} onChange={e => setForm(f => ({ ...f, home_collection: e.target.checked }))} />
        </div>
      </div>
      <div className={styles.campEditActions}><SaveBtn saving={saving} saved={saved} onClick={handle} /><CancelBtn onClick={() => setEditing(false)} /></div>
    </div>
  )
}

function LabsSection() {
  const { items, loading, remove, save, create } = useEntityCRUD('/api/labs')
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>🔬 Labs</h2>
        <p className={styles.sectionDesc}>Manage the diagnostic labs shown in the Lab tab.</p>
      </div>
      <LabAddForm onCreate={create} />
      <div className={styles.campListHeader}><h3>Labs ({items.length})</h3></div>
      {loading ? <p className={styles.loadingMsg}>Loading…</p> : (
        <div className={styles.entityList}>
          {items.map(item => <EntityRowLab key={item.id} item={item} onSave={save} onDelete={remove} />)}
        </div>
      )}
    </div>
  )
}

// ─── Contact section ──────────────────────────────────────────────────────────
function ContactSection() {
  const [form, setForm] = useState({ email:'', phone:'', address:'', working_hours:'', map_url:'' })
  const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [saved, setSaved] = useState(false)
  const s = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  useEffect(() => {
    fetch('/api/contact').then(r => r.json()).then(d => {
      if (d) setForm({ email:d.email||'', phone:d.phone||'', address:d.address||'', working_hours:d.working_hours||'', map_url:d.map_url||'' })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      await fetch('/api/contact', { method:'PUT', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(form) })
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } catch { alert('Save failed.') } finally { setSaving(false) }
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>📞 Contact Info</h2>
        <p className={styles.sectionDesc}>These details appear in the Contact section at the bottom of the homepage.</p>
      </div>
      {loading ? <p className={styles.loadingMsg}>Loading…</p> : (
        <div className={styles.addForm}>
          <div className={styles.formGrid}>
            <Field label="Email"><Inp type="email" value={form.email} onChange={s('email')} placeholder="hello@geomedico.in" /></Field>
            <Field label="Phone"><Inp value={form.phone} onChange={s('phone')} placeholder="+91-XXXXX-XXXXX" /></Field>
            <Field label="Working Hours"><Inp value={form.working_hours} onChange={s('working_hours')} placeholder="Mon–Sat 9AM–6PM" /></Field>
            <Field label="Google Maps URL"><Inp type="url" value={form.map_url} onChange={s('map_url')} placeholder="https://maps.google.com/…" /></Field>
            <div style={{ gridColumn:'1/-1' }}>
              <Field label="Office Address">
                <Txa value={form.address} onChange={s('address')} rows={3} placeholder="Street, Area, City, State, PIN" />
              </Field>
            </div>
            <SaveBtn saving={saving} saved={saved} onClick={handleSave} label="Save Contact Info" />
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Sidebar navigation ───────────────────────────────────────────────────────
const NAV = [
  { id:'stats',        label:'Stats Strip',   icon:'📊' },
  { id:'campaigns',    label:'Campaigns',      icon:'📢' },
  { id:'testimonials', label:'Testimonials',   icon:'💬' },
  { id:'doctors',      label:'Doctors',        icon:'👨‍⚕️' },
  { id:'hospitals',    label:'Hospitals',      icon:'🏥' },
  { id:'pharmacies',   label:'Pharmacies',     icon:'💊' },
  { id:'labs',         label:'Labs',           icon:'🔬' },
  { id:'contact',      label:'Contact Info',   icon:'📞' },
]

const SECTION_MAP = {
  stats:        StatsSection,
  campaigns:    CampaignsSection,
  testimonials: TestimonialsSection,
  doctors:      DoctorsSection,
  hospitals:    HospitalsSection,
  pharmacies:   PharmaciesSection,
  labs:         LabsSection,
  contact:      ContactSection,
}

// ─── Main admin shell ─────────────────────────────────────────────────────────
export default function AdminPage({ onBack }) {
  const [authed, setAuthed]   = useState(sessionStorage.getItem('gm_admin') === '1')
  const [active, setActive]   = useState('stats')
  const [sideOpen, setSideOpen] = useState(false)

  function handleLogout() { sessionStorage.removeItem('gm_admin'); setAuthed(false) }

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />

  const ActiveSection = SECTION_MAP[active]

  return (
    <div className={styles.page}>
      {/* Top bar */}
      <header className={styles.topBar}>
        <div className={styles.topBarInner}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button className={styles.hamburger} onClick={() => setSideOpen(o => !o)}>☰</button>
            <div className={styles.topBarBrand}>
              <span className={styles.topBarIcon}>🏥</span>
              <div>
                <div className={styles.topBarName}>GeoMedico Admin</div>
                <div className={styles.topBarSub}>Content Management</div>
              </div>
            </div>
          </div>
          <div className={styles.topBarActions}>
            <button className={styles.backBtn} onClick={onBack}>← Back to Site</button>
            <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      <div className={styles.layout}>
        {/* Sidebar */}
        <nav className={`${styles.sidebar} ${sideOpen ? styles.sidebarOpen : ''}`}>
          {NAV.map(n => (
            <button
              key={n.id}
              className={`${styles.navItem} ${active === n.id ? styles.navItemActive : ''}`}
              onClick={() => { setActive(n.id); setSideOpen(false) }}
            >
              <span className={styles.navIcon}>{n.icon}</span>
              <span className={styles.navLabel}>{n.label}</span>
            </button>
          ))}
        </nav>

        {/* Overlay for mobile */}
        {sideOpen && <div className={styles.overlay} onClick={() => setSideOpen(false)} />}

        {/* Content */}
        <main className={styles.content}>
          <ActiveSection />
        </main>
      </div>
    </div>
  )
}
