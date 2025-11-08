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

import { promisify } from 'util';
import { createGzip, createGunzip, createBrotliCompress, createBrotliDecompress, createDeflate, createInflate, gzip as zlibGzip, gunzip as zlibGunzip, brotliCompress as zlibBrotliCompress, brotliDecompress as zlibBrotliDecompress, deflate as zlibDeflate, inflate as zlibInflate, constants as zlibConstants } from 'zlib';
import { pipeline, Readable, Transform } from 'stream';
import { createReadStream, createWriteStream } from 'fs';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface CompressionOptions {
  level?: number;
  threshold?: number;
  filter?: (data: any) => boolean;
  chunkSize?: number;
}

interface CompressionResult {
  compressed: Buffer | string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  algorithm: string;
}

interface StreamCompressionOptions {
  algorithm?: 'gzip' | 'brotli' | 'deflate';
  level?: number;
  highWaterMark?: number;
}

interface BatchCompressionOptions {
  concurrency?: number;
  algorithm?: 'gzip' | 'brotli' | 'deflate';
  level?: number;
  onProgress?: (completed: number, total: number) => void;
}

interface CompressionMiddlewareOptions {
  threshold?: number;
  level?: number;
  filter?: (req: any, res: any) => boolean;
  preferBrotli?: boolean;
}

// ============================================================================
// PROMISIFIED COMPRESSION FUNCTIONS
// ============================================================================

