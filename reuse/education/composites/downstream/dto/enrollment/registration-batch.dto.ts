/**
 * Registration Batch Processing DTOs
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';

export class ProcessRegistrationBatchDto {
  @ApiProperty({ description: 'Registration requests', type: 'array' })
  @IsArray()
  registrations: Array<{
    studentId: string;
    courseId: string;
    sectionId: string;
  }>;
}

export class ValidateCourseCapacitiesDto {
  @ApiProperty({ description: 'Term identifier', example: 'FALL2025' })
  @IsString()
  @IsNotEmpty()
  termId: string;
}

export class CourseCapacityDto {
  @ApiProperty({ description: 'Course identifier', example: 'CS301' })
  courseId: string;

  @ApiProperty({ description: 'Section identifier', example: 'CS301-01' })
  sectionId: string;

  @ApiProperty({ description: 'Maximum capacity', example: 30 })
  @IsNumber()
  @Min(0)
  maxCapacity: number;

  @ApiProperty({ description: 'Current enrollment', example: 28 })
  @IsNumber()
  @Min(0)
  currentEnrollment: number;

  @ApiProperty({ description: 'Available seats', example: 2 })
  @IsNumber()
  @Min(0)
  availableSeats: number;

  @ApiProperty({ description: 'Waitlist count', example: 5 })
  @IsNumber()
  @Min(0)
  waitlistCount: number;

  @ApiProperty({ description: 'Is full', example: false })
  isFull: boolean;
}

export class ManageWaitlistDto {
  @ApiProperty({ description: 'Course identifier', example: 'CS301' })
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @ApiPropertyOptional({ description: 'Number of seats to process from waitlist', example: 2 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  seatsToProcess?: number;
}

export class WaitlistProcessingResponseDto {
  @ApiProperty({ description: 'Students enrolled from waitlist', example: 2 })
  enrolled: number;

  @ApiProperty({ description: 'Remaining on waitlist', example: 3 })
  remainingOnWaitlist: number;

  @ApiProperty({ description: 'Student IDs enrolled', type: [String] })
  studentsEnrolled: string[];
}

export class SectionOptimizationDto {
  @ApiProperty({ description: 'Term identifier', example: 'FALL2025' })
  termId: string;

  @ApiProperty({ description: 'Optimization recommendations', type: 'array' })
  recommendations: Array<{
    courseId: string;
    action: 'add_section' | 'cancel_section' | 'increase_capacity' | 'decrease_capacity';
    reason: string;
    impact: string;
  }>;
}

export class LowEnrollmentCoursesDto {
  @ApiProperty({ description: 'Term identifier', example: 'FALL2025' })
  @IsString()
  @IsNotEmpty()
  termId: string;

  @ApiPropertyOptional({ description: 'Minimum enrollment threshold', example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  minimumThreshold?: number;
}

export class LowEnrollmentCourseDto {
  @ApiProperty({ description: 'Course identifier', example: 'PHIL401' })
  courseId: string;

  @ApiProperty({ description: 'Course name', example: 'Advanced Philosophy' })
  courseName: string;

  @ApiProperty({ description: 'Current enrollment', example: 7 })
  enrollment: number;

  @ApiProperty({ description: 'Minimum required', example: 10 })
  minimumRequired: number;

  @ApiProperty({ description: 'Recommendation', example: 'Cancel or consolidate' })
  recommendation: string;
}
