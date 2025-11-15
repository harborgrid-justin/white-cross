#!/usr/bin/env node

/**
 * Direct User Creation Script
 * Creates users directly using Sequelize without NestJS dependencies
 */

const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

// Load environment variables
require('dotenv').config();

// User data to create
const USERS_TO_CREATE = [
  {
    email: 'admin@whitecross.health',
    password: 'Admin!123',
    firstName: 'System',
    lastName: 'Administrator',
    role: 'ADMIN'
  },
  {
    email: 'nurse@whitecross.health',
    password: 'Nurse!123',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'NURSE'
  },
  {
    email: 'school.admin@whitecross.health',
    password: 'SchoolAdmin!123',
    firstName: 'Michael',
    lastName: 'Brown',
    role: 'SCHOOL_ADMIN'
  },
  {
    email: 'district.admin@whitecross.health',
    password: 'DistrictAdmin!123',
    firstName: 'Jennifer',
    lastName: 'Davis',
    role: 'DISTRICT_ADMIN'
  },
  {
    email: 'counselor@whitecross.health',
    password: 'Counselor!123',
    firstName: 'Lisa',
    lastName: 'Wilson',
    role: 'COUNSELOR'
  },
  {
    email: 'viewer@whitecross.health',
    password: 'Viewer!123',
    firstName: 'Robert',
    lastName: 'Garcia',
    role: 'VIEWER'
  }
];

async function createUsersDirectly() {
  console.log('🚀 Creating users directly with Sequelize...\n');

  // Create Sequelize connection
  const sequelize = new Sequelize(
    process.env.DB_NAME || 'production',
    process.env.DB_USERNAME || 'neondb_owner',
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      dialect: 'postgres',
      dialectOptions: {
        ssl: process.env.DB_HOST && process.env.DB_HOST !== 'localhost' ? {
          require: true,
          rejectUnauthorized: false
        } : false
      },
      logging: false
    }
  );

  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    const saltRounds = 12;
    let created = 0;
    let updated = 0;

    for (const userData of USERS_TO_CREATE) {
      try {
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

        // Use raw SQL to insert/update user
        const [results] = await sequelize.query(`
          INSERT INTO users (
            id, 
            email, 
            password, 
            "firstName", 
            "lastName", 
            role, 
            "isActive", 
            "emailVerified", 
            "isEmailVerified",
            "mustChangePassword", 
            "failedLoginAttempts", 
            "twoFactorEnabled",
            "mfaEnabled",
            "createdAt", 
            "updatedAt"
          ) VALUES (
            :id,
            :email,
            :password,
            :firstName,
            :lastName,
            :role,
            true,
            true,
            true,
            false,
            0,
            false,
            false,
            NOW(),
            NOW()
          ) ON CONFLICT (email) DO UPDATE SET
            password = EXCLUDED.password,
            "firstName" = EXCLUDED."firstName",
            "lastName" = EXCLUDED."lastName",
            role = EXCLUDED.role,
            "isActive" = true,
            "emailVerified" = true,
            "isEmailVerified" = true,
            "mustChangePassword" = false,
            "failedLoginAttempts" = 0,
            "updatedAt" = NOW()
          RETURNING id, email, 
          (CASE WHEN "createdAt" = "updatedAt" THEN true ELSE false END) as was_created
        `, {
          replacements: {
            id: uuidv4(),
            email: userData.email,
            password: hashedPassword,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role
          },
          type: sequelize.QueryTypes.SELECT
        });

        const result = results[0];
        if (result.was_created) {
          console.log(`➕ Created: ${userData.email} (${userData.role})`);
          created++;
        } else {
          console.log(`📝 Updated: ${userData.email} (${userData.role})`);
          updated++;
        }

      } catch (error) {
        console.error(`❌ Error with user ${userData.email}:`, error.message);
      }
    }

    // Get total user count
    const [countResult] = await sequelize.query(
      'SELECT COUNT(*) as count FROM users',
      { type: sequelize.QueryTypes.SELECT }
    );
    
    console.log(`\n🎉 User creation completed!`);
    console.log(`   Created: ${created} users`);
    console.log(`   Updated: ${updated} users`);
    console.log(`   Total users in database: ${countResult.count}`);

    console.log('\n📋 Login Credentials:');
    USERS_TO_CREATE.forEach(user => {
      const roleDisplay = user.role.replace('_', ' ').toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      console.log(`   ${roleDisplay.padEnd(16)}: ${user.email} / ${user.password}`);
    });

    console.log('\n🌐 Application URLs:');
    console.log('   Frontend: http://localhost:5173');
    console.log('   Backend:  http://localhost:3001');
    console.log('   API Docs: http://localhost:3001/api/docs');

  } catch (error) {
    console.error('\n💥 Error:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
    console.log('\n👋 Database connection closed');
  }
}

// Run if called directly
if (require.main === module) {
  createUsersDirectly().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { createUsersDirectly };