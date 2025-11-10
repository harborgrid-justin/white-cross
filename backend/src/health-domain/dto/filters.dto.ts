import { IsBoolean, IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { HealthRecordType } from '../../health-record/interfaces/health-record-types';
import { AllergySeverity } from '../../health-record/interfaces/allergy.interface';
import { ConditionSeverity, ConditionStatus } from '../../health-record/interfaces/chronic-condition.interface';
import { VaccineType } from '../../health-record/interfaces/vaccination.interface';

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
  @ApiPropertyOptional({ enum: VaccineType })
  @IsOptional()
  @IsEnum(VaccineType)
  vaccineType?: VaccineType;

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
