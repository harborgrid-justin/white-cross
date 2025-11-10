/**
 * FERPA Request DTOs for compliance domain
 * Handles FERPA-related requests, waivers, and access authorization
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsArray,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsDate,
  IsBoolean,
  IsEmail,
  Min,
} from 'class-validator';

export enum FERPARequestType {
  ACCESS_RECORD = 'access_record',
  AMENDMENT_REQUEST = 'amendment_request',
  DISCLOSURE_REQUEST = 'disclosure_request',
  FERPA_WAIVER = 'ferpa_waiver',
  COMPLAINT = 'complaint',
}

export enum DisclosureType {
  PARENT_GUARDIAN = 'parent_guardian',
  THIRD_PARTY = 'third_party',
  FINANCIAL_AID = 'financial_aid',
  LEGITIMATE_EDUCATIONAL_INTEREST = 'legitimate_educational_interest',
  EMERGENCY = 'emergency',
  LAW_ENFORCEMENT = 'law_enforcement',
}

export enum RequestStatus {
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  DENIED = 'denied',
  INCOMPLETE = 'incomplete',
}

/**
 * FERPA record access request DTO
 */
export class FERPARecordAccessRequestDto {
  @ApiProperty({
    description: 'Request ID',
    example: 'FERPA-REQ-2025001',
  })
  @IsString()
  @IsNotEmpty()
  requestId: string;

  @ApiProperty({
    description: 'Student ID requesting access',
    example: 'STU-2025001',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Request type',
    enum: FERPARequestType,
    example: FERPARequestType.ACCESS_RECORD,
  })
  @IsEnum(FERPARequestType)
  requestType: FERPARequestType;

