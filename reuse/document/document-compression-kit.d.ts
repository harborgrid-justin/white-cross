/**
 * LOC: DOC-COMPRESS-001
 * File: /reuse/document/document-compression-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize (v6.x)
 *   - pdf-lib
 *   - sharp
 *   - pdfjs-dist
 *
 * DOWNSTREAM (imported by):
 *   - Document processing services
 *   - PDF optimization modules
 *   - Batch document processors
 *   - Document storage services
 */
/**
 * File: /reuse/document/document-compression-kit.ts
 * Locator: WC-UTL-DOCCOMPRESS-001
 * Purpose: PDF Optimization & Compression Utilities - Comprehensive document compression and optimization
 *
 * Upstream: @nestjs/common, sequelize, pdf-lib, sharp, pdfjs-dist
 * Downstream: Document services, PDF processors, storage modules, optimization pipelines
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, pdf-lib 1.x, Sharp 0.33.x
 * Exports: 38 utility functions for PDF optimization, image compression, batch processing, quality presets
 *
 * LLM Context: Production-grade document compression utilities for White Cross healthcare platform.
 * Provides PDF optimization, image downsample, unused object removal, font optimization, linearization,
 * batch processing, quality presets, and size reduction strategies. Essential for optimizing medical
 * documents, reducing storage costs, and improving delivery performance in healthcare applications.
 */
import { Sequelize } from 'sequelize';
/**
 * PDF compression configuration
 */
export interface PDFCompressionConfig {
    quality?: 'low' | 'medium' | 'high' | 'maximum';
    imageQuality?: number;
    imageDownsample?: number;
    removeUnusedObjects?: boolean;
    optimizeFonts?: boolean;
    linearize?: boolean;
    compressStreams?: boolean;
    removeMetadata?: boolean;
    customSettings?: Record<string, any>;
}
/**
 * Image compression options
 */
export interface ImageCompressionOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp';
    downsampleDPI?: number;
    preserveAspectRatio?: boolean;
}
/**
 * PDF optimization result
 */
export interface PDFOptimizationResult {
    success: boolean;
    originalSize: number;
    optimizedSize: number;
    compressionRatio: number;
    savedBytes: number;
    savedPercentage: number;
    operations: string[];
    warnings?: string[];
    errors?: string[];
}
/**
 * Batch optimization configuration
 */
export interface BatchOptimizationConfig {
    concurrency?: number;
    skipErrors?: boolean;
    preset?: CompressionPreset;
    progressCallback?: (progress: BatchProgress) => void;
}
/**
 * Batch optimization progress
 */
export interface BatchProgress {
    total: number;
    processed: number;
    succeeded: number;
    failed: number;
    currentFile?: string;
    percentage: number;
}
/**
 * Compression quality preset
 */
export type CompressionPreset = 'print' | 'screen' | 'ebook' | 'prepress' | 'archive';
/**
 * Font optimization options
 */
export interface FontOptimizationOptions {
    embedSubsets?: boolean;
    removeUnusedFonts?: boolean;
    convertToStandard?: boolean;
    compressFonts?: boolean;
}
/**
 * Linearization options for web delivery
 */
export interface LinearizationOptions {
    optimize?: boolean;
    createFastWebView?: boolean;
    optimizePageOrder?: boolean;
}
/**
 * Document object removal options
 */
export interface ObjectRemovalOptions {
    removeJavaScript?: boolean;
    removeAnnotations?: boolean;
    removeAttachments?: boolean;
    removeBookmarks?: boolean;
    removeThumbnails?: boolean;
    removeLinks?: boolean;
}
/**
 * Size reduction strategy
 */
export interface SizeReductionStrategy {
    targetSizeKB?: number;
    maxIterations?: number;
    priorityOrder?: ('images' | 'fonts' | 'objects' | 'metadata')[];
    acceptableQualityLoss?: number;
}
/**
 * PDF page optimization
 */
export interface PageOptimizationOptions {
    removeUnusedResources?: boolean;
    optimizeContentStreams?: boolean;
    mergeIdenticalObjects?: boolean;
    flattenTransparency?: boolean;
}
/**
 * Document compression job attributes
 */
