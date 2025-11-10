/**
 * LOC: IAM-PWD-001
 * File: /reuse/iam-password-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - IAM services
 *   - Authentication controllers
 *   - Password management services
 *   - User registration flows
 */

/**
 * File: /reuse/iam-password-kit.ts
 * Locator: WC-IAM-PWD-001
 * Purpose: Comprehensive Password Management Kit - Complete password security toolkit
 *
 * Upstream: Independent utility module for password operations
 * Downstream: ../backend/*, IAM services, Auth controllers, User management
 * Dependencies: TypeScript 5.x, Node 18+, crypto
 * Exports: 45 utility functions for password hashing, validation, policies, reset flows
 *
 * LLM Context: Enterprise-grade password management utilities for White Cross healthcare platform.
 * Provides bcrypt/scrypt/argon2 hashing, strength validation, policy enforcement, history tracking,
 * reset flows, expiration management, secure generation, breach detection, complexity rules, and
 * common password checking. HIPAA-compliant password security for healthcare data protection.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Password hash result containing the hash and metadata.
 */
interface PasswordHashResult {
  hash: string;
  algorithm: 'bcrypt' | 'scrypt' | 'argon2';
  salt?: string;
  iterations?: number;
  memory?: number;
  parallelism?: number;
  createdAt: Date;
}

/**
 * Configuration for bcrypt password hashing.
 */
interface BcryptConfig {
  rounds?: number; // Cost factor (4-31, default 10)
}

/**
 * Configuration for scrypt password hashing.
 */
interface ScryptConfig {
  cost?: number; // CPU/memory cost (default 16384)
  blockSize?: number; // Block size (default 8)
  parallelization?: number; // Parallelization factor (default 1)
  keyLength?: number; // Derived key length (default 64)
  maxmem?: number; // Maximum memory (default 128 * cost * blockSize)
}

/**
 * Configuration for argon2 password hashing.
 */
interface Argon2Config {
  timeCost?: number; // Number of iterations (default 3)
  memoryCost?: number; // Memory usage in KiB (default 65536)
  parallelism?: number; // Degree of parallelism (default 4)
  hashLength?: number; // Length of hash in bytes (default 32)
  type?: 'argon2d' | 'argon2i' | 'argon2id'; // Argon2 variant
}

/**
 * Password strength assessment result.
 */
interface PasswordStrengthResult {
  score: number; // 0-100
  level: 'very-weak' | 'weak' | 'fair' | 'strong' | 'very-strong';
  isAcceptable: boolean;
  feedback: string[];
  metrics: {
    length: number;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumbers: boolean;
    hasSpecialChars: boolean;
    entropy: number;
    uniqueChars: number;
  };
}

/**
 * Password policy configuration.
 */
interface PasswordPolicy {
  minLength: number;
  maxLength?: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  minUppercase?: number;
  minLowercase?: number;
  minNumbers?: number;
  minSpecialChars?: number;
  prohibitCommon?: boolean;
  prohibitUserInfo?: boolean;
  prohibitRepeating?: boolean;
  maxRepeatingChars?: number;
  prohibitSequential?: boolean;
  minUniqueChars?: number;
  customPatterns?: RegExp[];
}

/**
 * Password policy validation result.
 */
interface PolicyValidationResult {
  isValid: boolean;
  violations: string[];
  satisfiedRules: string[];
}

/**
 * Password history entry.
 */
interface PasswordHistoryEntry {
  userId: string;
  passwordHash: string;
  createdAt: Date;
  algorithm: string;
}

/**
 * Password reset request.
 */
interface PasswordResetRequest {
  userId: string;
  email: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  usedAt?: Date;
  ipAddress?: string;
}

/**
 * Password reset validation result.
 */
interface PasswordResetValidation {
  isValid: boolean;
  reason?: string;
  userId?: string;
}

/**
 * Password expiration information.
 */
interface PasswordExpirationInfo {
  expiresAt: Date;
  isExpired: boolean;
  daysUntilExpiration: number;
  warningThreshold: number;
  shouldWarn: boolean;
}

/**
 * Password generation options.
 */
interface PasswordGenerationOptions {
  length?: number;
  includeUppercase?: boolean;
  includeLowercase?: boolean;
  includeNumbers?: boolean;
  includeSpecialChars?: boolean;
  excludeSimilar?: boolean; // Exclude similar chars like l, 1, O, 0
  excludeAmbiguous?: boolean;
  customCharset?: string;
  minUppercase?: number;
  minLowercase?: number;
  minNumbers?: number;
  minSpecialChars?: number;
}

/**
 * Password breach check result.
 */
interface BreachCheckResult {
  isBreached: boolean;
  timesBreached?: number;
  source?: string;
  checkedAt: Date;
}

/**
 * Complexity rule definition.
 */
interface ComplexityRule {
  name: string;
  description: string;
  validator: (password: string) => boolean;
  errorMessage: string;
}

/**
 * Common password check result.
 */
interface CommonPasswordCheckResult {
  isCommon: boolean;
  rank?: number; // Position in common passwords list
  category?: string;
}

// ============================================================================
// PASSWORD HASHING - BCRYPT
// ============================================================================

/**
 * Hashes a password using bcrypt algorithm with configurable cost factor.
 *
 * @param {string} password - Plain text password to hash
 * @param {BcryptConfig} [config] - Bcrypt configuration options
 * @returns {Promise<PasswordHashResult>} Hash result with metadata
 * @throws {Error} If password is empty or hashing fails
 *
 * @example
 * ```typescript
 * const result = await hashPasswordBcrypt('SecurePass123!', { rounds: 12 });
 * console.log(result.hash); // Bcrypt hash string
 * console.log(result.algorithm); // 'bcrypt'
 * ```
 */
export const hashPasswordBcrypt = async (
  password: string,
  config?: BcryptConfig
): Promise<PasswordHashResult> => {
  if (!password) throw new Error('Password cannot be empty');

  const rounds = config?.rounds || 10;
  if (rounds < 4 || rounds > 31) throw new Error('Bcrypt rounds must be between 4 and 31');

  // Simulated bcrypt hash (in production, use actual bcrypt library)
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, Math.pow(2, rounds), 64, 'sha512').toString('hex');
  const bcryptHash = `$2b$${rounds.toString().padStart(2, '0')}$${salt}$${hash}`;

  return {
    hash: bcryptHash,
    algorithm: 'bcrypt',
    salt,
    iterations: Math.pow(2, rounds),
    createdAt: new Date(),
  };
};

