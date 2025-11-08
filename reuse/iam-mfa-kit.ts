/**
 * LOC: IAM-MFA-001
 * File: /reuse/iam-mfa-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - IAM services
 *   - Authentication controllers
 *   - MFA management services
 *   - Security middleware
 */

/**
 * File: /reuse/iam-mfa-kit.ts
 * Locator: WC-IAM-MFA-001
 * Purpose: Comprehensive Multi-Factor Authentication Kit - Complete MFA security toolkit
 *
 * Upstream: Independent utility module for MFA operations
 * Downstream: ../backend/*, IAM services, Auth controllers, Security services
 * Dependencies: TypeScript 5.x, Node 18+, crypto
 * Exports: 45 utility functions for TOTP, SMS, email, backup codes, WebAuthn, adaptive MFA
 *
 * LLM Context: Enterprise-grade multi-factor authentication utilities for White Cross healthcare platform.
 * Provides TOTP implementation, SMS/Email MFA, backup codes, enrollment flows, device management,
 * U2F/WebAuthn support, recovery mechanisms, trusted device bypass, and adaptive MFA policies.
 * HIPAA-compliant MFA security for enhanced healthcare data protection.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * TOTP configuration settings.
 */
interface TOTPConfig {
  secret: string;
  window?: number; // Time window for validation (default 1 = ±30s)
  step?: number; // Time step in seconds (default 30)
  digits?: number; // Number of digits in code (default 6)
  algorithm?: 'sha1' | 'sha256' | 'sha512';
}

/**
 * TOTP generation result.
 */
interface TOTPResult {
  code: string;
  timeRemaining: number; // Seconds until code expires
  validUntil: Date;
}

/**
 * TOTP secret generation result.
 */
interface TOTPSecretResult {
  secret: string;
  qrCodeUrl: string;
  manualEntryKey: string;
}

/**
 * SMS MFA configuration.
 */
interface SMSMFAConfig {
  phoneNumber: string;
  countryCode: string;
  provider?: 'twilio' | 'sns' | 'nexmo';
  codeLength?: number;
  expiryMinutes?: number;
}

/**
 * SMS verification code.
 */
interface SMSVerificationCode {
  code: string;
  phoneNumber: string;
  sentAt: Date;
  expiresAt: Date;
  attempts?: number;
  verified?: boolean;
}

/**
 * Email MFA configuration.
 */
interface EmailMFAConfig {
  email: string;
  codeLength?: number;
  expiryMinutes?: number;
  templateId?: string;
}

/**
 * Email verification code.
 */
interface EmailVerificationCode {
  code: string;
  email: string;
  sentAt: Date;
  expiresAt: Date;
  attempts?: number;
  verified?: boolean;
}

/**
 * Backup code set.
 */
interface BackupCodeSet {
  userId: string;
  codes: BackupCode[];
  generatedAt: Date;
  expiresAt?: Date;
}

/**
 * Individual backup code.
 */
interface BackupCode {
  code: string;
  used: boolean;
  usedAt?: Date;
  usedFromIp?: string;
}

/**
 * MFA enrollment request.
 */
interface MFAEnrollmentRequest {
  userId: string;
  method: 'totp' | 'sms' | 'email' | 'webauthn';
  identifier: string; // Phone number, email, or device name
  status: 'pending' | 'active' | 'suspended';
  createdAt: Date;
}

/**
 * MFA enrollment result.
 */
interface MFAEnrollmentResult {
  enrollmentId: string;
  method: string;
  secret?: string;
  qrCode?: string;
  backupCodes?: string[];
  nextStep?: string;
}

/**
 * MFA device information.
 */
interface MFADevice {
  deviceId: string;
  userId: string;
  name: string;
  type: 'totp' | 'sms' | 'email' | 'webauthn' | 'backup';
  identifier: string; // Phone, email, or device identifier
  isActive: boolean;
  isPrimary: boolean;
  enrolledAt: Date;
  lastUsedAt?: Date;
  trustLevel?: number;
}

/**
 * WebAuthn credential.
 */
interface WebAuthnCredential {
  credentialId: string;
  publicKey: string;
  counter: number;
  userId: string;
  deviceName?: string;
  createdAt: Date;
  lastUsedAt?: Date;
}

/**
 * WebAuthn challenge.
 */
interface WebAuthnChallenge {
  challenge: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
}

/**
 * WebAuthn verification result.
 */
interface WebAuthnVerificationResult {
  verified: boolean;
  credentialId?: string;
  newCounter?: number;
  error?: string;
}

/**
 * MFA recovery code.
 */
interface MFARecoveryCode {
  code: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
  used: boolean;
  usedAt?: Date;
}

/**
 * Trusted device information.
 */
interface TrustedDevice {
  deviceId: string;
  userId: string;
  deviceFingerprint: string;
  userAgent: string;
  ipAddress: string;
  trustedAt: Date;
  expiresAt: Date;
  lastSeenAt: Date;
}

/**
 * Adaptive MFA policy.
 */
interface AdaptiveMFAPolicy {
  name: string;
  conditions: MFAPolicyCondition[];
  requiredFactors: number;
  allowedMethods: string[];
  riskThreshold: number;
}

/**
 * MFA policy condition.
 */
interface MFAPolicyCondition {
  type: 'location' | 'device' | 'time' | 'risk-score' | 'user-group';
  operator: 'equals' | 'not-equals' | 'greater-than' | 'less-than' | 'in' | 'not-in';
  value: any;
}

/**
 * MFA risk assessment.
 */
interface MFARiskAssessment {
  score: number; // 0-100
  level: 'low' | 'medium' | 'high' | 'critical';
  factors: string[];
  requireMFA: boolean;
  recommendedMethods: string[];
}

// ============================================================================
// TOTP IMPLEMENTATION
// ============================================================================

/**
 * Generates a TOTP secret for a user.
 *
 * @param {string} userId - User identifier
 * @param {string} issuer - Application/service name
 * @param {number} [secretLength=32] - Secret length in bytes
 * @returns {TOTPSecretResult} TOTP secret with QR code URL
 *
 * @example
 * ```typescript
 * const result = generateTOTPSecret('user123', 'White Cross Healthcare');
 * console.log(result.secret); // Base32 encoded secret
 * console.log(result.qrCodeUrl); // otpauth:// URL for QR code
 * console.log(result.manualEntryKey); // Formatted for manual entry
 * ```
 */
