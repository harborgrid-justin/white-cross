"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DedupMetricsModel = exports.BlockReferenceModel = exports.BlockHashModel = exports.DeduplicationJobModel = void 0;
exports.initializeDeduplicationModels = initializeDeduplicationModels;
exports.defineDeduplicationAssociations = defineDeduplicationAssociations;
exports.calculateSHA256Hash = calculateSHA256Hash;
exports.calculateMD5Hash = calculateMD5Hash;
exports.calculateCRC32Hash = calculateCRC32Hash;
exports.calculateBlockHash = calculateBlockHash;
exports.findOrCreateBlockHash = findOrCreateBlockHash;
exports.addBlockReference = addBlockReference;
exports.processBlock = processBlock;
exports.processBatchBlocks = processBatchBlocks;
exports.getBlockHashByValue = getBlockHashByValue;
exports.getBlockReferences = getBlockReferences;
exports.removeBlockReference = removeBlockReference;
exports.verifyBlockIntegrity = verifyBlockIntegrity;
exports.splitFileIntoChunks = splitFileIntoChunks;
exports.calculateFileChunkHashes = calculateFileChunkHashes;
exports.deduplicateFileChunks = deduplicateFileChunks;
exports.deduplicateFile = deduplicateFile;
exports.getFileChunkMap = getFileChunkMap;
exports.reconstructFileFromChunks = reconstructFileFromChunks;
exports.performInlineDeduplication = performInlineDeduplication;
exports.createInlineDeduplicationJob = createInlineDeduplicationJob;
exports.startInlineDeduplicationJob = startInlineDeduplicationJob;
exports.updateInlineDeduplicationProgress = updateInlineDeduplicationProgress;
exports.completeInlineDeduplicationJob = completeInlineDeduplicationJob;
exports.scanVolumeForDuplicates = scanVolumeForDuplicates;
exports.createPostProcessDeduplicationJob = createPostProcessDeduplicationJob;
exports.executePostProcessDeduplication = executePostProcessDeduplication;
exports.optimizeDeduplicationMetadata = optimizeDeduplicationMetadata;
exports.schedulePostProcessDeduplication = schedulePostProcessDeduplication;
exports.calculateDedupRatio = calculateDedupRatio;
exports.calculateSpaceSavingsPercent = calculateSpaceSavingsPercent;
exports.createDedupMetrics = createDedupMetrics;
exports.getDedupMetrics = getDedupMetrics;
exports.generateDedupReport = generateDedupReport;
exports.getVolumeDeduplicationStats = getVolumeDeduplicationStats;
exports.getTopDuplicateBlocks = getTopDuplicateBlocks;
exports.getHashAlgorithmDistribution = getHashAlgorithmDistribution;
exports.getDeduplicationJob = getDeduplicationJob;
exports.listDeduplicationJobs = listDeduplicationJobs;
exports.pauseDeduplicationJob = pauseDeduplicationJob;
exports.resumeDeduplicationJob = resumeDeduplicationJob;
exports.cancelDeduplicationJob = cancelDeduplicationJob;
const sequelize_1 = require("sequelize");
const crypto_1 = __importDefault(require("crypto"));
const buffer_1 = require("buffer");
// ============================================================================
// Sequelize Models
// ============================================================================
/**
 * DeduplicationJob Model
 * Tracks deduplication job execution and status
 */
class DeduplicationJobModel extends sequelize_1.Model {
}
exports.DeduplicationJobModel = DeduplicationJobModel;
/**
 * BlockHashModel
 * Stores unique block hashes and reference counts
 */
class BlockHashModel extends sequelize_1.Model {
}
exports.BlockHashModel = BlockHashModel;
/**
 * BlockReferenceModel
 * Tracks which files/volumes reference which blocks
 */
class BlockReferenceModel extends sequelize_1.Model {
}
exports.BlockReferenceModel = BlockReferenceModel;
/**
 * DedupMetricsModel
 * Stores deduplication metrics and statistics
 */
