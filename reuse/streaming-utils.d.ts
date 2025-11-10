/**
 * LOC: STR1234567
 * File: /reuse/streaming-utils.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - File upload services
 *   - Video streaming services
 *   - Real-time data services
 *   - SSE endpoints
 */
/**
 * File: /reuse/streaming-utils.ts
 * Locator: WC-UTL-STR-004
 * Purpose: Streaming Utilities - Comprehensive stream handling and processing helpers
 *
 * Upstream: Independent utility module for streaming operations
 * Downstream: ../backend/*, File services, SSE handlers, Real-time services
 * Dependencies: TypeScript 5.x, Node 18+, Node Streams API
 * Exports: 40 utility functions for readable/writable/transform streams, SSE, backpressure
 *
 * LLM Context: Comprehensive streaming utilities for White Cross system.
 * Provides stream creation, transformation, piping, backpressure handling, buffering,
 * splitting, merging, filtering, mapping, chunking, large file streaming, SSE helpers,
 * error handling, and progress tracking. Essential for efficient data processing and
 * real-time communication in healthcare applications.
 */
import { Readable, Writable, Transform, PassThrough } from 'stream';
interface StreamOptions {
    highWaterMark?: number;
    encoding?: BufferEncoding;
    objectMode?: boolean;
}
interface ChunkOptions {
    size: number;
    overlap?: number;
}
interface ProgressInfo {
    bytesProcessed: number;
    totalBytes?: number;
    percentage?: number;
    startTime: number;
    elapsedMs: number;
    bytesPerSecond: number;
}
interface SSEMessage {
    id?: string;
    event?: string;
    data: string | object;
    retry?: number;
}
interface StreamStats {
    chunksProcessed: number;
    bytesProcessed: number;
    errorsEncountered: number;
    startTime: number;
    endTime?: number;
}
interface BackpressureOptions {
    maxBufferSize: number;
    pauseThreshold: number;
    resumeThreshold: number;
}
/**
 * Creates a readable stream from an array of data.
 *
 * @template T
 * @param {T[]} data - Array of data items
 * @param {StreamOptions} [options] - Stream options
 * @returns {Readable} Readable stream
 *
 * @example
 * ```typescript
 * const stream = createReadableFromArray([1, 2, 3, 4, 5]);
 * stream.on('data', (chunk) => console.log(chunk));
 * ```
 */
export declare const createReadableFromArray: <T>(data: T[], options?: StreamOptions) => Readable;
/**
 * Creates a readable stream from a string.
 *
 * @param {string} str - String data
 * @param {StreamOptions} [options] - Stream options
 * @returns {Readable} Readable stream
 *
 * @example
 * ```typescript
 * const stream = createReadableFromString('Hello, World!');
 * stream.pipe(process.stdout);
 * ```
 */
export declare const createReadableFromString: (str: string, options?: StreamOptions) => Readable;
/**
 * Creates a readable stream from a buffer.
 *
 * @param {Buffer} buffer - Buffer data
 * @param {StreamOptions} [options] - Stream options
 * @returns {Readable} Readable stream
 *
 * @example
 * ```typescript
 * const buffer = Buffer.from('Hello, World!');
 * const stream = createReadableFromBuffer(buffer);
 * ```
 */
export declare const createReadableFromBuffer: (buffer: Buffer, options?: StreamOptions) => Readable;
/**
 * Creates a readable stream that emits data at intervals.
 *
 * @template T
 * @param {() => T | null} generator - Function that generates data
 * @param {number} intervalMs - Interval in milliseconds
 * @param {StreamOptions} [options] - Stream options
 * @returns {Readable} Readable stream
 *
 * @example
 * ```typescript
 * let count = 0;
 * const stream = createIntervalStream(() => count++ < 10 ? count : null, 1000);
 * // Emits 1, 2, 3, ... 10 every second
 * ```
 */
