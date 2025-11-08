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
import * as fsPromises from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';
import { Stream, Readable, Writable } from 'stream';
import { pipeline } from 'stream/promises';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

interface S3UploadConfig {
  bucket: string;
  key: string;
  region?: string;
  acl?: string;
  contentType?: string;
}

interface ImageProcessingOptions {
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  format?: 'jpeg' | 'png' | 'webp' | 'avif';
  quality?: number;
}

interface CompressionOptions {
  format: 'gzip' | 'deflate' | 'brotli';
  level?: number;
}

// ============================================================================
// FILE READ OPERATIONS
// ============================================================================

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
export const readFileAsync = async (
  filePath: string,
  encoding: BufferEncoding = 'utf-8',
): Promise<string> => {
  try {
    return await fsPromises.readFile(filePath, encoding);
  } catch (error) {
    throw new Error(`Failed to read file ${filePath}: ${error.message}`);
  }
};

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
export const readFileSync = (
  filePath: string,
  encoding: BufferEncoding = 'utf-8',
): string => {
  try {
    return fs.readFileSync(filePath, encoding);
  } catch (error) {
    throw new Error(`Failed to read file ${filePath}: ${error.message}`);
  }
};

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
export const readFileAsBuffer = async (filePath: string): Promise<Buffer> => {
  try {
    return await fsPromises.readFile(filePath);
  } catch (error) {
    throw new Error(`Failed to read file buffer ${filePath}: ${error.message}`);
  }
};

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
export const readJsonFile = async <T>(filePath: string): Promise<T> => {
  try {
    const content = await readFileAsync(filePath);
    return JSON.parse(content) as T;
  } catch (error) {
    throw new Error(`Failed to read JSON file ${filePath}: ${error.message}`);
  }
};

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
export const readFileByLine = async (
  filePath: string,
  callback: (line: string, lineNumber: number) => void | Promise<void>,
): Promise<void> => {
  const fileStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
  let lineNumber = 0;
  let buffer = '';

  for await (const chunk of fileStream) {
    buffer += chunk;
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      await callback(line, ++lineNumber);
    }
  }

  if (buffer.length > 0) {
    await callback(buffer, ++lineNumber);
  }
};

// ============================================================================
// FILE WRITE OPERATIONS
// ============================================================================

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
export const writeFileAsync = async (
  filePath: string,
  content: string | Buffer,
  encoding: BufferEncoding = 'utf-8',
): Promise<void> => {
  try {
    await fsPromises.writeFile(filePath, content, encoding);
  } catch (error) {
    throw new Error(`Failed to write file ${filePath}: ${error.message}`);
  }
};

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
export const writeFileSync = (
  filePath: string,
  content: string | Buffer,
  encoding: BufferEncoding = 'utf-8',
): void => {
  try {
    fs.writeFileSync(filePath, content, encoding);
  } catch (error) {
    throw new Error(`Failed to write file ${filePath}: ${error.message}`);
  }
};

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
export const writeJsonFile = async (
  filePath: string,
  data: any,
  pretty: boolean = true,
): Promise<void> => {
  try {
    const content = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
    await writeFileAsync(filePath, content);
  } catch (error) {
    throw new Error(`Failed to write JSON file ${filePath}: ${error.message}`);
  }
};

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
export const writeFileAtomic = async (
  filePath: string,
  content: string | Buffer,
): Promise<void> => {
  const tempPath = `${filePath}.tmp.${Date.now()}`;
  try {
    await writeFileAsync(tempPath, content);
    await fsPromises.rename(tempPath, filePath);
  } catch (error) {
    await fsPromises.unlink(tempPath).catch(() => {});
    throw new Error(`Failed to write file atomically ${filePath}: ${error.message}`);
  }
};

// ============================================================================
// FILE APPEND OPERATIONS
// ============================================================================

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
export const appendFileAsync = async (
  filePath: string,
  content: string | Buffer,
  encoding: BufferEncoding = 'utf-8',
): Promise<void> => {
  try {
    await fsPromises.appendFile(filePath, content, encoding);
  } catch (error) {
    throw new Error(`Failed to append to file ${filePath}: ${error.message}`);
  }
};

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
export const appendFileSync = (
  filePath: string,
  content: string | Buffer,
  encoding: BufferEncoding = 'utf-8',
): void => {
  try {
    fs.appendFileSync(filePath, content, encoding);
  } catch (error) {
    throw new Error(`Failed to append to file ${filePath}: ${error.message}`);
  }
};

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
export const appendLineToFile = async (
  filePath: string,
  line: string,
): Promise<void> => {
  await appendFileAsync(filePath, `${line}\n`);
};

