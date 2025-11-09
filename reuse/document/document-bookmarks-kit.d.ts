/**
 * LOC: DOC-BMK-001
 * File: /reuse/document/document-bookmarks-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - sequelize (v6.x)
 *   - pdf-lib
 *   - pdfkit
 *
 * DOWNSTREAM (imported by):
 *   - Document navigation services
 *   - PDF generation controllers
 *   - TOC generation modules
 *   - Document outline services
 */
/**
 * File: /reuse/document/document-bookmarks-kit.ts
 * Locator: WC-UTL-DOCBMK-001
 * Purpose: Document Bookmarks & Navigation Kit - Comprehensive bookmark utilities for NestJS
 *
 * Upstream: @nestjs/common, @nestjs/config, sequelize, pdf-lib, pdfkit
 * Downstream: Navigation services, PDF controllers, TOC modules, outline services
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, pdf-lib 1.17.x, PDFKit 0.14.x
 * Exports: 38 utility functions for bookmark creation, hierarchy, TOC generation, named destinations, links
 *
 * LLM Context: Production-grade document bookmark and navigation utilities for White Cross healthcare platform.
 * Provides bookmark creation and management, hierarchical outline structures, table of contents generation,
 * named destinations, internal/external links, bookmark import/export, document navigation, cross-references,
 * and HIPAA-compliant navigation tracking. Essential for medical document navigation, research papers,
 * patient records, and complex healthcare documentation requiring structured navigation.
 */
import { Sequelize } from 'sequelize';
/**
 * Document bookmark configuration from environment
 */
export interface BookmarkConfigEnv {
    MAX_BOOKMARK_DEPTH: string;
    DEFAULT_BOOKMARK_COLOR: string;
    ENABLE_AUTO_BOOKMARKS: string;
    AUTO_BOOKMARK_HEADINGS: string;
    TOC_FONT_SIZE: string;
    TOC_INDENT_SIZE: string;
    ENABLE_NAMED_DESTINATIONS: string;
    BOOKMARK_CACHE_TTL: string;
    MAX_BOOKMARKS_PER_DOCUMENT: string;
    ENABLE_BOOKMARK_ICONS: string;
}
/**
 * Loads bookmark configuration from environment variables.
 *
 * @returns {BookmarkConfig} Bookmark configuration object
 *
 * @example
 * ```typescript
 * const config = loadBookmarkConfig();
 * console.log('Max depth:', config.maxBookmarkDepth);
 * ```
 */
export declare const loadBookmarkConfig: () => BookmarkConfig;
/**
 * Validates bookmark configuration.
 *
 * @param {BookmarkConfig} config - Configuration to validate
 * @returns {string[]} Array of validation errors (empty if valid)
 *
 * @example
 * ```typescript
 * const errors = validateBookmarkConfig(config);
 * if (errors.length > 0) {
 *   throw new Error(`Invalid config: ${errors.join(', ')}`);
 * }
 * ```
 */
export declare const validateBookmarkConfig: (config: BookmarkConfig) => string[];
/**
 * Bookmark configuration
 */
export interface BookmarkConfig {
    maxBookmarkDepth: number;
    defaultBookmarkColor: string;
    enableAutoBookmarks: boolean;
    autoBookmarkHeadings: string[];
    tocFontSize: number;
    tocIndentSize: number;
    enableNamedDestinations: boolean;
    bookmarkCacheTTL: number;
    maxBookmarksPerDocument: number;
    enableBookmarkIcons: boolean;
}
/**
 * Bookmark interface
 */
export interface Bookmark {
    id: string;
    title: string;
    pageNumber: number;
    level: number;
    parentId?: string;
    children?: Bookmark[];
    destinationType?: 'page' | 'named' | 'url';
    destination?: string | number;
    color?: string;
    style?: 'normal' | 'bold' | 'italic' | 'bold-italic';
    open?: boolean;
    action?: BookmarkAction;
    metadata?: Record<string, any>;
}
/**
 * Bookmark action
 */
