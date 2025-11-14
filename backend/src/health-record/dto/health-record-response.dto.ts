/**
 * @fileoverview Health Record Response DTOs
 * @module health-record/dto/health-record-response.dto
 * @description Comprehensive response DTOs for health record domain with HIPAA compliance
 *
 * **HIPAA Compliance Notice:**
 * All health record data is Protected Health Information (PHI) under HIPAA.
 * - Implement proper access controls and audit logging
 * - Encrypt data in transit and at rest
 * - Log all PHI access for compliance reporting
 * - Follow minimum necessary principle for data exposure
 *
 * @see {@link https://www.hhs.gov/hipaa/for-professionals/privacy/index.html|HIPAA Privacy Rule}
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';

/**
 * Health Record Type Enumeration
 *
 * Comprehensive list of health record types used in the system.
 * Maps directly to the database ENUM definition.
 *
 * @enum {string}
 */
export enum HealthRecordType {
  CHECKUP = 'CHECKUP',
  VACCINATION = 'VACCINATION',
  ILLNESS = 'ILLNESS',
  INJURY = 'INJURY',
  SCREENING = 'SCREENING',
  PHYSICAL_EXAM = 'PHYSICAL_EXAM',
  MENTAL_HEALTH = 'MENTAL_HEALTH',
  DENTAL = 'DENTAL',
  VISION = 'VISION',
  HEARING = 'HEARING',
  EXAMINATION = 'EXAMINATION',
  ALLERGY_DOCUMENTATION = 'ALLERGY_DOCUMENTATION',
  CHRONIC_CONDITION_REVIEW = 'CHRONIC_CONDITION_REVIEW',
  GROWTH_ASSESSMENT = 'GROWTH_ASSESSMENT',
  VITAL_SIGNS_CHECK = 'VITAL_SIGNS_CHECK',
  EMERGENCY_VISIT = 'EMERGENCY_VISIT',
  FOLLOW_UP = 'FOLLOW_UP',
  CONSULTATION = 'CONSULTATION',
  DIAGNOSTIC_TEST = 'DIAGNOSTIC_TEST',
  PROCEDURE = 'PROCEDURE',
  HOSPITALIZATION = 'HOSPITALIZATION',
  SURGERY = 'SURGERY',
  COUNSELING = 'COUNSELING',
  THERAPY = 'THERAPY',
  NUTRITION = 'NUTRITION',
  MEDICATION_REVIEW = 'MEDICATION_REVIEW',
  IMMUNIZATION = 'IMMUNIZATION',
  LAB_RESULT = 'LAB_RESULT',
  RADIOLOGY = 'RADIOLOGY',
  OTHER = 'OTHER',
}

/**
 * Student Summary DTO
 *
 * Lightweight student information for health record associations.
 * Contains only essential identifying information to minimize PHI exposure.
 *
 * **Privacy Note:** Only include this when the requesting user has appropriate
 * authorization to view student information associated with health records.
 *
 * @class
 */
export class StudentSummaryDto {
  /**
   * Unique identifier for the student
   * @type {string}
   * @format uuid
   */
  @ApiProperty({
    description: 'Student unique identifier (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
    type: String,
  })
  id: string;

  /**
   * Student's first name
   * @type {string}
   */
  @ApiProperty({
    description: "Student's first name",
    example: 'Emma',
    type: String,
  })
  firstName: string;

  /**
   * Student's last name
   * @type {string}
   */
  @ApiProperty({
    description: "Student's last name",
    example: 'Johnson',
    type: String,
  })
  lastName: string;

  /**
   * Student's date of birth (for identity verification)
   * @type {Date}
   */
  @ApiPropertyOptional({
    description: "Student's date of birth (PHI - Protected Health Information)",
    example: '2010-05-15',
    type: Date,
    format: 'date',
  })
  dateOfBirth?: Date;
}

