/**
 * Form Data Sanitization Utilities
 *
 * Provides XSS prevention and HTML sanitization for form submissions
 * with healthcare-specific configurations.
 *
 * Uses DOMPurify for robust HTML sanitization that works in both
 * browser and Node.js environments.
 *
 * @module lib/forms/sanitization
 * @example
 * ```typescript
 * import { sanitizeFormData, sanitizeHtml, sanitizeRichText } from '@/lib/forms/sanitization';
 *
 * // Sanitize entire form submission
 * const clean = sanitizeFormData({
 *   name: '<script>alert("xss")</script>John',
 *   notes: '<p>Patient notes with <b>formatting</b></p>'
 * });
 *
 * // Sanitize HTML content
 * const cleanHtml = sanitizeHtml('<p onclick="alert(1)">Text</p>');
 * // Result: '<p>Text</p>'
 *
 * // Sanitize rich text with allowed formatting
 * const cleanRichText = sanitizeRichText('<p>Text with <b>bold</b> and <script>evil</script></p>');
 * // Result: '<p>Text with <b>bold</b> and </p>'
 * ```
 */

import DOMPurify from 'isomorphic-dompurify';
import type { FormField } from './types';

/**
 * Sanitization configuration
 */
export interface SanitizationConfig {
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
  allowedSchemes?: string[];
  stripIgnoreTag?: boolean;
  stripIgnoreTagBody?: boolean[];
}

/**
 * Healthcare-safe HTML tags
 *
 * Allowed tags for medical notes and rich text fields.
 * Excludes potentially dangerous tags like <script>, <iframe>, etc.
 */
const HEALTHCARE_ALLOWED_TAGS = [
  // Text formatting
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'sub',
  'sup',
  'mark',

  // Lists
  'ul',
  'ol',
  'li',

  // Tables
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',

  // Headers
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',

  // Other
  'blockquote',
  'pre',
  'code',
  'hr',
  'div',
  'span',
];

/**
 * Healthcare-safe HTML attributes
 */
const HEALTHCARE_ALLOWED_ATTRIBUTES = {
  '*': ['class', 'id'],
  a: ['href', 'title', 'target'],
  img: ['src', 'alt', 'title', 'width', 'height'],
  table: ['border', 'cellpadding', 'cellspacing'],
  td: ['colspan', 'rowspan'],
  th: ['colspan', 'rowspan'],
};

/**
 * Basic HTML sanitization configuration
 *
 * Allows minimal formatting for general use.
 */
const BASIC_CONFIG: SanitizationConfig = {
  allowedTags: ['p', 'br', 'strong', 'em', 'u'],
  allowedAttributes: {},
  stripIgnoreTag: true,
};

/**
 * Rich text sanitization configuration
 *
 * Allows comprehensive formatting for rich text editors.
 */
const RICHTEXT_CONFIG: SanitizationConfig = {
  allowedTags: HEALTHCARE_ALLOWED_TAGS,
  allowedAttributes: HEALTHCARE_ALLOWED_ATTRIBUTES,
  stripIgnoreTag: true,
};

/**
 * Create DOMPurify sanitizer with custom configuration
 *
 * @param config - Sanitization configuration
 * @returns Configured sanitizer function
 *
 * @example
 * ```typescript
 * const sanitizer = createSanitizer({
 *   allowedTags: ['p', 'b', 'i'],
 *   allowedAttributes: { p: ['class'] }
 * });
 *
 * const clean = sanitizer('<p class="note">Text with <b>bold</b> and <script>evil</script></p>');
 * // Result: '<p class="note">Text with <b>bold</b> and </p>'
 * ```
 */
export function createSanitizer(config: SanitizationConfig = {}): (html: string) => string {
  return (html: string) => {
    const purifyConfig: any = {
      ALLOWED_TAGS: config.allowedTags || HEALTHCARE_ALLOWED_TAGS,
      ALLOWED_ATTR: config.allowedAttributes || HEALTHCARE_ALLOWED_ATTRIBUTES,
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
      KEEP_CONTENT: !config.stripIgnoreTag,
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
      RETURN_DOM_IMPORT: false,
      RETURN_TRUSTED_TYPE: false,
      FORCE_BODY: false,
      SANITIZE_DOM: true,
      IN_PLACE: false,
    };

    return DOMPurify.sanitize(html, purifyConfig);
  };
}

