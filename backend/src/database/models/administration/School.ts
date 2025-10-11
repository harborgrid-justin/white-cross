import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';

interface SchoolAttributes {
  id: string;
  districtId: string;
  name: string;
  code: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  principal?: string;
  totalEnrollment?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface SchoolCreationAttributes
  extends Optional<
    SchoolAttributes,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'isActive'
    | 'address'
    | 'city'
    | 'state'
    | 'zipCode'
    | 'phone'
    | 'email'
    | 'principal'
    | 'totalEnrollment'
  > {}

export class School extends Model<SchoolAttributes, SchoolCreationAttributes> implements SchoolAttributes {
  public id!: string;
  public districtId!: string;
  public name!: string;
  public code!: string;
  public address?: string;
  public city?: string;
  public state?: string;
  public zipCode?: string;
  public phone?: string;
  public email?: string;
  public principal?: string;
  public totalEnrollment?: number;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

School.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    districtId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    principal: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    totalEnrollment: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    tableName: 'schools',
    timestamps: true,
    indexes: [{ fields: ['districtId'] }, { fields: ['code'] }, { fields: ['isActive'] }],
  }
);
