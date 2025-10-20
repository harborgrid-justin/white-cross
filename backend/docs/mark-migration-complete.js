require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('sslmode') ? { rejectUnauthorized: false } : false
});

async function markMigrationComplete() {
  try {
    await client.connect();
    console.log('Connected to database');

    // Insert the migration record
    await client.query(`
      INSERT INTO "SequelizeMeta" (name) 
      VALUES ('20251011170700-add-user-security-enhancements.js')
      ON CONFLICT DO NOTHING
    `);

    console.log('✓ Marked migration as complete');

  } catch (error) {
    console.error('✗ Error:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

markMigrationComplete()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch(e => {
    console.error('Failed:', e);
    process.exit(1);
  });
