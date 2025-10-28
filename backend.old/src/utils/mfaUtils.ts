/**
 * @fileoverview Multi-Factor Authentication (MFA) Utilities
 * @module utils/mfaUtils
 * @description Provides TOTP-based MFA (Time-based One-Time Password) utilities
 * for implementing two-factor authentication. Compatible with Google Authenticator,
 * Authy, and other TOTP apps.
 *
 * SECURITY: Implements MFA for enhanced account security
 * SECURITY: TOTP-based authentication
 * HIPAA: Recommended for privileged user accounts
 *
 * @security Multi-factor authentication
 * @security TOTP implementation
 */

import { randomBytes, createHmac } from 'crypto';
import { ValidationError } from '../errors/ServiceError';

/**
 * MFA configuration
 */
const MFA_CONFIG = {
  // TOTP configuration
  ALGORITHM: 'sha1',
  DIGITS: 6,
  PERIOD: 30, // seconds
  WINDOW: 1, // Allow 1 step before/after for clock skew

  // Backup codes
  BACKUP_CODE_COUNT: 10,
  BACKUP_CODE_LENGTH: 8,

  // Secret generation
  SECRET_LENGTH: 32, // bytes
  SECRET_ENCODING: 'base32' as const
};

/**
 * MFA secret information
 */
export interface MFASecret {
  secret: string;
  qrCodeUrl: string;
  manualEntryKey: string;
}

/**
 * Generate a cryptographically secure MFA secret
 *
 * @returns MFA secret in base32 encoding
 *
 * @example
 * const secret = generateMFASecret();
 * // Returns: "JBSWY3DPEHPK3PXP"
 */
export function generateMFASecret(): string {
  const buffer = randomBytes(MFA_CONFIG.SECRET_LENGTH);
  return base32Encode(buffer);
}

/**
 * Generate TOTP secret with QR code data
 *
 * @param userEmail - User's email address
 * @param issuer - Application name (e.g., "White Cross Healthcare")
 * @returns MFA secret object with QR code URL
 *
 * @example
 * const mfa = generateTOTPSecret('user@example.com', 'White Cross');
 */
