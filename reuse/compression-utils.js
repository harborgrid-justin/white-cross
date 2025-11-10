"use strict";
/**
 * LOC: COMP123456
 * File: /reuse/compression-utils.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - API response handlers
 *   - Database service layers
 *   - File upload/download services
 *   - Cache management modules
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCompressionPipeline = exports.smartDecompress = exports.smartCompress = exports.decompressToBufferArray = exports.compressBufferArray = exports.estimateCompressionRatio = exports.isCompressed = exports.batchDecompress = exports.batchCompress = exports.compressResponse = exports.createCompressionMiddleware = exports.benchmarkCompression = exports.getOptimalCompressionLevel = exports.decompressDBFields = exports.compressDBFields = exports.decompressDBField = exports.compressDBField = exports.decompressJSONBrotli = exports.compressJSONBrotli = exports.decompressJSON = exports.compressJSON = exports.createChunkedCompressionStream = exports.decompressFileStream = exports.compressFileStream = exports.createDecompressionStream = exports.createCompressionStream = exports.deflateDecompress = exports.deflateCompress = exports.brotliDecompressFromBase64 = exports.brotliCompressToBase64 = exports.brotliCompressWithStats = exports.brotliDecompress = exports.brotliCompress = exports.gzipDecompressFromBase64 = exports.gzipCompressToBase64 = exports.gzipCompressWithStats = exports.gzipDecompress = exports.gzipCompress = void 0;
/**
 * File: /reuse/compression-utils.ts
 * Locator: WC-UTL-COMP-001
 * Purpose: Comprehensive Compression Utilities - Gzip, Brotli, streaming, and data compression
 *
 * Upstream: Independent utility module for compression operations
 * Downstream: ../backend/*, API middleware, database layers, file services
 * Dependencies: TypeScript 5.x, Node 18+, zlib, stream
 * Exports: 38 utility functions for compression, decompression, streaming, and optimization
 *
 * LLM Context: Complete compression utilities for White Cross healthcare system.
 * Provides gzip/brotli compression, streaming compression for large files, response
 * compression middleware, database field compression, JSON optimization, and batch
 * compression. Essential for reducing bandwidth and storage in healthcare data systems.
 */
const util_1 = require("util");
const zlib_1 = require("zlib");
const stream_1 = require("stream");
const fs_1 = require("fs");
// ============================================================================
// PROMISIFIED COMPRESSION FUNCTIONS
// ============================================================================
const gzipAsync = (0, util_1.promisify)(zlib_1.gzip);
const gunzipAsync = (0, util_1.promisify)(zlib_1.gunzip);
const brotliCompressAsync = (0, util_1.promisify)(zlib_1.brotliCompress);
const brotliDecompressAsync = (0, util_1.promisify)(zlib_1.brotliDecompress);
const deflateAsync = (0, util_1.promisify)(zlib_1.deflate);
const inflateAsync = (0, util_1.promisify)(zlib_1.inflate);
const pipelineAsync = (0, util_1.promisify)(stream_1.pipeline);
// ============================================================================
// GZIP COMPRESSION/DECOMPRESSION
// ============================================================================
/**
 * Compresses data using gzip algorithm.
 *
 * @param {string | Buffer} data - Data to compress
 * @param {number} [level=6] - Compression level (0-9)
 * @returns {Promise<Buffer>} Compressed data
 *
 * @example
 * ```typescript
 * const compressed = await gzipCompress(largeJsonString, 9);
 * ```
 */
const gzipCompress = async (data, level = 6) => {
    const input = typeof data === 'string' ? Buffer.from(data, 'utf-8') : data;
    return await gzipAsync(input, { level });
};
exports.gzipCompress = gzipCompress;
/**
 * Decompresses gzip-compressed data.
 *
 * @param {Buffer} data - Compressed data
 * @param {boolean} [toString=false] - Whether to return string
 * @returns {Promise<Buffer | string>} Decompressed data
 *
 * @example
 * ```typescript
 * const original = await gzipDecompress(compressed, true);
 * ```
 */
const gzipDecompress = async (data, toString = false) => {
    const decompressed = await gunzipAsync(data);
    return toString ? decompressed.toString('utf-8') : decompressed;
};
exports.gzipDecompress = gzipDecompress;
/**
 * Compresses data with gzip and returns detailed compression info.
 *
 * @param {string | Buffer} data - Data to compress
 * @param {number} [level=6] - Compression level
 * @returns {Promise<CompressionResult>} Compression result with statistics
 *
 * @example
 * ```typescript
 * const result = await gzipCompressWithStats(jsonData, 9);
 * console.log(`Saved ${result.compressionRatio}% space`);
 * ```
 */