export declare const createIntervalStream: <T>(generator: () => T | null, intervalMs: number, options?: StreamOptions) => Readable;
/**
 * Creates a writable stream that collects data into an array.
 *
 * @template T
 * @param {T[]} target - Target array to collect data
 * @param {StreamOptions} [options] - Stream options
 * @returns {Writable} Writable stream
 *
 * @example
 * ```typescript
 * const collected: string[] = [];
 * const stream = createWritableToArray(collected);
 * stream.write('item1');
 * stream.write('item2');
 * stream.end();
 * // collected: ['item1', 'item2']
 * ```
 */
export declare const createWritableToArray: <T>(target: T[], options?: StreamOptions) => Writable;
/**
 * Creates a writable stream that executes a callback for each chunk.
 *
 * @template T
 * @param {(chunk: T) => void | Promise<void>} handler - Chunk handler
 * @param {StreamOptions} [options] - Stream options
 * @returns {Writable} Writable stream
 *
 * @example
 * ```typescript
 * const stream = createWritableWithHandler(async (chunk) => {
 *   await processChunk(chunk);
 * });
 * ```
 */
export declare const createWritableWithHandler: <T>(handler: (chunk: T) => void | Promise<void>, options?: StreamOptions) => Writable;
/**
 * Creates a null writable stream (discards all data).
 *
 * @param {StreamOptions} [options] - Stream options
 * @returns {Writable} Writable stream
 *
 * @example
 * ```typescript
 * const nullStream = createNullWritable();
 * someReadable.pipe(nullStream); // Discards all data
 * ```
 */
export declare const createNullWritable: (options?: StreamOptions) => Writable;
/**
 * Creates a transform stream that maps each chunk.
 *
 * @template T, U
 * @param {(chunk: T) => U | Promise<U>} mapper - Mapping function
 * @param {StreamOptions} [options] - Stream options
 * @returns {Transform} Transform stream
 *
 * @example
 * ```typescript
 * const upperCaseStream = createMapTransform((chunk: string) => chunk.toUpperCase());
 * readableStream.pipe(upperCaseStream).pipe(writableStream);
 * ```
 */
export declare const createMapTransform: <T, U>(mapper: (chunk: T) => U | Promise<U>, options?: StreamOptions) => Transform;
/**
 * Creates a transform stream that filters chunks.
 *
 * @template T
 * @param {(chunk: T) => boolean | Promise<boolean>} predicate - Filter predicate
 * @param {StreamOptions} [options] - Stream options
 * @returns {Transform} Transform stream
 *
 * @example
 * ```typescript
 * const evenNumbersStream = createFilterTransform((n: number) => n % 2 === 0);
 * ```
 */
export declare const createFilterTransform: <T>(predicate: (chunk: T) => boolean | Promise<boolean>, options?: StreamOptions) => Transform;
/**
 * Creates a transform stream that batches chunks.
 *
 * @template T
 * @param {number} batchSize - Number of chunks per batch
 * @param {StreamOptions} [options] - Stream options
 * @returns {Transform} Transform stream
 *
 * @example
 * ```typescript
 * const batchStream = createBatchTransform(10);
 * // Accumulates 10 chunks before emitting an array
 * ```
 */
export declare const createBatchTransform: <T>(batchSize: number, options?: StreamOptions) => Transform;
/**
 * Creates a transform stream for JSON parsing.
 *
 * @param {StreamOptions} [options] - Stream options
 * @returns {Transform} Transform stream
 *
 * @example
 * ```typescript
 * const jsonStream = createJsonParseTransform();
 * readableStream.pipe(jsonStream).on('data', (obj) => console.log(obj));
 * ```
 */
export declare const createJsonParseTransform: (options?: StreamOptions) => Transform;
/**
 * Creates a transform stream for JSON stringify.
 *
 * @param {StreamOptions} [options] - Stream options
 * @returns {Transform} Transform stream
 *
 * @example
 * ```typescript
 * const stringifyStream = createJsonStringifyTransform();
 * objectStream.pipe(stringifyStream).pipe(writableStream);
 * ```
 */
export declare const createJsonStringifyTransform: (options?: StreamOptions) => Transform;
/**
 * Pipes streams together with error handling.
 *
 * @param {...NodeJS.ReadWriteStream[]} streams - Streams to pipe
 * @returns {Promise<void>} Promise that resolves when complete
 *
 * @example
 * ```typescript
 * await pipeStreams(
 *   createReadStream('input.txt'),
 *   createTransformStream(),
 *   createWriteStream('output.txt')
 * );
 * ```
 */
