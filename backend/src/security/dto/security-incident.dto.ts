import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsString,
  IsOptional,
  IsArray,
  IsNotEmpty,
  IsObject,
  IsDateString,
} from 'class-validator';
import {
  SecurityIncidentType,
  IncidentSeverity,
  IncidentStatus,
} from '../enums';

/**
 * DTO for creating security incidents
 */
export class SecurityCreateIncidentDto {
  @ApiProperty({
    enum: SecurityIncidentType,
    description: 'Type of security incident',
  })
  @IsEnum(SecurityIncidentType)
  type: SecurityIncidentType;

  @ApiProperty({
    enum: IncidentSeverity,
    description: 'Severity level of the incident',
  })
  @IsEnum(IncidentSeverity)
  severity: IncidentSeverity;

  @ApiProperty({ description: 'Incident title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Detailed description of the incident' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ description: 'User ID associated with the incident' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ description: 'IP address associated with the incident' })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional({ description: 'User agent string' })
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiPropertyOptional({ description: 'Resource that was accessed' })
  @IsOptional()
  @IsString()
  resourceAccessed?: string;

  @ApiProperty({ description: 'Method of detection' })
  @IsString()
  @IsNotEmpty()
  detectionMethod: string;

  @ApiProperty({ description: 'Indicators that triggered detection', type: [String] })
  @IsArray()
  @IsString({ each: true })
  indicators: string[];

  @ApiPropertyOptional({ description: 'Impact assessment' })
  @IsOptional()
  @IsString()
  impact?: string;

  @ApiPropertyOptional({ 
    description: 'Additional metadata', 
    type: 'object',
    additionalProperties: true
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

/**
 * DTO for updating incident status
 */
export class UpdateIncidentStatusDto {
  @ApiProperty({
    enum: IncidentStatus,
    description: 'New status for the incident',
  })
  @IsEnum(IncidentStatus)
  status: IncidentStatus;

  @ApiPropertyOptional({ description: 'User ID to assign the incident to' })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiPropertyOptional({ description: 'Resolution details' })
  @IsOptional()
  @IsString()
  resolution?: string;

  @ApiPropertyOptional({
    description: 'Preventive measures taken',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preventiveMeasures?: string[];
}

/**
 * DTO for filtering incidents
 */
export class IncidentFilterDto {
  @ApiPropertyOptional({
    enum: SecurityIncidentType,
    description: 'Filter by incident type',
  })
  @IsOptional()
  @IsEnum(SecurityIncidentType)
  type?: SecurityIncidentType;

  @ApiPropertyOptional({
    enum: IncidentSeverity,
    description: 'Filter by severity',
  })
  @IsOptional()
  @IsEnum(IncidentSeverity)
  severity?: IncidentSeverity;

  @ApiPropertyOptional({
    enum: IncidentStatus,
    description: 'Filter by status',
  })
  @IsOptional()
  @IsEnum(IncidentStatus)
  status?: IncidentStatus;

  @ApiPropertyOptional({ description: 'Filter by user ID' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ description: 'Start date for filtering' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date for filtering' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
