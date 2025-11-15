#!/usr/bin/env node

/**
 * Unlock Users Script - Direct Database Access
 * Resets failed login attempts and unlocks accounts for all locked users
 */

const { Sequelize, Op, QueryTypes } = require('sequelize');

// Load environment variables
require('dotenv').config();

async function unlockUsers() {
  console.log('🔓 Unlocking user accounts...\n');

  // Create Sequelize connection
  const sequelize = new Sequelize(
    process.env.DB_NAME || 'production',
    process.env.DB_USERNAME || 'neondb_owner',
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      dialect: 'postgres',
      dialectOptions: {
        ssl: process.env.DB_HOST && process.env.DB_HOST !== 'localhost' ? {
          require: true,
          rejectUnauthorized: false
        } : false
      },
      logging: false
    }
  );

  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // Find all locked users or users with failed attempts
    const lockedUsers = await sequelize.query(
      `SELECT 
        id, 
        email, 
        "failedLoginAttempts", 
        "lockoutUntil"
      FROM users 
      WHERE "failedLoginAttempts" > 0 OR "lockoutUntil" IS NOT NULL`,
      { type: QueryTypes.SELECT }
    );

    if (lockedUsers.length === 0) {
      console.log('✅ No locked users found');
      return;
    }

    console.log(`📋 Found ${lockedUsers.length} users with login issues:\n`);

    for (const user of lockedUsers) {
      console.log(`📧 User: ${user.email}`);
      console.log(`❌ Failed attempts: ${user.failedLoginAttempts}`);
      console.log(`🔒 Locked until: ${user.lockoutUntil || 'Not locked'}`);
      
      // Reset failed attempts and lockout
      await sequelize.query(
        `UPDATE users 
         SET "failedLoginAttempts" = 0, "lockoutUntil" = NULL, "updatedAt" = NOW()
         WHERE id = :userId`,
        {
          type: QueryTypes.UPDATE,
          replacements: { userId: user.id }
        }
      );
      
      console.log(`✅ ${user.email} unlocked and reset\n`);
    }

    console.log(`🎉 Successfully unlocked ${lockedUsers.length} accounts`);

  } catch (error) {
    console.error('\n💥 Error:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
    console.log('\n👋 Database connection closed');
  }
}

// Run if called directly
if (require.main === module) {
  unlockUsers().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { unlockUsers };