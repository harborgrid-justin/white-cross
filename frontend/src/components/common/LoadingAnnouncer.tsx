'use client';

/**
 * LoadingAnnouncer Component
 *
 * Announces loading states to screen readers using ARIA live regions.
 * Ensures users with screen readers are informed when content is loading.
 *
 * WCAG 2.1 Level AA Compliance:
 * - 4.1.3 Status Messages (Level AA)
 * - Provides accessible loading state communication
 *
 * @component
 */

import { useEffect, useState } from 'react';

interface LoadingAnnouncerProps {
  /**
   * Whether content is currently loading
   */
  isLoading: boolean;

  /**
   * Custom loading message
   * @default "Loading content, please wait"
   */
  loadingMessage?: string;

  /**
   * Custom completion message
   * @default "Content loaded"
   */
  completedMessage?: string;

  /**
   * Whether to announce completion
   * @default true
   */
  announceCompletion?: boolean;

  /**
   * Delay before clearing completion message (ms)
   * @default 1000
   */
  clearDelay?: number;
}

/**
 * LoadingAnnouncer Component
 *
 * Provides screen reader announcements for loading states using
 * a polite ARIA live region that doesn't interrupt other announcements.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const [isLoading, setIsLoading] = useState(false);
 *
 *   return (
 *     <>
 *       <LoadingAnnouncer isLoading={isLoading} />
 *       <button onClick={() => setIsLoading(true)}>
 *         Load Data
 *       </button>
 *     </>
 *   );
 * }
 * ```
 */
export function LoadingAnnouncer({
  isLoading,
  loadingMessage = 'Loading content, please wait',
  completedMessage = 'Content loaded',
  announceCompletion = true,
  clearDelay = 1000,
}: LoadingAnnouncerProps) {
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (isLoading) {
      // Announce loading state
      setAnnouncement(loadingMessage);
    } else if (announceCompletion && announcement === loadingMessage) {
      // Announce completion
      setAnnouncement(completedMessage);

      // Clear announcement after delay
      const timer = setTimeout(() => setAnnouncement(''), clearDelay);
      return () => clearTimeout(timer);
    }
  }, [isLoading, loadingMessage, completedMessage, announceCompletion, clearDelay, announcement]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
}

/**
 * Inline loading announcer for use within components
 */
interface InlineLoadingAnnouncerProps {
  message?: string;
}

export function InlineLoadingAnnouncer({
  message = 'Loading...',
}: InlineLoadingAnnouncerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}

export default LoadingAnnouncer;
