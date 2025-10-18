/**
 * LOC: 27A85F2871
 * WC-GEN-065 | GrowthMeasurement.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *   - AuditableModel.ts (database/models/base/AuditableModel.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 */

/**
 * WC-GEN-065 | GrowthMeasurement.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../config/sequelize, ../base/AuditableModel | Dependencies: sequelize, ../../config/sequelize, ../base/AuditableModel
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { AuditableModel } from '../base/AuditableModel';

/**
 * GrowthMeasurement Model
 * Manages student growth tracking including height, weight, BMI, and developmental percentiles.
 * This model contains Protected Health Information (PHI) and is subject to HIPAA compliance.
 */

interface GrowthMeasurementAttributes {
  id: string;
  studentId: string;
  healthRecordId?: string;
  measurementDate: Date;
  measuredBy: string;
  measuredByRole?: string;
  height?: number;
  heightUnit: string;
  weight?: number;
  weightUnit: string;
  bmi?: number;
  bmiPercentile?: number;
  headCircumference?: number;
  heightPercentile?: number;
  weightPercentile?: number;
  growthPercentiles?: any;
  nutritionalStatus?: string;
  concerns?: string;
  notes?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface GrowthMeasurementCreationAttributes
  extends Optional<
    GrowthMeasurementAttributes,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'healthRecordId'
    | 'measuredByRole'
    | 'height'
    | 'heightUnit'
    | 'weight'
    | 'weightUnit'
    | 'bmi'
    | 'bmiPercentile'
    | 'headCircumference'
    | 'heightPercentile'
    | 'weightPercentile'
    | 'growthPercentiles'
    | 'nutritionalStatus'
    | 'concerns'
    | 'notes'
    | 'createdBy'
    | 'updatedBy'
  > {}

export class GrowthMeasurement
  extends Model<GrowthMeasurementAttributes, GrowthMeasurementCreationAttributes>
  implements GrowthMeasurementAttributes
{
  public id!: string;
  public studentId!: string;
  public healthRecordId?: string;
  public measurementDate!: Date;
  public measuredBy!: string;
  public measuredByRole?: string;
  public height?: number;
  public heightUnit!: string;
  public weight?: number;
  public weightUnit!: string;
  public bmi?: number;
  public bmiPercentile?: number;
  public headCircumference?: number;
  public heightPercentile?: number;
  public weightPercentile?: number;
  public growthPercentiles?: any;
  public nutritionalStatus?: string;
  public concerns?: string;
  public notes?: string;
  public createdBy?: string;
  public updatedBy?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

GrowthMeasurement.init(
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
    measurementDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    measuredBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    measuredByRole: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    height: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    heightUnit: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'cm',
    },
    weight: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    weightUnit: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'kg',
    },
    bmi: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    bmiPercentile: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    headCircumference: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    heightPercentile: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    weightPercentile: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    growthPercentiles: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    nutritionalStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    concerns: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ...AuditableModel.getAuditableFields(),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'growth_measurements',
    timestamps: true,
    indexes: [
      { fields: ['studentId', 'measurementDate'] },
      { fields: ['measurementDate'] },
    ],
  }
);

AuditableModel.setupAuditHooks(GrowthMeasurement, 'GrowthMeasurement');
