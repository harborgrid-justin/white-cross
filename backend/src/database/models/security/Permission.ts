/**
 * LOC: C926C7F60A
 * WC-GEN-090 | Permission.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 */

/**
 * WC-GEN-090 | Permission.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../config/sequelize | Dependencies: sequelize, ../../config/sequelize
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';

/**
 * Permission Model
 *
 * HIPAA Compliance: Defines granular permissions for accessing and modifying
 * healthcare data. Essential for implementing least-privilege access control.
 *
 * Key Features:
 * - Resource-based permissions (students, medications, reports, etc.)
 * - Action-based permissions (read, create, update, delete)
 * - Unique constraint on resource+action combinations
 * - Links to roles via RolePermission junction table
 */
interface PermissionAttributes {
  id: string;
  resource: string;
  action: string;
  description?: string;
  createdAt: Date;
}

interface PermissionCreationAttributes extends Optional<PermissionAttributes, 'id' | 'createdAt' | 'description'> {}

export class Permission extends Model<PermissionAttributes, PermissionCreationAttributes> implements PermissionAttributes {
  public id!: string;
  public resource!: string;
  public action!: string;
  public description?: string;
  public readonly createdAt!: Date;
}

Permission.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    resource: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Resource type (e.g., students, medications, reports)',
      validate: {
        notEmpty: {
          msg: 'Resource cannot be empty'
        },
        len: {
          args: [2, 100],
          msg: 'Resource must be between 2 and 100 characters'
        },
        isValidResource(value: string) {
          // Only allow lowercase alphanumeric and underscores
          const resourceRegex = /^[a-z0-9_]+$/;
          if (!resourceRegex.test(value)) {
            throw new Error('Resource must be lowercase alphanumeric with underscores only (e.g., students, health_records)');
          }
          // Valid resource types
          const validResources = [
            'students',
            'medications',
            'health_records',
            'reports',
            'users',
            'system',
            'security',
            'appointments',
            'incidents',
            'emergency_contacts',
            'inventory',
            'documents',
            'communications',
            'compliance',
            'analytics',
          ];
          if (!validResources.includes(value)) {
            throw new Error(`Invalid resource type. Must be one of: ${validResources.join(', ')}`);
          }
        },
      },
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Action type (e.g., read, create, update, delete)',
      validate: {
        notEmpty: {
          msg: 'Action cannot be empty'
        },
        len: {
          args: [2, 50],
          msg: 'Action must be between 2 and 50 characters'
        },
        isValidAction(value: string) {
          // Only allow lowercase alphanumeric and underscores
          const actionRegex = /^[a-z0-9_]+$/;
          if (!actionRegex.test(value)) {
            throw new Error('Action must be lowercase alphanumeric with underscores only');
          }
          // Valid action types
          const validActions = [
            'read',
            'create',
            'update',
            'delete',
            'manage',
            'administer',
            'configure',
            'export',
            'import',
            'approve',
            'review',
            'audit',
          ];
          if (!validActions.includes(value)) {
            throw new Error(`Invalid action type. Must be one of: ${validActions.join(', ')}`);
          }
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Permission description',
      validate: {
        len: {
          args: [0, 500],
          msg: 'Permission description must not exceed 500 characters'
        },
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'permissions',
    timestamps: false,
    indexes: [
      { fields: ['resource', 'action'], unique: true },
      { fields: ['resource'] },
    ],
    validate: {
      validResourceActionCombination() {
        // Ensure certain resource-action combinations are valid
        const restrictedCombinations: Record<string, string[]> = {
          system: ['read', 'configure', 'manage'],
          security: ['read', 'manage', 'audit'],
          compliance: ['read', 'manage', 'audit', 'export'],
        };

        // Type guard to ensure resource and action are strings
        const resource = this.resource as string;
        const action = this.action as string;

        if (restrictedCombinations[resource]) {
          if (!restrictedCombinations[resource].includes(action)) {
            throw new Error(
              `Invalid action '${action}' for resource '${resource}'. ` +
              `Allowed actions: ${restrictedCombinations[resource].join(', ')}`
            );
          }
        }
      },
    },
  }
);
