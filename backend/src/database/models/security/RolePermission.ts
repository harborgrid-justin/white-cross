/**
 * @fileoverview RolePermission Junction Table Model
 * @module database/models/security/RolePermission
 * @description Sequelize junction table model linking Roles to Permissions in RBAC system.
 * Implements many-to-many relationship enabling roles to contain multiple permissions and
 * permissions to be assigned to multiple roles for flexible PHI access control.
 *
 * Key Features:
 * - Many-to-many relationship between Role and Permission models
 * - Unique constraint prevents duplicate permission assignments to same role
 * - Tracks timestamp of permission assignment for audit trail
 * - Cascade deletion when roles or permissions are removed
 * - Enables permission aggregation (roles contain multiple permissions)
 *
 * @security Implements least-privilege access principle for HIPAA compliance
 * @security Tracks permission assignment history for audit compliance
 * @compliance HIPAA - Audit trail for PHI access control configuration
 * @compliance FERPA - Educational record access management
 *
 * @requires sequelize - ORM for database operations
 *
 * LOC: 387387AE38
 * WC-GEN-092 | RolePermission.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *   - Role.ts - Foreign key reference
 *   - Permission.ts - Foreign key reference
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 *   - Authorization services - Role permission resolution
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';

/**
 * @interface RolePermissionAttributes
 * @description TypeScript interface defining all RolePermission model attributes
 *
 * @property {string} id - Primary key, auto-generated UUID
 * @property {string} roleId - Foreign key to Role model
 * @property {string} permissionId - Foreign key to Permission model
 * @property {Date} createdAt - Timestamp when permission was assigned to role
 */
interface RolePermissionAttributes {
  id: string;
  roleId: string;
  permissionId: string;
  createdAt: Date;
}

/**
 * @interface RolePermissionCreationAttributes
 * @description Attributes required when creating a new RolePermission instance.
 * Extends RolePermissionAttributes with optional fields that have defaults or are auto-generated.
 */
interface RolePermissionCreationAttributes extends Optional<RolePermissionAttributes, 'id' | 'createdAt'> {}

/**
 * @class RolePermission
 * @extends Model
 * @description Junction table model for many-to-many relationship between Roles and Permissions.
 * Defines which permissions each role contains, enabling granular RBAC configuration
 * for PHI access control and system feature authorization.
 *
 * @tablename role_permissions
 *
 * RBAC Implementation:
 * - Links Role model to Permission model in many-to-many relationship
 * - Each role contains one or more permissions defined in this table
 * - Unique constraint on (roleId, permissionId) prevents duplicate assignments
 * - createdAt timestamp provides audit trail for permission configuration changes
 * - Cascade delete maintains referential integrity
 *
 * Permission Resolution Flow:
 * 1. User is assigned roles via UserRoleAssignment table
 * 2. Each role contains permissions defined in this table
 * 3. User's effective permissions = union of all permissions from all roles
 * 4. Authorization middleware checks if user has required permission
 *
 * @example
 * // Assign a permission to a role
 * await RolePermission.create({
 *   roleId: 'nurse-role-uuid',
 *   permissionId: 'health_records:read-uuid'
 * });
 *
 * @example
 * // Find all permissions for a role
 * const rolePermissions = await RolePermission.findAll({
 *   where: { roleId: 'nurse-role-uuid' },
 *   include: [{ model: Permission }]
 * });
 *
 * @example
 * // Find all roles with a specific permission
 * const permissionRoles = await RolePermission.findAll({
 *   where: { permissionId: 'medications:administer-uuid' },
 *   include: [{ model: Role }]
 * });
 *
 * @security Unique constraint prevents duplicate permission assignments
 * @security Audit trail via createdAt timestamp for compliance
 */
export class RolePermission
  extends Model<RolePermissionAttributes, RolePermissionCreationAttributes>
  implements RolePermissionAttributes
{
  /**
   * @property {string} id - Primary key UUID
   * @security Unique identifier for audit trail
   */
  public id!: string;

  /**
   * @property {string} roleId - Foreign key to Role model
   * @security Links to role receiving permission
   * @validation Must be valid Role UUID
   */
  public roleId!: string;

  /**
   * @property {string} permissionId - Foreign key to Permission model
   * @security Links to permission being assigned
   * @validation Must be valid Permission UUID
   */
  public permissionId!: string;

  /**
   * @property {Date} createdAt - Permission assignment timestamp
   * @security Audit trail for when role was granted permission
   * @readonly
   */
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
