import { Table, Column, Model, DataType, PrimaryKey, Default, CreatedAt, UpdatedAt, DeletedAt, Index } from 'sequelize-typescript';
import { ContactType } from '../../contact/enums/contact-type.enum';

/**
 * Contact Model
 * Sequelize model for contact management (guardians, staff, vendors, providers)
 *
 * Inspired by TwentyHQ CRM contact management system
 * Supports HIPAA-compliant contact tracking with audit trails
 */
@Table({
  tableName: 'contacts',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt',
  paranoid: true, // Enable soft deletes
})
@Index(['email'])
@Index(['type'])
@Index(['relationTo'])
@Index(['isActive'])
@Index(['createdAt'])
@Index(['firstName', 'lastName'])
export class Contact extends Model<Contact> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

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
    type: DataType.STRING(255),
    allowNull: true
  })
  email: string | null;

  @Column({
    type: DataType.STRING(20),
    allowNull: true
  })
  phone: string | null;

  @Column({
    type: DataType.ENUM(...(Object.values(ContactType) as string[])),
    allowNull: false
  })
  type: ContactType;

  @Column({
    type: DataType.STRING(200),
    allowNull: true
  })
  organization: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true
  })
  title: string | null;

  @Column({
    type: DataType.STRING(255),
    allowNull: true
  })
  address: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true
  })
  city: string | null;

  @Column({
    type: DataType.STRING(50),
    allowNull: true
  })
  state: string | null;

  @Column({
    type: DataType.STRING(20),
    allowNull: true
  })
  zip: string | null;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'UUID of related student or user'
  })
  relationTo: string | null;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    comment: 'Type of relationship (parent, emergency, etc.)'
  })
  relationshipType: string | null;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    defaultValue: {},
    comment: 'Custom healthcare-specific fields'
  })
  customFields: Record<string, any> | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true
  })
  isActive: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  notes: string | null;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'User who created this contact'
  })
  createdBy: string | null;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'User who last updated this contact'
  })
  updatedBy: string | null;

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

  @DeletedAt
  @Column({
    type: DataType.DATE,
    comment: 'Soft delete timestamp'
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
}