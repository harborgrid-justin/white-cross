/**
 * LOC: DOC-RENDER-001
 * File: /reuse/document/document-rendering-kit.ts
 *
 * UPSTREAM (imports from):
 *   - pdf-lib / pdfjs-dist
 *   - sharp
 *   - canvas / node-canvas
 *   - sequelize (v6.x)
 *   - redis / ioredis
 *   - streaming libraries
 *
 * DOWNSTREAM (imported by):
 *   - Document viewer controllers
 *   - PDF rendering services
 *   - Preview generation workers
 *   - Document management modules
 */
/**
 * File: /reuse/document/document-rendering-kit.ts
 * Locator: WC-UTL-DOCRENDER-001
 * Purpose: Document Rendering & PDF Preview Kit - Comprehensive document rendering utilities
 *
 * Upstream: pdf-lib, pdfjs-dist, sharp, sequelize, redis, canvas
 * Downstream: Document viewers, PDF services, preview generators, document management
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, Sharp 0.33.x, Redis 4.x
 * Exports: 42 utility functions for PDF rendering, thumbnail generation, preview quality, page rendering, zoom, lazy loading
 *
 * LLM Context: Production-grade document rendering utilities for White Cross healthcare platform.
 * Provides PDF to image conversion, multi-resolution thumbnail generation, quality settings,
 * page-by-page rendering, zoom level management, lazy loading strategies, streaming rendering,
 * intelligent caching, and HIPAA-compliant preview access control. Essential for secure medical
 * document viewing and sharing in healthcare applications.
 *
 * DATABASE SCHEMA DESIGN:
 *
 * Table: rendered_documents
 *   - id (UUID, PK)
 *   - document_id (UUID, FK -> documents.id, indexed)
 *   - page_number (INTEGER, indexed)
 *   - width (INTEGER)
 *   - height (INTEGER)
 *   - quality_level (ENUM: low, medium, high, original)
 *   - format (ENUM: png, jpeg, webp)
 *   - storage_path (VARCHAR(500))
 *   - storage_key (VARCHAR(500))
 *   - file_size (BIGINT)
 *   - render_duration_ms (INTEGER)
 *   - cache_key (VARCHAR(255), unique, indexed)
 *   - cache_ttl (INTEGER)
 *   - created_at (TIMESTAMP)
 *   - expires_at (TIMESTAMP, indexed)
 *
 * Table: document_thumbnails
 *   - id (UUID, PK)
 *   - document_id (UUID, FK -> documents.id, indexed)
 *   - page_number (INTEGER, indexed)
 *   - size (ENUM: small, medium, large, xlarge)
 *   - width (INTEGER)
 *   - height (INTEGER)
 *   - format (ENUM: png, jpeg, webp)
 *   - storage_path (VARCHAR(500))
 *   - storage_key (VARCHAR(500))
 *   - file_size (BIGINT)
 *   - created_at (TIMESTAMP)
 *
 * Table: render_jobs
 *   - id (UUID, PK)
 *   - document_id (UUID, FK -> documents.id, indexed)
 *   - job_type (ENUM: full_render, page_render, thumbnail_generation)
 *   - status (ENUM: pending, processing, completed, failed, indexed)
 *   - priority (INTEGER, indexed)
 *   - pages_total (INTEGER)
 *   - pages_completed (INTEGER)
 *   - started_at (TIMESTAMP)
 *   - completed_at (TIMESTAMP)
 *   - error_message (TEXT)
 *   - metadata (JSONB)
 *   - created_at (TIMESTAMP)
 *
 * INDEXING STRATEGY:
 *   - Composite index: (document_id, page_number, quality_level) for fast page lookup
 *   - Composite index: (cache_key) for cache validation
 *   - Composite index: (document_id, page_number) for thumbnail retrieval
 *   - Index on expires_at for efficient cleanup queries
 *   - Index on status + priority for job queue processing
 *   - GIN index on metadata JSONB for flexible querying
 *
 * PERFORMANCE OPTIMIZATION:
 *   - Redis caching for rendered pages (TTL: 1-24 hours based on access frequency)
 *   - Lazy rendering: render on-demand, cache aggressively
 *   - Progressive rendering: low quality first, then high quality
 *   - Background job processing for bulk rendering
 *   - CDN integration for static rendered images
 *   - Partition rendered_documents by created_at (monthly) for large datasets
 */
import { Sequelize } from 'sequelize';
import { Readable, Transform } from 'stream';
/**
 * PDF rendering configuration
 */
export interface PDFRenderConfig {
    dpi?: number;
    scale?: number;
    quality?: number;
    format?: 'png' | 'jpeg' | 'webp';
    background?: string;
    preserveAspectRatio?: boolean;
}
/**
 * Rendered page result
 */
export interface RenderedPage {
    pageNumber: number;
    width: number;
    height: number;
    format: string;
    buffer: Buffer;
    renderTime: number;
}
/**
 * Thumbnail size configuration
 */
