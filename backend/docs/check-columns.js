require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('sslmode') ? { rejectUnauthorized: false } : false
});

client.connect()
  .then(() => client.query(`SELECT column_name FROM information_schema.columns WHERE table_name='users' ORDER BY ordinal_position`))
  .then(r => {
    console.log('Columns in users table:');
    r.rows.forEach(row => console.log(`  - ${row.column_name}`));
    client.end();
  })
  .catch(e => {
    console.error('Error:', e.message);
    client.end();
    process.exit(1);
  });
