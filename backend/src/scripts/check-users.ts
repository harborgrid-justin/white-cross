#!/usr/bin/env ts-node

/**
 * Check Users Script  
 * Lists all users in the database with their details
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { User } from '@/database/models';

async function checkUsers() {
  console.log('🔍 Checking users in database...\n');
  
  let app;
  
  try {
    // Create NestJS application context
    app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn']
    });

    // Get all users
    const users = await User.findAll({
      attributes: [
        'id',
        'email', 
        'firstName',
        'lastName',
        'role',
        'isActive',
        'emailVerified',
        'isEmailVerified',
        'createdAt'
      ],
      order: [['role', 'ASC'], ['createdAt', 'ASC']]
    });

    if (users.length === 0) {
      console.log('❌ No users found in database');
      console.log('\n💡 Run this command to create test users:');
      console.log('   npm run create:users');
    } else {
      console.log(`✅ Found ${users.length} user(s):\n`);
      
      users.forEach((user, index) => {
        const roleDisplay = user.role.replace('_', ' ').toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        console.log(`${(index + 1).toString().padStart(2)}. ${user.email}`);
        console.log(`    Name:      ${user.firstName} ${user.lastName}`);
        console.log(`    Role:      ${roleDisplay}`);
        console.log(`    Active:    ${user.isActive ? '✅' : '❌'}`);
        console.log(`    Verified:  ${user.isEmailVerified ? '✅' : '❌'}`);
        console.log(`    Created:   ${user.createdAt.toISOString().split('T')[0]}`);
        console.log('');
      });
      
      // Group by role
      const roleGroups = users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      console.log('📊 Users by Role:');
      Object.entries(roleGroups).forEach(([role, count]) => {
        const roleDisplay = role.replace('_', ' ').toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        console.log(`   ${roleDisplay.padEnd(16)}: ${count}`);
      });
    }

  } catch (error) {
    console.error('\n💥 Error checking users:', error.message);
    process.exit(1);
  } finally {
    if (app) {
      await app.close();
    }
  }
}

// Run the script
if (require.main === module) {
  checkUsers().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

export { checkUsers };