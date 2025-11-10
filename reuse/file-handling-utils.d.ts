/**
 * LOC: FIL1234567
 * File: /reuse/file-handling-utils.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - File upload services
 *   - Document management modules
 *   - Storage middleware
 *   - API controllers handling files
 */
/**
 * File: /reuse/file-handling-utils.ts
 * Locator: WC-UTL-FILE-003
 * Purpose: Comprehensive File Handling Utilities - File I/O, storage, processing operations
 *
 * Upstream: Independent utility module for file operations
 * Downstream: ../backend/*, ../frontend/*, storage services, upload middleware
 * Dependencies: TypeScript 5.x, Node 18+, fs, path, stream, multer, sharp, xlsx, pdfkit
 * Exports: 45 utility functions for file operations, validation, processing, cloud storage
 *
 * LLM Context: Comprehensive file handling utilities for White Cross healthcare system.
 * Provides file I/O operations, upload/download helpers, image processing, document generation,
 * cloud storage integration, and file validation. Essential for managing medical records,
 * patient documents, and secure file storage in healthcare applications.
 */
import * as fs from 'fs';
import { Readable, Writable } from 'stream';
interface FileMetadata {
    name: string;
    size: number;
    mimeType: string;
    extension: string;
    path: string;
    createdAt: Date;
    modifiedAt: Date;
}
interface FileValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}
interface FileUploadOptions {
    maxSize?: number;
    allowedMimeTypes?: string[];
    allowedExtensions?: string[];
    sanitizeFilename?: boolean;
}
interface ChunkInfo {
    chunkIndex: number;
    chunkSize: number;
    totalChunks: number;
    totalSize: number;
    offset: number;
}
/**
 * Reads file content asynchronously.
 *
 * @param {string} filePath - Path to file
 * @param {BufferEncoding} [encoding] - File encoding (default: 'utf-8')
 * @returns {Promise<string>} File content
 *
 * @example
 * ```typescript
 * const content = await readFileAsync('/path/to/file.txt');
 * console.log(content); // File content as string
 * ```
 */
export declare const readFileAsync: (filePath: string, encoding?: BufferEncoding) => Promise<string>;
/**
 * Reads file content synchronously.
 *
 * @param {string} filePath - Path to file
 * @param {BufferEncoding} [encoding] - File encoding (default: 'utf-8')
 * @returns {string} File content
 *
 * @example
 * ```typescript
 * const content = readFileSync('/path/to/file.txt');
 * console.log(content); // File content as string
 * ```
 */
export declare const readFileSync: (filePath: string, encoding?: BufferEncoding) => string;
/**
 * Reads file as buffer (for binary files).
 *
 * @param {string} filePath - Path to file
 * @returns {Promise<Buffer>} File buffer
 *
 * @example
 * ```typescript
 * const buffer = await readFileAsBuffer('/path/to/image.png');
 * console.log(buffer.length); // File size in bytes
 * ```
 */
export declare const readFileAsBuffer: (filePath: string) => Promise<Buffer>;
/**
 * Reads JSON file and parses content.
 *
 * @template T
 * @param {string} filePath - Path to JSON file
 * @returns {Promise<T>} Parsed JSON object
 *
 * @example
 * ```typescript
 * interface Config { port: number; host: string; }
 * const config = await readJsonFile<Config>('/path/to/config.json');
 * console.log(config.port); // 3000
 * ```
 */
export declare const readJsonFile: <T>(filePath: string) => Promise<T>;
/**
 * Reads file line by line with callback processing.
 *
 * @param {string} filePath - Path to file
 * @param {(line: string, lineNumber: number) => void | Promise<void>} callback - Line processor
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await readFileByLine('/path/to/large-file.txt', (line, lineNumber) => {
 *   console.log(`Line ${lineNumber}: ${line}`);
 * });
 * ```
 */
export declare const readFileByLine: (filePath: string, callback: (line: string, lineNumber: number) => void | Promise<void>) => Promise<void>;
/**
 * Writes content to file asynchronously.
 *
 * @param {string} filePath - Path to file
 * @param {string | Buffer} content - Content to write
 * @param {BufferEncoding} [encoding] - File encoding (default: 'utf-8')
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await writeFileAsync('/path/to/file.txt', 'Hello World');
 * await writeFileAsync('/path/to/data.bin', buffer);
 * ```
 */
