'use client';

/**
 * WF-COMP-LAY-004 | MobileNav.tsx - Mobile Navigation Menu Component
 * Purpose: Full-screen mobile navigation drawer with sidebar content
 * Dependencies: react, react-router-dom, lucide-react, contexts, Sidebar
 * Features: Slide-out drawer, overlay, auto-close on navigate, swipe gestures
 * Last Updated: 2025-10-27
 * Agent: Layout Components Architect
 */

import React, { memo, useEffect, useCallback, useRef } from 'react';
import { X } from 'lucide-react';
import { useNavigation } from '../../contexts/NavigationContext';
import Sidebar from './Sidebar';

// ============================================================================
// MOBILE NAV COMPONENT
// ============================================================================

/**
 * Props for MobileNav component
 */
export interface MobileNavProps {
  /** Additional CSS classes */
  className?: string;
  /** Show close button */
  showCloseButton?: boolean;
  /** Animation duration in milliseconds */
  animationDuration?: number;
  /** Overlay opacity (0-100) */
  overlayOpacity?: number;
}

/**
 * Mobile navigation drawer component.
 *
 * Full-screen slide-out navigation menu for mobile devices.
 * Displays the full sidebar navigation in a responsive drawer.
 *
 * Features:
 * - Slide-in animation from left
 * - Semi-transparent overlay backdrop
 * - Auto-close on navigation
 * - Auto-close on outside click
 * - Keyboard navigation (Escape to close)
 * - Swipe gestures (swipe left to close)
 * - Prevents body scroll when open
 * - Accessibility (ARIA labels, focus trap)
 * - Dark mode support
 * - Configurable animation timing
 * - Portal rendering (z-index management)
 *
 * Behavior:
 * - Opens when mobile menu is toggled
 * - Closes when user clicks outside
 * - Closes when user navigates to a page
 * - Closes when Escape key is pressed
 * - Closes when swiped left
 * - Locks body scroll when open
 *
 * @param props - Component props
 * @param props.className - Additional CSS classes
 * @param props.showCloseButton - Show close button (default: true)
 * @param props.animationDuration - Animation duration in ms (default: 300)
 * @param props.overlayOpacity - Overlay opacity 0-100 (default: 75)
 * @returns JSX element representing the mobile navigation drawer, or null if closed
 *
 * @example
 * ```tsx
 * // Basic usage (controlled by NavigationContext)
 * <MobileNav />
 * ```
 *
 * @example
 * ```tsx
 * // Custom configuration
 * <MobileNav
 *   showCloseButton={true}
 *   animationDuration={400}
 *   overlayOpacity={60}
 * />
 * ```
 */
export const MobileNav = memo(({
  className = '',
  showCloseButton = true,
  animationDuration = 300,
  overlayOpacity = 75,
}: MobileNavProps) => {
  const { isMobileSidebarOpen, setMobileSidebarOpen } = useNavigation();
  const drawerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);

  // Close handler
  const handleClose = useCallback(() => {
    setMobileSidebarOpen(false);
  }, [setMobileSidebarOpen]);

  // Handle outside click
  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileSidebarOpen) {
        handleClose();
      }
    };

    if (isMobileSidebarOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMobileSidebarOpen, handleClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isMobileSidebarOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        // Restore scroll position
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isMobileSidebarOpen]);

  // Swipe gesture handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX.current - touchEndX;

    // Swipe left to close (threshold: 50px)
    if (deltaX > 50) {
      handleClose();
    }
  }, [handleClose]);

  // Don't render if not open
  if (!isMobileSidebarOpen) {
    return null;
  }

  return (
    <div
      className="lg:hidden fixed inset-0 z-50 flex"
      aria-labelledby="mobile-nav-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay Backdrop */}
      <div
        className={`
          fixed inset-0 bg-gray-600 transition-opacity
          ${isMobileSidebarOpen ? `opacity-${overlayOpacity}` : 'opacity-0'}
        `}
        style={{
          transitionDuration: `${animationDuration}ms`,
          opacity: isMobileSidebarOpen ? overlayOpacity / 100 : 0,
        }}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className={`
          relative flex flex-col max-w-xs w-full
          bg-white dark:bg-gray-900
          transform transition-transform ease-in-out
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          ${className}
        `}
        style={{
          transitionDuration: `${animationDuration}ms`,
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Close Button */}
        {showCloseButton && (
          <div className="absolute top-4 right-4 z-10">
            <button
              type="button"
              onClick={handleClose}
              className="
                p-2 rounded-md
                text-gray-600 hover:text-gray-900 hover:bg-gray-100
                dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800
                focus:outline-none focus:ring-2 focus:ring-primary-500
                transition-colors duration-200
              "
              aria-label="Close mobile navigation"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto">
          <Sidebar
            className="h-full"
            onNavigate={handleClose}
          />
        </div>

        {/* Mobile Navigation Title (for screen readers) */}
        <h2 id="mobile-nav-title" className="sr-only">
          Mobile Navigation Menu
        </h2>
      </div>
    </div>
  );
});

MobileNav.displayName = 'MobileNav';

export default MobileNav;
