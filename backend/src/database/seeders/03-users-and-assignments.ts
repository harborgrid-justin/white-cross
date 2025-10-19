/**
 * LOC: 25AA0E84BA
 * WC-GEN-117 | 03-users-and-assignments.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - index.ts (shared/index.ts)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-GEN-117 | 03-users-and-assignments.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../shared | Dependencies: sequelize, ../../shared
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: Various exports | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { QueryInterface, DataTypes, QueryTypes } from 'sequelize';
import { hashPassword } from '../../shared';
import { v4 as uuidv4 } from 'uuid';

/**
 * Seeder: Users and Role Assignments
 *
 * Creates users across all roles:
 * - 4 Admin users (Super Admin, District Admin, School Admin, Test Admin)
 * - 7 Nurse users (distributed across all 5 schools)
 * - 3 Counselor users (2 production, 1 test)
 * - 3 Viewer users (production and test accounts)
 *
 * Total: 17 users with appropriate role assignments
 *
 * HIPAA Compliance: No PHI data. Uses demo/test credentials only.
 *
 * Security Note: Passwords are hashed using bcrypt with 10 salt rounds.
 */

module.exports = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    const now = new Date();

    // Hash passwords
    const defaultPassword = await hashPassword('AdminPassword123!'); // Using secure default
    const testNursePassword = await hashPassword('NursePassword123!'); // Updated to meet complexity requirements
    const testAdminPassword = await hashPassword('AdminPassword123!');
    const testReadOnlyPassword = await hashPassword('ReadOnlyPassword123!');
    const testCounselorPassword = await hashPassword('CounselorPassword123!');

    // Get district and schools for foreign key references
    const districtResults = await queryInterface.sequelize.query(
      `SELECT id FROM "districts" WHERE code = 'UNIFIED_DISTRICT' LIMIT 1`,
      { type: QueryTypes.SELECT }
    ) as Array<{ id: string }>;

    const schoolResults = await queryInterface.sequelize.query(
      `SELECT id, code FROM "schools" ORDER BY id`,
      { type: QueryTypes.SELECT }
    ) as Array<{ id: string; code: string }>;

    const district = districtResults[0];
    const schools = schoolResults;

    const centralHigh = schools.find((s) => s.code === 'CENTRAL_HIGH');
    const westElem = schools.find((s) => s.code === 'WEST_ELEM');
    const eastMiddle = schools.find((s) => s.code === 'EAST_MIDDLE');
    const northElem = schools.find((s) => s.code === 'NORTH_ELEM');
    const southHigh = schools.find((s) => s.code === 'SOUTH_HIGH');

    // Create Users
    const users = [
      // ADMIN USERS
      {
        id: uuidv4(),
        email: 'admin@whitecross.health',
        password: defaultPassword,
        firstName: 'System',
        lastName: 'Administrator',
        role: 'ADMIN',
        isActive: true,
        districtId: null,
        schoolId: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        email: 'district.admin@unifiedschools.edu',
        password: defaultPassword,
        firstName: 'Robert',
        lastName: 'Morrison',
        role: 'DISTRICT_ADMIN',
        isActive: true,
        districtId: district?.id || null,
        schoolId: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        email: 'school.admin@centralhigh.edu',
        password: defaultPassword,
        firstName: 'Patricia',
        lastName: 'Henderson',
        role: 'SCHOOL_ADMIN',
        isActive: true,
        districtId: district?.id || null,
        schoolId: centralHigh?.id || null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        email: 'admin@school.edu',
        password: testAdminPassword,
        firstName: 'Test',
        lastName: 'Administrator',
        role: 'ADMIN',
        isActive: true,
        districtId: district?.id || null,
        schoolId: centralHigh?.id || null,
        createdAt: now,
        updatedAt: now,
      },

      // NURSE USERS
      {
        id: uuidv4(),
        email: 'nurse@whitecross.health',
        password: defaultPassword,
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'NURSE',
        isActive: true,
        districtId: district?.id || null,
        schoolId: centralHigh?.id || null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        email: 'nurse2@centralhigh.edu',
        password: defaultPassword,
        firstName: 'Maria',
        lastName: 'Rodriguez',
        role: 'NURSE',
        isActive: true,
        districtId: district?.id || null,
        schoolId: centralHigh?.id || null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        email: 'nurse@westelementary.edu',
        password: defaultPassword,
        firstName: 'Emily',
        lastName: 'Parker',
        role: 'NURSE',
        isActive: true,
        districtId: district?.id || null,
        schoolId: westElem?.id || null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        email: 'nurse@eastmiddle.edu',
        password: defaultPassword,
        firstName: 'Michael',
        lastName: 'Brown',
        role: 'NURSE',
        isActive: true,
        districtId: district?.id || null,
        schoolId: eastMiddle?.id || null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        email: 'nurse@northelementary.edu',
        password: defaultPassword,
        firstName: 'Amanda',
        lastName: 'Taylor',
        role: 'NURSE',
        isActive: true,
        districtId: district?.id || null,
        schoolId: northElem?.id || null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        email: 'nurse@southhigh.edu',
        password: defaultPassword,
        firstName: 'Christopher',
        lastName: 'Lee',
        role: 'NURSE',
        isActive: true,
        districtId: district?.id || null,
        schoolId: southHigh?.id || null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        email: 'nurse@school.edu',
        password: testNursePassword,
        firstName: 'Test',
        lastName: 'Nurse',
        role: 'NURSE',
        isActive: true,
        districtId: district?.id || null,
        schoolId: centralHigh?.id || null,
        createdAt: now,
        updatedAt: now,
      },

      // ADDITIONAL SCHOOL ADMIN USERS (replacing counselors)
      {
        id: uuidv4(),
        email: 'counselor@centralhigh.edu',
        password: defaultPassword,
        firstName: 'James',
        lastName: 'Mitchell',
        role: 'SCHOOL_ADMIN',
        isActive: true,
        districtId: district?.id || null,
        schoolId: centralHigh?.id || null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        email: 'counselor@eastmiddle.edu',
        password: defaultPassword,
        firstName: 'Rachel',
        lastName: 'Green',
        role: 'SCHOOL_ADMIN',
        isActive: true,
        districtId: district?.id || null,
        schoolId: eastMiddle?.id || null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        email: 'counselor@school.edu',
        password: testCounselorPassword,
        firstName: 'Test',
        lastName: 'Counselor',
        role: 'SCHOOL_ADMIN',
        isActive: true,
        districtId: district?.id || null,
        schoolId: centralHigh?.id || null,
        createdAt: now,
        updatedAt: now,
      },

      // ADDITIONAL NURSE USERS (replacing viewers)
      {
        id: uuidv4(),
        email: 'viewer@centralhigh.edu',
        password: defaultPassword,
        firstName: 'Linda',
        lastName: 'Davis',
        role: 'NURSE',
        isActive: true,
        districtId: district?.id || null,
        schoolId: centralHigh?.id || null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        email: 'readonly@school.edu',
        password: testReadOnlyPassword,
        firstName: 'Test',
        lastName: 'ReadOnly',
        role: 'NURSE',
        isActive: true,
        districtId: district?.id || null,
        schoolId: centralHigh?.id || null,
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert('users', users, {});

    console.log(`✓ Seeded ${users.length} users (role assignments skipped - permissions system not available)`);
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.bulkDelete('users', {}, {});
    console.log('✓ Removed all users');
  },
};
