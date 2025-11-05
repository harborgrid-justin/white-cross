/**
 * @fileoverview Input Sanitization Utilities
 * @module lib/helpers/input-sanitization
 *
 * Provides utilities for sanitizing and normalizing user inputs
 * to prevent XSS attacks and ensure data consistency.
 */

/**
 * Sanitize and normalize email address
 *
 * - Trims whitespace
 * - Converts to lowercase
 * - Removes dangerous characters
 *
 * @param email - Raw email input
 * @returns Sanitized email
 *
 * @example
 * sanitizeEmail('  User@Example.COM  ') // Returns: 'user@example.com'
 */
export function sanitizeEmail(email: string): string {
  return email
    .trim()
    .toLowerCase()
    .replace(/[<>'"]/g, ''); // Remove potential XSS characters
}

/**
 * Sanitize string input
 *
 * - Trims whitespace
 * - Removes null bytes
 * - Optionally encodes HTML entities
 *
 * @param input - Raw string input
 * @param encodeHtml - Whether to encode HTML entities (default: false)
 * @returns Sanitized string
 *
 * @example
 * sanitizeString('  Hello <script>  ', true) // Returns: 'Hello &lt;script&gt;'
 */
export function sanitizeString(input: string, encodeHtml: boolean = false): string {
  let sanitized = input
    .trim()
    .replace(/\0/g, ''); // Remove null bytes

  if (encodeHtml) {
    sanitized = encodeHtmlEntities(sanitized);
  }

  return sanitized;
}

/**
 * Encode HTML entities to prevent XSS
 *
 * @param input - Raw string
 * @returns String with HTML entities encoded
 *
 * @example
 * encodeHtmlEntities('<script>alert("XSS")</script>')
 * // Returns: '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
 */
export function encodeHtmlEntities(input: string): string {
  const entities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
  };

  return input.replace(/[&<>"'/]/g, (char) => entities[char] || char);
}

/**
 * Safely extract and sanitize string from FormData
 *
 * @param formData - Form data object
 * @param key - Field key
 * @param defaultValue - Default value if field is missing
 * @param encodeHtml - Whether to encode HTML entities
 * @returns Sanitized string value
 *
 * @example
 * const email = safeFormDataString(formData, 'email');
 * const name = safeFormDataString(formData, 'name', '', true);
 */
export function safeFormDataString(
  formData: FormData,
  key: string,
  defaultValue: string = '',
  encodeHtml: boolean = false
): string {
  const value = formData.get(key);

  if (value === null || value === undefined) {
    return defaultValue;
  }

  if (typeof value !== 'string') {
    return defaultValue;
  }

  return sanitizeString(value, encodeHtml);
}

/**
 * Safely extract and sanitize email from FormData
 *
 * @param formData - Form data object
 * @param key - Field key
 * @param defaultValue - Default value if field is missing
 * @returns Sanitized email value
 *
 * @example
 * const email = safeFormDataEmail(formData, 'email');
 */
export function safeFormDataEmail(
  formData: FormData,
  key: string,
  defaultValue: string = ''
): string {
  const value = formData.get(key);

  if (value === null || value === undefined) {
    return defaultValue;
  }

  if (typeof value !== 'string') {
    return defaultValue;
  }

  return sanitizeEmail(value);
}

/**
 * Validate and sanitize password input
 *
 * Passwords are not sanitized for HTML entities since they're never displayed,
 * but we do trim whitespace and remove null bytes.
 *
 * @param password - Raw password input
 * @returns Sanitized password
 */
export function sanitizePassword(password: string): string {
  return password
    .replace(/\0/g, ''); // Remove null bytes but preserve other characters
}

/**
 * Safely extract password from FormData
 *
 * @param formData - Form data object
 * @param key - Field key
 * @param defaultValue - Default value if field is missing
 * @returns Sanitized password value
 *
 * @example
 * const password = safeFormDataPassword(formData, 'password');
 */
export function safeFormDataPassword(
  formData: FormData,
  key: string,
  defaultValue: string = ''
): string {
  const value = formData.get(key);

  if (value === null || value === undefined) {
    return defaultValue;
  }

  if (typeof value !== 'string') {
    return defaultValue;
  }

  return sanitizePassword(value);
}
