/**
 * @fileoverview Encryption Type Definitions
 * @module services/messaging/types/encryption
 * @category Services
 *
 * Type definitions for end-to-end encryption in healthcare messaging,
 * supporting HIPAA-compliant PHI protection.
 *
 * **Key Management:**
 * - Keys are conversation-specific
 * - Public keys are shared, private keys stay on client devices
 * - Key rotation is supported for enhanced security
 * - Server stores public keys only (zero-knowledge architecture)
 *
 * @see {@link module:services/messaging/encryptionApi} for encryption operations
 */

/**
 * Encryption Key Data Transfer Object
 *
 * Represents a public encryption key for end-to-end encrypted conversations.
 * Keys are exchanged between participants to enable secure messaging.
 *
 * **Key Management:**
 * - Keys are conversation-specific
 * - Public keys are shared, private keys stay on client devices
 * - Key rotation is supported for enhanced security
 * - Algorithm specifies encryption method (e.g., RSA-2048, AES-256)
 *
 * **Healthcare Security:**
 * - Keys enable HIPAA-compliant PHI encryption
 * - Key IDs track which key version encrypted each message
 * - Server stores public keys only (zero-knowledge architecture)
 * - Key rotation ensures forward secrecy
 *
 * @interface EncryptionKeyDto
 * @property {string} conversationId - Conversation this key belongs to
 * @property {string} publicKey - Base64-encoded public key
 * @property {string} keyId - Unique key identifier for version tracking
 * @property {string} algorithm - Encryption algorithm (e.g., "RSA-2048", "AES-256-GCM")
 *
 * @example
 * ```typescript
 * const encryptionKey: EncryptionKeyDto = {
 *   conversationId: 'conv-123',
 *   publicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...',
 *   keyId: 'key-v1-abc123',
 *   algorithm: 'RSA-2048'
 * };
 * ```
 *
 * @see {@link module:services/messaging/encryptionApi} for key management operations
 */
export interface EncryptionKeyDto {
  conversationId: string;
  publicKey: string;
  keyId: string;
  algorithm: string;
}