// ============================================================================
// DIRECTORY OPERATIONS
// ============================================================================

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
export const createDirectoryRecursive = async (dirPath: string): Promise<void> => {
  try {
    await fsPromises.mkdir(dirPath, { recursive: true });
  } catch (error) {
    throw new Error(`Failed to create directory ${dirPath}: ${error.message}`);
  }
};

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
export const readDirectory = async (
  dirPath: string,
  withFileTypes: boolean = false,
): Promise<string[] | fs.Dirent[]> => {
  try {
    return await fsPromises.readdir(dirPath, { withFileTypes });
  } catch (error) {
    throw new Error(`Failed to read directory ${dirPath}: ${error.message}`);
  }
};

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
export const deleteDirectoryRecursive = async (dirPath: string): Promise<void> => {
  try {
    await fsPromises.rm(dirPath, { recursive: true, force: true });
  } catch (error) {
    throw new Error(`Failed to delete directory ${dirPath}: ${error.message}`);
  }
};

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
export const directoryExists = async (dirPath: string): Promise<boolean> => {
  try {
    const stats = await fsPromises.stat(dirPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
};

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
export const listFilesRecursive = async (
  dirPath: string,
  extensions?: string[],
): Promise<string[]> => {
  const results: string[] = [];

  const entries = await fsPromises.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      const subFiles = await listFilesRecursive(fullPath, extensions);
      results.push(...subFiles);
    } else if (entry.isFile()) {
      if (!extensions || extensions.some(ext => fullPath.endsWith(ext))) {
        results.push(fullPath);
      }
    }
  }

  return results;
};

// ============================================================================
// FILE PATH UTILITIES
// ============================================================================

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
export const getAbsolutePath = (relativePath: string): string => {
  return path.resolve(relativePath);
};

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
export const getFileExtension = (filePath: string): string => {
  return path.extname(filePath);
};

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
export const getFilenameWithoutExtension = (filePath: string): string => {
  return path.basename(filePath, path.extname(filePath));
};

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
export const joinPath = (...segments: string[]): string => {
  return path.join(...segments);
};

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
export const sanitizeFilename = (filename: string, replacement: string = '-'): string => {
  // Remove potentially dangerous characters
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, replacement)
    .replace(/\.{2,}/g, '.')
    .replace(new RegExp(`${replacement}{2,}`, 'g'), replacement)
    .trim();
};

// ============================================================================
// FILE TYPE DETECTION
// ============================================================================

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
export const getMimeTypeFromExtension = (filePath: string): string => {
  const ext = getFileExtension(filePath).toLowerCase();

  const mimeTypes: Record<string, string> = {
    '.txt': 'text/plain',
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.xml': 'application/xml',
    '.pdf': 'application/pdf',
    '.zip': 'application/zip',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.csv': 'text/csv',
  };

  return mimeTypes[ext] || 'application/octet-stream';
};

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
export const detectFileTypeFromBuffer = (buffer: Buffer): string => {
  if (buffer.length < 8) return 'application/octet-stream';

  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    return 'image/png';
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    return 'image/jpeg';
  }

  // GIF: 47 49 46
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
    return 'image/gif';
  }

  // PDF: 25 50 44 46
  if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
    return 'application/pdf';
  }

  // ZIP: 50 4B 03 04
  if (buffer[0] === 0x50 && buffer[1] === 0x4B && buffer[2] === 0x03 && buffer[3] === 0x04) {
    return 'application/zip';
  }

  return 'application/octet-stream';
};

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
export const isImageFile = (mimeType: string): boolean => {
  return mimeType.startsWith('image/');
};

// ============================================================================
// FILE SIZE CALCULATION
// ============================================================================

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
export const getFileSize = async (filePath: string): Promise<number> => {
  try {
    const stats = await fsPromises.stat(filePath);
    return stats.size;
  } catch (error) {
    throw new Error(`Failed to get file size ${filePath}: ${error.message}`);
  }
};

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
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

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
export const getDirectorySize = async (dirPath: string): Promise<number> => {
  let totalSize = 0;

  const entries = await fsPromises.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      totalSize += await getDirectorySize(fullPath);
    } else if (entry.isFile()) {
      const stats = await fsPromises.stat(fullPath);
      totalSize += stats.size;
    }
  }

  return totalSize;
};

