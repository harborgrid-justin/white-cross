/**
 * Certification DTOs for registrar domain
 * Manages professional certifications, credentials, and digital badges
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
  IsUrl,
  Min,
} from 'class-validator';

export enum CertificationStatus {
  EARNED = 'earned',
  IN_PROGRESS = 'in_progress',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
  PENDING_VERIFICATION = 'pending_verification',
}

export enum CredentialType {
  CERTIFICATE = 'certificate',
  BADGE = 'badge',
  LICENSE = 'license',
  ENDORSEMENT = 'endorsement',
  COMPLETION = 'completion',
}

/**
 * Professional certification DTO
 */
export class ProfessionalCertificationDto {
  @ApiProperty({
    description: 'Certification ID',
    example: 'CERT-2025001',
  })
  @IsString()
  @IsNotEmpty()
  certificationId: string;

  @ApiProperty({
    description: 'Certification name',
    example: 'AWS Certified Solutions Architect',
  })
  @IsString()
  @IsNotEmpty()
  certificationName: string;

  @ApiProperty({
    description: 'Issuing organization',
    example: 'Amazon Web Services',
  })
  @IsString()
  @IsNotEmpty()
  issuingOrganization: string;

  @ApiProperty({
    description: 'Certification credential type',
    enum: CredentialType,
    example: CredentialType.CERTIFICATE,
  })
  @IsEnum(CredentialType)
  credentialType: CredentialType;

  @ApiProperty({
    description: 'Date earned',
    example: '2025-06-15',
  })
  @IsDate()
  @Type(() => Date)
  dateEarned: Date;