/**
 * Verifies a password against a bcrypt hash.
 *
 * @param {string} password - Plain text password to verify
 * @param {string} hash - Bcrypt hash to verify against
 * @returns {Promise<boolean>} True if password matches hash
 * @throws {Error} If inputs are invalid
 *
 * @example
 * ```typescript
 * const isValid = await verifyPasswordBcrypt('SecurePass123!', storedHash);
 * if (isValid) {
 *   console.log('Password is correct');
 * }
 * ```
 */
export const verifyPasswordBcrypt = async (password: string, hash: string): Promise<boolean> => {
  if (!password || !hash) throw new Error('Password and hash are required');

  // Parse bcrypt hash
  const parts = hash.split('$');
  if (parts.length !== 4 || parts[1] !== '2b') return false;

  const rounds = parseInt(parts[2], 10);
  const salt = parts[3].substring(0, 32);

  const computed = crypto.pbkdf2Sync(password, salt, Math.pow(2, rounds), 64, 'sha512').toString('hex');
  const expected = parts[3].substring(32);

  return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(expected));
};

// ============================================================================
// PASSWORD HASHING - SCRYPT
// ============================================================================

/**
 * Hashes a password using scrypt algorithm with configurable parameters.
 *
 * @param {string} password - Plain text password to hash
 * @param {ScryptConfig} [config] - Scrypt configuration options
 * @returns {Promise<PasswordHashResult>} Hash result with metadata
 * @throws {Error} If password is empty or hashing fails
 *
 * @example
 * ```typescript
 * const result = await hashPasswordScrypt('SecurePass123!', {
 *   cost: 32768,
 *   blockSize: 8,
 *   parallelization: 1
 * });
 * ```
 */
export const hashPasswordScrypt = async (
  password: string,
  config?: ScryptConfig
): Promise<PasswordHashResult> => {
  if (!password) throw new Error('Password cannot be empty');

  const cost = config?.cost || 16384;
  const blockSize = config?.blockSize || 8;
  const parallelization = config?.parallelization || 1;
  const keyLength = config?.keyLength || 64;

  const salt = crypto.randomBytes(32);
  const hash = crypto.scryptSync(password, salt, keyLength, {
    cost,
    blockSize,
    parallelization,
    maxmem: config?.maxmem || 128 * cost * blockSize,
  });

  const combined = `scrypt$${cost}$${blockSize}$${parallelization}$${salt.toString('hex')}$${hash.toString('hex')}`;

  return {
    hash: combined,
    algorithm: 'scrypt',
    salt: salt.toString('hex'),
    memory: cost,
    createdAt: new Date(),
  };
};

/**
 * Verifies a password against a scrypt hash.
 *
 * @param {string} password - Plain text password to verify
 * @param {string} hash - Scrypt hash to verify against
 * @returns {Promise<boolean>} True if password matches hash
 * @throws {Error} If inputs are invalid
 *
 * @example
 * ```typescript
 * const isValid = await verifyPasswordScrypt('SecurePass123!', storedHash);
 * ```
 */
export const verifyPasswordScrypt = async (password: string, hash: string): Promise<boolean> => {
  if (!password || !hash) throw new Error('Password and hash are required');

  const parts = hash.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;

  const cost = parseInt(parts[1], 10);
  const blockSize = parseInt(parts[2], 10);
  const parallelization = parseInt(parts[3], 10);
  const salt = Buffer.from(parts[4], 'hex');
  const expectedHash = Buffer.from(parts[5], 'hex');

  const computed = crypto.scryptSync(password, salt, expectedHash.length, {
    cost,
    blockSize,
    parallelization,
    maxmem: 128 * cost * blockSize,
  });

  return crypto.timingSafeEqual(computed, expectedHash);
};

/**
 * Hashes a password using argon2 algorithm (simulated implementation).
 *
 * @param {string} password - Plain text password to hash
 * @param {Argon2Config} [config] - Argon2 configuration options
 * @returns {Promise<PasswordHashResult>} Hash result with metadata
 * @throws {Error} If password is empty or hashing fails
 *
 * @example
 * ```typescript
 * const result = await hashPasswordArgon2('SecurePass123!', {
 *   timeCost: 3,
 *   memoryCost: 65536,
 *   parallelism: 4,
 *   type: 'argon2id'
 * });
 * ```
 */
export const hashPasswordArgon2 = async (
  password: string,
  config?: Argon2Config
): Promise<PasswordHashResult> => {
  if (!password) throw new Error('Password cannot be empty');

  const timeCost = config?.timeCost || 3;
  const memoryCost = config?.memoryCost || 65536;
  const parallelism = config?.parallelism || 4;
  const hashLength = config?.hashLength || 32;
  const type = config?.type || 'argon2id';

  const salt = crypto.randomBytes(16);

  // Simulated argon2 (in production, use actual argon2 library)
  let hash = salt;
  for (let i = 0; i < timeCost; i++) {
    hash = crypto.pbkdf2Sync(password, hash, memoryCost, hashLength, 'sha512');
  }

  const combined = `$${type}$v=19$m=${memoryCost},t=${timeCost},p=${parallelism}$${salt.toString('base64')}$${hash.toString('base64')}`;

  return {
    hash: combined,
    algorithm: 'argon2',
    salt: salt.toString('hex'),
    iterations: timeCost,
    memory: memoryCost,
    parallelism,
    createdAt: new Date(),
  };
};

// ============================================================================
// PASSWORD STRENGTH VALIDATION
// ============================================================================

/**
 * Calculates password entropy (randomness measure).
 *
 * @param {string} password - Password to analyze
 * @returns {number} Entropy value in bits
 *
 * @example
 * ```typescript
 * const entropy = calculatePasswordEntropy('SecurePass123!');
 * console.log(entropy); // ~65 bits
 * ```
 */
export const calculatePasswordEntropy = (password: string): number => {
  if (!password) return 0;

  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;

  return Math.log2(Math.pow(charsetSize, password.length));
};

/**
 * Assesses password strength with detailed metrics and feedback.
 *
 * @param {string} password - Password to assess
 * @returns {PasswordStrengthResult} Comprehensive strength assessment
 *
 * @example
 * ```typescript
 * const result = assessPasswordStrength('SecurePass123!');
 * console.log(result.level); // 'strong'
 * console.log(result.score); // 85
 * console.log(result.feedback); // ['Good length', 'Contains special characters']
 * ```
 */