/**
 * Health Record Response DTO
 *
 * Complete health record response with all fields, associations, and computed values.
 *
 * **HIPAA Compliance:**
 * - All fields in this DTO are considered Protected Health Information (PHI)
 * - Audit all access to this data
 * - Apply role-based access controls
 * - Respect isConfidential flag for heightened sensitivity
 *
 * **Clinical Data Standards:**
 * - NPI (National Provider Identifier): 10-digit number
 * - ICD-10 Diagnosis Codes: Format A00 to Z99, with optional decimal extensions
 *
 * @class
 * @implements {HealthRecordAttributes}
 */
export class HealthRecordResponseDto {
  /**
   * Unique identifier for the health record
   * @type {string}
   * @format uuid
   */
  @ApiProperty({
    description: 'Health record unique identifier (UUID)',
    example: '987fcdeb-51a2-4321-b9c8-123456789abc',
    format: 'uuid',
    type: String,
  })
  id: string;

  /**
   * Reference to the student this health record belongs to
   * @type {string}
   * @format uuid
   */
  @ApiProperty({
    description: 'Student unique identifier (UUID) - Foreign key reference',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
    type: String,
  })
  studentId: string;

  /**
   * Type of health record
   * @type {HealthRecordType}
   * @enum {HealthRecordType}
   */
  @ApiProperty({
    description: 'Type of health record entry',
    enum: HealthRecordType,
    example: HealthRecordType.CHECKUP,
    enumName: 'HealthRecordType',
  })
  recordType: HealthRecordType;

  /**
   * Brief title or summary of the health record
   * @type {string}
   * @maxLength 200
   */
  @ApiProperty({
    description: 'Brief title or summary of the health record (max 200 characters)',
    example: 'Annual Physical Examination',
    maxLength: 200,
    type: String,
  })
  title: string;

  /**
   * Detailed description of the health record
   * @type {string}
   */
  @ApiProperty({
    description: 'Detailed description of the health encounter, findings, and observations',
    example:
      'Student presented for annual physical examination. General health assessment performed including growth measurements, vital signs, and review of systems.',
    type: String,
  })
  description: string;

  /**
   * Date when the health record or visit occurred
   * @type {Date}
   */
  @ApiProperty({
    description: 'Date of health record, visit, or encounter',
    example: '2024-10-15T14:30:00Z',
    type: Date,
    format: 'date-time',
  })
  recordDate: Date;

  /**
   * Name of the healthcare provider
   * @type {string}
   * @optional
   */
  @ApiPropertyOptional({
    description: 'Healthcare provider name (physician, nurse practitioner, school nurse)',
    example: 'Dr. Sarah Mitchell, MD',
    maxLength: 200,
    type: String,
  })
  provider?: string;

  /**
   * National Provider Identifier for the healthcare provider
   *
   * **Format:** 10-digit number assigned by CMS
   * **Validation:** Must match pattern /^\d{10}$/
   *
   * @type {string}
   * @optional
   * @pattern ^\d{10}$
   * @see {@link https://npiregistry.cms.hhs.gov/|NPI Registry}
   */
  @ApiPropertyOptional({
    description:
      'National Provider Identifier (NPI) - 10-digit unique identifier for healthcare provider. Required for insurance billing and HIPAA compliance.',
    example: '1234567890',
    pattern: '^\\d{10}$',
    minLength: 10,
    maxLength: 10,
    type: String,
  })
  providerNpi?: string;

  /**
   * Name of the healthcare facility or location
   * @type {string}
   * @optional
   */
  @ApiPropertyOptional({
    description: 'Healthcare facility name (hospital, clinic, school health office)',
    example: 'Lincoln Elementary School Health Office',
    maxLength: 200,
    type: String,
  })
  facility?: string;

