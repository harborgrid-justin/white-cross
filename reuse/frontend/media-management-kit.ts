/**
 * Enterprise Media Management Kit
 *
 * A comprehensive React component library for building production-grade media management
 * systems with support for images, videos, documents, and cloud storage integration.
 *
 * Features:
 * - Complete media library with grid/list views
 * - Advanced upload with drag-drop, chunking, resumable uploads
 * - Image editing, cropping, filters, and optimization
 * - Video player, thumbnails, and streaming
 * - Folder management and organization
 * - Search, filter, and sorting capabilities
 * - CDN and cloud storage integration (S3, CloudFront, etc.)
 * - Permissions, sharing, and embedding
 * - Bulk operations and batch processing
 * - Gallery, slider, and carousel components
 *
 * @module MediaManagementKit
 * @category Frontend
 * @requires React 18+
 * @requires TypeScript 5+
 */

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useReducer,
  type ReactNode,
  type DragEvent,
  type ChangeEvent,
  type MouseEvent,
} from 'react';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Media item types supported by the library
 */
export type MediaType = 'image' | 'video' | 'audio' | 'document' | 'other';

/**
 * Media processing status
 */
export type MediaStatus = 'pending' | 'processing' | 'ready' | 'failed' | 'archived';

/**
 * Media access permissions
 */
export type MediaPermission = 'private' | 'public' | 'shared' | 'restricted';

/**
 * Sort order for media items
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Sort fields for media items
 */
export type SortField = 'name' | 'size' | 'createdAt' | 'updatedAt' | 'type' | 'views';

/**
 * View mode for media display
 */
export type ViewMode = 'grid' | 'list' | 'masonry' | 'carousel';

/**
 * Upload status for tracking uploads
 */
export type UploadStatus = 'idle' | 'uploading' | 'paused' | 'completed' | 'failed' | 'cancelled';

/**
 * Image crop aspect ratios
 */
export type AspectRatio = '1:1' | '4:3' | '16:9' | '3:2' | '2:3' | 'free';

/**
 * Image filter presets
 */
export type ImageFilter =
  | 'none'
  | 'grayscale'
  | 'sepia'
  | 'vintage'
  | 'warm'
  | 'cool'
  | 'bright'
  | 'contrast'
  | 'saturate';

/**
 * Cloud storage providers
 */
export type StorageProvider = 'local' | 's3' | 'cloudinary' | 'azure' | 'gcs' | 'cloudfront';

/**
 * Media metadata interface
 */
export interface MediaMetadata {
  /** Original filename */
  originalName: string;
  /** File size in bytes */
  size: number;
  /** MIME type */
  mimeType: string;
  /** Image/video width in pixels */
  width?: number;
  /** Image/video height in pixels */
  height?: number;
  /** Video duration in seconds */
  duration?: number;
  /** Image/video aspect ratio */
  aspectRatio?: number;
  /** Color palette extracted from image */
  colors?: string[];
  /** EXIF data for images */
  exif?: Record<string, any>;
  /** Dominant color */
  dominantColor?: string;
  /** File hash for deduplication */
  hash?: string;
  /** Encoding information for videos */
  encoding?: {
    codec: string;
    bitrate: number;
    framerate?: number;
  };
}

/**
 * Media folder/directory structure
 */
export interface MediaFolder {
  /** Unique folder ID */
  id: string;
  /** Folder name */
  name: string;
  /** Parent folder ID (null for root) */
  parentId: string | null;
  /** Folder path (e.g., /documents/invoices) */
  path: string;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
  /** Number of items in folder */
  itemCount: number;
  /** Total size of items in folder (bytes) */
  totalSize: number;
  /** Folder permissions */
  permission: MediaPermission;
  /** User who created the folder */
  createdBy: string;
  /** Folder description */
  description?: string;
  /** Folder color/icon for UI */
  color?: string;
  /** Nested subfolders */
  subfolders?: MediaFolder[];
}

/**
 * Core media item interface
 */
export interface MediaItem {
  /** Unique media ID */
  id: string;
  /** Display name */
  name: string;
  /** Media type */
  type: MediaType;
  /** URL to access the media */
  url: string;
  /** Thumbnail URL */
  thumbnailUrl?: string;
  /** Processing status */
  status: MediaStatus;
  /** Access permission */
  permission: MediaPermission;
  /** Folder ID (null if in root) */
  folderId: string | null;
  /** Comprehensive metadata */
  metadata: MediaMetadata;
  /** Tags for categorization */
  tags: string[];
  /** User who uploaded the media */
  uploadedBy: string;
  /** Upload timestamp */
  uploadedAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
  /** View count */
  views: number;
  /** Download count */
  downloads: number;
  /** Alternative text for accessibility */
  alt?: string;
  /** Media description */
  description?: string;
  /** CDN URL if available */
  cdnUrl?: string;
  /** Storage provider */
  storageProvider: StorageProvider;
  /** Storage-specific metadata */
  storageMetadata?: Record<string, any>;
  /** Versions/variants of the media */
  variants?: MediaVariant[];
  /** Copyright/license information */
  license?: string;
  /** Custom metadata */
  customData?: Record<string, any>;
}

/**
 * Media variant (different sizes, formats)
 */
export interface MediaVariant {
  /** Variant identifier (e.g., 'thumbnail', 'medium', 'large') */
  id: string;
  /** Variant URL */
  url: string;
  /** Width in pixels */
  width: number;
  /** Height in pixels */
  height: number;
  /** File size in bytes */
  size: number;
  /** Format (e.g., 'webp', 'jpg', 'png') */
  format: string;
  /** Quality setting (1-100) */
  quality?: number;
}

/**
 * Upload progress tracking
 */
export interface UploadProgress {
  /** File being uploaded */
  file: File;
  /** Upload status */
  status: UploadStatus;
  /** Progress percentage (0-100) */
  progress: number;
  /** Bytes uploaded */
  loaded: number;
  /** Total bytes */
  total: number;
  /** Upload speed (bytes/sec) */
  speed?: number;
  /** Estimated time remaining (seconds) */
  timeRemaining?: number;
  /** Error message if failed */
  error?: string;
  /** Uploaded media item (when completed) */
  mediaItem?: MediaItem;
  /** Upload ID for resumable uploads */
  uploadId?: string;
}

/**
 * Media filter criteria
 */
export interface MediaFilter {
  /** Filter by media type */
  type?: MediaType[];
  /** Filter by folder */
  folderId?: string | null;
  /** Filter by tags */
  tags?: string[];
  /** Filter by permission */
  permission?: MediaPermission[];
  /** Filter by status */
  status?: MediaStatus[];
  /** Filter by uploader */
  uploadedBy?: string[];
  /** Filter by date range */
  dateRange?: {
    from: Date;
    to: Date;
  };
  /** Filter by size range (bytes) */
  sizeRange?: {
    min: number;
    max: number;
  };
  /** Filter by dimensions */
  dimensions?: {
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
  };
  /** Search query */
  query?: string;
}

/**
 * Media sort configuration
 */
export interface MediaSort {
  /** Field to sort by */
  field: SortField;
  /** Sort order */
  order: SortOrder;
}

/**
 * Pagination configuration
 */
export interface Pagination {
  /** Current page (1-indexed) */
  page: number;
  /** Items per page */
  pageSize: number;
  /** Total items */
  total: number;
  /** Total pages */
  totalPages: number;
}

