/**
 * GraphQL DTOs for Student type
 *
 * Defines GraphQL object types, input types, and response types for Student entity
 * using NestJS GraphQL decorators for code-first schema generation.
 */
import { ObjectType, Field, ID, InputType, registerEnumType } from '@nestjs/graphql';
import { PaginationDto } from './pagination.dto';

/**
 * Gender Enum for GraphQL
 */
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY'
}

// Register enum with GraphQL
registerEnumType(Gender, {
  name: 'Gender',
  description: 'Student gender'
});

/**
 * Student GraphQL Object Type
 */
@ObjectType()
export class StudentDto {
  @Field(() => ID)
  id: string;

  @Field()
  studentNumber: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  fullName: string;

  @Field()
  dateOfBirth: Date;

  @Field()
  grade: string;

  @Field(() => Gender)
  gender: Gender;

  @Field({ nullable: true })
  photo?: string;

  @Field({ nullable: true })
  medicalRecordNum?: string;

  @Field()
  isActive: boolean;

  @Field()
  enrollmentDate: Date;

  @Field(() => ID, { nullable: true })
  nurseId?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

/**
 * Student List Response with Pagination
 */
@ObjectType()
export class StudentListResponseDto {
  @Field(() => [StudentDto])
  students: StudentDto[];

  @Field(() => PaginationDto)
  pagination: PaginationDto;
}

/**
 * Student Filter Input for Queries
 */
@InputType()
export class StudentFilterInputDto {
  @Field({ nullable: true })
  isActive?: boolean;

  @Field({ nullable: true })
  grade?: string;

  @Field(() => ID, { nullable: true })
  nurseId?: string;

  @Field({ nullable: true })
  search?: string;
}
