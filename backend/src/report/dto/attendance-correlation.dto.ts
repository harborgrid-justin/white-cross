import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseReportDto } from '@/report';

/**
 * DTO for Attendance Correlation Report requests
 */
export class AttendanceCorrelationDto extends BaseReportDto {
  @ApiPropertyOptional({
    description: 'Minimum number of visits to include student',
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  minVisits?: number = 1;

  @ApiPropertyOptional({
    description: 'Maximum number of results per category',
    default: 50,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 50;
}
