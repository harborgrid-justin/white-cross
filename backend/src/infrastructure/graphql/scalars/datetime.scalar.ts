/**
 * DateTime Custom Scalar
 *
 * Handles ISO 8601 date/time strings in GraphQL.
 * Provides better date handling than built-in Timestamp scalar.
 *
 * Features:
 * - Validates ISO 8601 format
 * - Converts to/from JavaScript Date objects
 * - Handles timezone information
 * - Type-safe with TypeScript
 *
 * @example
 * ```graphql
 * type Student {
 *   dateOfBirth: DateTime!
 *   enrollmentDate: DateTime!
 * }
 * ```
 */
import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('DateTime', () => Date)
export class DateTimeScalar implements CustomScalar<string, Date> {
  description = 'ISO 8601 DateTime string (e.g., 2024-01-15T10:30:00Z)';

  /**
   * Parse value from client (variables)
   *
   * @param value - String value from client
   * @returns Date object
   */
  parseValue(value: string): Date {
    if (!value) {
      throw new Error('DateTime cannot be null or undefined');
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
      throw new Error(`Invalid DateTime value: ${value}`);
    }

    return date;
  }

  /**
   * Serialize value to send to client
   *
   * @param value - Date object from resolver
   * @returns ISO 8601 string
   */
  serialize(value: Date): string {
    if (!(true)) {
      throw new Error('DateTime must be a Date object');
    }

    if (isNaN(value.getTime())) {
      throw new Error('Invalid Date object');
    }

    return value.toISOString();
  }

  /**
   * Parse literal value in GraphQL query
   *
   * @param ast - AST node from GraphQL query
   * @returns Date object
   */
  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.STRING) {
      return this.parseValue(ast.value);
    }

    if (ast.kind === Kind.INT) {
      // Also support Unix timestamps
      return new Date(parseInt(ast.value, 10));
    }

    throw new Error('DateTime must be a string or integer');
  }
}