export interface ThumbnailSize {
    name: 'small' | 'medium' | 'large' | 'xlarge';
    width: number;
    height: number;
    quality?: number;
}
/**
 * Preview quality level
 */
export type PreviewQuality = 'low' | 'medium' | 'high' | 'original';
/**
 * Quality settings mapping
 */
export interface QualitySettings {
    dpi: number;
    scale: number;
    quality: number;
    format: 'png' | 'jpeg' | 'webp';
}
/**
 * Zoom level configuration
 */
export interface ZoomLevel {
    level: number;
    scale: number;
    label: string;
    dpi?: number;
}
/**
 * Page rendering options
 */
export interface PageRenderOptions {
    pageNumber: number;
    width?: number;
    height?: number;
    quality?: PreviewQuality;
    format?: 'png' | 'jpeg' | 'webp';
    crop?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    rotation?: 0 | 90 | 180 | 270;
}
/**
 * Lazy loading configuration
 */
export interface LazyLoadConfig {
    initialPages: number;
    batchSize: number;
    preloadAhead: number;
    preloadBehind: number;
    cacheSize: number;
}
/**
 * Streaming render options
 */
export interface StreamRenderOptions {
    chunkSize?: number;
    progressive?: boolean;
    startPage?: number;
    endPage?: number;
}
/**
 * Cache configuration
 */
export interface CacheConfig {
    ttl: number;
    keyPrefix: string;
    strategy: 'lru' | 'lfu' | 'fifo';
    maxSize?: number;
}
/**
 * Render job status
 */
export interface RenderJob {
    id: string;
    documentId: string;
    jobType: 'full_render' | 'page_render' | 'thumbnail_generation';
    status: 'pending' | 'processing' | 'completed' | 'failed';
    priority: number;
    pagesTotal?: number;
    pagesCompleted?: number;
    startedAt?: Date;
    completedAt?: Date;
    errorMessage?: string;
    metadata?: Record<string, any>;
}
/**
 * Document metadata for rendering
 */
export interface DocumentRenderMetadata {
    documentId: string;
    pageCount: number;
    pageWidth: number;
    pageHeight: number;
    orientation: 'portrait' | 'landscape';
    fileSize: number;
    mimeType: string;
}
/**
 * Progressive rendering state
 */
export interface ProgressiveRenderState {
    documentId: string;
    pageNumber: number;
    currentQuality: PreviewQuality;
    targetQuality: PreviewQuality;
    progress: number;
}
/**
 * Rendered document page attributes
 */
export interface RenderedDocumentAttributes {
    id: string;
    documentId: string;
    pageNumber: number;
    width: number;
    height: number;
    qualityLevel: PreviewQuality;
    format: 'png' | 'jpeg' | 'webp';
    storagePath: string;
    storageKey?: string;
    fileSize: number;
    renderDurationMs: number;
    cacheKey: string;
    cacheTtl: number;
    createdAt: Date;
    expiresAt?: Date;
}
/**
 * Document thumbnail attributes
 */
export interface DocumentThumbnailAttributes {
    id: string;
    documentId: string;
    pageNumber: number;
    size: 'small' | 'medium' | 'large' | 'xlarge';
    width: number;
    height: number;
    format: 'png' | 'jpeg' | 'webp';
    storagePath: string;
    storageKey?: string;
    fileSize: number;
    createdAt: Date;
}
/**
 * Render job attributes
 */
export interface RenderJobAttributes {
    id: string;
    documentId: string;
    jobType: 'full_render' | 'page_render' | 'thumbnail_generation';
    status: 'pending' | 'processing' | 'completed' | 'failed';
    priority: number;
    pagesTotal?: number;
    pagesCompleted?: number;
    startedAt?: Date;
    completedAt?: Date;
    errorMessage?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
}
/**
 * Creates RenderedDocument model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<RenderedDocumentAttributes>>} RenderedDocument model
 *
 * @example
 * ```typescript
 * const RenderedDocModel = createRenderedDocumentModel(sequelize);
 * const rendered = await RenderedDocModel.create({
 *   documentId: 'doc-uuid',
 *   pageNumber: 1,
 *   width: 1920,
 *   height: 2560,
 *   qualityLevel: 'high',
 *   format: 'webp',
 *   storagePath: '/renders/doc-uuid/page-1-high.webp',
 *   fileSize: 245000,
 *   renderDurationMs: 1200,
 *   cacheKey: 'render:doc-uuid:1:high',
 *   cacheTtl: 3600
 * });
 * ```
 */
export declare const createRenderedDocumentModel: (sequelize: Sequelize) => any;
/**
 * Creates DocumentThumbnail model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<DocumentThumbnailAttributes>>} DocumentThumbnail model
 *
 * @example
 * ```typescript
 * const ThumbnailModel = createDocumentThumbnailModel(sequelize);
 * const thumbnail = await ThumbnailModel.create({
 *   documentId: 'doc-uuid',
 *   pageNumber: 1,
 *   size: 'medium',
 *   width: 300,
 *   height: 400,
 *   format: 'jpeg',
 *   storagePath: '/thumbs/doc-uuid/page-1-medium.jpg',
 *   fileSize: 45000
 * });
 * ```
 */
