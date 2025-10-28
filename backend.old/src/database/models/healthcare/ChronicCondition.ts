/**
 * @fileoverview Chronic Condition Database Model
 * @module database/models/healthcare/ChronicCondition
 * @description Sequelize model for managing student chronic health conditions including
 * diagnoses, treatments, accommodations, emergency protocols, and care plan management.
 *
 * Key Features:
 * - ICD-10 diagnosis code support
 * - Severity and status tracking
 * - Medication and treatment protocol documentation
 * - Educational accommodation management (504 plans, IEPs)
 * - Emergency action plan support
 * - Trigger identification and management
 * - Activity restrictions and precautions
 * - Periodic review scheduling
 * - Care plan documentation
 * - Full audit trail for compliance
 *
 * @compliance HIPAA Privacy Rule §164.308 - Contains Protected Health Information (PHI)
 * @compliance FERPA §99.3 - Educational health records
 * @compliance Section 504 Rehabilitation Act - Disability accommodations
 * @compliance IDEA - Special education services
 * @audit All access and modifications logged for care coordination
 *
 * @requires sequelize
 * @requires ../../config/sequelize
 * @requires ../../types/enums
 * @requires ../base/AuditableModel
 *
 * LOC: 9451AE7C18
 * WC-GEN-064
 *
 * UPSTREAM: sequelize.ts, enums.ts, AuditableModel.ts
 * DOWNSTREAM: index.ts, ChronicConditionRepository.ts
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { ConditionSeverity, ConditionStatus } from '../../types/enums';
import { AuditableModel } from '../base/AuditableModel';

/**
 * @interface ChronicConditionAttributes
 * @description TypeScript interface defining all ChronicCondition model attributes
 *
 * @property {string} id - Primary key, auto-generated UUID
 * @property {string} studentId - Foreign key reference to student, required
 * @property {string} [healthRecordId] - Optional link to related health record (nullable)
 * @property {string} condition - Name of chronic condition (e.g., "Type 1 Diabetes", "Asthma"), required
 * @property {string} [icdCode] - ICD-10 diagnosis code for standardized coding (nullable)
 * @property {Date} diagnosisDate - Date of initial diagnosis, required
 * @property {string} [diagnosedBy] - Healthcare provider who made diagnosis (nullable)
 * @property {ConditionSeverity} severity - Severity level (mild, moderate, severe), defaults to MODERATE
 * @property {ConditionStatus} status - Current status (active, controlled, in_remission, resolved), defaults to ACTIVE
 * @property {any} [medications] - Associated medications (JSONB array), nullable
 * @property {string} [treatments] - Treatment protocols and therapies (nullable)
 * @property {boolean} accommodationsRequired - Whether educational accommodations needed, defaults to false
 * @property {string} [accommodationDetails] - Specific accommodation requirements (504/IEP details), nullable
 * @property {string} [emergencyProtocol] - Emergency response procedures (nullable)
 * @property {string} [actionPlan] - Student-specific action plan (nullable)
 * @property {Date} [nextReviewDate] - Scheduled date for next medical review (nullable)
 * @property {string} [reviewFrequency] - How often condition should be reviewed (e.g., "Annually", "Every 6 months"), nullable
 * @property {any} [restrictions] - Activity or dietary restrictions (JSONB), nullable
 * @property {any} [precautions] - Safety precautions staff should take (JSONB), nullable
 * @property {string[]} triggers - Known triggers that worsen condition, defaults to []
 * @property {string} [notes] - Additional notes or observations (nullable)
 * @property {string} [carePlan] - Comprehensive care plan documentation (nullable)
 * @property {Date} [lastReviewDate] - Date of most recent medical review (nullable)
 * @property {string} [createdBy] - User ID who created the record (audit field)
 * @property {string} [updatedBy] - User ID who last updated the record (audit field)
 * @property {Date} createdAt - Timestamp of record creation
 * @property {Date} updatedAt - Timestamp of last update
 *
 * @security PHI - Critical for ongoing care and emergency response
 * @safety Severe conditions require emergency protocols and staff training
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

/**
 * @interface ChronicConditionCreationAttributes
 * @description Attributes required when creating a new ChronicCondition instance.
 * Extends ChronicConditionAttributes with optional fields that have defaults or are auto-generated.
 */
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

