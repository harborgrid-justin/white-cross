/**
 * @fileoverview Emergency Contact Database Model
 * @module database/models/core/EmergencyContact
 * @description Sequelize model for managing student emergency contacts including parents, guardians,
 * and authorized contacts for emergency situations. Supports contact verification, notification preferences,
 * and pickup authorization tracking for student safety and compliance.
 *
 * Key Features:
 * - Priority-based contact management (primary, secondary, emergency-only)
 * - Multi-channel notification support (SMS, email, voice)
 * - Contact verification workflow (unverified → pending → verified/failed)
 * - Student pickup authorization tracking
 * - Relationship validation with predefined types
 * - Phone number international format support
 * - Email validation with disposable domain prevention
 * - Active/inactive status for contact lifecycle management
 *
 * Business Rules:
 * - Each student must have at least one PRIMARY contact
 * - PRIMARY contacts are contacted first in emergencies
 * - SECONDARY contacts are contacted if primary is unavailable
 * - EMERGENCY_ONLY contacts are only used for critical situations
 * - Phone number is required, email is optional
 * - Contact verification recommended annually
 * - Pickup authorization must be explicitly set
 *
 * @security Emergency contacts contain personally identifiable information (PII)
 * @compliance FERPA - Emergency contacts are part of student directory information
 * @compliance State regulations - Required for student enrollment
 * @audit Contact modifications logged for liability protection
 *
 * @requires sequelize - ORM for database operations
 * @requires ../../config/sequelize
 * @requires ../../types/enums
 *
 * LOC: 90ECFB0FE3
 * WC-GEN-053 | EmergencyContact.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *   - enums.ts (database/types/enums.ts)
 *   - Student.ts (associations)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 *   - EmergencyContactRepository.ts (database/repositories/impl/)
 *   - Emergency notification services
 */

import { Model, DataTypes, Optional, Association } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { ContactPriority } from '../../types/enums';

/**
 * Valid relationship types for emergency contacts.
 *
 * @constant {string[]} VALID_RELATIONSHIPS
 * @description Allowed values for relationship field to ensure data consistency
 * and proper categorization of emergency contacts.
 *
 * @business Relationship types help prioritize contacts and determine legal authority:
 * - PARENT/GUARDIAN: Have full legal authority and highest priority
 * - SIBLING/GRANDPARENT/AUNT_UNCLE: Family members with potential pickup authorization
 * - FAMILY_FRIEND/NEIGHBOR: Trusted non-family contacts
 * - OTHER: Catch-all for non-standard relationships
 */
const VALID_RELATIONSHIPS = [
  'PARENT',
  'GUARDIAN',
  'SIBLING',
  'GRANDPARENT',
  'AUNT_UNCLE',
  'FAMILY_FRIEND',
  'NEIGHBOR',
  'OTHER'
];

/**
 * Valid notification channels for emergency contact communication.
 *
 * @constant {readonly string[]} VALID_NOTIFICATION_CHANNELS
 * @description Supported communication channels for emergency notifications.
 *
 * @example
 * ```typescript
 * const channels: NotificationChannel[] = ['sms', 'email'];
 * contact.notificationChannels = JSON.stringify(channels);
 * ```
 */
export const VALID_NOTIFICATION_CHANNELS = ['sms', 'email', 'voice'] as const;

/**
 * Type definition for notification channels.
 *
 * @typedef {typeof VALID_NOTIFICATION_CHANNELS[number]} NotificationChannel
 * @description Union type of valid notification channels (sms | email | voice).
 */
export type NotificationChannel = typeof VALID_NOTIFICATION_CHANNELS[number];

