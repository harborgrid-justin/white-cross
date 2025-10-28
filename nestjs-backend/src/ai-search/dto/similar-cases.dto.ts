/**
 * @fileoverview Similar Cases DTOs
 * @module ai-search/dto/similar-cases.dto
 * @description DTOs for finding similar medical cases using vector similarity
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsNumber,
  IsString,
  IsArray,
  Min,
  Max,
} from 'class-validator';

export class SimilarCasesDto {
  @ApiProperty({ description: 'Patient ID to find similar cases', required: false, example: 'uuid-123' })
  @IsOptional()
  @IsString()
  patientId?: string;

  @ApiProperty({ description: 'Symptoms to search for', required: false, example: ['fever', 'cough', 'fatigue'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  symptoms?: string[];

  @ApiProperty({ description: 'Conditions to search for', required: false, example: ['respiratory infection'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  conditions?: string[];

  @ApiProperty({ description: 'Treatments to search for', required: false, example: ['antibiotics', 'rest'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  treatments?: string[];

  @ApiProperty({ description: 'Similarity threshold (0-1)', required: false, example: 0.8, default: 0.8 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  threshold?: number;

  @ApiProperty({ description: 'Maximum number of results', required: false, example: 5, default: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  limit?: number;
}