// ============================================================================
// FILE METADATA & PERMISSIONS
// ============================================================================

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
export const getFileMetadata = async (filePath: string): Promise<FileMetadata> => {
  try {
    const stats = await fsPromises.stat(filePath);
    const extension = getFileExtension(filePath);
    const mimeType = getMimeTypeFromExtension(filePath);

    return {
      name: path.basename(filePath),
      size: stats.size,
      mimeType,
      extension,
      path: filePath,
      createdAt: stats.birthtime,
      modifiedAt: stats.mtime,
    };
  } catch (error) {
    throw new Error(`Failed to get file metadata ${filePath}: ${error.message}`);
  }
};

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
export const changeFilePermissions = async (
  filePath: string,
  mode: string | number,
): Promise<void> => {
  try {
    await fsPromises.chmod(filePath, mode);
  } catch (error) {
    throw new Error(`Failed to change permissions ${filePath}: ${error.message}`);
  }
};

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
export const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    await fsPromises.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

// ============================================================================
// FILE STREAMING
// ============================================================================

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
export const createReadStream = (
  filePath: string,
  options?: any,
): fs.ReadStream => {
  return fs.createReadStream(filePath, options);
};

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
export const createWriteStream = (
  filePath: string,
  options?: any,
): fs.WriteStream => {
  return fs.createWriteStream(filePath, options);
};

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
export const pipeStreams = async (
  source: Readable,
  destination: Writable,
): Promise<void> => {
  try {
    await pipeline(source, destination);
  } catch (error) {
    throw new Error(`Failed to pipe streams: ${error.message}`);
  }
};

