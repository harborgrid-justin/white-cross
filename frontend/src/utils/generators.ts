/**
 * @fileoverview Utility functions for generating IDs, slugs, and other values
 * @module utils/generators
 */

/**
 * Generate a unique ID
 */
export function generateId(prefix?: string): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 9);
  
  if (prefix) {
    return `${prefix}_${timestamp}_${randomStr}`;
  }
  
  return `${timestamp}_${randomStr}`;
}

/**
 * Generate a UUID v4
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Create a URL-friendly slug from a string
 */
export function createSlug(text: string): string {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate a random string of specified length
 */
export function generateRandomString(length: number = 8, includeSpecialChars = false): string {
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  if (includeSpecialChars) {
    chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  }
  
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * Generate a random password with specified criteria
 */
export function generatePassword(options: {
  length?: number;
  includeUppercase?: boolean;
  includeLowercase?: boolean;
  includeNumbers?: boolean;
  includeSpecialChars?: boolean;
  excludeSimilar?: boolean;
} = {}): string {
  const {
    length = 12,
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSpecialChars = true,
    excludeSimilar = false
  } = options;
  
  let chars = '';
  
  if (includeUppercase) {
    chars += excludeSimilar ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  }
  
  if (includeLowercase) {
    chars += excludeSimilar ? 'abcdefghijkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
  }
  
  if (includeNumbers) {
    chars += excludeSimilar ? '23456789' : '0123456789';
  }
  
  if (includeSpecialChars) {
    chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  }
  
  if (!chars) {
    throw new Error('At least one character set must be included');
  }
  
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return password;
}

/**
 * Generate a random color hex code
 */
export function generateRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  
  return color;
}

/**
 * Generate a random number within a range
 */
export function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate initials from a name
 */
export function generateInitials(firstName: string, lastName?: string): string {
  if (!firstName) return '';
  
  const first = firstName.charAt(0).toUpperCase();
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  
  return `${first}${last}`;
}

/**
 * Generate a short code (e.g., for invitations, referrals)
 */
export function generateShortCode(length: number = 6): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excludes similar looking characters
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * Generate a file name with timestamp
 */
export function generateFileName(originalName: string, extension?: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const name = createSlug(originalName.replace(/\.[^/.]+$/, '')); // Remove existing extension
  const ext = extension || originalName.split('.').pop() || 'txt';
  
  return `${name}_${timestamp}.${ext}`;
}

/**
 * Generate a barcode/reference number
 */
export function generateReferenceNumber(prefix?: string, length: number = 8): string {
  const timestamp = Date.now().toString();
  const random = generateRandomString(length, false).toUpperCase();
  
  if (prefix) {
    return `${prefix}-${timestamp.slice(-6)}-${random}`;
  }
  
  return `${timestamp.slice(-6)}-${random}`;
}
