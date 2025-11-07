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

export enum PolicyCategory {
  HIPAA_PRIVACY = 'HIPAA_PRIVACY',
  HIPAA_SECURITY = 'HIPAA_SECURITY',
  FERPA = 'FERPA',
  DATA_RETENTION = 'DATA_RETENTION',
  INCIDENT_RESPONSE = 'INCIDENT_RESPONSE',
  ACCESS_CONTROL = 'ACCESS_CONTROL',
  TRAINING = 'TRAINING',
}

export enum PolicyStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  SUPERSEDED = 'SUPERSEDED',
}

export interface PolicyDocumentAttributes {
  id?: string;
  title: string;
  category: PolicyCategory;
  content: string;
  version: string;
  effectiveDate: Date;
  reviewDate?: Date;
  status: PolicyStatus;
  approvedBy?: string;
  approvedAt?: Date;
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
  tableName: 'policy_documents',
  timestamps: true,
  underscored: false,
  indexes: [
    {
      fields: ['category'],
    },
    {
      fields: ['status'],
    },
    {
      fields: ['effectiveDate'],
    },
    {
      fields: ['reviewDate'],
    },
    {
      fields: ['approvedBy'],
    },
    {
      fields: ['createdAt'],
      name: 'idx_policy_document_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_policy_document_updated_at',
    },
  ],
})
export class PolicyDocument
  extends Model<PolicyDocumentAttributes>
  implements PolicyDocumentAttributes
{
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(PolicyCategory)],
    },
    allowNull: false,
  })
  category: PolicyCategory;

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
    type: DataType.DATE,
    allowNull: false,
  })
  effectiveDate: Date;

  @AllowNull
  @Column(DataType.DATE)
  reviewDate?: Date;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(PolicyStatus)],
    },
    allowNull: false,
    defaultValue: PolicyStatus.DRAFT,
  })
  status: PolicyStatus;

  @AllowNull
  @Column(DataType.UUID)
  approvedBy?: string;

  @AllowNull
  @Column(DataType.DATE)
  approvedAt?: Date;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: PolicyDocument) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(
        `[AUDIT] PolicyDocument ${instance.id} modified at ${new Date().toISOString()}`,
      );
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}
