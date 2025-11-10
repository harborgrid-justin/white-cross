import { IsDateString, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Add Student Drug Allergy DTO
 * Used for recording a student's drug allergy
 */
export class AddAllergyDto {
  @ApiProperty({
    description: 'Student ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4')
  studentId: string;

  @ApiProperty({
    description: 'Drug ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID('4')
  drugId: string;

  @ApiProperty({
    description: 'Type of allergy',
    example: 'Drug Allergy',
  })
  @IsString()
  @MinLength(1)
  allergyType: string;

  @ApiProperty({
    description: 'Allergic reaction description',
    example: 'Hives, itching, swelling',
  })
  @IsString()
  @MinLength(1)
  reaction: string;

  @ApiProperty({
    description: 'Severity of the allergy',
    example: 'MODERATE',
    enum: ['MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING'],
  })
  @IsString()
  @MinLength(1)
  severity: string;

  @ApiPropertyOptional({
    description: 'Additional notes about the allergy',
    example:
      'Patient reports reaction occurred within 30 minutes of administration',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Date allergy was diagnosed',
    example: '2024-01-15',
  })
  @IsOptional()
  @IsDateString()
  diagnosedDate?: Date;

  @ApiPropertyOptional({
    description: 'Healthcare provider who diagnosed the allergy',
    example: 'Dr. Jane Smith',
  })
  @IsOptional()
  @IsString()
  diagnosedBy?: string;
}
