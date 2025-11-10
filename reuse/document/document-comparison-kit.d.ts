/**
 * LOC: DOC-COMP-001
 * File: /reuse/document/document-comparison-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - diff (v5.x)
 *   - jsondiffpatch (v0.6.x)
 *   - xmldiff (v1.x)
 *   - canvas / pdf-lib
 *
 * DOWNSTREAM (imported by):
 *   - Document versioning controllers
 *   - Audit trail services
 *   - Document review modules
 *   - Compliance tracking services
 */
/**
 * File: /reuse/document/document-comparison-kit.ts
 * Locator: WC-UTL-DOCCOMP-001
 * Purpose: Document Comparison & Change Tracking Kit - Comprehensive diff and comparison utilities
 *
 * Upstream: sequelize, diff libraries, PDF/image comparison tools, delta algorithms
 * Downstream: Version control, audit trails, document review, compliance tracking, change management
 * Dependencies: Sequelize 6.x, TypeScript 5.x, Node 18+, diff libraries, canvas for visual comparison
 * Exports: 40 utility functions for text diff, visual comparison, change tracking, version management
 *
 * LLM Context: Production-grade document comparison utilities for White Cross healthcare platform.
 * Provides text-based diff algorithms, visual comparison for images/PDFs, side-by-side view generation,
 * change tracking with audit trails, comparison reports, statistical analysis, merge conflict resolution,
 * and HIPAA-compliant document versioning. Essential for medical record versioning and compliance tracking.
 */
import { Sequelize, WhereOptions, FindOptions } from 'sequelize';
/**
 * Text comparison result
 */
export interface TextComparisonResult {
    original: string;
    modified: string;
    diff: DiffChange[];
    statistics: ComparisonStatistics;
    similarity: number;
    hunks?: DiffHunk[];
}
/**
 * Individual diff change
 */
export interface DiffChange {
    type: 'add' | 'remove' | 'modify' | 'unchanged';
    lineNumber: number;
    oldLineNumber?: number;
    newLineNumber?: number;
    content: string;
    oldContent?: string;
    newContent?: string;
}
/**
 * Diff hunk (group of related changes)
 */
export interface DiffHunk {
    oldStart: number;
    oldLines: number;
    newStart: number;
    newLines: number;
    changes: DiffChange[];
}
/**
 * Comparison statistics
 */
export interface ComparisonStatistics {
    totalLines: number;
    addedLines: number;
    removedLines: number;
    modifiedLines: number;
    unchangedLines: number;
    addedWords: number;
    removedWords: number;
    addedCharacters: number;
    removedCharacters: number;
    percentageChanged: number;
}
/**
 * Visual comparison result
 */
export interface VisualComparisonResult {
    originalId: string;
    modifiedId: string;
    differences: VisualDifference[];
    diffImageBuffer?: Buffer;
    similarity: number;
    regions: DifferenceRegion[];
}
/**
 * Visual difference
 */
export interface VisualDifference {
    type: 'pixel' | 'region' | 'annotation' | 'watermark';
    x: number;
    y: number;
    width: number;
    height: number;
    severity: 'minor' | 'moderate' | 'major';
    description?: string;
}
/**
 * Difference region
 */
export interface DifferenceRegion {
    x: number;
    y: number;
    width: number;
    height: number;
    pixelsDifferent: number;
    percentageDifferent: number;
}
/**
 * Change tracking entry
 */
export interface ChangeTrackingEntry {
    id: string;
    documentId: string;
    version: number;
    changeType: 'create' | 'update' | 'delete' | 'merge' | 'revert';
    changedBy: string;
    changedAt: Date;
    changes: TrackedChange[];
    comment?: string;
    approved?: boolean;
    approvedBy?: string;
    approvedAt?: Date;
}
/**
 * Tracked change
 */
export interface TrackedChange {
    field: string;
    path?: string;
    oldValue: any;
    newValue: any;
    changeType: 'add' | 'remove' | 'modify';
    timestamp: Date;
}
/**
 * Side-by-side comparison view
 */
export interface SideBySideView {
    leftContent: string[];
    rightContent: string[];
    lineMapping: LineMapping[];
    synchronized: boolean;
}
/**
 * Line mapping between versions
 */
