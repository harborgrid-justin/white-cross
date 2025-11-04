/**
 * Encryption Utilities for HIPAA Compliance
 *
 * Provides client-side encryption for sensitive data
 * before storage. Note: This is not a substitute for
 * proper backend encryption and security.
 *
 * @module lib/security/encryption
 */

/**
 * Encrypt data using AES-GCM
 * Note: This is a simple implementation. In production, use a proper encryption library.
 */
export async function encryptData(data: string, key: string): Promise<string> {
  if (typeof window === 'undefined') return data;

  try {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const keyBuffer = encoder.encode(key.padEnd(32, '0').substring(0, 32));

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      dataBuffer
    );

    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);

    // Convert to base64 using Array.from for TypeScript compatibility
    const binaryString = Array.from(combined).map(byte => String.fromCharCode(byte)).join('');
    return btoa(binaryString);
  } catch (error) {
    console.error('[Encryption] Failed to encrypt:', error);
    return data;
  }
}

/**
 * Decrypt data using AES-GCM
 */
export async function decryptData(encryptedData: string, key: string): Promise<string> {
  if (typeof window === 'undefined') return encryptedData;

  try {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const keyBuffer = encoder.encode(key.padEnd(32, '0').substring(0, 32));

    const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encrypted
    );

    return decoder.decode(decryptedBuffer);
  } catch (error) {
    console.error('[Encryption] Failed to decrypt:', error);
    return '';
  }
}

/**
 * Hash sensitive data for comparison (one-way)
 */
export async function hashData(data: string): Promise<string> {
  if (typeof window === 'undefined') return data;

  try {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    console.error('[Encryption] Failed to hash:', error);
    return '';
  }
}

/**
 * Generate a secure random key
 */
export function generateEncryptionKey(): string {
  if (typeof window === 'undefined') return '';

  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}