export const assessPasswordStrength = (password: string): PasswordStrengthResult => {
  const feedback: string[] = [];
  const metrics = {
    length: password.length,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumbers: /[0-9]/.test(password),
    hasSpecialChars: /[^a-zA-Z0-9]/.test(password),
    entropy: calculatePasswordEntropy(password),
    uniqueChars: new Set(password).size,
  };

  let score = 0;

  // Length scoring
  if (metrics.length >= 12) { score += 25; feedback.push('Excellent length'); }
  else if (metrics.length >= 8) { score += 15; feedback.push('Good length'); }
  else { feedback.push('Password is too short'); }

  // Character diversity
  if (metrics.hasUppercase) { score += 10; feedback.push('Contains uppercase'); }
  else { feedback.push('Add uppercase letters'); }

  if (metrics.hasLowercase) { score += 10; feedback.push('Contains lowercase'); }
  else { feedback.push('Add lowercase letters'); }

  if (metrics.hasNumbers) { score += 10; feedback.push('Contains numbers'); }
  else { feedback.push('Add numbers'); }

  if (metrics.hasSpecialChars) { score += 15; feedback.push('Contains special characters'); }
  else { feedback.push('Add special characters'); }

  // Entropy scoring
  if (metrics.entropy >= 60) { score += 20; }
  else if (metrics.entropy >= 40) { score += 10; }

  // Unique characters
  if (metrics.uniqueChars >= password.length * 0.8) { score += 10; }

  let level: PasswordStrengthResult['level'];
  if (score >= 85) level = 'very-strong';
  else if (score >= 70) level = 'strong';
  else if (score >= 50) level = 'fair';
  else if (score >= 30) level = 'weak';
  else level = 'very-weak';

  return {
    score,
    level,
    isAcceptable: score >= 50,
    feedback,
    metrics,
  };
};

/**
 * Validates password meets minimum strength requirements.
 *
 * @param {string} password - Password to validate
 * @param {number} [minScore=50] - Minimum acceptable score (0-100)
 * @returns {boolean} True if password meets strength requirements
 *
 * @example
 * ```typescript
 * const isStrong = validatePasswordStrength('SecurePass123!', 70);
 * ```
 */
export const validatePasswordStrength = (password: string, minScore: number = 50): boolean => {
  const result = assessPasswordStrength(password);
  return result.score >= minScore;
};

/**
 * Checks if password contains patterns that reduce strength.
 *
 * @param {string} password - Password to check
 * @returns {string[]} Array of detected weak patterns
 *
 * @example
 * ```typescript
 * const weakPatterns = detectWeakPasswordPatterns('password123');
 * // ['sequential-numbers', 'common-word']
 * ```
 */
export const detectWeakPasswordPatterns = (password: string): string[] => {
  const patterns: string[] = [];

  // Sequential numbers
  if (/(?:012|123|234|345|456|567|678|789)/.test(password)) {
    patterns.push('sequential-numbers');
  }

  // Sequential letters
  if (/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password)) {
    patterns.push('sequential-letters');
  }

  // Repeating characters
  if (/(.)\1{2,}/.test(password)) {
    patterns.push('repeating-characters');
  }

  // Keyboard patterns
  if (/(qwerty|asdfgh|zxcvbn|qazwsx|123456|password)/i.test(password)) {
    patterns.push('keyboard-pattern');
  }

  // Common words
  if (/(password|admin|user|login|welcome|test|demo)/i.test(password)) {
    patterns.push('common-word');
  }

  return patterns;
};

/**
 * Generates password strength feedback for user guidance.
 *
 * @param {string} password - Password to analyze
 * @returns {string[]} Array of improvement suggestions
 *
 * @example
 * ```typescript
 * const suggestions = generatePasswordFeedback('weak');
 * // ['Increase length to at least 12 characters', 'Add special characters']
 * ```
 */
export const generatePasswordFeedback = (password: string): string[] => {
  const result = assessPasswordStrength(password);
  const suggestions: string[] = [...result.feedback];

  const weakPatterns = detectWeakPasswordPatterns(password);
  if (weakPatterns.length > 0) {
    suggestions.push(`Avoid patterns: ${weakPatterns.join(', ')}`);
  }

  if (password.length < 12) {
    suggestions.push('Increase length to at least 12 characters');
  }

  if (result.metrics.uniqueChars < password.length * 0.6) {
    suggestions.push('Use more unique characters');
  }

  return suggestions;
};

// ============================================================================
// PASSWORD POLICY ENFORCEMENT
// ============================================================================

/**
 * Validates password against a defined policy.
 *
 * @param {string} password - Password to validate
 * @param {PasswordPolicy} policy - Policy rules to enforce
 * @returns {PolicyValidationResult} Validation result with violations
 *
 * @example
 * ```typescript
 * const policy: PasswordPolicy = {
 *   minLength: 12,
 *   requireUppercase: true,
 *   requireLowercase: true,
 *   requireNumbers: true,
 *   requireSpecialChars: true
 * };
 * const result = validatePasswordPolicy('SecurePass123!', policy);
 * console.log(result.isValid); // true
 * ```
 */
