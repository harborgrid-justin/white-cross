/**
 * Data Transfer Object for creating new allergy records
 *
 * Validates all required and optional fields for allergy creation.
 * Ensures data integrity before persisting to database.
 */
import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsUUID,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AllergySeverity } from '../../common/enums';
import { AllergenType } from '../entities/allergy.entity';

export class CreateAllergyDto {
  /**
   * Student's unique identifier
   */
  @ApiProperty({
    description: 'Student UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  /**
   * Name of allergen (medication, food, environmental substance)
   */
  @ApiProperty({
    description:
      'Name of the allergen (medication, food, or environmental substance)',
    example: 'Peanuts',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  allergen: string;

  /**
   * Category of allergen
   */
  @ApiPropertyOptional({
    description: 'Category of allergen',
    enum: AllergenType,
    example: AllergenType.FOOD || 'FOOD',
  })
  @IsOptional()
  @IsEnum(AllergenType)
  allergenType?: AllergenType;

  /**
   * Clinical severity classification
   */
  @ApiProperty({
    description: 'Clinical severity classification of the allergic reaction',
    enum: AllergySeverity,
    example: AllergySeverity.SEVERE || 'SEVERE',
  })
  @IsEnum(AllergySeverity)
  @IsNotEmpty()
  severity: AllergySeverity;

  /**
   * Description of allergic reaction symptoms
   */
  @ApiPropertyOptional({
    description:
      'Description of allergic reaction symptoms (maximum 1000 characters)',
    example: 'Anaphylaxis, hives, difficulty breathing, throat swelling',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000, {
    message: 'Reaction description cannot exceed 1000 characters',
  })
  reaction?: string;

  /**
   * Emergency treatment protocol
   */
  @ApiPropertyOptional({
    description:
      'Emergency treatment protocol and instructions (maximum 2000 characters)',
    example: 'Administer EpiPen immediately, call 911, monitor airway',
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000, {
    message: 'Treatment protocol cannot exceed 2000 characters',
  })
  treatment?: string;

  /**
   * Whether allergy has been clinically verified
   */
  @ApiProperty({
    description:
      'Whether the allergy has been clinically verified by a healthcare professional',
    example: true,
    type: Boolean,
  })
  @IsBoolean()
  verified: boolean;

  /**
   * Healthcare professional who verified the allergy
   */
  @ApiPropertyOptional({
    description:
      'UUID of the healthcare professional who verified this allergy',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  verifiedBy?: string;

  /**
   * Additional clinical notes
   */
  @ApiPropertyOptional({
    description:
      'Additional clinical notes and observations (maximum 5000 characters)',
    example:
      'Patient experienced anaphylaxis during school lunch. Parent confirmed previous diagnosis.',
    maxLength: 5000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000, { message: 'Notes cannot exceed 5000 characters' })
  notes?: string;

  /**
   * Link to comprehensive health record
   */
  @ApiPropertyOptional({
    description: 'UUID of associated comprehensive health record',
    example: '987e6543-e21b-43c5-a789-123456789abc',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  healthRecordId?: string;
}
