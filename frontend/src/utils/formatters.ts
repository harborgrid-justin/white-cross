/**
 * @fileoverview Utility functions for formatting data
 * @module utils/formatters
 */

/**
 * Format a date string to a readable format
 */
export function formatDate(date: string | Date, format: 'short' | 'long' | 'full' = 'short'): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString();
    case 'long':
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'full':
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    default:
      return dateObj.toLocaleDateString();
  }
}

/**
 * Format a person's name
 */
export function formatName(firstName: string, lastName: string, format: 'full' | 'lastFirst' | 'firstInitial' = 'full'): string {
  if (!firstName && !lastName) return '';
  
  switch (format) {
    case 'full':
      return `${firstName || ''} ${lastName || ''}`.trim();
    case 'lastFirst':
      return `${lastName || ''}, ${firstName || ''}`.trim().replace(/^,\s*/, '').replace(/,\s*$/, '');
    case 'firstInitial':
      const initial = firstName ? firstName.charAt(0).toUpperCase() + '.' : '';
      return `${initial} ${lastName || ''}`.trim();
    default:
      return `${firstName || ''} ${lastName || ''}`.trim();
  }
}

/**
 * Format a phone number
 */
export function formatPhone(phone: string): string {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // Format as +X (XXX) XXX-XXXX for international
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  // Return original if can't format
  return phone;
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  if (typeof amount !== 'number') return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals = 1): string {
  if (typeof value !== 'number') return '0%';
  
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
