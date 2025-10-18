/**
 * LOC: 489E002190
 * WC-GEN-095 | UserRoleAssignment.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 */

/**
 * WC-GEN-095 | UserRoleAssignment.ts - General utility functions and operations
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
 * UserRoleAssignment Model
 *
 * HIPAA Compliance: Assigns roles to users for access control to healthcare data.
 * Critical for implementing principle of least privilege and maintaining audit trails.
 *
 * Key Features:
 * - Many-to-many relationship between users and roles
 * - Unique constraint prevents duplicate role assignments
 * - Tracks when roles were assigned for auditing
 * - Cascade deletion when roles are removed
 */
interface UserRoleAssignmentAttributes {
  id: string;
  userId: string;
  roleId: string;
  createdAt: Date;
}

interface UserRoleAssignmentCreationAttributes extends Optional<UserRoleAssignmentAttributes, 'id' | 'createdAt'> {}

export class UserRoleAssignment
  extends Model<UserRoleAssignmentAttributes, UserRoleAssignmentCreationAttributes>
  implements UserRoleAssignmentAttributes
{
  public id!: string;
  public userId!: string;
  public roleId!: string;
  public readonly createdAt!: Date;
}

UserRoleAssignment.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'User ID receiving the role assignment',
    },
    roleId: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Role ID being assigned',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'user_role_assignments',
    timestamps: false,
    indexes: [
      { fields: ['userId', 'roleId'], unique: true },
      { fields: ['userId'] },
      { fields: ['roleId'] },
    ],
  }
);
