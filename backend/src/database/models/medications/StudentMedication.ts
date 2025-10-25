/**
 * @fileoverview Student Medication Database Model
 * @module database/models/medications/StudentMedication
 * @description Sequelize model for managing medication prescriptions assigned to individual students.
 * Represents the junction between students and medications with prescription details, dosing schedules,
 * and administration tracking. Critical for medication safety, HIPAA compliance, and DEA controlled substance monitoring.
 *
 * Key Features:
 * - Student-specific medication prescription management
 * - Dosage and frequency tracking with flexible text format
 * - Route of administration specification (oral, topical, injection, etc.)
 * - Start/end date tracking for time-limited prescriptions
 * - Active/inactive status for prescription lifecycle management
 * - Prescriber information with optional prescription number
 * - Refill tracking for prescription monitoring
 * - One-to-many relationship with MedicationLog for administration history
 * - Audit trail integration via AuditableModel
 * - Computed properties for active status and days remaining
 *
 * Prescription Workflow:
 * 1. Prescriber writes prescription (prescribedBy, prescriptionNumber)
 * 2. Nurse creates StudentMedication record linking Student + Medication
 * 3. Prescription activated (isActive=true, startDate set)
 * 4. Medication administered (logged in MedicationLog)
 * 5. Refills tracked (refillsRemaining decremented)
 * 6. Prescription ends (endDate reached or manually deactivated)
 *
 * Route of Administration Standards:
 * - Oral: tablets, capsules, liquids, suspensions
 * - Sublingual: under tongue (e.g., nitroglycerin)
 * - Buccal: between cheek and gum
 * - Topical: creams, ointments, patches
 * - Inhalation: inhalers, nebulizers (asthma medications)
 * - Injection: subcutaneous, intramuscular, intravenous
 * - Rectal: suppositories
 * - Ophthalmic: eye drops
 * - Otic: ear drops
 * - Nasal: nasal sprays
 *
 * Frequency Formats:
 * - "Once daily" / "QD" - One time per day
 * - "Twice daily" / "BID" - Two times per day
 * - "Three times daily" / "TID" - Three times per day
 * - "Four times daily" / "QID" - Four times per day
 * - "Every 4 hours" / "Q4H" - Every 4 hours
 * - "As needed" / "PRN" - As needed for symptoms
 * - "With meals" - Taken with food
 * - "Before bed" / "QHS" - At bedtime
 *
 * @compliance HIPAA - Student medication prescriptions are Protected Health Information (PHI)
 * @compliance DEA - Controlled substances require special tracking and audit trail
 * @compliance State Pharmacy - Prescription number tracking for regulatory compliance
 * @audit All prescription changes logged via AuditableModel for liability protection
 * @security PHI - Prescription data requires encryption at rest and access logging
 *
 * @requires sequelize - ORM for database operations
 * @requires ../../config/sequelize
 * @requires ../base/AuditableModel - Audit trail support
 * @requires ../core/Student - Student relationship
 * @requires ../core/Medication - Medication relationship
 * @requires ./MedicationLog - Administration log relationship
 *
 * LOC: 562EB65627
 * WC-GEN-087 | StudentMedication.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *   - AuditableModel.ts (database/models/base/AuditableModel.ts)
 *   - Student.ts (database/models/core/Student.ts)
 *   - Medication.ts (database/models/core/Medication.ts)
 *   - MedicationLog.ts (database/models/medications/MedicationLog.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 *   - MedicationService.ts (services/medication/)
 *   - StudentMedicationService.ts (services/medication/)
 *   - MedicationRepository.ts (repositories/)
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { AuditableModel } from '../base/AuditableModel';
import type { Student } from '../core/Student';
import type { Medication } from '../core/Medication';
import type { MedicationLog } from './MedicationLog';

/**
 * @interface StudentMedicationAttributes
 * @description TypeScript interface defining all StudentMedication model attributes.
 * Represents a complete medication prescription for a specific student, including dosage,
 * schedule, administration details, and audit information.
 *
 * @property {string} id - Primary key, auto-generated UUID
 * @property {string} dosage - Medication dosage amount (e.g., "10mg", "2 tablets", "5mL", "1 puff")
 * @property {string} frequency - Administration frequency (e.g., "Once daily", "BID", "PRN", "Q4H")
 * @property {string} route - Route of administration (e.g., "Oral", "Topical", "Inhalation", "Injection")
 * @property {string} [instructions] - Special administration instructions (e.g., "Take with food", "Avoid dairy")
 * @property {Date} startDate - Date when prescription becomes active
 * @property {Date} [endDate] - Optional end date for time-limited prescriptions (null for ongoing)
 * @property {boolean} isActive - Whether prescription is currently active (can be manually deactivated)
 * @property {string} prescribedBy - Name or ID of prescribing healthcare provider (MD, DO, NP, PA)
 * @property {string} [prescriptionNumber] - Prescription tracking number for pharmacy verification
 * @property {number} [refillsRemaining] - Number of authorized refills remaining (0-12 range)
 * @property {Date} createdAt - Record creation timestamp
 * @property {Date} updatedAt - Record last update timestamp
 *
 * Foreign Keys:
 * @property {string} studentId - Foreign key to Student model (cascade delete when student removed)
 * @property {string} medicationId - Foreign key to Medication model (medication catalog reference)
 *
 * Audit Fields:
 * @property {string} [createdBy] - User ID who created this prescription (audit trail via AuditableModel)
 * @property {string} [updatedBy] - User ID who last updated this prescription (audit trail)
 *
 * @security PHI - All prescription data is Protected Health Information
 * @compliance HIPAA - Requires encryption and access logging
 * @compliance DEA - Controlled substances require enhanced tracking
 */