  @ApiPropertyOptional({
    description: 'Expiration date',
    example: '2027-06-15',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expirationDate?: Date;

  @ApiProperty({
    description: 'Certification status',
    enum: CertificationStatus,
    example: CertificationStatus.EARNED,
  })
  @IsEnum(CertificationStatus)
  status: CertificationStatus;

  @ApiPropertyOptional({
    description: 'Credential URL or verification link',
    example: 'https://aws.amazon.com/verification/CERT-2025001',
  })
  @IsOptional()
  @IsUrl()
  credentialUrl?: string;

  @ApiPropertyOptional({
    description: 'Credential ID from issuing organization',
    example: 'AWS-2025-001-ABC123',
  })
  @IsOptional()
  @IsString()
  credentialId?: string;

  @ApiPropertyOptional({
    description: 'Certification description',
    example: 'Demonstrates expertise in designing and deploying AWS infrastructure',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Skills validated by certification',
    type: [String],
    example: ['Cloud Architecture', 'AWS EC2', 'Networking', 'Security'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skillsValidated?: string[];

  @ApiPropertyOptional({
    description: 'Maintenance requirements',
    example: 'Renew every 3 years with continuing education',
  })
  @IsOptional()
  @IsString()
  maintenanceRequirements?: string;
}

/**
 * Digital badge DTO
 */
export class DigitalBadgeDto {
  @ApiProperty({
    description: 'Badge ID',
    example: 'BADGE-2025001',
  })
  @IsString()
  @IsNotEmpty()
  badgeId: string;

  @ApiProperty({
    description: 'Badge name',
    example: 'Data Science Mastery',
  })
  @IsString()
  @IsNotEmpty()
  badgeName: string;

  @ApiProperty({
    description: 'Badge description',
    example: 'Earned for completing advanced data science coursework and projects',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Badge image URL',
    example: 'https://badges.institution.edu/data-science-mastery.png',
  })
  @IsUrl()
  badgeImageUrl: string;

  @ApiProperty({
    description: 'Issuing organization',
    example: 'University of Excellence',
  })
  @IsString()
  @IsNotEmpty()
  issuingOrganization: string;

  @ApiProperty({
    description: 'Date awarded',
    example: '2025-05-20',
  })
  @IsDate()
  @Type(() => Date)
  dateAwarded: Date;

  @ApiPropertyOptional({
    description: 'Badge expiration date',
    example: '2027-05-20',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expirationDate?: Date;

  @ApiProperty({
    description: 'Badge status',
    enum: CertificationStatus,
    example: CertificationStatus.EARNED,
  })
  @IsEnum(CertificationStatus)
  status: CertificationStatus;

  @ApiProperty({
    description: 'OpenBadge compliant URL',
    example: 'https://openbadges.institution.edu/badges/data-science-mastery',
  })
  @IsUrl()
  badgeUrl: string;

  @ApiPropertyOptional({
    description: 'Evidence URLs supporting the badge',
    type: [String],
    example: ['https://portfolio.student.edu/project1'],
  })
  @IsOptional()
  @IsArray()
  @IsUrl({ each: true })
  evidenceUrls?: string[];

  @ApiPropertyOptional({
    description: 'Competencies demonstrated',
    type: [String],
    example: ['Python Programming', 'Machine Learning', 'Data Analysis'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  competencies?: string[];

  @ApiProperty({
    description: 'Badge is shareable on social media',
    example: true,
  })
  @IsBoolean()
  isShareable: boolean;
}

/**
 * Program completion certificate DTO
 */
export class ProgramCertificateDto {
  @ApiProperty({
    description: 'Certificate ID',
    example: 'PROG-CERT-2025001',
  })
  @IsString()
  @IsNotEmpty()
  certificateId: string;

  @ApiProperty({
    description: 'Program name',
    example: 'Graduate Certificate in Artificial Intelligence',
  })
  @IsString()
  @IsNotEmpty()
  programName: string;

  @ApiProperty({
    description: 'Student ID',
    example: 'STU-2025001',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Student name',
    example: 'Maria Garcia',
  })
  @IsString()
  @IsNotEmpty()
  studentName: string;

  @ApiProperty({
    description: 'Completion date',
    example: '2025-11-30',
  })
  @IsDate()
  @Type(() => Date)
  completionDate: Date;

  @ApiPropertyOptional({
    description: 'Program GPA achieved',
    example: 3.88,
  })
  @IsOptional()
  @IsNumber()
  programGpa?: number;

  @ApiPropertyOptional({
    description: 'Cumulative hours completed',
    example: 36,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  hoursCompleted?: number;

  @ApiProperty({
    description: 'Courses completed in program',
    type: [String],
    example: ['AI101', 'ML201', 'NLP301', 'AI402'],
  })
  @IsArray()
  @IsString({ each: true })
  coursesCompleted: string[];

  @ApiPropertyOptional({
    description: 'Honors distinction',
    enum: ['cum_laude', 'magna_cum_laude', 'summa_cum_laude', 'none'],
    example: 'magna_cum_laude',
  })
  @IsOptional()
  @IsEnum(['cum_laude', 'magna_cum_laude', 'summa_cum_laude', 'none'])
  honarSoriety?: string;

  @ApiProperty({
    description: 'Certificate URL for verification',
    example: 'https://certificates.institution.edu/prog-cert-2025001',
  })
  @IsUrl()
  certificateUrl: string;

  @ApiProperty({
    description: 'Certificate is digitally signed',
    example: true,
  })
  @IsBoolean()
  isDigitallySigned: boolean;

  @ApiPropertyOptional({
    description: 'Digital signature verification URL',
    example: 'https://verify.institution.edu/prog-cert-2025001',
  })
  @IsOptional()
  @IsUrl()
  signatureVerificationUrl?: string;
}

/**
 * Certification request DTO
 */
export class CertificationRequestDto {
  @ApiProperty({
    description: 'Student ID',
    example: 'STU-2025001',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Certification type being requested',
    enum: CredentialType,
    example: CredentialType.CERTIFICATE,
  })
  @IsEnum(CredentialType)
  certificationTypeRequested: CredentialType;

  @ApiPropertyOptional({
    description: 'Specific certification or program name',
    example: 'Degree Completion Certificate',
  })
  @IsOptional()
  @IsString()
  certificationName?: string;

  @ApiPropertyOptional({
    description: 'Delivery method',
    enum: ['digital', 'physical', 'both'],
    example: 'digital',
  })
  @IsOptional()
  @IsEnum(['digital', 'physical', 'both'])
  deliveryMethod?: string;

  @ApiPropertyOptional({
    description: 'Number of physical copies if applicable',
    example: 3,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  numberOfCopies?: number;

  @ApiPropertyOptional({
    description: 'Mailing address for physical copies',
    example: '123 Main St, Anytown, USA',
  })
  @IsOptional()
  @IsString()
  mailingAddress?: string;

  @ApiPropertyOptional({
    description: 'Special requests or notes',
    example: 'Rush delivery needed for job application',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Request urgency level',
    enum: ['standard', 'expedited', 'rush'],
    example: 'standard',
  })
  @IsOptional()
  @IsEnum(['standard', 'expedited', 'rush'])
  urgencyLevel?: string;
}

/**
 * Credential verification response DTO
 */
export class CredentialVerificationDto {
  @ApiProperty({
    description: 'Verification ID',
    example: 'VERIFY-2025001',
  })
  @IsString()
  @IsNotEmpty()
  verificationId: string;

  @ApiProperty({
    description: 'Student ID being verified',
    example: 'STU-2025001',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Credential being verified',
    example: 'Bachelor of Science in Computer Science',
  })
  @IsString()
  @IsNotEmpty()
  credential: string;

  @ApiProperty({
    description: 'Verification status',
    enum: ['verified', 'not_found', 'expired', 'revoked'],
    example: 'verified',
  })
  @IsEnum(['verified', 'not_found', 'expired', 'revoked'])
  verificationStatus: string;

  @ApiProperty({
    description: 'Credential is valid and active',
    example: true,
  })
  @IsBoolean()
  isValid: boolean;

  @ApiPropertyOptional({
    description: 'Verification timestamp',
    example: '2025-11-10T12:30:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  verifiedAt?: Date;

  @ApiPropertyOptional({
    description: 'Verification source/institution',
    example: 'National Student Clearinghouse',
  })
  @IsOptional()
  @IsString()
  verificationSource?: string;

  @ApiPropertyOptional({
    description: 'Notes from verifier',
    example: 'Credential successfully matched to institutional records',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
