import { Router } from 'express'
import pool from '../db.js'

const router = Router()

const parse = (r) => ({
  ...r,
  rx_orders: Number(r.rx_orders),
  delivery: Boolean(r.delivery),
  cold_chain: Boolean(r.cold_chain),
})

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM pharmacies ORDER BY created_at ASC')
    res.json(rows.map(parse))
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/', async (req, res) => {
  const { name, city, area, owner, phone, hours, delivery, cold_chain, rx_orders, status, joined, url } = req.body
  try {
    const { rows } = await pool.query(
      `INSERT INTO pharmacies (name,city,area,owner,phone,hours,delivery,cold_chain,rx_orders,status,joined,url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [name, city || '', area || '', owner || '', phone || '', hours || '',
       delivery === true || delivery === 'true', cold_chain === true || cold_chain === 'true',
       parseInt(rx_orders) || 0, status || 'lead', joined || '—', url || null]
    )
    res.json(parse(rows[0]))
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.put('/:id', async (req, res) => {
  const { name, city, area, owner, phone, hours, delivery, cold_chain, rx_orders, status, joined, url } = req.body
  try {
    const { rows } = await pool.query(
      `UPDATE pharmacies SET name=$1,city=$2,area=$3,owner=$4,phone=$5,hours=$6,
       delivery=$7,cold_chain=$8,rx_orders=$9,status=$10,joined=$11,url=$12 WHERE id=$13 RETURNING *`,
      [name, city || '', area || '', owner || '', phone || '', hours || '',
       delivery === true || delivery === 'true', cold_chain === true || cold_chain === 'true',
       parseInt(rx_orders) || 0, status || 'lead', joined || '—', url || null, req.params.id]
    )
    res.json(parse(rows[0]))
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM pharmacies WHERE id=$1', [req.params.id])
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
