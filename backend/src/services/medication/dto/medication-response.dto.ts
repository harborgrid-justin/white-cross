import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { PaginatedResponseDto } from '@/common/dto/paginated-response.dto';

/**
 * DEA Schedule classification for controlled substances
 *
 * The Drug Enforcement Administration (DEA) classifies controlled substances
 * into five schedules based on their medical use and potential for abuse.
 *
 * @remarks
 * Schedule I substances are not included as they have no accepted medical use
 * and are not prescribed in clinical settings.
 *
 * @see {@link https://www.dea.gov/drug-information/drug-scheduling|DEA Drug Scheduling}
 */
export enum DEASchedule {
  /** Schedule I - High potential for abuse, no accepted medical use (not used in prescriptions) */
  SCHEDULE_I = 'I',

  /** Schedule II - High potential for abuse, accepted medical use with severe restrictions */
  SCHEDULE_II = 'II',

  /** Schedule III - Moderate to low potential for abuse, accepted medical use */
  SCHEDULE_III = 'III',

  /** Schedule IV - Low potential for abuse, accepted medical use */
  SCHEDULE_IV = 'IV',

  /** Schedule V - Lowest potential for abuse, accepted medical use */
  SCHEDULE_V = 'V',
}

/**
 * Medication administration log status
 *
 * Tracks the lifecycle and outcome of scheduled medication administrations.
 */
export enum MedicationLogStatus {
  /** Medication scheduled but not yet administered */
  PENDING = 'PENDING',

  /** Medication successfully administered to patient */
  ADMINISTERED = 'ADMINISTERED',

  /** Scheduled administration was missed */
  MISSED = 'MISSED',

  /** Administration cancelled by authorized personnel */
  CANCELLED = 'CANCELLED',

  /** Patient refused the medication */
  REFUSED = 'REFUSED',
}

/**
 * Complete medication catalog entry response DTO
 *
 * Represents a comprehensive medication record from the facility's formulary,
 * including pharmaceutical metadata, regulatory classification, and tracking
 * information for controlled substances.
 *
 * @remarks
 * This DTO includes all fields necessary for:
 * - Medication identification and tracking via NDC
 * - DEA controlled substance compliance
 * - Witness verification requirements for high-risk medications
 * - Formulary management and inventory control
 *
 * @example
 * ```typescript
 * const medication: MedicationResponseDto = {
 *   id: '123e4567-e89b-12d3-a456-426614174000',
 *   name: 'Oxycodone Hydrochloride',
 *   genericName: 'Oxycodone',
 *   dosageForm: 'Tablet',
 *   strength: '5mg',
 *   manufacturer: 'Purdue Pharma',
 *   ndc: '59011-0440-10',
 *   isControlled: true,
 *   deaSchedule: 'II',
 *   requiresWitness: true,
 *   isActive: true,
 *   createdAt: new Date('2025-01-01'),
 *   updatedAt: new Date('2025-01-15')
 * };
 * ```
 */