export declare const createDocumentThumbnailModel: (sequelize: Sequelize) => any;
/**
 * Creates RenderJob model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<RenderJobAttributes>>} RenderJob model
 *
 * @example
 * ```typescript
 * const JobModel = createRenderJobModel(sequelize);
 * const job = await JobModel.create({
 *   documentId: 'doc-uuid',
 *   jobType: 'full_render',
 *   status: 'pending',
 *   priority: 5,
 *   pagesTotal: 50
 * });
 * ```
 */
export declare const createRenderJobModel: (sequelize: Sequelize) => any;
/**
 * 1. Renders PDF document to image buffer.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {PDFRenderConfig} config - Rendering configuration
 * @returns {Promise<Buffer>} Rendered image buffer
 *
 * @example
 * ```typescript
 * const image = await renderPDFToImage(pdfBuffer, {
 *   dpi: 150,
 *   scale: 1.5,
 *   quality: 85,
 *   format: 'webp',
 *   background: '#ffffff'
 * });
 * ```
 */
export declare const renderPDFToImage: (pdfBuffer: Buffer, config: PDFRenderConfig) => Promise<Buffer>;
/**
 * 2. Renders specific page of PDF to image.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {number} pageNumber - Page number (1-indexed)
 * @param {PDFRenderConfig} config - Rendering configuration
 * @returns {Promise<RenderedPage>} Rendered page with metadata
 *
 * @example
 * ```typescript
 * const page = await renderPDFPage(pdfBuffer, 3, {
 *   dpi: 200,
 *   format: 'png',
 *   quality: 90
 * });
 * console.log(`Page ${page.pageNumber}: ${page.width}x${page.height}`);
 * ```
 */
export declare const renderPDFPage: (pdfBuffer: Buffer, pageNumber: number, config: PDFRenderConfig) => Promise<RenderedPage>;
/**
 * 3. Renders all pages of PDF document.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {PDFRenderConfig} config - Rendering configuration
 * @returns {Promise<RenderedPage[]>} Array of rendered pages
 *
 * @example
 * ```typescript
 * const pages = await renderAllPDFPages(pdfBuffer, {
 *   dpi: 150,
 *   format: 'webp',
 *   quality: 80
 * });
 * console.log(`Rendered ${pages.length} pages`);
 * ```
 */
export declare const renderAllPDFPages: (pdfBuffer: Buffer, config: PDFRenderConfig) => Promise<RenderedPage[]>;
/**
 * 4. Renders PDF page range.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {number} startPage - Start page number (1-indexed)
 * @param {number} endPage - End page number (inclusive)
 * @param {PDFRenderConfig} config - Rendering configuration
 * @returns {Promise<RenderedPage[]>} Array of rendered pages
 *
 * @example
 * ```typescript
 * const pages = await renderPDFPageRange(pdfBuffer, 5, 10, {
 *   dpi: 150,
 *   format: 'jpeg',
 *   quality: 85
 * });
 * ```
 */
export declare const renderPDFPageRange: (pdfBuffer: Buffer, startPage: number, endPage: number, config: PDFRenderConfig) => Promise<RenderedPage[]>;
/**
 * 5. Gets PDF document page count.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<number>} Number of pages
 *
 * @example
 * ```typescript
 * const pageCount = await getPDFPageCount(pdfBuffer);
 * console.log(`Document has ${pageCount} pages`);
 * ```
 */
export declare const getPDFPageCount: (pdfBuffer: Buffer) => Promise<number>;
/**
 * 6. Extracts PDF metadata for rendering.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<DocumentRenderMetadata>} Document metadata
 *
 * @example
 * ```typescript
 * const metadata = await extractPDFRenderMetadata(pdfBuffer);
 * console.log(`${metadata.pageCount} pages, ${metadata.orientation}`);
 * ```
 */
export declare const extractPDFRenderMetadata: (pdfBuffer: Buffer) => Promise<DocumentRenderMetadata>;
/**
 * 7. Generates thumbnail for PDF page.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {number} pageNumber - Page number (1-indexed)
 * @param {ThumbnailSize} size - Thumbnail size configuration
 * @returns {Promise<Buffer>} Thumbnail image buffer
 *
 * @example
 * ```typescript
 * const thumbnail = await generatePDFThumbnail(pdfBuffer, 1, {
 *   name: 'medium',
 *   width: 300,
 *   height: 400,
 *   quality: 80
 * });
 * ```
 */
export declare const generatePDFThumbnail: (pdfBuffer: Buffer, pageNumber: number, size: ThumbnailSize) => Promise<Buffer>;
/**
 * 8. Generates thumbnails for all pages.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {ThumbnailSize} size - Thumbnail size configuration
 * @returns {Promise<Buffer[]>} Array of thumbnail buffers
 *
 * @example
 * ```typescript
 * const thumbnails = await generateAllThumbnails(pdfBuffer, {
 *   name: 'small',
 *   width: 150,
 *   height: 200
 * });
 * ```
 */
