/**
 * @fileoverview Enhanced Encryption Service
 * @module security/services/encryption
 * @description Provides AES-256-GCM encryption, key derivation, and hashing
 *
 * @version 2.0.0
 * @requires @nestjs/common ^10.x
 * @requires crypto ^18.x
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { EncryptionOptions } from '../interfaces/security.interfaces';

import { BaseService } from '@/common/base';
@Injectable()
export class EnhancedEncryptionService extends BaseService {
  private readonly defaultAlgorithm = 'aes-256-gcm';
  private readonly keyCache = new Map<string, Buffer>();

  constructor(private readonly configService: ConfigService) {}

  /**
   * Encrypts data using AES-256-GCM
   */
  async encrypt(
    data: string | Buffer,
    key: string | Buffer,
    options: EncryptionOptions = {},
  ): Promise<{
    encrypted: Buffer;
    iv: Buffer;
    tag: Buffer;
    salt?: Buffer;
  }> {
    try {
      const algorithm = options.algorithm || this.defaultAlgorithm;
      const dataBuffer = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8');

      // Generate IV
      const iv = crypto.randomBytes(16);

      // Derive key if string provided
      let derivedKey: Buffer;
      let salt: Buffer | undefined;

      if (Buffer.isBuffer(key)) {
        derivedKey = key;
      } else {
        salt = crypto.randomBytes(32);
        derivedKey = await this.deriveKey(key, salt, options);
      }

      // Create cipher
      const cipher = crypto.createCipheriv(algorithm, derivedKey, iv);
      cipher.setAAD(iv); // Set Additional Authenticated Data

      // Encrypt data
      const encrypted = Buffer.concat([cipher.update(dataBuffer), cipher.final()]);

      // Get authentication tag
      const tag = cipher.getAuthTag();

      return {
        encrypted,
        iv,
        tag,
        salt,
      };
    } catch (error) {
      this.logError('Encryption failed:', error);
      throw new Error(
        `Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Decrypts data using AES-256-GCM
   */
  async decrypt(
    encryptedData: {
      encrypted: Buffer;
      iv: Buffer;
      tag: Buffer;
      salt?: Buffer;
    },
    key: string | Buffer,
    options: EncryptionOptions = {},
  ): Promise<Buffer> {
    try {
      const algorithm = options.algorithm || this.defaultAlgorithm;

      // Derive key if string provided
      let derivedKey: Buffer;

      if (Buffer.isBuffer(key)) {
        derivedKey = key;
      } else {
        if (!encryptedData.salt) {
          throw new Error('Salt is required for key derivation');
        }
        derivedKey = await this.deriveKey(key, encryptedData.salt, options);
      }

      // Create decipher
      const decipher = crypto.createDecipheriv(algorithm, derivedKey, encryptedData.iv);
      decipher.setAAD(encryptedData.iv);
      decipher.setAuthTag(encryptedData.tag);

      // Decrypt data
      const decrypted = Buffer.concat([
        decipher.update(encryptedData.encrypted),
        decipher.final(),
      ]);

      return decrypted;
    } catch (error) {
      this.logError('Decryption failed:', error);
      throw new Error(
        `Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Generates a cryptographically secure random key
   */
  generateKey(length: number = 32): Buffer {
    return crypto.randomBytes(length);
  }

  /**
   * Derives key from password using PBKDF2
   */
  private async deriveKey(
    password: string,
    salt: Buffer,
    options: EncryptionOptions = {},
  ): Promise<Buffer> {
    const cacheKey = `${password}:${salt.toString('hex')}`;

    if (this.keyCache.has(cacheKey)) {
      return this.keyCache.get(cacheKey)!;
    }

    const iterations = options.iterations || 100000;
    const keyLength = 32; // 256 bits

    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, iterations, keyLength, 'sha512', (err, derivedKey) => {
        if (err) {
          reject(err);
        } else {
          this.keyCache.set(cacheKey, derivedKey);
          resolve(derivedKey);
        }
      });
    });
  }

  /**
   * Creates a secure hash of data
   */
  hash(data: string | Buffer, algorithm: string = 'sha256'): string {
    const hash = crypto.createHash(algorithm);
    hash.update(data);
    return hash.digest('hex');
  }

  /**
   * Verifies a hash against data
   */
  verifyHash(data: string | Buffer, hash: string, algorithm: string = 'sha256'): boolean {
    const computedHash = this.hash(data, algorithm);
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(computedHash));
  }
}
