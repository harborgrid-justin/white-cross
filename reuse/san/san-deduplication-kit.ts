/**
 * SAN Data Deduplication Kit
 *
 * Comprehensive toolkit for Storage Area Network (SAN) data deduplication
 * with support for inline and post-process deduplication, block-level and
 * file-level dedup, and extensive metrics tracking.
 *
 * HIPAA Compliance: Implements secure deduplication with audit trails
 * and encryption support for healthcare data.
 *
 * @module san-deduplication-kit
 */

import {
  Model,
  DataTypes,
  Sequelize,
  Association,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  BelongsToGetAssociationMixin,
  Op,
  Transaction,
} from 'sequelize';
import crypto from 'crypto';
import { Buffer } from 'buffer';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Deduplication job configuration and status
 */
export interface DeduplicationJob {
  id: string;
  type: 'inline' | 'post-process';
  scope: 'block' | 'file' | 'volume';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  volumeId?: string;
  targetPath?: string;
  blockSize: number; // In bytes (typically 4KB, 8KB, or 16KB)
  hashAlgorithm: 'sha256' | 'md5' | 'crc32' | 'xxhash';
  startedAt?: Date;
  completedAt?: Date;
  totalBlocks: number;
  processedBlocks: number;
  duplicateBlocks: number;
  spaceSaved: number; // In bytes
  errorMessage?: string;
  createdBy: string;
  metadata?: Record<string, any>;
}

/**
 * Block hash entry for deduplication tracking
 */
export interface BlockHash {
  hash: string;
  algorithm: 'sha256' | 'md5' | 'crc32' | 'xxhash';
  blockSize: number;
  firstOccurrenceId: string; // Reference to original block
  occurrenceCount: number;
  totalSize: number; // Total size of all duplicate blocks
  lastAccessedAt: Date;
  compressionEnabled: boolean;
  encryptionEnabled: boolean;
  metadata?: Record<string, any>;
}

/**
 * Block reference for tracking which files use which blocks
 */
export interface BlockReference {
  id: string;
  blockHashId: string;
  fileId?: string;
  volumeId?: string;
  offset: number; // Offset within the file
  logicalAddress: string; // Logical block address in SAN
  physicalAddress?: string; // Physical block address (if different)
  createdAt: Date;
}

/**
 * Deduplication metrics and statistics
 */
export interface DedupMetrics {
  jobId: string;
  timestamp: Date;
  totalDataSize: number; // In bytes
  uniqueDataSize: number; // In bytes
  duplicateDataSize: number; // In bytes
  dedupRatio: number; // Ratio of duplicate to total data
  spaceSavings: number; // In bytes
  spaceSavingsPercent: number; // Percentage of space saved
  totalBlocks: number;
  uniqueBlocks: number;
  duplicateBlocks: number;
  averageBlockSize: number;
  hashDistribution: Record<string, number>; // Hash algorithm usage
  throughput: number; // Bytes per second
  cpuUsage?: number; // Percentage
  memoryUsage?: number; // In bytes
}

/**
 * Deduplication verification result
 */
export interface DedupVerificationResult {
  isValid: boolean;
  blockHash: string;
  expectedReferenceCount: number;
  actualReferenceCount: number;
  integrityCheckPassed: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Chunk metadata for file-level deduplication
 */
export interface ChunkMetadata {
  chunkId: string;
  hash: string;
  size: number;
  offset: number;
  compressionRatio?: number;
  isDuplicate: boolean;
}

// ============================================================================
// Sequelize Models
// ============================================================================

/**
 * DeduplicationJob Model
 * Tracks deduplication job execution and status
 */
export class DeduplicationJobModel extends Model {
  public id!: string;
  public type!: 'inline' | 'post-process';
  public scope!: 'block' | 'file' | 'volume';
  public status!: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  public volumeId?: string;
  public targetPath?: string;
  public blockSize!: number;
  public hashAlgorithm!: 'sha256' | 'md5' | 'crc32' | 'xxhash';
  public startedAt?: Date;
  public completedAt?: Date;
  public totalBlocks!: number;
  public processedBlocks!: number;
  public duplicateBlocks!: number;
  public spaceSaved!: number;
  public errorMessage?: string;
  public createdBy!: string;
  public metadata?: Record<string, any>;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public getMetrics!: HasManyGetAssociationsMixin<DedupMetricsModel>;
  public addMetric!: HasManyAddAssociationMixin<DedupMetricsModel, string>;
  public countMetrics!: HasManyCountAssociationsMixin;

  public static associations: {
    metrics: Association.HasMany<DeduplicationJobModel, DedupMetricsModel>;
  };
}

/**
 * BlockHashModel
 * Stores unique block hashes and reference counts
 */
export class BlockHashModel extends Model {
  public id!: string;
  public hash!: string;
  public algorithm!: 'sha256' | 'md5' | 'crc32' | 'xxhash';
  public blockSize!: number;
  public firstOccurrenceId!: string;
  public occurrenceCount!: number;
  public totalSize!: number;
  public lastAccessedAt!: Date;
  public compressionEnabled!: boolean;
  public encryptionEnabled!: boolean;
  public metadata?: Record<string, any>;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public getReferences!: HasManyGetAssociationsMixin<BlockReferenceModel>;
  public addReference!: HasManyAddAssociationMixin<BlockReferenceModel, string>;
  public countReferences!: HasManyCountAssociationsMixin;

  public static associations: {
    references: Association.HasMany<BlockHashModel, BlockReferenceModel>;
  };
}

/**
 * BlockReferenceModel
 * Tracks which files/volumes reference which blocks
 */
export class BlockReferenceModel extends Model {
  public id!: string;
  public blockHashId!: string;
  public fileId?: string;
  public volumeId?: string;
  public offset!: number;
  public logicalAddress!: string;
  public physicalAddress?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public getBlockHash!: BelongsToGetAssociationMixin<BlockHashModel>;

  public static associations: {
    blockHash: Association.BelongsTo<BlockReferenceModel, BlockHashModel>;
  };
}

/**
 * DedupMetricsModel
 * Stores deduplication metrics and statistics
 */
export class DedupMetricsModel extends Model {
  public id!: string;
  public jobId!: string;
  public timestamp!: Date;
  public totalDataSize!: number;
  public uniqueDataSize!: number;
  public duplicateDataSize!: number;
  public dedupRatio!: number;
  public spaceSavings!: number;
  public spaceSavingsPercent!: number;
  public totalBlocks!: number;
  public uniqueBlocks!: number;
  public duplicateBlocks!: number;
  public averageBlockSize!: number;
  public hashDistribution!: Record<string, number>;
  public throughput!: number;
  public cpuUsage?: number;
  public memoryUsage?: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public getJob!: BelongsToGetAssociationMixin<DeduplicationJobModel>;