export declare const generateAllThumbnails: (pdfBuffer: Buffer, size: ThumbnailSize) => Promise<Buffer[]>;
/**
 * 9. Generates multiple thumbnail sizes for a page.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {number} pageNumber - Page number (1-indexed)
 * @param {ThumbnailSize[]} sizes - Array of thumbnail size configurations
 * @returns {Promise<Map<string, Buffer>>} Map of size name to thumbnail buffer
 *
 * @example
 * ```typescript
 * const thumbnails = await generateMultipleThumbnailSizes(pdfBuffer, 1, [
 *   { name: 'small', width: 150, height: 200 },
 *   { name: 'medium', width: 300, height: 400 },
 *   { name: 'large', width: 600, height: 800 }
 * ]);
 * ```
 */
export declare const generateMultipleThumbnailSizes: (pdfBuffer: Buffer, pageNumber: number, sizes: ThumbnailSize[]) => Promise<Map<string, Buffer>>;
/**
 * 10. Generates cover thumbnail (first page).
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {ThumbnailSize} size - Thumbnail size configuration
 * @returns {Promise<Buffer>} Cover thumbnail buffer
 *
 * @example
 * ```typescript
 * const cover = await generateCoverThumbnail(pdfBuffer, {
 *   name: 'large',
 *   width: 600,
 *   height: 800,
 *   quality: 90
 * });
 * ```
 */
export declare const generateCoverThumbnail: (pdfBuffer: Buffer, size: ThumbnailSize) => Promise<Buffer>;
/**
 * 11. Gets standard thumbnail size configurations.
 *
 * @returns {ThumbnailSize[]} Array of standard thumbnail sizes
 *
 * @example
 * ```typescript
 * const sizes = getStandardThumbnailSizes();
 * // Returns small (150x200), medium (300x400), large (600x800), xlarge (900x1200)
 * ```
 */
export declare const getStandardThumbnailSizes: () => ThumbnailSize[];
/**
 * 12. Optimizes thumbnail file size.
 *
 * @param {Buffer} thumbnailBuffer - Original thumbnail buffer
 * @param {Object} options - Optimization options
 * @returns {Promise<Buffer>} Optimized thumbnail buffer
 *
 * @example
 * ```typescript
 * const optimized = await optimizeThumbnail(thumbnail, {
 *   maxSize: 50000,
 *   quality: 75,
 *   format: 'webp'
 * });
 * ```
 */
export declare const optimizeThumbnail: (thumbnailBuffer: Buffer, options: {
    maxSize?: number;
    quality?: number;
    format?: "jpeg" | "webp" | "png";
}) => Promise<Buffer>;
/**
 * 13. Gets quality settings for preview level.
 *
 * @param {PreviewQuality} quality - Quality level
 * @returns {QualitySettings} Quality settings configuration
 *
 * @example
 * ```typescript
 * const settings = getQualitySettings('high');
 * console.log(`DPI: ${settings.dpi}, Quality: ${settings.quality}`);
 * ```
 */
export declare const getQualitySettings: (quality: PreviewQuality) => QualitySettings;
/**
 * 14. Renders page with specific quality level.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {number} pageNumber - Page number (1-indexed)
 * @param {PreviewQuality} quality - Quality level
 * @returns {Promise<RenderedPage>} Rendered page
 *
 * @example
 * ```typescript
 * const page = await renderPageWithQuality(pdfBuffer, 5, 'high');
 * ```
 */
export declare const renderPageWithQuality: (pdfBuffer: Buffer, pageNumber: number, quality: PreviewQuality) => Promise<RenderedPage>;
/**
 * 15. Calculates optimal quality based on viewport size.
 *
 * @param {number} viewportWidth - Viewport width in pixels
 * @param {number} viewportHeight - Viewport height in pixels
 * @returns {PreviewQuality} Recommended quality level
 *
 * @example
 * ```typescript
 * const quality = calculateOptimalQuality(1920, 1080);
 * console.log(`Recommended quality: ${quality}`);
 * ```
 */
export declare const calculateOptimalQuality: (viewportWidth: number, viewportHeight: number) => PreviewQuality;
/**
 * 16. Adjusts quality based on network conditions.
 *
 * @param {PreviewQuality} requestedQuality - User requested quality
 * @param {Object} networkInfo - Network information
 * @returns {PreviewQuality} Adjusted quality level
 *
 * @example
 * ```typescript
 * const quality = adjustQualityForNetwork('high', {
 *   effectiveType: '3g',
 *   downlink: 1.5,
 *   rtt: 200
 * });
 * ```
 */
export declare const adjustQualityForNetwork: (requestedQuality: PreviewQuality, networkInfo: {
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
}) => PreviewQuality;
/**
 * 17. Creates progressive quality levels for rendering.
 *
 * @param {PreviewQuality} targetQuality - Target quality level
 * @returns {PreviewQuality[]} Progressive quality levels
 *
 * @example
 * ```typescript
 * const levels = createProgressiveQualityLevels('high');
 * // Returns ['low', 'medium', 'high'] for progressive loading
 * ```
 */
