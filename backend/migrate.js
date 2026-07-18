const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  await pool.query('ALTER TABLE "DocumentChunk" ALTER COLUMN embedding TYPE vector(3072);');
  console.log("Vector column updated to 3072 dimensions.");
}

main().catch(console.error).finally(() => pool.end());
