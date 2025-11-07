import { PartialType } from '@nestjs/swagger';
import { CreateIncidentReportDto } from './create-incident-report.dto';
import { IsOptional, IsEnum, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { InsuranceClaimStatus } from '../enums';

export class UpdateIncidentReportDto extends PartialType(
  CreateIncidentReportDto,
) {
  @ApiPropertyOptional({
    description: 'Insurance claim status',
    enum: InsuranceClaimStatus,
  })
  @IsOptional()
  @IsEnum(InsuranceClaimStatus)
  insuranceClaimStatus?: InsuranceClaimStatus;

  @ApiPropertyOptional({
    description: 'Parent notification method',
    example: 'Phone call',
  })
  @IsOptional()
  @IsString()
  parentNotificationMethod?: string;

  @ApiPropertyOptional({
    description: 'Parent notified at timestamp',
    example: '2025-10-28T11:00:00Z',
  })
  @IsOptional()
  parentNotifiedAt?: Date;
}