export declare const writeFileAsync: (filePath: string, content: string | Buffer, encoding?: BufferEncoding) => Promise<void>;
/**
 * Writes content to file synchronously.
 *
 * @param {string} filePath - Path to file
 * @param {string | Buffer} content - Content to write
 * @param {BufferEncoding} [encoding] - File encoding (default: 'utf-8')
 * @returns {void}
 *
 * @example
 * ```typescript
 * writeFileSync('/path/to/file.txt', 'Hello World');
 * ```
 */
export declare const writeFileSync: (filePath: string, content: string | Buffer, encoding?: BufferEncoding) => void;
/**
 * Writes JSON object to file.
 *
 * @param {string} filePath - Path to JSON file
 * @param {any} data - Data to write
 * @param {boolean} [pretty] - Format JSON with indentation (default: true)
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await writeJsonFile('/path/to/config.json', { port: 3000, host: 'localhost' });
 * ```
 */
export declare const writeJsonFile: (filePath: string, data: unknown, pretty?: boolean) => Promise<void>;
/**
 * Writes content to file with atomic operation (write to temp, then rename).
 *
 * @param {string} filePath - Path to file
 * @param {string | Buffer} content - Content to write
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await writeFileAtomic('/path/to/critical-file.txt', 'Important data');
 * // File is written atomically to prevent partial writes
 * ```
 */
export declare const writeFileAtomic: (filePath: string, content: string | Buffer) => Promise<void>;
/**
 * Appends content to file asynchronously.
 *
 * @param {string} filePath - Path to file
 * @param {string | Buffer} content - Content to append
 * @param {BufferEncoding} [encoding] - File encoding (default: 'utf-8')
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await appendFileAsync('/path/to/log.txt', 'New log entry\n');
 * ```
 */
export declare const appendFileAsync: (filePath: string, content: string | Buffer, encoding?: BufferEncoding) => Promise<void>;
/**
 * Appends content to file synchronously.
 *
 * @param {string} filePath - Path to file
 * @param {string | Buffer} content - Content to append
 * @param {BufferEncoding} [encoding] - File encoding (default: 'utf-8')
 * @returns {void}
 *
 * @example
 * ```typescript
 * appendFileSync('/path/to/log.txt', 'New log entry\n');
 * ```
 */
export declare const appendFileSync: (filePath: string, content: string | Buffer, encoding?: BufferEncoding) => void;
/**
 * Appends line to file with newline.
 *
 * @param {string} filePath - Path to file
 * @param {string} line - Line to append
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await appendLineToFile('/path/to/log.txt', 'Error occurred at 12:00');
 * ```
 */
export declare const appendLineToFile: (filePath: string, line: string) => Promise<void>;
/**
 * Creates directory recursively (mkdir -p).
 *
 * @param {string} dirPath - Path to directory
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createDirectoryRecursive('/path/to/nested/directory');
 * ```
 */
export declare const createDirectoryRecursive: (dirPath: string) => Promise<void>;
/**
 * Reads directory contents.
 *
 * @param {string} dirPath - Path to directory
 * @param {boolean} [withFileTypes] - Include file type information (default: false)
 * @returns {Promise<string[] | fs.Dirent[]>} Directory contents
 *
 * @example
 * ```typescript
 * const files = await readDirectory('/path/to/directory');
 * console.log(files); // ['file1.txt', 'file2.txt', 'subdirectory']
 * ```
 */
export declare const readDirectory: (dirPath: string, withFileTypes?: boolean) => Promise<string[] | fs.Dirent[]>;
/**
 * Deletes directory recursively (rm -rf).
 *
 * @param {string} dirPath - Path to directory
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteDirectoryRecursive('/path/to/directory');
 * ```
 */
export declare const deleteDirectoryRecursive: (dirPath: string) => Promise<void>;
/**
 * Checks if directory exists.
 *
 * @param {string} dirPath - Path to directory
 * @returns {Promise<boolean>} True if directory exists
 *
 * @example
 * ```typescript
 * const exists = await directoryExists('/path/to/directory');
 * if (exists) console.log('Directory exists');
 * ```
 */
