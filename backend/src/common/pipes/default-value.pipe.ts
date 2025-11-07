/**
 * @fileoverview Default Value Pipe
 * @module common/pipes/default-value
 * @description Provides default values for undefined/null parameters
 */

import { Injectable, PipeTransform } from '@nestjs/common';
import { DefaultValue } from '../types/utility-types';

/**
 * Default Value Pipe
 *
 * Replaces undefined or null values with a default value.
 * Useful for optional query parameters that should have defaults.
 *
 * @example
 * // In controller
 * async findAll(
 *   @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
 *   @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
 * ) {
 *   // page defaults to 1 if not provided
 *   // limit defaults to 20 if not provided
 * }
 *
 * @example
 * // With boolean default
 * async search(
 *   @Query('active', new DefaultValuePipe(true)) active: boolean
 * ) {
 *   // active defaults to true
 * }
 */
@Injectable()
export class DefaultValuePipe<T extends DefaultValue = DefaultValue> implements PipeTransform {
  /**
   * @param defaultValue - The default value to use when input is null/undefined/empty
   */
  constructor(private readonly defaultValue: T) {}

  /**
   * Transform the value, replacing null/undefined/empty with default
   * @param value - Input value
   * @returns Input value or default value
   */
  transform(value: T | null | undefined | ''): T {
    // Return default if value is undefined, null, or empty string
    if (value === undefined || value === null || value === '') {
      return this.defaultValue;
    }

    return value as T;
  }
}
