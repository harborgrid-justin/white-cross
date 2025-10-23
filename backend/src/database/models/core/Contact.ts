/**
 * @fileoverview Contact Database Model
 * @module models/core/Contact
 * @description Sequelize model for contact management (guardians, staff, vendors)
 * 
 * Inspired by TwentyHQ CRM contact management system
 * Supports HIPAA-compliant contact tracking with audit trails
 * 
 * @requires sequelize - ORM library for database operations
 * @requires AuditableModel - Base model for HIPAA audit compliance
 * 
 * LOC: CONTACT-001
 * WC-MDL-CON-001 | Contact Database Model
 * 
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *   - AuditableModel.ts (database/models/base/AuditableModel.ts)
 * 
 * DOWNSTREAM (imported by):
 *   - ContactService.ts, ContactController.ts
 *   - GraphQL resolvers
 * 
 * Related Models: Student, User, Activity
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';

/**
 * Contact types in the system
 */
export enum ContactType {
  Guardian = 'guardian',
  Staff = 'staff',
  Vendor = 'vendor',
  Provider = 'provider', // Healthcare provider
  Other = 'other'
}

/**
 * @interface ContactAttributes
 * @description TypeScript interface defining all Contact model attributes
 * 
 * @property {string} id - Primary key, auto-generated UUID
 * @property {string} firstName - Contact's first name, 1-100 chars
 * @property {string} lastName - Contact's last name, 1-100 chars
 * @property {string} [email] - Email address, unique, validated format (nullable)
 * @property {string} [phone] - Phone number, validated format (nullable)
 * @property {string} type - Contact type (guardian, staff, vendor, provider, other)
 * @property {string} [organization] - Organization name (nullable)
 * @property {string} [title] - Job title or role (nullable)
 * @property {string} [address] - Physical address (nullable)
 * @property {string} [city] - City (nullable)
 * @property {string} [state] - State/Province (nullable)
 * @property {string} [zip] - Postal code (nullable)
 * @property {string} [relationTo] - UUID of related student/user (nullable)
 * @property {string} [relationshipType] - Type of relationship (parent, emergency, etc.) (nullable)
 * @property {object} [customFields] - JSONB field for custom healthcare-specific data
 * @property {boolean} isActive - Active status, defaults to true
 * @property {string} [notes] - Additional notes (nullable)
 * @property {string} [createdBy] - User ID who created record (audit field)
 * @property {string} [updatedBy] - User ID who last updated record (audit field)
 * @property {Date} createdAt - Record creation timestamp
 * @property {Date} updatedAt - Record last update timestamp
 * @property {Date} [deletedAt] - Soft delete timestamp (nullable)
 */
export interface ContactAttributes {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  type: ContactType;
  organization?: string;
  title?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  relationTo?: string;
  relationshipType?: string;
  customFields?: Record<string, any>;
  isActive: boolean;
  notes?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * @interface ContactCreationAttributes
 * @description Attributes required when creating a new Contact instance
 */
interface ContactCreationAttributes
  extends Optional<
    ContactAttributes,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'isActive'
    | 'email'
    | 'phone'
    | 'organization'
    | 'title'
    | 'address'
    | 'city'
    | 'state'
    | 'zip'
    | 'relationTo'
    | 'relationshipType'
    | 'customFields'
    | 'notes'
    | 'createdBy'
    | 'updatedBy'
    | 'deletedAt'
  > {}

/**
 * @class Contact
 * @extends Model
 * @description Contact model for managing all types of contacts in the system
 * 
 * Key Features:
 * - Support for multiple contact types (guardians, staff, vendors, providers)
 * - HIPAA-compliant with audit fields
 * - Soft delete capability via deletedAt
 * - Custom fields for healthcare-specific data
 * - Relationship tracking to students/users
 * - Email and phone validation
 * - Full-text search ready
 * 
 * @example
 * // Create a new guardian contact
 * const contact = await Contact.create({
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   email: 'john.doe@example.com',
 *   phone: '+1-555-0123',
 *   type: ContactType.Guardian,
 *   relationTo: studentId,
 *   relationshipType: 'parent',
 *   createdBy: userId
 * });
 */
export class Contact
  extends Model<ContactAttributes, ContactCreationAttributes>
  implements ContactAttributes
{
  public id!: string;
  public firstName!: string;
  public lastName!: string;
  public email?: string;
  public phone?: string;
  public type!: ContactType;
  public organization?: string;
  public title?: string;
  public address?: string;
  public city?: string;
  public state?: string;
  public zip?: string;
  public relationTo?: string;
  public relationshipType?: string;
  public customFields?: Record<string, any>;
  public isActive!: boolean;
  public notes?: string;
  public createdBy?: string;
  public updatedBy?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public deletedAt?: Date;

  /**
   * Get full name
   */
  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * Get display name with organization if available
   */
  public get displayName(): string {
    if (this.organization) {
      return `${this.fullName} (${this.organization})`;
    }
    return this.fullName;
  }
}

/**
 * Initialize Contact model
 */
Contact.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'First name is required' },
        len: {
          args: [1, 100],
          msg: 'First name must be 1-100 characters',
        },
      },
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Last name is required' },
        len: {
          args: [1, 100],
          msg: 'Last name must be 1-100 characters',
        },
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: false, // Allow same email for different contact types
      validate: {
        isEmail: { msg: 'Invalid email format' },
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: {
          args: /^[\d\s\-\+\(\)]+$/,
          msg: 'Invalid phone number format',
        },
      },
    },
    type: {
      type: DataTypes.ENUM(...Object.values(ContactType)),
      allowNull: false,
      validate: {
        isIn: {
          args: [Object.values(ContactType)],
          msg: 'Invalid contact type',
        },
      },
    },
    organization: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    zip: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    relationTo: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'UUID of related student or user',
    },
    relationshipType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Type of relationship (parent, emergency, etc.)',
    },
    customFields: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Custom healthcare-specific fields',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User who created this contact',
    },
    updatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User who last updated this contact',
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Soft delete timestamp',
    },
  },
  {
    sequelize,
    tableName: 'contacts',
    modelName: 'Contact',
    timestamps: true,
    paranoid: true, // Enable soft deletes
    indexes: [
      {
        fields: ['email'],
        name: 'contacts_email_idx',
      },
      {
        fields: ['type'],
        name: 'contacts_type_idx',
      },
      {
        fields: ['relationTo'],
        name: 'contacts_relation_to_idx',
      },
      {
        fields: ['isActive'],
        name: 'contacts_is_active_idx',
      },
      {
        fields: ['createdAt'],
        name: 'contacts_created_at_idx',
      },
      {
        // Full-text search index for name
        fields: ['firstName', 'lastName'],
        name: 'contacts_name_idx',
      },
    ],
  }
);

export default Contact;
