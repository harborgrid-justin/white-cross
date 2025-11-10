/**
 * GraphQL DTOs for Pagination
 *
 * Defines reusable pagination types for GraphQL list queries.
 */
import { Field, ObjectType } from '@nestjs/graphql';

/**
 * Pagination Information
 */
@ObjectType()
export class PaginationDto {
  @Field()
  page: number;

  @Field()
  limit: number;

  @Field()
  total: number;

  @Field()
  totalPages: number;
}
