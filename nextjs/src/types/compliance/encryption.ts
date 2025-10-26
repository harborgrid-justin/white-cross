/**
 * Encryption UI Types
 *
 * Types for encryption status indicators, key management dashboard,
 * and end-to-end encryption user interfaces. Critical for HIPAA security requirements.
 *
 * @module types/compliance/encryption
 * @category Compliance
 */

import { z } from 'zod';
import type { BaseAuditEntity, ApiResponse } from '../common';

// ============================================================================
// ENUMS AND CONSTANTS
// ============================================================================

/**
 * Encryption algorithm types
 *
 * Approved encryption algorithms for PHI protection.
 */
export enum EncryptionAlgorithm {
  /** AES-256-GCM (recommended) */
  AES_256_GCM = 'AES_256_GCM',
  /** AES-256-CBC */
  AES_256_CBC = 'AES_256_CBC',
  /** RSA-4096 for key exchange */
  RSA_4096 = 'RSA_4096',
  /** ChaCha20-Poly1305 */
  CHACHA20_POLY1305 = 'CHACHA20_POLY1305',
}

/**
 * Encryption level classification
 */
export enum EncryptionLevel {
  /** At-rest encryption only */
  AT_REST = 'AT_REST',
  /** In-transit encryption only */
  IN_TRANSIT = 'IN_TRANSIT',
  /** Both at-rest and in-transit */
  FULL = 'FULL',
  /** End-to-end encryption */
  END_TO_END = 'END_TO_END',
}

/**
 * Encryption key status
 */
export enum KeyStatus {
  /** Key is active and can be used */
  ACTIVE = 'ACTIVE',
  /** Key is pending activation */
  PENDING = 'PENDING',
  /** Key is scheduled for rotation */
  ROTATING = 'ROTATING',
  /** Key has expired */
  EXPIRED = 'EXPIRED',
  /** Key has been revoked */
  REVOKED = 'REVOKED',
  /** Key is archived (backup only) */
  ARCHIVED = 'ARCHIVED',
}

/**
 * Key type classification
 */
export enum KeyType {
  /** Master encryption key */
  MASTER = 'MASTER',
  /** Data encryption key */
  DATA = 'DATA',
  /** Key encryption key */
  KEK = 'KEK',
  /** Session key */
  SESSION = 'SESSION',
}

/**
 * Encryption scope
 */
export enum EncryptionScope {
  /** System-wide encryption */
  SYSTEM = 'SYSTEM',
  /** Database encryption */
  DATABASE = 'DATABASE',
  /** File storage encryption */
  FILE_STORAGE = 'FILE_STORAGE',
  /** Communication encryption */
  COMMUNICATION = 'COMMUNICATION',
  /** Backup encryption */
  BACKUP = 'BACKUP',
}

// ============================================================================
// DOMAIN MODEL INTERFACES
// ============================================================================

/**
 * Encryption configuration entity
 *
 * System encryption configuration and settings.
 *
 * @property {EncryptionAlgorithm} algorithm - Encryption algorithm in use
 * @property {EncryptionLevel} level - Level of encryption applied
 * @property {EncryptionScope} scope - Scope of encryption
 * @property {boolean} enabled - Whether encryption is enabled
 * @property {number} keyRotationDays - Days between key rotations
 * @property {string} [lastRotation] - ISO timestamp of last key rotation
 * @property {string} [nextRotation] - ISO timestamp of next scheduled rotation
 * @property {Record<string, any>} [settings] - Additional algorithm-specific settings
 */
export interface EncryptionConfig extends BaseAuditEntity {
  algorithm: EncryptionAlgorithm;
  level: EncryptionLevel;
  scope: EncryptionScope;
  enabled: boolean;
  keyRotationDays: number;
  lastRotation?: string | null;
  nextRotation?: string | null;
  settings?: Record<string, any> | null;
}

/**
 * Encryption key metadata
 *
 * Metadata about encryption keys (not the actual key material).
 * Key material is stored in secure key management system.
 *
 * @property {string} keyId - Unique key identifier
 * @property {KeyType} keyType - Type of encryption key
 * @property {KeyStatus} status - Current status of key
 * @property {EncryptionAlgorithm} algorithm - Algorithm this key is used with
 * @property {string} createdAt - ISO timestamp of key creation
 * @property {string} [activatedAt] - ISO timestamp of key activation
 * @property {string} [expiresAt] - ISO timestamp of key expiration
 * @property {string} [revokedAt] - ISO timestamp of key revocation
 * @property {string} [revokedReason] - Reason for key revocation
 * @property {number} version - Key version number
 * @property {string} [parentKeyId] - Parent key ID (for KEKs)
 * @property {string[]} scopes - Scopes this key can be used for
 * @property {boolean} canEncrypt - Whether key can encrypt
 * @property {boolean} canDecrypt - Whether key can decrypt
 */
