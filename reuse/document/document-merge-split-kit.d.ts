/**
 * LOC: DOC-MERGE-001
 * File: /reuse/document/document-merge-split-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize (v6.x)
 *   - pdflib
 *   - pdf-parse
 *   - stream
 *
 * DOWNSTREAM (imported by):
 *   - Document processing services
 *   - PDF manipulation controllers
 *   - Batch processing modules
 *   - Document assembly services
 *   - Medical records consolidation
 */
/**
 * File: /reuse/document/document-merge-split-kit.ts
 * Locator: WC-UTL-DOCMERGE-001
 * Purpose: Document Merge, Split & Extract Kit - Comprehensive PDF merging, splitting, extraction, and manipulation
 *
 * Upstream: @nestjs/common, sequelize v6.x, pdflib, pdf-parse, stream
 * Downstream: Document services, PDF controllers, batch processing, medical records
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, pdf-lib 1.17.x, pdf-parse 1.1.x
 * Exports: 42 utility functions for merging PDFs, splitting by page/size/bookmarks, extracting pages, rotating, reordering, batch operations
 *
 * LLM Context: Production-grade PDF manipulation utilities for White Cross healthcare platform.
 * Provides PDF merging (combine multiple files), interleaving pages, splitting by various strategies
 * (page count, file size, bookmarks), extracting page ranges, rotating pages, reordering, batch operations,
 * and HIPAA-compliant document assembly. Essential for medical records consolidation, report generation,
 * and document workflow automation.
 */
import { Sequelize } from 'sequelize';
/**
 * PDF merge configuration
 */
export interface MergeConfig {
    documents: Buffer[] | string[];
    preserveBookmarks?: boolean;
    preserveMetadata?: boolean;
    addPageLabels?: boolean;
    addTableOfContents?: boolean;
    insertBlankPages?: boolean;
    removeBlankPages?: boolean;
    optimizeSize?: boolean;
}
/**
 * PDF split configuration
 */
export interface SplitConfig {
    strategy: 'page-count' | 'file-size' | 'bookmark' | 'range' | 'blank-pages';
    pageCount?: number;
    maxFileSize?: number;
    bookmarkLevel?: number;
    ranges?: PageRange[];
    outputNaming?: string;
    preserveMetadata?: boolean;
}
/**
 * Page range specification
 */
export interface PageRange {
    start: number;
    end: number;
    label?: string;
}
/**
 * Page extraction options
 */
export interface ExtractionOptions {
    pages: number[] | PageRange[];
    preserveBookmarks?: boolean;
    preserveAnnotations?: boolean;
    preserveFormFields?: boolean;
    includeMetadata?: boolean;
}
/**
 * Page rotation options
 */
export interface RotationOptions {
    angle: 90 | 180 | 270 | -90 | -180 | -270;
    pages: number[] | 'all' | 'odd' | 'even';
    preserveAspectRatio?: boolean;
}
/**
 * Page reorder specification
 */
export interface ReorderSpec {
    fromPage: number;
    toPage: number;
    newPosition: number;
}
/**
 * Interleave configuration
 */
export interface InterleaveConfig {
    documents: Buffer[];
    pattern?: number[];
    skipBlankPages?: boolean;
    addSeparators?: boolean;
}
/**
 * Split result
 */
export interface SplitResult {
    documents: Buffer[];
    metadata: SplitMetadata[];
    totalPages: number;
    totalDocuments: number;
}
/**
 * Split metadata
 */
export interface SplitMetadata {
    documentIndex: number;
    startPage: number;
    endPage: number;
    pageCount: number;
    fileSize: number;
    label?: string;
    bookmarkTitle?: string;
}
/**
 * Merge job configuration
 */
export interface MergeJob {
    jobId: string;
    documentIds: string[];
    configuration: MergeConfig;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    outputDocumentId?: string;
    totalInputPages: number;
    processedPages: number;
    startedAt?: Date;
    completedAt?: Date;
    error?: string;
}
/**
 * Split job configuration
 */
export interface SplitJob {
    jobId: string;
    sourceDocumentId: string;
    configuration: SplitConfig;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    outputDocumentIds: string[];
    totalPages: number;
    outputDocuments: number;
    startedAt?: Date;
    completedAt?: Date;
    error?: string;
}
/**
 * Page info
 */
export interface PageInfo {
    pageNumber: number;
    width: number;
    height: number;
    rotation: number;
    isBlank?: boolean;
    hasAnnotations?: boolean;
    hasFormFields?: boolean;
    textContent?: string;
}
/**
 * Document assembly configuration
 */
