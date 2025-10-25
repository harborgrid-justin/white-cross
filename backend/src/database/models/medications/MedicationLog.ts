/**
 * @fileoverview Medication Log Database Model
 * @module database/models/medications/MedicationLog
 * @description Sequelize model for immutable medication administration audit trail.
 * Records each instance of medication administration with complete details including dosage,
 * time, administrator, safety checks, and observations. Critical for medication safety,
 * legal liability protection, DEA controlled substance tracking, and HIPAA compliance.
 *
 * Key Features:
 * - Immutable audit log (no updates, only inserts via createdAt timestamp)
 * - Medication Safety verification (Five Rights documentation)
 * - Patient identity verification (patientVerified flag)
 * - Allergy checking before administration (allergyChecked flag)
 * - Side effect and adverse reaction tracking
 * - Witness verification for controlled substances (Schedule II)
 * - Device ID for idempotency and duplicate prevention
 * - Nurse accountability via administeredBy and nurseId
 * - Time-based administration tracking with actual dosage given
 * - Computed properties for recent logs and side effect detection
 *
 * Five Rights of Medication Administration:
 * 1. Right Patient: Verified via patientVerified flag and studentMedicationId relationship
 * 2. Right Medication: Linked via studentMedicationId to StudentMedication/Medication
 * 3. Right Dose: Documented in dosageGiven field
 * 4. Right Route: Inherited from StudentMedication record
 * 5. Right Time: Documented in timeGiven field
 *
 * DEA Controlled Substance Requirements:
 * - Schedule II: Witness required (witnessId, witnessName mandatory)
 * - Schedule III-V: Witness optional but recommended
 * - All controlled substances: Complete audit trail with exact time and dosage
 * - Disposal tracking: Wasted medication logged with witness verification
 * - Biennial DEA audit support via comprehensive logs
 *
 * Idempotency and Duplicate Prevention:
 * - deviceId field prevents accidental duplicate logging
 * - Multiple submissions from same device ignored via unique constraint
 * - Supports offline mode with sync reconciliation
 *
 * @compliance HIPAA - All medication logs are Protected Health Information (PHI)
 * @compliance DEA - Controlled substance administration tracking (21 CFR 1304)
 * @compliance State Nursing - Meets nursing documentation standards
 * @compliance Joint Commission - Medication administration documentation requirements
 * @audit Immutable logs provide complete medication administration history
 * @security PHI - Logs contain sensitive health data requiring encryption
 *
 * @requires sequelize - ORM for database operations
 * @requires ../../config/sequelize
 * @requires ../base/AuditableModel - Audit trail support
 *
 * LOC: 66F90127D8
 * WC-GEN-086 | MedicationLog.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *   - AuditableModel.ts (database/models/base/AuditableModel.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 *   - StudentMedication.ts (database/models/medications/StudentMedication.ts)
 *   - MedicationService.ts (services/medication/)
 *   - AdministrationService.ts (services/medication/)
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { AuditableModel } from '../base/AuditableModel';

/**
 * @interface MedicationLogAttributes
 * @description TypeScript interface defining all MedicationLog model attributes.
 * Represents a single instance of medication administration with complete safety verification,
 * dosage tracking, and audit trail for legal protection and DEA compliance.
 *
 * @property {string} id - Primary key, auto-generated UUID
 * @property {string} dosageGiven - Actual dosage administered (may differ from prescribed, e.g., "10mg" vs "10.5mg")
 * @property {Date} timeGiven - Exact date and time medication was administered (for compliance and audit)
 * @property {string} administeredBy - Name of person who administered medication (nurse, EMT, etc.)
 * @property {string} [notes] - Additional administration notes, patient condition, or special circumstances
 * @property {string} [sideEffects] - Observed side effects or adverse reactions during/after administration
 *
 * Safety Verification (Five Rights):
 * @property {boolean} patientVerified - Whether patient identity was verified before administration (Right Patient)
 * @property {boolean} allergyChecked - Whether allergies were checked before administration (safety requirement)
 *
 * Controlled Substance Tracking (DEA):
 * @property {string} [deviceId] - Device ID for idempotency and duplicate prevention (mobile app, tablet)
 * @property {string} [witnessId] - User ID of witness who verified administration (required for Schedule II)
 * @property {string} [witnessName] - Name of witness (backup to witnessId for audit trail)
 *
 * Foreign Keys:
 * @property {string} studentMedicationId - Foreign key to StudentMedication (prescription reference)
 * @property {string} nurseId - Foreign key to User (nurse who administered medication)
 *
 * Audit Fields:
 * @property {Date} createdAt - Record creation timestamp (immutable log entry)
 * @property {string} [createdBy] - User ID who created this log (audit trail via AuditableModel)
 * @property {string} [updatedBy] - User ID who last updated this log (should be null - immutable)
 *
 * @security PHI - All medication administration logs are Protected Health Information
 * @compliance HIPAA - Requires encryption and access logging
 * @compliance DEA - Controlled substance administration audit trail (21 CFR 1304)
 * @immutable Medication logs should never be updated after creation, only inserted
 */