export interface LineMapping {
    leftLineNumber: number | null;
    rightLineNumber: number | null;
    changeType: 'add' | 'remove' | 'modify' | 'unchanged';
    leftContent?: string;
    rightContent?: string;
}
/**
 * Comparison report
 */
export interface ComparisonReport {
    documentId: string;
    versionFrom: number;
    versionTo: number;
    comparedAt: Date;
    comparedBy?: string;
    summary: ComparisonSummary;
    sections: ComparisonSection[];
    recommendations?: string[];
}
/**
 * Comparison summary
 */
export interface ComparisonSummary {
    totalChanges: number;
    criticalChanges: number;
    minorChanges: number;
    sectionsModified: string[];
    overallSimilarity: number;
    riskLevel: 'low' | 'medium' | 'high';
}
/**
 * Comparison section
 */
export interface ComparisonSection {
    name: string;
    changes: DiffChange[];
    statistics: ComparisonStatistics;
    annotations?: string[];
}
/**
 * Merge conflict
 */
export interface MergeConflict {
    field: string;
    path: string;
    baseValue: any;
    leftValue: any;
    rightValue: any;
    resolution?: 'left' | 'right' | 'base' | 'custom';
    resolvedValue?: any;
}
/**
 * Comparison options
 */
export interface ComparisonOptions {
    ignoreWhitespace?: boolean;
    ignoreCase?: boolean;
    contextLines?: number;
    showUnchanged?: boolean;
    granularity?: 'line' | 'word' | 'character';
    algorithm?: 'myers' | 'patience' | 'histogram';
}
/**
 * Document version attributes
 */
export interface DocumentVersionAttributes {
    id: string;
    documentId: string;
    version: number;
    content: string;
    contentHash: string;
    metadata: Record<string, any>;
    size: number;
    createdBy: string;
    createdAt: Date;
    comment?: string;
    tags?: string[];
    approved: boolean;
    approvedBy?: string;
    approvedAt?: Date;
}
/**
 * Comparison history attributes
 */
export interface ComparisonHistoryAttributes {
    id: string;
    documentId: string;
    versionFrom: number;
    versionTo: number;
    comparedBy: string;
    comparedAt: Date;
    comparisonType: 'text' | 'visual' | 'structural' | 'metadata';
    statistics: ComparisonStatistics;
    differences: any[];
    reportUrl?: string;
}
/**
 * Change tracking attributes
 */
export interface ChangeTrackingAttributes {
    id: string;
    documentId: string;
    versionId: string;
    changeType: string;
    changes: TrackedChange[];
    changedBy: string;
    changedAt: Date;
    approved: boolean;
    approvedBy?: string;
    approvedAt?: Date;
    comment?: string;
    metadata?: Record<string, any>;
}
/**
 * Creates DocumentVersion model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<DocumentVersionAttributes>>} DocumentVersion model
 *
 * @example
 * ```typescript
 * const VersionModel = createDocumentVersionModel(sequelize);
 * const version = await VersionModel.create({
 *   documentId: 'doc-123',
 *   version: 2,
 *   content: 'Updated document content',
 *   contentHash: 'sha256-hash',
 *   createdBy: 'user-456'
 * });
 * ```
 */
export declare const createDocumentVersionModel: (sequelize: Sequelize) => any;
/**
 * Creates ComparisonHistory model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<ComparisonHistoryAttributes>>} ComparisonHistory model
 *
 * @example
 * ```typescript
 * const HistoryModel = createComparisonHistoryModel(sequelize);
 * await HistoryModel.create({
 *   documentId: 'doc-123',
 *   versionFrom: 1,
 *   versionTo: 2,
 *   comparedBy: 'user-456',
 *   comparisonType: 'text',
 *   statistics: { totalChanges: 15, ... }
 * });
 * ```
 */
export declare const createComparisonHistoryModel: (sequelize: Sequelize) => any;
/**
 * Creates ChangeTracking model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<ChangeTrackingAttributes>>} ChangeTracking model
 *
 * @example
 * ```typescript
 * const TrackingModel = createChangeTrackingModel(sequelize);
 * await TrackingModel.create({
 *   documentId: 'doc-123',
 *   versionId: 'ver-456',
 *   changeType: 'update',
 *   changes: [{ field: 'title', oldValue: 'Old', newValue: 'New' }],
 *   changedBy: 'user-789'
 * });
 * ```
 */
