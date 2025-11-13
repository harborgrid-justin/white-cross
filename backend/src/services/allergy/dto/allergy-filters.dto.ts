/**
 * Data Transfer Object for filtering allergy queries
 *
 * Supports advanced search with multiple optional filter criteria.
 */
import { IsBoolean, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { AllergySeverity } from '../../../common/enums';
import { AllergyType } from '@/database/models';

export class AllergyFiltersDto {
  /**
   * Filter to specific student's allergies
   */
  @IsOptional()
  @IsUUID()
  studentId?: string;

  /**
   * Filter by severity level
   */
  @IsOptional()
  @IsEnum(AllergySeverity)
  severity?: AllergySeverity;

  /**
   * Filter by allergen category
   */
  @IsOptional()
  @IsEnum(AllergyType)
  allergenType?: AllergyType;

  /**
   * Filter by verification status
   */
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  verified?: boolean;

  /**
   * Filter by active status
   */
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  /**
   * Full-text search across allergen, reaction, treatment, notes
   */
  @IsOptional()
  @IsString()
  searchTerm?: string;
}
