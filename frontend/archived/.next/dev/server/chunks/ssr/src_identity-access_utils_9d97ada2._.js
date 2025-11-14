module.exports = [
"[project]/src/identity-access/utils/tokenSecurity.types.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Token Security Type Definitions
 * @module identity-access/utils/tokenSecurity.types
 *
 * Provides TypeScript type definitions and configuration constants for the token security system.
 * This module defines data structures for encrypted and unencrypted token storage, along with
 * security configuration constants used throughout the authentication system.
 *
 * Security Considerations:
 * - Token data contains sensitive user information and authentication tokens
 * - Encryption uses AES-GCM with 256-bit keys
 * - Expiration timestamps prevent use of stale tokens
 * - Legacy keys support backward compatibility during migration
 *
 * Related Modules:
 * - tokenSecurity.storage: Uses these types for token storage operations
 * - tokenSecurity.encryption: Uses EncryptedTokenData for encryption operations
 * - tokenSecurity.validation: Uses TokenData for validation logic
 *
 * @since 2025-11-04
 */ __turbopack_context__.s([
    "TOKEN_SECURITY_CONFIG",
    ()=>TOKEN_SECURITY_CONFIG
]);
const TOKEN_SECURITY_CONFIG = {
    STORAGE_KEY: 'auth_data',
    ENCRYPTION_KEY_NAME: 'auth_encryption_key',
    TOKEN_EXPIRY_BUFFER: 5 * 60 * 1000,
    DEFAULT_TOKEN_LIFETIME: 24 * 60 * 60 * 1000,
    LEGACY_TOKEN_KEYS: [
        'auth_token',
        'token',
        'authToken'
    ],
    LEGACY_USER_KEY: 'user'
};
}),
"[project]/src/identity-access/utils/tokenSecurity.encryption.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Token Encryption Utilities
 * @module identity-access/utils/tokenSecurity.encryption
 *
 * Provides encryption and decryption capabilities using the Web Crypto API for secure
 * token storage in localStorage. Implements AES-GCM encryption with 256-bit keys for
 * client-side token protection.
 *
 * Security Considerations:
 * - Uses AES-GCM (Galois/Counter Mode) for authenticated encryption
 * - Generates unique 256-bit encryption keys per browser
 * - Creates unique initialization vectors (IVs) for each encryption operation
 * - Keys stored in localStorage - consider httpOnly cookies for production
 * - Does NOT protect against XSS attacks (use CSP and input sanitization)
 * - localStorage is vulnerable to JavaScript access - httpOnly cookies preferred
 *
 * Architecture Notes:
 * - Singleton pattern via exported `encryptionManager` instance
 * - Lazy initialization on first use via `init()` method
 * - Graceful fallback to unencrypted storage if encryption unavailable
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto} Web Crypto API
 * @see {@link TokenSecurityManager} for token storage operations using this encryption
 *
 * @since 2025-11-04
 */ __turbopack_context__.s([
    "EncryptionManager",
    ()=>EncryptionManager,
    "encryptionManager",
    ()=>encryptionManager
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$utils$2f$tokenSecurity$2e$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/identity-access/utils/tokenSecurity.types.ts [app-rsc] (ecmascript)");
;
class EncryptionManager {
    /**
   * Web Crypto API encryption key for AES-GCM operations.
   * Null until initialization completes successfully.
   *
   * @private
   * @type {CryptoKey | null}
   */ encryptionKey = null;
    /**
   * Initializes the encryption manager.
   *
   * Retrieves an existing encryption key from localStorage or generates a new one
   * if none exists. Must be called before performing any encryption operations.
   *
   * @async
   * @returns {Promise<void>} Resolves when initialization completes
   *
   * @throws {Error} Logs error but does not throw - falls back to unencrypted storage
   *
   * @example
   * ```typescript
   * const manager = new EncryptionManager();
   * await manager.init();
   *
   * if (manager.isEncryptionAvailable()) {
   *   console.log('Encryption ready');
   * } else {
   *   console.warn('Encryption unavailable, using fallback');
   * }
   * ```
   *
   * @remarks
   * - Generates a new 256-bit AES-GCM key if none exists
   * - Stores key in localStorage for persistence across sessions
   * - Falls back gracefully if Web Crypto API unavailable
   * - Key generation uses cryptographically secure random number generator
   */ async init() {
        try {
            const keyData = localStorage.getItem(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$utils$2f$tokenSecurity$2e$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TOKEN_SECURITY_CONFIG"].ENCRYPTION_KEY_NAME);
            if (keyData) {
                const keyBuffer = this.base64ToArrayBuffer(keyData);
                this.encryptionKey = await crypto.subtle.importKey('raw', keyBuffer, {
                    name: 'AES-GCM'
                }, false, [
                    'encrypt',
                    'decrypt'
                ]);
            } else {
                await this.generateNewKey();
            }
        } catch (error) {
            console.error('Failed to initialize encryption:', error);
            console.warn('Using unencrypted token storage - consider implementing httpOnly cookies');
        }
    }
    /**
   * Generates a new AES-GCM encryption key.
   *
   * Creates a new 256-bit encryption key using the Web Crypto API and stores it
   * in localStorage for future sessions. The key is generated using a
   * cryptographically secure random number generator.
   *
   * @private
   * @async
   * @returns {Promise<void>} Resolves when key generation and storage complete
   *
   * @throws {Error} If key generation or storage fails
   *
   * @remarks
   * Security Considerations:
   * - Uses 256-bit key length for strong encryption
   * - Key is exportable to enable localStorage storage
   * - Key stored as base64-encoded string in localStorage
   * - Each browser/device gets a unique key
   * - Key persists across browser sessions until cleared
   */ async generateNewKey() {
        this.encryptionKey = await crypto.subtle.generateKey({
            name: 'AES-GCM',
            length: 256
        }, true, [
            'encrypt',
            'decrypt'
        ]);
        const keyBuffer = await crypto.subtle.exportKey('raw', this.encryptionKey);
        localStorage.setItem(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$utils$2f$tokenSecurity$2e$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TOKEN_SECURITY_CONFIG"].ENCRYPTION_KEY_NAME, this.arrayBufferToBase64(keyBuffer));
    }
    /**
   * Checks if encryption is available and ready to use.
   *
   * Returns true if the encryption key has been successfully initialized and
   * is ready for encryption/decryption operations.
   *
   * @returns {boolean} True if encryption key is available, false otherwise
   *
   * @example
   * ```typescript
   * if (encryptionManager.isEncryptionAvailable()) {
   *   // Safe to encrypt
   *   const encrypted = await encryptionManager.encryptData(data);
   * } else {
   *   // Use fallback (unencrypted storage)
   *   localStorage.setItem('data', data);
   * }
   * ```
   *
   * @remarks
   * - Should be checked before calling encryptData() or decryptData()
   * - Returns false if init() hasn't been called or failed
   * - Fallback to unencrypted storage recommended when false
   */ isEncryptionAvailable() {
        return this.encryptionKey !== null;
    }
    /**
   * Encrypts string data using AES-GCM encryption.
   *
   * Encrypts the provided string data using AES-GCM with a unique initialization
   * vector (IV) for each operation. Returns an object containing the encrypted
   * data, IV, and timestamp.
   *
   * @async
   * @param {string} data - String data to encrypt (typically JSON-serialized token data)
   * @returns {Promise<EncryptedTokenData>} Object containing encrypted data, IV, and timestamp
   *
   * @throws {Error} If encryption key is not available (call init() first)
   * @throws {Error} If encryption operation fails
   *
   * @example
   * ```typescript
   * await encryptionManager.init();
   *
   * const tokenData = JSON.stringify({
   *   token: 'jwt-token-here',
   *   user: { id: '123', email: 'user@example.com' }
   * });
   *
   * const encrypted = await encryptionManager.encryptData(tokenData);
   * console.log(encrypted);
   * // {
   * //   data: 'base64-encrypted-data',
   * //   iv: 'base64-iv',
   * //   timestamp: 1699564800000
   * // }
   * ```
   *
   * @remarks
   * Security Features:
   * - Uses AES-GCM for authenticated encryption
   * - Generates unique 12-byte IV for each encryption
   * - Includes timestamp for audit and age verification
   * - IV must be stored with encrypted data for decryption
   * - Never reuse an IV with the same key
   *
   * @see {@link decryptData} for decryption
   * @see {@link EncryptedTokenData} for return type structure
   */ async encryptData(data) {
        if (!this.encryptionKey) {
            throw new Error('Encryption key not available');
        }
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encoder = new TextEncoder();
        const encodedData = encoder.encode(data);
        const encrypted = await crypto.subtle.encrypt({
            name: 'AES-GCM',
            iv
        }, this.encryptionKey, encodedData);
        return {
            data: this.arrayBufferToBase64(encrypted),
            iv: this.arrayBufferToBase64(iv.buffer),
            timestamp: Date.now()
        };
    }
    /**
   * Decrypts AES-GCM encrypted data.
   *
   * Decrypts data that was previously encrypted with encryptData(). Requires the
   * original initialization vector (IV) that was used during encryption.
   *
   * @async
   * @param {EncryptedTokenData} encryptedData - Object containing encrypted data and IV
   * @returns {Promise<string>} Decrypted string data
   *
   * @throws {Error} If encryption key is not available (call init() first)
   * @throws {Error} If decryption fails (corrupted data, wrong key, or tampered data)
   *
   * @example
   * ```typescript
   * const encryptedData = {
   *   data: 'base64-encrypted-data',
   *   iv: 'base64-iv',
   *   timestamp: 1699564800000
   * };
   *
   * try {
   *   const decrypted = await encryptionManager.decryptData(encryptedData);
   *   const tokenData = JSON.parse(decrypted);
   *   console.log('Token:', tokenData.token);
   * } catch (error) {
   *   console.error('Decryption failed:', error);
   *   // Handle corrupted or tampered data
   * }
   * ```
   *
   * @remarks
   * Security Features:
   * - AES-GCM provides authenticated encryption (detects tampering)
   * - Decryption fails if data has been modified
   * - Decryption fails if wrong key is used
   * - Always handle decryption errors gracefully
   *
   * Error Scenarios:
   * - Data corrupted: Decryption throws error
   * - Data tampered: Authentication tag mismatch
   * - Wrong key: Decryption fails
   * - Invalid IV: Decryption fails
   *
   * @see {@link encryptData} for encryption
   * @see {@link EncryptedTokenData} for parameter structure
   */ async decryptData(encryptedData) {
        if (!this.encryptionKey) {
            throw new Error('Encryption key not available');
        }
        const iv = this.base64ToArrayBuffer(encryptedData.iv);
        const data = this.base64ToArrayBuffer(encryptedData.data);
        const decrypted = await crypto.subtle.decrypt({
            name: 'AES-GCM',
            iv
        }, this.encryptionKey, data);
        const decoder = new TextDecoder();
        return decoder.decode(decrypted);
    }
    /**
   * Converts ArrayBuffer to base64-encoded string.
   *
   * Utility method to encode binary data as base64 for storage in localStorage.
   * Uses the btoa() function for encoding.
   *
   * @private
   * @param {ArrayBuffer} buffer - Binary data to encode
   * @returns {string} Base64-encoded string
   *
   * @remarks
   * - Used for encoding encrypted data and IVs
   * - Output is safe for localStorage storage
   * - Inverse operation: {@link base64ToArrayBuffer}
   */ arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for(let i = 0; i < bytes.byteLength; i++){
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }
    /**
   * Converts base64-encoded string to ArrayBuffer.
   *
   * Utility method to decode base64 strings from localStorage back into binary
   * data for cryptographic operations. Uses the atob() function for decoding.
   *
   * @private
   * @param {string} base64 - Base64-encoded string to decode
   * @returns {ArrayBuffer} Binary data as ArrayBuffer
   *
   * @remarks
   * - Used for decoding stored encrypted data and IVs
   * - Inverse operation: {@link arrayBufferToBase64}
   * - Required before decryption operations
   */ base64ToArrayBuffer(base64) {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for(let i = 0; i < binary.length; i++){
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes.buffer;
    }
}
const encryptionManager = new EncryptionManager();
}),
"[project]/src/identity-access/utils/tokenSecurity.storage.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @fileoverview Token Storage Management
 * @module identity-access/utils/tokenSecurity.storage
 *
 * Provides secure token storage operations with encryption, expiration tracking, and
 * legacy migration support. Manages the complete lifecycle of authentication token
 * storage in localStorage with AES-GCM encryption.
 *
 * Security Considerations:
 * - Tokens are encrypted before storage using AES-GCM
 * - Expiration timestamps prevent use of stale tokens
 * - Automatic expiration checking on retrieval
 * - Legacy key cleanup on new token storage
 * - Falls back to unencrypted storage if encryption unavailable
 * - Consider httpOnly cookies for production environments
 *
 * Architecture Notes:
 * - Singleton pattern via exported `tokenSecurityManager` instance
 * - Depends on EncryptionManager for encryption operations
 * - Provides both synchronous (clearToken) and async operations
 * - Supports graceful migration from legacy storage formats
 *
 * @see {@link encryptionManager} for encryption implementation
 * @see {@link TokenData} for token data structure
 *
 * @since 2025-11-04
 */ __turbopack_context__.s([
    "TokenSecurityManager",
    ()=>TokenSecurityManager,
    "tokenSecurityManager",
    ()=>tokenSecurityManager
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$utils$2f$tokenSecurity$2e$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/identity-access/utils/tokenSecurity.types.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$utils$2f$tokenSecurity$2e$encryption$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/identity-access/utils/tokenSecurity.encryption.ts [app-rsc] (ecmascript)");
;
;
class TokenSecurityManager {
    /**
   * Initializes the token security manager.
   *
   * Must be called before performing any token operations. Initializes the
   * underlying encryption manager for secure storage.
   *
   * @async
   * @returns {Promise<void>} Resolves when initialization completes
   *
   * @example
   * ```typescript
   * const manager = new TokenSecurityManager();
   * await manager.init();
   * // Manager is now ready for token operations
   * ```
   *
   * @remarks
   * - Should be called once during application initialization
   * - Safe to call multiple times (idempotent)
   * - Initializes encryption subsystem
   * - No-op if encryption unavailable (falls back to unencrypted storage)
   *
   * @see {@link EncryptionManager.init} for encryption initialization details
   */ async init() {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$utils$2f$tokenSecurity$2e$encryption$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["encryptionManager"].init();
    }
    /**
   * Stores authentication token with encryption and expiration metadata.
   *
   * Encrypts the token and user data before storing in localStorage. Includes
   * expiration timestamp for automatic validation on retrieval. Clears legacy
   * storage keys if present.
   *
   * @async
   * @param {string} token - JWT authentication token to store
   * @param {User} user - User object associated with the token
   * @param {number} [expiresIn=24h] - Token lifetime in milliseconds (defaults to 24 hours)
   * @returns {Promise<void>} Resolves when storage completes
   *
   * @throws {Error} If token storage fails (encryption error, localStorage full, etc.)
   *
   * @example
   * ```typescript
   * // Store token with default 24-hour expiration
   * await tokenSecurityManager.storeToken(
   *   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
   *   { id: '123', email: 'nurse@example.com', role: 'NURSE' }
   * );
   *
   * // Store token with custom expiration (1 hour)
   * await tokenSecurityManager.storeToken(
   *   token,
   *   user,
   *   60 * 60 * 1000
   * );
   * ```
   *
   * @remarks
   * Security Features:
   * - Encrypts token and user data using AES-GCM
   * - Stores issued and expiration timestamps
   * - Falls back to unencrypted storage if encryption unavailable
   * - Logs error but throws if storage fails
   *
   * Storage Structure:
   * - Stores encrypted TokenData in localStorage
   * - Uses key from TOKEN_SECURITY_CONFIG.STORAGE_KEY
   * - Includes timestamp, IV, and encrypted payload
   *
   * @see {@link getValidToken} for retrieving stored tokens
   * @see {@link TokenData} for stored data structure
   */ async storeToken(token, user, expiresIn = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$utils$2f$tokenSecurity$2e$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TOKEN_SECURITY_CONFIG"].DEFAULT_TOKEN_LIFETIME) {
        const now = Date.now();
        const tokenData = {
            token,
            user,
            expiresAt: now + expiresIn,
            issuedAt: now
        };
        try {
            if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$utils$2f$tokenSecurity$2e$encryption$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["encryptionManager"].isEncryptionAvailable()) {
                const encrypted = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$utils$2f$tokenSecurity$2e$encryption$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["encryptionManager"].encryptData(JSON.stringify(tokenData));
                localStorage.setItem(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$utils$2f$tokenSecurity$2e$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TOKEN_SECURITY_CONFIG"].STORAGE_KEY, JSON.stringify(encrypted));
            } else {
                // Fallback to unencrypted storage
                localStorage.setItem(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$utils$2f$tokenSecurity$2e$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TOKEN_SECURITY_CONFIG"].STORAGE_KEY, JSON.stringify(tokenData));
            }
        } catch (error) {
            console.error('Failed to store encrypted token:', error);
            throw new Error('Token storage failed');
        }
    }
    /**
   * Retrieves and validates stored token.
   *
   * Retrieves the token from localStorage, decrypts it if encrypted, and validates
   * expiration. Returns null if token is expired, invalid, or not found. Logs
   * warning if token is close to expiring (within 5-minute buffer).
   *
   * @async
   * @returns {Promise<TokenData | null>} Token data if valid, null if expired/invalid/missing
   *
   * @example
   * ```typescript
   * const tokenData = await tokenSecurityManager.getValidToken();
   *
   * if (tokenData) {
   *   // Token is valid, use it
   *   const response = await fetch('/api/protected', {
   *     headers: {
   *       'Authorization': `Bearer ${tokenData.token}`
   *     }
   *   });
   * } else {
   *   // Token is expired or missing, redirect to login
   *   router.push('/login');
   * }
   * ```
   *
   * @remarks
   * Validation Logic:
   * - Returns null if no token stored
   * - Attempts decryption if encrypted
   * - Falls back to unencrypted parsing if decryption fails
   * - Validates expiration timestamp
   * - Clears token if expired
   * - Warns if token expiring within 5-minute buffer
   *
   * Expiration Handling:
   * - Expired tokens are automatically cleared
   * - Tokens expiring soon (< 5 min) log warning
   * - Use warning to trigger token refresh
   *
   * Error Handling:
   * - Logs errors and clears invalid tokens
   * - Returns null on any error (graceful degradation)
   * - Handles both encrypted and unencrypted fallback
   *
   * @see {@link storeToken} for storing tokens
   * @see {@link isTokenValid} for simple validation check
   * @see {@link TOKEN_SECURITY_CONFIG.TOKEN_EXPIRY_BUFFER} for expiry buffer duration
   */ async getValidToken() {
        try {
            const storedData = localStorage.getItem(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$utils$2f$tokenSecurity$2e$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TOKEN_SECURITY_CONFIG"].STORAGE_KEY);
            if (!storedData) return null;
            let tokenData;
            if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$utils$2f$tokenSecurity$2e$encryption$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["encryptionManager"].isEncryptionAvailable()) {
                try {
                    const encryptedData = JSON.parse(storedData);
                    const decryptedString = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$utils$2f$tokenSecurity$2e$encryption$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["encryptionManager"].decryptData(encryptedData);
                    tokenData = JSON.parse(decryptedString);
                } catch (decryptError) {
                    console.warn('Failed to decrypt token, attempting fallback:', decryptError);
                    // Try to parse as unencrypted data
                    tokenData = JSON.parse(storedData);
                }
            } else {
                tokenData = JSON.parse(storedData);
            }
            // Validate token expiration
            const now = Date.now();
            if (tokenData.expiresAt && tokenData.expiresAt < now) {
                this.clearToken();
                return null;
            }
            // Check if token is close to expiring (within buffer time)
            if (tokenData.expiresAt && tokenData.expiresAt - now < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$utils$2f$tokenSecurity$2e$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TOKEN_SECURITY_CONFIG"].TOKEN_EXPIRY_BUFFER) {
                console.warn('Token is close to expiring');
            // Could trigger refresh here
            }
            return tokenData;
        } catch (error) {
            console.error('Failed to retrieve token:', error);
            this.clearToken();
            return null;
        }
    }
    /**
   * Checks if current token is valid without retrieving full data.
   *
   * Convenience method to check token validity without retrieving the full
   * token data object. More efficient than calling getValidToken() when you
   * only need to know if a valid token exists.
   *
   * @async
   * @returns {Promise<boolean>} True if valid token exists, false otherwise
   *
   * @example
   * ```typescript
   * if (await tokenSecurityManager.isTokenValid()) {
   *   // User is authenticated, proceed
   *   renderDashboard();
   * } else {
   *   // User not authenticated, redirect
   *   redirectToLogin();
   * }
   * ```
   *
   * @remarks
   * - Internally calls {@link getValidToken} and checks for null
   * - Performs full validation including expiration checking
   * - Does not return the token data (more secure for simple checks)
   * - Use when you only need authentication status, not token details
   *
   * @see {@link getValidToken} for retrieving token data
   */ async isTokenValid() {
        const tokenData = await this.getValidToken();
        return tokenData !== null;
    }
    /**
   * Gets the current authenticated user from stored token.
   *
   * Retrieves the user object from the stored token data. Returns null if
   * token is expired, invalid, or not found.
   *
   * @async
   * @returns {Promise<User | null>} User object if token valid, null otherwise
   *
   * @example
   * ```typescript
   * const user = await tokenSecurityManager.getCurrentUser();
   *
   * if (user) {
   *   console.log(`Welcome, ${user.email}!`);
   *   console.log(`Role: ${user.role}`);
   * } else {
   *   console.log('No authenticated user');
   * }
   * ```
   *
   * @remarks
   * - Performs full token validation before returning user
   * - Returns null if token is expired
   * - Use when you need user details for authenticated requests
   * - More efficient than getValidToken() if you only need user data
   *
   * @see {@link getValidToken} for full token data
   * @see {@link isTokenValid} for authentication check only
   */ async getCurrentUser() {
        const tokenData = await this.getValidToken();
        return tokenData?.user || null;
    }
    /**
   * Clears all stored authentication data.
   *
   * Removes the current token and clears all legacy storage keys for backward
   * compatibility. Should be called on logout or when token becomes invalid.
   *
   * @returns {void}
   *
   * @example
   * ```typescript
   * // On user logout
   * tokenSecurityManager.clearToken();
   * router.push('/login');
   * ```
   *
   * @example
   * ```typescript
   * // After detecting invalid token
   * const tokenData = await tokenSecurityManager.getValidToken();
   * if (!tokenData) {
   *   tokenSecurityManager.clearToken();
   *   showSessionExpiredMessage();
   * }
   * ```
   *
   * @remarks
   * Security Features:
   * - Clears primary storage key
   * - Clears all legacy storage keys
   * - Synchronous operation (no await needed)
   * - Safe to call multiple times (idempotent)
   *
   * Cleared Keys:
   * - Primary: 'auth_data'
   * - Legacy: 'auth_token', 'token', 'authToken', 'user'
   *
   * Best Practices:
   * - Always call on logout
   * - Call when detecting expired tokens
   * - Call before redirecting to login
   * - Consider clearing other app state simultaneously
   *
   * @see {@link TOKEN_SECURITY_CONFIG.LEGACY_TOKEN_KEYS} for legacy keys
   */ clearToken() {
        localStorage.removeItem(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$utils$2f$tokenSecurity$2e$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TOKEN_SECURITY_CONFIG"].STORAGE_KEY);
        // Clear legacy storage keys for backward compatibility
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$utils$2f$tokenSecurity$2e$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TOKEN_SECURITY_CONFIG"].LEGACY_TOKEN_KEYS.forEach((key)=>{
            localStorage.removeItem(key);
        });
        localStorage.removeItem(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$identity$2d$access$2f$utils$2f$tokenSecurity$2e$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TOKEN_SECURITY_CONFIG"].LEGACY_USER_KEY);
    }
    /**
   * Updates user data in stored token while preserving token and expiration.
   *
   * Updates only the user object in the stored token data, keeping the token
   * string and expiration unchanged. Useful when user profile is updated but
   * token remains valid.
   *
   * @async
   * @param {User} user - Updated user object
   * @returns {Promise<void>} Resolves when update completes
   *
   * @throws {Error} If token storage fails during update
   *
   * @example
   * ```typescript
   * // After user profile update
   * const updatedUser = { ...currentUser, name: 'New Name' };
   * await tokenSecurityManager.updateUser(updatedUser);
   * ```
   *
   * @remarks
   * Use Cases:
   * - User profile updated on server
   * - Role or permissions changed
   * - User preferences updated
   * - Any user metadata change while token stays valid
   *
   * Behavior:
   * - Retrieves current token data
   * - Replaces user object only
   * - Preserves token string and expiration
   * - Re-encrypts and stores updated data
   * - No-op if no valid token exists
   *
   * Important Notes:
   * - Does not update the actual JWT token
   * - Only updates the cached user object
   * - Token expiration remains unchanged
   * - Silently fails if no token exists
   *
   * @see {@link storeToken} for full token storage
   * @see {@link getCurrentUser} for retrieving user data
   */ async updateUser(user) {
        const tokenData = await this.getValidToken();
        if (tokenData) {
            tokenData.user = user;
            await this.storeToken(tokenData.token, user, tokenData.expiresAt - Date.now());
        }
    }
    /**
   * Gets the raw JWT token string if available and valid.
   *
   * Retrieves only the token string without other metadata. Returns null if
   * token is expired, invalid, or not found.
   *
   * @async
   * @returns {Promise<string | null>} JWT token string or null
   *
   * @example
   * ```typescript
   * const token = await tokenSecurityManager.getToken();
   *
   * if (token) {
   *   // Add token to request headers
   *   const headers = {
   *     'Authorization': `Bearer ${token}`
   *   };
   * }
   * ```
   *
   * @remarks
   * - Performs full validation before returning token
   * - Returns null if token expired
   * - Use for authenticated API requests
   * - More efficient than getValidToken() if you only need token string
   *
   * @see {@link getValidToken} for full token data
   * @see {@link getCurrentUser} for user data only
   */ async getToken() {
        const tokenData = await this.getValidToken();
        return tokenData?.token || null;
    }
    /**
   * Gets token expiration timestamp.
   *
   * Retrieves the expiration timestamp from stored token data. Useful for
   * displaying countdown timers or determining when to refresh token.
   *
   * @async
   * @returns {Promise<number | null>} Unix timestamp (ms) of expiration, or null if no valid token
   *
   * @example
   * ```typescript
   * const expiresAt = await tokenSecurityManager.getTokenExpiration();
   *
   * if (expiresAt) {
   *   const timeRemaining = expiresAt - Date.now();
   *   const minutesRemaining = Math.floor(timeRemaining / 60000);
   *   console.log(`Token expires in ${minutesRemaining} minutes`);
   *
   *   // Refresh if less than 5 minutes remaining
   *   if (minutesRemaining < 5) {
   *     await refreshToken();
   *   }
   * }
   * ```
   *
   * @remarks
   * - Performs full validation before returning expiration
   * - Returns null if token expired or invalid
   * - Timestamp is in milliseconds (use Date.now() for comparison)
   * - Useful for implementing session timers
   * - Can be used to trigger proactive token refresh
   *
   * @see {@link getValidToken} for full token data
   * @see {@link isTokenValid} for simple validity check
   * @see {@link TOKEN_SECURITY_CONFIG.TOKEN_EXPIRY_BUFFER} for expiry buffer
   */ async getTokenExpiration() {
        const tokenData = await this.getValidToken();
        return tokenData?.expiresAt || null;
    }
}
const tokenSecurityManager = new TokenSecurityManager();
}),
];

//# sourceMappingURL=src_identity-access_utils_9d97ada2._.js.map