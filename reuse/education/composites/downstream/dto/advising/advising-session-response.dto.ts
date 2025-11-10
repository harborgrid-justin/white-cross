/**
 * Response DTOs for advising sessions
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppointmentType, MeetingFormat } from './create-advising-session.dto';
import { AdvisingSessionStatus } from './update-advising-session.dto';

export class AdvisingSessionResponseDto {
  @ApiProperty({
    description: 'Session identifier',
    format: 'uuid',
    example: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
  })
  sessionId: string;

  @ApiProperty({
    description: 'Student identifier',
    example: 'STU123',
  })
  studentId: string;

  @ApiProperty({
    description: 'Student full name',
    example: 'John Doe',
  })
  studentName: string;

  @ApiProperty({
    description: 'Advisor identifier',
    example: 'ADV456',
  })
  advisorId: string;

  @ApiProperty({
    description: 'Advisor full name',
    example: 'Dr. Jane Smith',
  })
  advisorName: string;

  @ApiProperty({
    description: 'Appointment type',
    enum: AppointmentType,
    example: AppointmentType.ACADEMIC_PLANNING,
  })
  appointmentType: AppointmentType;

  @ApiProperty({
    description: 'Session status',
    enum: AdvisingSessionStatus,
    example: AdvisingSessionStatus.COMPLETED,
  })
  sessionStatus: AdvisingSessionStatus;

  @ApiProperty({
    description: 'Scheduled start time (ISO 8601)',
    example: '2025-11-15T10:00:00Z',
  })
  scheduledStart: Date;

  @ApiProperty({
    description: 'Scheduled end time (ISO 8601)',
    example: '2025-11-15T11:00:00Z',
  })
  scheduledEnd: Date;

  @ApiPropertyOptional({
    description: 'Actual start time (ISO 8601)',
    example: '2025-11-15T10:05:00Z',
  })
  actualStart?: Date;

  @ApiPropertyOptional({
    description: 'Actual end time (ISO 8601)',
    example: '2025-11-15T10:55:00Z',
  })
  actualEnd?: Date;

  @ApiProperty({
    description: 'Location of meeting',
    example: 'Advising Center Room 203',
  })
  location: string;

  @ApiProperty({
    description: 'Meeting format',
    enum: MeetingFormat,
    example: MeetingFormat.IN_PERSON,
  })
  meetingFormat: MeetingFormat;

  @ApiProperty({
    description: 'Discussion topics',
    type: [String],
    example: ['degree planning', 'course selection'],
  })
  topics: string[];

  @ApiPropertyOptional({
    description: 'Session notes',
    example: 'Discussed graduation requirements and course selection',
  })
  notes?: string;

  @ApiProperty({
    description: 'Whether follow-up is required',
    example: true,
  })
  followUpRequired: boolean;

  @ApiPropertyOptional({
    description: 'Follow-up date (ISO 8601)',
    example: '2025-11-22T10:00:00Z',
  })
  followUpDate?: Date;

  @ApiProperty({
    description: 'Session created timestamp (ISO 8601)',
    example: '2025-11-10T08:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Session last updated timestamp (ISO 8601)',
    example: '2025-11-15T11:00:00Z',
  })
  updatedAt: Date;
}

export class AdvisingSessionListResponseDto {
  @ApiProperty({
    description: 'Array of advising sessions',
    type: [AdvisingSessionResponseDto],
  })
  sessions: AdvisingSessionResponseDto[];

  @ApiProperty({
    description: 'Total number of sessions',
    example: 45,
  })
  total: number;
}

export class StartSessionResponseDto {
  @ApiProperty({
    description: 'Whether session was started successfully',
    example: true,
  })
  started: boolean;

  @ApiProperty({
    description: 'Session data',
    type: AdvisingSessionResponseDto,
  })
  session: AdvisingSessionResponseDto;
}

export class CompleteSessionResponseDto {
  @ApiProperty({
    description: 'Whether session was completed successfully',
    example: true,
  })
  completed: boolean;

  @ApiProperty({
    description: 'Whether follow-up was scheduled',
    example: true,
  })
  followUpScheduled: boolean;

  @ApiPropertyOptional({
    description: 'Follow-up session ID',
    example: 'SESSION-67890',
  })
  followUpSessionId?: string;
}

export class CancelSessionResponseDto {
  @ApiProperty({
    description: 'Whether session was cancelled successfully',
    example: true,
  })
  cancelled: boolean;

  @ApiProperty({
    description: 'Whether notification was sent',
    example: true,
  })
  notificationSent: boolean;

  @ApiProperty({
    description: 'Cancellation reason',
    example: 'Student conflict',
  })
  reason: string;

  @ApiProperty({
    description: 'Cancellation timestamp (ISO 8601)',
    example: '2025-11-14T15:30:00Z',
  })
  cancelledAt: Date;
}
