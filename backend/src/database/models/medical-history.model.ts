import {
  BeforeCreate,
  BeforeUpdate,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { createModelAuditHook } from '../services/model-audit-hooks.service';

export interface MedicalHistoryAttributes {
  id?: string;
  studentId: string;
  recordType: string; // condition, allergy, surgery, hospitalization, family_history
  condition: string;
  diagnosisCode?: string; // ICD-10 code
  diagnosisDate?: Date;
  resolvedDate?: Date;
  isActive: boolean;
  severity?: string; // mild, moderate, severe, critical
  category?: string; // chronic, acute, genetic, infectious, etc.
  treatment?: string;
  medication?: string;
  notes?: string;
  isFamilyHistory: boolean;
  familyRelation?: string; // if family history: mother, father, sibling, etc.
  isCritical: boolean;
  requiresMonitoring: boolean;
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
  tableName: 'medical_history',
  timestamps: true,
  underscored: false,
  paranoid: true,
  indexes: [
    {
      fields: ['studentId'],
    },
    {
      fields: ['recordType'],
    },
    {
      fields: ['isActive'],
    },
    {
      fields: ['isFamilyHistory'],
    },
    {
      fields: ['isCritical'],
    },
    {
      fields: ['requiresMonitoring'],
    },
    {
      fields: ['diagnosisDate'],
    },
    {
      fields: ['createdAt'],
      name: 'idx_medical_history_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_medical_history_updated_at',
    },
  ],
})
export class MedicalHistory
  extends Model<MedicalHistoryAttributes>
  implements MedicalHistoryAttributes
{
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  studentId: string;

  @Column({
    type: DataType.ENUM(
      'condition',
      'allergy',
      'surgery',
      'hospitalization',
      'family_history',
      'other',
    ),
    allowNull: false,
  })
  recordType: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  condition: string;

  @Column(DataType.STRING(255))
  diagnosisCode?: string;

  @Column(DataType.DATE)
  diagnosisDate?: Date;

  @Column(DataType.DATE)
  resolvedDate?: Date;

  @Default(true)
  @Column(DataType.BOOLEAN)
  isActive: boolean;

  @Column(DataType.ENUM('mild', 'moderate', 'severe', 'critical'))
  severity?: string;

  @Column(
    DataType.ENUM(
      'chronic',
      'acute',
      'genetic',
      'infectious',
      'autoimmune',
      'other',
    ),
  )
  category?: string;

  @Column(DataType.TEXT)
  treatment?: string;

  @Column(DataType.TEXT)
  medication?: string;

  @Column(DataType.TEXT)
  notes?: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isFamilyHistory: boolean;

  @Column(
    DataType.ENUM(
      'mother',
      'father',
      'sibling',
      'grandparent',
      'aunt',
      'uncle',
      'cousin',
      'other',
    ),
  )
  familyRelation?: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isCritical: boolean;

  @Default(false)
  @Column(DataType.BOOLEAN)
  requiresMonitoring: boolean;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: MedicalHistory) {
    await createModelAuditHook('MedicalHistory', instance);
  }

  @BeforeCreate
  @BeforeUpdate
  static async validateMedicalHistory(instance: MedicalHistory) {
    // Validate family history requirements
    if (instance.isFamilyHistory && !instance.familyRelation) {
      throw new Error('Family relation is required for family history records');
    }

    if (!instance.isFamilyHistory && instance.familyRelation) {
      throw new Error(
        'Family relation should not be set for non-family history records',
      );
    }

    // Auto-set resolved date for inactive conditions
    if (!instance.isActive && !instance.resolvedDate) {
      instance.resolvedDate = new Date();
    }

    // Validate date logic
    if (instance.resolvedDate && instance.diagnosisDate) {
      if (instance.resolvedDate < instance.diagnosisDate) {
        throw new Error('Resolved date cannot be before diagnosis date');
      }
    }

    // Auto-determine if critical based on severity
    if (instance.severity === 'critical') {
      instance.isCritical = true;
    }

    // Auto-set monitoring requirement for certain conditions
    if (instance.category === 'chronic' || instance.isCritical) {
      instance.requiresMonitoring = true;
    }
  }
}
