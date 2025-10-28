import { IsOptional, IsDate, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { OutputFormat } from '../constants/report.constants';

/**
 * Base DTO for all report requests
 * Provides common date range filtering and output format options
 */
export class BaseReportDto {
  @ApiPropertyOptional({ description: 'Start date for report filtering' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional({ description: 'End date for report filtering' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @ApiPropertyOptional({
    enum: OutputFormat,
    description: 'Desired output format',
    default: OutputFormat.JSON,
  })
  @IsOptional()
  @IsEnum(OutputFormat)
  outputFormat?: OutputFormat = OutputFormat.JSON;
}
