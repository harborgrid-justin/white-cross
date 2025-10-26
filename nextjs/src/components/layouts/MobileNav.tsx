'use client';

/**
 * Mobile Navigation Drawer Component
 *
 * Features:
 * - Slide-in drawer animation from left
 * - Backdrop overlay with click-to-close
 * - Full sidebar navigation on mobile
 * - Smooth transitions
 * - Accessibility with focus trap
 * - ESC key to close
 */

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Sidebar } from './Sidebar';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Handle ESC key to close
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Focus trap - keep focus within drawer when open
  useEffect(() => {
    if (!isOpen || !drawerRef.current) return;

    const drawer = drawerRef.current;
    const focusableElements = drawer.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    function handleTab(event: KeyboardEvent) {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    }

    drawer.addEventListener('keydown', handleTab as any);
    firstElement?.focus();

    return () => {
      drawer.removeEventListener('keydown', handleTab as any);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="lg:hidden fixed inset-0 z-40 flex"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      {/* Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300 ease-in-out"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-900 transform transition ease-in-out duration-300 shadow-xl"
      >
        {/* Close Button */}
        <div className="absolute top-0 right-0 -mr-12 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            aria-label="Close navigation"
          >
            <X className="h-6 w-6 text-white" aria-hidden="true" />
          </button>
        </div>

        {/* Sidebar Content */}
        <Sidebar className="flex-1 h-full overflow-y-auto" onNavigate={onClose} />
      </div>
    </div>
  );
}
