import {
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  IsArray,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GetVitalsQueryDto {
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((id) => parseInt(id, 10));
    }
    return value;
  })
  patientIds?: number[];

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  critical?: boolean = false;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 20;
}
