/**
 * LOC: 33CC070480
 * WC-GEN-116 | 02-permissions-and-roles.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-GEN-116 | 02-permissions-and-roles.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: Independent module | Dependencies: sequelize
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: Various exports | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { QueryInterface, QueryTypes } from 'sequelize';

/**
 * Seeder: Permissions and Roles
 *
 * Creates the RBAC (Role-Based Access Control) foundation:
 * - 22 Permissions (CRUD operations across resources)
 * - 4 Roles (Administrator, School Nurse, School Counselor, Read Only)
 * - Role-Permission mappings
 *
 * This seeder must run before users as roles are assigned to users.
 *
 * HIPAA Compliance: No PHI data. This establishes access control framework.
 */

module.exports = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    const now = new Date();

    // Create Permissions
    const permissionsData = [
      { resource: 'students', action: 'read' },
      { resource: 'students', action: 'create' },
      { resource: 'students', action: 'update' },
      { resource: 'students', action: 'delete' },
      { resource: 'medications', action: 'read' },
      { resource: 'medications', action: 'create' },
      { resource: 'medications', action: 'update' },
      { resource: 'medications', action: 'delete' },
      { resource: 'health_records', action: 'read' },
      { resource: 'health_records', action: 'create' },
      { resource: 'health_records', action: 'update' },
      { resource: 'health_records', action: 'delete' },
      { resource: 'incidents', action: 'read' },
      { resource: 'incidents', action: 'create' },
      { resource: 'incidents', action: 'update' },
      { resource: 'incidents', action: 'delete' },
      { resource: 'reports', action: 'read' },
      { resource: 'reports', action: 'create' },
      { resource: 'administration', action: 'read' },
      { resource: 'administration', action: 'create' },
      { resource: 'administration', action: 'update' },
      { resource: 'administration', action: 'delete' },
    ];

    const permissions = permissionsData.map((perm) => ({
      resource: perm.resource,
      action: perm.action,
      description: `${perm.action.charAt(0).toUpperCase() + perm.action.slice(1)} ${perm.resource}`,
      createdAt: now,
      updatedAt: now,
    }));

    await queryInterface.bulkInsert('Permissions', permissions, {});

    // Get inserted permissions for role mappings
    const [insertedPermissions] = await queryInterface.sequelize.query(
      'SELECT id, resource, action FROM "Permissions"',
      { type: QueryTypes.SELECT }
    ) as [Array<{ id: number; resource: string; action: string }>, unknown];

    // Create Roles
    const rolesData = [
      {
        name: 'Administrator',
        description: 'Full system access',
        isSystem: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'School Nurse',
        description: 'Standard nurse permissions',
        isSystem: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Read Only',
        description: 'View-only access to records',
        isSystem: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'School Counselor',
        description: 'Counselor access to student records',
        isSystem: true,
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert('Roles', rolesData, {});

    // Get inserted roles
    const [insertedRoles] = await queryInterface.sequelize.query(
      'SELECT id, name FROM "Roles"',
      { type: QueryTypes.SELECT }
    ) as [Array<{ id: number; name: string }>, unknown];

    const adminRole = insertedRoles.find((r) => r.name === 'Administrator');
    const nurseRole = insertedRoles.find((r) => r.name === 'School Nurse');
    const readOnlyRole = insertedRoles.find((r) => r.name === 'Read Only');
    const counselorRole = insertedRoles.find((r) => r.name === 'School Counselor');

    // Create Role-Permission mappings
    const rolePermissions: Array<{ roleId: number; permissionId: number; createdAt: Date; updatedAt: Date }> = [];

    // Admin gets all permissions
    if (adminRole) {
      insertedPermissions.forEach((perm) => {
        rolePermissions.push({
          roleId: adminRole.id,
          permissionId: perm.id,
          createdAt: now,
          updatedAt: now,
        });
      });
    }

    // Nurse gets all permissions except administration and delete actions
    if (nurseRole) {
      insertedPermissions
        .filter((p) => !p.resource.includes('administration') && p.action !== 'delete')
        .forEach((perm) => {
          rolePermissions.push({
            roleId: nurseRole.id,
            permissionId: perm.id,
            createdAt: now,
            updatedAt: now,
          });
        });
    }

    // Read Only gets only read permissions
    if (readOnlyRole) {
      insertedPermissions
        .filter((p) => p.action === 'read')
        .forEach((perm) => {
          rolePermissions.push({
            roleId: readOnlyRole.id,
            permissionId: perm.id,
            createdAt: now,
            updatedAt: now,
          });
        });
    }

    // Counselor gets read/create/update for students and health_records only
    if (counselorRole) {
      insertedPermissions
        .filter(
          (p) =>
            (p.resource === 'students' || p.resource === 'health_records') &&
            p.action !== 'delete'
        )
        .forEach((perm) => {
          rolePermissions.push({
            roleId: counselorRole.id,
            permissionId: perm.id,
            createdAt: now,
            updatedAt: now,
          });
        });
    }

    await queryInterface.bulkInsert('RolePermissions', rolePermissions, {});

    console.log(`✓ Seeded ${permissions.length} permissions and 4 roles with mappings`);
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.bulkDelete('RolePermissions', {}, {});
    await queryInterface.bulkDelete('Roles', {}, {});
    await queryInterface.bulkDelete('Permissions', {}, {});
    console.log('✓ Removed all role permissions, roles, and permissions');
  },
};
