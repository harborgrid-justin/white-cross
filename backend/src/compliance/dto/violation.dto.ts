import { IsArray, IsDateString, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ViolationSeverity, ViolationStatus, ViolationType, RemediationPriority, RemediationStatus } from '@/database/models';

export class CreateViolationDto {
  @ApiProperty({ enum: ViolationType, description: 'Type of violation' })
  @IsEnum(ViolationType)
  violationType: ViolationType;

  @ApiProperty({
    description: 'Violation title/summary',
    minLength: 5,
    maxLength: 200,
  })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title: string;

  @ApiProperty({ description: 'Detailed description of violation' })
  @IsString()
  description: string;

  @ApiProperty({ enum: ViolationSeverity, description: 'Severity level' })
  @IsEnum(ViolationSeverity)
  severity: ViolationSeverity;

  @ApiProperty({ description: 'When the violation was discovered (ISO 8601)' })
  @IsDateString()
  discoveredAt: string;

  @ApiPropertyOptional({ description: 'Affected student IDs' })
  @IsOptional()
  @IsArray()
  affectedStudents?: string[];

  @ApiPropertyOptional({ description: 'Affected data categories' })
  @IsOptional()
  @IsArray()
  affectedDataCategories?: string[];

  @ApiPropertyOptional({ description: 'Root cause analysis' })
  @IsOptional()
  @IsString()
  rootCause?: string;
}

export class UpdateViolationDto {
  @ApiPropertyOptional({ enum: ViolationStatus, description: 'Updated status' })
  @IsOptional()
  @IsEnum(ViolationStatus)
  status?: ViolationStatus;

  @ApiPropertyOptional({ description: 'User ID assigned to investigate' })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiPropertyOptional({ description: 'Root cause analysis' })
  @IsOptional()
  @IsString()
  rootCause?: string;

  @ApiPropertyOptional({ description: 'Resolution notes' })
  @IsOptional()
  @IsString()
  resolutionNotes?: string;
}

export class CreateRemediationDto {
  @ApiProperty({ description: 'Related violation ID' })
  @IsString()
  violationId: string;

  @ApiProperty({ description: 'Remediation action description' })
  @IsString()
  action: string;

  @ApiProperty({ enum: RemediationPriority, description: 'Priority level' })
  @IsEnum(RemediationPriority)
  priority: RemediationPriority;

  @ApiProperty({ description: 'User ID responsible for action' })
  @IsString()
  assignedTo: string;

  @ApiProperty({ description: 'Target completion date (ISO 8601)' })
  @IsDateString()
  dueDate: string;
}

export class UpdateRemediationDto {
  @ApiPropertyOptional({
    enum: RemediationStatus,
    description: 'Updated status',
  })
  @IsOptional()
  @IsEnum(RemediationStatus)
  status?: RemediationStatus;

  @ApiPropertyOptional({ description: 'Implementation notes' })
  @IsOptional()
  @IsString()
  implementationNotes?: string;

  @ApiPropertyOptional({ description: 'Verification notes' })
  @IsOptional()
  @IsString()
  verificationNotes?: string;

  @ApiPropertyOptional({ description: 'User ID who verified completion' })
  @IsOptional()
  @IsString()
  verifiedBy?: string;
}

export class QueryViolationDto {
  @ApiPropertyOptional({ enum: ViolationType, description: 'Filter by type' })
  @IsOptional()
  @IsEnum(ViolationType)
  violationType?: ViolationType;

  @ApiPropertyOptional({
    enum: ViolationSeverity,
    description: 'Filter by severity',
  })
  @IsOptional()
  @IsEnum(ViolationSeverity)
  severity?: ViolationSeverity;

  @ApiPropertyOptional({
    enum: ViolationStatus,
    description: 'Filter by status',
  })
  @IsOptional()
  @IsEnum(ViolationStatus)
  status?: ViolationStatus;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page', default: 20 })
  @IsOptional()
  limit?: number;
}