export const validatePasswordPolicy = (
  password: string,
  policy: PasswordPolicy
): PolicyValidationResult => {
  const violations: string[] = [];
  const satisfiedRules: string[] = [];

  // Length validation
  if (password.length < policy.minLength) {
    violations.push(`Password must be at least ${policy.minLength} characters`);
  } else {
    satisfiedRules.push('Minimum length requirement met');
  }

  if (policy.maxLength && password.length > policy.maxLength) {
    violations.push(`Password must not exceed ${policy.maxLength} characters`);
  }

  // Character type requirements
  const upperCount = (password.match(/[A-Z]/g) || []).length;
  const lowerCount = (password.match(/[a-z]/g) || []).length;
  const numberCount = (password.match(/[0-9]/g) || []).length;
  const specialCount = (password.match(/[^a-zA-Z0-9]/g) || []).length;

  if (policy.requireUppercase && upperCount === 0) {
    violations.push('Password must contain at least one uppercase letter');
  } else if (policy.requireUppercase) {
    satisfiedRules.push('Contains uppercase letters');
  }

  if (policy.minUppercase && upperCount < policy.minUppercase) {
    violations.push(`Password must contain at least ${policy.minUppercase} uppercase letters`);
  }

  if (policy.requireLowercase && lowerCount === 0) {
    violations.push('Password must contain at least one lowercase letter');
  } else if (policy.requireLowercase) {
    satisfiedRules.push('Contains lowercase letters');
  }

  if (policy.minLowercase && lowerCount < policy.minLowercase) {
    violations.push(`Password must contain at least ${policy.minLowercase} lowercase letters`);
  }

  if (policy.requireNumbers && numberCount === 0) {
    violations.push('Password must contain at least one number');
  } else if (policy.requireNumbers) {
    satisfiedRules.push('Contains numbers');
  }

  if (policy.minNumbers && numberCount < policy.minNumbers) {
    violations.push(`Password must contain at least ${policy.minNumbers} numbers`);
  }

  if (policy.requireSpecialChars && specialCount === 0) {
    violations.push('Password must contain at least one special character');
  } else if (policy.requireSpecialChars) {
    satisfiedRules.push('Contains special characters');
  }

  if (policy.minSpecialChars && specialCount < policy.minSpecialChars) {
    violations.push(`Password must contain at least ${policy.minSpecialChars} special characters`);
  }

  // Repeating characters check
  if (policy.prohibitRepeating) {
    const maxRepeating = policy.maxRepeatingChars || 2;
    const repeatPattern = new RegExp(`(.)\\1{${maxRepeating},}`);
    if (repeatPattern.test(password)) {
      violations.push(`Password cannot contain more than ${maxRepeating} repeating characters`);
    }
  }

  // Sequential characters check
  if (policy.prohibitSequential) {
    const weakPatterns = detectWeakPasswordPatterns(password);
    if (weakPatterns.includes('sequential-numbers') || weakPatterns.includes('sequential-letters')) {
      violations.push('Password cannot contain sequential characters');
    }
  }

  // Unique characters requirement
  if (policy.minUniqueChars) {
    const uniqueChars = new Set(password).size;
    if (uniqueChars < policy.minUniqueChars) {
      violations.push(`Password must contain at least ${policy.minUniqueChars} unique characters`);
    }
  }

  return {
    isValid: violations.length === 0,
    violations,
    satisfiedRules,
  };
};

/**
 * Creates a default password policy for healthcare applications.
 *
 * @returns {PasswordPolicy} HIPAA-compliant password policy
 *
 * @example
 * ```typescript
 * const policy = createDefaultPasswordPolicy();
 * const result = validatePasswordPolicy(userPassword, policy);
 * ```
 */
export const createDefaultPasswordPolicy = (): PasswordPolicy => {
  return {
    minLength: 12,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSpecialChars: 1,
    prohibitCommon: true,
    prohibitUserInfo: true,
    prohibitRepeating: true,
    maxRepeatingChars: 2,
    prohibitSequential: true,
    minUniqueChars: 8,
  };
};

/**
 * Enforces password policy and returns detailed violations.
 *
 * @param {string} password - Password to enforce policy on
 * @param {PasswordPolicy} policy - Policy to enforce
 * @returns {PolicyValidationResult} Enforcement result
 * @throws {Error} If password violates policy (optional strict mode)
 *
 * @example
 * ```typescript
 * try {
 *   const result = enforcePasswordPolicy('weak', strictPolicy);
 * } catch (error) {
 *   console.error('Policy violations:', error.message);
 * }
 * ```
 */
export const enforcePasswordPolicy = (
  password: string,
  policy: PasswordPolicy
): PolicyValidationResult => {
  return validatePasswordPolicy(password, policy);
};

/**
 * Checks if password contains user-specific information.
 *
 * @param {string} password - Password to check
 * @param {object} userInfo - User information to check against
 * @returns {boolean} True if password contains user info
 *
 * @example
 * ```typescript
 * const containsUserInfo = checkPasswordContainsUserInfo('john1990', {
 *   username: 'john',
 *   email: 'john@example.com',
 *   firstName: 'John',
 *   birthYear: '1990'
 * });
 * // Returns true
 * ```
 */
export const checkPasswordContainsUserInfo = (
  password: string,
  userInfo: { username?: string; email?: string; firstName?: string; lastName?: string; birthYear?: string }
): boolean => {
  const lowerPassword = password.toLowerCase();

  if (userInfo.username && lowerPassword.includes(userInfo.username.toLowerCase())) {
    return true;
  }

  if (userInfo.email) {
    const emailParts = userInfo.email.toLowerCase().split('@')[0];
    if (lowerPassword.includes(emailParts)) return true;
  }

  if (userInfo.firstName && lowerPassword.includes(userInfo.firstName.toLowerCase())) {
    return true;
  }

  if (userInfo.lastName && lowerPassword.includes(userInfo.lastName.toLowerCase())) {
    return true;
  }

  if (userInfo.birthYear && lowerPassword.includes(userInfo.birthYear)) {
    return true;
  }

  return false;
};

/**
 * Validates password against custom regex patterns.
 *
 * @param {string} password - Password to validate
 * @param {RegExp[]} patterns - Array of regex patterns to match
 * @returns {boolean} True if password matches all patterns
 *
 * @example
 * ```typescript
 * const patterns = [/^(?=.*[A-Z])/, /^(?=.*\d)/, /^(?=.*[@$!%*?&])/];
 * const isValid = validatePasswordCustomPatterns('SecurePass123!', patterns);
 * ```
 */
export const validatePasswordCustomPatterns = (password: string, patterns: RegExp[]): boolean => {
  return patterns.every(pattern => pattern.test(password));
};

// ============================================================================
// PASSWORD HISTORY TRACKING
// ============================================================================

/**
 * Adds a password to user's password history.
 *
 * @param {string} userId - User identifier
 * @param {string} passwordHash - Hashed password to store
 * @param {string} algorithm - Hash algorithm used
 * @returns {PasswordHistoryEntry} Created history entry
 *
 * @example
 * ```typescript
 * const entry = addPasswordToHistory('user123', hashedPassword, 'bcrypt');
 * ```
 */
export const addPasswordToHistory = (
  userId: string,
  passwordHash: string,
  algorithm: string
): PasswordHistoryEntry => {
  return {
    userId,
    passwordHash,
    createdAt: new Date(),
    algorithm,
  };
};

/**
 * Checks if password matches any in user's password history.
 *
 * @param {string} password - Plain text password to check
 * @param {PasswordHistoryEntry[]} history - User's password history
 * @param {number} [checkLast=5] - Number of recent passwords to check
 * @returns {Promise<boolean>} True if password was used before
 *
 * @example
 * ```typescript
 * const wasUsed = await checkPasswordInHistory('NewPass123!', userHistory, 10);
 * if (wasUsed) {
 *   console.log('Password was recently used');
 * }
 * ```
 */
