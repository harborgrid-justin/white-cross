/**
 * @fileoverview UserRoleAssignment Junction Table Model
 * @module database/models/security/UserRoleAssignment
 * @description Sequelize junction table model linking Users to Roles in RBAC system.
 * Implements many-to-many relationship allowing users to have multiple roles and roles
 * to be assigned to multiple users for flexible PHI access control.
 *
 * Key Features:
 * - Many-to-many relationship between User and Role models
 * - Unique constraint prevents duplicate role assignments to same user
 * - Tracks timestamp of role assignment for audit trail
 * - Cascade deletion when users or roles are removed
 * - Supports role aggregation (users can have multiple roles)
 *
 * @security Implements least-privilege access principle for HIPAA compliance
 * @security Tracks role assignment history for audit compliance
 * @compliance HIPAA - Audit trail for PHI access control changes
 * @compliance FERPA - Educational record access management
 *
 * @requires sequelize - ORM for database operations
 *
 * LOC: 489E002190
 * WC-GEN-095 | UserRoleAssignment.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *   - User.ts - Foreign key reference
 *   - Role.ts - Foreign key reference
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 *   - Authorization services - User permission resolution
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';

/**
 * @interface UserRoleAssignmentAttributes
 * @description TypeScript interface defining all UserRoleAssignment model attributes
 *
 * @property {string} id - Primary key, auto-generated UUID
 * @property {string} userId - Foreign key to User model
 * @property {string} roleId - Foreign key to Role model
 * @property {Date} createdAt - Timestamp when role was assigned (for audit trail)
 */
interface UserRoleAssignmentAttributes {
  id: string;
  userId: string;
  roleId: string;
  createdAt: Date;
}

/**
 * @interface UserRoleAssignmentCreationAttributes
 * @description Attributes required when creating a new UserRoleAssignment instance.
 * Extends UserRoleAssignmentAttributes with optional fields that have defaults or are auto-generated.
 */
interface UserRoleAssignmentCreationAttributes extends Optional<UserRoleAssignmentAttributes, 'id' | 'createdAt'> {}

/**
 * @class UserRoleAssignment
 * @extends Model
 * @description Junction table model for many-to-many relationship between Users and Roles.
 * Enables flexible RBAC by allowing users to have multiple roles simultaneously,
 * with users inheriting all permissions from their assigned roles.
 *
 * @tablename user_role_assignments
 *
 * RBAC Implementation:
 * - Links User model to Role model in many-to-many relationship
 * - User permissions = union of all permissions from assigned roles
 * - Unique constraint on (userId, roleId) prevents duplicate assignments
 * - createdAt timestamp provides audit trail for role changes
 * - Cascade delete maintains referential integrity
 *
 * Access Control Flow:
 * 1. User is assigned one or more roles via this table
 * 2. Each role contains permissions via RolePermission table
 * 3. User inherits all permissions from all assigned roles
 * 4. Authorization checks verify user has required permission
 *
 * @example
 * // Assign a role to a user
 * await UserRoleAssignment.create({
 *   userId: 'user-uuid',
 *   roleId: 'nurse-role-uuid'
 * });
 *
 * @example
 * // Find all roles for a user
 * const userRoles = await UserRoleAssignment.findAll({
 *   where: { userId: 'user-uuid' },
 *   include: [{ model: Role }]
 * });
 *
 * @example
 * // Find all users with a specific role
 * const roleUsers = await UserRoleAssignment.findAll({
 *   where: { roleId: 'admin-role-uuid' },
 *   include: [{ model: User }]
 * });
 *
 * @security Unique constraint prevents duplicate role assignments
 * @security Audit trail via createdAt timestamp for compliance
 */
export class UserRoleAssignment
  extends Model<UserRoleAssignmentAttributes, UserRoleAssignmentCreationAttributes>
  implements UserRoleAssignmentAttributes
{
  /**
   * @property {string} id - Primary key UUID
   * @security Unique identifier for audit trail
   */
  public id!: string;

  /**
   * @property {string} userId - Foreign key to User model
   * @security Links to user receiving role assignment
   * @validation Must be valid User UUID
   */
  public userId!: string;

  /**
   * @property {string} roleId - Foreign key to Role model
   * @security Links to role being assigned
   * @validation Must be valid Role UUID
   */
  public roleId!: string;

  /**
   * @property {Date} createdAt - Role assignment timestamp
   * @security Audit trail for when user was granted role
   * @readonly
   */
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
