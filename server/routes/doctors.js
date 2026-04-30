import { Router } from 'express'
import pool from '../db.js'

const router = Router()

const parse = (r) => ({
  ...r,
  exp: Number(r.exp),
  rating: r.rating != null ? Number(r.rating) : null,
  consults: Number(r.consults),
})

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM doctors ORDER BY created_at ASC')
    res.json(rows.map(parse))
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/', async (req, res) => {
  const { name, specialty, city, exp, rating, consults, fee, status, qual, verified, joined } = req.body
  try {
    const { rows } = await pool.query(
      `INSERT INTO doctors (name,specialty,city,exp,rating,consults,fee,status,qual,verified,joined)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [name, specialty || '', city || '', parseInt(exp) || 0,
       rating ? parseFloat(rating) : null, parseInt(consults) || 0,
       fee || '', status || 'lead', qual || '',
       verified === true || verified === 'true', joined || '—']
    )
    res.json(parse(rows[0]))
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.put('/:id', async (req, res) => {
  const { name, specialty, city, exp, rating, consults, fee, status, qual, verified, joined } = req.body
  try {
    const { rows } = await pool.query(
      `UPDATE doctors SET name=$1,specialty=$2,city=$3,exp=$4,rating=$5,consults=$6,
       fee=$7,status=$8,qual=$9,verified=$10,joined=$11 WHERE id=$12 RETURNING *`,
      [name, specialty || '', city || '', parseInt(exp) || 0,
       rating ? parseFloat(rating) : null, parseInt(consults) || 0,
       fee || '', status || 'lead', qual || '',
       verified === true || verified === 'true', joined || '—', req.params.id]
    )
    res.json(parse(rows[0]))
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM doctors WHERE id=$1', [req.params.id])
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
