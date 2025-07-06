import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'mygroupdb',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'admin',
  ssl: {
    rejectUnauthorized: false,
  },
};


const pool = new Pool(dbConfig);

const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Database connected successfully:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

process.on('SIGINT', async () => {
  console.log('🔄 Gracefully shutting down database connections...');
  await pool.end();
  console.log('✅ Database connections closed.');
  process.exit(0);
});

export { pool, testConnection };
