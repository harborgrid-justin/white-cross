/**
 * Base Health Record Fields for GraphQL DTOs
 * 
 * Shared field definitions for HealthRecord create and update input DTOs
 * to eliminate duplication between HealthRecordCreateInputDto and HealthRecordUpdateInputDto
 */
import { Field } from '@nestjs/graphql';
import { IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Base health record field definitions
 * Used as a mixin for health record input DTOs
 */
export abstract class BaseHealthRecordFieldsDto {
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
}