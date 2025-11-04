/**
 * WF-VAL-261 | validation.ts - BaseApiService Validation Module
 *
 * @module services/core/base-api/validation
 * @description
 * Centralized validation logic for BaseApiService using Zod schemas.
 * Provides type-safe validation with detailed error messages.
 *
 * @purpose
 * - Validate entity IDs before operations
 * - Validate create DTOs with Zod schemas
 * - Validate update DTOs with Zod schemas
 * - Provide consistent, user-friendly error messages
 *
 * @upstream zod
 * @dependencies zod
 * @downstream BaseApiService
 * @exports validateId, validateCreateData, validateUpdateData
 *
 * @keyFeatures
 * - Zod schema integration for runtime type checking
 * - Detailed validation error messages
 * - Path tracking for nested validation errors
 * - Type-safe validation functions
 *
 * @lastUpdated 2025-11-04
 * @fileType TypeScript Validation Module
 * @architecture Core validation layer for service architecture
 */

import { z, ZodSchema } from 'zod';

// ==========================================
// ID VALIDATION
// ==========================================

/**
 * Validate entity ID
 *
 * @description
 * Ensures that the provided ID is a non-empty string.
 * This prevents accidental API calls with invalid identifiers.
 *
 * @param {string} id - The entity ID to validate
 * @throws {Error} When ID is missing, empty, or not a string
 *
 * @example
 * ```typescript
 * validateId('abc-123');  // Valid - no error
 * validateId('');         // Throws: "Invalid ID provided"
 * validateId(null);       // Throws: "Invalid ID provided"
 * validateId(123);        // Throws: "Invalid ID provided"
 * ```
 */
export function validateId(id: string): void {
  if (!id || typeof id !== 'string') {
    throw new Error('Invalid ID provided');
  }
}

// ==========================================
// CREATE DATA VALIDATION
// ==========================================

/**
 * Validate create data with Zod schema
 *
 * @description
 * Validates entity creation data against a Zod schema if provided.
 * Extracts the first validation error and formats it with field path
 * information for user-friendly error messages.
 *
 * @typeParam TCreateDto - The type of the create DTO being validated
 *
 * @param {TCreateDto} data - The data to validate
 * @param {ZodSchema<TCreateDto>} [schema] - Optional Zod schema for validation
 * @throws {Error} When validation fails with detailed error message
 *
 * @example
 * ```typescript
 * const schema = z.object({
 *   name: z.string().min(1),
 *   email: z.string().email()
 * });
 *
 * // Valid data - no error
 * validateCreateData(
 *   { name: 'John', email: 'john@example.com' },
 *   schema
 * );
 *
 * // Invalid data - throws with message:
 * // "Validation error: Invalid email at email"
 * validateCreateData(
 *   { name: 'John', email: 'invalid' },
 *   schema
 * );
 * ```
 */
export function validateCreateData<TCreateDto>(
  data: TCreateDto,
  schema?: ZodSchema<TCreateDto>
): void {
  if (!schema) {
    return;
  }

  try {
    schema.parse(data);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const issues = error.issues || [];
      const firstError = issues[0];
      if (firstError) {
        throw new Error(
          `Validation error: ${firstError.message} at ${firstError.path.join('.')}`
        );
      }
    }
    throw error;
  }
}

// ==========================================
// UPDATE DATA VALIDATION
// ==========================================

/**
 * Validate update data with Zod schema
 *
 * @description
 * Validates entity update data against a Zod schema if provided.
 * Identical to validateCreateData but semantically separate to allow
 * for different update schemas (e.g., partial updates, different constraints).
 *
 * @typeParam TUpdateDto - The type of the update DTO being validated
 *
 * @param {TUpdateDto} data - The data to validate
 * @param {ZodSchema<TUpdateDto>} [schema] - Optional Zod schema for validation
 * @throws {Error} When validation fails with detailed error message
 *
 * @example
 * ```typescript
 * const updateSchema = z.object({
 *   name: z.string().min(1).optional(),
 *   email: z.string().email().optional()
 * }).refine(data => Object.keys(data).length > 0, {
 *   message: "At least one field must be provided for update"
 * });
 *
 * // Valid partial update - no error
 * validateUpdateData(
 *   { name: 'Jane' },
 *   updateSchema
 * );
 *
 * // Invalid - empty update object throws:
 * // "Validation error: At least one field must be provided for update"
 * validateUpdateData({}, updateSchema);
 * ```
 */
export function validateUpdateData<TUpdateDto>(
  data: TUpdateDto,
  schema?: ZodSchema<TUpdateDto>
): void {
  if (!schema) {
    return;
  }

  try {
    schema.parse(data);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const issues = error.issues || [];
      const firstError = issues[0];
      if (firstError) {
        throw new Error(
          `Validation error: ${firstError.message} at ${firstError.path.join('.')}`
        );
      }
    }
    throw error;
  }
}
