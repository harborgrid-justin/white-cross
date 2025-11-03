import { IsString, IsUUID, IsEnum, IsOptional, MaxLength, MinLength, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AllergyType, AllergySeverity } from '../../interfaces/allergy.interface';

/**
 * DTO for creating a new allergy record
 * PHI-protected endpoint requiring authentication
 */
export class CreateAllergyDto {
  @ApiProperty({
    description: 'Student UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  studentId: string;

  @ApiProperty({
    description: 'Allergen name',
    example: 'Peanuts',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  allergen: string;

  @ApiProperty({
    description: 'Type of allergy',
    enum: AllergyType,
    example: AllergyType.FOOD,
  })
  @IsEnum(AllergyType)
  allergyType: AllergyType;

  @ApiProperty({
    description: 'Severity of allergic reaction',
    enum: AllergySeverity,
    example: AllergySeverity.SEVERE,
  })
  @IsEnum(AllergySeverity)
  severity: AllergySeverity;

  @ApiProperty({
    description: 'Symptoms of allergic reaction',
    example: 'Hives, difficulty breathing, swelling of throat',
    maxLength: 1000,
  })
  @IsString()
  @MaxLength(1000)
  symptoms: string;

  @ApiPropertyOptional({
    description: 'Treatment or emergency response',
    example: 'Administer EpiPen immediately, call 911',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  treatment?: string;

  @ApiPropertyOptional({
    description: 'Date allergy was diagnosed (ISO 8601)',
    example: '2023-05-15',
  })
  @IsOptional()
  @IsDateString()
  diagnosedDate?: string;

  @ApiPropertyOptional({
    description: 'Name of diagnosing physician',
    example: 'Dr. Sarah Johnson',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  diagnosedBy?: string;

  @ApiPropertyOptional({
    description: 'Additional notes',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
