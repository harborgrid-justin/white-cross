import { IsOptional, IsString, IsDate, IsEnum, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { HealthRecordType } from './create-health-record.dto';
import { AllergySeverity } from './create-allergy.dto';
import { ConditionStatus, ConditionSeverity } from './create-chronic-condition.dto';

export class HealthRecordFiltersDto {
  @ApiPropertyOptional({ enum: HealthRecordType })
  @IsOptional()
  @IsEnum(HealthRecordType)
  type?: HealthRecordType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateFrom?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateTo?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  provider?: string;
}

export class AllergyFiltersDto {
  @ApiPropertyOptional({ enum: AllergySeverity })
  @IsOptional()
  @IsEnum(AllergySeverity)
  severity?: AllergySeverity;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  verified?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  allergen?: string;
}

export class ChronicConditionFiltersDto {
  @ApiPropertyOptional({ enum: ConditionStatus })
  @IsOptional()
  @IsEnum(ConditionStatus)
  status?: ConditionStatus;

  @ApiPropertyOptional({ enum: ConditionSeverity })
  @IsOptional()
  @IsEnum(ConditionSeverity)
  severity?: ConditionSeverity;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  condition?: string;
}

export class VaccinationFiltersDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  vaccineName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateFrom?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateTo?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cvxCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  seriesComplete?: boolean;
}
