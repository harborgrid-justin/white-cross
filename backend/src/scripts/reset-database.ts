#!/usr/bin/env ts-node

/**
 * Database Reset Script
 * 
 * This script resets the database by dropping all tables and recreating them
 * based on the current Sequelize model definitions. This bypasses migration
 * issues by using the models as the source of truth.
 * 
 * Usage:
 * npm run db:reset
 * 
 * WARNING: This will destroy all existing data!
 */

import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';

// Load environment variables
dotenv.config();

const logger = new Logger('DatabaseReset');

async function resetDatabase() {
  const configService = new ConfigService();
  
  try {
    logger.log('Starting database reset...');
    
    // Create Sequelize instance using same configuration as the app
    const databaseUrl = configService.get<string>('DATABASE_URL');
    const isProduction = configService.get<string>('NODE_ENV') === 'production';
    
    let sequelize: Sequelize;
    
    if (databaseUrl) {
      // Use DATABASE_URL if provided
      sequelize = new Sequelize(databaseUrl, {
        dialect: 'postgres',
        logging: (sql: string) => {
          logger.debug(`SQL: ${sql.substring(0, 100)}${sql.length > 100 ? '...' : ''}`);
        },
        models: [__dirname + '/../database/models/*.model.ts'],
        dialectOptions: {
          ...(databaseUrl.includes('sslmode=require')
            ? {
                ssl: {
                  require: true,
                  rejectUnauthorized: isProduction,
                },
              }
            : {}),
          application_name: 'white-cross-db-reset',
        },
      });
    } else {
      // Use individual connection parameters
      const sslEnabled = configService.get<boolean>('DB_SSL', false);
      
      sequelize = new Sequelize({
        dialect: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME', 'whitecross'),
        logging: (sql: string) => {
          logger.debug(`SQL: ${sql.substring(0, 100)}${sql.length > 100 ? '...' : ''}`);
        },
        models: [__dirname + '/../database/models/*.model.ts'],
        dialectOptions: {
          ...(sslEnabled
            ? {
                ssl: {
                  require: true,
                  rejectUnauthorized: isProduction,
                },
              }
            : {}),
          application_name: 'white-cross-db-reset',
        },
      });
    }
    
    // Test connection
    await sequelize.authenticate();
    logger.log('Database connection established successfully');
    
    // Models are already loaded via the models option
    logger.log(`Loaded ${sequelize.models ? Object.keys(sequelize.models).length : 0} models`);
    
    logger.warn('WARNING: About to drop and recreate all database tables!');
    logger.warn('This will destroy all existing data!');
    
    // Wait a moment for the warning to be visible
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Force sync - this will drop and recreate all tables
    logger.log('Dropping all existing tables...');
    await sequelize.sync({ force: true });
    
    logger.log('✅ Database reset completed successfully!');
    logger.log('All tables have been recreated based on current model definitions');
    
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
      logger.log('Database reset script completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Database reset script failed:', error);
      process.exit(1);
    });
}

export { resetDatabase };
