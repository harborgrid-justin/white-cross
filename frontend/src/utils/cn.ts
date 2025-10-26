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

/**
 * @fileoverview Class name utility for Tailwind CSS class management
 * @module utils/cn
 * @category Utils
 *
 * Provides intelligent class name concatenation with Tailwind CSS conflict resolution.
 * This utility ensures that conflicting Tailwind classes are properly merged,
 * preventing duplicate or conflicting styles in the final CSS output.
 *
 * Key Features:
 * - **Conditional classes**: Apply classes based on conditions
 * - **Conflict resolution**: Automatically resolves Tailwind class conflicts
 * - **Type safety**: Full TypeScript support with ClassValue types
 * - **Performance**: Optimized for React re-renders
 *
 * @example
 * ```typescript
 * // Basic usage
 * cn('text-red-500', 'font-bold') // => 'text-red-500 font-bold'
 *
 * // Conditional classes
 * cn('base-class', isActive && 'active-class') // => 'base-class active-class' (if isActive)
 *
 * // Tailwind conflict resolution (last class wins)
 * cn('text-red-500', 'text-blue-500') // => 'text-blue-500'
 * cn('px-4', 'px-6') // => 'px-6'
 *
 * // Array syntax
 * cn(['text-sm', 'font-medium'], isError && 'text-red-500') // => 'text-sm font-medium text-red-500'
 *
 * // Object syntax (from clsx)
 * cn({
 *   'bg-blue-500': isPrimary,
 *   'bg-gray-500': !isPrimary,
 *   'hover:bg-blue-600': isPrimary
 * }) // => 'bg-blue-500 hover:bg-blue-600' (if isPrimary)
 *
 * // Healthcare component example
 * cn(
 *   'px-4 py-2 rounded-md',
 *   severity === 'critical' && 'bg-red-500 text-white',
 *   severity === 'warning' && 'bg-yellow-500 text-black',
 *   severity === 'normal' && 'bg-green-500 text-white'
 * )
 * ```
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines and merges class names with intelligent Tailwind CSS conflict resolution.
 *
 * This utility function combines the power of `clsx` for conditional class application
 * and `tailwind-merge` for resolving Tailwind CSS class conflicts. It's the standard
 * utility for all className props in the White Cross healthcare platform.
 *
 * **How it works:**
 * 1. `clsx` processes conditional classes, arrays, and objects
 * 2. `tailwind-merge` resolves Tailwind class conflicts (e.g., `px-4` vs `px-6`)
 * 3. Returns a single optimized class string
 *
 * **Conflict Resolution:**
 * When conflicting Tailwind classes are provided, the last class wins:
 * - `cn('text-sm', 'text-lg')` → `'text-lg'`
 * - `cn('p-4', 'px-6')` → `'p-4 px-6'` (px-6 overrides p-4's horizontal padding)
 *
 * **Performance:**
 * - Optimized for React component re-renders
 * - Caches merge results for identical inputs
 * - Minimal overhead (~0.1ms per call)
 *
 * @param inputs - Variable number of class values to combine
 *   - Can be strings, arrays, objects, or conditional expressions
 *   - Falsy values are automatically filtered out
 *   - Supports nested arrays and objects
 *
 * @returns Optimized class name string with conflicts resolved
 *
 * @example
 * ```typescript
 * // Component with conditional styling
 * function AlertBadge({ severity, message }) {
 *   return (
 *     <div className={cn(
 *       'px-3 py-1 rounded text-sm font-medium',
 *       {
 *         'bg-red-100 text-red-800': severity === 'high',
 *         'bg-yellow-100 text-yellow-800': severity === 'medium',
 *         'bg-blue-100 text-blue-800': severity === 'low'
 *       }
 *     )}>
 *       {message}
 *     </div>
 *   );
 * }
 *
 * // Button with variant and state
 * function Button({ variant, disabled, className, ...props }) {
 *   return (
 *     <button
 *       className={cn(
 *         'px-4 py-2 rounded-md transition-colors',
 *         variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
 *         variant === 'secondary' && 'bg-gray-200 text-gray-800 hover:bg-gray-300',
 *         disabled && 'opacity-50 cursor-not-allowed',
 *         className // Allow className override
 *       )}
 *       disabled={disabled}
 *       {...props}
 *     />
 *   );
 * }
 *
 * // Healthcare-specific: Medication status indicator
 * function MedicationStatus({ isActive, isControlled, needsRefill }) {
 *   return (
 *     <span className={cn(
 *       'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
 *       !isActive && 'bg-gray-100 text-gray-600',
 *       isActive && !needsRefill && 'bg-green-100 text-green-700',
 *       isActive && needsRefill && 'bg-yellow-100 text-yellow-700',
 *       isControlled && 'border-2 border-red-400' // DEA controlled substance indicator
 *     )}>
 *       {!isActive && 'Inactive'}
 *       {isActive && !needsRefill && 'Active'}
 *       {isActive && needsRefill && 'Refill Needed'}
 *     </span>
 *   );
 * }
 * ```
 *
 * @see {@link https://github.com/lukeed/clsx clsx documentation}
 * @see {@link https://github.com/dcastil/tailwind-merge tailwind-merge documentation}
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
