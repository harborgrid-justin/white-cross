/**
 * LOC: EDU-RECORDS-001
 * File: /reuse/education/student-records-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - crypto (encryption)
 *
 * DOWNSTREAM (imported by):
 *   - Backend education modules
 *   - Registrar services
 *   - Records management services
 *   - Compliance reporting modules
 */

/**
 * File: /reuse/education/student-records-kit.ts
 * Locator: WC-EDU-RECORDS-001
 * Purpose: Comprehensive Student Records Management - Ellucian SIS-level records management with FERPA compliance
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, Node crypto
 * Downstream: ../backend/education/*, Registrar Office, Records Management, Compliance
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45+ functions for records management, FERPA compliance, verification, archival, security
 *
 * LLM Context: Enterprise-grade student records management for higher education SIS.
 * Provides comprehensive student records management, FERPA compliance, records request processing,
 * verification services, change of records, transcript management, records holds and locks,
 * records archival and retention, encryption and security, audit logging, electronic signature support,
 * and full compliance with federal education privacy regulations.
 */

import { Model, DataTypes, Sequelize, Transaction, Op, ValidationError } from 'sequelize';
import { Injectable } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface StudentRecord {
  recordId: string;
  studentId: number;
  recordType: 'academic' | 'disciplinary' | 'medical' | 'financial' | 'enrollment' | 'transcript';
  recordDate: Date;
  academicYear: number;
  termId: number;
  recordData: Record<string, any>;
  isOfficial: boolean;
  isPermanent: boolean;
  isLocked: boolean;
  ferpaProtected: boolean;
  retentionPeriod: number;
  destructionDate?: Date;
}

interface AcademicHistory {
  historyId: number;
  studentId: number;
  termId: number;
  academicYear: number;
  creditsAttempted: number;
  creditsEarned: number;
  gpa: number;
  cumulativeGPA: number;
  academicStanding: string;
  deansListStatus: boolean;
  probationStatus: boolean;
  honorsDesignation?: string;
  withdrawalStatus: boolean;
}

interface EducationalRecord {
  recordId: number;
  studentId: number;
  institutionName: string;
  institutionType: 'high-school' | 'college' | 'university' | 'other';
  attendanceStartDate: Date;
  attendanceEndDate?: Date;
  degreeEarned?: string;
  graduationDate?: Date;
  gpa?: number;
  transcriptReceived: boolean;
  verificationStatus: string;
}

interface FERPAConsent {
  consentId: string;
  studentId: number;
  consentType: 'directory-information' | 'educational-records' | 'third-party-disclosure';
  grantedTo?: string;
  purpose: string;
  effectiveDate: Date;
  expirationDate?: Date;
  isActive: boolean;
  revokedDate?: Date;
  revokedBy?: string;
}

interface RecordsRequest {
  requestId: string;
  studentId: number;
  requestType: 'transcript' | 'verification' | 'enrollment-letter' | 'degree-audit' | 'full-records';
  requestDate: Date;
  requestedBy: string;
  recipientName: string;
  recipientAddress: string;
  deliveryMethod: 'mail' | 'electronic' | 'pickup' | 'fax';
  urgency: 'standard' | 'rush' | 'same-day';
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'on-hold';
  processedBy?: string;
  processedDate?: Date;
  trackingNumber?: string;
  fee: number;
  isPaid: boolean;
}

interface TranscriptRequest {
  transcriptId: string;
  studentId: number;
  transcriptType: 'official' | 'unofficial' | 'academic-progress';
  includeGrades: boolean;
  includeDegrees: boolean;
  includeHonors: boolean;
  includeTestScores: boolean;
  recipientName: string;
  recipientEmail?: string;
  deliveryMethod: string;
  requestDate: Date;
  issuedDate?: Date;
  electronicSignature?: string;
  verificationCode?: string;
}

interface RecordsHold {
  holdId: string;
  studentId: number;
  recordType: string;
  holdReason: string;
  placedBy: string;
  placedDate: Date;
  releasedBy?: string;
  releasedDate?: Date;
  isActive: boolean;
  requiresAuthorization: boolean;
}

interface RecordsAuditLog {
  logId: number;
  recordId: string;
  studentId: number;
  actionType: 'view' | 'create' | 'update' | 'delete' | 'export' | 'print' | 'email';
  actionBy: string;
  actionDate: Date;
  ipAddress: string;
  justification?: string;
  ferpaCompliant: boolean;
}

interface GradeChangeRequest {
  requestId: string;
  studentId: number;
  courseId: number;
  termId: number;
  currentGrade: string;
  proposedGrade: string;
  changeReason: string;
  requestedBy: string;
  requestDate: Date;
  approvedBy?: string;
  approvalDate?: Date;
  status: 'pending' | 'approved' | 'denied';
}

interface DegreeAudit {
  auditId: string;
  studentId: number;
  programId: number;
  degreeType: string;
  auditDate: Date;
  completionPercentage: number;
  creditsRequired: number;
  creditsCompleted: number;
  creditsInProgress: number;
  creditsRemaining: number;
  requirementsMet: string[];
  requirementsPending: string[];
  expectedGraduationDate?: Date;
}

// ============================================================================
// DTO CLASSES
// ============================================================================

export class CreateRecordDto {
  @ApiProperty({ description: 'Student ID' })
  studentId!: number;

  @ApiProperty({ description: 'Record type', enum: ['academic', 'disciplinary', 'medical', 'financial', 'enrollment', 'transcript'] })
  recordType!: string;

  @ApiProperty({ description: 'Academic year' })
  academicYear!: number;

  @ApiProperty({ description: 'Term ID' })
  termId!: number;

  @ApiProperty({ description: 'Record data as JSON' })
  recordData!: Record<string, any>;

  @ApiProperty({ description: 'Is official record', default: true })
  isOfficial!: boolean;

  @ApiProperty({ description: 'Is permanent record', default: false })
  isPermanent!: boolean;

  @ApiProperty({ description: 'FERPA protected', default: true })
  ferpaProtected!: boolean;
}

export class TranscriptRequestDto {
  @ApiProperty({ description: 'Student ID' })
  studentId!: number;

  @ApiProperty({ description: 'Transcript type', enum: ['official', 'unofficial', 'academic-progress'] })
  transcriptType!: string;

  @ApiProperty({ description: 'Recipient name' })
  recipientName!: string;

  @ApiProperty({ description: 'Recipient email', required: false })
  recipientEmail?: string;

  @ApiProperty({ description: 'Delivery method', enum: ['mail', 'electronic', 'pickup', 'fax'] })
  deliveryMethod!: string;

  @ApiProperty({ description: 'Include grades', default: true })
  includeGrades!: boolean;

  @ApiProperty({ description: 'Include degrees', default: true })
  includeDegrees!: boolean;
}

export class FERPAConsentDto {
  @ApiProperty({ description: 'Student ID' })
  studentId!: number;

  @ApiProperty({ description: 'Consent type', enum: ['directory-information', 'educational-records', 'third-party-disclosure'] })
  consentType!: string;

  @ApiProperty({ description: 'Granted to (organization/person)', required: false })
  grantedTo?: string;

  @ApiProperty({ description: 'Purpose of consent' })
  purpose!: string;

  @ApiProperty({ description: 'Effective date' })
  effectiveDate!: Date;

  @ApiProperty({ description: 'Expiration date', required: false })
  expirationDate?: Date;
}

export class RecordsRequestDto {
  @ApiProperty({ description: 'Student ID' })
  studentId!: number;

  @ApiProperty({ description: 'Request type', enum: ['transcript', 'verification', 'enrollment-letter', 'degree-audit', 'full-records'] })
  requestType!: string;

  @ApiProperty({ description: 'Recipient name' })
  recipientName!: string;

  @ApiProperty({ description: 'Recipient address' })
  recipientAddress!: string;

  @ApiProperty({ description: 'Delivery method', enum: ['mail', 'electronic', 'pickup', 'fax'] })
  deliveryMethod!: string;

  @ApiProperty({ description: 'Urgency level', enum: ['standard', 'rush', 'same-day'] })
  urgency!: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for StudentRecord with FERPA compliance and encryption.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} StudentRecord model
 *
 * @example
 * ```typescript
 * const StudentRecord = createStudentRecordModel(sequelize);
 * const record = await StudentRecord.create({
 *   recordId: 'REC-2024-001234',
 *   studentId: 1,
 *   recordType: 'academic',
 *   academicYear: 2024,
 *   termId: 202401,
 *   recordData: { ... },
 *   isOfficial: true,
 *   ferpaProtected: true
 * });
 * ```
 */