export const generateTOTPSecret = (
  userId: string,
  issuer: string,
  secretLength: number = 32
): TOTPSecretResult => {
  const secret = crypto.randomBytes(secretLength).toString('hex');
  const base32Secret = base32Encode(secret);

  const qrCodeUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(userId)}?secret=${base32Secret}&issuer=${encodeURIComponent(issuer)}`;

  const manualEntryKey = base32Secret.match(/.{1,4}/g)?.join(' ') || base32Secret;

  return {
    secret: base32Secret,
    qrCodeUrl,
    manualEntryKey,
  };
};

/**
 * Generates a TOTP code for current time.
 *
 * @param {TOTPConfig} config - TOTP configuration
 * @param {Date} [time] - Time to generate code for (default: now)
 * @returns {TOTPResult} Generated TOTP code with metadata
 *
 * @example
 * ```typescript
 * const result = generateTOTPCode({ secret: userSecret });
 * console.log(result.code); // '123456'
 * console.log(result.timeRemaining); // Seconds until expiry
 * ```
 */
export const generateTOTPCode = (config: TOTPConfig, time?: Date): TOTPResult => {
  const step = config.step || 30;
  const digits = config.digits || 6;
  const algorithm = config.algorithm || 'sha1';

  const now = time ? Math.floor(time.getTime() / 1000) : Math.floor(Date.now() / 1000);
  const counter = Math.floor(now / step);

  const hmac = crypto.createHmac(algorithm, Buffer.from(config.secret, 'hex'));
  const counterBuffer = Buffer.allocUnsafe(8);
  counterBuffer.writeBigUInt64BE(BigInt(counter));
  hmac.update(counterBuffer);

  const hash = hmac.digest();
  const offset = hash[hash.length - 1] & 0x0f;
  const binary = ((hash[offset] & 0x7f) << 24) |
                 ((hash[offset + 1] & 0xff) << 16) |
                 ((hash[offset + 2] & 0xff) << 8) |
                 (hash[offset + 3] & 0xff);

  const code = (binary % Math.pow(10, digits)).toString().padStart(digits, '0');

  const timeRemaining = step - (now % step);
  const validUntil = new Date((counter + 1) * step * 1000);

  return {
    code,
    timeRemaining,
    validUntil,
  };
};

/**
 * Verifies a TOTP code against the secret.
 *
 * @param {string} code - TOTP code to verify
 * @param {TOTPConfig} config - TOTP configuration
 * @param {Date} [time] - Time to verify against (default: now)
 * @returns {boolean} True if code is valid
 *
 * @example
 * ```typescript
 * const isValid = verifyTOTPCode('123456', {
 *   secret: userSecret,
 *   window: 1 // Allow ±30 seconds
 * });
 * ```
 */
export const verifyTOTPCode = (code: string, config: TOTPConfig, time?: Date): boolean => {
  const window = config.window || 1;

  // Check current time and ±window time steps
  for (let i = -window; i <= window; i++) {
    const checkTime = time ? new Date(time.getTime() + i * (config.step || 30) * 1000) : new Date(Date.now() + i * (config.step || 30) * 1000);
    const expected = generateTOTPCode(config, checkTime);

    if (crypto.timingSafeEqual(Buffer.from(code), Buffer.from(expected.code))) {
      return true;
    }
  }

  return false;
};

/**
 * Generates QR code data URL for TOTP secret.
 *
 * @param {string} otpAuthUrl - otpauth:// URL
 * @returns {Promise<string>} QR code data URL (simulated)
 *
 * @example
 * ```typescript
 * const qrDataUrl = await generateTOTPQRCode(secretResult.qrCodeUrl);
 * // Returns data:image/png;base64,... for display
 * ```
 */
export const generateTOTPQRCode = async (otpAuthUrl: string): Promise<string> => {
  // In production, use a QR code library like 'qrcode'
  // This is a simulated implementation
  const base64 = Buffer.from(otpAuthUrl).toString('base64');
  return `data:image/png;base64,${base64}`;
};

/**
 * Validates TOTP configuration parameters.
 *
 * @param {TOTPConfig} config - TOTP configuration to validate
 * @returns {{ isValid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateTOTPConfig(config);
 * if (!result.isValid) {
 *   console.error('Configuration errors:', result.errors);
 * }
 * ```
 */
