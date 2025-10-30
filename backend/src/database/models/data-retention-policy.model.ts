import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull
  } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

export enum DataRetentionCategory {
  STUDENT_RECORDS = 'STUDENT_RECORDS',
  HEALTH_RECORDS = 'HEALTH_RECORDS',
  MEDICATION_LOGS = 'MEDICATION_LOGS',
  AUDIT_LOGS = 'AUDIT_LOGS',
  CONSENT_FORMS = 'CONSENT_FORMS',
  INCIDENT_REPORTS = 'INCIDENT_REPORTS',
  TRAINING_RECORDS = 'TRAINING_RECORDS'
}

export enum RetentionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  UNDER_REVIEW = 'UNDER_REVIEW'
}

export interface DataRetentionPolicyAttributes {
  id?: string;
  category: DataRetentionCategory;
  description: string;
  retentionPeriodDays: number;
  legalBasis: string;
  status: RetentionStatus;
  autoDelete: boolean;
  lastReviewedAt?: Date;
  lastReviewedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({
  tableName: 'data_retention_policies',
  timestamps: true,
  indexes: [
    {
      fields: ['category']
  },
    {
      fields: ['status']
  },
    {
      fields: ['autoDelete']
  },
    {
      fields: ['lastReviewedAt']
  },
  ]
  })
export class DataRetentionPolicy extends Model<DataRetentionPolicyAttributes> implements DataRetentionPolicyAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @Column({
    type: DataType.ENUM(...(Object.values(DataRetentionCategory) as string[])),
    allowNull: false
  })
  category: DataRetentionCategory;

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  description: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  retentionPeriodDays: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  legalBasis: string;

  @Column({
    type: DataType.ENUM(...(Object.values(RetentionStatus) as string[])),
    allowNull: false,
    defaultValue: RetentionStatus.ACTIVE
  })
  status: RetentionStatus;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  autoDelete: boolean;

  @AllowNull
  @Column(DataType.DATE)
  lastReviewedAt?: Date;

  @AllowNull
  @Column(DataType.UUID)
  lastReviewedBy?: string;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;
}
