import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

export enum PolicyCategory {
  HIPAA_PRIVACY = 'HIPAA_PRIVACY',
  HIPAA_SECURITY = 'HIPAA_SECURITY',
  FERPA = 'FERPA',
  DATA_RETENTION = 'DATA_RETENTION',
  INCIDENT_RESPONSE = 'INCIDENT_RESPONSE',
  ACCESS_CONTROL = 'ACCESS_CONTROL',
  TRAINING = 'TRAINING'
}

export enum PolicyStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  SUPERSEDED = 'SUPERSEDED'
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

@Table({
  tableName: 'policy_documents',
  timestamps: true,
  indexes: [
    {
      fields: ['category'],
    },
    {
      fields: ['status'],
    },
    {
      fields: ['effective_date'],
    },
    {
      fields: ['review_date'],
    },
    {
      fields: ['approved_by'],
    },
  ],
})
export class PolicyDocument extends Model<PolicyDocumentAttributes> implements PolicyDocumentAttributes {
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
    type: DataType.ENUM(...Object.values(PolicyCategory)),
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
  version: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'effective_date',
  })
  effectiveDate: Date;

  @AllowNull
  @Column(DataType.DATE)
  reviewDate?: Date;

  @Column({
    type: DataType.ENUM(...Object.values(PolicyStatus)),
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
}</content>
<parameter name="filePath">c:\temp\white-cross\backend\src\database\models\policy-document.model.ts