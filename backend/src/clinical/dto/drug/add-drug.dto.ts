import { IsString, IsOptional, IsArray, IsObject, IsBoolean, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Add Drug DTO
 * Used for adding a new drug to the catalog
 */
export class AddDrugDto {
  @ApiProperty({
    description: 'Generic drug name',
    example: 'Ibuprofen',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  genericName: string;

  @ApiPropertyOptional({
    description: 'Brand names for the drug (each max 100 characters)',
    example: ['Advil', 'Motrin'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(100, { each: true, message: 'Each brand name cannot exceed 100 characters' })
  brandNames?: string[];

  @ApiPropertyOptional({
    description: 'RxNorm code',
    example: '5640',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  rxnormCode?: string;

  @ApiPropertyOptional({
    description: 'RxNorm ID',
    example: 'RXCUI:5640',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  rxnormId?: string;

  @ApiPropertyOptional({
    description: 'NDC codes (each max 50 characters)',
    example: ['0573-0001-01', '0573-0001-05'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(50, { each: true, message: 'Each NDC code cannot exceed 50 characters' })
  ndcCodes?: string[];

  @ApiPropertyOptional({
    description: 'Drug classification',
    example: 'NSAID',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  drugClass?: string;

  @ApiPropertyOptional({
    description: 'Drug description (maximum 2000 characters)',
    example: 'Nonsteroidal anti-inflammatory drug used for pain relief',
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Description cannot exceed 2000 characters' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Administration route (maximum 100 characters)',
    example: 'oral',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Administration route cannot exceed 100 characters' })
  administrationRoute?: string;

  @ApiPropertyOptional({
    description: 'Controlled substance schedule (I-V, maximum 10 characters)',
    example: null,
    maxLength: 10,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10, { message: 'Controlled substance schedule cannot exceed 10 characters' })
  controlledSubstanceSchedule?: string;

  @ApiPropertyOptional({
    description: 'Common dosing information',
    example: { adult: '200-400mg every 4-6 hours', pediatric: '10mg/kg every 6-8 hours' },
  })
  @IsOptional()
  @IsObject()
  commonDoses?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Known side effects (each max 200 characters)',
    example: ['Nausea', 'Stomach upset', 'Dizziness'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(200, { each: true, message: 'Each side effect cannot exceed 200 characters' })
  sideEffects?: string[];

  @ApiPropertyOptional({
    description: 'Contraindications (each max 200 characters)',
    example: ['Active peptic ulcer disease', 'Known hypersensitivity'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(200, { each: true, message: 'Each contraindication cannot exceed 200 characters' })
  contraindications?: string[];

  @ApiPropertyOptional({
    description: 'Warnings and precautions (each max 200 characters)',
    example: ['Use caution in patients with renal impairment'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(200, { each: true, message: 'Each warning cannot exceed 200 characters' })
  warnings?: string[];

  @ApiPropertyOptional({
    description: 'FDA approval status',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  fdaApproved?: boolean;
}