export declare const createProgressiveQualityLevels: (targetQuality: PreviewQuality) => PreviewQuality[];
/**
 * 18. Estimates render time for quality level.
 *
 * @param {PreviewQuality} quality - Quality level
 * @param {number} pageCount - Number of pages
 * @returns {number} Estimated render time in milliseconds
 *
 * @example
 * ```typescript
 * const estimatedTime = estimateRenderTime('high', 50);
 * console.log(`Estimated: ${estimatedTime}ms`);
 * ```
 */
export declare const estimateRenderTime: (quality: PreviewQuality, pageCount: number) => number;
/**
 * 19. Renders page with custom options.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {PageRenderOptions} options - Rendering options
 * @returns {Promise<RenderedPage>} Rendered page
 *
 * @example
 * ```typescript
 * const page = await renderPageWithOptions(pdfBuffer, {
 *   pageNumber: 5,
 *   width: 1920,
 *   height: 2560,
 *   quality: 'high',
 *   format: 'webp',
 *   rotation: 90
 * });
 * ```
 */
export declare const renderPageWithOptions: (pdfBuffer: Buffer, options: PageRenderOptions) => Promise<RenderedPage>;
/**
 * 20. Renders page with cropping.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {number} pageNumber - Page number (1-indexed)
 * @param {Object} cropArea - Crop area coordinates
 * @returns {Promise<Buffer>} Cropped page image
 *
 * @example
 * ```typescript
 * const cropped = await renderPageWithCrop(pdfBuffer, 1, {
 *   x: 100,
 *   y: 100,
 *   width: 800,
 *   height: 1000
 * });
 * ```
 */
export declare const renderPageWithCrop: (pdfBuffer: Buffer, pageNumber: number, cropArea: {
    x: number;
    y: number;
    width: number;
    height: number;
}) => Promise<Buffer>;
/**
 * 21. Renders page with rotation.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {number} pageNumber - Page number (1-indexed)
 * @param {0 | 90 | 180 | 270} rotation - Rotation angle
 * @returns {Promise<Buffer>} Rotated page image
 *
 * @example
 * ```typescript
 * const rotated = await renderPageWithRotation(pdfBuffer, 1, 90);
 * ```
 */
export declare const renderPageWithRotation: (pdfBuffer: Buffer, pageNumber: number, rotation: 0 | 90 | 180 | 270) => Promise<Buffer>;
/**
 * 22. Renders page with watermark.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {number} pageNumber - Page number (1-indexed)
 * @param {Object} watermark - Watermark configuration
 * @returns {Promise<Buffer>} Watermarked page image
 *
 * @example
 * ```typescript
 * const watermarked = await renderPageWithWatermark(pdfBuffer, 1, {
 *   text: 'CONFIDENTIAL',
 *   opacity: 0.3,
 *   position: 'center'
 * });
 * ```
 */
export declare const renderPageWithWatermark: (pdfBuffer: Buffer, pageNumber: number, watermark: {
    text: string;
    opacity: number;
    position: "center" | "corner";
}) => Promise<Buffer>;
/**
 * 23. Renders page with annotations overlay.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {number} pageNumber - Page number (1-indexed)
 * @param {any[]} annotations - Annotations to overlay
 * @returns {Promise<Buffer>} Page with annotations
 *
 * @example
 * ```typescript
 * const annotated = await renderPageWithAnnotations(pdfBuffer, 1, [
 *   { type: 'highlight', x: 100, y: 200, width: 300, height: 50 }
 * ]);
 * ```
 */
export declare const renderPageWithAnnotations: (pdfBuffer: Buffer, pageNumber: number, annotations: any[]) => Promise<Buffer>;
/**
 * 24. Renders page to base64 data URL.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {number} pageNumber - Page number (1-indexed)
 * @param {PreviewQuality} quality - Quality level
 * @returns {Promise<string>} Base64 data URL
 *
 * @example
 * ```typescript
 * const dataUrl = await renderPageToDataURL(pdfBuffer, 1, 'medium');
 * // Returns 'data:image/webp;base64,...'
 * ```
 */
export declare const renderPageToDataURL: (pdfBuffer: Buffer, pageNumber: number, quality: PreviewQuality) => Promise<string>;
/**
 * 25. Gets predefined zoom levels.
 *
 * @returns {ZoomLevel[]} Array of zoom level configurations
 *
 * @example
 * ```typescript
 * const zoomLevels = getZoomLevels();
 * // Returns levels from 25% to 400%
 * ```
 */
export declare const getZoomLevels: () => ZoomLevel[];
/**
 * 26. Renders page at specific zoom level.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {number} pageNumber - Page number (1-indexed)
 * @param {number} zoomLevel - Zoom percentage (e.g., 150 for 150%)
 * @returns {Promise<RenderedPage>} Rendered page at zoom level
 *
 * @example
 * ```typescript
 * const zoomed = await renderPageAtZoom(pdfBuffer, 1, 200);
 * ```
 */