export interface DocumentCompressionJobAttributes {
    id: string;
    documentId: string;
    originalSize: number;
    optimizedSize?: number;
    compressionRatio?: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    preset: string;
    config: Record<string, any>;
    operations: string[];
    errors?: string[];
    warnings?: string[];
    startedAt?: Date;
    completedAt?: Date;
    processingTimeMs?: number;
    createdBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Document optimization history attributes
 */
export interface DocumentOptimizationHistoryAttributes {
    id: string;
    documentId: string;
    version: number;
    originalSize: number;
    optimizedSize: number;
    compressionRatio: number;
    operations: string[];
    preset: string;
    config: Record<string, any>;
    optimizedBy?: string;
    optimizedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates DocumentCompressionJob model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<DocumentCompressionJobAttributes>>} DocumentCompressionJob model
 *
 * @example
 * ```typescript
 * const CompressionJobModel = createDocumentCompressionJobModel(sequelize);
 * const job = await CompressionJobModel.create({
 *   documentId: 'doc-123',
 *   originalSize: 5242880,
 *   preset: 'screen',
 *   config: { quality: 'medium', imageQuality: 75 },
 *   status: 'pending'
 * });
 * ```
 */
export declare const createDocumentCompressionJobModel: (sequelize: Sequelize) => any;
/**
 * Creates DocumentOptimizationHistory model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<DocumentOptimizationHistoryAttributes>>} DocumentOptimizationHistory model
 *
 * @example
 * ```typescript
 * const HistoryModel = createDocumentOptimizationHistoryModel(sequelize);
 * const history = await HistoryModel.create({
 *   documentId: 'doc-123',
 *   version: 2,
 *   originalSize: 5242880,
 *   optimizedSize: 2097152,
 *   compressionRatio: 2.5,
 *   operations: ['image-compression', 'font-optimization'],
 *   preset: 'screen'
 * });
 * ```
 */
export declare const createDocumentOptimizationHistoryModel: (sequelize: Sequelize) => any;
/**
 * 1. Optimizes PDF document using comprehensive compression strategies.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {PDFCompressionConfig} [config] - Compression configuration
 * @returns {Promise<PDFOptimizationResult>} Optimization result with metrics
 *
 * @example
 * ```typescript
 * const result = await optimizePDF(pdfBuffer, {
 *   quality: 'medium',
 *   imageQuality: 75,
 *   imageDownsample: 150,
 *   removeUnusedObjects: true,
 *   optimizeFonts: true,
 *   linearize: true
 * });
 * console.log(`Reduced size by ${result.savedPercentage}%`);
 * ```
 */
export declare const optimizePDF: (pdfBuffer: Buffer, config?: PDFCompressionConfig) => Promise<PDFOptimizationResult>;
/**
 * 2. Compresses images within PDF document.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {ImageCompressionOptions} options - Image compression options
 * @returns {Promise<Buffer>} PDF with compressed images
 *
 * @example
 * ```typescript
 * const compressed = await compressPDFImages(pdfBuffer, {
 *   quality: 70,
 *   downsampleDPI: 150,
 *   format: 'jpeg'
 * });
 * ```
 */
export declare const compressPDFImages: (pdfBuffer: Buffer, options: ImageCompressionOptions) => Promise<Buffer>;
/**
 * 3. Downsamples image resolution in PDF.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {number} targetDPI - Target DPI for images
 * @returns {Promise<Buffer>} PDF with downsampled images
 *
 * @example
 * ```typescript
 * const downsampled = await downsamplePDFImages(pdfBuffer, 150);
 * ```
 */
export declare const downsamplePDFImages: (pdfBuffer: Buffer, targetDPI: number) => Promise<Buffer>;
/**
 * 4. Removes unused objects from PDF.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<Buffer>} Cleaned PDF buffer
 *
 * @example
 * ```typescript
 * const cleaned = await removeUnusedPDFObjects(pdfBuffer);
 * ```
 */
export declare const removeUnusedPDFObjects: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 5. Optimizes fonts in PDF document.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {FontOptimizationOptions} options - Font optimization options
 * @returns {Promise<Buffer>} PDF with optimized fonts
 *
 * @example
 * ```typescript
 * const optimized = await optimizePDFFonts(pdfBuffer, {
 *   embedSubsets: true,
 *   removeUnusedFonts: true,
 *   compressFonts: true
 * });
 * ```
 */
export declare const optimizePDFFonts: (pdfBuffer: Buffer, options: FontOptimizationOptions) => Promise<Buffer>;
/**
 * 6. Linearizes PDF for fast web view.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {LinearizationOptions} [options] - Linearization options
 * @returns {Promise<Buffer>} Linearized PDF buffer
 *
 * @example
 * ```typescript
 * const linearized = await linearizePDF(pdfBuffer, {
 *   optimize: true,
 *   createFastWebView: true
 * });
 * ```
 */
export declare const linearizePDF: (pdfBuffer: Buffer, options?: LinearizationOptions) => Promise<Buffer>;
/**
 * 7. Removes PDF metadata.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<Buffer>} PDF without metadata
 *
 * @example
 * ```typescript
 * const stripped = await removePDFMetadata(pdfBuffer);
 * ```
 */
export declare const removePDFMetadata: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 8. Applies compression quality preset.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {CompressionPreset} preset - Quality preset
 * @returns {Promise<PDFOptimizationResult>} Optimization result
 *
 * @example
 * ```typescript
 * const result = await applyCompressionPreset(pdfBuffer, 'screen');
 * ```
 */
export declare const applyCompressionPreset: (pdfBuffer: Buffer, preset: CompressionPreset) => Promise<PDFOptimizationResult>;
/**
 * 9. Batch optimizes multiple PDF documents.
 *
 * @param {Buffer[]} pdfBuffers - Array of PDF buffers
 * @param {BatchOptimizationConfig} config - Batch optimization configuration
 * @returns {Promise<PDFOptimizationResult[]>} Array of optimization results
 *
 * @example
 * ```typescript
 * const results = await batchOptimizePDFs(pdfBuffers, {
 *   concurrency: 4,
 *   preset: 'screen',
 *   progressCallback: (progress) => {
 *     console.log(`Progress: ${progress.percentage}%`);
 *   }
 * });
 * ```
 */
export declare const batchOptimizePDFs: (pdfBuffers: Buffer[], config: BatchOptimizationConfig) => Promise<PDFOptimizationResult[]>;
/**
 * 10. Reduces PDF to target file size.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {SizeReductionStrategy} strategy - Size reduction strategy
 * @returns {Promise<PDFOptimizationResult>} Optimization result
 *
 * @example
 * ```typescript
 * const result = await reducePDFSize(pdfBuffer, {
 *   targetSizeKB: 500,
 *   maxIterations: 5,
 *   priorityOrder: ['images', 'fonts', 'objects'],
 *   acceptableQualityLoss: 15
 * });
 * ```
 */
export declare const reducePDFSize: (pdfBuffer: Buffer, strategy: SizeReductionStrategy) => Promise<PDFOptimizationResult>;
/**
 * 11. Compresses individual image.
 *
 * @param {Buffer} imageBuffer - Image buffer
 * @param {ImageCompressionOptions} options - Compression options
 * @returns {Promise<Buffer>} Compressed image buffer
 *
 * @example
 * ```typescript
 * const compressed = await compressImage(imageBuffer, {
 *   quality: 80,
 *   maxWidth: 1920,
 *   format: 'jpeg'
 * });
 * ```
 */
export declare const compressImage: (imageBuffer: Buffer, options: ImageCompressionOptions) => Promise<Buffer>;
/**
 * 12. Extracts and compresses all images from PDF.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {ImageCompressionOptions} options - Compression options
 * @returns {Promise<Buffer[]>} Array of compressed image buffers
 *
 * @example
 * ```typescript
 * const images = await extractAndCompressImages(pdfBuffer, {
 *   quality: 75,
 *   format: 'jpeg'
 * });
 * ```
 */
export declare const extractAndCompressImages: (pdfBuffer: Buffer, options: ImageCompressionOptions) => Promise<Buffer[]>;
/**
 * 13. Optimizes image color space.
 *
 * @param {Buffer} imageBuffer - Image buffer
 * @param {string} targetColorSpace - Target color space (RGB, CMYK, Grayscale)
 * @returns {Promise<Buffer>} Optimized image buffer
 *
 * @example
 * ```typescript
 * const grayscale = await optimizeImageColorSpace(imageBuffer, 'Grayscale');
 * ```
 */
export declare const optimizeImageColorSpace: (imageBuffer: Buffer, targetColorSpace: string) => Promise<Buffer>;
/**
 * 14. Removes image alpha channel if not needed.
 *
 * @param {Buffer} imageBuffer - Image buffer
 * @returns {Promise<Buffer>} Image without alpha channel
 *
 * @example
 * ```typescript
 * const noAlpha = await removeImageAlphaChannel(imageBuffer);
 * ```
 */
export declare const removeImageAlphaChannel: (imageBuffer: Buffer) => Promise<Buffer>;
/**
 * 15. Converts images to optimal format.
 *
 * @param {Buffer} imageBuffer - Image buffer
 * @param {Object} options - Conversion options
 * @returns {Promise<Buffer>} Converted image buffer
 *
 * @example
 * ```typescript
 * const webp = await convertImageFormat(imageBuffer, {
 *   format: 'webp',
 *   quality: 80
 * });
 * ```
 */
export declare const convertImageFormat: (imageBuffer: Buffer, options: {
    format: "jpeg" | "png" | "webp";
    quality?: number;
}) => Promise<Buffer>;
/**
 * 16. Embeds font subsets in PDF.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<Buffer>} PDF with embedded font subsets
 *
 * @example
 * ```typescript
 * const subset = await embedFontSubsets(pdfBuffer);
 * ```
 */
export declare const embedFontSubsets: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 17. Removes unused fonts from PDF.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<Buffer>} PDF with unused fonts removed
 *
 * @example
 * ```typescript
 * const cleaned = await removeUnusedFonts(pdfBuffer);
 * ```
 */
