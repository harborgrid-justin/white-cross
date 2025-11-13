/**
 * Base Contact Fields Mixin for GraphQL DTOs
 *
 * Shared field definitions for Contact create and update input DTOs
 * to eliminate duplication between ContactCreateInputDto and ContactUpdateInputDto
 */
import { Field, ID } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-scalars';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ContactType } from '../contact.dto';

/**
 * Base contact field definitions
 * Used as a mixin for contact input DTOs
 */
export abstract class BaseContactFieldsDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  @MaxLength(100, { message: 'Email must not exceed 100 characters' })
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsPhoneNumber('US', { message: 'Invalid phone number format' })
  @MaxLength(15, { message: 'Phone must not exceed 15 characters' })
  phone?: string;

  @Field(() => ContactType, { nullable: true })
  @IsOptional()
  @IsEnum(ContactType, { message: 'Invalid contact type' })
  type?: ContactType;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Organization must not exceed 100 characters' })
  organization?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Title must not exceed 50 characters' })
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Address must not exceed 200 characters' })
  address?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'City must not exceed 50 characters' })
  city?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2, { message: 'State must be 2 characters' })
  @MinLength(2, { message: 'State must be 2 characters' })
  @Matches(/^[A-Z]{2}$/, {
    message: 'State must be 2 uppercase letters (e.g., CA, NY)',
  })
  state?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Matches(/^\d{5}(-\d{4})?$/, {
    message: 'Invalid ZIP code format (e.g., 12345 or 12345-6789)',
  })
  zip?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  relationTo?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Relationship type must not exceed 50 characters' })
  relationshipType?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  customFields?: Record<string, unknown>;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Notes must not exceed 1000 characters' })
  notes?: string;
}