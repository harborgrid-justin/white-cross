import {
  BeforeCreate,
  BeforeUpdate,
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  Index,
  Model,
  PrimaryKey,
  Scopes,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Op } from 'sequelize';
import { ContactType } from '../../services/communication/contact/enums/contact-type.enum';

/**
 * Contact Model
 * Sequelize model for contact management (guardians, staff, vendors, providers)
 *
 * Inspired by TwentyHQ CRM contact management system
 * Supports HIPAA-compliant contact tracking with audit trails
 */
@Scopes(() => ({
  active: {
    where: {
      isActive: true,
      deletedAt: null,
    },
  },
  byType: (type: ContactType) => ({
    where: { type },
  }),
  byRelation: (relationTo: string) => ({
    where: { relationTo },
  }),
  guardians: {
    where: {
      type: ContactType.Guardian,
      isActive: true,
    },
  },
  providers: {
    where: {
      type: ContactType.Provider,
      isActive: true,
    },
  },
  withEmail: {
    where: {
      email: {
        [Op.ne]: null,
      },
    },
  },
  withPhone: {
    where: {
      phone: {
        [Op.ne]: null,
      },
    },
  },
}))
@Table({
  tableName: 'contacts',
  timestamps: true,
  underscored: false,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt',
  paranoid: true, // Enable soft deletes
  indexes: [
    {
      fields: ['createdAt'],
      name: 'idx_contact_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_contact_updated_at',
    },
  ],
})
@Index(['email'])
@Index(['type'])
@Index(['relationTo'])
@Index(['isActive'])
@Index(['createdAt'])
@Index(['firstName', 'lastName'])
@Index(['relationTo', 'type', 'isActive'])
export class Contact extends Model<Contact> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  firstName: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  lastName: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    validate: {
      isEmail: {
        msg: 'Must be a valid email address',
      },
    },
  })
  email: string | null;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
    validate: {
      is: {
        args: /^\+?[1-9]\d{1,14}$/,
        msg: 'Phone number must be in E.164 format or standard US format',
      },
    },
  })
  phone: string | null;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(ContactType)],
    },
    allowNull: false,
  })
  type: ContactType;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  organization: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  title: string | null;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  address: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  city: string | null;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  state: string | null;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
    validate: {
      is: {
        args: /^\d{5}(-\d{4})?$/,
        msg: 'ZIP code must be in format 12345 or 12345-6789',
      },
    },
  })
  zip: string | null;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'UUID of related student or user',
  })
  relationTo: string | null;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    comment: 'Type of relationship (parent, emergency, etc.)',
  })
  relationshipType: string | null;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    defaultValue: {},
    comment: 'Custom healthcare-specific fields',
  })
  customFields: Record<string, any> | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string | null;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'User who created this contact',
  })
  createdBy: string | null;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'User who last updated this contact',
  })
  updatedBy: string | null;

  @CreatedAt
  @Column({
    type: DataType.DATE,
  })
  declare createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
  })
  declare updatedAt: Date;

  @DeletedAt
  @Column({
    type: DataType.DATE,
    comment: 'Soft delete timestamp',
  })
  declare deletedAt: Date | null;

  /**
   * Get full name
   */
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * Get display name with organization if available
   */
  get displayName(): string {
    if (this.organization) {
      return `${this.fullName} (${this.organization})`;
    }
    return this.fullName;
  }

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: Contact) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(
        `[AUDIT] Contact ${instance.id} modified at ${new Date().toISOString()}`,
      );
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}
