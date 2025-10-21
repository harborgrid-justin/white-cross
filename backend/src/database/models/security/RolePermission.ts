/**
 * LOC: 387387AE38
 * WC-GEN-092 | RolePermission.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 */

/**
 * WC-GEN-092 | RolePermission.ts - General utility functions and operations
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
 * RolePermission Model
 *
 * HIPAA Compliance: Junction table linking roles to their permissions.
 * Enables flexible role-based access control for PHI protection.
 *
 * Key Features:
 * - Many-to-many relationship between roles and permissions
 * - Unique constraint prevents duplicate permission assignments
 * - Cascade deletion when roles or permissions are removed
 */
interface RolePermissionAttributes {
  id: string;
  roleId: string;
  permissionId: string;
  createdAt: Date;
}

interface RolePermissionCreationAttributes extends Optional<RolePermissionAttributes, 'id' | 'createdAt'> {}

export class RolePermission
  extends Model<RolePermissionAttributes, RolePermissionCreationAttributes>
  implements RolePermissionAttributes
{
  public id!: string;
  public roleId!: string;
  public permissionId!: string;
  public readonly createdAt!: Date;
}

RolePermission.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    roleId: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Associated role ID',
    },
    permissionId: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Associated permission ID',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'role_permissions',
    timestamps: false,
    indexes: [
      { fields: ['roleId', 'permissionId'], unique: true },
      { fields: ['roleId'] },
      { fields: ['permissionId'] },
    ],
  }
);
