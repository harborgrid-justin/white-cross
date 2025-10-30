const { Client } = require('pg');
const config = require('dotenv').config();

async function cleanupDuplicateColumns() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    console.log('Connected to database');

    console.log('Removing duplicate snake_case columns from follow_up_actions...');
    
    const columnsToRemove = [
      'incident_report_id',
      'due_date', 
      'assigned_to',
      'completed_at',
      'completed_by',
      'created_at',
      'updated_at'
    ];

    for (const column of columnsToRemove) {
      try {
        await client.query(`ALTER TABLE follow_up_actions DROP COLUMN IF EXISTS "${column}"`);
        console.log(`  Removed column: ${column}`);
      } catch (error) {
        console.log(`  Could not remove column ${column}: ${error.message}`);
      }
    }

    console.log('Cleanup completed!');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

cleanupDuplicateColumns();