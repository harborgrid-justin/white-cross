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
    rounds?: number;
}
/**
 * Configuration for scrypt password hashing.
 */
interface ScryptConfig {
    cost?: number;
    blockSize?: number;
    parallelization?: number;
    keyLength?: number;
    maxmem?: number;
}
/**
 * Configuration for argon2 password hashing.
 */
interface Argon2Config {
    timeCost?: number;
    memoryCost?: number;
    parallelism?: number;
    hashLength?: number;
    type?: 'argon2d' | 'argon2i' | 'argon2id';
}
/**
 * Password strength assessment result.
 */
interface PasswordStrengthResult {
    score: number;
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
    excludeSimilar?: boolean;
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
    rank?: number;
    category?: string;
}
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
export declare const hashPasswordBcrypt: (password: string, config?: BcryptConfig) => Promise<PasswordHashResult>;
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
export declare const verifyPasswordBcrypt: (password: string, hash: string) => Promise<boolean>;
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
export declare const hashPasswordScrypt: (password: string, config?: ScryptConfig) => Promise<PasswordHashResult>;
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
export declare const verifyPasswordScrypt: (password: string, hash: string) => Promise<boolean>;
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
export declare const hashPasswordArgon2: (password: string, config?: Argon2Config) => Promise<PasswordHashResult>;
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
export declare const calculatePasswordEntropy: (password: string) => number;
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
export declare const assessPasswordStrength: (password: string) => PasswordStrengthResult;
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
export declare const validatePasswordStrength: (password: string, minScore?: number) => boolean;
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
export declare const detectWeakPasswordPatterns: (password: string) => string[];
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
export declare const generatePasswordFeedback: (password: string) => string[];
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
export declare const validatePasswordPolicy: (password: string, policy: PasswordPolicy) => PolicyValidationResult;
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
export declare const createDefaultPasswordPolicy: () => PasswordPolicy;
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
export declare const enforcePasswordPolicy: (password: string, policy: PasswordPolicy) => PolicyValidationResult;
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
export declare const checkPasswordContainsUserInfo: (password: string, userInfo: {
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    birthYear?: string;
}) => boolean;
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
export declare const validatePasswordCustomPatterns: (password: string, patterns: RegExp[]) => boolean;
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
export declare const addPasswordToHistory: (userId: string, passwordHash: string, algorithm: string) => PasswordHistoryEntry;
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
export declare const checkPasswordInHistory: (password: string, history: PasswordHistoryEntry[], checkLast?: number) => Promise<boolean>;
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
export declare const getPasswordHistory: (userId: string, limit?: number) => Promise<PasswordHistoryEntry[]>;
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
export declare const cleanupPasswordHistory: (userId: string, retentionDays: number) => Promise<number>;
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
export declare const generatePasswordResetToken: (length?: number) => string;
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
export declare const createPasswordResetRequest: (userId: string, email: string, expiryMinutes?: number) => PasswordResetRequest;
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
export declare const validatePasswordResetToken: (token: string, resetRequest: PasswordResetRequest) => PasswordResetValidation;
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
export declare const markResetTokenAsUsed: (resetRequest: PasswordResetRequest) => PasswordResetRequest;
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
export declare const generatePasswordResetUrl: (baseUrl: string, token: string) => string;
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
export declare const calculatePasswordExpiration: (passwordCreatedAt: Date, expiryDays: number, warningDays?: number) => PasswordExpirationInfo;
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
export declare const isPasswordExpired: (passwordCreatedAt: Date, expiryDays: number) => boolean;
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
export declare const shouldShowPasswordExpirationWarning: (passwordCreatedAt: Date, expiryDays: number, warningDays?: number) => boolean;
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
export declare const generateExpirationWarningMessage: (expirationInfo: PasswordExpirationInfo) => string;
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
export declare const generateSecurePassword: (options?: PasswordGenerationOptions) => string;
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
export declare const generatePasswordSuggestions: (count: number, options?: PasswordGenerationOptions) => string[];
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
export declare const generatePassphrase: (wordCount?: number, separator?: string) => string;
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
export declare const generatePronounceablePassword: (length?: number) => string;
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
export declare const validateGeneratedPassword: (password: string, options: PasswordGenerationOptions) => boolean;
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
export declare const checkPasswordBreach: (password: string) => Promise<BreachCheckResult>;
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
export declare const hashPasswordForBreachCheck: (password: string) => string;
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
export declare const getPasswordHashPrefix: (password: string) => string;
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
export declare const validatePasswordNotBreached: (password: string, allowBreached?: boolean) => Promise<{
    isValid: boolean;
    warning?: string;
}>;
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
export declare const createComplexityRule: (name: string, description: string, validator: (password: string) => boolean, errorMessage: string) => ComplexityRule;
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
export declare const applyComplexityRules: (password: string, rules: ComplexityRule[]) => {
    isValid: boolean;
    violations: string[];
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
export declare const getStandardComplexityRules: () => ComplexityRule[];
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
export declare const validatePasswordEntropy: (password: string, minEntropy?: number) => boolean;
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
export declare const checkCommonPassword: (password: string) => CommonPasswordCheckResult;
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
export declare const validateNotCommonPassword: (password: string) => boolean;
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
export declare const loadCommonPasswordsList: (passwords: string[]) => Set<string>;
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
export declare const checkAgainstCommonSet: (password: string, commonSet: Set<string>) => boolean;
export {};
//# sourceMappingURL=iam-password-kit.d.ts.map