const gzipCompressWithStats = async (data, level = 6) => {
    const input = typeof data === 'string' ? Buffer.from(data, 'utf-8') : data;
    const compressed = await gzipAsync(input, { level });
    return {
        compressed,
        originalSize: input.length,
        compressedSize: compressed.length,
        compressionRatio: ((1 - compressed.length / input.length) * 100),
        algorithm: 'gzip',
    };
};
exports.gzipCompressWithStats = gzipCompressWithStats;
/**
 * Compresses string data and returns base64-encoded result.
 *
 * @param {string} data - String data to compress
 * @param {number} [level=6] - Compression level
 * @returns {Promise<string>} Base64-encoded compressed data
 *
 * @example
 * ```typescript
 * const encoded = await gzipCompressToBase64(largeText, 9);
 * // Store in database as text field
 * ```
 */
const gzipCompressToBase64 = async (data, level = 6) => {
    const compressed = await (0, exports.gzipCompress)(data, level);
    return compressed.toString('base64');
};
exports.gzipCompressToBase64 = gzipCompressToBase64;
/**
 * Decompresses base64-encoded gzip data to string.
 *
 * @param {string} base64Data - Base64-encoded compressed data
 * @returns {Promise<string>} Decompressed string
 *
 * @example
 * ```typescript
 * const original = await gzipDecompressFromBase64(encodedData);
 * ```
 */
const gzipDecompressFromBase64 = async (base64Data) => {
    const buffer = Buffer.from(base64Data, 'base64');
    const decompressed = await (0, exports.gzipDecompress)(buffer, true);
    return decompressed;
};
exports.gzipDecompressFromBase64 = gzipDecompressFromBase64;
// ============================================================================
// BROTLI COMPRESSION/DECOMPRESSION
// ============================================================================
/**
 * Compresses data using Brotli algorithm (better compression than gzip).
 *
 * @param {string | Buffer} data - Data to compress
 * @param {number} [level=4] - Compression level (0-11)
 * @returns {Promise<Buffer>} Compressed data
 *
 * @example
 * ```typescript
 * const compressed = await brotliCompress(jsonData, 11);
 * ```
 */
const brotliCompress = async (data, level = 4) => {
    const input = typeof data === 'string' ? Buffer.from(data, 'utf-8') : data;
    return await brotliCompressAsync(input, {
        params: {
            [zlib_1.constants.BROTLI_PARAM_QUALITY]: level,
        },
    });
};
exports.brotliCompress = brotliCompress;
/**
 * Decompresses Brotli-compressed data.
 *
 * @param {Buffer} data - Compressed data
 * @param {boolean} [toString=false] - Whether to return string
 * @returns {Promise<Buffer | string>} Decompressed data
 *
 * @example
 * ```typescript
 * const original = await brotliDecompress(compressed, true);
 * ```
 */
const brotliDecompress = async (data, toString = false) => {
    const decompressed = await brotliDecompressAsync(data);
    return toString ? decompressed.toString('utf-8') : decompressed;
};
exports.brotliDecompress = brotliDecompress;
/**
 * Compresses data with Brotli and returns detailed compression info.
 *
 * @param {string | Buffer} data - Data to compress
 * @param {number} [level=4] - Compression level
 * @returns {Promise<CompressionResult>} Compression result with statistics
 *
 * @example
 * ```typescript
 * const result = await brotliCompressWithStats(largeData, 11);
 * console.log(`Compression ratio: ${result.compressionRatio}%`);
 * ```
 */
const brotliCompressWithStats = async (data, level = 4) => {
    const input = typeof data === 'string' ? Buffer.from(data, 'utf-8') : data;
    const compressed = await (0, exports.brotliCompress)(input, level);
    return {
        compressed,
        originalSize: input.length,
        compressedSize: compressed.length,
        compressionRatio: ((1 - compressed.length / input.length) * 100),
        algorithm: 'brotli',
    };
};
exports.brotliCompressWithStats = brotliCompressWithStats;
/**
 * Compresses string data with Brotli and returns base64-encoded result.
 *
 * @param {string} data - String data to compress
 * @param {number} [level=4] - Compression level
 * @returns {Promise<string>} Base64-encoded compressed data
 *
 * @example
 * ```typescript
 * const encoded = await brotliCompressToBase64(medicalReport, 11);
 * ```
 */
const brotliCompressToBase64 = async (data, level = 4) => {
    const compressed = await (0, exports.brotliCompress)(data, level);
    return compressed.toString('base64');
};
exports.brotliCompressToBase64 = brotliCompressToBase64;
/**
 * Decompresses base64-encoded Brotli data to string.
 *
 * @param {string} base64Data - Base64-encoded compressed data
 * @returns {Promise<string>} Decompressed string
 *
 * @example
 * ```typescript
 * const original = await brotliDecompressFromBase64(encodedData);
 * ```
 */