export declare const pipeStreams: (...streams: NodeJS.ReadWriteStream[]) => Promise<void>;
/**
 * Creates a passthrough stream for tee-ing data.
 *
 * @param {StreamOptions} [options] - Stream options
 * @returns {PassThrough} Passthrough stream
 *
 * @example
 * ```typescript
 * const pass = createPassThrough();
 * readable.pipe(pass).pipe(writable1);
 * pass.pipe(writable2); // Data goes to both writable1 and writable2
 * ```
 */
export declare const createPassThrough: (options?: StreamOptions) => PassThrough;
/**
 * Splits a stream into multiple output streams.
 *
 * @param {Readable} source - Source readable stream
 * @param {number} count - Number of output streams
 * @returns {Readable[]} Array of readable streams
 *
 * @example
 * ```typescript
 * const [stream1, stream2, stream3] = splitStream(sourceStream, 3);
 * stream1.pipe(destination1);
 * stream2.pipe(destination2);
 * stream3.pipe(destination3);
 * ```
 */
export declare const splitStream: (source: Readable, count: number) => Readable[];
/**
 * Creates a stream with backpressure management.
 *
 * @param {Writable} destination - Destination stream
 * @param {BackpressureOptions} options - Backpressure options
 * @returns {Writable} Writable stream with backpressure
 *
 * @example
 * ```typescript
 * const stream = createBackpressureStream(destination, {
 *   maxBufferSize: 1024 * 1024,
 *   pauseThreshold: 0.9,
 *   resumeThreshold: 0.5
 * });
 * ```
 */
export declare const createBackpressureStream: (destination: Writable, options: BackpressureOptions) => Writable;
/**
 * Checks if a stream is experiencing backpressure.
 *
 * @param {Writable} stream - Writable stream
 * @returns {boolean} True if backpressure is present
 *
 * @example
 * ```typescript
 * if (hasBackpressure(writableStream)) {
 *   console.log('Backpressure detected, slowing down...');
 * }
 * ```
 */
export declare const hasBackpressure: (stream: Writable) => boolean;
/**
 * Waits for stream to drain (resolve backpressure).
 *
 * @param {Writable} stream - Writable stream
 * @returns {Promise<void>} Promise that resolves when drained
 *
 * @example
 * ```typescript
 * if (!stream.write(chunk)) {
 *   await waitForDrain(stream);
 * }
 * ```
 */
export declare const waitForDrain: (stream: Writable) => Promise<void>;
/**
 * Creates a buffered stream with specified buffer size.
 *
 * @param {number} bufferSize - Buffer size in bytes
 * @param {StreamOptions} [options] - Stream options
 * @returns {Transform} Buffered transform stream
 *
 * @example
 * ```typescript
 * const buffered = createBufferedStream(64 * 1024); // 64KB buffer
 * readable.pipe(buffered).pipe(writable);
 * ```
 */
export declare const createBufferedStream: (bufferSize: number, options?: StreamOptions) => Transform;
/**
 * Buffers entire stream into memory.
 *
 * @param {Readable} stream - Readable stream
 * @returns {Promise<Buffer>} Promise with buffered data
 *
 * @example
 * ```typescript
 * const buffer = await bufferStream(readableStream);
 * console.log(`Buffered ${buffer.length} bytes`);
 * ```
 */
export declare const bufferStream: (stream: Readable) => Promise<Buffer>;
/**
 * Converts stream to string.
 *
 * @param {Readable} stream - Readable stream
 * @param {BufferEncoding} [encoding] - Encoding (default: 'utf8')
 * @returns {Promise<string>} Promise with string data
 *
 * @example
 * ```typescript
 * const text = await streamToString(readableStream);
 * console.log(text);
 * ```
 */
