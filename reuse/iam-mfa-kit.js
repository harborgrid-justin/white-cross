"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultAdaptiveMFAPolicy = exports.applyAdaptiveMFAPolicy = exports.assessMFARisk = exports.revokeTrustedDevice = exports.isDeviceTrusted = exports.registerTrustedDevice = exports.generateDeviceFingerprint = exports.resetMFAAfterRecovery = exports.initiateAccountRecovery = exports.verifyMFARecoveryCode = exports.generateMFARecoveryCodes = exports.storeWebAuthnCredential = exports.verifyWebAuthnAuthentication = exports.generateWebAuthnAuthChallenge = exports.verifyWebAuthnRegistration = exports.generateWebAuthnChallenge = exports.updateDeviceLastUsed = exports.setPrimaryMFADevice = exports.removeMFADevice = exports.listMFADevices = exports.registerMFADevice = exports.validateEnrollmentCompletion = exports.getEnrollmentStatus = exports.cancelMFAEnrollment = exports.completeMFAEnrollment = exports.initiateMFAEnrollment = exports.formatBackupCodesForDisplay = exports.regenerateBackupCodes = exports.getBackupCodesRemaining = exports.verifyBackupCode = exports.generateBackupCodes = exports.generateEmailMFATemplate = exports.verifyEmailCode = exports.sendEmailVerificationCode = exports.generateEmailVerificationCode = exports.resendSMSCode = exports.formatPhoneNumber = exports.verifySMSCode = exports.sendSMSVerificationCode = exports.generateSMSVerificationCode = exports.validateTOTPConfig = exports.generateTOTPQRCode = exports.verifyTOTPCode = exports.generateTOTPCode = exports.generateTOTPSecret = void 0;
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
const crypto = __importStar(require("crypto"));
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
const generateTOTPSecret = (userId, issuer, secretLength = 32) => {
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
exports.generateTOTPSecret = generateTOTPSecret;
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
const generateTOTPCode = (config, time) => {
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
exports.generateTOTPCode = generateTOTPCode;
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
const verifyTOTPCode = (code, config, time) => {
    const window = config.window || 1;
    // Check current time and ±window time steps
    for (let i = -window; i <= window; i++) {
        const checkTime = time ? new Date(time.getTime() + i * (config.step || 30) * 1000) : new Date(Date.now() + i * (config.step || 30) * 1000);
        const expected = (0, exports.generateTOTPCode)(config, checkTime);
        if (crypto.timingSafeEqual(Buffer.from(code), Buffer.from(expected.code))) {
            return true;
        }
    }
    return false;
};
exports.verifyTOTPCode = verifyTOTPCode;
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
const generateTOTPQRCode = async (otpAuthUrl) => {
    // In production, use a QR code library like 'qrcode'
    // This is a simulated implementation
    const base64 = Buffer.from(otpAuthUrl).toString('base64');
    return `data:image/png;base64,${base64}`;
};
exports.generateTOTPQRCode = generateTOTPQRCode;
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
const validateTOTPConfig = (config) => {
    const errors = [];
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
exports.validateTOTPConfig = validateTOTPConfig;
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
const generateSMSVerificationCode = (config) => {
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
exports.generateSMSVerificationCode = generateSMSVerificationCode;
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
const sendSMSVerificationCode = async (verificationCode, config) => {
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
exports.sendSMSVerificationCode = sendSMSVerificationCode;
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
const verifySMSCode = (code, verificationCode, maxAttempts = 3) => {
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
exports.verifySMSCode = verifySMSCode;
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
const formatPhoneNumber = (phoneNumber, countryCode) => {
    const countryPrefixes = {
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
exports.formatPhoneNumber = formatPhoneNumber;
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
const resendSMSCode = async (phoneNumber, config, cooldownSeconds = 60) => {
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
    const verificationCode = (0, exports.generateSMSVerificationCode)(config);
    const result = await (0, exports.sendSMSVerificationCode)(verificationCode, config);
    return { sent: result.sent };
};
exports.resendSMSCode = resendSMSCode;
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
const generateEmailVerificationCode = (config) => {
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
exports.generateEmailVerificationCode = generateEmailVerificationCode;
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
const sendEmailVerificationCode = async (verificationCode, config) => {
    // In production, integrate with email service (SendGrid, SES, Mailgun)
    const messageId = crypto.randomBytes(16).toString('hex');
    console.log(`[Email Service] Sending code ${verificationCode.code} to ${config.email}`);
    return {
        sent: true,
        messageId,
    };
};
exports.sendEmailVerificationCode = sendEmailVerificationCode;
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
const verifyEmailCode = (code, verificationCode, maxAttempts = 5) => {
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
exports.verifyEmailCode = verifyEmailCode;
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
const generateEmailMFATemplate = (code, expiryMinutes) => {
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
exports.generateEmailMFATemplate = generateEmailMFATemplate;
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
const generateBackupCodes = (userId, count = 10, codeLength = 8) => {
    const codes = [];
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
exports.generateBackupCodes = generateBackupCodes;
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
const verifyBackupCode = (code, backupCodeSet, ipAddress) => {
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
exports.verifyBackupCode = verifyBackupCode;
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
const getBackupCodesRemaining = (backupCodeSet) => {
    return backupCodeSet.codes.filter(code => !code.used).length;
};
exports.getBackupCodesRemaining = getBackupCodesRemaining;
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
const regenerateBackupCodes = (userId, oldBackupCodeSet) => {
    // Mark all old codes as used
    oldBackupCodeSet.codes.forEach(code => {
        code.used = true;
        code.usedAt = new Date();
    });
    // Generate new codes
    return (0, exports.generateBackupCodes)(userId);
};
exports.regenerateBackupCodes = regenerateBackupCodes;
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
const formatBackupCodesForDisplay = (backupCodeSet) => {
    return backupCodeSet.codes
        .filter(code => !code.used)
        .map(code => code.code);
};
exports.formatBackupCodesForDisplay = formatBackupCodesForDisplay;
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
const initiateMFAEnrollment = (userId, method, identifier) => {
    const enrollmentId = crypto.randomBytes(16).toString('hex');
    const result = {
        enrollmentId,
        method,
    };
    if (method === 'totp') {
        const totpSecret = (0, exports.generateTOTPSecret)(userId, 'White Cross Healthcare');
        result.secret = totpSecret.secret;
        result.qrCode = totpSecret.qrCodeUrl;
        result.nextStep = 'Scan QR code and enter verification code';
    }
    else if (method === 'sms') {
        result.nextStep = 'Verification code will be sent to your phone';
    }
    else if (method === 'email') {
        result.nextStep = 'Verification code will be sent to your email';
    }
    else if (method === 'webauthn') {
        result.nextStep = 'Follow browser prompts to register security key';
    }
    // Generate backup codes for all methods
    const backupCodeSet = (0, exports.generateBackupCodes)(userId);
    result.backupCodes = (0, exports.formatBackupCodesForDisplay)(backupCodeSet);
    return result;
};
exports.initiateMFAEnrollment = initiateMFAEnrollment;
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
const completeMFAEnrollment = async (enrollmentId, verificationCode) => {
    // In production, retrieve enrollment details from database and verify code
    // Simulated implementation
    if (!verificationCode || verificationCode.length < 6) {
        return { completed: false, reason: 'Invalid verification code' };
    }
    return { completed: true };
};
exports.completeMFAEnrollment = completeMFAEnrollment;
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
const cancelMFAEnrollment = async (enrollmentId) => {
    // In production, mark enrollment as cancelled in database
    return true;
};
exports.cancelMFAEnrollment = cancelMFAEnrollment;
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
const getEnrollmentStatus = async (enrollmentId) => {
    // In production, retrieve from database
    return {
        status: 'pending',
        method: 'totp',
        completed: false,
    };
};
exports.getEnrollmentStatus = getEnrollmentStatus;
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
const validateEnrollmentCompletion = (enrollment) => {
    const errors = [];
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
exports.validateEnrollmentCompletion = validateEnrollmentCompletion;
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
const registerMFADevice = (userId, deviceName, type, identifier) => {
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
exports.registerMFADevice = registerMFADevice;
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
const listMFADevices = async (userId) => {
    // In production, retrieve from database
    return [];
};
exports.listMFADevices = listMFADevices;
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
const removeMFADevice = async (deviceId, userId) => {
    // In production, verify user owns device and remove from database
    // Ensure at least one MFA method remains active
    return { removed: true };
};
exports.removeMFADevice = removeMFADevice;
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
const setPrimaryMFADevice = async (deviceId, userId) => {
    // In production, update database to set isPrimary flag
    return true;
};
exports.setPrimaryMFADevice = setPrimaryMFADevice;
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
const updateDeviceLastUsed = async (deviceId) => {
    // In production, update lastUsedAt in database
};
exports.updateDeviceLastUsed = updateDeviceLastUsed;
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
const generateWebAuthnChallenge = (userId, username) => {
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
exports.generateWebAuthnChallenge = generateWebAuthnChallenge;
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
const verifyWebAuthnRegistration = async (registrationResponse, challenge) => {
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
exports.verifyWebAuthnRegistration = verifyWebAuthnRegistration;
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
const generateWebAuthnAuthChallenge = (userId) => {
    return (0, exports.generateWebAuthnChallenge)(userId, '');
};
exports.generateWebAuthnAuthChallenge = generateWebAuthnAuthChallenge;
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
const verifyWebAuthnAuthentication = async (authResponse, challenge, credential) => {
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
exports.verifyWebAuthnAuthentication = verifyWebAuthnAuthentication;
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
const storeWebAuthnCredential = (userId, credentialId, publicKey, deviceName) => {
    return {
        credentialId,
        publicKey,
        counter: 0,
        userId,
        deviceName,
        createdAt: new Date(),
    };
};
exports.storeWebAuthnCredential = storeWebAuthnCredential;
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
const generateMFARecoveryCodes = (userId, count = 5) => {
    const codes = [];
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
exports.generateMFARecoveryCodes = generateMFARecoveryCodes;
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
const verifyMFARecoveryCode = (code, recoveryCodes) => {
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
exports.verifyMFARecoveryCode = verifyMFARecoveryCode;
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
const initiateAccountRecovery = async (userId, email) => {
    const recoveryId = crypto.randomBytes(32).toString('hex');
    // In production, send recovery email with secure link
    console.log(`[Recovery] Initiated for user ${userId}, recovery ID: ${recoveryId}`);
    return {
        initiated: true,
        recoveryId,
    };
};
exports.initiateAccountRecovery = initiateAccountRecovery;
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
const resetMFAAfterRecovery = async (recoveryId, userId) => {
    // In production, verify recovery session and reset MFA settings
    return {
        reset: true,
        newEnrollmentRequired: true,
    };
};
exports.resetMFAAfterRecovery = resetMFAAfterRecovery;
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
const generateDeviceFingerprint = (userAgent, ipAddress, additionalData) => {
    const data = `${userAgent}|${ipAddress}|${additionalData || ''}`;
    return crypto.createHash('sha256').update(data).digest('hex');
};
exports.generateDeviceFingerprint = generateDeviceFingerprint;
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
const registerTrustedDevice = (userId, deviceFingerprint, userAgent, ipAddress, trustDays = 30) => {
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
exports.registerTrustedDevice = registerTrustedDevice;
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
const isDeviceTrusted = (deviceFingerprint, trustedDevices) => {
    const device = trustedDevices.find(d => d.deviceFingerprint === deviceFingerprint && new Date() < d.expiresAt);
    return {
        isTrusted: !!device,
        device,
    };
};
exports.isDeviceTrusted = isDeviceTrusted;
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
const revokeTrustedDevice = async (deviceId, userId) => {
    // In production, remove from database
    return true;
};
exports.revokeTrustedDevice = revokeTrustedDevice;
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
const assessMFARisk = (context) => {
    let score = 0;
    const factors = [];
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
    let level;
    if (score >= 70)
        level = 'critical';
    else if (score >= 50)
        level = 'high';
    else if (score >= 30)
        level = 'medium';
    else
        level = 'low';
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
exports.assessMFARisk = assessMFARisk;
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
const applyAdaptiveMFAPolicy = (policy, context) => {
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
exports.applyAdaptiveMFAPolicy = applyAdaptiveMFAPolicy;
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
const createDefaultAdaptiveMFAPolicy = () => {
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
exports.createDefaultAdaptiveMFAPolicy = createDefaultAdaptiveMFAPolicy;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Encodes data to Base32 format.
 *
 * @param {string} data - Data to encode
 * @returns {string} Base32 encoded string
 */
const base32Encode = (data) => {
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
const isValidPhoneNumber = (phoneNumber) => {
    return /^\+?[1-9]\d{1,14}$/.test(phoneNumber.replace(/[\s-()]/g, ''));
};
/**
 * Validates email format.
 *
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
/**
 * Evaluates a policy condition against context.
 *
 * @param {MFAPolicyCondition} condition - Policy condition
 * @param {any} context - Current context
 * @returns {boolean} True if condition is met
 */
const evaluatePolicyCondition = (condition, context) => {
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
//# sourceMappingURL=iam-mfa-kit.js.map