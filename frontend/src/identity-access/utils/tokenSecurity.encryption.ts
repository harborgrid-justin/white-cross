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
 */

import { EncryptedTokenData, TOKEN_SECURITY_CONFIG } from './tokenSecurity.types';

/**
 * Encryption manager for secure token storage operations.
 *
 * Manages AES-GCM encryption and decryption using the Web Crypto API. Handles encryption
 * key generation, storage, and retrieval. Each encryption operation uses a unique
 * initialization vector (IV) for security.
 *
 * @class EncryptionManager
 *
 * @remarks
 * Security Limitations:
 * - localStorage encryption provides protection against casual inspection only
 * - Does NOT protect against XSS attacks that can access localStorage
 * - Encryption key is stored in localStorage, accessible to JavaScript
 * - For production systems, prefer httpOnly cookies for token storage
 *
 * Best Practices:
 * - Always call `init()` before using other methods
 * - Check `isEncryptionAvailable()` before encryption operations
 * - Implement proper Content Security Policy (CSP) to mitigate XSS
 * - Use in conjunction with HTTPS for transport security
 *
 * @example
 * ```typescript
 * // Initialize encryption manager
 * await encryptionManager.init();
 *
 * if (encryptionManager.isEncryptionAvailable()) {
 *   // Encrypt sensitive data
 *   const encrypted = await encryptionManager.encryptData('sensitive-token');
 *
 *   // Store encrypted data
 *   localStorage.setItem('auth', JSON.stringify(encrypted));
 *
 *   // Later, decrypt the data
 *   const stored = JSON.parse(localStorage.getItem('auth'));
 *   const decrypted = await encryptionManager.decryptData(stored);
 * }
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt} SubtleCrypto.encrypt
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/decrypt} SubtleCrypto.decrypt
 */
export class EncryptionManager {
  /**
   * Web Crypto API encryption key for AES-GCM operations.
   * Null until initialization completes successfully.
   *
   * @private
   * @type {CryptoKey | null}
   */
  private encryptionKey: CryptoKey | null = null;

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
   */
  async init(): Promise<void> {
    try {
      const keyData = localStorage.getItem(TOKEN_SECURITY_CONFIG.ENCRYPTION_KEY_NAME);
      if (keyData) {
        const keyBuffer = this.base64ToArrayBuffer(keyData);
        this.encryptionKey = await crypto.subtle.importKey(
          'raw',
          keyBuffer,
          { name: 'AES-GCM' },
          false,
          ['encrypt', 'decrypt']
        );
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
   */
  private async generateNewKey(): Promise<void> {
    this.encryptionKey = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    const keyBuffer = await crypto.subtle.exportKey('raw', this.encryptionKey);
    localStorage.setItem(
      TOKEN_SECURITY_CONFIG.ENCRYPTION_KEY_NAME,
      this.arrayBufferToBase64(keyBuffer)
    );
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
   */
  isEncryptionAvailable(): boolean {
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
   */
  async encryptData(data: string): Promise<EncryptedTokenData> {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not available');
    }

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.encryptionKey,
      encodedData
    );

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
   */
  async decryptData(encryptedData: EncryptedTokenData): Promise<string> {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not available');
    }

    const iv = this.base64ToArrayBuffer(encryptedData.iv);
    const data = this.base64ToArrayBuffer(encryptedData.data);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      this.encryptionKey,
      data
    );

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
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
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
   */
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
}

/**
 * Singleton instance of EncryptionManager.
 *
 * Pre-instantiated encryption manager for application-wide use. Should be
 * initialized with `await encryptionManager.init()` before first use.
 *
 * @constant
 * @type {EncryptionManager}
 *
 * @example
 * ```typescript
 * // Initialize on app startup
 * await encryptionManager.init();
 *
 * // Use throughout the application
 * const encrypted = await encryptionManager.encryptData(data);
 * ```
 *
 * @see {@link EncryptionManager} for class documentation
 */
export const encryptionManager = new EncryptionManager();
