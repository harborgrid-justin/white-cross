/**
 * LOC: 08C445FB0F
 * WC-GEN-068 | Screening.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *   - enums.ts (database/types/enums.ts)
 *   - AuditableModel.ts (database/models/base/AuditableModel.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 */

/**
 * WC-GEN-068 | Screening.ts - General utility functions and operations
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
import { ScreeningType, ScreeningOutcome, FollowUpStatus } from '../../types/enums';
import { AuditableModel } from '../base/AuditableModel';

/**
 * Screening Model
 * Manages student health screenings including vision, hearing, dental, BMI, and other health assessments.
 * This model contains Protected Health Information (PHI) and is subject to HIPAA compliance.
 */

interface ScreeningAttributes {
  id: string;
  studentId: string;
  healthRecordId?: string;
  screeningType: ScreeningType;
  screeningDate: Date;
  screenedBy: string;
  screenedByRole?: string;
  results?: any;
  outcome: ScreeningOutcome;
  referralRequired: boolean;
  referralTo?: string;
  referralDate?: Date;
  referralReason?: string;
  followUpRequired: boolean;
  followUpDate?: Date;
  followUpStatus?: FollowUpStatus;
  equipmentUsed?: string;
  testDetails?: any;
  rightEye?: string;
  leftEye?: string;
  rightEar?: string;
  leftEar?: string;
  passedCriteria?: boolean;
  notes?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ScreeningCreationAttributes
  extends Optional<
    ScreeningAttributes,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'healthRecordId'
    | 'screenedByRole'
    | 'results'
    | 'outcome'
    | 'referralRequired'
    | 'referralTo'
    | 'referralDate'
    | 'referralReason'
    | 'followUpRequired'
    | 'followUpDate'
    | 'followUpStatus'
    | 'equipmentUsed'
    | 'testDetails'
    | 'rightEye'
    | 'leftEye'
    | 'rightEar'
    | 'leftEar'
    | 'passedCriteria'
    | 'notes'
    | 'createdBy'
    | 'updatedBy'
  > {}

export class Screening extends Model<ScreeningAttributes, ScreeningCreationAttributes> implements ScreeningAttributes {
  public id!: string;
  public studentId!: string;
  public healthRecordId?: string;
  public screeningType!: ScreeningType;
  public screeningDate!: Date;
  public screenedBy!: string;
  public screenedByRole?: string;
  public results?: any;
  public outcome!: ScreeningOutcome;
  public referralRequired!: boolean;
  public referralTo?: string;
  public referralDate?: Date;
  public referralReason?: string;
  public followUpRequired!: boolean;
  public followUpDate?: Date;
  public followUpStatus?: FollowUpStatus;
  public equipmentUsed?: string;
  public testDetails?: any;
  public rightEye?: string;
  public leftEye?: string;
  public rightEar?: string;
  public leftEar?: string;
  public passedCriteria?: boolean;
  public notes?: string;
  public createdBy?: string;
  public updatedBy?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Screening.init(
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
    screeningType: {
      type: DataTypes.ENUM(...Object.values(ScreeningType)),
      allowNull: false,
    },
    screeningDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    screenedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    screenedByRole: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    results: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    outcome: {
      type: DataTypes.ENUM(...Object.values(ScreeningOutcome)),
      allowNull: false,
      defaultValue: ScreeningOutcome.PASS,
    },
    referralRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    referralTo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    referralDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    referralReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    followUpRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    followUpDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    followUpStatus: {
      type: DataTypes.ENUM(...Object.values(FollowUpStatus)),
      allowNull: true,
    },
    equipmentUsed: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    testDetails: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    rightEye: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    leftEye: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rightEar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    leftEar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passedCriteria: {
      type: DataTypes.BOOLEAN,
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
    tableName: 'screenings',
    timestamps: true,
    indexes: [
      { fields: ['studentId', 'screeningDate'] },
      { fields: ['screeningType', 'outcome'] },
      { fields: ['referralRequired', 'followUpRequired'] },
      { fields: ['followUpDate'] },
    ],
  }
);

AuditableModel.setupAuditHooks(Screening, 'Screening');
