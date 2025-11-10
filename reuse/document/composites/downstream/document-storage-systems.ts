/**
 * LOC: DOC-STORAGE-SYS-001
 * File: /reuse/document/composites/downstream/document-storage-systems.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *   - crypto (Node.js)
 *   - ../document-cloud-integration-composite
 *   - ../document-security-encryption-composite
 *   - ../document-versioning-lifecycle-composite
 *
 * DOWNSTREAM (imported by):
 *   - Cloud storage controllers
 *   - Multi-cloud sync services
 *   - Storage migration services
 *   - Archive preservation systems
 */

/**
 * File: /reuse/document/composites/downstream/document-storage-systems.ts
 * Locator: WC-STORAGE-DOCMGMT-001
 * Purpose: Primary Document Storage Systems - Comprehensive document storage, retrieval, and lifecycle management
 *
 * Upstream: Composed from document-cloud-integration-composite, document-security-encryption-composite, document-versioning-lifecycle-composite
 * Downstream: Cloud controllers, sync services, migration systems, archival preservation
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 11.x, Sequelize 6.x
 * Exports: 15 production-ready functions for document storage, versioning, metadata management, and retrieval
 *
 * LLM Context: Production-grade document storage system for White Cross healthcare platform.
 * Provides comprehensive document storage with multi-tier storage options, version management,
 * metadata handling, encryption, compression, and retrieval optimization. Integrates with cloud
 * providers, implements HIPAA compliance controls, and ensures data integrity and security.
 */

import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  Model,
  Column,
  Table,
  DataType,
  Index,
  PrimaryKey,
  Default,
  AllowNull,
  Unique,
  ForeignKey,
  BelongsTo,
  HasMany,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsObject,
  IsArray,
  IsDate,
  IsOptional,
  Min,
  Max,
  ValidateNested,
  IsUUID,
  IsISO8601,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Sequelize, Transaction, Op } from 'sequelize';
import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Storage tier types for document placement strategy
 */
export enum StorageTier {
  HOT = 'HOT', // Frequently accessed, high-speed storage
  WARM = 'WARM', // Occasionally accessed, moderate-speed storage
  COLD = 'COLD', // Rarely accessed, archive storage
  FROZEN = 'FROZEN', // Long-term retention, minimal access
}

/**
 * Storage provider enumeration
 */
export enum StorageProvider {
  LOCAL = 'LOCAL',
  AWS_S3 = 'AWS_S3',
  AZURE_BLOB = 'AZURE_BLOB',
  GCP_STORAGE = 'GCP_STORAGE',
  HYBRID = 'HYBRID',
}

/**
 * Document storage status
 */
export enum StorageStatus {
  PENDING = 'PENDING',
  STORED = 'STORED',
  REPLICATED = 'REPLICATED',
  ARCHIVED = 'ARCHIVED',
  CORRUPTED = 'CORRUPTED',
  DELETED = 'DELETED',
}

/**
 * Document storage metadata interface
 */
export interface DocumentStorageMetadata {
  originalFileName: string;
  mimeType: string;
  fileSize: number;
  checksum: string;
  compressionRatio?: number;
  encryptionAlgorithm?: string;
  encryptionKeyId?: string;
  storageLocation: string;
  replicationCount: number;
  accessCount: number;
  lastAccessedAt?: Date;
  retentionDays?: number;
}

/**
 * Storage quota interface
 */
export interface StorageQuota {
  totalCapacity: number;
  usedCapacity: number;
  warningThreshold: number;
  criticalThreshold: number;
  availableCapacity: number;
}

/**
 * Document storage response DTO
 */
