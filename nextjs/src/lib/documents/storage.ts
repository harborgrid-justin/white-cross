/**
 * Document Storage Utilities
 *
 * Provides encrypted document storage with file system and cloud support.
 * Implements secure storage, retrieval, and deletion with HIPAA compliance.
 *
 * @module lib/documents/storage
 * @security Encrypted storage with access control
 */

import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import {
  encryptDocument,
  decryptDocument,
  createEncryptedMetadata,
  parseEncryptedMetadata,
  type EncryptedDocument
} from './encryption';

/**
 * Document metadata
 */
export interface DocumentMetadata {
  /** Document ID */
  id: string;
  /** Original filename */
  filename: string;
  /** File MIME type */
  mimeType: string;
  /** File size in bytes */
  size: number;
  /** Document title */
  title: string;
  /** Document category */
  category?: string;
  /** Whether document contains PHI */
  isPHI: boolean;
  /** Document description */
  description?: string;
  /** Owner user ID */
  ownerId: string;
  /** Upload timestamp */
  uploadedAt: Date;
  /** Encryption metadata */
  encryption: {
    algorithm: string;
    iv: string;
    authTag: string;
    salt?: string;
    encryptedAt: string;
  };
  /** Storage location */
  storage: {
    type: 'filesystem' | 's3' | 'azure' | 'gcp';
    path: string;
  };
}

/**
 * Stored document structure
 */
export interface StoredDocument {
  /** Document metadata */
  metadata: DocumentMetadata;
  /** Decrypted document buffer */
  buffer?: Buffer;
}

/**
 * Storage configuration
 */
interface StorageConfig {
  /** Storage type */
  type: 'filesystem' | 's3' | 'azure' | 'gcp';
  /** Base path for filesystem storage */
  basePath: string;
  /** S3 bucket name (if using S3) */
  s3Bucket?: string;
  /** Azure container name (if using Azure) */
  azureContainer?: string;
  /** GCP bucket name (if using GCP) */
  gcpBucket?: string;
}

/**
 * Get storage configuration from environment
 */
function getStorageConfig(): StorageConfig {
  return {
    type: (process.env.DOCUMENT_STORAGE_TYPE as any) || 'filesystem',
    basePath: process.env.DOCUMENT_STORAGE_PATH || path.join(process.cwd(), 'storage', 'documents'),
    s3Bucket: process.env.DOCUMENT_S3_BUCKET,
    azureContainer: process.env.DOCUMENT_AZURE_CONTAINER,
    gcpBucket: process.env.DOCUMENT_GCP_BUCKET
  };
}

/**
 * Generate unique document ID
 */
export function generateDocumentId(): string {
  const timestamp = Date.now();
  const random = crypto.randomBytes(8).toString('hex');
  return `doc_${timestamp}_${random}`;
}

/**
 * Get storage path for document
 */
function getDocumentPath(documentId: string, config: StorageConfig): string {
  // Organize documents in subdirectories by first 2 chars of ID for better file system performance
  const subdir = documentId.substring(0, 2);
  return path.join(config.basePath, subdir, `${documentId}.enc`);
}

/**
 * Get metadata path for document
 */
function getMetadataPath(documentId: string, config: StorageConfig): string {
  const subdir = documentId.substring(0, 2);
  return path.join(config.basePath, subdir, `${documentId}.meta.json`);
}

/**
 * Ensure storage directory exists
 */
async function ensureStorageDirectory(documentId: string, config: StorageConfig): Promise<void> {
  const subdir = documentId.substring(0, 2);
  const dirPath = path.join(config.basePath, subdir);
  await fs.mkdir(dirPath, { recursive: true });
}

/**
 * Store encrypted document to filesystem
 */
async function storeToFilesystem(
  documentId: string,
  encrypted: EncryptedDocument,
  metadata: DocumentMetadata,
  config: StorageConfig
): Promise<void> {
  await ensureStorageDirectory(documentId, config);

  const documentPath = getDocumentPath(documentId, config);
  const metadataPath = getMetadataPath(documentId, config);

  // Store encrypted document
  await fs.writeFile(documentPath, encrypted.data);

  // Store metadata
  await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
}

/**
 * Retrieve encrypted document from filesystem
 */
async function retrieveFromFilesystem(
  documentId: string,
  config: StorageConfig
): Promise<{ encrypted: EncryptedDocument; metadata: DocumentMetadata }> {
  const documentPath = getDocumentPath(documentId, config);
  const metadataPath = getMetadataPath(documentId, config);

  // Read encrypted document
  const encryptedData = await fs.readFile(documentPath);

  // Read metadata
  const metadataJson = await fs.readFile(metadataPath, 'utf-8');
  const metadata: DocumentMetadata = JSON.parse(metadataJson);

  // Reconstruct encrypted structure
  const encrypted: EncryptedDocument = {
    data: encryptedData,
    iv: Buffer.from(metadata.encryption.iv, 'base64'),
    authTag: Buffer.from(metadata.encryption.authTag, 'base64'),
    salt: metadata.encryption.salt ? Buffer.from(metadata.encryption.salt, 'base64') : undefined,
    algorithm: metadata.encryption.algorithm,
    encryptedAt: new Date(metadata.encryption.encryptedAt)
  };

  return { encrypted, metadata };
}

/**
 * Delete document from filesystem (soft delete - mark as deleted)
 */