  /**
   * National Provider Identifier for the healthcare facility
   *
   * **Format:** 10-digit number assigned by CMS
   * **Validation:** Must match pattern /^\d{10}$/
   *
   * @type {string}
   * @optional
   * @pattern ^\d{10}$
   * @see {@link https://npiregistry.cms.hhs.gov/|NPI Registry}
   */
  @ApiPropertyOptional({
    description:
      'Facility National Provider Identifier (NPI) - 10-digit unique identifier for healthcare organization. Required for institutional billing.',
    example: '9876543210',
    pattern: '^\\d{10}$',
    minLength: 10,
    maxLength: 10,
    type: String,
  })
  facilityNpi?: string;

  /**
   * Clinical diagnosis description
   * @type {string}
   * @optional
   */
  @ApiPropertyOptional({
    description:
      'Clinical diagnosis or assessment in descriptive text form. Use diagnosisCode for standardized ICD-10 coding.',
    example: 'Acute viral upper respiratory infection',
    type: String,
  })
  diagnosis?: string;

  /**
   * ICD-10 diagnosis code
   *
   * **Format:** One letter (A-Z) followed by 2 digits, with optional decimal extensions
   * **Pattern:** /^[A-Z]\d{2}(\.\d{1,4})?$/
   * **Examples:**
   * - J06.9 - Acute upper respiratory infection, unspecified
   * - E11.9 - Type 2 diabetes mellitus without complications
   * - I10 - Essential (primary) hypertension
   *
   * @type {string}
   * @optional
   * @pattern ^[A-Z]\d{2}(\.\d{1,4})?$
   * @see {@link https://www.cdc.gov/nchs/icd/icd-10-cm.htm|ICD-10-CM Official Guidelines}
   */
  @ApiPropertyOptional({
    description:
      'ICD-10 diagnosis code for standardized medical coding. Format: Letter + 2 digits + optional decimal extension (e.g., J06.9, E11.9)',
    example: 'J06.9',
    pattern: '^[A-Z]\\d{2}(\\.\\d{1,4})?$',
    type: String,
  })
  diagnosisCode?: string;

  /**
   * Treatment provided or prescribed
   * @type {string}
   * @optional
   */
  @ApiPropertyOptional({
    description:
      'Treatment, intervention, or care plan provided. Include medications, procedures, referrals, and recommendations.',
    example:
      'Rest and increased fluid intake recommended. Acetaminophen 500mg as needed for fever. Return if symptoms worsen or persist beyond 7 days.',
    type: String,
  })
  treatment?: string;

  /**
   * Indicates if follow-up care is required
   * @type {boolean}
   * @default false
   */
  @ApiProperty({
    description:
      'Flag indicating whether follow-up care or re-evaluation is required. When true, followUpDate should be specified.',
    example: true,
    type: Boolean,
    default: false,
  })
  followUpRequired: boolean;

  /**
   * Scheduled date for follow-up care
   *
   * **Validation:** Must be after recordDate
   * **Required when:** followUpRequired is true
   *
   * @type {Date}
   * @optional
   */
  @ApiPropertyOptional({
    description:
      'Scheduled date for follow-up visit or re-evaluation. Required when followUpRequired is true. Must be after recordDate.',
    example: '2024-10-22T14:30:00Z',
    type: Date,
    format: 'date-time',
  })
  followUpDate?: Date;

  /**
   * Indicates if the follow-up has been completed
   * @type {boolean}
   * @default false
   */
  @ApiProperty({
    description:
      'Flag indicating whether the scheduled follow-up has been completed. Set to true once follow-up visit occurs.',
    example: false,
    type: Boolean,
    default: false,
  })
  followUpCompleted: boolean;

  /**
   * Array of attachment file paths or URLs
   *
   * **Security:** Ensure proper access controls on attachment storage
   * **Privacy:** May contain PHI (lab reports, images, documents)
   *
   * @type {string[]}
   */
  @ApiProperty({
    description:
      'Array of file paths or URLs to attachments (lab reports, images, consent forms, medical documents). All attachments are PHI.',
    example: [
      '/uploads/health-records/lab-results-2024-10-15.pdf',
      '/uploads/health-records/consent-form-signed.pdf',
    ],
    type: [String],
    isArray: true,
    default: [],
  })
  attachments: string[];