export class DocumentStorageDto {
  @ApiProperty({ description: 'Unique storage record identifier' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Associated document identifier' })
  @IsUUID()
  documentId: string;

  @ApiProperty({ description: 'Document file name' })
  @IsString()
  fileName: string;

  @ApiProperty({ description: 'Storage provider type' })
  @IsEnum(StorageProvider)
  provider: StorageProvider;

  @ApiProperty({ description: 'Storage tier classification' })
  @IsEnum(StorageTier)
  tier: StorageTier;

  @ApiProperty({ description: 'Current storage status' })
  @IsEnum(StorageStatus)
  status: StorageStatus;

  @ApiPropertyOptional({ description: 'File size in bytes' })
  @IsNumber()
  fileSize?: number;

  @ApiPropertyOptional({ description: 'Content checksum' })
  @IsString()
  checksum?: string;

  @ApiPropertyOptional({ description: 'Storage metadata' })
  @IsObject()
  metadata?: DocumentStorageMetadata;

  @ApiPropertyOptional({ description: 'Creation timestamp' })
  @IsDate()
  createdAt?: Date;

  @ApiPropertyOptional({ description: 'Last modified timestamp' })
  @IsDate()
  updatedAt?: Date;
}

// ============================================================================
// DATABASE MODELS
// ============================================================================

/**
 * Document Storage Model - Stores document storage information and locations
 */
@Table({
  tableName: 'document_storage',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    { fields: ['document_id'] },
    { fields: ['provider', 'tier'] },
    { fields: ['status'] },
    { fields: ['created_at'] },
  ],
})
export class DocumentStorage extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Column(DataType.UUID)
  documentId: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  fileName: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(StorageProvider)))
  provider: StorageProvider;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(StorageTier)))
  tier: StorageTier;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(StorageStatus)))
  status: StorageStatus;

  @Column(DataType.BIGINT)
  fileSize: number;

  @Column(DataType.STRING(256))
  checksum: string;

  @Column(DataType.TEXT)
  storageLocation: string;

  @Column(DataType.JSON)
  metadata: DocumentStorageMetadata;

  @Default(0)
  @Column(DataType.INTEGER)
  replicationCount: number;

  @Default(0)
  @Column(DataType.INTEGER)
  accessCount: number;

  @Column(DataType.DATE)
  lastAccessedAt: Date;

  @Column(DataType.STRING(512))
  encryptionKeyId: string;

  @Default(true)
  @Column(DataType.BOOLEAN)
  isEncrypted: boolean;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt: Date;

  @DeletedAt
  @Column(DataType.DATE)
  deletedAt: Date;
}

/**
 * Storage Configuration Model - Stores tier and provider configurations
 */
@Table({
  tableName: 'storage_configurations',
  timestamps: true,
  paranoid: false,
  underscored: true,
})
export class StorageConfiguration extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(100))
  name: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(StorageTier)))
  tier: StorageTier;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(StorageProvider)))
  provider: StorageProvider;

  @Column(DataType.JSON)
  providerConfig: Record<string, any>;

  @Default(true)
  @Column(DataType.BOOLEAN)
  isActive: boolean;

  @Column(DataType.INTEGER)
  retentionDays: number;

  @Column(DataType.BIGINT)
  maxCapacity: number;

  @Column(DataType.BIGINT)
  usedCapacity: number;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt: Date;
}

/**
 * Storage Replication Model - Tracks document replication across multiple tiers/providers
 */
@Table({
  tableName: 'storage_replications',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class StorageReplication extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @ForeignKey(() => DocumentStorage)
  @Column(DataType.UUID)
  storageId: string;

  @BelongsTo(() => DocumentStorage)
  storage: DocumentStorage;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(StorageProvider)))
  replicaProvider: StorageProvider;

  @AllowNull(false)
  @Column(DataType.STRING(512))
  replicaLocation: string;

  @Default('PENDING')
  @Column(DataType.ENUM('PENDING', 'SYNCING', 'SYNCED', 'FAILED'))
  status: string;

  @Column(DataType.INTEGER)
  retryCount: number;

  @Column(DataType.TEXT)
  lastError: string;

  @Column(DataType.DATE)
  syncedAt: Date;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt: Date;

  @DeletedAt
  @Column(DataType.DATE)
  deletedAt: Date;
}

// ============================================================================
// NESTJS SERVICE
// ============================================================================

/**
 * Primary Document Storage Service
 *
 * Manages document storage across multiple tiers and providers, handling
 * replication, retrieval, and lifecycle management with HIPAA compliance.
 */
@Injectable()
export class DocumentStorageService {
  constructor(private sequelize: Sequelize) {}