class DedupMetricsModel extends sequelize_1.Model {
}
exports.DedupMetricsModel = DedupMetricsModel;
// ============================================================================
// Model Initialization and Associations
// ============================================================================
/**
 * Initialize all Sequelize models for deduplication tracking
 *
 * @param sequelize - Sequelize instance
 */
function initializeDeduplicationModels(sequelize) {
    // Initialize DeduplicationJob model
    DeduplicationJobModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        type: {
            type: sequelize_1.DataTypes.ENUM('inline', 'post-process'),
            allowNull: false,
            validate: {
                isIn: [['inline', 'post-process']],
            },
        },
        scope: {
            type: sequelize_1.DataTypes.ENUM('block', 'file', 'volume'),
            allowNull: false,
            validate: {
                isIn: [['block', 'file', 'volume']],
            },
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'running', 'completed', 'failed', 'paused'),
            allowNull: false,
            defaultValue: 'pending',
            validate: {
                isIn: [['pending', 'running', 'completed', 'failed', 'paused']],
            },
        },
        volumeId: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        targetPath: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        blockSize: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 4096, // 4KB default
            validate: {
                min: 512,
                max: 1048576, // 1MB max
            },
        },
        hashAlgorithm: {
            type: sequelize_1.DataTypes.ENUM('sha256', 'md5', 'crc32', 'xxhash'),
            allowNull: false,
            defaultValue: 'sha256',
            validate: {
                isIn: [['sha256', 'md5', 'crc32', 'xxhash']],
            },
        },
        startedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        completedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        totalBlocks: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
        },
        processedBlocks: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
        },
        duplicateBlocks: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
        },
        spaceSaved: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
        },
        errorMessage: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
    }, {
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
    });
    // Initialize BlockHash model
    BlockHashModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        hash: {
            type: sequelize_1.DataTypes.STRING(128),
            allowNull: false,
            unique: false, // Composite unique with algorithm and blockSize
        },
        algorithm: {
            type: sequelize_1.DataTypes.ENUM('sha256', 'md5', 'crc32', 'xxhash'),
            allowNull: false,
        },
        blockSize: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        firstOccurrenceId: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        occurrenceCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        totalSize: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
        },
        lastAccessedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        compressionEnabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        encryptionEnabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
    }, {
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
    });
    // Initialize BlockReference model
    BlockReferenceModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        blockHashId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'block_hashes',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        fileId: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        volumeId: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        offset: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
        },
        logicalAddress: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        physicalAddress: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
    }, {
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
    });
    // Initialize DedupMetrics model
    DedupMetricsModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        jobId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'deduplication_jobs',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        timestamp: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        totalDataSize: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
        },
        uniqueDataSize: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
        },
        duplicateDataSize: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
        },
        dedupRatio: {
            type: sequelize_1.DataTypes.DECIMAL(10, 4),
            allowNull: false,
        },
        spaceSavings: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
        },
        spaceSavingsPercent: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
        },
        totalBlocks: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
        },
        uniqueBlocks: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
        },
        duplicateBlocks: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
        },
        averageBlockSize: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        hashDistribution: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
        throughput: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
        },
        cpuUsage: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        memoryUsage: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'dedup_metrics',
        timestamps: true,
        indexes: [
            { fields: ['jobId'] },
            { fields: ['timestamp'] },
            { fields: ['dedupRatio'] },
            { fields: ['spaceSavingsPercent'] },
        ],
    });
    // Define associations
    defineDeduplicationAssociations();
}
/**
 * Define associations between deduplication models
 */
