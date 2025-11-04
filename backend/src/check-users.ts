/**
 * Check Users Script
 * Lists all users in the database
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { User } from './database/models/user.model';

async function checkUsers() {
  console.log('🔍 Checking users in database...\n');
  
  try {
    // Create NestJS application
    const app = await NestFactory.create(AppModule, { logger: false });
    
    // Find all users
    const users = await User.findAll({
      attributes: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive', 'emailVerified', 'createdAt']
    });
    
    if (users.length === 0) {
      console.log('❌ No users found in database\n');
    } else {
      console.log(`✅ Found ${users.length} user(s):\n`);
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email}`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Name: ${user.firstName} ${user.lastName}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Active: ${user.isActive}`);
        console.log(`   Email Verified: ${user.emailVerified}`);
        console.log(`   Created: ${user.createdAt}`);
        console.log('');
      });
    }
    
    // Close the application
    await app.close();
    
  } catch (error) {
    console.error('❌ Error checking users:', error);
    process.exit(1);
  }
}

// Run the check
checkUsers();
