import { Field, ObjectType, ID } from '@nestjs/graphql';

/**
 * Emergency Contact GraphQL DTO
 *
 * Represents an emergency contact for a student in GraphQL responses
 */
@ObjectType('EmergencyContact')
export class EmergencyContactDto {
  @Field(() => ID, { description: 'Unique identifier for the emergency contact' })
  id!: string;

  @Field({ description: 'First name of the emergency contact' })
  firstName!: string;

  @Field({ description: 'Last name of the emergency contact' })
  lastName!: string;

  @Field({ description: 'Phone number of the emergency contact' })
  phone!: string;

  @Field({ nullable: true, description: 'Email address of the emergency contact' })
  email?: string;

  @Field({ description: 'Relationship to the student' })
  relationshipType!: string;

  @Field({ description: 'Priority level (1=primary, 2=secondary, etc.)' })
  priority!: number;

  @Field({ description: 'Whether this contact is currently active' })
  isActive!: boolean;

  @Field({ description: 'Date when the contact was created' })
  createdAt!: Date;

  @Field({ description: 'Date when the contact was last updated' })
  updatedAt!: Date;
}
