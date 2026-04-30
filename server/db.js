import pg from 'pg'
const { Pool } = pg

export default new Pool({
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: '@Cows123',
})
