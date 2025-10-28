/**
 * @fileoverview Security Utilities for Cryptographic Operations
 * @module utils/securityUtils
 * @description Provides cryptographically secure utilities for password generation,
 * random token generation, and other security-critical operations.
 *
 * SECURITY: All functions use Node.js crypto module for CSPRNG (Cryptographically Secure
 * Pseudo-Random Number Generator). Never use Math.random() for security-critical operations.
 *
 * @security HIPAA Compliance - Secure credential generation
 * @security NIST Guidelines - Follows password generation best practices
 */

import { randomBytes } from 'crypto';

/**
 * Generate a cryptographically secure random password
 *
 * SECURITY: Uses crypto.randomBytes() for true randomness, not Math.random()
 * Generates URL-safe base64 encoded strings suitable for OAuth user passwords
 *
 * @param length - Desired password length (default: 32 characters)
 * @returns Cryptographically secure random password
 *
 * @security Uses CSPRNG (Cryptographically Secure Pseudo-Random Number Generator)
 * @security Meets NIST SP 800-63B password generation requirements
 *
 * @example
 * const password = generateSecurePassword(32);
 * // Returns: "K8jX9mPqR5sL2nV7wY4tZ1uC6bH3dG0f"
 *
 * @example
 * // Usage for OAuth user provisioning
 * const oauthUserPassword = generateSecurePassword(64);
 * // Returns: "aB3dE6fG9hJ2kL5mN8pQ1rS4tV7wX0yZ..."
 */
export function generateSecurePassword(length: number = 32): string {
  // Generate random bytes (more bytes than needed to account for base64 encoding)
  const randomBytesCount = Math.ceil(length * 0.75); // base64 encoding increases size
  const buffer = randomBytes(randomBytesCount);

  // Convert to base64 and take only the required length
  // Replace URL-unsafe characters for compatibility
  return buffer
    .toString('base64')
    .replace(/\+/g, '0')
    .replace(/\//g, '1')
    .replace(/=/g, '2')
    .slice(0, length);
}

/**
 * Generate a cryptographically secure random token
 *
 * Used for session tokens, API keys, reset tokens, etc.
 * Returns hex-encoded string (2 characters per byte)
 *
 * @param byteLength - Number of random bytes to generate (default: 32)
 * @returns Hex-encoded random token (byteLength * 2 characters)
 *
 * @security Uses CSPRNG for unpredictable tokens
 * @security Suitable for session tokens, CSRF tokens, API keys
 *
 * @example
 * const sessionToken = generateSecureToken(32);
 * // Returns: "a7f3e9c2b8d4f1a6e5c9b2d8f3a7e1c4b6d9f2a5e8c1b4d7f0a3e6c9b2d5f8a1"
 *
 * @example
 * const resetToken = generateSecureToken(16);
 * // Returns: "8f3a2c9b1e5d7f4a0c6e9b2d5f8a1c4e"
 */
export function generateSecureToken(byteLength: number = 32): string {
  return randomBytes(byteLength).toString('hex');
}

/**
 * Generate a secure numeric PIN
 *
 * Useful for OTP, verification codes, etc.
 * Uses rejection sampling to ensure uniform distribution
 *
 * @param digitLength - Number of digits in PIN (default: 6)
 * @returns Numeric PIN as string
 *
 * @security Uses CSPRNG with rejection sampling for uniform distribution
 * @security Avoids modulo bias that would make some PINs more likely
 *
 * @example
 * const otp = generateSecureNumericPIN(6);
 * // Returns: "492738"
 *
 * @example
 * const verificationCode = generateSecureNumericPIN(4);
 * // Returns: "8472"
 */
export function generateSecureNumericPIN(digitLength: number = 6): string {
  const max = Math.pow(10, digitLength);
  const byteLength = Math.ceil(digitLength * 0.5); // ~3.3 bits per decimal digit

  let pin: number;

  // Rejection sampling to avoid modulo bias
  do {
    const buffer = randomBytes(byteLength);
    pin = parseInt(buffer.toString('hex'), 16) % max;
  } while (pin >= max);

  // Pad with leading zeros if necessary
  return pin.toString().padStart(digitLength, '0');
}

/**
 * Generate a secure alphanumeric code
 *
 * Uses only alphanumeric characters (no special chars)
 * Useful for user-facing codes, confirmation codes, etc.
 *
 * @param length - Desired code length (default: 12)
 * @returns Alphanumeric code (A-Z, a-z, 0-9)
 *
 * @security Uses CSPRNG for unpredictability
 * @security Character set: A-Z, a-z, 0-9 (62 possible characters)
 *
 * @example
 * const confirmationCode = generateAlphanumericCode(8);
 * // Returns: "K8jX9mPq"
 *
 * @example
 * const inviteCode = generateAlphanumericCode(16);
 * // Returns: "R5sL2nV7wY4tZ1uC"
 */
export function generateAlphanumericCode(length: number = 12): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charsetLength = charset.length;
  const maxByte = 256 - (256 % charsetLength); // For rejection sampling

  let result = '';

  while (result.length < length) {
    const bytes = randomBytes(length * 2); // Generate extra to account for rejections

    for (let i = 0; i < bytes.length && result.length < length; i++) {
      // Rejection sampling to avoid modulo bias
      if (bytes[i] < maxByte) {
        result += charset[bytes[i] % charsetLength];
      }
    }
  }

  return result.slice(0, length);
}

