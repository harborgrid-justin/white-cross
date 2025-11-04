/**
 * Observer Pattern Utilities
 *
 * Hooks for observing DOM elements including resize observer,
 * media query changes, and virtual scrolling utilities.
 *
 * @module performance-utilities.observers
 * @version 1.0.0
 */

import { useEffect, useState, useMemo } from 'react';
import type {
  ElementSize,
  VirtualScrollConfig,
  VirtualScrollResult
} from './performance-utilities.types';

// ============================================================================
// RESIZE OBSERVER
// ============================================================================

/**
 * Resize observer hook
 *
 * @param {React.RefObject<Element | null>} ref - Reference to the element to observe
 * @returns {ElementSize} Current element dimensions
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * const size = useResizeObserver(ref);
 *
 * return (
 *   <div ref={ref}>
 *     Size: {size.width} x {size.height}
 *   </div>
 * );
 * ```
 */
export function useResizeObserver(
  ref: React.RefObject<Element | null>
): ElementSize {
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return size;
}

// ============================================================================
// MEDIA QUERY
// ============================================================================

/**
 * Media query hook
 *
 * @param {string} query - Media query string
 * @returns {boolean} Whether the media query matches
 *
 * @example
 * ```tsx
 * const isMobile = useMediaQuery('(max-width: 768px)');
 *
 * return (
 *   <div>
 *     {isMobile ? <MobileView /> : <DesktopView />}
 *   </div>
 * );
 * ```
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// ============================================================================
// VIRTUAL SCROLLING HELPERS
// ============================================================================

/**
 * Calculate visible items for virtual scrolling
 *
 * @param {VirtualScrollConfig} config - Virtual scroll configuration
 * @returns {VirtualScrollResult} Visible items, total height, and scroll setter
 *
 * @example
 * ```tsx
 * const { visibleItems, totalHeight, setScrollTop } = useVirtualScroll({
 *   itemCount: 10000,
 *   itemHeight: 50,
 *   containerHeight: 600,
 *   overscan: 3
 * });
 *
 * return (
 *   <div
 *     style={{ height: containerHeight, overflow: 'auto' }}
 *     onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
 *   >
 *     <div style={{ height: totalHeight, position: 'relative' }}>
 *       {visibleItems.map(({ index, top }) => (
 *         <div key={index} style={{ position: 'absolute', top }}>
 *           Item {index}
 *         </div>
 *       ))}
 *     </div>
 *   </div>
 * );
 * ```
 */
export function useVirtualScroll({
  itemCount,
  itemHeight,
  containerHeight,
  overscan = 3
}: VirtualScrollConfig): VirtualScrollResult {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    itemCount - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = useMemo(() => {
    const items = [];
    for (let i = startIndex; i <= endIndex; i++) {
      items.push({
        index: i,
        top: i * itemHeight
      });
    }
    return items;
  }, [startIndex, endIndex, itemHeight]);

  const totalHeight = itemCount * itemHeight;

  return {
    visibleItems,
    totalHeight,
    setScrollTop
  };
}
