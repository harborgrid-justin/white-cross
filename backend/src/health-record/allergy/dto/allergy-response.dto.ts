/**
 * @fileoverview Allergy Response DTOs
 * @module health-record/allergy/dto
 * @description Response Data Transfer Objects for allergy records with comprehensive Swagger documentation
 *
 * SAFETY CRITICAL: Allergy data is life-threatening information requiring accurate tracking
 * HIPAA Compliance: All allergy data is Protected Health Information (PHI)
 *
 * Features:
 * - Complete allergy details including EpiPen tracking
 * - Verification workflow support
 * - Medication interaction checking
 * - Computed safety fields (expiration tracking)
 * - Comprehensive Swagger/OpenAPI documentation
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { AllergyType, AllergySeverity, Allergy } from '@/database/models';
import { PaginatedResponseDto } from '@/common/dto/paginated-response.dto';

/**
 * Student Summary DTO
 * Lightweight student information for allergy associations
 *
 * @class StudentSummaryDto
 * @description Minimal student details to avoid circular dependencies and reduce payload size
 */
@Exclude()
export class StudentSummaryDto {
  @Expose()
  @ApiProperty({
    description: 'Student unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Student first name',
    example: 'John',
    maxLength: 100,
  })
  firstName: string;

  @Expose()
  @ApiProperty({
    description: 'Student last name',
    example: 'Doe',
    maxLength: 100,
  })
  lastName: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Student full name (computed)',
    example: 'John Doe',
    readOnly: true,
  })
  fullName?: string;
}

/**
 * Allergy Summary DTO
 * Lightweight allergy information for list views and summaries
 *
 * @class AllergySummaryDto
 * @description Condensed allergy details for performance-optimized list operations
 *
 * Use Cases:
 * - Student allergy quick lists
 * - Emergency alert displays
 * - Dashboard widgets
 * - Search results
 */
@Exclude()
export class AllergySummaryDto {
  @Expose()
  @ApiProperty({
    description: 'Allergy record unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440001',
    format: 'uuid',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Student unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  studentId: string;

  @Expose()
  @ApiProperty({
    description: 'Name or description of the allergen',
    example: 'Peanuts',
    maxLength: 255,
  })
  allergen: string;

  @Expose()
  @ApiProperty({
    description: 'Category/type of allergy',
    enum: AllergyType,
    enumName: 'AllergyType',
    example: AllergyType.FOOD,
  })
  allergyType: AllergyType;

  @Expose()
  @ApiProperty({
    description: 'Severity level of allergic reaction - CRITICAL FOR EMERGENCY RESPONSE',
    enum: AllergySeverity,
    enumName: 'AllergySeverity',
    example: AllergySeverity.LIFE_THREATENING,
  })
  severity: AllergySeverity;

  @Expose()
  @ApiProperty({
    description: 'Whether this allergy requires EpiPen availability - SAFETY CRITICAL',
    example: true,
    default: false,
  })
  epiPenRequired: boolean;

  @Expose()
  @ApiPropertyOptional({
    description: 'EpiPen expiration status - SAFETY CRITICAL: True if expired or expiring soon',
    example: false,
    readOnly: true,
  })
  isEpiPenExpired?: boolean;

  @Expose()
  @ApiProperty({
    description: 'Whether allergy has been verified by healthcare provider',
    example: true,
    default: false,
  })
  verified: boolean;

  @Expose()
  @ApiProperty({
    description: 'Whether allergy is currently active/relevant',
    example: true,
    default: true,
  })
  active: boolean;

  @Expose()
  @ApiProperty({
    description: 'Timestamp when allergy record was created',
    example: '2024-01-15T10:30:00Z',
    type: Date,
  })
  createdAt: Date;
}

/**
 * Allergy Response DTO
 * Complete allergy record with all fields, associations, and computed properties
 *
 * @class AllergyResponseDto
 * @description Full allergy details including EpiPen tracking, verification workflow, and safety computations
 *
 * SAFETY CRITICAL FEATURES:
 * - EpiPen expiration tracking with computed days until expiration
 * - Verification workflow (verified, verifiedBy, verificationDate)
 * - Emergency protocol documentation
 * - Active status for historical tracking
 *
 * HIPAA COMPLIANCE:
 * - All fields contain PHI requiring audit logging
 * - Includes verification chain for legal compliance
 * - Tracks who created/updated records
 */
@Exclude()
export class AllergyResponseDto {
  // ==================== Primary Identification ====================

  @Expose()
  @ApiProperty({
    description: 'Allergy record unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440001',
    format: 'uuid',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Student unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  studentId: string;

  // ==================== Core Allergy Information ====================

  @Expose()
  @ApiProperty({
    description: 'Name or description of the allergen (e.g., specific food, medication, substance)',
    example: 'Peanuts',
    minLength: 1,
    maxLength: 255,
  })
  allergen: string;

  @Expose()
  @ApiProperty({
    description: 'Category/type of allergy for classification and filtering',
    enum: AllergyType,
    enumName: 'AllergyType',
    example: AllergyType.FOOD,
    type: 'string',
  })
  allergyType: AllergyType;

  @Expose()
  @ApiProperty({
    description: 'Severity level of allergic reaction - CRITICAL FOR EMERGENCY RESPONSE AND TRIAGE',
    enum: AllergySeverity,
    enumName: 'AllergySeverity',
    example: AllergySeverity.LIFE_THREATENING,
    type: 'string',
  })
  severity: AllergySeverity;

  // ==================== Clinical Details ====================

  @Expose()
  @ApiPropertyOptional({
    description: 'Detailed description of symptoms experienced during allergic reaction',
    example: 'Hives, difficulty breathing, swelling of throat and tongue, rapid heartbeat',
    maxLength: 2000,
    nullable: true,
  })
  symptoms?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Structured reaction data (JSONB) for complex symptom tracking',
    example: {
      respiratory: ['wheezing', 'difficulty breathing'],
      skin: ['hives', 'rash', 'swelling'],
      cardiovascular: ['rapid heartbeat'],
      gastrointestinal: [],
    },
    type: 'object',
    nullable: true,
  })
  reactions?: any;

  @Expose()
  @ApiPropertyOptional({
    description: 'Treatment administered or recommended for allergic reactions',
    example: 'Administer EpiPen immediately, follow with antihistamines, call 911',
    maxLength: 2000,
    nullable: true,
  })
  treatment?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'SAFETY CRITICAL: Step-by-step emergency protocol to follow during severe reaction',
    example: '1. Administer EpiPen to outer thigh\n2. Call 911 immediately\n3. Keep student lying down\n4. Monitor breathing\n5. Administer second EpiPen after 5-15 minutes if no improvement',
    maxLength: 2000,
    nullable: true,
  })
  emergencyProtocol?: string;

