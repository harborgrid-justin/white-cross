/**
 * Course Enrollment DTOs for course enrollment management
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
  Matches,
} from 'class-validator';

export enum CourseLevel {
  INTRODUCTORY = 'introductory',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  GRADUATE = 'graduate',
}

export enum CourseEnrollmentStatus {
  REGISTERED = 'registered',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  DROPPED = 'dropped',
  WITHDRAWN = 'withdrawn',
  AUDITING = 'auditing',
}

export enum SectionFormat {
  IN_PERSON = 'in_person',
  HYBRID = 'hybrid',
  ONLINE = 'online',
  ASYNCHRONOUS = 'asynchronous',
}

export class CourseEnrollmentRequestDto {
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
    description: 'Enrollment type',
    enum: CourseEnrollmentStatus,
    example: CourseEnrollmentStatus.REGISTERED,
  })
  @IsOptional()
  @IsEnum(CourseEnrollmentStatus)
  enrollmentType?: CourseEnrollmentStatus;

  @ApiPropertyOptional({
    description: 'Is audit enrollment',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isAudit?: boolean;

  @ApiPropertyOptional({
    description: 'Enrollment notes',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CourseEnrollmentResponseDto {
  @ApiProperty({
    description: 'Enrollment identifier',
    example: 'ENR-2024001',
  })
  enrollmentId: string;

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
    description: 'Course title',
    example: 'Introduction to Computer Science',
  })
  courseTitle: string;

  @ApiProperty({
    description: 'Course credits',
    example: 3,
    minimum: 0,
    maximum: 6,
  })
  @IsNumber()
  credits: number;

  @ApiProperty({
    description: 'Section number',
    example: '01',
  })
  sectionNumber: string;

  @ApiProperty({
    description: 'Course level',
    enum: CourseLevel,
  })
  courseLevel: CourseLevel;

  @ApiProperty({
    description: 'Section format',
    enum: SectionFormat,
  })
  sectionFormat: SectionFormat;

  @ApiProperty({
    description: 'Enrollment status',
    enum: CourseEnrollmentStatus,
  })
  status: CourseEnrollmentStatus;

  @ApiProperty({
    description: 'Enrollment date',
    example: '2025-11-10T12:00:00Z',
  })
  @Type(() => Date)
  enrolledDate: Date;

  @ApiPropertyOptional({
    description: 'Drop date',
    example: '2025-11-20T12:00:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  dropDate?: Date;
}

export class CourseEnrollmentListDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  studentId: string;

  @ApiProperty({
    description: 'Academic term',
    example: 'FALL2025',
  })
  term: string;

  @ApiProperty({
    description: 'Total credits enrolled',
    example: 15,
    minimum: 0,
  })
  totalCredits: number;

  @ApiProperty({
    description: 'Enrolled courses',
    type: 'array',
  })
  courses: CourseEnrollmentResponseDto[];

  @ApiProperty({
    description: 'Last updated',
    example: '2025-11-10T12:00:00Z',
  })
  @Type(() => Date)
  updatedAt: Date;
}

export class CourseEnrollmentUpdateDto {
  @ApiPropertyOptional({
    description: 'New enrollment status',
    enum: CourseEnrollmentStatus,
  })
  @IsOptional()
  @IsEnum(CourseEnrollmentStatus)
  status?: CourseEnrollmentStatus;

  @ApiPropertyOptional({
    description: 'Grade received',
    example: 'A',
    maxLength: 2,
  })
  @IsOptional()
  @IsString()
  grade?: string;

  @ApiPropertyOptional({
    description: 'Update notes',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Effective date',
    example: '2025-11-10T12:00:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  effectiveDate?: Date;
}

export class BulkCourseEnrollmentDto {
  @ApiProperty({
    description: 'Student identifiers',
    type: [String],
    example: ['STU-2024001', 'STU-2024002'],
  })
  @IsArray()
  @IsString({ each: true })
  studentIds: string[];

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
}

export class CourseEnrollmentQueryDto {
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
    description: 'Academic term filter',
  })
  @IsOptional()
  @IsString()
  term?: string;

  @ApiPropertyOptional({
    description: 'Enrollment status filter',
    enum: CourseEnrollmentStatus,
  })
  @IsOptional()
  @IsEnum(CourseEnrollmentStatus)
  status?: CourseEnrollmentStatus;

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
}
