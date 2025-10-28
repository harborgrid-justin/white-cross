import { IsString, IsEnum, IsOptional, IsDateString, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRecurringTemplateDto {
  @ApiProperty({ description: 'Student ID' })
  @IsString()
  studentId: string;

  @ApiProperty({ description: 'Type of appointment' })
  @IsString()
  appointmentType: string;

  @ApiProperty({ enum: ['daily', 'weekly', 'biweekly', 'monthly'], description: 'Recurrence frequency' })
  @IsEnum(['daily', 'weekly', 'biweekly', 'monthly'])
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';

  @ApiPropertyOptional({ description: 'Day of week (0-6)' })
  @IsOptional()
  @IsNumber()
  dayOfWeek?: number;

  @ApiProperty({ description: 'Time of day (HH:MM format)' })
  @IsString()
  timeOfDay: string;

  @ApiProperty({ description: 'Start date for recurring series' })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({ description: 'End date for recurring series' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ description: 'User who created the template' })
  @IsString()
  createdBy: string;
}

export class RecurringTemplateResponseDto {
  id: string;
  studentId: string;
  appointmentType: string;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  dayOfWeek?: number;
  timeOfDay: string;
  startDate: Date;
  endDate?: Date;
  createdBy: string;
}
