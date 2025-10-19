require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('sslmode') ? { rejectUnauthorized: false } : false
});

client.connect()
  .then(() => client.query(`SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename`))
  .then(r => {
    console.log('Database tables:');
    r.rows.forEach(row => console.log(`  - ${row.tablename}`));
    client.end();
  })
  .catch(e => {
    console.error('Error:', e.message);
    client.end();
    process.exit(1);
  });