const brotliDecompressFromBase64 = async (base64Data) => {
    const buffer = Buffer.from(base64Data, 'base64');
    const decompressed = await (0, exports.brotliDecompress)(buffer, true);
    return decompressed;
};
exports.brotliDecompressFromBase64 = brotliDecompressFromBase64;
// ============================================================================
// DEFLATE COMPRESSION/DECOMPRESSION
// ============================================================================
/**
 * Compresses data using deflate algorithm.
 *
 * @param {string | Buffer} data - Data to compress
 * @param {number} [level=6] - Compression level (0-9)
 * @returns {Promise<Buffer>} Compressed data
 *
 * @example
 * ```typescript
 * const compressed = await deflateCompress(data, 9);
 * ```
 */
const deflateCompress = async (data, level = 6) => {
    const input = typeof data === 'string' ? Buffer.from(data, 'utf-8') : data;
    return await deflateAsync(input, { level });
};
exports.deflateCompress = deflateCompress;
/**
 * Decompresses deflate-compressed data.
 *
 * @param {Buffer} data - Compressed data
 * @param {boolean} [toString=false] - Whether to return string
 * @returns {Promise<Buffer | string>} Decompressed data
 *
 * @example
 * ```typescript
 * const original = await deflateDecompress(compressed, true);
 * ```
 */
const deflateDecompress = async (data, toString = false) => {
    const decompressed = await inflateAsync(data);
    return toString ? decompressed.toString('utf-8') : decompressed;
};
exports.deflateDecompress = deflateDecompress;
// ============================================================================
// STREAMING COMPRESSION
// ============================================================================
/**
 * Creates a compression stream for large file processing.
 *
 * @param {StreamCompressionOptions} [options] - Stream compression options
 * @returns {Transform} Compression transform stream
 *
 * @example
 * ```typescript
 * const compressor = createCompressionStream({ algorithm: 'gzip', level: 9 });
 * inputStream.pipe(compressor).pipe(outputStream);
 * ```
 */
const createCompressionStream = (options = {}) => {
    const { algorithm = 'gzip', level = 6, highWaterMark } = options;
    switch (algorithm) {
        case 'brotli':
            return (0, zlib_1.createBrotliCompress)({
                params: {
                    [zlib_1.constants.BROTLI_PARAM_QUALITY]: level,
                },
                highWaterMark,
            });
        case 'deflate':
            return (0, zlib_1.createDeflate)({ level, highWaterMark });
        case 'gzip':
        default:
            return (0, zlib_1.createGzip)({ level, highWaterMark });
    }
};
exports.createCompressionStream = createCompressionStream;
/**
 * Creates a decompression stream for large file processing.
 *
 * @param {StreamCompressionOptions} [options] - Stream decompression options
 * @returns {Transform} Decompression transform stream
 *
 * @example
 * ```typescript
 * const decompressor = createDecompressionStream({ algorithm: 'gzip' });
 * inputStream.pipe(decompressor).pipe(outputStream);
 * ```
 */
const createDecompressionStream = (options = {}) => {
    const { algorithm = 'gzip', highWaterMark } = options;
    switch (algorithm) {
        case 'brotli':
            return (0, zlib_1.createBrotliDecompress)({ highWaterMark });
        case 'deflate':
            return (0, zlib_1.createInflate)({ highWaterMark });
        case 'gzip':
        default:
            return (0, zlib_1.createGunzip)({ highWaterMark });
    }
};
exports.createDecompressionStream = createDecompressionStream;
/**
 * Compresses a file using streaming for memory efficiency.
 *
 * @param {string} inputPath - Input file path
 * @param {string} outputPath - Output file path
 * @param {StreamCompressionOptions} [options] - Compression options
 * @returns {Promise<CompressionResult>} Compression result
 *
 * @example
 * ```typescript
 * await compressFileStream('/data/large-file.json', '/data/large-file.json.gz', {
 *   algorithm: 'gzip',
 *   level: 9
 * });
 * ```
 */
const compressFileStream = async (inputPath, outputPath, options = {}) => {
    const fs = await Promise.resolve().then(() => __importStar(require('fs')));
    const stats = await fs.promises.stat(inputPath);
    const originalSize = stats.size;
    const input = (0, fs_1.createReadStream)(inputPath);
    const output = (0, fs_1.createWriteStream)(outputPath);
    const compressor = (0, exports.createCompressionStream)(options);
    await pipelineAsync(input, compressor, output);
    const compressedStats = await fs.promises.stat(outputPath);
    const compressedSize = compressedStats.size;
    return {
        compressed: Buffer.from(outputPath),
        originalSize,
        compressedSize,
        compressionRatio: ((1 - compressedSize / originalSize) * 100),
        algorithm: options.algorithm || 'gzip',
    };
};
exports.compressFileStream = compressFileStream;
/**
 * Decompresses a file using streaming for memory efficiency.
 *
 * @param {string} inputPath - Input compressed file path
 * @param {string} outputPath - Output file path
 * @param {StreamCompressionOptions} [options] - Decompression options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await decompressFileStream('/data/file.gz', '/data/file.json', {
 *   algorithm: 'gzip'
 * });
 * ```
 */
