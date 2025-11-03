/**
 * GraphQL DTOs for Student type
 *
 * Defines GraphQL object types, input types, and response types for Student entity
 * using NestJS GraphQL decorators for code-first schema generation.
 */
import { ObjectType, Field, ID, InputType, registerEnumType } from '@nestjs/graphql';
import { PaginationDto } from './pagination.dto';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsDateString,
  MinLength,
  MaxLength,
  Matches
} from 'class-validator';

/**
 * Gender Enum for GraphQL
 */
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY'
}

// Register enum with GraphQL
registerEnumType(Gender, {
  name: 'Gender',
  description: 'Student gender'
});

/**
 * Student GraphQL Object Type
 */
@ObjectType()
export class StudentDto {
  @Field(() => ID)
  id: string;

  @Field()
  studentNumber: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  fullName: string;

  @Field()
  dateOfBirth: Date;

  @Field()
  grade: string;

  @Field(() => Gender)
  gender: Gender;

  @Field({ nullable: true })
  photo?: string;

  @Field({ nullable: true })
  medicalRecordNum?: string;

  @Field()
  isActive: boolean;

  @Field()
  enrollmentDate: Date;

  @Field(() => ID, { nullable: true })
  nurseId?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

/**
 * Student List Response with Pagination
 */
@ObjectType()
export class StudentListResponseDto {
  @Field(() => [StudentDto])
  students: StudentDto[];

  @Field(() => PaginationDto)
  pagination: PaginationDto;
}

/**
 * Student Input for Create Mutation
 */
@InputType()
export class StudentInputDto {
  @Field()
  @IsString()
  @MinLength(1, { message: 'Student number must not be empty' })
  @MaxLength(20, { message: 'Student number must not exceed 20 characters' })
  studentNumber: string;

  @Field()
  @IsString()
  @MinLength(1, { message: 'First name must not be empty' })
  @MaxLength(50, { message: 'First name must not exceed 50 characters' })
  firstName: string;

  @Field()
  @IsString()
  @MinLength(1, { message: 'Last name must not be empty' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
  lastName: string;

  @Field()
  @IsDateString({}, { message: 'Invalid date format for date of birth' })
  dateOfBirth: Date;

  @Field()
  @IsString()
  @Matches(/^(K|[1-9]|1[0-2])$/, { message: 'Grade must be K or 1-12' })
  grade: string;

  @Field(() => Gender)
  @IsEnum(Gender, { message: 'Invalid gender value' })
  gender: Gender;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Photo URL must not exceed 500 characters' })
  photo?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Medical record number must not exceed 50 characters' })
  medicalRecordNum?: string;

  @Field({ nullable: true, defaultValue: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field()
  @IsDateString({}, { message: 'Invalid date format for enrollment date' })
  enrollmentDate: Date;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  nurseId?: string;
}

/**
 * Student Update Input for Update Mutation
 */
@InputType()
export class StudentUpdateInputDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Student number must not be empty' })
  @MaxLength(20, { message: 'Student number must not exceed 20 characters' })
  studentNumber?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'First name must not be empty' })
  @MaxLength(50, { message: 'First name must not exceed 50 characters' })
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Last name must not be empty' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
  lastName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString({}, { message: 'Invalid date format for date of birth' })
  dateOfBirth?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Matches(/^(K|[1-9]|1[0-2])$/, { message: 'Grade must be K or 1-12' })
  grade?: string;

  @Field(() => Gender, { nullable: true })
  @IsOptional()
  @IsEnum(Gender, { message: 'Invalid gender value' })
  gender?: Gender;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Photo URL must not exceed 500 characters' })
  photo?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Medical record number must not exceed 50 characters' })
  medicalRecordNum?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString({}, { message: 'Invalid date format for enrollment date' })
  enrollmentDate?: Date;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  nurseId?: string;
}

/**
 * Student Filter Input for Queries
 */
@InputType()
export class StudentFilterInputDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  grade?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  nurseId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string;
}