@Exclude()
export class MedicationResponseDto {
  @Expose()
  @ApiProperty({
    description: 'Unique medication identifier (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Brand or trade name of the medication',
    example: 'Tylenol Extra Strength',
    minLength: 1,
    maxLength: 255,
  })
  name: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Generic (chemical) name of the medication',
    example: 'Acetaminophen',
    maxLength: 255,
  })
  genericName?: string;

  @Expose()
  @ApiProperty({
    description: 'Physical form of the medication (tablet, capsule, liquid, injection, etc.)',
    example: 'Tablet',
    examples: [
      'Tablet',
      'Capsule',
      'Liquid',
      'Solution',
      'Suspension',
      'Injection',
      'Cream',
      'Ointment',
      'Patch',
      'Inhaler',
      'Suppository',
    ],
    maxLength: 255,
  })
  dosageForm: string;

  @Expose()
  @ApiProperty({
    description: 'Strength/concentration of the active ingredient with units',
    example: '500mg',
    examples: ['500mg', '10mg/5mL', '0.5%', '100mcg', '20mg/mL'],
    maxLength: 255,
  })
  strength: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Pharmaceutical manufacturer or distributor name',
    example: 'Johnson & Johnson',
    maxLength: 255,
  })
  manufacturer?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'National Drug Code (NDC) - FDA-assigned product identifier',
    example: '00406-0486-01',
    pattern: '^(\\d{4}-\\d{4}-\\d{2}|\\d{5}-\\d{3}-\\d{2}|\\d{5}-\\d{4}-\\d{1}|\\d{10}|\\d{11})$',
    examples: [
      '1234-5678-90',
      '12345-678-90',
      '12345-6789-0',
      '1234567890',
      '12345678901',
    ],
    maxLength: 14,
  })
  ndc?: string;

  @Expose()
  @ApiProperty({
    description: 'Whether this medication is a DEA-controlled substance requiring special handling',
    example: false,
    default: false,
  })
  isControlled: boolean;

  @Expose()
  @ApiPropertyOptional({
    description: 'DEA controlled substance schedule classification (I-V). Required if isControlled is true.',
    enum: DEASchedule,
    enumName: 'DEASchedule',
    example: 'II',
    examples: ['II', 'III', 'IV', 'V'],
  })
  deaSchedule?: DEASchedule;

  @Expose()
  @ApiProperty({
    description: 'Whether administration requires witness verification (typically Schedule II-III controlled substances)',
    example: false,
    default: false,
  })
  requiresWitness: boolean;

  @Expose()
  @ApiProperty({
    description: 'Whether this medication is currently active in the formulary',
    example: true,
    default: true,
  })
  isActive: boolean;

  @Expose()
  @ApiProperty({
    description: 'Timestamp when the medication record was created',
    type: 'string',
    format: 'date-time',
    example: '2025-01-15T10:30:00Z',
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    description: 'Timestamp when the medication record was last updated',
    type: 'string',
    format: 'date-time',
    example: '2025-01-20T14:45:00Z',
  })
  updatedAt: Date;

  @Expose()
  @ApiPropertyOptional({
    description: 'Timestamp when the medication was soft-deleted (null if active)',
    type: 'string',
    format: 'date-time',
    example: '2025-02-01T09:00:00Z',
    nullable: true,
  })
  deletedAt?: Date;

  @Expose()
  @ApiPropertyOptional({
    description: 'User ID who deleted the medication record',
    format: 'uuid',
    example: '987e6543-e21b-12d3-a456-426614174000',
  })
  deletedBy?: string;
}

/**
 * Lightweight medication summary DTO
 *
 * Provides essential medication information for lists, dropdowns, and
 * quick reference views without the full regulatory metadata.
 *
 * @remarks
 * Use this DTO when:
 * - Populating medication selection dropdowns
 * - Displaying medication lists with minimal data
 * - Reducing payload size for high-volume queries
 * - Showing medication info in compact UI components
 *
 * @example
 * ```typescript
 * const summary: MedicationSummaryDto = {
 *   id: '123e4567-e89b-12d3-a456-426614174000',
 *   name: 'Tylenol Extra Strength',
 *   genericName: 'Acetaminophen',
 *   strength: '500mg',
 *   dosageForm: 'Tablet',
 *   isControlled: false,
 *   isActive: true
 * };
 * ```
 */
@Exclude()
export class MedicationSummaryDto {
  @Expose()
  @ApiProperty({
    description: 'Unique medication identifier (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Brand or trade name of the medication',
    example: 'Tylenol Extra Strength',
  })
  name: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Generic (chemical) name of the medication',
    example: 'Acetaminophen',
  })
  genericName?: string;

  @Expose()
  @ApiProperty({
    description: 'Strength/concentration with units',
    example: '500mg',
  })
  strength: string;

  @Expose()
  @ApiProperty({
    description: 'Physical form of the medication',
    example: 'Tablet',
  })
  dosageForm: string;

  @Expose()
  @ApiProperty({
    description: 'Whether this is a controlled substance',
    example: false,
  })
  isControlled: boolean;

  @Expose()
  @ApiProperty({
    description: 'Whether this medication is currently active',
    example: true,
  })
  isActive: boolean;
}

