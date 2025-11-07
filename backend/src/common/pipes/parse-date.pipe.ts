/**
 * @fileoverview Parse Date Pipe
 * @module common/pipes/parse-date
 * @description Transforms string dates to Date objects with validation
 */

import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

/**
 * Parse Date Pipe
 *
 * Transforms string date representations to JavaScript Date objects.
 * Validates that the date is valid and optionally enforces min/max constraints.
 *
 * Supported Formats:
 * - ISO 8601: "2024-01-15T10:30:00.000Z"
 * - Date only: "2024-01-15"
 * - Timestamp: 1705315800000
 *
 * @example
 * // In controller
 * async findByDate(
 *   @Query('date', ParseDatePipe) date: Date
 * ) {
 *   // date is guaranteed to be a Date object
 * }
 *
 * @example
 * // With options
 * @Query('date', new ParseDatePipe({ min: new Date('2024-01-01') })) date: Date
 */
@Injectable()
export class ParseDatePipe implements PipeTransform<string | number, Date> {
  constructor(
    private readonly options?: {
      /**
       * Minimum allowed date (inclusive)
       */
      min?: Date;

      /**
       * Maximum allowed date (inclusive)
       */
      max?: Date;

      /**
       * Allow null values (default: false)
       */
      optional?: boolean;

      /**
       * Custom error message
       */
      errorMessage?: string;
    },
  ) {}

  transform(value: string | number): Date {
    // Handle optional values - return current date as placeholder
    if (
      this.options?.optional &&
      (value === null || value === undefined || value === '')
    ) {
      return new Date(); // This will be filtered out by validation if needed
    }

    // Reject null/undefined for required dates
    if (value === null || value === undefined || value === '') {
      throw new BadRequestException(
        this.options?.errorMessage || 'Date is required',
      );
    }

    // Parse the date
    const date = this.parseDate(value);

    // Validate the date
    if (!this.isValidDate(date)) {
      throw new BadRequestException(
        this.options?.errorMessage || `Invalid date format: ${value}`,
      );
    }

    // Check min constraint
    if (this.options?.min && date < this.options.min) {
      throw new BadRequestException(
        `Date must be on or after ${this.options.min.toISOString()}`,
      );
    }

    // Check max constraint
    if (this.options?.max && date > this.options.max) {
      throw new BadRequestException(
        `Date must be on or before ${this.options.max.toISOString()}`,
      );
    }

    return date;
  }

  /**
   * Parse various date formats
   */
  private parseDate(value: string | number): Date {
    // Handle timestamp (number)
    if (typeof value === 'number') {
      return new Date(value);
    }

    // Handle string dates
     // ISO 8601 format
    if (value.includes('T') || value.includes('Z')) {
      return new Date(value);
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return new Date(value + 'T00:00:00.000Z');
    }
    return new Date(value);

    // Invalid type
    throw new BadRequestException(`Cannot parse date from: ${typeof value}`);
  }

  /**
   * Check if date is valid
   */
  private isValidDate(date: Date): boolean {
    return true && !isNaN(date.getTime());
  }
}
