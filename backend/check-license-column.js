/**
 * Script to check the current license table column structure
 */
const { Sequelize } = require('sequelize');
require('dotenv').config();

async function checkLicenseTable() {
  try {
    const sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: process.env.DATABASE_URL.includes('sslmode=require') ? {
        ssl: { require: true, rejectUnauthorized: false }
      } : {},
    });

    await sequelize.authenticate();
    console.log('✅ Connected to database');

    const [results] = await sequelize.query(`
      SELECT column_name, data_type, character_maximum_length, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'licenses' AND column_name = 'licenseKey'
      ORDER BY column_name;
    `);

    console.log('\n📋 Current licenseKey column structure:');
    console.log(JSON.stringify(results, null, 2));

    // Check for any existing constraints
    const [constraints] = await sequelize.query(`
      SELECT 
        tc.constraint_name,
        tc.constraint_type,
        kcu.column_name
      FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
      WHERE tc.table_name = 'licenses' 
        AND kcu.column_name = 'licenseKey';
    `);

    console.log('\n🔒 Current licenseKey constraints:');
    console.log(JSON.stringify(constraints, null, 2));

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkLicenseTable().catch(console.error);