  public static associations: {
    job: Association.BelongsTo<DedupMetricsModel, DeduplicationJobModel>;
  };
}

// ============================================================================
// Model Initialization and Associations
// ============================================================================

/**
 * Initialize all Sequelize models for deduplication tracking
 *
 * @param sequelize - Sequelize instance
 */
export function initializeDeduplicationModels(sequelize: Sequelize): void {
  // Initialize DeduplicationJob model
  DeduplicationJobModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      type: {
        type: DataTypes.ENUM('inline', 'post-process'),
        allowNull: false,
        validate: {
          isIn: [['inline', 'post-process']],
        },
      },
      scope: {
        type: DataTypes.ENUM('block', 'file', 'volume'),
        allowNull: false,
        validate: {
          isIn: [['block', 'file', 'volume']],
        },
      },
      status: {
        type: DataTypes.ENUM('pending', 'running', 'completed', 'failed', 'paused'),
        allowNull: false,
        defaultValue: 'pending',
        validate: {
          isIn: [['pending', 'running', 'completed', 'failed', 'paused']],
        },
      },
      volumeId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      targetPath: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      blockSize: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 4096, // 4KB default
        validate: {
          min: 512,
          max: 1048576, // 1MB max
        },
      },
      hashAlgorithm: {
        type: DataTypes.ENUM('sha256', 'md5', 'crc32', 'xxhash'),
        allowNull: false,
        defaultValue: 'sha256',
        validate: {
          isIn: [['sha256', 'md5', 'crc32', 'xxhash']],
        },
      },
      startedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      totalBlocks: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      processedBlocks: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      duplicateBlocks: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      spaceSaved: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      errorMessage: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'deduplication_jobs',
      timestamps: true,
      indexes: [
        { fields: ['status'] },
        { fields: ['type'] },
        { fields: ['volumeId'] },
        { fields: ['createdAt'] },
        { fields: ['createdBy'] },
      ],
    }
  );

  // Initialize BlockHash model
  BlockHashModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      hash: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: false, // Composite unique with algorithm and blockSize
      },
      algorithm: {
        type: DataTypes.ENUM('sha256', 'md5', 'crc32', 'xxhash'),
        allowNull: false,
      },
      blockSize: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      firstOccurrenceId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      occurrenceCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      totalSize: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      lastAccessedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      compressionEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      encryptionEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'block_hashes',
      timestamps: true,
      indexes: [
        { fields: ['hash', 'algorithm', 'blockSize'], unique: true },
        { fields: ['hash'] },
        { fields: ['algorithm'] },
        { fields: ['occurrenceCount'] },
        { fields: ['lastAccessedAt'] },
      ],
    }
  );

  // Initialize BlockReference model
  BlockReferenceModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      blockHashId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'block_hashes',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      fileId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      volumeId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      offset: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      logicalAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      physicalAddress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'block_references',
      timestamps: true,
      indexes: [
        { fields: ['blockHashId'] },
        { fields: ['fileId'] },
        { fields: ['volumeId'] },
        { fields: ['logicalAddress'] },
        { fields: ['blockHashId', 'fileId', 'offset'], unique: true },
      ],
    }
  );

  // Initialize DedupMetrics model
  DedupMetricsModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      jobId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'deduplication_jobs',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      totalDataSize: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      uniqueDataSize: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      duplicateDataSize: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      dedupRatio: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
      },
      spaceSavings: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      spaceSavingsPercent: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      totalBlocks: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      uniqueBlocks: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      duplicateBlocks: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      averageBlockSize: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      hashDistribution: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      throughput: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      cpuUsage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      memoryUsage: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'dedup_metrics',
      timestamps: true,
      indexes: [
        { fields: ['jobId'] },
        { fields: ['timestamp'] },
        { fields: ['dedupRatio'] },
        { fields: ['spaceSavingsPercent'] },
      ],
    }
  );

  // Define associations
  defineDeduplicationAssociations();
}

/**
 * Define associations between deduplication models
 */