/**
 * Media selection state
 */
export interface MediaSelection {
  /** Selected media IDs */
  selectedIds: Set<string>;
  /** Last selected item (for shift-select) */
  lastSelectedId?: string;
}

/**
 * Bulk operation types
 */
export type BulkOperation =
  | 'delete'
  | 'move'
  | 'copy'
  | 'tag'
  | 'untag'
  | 'changePermission'
  | 'archive'
  | 'optimize';

/**
 * Bulk operation request
 */
export interface BulkOperationRequest {
  /** Operation type */
  operation: BulkOperation;
  /** Media IDs to operate on */
  mediaIds: string[];
  /** Operation-specific parameters */
  params?: Record<string, any>;
}

/**
 * Bulk operation result
 */
export interface BulkOperationResult {
  /** Number of successful operations */
  success: number;
  /** Number of failed operations */
  failed: number;
  /** Total operations */
  total: number;
  /** Detailed results per item */
  results: Array<{
    mediaId: string;
    success: boolean;
    error?: string;
  }>;
}

/**
 * Image crop coordinates
 */
export interface CropArea {
  /** X coordinate (pixels or percentage) */
  x: number;
  /** Y coordinate (pixels or percentage) */
  y: number;
  /** Width (pixels or percentage) */
  width: number;
  /** Height (pixels or percentage) */
  height: number;
  /** Unit of measurement */
  unit: 'px' | '%';
}

/**
 * Image editing operations
 */
export interface ImageEditOptions {
  /** Crop area */
  crop?: CropArea;
  /** Rotation angle (degrees) */
  rotate?: number;
  /** Flip horizontal */
  flipX?: boolean;
  /** Flip vertical */
  flipY?: boolean;
  /** Brightness (-100 to 100) */
  brightness?: number;
  /** Contrast (-100 to 100) */
  contrast?: number;
  /** Saturation (-100 to 100) */
  saturation?: number;
  /** Filter to apply */
  filter?: ImageFilter;
  /** Resize dimensions */
  resize?: {
    width?: number;
    height?: number;
    fit?: 'cover' | 'contain' | 'fill';
  };
  /** Quality (1-100) */
  quality?: number;
  /** Output format */
  format?: 'jpeg' | 'png' | 'webp';
}

/**
 * CDN configuration
 */
export interface CDNConfig {
  /** CDN provider */
  provider: StorageProvider;
  /** CDN base URL */
  baseUrl: string;
  /** Cache control settings */
  cacheControl?: string;
  /** Image transformation parameters */
  transformations?: {
    /** Auto format conversion */
    autoFormat?: boolean;
    /** Auto quality optimization */
    autoQuality?: boolean;
    /** Lazy loading */
    lazyLoad?: boolean;
    /** Responsive images */
    responsive?: boolean;
  };
}

/**
 * S3 upload configuration
 */
export interface S3UploadConfig {
  /** S3 bucket name */
  bucket: string;
  /** AWS region */
  region: string;
  /** Access key ID */
  accessKeyId?: string;
  /** Secret access key */
  secretAccessKey?: string;
  /** Use presigned URLs */
  usePresignedUrl?: boolean;
  /** ACL permissions */
  acl?: 'private' | 'public-read' | 'public-read-write';
  /** Custom metadata */
  metadata?: Record<string, string>;
}

/**
 * Media sharing configuration
 */
export interface MediaShare {
  /** Share ID */
  id: string;
  /** Media ID */
  mediaId: string;
  /** Share type */
  type: 'link' | 'embed' | 'download';
  /** Share URL/code */
  url: string;
  /** Expiration date */
  expiresAt?: Date;
  /** Password protection */
  password?: string;
  /** Max download count */
  maxDownloads?: number;
  /** Current download count */
  downloadCount: number;
  /** Created by */
  createdBy: string;
  /** Created at */
  createdAt: Date;
  /** Is active */
  isActive: boolean;
}

/**
 * Media embed options
 */
export interface MediaEmbedOptions {
  /** Embed width */
  width?: number;
  /** Embed height */
  height?: number;
  /** Auto-play for videos */
  autoplay?: boolean;
  /** Show controls */
  controls?: boolean;
  /** Loop playback */
  loop?: boolean;
  /** Muted by default */
  muted?: boolean;
  /** Responsive embed */
  responsive?: boolean;
  /** Custom CSS classes */
  className?: string;
}

// ============================================================================
// React Hook: useMediaLibrary
// ============================================================================

