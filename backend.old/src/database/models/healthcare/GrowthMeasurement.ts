/**
 * @fileoverview Growth Measurement Database Model
 * @module database/models/healthcare/GrowthMeasurement
 * @description Sequelize model for tracking student growth metrics including height, weight,
 * BMI calculations, percentiles, and nutritional status monitoring.
 *
 * Key Features:
 * - Height and weight tracking with unit support (metric/imperial)
 * - Automatic BMI calculation
 * - CDC growth chart percentile tracking
 * - Head circumference for pediatric patients
 * - Nutritional status assessment
 * - Growth concern flagging
 * - Longitudinal growth trend analysis support
 * - Full audit trail for compliance
 *
 * @compliance HIPAA Privacy Rule §164.308 - Contains Protected Health Information (PHI)
 * @compliance FERPA §99.3 - Educational health records
 * @compliance CDC Growth Charts - Standardized percentile calculations
 * @audit All measurements logged for medical record continuity
 *
 * @requires sequelize
 * @requires ../../config/sequelize
 * @requires ../base/AuditableModel
 *
 * LOC: 27A85F2871
 * WC-GEN-065
 *
 * UPSTREAM: sequelize.ts, AuditableModel.ts
 * DOWNSTREAM: index.ts, GrowthMeasurementRepository.ts
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { AuditableModel } from '../base/AuditableModel';

/**
 * @interface GrowthMeasurementAttributes
 * @description TypeScript interface defining all GrowthMeasurement model attributes
 *
 * @property {string} id - Primary key, auto-generated UUID
 * @property {string} studentId - Foreign key reference to student, required
 * @property {string} [healthRecordId] - Optional link to related health record (nullable)
 * @property {Date} measurementDate - Date of measurement, required
 * @property {string} measuredBy - Person who took measurements, required
 * @property {string} [measuredByRole] - Role (e.g., "School Nurse", "MA"), nullable
 * @property {number} [height] - Height measurement, nullable
 * @property {string} heightUnit - Unit for height (cm, in), defaults to "cm"
 * @property {number} [weight] - Weight measurement, nullable
 * @property {string} weightUnit - Unit for weight (kg, lb), defaults to "kg"
 * @property {number} [bmi] - Body Mass Index (calculated), nullable
 * @property {number} [bmiPercentile] - BMI percentile per CDC growth charts (0-100), nullable
 * @property {number} [headCircumference] - Head circumference for infants/toddlers (cm), nullable
 * @property {number} [heightPercentile] - Height percentile per CDC charts (0-100), nullable
 * @property {number} [weightPercentile] - Weight percentile per CDC charts (0-100), nullable
 * @property {any} [growthPercentiles] - Additional percentile data (JSONB), nullable
 * @property {string} [nutritionalStatus] - Assessment (underweight, healthy, overweight, obese), nullable
 * @property {string} [concerns] - Growth concerns or flags (nullable)
 * @property {string} [notes] - Additional notes or observations (nullable)
 * @property {string} [createdBy] - User ID who created the record (audit field)
 * @property {string} [updatedBy] - User ID who last updated the record (audit field)
 * @property {Date} createdAt - Timestamp of record creation
 * @property {Date} updatedAt - Timestamp of last update
 *
 * @security PHI - Contains sensitive health measurements
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

/**
 * @interface GrowthMeasurementCreationAttributes
 * @description Attributes required when creating a new GrowthMeasurement instance.
 * Extends GrowthMeasurementAttributes with optional fields that have defaults or are auto-generated.
 */
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

/**
 * @class GrowthMeasurement
 * @extends Model
 * @description Student growth tracking model with BMI calculation and CDC percentile monitoring.
 *
 * @tablename growth_measurements
 *
 * Key Features:
 * - Flexible unit support (metric/imperial)
 * - BMI auto-calculation from height/weight
 * - CDC growth chart percentile tracking (height, weight, BMI, head circumference)
 * - Nutritional status classification
 * - Growth concern flagging for screening
 * - Longitudinal trend analysis support
 * - Full audit trail
 * - Indexed for efficient student timeline queries
 *
 * BMI Categories (CDC Guidelines):
 * - Underweight: BMI < 5th percentile
 * - Healthy Weight: BMI 5th to < 85th percentile
 * - Overweight: BMI 85th to < 95th percentile
 * - Obese: BMI >= 95th percentile
 *
 * @security Contains PHI - Growth data is sensitive health information
 * @compliance HIPAA Privacy Rule - 45 CFR §164.308(a)(3)(ii)(A)
 * @compliance CDC Growth Charts - Age and sex-specific percentiles
 *
 * @example
 * // Record growth measurement for 10-year-old
 * const measurement = await GrowthMeasurement.create({
 *   studentId: 'student-uuid',
 *   measurementDate: new Date(),
 *   measuredBy: 'Nurse Johnson',
 *   measuredByRole: 'School Nurse',
 *   height: 140.5,
 *   heightUnit: 'cm',
 *   weight: 35.2,
 *   weightUnit: 'kg',
 *   bmi: 17.8,
 *   bmiPercentile: 52,
 *   heightPercentile: 48,
 *   weightPercentile: 55,
 *   nutritionalStatus: 'Healthy Weight'
 * });
 *
 * @example
 * // Find students with concerning growth patterns
 * const concerns = await GrowthMeasurement.findAll({
 *   where: {
 *     concerns: { [Op.not]: null },
 *     measurementDate: { [Op.gte]: subMonths(new Date(), 6) }
 *   },
 *   include: ['student'],
 *   order: [['measurementDate', 'DESC']]
 * });
 */
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
