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
