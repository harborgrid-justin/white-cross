/**
 * Root Template Component
 *
 * Re-renders on every navigation (unlike layout.tsx which persists)
 * Use for animations, transitions, or resetting state on navigation
 *
 * Respects prefers-reduced-motion for accessibility (WCAG 2.1 AAA - 2.3.3)
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/template
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import { useReducedMotion, getTransition } from '@/hooks/useReducedMotion';

interface TemplateProps {
  children: React.ReactNode;
}

/**
 * Inner template component that uses pathname
 */
function TemplateInner({ children }: TemplateProps) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : -10 }}
        transition={getTransition(shouldReduceMotion, 0.2)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Page transition template with fade animation
 * Wrapped in Suspense to prevent blocking route issues
 */
export default function Template({ children }: TemplateProps) {
  return (
    <Suspense fallback={<div className="animate-pulse min-h-screen bg-gray-50" />}>
      <TemplateInner>{children}</TemplateInner>
    </Suspense>
  );
}
