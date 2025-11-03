const { Client } = require('pg');
const config = require('dotenv').config();

async function dropAllTables() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Get all table names
    const tablesResult = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `);

    console.log('Found tables:', tablesResult.rows.map(row => row.tablename));

    // Drop all tables with CASCADE to handle foreign key dependencies
    if (tablesResult.rows.length > 0) {
      const tableNames = tablesResult.rows.map(row => `"${row.tablename}"`).join(', ');
      await client.query(`DROP TABLE IF EXISTS ${tableNames} CASCADE`);
      console.log('All tables dropped successfully');
    } else {
      console.log('No tables found to drop');
    }

    // Also drop all custom types/enums
    const typesResult = await client.query(`
      SELECT typname 
      FROM pg_type 
      WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
      AND typtype = 'e'
    `);

    if (typesResult.rows.length > 0) {
      for (const row of typesResult.rows) {
        await client.query(`DROP TYPE IF EXISTS "public"."${row.typname}" CASCADE`);
        console.log(`Dropped type: ${row.typname}`);
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

dropAllTables();