const decompressFileStream = async (inputPath, outputPath, options = {}) => {
    const input = (0, fs_1.createReadStream)(inputPath);
    const output = (0, fs_1.createWriteStream)(outputPath);
    const decompressor = (0, exports.createDecompressionStream)(options);
    await pipelineAsync(input, decompressor, output);
};
exports.decompressFileStream = decompressFileStream;
/**
 * Creates a chunked compression stream for processing data in chunks.
 *
 * @param {number} [chunkSize=1048576] - Chunk size in bytes (default 1MB)
 * @param {StreamCompressionOptions} [options] - Compression options
 * @returns {Transform} Chunked compression stream
 *
 * @example
 * ```typescript
 * const chunkedCompressor = createChunkedCompressionStream(512 * 1024, { level: 9 });
 * dataStream.pipe(chunkedCompressor).pipe(outputStream);
 * ```
 */
const createChunkedCompressionStream = (chunkSize = 1048576, options = {}) => {
    let buffer = Buffer.alloc(0);
    const compressor = (0, exports.createCompressionStream)(options);
    return new stream_1.Transform({
        transform(chunk, encoding, callback) {
            buffer = Buffer.concat([buffer, chunk]);
            if (buffer.length >= chunkSize) {
                const toCompress = buffer.slice(0, chunkSize);
                buffer = buffer.slice(chunkSize);
                compressor.write(toCompress);
            }
            callback();
        },
        flush(callback) {
            if (buffer.length > 0) {
                compressor.write(buffer);
            }
            compressor.end();
            callback();
        },
    });
};
exports.createChunkedCompressionStream = createChunkedCompressionStream;
// ============================================================================
// JSON COMPRESSION
// ============================================================================
/**
 * Compresses JSON data with optimal algorithm selection.
 *
 * @param {any} data - JSON-serializable data
 * @param {CompressionOptions} [options] - Compression options
 * @returns {Promise<string>} Base64-encoded compressed JSON
 *
 * @example
 * ```typescript
 * const compressed = await compressJSON({ users: [...], records: [...] });
 * // Store in database
 * ```
 */
const compressJSON = async (data, options = {}) => {
    const { level = 6, threshold = 1024 } = options;
    const json = JSON.stringify(data);
    // Don't compress if below threshold
    if (json.length < threshold) {
        return json;
    }
    const compressed = await (0, exports.gzipCompress)(json, level);
    return compressed.toString('base64');
};
exports.compressJSON = compressJSON;
/**
 * Decompresses JSON data from base64-encoded string.
 *
 * @param {string} compressedData - Base64-encoded compressed JSON
 * @returns {Promise<any>} Parsed JSON object
 *
 * @example
 * ```typescript
 * const data = await decompressJSON(compressedFromDB);
 * console.log(data.users);
 * ```
 */
const decompressJSON = async (compressedData) => {
    try {
        // Try to parse as regular JSON first (if wasn't compressed)
        return JSON.parse(compressedData);
    }
    catch {
        // It's compressed, decompress first
        const decompressed = await (0, exports.gzipDecompressFromBase64)(compressedData);
        return JSON.parse(decompressed);
    }
};
exports.decompressJSON = decompressJSON;
/**
 * Compresses JSON with Brotli for maximum compression.
 *
 * @param {any} data - JSON-serializable data
 * @param {number} [level=4] - Compression level
 * @returns {Promise<string>} Base64-encoded compressed JSON
 *
 * @example
 * ```typescript
 * const compressed = await compressJSONBrotli(largeDataset, 11);
 * ```
 */
const compressJSONBrotli = async (data, level = 4) => {
    const json = JSON.stringify(data);
    const compressed = await (0, exports.brotliCompress)(json, level);
    return compressed.toString('base64');
};
exports.compressJSONBrotli = compressJSONBrotli;
/**
 * Decompresses Brotli-compressed JSON data.
 *
 * @param {string} compressedData - Base64-encoded Brotli-compressed JSON
 * @returns {Promise<any>} Parsed JSON object
 *
 * @example
 * ```typescript
 * const data = await decompressJSONBrotli(compressedData);
 * ```
 */
