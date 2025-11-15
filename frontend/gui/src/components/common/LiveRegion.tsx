/**
 * LiveRegion Component
 *
 * Provides accessible announcements for screen readers using ARIA live regions.
 * Used to announce dynamic state changes in the page builder.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { usePageBuilderStore } from '../../store';

interface LiveRegionProps {
  /**
   * Politeness level for announcements
   * - "polite": Wait for user to finish current activity
   * - "assertive": Interrupt immediately
   */
  politeness?: 'polite' | 'assertive';
}

/**
 * Live region component for accessibility announcements
 */
export const LiveRegion: React.FC<LiveRegionProps> = ({ politeness = 'polite' }) => {
  const [message, setMessage] = useState('');
  const [messageId, setMessageId] = useState(0);

  // Subscribe to relevant state changes
  const selectedIds = usePageBuilderStore((state) => state.selection.selectedIds);
  const componentCount = usePageBuilderStore((state) => state.canvas.components.allIds.length);
  const zoom = usePageBuilderStore((state) => state.canvas.viewport.zoom);
  const gridEnabled = usePageBuilderStore((state) => state.canvas.grid.enabled);
  const canUndo = usePageBuilderStore((state) => state.history.past.length > 0);
  const canRedo = usePageBuilderStore((state) => state.history.future.length > 0);

  // Announce selection changes
  useEffect(() => {
    if (selectedIds.length === 0) {
      announceMessage('Selection cleared');
    } else if (selectedIds.length === 1) {
      const component = usePageBuilderStore.getState().canvas.components.byId[selectedIds[0]];
      if (component) {
        announceMessage(`Selected ${component.name}, ${component.type}`);
      }
    } else {
      announceMessage(`${selectedIds.length} components selected`);
    }
  }, [selectedIds.length]);

  // Announce component count changes
  useEffect(() => {
    if (componentCount > 0) {
      announceMessage(`${componentCount} component${componentCount === 1 ? '' : 's'} on canvas`);
    }
  }, [componentCount]);

  // Announce zoom changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      announceMessage(`Zoom ${Math.round(zoom * 100)}%`);
    }, 500); // Debounce announcements

    return () => clearTimeout(timer);
  }, [zoom]);

  // Announce grid toggle
  useEffect(() => {
    announceMessage(gridEnabled ? 'Grid enabled' : 'Grid disabled');
  }, [gridEnabled]);

  const announceMessage = (msg: string) => {
    if (!msg) return;

    // Update message and increment ID to force screen reader announcement
    setMessage(msg);
    setMessageId((prev) => prev + 1);

    // Clear message after announcement to allow repeat announcements
    setTimeout(() => {
      setMessage('');
    }, 100);
  };

  return (
    <>
      {/* Main announcements */}
      <div
        role="status"
        aria-live={politeness}
        aria-atomic="true"
        className="sr-only"
        key={`live-region-${messageId}`}
      >
        {message}
      </div>

      {/* Undo/Redo state announcements */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {canUndo && 'Undo available'}
        {canRedo && 'Redo available'}
      </div>
    </>
  );
};

export default LiveRegion;
