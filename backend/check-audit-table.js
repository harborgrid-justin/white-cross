/**
 * Check audit_logs table structure
 */
const { Sequelize } = require('sequelize');
require('dotenv').config();

async function checkAuditTable() {
  const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: process.env.DATABASE_URL.includes('sslmode=require') ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {},
  });

  try {
    console.log('🔍 Checking audit_logs table structure...');
    
    // Check if table exists
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'audit_logs' AND table_schema = 'public'
    `);
    
    if (tables.length === 0) {
      console.log('❌ audit_logs table does not exist');
      return;
    }
    
    console.log('✅ audit_logs table exists');
    
    // Check columns
    const [columns] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'audit_logs' AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Current columns:');
    columns.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });
    
    // Check if entity_type column exists
    const hasEntityType = columns.some(col => col.column_name === 'entity_type');
    const hasEntityTypeUnderscore = columns.some(col => col.column_name === 'entityType');
    
    console.log(`\n🔍 entity_type column exists: ${hasEntityType}`);
    console.log(`🔍 entityType column exists: ${hasEntityTypeUnderscore}`);
    
    // Check existing indexes
    const [indexes] = await sequelize.query(`
      SELECT indexname, indexdef
      FROM pg_indexes 
      WHERE tablename = 'audit_logs'
    `);
    
    console.log('\n📇 Current indexes:');
    indexes.forEach(idx => {
      console.log(`  - ${idx.indexname}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkAuditTable();