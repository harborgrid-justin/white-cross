/**
 * @fileoverview HTML Sanitization Decorator
 * @module common/validators/decorators/sanitize-html
 * @description Transform decorator for HTML sanitization
 */

import { Transform, TransformFnParams } from 'class-transformer';

/**
 * HTML sanitization options
 */
export interface SanitizeHtmlOptions {
  /** Allow basic formatting tags */
  allowBasicFormatting?: boolean;
  /** Allow links */
  allowLinks?: boolean;
  /** Custom allowed tags */
  allowedTags?: string[];
}

/**
 * Sanitize HTML content
 *
 * @param value - Value to sanitize
 * @param options - Sanitization options
 * @returns Sanitized value
 */
function sanitizeHtml(
  value: string,
  options: SanitizeHtmlOptions = {},
): string {
  if (typeof value !== 'string') return value;

  // Remove all HTML tags by default
  let sanitized = value;

  // Define allowed tags based on options
  const basicTags = ['b', 'i', 'u', 'em', 'strong', 'p', 'br'];
  const linkTags = ['a'];

  let allowedTags: string[] = [];

  if (options.allowedTags) {
    allowedTags = options.allowedTags;
  } else {
    if (options.allowBasicFormatting) {
      allowedTags = [...allowedTags, ...basicTags];
    }
    if (options.allowLinks) {
      allowedTags = [...allowedTags, ...linkTags];
    }
  }

  if (allowedTags.length === 0) {
    // Strip all HTML tags
    sanitized = value.replace(/<[^>]*>/g, '');
  } else {
    // Remove only disallowed tags
    const allowedPattern = allowedTags.join('|');
    const regex = new RegExp(`<(?!\\/?(${allowedPattern})\\b)[^>]*>`, 'gi');
    sanitized = value.replace(regex, '');
  }

  // Remove dangerous attributes from allowed tags
  sanitized = sanitized.replace(
    /\s*(on\w+|javascript:|data:|style)\s*=\s*["'][^"']*["']/gi,
    '',
  );

  // Decode HTML entities to prevent double encoding
  sanitized = sanitized
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, '&');

  // Re-encode potential XSS characters
  sanitized = sanitized
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

  return sanitized.trim();
}

/**
 * HTML sanitization decorator
 *
 * @decorator SanitizeHtml
 * @param {SanitizeHtmlOptions} options - Sanitization options
 *
 * @example
 * class NoteDto {
 *   @SanitizeHtml()
 *   content: string;
 *
 *   @SanitizeHtml({ allowBasicFormatting: true })
 *   formattedNote: string;
 * }
 */
export function SanitizeHtml(options?: SanitizeHtmlOptions) {
  return Transform((params: TransformFnParams) => {
    const { value } = params;
    if (typeof value !== 'string') return value;
    return sanitizeHtml(value, options);
  });
}

/**
 * Sanitize plain text (remove all HTML and scripts)
 *
 * @decorator SanitizeText
 *
 * @example
 * class CommentDto {
 *   @SanitizeText()
 *   comment: string;
 * }
 */
export function SanitizeText() {
  return Transform((params: TransformFnParams) => {
    const { value } = params;
    if (typeof value !== 'string') return value;
    return sanitizeHtml(value, {});
  });
}
