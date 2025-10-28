/**
 * SIS Student DTO
 *
 * Data Transfer Object for student enrollment data from SIS systems.
 * Represents a student record as received from external Student Information Systems
 * like PowerSchool, Infinite Campus, etc.
 *
 * @module integrations/dto/sis-student
 */

import { IsString, IsEmail, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Student enrollment status values from SIS
 */
export enum SisEnrollmentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  TRANSFERRED = 'TRANSFERRED',
}

/**
 * Student enrollment data from SIS
 *
 * Contains core student information synchronized from external SIS systems.
 */
export class SisStudentDto {
  /**
   * Unique identifier from the SIS system
   * @example "PS-12345"
   */
  @ApiProperty({
    description: 'Unique identifier from the SIS system',
    example: 'PS-12345',
  })
  @IsString()
  sisId: string;

  /**
   * Student's first name
   * @example "John"
   */
  @ApiProperty({
    description: "Student's first name",
    example: 'John',
  })
  @IsString()
  firstName: string;

  /**
   * Student's last name
   * @example "Doe"
   */
  @ApiProperty({
    description: "Student's last name",
    example: 'Doe',
  })
  @IsString()
  lastName: string;

  /**
   * Student's date of birth in ISO 8601 format
   * @example "2010-05-15"
   */
  @ApiProperty({
    description: "Student's date of birth",
    example: '2010-05-15',
  })
  @IsDateString()
  dateOfBirth: string;

  /**
   * Student's current grade level
   * @example "8"
   */
  @ApiProperty({
    description: "Student's current grade level",
    example: '8',
  })
  @IsString()
  grade: string;

  /**
   * Current enrollment status
   */
  @ApiProperty({
    description: 'Current enrollment status',
    enum: SisEnrollmentStatus,
    example: SisEnrollmentStatus.ACTIVE,
  })
  @IsEnum(SisEnrollmentStatus)
  enrollmentStatus: SisEnrollmentStatus;

  /**
   * Date when student was enrolled (optional)
   * @example "2023-09-01"
   */
  @ApiPropertyOptional({
    description: 'Date when student was enrolled',
    example: '2023-09-01',
  })
  @IsOptional()
  @IsDateString()
  enrollmentDate?: string;

  /**
   * Student's email address (optional)
   * @example "john.doe@school.edu"
   */
  @ApiPropertyOptional({
    description: "Student's email address",
    example: 'john.doe@school.edu',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  /**
   * Student's phone number (optional)
   * @example "+1-555-0100"
   */
  @ApiPropertyOptional({
    description: "Student's phone number",
    example: '+1-555-0100',
  })
  @IsOptional()
  @IsString()
  phone?: string;
}
