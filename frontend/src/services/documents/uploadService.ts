/**
 * Document upload service with chunked upload support
 *
 * @module services/documents/uploadService
 * @description Handles file uploads with chunking, progress tracking, and resumability
 */

import { UploadProgress, ChunkedUploadSession } from '@/types/documents';

/**
 * Upload configuration
 */
interface UploadConfig {
  /** API endpoint for uploads */
  endpoint: string;

  /** Chunk size in bytes (default: 5MB) */
  chunkSize?: number;

  /** Maximum file size in bytes (default: 500MB) */
  maxFileSize?: number;

  /** Allowed file types */
  allowedTypes?: string[];

  /** Enable automatic retry */
  enableRetry?: boolean;

  /** Maximum retry attempts */
  maxRetries?: number;

  /** JWT token for authentication */
  token?: string;
}

/**
 * Upload callbacks
 */
interface UploadCallbacks {
  /** Progress callback */
  onProgress?: (progress: UploadProgress) => void;

  /** Success callback */
  onSuccess?: (response: any) => void;

  /** Error callback */
  onError?: (error: Error) => void;

  /** Chunk uploaded callback */
  onChunkComplete?: (chunkIndex: number, totalChunks: number) => void;
}

/**
 * Chunk size threshold for chunked uploads (50MB)
 */
const CHUNKED_UPLOAD_THRESHOLD = 50 * 1024 * 1024;

/**
 * Default chunk size (5MB)
 */
const DEFAULT_CHUNK_SIZE = 5 * 1024 * 1024;

/**
 * Calculate upload speed and remaining time
 */
function calculateProgress(
  uploadedSize: number,
  totalSize: number,
  startTime: number
): { speed: number; remainingTime: number } {
  const elapsedTime = (Date.now() - startTime) / 1000; // in seconds
  const speed = uploadedSize / elapsedTime; // bytes per second
  const remainingBytes = totalSize - uploadedSize;
  const remainingTime = speed > 0 ? remainingBytes / speed : 0;

  return { speed, remainingTime };
}

/**
 * Upload service class
 */
export class DocumentUploadService {
  private config: Required<UploadConfig>;
  private abortController: AbortController | null = null;

  constructor(config: UploadConfig) {
    this.config = {
      endpoint: config.endpoint,
      chunkSize: config.chunkSize || DEFAULT_CHUNK_SIZE,
      maxFileSize: config.maxFileSize || 500 * 1024 * 1024,
      allowedTypes: config.allowedTypes || [],
      enableRetry: config.enableRetry ?? true,
      maxRetries: config.maxRetries || 3,
      token: config.token || ''
    };
  }

  /**
   * Validate file before upload
   */
  private validateFile(file: File): void {
    // Check file size
    if (file.size > this.config.maxFileSize) {
      throw new Error(
        `File size exceeds maximum allowed size of ${this.config.maxFileSize / (1024 * 1024)}MB`
      );
    }

    // Check file type if restrictions exist
    if (this.config.allowedTypes.length > 0) {
      const fileType = file.type;
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      const isAllowed =
        this.config.allowedTypes.includes(fileType) ||
        this.config.allowedTypes.includes(`.${fileExtension}`);

      if (!isAllowed) {
        throw new Error(`File type "${fileType}" is not allowed`);
      }
    }
  }

  /**
   * Upload file (automatically chooses chunked or direct upload)
   */
  async uploadFile(
    file: File,
    metadata: Record<string, unknown>,
    callbacks?: UploadCallbacks
  ): Promise<any> {
    this.validateFile(file);

    // Use chunked upload for large files
    if (file.size > CHUNKED_UPLOAD_THRESHOLD) {
      return this.uploadFileChunked(file, metadata, callbacks);
    } else {
      return this.uploadFileDirect(file, metadata, callbacks);
    }
  }

