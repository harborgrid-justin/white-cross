import _ from 'lodash';
import { VALIDATION_CONFIG } from '../constants/config';

/**
 * Security utilities for sanitizing and validating user input in healthcare platform
 * Prevents XSS attacks and ensures data integrity
 * Enhanced with lodash utilities for better performance and consistency
 */

/**
 * Sanitizes text content to prevent XSS attacks
 * Removes potentially dangerous characters and HTML tags
 */
export function sanitizeText(input: unknown): string {
  if (typeof input !== 'string') {
    return String(input || '').replace(/[<>&"']/g, '');
  }

  return input
    .replace(/[<>&"']/g, (match) => {
      const htmlEntities: Record<string, string> = {
        '<': '<',
        '>': '>',
        '&': '&',
        '"': '"',
        "'": '&#x27;'
      };
      return htmlEntities[match] || match;
    })
    .trim()
    .substring(0, VALIDATION_CONFIG.MAX_FIELD_LENGTH); // Limit length using config
}

/**
 * Sanitizes HTML content by stripping all tags except allowed ones
 * Used for user-generated content that might contain formatting
 */
export function sanitizeHtml(input: string, allowedTags: string[] = []): string {
  if (!input || typeof input !== 'string') return ''

  // Remove all HTML tags except explicitly allowed ones
  const allowedTagsRegex = allowedTags.length > 0
    ? new RegExp(`<(?!/?(?:${allowedTags.join('|')})\\s*/?>)[^>]+>`, 'gi')
    : /<[^>]+>/g

  return input
    .replace(allowedTagsRegex, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
}

/**
 * Validates and sanitizes email addresses
 */
export function sanitizeEmail(email: unknown): string {
  if (typeof email !== 'string') return ''

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const sanitized = _.toLower(_.trim(email))

  return emailRegex.test(sanitized) ? sanitized : ''
}

/**
 * Validates and sanitizes phone numbers
 */
export function sanitizePhoneNumber(phone: unknown): string {
  if (typeof phone !== 'string') return ''

  // Remove all non-digit characters except parentheses, spaces, hyphens, and plus
  const cleaned = phone.replace(/[^\d\s\-()]/g, '').trim()

  // Basic validation - should have at least 10 digits
  const digitCount = cleaned.replace(/\D/g, '').length
  return digitCount >= 10 ? cleaned : ''
}

/**
 * Sanitizes medical record numbers and student IDs
 * Ensures only alphanumeric characters and hyphens
 */
export function sanitizeId(id: unknown): string {
  if (typeof id !== 'string') return ''

  return _.trim(_.replace(id, /[^a-zA-Z0-9-]/g, ''))
}

/**
 * Validates and sanitizes numeric inputs
 */
export function sanitizeNumber(input: unknown, options: {
  min?: number
  max?: number
  allowDecimal?: boolean
} = {}): number | null {
  const { min, max, allowDecimal = true } = options

  let num: number
  if (typeof input === 'number') {
    num = input
  } else if (typeof input === 'string') {
    const parsed = allowDecimal ? parseFloat(input) : parseInt(input, 10)
    if (Number.isNaN(parsed)) return null
    num = parsed
  } else {
    return null
  }

  if (min !== undefined && num < min) return null
  if (max !== undefined && num > max) return null

  return num
}

/**
 * Sanitizes dates and ensures they're valid
 */
export function sanitizeDate(date: unknown): Date | null {
  if (date instanceof Date) {
    return Number.isNaN(date.getTime()) ? null : date
  }

  if (typeof date === 'string' || typeof date === 'number') {
    const parsed = new Date(date)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  return null
}

/**
 * Sanitizes file names for safe storage
 */
export function sanitizeFileName(fileName: unknown): string {
  if (typeof fileName !== 'string') return ''

  return fileName
    .replace(/[^a-zA-Z0-9\-_.]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^[_\-.]+|[_\-.]+$/g, '')
    .substring(0, 255) // Limit length
    .toLowerCase()
}

/**
 * Sanitizes URLs to prevent XSS through href attributes
 */
export function sanitizeUrl(url: unknown): string {
  if (typeof url !== 'string') return ''

  const urlStr = url.trim().toLowerCase()

  // Allow only http, https, mailto, and tel protocols
  const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:']

  try {
    const urlObj = new URL(urlStr)
    if (allowedProtocols.includes(urlObj.protocol)) {
      return url.trim()
    }
  } catch {
    // If URL parsing fails, check if it's a relative URL
    if (urlStr.startsWith('/') && !urlStr.startsWith('//')) {
      return url.trim()
    }
  }

  return ''
}

/**
 * Deep sanitizes an object recursively
 * Useful for sanitizing API response data
 */
export function deepSanitizeObject<T>(
  obj: T,
  options: {
    sanitizeStrings?: boolean
    sanitizeHtml?: boolean
    allowedHtmlTags?: string[]
  } = {}
): T {
  const { sanitizeStrings = true, sanitizeHtml = false, allowedHtmlTags = [] } = options

  if (obj === null || obj === undefined) return obj

  if (typeof obj === 'string') {
    if (sanitizeHtml || sanitizeStrings) {
      return sanitizeText(obj) as T
    }
    return obj
  }

  if (typeof obj === 'number' || typeof obj === 'boolean') {
    return obj
  }

  if (obj instanceof Date) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepSanitizeObject(item, options)) as T
  }

  if (typeof obj === 'object') {
    const sanitized: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = deepSanitizeObject(value, options)
    }
    return sanitized as T
  }

  return obj
}

/**
 * Validates that a string contains only safe characters for healthcare data
 * Used for patient names, medication names, etc.
 */
export function validateSafeHealthcareText(text: unknown): boolean {
  if (typeof text !== 'string') return false

  // Allow letters, numbers, spaces, basic punctuation, but no script-injectable characters
  const safePattern = /^[a-zA-Z0-9\s\-_.,;:()[\]/\\'"\\u00C0-\u017F]*$/

  return safePattern.test(text) &&
         text.length <= 1000 && // Reasonable length limit
         !text.includes('<script') &&
         !text.includes('javascript:') &&
         !text.includes('data:')
}

/**
 * Sanitizes search query parameters to prevent injection attacks
 */
export function sanitizeSearchQuery(query: unknown): string {
  if (typeof query !== 'string') return ''

  return query
    .replace(/[<>&"'%;()+={}[\]\\:"`~,]/g, '') // Remove potentially dangerous characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
    .substring(0, 100) // Limit length
}

/**
 * Creates a Content Security Policy nonce for inline scripts (if needed)
 */
export function generateCSPNonce(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}
