import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';

/**
 * Vendor Model
 * Manages vendor/supplier information for inventory and medication procurement.
 * Tracks contact details, payment terms, ratings, and active status.
 * Supports vendor performance evaluation and procurement workflow.
 */

interface VendorAttributes {
  id: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  taxId?: string;
  paymentTerms?: string;
  notes?: string;
  isActive: boolean;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface VendorCreationAttributes
  extends Optional<VendorAttributes, 'id' | 'createdAt' | 'updatedAt' | 'contactName' | 'email' | 'phone' | 'address' | 'website' | 'taxId' | 'paymentTerms' | 'notes' | 'isActive' | 'rating'> {}

export class Vendor extends Model<VendorAttributes, VendorCreationAttributes> implements VendorAttributes {
  public id!: string;
  public name!: string;
  public contactName?: string;
  public email?: string;
  public phone?: string;
  public address?: string;
  public website?: string;
  public taxId?: string;
  public paymentTerms?: string;
  public notes?: string;
  public isActive!: boolean;
  public rating?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Vendor.init(
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
    contactName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    taxId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentTerms: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5,
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'vendors',
    timestamps: true,
    indexes: [
      { fields: ['name'] },
      { fields: ['isActive'] },
      { fields: ['rating'] },
    ],
  }
);