  /**
   * Additional structured metadata
   *
   * **Usage:** Store structured clinical data, custom fields, or integration data
   * **Format:** JSON object with flexible schema
   *
   * @type {Record<string, any>}
   * @optional
   */
  @ApiPropertyOptional({
    description:
      'Flexible JSON metadata field for storing additional structured information, custom fields, or integration data.',
    example: {
      vitalSigns: { temperature: 98.6, bloodPressure: '120/80', pulse: 72 },
      immunizationLot: 'LOT-12345',
      referralSent: true,
    },
    type: 'object',
    additionalProperties: true,
  })
  metadata?: Record<string, any>;

  /**
   * HIPAA confidentiality flag
   *
   * **Purpose:** Mark highly sensitive records requiring heightened access controls
   * **Use Cases:**
   * - Mental health treatment
   * - Substance abuse treatment
   * - Sexual health
   * - HIV/AIDS status
   * - Domestic violence
   *
   * **Access Control:** Implement stricter role-based access when true
   *
   * @type {boolean}
   * @default false
   */
  @ApiProperty({
    description:
      'HIPAA confidentiality flag for highly sensitive health information requiring heightened access controls (mental health, substance abuse, sexual health). When true, implement stricter access restrictions.',
    example: false,
    type: Boolean,
    default: false,
  })
  isConfidential: boolean;

  /**
   * Additional clinical notes
   *
   * **Purpose:** Free-form clinical documentation
   * **PHI Warning:** All notes are Protected Health Information
   *
   * @type {string}
   * @optional
   */
  @ApiPropertyOptional({
    description:
      'Additional clinical notes, observations, or documentation not captured in other structured fields. All notes are PHI.',
    example:
      'Parent notified of findings via phone. Student reports feeling much better. Will monitor for recurrence.',
    type: String,
  })
  notes?: string;

  /**
   * User ID of the record creator
   *
   * **Audit Trail:** Track who created the health record
   * **HIPAA:** Part of required audit logging
   *
   * @type {string}
   * @optional
   * @format uuid
   */
  @ApiPropertyOptional({
    description:
      'UUID of the user who created this health record. Used for audit trail and HIPAA compliance tracking.',
    example: '456e7890-e12b-34d5-a678-901234567def',
    format: 'uuid',
    type: String,
  })
  createdBy?: string;

  /**
   * User ID of the last updater
   *
   * **Audit Trail:** Track who last modified the health record
   * **HIPAA:** Part of required audit logging
   *
   * @type {string}
   * @optional
   * @format uuid
   */
  @ApiPropertyOptional({
    description:
      'UUID of the user who last updated this health record. Used for audit trail and HIPAA compliance tracking.',
    example: '456e7890-e12b-34d5-a678-901234567def',
    format: 'uuid',
    type: String,
  })
  updatedBy?: string;

  /**
   * Timestamp when the record was created
   * @type {Date}
   */
  @ApiProperty({
    description: 'Timestamp when the health record was created in the system',
    example: '2024-10-15T14:35:00Z',
    type: Date,
    format: 'date-time',
  })
  createdAt: Date;

  /**
   * Timestamp when the record was last updated
   * @type {Date}
   */
  @ApiProperty({
    description: 'Timestamp when the health record was last modified',
    example: '2024-10-15T14:35:00Z',
    type: Date,
    format: 'date-time',
  })
  updatedAt: Date;

  /**
   * Associated student information
   *
   * **Included when:** Sequelize query includes Student association
   * **Privacy:** Only include when user has authorization
   *
   * @type {StudentSummaryDto}
   * @optional
   */
  @ApiPropertyOptional({
    description:
      'Student information (included when explicitly requested with associations). Only returned if user has appropriate authorization.',
    type: () => StudentSummaryDto,
  })
  @Type(() => StudentSummaryDto)
  student?: StudentSummaryDto;

