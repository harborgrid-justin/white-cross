/**
 * @fileoverview Screening Database Model
 * @module database/models/healthcare/Screening
 * @description Sequelize model for managing student health screenings including vision, hearing,
 * dental, scoliosis, and other mandatory health assessments with referral tracking.
 *
 * Key Features:
 * - Multiple screening types (vision, hearing, dental, scoliosis, BMI, TB, etc.)
 * - Pass/fail/refer outcome tracking
 * - Referral workflow management
 * - Follow-up status monitoring
 * - Equipment and test method documentation
 * - Bilateral testing support (left/right eye, ear)
 * - Full audit trail for compliance
 *
 * @compliance HIPAA Privacy Rule §164.308 - Contains Protected Health Information (PHI)
 * @compliance FERPA §99.3 - Educational health records
 * @compliance State School Health Screening Requirements - Varies by jurisdiction
 * @compliance EPSDT Guidelines - Early and Periodic Screening, Diagnostic, and Treatment
 * @audit All screenings logged for state reporting requirements
 *
 * @requires sequelize
 * @requires ../../config/sequelize
 * @requires ../../types/enums
 * @requires ../base/AuditableModel
 *
 * LOC: 08C445FB0F
 * WC-GEN-068
 *
 * UPSTREAM: sequelize.ts, enums.ts, AuditableModel.ts
 * DOWNSTREAM: index.ts, ScreeningRepository.ts
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { ScreeningType, ScreeningOutcome, FollowUpStatus } from '../../types/enums';
import { AuditableModel } from '../base/AuditableModel';

/**
 * @interface ScreeningAttributes
 * @description TypeScript interface defining all Screening model attributes
 *
 * @property {string} id - Primary key, auto-generated UUID
 * @property {string} studentId - Foreign key reference to student, required
 * @property {string} [healthRecordId] - Optional link to related health record (nullable)
 * @property {ScreeningType} screeningType - Type of screening (vision, hearing, dental, etc.), required
 * @property {Date} screeningDate - Date screening was performed, required
 * @property {string} screenedBy - Person who performed screening, required
 * @property {string} [screenedByRole] - Role of screener (e.g., "School Nurse", "Dental Hygienist"), nullable
 * @property {any} [results] - Structured screening results (JSONB), nullable
 * @property {ScreeningOutcome} outcome - Outcome (pass, fail, refer), defaults to PASS
 * @property {boolean} referralRequired - Whether referral needed, defaults to false
 * @property {string} [referralTo] - Specialist or provider for referral (nullable)
 * @property {Date} [referralDate] - Date referral was made (nullable)
 * @property {string} [referralReason] - Reason for referral (nullable)
 * @property {boolean} followUpRequired - Whether follow-up needed, defaults to false
 * @property {Date} [followUpDate] - Scheduled follow-up date (nullable)
 * @property {FollowUpStatus} [followUpStatus] - Status of follow-up (pending, completed, etc.), nullable
 * @property {string} [equipmentUsed] - Equipment used for screening (nullable)
 * @property {any} [testDetails] - Additional test details (JSONB), nullable
 * @property {string} [rightEye] - Right eye test result (for vision screening), nullable
 * @property {string} [leftEye] - Left eye test result (for vision screening), nullable
 * @property {string} [rightEar] - Right ear test result (for hearing screening), nullable
 * @property {string} [leftEar] - Left ear test result (for hearing screening), nullable
 * @property {boolean} [passedCriteria] - Whether passed screening criteria, nullable
 * @property {string} [notes] - Additional notes or observations (nullable)
 * @property {string} [createdBy] - User ID who created the record (audit field)
 * @property {string} [updatedBy] - User ID who last updated the record (audit field)
 * @property {Date} createdAt - Timestamp of record creation
 * @property {Date} updatedAt - Timestamp of last update
 *
 * @security PHI - Contains sensitive health screening results
 * @safety Failed screenings may indicate urgent health needs requiring referral
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

/**
 * @interface ScreeningCreationAttributes
 * @description Attributes required when creating a new Screening instance.
 * Extends ScreeningAttributes with optional fields that have defaults or are auto-generated.
 */
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

/**
 * @class Screening
 * @extends Model
 * @description Student health screening model with referral tracking and follow-up management.
 *
 * @tablename screenings
 *
 * Key Features:
 * - Comprehensive screening type support
 * - Pass/fail/refer outcome classification
 * - Automated referral workflow
 * - Follow-up tracking with status updates
 * - Bilateral testing support (vision, hearing)
 * - Equipment documentation for calibration tracking
 * - Full audit trail
 * - Indexed for efficient queries by student, type, outcome, and follow-up dates
 *
 * Screening Types (from ScreeningType enum):
 * - VISION: Eye exams (Snellen chart, 20/20 testing)
 * - HEARING: Audiometry testing
 * - DENTAL: Oral health screening
 * - SCOLIOSIS: Spinal curvature screening
 * - BMI: Body mass index screening
 * - TB: Tuberculosis screening
 * - BEHAVIORAL: Behavioral health screening
 * - DEVELOPMENTAL: Developmental milestones
 * - OTHER: Other health screenings
 *
 * Screening Outcomes (from ScreeningOutcome enum):
 * - PASS: Student passed screening criteria
 * - FAIL: Student failed screening criteria
 * - REFER: Student requires referral to specialist
 * - INCOMPLETE: Screening not completed
 *
 * @security Contains PHI - Screening results are sensitive health information
 * @compliance HIPAA Privacy Rule - 45 CFR §164.308(a)(3)(ii)(A)
 * @compliance State Health Screening Mandates - Varies by jurisdiction
 * @compliance EPSDT - Early and Periodic Screening for Medicaid-eligible students
 *
 * @example
 * // Record vision screening with referral
 * const screening = await Screening.create({
 *   studentId: 'student-uuid',
 *   screeningType: ScreeningType.VISION,
 *   screeningDate: new Date(),
 *   screenedBy: 'Nurse Thompson',
 *   screenedByRole: 'School Nurse',
 *   equipmentUsed: 'Snellen Chart',
 *   rightEye: '20/40',
 *   leftEye: '20/30',
 *   outcome: ScreeningOutcome.REFER,
 *   referralRequired: true,
 *   referralTo: 'Optometrist',
 *   referralReason: 'Right eye below 20/30 threshold',
 *   followUpRequired: true,
 *   followUpDate: addMonths(new Date(), 1)
 * });
 *
 * @example
 * // Find pending referrals
 * const pendingReferrals = await Screening.findAll({
 *   where: {
 *     referralRequired: true,
 *     followUpStatus: FollowUpStatus.PENDING,
 *     followUpDate: { [Op.lte]: new Date() }
 *   },
 *   include: ['student'],
 *   order: [['followUpDate', 'ASC']]
 * });
 */
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
