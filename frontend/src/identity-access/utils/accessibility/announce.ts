/**
 * Screen Reader Announcement Utilities - WCAG 2.1 AA Compliant
 *
 * Provides utilities for announcing dynamic content changes to screen readers.
 * Implements WCAG 4.1.3 Status Messages.
 *
 * Features:
 * - Polite announcements (non-interruptive)
 * - Assertive announcements (immediate, interruptive)
 * - Automatic cleanup
 * - Support for aria-atomic announcements
 *
 * @module utils/accessibility/announce
 *
 * @example
 * ```tsx
 * // Polite announcement (for non-critical updates)
 * announcePolite('Search returned 42 results');
 *
 * // Assertive announcement (for errors and critical updates)
 * announceAssertive('Form submission failed. Please try again.');
 *
 * // Status announcement (for loading states, success messages)
 * announceStatus('Loading complete');
 * ```
 */

let liveRegionPolite: HTMLDivElement | null = null;
let liveRegionAssertive: HTMLDivElement | null = null;

/**
 * Create a live region element if it doesn't exist
 */
function createLiveRegion(ariaLive: 'polite' | 'assertive'): HTMLDivElement {
  const existing =
    ariaLive === 'polite' ? liveRegionPolite : liveRegionAssertive;

  if (existing && document.body.contains(existing)) {
    return existing;
  }

  const region = document.createElement('div');

  // Screen reader only styling
  region.style.position = 'absolute';
  region.style.width = '1px';
  region.style.height = '1px';
  region.style.padding = '0';
  region.style.margin = '-1px';
  region.style.overflow = 'hidden';
  region.style.clip = 'rect(0, 0, 0, 0)';
  region.style.whiteSpace = 'nowrap';
  region.style.border = '0';

  // ARIA attributes
  region.setAttribute('aria-live', ariaLive);
  region.setAttribute('aria-atomic', 'true');
  region.setAttribute('role', ariaLive === 'assertive' ? 'alert' : 'status');

  document.body.appendChild(region);

  if (ariaLive === 'polite') {
    liveRegionPolite = region;
  } else {
    liveRegionAssertive = region;
  }

  return region;
}

/**
 * Announce a message to screen readers (non-interruptive)
 *
 * Use for non-critical updates like:
 * - Search results count
 * - Pagination updates
 * - Loading completion
 * - Success messages
 *
 * @param message - The message to announce
 * @param clearAfter - Milliseconds to wait before clearing (default: 5000)
 */
export function announcePolite(message: string, clearAfter = 5000): void {
  const region = createLiveRegion('polite');
  region.textContent = message;

  if (clearAfter > 0) {
    setTimeout(() => {
      region.textContent = '';
    }, clearAfter);
  }
}

/**
 * Announce a message to screen readers (immediate, interruptive)
 *
 * Use for critical updates like:
 * - Form validation errors
 * - System errors
 * - Security alerts
 * - Session warnings
 *
 * @param message - The message to announce
 * @param clearAfter - Milliseconds to wait before clearing (default: 5000)
 */
export function announceAssertive(message: string, clearAfter = 5000): void {
  const region = createLiveRegion('assertive');
  region.textContent = message;

  if (clearAfter > 0) {
    setTimeout(() => {
      region.textContent = '';
    }, clearAfter);
  }
}

/**
 * Announce a status message to screen readers (polite)
 *
 * Alias for announcePolite for semantic clarity when announcing status.
 * Use for:
 * - Loading states
 * - Progress updates
 * - Completion messages
 *
 * @param message - The status message to announce
 * @param clearAfter - Milliseconds to wait before clearing (default: 5000)
 */
export function announceStatus(message: string, clearAfter = 5000): void {
  announcePolite(message, clearAfter);
}

/**
 * Announce an error message to screen readers (assertive)
 *
 * Alias for announceAssertive for semantic clarity when announcing errors.
 * Use for:
 * - Form validation errors
 * - API errors
 * - Authentication errors
 *
 * @param message - The error message to announce
 * @param clearAfter - Milliseconds to wait before clearing (default: 7000)
 */
export function announceError(message: string, clearAfter = 7000): void {
  announceAssertive(message, clearAfter);
}

/**
 * Clear all live region announcements
 */
export function clearAnnouncements(): void {
  if (liveRegionPolite) {
    liveRegionPolite.textContent = '';
  }
  if (liveRegionAssertive) {
    liveRegionAssertive.textContent = '';
  }
}

/**
 * React hook for announcing messages with automatic cleanup
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const announce = useAnnounce();
 *
 *   const handleSubmit = async () => {
 *     announce.polite('Submitting form...');
 *     try {
 *       await submitForm();
 *       announce.polite('Form submitted successfully');
 *     } catch (error) {
 *       announce.error('Form submission failed');
 *     }
 *   };
 * }
 * ```
 */
export function useAnnounce() {
  return {
    polite: announcePolite,
    assertive: announceAssertive,
    status: announceStatus,
    error: announceError,
    clear: clearAnnouncements,
  };
}
