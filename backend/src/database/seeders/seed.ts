#!/usr/bin/env ts-node

/**
 * Master Seeder Runner for Sequelize
 *
 * Runs all seeders in the correct dependency order.
 * Use this script to populate the database with comprehensive demo data.
 *
 * Usage:
 *   npm run seed              - Run all seeders
 *   npm run seed:dev          - Alias for npm run seed
 *   npm run seed:test         - Run seeders in test database
 *   npm run seed:undo         - Undo last seeder
 *   npm run seed:undo:all     - Undo all seeders
 *
 * For production-like data, use the Prisma seed (npm run seed:prisma)
 * which creates 500 students with full relationships.
 */

import sequelize from '../services/sequelize.service';
import { QueryInterface, QueryTypes } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Seeder configuration
const SEEDERS = [
  {
    name: '01-districts-and-schools',
    description: 'Districts and Schools',
    records: '1 district, 5 schools',
  },
  {
    name: '02-permissions-and-roles',
    description: 'Permissions and Roles',
    records: '22 permissions, 4 roles',
  },
  {
    name: '03-users-and-assignments',
    description: 'Users and Role Assignments',
    records: '17 users with role assignments',
  },
  {
    name: '04-medications-and-inventory',
    description: 'Medications and Inventory',
    records: '12 medications with inventory',
  },
  {
    name: '05-students',
    description: 'Students',
    records: '500 students',
  },
  {
    name: '06-emergency-contacts',
    description: 'Emergency Contacts',
    records: '1000 contacts (2 per student)',
  },
  {
    name: '07-health-data',
    description: 'Health Records, Allergies, Conditions',
    records: '~1000 health records, ~100 allergies, ~50 conditions',
  },
  {
    name: '08-appointments-and-incidents',
    description: 'Appointments and Incidents',
    records: '~75 appointments, ~25 incidents',
  },
  {
    name: '09-nurse-availability-and-system-config',
    description: 'Nurse Availability and System Config',
    records: '~35 availability slots, 29 configurations',
  },
];

/**
 * Runs all seeders in order
 */
async function runAllSeeders(): Promise<void> {
  console.log('\n========================================');
  console.log('  WHITE CROSS - DATABASE SEEDER');
  console.log('========================================\n');

  const queryInterface: QueryInterface = sequelize.getQueryInterface();
  const startTime = Date.now();

  // Verify database connection
  try {
    await sequelize.authenticate();
    const dbName = sequelize.config.database;
    console.log(`Connected to database: ${dbName}\n`);

    // Safety check for production
    if (
      process.env.NODE_ENV === 'production' &&
      !process.env.ALLOW_SEED_IN_PRODUCTION
    ) {
      throw new Error(
        'Seeding is disabled in production. Set ALLOW_SEED_IN_PRODUCTION=true to override.'
      );
    }
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }

  // Run each seeder
  let successCount = 0;
  let failedCount = 0;

  for (const seeder of SEEDERS) {
    try {
      console.log(`\n[${successCount + 1}/${SEEDERS.length}] ${seeder.description}`);
      console.log(`  Records: ${seeder.records}`);
      console.log(`  Running...`);

      const seederModule = require(`./${seeder.name}`);
      await seederModule.up(queryInterface);

      successCount++;
      console.log(`  ✓ Success`);
    } catch (error) {
      failedCount++;
      console.error(`  ✗ Failed:`, error);

      // Decide whether to continue or stop
      if (process.env.SEED_CONTINUE_ON_ERROR !== 'true') {
        console.error('\nSeeding stopped due to error.');
        process.exit(1);
      }
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('\n========================================');
  console.log('  SEEDING SUMMARY');
  console.log('========================================');
  console.log(`\nSuccess: ${successCount}/${SEEDERS.length} seeders`);
  if (failedCount > 0) {
    console.log(`Failed: ${failedCount}/${SEEDERS.length} seeders`);
  }
  console.log(`Duration: ${duration}s`);

  console.log('\n========================================');
  console.log('  DATABASE CONTENTS');
  console.log('========================================\n');

  // Show record counts
  const tables = [
    'Districts',
    'Schools',
    'Users',
    'Roles',
    'Permissions',
    'Students',
    'EmergencyContacts',
    'Medications',
    'MedicationInventories',
    'HealthRecords',
    'Allergies',
    'ChronicConditions',
    'Appointments',
    'IncidentReports',
    'NurseAvailabilities',
    'SystemConfigurations',
  ];

  for (const table of tables) {
    try {
      const result = await sequelize.query(
        `SELECT COUNT(*) as count FROM "${table}"`,
        { type: QueryTypes.SELECT }
      );
      const count = (result[0] as any).count;
      console.log(`  ${table.padEnd(30)} ${count} records`);
    } catch (error) {
      console.log(`  ${table.padEnd(30)} (table not found)`);
    }
  }

  console.log('\n========================================');
  console.log('  LOGIN CREDENTIALS');
  console.log('========================================\n');

  console.log('Production Accounts:');
  console.log('  Admin: admin@whitecross.health / admin123');
  console.log('  Nurse: nurse@whitecross.health / admin123\n');

  console.log('Test Accounts (for Cypress):');
  console.log('  Admin: admin@school.edu / AdminPassword123!');
  console.log('  Nurse: nurse@school.edu / testNursePassword');
  console.log('  Counselor: counselor@school.edu / CounselorPassword123!');
  console.log('  ReadOnly: readonly@school.edu / ReadOnlyPassword123!');

  console.log('\n========================================\n');
}

/**
 * Undoes all seeders in reverse order
 */
async function undoAllSeeders(): Promise<void> {
  console.log('\nUndoing all seeders...\n');

  const queryInterface: QueryInterface = sequelize.getQueryInterface();
  const reversedSeeders = [...SEEDERS].reverse();

  for (const seeder of reversedSeeders) {
    try {
      console.log(`Undoing: ${seeder.description}`);
      const seederModule = require(`./${seeder.name}`);
      await seederModule.down(queryInterface);
      console.log(`  ✓ Success`);
    } catch (error) {
      console.error(`  ✗ Failed:`, error);
    }
  }

  console.log('\nAll seeders undone.\n');
}

// Main execution
async function main() {
  const command = process.argv[2] || 'up';

  try {
    if (command === 'up' || command === 'run') {
      await runAllSeeders();
    } else if (command === 'down' || command === 'undo') {
      await undoAllSeeders();
    } else {
      console.log('Usage:');
      console.log('  ts-node seed.ts [up|down]');
      console.log('  ts-node seed.ts up    - Run all seeders');
      console.log('  ts-node seed.ts down  - Undo all seeders');
    }
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { runAllSeeders, undoAllSeeders };
