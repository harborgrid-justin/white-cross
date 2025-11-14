/**
 * @fileoverview Vaccination Response DTOs
 * @module health-record/vaccination/dto
 * @description Response Data Transfer Objects for vaccination operations with CDC compliance tracking
 *
 * CDC Vaccine Codes Reference: https://www2a.cdc.gov/vaccines/iis/iisstandards/vaccines.asp?rpt=cvx
 *
 * This module provides comprehensive response DTOs for vaccination records including:
 * - Full vaccination records with CDC CVX code compliance
 * - Lot number tracking for vaccine recall management
 * - Schedule compliance tracking against CDC immunization guidelines
 * - Series completion tracking (multi-dose vaccines)
 * - VFC (Vaccines for Children) eligibility tracking
 * - VIS (Vaccine Information Statement) documentation
 * - Exemption status tracking (medical, religious, philosophical)
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  VaccineType,
  SiteOfAdministration,
  RouteOfAdministration,
  ComplianceStatus,
  Vaccination,
} from '@/database/models/vaccination.model';
import { PaginatedResponseDto } from '@/common/dto/paginated-response.dto';

/**
 * Student summary for vaccination response
 * Lightweight student information included in vaccination records
 */
@Exclude()
export class VaccinationStudentSummaryDto {
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
    example: 'Emily',
  })
  firstName: string;

  @Expose()
  @ApiProperty({
    description: 'Student last name',
    example: 'Johnson',
  })
  lastName: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Student date of birth',
    example: '2015-08-15',
    type: 'string',
    format: 'date',
  })
  dateOfBirth?: Date;

  @Expose()
  @ApiPropertyOptional({
    description: 'Student grade level',
    example: '3',
  })
  grade?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Student number or ID',
    example: 'STU-2024-001234',
  })
  studentNumber?: string;
}

/**
 * Administered by user summary
 * Healthcare provider who administered the vaccine
 */
@Exclude()
export class VaccinationAdministeredByDto {
  @Expose()
  @ApiProperty({
    description: 'User unique identifier',
    example: '650e8400-e29b-41d4-a716-446655440001',
    format: 'uuid',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Healthcare provider first name',
    example: 'Sarah',
  })
  firstName: string;

  @Expose()
  @ApiProperty({
    description: 'Healthcare provider last name',
    example: 'Williams',
  })
  lastName: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Provider role or credentials',
    example: 'Registered Nurse',
  })
  role?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Provider email',
    example: 'sarah.williams@schoolhealth.edu',
  })
  email?: string;
}

/**
 * Vaccination summary DTO
 * Lightweight vaccination record for list views and summaries
 */