  /**
   * Virtual/computed field: Is follow-up overdue?
   *
   * **Computation Logic:**
   * - Returns false if followUpRequired is false
   * - Returns false if followUpCompleted is true
   * - Returns false if followUpDate is null
   * - Returns true if current date > followUpDate
   *
   * **Use Case:** Alert notifications, dashboard widgets, overdue reports
   *
   * @type {boolean}
   * @virtual
   */
  @ApiProperty({
    description:
      'Computed field indicating if the follow-up appointment is overdue. True when followUpRequired=true, followUpCompleted=false, and current date > followUpDate.',
    example: false,
    type: Boolean,
  })
  isFollowUpOverdue?: boolean;

  /**
   * Virtual/computed field: Days until follow-up (negative if overdue)
   *
   * **Computation Logic:**
   * - Returns null if followUpRequired is false
   * - Returns null if followUpCompleted is true
   * - Returns null if followUpDate is null
   * - Returns positive number for days remaining
   * - Returns negative number for days overdue
   *
   * **Use Case:** Sort by urgency, prioritize follow-ups, calculate metrics
   *
   * @type {number}
   * @optional
   * @virtual
   */
  @ApiPropertyOptional({
    description:
      'Computed field showing days until follow-up appointment. Positive values indicate future appointments, negative values indicate overdue days. Null if not applicable.',
    example: 7,
    type: Number,
  })
  daysUntilFollowUp?: number | null;
}

/**
 * Health Record Summary DTO
 *
 * Lightweight health record representation for use in associations and list views.
 * Contains only essential identifying information to minimize data transfer.
 *
 * **Use Cases:**
 * - Student profile health record lists
 * - Dashboard widgets
 * - Related record associations
 * - Quick reference displays
 *
 * @class
 */
export class HealthRecordSummaryDto {
  /**
   * Unique identifier for the health record
   * @type {string}
   * @format uuid
   */
  @ApiProperty({
    description: 'Health record unique identifier (UUID)',
    example: '987fcdeb-51a2-4321-b9c8-123456789abc',
    format: 'uuid',
    type: String,
  })
  id: string;

  /**
   * Brief title or summary
   * @type {string}
   */
  @ApiProperty({
    description: 'Brief title or summary of the health record',
    example: 'Annual Physical Examination',
    type: String,
  })
  title: string;

  /**
   * Type of health record
   * @type {HealthRecordType}
   */
  @ApiProperty({
    description: 'Type of health record entry',
    enum: HealthRecordType,
    example: HealthRecordType.CHECKUP,
  })
  recordType: HealthRecordType;

  /**
   * Date of the health record
   * @type {Date}
   */
  @ApiProperty({
    description: 'Date of health record or visit',
    example: '2024-10-15T14:30:00Z',
    type: Date,
    format: 'date-time',
  })
  recordDate: Date;

  /**
   * HIPAA confidentiality flag
   * @type {boolean}
   */
  @ApiProperty({
    description:
      'Confidentiality flag indicating heightened sensitivity requiring stricter access controls',
    example: false,
    type: Boolean,
  })
  isConfidential: boolean;

  /**
   * Follow-up required flag
   * @type {boolean}
   */
  @ApiProperty({
    description: 'Indicates if follow-up care is required',
    example: false,
    type: Boolean,
  })
  followUpRequired: boolean;
}

/**
 * Health Summary DTO
 *
 * Aggregated health information for a student.
 * Provides overview metrics, recent activity, and pending follow-ups.
 *
 * **Use Cases:**
 * - Student health dashboard
 * - Health status overview
 * - Alert and notification generation
 * - Compliance reporting
 *
 * @class
 */
export class HealthSummaryDto {
  /**
   * Student identifier
   * @type {string}
   * @format uuid
   */
  @ApiProperty({
    description: 'Student unique identifier (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
    type: String,
  })
  studentId: string;

  /**
   * Total count of health records for this student
   * @type {number}
   */
  @ApiProperty({
    description: 'Total number of health records for this student',
    example: 42,
    type: Number,
    minimum: 0,
  })
  totalRecords: number;

