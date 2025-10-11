import { Model, DataTypes, Optional, Association } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { ContactPriority } from '../../types/enums';

// Valid relationship types for emergency contacts
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

// Valid notification channels
export const VALID_NOTIFICATION_CHANNELS = ['sms', 'email', 'voice'] as const;
export type NotificationChannel = typeof VALID_NOTIFICATION_CHANNELS[number];

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

interface EmergencyContactCreationAttributes
  extends Optional<
    EmergencyContactAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'email' | 'address' | 'preferredContactMethod' | 'verificationStatus' | 'lastVerifiedAt' | 'notificationChannels' | 'canPickupStudent' | 'notes'
  > {}

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
    studentId: {
      type: DataTypes.STRING(36),
      allowNull: false,
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
