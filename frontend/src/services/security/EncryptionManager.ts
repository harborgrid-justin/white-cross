/**
 * Encryption Manager
 *
 * Handles data encryption, decryption, and hashing
 */

import type { EncryptionOptions } from './types';

export class EncryptionManager {
  /**
   * Encrypt data using AES-GCM
   */
  async encryptData(data: string, key: string, options: EncryptionOptions = {}): Promise<string> {
    const algorithm = options.algorithm || 'AES-GCM';
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const keyBuffer = await crypto.subtle.importKey(
      'raw',
      encoder.encode(key),
      algorithm,
      false,
      ['encrypt']
    );

    const ivLength = options.ivLength || 12;
    const iv = crypto.getRandomValues(new Uint8Array(ivLength));

    const encrypted = await crypto.subtle.encrypt(
      { name: algorithm, iv },
      keyBuffer,
      dataBuffer
    );

    const encryptedArray = new Uint8Array(encrypted);
    return btoa(String.fromCharCode(...Array.from(iv), ...Array.from(encryptedArray)));
  }

  /**
   * Decrypt data using AES-GCM
   */
  async decryptData(encryptedData: string, key: string, options: EncryptionOptions = {}): Promise<string> {
    const algorithm = options.algorithm || 'AES-GCM';
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const data = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));

    const ivLength = options.ivLength || 12;
    const iv = data.slice(0, ivLength);
    const encrypted = data.slice(ivLength);

    const keyBuffer = await crypto.subtle.importKey(
      'raw',
      encoder.encode(key),
      algorithm,
      false,
      ['decrypt']
    );

    const decrypted = await crypto.subtle.decrypt(
      { name: algorithm, iv },
      keyBuffer,
      encrypted
    );

    return decoder.decode(decrypted);
  }

  /**
   * Hash data using SHA-256
   */
  async hashData(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const hash = await crypto.subtle.digest('SHA-256', encoder.encode(data));
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Generate a cryptographically secure random key
   */
  generateEncryptionKey(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Generate a random IV (Initialization Vector)
   */
  generateIV(length: number = 12): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(length));
  }

  /**
   * Derive a key from password using PBKDF2
   */
  async deriveKeyFromPassword(password: string, salt: Uint8Array, iterations: number = 100000): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt as BufferSource,
        iterations,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Generate a random salt
   */
  generateSalt(length: number = 16): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(length));
  }

  /**
   * Encrypt sensitive form data
   */
  async encryptFormData(formData: FormData, key: string): Promise<string> {
    const data: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value.toString();
    }
    return this.encryptData(JSON.stringify(data), key);
  }

  /**
   * Decrypt form data
   */
  async decryptFormData(encryptedData: string, key: string): Promise<FormData> {
    const decrypted = await this.decryptData(encryptedData, key);
    const data = JSON.parse(decrypted);
    const formData = new FormData();

    for (const [key, value] of Object.entries(data)) {
      formData.append(key, value as string);
    }

    return formData;
  }
}