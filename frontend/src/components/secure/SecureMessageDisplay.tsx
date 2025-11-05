/**
 * Secure Message Display Component - XSS Prevention Example
 *
 * This component demonstrates how to safely display user-generated HTML content
 * while preventing XSS attacks.
 *
 * REPLACES: CommunicationDetail.tsx unsafe HTML rendering
 *
 * @module components/secure/SecureMessageDisplay
 * @since 2025-11-05
 */

'use client';

import { useSanitizedHtml } from '@/lib/security/sanitize';
import type { SanitizeProfile } from '@/lib/security/sanitize';

interface SecureMessageDisplayProps {
  /**
   * HTML content to display (will be sanitized)
   */
  content: string;

  /**
   * Sanitization profile to use
   * @default 'communication'
   */
  profile?: SanitizeProfile;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Test ID for testing
   */
  testId?: string;
}

/**
 * Secure component for displaying user-generated HTML content
 *
 * @example
 * ```tsx
 * <SecureMessageDisplay
 *   content={message.htmlContent}
 *   profile="communication"
 *   className="prose prose-sm"
 * />
 * ```
 */
export function SecureMessageDisplay({
  content,
  profile = 'communication',
  className = '',
  testId,
}: SecureMessageDisplayProps) {
  // Sanitize HTML to prevent XSS
  const sanitizedContent = useSanitizedHtml(content, profile);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      data-testid={testId}
    />
  );
}

/**
 * Example usage in CommunicationDetail component
 *
 * BEFORE (VULNERABLE):
 * ```tsx
 * <div dangerouslySetInnerHTML={{ __html: communication.content }} />
 * ```
 *
 * AFTER (SECURE):
 * ```tsx
 * <SecureMessageDisplay
 *   content={communication.content}
 *   profile="communication"
 *   className="prose prose-sm max-w-none"
 * />
 * ```
 */

export default SecureMessageDisplay;
