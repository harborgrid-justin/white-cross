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
export type ImageFilter = 'none' | 'grayscale' | 'sepia' | 'vintage' | 'warm' | 'cool' | 'bright' | 'contrast' | 'saturate';
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
export type BulkOperation = 'delete' | 'move' | 'copy' | 'tag' | 'untag' | 'changePermission' | 'archive' | 'optimize';
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
export declare function useMediaLibrary(config: {
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
}): {
    items: any;
    folders: any;
    loading: any;
    error: any;
    filter: any;
    setFilter: any;
    sort: any;
    setSort: any;
    pagination: any;
    goToPage: any;
    selection: any;
    selectItem: any;
    selectAll: any;
    clearSelection: any;
    refresh: any;
};
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
export declare function useMediaUpload(config: {
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
}): {
    uploads: any;
    startUpload: any;
    pauseUpload: any;
    resumeUpload: any;
    cancelUpload: any;
    clearCompleted: any;
    isDragging: any;
    getRootProps: any;
    getInputProps: any;
};
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
export declare function useImageEditor(config: {
    /** Original image URL */
    originalImage: string;
    /** Max undo history */
    maxHistory?: number;
}): {
    editedImage: any;
    options: any;
    setOption: any;
    setCrop: any;
    rotate: any;
    applyFilter: any;
    reset: any;
    undo: any;
    redo: any;
    canUndo: boolean;
    canRedo: boolean;
    exportImage: any;
};
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
export declare function useBulkOperations(config: {
    /** Bulk operations endpoint */
    endpoint: string;
    /** Callback on completion */
    onComplete?: (result: BulkOperationResult) => void;
    /** Callback on error */
    onError?: (error: string) => void;
}): {
    executeBulk: any;
    isProcessing: any;
    progress: any;
    result: any;
};
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
export declare function formatFileSize(bytes: number, decimals?: number): string;
/**
 * Format duration in human-readable format
 *
 * @example
 * ```typescript
 * formatDuration(65) // "1:05"
 * formatDuration(3665) // "1:01:05"
 * ```
 */
export declare function formatDuration(seconds: number): string;
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
export declare function getMediaType(mimeType: string): MediaType;
/**
 * Generate thumbnail URL with size parameters
 *
 * @example
 * ```typescript
 * generateThumbnailUrl('https://cdn.example.com/image.jpg', 200, 200)
 * // "https://cdn.example.com/image.jpg?w=200&h=200"
 * ```
 */
export declare function generateThumbnailUrl(url: string, width: number, height?: number, quality?: number): string;
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
export declare function extractColorPalette(imageUrl: string, colorCount?: number): Promise<string[]>;
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
export declare function optimizeImage(file: File, options?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
}): Promise<Blob>;
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
export declare function generatePresignedUploadUrl(config: {
    /** API endpoint to get presigned URL */
    endpoint: string;
    /** Filename */
    filename: string;
    /** Content type */
    contentType: string;
    /** Folder path */
    folder?: string;
}): Promise<string>;
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
export declare function uploadToS3(file: File, presignedUrl: string, options?: {
    onProgress?: (progress: number) => void;
    signal?: AbortSignal;
}): Promise<void>;
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
export declare function generateCDNUrl(filename: string, config: {
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
}): string;
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
export declare function createShareLink(config: {
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
}): Promise<MediaShare>;
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
export declare function generateEmbedCode(media: MediaItem, options?: MediaEmbedOptions): string;
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
export declare function batchProcessMedia<T, R>(items: T[], processor: (item: T, index: number) => Promise<R>, options?: {
    concurrency?: number;
    onProgress?: (completed: number, total: number) => void;
    onError?: (error: Error, item: T, index: number) => void;
}): Promise<R[]>;
/**
 * Calculate optimal image dimensions maintaining aspect ratio
 *
 * @example
 * ```typescript
 * const dims = calculateImageDimensions(1920, 1080, 800);
 * console.log(dims); // { width: 800, height: 450 }
 * ```
 */
