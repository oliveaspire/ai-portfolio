const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('DELETE FROM "Document"').then(() => console.log('Deleted all documents')).catch(console.error).finally(() => pool.end());