export declare const directoryExists: (dirPath: string) => Promise<boolean>;
/**
 * Lists all files in directory recursively.
 *
 * @param {string} dirPath - Path to directory
 * @param {string[]} [extensions] - Filter by file extensions (optional)
 * @returns {Promise<string[]>} Array of file paths
 *
 * @example
 * ```typescript
 * const files = await listFilesRecursive('/path/to/directory', ['.txt', '.md']);
 * console.log(files); // ['/path/to/directory/file1.txt', '/path/to/directory/sub/file2.md']
 * ```
 */
export declare const listFilesRecursive: (dirPath: string, extensions?: string[]) => Promise<string[]>;
/**
 * Gets absolute path from relative path.
 *
 * @param {string} relativePath - Relative path
 * @returns {string} Absolute path
 *
 * @example
 * ```typescript
 * const absolutePath = getAbsolutePath('./file.txt');
 * console.log(absolutePath); // '/home/user/project/file.txt'
 * ```
 */
export declare const getAbsolutePath: (relativePath: string) => string;
/**
 * Gets file extension.
 *
 * @param {string} filePath - Path to file
 * @returns {string} File extension (including dot)
 *
 * @example
 * ```typescript
 * const ext = getFileExtension('/path/to/file.txt');
 * console.log(ext); // '.txt'
 * ```
 */
export declare const getFileExtension: (filePath: string) => string;
/**
 * Gets filename without extension.
 *
 * @param {string} filePath - Path to file
 * @returns {string} Filename without extension
 *
 * @example
 * ```typescript
 * const name = getFilenameWithoutExtension('/path/to/file.txt');
 * console.log(name); // 'file'
 * ```
 */
export declare const getFilenameWithoutExtension: (filePath: string) => string;
/**
 * Joins path segments safely.
 *
 * @param {...string[]} segments - Path segments
 * @returns {string} Joined path
 *
 * @example
 * ```typescript
 * const fullPath = joinPath('/path', 'to', 'file.txt');
 * console.log(fullPath); // '/path/to/file.txt'
 * ```
 */
export declare const joinPath: (...segments: string[]) => string;
/**
 * Sanitizes filename for safe file system usage.
 *
 * @param {string} filename - Original filename
 * @param {string} [replacement] - Replacement character (default: '-')
 * @returns {string} Sanitized filename
 *
 * @example
 * ```typescript
 * const safe = sanitizeFilename('my file?.txt');
 * console.log(safe); // 'my-file-.txt'
 * ```
 */
export declare const sanitizeFilename: (filename: string, replacement?: string) => string;
/**
 * Gets MIME type from file extension.
 *
 * @param {string} filePath - Path to file
 * @returns {string} MIME type
 *
 * @example
 * ```typescript
 * const mimeType = getMimeTypeFromExtension('/path/to/file.pdf');
 * console.log(mimeType); // 'application/pdf'
 * ```
 */
export declare const getMimeTypeFromExtension: (filePath: string) => string;
/**
 * Detects file type from magic numbers (file signature).
 *
 * @param {Buffer} buffer - File buffer (at least first 8 bytes)
 * @returns {string} Detected MIME type
 *
 * @example
 * ```typescript
 * const buffer = await readFileAsBuffer('/path/to/file');
 * const mimeType = detectFileTypeFromBuffer(buffer);
 * console.log(mimeType); // 'image/png'
 * ```
 */
export declare const detectFileTypeFromBuffer: (buffer: Buffer) => string;
/**
 * Checks if file is an image based on MIME type.
 *
 * @param {string} mimeType - MIME type
 * @returns {boolean} True if image
 *
 * @example
 * ```typescript
 * isImageFile('image/png'); // true
 * isImageFile('application/pdf'); // false
 * ```
 */
export declare const isImageFile: (mimeType: string) => boolean;
/**
 * Gets file size in bytes.
 *
 * @param {string} filePath - Path to file
 * @returns {Promise<number>} File size in bytes
 *
 * @example
 * ```typescript
 * const size = await getFileSize('/path/to/file.txt');
 * console.log(size); // 1024
 * ```
 */
export declare const getFileSize: (filePath: string) => Promise<number>;
/**
 * Formats file size to human-readable format.
 *
 * @param {number} bytes - Size in bytes
 * @param {number} [decimals] - Number of decimals (default: 2)
 * @returns {string} Formatted size
 *
 * @example
 * ```typescript
 * formatFileSize(1024); // '1.00 KB'
 * formatFileSize(1048576); // '1.00 MB'
 * formatFileSize(1073741824); // '1.00 GB'
 * ```
 */