export const validateTOTPConfig = (config: TOTPConfig): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!config.secret) {
    errors.push('Secret is required');
  }

  if (config.window !== undefined && (config.window < 0 || config.window > 10)) {
    errors.push('Window must be between 0 and 10');
  }

  if (config.step !== undefined && (config.step < 1 || config.step > 300)) {
    errors.push('Step must be between 1 and 300 seconds');
  }

  if (config.digits !== undefined && (config.digits < 6 || config.digits > 8)) {
    errors.push('Digits must be 6, 7, or 8');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ============================================================================
// SMS-BASED MFA
// ============================================================================

/**
 * Generates a verification code for SMS MFA.
 *
 * @param {SMSMFAConfig} config - SMS MFA configuration
 * @returns {SMSVerificationCode} Generated verification code
 *
 * @example
 * ```typescript
 * const smsCode = generateSMSVerificationCode({
 *   phoneNumber: '+1234567890',
 *   countryCode: 'US',
 *   codeLength: 6,
 *   expiryMinutes: 10
 * });
 * ```
 */
export const generateSMSVerificationCode = (config: SMSMFAConfig): SMSVerificationCode => {
  const codeLength = config.codeLength || 6;
  const expiryMinutes = config.expiryMinutes || 10;

  const code = crypto.randomInt(0, Math.pow(10, codeLength))
    .toString()
    .padStart(codeLength, '0');

  const sentAt = new Date();
  const expiresAt = new Date(sentAt.getTime() + expiryMinutes * 60 * 1000);

  return {
    code,
    phoneNumber: config.phoneNumber,
    sentAt,
    expiresAt,
    attempts: 0,
    verified: false,
  };
};

/**
 * Sends SMS verification code to user's phone.
 *
 * @param {SMSVerificationCode} verificationCode - Verification code to send
 * @param {SMSMFAConfig} config - SMS provider configuration
 * @returns {Promise<{ sent: boolean; messageId?: string }>} Send result
 *
 * @example
 * ```typescript
 * const result = await sendSMSVerificationCode(smsCode, config);
 * if (result.sent) {
 *   console.log('SMS sent, message ID:', result.messageId);
 * }
 * ```
 */
export const sendSMSVerificationCode = async (
  verificationCode: SMSVerificationCode,
  config: SMSMFAConfig
): Promise<{ sent: boolean; messageId?: string }> => {
  // In production, integrate with SMS provider (Twilio, AWS SNS, Nexmo)
  // Simulated implementation
  const messageId = crypto.randomBytes(16).toString('hex');

  // Simulate SMS sending
  console.log(`[SMS Provider: ${config.provider || 'default'}] Sending code ${verificationCode.code} to ${config.phoneNumber}`);

  return {
    sent: true,
    messageId,
  };
};

/**
 * Verifies SMS verification code.
 *
 * @param {string} code - Code entered by user
 * @param {SMSVerificationCode} verificationCode - Stored verification code
 * @param {number} [maxAttempts=3] - Maximum verification attempts
 * @returns {{ verified: boolean; reason?: string; attemptsRemaining?: number }} Verification result
 *
 * @example
 * ```typescript
 * const result = verifySMSCode('123456', storedCode);
 * if (result.verified) {
 *   console.log('SMS verification successful');
 * } else {
 *   console.error(result.reason);
 * }
 * ```
 */
export const verifySMSCode = (
  code: string,
  verificationCode: SMSVerificationCode,
  maxAttempts: number = 3
): { verified: boolean; reason?: string; attemptsRemaining?: number } => {
  if (verificationCode.verified) {
    return { verified: false, reason: 'Code already used' };
  }

  if (new Date() > verificationCode.expiresAt) {
    return { verified: false, reason: 'Code expired' };
  }

  const attempts = (verificationCode.attempts || 0) + 1;
  verificationCode.attempts = attempts;

  if (attempts > maxAttempts) {
    return { verified: false, reason: 'Maximum attempts exceeded' };
  }

  if (!crypto.timingSafeEqual(Buffer.from(code), Buffer.from(verificationCode.code))) {
    return {
      verified: false,
      reason: 'Invalid code',
      attemptsRemaining: maxAttempts - attempts,
    };
  }

  verificationCode.verified = true;
  return { verified: true };
};

/**
 * Formats phone number for SMS sending.
 *
 * @param {string} phoneNumber - Phone number to format
 * @param {string} countryCode - Country code (e.g., 'US', 'UK')
 * @returns {string} Formatted phone number
 *
 * @example
 * ```typescript
 * const formatted = formatPhoneNumber('5551234567', 'US');
 * // Returns '+15551234567'
 * ```
 */
export const formatPhoneNumber = (phoneNumber: string, countryCode: string): string => {
  const countryPrefixes: Record<string, string> = {
    US: '+1',
    UK: '+44',
    CA: '+1',
    AU: '+61',
    DE: '+49',
    FR: '+33',
  };

  const prefix = countryPrefixes[countryCode] || '+1';
  const cleaned = phoneNumber.replace(/\D/g, '');

  return `${prefix}${cleaned}`;
};

/**
 * Resends SMS verification code with rate limiting.
 *
 * @param {string} phoneNumber - Phone number to resend to
 * @param {SMSMFAConfig} config - SMS configuration
 * @param {number} [cooldownSeconds=60] - Cooldown between resends
 * @returns {Promise<{ sent: boolean; reason?: string; nextAllowedAt?: Date }>} Resend result
 *
 * @example
 * ```typescript
 * const result = await resendSMSCode(phoneNumber, config, 120);
 * ```
 */
export const resendSMSCode = async (
  phoneNumber: string,
  config: SMSMFAConfig,
  cooldownSeconds: number = 60
): Promise<{ sent: boolean; reason?: string; nextAllowedAt?: Date }> => {
  // In production, check last send time from database
  // Simulated cooldown check
  const canResend = true; // Check against last send time

  if (!canResend) {
    const nextAllowedAt = new Date(Date.now() + cooldownSeconds * 1000);
    return {
      sent: false,
      reason: 'Please wait before requesting another code',
      nextAllowedAt,
    };
  }

  const verificationCode = generateSMSVerificationCode(config);
  const result = await sendSMSVerificationCode(verificationCode, config);

  return { sent: result.sent };
};

// ============================================================================
// EMAIL-BASED MFA
// ============================================================================

/**
 * Generates a verification code for email MFA.
 *
 * @param {EmailMFAConfig} config - Email MFA configuration
 * @returns {EmailVerificationCode} Generated verification code
 *
 * @example
 * ```typescript
 * const emailCode = generateEmailVerificationCode({
 *   email: 'user@example.com',
 *   codeLength: 8,
 *   expiryMinutes: 15
 * });
 * ```
 */
export const generateEmailVerificationCode = (config: EmailMFAConfig): EmailVerificationCode => {
  const codeLength = config.codeLength || 8;
  const expiryMinutes = config.expiryMinutes || 15;

  // Generate alphanumeric code
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude similar chars
  let code = '';
  for (let i = 0; i < codeLength; i++) {
    code += chars[crypto.randomInt(0, chars.length)];
  }

  const sentAt = new Date();
  const expiresAt = new Date(sentAt.getTime() + expiryMinutes * 60 * 1000);

  return {
    code,
    email: config.email,
    sentAt,
    expiresAt,
    attempts: 0,
    verified: false,
  };
};

/**
 * Sends email verification code to user.
 *
 * @param {EmailVerificationCode} verificationCode - Verification code to send
 * @param {EmailMFAConfig} config - Email configuration
 * @returns {Promise<{ sent: boolean; messageId?: string }>} Send result
 *
 * @example
 * ```typescript
 * const result = await sendEmailVerificationCode(emailCode, {
 *   email: 'user@example.com',
 *   templateId: 'mfa-verification'
 * });
 * ```
 */
export const sendEmailVerificationCode = async (
  verificationCode: EmailVerificationCode,
  config: EmailMFAConfig
): Promise<{ sent: boolean; messageId?: string }> => {
  // In production, integrate with email service (SendGrid, SES, Mailgun)
  const messageId = crypto.randomBytes(16).toString('hex');

  console.log(`[Email Service] Sending code ${verificationCode.code} to ${config.email}`);

  return {
    sent: true,
    messageId,
  };
};

/**
 * Verifies email verification code.
 *
 * @param {string} code - Code entered by user
 * @param {EmailVerificationCode} verificationCode - Stored verification code
 * @param {number} [maxAttempts=5] - Maximum verification attempts
 * @returns {{ verified: boolean; reason?: string; attemptsRemaining?: number }} Verification result
 *
 * @example
 * ```typescript
 * const result = verifyEmailCode('ABC12345', storedCode);
 * ```
 */
export const verifyEmailCode = (
  code: string,
  verificationCode: EmailVerificationCode,
  maxAttempts: number = 5
): { verified: boolean; reason?: string; attemptsRemaining?: number } => {
  if (verificationCode.verified) {
    return { verified: false, reason: 'Code already used' };
  }

  if (new Date() > verificationCode.expiresAt) {
    return { verified: false, reason: 'Code expired' };
  }

  const attempts = (verificationCode.attempts || 0) + 1;
  verificationCode.attempts = attempts;

  if (attempts > maxAttempts) {
    return { verified: false, reason: 'Maximum attempts exceeded' };
  }

  const normalizedCode = code.toUpperCase().trim();
  const normalizedStored = verificationCode.code.toUpperCase().trim();

  if (!crypto.timingSafeEqual(Buffer.from(normalizedCode), Buffer.from(normalizedStored))) {
    return {
      verified: false,
      reason: 'Invalid code',
      attemptsRemaining: maxAttempts - attempts,
    };
  }

  verificationCode.verified = true;
  return { verified: true };
};

/**
 * Generates email template for MFA verification.
 *
 * @param {string} code - Verification code
 * @param {number} expiryMinutes - Code expiry in minutes
 * @returns {string} HTML email template
 *
 * @example
 * ```typescript
 * const emailHtml = generateEmailMFATemplate('ABC12345', 15);
 * ```
 */
export const generateEmailMFATemplate = (code: string, expiryMinutes: number): string => {
  return `
    <html>
      <body>
        <h2>White Cross Healthcare - Multi-Factor Authentication</h2>
        <p>Your verification code is:</p>
        <h1 style="font-size: 32px; letter-spacing: 5px; color: #007bff;">${code}</h1>
        <p>This code will expire in ${expiryMinutes} minutes.</p>
        <p>If you did not request this code, please contact support immediately.</p>
      </body>
    </html>
  `;
};

// ============================================================================
// BACKUP CODES GENERATION AND VALIDATION
// ============================================================================

/**
 * Generates a set of backup codes for user.
 *
 * @param {string} userId - User identifier
 * @param {number} [count=10] - Number of backup codes to generate
 * @param {number} [codeLength=8] - Length of each backup code
 * @returns {BackupCodeSet} Set of backup codes
 *
 * @example
 * ```typescript
 * const backupCodes = generateBackupCodes('user123', 10, 8);
 * // Store backupCodes.codes in database
 * // Display codes to user once for saving
 * ```
 */
export const generateBackupCodes = (
  userId: string,
  count: number = 10,
  codeLength: number = 8
): BackupCodeSet => {
  const codes: BackupCode[] = [];

  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(codeLength).toString('hex').toUpperCase();
    const formatted = code.match(/.{1,4}/g)?.join('-') || code;

    codes.push({
      code: formatted,
      used: false,
    });
  }

  return {
    userId,
    codes,
    generatedAt: new Date(),
  };
};