const decompressJSONBrotli = async (compressedData) => {
    const decompressed = await (0, exports.brotliDecompressFromBase64)(compressedData);
    return JSON.parse(decompressed);
};
exports.decompressJSONBrotli = decompressJSONBrotli;
// ============================================================================
// DATABASE FIELD COMPRESSION
// ============================================================================
/**
 * Compresses a database text field for storage.
 *
 * @param {string} value - Text value to compress
 * @param {CompressionOptions} [options] - Compression options
 * @returns {Promise<string | null>} Compressed value or null
 *
 * @example
 * ```typescript
 * const compressed = await compressDBField(medicalNotes, { threshold: 500 });
 * await MedicalRecord.update({ notes: compressed }, { where: { id } });
 * ```
 */
const compressDBField = async (value, options = {}) => {
    if (!value)
        return null;
    const { threshold = 1024, level = 6 } = options;
    // Don't compress small values
    if (value.length < threshold) {
        return value;
    }
    return await (0, exports.gzipCompressToBase64)(value, level);
};
exports.compressDBField = compressDBField;
/**
 * Decompresses a database text field.
 *
 * @param {string | null} value - Compressed text value
 * @returns {Promise<string | null>} Decompressed value or null
 *
 * @example
 * ```typescript
 * const notes = await decompressDBField(record.notes);
 * ```
 */
const decompressDBField = async (value) => {
    if (!value)
        return null;
    try {
        // Try to decompress
        return await (0, exports.gzipDecompressFromBase64)(value);
    }
    catch {
        // Not compressed, return as-is
        return value;
    }
};
exports.decompressDBField = decompressDBField;
/**
 * Compresses multiple database fields in a record.
 *
 * @param {Record<string, any>} record - Database record
 * @param {string[]} fields - Fields to compress
 * @param {CompressionOptions} [options] - Compression options
 * @returns {Promise<Record<string, any>>} Record with compressed fields
 *
 * @example
 * ```typescript
 * const compressed = await compressDBFields(
 *   medicalRecord,
 *   ['notes', 'diagnosis', 'treatment'],
 *   { threshold: 500 }
 * );
 * ```
 */
const compressDBFields = async (record, fields, options = {}) => {
    const result = { ...record };
    for (const field of fields) {
        if (typeof result[field] === 'string') {
            result[field] = await (0, exports.compressDBField)(result[field], options);
        }
    }
    return result;
};
exports.compressDBFields = compressDBFields;
/**
 * Decompresses multiple database fields in a record.
 *
 * @param {Record<string, any>} record - Database record with compressed fields
 * @param {string[]} fields - Fields to decompress
 * @returns {Promise<Record<string, any>>} Record with decompressed fields
 *
 * @example
 * ```typescript
 * const decompressed = await decompressDBFields(
 *   record,
 *   ['notes', 'diagnosis', 'treatment']
 * );
 * ```
 */
const decompressDBFields = async (record, fields) => {
    const result = { ...record };
    for (const field of fields) {
        if (typeof result[field] === 'string') {
            result[field] = await (0, exports.decompressDBField)(result[field]);
        }
    }
    return result;
};
exports.decompressDBFields = decompressDBFields;
// ============================================================================
// COMPRESSION LEVEL OPTIMIZATION
// ============================================================================
/**
 * Determines optimal compression level based on data size and type.
 *
 * @param {number} dataSize - Size of data in bytes
 * @param {string} [dataType='text'] - Type of data (text, json, binary)
 * @returns {number} Recommended compression level
 *
 * @example
 * ```typescript
 * const level = getOptimalCompressionLevel(5000000, 'json');
 * const compressed = await gzipCompress(data, level);
 * ```
 */
const getOptimalCompressionLevel = (dataSize, dataType = 'text') => {
    // For small data, use lower compression (faster)
    if (dataSize < 10000)
        return 1;
    if (dataSize < 100000)
        return 3;
    if (dataSize < 1000000)
        return 6;
    // For large data, optimize based on type
    if (dataType === 'json' || dataType === 'text') {
        return 9; // Maximum compression for text
    }
    return 7; // Balanced for binary data
};
exports.getOptimalCompressionLevel = getOptimalCompressionLevel;
/**
 * Benchmarks different compression levels and returns optimal choice.
 *
 * @param {string | Buffer} data - Sample data to test
 * @param {string} [algorithm='gzip'] - Compression algorithm
 * @returns {Promise<{ level: number; ratio: number; time: number }>} Optimal level info
 *
 * @example
 * ```typescript
 * const optimal = await benchmarkCompression(sampleData, 'gzip');
 * console.log(`Use level ${optimal.level} for ${optimal.ratio}% compression`);
 * ```
 */