export declare const createChangeTrackingModel: (sequelize: Sequelize) => any;
/**
 * 1. Compares two text documents and generates detailed diff.
 *
 * @param {string} original - Original text content
 * @param {string} modified - Modified text content
 * @param {ComparisonOptions} [options] - Comparison options
 * @returns {Promise<TextComparisonResult>} Detailed comparison result
 *
 * @example
 * ```typescript
 * const result = await compareTextDocuments(originalText, modifiedText, {
 *   ignoreWhitespace: true,
 *   granularity: 'line',
 *   contextLines: 3
 * });
 * console.log(`Similarity: ${result.similarity}%`);
 * ```
 */
export declare const compareTextDocuments: (original: string, modified: string, options?: ComparisonOptions) => Promise<TextComparisonResult>;
/**
 * 2. Generates line-by-line diff between documents.
 *
 * @param {string} original - Original content
 * @param {string} modified - Modified content
 * @param {ComparisonOptions} options - Comparison options
 * @returns {DiffChange[]} Array of line changes
 *
 * @example
 * ```typescript
 * const diff = generateDiff(original, modified, { ignoreWhitespace: true });
 * const addedLines = diff.filter(d => d.type === 'add');
 * ```
 */
export declare const generateDiff: (original: string, modified: string, options: ComparisonOptions) => DiffChange[];
/**
 * 3. Calculates detailed comparison statistics.
 *
 * @param {DiffChange[]} diff - Diff changes
 * @param {string} original - Original content
 * @param {string} modified - Modified content
 * @returns {ComparisonStatistics} Statistics object
 *
 * @example
 * ```typescript
 * const stats = calculateStatistics(diff, original, modified);
 * console.log(`${stats.percentageChanged}% of document changed`);
 * ```
 */
export declare const calculateStatistics: (diff: DiffChange[], original: string, modified: string) => ComparisonStatistics;
/**
 * 4. Calculates similarity percentage between documents.
 *
 * @param {ComparisonStatistics} statistics - Comparison statistics
 * @returns {number} Similarity percentage (0-100)
 *
 * @example
 * ```typescript
 * const similarity = calculateSimilarity(stats);
 * if (similarity > 95) console.log('Documents are nearly identical');
 * ```
 */
export declare const calculateSimilarity: (statistics: ComparisonStatistics) => number;
/**
 * 5. Groups diff changes into hunks with context.
 *
 * @param {DiffChange[]} diff - Array of changes
 * @param {number} contextLines - Number of context lines
 * @returns {DiffHunk[]} Array of hunks
 *
 * @example
 * ```typescript
 * const hunks = groupIntoHunks(diff, 3);
 * hunks.forEach(hunk => {
 *   console.log(`@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@`);
 * });
 * ```
 */
export declare const groupIntoHunks: (diff: DiffChange[], contextLines: number) => DiffHunk[];
/**
 * 6. Creates hunk from changes.
 *
 * @param {DiffChange[]} changes - Changes to group
 * @returns {DiffHunk} Created hunk
 *
 * @example
 * ```typescript
 * const hunk = createHunk(changes);
 * ```
 */
export declare const createHunk: (changes: DiffChange[]) => DiffHunk;
/**
 * 7. Compares documents at word level.
 *
 * @param {string} original - Original text
 * @param {string} modified - Modified text
 * @returns {DiffChange[]} Word-level changes
 *
 * @example
 * ```typescript
 * const wordDiff = compareAtWordLevel(original, modified);
 * ```
 */
export declare const compareAtWordLevel: (original: string, modified: string) => DiffChange[];
/**
 * 8. Compares documents at character level.
 *
 * @param {string} original - Original text
 * @param {string} modified - Modified text
 * @returns {DiffChange[]} Character-level changes
 *
 * @example
 * ```typescript
 * const charDiff = compareAtCharacterLevel(original, modified);
 * ```
 */
