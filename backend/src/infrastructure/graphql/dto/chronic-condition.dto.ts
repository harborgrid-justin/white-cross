import { Field, ObjectType, ID } from '@nestjs/graphql';

/**
 * Chronic Condition GraphQL DTO
 *
 * Represents a chronic condition for a student in GraphQL responses
 */
@ObjectType('ChronicCondition')
export class ChronicConditionDto {
  @Field(() => ID, { description: 'Unique identifier for the chronic condition' })
  id!: string;

  @Field({ description: 'Name of the diagnosis' })
  diagnosisName!: string;

  @Field({ nullable: true, description: 'Detailed description of the condition' })
  description?: string;

  @Field({ description: 'Current status of the condition' })
  status!: string;

  @Field({ nullable: true, description: 'Date when the condition was diagnosed' })
  diagnosisDate?: Date;

  @Field({ nullable: true, description: 'Healthcare provider who diagnosed the condition' })
  diagnosedBy?: string;

  @Field({ nullable: true, description: 'Special care instructions' })
  careInstructions?: string;

  @Field({ description: 'Whether this condition is currently active' })
  isActive!: boolean;

  @Field({ description: 'Date when the record was created' })
  createdAt!: Date;

  @Field({ description: 'Date when the record was last updated' })
  updatedAt!: Date;
}