@Exclude()
export class VaccinationSummaryDto {
  @Expose()
  @ApiProperty({
    description: 'Vaccination record unique identifier',
    example: '750e8400-e29b-41d4-a716-446655440002',
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
    description: 'Vaccine name',
    example: 'COVID-19, mRNA, LNP-S, PF, 30 mcg/0.3 mL dose',
  })
  vaccineName: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Vaccine type classification',
    enum: VaccineType,
    example: VaccineType.COVID_19,
  })
  vaccineType?: VaccineType;

  @Expose()
  @ApiProperty({
    description: 'Date vaccine was administered',
    example: '2024-10-15T14:30:00Z',
    type: 'string',
    format: 'date-time',
  })
  administrationDate: Date;

  @Expose()
  @ApiPropertyOptional({
    description: 'Dose number in vaccination series (e.g., 1 for first dose, 2 for second)',
    example: 1,
    minimum: 1,
  })
  doseNumber?: number;

  @Expose()
  @ApiPropertyOptional({
    description: 'Total number of doses required in series',
    example: 2,
    minimum: 1,
  })
  totalDoses?: number;

  @Expose()
  @ApiProperty({
    description: 'Whether the vaccination series is complete',
    example: false,
  })
  seriesComplete: boolean;

  @Expose()
  @ApiProperty({
    description: 'Compliance status for school requirements',
    enum: ComplianceStatus,
    example: ComplianceStatus.COMPLIANT,
  })
  complianceStatus: ComplianceStatus;

  @Expose()
  @ApiPropertyOptional({
    description: 'Next dose due date for series completion',
    example: '2025-01-15',
    type: 'string',
    format: 'date',
    nullable: true,
  })
  nextDueDate?: Date | null;

  @Expose()
  @ApiProperty({
    description: 'Whether next dose is overdue',
    example: false,
  })
  isOverdue: boolean;

  @Expose()
  @ApiProperty({
    description: 'Record created timestamp',
    example: '2024-10-15T14:35:00Z',
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
}

/**
 * Full vaccination response DTO
 * Complete vaccination record with all fields and associations
 */
@Exclude()
export class VaccinationResponseDto {
  @Expose()
  @ApiProperty({
    description: 'Vaccination record unique identifier',
    example: '750e8400-e29b-41d4-a716-446655440002',
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
  @ApiPropertyOptional({
    description: 'Health record unique identifier if vaccination was part of clinic visit',
    example: '850e8400-e29b-41d4-a716-446655440003',
    format: 'uuid',
    nullable: true,
  })
  healthRecordId?: string | null;

  // Vaccine Identification
  @Expose()
  @ApiProperty({
    description: 'Vaccine name (full descriptive name)',
    example: 'COVID-19, mRNA, LNP-S, PF, 30 mcg/0.3 mL dose',
    maxLength: 200,
  })
  vaccineName: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Vaccine type classification',
    enum: VaccineType,
    example: VaccineType.COVID_19,
  })
  vaccineType?: VaccineType;

  @Expose()
  @ApiPropertyOptional({
    description: 'Vaccine manufacturer',
    example: 'Pfizer-BioNTech',
    maxLength: 100,
  })
  manufacturer?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Vaccine lot number for recall tracking',
    example: 'EK9231',
    maxLength: 50,
  })
  lotNumber?: string;

  // CDC Coding
  @Expose()
  @ApiPropertyOptional({
    description: 'CDC CVX code (Vaccine Administered code) - standardized vaccine identifier. Examples: 03 (MMR), 08 (Hep B), 20 (DTaP), 21 (Varicella), 208 (COVID-19 Pfizer)',
    example: '208',
    maxLength: 10,
  })
  cvxCode?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'NDC code (National Drug Code) - identifies specific vaccine product',
    example: '59267-1000-01',
    maxLength: 20,
  })
  ndcCode?: string;

  // Series Tracking
  @Expose()
  @ApiPropertyOptional({
    description: 'Dose number in vaccination series (e.g., 1 for first dose, 2 for second)',
    example: 1,
    minimum: 1,
  })
  doseNumber?: number;

  @Expose()
  @ApiPropertyOptional({
    description: 'Total number of doses required in series',
    example: 2,
    minimum: 1,
  })
  totalDoses?: number;

  @Expose()
  @ApiProperty({
    description: 'Whether the vaccination series is complete',
    example: false,
  })
  seriesComplete: boolean;

  @Expose()
  @ApiPropertyOptional({
    description: 'Series completion percentage (0-100)',
    example: 50,
    minimum: 0,
    maximum: 100,
    nullable: true,
  })
  seriesCompletionPercentage?: number | null;

  // Administration Details
  @Expose()
  @ApiProperty({
    description: 'Date and time vaccine was administered',
    example: '2024-10-15T14:30:00Z',
    type: 'string',
    format: 'date-time',
  })
  administrationDate: Date;

  @Expose()
  @ApiProperty({
    description: 'Name of person who administered vaccine',
    example: 'Sarah Williams, RN',
    maxLength: 200,
  })
  administeredBy: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Role or credentials of administrator (RN, MD, NP, PA, LPN)',
    example: 'RN',
    maxLength: 50,
  })
  administeredByRole?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Facility where vaccine was administered',
    example: 'Lincoln Elementary School Health Office',
    maxLength: 200,
  })
  facility?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Body site where vaccine was administered',
    enum: SiteOfAdministration,
    example: SiteOfAdministration.DELTOID_LEFT,
    enumName: 'SiteOfAdministration',
  })
  siteOfAdministration?: SiteOfAdministration;

  @Expose()
  @ApiPropertyOptional({
    description: 'Route of administration - method by which vaccine was given',
    enum: RouteOfAdministration,
    example: RouteOfAdministration.INTRAMUSCULAR,
    enumName: 'RouteOfAdministration',
  })
  routeOfAdministration?: RouteOfAdministration;

  @Expose()
  @ApiPropertyOptional({
    description: 'Dosage amount administered',
    example: '0.5 mL',
    maxLength: 50,
  })
  dosageAmount?: string;

  // Dates
  @Expose()
  @ApiPropertyOptional({
    description: 'Vaccine expiration date (for expired vaccine tracking and quality control)',
    example: '2025-12-31',
    type: 'string',
    format: 'date',
    nullable: true,
  })
  expirationDate?: Date | null;

  @Expose()
  @ApiPropertyOptional({
    description: 'Next dose due date for series completion',
    example: '2025-01-15',
    type: 'string',
    format: 'date',
    nullable: true,
  })
  nextDueDate?: Date | null;

  @Expose()
  @ApiPropertyOptional({
    description: 'Days until next dose (negative if overdue)',
    example: 45,
    nullable: true,
  })
  daysUntilNextDose?: number | null;

  @Expose()
  @ApiProperty({
    description: 'Whether next dose is overdue',
    example: false,
  })
  isOverdue: boolean;

  // Reactions and Adverse Events
  @Expose()
  @ApiPropertyOptional({
    description: 'Any reactions to the vaccine observed',
    example: 'Mild soreness at injection site for 24 hours',
  })
  reactions?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Adverse events (structured data for VAERS reporting)',
    example: {
      type: 'LOCAL_REACTION',
      severity: 'MILD',
      onset: '2024-10-15T18:00:00Z',
      duration: '24 hours',
      description: 'Injection site soreness',
    },
    type: 'object',
  })
  adverseEvents?: Record<string, any>;

  // Exemption Status
  @Expose()
  @ApiProperty({
    description: 'Whether student has medical or religious exemption for this vaccine',
    example: false,
  })
  exemptionStatus: boolean;

  @Expose()
  @ApiPropertyOptional({
    description: 'Reason for exemption if applicable',
    example: 'Medical exemption - severe allergic reaction to vaccine components',
  })
  exemptionReason?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Exemption document URL or file reference',
    example: 'exemptions/medical-550e8400.pdf',
    maxLength: 500,
  })
  exemptionDocument?: string;

  // Compliance
  @Expose()
  @ApiProperty({
    description: 'Compliance status for school requirements',
    enum: ComplianceStatus,
    example: ComplianceStatus.COMPLIANT,
    enumName: 'ComplianceStatus',
  })
  complianceStatus: ComplianceStatus;

  // VFC and VIS (Federal Program Compliance)
  @Expose()
  @ApiProperty({
    description: 'VFC (Vaccines for Children) program eligibility - federally funded vaccine program for eligible children',
    example: false,
  })
  vfcEligibility: boolean;

  @Expose()
  @ApiProperty({
    description: 'Whether VIS (Vaccine Information Statement) was provided to parent/guardian - required by federal law',
    example: true,
  })
  visProvided: boolean;

  @Expose()
  @ApiPropertyOptional({
    description: 'Date VIS was provided to parent/guardian',
    example: '2024-10-15',
    type: 'string',
    format: 'date',
    nullable: true,
  })
  visDate?: Date | null;

  // Consent
  @Expose()
  @ApiProperty({
    description: 'Whether parental/guardian consent was obtained',
    example: true,
  })
  consentObtained: boolean;

  @Expose()
  @ApiPropertyOptional({
    description: 'Name of person who provided consent (parent/guardian)',
    example: 'Jennifer Johnson (Mother)',
    maxLength: 200,
  })
  consentBy?: string;

  // Additional Information
  @Expose()
  @ApiPropertyOptional({
    description: 'Additional clinical notes or observations',
    example: 'Patient tolerated vaccine well. No immediate adverse reactions observed.',
  })
  notes?: string;

  // Audit Fields
  @Expose()
  @ApiPropertyOptional({
    description: 'User ID who created this record',
    example: '650e8400-e29b-41d4-a716-446655440001',
    format: 'uuid',
  })
  createdBy?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'User ID who last updated this record',
    example: '650e8400-e29b-41d4-a716-446655440001',
    format: 'uuid',
  })
  updatedBy?: string;

  @Expose()
  @ApiProperty({
    description: 'Record created timestamp',
    example: '2024-10-15T14:35:00Z',
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    description: 'Record last updated timestamp',
    example: '2024-10-15T14:35:00Z',
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;

  @Expose()
  @ApiPropertyOptional({
    description: 'Record soft-delete timestamp (null if not deleted)',
    example: null,
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  deletedAt?: Date | null;

  // Associations
  @Expose()
  @Type(() => VaccinationStudentSummaryDto)
  @ApiPropertyOptional({
    description: 'Student information',
    type: () => VaccinationStudentSummaryDto,
  })
  student?: VaccinationStudentSummaryDto;

  @Expose()
  @Type(() => VaccinationAdministeredByDto)
  @ApiPropertyOptional({
    description: 'Healthcare provider who administered the vaccine',
    type: () => VaccinationAdministeredByDto,
  })
  administeredByUser?: VaccinationAdministeredByDto;
}

/**
 * CDC schedule compliance DTO
 * Tracks compliance with CDC recommended immunization schedule
 */
@Exclude()
export class CDCScheduleComplianceDto {
  @Expose()
  @ApiProperty({
    description: 'Student unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  studentId: string;

  @Expose()
  @ApiProperty({
    description: 'Student full name',
    example: 'Emily Johnson',
  })
  studentName: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Student date of birth',
    example: '2015-08-15',
    type: 'string',
    format: 'date',
  })
  dateOfBirth?: Date;

  @Expose()
  @ApiProperty({
    description: 'Student age in months (for CDC schedule calculations)',
    example: 110,
    minimum: 0,
  })
  ageInMonths: number;

  @Expose()
  @ApiProperty({
    description: 'Overall compliance status',
    example: true,
  })
  isCompliant: boolean;

  @Expose()
  @ApiProperty({
    description: 'Overall compliance percentage (0-100)',
    example: 85,
    minimum: 0,
    maximum: 100,
  })
  compliancePercentage: number;

  @Expose()
  @ApiProperty({
    description: 'List of vaccines that are missing or incomplete',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        vaccineName: { type: 'string', example: 'DTaP' },
        vaccineType: { type: 'string', enum: Object.values(VaccineType), example: VaccineType.DTAP },
        requiredDoses: { type: 'number', example: 5 },
        completedDoses: { type: 'number', example: 3 },
        nextDoseNumber: { type: 'number', example: 4 },
        recommendedDueDate: { type: 'string', format: 'date', example: '2024-12-15' },
        status: { type: 'string', enum: ['NOT_STARTED', 'IN_PROGRESS', 'OVERDUE'], example: 'IN_PROGRESS' },
        daysOverdue: { type: 'number', example: 0, nullable: true },
      },
    },
  })
  missingVaccines: Array<{
    vaccineName: string;
    vaccineType?: VaccineType;
    requiredDoses: number;
    completedDoses: number;
    nextDoseNumber: number;
    recommendedDueDate?: Date;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'OVERDUE';
    daysOverdue?: number;
  }>;

  @Expose()
  @ApiProperty({
    description: 'List of vaccines with upcoming doses due',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        vaccineName: { type: 'string', example: 'Hepatitis B' },
        vaccineType: { type: 'string', enum: Object.values(VaccineType), example: VaccineType.HEPATITIS_B },
        nextDoseNumber: { type: 'number', example: 3 },
        totalDoses: { type: 'number', example: 3 },
        dueDate: { type: 'string', format: 'date', example: '2024-12-01' },
        daysUntilDue: { type: 'number', example: 30 },
      },
    },
  })
  upcomingVaccines: Array<{
    vaccineName: string;
    vaccineType?: VaccineType;
    nextDoseNumber: number;
    totalDoses: number;
    dueDate?: Date;
    daysUntilDue: number;
  }>;

  @Expose()
  @ApiProperty({
    description: 'List of vaccines with completed series',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        vaccineName: { type: 'string', example: 'MMR' },
        vaccineType: { type: 'string', enum: Object.values(VaccineType), example: VaccineType.MMR },
        requiredDoses: { type: 'number', example: 2 },
        completedDoses: { type: 'number', example: 2 },
        lastAdministered: { type: 'string', format: 'date', example: '2023-06-15' },
      },
    },
  })
  completeVaccines: Array<{
    vaccineName: string;
    vaccineType?: VaccineType;
    requiredDoses: number;
    completedDoses: number;
    lastAdministered: Date;
  }>;

  @Expose()
  @ApiProperty({
    description: 'List of vaccines with exemptions',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        vaccineName: { type: 'string', example: 'Varicella' },
        vaccineType: { type: 'string', enum: Object.values(VaccineType), example: VaccineType.VARICELLA },
        exemptionReason: { type: 'string', example: 'Medical exemption - severe allergic reaction' },
        exemptionType: { type: 'string', enum: ['MEDICAL', 'RELIGIOUS', 'PHILOSOPHICAL'], example: 'MEDICAL' },
        exemptionDate: { type: 'string', format: 'date', example: '2024-01-15' },
      },
    },
  })
  exemptedVaccines: Array<{
    vaccineName: string;
    vaccineType?: VaccineType;
    exemptionReason: string;
    exemptionType: 'MEDICAL' | 'RELIGIOUS' | 'PHILOSOPHICAL' | 'PERSONAL';
    exemptionDate?: Date;
  }>;

  @Expose()
  @ApiPropertyOptional({
    description: 'Next recommended appointment date for vaccinations',
    example: '2024-12-01',
    type: 'string',
    format: 'date',
    nullable: true,
  })
  nextAppointmentRecommended?: Date | null;

  @Expose()
  @ApiProperty({
    description: 'Compliance report generation timestamp',
    example: '2024-11-14T10:00:00Z',
    type: 'string',
    format: 'date-time',
  })
  reportGeneratedAt: Date;
}