  @ApiPropertyOptional({
    description: 'Records to access',
    type: [String],
    example: ['Transcript', 'Financial Aid File', 'Disciplinary Record'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  recordsRequested?: string[];

  @ApiProperty({
    description: 'Request submission date',
    example: '2025-11-10',
  })
  @IsDate()
  @Type(() => Date)
  submissionDate: Date;

  @ApiProperty({
    description: 'Request status',
    enum: RequestStatus,
    example: RequestStatus.UNDER_REVIEW,
  })
  @IsEnum(RequestStatus)
  status: RequestStatus;

  @ApiPropertyOptional({
    description: 'Expected completion date',
    example: '2025-11-17',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expectedCompletionDate?: Date;

  @ApiPropertyOptional({
    description: 'Preferred method of access/delivery',
    enum: ['in_person', 'email', 'mail', 'digital_portal'],
    example: 'email',
  })
  @IsOptional()
  @IsEnum(['in_person', 'email', 'mail', 'digital_portal'])
  preferredMethod?: string;

  @ApiPropertyOptional({
    description: 'Purpose of access request',
    example: 'Personal review and verification',
  })
  @IsOptional()
  @IsString()
  purposeOfAccess?: string;

  @ApiPropertyOptional({
    description: 'Contact email for updates',
    example: 'student@example.com',
  })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiPropertyOptional({
    description: 'Processing notes',
    example: 'Records compiled and ready for pickup',
  })
  @IsOptional()
  @IsString()
  processingNotes?: string;
}

/**
 * FERPA amendment request DTO
 */
export class FERPAAmendmentRequestDto {
  @ApiProperty({
    description: 'Amendment request ID',
    example: 'FERPA-AMEND-2025001',
  })
  @IsString()
  @IsNotEmpty()
  requestId: string;

  @ApiProperty({
    description: 'Student ID',
    example: 'STU-2025001',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Record/field being amended',
    example: 'Grade in CS101',
  })
  @IsString()
  @IsNotEmpty()
  recordBeingAmended: string;

  @ApiProperty({
    description: 'Current value in record',
    example: 'B+',
  })
  @IsString()
  @IsNotEmpty()
  currentValue: string;

  @ApiProperty({
    description: 'Requested correction/change',
    example: 'A-',
  })
  @IsString()
  @IsNotEmpty()
  requestedChange: string;

  @ApiProperty({
    description: 'Reason for amendment request',
    example: 'Grade was incorrectly calculated, should be A- per course syllabus',
  })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({
    description: 'Supporting evidence',
    type: [String],
    example: ['Exam score sheet', 'Grade calculation spreadsheet'],
  })
  @IsArray()
  @IsString({ each: true })
  supportingEvidence: string[];

  @ApiProperty({
    description: 'Request status',
    enum: RequestStatus,
    example: RequestStatus.UNDER_REVIEW,
  })
  @IsEnum(RequestStatus)
  status: RequestStatus;

  @ApiPropertyOptional({
    description: 'Date submitted',
    example: '2025-11-05',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  submissionDate?: Date;

  @ApiPropertyOptional({
    description: 'Reviewed by (faculty/staff)',
    example: 'Dr. James Johnson',
  })
  @IsOptional()
  @IsString()
  reviewedBy?: string;

  @ApiPropertyOptional({
    description: 'Review date',
    example: '2025-11-08',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  reviewDate?: Date;

  @ApiPropertyOptional({
    description: 'Review outcome/decision',
    example: 'Amendment approved - grade corrected to A-',
  })
  @IsOptional()
  @IsString()
  reviewOutcome?: string;

  @ApiPropertyOptional({
    description: 'Date correction implemented',
    example: '2025-11-09',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  implementationDate?: Date;
}

/**
 * FERPA disclosure authorization DTO
 */
export class FERPADisclosureAuthorizationDto {
  @ApiProperty({
    description: 'Disclosure authorization ID',
    example: 'FERPA-DISC-2025001',
  })
  @IsString()
  @IsNotEmpty()
  authorizationId: string;

  @ApiProperty({
    description: 'Student ID authorizing disclosure',
    example: 'STU-2025001',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Type of disclosure',
    enum: DisclosureType,
    example: DisclosureType.PARENT_GUARDIAN,
  })
  @IsEnum(DisclosureType)
  disclosureType: DisclosureType;

  @ApiPropertyOptional({
    description: 'Recipient of disclosed information',
    example: 'Parent/Guardian Name',
  })
  @IsOptional()
  @IsString()
  recipientName?: string;

  @ApiPropertyOptional({
    description: 'Recipient relationship to student',
    example: 'Parent',
  })
  @IsOptional()
  @IsString()
  recipientRelationship?: string;

  @ApiProperty({
    description: 'Records/information to be disclosed',
    type: [String],
    example: ['Academic Records', 'Financial Aid Information'],
  })
  @IsArray()
  @IsString({ each: true })
  recordsIncluded: string[];

  @ApiProperty({
    description: 'Authorization effective date',
    example: '2025-11-10',
  })
  @IsDate()
  @Type(() => Date)
  effectiveDate: Date;

  @ApiPropertyOptional({
    description: 'Authorization expiration date',
    example: '2025-12-31',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expirationDate?: Date;

  @ApiProperty({
    description: 'Authorization is active',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Method of disclosure',
    enum: ['phone', 'email', 'mail', 'in_person', 'portal'],
    example: 'email',
  })
  @IsOptional()
  @IsEnum(['phone', 'email', 'mail', 'in_person', 'portal'])
  disclosureMethod?: string;

  @ApiPropertyOptional({
    description: 'Disclosure date (if completed)',
    example: '2025-11-10',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  disclosureDate?: Date;

  @ApiPropertyOptional({
    description: 'Restriction or special conditions',
    example: 'For financial aid purposes only',
  })
  @IsOptional()
  @IsString()
  restrictions?: string;
}

/**
 * FERPA waiver DTO
 */
export class FERPAWaiverDto {
  @ApiProperty({
    description: 'Waiver ID',
    example: 'FERPA-WAIVER-2025001',
  })
  @IsString()
  @IsNotEmpty()
  waiverId: string;

  @ApiProperty({
    description: 'Student ID signing waiver',
    example: 'STU-2025001',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Type of waiver',
    enum: ['recommendation_letter', 'employment_reference', 'broad_disclosure'],
    example: 'recommendation_letter',
  })
  @IsEnum(['recommendation_letter', 'employment_reference', 'broad_disclosure'])
  waiverType: string;

  @ApiPropertyOptional({
    description: 'Recipient of recommendation/information',
    example: 'Graduate Program, University XYZ',
  })
  @IsOptional()
  @IsString()
  recipient?: string;

  @ApiPropertyOptional({
    description: 'Waiver request date',
    example: '2025-11-05',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  requestDate?: Date;

  @ApiProperty({
    description: 'Waiver signature/acceptance date',
    example: '2025-11-06',
  })
  @IsDate()
  @Type(() => Date)
  signatureDate: Date;

  @ApiProperty({
    description: 'Waiver is currently active',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Right to view recommendation waived',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  waivedRightToView?: boolean;

  @ApiPropertyOptional({
    description: 'Notes regarding waiver',
    example: 'Student waived right to view recommendation letter',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Waiver expiration date',
    example: '2028-11-06',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expirationDate?: Date;
}

/**
 * FERPA violation report DTO
 */
export class FERPAViolationReportDto {
  @ApiProperty({
    description: 'Report ID',
    example: 'FERPA-VIOL-2025001',
  })
  @IsString()
  @IsNotEmpty()
  reportId: string;

  @ApiProperty({
    description: 'Date violation discovered',
    example: '2025-11-08',
  })
  @IsDate()
  @Type(() => Date)
  discoveredDate: Date;

  @ApiProperty({
    description: 'Violation description',
    example: 'Student records accidentally sent to wrong email address',
  })
  @IsString()
  @IsNotEmpty()
  violationDescription: string;

  @ApiProperty({
    description: 'Severity level',
    enum: ['minor', 'moderate', 'severe', 'critical'],
    example: 'moderate',
  })
  @IsEnum(['minor', 'moderate', 'severe', 'critical'])
  severity: string;

  @ApiPropertyOptional({
    description: 'Students affected',
    type: [String],
    example: ['STU-2025001', 'STU-2025002'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  studentsAffected?: string[];

  @ApiPropertyOptional({
    description: 'Immediate corrective actions taken',
    type: [String],
    example: ['Retrieved email', 'Notified recipient', 'Disabled account'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  correctiveActionsTaken?: string[];

  @ApiProperty({
    description: 'Reported to FERPA office',
    example: true,
  })
  @IsBoolean()
  reportedToFERPAOffice: boolean;

  @ApiPropertyOptional({
    description: 'Investigation status',
    enum: ['open', 'under_investigation', 'closed'],
    example: 'under_investigation',
  })
  @IsOptional()
  @IsEnum(['open', 'under_investigation', 'closed'])
  investigationStatus?: string;

  @ApiPropertyOptional({
    description: 'Investigated by',
    example: 'FERPA Compliance Officer',
  })
  @IsOptional()
  @IsString()
  investigatedBy?: string;

  @ApiPropertyOptional({
    description: 'Investigation findings',
    example: 'Root cause: Email system misconfiguration in batch process',
  })
  @IsOptional()
  @IsString()
  investigationFindings?: string;

  @ApiPropertyOptional({
    description: 'Preventive measures implemented',
    type: [String],
    example: ['Enhanced email validation', 'Updated batch process logic', 'Additional staff training'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preventiveMeasures?: string[];
}
