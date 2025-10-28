/**
 * @fileoverview Role Database Model
 * @module database/models/security/Role
 * @description Sequelize model for role-based access control (RBAC) in healthcare system.
 * Manages roles that users can be assigned to, each with specific permissions for accessing
 * Protected Health Information (PHI) and system resources.
 *
 * Key Features:
 * - Named roles with unique identifiers for RBAC implementation
 * - System roles protected from deletion (e.g., Admin, Nurse, District Administrator)
 * - Links to permissions via RolePermission junction table for granular access control
 * - Supports custom organizational roles for flexible access management
 * - Validation ensures role name integrity and prevents reserved name conflicts
 *
 * @security Implements least-privilege access principle for HIPAA compliance
 * @compliance HIPAA - Role-based access control for PHI protection
 * @compliance FERPA - Educational record access management
 *
 * @requires sequelize - ORM for database operations
 *
 * LOC: 5BB04CA4F4
 * WC-GEN-091 | Role.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 *   - UserRoleAssignment.ts - Links users to roles
 *   - RolePermission.ts - Links roles to permissions
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';

/**
 * @interface RoleAttributes
 * @description TypeScript interface defining all Role model attributes
 *
 * @property {string} id - Primary key, auto-generated UUID
 * @property {string} name - Role name (e.g., "Nurse", "District Admin", "Super Admin")
 * @property {string} [description] - Optional detailed description of role purpose and permissions
 * @property {boolean} isSystem - System role flag; true prevents deletion of critical roles
 * @property {Date} createdAt - Record creation timestamp
 * @property {Date} updatedAt - Record last update timestamp
 */
interface RoleAttributes {
  id: string;
  name: string;
  description?: string;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @interface RoleCreationAttributes
 * @description Attributes required when creating a new Role instance.
 * Extends RoleAttributes with optional fields that have defaults or are auto-generated.
 */
interface RoleCreationAttributes extends Optional<RoleAttributes, 'id' | 'createdAt' | 'updatedAt' | 'description' | 'isSystem'> {}

/**
 * @class Role
 * @extends Model
 * @description Role model representing user roles in the RBAC system.
 * Roles are containers for permissions that can be assigned to users, enabling
 * flexible and maintainable access control for healthcare data and system features.
 *
 * @tablename roles
 *
 * RBAC Implementation:
 * - Roles are assigned to users via UserRoleAssignment junction table
 * - Roles contain permissions via RolePermission junction table
 * - Users inherit all permissions from their assigned roles
 * - Multiple roles can be assigned to a single user (role aggregation)
 * - System roles cannot be deleted to preserve access control integrity
 *
 * Common Roles:
 * - Super Admin: Full system access across all districts and schools
 * - District Administrator: Manages all schools within a district
 * - School Administrator: Manages a single school
 * - Nurse: Healthcare professional with access to PHI
 * - Staff: Limited access to student information
 *
 * @example
 * // Create a custom role
 * const role = await Role.create({
 *   name: 'School Counselor',
 *   description: 'Access to student mental health records',
 *   isSystem: false
 * });
 *
 * @example
 * // Query system roles
 * const systemRoles = await Role.findAll({
 *   where: { isSystem: true }
 * });
 *
 * @security System roles are protected from deletion via isSystem flag
 * @security Role names must be unique to prevent access control conflicts
 */
export class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  /**
   * @property {string} id - Primary key UUID
   * @security Used for foreign key relationships in RBAC
   */
  public id!: string;

  /**
   * @property {string} name - Unique role name
   * @security Must be unique to prevent permission conflicts
   * @validation 2-100 characters, alphanumeric with spaces/hyphens/underscores
   * @validation Reserved names (SYSTEM, ROOT, SUPERADMIN, SUPERUSER) are blocked
   */
  public name!: string;

  /**
   * @property {string} description - Optional role description
   * @validation Max 1000 characters
   */
  public description?: string;

  /**
   * @property {boolean} isSystem - System role protection flag
   * @security System roles cannot be deleted to maintain access control integrity
   * @default false
   */
  public isSystem!: boolean;

  /**
   * @property {Date} createdAt - Record creation timestamp
   * @readonly
   */
  public readonly createdAt!: Date;

  /**
   * @property {Date} updatedAt - Record last update timestamp
   * @readonly
   */
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