export declare const renderPageAtZoom: (pdfBuffer: Buffer, pageNumber: number, zoomLevel: number) => Promise<RenderedPage>;
/**
 * 27. Calculates zoom level for fit-to-width.
 *
 * @param {number} pageWidth - Page width in pixels
 * @param {number} viewportWidth - Viewport width in pixels
 * @returns {ZoomLevel} Calculated zoom level
 *
 * @example
 * ```typescript
 * const zoom = calculateFitToWidthZoom(612, 1200);
 * console.log(`Fit to width: ${zoom.label}`);
 * ```
 */
export declare const calculateFitToWidthZoom: (pageWidth: number, viewportWidth: number) => ZoomLevel;
/**
 * 28. Calculates zoom level for fit-to-height.
 *
 * @param {number} pageHeight - Page height in pixels
 * @param {number} viewportHeight - Viewport height in pixels
 * @returns {ZoomLevel} Calculated zoom level
 *
 * @example
 * ```typescript
 * const zoom = calculateFitToHeightZoom(792, 900);
 * ```
 */
export declare const calculateFitToHeightZoom: (pageHeight: number, viewportHeight: number) => ZoomLevel;
/**
 * 29. Calculates zoom level for fit-to-page.
 *
 * @param {number} pageWidth - Page width in pixels
 * @param {number} pageHeight - Page height in pixels
 * @param {number} viewportWidth - Viewport width in pixels
 * @param {number} viewportHeight - Viewport height in pixels
 * @returns {ZoomLevel} Calculated zoom level
 *
 * @example
 * ```typescript
 * const zoom = calculateFitToPageZoom(612, 792, 1200, 900);
 * ```
 */
export declare const calculateFitToPageZoom: (pageWidth: number, pageHeight: number, viewportWidth: number, viewportHeight: number) => ZoomLevel;
/**
 * 30. Validates zoom level range.
 *
 * @param {number} zoomLevel - Zoom percentage
 * @param {number} [minZoom] - Minimum zoom percentage
 * @param {number} [maxZoom] - Maximum zoom percentage
 * @returns {number} Clamped zoom level
 *
 * @example
 * ```typescript
 * const validated = validateZoomLevel(500, 25, 400);
 * // Returns 400 (clamped to max)
 * ```
 */
export declare const validateZoomLevel: (zoomLevel: number, minZoom?: number, maxZoom?: number) => number;
/**
 * 31. Creates lazy loading configuration.
 *
 * @param {number} totalPages - Total number of pages
 * @param {Partial<LazyLoadConfig>} [options] - Configuration options
 * @returns {LazyLoadConfig} Lazy loading configuration
 *
 * @example
 * ```typescript
 * const config = createLazyLoadConfig(100, {
 *   initialPages: 3,
 *   batchSize: 5,
 *   preloadAhead: 3
 * });
 * ```
 */
export declare const createLazyLoadConfig: (totalPages: number, options?: Partial<LazyLoadConfig>) => LazyLoadConfig;
/**
 * 32. Calculates pages to load based on current position.
 *
 * @param {number} currentPage - Current page number
 * @param {LazyLoadConfig} config - Lazy loading configuration
 * @param {number} totalPages - Total number of pages
 * @returns {number[]} Array of page numbers to load
 *
 * @example
 * ```typescript
 * const pagesToLoad = calculatePagesToLoad(10, config, 100);
 * // Returns [8, 9, 10, 11, 12, 13] (based on preload settings)
 * ```
 */
export declare const calculatePagesToLoad: (currentPage: number, config: LazyLoadConfig, totalPages: number) => number[];
/**
 * 33. Implements lazy page rendering strategy.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {number[]} pageNumbers - Page numbers to render
 * @param {PreviewQuality} quality - Quality level
 * @returns {Promise<Map<number, RenderedPage>>} Map of page number to rendered page
 *
 * @example
 * ```typescript
 * const pages = await lazyRenderPages(pdfBuffer, [1, 2, 3, 4, 5], 'medium');
 * ```
 */
export declare const lazyRenderPages: (pdfBuffer: Buffer, pageNumbers: number[], quality: PreviewQuality) => Promise<Map<number, RenderedPage>>;
/**
 * 34. Preloads pages in background.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {number[]} pageNumbers - Page numbers to preload
 * @param {PreviewQuality} quality - Quality level
 * @returns {Promise<void>} Resolves when preloading completes
 *
 * @example
 * ```typescript
 * await preloadPages(pdfBuffer, [5, 6, 7], 'low');
 * ```
 */
export declare const preloadPages: (pdfBuffer: Buffer, pageNumbers: number[], quality: PreviewQuality) => Promise<void>;
/**
 * 35. Manages page cache with LRU eviction.
 *
 * @param {Map<number, RenderedPage>} cache - Current page cache
 * @param {number} maxSize - Maximum cache size
 * @param {number} newPageNumber - New page to add
 * @param {RenderedPage} newPage - New page data
 * @returns {Map<number, RenderedPage>} Updated cache
 *
 * @example
 * ```typescript
 * const updatedCache = manageLRUCache(cache, 20, 10, renderedPage);
 * ```
 */
