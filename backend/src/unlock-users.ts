/**
 * Unlock Users Script
 * Resets failed login attempts and unlocks accounts for all locked users
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { User } from './database/models/user.model';
import { Op } from 'sequelize';

async function unlockUsers() {
  console.log('🔓 Unlocking user accounts...\n');

  try {
    // Create NestJS application
    const app = await NestFactory.create(AppModule, { logger: false });

    // Find all locked users or users with failed attempts
    const lockedUsers = await User.findAll({
      where: {
        [Op.or]: [
          { failedLoginAttempts: { [Op.gt]: 0 } },
          { lockoutUntil: { [Op.not]: null } }
        ]
      },
      attributes: ['id', 'email', 'failedLoginAttempts', 'lockoutUntil']
    });

    if (lockedUsers.length === 0) {
      console.log('✅ No locked users found');
      await app.close();
      return;
    }

    console.log(`📋 Found ${lockedUsers.length} users with login issues:\n`);

    for (const user of lockedUsers) {
      console.log(`📧 User: ${user.email}`);
      console.log(`❌ Failed attempts: ${user.failedLoginAttempts}`);
      console.log(`🔒 Locked until: ${user.lockoutUntil || 'Not locked'}`);
      
      // Reset failed attempts using the model method
      await user.resetFailedLoginAttempts();
      
      console.log(`✅ ${user.email} unlocked and reset\n`);
    }

    console.log(`🎉 Successfully unlocked ${lockedUsers.length} accounts`);

    // Close the application
    await app.close();
  } catch (error) {
    console.error('❌ Unlock failed:', error);
    process.exit(1);
  }
}

// Run the unlock
unlockUsers();