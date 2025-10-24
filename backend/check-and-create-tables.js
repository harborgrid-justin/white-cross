// Check database tables and create missing ones
require('dotenv').config();
const { sequelize } = require('./dist/database/models');

async function checkAndCreateTables() {
  try {
    console.log('Checking database tables...\n');

    // List existing tables
    const [tables] = await sequelize.query(
      "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename"
    );

    console.log('Existing tables:');
    tables.forEach(t => console.log(`  - ${t.tablename}`));
    console.log(`\nTotal: ${tables.length} tables\n`);

    // Check for critical missing tables
    const requiredTables = [
      'roles',
      'permissions',
      'role_permissions',
      'user_roles',
      'users',
      'students',
      'medications',
      'health_records',
      'appointments',
      'incidents',
      'audit_logs'
    ];

    const existingTableNames = tables.map(t => t.tablename);
    const missingTables = requiredTables.filter(t => !existingTableNames.includes(t));

    if (missingTables.length > 0) {
      console.log('Missing critical tables:');
      missingTables.forEach(t => console.log(`  ❌ ${t}`));
      console.log('\n=== ACTION REQUIRED ===');
      console.log('Run: npm run db:sync');
      console.log('This will create all missing tables from models.\n');
    } else {
      console.log('✅ All critical tables exist!\n');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

checkAndCreateTables();
