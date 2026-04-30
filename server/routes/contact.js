import { Router } from 'express'
import pool from '../db.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM contact_info LIMIT 1')
    res.json(rows[0] || null)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.put('/', async (req, res) => {
  const { email, phone, address, working_hours, map_url } = req.body
  try {
    const existing = await pool.query('SELECT id FROM contact_info LIMIT 1')
    let rows
    if (existing.rows.length > 0) {
      ;({ rows } = await pool.query(
        'UPDATE contact_info SET email=$1,phone=$2,address=$3,working_hours=$4,map_url=$5,updated_at=NOW() WHERE id=$6 RETURNING *',
        [email || '', phone || '', address || '', working_hours || '', map_url || '', existing.rows[0].id]
      ))
    } else {
      ;({ rows } = await pool.query(
        'INSERT INTO contact_info (email,phone,address,working_hours,map_url) VALUES ($1,$2,$3,$4,$5) RETURNING *',
        [email || '', phone || '', address || '', working_hours || '', map_url || '']
      ))
    }
    res.json(rows[0])
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
