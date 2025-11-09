"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDistinctStream = exports.createDeduplicateStream = exports.createThrottledStream = exports.trackStreamStats = exports.createProgressStream = exports.catchStreamErrors = exports.createErrorHandlingStream = exports.initializeSSEResponse = exports.sendSSEMessage = exports.formatSSEMessage = exports.createSSEStream = exports.streamFileToResponse = exports.createLargeFileStream = exports.createRangeStream = exports.createChunkStream = exports.concatenateStreams = exports.mergeStreams = exports.createLineStream = exports.createSplitStream = exports.streamToString = exports.bufferStream = exports.createBufferedStream = exports.waitForDrain = exports.hasBackpressure = exports.createBackpressureStream = exports.splitStream = exports.createPassThrough = exports.pipeStreams = exports.createJsonStringifyTransform = exports.createJsonParseTransform = exports.createBatchTransform = exports.createFilterTransform = exports.createMapTransform = exports.createNullWritable = exports.createWritableWithHandler = exports.createWritableToArray = exports.createIntervalStream = exports.createReadableFromBuffer = exports.createReadableFromString = exports.createReadableFromArray = void 0;
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
const stream_1 = require("stream");
const fs_1 = require("fs");
const util_1 = require("util");
const pipelineAsync = (0, util_1.promisify)(stream_1.pipeline);
// ============================================================================
// READABLE STREAM CREATION
// ============================================================================
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
const createReadableFromArray = (data, options) => {
    let index = 0;
    return new stream_1.Readable({
        ...options,
        read() {
            if (index < data.length) {
                this.push(options?.objectMode ? data[index] : JSON.stringify(data[index]));
                index++;
            }
            else {
                this.push(null);
            }
        },
    });
};
exports.createReadableFromArray = createReadableFromArray;
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
const createReadableFromString = (str, options) => {
    return stream_1.Readable.from(str, options);
};
exports.createReadableFromString = createReadableFromString;
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
const createReadableFromBuffer = (buffer, options) => {
    return stream_1.Readable.from(buffer, options);
};
exports.createReadableFromBuffer = createReadableFromBuffer;
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
const createIntervalStream = (generator, intervalMs, options) => {
    let interval;
    return new stream_1.Readable({
        ...options,
        read() {
            if (!interval) {
                interval = setInterval(() => {
                    const data = generator();
                    if (data === null) {
                        clearInterval(interval);
                        this.push(null);
                    }
                    else {
                        this.push(options?.objectMode ? data : JSON.stringify(data));
                    }
                }, intervalMs);
            }
        },
        destroy(error, callback) {
            if (interval) {
                clearInterval(interval);
            }
            callback(error);
        },
    });
};
exports.createIntervalStream = createIntervalStream;
// ============================================================================
// WRITABLE STREAM CREATION
// ============================================================================
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
const createWritableToArray = (target, options) => {
    return new stream_1.Writable({
        ...options,
        write(chunk, encoding, callback) {
            try {
                const data = options?.objectMode ? chunk : chunk.toString();
                target.push(data);
                callback();
            }
            catch (error) {
                callback(error);
            }
        },
    });
};
exports.createWritableToArray = createWritableToArray;
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
const createWritableWithHandler = (handler, options) => {
    return new stream_1.Writable({
        ...options,
        async write(chunk, encoding, callback) {
            try {
                await handler(chunk);
                callback();
            }
            catch (error) {
                callback(error);
            }
        },
    });
};
exports.createWritableWithHandler = createWritableWithHandler;
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
const createNullWritable = (options) => {
    return new stream_1.Writable({
        ...options,
        write(chunk, encoding, callback) {
            callback();
        },
    });
};
exports.createNullWritable = createNullWritable;
// ============================================================================
// TRANSFORM STREAM HELPERS
// ============================================================================
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
const createMapTransform = (mapper, options) => {
    return new stream_1.Transform({
        ...options,
        async transform(chunk, encoding, callback) {
            try {
                const result = await mapper(chunk);
                callback(null, result);
            }
            catch (error) {
                callback(error);
            }
        },
    });
};
exports.createMapTransform = createMapTransform;
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
const createFilterTransform = (predicate, options) => {
    return new stream_1.Transform({
        ...options,
        async transform(chunk, encoding, callback) {
            try {
                const shouldPass = await predicate(chunk);
                callback(null, shouldPass ? chunk : undefined);
            }
            catch (error) {
                callback(error);
            }
        },
    });
};
exports.createFilterTransform = createFilterTransform;
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
const createBatchTransform = (batchSize, options) => {
    let batch = [];
    return new stream_1.Transform({
        ...options,
        objectMode: true,
        transform(chunk, encoding, callback) {
            batch.push(chunk);
            if (batch.length >= batchSize) {
                callback(null, batch);
                batch = [];
            }
            else {
                callback();
            }
        },
        flush(callback) {
            if (batch.length > 0) {
                callback(null, batch);
            }
            else {
                callback();
            }
        },
    });
};
exports.createBatchTransform = createBatchTransform;
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
const createJsonParseTransform = (options) => {
    return new stream_1.Transform({
        ...options,
        transform(chunk, encoding, callback) {
            try {
                const obj = JSON.parse(chunk.toString());
                callback(null, obj);
            }
            catch (error) {
                callback(error);
            }
        },
    });
};
exports.createJsonParseTransform = createJsonParseTransform;
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
const createJsonStringifyTransform = (options) => {
    return new stream_1.Transform({
        ...options,
        transform(chunk, encoding, callback) {
            try {
                const str = JSON.stringify(chunk);
                callback(null, str);
            }
            catch (error) {
                callback(error);
            }
        },
    });
};
exports.createJsonStringifyTransform = createJsonStringifyTransform;
// ============================================================================
// STREAM PIPING UTILITIES
// ============================================================================
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
const pipeStreams = async (...streams) => {
    return pipelineAsync(...streams);
};
exports.pipeStreams = pipeStreams;
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
const createPassThrough = (options) => {
    return new stream_1.PassThrough(options);
};
exports.createPassThrough = createPassThrough;
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
const splitStream = (source, count) => {
    const outputs = [];
    for (let i = 0; i < count; i++) {
        const pass = new stream_1.PassThrough();
        outputs.push(pass);
        source.pipe(pass);
    }
    return outputs;
};
exports.splitStream = splitStream;
// ============================================================================
// BACKPRESSURE HANDLING
// ============================================================================
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
const createBackpressureStream = (destination, options) => {
    let bufferSize = 0;
    const { maxBufferSize, pauseThreshold, resumeThreshold } = options;
    return new stream_1.Writable({
        write(chunk, encoding, callback) {
            bufferSize += chunk.length;
            if (bufferSize >= maxBufferSize * pauseThreshold) {
                destination.cork();
            }
            const canContinue = destination.write(chunk, encoding);
            if (bufferSize < maxBufferSize * resumeThreshold) {
                destination.uncork();
            }
            if (canContinue) {
                bufferSize = Math.max(0, bufferSize - chunk.length);
                callback();
            }
            else {
                destination.once('drain', () => {
                    bufferSize = Math.max(0, bufferSize - chunk.length);
                    callback();
                });
            }
        },
    });
};
exports.createBackpressureStream = createBackpressureStream;
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
const hasBackpressure = (stream) => {
    return stream.writableLength > stream.writableHighWaterMark;
};
exports.hasBackpressure = hasBackpressure;
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
const waitForDrain = (stream) => {
    return new Promise((resolve) => {
        if (!(0, exports.hasBackpressure)(stream)) {
            resolve();
        }
        else {
            stream.once('drain', resolve);
        }
    });
};
exports.waitForDrain = waitForDrain;
// ============================================================================
// STREAM BUFFERING
// ============================================================================
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
const createBufferedStream = (bufferSize, options) => {
    return new stream_1.Transform({
        ...options,
        highWaterMark: bufferSize,
        transform(chunk, encoding, callback) {
            callback(null, chunk);
        },
    });
};
exports.createBufferedStream = createBufferedStream;
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
const bufferStream = (stream) => {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
};
exports.bufferStream = bufferStream;
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
const streamToString = (stream, encoding = 'utf8') => {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.setEncoding(encoding);
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(chunks.join('')));
    });
};
exports.streamToString = streamToString;
// ============================================================================
// STREAM SPLITTING
// ============================================================================
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
const createSplitStream = (delimiter, options) => {
    let buffer = '';
    const delimStr = delimiter.toString();
    return new stream_1.Transform({
        ...options,
        transform(chunk, encoding, callback) {
            buffer += chunk.toString();
            const parts = buffer.split(delimStr);
            buffer = parts.pop() || '';
            for (const part of parts) {
                this.push(part);
            }
            callback();
        },
        flush(callback) {
            if (buffer) {
                this.push(buffer);
            }
            callback();
        },
    });
};
exports.createSplitStream = createSplitStream;
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
const createLineStream = (options) => {
    return (0, exports.createSplitStream)('\n', options);
};
exports.createLineStream = createLineStream;
// ============================================================================
// STREAM MERGING
// ============================================================================
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
const mergeStreams = (...streams) => {
    const passThrough = new stream_1.PassThrough();
    let activeStreams = streams.length;
    for (const stream of streams) {
        stream.on('data', (chunk) => passThrough.write(chunk));
        stream.on('error', (error) => passThrough.destroy(error));
        stream.on('end', () => {
            activeStreams--;
            if (activeStreams === 0) {
                passThrough.end();
            }
        });
    }
    return passThrough;
};
exports.mergeStreams = mergeStreams;
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
const concatenateStreams = (...streams) => {
    const passThrough = new stream_1.PassThrough();
    let currentIndex = 0;
    const pipeNext = () => {
        if (currentIndex >= streams.length) {
            passThrough.end();
            return;
        }
        const current = streams[currentIndex++];
        current.on('data', (chunk) => passThrough.write(chunk));
        current.on('error', (error) => passThrough.destroy(error));
        current.on('end', pipeNext);
    };
    pipeNext();
    return passThrough;
};
exports.concatenateStreams = concatenateStreams;
// ============================================================================
// STREAM CHUNKING
// ============================================================================
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
const createChunkStream = (options) => {
    let buffer = Buffer.alloc(0);
    const { size, overlap = 0 } = options;
    return new stream_1.Transform({
        transform(chunk, encoding, callback) {
            buffer = Buffer.concat([buffer, chunk]);
            while (buffer.length >= size) {
                const chunkData = buffer.slice(0, size);
                this.push(chunkData);
                buffer = buffer.slice(size - overlap);
            }
            callback();
        },
        flush(callback) {
            if (buffer.length > 0) {
                this.push(buffer);
            }
            callback();
        },
    });
};
exports.createChunkStream = createChunkStream;
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
const createRangeStream = (start, end) => {
    let bytesRead = 0;
    return new stream_1.Transform({
        transform(chunk, encoding, callback) {
            const chunkEnd = bytesRead + chunk.length;
            if (chunkEnd <= start || bytesRead > end) {
                bytesRead = chunkEnd;
                callback();
                return;
            }
            const sliceStart = Math.max(0, start - bytesRead);
            const sliceEnd = Math.min(chunk.length, end - bytesRead + 1);
            const slice = chunk.slice(sliceStart, sliceEnd);
            bytesRead = chunkEnd;
            callback(null, slice);
        },
    });
};
exports.createRangeStream = createRangeStream;
// ============================================================================
// LARGE FILE STREAMING
// ============================================================================
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
const createLargeFileStream = (filePath, chunkOptions) => {
    return (0, fs_1.createReadStream)(filePath, {
        highWaterMark: chunkOptions?.size || 64 * 1024,
    });
};
exports.createLargeFileStream = createLargeFileStream;
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
const streamFileToResponse = async (filePath, response, start, end) => {
    const stream = (0, fs_1.createReadStream)(filePath, {
        start,
        end,
        highWaterMark: 64 * 1024,
    });
    return new Promise((resolve, reject) => {
        stream.pipe(response);
        stream.on('error', reject);
        stream.on('end', resolve);
    });
};
exports.streamFileToResponse = streamFileToResponse;
// ============================================================================
// SSE (Server-Sent Events) HELPERS
// ============================================================================
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
const createSSEStream = () => {
    return new stream_1.Transform({
        objectMode: true,
        transform(chunk, encoding, callback) {
            const formatted = (0, exports.formatSSEMessage)(chunk);
            callback(null, formatted);
        },
    });
};
exports.createSSEStream = createSSEStream;
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
const formatSSEMessage = (message) => {
    let output = '';
    if (message.id) {
        output += `id: ${message.id}\n`;
    }
    if (message.event) {
        output += `event: ${message.event}\n`;
    }
    const data = typeof message.data === 'string'
        ? message.data
        : JSON.stringify(message.data);
    output += `data: ${data}\n`;
    if (message.retry) {
        output += `retry: ${message.retry}\n`;
    }
    output += '\n';
    return output;
};
exports.formatSSEMessage = formatSSEMessage;
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
const sendSSEMessage = (response, message) => {
    const formatted = (0, exports.formatSSEMessage)(message);
    return response.write(formatted);
};
exports.sendSSEMessage = sendSSEMessage;
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
const initializeSSEResponse = (response) => {
    response.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });
    response.flushHeaders();
};
exports.initializeSSEResponse = initializeSSEResponse;
// ============================================================================
// STREAM ERROR HANDLING
// ============================================================================
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
const createErrorHandlingStream = (stream, errorHandler) => {
    stream.on('error', errorHandler);
    return stream;
};
exports.createErrorHandlingStream = createErrorHandlingStream;
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
const catchStreamErrors = (stream, recovery) => {
    const passThrough = new stream_1.PassThrough();
    stream.pipe(passThrough);
    stream.on('error', (error) => {
        const fallback = recovery(error);
        fallback.pipe(passThrough);
    });
    return passThrough;
};
exports.catchStreamErrors = catchStreamErrors;
// ============================================================================
// STREAM PROGRESS TRACKING
// ============================================================================
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
const createProgressStream = (totalBytes, onProgress) => {
    let bytesProcessed = 0;
    const startTime = Date.now();
    return new stream_1.Transform({
        transform(chunk, encoding, callback) {
            bytesProcessed += chunk.length;
            const elapsedMs = Date.now() - startTime;
            const bytesPerSecond = (bytesProcessed / elapsedMs) * 1000;
            const progress = {
                bytesProcessed,
                totalBytes,
                percentage: totalBytes ? (bytesProcessed / totalBytes) * 100 : undefined,
                startTime,
                elapsedMs,
                bytesPerSecond,
            };
            if (onProgress) {
                onProgress(progress);
            }
            callback(null, chunk);
        },
    });
};
exports.createProgressStream = createProgressStream;
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
const trackStreamStats = (stream) => {
    const stats = {
        chunksProcessed: 0,
        bytesProcessed: 0,
        errorsEncountered: 0,
        startTime: Date.now(),
    };
    stream.on('data', (chunk) => {
        stats.chunksProcessed++;
        stats.bytesProcessed += chunk.length || 0;
    });
    stream.on('error', () => {
        stats.errorsEncountered++;
    });
    stream.on('end', () => {
        stats.endTime = Date.now();
    });
    return stats;
};
exports.trackStreamStats = trackStreamStats;
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
const createThrottledStream = (bytesPerSecond) => {
    let bytesWritten = 0;
    let lastReset = Date.now();
    return new stream_1.Transform({
        async transform(chunk, encoding, callback) {
            const now = Date.now();
            const elapsed = now - lastReset;
            if (elapsed >= 1000) {
                bytesWritten = 0;
                lastReset = now;
            }
            if (bytesWritten + chunk.length > bytesPerSecond) {
                const delay = 1000 - elapsed;
                await new Promise((resolve) => setTimeout(resolve, delay));
                bytesWritten = 0;
                lastReset = Date.now();
            }
            bytesWritten += chunk.length;
            callback(null, chunk);
        },
    });
};
exports.createThrottledStream = createThrottledStream;
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
const createDeduplicateStream = (keyFn, options) => {
    const seen = new Set();
    return new stream_1.Transform({
        ...options,
        objectMode: true,
        transform(chunk, encoding, callback) {
            const key = keyFn(chunk);
            if (!seen.has(key)) {
                seen.add(key);
                callback(null, chunk);
            }
            else {
                callback();
            }
        },
    });
};
exports.createDeduplicateStream = createDeduplicateStream;
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
const createDistinctStream = (compareFn, options) => {
    let lastValue;
    const compare = compareFn || ((a, b) => JSON.stringify(a) === JSON.stringify(b));
    return new stream_1.Transform({
        ...options,
        objectMode: true,
        transform(chunk, encoding, callback) {
            if (lastValue === undefined || !compare(lastValue, chunk)) {
                lastValue = chunk;
                callback(null, chunk);
            }
            else {
                callback();
            }
        },
    });
};
exports.createDistinctStream = createDistinctStream;
exports.default = {
    // Readable stream creation
    createReadableFromArray: exports.createReadableFromArray,
    createReadableFromString: exports.createReadableFromString,
    createReadableFromBuffer: exports.createReadableFromBuffer,
    createIntervalStream: exports.createIntervalStream,
    // Writable stream creation
    createWritableToArray: exports.createWritableToArray,
    createWritableWithHandler: exports.createWritableWithHandler,
    createNullWritable: exports.createNullWritable,
    // Transform stream helpers
    createMapTransform: exports.createMapTransform,
    createFilterTransform: exports.createFilterTransform,
    createBatchTransform: exports.createBatchTransform,
    createJsonParseTransform: exports.createJsonParseTransform,
    createJsonStringifyTransform: exports.createJsonStringifyTransform,
    // Stream piping utilities
    pipeStreams: exports.pipeStreams,
    createPassThrough: exports.createPassThrough,
    splitStream: exports.splitStream,
    // Backpressure handling
    createBackpressureStream: exports.createBackpressureStream,
    hasBackpressure: exports.hasBackpressure,
    waitForDrain: exports.waitForDrain,
    // Stream buffering
    createBufferedStream: exports.createBufferedStream,
    bufferStream: exports.bufferStream,
    streamToString: exports.streamToString,
    // Stream splitting
    createSplitStream: exports.createSplitStream,
    createLineStream: exports.createLineStream,
    // Stream merging
    mergeStreams: exports.mergeStreams,
    concatenateStreams: exports.concatenateStreams,
    // Stream chunking
    createChunkStream: exports.createChunkStream,
    createRangeStream: exports.createRangeStream,
    // Large file streaming
    createLargeFileStream: exports.createLargeFileStream,
    streamFileToResponse: exports.streamFileToResponse,
    // SSE helpers
    createSSEStream: exports.createSSEStream,
    formatSSEMessage: exports.formatSSEMessage,
    sendSSEMessage: exports.sendSSEMessage,
    initializeSSEResponse: exports.initializeSSEResponse,
    // Stream error handling
    createErrorHandlingStream: exports.createErrorHandlingStream,
    catchStreamErrors: exports.catchStreamErrors,
    // Stream progress tracking
    createProgressStream: exports.createProgressStream,
    trackStreamStats: exports.trackStreamStats,
    // Stream optimization
    createThrottledStream: exports.createThrottledStream,
    createDeduplicateStream: exports.createDeduplicateStream,
    createDistinctStream: exports.createDistinctStream,
};
//# sourceMappingURL=streaming-utils.js.map