export declare const streamToString: (stream: Readable, encoding?: BufferEncoding) => Promise<string>;
/**
 * Splits stream by delimiter.
 *
 * @param {string | Buffer} delimiter - Delimiter to split on
 * @param {StreamOptions} [options] - Stream options
 * @returns {Transform} Transform stream that splits on delimiter
 *
 * @example
 * ```typescript
 * const lineStream = createSplitStream('\n');
 * readable.pipe(lineStream).on('data', (line) => console.log(line));
 * ```
 */
export declare const createSplitStream: (delimiter: string | Buffer, options?: StreamOptions) => Transform;
/**
 * Creates a line-by-line stream.
 *
 * @param {StreamOptions} [options] - Stream options
 * @returns {Transform} Transform stream that emits lines
 *
 * @example
 * ```typescript
 * const lineStream = createLineStream();
 * fileStream.pipe(lineStream).on('data', (line) => processLine(line));
 * ```
 */
export declare const createLineStream: (options?: StreamOptions) => Transform;
/**
 * Merges multiple readable streams into one.
 *
 * @param {...Readable[]} streams - Streams to merge
 * @returns {Readable} Merged readable stream
 *
 * @example
 * ```typescript
 * const merged = mergeStreams(stream1, stream2, stream3);
 * merged.on('data', (chunk) => console.log(chunk));
 * ```
 */
export declare const mergeStreams: (...streams: Readable[]) => Readable;
/**
 * Concatenates multiple streams in order.
 *
 * @param {...Readable[]} streams - Streams to concatenate
 * @returns {Readable} Concatenated stream
 *
 * @example
 * ```typescript
 * const combined = concatenateStreams(header, body, footer);
 * combined.pipe(destination);
 * ```
 */
export declare const concatenateStreams: (...streams: Readable[]) => Readable;
/**
 * Creates a stream that chunks data into fixed sizes.
 *
 * @param {ChunkOptions} options - Chunk options
 * @returns {Transform} Transform stream that outputs chunks
 *
 * @example
 * ```typescript
 * const chunker = createChunkStream({ size: 1024 });
 * readable.pipe(chunker).on('data', (chunk) => {
 *   console.log(`Chunk size: ${chunk.length}`);
 * });
 * ```
 */
export declare const createChunkStream: (options: ChunkOptions) => Transform;
/**
 * Creates a stream that emits byte ranges.
 *
 * @param {number} start - Start byte
 * @param {number} end - End byte
 * @returns {Transform} Transform stream
 *
 * @example
 * ```typescript
 * const range = createRangeStream(100, 200);
 * fileStream.pipe(range).pipe(response);
 * ```
 */
export declare const createRangeStream: (start: number, end: number) => Transform;
/**
 * Creates a stream for reading large files in chunks.
 *
 * @param {string} filePath - Path to file
 * @param {ChunkOptions} [chunkOptions] - Chunk options
 * @returns {Readable} Readable stream
 *
 * @example
 * ```typescript
 * const stream = createLargeFileStream('/path/to/large/file.txt', { size: 64 * 1024 });
 * stream.on('data', (chunk) => processChunk(chunk));
 * ```
 */
export declare const createLargeFileStream: (filePath: string, chunkOptions?: ChunkOptions) => Readable;
/**
 * Streams a file to HTTP response with range support.
 *
 * @param {string} filePath - Path to file
 * @param {object} response - HTTP response object
 * @param {number} [start] - Start byte
 * @param {number} [end] - End byte
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await streamFileToResponse('/path/to/video.mp4', res, 0, 1024000);
 * ```
 */
export declare const streamFileToResponse: (filePath: string, response: any, start?: number, end?: number) => Promise<void>;
/**
 * Creates an SSE stream for real-time updates.
 *
 * @returns {Transform} SSE transform stream
 *
 * @example
 * ```typescript
 * const sseStream = createSSEStream();
 * dataStream.pipe(sseStream).pipe(response);
 * ```
 */
export declare const createSSEStream: () => Transform;
/**
 * Formats data as SSE message.
 *
 * @param {SSEMessage} message - SSE message object
 * @returns {string} Formatted SSE message
 *
 * @example
 * ```typescript
 * const formatted = formatSSEMessage({
 *   id: '1',
 *   event: 'update',
 *   data: { status: 'processing' }
 * });
 * // id: 1
 * // event: update
 * // data: {"status":"processing"}
 * //
 * ```
 */