/**
 * Medication administration log entry response DTO
 *
 * Represents a single medication administration event, including scheduled
 * time, actual administration details, administrator information, and outcome.
 *
 * @remarks
 * This DTO is critical for:
 * - HIPAA-compliant medication administration record (MAR) tracking
 * - Regulatory compliance and audit trails
 * - Clinical documentation of care provided
 * - Tracking medication adherence and missed doses
 *
 * The log includes both successful administrations and documented reasons
 * for non-administration (refusal, contraindication, etc.).
 *
 * @example
 * ```typescript
 * const log: MedicationLogResponseDto = {
 *   id: '456e7890-e89b-12d3-a456-426614174000',
 *   studentId: '789e0123-e89b-12d3-a456-426614174000',
 *   medicationId: '123e4567-e89b-12d3-a456-426614174000',
 *   medication: {
 *     id: '123e4567-e89b-12d3-a456-426614174000',
 *     name: 'Albuterol Inhaler',
 *     genericName: 'Albuterol Sulfate',
 *     strength: '90mcg',
 *     dosageForm: 'Inhaler',
 *     isControlled: false,
 *     isActive: true
 *   },
 *   dosage: 2,
 *   dosageUnit: 'puffs',
 *   route: 'Inhalation',
 *   scheduledAt: new Date('2025-01-15T10:00:00Z'),
 *   administeredAt: new Date('2025-01-15T10:05:00Z'),
 *   administeredBy: '321e4567-e89b-12d3-a456-426614174000',
 *   status: 'ADMINISTERED',
 *   notes: 'Patient used spacer device. No adverse reactions observed.',
 *   createdAt: new Date('2025-01-15T10:05:30Z'),
 *   updatedAt: new Date('2025-01-15T10:05:30Z')
 * };
 * ```
 */
@Exclude()
export class MedicationLogResponseDto {
  @Expose()
  @ApiProperty({
    description: 'Unique medication log entry identifier (UUID)',
    example: '456e7890-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Student/patient identifier (UUID)',
    example: '789e0123-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  studentId: string;

  @Expose()
  @ApiProperty({
    description: 'Medication identifier (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  medicationId: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Medication details (included when populated)',
    type: () => MedicationSummaryDto,
  })
  @Type(() => MedicationSummaryDto)
  medication?: MedicationSummaryDto;

  @Expose()
  @ApiProperty({
    description: 'Dosage amount (numeric value)',
    example: 2,
    type: 'number',
    format: 'decimal',
  })
  dosage: number;

  @Expose()
  @ApiProperty({
    description: 'Unit of measurement for dosage',
    example: 'tablets',
    examples: ['tablets', 'capsules', 'mL', 'mg', 'puffs', 'drops', 'grams'],
  })
  dosageUnit: string;

  @Expose()
  @ApiProperty({
    description: 'Route of administration',
    example: 'Oral',
    examples: [
      'Oral',
      'Sublingual',
      'Inhalation',
      'Topical',
      'Intravenous (IV)',
      'Intramuscular (IM)',
      'Subcutaneous (SubQ)',
      'Rectal',
      'Ophthalmic',
      'Otic',
      'Nasal',
      'Transdermal',
    ],
  })
  route: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Scheduled time for administration (null if PRN/as-needed)',
    type: 'string',
    format: 'date-time',
    example: '2025-01-15T10:00:00Z',
    nullable: true,
  })
  scheduledAt?: Date;

  @Expose()
  @ApiProperty({
    description: 'Actual time medication was administered (or action was taken)',
    type: 'string',
    format: 'date-time',
    example: '2025-01-15T10:05:00Z',
  })
  administeredAt: Date;

  @Expose()
  @ApiProperty({
    description: 'User ID of the staff member who administered or documented the medication',
    example: '321e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  administeredBy: string;

  @Expose()
  @ApiProperty({
    description: 'Status of the medication administration event',
    enum: MedicationLogStatus,
    enumName: 'MedicationLogStatus',
    example: 'ADMINISTERED',
    default: 'ADMINISTERED',
  })
  status: MedicationLogStatus;

  @Expose()
  @ApiPropertyOptional({
    description: 'Clinical notes about administration, patient response, or observations',
    example: 'Patient tolerated medication well. No adverse effects observed.',
  })
  notes?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Reason medication was not administered (required for MISSED, CANCELLED, or REFUSED status)',
    example: 'Patient refused due to nausea',
    examples: [
      'Patient refused',
      'Patient absent from school',
      'Contraindicated due to symptoms',
      'Medication unavailable',
      'Parent/guardian requested hold',
      'Physician order discontinued',
    ],
  })
  reasonNotGiven?: string;