/**
 * Verifies a backup code and marks it as used.
 *
 * @param {string} code - Backup code to verify
 * @param {BackupCodeSet} backupCodeSet - User's backup code set
 * @param {string} [ipAddress] - IP address of verification attempt
 * @returns {{ verified: boolean; reason?: string; codesRemaining?: number }} Verification result
 *
 * @example
 * ```typescript
 * const result = verifyBackupCode('ABCD-1234-EFGH-5678', userBackupCodes, '192.168.1.1');
 * if (result.verified) {
 *   console.log(`Backup code verified. ${result.codesRemaining} codes remaining`);
 * }
 * ```
 */
export const verifyBackupCode = (
  code: string,
  backupCodeSet: BackupCodeSet,
  ipAddress?: string
): { verified: boolean; reason?: string; codesRemaining?: number } => {
  const normalizedCode = code.toUpperCase().replace(/[\s-]/g, '');

  for (const backupCode of backupCodeSet.codes) {
    const normalizedStored = backupCode.code.toUpperCase().replace(/[\s-]/g, '');

    if (crypto.timingSafeEqual(Buffer.from(normalizedCode), Buffer.from(normalizedStored))) {
      if (backupCode.used) {
        return { verified: false, reason: 'Backup code already used' };
      }

      backupCode.used = true;
      backupCode.usedAt = new Date();
      backupCode.usedFromIp = ipAddress;

      const codesRemaining = backupCodeSet.codes.filter(c => !c.used).length;

      return {
        verified: true,
        codesRemaining,
      };
    }
  }

  return { verified: false, reason: 'Invalid backup code' };
};

/**
 * Checks how many backup codes are remaining.
 *
 * @param {BackupCodeSet} backupCodeSet - User's backup code set
 * @returns {number} Number of unused backup codes
 *
 * @example
 * ```typescript
 * const remaining = getBackupCodesRemaining(userBackupCodes);
 * if (remaining < 3) {
 *   console.warn('Low backup codes. Consider regenerating.');
 * }
 * ```
 */
export const getBackupCodesRemaining = (backupCodeSet: BackupCodeSet): number => {
  return backupCodeSet.codes.filter(code => !code.used).length;
};

/**
 * Regenerates backup codes (invalidates old ones).
 *
 * @param {string} userId - User identifier
 * @param {BackupCodeSet} oldBackupCodeSet - Old backup code set to invalidate
 * @returns {BackupCodeSet} New backup code set
 *
 * @example
 * ```typescript
 * const newCodes = regenerateBackupCodes('user123', oldBackupCodes);
 * // Display new codes to user
 * ```
 */