export declare const compareAtCharacterLevel: (original: string, modified: string) => DiffChange[];
/**
 * 9. Compares two images and generates visual diff.
 *
 * @param {Buffer} originalImage - Original image buffer
 * @param {Buffer} modifiedImage - Modified image buffer
 * @returns {Promise<VisualComparisonResult>} Visual comparison result
 *
 * @example
 * ```typescript
 * const result = await compareImages(originalBuffer, modifiedBuffer);
 * if (result.similarity < 90) {
 *   console.log('Significant visual changes detected');
 * }
 * ```
 */
export declare const compareImages: (originalImage: Buffer, modifiedImage: Buffer) => Promise<VisualComparisonResult>;
/**
 * 10. Compares PDF documents page by page.
 *
 * @param {Buffer} originalPdf - Original PDF buffer
 * @param {Buffer} modifiedPdf - Modified PDF buffer
 * @returns {Promise<VisualComparisonResult[]>} Per-page comparison results
 *
 * @example
 * ```typescript
 * const pageComparisons = await comparePDFDocuments(originalPdf, modifiedPdf);
 * pageComparisons.forEach((result, page) => {
 *   console.log(`Page ${page + 1}: ${result.similarity}% similar`);
 * });
 * ```
 */
export declare const comparePDFDocuments: (originalPdf: Buffer, modifiedPdf: Buffer) => Promise<VisualComparisonResult[]>;
/**
 * 11. Generates diff image highlighting differences.
 *
 * @param {Buffer} original - Original image
 * @param {Buffer} modified - Modified image
 * @returns {Promise<Buffer>} Diff image buffer
 *
 * @example
 * ```typescript
 * const diffImage = await generateDiffImage(original, modified);
 * await fs.writeFile('diff.png', diffImage);
 * ```
 */
export declare const generateDiffImage: (original: Buffer, modified: Buffer) => Promise<Buffer>;
/**
 * 12. Detects visual regions with differences.
 *
 * @param {Buffer} original - Original image
 * @param {Buffer} modified - Modified image
 * @param {number} threshold - Difference threshold (0-1)
 * @returns {Promise<DifferenceRegion[]>} Detected regions
 *
 * @example
 * ```typescript
 * const regions = await detectDifferenceRegions(original, modified, 0.1);
 * console.log(`Found ${regions.length} changed regions`);
 * ```
 */
export declare const detectDifferenceRegions: (original: Buffer, modified: Buffer, threshold?: number) => Promise<DifferenceRegion[]>;
/**
 * 13. Generates side-by-side comparison view.
 *
 * @param {string} original - Original content
 * @param {string} modified - Modified content
 * @param {ComparisonOptions} [options] - View options
 * @returns {SideBySideView} Side-by-side view data
 *
 * @example
 * ```typescript
 * const view = generateSideBySideView(original, modified);
 * renderView(view.leftContent, view.rightContent, view.lineMapping);
 * ```
 */
export declare const generateSideBySideView: (original: string, modified: string, options?: ComparisonOptions) => SideBySideView;
/**
 * 14. Generates unified diff view.
 *
 * @param {string} original - Original content
 * @param {string} modified - Modified content
 * @returns {string} Unified diff format
 *
 * @example
 * ```typescript
 * const unifiedDiff = generateUnifiedDiff(original, modified);
 * console.log(unifiedDiff);
 * ```
 */
export declare const generateUnifiedDiff: (original: string, modified: string) => string;
/**
 * 15. Generates HTML side-by-side view.
 *
 * @param {SideBySideView} view - View data
 * @returns {string} HTML markup
 *
 * @example
 * ```typescript
 * const html = generateHTMLSideBySideView(view);
 * res.send(html);
 * ```
 */
export declare const generateHTMLSideBySideView: (view: SideBySideView) => string;
/**
 * 16. Escapes HTML special characters.
 *
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 *
 * @example
 * ```typescript
 * const safe = escapeHtml('<script>alert("xss")</script>');
 * ```
 */