export interface BookmarkAction {
    type: 'goto' | 'uri' | 'javascript' | 'launch';
    target: string | number;
    newWindow?: boolean;
    parameters?: Record<string, any>;
}
/**
 * Bookmark tree node
 */
export interface BookmarkNode {
    bookmark: Bookmark;
    children: BookmarkNode[];
    parent?: BookmarkNode;
}
/**
 * Table of contents entry
 */
export interface TOCEntry {
    id: string;
    title: string;
    level: number;
    pageNumber: number;
    children?: TOCEntry[];
    indent?: number;
    fontSize?: number;
    style?: 'normal' | 'bold' | 'italic';
}
/**
 * Table of contents configuration
 */
export interface TOCConfig {
    title: string;
    includePageNumbers: boolean;
    maxDepth?: number;
    fontFamily?: string;
    fontSize?: number;
    indentSize?: number;
    dotLeader?: boolean;
    includeLinks?: boolean;
    startPage?: number;
}
/**
 * Named destination
 */
export interface NamedDestination {
    name: string;
    pageNumber: number;
    viewType: 'fit' | 'fitH' | 'fitV' | 'fitR' | 'xyz';
    coordinates?: {
        left?: number;
        top?: number;
        zoom?: number;
        right?: number;
        bottom?: number;
    };
}
/**
 * Document link
 */
export interface DocumentLink {
    id: string;
    sourcePageNumber: number;
    sourceArea: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    linkType: 'internal' | 'external' | 'email' | 'file';
    target: string | number;
    tooltip?: string;
    border?: boolean;
    highlightMode?: 'none' | 'invert' | 'outline' | 'push';
}
/**
 * Bookmark export format
 */
export type BookmarkExportFormat = 'json' | 'xml' | 'csv' | 'pdf-bookmarks';
/**
 * Bookmark import result
 */
export interface BookmarkImportResult {
    success: boolean;
    importedCount: number;
    skippedCount: number;
    errors: string[];
    bookmarks: Bookmark[];
}
/**
 * Document bookmark model attributes
 */
export interface DocumentBookmarkAttributes {
    id: string;
    documentId: string;
    title: string;
    pageNumber: number;
    level: number;
    parentId?: string;
    sortOrder: number;
    destinationType: string;
    destination?: string;
    color?: string;
    style?: string;
    isOpen: boolean;
    actionType?: string;
    actionTarget?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates DocumentBookmark model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<DocumentBookmarkAttributes>>} DocumentBookmark model
 *
 * @example
 * ```typescript
 * const BookmarkModel = createDocumentBookmarkModel(sequelize);
 * const bookmark = await BookmarkModel.create({
 *   documentId: 'doc-123',
 *   title: 'Chapter 1',
 *   pageNumber: 5,
 *   level: 1
 * });
 * ```
 */
export declare const createDocumentBookmarkModel: (sequelize: Sequelize) => any;
/**
 * Named destination model attributes
 */
export interface NamedDestinationAttributes {
    id: string;
    documentId: string;
    name: string;
    pageNumber: number;
    viewType: string;
    coordinates?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates NamedDestination model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<NamedDestinationAttributes>>} NamedDestination model
 *
 * @example
 * ```typescript
 * const DestinationModel = createNamedDestinationModel(sequelize);
 * const dest = await DestinationModel.create({
 *   documentId: 'doc-123',
 *   name: 'ChapterOne',
 *   pageNumber: 5,
 *   viewType: 'fit'
 * });
 * ```
 */
export declare const createNamedDestinationModel: (sequelize: Sequelize) => any;
/**
 * 1. Creates a new bookmark.
 *
 * @param {Partial<Bookmark>} config - Bookmark configuration
 * @returns {Bookmark} Created bookmark
 *
 * @example
 * ```typescript
 * const bookmark = createBookmark({
 *   title: 'Introduction',
 *   pageNumber: 1,
 *   level: 1
 * });
 * ```
 */
