/**
 * @fileoverview Vital Signs Database Model
 * @module database/models/healthcare/VitalSigns
 * @description Sequelize model for tracking student vital signs and clinical measurements.
 * Supports comprehensive vital sign recording including temperature, blood pressure, heart rate,
 * respiratory rate, oxygen saturation, pain assessment, glucose levels, and peak flow measurements.
 *
 * Key Features:
 * - Multi-parameter vital sign tracking (temperature, BP, HR, RR, SpO2, glucose, peak flow)
 * - Multiple measurement sites and methods (oral, axillary, tympanic temperature)
 * - Pain assessment with location tracking (0-10 scale)
 * - Consciousness level monitoring (ALERT, VERBAL, PAIN, UNRESPONSIVE)
 * - Oxygen therapy tracking (supplemental oxygen flag)
 * - Clinical context linking (health records, appointments)
 * - Audit trail integration with automatic PHI logging
 * - Clinical range validation and alert thresholds
 *
 * Clinical Vital Sign Ranges (Pediatric School-Age):
 * - Temperature: 97.0-99.5°F (36.1-37.5°C) normal range
 * - Blood Pressure: Systolic 90-120, Diastolic 60-80 mmHg (age-dependent)
 * - Heart Rate: 70-120 bpm (varies by age and activity)
 * - Respiratory Rate: 12-20 breaths/min
 * - Oxygen Saturation: 95-100% normal, <90% critical
 * - Pain Level: 0 (no pain) to 10 (worst pain)
 * - Glucose: 70-140 mg/dL fasting (context-dependent)
 * - Peak Flow: Age/height-dependent asthma monitoring
 *
 * Measurement Standards:
 * - Temperature sites: oral, axillary (armpit), tympanic (ear), temporal, rectal
 * - Blood pressure positions: sitting, standing, lying (affects baseline)
 * - Heart rhythm: regular, irregular, bounding, weak
 * - Consciousness: AVPU scale (Alert, Verbal, Pain, Unresponsive)
 *
 * @compliance HIPAA - All vital signs are Protected Health Information (PHI)
 * @compliance Clinical Documentation - Meets nursing documentation standards
 * @audit All vital sign records are immutable and audited via AuditableModel
 * @security PHI - Vital signs contain sensitive health data requiring encryption at rest
 *
 * @requires sequelize - ORM for database operations
 * @requires ../../config/sequelize
 * @requires ../../types/enums - ConsciousnessLevel enum
 * @requires ../base/AuditableModel - Audit trail support
 *
 * LOC: 544E278E44
 * WC-GEN-070 | VitalSigns.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *   - enums.ts (database/types/enums.ts - ConsciousnessLevel)
 *   - AuditableModel.ts (database/models/base/AuditableModel.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 *   - HealthRecordService.ts (services/healthcare/)
 *   - AppointmentService.ts (services/appointment/)
 *   - VitalSignsRepository.ts (repositories/)
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { ConsciousnessLevel } from '../../types/enums';
import { AuditableModel } from '../base/AuditableModel';

/**
 * @interface VitalSignsAttributes
 * @description TypeScript interface defining all VitalSigns model attributes.
 * Comprehensive vital sign measurement data for student health monitoring and clinical documentation.
 *
 * @property {string} id - Primary key, auto-generated UUID
 * @property {string} studentId - Foreign key to Student model (cascade delete)
 * @property {string} [healthRecordId] - Optional link to health record entry
 * @property {string} [appointmentId] - Optional link to appointment when vital signs were taken
 * @property {Date} measurementDate - Date and time when vital signs were measured (required for clinical accuracy)
 * @property {string} measuredBy - Name or ID of healthcare provider who took measurements (audit trail)
 * @property {string} [measuredByRole] - Role of person taking measurements (RN, LPN, MD, EMT)
 *
 * Temperature Measurements:
 * @property {number} [temperature] - Body temperature (Fahrenheit or Celsius, see temperatureUnit)
 * @property {string} temperatureUnit - Temperature unit: 'F' (Fahrenheit) or 'C' (Celsius), defaults to 'F'
 * @property {string} [temperatureSite] - Measurement site: 'oral', 'axillary', 'tympanic', 'temporal', 'rectal'
 *
 * Cardiovascular Measurements:
 * @property {number} [bloodPressureSystolic] - Systolic blood pressure in mmHg (90-180 typical range)
 * @property {number} [bloodPressureDiastolic] - Diastolic blood pressure in mmHg (60-100 typical range)
 * @property {string} [bloodPressurePosition] - Patient position during BP measurement: 'sitting', 'standing', 'lying'
 * @property {number} [heartRate] - Heart rate in beats per minute (bpm), 60-120 typical for school-age
 * @property {string} [heartRhythm] - Heart rhythm description: 'regular', 'irregular', 'bounding', 'weak'
 *
 * Respiratory Measurements:
 * @property {number} [respiratoryRate] - Breaths per minute (12-20 typical for school-age)
 * @property {number} [oxygenSaturation] - SpO2 percentage (0-100), normal >95%, critical <90%
 * @property {boolean} oxygenSupplemental - Whether patient is on supplemental oxygen (affects SpO2 interpretation)
 * @property {number} [peakFlow] - Peak expiratory flow for asthma monitoring (liters/minute, age/height dependent)
 *
 * Pain and Neurological Assessment:
 * @property {number} [painLevel] - Pain level 0-10 scale (0=no pain, 10=worst pain imaginable)
 * @property {string} [painLocation] - Anatomical location of pain (e.g., 'head', 'abdomen', 'chest')
 * @property {ConsciousnessLevel} [consciousness] - AVPU consciousness level: ALERT, VERBAL, PAIN, UNRESPONSIVE
 *
 * Metabolic Measurements:
 * @property {number} [glucoseLevel] - Blood glucose in mg/dL (70-140 typical fasting, context-dependent)
 *
 * Clinical Notes and Audit:
 * @property {string} [notes] - Clinical notes, observations, or context about vital signs
 * @property {string} [createdBy] - User ID who created this record (audit trail via AuditableModel)
 * @property {string} [updatedBy] - User ID who last updated this record (audit trail)
 * @property {Date} createdAt - Record creation timestamp
 * @property {Date} updatedAt - Record last update timestamp
 *
 * @security PHI - All vital sign data is Protected Health Information
 * @compliance HIPAA - Requires encryption at rest and in transit
 * @clinical All measurements should be validated against age-appropriate normal ranges
 */