/**
 * Sanitize HTML string with basic configuration
 *
 * Removes all potentially dangerous HTML tags and attributes.
 * Use this for general-purpose HTML sanitization.
 *
 * @param html - HTML string to sanitize
 * @returns Sanitized HTML string
 *
 * @example
 * ```typescript
 * sanitizeHtml('<p onclick="alert(1)">Text</p>');
 * // Result: '<p>Text</p>'
 *
 * sanitizeHtml('<script>alert("xss")</script><p>Safe text</p>');
 * // Result: '<p>Safe text</p>'
 * ```
 */
export function sanitizeHtml(html: string): string {
  if (typeof html !== 'string') {
    return '';
  }

  const sanitizer = createSanitizer(BASIC_CONFIG);
  return sanitizer(html);
}

/**
 * Sanitize rich text content
 *
 * Allows formatting tags while removing dangerous content.
 * Use this for rich text editors and formatted medical notes.
 *
 * @param html - Rich text HTML to sanitize
 * @param customConfig - Optional custom configuration
 * @returns Sanitized HTML string
 *
 * @example
 * ```typescript
 * const html = '<p>Patient has <b>type 2 diabetes</b>. <script>stealData()</script></p>';
 * sanitizeRichText(html);
 * // Result: '<p>Patient has <b>type 2 diabetes</b>. </p>'
 *
 * // With custom allowed tags
 * sanitizeRichText(html, { allowedTags: ['p', 'b', 'i', 'u'] });
 * ```
 */
export function sanitizeRichText(html: string, customConfig?: Partial<SanitizationConfig>): string {
  if (typeof html !== 'string') {
    return '';
  }

  const config = {
    ...RICHTEXT_CONFIG,
    ...customConfig,
  };

  const sanitizer = createSanitizer(config);
  return sanitizer(html);
}

/**
 * Sanitize plain text (escape HTML entities)
 *
 * Converts HTML special characters to entities.
 * Use this when you want to display user input as plain text.
 *
 * @param text - Text to sanitize
 * @returns Escaped text
 *
 * @example
 * ```typescript
 * sanitizeText('<script>alert("xss")</script>');
 * // Result: '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 * ```
 */
export function sanitizeText(text: string): string {
  if (typeof text !== 'string') {
    return '';
  }

  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'/]/g, char => map[char]);
}

/**
 * Sanitize form field value based on field type
 *
 * Applies appropriate sanitization based on field type.
 *
 * @param value - Field value
 * @param field - Field definition
 * @returns Sanitized value
 *
 * @example
 * ```typescript
 * const field: FormField = { type: 'richtext', name: 'notes', ... };
 * const clean = sanitizeFieldValue('<p>Note with <script>bad</script></p>', field);
 * // Result: '<p>Note with </p>'
 * ```
 */