export declare const createBookmark: (config: Partial<Bookmark>) => Bookmark;
/**
 * 2. Creates a bookmark with children.
 *
 * @param {Partial<Bookmark>} parent - Parent bookmark configuration
 * @param {Partial<Bookmark>[]} children - Child bookmark configurations
 * @returns {Bookmark} Created bookmark with children
 *
 * @example
 * ```typescript
 * const bookmark = createBookmarkWithChildren(
 *   { title: 'Chapter 1', pageNumber: 1, level: 1 },
 *   [
 *     { title: 'Section 1.1', pageNumber: 2, level: 2 },
 *     { title: 'Section 1.2', pageNumber: 5, level: 2 }
 *   ]
 * );
 * ```
 */
export declare const createBookmarkWithChildren: (parent: Partial<Bookmark>, children: Partial<Bookmark>[]) => Bookmark;
/**
 * 3. Creates bookmarks from headings.
 *
 * @param {Array<{ text: string; level: number; page: number }>} headings - Document headings
 * @returns {Bookmark[]} Array of bookmarks
 *
 * @example
 * ```typescript
 * const bookmarks = createBookmarksFromHeadings([
 *   { text: 'Introduction', level: 1, page: 1 },
 *   { text: 'Background', level: 2, page: 2 },
 *   { text: 'Methodology', level: 1, page: 5 }
 * ]);
 * ```
 */
export declare const createBookmarksFromHeadings: (headings: Array<{
    text: string;
    level: number;
    page: number;
}>) => Bookmark[];
/**
 * 4. Adds bookmark to document.
 *
 * @param {Bookmark[]} bookmarks - Existing bookmarks
 * @param {Bookmark} newBookmark - New bookmark to add
 * @param {string} [parentId] - Parent bookmark ID
 * @returns {Bookmark[]} Updated bookmarks array
 *
 * @example
 * ```typescript
 * const updated = addBookmark(existingBookmarks, newBookmark, 'parent-id');
 * ```
 */
export declare const addBookmark: (bookmarks: Bookmark[], newBookmark: Bookmark, parentId?: string) => Bookmark[];
/**
 * 5. Updates existing bookmark.
 *
 * @param {Bookmark[]} bookmarks - Existing bookmarks
 * @param {string} bookmarkId - Bookmark ID to update
 * @param {Partial<Bookmark>} updates - Updates to apply
 * @returns {Bookmark[]} Updated bookmarks array
 *
 * @example
 * ```typescript
 * const updated = updateBookmark(bookmarks, 'bookmark-123', {
 *   title: 'Updated Title',
 *   pageNumber: 10
 * });
 * ```
 */
export declare const updateBookmark: (bookmarks: Bookmark[], bookmarkId: string, updates: Partial<Bookmark>) => Bookmark[];
/**
 * 6. Removes bookmark from document.
 *
 * @param {Bookmark[]} bookmarks - Existing bookmarks
 * @param {string} bookmarkId - Bookmark ID to remove
 * @returns {Bookmark[]} Updated bookmarks array
 *
 * @example
 * ```typescript
 * const updated = removeBookmark(bookmarks, 'bookmark-123');
 * ```
 */
export declare const removeBookmark: (bookmarks: Bookmark[], bookmarkId: string) => Bookmark[];
/**
 * 7. Builds bookmark tree from flat array.
 *
 * @param {Bookmark[]} bookmarks - Flat array of bookmarks
 * @returns {BookmarkNode[]} Tree structure
 *
 * @example
 * ```typescript
 * const tree = buildBookmarkTree(flatBookmarks);
 * console.log('Root bookmarks:', tree.length);
 * ```
 */
export declare const buildBookmarkTree: (bookmarks: Bookmark[]) => BookmarkNode[];
/**
 * 8. Flattens bookmark tree to array.
 *
 * @param {BookmarkNode[]} tree - Bookmark tree
 * @returns {Bookmark[]} Flat array of bookmarks
 *
 * @example
 * ```typescript
 * const flat = flattenBookmarkTree(tree);
 * console.log('Total bookmarks:', flat.length);
 * ```
 */