function defineDeduplicationAssociations() {
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
function calculateSHA256Hash(data) {
    return crypto_1.default.createHash('sha256').update(data).digest('hex');
}
/**
 * 2. Calculate MD5 hash of a data block
 *
 * @param data - Data buffer to hash
 * @returns MD5 hash as hexadecimal string
 */
function calculateMD5Hash(data) {
    return crypto_1.default.createHash('md5').update(data).digest('hex');
}
/**
 * 3. Calculate CRC32 hash of a data block
 *
 * @param data - Data buffer to hash
 * @returns CRC32 hash as hexadecimal string
 */
function calculateCRC32Hash(data) {
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
function calculateBlockHash(data, algorithm) {
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
async function findOrCreateBlockHash(hash, algorithm, blockSize, firstOccurrenceId, transaction) {
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
        await blockHash.update({
            occurrenceCount: blockHash.occurrenceCount + 1,
            totalSize: blockHash.totalSize + blockSize,
            lastAccessedAt: new Date(),
        }, { transaction });
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
async function addBlockReference(blockHashId, fileId, volumeId, offset, logicalAddress, physicalAddress, transaction) {
    return await BlockReferenceModel.create({
        blockHashId,
        fileId,
        volumeId,
        offset,
        logicalAddress,
        physicalAddress,
    }, { transaction });
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
async function processBlock(data, algorithm, blockSize, blockId, fileId, volumeId, offset, logicalAddress, transaction) {
    const hash = calculateBlockHash(data, algorithm);
    // Check if block hash already exists
    const existingBlockHash = await BlockHashModel.findOne({
        where: { hash, algorithm, blockSize },
        transaction,
    });
    const isDuplicate = existingBlockHash !== null;
    // Find or create block hash
    const blockHash = await findOrCreateBlockHash(hash, algorithm, blockSize, isDuplicate ? existingBlockHash.firstOccurrenceId : blockId, transaction);
    // Add block reference
    await addBlockReference(blockHash.id, fileId, volumeId, offset, logicalAddress, undefined, transaction);
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
async function processBatchBlocks(blocks, algorithm, blockSize, transaction) {
    const results = [];
    for (const block of blocks) {
        const result = await processBlock(block.data, algorithm, blockSize, block.blockId, block.fileId, block.volumeId, block.offset, block.logicalAddress, transaction);
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
async function getBlockHashByValue(hash, algorithm, blockSize) {
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
async function getBlockReferences(blockHashId, options) {
    const where = { blockHashId };
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
async function removeBlockReference(referenceId, transaction) {
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
    }
    else {
        await blockHash.update({
            occurrenceCount: newCount,
            totalSize: blockHash.totalSize - blockHash.blockSize,
        }, { transaction });
    }
    return true;
}
/**
 * 12. Verify block integrity
 *
 * @param blockHashId - Block hash ID
 * @returns DedupVerificationResult
 */
async function verifyBlockIntegrity(blockHashId) {
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
function splitFileIntoChunks(fileData, chunkSize) {
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
function calculateFileChunkHashes(fileData, chunkSize, algorithm) {
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
async function deduplicateFileChunks(fileId, chunks, algorithm, transaction) {
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
            await existingBlockHash.update({
                occurrenceCount: existingBlockHash.occurrenceCount + 1,
                totalSize: existingBlockHash.totalSize + chunk.size,
                lastAccessedAt: new Date(),
            }, { transaction });
        }
        else {
            uniqueChunks++;
            chunk.isDuplicate = false;
            // Create new block hash
            await BlockHashModel.create({
                hash: chunk.hash,
                algorithm,
                blockSize: chunk.size,
                firstOccurrenceId: `${fileId}-${chunk.chunkId}`,
                occurrenceCount: 1,
                totalSize: chunk.size,
                lastAccessedAt: new Date(),
                compressionEnabled: false,
                encryptionEnabled: false,
            }, { transaction });
        }
        // Add block reference
        const blockHash = await getBlockHashByValue(chunk.hash, algorithm, chunk.size);
        if (blockHash) {
            await addBlockReference(blockHash.id, fileId, undefined, chunk.offset, `file-${fileId}-offset-${chunk.offset}`, undefined, transaction);
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
async function deduplicateFile(fileId, fileData, chunkSize, algorithm, transaction) {
    const chunks = calculateFileChunkHashes(fileData, chunkSize, algorithm);
    const { uniqueChunks, duplicateChunks, spaceSaved } = await deduplicateFileChunks(fileId, chunks, algorithm, transaction);
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
async function getFileChunkMap(fileId) {
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
async function reconstructFileFromChunks(fileId, chunkDataMap) {
    const chunkReferences = await getFileChunkMap(fileId);
    // Sort by offset to ensure correct order
    chunkReferences.sort((a, b) => Number(a.offset) - Number(b.offset));
    const chunks = [];
    for (const reference of chunkReferences) {
        const blockHash = await reference.getBlockHash();
        const chunkData = chunkDataMap.get(blockHash.hash);
        if (!chunkData) {
            throw new Error(`Missing chunk data for hash: ${blockHash.hash}`);
        }
        chunks.push(chunkData);
    }
    return buffer_1.Buffer.concat(chunks);
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
async function performInlineDeduplication(data, blockSize, algorithm, volumeId, transaction) {
    const chunks = splitFileIntoChunks(data, blockSize);
    const blockReferences = [];
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
            await existingBlockHash.update({
                occurrenceCount: existingBlockHash.occurrenceCount + 1,
                totalSize: existingBlockHash.totalSize + chunk.size,
                lastAccessedAt: new Date(),
            }, { transaction });
            // Add reference
            const reference = await addBlockReference(existingBlockHash.id, undefined, volumeId, chunk.offset, logicalAddress, undefined, transaction);
            blockReferences.push(reference);
        }
        else {
            uniqueBlocks++;
            // Create new block hash
            const newBlockHash = await BlockHashModel.create({
                hash,
                algorithm,
                blockSize,
                firstOccurrenceId: blockId,
                occurrenceCount: 1,
                totalSize: chunk.size,
                lastAccessedAt: new Date(),
                compressionEnabled: false,
                encryptionEnabled: false,
            }, { transaction });
            // Add reference
            const reference = await addBlockReference(newBlockHash.id, undefined, volumeId, chunk.offset, logicalAddress, undefined, transaction);
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
async function createInlineDeduplicationJob(volumeId, blockSize, algorithm, createdBy, transaction) {
    return await DeduplicationJobModel.create({
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
    }, { transaction });
}
/**
 * 21. Start inline deduplication job
 *
 * @param jobId - Job identifier
 * @param transaction - Optional database transaction
 * @returns Updated job
 */
async function startInlineDeduplicationJob(jobId, transaction) {
    const job = await DeduplicationJobModel.findByPk(jobId, { transaction });
    if (!job) {
        throw new Error(`Deduplication job not found: ${jobId}`);
    }
    return await job.update({
        status: 'running',
        startedAt: new Date(),
    }, { transaction });
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
async function updateInlineDeduplicationProgress(jobId, processedBlocks, duplicateBlocks, spaceSaved, transaction) {
    const job = await DeduplicationJobModel.findByPk(jobId, { transaction });
    if (!job) {
        throw new Error(`Deduplication job not found: ${jobId}`);
    }
    return await job.update({
        processedBlocks: job.processedBlocks + processedBlocks,
        duplicateBlocks: job.duplicateBlocks + duplicateBlocks,
        spaceSaved: job.spaceSaved + spaceSaved,
    }, { transaction });
}
/**
 * 23. Complete inline deduplication job
 *
 * @param jobId - Job identifier
 * @param transaction - Optional database transaction
 * @returns Completed job
 */
async function completeInlineDeduplicationJob(jobId, transaction) {
    const job = await DeduplicationJobModel.findByPk(jobId, { transaction });
    if (!job) {
        throw new Error(`Deduplication job not found: ${jobId}`);
    }
    return await job.update({
        status: 'completed',
        completedAt: new Date(),
    }, { transaction });
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
async function scanVolumeForDuplicates(volumeId, blockSize, algorithm) {
    return await BlockHashModel.findAll({
        where: {
            algorithm,
            blockSize,
            occurrenceCount: {
                [sequelize_1.Op.gt]: 1,
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
async function createPostProcessDeduplicationJob(volumeId, blockSize, algorithm, createdBy, transaction) {
    return await DeduplicationJobModel.create({
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
    }, { transaction });
}
/**
 * 26. Execute post-process deduplication
 *
 * @param jobId - Job identifier
 * @param transaction - Optional database transaction
 * @returns Deduplication result
 */
async function executePostProcessDeduplication(jobId, transaction) {
    const job = await DeduplicationJobModel.findByPk(jobId, { transaction });
    if (!job) {
        throw new Error(`Deduplication job not found: ${jobId}`);
    }
    if (!job.volumeId) {
        throw new Error('Volume ID is required for post-process deduplication');
    }
    // Start the job
    await job.update({
        status: 'running',
        startedAt: new Date(),
    }, { transaction });
    // Scan for duplicates
    const duplicateHashes = await scanVolumeForDuplicates(job.volumeId, job.blockSize, job.hashAlgorithm);
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
    await job.update({
        status: 'completed',
        completedAt: new Date(),
        totalBlocks,
        processedBlocks: totalBlocks,
        duplicateBlocks,
        spaceSaved,
    }, { transaction });
    return { totalBlocks, duplicateBlocks, spaceSaved };
}
/**
 * 27. Optimize deduplication metadata
 *
 * @param volumeId - Volume identifier
 * @param transaction - Optional database transaction
 * @returns Optimization result
 */
async function optimizeDeduplicationMetadata(volumeId, transaction) {
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
        }
        else if (referenceCount !== blockHash.occurrenceCount) {
            // Fix incorrect occurrence count
            await blockHash.update({ occurrenceCount: referenceCount }, { transaction });
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
async function schedulePostProcessDeduplication(volumeId, blockSize, algorithm, scheduledTime, createdBy, transaction) {
    const job = await createPostProcessDeduplicationJob(volumeId, blockSize, algorithm, createdBy, transaction);
    await job.update({
        metadata: {
            scheduledTime: scheduledTime.toISOString(),
            autoStart: true,
        },
    }, { transaction });
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
function calculateDedupRatio(totalDataSize, uniqueDataSize) {
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
function calculateSpaceSavingsPercent(totalDataSize, spaceSaved) {
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
async function createDedupMetrics(jobId, totalDataSize, uniqueDataSize, duplicateDataSize, totalBlocks, uniqueBlocks, duplicateBlocks, averageBlockSize, throughput, hashDistribution, transaction) {
    const dedupRatio = calculateDedupRatio(totalDataSize, uniqueDataSize);
    const spaceSavings = duplicateDataSize;
    const spaceSavingsPercent = calculateSpaceSavingsPercent(totalDataSize, spaceSavings);
    return await DedupMetricsModel.create({
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
    }, { transaction });
}
/**
 * 32. Get deduplication metrics for a job
 *
 * @param jobId - Job identifier
 * @param options - Query options
 * @returns Array of metrics
 */
async function getDedupMetrics(jobId, options) {
    const where = { jobId };
    if (options?.startDate || options?.endDate) {
        where.timestamp = {};
        if (options.startDate) {
            where.timestamp[sequelize_1.Op.gte] = options.startDate;
        }
        if (options.endDate) {
            where.timestamp[sequelize_1.Op.lte] = options.endDate;
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
async function generateDedupReport(jobId) {
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
async function getVolumeDeduplicationStats(volumeId) {
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
async function getTopDuplicateBlocks(limit = 10, volumeId) {
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
                [sequelize_1.Op.gt]: 1,
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
async function getHashAlgorithmDistribution(volumeId) {
    const where = volumeId ? { volumeId } : {};
    const jobs = await DeduplicationJobModel.findAll({ where });
    const distribution = {
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
async function getDeduplicationJob(jobId) {
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
async function listDeduplicationJobs(options) {
    const where = {};
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
async function pauseDeduplicationJob(jobId, transaction) {
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
async function resumeDeduplicationJob(jobId, transaction) {
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
async function cancelDeduplicationJob(jobId, errorMessage, transaction) {
    const job = await DeduplicationJobModel.findByPk(jobId, { transaction });
    if (!job) {
        throw new Error(`Deduplication job not found: ${jobId}`);
    }
    if (job.status === 'completed') {
        throw new Error('Cannot cancel a completed job');
    }
    return await job.update({
        status: 'failed',
        completedAt: new Date(),
        errorMessage: errorMessage || 'Job cancelled by user',
    }, { transaction });
}
// ============================================================================
// Export All Models and Functions
// ============================================================================
exports.default = {
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
//# sourceMappingURL=san-deduplication-kit.js.map