import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config();

const pool = pg.Pool

export const db = new pool({
    connectionString:process.env.DATABASE_URL,
    ssl:{
        rejectUnauthorized: false,
    }
})