export interface EncryptionKey extends BaseAuditEntity {
  keyId: string;
  keyType: KeyType;
  status: KeyStatus;
  algorithm: EncryptionAlgorithm;
  activatedAt?: string | null;
  expiresAt?: string | null;
  revokedAt?: string | null;
  revokedReason?: string | null;
  version: number;
  parentKeyId?: string | null;
  scopes: EncryptionScope[];
  canEncrypt: boolean;
  canDecrypt: boolean;
}

/**
 * Encryption status for a specific entity
 *
 * Real-time encryption status for files, records, communications.
 *
 * @property {string} entityId - ID of encrypted entity
 * @property {string} entityType - Type of entity (DOCUMENT, RECORD, MESSAGE, etc.)
 * @property {boolean} isEncrypted - Whether entity is currently encrypted
 * @property {EncryptionAlgorithm} [algorithm] - Algorithm used for encryption
 * @property {string} [keyId] - Key ID used for encryption
 * @property {string} [encryptedAt] - ISO timestamp of encryption
 * @property {string} [encryptedBy] - User who encrypted the entity
 * @property {EncryptionLevel} level - Level of encryption applied
 * @property {string} [checksum] - Integrity checksum
 */
export interface EncryptionStatus {
  entityId: string;
  entityType: string;
  isEncrypted: boolean;
  algorithm?: EncryptionAlgorithm;
  keyId?: string;
  encryptedAt?: string;
  encryptedBy?: string;
  level: EncryptionLevel;
  checksum?: string;
}

/**
 * Key rotation event
 *
 * Record of key rotation activities.
 */
export interface KeyRotationEvent extends BaseAuditEntity {
  oldKeyId: string;
  newKeyId: string;
  scope: EncryptionScope;
  rotationType: 'SCHEDULED' | 'MANUAL' | 'EMERGENCY';
  itemsReencrypted: number;
  completedAt?: string | null;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  errorMessage?: string | null;
}

/**
 * Encryption audit summary
 *
 * Aggregated encryption metrics for compliance reporting.
 */
