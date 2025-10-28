/**
 * @fileoverview Health Record Database Model
 * @module database/models/healthcare/HealthRecord
 * @description Sequelize model for managing comprehensive student health records including
 * medical visits, diagnoses, treatments, and follow-up care tracking.
 *
 * Key Features:
 * - Multi-type health record support (medical, dental, vision, mental health, etc.)
 * - NPI provider and facility tracking
 * - ICD diagnosis code support
 * - Follow-up care workflow management
 * - Document attachment support
 * - Confidentiality flags for sensitive records
 * - Full audit trail for HIPAA compliance
 *
 * @compliance HIPAA Privacy Rule §164.308 - Contains Protected Health Information (PHI)
 * @compliance FERPA §99.3 - Educational health records
 * @audit All access and modifications logged per HIPAA requirements
 *
 * @requires sequelize
 * @requires ../../config/sequelize
 * @requires ../../types/enums
 * @requires ../base/AuditableModel
 *
 * LOC: CAB88918CD
 * WC-GEN-066
 *
 * UPSTREAM: sequelize.ts, enums.ts, AuditableModel.ts
 * DOWNSTREAM: index.ts, HealthRecordRepository.ts
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { HealthRecordType } from '../../types/enums';
import { AuditableModel } from '../base/AuditableModel';

/**
 * @interface HealthRecordAttributes
 * @description TypeScript interface defining all HealthRecord model attributes
 *
 * @property {string} id - Primary key, auto-generated UUID
 * @property {string} studentId - Foreign key reference to student, required
 * @property {HealthRecordType} recordType - Type of health record (medical, dental, vision, etc.), required
 * @property {string} title - Brief title/summary of the health record, required
 * @property {string} description - Detailed description of the health event, required
 * @property {Date} recordDate - Date when the health event occurred, required
 * @property {string} [provider] - Healthcare provider name (nullable)
 * @property {string} [providerNpi] - National Provider Identifier (10-digit), nullable
 * @property {string} [facility] - Healthcare facility name (nullable)
 * @property {string} [facilityNpi] - Facility National Provider Identifier, nullable
 * @property {string} [diagnosis] - Medical diagnosis description (nullable)
 * @property {string} [diagnosisCode] - ICD-10 diagnosis code (nullable)
 * @property {string} [treatment] - Treatment provided or recommended (nullable)
 * @property {boolean} followUpRequired - Whether follow-up care is needed, defaults to false
 * @property {Date} [followUpDate] - Scheduled date for follow-up (nullable)
 * @property {boolean} followUpCompleted - Whether follow-up has been completed, defaults to false
 * @property {string[]} attachments - Array of file paths/URLs for supporting documents, defaults to []
 * @property {any} [metadata] - Additional structured data (JSONB), nullable
 * @property {boolean} isConfidential - Whether record contains sensitive information, defaults to false
 * @property {string} [notes] - Additional notes or comments (nullable)
 * @property {string} [createdBy] - User ID who created the record (audit field)
 * @property {string} [updatedBy] - User ID who last updated the record (audit field)
 * @property {Date} createdAt - Timestamp of record creation
 * @property {Date} updatedAt - Timestamp of last update
 *
 * @security PHI - All fields except id, timestamps contain Protected Health Information
 */
