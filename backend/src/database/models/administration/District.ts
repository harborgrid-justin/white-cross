import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';

interface DistrictAttributes {
  id: string;
  name: string;
  code: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface DistrictCreationAttributes
  extends Optional<
    DistrictAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'address' | 'city' | 'state' | 'zipCode' | 'phone' | 'email'
  > {}

export class District extends Model<DistrictAttributes, DistrictCreationAttributes> implements DistrictAttributes {
  public id!: string;
  public name!: string;
  public code!: string;
  public address?: string;
  public city?: string;
  public state?: string;
  public zipCode?: string;
  public phone?: string;
  public email?: string;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

District.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
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
    tableName: 'districts',
    timestamps: true,
    indexes: [{ fields: ['code'] }, { fields: ['isActive'] }],
  }
);
