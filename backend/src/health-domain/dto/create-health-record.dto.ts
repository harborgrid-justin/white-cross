import {
  IsString,
  IsDate,
  IsOptional,
  IsObject,
  IsArray,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HealthRecordType } from '../../health-record/interfaces/health-record-types';

export class VitalSignsDto {
  @ApiPropertyOptional()
  @IsOptional()
  temperature?: number;

  @ApiPropertyOptional()
  @IsOptional()
  bloodPressureSystolic?: number;

  @ApiPropertyOptional()
  @IsOptional()
  bloodPressureDiastolic?: number;

  @ApiPropertyOptional()
  @IsOptional()
  heartRate?: number;

  @ApiPropertyOptional()
  @IsOptional()
  respiratoryRate?: number;

  @ApiPropertyOptional()
  @IsOptional()
  oxygenSaturation?: number;

  @ApiPropertyOptional()
  @IsOptional()
  height?: number;

  @ApiPropertyOptional()
  @IsOptional()
  weight?: number;

  @ApiPropertyOptional()
  @IsOptional()
  bmi?: number;
}

export class HealthDomainCreateRecordDto {
  @ApiProperty()
  @IsString()
  studentId: string;

  @ApiProperty({ enum: HealthRecordType })
  @IsEnum(HealthRecordType)
  type: HealthRecordType;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiPropertyOptional({ type: VitalSignsDto })
  @IsOptional()
  @IsObject()
  @Type(() => VitalSignsDto)
  vital?: VitalSignsDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];
}