interface StudentMedicationAttributes {
  id: string;
  dosage: string;
  frequency: string;
  route: string;
  instructions?: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  prescribedBy: string;
  prescriptionNumber?: string;
  refillsRemaining?: number;
  createdAt: Date;
  updatedAt: Date;

  // Foreign Keys
  studentId: string;
  medicationId: string;

  // Audit Fields
  createdBy?: string;
  updatedBy?: string;
}

/**
 * @interface StudentMedicationCreationAttributes
 * @description Attributes required when creating a new StudentMedication prescription.
 * Only studentId, medicationId, dosage, frequency, route, startDate, and prescribedBy are required.
 * Other fields have defaults or are optional to support various prescription scenarios.
 */
interface StudentMedicationCreationAttributes
  extends Optional<StudentMedicationAttributes, 'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'instructions' | 'endDate' | 'prescriptionNumber' | 'refillsRemaining' | 'createdBy' | 'updatedBy'> {}

/**
 * @class StudentMedication
 * @extends Model
 * @description Student Medication model for managing medication prescriptions assigned to individual students.
 * Represents the prescription details linking a student to a specific medication with dosage, frequency,
 * and administration tracking. Critical for medication safety, compliance, and audit trail.
 *
 * @tablename student_medications
 *
 * Prescription Types:
 * - Chronic/Maintenance: Ongoing medications with no end date (e.g., ADHD medications, insulin)
 * - Acute/Time-Limited: Prescriptions with specific end dates (e.g., antibiotics, pain relievers)
 * - PRN (As Needed): Medications taken only when symptoms occur (e.g., rescue inhalers, pain relief)
 * - Scheduled: Fixed-time administration (e.g., "8:00 AM daily", "with lunch")
 *
 * Medication Safety (Five Rights):
 * 1. Right Patient: Verified via studentId relationship
 * 2. Right Medication: Verified via medicationId relationship to medication catalog
 * 3. Right Dose: Specified in dosage field
 * 4. Right Route: Specified in route field
 * 5. Right Time: Specified in frequency field and enforced via MedicationLog
 *
 * Controlled Substance Tracking:
 * - DEA Schedule II-V medications require enhanced audit trail
 * - prescriptionNumber mandatory for controlled substances
 * - refillsRemaining tracking for Schedule III-V (Schedule II no refills allowed)
 * - All administration logged in MedicationLog with witness for Schedule II
 *
 * Active Status Logic:
 * - isActive=true AND current date >= startDate AND (endDate is null OR current date <= endDate)
 * - isCurrentlyActive computed property performs this calculation
 * - Prescriptions can be manually deactivated (isActive=false) before endDate
 *
 * Relationships:
 * - BelongsTo Student (studentId FK) - Prescription owner
 * - BelongsTo Medication (medicationId FK) - Medication catalog entry
 * - HasMany MedicationLog (logs FK) - Administration history
 *
 * Computed Properties:
 * - isCurrentlyActive: Boolean indicating if prescription is active right now
 * - daysRemaining: Number of days until endDate (null if ongoing)
 *
 * @example
 * // Create ongoing ADHD medication prescription
 * const adhdMedication = await StudentMedication.create({
 *   studentId: 'student-uuid',
 *   medicationId: 'methylphenidate-uuid',
 *   dosage: '10mg',
 *   frequency: 'Once daily',
 *   route: 'Oral',
 *   instructions: 'Take in morning with breakfast, avoid evening doses',
 *   startDate: new Date('2025-09-01'),
 *   endDate: null, // Ongoing prescription
 *   prescribedBy: 'Dr. Jane Smith, MD',
 *   prescriptionNumber: 'RX-12345678',
 *   refillsRemaining: 6
 * });
 *
 * @example
 * // Create time-limited antibiotic prescription
 * const antibiotic = await StudentMedication.create({
 *   studentId: 'student-uuid',
 *   medicationId: 'amoxicillin-uuid',
 *   dosage: '500mg',
 *   frequency: 'Three times daily',
 *   route: 'Oral',
 *   instructions: 'Take with food, complete full course',
 *   startDate: new Date(),
 *   endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days
 *   prescribedBy: 'Dr. John Doe, MD',
 *   refillsRemaining: 0 // No refills for antibiotics
 * });
 *
 * @example
 * // Create PRN rescue inhaler prescription
 * const rescueInhaler = await StudentMedication.create({
 *   studentId: 'asthma-student-uuid',
 *   medicationId: 'albuterol-inhaler-uuid',
 *   dosage: '2 puffs',
 *   frequency: 'As needed (PRN)',
 *   route: 'Inhalation',
 *   instructions: 'Use for acute asthma symptoms, wait 1 minute between puffs. Seek help if no improvement after 15 minutes.',
 *   startDate: new Date(),
 *   endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
 *   prescribedBy: 'Dr. Emily Johnson, MD',
 *   refillsRemaining: 3
 * });
 *
 * @example
 * // Query active prescriptions for a student
 * const activeMeds = await StudentMedication.findAll({
 *   where: {
 *     studentId: 'student-uuid',
 *     isActive: true,
 *     startDate: { [Op.lte]: new Date() },
 *     [Op.or]: [
 *       { endDate: null },
 *       { endDate: { [Op.gte]: new Date() } }
 *     ]
 *   },
 *   include: [
 *     { model: Medication, as: 'medication' },
 *     { model: MedicationLog, as: 'logs', order: [['timeGiven', 'DESC']], limit: 5 }
 *   ]
 * });
 *
 * @example
 * // Find prescriptions expiring soon (next 7 days)
 * const expiringSoon = await StudentMedication.findAll({
 *   where: {
 *     isActive: true,
 *     endDate: {
 *       [Op.between]: [new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
 *     }
 *   },
 *   include: [{ model: Student, as: 'student' }, { model: Medication, as: 'medication' }]
 * });
 *
 * @example
 * // Check if prescription is currently active using computed property
 * const prescription = await StudentMedication.findByPk('prescription-uuid');
 * if (prescription && prescription.isCurrentlyActive) {
 *   console.log(`Prescription active, ${prescription.daysRemaining} days remaining`);
 * }
 *
 * @security PHI - All prescription data is Protected Health Information
 * @compliance HIPAA - Encryption at rest, audit logging via AuditableModel
 * @compliance DEA - Controlled substance prescriptions require enhanced tracking
 * @legal Retention: Prescription records must be retained 7 years minimum
 */
