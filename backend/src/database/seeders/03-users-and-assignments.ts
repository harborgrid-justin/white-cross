import { QueryInterface } from 'sequelize';
import bcrypt from 'bcryptjs';

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
    const defaultPassword = await bcrypt.hash('admin123', 10);
    const testNursePassword = await bcrypt.hash('testNursePassword', 10);
    const testAdminPassword = await bcrypt.hash('AdminPassword123!', 10);
    const testReadOnlyPassword = await bcrypt.hash('ReadOnlyPassword123!', 10);
    const testCounselorPassword = await bcrypt.hash('CounselorPassword123!', 10);

    // Get district and schools for foreign key references
    const [district] = await queryInterface.sequelize.query(
      `SELECT id FROM "Districts" WHERE code = 'UNIFIED_DISTRICT' LIMIT 1`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    ) as Array<{ id: number }>;

    const schools = await queryInterface.sequelize.query(
      `SELECT id, code FROM "Schools" ORDER BY id`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    ) as Array<{ id: number; code: string }>;

    const centralHigh = schools.find((s) => s.code === 'CENTRAL_HIGH');
    const westElem = schools.find((s) => s.code === 'WEST_ELEM');
    const eastMiddle = schools.find((s) => s.code === 'EAST_MIDDLE');
    const northElem = schools.find((s) => s.code === 'NORTH_ELEM');
    const southHigh = schools.find((s) => s.code === 'SOUTH_HIGH');

    // Create Users
    const users = [
      // ADMIN USERS
      {
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

      // COUNSELOR USERS
      {
        email: 'counselor@centralhigh.edu',
        password: defaultPassword,
        firstName: 'James',
        lastName: 'Mitchell',
        role: 'COUNSELOR',
        isActive: true,
        districtId: district?.id || null,
        schoolId: centralHigh?.id || null,
        createdAt: now,
        updatedAt: now,
      },
      {
        email: 'counselor@eastmiddle.edu',
        password: defaultPassword,
        firstName: 'Rachel',
        lastName: 'Green',
        role: 'COUNSELOR',
        isActive: true,
        districtId: district?.id || null,
        schoolId: eastMiddle?.id || null,
        createdAt: now,
        updatedAt: now,
      },
      {
        email: 'counselor@school.edu',
        password: testCounselorPassword,
        firstName: 'Test',
        lastName: 'Counselor',
        role: 'COUNSELOR',
        isActive: true,
        districtId: district?.id || null,
        schoolId: centralHigh?.id || null,
        createdAt: now,
        updatedAt: now,
      },

      // VIEWER USERS
      {
        email: 'viewer@centralhigh.edu',
        password: defaultPassword,
        firstName: 'Linda',
        lastName: 'Davis',
        role: 'VIEWER',
        isActive: true,
        districtId: district?.id || null,
        schoolId: centralHigh?.id || null,
        createdAt: now,
        updatedAt: now,
      },
      {
        email: 'readonly@school.edu',
        password: testReadOnlyPassword,
        firstName: 'Test',
        lastName: 'ReadOnly',
        role: 'VIEWER',
        isActive: true,
        districtId: district?.id || null,
        schoolId: centralHigh?.id || null,
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert('Users', users, {});

    // Get inserted users and roles for role assignments
    const insertedUsers = await queryInterface.sequelize.query(
      'SELECT id, email FROM "Users"',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    ) as Array<{ id: number; email: string }>;

    const insertedRoles = await queryInterface.sequelize.query(
      'SELECT id, name FROM "Roles"',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    ) as Array<{ id: number; name: string }>;

    const adminRole = insertedRoles.find((r) => r.name === 'Administrator');
    const nurseRole = insertedRoles.find((r) => r.name === 'School Nurse');
    const counselorRole = insertedRoles.find((r) => r.name === 'School Counselor');
    const readOnlyRole = insertedRoles.find((r) => r.name === 'Read Only');

    // Create User-Role Assignments
    const userRoleAssignments: Array<{ userId: number; roleId: number; createdAt: Date; updatedAt: Date }> = [];

    // Map users to roles
    const userRoleMap = [
      { email: 'admin@whitecross.health', roleName: 'Administrator' },
      { email: 'district.admin@unifiedschools.edu', roleName: 'Administrator' },
      { email: 'school.admin@centralhigh.edu', roleName: 'Administrator' },
      { email: 'admin@school.edu', roleName: 'Administrator' },
      { email: 'nurse@whitecross.health', roleName: 'School Nurse' },
      { email: 'nurse2@centralhigh.edu', roleName: 'School Nurse' },
      { email: 'nurse@westelementary.edu', roleName: 'School Nurse' },
      { email: 'nurse@eastmiddle.edu', roleName: 'School Nurse' },
      { email: 'nurse@northelementary.edu', roleName: 'School Nurse' },
      { email: 'nurse@southhigh.edu', roleName: 'School Nurse' },
      { email: 'nurse@school.edu', roleName: 'School Nurse' },
      { email: 'counselor@centralhigh.edu', roleName: 'School Counselor' },
      { email: 'counselor@eastmiddle.edu', roleName: 'School Counselor' },
      { email: 'counselor@school.edu', roleName: 'School Counselor' },
      { email: 'viewer@centralhigh.edu', roleName: 'Read Only' },
      { email: 'readonly@school.edu', roleName: 'Read Only' },
    ];

    userRoleMap.forEach((mapping) => {
      const user = insertedUsers.find((u) => u.email === mapping.email);
      const role = insertedRoles.find((r) => r.name === mapping.roleName);

      if (user && role) {
        userRoleAssignments.push({
          userId: user.id,
          roleId: role.id,
          createdAt: now,
          updatedAt: now,
        });
      }
    });

    await queryInterface.bulkInsert('UserRoleAssignments', userRoleAssignments, {});

    console.log(`✓ Seeded ${users.length} users with role assignments`);
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.bulkDelete('UserRoleAssignments', {}, {});
    await queryInterface.bulkDelete('Users', {}, {});
    console.log('✓ Removed all user role assignments and users');
  },
};
