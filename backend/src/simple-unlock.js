/**
 * Simple unlock script using direct Sequelize connection
 * Bypasses NestJS module loading to avoid path resolution issues
 */

const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Database configuration from environment
const sequelize = new Sequelize(
  process.env.DB_NAME || 'production',
  process.env.DB_USERNAME || 'neondb_owner',
  process.env.DB_PASSWORD || 'npg_H94zeipRTwAS',
  {
    host: process.env.DB_HOST || 'ep-fancy-butterfly-adze3wy1-pooler.c-2.us-east-1.aws.neon.tech',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    logging: false, // Set to console.log to see SQL queries
  }
);

async function unlockUsers() {
  try {
    console.log('🔓 Connecting to database...');
    console.log('Database config:', {
      host: process.env.DB_HOST || 'ep-fancy-butterfly-adze3wy1-pooler.c-2.us-east-1.aws.neon.tech',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'production',
      username: process.env.DB_USERNAME || 'neondb_owner',
      ssl: process.env.DB_SSL || 'true'
    });
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Find users with failed attempts or lockout
    const [users] = await sequelize.query(`
      SELECT id, email, "failedLoginAttempts", "lockoutUntil"
      FROM users 
      WHERE "failedLoginAttempts" > 0 OR "lockoutUntil" IS NOT NULL
    `);

    if (users.length === 0) {
      console.log('✅ No locked users found');
      return;
    }

    console.log(`📋 Found ${users.length} users with login issues:\n`);

    for (const user of users) {
      console.log(`📧 User: ${user.email}`);
      console.log(`❌ Failed attempts: ${user.failedLoginAttempts}`);
      console.log(`🔒 Locked until: ${user.lockoutUntil || 'Not locked'}`);
      
      // Reset failed attempts and unlock
      await sequelize.query(`
        UPDATE users 
        SET "failedLoginAttempts" = 0, 
            "lockoutUntil" = NULL, 
            "lastLogin" = NOW(),
            "updatedAt" = NOW()
        WHERE id = :id
      `, {
        replacements: { id: user.id }
      });
      
      console.log(`✅ ${user.email} unlocked and reset\n`);
    }

    console.log(`🎉 Successfully unlocked ${users.length} accounts`);

  } catch (error) {
    console.error('❌ Error details:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error code:', error.code || 'No error code');
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run the unlock function
unlockUsers();