export class StudentMedication extends Model<StudentMedicationAttributes, StudentMedicationCreationAttributes> implements StudentMedicationAttributes {
  public id!: string;
  public dosage!: string;
  public frequency!: string;
  public route!: string;
  public instructions?: string;
  public startDate!: Date;
  public endDate?: Date;
  public isActive!: boolean;
  public prescribedBy!: string;
  public prescriptionNumber?: string;
  public refillsRemaining?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Foreign Keys
  public studentId!: string;
  public medicationId!: string;

  // Audit Fields
  public createdBy?: string;
  public updatedBy?: string;

  // Association declarations
  declare logs?: MedicationLog[];
  declare student?: Student;
  declare medication?: Medication;

  /**
   * Check if medication is currently active based on dates
   */
  get isCurrentlyActive(): boolean {
    const now = new Date();
    const isAfterStart = now >= this.startDate;
    const isBeforeEnd = !this.endDate || now <= this.endDate;
    return this.isActive && isAfterStart && isBeforeEnd;
  }

  /**
   * Get the number of days remaining in the medication schedule
   */
  get daysRemaining(): number | null {
    if (!this.endDate) return null;
    const now = new Date();
    const diff = this.endDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}

StudentMedication.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    dosage: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Medication dosage (e.g., "10mg", "2 tablets")',
    },
    frequency: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Administration frequency (e.g., "Once daily", "Twice daily", "As needed")',
    },
    route: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Administration route (e.g., "Oral", "Topical", "Injection")',
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Special instructions for medication administration',
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Date when medication regimen begins',
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Date when medication regimen ends (null for ongoing)',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether this medication prescription is currently active',
    },
    prescribedBy: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Name of prescribing healthcare provider',
    },
    prescriptionNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Prescription number for tracking and verification',
    },
    refillsRemaining: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 12
      },
      comment: 'Number of refills remaining for this prescription',
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'students',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    medicationId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'medications',
        key: 'id',
      },
    },
    ...AuditableModel.getAuditableFields(),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'student_medications',
    timestamps: true,
    indexes: [
      { fields: ['studentId'] },
      { fields: ['medicationId'] },
      { fields: ['isActive'] },
      { fields: ['startDate'] },
      { fields: ['endDate'] },
      { fields: ['studentId', 'isActive'] },
      { fields: ['createdBy'] },
    ],
  }
);

AuditableModel.setupAuditHooks(StudentMedication, 'StudentMedication');
