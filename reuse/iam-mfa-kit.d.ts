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
 * TOTP configuration settings.
 */
interface TOTPConfig {
    secret: string;
    window?: number;
    step?: number;
    digits?: number;
    algorithm?: 'sha1' | 'sha256' | 'sha512';
}
/**
 * TOTP generation result.
 */
interface TOTPResult {
    code: string;
    timeRemaining: number;
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
    identifier: string;
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
    identifier: string;
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
    score: number;
    level: 'low' | 'medium' | 'high' | 'critical';
    factors: string[];
    requireMFA: boolean;
    recommendedMethods: string[];
}
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
export declare const generateTOTPSecret: (userId: string, issuer: string, secretLength?: number) => TOTPSecretResult;
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
export declare const generateTOTPCode: (config: TOTPConfig, time?: Date) => TOTPResult;
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
export declare const verifyTOTPCode: (code: string, config: TOTPConfig, time?: Date) => boolean;
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
export declare const generateTOTPQRCode: (otpAuthUrl: string) => Promise<string>;
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
export declare const validateTOTPConfig: (config: TOTPConfig) => {
    isValid: boolean;
    errors: string[];
};
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
export declare const generateSMSVerificationCode: (config: SMSMFAConfig) => SMSVerificationCode;
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
export declare const sendSMSVerificationCode: (verificationCode: SMSVerificationCode, config: SMSMFAConfig) => Promise<{
    sent: boolean;
    messageId?: string;
}>;
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
export declare const verifySMSCode: (code: string, verificationCode: SMSVerificationCode, maxAttempts?: number) => {
    verified: boolean;
    reason?: string;
    attemptsRemaining?: number;
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
export declare const formatPhoneNumber: (phoneNumber: string, countryCode: string) => string;
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
export declare const resendSMSCode: (phoneNumber: string, config: SMSMFAConfig, cooldownSeconds?: number) => Promise<{
    sent: boolean;
    reason?: string;
    nextAllowedAt?: Date;
}>;
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
export declare const generateEmailVerificationCode: (config: EmailMFAConfig) => EmailVerificationCode;
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
export declare const sendEmailVerificationCode: (verificationCode: EmailVerificationCode, config: EmailMFAConfig) => Promise<{
    sent: boolean;
    messageId?: string;
}>;
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
export declare const verifyEmailCode: (code: string, verificationCode: EmailVerificationCode, maxAttempts?: number) => {
    verified: boolean;
    reason?: string;
    attemptsRemaining?: number;
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
export declare const generateEmailMFATemplate: (code: string, expiryMinutes: number) => string;
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
export declare const generateBackupCodes: (userId: string, count?: number, codeLength?: number) => BackupCodeSet;
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
export declare const verifyBackupCode: (code: string, backupCodeSet: BackupCodeSet, ipAddress?: string) => {
    verified: boolean;
    reason?: string;
    codesRemaining?: number;
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
export declare const getBackupCodesRemaining: (backupCodeSet: BackupCodeSet) => number;
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
export declare const regenerateBackupCodes: (userId: string, oldBackupCodeSet: BackupCodeSet) => BackupCodeSet;
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
export declare const formatBackupCodesForDisplay: (backupCodeSet: BackupCodeSet) => string[];
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
export declare const initiateMFAEnrollment: (userId: string, method: "totp" | "sms" | "email" | "webauthn", identifier: string) => MFAEnrollmentResult;
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
export declare const completeMFAEnrollment: (enrollmentId: string, verificationCode: string) => Promise<{
    completed: boolean;
    reason?: string;
}>;
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
export declare const cancelMFAEnrollment: (enrollmentId: string) => Promise<boolean>;
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
export declare const getEnrollmentStatus: (enrollmentId: string) => Promise<{
    status: string;
    method: string;
    completed: boolean;
}>;
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
export declare const validateEnrollmentCompletion: (enrollment: MFAEnrollmentRequest) => {
    isValid: boolean;
    errors: string[];
};
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
export declare const registerMFADevice: (userId: string, deviceName: string, type: "totp" | "sms" | "email" | "webauthn" | "backup", identifier: string) => MFADevice;
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
export declare const listMFADevices: (userId: string) => Promise<MFADevice[]>;
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
export declare const removeMFADevice: (deviceId: string, userId: string) => Promise<{
    removed: boolean;
    reason?: string;
}>;
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
export declare const setPrimaryMFADevice: (deviceId: string, userId: string) => Promise<boolean>;
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
export declare const updateDeviceLastUsed: (deviceId: string) => Promise<void>;
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
export declare const generateWebAuthnChallenge: (userId: string, username: string) => WebAuthnChallenge;
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
export declare const verifyWebAuthnRegistration: (registrationResponse: any, challenge: WebAuthnChallenge) => Promise<WebAuthnVerificationResult>;
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
export declare const generateWebAuthnAuthChallenge: (userId: string) => WebAuthnChallenge;
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
export declare const verifyWebAuthnAuthentication: (authResponse: any, challenge: WebAuthnChallenge, credential: WebAuthnCredential) => Promise<WebAuthnVerificationResult>;
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
export declare const storeWebAuthnCredential: (userId: string, credentialId: string, publicKey: string, deviceName?: string) => WebAuthnCredential;
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
export declare const generateMFARecoveryCodes: (userId: string, count?: number) => MFARecoveryCode[];
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
export declare const verifyMFARecoveryCode: (code: string, recoveryCodes: MFARecoveryCode[]) => {
    verified: boolean;
    reason?: string;
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
export declare const initiateAccountRecovery: (userId: string, email: string) => Promise<{
    initiated: boolean;
    recoveryId?: string;
}>;
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
export declare const resetMFAAfterRecovery: (recoveryId: string, userId: string) => Promise<{
    reset: boolean;
    newEnrollmentRequired: boolean;
}>;
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
export declare const generateDeviceFingerprint: (userAgent: string, ipAddress: string, additionalData?: string) => string;
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
export declare const registerTrustedDevice: (userId: string, deviceFingerprint: string, userAgent: string, ipAddress: string, trustDays?: number) => TrustedDevice;
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
export declare const isDeviceTrusted: (deviceFingerprint: string, trustedDevices: TrustedDevice[]) => {
    isTrusted: boolean;
    device?: TrustedDevice;
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
export declare const revokeTrustedDevice: (deviceId: string, userId: string) => Promise<boolean>;
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
export declare const assessMFARisk: (context: {
    ipAddress?: string;
    location?: string;
    deviceTrusted?: boolean;
    timeSinceLastAuth?: number;
    anomalyDetected?: boolean;
}) => MFARiskAssessment;
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
export declare const applyAdaptiveMFAPolicy: (policy: AdaptiveMFAPolicy, context: any) => {
    requireMFA: boolean;
    allowedMethods: string[];
    reason: string;
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
export declare const createDefaultAdaptiveMFAPolicy: () => AdaptiveMFAPolicy;
export {};
//# sourceMappingURL=iam-mfa-kit.d.ts.map