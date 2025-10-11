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
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Action type (e.g., read, create, update, delete)',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Permission description',
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
  }
);
