/**
 * @fileoverview Generate Report DTO
 * @module academic-transcript/dto/generate-report.dto
 * @description DTO for generating academic transcript reports
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsBoolean } from 'class-validator';

export enum ReportFormat {
  PDF = 'pdf',
  HTML = 'html',
  JSON = 'json',
}

/**
 * Generate Report DTO
 *
 * Used for POST /academic-transcript/:studentId/report endpoint
 * Specifies format and options for transcript report generation
 */
export class AcademicGenerateReportDto {
  @ApiProperty({
    description: 'Report format',
    enum: ReportFormat,
    example: ReportFormat.PDF,
    required: false,
    default: ReportFormat.JSON,
  })
  @IsOptional()
  @IsEnum(ReportFormat, {
    message: 'Format must be one of: pdf, html, json',
  })
  format?: ReportFormat = ReportFormat.JSON;

  @ApiProperty({
    description: 'Include grade history across all academic years',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  includeHistory?: boolean = true;

  @ApiProperty({
    description: 'Include attendance records',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  includeAttendance?: boolean = true;

  @ApiProperty({
    description: 'Include behavior records',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  includeBehavior?: boolean = true;

  @ApiProperty({
    description: 'Include performance analytics and trends',
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  includeAnalytics?: boolean = false;
}
