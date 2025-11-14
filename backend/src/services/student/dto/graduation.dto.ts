/**
 * @fileoverview Graduation DTO
 * @module student/dto
 * @description DTO for student graduation processing
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString, IsArray, IsObject } from 'class-validator';

export class GraduationDto {
  @ApiProperty({
    description: 'Graduation date',
    example: '2024-06-15',
  })
  @IsDateString()
  graduationDate: string;

  @ApiPropertyOptional({
    description: 'Diploma number',
    example: 'DIPL-2024-001',
  })
  @IsOptional()
  @IsString()
  diplomaNumber?: string;

  @ApiPropertyOptional({
    description: 'Graduation honors',
    example: ['Summa Cum Laude', 'Valedictorian'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  honors?: string[];

  @ApiPropertyOptional({
    description: 'Additional graduation metadata',
    example: { ceremonyLocation: 'Main Auditorium', speaker: 'Dr. Smith' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}