export declare const flattenBookmarkTree: (tree: BookmarkNode[]) => Bookmark[];
/**
 * 9. Gets bookmark depth in hierarchy.
 *
 * @param {Bookmark} bookmark - Bookmark to check
 * @param {Bookmark[]} allBookmarks - All bookmarks
 * @returns {number} Bookmark depth (0 for root)
 *
 * @example
 * ```typescript
 * const depth = getBookmarkDepth(bookmark, allBookmarks);
 * console.log('Depth:', depth);
 * ```
 */
export declare const getBookmarkDepth: (bookmark: Bookmark, allBookmarks: Bookmark[]) => number;
/**
 * 10. Gets all ancestor bookmarks.
 *
 * @param {Bookmark} bookmark - Bookmark
 * @param {Bookmark[]} allBookmarks - All bookmarks
 * @returns {Bookmark[]} Array of ancestors (root to parent)
 *
 * @example
 * ```typescript
 * const ancestors = getBookmarkAncestors(bookmark, allBookmarks);
 * console.log('Breadcrumb:', ancestors.map(b => b.title).join(' > '));
 * ```
 */
export declare const getBookmarkAncestors: (bookmark: Bookmark, allBookmarks: Bookmark[]) => Bookmark[];
/**
 * 11. Gets all descendant bookmarks.
 *
 * @param {Bookmark} bookmark - Parent bookmark
 * @returns {Bookmark[]} Array of all descendants
 *
 * @example
 * ```typescript
 * const descendants = getBookmarkDescendants(parentBookmark);
 * console.log('Total descendants:', descendants.length);
 * ```
 */
export declare const getBookmarkDescendants: (bookmark: Bookmark) => Bookmark[];
/**
 * 12. Gets sibling bookmarks.
 *
 * @param {Bookmark} bookmark - Bookmark
 * @param {Bookmark[]} allBookmarks - All bookmarks
 * @returns {Bookmark[]} Array of siblings
 *
 * @example
 * ```typescript
 * const siblings = getBookmarkSiblings(bookmark, allBookmarks);
 * console.log('Sibling count:', siblings.length);
 * ```
 */
export declare const getBookmarkSiblings: (bookmark: Bookmark, allBookmarks: Bookmark[]) => Bookmark[];
/**
 * 13. Generates table of contents from bookmarks.
 *
 * @param {Bookmark[]} bookmarks - Document bookmarks
 * @param {Partial<TOCConfig>} [config] - TOC configuration
 * @returns {TOCEntry[]} Table of contents entries
 *
 * @example
 * ```typescript
 * const toc = generateTableOfContents(bookmarks, {
 *   maxDepth: 3,
 *   includePageNumbers: true
 * });
 * ```
 */
export declare const generateTableOfContents: (bookmarks: Bookmark[], config?: Partial<TOCConfig>) => TOCEntry[];
/**
 * 14. Renders TOC as formatted text.
 *
 * @param {TOCEntry[]} toc - Table of contents entries
 * @param {Partial<TOCConfig>} [config] - TOC configuration
 * @returns {string} Formatted TOC text
 *
 * @example
 * ```typescript
 * const text = renderTOCAsText(toc, { includePageNumbers: true });
 * console.log(text);
 * ```
 */
export declare const renderTOCAsText: (toc: TOCEntry[], config?: Partial<TOCConfig>) => string;
/**
 * 15. Creates TOC page for PDF.
 *
 * @param {TOCEntry[]} toc - Table of contents entries
 * @param {Partial<TOCConfig>} config - TOC configuration
 * @returns {Record<string, any>} TOC page configuration
 *
 * @example
 * ```typescript
 * const tocPage = createTOCPage(toc, {
 *   title: 'Table of Contents',
 *   fontSize: 12,
 *   includePageNumbers: true
 * });
 * ```
 */
