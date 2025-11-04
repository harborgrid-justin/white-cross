/**
 * Form and Document Encryption Utilities
 *
 * Provides encryption for sensitive form data and documents.
 * Uses AES-256-GCM for strong encryption with authentication.
 *
 * **HIPAA Requirement**: PHI must be encrypted at rest and in transit.
 *
 * @module lib/security/encryption-forms
 * @example
 * ```typescript
 * import { encryptFormData, decryptFormData, generateFormKey } from '@/lib/security/encryption-forms';
 *
 * // Generate encryption key
 * const key = generateFormKey();
 *
 * // Encrypt form data
 * const encrypted = await encryptFormData({
 *   ssn: '123-45-6789',
 *   diagnosis: 'Type 2 Diabetes'
 * }, key);
 *
 * // Decrypt form data
 * const decrypted = await decryptFormData(encrypted, key);
 * ```
 */

/**
 * Encrypted data structure
 */
export interface EncryptedData {
  data: string; // Base64 encoded encrypted data
  iv: string; // Base64 encoded initialization vector
  tag: string; // Base64 encoded authentication tag
  algorithm: string; // Encryption algorithm used
  timestamp: string; // Encryption timestamp
}

/**
 * Encryption options
 */
export interface EncryptionOptions {
  algorithm?: 'AES-GCM'; // Algorithm (currently only AES-GCM supported)
  keySize?: 128 | 192 | 256; // Key size in bits
  additionalData?: string; // Additional authenticated data
}

/**
 * Check if running in browser environment
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.crypto !== 'undefined';
}

/**
 * Get crypto implementation
 *
 * Returns appropriate crypto API based on environment.
 */
function getCrypto(): SubtleCrypto {
  if (isBrowser()) {
    return window.crypto.subtle;
  }

  // Node.js environment
  const { webcrypto } = require('crypto');
  return webcrypto.subtle;
}

/**
 * Get random values
 *
 * @param array - Typed array to fill with random values
 */
function getRandomValues<T extends ArrayBufferView>(array: T): T {
  if (isBrowser()) {
    return window.crypto.getRandomValues(array);
  }

  const { webcrypto } = require('crypto');
  return webcrypto.getRandomValues(array);
}

/**
 * Convert string to Uint8Array
 *
 * @param str - String to convert
 * @returns Uint8Array
 */
