import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

/**
 * Query parameters for chart data endpoint
 */
export class GetChartDataDto {
  @ApiProperty({
    description: 'Time period for chart data aggregation',
    enum: ['week', 'month', 'year'],
    default: 'week',
    required: false,
  })
  @IsIn(['week', 'month', 'year'])
  @IsOptional()
  period?: 'week' | 'month' | 'year' = 'week';
}
