/**
 * Class Name Utility
 *
 * Combines class names using tailwind-merge and clsx.
 * This ensures Tailwind classes are properly merged without conflicts.
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names and merges Tailwind classes intelligently
 *
 * @param inputs - Class names, objects, or arrays
 * @returns Merged class name string
 *
 * @example
 * ```ts
 * cn('px-2 py-1', 'px-4') // => 'py-1 px-4'
 * cn('text-red-500', condition && 'text-blue-500') // Conditional classes
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