  // ==================== Timeline & Diagnosis ====================

  @Expose()
  @ApiPropertyOptional({
    description: 'Date when allergy symptoms first appeared',
    example: '2020-01-15T00:00:00Z',
    type: Date,
    nullable: true,
  })
  onsetDate?: Date;

  @Expose()
  @ApiPropertyOptional({
    description: 'Date when allergy was officially diagnosed by healthcare provider',
    example: '2020-02-01T00:00:00Z',
    type: Date,
    nullable: true,
  })
  diagnosedDate?: Date;

  @Expose()
  @ApiPropertyOptional({
    description: 'Name and credentials of healthcare provider who diagnosed the allergy',
    example: 'Dr. Jane Smith, MD - Allergist',
    maxLength: 255,
    nullable: true,
  })
  diagnosedBy?: string;

  // ==================== Verification Workflow ====================

  @Expose()
  @ApiProperty({
    description: 'Whether allergy has been verified by qualified healthcare provider - REQUIRED FOR LEGAL COMPLIANCE',
    example: true,
    default: false,
  })
  verified: boolean;

  @Expose()
  @ApiPropertyOptional({
    description: 'UUID of healthcare provider who verified the allergy',
    example: '550e8400-e29b-41d4-a716-446655440002',
    format: 'uuid',
    nullable: true,
  })
  verifiedBy?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Timestamp when allergy was verified - AUTO-SET when verified=true',
    example: '2024-01-15T14:30:00Z',
    type: Date,
    nullable: true,
    readOnly: true,
  })
  verificationDate?: Date;

  // ==================== Status & Lifecycle ====================

  @Expose()
  @ApiProperty({
    description: 'Whether allergy is currently active/relevant (soft delete flag)',
    example: true,
    default: true,
  })
  active: boolean;

  @Expose()
  @ApiPropertyOptional({
    description: 'Additional notes, observations, or special instructions',
    example: 'Severe reaction to even trace amounts. Must avoid all tree nuts.',
    maxLength: 2000,
    nullable: true,
  })
  notes?: string;

  // ==================== EpiPen Tracking (SAFETY CRITICAL) ====================

  @Expose()
  @ApiProperty({
    description: 'SAFETY CRITICAL: Whether this allergy requires EpiPen availability at all times',
    example: true,
    default: false,
  })
  epiPenRequired: boolean;

  @Expose()
  @ApiPropertyOptional({
    description: 'SAFETY CRITICAL: Physical location where EpiPen is stored (required if epiPenRequired=true)',
    example: 'Main Nurse Office, First Aid Kit #3, Shelf B',
    maxLength: 255,
    nullable: true,
  })
  epiPenLocation?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'SAFETY CRITICAL: EpiPen expiration date - MUST BE MONITORED REGULARLY',
    example: '2025-12-31T23:59:59Z',
    type: Date,
    nullable: true,
  })
  epiPenExpiration?: Date;

  @Expose()
  @ApiPropertyOptional({
    description: 'COMPUTED: Whether EpiPen is expired - SAFETY CRITICAL for emergency readiness',
    example: false,
    readOnly: true,
  })
  isEpiPenExpired?: boolean;

  @Expose()
  @ApiPropertyOptional({
    description: 'COMPUTED: Days until EpiPen expiration (negative if expired, null if no EpiPen)',
    example: 90,
    type: 'integer',
    nullable: true,
    readOnly: true,
  })
  daysUntilEpiPenExpiration?: number | null;

  // ==================== Associations ====================

  @Expose()
  @ApiPropertyOptional({
    description: 'Optional link to health record ID for integration',
    example: '550e8400-e29b-41d4-a716-446655440003',
    format: 'uuid',
    nullable: true,
  })
  healthRecordId?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Student associated with this allergy',
    type: () => StudentSummaryDto,
    nullable: true,
  })
  @Type(() => StudentSummaryDto)
  student?: StudentSummaryDto;

  // ==================== Audit Trail ====================

  @Expose()
  @ApiPropertyOptional({
    description: 'UUID of user who created this allergy record',
    example: '550e8400-e29b-41d4-a716-446655440004',
    format: 'uuid',
    nullable: true,
  })
  createdBy?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'UUID of user who last updated this allergy record',
    example: '550e8400-e29b-41d4-a716-446655440005',
    format: 'uuid',
    nullable: true,
  })
  updatedBy?: string;

  @Expose()
  @ApiProperty({
    description: 'Timestamp when allergy record was created',
    example: '2024-01-15T10:30:00Z',
    type: Date,
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    description: 'Timestamp when allergy record was last updated',
    example: '2024-01-15T14:30:00Z',
    type: Date,
  })
  updatedAt: Date;
}