export declare const createTOCPage: (toc: TOCEntry[], config: Partial<TOCConfig>) => Record<string, any>;
/**
 * 16. Updates TOC page numbers after pagination.
 *
 * @param {TOCEntry[]} toc - Table of contents entries
 * @param {Map<string, number>} pageMapping - Mapping of bookmark IDs to new page numbers
 * @returns {TOCEntry[]} Updated TOC entries
 *
 * @example
 * ```typescript
 * const pageMapping = new Map([['bookmark-1', 5], ['bookmark-2', 10]]);
 * const updated = updateTOCPageNumbers(toc, pageMapping);
 * ```
 */
export declare const updateTOCPageNumbers: (toc: TOCEntry[], pageMapping: Map<string, number>) => TOCEntry[];
/**
 * 17. Creates named destination.
 *
 * @param {Partial<NamedDestination>} config - Destination configuration
 * @returns {NamedDestination} Named destination
 *
 * @example
 * ```typescript
 * const dest = createNamedDestination({
 *   name: 'Chapter1',
 *   pageNumber: 5,
 *   viewType: 'fit'
 * });
 * ```
 */
export declare const createNamedDestination: (config: Partial<NamedDestination>) => NamedDestination;
/**
 * 18. Creates XYZ destination with specific coordinates.
 *
 * @param {string} name - Destination name
 * @param {number} pageNumber - Page number
 * @param {number} [left] - Left coordinate
 * @param {number} [top] - Top coordinate
 * @param {number} [zoom] - Zoom level
 * @returns {NamedDestination} XYZ destination
 *
 * @example
 * ```typescript
 * const dest = createXYZDestination('Section1.1', 10, 100, 200, 1.0);
 * ```
 */
export declare const createXYZDestination: (name: string, pageNumber: number, left?: number, top?: number, zoom?: number) => NamedDestination;
/**
 * 19. Creates FitR destination for rectangular area.
 *
 * @param {string} name - Destination name
 * @param {number} pageNumber - Page number
 * @param {number} left - Left coordinate
 * @param {number} bottom - Bottom coordinate
 * @param {number} right - Right coordinate
 * @param {number} top - Top coordinate
 * @returns {NamedDestination} FitR destination
 *
 * @example
 * ```typescript
 * const dest = createFitRDestination('Figure1', 15, 100, 200, 400, 500);
 * ```
 */
export declare const createFitRDestination: (name: string, pageNumber: number, left: number, bottom: number, right: number, top: number) => NamedDestination;
/**
 * 20. Validates destination name format.
 *
 * @param {string} name - Destination name to validate
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const isValid = validateDestinationName('Section_1.1');
 * if (!isValid) throw new Error('Invalid destination name');
 * ```
 */
export declare const validateDestinationName: (name: string) => boolean;
/**
 * 21. Gets named destination by name.
 *
 * @param {NamedDestination[]} destinations - All destinations
 * @param {string} name - Destination name
 * @returns {NamedDestination | null} Found destination or null
 *
 * @example
 * ```typescript
 * const dest = getNamedDestination(destinations, 'Chapter1');
 * if (dest) console.log('Page:', dest.pageNumber);
 * ```
 */
export declare const getNamedDestination: (destinations: NamedDestination[], name: string) => NamedDestination | null;
/**
 * 22. Creates internal document link.
 *
 * @param {Partial<DocumentLink>} config - Link configuration
 * @returns {DocumentLink} Document link
 *
 * @example
 * ```typescript
 * const link = createInternalLink({
 *   sourcePageNumber: 5,
 *   sourceArea: { x: 100, y: 200, width: 150, height: 20 },
 *   target: 10
 * });
 * ```
 */
export declare const createInternalLink: (config: Partial<DocumentLink>) => DocumentLink;
/**
 * 23. Creates external URL link.
 *
 * @param {number} pageNumber - Source page number
 * @param {DocumentLink['sourceArea']} area - Link area
 * @param {string} url - Target URL
 * @param {string} [tooltip] - Link tooltip
 * @returns {DocumentLink} External link
 *
 * @example
 * ```typescript
 * const link = createExternalLink(
 *   5,
 *   { x: 100, y: 200, width: 200, height: 20 },
 *   'https://example.com',
 *   'Visit website'
 * );
 * ```
 */