export interface EncryptionAuditSummary {
  totalEncryptedEntities: number;
  encryptionByType: Record<string, number>;
  encryptionByLevel: Record<EncryptionLevel, number>;
  activeKeys: number;
  expiredKeys: number;
  revokedKeys: number;
  lastKeyRotation: string | null;
  nextKeyRotation: string | null;
  complianceScore: number; // 0-100
  issues: string[];
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

/**
 * Request to create encryption configuration
 */
export interface CreateEncryptionConfigRequest {
  algorithm: EncryptionAlgorithm;
  level: EncryptionLevel;
  scope: EncryptionScope;
  enabled: boolean;
  keyRotationDays: number;
  settings?: Record<string, any>;
}

/**
 * Request to update encryption configuration
 */
export interface UpdateEncryptionConfigRequest {
  algorithm?: EncryptionAlgorithm;
  level?: EncryptionLevel;
  enabled?: boolean;
  keyRotationDays?: number;
  settings?: Record<string, any>;
}

/**
 * Request to create new encryption key
 */
export interface CreateEncryptionKeyRequest {
  keyType: KeyType;
  algorithm: EncryptionAlgorithm;
  scopes: EncryptionScope[];
  expiresAt?: string;
}

/**
 * Request to rotate encryption key
 */
export interface RotateKeyRequest {
  keyId: string;
  scope: EncryptionScope;
  rotationType: 'SCHEDULED' | 'MANUAL' | 'EMERGENCY';
}

/**
 * Request to revoke encryption key
 */
export interface RevokeKeyRequest {
  keyId: string;
  reason: string;
}

/**
 * Encryption status query
 */
export interface EncryptionStatusQuery {
  entityIds?: string[];
  entityType?: string;
  isEncrypted?: boolean;
  scope?: EncryptionScope;
}

/**
 * Response types
 */
export type EncryptionConfigResponse = ApiResponse<EncryptionConfig>;
export type EncryptionConfigsResponse = ApiResponse<EncryptionConfig[]>;
export type EncryptionKeyResponse = ApiResponse<EncryptionKey>;
export type EncryptionKeysResponse = ApiResponse<EncryptionKey[]>;
export type EncryptionStatusResponse = ApiResponse<EncryptionStatus[]>;
export type EncryptionAuditResponse = ApiResponse<EncryptionAuditSummary>;
export type KeyRotationResponse = ApiResponse<KeyRotationEvent>;

// ============================================================================
// FORM VALIDATION SCHEMAS (ZOD)
// ============================================================================

/**
 * Zod schema for encryption configuration
 */
export const CreateEncryptionConfigSchema = z.object({
  algorithm: z.nativeEnum(EncryptionAlgorithm),
  level: z.nativeEnum(EncryptionLevel),
  scope: z.nativeEnum(EncryptionScope),
  enabled: z.boolean(),
  keyRotationDays: z.number().int().min(1).max(365),
  settings: z.record(z.any()).optional(),
});

export const UpdateEncryptionConfigSchema = z.object({
  algorithm: z.nativeEnum(EncryptionAlgorithm).optional(),
  level: z.nativeEnum(EncryptionLevel).optional(),
  enabled: z.boolean().optional(),
  keyRotationDays: z.number().int().min(1).max(365).optional(),
  settings: z.record(z.any()).optional(),
});

/**
 * Zod schema for key creation
 */
export const CreateEncryptionKeySchema = z.object({
  keyType: z.nativeEnum(KeyType),
  algorithm: z.nativeEnum(EncryptionAlgorithm),
  scopes: z.array(z.nativeEnum(EncryptionScope)).min(1),
  expiresAt: z.string().datetime().optional(),
});

/**
 * Zod schema for key rotation
 */
export const RotateKeySchema = z.object({
  keyId: z.string().uuid(),
  scope: z.nativeEnum(EncryptionScope),
  rotationType: z.enum(['SCHEDULED', 'MANUAL', 'EMERGENCY']),
});

/**
 * Zod schema for key revocation
 */
export const RevokeKeySchema = z.object({
  keyId: z.string().uuid(),
  reason: z.string().min(1).max(500),
});

// ============================================================================
// REDUX STATE TYPES
// ============================================================================

/**
 * Encryption Redux slice state
 */
export interface EncryptionState {
  configs: EncryptionConfig[];
  keys: EncryptionKey[];
  statuses: EncryptionStatus[];
  auditSummary: EncryptionAuditSummary | null;
  rotationEvents: KeyRotationEvent[];
  loading: boolean;
  error: string | null;
}

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

/**
 * Props for Encryption Dashboard component
 */
export interface EncryptionDashboardProps {
  onConfigureEncryption?: () => void;
  onRotateKeys?: () => void;
  onViewAudit?: () => void;
}

/**
 * Props for Key Management component
 */
export interface KeyManagementProps {
  keys: EncryptionKey[];
  onCreateKey?: () => void;
  onRotateKey?: (keyId: string) => void;
  onRevokeKey?: (keyId: string) => void;
  onViewDetails?: (keyId: string) => void;
}

/**
 * Props for Encryption Status Indicator component
 */
export interface EncryptionStatusIndicatorProps {
  status: EncryptionStatus;
  showDetails?: boolean;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Props for Encryption Configuration Form
 */
export interface EncryptionConfigFormProps {
  config?: EncryptionConfig | null;
  onSubmit: (data: CreateEncryptionConfigRequest | UpdateEncryptionConfigRequest) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Active encryption key (filtered by status)
 */
export type ActiveEncryptionKey = EncryptionKey & {
  status: KeyStatus.ACTIVE;
};

/**
 * Key with rotation metadata
 */
export type KeyWithRotation = EncryptionKey & {
  daysUntilExpiration: number;
  rotationRequired: boolean;
};

/**
 * Encryption strength score
 */
export type EncryptionStrength = {
  algorithm: EncryptionAlgorithm;
  score: number; // 0-100
  strength: 'WEAK' | 'MODERATE' | 'STRONG' | 'VERY_STRONG';
};

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Check if key is active and can be used
 */
export function isActiveKey(key: EncryptionKey): key is ActiveEncryptionKey {
  return key.status === KeyStatus.ACTIVE;
}

/**
 * Check if key needs rotation
 */
export function needsRotation(key: EncryptionKey, rotationDays: number): boolean {
  if (!key.activatedAt) return false;

  const activatedDate = new Date(key.activatedAt);
  const daysSinceActivation = Math.floor(
    (Date.now() - activatedDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return daysSinceActivation >= rotationDays;
}

/**
 * Check if key is expired
 */
export function isKeyExpired(key: EncryptionKey): boolean {
  if (!key.expiresAt) return false;
  return new Date(key.expiresAt) < new Date();
}

/**
 * Get encryption strength score
 */
export function getEncryptionStrength(algorithm: EncryptionAlgorithm): EncryptionStrength {
  const scores: Record<EncryptionAlgorithm, number> = {
    [EncryptionAlgorithm.AES_256_GCM]: 95,
    [EncryptionAlgorithm.AES_256_CBC]: 85,
    [EncryptionAlgorithm.RSA_4096]: 90,
    [EncryptionAlgorithm.CHACHA20_POLY1305]: 95,
  };

  const score = scores[algorithm];
  const strength =
    score >= 90
      ? 'VERY_STRONG'
      : score >= 80
        ? 'STRONG'
        : score >= 60
          ? 'MODERATE'
          : 'WEAK';

  return { algorithm, score, strength };
}