/**
 * Allergy List Response DTO
 * Paginated list of allergies using standard pagination format
 *
 * @class AllergyListResponseDto
 * @description Type-safe wrapper for paginated allergy responses
 *
 * @example
 * // Controller usage:
 * @ApiOkResponse({
 *   description: 'Allergies retrieved successfully',
 *   type: AllergyListResponseDto,
 * })
 * async findAll(): Promise<AllergyListResponseDto> {
 *   // Implementation using PaginatedResponseDto.create()
 * }
 */
export class AllergyListResponseDto extends PaginatedResponseDto<AllergyResponseDto> {
  @ApiProperty({
    description: 'Array of allergy records for the current page',
    type: [AllergyResponseDto],
    isArray: true,
  })
  @Type(() => AllergyResponseDto)
  declare data: AllergyResponseDto[];
}

/**
 * Medication Interaction DTO
 * Individual medication interaction details
 *
 * @class MedicationInteractionDto
 * @description Represents a single medication allergy that may interact with prescribed medication
 */
export class MedicationInteractionDto {
  @ApiProperty({
    description: 'Allergen name (medication) that causes reaction',
    example: 'Penicillin',
  })
  allergen: string;

  @ApiProperty({
    description: 'Severity level of the medication allergy',
    enum: AllergySeverity,
    enumName: 'AllergySeverity',
    example: AllergySeverity.SEVERE,
  })
  severity: AllergySeverity;

  @ApiPropertyOptional({
    description: 'Known reaction/symptoms to this medication',
    example: 'Severe rash, anaphylaxis',
    nullable: true,
  })
  reaction?: string;
}

/**
 * Medication Interaction Response DTO
 * Response from checkMedicationInteractions service method
 *
 * @class MedicationInteractionResponseDto
 * @description SAFETY CRITICAL: Result of checking if a medication conflicts with student allergies
 *
 * Use Case:
 * - Before prescribing or administering any medication
 * - Required safety check for medication logs
 * - Part of emergency treatment protocols
 *
 * @example
 * // Service usage:
 * const result = await allergyService.checkMedicationInteractions(studentId, 'Amoxicillin');
 * if (result.hasInteractions) {
 *   // CRITICAL: Do not administer medication - alert healthcare provider
 *   console.error(`Medication allergy detected: ${result.interactions.length} conflicts`);
 * }
 */
export class MedicationInteractionResponseDto {
  @ApiProperty({
    description: 'SAFETY CRITICAL: Whether any medication allergies were found for this medication',
    example: true,
  })
  hasInteractions: boolean;