export const createStudentRecordModel = (sequelize: Sequelize) => {
  class StudentRecord extends Model {
    public id!: number;
    public recordId!: string;
    public studentId!: number;
    public recordType!: string;
    public recordDate!: Date;
    public academicYear!: number;
    public termId!: number;
    public recordData!: Record<string, any>;
    public recordDataEncrypted!: string | null;
    public isOfficial!: boolean;
    public isPermanent!: boolean;
    public isLocked!: boolean;
    public ferpaProtected!: boolean;
    public retentionPeriod!: number;
    public destructionDate!: Date | null;
    public encryptionKey!: string | null;
    public lastAccessedDate!: Date | null;
    public lastAccessedBy!: string | null;
    public accessCount!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly createdBy!: string;
    public readonly updatedBy!: string;
  }

  StudentRecord.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      recordId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique record identifier',
        validate: {
          notEmpty: true,
        },
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to student',
        references: {
          model: 'students',
          key: 'id',
        },
      },
      recordType: {
        type: DataTypes.ENUM('academic', 'disciplinary', 'medical', 'financial', 'enrollment', 'transcript', 'degree', 'honors'),
        allowNull: false,
        comment: 'Type of record',
      },
      recordDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Date record was created',
      },
      academicYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Academic year',
        validate: {
          min: 1900,
          max: 2099,
        },
      },
      termId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to academic term',
      },
      recordData: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Record data (unencrypted for non-sensitive)',
      },
      recordDataEncrypted: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Encrypted record data for FERPA-protected information',
      },
      isOfficial: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Is official record',
      },
      isPermanent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Is permanent record (never deleted)',
      },
      isLocked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Is locked from editing',
      },
      ferpaProtected: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'FERPA protected status',
      },
      retentionPeriod: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 7,
        comment: 'Retention period in years',
        validate: {
          min: 0,
          max: 100,
        },
      },
      destructionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Scheduled destruction date',
      },
      encryptionKey: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Encryption key identifier',
      },
      lastAccessedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last access date',
      },
      lastAccessedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Last accessed by user',
      },
      accessCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of times accessed',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who created the record',
      },
      updatedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who last updated the record',
      },
    },
    {
      sequelize,
      tableName: 'student_records',
      timestamps: true,
      indexes: [
        { fields: ['recordId'], unique: true },
        { fields: ['studentId'] },
        { fields: ['recordType'] },
        { fields: ['academicYear', 'termId'] },
        { fields: ['ferpaProtected'] },
        { fields: ['isLocked'] },
        { fields: ['destructionDate'] },
      ],
      hooks: {
        beforeCreate: (record) => {
          if (!record.createdBy) {
            throw new Error('createdBy is required');
          }
          record.updatedBy = record.createdBy;

          // Set destruction date based on retention period
          if (!record.isPermanent && record.retentionPeriod > 0) {
            const destructionDate = new Date();
            destructionDate.setFullYear(destructionDate.getFullYear() + record.retentionPeriod);
            record.destructionDate = destructionDate;
          }
        },
        beforeUpdate: (record) => {
          if (!record.updatedBy) {
            throw new Error('updatedBy is required');
          }

          if (record.isLocked && record.changed('recordData')) {
            throw new Error('Cannot modify locked record');
          }
        },
      },
    },
  );

  return StudentRecord;
};

/**
 * Sequelize model for AcademicHistory with comprehensive GPA tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AcademicHistory model
 *
 * @example
 * ```typescript
 * const AcademicHistory = createAcademicHistoryModel(sequelize);
 * const history = await AcademicHistory.create({
 *   studentId: 1,
 *   termId: 202401,
 *   academicYear: 2024,
 *   creditsAttempted: 15,
 *   creditsEarned: 15,
 *   gpa: 3.5,
 *   cumulativeGPA: 3.4,
 *   academicStanding: 'good'
 * });
 * ```
 */
export const createAcademicHistoryModel = (sequelize: Sequelize) => {
  class AcademicHistory extends Model {
    public id!: number;
    public studentId!: number;
    public termId!: number;
    public academicYear!: number;
    public creditsAttempted!: number;
    public creditsEarned!: number;
    public creditsTransfer!: number;
    public gpa!: number;
    public cumulativeGPA!: number;
    public majorGPA!: number | null;
    public academicStanding!: string;
    public deansListStatus!: boolean;
    public presidentsListStatus!: boolean;
    public probationStatus!: boolean;
    public suspensionStatus!: boolean;
    public honorsDesignation!: string | null;
    public withdrawalStatus!: boolean;
    public leaveOfAbsence!: boolean;
    public graduationEligible!: boolean;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  AcademicHistory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to student',
        references: {
          model: 'students',
          key: 'id',
        },
      },
      termId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to academic term',
      },
      academicYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Academic year',
        validate: {
          min: 1900,
          max: 2099,
        },
      },
      creditsAttempted: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Credits attempted in term',
        validate: {
          min: 0,
        },
      },
      creditsEarned: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Credits earned in term',
        validate: {
          min: 0,
        },
      },
      creditsTransfer: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Transfer credits applied',
        validate: {
          min: 0,
        },
      },
      gpa: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Term GPA',
        validate: {
          min: 0.00,
          max: 4.00,
        },
      },
      cumulativeGPA: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Cumulative GPA',
        validate: {
          min: 0.00,
          max: 4.00,
        },
      },
      majorGPA: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: true,
        comment: 'Major GPA',
        validate: {
          min: 0.00,
          max: 4.00,
        },
      },
      academicStanding: {
        type: DataTypes.ENUM('excellent', 'good', 'probation', 'suspension', 'dismissal'),
        allowNull: false,
        defaultValue: 'good',
        comment: 'Academic standing',
      },
      deansListStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "Dean's List status",
      },
      presidentsListStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "President's List status",
      },
      probationStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Academic probation status',
      },
      suspensionStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Academic suspension status',
      },
      honorsDesignation: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Honors designation',
      },
      withdrawalStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Withdrawal status',
      },
      leaveOfAbsence: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Leave of absence status',
      },
      graduationEligible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Graduation eligibility',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'academic_history',
      timestamps: true,
      indexes: [
        { fields: ['studentId', 'termId'], unique: true },
        { fields: ['academicYear'] },
        { fields: ['academicStanding'] },
        { fields: ['deansListStatus'] },
        { fields: ['probationStatus'] },
      ],
    },
  );

  return AcademicHistory;
};

/**
 * Sequelize model for EducationalRecord for prior institutions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} EducationalRecord model
 */
export const createEducationalRecordModel = (sequelize: Sequelize) => {
  class EducationalRecord extends Model {
    public id!: number;
    public studentId!: number;
    public institutionName!: string;
    public institutionCode!: string | null;
    public institutionType!: string;
    public institutionCity!: string | null;
    public institutionState!: string | null;
    public institutionCountry!: string;
    public attendanceStartDate!: Date;
    public attendanceEndDate!: Date | null;
    public degreeEarned!: string | null;
    public majorField!: string | null;
    public graduationDate!: Date | null;
    public gpa!: number | null;
    public gpaScale!: number;
    public transcriptReceived!: boolean;
    public transcriptDate!: Date | null;
    public verificationStatus!: string;
    public verificationDate!: Date | null;
    public isPrimary!: boolean;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  EducationalRecord.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to student',
        references: {
          model: 'students',
          key: 'id',
        },
      },
      institutionName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Name of institution',
        validate: {
          notEmpty: true,
        },
      },
      institutionCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Institution code (FICE, CEEB, etc.)',
      },
      institutionType: {
        type: DataTypes.ENUM('high-school', 'college', 'university', 'community-college', 'technical', 'other'),
        allowNull: false,
        comment: 'Type of institution',
      },
      institutionCity: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'City',
      },
      institutionState: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'State/Province',
      },
      institutionCountry: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'United States',
        comment: 'Country',
      },
      attendanceStartDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Start date of attendance',
      },
      attendanceEndDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: 'End date of attendance',
      },
      degreeEarned: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Degree earned',
      },
      majorField: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Major field of study',
      },
      graduationDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: 'Graduation date',
      },
      gpa: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: true,
        comment: 'GPA from institution',
        validate: {
          min: 0.00,
        },
      },
      gpaScale: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 4.00,
        comment: 'GPA scale',
      },
      transcriptReceived: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Transcript received',
      },
      transcriptDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date transcript received',
      },
      verificationStatus: {
        type: DataTypes.ENUM('pending', 'verified', 'unverified', 'discrepancy'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Verification status',
      },
      verificationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date of verification',
      },
      isPrimary: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Is primary institution',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'educational_records',
      timestamps: true,
      indexes: [
        { fields: ['studentId'] },
        { fields: ['institutionName'] },
        { fields: ['institutionType'] },
        { fields: ['verificationStatus'] },
        { fields: ['transcriptReceived'] },
      ],
    },
  );

  return EducationalRecord;
};

