/**
 * @fileoverview District Database Model
 * @module database/models/administration/District
 * @description Sequelize model for school district information and organizational hierarchy.
 * Districts are the top-level organizational unit containing multiple schools.
 * Critical for multi-tenant data isolation and RBAC scope management.
 *
 * Key Features:
 * - Top-level organizational hierarchy (contains Schools)
 * - Unique district codes for system-wide identification
 * - Contact information and administrative details
 * - Active/inactive status for district lifecycle management
 * - Comprehensive validation for data integrity
 *
 * @security Districts provide highest-level data isolation boundary for multi-tenant access
 * @security District administrators can access all schools within their district
 * @compliance FERPA - District-level data segregation for educational records
 * @compliance HIPAA - Organizational entity for PHI access control
 *
 * @requires sequelize - ORM for database operations
 *
 * LOC: A7B8B33F55
 * WC-GEN-035 | District.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 *   - DistrictRepository.ts (database/repositories/impl/DistrictRepository.ts)
 *   - School.ts - Schools belong to districts
 *   - User.ts - Users can be scoped to districts
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';

/**
 * @interface DistrictAttributes
 * @description TypeScript interface defining all District model attributes
 *
 * @property {string} id - Primary key, auto-generated UUID
 * @property {string} name - District name (e.g., "Springfield Unified School District")
 * @property {string} code - Unique district code (e.g., "SPRINGFIELD-USD")
 * @property {string} [address] - Street address
 * @property {string} [city] - City name
 * @property {string} [state] - Two-letter state abbreviation (e.g., "CA")
 * @property {string} [zipCode] - ZIP code in format 12345 or 12345-6789
 * @property {string} [phone] - District phone number
 * @property {string} [email] - District email address
 * @property {boolean} isActive - District active status (for lifecycle management)
 * @property {Date} createdAt - Record creation timestamp
 * @property {Date} updatedAt - Record last update timestamp
 */
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

/**
 * @interface DistrictCreationAttributes
 * @description Attributes required when creating a new District instance.
 * Extends DistrictAttributes with optional fields that have defaults or are auto-generated.
 */
interface DistrictCreationAttributes
  extends Optional<
    DistrictAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'address' | 'city' | 'state' | 'zipCode' | 'phone' | 'email'
  > {}

/**
 * @class District
 * @extends Model
 * @description District model representing top-level organizational units in the system.
 * Provides highest-level structure for multi-tenant data isolation and RBAC scope management.
 *
 * @tablename districts
 *
 * Organizational Hierarchy:
 * - District (this model) → School → Students, Users, Health Records
 * - Users with district-level access can view/modify data for all schools in district
 * - Super admins can access all districts across entire system
 *
 * Data Isolation:
 * - District ID is highest-level scope boundary for multi-tenant access control
 * - District administrators can access all schools and students within their district
 * - Reports and analytics can be aggregated at district level
 *
 * @example
 * // Create a new district
 * const district = await District.create({
 *   name: 'Springfield Unified School District',
 *   code: 'SPRINGFIELD-USD',
 *   address: '100 Education Way',
 *   city: 'Springfield',
 *   state: 'CA',
 *   zipCode: '90210',
 *   phone: '555-1000',
 *   email: 'admin@springfield.edu'
 * });
 *
 * @example
 * // Find all active districts
 * const districts = await District.findAll({
 *   where: { isActive: true }
 * });
 *
 * @security District code must be unique for system-wide identification
 * @security At least one contact method (phone, email, address) required
 */
export class District extends Model<DistrictAttributes, DistrictCreationAttributes> implements DistrictAttributes {
  /** @property {string} id - Primary key UUID */
  public id!: string;

  /**
   * @property {string} name - District name
   * @validation 2-200 characters
   */
  public name!: string;

  /**
   * @property {string} code - Unique district identifier code
   * @validation 2-50 characters, uppercase letters/numbers/hyphens/underscores only
   * @security Must be unique across entire system
   */
  public code!: string;

  /**
   * @property {string} address - Street address
   * @validation Max 500 characters
   */
  public address?: string;

  /**
   * @property {string} city - City name
   * @validation Max 100 characters
   */
  public city?: string;

  /**
   * @property {string} state - Two-letter state abbreviation
   * @validation Must be 2 uppercase letters (e.g., "CA", "NY")
   */
  public state?: string;

  /**
   * @property {string} zipCode - ZIP code
   * @validation Format: 12345 or 12345-6789
   */
  public zipCode?: string;

  /**
   * @property {string} phone - District phone number
   * @validation 10-20 characters, numbers/spaces/dashes/parentheses/plus/dots allowed
   */
  public phone?: string;

  /**
   * @property {string} email - District email address
   * @validation Must be valid email format, max 255 characters
   */
  public email?: string;

  /**
   * @property {boolean} isActive - District active status
   * @default true
   * @security Inactive districts are excluded from normal queries
   */
  public isActive!: boolean;

  /**
   * @property {Date} createdAt - Record creation timestamp
   * @readonly
   */
  public readonly createdAt!: Date;

  /**
   * @property {Date} updatedAt - Record last update timestamp
   * @readonly
   */
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