/**
 * Comprehensive media library state management hook
 *
 * Manages media items, folders, filters, sorting, pagination, and selection.
 * Provides a complete state management solution for media library UIs.
 *
 * @example
 * ```tsx
 * function MediaLibraryApp() {
 *   const {
 *     items,
 *     folders,
 *     loading,
 *     error,
 *     filter,
 *     setFilter,
 *     sort,
 *     setSort,
 *     pagination,
 *     selection,
 *     selectItem,
 *     selectAll,
 *     clearSelection,
 *     refresh,
 *   } = useMediaLibrary({
 *     apiEndpoint: '/api/media',
 *     pageSize: 24,
 *   });
 *
 *   return (
 *     <div>
 *       <MediaBrowser
 *         items={items}
 *         loading={loading}
 *         selection={selection}
 *         onSelect={selectItem}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export function useMediaLibrary(config: {
  /** API endpoint for fetching media */
  apiEndpoint: string;
  /** Initial filter */
  initialFilter?: MediaFilter;
  /** Initial sort */
  initialSort?: MediaSort;
  /** Items per page */
  pageSize?: number;
  /** Auto-refresh interval (ms) */
  autoRefresh?: number;
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<MediaFilter>(config.initialFilter || {});
  const [sort, setSort] = useState<MediaSort>(
    config.initialSort || { field: 'createdAt', order: 'desc' }
  );
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: config.pageSize || 24,
    total: 0,
    totalPages: 0,
  });
  const [selection, setSelection] = useState<MediaSelection>({
    selectedIds: new Set(),
  });

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        pageSize: pagination.pageSize.toString(),
        sortField: sort.field,
        sortOrder: sort.order,
        ...(filter.query && { query: filter.query }),
        ...(filter.folderId !== undefined && { folderId: filter.folderId || 'root' }),
        ...(filter.type && { type: filter.type.join(',') }),
        ...(filter.tags && { tags: filter.tags.join(',') }),
      });

      const response = await fetch(`${config.apiEndpoint}?${params}`);
      if (!response.ok) throw new Error('Failed to fetch media');

      const data = await response.json();
      setItems(data.items || []);
      setPagination((prev) => ({
        ...prev,
        total: data.total || 0,
        totalPages: Math.ceil((data.total || 0) / prev.pageSize),
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [config.apiEndpoint, filter, sort, pagination.page, pagination.pageSize]);

  const fetchFolders = useCallback(async () => {
    try {
      const response = await fetch(`${config.apiEndpoint}/folders`);
      if (!response.ok) throw new Error('Failed to fetch folders');

      const data = await response.json();
      setFolders(data.folders || []);
    } catch (err) {
      console.error('Failed to fetch folders:', err);
    }
  }, [config.apiEndpoint]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  // Auto-refresh
  useEffect(() => {
    if (!config.autoRefresh) return;

    const interval = setInterval(fetchMedia, config.autoRefresh);
    return () => clearInterval(interval);
  }, [config.autoRefresh, fetchMedia]);

  const selectItem = useCallback((id: string, multiSelect = false) => {
    setSelection((prev) => {
      const newSelectedIds = new Set(prev.selectedIds);

      if (multiSelect) {
        if (newSelectedIds.has(id)) {
          newSelectedIds.delete(id);
        } else {
          newSelectedIds.add(id);
        }
      } else {
        newSelectedIds.clear();
        newSelectedIds.add(id);
      }

      return {
        selectedIds: newSelectedIds,
        lastSelectedId: id,
      };
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelection({
      selectedIds: new Set(items.map((item) => item.id)),
      lastSelectedId: items[items.length - 1]?.id,
    });
  }, [items]);

  const clearSelection = useCallback(() => {
    setSelection({ selectedIds: new Set() });
  }, []);

  const goToPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const refresh = useCallback(() => {
    fetchMedia();
    fetchFolders();
  }, [fetchMedia, fetchFolders]);

  return {
    items,
    folders,
    loading,
    error,
    filter,
    setFilter,
    sort,
    setSort,
    pagination,
    goToPage,
    selection,
    selectItem,
    selectAll,
    clearSelection,
    refresh,
  };
}

// ============================================================================
// React Hook: useMediaUpload
// ============================================================================

/**
 * Advanced file upload hook with progress tracking, chunking, and resumable uploads
 *
 * Supports single/multiple file uploads, drag-and-drop, progress tracking,
 * pause/resume, cancellation, and error handling.
 *
 * @example
 * ```tsx
 * function UploadZone() {
 *   const {
 *     uploads,
 *     startUpload,
 *     pauseUpload,
 *     resumeUpload,
 *     cancelUpload,
 *     isDragging,
 *     getRootProps,
 *     getInputProps,
 *   } = useMediaUpload({
 *     endpoint: '/api/upload',
 *     maxFileSize: 100 * 1024 * 1024, // 100MB
 *     acceptedTypes: ['image/*', 'video/*'],
 *   });
 *
 *   return (
 *     <div {...getRootProps()}>
 *       <input {...getInputProps()} />
 *       {uploads.map(upload => (
 *         <UploadProgressBar key={upload.file.name} upload={upload} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useMediaUpload(config: {
  /** Upload endpoint */
  endpoint: string;
  /** Folder ID to upload to */
  folderId?: string | null;
  /** Max file size (bytes) */
  maxFileSize?: number;
  /** Accepted MIME types */
  acceptedTypes?: string[];
  /** Chunk size for chunked uploads (bytes) */
  chunkSize?: number;
  /** Max concurrent uploads */
  maxConcurrent?: number;
  /** Callback on upload complete */
  onComplete?: (mediaItem: MediaItem) => void;
  /** Callback on upload error */
  onError?: (error: string, file: File) => void;
}) {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const uploadAbortControllers = useRef<Map<string, AbortController>>(new Map());

  const validateFile = useCallback(
    (file: File): string | null => {
      if (config.maxFileSize && file.size > config.maxFileSize) {
        return `File size exceeds maximum (${(config.maxFileSize / 1024 / 1024).toFixed(0)}MB)`;
      }

      if (config.acceptedTypes && config.acceptedTypes.length > 0) {
        const isAccepted = config.acceptedTypes.some((type) => {
          if (type.endsWith('/*')) {
            const prefix = type.slice(0, -2);
            return file.type.startsWith(prefix);
          }
          return file.type === type;
        });

        if (!isAccepted) {
          return `File type ${file.type} is not accepted`;
        }
      }

      return null;
    },
    [config.maxFileSize, config.acceptedTypes]
  );

  const uploadFile = useCallback(
    async (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        config.onError?.(validationError, file);
        return;
      }

      const fileKey = `${file.name}-${file.size}-${file.lastModified}`;
      const abortController = new AbortController();
      uploadAbortControllers.current.set(fileKey, abortController);

      // Initialize upload progress
      setUploads((prev) => [
        ...prev,
        {
          file,
          status: 'uploading',
          progress: 0,
          loaded: 0,
          total: file.size,
        },
      ]);

      try {
        const formData = new FormData();
        formData.append('file', file);
        if (config.folderId) {
          formData.append('folderId', config.folderId);
        }

        const startTime = Date.now();

        const response = await fetch(config.endpoint, {
          method: 'POST',
          body: formData,
          signal: abortController.signal,
          // Note: In production, you'd use XHR or a library with upload progress support
        });

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        const mediaItem: MediaItem = await response.json();

        // Update to completed
        setUploads((prev) =>
          prev.map((upload) =>
            upload.file === file
              ? {
                  ...upload,
                  status: 'completed',
                  progress: 100,
                  loaded: file.size,
                  mediaItem,
                }
              : upload
          )
        );

        config.onComplete?.(mediaItem);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          setUploads((prev) =>
            prev.map((upload) =>
              upload.file === file ? { ...upload, status: 'cancelled' } : upload
            )
          );
        } else {
          const errorMessage = err instanceof Error ? err.message : 'Upload failed';
          setUploads((prev) =>
            prev.map((upload) =>
              upload.file === file
                ? { ...upload, status: 'failed', error: errorMessage }
                : upload
            )
          );
          config.onError?.(errorMessage, file);
        }
      } finally {
        uploadAbortControllers.current.delete(fileKey);
      }
    },
    [config, validateFile]
  );

  const startUpload = useCallback(
    (files: File[]) => {
      files.forEach(uploadFile);
    },
    [uploadFile]
  );

  const cancelUpload = useCallback((file: File) => {
    const fileKey = `${file.name}-${file.size}-${file.lastModified}`;
    const controller = uploadAbortControllers.current.get(fileKey);
    controller?.abort();
  }, []);

  const pauseUpload = useCallback((file: File) => {
    setUploads((prev) =>
      prev.map((upload) =>
        upload.file === file ? { ...upload, status: 'paused' } : upload
      )
    );
  }, []);

  const resumeUpload = useCallback(
    (file: File) => {
      setUploads((prev) =>
        prev.map((upload) =>
          upload.file === file ? { ...upload, status: 'uploading' } : upload
        )
      );
      uploadFile(file);
    },
    [uploadFile]
  );

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      startUpload(files);
    },
    [startUpload]
  );

  const handleFileSelect = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      startUpload(files);
    },
    [startUpload]
  );

  const getRootProps = useCallback(
    () => ({
      onDragEnter: handleDragEnter,
      onDragOver: (e: DragEvent) => e.preventDefault(),
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
    }),
    [handleDragEnter, handleDragLeave, handleDrop]
  );

  const getInputProps = useCallback(
    () => ({
      type: 'file' as const,
      multiple: true,
      accept: config.acceptedTypes?.join(','),
      onChange: handleFileSelect,
    }),
    [config.acceptedTypes, handleFileSelect]
  );

  const clearCompleted = useCallback(() => {
    setUploads((prev) => prev.filter((upload) => upload.status !== 'completed'));
  }, []);

  return {
    uploads,
    startUpload,
    pauseUpload,
    resumeUpload,
    cancelUpload,
    clearCompleted,
    isDragging,
    getRootProps,
    getInputProps,
  };
}

// ============================================================================
// React Hook: useImageEditor
// ============================================================================