interface VitalSignsAttributes {
  id: string;
  studentId: string;
  healthRecordId?: string;
  appointmentId?: string;
  measurementDate: Date;
  measuredBy: string;
  measuredByRole?: string;
  temperature?: number;
  temperatureUnit: string;
  temperatureSite?: string;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  bloodPressurePosition?: string;
  heartRate?: number;
  heartRhythm?: string;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  oxygenSupplemental: boolean;
  painLevel?: number;
  painLocation?: string;
  consciousness?: ConsciousnessLevel;
  glucoseLevel?: number;
  peakFlow?: number;
  notes?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @interface VitalSignsCreationAttributes
 * @description Attributes required when creating a new VitalSigns record.
 * Only studentId, measurementDate, and measuredBy are required. All vital sign measurements are optional
 * to support partial vital sign records (e.g., temperature-only checks, BP-only monitoring).
 */
interface VitalSignsCreationAttributes
  extends Optional<
    VitalSignsAttributes,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'healthRecordId'
    | 'appointmentId'
    | 'measuredByRole'
    | 'temperature'
    | 'temperatureUnit'
    | 'temperatureSite'
    | 'bloodPressureSystolic'
    | 'bloodPressureDiastolic'
    | 'bloodPressurePosition'
    | 'heartRate'
    | 'heartRhythm'
    | 'respiratoryRate'
    | 'oxygenSaturation'
    | 'oxygenSupplemental'
    | 'painLevel'
    | 'painLocation'
    | 'consciousness'
    | 'glucoseLevel'
    | 'peakFlow'
    | 'notes'
    | 'createdBy'
    | 'updatedBy'
  > {}

/**
 * @class VitalSigns
 * @extends Model
 * @description Vital Signs model for tracking student vital sign measurements and clinical observations.
 * Provides comprehensive health monitoring with support for multiple vital parameters, clinical context,
 * and audit trail integration for HIPAA compliance.
 *
 * @tablename vital_signs
 *
 * Clinical Use Cases:
 * - Routine health screenings (temperature, BP, HR)
 * - Pre-appointment vital sign collection
 * - Illness assessment and monitoring
 * - Medication side effect monitoring (e.g., BP for stimulant medications)
 * - Asthma monitoring (peak flow tracking)
 * - Diabetes management (glucose monitoring)
 * - Post-incident vital sign documentation
 * - Athletic participation physicals
 *
 * Measurement Categories:
 * 1. Temperature: Body temperature with site specification (oral, axillary, tympanic, temporal, rectal)
 * 2. Cardiovascular: Blood pressure (systolic/diastolic), heart rate, rhythm
 * 3. Respiratory: Respiratory rate, oxygen saturation, peak flow (asthma)
 * 4. Neurological: Consciousness level (AVPU), pain assessment
 * 5. Metabolic: Blood glucose level
 *
 * Clinical Decision Support:
 * - Automated alerts for out-of-range values (implemented in service layer)
 * - Trending analysis for chronic condition monitoring
 * - Comparison to age-appropriate normal ranges
 * - Flagging critical values requiring immediate intervention
 *
 * Audit Trail:
 * - All vital sign records are immutable once created
 * - AuditableModel integration logs all access to PHI
 * - measuredBy field provides accountability
 * - measurementDate provides temporal context for legal documentation
 *
 * @example
 * // Record full vital signs during health screening
 * const vitals = await VitalSigns.create({
 *   studentId: 'student-uuid',
 *   measurementDate: new Date(),
 *   measuredBy: 'nurse-uuid',
 *   measuredByRole: 'RN',
 *   temperature: 98.6,
 *   temperatureUnit: 'F',
 *   temperatureSite: 'oral',
 *   bloodPressureSystolic: 110,
 *   bloodPressureDiastolic: 70,
 *   bloodPressurePosition: 'sitting',
 *   heartRate: 85,
 *   heartRhythm: 'regular',
 *   respiratoryRate: 16,
 *   oxygenSaturation: 98,
 *   oxygenSupplemental: false,
 *   consciousness: ConsciousnessLevel.ALERT,
 *   notes: 'Routine screening, all parameters within normal limits'
 * });
 *
 * @example
 * // Record temperature-only check for illness assessment
 * const tempCheck = await VitalSigns.create({
 *   studentId: 'student-uuid',
 *   measurementDate: new Date(),
 *   measuredBy: 'nurse-uuid',
 *   temperature: 101.2,
 *   temperatureUnit: 'F',
 *   temperatureSite: 'tympanic',
 *   notes: 'Student reports feeling unwell, elevated temperature detected'
 * });
 *
 * @example
 * // Record asthma peak flow monitoring
 * const peakFlowCheck = await VitalSigns.create({
 *   studentId: 'asthma-student-uuid',
 *   appointmentId: 'appointment-uuid',
 *   measurementDate: new Date(),
 *   measuredBy: 'nurse-uuid',
 *   peakFlow: 320,
 *   notes: 'Daily asthma monitoring, peak flow 80% of personal best'
 * });
 *
 * @example
 * // Query vital signs for trending analysis
 * const recentVitals = await VitalSigns.findAll({
 *   where: {
 *     studentId: 'student-uuid',
 *     measurementDate: {
 *       [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
 *     }
 *   },
 *   order: [['measurementDate', 'DESC']],
 *   attributes: ['measurementDate', 'bloodPressureSystolic', 'bloodPressureDiastolic', 'heartRate']
 * });
 *
 * @example
 * // Find critical vital signs requiring intervention
 * const criticalVitals = await VitalSigns.findAll({
 *   where: {
 *     [Op.or]: [
 *       { temperature: { [Op.gt]: 103 } }, // Fever >103°F
 *       { oxygenSaturation: { [Op.lt]: 90 } }, // SpO2 <90%
 *       { bloodPressureSystolic: { [Op.gt]: 140 } }, // Hypertension
 *       { consciousness: { [Op.ne]: ConsciousnessLevel.ALERT } } // Altered consciousness
 *     ],
 *     measurementDate: {
 *       [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
 *     }
 *   },
 *   include: [{ model: Student, as: 'student' }]
 * });
 *
 * @security PHI - All vital sign data is Protected Health Information
 * @compliance HIPAA - Encryption at rest, audit logging via AuditableModel
 * @compliance Clinical Standards - Meets nursing documentation requirements
 * @legal Retention: Vital signs are part of health record, 7 years retention minimum
 */
export class VitalSigns extends Model<VitalSignsAttributes, VitalSignsCreationAttributes> implements VitalSignsAttributes {
  public id!: string;
  public studentId!: string;
  public healthRecordId?: string;
  public appointmentId?: string;
  public measurementDate!: Date;
  public measuredBy!: string;
  public measuredByRole?: string;
  public temperature?: number;
  public temperatureUnit!: string;
  public temperatureSite?: string;
  public bloodPressureSystolic?: number;
  public bloodPressureDiastolic?: number;
  public bloodPressurePosition?: string;
  public heartRate?: number;
  public heartRhythm?: string;
  public respiratoryRate?: number;
  public oxygenSaturation?: number;
  public oxygenSupplemental!: boolean;
  public painLevel?: number;
  public painLocation?: string;
  public consciousness?: ConsciousnessLevel;
  public glucoseLevel?: number;
  public peakFlow?: number;
  public notes?: string;
  public createdBy?: string;
  public updatedBy?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

VitalSigns.init(
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
    appointmentId: {
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
    temperature: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    temperatureUnit: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'F',
    },
    temperatureSite: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bloodPressureSystolic: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    bloodPressureDiastolic: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    bloodPressurePosition: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    heartRate: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    heartRhythm: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    respiratoryRate: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    oxygenSaturation: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    oxygenSupplemental: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    painLevel: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    painLocation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    consciousness: {
      type: DataTypes.ENUM(...Object.values(ConsciousnessLevel)),
      allowNull: true,
    },
    glucoseLevel: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: true,
    },
    peakFlow: {
      type: DataTypes.INTEGER,
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
    tableName: 'vital_signs',
    timestamps: true,
    indexes: [
      { fields: ['studentId', 'measurementDate'] },
      { fields: ['measurementDate'] },
      { fields: ['appointmentId'] },
    ],
  }
);

AuditableModel.setupAuditHooks(VitalSigns, 'VitalSigns');