/**
 * @interface EmergencyContactAttributes
 * @description TypeScript interface defining all EmergencyContact model attributes.
 * Emergency contacts are critical for student safety and legal compliance, containing
 * contact information, relationship details, and notification preferences.
 *
 * @property {string} id - Primary key, auto-generated UUID
 * @property {string} studentId - Foreign key to Student model (cascade delete)
 * @property {string} firstName - Contact's first name, 1-100 chars, letters/spaces/hyphens/apostrophes only
 * @property {string} lastName - Contact's last name, 1-100 chars, letters/spaces/hyphens/apostrophes only
 * @property {string} relationship - Relationship to student (PARENT, GUARDIAN, SIBLING, GRANDPARENT, etc.)
 * @property {string} phoneNumber - Primary phone number, 10-20 chars, international format supported
 * @property {string} [email] - Email address, validated format, disposable domains blocked (optional)
 * @property {string} [address] - Physical address, max 500 chars (optional)
 * @property {ContactPriority} priority - Contact priority (PRIMARY, SECONDARY, EMERGENCY_ONLY)
 * @property {boolean} isActive - Whether contact is currently active, defaults to true
 * @property {'SMS'|'EMAIL'|'VOICE'|'ANY'} [preferredContactMethod] - Preferred communication method (optional)
 * @property {'UNVERIFIED'|'PENDING'|'VERIFIED'|'FAILED'} [verificationStatus] - Contact verification status (optional)
 * @property {Date} [lastVerifiedAt] - Timestamp of last successful verification (optional)
 * @property {string} [notificationChannels] - JSON array of notification channels (sms, email, voice) (optional)
 * @property {boolean} [canPickupStudent] - Whether contact is authorized for student pickup (optional)
 * @property {string} [notes] - Additional notes, max 1000 chars (optional)
 * @property {Date} createdAt - Record creation timestamp
 * @property {Date} updatedAt - Record last update timestamp
 *
 * @security PII - Contains personally identifiable information requiring protection
 */
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
  preferredContactMethod?: 'SMS' | 'EMAIL' | 'VOICE' | 'ANY';
  verificationStatus?: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'FAILED';
  lastVerifiedAt?: Date;
  notificationChannels?: string; // JSON array stored as string
  canPickupStudent?: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @interface EmergencyContactCreationAttributes
 * @description Attributes required when creating a new EmergencyContact instance.
 * Extends EmergencyContactAttributes with optional fields that have defaults or are auto-generated.
 * All fields except studentId, firstName, lastName, relationship, and phoneNumber are optional.
 */
interface EmergencyContactCreationAttributes
  extends Optional<
    EmergencyContactAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'email' | 'address' | 'preferredContactMethod' | 'verificationStatus' | 'lastVerifiedAt' | 'notificationChannels' | 'canPickupStudent' | 'notes'
  > {}

