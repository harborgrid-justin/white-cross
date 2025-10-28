import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetMetricsQueryDto {
  @IsOptional()
  @IsString()
  timeRange?: string = '24h';

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  refresh?: boolean = false;
}
