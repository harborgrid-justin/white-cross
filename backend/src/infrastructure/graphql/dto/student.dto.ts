/**
 * GraphQL DTOs for Student type
 *
 * Defines GraphQL object types, input types, and response types for Student entity
 * using NestJS GraphQL decorators for code-first schema generation.
 */
import { Field, ID, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { PaginationDto } from './pagination.dto';
import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ContactDto } from './contact.dto';
import { MedicationDto } from './medication.dto';
import { HealthRecordDto } from './health-record.dto';
import { EmergencyContactDto } from './emergency-contact.dto';
import { ChronicConditionDto } from './chronic-condition.dto';
import { IncidentReportDto } from './incident-report.dto';
import { AllergyDto } from './allergy.dto';
import {
  BaseHealthcareInputDto,
  BaseHealthcareUpdateInputDto,
  BaseHealthcareFilterInputDto
} from './base/base-healthcare.dto';

/**
 * Gender Enum for GraphQL
 */
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}

// Register enum with GraphQL
registerEnumType(Gender, {
  name: 'Gender',
  description: 'Student gender',
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

  // Field resolvers - these fields are populated by @ResolveField decorators
  @Field(() => [ContactDto], { nullable: 'items', description: 'Guardian contacts for the student' })
  contacts?: ContactDto[];

  @Field(() => [MedicationDto], { nullable: 'items', description: 'Medications assigned to the student' })
  medications?: MedicationDto[];

  @Field(() => HealthRecordDto, { nullable: true, description: 'Health record for the student' })
  healthRecord?: HealthRecordDto;

  @Field(() => Number, { description: 'Count of contacts' })
  contactCount?: number;

  @Field(() => [EmergencyContactDto], { nullable: 'items', description: 'Emergency contacts for the student' })
  emergencyContacts?: EmergencyContactDto[];

  @Field(() => [ChronicConditionDto], { nullable: 'items', description: 'Chronic conditions for the student' })
  chronicConditions?: ChronicConditionDto[];

  @Field(() => [IncidentReportDto], { nullable: 'items', description: 'Recent incident reports for the student' })
  recentIncidents?: IncidentReportDto[];

  // Temporarily commented out to isolate GraphQL schema generation issue
  // @Field(() => [AllergyDto], { nullable: 'items', description: 'Allergies for the student' })
  // allergies?: AllergyDto[];
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
export class StudentInputDto extends BaseHealthcareInputDto {
  @Field()
  @IsString()
  @MinLength(1, { message: 'Student number must not be empty' })
  @MaxLength(20, { message: 'Student number must not exceed 20 characters' })
  studentNumber: string;

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
  @MaxLength(50, {
    message: 'Medical record number must not exceed 50 characters',
  })
  medicalRecordNum?: string;

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
export class StudentUpdateInputDto extends BaseHealthcareUpdateInputDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Student number must not be empty' })
  @MaxLength(20, { message: 'Student number must not exceed 20 characters' })
  studentNumber?: string;

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
  @MaxLength(50, {
    message: 'Medical record number must not exceed 50 characters',
  })
  medicalRecordNum?: string;

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
export class StudentFilterInputDto extends BaseHealthcareFilterInputDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  grade?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  nurseId?: string;
}