export declare const manageLRUCache: (cache: Map<number, RenderedPage>, maxSize: number, newPageNumber: number, newPage: RenderedPage) => Map<number, RenderedPage>;
/**
 * 36. Clears page cache.
 *
 * @param {Map<number, RenderedPage>} cache - Page cache to clear
 * @returns {Map<number, RenderedPage>} Empty cache
 *
 * @example
 * ```typescript
 * const clearedCache = clearPageCache(cache);
 * ```
 */
export declare const clearPageCache: (cache: Map<number, RenderedPage>) => Map<number, RenderedPage>;
/**
 * 37. Creates streaming renderer for progressive loading.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {StreamRenderOptions} options - Streaming options
 * @returns {Readable} Readable stream of rendered pages
 *
 * @example
 * ```typescript
 * const stream = createStreamingRenderer(pdfBuffer, {
 *   progressive: true,
 *   startPage: 1,
 *   endPage: 10
 * });
 * stream.on('data', (page) => console.log('Rendered page', page.pageNumber));
 * ```
 */
export declare const createStreamingRenderer: (pdfBuffer: Buffer, options: StreamRenderOptions) => Readable;
/**
 * 38. Renders pages progressively (low to high quality).
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {number} pageNumber - Page number (1-indexed)
 * @param {PreviewQuality} targetQuality - Target quality level
 * @returns {AsyncGenerator<ProgressiveRenderState>} Progressive rendering states
 *
 * @example
 * ```typescript
 * for await (const state of renderProgressively(pdfBuffer, 1, 'high')) {
 *   console.log(`Progress: ${state.progress}%, Quality: ${state.currentQuality}`);
 * }
 * ```
 */
export declare function renderProgressively(pdfBuffer: Buffer, pageNumber: number, targetQuality: PreviewQuality): AsyncGenerator<ProgressiveRenderState>;
/**
 * 39. Streams rendered pages to output.
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {number[]} pageNumbers - Page numbers to stream
 * @param {Transform} outputStream - Output transform stream
 * @returns {Promise<void>} Resolves when streaming completes
 *
 * @example
 * ```typescript
 * await streamRenderedPages(pdfBuffer, [1, 2, 3], outputStream);
 * ```
 */
export declare const streamRenderedPages: (pdfBuffer: Buffer, pageNumbers: number[], outputStream: Transform) => Promise<void>;
/**
 * 40. Generates cache key for rendered page.
 *
 * @param {string} documentId - Document ID
 * @param {number} pageNumber - Page number
 * @param {PreviewQuality} quality - Quality level
 * @param {Object} [options] - Additional options
 * @returns {string} Cache key
 *
 * @example
 * ```typescript
 * const key = generateRenderCacheKey('doc-123', 5, 'high', { zoom: 150 });
 * // Returns 'render:doc-123:5:high:zoom150'
 * ```
 */
export declare const generateRenderCacheKey: (documentId: string, pageNumber: number, quality: PreviewQuality, options?: {
    zoom?: number;
    rotation?: number;
}) => string;
/**
 * 41. Stores rendered page in cache.
 *
 * @param {string} cacheKey - Cache key
 * @param {Buffer} pageBuffer - Rendered page buffer
 * @param {number} ttl - Time to live in seconds
 * @returns {Promise<void>} Resolves when cached
 *
 * @example
 * ```typescript
 * await cacheRenderedPage('render:doc-123:1:high', pageBuffer, 3600);
 * ```
 */
export declare const cacheRenderedPage: (cacheKey: string, pageBuffer: Buffer, ttl: number) => Promise<void>;
/**
 * 42. Retrieves rendered page from cache.
 *
 * @param {string} cacheKey - Cache key
 * @returns {Promise<Buffer | null>} Cached page buffer or null if not found
 *
 * @example
 * ```typescript
 * const cached = await getCachedRenderedPage('render:doc-123:1:high');
 * if (cached) {
 *   return cached;
 * } else {
 *   // Render and cache
 * }
 * ```
 */
