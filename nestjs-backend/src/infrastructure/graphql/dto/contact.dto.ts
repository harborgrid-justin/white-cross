/**
 * GraphQL DTOs for Contact type
 *
 * Defines GraphQL object types, input types, and response types for Contact entity
 * using NestJS GraphQL decorators for code-first schema generation.
 */
import { ObjectType, Field, ID, InputType, registerEnumType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-scalars';
import { PaginationDto } from './pagination.dto';

/**
 * Contact Type Enum for GraphQL
 */
export enum ContactType {
  GUARDIAN = 'guardian',
  STAFF = 'staff',
  VENDOR = 'vendor',
  PROVIDER = 'provider',
  OTHER = 'other'
}

// Register enum with GraphQL
registerEnumType(ContactType, {
  name: 'ContactType',
  description: 'Type of contact (guardian, staff, vendor, provider, other)'
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
  customFields?: any;

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
  firstName: string;

  @Field()
  lastName: string;

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
  customFields?: any;

  @Field({ nullable: true, defaultValue: true })
  isActive?: boolean;

  @Field({ nullable: true })
  notes?: string;
}

/**
 * Contact Update Input for Update Mutation
 */
@InputType()
export class ContactUpdateInputDto {
  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field(() => ContactType, { nullable: true })
  type?: ContactType;

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
  customFields?: any;

  @Field({ nullable: true })
  isActive?: boolean;

  @Field({ nullable: true })
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
  byType: any;
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