  @Expose()
  @ApiProperty({
    description: 'Timestamp when the log entry was created',
    type: 'string',
    format: 'date-time',
    example: '2025-01-15T10:05:30Z',
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    description: 'Timestamp when the log entry was last updated',
    type: 'string',
    format: 'date-time',
    example: '2025-01-15T10:05:30Z',
  })
  updatedAt: Date;
}

/**
 * Drug interaction information response DTO
 *
 * Represents a potential drug-drug interaction between two medications,
 * including severity classification and clinical recommendations.
 *
 * @remarks
 * Drug interactions are classified by severity:
 * - **MAJOR**: May be life-threatening or cause permanent damage - requires immediate intervention
 * - **MODERATE**: May cause deterioration in patient status - requires monitoring and possible intervention
 * - **MINOR**: Usually mild effects - may require monitoring but typically not intervention
 *
 * This data supports clinical decision-making and medication safety protocols.
 *
 * @example
 * ```typescript
 * const interaction: DrugInteractionResponseDto = {
 *   medication1Id: '123e4567-e89b-12d3-a456-426614174000',
 *   medication1Name: 'Warfarin',
 *   medication2Id: '456e7890-e89b-12d3-a456-426614174000',
 *   medication2Name: 'Aspirin',
 *   severity: 'MAJOR',
 *   description: 'Concurrent use increases risk of bleeding',
 *   clinicalEffect: 'Enhanced anticoagulant effect may lead to serious bleeding complications',
 *   recommendation: 'Monitor INR closely. Consider alternative antiplatelet therapy. Avoid concurrent use if possible.',
 *   references: ['Micromedex Drug Interactions', 'Lexicomp Interaction Monograph']
 * };
 * ```
 */
@Exclude()
export class DrugInteractionResponseDto {
  @Expose()
  @ApiProperty({
    description: 'First medication identifier (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  medication1Id: string;

  @Expose()
  @ApiProperty({
    description: 'Name of the first medication',
    example: 'Warfarin',
  })
  medication1Name: string;

  @Expose()
  @ApiProperty({
    description: 'Second medication identifier (UUID)',
    example: '456e7890-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  medication2Id: string;

  @Expose()
  @ApiProperty({
    description: 'Name of the second medication',
    example: 'Aspirin',
  })
  medication2Name: string;

  @Expose()
  @ApiProperty({
    description: 'Clinical severity of the interaction',
    enum: ['MAJOR', 'MODERATE', 'MINOR'],
    example: 'MAJOR',
    examples: ['MAJOR', 'MODERATE', 'MINOR'],
  })
  severity: 'MAJOR' | 'MODERATE' | 'MINOR';

  @Expose()
  @ApiProperty({
    description: 'Brief description of the interaction mechanism',
    example: 'Concurrent use increases risk of bleeding',
  })
  description: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Detailed clinical effects and patient impact',
    example: 'Enhanced anticoagulant effect may lead to serious bleeding complications including GI bleeding, intracranial hemorrhage, and hematuria.',
  })
  clinicalEffect?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Clinical recommendations for managing the interaction',
    example: 'Monitor INR closely if concurrent use is necessary. Consider alternative antiplatelet therapy. Educate patient on bleeding precautions.',
  })
  recommendation?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Evidence level or documentation status',
    enum: ['ESTABLISHED', 'PROBABLE', 'THEORETICAL'],
    example: 'ESTABLISHED',
  })
  evidenceLevel?: 'ESTABLISHED' | 'PROBABLE' | 'THEORETICAL';

  @Expose()
  @ApiPropertyOptional({
    description: 'References to clinical literature or drug interaction databases',
    type: [String],
    example: ['Micromedex Drug Interactions', 'Lexicomp Interaction Monograph'],
  })
  references?: string[];
}