/**
 * @class EmergencyContact
 * @extends Model
 * @description Emergency Contact model for managing student emergency contact information.
 * Provides critical contact information for emergency situations, student pickup authorization,
 * and multi-channel notification capabilities.
 *
 * @tablename emergency_contacts
 *
 * Priority System:
 * - PRIMARY: First contact in emergencies, typically parents/guardians
 * - SECONDARY: Backup contacts if primary unavailable
 * - EMERGENCY_ONLY: Only contacted for critical situations
 *
 * Verification Workflow:
 * 1. UNVERIFIED: Contact added but not yet verified
 * 2. PENDING: Verification in progress
 * 3. VERIFIED: Contact confirmed and trusted
 * 4. FAILED: Verification failed, contact may be outdated
 *
 * Notification Channels:
 * - SMS: Text message to phone number
 * - EMAIL: Email notification
 * - VOICE: Voice call to phone number
 *
 * Student Pickup Authorization:
 * - canPickupStudent flag controls who can pick up student from school
 * - Typically enabled for parents, guardians, and authorized family members
 * - Requires verification and identification at pickup
 *
 * Computed Properties:
 * - fullName: Concatenated first and last name
 * - isPrimary: Boolean indicating if contact has PRIMARY priority
 * - isVerified: Boolean indicating if verification status is VERIFIED
 * - parsedNotificationChannels: Parsed array of notification channels
 *
 * @example
 * // Create primary emergency contact (parent)
 * const primaryContact = await EmergencyContact.create({
 *   studentId: 'student-uuid',
 *   firstName: 'Jane',
 *   lastName: 'Doe',
 *   relationship: 'PARENT',
 *   phoneNumber: '+1-555-123-4567',
 *   email: 'jane.doe@example.com',
 *   priority: ContactPriority.PRIMARY,
 *   preferredContactMethod: 'SMS',
 *   canPickupStudent: true,
 *   notificationChannels: JSON.stringify(['sms', 'email'])
 * });
 *
 * @example
 * // Create emergency-only contact (neighbor)
 * const emergencyContact = await EmergencyContact.create({
 *   studentId: 'student-uuid',
 *   firstName: 'Bob',
 *   lastName: 'Smith',
 *   relationship: 'NEIGHBOR',
 *   phoneNumber: '(555) 987-6543',
 *   priority: ContactPriority.EMERGENCY_ONLY,
 *   canPickupStudent: false
 * });
 *
 * @example
 * // Verify contact and authorize pickup
 * contact.verificationStatus = 'VERIFIED';
 * contact.lastVerifiedAt = new Date();
 * contact.canPickupStudent = true;
 * await contact.save();
 *
 * @example
 * // Find all primary contacts for a student
 * const primaryContacts = await EmergencyContact.findAll({
 *   where: {
 *     studentId: 'student-uuid',
 *     priority: ContactPriority.PRIMARY,
 *     isActive: true
 *   },
 *   order: [['createdAt', 'ASC']]
 * });
 *
 * @security PII - Contains personally identifiable information
 * @compliance FERPA - Directory information with opt-out provisions
 * @legal Retention requirement: 7 years after student withdrawal
 */
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
  public preferredContactMethod?: 'SMS' | 'EMAIL' | 'VOICE' | 'ANY';
  public verificationStatus?: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'FAILED';
  public lastVerifiedAt?: Date;
  public notificationChannels?: string;
  public canPickupStudent?: boolean;
  public notes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association
  public student?: any; // Will be properly typed when Student model is imported

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get isPrimary(): boolean {
    return this.priority === ContactPriority.PRIMARY;
  }

  get isVerified(): boolean {
    return this.verificationStatus === 'VERIFIED';
  }

  get parsedNotificationChannels(): NotificationChannel[] {
    if (!this.notificationChannels) return [];
    try {
      return JSON.parse(this.notificationChannels);
    } catch {
      return [];
    }
  }

  // Association declarations
  public static associations: {
    student: Association<EmergencyContact, any>;
  };
}

