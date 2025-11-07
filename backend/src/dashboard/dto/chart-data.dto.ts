import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Single data point for chart visualization
 */
export class ChartDataPointDto {
  @ApiProperty({
    description: 'Formatted date string',
    example: 'Oct 15',
  })
  @IsString()
  date: string;

  @ApiProperty({
    description: 'Numeric value for the data point',
    example: 12,
  })
  @IsNumber()
  value: number;

  @ApiProperty({
    description: 'Optional label for the data point',
    example: 'Oct 15',
    required: false,
  })
  @IsString()
  @IsOptional()
  label?: string;
}

/**
 * Complete chart data for all dashboard visualizations
 */
export class DashboardChartDataDto {
  @ApiProperty({
    description: 'Student enrollment trend over time',
    type: [ChartDataPointDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChartDataPointDto)
  enrollmentTrend: ChartDataPointDto[];

  @ApiProperty({
    description: 'Medication administration frequency over time',
    type: [ChartDataPointDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChartDataPointDto)
  medicationAdministration: ChartDataPointDto[];

  @ApiProperty({
    description: 'Incident report frequency over time',
    type: [ChartDataPointDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChartDataPointDto)
  incidentFrequency: ChartDataPointDto[];

  @ApiProperty({
    description: 'Appointment scheduling trends over time',
    type: [ChartDataPointDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChartDataPointDto)
  appointmentTrends: ChartDataPointDto[];
}
