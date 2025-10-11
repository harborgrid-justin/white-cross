import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { ContactPriority } from '../../types/enums';

interface EmergencyContactAttributes {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  priority: ContactPriority;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface EmergencyContactCreationAttributes
  extends Optional<EmergencyContactAttributes, 'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'email' | 'address'> {}

export class EmergencyContact
  extends Model<EmergencyContactAttributes, EmergencyContactCreationAttributes>
  implements EmergencyContactAttributes
{
  public id!: string;
  public studentId!: string;
  public firstName!: string;
  public lastName!: string;
  public relationship!: string;
  public phoneNumber!: string;
  public email?: string;
  public address?: string;
  public priority!: ContactPriority;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

EmergencyContact.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    relationship: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    priority: {
      type: DataTypes.ENUM(...Object.values(ContactPriority)),
      allowNull: false,
      defaultValue: ContactPriority.PRIMARY,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'emergency_contacts',
    timestamps: true,
    indexes: [
      { fields: ['studentId'] },
      { fields: ['isActive'] },
      { fields: ['priority'] },
    ],
  }
);