export declare const escapeHtml: (text: string) => string;
/**
 * 17. Tracks document changes with audit trail.
 *
 * @param {any} DocumentVersionModel - DocumentVersion model
 * @param {string} documentId - Document ID
 * @param {any} oldVersion - Previous version data
 * @param {any} newVersion - New version data
 * @param {string} userId - User making changes
 * @returns {Promise<ChangeTrackingEntry>} Tracking entry
 *
 * @example
 * ```typescript
 * const entry = await trackDocumentChanges(VersionModel, 'doc-123', oldVer, newVer, 'user-456');
 * ```
 */
export declare const trackDocumentChanges: (DocumentVersionModel: any, documentId: string, oldVersion: any, newVersion: any, userId: string) => Promise<ChangeTrackingEntry>;
/**
 * 18. Detects field-level changes between objects.
 *
 * @param {any} oldObj - Old object
 * @param {any} newObj - New object
 * @returns {TrackedChange[]} Detected changes
 *
 * @example
 * ```typescript
 * const changes = detectChanges(oldDocument, newDocument);
 * changes.forEach(c => console.log(`${c.field}: ${c.oldValue} → ${c.newValue}`));
 * ```
 */
export declare const detectChanges: (oldObj: any, newObj: any) => TrackedChange[];
/**
 * 19. Retrieves change history for document.
 *
 * @param {any} ChangeTrackingModel - ChangeTracking model
 * @param {string} documentId - Document ID
 * @param {FindOptions} [options] - Query options
 * @returns {Promise<ChangeTrackingEntry[]>} Change history
 *
 * @example
 * ```typescript
 * const history = await getChangeHistory(TrackingModel, 'doc-123', {
 *   order: [['changedAt', 'DESC']],
 *   limit: 50
 * });
 * ```
 */
export declare const getChangeHistory: (ChangeTrackingModel: any, documentId: string, options?: FindOptions) => Promise<ChangeTrackingEntry[]>;
/**
 * 20. Approves tracked changes.
 *
 * @param {any} ChangeTrackingModel - ChangeTracking model
 * @param {string} changeId - Change tracking ID
 * @param {string} approverId - Approver user ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await approveChanges(TrackingModel, 'change-123', 'approver-456');
 * ```
 */
export declare const approveChanges: (ChangeTrackingModel: any, changeId: string, approverId: string) => Promise<void>;
/**
 * 21. Generates comprehensive comparison report.
 *
 * @param {string} documentId - Document ID
 * @param {number} versionFrom - Starting version
 * @param {number} versionTo - Ending version
 * @param {TextComparisonResult} comparison - Comparison result
 * @param {string} userId - User generating report
 * @returns {ComparisonReport} Generated report
 *
 * @example
 * ```typescript
 * const report = generateComparisonReport('doc-123', 1, 2, comparisonResult, 'user-456');
 * ```
 */
export declare const generateComparisonReport: (documentId: string, versionFrom: number, versionTo: number, comparison: TextComparisonResult, userId: string) => ComparisonReport;
/**
 * 22. Saves comparison to history.
 *
 * @param {any} ComparisonHistoryModel - ComparisonHistory model
 * @param {ComparisonReport} report - Comparison report
 * @param {TextComparisonResult} result - Comparison result
 * @returns {Promise<any>} Saved history record
 *
 * @example
 * ```typescript
 * await saveComparisonHistory(HistoryModel, report, comparisonResult);
 * ```
 */
export declare const saveComparisonHistory: (ComparisonHistoryModel: any, report: ComparisonReport, result: TextComparisonResult) => Promise<any>;
/**
 * 23. Retrieves comparison history with pagination.
 *
 * @param {any} ComparisonHistoryModel - ComparisonHistory model
 * @param {string} documentId - Document ID
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<{ rows: any[]; count: number }>} Paginated results
 *
 * @example
 * ```typescript
 * const { rows, count } = await getComparisonHistory(HistoryModel, 'doc-123', 1, 20);
 * ```
 */
export declare const getComparisonHistory: (ComparisonHistoryModel: any, documentId: string, page?: number, limit?: number) => Promise<{
    rows: any[];
    count: number;
}>;
/**
 * 24. Generates statistical summary of changes.
 *
 * @param {any} DocumentVersionModel - DocumentVersion model
 * @param {string} documentId - Document ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<any>} Change statistics
 *
 * @example
 * ```typescript
 * const stats = await generateChangeStatistics(VersionModel, 'doc-123', startDate, endDate);
 * ```
 */
