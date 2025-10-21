#!/usr/bin/env node

/**
 * Database Connection Test Script
 * 
 * This script tests the database connection using the provided credentials
 * and provides helpful error messages and debugging information.
 */

require('dotenv').config();
const { Sequelize } = require('sequelize');

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL environment variable is not set');
  console.error('');
  console.error('Please create a .env file in the backend directory with:');
  console.error('DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require');
  process.exit(1);
}

console.log('🔍 Testing database connection...');
console.log('');
console.log('Connection details:');
console.log('-------------------');

// Parse the connection string to show details (without showing password)
try {
  const url = new URL(DATABASE_URL);
  console.log(`Host:     ${url.hostname}`);
  console.log(`Port:     ${url.port || 5432}`);
  console.log(`Database: ${url.pathname.substring(1).split('?')[0]}`);
  console.log(`Username: ${url.username}`);
  console.log(`Password: ${'*'.repeat(url.password.length)}`);
  console.log(`SSL Mode: ${url.searchParams.get('sslmode') || 'not specified'}`);
  console.log('');
} catch (error) {
  console.error('❌ Invalid DATABASE_URL format');
  console.error('Expected format: postgresql://username:password@host:port/database');
  process.exit(1);
}

// Create Sequelize instance with SSL support
const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});

async function testConnection() {
  try {
    console.log('⏳ Attempting to connect to database...');
    await sequelize.authenticate();
    console.log('');
    console.log('✅ SUCCESS: Database connection established!');
    console.log('');
    
    // Try to get some basic info
    const [results] = await sequelize.query(`
      SELECT 
        current_database() as database,
        current_user as user,
        version() as version
    `);
    
    console.log('Database Information:');
    console.log('--------------------');
    console.log(`Current Database: ${results[0].database}`);
    console.log(`Current User:     ${results[0].user}`);
    console.log(`PostgreSQL:       ${results[0].version.split(',')[0]}`);
    console.log('');
    
    // List tables
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    if (tables.length > 0) {
      console.log(`Found ${tables.length} table(s) in the database:`);
      tables.forEach(table => {
        console.log(`  - ${table.table_name}`);
      });
    } else {
      console.log('⚠️  No tables found in the database');
      console.log('   You may need to run migrations to create the schema');
    }
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.log('');
    console.error('❌ FAILED: Unable to connect to database');
    console.error('');
    console.error('Error details:');
    console.error('-------------');
    console.error(`Type:    ${error.name}`);
    console.error(`Message: ${error.message}`);
    console.error('');
    
    if (error.message.includes('password authentication failed')) {
      console.error('💡 Troubleshooting tips:');
      console.error('   1. Verify the username and password are correct');
      console.error('   2. Check if the database user exists');
      console.error('   3. Ensure the user has proper permissions');
      console.error('   4. If using Neon.tech, verify the connection string in the dashboard');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.error('💡 Troubleshooting tips:');
      console.error('   1. Check if the hostname is correct');
      console.error('   2. Verify the database server is running');
      console.error('   3. Check your network connection');
      console.error('   4. Ensure firewall rules allow the connection');
    } else if (error.message.includes('SSL')) {
      console.error('💡 Troubleshooting tips:');
      console.error('   1. Ensure sslmode=require is in the connection string');
      console.error('   2. The database server may not support SSL');
      console.error('   3. Try adding ?sslmode=require to the connection string');
    }
    
    await sequelize.close();
    process.exit(1);
  }
}

testConnection();