export declare const getCachedRenderedPage: (cacheKey: string) => Promise<Buffer | null>;
declare const _default: {
    renderPDFToImage: (pdfBuffer: Buffer, config: PDFRenderConfig) => Promise<Buffer>;
    renderPDFPage: (pdfBuffer: Buffer, pageNumber: number, config: PDFRenderConfig) => Promise<RenderedPage>;
    renderAllPDFPages: (pdfBuffer: Buffer, config: PDFRenderConfig) => Promise<RenderedPage[]>;
    renderPDFPageRange: (pdfBuffer: Buffer, startPage: number, endPage: number, config: PDFRenderConfig) => Promise<RenderedPage[]>;
    getPDFPageCount: (pdfBuffer: Buffer) => Promise<number>;
    extractPDFRenderMetadata: (pdfBuffer: Buffer) => Promise<DocumentRenderMetadata>;
    generatePDFThumbnail: (pdfBuffer: Buffer, pageNumber: number, size: ThumbnailSize) => Promise<Buffer>;
    generateAllThumbnails: (pdfBuffer: Buffer, size: ThumbnailSize) => Promise<Buffer[]>;
    generateMultipleThumbnailSizes: (pdfBuffer: Buffer, pageNumber: number, sizes: ThumbnailSize[]) => Promise<Map<string, Buffer>>;
    generateCoverThumbnail: (pdfBuffer: Buffer, size: ThumbnailSize) => Promise<Buffer>;
    getStandardThumbnailSizes: () => ThumbnailSize[];
    optimizeThumbnail: (thumbnailBuffer: Buffer, options: {
        maxSize?: number;
        quality?: number;
        format?: "jpeg" | "webp" | "png";
    }) => Promise<Buffer>;
    getQualitySettings: (quality: PreviewQuality) => QualitySettings;
    renderPageWithQuality: (pdfBuffer: Buffer, pageNumber: number, quality: PreviewQuality) => Promise<RenderedPage>;
    calculateOptimalQuality: (viewportWidth: number, viewportHeight: number) => PreviewQuality;
    adjustQualityForNetwork: (requestedQuality: PreviewQuality, networkInfo: {
        effectiveType?: string;
        downlink?: number;
        rtt?: number;
    }) => PreviewQuality;
    createProgressiveQualityLevels: (targetQuality: PreviewQuality) => PreviewQuality[];
    estimateRenderTime: (quality: PreviewQuality, pageCount: number) => number;
    renderPageWithOptions: (pdfBuffer: Buffer, options: PageRenderOptions) => Promise<RenderedPage>;
    renderPageWithCrop: (pdfBuffer: Buffer, pageNumber: number, cropArea: {
        x: number;
        y: number;
        width: number;
        height: number;
    }) => Promise<Buffer>;
    renderPageWithRotation: (pdfBuffer: Buffer, pageNumber: number, rotation: 0 | 90 | 180 | 270) => Promise<Buffer>;
    renderPageWithWatermark: (pdfBuffer: Buffer, pageNumber: number, watermark: {
        text: string;
        opacity: number;
        position: "center" | "corner";
    }) => Promise<Buffer>;
    renderPageWithAnnotations: (pdfBuffer: Buffer, pageNumber: number, annotations: any[]) => Promise<Buffer>;
    renderPageToDataURL: (pdfBuffer: Buffer, pageNumber: number, quality: PreviewQuality) => Promise<string>;
    getZoomLevels: () => ZoomLevel[];
    renderPageAtZoom: (pdfBuffer: Buffer, pageNumber: number, zoomLevel: number) => Promise<RenderedPage>;
    calculateFitToWidthZoom: (pageWidth: number, viewportWidth: number) => ZoomLevel;
    calculateFitToHeightZoom: (pageHeight: number, viewportHeight: number) => ZoomLevel;
    calculateFitToPageZoom: (pageWidth: number, pageHeight: number, viewportWidth: number, viewportHeight: number) => ZoomLevel;
    validateZoomLevel: (zoomLevel: number, minZoom?: number, maxZoom?: number) => number;
    createLazyLoadConfig: (totalPages: number, options?: Partial<LazyLoadConfig>) => LazyLoadConfig;
    calculatePagesToLoad: (currentPage: number, config: LazyLoadConfig, totalPages: number) => number[];
    lazyRenderPages: (pdfBuffer: Buffer, pageNumbers: number[], quality: PreviewQuality) => Promise<Map<number, RenderedPage>>;
    preloadPages: (pdfBuffer: Buffer, pageNumbers: number[], quality: PreviewQuality) => Promise<void>;
    manageLRUCache: (cache: Map<number, RenderedPage>, maxSize: number, newPageNumber: number, newPage: RenderedPage) => Map<number, RenderedPage>;
    clearPageCache: (cache: Map<number, RenderedPage>) => Map<number, RenderedPage>;
    createStreamingRenderer: (pdfBuffer: Buffer, options: StreamRenderOptions) => Readable;
    renderProgressively: typeof renderProgressively;
    streamRenderedPages: (pdfBuffer: Buffer, pageNumbers: number[], outputStream: Transform) => Promise<void>;
    generateRenderCacheKey: (documentId: string, pageNumber: number, quality: PreviewQuality, options?: {
        zoom?: number;
        rotation?: number;
    }) => string;
    cacheRenderedPage: (cacheKey: string, pageBuffer: Buffer, ttl: number) => Promise<void>;
    getCachedRenderedPage: (cacheKey: string) => Promise<Buffer | null>;
    createRenderedDocumentModel: (sequelize: Sequelize) => any;
    createDocumentThumbnailModel: (sequelize: Sequelize) => any;
    createRenderJobModel: (sequelize: Sequelize) => any;
};
export default _default;
//# sourceMappingURL=document-rendering-kit.d.ts.map