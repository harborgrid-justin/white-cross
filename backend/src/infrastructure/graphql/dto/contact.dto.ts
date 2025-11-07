/**
 * GraphQL DTOs for Contact type
 *
 * Defines GraphQL object types, input types, and response types for Contact entity
 * using NestJS GraphQL decorators for code-first schema generation.
 */
import { Field, ID, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-scalars';
import { PaginationDto } from './pagination.dto';
import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

/**
 * Contact Type Enum for GraphQL
 */
export enum ContactType {
  Guardian = 'guardian',
  Staff = 'staff',
  Vendor = 'vendor',
  Provider = 'provider',
  Other = 'other',
}

// Register enum with GraphQL
registerEnumType(ContactType, {
  name: 'ContactType',
  description: 'Type of contact (guardian, staff, vendor, provider, other)',
});

/**
 * Contact GraphQL Object Type
 */
@ObjectType()
export class ContactDto {
  @Field(() => ID)
  id: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  fullName: string;

  @Field()
  displayName: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field(() => ContactType)
  type: ContactType;

  @Field({ nullable: true })
  organization?: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  state?: string;

  @Field({ nullable: true })
  zip?: string;

  @Field(() => ID, { nullable: true })
  relationTo?: string;

  @Field({ nullable: true })
  relationshipType?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  customFields?: Record<string, unknown>;

  @Field()
  isActive: boolean;

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
 * Contact List Response with Pagination
 */
@ObjectType()
export class ContactListResponseDto {
  @Field(() => [ContactDto])
  contacts: ContactDto[];

  @Field(() => PaginationDto)
  pagination: PaginationDto;
}

/**
 * Contact Input for Create Mutation
 */
@InputType()
export class ContactInputDto {
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

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  @MaxLength(100, { message: 'Email must not exceed 100 characters' })
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message:
      'Invalid phone number format. Use E.164 format (e.g., +12345678900)',
  })
  phone?: string;

  @Field(() => ContactType)
  @IsEnum(ContactType, { message: 'Invalid contact type' })
  type: ContactType;

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

  @Field({ nullable: true, defaultValue: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Notes must not exceed 1000 characters' })
  notes?: string;
}

/**
 * Contact Update Input for Update Mutation
 */
@InputType()
export class ContactUpdateInputDto {
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
  @IsEmail({}, { message: 'Invalid email format' })
  @MaxLength(100, { message: 'Email must not exceed 100 characters' })
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message:
      'Invalid phone number format. Use E.164 format (e.g., +12345678900)',
  })
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
  @IsBoolean()
  isActive?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Notes must not exceed 1000 characters' })
  notes?: string;
}

/**
 * Contact Filter Input for Queries
 */
@InputType()
export class ContactFilterInputDto {
  @Field(() => ContactType, { nullable: true })
  type?: ContactType;

  @Field(() => [ContactType], { nullable: true })
  types?: ContactType[];

  @Field({ nullable: true })
  isActive?: boolean;

  @Field(() => ID, { nullable: true })
  relationTo?: string;

  @Field({ nullable: true })
  search?: string;
}

/**
 * Contact Statistics
 */
@ObjectType()
export class ContactStatsDto {
  @Field()
  total: number;

  @Field(() => GraphQLJSON)
  byType: Record<string, number>;
}

/**
 * Delete Response
 */
@ObjectType()
export class DeleteResponseDto {
  @Field()
  success: boolean;

  @Field()
  message: string;
}
