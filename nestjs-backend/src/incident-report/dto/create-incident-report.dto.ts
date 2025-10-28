import {
  IsString,
  IsEnum,
  IsUUID,
  IsBoolean,
  IsOptional,
  IsArray,
  MinLength,
  IsDateString,
  ArrayMinSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IncidentType,
  IncidentSeverity,
  ComplianceStatus,
} from '../enums';

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
    description: 'Detailed description of incident (minimum 20 characters)',
    example: 'Student fell from playground equipment and injured knee',
  })
  @IsString()
  @MinLength(20, { message: 'Description must be at least 20 characters for proper documentation' })
  description: string;

  @ApiProperty({
    description: 'Location where incident occurred (minimum 3 characters)',
    example: 'Playground - Main area',
  })
  @IsString()
  @MinLength(3, { message: 'Location is required for safety documentation (minimum 3 characters)' })
  location: string;

  @ApiPropertyOptional({
    description: 'List of witnesses',
    example: ['John Doe', 'Jane Smith'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  witnesses?: string[];

  @ApiProperty({
    description: 'Actions taken in response (minimum 10 characters)',
    example: 'First aid applied, ice pack provided, parent notified',
  })
  @IsString()
  @MinLength(10, { message: 'Actions taken must be documented for all incidents (minimum 10 characters)' })
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
    description: 'Follow-up notes',
    example: 'Monitor for swelling, check tomorrow',
  })
  @IsOptional()
  @IsString()
  followUpNotes?: string;

  @ApiPropertyOptional({
    description: 'Attachment URLs',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];

  @ApiPropertyOptional({
    description: 'Evidence photo URLs',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  evidencePhotos?: string[];

  @ApiPropertyOptional({
    description: 'Evidence video URLs',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  evidenceVideos?: string[];

  @ApiPropertyOptional({
    description: 'Insurance claim number',
    example: 'INS-2025-001234',
  })
  @IsOptional()
  @IsString()
  insuranceClaimNumber?: string;

  @ApiPropertyOptional({
    description: 'Legal compliance status',
    enum: ComplianceStatus,
  })
  @IsOptional()
  @IsEnum(ComplianceStatus)
  legalComplianceStatus?: ComplianceStatus;
}
