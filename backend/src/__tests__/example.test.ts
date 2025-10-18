/**
 * WC-GEN-367 | example.test.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ./helpers/testDatabase, ../database/services/sequelize.service | Dependencies: ./helpers/testDatabase, ../database/services/sequelize.service
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: Various exports | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Example Test File
 *
 * Demonstrates how to write tests using Sequelize with the test helpers.
 * This file shows best practices for test isolation and database management.
 */

import {
  clearDatabase,
  createTestUser,
  createTestStudent,
  countRecords,
  assertRecordCount,
  ensureTestDatabase,
} from './helpers/testDatabase';
import sequelize from '../database/services/sequelize.service';

describe('Example Test Suite', () => {
  // Verify we're using test database
  beforeAll(() => {
    ensureTestDatabase();
  });

  // Clean up after each test for isolation
  afterEach(async () => {
    await clearDatabase();
  });

  describe('User Management', () => {
    it('should create a test user', async () => {
      const user = await createTestUser({
        email: 'testuser@example.com',
        role: 'NURSE',
      });

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.email).toBe('testuser@example.com');
      expect(user.role).toBe('NURSE');

      // Verify in database
      const count = await countRecords('Users');
      expect(count).toBe(1);
    });

    it('should create multiple users', async () => {
      await createTestUser({ role: 'ADMIN' });
      await createTestUser({ role: 'NURSE' });
      await createTestUser({ role: 'COUNSELOR' });

      await assertRecordCount('Users', 3);
    });
  });

  describe('Student Management', () => {
    it('should create a test student', async () => {
      const student = await createTestStudent({
        firstName: 'John',
        lastName: 'Doe',
        grade: '5th Grade',
      });

      expect(student).toBeDefined();
      expect(student.id).toBeDefined();
      expect(student.firstName).toBe('John');
      expect(student.lastName).toBe('Doe');

      // Verify in database
      const count = await countRecords('Students');
      expect(count).toBe(1);
    });

    it('should automatically create nurse for student', async () => {
      const student = await createTestStudent();

      expect(student.nurseId).toBeDefined();

      // Verify nurse exists
      const nurses = await sequelize.query(
        'SELECT * FROM "Users" WHERE id = :nurseId',
        {
          replacements: { nurseId: student.nurseId },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      expect(nurses).toHaveLength(1);
    });
  });

  describe('Database Operations', () => {
    it('should clear database', async () => {
      // Create some data
      await createTestUser();
      await createTestStudent();

      // Verify data exists
      let userCount = await countRecords('Users');
      let studentCount = await countRecords('Students');
      expect(userCount).toBeGreaterThan(0);
      expect(studentCount).toBeGreaterThan(0);

      // Clear database
      await clearDatabase();

      // Verify data is gone
      userCount = await countRecords('Users');
      studentCount = await countRecords('Students');
      expect(userCount).toBe(0);
      expect(studentCount).toBe(0);
    });

    it('should count records correctly', async () => {
      await createTestUser();
      await createTestUser();
      await createTestUser();

      const count = await countRecords('Users');
      expect(count).toBe(3);
    });

    it('should assert record count', async () => {
      await createTestStudent();
      await createTestStudent();

      // This should not throw
      await assertRecordCount('Students', 2);

      // This should throw
      await expect(assertRecordCount('Students', 5)).rejects.toThrow();
    });
  });

  describe('Test Isolation', () => {
    it('first test creates data', async () => {
      await createTestUser();
      await assertRecordCount('Users', 1);
    });

    it('second test should not see data from first test', async () => {
      // Because afterEach clears the database, this should be 0
      const count = await countRecords('Users');
      expect(count).toBe(0);
    });
  });
});