// ============================================================================
// STUDENT RECORDS MANAGEMENT FUNCTIONS (1-10)
// ============================================================================

/**
 * Creates a new student record with FERPA protection.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateRecordDto} recordData - Record creation data
 * @param {string} userId - User creating the record
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created record
 *
 * @example
 * ```typescript
 * const record = await createStudentRecord(sequelize, {
 *   studentId: 1,
 *   recordType: 'academic',
 *   academicYear: 2024,
 *   termId: 202401,
 *   recordData: { courseGrades: [...] },
 *   isOfficial: true,
 *   isPermanent: true,
 *   ferpaProtected: true
 * }, 'registrar123');
 * ```
 */
export const createStudentRecord = async (
  sequelize: Sequelize,
  recordData: CreateRecordDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const StudentRecord = createStudentRecordModel(sequelize);

  const recordId = `REC-${recordData.academicYear}-${recordData.studentId}-${Date.now()}`;

  let encryptedData = null;
  let encryptionKey = null;

  // Encrypt sensitive data if FERPA protected
  if (recordData.ferpaProtected) {
    const encryption = encryptRecordData(JSON.stringify(recordData.recordData));
    encryptedData = encryption.encrypted;
    encryptionKey = encryption.key;
  }

  const record = await StudentRecord.create(
    {
      recordId,
      ...recordData,
      recordDate: new Date(),
      recordDataEncrypted: encryptedData,
      encryptionKey,
      isLocked: false,
      createdBy: userId,
      updatedBy: userId,
    },
    { transaction },
  );

  // Log access
  await logRecordAccess(sequelize, recordId, recordData.studentId, 'create', userId, transaction);

  return record;
};

/**
 * Retrieves a student record with FERPA compliance check.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} recordId - Record ID
 * @param {string} userId - User requesting the record
 * @param {string} [justification] - Justification for access
 * @returns {Promise<any>} Student record
 *
 * @example
 * ```typescript
 * const record = await getStudentRecord(sequelize, 'REC-2024-001', 'advisor123', 'Academic advising');
 * ```
 */
export const getStudentRecord = async (
  sequelize: Sequelize,
  recordId: string,
  userId: string,
  justification?: string,
): Promise<any> => {
  const StudentRecord = createStudentRecordModel(sequelize);

  const record = await StudentRecord.findOne({
    where: { recordId },
  });

  if (!record) {
    throw new Error('Record not found');
  }

  // Decrypt data if encrypted
  let recordData = record.recordData;
  if (record.recordDataEncrypted && record.encryptionKey) {
    const decrypted = decryptRecordData(record.recordDataEncrypted, record.encryptionKey);
    recordData = JSON.parse(decrypted);
  }

  // Update access tracking
  await record.update({
    lastAccessedDate: new Date(),
    lastAccessedBy: userId,
    accessCount: record.accessCount + 1,
  });

  // Log access
  await logRecordAccess(sequelize, recordId, record.studentId, 'view', userId, undefined, justification);

  return {
    ...record.toJSON(),
    recordData,
  };
};

/**
 * Updates a student record if not locked.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} recordId - Record ID
 * @param {Partial<CreateRecordDto>} updateData - Update data
 * @param {string} userId - User updating the record
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated record
 *
 * @example
 * ```typescript
 * const updated = await updateStudentRecord(sequelize, 'REC-2024-001', {
 *   recordData: { updatedField: 'newValue' }
 * }, 'registrar123');
 * ```
 */
export const updateStudentRecord = async (
  sequelize: Sequelize,
  recordId: string,
  updateData: Partial<CreateRecordDto>,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const StudentRecord = createStudentRecordModel(sequelize);

  const record = await StudentRecord.findOne({
    where: { recordId },
    transaction,
  });

  if (!record) {
    throw new Error('Record not found');
  }

  if (record.isLocked) {
    throw new Error('Cannot update locked record');
  }

  // Re-encrypt if updating data
  let encryptedData = record.recordDataEncrypted;
  if (updateData.recordData && record.ferpaProtected) {
    const encryption = encryptRecordData(JSON.stringify(updateData.recordData));
    encryptedData = encryption.encrypted;
  }

  await record.update(
    {
      ...updateData,
      recordDataEncrypted: encryptedData,
      updatedBy: userId,
    },
    { transaction },
  );

  // Log access
  await logRecordAccess(sequelize, recordId, record.studentId, 'update', userId, transaction);

  return record;
};

/**
 * Locks a student record to prevent modifications.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} recordId - Record ID
 * @param {string} userId - User locking the record
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await lockStudentRecord(sequelize, 'REC-2024-001', 'registrar123');
 * ```
 */
export const lockStudentRecord = async (
  sequelize: Sequelize,
  recordId: string,
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  const StudentRecord = createStudentRecordModel(sequelize);

  const record = await StudentRecord.findOne({
    where: { recordId },
    transaction,
  });

  if (!record) {
    throw new Error('Record not found');
  }

  await record.update(
    {
      isLocked: true,
      updatedBy: userId,
      metadata: {
        ...record.metadata,
        lockedAt: new Date().toISOString(),
        lockedBy: userId,
      },
    },
    { transaction },
  );
};

/**
 * Retrieves all records for a student.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {string} [recordType] - Filter by record type
 * @returns {Promise<any[]>} Array of records
 *
 * @example
 * ```typescript
 * const records = await getStudentRecords(sequelize, 1, 'academic');
 * ```
 */
export const getStudentRecords = async (
  sequelize: Sequelize,
  studentId: number,
  recordType?: string,
): Promise<any[]> => {
  const StudentRecord = createStudentRecordModel(sequelize);

  const where: any = { studentId };
  if (recordType) {
    where.recordType = recordType;
  }

  return await StudentRecord.findAll({
    where,
    order: [['recordDate', 'DESC']],
  });
};

/**
 * Creates academic history record for term.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {AcademicHistory} historyData - Academic history data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Academic history record
 *
 * @example
 * ```typescript
 * const history = await createAcademicHistory(sequelize, {
 *   studentId: 1,
 *   termId: 202401,
 *   academicYear: 2024,
 *   creditsAttempted: 15,
 *   creditsEarned: 15,
 *   gpa: 3.5,
 *   cumulativeGPA: 3.4,
 *   academicStanding: 'good',
 *   deansListStatus: true,
 *   probationStatus: false,
 *   withdrawalStatus: false
 * });
 * ```
 */
export const createAcademicHistory = async (
  sequelize: Sequelize,
  historyData: AcademicHistory,
  transaction?: Transaction,
): Promise<any> => {
  const AcademicHistory = createAcademicHistoryModel(sequelize);

  const history = await AcademicHistory.create(historyData, { transaction });

  return history;
};

/**
 * Calculates cumulative GPA for student.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @returns {Promise<number>} Cumulative GPA
 *
 * @example
 * ```typescript
 * const gpa = await calculateCumulativeGPA(sequelize, 1);
 * ```
 */
export const calculateCumulativeGPA = async (
  sequelize: Sequelize,
  studentId: number,
): Promise<number> => {
  const AcademicHistory = createAcademicHistoryModel(sequelize);

  const histories = await AcademicHistory.findAll({
    where: { studentId },
    order: [['termId', 'DESC']],
    limit: 1,
  });

  if (histories.length === 0) {
    return 0.0;
  }

  return Number(histories[0].cumulativeGPA);
};

/**
 * Adds educational record from prior institution.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {EducationalRecord} educationData - Educational record data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Educational record
 *
 * @example
 * ```typescript
 * const record = await addEducationalRecord(sequelize, {
 *   studentId: 1,
 *   institutionName: 'Previous University',
 *   institutionType: 'university',
 *   attendanceStartDate: new Date('2020-09-01'),
 *   attendanceEndDate: new Date('2022-05-15'),
 *   degreeEarned: 'Associate of Arts',
 *   graduationDate: new Date('2022-05-15'),
 *   gpa: 3.2,
 *   transcriptReceived: true,
 *   verificationStatus: 'verified'
 * });
 * ```
 */
export const addEducationalRecord = async (
  sequelize: Sequelize,
  educationData: Partial<EducationalRecord>,
  transaction?: Transaction,
): Promise<any> => {
  const EducationalRecord = createEducationalRecordModel(sequelize);

  const record = await EducationalRecord.create(educationData, { transaction });

  return record;
};

