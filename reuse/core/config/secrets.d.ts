/**
 * @fileoverview Secrets Management Utilities
 * @module core/config/secrets
 *
 * Secure secrets management including encryption, decryption,
 * secret rotation, and integration with secret management services.
 */
/**
 * Secret encryption algorithm
 */
export type EncryptionAlgorithm = 'aes-256-gcm' | 'aes-256-cbc';
/**
 * Secret storage interface
 */
export interface SecretStorage {
    /** Retrieves a secret by key */
    get(key: string): Promise<string | null>;
    /** Stores a secret */
    set(key: string, value: string): Promise<void>;
    /** Deletes a secret */
    delete(key: string): Promise<void>;
    /** Lists all secret keys */
    list(): Promise<string[]>;
}
/**
 * Encrypted secret structure
 */
export interface EncryptedSecret {
    /** Encrypted data */
    encrypted: string;
    /** Initialization vector */
    iv: string;
    /** Authentication tag (for GCM mode) */
    authTag?: string;
    /** Algorithm used */
    algorithm: EncryptionAlgorithm;
}
/**
 * Encrypts a secret value
 *
 * @param value - Secret value to encrypt
 * @param key - Encryption key (32 bytes for AES-256)
 * @param algorithm - Encryption algorithm
 * @returns Encrypted secret object
 *
 * @example
 * ```typescript
 * const key = crypto.randomBytes(32);
 * const encrypted = encryptSecret('my-secret-value', key);
 * ```
 */
export declare function encryptSecret(value: string, key: Buffer, algorithm?: EncryptionAlgorithm): EncryptedSecret;
/**
 * Decrypts an encrypted secret
 *
 * @param encrypted - Encrypted secret object
 * @param key - Decryption key (must match encryption key)
 * @returns Decrypted secret value
 *
 * @example
 * ```typescript
 * const decrypted = decryptSecret(encrypted, key);
 * ```
 */
export declare function decryptSecret(encrypted: EncryptedSecret, key: Buffer): string;
/**
 * Generates a secure random encryption key
 *
 * @param length - Key length in bytes (default: 32 for AES-256)
 * @returns Random encryption key
 */
export declare function generateEncryptionKey(length?: number): Buffer;
/**
 * Creates an in-memory secret storage
 *
 * @returns Secret storage instance
 */
export declare function createMemorySecretStorage(): SecretStorage;
/**
 * Secret manager for handling encrypted secrets
 */
export declare class SecretManager {
    private storage;
    private encryptionKey;
    constructor(storage: SecretStorage, encryptionKey: Buffer);
    /**
     * Stores an encrypted secret
     *
     * @param key - Secret key
     * @param value - Secret value
     * @param algorithm - Encryption algorithm
     */
    setSecret(key: string, value: string, algorithm?: EncryptionAlgorithm): Promise<void>;
    /**
     * Retrieves and decrypts a secret
     *
     * @param key - Secret key
     * @returns Decrypted secret value or null if not found
     */
    getSecret(key: string): Promise<string | null>;
    /**
     * Deletes a secret
     *
     * @param key - Secret key
     */
    deleteSecret(key: string): Promise<void>;
    /**
     * Lists all secret keys
     *
     * @returns Array of secret keys
     */
    listSecrets(): Promise<string[]>;
    /**
     * Rotates encryption key by re-encrypting all secrets
     *
     * @param newKey - New encryption key
     */
    rotateKey(newKey: Buffer): Promise<void>;
    /**
     * Checks if a secret exists
     *
     * @param key - Secret key
     * @returns True if secret exists
     */
    hasSecret(key: string): Promise<boolean>;
}
/**
 * Creates a secret manager instance
 *
 * @param storage - Secret storage implementation
 * @param encryptionKey - Encryption key (will be generated if not provided)
 * @returns Secret manager instance
 *
 * @example
 * ```typescript
 * const manager = createSecretManager(createMemorySecretStorage());
 * await manager.setSecret('api-key', 'my-secret-api-key');
 * const apiKey = await manager.getSecret('api-key');
 * ```
 */
export declare function createSecretManager(storage: SecretStorage, encryptionKey?: Buffer): SecretManager;
/**
 * Hashes a secret value (one-way)
 *
 * @param value - Value to hash
 * @param algorithm - Hash algorithm
 * @returns Hashed value
 */
export declare function hashSecret(value: string, algorithm?: 'sha256' | 'sha512'): string;
/**
 * Compares a value with a hashed secret
 *
 * @param value - Value to compare
 * @param hash - Hashed value
 * @param algorithm - Hash algorithm
 * @returns True if values match
 */
export declare function compareHash(value: string, hash: string, algorithm?: 'sha256' | 'sha512'): boolean;
/**
 * Masks a secret value for display
 *
 * @param value - Secret value
 * @param visibleChars - Number of characters to show at start and end
 * @returns Masked value
 *
 * @example
 * ```typescript
 * maskSecret('my-secret-api-key', 3);
 * // 'my-***-key'
 * ```
 */
export declare function maskSecret(value: string, visibleChars?: number): string;
/**
 * Validates secret strength
 *
 * @param value - Secret value to validate
 * @param options - Validation options
 * @returns Validation result
 */
export declare function validateSecretStrength(value: string, options?: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
}): {
    valid: boolean;
    errors: string[];
};
/**
 * Generates a random secret value
 *
 * @param length - Secret length
 * @param charset - Character set to use
 * @returns Random secret
 */
export declare function generateRandomSecret(length?: number, charset?: string): string;
//# sourceMappingURL=secrets.d.ts.map