/**
 * Simple Database Sync Script - Users Only
 * Creates just the users table first to resolve the data type issue
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Sequelize } from 'sequelize-typescript';
import { User } from './database/models/user.model';

async function syncUsersOnly() {
  console.log('🔄 Starting minimal database sync (users only)...');

  try {
    // Create NestJS application
    const app = await NestFactory.create(AppModule, { logger: false });

    // Get Sequelize instance
    const sequelize = app.get(Sequelize);

    console.log('📋 Syncing users table only...');

    // Sync just the User model first
    await User.sync({
      force: true, // Drop and recreate
      logging: console.log,
    });

    console.log('✅ Users table sync completed successfully!');

    // Close the application
    await app.close();
  } catch (error) {
    console.error('❌ Users table sync failed:', error);
    process.exit(1);
  }
}

// Run the sync
syncUsersOnly();
