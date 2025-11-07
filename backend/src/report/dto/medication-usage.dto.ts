import { IsOptional, IsUUID, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseReportDto } from './base-report.dto';

/**
 * DTO for Medication Usage Report requests
 */
export class MedicationUsageDto extends BaseReportDto {
  @ApiPropertyOptional({
    description: 'Filter by specific medication ID',
  })
  @IsOptional()
  @IsUUID()
  medicationId?: string;

  @ApiPropertyOptional({
    description: 'Include adverse reactions in report',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  includeAdverseReactions?: boolean = true;

  @ApiPropertyOptional({
    description: 'Include top medications analysis',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  includeTopMedications?: boolean = true;

  @ApiPropertyOptional({
    description: 'Include compliance statistics',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  includeCompliance?: boolean = true;
}