export function sanitizeFieldValue(value: any, field: FormField): any {
  if (value === null || value === undefined) {
    return value;
  }

  switch (field.type) {
    case 'richtext':
      return sanitizeRichText(String(value));

    case 'textarea':
      // Allow basic formatting in textareas if specified
      if (field.metadata?.allowHtml) {
        return sanitizeHtml(String(value));
      }
      return sanitizeText(String(value));

    case 'text':
    case 'email':
    case 'phone':
    case 'ssn':
    case 'mrn':
    case 'zipcode':
      return sanitizeText(String(value));

    case 'url':
      // Validate and sanitize URL
      try {
        const url = new URL(String(value));
        // Only allow safe protocols
        if (['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol)) {
          return url.toString();
        }
        return '';
      } catch {
        return '';
      }

    case 'number':
      // Convert to number, return 0 if invalid
      const num = Number(value);
      return isNaN(num) ? 0 : num;

    case 'boolean':
    case 'checkbox':
      return Boolean(value);

    case 'date':
    case 'time':
    case 'datetime':
      // Return as-is if valid date, empty string otherwise
      const date = new Date(value);
      return isNaN(date.getTime()) ? '' : value;

    case 'select':
    case 'radio':
      // Ensure value is in allowed options
      if (field.options) {
        const validValues = field.options.map(opt => String(opt.value));
        return validValues.includes(String(value)) ? value : '';
      }
      return sanitizeText(String(value));

    case 'multiselect':
      // Ensure all values are in allowed options
      if (Array.isArray(value) && field.options) {
        const validValues = new Set(field.options.map(opt => String(opt.value)));
        return value.filter(v => validValues.has(String(v)));
      }
      return [];

    case 'file':
    case 'image':
      // File uploads should be handled separately
      // Return metadata only, not file content
      if (typeof value === 'object' && value.name) {
        return {
          name: sanitizeText(value.name),
          size: Number(value.size) || 0,
          type: sanitizeText(value.type || ''),
        };
      }
      return null;

    case 'hidden':
    case 'password':
      // Don't sanitize hidden/password fields (handled separately)
      return value;

    default:
      return sanitizeText(String(value));
  }
}

/**
 * Sanitize form data object
 *
 * Recursively sanitizes all fields in a form submission.
 * Applies field-specific sanitization based on field definitions.
 *
 * **HIPAA Note**: Sanitize data before logging or displaying.
 *
 * @param data - Form data to sanitize
 * @param fields - Optional field definitions for type-specific sanitization
 * @returns Sanitized data object
 *
 * @example
 * ```typescript
 * const formData = {
 *   name: '<script>alert("xss")</script>John',
 *   email: 'user@example.com',
 *   notes: '<p>Patient notes</p><script>bad</script>'
 * };
 *
 * const fields = [
 *   { name: 'name', type: 'text', ... },
 *   { name: 'notes', type: 'richtext', ... }
 * ];
 *
 * const clean = sanitizeFormData(formData, fields);
 * // {
 * //   name: 'John',
 * //   email: 'user@example.com',
 * //   notes: '<p>Patient notes</p>'
 * // }
 * ```
 */
export function sanitizeFormData(
  data: Record<string, any>,
  fields?: FormField[]
): Record<string, any> {
  const sanitized: Record<string, any> = {};

  // Create field map for quick lookup
  const fieldMap = new Map<string, FormField>();
  if (fields) {
    for (const field of fields) {
      fieldMap.set(field.name, field);
    }
  }

  for (const [key, value] of Object.entries(data)) {
    const field = fieldMap.get(key);

    if (field) {
      // Use field-specific sanitization
      sanitized[key] = sanitizeFieldValue(value, field);
    } else if (typeof value === 'string') {
      // Default: sanitize as text
      sanitized[key] = sanitizeText(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recursively sanitize nested objects
      sanitized[key] = sanitizeFormData(value, fields);
    } else if (Array.isArray(value)) {
      // Sanitize array elements
      sanitized[key] = value.map(item => {
        if (typeof item === 'string') {
          return sanitizeText(item);
        } else if (typeof item === 'object' && item !== null) {
          return sanitizeFormData(item, fields);
        }
        return item;
      });
    } else {
      // Primitive types (number, boolean, null)
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Strip all HTML tags from string
 *
 * Removes all HTML tags, leaving only text content.
 *
 * @param html - HTML string
 * @returns Plain text
 *
 * @example
 * ```typescript
 * stripHtmlTags('<p>Hello <b>world</b>!</p>');
 * // Result: 'Hello world!'
 * ```
 */
export function stripHtmlTags(html: string): string {
  if (typeof html !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
}

/**
 * Sanitize and truncate text
 *
 * Sanitizes HTML and truncates to specified length.
 * Useful for previews and summaries.
 *
 * @param text - Text to sanitize and truncate
 * @param maxLength - Maximum length
 * @param stripHtml - Whether to strip HTML tags
 * @returns Sanitized and truncated text
 *
 * @example
 * ```typescript
 * sanitizeAndTruncate('<p>Long medical note...</p>', 50, true);
 * // Result: 'Long medical note...'
 * ```
 */
export function sanitizeAndTruncate(
  text: string,
  maxLength: number,
  stripHtml: boolean = true
): string {
  let sanitized = stripHtml ? stripHtmlTags(text) : sanitizeHtml(text);

  if (sanitized.length <= maxLength) {
    return sanitized;
  }

  return sanitized.substring(0, maxLength - 3) + '...';
}

/**
 * Validate sanitized data integrity
 *
 * Checks if sanitization changed the data significantly.
 * Returns warnings if data was modified.
 *
 * @param original - Original data
 * @param sanitized - Sanitized data
 * @returns Validation result
 */
export function validateSanitization(
  original: Record<string, any>,
  sanitized: Record<string, any>
): {
  isValid: boolean;
  modifiedFields: string[];
  warnings: string[];
} {
  const modifiedFields: string[] = [];
  const warnings: string[] = [];

  for (const [key, originalValue] of Object.entries(original)) {
    const sanitizedValue = sanitized[key];

    if (originalValue !== sanitizedValue) {
      modifiedFields.push(key);

      // Check if significant content was removed
      const originalLength = String(originalValue).length;
      const sanitizedLength = String(sanitizedValue).length;

      if (sanitizedLength < originalLength * 0.8) {
        warnings.push(`Field '${key}': Significant content removed during sanitization`);
      }
    }
  }

  return {
    isValid: warnings.length === 0,
    modifiedFields,
    warnings,
  };
}