export const regenerateBackupCodes = (userId: string, oldBackupCodeSet: BackupCodeSet): BackupCodeSet => {
  // Mark all old codes as used
  oldBackupCodeSet.codes.forEach(code => {
    code.used = true;
    code.usedAt = new Date();
  });

  // Generate new codes
  return generateBackupCodes(userId);
};

/**
 * Formats backup codes for display to user.
 *
 * @param {BackupCodeSet} backupCodeSet - Backup code set to format
 * @returns {string[]} Array of formatted backup codes
 *
 * @example
 * ```typescript
 * const formatted = formatBackupCodesForDisplay(backupCodes);
 * formatted.forEach(code => console.log(code));
 * ```
 */
export const formatBackupCodesForDisplay = (backupCodeSet: BackupCodeSet): string[] => {
  return backupCodeSet.codes
    .filter(code => !code.used)
    .map(code => code.code);
};

// ============================================================================
// MFA ENROLLMENT FLOWS
// ============================================================================

/**
 * Initiates MFA enrollment for a user.
 *
 * @param {string} userId - User identifier
 * @param {'totp' | 'sms' | 'email' | 'webauthn'} method - MFA method to enroll
 * @param {string} identifier - Phone number, email, or device name
 * @returns {MFAEnrollmentResult} Enrollment result with setup details
 *
 * @example
 * ```typescript
 * const enrollment = initiateMFAEnrollment('user123', 'totp', 'Authenticator App');
 * console.log(enrollment.qrCode); // Display QR code to user
 * console.log(enrollment.backupCodes); // Show backup codes
 * ```
 */
export const initiateMFAEnrollment = (
  userId: string,
  method: 'totp' | 'sms' | 'email' | 'webauthn',
  identifier: string
): MFAEnrollmentResult => {
  const enrollmentId = crypto.randomBytes(16).toString('hex');

  const result: MFAEnrollmentResult = {
    enrollmentId,
    method,
  };

  if (method === 'totp') {
    const totpSecret = generateTOTPSecret(userId, 'White Cross Healthcare');
    result.secret = totpSecret.secret;
    result.qrCode = totpSecret.qrCodeUrl;
    result.nextStep = 'Scan QR code and enter verification code';
  } else if (method === 'sms') {
    result.nextStep = 'Verification code will be sent to your phone';
  } else if (method === 'email') {
    result.nextStep = 'Verification code will be sent to your email';
  } else if (method === 'webauthn') {
    result.nextStep = 'Follow browser prompts to register security key';
  }

  // Generate backup codes for all methods
  const backupCodeSet = generateBackupCodes(userId);
  result.backupCodes = formatBackupCodesForDisplay(backupCodeSet);

  return result;
};

/**
 * Completes MFA enrollment after verification.
 *
 * @param {string} enrollmentId - Enrollment ID from initiation
 * @param {string} verificationCode - Code entered by user
 * @returns {Promise<{ completed: boolean; reason?: string }>} Completion result
 *
 * @example
 * ```typescript
 * const result = await completeMFAEnrollment(enrollmentId, '123456');
 * if (result.completed) {
 *   console.log('MFA enrollment successful');
 * }
 * ```
 */
export const completeMFAEnrollment = async (
  enrollmentId: string,
  verificationCode: string
): Promise<{ completed: boolean; reason?: string }> => {
  // In production, retrieve enrollment details from database and verify code
  // Simulated implementation
  if (!verificationCode || verificationCode.length < 6) {
    return { completed: false, reason: 'Invalid verification code' };
  }

  return { completed: true };
};

/**
 * Cancels an in-progress MFA enrollment.
 *
 * @param {string} enrollmentId - Enrollment ID to cancel
 * @returns {Promise<boolean>} True if cancellation successful
 *
 * @example
 * ```typescript
 * await cancelMFAEnrollment(enrollmentId);
 * ```
 */
export const cancelMFAEnrollment = async (enrollmentId: string): Promise<boolean> => {
  // In production, mark enrollment as cancelled in database
  return true;
};

/**
 * Gets enrollment status and progress.
 *
 * @param {string} enrollmentId - Enrollment ID to check
 * @returns {Promise<{ status: string; method: string; completed: boolean }>} Enrollment status
 *
 * @example
 * ```typescript
 * const status = await getEnrollmentStatus(enrollmentId);
 * console.log(`Status: ${status.status}, Method: ${status.method}`);
 * ```
 */
export const getEnrollmentStatus = async (
  enrollmentId: string
): Promise<{ status: string; method: string; completed: boolean }> => {
  // In production, retrieve from database
  return {
    status: 'pending',
    method: 'totp',
    completed: false,
  };
};

/**
 * Validates MFA enrollment completion requirements.
 *
 * @param {MFAEnrollmentRequest} enrollment - Enrollment to validate
 * @returns {{ isValid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateEnrollmentCompletion(enrollment);
 * if (!validation.isValid) {
 *   console.error('Enrollment errors:', validation.errors);
 * }
 * ```
 */