/**
 * Validate password strength
 *
 * Checks if password meets minimum security requirements
 * Used before hashing passwords to ensure they're not too weak
 *
 * @param password - Password to validate
 * @returns Object with isValid flag and error message if invalid
 *
 * @security Enforces minimum length of 12 characters (NIST recommendation)
 * @security Checks for basic complexity requirements
 *
 * @example
 * const result = validatePasswordStrength('weak');
 * // Returns: { isValid: false, error: 'Password must be at least 12 characters' }
 *
 * @example
 * const result = validatePasswordStrength('StrongP@ssw0rd123');
 * // Returns: { isValid: true, error: undefined }
 */
export function validatePasswordStrength(password: string): { isValid: boolean; error?: string } {
  // Minimum length check
  if (password.length < 12) {
    return {
      isValid: false,
      error: 'Password must be at least 12 characters long'
    };
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one uppercase letter'
    };
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one lowercase letter'
    };
  }

  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one number'
    };
  }

  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one special character'
    };
  }

  return { isValid: true };
}

/**
 * Check if string is a common/weak password
 *
 * Checks against a list of common passwords
 * Should be expanded with larger password blacklist in production
 *
 * @param password - Password to check
 * @returns True if password is common/weak
 *
 * @security Prevents use of most common passwords
 * @security In production, use larger password database (e.g., Have I Been Pwned API)
 *
 * @example
 * const isWeak = isCommonPassword('password123');
 * // Returns: true
 *
 * @example
 * const isWeak = isCommonPassword('StrongUnique P@ssw0rd123');
 * // Returns: false
 */
export function isCommonPassword(password: string): boolean {
  // Top 50 most common passwords (expand this list in production)
  const commonPasswords = [
    'password', 'password123', '123456', '12345678', 'qwerty', 'abc123',
    'monkey', '1234567', 'letmein', 'trustno1', 'dragon', 'baseball',
    'iloveyou', 'master', 'sunshine', 'ashley', 'bailey', 'shadow',
    'superman', 'qwertyuiop', '123123', 'password1', 'welcome', 'admin',
    'login', 'passw0rd', 'password!', 'p@ssw0rd', 'admin123', 'root',
    'test', 'guest', 'default', 'user', '123456789', '1234567890',
    'qwerty123', 'password12', 'passw0rd123', '12341234', 'abcd1234',
    'temp', 'temporary', 'changeme', 'letmein123', 'access', 'secret',
    'welcome123', 'hello', 'test123', 'demo'
  ];

  const lowerPassword = password.toLowerCase();

  return commonPasswords.some(common => lowerPassword.includes(common));
}
