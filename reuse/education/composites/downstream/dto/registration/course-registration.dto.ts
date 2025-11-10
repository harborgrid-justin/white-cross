/**
 * Course Registration DTOs for course registration management
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

export enum RegistrationStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  PENDING_PAYMENT = 'pending_payment',
}

export enum StudentClassification {
  FRESHMAN = 'freshman',
  SOPHOMORE = 'sophomore',
  JUNIOR = 'junior',
  SENIOR = 'senior',
  GRADUATE = 'graduate',
  NON_DEGREE = 'non_degree',
}

export class CourseRegistrationRequestDto {
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
    description: 'Registration purpose',
    example: 'degree_requirement',
  })
  @IsOptional()
  @IsString()
  purpose?: string;
}

export class CourseRegistrationResponseDto {
  @ApiProperty({
    description: 'Registration identifier',
    example: 'REG-2024001',
  })
  registrationId: string;

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
    description: 'Student classification',
    enum: StudentClassification,
  })
  studentClassification: StudentClassification;

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
  credits: number;

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
    description: 'Registration status',
    enum: RegistrationStatus,
  })
  status: RegistrationStatus;

  @ApiProperty({
    description: 'Registration date',
    example: '2025-11-10T12:00:00Z',
  })
  @Type(() => Date)
  registeredDate: Date;

  @ApiPropertyOptional({
    description: 'Completion date',
    example: '2025-11-10T12:30:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  completedDate?: Date;
}

export class BulkCourseRegistrationDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Course identifiers to register',
    type: [String],
    example: ['CRS-CS101', 'CRS-MATH201'],
  })
  @IsArray()
  @IsString({ each: true })
  courseIds: string[];

  @ApiProperty({
    description: 'Academic term',
    example: 'FALL2025',
  })
  @IsString()
  @IsNotEmpty()
  term: string;

  @ApiPropertyOptional({
    description: 'Section numbers (if not default)',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sectionNumbers?: string[];
}

export class RegistrationSessionDto {
  @ApiProperty({
    description: 'Registration session identifier',
    example: 'REGSESS-2024001',
  })
  sessionId: string;

  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  studentId: string;

  @ApiProperty({
    description: 'Session start time',
    example: '2025-11-10T10:00:00Z',
  })
  @Type(() => Date)
  startTime: Date;

  @ApiProperty({
    description: 'Session end time',
    example: '2025-11-10T12:00:00Z',
  })
  @Type(() => Date)
  endTime: Date;

  @ApiProperty({
    description: 'Academic term',
    example: 'FALL2025',
  })
  term: string;

  @ApiProperty({
    description: 'Registration status',
    enum: RegistrationStatus,
  })
  status: RegistrationStatus;

  @ApiProperty({
    description: 'Courses registered so far',
    example: 3,
    minimum: 0,
  })
  coursesRegistered: number;

  @ApiProperty({
    description: 'Total credits',
    example: 9,
    minimum: 0,
  })
  totalCredits: number;
}

export class RegistrationQueryDto {
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
    description: 'Registration status filter',
    enum: RegistrationStatus,
  })
  @IsOptional()
  @IsEnum(RegistrationStatus)
  status?: RegistrationStatus;

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

export class RegistrationHistoryDto {
  @ApiProperty({
    description: 'Student identifier',
    example: 'STU-2024001',
  })
  studentId: string;

  @ApiProperty({
    description: 'Registration history records',
    type: 'array',
  })
  history: Array<{
    registrationId: string;
    term: string;
    courseId: string;
    status: RegistrationStatus;
    registeredDate: Date;
    completedDate?: Date;
  }>;

  @ApiProperty({
    description: 'Last registration date',
    example: '2025-11-10T12:00:00Z',
  })
  @Type(() => Date)
  lastRegistrationDate: Date;
}

export class RegistrationSummaryDto {
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
    description: 'Total courses registered',
    example: 5,
    minimum: 0,
  })
  totalCourses: number;

  @ApiProperty({
    description: 'Total credits',
    example: 15,
    minimum: 0,
  })
  totalCredits: number;

  @ApiProperty({
    description: 'Completed registrations',
    example: 5,
    minimum: 0,
  })
  completedRegistrations: number;

  @ApiProperty({
    description: 'Pending registrations',
    example: 0,
    minimum: 0,
  })
  pendingRegistrations: number;

  @ApiProperty({
    description: 'Last action date',
    example: '2025-11-10T12:00:00Z',
  })
  @Type(() => Date)
  lastActionDate: Date;
}