/**
 * Paginated medication list response DTO
 *
 * Standard pagination wrapper for medication lists with metadata.
 *
 * @remarks
 * Extends the base {@link PaginatedResponseDto} with medication-specific typing.
 * Includes pagination metadata (page, limit, total, etc.) along with the data array.
 *
 * @example
 * ```typescript
 * const response: MedicationListResponseDto = {
 *   data: [medication1, medication2, medication3],
 *   meta: {
 *     page: 1,
 *     limit: 20,
 *     total: 150,
 *     pages: 8,
 *     hasNext: true,
 *     hasPrev: false,
 *     nextPage: 2,
 *     prevPage: null
 *   }
 * };
 * ```
 */
export class MedicationListResponseDto extends PaginatedResponseDto<MedicationResponseDto> {
  @ApiProperty({
    description: 'Array of medication records for the current page',
    type: [MedicationResponseDto],
    isArray: true,
  })
  @Type(() => MedicationResponseDto)
  data: MedicationResponseDto[];
}

/**
 * Paginated medication log list response DTO
 *
 * Standard pagination wrapper for medication administration logs.
 *
 * @remarks
 * Used for medication administration record (MAR) queries, audit trails,
 * and compliance reporting.
 *
 * @example
 * ```typescript
 * const response: MedicationLogListResponseDto = {
 *   data: [log1, log2, log3],
 *   meta: {
 *     page: 1,
 *     limit: 50,
 *     total: 500,
 *     pages: 10,
 *     hasNext: true,
 *     hasPrev: false,
 *     nextPage: 2,
 *     prevPage: null
 *   }
 * };
 * ```
 */
export class MedicationLogListResponseDto extends PaginatedResponseDto<MedicationLogResponseDto> {
  @ApiProperty({
    description: 'Array of medication log entries for the current page',
    type: [MedicationLogResponseDto],
    isArray: true,
  })
  @Type(() => MedicationLogResponseDto)
  data: MedicationLogResponseDto[];
}

// ============================================================================
// MAPPER FUNCTIONS
// ============================================================================

/**
 * Maps a Medication model instance to MedicationResponseDto
 *
 * Transforms Sequelize model data into a standardized response DTO,
 * handling type conversions and field mapping.
 *
 * @param medication - Medication model instance from database
 * @returns Formatted medication response DTO
 *
 * @example
 * ```typescript
 * const medicationModel = await Medication.findByPk(id);
 * const response = toMedicationResponseDto(medicationModel);
 * ```
 */
export function toMedicationResponseDto(medication: any): MedicationResponseDto {
  return {
    id: medication.id,
    name: medication.name,
    genericName: medication.genericName,
    dosageForm: medication.dosageForm,
    strength: medication.strength,
    manufacturer: medication.manufacturer,
    ndc: medication.ndc,
    isControlled: medication.isControlled,
    deaSchedule: medication.deaSchedule,
    requiresWitness: medication.requiresWitness,
    isActive: medication.isActive,
    createdAt: medication.createdAt,
    updatedAt: medication.updatedAt,
    deletedAt: medication.deletedAt,
    deletedBy: medication.deletedBy,
  };
}

/**
 * Maps a Medication model instance to MedicationSummaryDto
 *
 * Creates a lightweight medication summary with essential fields only.
 *
 * @param medication - Medication model instance from database
 * @returns Lightweight medication summary DTO
 *
 * @example
 * ```typescript
 * const medications = await Medication.findAll();
 * const summaries = medications.map(toMedicationSummaryDto);
 * ```
 */
export function toMedicationSummaryDto(medication: any): MedicationSummaryDto {
  return {
    id: medication.id,
    name: medication.name,
    genericName: medication.genericName,
    strength: medication.strength,
    dosageForm: medication.dosageForm,
    isControlled: medication.isControlled,
    isActive: medication.isActive,
  };
}

