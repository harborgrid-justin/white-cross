import { IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for Dashboard Metrics requests
 */
export class DashboardMetricsDto {
  @ApiPropertyOptional({
    description: 'Include detailed breakdown',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  detailed?: boolean = false;

  @ApiPropertyOptional({
    description: 'Bypass cache and get fresh data',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  refresh?: boolean = false;
}
