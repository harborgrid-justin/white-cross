import { IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for date range queries
 */
export class DateRangeDto {
  @ApiProperty({ description: 'Start date (ISO format)' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'End date (ISO format)' })
  @IsDateString()
  endDate: string;
}
