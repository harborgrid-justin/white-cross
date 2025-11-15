#!/usr/bin/env ts-node

/**
 * Create Users Script
 * Simple script to create all necessary users for the White Cross platform
 * 
 * This script directly creates users using the NestJS app context
 * without complex dependencies or sequelize CLI.
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { User } from '@/database/models';
import { UserRole } from '@/database/types/user-role.enum';
import * as bcrypt from 'bcrypt';

interface TestUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

const TEST_USERS: TestUser[] = [
  {
    email: 'admin@whitecross.health',
    password: 'Admin!123',
    firstName: 'System',
    lastName: 'Administrator', 
    role: UserRole.ADMIN
  },
  {
    email: 'nurse@whitecross.health',
    password: 'Nurse!123',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: UserRole.NURSE
  },
  {
    email: 'school.admin@whitecross.health', 
    password: 'SchoolAdmin!123',
    firstName: 'Michael',
    lastName: 'Brown',
    role: UserRole.SCHOOL_ADMIN
  },
  {
    email: 'district.admin@whitecross.health',
    password: 'DistrictAdmin!123', 
    firstName: 'Jennifer',
    lastName: 'Davis',
    role: UserRole.DISTRICT_ADMIN
  },
  {
    email: 'counselor@whitecross.health',
    password: 'Counselor!123',
    firstName: 'Lisa', 
    lastName: 'Wilson',
    role: UserRole.COUNSELOR
  },
  {
    email: 'viewer@whitecross.health',
    password: 'Viewer!123',
    firstName: 'Robert',
    lastName: 'Garcia', 
    role: UserRole.VIEWER
  }
];

async function createUsers() {
  console.log('🚀 Creating users for White Cross platform...\n');
  
  let app;
  
  try {
    // Create NestJS application context
    app = await NestFactory.create(AppModule, { 
      logger: ['error', 'warn'] 
    });

    console.log('✅ Application initialized');
    
    const saltRounds = 12;
    let created = 0;
    let updated = 0;

    for (const userData of TEST_USERS) {
      try {
        // Check if user already exists
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
          
          console.log(`📝 Updated user: ${userData.email} (${userData.role})`);
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
          
          console.log(`➕ Created user: ${userData.email} (${userData.role})`);
          created++;
        }
      } catch (error) {
        console.error(`❌ Error processing user ${userData.email}:`, error.message);
      }
    }

    console.log(`\n🎉 User creation completed!`);
    console.log(`   Created: ${created} users`);
    console.log(`   Updated: ${updated} users`);

    // Verify users were created
    const totalUsers = await User.count();
    console.log(`   Total users in database: ${totalUsers}`);

    console.log('\n📋 Login Credentials:');
    TEST_USERS.forEach(user => {
      const roleDisplay = user.role.replace('_', ' ').toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      console.log(`   ${roleDisplay.padEnd(16)}: ${user.email} / ${user.password}`);
    });

    console.log('\n🌐 Next Steps:');
    console.log('   1. Start backend: npm run start:dev');
    console.log('   2. Start frontend: npm run dev (in frontend/ directory)');
    console.log('   3. Visit http://localhost:5173 and login');

  } catch (error) {
    console.error('\n💥 Fatal error:', error.message);
    console.error('\nStack trace:', error.stack);
    process.exit(1);
  } finally {
    if (app) {
      try {
        await app.close();
        console.log('\n👋 Application closed');
      } catch (closeError) {
        console.error('Error closing application:', closeError.message);
      }
    }
  }
}

// Run the script
if (require.main === module) {
  createUsers().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

export { createUsers };