EmergencyContact.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    /**
     * Foreign key reference to Student this emergency contact belongs to
     *
     * @type {string}
     * @description Links emergency contact to specific student. When student is deleted, all their emergency contacts are removed.
     * @foreignKey references students(id) ON DELETE CASCADE
     * @security Emergency contacts are student-specific and removed when student record is deleted
     * @compliance FERPA - Emergency contact information tied to student lifecycle
     */
    studentId: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: 'students',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      comment: 'Foreign key to students table - emergency contact owner',
      validate: {
        isUUID: {
          args: 4,
          msg: 'Student ID must be a valid UUID'
        }
      }
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'First name is required'
        },
        len: {
          args: [1, 100],
          msg: 'First name must be between 1 and 100 characters'
        },
        isValidName(value: string) {
          if (!/^[a-zA-Z\s'-]+$/.test(value)) {
            throw new Error('First name can only contain letters, spaces, hyphens, and apostrophes');
          }
        }
      }
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Last name is required'
        },
        len: {
          args: [1, 100],
          msg: 'Last name must be between 1 and 100 characters'
        },
        isValidName(value: string) {
          if (!/^[a-zA-Z\s'-]+$/.test(value)) {
            throw new Error('Last name can only contain letters, spaces, hyphens, and apostrophes');
          }
        }
      }
    },
    relationship: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Relationship is required'
        },
        len: {
          args: [1, 50],
          msg: 'Relationship must be between 1 and 50 characters'
        },
        isValidRelationship(value: string) {
          const upperValue = value.toUpperCase();
          if (!VALID_RELATIONSHIPS.includes(upperValue)) {
            throw new Error(
              `Relationship must be one of: ${VALID_RELATIONSHIPS.join(', ')}`
            );
          }
        }
      }
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Phone number is required'
        },
        isValidPhone(value: string) {
          // Enhanced international phone number validation
          // Supports: US, Canada, international formats with country codes
          const cleanPhone = value.replace(/[\s\-().]/g, '');

          // International format: +1 to +999 followed by 7-15 digits
          const internationalRegex = /^\+\d{1,3}\d{7,15}$/;

          // US/Canada format: optional +1, then 10 digits
          const northAmericaRegex = /^(\+?1)?\d{10}$/;

          if (!internationalRegex.test(cleanPhone) && !northAmericaRegex.test(cleanPhone)) {
            throw new Error(
              'Phone number must be a valid format. Examples: +1-555-123-4567, (555) 123-4567, +44 20 1234 5678'
            );
          }

          // Ensure it's not all the same digit (e.g., 1111111111)
          if (/^(\d)\1+$/.test(cleanPhone.replace(/^\+/, ''))) {
            throw new Error('Phone number cannot be all the same digit');
          }
        },
        len: {
          args: [10, 20],
          msg: 'Phone number must be between 10 and 20 characters'
        }
      }
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: {
          msg: 'Email must be a valid email address'
        },
        len: {
          args: [0, 255],
          msg: 'Email cannot exceed 255 characters'
        },
        isValidEmailFormat(value: string) {
          if (value) {
            // Enhanced email validation
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(value)) {
              throw new Error('Email must be a valid format (e.g., contact@example.com)');
            }

            // Prevent common disposable email domains for security
            const disposableDomains = ['tempmail.com', 'throwaway.email', '10minutemail.com'];
            const domain = value.split('@')[1]?.toLowerCase();
            if (domain && disposableDomains.includes(domain)) {
              throw new Error('Disposable email addresses are not allowed');
            }
          }
        }
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 500],
          msg: 'Address cannot exceed 500 characters'
        }
      }
    },
    priority: {
      type: DataTypes.ENUM(...Object.values(ContactPriority)),
      allowNull: false,
      defaultValue: ContactPriority.PRIMARY,
      validate: {
        isIn: {
          args: [Object.values(ContactPriority)],
          msg: 'Priority must be PRIMARY, SECONDARY, or EMERGENCY_ONLY'
        }
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      validate: {
        isBoolean(value: any) {
          if (typeof value !== 'boolean') {
            throw new Error('Active status must be a boolean');
          }
        }
      }
    },
    preferredContactMethod: {
      type: DataTypes.ENUM('SMS', 'EMAIL', 'VOICE', 'ANY'),
      allowNull: true,
      defaultValue: 'ANY',
      validate: {
        isIn: {
          args: [['SMS', 'EMAIL', 'VOICE', 'ANY']],
          msg: 'Preferred contact method must be SMS, EMAIL, VOICE, or ANY'
        }
      }
    },
    verificationStatus: {
      type: DataTypes.ENUM('UNVERIFIED', 'PENDING', 'VERIFIED', 'FAILED'),
      allowNull: true,
      defaultValue: 'UNVERIFIED',
      validate: {
        isIn: {
          args: [['UNVERIFIED', 'PENDING', 'VERIFIED', 'FAILED']],
          msg: 'Verification status must be UNVERIFIED, PENDING, VERIFIED, or FAILED'
        }
      }
    },
    lastVerifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          msg: 'Last verified date must be a valid date',
          args: true
        },
        isNotFuture(value: Date) {
          if (value && new Date(value) > new Date()) {
            throw new Error('Last verified date cannot be in the future');
          }
        }
      }
    },
    notificationChannels: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        isValidJSON(value: string) {
          if (value) {
            try {
              const channels = JSON.parse(value);
              if (!Array.isArray(channels)) {
                throw new Error('Notification channels must be an array');
              }
              // Validate each channel
              for (const channel of channels) {
                if (!VALID_NOTIFICATION_CHANNELS.includes(channel)) {
                  throw new Error(
                    `Invalid notification channel: ${channel}. Must be one of: ${VALID_NOTIFICATION_CHANNELS.join(', ')}`
                  );
                }
              }
            } catch (error) {
              if (error instanceof Error && error.message.includes('Invalid notification')) {
                throw error;
              }
              throw new Error('Notification channels must be valid JSON array');
            }
          }
        }
      }
    },
    canPickupStudent: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      validate: {
        isBoolean(value: any) {
          if (value !== null && value !== undefined && typeof value !== 'boolean') {
            throw new Error('Can pickup student must be a boolean');
          }
        }
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 1000],
          msg: 'Notes cannot exceed 1000 characters'
        }
      }
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
      { fields: ['verificationStatus'] },
    ],
  }
);
