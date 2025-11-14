#!/usr/bin/env ts-node

/**
 * Simple Database Reset Script
 * 
 * This script directly connects to PostgreSQL and resets the database
 * using a simple SQL approach, then uses Sequelize sync.
 * 
 * Usage:
 * npm run db:reset:simple
 * 
 * WARNING: This will destroy all existing data!
 */

import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const logger = {
  log: (message: string) => console.log(`[${new Date().toISOString()}] LOG: ${message}`),
  warn: (message: string) => console.log(`[${new Date().toISOString()}] WARN: ${message}`),
  error: (message: string, error?: any) => {
    console.log(`[${new Date().toISOString()}] ERROR: ${message}`);
    if (error) console.error(error);
  }
};

async function resetDatabase() {
  try {
    logger.log('Starting simple database reset...');
    
    // Create Sequelize instance
    const sequelize = new Sequelize({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'whitecross',
      logging: false, // Disable SQL logging for cleaner output
      dialectOptions: {
        ssl: process.env.DB_SSL === 'true' ? {
          require: true,
          rejectUnauthorized: false,
        } : false,
        application_name: 'white-cross-db-reset-simple',
      },
    });
    
    // Test connection
    await sequelize.authenticate();
    logger.log('Database connection established');
    
    logger.warn('WARNING: About to drop all database tables!');
    logger.warn('This will destroy all existing data!');
    
    // Wait a moment for the warning to be visible
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Drop all tables using SQL
    logger.log('Dropping all tables...');
    await sequelize.query('DROP SCHEMA public CASCADE;');
    await sequelize.query('CREATE SCHEMA public;');
    await sequelize.query('GRANT ALL ON SCHEMA public TO neondb_owner;');
    await sequelize.query('GRANT ALL ON SCHEMA public TO public;');
    
    logger.log('✅ All tables dropped successfully');
    logger.log('Database schema has been reset');
    
    // Close connection
    await sequelize.close();
    
  } catch (error) {
    logger.error('❌ Database reset failed:', error);
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  resetDatabase()
    .then(() => {
      logger.log('Database reset completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Database reset script failed:', error);
      process.exit(1);
    });
}

export { resetDatabase };
