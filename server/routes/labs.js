import { Router } from 'express'
import pool from '../db.js'

const router = Router()

function toArr(val) {
  if (Array.isArray(val)) return val
  if (!val) return []
  return String(val).split(',').map(s => s.trim()).filter(Boolean)
}

const parse = (r) => ({
  ...r,
  test_count: Number(r.test_count),
  home_collection: Boolean(r.home_collection),
})

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM labs ORDER BY created_at ASC')
    res.json(rows.map(parse))
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/', async (req, res) => {
  const { name, city, area, contact, phone, cert, home_collection, tests, test_count, status, joined, url } = req.body
  try {
    const { rows } = await pool.query(
      `INSERT INTO labs (name,city,area,contact,phone,cert,home_collection,tests,test_count,status,joined,url)
       VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7,$8::jsonb,$9,$10,$11,$12) RETURNING *`,
      [name, city || '', area || '', contact || '', phone || '',
       JSON.stringify(toArr(cert)), home_collection === true || home_collection === 'true',
       JSON.stringify(toArr(tests)), parseInt(test_count) || 0,
       status || 'lead', joined || '—', url || null]
    )
    res.json(parse(rows[0]))
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.put('/:id', async (req, res) => {
  const { name, city, area, contact, phone, cert, home_collection, tests, test_count, status, joined, url } = req.body
  try {
    const { rows } = await pool.query(
      `UPDATE labs SET name=$1,city=$2,area=$3,contact=$4,phone=$5,cert=$6::jsonb,
       home_collection=$7,tests=$8::jsonb,test_count=$9,status=$10,joined=$11,url=$12 WHERE id=$13 RETURNING *`,
      [name, city || '', area || '', contact || '', phone || '',
       JSON.stringify(toArr(cert)), home_collection === true || home_collection === 'true',
       JSON.stringify(toArr(tests)), parseInt(test_count) || 0,
       status || 'lead', joined || '—', url || null, req.params.id]
    )
    res.json(parse(rows[0]))
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM labs WHERE id=$1', [req.params.id])
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
