"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneBookmarks = exports.validateBookmarkStructure = exports.countBookmarks = exports.sortBookmarksByTitle = exports.sortBookmarksByPage = exports.searchBookmarks = exports.findBookmarksByPage = exports.findBookmarkByTitle = exports.importBookmarksWithValidation = exports.importBookmarksFromJSON = exports.exportBookmarksToXML = exports.exportBookmarksToJSON = exports.validateLinkTarget = exports.getLinksForPage = exports.createEmailLink = exports.createExternalLink = exports.createInternalLink = exports.getNamedDestination = exports.validateDestinationName = exports.createFitRDestination = exports.createXYZDestination = exports.createNamedDestination = exports.updateTOCPageNumbers = exports.createTOCPage = exports.renderTOCAsText = exports.generateTableOfContents = exports.getBookmarkSiblings = exports.getBookmarkDescendants = exports.getBookmarkAncestors = exports.getBookmarkDepth = exports.flattenBookmarkTree = exports.buildBookmarkTree = exports.removeBookmark = exports.updateBookmark = exports.addBookmark = exports.createBookmarksFromHeadings = exports.createBookmarkWithChildren = exports.createBookmark = exports.createNamedDestinationModel = exports.createDocumentBookmarkModel = exports.validateBookmarkConfig = exports.loadBookmarkConfig = void 0;
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
const sequelize_1 = require("sequelize");
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
const loadBookmarkConfig = () => {
    return {
        maxBookmarkDepth: parseInt(process.env.MAX_BOOKMARK_DEPTH || '10', 10),
        defaultBookmarkColor: process.env.DEFAULT_BOOKMARK_COLOR || '#000000',
        enableAutoBookmarks: process.env.ENABLE_AUTO_BOOKMARKS === 'true',
        autoBookmarkHeadings: process.env.AUTO_BOOKMARK_HEADINGS?.split(',') || ['h1', 'h2', 'h3'],
        tocFontSize: parseInt(process.env.TOC_FONT_SIZE || '12', 10),
        tocIndentSize: parseInt(process.env.TOC_INDENT_SIZE || '20', 10),
        enableNamedDestinations: process.env.ENABLE_NAMED_DESTINATIONS === 'true',
        bookmarkCacheTTL: parseInt(process.env.BOOKMARK_CACHE_TTL || '3600', 10),
        maxBookmarksPerDocument: parseInt(process.env.MAX_BOOKMARKS_PER_DOCUMENT || '500', 10),
        enableBookmarkIcons: process.env.ENABLE_BOOKMARK_ICONS === 'true',
    };
};
exports.loadBookmarkConfig = loadBookmarkConfig;
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
const validateBookmarkConfig = (config) => {
    const errors = [];
    if (config.maxBookmarkDepth < 1 || config.maxBookmarkDepth > 20) {
        errors.push('Max bookmark depth must be between 1 and 20');
    }
    if (config.tocFontSize < 6 || config.tocFontSize > 24) {
        errors.push('TOC font size must be between 6 and 24');
    }
    if (config.maxBookmarksPerDocument < 1 || config.maxBookmarksPerDocument > 10000) {
        errors.push('Max bookmarks per document must be between 1 and 10000');
    }
    return errors;
};
exports.validateBookmarkConfig = validateBookmarkConfig;
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
const createDocumentBookmarkModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        documentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'documents',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        title: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        pageNumber: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
            },
        },
        level: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            validate: {
                min: 1,
                max: 10,
            },
        },
        parentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'document_bookmarks',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        sortOrder: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Sort order within parent',
        },
        destinationType: {
            type: sequelize_1.DataTypes.ENUM('page', 'named', 'url'),
            allowNull: false,
            defaultValue: 'page',
        },
        destination: {
            type: sequelize_1.DataTypes.STRING(1000),
            allowNull: true,
            comment: 'Destination page number or URL',
        },
        color: {
            type: sequelize_1.DataTypes.STRING(7),
            allowNull: true,
            comment: 'Hex color code',
        },
        style: {
            type: sequelize_1.DataTypes.ENUM('normal', 'bold', 'italic', 'bold-italic'),
            allowNull: true,
            defaultValue: 'normal',
        },
        isOpen: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether bookmark children are visible',
        },
        actionType: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Action type (goto, uri, javascript, launch)',
        },
        actionTarget: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Action target or script',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
        },
    };
    const options = {
        tableName: 'document_bookmarks',
        timestamps: true,
        indexes: [
            { fields: ['documentId'] },
            { fields: ['parentId'] },
            { fields: ['pageNumber'] },
            { fields: ['level'] },
            { fields: ['sortOrder'] },
        ],
    };
    return sequelize.define('DocumentBookmark', attributes, options);
};
exports.createDocumentBookmarkModel = createDocumentBookmarkModel;
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
const createNamedDestinationModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        documentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'documents',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        name: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Unique destination name',
        },
        pageNumber: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
            },
        },
        viewType: {
            type: sequelize_1.DataTypes.ENUM('fit', 'fitH', 'fitV', 'fitR', 'xyz'),
            allowNull: false,
            defaultValue: 'fit',
        },
        coordinates: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Coordinates for view type',
        },
    };
    const options = {
        tableName: 'named_destinations',
        timestamps: true,
        indexes: [
            { fields: ['documentId', 'name'], unique: true },
            { fields: ['pageNumber'] },
        ],
    };
    return sequelize.define('NamedDestination', attributes, options);
};
exports.createNamedDestinationModel = createNamedDestinationModel;
// ============================================================================
// 1. BOOKMARK CREATION
// ============================================================================
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
const createBookmark = (config) => {
    return {
        id: config.id || crypto.randomUUID(),
        title: config.title || 'Untitled',
        pageNumber: config.pageNumber || 1,
        level: config.level || 1,
        parentId: config.parentId,
        children: config.children || [],
        destinationType: config.destinationType || 'page',
        destination: config.destination,
        color: config.color,
        style: config.style || 'normal',
        open: config.open ?? true,
        action: config.action,
        metadata: config.metadata || {},
    };
};
exports.createBookmark = createBookmark;
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
const createBookmarkWithChildren = (parent, children) => {
    const parentBookmark = (0, exports.createBookmark)(parent);
    parentBookmark.children = children.map((child) => (0, exports.createBookmark)({
        ...child,
        parentId: parentBookmark.id,
        level: (parent.level || 1) + 1,
    }));
    return parentBookmark;
};
exports.createBookmarkWithChildren = createBookmarkWithChildren;
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
const createBookmarksFromHeadings = (headings) => {
    return headings.map((heading, index) => (0, exports.createBookmark)({
        id: `heading-${index}`,
        title: heading.text,
        pageNumber: heading.page,
        level: heading.level,
    }));
};
exports.createBookmarksFromHeadings = createBookmarksFromHeadings;
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
const addBookmark = (bookmarks, newBookmark, parentId) => {
    if (!parentId) {
        return [...bookmarks, newBookmark];
    }
    return bookmarks.map((bookmark) => {
        if (bookmark.id === parentId) {
            return {
                ...bookmark,
                children: [...(bookmark.children || []), { ...newBookmark, parentId }],
            };
        }
        if (bookmark.children && bookmark.children.length > 0) {
            return {
                ...bookmark,
                children: (0, exports.addBookmark)(bookmark.children, newBookmark, parentId),
            };
        }
        return bookmark;
    });
};
exports.addBookmark = addBookmark;
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
const updateBookmark = (bookmarks, bookmarkId, updates) => {
    return bookmarks.map((bookmark) => {
        if (bookmark.id === bookmarkId) {
            return { ...bookmark, ...updates };
        }
        if (bookmark.children && bookmark.children.length > 0) {
            return {
                ...bookmark,
                children: (0, exports.updateBookmark)(bookmark.children, bookmarkId, updates),
            };
        }
        return bookmark;
    });
};
exports.updateBookmark = updateBookmark;
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
const removeBookmark = (bookmarks, bookmarkId) => {
    return bookmarks
        .filter((bookmark) => bookmark.id !== bookmarkId)
        .map((bookmark) => {
        if (bookmark.children && bookmark.children.length > 0) {
            return {
                ...bookmark,
                children: (0, exports.removeBookmark)(bookmark.children, bookmarkId),
            };
        }
        return bookmark;
    });
};
exports.removeBookmark = removeBookmark;
// ============================================================================
// 2. BOOKMARK HIERARCHY
// ============================================================================
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
const buildBookmarkTree = (bookmarks) => {
    const bookmarkMap = new Map();
    const roots = [];
    // Create nodes
    bookmarks.forEach((bookmark) => {
        bookmarkMap.set(bookmark.id, { bookmark, children: [] });
    });
    // Build tree
    bookmarks.forEach((bookmark) => {
        const node = bookmarkMap.get(bookmark.id);
        if (bookmark.parentId) {
            const parent = bookmarkMap.get(bookmark.parentId);
            if (parent) {
                parent.children.push(node);
                node.parent = parent;
            }
            else {
                roots.push(node);
            }
        }
        else {
            roots.push(node);
        }
    });
    return roots;
};
exports.buildBookmarkTree = buildBookmarkTree;
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
const flattenBookmarkTree = (tree) => {
    const result = [];
    const traverse = (nodes) => {
        nodes.forEach((node) => {
            result.push(node.bookmark);
            if (node.children.length > 0) {
                traverse(node.children);
            }
        });
    };
    traverse(tree);
    return result;
};
exports.flattenBookmarkTree = flattenBookmarkTree;
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
const getBookmarkDepth = (bookmark, allBookmarks) => {
    let depth = 0;
    let current = bookmark;
    while (current.parentId) {
        depth++;
        const parent = allBookmarks.find((b) => b.id === current.parentId);
        if (!parent)
            break;
        current = parent;
    }
    return depth;
};
exports.getBookmarkDepth = getBookmarkDepth;
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
const getBookmarkAncestors = (bookmark, allBookmarks) => {
    const ancestors = [];
    let current = bookmark;
    while (current.parentId) {
        const parent = allBookmarks.find((b) => b.id === current.parentId);
        if (!parent)
            break;
        ancestors.unshift(parent);
        current = parent;
    }
    return ancestors;
};
exports.getBookmarkAncestors = getBookmarkAncestors;
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
const getBookmarkDescendants = (bookmark) => {
    const descendants = [];
    const traverse = (children) => {
        children.forEach((child) => {
            descendants.push(child);
            if (child.children && child.children.length > 0) {
                traverse(child.children);
            }
        });
    };
    if (bookmark.children) {
        traverse(bookmark.children);
    }
    return descendants;
};
exports.getBookmarkDescendants = getBookmarkDescendants;
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
const getBookmarkSiblings = (bookmark, allBookmarks) => {
    return allBookmarks.filter((b) => b.parentId === bookmark.parentId && b.id !== bookmark.id);
};
exports.getBookmarkSiblings = getBookmarkSiblings;
// ============================================================================
// 3. TABLE OF CONTENTS GENERATION
// ============================================================================
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
const generateTableOfContents = (bookmarks, config) => {
    const maxDepth = config?.maxDepth || 10;
    const convertToTOCEntry = (bookmark) => {
        const entry = {
            id: bookmark.id,
            title: bookmark.title,
            level: bookmark.level,
            pageNumber: bookmark.pageNumber,
            indent: (bookmark.level - 1) * (config?.indentSize || 20),
        };
        if (bookmark.children && bookmark.children.length > 0 && bookmark.level < maxDepth) {
            entry.children = bookmark.children.map(convertToTOCEntry);
        }
        return entry;
    };
    return bookmarks.map(convertToTOCEntry);
};
exports.generateTableOfContents = generateTableOfContents;
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
const renderTOCAsText = (toc, config) => {
    const lines = [];
    if (config?.title) {
        lines.push(config.title);
        lines.push('');
    }
    const renderEntry = (entry, depth = 0) => {
        const indent = '  '.repeat(depth);
        const pageNum = config?.includePageNumbers ? ` .......... ${entry.pageNumber}` : '';
        lines.push(`${indent}${entry.title}${pageNum}`);
        if (entry.children) {
            entry.children.forEach((child) => renderEntry(child, depth + 1));
        }
    };
    toc.forEach((entry) => renderEntry(entry));
    return lines.join('\n');
};
exports.renderTOCAsText = renderTOCAsText;
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
const createTOCPage = (toc, config) => {
    return {
        title: config.title || 'Table of Contents',
        entries: toc,
        fontFamily: config.fontFamily || 'Helvetica',
        fontSize: config.fontSize || 12,
        indentSize: config.indentSize || 20,
        includePageNumbers: config.includePageNumbers ?? true,
        dotLeader: config.dotLeader ?? true,
        includeLinks: config.includeLinks ?? true,
        startPage: config.startPage || 1,
    };
};
exports.createTOCPage = createTOCPage;
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
const updateTOCPageNumbers = (toc, pageMapping) => {
    return toc.map((entry) => {
        const newPageNumber = pageMapping.get(entry.id) || entry.pageNumber;
        const children = entry.children ? (0, exports.updateTOCPageNumbers)(entry.children, pageMapping) : undefined;
        return {
            ...entry,
            pageNumber: newPageNumber,
            children,
        };
    });
};
exports.updateTOCPageNumbers = updateTOCPageNumbers;
// ============================================================================
// 4. NAMED DESTINATIONS
// ============================================================================
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
const createNamedDestination = (config) => {
    return {
        name: config.name || 'Destination',
        pageNumber: config.pageNumber || 1,
        viewType: config.viewType || 'fit',
        coordinates: config.coordinates,
    };
};
exports.createNamedDestination = createNamedDestination;
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
const createXYZDestination = (name, pageNumber, left, top, zoom) => {
    return {
        name,
        pageNumber,
        viewType: 'xyz',
        coordinates: { left, top, zoom },
    };
};
exports.createXYZDestination = createXYZDestination;
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
const createFitRDestination = (name, pageNumber, left, bottom, right, top) => {
    return {
        name,
        pageNumber,
        viewType: 'fitR',
        coordinates: { left, bottom, right, top },
    };
};
exports.createFitRDestination = createFitRDestination;
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
const validateDestinationName = (name) => {
    // Valid destination names: alphanumeric, underscore, hyphen, period
    return /^[a-zA-Z0-9._-]+$/.test(name);
};
exports.validateDestinationName = validateDestinationName;
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
const getNamedDestination = (destinations, name) => {
    return destinations.find((dest) => dest.name === name) || null;
};
exports.getNamedDestination = getNamedDestination;
// ============================================================================
// 5. DOCUMENT LINKS
// ============================================================================
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
const createInternalLink = (config) => {
    return {
        id: config.id || crypto.randomUUID(),
        sourcePageNumber: config.sourcePageNumber || 1,
        sourceArea: config.sourceArea || { x: 0, y: 0, width: 100, height: 20 },
        linkType: 'internal',
        target: config.target || 1,
        tooltip: config.tooltip,
        border: config.border ?? false,
        highlightMode: config.highlightMode || 'invert',
    };
};
exports.createInternalLink = createInternalLink;
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
const createExternalLink = (pageNumber, area, url, tooltip) => {
    return {
        id: crypto.randomUUID(),
        sourcePageNumber: pageNumber,
        sourceArea: area,
        linkType: 'external',
        target: url,
        tooltip,
        border: false,
        highlightMode: 'invert',
    };
};
exports.createExternalLink = createExternalLink;
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
const createEmailLink = (pageNumber, area, email, subject) => {
    const target = subject ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : `mailto:${email}`;
    return {
        id: crypto.randomUUID(),
        sourcePageNumber: pageNumber,
        sourceArea: area,
        linkType: 'email',
        target,
        tooltip: `Email: ${email}`,
        border: false,
        highlightMode: 'invert',
    };
};
exports.createEmailLink = createEmailLink;
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
const getLinksForPage = (links, pageNumber) => {
    return links.filter((link) => link.sourcePageNumber === pageNumber);
};
exports.getLinksForPage = getLinksForPage;
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
const validateLinkTarget = (link, totalPages) => {
    if (link.linkType === 'internal') {
        const targetPage = typeof link.target === 'number' ? link.target : parseInt(String(link.target), 10);
        return targetPage >= 1 && targetPage <= totalPages;
    }
    if (link.linkType === 'external' || link.linkType === 'email') {
        return typeof link.target === 'string' && link.target.length > 0;
    }
    return true;
};
exports.validateLinkTarget = validateLinkTarget;
// ============================================================================
// 6. BOOKMARK IMPORT/EXPORT
// ============================================================================
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
const exportBookmarksToJSON = (bookmarks) => {
    return JSON.stringify(bookmarks, null, 2);
};
exports.exportBookmarksToJSON = exportBookmarksToJSON;
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
const exportBookmarksToXML = (bookmarks) => {
    const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<bookmarks>'];
    const renderBookmark = (bookmark, indent = '  ') => {
        lines.push(`${indent}<bookmark id="${bookmark.id}">`);
        lines.push(`${indent}  <title>${escapeXML(bookmark.title)}</title>`);
        lines.push(`${indent}  <page>${bookmark.pageNumber}</page>`);
        lines.push(`${indent}  <level>${bookmark.level}</level>`);
        if (bookmark.children && bookmark.children.length > 0) {
            lines.push(`${indent}  <children>`);
            bookmark.children.forEach((child) => renderBookmark(child, indent + '    '));
            lines.push(`${indent}  </children>`);
        }
        lines.push(`${indent}</bookmark>`);
    };
    bookmarks.forEach((bookmark) => renderBookmark(bookmark));
    lines.push('</bookmarks>');
    return lines.join('\n');
};
exports.exportBookmarksToXML = exportBookmarksToXML;
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
const importBookmarksFromJSON = (json) => {
    try {
        const bookmarks = JSON.parse(json);
        return {
            success: true,
            importedCount: bookmarks.length,
            skippedCount: 0,
            errors: [],
            bookmarks,
        };
    }
    catch (error) {
        return {
            success: false,
            importedCount: 0,
            skippedCount: 0,
            errors: [error instanceof Error ? error.message : 'Unknown error'],
            bookmarks: [],
        };
    }
};
exports.importBookmarksFromJSON = importBookmarksFromJSON;
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
const importBookmarksWithValidation = (data, maxDepth) => {
    const bookmarks = [];
    const errors = [];
    let skippedCount = 0;
    data.forEach((item, index) => {
        try {
            if (!item.title || !item.pageNumber) {
                errors.push(`Bookmark ${index}: missing required fields`);
                skippedCount++;
                return;
            }
            if (item.level && item.level > maxDepth) {
                errors.push(`Bookmark ${index}: level ${item.level} exceeds max depth ${maxDepth}`);
                skippedCount++;
                return;
            }
            bookmarks.push((0, exports.createBookmark)(item));
        }
        catch (error) {
            errors.push(`Bookmark ${index}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            skippedCount++;
        }
    });
    return {
        success: errors.length === 0,
        importedCount: bookmarks.length,
        skippedCount,
        errors,
        bookmarks,
    };
};
exports.importBookmarksWithValidation = importBookmarksWithValidation;
// ============================================================================
// 7. BOOKMARK UTILITIES
// ============================================================================
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
const findBookmarkByTitle = (bookmarks, title, caseSensitive = false) => {
    const searchTitle = caseSensitive ? title : title.toLowerCase();
    for (const bookmark of bookmarks) {
        const bookmarkTitle = caseSensitive ? bookmark.title : bookmark.title.toLowerCase();
        if (bookmarkTitle === searchTitle) {
            return bookmark;
        }
        if (bookmark.children && bookmark.children.length > 0) {
            const found = (0, exports.findBookmarkByTitle)(bookmark.children, title, caseSensitive);
            if (found)
                return found;
        }
    }
    return null;
};
exports.findBookmarkByTitle = findBookmarkByTitle;
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
const findBookmarksByPage = (bookmarks, pageNumber) => {
    const results = [];
    const search = (items) => {
        items.forEach((bookmark) => {
            if (bookmark.pageNumber === pageNumber) {
                results.push(bookmark);
            }
            if (bookmark.children && bookmark.children.length > 0) {
                search(bookmark.children);
            }
        });
    };
    search(bookmarks);
    return results;
};
exports.findBookmarksByPage = findBookmarksByPage;
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
const searchBookmarks = (bookmarks, query, caseSensitive = false) => {
    const results = [];
    const searchQuery = caseSensitive ? query : query.toLowerCase();
    const search = (items) => {
        items.forEach((bookmark) => {
            const title = caseSensitive ? bookmark.title : bookmark.title.toLowerCase();
            if (title.includes(searchQuery)) {
                results.push(bookmark);
            }
            if (bookmark.children && bookmark.children.length > 0) {
                search(bookmark.children);
            }
        });
    };
    search(bookmarks);
    return results;
};
exports.searchBookmarks = searchBookmarks;
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
const sortBookmarksByPage = (bookmarks) => {
    return [...bookmarks].sort((a, b) => a.pageNumber - b.pageNumber);
};
exports.sortBookmarksByPage = sortBookmarksByPage;
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
const sortBookmarksByTitle = (bookmarks, ascending = true) => {
    return [...bookmarks].sort((a, b) => {
        const comparison = a.title.localeCompare(b.title);
        return ascending ? comparison : -comparison;
    });
};
exports.sortBookmarksByTitle = sortBookmarksByTitle;
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
const countBookmarks = (bookmarks) => {
    let count = bookmarks.length;
    bookmarks.forEach((bookmark) => {
        if (bookmark.children && bookmark.children.length > 0) {
            count += (0, exports.countBookmarks)(bookmark.children);
        }
    });
    return count;
};
exports.countBookmarks = countBookmarks;
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
const validateBookmarkStructure = (bookmarks, totalPages) => {
    const errors = [];
    const seenIds = new Set();
    const validate = (items, parentLevel = 0) => {
        items.forEach((bookmark, index) => {
            if (seenIds.has(bookmark.id)) {
                errors.push(`Duplicate bookmark ID: ${bookmark.id}`);
            }
            seenIds.add(bookmark.id);
            if (!bookmark.title || bookmark.title.trim().length === 0) {
                errors.push(`Bookmark ${bookmark.id}: empty title`);
            }
            if (bookmark.pageNumber < 1 || bookmark.pageNumber > totalPages) {
                errors.push(`Bookmark ${bookmark.id}: invalid page number ${bookmark.pageNumber}`);
            }
            if (bookmark.level <= parentLevel) {
                errors.push(`Bookmark ${bookmark.id}: level ${bookmark.level} should be > parent level ${parentLevel}`);
            }
            if (bookmark.children && bookmark.children.length > 0) {
                validate(bookmark.children, bookmark.level);
            }
        });
    };
    validate(bookmarks);
    return errors;
};
exports.validateBookmarkStructure = validateBookmarkStructure;
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
const cloneBookmarks = (bookmarks, generateNewIds = false) => {
    return bookmarks.map((bookmark) => {
        const cloned = {
            ...bookmark,
            id: generateNewIds ? crypto.randomUUID() : bookmark.id,
        };
        if (bookmark.children && bookmark.children.length > 0) {
            cloned.children = (0, exports.cloneBookmarks)(bookmark.children, generateNewIds);
        }
        return cloned;
    });
};
exports.cloneBookmarks = cloneBookmarks;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Escapes XML special characters.
 *
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
const escapeXML = (text) => {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
};
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Configuration
    loadBookmarkConfig: exports.loadBookmarkConfig,
    validateBookmarkConfig: exports.validateBookmarkConfig,
    // Models
    createDocumentBookmarkModel: exports.createDocumentBookmarkModel,
    createNamedDestinationModel: exports.createNamedDestinationModel,
    // Bookmark Creation
    createBookmark: exports.createBookmark,
    createBookmarkWithChildren: exports.createBookmarkWithChildren,
    createBookmarksFromHeadings: exports.createBookmarksFromHeadings,
    addBookmark: exports.addBookmark,
    updateBookmark: exports.updateBookmark,
    removeBookmark: exports.removeBookmark,
    // Bookmark Hierarchy
    buildBookmarkTree: exports.buildBookmarkTree,
    flattenBookmarkTree: exports.flattenBookmarkTree,
    getBookmarkDepth: exports.getBookmarkDepth,
    getBookmarkAncestors: exports.getBookmarkAncestors,
    getBookmarkDescendants: exports.getBookmarkDescendants,
    getBookmarkSiblings: exports.getBookmarkSiblings,
    // Table of Contents
    generateTableOfContents: exports.generateTableOfContents,
    renderTOCAsText: exports.renderTOCAsText,
    createTOCPage: exports.createTOCPage,
    updateTOCPageNumbers: exports.updateTOCPageNumbers,
    // Named Destinations
    createNamedDestination: exports.createNamedDestination,
    createXYZDestination: exports.createXYZDestination,
    createFitRDestination: exports.createFitRDestination,
    validateDestinationName: exports.validateDestinationName,
    getNamedDestination: exports.getNamedDestination,
    // Document Links
    createInternalLink: exports.createInternalLink,
    createExternalLink: exports.createExternalLink,
    createEmailLink: exports.createEmailLink,
    getLinksForPage: exports.getLinksForPage,
    validateLinkTarget: exports.validateLinkTarget,
    // Import/Export
    exportBookmarksToJSON: exports.exportBookmarksToJSON,
    exportBookmarksToXML: exports.exportBookmarksToXML,
    importBookmarksFromJSON: exports.importBookmarksFromJSON,
    importBookmarksWithValidation: exports.importBookmarksWithValidation,
    // Utilities
    findBookmarkByTitle: exports.findBookmarkByTitle,
    findBookmarksByPage: exports.findBookmarksByPage,
    searchBookmarks: exports.searchBookmarks,
    sortBookmarksByPage: exports.sortBookmarksByPage,
    sortBookmarksByTitle: exports.sortBookmarksByTitle,
    countBookmarks: exports.countBookmarks,
    validateBookmarkStructure: exports.validateBookmarkStructure,
    cloneBookmarks: exports.cloneBookmarks,
};
//# sourceMappingURL=document-bookmarks-kit.js.map