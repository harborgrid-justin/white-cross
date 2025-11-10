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
import { Model, Sequelize, Association, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyCountAssociationsMixin, BelongsToGetAssociationMixin, Transaction } from 'sequelize';
import { Buffer } from 'buffer';
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
    blockSize: number;
    hashAlgorithm: 'sha256' | 'md5' | 'crc32' | 'xxhash';
    startedAt?: Date;
    completedAt?: Date;
    totalBlocks: number;
    processedBlocks: number;
    duplicateBlocks: number;
    spaceSaved: number;
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
    firstOccurrenceId: string;
    occurrenceCount: number;
    totalSize: number;
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
    offset: number;
    logicalAddress: string;
    physicalAddress?: string;
    createdAt: Date;
}
/**
 * Deduplication metrics and statistics
 */
export interface DedupMetrics {
    jobId: string;
    timestamp: Date;
    totalDataSize: number;
    uniqueDataSize: number;
    duplicateDataSize: number;
    dedupRatio: number;
    spaceSavings: number;
    spaceSavingsPercent: number;
    totalBlocks: number;
    uniqueBlocks: number;
    duplicateBlocks: number;
    averageBlockSize: number;
    hashDistribution: Record<string, number>;
    throughput: number;
    cpuUsage?: number;
    memoryUsage?: number;
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
/**
 * DeduplicationJob Model
 * Tracks deduplication job execution and status
 */
export declare class DeduplicationJobModel extends Model {
    id: string;
    type: 'inline' | 'post-process';
    scope: 'block' | 'file' | 'volume';
    status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
    volumeId?: string;
    targetPath?: string;
    blockSize: number;
    hashAlgorithm: 'sha256' | 'md5' | 'crc32' | 'xxhash';
    startedAt?: Date;
    completedAt?: Date;
    totalBlocks: number;
    processedBlocks: number;
    duplicateBlocks: number;
    spaceSaved: number;
    errorMessage?: string;
    createdBy: string;
    metadata?: Record<string, any>;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    getMetrics: HasManyGetAssociationsMixin<DedupMetricsModel>;
    addMetric: HasManyAddAssociationMixin<DedupMetricsModel, string>;
    countMetrics: HasManyCountAssociationsMixin;
    static associations: {
        metrics: Association.HasMany<DeduplicationJobModel, DedupMetricsModel>;
    };
}
/**
 * BlockHashModel
 * Stores unique block hashes and reference counts
 */
export declare class BlockHashModel extends Model {
    id: string;
    hash: string;
    algorithm: 'sha256' | 'md5' | 'crc32' | 'xxhash';
    blockSize: number;
    firstOccurrenceId: string;
    occurrenceCount: number;
    totalSize: number;
    lastAccessedAt: Date;
    compressionEnabled: boolean;
    encryptionEnabled: boolean;
    metadata?: Record<string, any>;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    getReferences: HasManyGetAssociationsMixin<BlockReferenceModel>;
    addReference: HasManyAddAssociationMixin<BlockReferenceModel, string>;
    countReferences: HasManyCountAssociationsMixin;
    static associations: {
        references: Association.HasMany<BlockHashModel, BlockReferenceModel>;
    };
}
/**
 * BlockReferenceModel
 * Tracks which files/volumes reference which blocks
 */
export declare class BlockReferenceModel extends Model {
    id: string;
    blockHashId: string;
    fileId?: string;
    volumeId?: string;
    offset: number;
    logicalAddress: string;
    physicalAddress?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    getBlockHash: BelongsToGetAssociationMixin<BlockHashModel>;
    static associations: {
        blockHash: Association.BelongsTo<BlockReferenceModel, BlockHashModel>;
    };
}
/**
 * DedupMetricsModel
 * Stores deduplication metrics and statistics
 */
export declare class DedupMetricsModel extends Model {
    id: string;
    jobId: string;
    timestamp: Date;
    totalDataSize: number;
    uniqueDataSize: number;
    duplicateDataSize: number;
    dedupRatio: number;
    spaceSavings: number;
    spaceSavingsPercent: number;
    totalBlocks: number;
    uniqueBlocks: number;
    duplicateBlocks: number;
    averageBlockSize: number;
    hashDistribution: Record<string, number>;
    throughput: number;
    cpuUsage?: number;
    memoryUsage?: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    getJob: BelongsToGetAssociationMixin<DeduplicationJobModel>;
    static associations: {
        job: Association.BelongsTo<DedupMetricsModel, DeduplicationJobModel>;
    };
}
/**
 * Initialize all Sequelize models for deduplication tracking
 *
 * @param sequelize - Sequelize instance
 */
export declare function initializeDeduplicationModels(sequelize: Sequelize): void;
/**
 * Define associations between deduplication models
 */
export declare function defineDeduplicationAssociations(): void;
/**
 * 1. Calculate SHA-256 hash of a data block
 *
 * @param data - Data buffer to hash
 * @returns SHA-256 hash as hexadecimal string
 */
export declare function calculateSHA256Hash(data: Buffer): string;
/**
 * 2. Calculate MD5 hash of a data block
 *
 * @param data - Data buffer to hash
 * @returns MD5 hash as hexadecimal string
 */
export declare function calculateMD5Hash(data: Buffer): string;
/**
 * 3. Calculate CRC32 hash of a data block
 *
 * @param data - Data buffer to hash
 * @returns CRC32 hash as hexadecimal string
 */
export declare function calculateCRC32Hash(data: Buffer): string;
/**
 * 4. Calculate hash using specified algorithm
 *
 * @param data - Data buffer to hash
 * @param algorithm - Hash algorithm to use
 * @returns Hash as hexadecimal string
 */
export declare function calculateBlockHash(data: Buffer, algorithm: 'sha256' | 'md5' | 'crc32' | 'xxhash'): string;
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
export declare function findOrCreateBlockHash(hash: string, algorithm: 'sha256' | 'md5' | 'crc32' | 'xxhash', blockSize: number, firstOccurrenceId: string, transaction?: Transaction): Promise<BlockHashModel>;
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
export declare function addBlockReference(blockHashId: string, fileId: string | undefined, volumeId: string | undefined, offset: number, logicalAddress: string, physicalAddress?: string, transaction?: Transaction): Promise<BlockReferenceModel>;
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
export declare function processBlock(data: Buffer, algorithm: 'sha256' | 'md5' | 'crc32' | 'xxhash', blockSize: number, blockId: string, fileId: string | undefined, volumeId: string | undefined, offset: number, logicalAddress: string, transaction?: Transaction): Promise<{
    blockHash: BlockHashModel;
    isDuplicate: boolean;
}>;
/**
 * 8. Process multiple blocks in batch
 *
 * @param blocks - Array of block data with metadata
 * @param algorithm - Hash algorithm
 * @param blockSize - Block size
 * @param transaction - Optional database transaction
 * @returns Array of processing results
 */
export declare function processBatchBlocks(blocks: Array<{
    data: Buffer;
    blockId: string;
    fileId?: string;
    volumeId?: string;
    offset: number;
    logicalAddress: string;
}>, algorithm: 'sha256' | 'md5' | 'crc32' | 'xxhash', blockSize: number, transaction?: Transaction): Promise<Array<{
    blockHash: BlockHashModel;
    isDuplicate: boolean;
}>>;
/**
 * 9. Get block hash by hash value
 *
 * @param hash - Hash value
 * @param algorithm - Hash algorithm
 * @param blockSize - Block size
 * @returns BlockHashModel instance or null
 */
export declare function getBlockHashByValue(hash: string, algorithm: 'sha256' | 'md5' | 'crc32' | 'xxhash', blockSize: number): Promise<BlockHashModel | null>;
/**
 * 10. Get all references for a block hash
 *
 * @param blockHashId - Block hash ID
 * @param options - Query options
 * @returns Array of BlockReferenceModel instances
 */
export declare function getBlockReferences(blockHashId: string, options?: {
    limit?: number;
    offset?: number;
    fileId?: string;
    volumeId?: string;
}): Promise<BlockReferenceModel[]>;
/**
 * 11. Remove block reference and update hash occurrence count
 *
 * @param referenceId - Block reference ID
 * @param transaction - Optional database transaction
 * @returns True if removed successfully
 */
export declare function removeBlockReference(referenceId: string, transaction?: Transaction): Promise<boolean>;
/**
 * 12. Verify block integrity
 *
 * @param blockHashId - Block hash ID
 * @returns DedupVerificationResult
 */
export declare function verifyBlockIntegrity(blockHashId: string): Promise<DedupVerificationResult>;
/**
 * 13. Split file into fixed-size chunks
 *
 * @param fileData - File data buffer
 * @param chunkSize - Chunk size in bytes
 * @returns Array of chunk buffers with metadata
 */
export declare function splitFileIntoChunks(fileData: Buffer, chunkSize: number): Array<{
    data: Buffer;
    offset: number;
    size: number;
}>;
/**
 * 14. Calculate chunk hashes for file
 *
 * @param fileData - File data buffer
 * @param chunkSize - Chunk size in bytes
 * @param algorithm - Hash algorithm
 * @returns Array of chunk metadata
 */
export declare function calculateFileChunkHashes(fileData: Buffer, chunkSize: number, algorithm: 'sha256' | 'md5' | 'crc32' | 'xxhash'): ChunkMetadata[];
/**
 * 15. Deduplicate file chunks
 *
 * @param fileId - File identifier
 * @param chunks - Array of chunk metadata
 * @param algorithm - Hash algorithm
 * @param transaction - Optional database transaction
 * @returns Object with unique and duplicate chunk counts
 */
export declare function deduplicateFileChunks(fileId: string, chunks: ChunkMetadata[], algorithm: 'sha256' | 'md5' | 'crc32' | 'xxhash', transaction?: Transaction): Promise<{
    uniqueChunks: number;
    duplicateChunks: number;
    spaceSaved: number;
}>;
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
export declare function deduplicateFile(fileId: string, fileData: Buffer, chunkSize: number, algorithm: 'sha256' | 'md5' | 'crc32' | 'xxhash', transaction?: Transaction): Promise<{
    fileId: string;
    totalSize: number;
    uniqueSize: number;
    duplicateSize: number;
    dedupRatio: number;
    chunks: ChunkMetadata[];
}>;
/**
 * 17. Get file chunk map
 *
 * @param fileId - File identifier
 * @returns Array of chunk references
 */
export declare function getFileChunkMap(fileId: string): Promise<BlockReferenceModel[]>;
/**
 * 18. Reconstruct file from deduplicated chunks
 *
 * @param fileId - File identifier
 * @param chunkDataMap - Map of hash to actual chunk data
 * @returns Reconstructed file buffer
 */
export declare function reconstructFileFromChunks(fileId: string, chunkDataMap: Map<string, Buffer>): Promise<Buffer>;
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
export declare function performInlineDeduplication(data: Buffer, blockSize: number, algorithm: 'sha256' | 'md5' | 'crc32' | 'xxhash', volumeId: string, transaction?: Transaction): Promise<{
    totalBlocks: number;
    uniqueBlocks: number;
    duplicateBlocks: number;
    spaceSaved: number;
    blockReferences: BlockReferenceModel[];
}>;
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
export declare function createInlineDeduplicationJob(volumeId: string, blockSize: number, algorithm: 'sha256' | 'md5' | 'crc32' | 'xxhash', createdBy: string, transaction?: Transaction): Promise<DeduplicationJobModel>;
/**
 * 21. Start inline deduplication job
 *
 * @param jobId - Job identifier
 * @param transaction - Optional database transaction
 * @returns Updated job
 */
export declare function startInlineDeduplicationJob(jobId: string, transaction?: Transaction): Promise<DeduplicationJobModel>;
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
export declare function updateInlineDeduplicationProgress(jobId: string, processedBlocks: number, duplicateBlocks: number, spaceSaved: number, transaction?: Transaction): Promise<DeduplicationJobModel>;
/**
 * 23. Complete inline deduplication job
 *
 * @param jobId - Job identifier
 * @param transaction - Optional database transaction
 * @returns Completed job
 */
export declare function completeInlineDeduplicationJob(jobId: string, transaction?: Transaction): Promise<DeduplicationJobModel>;
/**
 * 24. Scan volume for duplicate blocks
 *
 * @param volumeId - Volume identifier
 * @param blockSize - Block size
 * @param algorithm - Hash algorithm
 * @returns Array of duplicate block hashes
 */
export declare function scanVolumeForDuplicates(volumeId: string, blockSize: number, algorithm: 'sha256' | 'md5' | 'crc32' | 'xxhash'): Promise<BlockHashModel[]>;
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
export declare function createPostProcessDeduplicationJob(volumeId: string, blockSize: number, algorithm: 'sha256' | 'md5' | 'crc32' | 'xxhash', createdBy: string, transaction?: Transaction): Promise<DeduplicationJobModel>;
/**
 * 26. Execute post-process deduplication
 *
 * @param jobId - Job identifier
 * @param transaction - Optional database transaction
 * @returns Deduplication result
 */
export declare function executePostProcessDeduplication(jobId: string, transaction?: Transaction): Promise<{
    totalBlocks: number;
    duplicateBlocks: number;
    spaceSaved: number;
}>;
/**
 * 27. Optimize deduplication metadata
 *
 * @param volumeId - Volume identifier
 * @param transaction - Optional database transaction
 * @returns Optimization result
 */
export declare function optimizeDeduplicationMetadata(volumeId: string, transaction?: Transaction): Promise<{
    removedOrphanedHashes: number;
    consolidatedReferences: number;
}>;
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
export declare function schedulePostProcessDeduplication(volumeId: string, blockSize: number, algorithm: 'sha256' | 'md5' | 'crc32' | 'xxhash', scheduledTime: Date, createdBy: string, transaction?: Transaction): Promise<DeduplicationJobModel>;
/**
 * 29. Calculate deduplication ratio
 *
 * @param totalDataSize - Total data size in bytes
 * @param uniqueDataSize - Unique data size in bytes
 * @returns Deduplication ratio
 */
export declare function calculateDedupRatio(totalDataSize: number, uniqueDataSize: number): number;
/**
 * 30. Calculate space savings percentage
 *
 * @param totalDataSize - Total data size in bytes
 * @param spaceSaved - Space saved in bytes
 * @returns Space savings percentage
 */
export declare function calculateSpaceSavingsPercent(totalDataSize: number, spaceSaved: number): number;
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
export declare function createDedupMetrics(jobId: string, totalDataSize: number, uniqueDataSize: number, duplicateDataSize: number, totalBlocks: number, uniqueBlocks: number, duplicateBlocks: number, averageBlockSize: number, throughput: number, hashDistribution: Record<string, number>, transaction?: Transaction): Promise<DedupMetricsModel>;
/**
 * 32. Get deduplication metrics for a job
 *
 * @param jobId - Job identifier
 * @param options - Query options
 * @returns Array of metrics
 */
export declare function getDedupMetrics(jobId: string, options?: {
    startDate?: Date;
    endDate?: Date;
    limit?: number;
}): Promise<DedupMetricsModel[]>;
/**
 * 33. Generate deduplication report
 *
 * @param jobId - Job identifier
 * @returns Comprehensive deduplication report
 */
export declare function generateDedupReport(jobId: string): Promise<{
    job: DeduplicationJobModel;
    metrics: DedupMetricsModel[];
    summary: {
        totalDuration: number;
        averageThroughput: number;
        peakDedupRatio: number;
        totalSpaceSaved: number;
        efficiency: number;
    };
}>;
/**
 * 34. Get deduplication statistics by volume
 *
 * @param volumeId - Volume identifier
 * @returns Volume deduplication statistics
 */
export declare function getVolumeDeduplicationStats(volumeId: string): Promise<{
    totalJobs: number;
    completedJobs: number;
    totalSpaceSaved: number;
    averageDedupRatio: number;
    totalBlocks: number;
    duplicateBlocks: number;
}>;
/**
 * 35. Get top duplicate blocks
 *
 * @param limit - Number of results to return
 * @param volumeId - Optional volume filter
 * @returns Top duplicate blocks
 */
export declare function getTopDuplicateBlocks(limit?: number, volumeId?: string): Promise<BlockHashModel[]>;
/**
 * 36. Calculate hash algorithm distribution
 *
 * @param volumeId - Optional volume filter
 * @returns Hash algorithm distribution
 */
export declare function getHashAlgorithmDistribution(volumeId?: string): Promise<Record<string, number>>;
/**
 * 37. Get deduplication job by ID
 *
 * @param jobId - Job identifier
 * @returns DeduplicationJobModel instance
 */
export declare function getDeduplicationJob(jobId: string): Promise<DeduplicationJobModel | null>;
/**
 * 38. List deduplication jobs
 *
 * @param options - Query options
 * @returns Array of jobs
 */
export declare function listDeduplicationJobs(options?: {
    status?: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
    type?: 'inline' | 'post-process';
    volumeId?: string;
    createdBy?: string;
    limit?: number;
    offset?: number;
}): Promise<{
    jobs: DeduplicationJobModel[];
    total: number;
}>;
/**
 * 39. Pause deduplication job
 *
 * @param jobId - Job identifier
 * @param transaction - Optional database transaction
 * @returns Updated job
 */
export declare function pauseDeduplicationJob(jobId: string, transaction?: Transaction): Promise<DeduplicationJobModel>;
/**
 * 40. Resume deduplication job
 *
 * @param jobId - Job identifier
 * @param transaction - Optional database transaction
 * @returns Updated job
 */
export declare function resumeDeduplicationJob(jobId: string, transaction?: Transaction): Promise<DeduplicationJobModel>;
/**
 * 41. Cancel deduplication job
 *
 * @param jobId - Job identifier
 * @param errorMessage - Optional error message
 * @param transaction - Optional database transaction
 * @returns Updated job
 */
export declare function cancelDeduplicationJob(jobId: string, errorMessage?: string, transaction?: Transaction): Promise<DeduplicationJobModel>;
declare const _default: {
    DeduplicationJobModel: typeof DeduplicationJobModel;
    BlockHashModel: typeof BlockHashModel;
    BlockReferenceModel: typeof BlockReferenceModel;
    DedupMetricsModel: typeof DedupMetricsModel;
    initializeDeduplicationModels: typeof initializeDeduplicationModels;
    defineDeduplicationAssociations: typeof defineDeduplicationAssociations;
    calculateSHA256Hash: typeof calculateSHA256Hash;
    calculateMD5Hash: typeof calculateMD5Hash;
    calculateCRC32Hash: typeof calculateCRC32Hash;
    calculateBlockHash: typeof calculateBlockHash;
    findOrCreateBlockHash: typeof findOrCreateBlockHash;
    addBlockReference: typeof addBlockReference;
    processBlock: typeof processBlock;
    processBatchBlocks: typeof processBatchBlocks;
    getBlockHashByValue: typeof getBlockHashByValue;
    getBlockReferences: typeof getBlockReferences;
    removeBlockReference: typeof removeBlockReference;
    verifyBlockIntegrity: typeof verifyBlockIntegrity;
    splitFileIntoChunks: typeof splitFileIntoChunks;
    calculateFileChunkHashes: typeof calculateFileChunkHashes;
    deduplicateFileChunks: typeof deduplicateFileChunks;
    deduplicateFile: typeof deduplicateFile;
    getFileChunkMap: typeof getFileChunkMap;
    reconstructFileFromChunks: typeof reconstructFileFromChunks;
    performInlineDeduplication: typeof performInlineDeduplication;
    createInlineDeduplicationJob: typeof createInlineDeduplicationJob;
    startInlineDeduplicationJob: typeof startInlineDeduplicationJob;
    updateInlineDeduplicationProgress: typeof updateInlineDeduplicationProgress;
    completeInlineDeduplicationJob: typeof completeInlineDeduplicationJob;
    scanVolumeForDuplicates: typeof scanVolumeForDuplicates;
    createPostProcessDeduplicationJob: typeof createPostProcessDeduplicationJob;
    executePostProcessDeduplication: typeof executePostProcessDeduplication;
    optimizeDeduplicationMetadata: typeof optimizeDeduplicationMetadata;
    schedulePostProcessDeduplication: typeof schedulePostProcessDeduplication;
    calculateDedupRatio: typeof calculateDedupRatio;
    calculateSpaceSavingsPercent: typeof calculateSpaceSavingsPercent;
    createDedupMetrics: typeof createDedupMetrics;
    getDedupMetrics: typeof getDedupMetrics;
    generateDedupReport: typeof generateDedupReport;
    getVolumeDeduplicationStats: typeof getVolumeDeduplicationStats;
    getTopDuplicateBlocks: typeof getTopDuplicateBlocks;
    getHashAlgorithmDistribution: typeof getHashAlgorithmDistribution;
    getDeduplicationJob: typeof getDeduplicationJob;
    listDeduplicationJobs: typeof listDeduplicationJobs;
    pauseDeduplicationJob: typeof pauseDeduplicationJob;
    resumeDeduplicationJob: typeof resumeDeduplicationJob;
    cancelDeduplicationJob: typeof cancelDeduplicationJob;
};
export default _default;
//# sourceMappingURL=san-deduplication-kit.d.ts.map