export declare const formatSSEMessage: (message: SSEMessage) => string;
/**
 * Sends SSE message to response stream.
 *
 * @param {any} response - HTTP response object
 * @param {SSEMessage} message - SSE message
 * @returns {boolean} True if write was successful
 *
 * @example
 * ```typescript
 * sendSSEMessage(res, {
 *   event: 'update',
 *   data: { progress: 50 }
 * });
 * ```
 */
export declare const sendSSEMessage: (response: any, message: SSEMessage) => boolean;
/**
 * Initializes SSE response headers.
 *
 * @param {any} response - HTTP response object
 * @returns {void}
 *
 * @example
 * ```typescript
 * initializeSSEResponse(res);
 * sendSSEMessage(res, { data: 'Hello' });
 * ```
 */
export declare const initializeSSEResponse: (response: any) => void;
/**
 * Creates an error-handling wrapper for streams.
 *
 * @param {NodeJS.ReadWriteStream} stream - Stream to wrap
 * @param {(error: Error) => void} errorHandler - Error handler
 * @returns {NodeJS.ReadWriteStream} Wrapped stream
 *
 * @example
 * ```typescript
 * const safeStream = createErrorHandlingStream(myStream, (error) => {
 *   console.error('Stream error:', error);
 * });
 * ```
 */
export declare const createErrorHandlingStream: (stream: NodeJS.ReadWriteStream, errorHandler: (error: Error) => void) => NodeJS.ReadWriteStream;
/**
 * Catches and recovers from stream errors.
 *
 * @param {Readable} stream - Readable stream
 * @param {(error: Error) => Readable} recovery - Recovery function
 * @returns {Readable} Stream with error recovery
 *
 * @example
 * ```typescript
 * const stream = catchStreamErrors(primaryStream, (error) => {
 *   console.error('Error:', error);
 *   return fallbackStream;
 * });
 * ```
 */
export declare const catchStreamErrors: (stream: Readable, recovery: (error: Error) => Readable) => Readable;
/**
 * Creates a stream with progress tracking.
 *
 * @param {number} [totalBytes] - Total bytes (optional)
 * @param {(progress: ProgressInfo) => void} [onProgress] - Progress callback
 * @returns {Transform} Transform stream with progress
 *
 * @example
 * ```typescript
 * const progressStream = createProgressStream(1024000, (progress) => {
 *   console.log(`Progress: ${progress.percentage}%`);
 * });
 * ```
 */
export declare const createProgressStream: (totalBytes?: number, onProgress?: (progress: ProgressInfo) => void) => Transform;
/**
 * Tracks stream statistics.
 *
 * @param {NodeJS.ReadWriteStream} stream - Stream to track
 * @returns {StreamStats} Stream statistics object
 *
 * @example
 * ```typescript
 * const stats = trackStreamStats(myStream);
 * myStream.on('end', () => {
 *   console.log(`Processed ${stats.chunksProcessed} chunks`);
 * });
 * ```
 */
export declare const trackStreamStats: (stream: NodeJS.ReadWriteStream) => StreamStats;
/**
 * Creates a throttled stream that limits throughput.
 *
 * @param {number} bytesPerSecond - Maximum bytes per second
 * @returns {Transform} Throttled transform stream
 *
 * @example
 * ```typescript
 * const throttled = createThrottledStream(1024 * 1024); // 1MB/s
 * fileStream.pipe(throttled).pipe(destination);
 * ```
 */
export declare const createThrottledStream: (bytesPerSecond: number) => Transform;
/**
 * Deduplicates chunks in a stream based on a key function.
 *
 * @template T
 * @param {(chunk: T) => string} keyFn - Function to extract unique key
 * @param {StreamOptions} [options] - Stream options
 * @returns {Transform} Deduplicating transform stream
 *
 * @example
 * ```typescript
 * const dedupe = createDeduplicateStream((obj) => obj.id);
 * dataStream.pipe(dedupe).on('data', (unique) => console.log(unique));
 * ```
 */