export declare const createExternalLink: (pageNumber: number, area: DocumentLink["sourceArea"], url: string, tooltip?: string) => DocumentLink;
/**
 * 24. Creates email link.
 *
 * @param {number} pageNumber - Source page number
 * @param {DocumentLink['sourceArea']} area - Link area
 * @param {string} email - Email address
 * @param {string} [subject] - Email subject
 * @returns {DocumentLink} Email link
 *
 * @example
 * ```typescript
 * const link = createEmailLink(
 *   10,
 *   { x: 100, y: 300, width: 180, height: 15 },
 *   'support@whitecross.com',
 *   'Contact Support'
 * );
 * ```
 */
export declare const createEmailLink: (pageNumber: number, area: DocumentLink["sourceArea"], email: string, subject?: string) => DocumentLink;
/**
 * 25. Gets all links for specific page.
 *
 * @param {DocumentLink[]} links - All document links
 * @param {number} pageNumber - Page number
 * @returns {DocumentLink[]} Links on the page
 *
 * @example
 * ```typescript
 * const pageLinks = getLinksForPage(allLinks, 5);
 * console.log('Links on page 5:', pageLinks.length);
 * ```
 */
export declare const getLinksForPage: (links: DocumentLink[], pageNumber: number) => DocumentLink[];
/**
 * 26. Validates link target.
 *
 * @param {DocumentLink} link - Link to validate
 * @param {number} totalPages - Total pages in document
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const isValid = validateLinkTarget(link, 100);
 * if (!isValid) console.error('Invalid link target');
 * ```
 */
export declare const validateLinkTarget: (link: DocumentLink, totalPages: number) => boolean;
/**
 * 27. Exports bookmarks to JSON format.
 *
 * @param {Bookmark[]} bookmarks - Bookmarks to export
 * @returns {string} JSON string
 *
 * @example
 * ```typescript
 * const json = exportBookmarksToJSON(bookmarks);
 * fs.writeFileSync('bookmarks.json', json);
 * ```
 */
export declare const exportBookmarksToJSON: (bookmarks: Bookmark[]) => string;
/**
 * 28. Exports bookmarks to XML format.
 *
 * @param {Bookmark[]} bookmarks - Bookmarks to export
 * @returns {string} XML string
 *
 * @example
 * ```typescript
 * const xml = exportBookmarksToXML(bookmarks);
 * fs.writeFileSync('bookmarks.xml', xml);
 * ```
 */
export declare const exportBookmarksToXML: (bookmarks: Bookmark[]) => string;
/**
 * 29. Imports bookmarks from JSON.
 *
 * @param {string} json - JSON string
 * @returns {BookmarkImportResult} Import result
 *
 * @example
 * ```typescript
 * const json = fs.readFileSync('bookmarks.json', 'utf-8');
 * const result = importBookmarksFromJSON(json);
 * console.log('Imported:', result.importedCount);
 * ```
 */
export declare const importBookmarksFromJSON: (json: string) => BookmarkImportResult;
/**
 * 30. Imports bookmarks from array with validation.
 *
 * @param {Partial<Bookmark>[]} data - Bookmark data
 * @param {number} maxDepth - Maximum allowed depth
 * @returns {BookmarkImportResult} Import result
 *
 * @example
 * ```typescript
 * const result = importBookmarksWithValidation(data, 10);
 * if (!result.success) {
 *   console.error('Import errors:', result.errors);
 * }
 * ```
 */
export declare const importBookmarksWithValidation: (data: Partial<Bookmark>[], maxDepth: number) => BookmarkImportResult;
/**
 * 31. Finds bookmark by title.
 *
 * @param {Bookmark[]} bookmarks - All bookmarks
 * @param {string} title - Title to search for
 * @param {boolean} [caseSensitive] - Case-sensitive search
 * @returns {Bookmark | null} Found bookmark or null
 *
 * @example
 * ```typescript
 * const bookmark = findBookmarkByTitle(bookmarks, 'Introduction', false);
 * if (bookmark) console.log('Found on page:', bookmark.pageNumber);
 * ```
 */
