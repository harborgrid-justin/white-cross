/**
 * Database Synchronization Script
 * Creates all database tables based on Sequelize models
 */
const { Sequelize } = require('sequelize');
const path = require('path');

// Load environment variables
require('dotenv').config();

async function syncDatabase() {
  console.log('🔄 Starting database synchronization...');
  
  try {
    // Create Sequelize instance with the same configuration as the app
    const databaseUrl = process.env.DATABASE_URL;
    let sequelize;
    
    if (databaseUrl) {
      // Use DATABASE_URL if provided (for cloud deployments)
      sequelize = new Sequelize(databaseUrl, {
        dialect: 'postgres',
        logging: console.log,
        dialectOptions: databaseUrl.includes('sslmode=require') ? {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        } : {},
      });
    } else {
      // Use individual connection parameters for local development
      sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 5432,
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'whitecross',
        logging: console.log,
      });
    }

    // Test the connection
    console.log('🔗 Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Add all models from the database module
    const { User } = require('./dist/database/models/user.model');
    const { Student } = require('./dist/database/models/student.model');
    const { Contact } = require('./dist/database/models/contact.model');
    const { District } = require('./dist/database/models/district.model');
    const { School } = require('./dist/database/models/school.model');
    const { EmergencyContact } = require('./dist/database/models/emergency-contact.model');
    const { AuditLog } = require('./dist/database/models/audit-log.model');
    
    // Add models to sequelize instance
    const models = [
      User,
      Student,
      Contact,
      District,
      School,
      EmergencyContact,
      AuditLog,
      // Add other models as needed
    ];

    models.forEach(model => {
      if (model) {
        sequelize.addModels([model]);
      }
    });

    // Sync all models (create tables)
    console.log('📋 Synchronizing database schema...');
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Database synchronization completed successfully!');

    // Close the connection
    await sequelize.close();
    console.log('🔐 Database connection closed.');
    
  } catch (error) {
    console.error('❌ Database synchronization failed:', error);
    process.exit(1);
  }
}

// Run the sync
syncDatabase();
