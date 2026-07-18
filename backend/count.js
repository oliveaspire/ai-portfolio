const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function check() {
  const docs = await pool.query('SELECT name, indexed FROM "Document"');
  console.log("Documents:", docs.rows);
}

check().catch(console.error).finally(() => pool.end());