/**
 * Maps a MedicationLog model instance to MedicationLogResponseDto
 *
 * Transforms medication administration log data into standardized response format,
 * optionally including related medication details.
 *
 * @param log - MedicationLog model instance from database
 * @returns Formatted medication log response DTO
 *
 * @example
 * ```typescript
 * const log = await MedicationLog.findByPk(id, {
 *   include: [{ model: Medication, as: 'medication' }]
 * });
 * const response = toMedicationLogResponseDto(log);
 * ```
 */
export function toMedicationLogResponseDto(log: any): MedicationLogResponseDto {
  return {
    id: log.id,
    studentId: log.studentId,
    medicationId: log.medicationId,
    medication: log.medication ? toMedicationSummaryDto(log.medication) : undefined,
    dosage: log.dosage,
    dosageUnit: log.dosageUnit,
    route: log.route,
    scheduledAt: log.scheduledAt,
    administeredAt: log.administeredAt,
    administeredBy: log.administeredBy,
    status: log.status,
    notes: log.notes,
    reasonNotGiven: log.reasonNotGiven,
    createdAt: log.createdAt,
    updatedAt: log.updatedAt,
  };
}

/**
 * Creates a paginated medication list response
 *
 * Combines medication data array with pagination metadata into standardized response.
 *
 * @param medications - Array of Medication model instances
 * @param page - Current page number (1-indexed)
 * @param limit - Items per page
 * @param total - Total number of items across all pages
 * @returns Paginated medication list response
 *
 * @example
 * ```typescript
 * const { rows, count } = await Medication.findAndCountAll({
 *   offset: (page - 1) * limit,
 *   limit
 * });
 * const response = toMedicationListResponseDto(rows, page, limit, count);
 * ```
 */
export function toMedicationListResponseDto(
  medications: any[],
  page: number,
  limit: number,
  total: number,
): MedicationListResponseDto {
  return PaginatedResponseDto.create({
    data: medications.map(toMedicationResponseDto),
    page,
    limit,
    total,
  });
}

/**
 * Creates a paginated medication log list response
 *
 * Combines medication log data array with pagination metadata into standardized response.
 *
 * @param logs - Array of MedicationLog model instances
 * @param page - Current page number (1-indexed)
 * @param limit - Items per page
 * @param total - Total number of items across all pages
 * @returns Paginated medication log list response
 *
 * @example
 * ```typescript
 * const { rows, count } = await MedicationLog.findAndCountAll({
 *   where: { studentId },
 *   include: [{ model: Medication, as: 'medication' }],
 *   offset: (page - 1) * limit,
 *   limit,
 *   order: [['administeredAt', 'DESC']]
 * });
 * const response = toMedicationLogListResponseDto(rows, page, limit, count);
 * ```
 */
export function toMedicationLogListResponseDto(
  logs: any[],
  page: number,
  limit: number,
  total: number,
): MedicationLogListResponseDto {
  return PaginatedResponseDto.create({
    data: logs.map(toMedicationLogResponseDto),
    page,
    limit,
    total,
  });
}

/**
 * Creates a drug interaction response DTO
 *
 * Formats drug interaction data for API responses.
 *
 * @param params - Drug interaction parameters
 * @returns Formatted drug interaction response
 *
 * @example
 * ```typescript
 * const interaction = createDrugInteractionDto({
 *   medication1: med1,
 *   medication2: med2,
 *   severity: 'MAJOR',
 *   description: 'Increased bleeding risk',
 *   clinicalEffect: 'Enhanced anticoagulation',
 *   recommendation: 'Monitor INR closely'
 * });
 * ```
 */
export function createDrugInteractionDto(params: {
  medication1: any;
  medication2: any;
  severity: 'MAJOR' | 'MODERATE' | 'MINOR';
  description: string;
  clinicalEffect?: string;
  recommendation?: string;
  evidenceLevel?: 'ESTABLISHED' | 'PROBABLE' | 'THEORETICAL';
  references?: string[];
}): DrugInteractionResponseDto {
  return {
    medication1Id: params.medication1.id,
    medication1Name: params.medication1.name,
    medication2Id: params.medication2.id,
    medication2Name: params.medication2.name,
    severity: params.severity,
    description: params.description,
    clinicalEffect: params.clinicalEffect,
    recommendation: params.recommendation,
    evidenceLevel: params.evidenceLevel,
    references: params.references,
  };
}