  /**
   * Count of health records by type
   *
   * **Structure:** Object mapping HealthRecordType to count
   * **Use Case:** Visualize health record distribution, identify patterns
   *
   * @type {Record<string, number>}
   */
  @ApiProperty({
    description: 'Breakdown of health record counts by type',
    example: {
      CHECKUP: 5,
      VACCINATION: 12,
      ILLNESS: 8,
      INJURY: 3,
      SCREENING: 7,
    },
    type: 'object',
    additionalProperties: {
      type: 'number',
    },
  })
  recordsByType: Record<string, number>;

  /**
   * Most recent health records
   *
   * **Limit:** Typically 5-10 most recent records
   * **Sort:** Descending by recordDate
   *
   * @type {HealthRecordSummaryDto[]}
   */
  @ApiProperty({
    description: 'Most recent health records (limited to last 10)',
    type: [HealthRecordSummaryDto],
    isArray: true,
  })
  @Type(() => HealthRecordSummaryDto)
  recentRecords: HealthRecordSummaryDto[];

  /**
   * Count of pending follow-ups
   *
   * **Definition:** Health records where:
   * - followUpRequired = true
   * - followUpCompleted = false
   *
   * @type {number}
   */
  @ApiProperty({
    description:
      'Number of health records with pending follow-ups (followUpRequired=true, followUpCompleted=false)',
    example: 2,
    type: Number,
    minimum: 0,
  })
  pendingFollowUps: number;

  /**
   * Count of overdue follow-ups
   *
   * **Definition:** Health records where:
   * - followUpRequired = true
   * - followUpCompleted = false
   * - followUpDate < current date
   *
   * **Alert:** This should trigger notifications
   *
   * @type {number}
   */
  @ApiProperty({
    description:
      'Number of overdue follow-ups (followUpRequired=true, followUpCompleted=false, followUpDate < now). Requires immediate attention.',
    example: 0,
    type: Number,
    minimum: 0,
  })
  overdueFollowUps: number;

  /**
   * Date of most recent health record
   * @type {Date}
   * @optional
   */
  @ApiPropertyOptional({
    description: 'Date of the most recent health record entry',
    example: '2024-10-15T14:30:00Z',
    type: Date,
    format: 'date-time',
  })
  lastRecordDate?: Date;

  /**
   * Count of confidential records
   *
   * **Privacy:** Number only, no details
   * **Use Case:** Compliance reporting, access audit requirements
   *
   * @type {number}
   */
  @ApiProperty({
    description:
      'Number of health records marked as confidential (isConfidential=true). Count only for privacy.',
    example: 3,
    type: Number,
    minimum: 0,
  })
  confidentialRecordsCount: number;
}

/**
 * Health Record List Response DTO
 *
 * Paginated list of health records with metadata.
 * Uses the generic PaginatedResponseDto structure.
 *
 * **Type Definition:** This is a type alias for clarity in controller signatures
 *
 * @typedef {PaginatedResponseDto<HealthRecordResponseDto>} HealthRecordListResponseDto
 *
 * @example
 * ```typescript
 * // Controller usage:
 * @Get()
 * @ApiOkResponse({
 *   description: 'Health records retrieved successfully',
 *   type: HealthRecordListResponseDto,
 * })
 * async findAll(): Promise<HealthRecordListResponseDto> {
 *   return this.healthRecordService.findAll();
 * }
 * ```
 */
export class HealthRecordListResponseDto extends PaginatedResponseDto<HealthRecordResponseDto> {
  @ApiProperty({
    description: 'Array of health records for the current page',
    type: [HealthRecordResponseDto],
    isArray: true,
  })
  @Type(() => HealthRecordResponseDto)
  declare data: HealthRecordResponseDto[];
}

