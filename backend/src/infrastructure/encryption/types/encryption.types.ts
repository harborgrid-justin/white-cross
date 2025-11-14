/**
 * @fileoverview Encryption Types
 * @module infrastructure/encryption/types
 * @description Type definitions for encryption functionality
 */

export interface EncryptionConfig {
  algorithm: EncryptionAlgorithm;
  rsaKeySize: number;
  sessionKeyTTL: number;
  enableKeyRotation: boolean;
  keyRotationInterval: number;
  version: string;
  enabled: boolean;
}

export interface EncryptionOptions {
  conversationId?: string;
  keyId?: string;
  aad?: string;
  keyTTL?: number;
  skipCache?: boolean;
}

export interface EncryptionMetadata {
  algorithm: EncryptionAlgorithm;
  iv: string;
  authTag: string;
  keyId: string;
  timestamp: number;
  version: string;
}

export interface EncryptionResult {
  success: boolean;
  data?: string;
  metadata?: EncryptionMetadata;
  error?: EncryptionStatus;
  message?: string;
}

export interface DecryptionResult {
  success: boolean;
  data?: string;
  metadata?: EncryptionMetadata;
  error?: EncryptionStatus;
  message?: string;
}

export interface EncryptedMessage {
  encryptedContent: string;
  metadata: EncryptionMetadata;
  senderId: string;
  recipientIds: string[];
  conversationId: string;
  isEncrypted: boolean;
}

export interface SessionKey {
  id: string;
  key: string; // base64 encoded
  conversationId: string;
  createdAt: number;
  expiresAt: number;
  version: number;
}

export enum EncryptionAlgorithm {
  AES_256_GCM = 'aes-256-gcm',
}

export enum EncryptionStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  INVALID_DATA = 'invalid_data',
  KEY_NOT_FOUND = 'key_not_found',
  DECRYPTION_ERROR = 'decryption_error',
  UNAUTHORIZED = 'unauthorized',
}

export interface IEncryptionService {
  encrypt(data: string, options?: EncryptionOptions): Promise<EncryptionResult>;
  decrypt(encryptedData: string, metadata: EncryptionMetadata, options?: EncryptionOptions): Promise<DecryptionResult>;
  encryptMessage(message: string, senderId: string, recipientIds: string[], conversationId: string): Promise<EncryptedMessage>;
  decryptMessage(encryptedMessage: EncryptedMessage, recipientId: string): Promise<DecryptionResult>;
  getSessionKey(conversationId: string, options?: EncryptionOptions): Promise<SessionKey>;
  rotateSessionKey(conversationId: string): Promise<SessionKey>;
  isEncryptionEnabled(): boolean;
}
