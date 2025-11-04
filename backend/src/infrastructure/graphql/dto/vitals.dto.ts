/**
 * GraphQL DTOs for Vitals type
 *
 * Defines GraphQL object types for real-time vital signs monitoring.
 */
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

/**
 * Vitals GraphQL Object Type
 *
 * Represents a set of vital sign measurements for a student.
 */
@ObjectType()
export class VitalsDto {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  studentId: string;

  @Field(() => Float, { nullable: true })
  temperature?: number;

  @Field({ nullable: true })
  temperatureUnit?: string;

  @Field(() => Float, { nullable: true })
  bloodPressureSystolic?: number;

  @Field(() => Float, { nullable: true })
  bloodPressureDiastolic?: number;

  @Field(() => Float, { nullable: true })
  heartRate?: number;

  @Field(() => Float, { nullable: true })
  respiratoryRate?: number;

  @Field(() => Float, { nullable: true })
  oxygenSaturation?: number;

  @Field(() => Float, { nullable: true })
  weight?: number;

  @Field({ nullable: true })
  weightUnit?: string;

  @Field(() => Float, { nullable: true })
  height?: number;

  @Field({ nullable: true })
  heightUnit?: string;

  @Field({ nullable: true })
  notes?: string;

  @Field(() => ID, { nullable: true })
  recordedById?: string;

  @Field()
  recordedAt: Date;

  @Field()
  createdAt: Date;
}