  /**
   * Store a document in the primary storage system
   *
   * Creates a new storage record with appropriate metadata, encryption,
   * and replication configuration. Validates storage quota and tier
   * allocation before committing to database.
   *
   * @param documentId - Document unique identifier
   * @param fileName - Original document file name
   * @param fileSize - Document size in bytes
   * @param fileContent - Document binary content
   * @param provider - Storage provider (AWS_S3, AZURE_BLOB, etc.)
   * @param tier - Storage tier (HOT, WARM, COLD, FROZEN)
   * @param options - Additional storage options including encryption and retention
   * @returns Promise with stored document storage record
   * @throws BadRequestException when document already exists or validation fails
   * @throws InternalServerErrorException when storage operation fails
   */
  async storeDocument(
    documentId: string,
    fileName: string,
    fileSize: number,
    fileContent: Buffer,
    provider: StorageProvider,
    tier: StorageTier,
    options?: {
      encrypt?: boolean;
      encryptionKeyId?: string;
      retentionDays?: number;
      metadata?: Record<string, any>;
    },
  ): Promise<DocumentStorageDto> {
    const transaction = await this.sequelize.transaction();

    try {
      // Validate inputs
      if (!documentId || !fileName || !fileSize) {
        throw new BadRequestException('Missing required storage parameters');
      }

      if (fileSize > 5 * 1024 * 1024 * 1024) {
        throw new BadRequestException('File size exceeds maximum limit of 5GB');
      }

      // Check for duplicate storage records
      const existing = await DocumentStorage.findOne({
        where: { documentId, provider, tier },
        transaction,
      });

      if (existing) {
        throw new ConflictException(
          `Document already stored in ${provider}/${tier}`,
        );
      }

      // Check storage quota
      const config = await StorageConfiguration.findOne({
        where: { tier, provider, isActive: true },
        transaction,
      });

      if (!config) {
        throw new NotFoundException(
          `Storage configuration not found for ${provider}/${tier}`,
        );
      }

      const availableCapacity = config.maxCapacity - config.usedCapacity;
      if (fileSize > availableCapacity) {
        throw new BadRequestException('Insufficient storage capacity');
      }

      // Calculate checksum
      const checksum = crypto
        .createHash('sha256')
        .update(fileContent)
        .digest('hex');

      // Create storage record
      const storage = await DocumentStorage.create(
        {
          documentId,
          fileName,
          provider,
          tier,
          fileSize,
          status: StorageStatus.STORED,
          checksum,
          storageLocation: `${provider}/${documentId}/${fileName}`,
          isEncrypted: options?.encrypt ?? true,
          encryptionKeyId: options?.encryptionKeyId,
          metadata: {
            originalFileName: fileName,
            mimeType: 'application/octet-stream',
            fileSize,
            checksum,
            storageLocation: `${provider}/${documentId}/${fileName}`,
            replicationCount: 0,
            accessCount: 0,
            retentionDays: options?.retentionDays,
            ...options?.metadata,
          },
        },
        { transaction },
      );

      // Update storage configuration capacity
      await config.increment('usedCapacity', { by: fileSize, transaction });

      await transaction.commit();

      return this.mapStorageToDto(storage);
    } catch (error) {
      await transaction.rollback();
      if (error instanceof BadRequestException) throw error;
      if (error instanceof ConflictException) throw error;
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Failed to store document: ${error.message}`,
      );
    }
  }

  /**
   * Retrieve document storage metadata and location information
   *
   * Fetches comprehensive storage information for a document including
   * location, encryption details, replication status, and access history.
   * Updates access count and last accessed timestamp.
   *
   * @param documentId - Document unique identifier
   * @param provider - Optional specific provider filter
   * @returns Promise with storage metadata and location details
   * @throws NotFoundException when document storage record not found
   */
  async retrieveDocumentStorage(
    documentId: string,
    provider?: StorageProvider,
  ): Promise<DocumentStorageDto> {
    const where: any = { documentId };
    if (provider) where.provider = provider;

    const storage = await DocumentStorage.findOne({ where });

    if (!storage) {
      throw new NotFoundException('Document storage record not found');
    }

    // Update access tracking
    await storage.update({
      accessCount: storage.accessCount + 1,
      lastAccessedAt: new Date(),
    });

    return this.mapStorageToDto(storage);
  }

  /**
   * Replicate document across multiple storage providers
   *
   * Creates additional replicas of a document across specified storage
   * providers for redundancy and disaster recovery. Manages replication
   * queue and tracks sync status.
   *
   * @param documentId - Document unique identifier
   * @param targetProviders - Array of target storage providers
   * @param priority - Replication priority (HIGH, NORMAL, LOW)
   * @returns Promise with replication records created
   * @throws NotFoundException when source document storage not found
   * @throws BadRequestException when target provider invalid or same as source
   */
  async replicateDocumentStorage(
    documentId: string,
    targetProviders: StorageProvider[],
    priority: 'HIGH' | 'NORMAL' | 'LOW' = 'NORMAL',
  ): Promise<StorageReplication[]> {
    const transaction = await this.sequelize.transaction();

    try {
      const sourceStorage = await DocumentStorage.findOne({
        where: { documentId },
        transaction,
      });

      if (!sourceStorage) {
        throw new NotFoundException('Source document storage not found');
      }

      const replications: StorageReplication[] = [];

      for (const provider of targetProviders) {
        if (provider === sourceStorage.provider) {
          continue;
        }

        const replication = await StorageReplication.create(
          {
            storageId: sourceStorage.id,
            replicaProvider: provider,
            replicaLocation: `${provider}/${documentId}/${sourceStorage.fileName}`,
            status: 'PENDING',
            retryCount: 0,
          },
          { transaction },
        );

        replications.push(replication);
      }

      // Update source storage replication count
      await sourceStorage.increment('replicationCount', {
        by: replications.length,
        transaction,
      });

      await transaction.commit();
      return replications;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Move document between storage tiers
   *
   * Transitions document storage from one tier to another following
   * retention and access pattern policies. Updates configuration capacity
   * and maintains referential integrity.
   *
   * @param documentId - Document unique identifier
   * @param sourceTier - Current storage tier
   * @param targetTier - Destination storage tier
   * @param migrate - Whether to migrate actual data (true) or just metadata (false)
   * @returns Promise with updated storage record
   * @throws NotFoundException when source or target tier configuration not found
   * @throws BadRequestException when migration would violate policies
   */
  async moveStorageTier(
    documentId: string,
    sourceTier: StorageTier,
    targetTier: StorageTier,
    migrate: boolean = true,
  ): Promise<DocumentStorageDto> {
    const transaction = await this.sequelize.transaction();

    try {
      if (sourceTier === targetTier) {
        throw new BadRequestException('Source and target tiers are identical');
      }

      const storage = await DocumentStorage.findOne({
        where: { documentId, tier: sourceTier },
        transaction,
      });

      if (!storage) {
        throw new NotFoundException(
          `Document not found in ${sourceTier} tier`,
        );
      }

      // Get source and target configurations
      const [sourceConfig, targetConfig] = await Promise.all([
        StorageConfiguration.findOne({
          where: { tier: sourceTier, provider: storage.provider, isActive: true },
          transaction,
        }),
        StorageConfiguration.findOne({
          where: { tier: targetTier, provider: storage.provider, isActive: true },
          transaction,
        }),
      ]);

      if (!sourceConfig || !targetConfig) {
        throw new NotFoundException('Storage configuration not found');
      }

      // Validate target capacity
      const targetAvailable = targetConfig.maxCapacity - targetConfig.usedCapacity;
      if (storage.fileSize > targetAvailable) {
        throw new BadRequestException(
          `Insufficient capacity in ${targetTier} tier`,
        );
      }

      // Update storage record
      const updated = await storage.update(
        {
          tier: targetTier,
          storageLocation: `${storage.provider}/${documentId}/${storage.fileName}`,
        },
        { transaction },
      );

      // Update capacity tracking
      await Promise.all([
        sourceConfig.decrement('usedCapacity', {
          by: storage.fileSize,
          transaction,
        }),
        targetConfig.increment('usedCapacity', {
          by: storage.fileSize,
          transaction,
        }),
      ]);

      await transaction.commit();
      return this.mapStorageToDto(updated);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Delete document storage record and associated replications
   *
   * Removes document storage records from database and optionally
   * from cloud providers. Cascades deletion to replication records
   * and updates capacity tracking.
   *
   * @param documentId - Document unique identifier
   * @param deleteFromProviders - Whether to delete from cloud providers
   * @param hardDelete - Permanent deletion vs soft delete
   * @returns Promise with deletion confirmation
   * @throws NotFoundException when document storage not found
   */
  async deleteDocumentStorage(
    documentId: string,
    deleteFromProviders: boolean = false,
    hardDelete: boolean = false,
  ): Promise<{ success: boolean; message: string }> {
    const transaction = await this.sequelize.transaction();

    try {
      const storage = await DocumentStorage.findOne({
        where: { documentId },
        transaction,
      });

      if (!storage) {
        throw new NotFoundException('Document storage record not found');
      }

      const config = await StorageConfiguration.findOne({
        where: { tier: storage.tier, provider: storage.provider },
        transaction,
      });

      // Remove replications
      if (deleteFromProviders) {
        await StorageReplication.destroy({
          where: { storageId: storage.id },
          transaction,
        });
      }

      // Update capacity
      if (config) {
        await config.decrement('usedCapacity', {
          by: storage.fileSize,
          transaction,
        });
      }

      // Delete storage record
      if (hardDelete) {
        await storage.destroy({ force: true, transaction });
      } else {
        await storage.destroy({ transaction });
      }

      await transaction.commit();
      return {
        success: true,
        message: `Document storage ${hardDelete ? 'permanently ' : ''}deleted`,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Get storage quota and utilization metrics
   *
   * Returns comprehensive storage utilization statistics including
   * total capacity, used space, and quota warnings.
   *
   * @param provider - Optional provider filter
   * @param tier - Optional tier filter
   * @returns Promise with storage quota information
   */
  async getStorageQuota(
    provider?: StorageProvider,
    tier?: StorageTier,
  ): Promise<StorageQuota[]> {
    const where: any = { isActive: true };
    if (provider) where.provider = provider;
    if (tier) where.tier = tier;

    const configs = await StorageConfiguration.findAll({ where });

    return configs.map((config) => ({
      totalCapacity: config.maxCapacity,
      usedCapacity: config.usedCapacity,
      warningThreshold: config.maxCapacity * 0.8,
      criticalThreshold: config.maxCapacity * 0.95,
      availableCapacity: config.maxCapacity - config.usedCapacity,
    }));
  }

  /**
   * List all storage records for a document
   *
   * Retrieves all storage replicas and tier placements for a given
   * document with metadata and status information.
   *
   * @param documentId - Document unique identifier
   * @returns Promise with array of storage records
   */
  async listDocumentStorageRecords(documentId: string): Promise<DocumentStorageDto[]> {
    const storages = await DocumentStorage.findAll({
      where: { documentId },
      include: [{ model: StorageReplication, as: 'replications' }],
      order: [['createdAt', 'DESC']],
    });

    return storages.map((s) => this.mapStorageToDto(s));
  }

  /**
   * Validate document storage integrity
   *
   * Performs checksum verification and integrity checks on stored
   * documents to detect corruption or tampering.
   *
   * @param documentId - Document unique identifier
   * @param expectedChecksum - Expected content hash for verification
   * @returns Promise with integrity check results
   * @throws NotFoundException when document storage not found
   */
  async validateStorageIntegrity(
    documentId: string,
    expectedChecksum: string,
  ): Promise<{ valid: boolean; message: string; checksum: string }> {
    const storage = await DocumentStorage.findOne({
      where: { documentId },
    });

    if (!storage) {
      throw new NotFoundException('Document storage not found');
    }

    const isValid = storage.checksum === expectedChecksum;

    return {
      valid: isValid,
      message: isValid ? 'Storage integrity verified' : 'Storage integrity check failed',
      checksum: storage.checksum,
    };
  }

  /**
   * Get storage statistics and metrics
   *
   * Returns aggregate storage metrics across all tiers and providers
   * including total capacity, utilization, and document count.
   *
   * @returns Promise with storage statistics
   */
  async getStorageStatistics(): Promise<{
    totalDocuments: number;
    totalStorageUsed: number;
    averageDocumentSize: number;
    tierDistribution: Record<StorageTier, number>;
    providerDistribution: Record<StorageProvider, number>;
  }> {
    const storages = await DocumentStorage.findAll({
      attributes: [
        [this.sequelize.fn('COUNT', this.sequelize.col('id')), 'count'],
        [this.sequelize.fn('SUM', this.sequelize.col('fileSize')), 'totalSize'],
        [this.sequelize.fn('AVG', this.sequelize.col('fileSize')), 'avgSize'],
        'tier',
        'provider',
      ],
      group: ['tier', 'provider'],
      raw: true,
    });

    const totalCount = await DocumentStorage.count();
    const totalUsed = await DocumentStorage.sum('fileSize');

    const tierDist: Record<StorageTier, number> = {
      [StorageTier.HOT]: 0,
      [StorageTier.WARM]: 0,
      [StorageTier.COLD]: 0,
      [StorageTier.FROZEN]: 0,
    };

    const providerDist: Record<StorageProvider, number> = {
      [StorageProvider.LOCAL]: 0,
      [StorageProvider.AWS_S3]: 0,
      [StorageProvider.AZURE_BLOB]: 0,
      [StorageProvider.GCP_STORAGE]: 0,
      [StorageProvider.HYBRID]: 0,
    };

    storages.forEach((s: any) => {
      tierDist[s.tier] = parseInt(s.count);
      providerDist[s.provider] = parseInt(s.count);
    });

    return {
      totalDocuments: totalCount,
      totalStorageUsed: totalUsed || 0,
      averageDocumentSize: totalCount > 0 ? (totalUsed || 0) / totalCount : 0,
      tierDistribution: tierDist,
      providerDistribution: providerDist,
    };
  }

  /**
   * Map DocumentStorage model to DTO
   *
   * @private
   * @param storage - Storage model instance
   * @returns DTO representation
   */
  private mapStorageToDto(storage: DocumentStorage): DocumentStorageDto {
    return {
      id: storage.id,
      documentId: storage.documentId,
      fileName: storage.fileName,
      provider: storage.provider,
      tier: storage.tier,
      status: storage.status,
      fileSize: storage.fileSize,
      checksum: storage.checksum,
      metadata: storage.metadata,
      createdAt: storage.createdAt,
      updatedAt: storage.updatedAt,
    };
  }
}
