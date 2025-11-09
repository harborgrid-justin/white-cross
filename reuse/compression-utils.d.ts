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
import { Transform } from 'stream';
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
export declare const gzipCompress: (data: string | Buffer, level?: number) => Promise<Buffer>;
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
export declare const gzipDecompress: (data: Buffer, toString?: boolean) => Promise<Buffer | string>;
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
export declare const gzipCompressWithStats: (data: string | Buffer, level?: number) => Promise<CompressionResult>;
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
export declare const gzipCompressToBase64: (data: string, level?: number) => Promise<string>;
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
export declare const gzipDecompressFromBase64: (base64Data: string) => Promise<string>;
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
export declare const brotliCompress: (data: string | Buffer, level?: number) => Promise<Buffer>;
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
export declare const brotliDecompress: (data: Buffer, toString?: boolean) => Promise<Buffer | string>;
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
export declare const brotliCompressWithStats: (data: string | Buffer, level?: number) => Promise<CompressionResult>;
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
export declare const brotliCompressToBase64: (data: string, level?: number) => Promise<string>;
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
export declare const brotliDecompressFromBase64: (base64Data: string) => Promise<string>;
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
export declare const deflateCompress: (data: string | Buffer, level?: number) => Promise<Buffer>;
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
export declare const deflateDecompress: (data: Buffer, toString?: boolean) => Promise<Buffer | string>;
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
export declare const createCompressionStream: (options?: StreamCompressionOptions) => Transform;
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
export declare const createDecompressionStream: (options?: StreamCompressionOptions) => Transform;
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
export declare const compressFileStream: (inputPath: string, outputPath: string, options?: StreamCompressionOptions) => Promise<CompressionResult>;
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
export declare const decompressFileStream: (inputPath: string, outputPath: string, options?: StreamCompressionOptions) => Promise<void>;
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
export declare const createChunkedCompressionStream: (chunkSize?: number, options?: StreamCompressionOptions) => Transform;
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
export declare const compressJSON: (data: any, options?: CompressionOptions) => Promise<string>;
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
export declare const decompressJSON: (compressedData: string) => Promise<any>;
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
export declare const compressJSONBrotli: (data: any, level?: number) => Promise<string>;
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
export declare const decompressJSONBrotli: (compressedData: string) => Promise<any>;
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
export declare const compressDBField: (value: string | null, options?: CompressionOptions) => Promise<string | null>;
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
export declare const decompressDBField: (value: string | null) => Promise<string | null>;
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
export declare const compressDBFields: (record: Record<string, any>, fields: string[], options?: CompressionOptions) => Promise<Record<string, any>>;
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
export declare const decompressDBFields: (record: Record<string, any>, fields: string[]) => Promise<Record<string, any>>;
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
export declare const getOptimalCompressionLevel: (dataSize: number, dataType?: string) => number;
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
export declare const benchmarkCompression: (data: string | Buffer, algorithm?: string) => Promise<{
    level: number;
    ratio: number;
    time: number;
}>;
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
export declare const createCompressionMiddleware: (options?: CompressionMiddlewareOptions) => (req: any, res: any, next: any) => Promise<any>;
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
export declare const compressResponse: (data: any, req: any, options?: CompressionOptions) => Promise<{
    data: any;
    compressed: boolean;
    encoding?: string;
}>;
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
export declare const batchCompress: (items: Array<string | Buffer>, options?: BatchCompressionOptions) => Promise<CompressionResult[]>;
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
export declare const batchDecompress: (items: Buffer[], options?: BatchCompressionOptions) => Promise<Array<string | Buffer>>;
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
export declare const isCompressed: (data: Buffer) => boolean;
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
export declare const estimateCompressionRatio: (data: string | Buffer) => number;
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
export declare const compressBufferArray: (buffers: Buffer[], options?: CompressionOptions) => Promise<Buffer>;
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
export declare const decompressToBufferArray: (compressed: Buffer, sizes: number[]) => Promise<Buffer[]>;
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
export declare const smartCompress: (data: string | Buffer, dataType?: string) => Promise<CompressionResult>;
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
export declare const smartDecompress: (data: Buffer, toString?: boolean) => Promise<Buffer | string>;
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
export declare const createCompressionPipeline: (algorithms: Array<"gzip" | "brotli" | "deflate">, levels?: number[]) => ((data: Buffer) => Promise<Buffer>);
export {};
//# sourceMappingURL=compression-utils.d.ts.map