const gzipAsync = promisify(zlibGzip);
const gunzipAsync = promisify(zlibGunzip);
const brotliCompressAsync = promisify(zlibBrotliCompress);
const brotliDecompressAsync = promisify(zlibBrotliDecompress);
const deflateAsync = promisify(zlibDeflate);
const inflateAsync = promisify(zlibInflate);
const pipelineAsync = promisify(pipeline);

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
export const gzipCompress = async (
  data: string | Buffer,
  level: number = 6,
): Promise<Buffer> => {
  const input = typeof data === 'string' ? Buffer.from(data, 'utf-8') : data;
  return await gzipAsync(input, { level });
};

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
export const gzipDecompress = async (
  data: Buffer,
  toString: boolean = false,
): Promise<Buffer | string> => {
  const decompressed = await gunzipAsync(data);
  return toString ? decompressed.toString('utf-8') : decompressed;
};

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
export const gzipCompressWithStats = async (
  data: string | Buffer,
  level: number = 6,
): Promise<CompressionResult> => {
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
export const gzipCompressToBase64 = async (
  data: string,
  level: number = 6,
): Promise<string> => {
  const compressed = await gzipCompress(data, level);
  return compressed.toString('base64');
};

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
export const gzipDecompressFromBase64 = async (
  base64Data: string,
): Promise<string> => {
  const buffer = Buffer.from(base64Data, 'base64');
  const decompressed = await gzipDecompress(buffer, true);
  return decompressed as string;
};

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
export const brotliCompress = async (
  data: string | Buffer,
  level: number = 4,
): Promise<Buffer> => {
  const input = typeof data === 'string' ? Buffer.from(data, 'utf-8') : data;
  return await brotliCompressAsync(input, {
    params: {
      [zlibConstants.BROTLI_PARAM_QUALITY]: level,
    },
  });
};

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
export const brotliDecompress = async (
  data: Buffer,
  toString: boolean = false,
): Promise<Buffer | string> => {
  const decompressed = await brotliDecompressAsync(data);
  return toString ? decompressed.toString('utf-8') : decompressed;
};

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
export const brotliCompressWithStats = async (
  data: string | Buffer,
  level: number = 4,
): Promise<CompressionResult> => {
  const input = typeof data === 'string' ? Buffer.from(data, 'utf-8') : data;
  const compressed = await brotliCompress(input, level);

  return {
    compressed,
    originalSize: input.length,
    compressedSize: compressed.length,
    compressionRatio: ((1 - compressed.length / input.length) * 100),
    algorithm: 'brotli',
  };
};

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
export const brotliCompressToBase64 = async (
  data: string,
  level: number = 4,
): Promise<string> => {
  const compressed = await brotliCompress(data, level);
  return compressed.toString('base64');
};

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
export const brotliDecompressFromBase64 = async (
  base64Data: string,
): Promise<string> => {
  const buffer = Buffer.from(base64Data, 'base64');
  const decompressed = await brotliDecompress(buffer, true);
  return decompressed as string;
};

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
export const deflateCompress = async (
  data: string | Buffer,
  level: number = 6,
): Promise<Buffer> => {
  const input = typeof data === 'string' ? Buffer.from(data, 'utf-8') : data;
  return await deflateAsync(input, { level });
};

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
export const deflateDecompress = async (
  data: Buffer,
  toString: boolean = false,
): Promise<Buffer | string> => {
  const decompressed = await inflateAsync(data);
  return toString ? decompressed.toString('utf-8') : decompressed;
};

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
export const createCompressionStream = (
  options: StreamCompressionOptions = {},
): Transform => {
  const { algorithm = 'gzip', level = 6, highWaterMark } = options;

  switch (algorithm) {
    case 'brotli':
      return createBrotliCompress({
        params: {
          [zlibConstants.BROTLI_PARAM_QUALITY]: level,
        },
        highWaterMark,
      });
    case 'deflate':
      return createDeflate({ level, highWaterMark });
    case 'gzip':
    default:
      return createGzip({ level, highWaterMark });
  }
};

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
export const createDecompressionStream = (
  options: StreamCompressionOptions = {},
): Transform => {
  const { algorithm = 'gzip', highWaterMark } = options;

  switch (algorithm) {
    case 'brotli':
      return createBrotliDecompress({ highWaterMark });
    case 'deflate':
      return createInflate({ highWaterMark });
    case 'gzip':
    default:
      return createGunzip({ highWaterMark });
  }
};

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
export const compressFileStream = async (
  inputPath: string,
  outputPath: string,
  options: StreamCompressionOptions = {},
): Promise<CompressionResult> => {
  const fs = await import('fs');
  const stats = await fs.promises.stat(inputPath);
  const originalSize = stats.size;

  const input = createReadStream(inputPath);
  const output = createWriteStream(outputPath);
  const compressor = createCompressionStream(options);

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
export const decompressFileStream = async (
  inputPath: string,
  outputPath: string,
  options: StreamCompressionOptions = {},
): Promise<void> => {
  const input = createReadStream(inputPath);
  const output = createWriteStream(outputPath);
  const decompressor = createDecompressionStream(options);

  await pipelineAsync(input, decompressor, output);
};

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
export const createChunkedCompressionStream = (
  chunkSize: number = 1048576,
  options: StreamCompressionOptions = {},
): Transform => {
  let buffer = Buffer.alloc(0);
  const compressor = createCompressionStream(options);

  return new Transform({
    transform(chunk: Buffer, encoding, callback) {
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
export const compressJSON = async (
  data: any,
  options: CompressionOptions = {},
): Promise<string> => {
  const { level = 6, threshold = 1024 } = options;
  const json = JSON.stringify(data);

  // Don't compress if below threshold
  if (json.length < threshold) {
    return json;
  }

  const compressed = await gzipCompress(json, level);
  return compressed.toString('base64');
};

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
export const decompressJSON = async (
  compressedData: string,
): Promise<any> => {
  try {
    // Try to parse as regular JSON first (if wasn't compressed)
    return JSON.parse(compressedData);
  } catch {
    // It's compressed, decompress first
    const decompressed = await gzipDecompressFromBase64(compressedData);
    return JSON.parse(decompressed);
  }
};

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
export const compressJSONBrotli = async (
  data: any,
  level: number = 4,
): Promise<string> => {
  const json = JSON.stringify(data);
  const compressed = await brotliCompress(json, level);
  return compressed.toString('base64');
};

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
export const decompressJSONBrotli = async (
  compressedData: string,
): Promise<any> => {
  const decompressed = await brotliDecompressFromBase64(compressedData);
  return JSON.parse(decompressed);
};

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
export const compressDBField = async (
  value: string | null,
  options: CompressionOptions = {},
): Promise<string | null> => {
  if (!value) return null;

  const { threshold = 1024, level = 6 } = options;

  // Don't compress small values
  if (value.length < threshold) {
    return value;
  }

  return await gzipCompressToBase64(value, level);
};

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
export const decompressDBField = async (
  value: string | null,
): Promise<string | null> => {
  if (!value) return null;

  try {
    // Try to decompress
    return await gzipDecompressFromBase64(value);
  } catch {
    // Not compressed, return as-is
    return value;
  }
};

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
export const compressDBFields = async (
  record: Record<string, any>,
  fields: string[],
  options: CompressionOptions = {},
): Promise<Record<string, any>> => {
  const result = { ...record };

  for (const field of fields) {
    if (typeof result[field] === 'string') {
      result[field] = await compressDBField(result[field], options);
    }
  }

  return result;
};

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
export const decompressDBFields = async (
  record: Record<string, any>,
  fields: string[],
): Promise<Record<string, any>> => {
  const result = { ...record };

  for (const field of fields) {
    if (typeof result[field] === 'string') {
      result[field] = await decompressDBField(result[field]);
    }
  }

  return result;
};

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
export const getOptimalCompressionLevel = (
  dataSize: number,
  dataType: string = 'text',
): number => {
  // For small data, use lower compression (faster)
  if (dataSize < 10000) return 1;
  if (dataSize < 100000) return 3;
  if (dataSize < 1000000) return 6;

  // For large data, optimize based on type
  if (dataType === 'json' || dataType === 'text') {
    return 9; // Maximum compression for text
  }

  return 7; // Balanced for binary data
};

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
export const benchmarkCompression = async (
  data: string | Buffer,
  algorithm: string = 'gzip',
): Promise<{ level: number; ratio: number; time: number }> => {
  const input = typeof data === 'string' ? Buffer.from(data, 'utf-8') : data;
  const results: Array<{ level: number; ratio: number; time: number }> = [];

  const levels = algorithm === 'brotli' ? [1, 4, 7, 11] : [1, 3, 6, 9];

  for (const level of levels) {
    const start = Date.now();
    let compressed: Buffer;

    if (algorithm === 'brotli') {
      compressed = await brotliCompress(input, level);
    } else {
      compressed = await gzipCompress(input, level);
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
export const createCompressionMiddleware = (
  options: CompressionMiddlewareOptions = {},
) => {
  const {
    threshold = 1024,
    level = 6,
    filter,
    preferBrotli = false,
  } = options;

  return async (req: any, res: any, next: any) => {
    // Check if should compress
    if (filter && !filter(req, res)) {
      return next();
    }

    const originalSend = res.send.bind(res);

    res.send = async (body: any) => {
      if (!body || typeof body !== 'string' || body.length < threshold) {
        return originalSend(body);
      }

      // Determine compression algorithm from Accept-Encoding
      const acceptEncoding = req.headers['accept-encoding'] || '';
      let algorithm: 'brotli' | 'gzip' | 'deflate' | null = null;

      if (preferBrotli && acceptEncoding.includes('br')) {
        algorithm = 'brotli';
      } else if (acceptEncoding.includes('gzip')) {
        algorithm = 'gzip';
      } else if (acceptEncoding.includes('deflate')) {
        algorithm = 'deflate';
      }

      if (!algorithm) {
        return originalSend(body);
      }

      try {
        let compressed: Buffer;

        if (algorithm === 'brotli') {
          compressed = await brotliCompress(body, level);
          res.setHeader('Content-Encoding', 'br');
        } else if (algorithm === 'gzip') {
          compressed = await gzipCompress(body, level);
          res.setHeader('Content-Encoding', 'gzip');
        } else {
          compressed = await deflateCompress(body, level);
          res.setHeader('Content-Encoding', 'deflate');
        }

        res.setHeader('Content-Length', compressed.length);
        res.setHeader('Vary', 'Accept-Encoding');
        return originalSend(compressed);
      } catch (error) {
        console.error('Compression middleware error:', error);
        return originalSend(body);
      }
    };

    next();
  };
};

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
export const compressResponse = async (
  data: any,
  req: any,
  options: CompressionOptions = {},
): Promise<{ data: any; compressed: boolean; encoding?: string }> => {
  const serialized = JSON.stringify(data);
  const { threshold = 1024, level = 6 } = options;

  if (serialized.length < threshold) {
    return { data, compressed: false };
  }

  const acceptEncoding = req.headers?.['accept-encoding'] || '';

  if (acceptEncoding.includes('br')) {
    const compressed = await brotliCompress(serialized, level);
    return {
      data: compressed.toString('base64'),
      compressed: true,
      encoding: 'br',
    };
  } else if (acceptEncoding.includes('gzip')) {
    const compressed = await gzipCompress(serialized, level);
    return {
      data: compressed.toString('base64'),
      compressed: true,
      encoding: 'gzip',
    };
  }

  return { data, compressed: false };
};

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
export const batchCompress = async (
  items: Array<string | Buffer>,
  options: BatchCompressionOptions = {},
): Promise<CompressionResult[]> => {
  const {
    concurrency = 5,
    algorithm = 'gzip',
    level = 6,
    onProgress,
  } = options;

  const results: CompressionResult[] = [];
  let completed = 0;

  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);

    const batchResults = await Promise.all(
      batch.map(async (item) => {
        const input = typeof item === 'string' ? Buffer.from(item, 'utf-8') : item;
        let compressed: Buffer;

        if (algorithm === 'brotli') {
          compressed = await brotliCompress(input, level);
        } else {
          compressed = await gzipCompress(input, level);
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
      }),
    );

    results.push(...batchResults);
  }

  return results;
};

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
export const batchDecompress = async (
  items: Buffer[],
  options: BatchCompressionOptions = {},
): Promise<Array<string | Buffer>> => {
  const {
    concurrency = 5,
    algorithm = 'gzip',
    onProgress,
  } = options;

  const results: Array<string | Buffer> = [];
  let completed = 0;

  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);

    const batchResults = await Promise.all(
      batch.map(async (item) => {
        let decompressed: Buffer | string;

        if (algorithm === 'brotli') {
          decompressed = await brotliDecompress(item, true);
        } else {
          decompressed = await gzipDecompress(item, true);
        }

        completed++;
        if (onProgress) {
          onProgress(completed, items.length);
        }

        return decompressed;
      }),
    );

    results.push(...batchResults);
  }

  return results;
};

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
export const isCompressed = (data: Buffer): boolean => {
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
export const estimateCompressionRatio = (
  data: string | Buffer,
): number => {
  const input = typeof data === 'string' ? Buffer.from(data, 'utf-8') : data;

  // Count repeated patterns (simple heuristic)
  const uniqueBytes = new Set(input).size;
  const repetitionFactor = 1 - (uniqueBytes / 256);

  // Estimate based on repetition and data size
  const baseRatio = repetitionFactor * 60; // Up to 60% for highly repetitive data
  const sizeBonus = Math.min(20, input.length / 10000); // Bonus for larger data

  return Math.min(90, baseRatio + sizeBonus);
};

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
export const compressBufferArray = async (
  buffers: Buffer[],
  options: CompressionOptions = {},
): Promise<Buffer> => {
  const combined = Buffer.concat(buffers);
  const { level = 6 } = options;
  return await gzipCompress(combined, level);
};

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
export const decompressToBufferArray = async (
  compressed: Buffer,
  sizes: number[],
): Promise<Buffer[]> => {
  const decompressed = await gzipDecompress(compressed) as Buffer;
  const buffers: Buffer[] = [];
  let offset = 0;

  for (const size of sizes) {
    buffers.push(decompressed.slice(offset, offset + size));
    offset += size;
  }

  return buffers;
};

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
export const smartCompress = async (
  data: string | Buffer,
  dataType: string = 'auto',
): Promise<CompressionResult> => {
  const input = typeof data === 'string' ? Buffer.from(data, 'utf-8') : data;

  // Determine optimal algorithm and level
  let algorithm: 'gzip' | 'brotli' = 'gzip';
  let level = 6;

  if (dataType === 'json' || dataType === 'text') {
    algorithm = 'brotli';
    level = input.length > 100000 ? 11 : 4;
  } else if (dataType === 'binary') {
    algorithm = 'gzip';
    level = 6;
  } else {
    // Auto-detect
    const estimatedRatio = estimateCompressionRatio(input);
    if (estimatedRatio > 50) {
      algorithm = 'brotli';
      level = 11;
    }
  }

  if (algorithm === 'brotli') {
    return await brotliCompressWithStats(input, level);
  } else {
    return await gzipCompressWithStats(input, level);
  }
};

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
export const smartDecompress = async (
  data: Buffer,
  toString: boolean = false,
): Promise<Buffer | string> => {
  // Detect compression type by magic bytes
  if (data.length >= 2 && data[0] === 0x1f && data[1] === 0x8b) {
    // Gzip
    return await gzipDecompress(data, toString);
  } else if (data.length >= 1 && data[0] === 0xce) {
    // Brotli (simple detection)
    return await brotliDecompress(data, toString);
  } else {
    // Try deflate
    try {
      return await deflateDecompress(data, toString);
    } catch {
      // Not compressed, return as-is
      return toString ? data.toString('utf-8') : data;
    }
  }
};

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
export const createCompressionPipeline = (
  algorithms: Array<'gzip' | 'brotli' | 'deflate'>,
  levels?: number[],
): ((data: Buffer) => Promise<Buffer>) => {
  return async (data: Buffer): Promise<Buffer> => {
    let result = data;

    for (let i = 0; i < algorithms.length; i++) {
      const algorithm = algorithms[i];
      const level = levels?.[i] || 6;

      if (algorithm === 'brotli') {
        result = await brotliCompress(result, level);
      } else if (algorithm === 'deflate') {
        result = await deflateCompress(result, level);
      } else {
        result = await gzipCompress(result, level);
      }
    }

    return result;
  };
};
