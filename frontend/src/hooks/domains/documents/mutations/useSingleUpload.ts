/**
 * Single document upload hook
 *
 * @module hooks/documents/useSingleUpload
 * @description Hook for uploading single documents with progress tracking
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUploadService } from '@/services/documents';
import type { Document, DocumentMetadata } from '@/types/documents';
import { documentsKeys } from './useDocuments';
import type { UploadOptions, UploadState } from './useDocumentUpload.types';
import { getClientApiBaseUrl } from './useDocumentUpload.types';

/**
 * useDocumentUpload hook for single file uploads
 */
export function useDocumentUpload(options: UploadOptions = {}) {
  const queryClient = useQueryClient();

  const [uploadState, setUploadState] = useState<UploadState>({
    progress: null,
    status: 'idle',
    document: null,
    error: null
  });

  const uploadServiceRef = useRef(
    createUploadService({
      endpoint: `${getClientApiBaseUrl()}/documents/upload`,
      token: options.token,
      enableRetry: options.enableRetry ?? true,
      maxFileSize: options.maxFileSize,
      allowedTypes: options.allowedTypes
    })
  );

  const uploadMutation = useMutation({
    mutationFn: async ({
      file,
      metadata
    }: {
      file: File;
      metadata: Partial<DocumentMetadata>;
    }) => {
      setUploadState({
        progress: null,
        status: 'uploading',
        document: null,
        error: null
      });

      const fullMetadata = {
        folderId: options.folderId,
        ...metadata
      };

      return new Promise<Document>((resolve, reject) => {
        uploadServiceRef.current
          .uploadFile(file, fullMetadata, {
            onProgress: (progress) => {
              setUploadState((prev) => ({
                ...prev,
                progress,
                status: progress.status === 'complete' ? 'processing' : 'uploading'
              }));
            },
            onSuccess: (response) => {
              setUploadState({
                progress: null,
                status: 'complete',
                document: response.document,
                error: null
              });
              resolve(response.document);
            },
            onError: (error) => {
              setUploadState({
                progress: null,
                status: 'error',
                document: null,
                error: error.message
              });
              reject(error);
            }
          })
          .catch(reject);
      });
    },
    onSuccess: () => {
      // Invalidate documents list
      queryClient.invalidateQueries({ queryKey: documentsKeys.lists() });
    }
  });

  const upload = useCallback(
    (file: File, metadata: Partial<DocumentMetadata>) => {
      return uploadMutation.mutateAsync({ file, metadata });
    },
    [uploadMutation]
  );

  const cancel = useCallback(() => {
    uploadServiceRef.current.cancelUpload();
    setUploadState({
      progress: null,
      status: 'idle',
      document: null,
      error: null
    });
  }, []);

  const reset = useCallback(() => {
    setUploadState({
      progress: null,
      status: 'idle',
      document: null,
      error: null
    });
  }, []);

  return {
    upload,
    cancel,
    reset,
    progress: uploadState.progress,
    status: uploadState.status,
    document: uploadState.document,
    error: uploadState.error,
    isUploading: uploadState.status === 'uploading',
    isProcessing: uploadState.status === 'processing',
    isComplete: uploadState.status === 'complete',
    isError: uploadState.status === 'error'
  };
}
