/**
 * WF-COMP-354 | tokenSecurity.encryption.ts - Encryption utilities
 * Purpose: Encryption and decryption utilities using Web Crypto API
 * Upstream: tokenSecurity.types | Dependencies: tokenSecurity.types
 * Downstream: tokenSecurity.storage | Called by: Token storage operations
 * Related: tokenSecurity.storage, tokenSecurity.types
 * Exports: EncryptionManager class | Key Features: AES-GCM encryption
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Encryption key generation → Encrypt/decrypt operations
 * LLM Context: Encryption utilities for secure token storage
 */

import { EncryptedTokenData, TOKEN_SECURITY_CONFIG } from './tokenSecurity.types';

/**
 * Manages encryption and decryption operations for token security
 * Uses Web Crypto API with AES-GCM encryption
 * Note: For production, consider using httpOnly cookies for enhanced security
 */
export class EncryptionManager {
  private encryptionKey: CryptoKey | null = null;

  /**
   * Initializes the encryption manager by generating or retrieving the encryption key
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
   * Generates a new AES-GCM encryption key and stores it
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
   * Checks if encryption is available
   */
  isEncryptionAvailable(): boolean {
    return this.encryptionKey !== null;
  }

  /**
   * Encrypts data using AES-GCM
   * @param data - String data to encrypt
   * @returns Encrypted data with IV and timestamp
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
   * Decrypts data using AES-GCM
   * @param encryptedData - Encrypted data structure
   * @returns Decrypted string data
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
   * Converts ArrayBuffer to base64 string
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
   * Converts base64 string to ArrayBuffer
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

// Export singleton instance
export const encryptionManager = new EncryptionManager();