export declare function calculateImageDimensions(originalWidth: number, originalHeight: number, maxWidth?: number, maxHeight?: number): {
    width: number;
    height: number;
};
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
export declare function generateVideoThumbnail(videoFile: File, options?: {
    time?: number;
    width?: number;
    height?: number;
    quality?: number;
}): Promise<Blob>;
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
export declare function filterMediaItems(items: MediaItem[], filter: MediaFilter): MediaItem[];
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
export declare function sortMediaItems(items: MediaItem[], sort: MediaSort): MediaItem[];
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
export declare function buildFolderTree(folders: MediaFolder[]): MediaFolder[];
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
export declare function getFolderBreadcrumbs(folder: MediaFolder, allFolders: MediaFolder[]): Array<{
    id: string;
    name: string;
}>;
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
export declare function validateMediaPermission(media: MediaItem, userId: string, action: 'view' | 'edit' | 'delete' | 'share'): boolean;
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
export declare function findDuplicateMedia(items: MediaItem[]): Array<MediaItem[]>;
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
export declare const MediaLibraryExample = "\n'use client';\n\nimport { useState } from 'react';\nimport {\n  useMediaLibrary,\n  useMediaUpload,\n  useBulkOperations,\n  type MediaItem,\n  type MediaFolder,\n  type ViewMode,\n} from '@/reuse/frontend/media-management-kit';\n\nexport default function MediaLibraryApp() {\n  const [viewMode, setViewMode] = useState<ViewMode>('grid');\n  const [currentFolder, setCurrentFolder] = useState<string | null>(null);\n\n  // Media library state\n  const {\n    items,\n    folders,\n    loading,\n    error,\n    filter,\n    setFilter,\n    sort,\n    setSort,\n    pagination,\n    goToPage,\n    selection,\n    selectItem,\n    selectAll,\n    clearSelection,\n    refresh,\n  } = useMediaLibrary({\n    apiEndpoint: '/api/media',\n    pageSize: 24,\n    initialFilter: { folderId: currentFolder },\n  });\n\n  // Upload handling\n  const {\n    uploads,\n    startUpload,\n    cancelUpload,\n    clearCompleted,\n    isDragging,\n    getRootProps,\n    getInputProps,\n  } = useMediaUpload({\n    endpoint: '/api/upload',\n    folderId: currentFolder,\n    maxFileSize: 100 * 1024 * 1024, // 100MB\n    acceptedTypes: ['image/*', 'video/*'],\n    onComplete: (mediaItem) => {\n      console.log('Upload complete:', mediaItem);\n      refresh();\n    },\n  });\n\n  // Bulk operations\n  const { executeBulk, isProcessing } = useBulkOperations({\n    endpoint: '/api/media/bulk',\n    onComplete: (result) => {\n      console.log(`Bulk operation complete: ${result.success}/${result.total} succeeded`);\n      clearSelection();\n      refresh();\n    },\n  });\n\n  const handleBulkDelete = async () => {\n    if (!confirm(`Delete ${selection.selectedIds.size} items?`)) return;\n\n    await executeBulk({\n      operation: 'delete',\n      mediaIds: Array.from(selection.selectedIds),\n    });\n  };\n\n  const handleBulkMove = async (targetFolderId: string) => {\n    await executeBulk({\n      operation: 'move',\n      mediaIds: Array.from(selection.selectedIds),\n      params: { targetFolderId },\n    });\n  };\n\n  return (\n    <div className=\"media-library\">\n      {/* Header with actions */}\n      <header className=\"library-header\">\n        <h1>Media Library</h1>\n\n        <div className=\"actions\">\n          <button onClick={() => setViewMode('grid')}>Grid</button>\n          <button onClick={() => setViewMode('list')}>List</button>\n\n          {selection.selectedIds.size > 0 && (\n            <>\n              <button onClick={handleBulkDelete} disabled={isProcessing}>\n                Delete ({selection.selectedIds.size})\n              </button>\n              <button onClick={() => handleBulkMove('folder-123')}>\n                Move ({selection.selectedIds.size})\n              </button>\n              <button onClick={clearSelection}>Clear Selection</button>\n            </>\n          )}\n\n          <label className=\"upload-button\">\n            <input {...getInputProps()} />\n            Upload Files\n          </label>\n        </div>\n      </header>\n\n      {/* Search and filters */}\n      <div className=\"filters\">\n        <input\n          type=\"search\"\n          placeholder=\"Search media...\"\n          value={filter.query || ''}\n          onChange={(e) => setFilter({ ...filter, query: e.target.value })}\n        />\n\n        <select\n          value={filter.type?.[0] || 'all'}\n          onChange={(e) =>\n            setFilter({\n              ...filter,\n              type: e.target.value === 'all' ? undefined : [e.target.value as any],\n            })\n          }\n        >\n          <option value=\"all\">All Types</option>\n          <option value=\"image\">Images</option>\n          <option value=\"video\">Videos</option>\n          <option value=\"document\">Documents</option>\n        </select>\n\n        <select\n          value={sort.field}\n          onChange={(e) => setSort({ ...sort, field: e.target.value as any })}\n        >\n          <option value=\"createdAt\">Date Created</option>\n          <option value=\"name\">Name</option>\n          <option value=\"size\">Size</option>\n          <option value=\"type\">Type</option>\n        </select>\n\n        <button onClick={() => setSort({ ...sort, order: sort.order === 'asc' ? 'desc' : 'asc' })}>\n          {sort.order === 'asc' ? '\u2191' : '\u2193'}\n        </button>\n      </div>\n\n      {/* Upload progress */}\n      {uploads.length > 0 && (\n        <div className=\"upload-progress\">\n          <h3>Uploads ({uploads.length})</h3>\n          {uploads.map((upload) => (\n            <div key={upload.file.name} className=\"upload-item\">\n              <span>{upload.file.name}</span>\n              <progress value={upload.progress} max={100} />\n              <span>{upload.progress}%</span>\n              {upload.status === 'uploading' && (\n                <button onClick={() => cancelUpload(upload.file)}>Cancel</button>\n              )}\n            </div>\n          ))}\n          <button onClick={clearCompleted}>Clear Completed</button>\n        </div>\n      )}\n\n      {/* Media grid/list */}\n      <div className={`media-container view-${viewMode}`} {...getRootProps()}>\n        {loading && <div className=\"loading\">Loading...</div>}\n        {error && <div className=\"error\">{error}</div>}\n\n        {!loading && !error && items.length === 0 && (\n          <div className=\"empty-state\">\n            <p>No media found. Upload some files to get started.</p>\n          </div>\n        )}\n\n        {items.map((item) => (\n          <MediaCard\n            key={item.id}\n            item={item}\n            selected={selection.selectedIds.has(item.id)}\n            onSelect={(multiSelect) => selectItem(item.id, multiSelect)}\n            viewMode={viewMode}\n          />\n        ))}\n\n        {isDragging && (\n          <div className=\"drop-overlay\">\n            <p>Drop files here to upload</p>\n          </div>\n        )}\n      </div>\n\n      {/* Pagination */}\n      {pagination.totalPages > 1 && (\n        <div className=\"pagination\">\n          <button\n            disabled={pagination.page === 1}\n            onClick={() => goToPage(pagination.page - 1)}\n          >\n            Previous\n          </button>\n\n          <span>\n            Page {pagination.page} of {pagination.totalPages}\n          </span>\n\n          <button\n            disabled={pagination.page === pagination.totalPages}\n            onClick={() => goToPage(pagination.page + 1)}\n          >\n            Next\n          </button>\n        </div>\n      )}\n    </div>\n  );\n}\n\n// Media card component\nfunction MediaCard({\n  item,\n  selected,\n  onSelect,\n  viewMode,\n}: {\n  item: MediaItem;\n  selected: boolean;\n  onSelect: (multiSelect: boolean) => void;\n  viewMode: ViewMode;\n}) {\n  return (\n    <div\n      className={`media-card ${selected ? 'selected' : ''}`}\n      onClick={(e) => onSelect(e.shiftKey || e.ctrlKey || e.metaKey)}\n    >\n      {item.type === 'image' && (\n        <img src={item.thumbnailUrl || item.url} alt={item.alt || item.name} />\n      )}\n\n      {item.type === 'video' && (\n        <video src={item.url} poster={item.thumbnailUrl} />\n      )}\n\n      <div className=\"card-info\">\n        <h3>{item.name}</h3>\n        {viewMode === 'list' && (\n          <>\n            <p>{formatFileSize(item.metadata.size)}</p>\n            <p>{new Date(item.uploadedAt).toLocaleDateString()}</p>\n          </>\n        )}\n      </div>\n\n      {selected && <div className=\"selection-badge\">\u2713</div>}\n    </div>\n  );\n}\n";
/**
 * Image Editor Component Example
 */
