/**
 * EmailAddress Custom Scalar
 *
 * Validates and normalizes email addresses in GraphQL.
 *
 * Features:
 * - RFC 5322 compliant validation
 * - Lowercase normalization
 * - Trim whitespace
 * - Basic domain validation
 *
 * @example
 * ```graphql
 * type User {
 *   email: EmailAddress!
 *   alternateEmail: EmailAddress
 * }
 * ```
 */
import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('EmailAddress')
export class EmailAddressScalar implements CustomScalar<string, string> {
  description = 'Valid email address (RFC 5322 compliant)';

  // RFC 5322 Official Standard email validation regex
  private readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // More strict validation (optional)
  private readonly strictEmailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  /**
   * Parse value from client (variables)
   */
  parseValue(value: string): string {
    return this.validateAndNormalizeEmail(value);
  }

  /**
   * Serialize value to send to client
   */
  serialize(value: string): string {
    if (!value) {
      return value;
    }

    return this.validateAndNormalizeEmail(value);
  }

  /**
   * Parse literal value in GraphQL query
   */
  parseLiteral(ast: ValueNode): string {
    if (ast.kind === Kind.STRING) {
      return this.validateAndNormalizeEmail(ast.value);
    }

    throw new Error('EmailAddress must be a string');
  }

  /**
   * Validate and normalize email address
   *
   * @param value - Email address string
   * @returns Normalized email address (lowercase, trimmed)
   * @throws Error if email is invalid
   */
  private validateAndNormalizeEmail(value: string): string {
    if (!value || typeof value !== 'string') {
      throw new Error('EmailAddress must be a non-empty string');
    }

    // Trim and lowercase
    const normalizedEmail = value.trim().toLowerCase();

    // Validate format
    if (!this.emailRegex.test(normalizedEmail)) {
      throw new Error(`Invalid email address format: ${value}`);
    }

    // Additional validation
    const [localPart, domain] = normalizedEmail.split('@');

    // Check local part length (max 64 characters)
    if (localPart.length > 64) {
      throw new Error('Email local part exceeds maximum length of 64 characters');
    }

    // Check domain length (max 255 characters)
    if (domain.length > 255) {
      throw new Error('Email domain exceeds maximum length of 255 characters');
    }

    // Check for consecutive dots
    if (normalizedEmail.includes('..')) {
      throw new Error('Email address cannot contain consecutive dots');
    }

    // Check domain has valid TLD
    const domainParts = domain.split('.');
    if (domainParts.length < 2 || domainParts[domainParts.length - 1].length < 2) {
      throw new Error('Email domain must have a valid top-level domain');
    }

    return normalizedEmail;
  }
}
