/**
 * Script to drop student-related enum types that might be causing conflicts
 */
const { Sequelize } = require('sequelize');
require('dotenv').config();

async function dropStudentEnum() {
  console.log('🔄 Dropping student enum types...');
  
  try {
    const databaseUrl = process.env.DATABASE_URL;
    const sequelize = new Sequelize(databaseUrl, {
      dialect: 'postgres',
      logging: console.log,
      dialectOptions: databaseUrl.includes('sslmode=require') ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      } : {},
    });

    await sequelize.authenticate();
    console.log('✅ Database connection established.');

    // Drop student enum types
    const enumTypes = [
      'enum_students_gender',
    ];

    for (const enumType of enumTypes) {
      try {
        await sequelize.query(`DROP TYPE IF EXISTS ${enumType} CASCADE;`);
        console.log(`✅ Dropped enum type: ${enumType}`);
      } catch (error) {
        console.log(`⚠️  Could not drop ${enumType}: ${error.message}`);
      }
    }

    // Also drop students table if it exists
    try {
      await sequelize.query('DROP TABLE IF EXISTS students CASCADE;');
      console.log('✅ Dropped students table');
    } catch (error) {
      console.log(`⚠️  Could not drop students table: ${error.message}`);
    }

    await sequelize.close();
    console.log('✅ Cleanup completed successfully!');
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
    process.exit(1);
  }
}

dropStudentEnum();