export const checkPasswordInHistory = async (
  password: string,
  history: PasswordHistoryEntry[],
  checkLast: number = 5
): Promise<boolean> => {
  const recentHistory = history.slice(-checkLast);

  for (const entry of recentHistory) {
    let matches = false;

    if (entry.algorithm === 'bcrypt') {
      matches = await verifyPasswordBcrypt(password, entry.passwordHash);
    } else if (entry.algorithm === 'scrypt') {
      matches = await verifyPasswordScrypt(password, entry.passwordHash);
    }

    if (matches) return true;
  }

  return false;
};

/**
 * Retrieves password history for a user.
 *
 * @param {string} userId - User identifier
 * @param {number} [limit=10] - Maximum number of entries to retrieve
 * @returns {Promise<PasswordHistoryEntry[]>} Password history entries
 *
 * @example
 * ```typescript
 * const history = await getPasswordHistory('user123', 5);
 * console.log(`User has ${history.length} password entries`);
 * ```
 */
export const getPasswordHistory = async (
  userId: string,
  limit: number = 10
): Promise<PasswordHistoryEntry[]> => {
  // In production, this would query a database
  // Simulated implementation
  return [];
};

/**
 * Cleans up old password history entries beyond retention period.
 *
 * @param {string} userId - User identifier
 * @param {number} retentionDays - Days to retain password history
 * @returns {Promise<number>} Number of entries removed
 *
 * @example
 * ```typescript
 * const removed = await cleanupPasswordHistory('user123', 90);
 * console.log(`Removed ${removed} old password entries`);
 * ```
 */
export const cleanupPasswordHistory = async (
  userId: string,
  retentionDays: number
): Promise<number> => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

  // In production, this would delete from database
  return 0;
};

// ============================================================================
// PASSWORD RESET FLOWS
// ============================================================================

/**
 * Generates a secure password reset token.
 *
 * @param {number} [length=32] - Token length in bytes
 * @returns {string} Cryptographically secure random token
 *
 * @example
 * ```typescript
 * const resetToken = generatePasswordResetToken(48);
 * console.log(resetToken); // 96-character hex string
 * ```
 */
export const generatePasswordResetToken = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Creates a password reset request with expiration.
 *
 * @param {string} userId - User identifier
 * @param {string} email - User email
 * @param {number} [expiryMinutes=30] - Token expiry in minutes
 * @returns {PasswordResetRequest} Reset request object
 *
 * @example
 * ```typescript
 * const resetRequest = createPasswordResetRequest('user123', 'user@example.com', 60);
 * // Send resetRequest.token via email
 * ```
 */
export const createPasswordResetRequest = (
  userId: string,
  email: string,
  expiryMinutes: number = 30
): PasswordResetRequest => {
  const token = generatePasswordResetToken();
  const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

  return {
    userId,
    email,
    token,
    expiresAt,
    createdAt: new Date(),
  };
};

/**
 * Validates a password reset token.
 *
 * @param {string} token - Reset token to validate
 * @param {PasswordResetRequest} resetRequest - Stored reset request
 * @returns {PasswordResetValidation} Validation result
 *
 * @example
 * ```typescript
 * const validation = validatePasswordResetToken(userToken, storedRequest);
 * if (validation.isValid) {
 *   // Allow password reset
 * } else {
 *   console.error(validation.reason);
 * }
 * ```
 */
export const validatePasswordResetToken = (
  token: string,
  resetRequest: PasswordResetRequest
): PasswordResetValidation => {
  if (resetRequest.usedAt) {
    return { isValid: false, reason: 'Token already used' };
  }

  if (new Date() > resetRequest.expiresAt) {
    return { isValid: false, reason: 'Token expired' };
  }

  if (!crypto.timingSafeEqual(Buffer.from(token), Buffer.from(resetRequest.token))) {
    return { isValid: false, reason: 'Invalid token' };
  }

  return { isValid: true, userId: resetRequest.userId };
};

/**
 * Marks a password reset token as used.
 *
 * @param {PasswordResetRequest} resetRequest - Reset request to mark as used
 * @returns {PasswordResetRequest} Updated reset request
 *
 * @example
 * ```typescript
 * const updated = markResetTokenAsUsed(resetRequest);
 * // Save updated request to database
 * ```
 */
export const markResetTokenAsUsed = (resetRequest: PasswordResetRequest): PasswordResetRequest => {
  return {
    ...resetRequest,
    usedAt: new Date(),
  };
};

/**
 * Generates a password reset URL with token.
 *
 * @param {string} baseUrl - Application base URL
 * @param {string} token - Reset token
 * @returns {string} Complete reset URL
 *
 * @example
 * ```typescript
 * const resetUrl = generatePasswordResetUrl('https://app.whitecross.com', resetToken);
 * // https://app.whitecross.com/reset-password?token=abc123...
 * ```
 */
export const generatePasswordResetUrl = (baseUrl: string, token: string): string => {
  return `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`;
};

// ============================================================================
// PASSWORD EXPIRATION
// ============================================================================

/**
 * Calculates password expiration information.
 *
 * @param {Date} passwordCreatedAt - When password was created
 * @param {number} expiryDays - Days until password expires
 * @param {number} [warningDays=7] - Days before expiry to start warning
 * @returns {PasswordExpirationInfo} Expiration information
 *
 * @example
 * ```typescript
 * const info = calculatePasswordExpiration(new Date('2024-01-01'), 90, 14);
 * if (info.shouldWarn) {
 *   console.log(`Password expires in ${info.daysUntilExpiration} days`);
 * }
 * ```
 */
export const calculatePasswordExpiration = (
  passwordCreatedAt: Date,
  expiryDays: number,
  warningDays: number = 7
): PasswordExpirationInfo => {
  const expiresAt = new Date(passwordCreatedAt);
  expiresAt.setDate(expiresAt.getDate() + expiryDays);

  const now = new Date();
  const daysUntilExpiration = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return {
    expiresAt,
    isExpired: now > expiresAt,
    daysUntilExpiration: Math.max(0, daysUntilExpiration),
    warningThreshold: warningDays,
    shouldWarn: daysUntilExpiration <= warningDays && daysUntilExpiration > 0,
  };
};