const benchmarkCompression = async (data, algorithm = 'gzip') => {
    const input = typeof data === 'string' ? Buffer.from(data, 'utf-8') : data;
    const results = [];
    const levels = algorithm === 'brotli' ? [1, 4, 7, 11] : [1, 3, 6, 9];
    for (const level of levels) {
        const start = Date.now();
        let compressed;
        if (algorithm === 'brotli') {
            compressed = await (0, exports.brotliCompress)(input, level);
        }
        else {
            compressed = await (0, exports.gzipCompress)(input, level);
        }
        const time = Date.now() - start;
        const ratio = ((1 - compressed.length / input.length) * 100);
        results.push({ level, ratio, time });
    }
    // Find best balance of compression ratio and time
    const optimal = results.reduce((best, current) => {
        const bestScore = best.ratio / Math.log(best.time + 1);
        const currentScore = current.ratio / Math.log(current.time + 1);
        return currentScore > bestScore ? current : best;
    });
    return optimal;
};
exports.benchmarkCompression = benchmarkCompression;
// ============================================================================
// RESPONSE COMPRESSION MIDDLEWARE
// ============================================================================
/**
 * Creates Express-compatible compression middleware.
 *
 * @param {CompressionMiddlewareOptions} [options] - Middleware options
 * @returns {Function} Express middleware function
 *
 * @example
 * ```typescript
 * app.use(createCompressionMiddleware({
 *   threshold: 1024,
 *   level: 6,
 *   preferBrotli: true
 * }));
 * ```
 */
const createCompressionMiddleware = (options = {}) => {
    const { threshold = 1024, level = 6, filter, preferBrotli = false, } = options;
    return async (req, res, next) => {
        // Check if should compress
        if (filter && !filter(req, res)) {
            return next();
        }
        const originalSend = res.send.bind(res);
        res.send = async (body) => {
            if (!body || typeof body !== 'string' || body.length < threshold) {
                return originalSend(body);
            }
            // Determine compression algorithm from Accept-Encoding
            const acceptEncoding = req.headers['accept-encoding'] || '';
            let algorithm = null;
            if (preferBrotli && acceptEncoding.includes('br')) {
                algorithm = 'brotli';
            }
            else if (acceptEncoding.includes('gzip')) {
                algorithm = 'gzip';
            }
            else if (acceptEncoding.includes('deflate')) {
                algorithm = 'deflate';
            }
            if (!algorithm) {
                return originalSend(body);
            }
            try {
                let compressed;
                if (algorithm === 'brotli') {
                    compressed = await (0, exports.brotliCompress)(body, level);
                    res.setHeader('Content-Encoding', 'br');
                }
                else if (algorithm === 'gzip') {
                    compressed = await (0, exports.gzipCompress)(body, level);
                    res.setHeader('Content-Encoding', 'gzip');
                }
                else {
                    compressed = await (0, exports.deflateCompress)(body, level);
                    res.setHeader('Content-Encoding', 'deflate');
                }
                res.setHeader('Content-Length', compressed.length);
                res.setHeader('Vary', 'Accept-Encoding');
                return originalSend(compressed);
            }
            catch (error) {
                console.error('Compression middleware error:', error);
                return originalSend(body);
            }
        };
        next();
    };
};
exports.createCompressionMiddleware = createCompressionMiddleware;
/**
 * Compresses API response data conditionally.
 *
 * @param {any} data - Response data
 * @param {any} req - Request object
 * @param {CompressionOptions} [options] - Compression options
 * @returns {Promise<{ data: any; compressed: boolean; encoding?: string }>} Response object
 *
 * @example
 * ```typescript
 * const response = await compressResponse(userData, req, { threshold: 2048 });
 * res.send(response.data);
 * ```
 */
const compressResponse = async (data, req, options = {}) => {
    const serialized = JSON.stringify(data);
    const { threshold = 1024, level = 6 } = options;
    if (serialized.length < threshold) {
        return { data, compressed: false };
    }
    const acceptEncoding = req.headers?.['accept-encoding'] || '';
    if (acceptEncoding.includes('br')) {
        const compressed = await (0, exports.brotliCompress)(serialized, level);
        return {
            data: compressed.toString('base64'),
            compressed: true,
            encoding: 'br',
        };
    }
    else if (acceptEncoding.includes('gzip')) {
        const compressed = await (0, exports.gzipCompress)(serialized, level);
        return {
            data: compressed.toString('base64'),
            compressed: true,
            encoding: 'gzip',
        };
    }
    return { data, compressed: false };
};
exports.compressResponse = compressResponse;
// ============================================================================
// BATCH COMPRESSION
// ============================================================================
/**
 * Compresses multiple items in batch with concurrency control.
 *
 * @param {Array<string | Buffer>} items - Items to compress
 * @param {BatchCompressionOptions} [options] - Batch compression options
 * @returns {Promise<CompressionResult[]>} Array of compression results
 *
 * @example
 * ```typescript
 * const results = await batchCompress(largeTextArray, {
 *   concurrency: 5,
 *   algorithm: 'gzip',
 *   level: 9,
 *   onProgress: (completed, total) => console.log(`${completed}/${total}`)
 * });
 * ```
 */