export declare const createDeduplicateStream: <T>(keyFn: (chunk: T) => string, options?: StreamOptions) => Transform;
/**
 * Creates a stream that emits chunks only when they change.
 *
 * @template T
 * @param {(a: T, b: T) => boolean} [compareFn] - Comparison function
 * @param {StreamOptions} [options] - Stream options
 * @returns {Transform} Transform stream that filters unchanged values
 *
 * @example
 * ```typescript
 * const distinct = createDistinctStream();
 * stream.pipe(distinct).on('data', (changed) => console.log(changed));
 * ```
 */
export declare const createDistinctStream: <T>(compareFn?: (a: T, b: T) => boolean, options?: StreamOptions) => Transform;
declare const _default: {
    createReadableFromArray: <T>(data: T[], options?: StreamOptions) => Readable;
    createReadableFromString: (str: string, options?: StreamOptions) => Readable;
    createReadableFromBuffer: (buffer: Buffer, options?: StreamOptions) => Readable;
    createIntervalStream: <T>(generator: () => T | null, intervalMs: number, options?: StreamOptions) => Readable;
    createWritableToArray: <T>(target: T[], options?: StreamOptions) => Writable;
    createWritableWithHandler: <T>(handler: (chunk: T) => void | Promise<void>, options?: StreamOptions) => Writable;
    createNullWritable: (options?: StreamOptions) => Writable;
    createMapTransform: <T, U>(mapper: (chunk: T) => U | Promise<U>, options?: StreamOptions) => Transform;
    createFilterTransform: <T>(predicate: (chunk: T) => boolean | Promise<boolean>, options?: StreamOptions) => Transform;
    createBatchTransform: <T>(batchSize: number, options?: StreamOptions) => Transform;
    createJsonParseTransform: (options?: StreamOptions) => Transform;
    createJsonStringifyTransform: (options?: StreamOptions) => Transform;
    pipeStreams: (...streams: NodeJS.ReadWriteStream[]) => Promise<void>;
    createPassThrough: (options?: StreamOptions) => PassThrough;
    splitStream: (source: Readable, count: number) => Readable[];
    createBackpressureStream: (destination: Writable, options: BackpressureOptions) => Writable;
    hasBackpressure: (stream: Writable) => boolean;
    waitForDrain: (stream: Writable) => Promise<void>;
    createBufferedStream: (bufferSize: number, options?: StreamOptions) => Transform;
    bufferStream: (stream: Readable) => Promise<Buffer>;
    streamToString: (stream: Readable, encoding?: BufferEncoding) => Promise<string>;
    createSplitStream: (delimiter: string | Buffer, options?: StreamOptions) => Transform;
    createLineStream: (options?: StreamOptions) => Transform;
    mergeStreams: (...streams: Readable[]) => Readable;
    concatenateStreams: (...streams: Readable[]) => Readable;
    createChunkStream: (options: ChunkOptions) => Transform;
    createRangeStream: (start: number, end: number) => Transform;
    createLargeFileStream: (filePath: string, chunkOptions?: ChunkOptions) => Readable;
    streamFileToResponse: (filePath: string, response: any, start?: number, end?: number) => Promise<void>;
    createSSEStream: () => Transform;
    formatSSEMessage: (message: SSEMessage) => string;
    sendSSEMessage: (response: any, message: SSEMessage) => boolean;
    initializeSSEResponse: (response: any) => void;
    createErrorHandlingStream: (stream: NodeJS.ReadWriteStream, errorHandler: (error: Error) => void) => NodeJS.ReadWriteStream;
    catchStreamErrors: (stream: Readable, recovery: (error: Error) => Readable) => Readable;
    createProgressStream: (totalBytes?: number, onProgress?: (progress: ProgressInfo) => void) => Transform;
    trackStreamStats: (stream: NodeJS.ReadWriteStream) => StreamStats;
    createThrottledStream: (bytesPerSecond: number) => Transform;
    createDeduplicateStream: <T>(keyFn: (chunk: T) => string, options?: StreamOptions) => Transform;
    createDistinctStream: <T>(compareFn?: (a: T, b: T) => boolean, options?: StreamOptions) => Transform;
};
export default _default;
//# sourceMappingURL=streaming-utils.d.ts.map