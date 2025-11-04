import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull
  } ,
  Scopes,
  BeforeCreate,
  BeforeUpdate
  } from 'sequelize-typescript';
import { Op } from 'sequelize';
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

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null
    },
    order: [['createdAt', 'DESC']]
  }
}))
@Table({
  tableName: 'data_retention_policies',
  timestamps: true,
  underscored: false,
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
  },,
    {
      fields: ['createdAt'],
      name: 'idx_data_retention_policy_created_at'
    },
    {
      fields: ['updatedAt'],
      name: 'idx_data_retention_policy_updated_at'
    }
  ]
  })
export class DataRetentionPolicy extends Model<DataRetentionPolicyAttributes> implements DataRetentionPolicyAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(DataRetentionCategory)]
    },
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
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(RetentionStatus)]
    },
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


  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: DataRetentionPolicy) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(`[AUDIT] DataRetentionPolicy ${instance.id} modified at ${new Date().toISOString()}`);
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}