export declare const formatFileSize: (bytes: number, decimals?: number) => string;
/**
 * Gets total size of directory recursively.
 *
 * @param {string} dirPath - Path to directory
 * @returns {Promise<number>} Total size in bytes
 *
 * @example
 * ```typescript
 * const size = await getDirectorySize('/path/to/directory');
 * console.log(formatFileSize(size)); // '15.32 MB'
 * ```
 */
export declare const getDirectorySize: (dirPath: string) => Promise<number>;
/**
 * Gets file metadata.
 *
 * @param {string} filePath - Path to file
 * @returns {Promise<FileMetadata>} File metadata
 *
 * @example
 * ```typescript
 * const metadata = await getFileMetadata('/path/to/file.txt');
 * console.log(metadata.size, metadata.mimeType, metadata.modifiedAt);
 * ```
 */
export declare const getFileMetadata: (filePath: string) => Promise<FileMetadata>;
/**
 * Changes file permissions.
 *
 * @param {string} filePath - Path to file
 * @param {string | number} mode - Permission mode (e.g., '0o755', 0o644)
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await changeFilePermissions('/path/to/file.sh', 0o755); // rwxr-xr-x
 * await changeFilePermissions('/path/to/file.txt', 0o644); // rw-r--r--
 * ```
 */
export declare const changeFilePermissions: (filePath: string, mode: string | number) => Promise<void>;
/**
 * Checks if file exists.
 *
 * @param {string} filePath - Path to file
 * @returns {Promise<boolean>} True if file exists
 *
 * @example
 * ```typescript
 * const exists = await fileExists('/path/to/file.txt');
 * if (exists) console.log('File exists');
 * ```
 */
export declare const fileExists: (filePath: string) => Promise<boolean>;
/**
 * Creates read stream for file.
 *
 * @param {string} filePath - Path to file
 * @param {object} [options] - Stream options
 * @returns {fs.ReadStream} Read stream
 *
 * @example
 * ```typescript
 * const stream = createReadStream('/path/to/large-file.txt');
 * stream.pipe(process.stdout);
 * ```
 */
export declare const createReadStream: (filePath: string, options?: any) => fs.ReadStream;
/**
 * Creates write stream for file.
 *
 * @param {string} filePath - Path to file
 * @param {object} [options] - Stream options
 * @returns {fs.WriteStream} Write stream
 *
 * @example
 * ```typescript
 * const stream = createWriteStream('/path/to/output.txt');
 * stream.write('Hello World\n');
 * stream.end();
 * ```
 */
export declare const createWriteStream: (filePath: string, options?: any) => fs.WriteStream;
/**
 * Pipes read stream to write stream.
 *
 * @param {Readable} source - Source stream
 * @param {Writable} destination - Destination stream
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * const source = createReadStream('/path/to/input.txt');
 * const dest = createWriteStream('/path/to/output.txt');
 * await pipeStreams(source, dest);
 * ```
 */
export declare const pipeStreams: (source: Readable, destination: Writable) => Promise<void>;
/**
 * Creates temporary file with unique name.
 *
 * @param {string} [prefix] - Filename prefix (default: 'tmp')
 * @param {string} [extension] - File extension (default: '.tmp')
 * @param {string} [dir] - Directory for temp file (default: system temp)
 * @returns {Promise<string>} Path to temporary file
 *
 * @example
 * ```typescript
 * const tempPath = await createTempFile('upload', '.pdf');
 * // /tmp/upload-1234567890.pdf
 * await writeFileAsync(tempPath, pdfBuffer);
 * ```
 */
export declare const createTempFile: (prefix?: string, extension?: string, dir?: string) => Promise<string>;
/**
 * Creates temporary directory.
 *
 * @param {string} [prefix] - Directory prefix (default: 'tmpdir')
 * @returns {Promise<string>} Path to temporary directory
 *
 * @example
 * ```typescript
 * const tempDir = await createTempDirectory('upload-extract');
 * // /tmp/upload-extract-1234567890
 * ```
 */
