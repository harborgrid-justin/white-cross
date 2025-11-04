/**
 * useReducedMotion Hook
 *
 * Detects if the user has requested reduced motion via their OS settings.
 * Respects the prefers-reduced-motion media query for accessibility.
 *
 * @returns {boolean} True if reduced motion is preferred, false otherwise
 *
 * @example
 * ```tsx
 * const shouldReduceMotion = useReducedMotion();
 *
 * <motion.div
 *   animate={{ opacity: 1 }}
 *   transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
 * />
 * ```
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
 * @wcag WCAG 2.1 Level AAA - 2.3.3 Animation from Interactions
 */

'use client';

import { useEffect, useState } from 'react';

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return;
    }

    // Create media query
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Handler for when preference changes
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setPrefersReducedMotion(event.matches);
    };

    // Listen for changes
    // Note: Safari < 14 uses addListener/removeListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange as (event: MediaQueryListEvent) => void);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange as (event: MediaQueryListEvent) => void);
      }
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Get transition object based on reduced motion preference
 *
 * @param shouldReduceMotion - Whether to reduce motion
 * @param defaultDuration - Default animation duration
 * @returns Transition configuration object
 *
 * @example
 * ```tsx
 * const shouldReduceMotion = useReducedMotion();
 *
 * <motion.div
 *   transition={getTransition(shouldReduceMotion, 0.3)}
 * />
 * ```
 */
export function getTransition(
  shouldReduceMotion: boolean,
  defaultDuration = 0.3
): { duration: number; ease?: string } {
  return {
    duration: shouldReduceMotion ? 0.01 : defaultDuration,
    ease: shouldReduceMotion ? 'linear' : 'easeInOut',
  };
}

/**
 * Get animation variants that respect reduced motion
 *
 * @param shouldReduceMotion - Whether to reduce motion
 * @returns Animation variant configuration
 *
 * @example
 * ```tsx
 * const shouldReduceMotion = useReducedMotion();
 * const variants = getAnimationVariants(shouldReduceMotion);
 *
 * <motion.div
 *   initial="initial"
 *   animate="animate"
 *   exit="exit"
 *   variants={variants.fade}
 * />
 * ```
 */
export function getAnimationVariants(shouldReduceMotion: boolean) {
  const instant = shouldReduceMotion ? 0.01 : 0;

  return {
    fade: {
      initial: { opacity: shouldReduceMotion ? 1 : 0 },
      animate: { opacity: 1 },
      exit: { opacity: shouldReduceMotion ? 1 : 0 },
    },
    slideUp: {
      initial: {
        opacity: shouldReduceMotion ? 1 : 0,
        y: shouldReduceMotion ? 0 : 10
      },
      animate: { opacity: 1, y: 0 },
      exit: {
        opacity: shouldReduceMotion ? 1 : 0,
        y: shouldReduceMotion ? 0 : -10
      },
    },
    scale: {
      initial: {
        opacity: shouldReduceMotion ? 1 : 0,
        scale: shouldReduceMotion ? 1 : 0.95
      },
      animate: { opacity: 1, scale: 1 },
      exit: {
        opacity: shouldReduceMotion ? 1 : 0,
        scale: shouldReduceMotion ? 1 : 0.95
      },
    },
  };
}
