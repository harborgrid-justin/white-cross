#!/usr/bin/env ts-node

/**
 * Clear Users Script
 * Removes all test users from the database
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { User } from '@/database/models';

const TEST_EMAILS = [
  'admin@whitecross.health',
  'nurse@whitecross.health', 
  'school.admin@whitecross.health',
  'district.admin@whitecross.health',
  'counselor@whitecross.health',
  'viewer@whitecross.health'
];

async function clearUsers() {
  console.log('🗑️  Clearing test users from database...\n');
  
  let app;
  
  try {
    // Create NestJS application context
    app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn']
    });

    // Count existing test users
    const existingUsers = await User.findAll({
      where: {
        email: TEST_EMAILS
      },
      attributes: ['email']
    });

    if (existingUsers.length === 0) {
      console.log('ℹ️  No test users found to remove');
      return;
    }

    console.log(`Found ${existingUsers.length} test users to remove:`);
    existingUsers.forEach(user => {
      console.log(`   - ${user.email}`);
    });

    // Delete test users
    const deletedCount = await User.destroy({
      where: {
        email: TEST_EMAILS
      }
    });

    console.log(`\n✅ Removed ${deletedCount} test users from database`);

    // Verify deletion
    const remainingUsers = await User.count();
    console.log(`   Remaining users in database: ${remainingUsers}`);

  } catch (error) {
    console.error('\n💥 Error clearing users:', error.message);
    process.exit(1);
  } finally {
    if (app) {
      await app.close();
    }
  }
}

// Run the script
if (require.main === module) {
  clearUsers().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

export { clearUsers };