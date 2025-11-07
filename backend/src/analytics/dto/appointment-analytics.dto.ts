import {
  IsString,
  IsOptional,
  IsDate,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * Get Appointment Trends Query DTO
 */
export class GetAppointmentTrendsQueryDto {
  @ApiPropertyOptional({ description: 'School ID' })
  @IsOptional()
  @IsString()
  schoolId?: string;

  @ApiProperty({ description: 'Start date for appointment trends' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ description: 'End date for appointment trends' })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiPropertyOptional({ description: 'Filter by appointment type' })
  @IsOptional()
  @IsString()
  appointmentType?: string;

  @ApiPropertyOptional({ description: 'Filter by appointment status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    description: 'Group results by time period',
    enum: ['DAY', 'WEEK', 'MONTH'],
    default: 'MONTH',
  })
  @IsOptional()
  @IsString()
  groupBy?: string;
}

/**
 * Get No Show Rate Query DTO
 */
export class GetNoShowRateQueryDto {
  @ApiPropertyOptional({ description: 'School ID' })
  @IsOptional()
  @IsString()
  schoolId?: string;

  @ApiProperty({ description: 'Start date for no-show analysis' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ description: 'End date for no-show analysis' })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiPropertyOptional({ description: 'Filter by appointment type' })
  @IsOptional()
  @IsString()
  appointmentType?: string;

  @ApiPropertyOptional({
    description: 'Include reasons for no-shows',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  includeReasons?: boolean;

  @ApiPropertyOptional({
    description: 'Compare with target no-show rate',
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  compareWithTarget?: number;
}
