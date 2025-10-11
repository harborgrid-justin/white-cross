require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: console.log
});

async function resetDatabase() {
  try {
    console.log('Starting database reset...');

    // Drop all tables in the public schema
    await sequelize.query(`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO public;
    `);

    console.log('✓ Database reset completed successfully!');
    console.log('All tables and data have been dropped.');

    await sequelize.close();
  } catch (error) {
    console.error('✗ Error resetting database:', error.message);
    process.exit(1);
  }
}

resetDatabase();