export declare const findBookmarkByTitle: (bookmarks: Bookmark[], title: string, caseSensitive?: boolean) => Bookmark | null;
/**
 * 32. Finds bookmarks by page number.
 *
 * @param {Bookmark[]} bookmarks - All bookmarks
 * @param {number} pageNumber - Page number
 * @returns {Bookmark[]} Bookmarks on the page
 *
 * @example
 * ```typescript
 * const pageBookmarks = findBookmarksByPage(bookmarks, 10);
 * console.log('Bookmarks on page 10:', pageBookmarks.length);
 * ```
 */
export declare const findBookmarksByPage: (bookmarks: Bookmark[], pageNumber: number) => Bookmark[];
/**
 * 33. Searches bookmarks by text.
 *
 * @param {Bookmark[]} bookmarks - All bookmarks
 * @param {string} query - Search query
 * @param {boolean} [caseSensitive] - Case-sensitive search
 * @returns {Bookmark[]} Matching bookmarks
 *
 * @example
 * ```typescript
 * const results = searchBookmarks(bookmarks, 'medical', false);
 * console.log('Found:', results.length);
 * ```
 */
export declare const searchBookmarks: (bookmarks: Bookmark[], query: string, caseSensitive?: boolean) => Bookmark[];
/**
 * 34. Sorts bookmarks by page number.
 *
 * @param {Bookmark[]} bookmarks - Bookmarks to sort
 * @returns {Bookmark[]} Sorted bookmarks
 *
 * @example
 * ```typescript
 * const sorted = sortBookmarksByPage(bookmarks);
 * ```
 */
export declare const sortBookmarksByPage: (bookmarks: Bookmark[]) => Bookmark[];
/**
 * 35. Sorts bookmarks by title.
 *
 * @param {Bookmark[]} bookmarks - Bookmarks to sort
 * @param {boolean} [ascending] - Sort order
 * @returns {Bookmark[]} Sorted bookmarks
 *
 * @example
 * ```typescript
 * const sorted = sortBookmarksByTitle(bookmarks, true);
 * ```
 */
export declare const sortBookmarksByTitle: (bookmarks: Bookmark[], ascending?: boolean) => Bookmark[];
/**
 * 36. Counts total bookmarks including children.
 *
 * @param {Bookmark[]} bookmarks - Bookmarks to count
 * @returns {number} Total bookmark count
 *
 * @example
 * ```typescript
 * const total = countBookmarks(bookmarks);
 * console.log('Total bookmarks:', total);
 * ```
 */
export declare const countBookmarks: (bookmarks: Bookmark[]) => number;
/**
 * 37. Validates bookmark structure.
 *
 * @param {Bookmark[]} bookmarks - Bookmarks to validate
 * @param {number} totalPages - Total pages in document
 * @returns {string[]} Array of validation errors
 *
 * @example
 * ```typescript
 * const errors = validateBookmarkStructure(bookmarks, 100);
 * if (errors.length > 0) {
 *   console.error('Validation errors:', errors);
 * }
 * ```
 */
export declare const validateBookmarkStructure: (bookmarks: Bookmark[], totalPages: number) => string[];
/**
 * 38. Clones bookmark tree.
 *
 * @param {Bookmark[]} bookmarks - Bookmarks to clone
 * @param {boolean} [generateNewIds] - Generate new IDs for clones
 * @returns {Bookmark[]} Cloned bookmarks
 *
 * @example
 * ```typescript
 * const cloned = cloneBookmarks(bookmarks, true);
 * ```
 */
