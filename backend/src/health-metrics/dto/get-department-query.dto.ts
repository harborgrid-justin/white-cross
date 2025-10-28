import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetDepartmentQueryDto {
  @IsOptional()
  @IsString()
  timeRange?: string = '24h';

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  includeHistorical?: boolean = false;
}