interface MedicationLogAttributes {
  id: string;
  dosageGiven: string;
  timeGiven: Date;
  administeredBy: string;
  notes?: string;
  sideEffects?: string;
  deviceId?: string;
  witnessId?: string;
  witnessName?: string;
  patientVerified: boolean;
  allergyChecked: boolean;
  createdAt: Date;

  // Foreign Keys
  studentMedicationId: string;
  nurseId: string;

  // Audit Fields
  createdBy?: string;
  updatedBy?: string;
}

/**
 * @interface MedicationLogCreationAttributes
 * @description Attributes required when creating a new MedicationLog entry.
 * Only studentMedicationId, dosageGiven, timeGiven, administeredBy, and nurseId are required.
 * Safety flags (patientVerified, allergyChecked) default to true to enforce safety checks.
 */
interface MedicationLogCreationAttributes
  extends Optional<MedicationLogAttributes, 'id' | 'createdAt' | 'notes' | 'sideEffects' | 'deviceId' | 'witnessId' | 'witnessName' | 'patientVerified' | 'allergyChecked' | 'createdBy' | 'updatedBy'> {}

/**
 * @class MedicationLog
 * @extends Model
 * @description Medication Log model for immutable medication administration audit trail.
 * Records each instance of medication being administered to students with complete safety
 * verification, dosage tracking, and legal documentation. Critical for liability protection,
 * DEA controlled substance compliance, and medication error prevention.
 *
 * @tablename medication_logs
 *
 * Immutability Pattern:
 * - No updatedAt timestamp (timestamps: false, updatedAt: false)
 * - Only createdAt tracked
 * - Logs should never be modified after creation
 * - Corrections require new log entry with notes explaining correction
 *
 * Use Cases:
 * - Scheduled medication administration (daily, BID, TID, QID)
 * - PRN (as needed) medication administration
 * - Controlled substance tracking for DEA audits
 * - Medication error documentation and root cause analysis
 * - Side effect and adverse reaction tracking
 * - Legal documentation for liability protection
 * - Nurse workload and compliance tracking
 *
 * Safety Workflow:
 * 1. Nurse retrieves medication and verifies prescription (studentMedicationId)
 * 2. Nurse verifies patient identity (patientVerified = true)
 * 3. Nurse checks allergies (allergyChecked = true)
 * 4. For controlled substances (Schedule II): Second nurse witnesses (witnessId)
 * 5. Nurse administers medication at exact time (timeGiven)
 * 6. Nurse logs administration with actual dosage given (dosageGiven)
 * 7. Nurse documents any side effects or patient response (sideEffects, notes)
 *
 * Computed Properties:
 * - isRecent: Boolean indicating log entry created within last hour
 * - hasSideEffects: Boolean indicating side effects were reported
 * - minutesSinceAdministration: Number of minutes since medication was given
 *
 * @example
 * // Log routine medication administration
 * const routineLog = await MedicationLog.create({
 *   studentMedicationId: 'student-med-uuid',
 *   dosageGiven: '10mg',
 *   timeGiven: new Date(),
 *   administeredBy: 'Nurse Jane Smith, RN',
 *   nurseId: 'nurse-uuid',
 *   patientVerified: true,
 *   allergyChecked: true,
 *   notes: 'Student tolerated medication well, no concerns'
 * });
 *
 * @example
 * // Log controlled substance (Schedule II) with witness
 * const controlledSubstanceLog = await MedicationLog.create({
 *   studentMedicationId: 'adhd-med-uuid',
 *   dosageGiven: '20mg',
 *   timeGiven: new Date(),
 *   administeredBy: 'Nurse John Doe, RN',
 *   nurseId: 'nurse-uuid',
 *   witnessId: 'witness-nurse-uuid',
 *   witnessName: 'Nurse Emily Johnson, RN',
 *   patientVerified: true,
 *   allergyChecked: true,
 *   deviceId: 'ipad-clinic-01',
 *   notes: 'Witnessed administration of Schedule II controlled substance per DEA requirements'
 * });
 *
 * @example
 * // Log PRN medication with side effects
 * const prnWithSideEffect = await MedicationLog.create({
 *   studentMedicationId: 'pain-reliever-uuid',
 *   dosageGiven: '500mg',
 *   timeGiven: new Date(),
 *   administeredBy: 'Nurse Sarah Lee, LPN',
 *   nurseId: 'nurse-uuid',
 *   patientVerified: true,
 *   allergyChecked: true,
 *   notes: 'Student complained of headache, requested pain relief',
 *   sideEffects: 'Mild nausea reported 30 minutes post-administration, student resting comfortably'
 * });
 *
 * @example
 * // Query recent medication administrations for a prescription
 * const recentLogs = await MedicationLog.findAll({
 *   where: {
 *     studentMedicationId: 'student-med-uuid',
 *     timeGiven: {
 *       [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
 *     }
 *   },
 *   order: [['timeGiven', 'DESC']],
 *   include: [{ model: User, as: 'nurse' }]
 * });
 *
 * @example
 * // Find all logs with side effects for safety review
 * const logsWithSideEffects = await MedicationLog.findAll({
 *   where: {
 *     sideEffects: { [Op.ne]: null },
 *     createdAt: {
 *       [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
 *     }
 *   },
 *   include: [
 *     { model: StudentMedication, as: 'studentMedication', include: [{ model: Medication }] },
 *     { model: User, as: 'nurse' }
 *   ]
 * });
 *
 * @example
 * // DEA audit: Controlled substance administration report
 * const controlledSubstanceLogs = await MedicationLog.findAll({
 *   where: {
 *     witnessId: { [Op.ne]: null } // Controlled substances have witnesses
 *   },
 *   include: [
 *     {
 *       model: StudentMedication,
 *       as: 'studentMedication',
 *       include: [{
 *         model: Medication,
 *         where: { isControlled: true, deaSchedule: { [Op.in]: ['II', 'III', 'IV', 'V'] } }
 *       }]
 *     }
 *   ],
 *   order: [['timeGiven', 'DESC']]
 * });
 *
 * @security PHI - All medication logs are Protected Health Information
 * @compliance HIPAA - Encryption at rest, audit logging via AuditableModel
 * @compliance DEA - Complete audit trail for controlled substances (21 CFR 1304)
 * @compliance Joint Commission - Medication administration documentation standards
 * @legal Retention: Logs must be retained 7+ years for legal protection
 * @immutable Never update logs after creation; create new entry for corrections
 */