export declare const generateChangeStatistics: (DocumentVersionModel: any, documentId: string, startDate: Date, endDate: Date) => Promise<any>;
/**
 * 25. Generates overlay mode comparison.
 *
 * @param {string} original - Original content
 * @param {string} modified - Modified content
 * @returns {string} HTML with overlay highlights
 *
 * @example
 * ```typescript
 * const overlay = generateOverlayComparison(original, modified);
 * ```
 */
export declare const generateOverlayComparison: (original: string, modified: string) => string;
/**
 * 26. Highlights specific changes in text.
 *
 * @param {string} content - Content to highlight
 * @param {DiffChange[]} changes - Changes to highlight
 * @returns {string} HTML with highlighted changes
 *
 * @example
 * ```typescript
 * const highlighted = highlightChanges(content, changes);
 * ```
 */
export declare const highlightChanges: (content: string, changes: DiffChange[]) => string;
/**
 * 27. Generates inline diff with word-level highlighting.
 *
 * @param {string} oldText - Original text
 * @param {string} newText - Modified text
 * @returns {string} HTML with inline highlighting
 *
 * @example
 * ```typescript
 * const inline = generateInlineDiff(oldLine, newLine);
 * ```
 */
export declare const generateInlineDiff: (oldText: string, newText: string) => string;
/**
 * 28. Detects merge conflicts between versions.
 *
 * @param {any} base - Base version
 * @param {any} left - Left version (current)
 * @param {any} right - Right version (incoming)
 * @returns {MergeConflict[]} Detected conflicts
 *
 * @example
 * ```typescript
 * const conflicts = detectMergeConflicts(baseVersion, currentVersion, incomingVersion);
 * ```
 */
export declare const detectMergeConflicts: (base: any, left: any, right: any) => MergeConflict[];
/**
 * 29. Resolves merge conflicts.
 *
 * @param {MergeConflict[]} conflicts - Conflicts to resolve
 * @param {Record<string, 'left' | 'right' | 'base' | 'custom'>} resolutions - Resolution strategy per field
 * @returns {any} Resolved object
 *
 * @example
 * ```typescript
 * const resolved = resolveMergeConflicts(conflicts, {
 *   title: 'left',
 *   description: 'right'
 * });
 * ```
 */
export declare const resolveMergeConflicts: (conflicts: MergeConflict[], resolutions: Record<string, "left" | "right" | "base" | "custom">) => any;
/**
 * 30. Three-way merge of documents.
 *
 * @param {string} base - Base version content
 * @param {string} left - Left version content
 * @param {string} right - Right version content
 * @returns {Promise<{ merged: string; conflicts: MergeConflict[] }>} Merge result
 *
 * @example
 * ```typescript
 * const { merged, conflicts } = await threeWayMerge(base, current, incoming);
 * ```
 */
export declare const threeWayMerge: (base: string, left: string, right: string) => Promise<{
    merged: string;
    conflicts: MergeConflict[];
}>;
/**
 * 31. Finds versions with specific changes.
 *
 * @param {any} DocumentVersionModel - DocumentVersion model
 * @param {string} documentId - Document ID
 * @param {WhereOptions} changeFilter - Filter for changes
 * @returns {Promise<any[]>} Matching versions
 *
 * @example
 * ```typescript
 * const versions = await findVersionsWithChanges(VersionModel, 'doc-123', {
 *   'metadata.section': 'diagnosis'
 * });
 * ```
 */
export declare const findVersionsWithChanges: (DocumentVersionModel: any, documentId: string, changeFilter: WhereOptions) => Promise<any[]>;
/**
 * 32. Retrieves version differences.
 *
 * @param {any} DocumentVersionModel - DocumentVersion model
 * @param {string} documentId - Document ID
 * @param {number} versionFrom - From version
 * @param {number} versionTo - To version
 * @returns {Promise<TextComparisonResult>} Comparison result
 *
 * @example
 * ```typescript
 * const diff = await getVersionDifference(VersionModel, 'doc-123', 1, 3);
 * ```
 */