const batchCompress = async (items, options = {}) => {
    const { concurrency = 5, algorithm = 'gzip', level = 6, onProgress, } = options;
    const results = [];
    let completed = 0;
    for (let i = 0; i < items.length; i += concurrency) {
        const batch = items.slice(i, i + concurrency);
        const batchResults = await Promise.all(batch.map(async (item) => {
            const input = typeof item === 'string' ? Buffer.from(item, 'utf-8') : item;
            let compressed;
            if (algorithm === 'brotli') {
                compressed = await (0, exports.brotliCompress)(input, level);
            }
            else {
                compressed = await (0, exports.gzipCompress)(input, level);
            }
            completed++;
            if (onProgress) {
                onProgress(completed, items.length);
            }
            return {
                compressed,
                originalSize: input.length,
                compressedSize: compressed.length,
                compressionRatio: ((1 - compressed.length / input.length) * 100),
                algorithm,
            };
        }));
        results.push(...batchResults);
    }
    return results;
};
exports.batchCompress = batchCompress;
/**
 * Decompresses multiple items in batch with concurrency control.
 *
 * @param {Buffer[]} items - Compressed items to decompress
 * @param {BatchCompressionOptions} [options] - Batch decompression options
 * @returns {Promise<Array<string | Buffer>>} Array of decompressed items
 *
 * @example
 * ```typescript
 * const decompressed = await batchDecompress(compressedItems, {
 *   concurrency: 5,
 *   algorithm: 'gzip'
 * });
 * ```
 */
const batchDecompress = async (items, options = {}) => {
    const { concurrency = 5, algorithm = 'gzip', onProgress, } = options;
    const results = [];
    let completed = 0;
    for (let i = 0; i < items.length; i += concurrency) {
        const batch = items.slice(i, i + concurrency);
        const batchResults = await Promise.all(batch.map(async (item) => {
            let decompressed;
            if (algorithm === 'brotli') {
                decompressed = await (0, exports.brotliDecompress)(item, true);
            }
            else {
                decompressed = await (0, exports.gzipDecompress)(item, true);
            }
            completed++;
            if (onProgress) {
                onProgress(completed, items.length);
            }
            return decompressed;
        }));
        results.push(...batchResults);
    }
    return results;
};
exports.batchDecompress = batchDecompress;
// ============================================================================
// COMPRESSION UTILITIES
// ============================================================================
/**
 * Checks if data is already compressed.
 *
 * @param {Buffer} data - Data to check
 * @returns {boolean} Whether data appears to be compressed
 *
 * @example
 * ```typescript
 * if (isCompressed(buffer)) {
 *   console.log('Data is already compressed');
 * }
 * ```
 */
const isCompressed = (data) => {
    // Check for gzip magic number
    if (data.length >= 2 && data[0] === 0x1f && data[1] === 0x8b) {
        return true;
    }
    // Check for deflate
    if (data.length >= 2 && data[0] === 0x78 && (data[1] === 0x01 || data[1] === 0x9c || data[1] === 0xda)) {
        return true;
    }
    return false;
};
exports.isCompressed = isCompressed;
/**
 * Calculates potential compression ratio without actually compressing.
 *
 * @param {string | Buffer} data - Data to estimate
 * @returns {number} Estimated compression ratio (0-100)
 *
 * @example
 * ```typescript
 * const ratio = estimateCompressionRatio(jsonData);
 * if (ratio > 50) {
 *   console.log('High compression potential');
 * }
 * ```
 */
const estimateCompressionRatio = (data) => {
    const input = typeof data === 'string' ? Buffer.from(data, 'utf-8') : data;
    // Count repeated patterns (simple heuristic)
    const uniqueBytes = new Set(input).size;
    const repetitionFactor = 1 - (uniqueBytes / 256);
    // Estimate based on repetition and data size
    const baseRatio = repetitionFactor * 60; // Up to 60% for highly repetitive data
    const sizeBonus = Math.min(20, input.length / 10000); // Bonus for larger data
    return Math.min(90, baseRatio + sizeBonus);
};
exports.estimateCompressionRatio = estimateCompressionRatio;
/**
 * Compresses Buffer array data efficiently.
 *
 * @param {Buffer[]} buffers - Array of buffers to compress
 * @param {CompressionOptions} [options] - Compression options
 * @returns {Promise<Buffer>} Single compressed buffer
 *
 * @example
 * ```typescript
 * const compressed = await compressBufferArray([buffer1, buffer2, buffer3]);
 * ```
 */