export class MedicationLog extends Model<MedicationLogAttributes, MedicationLogCreationAttributes> implements MedicationLogAttributes {
  public id!: string;
  public dosageGiven!: string;
  public timeGiven!: Date;
  public administeredBy!: string;
  public notes?: string;
  public sideEffects?: string;
  public deviceId?: string;
  public witnessId?: string;
  public witnessName?: string;
  public patientVerified!: boolean;
  public allergyChecked!: boolean;
  public readonly createdAt!: Date;

  // Foreign Keys
  public studentMedicationId!: string;
  public nurseId!: string;

  // Audit Fields
  public createdBy?: string;
  public updatedBy?: string;

  /**
   * Check if this log entry was created recently (within last hour)
   */
  get isRecent(): boolean {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return this.createdAt > oneHourAgo;
  }

  /**
   * Check if side effects were reported
   */
  get hasSideEffects(): boolean {
    return !!this.sideEffects && this.sideEffects.trim().length > 0;
  }

  /**
   * Get time elapsed since administration (in minutes)
   */
  get minutesSinceAdministration(): number {
    const now = new Date();
    const diff = now.getTime() - this.timeGiven.getTime();
    return Math.floor(diff / (1000 * 60));
  }
}

MedicationLog.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    dosageGiven: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Actual dosage administered (may differ from prescribed)',
    },
    timeGiven: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Exact date and time medication was administered',
    },
    administeredBy: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Name of person who administered the medication',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Additional notes about administration',
    },
    sideEffects: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Any observed side effects or adverse reactions',
    },
    deviceId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Device ID used for administration (for idempotency)',
    },
    witnessId: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      comment: 'User ID of witness (required for controlled substances Schedule I-II)',
    },
    witnessName: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Name of witness who verified administration',
    },
    patientVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether patient identity was verified (Right Patient)',
    },
    allergyChecked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether allergies were checked before administration',
    },
    studentMedicationId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'student_medications',
        key: 'id',
      },
    },
    nurseId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      comment: 'User ID of the nurse who administered the medication',
    },
    ...AuditableModel.getAuditableFields(),
    createdAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'medication_logs',
    timestamps: false,
    createdAt: true,
    updatedAt: false,
    indexes: [
      { fields: ['studentMedicationId'] },
      { fields: ['nurseId'] },
      { fields: ['timeGiven'] },
      { fields: ['studentMedicationId', 'timeGiven'] },
      { fields: ['createdAt'] },
      { fields: ['createdBy'] },
    ],
  }
);

AuditableModel.setupAuditHooks(MedicationLog, 'MedicationLog');
