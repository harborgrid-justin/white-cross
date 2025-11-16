/**
 * Bulk document upload hook
 *
 * @module hooks/documents/useBulkUpload
 * @description Hook for uploading multiple documents with progress tracking
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createUploadService } from '@/services/documents';
import type { Document, DocumentMetadata } from '@/types/documents';
import { documentsKeys } from './useDocuments';
import type { UploadOptions, UploadState } from './useDocumentUpload.types';
import { getClientApiBaseUrl } from './useDocumentUpload.types';

/**
 * Bulk upload hook
 */
export function useBulkDocumentUpload(options: UploadOptions = {}) {
  const queryClient = useQueryClient();

  const [uploads, setUploads] = useState<Map<string, UploadState>>(new Map());

  const uploadServicesRef = useRef<Map<string, ReturnType<typeof createUploadService>>>(new Map());

  const uploadFile = useCallback(
    async (file: File, metadata: Partial<DocumentMetadata>): Promise<Document> => {
      const uploadId = crypto.randomUUID();

      // Create upload service for this file
      const uploadService = createUploadService({
        endpoint: `${getClientApiBaseUrl()}/documents/upload`,
        token: options.token,
        enableRetry: options.enableRetry ?? true,
        maxFileSize: options.maxFileSize,
        allowedTypes: options.allowedTypes
      });

      uploadServicesRef.current.set(uploadId, uploadService);

      // Initialize upload state
      setUploads((prev) => {
        const newUploads = new Map(prev);
        newUploads.set(uploadId, {
          progress: null,
          status: 'uploading',
          document: null,
          error: null
        });
        return newUploads;
      });

      const fullMetadata = {
        folderId: options.folderId,
        ...metadata
      };

      return new Promise<Document>((resolve, reject) => {
        uploadService
          .uploadFile(file, fullMetadata, {
            onProgress: (progress) => {
              setUploads((prev) => {
                const newUploads = new Map(prev);
                const state = newUploads.get(uploadId) || {
                  progress: null,
                  status: 'uploading' as const,
                  document: null,
                  error: null
                };
                newUploads.set(uploadId, {
                  ...state,
                  progress,
                  status: progress.status === 'complete' ? 'processing' : 'uploading'
                });
                return newUploads;
              });
            },
            onSuccess: (response) => {
              setUploads((prev) => {
                const newUploads = new Map(prev);
                newUploads.set(uploadId, {
                  progress: null,
                  status: 'complete',
                  document: response.document,
                  error: null
                });
                return newUploads;
              });
              resolve(response.document);
            },
            onError: (error) => {
              setUploads((prev) => {
                const newUploads = new Map(prev);
                newUploads.set(uploadId, {
                  progress: null,
                  status: 'error',
                  document: null,
                  error: error.message
                });
                return newUploads;
              });
              reject(error);
            }
          })
          .catch(reject);
      });
    },
    [options]
  );

  const uploadMultiple = useCallback(
    async (files: File[], defaultMetadata: Partial<DocumentMetadata> = {}) => {
      const promises = files.map((file) =>
        uploadFile(file, {
          ...defaultMetadata,
          title: defaultMetadata.title || file.name
        })
      );

      const results = await Promise.allSettled(promises);

      // Invalidate documents list
      queryClient.invalidateQueries({ queryKey: documentsKeys.lists() });

      return results.map((result, index) => ({
        file: files[index],
        success: result.status === 'fulfilled',
        document: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason : null
      }));
    },
    [uploadFile, queryClient]
  );

  const cancelAll = useCallback(() => {
    uploadServicesRef.current.forEach((service) => service.cancelUpload());
    setUploads(new Map());
    uploadServicesRef.current.clear();
  }, []);

  const reset = useCallback(() => {
    setUploads(new Map());
  }, []);

  // Calculate aggregate progress
  const aggregateProgress = Array.from(uploads.values()).reduce(
    (acc, state) => {
      if (state.status === 'complete') acc.completed++;
      else if (state.status === 'error') acc.failed++;
      else if (state.status === 'uploading' || state.status === 'processing') acc.inProgress++;
      return acc;
    },
    { completed: 0, failed: 0, inProgress: 0 }
  );

  const totalFiles = uploads.size;
  const overallProgress =
    totalFiles > 0 ? (aggregateProgress.completed / totalFiles) * 100 : 0;

  return {
    uploadFile,
    uploadMultiple,
    cancelAll,
    reset,
    uploads: Array.from(uploads.entries()).map(([id, state]) => ({ id, ...state })),
    totalFiles,
    completed: aggregateProgress.completed,
    failed: aggregateProgress.failed,
    inProgress: aggregateProgress.inProgress,
    overallProgress,
    isUploading: aggregateProgress.inProgress > 0,
    allComplete: totalFiles > 0 && aggregateProgress.completed === totalFiles
  };
}
