import {
  IsString,
  IsDate,
  IsOptional,
  IsEnum,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ConditionStatus,
  ConditionSeverity,
} from '../../health-record/interfaces/chronic-condition.interface';

export class HealthDomainCreateChronicConditionDto {
  @ApiProperty()
  @IsString()
  studentId: string;

  @ApiProperty()
  @IsString()
  condition: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  icdCode?: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  diagnosedDate: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  diagnosedBy?: string;

  @ApiProperty({ enum: ConditionStatus })
  @IsEnum(ConditionStatus)
  status: ConditionStatus;

  @ApiPropertyOptional({ enum: ConditionSeverity })
  @IsOptional()
  @IsEnum(ConditionSeverity)
  severity?: ConditionSeverity;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  carePlan?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  medications?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  restrictions?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  triggers?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  accommodations?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  emergencyActionPlan?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  reviewFrequencyMonths?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  requiresIEP?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  requires504?: boolean;
}