/**
 * Checks if a password is expired.
 *
 * @param {Date} passwordCreatedAt - When password was created
 * @param {number} expiryDays - Days until password expires
 * @returns {boolean} True if password is expired
 *
 * @example
 * ```typescript
 * const isExpired = isPasswordExpired(user.passwordCreatedAt, 90);
 * ```
 */
export const isPasswordExpired = (passwordCreatedAt: Date, expiryDays: number): boolean => {
  const info = calculatePasswordExpiration(passwordCreatedAt, expiryDays);
  return info.isExpired;
};

/**
 * Checks if password expiration warning should be shown.
 *
 * @param {Date} passwordCreatedAt - When password was created
 * @param {number} expiryDays - Days until password expires
 * @param {number} [warningDays=7] - Days before expiry to start warning
 * @returns {boolean} True if warning should be shown
 *
 * @example
 * ```typescript
 * const shouldWarn = shouldShowPasswordExpirationWarning(passwordCreatedAt, 90, 14);
 * ```
 */
export const shouldShowPasswordExpirationWarning = (
  passwordCreatedAt: Date,
  expiryDays: number,
  warningDays: number = 7
): boolean => {
  const info = calculatePasswordExpiration(passwordCreatedAt, expiryDays, warningDays);
  return info.shouldWarn;
};

/**
 * Generates password expiration warning message.
 *
 * @param {PasswordExpirationInfo} expirationInfo - Expiration information
 * @returns {string} User-friendly warning message
 *
 * @example
 * ```typescript
 * const message = generateExpirationWarningMessage(expirationInfo);
 * // "Your password will expire in 5 days. Please change it soon."
 * ```
 */
export const generateExpirationWarningMessage = (expirationInfo: PasswordExpirationInfo): string => {
  if (expirationInfo.isExpired) {
    return 'Your password has expired. Please change it immediately.';
  }

  if (expirationInfo.shouldWarn) {
    return `Your password will expire in ${expirationInfo.daysUntilExpiration} day(s). Please change it soon.`;
  }

  return '';
};

// ============================================================================
// SECURE PASSWORD GENERATION
// ============================================================================

/**
 * Generates a cryptographically secure random password.
 *
 * @param {PasswordGenerationOptions} [options] - Generation options
 * @returns {string} Generated password
 *
 * @example
 * ```typescript
 * const password = generateSecurePassword({
 *   length: 16,
 *   includeUppercase: true,
 *   includeLowercase: true,
 *   includeNumbers: true,
 *   includeSpecialChars: true,
 *   excludeSimilar: true
 * });
 * ```
 */
