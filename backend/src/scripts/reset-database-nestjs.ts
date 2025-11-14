#!/usr/bin/env ts-node

/**
 * Database Reset Script using NestJS App
 * 
 * This script creates a NestJS application context to properly initialize
 * all models and their associations, then resets the database schema.
 * 
 * Usage:
 * npm run db:reset:nestjs
 * 
 * WARNING: This will destroy all existing data!
 */

import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import * as dotenv from 'dotenv';
import { AppModule } from '../app.module';

// Load environment variables
dotenv.config();

const logger = new Logger('DatabaseReset');

async function resetDatabase() {
  try {
    logger.log('Starting database reset using NestJS context...');
    
    // Create NestJS application context (without starting HTTP server)
    const app = await NestFactory.createApplicationContext(AppModule, {
      logger: false, // Disable NestJS logging during initialization
    });
    
    // Get Sequelize instance from the application context
    const sequelize = app.get(Sequelize);
    
    logger.log('Database connection established via NestJS');
    logger.log(`Loaded ${Object.keys(sequelize.models).length} models`);
    
    // List all models for verification
    const modelNames = Object.keys(sequelize.models).sort();
    logger.log(`Models: ${modelNames.join(', ')}`);
    
    logger.warn('WARNING: About to drop and recreate all database tables!');
    logger.warn('This will destroy all existing data!');
    
    // Wait a moment for the warning to be visible
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Force sync - this will drop and recreate all tables
    logger.log('Dropping all existing tables...');
    await sequelize.sync({ force: true });
    
    logger.log('✅ Database reset completed successfully!');
    logger.log('All tables have been recreated based on current model definitions');
    
    // Close the application context
    await app.close();
    
  } catch (error) {
    logger.error('❌ Database reset failed:', error);
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  resetDatabase()
    .then(() => {
      logger.log('Database reset script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Database reset script failed:', error);
      process.exit(1);
    });
}

export { resetDatabase };
