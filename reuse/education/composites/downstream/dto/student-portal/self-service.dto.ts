/**
 * Student Self-Service Portal DTOs
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsEnum,
  IsArray,
  IsBoolean,
  IsDate,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export enum PreferenceCategory {
  COMMUNICATION = 'communication',
  PRIVACY = 'privacy',
  NOTIFICATIONS = 'notifications',
  ACCESSIBILITY = 'accessibility',
}

export class UpdateStudentProfileDto {
  @ApiPropertyOptional({ description: 'Preferred email', example: 'student@example.com' })
  @IsOptional()
  @IsEmail()
  preferredEmail?: string;

  @ApiPropertyOptional({ description: 'Phone number', example: '+1-555-123-4567' })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/)
  phoneNumber?: string;

  @ApiPropertyOptional({ description: 'Mailing address', type: 'object' })
  @IsOptional()
  mailingAddress?: {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  @ApiPropertyOptional({ description: 'Emergency contact', type: 'object' })
  @IsOptional()
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
}

export class StudentProfileResponseDto {
  @ApiProperty({ description: 'Student identifier', example: 'STU-123456' })
  studentId: string;

  @ApiProperty({ description: 'Full name', example: 'John Doe' })
  fullName: string;

  @ApiProperty({ description: 'Email', example: 'student@example.com' })
  email: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  phoneNumber?: string;

  @ApiProperty({ description: 'Major', example: 'Computer Science' })
  major: string;

  @ApiProperty({ description: 'Current GPA', example: 3.5 })
  gpa: number;

  @ApiProperty({ description: 'Credits completed', example: 60 })
  creditsCompleted: number;

  @ApiProperty({ description: 'Expected graduation' })
  expectedGraduation: Date;

  @ApiPropertyOptional({ description: 'Mailing address' })
  mailingAddress?: object;

  @ApiPropertyOptional({ description: 'Emergency contact' })
  emergencyContact?: object;
}

export class SetPreferencesDto {
  @ApiProperty({ description: 'Preference category', enum: PreferenceCategory })
  @IsEnum(PreferenceCategory)
  category: PreferenceCategory;

  @ApiProperty({ description: 'Preferences', type: 'object' })
  @IsNotEmpty()
  preferences: Record<string, any>;
}

export class PreferencesResponseDto {
  @ApiProperty({ description: 'Student preferences by category', type: 'object' })
  preferences: Record<PreferenceCategory, Record<string, any>>;

  @ApiProperty({ description: 'Last updated' })
  updatedAt: Date;
}

export class DocumentRequestDto {
  @ApiProperty({ description: 'Document type', example: 'transcript' })
  @IsString()
  @IsNotEmpty()
  documentType: string;

  @ApiProperty({ description: 'Delivery method', enum: ['email', 'mail', 'pickup'] })
  @IsEnum(['email', 'mail', 'pickup'])
  deliveryMethod: 'email' | 'mail' | 'pickup';

  @ApiPropertyOptional({ description: 'Delivery address for mail', type: 'object' })
  @IsOptional()
  deliveryAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };

  @ApiPropertyOptional({ description: 'Special instructions', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  instructions?: string;
}

export class DocumentRequestResponseDto {
  @ApiProperty({ description: 'Request identifier', example: 'REQ-789' })
  requestId: string;

  @ApiProperty({ description: 'Document type', example: 'transcript' })
  documentType: string;

  @ApiProperty({ description: 'Request status', enum: ['pending', 'processing', 'completed', 'cancelled'] })
  status: string;

  @ApiProperty({ description: 'Requested date' })
  requestedDate: Date;

  @ApiPropertyOptional({ description: 'Estimated completion date' })
  estimatedCompletion?: Date;

  @ApiPropertyOptional({ description: 'Tracking information' })
  trackingInfo?: string;
}

export class CourseSearchDto {
  @ApiPropertyOptional({ description: 'Search term', example: 'Computer Science' })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiPropertyOptional({ description: 'Term identifier', example: 'FALL2025' })
  @IsOptional()
  @IsString()
  termId?: string;

  @ApiPropertyOptional({ description: 'Department code', example: 'CS' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({ description: 'Course level', example: '300' })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiPropertyOptional({ description: 'Has available seats', example: true })
  @IsOptional()
  @IsBoolean()
  hasSeatsAvailable?: boolean;
}

export class CourseSearchResultDto {
  @ApiProperty({ description: 'Course identifier', example: 'CS301' })
  courseId: string;

  @ApiProperty({ description: 'Course name', example: 'Data Structures' })
  courseName: string;

  @ApiProperty({ description: 'Credits', example: 3 })
  credits: number;

  @ApiProperty({ description: 'Sections available', type: 'array' })
  sections: Array<{
    sectionId: string;
    instructor: string;
    schedule: string;
    seatsAvailable: number;
  }>;
}

export class RegisterForCoursesDto {
  @ApiProperty({ description: 'Course section IDs to register for', type: [String] })
  @IsArray()
  @IsString({ each: true })
  sectionIds: string[];

  @ApiPropertyOptional({ description: 'Alternative sections (waitlist)', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  alternativeSections?: string[];
}

export class RegistrationResultDto {
  @ApiProperty({ description: 'Successful registrations', type: [String] })
  successful: string[];

  @ApiProperty({ description: 'Failed registrations', type: 'array' })
  failed: Array<{
    sectionId: string;
    reason: string;
  }>;

  @ApiProperty({ description: 'Waitlisted courses', type: [String] })
  waitlisted: string[];
}
