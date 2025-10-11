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
