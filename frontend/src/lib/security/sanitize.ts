/**
 * HTML Sanitization Utility - XSS Prevention
 *
 * CRITICAL SECURITY: All user-generated HTML content MUST be sanitized
 * before rendering to prevent XSS attacks and PHI data exfiltration.
 *
 * @module lib/security/sanitize
 * @since 2025-11-05
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitization profiles for different contexts
 */
export const SANITIZE_PROFILES = {
  /**
   * Communication messages - Allow basic formatting only
   */
  communication: {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'blockquote'],
    ALLOWED_ATTR: [],
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
  },

  /**
   * Rich text content - Allow more formatting but still safe
   */
  richText: {
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'em',
      'u',
      'ul',
      'ol',
      'li',
      'blockquote',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'a',
      'code',
      'pre',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    /**
     * Hook to sanitize links
     */
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
  },

  /**
   * Strict - Plain text only (strip all HTML)
   */
  plainText: {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  },

  /**
   * Healthcare notes - Medical formatting allowed
   */
  healthcareNotes: {
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'em',
      'u',
      'ul',
      'ol',
      'li',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
    ],
    ALLOWED_ATTR: ['colspan', 'rowspan'],
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
  },
} as const;

export type SanitizeProfile = keyof typeof SANITIZE_PROFILES;

/**
 * Sanitize HTML content to prevent XSS attacks
 *
 * @param dirtyHtml - Unsanitized HTML string
 * @param profile - Sanitization profile to use
 * @returns Sanitized HTML safe for rendering
 *
 * @example
 * ```tsx
 * // In a React component
 * const sanitizedContent = sanitizeHtml(message.content, 'communication');
 * <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
 * ```
 */
export function sanitizeHtml(dirtyHtml: string, profile: SanitizeProfile = 'communication'): string {
  if (!dirtyHtml) {
    return '';
  }

  const config = SANITIZE_PROFILES[profile];

  return DOMPurify.sanitize(dirtyHtml, config);
}

/**
 * React hook for sanitizing HTML
 *
 * @param html - HTML to sanitize
 * @param profile - Sanitization profile
 * @returns Sanitized HTML
 *
 * @example
 * ```tsx
 * function MessageDisplay({ message }) {
 *   const sanitized = useSanitizedHtml(message.content, 'communication');
 *   return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
 * }
 * ```
 */
export function useSanitizedHtml(html: string, profile: SanitizeProfile = 'communication'): string {
  return sanitizeHtml(html, profile);
}

/**
 * Strip all HTML tags and return plain text
 *
 * @param html - HTML string
 * @returns Plain text without HTML tags
 */
export function stripHtml(html: string): string {
  return sanitizeHtml(html, 'plainText');
}

/**
 * Validate if HTML is safe (for preview purposes)
 *
 * @param html - HTML to check
 * @param profile - Sanitization profile
 * @returns true if HTML is already safe
 */
export function isHtmlSafe(html: string, profile: SanitizeProfile = 'communication'): boolean {
  const sanitized = sanitizeHtml(html, profile);
  return sanitized === html;
}

/**
 * Get a summary of what was sanitized (for security logging)
 *
 * @param original - Original HTML
 * @param sanitized - Sanitized HTML
 * @returns Sanitization summary
 */
export function getSanitizationSummary(original: string, sanitized: string) {
  const originalLength = original.length;
  const sanitizedLength = sanitized.length;
  const bytesRemoved = originalLength - sanitizedLength;
  const percentRemoved = ((bytesRemoved / originalLength) * 100).toFixed(2);

  return {
    originalLength,
    sanitizedLength,
    bytesRemoved,
    percentRemoved: `${percentRemoved}%`,
    hadMaliciousContent: bytesRemoved > 0,
  };
}