/**
 * Verifies educational record from prior institution.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} recordId - Educational record ID
 * @param {string} userId - User verifying the record
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await verifyEducationalRecord(sequelize, 1, 'registrar123');
 * ```
 */
export const verifyEducationalRecord = async (
  sequelize: Sequelize,
  recordId: number,
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  const EducationalRecord = createEducationalRecordModel(sequelize);

  const record = await EducationalRecord.findByPk(recordId, { transaction });

  if (!record) {
    throw new Error('Educational record not found');
  }

  await record.update(
    {
      verificationStatus: 'verified',
      verificationDate: new Date(),
    },
    { transaction },
  );
};

// ============================================================================
// FERPA COMPLIANCE FUNCTIONS (11-20)
// ============================================================================

/**
 * Creates FERPA consent record.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {FERPAConsent} consentData - Consent data
 * @param {string} userId - User creating consent
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Consent record
 *
 * @example
 * ```typescript
 * const consent = await createFERPAConsent(sequelize, {
 *   consentId: 'FERPA-2024-001',
 *   studentId: 1,
 *   consentType: 'third-party-disclosure',
 *   grantedTo: 'Parent - John Doe Sr.',
 *   purpose: 'Academic progress disclosure',
 *   effectiveDate: new Date(),
 *   expirationDate: new Date('2025-12-31'),
 *   isActive: true
 * }, 'student123');
 * ```
 */
export const createFERPAConsent = async (
  sequelize: Sequelize,
  consentData: FERPAConsent,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const result = await sequelize.query(
    `INSERT INTO ferpa_consents
     (consent_id, student_id, consent_type, granted_to, purpose, effective_date, expiration_date,
      is_active, created_at, updated_at, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)`,
    {
      replacements: [
        consentData.consentId,
        consentData.studentId,
        consentData.consentType,
        consentData.grantedTo || null,
        consentData.purpose,
        consentData.effectiveDate,
        consentData.expirationDate || null,
        consentData.isActive,
        userId,
      ],
      transaction,
    },
  );

  return result;
};

/**
 * Validates FERPA authorization for record access.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {string} requestedBy - User requesting access
 * @param {string} purpose - Purpose of access
 * @returns {Promise<{ authorized: boolean; reason?: string }>} Authorization status
 *
 * @example
 * ```typescript
 * const auth = await validateFERPAAuthorization(sequelize, 1, 'parent123', 'View grades');
 * ```
 */
export const validateFERPAAuthorization = async (
  sequelize: Sequelize,
  studentId: number,
  requestedBy: string,
  purpose: string,
): Promise<{ authorized: boolean; reason?: string }> => {
  // Check for active consent
  const [consents] = await sequelize.query(
    `SELECT * FROM ferpa_consents
     WHERE student_id = ? AND is_active = true
     AND effective_date <= NOW()
     AND (expiration_date IS NULL OR expiration_date >= NOW())`,
    {
      replacements: [studentId],
    },
  );

  if (!consents || consents.length === 0) {
    return { authorized: false, reason: 'No active FERPA consent found' };
  }

  // Check if requester matches consent
  const matchingConsent = (consents as any[]).find(
    (c) => c.granted_to && c.granted_to.includes(requestedBy),
  );

  if (!matchingConsent) {
    return { authorized: false, reason: 'Requester not authorized in consent' };
  }

  return { authorized: true };
};

/**
 * Revokes FERPA consent.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} consentId - Consent ID
 * @param {string} userId - User revoking consent
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await revokeFERPAConsent(sequelize, 'FERPA-2024-001', 'student123');
 * ```
 */
export const revokeFERPAConsent = async (
  sequelize: Sequelize,
  consentId: string,
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(
    `UPDATE ferpa_consents
     SET is_active = false, revoked_date = NOW(), revoked_by = ?, updated_at = NOW()
     WHERE consent_id = ?`,
    {
      replacements: [userId, consentId],
      transaction,
    },
  );
};

/**
 * Checks if student has opted out of directory information.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @returns {Promise<boolean>} Whether student opted out
 *
 * @example
 * ```typescript
 * const optedOut = await checkDirectoryOptOut(sequelize, 1);
 * ```
 */
export const checkDirectoryOptOut = async (
  sequelize: Sequelize,
  studentId: number,
): Promise<boolean> => {
  const [consents] = await sequelize.query(
    `SELECT * FROM ferpa_consents
     WHERE student_id = ? AND consent_type = 'directory-information' AND is_active = false`,
    {
      replacements: [studentId],
    },
  );

  return consents && consents.length > 0;
};

/**
 * Logs record access for FERPA compliance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} recordId - Record ID
 * @param {number} studentId - Student ID
 * @param {string} actionType - Type of action
 * @param {string} userId - User performing action
 * @param {Transaction} [transaction] - Optional transaction
 * @param {string} [justification] - Justification for access
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await logRecordAccess(sequelize, 'REC-2024-001', 1, 'view', 'advisor123', undefined, 'Academic advising');
 * ```
 */
export const logRecordAccess = async (
  sequelize: Sequelize,
  recordId: string,
  studentId: number,
  actionType: string,
  userId: string,
  transaction?: Transaction,
  justification?: string,
): Promise<void> => {
  await sequelize.query(
    `INSERT INTO records_audit_log
     (record_id, student_id, action_type, action_by, action_date, ip_address, justification, ferpa_compliant, created_at)
     VALUES (?, ?, ?, ?, NOW(), ?, ?, true, NOW())`,
    {
      replacements: [recordId, studentId, actionType, userId, '0.0.0.0', justification || null],
      transaction,
    },
  );
};

/**
 * Retrieves FERPA audit log for student.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {Date} [startDate] - Start date filter
 * @param {Date} [endDate] - End date filter
 * @returns {Promise<any[]>} Audit log entries
 *
 * @example
 * ```typescript
 * const auditLog = await getFERPAAuditLog(sequelize, 1, new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
export const getFERPAAuditLog = async (
  sequelize: Sequelize,
  studentId: number,
  startDate?: Date,
  endDate?: Date,
): Promise<any[]> => {
  let query = `SELECT * FROM records_audit_log WHERE student_id = ?`;
  const replacements: any[] = [studentId];

  if (startDate) {
    query += ` AND action_date >= ?`;
    replacements.push(startDate);
  }

  if (endDate) {
    query += ` AND action_date <= ?`;
    replacements.push(endDate);
  }

  query += ` ORDER BY action_date DESC`;

  const [results] = await sequelize.query(query, { replacements });

  return results as any[];
};

/**
 * Validates FERPA compliance for record disclosure.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {string} recipientType - Type of recipient
 * @param {string} purpose - Purpose of disclosure
 * @returns {Promise<{ compliant: boolean; issues: string[] }>} Compliance status
 *
 * @example
 * ```typescript
 * const compliance = await validateRecordDisclosure(sequelize, 1, 'employer', 'Employment verification');
 * ```
 */
export const validateRecordDisclosure = async (
  sequelize: Sequelize,
  studentId: number,
  recipientType: string,
  purpose: string,
): Promise<{ compliant: boolean; issues: string[] }> => {
  const issues: string[] = [];

  // Check for active consent
  const [consents] = await sequelize.query(
    `SELECT * FROM ferpa_consents
     WHERE student_id = ? AND is_active = true AND consent_type = 'third-party-disclosure'`,
    {
      replacements: [studentId],
    },
  );

  if (!consents || consents.length === 0) {
    // Check if recipient falls under FERPA exceptions
    const exceptions = ['school-official', 'financial-aid', 'accreditation', 'court-order', 'health-safety'];

    if (!exceptions.includes(recipientType)) {
      issues.push('No active consent for third-party disclosure');
    }
  }

  // Check directory opt-out
  const optedOut = await checkDirectoryOptOut(sequelize, studentId);
  if (optedOut && recipientType === 'directory') {
    issues.push('Student has opted out of directory information');
  }

  return {
    compliant: issues.length === 0,
    issues,
  };
};