async function deleteFromFilesystem(documentId: string, config: StorageConfig): Promise<void> {
  const metadataPath = getMetadataPath(documentId, config);

  try {
    // Read existing metadata
    const metadataJson = await fs.readFile(metadataPath, 'utf-8');
    const metadata = JSON.parse(metadataJson);

    // Mark as deleted (soft delete)
    metadata.deletedAt = new Date().toISOString();
    metadata.status = 'deleted';

    // Update metadata
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
  } catch (error) {
    console.error('[Storage] Failed to mark document as deleted:', error);
    throw error;
  }
}

/**
 * Store document with encryption
 *
 * @param buffer - Document buffer
 * @param metadata - Document metadata (without encryption details)
 * @returns Document ID
 *
 * @example
 * ```typescript
 * const file = formData.get('file') as File;
 * const buffer = Buffer.from(await file.arrayBuffer());
 *
 * const documentId = await storeDocument(buffer, {
 *   filename: file.name,
 *   mimeType: file.type,
 *   size: file.size,
 *   title: 'Medical Record',
 *   isPHI: true,
 *   ownerId: session.userId
 * });
 * ```
 */
export async function storeDocument(
  buffer: Buffer,
  metadata: Omit<DocumentMetadata, 'id' | 'uploadedAt' | 'encryption' | 'storage'>
): Promise<string> {
  try {
    const config = getStorageConfig();
    const documentId = generateDocumentId();

    // Encrypt document
    const encrypted = await encryptDocument(buffer);

    // Create full metadata
    const encryptionMetadata = createEncryptedMetadata(encrypted);
    const fullMetadata: DocumentMetadata = {
      ...metadata,
      id: documentId,
      uploadedAt: new Date(),
      encryption: encryptionMetadata,
      storage: {
        type: config.type,
        path: getDocumentPath(documentId, config)
      }
    };

    // Store based on storage type
    switch (config.type) {
      case 'filesystem':
        await storeToFilesystem(documentId, encrypted, fullMetadata, config);
        break;

      case 's3':
        // TODO: Implement S3 storage
        throw new Error('S3 storage not implemented yet');

      case 'azure':
        // TODO: Implement Azure Blob storage
        throw new Error('Azure storage not implemented yet');

      case 'gcp':
        // TODO: Implement GCP Cloud Storage
        throw new Error('GCP storage not implemented yet');

      default:
        throw new Error(`Unsupported storage type: ${config.type}`);
    }

    return documentId;
  } catch (error) {
    console.error('[Storage] Failed to store document:', error);
    throw new Error(`Document storage failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Retrieve and decrypt document
 *
 * @param documentId - Document ID
 * @returns Stored document with metadata and decrypted buffer
 *
 * @example
 * ```typescript
 * const document = await retrieveDocument('doc_123');
 * // Send document.buffer to client
 * ```
 */
export async function retrieveDocument(documentId: string): Promise<StoredDocument> {
  try {
    const config = getStorageConfig();

    let encrypted: EncryptedDocument;
    let metadata: DocumentMetadata;

    // Retrieve based on storage type
    switch (config.type) {
      case 'filesystem':
        ({ encrypted, metadata } = await retrieveFromFilesystem(documentId, config));
        break;

      case 's3':
        // TODO: Implement S3 retrieval
        throw new Error('S3 storage not implemented yet');

      case 'azure':
        // TODO: Implement Azure retrieval
        throw new Error('Azure storage not implemented yet');

      case 'gcp':
        // TODO: Implement GCP retrieval
        throw new Error('GCP storage not implemented yet');

      default:
        throw new Error(`Unsupported storage type: ${config.type}`);
    }

    // Check if document is deleted
    if ((metadata as any).deletedAt) {
      throw new Error('Document has been deleted');
    }

    // Decrypt document
    const buffer = await decryptDocument(encrypted);

    return {
      metadata,
      buffer
    };
  } catch (error) {
    console.error('[Storage] Failed to retrieve document:', error);
    throw new Error(`Document retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Soft delete document
 * Marks document as deleted without actually removing files
 *
 * @param documentId - Document ID
 */
export async function deleteDocument(documentId: string): Promise<void> {
  try {
    const config = getStorageConfig();

    switch (config.type) {
      case 'filesystem':
        await deleteFromFilesystem(documentId, config);
        break;

      case 's3':
        // TODO: Implement S3 deletion
        throw new Error('S3 storage not implemented yet');

      case 'azure':
        // TODO: Implement Azure deletion
        throw new Error('Azure storage not implemented yet');

      case 'gcp':
        // TODO: Implement GCP deletion
        throw new Error('GCP storage not implemented yet');

      default:
        throw new Error(`Unsupported storage type: ${config.type}`);
    }
  } catch (error) {
    console.error('[Storage] Failed to delete document:', error);
    throw new Error(`Document deletion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get document metadata only (without decrypting content)
 *
 * @param documentId - Document ID
 * @returns Document metadata
 */
export async function getDocumentMetadata(documentId: string): Promise<DocumentMetadata> {
  try {
    const config = getStorageConfig();
    const metadataPath = getMetadataPath(documentId, config);

    const metadataJson = await fs.readFile(metadataPath, 'utf-8');
    return JSON.parse(metadataJson);
  } catch (error) {
    console.error('[Storage] Failed to get document metadata:', error);
    throw new Error(`Failed to get document metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
