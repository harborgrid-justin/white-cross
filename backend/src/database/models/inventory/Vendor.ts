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
      validate: {
        notEmpty: {
          msg: 'Vendor name cannot be empty'
        },
        len: {
          args: [1, 255],
          msg: 'Vendor name must be between 1 and 255 characters'
        }
      }
    },
    contactName: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 255],
          msg: 'Contact name cannot exceed 255 characters'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: {
          msg: 'Must be a valid email address'
        },
        len: {
          args: [0, 255],
          msg: 'Email cannot exceed 255 characters'
        }
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 50],
          msg: 'Phone number cannot exceed 50 characters'
        }
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 1000],
          msg: 'Address cannot exceed 1000 characters'
        }
      }
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'Must be a valid URL'
        },
        len: {
          args: [0, 255],
          msg: 'Website URL cannot exceed 255 characters'
        }
      }
    },
    taxId: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 50],
          msg: 'Tax ID cannot exceed 50 characters'
        }
      }
    },
    paymentTerms: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 255],
          msg: 'Payment terms cannot exceed 255 characters'
        }
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 10000],
          msg: 'Notes cannot exceed 10,000 characters'
        }
      }
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
        isInt: {
          msg: 'Rating must be an integer'
        },
        min: {
          args: [1],
          msg: 'Rating must be at least 1'
        },
        max: {
          args: [5],
          msg: 'Rating cannot exceed 5'
        }
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
      { fields: ['email'] },
    ],
  }
);
