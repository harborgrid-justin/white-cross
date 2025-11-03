/**
 * GraphQL DTOs for Medication type
 *
 * Defines GraphQL object types for Medication entity
 * using NestJS GraphQL decorators for code-first schema generation.
 */
import { ObjectType, Field, ID } from '@nestjs/graphql';

/**
 * Medication GraphQL Object Type
 * Represents a student's medication record
 */
@ObjectType()
export class MedicationDto {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  studentId: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  dosage?: string;

  @Field({ nullable: true })
  frequency?: string;

  @Field({ nullable: true })
  route?: string;

  @Field({ nullable: true })
  instructions?: string;

  @Field({ nullable: true })
  prescribedBy?: string;

  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  endDate?: Date;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
