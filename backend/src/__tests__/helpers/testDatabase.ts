/**
 * Test Database Helper Utilities
 *
 * Provides utilities for test database setup, teardown, and data management.
 * Ensures tests run in isolation with clean, predictable data.
 *
 * HIPAA Compliance: All test data must be de-identified and synthetic.
 */

import sequelize from '../../database/services/sequelize.service';
import { QueryInterface } from 'sequelize';

/**
 * Clears all data from the database while preserving table structure
 * Useful for resetting state between tests
 */
export async function clearDatabase(): Promise<void> {
  const queryInterface: QueryInterface = sequelize.getQueryInterface();

  // Disable foreign key checks temporarily
  await sequelize.query('SET CONSTRAINTS ALL DEFERRED');

  // Get all table names
  const tables = await queryInterface.showAllTables();

  // Filter out Sequelize meta tables
  const tablesToClear = tables.filter(
    (table) => !['SequelizeMeta', 'SequelizeData'].includes(table)
  );

  // Clear all tables
  for (const table of tablesToClear) {
    await queryInterface.bulkDelete(table, {}, {});
  }

  console.log(`Cleared ${tablesToClear.length} tables`);
}

/**
 * Drops and recreates all tables
 * Use with caution - this is destructive
 */
export async function resetDatabase(): Promise<void> {
  await sequelize.sync({ force: true });
  console.log('Database reset complete - all tables dropped and recreated');
}

/**
 * Runs all seeders in correct order
 * Useful for setting up a complete test environment
 */
export async function seedTestDatabase(): Promise<void> {
  const seederPath = '../../database/seeders';

  // Import and run seeders in correct order
  const seeders = [
    '01-districts-and-schools',
    '02-permissions-and-roles',
    '03-users-and-assignments',
    '04-medications-and-inventory',
    '05-students',
    '06-emergency-contacts',
    '07-health-data',
    '08-appointments-and-incidents',
    '09-nurse-availability-and-system-config',
  ];

  for (const seederName of seeders) {
    try {
      const seeder = require(`${seederPath}/${seederName}`);
      await seeder.up(sequelize.getQueryInterface());
      console.log(`Seeded: ${seederName}`);
    } catch (error) {
      console.error(`Failed to run seeder ${seederName}:`, error);
      throw error;
    }
  }
}

/**
 * Runs specific seeders by name
 * @param seederNames Array of seeder names (without .ts extension)
 */
export async function seedSpecific(seederNames: string[]): Promise<void> {
  const seederPath = '../../database/seeders';

  for (const seederName of seederNames) {
    try {
      const seeder = require(`${seederPath}/${seederName}`);
      await seeder.up(sequelize.getQueryInterface());
      console.log(`Seeded: ${seederName}`);
    } catch (error) {
      console.error(`Failed to run seeder ${seederName}:`, error);
      throw error;
    }
  }
}

/**
 * Verifies test database is being used
 * Throws error if production database is detected
 */
export function ensureTestDatabase(): void {
  const dbName = sequelize.config.database;

  if (!dbName?.includes('test') && process.env.NODE_ENV !== 'test') {
    throw new Error(
      `DANGER: Not using test database! Current database: ${dbName}. ` +
        'Tests must run against test database only. Set NODE_ENV=test'
    );
  }
}

/**
 * Creates a transaction for test isolation
 * Use with afterEach to rollback changes
 */
export async function createTestTransaction() {
  return await sequelize.transaction();
}

/**
 * Counts records in a table
 * Useful for assertions
 */
export async function countRecords(tableName: string): Promise<number> {
  const result = await sequelize.query(
    `SELECT COUNT(*) as count FROM "${tableName}"`,
    { type: sequelize.QueryTypes.SELECT }
  );
  return parseInt((result[0] as any).count, 10);
}

/**
 * Gets record by ID from any table
 */
export async function getRecordById(
  tableName: string,
  id: number
): Promise<any> {
  const result = await sequelize.query(
    `SELECT * FROM "${tableName}" WHERE id = :id LIMIT 1`,
    {
      replacements: { id },
      type: sequelize.QueryTypes.SELECT,
    }
  );
  return result[0];
}

/**
 * Test Data Factory: Creates a test user
 */
export async function createTestUser(overrides: any = {}) {
  const bcrypt = require('bcryptjs');
  const defaultPassword = await bcrypt.hash('testPassword123', 10);

  const userData = {
    email: `test-${Date.now()}@test.com`,
    password: defaultPassword,
    firstName: 'Test',
    lastName: 'User',
    role: 'NURSE',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };

  const [userId] = await sequelize.query(
    `INSERT INTO "Users"
      (email, password, "firstName", "lastName", role, "isActive", "createdAt", "updatedAt")
    VALUES
      (:email, :password, :firstName, :lastName, :role, :isActive, :createdAt, :updatedAt)
    RETURNING id`,
    {
      replacements: userData,
      type: sequelize.QueryTypes.INSERT,
    }
  );

  return { ...userData, id: (userId[0] as any).id };
}

/**
 * Test Data Factory: Creates a test student
 */
export async function createTestStudent(overrides: any = {}) {
  // First, ensure there's a nurse to assign
  const nurses = await sequelize.query(
    `SELECT id FROM "Users" WHERE role = 'NURSE' LIMIT 1`,
    { type: sequelize.QueryTypes.SELECT }
  );

  let nurseId = (nurses[0] as any)?.id;

  if (!nurseId) {
    const testNurse = await createTestUser({ role: 'NURSE' });
    nurseId = testNurse.id;
  }

  const studentData = {
    studentNumber: `TEST${Date.now()}`,
    firstName: 'Test',
    lastName: 'Student',
    dateOfBirth: new Date('2010-01-01'),
    grade: '6th Grade',
    gender: 'MALE',
    medicalRecordNum: `MRTEST${Date.now()}`,
    nurseId,
    enrollmentDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };

  const [studentId] = await sequelize.query(
    `INSERT INTO "Students"
      ("studentNumber", "firstName", "lastName", "dateOfBirth", grade, gender,
       "medicalRecordNum", "nurseId", "enrollmentDate", "createdAt", "updatedAt")
    VALUES
      (:studentNumber, :firstName, :lastName, :dateOfBirth, :grade, :gender,
       :medicalRecordNum, :nurseId, :enrollmentDate, :createdAt, :updatedAt)
    RETURNING id`,
    {
      replacements: studentData,
      type: sequelize.QueryTypes.INSERT,
    }
  );

  return { ...studentData, id: (studentId[0] as any).id };
}

/**
 * Assertion Helper: Verifies table has expected record count
 */
export async function assertRecordCount(
  tableName: string,
  expectedCount: number
): Promise<void> {
  const count = await countRecords(tableName);
  if (count !== expectedCount) {
    throw new Error(
      `Expected ${expectedCount} records in ${tableName}, but found ${count}`
    );
  }
}
