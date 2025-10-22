/**
 * @fileoverview School Database Model
 * @module database/models/administration/School
 * @description Sequelize model for school information and organizational hierarchy.
 * Schools belong to districts and contain students, nurses, and other staff members.
 * Critical for multi-tenant data isolation and RBAC scope management.
 *
 * Key Features:
 * - School organizational hierarchy (belongs to District)
 * - Unique school codes for identification across system
 * - Contact information and administrative details
 * - Enrollment tracking for capacity planning
 * - Active/inactive status for school lifecycle management
 * - Comprehensive validation for data integrity
 *
 * @security Schools provide data isolation boundary for multi-tenant access control
 * @security Users scoped to schools can only access their school's data
 * @compliance FERPA - School-level data segregation for educational records
 * @compliance HIPAA - Organizational entity for PHI access control
 *
 * @requires sequelize - ORM for database operations
 *
 * LOC: 081E4F93E5
 * WC-GEN-038 | School.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *   - District.ts - Parent organizational unit
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 *   - SchoolRepository.ts (database/repositories/impl/SchoolRepository.ts)
 *   - User.ts - Users belong to schools
 *   - Student.ts - Students belong to schools
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';

/**
 * @interface SchoolAttributes
 * @description TypeScript interface defining all School model attributes
 *
 * @property {string} id - Primary key, auto-generated UUID
 * @property {string} districtId - Foreign key to parent District
 * @property {string} name - School name (e.g., "Lincoln Elementary School")
 * @property {string} code - Unique school code (e.g., "LINCOLN-ELEM")
 * @property {string} [address] - Street address
 * @property {string} [city] - City name
 * @property {string} [state] - Two-letter state abbreviation (e.g., "CA")
 * @property {string} [zipCode] - ZIP code in format 12345 or 12345-6789
 * @property {string} [phone] - School phone number
 * @property {string} [email] - School email address
 * @property {string} [principal] - Principal's name
 * @property {number} [totalEnrollment] - Current student enrollment count
 * @property {boolean} isActive - School active status (for lifecycle management)
 * @property {Date} createdAt - Record creation timestamp
 * @property {Date} updatedAt - Record last update timestamp
 */
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

/**
 * @interface SchoolCreationAttributes
 * @description Attributes required when creating a new School instance.
 * Extends SchoolAttributes with optional fields that have defaults or are auto-generated.
 */
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

/**
 * @class School
 * @extends Model
 * @description School model representing educational institutions within the district hierarchy.
 * Provides organizational structure for multi-tenant data isolation and RBAC scope management.
 *
 * @tablename schools
 *
 * Organizational Hierarchy:
 * - District (parent) → School (this model) → Students, Users, Health Records
 * - Users with school-level access can only view/modify data for their assigned school
 * - District administrators can access all schools within their district
 * - Super admins can access all schools across all districts
 *
 * Data Isolation:
 * - School ID is used as scope boundary for multi-tenant access control
 * - Nurses assigned to a school can only access students from that school
 * - Reports and analytics are filtered by school unless user has district/super access
 *
 * @example
 * // Create a new school
 * const school = await School.create({
 *   districtId: 'district-uuid',
 *   name: 'Lincoln Elementary School',
 *   code: 'LINCOLN-ELEM',
 *   address: '123 Main St',
 *   city: 'Springfield',
 *   state: 'CA',
 *   zipCode: '90210',
 *   phone: '555-1234',
 *   email: 'info@lincoln.edu',
 *   principal: 'Jane Smith',
 *   totalEnrollment: 450
 * });
 *
 * @example
 * // Find all active schools in a district
 * const schools = await School.findAll({
 *   where: { districtId: 'district-uuid', isActive: true }
 * });
 *
 * @security School code must be unique for system-wide identification
 * @security At least one contact method (phone, email, address) required
 */
export class School extends Model<SchoolAttributes, SchoolCreationAttributes> implements SchoolAttributes {
  /** @property {string} id - Primary key UUID */
  public id!: string;

  /**
   * @property {string} districtId - Foreign key to District model
   * @security Required for organizational hierarchy and RBAC scoping
   */
  public districtId!: string;

  /**
   * @property {string} name - School name
   * @validation 2-200 characters
   */
  public name!: string;

  /**
   * @property {string} code - Unique school identifier code
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
   * @property {string} phone - School phone number
   * @validation 10-20 characters, numbers/spaces/dashes/parentheses/plus/dots allowed
   */
  public phone?: string;

  /**
   * @property {string} email - School email address
   * @validation Must be valid email format, max 255 characters
   */
  public email?: string;

  /**
   * @property {string} principal - Principal's name
   * @validation Max 200 characters
   */
  public principal?: string;

  /**
   * @property {number} totalEnrollment - Current student enrollment
   * @validation 0-50,000
   */
  public totalEnrollment?: number;

  /**
   * @property {boolean} isActive - School active status
   * @default true
   * @security Inactive schools are excluded from normal queries
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
      validate: {
        notEmpty: {
          msg: 'District ID is required for school'
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'School name cannot be empty'
        },
        len: {
          args: [2, 200],
          msg: 'School name must be between 2 and 200 characters'
        }
      }
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'School code cannot be empty'
        },
        len: {
          args: [2, 50],
          msg: 'School code must be between 2 and 50 characters'
        },
        isUppercase: {
          msg: 'School code must be uppercase'
        },
        is: {
          args: /^[A-Z0-9_-]+$/,
          msg: 'School code can only contain uppercase letters, numbers, hyphens, and underscores'
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
    principal: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 200],
          msg: 'Principal name cannot exceed 200 characters'
        }
      }
    },
    totalEnrollment: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: {
          args: [0],
          msg: 'Total enrollment cannot be negative'
        },
        max: {
          args: [50000],
          msg: 'Total enrollment cannot exceed 50,000'
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
    tableName: 'schools',
    timestamps: true,
    indexes: [{ fields: ['districtId'] }, { fields: ['code'] }, { fields: ['isActive'] }],
    validate: {
      // Custom validation to ensure at least contact information is provided
      hasContactInfo() {
        if (!this.phone && !this.email && !this.address) {
          throw new Error('School must have at least one form of contact information (phone, email, or address)');
        }
      }
    }
  }
);