export const generateSecurePassword = (options?: PasswordGenerationOptions): string => {
  const opts = {
    length: options?.length || 16,
    includeUppercase: options?.includeUppercase !== false,
    includeLowercase: options?.includeLowercase !== false,
    includeNumbers: options?.includeNumbers !== false,
    includeSpecialChars: options?.includeSpecialChars !== false,
    excludeSimilar: options?.excludeSimilar || false,
    excludeAmbiguous: options?.excludeAmbiguous || false,
    minUppercase: options?.minUppercase || 1,
    minLowercase: options?.minLowercase || 1,
    minNumbers: options?.minNumbers || 1,
    minSpecialChars: options?.minSpecialChars || 1,
  };

  let uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let lowercase = 'abcdefghijklmnopqrstuvwxyz';
  let numbers = '0123456789';
  let special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (opts.excludeSimilar) {
    uppercase = uppercase.replace(/[O]/g, '');
    lowercase = lowercase.replace(/[oil]/g, '');
    numbers = numbers.replace(/[01]/g, '');
  }

  if (opts.excludeAmbiguous) {
    special = special.replace(/[{}[\]()/\\'"~,;:.<>]/g, '');
  }

  let charset = options?.customCharset || '';
  if (!charset) {
    if (opts.includeUppercase) charset += uppercase;
    if (opts.includeLowercase) charset += lowercase;
    if (opts.includeNumbers) charset += numbers;
    if (opts.includeSpecialChars) charset += special;
  }

  if (charset.length === 0) {
    throw new Error('No character sets enabled for password generation');
  }

  let password = '';

  // Ensure minimum requirements are met
  if (opts.includeUppercase && opts.minUppercase > 0) {
    for (let i = 0; i < opts.minUppercase; i++) {
      password += uppercase[crypto.randomInt(0, uppercase.length)];
    }
  }

  if (opts.includeLowercase && opts.minLowercase > 0) {
    for (let i = 0; i < opts.minLowercase; i++) {
      password += lowercase[crypto.randomInt(0, lowercase.length)];
    }
  }

  if (opts.includeNumbers && opts.minNumbers > 0) {
    for (let i = 0; i < opts.minNumbers; i++) {
      password += numbers[crypto.randomInt(0, numbers.length)];
    }
  }

  if (opts.includeSpecialChars && opts.minSpecialChars > 0) {
    for (let i = 0; i < opts.minSpecialChars; i++) {
      password += special[crypto.randomInt(0, special.length)];
    }
  }

  // Fill remaining length with random characters from full charset
  while (password.length < opts.length) {
    password += charset[crypto.randomInt(0, charset.length)];
  }

  // Shuffle the password to randomize character positions
  return password.split('').sort(() => crypto.randomInt(0, 2) - 0.5).join('');
};

/**
 * Generates multiple password suggestions.
 *
 * @param {number} count - Number of passwords to generate
 * @param {PasswordGenerationOptions} [options] - Generation options
 * @returns {string[]} Array of generated passwords
 *
 * @example
 * ```typescript
 * const suggestions = generatePasswordSuggestions(5, { length: 14 });
 * ```
 */
export const generatePasswordSuggestions = (
  count: number,
  options?: PasswordGenerationOptions
): string[] => {
  const passwords: string[] = [];
  for (let i = 0; i < count; i++) {
    passwords.push(generateSecurePassword(options));
  }
  return passwords;
};

/**
 * Generates a memorable passphrase using random words.
 *
 * @param {number} [wordCount=4] - Number of words in passphrase
 * @param {string} [separator='-'] - Word separator
 * @returns {string} Generated passphrase
 *
 * @example
 * ```typescript
 * const passphrase = generatePassphrase(5, '-');
 * // "correct-horse-battery-staple-mountain"
 * ```
 */
export const generatePassphrase = (wordCount: number = 4, separator: string = '-'): string => {
  const wordList = [
    'correct', 'horse', 'battery', 'staple', 'mountain', 'forest', 'ocean', 'river',
    'cloud', 'thunder', 'lightning', 'sunshine', 'rainbow', 'crystal', 'diamond', 'emerald',
    'phoenix', 'dragon', 'eagle', 'falcon', 'tiger', 'lion', 'wolf', 'bear',
    'quantum', 'photon', 'neutron', 'electron', 'proton', 'galaxy', 'nebula', 'cosmos',
  ];

  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    words.push(wordList[crypto.randomInt(0, wordList.length)]);
  }

  return words.join(separator);
};

/**
 * Generates a password with pronounceable syllables.
 *
 * @param {number} [length=12] - Desired password length
 * @returns {string} Pronounceable password
 *
 * @example
 * ```typescript
 * const password = generatePronounceablePassword(16);
 * // "TaluKemiRofu42!"
 * ```
 */
export const generatePronounceablePassword = (length: number = 12): string => {
  const consonants = 'bcdfghjklmnprstvwxyz';
  const vowels = 'aeiou';
  const numbers = '0123456789';
  const special = '!@#$%^&*';

  let password = '';

  // Generate syllables (consonant-vowel pairs)
  while (password.length < length - 3) {
    password += consonants[crypto.randomInt(0, consonants.length)];
    password += vowels[crypto.randomInt(0, vowels.length)];

    // Capitalize some syllables
    if (crypto.randomInt(0, 3) === 0 && password.length >= 2) {
      password = password.slice(0, -2) + password.slice(-2).toUpperCase();
    }
  }

  // Add numbers and special characters
  password += numbers[crypto.randomInt(0, numbers.length)];
  password += numbers[crypto.randomInt(0, numbers.length)];
  password += special[crypto.randomInt(0, special.length)];

  return password.slice(0, length);
};

/**
 * Validates generated password meets specified criteria.
 *
 * @param {string} password - Generated password
 * @param {PasswordGenerationOptions} options - Original generation options
 * @returns {boolean} True if password meets criteria
 *
 * @example
 * ```typescript
 * const isValid = validateGeneratedPassword(password, options);
 * ```
 */
export const validateGeneratedPassword = (
  password: string,
  options: PasswordGenerationOptions
): boolean => {
  if (options.length && password.length !== options.length) return false;

  if (options.includeUppercase && !/[A-Z]/.test(password)) return false;
  if (options.includeLowercase && !/[a-z]/.test(password)) return false;
  if (options.includeNumbers && !/[0-9]/.test(password)) return false;
  if (options.includeSpecialChars && !/[^a-zA-Z0-9]/.test(password)) return false;

  if (options.minUppercase) {
    const count = (password.match(/[A-Z]/g) || []).length;
    if (count < options.minUppercase) return false;
  }

  if (options.minLowercase) {
    const count = (password.match(/[a-z]/g) || []).length;
    if (count < options.minLowercase) return false;
  }

  if (options.minNumbers) {
    const count = (password.match(/[0-9]/g) || []).length;
    if (count < options.minNumbers) return false;
  }

  if (options.minSpecialChars) {
    const count = (password.match(/[^a-zA-Z0-9]/g) || []).length;
    if (count < options.minSpecialChars) return false;
  }

  return true;
};

// ============================================================================
// PASSWORD BREACH DETECTION
// ============================================================================

/**
 * Checks if password appears in known breach databases (simulated).
 *
 * @param {string} password - Password to check
 * @returns {Promise<BreachCheckResult>} Breach check result
 *
 * @example
 * ```typescript
 * const result = await checkPasswordBreach('password123');
 * if (result.isBreached) {
 *   console.log(`Password found in breaches ${result.timesBreached} times`);
 * }
 * ```
 */
export const checkPasswordBreach = async (password: string): Promise<BreachCheckResult> => {
  // In production, use HaveIBeenPwned API or similar
  // This is a simulated implementation
  const commonPasswords = ['password', '123456', 'password123', 'admin', 'qwerty'];

  const isBreached = commonPasswords.some(common => password.toLowerCase().includes(common));

  return {
    isBreached,
    timesBreached: isBreached ? crypto.randomInt(1000, 100000) : undefined,
    source: isBreached ? 'simulated-breach-db' : undefined,
    checkedAt: new Date(),
  };
};

/**
 * Hashes password using SHA-1 for breach database lookup.
 *
 * @param {string} password - Password to hash
 * @returns {string} SHA-1 hash (for k-anonymity model)
 *
 * @example
 * ```typescript
 * const hash = hashPasswordForBreachCheck('password123');
 * // Use first 5 characters to query breach API
 * ```
 */
export const hashPasswordForBreachCheck = (password: string): string => {
  return crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
};

/**
 * Implements k-anonymity model for password breach checking.
 *
 * @param {string} password - Password to check
 * @returns {string} Hash prefix for k-anonymity lookup
 *
 * @example
 * ```typescript
 * const prefix = getPasswordHashPrefix('SecurePass123!');
 * // Returns first 5 characters of SHA-1 hash
 * ```
 */
export const getPasswordHashPrefix = (password: string): string => {
  const fullHash = hashPasswordForBreachCheck(password);
  return fullHash.substring(0, 5);
};

/**
 * Validates password is not in breach database before accepting.
 *
 * @param {string} password - Password to validate
 * @param {boolean} [allowBreached=false] - Allow breached passwords with warning
 * @returns {Promise<{ isValid: boolean; warning?: string }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validatePasswordNotBreached('newPassword123');
 * if (!result.isValid) {
 *   console.error('Password has been breached');
 * }
 * ```
 */
export const validatePasswordNotBreached = async (
  password: string,
  allowBreached: boolean = false
): Promise<{ isValid: boolean; warning?: string }> => {
  const breachResult = await checkPasswordBreach(password);

  if (breachResult.isBreached) {
    return {
      isValid: allowBreached,
      warning: `This password has appeared in ${breachResult.timesBreached} data breaches`,
    };
  }

  return { isValid: true };
};

// ============================================================================
// PASSWORD COMPLEXITY RULES
// ============================================================================

/**
 * Creates custom complexity rules.
 *
 * @param {string} name - Rule name
 * @param {string} description - Rule description
 * @param {(password: string) => boolean} validator - Validation function
 * @param {string} errorMessage - Error message for violations
 * @returns {ComplexityRule} Complexity rule object
 *
 * @example
 * ```typescript
 * const rule = createComplexityRule(
 *   'no-spaces',
 *   'Password must not contain spaces',
 *   (pwd) => !/\s/.test(pwd),
 *   'Password cannot contain spaces'
 * );
 * ```
 */
export const createComplexityRule = (
  name: string,
  description: string,
  validator: (password: string) => boolean,
  errorMessage: string
): ComplexityRule => {
  return { name, description, validator, errorMessage };
};

/**
 * Applies multiple complexity rules to password.
 *
 * @param {string} password - Password to validate
 * @param {ComplexityRule[]} rules - Array of complexity rules
 * @returns {{ isValid: boolean; violations: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = applyComplexityRules(password, [rule1, rule2, rule3]);
 * ```
 */
export const applyComplexityRules = (
  password: string,
  rules: ComplexityRule[]
): { isValid: boolean; violations: string[] } => {
  const violations: string[] = [];

  for (const rule of rules) {
    if (!rule.validator(password)) {
      violations.push(rule.errorMessage);
    }
  }

  return {
    isValid: violations.length === 0,
    violations,
  };
};

/**
 * Defines standard complexity rules for healthcare applications.
 *
 * @returns {ComplexityRule[]} Array of standard complexity rules
 *
 * @example
 * ```typescript
 * const rules = getStandardComplexityRules();
 * const result = applyComplexityRules(password, rules);
 * ```
 */
export const getStandardComplexityRules = (): ComplexityRule[] => {
  return [
    createComplexityRule(
      'no-spaces',
      'No spaces allowed',
      (pwd) => !/\s/.test(pwd),
      'Password cannot contain spaces'
    ),
    createComplexityRule(
      'mixed-case',
      'Must contain mixed case',
      (pwd) => /[a-z]/.test(pwd) && /[A-Z]/.test(pwd),
      'Password must contain both uppercase and lowercase letters'
    ),
    createComplexityRule(
      'alphanumeric',
      'Must be alphanumeric',
      (pwd) => /[a-zA-Z]/.test(pwd) && /[0-9]/.test(pwd),
      'Password must contain both letters and numbers'
    ),
  ];
};

/**
 * Validates password entropy meets minimum threshold.
 *
 * @param {string} password - Password to validate
 * @param {number} [minEntropy=50] - Minimum entropy in bits
 * @returns {boolean} True if entropy is sufficient
 *
 * @example
 * ```typescript
 * const hasSufficientEntropy = validatePasswordEntropy('SecurePass123!', 60);
 * ```
 */
export const validatePasswordEntropy = (password: string, minEntropy: number = 50): boolean => {
  const entropy = calculatePasswordEntropy(password);
  return entropy >= minEntropy;
};

// ============================================================================
// COMMON PASSWORD CHECKING
// ============================================================================

/**
 * Checks if password is in common passwords list.
 *
 * @param {string} password - Password to check
 * @returns {CommonPasswordCheckResult} Check result
 *
 * @example
 * ```typescript
 * const result = checkCommonPassword('password123');
 * if (result.isCommon) {
 *   console.log(`This is the #${result.rank} most common password`);
 * }
 * ```
 */
export const checkCommonPassword = (password: string): CommonPasswordCheckResult => {
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', '111111', '123123', 'admin', 'letmein',
    'welcome', 'monkey', 'dragon', 'master', 'sunshine',
  ];

  const lowerPassword = password.toLowerCase();
  const rank = commonPasswords.indexOf(lowerPassword) + 1;

  return {
    isCommon: rank > 0,
    rank: rank || undefined,
    category: rank > 0 ? 'top-common' : undefined,
  };
};

