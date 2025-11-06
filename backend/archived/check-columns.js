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
  logging: false
});

async function checkColumns() {
  try {
    const [results] = await db.query(`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns 
      WHERE table_name = 'incident_reports'
      ORDER BY ordinal_position
    `);
    
    console.log('incident_reports columns:');
    results.forEach(r => {
      console.log(`  - ${r.column_name}: ${r.data_type} (${r.udt_name})`);
    });
    
    await db.close();
    process.exit(0);
  } catch (err) {
    console.error('✗ Error:', err.message);
    await db.close();
    process.exit(1);
  }
}

checkColumns();
