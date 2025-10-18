/**
 * WC-GEN-064 | ChronicCondition.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../config/sequelize, ../../types/enums, ../base/AuditableModel | Dependencies: sequelize, ../../config/sequelize, ../../types/enums
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { ConditionSeverity, ConditionStatus } from '../../types/enums';
import { AuditableModel } from '../base/AuditableModel';

/**
 * ChronicCondition Model
 * Manages long-term health conditions for students including diagnoses, treatments, accommodations, and care plans.
 * This model contains Protected Health Information (PHI) and is subject to HIPAA compliance.
 */

interface ChronicConditionAttributes {
  id: string;
  studentId: string;
  healthRecordId?: string;
  condition: string;
  icdCode?: string;
  diagnosisDate: Date;
  diagnosedBy?: string;
  severity: ConditionSeverity;
  status: ConditionStatus;
  medications?: any;
  treatments?: string;
  accommodationsRequired: boolean;
  accommodationDetails?: string;
  emergencyProtocol?: string;
  actionPlan?: string;
  nextReviewDate?: Date;
  reviewFrequency?: string;
  restrictions?: any;
  precautions?: any;
  triggers: string[];
  notes?: string;
  carePlan?: string;
  lastReviewDate?: Date;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ChronicConditionCreationAttributes
  extends Optional<
    ChronicConditionAttributes,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'healthRecordId'
    | 'icdCode'
    | 'diagnosedBy'
    | 'severity'
    | 'status'
    | 'medications'
    | 'treatments'
    | 'accommodationsRequired'
    | 'accommodationDetails'
    | 'emergencyProtocol'
    | 'actionPlan'
    | 'nextReviewDate'
    | 'reviewFrequency'
    | 'restrictions'
    | 'precautions'
    | 'triggers'
    | 'notes'
    | 'carePlan'
    | 'lastReviewDate'
    | 'createdBy'
    | 'updatedBy'
  > {}

export class ChronicCondition
  extends Model<ChronicConditionAttributes, ChronicConditionCreationAttributes>
  implements ChronicConditionAttributes
{
  public id!: string;
  public studentId!: string;
  public healthRecordId?: string;
  public condition!: string;
  public icdCode?: string;
  public diagnosisDate!: Date;
  public diagnosedBy?: string;
  public severity!: ConditionSeverity;
  public status!: ConditionStatus;
  public medications?: any;
  public treatments?: string;
  public accommodationsRequired!: boolean;
  public accommodationDetails?: string;
  public emergencyProtocol?: string;
  public actionPlan?: string;
  public nextReviewDate?: Date;
  public reviewFrequency?: string;
  public restrictions?: any;
  public precautions?: any;
  public triggers!: string[];
  public notes?: string;
  public carePlan?: string;
  public lastReviewDate?: Date;
  public createdBy?: string;
  public updatedBy?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ChronicCondition.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    healthRecordId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    condition: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icdCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    diagnosisDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    diagnosedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    severity: {
      type: DataTypes.ENUM(...Object.values(ConditionSeverity)),
      allowNull: false,
      defaultValue: ConditionSeverity.MODERATE,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ConditionStatus)),
      allowNull: false,
      defaultValue: ConditionStatus.ACTIVE,
    },
    medications: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    treatments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    accommodationsRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    accommodationDetails: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    emergencyProtocol: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    actionPlan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    nextReviewDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reviewFrequency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    restrictions: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    precautions: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    triggers: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    carePlan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    lastReviewDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ...AuditableModel.getAuditableFields(),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'chronic_conditions',
    timestamps: true,
    indexes: [
      { fields: ['studentId', 'status'] },
      { fields: ['severity', 'status'] },
      { fields: ['nextReviewDate'] },
    ],
  }
);

AuditableModel.setupAuditHooks(ChronicCondition, 'ChronicCondition');
