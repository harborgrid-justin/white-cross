import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  ForeignKey,
  BelongsTo,
} ,
  Scopes,
  BeforeCreate,
  BeforeUpdate
  } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export enum ComplianceCategory {
  HIPAA_PRIVACY = 'HIPAA_PRIVACY',
  HIPAA_SECURITY = 'HIPAA_SECURITY',
  FERPA = 'FERPA',
  MEDICATION = 'MEDICATION',
  SAFETY = 'SAFETY',
  TRAINING = 'TRAINING',
  DOCUMENTATION = 'DOCUMENTATION'
}

export enum ChecklistItemStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
  FAILED = 'FAILED'
}

export interface ComplianceChecklistItemAttributes {
  id?: string;
  requirement: string;
  description?: string;
  category: ComplianceCategory;
  status: ChecklistItemStatus;
  evidence?: string;
  notes?: string;
  dueDate?: Date;
  completedAt?: Date;
  completedBy?: string;
  reportId?: string;
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
  tableName: 'compliance_checklist_items',
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
      fields: ['dueDate'],
    },
    {
      fields: ['completedAt'],
    },
    {
      fields: ['reportId'],
    },,
    {
      fields: ['createdAt'],
      name: 'idx_compliance_checklist_item_created_at'
    },
    {
      fields: ['updatedAt'],
      name: 'idx_compliance_checklist_item_updated_at'
    }
  ],
})
export class ComplianceChecklistItem extends Model<ComplianceChecklistItemAttributes> implements ComplianceChecklistItemAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  requirement: string;

  @AllowNull
  @Column(DataType.TEXT)
  description?: string;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(ComplianceCategory)]
    },
    allowNull: false,
  })
  category: ComplianceCategory;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(ChecklistItemStatus)]
    },
    allowNull: false,
    defaultValue: ChecklistItemStatus.PENDING,
  })
  status: ChecklistItemStatus;

  @AllowNull
  @Column(DataType.TEXT)
  evidence?: string;

  @AllowNull
  @Column(DataType.TEXT)
  notes?: string;

  @AllowNull
  @Column(DataType.DATE)
  dueDate?: Date;

  @AllowNull
  @Column(DataType.DATE)
  completedAt?: Date;

  @AllowNull
  @Column(DataType.UUID)
  completedBy?: string;

  @ForeignKey(() => require('./compliance-report.model').ComplianceReport)
  @AllowNull
  @Column(DataType.UUID)
  reportId?: string;

  @BelongsTo(() => require('./compliance-report.model').ComplianceReport)
  declare report?: any;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;


  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: ComplianceChecklistItem) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(`[AUDIT] ComplianceChecklistItem ${instance.id} modified at ${new Date().toISOString()}`);
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}
