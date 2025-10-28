import { IsString, IsOptional, IsDate, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * Get Incident Trends Query DTO
 */
export class GetIncidentTrendsQueryDto {
  @ApiPropertyOptional({ description: 'School ID', default: 'default-school' })
  @IsOptional()
  @IsString()
  schoolId?: string;

  @ApiProperty({ description: 'Start date for incident trends' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ description: 'End date for incident trends' })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiPropertyOptional({ description: 'Filter by incident type' })
  @IsOptional()
  @IsString()
  incidentType?: string;

  @ApiPropertyOptional({ description: 'Filter by severity level' })
  @IsOptional()
  @IsString()
  severity?: string;

  @ApiPropertyOptional({
    description: 'Group results by',
    enum: ['TYPE', 'LOCATION', 'TIME', 'SEVERITY'],
    default: 'TYPE',
  })
  @IsOptional()
  @IsString()
  groupBy?: string;
}

/**
 * Get Incidents By Location Query DTO
 */
export class GetIncidentsByLocationQueryDto {
  @ApiPropertyOptional({ description: 'School ID', default: 'default-school' })
  @IsOptional()
  @IsString()
  schoolId?: string;

  @ApiProperty({ description: 'Start date for location analysis' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ description: 'End date for location analysis' })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiPropertyOptional({ description: 'Filter by specific location' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: 'Include heat map visualization data', default: false })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  includeHeatMap?: boolean;
}
