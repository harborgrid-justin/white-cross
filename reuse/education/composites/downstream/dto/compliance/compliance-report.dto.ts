/**
 * Compliance Report DTOs for compliance domain
 * Manages regulatory compliance, reporting, and audit documentation
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
  Min,
  Max,
} from 'class-validator';

export enum ComplianceFramework {
  FERPA = 'ferpa',
  HIPAA = 'hipaa',
  GDPR = 'gdpr',
  CCPA = 'ccpa',
  TITLE_IX = 'title_ix',
  ADA = 'ada',
  CLERY = 'clery',
}

export enum ReportStatus {
  DRAFT = 'draft',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  SUBMITTED = 'submitted',
  REJECTED = 'rejected',
}

/**
 * Compliance issue finding DTO
 */
export class ComplianceIssueFindingDto {
  @ApiProperty({
    description: 'Finding ID',
    example: 'FIND-2025001',
  })
  @IsString()
  @IsNotEmpty()
  findingId: string;

  @ApiProperty({
    description: 'Issue title',
    example: 'Unauthorized access to student records',
  })
  @IsString()
  @IsNotEmpty()
  issueTitle: string;

  @ApiProperty({
    description: 'Issue description',
    example: 'System logs indicate improper access to PII data',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Severity level',
    enum: ['critical', 'high', 'medium', 'low'],
    example: 'high',
  })
  @IsEnum(['critical', 'high', 'medium', 'low'])
  severity: string;

  @ApiProperty({
    description: 'Affected compliance framework',
    enum: ComplianceFramework,
    example: ComplianceFramework.FERPA,
  })
  @IsEnum(ComplianceFramework)
  framework: ComplianceFramework;

  @ApiPropertyOptional({
    description: 'Regulatory reference or citation',
    example: '34 CFR 99.3',
  })
  @IsOptional()
  @IsString()
  regulatoryReference?: string;