export interface AssemblyConfig {
    sections: DocumentSection[];
    addCoverPage?: boolean;
    addTableOfContents?: boolean;
    addPageNumbers?: boolean;
    addBookmarks?: boolean;
    optimizeOutput?: boolean;
}
/**
 * Document section
 */
export interface DocumentSection {
    source: Buffer | string;
    pages?: number[] | PageRange;
    title?: string;
    insertBlankPageAfter?: boolean;
    rotate?: number;
}
/**
 * Bookmark entry
 */
export interface BookmarkEntry {
    title: string;
    pageNumber: number;
    level: number;
    children?: BookmarkEntry[];
}
/**
 * Document merge model attributes interface
 */
export interface DocumentMergeAttributes {
    id: string;
    jobId: string;
    name: string;
    sourceDocumentIds: string[];
    outputDocumentId?: string;
    totalInputPages: number;
    totalInputSize: number;
    outputPages?: number;
    outputSize?: number;
    configuration: Record<string, any>;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress: number;
    startedAt?: Date;
    completedAt?: Date;
    error?: string;
    createdBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Document split model attributes interface
 */
export interface DocumentSplitAttributes {
    id: string;
    jobId: string;
    sourceDocumentId: string;
    outputDocumentIds: string[];
    splitStrategy: string;
    totalPages: number;
    outputDocuments: number;
    configuration: Record<string, any>;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress: number;
    startedAt?: Date;
    completedAt?: Date;
    error?: string;
    createdBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Page extraction model attributes interface
 */
export interface PageExtractionAttributes {
    id: string;
    sourceDocumentId: string;
    outputDocumentId?: string;
    extractedPages: string;
    pageCount: number;
    extractionOptions: Record<string, any>;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    createdBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates DocumentMerge model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<DocumentMergeAttributes>>} DocumentMerge model
 *
 * @example
 * ```typescript
 * const MergeModel = createDocumentMergeModel(sequelize);
 * const merge = await MergeModel.create({
 *   jobId: 'merge-job-123',
 *   name: 'Patient Records Consolidation',
 *   sourceDocumentIds: ['doc-1', 'doc-2', 'doc-3'],
 *   totalInputPages: 45,
 *   totalInputSize: 5242880,
 *   configuration: { preserveBookmarks: true },
 *   status: 'pending'
 * });
 * ```
 */
export declare const createDocumentMergeModel: (sequelize: Sequelize) => any;
/**
 * Creates DocumentSplit model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<DocumentSplitAttributes>>} DocumentSplit model
 *
 * @example
 * ```typescript
 * const SplitModel = createDocumentSplitModel(sequelize);
 * const split = await SplitModel.create({
 *   jobId: 'split-job-456',
 *   sourceDocumentId: 'doc-large',
 *   splitStrategy: 'page-count',
 *   totalPages: 100,
 *   configuration: { pageCount: 10 },
 *   status: 'pending'
 * });
 * ```
 */
export declare const createDocumentSplitModel: (sequelize: Sequelize) => any;
/**
 * Creates PageExtraction model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<PageExtractionAttributes>>} PageExtraction model
 *
 * @example
 * ```typescript
 * const ExtractionModel = createPageExtractionModel(sequelize);
 * const extraction = await ExtractionModel.create({
 *   sourceDocumentId: 'doc-123',
 *   extractedPages: '[1,3,5,7]',
 *   pageCount: 4,
 *   extractionOptions: { preserveBookmarks: true },
 *   status: 'completed'
 * });
 * ```
 */
export declare const createPageExtractionModel: (sequelize: Sequelize) => any;
/**
 * 1. Merges multiple PDF documents into single document.
 *
 * @param {Buffer[]} pdfBuffers - Array of PDF buffers to merge
 * @param {Partial<MergeConfig>} [config] - Merge configuration
 * @returns {Promise<Buffer>} Merged PDF buffer
 *
 * @example
 * ```typescript
 * const merged = await mergePDFs([pdf1, pdf2, pdf3], {
 *   preserveBookmarks: true,
 *   preserveMetadata: true,
 *   addTableOfContents: true
 * });
 * ```
 */
export declare const mergePDFs: (pdfBuffers: Buffer[], config?: Partial<MergeConfig>) => Promise<Buffer>;
/**
 * 2. Merges PDFs with custom page ordering.
 *
 * @param {Array<{buffer: Buffer, pages?: number[]}>} documents - Documents with optional page selection
 * @returns {Promise<Buffer>} Merged PDF with specified pages
 *
 * @example
 * ```typescript
 * const merged = await mergePDFsWithPageSelection([
 *   { buffer: pdf1, pages: [1, 2, 5] },
 *   { buffer: pdf2, pages: [3, 4] },
 *   { buffer: pdf3 }
 * ]);
 * ```
 */
export declare const mergePDFsWithPageSelection: (documents: Array<{
    buffer: Buffer;
    pages?: number[];
}>) => Promise<Buffer>;
/**
 * 3. Merges PDFs in sequential order.
 *
 * @param {Buffer[]} pdfBuffers - PDFs to merge in order
 * @returns {Promise<Buffer>} Sequentially merged PDF
 *
 * @example
 * ```typescript
 * const merged = await mergeSequentially([coverPage, content, appendix]);
 * ```
 */
export declare const mergeSequentially: (pdfBuffers: Buffer[]) => Promise<Buffer>;
/**
 * 4. Interleaves pages from multiple PDFs.
 *
 * @param {InterleaveConfig} config - Interleave configuration
 * @returns {Promise<Buffer>} Interleaved PDF
 *
 * @example
 * ```typescript
 * const interleaved = await interleavePDFs({
 *   documents: [frontPages, backPages],
 *   pattern: [1, 2], // Take 1 page from first, then 1 from second, repeat
 *   skipBlankPages: true
 * });
 * ```
 */
export declare const interleavePDFs: (config: InterleaveConfig) => Promise<Buffer>;
/**
 * 5. Merges PDFs with separator pages between documents.
 *
 * @param {Buffer[]} pdfBuffers - PDFs to merge
 * @param {Buffer} separatorPage - Separator page to insert
 * @returns {Promise<Buffer>} Merged PDF with separators
 *
 * @example
 * ```typescript
 * const merged = await mergePDFsWithSeparators(
 *   [report1, report2, report3],
 *   blankSeparatorPage
 * );
 * ```
 */
export declare const mergePDFsWithSeparators: (pdfBuffers: Buffer[], separatorPage: Buffer) => Promise<Buffer>;
/**
 * 6. Appends one PDF to another.
 *
 * @param {Buffer} basePdf - Base PDF document
 * @param {Buffer} appendPdf - PDF to append
 * @returns {Promise<Buffer>} Combined PDF
 *
 * @example
 * ```typescript
 * const combined = await appendPDF(mainDocument, additionalPages);
 * ```
 */
export declare const appendPDF: (basePdf: Buffer, appendPdf: Buffer) => Promise<Buffer>;
/**
 * 7. Prepends one PDF to another.
 *
 * @param {Buffer} basePdf - Base PDF document
 * @param {Buffer} prependPdf - PDF to prepend
 * @returns {Promise<Buffer>} Combined PDF
 *
 * @example
 * ```typescript
 * const combined = await prependPDF(mainDocument, coverPage);
 * ```
 */
export declare const prependPDF: (basePdf: Buffer, prependPdf: Buffer) => Promise<Buffer>;
/**
 * 8. Inserts PDF at specific position.
 *
 * @param {Buffer} basePdf - Base PDF document
 * @param {Buffer} insertPdf - PDF to insert
 * @param {number} afterPage - Insert after this page number
 * @returns {Promise<Buffer>} Combined PDF
 *
 * @example
 * ```typescript
 * const combined = await insertPDFAtPosition(document, newPages, 5);
 * // Inserts newPages after page 5
 * ```
 */
export declare const insertPDFAtPosition: (basePdf: Buffer, insertPdf: Buffer, afterPage: number) => Promise<Buffer>;
/**
 * 9. Splits PDF by page count.
 *
 * @param {Buffer} pdfBuffer - PDF to split
 * @param {number} pagesPerDocument - Pages per output document
 * @returns {Promise<SplitResult>} Split result with document buffers
 *
 * @example
 * ```typescript
 * const result = await splitPDFByPageCount(largePdf, 10);
 * // Splits into documents of 10 pages each
 * console.log(`Created ${result.totalDocuments} documents`);
 * ```
 */
export declare const splitPDFByPageCount: (pdfBuffer: Buffer, pagesPerDocument: number) => Promise<SplitResult>;
/**
 * 10. Splits PDF by file size.
 *
 * @param {Buffer} pdfBuffer - PDF to split
 * @param {number} maxSizeBytes - Maximum size per document
 * @returns {Promise<SplitResult>} Split result
 *
 * @example
 * ```typescript
 * const result = await splitPDFBySize(largePdf, 5 * 1024 * 1024); // 5MB max
 * ```
 */
export declare const splitPDFBySize: (pdfBuffer: Buffer, maxSizeBytes: number) => Promise<SplitResult>;
/**
 * 11. Splits PDF by bookmarks/outline.
 *
 * @param {Buffer} pdfBuffer - PDF to split
 * @param {number} [bookmarkLevel] - Bookmark level to split on (default: 1)
 * @returns {Promise<SplitResult>} Split result with metadata
 *
 * @example
 * ```typescript
 * const result = await splitPDFByBookmarks(document, 1);
 * // Splits at each top-level bookmark
 * ```
 */
export declare const splitPDFByBookmarks: (pdfBuffer: Buffer, bookmarkLevel?: number) => Promise<SplitResult>;
/**
 * 12. Splits PDF into single-page documents.
 *
 * @param {Buffer} pdfBuffer - PDF to split
 * @returns {Promise<Buffer[]>} Array of single-page PDFs
 *
 * @example
 * ```typescript
 * const pages = await splitPDFIntoPages(document);
 * console.log(`Extracted ${pages.length} individual pages`);
 * ```
 */
export declare const splitPDFIntoPages: (pdfBuffer: Buffer) => Promise<Buffer[]>;
/**
 * 13. Splits PDF at specific page numbers.
 *
 * @param {Buffer} pdfBuffer - PDF to split
 * @param {number[]} splitPoints - Page numbers where to split
 * @returns {Promise<SplitResult>} Split result
 *
 * @example
 * ```typescript
 * const result = await splitPDFAtPages(document, [5, 10, 15]);
 * // Creates documents: pages 1-5, 6-10, 11-15, 16-end
 * ```
 */
export declare const splitPDFAtPages: (pdfBuffer: Buffer, splitPoints: number[]) => Promise<SplitResult>;
/**
 * 14. Splits PDF by page ranges.
 *
 * @param {Buffer} pdfBuffer - PDF to split
 * @param {PageRange[]} ranges - Page ranges to extract
 * @returns {Promise<Buffer[]>} Array of PDFs for each range
 *
 * @example
 * ```typescript
 * const docs = await splitPDFByRanges(document, [
 *   { start: 1, end: 5, label: 'Introduction' },
 *   { start: 6, end: 20, label: 'Main Content' },
 *   { start: 21, end: 25, label: 'Conclusion' }
 * ]);
 * ```
 */
export declare const splitPDFByRanges: (pdfBuffer: Buffer, ranges: PageRange[]) => Promise<Buffer[]>;
/**
 * 15. Splits PDF into odd and even pages.
 *
 * @param {Buffer} pdfBuffer - PDF to split
 * @returns {Promise<{odd: Buffer, even: Buffer}>} Odd and even page PDFs
 *
 * @example
 * ```typescript
 * const { odd, even } = await splitPDFOddEven(scannedDocument);
 * // Useful for duplex scanning
 * ```
 */
export declare const splitPDFOddEven: (pdfBuffer: Buffer) => Promise<{
    odd: Buffer;
    even: Buffer;
}>;
/**
 * 16. Splits PDF removing blank pages.
 *
 * @param {Buffer} pdfBuffer - PDF to process
 * @returns {Promise<SplitResult>} Non-blank pages split result
 *
 * @example
 * ```typescript
 * const result = await splitPDFRemovingBlankPages(scannedDocument);
 * // Automatically detects and removes blank pages
 * ```
 */
export declare const splitPDFRemovingBlankPages: (pdfBuffer: Buffer) => Promise<SplitResult>;
/**
 * 17. Extracts specific pages from PDF.
 *
 * @param {Buffer} pdfBuffer - Source PDF
 * @param {number[]} pageNumbers - Page numbers to extract
 * @param {Partial<ExtractionOptions>} [options] - Extraction options
 * @returns {Promise<Buffer>} PDF with extracted pages
 *
 * @example
 * ```typescript
 * const extracted = await extractPages(document, [1, 3, 5, 7], {
 *   preserveBookmarks: true,
 *   preserveAnnotations: true
 * });
 * ```
 */
export declare const extractPages: (pdfBuffer: Buffer, pageNumbers: number[], options?: Partial<ExtractionOptions>) => Promise<Buffer>;
/**
 * 18. Extracts page range from PDF.
 *
 * @param {Buffer} pdfBuffer - Source PDF
 * @param {number} startPage - Start page number
 * @param {number} endPage - End page number
 * @returns {Promise<Buffer>} Extracted page range
 *
 * @example
 * ```typescript
 * const chapter = await extractPageRange(book, 10, 25);
 * // Extracts pages 10-25
 * ```
 */
export declare const extractPageRange: (pdfBuffer: Buffer, startPage: number, endPage: number) => Promise<Buffer>;
/**
 * 19. Extracts first N pages from PDF.
 *
 * @param {Buffer} pdfBuffer - Source PDF
 * @param {number} count - Number of pages to extract
 * @returns {Promise<Buffer>} First N pages
 *
 * @example
 * ```typescript
 * const preview = await extractFirstPages(document, 3);
 * // Extracts first 3 pages for preview
 * ```
 */
export declare const extractFirstPages: (pdfBuffer: Buffer, count: number) => Promise<Buffer>;
/**
 * 20. Extracts last N pages from PDF.
 *
 * @param {Buffer} pdfBuffer - Source PDF
 * @param {number} count - Number of pages to extract
 * @returns {Promise<Buffer>} Last N pages
 *
 * @example
 * ```typescript
 * const appendix = await extractLastPages(document, 5);
 * // Extracts last 5 pages
 * ```
 */
export declare const extractLastPages: (pdfBuffer: Buffer, count: number) => Promise<Buffer>;
/**
 * 21. Extracts odd pages from PDF.
 *
 * @param {Buffer} pdfBuffer - Source PDF
 * @returns {Promise<Buffer>} Odd-numbered pages
 *
 * @example
 * ```typescript
 * const oddPages = await extractOddPages(document);
 * // Extracts pages 1, 3, 5, 7, etc.
 * ```
 */
export declare const extractOddPages: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 22. Extracts even pages from PDF.
 *
 * @param {Buffer} pdfBuffer - Source PDF
 * @returns {Promise<Buffer>} Even-numbered pages
 *
 * @example
 * ```typescript
 * const evenPages = await extractEvenPages(document);
 * // Extracts pages 2, 4, 6, 8, etc.
 * ```
 */
export declare const extractEvenPages: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 23. Extracts pages matching search criteria.
 *
 * @param {Buffer} pdfBuffer - Source PDF
 * @param {string} searchText - Text to search for
 * @returns {Promise<Buffer>} Pages containing search text
 *
 * @example
 * ```typescript
 * const relevantPages = await extractPagesByText(document, 'patient summary');
 * // Extracts only pages containing "patient summary"
 * ```
 */
export declare const extractPagesByText: (pdfBuffer: Buffer, searchText: string) => Promise<Buffer>;
/**
 * 24. Extracts pages with annotations.
 *
 * @param {Buffer} pdfBuffer - Source PDF
 * @returns {Promise<Buffer>} Pages containing annotations
 *
 * @example
 * ```typescript
 * const annotated = await extractPagesWithAnnotations(reviewedDocument);
 * // Extracts only pages that have been annotated
 * ```
 */
export declare const extractPagesWithAnnotations: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 25. Rotates pages in PDF.
 *
 * @param {Buffer} pdfBuffer - PDF to rotate
 * @param {RotationOptions} options - Rotation configuration
 * @returns {Promise<Buffer>} Rotated PDF
 *
 * @example
 * ```typescript
 * const rotated = await rotatePages(document, {
 *   angle: 90,
 *   pages: [1, 3, 5]
 * });
 * ```
 */
export declare const rotatePages: (pdfBuffer: Buffer, options: RotationOptions) => Promise<Buffer>;
/**
 * 26. Rotates all pages by specified angle.
 *
 * @param {Buffer} pdfBuffer - PDF to rotate
 * @param {90 | 180 | 270} angle - Rotation angle
 * @returns {Promise<Buffer>} Rotated PDF
 *
 * @example
 * ```typescript
 * const rotated = await rotateAllPages(document, 90);
 * // Rotates all pages 90 degrees clockwise
 * ```
 */
export declare const rotateAllPages: (pdfBuffer: Buffer, angle: 90 | 180 | 270) => Promise<Buffer>;
/**
 * 27. Rotates specific page by angle.
 *
 * @param {Buffer} pdfBuffer - PDF to modify
 * @param {number} pageNumber - Page number to rotate
 * @param {90 | 180 | 270} angle - Rotation angle
 * @returns {Promise<Buffer>} PDF with rotated page
 *
 * @example
 * ```typescript
 * const rotated = await rotatePage(document, 5, 180);
 * // Rotates only page 5 by 180 degrees
 * ```
 */
export declare const rotatePage: (pdfBuffer: Buffer, pageNumber: number, angle: 90 | 180 | 270) => Promise<Buffer>;
/**
 * 28. Auto-rotates pages to correct orientation.
 *
 * @param {Buffer} pdfBuffer - PDF to auto-rotate
 * @returns {Promise<Buffer>} Auto-rotated PDF
 *
 * @example
 * ```typescript
 * const corrected = await autoRotatePages(scannedDocument);
 * // Automatically detects and corrects page orientation
 * ```
 */
export declare const autoRotatePages: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 29. Reorders pages in PDF.
 *
 * @param {Buffer} pdfBuffer - PDF to reorder
 * @param {number[]} newOrder - New page order (1-indexed)
 * @returns {Promise<Buffer>} Reordered PDF
 *
 * @example
 * ```typescript
 * const reordered = await reorderPages(document, [3, 1, 2, 4, 5]);
 * // Moves page 3 to first position
 * ```
 */
export declare const reorderPages: (pdfBuffer: Buffer, newOrder: number[]) => Promise<Buffer>;
/**
 * 30. Reverses page order in PDF.
 *
 * @param {Buffer} pdfBuffer - PDF to reverse
 * @returns {Promise<Buffer>} Reversed PDF
 *
 * @example
 * ```typescript
 * const reversed = await reversePages(document);
 * // Last page becomes first, etc.
 * ```
 */
export declare const reversePages: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 31. Moves page to new position.
 *
 * @param {Buffer} pdfBuffer - PDF to modify
 * @param {number} fromPage - Page to move
 * @param {number} toPosition - New position
 * @returns {Promise<Buffer>} Modified PDF
 *
 * @example
 * ```typescript
 * const moved = await movePage(document, 10, 3);
 * // Moves page 10 to position 3
 * ```
 */
export declare const movePage: (pdfBuffer: Buffer, fromPage: number, toPosition: number) => Promise<Buffer>;
/**
 * 32. Swaps two pages in PDF.
 *
 * @param {Buffer} pdfBuffer - PDF to modify
 * @param {number} page1 - First page number
 * @param {number} page2 - Second page number
 * @returns {Promise<Buffer>} Modified PDF
 *
 * @example
 * ```typescript
 * const swapped = await swapPages(document, 5, 10);
 * // Swaps positions of pages 5 and 10
 * ```
 */
export declare const swapPages: (pdfBuffer: Buffer, page1: number, page2: number) => Promise<Buffer>;
/**
 * 33. Duplicates specific pages in PDF.
 *
 * @param {Buffer} pdfBuffer - PDF to modify
 * @param {number} pageNumber - Page to duplicate
 * @param {number} [count] - Number of duplicates
 * @returns {Promise<Buffer>} PDF with duplicated pages
 *
 * @example
 * ```typescript
 * const duplicated = await duplicatePage(document, 1, 3);
 * // Duplicates page 1 three times
 * ```
 */
export declare const duplicatePage: (pdfBuffer: Buffer, pageNumber: number, count?: number) => Promise<Buffer>;
/**
 * 34. Deletes specific pages from PDF.
 *
 * @param {Buffer} pdfBuffer - PDF to modify
 * @param {number[]} pageNumbers - Pages to delete
 * @returns {Promise<Buffer>} PDF with pages removed
 *
 * @example
 * ```typescript
 * const cleaned = await deletePages(document, [2, 4, 6]);
 * // Removes pages 2, 4, and 6
 * ```
 */
export declare const deletePages: (pdfBuffer: Buffer, pageNumbers: number[]) => Promise<Buffer>;
/**
 * 35. Deletes page range from PDF.
 *
 * @param {Buffer} pdfBuffer - PDF to modify
 * @param {number} startPage - Start of range
 * @param {number} endPage - End of range
 * @returns {Promise<Buffer>} PDF with range removed
 *
 * @example
 * ```typescript
 * const cleaned = await deletePageRange(document, 5, 10);
 * // Removes pages 5 through 10
 * ```
 */
export declare const deletePageRange: (pdfBuffer: Buffer, startPage: number, endPage: number) => Promise<Buffer>;
/**
 * 36. Removes blank pages from PDF.
 *
 * @param {Buffer} pdfBuffer - PDF to clean
 * @param {number} [threshold] - Blank detection threshold
 * @returns {Promise<Buffer>} PDF with blank pages removed
 *
 * @example
 * ```typescript
 * const cleaned = await removeBlankPages(scannedDocument, 0.95);
 * // Removes pages that are 95% blank
 * ```
 */
export declare const removeBlankPages: (pdfBuffer: Buffer, threshold?: number) => Promise<Buffer>;
/**
 * 37. Removes duplicate pages from PDF.
 *
 * @param {Buffer} pdfBuffer - PDF to clean
 * @returns {Promise<Buffer>} PDF with duplicates removed
 *
 * @example
 * ```typescript
 * const deduped = await removeDuplicatePages(document);
 * // Removes exact duplicate pages
 * ```
 */
export declare const removeDuplicatePages: (pdfBuffer: Buffer) => Promise<Buffer>;
/**
 * 38. Assembles document from multiple sections.
 *
 * @param {AssemblyConfig} config - Assembly configuration
 * @returns {Promise<Buffer>} Assembled PDF document
 *
 * @example
 * ```typescript
 * const assembled = await assembleDocument({
 *   sections: [
 *     { source: coverPage, title: 'Cover' },
 *     { source: intro, pages: [1, 2, 3], title: 'Introduction' },
 *     { source: mainContent, title: 'Main Content' },
 *     { source: appendix, title: 'Appendix' }
 *   ],
 *   addTableOfContents: true,
 *   addPageNumbers: true,
 *   addBookmarks: true
 * });
 * ```
 */
export declare const assembleDocument: (config: AssemblyConfig) => Promise<Buffer>;
/**
 * 39. Creates table of contents for PDF.
 *
 * @param {Buffer} pdfBuffer - PDF document
 * @param {BookmarkEntry[]} bookmarks - Bookmark structure
 * @returns {Promise<Buffer>} PDF with TOC
 *
 * @example
 * ```typescript
 * const withTOC = await createTableOfContents(document, [
 *   { title: 'Chapter 1', pageNumber: 1, level: 1 },
 *   { title: 'Section 1.1', pageNumber: 3, level: 2 },
 *   { title: 'Chapter 2', pageNumber: 10, level: 1 }
 * ]);
 * ```
 */
export declare const createTableOfContents: (pdfBuffer: Buffer, bookmarks: BookmarkEntry[]) => Promise<Buffer>;
/**
 * 40. Adds bookmarks to PDF.
 *
 * @param {Buffer} pdfBuffer - PDF document
 * @param {BookmarkEntry[]} bookmarks - Bookmarks to add
 * @returns {Promise<Buffer>} PDF with bookmarks
 *
 * @example
 * ```typescript
 * const bookmarked = await addBookmarks(document, [
 *   { title: 'Introduction', pageNumber: 1, level: 1 },
 *   { title: 'Methods', pageNumber: 5, level: 1 },
 *   { title: 'Results', pageNumber: 10, level: 1 }
 * ]);
 * ```
 */
export declare const addBookmarks: (pdfBuffer: Buffer, bookmarks: BookmarkEntry[]) => Promise<Buffer>;
/**
 * 41. Gets page count from PDF.
 *
 * @param {Buffer} pdfBuffer - PDF document
 * @returns {Promise<number>} Number of pages
 *
 * @example
 * ```typescript
 * const pageCount = await getPageCount(document);
 * console.log(`Document has ${pageCount} pages`);
 * ```
 */
export declare const getPageCount: (pdfBuffer: Buffer) => Promise<number>;
/**
 * 42. Gets detailed page information.
 *
 * @param {Buffer} pdfBuffer - PDF document
 * @param {number} [pageNumber] - Specific page (optional)
 * @returns {Promise<PageInfo[]>} Page information
 *
 * @example
 * ```typescript
 * const pageInfo = await getPageInfo(document, 5);
 * console.log(`Page 5: ${pageInfo[0].width}x${pageInfo[0].height}`);
 * console.log(`Rotation: ${pageInfo[0].rotation} degrees`);
 * console.log(`Has annotations: ${pageInfo[0].hasAnnotations}`);
 * ```
 */
export declare const getPageInfo: (pdfBuffer: Buffer, pageNumber?: number) => Promise<PageInfo[]>;
declare const _default: {
    mergePDFs: (pdfBuffers: Buffer[], config?: Partial<MergeConfig>) => Promise<Buffer>;
    mergePDFsWithPageSelection: (documents: Array<{
        buffer: Buffer;
        pages?: number[];
    }>) => Promise<Buffer>;
    mergeSequentially: (pdfBuffers: Buffer[]) => Promise<Buffer>;
    interleavePDFs: (config: InterleaveConfig) => Promise<Buffer>;
    mergePDFsWithSeparators: (pdfBuffers: Buffer[], separatorPage: Buffer) => Promise<Buffer>;
    appendPDF: (basePdf: Buffer, appendPdf: Buffer) => Promise<Buffer>;
    prependPDF: (basePdf: Buffer, prependPdf: Buffer) => Promise<Buffer>;
    insertPDFAtPosition: (basePdf: Buffer, insertPdf: Buffer, afterPage: number) => Promise<Buffer>;
    splitPDFByPageCount: (pdfBuffer: Buffer, pagesPerDocument: number) => Promise<SplitResult>;
    splitPDFBySize: (pdfBuffer: Buffer, maxSizeBytes: number) => Promise<SplitResult>;
    splitPDFByBookmarks: (pdfBuffer: Buffer, bookmarkLevel?: number) => Promise<SplitResult>;
    splitPDFIntoPages: (pdfBuffer: Buffer) => Promise<Buffer[]>;
    splitPDFAtPages: (pdfBuffer: Buffer, splitPoints: number[]) => Promise<SplitResult>;
    splitPDFByRanges: (pdfBuffer: Buffer, ranges: PageRange[]) => Promise<Buffer[]>;
    splitPDFOddEven: (pdfBuffer: Buffer) => Promise<{
        odd: Buffer;
        even: Buffer;
    }>;
    splitPDFRemovingBlankPages: (pdfBuffer: Buffer) => Promise<SplitResult>;
    extractPages: (pdfBuffer: Buffer, pageNumbers: number[], options?: Partial<ExtractionOptions>) => Promise<Buffer>;
    extractPageRange: (pdfBuffer: Buffer, startPage: number, endPage: number) => Promise<Buffer>;
    extractFirstPages: (pdfBuffer: Buffer, count: number) => Promise<Buffer>;
    extractLastPages: (pdfBuffer: Buffer, count: number) => Promise<Buffer>;
    extractOddPages: (pdfBuffer: Buffer) => Promise<Buffer>;
    extractEvenPages: (pdfBuffer: Buffer) => Promise<Buffer>;
    extractPagesByText: (pdfBuffer: Buffer, searchText: string) => Promise<Buffer>;
    extractPagesWithAnnotations: (pdfBuffer: Buffer) => Promise<Buffer>;
    rotatePages: (pdfBuffer: Buffer, options: RotationOptions) => Promise<Buffer>;
    rotateAllPages: (pdfBuffer: Buffer, angle: 90 | 180 | 270) => Promise<Buffer>;
    rotatePage: (pdfBuffer: Buffer, pageNumber: number, angle: 90 | 180 | 270) => Promise<Buffer>;
    autoRotatePages: (pdfBuffer: Buffer) => Promise<Buffer>;
    reorderPages: (pdfBuffer: Buffer, newOrder: number[]) => Promise<Buffer>;
    reversePages: (pdfBuffer: Buffer) => Promise<Buffer>;
    movePage: (pdfBuffer: Buffer, fromPage: number, toPosition: number) => Promise<Buffer>;
    swapPages: (pdfBuffer: Buffer, page1: number, page2: number) => Promise<Buffer>;
    duplicatePage: (pdfBuffer: Buffer, pageNumber: number, count?: number) => Promise<Buffer>;
    deletePages: (pdfBuffer: Buffer, pageNumbers: number[]) => Promise<Buffer>;
    deletePageRange: (pdfBuffer: Buffer, startPage: number, endPage: number) => Promise<Buffer>;
    removeBlankPages: (pdfBuffer: Buffer, threshold?: number) => Promise<Buffer>;
    removeDuplicatePages: (pdfBuffer: Buffer) => Promise<Buffer>;
    assembleDocument: (config: AssemblyConfig) => Promise<Buffer>;
    createTableOfContents: (pdfBuffer: Buffer, bookmarks: BookmarkEntry[]) => Promise<Buffer>;
    addBookmarks: (pdfBuffer: Buffer, bookmarks: BookmarkEntry[]) => Promise<Buffer>;
    getPageCount: (pdfBuffer: Buffer) => Promise<number>;
    getPageInfo: (pdfBuffer: Buffer, pageNumber?: number) => Promise<PageInfo[]>;
    createDocumentMergeModel: (sequelize: Sequelize) => any;
    createDocumentSplitModel: (sequelize: Sequelize) => any;
    createPageExtractionModel: (sequelize: Sequelize) => any;
};
export default _default;
//# sourceMappingURL=document-merge-split-kit.d.ts.map