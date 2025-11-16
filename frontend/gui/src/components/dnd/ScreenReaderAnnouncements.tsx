/**
 * ScreenReaderAnnouncements Component
 *
 * Provides live region announcements for screen readers during drag-drop operations.
 * Implements ARIA live regions for accessibility.
 */

'use client';

import React, { useEffect, useState, useRef } from 'react';
import type { A11yAnnouncement } from '../../types/drag-drop.types';

/**
 * Props for ScreenReaderAnnouncements
 */
export interface ScreenReaderAnnouncementsProps {
  /** Announcements to make */
  announcements: A11yAnnouncement[];
  /** Maximum announcements to keep */
  maxAnnouncements?: number;
}

/**
 * ScreenReaderAnnouncements Component
 *
 * Invisible component that announces drag-drop state changes to screen readers.
 *
 * @example
 * ```tsx
 * const [announcements, setAnnouncements] = useState<A11yAnnouncement[]>([]);
 *
 * const announce = (message: string, priority = 'polite') => {
 *   setAnnouncements(prev => [
 *     ...prev,
 *     { message, priority, timestamp: Date.now() }
 *   ]);
 * };
 *
 * <ScreenReaderAnnouncements announcements={announcements} />
 * ```
 */
export const ScreenReaderAnnouncements: React.FC<
  ScreenReaderAnnouncementsProps
> = ({ announcements, maxAnnouncements = 5 }) => {
  const [politeMessages, setPoliteMessages] = useState<string[]>([]);
  const [assertiveMessages, setAssertiveMessages] = useState<string[]>([]);
  const lastAnnouncementRef = useRef<number>(0);

  useEffect(() => {
    if (announcements.length === 0) return;

    // Get only new announcements
    const newAnnouncements = announcements.filter(
      (a) => a.timestamp > lastAnnouncementRef.current
    );

    if (newAnnouncements.length === 0) return;

    // Update last announcement timestamp
    lastAnnouncementRef.current = Math.max(
      ...newAnnouncements.map((a) => a.timestamp)
    );

    // Separate by priority
    const polite = newAnnouncements
      .filter((a) => a.priority === 'polite')
      .map((a) => a.message);

    const assertive = newAnnouncements
      .filter((a) => a.priority === 'assertive')
      .map((a) => a.message);

    // Update state (triggers announcement)
    if (polite.length > 0) {
      setPoliteMessages((prev) =>
        [...prev, ...polite].slice(-maxAnnouncements)
      );
    }

    if (assertive.length > 0) {
      setAssertiveMessages((prev) =>
        [...prev, ...assertive].slice(-maxAnnouncements)
      );
    }
  }, [announcements, maxAnnouncements]);

  return (
    <>
      {/* Polite announcements - don't interrupt */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {politeMessages[politeMessages.length - 1]}
      </div>

      {/* Assertive announcements - interrupt immediately */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {assertiveMessages[assertiveMessages.length - 1]}
      </div>
    </>
  );
};

/**
 * Hook to manage screen reader announcements
 */
export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<A11yAnnouncement[]>([]);

  const announce = (
    message: string,
    priority: 'polite' | 'assertive' = 'polite'
  ) => {
    setAnnouncements((prev) => [
      ...prev,
      {
        message,
        priority,
        timestamp: Date.now(),
      },
    ]);
  };

  const clearAnnouncements = () => {
    setAnnouncements([]);
  };

  return {
    announcements,
    announce,
    clearAnnouncements,
  };
};
