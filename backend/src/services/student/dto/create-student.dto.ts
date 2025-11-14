/**
 * @fileoverview Create Student DTO
 * @module student/dto/create-student.dto
 * @description DTO for creating new student records with comprehensive validation
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Gender } from '@/database/models';

/**
 * Create Student DTO
 *
 * Used for POST /students endpoint
 * All required fields must be provided
 * Includes comprehensive validation rules from legacy system
 */
export class CreateStudentDto {
  @ApiProperty({
    description: 'Unique student identifier (4-20 alphanumeric characters with optional hyphens)',
    example: 'STU-2024-001',
    minLength: 4,
    maxLength: 20,
  })
  @IsNotEmpty({ message: 'Student number is required' })
  @IsString()
  @Length(4, 20, {
    message: 'Student number must be between 4 and 20 characters',
  })
  @Matches(/^[A-Z0-9-]+$/i, {
    message: 'Student number must be alphanumeric with optional hyphens',
  })
  studentNumber!: string;

  @ApiProperty({
    description: 'Student first name (1-100 characters, letters/spaces/hyphens/apostrophes only)',
    example: 'Emma',
    minLength: 1,
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'First name is required' })
  @IsString()
  @Length(1, 100, {
    message: 'First name must be between 1 and 100 characters',
  })
  @Matches(/^[a-zA-Z\s'-]+$/, {
    message: 'First name can only contain letters, spaces, hyphens, and apostrophes',
  })
  firstName!: string;

  @ApiProperty({
    description: 'Student last name (1-100 characters, letters/spaces/hyphens/apostrophes only)',
    example: 'Wilson',
    minLength: 1,
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString()
  @Length(1, 100, { message: 'Last name must be between 1 and 100 characters' })
  @Matches(/^[a-zA-Z\s'-]+$/, {
    message: 'Last name can only contain letters, spaces, hyphens, and apostrophes',
  })
  lastName!: string;

  @ApiProperty({
    description: 'Date of birth (must be in past, age 3-100 years)',
    example: '2015-03-15',
    type: 'string',
    format: 'date',
  })
  @IsNotEmpty({ message: 'Date of birth is required' })
  @IsDate({ message: 'Date of birth must be a valid date' })
  @Type(() => Date)
  dateOfBirth!: Date;

  @ApiProperty({
    description: 'Current grade level (1-10 characters)',
    example: '3',
    minLength: 1,
    maxLength: 10,
  })
  @IsNotEmpty({ message: 'Grade is required' })
  @IsString()
  @Length(1, 10, { message: 'Grade must be between 1 and 10 characters' })
  grade!: string;

  @ApiProperty({
    description: 'Student gender',
    enum: Gender,
    example: Gender.FEMALE,
  })
  @IsNotEmpty({ message: 'Gender is required' })
  @IsEnum(Gender, {
    message: 'Gender must be MALE, FEMALE, OTHER, or PREFER_NOT_TO_SAY',
  })
  gender!: Gender;

  @ApiProperty({
    description: 'Photo URL (max 500 characters)',
    example: 'https://example.com/photos/student.jpg',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Photo URL cannot exceed 500 characters' })
  @IsUrl({}, { message: 'Photo must be a valid URL' })
  photo?: string;

  @ApiProperty({
    description: 'Medical record number (5-20 alphanumeric characters with optional hyphens)',
    example: 'MRN-12345',
    required: false,
    minLength: 5,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @Length(5, 20, {
    message: 'Medical record number must be between 5 and 20 characters',
  })
  @Matches(/^[A-Z0-9-]+$/i, {
    message: 'Medical record number must be alphanumeric with optional hyphens',
  })
  medicalRecordNum?: string;

  @ApiProperty({
    description: 'UUID of assigned nurse',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID(4, { message: 'Nurse ID must be a valid UUID' })
  nurseId?: string;

  @ApiProperty({
    description: 'Enrollment date (defaults to current date if not provided)',
    example: '2024-09-01',
    required: false,
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDate({ message: 'Enrollment date must be a valid date' })
  @Type(() => Date)
  enrollmentDate?: Date;

  @ApiProperty({
    description: 'UUID of user creating this record (for audit trail)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID(4, { message: 'Created by must be a valid UUID' })
  createdBy?: string;
}
