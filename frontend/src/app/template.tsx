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

interface TemplateProps {
  children: React.ReactNode;
}

/**
 * Page transition template with fade animation
 * Simplified to avoid hydration mismatches
 */
export default function Template({ children }: TemplateProps) {
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
