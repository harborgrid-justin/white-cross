/**
 * @fileoverview Advanced Search DTOs
 * @module ai-search/dto/advanced-search.dto
 * @description DTOs for advanced patient search with multiple criteria
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsNumber,
  IsString,
  IsBoolean,
  IsArray,
  IsObject,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AgeRangeDto {
  @ApiProperty({ description: 'Minimum age', required: false, example: 5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  min?: number;

  @ApiProperty({ description: 'Maximum age', required: false, example: 18 })
  @IsOptional()
  @IsNumber()
  @Max(150)
  max?: number;
}

export class DemographicsDto {
  @ApiProperty({
    description: 'Age range filter',
    required: false,
    type: AgeRangeDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AgeRangeDto)
  ageRange?: AgeRangeDto;

  @ApiProperty({
    description: 'Gender filter',
    required: false,
    example: 'female',
  })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ description: 'Grade filter', required: false, example: '10' })
  @IsOptional()
  @IsString()
  grade?: string;
}

export class MedicalCriteriaDto {
  @ApiProperty({
    description: 'Medical conditions',
    required: false,
    example: ['asthma', 'diabetes'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  conditions?: string[];

  @ApiProperty({
    description: 'Medications',
    required: false,
    example: ['albuterol', 'insulin'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  medications?: string[];

  @ApiProperty({
    description: 'Allergies',
    required: false,
    example: ['peanuts', 'penicillin'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allergies?: string[];

  @ApiProperty({
    description: 'Risk factors',
    required: false,
    example: ['obesity', 'hypertension'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  riskFactors?: string[];
}

export class BehavioralCriteriaDto {
  @ApiProperty({
    description: 'Filter for frequent visitors',
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  frequentVisitor?: boolean;

  @ApiProperty({
    description: 'Compliance level',
    required: false,
    example: 'high',
  })
  @IsOptional()
  @IsString()
  complianceLevel?: string;

  @ApiProperty({
    description: 'Appointment history pattern',
    required: false,
    example: 'regular',
  })
  @IsOptional()
  @IsString()
  appointmentHistory?: string;
}

export class TimeframeDto {
  @ApiProperty({ description: 'Start date', required: false, type: Date })
  @IsOptional()
  @Type(() => Date)
  start?: Date;

  @ApiProperty({ description: 'End date', required: false, type: Date })
  @IsOptional()
  @Type(() => Date)
  end?: Date;
}

export class AdvancedSearchCriteriaDto {
  @ApiProperty({
    description: 'Demographic criteria',
    required: false,
    type: DemographicsDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DemographicsDto)
  demographics?: DemographicsDto;

  @ApiProperty({
    description: 'Medical criteria',
    required: false,
    type: MedicalCriteriaDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MedicalCriteriaDto)
  medical?: MedicalCriteriaDto;

  @ApiProperty({
    description: 'Behavioral criteria',
    required: false,
    type: BehavioralCriteriaDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => BehavioralCriteriaDto)
  behavioral?: BehavioralCriteriaDto;

  @ApiProperty({
    description: 'Timeframe filter',
    required: false,
    type: TimeframeDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => TimeframeDto)
  timeframe?: TimeframeDto;

  @ApiProperty({
    description: 'Result limit',
    required: false,
    example: 20,
    default: 20,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiProperty({ description: 'User ID making the search', required: true })
  @IsString()
  userId: string;
}
