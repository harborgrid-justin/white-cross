/**
 * SIS Attendance DTO
 *
 * Data Transfer Object for attendance records from SIS systems.
 * Represents attendance data as received from external Student Information Systems.
 *
 * @module integrations/dto/sis-attendance
 */

import { IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Attendance status values from SIS
 */
export enum SisAttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  TARDY = 'TARDY',
  EXCUSED = 'EXCUSED',
}

/**
 * Attendance record from SIS
 *
 * Contains daily attendance information for a student.
 */
export class SisAttendanceDto {
  /**
   * Student's SIS ID
   * @example "PS-12345"
   */
  @ApiProperty({
    description: "Student's SIS ID",
    example: 'PS-12345',
  })
  @IsString()
  studentSisId: string;

  /**
   * Date of attendance record in ISO 8601 format
   * @example "2024-01-15"
   */
  @ApiProperty({
    description: 'Date of attendance record',
    example: '2024-01-15',
  })
  @IsDateString()
  date: string;

  /**
   * Attendance status for the day
   */
  @ApiProperty({
    description: 'Attendance status for the day',
    enum: SisAttendanceStatus,
    example: SisAttendanceStatus.PRESENT,
  })
  @IsEnum(SisAttendanceStatus)
  status: SisAttendanceStatus;

  /**
   * Optional notes about the attendance record
   * @example "Doctor's appointment"
   */
  @ApiPropertyOptional({
    description: 'Optional notes about the attendance record',
    example: "Doctor's appointment",
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