export declare const removeUnusedFonts: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 18. Converts fonts to standard formats.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<Buffer>} PDF with standardized fonts
 *
 * @example
 * ```typescript
 * const standardized = await standardizeFonts(pdfBuffer);
 * ```
 */
export declare const standardizeFonts: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 19. Compresses embedded fonts.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<Buffer>} PDF with compressed fonts
 *
 * @example
 * ```typescript
 * const compressed = await compressFonts(pdfBuffer);
 * ```
 */
export declare const compressFonts: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 20. Compresses PDF content streams.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<Buffer>} PDF with compressed streams
 *
 * @example
 * ```typescript
 * const compressed = await compressContentStreams(pdfBuffer);
 * ```
 */
export declare const compressContentStreams: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 21. Removes duplicate objects.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<Buffer>} PDF with deduplicated objects
 *
 * @example
 * ```typescript
 * const deduplicated = await removeDuplicateObjects(pdfBuffer);
 * ```
 */
export declare const removeDuplicateObjects: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 22. Removes specific PDF objects.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {ObjectRemovalOptions} options - Object removal options
 * @returns {Promise<Buffer>} PDF with objects removed
 *
 * @example
 * ```typescript
 * const cleaned = await removeSpecificObjects(pdfBuffer, {
 *   removeJavaScript: true,
 *   removeAnnotations: false,
 *   removeAttachments: true
 * });
 * ```
 */
