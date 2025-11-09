"use strict";
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
exports.generateUniqueFilename = exports.calculateFileHash = exports.deleteFile = exports.moveFile = exports.copyFile = exports.mergeFileChunks = exports.readFileChunk = exports.splitFileIntoChunks = exports.validateFileForSecurity = exports.validateFileUpload = exports.createTempDirectory = exports.createTempFile = exports.pipeStreams = exports.createWriteStream = exports.createReadStream = exports.fileExists = exports.changeFilePermissions = exports.getFileMetadata = exports.getDirectorySize = exports.formatFileSize = exports.getFileSize = exports.isImageFile = exports.detectFileTypeFromBuffer = exports.getMimeTypeFromExtension = exports.sanitizeFilename = exports.joinPath = exports.getFilenameWithoutExtension = exports.getFileExtension = exports.getAbsolutePath = exports.listFilesRecursive = exports.directoryExists = exports.deleteDirectoryRecursive = exports.readDirectory = exports.createDirectoryRecursive = exports.appendLineToFile = exports.appendFileSync = exports.appendFileAsync = exports.writeFileAtomic = exports.writeJsonFile = exports.writeFileSync = exports.writeFileAsync = exports.readFileByLine = exports.readJsonFile = exports.readFileAsBuffer = exports.readFileSync = exports.readFileAsync = void 0;
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
const fs = __importStar(require("fs"));
const fsPromises = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
const promises_1 = require("stream/promises");
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
const readFileAsync = async (filePath, encoding = 'utf-8') => {
    try {
        return await fsPromises.readFile(filePath, encoding);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to read file ${filePath}: ${message}`);
    }
};
exports.readFileAsync = readFileAsync;
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
const readFileSync = (filePath, encoding = 'utf-8') => {
    try {
        return fs.readFileSync(filePath, encoding);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to read file ${filePath}: ${message}`);
    }
};
exports.readFileSync = readFileSync;
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
const readFileAsBuffer = async (filePath) => {
    try {
        return await fsPromises.readFile(filePath);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to read file buffer ${filePath}: ${message}`);
    }
};
exports.readFileAsBuffer = readFileAsBuffer;
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
const readJsonFile = async (filePath) => {
    try {
        const content = await (0, exports.readFileAsync)(filePath);
        return JSON.parse(content);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to read JSON file ${filePath}: ${message}`);
    }
};
exports.readJsonFile = readJsonFile;
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
const readFileByLine = async (filePath, callback) => {
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
exports.readFileByLine = readFileByLine;
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
const writeFileAsync = async (filePath, content, encoding = 'utf-8') => {
    try {
        await fsPromises.writeFile(filePath, content, encoding);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to write file ${filePath}: ${message}`);
    }
};
exports.writeFileAsync = writeFileAsync;
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
const writeFileSync = (filePath, content, encoding = 'utf-8') => {
    try {
        fs.writeFileSync(filePath, content, encoding);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to write file ${filePath}: ${message}`);
    }
};
exports.writeFileSync = writeFileSync;
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
const writeJsonFile = async (filePath, data, pretty = true) => {
    try {
        const content = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
        await (0, exports.writeFileAsync)(filePath, content);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to write JSON file ${filePath}: ${message}`);
    }
};
exports.writeJsonFile = writeJsonFile;
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
const writeFileAtomic = async (filePath, content) => {
    const tempPath = `${filePath}.tmp.${Date.now()}`;
    try {
        await (0, exports.writeFileAsync)(tempPath, content);
        await fsPromises.rename(tempPath, filePath);
    }
    catch (error) {
        await fsPromises.unlink(tempPath).catch(() => { });
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to write file atomically ${filePath}: ${message}`);
    }
};
exports.writeFileAtomic = writeFileAtomic;
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
const appendFileAsync = async (filePath, content, encoding = 'utf-8') => {
    try {
        await fsPromises.appendFile(filePath, content, encoding);
    }
    catch (error) {
        throw new Error(`Failed to append to file ${filePath}: ${error.message}`);
    }
};
exports.appendFileAsync = appendFileAsync;
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
const appendFileSync = (filePath, content, encoding = 'utf-8') => {
    try {
        fs.appendFileSync(filePath, content, encoding);
    }
    catch (error) {
        throw new Error(`Failed to append to file ${filePath}: ${error.message}`);
    }
};
exports.appendFileSync = appendFileSync;
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
const appendLineToFile = async (filePath, line) => {
    await (0, exports.appendFileAsync)(filePath, `${line}\n`);
};
exports.appendLineToFile = appendLineToFile;
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
const createDirectoryRecursive = async (dirPath) => {
    try {
        await fsPromises.mkdir(dirPath, { recursive: true });
    }
    catch (error) {
        throw new Error(`Failed to create directory ${dirPath}: ${error.message}`);
    }
};
exports.createDirectoryRecursive = createDirectoryRecursive;
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
const readDirectory = async (dirPath, withFileTypes = false) => {
    try {
        return await fsPromises.readdir(dirPath, { withFileTypes });
    }
    catch (error) {
        throw new Error(`Failed to read directory ${dirPath}: ${error.message}`);
    }
};
exports.readDirectory = readDirectory;
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
const deleteDirectoryRecursive = async (dirPath) => {
    try {
        await fsPromises.rm(dirPath, { recursive: true, force: true });
    }
    catch (error) {
        throw new Error(`Failed to delete directory ${dirPath}: ${error.message}`);
    }
};
exports.deleteDirectoryRecursive = deleteDirectoryRecursive;
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
const directoryExists = async (dirPath) => {
    try {
        const stats = await fsPromises.stat(dirPath);
        return stats.isDirectory();
    }
    catch {
        return false;
    }
};
exports.directoryExists = directoryExists;
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
const listFilesRecursive = async (dirPath, extensions) => {
    const results = [];
    const entries = await fsPromises.readdir(dirPath, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
            const subFiles = await (0, exports.listFilesRecursive)(fullPath, extensions);
            results.push(...subFiles);
        }
        else if (entry.isFile()) {
            if (!extensions || extensions.some(ext => fullPath.endsWith(ext))) {
                results.push(fullPath);
            }
        }
    }
    return results;
};
exports.listFilesRecursive = listFilesRecursive;
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
const getAbsolutePath = (relativePath) => {
    return path.resolve(relativePath);
};
exports.getAbsolutePath = getAbsolutePath;
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
const getFileExtension = (filePath) => {
    return path.extname(filePath);
};
exports.getFileExtension = getFileExtension;
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
const getFilenameWithoutExtension = (filePath) => {
    return path.basename(filePath, path.extname(filePath));
};
exports.getFilenameWithoutExtension = getFilenameWithoutExtension;
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
const joinPath = (...segments) => {
    return path.join(...segments);
};
exports.joinPath = joinPath;
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
const sanitizeFilename = (filename, replacement = '-') => {
    // Remove path separators and null bytes
    let sanitized = filename
        .replace(/[\\/\0]/g, '')
        .replace(/^\.+/, ''); // Remove leading dots
    // Remove potentially dangerous characters
    sanitized = sanitized
        .replace(/[^a-zA-Z0-9._-]/g, replacement)
        .replace(/\.{2,}/g, '.')
        .replace(new RegExp(`${replacement}{2,}`, 'g'), replacement)
        .trim();
    // Ensure filename is not empty after sanitization
    if (sanitized.length === 0) {
        sanitized = 'unnamed';
    }
    // Limit filename length to prevent filesystem issues
    const maxLength = 255;
    if (sanitized.length > maxLength) {
        const ext = path.extname(sanitized);
        const nameWithoutExt = sanitized.slice(0, maxLength - ext.length);
        sanitized = nameWithoutExt + ext;
    }
    return sanitized;
};
exports.sanitizeFilename = sanitizeFilename;
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
const getMimeTypeFromExtension = (filePath) => {
    const ext = (0, exports.getFileExtension)(filePath).toLowerCase();
    const mimeTypes = {
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
exports.getMimeTypeFromExtension = getMimeTypeFromExtension;
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
const detectFileTypeFromBuffer = (buffer) => {
    if (buffer.length < 8)
        return 'application/octet-stream';
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
exports.detectFileTypeFromBuffer = detectFileTypeFromBuffer;
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
const isImageFile = (mimeType) => {
    return mimeType.startsWith('image/');
};
exports.isImageFile = isImageFile;
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
const getFileSize = async (filePath) => {
    try {
        const stats = await fsPromises.stat(filePath);
        return stats.size;
    }
    catch (error) {
        throw new Error(`Failed to get file size ${filePath}: ${error.message}`);
    }
};
exports.getFileSize = getFileSize;
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
const formatFileSize = (bytes, decimals = 2) => {
    if (bytes === 0)
        return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};
exports.formatFileSize = formatFileSize;
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
const getDirectorySize = async (dirPath) => {
    let totalSize = 0;
    const entries = await fsPromises.readdir(dirPath, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
            totalSize += await (0, exports.getDirectorySize)(fullPath);
        }
        else if (entry.isFile()) {
            const stats = await fsPromises.stat(fullPath);
            totalSize += stats.size;
        }
    }
    return totalSize;
};
exports.getDirectorySize = getDirectorySize;
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
const getFileMetadata = async (filePath) => {
    try {
        const stats = await fsPromises.stat(filePath);
        const extension = (0, exports.getFileExtension)(filePath);
        const mimeType = (0, exports.getMimeTypeFromExtension)(filePath);
        return {
            name: path.basename(filePath),
            size: stats.size,
            mimeType,
            extension,
            path: filePath,
            createdAt: stats.birthtime,
            modifiedAt: stats.mtime,
        };
    }
    catch (error) {
        throw new Error(`Failed to get file metadata ${filePath}: ${error.message}`);
    }
};
exports.getFileMetadata = getFileMetadata;
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
const changeFilePermissions = async (filePath, mode) => {
    try {
        await fsPromises.chmod(filePath, mode);
    }
    catch (error) {
        throw new Error(`Failed to change permissions ${filePath}: ${error.message}`);
    }
};
exports.changeFilePermissions = changeFilePermissions;
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
const fileExists = async (filePath) => {
    try {
        await fsPromises.access(filePath, fs.constants.F_OK);
        return true;
    }
    catch {
        return false;
    }
};
exports.fileExists = fileExists;
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
const createReadStream = (filePath, options) => {
    return fs.createReadStream(filePath, options);
};
exports.createReadStream = createReadStream;
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
const createWriteStream = (filePath, options) => {
    return fs.createWriteStream(filePath, options);
};
exports.createWriteStream = createWriteStream;
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
const pipeStreams = async (source, destination) => {
    try {
        await (0, promises_1.pipeline)(source, destination);
    }
    catch (error) {
        throw new Error(`Failed to pipe streams: ${error.message}`);
    }
};
exports.pipeStreams = pipeStreams;
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
const createTempFile = async (prefix = 'tmp', extension = '.tmp', dir) => {
    const tempDir = dir || require('os').tmpdir();
    const filename = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}${extension}`;
    const tempPath = path.join(tempDir, filename);
    await (0, exports.writeFileAsync)(tempPath, '');
    return tempPath;
};
exports.createTempFile = createTempFile;
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
const createTempDirectory = async (prefix = 'tmpdir') => {
    const tempBase = require('os').tmpdir();
    const dirName = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const tempDir = path.join(tempBase, dirName);
    await (0, exports.createDirectoryRecursive)(tempDir);
    return tempDir;
};
exports.createTempDirectory = createTempDirectory;
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
const validateFileUpload = (file, options) => {
    const errors = [];
    const warnings = [];
    // Check file size
    if (options.maxSize && file.size > options.maxSize) {
        errors.push(`File size ${(0, exports.formatFileSize)(file.size)} exceeds maximum ${(0, exports.formatFileSize)(options.maxSize)}`);
    }
    // Check MIME type
    if (options.allowedMimeTypes && !options.allowedMimeTypes.includes(file.mimetype)) {
        errors.push(`File type ${file.mimetype} is not allowed. Allowed types: ${options.allowedMimeTypes.join(', ')}`);
    }
    // Check extension
    if (options.allowedExtensions && file.originalname) {
        const ext = (0, exports.getFileExtension)(file.originalname).toLowerCase();
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
exports.validateFileUpload = validateFileUpload;
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
const validateFileForSecurity = (filename, buffer) => {
    const errors = [];
    const warnings = [];
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
    const ext = (0, exports.getFileExtension)(filename).toLowerCase();
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
exports.validateFileForSecurity = validateFileForSecurity;
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
const splitFileIntoChunks = async (filePath, chunkSize) => {
    const fileSize = await (0, exports.getFileSize)(filePath);
    const totalChunks = Math.ceil(fileSize / chunkSize);
    const chunks = [];
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
exports.splitFileIntoChunks = splitFileIntoChunks;
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
const readFileChunk = async (filePath, offset, length) => {
    const buffer = Buffer.alloc(length);
    const fileHandle = await fsPromises.open(filePath, 'r');
    try {
        await fileHandle.read(buffer, 0, length, offset);
        return buffer;
    }
    finally {
        await fileHandle.close();
    }
};
exports.readFileChunk = readFileChunk;
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
const mergeFileChunks = async (chunkPaths, outputPath) => {
    const writeStream = (0, exports.createWriteStream)(outputPath);
    for (const chunkPath of chunkPaths) {
        const chunkBuffer = await (0, exports.readFileAsBuffer)(chunkPath);
        writeStream.write(chunkBuffer);
    }
    writeStream.end();
    return new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
    });
};
exports.mergeFileChunks = mergeFileChunks;
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
const copyFile = async (sourcePath, destPath) => {
    try {
        await fsPromises.copyFile(sourcePath, destPath);
    }
    catch (error) {
        throw new Error(`Failed to copy file ${sourcePath} to ${destPath}: ${error.message}`);
    }
};
exports.copyFile = copyFile;
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
const moveFile = async (sourcePath, destPath) => {
    try {
        await fsPromises.rename(sourcePath, destPath);
    }
    catch (error) {
        throw new Error(`Failed to move file ${sourcePath} to ${destPath}: ${error.message}`);
    }
};
exports.moveFile = moveFile;
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
const deleteFile = async (filePath) => {
    try {
        await fsPromises.unlink(filePath);
    }
    catch (error) {
        throw new Error(`Failed to delete file ${filePath}: ${error.message}`);
    }
};
exports.deleteFile = deleteFile;
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
const calculateFileHash = async (filePath, algorithm = 'sha256') => {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash(algorithm);
        const stream = (0, exports.createReadStream)(filePath);
        stream.on('data', (data) => hash.update(data));
        stream.on('end', () => resolve(hash.digest('hex')));
        stream.on('error', reject);
    });
};
exports.calculateFileHash = calculateFileHash;
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
const generateUniqueFilename = (originalName, prefix) => {
    const ext = (0, exports.getFileExtension)(originalName);
    const nameWithoutExt = (0, exports.getFilenameWithoutExtension)(originalName);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const parts = [
        prefix,
        timestamp,
        random,
        (0, exports.sanitizeFilename)(nameWithoutExt),
    ].filter(Boolean);
    return `${parts.join('-')}${ext}`;
};
exports.generateUniqueFilename = generateUniqueFilename;
exports.default = {
    // File read operations
    readFileAsync: exports.readFileAsync,
    readFileSync: exports.readFileSync,
    readFileAsBuffer: exports.readFileAsBuffer,
    readJsonFile: exports.readJsonFile,
    readFileByLine: exports.readFileByLine,
    // File write operations
    writeFileAsync: exports.writeFileAsync,
    writeFileSync: exports.writeFileSync,
    writeJsonFile: exports.writeJsonFile,
    writeFileAtomic: exports.writeFileAtomic,
    // File append operations
    appendFileAsync: exports.appendFileAsync,
    appendFileSync: exports.appendFileSync,
    appendLineToFile: exports.appendLineToFile,
    // Directory operations
    createDirectoryRecursive: exports.createDirectoryRecursive,
    readDirectory: exports.readDirectory,
    deleteDirectoryRecursive: exports.deleteDirectoryRecursive,
    directoryExists: exports.directoryExists,
    listFilesRecursive: exports.listFilesRecursive,
    // File path utilities
    getAbsolutePath: exports.getAbsolutePath,
    getFileExtension: exports.getFileExtension,
    getFilenameWithoutExtension: exports.getFilenameWithoutExtension,
    joinPath: exports.joinPath,
    sanitizeFilename: exports.sanitizeFilename,
    // File type detection
    getMimeTypeFromExtension: exports.getMimeTypeFromExtension,
    detectFileTypeFromBuffer: exports.detectFileTypeFromBuffer,
    isImageFile: exports.isImageFile,
    // File size calculation
    getFileSize: exports.getFileSize,
    formatFileSize: exports.formatFileSize,
    getDirectorySize: exports.getDirectorySize,
    // File metadata & permissions
    getFileMetadata: exports.getFileMetadata,
    changeFilePermissions: exports.changeFilePermissions,
    fileExists: exports.fileExists,
    // File streaming
    createReadStream: exports.createReadStream,
    createWriteStream: exports.createWriteStream,
    pipeStreams: exports.pipeStreams,
    // Temporary file creation
    createTempFile: exports.createTempFile,
    createTempDirectory: exports.createTempDirectory,
    // File validation
    validateFileUpload: exports.validateFileUpload,
    validateFileForSecurity: exports.validateFileForSecurity,
    // File chunking
    splitFileIntoChunks: exports.splitFileIntoChunks,
    readFileChunk: exports.readFileChunk,
    mergeFileChunks: exports.mergeFileChunks,
    // File utilities
    copyFile: exports.copyFile,
    moveFile: exports.moveFile,
    deleteFile: exports.deleteFile,
    calculateFileHash: exports.calculateFileHash,
    generateUniqueFilename: exports.generateUniqueFilename,
};
//# sourceMappingURL=file-handling-utils.js.map