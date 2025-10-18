/**
 * LOC: A7B8B33F55
 * WC-GEN-035 | District.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 *   - DistrictRepository.ts (database/repositories/impl/DistrictRepository.ts)
 */

/**
 * WC-GEN-035 | District.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../config/sequelize | Dependencies: sequelize, ../../config/sequelize
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

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
      validate: {
        notEmpty: {
          msg: 'District name cannot be empty'
        },
        len: {
          args: [2, 200],
          msg: 'District name must be between 2 and 200 characters'
        }
      }
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'District code cannot be empty'
        },
        len: {
          args: [2, 50],
          msg: 'District code must be between 2 and 50 characters'
        },
        isUppercase: {
          msg: 'District code must be uppercase'
        },
        is: {
          args: /^[A-Z0-9_-]+$/,
          msg: 'District code can only contain uppercase letters, numbers, hyphens, and underscores'
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 500],
          msg: 'Address cannot exceed 500 characters'
        }
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 100],
          msg: 'City cannot exceed 100 characters'
        }
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 2],
          msg: 'State must be a 2-letter abbreviation'
        },
        isUppercase: {
          msg: 'State abbreviation must be uppercase'
        }
      }
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: {
          args: /^[0-9]{5}(-[0-9]{4})?$/,
          msg: 'ZIP code must be in format 12345 or 12345-6789'
        }
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: {
          args: /^[\d\s\-\(\)\+\.]+$/,
          msg: 'Phone number contains invalid characters'
        },
        len: {
          args: [10, 20],
          msg: 'Phone number must be between 10 and 20 characters'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: {
          msg: 'Invalid email address format'
        },
        len: {
          args: [0, 255],
          msg: 'Email cannot exceed 255 characters'
        }
      }
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
    validate: {
      // Custom validation to ensure at least contact information is provided
      hasContactInfo() {
        if (!this.phone && !this.email && !this.address) {
          throw new Error('District must have at least one form of contact information (phone, email, or address)');
        }
      }
    }
  }
);
