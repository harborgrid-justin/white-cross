const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: console.log,
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  }
});

async function dropAuditLogsTable() {
  try {
    console.log('🗑️  Dropping audit_logs table and related enum types...');
    
    // Drop the table first (this will drop associated indexes)
    await sequelize.query('DROP TABLE IF EXISTS "audit_logs" CASCADE;');
    console.log('✅ Dropped audit_logs table');
    
    // Drop the enum types
    await sequelize.query('DROP TYPE IF EXISTS "public"."enum_audit_logs_action" CASCADE;');
    console.log('✅ Dropped enum_audit_logs_action type');
    
    await sequelize.query('DROP TYPE IF EXISTS "public"."enum_audit_logs_compliance_type" CASCADE;');
    console.log('✅ Dropped enum_audit_logs_compliance_type type');
    
    await sequelize.query('DROP TYPE IF EXISTS "public"."enum_audit_logs_complianceType" CASCADE;');
    console.log('✅ Dropped enum_audit_logs_complianceType type');
    
    await sequelize.query('DROP TYPE IF EXISTS "public"."enum_audit_logs_severity" CASCADE;');
    console.log('✅ Dropped enum_audit_logs_severity type');
    
    console.log('🎉 audit_logs table and enum types dropped successfully');
    
  } catch (error) {
    console.error('❌ Error dropping audit_logs table:', error.message);
  } finally {
    await sequelize.close();
  }
}

dropAuditLogsTable();