export declare const createTempDirectory: (prefix?: string) => Promise<string>;
/**
 * Validates file upload against size and type constraints.
 *
 * @param {Express.Multer.File | { size: number; mimetype: string }} file - Uploaded file
 * @param {FileUploadOptions} options - Validation options
 * @returns {FileValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateFileUpload(uploadedFile, {
 *   maxSize: 5 * 1024 * 1024, // 5MB
 *   allowedMimeTypes: ['image/jpeg', 'image/png'],
 *   allowedExtensions: ['.jpg', '.png']
 * });
 * if (!result.valid) console.log(result.errors);
 * ```
 */
export declare const validateFileUpload: (file: {
    size: number;
    mimetype: string;
    originalname?: string;
}, options: FileUploadOptions) => FileValidationResult;
/**
 * Validates file for security threats (path traversal, malicious content).
 *
 * @param {string} filename - Original filename
 * @param {Buffer} [buffer] - File buffer for content analysis
 * @returns {FileValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateFileForSecurity('../../etc/passwd', fileBuffer);
 * if (!result.valid) console.log('Security threat detected:', result.errors);
 * ```
 */
export declare const validateFileForSecurity: (filename: string, buffer?: Buffer) => FileValidationResult;
/**
 * Splits file into chunks for upload/processing.
 *
 * @param {string} filePath - Path to file
 * @param {number} chunkSize - Size of each chunk in bytes
 * @returns {Promise<ChunkInfo[]>} Array of chunk information
 *
 * @example
 * ```typescript
 * const chunks = await splitFileIntoChunks('/path/to/large-file.mp4', 1024 * 1024); // 1MB chunks
 * for (const chunk of chunks) {
 *   console.log(`Chunk ${chunk.chunkIndex + 1}/${chunk.totalChunks}`);
 * }
 * ```
 */
export declare const splitFileIntoChunks: (filePath: string, chunkSize: number) => Promise<ChunkInfo[]>;
/**
 * Reads file chunk at specific offset.
 *
 * @param {string} filePath - Path to file
 * @param {number} offset - Start offset in bytes
 * @param {number} length - Number of bytes to read
 * @returns {Promise<Buffer>} Chunk buffer
 *
 * @example
 * ```typescript
 * const chunk = await readFileChunk('/path/to/file.dat', 0, 1024);
 * console.log(chunk.length); // 1024
 * ```
 */
export declare const readFileChunk: (filePath: string, offset: number, length: number) => Promise<Buffer>;
/**
 * Merges file chunks into single file.
 *
 * @param {string[]} chunkPaths - Paths to chunk files
 * @param {string} outputPath - Path to output file
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await mergeFileChunks(
 *   ['/tmp/chunk-0.bin', '/tmp/chunk-1.bin', '/tmp/chunk-2.bin'],
 *   '/path/to/merged-file.mp4'
 * );
 * ```
 */
export declare const mergeFileChunks: (chunkPaths: string[], outputPath: string) => Promise<void>;
/**
 * Copies file from source to destination.
 *
 * @param {string} sourcePath - Source file path
 * @param {string} destPath - Destination file path
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await copyFile('/path/to/source.txt', '/path/to/destination.txt');
 * ```
 */
export declare const copyFile: (sourcePath: string, destPath: string) => Promise<void>;
/**
 * Moves file from source to destination.
 *
 * @param {string} sourcePath - Source file path
 * @param {string} destPath - Destination file path
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await moveFile('/path/to/source.txt', '/path/to/destination.txt');
 * ```
 */
export declare const moveFile: (sourcePath: string, destPath: string) => Promise<void>;
/**
 * Deletes file.
 *
 * @param {string} filePath - Path to file
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteFile('/path/to/file.txt');
 * ```
 */
export declare const deleteFile: (filePath: string) => Promise<void>;
/**
 * Calculates file hash (checksum).
 *
 * @param {string} filePath - Path to file
 * @param {string} [algorithm] - Hash algorithm (default: 'sha256')
 * @returns {Promise<string>} File hash
 *
 * @example
 * ```typescript
 * const hash = await calculateFileHash('/path/to/file.txt', 'sha256');
 * console.log(hash); // 'a1b2c3d4e5f6...'
 * ```
 */