  @ApiPropertyOptional({
    description: 'Number of records/students affected',
    example: 15,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  recordsAffected?: number;

  @ApiProperty({
    description: 'Date finding discovered',
    example: '2025-10-15',
  })
  @IsDate()
  @Type(() => Date)
  dateDiscovered: Date;

  @ApiPropertyOptional({
    description: 'Recommended corrective actions',
    type: [String],
    example: ['Implement access logging', 'Review user permissions'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  correctiveActions?: string[];

  @ApiPropertyOptional({
    description: 'Target remediation date',
    example: '2025-12-15',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  remediationDeadline?: Date;

  @ApiPropertyOptional({
    description: 'Status of remediation',
    enum: ['pending', 'in_progress', 'complete'],
    example: 'in_progress',
  })
  @IsOptional()
  @IsEnum(['pending', 'in_progress', 'complete'])
  remediationStatus?: string;
}

/**
 * Compliance audit report DTO
 */
export class ComplianceAuditReportDto {
  @ApiProperty({
    description: 'Report ID',
    example: 'REPORT-2025001',
  })
  @IsString()
  @IsNotEmpty()
  reportId: string;

  @ApiProperty({
    description: 'Report title',
    example: 'Annual FERPA Compliance Audit',
  })
  @IsString()
  @IsNotEmpty()
  reportTitle: string;

  @ApiProperty({
    description: 'Audit type',
    enum: ['internal', 'external', 'regulatory', 'self-assessment'],
    example: 'external',
  })
  @IsEnum(['internal', 'external', 'regulatory', 'self-assessment'])
  auditType: string;

  @ApiProperty({
    description: 'Primary compliance framework',
    enum: ComplianceFramework,
    example: ComplianceFramework.FERPA,
  })
  @IsEnum(ComplianceFramework)
  framework: ComplianceFramework;

  @ApiPropertyOptional({
    description: 'Additional frameworks covered',
    type: [String],
    enum: Object.values(ComplianceFramework),
  })
  @IsOptional()
  @IsArray()
  @IsEnum(ComplianceFramework, { each: true })
  additionalFrameworks?: ComplianceFramework[];

  @ApiProperty({
    description: 'Audit period start date',
    example: '2025-01-01',
  })
  @IsDate()
  @Type(() => Date)
  auditPeriodStart: Date;

  @ApiProperty({
    description: 'Audit period end date',
    example: '2025-10-31',
  })
  @IsDate()
  @Type(() => Date)
  auditPeriodEnd: Date;

  @ApiPropertyOptional({
    description: 'Audit conducted by',
    example: 'External Compliance Auditors LLC',
  })
  @IsOptional()
  @IsString()
  auditedBy?: string;

  @ApiProperty({
    description: 'Overall compliance status',
    enum: ['compliant', 'substantially_compliant', 'non_compliant'],
    example: 'substantially_compliant',
  })
  @IsEnum(['compliant', 'substantially_compliant', 'non_compliant'])
  overallStatus: string;

  @ApiProperty({
    description: 'Compliance score',
    example: 87,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  complianceScore: number;

  @ApiProperty({
    description: 'Findings identified',
    type: [ComplianceIssueFindingDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComplianceIssueFindingDto)
  findings: ComplianceIssueFindingDto[];

  @ApiPropertyOptional({
    description: 'Executive summary',
    example: 'Institution demonstrates good compliance practices with minor areas for improvement',
  })
  @IsOptional()
  @IsString()
  executiveSummary?: string;

  @ApiProperty({
    description: 'Report status',
    enum: ReportStatus,
    example: ReportStatus.APPROVED,
  })
  @IsEnum(ReportStatus)
  status: ReportStatus;

  @ApiPropertyOptional({
    description: 'Date report generated',
    example: '2025-11-01',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  generatedDate?: Date;

  @ApiPropertyOptional({
    description: 'Report approved by',
    example: 'Chief Compliance Officer',
  })
  @IsOptional()
  @IsString()
  approvedBy?: string;

  @ApiPropertyOptional({
    description: 'Regulatory submission deadline',
    example: '2025-12-31',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  submissionDeadline?: Date;
}

/**
 * Policy compliance verification DTO
 */
export class PolicyComplianceVerificationDto {
  @ApiProperty({
    description: 'Verification ID',
    example: 'POLICY-VERIFY-2025001',
  })
  @IsString()
  @IsNotEmpty()
  verificationId: string;

  @ApiProperty({
    description: 'Policy name being verified',
    example: 'Data Privacy and Security Policy',
  })
  @IsString()
  @IsNotEmpty()
  policyName: string;

  @ApiProperty({
    description: 'Department or unit',
    example: 'Information Technology',
  })
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty({
    description: 'Policy compliance status',
    enum: ['compliant', 'non_compliant', 'partial_compliance'],
    example: 'compliant',
  })
  @IsEnum(['compliant', 'non_compliant', 'partial_compliance'])
  complianceStatus: string;

  @ApiProperty({
    description: 'Verification date',
    example: '2025-11-10',
  })
  @IsDate()
  @Type(() => Date)
  verificationDate: Date;

  @ApiPropertyOptional({
    description: 'Verified by person/team',
    example: 'Compliance Officer - Jane Smith',
  })
  @IsOptional()
  @IsString()
  verifiedBy?: string;

  @ApiPropertyOptional({
    description: 'Non-compliance areas identified',
    type: [String],
    example: ['Training not completed for 5% of staff', 'One system missing backup encryption'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  nonComplianceAreas?: string[];

  @ApiPropertyOptional({
    description: 'Next verification scheduled date',
    example: '2026-11-10',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  nextVerificationDate?: Date;

  @ApiPropertyOptional({
    description: 'Notes and observations',
    example: 'Overall policy implementation is strong with good documentation',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

/**
 * Regulatory submission DTO
 */
export class RegulatorySubmissionDto {
  @ApiProperty({
    description: 'Submission ID',
    example: 'SUBMIT-2025001',
  })
  @IsString()
  @IsNotEmpty()
  submissionId: string;

  @ApiProperty({
    description: 'Report being submitted',
    example: 'Annual Compliance Certification',
  })
  @IsString()
  @IsNotEmpty()
  reportName: string;

  @ApiProperty({
    description: 'Regulatory body receiving submission',
    example: 'U.S. Department of Education',
  })
  @IsString()
  @IsNotEmpty()
  regulatoryBody: string;

  @ApiProperty({
    description: 'Submission deadline',
    example: '2025-12-31',
  })
  @IsDate()
  @Type(() => Date)
  deadline: Date;

  @ApiProperty({
    description: 'Submission status',
    enum: ['draft', 'ready', 'submitted', 'acknowledged', 'under_review'],
    example: 'submitted',
  })
  @IsEnum(['draft', 'ready', 'submitted', 'acknowledged', 'under_review'])
  status: string;

  @ApiPropertyOptional({
    description: 'Date submitted',
    example: '2025-11-25',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  submissionDate?: Date;

  @ApiPropertyOptional({
    description: 'Submission tracking number from regulator',
    example: 'ED-2025-123456',
  })
  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @ApiPropertyOptional({
    description: 'Required supporting documents',
    type: [String],
    example: ['Audit report', 'Institutional profile', 'Finance statement'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  supportingDocuments?: string[];

  @ApiPropertyOptional({
    description: 'Regulatory feedback or comments',
    example: 'Submission received and under review',
  })
  @IsOptional()
  @IsString()
  regulatoryFeedback?: string;
}
