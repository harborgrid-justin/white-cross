import { IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseReportDto } from './base-report.dto';

/**
 * DTO for Incident Statistics Report requests
 */
export class IncidentStatisticsDto extends BaseReportDto {
  @ApiPropertyOptional({
    description: 'Filter by specific incident type',
  })
  @IsOptional()
  @IsEnum(['INJURY', 'ILLNESS', 'BEHAVIORAL', 'MEDICATION_ERROR', 'OTHER'])
  incidentType?: string;

  @ApiPropertyOptional({
    description: 'Filter by specific severity level',
  })
  @IsOptional()
  @IsEnum(['MINOR', 'MODERATE', 'SEVERE', 'CRITICAL'])
  severity?: string;

  @ApiPropertyOptional({
    description: 'Include type breakdown',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  includeTypeBreakdown?: boolean = true;

  @ApiPropertyOptional({
    description: 'Include severity analysis',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  includeSeverityAnalysis?: boolean = true;

  @ApiPropertyOptional({
    description: 'Include monthly trends',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  includeMonthlyTrends?: boolean = true;

  @ApiPropertyOptional({
    description: 'Include compliance statistics',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  includeCompliance?: boolean = true;
}
