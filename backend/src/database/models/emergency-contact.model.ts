import { Table, Column, Model, DataType, PrimaryKey, Default, CreatedAt, UpdatedAt, Index, ForeignKey, BelongsTo, Scopes, BeforeCreate, BeforeUpdate } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { Op } from 'sequelize';
import type { Student } from './student.model';

import { ContactPriority } from '../../contact/enums/contact-priority.enum';
import { VerificationStatus } from '../../contact/enums/verification-status.enum';
import { PreferredContactMethod } from '../../contact/enums/preferred-contact-method.enum';
import { NotificationChannel } from '../../contact/enums/notification-channel.enum';

/**
 * Emergency Contact Attributes
 * Complete set of attributes for an emergency contact record
 */
export interface EmergencyContactAttributes {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  relationship: string;
  phoneNumber: string;
  email: string | null;
  address: string | null;
  priority: ContactPriority;
  isActive: boolean;
  preferredContactMethod: PreferredContactMethod | null;
  verificationStatus: VerificationStatus | null;
  lastVerifiedAt: Date | null;
  notificationChannels: string | null;
  canPickupStudent: boolean | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Emergency Contact Creation Attributes
 * Attributes required/allowed when creating a new emergency contact
 * Excludes auto-generated fields (id, createdAt, updatedAt)
 */
export interface EmergencyContactCreationAttributes
  extends Optional<
    EmergencyContactAttributes,
    | 'id'
    | 'email'
    | 'address'
    | 'priority'
    | 'isActive'
    | 'preferredContactMethod'
    | 'verificationStatus'
    | 'lastVerifiedAt'
    | 'notificationChannels'
    | 'canPickupStudent'
    | 'notes'
    | 'createdAt'
    | 'updatedAt'
  > {}

/**
 * Emergency Contact Model
 * Sequelize model for managing student emergency contacts
 *
 * Key Features:
 * - Priority-based contact management (primary, secondary, emergency-only)
 * - Multi-channel notification support (SMS, email, voice)
 * - Contact verification workflow (unverified → pending → verified/failed)
 * - Student pickup authorization tracking
 */
@Scopes(() => ({
  active: {
    where: {
      isActive: true
    }
  },
  byStudent: (studentId: string) => ({
    where: { studentId }
  }),
  primary: {
    where: {
      priority: ContactPriority.PRIMARY,
      isActive: true
    }
  },
  verified: {
    where: {
      verificationStatus: VerificationStatus.VERIFIED,
      isActive: true
    }
  },
  canPickup: {
    where: {
      canPickupStudent: true,
      isActive: true,
      verificationStatus: VerificationStatus.VERIFIED
    }
  },
  unverified: {
    where: {
      verificationStatus: {
        [Op.in]: [VerificationStatus.UNVERIFIED, VerificationStatus.PENDING]
      },
      isActive: true
    }
  }
}))
@Table({
  tableName: 'emergency_contacts',
  timestamps: true,
  underscored: false,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    { name: 'idx_emergency_contacts_student_id', fields: ['studentId'] },
    { name: 'idx_emergency_contacts_is_active', fields: ['isActive'] },
    { name: 'idx_emergency_contacts_priority', fields: ['priority'] },
    { name: 'idx_emergency_contacts_verification_status', fields: ['verificationStatus'] },
    { name: 'idx_emergency_contacts_student_priority', fields: ['studentId', 'priority', 'isActive'] },
    {
      fields: ['createdAt'],
      name: 'idx_emergency_contact_created_at'
    },
    {
      fields: ['updatedAt'],
      name: 'idx_emergency_contact_updated_at'
    }
  ]
  })
export class EmergencyContact extends Model<EmergencyContactAttributes, EmergencyContactCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => require('./student.model').Student)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'Foreign key to students table - emergency contact owner'
  })
  studentId: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false
  })
  firstName: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false
  })
  lastName: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false
  })
  relationship: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    validate: {
      is: {
        args: /^\+?[1-9]\d{1,14}$/,
        msg: 'Phone number must be in E.164 format or standard US format'
      }
    }
  })
  phoneNumber: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    validate: {
      isEmail: {
        msg: 'Must be a valid email address'
      }
    }
  })
  email: string | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  address: string | null;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(ContactPriority)]
    },
    allowNull: false,
    defaultValue: ContactPriority.PRIMARY
  })
  priority: ContactPriority;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true
  })
  isActive: boolean;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(PreferredContactMethod)]
    },
    allowNull: true,
    defaultValue: PreferredContactMethod.ANY
  })
  preferredContactMethod: PreferredContactMethod | null;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(VerificationStatus)]
    },
    allowNull: true,
    defaultValue: VerificationStatus.UNVERIFIED
  })
  verificationStatus: VerificationStatus | null;

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  lastVerifiedAt: Date | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'JSON array of notification channels (sms, email, voice)'
  })
  notificationChannels: string | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false
  })
  canPickupStudent: boolean | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  notes: string | null;

  @CreatedAt
  @Column({
    type: DataType.DATE
  })
  declare createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE
  })
  declare updatedAt: Date;

  // Relationships
  @BelongsTo(() => require('./student.model').Student, { foreignKey: 'studentId', as: 'student' })
  declare student?: Student;

  /**
   * Get full name
   */
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * Check if this is a primary contact
   */
  get isPrimary(): boolean {
    return this.priority === ContactPriority.PRIMARY;
  }

  /**
   * Check if contact is verified
   */
  get isVerified(): boolean {
    return this.verificationStatus === VerificationStatus.VERIFIED;
  }

  /**
   * Parse notification channels from JSON string
   */
  get parsedNotificationChannels(): NotificationChannel[] {
    if (!this.notificationChannels) return [];
    try {
      return JSON.parse(this.notificationChannels);
    } catch {
      return [];
    }
  }


  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: EmergencyContact) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      const phiFields = ['firstName', 'lastName', 'phoneNumber', 'email', 'address'];

      // Import the helper function dynamically to avoid circular dependencies
      const { logModelPHIFieldChanges } = await import('@/database/services/model-audit-helper.service');

      // Get the transaction if available
      const transaction = (instance as any).sequelize?.transaction || undefined;

      await logModelPHIFieldChanges(
        'EmergencyContact',
        instance.id,
        changedFields,
        phiFields,
        transaction,
      );
    }
  }
}