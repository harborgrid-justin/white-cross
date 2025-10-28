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
import { AllergySeverity, AllergenType } from '../entities/allergy.entity';

export class CreateAllergyDto {
  /**
   * Student's unique identifier
   */
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  /**
   * Name of allergen (medication, food, environmental substance)
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  allergen: string;

  /**
   * Category of allergen
   */
  @IsOptional()
  @IsEnum(AllergenType)
  allergenType?: AllergenType;

  /**
   * Clinical severity classification
   */
  @IsEnum(AllergySeverity)
  @IsNotEmpty()
  severity: AllergySeverity;

  /**
   * Description of allergic reaction symptoms
   */
  @IsOptional()
  @IsString()
  reaction?: string;

  /**
   * Emergency treatment protocol
   */
  @IsOptional()
  @IsString()
  treatment?: string;

  /**
   * Whether allergy has been clinically verified
   */
  @IsBoolean()
  verified: boolean;

  /**
   * Healthcare professional who verified the allergy
   */
  @IsOptional()
  @IsUUID()
  verifiedBy?: string;

  /**
   * Additional clinical notes
   */
  @IsOptional()
  @IsString()
  notes?: string;

  /**
   * Link to comprehensive health record
   */
  @IsOptional()
  @IsUUID()
  healthRecordId?: string;
}
