import { IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateComplianceReportDto {
  @ApiProperty({ description: 'Start date for report period' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'End date for report period' })
  @IsDateString()
  endDate: string;
}

export class HIPAAComplianceCheckResponseDto {
  id: string;
  area: string;
  status: 'compliant' | 'non-compliant' | 'needs-attention';
  findings: string[];
  recommendations: string[];
  checkedAt: Date;
}
