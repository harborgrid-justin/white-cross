#!/usr/bin/env node

/**
 * Simple User Creation Script - JavaScript Version
 * Creates all necessary users for the White Cross platform
 */

const { NestFactory } = require('@nestjs/core');
const bcrypt = require('bcrypt');

// User data to create
const USERS_TO_CREATE = [
  {
    email: 'admin@whitecross.health',
    password: 'Admin!123',
    firstName: 'System',
    lastName: 'Administrator',
    role: 'ADMIN'
  },
  {
    email: 'nurse@whitecross.health', 
    password: 'Nurse!123',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'NURSE'
  },
  {
    email: 'school.admin@whitecross.health',
    password: 'SchoolAdmin!123',
    firstName: 'Michael',
    lastName: 'Brown', 
    role: 'SCHOOL_ADMIN'
  },
  {
    email: 'district.admin@whitecross.health',
    password: 'DistrictAdmin!123',
    firstName: 'Jennifer',
    lastName: 'Davis',
    role: 'DISTRICT_ADMIN'
  },
  {
    email: 'counselor@whitecross.health',
    password: 'Counselor!123',
    firstName: 'Lisa',
    lastName: 'Wilson', 
    role: 'COUNSELOR'
  },
  {
    email: 'viewer@whitecross.health',
    password: 'Viewer!123',
    firstName: 'Robert', 
    lastName: 'Garcia',
    role: 'VIEWER'
  }
];

async function createUsersSimple() {
  console.log('🚀 Creating users for White Cross platform...\n');
  
  let app;
  
  try {
    // Import the app module
    const { AppModule } = require('../dist/app.module');
    
    // Create NestJS application
    app = await NestFactory.create(AppModule, {
      logger: ['error']
    });

    // Get the User model
    const { User } = require('../dist/database/models');
    
    console.log('✅ Application initialized');
    
    const saltRounds = 12;
    let created = 0;
    let updated = 0;

    for (const userData of USERS_TO_CREATE) {
      try {
        // Check if user exists
        const existingUser = await User.findOne({ 
          where: { email: userData.email }
        });

        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

        if (existingUser) {
          // Update existing user
          await existingUser.update({
            password: hashedPassword,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role,
            isActive: true,
            emailVerified: true,
            isEmailVerified: true,
            mustChangePassword: false,
            failedLoginAttempts: 0,
            twoFactorEnabled: false,
            mfaEnabled: false,
          });
          
          console.log(`📝 Updated: ${userData.email} (${userData.role})`);
          updated++;
        } else {
          // Create new user  
          await User.create({
            email: userData.email,
            password: hashedPassword,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role,
            isActive: true,
            emailVerified: true,
            isEmailVerified: true,
            mustChangePassword: false,
            failedLoginAttempts: 0,
            twoFactorEnabled: false,
            mfaEnabled: false,
          });
          
          console.log(`➕ Created: ${userData.email} (${userData.role})`);
          created++;
        }
      } catch (error) {
        console.error(`❌ Error with user ${userData.email}:`, error.message);
      }
    }

    console.log(`\n🎉 Completed!`);
    console.log(`   Created: ${created} users`);
    console.log(`   Updated: ${updated} users`);

    console.log('\n📋 Login Credentials:');
    USERS_TO_CREATE.forEach(user => {
      const role = user.role.replace('_', ' ').toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      console.log(`   ${role.padEnd(16)}: ${user.email} / ${user.password}`);
    });

  } catch (error) {
    console.error('\n💥 Error:', error.message);
    process.exit(1);
  } finally {
    if (app) {
      await app.close();
    }
  }
}

// Run if called directly
if (require.main === module) {
  createUsersSimple().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { createUsersSimple };