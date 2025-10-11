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
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Role description',
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
  }
);