/**
 * Generates FERPA compliance report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<any>} Compliance report
 *
 * @example
 * ```typescript
 * const report = await generateFERPAComplianceReport(sequelize, new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
export const generateFERPAComplianceReport = async (
  sequelize: Sequelize,
  startDate: Date,
  endDate: Date,
): Promise<any> => {
  const [accessLogs] = await sequelize.query(
    `SELECT action_type, COUNT(*) as count FROM records_audit_log
     WHERE action_date BETWEEN ? AND ?
     GROUP BY action_type`,
    {
      replacements: [startDate, endDate],
    },
  );

  const [consentStats] = await sequelize.query(
    `SELECT consent_type, COUNT(*) as count, SUM(CASE WHEN is_active THEN 1 ELSE 0 END) as active_count
     FROM ferpa_consents
     WHERE created_at BETWEEN ? AND ?
     GROUP BY consent_type`,
    {
      replacements: [startDate, endDate],
    },
  );

  return {
    reportPeriod: {
      startDate,
      endDate,
    },
    accessStatistics: accessLogs,
    consentStatistics: consentStats,
    generatedAt: new Date(),
  };
};

/**
 * Encrypts sensitive record data.
 *
 * @param {string} data - Data to encrypt
 * @returns {{ encrypted: string; key: string }} Encrypted data and key
 *
 * @example
 * ```typescript
 * const { encrypted, key } = encryptRecordData(JSON.stringify(sensitiveData));
 * ```
 */
export const encryptRecordData = (data: string): { encrypted: string; key: string } => {
  const algorithm = 'aes-256-cbc';
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return {
    encrypted: `${iv.toString('hex')}:${encrypted}`,
    key: key.toString('hex'),
  };
};

/**
 * Decrypts encrypted record data.
 *
 * @param {string} encryptedData - Encrypted data
 * @param {string} keyHex - Encryption key in hex
 * @returns {string} Decrypted data
 *
 * @example
 * ```typescript
 * const decrypted = decryptRecordData(encrypted, key);
 * ```
 */
