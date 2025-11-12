/**
 * Sanitization Manager
 *
 * Handles input sanitization and validation
 */

import type { SanitizationOptions } from './types';

export class SanitizationManager {
  /**
   * Sanitize HTML content
   */
  sanitizeHTML(input: string): string {
    if (typeof input !== 'string') return '';
    return input.replace(/<[^>]*>/g, '').trim();
  }

  /**
   * Sanitize SQL input (basic)
   */
  sanitizeSQL(input: string): string {
    if (typeof input !== 'string') return '';
    return input.replace(/['";\\]/g, '').trim();
  }

  /**
   * Sanitize filename
   */
  sanitizeFileName(input: string): string {
    if (typeof input !== 'string') return '';
    return input.replace(/[^a-zA-Z0-9._-]/g, '_');
  }

  /**
   * Sanitize URL
   */
  sanitizeURL(input: string): string {
    if (typeof input !== 'string') return '';
    try {
      const url = new URL(input);
      return url.protocol === 'http:' || url.protocol === 'https:' ? input : '';
    } catch {
      return '';
    }
  }

  /**
   * Sanitize email
   */
  sanitizeEmail(input: string): string {
    if (typeof input !== 'string') return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input) ? input.toLowerCase() : '';
  }

  /**
   * Sanitize phone number
   */
  sanitizePhone(input: string): string {
    if (typeof input !== 'string') return '';
    return input.replace(/[^\d+\-\s()]/g, '').trim();
  }

  /**
   * Strip HTML tags
   */
  stripHTMLTags(input: string): string {
    if (typeof input !== 'string') return '';
    return input.replace(/<[^>]*>/g, '');
  }

  /**
   * Sanitize object recursively
   */
  sanitizeObject(obj: unknown, options: SanitizationOptions = {}): unknown {
    if (typeof obj === 'string') {
      let sanitized = obj;

      if (!options.allowHTML) {
        sanitized = this.sanitizeHTML(sanitized);
      }

      if (options.maxLength && sanitized.length > options.maxLength) {
        sanitized = sanitized.substring(0, options.maxLength);
      }

      if (options.allowedChars) {
        sanitized = sanitized.replace(options.allowedChars, '');
      }

      return sanitized;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item, options));
    }

    if (obj && typeof obj === 'object') {
      const sanitized: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = this.sanitizeObject(value, options);
      }
      return sanitized;
    }

    return obj;
  }

  /**
   * Validate input against patterns
   */
  validateInput(input: string, pattern: RegExp): boolean {
    return pattern.test(input);
  }

  /**
   * Escape special characters for safe display
   */
  escapeHTML(input: string): string {
    if (typeof input !== 'string') return '';
    const entityMap: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;'
    };
    return input.replace(/[&<>"'`=/]/g, (s) => entityMap[s] || s);
  }
}