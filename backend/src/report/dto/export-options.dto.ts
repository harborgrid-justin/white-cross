import { IsArray, IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OutputFormat, ReportType } from '../constants/report.constants';

/**
 * DTO for Report Export requests
 */
export class ExportOptionsDto {
  @ApiProperty({
    enum: ReportType,
    description: 'Type of report to export',
  })
  @IsEnum(ReportType)
  reportType!: ReportType;

  @ApiProperty({
    enum: OutputFormat,
    description: 'Export format',
  })
  @IsEnum(OutputFormat)
  format!: OutputFormat;

  @ApiPropertyOptional({
    description: 'Include charts in export (PDF only)',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  includeCharts?: boolean = false;

  @ApiPropertyOptional({
    description: 'Include executive summary',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  includeSummary?: boolean = true;

  @ApiPropertyOptional({
    description: 'Page orientation for PDF',
    enum: ['portrait', 'landscape'],
    default: 'portrait',
  })
  @IsOptional()
  @IsString()
  pageOrientation?: 'portrait' | 'landscape' = 'portrait';

  @ApiPropertyOptional({
    description: 'Specific columns to include (CSV/Excel)',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  columns?: string[];

  @ApiPropertyOptional({
    description: 'Report data as JSON object',
  })
  @IsOptional()
  data?: any;
}