export declare const ImageEditorExample = "\n'use client';\n\nimport { useState } from 'react';\nimport {\n  useImageEditor,\n  type MediaItem,\n  type ImageFilter,\n  type AspectRatio,\n} from '@/reuse/frontend/media-management-kit';\n\nexport default function ImageEditor({ image }: { image: MediaItem }) {\n  const [activeFilter, setActiveFilter] = useState<ImageFilter>('none');\n  const [cropAspect, setCropAspect] = useState<AspectRatio>('free');\n\n  const {\n    editedImage,\n    options,\n    setOption,\n    setCrop,\n    rotate,\n    applyFilter,\n    reset,\n    undo,\n    redo,\n    canUndo,\n    canRedo,\n    exportImage,\n  } = useImageEditor({\n    originalImage: image.url,\n    maxHistory: 50,\n  });\n\n  const handleExport = async () => {\n    const blob = await exportImage('webp', 0.9);\n    const url = URL.createObjectURL(blob);\n\n    const a = document.createElement('a');\n    a.href = url;\n    a.download = `${image.name}-edited.webp`;\n    a.click();\n\n    URL.revokeObjectURL(url);\n  };\n\n  return (\n    <div className=\"image-editor\">\n      <div className=\"editor-toolbar\">\n        <button onClick={() => rotate(90)}>Rotate 90\u00B0</button>\n        <button onClick={() => rotate(-90)}>Rotate -90\u00B0</button>\n\n        <select\n          value={cropAspect}\n          onChange={(e) => setCropAspect(e.target.value as AspectRatio)}\n        >\n          <option value=\"free\">Free Crop</option>\n          <option value=\"1:1\">Square (1:1)</option>\n          <option value=\"4:3\">Standard (4:3)</option>\n          <option value=\"16:9\">Widescreen (16:9)</option>\n        </select>\n\n        <select\n          value={activeFilter}\n          onChange={(e) => {\n            const filter = e.target.value as ImageFilter;\n            setActiveFilter(filter);\n            applyFilter(filter);\n          }}\n        >\n          <option value=\"none\">No Filter</option>\n          <option value=\"grayscale\">Grayscale</option>\n          <option value=\"sepia\">Sepia</option>\n          <option value=\"vintage\">Vintage</option>\n          <option value=\"warm\">Warm</option>\n          <option value=\"cool\">Cool</option>\n        </select>\n\n        <label>\n          Brightness\n          <input\n            type=\"range\"\n            min=\"-100\"\n            max=\"100\"\n            value={options.brightness || 0}\n            onChange={(e) => setOption('brightness', parseInt(e.target.value))}\n          />\n        </label>\n\n        <label>\n          Contrast\n          <input\n            type=\"range\"\n            min=\"-100\"\n            max=\"100\"\n            value={options.contrast || 0}\n            onChange={(e) => setOption('contrast', parseInt(e.target.value))}\n          />\n        </label>\n\n        <label>\n          Saturation\n          <input\n            type=\"range\"\n            min=\"-100\"\n            max=\"100\"\n            value={options.saturation || 0}\n            onChange={(e) => setOption('saturation', parseInt(e.target.value))}\n          />\n        </label>\n\n        <button onClick={undo} disabled={!canUndo}>Undo</button>\n        <button onClick={redo} disabled={!canRedo}>Redo</button>\n        <button onClick={reset}>Reset</button>\n        <button onClick={handleExport}>Export</button>\n      </div>\n\n      <div className=\"editor-canvas\">\n        <img src={editedImage} alt=\"Editing preview\" />\n      </div>\n    </div>\n  );\n}\n";
/**
 * Advanced Upload with S3 Example
 */
