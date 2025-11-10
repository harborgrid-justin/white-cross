import { IsArray, IsDate, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TreatmentStatus } from '../../enums/treatment-status.enum';

/**
 * DTO for creating a new treatment plan
 */
export class CreateTreatmentPlanDto {
  @ApiProperty({
    description: 'Student ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  studentId: string;

  @ApiPropertyOptional({ description: 'Associated clinic visit ID' })
  @IsUUID()
  @IsOptional()
  visitId?: string;

  @ApiProperty({
    description: 'Staff member creating the plan',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  createdBy: string;

  @ApiProperty({
    description: 'Primary diagnosis',
    example: 'Type 1 Diabetes Mellitus',
  })
  @IsString()
  diagnosis: string;

  @ApiProperty({
    description: 'Treatment goals',
    example: ['Stabilize blood glucose', 'Prevent complications'],
  })
  @IsArray()
  @IsString({ each: true })
  treatmentGoals: string[];

  @ApiProperty({
    description: 'Planned interventions',
    example: ['Insulin therapy', 'Dietary modifications', 'Regular monitoring'],
  })
  @IsArray()
  @IsString({ each: true })
  interventions: string[];

  @ApiPropertyOptional({
    description: 'List of medications',
    example: ['Insulin glargine', 'Metformin'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  medications?: string[];

  @ApiProperty({ description: 'Treatment start date', example: '2025-10-28' })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiPropertyOptional({ description: 'Expected end date' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional({
    description: 'Treatment plan status',
    enum: TreatmentStatus,
    default: TreatmentStatus.DRAFT,
  })
  @IsEnum(TreatmentStatus)
  @IsOptional()
  status?: TreatmentStatus;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Date for plan review' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  reviewDate?: Date;
}
