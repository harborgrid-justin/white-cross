/**
 * @fileoverview Vendor Database Model
 * @module database/models/inventory/Vendor
 * @description Sequelize model for managing vendor/supplier information
 *
 * Key Features:
 * - Centralized vendor contact information
 * - Performance rating system (1-5 stars)
 * - Payment terms tracking
 * - Tax ID for 1099 reporting
 * - Active/inactive vendor management
 *
 * @business Vendors must be pre-approved before purchase orders can be created
 * @business Rating system helps procurement teams select reliable suppliers
 * @business Inactive vendors are retained for historical purchase order references
 * @business Tax ID required for vendors receiving >$600 annually (IRS 1099 reporting)
 *
 * @requires sequelize
 */

/**
 * LOC: BE3951A7B1
 * WC-GEN-084 | Vendor.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';

/**
 * @interface VendorAttributes
 * @description Defines the complete structure of a vendor record
 *
 * @property {string} id - Unique identifier (UUID v4)
 * @property {string} name - Vendor/supplier company name (required, 1-255 characters)
 * @property {string} [contactName] - Primary contact person name
 * @property {string} [email] - Contact email address
 * @property {string} [phone] - Contact phone number
 * @property {string} [address] - Physical or mailing address (up to 1000 characters)
 * @property {string} [website] - Vendor website URL
 * @property {string} [taxId] - Tax ID/EIN for 1099 reporting (up to 50 characters)
 * @property {string} [paymentTerms] - Payment terms (e.g., "Net 30", "2/10 Net 30")
 * @property {string} [notes] - Additional vendor notes (up to 10,000 characters)
 * @property {boolean} isActive - Whether vendor is currently active
 * @property {number} [rating] - Performance rating (1-5 stars)
 * @property {Date} createdAt - Record creation timestamp
 * @property {Date} updatedAt - Record last update timestamp
 *
 * @business Performance rating considerations:
 * - 5 stars: Excellent service, on-time delivery, accurate orders
 * - 4 stars: Good service, minor issues
 * - 3 stars: Acceptable service, some concerns
 * - 2 stars: Poor service, frequent issues
 * - 1 star: Unacceptable service, consider replacement
 */
export interface VendorAttributes {
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

/**
 * @interface VendorCreationAttributes
 * @description Attributes required/optional when creating a new vendor
 * @extends {Optional<VendorAttributes>}
 *
 * Required on creation:
 * - name (vendor company name)
 *
 * Optional on creation (with defaults where noted):
 * - id (auto-generated UUID)
 * - createdAt, updatedAt (auto-generated)
 * - contactName, email, phone, address, website
 * - taxId, paymentTerms, notes
 * - isActive (defaults to true)
 * - rating (initially null, updated based on performance)
 */
interface VendorCreationAttributes
  extends Optional<VendorAttributes, 'id' | 'createdAt' | 'updatedAt' | 'contactName' | 'email' | 'phone' | 'address' | 'website' | 'taxId' | 'paymentTerms' | 'notes' | 'isActive' | 'rating'> {}

/**
 * @class Vendor
 * @extends {Model<VendorAttributes, VendorCreationAttributes>}
 * @description Sequelize model for vendor/supplier records
 *
 * Manages supplier information for procurement workflows. Tracks contact
 * information, payment terms, and performance ratings.
 *
 * @example
 * // Create a new vendor
 * const vendor = await Vendor.create({
 *   name: "MediSupply Healthcare Inc.",
 *   contactName: "Jane Smith",
 *   email: "orders@medisupply.com",
 *   phone: "555-0123",
 *   address: "123 Medical Plaza, Suite 100, Healthcare City, ST 12345",
 *   website: "https://www.medisupply.com",
 *   taxId: "12-3456789",
 *   paymentTerms: "Net 30",
 *   rating: 5,
 *   notes: "Preferred supplier for first aid supplies. Volume discount available."
 * });
 *
 * @example
 * // Find top-rated active vendors
 * const topVendors = await Vendor.findAll({
 *   where: {
 *     isActive: true,
 *     rating: { [Op.gte]: 4 }
 *   },
 *   order: [['rating', 'DESC'], ['name', 'ASC']]
 * });
 *
 * @example
 * // Deactivate vendor (retain for history)
 * await vendor.update({ isActive: false, notes: "Vendor discontinued service" });
 */
export class Vendor extends Model<VendorAttributes, VendorCreationAttributes> implements VendorAttributes {
  /**
   * @property {string} id - Unique identifier (UUID v4)
   */
  public id!: string;

  /**
   * @property {string} name - Vendor company name
   * @validation Required, 1-255 characters, non-empty
   * @business Should be official legal business name for contracts
   */
  public name!: string;

  /**
   * @property {string} [contactName] - Primary contact person
   * @validation Optional, up to 255 characters
   * @business Should be updated when contact person changes
   */
  public contactName?: string;

  /**
   * @property {string} [email] - Contact email
   * @validation Optional, must be valid email format, up to 255 characters
   * @business Used for order confirmations and communications
   */
  public email?: string;

  /**
   * @property {string} [phone] - Contact phone number
   * @validation Optional, up to 50 characters
   * @business Include extension if applicable
   */
  public phone?: string;

  /**
   * @property {string} [address] - Physical/mailing address
   * @validation Optional, up to 1000 characters
   * @business Complete address for shipping and billing
   */
  public address?: string;

  /**
   * @property {string} [website] - Vendor website URL
   * @validation Optional, must be valid URL, up to 255 characters
   * @business Link to vendor's ordering portal or product catalog
   */
  public website?: string;

  /**
   * @property {string} [taxId] - Tax ID/EIN
   * @validation Optional, up to 50 characters
   * @business Required for 1099 reporting if vendor receives >$600 annually
   * @business Format: XX-XXXXXXX for EIN
   */
  public taxId?: string;

  /**
   * @property {string} [paymentTerms] - Payment terms
   * @validation Optional, up to 255 characters
   * @business Common terms: "Net 30", "Net 60", "2/10 Net 30" (2% discount if paid in 10 days)
   * @business Should match vendor's invoice terms
   */
  public paymentTerms?: string;

  /**
   * @property {string} [notes] - Additional vendor notes
   * @validation Optional, up to 10,000 characters
   * @business Can include account numbers, special instructions, discount info
   */
  public notes?: string;

  /**
   * @property {boolean} isActive - Active status
   * @validation Required boolean
   * @default true
   * @business Set to false to deactivate without deleting historical data
   * @business Inactive vendors cannot be selected for new purchase orders
   */
  public isActive!: boolean;

  /**
   * @property {number} [rating] - Performance rating (1-5 stars)
   * @validation Optional, integer between 1 and 5
   * @business Based on delivery timeliness, order accuracy, product quality
   * @business Updated periodically based on purchase order performance
   * @business Used to prioritize vendors in procurement decisions
   */
  public rating?: number;

  /**
   * @property {Date} createdAt - Record creation timestamp
   * @readonly Auto-generated on creation
   */
  public readonly createdAt!: Date;

  /**
   * @property {Date} updatedAt - Last update timestamp
   * @readonly Auto-updated on any modification
   */
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