export declare const S3UploadExample = "\n'use client';\n\nimport { useState } from 'react';\nimport {\n  generatePresignedUploadUrl,\n  uploadToS3,\n  optimizeImage,\n  type MediaItem,\n} from '@/reuse/frontend/media-management-kit';\n\nexport default function S3Uploader() {\n  const [uploading, setUploading] = useState(false);\n  const [progress, setProgress] = useState(0);\n\n  const handleUpload = async (file: File) => {\n    setUploading(true);\n    setProgress(0);\n\n    try {\n      // Optimize image before upload\n      let fileToUpload = file;\n      if (file.type.startsWith('image/')) {\n        const optimized = await optimizeImage(file, {\n          maxWidth: 2048,\n          maxHeight: 2048,\n          quality: 0.85,\n          format: 'webp',\n        });\n        fileToUpload = new File([optimized], file.name.replace(/\\.[^.]+$/, '.webp'), {\n          type: 'image/webp',\n        });\n      }\n\n      // Get presigned URL\n      const presignedUrl = await generatePresignedUploadUrl({\n        endpoint: '/api/s3/presign',\n        filename: fileToUpload.name,\n        contentType: fileToUpload.type,\n        folder: 'uploads',\n      });\n\n      // Upload to S3\n      await uploadToS3(fileToUpload, presignedUrl, {\n        onProgress: setProgress,\n      });\n\n      // Register media item in database\n      const response = await fetch('/api/media', {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify({\n          name: fileToUpload.name,\n          type: fileToUpload.type,\n          size: fileToUpload.size,\n          s3Key: `uploads/${fileToUpload.name}`,\n        }),\n      });\n\n      const mediaItem: MediaItem = await response.json();\n      console.log('Upload complete:', mediaItem);\n\n      alert('Upload successful!');\n    } catch (err) {\n      console.error('Upload failed:', err);\n      alert('Upload failed. Please try again.');\n    } finally {\n      setUploading(false);\n      setProgress(0);\n    }\n  };\n\n  return (\n    <div className=\"s3-uploader\">\n      <input\n        type=\"file\"\n        accept=\"image/*\"\n        onChange={(e) => {\n          const file = e.target.files?.[0];\n          if (file) handleUpload(file);\n        }}\n        disabled={uploading}\n      />\n\n      {uploading && (\n        <div className=\"upload-progress\">\n          <progress value={progress} max={100} />\n          <span>{progress.toFixed(0)}%</span>\n        </div>\n      )}\n    </div>\n  );\n}\n";
/**
 * Media Gallery with Lightbox Example
 */
