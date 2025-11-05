/**
 * Core Utility Functions
 *
 * Essential utilities for className manipulation and merging
 * using Tailwind CSS with clsx.
 *
 * @module lib/utils
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines and merges CSS class names intelligently using clsx and tailwind-merge.
 *
 * This utility function combines multiple class name inputs (strings, arrays, objects)
 * and intelligently merges Tailwind CSS classes, resolving conflicts by keeping the
 * last occurrence. This is particularly useful for component styling where you want
 * to allow className overrides.
 *
 * @param {...ClassValue} inputs - Class name values to combine (strings, arrays, objects, or conditional classes)
 * @returns {string} Merged and deduplicated class name string
 *
 * @example
 * ```typescript
 * // Basic usage
 * cn('px-4 py-2', 'bg-blue-500') // 'px-4 py-2 bg-blue-500'
 *
 * // Conditional classes
 * cn('px-4', isActive && 'bg-blue-500') // 'px-4 bg-blue-500' if isActive is true
 *
 * // Tailwind conflict resolution (last class wins)
 * cn('px-2 py-2', 'px-4') // 'py-2 px-4' (px-4 overrides px-2)
 *
 * // Object syntax
 * cn({ 'bg-red-500': hasError, 'bg-green-500': !hasError })
 *
 * // Array syntax
 * cn(['px-4', 'py-2'], 'bg-blue-500')
 * ```
 *
 * @see {@link https://github.com/lukeed/clsx clsx documentation}
 * @see {@link https://github.com/dcastil/tailwind-merge tailwind-merge documentation}
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
