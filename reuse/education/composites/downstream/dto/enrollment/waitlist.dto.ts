/**
 * Waitlist DTOs for managing course waitlists
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  ValidateNested,
  Min,
  Max,
  IsEmail,
} from 'class-validator';

export enum WaitlistStatus {
  ACTIVE = 'active',
  OFFERED_SEAT = 'offered_seat',
  ENROLLED = 'enrolled',
  REMOVED = 'removed',
  EXPIRED = 'expired',
  DECLINED = 'declined',
}

export enum RemovalReason {
  STUDENT_REQUEST = 'student_request',
  ENROLLMENT_COMPLETED = 'enrollment_completed',
  ENROLLMENT_OFFER_DECLINED = 'enrollment_offer_declined',
  COURSE_CANCELLED = 'course_cancelled',
  DEADLINE_PASSED = 'deadline_passed',
  CAPACITY_FULL = 'capacity_full',
}

export class AddToWaitlistRequestDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Course identifier',
    example: 'CRS-CS101',
  })
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty({
    description: 'Section number',
    example: '01',
  })
  @IsString()
  @IsNotEmpty()
  sectionNumber: string;

  @ApiProperty({
    description: 'Academic term',
    example: 'FALL2025',
  })
  @IsString()
  @IsNotEmpty()
  term: string;

  @ApiPropertyOptional({
    description: 'Priority level (1=highest)',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  priority?: number;

  @ApiPropertyOptional({
    description: 'Additional notes from student',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class WaitlistEntryDto {
  @ApiProperty({
    description: 'Waitlist entry identifier',
    example: 'WL-2024001',
  })
  waitlistId: string;

  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  studentId: string;

  @ApiProperty({
    description: 'Student name',
    example: 'John Doe',
  })
  studentName: string;

  @ApiProperty({
    description: 'Course identifier',
    example: 'CRS-CS101',
  })
  courseId: string;

  @ApiProperty({
    description: 'Course title',
    example: 'Introduction to Computer Science',
  })
  courseTitle: string;

  @ApiProperty({
    description: 'Section number',
    example: '01',
  })
  sectionNumber: string;

  @ApiProperty({
    description: 'Academic term',
    example: 'FALL2025',
  })
  term: string;

  @ApiProperty({
    description: 'Current waitlist status',
    enum: WaitlistStatus,
  })
  status: WaitlistStatus;

  @ApiProperty({
    description: 'Position on waitlist',
    example: 5,
    minimum: 0,
  })
  position: number;

  @ApiProperty({
    description: 'Registered on waitlist date',
    example: '2025-11-10T12:00:00Z',
  })
  @Type(() => Date)
  registeredDate: Date;

  @ApiPropertyOptional({
    description: 'Date offered a seat',
    example: '2025-11-15T14:30:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  offeredDate?: Date;

  @ApiPropertyOptional({
    description: 'Date removed from waitlist',
    example: '2025-11-20T10:00:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  removedDate?: Date;

  @ApiPropertyOptional({
    description: 'Removal reason',
    enum: RemovalReason,
  })
  @IsOptional()
  removedReason?: RemovalReason;
}

export class WaitlistOfferDto {
  @ApiProperty({
    description: 'Offer identifier',
    example: 'OFFER-2024001',
  })
  offerId: string;

  @ApiProperty({
    description: 'Waitlist entry identifier',
    example: 'WL-2024001',
  })
  waitlistId: string;

  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  studentId: string;

  @ApiProperty({
    description: 'Course identifier',
    example: 'CRS-CS101',
  })
  courseId: string;

  @ApiProperty({
    description: 'Section number',
    example: '01',
  })
  sectionNumber: string;

  @ApiProperty({
    description: 'Offer made date',
    example: '2025-11-15T14:30:00Z',
  })
  @Type(() => Date)
  offerDate: Date;

  @ApiProperty({
    description: 'Offer expires date',
    example: '2025-11-17T23:59:00Z',
  })
  @Type(() => Date)
  expiryDate: Date;

  @ApiProperty({
    description: 'Time remaining to respond (hours)',
    example: 48,
    minimum: 0,
  })
  hoursRemaining: number;
}

export class WaitlistActionDto {
  @ApiProperty({
    description: 'Waitlist entry identifier',
    example: 'WL-2024001',
  })
  @IsString()
  @IsNotEmpty()
  waitlistId: string;

  @ApiProperty({
    description: 'Action to perform',
    enum: ['accept', 'decline', 'remove'],
    example: 'accept',
  })
  @IsEnum(['accept', 'decline', 'remove'])
  action: 'accept' | 'decline' | 'remove';

  @ApiPropertyOptional({
    description: 'Action reason or notes',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class WaitlistQueryDto {
  @ApiPropertyOptional({
    description: 'Student identifier filter',
  })
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiPropertyOptional({
    description: 'Course identifier filter',
  })
  @IsOptional()
  @IsString()
  courseId?: string;

  @ApiPropertyOptional({
    description: 'Waitlist status filter',
    enum: WaitlistStatus,
  })
  @IsOptional()
  @IsEnum(WaitlistStatus)
  status?: WaitlistStatus;

  @ApiPropertyOptional({
    description: 'Academic term filter',
  })
  @IsOptional()
  @IsString()
  term?: string;

  @ApiPropertyOptional({
    description: 'Page number',
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Items per page',
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Sort by position',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortBy?: 'asc' | 'desc';
}

export class WaitlistStatisticsDto {
  @ApiProperty({
    description: 'Course identifier',
    example: 'CRS-CS101',
  })
  courseId: string;

  @ApiProperty({
    description: 'Course title',
    example: 'Introduction to Computer Science',
  })
  courseTitle: string;

  @ApiProperty({
    description: 'Academic term',
    example: 'FALL2025',
  })
  term: string;

  @ApiProperty({
    description: 'Course capacity',
    example: 30,
    minimum: 0,
  })
  capacity: number;

  @ApiProperty({
    description: 'Current enrollments',
    example: 30,
    minimum: 0,
  })
  enrollments: number;

  @ApiProperty({
    description: 'Total on waitlist',
    example: 15,
    minimum: 0,
  })
  waitlistCount: number;

  @ApiProperty({
    description: 'Students offered seats',
    example: 5,
    minimum: 0,
  })
  offeredSeats: number;

  @ApiProperty({
    description: 'Estimated wait days',
    example: 7,
    minimum: 0,
  })
  estimatedWaitDays: number;
}
