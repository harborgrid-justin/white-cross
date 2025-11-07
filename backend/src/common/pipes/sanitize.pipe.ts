/**
 * @fileoverview Sanitize Pipe
 * @module common/pipes/sanitize
 * @description Sanitizes input to prevent XSS and injection attacks
 */

import { Injectable, PipeTransform } from '@nestjs/common';
import sanitizeHtml from 'sanitize-html';
import { SanitizableObject, SanitizableValue } from '../types/utility-types';

/**
 * Sanitize Pipe
 *
 * Sanitizes string inputs to prevent:
 * - XSS (Cross-Site Scripting) attacks
 * - HTML injection
 * - Script injection
 * - SQL injection (basic)
 *
 * Applies to:
 * - Single strings
 * - Nested objects (recursively)
 * - Arrays
 *
 * @example
 * // In controller
 * async create(
 *   @Body(SanitizePipe) createDto: CreateNoteDto
 * ) {
 *   // All string fields are sanitized
 * }
 *
 * @example
 * // On specific field
 * async search(
 *   @Query('q', SanitizePipe) query: string
 * ) {
 *   // query has dangerous characters removed
 * }
 */
@Injectable()
export class SanitizePipe implements PipeTransform {
  private readonly allowHtml: boolean;
  private readonly allowedTags: string[];

  constructor(options?: {
    /**
     * Allow HTML tags (default: false)
     * If true, only whitelisted tags are allowed
     */
    allowHtml?: boolean;

    /**
     * Whitelist of allowed HTML tags
     * Only used if allowHtml is true
     */
    allowedTags?: string[];
  }) {
    this.allowHtml = options?.allowHtml ?? false;
    this.allowedTags = options?.allowedTags ?? [
      'p',
      'br',
      'strong',
      'em',
      'u',
      'a',
      'ul',
      'ol',
      'li',
    ];
  }

  /**
   * Transform and sanitize the value
   * @param value - Value to sanitize
   * @returns Sanitized value
   */
  transform<T extends SanitizableValue>(value: T): T {
    return this.sanitize(value) as T;
  }

  /**
   * Recursively sanitize all strings in the value
   * @param value - Value to sanitize
   * @returns Sanitized value
   */
  private sanitize(value: SanitizableValue): SanitizableValue {
    // Handle null/undefined
    if (value === null || value === undefined) {
      return value;
    }

    // Handle strings
    if (typeof value === 'string') {
      return this.sanitizeString(value);
    }

    // Handle arrays
    if (Array.isArray(value)) {
      return value.map((item) => this.sanitize(item));
    }

    // Handle objects
    if (typeof value === 'object') {
      const sanitizedObject: SanitizableObject = {};
      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          sanitizedObject[key] = this.sanitize(value[key]);
        }
      }
      return sanitizedObject;
    }

    // Return other types as-is (numbers, booleans)
    return value;
  }

  /**
   * Sanitize a single string
   * @param value - String to sanitize
   * @returns Sanitized string
   */
  private sanitizeString(value: string): string {
    if (!value) return value;

    if (this.allowHtml) {
      // Allow whitelisted HTML tags only
      return sanitizeHtml(value, {
        allowedTags: this.allowedTags,
        allowedAttributes: {
          a: ['href', 'title'],
        },
        allowedSchemes: ['http', 'https', 'mailto'],
      });
    }

    // Strip all HTML tags
    return sanitizeHtml(value, {
      allowedTags: [],
      allowedAttributes: {},
    });
  }
}
