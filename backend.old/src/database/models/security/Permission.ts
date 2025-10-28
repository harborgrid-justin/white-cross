/**
 * @fileoverview Permission Database Model
 * @module database/models/security/Permission
 * @description Sequelize model for granular permission management in RBAC system.
 * Defines specific actions (read, create, update, delete, etc.) that can be performed
 * on system resources (students, medications, health_records, etc.) for PHI protection.
 *
 * Key Features:
 * - Resource-based permissions (students, medications, health_records, reports, etc.)
 * - Action-based permissions (read, create, update, delete, manage, audit, etc.)
 * - Unique constraint on resource+action combinations prevents duplicate permissions
 * - Links to roles via RolePermission junction table for RBAC implementation
 * - Validates resource and action types against allowed lists
 * - Enforces valid resource-action combinations (e.g., system resources have limited actions)
 *
 * @security Implements least-privilege access principle for HIPAA compliance
 * @compliance HIPAA - Granular access control for PHI protection
 * @compliance FERPA - Educational record access management
 *
 * @requires sequelize - ORM for database operations
 *
 * LOC: C926C7F60A
 * WC-GEN-090 | Permission.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 *   - RolePermission.ts - Links permissions to roles
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';

/**
 * @interface PermissionAttributes
 * @description TypeScript interface defining all Permission model attributes
 *
 * @property {string} id - Primary key, auto-generated UUID
 * @property {string} resource - Resource type (e.g., 'students', 'medications', 'health_records')
 * @property {string} action - Action type (e.g., 'read', 'create', 'update', 'delete', 'manage')
 * @property {string} [description] - Optional description of what this permission allows
 * @property {Date} createdAt - Record creation timestamp
 */
interface PermissionAttributes {
  id: string;
  resource: string;
  action: string;
  description?: string;
  createdAt: Date;
}

/**
 * @interface PermissionCreationAttributes
 * @description Attributes required when creating a new Permission instance.
 * Extends PermissionAttributes with optional fields that have defaults or are auto-generated.
 */
interface PermissionCreationAttributes extends Optional<PermissionAttributes, 'id' | 'createdAt' | 'description'> {}

/**
 * @class Permission
 * @extends Model
 * @description Permission model representing granular access rights in the RBAC system.
 * Each permission defines a specific action that can be performed on a resource type,
 * enabling fine-grained access control for PHI and system features.
 *
 * @tablename permissions
 *
 * RBAC Implementation:
 * - Permissions are assigned to roles via RolePermission junction table
 * - Users inherit permissions from their assigned roles
 * - Each permission = resource + action (e.g., students:read, medications:create)
 * - Unique constraint on resource+action prevents duplicate permissions
 *
 * Valid Resources:
 * - students, medications, health_records, reports, users, system, security
 * - appointments, incidents, emergency_contacts, inventory, documents
 * - communications, compliance, analytics
 *
 * Valid Actions:
 * - read, create, update, delete (CRUD operations)
 * - manage (full control), administer (system-level)
 * - configure, export, import, approve, review, audit
 *
 * Special Constraints:
 * - system resources: limited to read, configure, manage actions
 * - security resources: limited to read, manage, audit actions
 * - compliance resources: limited to read, manage, audit, export actions
 *
 * @example
 * // Create a permission
 * const permission = await Permission.create({
 *   resource: 'health_records',
 *   action: 'read',
 *   description: 'View student health records'
 * });
 *
 * @example
 * // Find all medication permissions
 * const medPermissions = await Permission.findAll({
 *   where: { resource: 'medications' }
 * });
 *
 * @security Validated resource and action types prevent invalid permissions
 * @security Resource-action combinations are validated for consistency
 */
export class Permission extends Model<PermissionAttributes, PermissionCreationAttributes> implements PermissionAttributes {
  /**
   * @property {string} id - Primary key UUID
   * @security Used for foreign key relationships in RBAC
   */
  public id!: string;

  /**
   * @property {string} resource - Resource type (e.g., 'students', 'health_records')
   * @validation Must be lowercase alphanumeric with underscores only
   * @validation Must be from allowed resource list
   * @security Controls what data/features this permission applies to
   */
  public resource!: string;

  /**
   * @property {string} action - Action type (e.g., 'read', 'create', 'update')
   * @validation Must be lowercase alphanumeric with underscores only
   * @validation Must be from allowed action list
   * @validation Must be valid for the specified resource
   * @security Controls what operations can be performed on the resource
   */
  public action!: string;

  /**
   * @property {string} description - Optional permission description
   * @validation Max 500 characters
   */
  public description?: string;

  /**
   * @property {Date} createdAt - Record creation timestamp
   * @readonly
   */
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
