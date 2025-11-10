/**
 * Transformation Decorators
 *
 * Data transformation decorators for sanitizing and normalizing input data.
 * These decorators automatically transform values before validation occurs.
 *
 * Decorators:
 * - @SanitizeHtml() - Remove XSS vectors using DOMPurify patterns
 * - @NormalizeEmail() - Lowercase and trim email addresses
 * - @NormalizePhone() - Format phone numbers consistently
 * - @TrimString() - Remove leading/trailing whitespace
 * - @UpperCase() - Convert to uppercase
 * - @LowerCase() - Convert to lowercase
 * - @RemoveWhitespace() - Remove all whitespace
 * - @StripHtmlTags() - Remove all HTML tags
 * - @NormalizeUrl() - Normalize URL format
 * - @ToBoolean() - Convert string to boolean
 *
 * @module validators/transformation
 * @version 1.0.0
 */

import { Transform } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';

// ============================================================================
// XSS Prevention Patterns
// ============================================================================

/**
 * XSS patterns to sanitize (based on DOMPurify)
 */
const XSS_PATTERNS: Array<{ pattern: RegExp; replacement: string }> = [
  // Script tags
  { pattern: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, replacement: '' },
  // Event handlers
  { pattern: /on\w+\s*=\s*["'][^"']*["']/gi, replacement: '' },
  { pattern: /on\w+\s*=\s*[^\s>]*/gi, replacement: '' },
  // Javascript: protocol
  { pattern: /javascript:/gi, replacement: '' },
  // Data URLs with scripts
  { pattern: /data:text\/html[^,]*,/gi, replacement: '' },
  // Iframe tags
  { pattern: /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, replacement: '' },
  // Object and embed tags
  { pattern: /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, replacement: '' },
  { pattern: /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, replacement: '' },
  // Style tags with expressions
  { pattern: /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, replacement: '' },
  // Meta refresh
  { pattern: /<meta[^>]*http-equiv=['"]?refresh['"]?[^>]*>/gi, replacement: '' },
  // Base tag
  { pattern: /<base\b[^>]*>/gi, replacement: '' },
  // Form tags
  { pattern: /<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, replacement: '' },
  // Link tags with suspicious content
  { pattern: /<link[^>]*rel=['"]?stylesheet['"]?[^>]*>/gi, replacement: '' },
];

// ============================================================================
// Transformation Decorator Functions
// ============================================================================

/**
 * Sanitizes HTML by removing XSS vectors
 *
 * Removes script tags, event handlers, javascript: protocol,
 * iframe, object, embed, and other potentially dangerous HTML.
 *
 * @example
 * ```typescript
 * class CommentDto {
 *   @SanitizeHtml()
 *   content: string;
 * }
 * ```
 */
export function SanitizeHtml(): PropertyDecorator {
  return applyDecorators(
    Transform(({ value }) => {
      if (typeof value !== 'string') return value;

      let sanitized = value;

      // Apply all XSS patterns
      for (const { pattern, replacement } of XSS_PATTERNS) {
        sanitized = sanitized.replace(pattern, replacement);
      }

      // Remove dangerous attributes
      sanitized = sanitized.replace(/(<[^>]+)\s+(on\w+|style|xmlns|formaction)\s*=\s*["'][^"']*["']/gi, '$1');

      // Encode remaining angle brackets that aren't part of allowed tags
      // (This is a simplified version - in production, use DOMPurify)
      const allowedTags = ['b', 'i', 'u', 'strong', 'em', 'p', 'br', 'a', 'ul', 'ol', 'li'];
      const tagPattern = new RegExp(`<(?!\\/?(${allowedTags.join('|')})\\b)[^>]*>`, 'gi');
      sanitized = sanitized.replace(tagPattern, (match) => {
        return match.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      });

      return sanitized;
    }),
  );
}

/**
 * Normalizes email addresses (lowercase, trim)
 *
 * @example
 * ```typescript
 * class UserDto {
 *   @NormalizeEmail()
 *   @IsEmail()
 *   email: string;
 * }
 * ```
 */
export function NormalizeEmail(): PropertyDecorator {
  return applyDecorators(
    Transform(({ value }) => {
      if (typeof value !== 'string') return value;
      return value.toLowerCase().trim();
    }),
  );
}

/**
 * Normalizes phone numbers to consistent format
 * Removes all non-digit characters and formats as (XXX) XXX-XXXX
 *
 * @example
 * ```typescript
 * class ContactDto {
 *   @NormalizePhone()
 *   phone: string;
 * }
 * ```
 */
export function NormalizePhone(): PropertyDecorator {
  return applyDecorators(
    Transform(({ value }) => {
      if (typeof value !== 'string') return value;

      // Remove all non-digit characters
      const digits = value.replace(/\D/g, '');

      // Handle different phone number lengths
      if (digits.length === 10) {
        // Format as (XXX) XXX-XXXX
        return `(${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6)}`;
      } else if (digits.length === 11 && digits[0] === '1') {
        // Remove leading 1 and format
        return `(${digits.substring(1, 4)}) ${digits.substring(4, 7)}-${digits.substring(7)}`;
      }

      // Return original if not standard format
      return value;
    }),
  );
}

/**
 * Trims leading and trailing whitespace
 *
 * @example
 * ```typescript
 * class InputDto {
 *   @TrimString()
 *   name: string;
 * }
 * ```
 */
export function TrimString(): PropertyDecorator {
  return applyDecorators(
    Transform(({ value }) => {
      if (typeof value !== 'string') return value;
      return value.trim();
    }),
  );
}

/**
 * Converts string to uppercase
 *
 * @example
 * ```typescript
 * class CodeDto {
 *   @UpperCase()
 *   code: string;
 * }
 * ```
 */
export function UpperCase(): PropertyDecorator {
  return applyDecorators(
    Transform(({ value }) => {
      if (typeof value !== 'string') return value;
      return value.toUpperCase();
    }),
  );
}

/**
 * Converts string to lowercase
 *
 * @example
 * ```typescript
 * class UsernameDto {
 *   @LowerCase()
 *   username: string;
 * }
 * ```
 */
export function LowerCase(): PropertyDecorator {
  return applyDecorators(
    Transform(({ value }) => {
      if (typeof value !== 'string') return value;
      return value.toLowerCase();
    }),
  );
}

/**
 * Removes all whitespace from string
 *
 * @example
 * ```typescript
 * class TokenDto {
 *   @RemoveWhitespace()
 *   token: string;
 * }
 * ```
 */
export function RemoveWhitespace(): PropertyDecorator {
  return applyDecorators(
    Transform(({ value }) => {
      if (typeof value !== 'string') return value;
      return value.replace(/\s+/g, '');
    }),
  );
}

/**
 * Strips all HTML tags from string
 *
 * @example
 * ```typescript
 * class TextDto {
 *   @StripHtmlTags()
 *   plainText: string;
 * }
 * ```
 */
export function StripHtmlTags(): PropertyDecorator {
  return applyDecorators(
    Transform(({ value }) => {
      if (typeof value !== 'string') return value;
      return value.replace(/<[^>]*>/g, '');
    }),
  );
}

/**
 * Normalizes URL format (adds protocol if missing, removes trailing slash)
 *
 * @example
 * ```typescript
 * class WebsiteDto {
 *   @NormalizeUrl()
 *   @IsUrl()
 *   website: string;
 * }
 * ```
 */
export function NormalizeUrl(): PropertyDecorator {
  return applyDecorators(
    Transform(({ value }) => {
      if (typeof value !== 'string') return value;

      let normalized = value.trim();

      // Add protocol if missing
      if (!normalized.match(/^https?:\/\//i)) {
        normalized = `https://${normalized}`;
      }

      // Remove trailing slash
      normalized = normalized.replace(/\/$/, '');

      // Convert to lowercase domain
      try {
        const url = new URL(normalized);
        url.hostname = url.hostname.toLowerCase();
        return url.toString();
      } catch {
        return value; // Return original if invalid URL
      }
    }),
  );
}

/**
 * Converts string to boolean
 * Handles: 'true', 'false', '1', '0', 'yes', 'no', 'on', 'off'
 *
 * @example
 * ```typescript
 * class SettingsDto {
 *   @ToBoolean()
 *   @IsBoolean()
 *   enabled: boolean;
 * }
 * ```
 */
export function ToBoolean(): PropertyDecorator {
  return applyDecorators(
    Transform(({ value }) => {
      if (typeof value === 'boolean') return value;
      if (typeof value !== 'string') return value;

      const lowerValue = value.toLowerCase().trim();

      // True values
      if (['true', '1', 'yes', 'on'].includes(lowerValue)) {
        return true;
      }

      // False values
      if (['false', '0', 'no', 'off'].includes(lowerValue)) {
        return false;
      }

      return value; // Return original if not recognized
    }),
  );
}

/**
 * Normalizes line endings to \n (Unix style)
 *
 * @example
 * ```typescript
 * class TextDto {
 *   @NormalizeLineEndings()
 *   content: string;
 * }
 * ```
 */
export function NormalizeLineEndings(): PropertyDecorator {
  return applyDecorators(
    Transform(({ value }) => {
      if (typeof value !== 'string') return value;
      return value.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    }),
  );
}

/**
 * Removes multiple consecutive spaces and replaces with single space
 *
 * @example
 * ```typescript
 * class SearchDto {
 *   @CompressWhitespace()
 *   query: string;
 * }
 * ```
 */
export function CompressWhitespace(): PropertyDecorator {
  return applyDecorators(
    Transform(({ value }) => {
      if (typeof value !== 'string') return value;
      return value.replace(/\s+/g, ' ').trim();
    }),
  );
}

/**
 * Escapes special characters for use in regex
 *
 * @example
 * ```typescript
 * class SearchDto {
 *   @EscapeRegex()
 *   pattern: string;
 * }
 * ```
 */
export function EscapeRegex(): PropertyDecorator {
  return applyDecorators(
    Transform(({ value }) => {
      if (typeof value !== 'string') return value;
      return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }),
  );
}

/**
 * Slugifies string (converts to URL-friendly format)
 *
 * @example
 * ```typescript
 * class ArticleDto {
 *   @Slugify()
 *   slug: string;
 * }
 * ```
 */
export function Slugify(): PropertyDecorator {
  return applyDecorators(
    Transform(({ value }) => {
      if (typeof value !== 'string') return value;

      return value
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove non-word chars
        .replace(/[\s_-]+/g, '-') // Replace spaces, underscores with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    }),
  );
}