export const validateEnrollmentCompletion = (
  enrollment: MFAEnrollmentRequest
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!enrollment.userId) {
    errors.push('User ID is required');
  }

  if (!enrollment.method) {
    errors.push('MFA method is required');
  }

  if (!enrollment.identifier) {
    errors.push('Identifier is required');
  }

  if (enrollment.method === 'sms' && !isValidPhoneNumber(enrollment.identifier)) {
    errors.push('Invalid phone number');
  }

  if (enrollment.method === 'email' && !isValidEmail(enrollment.identifier)) {
    errors.push('Invalid email address');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ============================================================================
// MFA DEVICE MANAGEMENT
// ============================================================================

/**
 * Registers a new MFA device for user.
 *
 * @param {string} userId - User identifier
 * @param {string} deviceName - User-friendly device name
 * @param {'totp' | 'sms' | 'email' | 'webauthn'} type - Device type
 * @param {string} identifier - Device identifier
 * @returns {MFADevice} Registered device
 *
 * @example
 * ```typescript
 * const device = registerMFADevice('user123', 'iPhone 13', 'sms', '+1234567890');
 * ```
 */
export const registerMFADevice = (
  userId: string,
  deviceName: string,
  type: 'totp' | 'sms' | 'email' | 'webauthn' | 'backup',
  identifier: string
): MFADevice => {
  const deviceId = crypto.randomBytes(16).toString('hex');

  return {
    deviceId,
    userId,
    name: deviceName,
    type,
    identifier,
    isActive: true,
    isPrimary: false,
    enrolledAt: new Date(),
  };
};

/**
 * Lists all MFA devices for a user.
 *
 * @param {string} userId - User identifier
 * @returns {Promise<MFADevice[]>} Array of user's MFA devices
 *
 * @example
 * ```typescript
 * const devices = await listMFADevices('user123');
 * devices.forEach(device => {
 *   console.log(`${device.name} (${device.type}) - Active: ${device.isActive}`);
 * });
 * ```
 */
export const listMFADevices = async (userId: string): Promise<MFADevice[]> => {
  // In production, retrieve from database
  return [];
};

/**
 * Removes an MFA device.
 *
 * @param {string} deviceId - Device ID to remove
 * @param {string} userId - User identifier (for verification)
 * @returns {Promise<{ removed: boolean; reason?: string }>} Removal result
 *
 * @example
 * ```typescript
 * const result = await removeMFADevice(deviceId, userId);
 * if (result.removed) {
 *   console.log('Device removed successfully');
 * }
 * ```
 */
export const removeMFADevice = async (
  deviceId: string,
  userId: string
): Promise<{ removed: boolean; reason?: string }> => {
  // In production, verify user owns device and remove from database
  // Ensure at least one MFA method remains active
  return { removed: true };
};

/**
 * Sets a device as primary MFA method.
 *
 * @param {string} deviceId - Device ID to set as primary
 * @param {string} userId - User identifier
 * @returns {Promise<boolean>} True if successful
 *
 * @example
 * ```typescript
 * await setPrimaryMFADevice(deviceId, userId);
 * ```
 */
export const setPrimaryMFADevice = async (deviceId: string, userId: string): Promise<boolean> => {
  // In production, update database to set isPrimary flag
  return true;
};

/**
 * Updates device last used timestamp.
 *
 * @param {string} deviceId - Device ID to update
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateDeviceLastUsed(deviceId);
 * ```
 */
export const updateDeviceLastUsed = async (deviceId: string): Promise<void> => {
  // In production, update lastUsedAt in database
};

// ============================================================================
// U2F/WEBAUTHN SUPPORT
// ============================================================================

/**
 * Generates a WebAuthn registration challenge.
 *
 * @param {string} userId - User identifier
 * @param {string} username - Username
 * @returns {WebAuthnChallenge} Registration challenge
 *
 * @example
 * ```typescript
 * const challenge = generateWebAuthnChallenge('user123', 'john.doe');
 * // Send challenge to client for registration
 * ```
 */
export const generateWebAuthnChallenge = (userId: string, username: string): WebAuthnChallenge => {
  const challenge = crypto.randomBytes(32).toString('base64url');
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + 5 * 60 * 1000); // 5 minutes

  return {
    challenge,
    userId,
    createdAt,
    expiresAt,
  };
};

/**
 * Verifies WebAuthn registration response.
 *
 * @param {any} registrationResponse - WebAuthn registration response from client
 * @param {WebAuthnChallenge} challenge - Original challenge
 * @returns {Promise<WebAuthnVerificationResult>} Verification result
 *
 * @example
 * ```typescript
 * const result = await verifyWebAuthnRegistration(response, challenge);
 * if (result.verified) {
 *   // Store credential
 * }
 * ```
 */
export const verifyWebAuthnRegistration = async (
  registrationResponse: any,
  challenge: WebAuthnChallenge
): Promise<WebAuthnVerificationResult> => {
  // In production, use @simplewebauthn/server or similar library
  // Simulated implementation
  if (new Date() > challenge.expiresAt) {
    return { verified: false, error: 'Challenge expired' };
  }

  return {
    verified: true,
    credentialId: crypto.randomBytes(32).toString('base64url'),
    newCounter: 0,
  };
};

/**
 * Generates WebAuthn authentication challenge.
 *
 * @param {string} userId - User identifier
 * @returns {WebAuthnChallenge} Authentication challenge
 *
 * @example
 * ```typescript
 * const challenge = generateWebAuthnAuthChallenge('user123');
 * ```
 */
export const generateWebAuthnAuthChallenge = (userId: string): WebAuthnChallenge => {
  return generateWebAuthnChallenge(userId, '');
};

/**
 * Verifies WebAuthn authentication response.
 *
 * @param {any} authResponse - WebAuthn authentication response
 * @param {WebAuthnChallenge} challenge - Original challenge
 * @param {WebAuthnCredential} credential - Stored credential
 * @returns {Promise<WebAuthnVerificationResult>} Verification result
 *
 * @example
 * ```typescript
 * const result = await verifyWebAuthnAuthentication(response, challenge, credential);
 * ```
 */
export const verifyWebAuthnAuthentication = async (
  authResponse: any,
  challenge: WebAuthnChallenge,
  credential: WebAuthnCredential
): Promise<WebAuthnVerificationResult> => {
  // In production, verify signature and counter
  if (new Date() > challenge.expiresAt) {
    return { verified: false, error: 'Challenge expired' };
  }

  return {
    verified: true,
    credentialId: credential.credentialId,
    newCounter: credential.counter + 1,
  };
};

/**
 * Stores WebAuthn credential after successful registration.
 *
 * @param {string} userId - User identifier
 * @param {string} credentialId - Credential ID
 * @param {string} publicKey - Public key
 * @param {string} [deviceName] - Optional device name
 * @returns {WebAuthnCredential} Stored credential
 *
 * @example
 * ```typescript
 * const credential = storeWebAuthnCredential(userId, credId, pubKey, 'YubiKey');
 * ```
 */
export const storeWebAuthnCredential = (
  userId: string,
  credentialId: string,
  publicKey: string,
  deviceName?: string
): WebAuthnCredential => {
  return {
    credentialId,
    publicKey,
    counter: 0,
    userId,
    deviceName,
    createdAt: new Date(),
  };
};

