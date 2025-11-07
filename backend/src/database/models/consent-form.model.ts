import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Scopes,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export enum ConsentType {
  MEDICATION_ADMINISTRATION = 'MEDICATION_ADMINISTRATION',
  PHOTO_RELEASE = 'PHOTO_RELEASE',
  FIELD_TRIP = 'FIELD_TRIP',
  EMERGENCY_TREATMENT = 'EMERGENCY_TREATMENT',
  DATA_SHARING = 'DATA_SHARING',
  RESEARCH = 'RESEARCH',
}

export interface ConsentFormAttributes {
  id?: string;
  type: ConsentType;
  title: string;
  description: string;
  content: string;
  version: string;
  isActive: boolean;
  expiresAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null,
    },
    order: [['createdAt', 'DESC']],
  },
}))
@Table({
  tableName: 'consent_forms',
  timestamps: true,
  underscored: false,
  indexes: [
    {
      fields: ['type'],
    },
    {
      fields: ['isActive'],
    },
    {
      fields: ['expiresAt'],
    },
    {
      fields: ['createdAt'],
      name: 'idx_consent_form_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_consent_form_updated_at',
    },
  ],
})
export class ConsentForm
  extends Model<ConsentFormAttributes>
  implements ConsentFormAttributes
{
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(ConsentType)],
    },
    allowNull: false,
  })
  type: ConsentType;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    defaultValue: '1.0',
  })
  declare version: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive: boolean;

  @AllowNull
  @Column(DataType.DATE)
  expiresAt?: Date;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: ConsentForm) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(
        `[AUDIT] ConsentForm ${instance.id} modified at ${new Date().toISOString()}`,
      );
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}
