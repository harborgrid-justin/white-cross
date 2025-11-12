/**
 * @fileoverview Allergy Filter DTO
 * @module health-record/allergy/dto
 * @description Data Transfer Object for filtering and searching allergy records
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { AllergySeverity, AllergyType   } from "../../database/models";

export class AllergyFilterDto {
  @ApiPropertyOptional({
    description: 'Filter by student ID (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID('4')
  studentId?: string;

  @ApiPropertyOptional({
    description: 'Filter by allergy type',
    enum: AllergyType,
    example: AllergyType.FOOD,
  })
  @IsOptional()
  @IsEnum(AllergyType)
  allergyType?: AllergyType;

  @ApiPropertyOptional({
    description: 'Filter by severity level',
    enum: AllergySeverity,
    example: AllergySeverity.SEVERE,
  })
  @IsOptional()
  @IsEnum(AllergySeverity)
  severity?: AllergySeverity;

  @ApiPropertyOptional({
    description: 'Search query for allergen name, symptoms, or notes',
    example: 'peanut',
  })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiPropertyOptional({
    description: 'Filter by active status',
    example: true,
    default: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by verification status',
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  verified?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by EpiPen requirement',
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  epiPenRequired?: boolean;
}