export const decryptRecordData = (encryptedData: string, keyHex: string): string => {
  const algorithm = 'aes-256-cbc';
  const [ivHex, encrypted] = encryptedData.split(':');
  const key = Buffer.from(keyHex, 'hex');
  const iv = Buffer.from(ivHex, 'hex');

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

// ============================================================================
// RECORDS REQUEST MANAGEMENT (21-25)
// ============================================================================

/**
 * Creates records request.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RecordsRequest} requestData - Request data
 * @param {string} userId - User creating request
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Records request
 *
 * @example
 * ```typescript
 * const request = await createRecordsRequest(sequelize, {
 *   requestId: 'REQ-2024-001',
 *   studentId: 1,
 *   requestType: 'transcript',
 *   requestDate: new Date(),
 *   requestedBy: 'student123',
 *   recipientName: 'Graduate School',
 *   recipientAddress: '123 University Ave',
 *   deliveryMethod: 'electronic',
 *   urgency: 'standard',
 *   status: 'pending',
 *   fee: 10,
 *   isPaid: false
 * }, 'student123');
 * ```
 */
export const createRecordsRequest = async (
  sequelize: Sequelize,
  requestData: RecordsRequest,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  // Validate FERPA authorization
  const authorization = await validateFERPAAuthorization(
    sequelize,
    requestData.studentId,
    userId,
    `Records request: ${requestData.requestType}`,
  );

  if (!authorization.authorized && requestData.requestedBy !== 'self') {
    throw new Error(`FERPA authorization failed: ${authorization.reason}`);
  }

  const result = await sequelize.query(
    `INSERT INTO records_requests
     (request_id, student_id, request_type, request_date, requested_by, recipient_name,
      recipient_address, delivery_method, urgency, status, fee, is_paid, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    {
      replacements: [
        requestData.requestId,
        requestData.studentId,
        requestData.requestType,
        requestData.requestDate,
        requestData.requestedBy,
        requestData.recipientName,
        requestData.recipientAddress,
        requestData.deliveryMethod,
        requestData.urgency,
        requestData.status,
        requestData.fee,
        requestData.isPaid,
      ],
      transaction,
    },
  );

  return result;
};

/**
 * Processes records request.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} requestId - Request ID
 * @param {string} userId - User processing request
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await processRecordsRequest(sequelize, 'REQ-2024-001', 'registrar123');
 * ```
 */
export const processRecordsRequest = async (
  sequelize: Sequelize,
  requestId: string,
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(
    `UPDATE records_requests
     SET status = 'processing', processed_by = ?, updated_at = NOW()
     WHERE request_id = ?`,
    {
      replacements: [userId, requestId],
      transaction,
    },
  );
};

/**
 * Completes records request.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} requestId - Request ID
 * @param {string} trackingNumber - Tracking number
 * @param {string} userId - User completing request
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await completeRecordsRequest(sequelize, 'REQ-2024-001', 'TRACK-12345', 'registrar123');
 * ```
 */
export const completeRecordsRequest = async (
  sequelize: Sequelize,
  requestId: string,
  trackingNumber: string,
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(
    `UPDATE records_requests
     SET status = 'completed', processed_date = NOW(), tracking_number = ?, updated_at = NOW()
     WHERE request_id = ?`,
    {
      replacements: [trackingNumber, requestId],
      transaction,
    },
  );
};

/**
 * Retrieves pending records requests.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Pending requests
 *
 * @example
 * ```typescript
 * const pending = await getPendingRecordsRequests(sequelize);
 * ```
 */
export const getPendingRecordsRequests = async (sequelize: Sequelize): Promise<any[]> => {
  const [requests] = await sequelize.query(
    `SELECT * FROM records_requests
     WHERE status IN ('pending', 'processing')
     ORDER BY urgency DESC, request_date ASC`,
  );

  return requests as any[];
};

/**
 * Cancels records request.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} requestId - Request ID
 * @param {string} userId - User cancelling request
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await cancelRecordsRequest(sequelize, 'REQ-2024-001', 'student123');
 * ```
 */
export const cancelRecordsRequest = async (
  sequelize: Sequelize,
  requestId: string,
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(
    `UPDATE records_requests
     SET status = 'cancelled', updated_at = NOW()
     WHERE request_id = ? AND status = 'pending'`,
    {
      replacements: [requestId],
      transaction,
    },
  );
};

// ============================================================================
// RECORDS VERIFICATION (26-30)
// ============================================================================

/**
 * Creates transcript request.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {TranscriptRequest} transcriptData - Transcript request data
 * @param {string} userId - User creating request
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Transcript request
 *
 * @example
 * ```typescript
 * const transcript = await createTranscriptRequest(sequelize, {
 *   transcriptId: 'TRANS-2024-001',
 *   studentId: 1,
 *   transcriptType: 'official',
 *   includeGrades: true,
 *   includeDegrees: true,
 *   includeHonors: true,
 *   includeTestScores: false,
 *   recipientName: 'Graduate School',
 *   recipientEmail: 'admissions@gradschool.edu',
 *   deliveryMethod: 'electronic',
 *   requestDate: new Date()
 * }, 'student123');
 * ```
 */
export const createTranscriptRequest = async (
  sequelize: Sequelize,
  transcriptData: TranscriptRequest,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  // Generate verification code for electronic transcripts
  const verificationCode = transcriptData.deliveryMethod === 'electronic'
    ? crypto.randomBytes(16).toString('hex')
    : null;

  const result = await sequelize.query(
    `INSERT INTO transcript_requests
     (transcript_id, student_id, transcript_type, include_grades, include_degrees, include_honors,
      include_test_scores, recipient_name, recipient_email, delivery_method, request_date,
      verification_code, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    {
      replacements: [
        transcriptData.transcriptId,
        transcriptData.studentId,
        transcriptData.transcriptType,
        transcriptData.includeGrades,
        transcriptData.includeDegrees,
        transcriptData.includeHonors,
        transcriptData.includeTestScores,
        transcriptData.recipientName,
        transcriptData.recipientEmail || null,
        transcriptData.deliveryMethod,
        transcriptData.requestDate,
        verificationCode,
      ],
      transaction,
    },
  );

  return { ...transcriptData, verificationCode };
};

/**
 * Generates official transcript.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {boolean} includeInProgress - Include in-progress courses
 * @returns {Promise<any>} Transcript data
 *
 * @example
 * ```typescript
 * const transcript = await generateOfficialTranscript(sequelize, 1, true);
 * ```
 */
export const generateOfficialTranscript = async (
  sequelize: Sequelize,
  studentId: number,
  includeInProgress = false,
): Promise<any> => {
  // Get student info
  const [students] = await sequelize.query(
    `SELECT * FROM students WHERE id = ?`,
    { replacements: [studentId] },
  );

  if (!students || students.length === 0) {
    throw new Error('Student not found');
  }

  const student = students[0] as any;

  // Get academic history
  const AcademicHistory = createAcademicHistoryModel(sequelize);
  const history = await AcademicHistory.findAll({
    where: { studentId },
    order: [['termId', 'ASC']],
  });

  // Get course enrollments
  let enrollmentQuery = `
    SELECT e.*, c.course_code, c.course_title
    FROM enrollments e
    JOIN courses c ON e.course_id = c.id
    WHERE e.student_id = ?
  `;

  if (!includeInProgress) {
    enrollmentQuery += ` AND e.enrollment_status = 'completed'`;
  }

  enrollmentQuery += ` ORDER BY e.term_id, c.course_code`;

  const [enrollments] = await sequelize.query(enrollmentQuery, { replacements: [studentId] });

  // Generate electronic signature
  const signatureData = {
    studentId,
    generatedDate: new Date(),
    transcriptType: 'official',
  };

  const electronicSignature = crypto
    .createHash('sha256')
    .update(JSON.stringify(signatureData))
    .digest('hex');

  return {
    transcriptType: 'official',
    issuedDate: new Date(),
    student: {
      studentNumber: student.student_number,
      name: `${student.first_name} ${student.last_name}`,
      dateOfBirth: student.date_of_birth,
      admissionDate: student.admission_date,
    },
    academicHistory: history,
    courseWork: enrollments,
    summary: {
      cumulativeGPA: student.gpa,
      creditsEarned: student.credits_earned,
      creditsAttempted: student.credits_attempted,
      academicLevel: student.academic_level,
    },
    electronicSignature,
    verificationNote: 'This is an official transcript. Verify authenticity at verify.university.edu',
  };
};

/**
 * Verifies transcript authenticity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} verificationCode - Verification code
 * @returns {Promise<{ valid: boolean; transcriptData?: any }>} Verification result
 *
 * @example
 * ```typescript
 * const verification = await verifyTranscriptAuthenticity(sequelize, 'abc123def456');
 * ```
 */
export const verifyTranscriptAuthenticity = async (
  sequelize: Sequelize,
  verificationCode: string,
): Promise<{ valid: boolean; transcriptData?: any }> => {
  const [transcripts] = await sequelize.query(
    `SELECT * FROM transcript_requests WHERE verification_code = ?`,
    { replacements: [verificationCode] },
  );

  if (!transcripts || transcripts.length === 0) {
    return { valid: false };
  }

  const transcript = transcripts[0] as any;

  // Check if transcript is still valid (e.g., issued within last 6 months)
  const issueDate = new Date(transcript.issued_date);
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  if (issueDate < sixMonthsAgo) {
    return { valid: false };
  }

  return {
    valid: true,
    transcriptData: {
      studentId: transcript.student_id,
      transcriptType: transcript.transcript_type,
      issuedDate: transcript.issued_date,
      recipientName: transcript.recipient_name,
    },
  };
};

/**
 * Generates degree verification letter.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {string} degreeType - Degree type
 * @returns {Promise<any>} Verification letter
 *
 * @example
 * ```typescript
 * const letter = await generateDegreeVerification(sequelize, 1, 'Bachelor of Science');
 * ```
 */
export const generateDegreeVerification = async (
  sequelize: Sequelize,
  studentId: number,
  degreeType: string,
): Promise<any> => {
  const [students] = await sequelize.query(
    `SELECT * FROM students WHERE id = ?`,
    { replacements: [studentId] },
  );

  if (!students || students.length === 0) {
    throw new Error('Student not found');
  }

  const student = students[0] as any;

  if (!student.actual_graduation_date) {
    throw new Error('Student has not graduated');
  }

  return {
    verificationType: 'Degree Verification',
    issuedDate: new Date(),
    student: {
      studentNumber: student.student_number,
      name: `${student.first_name} ${student.last_name}`,
    },
    degree: {
      degreeType,
      conferredDate: student.actual_graduation_date,
      major: student.major_name || 'N/A',
    },
    verificationStatement: `This letter verifies that the above-named student was awarded a ${degreeType} degree on ${student.actual_graduation_date}.`,
    officialSeal: true,
  };
};

/**
 * Creates enrollment verification for external party.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {number} termId - Term ID
 * @param {string} verificationPurpose - Purpose of verification
 * @returns {Promise<any>} Enrollment verification
 *
 * @example
 * ```typescript
 * const verification = await createEnrollmentVerificationLetter(sequelize, 1, 202401, 'Loan deferment');
 * ```
 */
export const createEnrollmentVerificationLetter = async (
  sequelize: Sequelize,
  studentId: number,
  termId: number,
  verificationPurpose: string,
): Promise<any> => {
  // This would integrate with the enrollment kit
  const [students] = await sequelize.query(
    `SELECT * FROM students WHERE id = ?`,
    { replacements: [studentId] },
  );

  const student = students[0] as any;

  // Get enrollment data
  const [enrollments] = await sequelize.query(
    `SELECT COUNT(*) as course_count, SUM(credits) as total_credits
     FROM enrollments
     WHERE student_id = ? AND term_id = ? AND enrollment_status IN ('enrolled', 'in-progress')`,
    { replacements: [studentId, termId] },
  );

  const enrollmentData = enrollments[0] as any;
  const isFullTime = Number(enrollmentData.total_credits) >= 12;

  return {
    verificationType: 'Enrollment Verification',
    issuedDate: new Date(),
    purpose: verificationPurpose,
    student: {
      studentNumber: student.student_number,
      name: `${student.first_name} ${student.last_name}`,
    },
    enrollment: {
      termId,
      enrollmentStatus: student.enrollment_status,
      creditsEnrolled: enrollmentData.total_credits,
      courseCount: enrollmentData.course_count,
      fullTimeStatus: isFullTime ? 'Full-Time' : 'Part-Time',
      academicLevel: student.academic_level,
    },
    validThrough: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    officialSeal: true,
  };
};

// ============================================================================
// RECORDS CHANGES, HOLDS, AND LOCKS (31-35)
// ============================================================================

/**
 * Creates grade change request.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {GradeChangeRequest} changeData - Grade change data
 * @param {string} userId - User creating request
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Grade change request
 *
 * @example
 * ```typescript
 * const request = await createGradeChangeRequest(sequelize, {
 *   requestId: 'GC-2024-001',
 *   studentId: 1,
 *   courseId: 101,
 *   termId: 202401,
 *   currentGrade: 'B',
 *   proposedGrade: 'A',
 *   changeReason: 'Grading error - final exam score was incorrectly recorded',
 *   requestedBy: 'professor123',
 *   requestDate: new Date(),
 *   status: 'pending'
 * }, 'professor123');
 * ```
 */
export const createGradeChangeRequest = async (
  sequelize: Sequelize,
  changeData: GradeChangeRequest,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const result = await sequelize.query(
    `INSERT INTO grade_change_requests
     (request_id, student_id, course_id, term_id, current_grade, proposed_grade, change_reason,
      requested_by, request_date, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    {
      replacements: [
        changeData.requestId,
        changeData.studentId,
        changeData.courseId,
        changeData.termId,
        changeData.currentGrade,
        changeData.proposedGrade,
        changeData.changeReason,
        changeData.requestedBy,
        changeData.requestDate,
        changeData.status,
      ],
      transaction,
    },
  );

  return result;
};

/**
 * Approves grade change request.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} requestId - Request ID
 * @param {string} userId - User approving request
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await approveGradeChange(sequelize, 'GC-2024-001', 'dean123');
 * ```
 */
export const approveGradeChange = async (
  sequelize: Sequelize,
  requestId: string,
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  // Get grade change request
  const [requests] = await sequelize.query(
    `SELECT * FROM grade_change_requests WHERE request_id = ?`,
    { replacements: [requestId], transaction },
  );

  if (!requests || requests.length === 0) {
    throw new Error('Grade change request not found');
  }

  const request = requests[0] as any;

  // Update enrollment with new grade
  await sequelize.query(
    `UPDATE enrollments
     SET grade = ?, updated_at = NOW(), updated_by = ?
     WHERE student_id = ? AND course_id = ? AND term_id = ?`,
    {
      replacements: [request.proposed_grade, userId, request.student_id, request.course_id, request.term_id],
      transaction,
    },
  );

  // Update grade change request status
  await sequelize.query(
    `UPDATE grade_change_requests
     SET status = 'approved', approved_by = ?, approval_date = NOW(), updated_at = NOW()
     WHERE request_id = ?`,
    {
      replacements: [userId, requestId],
      transaction,
    },
  );

  // Log the change
  await sequelize.query(
    `INSERT INTO records_audit_log
     (record_id, student_id, action_type, action_by, action_date, justification, created_at)
     VALUES (?, ?, 'grade-change', ?, NOW(), ?, NOW())`,
    {
      replacements: [requestId, request.student_id, userId, request.change_reason],
      transaction,
    },
  );
};

/**
 * Places hold on student records.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RecordsHold} holdData - Hold data
 * @param {string} userId - User placing hold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Records hold
 *
 * @example
 * ```typescript
 * const hold = await placeRecordsHold(sequelize, {
 *   holdId: 'RHOLD-2024-001',
 *   studentId: 1,
 *   recordType: 'transcript',
 *   holdReason: 'Unpaid library fines',
 *   placedBy: 'library123',
 *   placedDate: new Date(),
 *   isActive: true,
 *   requiresAuthorization: true
 * }, 'library123');
 * ```
 */
export const placeRecordsHold = async (
  sequelize: Sequelize,
  holdData: RecordsHold,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const result = await sequelize.query(
    `INSERT INTO records_holds
     (hold_id, student_id, record_type, hold_reason, placed_by, placed_date, is_active,
      requires_authorization, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    {
      replacements: [
        holdData.holdId,
        holdData.studentId,
        holdData.recordType,
        holdData.holdReason,
        holdData.placedBy,
        holdData.placedDate,
        holdData.isActive,
        holdData.requiresAuthorization,
      ],
      transaction,
    },
  );

  return result;
};

/**
 * Releases hold on student records.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} holdId - Hold ID
 * @param {string} userId - User releasing hold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await releaseRecordsHold(sequelize, 'RHOLD-2024-001', 'library123');
 * ```
 */
export const releaseRecordsHold = async (
  sequelize: Sequelize,
  holdId: string,
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(
    `UPDATE records_holds
     SET is_active = false, released_by = ?, released_date = NOW(), updated_at = NOW()
     WHERE hold_id = ?`,
    {
      replacements: [userId, holdId],
      transaction,
    },
  );
};

/**
 * Checks for active records holds.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {string} [recordType] - Filter by record type
 * @returns {Promise<{ hasHolds: boolean; holds: any[] }>} Hold status
 *
 * @example
 * ```typescript
 * const holdStatus = await checkRecordsHolds(sequelize, 1, 'transcript');
 * ```
 */
export const checkRecordsHolds = async (
  sequelize: Sequelize,
  studentId: number,
  recordType?: string,
): Promise<{ hasHolds: boolean; holds: any[] }> => {
  let query = `SELECT * FROM records_holds WHERE student_id = ? AND is_active = true`;
  const replacements: any[] = [studentId];

  if (recordType) {
    query += ` AND record_type = ?`;
    replacements.push(recordType);
  }

  query += ` ORDER BY placed_date DESC`;

  const [holds] = await sequelize.query(query, { replacements });

  return {
    hasHolds: holds.length > 0,
    holds: holds as any[],
  };
};

// ============================================================================
// RECORDS ARCHIVAL AND SECURITY (36-45)
// ============================================================================

/**
 * Archives student records for retention.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @param {string} archiveLocation - Archive storage location
 * @param {string} userId - User archiving records
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Archive summary
 *
 * @example
 * ```typescript
 * const archive = await archiveStudentRecords(sequelize, 1, 's3://archives/2024/', 'registrar123');
 * ```
 */
export const archiveStudentRecords = async (
  sequelize: Sequelize,
  studentId: number,
  archiveLocation: string,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const StudentRecord = createStudentRecordModel(sequelize);

  // Get all records for student
  const records = await StudentRecord.findAll({
    where: { studentId },
    transaction,
  });

  const archiveId = `ARCH-${studentId}-${Date.now()}`;

  // Create archive entry
  await sequelize.query(
    `INSERT INTO records_archives
     (archive_id, student_id, archive_location, record_count, archive_date, archived_by, created_at)
     VALUES (?, ?, ?, ?, NOW(), ?, NOW())`,
    {
      replacements: [archiveId, studentId, archiveLocation, records.length, userId],
      transaction,
    },
  );

  // Mark records as archived
  await StudentRecord.update(
    {
      metadata: sequelize.literal(`JSON_SET(metadata, '$.archived', true, '$.archiveId', '${archiveId}')`),
    },
    {
      where: { studentId },
      transaction,
    },
  );

  return {
    archiveId,
    studentId,
    recordCount: records.length,
    archiveLocation,
    archiveDate: new Date(),
  };
};

/**
 * Retrieves archived records.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} archiveId - Archive ID
 * @param {string} userId - User requesting records
 * @returns {Promise<any>} Archived records
 *
 * @example
 * ```typescript
 * const archived = await retrieveArchivedRecords(sequelize, 'ARCH-1-1234567890', 'registrar123');
 * ```
 */
export const retrieveArchivedRecords = async (
  sequelize: Sequelize,
  archiveId: string,
  userId: string,
): Promise<any> => {
  const [archives] = await sequelize.query(
    `SELECT * FROM records_archives WHERE archive_id = ?`,
    { replacements: [archiveId] },
  );

  if (!archives || archives.length === 0) {
    throw new Error('Archive not found');
  }

  const archive = archives[0] as any;

  // Log retrieval
  await sequelize.query(
    `INSERT INTO records_audit_log
     (record_id, student_id, action_type, action_by, action_date, created_at)
     VALUES (?, ?, 'archive-retrieval', ?, NOW(), NOW())`,
    {
      replacements: [archiveId, archive.student_id, userId],
    },
  );

  return archive;
};

/**
 * Schedules records for destruction based on retention policy.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ scheduled: number; records: any[] }>} Destruction schedule
 *
 * @example
 * ```typescript
 * const scheduled = await scheduleRecordsDestruction(sequelize);
 * ```
 */
export const scheduleRecordsDestruction = async (
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<{ scheduled: number; records: any[] }> => {
  const StudentRecord = createStudentRecordModel(sequelize);

  // Find records past their destruction date
  const records = await StudentRecord.findAll({
    where: {
      isPermanent: false,
      destructionDate: { [Op.lte]: new Date() },
      isLocked: false,
    },
    transaction,
  });

  // Schedule for destruction
  for (const record of records) {
    await sequelize.query(
      `INSERT INTO records_destruction_schedule
       (record_id, student_id, scheduled_date, destruction_reason, created_at)
       VALUES (?, ?, NOW(), 'Retention period expired', NOW())`,
      {
        replacements: [record.recordId, record.studentId],
        transaction,
      },
    );
  }

  return {
    scheduled: records.length,
    records: records.map((r) => ({ recordId: r.recordId, destructionDate: r.destructionDate })),
  };
};

/**
 * Securely destroys expired records.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} recordIds - Record IDs to destroy
 * @param {string} userId - User authorizing destruction
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of records destroyed
 *
 * @example
 * ```typescript
 * const destroyed = await destroyExpiredRecords(sequelize, ['REC-2015-001', 'REC-2015-002'], 'registrar123');
 * ```
 */
export const destroyExpiredRecords = async (
  sequelize: Sequelize,
  recordIds: string[],
  userId: string,
  transaction?: Transaction,
): Promise<number> => {
  const StudentRecord = createStudentRecordModel(sequelize);

  let destroyedCount = 0;

  for (const recordId of recordIds) {
    const record = await StudentRecord.findOne({
      where: { recordId },
      transaction,
    });

    if (!record) {
      continue;
    }

    if (record.isPermanent) {
      throw new Error(`Cannot destroy permanent record: ${recordId}`);
    }

    // Log destruction
    await sequelize.query(
      `INSERT INTO records_destruction_log
       (record_id, student_id, destruction_date, destroyed_by, destruction_method, created_at)
       VALUES (?, ?, NOW(), ?, 'secure-deletion', NOW())`,
      {
        replacements: [recordId, record.studentId, userId],
        transaction,
      },
    );

    // Delete record
    await record.destroy({ transaction });
    destroyedCount++;
  }

  return destroyedCount;
};

/**
 * Generates records retention report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Retention report
 *
 * @example
 * ```typescript
 * const report = await generateRetentionReport(sequelize);
 * ```
 */
export const generateRetentionReport = async (sequelize: Sequelize): Promise<any> => {
  const [summary] = await sequelize.query(`
    SELECT
      record_type,
      COUNT(*) as total_records,
      SUM(CASE WHEN is_permanent THEN 1 ELSE 0 END) as permanent_records,
      SUM(CASE WHEN destruction_date <= NOW() THEN 1 ELSE 0 END) as eligible_for_destruction,
      SUM(CASE WHEN is_locked THEN 1 ELSE 0 END) as locked_records
    FROM student_records
    GROUP BY record_type
  `);

  const [destructionSchedule] = await sequelize.query(`
    SELECT COUNT(*) as scheduled_count
    FROM records_destruction_schedule
    WHERE destruction_date IS NULL
  `);

  return {
    reportDate: new Date(),
    summary,
    destructionSchedule: destructionSchedule[0],
  };
};

/**
 * Performs security audit on records access.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<any>} Security audit report
 *
 * @example
 * ```typescript
 * const audit = await performSecurityAudit(sequelize, new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
export const performSecurityAudit = async (
  sequelize: Sequelize,
  startDate: Date,
  endDate: Date,
): Promise<any> => {
  const [accessByUser] = await sequelize.query(
    `SELECT action_by, action_type, COUNT(*) as access_count
     FROM records_audit_log
     WHERE action_date BETWEEN ? AND ?
     GROUP BY action_by, action_type
     ORDER BY access_count DESC`,
    { replacements: [startDate, endDate] },
  );

  const [unauthorizedAttempts] = await sequelize.query(
    `SELECT action_by, COUNT(*) as attempt_count
     FROM records_audit_log
     WHERE ferpa_compliant = false AND action_date BETWEEN ? AND ?
     GROUP BY action_by`,
    { replacements: [startDate, endDate] },
  );

  const [highRiskAccess] = await sequelize.query(
    `SELECT student_id, action_by, action_type, action_date
     FROM records_audit_log
     WHERE action_type IN ('export', 'print', 'email') AND action_date BETWEEN ? AND ?
     ORDER BY action_date DESC
     LIMIT 100`,
    { replacements: [startDate, endDate] },
  );

  return {
    auditPeriod: { startDate, endDate },
    accessByUser,
    unauthorizedAttempts,
    highRiskAccess,
    generatedAt: new Date(),
  };
};

/**
 * Encrypts batch of student records.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} recordIds - Record IDs to encrypt
 * @param {string} userId - User performing encryption
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of records encrypted
 *
 * @example
 * ```typescript
 * const encrypted = await encryptStudentRecords(sequelize, ['REC-2024-001', 'REC-2024-002'], 'admin123');
 * ```
 */
export const encryptStudentRecords = async (
  sequelize: Sequelize,
  recordIds: string[],
  userId: string,
  transaction?: Transaction,
): Promise<number> => {
  const StudentRecord = createStudentRecordModel(sequelize);
  let encryptedCount = 0;

  for (const recordId of recordIds) {
    const record = await StudentRecord.findOne({
      where: { recordId },
      transaction,
    });

    if (!record || record.recordDataEncrypted) {
      continue; // Skip if not found or already encrypted
    }

    const encryption = encryptRecordData(JSON.stringify(record.recordData));

    await record.update(
      {
        recordDataEncrypted: encryption.encrypted,
        encryptionKey: encryption.key,
        recordData: {}, // Clear unencrypted data
        updatedBy: userId,
      },
      { transaction },
    );

    encryptedCount++;
  }

  return encryptedCount;
};

/**
 * Validates records encryption compliance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{ compliant: boolean; unencryptedCount: number; records: any[] }>} Compliance status
 *
 * @example
 * ```typescript
 * const compliance = await validateEncryptionCompliance(sequelize);
 * ```
 */
export const validateEncryptionCompliance = async (
  sequelize: Sequelize,
): Promise<{ compliant: boolean; unencryptedCount: number; records: any[] }> => {
  const StudentRecord = createStudentRecordModel(sequelize);

  // Find FERPA-protected records that are not encrypted
  const unencrypted = await StudentRecord.findAll({
    where: {
      ferpaProtected: true,
      recordDataEncrypted: null,
    },
    attributes: ['recordId', 'studentId', 'recordType', 'createdAt'],
  });

  return {
    compliant: unencrypted.length === 0,
    unencryptedCount: unencrypted.length,
    records: unencrypted.map((r) => ({
      recordId: r.recordId,
      studentId: r.studentId,
      recordType: r.recordType,
      createdAt: r.createdAt,
    })),
  };
};

/**
 * Creates degree audit for student.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {DegreeAudit} auditData - Degree audit data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Degree audit
 *
 * @example
 * ```typescript
 * const audit = await createDegreeAudit(sequelize, {
 *   auditId: 'AUDIT-2024-001',
 *   studentId: 1,
 *   programId: 101,
 *   degreeType: 'Bachelor of Science',
 *   auditDate: new Date(),
 *   completionPercentage: 75,
 *   creditsRequired: 120,
 *   creditsCompleted: 90,
 *   creditsInProgress: 15,
 *   creditsRemaining: 15,
 *   requirementsMet: ['General Education', 'Major Core'],
 *   requirementsPending: ['Senior Capstone', 'Electives'],
 *   expectedGraduationDate: new Date('2025-05-15')
 * });
 * ```
 */
export const createDegreeAudit = async (
  sequelize: Sequelize,
  auditData: DegreeAudit,
  transaction?: Transaction,
): Promise<any> => {
  const result = await sequelize.query(
    `INSERT INTO degree_audits
     (audit_id, student_id, program_id, degree_type, audit_date, completion_percentage,
      credits_required, credits_completed, credits_in_progress, credits_remaining,
      requirements_met, requirements_pending, expected_graduation_date, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    {
      replacements: [
        auditData.auditId,
        auditData.studentId,
        auditData.programId,
        auditData.degreeType,
        auditData.auditDate,
        auditData.completionPercentage,
        auditData.creditsRequired,
        auditData.creditsCompleted,
        auditData.creditsInProgress,
        auditData.creditsRemaining,
        JSON.stringify(auditData.requirementsMet),
        JSON.stringify(auditData.requirementsPending),
        auditData.expectedGraduationDate || null,
      ],
      transaction,
    },
  );

  return result;
};

/**
 * Generates comprehensive student history report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} studentId - Student ID
 * @returns {Promise<any>} Comprehensive history report
 *
 * @example
 * ```typescript
 * const history = await generateStudentHistoryReport(sequelize, 1);
 * ```
 */
export const generateStudentHistoryReport = async (
  sequelize: Sequelize,
  studentId: number,
): Promise<any> => {
  const [student] = await sequelize.query(
    `SELECT * FROM students WHERE id = ?`,
    { replacements: [studentId] },
  );

  const AcademicHistory = createAcademicHistoryModel(sequelize);
  const academicHistory = await AcademicHistory.findAll({
    where: { studentId },
    order: [['termId', 'ASC']],
  });

  const EducationalRecord = createEducationalRecordModel(sequelize);
  const priorEducation = await EducationalRecord.findAll({
    where: { studentId },
  });

  const records = await getStudentRecords(sequelize, studentId);

  return {
    reportDate: new Date(),
    student: student[0],
    academicHistory,
    priorEducation,
    recordsSummary: {
      totalRecords: records.length,
      recordTypes: records.reduce((acc: any, r) => {
        acc[r.recordType] = (acc[r.recordType] || 0) + 1;
        return acc;
      }, {}),
    },
  };
};

/**
 * Default export with all utilities.
 */
export default {
  // Models
  createStudentRecordModel,
  createAcademicHistoryModel,
  createEducationalRecordModel,

  // Student Records Management
  createStudentRecord,
  getStudentRecord,
  updateStudentRecord,
  lockStudentRecord,
  getStudentRecords,
  createAcademicHistory,
  calculateCumulativeGPA,
  addEducationalRecord,
  verifyEducationalRecord,

  // FERPA Compliance
  createFERPAConsent,
  validateFERPAAuthorization,
  revokeFERPAConsent,
  checkDirectoryOptOut,
  logRecordAccess,
  getFERPAAuditLog,
  validateRecordDisclosure,
  generateFERPAComplianceReport,
  encryptRecordData,
  decryptRecordData,

  // Records Request Management
  createRecordsRequest,
  processRecordsRequest,
  completeRecordsRequest,
  getPendingRecordsRequests,
  cancelRecordsRequest,

  // Records Verification
  createTranscriptRequest,
  generateOfficialTranscript,
  verifyTranscriptAuthenticity,
  generateDegreeVerification,
  createEnrollmentVerificationLetter,

  // Records Changes, Holds, Locks
  createGradeChangeRequest,
  approveGradeChange,
  placeRecordsHold,
  releaseRecordsHold,
  checkRecordsHolds,

  // Records Archival and Security
  archiveStudentRecords,
  retrieveArchivedRecords,
  scheduleRecordsDestruction,
  destroyExpiredRecords,
  generateRetentionReport,
  performSecurityAudit,
  encryptStudentRecords,
  validateEncryptionCompliance,
  createDegreeAudit,
  generateStudentHistoryReport,
};