export function generateTOTPSecret(
  userEmail: string,
  issuer: string = 'White Cross Healthcare'
): MFASecret {
  const secret = generateMFASecret();

  // Generate otpauth URL for QR code
  const otpauthUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(userEmail)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=${MFA_CONFIG.ALGORITHM.toUpperCase()}&digits=${MFA_CONFIG.DIGITS}&period=${MFA_CONFIG.PERIOD}`;

  return {
    secret,
    qrCodeUrl: otpauthUrl,
    manualEntryKey: formatSecretForDisplay(secret)
  };
}

/**
 * Verify TOTP token
 *
 * @param token - 6-digit TOTP token from user
 * @param secret - User's MFA secret
 * @returns True if token is valid
 *
 * @example
 * const isValid = verifyTOTPToken('123456', userSecret);
 */
export function verifyTOTPToken(token: string, secret: string): boolean {
  if (!token || !secret) {
    return false;
  }

  // Validate token format
  if (!/^\d{6}$/.test(token)) {
    return false;
  }

  const currentTime = Math.floor(Date.now() / 1000);

  // Check current time window and adjacent windows for clock skew
  for (let i = -MFA_CONFIG.WINDOW; i <= MFA_CONFIG.WINDOW; i++) {
    const timeStep = Math.floor(currentTime / MFA_CONFIG.PERIOD) + i;
    const expectedToken = generateTOTPToken(secret, timeStep);

    if (token === expectedToken) {
      return true;
    }
  }

  return false;
}

/**
 * Generate TOTP token for a given time step
 *
 * @param secret - MFA secret
 * @param timeStep - Time step (default: current time)
 * @returns 6-digit TOTP token
 * @private
 */
function generateTOTPToken(secret: string, timeStep?: number): string {
  const step = timeStep !== undefined
    ? timeStep
    : Math.floor(Date.now() / 1000 / MFA_CONFIG.PERIOD);

  // Convert time step to 8-byte buffer
  const timeBuffer = Buffer.alloc(8);
  timeBuffer.writeBigInt64BE(BigInt(step));

  // Decode base32 secret
  const keyBuffer = base32Decode(secret);

  // Generate HMAC
  const hmac = createHmac(MFA_CONFIG.ALGORITHM, keyBuffer);
  hmac.update(timeBuffer);
  const hmacResult = hmac.digest();

  // Dynamic truncation (RFC 4226)
  const offset = hmacResult[hmacResult.length - 1] & 0x0f;
  const binary =
    ((hmacResult[offset] & 0x7f) << 24) |
    ((hmacResult[offset + 1] & 0xff) << 16) |
    ((hmacResult[offset + 2] & 0xff) << 8) |
    (hmacResult[offset + 3] & 0xff);

  // Generate 6-digit token
  const token = binary % Math.pow(10, MFA_CONFIG.DIGITS);
  return token.toString().padStart(MFA_CONFIG.DIGITS, '0');
}

/**
 * Generate backup codes for MFA
 *
 * @param count - Number of backup codes to generate
 * @returns Array of backup codes
 *
 * @example
 * const backupCodes = generateBackupCodes(10);
 * // Returns: ['A1B2C3D4', 'E5F6G7H8', ...]
 */
export function generateBackupCodes(
  count: number = MFA_CONFIG.BACKUP_CODE_COUNT
): string[] {
  const codes: string[] = [];

  for (let i = 0; i < count; i++) {
    const code = generateBackupCode();
    codes.push(code);
  }

  return codes;
}

/**
 * Generate a single backup code
 *
 * @returns Backup code string
 * @private
 */
function generateBackupCode(): string {
  const buffer = randomBytes(Math.ceil(MFA_CONFIG.BACKUP_CODE_LENGTH / 2));
  return buffer.toString('hex').toUpperCase().slice(0, MFA_CONFIG.BACKUP_CODE_LENGTH);
}

/**
 * Verify backup code
 *
 * @param code - Backup code from user
 * @param backupCodes - Array of user's backup codes
 * @param usedCodes - Array of already used backup codes
 * @returns True if code is valid and not used
 *
 * @example
 * const isValid = verifyBackupCode('A1B2C3D4', userBackupCodes, usedCodes);
 */
export function verifyBackupCode(
  code: string,
  backupCodes: string[],
  usedCodes: string[] = []
): boolean {
  if (!code || !backupCodes || backupCodes.length === 0) {
    return false;
  }

  const normalizedCode = code.toUpperCase().replace(/[^A-Z0-9]/g, '');

  // Check if code is in backup codes list
  const isValid = backupCodes.includes(normalizedCode);

  // Check if code has already been used
  const isUsed = usedCodes.includes(normalizedCode);

  return isValid && !isUsed;
}

/**
 * Format secret for manual entry display
 * Adds spaces every 4 characters for readability
 *
 * @param secret - MFA secret
 * @returns Formatted secret
 *
 * @example
 * const formatted = formatSecretForDisplay('JBSWY3DPEHPK3PXP');
 * // Returns: "JBSW Y3DP EHPK 3PXP"
 */
export function formatSecretForDisplay(secret: string): string {
  return secret.match(/.{1,4}/g)?.join(' ') || secret;
}

/**
 * Base32 encoding (RFC 4648)
 *
 * @param buffer - Buffer to encode
 * @returns Base32 encoded string
 * @private
 */
function base32Encode(buffer: Buffer): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = 0;
  let value = 0;
  let output = '';

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;

    while (bits >= 5) {
      output += alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += alphabet[(value << (5 - bits)) & 31];
  }

  return output;
}

/**
 * Base32 decoding (RFC 4648)
 *
 * @param encoded - Base32 encoded string
 * @returns Decoded buffer
 * @private
 */
function base32Decode(encoded: string): Buffer {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const cleanEncoded = encoded.toUpperCase().replace(/[^A-Z2-7]/g, '');

  let bits = 0;
  let value = 0;
  const output: number[] = [];

  for (let i = 0; i < cleanEncoded.length; i++) {
    const index = alphabet.indexOf(cleanEncoded[i]);
    if (index === -1) {
      continue;
    }

    value = (value << 5) | index;
    bits += 5;

    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(output);
}

/**
 * Validate MFA setup completeness
 *
 * @param mfaEnabled - Whether MFA is enabled
 * @param mfaSecret - User's MFA secret
 * @param backupCodes - User's backup codes
 * @returns Validation result
 *
 * @throws {ValidationError} If MFA setup is incomplete
 *
 * @example
 * validateMFASetup(true, userSecret, userBackupCodes);
 */
export function validateMFASetup(
  mfaEnabled: boolean,
  mfaSecret: string | null,
  backupCodes: string[] | null
): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (mfaEnabled) {
    if (!mfaSecret) {
      errors.push('MFA secret is required when MFA is enabled');
    }

    if (!backupCodes || backupCodes.length === 0) {
      errors.push('Backup codes are required when MFA is enabled');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Check if user should be required to use MFA based on role
 *
 * @param userRole - User's role
 * @returns True if MFA should be required
 *
 * @example
 * const shouldRequire = shouldRequireMFA('ADMIN'); // true
 * const shouldRequire = shouldRequireMFA('PARENT'); // false
 */
export function shouldRequireMFA(userRole: string): boolean {
  const MFA_REQUIRED_ROLES = ['ADMIN', 'DOCTOR'];
  return MFA_REQUIRED_ROLES.includes(userRole.toUpperCase());
}

/**
 * Generate QR code data URL for MFA setup
 * Note: This generates the otpauth URL. Frontend should use a QR code library
 * to convert this to an actual QR code image.
 *
 * @param otpauthUrl - otpauth:// URL from generateTOTPSecret
 * @returns QR code data ready for rendering
 *
 * @example
 * const qrData = prepareQRCodeData(mfaSecret.qrCodeUrl);
 */
export function prepareQRCodeData(otpauthUrl: string): {
  url: string;
  format: string;
} {
  return {
    url: otpauthUrl,
    format: 'otpauth'
  };
}

/**
 * Calculate remaining time in current TOTP window
 *
 * @returns Seconds remaining in current time window
 *
 * @example
 * const remaining = getRemainingTOTPTime(); // 18 (seconds until next code)
 */
export function getRemainingTOTPTime(): number {
  const currentTime = Math.floor(Date.now() / 1000);
  const timeInPeriod = currentTime % MFA_CONFIG.PERIOD;
  return MFA_CONFIG.PERIOD - timeInPeriod;
}

/**
 * Export MFA utilities and configuration
 */
export default {
  generateMFASecret,
  generateTOTPSecret,
  verifyTOTPToken,
  generateBackupCodes,
  verifyBackupCode,
  formatSecretForDisplay,
  validateMFASetup,
  shouldRequireMFA,
  prepareQRCodeData,
  getRemainingTOTPTime,
  MFA_CONFIG
};
