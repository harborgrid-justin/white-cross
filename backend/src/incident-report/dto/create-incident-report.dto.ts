import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ComplianceStatus } from '../enums/compliance-status.enum';
import { IncidentSeverity } from '../enums/incident-severity.enum';
import { IncidentType } from '../enums/incident-type.enum';

export class CreateIncidentReportDto {
  @ApiProperty({ description: 'Student ID', example: 'uuid' })
  @IsUUID()
  studentId: string;

  @ApiProperty({ description: 'Reporter user ID', example: 'uuid' })
  @IsUUID()
  reportedById: string;

  @ApiProperty({
    description: 'Type of incident',
    enum: IncidentType,
    example: IncidentType.INJURY,
  })
  @IsEnum(IncidentType)
  type: IncidentType;

  @ApiProperty({
    description: 'Severity level',
    enum: IncidentSeverity,
    example: IncidentSeverity.MEDIUM,
  })
  @IsEnum(IncidentSeverity)
  severity: IncidentSeverity;

  @ApiProperty({
    description:
      'Detailed description of incident (minimum 20 characters, maximum 5000 characters)',
    example: 'Student fell from playground equipment and injured knee',
    minLength: 20,
    maxLength: 5000,
  })
  @IsString()
  @MinLength(20, {
    message:
      'Description must be at least 20 characters for proper documentation',
  })
  @MaxLength(5000, { message: 'Description cannot exceed 5000 characters' })
  description: string;

  @ApiProperty({
    description:
      'Location where incident occurred (minimum 3 characters, maximum 500 characters)',
    example: 'Playground - Main area',
    minLength: 3,
    maxLength: 500,
  })
  @IsString()
  @MinLength(3, {
    message:
      'Location is required for safety documentation (minimum 3 characters)',
  })
  @MaxLength(500, { message: 'Location cannot exceed 500 characters' })
  location: string;

  @ApiPropertyOptional({
    description: 'List of witnesses (each name max 100 characters)',
    example: ['John Doe', 'Jane Smith'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(100, {
    each: true,
    message: 'Each witness name cannot exceed 100 characters',
  })
  witnesses?: string[];

  @ApiProperty({
    description:
      'Actions taken in response (minimum 10 characters, maximum 5000 characters)',
    example: 'First aid applied, ice pack provided, parent notified',
    minLength: 10,
    maxLength: 5000,
  })
  @IsString()
  @MinLength(10, {
    message:
      'Actions taken must be documented for all incidents (minimum 10 characters)',
  })
  @MaxLength(5000, { message: 'Actions taken cannot exceed 5000 characters' })
  actionsTaken: string;

  @ApiProperty({
    description: 'When incident occurred',
    example: '2025-10-28T10:30:00Z',
  })
  @IsDateString()
  occurredAt: Date;

  @ApiPropertyOptional({
    description: 'Whether parent was notified',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  parentNotified?: boolean;

  @ApiPropertyOptional({
    description: 'Whether follow-up is required',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  followUpRequired?: boolean;

  @ApiPropertyOptional({
    description: 'Follow-up notes (maximum 5000 characters)',
    example: 'Monitor for swelling, check tomorrow',
    maxLength: 5000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000, { message: 'Follow-up notes cannot exceed 5000 characters' })
  followUpNotes?: string;

  @ApiPropertyOptional({
    description: 'Attachment URLs (each URL max 2048 characters)',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(2048, {
    each: true,
    message: 'Each attachment URL cannot exceed 2048 characters',
  })
  attachments?: string[];

  @ApiPropertyOptional({
    description: 'Evidence photo URLs (each URL max 2048 characters)',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(2048, {
    each: true,
    message: 'Each evidence photo URL cannot exceed 2048 characters',
  })
  evidencePhotos?: string[];

  @ApiPropertyOptional({
    description: 'Evidence video URLs (each URL max 2048 characters)',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(2048, {
    each: true,
    message: 'Each evidence video URL cannot exceed 2048 characters',
  })
  evidenceVideos?: string[];

  @ApiPropertyOptional({
    description: 'Insurance claim number (maximum 50 characters)',
    example: 'INS-2025-001234',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50, {
    message: 'Insurance claim number cannot exceed 50 characters',
  })
  insuranceClaimNumber?: string;

  @ApiPropertyOptional({
    description: 'Legal compliance status',
    enum: ComplianceStatus,
  })
  @IsOptional()
  @IsEnum(ComplianceStatus)
  legalComplianceStatus?: ComplianceStatus;
}
