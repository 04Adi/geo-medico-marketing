import { Router } from 'express'
import pool from '../db.js'

const router = Router()

function toArr(val) {
  if (Array.isArray(val)) return val
  if (!val) return []
  return String(val).split(',').map(s => s.trim()).filter(Boolean)
}

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM hospitals ORDER BY created_at ASC')
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/', async (req, res) => {
  const { name, city, type, beds, tier, specialties, status, contact, phone, joined, url } = req.body
  try {
    const { rows } = await pool.query(
      `INSERT INTO hospitals (name,city,type,beds,tier,specialties,status,contact,phone,joined,url)
       VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7,$8,$9,$10,$11) RETURNING *`,
      [name, city || '', type || 'Multi-Specialty', parseInt(beds) || 0,
       tier || 'Silver', JSON.stringify(toArr(specialties)),
       status || 'lead', contact || '', phone || '', joined || '—', url || null]
    )
    res.json(rows[0])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.put('/:id', async (req, res) => {
  const { name, city, type, beds, tier, specialties, status, contact, phone, joined, url } = req.body
  try {
    const { rows } = await pool.query(
      `UPDATE hospitals SET name=$1,city=$2,type=$3,beds=$4,tier=$5,specialties=$6::jsonb,
       status=$7,contact=$8,phone=$9,joined=$10,url=$11 WHERE id=$12 RETURNING *`,
      [name, city || '', type || 'Multi-Specialty', parseInt(beds) || 0,
       tier || 'Silver', JSON.stringify(toArr(specialties)),
       status || 'lead', contact || '', phone || '', joined || '—', url || null, req.params.id]
    )
    res.json(rows[0])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM hospitals WHERE id=$1', [req.params.id])
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
