import { IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryStatisticsDto {
  @ApiPropertyOptional({
    description: 'Period (DAILY, WEEKLY, MONTHLY, QUARTERLY, ANNUAL)',
    default: 'MONTHLY',
  })
  @IsOptional()
  @IsString()
  period?: string;

  @ApiPropertyOptional({
    description: 'Start date for custom period (ISO 8601)',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date for custom period (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