/**
 * Mapper function to convert Sequelize HealthRecord model to ResponseDto
 *
 * **Purpose:**
 * - Transform raw Sequelize model instances to clean DTOs
 * - Compute virtual fields (isFollowUpOverdue, daysUntilFollowUp)
 * - Handle nested associations (student)
 * - Ensure consistent data structure for API responses
 *
 * **HIPAA Compliance:**
 * - Maintains all PHI data integrity
 * - Preserves confidentiality flags
 * - Includes audit trail fields (createdBy, updatedBy)
 *
 * @function
 * @param {any} record - Sequelize HealthRecord model instance with optional associations
 * @returns {HealthRecordResponseDto} Mapped response DTO with computed fields
 *
 * @example
 * ```typescript
 * // Service usage:
 * async findOne(id: string): Promise<HealthRecordResponseDto> {
 *   const record = await this.healthRecordModel.findByPk(id, {
 *     include: [{ model: Student, as: 'student' }],
 *   });
 *   if (!record) {
 *     throw new NotFoundException(`Health record ${id} not found`);
 *   }
 *   return mapHealthRecordToResponseDto(record);
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Batch mapping:
 * const records = await this.healthRecordModel.findAll();
 * const dtos = records.map(mapHealthRecordToResponseDto);
 * ```
 */
export function mapHealthRecordToResponseDto(
  record: any,
): HealthRecordResponseDto {
  // Compute isFollowUpOverdue
  let isFollowUpOverdue = false;
  if (
    record.followUpRequired &&
    !record.followUpCompleted &&
    record.followUpDate
  ) {
    isFollowUpOverdue = new Date() > new Date(record.followUpDate);
  }

  // Compute daysUntilFollowUp
  let daysUntilFollowUp: number | null = null;
  if (
    record.followUpRequired &&
    !record.followUpCompleted &&
    record.followUpDate
  ) {
    const diff = new Date(record.followUpDate).getTime() - new Date().getTime();
    daysUntilFollowUp = Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  // Map student association if present
  let student: StudentSummaryDto | undefined;
  if (record.student) {
    student = {
      id: record.student.id,
      firstName: record.student.firstName,
      lastName: record.student.lastName,
      dateOfBirth: record.student.dateOfBirth,
    };
  }

  // Map base fields to DTO
  const dto: HealthRecordResponseDto = {
    id: record.id,
    studentId: record.studentId,
    recordType: record.recordType as HealthRecordType,
    title: record.title,
    description: record.description,
    recordDate: record.recordDate,
    provider: record.provider,
    providerNpi: record.providerNpi,
    facility: record.facility,
    facilityNpi: record.facilityNpi,
    diagnosis: record.diagnosis,
    diagnosisCode: record.diagnosisCode,
    treatment: record.treatment,
    followUpRequired: record.followUpRequired,
    followUpDate: record.followUpDate,
    followUpCompleted: record.followUpCompleted,
    attachments: record.attachments || [],
    metadata: record.metadata,
    isConfidential: record.isConfidential,
    notes: record.notes,
    createdBy: record.createdBy,
    updatedBy: record.updatedBy,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    student,
    isFollowUpOverdue,
    daysUntilFollowUp,
  };

  return dto;
}

/**
 * Mapper function to convert HealthRecord model to SummaryDto
 *
 * **Purpose:**
 * - Create lightweight representation for associations and lists
 * - Minimize data transfer for large datasets
 * - Support nested displays without full data exposure
 *
 * @function
 * @param {any} record - Sequelize HealthRecord model instance
 * @returns {HealthRecordSummaryDto} Lightweight summary DTO
 *
 * @example
 * ```typescript
 * // Service usage for related records:
 * const summaries = healthRecords.map(mapHealthRecordToSummaryDto);
 * ```
 */
export function mapHealthRecordToSummaryDto(
  record: any,
): HealthRecordSummaryDto {
  return {
    id: record.id,
    title: record.title,
    recordType: record.recordType as HealthRecordType,
    recordDate: record.recordDate,
    isConfidential: record.isConfidential,
    followUpRequired: record.followUpRequired,
  };
}