/**
 * Complete immunization record DTO
 * Comprehensive vaccination history for a student
 */
@Exclude()
export class ImmunizationRecordDto {
  @Expose()
  @ApiProperty({
    description: 'Student unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  studentId: string;

  @Expose()
  @Type(() => VaccinationStudentSummaryDto)
  @ApiProperty({
    description: 'Student information',
    type: () => VaccinationStudentSummaryDto,
  })
  student: VaccinationStudentSummaryDto;

  @Expose()
  @ApiProperty({
    description: 'Total number of vaccination records',
    example: 15,
    minimum: 0,
  })
  totalVaccinations: number;

  @Expose()
  @ApiProperty({
    description: 'Total number of completed vaccine series',
    example: 8,
    minimum: 0,
  })
  completedSeries: number;

  @Expose()
  @ApiProperty({
    description: 'Total number of incomplete vaccine series',
    example: 2,
    minimum: 0,
  })
  incompleteSeries: number;

  @Expose()
  @ApiProperty({
    description: 'Total number of overdue vaccinations',
    example: 1,
    minimum: 0,
  })
  overdueCount: number;

  @Expose()
  @ApiProperty({
    description: 'Overall compliance status',
    enum: ComplianceStatus,
    example: ComplianceStatus.PARTIALLY_COMPLIANT,
  })
  overallComplianceStatus: ComplianceStatus;

  @Expose()
  @ApiProperty({
    description: 'Compliance percentage (0-100)',
    example: 85,
    minimum: 0,
    maximum: 100,
  })
  compliancePercentage: number;

  @Expose()
  @Type(() => VaccinationResponseDto)
  @ApiProperty({
    description: 'All vaccination records for the student',
    type: [VaccinationResponseDto],
    isArray: true,
  })
  vaccinations: VaccinationResponseDto[];

  @Expose()
  @Type(() => CDCScheduleComplianceDto)
  @ApiPropertyOptional({
    description: 'CDC schedule compliance details',
    type: () => CDCScheduleComplianceDto,
  })
  cdcCompliance?: CDCScheduleComplianceDto;

  @Expose()
  @ApiProperty({
    description: 'Whether student has any exemptions',
    example: false,
  })
  hasExemptions: boolean;

  @Expose()
  @ApiProperty({
    description: 'Total number of exemptions',
    example: 0,
    minimum: 0,
  })
  exemptionCount: number;

  @Expose()
  @ApiPropertyOptional({
    description: 'Last vaccination date',
    example: '2024-10-15',
    type: 'string',
    format: 'date',
    nullable: true,
  })
  lastVaccinationDate?: Date | null;

  @Expose()
  @ApiPropertyOptional({
    description: 'Next recommended vaccination date',
    example: '2025-01-15',
    type: 'string',
    format: 'date',
    nullable: true,
  })
  nextVaccinationDue?: Date | null;

  @Expose()
  @ApiProperty({
    description: 'Record generated timestamp',
    example: '2024-11-14T10:00:00Z',
    type: 'string',
    format: 'date-time',
  })
  generatedAt: Date;
}

/**
 * Paginated vaccination list response DTO
 * Standard paginated response for vaccination queries
 */
export class VaccinationListResponseDto extends PaginatedResponseDto<VaccinationResponseDto> {
  @ApiProperty({
    description: 'Array of vaccination records for the current page',
    type: [VaccinationResponseDto],
    isArray: true,
  })
  @Type(() => VaccinationResponseDto)
  data: VaccinationResponseDto[];
}

/**
 * Paginated vaccination summary list response DTO
 * Standard paginated response for vaccination summary queries
 */
export class VaccinationSummaryListResponseDto extends PaginatedResponseDto<VaccinationSummaryDto> {
  @ApiProperty({
    description: 'Array of vaccination summary records for the current page',
    type: [VaccinationSummaryDto],
    isArray: true,
  })
  @Type(() => VaccinationSummaryDto)
  data: VaccinationSummaryDto[];
}

/**
 * Mapper Functions
 */

/**
 * Maps a Vaccination model instance to VaccinationResponseDto
 *
 * @param vaccination - Vaccination model instance from database
 * @returns Complete vaccination response DTO
 *
 * @example
 * ```typescript
 * const vaccination = await Vaccination.findByPk(id, {
 *   include: ['student', 'administeredByUser']
 * });
 * const dto = mapToVaccinationResponseDto(vaccination);
 * ```
 */
export function mapToVaccinationResponseDto(
  vaccination: Vaccination,
): VaccinationResponseDto {
  const dto: VaccinationResponseDto = {
    id: vaccination.id,
    studentId: vaccination.studentId,
    healthRecordId: vaccination.healthRecordId || null,
    vaccineName: vaccination.vaccineName,
    vaccineType: vaccination.vaccineType,
    manufacturer: vaccination.manufacturer,
    lotNumber: vaccination.lotNumber,
    cvxCode: vaccination.cvxCode,
    ndcCode: vaccination.ndcCode,
    doseNumber: vaccination.doseNumber,
    totalDoses: vaccination.totalDoses,
    seriesComplete: vaccination.seriesComplete,
    seriesCompletionPercentage: vaccination.getSeriesCompletionPercentage(),
    administrationDate: vaccination.administrationDate,
    administeredBy: vaccination.administeredBy,
    administeredByRole: vaccination.administeredByRole,
    facility: vaccination.facility,
    siteOfAdministration: vaccination.siteOfAdministration,
    routeOfAdministration: vaccination.routeOfAdministration,
    dosageAmount: vaccination.dosageAmount,
    expirationDate: vaccination.expirationDate || null,
    nextDueDate: vaccination.nextDueDate || null,
    daysUntilNextDose: vaccination.getDaysUntilNextDose(),
    isOverdue: vaccination.isOverdue(),
    reactions: vaccination.reactions,
    adverseEvents: vaccination.adverseEvents,
    exemptionStatus: vaccination.exemptionStatus,
    exemptionReason: vaccination.exemptionReason,
    exemptionDocument: vaccination.exemptionDocument,
    complianceStatus: vaccination.complianceStatus,
    vfcEligibility: vaccination.vfcEligibility,
    visProvided: vaccination.visProvided,
    visDate: vaccination.visDate || null,
    consentObtained: vaccination.consentObtained,
    consentBy: vaccination.consentBy,
    notes: vaccination.notes,
    createdBy: vaccination.createdBy,
    updatedBy: vaccination.updatedBy,
    createdAt: vaccination.createdAt!,
    updatedAt: vaccination.updatedAt!,
    deletedAt: vaccination.deletedAt || null,
  };

  // Map student association if included
  if (vaccination.student) {
    dto.student = {
      id: vaccination.student.id,
      firstName: vaccination.student.firstName,
      lastName: vaccination.student.lastName,
      dateOfBirth: vaccination.student.dateOfBirth,
      grade: vaccination.student.grade,
      studentNumber: vaccination.student.studentNumber,
    };
  }

  // Map administeredByUser association if included
  if (vaccination.administeredByUser) {
    dto.administeredByUser = {
      id: vaccination.administeredByUser.id,
      firstName: vaccination.administeredByUser.firstName,
      lastName: vaccination.administeredByUser.lastName,
      role: vaccination.administeredByUser.role,
      email: vaccination.administeredByUser.email,
    };
  }

  return dto;
}

/**
 * Maps a Vaccination model instance to VaccinationSummaryDto
 *
 * @param vaccination - Vaccination model instance from database
 * @returns Lightweight vaccination summary DTO
 *
 * @example
 * ```typescript
 * const vaccinations = await Vaccination.findAll({ limit: 20 });
 * const summaries = vaccinations.map(mapToVaccinationSummaryDto);
 * ```
 */
export function mapToVaccinationSummaryDto(
  vaccination: Vaccination,
): VaccinationSummaryDto {
  return {
    id: vaccination.id,
    studentId: vaccination.studentId,
    vaccineName: vaccination.vaccineName,
    vaccineType: vaccination.vaccineType,
    administrationDate: vaccination.administrationDate,
    doseNumber: vaccination.doseNumber,
    totalDoses: vaccination.totalDoses,
    seriesComplete: vaccination.seriesComplete,
    complianceStatus: vaccination.complianceStatus,
    nextDueDate: vaccination.nextDueDate || null,
    isOverdue: vaccination.isOverdue(),
    createdAt: vaccination.createdAt!,
  };
}

/**
 * Maps array of Vaccination instances to paginated response
 *
 * @param vaccinations - Array of vaccination model instances
 * @param total - Total count of records
 * @param page - Current page number
 * @param limit - Items per page
 * @returns Paginated vaccination list response
 *
 * @example
 * ```typescript
 * const { rows, count } = await Vaccination.findAndCountAll({
 *   offset: query.getOffset(),
 *   limit: query.getLimit(),
 *   include: ['student']
 * });
 * const response = mapToVaccinationListResponseDto(rows, count, query.page, query.limit);
 * ```
 */
export function mapToVaccinationListResponseDto(
  vaccinations: Vaccination[],
  total: number,
  page: number,
  limit: number,
): VaccinationListResponseDto {
  return PaginatedResponseDto.create({
    data: vaccinations.map(mapToVaccinationResponseDto),
    page,
    limit,
    total,
  });
}

/**
 * Maps array of Vaccination instances to paginated summary response
 *
 * @param vaccinations - Array of vaccination model instances
 * @param total - Total count of records
 * @param page - Current page number
 * @param limit - Items per page
 * @returns Paginated vaccination summary list response
 *
 * @example
 * ```typescript
 * const { rows, count } = await Vaccination.findAndCountAll({
 *   offset: query.getOffset(),
 *   limit: query.getLimit()
 * });
 * const response = mapToVaccinationSummaryListResponseDto(rows, count, query.page, query.limit);
 * ```
 */
export function mapToVaccinationSummaryListResponseDto(
  vaccinations: Vaccination[],
  total: number,
  page: number,
  limit: number,
): VaccinationSummaryListResponseDto {
  return PaginatedResponseDto.create({
    data: vaccinations.map(mapToVaccinationSummaryDto),
    page,
    limit,
    total,
  });
}
