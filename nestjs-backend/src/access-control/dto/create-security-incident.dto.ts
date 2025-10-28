import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsArray, IsUUID } from 'class-validator';

/**
 * Security incident types
 */
export enum SecurityIncidentType {
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  BRUTE_FORCE = 'BRUTE_FORCE',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  DATA_BREACH = 'DATA_BREACH',
  POLICY_VIOLATION = 'POLICY_VIOLATION',
  MALWARE = 'MALWARE',
  OTHER = 'OTHER',
}

/**
 * Incident severity levels
 */
export enum IncidentSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * DTO for creating a security incident
 */
export class CreateSecurityIncidentDto {
  @ApiProperty({
    description: 'Type of security incident',
    enum: SecurityIncidentType,
    example: SecurityIncidentType.UNAUTHORIZED_ACCESS,
  })
  @IsEnum(SecurityIncidentType, { message: 'Invalid incident type' })
  type: SecurityIncidentType;

  @ApiProperty({
    description: 'Severity of the incident',
    enum: IncidentSeverity,
    example: IncidentSeverity.MEDIUM,
  })
  @IsEnum(IncidentSeverity, { message: 'Invalid severity level' })
  severity: IncidentSeverity;

  @ApiProperty({
    description: 'Description of the incident',
    example: 'User attempted to access restricted resource without proper permissions',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Array of affected resources',
    example: ['user:123', 'resource:456'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  affectedResources?: string[];

  @ApiProperty({
    description: 'UUID of the user or system that detected the incident',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID('4')
  detectedBy?: string;
}