export declare const removeSpecificObjects: (pdfBuffer: Buffer, options: ObjectRemovalOptions) => Promise<Buffer>;
/**
 * 23. Optimizes PDF object structure.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<Buffer>} PDF with optimized structure
 *
 * @example
 * ```typescript
 * const optimized = await optimizeObjectStructure(pdfBuffer);
 * ```
 */
export declare const optimizeObjectStructure: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 24. Flattens PDF layers and transparency.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<Buffer>} Flattened PDF
 *
 * @example
 * ```typescript
 * const flattened = await flattenPDFLayers(pdfBuffer);
 * ```
 */
export declare const flattenPDFLayers: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 25. Optimizes individual PDF pages.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {PageOptimizationOptions} options - Page optimization options
 * @returns {Promise<Buffer>} PDF with optimized pages
 *
 * @example
 * ```typescript
 * const optimized = await optimizePDFPages(pdfBuffer, {
 *   removeUnusedResources: true,
 *   optimizeContentStreams: true,
 *   mergeIdenticalObjects: true
 * });
 * ```
 */
export declare const optimizePDFPages: (pdfBuffer: Buffer, options: PageOptimizationOptions) => Promise<Buffer>;
/**
 * 26. Removes blank pages.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<Buffer>} PDF without blank pages
 *
 * @example
 * ```typescript
 * const cleaned = await removeBlankPages(pdfBuffer);
 * ```
 */
export declare const removeBlankPages: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 27. Optimizes page content order.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<Buffer>} PDF with optimized page order
 *
 * @example
 * ```typescript
 * const optimized = await optimizePageOrder(pdfBuffer);
 * ```
 */
export declare const optimizePageOrder: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 28. Merges identical page resources.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<Buffer>} PDF with merged resources
 *
 * @example
 * ```typescript
 * const merged = await mergePageResources(pdfBuffer);
 * ```
 */
