/**
 * Root Template Component
 *
 * Re-renders on every navigation (unlike layout.tsx which persists)
 * Use for animations, transitions, or resetting state on navigation
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/template
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';

interface TemplateProps {
  children: React.ReactNode;
}

/**
 * Inner template component that uses pathname
 */
function TemplateInner({ children }: TemplateProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{
          duration: 0.2,
          ease: 'easeInOut',
        }}
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