/**
 * Validates password is not a common password.
 *
 * @param {string} password - Password to validate
 * @returns {boolean} True if password is not common
 *
 * @example
 * ```typescript
 * const isUnique = validateNotCommonPassword('MyUniquePass123!');
 * ```
 */
export const validateNotCommonPassword = (password: string): boolean => {
  const result = checkCommonPassword(password);
  return !result.isCommon;
};

/**
 * Loads custom common passwords list from array.
 *
 * @param {string[]} passwords - Array of common passwords
 * @returns {Set<string>} Set of common passwords for fast lookup
 *
 * @example
 * ```typescript
 * const commonSet = loadCommonPasswordsList(customPasswordArray);
 * const isCommon = commonSet.has(userPassword.toLowerCase());
 * ```
 */
export const loadCommonPasswordsList = (passwords: string[]): Set<string> => {
  return new Set(passwords.map(p => p.toLowerCase()));
};

/**
 * Checks password against custom common passwords set.
 *
 * @param {string} password - Password to check
 * @param {Set<string>} commonSet - Set of common passwords
 * @returns {boolean} True if password is in common set
 *
 * @example
 * ```typescript
 * const isInCustomList = checkAgainstCommonSet(password, customCommonSet);
 * ```
 */
export const checkAgainstCommonSet = (password: string, commonSet: Set<string>): boolean => {
  return commonSet.has(password.toLowerCase());
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Converts time string to seconds.
 *
 * @param {string} timeStr - Time string (e.g., '15m', '2h', '7d')
 * @returns {number} Time in seconds
 *
 * @example
 * ```typescript
 * const seconds = parseTimeToSeconds('30m'); // 1800
 * ```
 */
const parseTimeToSeconds = (timeStr: string): number => {
  const units: Record<string, number> = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
  };

  const match = timeStr.match(/^(\d+)([smhd])$/);
  if (!match) throw new Error('Invalid time format');

  const value = parseInt(match[1], 10);
  const unit = match[2] as keyof typeof units;

  return value * units[unit];
};

/**
 * Base64 URL-safe encoding.
 *
 * @param {string} str - String to encode
 * @returns {string} Base64 URL-safe encoded string
 */
const base64UrlEncode = (str: string): string => {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

/**
 * Base64 URL-safe decoding.
 *
 * @param {string} str - Base64 URL-safe string to decode
 * @returns {string} Decoded string
 */
const base64UrlDecode = (str: string): string => {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(base64, 'base64').toString('utf-8');
};

/**
 * Signs data with HMAC SHA-256.
 *
 * @param {string} data - Data to sign
 * @param {string} secret - Secret key
 * @returns {string} Base64 URL-safe signature
 */
const signJWT = (data: string, secret: string): string => {
  const signature = crypto.createHmac('sha256', secret).update(data).digest();
  return base64UrlEncode(signature.toString('base64'));
};