export declare const getVersionDifference: (DocumentVersionModel: any, documentId: string, versionFrom: number, versionTo: number) => Promise<TextComparisonResult>;
/**
 * 33. Gets versions by user with changes.
 *
 * @param {any} DocumentVersionModel - DocumentVersion model
 * @param {string} userId - User ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<any[]>} User's versions
 *
 * @example
 * ```typescript
 * const userVersions = await getVersionsByUser(VersionModel, 'user-123', startDate, endDate);
 * ```
 */
export declare const getVersionsByUser: (DocumentVersionModel: any, userId: string, startDate: Date, endDate: Date) => Promise<any[]>;
/**
 * 34. Filters versions by approval status.
 *
 * @param {any} DocumentVersionModel - DocumentVersion model
 * @param {string} documentId - Document ID
 * @param {boolean} approved - Approval status
 * @returns {Promise<any[]>} Filtered versions
 *
 * @example
 * ```typescript
 * const unapprovedVersions = await filterVersionsByApproval(VersionModel, 'doc-123', false);
 * ```
 */
export declare const filterVersionsByApproval: (DocumentVersionModel: any, documentId: string, approved: boolean) => Promise<any[]>;
/**
 * 35. Compares JSON documents with deep diff.
 *
 * @param {any} original - Original JSON object
 * @param {any} modified - Modified JSON object
 * @returns {any} JSON diff
 *
 * @example
 * ```typescript
 * const jsonDiff = compareJSONDocuments(originalData, modifiedData);
 * ```
 */
export declare const compareJSONDocuments: (original: any, modified: any) => any;
/**
 * 36. Compares XML documents.
 *
 * @param {string} originalXml - Original XML
 * @param {string} modifiedXml - Modified XML
 * @returns {Promise<DiffChange[]>} XML differences
 *
 * @example
 * ```typescript
 * const xmlDiff = await compareXMLDocuments(originalXml, modifiedXml);
 * ```
 */
export declare const compareXMLDocuments: (originalXml: string, modifiedXml: string) => Promise<DiffChange[]>;
/**
 * 37. Compares structured data (tables, lists).
 *
 * @param {any[]} originalData - Original structured data
 * @param {any[]} modifiedData - Modified structured data
 * @returns {DiffChange[]} Structural differences
 *
 * @example
 * ```typescript
 * const tableDiff = compareStructuredData(originalTable, modifiedTable);
 * ```
 */
export declare const compareStructuredData: (originalData: any[], modifiedData: any[]) => DiffChange[];
/**
 * 38. Exports comparison as various formats.
 *
 * @param {TextComparisonResult} comparison - Comparison result
 * @param {'html' | 'pdf' | 'json' | 'markdown'} format - Export format
 * @returns {Promise<Buffer | string>} Exported comparison
 *
 * @example
 * ```typescript
 * const pdfReport = await exportComparison(comparison, 'pdf');
 * await fs.writeFile('comparison.pdf', pdfReport);
 * ```
 */
export declare const exportComparison: (comparison: TextComparisonResult, format: "html" | "pdf" | "json" | "markdown") => Promise<Buffer | string>;
/**
 * 39. Generates HTML comparison report.
 *
 * @param {TextComparisonResult} comparison - Comparison result
 * @returns {string} HTML report
 *
 * @example
 * ```typescript
 * const html = generateHTMLComparisonReport(comparison);
 * ```
 */
export declare const generateHTMLComparisonReport: (comparison: TextComparisonResult) => string;
/**
 * 40. Generates markdown comparison.
 *
 * @param {TextComparisonResult} comparison - Comparison result
 * @returns {string} Markdown format
 *
 * @example
 * ```typescript
 * const markdown = generateMarkdownComparison(comparison);
 * ```
 */
