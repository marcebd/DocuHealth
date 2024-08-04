import dotenv from 'dotenv';
dotenv.config();

import pg from 'pg';
const { Pool } = pg;

const isProduction = process.env.NODE_ENV === "production";

const connectionString = `postgresql://marcelabillingslea:Blue&Rufus&111103@localhost:5432/DocuHealth?schema=public`;

const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

export { pool };