export declare const calculateFileHash: (filePath: string, algorithm?: string) => Promise<string>;
/**
 * Generates unique filename with timestamp and random string.
 *
 * @param {string} originalName - Original filename
 * @param {string} [prefix] - Prefix to add (optional)
 * @returns {string} Unique filename
 *
 * @example
 * ```typescript
 * const unique = generateUniqueFilename('document.pdf', 'upload');
 * // 'upload-1234567890-abc123-document.pdf'
 * ```
 */
export declare const generateUniqueFilename: (originalName: string, prefix?: string) => string;
declare const _default: {
    readFileAsync: (filePath: string, encoding?: BufferEncoding) => Promise<string>;
    readFileSync: (filePath: string, encoding?: BufferEncoding) => string;
    readFileAsBuffer: (filePath: string) => Promise<Buffer>;
    readJsonFile: <T>(filePath: string) => Promise<T>;
    readFileByLine: (filePath: string, callback: (line: string, lineNumber: number) => void | Promise<void>) => Promise<void>;
    writeFileAsync: (filePath: string, content: string | Buffer, encoding?: BufferEncoding) => Promise<void>;
    writeFileSync: (filePath: string, content: string | Buffer, encoding?: BufferEncoding) => void;
    writeJsonFile: (filePath: string, data: unknown, pretty?: boolean) => Promise<void>;
    writeFileAtomic: (filePath: string, content: string | Buffer) => Promise<void>;
    appendFileAsync: (filePath: string, content: string | Buffer, encoding?: BufferEncoding) => Promise<void>;
    appendFileSync: (filePath: string, content: string | Buffer, encoding?: BufferEncoding) => void;
    appendLineToFile: (filePath: string, line: string) => Promise<void>;
    createDirectoryRecursive: (dirPath: string) => Promise<void>;
    readDirectory: (dirPath: string, withFileTypes?: boolean) => Promise<string[] | fs.Dirent[]>;
    deleteDirectoryRecursive: (dirPath: string) => Promise<void>;
    directoryExists: (dirPath: string) => Promise<boolean>;
    listFilesRecursive: (dirPath: string, extensions?: string[]) => Promise<string[]>;
    getAbsolutePath: (relativePath: string) => string;
    getFileExtension: (filePath: string) => string;
    getFilenameWithoutExtension: (filePath: string) => string;
    joinPath: (...segments: string[]) => string;
    sanitizeFilename: (filename: string, replacement?: string) => string;
    getMimeTypeFromExtension: (filePath: string) => string;
    detectFileTypeFromBuffer: (buffer: Buffer) => string;
    isImageFile: (mimeType: string) => boolean;
    getFileSize: (filePath: string) => Promise<number>;
    formatFileSize: (bytes: number, decimals?: number) => string;
    getDirectorySize: (dirPath: string) => Promise<number>;
    getFileMetadata: (filePath: string) => Promise<FileMetadata>;
    changeFilePermissions: (filePath: string, mode: string | number) => Promise<void>;
    fileExists: (filePath: string) => Promise<boolean>;
    createReadStream: (filePath: string, options?: any) => fs.ReadStream;
    createWriteStream: (filePath: string, options?: any) => fs.WriteStream;
    pipeStreams: (source: Readable, destination: Writable) => Promise<void>;
    createTempFile: (prefix?: string, extension?: string, dir?: string) => Promise<string>;
    createTempDirectory: (prefix?: string) => Promise<string>;
    validateFileUpload: (file: {
        size: number;
        mimetype: string;
        originalname?: string;
    }, options: FileUploadOptions) => FileValidationResult;
    validateFileForSecurity: (filename: string, buffer?: Buffer) => FileValidationResult;
    splitFileIntoChunks: (filePath: string, chunkSize: number) => Promise<ChunkInfo[]>;
    readFileChunk: (filePath: string, offset: number, length: number) => Promise<Buffer>;
    mergeFileChunks: (chunkPaths: string[], outputPath: string) => Promise<void>;
    copyFile: (sourcePath: string, destPath: string) => Promise<void>;
    moveFile: (sourcePath: string, destPath: string) => Promise<void>;
    deleteFile: (filePath: string) => Promise<void>;
    calculateFileHash: (filePath: string, algorithm?: string) => Promise<string>;
    generateUniqueFilename: (originalName: string, prefix?: string) => string;
};
export default _default;
//# sourceMappingURL=file-handling-utils.d.ts.map