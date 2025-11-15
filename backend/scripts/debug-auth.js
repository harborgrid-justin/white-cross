#!/usr/bin/env node

/**
 * Debug Authentication Script
 * Checks user data and tests password comparison
 */

const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');

// Load environment variables
require('dotenv').config();

async function debugAuth() {
  console.log('🔍 Debugging authentication issue...\n');

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

    // Check admin user
    const users = await sequelize.query(
      `SELECT 
        id, 
        email, 
        "firstName", 
        "lastName", 
        role,
        "isActive",
        "emailVerified",
        password,
        CASE 
          WHEN password IS NULL THEN 'NULL'
          WHEN password = '' THEN 'EMPTY'
          WHEN LENGTH(password) < 10 THEN 'TOO_SHORT'
          ELSE 'OK (' || LENGTH(password) || ' chars)'
        END as password_status
      FROM users 
      WHERE email = 'admin@whitecross.health'`,
      { type: sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0) {
      console.log('❌ Admin user not found!');
      console.log('💡 Run: npm run create:users');
      return;
    }

    const user = users[0];
    console.log('👤 Admin User Details:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.firstName} ${user.lastName}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Active: ${user.isActive}`);
    console.log(`   Email Verified: ${user.emailVerified}`);
    console.log(`   Password Status: ${user.password_status}`);
    console.log('');

    // Test password comparison
    if (user.password) {
      console.log('🔑 Testing password comparison...');
      
      const testPassword = 'Admin!123';
      console.log(`   Test Password: ${testPassword}`);
      console.log(`   Stored Hash: ${user.password.substring(0, 29)}...`);
      
      try {
        const isValid = await bcrypt.compare(testPassword, user.password);
        console.log(`   ✅ Password comparison result: ${isValid ? 'VALID' : 'INVALID'}`);
        
        if (!isValid) {
          console.log('\n🧪 Testing other possible passwords...');
          const testPasswords = [
            'admin123',      // Old format
            'Admin!234',     // From archived seed
            'admin@123',     // Alternative
            'password',      // Default
          ];
          
          for (const testPwd of testPasswords) {
            const result = await bcrypt.compare(testPwd, user.password);
            console.log(`   ${testPwd.padEnd(12)}: ${result ? '✅ VALID' : '❌ Invalid'}`);
          }
        }
      } catch (error) {
        console.error(`   ❌ bcrypt.compare error: ${error.message}`);
        
        // Check if the hash format is correct
        if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
          console.log('   ℹ️  Hash format appears correct (bcrypt)');
        } else {
          console.log('   ⚠️  Hash format may be incorrect');
          console.log(`   Expected: $2b$12$... or $2a$12$...`);
          console.log(`   Actual: ${user.password.substring(0, 10)}...`);
        }
      }
    } else {
      console.log('❌ Password field is null or empty!');
    }

    console.log('\n📋 All Test Users:');
    const allUsers = await sequelize.query(
      `SELECT 
        email, 
        role,
        "isActive",
        CASE 
          WHEN password IS NULL THEN 'NULL'
          WHEN password = '' THEN 'EMPTY'
          WHEN LENGTH(password) < 10 THEN 'TOO_SHORT'
          ELSE 'OK'
        END as password_status
      FROM users 
      WHERE email LIKE '%@whitecross.health'
      ORDER BY role`,
      { type: sequelize.QueryTypes.SELECT }
    );

    allUsers.forEach((u, i) => {
      console.log(`   ${(i + 1).toString().padStart(2)}. ${u.email.padEnd(35)} | ${u.role.padEnd(15)} | ${u.password_status} | ${u.isActive ? 'Active' : 'Inactive'}`);
    });

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
  debugAuth().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { debugAuth };