export declare const generateMarkdownComparison: (comparison: TextComparisonResult) => string;
declare const _default: {
    compareTextDocuments: (original: string, modified: string, options?: ComparisonOptions) => Promise<TextComparisonResult>;
    generateDiff: (original: string, modified: string, options: ComparisonOptions) => DiffChange[];
    calculateStatistics: (diff: DiffChange[], original: string, modified: string) => ComparisonStatistics;
    calculateSimilarity: (statistics: ComparisonStatistics) => number;
    groupIntoHunks: (diff: DiffChange[], contextLines: number) => DiffHunk[];
    createHunk: (changes: DiffChange[]) => DiffHunk;
    compareAtWordLevel: (original: string, modified: string) => DiffChange[];
    compareAtCharacterLevel: (original: string, modified: string) => DiffChange[];
    compareImages: (originalImage: Buffer, modifiedImage: Buffer) => Promise<VisualComparisonResult>;
    comparePDFDocuments: (originalPdf: Buffer, modifiedPdf: Buffer) => Promise<VisualComparisonResult[]>;
    generateDiffImage: (original: Buffer, modified: Buffer) => Promise<Buffer>;
    detectDifferenceRegions: (original: Buffer, modified: Buffer, threshold?: number) => Promise<DifferenceRegion[]>;
    generateSideBySideView: (original: string, modified: string, options?: ComparisonOptions) => SideBySideView;
    generateUnifiedDiff: (original: string, modified: string) => string;
    generateHTMLSideBySideView: (view: SideBySideView) => string;
    escapeHtml: (text: string) => string;
    trackDocumentChanges: (DocumentVersionModel: any, documentId: string, oldVersion: any, newVersion: any, userId: string) => Promise<ChangeTrackingEntry>;
    detectChanges: (oldObj: any, newObj: any) => TrackedChange[];
    getChangeHistory: (ChangeTrackingModel: any, documentId: string, options?: FindOptions) => Promise<ChangeTrackingEntry[]>;
    approveChanges: (ChangeTrackingModel: any, changeId: string, approverId: string) => Promise<void>;
    generateComparisonReport: (documentId: string, versionFrom: number, versionTo: number, comparison: TextComparisonResult, userId: string) => ComparisonReport;
    saveComparisonHistory: (ComparisonHistoryModel: any, report: ComparisonReport, result: TextComparisonResult) => Promise<any>;
    getComparisonHistory: (ComparisonHistoryModel: any, documentId: string, page?: number, limit?: number) => Promise<{
        rows: any[];
        count: number;
    }>;
    generateChangeStatistics: (DocumentVersionModel: any, documentId: string, startDate: Date, endDate: Date) => Promise<any>;
    generateOverlayComparison: (original: string, modified: string) => string;
    highlightChanges: (content: string, changes: DiffChange[]) => string;
    generateInlineDiff: (oldText: string, newText: string) => string;
    detectMergeConflicts: (base: any, left: any, right: any) => MergeConflict[];
    resolveMergeConflicts: (conflicts: MergeConflict[], resolutions: Record<string, "left" | "right" | "base" | "custom">) => any;
    threeWayMerge: (base: string, left: string, right: string) => Promise<{
        merged: string;
        conflicts: MergeConflict[];
    }>;
    findVersionsWithChanges: (DocumentVersionModel: any, documentId: string, changeFilter: WhereOptions) => Promise<any[]>;
    getVersionDifference: (DocumentVersionModel: any, documentId: string, versionFrom: number, versionTo: number) => Promise<TextComparisonResult>;
    getVersionsByUser: (DocumentVersionModel: any, userId: string, startDate: Date, endDate: Date) => Promise<any[]>;
    filterVersionsByApproval: (DocumentVersionModel: any, documentId: string, approved: boolean) => Promise<any[]>;
    compareJSONDocuments: (original: any, modified: any) => any;
    compareXMLDocuments: (originalXml: string, modifiedXml: string) => Promise<DiffChange[]>;
    compareStructuredData: (originalData: any[], modifiedData: any[]) => DiffChange[];
    exportComparison: (comparison: TextComparisonResult, format: "html" | "pdf" | "json" | "markdown") => Promise<Buffer | string>;
    generateHTMLComparisonReport: (comparison: TextComparisonResult) => string;
    generateMarkdownComparison: (comparison: TextComparisonResult) => string;
    createDocumentVersionModel: (sequelize: Sequelize) => any;
    createComparisonHistoryModel: (sequelize: Sequelize) => any;
    createChangeTrackingModel: (sequelize: Sequelize) => any;
};
export default _default;
//# sourceMappingURL=document-comparison-kit.d.ts.map