export declare const MediaGalleryExample = "\n'use client';\n\nimport { useState } from 'react';\nimport { type MediaItem } from '@/reuse/frontend/media-management-kit';\n\nexport default function MediaGallery({ items }: { items: MediaItem[] }) {\n  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);\n\n  const openLightbox = (index: number) => setLightboxIndex(index);\n  const closeLightbox = () => setLightboxIndex(null);\n\n  const nextImage = () => {\n    if (lightboxIndex !== null) {\n      setLightboxIndex((lightboxIndex + 1) % items.length);\n    }\n  };\n\n  const prevImage = () => {\n    if (lightboxIndex !== null) {\n      setLightboxIndex((lightboxIndex - 1 + items.length) % items.length);\n    }\n  };\n\n  return (\n    <>\n      <div className=\"media-gallery\">\n        {items.map((item, index) => (\n          <div\n            key={item.id}\n            className=\"gallery-item\"\n            onClick={() => openLightbox(index)}\n          >\n            <img\n              src={item.thumbnailUrl || item.url}\n              alt={item.alt || item.name}\n              loading=\"lazy\"\n            />\n          </div>\n        ))}\n      </div>\n\n      {lightboxIndex !== null && (\n        <div className=\"lightbox\" onClick={closeLightbox}>\n          <button className=\"close-button\" onClick={closeLightbox}>\u00D7</button>\n          <button className=\"prev-button\" onClick={(e) => { e.stopPropagation(); prevImage(); }}>\u2039</button>\n          <button className=\"next-button\" onClick={(e) => { e.stopPropagation(); nextImage(); }}>\u203A</button>\n\n          <img\n            src={items[lightboxIndex].url}\n            alt={items[lightboxIndex].alt || items[lightboxIndex].name}\n            onClick={(e) => e.stopPropagation()}\n          />\n\n          <div className=\"lightbox-info\">\n            <h3>{items[lightboxIndex].name}</h3>\n            <p>{items[lightboxIndex].description}</p>\n            <p>\n              {lightboxIndex + 1} of {items.length}\n            </p>\n          </div>\n        </div>\n      )}\n    </>\n  );\n}\n";
//# sourceMappingURL=media-management-kit.d.ts.map