export declare const cloneBookmarks: (bookmarks: Bookmark[], generateNewIds?: boolean) => Bookmark[];
declare const _default: {
    loadBookmarkConfig: () => BookmarkConfig;
    validateBookmarkConfig: (config: BookmarkConfig) => string[];
    createDocumentBookmarkModel: (sequelize: Sequelize) => any;
    createNamedDestinationModel: (sequelize: Sequelize) => any;
    createBookmark: (config: Partial<Bookmark>) => Bookmark;
    createBookmarkWithChildren: (parent: Partial<Bookmark>, children: Partial<Bookmark>[]) => Bookmark;
    createBookmarksFromHeadings: (headings: Array<{
        text: string;
        level: number;
        page: number;
    }>) => Bookmark[];
    addBookmark: (bookmarks: Bookmark[], newBookmark: Bookmark, parentId?: string) => Bookmark[];
    updateBookmark: (bookmarks: Bookmark[], bookmarkId: string, updates: Partial<Bookmark>) => Bookmark[];
    removeBookmark: (bookmarks: Bookmark[], bookmarkId: string) => Bookmark[];
    buildBookmarkTree: (bookmarks: Bookmark[]) => BookmarkNode[];
    flattenBookmarkTree: (tree: BookmarkNode[]) => Bookmark[];
    getBookmarkDepth: (bookmark: Bookmark, allBookmarks: Bookmark[]) => number;
    getBookmarkAncestors: (bookmark: Bookmark, allBookmarks: Bookmark[]) => Bookmark[];
    getBookmarkDescendants: (bookmark: Bookmark) => Bookmark[];
    getBookmarkSiblings: (bookmark: Bookmark, allBookmarks: Bookmark[]) => Bookmark[];
    generateTableOfContents: (bookmarks: Bookmark[], config?: Partial<TOCConfig>) => TOCEntry[];
    renderTOCAsText: (toc: TOCEntry[], config?: Partial<TOCConfig>) => string;
    createTOCPage: (toc: TOCEntry[], config: Partial<TOCConfig>) => Record<string, any>;
    updateTOCPageNumbers: (toc: TOCEntry[], pageMapping: Map<string, number>) => TOCEntry[];
    createNamedDestination: (config: Partial<NamedDestination>) => NamedDestination;
    createXYZDestination: (name: string, pageNumber: number, left?: number, top?: number, zoom?: number) => NamedDestination;
    createFitRDestination: (name: string, pageNumber: number, left: number, bottom: number, right: number, top: number) => NamedDestination;
    validateDestinationName: (name: string) => boolean;
    getNamedDestination: (destinations: NamedDestination[], name: string) => NamedDestination | null;
    createInternalLink: (config: Partial<DocumentLink>) => DocumentLink;
    createExternalLink: (pageNumber: number, area: DocumentLink["sourceArea"], url: string, tooltip?: string) => DocumentLink;
    createEmailLink: (pageNumber: number, area: DocumentLink["sourceArea"], email: string, subject?: string) => DocumentLink;
    getLinksForPage: (links: DocumentLink[], pageNumber: number) => DocumentLink[];
    validateLinkTarget: (link: DocumentLink, totalPages: number) => boolean;
    exportBookmarksToJSON: (bookmarks: Bookmark[]) => string;
    exportBookmarksToXML: (bookmarks: Bookmark[]) => string;
    importBookmarksFromJSON: (json: string) => BookmarkImportResult;
    importBookmarksWithValidation: (data: Partial<Bookmark>[], maxDepth: number) => BookmarkImportResult;
    findBookmarkByTitle: (bookmarks: Bookmark[], title: string, caseSensitive?: boolean) => Bookmark | null;
    findBookmarksByPage: (bookmarks: Bookmark[], pageNumber: number) => Bookmark[];
    searchBookmarks: (bookmarks: Bookmark[], query: string, caseSensitive?: boolean) => Bookmark[];
    sortBookmarksByPage: (bookmarks: Bookmark[]) => Bookmark[];
    sortBookmarksByTitle: (bookmarks: Bookmark[], ascending?: boolean) => Bookmark[];
    countBookmarks: (bookmarks: Bookmark[]) => number;
    validateBookmarkStructure: (bookmarks: Bookmark[], totalPages: number) => string[];
    cloneBookmarks: (bookmarks: Bookmark[], generateNewIds?: boolean) => Bookmark[];
};
export default _default;
//# sourceMappingURL=document-bookmarks-kit.d.ts.map