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
    description: 'Brand names for the drug',
    example: ['Advil', 'Motrin'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
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
    description: 'NDC codes',
    example: ['0573-0001-01', '0573-0001-05'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
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
    description: 'Drug description',
    example: 'Nonsteroidal anti-inflammatory drug used for pain relief',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Administration route',
    example: 'oral',
  })
  @IsOptional()
  @IsString()
  administrationRoute?: string;

  @ApiPropertyOptional({
    description: 'Controlled substance schedule (I-V)',
    example: null,
  })
  @IsOptional()
  @IsString()
  controlledSubstanceSchedule?: string;

  @ApiPropertyOptional({
    description: 'Common dosing information',
    example: { adult: '200-400mg every 4-6 hours', pediatric: '10mg/kg every 6-8 hours' },
  })
  @IsOptional()
  @IsObject()
  commonDoses?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Known side effects',
    example: ['Nausea', 'Stomach upset', 'Dizziness'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sideEffects?: string[];

  @ApiPropertyOptional({
    description: 'Contraindications',
    example: ['Active peptic ulcer disease', 'Known hypersensitivity'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  contraindications?: string[];

  @ApiPropertyOptional({
    description: 'Warnings and precautions',
    example: ['Use caution in patients with renal impairment'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
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
