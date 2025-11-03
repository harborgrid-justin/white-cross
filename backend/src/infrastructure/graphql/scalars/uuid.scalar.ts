/**
 * UUID Custom Scalar
 *
 * Validates UUID v4 format in GraphQL.
 * Provides better type safety and validation than plain ID scalar.
 *
 * Features:
 * - UUID v4 format validation
 * - Lowercase normalization
 * - Detailed error messages
 *
 * @example
 * ```graphql
 * type Student {
 *   id: UUID!
 *   nurseId: UUID
 * }
 * ```
 */
import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('UUID')
export class UUIDScalar implements CustomScalar<string, string> {
  description = 'Universally Unique Identifier (UUID v4)';

  // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  // where x is any hexadecimal digit and y is one of 8, 9, A, or B
  private readonly uuidV4Regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  /**
   * Parse value from client (variables)
   */
  parseValue(value: string): string {
    return this.validateUUID(value);
  }

  /**
   * Serialize value to send to client
   */
  serialize(value: string): string {
    if (!value) {
      return value;
    }

    return this.validateUUID(value);
  }

  /**
   * Parse literal value in GraphQL query
   */
  parseLiteral(ast: ValueNode): string {
    if (ast.kind === Kind.STRING) {
      return this.validateUUID(ast.value);
    }

    throw new Error('UUID must be a string');
  }

  /**
   * Validate UUID format
   *
   * @param value - UUID string
   * @returns Lowercase UUID
   * @throws Error if UUID is invalid
   */
  private validateUUID(value: string): string {
    if (!value || typeof value !== 'string') {
      throw new Error('UUID must be a non-empty string');
    }

    // Normalize to lowercase
    const normalizedUUID = value.toLowerCase().trim();

    // Validate format
    if (!this.uuidV4Regex.test(normalizedUUID)) {
      throw new Error(
        `Invalid UUID v4 format: ${value}. Expected format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`
      );
    }

    return normalizedUUID;
  }
}
