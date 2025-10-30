/**
 * Script to fix users table id column type from VARCHAR to UUID
 */
const { Sequelize } = require('sequelize');
require('dotenv').config();

async function fixUserIdType() {
  console.log('🔄 Fixing users table id column type...');
  
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

    // First, check if there are any existing users
    const userCount = await sequelize.query('SELECT COUNT(*) FROM users');
    console.log('Number of existing users:', userCount[0][0].count);

    // If there are users, we need to handle this carefully
    if (parseInt(userCount[0][0].count) > 0) {
      console.log('⚠️  Found existing users. Creating backup and converting IDs...');
      
      // Create a backup table
      await sequelize.query('CREATE TABLE users_backup AS SELECT * FROM users');
      console.log('✅ Created backup table: users_backup');

      // Drop constraints that reference the id column
      try {
        await sequelize.query('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_pkey CASCADE');
        console.log('✅ Dropped primary key constraint');
      } catch (error) {
        console.log('⚠️  Primary key constraint not found or already dropped');
      }

      // Add a new UUID column
      await sequelize.query('ALTER TABLE users ADD COLUMN new_id UUID DEFAULT gen_random_uuid()');
      console.log('✅ Added new UUID column');

      // Update the new_id for all existing records
      await sequelize.query('UPDATE users SET new_id = gen_random_uuid()');
      console.log('✅ Generated UUIDs for existing records');

      // Drop the old id column and rename new_id to id
      await sequelize.query('ALTER TABLE users DROP COLUMN id');
      await sequelize.query('ALTER TABLE users RENAME COLUMN new_id TO id');
      await sequelize.query('ALTER TABLE users ADD PRIMARY KEY (id)');
      console.log('✅ Replaced VARCHAR id with UUID id');

    } else {
      console.log('No existing users found. Safe to alter column directly.');
      
      // Drop and recreate the column
      await sequelize.query('ALTER TABLE users DROP COLUMN id');
      await sequelize.query('ALTER TABLE users ADD COLUMN id UUID DEFAULT gen_random_uuid() PRIMARY KEY');
      console.log('✅ Converted id column to UUID');
    }

    await sequelize.close();
    console.log('✅ Users table id column successfully converted to UUID!');
    
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

fixUserIdType();