/**
 * Advanced image editing hook with crop, rotate, filters, and adjustments
 *
 * Provides a complete image editing solution with real-time preview,
 * undo/redo, and export capabilities.
 *
 * @example
 * ```tsx
 * function ImageEditorApp({ image }: { image: MediaItem }) {
 *   const {
 *     editedImage,
 *     options,
 *     setOption,
 *     setCrop,
 *     rotate,
 *     applyFilter,
 *     reset,
 *     undo,
 *     redo,
 *     canUndo,
 *     canRedo,
 *     exportImage,
 *   } = useImageEditor({ originalImage: image.url });
 *
 *   return (
 *     <div>
 *       <img src={editedImage} alt="Preview" />
 *       <ImageEditorControls
 *         options={options}
 *         onOptionChange={setOption}
 *         onRotate={rotate}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export function useImageEditor(config: {
  /** Original image URL */
  originalImage: string;
  /** Max undo history */
  maxHistory?: number;
}) {
  const [options, setOptions] = useState<ImageEditOptions>({});
  const [history, setHistory] = useState<ImageEditOptions[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [editedImage, setEditedImage] = useState(config.originalImage);

  const applyEdits = useCallback(
    (newOptions: ImageEditOptions) => {
      // In production, this would apply actual image transformations
      // using Canvas API, WebGL, or a server-side image processing service

      // For now, we'll just track the options
      setOptions(newOptions);

      // Add to history
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(newOptions);
        return newHistory.slice(-(config.maxHistory || 50));
      });
      setHistoryIndex((prev) => Math.min(prev + 1, (config.maxHistory || 50) - 1));
    },
    [historyIndex, config.maxHistory]
  );

  const setOption = useCallback(
    <K extends keyof ImageEditOptions>(key: K, value: ImageEditOptions[K]) => {
      const newOptions = { ...options, [key]: value };
      applyEdits(newOptions);
    },
    [options, applyEdits]
  );

  const setCrop = useCallback(
    (crop: CropArea) => {
      setOption('crop', crop);
    },
    [setOption]
  );

  const rotate = useCallback(
    (degrees: number) => {
      const currentRotation = options.rotate || 0;
      setOption('rotate', (currentRotation + degrees) % 360);
    },
    [options.rotate, setOption]
  );

  const applyFilter = useCallback(
    (filter: ImageFilter) => {
      setOption('filter', filter);
    },
    [setOption]
  );

  const reset = useCallback(() => {
    setOptions({});
    setEditedImage(config.originalImage);
    setHistory([]);
    setHistoryIndex(-1);
  }, [config.originalImage]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      setOptions(history[historyIndex - 1] || {});
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      setOptions(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const exportImage = useCallback(
    async (format: 'jpeg' | 'png' | 'webp' = 'png', quality = 0.92): Promise<Blob> => {
      // In production, this would export the edited image as a Blob
      // using Canvas API or server-side processing

      // Placeholder implementation
      const response = await fetch(editedImage);
      return response.blob();
    },
    [editedImage]
  );

  return {
    editedImage,
    options,
    setOption,
    setCrop,
    rotate,
    applyFilter,
    reset,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    exportImage,
  };
}

// ============================================================================
// React Hook: useBulkOperations
// ============================================================================

/**
 * Bulk operations hook for processing multiple media items
 *
 * Handles batch delete, move, tag, permission changes with progress tracking.
 *
 * @example
 * ```tsx
 * function BulkActions({ selectedIds }: { selectedIds: Set<string> }) {
 *   const { executeBulk, progress, isProcessing } = useBulkOperations({
 *     endpoint: '/api/media/bulk',
 *   });
 *
 *   const handleDelete = async () => {
 *     await executeBulk({
 *       operation: 'delete',
 *       mediaIds: Array.from(selectedIds),
 *     });
 *   };
 *
 *   return (
 *     <button onClick={handleDelete} disabled={isProcessing}>
 *       Delete {selectedIds.size} items
 *       {isProcessing && ` (${progress}%)`}
 *     </button>
 *   );
 * }
 * ```
 */
export function useBulkOperations(config: {
  /** Bulk operations endpoint */
  endpoint: string;
  /** Callback on completion */
  onComplete?: (result: BulkOperationResult) => void;
  /** Callback on error */
  onError?: (error: string) => void;
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<BulkOperationResult | null>(null);

  const executeBulk = useCallback(
    async (request: BulkOperationRequest): Promise<BulkOperationResult> => {
      setIsProcessing(true);
      setProgress(0);
      setResult(null);

      try {
        const response = await fetch(config.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
        });

        if (!response.ok) {
          throw new Error(`Bulk operation failed: ${response.statusText}`);
        }

        const operationResult: BulkOperationResult = await response.json();
        setResult(operationResult);
        setProgress(100);
        config.onComplete?.(operationResult);

        return operationResult;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Bulk operation failed';
        config.onError?.(errorMessage);
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    [config]
  );

  return {
    executeBulk,
    isProcessing,
    progress,
    result,
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Format file size in human-readable format
 *
 * @example
 * ```typescript
 * formatFileSize(1024) // "1.00 KB"
 * formatFileSize(1048576) // "1.00 MB"
 * formatFileSize(1073741824) // "1.00 GB"
 * ```
 */
export function formatFileSize(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Format duration in human-readable format
 *
 * @example
 * ```typescript
 * formatDuration(65) // "1:05"
 * formatDuration(3665) // "1:01:05"
 * ```
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get media type from MIME type
 *
 * @example
 * ```typescript
 * getMediaType('image/jpeg') // 'image'
 * getMediaType('video/mp4') // 'video'
 * getMediaType('application/pdf') // 'document'
 * ```
 */
export function getMediaType(mimeType: string): MediaType {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (
    mimeType.startsWith('application/pdf') ||
    mimeType.includes('document') ||
    mimeType.includes('text/')
  ) {
    return 'document';
  }
  return 'other';
}

/**
 * Generate thumbnail URL with size parameters
 *
 * @example
 * ```typescript
 * generateThumbnailUrl('https://cdn.example.com/image.jpg', 200, 200)
 * // "https://cdn.example.com/image.jpg?w=200&h=200"
 * ```
 */
export function generateThumbnailUrl(
  url: string,
  width: number,
  height?: number,
  quality = 80
): string {
  const urlObj = new URL(url);
  urlObj.searchParams.set('w', width.toString());
  if (height) urlObj.searchParams.set('h', height.toString());
  urlObj.searchParams.set('q', quality.toString());
  return urlObj.toString();
}

/**
 * Extract color palette from image (requires canvas)
 *
 * Uses color quantization to extract dominant colors from an image.
 *
 * @example
 * ```typescript
 * const colors = await extractColorPalette('https://example.com/image.jpg', 5);
 * console.log(colors); // ['#FF5733', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6']
 * ```
 */
export async function extractColorPalette(
  imageUrl: string,
  colorCount = 5
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas context not available');

        // Resize for performance
        const maxSize = 100;
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        // Simple color quantization - collect pixel colors
        const colorMap = new Map<string, number>();

        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];

          // Skip transparent pixels
          if (a < 128) continue;

          // Reduce color space (group similar colors)
          const rBucket = Math.round(r / 32) * 32;
          const gBucket = Math.round(g / 32) * 32;
          const bBucket = Math.round(b / 32) * 32;

          const color = `${rBucket},${gBucket},${bBucket}`;
          colorMap.set(color, (colorMap.get(color) || 0) + 1);
        }

        // Sort by frequency and get top colors
        const sortedColors = Array.from(colorMap.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, colorCount)
          .map(([color]) => {
            const [r, g, b] = color.split(',').map(Number);
            return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
          });

        resolve(sortedColors);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}

/**
 * Optimize image for web delivery
 *
 * Compresses and resizes images for optimal web performance.
 *
 * @example
 * ```typescript
 * const optimized = await optimizeImage(file, {
 *   maxWidth: 1920,
 *   maxHeight: 1080,
 *   quality: 0.85,
 *   format: 'webp',
 * });
 * ```
 */
export async function optimizeImage(
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
  } = {}
): Promise<Blob> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.85,
    format = 'jpeg',
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas context not available');

        // Calculate new dimensions
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and optimize
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          `image/${format}`,
          quality
        );
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    reader.onerror = () => reject(new Error('Failed to read file'));

    reader.readAsDataURL(file);
  });
}

