import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TrendDataDto } from './trend-data.dto';

/**
 * Dashboard statistics with trend analysis
 */
export class DashboardStatsDto {
  @ApiProperty({
    description: 'Total number of active students',
    example: 250,
  })
  @IsNumber()
  totalStudents: number;

  @ApiProperty({
    description: 'Number of active medication prescriptions',
    example: 45,
  })
  @IsNumber()
  activeMedications: number;

  @ApiProperty({
    description: 'Number of appointments scheduled for today',
    example: 8,
  })
  @IsNumber()
  todaysAppointments: number;

  @ApiProperty({
    description: 'Number of pending incident reports requiring follow-up',
    example: 3,
  })
  @IsNumber()
  pendingIncidents: number;

  @ApiProperty({
    description: 'Number of medications due to be administered today',
    example: 12,
  })
  @IsNumber()
  medicationsDueToday: number;

  @ApiProperty({
    description:
      'Number of critical health alerts (severe/life-threatening allergies)',
    example: 7,
  })
  @IsNumber()
  healthAlerts: number;

  @ApiProperty({
    description: 'Count of recent activities in the last 24 hours',
    example: 23,
  })
  @IsNumber()
  recentActivityCount: number;

  @ApiProperty({
    description: 'Student enrollment trend data',
    type: TrendDataDto,
  })
  @ValidateNested()
  @Type(() => TrendDataDto)
  @IsObject()
  studentTrend: TrendDataDto;

  @ApiProperty({
    description: 'Medication prescription trend data',
    type: TrendDataDto,
  })
  @ValidateNested()
  @Type(() => TrendDataDto)
  @IsObject()
  medicationTrend: TrendDataDto;

  @ApiProperty({
    description: 'Appointment scheduling trend data',
    type: TrendDataDto,
  })
  @ValidateNested()
  @Type(() => TrendDataDto)
  @IsObject()
  appointmentTrend: TrendDataDto;
}