export declare const mergePageResources: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 29. Removes all PDF annotations.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<Buffer>} PDF without annotations
 *
 * @example
 * ```typescript
 * const cleaned = await removeAnnotations(pdfBuffer);
 * ```
 */
export declare const removeAnnotations: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 30. Removes PDF bookmarks.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<Buffer>} PDF without bookmarks
 *
 * @example
 * ```typescript
 * const cleaned = await removeBookmarks(pdfBuffer);
 * ```
 */
export declare const removeBookmarks: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 31. Removes embedded JavaScript.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<Buffer>} PDF without JavaScript
 *
 * @example
 * ```typescript
 * const cleaned = await removeJavaScript(pdfBuffer);
 * ```
 */
export declare const removeJavaScript: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 32. Removes file attachments.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<Buffer>} PDF without attachments
 *
 * @example
 * ```typescript
 * const cleaned = await removeAttachments(pdfBuffer);
 * ```
 */
export declare const removeAttachments: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 33. Analyzes PDF compression opportunities.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<Object>} Compression analysis report
 *
 * @example
 * ```typescript
 * const analysis = await analyzePDFCompression(pdfBuffer);
 * console.log('Potential savings:', analysis.potentialSavings);
 * ```
 */
export declare const analyzePDFCompression: (pdfBuffer: Buffer) => Promise<{
    currentSize: number;
    potentialSavings: number;
    recommendations: string[];
    imageCount: number;
    fontCount: number;
    objectCount: number;
}>;
/**
 * 34. Generates compression statistics.
 *
 * @param {PDFOptimizationResult[]} results - Array of optimization results
 * @returns {Object} Aggregated statistics
 *
 * @example
 * ```typescript
 * const stats = generateCompressionStats(batchResults);
 * console.log('Total savings:', stats.totalSavedBytes);
 * ```
 */
export declare const generateCompressionStats: (results: PDFOptimizationResult[]) => {
    totalOriginalSize: number;
    totalOptimizedSize: number;
    totalSavedBytes: number;
    averageCompressionRatio: number;
    successRate: number;
};
/**
 * 35. Compares compression strategies.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @param {CompressionPreset[]} presets - Presets to compare
 * @returns {Promise<Record<CompressionPreset, PDFOptimizationResult>>} Comparison results
 *
 * @example
 * ```typescript
 * const comparison = await compareCompressionStrategies(pdfBuffer, [
 *   'screen', 'print', 'ebook'
 * ]);
 * ```
 */
export declare const compareCompressionStrategies: (pdfBuffer: Buffer, presets: CompressionPreset[]) => Promise<Record<CompressionPreset, PDFOptimizationResult>>;
/**
 * 36. Estimates compression time.
 *
 * @param {number} fileSize - File size in bytes
 * @param {CompressionPreset} preset - Compression preset
 * @returns {number} Estimated time in milliseconds
 *
 * @example
 * ```typescript
 * const estimatedMs = estimateCompressionTime(5242880, 'screen');
 * console.log(`Estimated: ${estimatedMs}ms`);
 * ```
 */
export declare const estimateCompressionTime: (fileSize: number, preset: CompressionPreset) => number;
/**
 * 37. Validates PDF before compression.
 *
 * @param {Buffer} pdfBuffer - PDF document buffer
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validatePDFForCompression(pdfBuffer);
 * if (!validation.valid) {
 *   console.error('Errors:', validation.errors);
 * }
 * ```
 */
export declare const validatePDFForCompression: (pdfBuffer: Buffer) => Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * 38. Creates compression configuration from preset.
 *
 * @param {CompressionPreset} preset - Compression preset
 * @param {Partial<PDFCompressionConfig>} overrides - Configuration overrides
 * @returns {PDFCompressionConfig} Complete compression configuration
 *
 * @example
 * ```typescript
 * const config = createCompressionConfig('screen', {
 *   imageQuality: 65,
 *   linearize: false
 * });
 * ```
 */
