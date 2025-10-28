import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetHealthTrendsDto {
  @ApiProperty({ enum: ['day', 'week', 'month'], description: 'Time period for trends' })
  @IsEnum(['day', 'week', 'month'])
  period: 'day' | 'week' | 'month';
}

export class DashboardMetricResponseDto {
  name: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
  unit: string;
}