  @ApiProperty({
    description: 'Array of medication allergies that conflict with the queried medication',
    type: [MedicationInteractionDto],
    isArray: true,
    example: [
      {
        allergen: 'Penicillin',
        severity: AllergySeverity.SEVERE,
        reaction: 'Severe rash, anaphylaxis',
      },
    ],
  })
  @Type(() => MedicationInteractionDto)
  interactions: MedicationInteractionDto[];
}

// ==================== Mapper Functions ====================

/**
 * Map Allergy model to AllergySummaryDto
 *
 * @param {Allergy} allergy - Sequelize Allergy model instance
 * @returns {AllergySummaryDto} Mapped summary DTO
 *
 * @description Lightweight mapping for list views and performance-critical operations
 */
export function mapToAllergySummaryDto(allergy: Allergy): AllergySummaryDto {
  const dto = new AllergySummaryDto();
  dto.id = allergy.id;
  dto.studentId = allergy.studentId;
  dto.allergen = allergy.allergen;
  dto.allergyType = allergy.allergyType;
  dto.severity = allergy.severity;
  dto.epiPenRequired = allergy.epiPenRequired;
  dto.isEpiPenExpired = allergy.isEpiPenExpired();
  dto.verified = allergy.verified;
  dto.active = allergy.active;
  dto.createdAt = allergy.createdAt;

  return dto;
}

/**
 * Map Allergy model to AllergyResponseDto
 *
 * @param {Allergy} allergy - Sequelize Allergy model instance
 * @returns {AllergyResponseDto} Mapped response DTO with all fields and computed properties
 *
 * @description
 * Complete mapping including:
 * - All base fields
 * - Computed safety fields (isEpiPenExpired, daysUntilEpiPenExpiration)
 * - Nested student association (if loaded)
 * - Full audit trail
 *
 * SAFETY CRITICAL:
 * - Computes EpiPen expiration status
 * - Calculates days until EpiPen expiration
 * - These computed fields are essential for emergency readiness
 */
export function mapToAllergyResponseDto(allergy: Allergy): AllergyResponseDto {
  const dto = new AllergyResponseDto();

  // Primary identification
  dto.id = allergy.id;
  dto.studentId = allergy.studentId;

  // Core allergy information
  dto.allergen = allergy.allergen;
  dto.allergyType = allergy.allergyType;
  dto.severity = allergy.severity;

  // Clinical details
  dto.symptoms = allergy.symptoms;
  dto.reactions = allergy.reactions;
  dto.treatment = allergy.treatment;
  dto.emergencyProtocol = allergy.emergencyProtocol;

  // Timeline & diagnosis
  dto.onsetDate = allergy.onsetDate;
  dto.diagnosedDate = allergy.diagnosedDate;
  dto.diagnosedBy = allergy.diagnosedBy;

  // Verification workflow
  dto.verified = allergy.verified;
  dto.verifiedBy = allergy.verifiedBy;
  dto.verificationDate = allergy.verificationDate;

  // Status & lifecycle
  dto.active = allergy.active;
  dto.notes = allergy.notes;

  // EpiPen tracking (SAFETY CRITICAL)
  dto.epiPenRequired = allergy.epiPenRequired;
  dto.epiPenLocation = allergy.epiPenLocation;
  dto.epiPenExpiration = allergy.epiPenExpiration;

  // COMPUTED SAFETY FIELDS - Call instance methods
  dto.isEpiPenExpired = allergy.isEpiPenExpired();
  dto.daysUntilEpiPenExpiration = allergy.getDaysUntilEpiPenExpiration();

  // Associations
  dto.healthRecordId = allergy.healthRecordId;

  // Map student association if loaded
  if (allergy.student) {
    dto.student = {
      id: allergy.student.id,
      firstName: allergy.student.firstName,
      lastName: allergy.student.lastName,
      fullName: `${allergy.student.firstName} ${allergy.student.lastName}`,
    };
  }

  // Audit trail
  dto.createdBy = allergy.createdBy;
  dto.updatedBy = allergy.updatedBy;
  dto.createdAt = allergy.createdAt;
  dto.updatedAt = allergy.updatedAt;

  return dto;
}

/**
 * Map array of Allergies to AllergySummaryDto array
 *
 * @param {Allergy[]} allergies - Array of Sequelize Allergy model instances
 * @returns {AllergySummaryDto[]} Array of mapped summary DTOs
 */
export function mapToAllergySummaryDtoArray(allergies: Allergy[]): AllergySummaryDto[] {
  return allergies.map(mapToAllergySummaryDto);
}

/**
 * Map array of Allergies to AllergyResponseDto array
 *
 * @param {Allergy[]} allergies - Array of Sequelize Allergy model instances
 * @returns {AllergyResponseDto[]} Array of mapped response DTOs
 */
export function mapToAllergyResponseDtoArray(allergies: Allergy[]): AllergyResponseDto[] {
  return allergies.map(mapToAllergyResponseDto);
}
