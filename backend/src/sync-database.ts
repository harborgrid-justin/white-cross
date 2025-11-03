/**
 * Database Sync Script for Development
 * Synchronizes Sequelize models with the database
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Sequelize } from 'sequelize-typescript';

async function syncDatabase() {
  console.log('🔄 Starting database sync...');
  
  try {
    // Create NestJS application
    const app = await NestFactory.create(AppModule, { logger: false });
    
    // Get Sequelize instance
    const sequelize = app.get(Sequelize);
    
    console.log('📋 Syncing database models...');
    
    // Sync all models (creates tables if they don't exist)
    await sequelize.sync({ 
      force: true,   // Drop and recreate all tables
      alter: false,  // Don't alter, just recreate
      logging: console.log
    });
    
    console.log('✅ Database sync completed successfully!');
    
    // Close the application
    await app.close();
    
  } catch (error) {
    console.error('❌ Database sync failed:', error);
    process.exit(1);
  }
}

// Run the sync
syncDatabase();