interface HealthRecordAttributes {
  id: string;
  studentId: string;
  recordType: HealthRecordType;
  title: string;
  description: string;
  recordDate: Date;
  provider?: string;
  providerNpi?: string;
  facility?: string;
  facilityNpi?: string;
  diagnosis?: string;
  diagnosisCode?: string;
  treatment?: string;
  followUpRequired: boolean;
  followUpDate?: Date;
  followUpCompleted: boolean;
  attachments: string[];
  metadata?: any;
  isConfidential: boolean;
  notes?: string;
  isActive: boolean;
  deletedAt?: Date;
  deletedBy?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @interface HealthRecordCreationAttributes
 * @description Attributes required when creating a new HealthRecord instance.
 * Extends HealthRecordAttributes with optional fields that have defaults or are auto-generated.
 */
interface HealthRecordCreationAttributes
  extends Optional<
    HealthRecordAttributes,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'followUpRequired'
    | 'followUpCompleted'
    | 'isConfidential'
    | 'isActive'
    | 'deletedAt'
    | 'deletedBy'
    | 'attachments'
    | 'provider'
    | 'providerNpi'
    | 'facility'
    | 'facilityNpi'
    | 'diagnosis'
    | 'diagnosisCode'
    | 'treatment'
    | 'followUpDate'
    | 'metadata'
    | 'notes'
    | 'createdBy'
    | 'updatedBy'
  > {}

/**
 * @class HealthRecord
 * @extends Model
 * @description Student health record model for tracking medical visits, diagnoses, treatments, and follow-up care.
 *
 * @tablename health_records
 *
 * Key Features:
 * - Supports multiple record types (medical, dental, vision, mental health, injury, immunization)
 * - Provider and facility tracking with NPI identifiers
 * - ICD-10 diagnosis code support for standardized coding
 * - Follow-up workflow with scheduling and completion tracking
 * - Document attachment support for lab results, prescriptions, etc.
 * - Confidentiality flags for sensitive information (mental health, etc.)
 * - Comprehensive audit trail via AuditableModel
 * - Indexed for efficient queries by student, type, and follow-up status
 *
 * Record Types (from HealthRecordType enum):
 * - MEDICAL: General medical visits and treatments
 * - DENTAL: Dental examinations and procedures
 * - VISION: Vision screenings and eye care
 * - MENTAL_HEALTH: Mental health assessments and counseling
 * - INJURY: Accident or injury reports
 * - IMMUNIZATION: Vaccination records
 * - OTHER: Other health-related records
 *
 * @security Contains PHI - All operations audited and logged
 * @compliance HIPAA Privacy Rule - 45 CFR §164.308(a)(3)(ii)(A)
 * @compliance FERPA - 20 U.S.C. §1232g for educational health records
 *
 * @example
 * // Create a medical visit record
 * const record = await HealthRecord.create({
 *   studentId: 'student-uuid',
 *   recordType: HealthRecordType.MEDICAL,
 *   title: 'Annual Physical Examination',
 *   description: 'Routine annual physical exam - all systems normal',
 *   recordDate: new Date('2024-01-15'),
 *   provider: 'Dr. Jane Smith',
 *   providerNpi: '1234567890',
 *   facility: 'County Health Clinic',
 *   diagnosisCode: 'Z00.00',
 *   followUpRequired: false,
 *   isConfidential: false
 * });
 *
 * @example
 * // Query records requiring follow-up
 * const pendingFollowUps = await HealthRecord.findAll({
 *   where: {
 *     followUpRequired: true,
 *     followUpCompleted: false,
 *     followUpDate: { [Op.lte]: new Date() }
 *   },
 *   order: [['followUpDate', 'ASC']]
 * });
 */
export class HealthRecord extends Model<HealthRecordAttributes, HealthRecordCreationAttributes> implements HealthRecordAttributes {
  public id!: string;
  public studentId!: string;
  public recordType!: HealthRecordType;
  public title!: string;
  public description!: string;
  public recordDate!: Date;
  public provider?: string;
  public providerNpi?: string;
  public facility?: string;
  public facilityNpi?: string;
  public diagnosis?: string;
  public diagnosisCode?: string;
  public treatment?: string;
  public followUpRequired!: boolean;
  public followUpDate?: Date;
  public followUpCompleted!: boolean;
  public attachments!: string[];
  public metadata?: any;
  public isConfidential!: boolean;
  public notes?: string;
  public isActive!: boolean;
  public deletedAt?: Date;
  public deletedBy?: string;
  public createdBy?: string;
  public updatedBy?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

HealthRecord.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    /**
     * Foreign key reference to Student this health record belongs to
     *
     * @type {string}
     * @description Links health record to specific student. When student is deleted, all their health records are removed.
     * @foreignKey references students(id) ON DELETE CASCADE
     * @security Health records are student-specific PHI and removed when student record is deleted
     * @compliance HIPAA - Protected Health Information tied to patient (student) lifecycle
     * @compliance FERPA - Educational health records removed with student record
     */
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'students',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      comment: 'Foreign key to students table - health record owner',
    },
    recordType: {
      type: DataTypes.ENUM(...Object.values(HealthRecordType)),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    recordDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    providerNpi: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    facility: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    facilityNpi: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    diagnosis: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    diagnosisCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    treatment: {
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
    followUpCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    attachments: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    isConfidential: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Soft delete flag - whether health record is currently active',
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Soft delete timestamp - when health record was deactivated',
    },
    deletedBy: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      comment: 'User who deactivated this health record (for audit trail)',
    },
    ...AuditableModel.getAuditableFields(),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'health_records',
    timestamps: true,
    indexes: [
      { fields: ['studentId', 'recordDate'] },
      { fields: ['recordType', 'recordDate'] },
      { fields: ['createdBy'] },
      { fields: ['followUpRequired', 'followUpDate'] },
      { fields: ['isActive'] },
      { fields: ['isActive', 'recordDate'] },
      { fields: ['deletedAt'] },
      { fields: ['deletedBy'] },
    ],
  }
);

AuditableModel.setupAuditHooks(HealthRecord, 'HealthRecord');
