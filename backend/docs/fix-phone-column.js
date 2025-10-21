require('dotenv').config();
const { Client } = require('pg');

async function fixPhoneColumn() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('sslmode=require') ? {
      rejectUnauthorized: false
    } : false
  });

  try {
    await client.connect();
    console.log('Connected to database');
    console.log('');

    // Check current columns
    console.log('Checking current users table schema...');
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);

    console.log('Current columns in users table:');
    const columnNames = result.rows.map(row => row.column_name);
    result.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    console.log('');

    // Check if phone column exists
    if (!columnNames.includes('phone')) {
      console.log('Phone column is missing. Adding it now...');
      await client.query('ALTER TABLE users ADD COLUMN phone VARCHAR(20)');
      console.log('✓ Phone column added successfully');
    } else {
      console.log('✓ Phone column already exists');
    }

    console.log('');
    console.log('✓ Database schema is now complete!');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

fixPhoneColumn();
