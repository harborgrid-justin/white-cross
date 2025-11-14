#!/usr/bin/env node

/**
 * Database Reset Script
 * Drops all tables and recreates them from current model definitions
 */

const { Sequelize } = require('sequelize');
require('dotenv').config();

async function resetDatabase() {
  console.log('🔄 Starting database reset...');

  // Create Sequelize instance using connection string like the app does
  const databaseUrl = `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?sslmode=require`;

  const sequelize = new Sequelize(databaseUrl, {
    logging: false,
  });

  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    // Get all table names
    const [results] = await sequelize.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      AND tablename NOT LIKE 'pg_%'
      AND tablename NOT LIKE 'sql_%'
    `);

    const tables = results.map(row => row.tablename);
    console.log(`📋 Found ${tables.length} tables:`, tables.join(', '));

    // Drop all tables
    console.log('🗑️  Dropping all tables...');
    await sequelize.drop({ cascade: true });
    console.log('✅ All tables dropped');

    // Close connection
    await sequelize.close();
    console.log('🔌 Database connection closed');

    console.log('🎉 Database reset complete!');
    console.log('💡 Now restart your application to recreate tables from models');

  } catch (error) {
    console.error('❌ Database reset failed:', error);
    process.exit(1);
  }
}

resetDatabase();
