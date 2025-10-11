/**
 * DATABASE RESET SCRIPT
 *
 * This script clears all data from the database and re-seeds it with fresh data.
 * Use this for development and testing purposes only.
 *
 * DANGER: This will delete ALL data in the database!
 *
 * Usage:
 *   npm run db:reset
 *   or
 *   npx ts-node prisma/reset-database.ts
 */

import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as readline from 'readline';

const execAsync = promisify(exec);
const prisma = new PrismaClient();

// Create readline interface for user confirmation
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

async function clearDatabase() {
  console.log('\n🗑️  Clearing database tables...\n');

  try {
    // Disable foreign key checks temporarily (for PostgreSQL)
    await prisma.$executeRawUnsafe('SET session_replication_role = replica;');

    // Delete in order of dependencies (child tables first)
    const tables = [
      // Health Records Related
      'vital_signs',
      'growth_measurements',
      'screenings',
      'vaccinations',
      'chronic_conditions',
      'allergies',
      'health_records',

      // Appointments
      'appointment_reminders',
      'appointment_waitlist',
      'appointments',
      'nurse_availability',

      // Incidents
      'follow_up_actions',
      'witness_statements',
      'incident_reports',

      // Medications
      'medication_logs',
      'student_medications',
      'medication_inventory',
      'medications',

      // Inventory
      'purchase_order_items',
      'purchase_orders',
      'vendors',
      'budget_transactions',
      'budget_categories',
      'maintenance_logs',
      'inventory_transactions',
      'inventory_items',

      // Communication
      'message_deliveries',
      'messages',
      'message_templates',

      // Documents
      'document_audit_trail',
      'document_signatures',
      'documents',

      // Compliance
      'compliance_checklist_items',
      'compliance_reports',
      'consent_signatures',
      'consent_forms',
      'policy_acknowledgments',
      'policy_documents',

      // Training
      'training_completions',
      'training_modules',

      // Integration
      'integration_logs',
      'integration_configs',

      // Security
      'login_attempts',
      'sessions',
      'security_incidents',
      'ip_restrictions',
      'audit_logs',

      // Administration
      'configuration_history',
      'system_configurations',
      'backup_logs',
      'performance_metrics',
      'licenses',

      // Students
      'emergency_contacts',
      'students',

      // Access Control
      'user_role_assignments',
      'role_permissions',
      'permissions',
      'roles',

      // Users and Organizations
      'users',
      'schools',
      'districts',
    ];

    let deletedCount = 0;

    for (const table of tables) {
      try {
        const result = await prisma.$executeRawUnsafe(`DELETE FROM "${table}"`);
        console.log(`   ✓ Cleared ${table}`);
        deletedCount++;
      } catch (error: any) {
        // Table might not exist or already be empty
        if (!error.message.includes('does not exist')) {
          console.log(`   ⚠ Warning clearing ${table}: ${error.message}`);
        }
      }
    }

    // Re-enable foreign key checks
    await prisma.$executeRawUnsafe('SET session_replication_role = DEFAULT;');

    console.log(`\n   ✓ Successfully cleared ${deletedCount} tables\n`);
  } catch (error) {
    console.error('\n❌ Error clearing database:', error);
    throw error;
  }
}

async function runMigrations() {
  console.log('🔄 Running database migrations...\n');

  try {
    const { stdout, stderr } = await execAsync('npx prisma migrate deploy', {
      cwd: process.cwd(),
    });

    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);

    console.log('   ✓ Migrations completed\n');
  } catch (error: any) {
    console.error('\n❌ Error running migrations:', error.message);
    throw error;
  }
}

async function runSeeds() {
  console.log('🌱 Running database seeds...\n');

  try {
    // Run base seed
    console.log('   Running base seed...');
    const { stdout: stdout1, stderr: stderr1 } = await execAsync('npx ts-node prisma/seed.ts', {
      cwd: process.cwd(),
    });

    if (stderr1) console.error(stderr1);

    console.log('\n   ✓ Base seed completed\n');

    // Ask if user wants to run enhanced seed
    const runEnhanced = await question('   Run enhanced seed (vaccinations, screenings, etc.)? (y/N): ');

    if (runEnhanced.toLowerCase() === 'y') {
      console.log('\n   Running enhanced seed...');
      const { stdout: stdout2, stderr: stderr2 } = await execAsync(
        'npx ts-node prisma/seed.enhanced.ts',
        {
          cwd: process.cwd(),
        }
      );

      if (stderr2) console.error(stderr2);

      console.log('\n   ✓ Enhanced seed completed\n');
    }
  } catch (error: any) {
    console.error('\n❌ Error running seeds:', error.message);
    throw error;
  }
}

async function main() {
  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║              DATABASE RESET & RE-SEED UTILITY                 ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  console.log('⚠️  WARNING: This will DELETE ALL data in your database!\n');
  console.log('This operation will:');
  console.log('  1. Clear all existing data from all tables');
  console.log('  2. Run database migrations');
  console.log('  3. Re-seed the database with fresh data\n');

  const answer = await question('Are you sure you want to continue? (yes/NO): ');

  if (answer.toLowerCase() !== 'yes') {
    console.log('\n❌ Operation cancelled.\n');
    rl.close();
    process.exit(0);
  }

  const startTime = Date.now();

  try {
    // Step 1: Clear database
    await clearDatabase();

    // Step 2: Run migrations
    await runMigrations();

    // Step 3: Run seeds
    await runSeeds();

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('\n✅ Database reset and re-seed completed successfully!\n');
    console.log(`⏱️  Total time: ${duration} seconds\n');
    console.log('═══════════════════════════════════════════════════════════════\n');
  } catch (error) {
    console.error('\n❌ Database reset failed:', error);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', async () => {
  console.log('\n\n⚠️  Operation cancelled by user.\n');
  rl.close();
  await prisma.$disconnect();
  process.exit(0);
});

main();
