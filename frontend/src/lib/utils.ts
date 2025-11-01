/**
 * Utility Functions
 *
 * Common utility functions used across the application.
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines class names using clsx and tailwind-merge
 * Useful for conditionally applying Tailwind CSS classes
 *
 * @param inputs - Class names to combine
 * @returns Combined class string
 *
 * @example
 * ```tsx
 * cn('px-4 py-2', isActive && 'bg-blue-500', className)
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date to a localized string
 *
 * @param date - Date to format
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', options).format(dateObj)
}

/**
 * Format a number as currency
 *
 * @param amount - Amount to format
 * @param currency - Currency code (default: USD)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount)
}

/**
 * Truncate a string to a maximum length
 *
 * @param str - String to truncate
 * @param maxLength - Maximum length
 * @returns Truncated string
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return `${str.slice(0, maxLength)}...`
}

/**
 * Debounce a function
 *
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Sleep for a specified duration
 *
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after the specified duration
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Generate a random ID
 *
 * @param length - Length of the ID (default: 8)
 * @returns Random ID string
 */
export function generateId(length: number = 8): string {
  return Math.random().toString(36).substring(2, 2 + length)
}

/**
 * Converts a value to string, handling undefined safely
 *
 * @param value - Value to convert to string
 * @param fallback - Fallback value if undefined (default: '')
 * @returns String value
 */
export function ensureString(value: string | undefined | null, fallback: string = ''): string {
  return value ?? fallback
}

/**
 * Converts a conditional class expression to undefined if false
 * Useful for className props that don't accept false
 *
 * @param value - Conditional class value
 * @returns String or undefined
 */
export function conditionalClass(value: string | false): string | undefined {
  return value || undefined
}

/**
 * Ensures an array type is returned, filtering out undefined values
 *
 * @param value - Array that may contain undefined
 * @returns Filtered array without undefined values
 */
export function ensureArray<T>(value: (T | undefined)[] | undefined): T[] {
  return (value ?? []).filter((item): item is T => item !== undefined)
}