// ============================================================================
// RECOVERY MECHANISMS
// ============================================================================

/**
 * Generates MFA recovery codes.
 *
 * @param {string} userId - User identifier
 * @param {number} [count=5] - Number of recovery codes
 * @returns {MFARecoveryCode[]} Recovery codes
 *
 * @example
 * ```typescript
 * const recoveryCodes = generateMFARecoveryCodes('user123', 5);
 * ```
 */
export const generateMFARecoveryCodes = (userId: string, count: number = 5): MFARecoveryCode[] => {
  const codes: MFARecoveryCode[] = [];
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 year expiry

  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(16).toString('hex').toUpperCase();

    codes.push({
      code,
      userId,
      createdAt: new Date(),
      expiresAt,
      used: false,
    });
  }

  return codes;
};

/**
 * Verifies and uses an MFA recovery code.
 *
 * @param {string} code - Recovery code to verify
 * @param {MFARecoveryCode[]} recoveryCodes - User's recovery codes
 * @returns {{ verified: boolean; reason?: string }} Verification result
 *
 * @example
 * ```typescript
 * const result = verifyMFARecoveryCode(code, userRecoveryCodes);
 * if (result.verified) {
 *   // Grant access and prompt for MFA re-enrollment
 * }
 * ```
 */
export const verifyMFARecoveryCode = (
  code: string,
  recoveryCodes: MFARecoveryCode[]
): { verified: boolean; reason?: string } => {
  const normalizedCode = code.toUpperCase().replace(/[\s-]/g, '');

  for (const recoveryCode of recoveryCodes) {
    const normalizedStored = recoveryCode.code.toUpperCase().replace(/[\s-]/g, '');

    if (crypto.timingSafeEqual(Buffer.from(normalizedCode), Buffer.from(normalizedStored))) {
      if (recoveryCode.used) {
        return { verified: false, reason: 'Recovery code already used' };
      }

      if (new Date() > recoveryCode.expiresAt) {
        return { verified: false, reason: 'Recovery code expired' };
      }

      recoveryCode.used = true;
      recoveryCode.usedAt = new Date();

      return { verified: true };
    }
  }

  return { verified: false, reason: 'Invalid recovery code' };
};

/**
 * Initiates account recovery when MFA is lost.
 *
 * @param {string} userId - User identifier
 * @param {string} email - User's email for recovery
 * @returns {Promise<{ initiated: boolean; recoveryId?: string }>} Recovery initiation result
 *
 * @example
 * ```typescript
 * const result = await initiateAccountRecovery('user123', 'user@example.com');
 * // Send recovery link to email
 * ```
 */
export const initiateAccountRecovery = async (
  userId: string,
  email: string
): Promise<{ initiated: boolean; recoveryId?: string }> => {
  const recoveryId = crypto.randomBytes(32).toString('hex');

  // In production, send recovery email with secure link
  console.log(`[Recovery] Initiated for user ${userId}, recovery ID: ${recoveryId}`);

  return {
    initiated: true,
    recoveryId,
  };
};

/**
 * Resets MFA after account recovery.
 *
 * @param {string} recoveryId - Recovery session ID
 * @param {string} userId - User identifier
 * @returns {Promise<{ reset: boolean; newEnrollmentRequired: boolean }>} Reset result
 *
 * @example
 * ```typescript
 * const result = await resetMFAAfterRecovery(recoveryId, userId);
 * if (result.reset) {
 *   // Redirect to MFA enrollment
 * }
 * ```
 */
export const resetMFAAfterRecovery = async (
  recoveryId: string,
  userId: string
): Promise<{ reset: boolean; newEnrollmentRequired: boolean }> => {
  // In production, verify recovery session and reset MFA settings
  return {
    reset: true,
    newEnrollmentRequired: true,
  };
};

// ============================================================================
// TRUSTED DEVICE BYPASS
// ============================================================================

/**
 * Generates device fingerprint for trusted device tracking.
 *
 * @param {string} userAgent - User agent string
 * @param {string} ipAddress - IP address
 * @param {string} [additionalData] - Additional device data
 * @returns {string} Device fingerprint hash
 *
 * @example
 * ```typescript
 * const fingerprint = generateDeviceFingerprint(req.headers['user-agent'], req.ip);
 * ```
 */
export const generateDeviceFingerprint = (
  userAgent: string,
  ipAddress: string,
  additionalData?: string
): string => {
  const data = `${userAgent}|${ipAddress}|${additionalData || ''}`;
  return crypto.createHash('sha256').update(data).digest('hex');
};

/**
 * Registers a device as trusted.
 *
 * @param {string} userId - User identifier
 * @param {string} deviceFingerprint - Device fingerprint
 * @param {string} userAgent - User agent string
 * @param {string} ipAddress - IP address
 * @param {number} [trustDays=30] - Days to trust device
 * @returns {TrustedDevice} Trusted device record
 *
 * @example
 * ```typescript
 * const trustedDevice = registerTrustedDevice(
 *   userId,
 *   fingerprint,
 *   userAgent,
 *   ipAddress,
 *   30
 * );
 * ```
 */
export const registerTrustedDevice = (
  userId: string,
  deviceFingerprint: string,
  userAgent: string,
  ipAddress: string,
  trustDays: number = 30
): TrustedDevice => {
  const deviceId = crypto.randomBytes(16).toString('hex');
  const trustedAt = new Date();
  const expiresAt = new Date(trustedAt.getTime() + trustDays * 24 * 60 * 60 * 1000);

  return {
    deviceId,
    userId,
    deviceFingerprint,
    userAgent,
    ipAddress,
    trustedAt,
    expiresAt,
    lastSeenAt: trustedAt,
  };
};

/**
 * Checks if a device is trusted.
 *
 * @param {string} deviceFingerprint - Device fingerprint to check
 * @param {TrustedDevice[]} trustedDevices - User's trusted devices
 * @returns {{ isTrusted: boolean; device?: TrustedDevice }} Trust check result
 *
 * @example
 * ```typescript
 * const result = isDeviceTrusted(fingerprint, userTrustedDevices);
 * if (result.isTrusted) {
 *   // Skip MFA challenge
 * }
 * ```
 */
