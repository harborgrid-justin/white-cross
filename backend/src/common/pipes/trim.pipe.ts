/**
 * @fileoverview Trim Pipe
 * @module common/pipes/trim
 * @description Trims whitespace from string inputs
 */

import { Injectable, PipeTransform } from '@nestjs/common';
import { TransformableObject, TransformableValue } from '../types/utility-types';

/**
 * Trim Pipe
 *
 * Removes leading and trailing whitespace from strings.
 * Recursively processes nested objects and arrays.
 *
 * Benefits:
 * - Prevents accidental whitespace in user input
 * - Normalizes data before validation
 * - Reduces storage space
 * - Improves search accuracy
 *
 * @example
 * // In controller
 * async create(
 *   @Body(TrimPipe) createDto: CreateUserDto
 * ) {
 *   // All string fields in createDto are trimmed
 * }
 *
 * @example
 * // On specific field
 * async search(
 *   @Query('q', TrimPipe) query: string
 * ) {
 *   // query has leading/trailing whitespace removed
 * }
 */
@Injectable()
export class TrimPipe implements PipeTransform {
  /**
   * Transform value by trimming all strings
   * @param value - Value to trim
   * @returns Trimmed value
   */
  transform<T extends TransformableValue>(value: T): T {
    return this.trim(value) as T;
  }

  /**
   * Recursively trim all strings in the value
   * @param value - Value to trim
   * @returns Trimmed value
   */
  private trim(value: TransformableValue): TransformableValue {
    // Handle null/undefined
    if (value === null || value === undefined) {
      return value;
    }

    // Handle strings
    if (typeof value === 'string') {
      return value.trim();
    }

    // Handle arrays
    if (Array.isArray(value)) {
      return value.map((item) => this.trim(item));
    }

    // Handle objects
    if (typeof value === 'object') {
      const trimmedObject: TransformableObject = {};
      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          trimmedObject[key] = this.trim(value[key]);
        }
      }
      return trimmedObject;
    }

    // Return other types as-is (numbers, booleans)
    return value;
  }
}
