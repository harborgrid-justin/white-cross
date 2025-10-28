import { IsString, IsArray, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetTrendsQueryDto {
  @IsArray()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',');
    }
    return value;
  })
  metrics: string[];

  @IsString()
  @IsIn(['1h', '6h', '24h', '7d', '30d', '90d'])
  timeRange: string;

  @IsString()
  @IsIn(['hour', 'day', 'week'])
  granularity: string;
}
