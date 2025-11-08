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

import { Readable, Writable, Transform, pipeline, PassThrough } from 'stream';
import { createReadStream, createWriteStream } from 'fs';
import { promisify } from 'util';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

const pipelineAsync = promisify(pipeline);

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
export const createReadableFromArray = <T>(
  data: T[],
  options?: StreamOptions,
): Readable => {
  let index = 0;
  return new Readable({
    ...options,
    read() {
      if (index < data.length) {
        this.push(options?.objectMode ? data[index] : JSON.stringify(data[index]));
        index++;
      } else {
        this.push(null);
      }
    },
  });
};

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
export const createReadableFromString = (
  str: string,
  options?: StreamOptions,
): Readable => {
  return Readable.from(str, options);
};

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
export const createReadableFromBuffer = (
  buffer: Buffer,
  options?: StreamOptions,
): Readable => {
  return Readable.from(buffer, options);
};

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
export const createIntervalStream = <T>(
  generator: () => T | null,
  intervalMs: number,
  options?: StreamOptions,
): Readable => {
  let interval: NodeJS.Timeout;

  return new Readable({
    ...options,
    read() {
      if (!interval) {
        interval = setInterval(() => {
          const data = generator();
          if (data === null) {
            clearInterval(interval);
            this.push(null);
          } else {
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
export const createWritableToArray = <T>(
  target: T[],
  options?: StreamOptions,
): Writable => {
  return new Writable({
    ...options,
    write(chunk, encoding, callback) {
      try {
        const data = options?.objectMode ? chunk : chunk.toString();
        target.push(data);
        callback();
      } catch (error) {
        callback(error as Error);
      }
    },
  });
};

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
export const createWritableWithHandler = <T>(
  handler: (chunk: T) => void | Promise<void>,
  options?: StreamOptions,
): Writable => {
  return new Writable({
    ...options,
    async write(chunk, encoding, callback) {
      try {
        await handler(chunk);
        callback();
      } catch (error) {
        callback(error as Error);
      }
    },
  });
};

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
export const createNullWritable = (options?: StreamOptions): Writable => {
  return new Writable({
    ...options,
    write(chunk, encoding, callback) {
      callback();
    },
  });
};

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
export const createMapTransform = <T, U>(
  mapper: (chunk: T) => U | Promise<U>,
  options?: StreamOptions,
): Transform => {
  return new Transform({
    ...options,
    async transform(chunk, encoding, callback) {
      try {
        const result = await mapper(chunk);
        callback(null, result);
      } catch (error) {
        callback(error as Error);
      }
    },
  });
};

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
export const createFilterTransform = <T>(
  predicate: (chunk: T) => boolean | Promise<boolean>,
  options?: StreamOptions,
): Transform => {
  return new Transform({
    ...options,
    async transform(chunk, encoding, callback) {
      try {
        const shouldPass = await predicate(chunk);
        callback(null, shouldPass ? chunk : undefined);
      } catch (error) {
        callback(error as Error);
      }
    },
  });
};

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
export const createBatchTransform = <T>(
  batchSize: number,
  options?: StreamOptions,
): Transform => {
  let batch: T[] = [];

  return new Transform({
    ...options,
    objectMode: true,
    transform(chunk, encoding, callback) {
      batch.push(chunk);
      if (batch.length >= batchSize) {
        callback(null, batch);
        batch = [];
      } else {
        callback();
      }
    },
    flush(callback) {
      if (batch.length > 0) {
        callback(null, batch);
      } else {
        callback();
      }
    },
  });
};

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
export const createJsonParseTransform = (options?: StreamOptions): Transform => {
  return new Transform({
    ...options,
    transform(chunk, encoding, callback) {
      try {
        const obj = JSON.parse(chunk.toString());
        callback(null, obj);
      } catch (error) {
        callback(error as Error);
      }
    },
  });
};

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
export const createJsonStringifyTransform = (options?: StreamOptions): Transform => {
  return new Transform({
    ...options,
    transform(chunk, encoding, callback) {
      try {
        const str = JSON.stringify(chunk);
        callback(null, str);
      } catch (error) {
        callback(error as Error);
      }
    },
  });
};

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
export const pipeStreams = async (
  ...streams: NodeJS.ReadWriteStream[]
): Promise<void> => {
  return pipelineAsync(...streams);
};

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
export const createPassThrough = (options?: StreamOptions): PassThrough => {
  return new PassThrough(options);
};

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
export const splitStream = (source: Readable, count: number): Readable[] => {
  const outputs: PassThrough[] = [];
  for (let i = 0; i < count; i++) {
    const pass = new PassThrough();
    outputs.push(pass);
    source.pipe(pass);
  }
  return outputs;
};

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
export const createBackpressureStream = (
  destination: Writable,
  options: BackpressureOptions,
): Writable => {
  let bufferSize = 0;
  const { maxBufferSize, pauseThreshold, resumeThreshold } = options;

  return new Writable({
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
      } else {
        destination.once('drain', () => {
          bufferSize = Math.max(0, bufferSize - chunk.length);
          callback();
        });
      }
    },
  });
};

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
export const hasBackpressure = (stream: Writable): boolean => {
  return stream.writableLength > stream.writableHighWaterMark;
};

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
export const waitForDrain = (stream: Writable): Promise<void> => {
  return new Promise((resolve) => {
    if (!hasBackpressure(stream)) {
      resolve();
    } else {
      stream.once('drain', resolve);
    }
  });
};

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
export const createBufferedStream = (
  bufferSize: number,
  options?: StreamOptions,
): Transform => {
  return new Transform({
    ...options,
    highWaterMark: bufferSize,
    transform(chunk, encoding, callback) {
      callback(null, chunk);
    },
  });
};

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
export const bufferStream = (stream: Readable): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
};

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
export const streamToString = (
  stream: Readable,
  encoding: BufferEncoding = 'utf8',
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const chunks: string[] = [];
    stream.setEncoding(encoding);
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(chunks.join('')));
  });
};

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
export const createSplitStream = (
  delimiter: string | Buffer,
  options?: StreamOptions,
): Transform => {
  let buffer = '';
  const delimStr = delimiter.toString();

  return new Transform({
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
export const createLineStream = (options?: StreamOptions): Transform => {
  return createSplitStream('\n', options);
};

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
export const mergeStreams = (...streams: Readable[]): Readable => {
  const passThrough = new PassThrough();
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
export const concatenateStreams = (...streams: Readable[]): Readable => {
  const passThrough = new PassThrough();
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
export const createChunkStream = (options: ChunkOptions): Transform => {
  let buffer = Buffer.alloc(0);
  const { size, overlap = 0 } = options;

  return new Transform({
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
export const createRangeStream = (start: number, end: number): Transform => {
  let bytesRead = 0;

  return new Transform({
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
export const createLargeFileStream = (
  filePath: string,
  chunkOptions?: ChunkOptions,
): Readable => {
  return createReadStream(filePath, {
    highWaterMark: chunkOptions?.size || 64 * 1024,
  });
};

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
export const streamFileToResponse = async (
  filePath: string,
  response: any,
  start?: number,
  end?: number,
): Promise<void> => {
  const stream = createReadStream(filePath, {
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
export const createSSEStream = (): Transform => {
  return new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
      const formatted = formatSSEMessage(chunk);
      callback(null, formatted);
    },
  });
};

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
export const formatSSEMessage = (message: SSEMessage): string => {
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
export const sendSSEMessage = (response: any, message: SSEMessage): boolean => {
  const formatted = formatSSEMessage(message);
  return response.write(formatted);
};

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
export const initializeSSEResponse = (response: any): void => {
  response.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
  response.flushHeaders();
};

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
export const createErrorHandlingStream = (
  stream: NodeJS.ReadWriteStream,
  errorHandler: (error: Error) => void,
): NodeJS.ReadWriteStream => {
  stream.on('error', errorHandler);
  return stream;
};

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
export const catchStreamErrors = (
  stream: Readable,
  recovery: (error: Error) => Readable,
): Readable => {
  const passThrough = new PassThrough();

  stream.pipe(passThrough);
  stream.on('error', (error) => {
    const fallback = recovery(error);
    fallback.pipe(passThrough);
  });

  return passThrough;
};

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
export const createProgressStream = (
  totalBytes?: number,
  onProgress?: (progress: ProgressInfo) => void,
): Transform => {
  let bytesProcessed = 0;
  const startTime = Date.now();

  return new Transform({
    transform(chunk, encoding, callback) {
      bytesProcessed += chunk.length;
      const elapsedMs = Date.now() - startTime;
      const bytesPerSecond = (bytesProcessed / elapsedMs) * 1000;

      const progress: ProgressInfo = {
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
export const trackStreamStats = (stream: NodeJS.ReadWriteStream): StreamStats => {
  const stats: StreamStats = {
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
export const createThrottledStream = (bytesPerSecond: number): Transform => {
  let bytesWritten = 0;
  let lastReset = Date.now();

  return new Transform({
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
export const createDeduplicateStream = <T>(
  keyFn: (chunk: T) => string,
  options?: StreamOptions,
): Transform => {
  const seen = new Set<string>();

  return new Transform({
    ...options,
    objectMode: true,
    transform(chunk, encoding, callback) {
      const key = keyFn(chunk);
      if (!seen.has(key)) {
        seen.add(key);
        callback(null, chunk);
      } else {
        callback();
      }
    },
  });
};

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
export const createDistinctStream = <T>(
  compareFn?: (a: T, b: T) => boolean,
  options?: StreamOptions,
): Transform => {
  let lastValue: T | undefined;
  const compare = compareFn || ((a, b) => JSON.stringify(a) === JSON.stringify(b));

  return new Transform({
    ...options,
    objectMode: true,
    transform(chunk, encoding, callback) {
      if (lastValue === undefined || !compare(lastValue, chunk)) {
        lastValue = chunk;
        callback(null, chunk);
      } else {
        callback();
      }
    },
  });
};

export default {
  // Readable stream creation
  createReadableFromArray,
  createReadableFromString,
  createReadableFromBuffer,
  createIntervalStream,

  // Writable stream creation
  createWritableToArray,
  createWritableWithHandler,
  createNullWritable,

  // Transform stream helpers
  createMapTransform,
  createFilterTransform,
  createBatchTransform,
  createJsonParseTransform,
  createJsonStringifyTransform,

  // Stream piping utilities
  pipeStreams,
  createPassThrough,
  splitStream,

  // Backpressure handling
  createBackpressureStream,
  hasBackpressure,
  waitForDrain,

  // Stream buffering
  createBufferedStream,
  bufferStream,
  streamToString,

  // Stream splitting
  createSplitStream,
  createLineStream,

  // Stream merging
  mergeStreams,
  concatenateStreams,

  // Stream chunking
  createChunkStream,
  createRangeStream,

  // Large file streaming
  createLargeFileStream,
  streamFileToResponse,

  // SSE helpers
  createSSEStream,
  formatSSEMessage,
  sendSSEMessage,
  initializeSSEResponse,

  // Stream error handling
  createErrorHandlingStream,
  catchStreamErrors,

  // Stream progress tracking
  createProgressStream,
  trackStreamStats,

  // Stream optimization
  createThrottledStream,
  createDeduplicateStream,
  createDistinctStream,
};