const compressBufferArray = async (buffers, options = {}) => {
    const combined = Buffer.concat(buffers);
    const { level = 6 } = options;
    return await (0, exports.gzipCompress)(combined, level);
};
exports.compressBufferArray = compressBufferArray;
/**
 * Decompresses data back into an array of buffers.
 *
 * @param {Buffer} compressed - Compressed buffer
 * @param {number[]} sizes - Original sizes of each buffer
 * @returns {Promise<Buffer[]>} Array of decompressed buffers
 *
 * @example
 * ```typescript
 * const buffers = await decompressToBufferArray(compressed, [1024, 2048, 512]);
 * ```
 */
const decompressToBufferArray = async (compressed, sizes) => {
    const decompressed = await (0, exports.gzipDecompress)(compressed);
    const buffers = [];
    let offset = 0;
    for (const size of sizes) {
        buffers.push(decompressed.slice(offset, offset + size));
        offset += size;
    }
    return buffers;
};
exports.decompressToBufferArray = decompressToBufferArray;
/**
 * Compresses data with automatic algorithm selection based on data type.
 *
 * @param {string | Buffer} data - Data to compress
 * @param {string} [dataType='auto'] - Data type hint (auto, text, json, binary)
 * @returns {Promise<CompressionResult>} Compression result
 *
 * @example
 * ```typescript
 * const result = await smartCompress(jsonData, 'json');
 * console.log(`Used ${result.algorithm} with ${result.compressionRatio}% ratio`);
 * ```
 */
const smartCompress = async (data, dataType = 'auto') => {
    const input = typeof data === 'string' ? Buffer.from(data, 'utf-8') : data;
    // Determine optimal algorithm and level
    let algorithm = 'gzip';
    let level = 6;
    if (dataType === 'json' || dataType === 'text') {
        algorithm = 'brotli';
        level = input.length > 100000 ? 11 : 4;
    }
    else if (dataType === 'binary') {
        algorithm = 'gzip';
        level = 6;
    }
    else {
        // Auto-detect
        const estimatedRatio = (0, exports.estimateCompressionRatio)(input);
        if (estimatedRatio > 50) {
            algorithm = 'brotli';
            level = 11;
        }
    }
    if (algorithm === 'brotli') {
        return await (0, exports.brotliCompressWithStats)(input, level);
    }
    else {
        return await (0, exports.gzipCompressWithStats)(input, level);
    }
};
exports.smartCompress = smartCompress;
/**
 * Decompresses data automatically detecting the compression algorithm.
 *
 * @param {Buffer} data - Compressed data
 * @param {boolean} [toString=false] - Whether to return string
 * @returns {Promise<Buffer | string>} Decompressed data
 *
 * @example
 * ```typescript
 * const original = await smartDecompress(compressedData, true);
 * ```
 */
const smartDecompress = async (data, toString = false) => {
    // Detect compression type by magic bytes
    if (data.length >= 2 && data[0] === 0x1f && data[1] === 0x8b) {
        // Gzip
        return await (0, exports.gzipDecompress)(data, toString);
    }
    else if (data.length >= 1 && data[0] === 0xce) {
        // Brotli (simple detection)
        return await (0, exports.brotliDecompress)(data, toString);
    }
    else {
        // Try deflate
        try {
            return await (0, exports.deflateDecompress)(data, toString);
        }
        catch {
            // Not compressed, return as-is
            return toString ? data.toString('utf-8') : data;
        }
    }
};
exports.smartDecompress = smartDecompress;
/**
 * Creates a compression pipeline for chaining multiple operations.
 *
 * @param {Array<'gzip' | 'brotli' | 'deflate'>} algorithms - Compression algorithms to apply
 * @param {number[]} [levels] - Compression levels for each algorithm
 * @returns {(data: Buffer) => Promise<Buffer>} Compression pipeline function
 *
 * @example
 * ```typescript
 * const pipeline = createCompressionPipeline(['deflate', 'gzip'], [6, 9]);
 * const compressed = await pipeline(dataBuffer);
 * ```
 */
const createCompressionPipeline = (algorithms, levels) => {
    return async (data) => {
        let result = data;
        for (let i = 0; i < algorithms.length; i++) {
            const algorithm = algorithms[i];
            const level = levels?.[i] || 6;
            if (algorithm === 'brotli') {
                result = await (0, exports.brotliCompress)(result, level);
            }
            else if (algorithm === 'deflate') {
                result = await (0, exports.deflateCompress)(result, level);
            }
            else {
                result = await (0, exports.gzipCompress)(result, level);
            }
        }
        return result;
    };
};
exports.createCompressionPipeline = createCompressionPipeline;
//# sourceMappingURL=compression-utils.js.map