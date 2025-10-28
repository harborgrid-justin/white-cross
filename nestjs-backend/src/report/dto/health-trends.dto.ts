import { IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseReportDto } from './base-report.dto';
import { HealthRecordType } from '../../common/enums';

/**
 * DTO for Health Trends Report requests
 */
export class HealthTrendsDto extends BaseReportDto {
  @ApiPropertyOptional({
    enum: HealthRecordType,
    description: 'Filter by specific health record type',
  })
  @IsOptional()
  @IsEnum(HealthRecordType)
  recordType?: HealthRecordType;

  @ApiPropertyOptional({
    description: 'Include chronic conditions in report',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  includeChronicConditions?: boolean = true;

  @ApiPropertyOptional({
    description: 'Include allergies in report',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  includeAllergies?: boolean = true;

  @ApiPropertyOptional({
    description: 'Include monthly trends',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  includeMonthlyTrends?: boolean = true;
}
