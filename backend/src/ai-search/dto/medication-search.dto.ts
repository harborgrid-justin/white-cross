/**
 * @fileoverview Medication Search DTOs
 * @module ai-search/dto/medication-search.dto
 * @description DTOs for medication interactions, alternatives, side effects, and contraindications
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum MedicationSearchType {
  INTERACTIONS = 'interactions',
  ALTERNATIVES = 'alternatives',
  SIDE_EFFECTS = 'side_effects',
  CONTRAINDICATIONS = 'contraindications',
}

export class MedicationSearchDto {
  @ApiProperty({
    description: 'Type of medication search',
    enum: MedicationSearchType,
    example: MedicationSearchType.INTERACTIONS,
  })
  @IsNotEmpty()
  @IsEnum(MedicationSearchType)
  searchType: MedicationSearchType;

  @ApiProperty({
    description: 'List of medications to search',
    example: ['aspirin', 'warfarin'],
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  medications: string[];

  @ApiProperty({
    description: 'Patient ID for contraindication searches',
    required: false,
    example: 'uuid-123',
  })
  @IsOptional()
  @IsString()
  patientId?: string;
}