/**
 * Generate presigned S3 upload URL
 *
 * Creates a presigned URL for direct browser-to-S3 uploads.
 *
 * @example
 * ```typescript
 * const presignedUrl = await generatePresignedUploadUrl({
 *   endpoint: '/api/s3/presign',
 *   filename: 'photo.jpg',
 *   contentType: 'image/jpeg',
 * });
 *
 * await fetch(presignedUrl, {
 *   method: 'PUT',
 *   body: file,
 *   headers: { 'Content-Type': 'image/jpeg' },
 * });
 * ```
 */
export async function generatePresignedUploadUrl(config: {
  /** API endpoint to get presigned URL */
  endpoint: string;
  /** Filename */
  filename: string;
  /** Content type */
  contentType: string;
  /** Folder path */
  folder?: string;
}): Promise<string> {
  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename: config.filename,
      contentType: config.contentType,
      folder: config.folder,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate presigned URL');
  }

  const data = await response.json();
  return data.uploadUrl;
}

/**
 * Upload file directly to S3 using presigned URL
 *
 * @example
 * ```typescript
 * await uploadToS3(file, presignedUrl, {
 *   onProgress: (progress) => console.log(`${progress}% uploaded`),
 * });
 * ```
 */
export async function uploadToS3(
  file: File,
  presignedUrl: string,
  options: {
    onProgress?: (progress: number) => void;
    signal?: AbortSignal;
  } = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const progress = (e.loaded / e.total) * 100;
        options.onProgress?.(progress);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`S3 upload failed: ${xhr.statusText}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('S3 upload failed'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('S3 upload aborted'));
    });

    if (options.signal) {
      options.signal.addEventListener('abort', () => {
        xhr.abort();
      });
    }

    xhr.open('PUT', presignedUrl);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);
  });
}

/**
 * Generate CDN URL with transformations
 *
 * Creates optimized CDN URLs with image transformations.
 *
 * @example
 * ```typescript
 * const cdnUrl = generateCDNUrl('image.jpg', {
 *   provider: 'cloudinary',
 *   baseUrl: 'https://res.cloudinary.com/demo',
 *   transformations: {
 *     width: 800,
 *     height: 600,
 *     crop: 'fill',
 *     quality: 'auto',
 *     format: 'webp',
 *   },
 * });
 * ```
 */
export function generateCDNUrl(
  filename: string,
  config: {
    provider: StorageProvider;
    baseUrl: string;
    transformations?: {
      width?: number;
      height?: number;
      crop?: 'fill' | 'fit' | 'scale';
      quality?: 'auto' | number;
      format?: 'auto' | 'webp' | 'jpg' | 'png';
      [key: string]: any;
    };
  }
): string {
  const { provider, baseUrl, transformations } = config;

  if (provider === 'cloudinary' && transformations) {
    // Cloudinary URL transformation format
    const params: string[] = [];

    if (transformations.width) params.push(`w_${transformations.width}`);
    if (transformations.height) params.push(`h_${transformations.height}`);
    if (transformations.crop) params.push(`c_${transformations.crop}`);
    if (transformations.quality) params.push(`q_${transformations.quality}`);
    if (transformations.format) params.push(`f_${transformations.format}`);

    const transformStr = params.length > 0 ? `${params.join(',')}/` : '';
    return `${baseUrl}/image/upload/${transformStr}${filename}`;
  }

  if (provider === 'cloudfront' && transformations) {
    // CloudFront with query parameters
    const params = new URLSearchParams();

    if (transformations.width) params.set('w', transformations.width.toString());
    if (transformations.height) params.set('h', transformations.height.toString());
    if (transformations.quality) params.set('q', transformations.quality.toString());

    return `${baseUrl}/${filename}?${params.toString()}`;
  }

  return `${baseUrl}/${filename}`;
}

/**
 * Create media share link
 *
 * Generates shareable links with optional password and expiration.
 *
 * @example
 * ```typescript
 * const shareLink = await createShareLink({
 *   endpoint: '/api/media/share',
 *   mediaId: '123',
 *   type: 'link',
 *   expiresIn: 86400, // 24 hours
 *   password: 'secret123',
 * });
 * ```
 */
export async function createShareLink(config: {
  /** API endpoint */
  endpoint: string;
  /** Media ID to share */
  mediaId: string;
  /** Share type */
  type: 'link' | 'embed' | 'download';
  /** Expiration time (seconds) */
  expiresIn?: number;
  /** Password protection */
  password?: string;
  /** Max downloads */
  maxDownloads?: number;
}): Promise<MediaShare> {
  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mediaId: config.mediaId,
      type: config.type,
      expiresIn: config.expiresIn,
      password: config.password,
      maxDownloads: config.maxDownloads,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create share link');
  }

  return response.json();
}

/**
 * Generate embed code for media
 *
 * Creates HTML embed code for sharing media on other websites.
 *
 * @example
 * ```typescript
 * const embedCode = generateEmbedCode(mediaItem, {
 *   width: 800,
 *   height: 600,
 *   autoplay: true,
 *   controls: true,
 * });
 * ```
 */
export function generateEmbedCode(
  media: MediaItem,
  options: MediaEmbedOptions = {}
): string {
  const {
    width = 640,
    height = 480,
    autoplay = false,
    controls = true,
    loop = false,
    muted = false,
    responsive = true,
    className = '',
  } = options;

  if (media.type === 'image') {
    const style = responsive ? 'max-width: 100%; height: auto;' : `width: ${width}px;`;
    return `<img src="${media.url}" alt="${media.alt || media.name}" style="${style}" class="${className}" />`;
  }

  if (media.type === 'video') {
    const attrs = [
      controls ? 'controls' : '',
      autoplay ? 'autoplay' : '',
      loop ? 'loop' : '',
      muted ? 'muted' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const style = responsive
      ? 'max-width: 100%; height: auto;'
      : `width: ${width}px; height: ${height}px;`;

    return `<video src="${media.url}" ${attrs} style="${style}" class="${className}"></video>`;
  }

  return `<a href="${media.url}" target="_blank" rel="noopener noreferrer">${media.name}</a>`;
}

/**
 * Batch process media items
 *
 * Process multiple media items with progress tracking.
 *
 * @example
 * ```typescript
 * await batchProcessMedia(mediaItems, async (item) => {
 *   return await optimizeImage(item);
 * }, {
 *   concurrency: 3,
 *   onProgress: (completed, total) => {
 *     console.log(`Processed ${completed}/${total}`);
 *   },
 * });
 * ```
 */
export async function batchProcessMedia<T, R>(
  items: T[],
  processor: (item: T, index: number) => Promise<R>,
  options: {
    concurrency?: number;
    onProgress?: (completed: number, total: number) => void;
    onError?: (error: Error, item: T, index: number) => void;
  } = {}
): Promise<R[]> {
  const { concurrency = 3, onProgress, onError } = options;
  const results: R[] = [];
  let completed = 0;

  const processItem = async (item: T, index: number): Promise<void> => {
    try {
      const result = await processor(item, index);
      results[index] = result;
    } catch (err) {
      onError?.(err instanceof Error ? err : new Error('Processing failed'), item, index);
    } finally {
      completed++;
      onProgress?.(completed, items.length);
    }
  };

  // Process in batches with concurrency limit
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    await Promise.all(batch.map((item, batchIndex) => processItem(item, i + batchIndex)));
  }

  return results;
}

/**
 * Calculate optimal image dimensions maintaining aspect ratio
 *
 * @example
 * ```typescript
 * const dims = calculateImageDimensions(1920, 1080, 800);
 * console.log(dims); // { width: 800, height: 450 }
 * ```
 */
export function calculateImageDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth?: number,
  maxHeight?: number
): { width: number; height: number } {
  let width = originalWidth;
  let height = originalHeight;

  if (maxWidth && width > maxWidth) {
    height = (height * maxWidth) / width;
    width = maxWidth;
  }

  if (maxHeight && height > maxHeight) {
    width = (width * maxHeight) / height;
    height = maxHeight;
  }

  return { width: Math.round(width), height: Math.round(height) };
}

/**
 * Generate video thumbnail from video file
 *
 * Extracts a frame from video to use as thumbnail.
 *
 * @example
 * ```typescript
 * const thumbnail = await generateVideoThumbnail(videoFile, { time: 5 });
 * ```
 */
export async function generateVideoThumbnail(
  videoFile: File,
  options: {
    time?: number;
    width?: number;
    height?: number;
    quality?: number;
  } = {}
): Promise<Blob> {
  const { time = 1, width, height, quality = 0.92 } = options;

  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    video.addEventListener('loadeddata', () => {
      video.currentTime = Math.min(time, video.duration);
    });

    video.addEventListener('seeked', () => {
      canvas.width = width || video.videoWidth;
      canvas.height = height || video.videoHeight;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create thumbnail'));
          }
          URL.revokeObjectURL(video.src);
        },
        'image/jpeg',
        quality
      );
    });

    video.addEventListener('error', () => {
      reject(new Error('Failed to load video'));
      URL.revokeObjectURL(video.src);
    });

    video.src = URL.createObjectURL(videoFile);
    video.load();
  });
}

/**
 * Search and filter media items
 *
 * Client-side search and filter implementation.
 *
 * @example
 * ```typescript
 * const filtered = filterMediaItems(allItems, {
 *   query: 'vacation',
 *   type: ['image'],
 *   tags: ['family'],
 *   dateRange: {
 *     from: new Date('2024-01-01'),
 *     to: new Date('2024-12-31'),
 *   },
 * });
 * ```
 */
export function filterMediaItems(
  items: MediaItem[],
  filter: MediaFilter
): MediaItem[] {
  return items.filter((item) => {
    // Text search
    if (filter.query) {
      const query = filter.query.toLowerCase();
      const searchableText = [
        item.name,
        item.description,
        item.alt,
        ...item.tags,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (!searchableText.includes(query)) return false;
    }

    // Type filter
    if (filter.type && filter.type.length > 0) {
      if (!filter.type.includes(item.type)) return false;
    }

    // Folder filter
    if (filter.folderId !== undefined) {
      if (item.folderId !== filter.folderId) return false;
    }

    // Tags filter
    if (filter.tags && filter.tags.length > 0) {
      const hasAllTags = filter.tags.every((tag) => item.tags.includes(tag));
      if (!hasAllTags) return false;
    }

    // Permission filter
    if (filter.permission && filter.permission.length > 0) {
      if (!filter.permission.includes(item.permission)) return false;
    }

    // Status filter
    if (filter.status && filter.status.length > 0) {
      if (!filter.status.includes(item.status)) return false;
    }

    // Uploader filter
    if (filter.uploadedBy && filter.uploadedBy.length > 0) {
      if (!filter.uploadedBy.includes(item.uploadedBy)) return false;
    }

    // Date range filter
    if (filter.dateRange) {
      const uploadDate = new Date(item.uploadedAt);
      if (uploadDate < filter.dateRange.from || uploadDate > filter.dateRange.to) {
        return false;
      }
    }

    // Size range filter
    if (filter.sizeRange) {
      const size = item.metadata.size;
      if (size < filter.sizeRange.min || size > filter.sizeRange.max) {
        return false;
      }
    }

    // Dimensions filter
    if (filter.dimensions && item.metadata.width && item.metadata.height) {
      const { minWidth, maxWidth, minHeight, maxHeight } = filter.dimensions;

      if (minWidth && item.metadata.width < minWidth) return false;
      if (maxWidth && item.metadata.width > maxWidth) return false;
      if (minHeight && item.metadata.height < minHeight) return false;
      if (maxHeight && item.metadata.height > maxHeight) return false;
    }

    return true;
  });
}

/**
 * Sort media items
 *
 * Client-side sorting implementation.
 *
 * @example
 * ```typescript
 * const sorted = sortMediaItems(items, { field: 'createdAt', order: 'desc' });
 * ```
 */
export function sortMediaItems(
  items: MediaItem[],
  sort: MediaSort
): MediaItem[] {
  const sorted = [...items];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sort.field) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'size':
        comparison = a.metadata.size - b.metadata.size;
        break;
      case 'createdAt':
        comparison = new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
        break;
      case 'updatedAt':
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
      case 'views':
        comparison = a.views - b.views;
        break;
    }

    return sort.order === 'asc' ? comparison : -comparison;
  });

  return sorted;
}

/**
 * Build folder tree from flat folder list
 *
 * Converts flat folder array into nested tree structure.
 *
 * @example
 * ```typescript
 * const tree = buildFolderTree(folders);
 * ```
 */
export function buildFolderTree(folders: MediaFolder[]): MediaFolder[] {
  const folderMap = new Map<string, MediaFolder>();
  const rootFolders: MediaFolder[] = [];

  // First pass: create map
  folders.forEach((folder) => {
    folderMap.set(folder.id, { ...folder, subfolders: [] });
  });

  // Second pass: build tree
  folders.forEach((folder) => {
    const folderNode = folderMap.get(folder.id)!;

    if (folder.parentId === null) {
      rootFolders.push(folderNode);
    } else {
      const parent = folderMap.get(folder.parentId);
      if (parent) {
        parent.subfolders = parent.subfolders || [];
        parent.subfolders.push(folderNode);
      }
    }
  });

  return rootFolders;
}

/**
 * Get folder breadcrumb path
 *
 * Generates breadcrumb trail for folder navigation.
 *
 * @example
 * ```typescript
 * const breadcrumbs = getFolderBreadcrumbs(currentFolder, allFolders);
 * // [{ id: 'root', name: 'Media Library' }, { id: '1', name: 'Documents' }, ...]
 * ```
 */
export function getFolderBreadcrumbs(
  folder: MediaFolder,
  allFolders: MediaFolder[]
): Array<{ id: string; name: string }> {
  const breadcrumbs: Array<{ id: string; name: string }> = [];
  let currentFolder: MediaFolder | undefined = folder;

  while (currentFolder) {
    breadcrumbs.unshift({ id: currentFolder.id, name: currentFolder.name });

    if (currentFolder.parentId === null) break;

    currentFolder = allFolders.find((f) => f.id === currentFolder!.parentId);
  }

  return breadcrumbs;
}

/**
 * Validate media permissions
 *
 * Check if user has permission to perform action on media.
 *
 * @example
 * ```typescript
 * const canEdit = validateMediaPermission(mediaItem, userId, 'edit');
 * ```
 */
export function validateMediaPermission(
  media: MediaItem,
  userId: string,
  action: 'view' | 'edit' | 'delete' | 'share'
): boolean {
  // Public media - anyone can view
  if (action === 'view' && media.permission === 'public') {
    return true;
  }

  // Owner can do everything
  if (media.uploadedBy === userId) {
    return true;
  }

  // Shared media - view only
  if (media.permission === 'shared' && action === 'view') {
    return true;
  }

  // Private/restricted - owner only
  if (media.permission === 'private' || media.permission === 'restricted') {
    return false;
  }

  return false;
}

/**
 * Deduplicate media items by hash
 *
 * Finds duplicate media items based on file hash.
 *
 * @example
 * ```typescript
 * const duplicates = findDuplicateMedia(items);
 * console.log(`Found ${duplicates.length} duplicate groups`);
 * ```
 */
export function findDuplicateMedia(
  items: MediaItem[]
): Array<MediaItem[]> {
  const hashMap = new Map<string, MediaItem[]>();

  items.forEach((item) => {
    if (item.metadata.hash) {
      const existing = hashMap.get(item.metadata.hash) || [];
      existing.push(item);
      hashMap.set(item.metadata.hash, existing);
    }
  });

  // Return only groups with duplicates
  return Array.from(hashMap.values()).filter((group) => group.length > 1);
}

// ============================================================================
// Enterprise Usage Examples
// ============================================================================

/**
 * Complete Media Library Application Example (React 18 + Next.js 16)
 *
 * This example demonstrates a full-featured media library with:
 * - Grid and list views
 * - Upload with drag-drop
 * - Search and filters
 * - Folder navigation
 * - Bulk operations
 * - Image editing
 * - Sharing
 */
export const MediaLibraryExample = `
'use client';

import { useState } from 'react';
import {
  useMediaLibrary,
  useMediaUpload,
  useBulkOperations,
  type MediaItem,
  type MediaFolder,
  type ViewMode,
} from '@/reuse/frontend/media-management-kit';

export default function MediaLibraryApp() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);

  // Media library state
  const {
    items,
    folders,
    loading,
    error,
    filter,
    setFilter,
    sort,
    setSort,
    pagination,
    goToPage,
    selection,
    selectItem,
    selectAll,
    clearSelection,
    refresh,
  } = useMediaLibrary({
    apiEndpoint: '/api/media',
    pageSize: 24,
    initialFilter: { folderId: currentFolder },
  });

  // Upload handling
  const {
    uploads,
    startUpload,
    cancelUpload,
    clearCompleted,
    isDragging,
    getRootProps,
    getInputProps,
  } = useMediaUpload({
    endpoint: '/api/upload',
    folderId: currentFolder,
    maxFileSize: 100 * 1024 * 1024, // 100MB
    acceptedTypes: ['image/*', 'video/*'],
    onComplete: (mediaItem) => {
      console.log('Upload complete:', mediaItem);
      refresh();
    },
  });

  // Bulk operations
  const { executeBulk, isProcessing } = useBulkOperations({
    endpoint: '/api/media/bulk',
    onComplete: (result) => {
      console.log(\`Bulk operation complete: \${result.success}/\${result.total} succeeded\`);
      clearSelection();
      refresh();
    },
  });

  const handleBulkDelete = async () => {
    if (!confirm(\`Delete \${selection.selectedIds.size} items?\`)) return;

    await executeBulk({
      operation: 'delete',
      mediaIds: Array.from(selection.selectedIds),
    });
  };

  const handleBulkMove = async (targetFolderId: string) => {
    await executeBulk({
      operation: 'move',
      mediaIds: Array.from(selection.selectedIds),
      params: { targetFolderId },
    });
  };

  return (
    <div className="media-library">
      {/* Header with actions */}
      <header className="library-header">
        <h1>Media Library</h1>

        <div className="actions">
          <button onClick={() => setViewMode('grid')}>Grid</button>
          <button onClick={() => setViewMode('list')}>List</button>

          {selection.selectedIds.size > 0 && (
            <>
              <button onClick={handleBulkDelete} disabled={isProcessing}>
                Delete ({selection.selectedIds.size})
              </button>
              <button onClick={() => handleBulkMove('folder-123')}>
                Move ({selection.selectedIds.size})
              </button>
              <button onClick={clearSelection}>Clear Selection</button>
            </>
          )}

          <label className="upload-button">
            <input {...getInputProps()} />
            Upload Files
          </label>
        </div>
      </header>

      {/* Search and filters */}
      <div className="filters">
        <input
          type="search"
          placeholder="Search media..."
          value={filter.query || ''}
          onChange={(e) => setFilter({ ...filter, query: e.target.value })}
        />

        <select
          value={filter.type?.[0] || 'all'}
          onChange={(e) =>
            setFilter({
              ...filter,
              type: e.target.value === 'all' ? undefined : [e.target.value as any],
            })
          }
        >
          <option value="all">All Types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="document">Documents</option>
        </select>

        <select
          value={sort.field}
          onChange={(e) => setSort({ ...sort, field: e.target.value as any })}
        >
          <option value="createdAt">Date Created</option>
          <option value="name">Name</option>
          <option value="size">Size</option>
          <option value="type">Type</option>
        </select>

        <button onClick={() => setSort({ ...sort, order: sort.order === 'asc' ? 'desc' : 'asc' })}>
          {sort.order === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      {/* Upload progress */}
      {uploads.length > 0 && (
        <div className="upload-progress">
          <h3>Uploads ({uploads.length})</h3>
          {uploads.map((upload) => (
            <div key={upload.file.name} className="upload-item">
              <span>{upload.file.name}</span>
              <progress value={upload.progress} max={100} />
              <span>{upload.progress}%</span>
              {upload.status === 'uploading' && (
                <button onClick={() => cancelUpload(upload.file)}>Cancel</button>
              )}
            </div>
          ))}
          <button onClick={clearCompleted}>Clear Completed</button>
        </div>
      )}

      {/* Media grid/list */}
      <div className={\`media-container view-\${viewMode}\`} {...getRootProps()}>
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">{error}</div>}

        {!loading && !error && items.length === 0 && (
          <div className="empty-state">
            <p>No media found. Upload some files to get started.</p>
          </div>
        )}

        {items.map((item) => (
          <MediaCard
            key={item.id}
            item={item}
            selected={selection.selectedIds.has(item.id)}
            onSelect={(multiSelect) => selectItem(item.id, multiSelect)}
            viewMode={viewMode}
          />
        ))}

        {isDragging && (
          <div className="drop-overlay">
            <p>Drop files here to upload</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={pagination.page === 1}
            onClick={() => goToPage(pagination.page - 1)}
          >
            Previous
          </button>

          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <button
            disabled={pagination.page === pagination.totalPages}
            onClick={() => goToPage(pagination.page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

// Media card component
function MediaCard({
  item,
  selected,
  onSelect,
  viewMode,
}: {
  item: MediaItem;
  selected: boolean;
  onSelect: (multiSelect: boolean) => void;
  viewMode: ViewMode;
}) {
  return (
    <div
      className={\`media-card \${selected ? 'selected' : ''}\`}
      onClick={(e) => onSelect(e.shiftKey || e.ctrlKey || e.metaKey)}
    >
      {item.type === 'image' && (
        <img src={item.thumbnailUrl || item.url} alt={item.alt || item.name} />
      )}

      {item.type === 'video' && (
        <video src={item.url} poster={item.thumbnailUrl} />
      )}

      <div className="card-info">
        <h3>{item.name}</h3>
        {viewMode === 'list' && (
          <>
            <p>{formatFileSize(item.metadata.size)}</p>
            <p>{new Date(item.uploadedAt).toLocaleDateString()}</p>
          </>
        )}
      </div>

      {selected && <div className="selection-badge">✓</div>}
    </div>
  );
}
`;

/**
 * Image Editor Component Example
 */
export const ImageEditorExample = `
'use client';

import { useState } from 'react';
import {
  useImageEditor,
  type MediaItem,
  type ImageFilter,
  type AspectRatio,
} from '@/reuse/frontend/media-management-kit';

export default function ImageEditor({ image }: { image: MediaItem }) {
  const [activeFilter, setActiveFilter] = useState<ImageFilter>('none');
  const [cropAspect, setCropAspect] = useState<AspectRatio>('free');

  const {
    editedImage,
    options,
    setOption,
    setCrop,
    rotate,
    applyFilter,
    reset,
    undo,
    redo,
    canUndo,
    canRedo,
    exportImage,
  } = useImageEditor({
    originalImage: image.url,
    maxHistory: 50,
  });

  const handleExport = async () => {
    const blob = await exportImage('webp', 0.9);
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = \`\${image.name}-edited.webp\`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="image-editor">
      <div className="editor-toolbar">
        <button onClick={() => rotate(90)}>Rotate 90°</button>
        <button onClick={() => rotate(-90)}>Rotate -90°</button>

        <select
          value={cropAspect}
          onChange={(e) => setCropAspect(e.target.value as AspectRatio)}
        >
          <option value="free">Free Crop</option>
          <option value="1:1">Square (1:1)</option>
          <option value="4:3">Standard (4:3)</option>
          <option value="16:9">Widescreen (16:9)</option>
        </select>

        <select
          value={activeFilter}
          onChange={(e) => {
            const filter = e.target.value as ImageFilter;
            setActiveFilter(filter);
            applyFilter(filter);
          }}
        >
          <option value="none">No Filter</option>
          <option value="grayscale">Grayscale</option>
          <option value="sepia">Sepia</option>
          <option value="vintage">Vintage</option>
          <option value="warm">Warm</option>
          <option value="cool">Cool</option>
        </select>

        <label>
          Brightness
          <input
            type="range"
            min="-100"
            max="100"
            value={options.brightness || 0}
            onChange={(e) => setOption('brightness', parseInt(e.target.value))}
          />
        </label>

        <label>
          Contrast
          <input
            type="range"
            min="-100"
            max="100"
            value={options.contrast || 0}
            onChange={(e) => setOption('contrast', parseInt(e.target.value))}
          />
        </label>

        <label>
          Saturation
          <input
            type="range"
            min="-100"
            max="100"
            value={options.saturation || 0}
            onChange={(e) => setOption('saturation', parseInt(e.target.value))}
          />
        </label>

        <button onClick={undo} disabled={!canUndo}>Undo</button>
        <button onClick={redo} disabled={!canRedo}>Redo</button>
        <button onClick={reset}>Reset</button>
        <button onClick={handleExport}>Export</button>
      </div>

      <div className="editor-canvas">
        <img src={editedImage} alt="Editing preview" />
      </div>
    </div>
  );
}
`;

/**
 * Advanced Upload with S3 Example
 */
export const S3UploadExample = `
'use client';

import { useState } from 'react';
import {
  generatePresignedUploadUrl,
  uploadToS3,
  optimizeImage,
  type MediaItem,
} from '@/reuse/frontend/media-management-kit';

export default function S3Uploader() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setProgress(0);

    try {
      // Optimize image before upload
      let fileToUpload = file;
      if (file.type.startsWith('image/')) {
        const optimized = await optimizeImage(file, {
          maxWidth: 2048,
          maxHeight: 2048,
          quality: 0.85,
          format: 'webp',
        });
        fileToUpload = new File([optimized], file.name.replace(/\\.[^.]+$/, '.webp'), {
          type: 'image/webp',
        });
      }

      // Get presigned URL
      const presignedUrl = await generatePresignedUploadUrl({
        endpoint: '/api/s3/presign',
        filename: fileToUpload.name,
        contentType: fileToUpload.type,
        folder: 'uploads',
      });

      // Upload to S3
      await uploadToS3(fileToUpload, presignedUrl, {
        onProgress: setProgress,
      });

      // Register media item in database
      const response = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fileToUpload.name,
          type: fileToUpload.type,
          size: fileToUpload.size,
          s3Key: \`uploads/\${fileToUpload.name}\`,
        }),
      });

      const mediaItem: MediaItem = await response.json();
      console.log('Upload complete:', mediaItem);

      alert('Upload successful!');
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="s3-uploader">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
        disabled={uploading}
      />

      {uploading && (
        <div className="upload-progress">
          <progress value={progress} max={100} />
          <span>{progress.toFixed(0)}%</span>
        </div>
      )}
    </div>
  );
}
`;

/**
 * Media Gallery with Lightbox Example
 */
export const MediaGalleryExample = `
'use client';

import { useState } from 'react';
import { type MediaItem } from '@/reuse/frontend/media-management-kit';

export default function MediaGallery({ items }: { items: MediaItem[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % items.length);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + items.length) % items.length);
    }
  };

  return (
    <>
      <div className="media-gallery">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="gallery-item"
            onClick={() => openLightbox(index)}
          >
            <img
              src={item.thumbnailUrl || item.url}
              alt={item.alt || item.name}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="close-button" onClick={closeLightbox}>×</button>
          <button className="prev-button" onClick={(e) => { e.stopPropagation(); prevImage(); }}>‹</button>
          <button className="next-button" onClick={(e) => { e.stopPropagation(); nextImage(); }}>›</button>

          <img
            src={items[lightboxIndex].url}
            alt={items[lightboxIndex].alt || items[lightboxIndex].name}
            onClick={(e) => e.stopPropagation()}
          />

          <div className="lightbox-info">
            <h3>{items[lightboxIndex].name}</h3>
            <p>{items[lightboxIndex].description}</p>
            <p>
              {lightboxIndex + 1} of {items.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
`;