// ============================================================================
// TEMPORARY FILE CREATION
// ============================================================================

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
export const createTempFile = async (
  prefix: string = 'tmp',
  extension: string = '.tmp',
  dir?: string,
): Promise<string> => {
  const tempDir = dir || require('os').tmpdir();
  const filename = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}${extension}`;
  const tempPath = path.join(tempDir, filename);

  await writeFileAsync(tempPath, '');
  return tempPath;
};

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
export const createTempDirectory = async (prefix: string = 'tmpdir'): Promise<string> => {
  const tempBase = require('os').tmpdir();
  const dirName = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const tempDir = path.join(tempBase, dirName);

  await createDirectoryRecursive(tempDir);
  return tempDir;
};

// ============================================================================
// FILE VALIDATION
// ============================================================================

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
export const validateFileUpload = (
  file: { size: number; mimetype: string; originalname?: string },
  options: FileUploadOptions,
): FileValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check file size
  if (options.maxSize && file.size > options.maxSize) {
    errors.push(`File size ${formatFileSize(file.size)} exceeds maximum ${formatFileSize(options.maxSize)}`);
  }

  // Check MIME type
  if (options.allowedMimeTypes && !options.allowedMimeTypes.includes(file.mimetype)) {
    errors.push(`File type ${file.mimetype} is not allowed. Allowed types: ${options.allowedMimeTypes.join(', ')}`);
  }

  // Check extension
  if (options.allowedExtensions && file.originalname) {
    const ext = getFileExtension(file.originalname).toLowerCase();
    if (!options.allowedExtensions.includes(ext)) {
      errors.push(`File extension ${ext} is not allowed. Allowed extensions: ${options.allowedExtensions.join(', ')}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

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
export const validateFileForSecurity = (
  filename: string,
  buffer?: Buffer,
): FileValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for path traversal
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    errors.push('Filename contains path traversal characters');
  }

  // Check for null bytes
  if (filename.includes('\0')) {
    errors.push('Filename contains null bytes');
  }

  // Check for suspicious extensions
  const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.sh', '.ps1', '.dll'];
  const ext = getFileExtension(filename).toLowerCase();
  if (suspiciousExtensions.includes(ext)) {
    warnings.push(`Potentially dangerous file extension: ${ext}`);
  }

  // Check buffer for malicious patterns (if provided)
  if (buffer) {
    // Check for script tags in images (XSS)
    const content = buffer.toString('utf-8', 0, Math.min(buffer.length, 1000));
    if (content.includes('<script') || content.includes('javascript:')) {
      errors.push('File contains potentially malicious script content');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

// ============================================================================
// FILE CHUNKING
// ============================================================================

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
export const splitFileIntoChunks = async (
  filePath: string,
  chunkSize: number,
): Promise<ChunkInfo[]> => {
  const fileSize = await getFileSize(filePath);
  const totalChunks = Math.ceil(fileSize / chunkSize);
  const chunks: ChunkInfo[] = [];

  for (let i = 0; i < totalChunks; i++) {
    chunks.push({
      chunkIndex: i,
      chunkSize: Math.min(chunkSize, fileSize - i * chunkSize),
      totalChunks,
      totalSize: fileSize,
      offset: i * chunkSize,
    });
  }

  return chunks;
};

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
export const readFileChunk = async (
  filePath: string,
  offset: number,
  length: number,
): Promise<Buffer> => {
  const buffer = Buffer.alloc(length);
  const fileHandle = await fsPromises.open(filePath, 'r');

  try {
    await fileHandle.read(buffer, 0, length, offset);
    return buffer;
  } finally {
    await fileHandle.close();
  }
};

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
export const mergeFileChunks = async (
  chunkPaths: string[],
  outputPath: string,
): Promise<void> => {
  const writeStream = createWriteStream(outputPath);

  for (const chunkPath of chunkPaths) {
    const chunkBuffer = await readFileAsBuffer(chunkPath);
    writeStream.write(chunkBuffer);
  }

  writeStream.end();

  return new Promise((resolve, reject) => {
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });
};

// ============================================================================
// FILE UTILITIES
// ============================================================================

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
export const copyFile = async (sourcePath: string, destPath: string): Promise<void> => {
  try {
    await fsPromises.copyFile(sourcePath, destPath);
  } catch (error) {
    throw new Error(`Failed to copy file ${sourcePath} to ${destPath}: ${error.message}`);
  }
};

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
export const moveFile = async (sourcePath: string, destPath: string): Promise<void> => {
  try {
    await fsPromises.rename(sourcePath, destPath);
  } catch (error) {
    throw new Error(`Failed to move file ${sourcePath} to ${destPath}: ${error.message}`);
  }
};

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
export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    await fsPromises.unlink(filePath);
  } catch (error) {
    throw new Error(`Failed to delete file ${filePath}: ${error.message}`);
  }
};

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
export const calculateFileHash = async (
  filePath: string,
  algorithm: string = 'sha256',
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(algorithm);
    const stream = createReadStream(filePath);

    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
};

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
export const generateUniqueFilename = (originalName: string, prefix?: string): string => {
  const ext = getFileExtension(originalName);
  const nameWithoutExt = getFilenameWithoutExtension(originalName);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);

  const parts = [
    prefix,
    timestamp,
    random,
    sanitizeFilename(nameWithoutExt),
  ].filter(Boolean);

  return `${parts.join('-')}${ext}`;
};

export default {
  // File read operations
  readFileAsync,
  readFileSync,
  readFileAsBuffer,
  readJsonFile,
  readFileByLine,

  // File write operations
  writeFileAsync,
  writeFileSync,
  writeJsonFile,
  writeFileAtomic,

  // File append operations
  appendFileAsync,
  appendFileSync,
  appendLineToFile,

  // Directory operations
  createDirectoryRecursive,
  readDirectory,
  deleteDirectoryRecursive,
  directoryExists,
  listFilesRecursive,

  // File path utilities
  getAbsolutePath,
  getFileExtension,
  getFilenameWithoutExtension,
  joinPath,
  sanitizeFilename,

  // File type detection
  getMimeTypeFromExtension,
  detectFileTypeFromBuffer,
  isImageFile,

  // File size calculation
  getFileSize,
  formatFileSize,
  getDirectorySize,

  // File metadata & permissions
  getFileMetadata,
  changeFilePermissions,
  fileExists,

  // File streaming
  createReadStream,
  createWriteStream,
  pipeStreams,

  // Temporary file creation
  createTempFile,
  createTempDirectory,

  // File validation
  validateFileUpload,
  validateFileForSecurity,

  // File chunking
  splitFileIntoChunks,
  readFileChunk,
  mergeFileChunks,

  // File utilities
  copyFile,
  moveFile,
  deleteFile,
  calculateFileHash,
  generateUniqueFilename,
};