/**
 * @class ChronicCondition
 * @extends Model
 * @description Chronic health condition tracking model with care plan management and accommodation support.
 *
 * @tablename chronic_conditions
 *
 * Key Features:
 * - Comprehensive condition tracking with ICD-10 coding
 * - Severity and status monitoring
 * - Medication and treatment protocol documentation
 * - Educational accommodation tracking (504 plans, IEPs)
 * - Emergency action plans
 * - Trigger identification and avoidance strategies
 * - Activity restrictions and safety precautions
 * - Periodic review scheduling and tracking
 * - Care plan documentation and management
 * - Full audit trail
 * - Indexed for efficient queries by student, status, severity, and review dates
 *
 * Condition Severity Levels (from ConditionSeverity enum):
 * - MILD: Minimal impact on daily activities, easily managed
 * - MODERATE: Noticeable impact, requires regular monitoring
 * - SEVERE: Significant impact, requires intensive management and accommodations
 *
 * Condition Status (from ConditionStatus enum):
 * - ACTIVE: Currently active and requiring ongoing management
 * - CONTROLLED: Well-managed with current treatment plan
 * - IN_REMISSION: Symptoms absent but condition still monitored
 * - RESOLVED: Condition no longer present
 *
 * Common Chronic Conditions:
 * - Asthma (J45.x ICD-10)
 * - Type 1 Diabetes (E10.x ICD-10)
 * - ADHD (F90.x ICD-10)
 * - Epilepsy (G40.x ICD-10)
 * - Severe allergies (see Allergy model)
 * - Celiac disease (K90.0 ICD-10)
 * - Sickle cell disease (D57.x ICD-10)
 *
 * @security Contains critical PHI for care coordination
 * @compliance HIPAA Privacy Rule - 45 CFR §164.308(a)(3)(ii)(A)
 * @compliance Section 504 - Educational accommodations for disabilities
 * @compliance IDEA - Special education and related services
 * @safety Severe conditions require emergency protocols and staff training
 *
 * @example
 * // Create a Type 1 Diabetes condition record
 * const condition = await ChronicCondition.create({
 *   studentId: 'student-uuid',
 *   condition: 'Type 1 Diabetes',
 *   icdCode: 'E10.9',
 *   diagnosisDate: new Date('2022-06-15'),
 *   diagnosedBy: 'Dr. Emily Chen, Pediatric Endocrinologist',
 *   severity: ConditionSeverity.SEVERE,
 *   status: ConditionStatus.CONTROLLED,
 *   medications: [{ name: 'Insulin glargine', dosage: '10 units daily' }],
 *   treatments: 'Insulin therapy, blood glucose monitoring 4x daily, carb counting',
 *   accommodationsRequired: true,
 *   accommodationDetails: '504 Plan: Access to blood glucose meter, snacks, bathroom; extra time for testing',
 *   emergencyProtocol: 'Hypoglycemia: Give glucose tablets/juice. Hyperglycemia: Contact parents.',
 *   restrictions: { physical: 'Monitor during intense exercise', dietary: 'Carb counting required' },
 *   triggers: ['Missed meals', 'Intense exercise', 'Illness'],
 *   nextReviewDate: new Date('2025-06-15'),
 *   reviewFrequency: 'Annually'
 * });
 *
 * @example
 * // Find conditions requiring review
 * const dueForReview = await ChronicCondition.findAll({
 *   where: {
 *     status: [ConditionStatus.ACTIVE, ConditionStatus.CONTROLLED],
 *     nextReviewDate: { [Op.lte]: addMonths(new Date(), 1) }
 *   },
 *   order: [['nextReviewDate', 'ASC']]
 * });
 */
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