  /**
   * Direct file upload for small files
   */
  private async uploadFileDirect(
    file: File,
    metadata: Record<string, unknown>,
    callbacks?: UploadCallbacks
  ): Promise<any> {
    this.abortController = new AbortController();
    const uploadId = crypto.randomUUID();
    const startTime = Date.now();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));

    try {
      const xhr = new XMLHttpRequest();

      // Progress tracking
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && callbacks?.onProgress) {
          const { speed, remainingTime } = calculateProgress(
            event.loaded,
            event.total,
            startTime
          );

          const progress: UploadProgress = {
            uploadId,
            fileName: file.name,
            totalSize: event.total,
            uploadedSize: event.loaded,
            percentage: (event.loaded / event.total) * 100,
            speed,
            remainingTime,
            status: 'uploading'
          };

          callbacks.onProgress(progress);
        }
      });

      // Upload completion
      return new Promise((resolve, reject) => {
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);

            if (callbacks?.onProgress) {
              const progress: UploadProgress = {
                uploadId,
                fileName: file.name,
                totalSize: file.size,
                uploadedSize: file.size,
                percentage: 100,
                speed: 0,
                remainingTime: 0,
                status: 'complete'
              };
              callbacks.onProgress(progress);
            }

            callbacks?.onSuccess?.(response);
            resolve(response);
          } else {
            const error = new Error(`Upload failed with status ${xhr.status}`);
            callbacks?.onError?.(error);
            reject(error);
          }
        });

        xhr.addEventListener('error', () => {
          const error = new Error('Upload failed');
          callbacks?.onError?.(error);
          reject(error);
        });

        xhr.addEventListener('abort', () => {
          const error = new Error('Upload cancelled');
          callbacks?.onError?.(error);
          reject(error);
        });

        xhr.open('POST', this.config.endpoint);
        if (this.config.token) {
          xhr.setRequestHeader('Authorization', `Bearer ${this.config.token}`);
        }
        xhr.send(formData);

        // Store XHR for abort capability
        this.abortController.signal.addEventListener('abort', () => {
          xhr.abort();
        });
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Upload failed');
      callbacks?.onError?.(err);
      throw err;
    }
  }

  /**
   * Chunked file upload for large files
   */
  private async uploadFileChunked(
    file: File,
    metadata: Record<string, unknown>,
    callbacks?: UploadCallbacks
  ): Promise<any> {
    this.abortController = new AbortController();
    const uploadId = crypto.randomUUID();
    const startTime = Date.now();

    const chunkSize = this.config.chunkSize;
    const totalChunks = Math.ceil(file.size / chunkSize);

    // Initialize upload session
    const session = await this.initializeChunkedUpload(
      uploadId,
      file.name,
      file.size,
      totalChunks,
      metadata
    );

    let uploadedSize = 0;

    try {
      // Upload each chunk
      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        if (this.abortController.signal.aborted) {
          throw new Error('Upload cancelled');
        }

        const start = chunkIndex * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);

        await this.uploadChunk(session.sessionId, chunkIndex, chunk);

        uploadedSize += chunk.size;

        const { speed, remainingTime } = calculateProgress(
          uploadedSize,
          file.size,
          startTime
        );

        if (callbacks?.onProgress) {
          const progress: UploadProgress = {
            uploadId,
            fileName: file.name,
            totalSize: file.size,
            uploadedSize,
            percentage: (uploadedSize / file.size) * 100,
            speed,
            remainingTime,
            status: 'uploading',
            currentChunk: chunkIndex,
            totalChunks
          };
          callbacks.onProgress(progress);
        }

        callbacks?.onChunkComplete?.(chunkIndex, totalChunks);
      }

      // Finalize upload
      const result = await this.finalizeChunkedUpload(session.sessionId);

      if (callbacks?.onProgress) {
        const progress: UploadProgress = {
          uploadId,
          fileName: file.name,
          totalSize: file.size,
          uploadedSize: file.size,
          percentage: 100,
          speed: 0,
          remainingTime: 0,
          status: 'complete'
        };
        callbacks.onProgress(progress);
      }

      callbacks?.onSuccess?.(result);
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Upload failed');
      callbacks?.onError?.(err);
      throw err;
    }
  }

  /**
   * Initialize chunked upload session
   */
  private async initializeChunkedUpload(
    sessionId: string,
    fileName: string,
    fileSize: number,
    totalChunks: number,
    metadata: Record<string, unknown>
  ): Promise<ChunkedUploadSession> {
    const response = await fetch(`${this.config.endpoint}/chunked/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.token && { Authorization: `Bearer ${this.config.token}` })
      },
      body: JSON.stringify({
        sessionId,
        fileName,
        fileSize,
        chunkSize: this.config.chunkSize,
        totalChunks,
        metadata
      }),
      signal: this.abortController?.signal
    });

    if (!response.ok) {
      throw new Error(`Failed to initialize upload: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Upload a single chunk
   */
  private async uploadChunk(
    sessionId: string,
    chunkIndex: number,
    chunk: Blob
  ): Promise<void> {
    const formData = new FormData();
    formData.append('sessionId', sessionId);
    formData.append('chunkIndex', chunkIndex.toString());
    formData.append('chunk', chunk);

    let retries = 0;

    while (retries <= this.config.maxRetries) {
      try {
        const response = await fetch(`${this.config.endpoint}/chunked/upload`, {
          method: 'POST',
          headers: {
            ...(this.config.token && { Authorization: `Bearer ${this.config.token}` })
          },
          body: formData,
          signal: this.abortController?.signal
        });

        if (!response.ok) {
          throw new Error(`Chunk upload failed: ${response.statusText}`);
        }

        return; // Success
      } catch (error) {
        retries++;

        if (retries > this.config.maxRetries || !this.config.enableRetry) {
          throw error;
        }

        // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, retries) * 1000));
      }
    }
  }

  /**
   * Finalize chunked upload
   */
  private async finalizeChunkedUpload(sessionId: string): Promise<any> {
    const response = await fetch(`${this.config.endpoint}/chunked/finalize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.token && { Authorization: `Bearer ${this.config.token}` })
      },
      body: JSON.stringify({ sessionId }),
      signal: this.abortController?.signal
    });

    if (!response.ok) {
      throw new Error(`Failed to finalize upload: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Cancel ongoing upload
   */
  cancelUpload(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  /**
   * Resume chunked upload
   */
  async resumeUpload(
    sessionId: string,
    file: File,
    callbacks?: UploadCallbacks
  ): Promise<any> {
    // Get session status
    const response = await fetch(`${this.config.endpoint}/chunked/status/${sessionId}`, {
      headers: {
        ...(this.config.token && { Authorization: `Bearer ${this.config.token}` })
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get upload session status');
    }

    const session: ChunkedUploadSession = await response.json();
    const uploadedChunks = new Set(session.uploadedChunks);
    const totalChunks = session.totalChunks;
    const chunkSize = session.chunkSize;

    const uploadId = crypto.randomUUID();
    const startTime = Date.now();
    let uploadedSize = uploadedChunks.size * chunkSize;

    this.abortController = new AbortController();

    try {
      // Upload missing chunks
      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        if (uploadedChunks.has(chunkIndex)) {
          continue; // Skip already uploaded chunks
        }

        const start = chunkIndex * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);

        await this.uploadChunk(sessionId, chunkIndex, chunk);

        uploadedSize += chunk.size;

        const { speed, remainingTime } = calculateProgress(
          uploadedSize,
          file.size,
          startTime
        );

        if (callbacks?.onProgress) {
          const progress: UploadProgress = {
            uploadId,
            fileName: file.name,
            totalSize: file.size,
            uploadedSize,
            percentage: (uploadedSize / file.size) * 100,
            speed,
            remainingTime,
            status: 'uploading',
            currentChunk: chunkIndex,
            totalChunks
          };
          callbacks.onProgress(progress);
        }

        callbacks?.onChunkComplete?.(chunkIndex, totalChunks);
      }

      // Finalize upload
      const result = await this.finalizeChunkedUpload(sessionId);

      if (callbacks?.onProgress) {
        const progress: UploadProgress = {
          uploadId,
          fileName: file.name,
          totalSize: file.size,
          uploadedSize: file.size,
          percentage: 100,
          speed: 0,
          remainingTime: 0,
          status: 'complete'
        };
        callbacks.onProgress(progress);
      }

      callbacks?.onSuccess?.(result);
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Upload failed');
      callbacks?.onError?.(err);
      throw err;
    }
  }
}

/**
 * Create upload service instance
 */
export function createUploadService(config: UploadConfig): DocumentUploadService {
  return new DocumentUploadService(config);
}