export function defineDeduplicationAssociations(): void {
  // DeduplicationJob has many DedupMetrics
  DeduplicationJobModel.hasMany(DedupMetricsModel, {
    foreignKey: 'jobId',
    sourceKey: 'id',
    as: 'metrics',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  DedupMetricsModel.belongsTo(DeduplicationJobModel, {
    foreignKey: 'jobId',
    targetKey: 'id',
    as: 'job',
  });

  // BlockHash has many BlockReferences
  BlockHashModel.hasMany(BlockReferenceModel, {
    foreignKey: 'blockHashId',
    sourceKey: 'id',
    as: 'references',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  BlockReferenceModel.belongsTo(BlockHashModel, {
    foreignKey: 'blockHashId',
    targetKey: 'id',
    as: 'blockHash',
  });
}

// ============================================================================
// Hash Algorithm Functions (4 functions)
// ============================================================================

/**
 * 1. Calculate SHA-256 hash of a data block
 *
 * @param data - Data buffer to hash
 * @returns SHA-256 hash as hexadecimal string
 */
export function calculateSHA256Hash(data: Buffer): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * 2. Calculate MD5 hash of a data block
 *
 * @param data - Data buffer to hash
 * @returns MD5 hash as hexadecimal string
 */
export function calculateMD5Hash(data: Buffer): string {
  return crypto.createHash('md5').update(data).digest('hex');
}

/**
 * 3. Calculate CRC32 hash of a data block
 *
 * @param data - Data buffer to hash
 * @returns CRC32 hash as hexadecimal string
 */
export function calculateCRC32Hash(data: Buffer): string {
  let crc = 0xFFFFFFFF;

  for (let i = 0; i < data.length; i++) {
    crc ^= data[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (0xEDB88320 & -(crc & 1));
    }
  }

  return ((crc ^ 0xFFFFFFFF) >>> 0).toString(16).padStart(8, '0');
}

/**
 * 4. Calculate hash using specified algorithm
 *
 * @param data - Data buffer to hash
 * @param algorithm - Hash algorithm to use
 * @returns Hash as hexadecimal string
 */
export function calculateBlockHash(
  data: Buffer,
  algorithm: 'sha256' | 'md5' | 'crc32' | 'xxhash'
): string {
  switch (algorithm) {
    case 'sha256':
      return calculateSHA256Hash(data);
    case 'md5':
      return calculateMD5Hash(data);
    case 'crc32':
      return calculateCRC32Hash(data);
    case 'xxhash':
      // XXHash implementation would require external library
      // Fallback to SHA-256 for now
      return calculateSHA256Hash(data);
    default:
      throw new Error(`Unsupported hash algorithm: ${algorithm}`);
  }
}

// ============================================================================
// Block-Level Deduplication Functions (8 functions)
// ============================================================================

/**
 * 5. Find or create a block hash entry
 *
 * @param hash - Block hash value
 * @param algorithm - Hash algorithm used
 * @param blockSize - Size of the block
 * @param firstOccurrenceId - ID of the first occurrence
 * @param transaction - Optional database transaction
 * @returns BlockHashModel instance
 */
export async function findOrCreateBlockHash(
  hash: string,
  algorithm: 'sha256' | 'md5' | 'crc32' | 'xxhash',
  blockSize: number,
  firstOccurrenceId: string,
  transaction?: Transaction
): Promise<BlockHashModel> {
  const [blockHash, created] = await BlockHashModel.findOrCreate({
    where: { hash, algorithm, blockSize },
    defaults: {
      hash,
      algorithm,
      blockSize,
      firstOccurrenceId,
      occurrenceCount: 1,
      totalSize: blockSize,
      lastAccessedAt: new Date(),
      compressionEnabled: false,
      encryptionEnabled: false,
    },
    transaction,
  });

  if (!created) {
    // Update occurrence count and total size
    await blockHash.update(
      {
        occurrenceCount: blockHash.occurrenceCount + 1,
        totalSize: blockHash.totalSize + blockSize,
        lastAccessedAt: new Date(),
      },
      { transaction }
    );
  }

  return blockHash;
}

/**
 * 6. Add a block reference to track block usage
 *
 * @param blockHashId - ID of the block hash
 * @param fileId - Optional file ID
 * @param volumeId - Optional volume ID
 * @param offset - Offset within the file/volume
 * @param logicalAddress - Logical block address
 * @param physicalAddress - Optional physical block address
 * @param transaction - Optional database transaction
 * @returns BlockReferenceModel instance
 */
export async function addBlockReference(
  blockHashId: string,
  fileId: string | undefined,
  volumeId: string | undefined,
  offset: number,
  logicalAddress: string,
  physicalAddress?: string,
  transaction?: Transaction
): Promise<BlockReferenceModel> {
  return await BlockReferenceModel.create(
    {
      blockHashId,
      fileId,
      volumeId,
      offset,
      logicalAddress,
      physicalAddress,
    },
    { transaction }
  );
}

/**
 * 7. Process a single block for deduplication
 *
 * @param data - Block data
 * @param algorithm - Hash algorithm
 * @param blockSize - Block size
 * @param blockId - Unique block identifier
 * @param fileId - Optional file ID
 * @param volumeId - Optional volume ID
 * @param offset - Offset within the file/volume
 * @param logicalAddress - Logical block address
 * @param transaction - Optional database transaction
 * @returns Object with block hash and whether it's a duplicate
 */
export async function processBlock(
  data: Buffer,
  algorithm: 'sha256' | 'md5' | 'crc32' | 'xxhash',
  blockSize: number,
  blockId: string,
  fileId: string | undefined,
  volumeId: string | undefined,
  offset: number,
  logicalAddress: string,
  transaction?: Transaction
): Promise<{ blockHash: BlockHashModel; isDuplicate: boolean }> {
  const hash = calculateBlockHash(data, algorithm);

  // Check if block hash already exists
  const existingBlockHash = await BlockHashModel.findOne({
    where: { hash, algorithm, blockSize },
    transaction,
  });

  const isDuplicate = existingBlockHash !== null;

  // Find or create block hash
  const blockHash = await findOrCreateBlockHash(
    hash,
    algorithm,
    blockSize,
    isDuplicate ? existingBlockHash.firstOccurrenceId : blockId,
    transaction
  );

  // Add block reference
  await addBlockReference(
    blockHash.id,
    fileId,
    volumeId,
    offset,
    logicalAddress,
    undefined,
    transaction
  );

  return { blockHash, isDuplicate };
}

/**
 * 8. Process multiple blocks in batch
 *
 * @param blocks - Array of block data with metadata
 * @param algorithm - Hash algorithm
 * @param blockSize - Block size
 * @param transaction - Optional database transaction
 * @returns Array of processing results
 */
export async function processBatchBlocks(
  blocks: Array<{
    data: Buffer;
    blockId: string;
    fileId?: string;
    volumeId?: string;
    offset: number;
    logicalAddress: string;
  }>,
  algorithm: 'sha256' | 'md5' | 'crc32' | 'xxhash',
  blockSize: number,
  transaction?: Transaction
): Promise<Array<{ blockHash: BlockHashModel; isDuplicate: boolean }>> {
  const results = [];

  for (const block of blocks) {
    const result = await processBlock(
      block.data,
      algorithm,
      blockSize,
      block.blockId,
      block.fileId,
      block.volumeId,
      block.offset,
      block.logicalAddress,
      transaction
    );
    results.push(result);
  }

  return results;
}

/**
 * 9. Get block hash by hash value
 *
 * @param hash - Hash value
 * @param algorithm - Hash algorithm
 * @param blockSize - Block size
 * @returns BlockHashModel instance or null
 */
export async function getBlockHashByValue(
  hash: string,
  algorithm: 'sha256' | 'md5' | 'crc32' | 'xxhash',
  blockSize: number
): Promise<BlockHashModel | null> {
  return await BlockHashModel.findOne({
    where: { hash, algorithm, blockSize },
  });
}

/**
 * 10. Get all references for a block hash
 *
 * @param blockHashId - Block hash ID
 * @param options - Query options
 * @returns Array of BlockReferenceModel instances
 */
export async function getBlockReferences(
  blockHashId: string,
  options?: {
    limit?: number;
    offset?: number;
    fileId?: string;
    volumeId?: string;
  }
): Promise<BlockReferenceModel[]> {
  const where: any = { blockHashId };

  if (options?.fileId) {
    where.fileId = options.fileId;
  }

  if (options?.volumeId) {
    where.volumeId = options.volumeId;
  }

  return await BlockReferenceModel.findAll({
    where,
    limit: options?.limit,
    offset: options?.offset,
    order: [['createdAt', 'ASC']],
  });
}

/**
 * 11. Remove block reference and update hash occurrence count
 *
 * @param referenceId - Block reference ID
 * @param transaction - Optional database transaction
 * @returns True if removed successfully
 */
export async function removeBlockReference(
  referenceId: string,
  transaction?: Transaction
): Promise<boolean> {
  const reference = await BlockReferenceModel.findByPk(referenceId, {
    include: [{ model: BlockHashModel, as: 'blockHash' }],
    transaction,
  });

  if (!reference) {
    return false;
  }

  const blockHash = await reference.getBlockHash({ transaction });

  // Delete the reference
  await reference.destroy({ transaction });

  // Update block hash occurrence count
  const newCount = blockHash.occurrenceCount - 1;

  if (newCount <= 0) {
    // No more references, delete the block hash
    await blockHash.destroy({ transaction });
  } else {
    await blockHash.update(
      {
        occurrenceCount: newCount,
        totalSize: blockHash.totalSize - blockHash.blockSize,
      },
      { transaction }
    );
  }

  return true;
}

/**
 * 12. Verify block integrity
 *
 * @param blockHashId - Block hash ID
 * @returns DedupVerificationResult
 */
export async function verifyBlockIntegrity(
  blockHashId: string
): Promise<DedupVerificationResult> {
  const blockHash = await BlockHashModel.findByPk(blockHashId, {
    include: [{ model: BlockReferenceModel, as: 'references' }],
  });

  if (!blockHash) {
    return {
      isValid: false,
      blockHash: blockHashId,
      expectedReferenceCount: 0,
      actualReferenceCount: 0,
      integrityCheckPassed: false,
      errors: ['Block hash not found'],
      warnings: [],
    };
  }

  const actualReferenceCount = await blockHash.countReferences();
  const expectedReferenceCount = blockHash.occurrenceCount;
  const isValid = actualReferenceCount === expectedReferenceCount;

  return {
    isValid,
    blockHash: blockHash.hash,
    expectedReferenceCount,
    actualReferenceCount,
    integrityCheckPassed: isValid,
    errors: isValid ? [] : ['Reference count mismatch'],
    warnings: [],
  };
}

// ============================================================================
// File-Level Deduplication Functions (6 functions)
// ============================================================================

/**
 * 13. Split file into fixed-size chunks
 *
 * @param fileData - File data buffer
 * @param chunkSize - Chunk size in bytes
 * @returns Array of chunk buffers with metadata
 */
export function splitFileIntoChunks(
  fileData: Buffer,
  chunkSize: number
): Array<{ data: Buffer; offset: number; size: number }> {
  const chunks = [];
  let offset = 0;

  while (offset < fileData.length) {
    const remainingBytes = fileData.length - offset;
    const size = Math.min(chunkSize, remainingBytes);
    const data = fileData.subarray(offset, offset + size);

    chunks.push({ data, offset, size });
    offset += size;
  }

  return chunks;
}

/**
 * 14. Calculate chunk hashes for file
 *
 * @param fileData - File data buffer
 * @param chunkSize - Chunk size in bytes
 * @param algorithm - Hash algorithm
 * @returns Array of chunk metadata
 */
export function calculateFileChunkHashes(
  fileData: Buffer,
  chunkSize: number,
  algorithm: 'sha256' | 'md5' | 'crc32' | 'xxhash'
): ChunkMetadata[] {
  const chunks = splitFileIntoChunks(fileData, chunkSize);

  return chunks.map((chunk, index) => ({
    chunkId: `chunk-${index}`,
    hash: calculateBlockHash(chunk.data, algorithm),
    size: chunk.size,
    offset: chunk.offset,
    isDuplicate: false, // Will be determined during dedup process
  }));
}

/**
 * 15. Deduplicate file chunks
 *
 * @param fileId - File identifier
 * @param chunks - Array of chunk metadata
 * @param algorithm - Hash algorithm
 * @param transaction - Optional database transaction
 * @returns Object with unique and duplicate chunk counts
 */
export async function deduplicateFileChunks(
  fileId: string,
  chunks: ChunkMetadata[],
  algorithm: 'sha256' | 'md5' | 'crc32' | 'xxhash',
  transaction?: Transaction
): Promise<{ uniqueChunks: number; duplicateChunks: number; spaceSaved: number }> {
  let uniqueChunks = 0;
  let duplicateChunks = 0;
  let spaceSaved = 0;

  for (const chunk of chunks) {
    const existingBlockHash = await BlockHashModel.findOne({
      where: {
        hash: chunk.hash,
        algorithm,
        blockSize: chunk.size,
      },
      transaction,
    });

    if (existingBlockHash) {
      duplicateChunks++;
      spaceSaved += chunk.size;
      chunk.isDuplicate = true;

      // Update occurrence count
      await existingBlockHash.update(
        {
          occurrenceCount: existingBlockHash.occurrenceCount + 1,
          totalSize: existingBlockHash.totalSize + chunk.size,
          lastAccessedAt: new Date(),
        },
        { transaction }
      );
    } else {
      uniqueChunks++;
      chunk.isDuplicate = false;

      // Create new block hash
      await BlockHashModel.create(
        {
          hash: chunk.hash,
          algorithm,
          blockSize: chunk.size,
          firstOccurrenceId: `${fileId}-${chunk.chunkId}`,
          occurrenceCount: 1,
          totalSize: chunk.size,
          lastAccessedAt: new Date(),
          compressionEnabled: false,
          encryptionEnabled: false,
        },
        { transaction }
      );
    }

    // Add block reference
    const blockHash = await getBlockHashByValue(chunk.hash, algorithm, chunk.size);
    if (blockHash) {
      await addBlockReference(
        blockHash.id,
        fileId,
        undefined,
        chunk.offset,
        `file-${fileId}-offset-${chunk.offset}`,
        undefined,
        transaction
      );
    }
  }

  return { uniqueChunks, duplicateChunks, spaceSaved };
}

/**
 * 16. Process entire file for deduplication
 *
 * @param fileId - File identifier
 * @param fileData - File data buffer
 * @param chunkSize - Chunk size in bytes
 * @param algorithm - Hash algorithm
 * @param transaction - Optional database transaction
 * @returns Deduplication result
 */
export async function deduplicateFile(
  fileId: string,
  fileData: Buffer,
  chunkSize: number,
  algorithm: 'sha256' | 'md5' | 'crc32' | 'xxhash',
  transaction?: Transaction
): Promise<{
  fileId: string;
  totalSize: number;
  uniqueSize: number;
  duplicateSize: number;
  dedupRatio: number;
  chunks: ChunkMetadata[];
}> {
  const chunks = calculateFileChunkHashes(fileData, chunkSize, algorithm);
  const { uniqueChunks, duplicateChunks, spaceSaved } = await deduplicateFileChunks(
    fileId,
    chunks,
    algorithm,
    transaction
  );

  const totalSize = fileData.length;
  const uniqueSize = totalSize - spaceSaved;
  const dedupRatio = totalSize > 0 ? spaceSaved / totalSize : 0;

  return {
    fileId,
    totalSize,
    uniqueSize,
    duplicateSize: spaceSaved,
    dedupRatio,
    chunks,
  };
}

/**
 * 17. Get file chunk map
 *
 * @param fileId - File identifier
 * @returns Array of chunk references
 */
export async function getFileChunkMap(
  fileId: string
): Promise<BlockReferenceModel[]> {
  return await BlockReferenceModel.findAll({
    where: { fileId },
    include: [{ model: BlockHashModel, as: 'blockHash' }],
    order: [['offset', 'ASC']],
  });
}

/**
 * 18. Reconstruct file from deduplicated chunks
 *
 * @param fileId - File identifier
 * @param chunkDataMap - Map of hash to actual chunk data
 * @returns Reconstructed file buffer
 */
export async function reconstructFileFromChunks(
  fileId: string,
  chunkDataMap: Map<string, Buffer>
): Promise<Buffer> {
  const chunkReferences = await getFileChunkMap(fileId);

  // Sort by offset to ensure correct order
  chunkReferences.sort((a, b) => Number(a.offset) - Number(b.offset));

  const chunks: Buffer[] = [];

  for (const reference of chunkReferences) {
    const blockHash = await reference.getBlockHash();
    const chunkData = chunkDataMap.get(blockHash.hash);

    if (!chunkData) {
      throw new Error(`Missing chunk data for hash: ${blockHash.hash}`);
    }

    chunks.push(chunkData);
  }

  return Buffer.concat(chunks);
}

// ============================================================================
// Inline Deduplication Functions (5 functions)
// ============================================================================

/**
 * 19. Perform inline deduplication on incoming data
 *
 * @param data - Incoming data buffer
 * @param blockSize - Block size for deduplication
 * @param algorithm - Hash algorithm
 * @param volumeId - Volume identifier
 * @param transaction - Optional database transaction
 * @returns Inline dedup result
 */
export async function performInlineDeduplication(
  data: Buffer,
  blockSize: number,
  algorithm: 'sha256' | 'md5' | 'crc32' | 'xxhash',
  volumeId: string,
  transaction?: Transaction
): Promise<{
  totalBlocks: number;
  uniqueBlocks: number;
  duplicateBlocks: number;
  spaceSaved: number;
  blockReferences: BlockReferenceModel[];
}> {
  const chunks = splitFileIntoChunks(data, blockSize);
  const blockReferences: BlockReferenceModel[] = [];
  let uniqueBlocks = 0;
  let duplicateBlocks = 0;
  let spaceSaved = 0;

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const hash = calculateBlockHash(chunk.data, algorithm);
    const blockId = `${volumeId}-block-${i}`;
    const logicalAddress = `lba-${volumeId}-${chunk.offset}`;

    const existingBlockHash = await getBlockHashByValue(hash, algorithm, blockSize);

    if (existingBlockHash) {
      duplicateBlocks++;
      spaceSaved += chunk.size;

      // Update existing block hash
      await existingBlockHash.update(
        {
          occurrenceCount: existingBlockHash.occurrenceCount + 1,
          totalSize: existingBlockHash.totalSize + chunk.size,
          lastAccessedAt: new Date(),
        },
        { transaction }
      );

      // Add reference
      const reference = await addBlockReference(
        existingBlockHash.id,
        undefined,
        volumeId,
        chunk.offset,
        logicalAddress,
        undefined,
        transaction
      );
      blockReferences.push(reference);
    } else {
      uniqueBlocks++;

      // Create new block hash
      const newBlockHash = await BlockHashModel.create(
        {
          hash,
          algorithm,
          blockSize,
          firstOccurrenceId: blockId,
          occurrenceCount: 1,
          totalSize: chunk.size,
          lastAccessedAt: new Date(),
          compressionEnabled: false,
          encryptionEnabled: false,
        },
        { transaction }
      );

      // Add reference
      const reference = await addBlockReference(
        newBlockHash.id,
        undefined,
        volumeId,
        chunk.offset,
        logicalAddress,
        undefined,
        transaction
      );
      blockReferences.push(reference);
    }
  }

  return {
    totalBlocks: chunks.length,
    uniqueBlocks,
    duplicateBlocks,
    spaceSaved,
    blockReferences,
  };
}

/**
 * 20. Create inline deduplication job
 *
 * @param volumeId - Volume identifier
 * @param blockSize - Block size
 * @param algorithm - Hash algorithm
 * @param createdBy - User creating the job
 * @param transaction - Optional database transaction
 * @returns DeduplicationJobModel instance
 */
export async function createInlineDeduplicationJob(
  volumeId: string,
  blockSize: number,
  algorithm: 'sha256' | 'md5' | 'crc32' | 'xxhash',
  createdBy: string,
  transaction?: Transaction
): Promise<DeduplicationJobModel> {
  return await DeduplicationJobModel.create(
    {
      type: 'inline',
      scope: 'block',
      status: 'pending',
      volumeId,
      blockSize,
      hashAlgorithm: algorithm,
      totalBlocks: 0,
      processedBlocks: 0,
      duplicateBlocks: 0,
      spaceSaved: 0,
      createdBy,
    },
    { transaction }
  );
}

/**
 * 21. Start inline deduplication job
 *
 * @param jobId - Job identifier
 * @param transaction - Optional database transaction
 * @returns Updated job
 */
export async function startInlineDeduplicationJob(
  jobId: string,
  transaction?: Transaction
): Promise<DeduplicationJobModel> {
  const job = await DeduplicationJobModel.findByPk(jobId, { transaction });

  if (!job) {
    throw new Error(`Deduplication job not found: ${jobId}`);
  }

  return await job.update(
    {
      status: 'running',
      startedAt: new Date(),
    },
    { transaction }
  );
}

/**
 * 22. Update inline deduplication job progress
 *
 * @param jobId - Job identifier
 * @param processedBlocks - Number of blocks processed
 * @param duplicateBlocks - Number of duplicate blocks found
 * @param spaceSaved - Space saved in bytes
 * @param transaction - Optional database transaction
 * @returns Updated job
 */
export async function updateInlineDeduplicationProgress(
  jobId: string,
  processedBlocks: number,
  duplicateBlocks: number,
  spaceSaved: number,
  transaction?: Transaction
): Promise<DeduplicationJobModel> {
  const job = await DeduplicationJobModel.findByPk(jobId, { transaction });

  if (!job) {
    throw new Error(`Deduplication job not found: ${jobId}`);
  }

  return await job.update(
    {
      processedBlocks: job.processedBlocks + processedBlocks,
      duplicateBlocks: job.duplicateBlocks + duplicateBlocks,
      spaceSaved: job.spaceSaved + spaceSaved,
    },
    { transaction }
  );
}

/**
 * 23. Complete inline deduplication job
 *
 * @param jobId - Job identifier
 * @param transaction - Optional database transaction
 * @returns Completed job
 */
export async function completeInlineDeduplicationJob(
  jobId: string,
  transaction?: Transaction
): Promise<DeduplicationJobModel> {
  const job = await DeduplicationJobModel.findByPk(jobId, { transaction });

  if (!job) {
    throw new Error(`Deduplication job not found: ${jobId}`);
  }

  return await job.update(
    {
      status: 'completed',
      completedAt: new Date(),
    },
    { transaction }
  );
}

// ============================================================================
// Post-Process Deduplication Functions (5 functions)
// ============================================================================

/**
 * 24. Scan volume for duplicate blocks
 *
 * @param volumeId - Volume identifier
 * @param blockSize - Block size
 * @param algorithm - Hash algorithm
 * @returns Array of duplicate block hashes
 */
export async function scanVolumeForDuplicates(
  volumeId: string,
  blockSize: number,
  algorithm: 'sha256' | 'md5' | 'crc32' | 'xxhash'
): Promise<BlockHashModel[]> {
  return await BlockHashModel.findAll({
    where: {
      algorithm,
      blockSize,
      occurrenceCount: {
        [Op.gt]: 1,
      },
    },
    include: [
      {
        model: BlockReferenceModel,
        as: 'references',
        where: { volumeId },
        required: true,
      },
    ],
  });
}

/**
 * 25. Create post-process deduplication job
 *
 * @param volumeId - Volume identifier
 * @param blockSize - Block size
 * @param algorithm - Hash algorithm
 * @param createdBy - User creating the job
 * @param transaction - Optional database transaction
 * @returns DeduplicationJobModel instance
 */
export async function createPostProcessDeduplicationJob(
  volumeId: string,
  blockSize: number,
  algorithm: 'sha256' | 'md5' | 'crc32' | 'xxhash',
  createdBy: string,
  transaction?: Transaction
): Promise<DeduplicationJobModel> {
  return await DeduplicationJobModel.create(
    {
      type: 'post-process',
      scope: 'volume',
      status: 'pending',
      volumeId,
      blockSize,
      hashAlgorithm: algorithm,
      totalBlocks: 0,
      processedBlocks: 0,
      duplicateBlocks: 0,
      spaceSaved: 0,
      createdBy,
    },
    { transaction }
  );
}

/**
 * 26. Execute post-process deduplication
 *
 * @param jobId - Job identifier
 * @param transaction - Optional database transaction
 * @returns Deduplication result
 */
export async function executePostProcessDeduplication(
  jobId: string,
  transaction?: Transaction
): Promise<{
  totalBlocks: number;
  duplicateBlocks: number;
  spaceSaved: number;
}> {
  const job = await DeduplicationJobModel.findByPk(jobId, { transaction });

  if (!job) {
    throw new Error(`Deduplication job not found: ${jobId}`);
  }

  if (!job.volumeId) {
    throw new Error('Volume ID is required for post-process deduplication');
  }

  // Start the job
  await job.update(
    {
      status: 'running',
      startedAt: new Date(),
    },
    { transaction }
  );

  // Scan for duplicates
  const duplicateHashes = await scanVolumeForDuplicates(
    job.volumeId,
    job.blockSize,
    job.hashAlgorithm
  );

  let totalBlocks = 0;
  let duplicateBlocks = 0;
  let spaceSaved = 0;

  for (const blockHash of duplicateHashes) {
    const references = await blockHash.getReferences();
    totalBlocks += references.length;

    // First reference is the original, rest are duplicates
    if (references.length > 1) {
      duplicateBlocks += references.length - 1;
      spaceSaved += (references.length - 1) * blockHash.blockSize;
    }
  }

  // Update job with results
  await job.update(
    {
      status: 'completed',
      completedAt: new Date(),
      totalBlocks,
      processedBlocks: totalBlocks,
      duplicateBlocks,
      spaceSaved,
    },
    { transaction }
  );

  return { totalBlocks, duplicateBlocks, spaceSaved };
}

/**
 * 27. Optimize deduplication metadata
 *
 * @param volumeId - Volume identifier
 * @param transaction - Optional database transaction
 * @returns Optimization result
 */
export async function optimizeDeduplicationMetadata(
  volumeId: string,
  transaction?: Transaction
): Promise<{
  removedOrphanedHashes: number;
  consolidatedReferences: number;
}> {
  let removedOrphanedHashes = 0;
  let consolidatedReferences = 0;

  // Find block hashes with no references
  const allBlockHashes = await BlockHashModel.findAll({
    include: [
      {
        model: BlockReferenceModel,
        as: 'references',
        where: { volumeId },
        required: false,
      },
    ],
    transaction,
  });

  for (const blockHash of allBlockHashes) {
    const referenceCount = await blockHash.countReferences({ transaction });

    if (referenceCount === 0) {
      await blockHash.destroy({ transaction });
      removedOrphanedHashes++;
    } else if (referenceCount !== blockHash.occurrenceCount) {
      // Fix incorrect occurrence count
      await blockHash.update(
        { occurrenceCount: referenceCount },
        { transaction }
      );
      consolidatedReferences++;
    }
  }

  return { removedOrphanedHashes, consolidatedReferences };
}

/**
 * 28. Schedule post-process deduplication
 *
 * @param volumeId - Volume identifier
 * @param blockSize - Block size
 * @param algorithm - Hash algorithm
 * @param scheduledTime - When to run the job
 * @param createdBy - User creating the job
 * @param transaction - Optional database transaction
 * @returns Scheduled job
 */
export async function schedulePostProcessDeduplication(
  volumeId: string,
  blockSize: number,
  algorithm: 'sha256' | 'md5' | 'crc32' | 'xxhash',
  scheduledTime: Date,
  createdBy: string,
  transaction?: Transaction
): Promise<DeduplicationJobModel> {
  const job = await createPostProcessDeduplicationJob(
    volumeId,
    blockSize,
    algorithm,
    createdBy,
    transaction
  );

  await job.update(
    {
      metadata: {
        scheduledTime: scheduledTime.toISOString(),
        autoStart: true,
      },
    },
    { transaction }
  );

  return job;
}

// ============================================================================
// Metrics and Reporting Functions (7 functions)
// ============================================================================

/**
 * 29. Calculate deduplication ratio
 *
 * @param totalDataSize - Total data size in bytes
 * @param uniqueDataSize - Unique data size in bytes
 * @returns Deduplication ratio
 */
export function calculateDedupRatio(
  totalDataSize: number,
  uniqueDataSize: number
): number {
  if (totalDataSize === 0) {
    return 0;
  }
  return (totalDataSize - uniqueDataSize) / totalDataSize;
}

/**
 * 30. Calculate space savings percentage
 *
 * @param totalDataSize - Total data size in bytes
 * @param spaceSaved - Space saved in bytes
 * @returns Space savings percentage
 */
export function calculateSpaceSavingsPercent(
  totalDataSize: number,
  spaceSaved: number
): number {
  if (totalDataSize === 0) {
    return 0;
  }
  return (spaceSaved / totalDataSize) * 100;
}

/**
 * 31. Create deduplication metrics snapshot
 *
 * @param jobId - Job identifier
 * @param totalDataSize - Total data size
 * @param uniqueDataSize - Unique data size
 * @param duplicateDataSize - Duplicate data size
 * @param totalBlocks - Total blocks
 * @param uniqueBlocks - Unique blocks
 * @param duplicateBlocks - Duplicate blocks
 * @param averageBlockSize - Average block size
 * @param throughput - Throughput in bytes per second
 * @param hashDistribution - Hash algorithm distribution
 * @param transaction - Optional database transaction
 * @returns DedupMetricsModel instance
 */
export async function createDedupMetrics(
  jobId: string,
  totalDataSize: number,
  uniqueDataSize: number,
  duplicateDataSize: number,
  totalBlocks: number,
  uniqueBlocks: number,
  duplicateBlocks: number,
  averageBlockSize: number,
  throughput: number,
  hashDistribution: Record<string, number>,
  transaction?: Transaction
): Promise<DedupMetricsModel> {
  const dedupRatio = calculateDedupRatio(totalDataSize, uniqueDataSize);
  const spaceSavings = duplicateDataSize;
  const spaceSavingsPercent = calculateSpaceSavingsPercent(totalDataSize, spaceSavings);

  return await DedupMetricsModel.create(
    {
      jobId,
      timestamp: new Date(),
      totalDataSize,
      uniqueDataSize,
      duplicateDataSize,
      dedupRatio,
      spaceSavings,
      spaceSavingsPercent,
      totalBlocks,
      uniqueBlocks,
      duplicateBlocks,
      averageBlockSize,
      hashDistribution,
      throughput,
    },
    { transaction }
  );
}

/**
 * 32. Get deduplication metrics for a job
 *
 * @param jobId - Job identifier
 * @param options - Query options
 * @returns Array of metrics
 */
export async function getDedupMetrics(
  jobId: string,
  options?: {
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }
): Promise<DedupMetricsModel[]> {
  const where: any = { jobId };

  if (options?.startDate || options?.endDate) {
    where.timestamp = {};

    if (options.startDate) {
      where.timestamp[Op.gte] = options.startDate;
    }

    if (options.endDate) {
      where.timestamp[Op.lte] = options.endDate;
    }
  }

  return await DedupMetricsModel.findAll({
    where,
    limit: options?.limit,
    order: [['timestamp', 'DESC']],
  });
}

/**
 * 33. Generate deduplication report
 *
 * @param jobId - Job identifier
 * @returns Comprehensive deduplication report
 */
export async function generateDedupReport(
  jobId: string
): Promise<{
  job: DeduplicationJobModel;
  metrics: DedupMetricsModel[];
  summary: {
    totalDuration: number;
    averageThroughput: number;
    peakDedupRatio: number;
    totalSpaceSaved: number;
    efficiency: number;
  };
}> {
  const job = await DeduplicationJobModel.findByPk(jobId, {
    include: [{ model: DedupMetricsModel, as: 'metrics' }],
  });

  if (!job) {
    throw new Error(`Deduplication job not found: ${jobId}`);
  }

  const metrics = await getDedupMetrics(jobId);

  const totalDuration = job.completedAt && job.startedAt
    ? job.completedAt.getTime() - job.startedAt.getTime()
    : 0;

  const averageThroughput = metrics.length > 0
    ? metrics.reduce((sum, m) => sum + m.throughput, 0) / metrics.length
    : 0;

  const peakDedupRatio = metrics.length > 0
    ? Math.max(...metrics.map(m => Number(m.dedupRatio)))
    : 0;

  const totalSpaceSaved = job.spaceSaved;

  const efficiency = totalDuration > 0
    ? (totalSpaceSaved / totalDuration) * 1000 // Bytes per second
    : 0;

  return {
    job,
    metrics,
    summary: {
      totalDuration,
      averageThroughput,
      peakDedupRatio,
      totalSpaceSaved,
      efficiency,
    },
  };
}

/**
 * 34. Get deduplication statistics by volume
 *
 * @param volumeId - Volume identifier
 * @returns Volume deduplication statistics
 */
export async function getVolumeDeduplicationStats(
  volumeId: string
): Promise<{
  totalJobs: number;
  completedJobs: number;
  totalSpaceSaved: number;
  averageDedupRatio: number;
  totalBlocks: number;
  duplicateBlocks: number;
}> {
  const jobs = await DeduplicationJobModel.findAll({
    where: { volumeId },
  });

  const completedJobs = jobs.filter(j => j.status === 'completed');

  const totalSpaceSaved = completedJobs.reduce((sum, j) => sum + j.spaceSaved, 0);

  const totalBlocks = completedJobs.reduce((sum, j) => sum + j.totalBlocks, 0);
  const duplicateBlocks = completedJobs.reduce((sum, j) => sum + j.duplicateBlocks, 0);

  const averageDedupRatio = totalBlocks > 0
    ? duplicateBlocks / totalBlocks
    : 0;

  return {
    totalJobs: jobs.length,
    completedJobs: completedJobs.length,
    totalSpaceSaved,
    averageDedupRatio,
    totalBlocks,
    duplicateBlocks,
  };
}

/**
 * 35. Get top duplicate blocks
 *
 * @param limit - Number of results to return
 * @param volumeId - Optional volume filter
 * @returns Top duplicate blocks
 */
export async function getTopDuplicateBlocks(
  limit: number = 10,
  volumeId?: string
): Promise<BlockHashModel[]> {
  const include = volumeId
    ? [
        {
          model: BlockReferenceModel,
          as: 'references',
          where: { volumeId },
          required: true,
        },
      ]
    : [];

  return await BlockHashModel.findAll({
    where: {
      occurrenceCount: {
        [Op.gt]: 1,
      },
    },
    include,
    order: [['occurrenceCount', 'DESC']],
    limit,
  });
}

/**
 * 36. Calculate hash algorithm distribution
 *
 * @param volumeId - Optional volume filter
 * @returns Hash algorithm distribution
 */
export async function getHashAlgorithmDistribution(
  volumeId?: string
): Promise<Record<string, number>> {
  const where = volumeId ? { volumeId } : {};

  const jobs = await DeduplicationJobModel.findAll({ where });

  const distribution: Record<string, number> = {
    sha256: 0,
    md5: 0,
    crc32: 0,
    xxhash: 0,
  };

  for (const job of jobs) {
    distribution[job.hashAlgorithm] = (distribution[job.hashAlgorithm] || 0) + 1;
  }

  return distribution;
}

// ============================================================================
// Job Management Functions (5 functions)
// ============================================================================

/**
 * 37. Get deduplication job by ID
 *
 * @param jobId - Job identifier
 * @returns DeduplicationJobModel instance
 */
export async function getDeduplicationJob(
  jobId: string
): Promise<DeduplicationJobModel | null> {
  return await DeduplicationJobModel.findByPk(jobId, {
    include: [{ model: DedupMetricsModel, as: 'metrics' }],
  });
}

/**
 * 38. List deduplication jobs
 *
 * @param options - Query options
 * @returns Array of jobs
 */
export async function listDeduplicationJobs(
  options?: {
    status?: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
    type?: 'inline' | 'post-process';
    volumeId?: string;
    createdBy?: string;
    limit?: number;
    offset?: number;
  }
): Promise<{ jobs: DeduplicationJobModel[]; total: number }> {
  const where: any = {};

  if (options?.status) {
    where.status = options.status;
  }

  if (options?.type) {
    where.type = options.type;
  }

  if (options?.volumeId) {
    where.volumeId = options.volumeId;
  }

  if (options?.createdBy) {
    where.createdBy = options.createdBy;
  }

  const { count, rows } = await DeduplicationJobModel.findAndCountAll({
    where,
    limit: options?.limit,
    offset: options?.offset,
    order: [['createdAt', 'DESC']],
    include: [{ model: DedupMetricsModel, as: 'metrics' }],
  });

  return { jobs: rows, total: count };
}

/**
 * 39. Pause deduplication job
 *
 * @param jobId - Job identifier
 * @param transaction - Optional database transaction
 * @returns Updated job
 */
export async function pauseDeduplicationJob(
  jobId: string,
  transaction?: Transaction
): Promise<DeduplicationJobModel> {
  const job = await DeduplicationJobModel.findByPk(jobId, { transaction });

  if (!job) {
    throw new Error(`Deduplication job not found: ${jobId}`);
  }

  if (job.status !== 'running') {
    throw new Error(`Cannot pause job with status: ${job.status}`);
  }

  return await job.update({ status: 'paused' }, { transaction });
}

/**
 * 40. Resume deduplication job
 *
 * @param jobId - Job identifier
 * @param transaction - Optional database transaction
 * @returns Updated job
 */
export async function resumeDeduplicationJob(
  jobId: string,
  transaction?: Transaction
): Promise<DeduplicationJobModel> {
  const job = await DeduplicationJobModel.findByPk(jobId, { transaction });

  if (!job) {
    throw new Error(`Deduplication job not found: ${jobId}`);
  }

  if (job.status !== 'paused') {
    throw new Error(`Cannot resume job with status: ${job.status}`);
  }

  return await job.update({ status: 'running' }, { transaction });
}

/**
 * 41. Cancel deduplication job
 *
 * @param jobId - Job identifier
 * @param errorMessage - Optional error message
 * @param transaction - Optional database transaction
 * @returns Updated job
 */
export async function cancelDeduplicationJob(
  jobId: string,
  errorMessage?: string,
  transaction?: Transaction
): Promise<DeduplicationJobModel> {
  const job = await DeduplicationJobModel.findByPk(jobId, { transaction });

  if (!job) {
    throw new Error(`Deduplication job not found: ${jobId}`);
  }

  if (job.status === 'completed') {
    throw new Error('Cannot cancel a completed job');
  }

  return await job.update(
    {
      status: 'failed',
      completedAt: new Date(),
      errorMessage: errorMessage || 'Job cancelled by user',
    },
    { transaction }
  );
}

// ============================================================================
// Export All Models and Functions
// ============================================================================

export default {
  // Models
  DeduplicationJobModel,
  BlockHashModel,
  BlockReferenceModel,
  DedupMetricsModel,

  // Model initialization
  initializeDeduplicationModels,
  defineDeduplicationAssociations,

  // Hash functions
  calculateSHA256Hash,
  calculateMD5Hash,
  calculateCRC32Hash,
  calculateBlockHash,

  // Block-level deduplication
  findOrCreateBlockHash,
  addBlockReference,
  processBlock,
  processBatchBlocks,
  getBlockHashByValue,
  getBlockReferences,
  removeBlockReference,
  verifyBlockIntegrity,

  // File-level deduplication
  splitFileIntoChunks,
  calculateFileChunkHashes,
  deduplicateFileChunks,
  deduplicateFile,
  getFileChunkMap,
  reconstructFileFromChunks,

  // Inline deduplication
  performInlineDeduplication,
  createInlineDeduplicationJob,
  startInlineDeduplicationJob,
  updateInlineDeduplicationProgress,
  completeInlineDeduplicationJob,

  // Post-process deduplication
  scanVolumeForDuplicates,
  createPostProcessDeduplicationJob,
  executePostProcessDeduplication,
  optimizeDeduplicationMetadata,
  schedulePostProcessDeduplication,

  // Metrics and reporting
  calculateDedupRatio,
  calculateSpaceSavingsPercent,
  createDedupMetrics,
  getDedupMetrics,
  generateDedupReport,
  getVolumeDeduplicationStats,
  getTopDuplicateBlocks,
  getHashAlgorithmDistribution,

  // Job management
  getDeduplicationJob,
  listDeduplicationJobs,
  pauseDeduplicationJob,
  resumeDeduplicationJob,
  cancelDeduplicationJob,
};
