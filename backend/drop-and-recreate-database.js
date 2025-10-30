const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function dropAndRecreateDatabase() {
  // Create connection without specifying a database
  const sequelizeAdmin = new Sequelize('postgres', process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });

  try {
    console.log('🔗 Connecting to PostgreSQL server...');
    await sequelizeAdmin.authenticate();

    console.log('🗑️  Dropping existing database (if exists)...');
    await sequelizeAdmin.query(`DROP DATABASE IF EXISTS "${process.env.DB_NAME}"`);
    
    console.log('🆕 Creating fresh database...');
    await sequelizeAdmin.query(`CREATE DATABASE "${process.env.DB_NAME}"`);
    
    console.log('✅ Database recreated successfully!');
    console.log('');
    console.log('🏁 Now you can start your NestJS application with:');
    console.log('   npm run start:dev');
    console.log('');
    console.log('💡 The database will be synchronized with your camelCase models.');

  } catch (error) {
    console.error('❌ Error recreating database:', error.message);
    
    if (error.message.includes('does not exist')) {
      console.log('');
      console.log('🆕 Database doesn\'t exist yet. Creating it...');
      await sequelizeAdmin.query(`CREATE DATABASE "${process.env.DB_NAME}"`);
      console.log('✅ Database created successfully!');
    }
  } finally {
    await sequelizeAdmin.close();
  }
}

console.log('🧹 Dropping and recreating database for camelCase consistency...');
dropAndRecreateDatabase();