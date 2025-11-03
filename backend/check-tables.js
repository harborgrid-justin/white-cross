require('dotenv').config();
const { Sequelize } = require('sequelize');

const db = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: process.env.DATABASE_SSL === 'true' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  logging: console.log
});

async function checkTables() {
  try {
    // Check if incident_reports table exists
    const [results] = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('incident_reports', 'follow_up_actions', 'witness_statements')
    `);
    
    console.log('Existing incident-related tables:', results.map(r => r.table_name));
    
    // Check if enum types exist
    const [enumResults] = await db.query(`
      SELECT typname 
      FROM pg_type 
      WHERE typname LIKE '%incident%'
    `);
    
    console.log('Existing incident-related enum types:', enumResults.map(r => r.typname));
    
    await db.close();
    process.exit(0);
  } catch (err) {
    console.error('✗ Error:', err.message);
    await db.close();
    process.exit(1);
  }
}

checkTables();
