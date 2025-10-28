import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn, IsUUID } from 'class-validator';

/**
 * Upcoming appointment with priority classification
 */
export class UpcomingAppointmentDto {
  @ApiProperty({
    description: 'Appointment unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Student full name',
    example: 'John Doe',
  })
  @IsString()
  student: string;

  @ApiProperty({
    description: 'Student unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  studentId: string;

  @ApiProperty({
    description: 'Formatted appointment time',
    example: '2:30 PM',
  })
  @IsString()
  time: string;

  @ApiProperty({
    description: 'Appointment type',
    example: 'Routine Checkup',
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Appointment priority level',
    enum: ['high', 'medium', 'low'],
    example: 'medium',
  })
  @IsIn(['high', 'medium', 'low'])
  priority: 'high' | 'medium' | 'low';
}
