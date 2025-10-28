import { IsOptional, IsString, IsNumber, IsArray, IsIn } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GetAlertsQueryDto {
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',');
    }
    return value;
  })
  severity?: string[];

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  @IsIn(['active', 'acknowledged', 'resolved'])
  status?: string = 'active';

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 50;
}
