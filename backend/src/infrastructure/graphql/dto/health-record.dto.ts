/**
 * GraphQL DTOs for HealthRecord type
 *
 * Defines GraphQL object types, input types, and response types for HealthRecord entity
 * using NestJS GraphQL decorators for code-first schema generation.
 *
 * HIPAA Compliance:
 * - All health record data is Protected Health Information (PHI)
 * - Access must be restricted to authorized users only
 * - All operations must be audited
 */
import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-scalars';
import { PaginationDto } from './pagination.dto';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsUUID,
  MinLength,
  MaxLength,
  IsArray,
} from 'class-validator';

/**
 * HealthRecord GraphQL Object Type
 */
@ObjectType()
export class HealthRecordDto {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  studentId: string;

  @Field()
  recordType: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  recordDate: Date;

  @Field({ nullable: true })
  provider?: string;

  @Field({ nullable: true })
  providerNpi?: string;

  @Field({ nullable: true })
  facility?: string;

  @Field({ nullable: true })
  facilityNpi?: string;

  @Field({ nullable: true })
  diagnosis?: string;

  @Field({ nullable: true })
  diagnosisCode?: string;

  @Field({ nullable: true })
  treatment?: string;

  @Field()
  followUpRequired: boolean;

  @Field({ nullable: true })
  followUpDate?: Date;

  @Field()
  followUpCompleted: boolean;

  @Field(() => [String])
  attachments: string[];

  @Field(() => GraphQLJSON, { nullable: true })
  metadata?: Record<string, unknown>;

  @Field()
  isConfidential: boolean;

  @Field({ nullable: true })
  notes?: string;

  @Field(() => ID, { nullable: true })
  createdBy?: string;

  @Field(() => ID, { nullable: true })
  updatedBy?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

/**
 * HealthRecord List Response with Pagination
 */
@ObjectType()
export class HealthRecordListResponseDto {
  @Field(() => [HealthRecordDto])
  healthRecords: HealthRecordDto[];

  @Field(() => PaginationDto)
  pagination: PaginationDto;
}

/**
 * HealthRecord Input for Create Mutation
 */
@InputType()
export class HealthRecordInputDto {
  @Field(() => ID)
  @IsUUID(4, { message: 'Student ID must be a valid UUID' })
  studentId: string;

  @Field()
  @IsString()
  @MinLength(1, { message: 'Record type must not be empty' })
  @MaxLength(100, { message: 'Record type must not exceed 100 characters' })
  recordType: string;

  @Field()
  @IsString()
  @MinLength(1, { message: 'Title must not be empty' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  title: string;

  @Field()
  @IsString()
  @MinLength(1, { message: 'Description must not be empty' })
  @MaxLength(2000, { message: 'Description must not exceed 2000 characters' })
  description: string;

  @Field()
  @IsDateString({}, { message: 'Invalid date format for record date' })
  recordDate: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Provider name must not exceed 200 characters' })
  provider?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'Provider NPI must not exceed 20 characters' })
  providerNpi?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Facility name must not exceed 200 characters' })
  facility?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'Facility NPI must not exceed 20 characters' })
  facilityNpi?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Diagnosis must not exceed 500 characters' })
  diagnosis?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'Diagnosis code must not exceed 20 characters' })
  diagnosisCode?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Treatment must not exceed 2000 characters' })
  treatment?: string;

  @Field({ defaultValue: false })
  @IsOptional()
  @IsBoolean()
  followUpRequired?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString({}, { message: 'Invalid date format for follow-up date' })
  followUpDate?: Date;

  @Field(() => [String], { nullable: true, defaultValue: [] })
  @IsOptional()
  @IsArray()
  attachments?: string[];

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  metadata?: Record<string, unknown>;

  @Field({ defaultValue: false })
  @IsOptional()
  @IsBoolean()
  isConfidential?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(5000, { message: 'Notes must not exceed 5000 characters' })
  notes?: string;
}

/**
 * HealthRecord Update Input for Update Mutation
 */
@InputType()
export class HealthRecordUpdateInputDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Record type must not be empty' })
  @MaxLength(100, { message: 'Record type must not exceed 100 characters' })
  recordType?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Title must not be empty' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Description must not be empty' })
  @MaxLength(2000, { message: 'Description must not exceed 2000 characters' })
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString({}, { message: 'Invalid date format for record date' })
  recordDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Provider name must not exceed 200 characters' })
  provider?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'Provider NPI must not exceed 20 characters' })
  providerNpi?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Facility name must not exceed 200 characters' })
  facility?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'Facility NPI must not exceed 20 characters' })
  facilityNpi?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Diagnosis must not exceed 500 characters' })
  diagnosis?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'Diagnosis code must not exceed 20 characters' })
  diagnosisCode?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Treatment must not exceed 2000 characters' })
  treatment?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  followUpRequired?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString({}, { message: 'Invalid date format for follow-up date' })
  followUpDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  followUpCompleted?: boolean;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  attachments?: string[];

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  metadata?: Record<string, unknown>;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isConfidential?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(5000, { message: 'Notes must not exceed 5000 characters' })
  notes?: string;
}

/**
 * HealthRecord Filter Input for Queries
 */
@InputType()
export class HealthRecordFilterInputDto {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  studentId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  recordType?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isConfidential?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  followUpRequired?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  followUpCompleted?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString({}, { message: 'Invalid date format for from date' })
  fromDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString({}, { message: 'Invalid date format for to date' })
  toDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string;
}
