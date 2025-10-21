/**
 * WF-UTIL-001 | cn.ts - Class Name Utility
 * Purpose: Utility function for conditional class name concatenation
 * Upstream: clsx, tailwind-merge | Dependencies: Utility libraries
 * Downstream: All components | Called by: Component styling
 * Related: Tailwind CSS classes, component props
 * Exports: cn function | Key Features: Conditional classes, merge conflicts
 * Last Updated: 2025-10-21 | File Type: .ts
 * Critical Path: Component render → Class generation → DOM styling
 * LLM Context: Class name utility for consistent styling across components
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names with clsx and merges Tailwind classes with tailwind-merge
 * This prevents Tailwind class conflicts and provides conditional class application
 * 
 * @param inputs - Class values to combine
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
