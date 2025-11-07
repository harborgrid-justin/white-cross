import { IsArray, IsDateString, IsEnum, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateVaccinationDto } from './create-vaccination.dto';

/**
 * DTO for CDC vaccination schedule query
 */
export class CDCScheduleQueryDto {
  @ApiPropertyOptional({
    description: 'Age in months or grade level',
    example: '24',
  })
  @IsOptional()
  @IsString()
  ageOrGrade?: string;

  @ApiPropertyOptional({
    description: 'Vaccine type to filter schedule',
    example: 'DTaP',
  })
  @IsOptional()
  @IsString()
  vaccineType?: string;
}

/**
 * DTO for batch vaccination import
 */
export class BatchVaccinationDto {
  @ApiProperty({
    description: 'Array of vaccination records to import',
    type: [CreateVaccinationDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVaccinationDto)
  vaccinations: CreateVaccinationDto[];
}

/**
 * DTO for creating vaccination exemption
 */
export class CreateExemptionDto {
  @ApiProperty({
    description: 'Student UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  studentId: string;

  @ApiProperty({
    description: 'Vaccine name or type being exempted',
    example: 'MMR',
  })
  @IsString()
  vaccineName: string;

  @ApiProperty({
    description: 'Exemption reason',
    enum: ['MEDICAL', 'RELIGIOUS', 'PHILOSOPHICAL', 'PERSONAL'],
    example: 'MEDICAL',
  })
  @IsEnum(['MEDICAL', 'RELIGIOUS', 'PHILOSOPHICAL', 'PERSONAL'])
  exemptionType: string;

  @ApiProperty({
    description: 'Detailed reason for exemption',
    example: 'Severe allergic reaction to vaccine components',
  })
  @IsString()
  reason: string;

  @ApiPropertyOptional({
    description: 'Provider name who authorized medical exemption',
    example: 'Dr. Sarah Johnson',
  })
  @IsOptional()
  @IsString()
  providerName?: string;

  @ApiPropertyOptional({
    description: 'Exemption expiration date',
    example: '2025-12-31',
  })
  @IsOptional()
  @IsDateString()
  expirationDate?: string;

  @ApiPropertyOptional({
    description: 'Supporting documentation file path or reference',
    example: 'exemptions/medical-550e8400.pdf',
  })
  @IsOptional()
  @IsString()
  documentationPath?: string;
}

/**
 * DTO for compliance report query
 */
export class ComplianceReportQueryDto {
  @ApiPropertyOptional({
    description: 'School ID to filter report',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  schoolId?: string;

  @ApiPropertyOptional({
    description: 'Grade level to filter report',
    example: '5',
  })
  @IsOptional()
  @IsString()
  gradeLevel?: string;

  @ApiPropertyOptional({
    description: 'Vaccine type to filter report',
    example: 'MMR',
  })
  @IsOptional()
  @IsString()
  vaccineType?: string;

  @ApiPropertyOptional({
    description: 'Include only non-compliant students',
    example: false,
  })
  @IsOptional()
  onlyNonCompliant?: boolean;
}

/**
 * Response DTO for due/overdue vaccinations
 */
export class DueVaccinationsResponseDto {
  @ApiProperty({
    description: 'Student ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  studentId: string;

  @ApiProperty({
    description: 'Student full name',
    example: 'John Doe',
  })
  studentName: string;

  @ApiProperty({
    description: 'List of due or overdue vaccinations',
    type: 'array',
  })
  dueVaccinations: Array<{
    vaccineName: string;
    doseNumber: number;
    totalDoses: number;
    dueDate: Date;
    status: 'DUE' | 'OVERDUE';
    daysOverdue?: number;
  }>;
}

/**
 * Response DTO for batch vaccination import
 */
export class BatchImportResponseDto {
  @ApiProperty({
    description: 'Number of successfully imported vaccinations',
    example: 45,
  })
  successCount: number;

  @ApiProperty({
    description: 'Number of failed imports',
    example: 2,
  })
  errorCount: number;

  @ApiProperty({
    description: 'Array of imported vaccination IDs',
    type: [String],
  })
  importedIds: string[];

  @ApiProperty({
    description: 'Array of error messages for failed imports',
    type: [String],
  })
  errors: string[];
}