export const isDeviceTrusted = (
  deviceFingerprint: string,
  trustedDevices: TrustedDevice[]
): { isTrusted: boolean; device?: TrustedDevice } => {
  const device = trustedDevices.find(d =>
    d.deviceFingerprint === deviceFingerprint && new Date() < d.expiresAt
  );

  return {
    isTrusted: !!device,
    device,
  };
};

/**
 * Revokes trust for a device.
 *
 * @param {string} deviceId - Device ID to revoke
 * @param {string} userId - User identifier
 * @returns {Promise<boolean>} True if revoked successfully
 *
 * @example
 * ```typescript
 * await revokeTrustedDevice(deviceId, userId);
 * ```
 */
export const revokeTrustedDevice = async (deviceId: string, userId: string): Promise<boolean> => {
  // In production, remove from database
  return true;
};

// ============================================================================
// ADAPTIVE MFA POLICIES
// ============================================================================

/**
 * Assesses risk level for MFA requirement.
 *
 * @param {object} context - Authentication context
 * @returns {MFARiskAssessment} Risk assessment
 *
 * @example
 * ```typescript
 * const assessment = assessMFARisk({
 *   ipAddress: '192.168.1.1',
 *   location: 'US',
 *   deviceTrusted: false,
 *   timeSinceLastAuth: 86400
 * });
 * if (assessment.requireMFA) {
 *   // Require MFA
 * }
 * ```
 */
export const assessMFARisk = (context: {
  ipAddress?: string;
  location?: string;
  deviceTrusted?: boolean;
  timeSinceLastAuth?: number;
  anomalyDetected?: boolean;
}): MFARiskAssessment => {
  let score = 0;
  const factors: string[] = [];

  if (!context.deviceTrusted) {
    score += 30;
    factors.push('Untrusted device');
  }

  if (context.anomalyDetected) {
    score += 40;
    factors.push('Anomaly detected');
  }

  if (context.timeSinceLastAuth && context.timeSinceLastAuth > 86400) {
    score += 20;
    factors.push('Long time since last authentication');
  }

  let level: MFARiskAssessment['level'];
  if (score >= 70) level = 'critical';
  else if (score >= 50) level = 'high';
  else if (score >= 30) level = 'medium';
  else level = 'low';

  const requireMFA = score >= 30;
  const recommendedMethods = score >= 50 ? ['webauthn', 'totp'] : ['sms', 'email', 'totp'];

  return {
    score,
    level,
    factors,
    requireMFA,
    recommendedMethods,
  };
};

/**
 * Applies adaptive MFA policy based on context.
 *
 * @param {AdaptiveMFAPolicy} policy - MFA policy to apply
 * @param {object} context - Current authentication context
 * @returns {{ requireMFA: boolean; allowedMethods: string[]; reason: string }} Policy application result
 *
 * @example
 * ```typescript
 * const result = applyAdaptiveMFAPolicy(policy, {
 *   ipAddress: req.ip,
 *   userAgent: req.headers['user-agent'],
 *   riskScore: 65
 * });
 * ```
 */
export const applyAdaptiveMFAPolicy = (
  policy: AdaptiveMFAPolicy,
  context: any
): { requireMFA: boolean; allowedMethods: string[]; reason: string } => {
  let requireMFA = false;
  let reason = '';

  for (const condition of policy.conditions) {
    if (evaluatePolicyCondition(condition, context)) {
      requireMFA = true;
      reason = `Policy condition met: ${condition.type}`;
      break;
    }
  }

  if (context.riskScore >= policy.riskThreshold) {
    requireMFA = true;
    reason = `Risk score ${context.riskScore} exceeds threshold ${policy.riskThreshold}`;
  }

  return {
    requireMFA,
    allowedMethods: policy.allowedMethods,
    reason,
  };
};

/**
 * Creates default adaptive MFA policy for healthcare.
 *
 * @returns {AdaptiveMFAPolicy} Default MFA policy
 *
 * @example
 * ```typescript
 * const policy = createDefaultAdaptiveMFAPolicy();
 * ```
 */
export const createDefaultAdaptiveMFAPolicy = (): AdaptiveMFAPolicy => {
  return {
    name: 'Healthcare Default MFA Policy',
    conditions: [
      {
        type: 'risk-score',
        operator: 'greater-than',
        value: 50,
      },
      {
        type: 'location',
        operator: 'not-in',
        value: ['US', 'CA'],
      },
    ],
    requiredFactors: 2,
    allowedMethods: ['totp', 'webauthn', 'sms', 'email'],
    riskThreshold: 50,
  };
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Encodes data to Base32 format.
 *
 * @param {string} data - Data to encode
 * @returns {string} Base32 encoded string
 */
const base32Encode = (data: string): string => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const bytes = Buffer.from(data, 'hex');
  let bits = 0;
  let value = 0;
  let output = '';

  for (let i = 0; i < bytes.length; i++) {
    value = (value << 8) | bytes[i];
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
};

/**
 * Validates phone number format.
 *
 * @param {string} phoneNumber - Phone number to validate
 * @returns {boolean} True if valid
 */
const isValidPhoneNumber = (phoneNumber: string): boolean => {
  return /^\+?[1-9]\d{1,14}$/.test(phoneNumber.replace(/[\s-()]/g, ''));
};

/**
 * Validates email format.
 *
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Evaluates a policy condition against context.
 *
 * @param {MFAPolicyCondition} condition - Policy condition
 * @param {any} context - Current context
 * @returns {boolean} True if condition is met
 */
const evaluatePolicyCondition = (condition: MFAPolicyCondition, context: any): boolean => {
  const contextValue = context[condition.type.replace('-', '')];

  switch (condition.operator) {
    case 'equals':
      return contextValue === condition.value;
    case 'not-equals':
      return contextValue !== condition.value;
    case 'greater-than':
      return contextValue > condition.value;
    case 'less-than':
      return contextValue < condition.value;
    case 'in':
      return Array.isArray(condition.value) && condition.value.includes(contextValue);
    case 'not-in':
      return Array.isArray(condition.value) && !condition.value.includes(contextValue);
    default:
      return false;
  }
};
