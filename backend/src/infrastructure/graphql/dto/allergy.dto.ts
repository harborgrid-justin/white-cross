import { Field, ObjectType, ID } from '@nestjs/graphql';

/**
 * Allergy GraphQL DTO
 *
 * Represents an allergy for a student in GraphQL responses
 */
@ObjectType('Allergy')
export class AllergyDto {
  @Field(() => ID, { description: 'Unique identifier for the allergy' })
  id!: string;

  @Field({ description: 'Name of the allergen' })
  allergen!: string;

  @Field({ description: 'Severity level of the allergy' })
  severity!: string;

  @Field({ nullable: true, description: 'Description of the allergic reaction' })
  reaction?: string;

  @Field({ nullable: true, description: 'Treatment or medication for the allergy' })
  treatment?: string;

  @Field({ nullable: true, description: 'Date when the allergy was first identified' })
  identifiedDate?: Date;

  @Field({ nullable: true, description: 'Healthcare provider who identified the allergy' })
  identifiedBy?: string;

  @Field({ nullable: true, description: 'Special notes or instructions' })
  notes?: string;

  @Field({ description: 'Whether this allergy is currently active' })
  isActive!: boolean;

  @Field({ description: 'Date when the record was created' })
  createdAt!: Date;

  @Field({ description: 'Date when the record was last updated' })
  updatedAt!: Date;
}
