/**
 * @fileoverview Password Utilities
 * @module shared/utilities/password.utils
 * @description Shared password hashing and verification functions for healthcare applications
 *
 * Features:
 * - Bcrypt password hashing with configurable salt rounds
 * - Secure password comparison
 * - Password complexity validation
 * - Secure random password generation
 * - HIPAA-compliant password requirements (12+ characters)
 *
 * LOC: PASSWORD_UTILS_NESTJS
 * UPSTREAM: bcryptjs
 * DOWNSTREAM: Authentication services, user management
 */

import * as bcrypt from 'bcrypt';

/**
 * Password configuration constants
 */
export const PASSWORD_CONFIG = {
  SALT_ROUNDS: 12, // Higher for healthcare applications
  MIN_LENGTH: 12,
  MAX_LENGTH: 128,
} as const;

/**
 * Hash a plain text password
 * @param password - Plain text password to hash
 * @param saltRounds - Number of salt rounds (defaults to 12)
 * @returns Promise resolving to hashed password
 */
export const hashPassword = async (
  password: string,
  saltRounds: number = PASSWORD_CONFIG.SALT_ROUNDS,
): Promise<string> => {
  try {
    if (!password || typeof password !== 'string') {
      throw new Error('Password is required and must be a string');
    }

    if (password.length < PASSWORD_CONFIG.MIN_LENGTH) {
      throw new Error(
        `Password must be at least ${PASSWORD_CONFIG.MIN_LENGTH} characters long`,
      );
    }

    if (password.length > PASSWORD_CONFIG.MAX_LENGTH) {
      throw new Error(
        `Password cannot exceed ${PASSWORD_CONFIG.MAX_LENGTH} characters`,
      );
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
};

/**
 * Compare a plain text password with a hashed password
 * @param candidatePassword - Plain text password to verify
 * @param hashedPassword - Hashed password to compare against
 * @returns Promise resolving to boolean indicating if passwords match
 */
export const comparePassword = async (
  candidatePassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  try {
    if (!candidatePassword || typeof candidatePassword !== 'string') {
      throw new Error('Candidate password is required and must be a string');
    }

    if (!hashedPassword || typeof hashedPassword !== 'string') {
      throw new Error('Hashed password is required and must be a string');
    }

    const isMatch = await bcrypt.compare(candidatePassword, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error('Error comparing password:', error);
    throw error;
  }
};

/**
 * Validate password complexity (for client-side feedback)
 * @param password - Password to validate
 * @returns Object with validation results
 */
export const validatePasswordComplexity = (password: string) => {
  const validation = {
    isValid: true,
    errors: [] as string[],
    strength: 0,
  };

  if (!password) {
    validation.errors.push('Password is required');
    validation.isValid = false;
    return validation;
  }

  // Length check
  if (password.length < PASSWORD_CONFIG.MIN_LENGTH) {
    validation.errors.push(
      `Password must be at least ${PASSWORD_CONFIG.MIN_LENGTH} characters long`,
    );
    validation.isValid = false;
  } else {
    validation.strength += 1;
  }

  if (password.length > PASSWORD_CONFIG.MAX_LENGTH) {
    validation.errors.push(
      `Password cannot exceed ${PASSWORD_CONFIG.MAX_LENGTH} characters`,
    );
    validation.isValid = false;
  }

  // Complexity checks
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[@$!%*?&]/.test(password);

  if (!hasLowercase) {
    validation.errors.push(
      'Password must contain at least one lowercase letter',
    );
    validation.isValid = false;
  } else {
    validation.strength += 1;
  }

  if (!hasUppercase) {
    validation.errors.push(
      'Password must contain at least one uppercase letter',
    );
    validation.isValid = false;
  } else {
    validation.strength += 1;
  }

  if (!hasNumbers) {
    validation.errors.push('Password must contain at least one number');
    validation.isValid = false;
  } else {
    validation.strength += 1;
  }

  if (!hasSpecialChars) {
    validation.errors.push(
      'Password must contain at least one special character (@$!%*?&)',
    );
    validation.isValid = false;
  } else {
    validation.strength += 1;
  }

  // Additional security checks
  const hasSequentialChars =
    /(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|123|234|345|456|567|678|789)/i.test(
      password,
    );
  const hasRepeatedChars = /(.)\1{2,}/.test(password);
  const hasCommonPatterns =
    /(?:password|admin|user|test|qwerty|123456|abcdef)/i.test(password);

  if (hasSequentialChars) {
    validation.errors.push('Password should not contain sequential characters');
    validation.strength -= 1;
  }

  if (hasRepeatedChars) {
    validation.errors.push('Password should not contain repeated characters');
    validation.strength -= 1;
  }

  if (hasCommonPatterns) {
    validation.errors.push(
      'Password should not contain common words or patterns',
    );
    validation.strength -= 1;
  }

  // Ensure strength doesn't go below 0
  validation.strength = Math.max(0, validation.strength);

  return validation;
};

/**
 * Generate a secure random password
 * @param length - Length of password to generate (defaults to 16)
 * @returns Generated password
 */
export const generateSecurePassword = (length: number = 16): string => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const specialChars = '@$!%*?&';
  const allChars = lowercase + uppercase + numbers + specialChars;

  // Ensure we have at least one character from each category
  let password = '';
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += specialChars[Math.floor(Math.random() * specialChars.length)];

  // Fill the rest with random characters
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password to avoid predictable patterns
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
};

export default {
  hashPassword,
  comparePassword,
  validatePasswordComplexity,
  generateSecurePassword,
  PASSWORD_CONFIG,
};
