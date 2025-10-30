const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function cleanupDatabase() {
  const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: console.log,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });

  try {
    console.log('🔗 Connecting to database...');
    await sequelize.authenticate();

    console.log('🧹 Dropping all existing tables to ensure clean camelCase schema...');
    
    // Drop all tables in the correct order (respecting foreign key dependencies)
    const dropQueries = [
      'DROP SCHEMA public CASCADE',
      'CREATE SCHEMA public',
      'GRANT ALL ON SCHEMA public TO postgres',
      'GRANT ALL ON SCHEMA public TO public'
    ];

    for (const query of dropQueries) {
      console.log(`Executing: ${query}`);
      await sequelize.query(query);
    }

    console.log('✅ Database cleaned successfully!');
    console.log('');
    console.log('🏁 Now you can start your NestJS application with:');
    console.log('   npm run start:dev');
    console.log('');
    console.log('💡 All tables will be created fresh with consistent camelCase naming.');

  } catch (error) {
    console.error('❌ Error cleaning database:', error.message);
  } finally {
    await sequelize.close();
  }
}

console.log('🧹 Cleaning database for fresh camelCase schema...');
cleanupDatabase();