export declare const createCompressionConfig: (preset: CompressionPreset, overrides?: Partial<PDFCompressionConfig>) => PDFCompressionConfig;
declare const _default: {
    optimizePDF: (pdfBuffer: Buffer, config?: PDFCompressionConfig) => Promise<PDFOptimizationResult>;
    compressPDFImages: (pdfBuffer: Buffer, options: ImageCompressionOptions) => Promise<Buffer>;
    downsamplePDFImages: (pdfBuffer: Buffer, targetDPI: number) => Promise<Buffer>;
    removeUnusedPDFObjects: (pdfBuffer: Buffer) => Promise<Buffer>;
    optimizePDFFonts: (pdfBuffer: Buffer, options: FontOptimizationOptions) => Promise<Buffer>;
    linearizePDF: (pdfBuffer: Buffer, options?: LinearizationOptions) => Promise<Buffer>;
    removePDFMetadata: (pdfBuffer: Buffer) => Promise<Buffer>;
    applyCompressionPreset: (pdfBuffer: Buffer, preset: CompressionPreset) => Promise<PDFOptimizationResult>;
    batchOptimizePDFs: (pdfBuffers: Buffer[], config: BatchOptimizationConfig) => Promise<PDFOptimizationResult[]>;
    reducePDFSize: (pdfBuffer: Buffer, strategy: SizeReductionStrategy) => Promise<PDFOptimizationResult>;
    compressImage: (imageBuffer: Buffer, options: ImageCompressionOptions) => Promise<Buffer>;
    extractAndCompressImages: (pdfBuffer: Buffer, options: ImageCompressionOptions) => Promise<Buffer[]>;
    optimizeImageColorSpace: (imageBuffer: Buffer, targetColorSpace: string) => Promise<Buffer>;
    removeImageAlphaChannel: (imageBuffer: Buffer) => Promise<Buffer>;
    convertImageFormat: (imageBuffer: Buffer, options: {
        format: "jpeg" | "png" | "webp";
        quality?: number;
    }) => Promise<Buffer>;
    embedFontSubsets: (pdfBuffer: Buffer) => Promise<Buffer>;
    removeUnusedFonts: (pdfBuffer: Buffer) => Promise<Buffer>;
    standardizeFonts: (pdfBuffer: Buffer) => Promise<Buffer>;
    compressFonts: (pdfBuffer: Buffer) => Promise<Buffer>;
    compressContentStreams: (pdfBuffer: Buffer) => Promise<Buffer>;
    removeDuplicateObjects: (pdfBuffer: Buffer) => Promise<Buffer>;
    removeSpecificObjects: (pdfBuffer: Buffer, options: ObjectRemovalOptions) => Promise<Buffer>;
    optimizeObjectStructure: (pdfBuffer: Buffer) => Promise<Buffer>;
    flattenPDFLayers: (pdfBuffer: Buffer) => Promise<Buffer>;
    optimizePDFPages: (pdfBuffer: Buffer, options: PageOptimizationOptions) => Promise<Buffer>;
    removeBlankPages: (pdfBuffer: Buffer) => Promise<Buffer>;
    optimizePageOrder: (pdfBuffer: Buffer) => Promise<Buffer>;
    mergePageResources: (pdfBuffer: Buffer) => Promise<Buffer>;
    removeAnnotations: (pdfBuffer: Buffer) => Promise<Buffer>;
    removeBookmarks: (pdfBuffer: Buffer) => Promise<Buffer>;
    removeJavaScript: (pdfBuffer: Buffer) => Promise<Buffer>;
    removeAttachments: (pdfBuffer: Buffer) => Promise<Buffer>;
    analyzePDFCompression: (pdfBuffer: Buffer) => Promise<{
        currentSize: number;
        potentialSavings: number;
        recommendations: string[];
        imageCount: number;
        fontCount: number;
        objectCount: number;
    }>;
    generateCompressionStats: (results: PDFOptimizationResult[]) => {
        totalOriginalSize: number;
        totalOptimizedSize: number;
        totalSavedBytes: number;
        averageCompressionRatio: number;
        successRate: number;
    };
    compareCompressionStrategies: (pdfBuffer: Buffer, presets: CompressionPreset[]) => Promise<Record<CompressionPreset, PDFOptimizationResult>>;
    estimateCompressionTime: (fileSize: number, preset: CompressionPreset) => number;
    validatePDFForCompression: (pdfBuffer: Buffer) => Promise<{
        valid: boolean;
        errors: string[];
    }>;
    createCompressionConfig: (preset: CompressionPreset, overrides?: Partial<PDFCompressionConfig>) => PDFCompressionConfig;
};
export default _default;
//# sourceMappingURL=document-compression-kit.d.ts.map