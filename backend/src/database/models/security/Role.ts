/**
 * LOC: 5BB04CA4F4
 * WC-GEN-091 | Role.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 */

/**
 * WC-GEN-091 | Role.ts - General utility functions and operations
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
 * Role Model
 *
 * HIPAA Compliance: Implements role-based access control (RBAC) for healthcare data.
 * Critical for maintaining least-privilege access to Protected Health Information (PHI).
 *
 * Key Features:
 * - Named roles with unique identifiers
 * - System roles cannot be deleted (e.g., Admin, Nurse)
 * - Links to permissions for granular access control
 * - Supports custom organizational roles
 */
interface RoleAttributes {
  id: string;
  name: string;
  description?: string;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface RoleCreationAttributes extends Optional<RoleAttributes, 'id' | 'createdAt' | 'updatedAt' | 'description' | 'isSystem'> {}

export class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  public id!: string;
  public name!: string;
  public description?: string;
  public isSystem!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Role.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'Unique role name',
      validate: {
        notEmpty: {
          msg: 'Role name cannot be empty'
        },
        len: {
          args: [2, 100],
          msg: 'Role name must be between 2 and 100 characters'
        },
        isValidRoleName(value: string) {
          // Only allow alphanumeric, spaces, hyphens, and underscores
          const roleNameRegex = /^[a-zA-Z0-9\s\-_]+$/;
          if (!roleNameRegex.test(value)) {
            throw new Error('Role name can only contain letters, numbers, spaces, hyphens, and underscores');
          }
          // Reserved system role names
          const reservedNames = ['SYSTEM', 'ROOT', 'SUPERADMIN', 'SUPERUSER'];
          if (reservedNames.includes(value.toUpperCase())) {
            throw new Error(`Role name '${value}' is reserved and cannot be used`);
          }
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Role description',
      validate: {
        len: {
          args: [0, 1000],
          msg: 'Role description must not exceed 1000 characters'
        },
      },
    },
    isSystem: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'System roles cannot be deleted',
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'roles',
    timestamps: true,
    indexes: [
      { fields: ['name'], unique: true },
      { fields: ['isSystem'] },
    ],
    validate: {
      systemRoleProtection() {
        // Additional model-level validation can be added here if needed
      },
    },
  }
);
