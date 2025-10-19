// Use TypeScript with ts-node
require('ts-node').register({
  compilerOptions: {
    module: 'commonjs'
  }
});

const { Sequelize } = require('sequelize');
require('dotenv').config();

async function runSimpleSeed() {
  const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    ssl: process.env.DATABASE_URL.includes('sslmode=require') ? {
      require: true,
      rejectUnauthorized: false
    } : false
  });

  try {
    console.log('========================================');
    console.log('  WHITE CROSS - SIMPLE DATABASE SEEDER');
    console.log('========================================');
    console.log('');

    await sequelize.authenticate();
    console.log('Connected to database');
    console.log('');

    const districts = require('./src/database/seeders/01-districts-and-schools.ts');
    const users = require('./src/database/seeders/03-users-and-assignments.ts');

    // Districts and Schools
    console.log('[1/2] Districts and Schools');
    console.log('  Records: 1 district, 5 schools');
    console.log('  Running...');
    try {
      await districts.up(sequelize.getQueryInterface());
      console.log('  ✓ Success');
    } catch (error) {
      console.error('  ✗ Districts seeder failed:', error.message);
      if (error.errors) {
        error.errors.forEach(err => console.error('    -', err.message));
      }
      throw error;
    }
    console.log('');

    // Users
    console.log('[2/2] Users');
    console.log('  Records: 15+ users across all roles');
    console.log('  Running...');
    await users.up(sequelize.getQueryInterface());
    console.log('  ✓ Success');
    console.log('');

    console.log('========================================');
    console.log('✓ Simple seeding completed successfully!');
    console.log('');
    console.log('Test credentials available:');
    console.log('- admin@whitecross.health / AdminPassword123!');
    console.log('- nurse@school.edu / NursePassword123!');
    console.log('- admin@school.edu / AdminPassword123!');
    console.log('========================================');

  } catch (error) {
    console.error('Seeding failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

runSimpleSeed();
