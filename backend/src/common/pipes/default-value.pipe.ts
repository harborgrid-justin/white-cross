/**
 * @fileoverview Default Value Pipe
 * @module common/pipes/default-value
 * @description Provides default values for undefined/null parameters
 */

import { PipeTransform, Injectable } from '@nestjs/common';

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
export class DefaultValuePipe implements PipeTransform {
  constructor(private readonly defaultValue: any) {}

  transform(value: any): any {
    // Return default if value is undefined or null
    if (value === undefined || value === null || value === '') {
      return this.defaultValue;
    }

    return value;
  }
}