function stringToUint8Array(str: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

/**
 * Convert Uint8Array to string
 *
 * @param arr - Uint8Array to convert
 * @returns String
 */
function uint8ArrayToString(arr: Uint8Array): string {
  const decoder = new TextDecoder();
  return decoder.decode(arr);
}

/**
 * Convert Uint8Array to Base64
 *
 * @param arr - Uint8Array to convert
 * @returns Base64 string
 */
function uint8ArrayToBase64(arr: Uint8Array): string {
  if (isBrowser()) {
    // Convert to base64 using Array.from for TypeScript compatibility
    const binaryString = Array.from(arr).map(byte => String.fromCharCode(byte)).join('');
    return btoa(binaryString);
  }

  return Buffer.from(arr).toString('base64');
}

/**
 * Convert Base64 to Uint8Array
 *
 * @param base64 - Base64 string
 * @returns Uint8Array
 */
function base64ToUint8Array(base64: string): Uint8Array {
  if (isBrowser()) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  return new Uint8Array(Buffer.from(base64, 'base64'));
}

/**
 * Generate encryption key
 *
 * Creates a cryptographically secure random key for form encryption.
 * Key should be stored securely (e.g., in environment variables or key management system).
 *
 * @param keySize - Key size in bits (default: 256)
 * @returns Encryption key as Base64 string
 *
 * @example
 * ```typescript
 * const key = generateFormKey();
 * // Store securely in environment or key management system
 * process.env.FORM_ENCRYPTION_KEY = key;
 * ```
 */
export function generateFormKey(keySize: 128 | 192 | 256 = 256): string {
  const keyBytes = keySize / 8;
  const key = new Uint8Array(keyBytes);
  getRandomValues(key);
  return uint8ArrayToBase64(key);
}

/**
 * Import encryption key
 *
 * @param keyBase64 - Base64 encoded key
 * @param algorithm - Algorithm (default: AES-GCM)
 * @returns CryptoKey
 */
async function importKey(
  keyBase64: string,
  algorithm: string = 'AES-GCM'
): Promise<CryptoKey> {
  const keyBytes = base64ToUint8Array(keyBase64);
  const crypto = getCrypto();

  return crypto.importKey(
    'raw',
    keyBytes as BufferSource,
    { name: algorithm },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt form data
 *
 * Encrypts form submission data using AES-256-GCM.
 * Returns encrypted data with IV and authentication tag.
 *
 * **HIPAA Note**: Use this for PHI data before storage.
 *
 * @param data - Form data to encrypt
 * @param keyBase64 - Base64 encoded encryption key
 * @param options - Encryption options
 * @returns Encrypted data object
 *
 * @example
 * ```typescript
 * const formData = {
 *   patientName: 'John Doe',
 *   ssn: '123-45-6789',
 *   diagnosis: 'Hypertension'
 * };
 *
 * const key = process.env.FORM_ENCRYPTION_KEY!;
 * const encrypted = await encryptFormData(formData, key);
 *
 * // Store encrypted data in database
 * await db.formSubmission.create({
 *   data: {
 *     encryptedData: JSON.stringify(encrypted),
 *     // ... other fields
 *   }
 * });
 * ```
 */
export async function encryptFormData(
  data: Record<string, any>,
  keyBase64: string,
  options: EncryptionOptions = {}
): Promise<EncryptedData> {
  try {
    const algorithm = options.algorithm || 'AES-GCM';
    const crypto = getCrypto();

    // Import key
    const key = await importKey(keyBase64, algorithm);

    // Generate IV (12 bytes for GCM)
    const iv = new Uint8Array(12);
    getRandomValues(iv);

    // Serialize data to JSON
    const plaintext = JSON.stringify(data);
    const plaintextBytes = stringToUint8Array(plaintext);

    // Prepare encryption parameters
    const encryptParams: AesGcmParams = {
      name: algorithm,
      iv: iv,
    };

    // Add additional authenticated data if provided
    if (options.additionalData) {
      encryptParams.additionalData = stringToUint8Array(options.additionalData) as BufferSource;
    }

    // Encrypt
    const encryptedBuffer = await crypto.encrypt(
      encryptParams,
      key,
      plaintextBytes as BufferSource
    );

    const encryptedBytes = new Uint8Array(encryptedBuffer);

    // For GCM, the last 16 bytes are the authentication tag
    const ciphertext = encryptedBytes.slice(0, -16);
    const tag = encryptedBytes.slice(-16);

    return {
      data: uint8ArrayToBase64(ciphertext),
      iv: uint8ArrayToBase64(iv),
      tag: uint8ArrayToBase64(tag),
      algorithm,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[Encryption] Failed to encrypt form data:', error);
    throw new Error('Encryption failed');
  }
}

/**
 * Decrypt form data
 *
 * Decrypts form data encrypted with encryptFormData.
 *
 * @param encryptedData - Encrypted data object
 * @param keyBase64 - Base64 encoded encryption key
 * @returns Decrypted form data
 *
 * @example
 * ```typescript
 * // Load from database
 * const submission = await db.formSubmission.findUnique({ where: { id } });
 * const encrypted = JSON.parse(submission.encryptedData);
 *
 * // Decrypt
 * const key = process.env.FORM_ENCRYPTION_KEY!;
 * const formData = await decryptFormData(encrypted, key);
 * ```
 */
export async function decryptFormData(
  encryptedData: EncryptedData,
  keyBase64: string
): Promise<Record<string, any>> {
  try {
    const crypto = getCrypto();

    // Import key
    const key = await importKey(keyBase64, encryptedData.algorithm);

    // Decode encrypted data
    const ciphertext = base64ToUint8Array(encryptedData.data);
    const iv = base64ToUint8Array(encryptedData.iv);
    const tag = base64ToUint8Array(encryptedData.tag);

    // Combine ciphertext and tag for GCM
    const combined = new Uint8Array(ciphertext.length + tag.length);
    combined.set(ciphertext, 0);
    combined.set(tag, ciphertext.length);

    // Decrypt
    const decryptedBuffer = await crypto.decrypt(
      {
        name: encryptedData.algorithm,
        iv: iv as BufferSource,
      },
      key,
      combined as BufferSource
    );

    const decryptedBytes = new Uint8Array(decryptedBuffer);
    const plaintext = uint8ArrayToString(decryptedBytes);

    // Parse JSON
    return JSON.parse(plaintext);
  } catch (error) {
    console.error('[Encryption] Failed to decrypt form data:', error);
    throw new Error('Decryption failed');
  }
}

/**
 * Encrypt document buffer
 *
 * Encrypts document data (PDF, images, etc.) as ArrayBuffer.
 *
 * @param buffer - Document data as ArrayBuffer
 * @param keyBase64 - Base64 encoded encryption key
 * @returns Encrypted data
 *
 * @example
 * ```typescript
 * // Encrypt uploaded file
 * const file = await request.formData().get('document') as File;
 * const buffer = await file.arrayBuffer();
 *
 * const key = process.env.DOCUMENT_ENCRYPTION_KEY!;
 * const encrypted = await encryptDocument(buffer, key);
 *
 * // Store encrypted document
 * await storage.put(`documents/${id}`, encrypted);
 * ```
 */
export async function encryptDocument(
  buffer: ArrayBuffer,
  keyBase64: string
): Promise<EncryptedData> {
  try {
    const crypto = getCrypto();

    // Import key
    const key = await importKey(keyBase64, 'AES-GCM');

    // Generate IV
    const iv = new Uint8Array(12);
    getRandomValues(iv);

    // Encrypt
    const encryptedBuffer = await crypto.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      buffer
    );

    const encryptedBytes = new Uint8Array(encryptedBuffer);

    // Extract tag
    const ciphertext = encryptedBytes.slice(0, -16);
    const tag = encryptedBytes.slice(-16);

    return {
      data: uint8ArrayToBase64(ciphertext),
      iv: uint8ArrayToBase64(iv),
      tag: uint8ArrayToBase64(tag),
      algorithm: 'AES-GCM',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[Encryption] Failed to encrypt document:', error);
    throw new Error('Document encryption failed');
  }
}

/**
 * Decrypt document buffer
 *
 * Decrypts document data encrypted with encryptDocument.
 *
 * @param encryptedData - Encrypted data object
 * @param keyBase64 - Base64 encoded encryption key
 * @returns Decrypted document as ArrayBuffer
 *
 * @example
 * ```typescript
 * // Load encrypted document
 * const encrypted = await storage.get(`documents/${id}`);
 *
 * // Decrypt
 * const key = process.env.DOCUMENT_ENCRYPTION_KEY!;
 * const buffer = await decryptDocument(encrypted, key);
 *
 * // Send to client
 * return new Response(buffer, {
 *   headers: { 'Content-Type': 'application/pdf' }
 * });
 * ```
 */
export async function decryptDocument(
  encryptedData: EncryptedData,
  keyBase64: string
): Promise<ArrayBuffer> {
  try {
    const crypto = getCrypto();

    // Import key
    const key = await importKey(keyBase64, encryptedData.algorithm);

    // Decode encrypted data
    const ciphertext = base64ToUint8Array(encryptedData.data);
    const iv = base64ToUint8Array(encryptedData.iv);
    const tag = base64ToUint8Array(encryptedData.tag);

    // Combine ciphertext and tag
    const combined = new Uint8Array(ciphertext.length + tag.length);
    combined.set(ciphertext, 0);
    combined.set(tag, ciphertext.length);

    // Decrypt
    const decryptedBuffer = await crypto.decrypt(
      {
        name: encryptedData.algorithm,
        iv: iv as BufferSource,
      },
      key,
      combined as BufferSource
    );

    return decryptedBuffer;
  } catch (error) {
    console.error('[Encryption] Failed to decrypt document:', error);
    throw new Error('Document decryption failed');
  }
}

/**
 * Generate user-specific encryption key
 *
 * Derives a key from a master key and user ID for user-specific encryption.
 *
 * @param masterKey - Master encryption key
 * @param userId - User ID
 * @returns User-specific key
 *
 * @example
 * ```typescript
 * const masterKey = process.env.MASTER_ENCRYPTION_KEY!;
 * const userKey = await generateUserKey(masterKey, userId);
 *
 * // Use for user's PHI data
 * const encrypted = await encryptFormData(phiData, userKey);
 * ```
 */
export async function generateUserKey(
  masterKey: string,
  userId: string
): Promise<string> {
  try {
    const crypto = getCrypto();

    // Import master key
    const importedKey = await crypto.importKey(
      'raw',
      base64ToUint8Array(masterKey) as BufferSource,
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    // Use userId as salt
    const salt = stringToUint8Array(userId);

    // Derive key
    const derivedKey = await crypto.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt as BufferSource,
        iterations: 100000,
        hash: 'SHA-256',
      },
      importedKey,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    // Export derived key
    const exportedKey = await crypto.exportKey('raw', derivedKey);
    return uint8ArrayToBase64(new Uint8Array(exportedKey));
  } catch (error) {
    console.error('[Encryption] Failed to generate user key:', error);
    throw new Error('User key generation failed');
  }
}

/**
 * Verify encrypted data integrity
 *
 * Checks if encrypted data structure is valid.
 *
 * @param encryptedData - Encrypted data to verify
 * @returns true if data structure is valid
 */
export function verifyEncryptedData(encryptedData: any): encryptedData is EncryptedData {
  return (
    typeof encryptedData === 'object' &&
    encryptedData !== null &&
    typeof encryptedData.data === 'string' &&
    typeof encryptedData.iv === 'string' &&
    typeof encryptedData.tag === 'string' &&
    typeof encryptedData.algorithm === 'string' &&
    typeof encryptedData.timestamp === 'string'
  );
}

/**
 * Encrypt field value
 *
 * Encrypts a single field value (useful for selective field encryption).
 *
 * @param value - Value to encrypt
 * @param keyBase64 - Encryption key
 * @returns Encrypted value string
 *
 * @example
 * ```typescript
 * const encryptedSSN = await encryptFieldValue('123-45-6789', key);
 * // Store in database
 * ```
 */
export async function encryptFieldValue(
  value: any,
  keyBase64: string
): Promise<string> {
  const encrypted = await encryptFormData({ value }, keyBase64);
  return JSON.stringify(encrypted);
}

/**
 * Decrypt field value
 *
 * Decrypts a single field value.
 *
 * @param encryptedValue - Encrypted value string
 * @param keyBase64 - Encryption key
 * @returns Decrypted value
 */
export async function decryptFieldValue(
  encryptedValue: string,
  keyBase64: string
): Promise<any> {
  const encrypted = JSON.parse(encryptedValue) as EncryptedData;
  const decrypted = await decryptFormData(encrypted, keyBase64);
  return decrypted.value;
}
