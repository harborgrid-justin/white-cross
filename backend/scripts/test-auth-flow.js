#!/usr/bin/env node

/**
 * Test Authentication Flow
 * Tests the full authentication flow to identify where bcrypt.compare fails
 */

const { Sequelize, QueryTypes } = require('sequelize');
const bcrypt = require('bcrypt');

// Load environment variables
require('dotenv').config();

async function testAuthFlow() {
  console.log('🔍 Testing authentication flow...\n');

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

    // Step 1: Find user by email (same way as auth service)
    const email = 'admin@whitecross.health';
    console.log(`\n🔍 Step 1: Finding user by email: ${email}`);
    
    const users = await sequelize.query(
      'SELECT * FROM users WHERE email = :email',
      {
        type: QueryTypes.SELECT,
        replacements: { email }
      }
    );

    if (users.length === 0) {
      console.log('❌ No user found!');
      return;
    }

    const user = users[0];
    console.log(`✅ Found user: ${user.firstName} ${user.lastName}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Active: ${user.isActive}`);
    console.log(`   Password present: ${!!user.password}`);
    
    if (user.password) {
      console.log(`   Password length: ${user.password.length} chars`);
      console.log(`   Password hash: ${user.password.substring(0, 29)}...`);
    }

    // Step 2: Test if account is locked (simulate auth service logic)
    console.log(`\n🔒 Step 2: Checking if account is locked`);
    console.log(`   Failed login attempts: ${user.failedLoginAttempts || 0}`);
    console.log(`   Lockout until: ${user.lockoutUntil || 'None'}`);
    
    const isLocked = user.lockoutUntil && new Date(user.lockoutUntil) > new Date();
    console.log(`   Account locked: ${isLocked ? 'YES' : 'NO'}`);

    if (isLocked) {
      console.log('❌ Account is locked!');
      return;
    }

    // Step 3: Test password comparison (this is where bcrypt fails)
    console.log(`\n🔑 Step 3: Testing password comparison`);
    
    const candidatePassword = 'Admin!123';
    console.log(`   Candidate password: ${candidatePassword}`);
    console.log(`   Stored hash: ${user.password}`);
    
    // Check if we have both password and hash
    if (!candidatePassword) {
      console.log('❌ ERROR: Candidate password is null/undefined!');
      return;
    }
    
    if (!user.password) {
      console.log('❌ ERROR: Stored password hash is null/undefined!');
      return;
    }

    try {
      console.log(`   Calling bcrypt.compare("${candidatePassword}", "${user.password.substring(0, 20)}...")`);
      const isValid = await bcrypt.compare(candidatePassword, user.password);
      console.log(`   ✅ Password comparison result: ${isValid ? 'VALID' : 'INVALID'}`);
      
      if (isValid) {
        console.log('\n🎉 Authentication would SUCCEED!');
      } else {
        console.log('\n❌ Authentication would FAIL - wrong password');
        
        // Test with alternative passwords
        const alternatives = ['admin123', 'Admin123', 'admin@123', 'password'];
        console.log('\n🧪 Testing alternative passwords...');
        for (const altPwd of alternatives) {
          try {
            const altResult = await bcrypt.compare(altPwd, user.password);
            console.log(`   ${altPwd.padEnd(15)}: ${altResult ? '✅ VALID' : '❌ Invalid'}`);
          } catch (err) {
            console.log(`   ${altPwd.padEnd(15)}: ❌ Error - ${err.message}`);
          }
        }
      }
      
    } catch (error) {
      console.log(`❌ ERROR in bcrypt.compare: ${error.message}`);
      console.log(`   Error type: ${error.constructor.name}`);
      console.log(`   Full error:`, error);
      
      // Check the exact values being passed
      console.log('\n🔍 Debugging values:');
      console.log(`   candidatePassword type: ${typeof candidatePassword}`);
      console.log(`   candidatePassword value: "${candidatePassword}"`);
      console.log(`   candidatePassword length: ${candidatePassword.length}`);
      console.log(`   user.password type: ${typeof user.password}`);
      console.log(`   user.password value: "${user.password}"`);
      console.log(`   user.password length: ${user.password.length}`);
    }

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
  testAuthFlow().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { testAuthFlow };