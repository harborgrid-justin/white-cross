/**
 * LOC: DOC-COMP-REDACT-001
 * File: /reuse/document/composites/document-comparison-redaction-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - @nestjs/swagger (v7.x)
 *   - sequelize-typescript (v2.x)
 *   - sequelize (v6.x)
 *   - crypto (Node.js built-in)
 *   - ../document-comparison-kit
 *   - ../document-redaction-kit
 *   - ../document-versioning-kit
 *   - ../document-pii-detection-kit
 *
 * DOWNSTREAM (imported by):
 *   - Document version control services
 *   - Redaction and privacy compliance modules
 *   - Document comparison engines
 *   - HIPAA compliance controllers
 *   - Version merge and rollback services
 */
/**
 * File: /reuse/document/composites/document-comparison-redaction-composite.ts
 * Locator: WC-COMP-COMPARE-REDACT-001
 * Purpose: Document Comparison, Versioning, and Redaction Composite - Production-grade document comparison, PII/PHI redaction, and version control
 *
 * Upstream: @nestjs/common, @nestjs/swagger, sequelize-typescript, comparison/redaction/versioning/PII-detection kits
 * Downstream: Version control services, Redaction modules, Comparison engines, Compliance controllers
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, Node 18+, diff-match-patch, natural
 * Exports: 40 composed functions for comprehensive document comparison, redaction, versioning, and PII detection
 *
 * LLM Context: Production-grade document comparison and redaction composite for White Cross healthcare platform.
 * Composes functions from comparison, redaction, versioning, and PII detection kits to provide complete document
 * lifecycle management including text/visual/semantic comparison, automatic PII/PHI detection and redaction,
 * version control with branching and merging, change tracking with audit trails, HIPAA-compliant sanitization,
 * and reversible/permanent redaction strategies. Essential for regulatory compliance, document evolution tracking,
 * and privacy protection in healthcare document workflows.
 */
import { Model } from 'sequelize-typescript';
/**
 * Document comparison types
 */
export declare enum ComparisonType {
    TEXT = "TEXT",
    VISUAL = "VISUAL",
    SEMANTIC = "SEMANTIC",
    STRUCTURAL = "STRUCTURAL",
    METADATA = "METADATA"
}
/**
 * Change types for document comparison
 */
export declare enum ChangeType {
    ADDED = "ADDED",
    DELETED = "DELETED",
    MODIFIED = "MODIFIED",
    MOVED = "MOVED",
    REPLACED = "REPLACED"
}
/**
 * Redaction categories
 */
export declare enum RedactionCategory {
    PII = "PII",
    PHI = "PHI",
    FINANCIAL = "FINANCIAL",
    CONFIDENTIAL = "CONFIDENTIAL",
    CUSTOM = "CUSTOM"
}
/**
 * PII/PHI entity types
 */
export declare enum EntityType {
    SSN = "SSN",
    EMAIL = "EMAIL",
    PHONE = "PHONE",
    ADDRESS = "ADDRESS",
    NAME = "NAME",
    DOB = "DOB",
    MRN = "MRN",
    CREDIT_CARD = "CREDIT_CARD",
    BANK_ACCOUNT = "BANK_ACCOUNT",
    DRIVER_LICENSE = "DRIVER_LICENSE",
    PASSPORT = "PASSPORT",
    CUSTOM = "CUSTOM"
}
/**
 * Redaction strategy
 */
export declare enum RedactionStrategy {
    PERMANENT = "PERMANENT",
    REVERSIBLE = "REVERSIBLE",
    TEMPORARY = "TEMPORARY",
    CONDITIONAL = "CONDITIONAL"
}
/**
 * Version control status
 */
export declare enum VersionStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    ARCHIVED = "ARCHIVED",
    DEPRECATED = "DEPRECATED"
}
/**
 * Document comparison result
 */
export interface ComparisonResult {
    id: string;
    document1Id: string;
    document2Id: string;
    comparisonType: ComparisonType;
    similarityScore: number;
    changes: DocumentChange[];
    summary: ComparisonSummary;
    createdAt: Date;
    metadata?: Record<string, any>;
}
/**
 * Individual document change
 */
export interface DocumentChange {
    id: string;
    type: ChangeType;
    position: ChangePosition;
    oldContent?: string;
    newContent?: string;
    confidence: number;
    context?: string;
}
/**
 * Change position in document
 */
export interface ChangePosition {
    pageNumber?: number;
    lineNumber?: number;
    characterStart?: number;
    characterEnd?: number;
    boundingBox?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}
/**
 * Comparison summary statistics
 */
export interface ComparisonSummary {
    totalChanges: number;
    addedCount: number;
    deletedCount: number;
    modifiedCount: number;
    movedCount: number;
    replacedCount: number;
    unchangedPercentage: number;
}
/**
 * Detected PII/PHI entity
 */
export interface DetectedEntity {
    id: string;
    type: EntityType;
    value: string;
    position: ChangePosition;
    confidence: number;
    category: RedactionCategory;
    context?: string;
}
/**
 * Redaction configuration
 */
export interface RedactionConfig {
    strategy: RedactionStrategy;
    categories: RedactionCategory[];
    entityTypes: EntityType[];
    replacement: string;
    preserveLength: boolean;
    auditTrail: boolean;
    reversibilityKey?: string;
}
/**
 * Redaction result
 */
export interface RedactionResult {
    id: string;
    documentId: string;
    redactedDocument: Buffer;
    detectedEntities: DetectedEntity[];
    redactionCount: number;
    strategy: RedactionStrategy;
    reversibilityKey?: string;
    audit: RedactionAudit;
    createdAt: Date;
}
/**
 * Redaction audit information
 */
export interface RedactionAudit {
    performedBy: string;
    timestamp: Date;
    entitiesRedacted: number;
    categories: RedactionCategory[];
    reversible: boolean;
    complianceStandards: string[];
}
/**
 * Redaction pattern template
 */
export interface RedactionPattern {
    id: string;
    name: string;
    pattern: string | RegExp;
    replacement: string;
    category: RedactionCategory;
    entityType: EntityType;
    enabled: boolean;
}
/**
 * Document version information
 */
export interface DocumentVersion {
    id: string;
    documentId: string;
    versionNumber: number;
    content: Buffer;
    hash: string;
    status: VersionStatus;
    createdBy: string;
    createdAt: Date;
    changes?: string;
    parentVersionId?: string;
    branchName?: string;
    metadata?: Record<string, any>;
}
/**
 * Version merge configuration
 */
export interface VersionMergeConfig {
    baseVersionId: string;
    sourceVersionId: string;
    targetVersionId: string;
    conflictResolution: 'MANUAL' | 'BASE' | 'SOURCE' | 'TARGET' | 'AUTO';
    preserveHistory: boolean;
}
/**
 * Version conflict
 */
export interface VersionConflict {
    id: string;
    position: ChangePosition;
    baseContent: string;
    sourceContent: string;
    targetContent: string;
    resolution?: string;
    resolvedBy?: string;
}
/**
 * Comparison Result Model
 * Stores document comparison results
 */
export declare class ComparisonResultModel extends Model {
    id: string;
    document1Id: string;
    document2Id: string;
    comparisonType: ComparisonType;
    similarityScore: number;
    changes: DocumentChange[];
    summary: ComparisonSummary;
    metadata?: Record<string, any>;
}
/**
 * Redaction Result Model
 * Stores document redaction results
 */
export declare class RedactionResultModel extends Model {
    id: string;
    documentId: string;
    redactedDocument: Buffer;
    detectedEntities: DetectedEntity[];
    redactionCount: number;
    strategy: RedactionStrategy;
    reversibilityKey?: string;
    audit: RedactionAudit;
}
/**
 * Document Version Model
 * Stores document version history
 */
export declare class DocumentVersionModel extends Model {
    id: string;
    documentId: string;
    versionNumber: number;
    content: Buffer;
    hash: string;
    status: VersionStatus;
    createdBy: string;
    changes?: string;
    parentVersionId?: string;
    branchName?: string;
    metadata?: Record<string, any>;
}
/**
 * Redaction Pattern Model
 * Stores reusable redaction patterns
 */
export declare class RedactionPatternModel extends Model {
    id: string;
    name: string;
    pattern: string;
    replacement: string;
    category: RedactionCategory;
    entityType: EntityType;
    enabled: boolean;
}
/**
 * 1. Compares two documents and returns detailed differences.
 *
 * @param {Buffer} document1 - First document buffer
 * @param {Buffer} document2 - Second document buffer
 * @param {ComparisonType} comparisonType - Type of comparison to perform
 * @returns {Promise<ComparisonResult>} Comparison result with changes
 * @throws {BadRequestException} If documents are empty or invalid format
 *
 * @example
 * ```typescript
 * const result = await compareDocuments(doc1Buffer, doc2Buffer, ComparisonType.TEXT);
 * console.log(`Similarity: ${result.similarityScore}%`);
 * console.log(`Changes: ${result.changes.length}`);
 * ```
 */
export declare const compareDocuments: (document1: Buffer, document2: Buffer, comparisonType?: ComparisonType) => Promise<ComparisonResult>;
/**
 * 2. Detects PII/PHI entities in document text.
 *
 * @param {string} text - Document text to analyze
 * @param {EntityType[]} [entityTypes] - Specific entity types to detect
 * @returns {Promise<{ patterns: DetectedEntity[]; count: number }>} Detected entities
 * @throws {BadRequestException} If text is empty
 *
 * @example
 * ```typescript
 * const detection = await detectPII(documentText, [EntityType.SSN, EntityType.EMAIL]);
 * console.log(`Found ${detection.count} PII entities`);
 * detection.patterns.forEach(entity => {
 *   console.log(`${entity.type}: ${entity.value}`);
 * });
 * ```
 */
export declare const detectPII: (text: string, entityTypes?: EntityType[]) => Promise<{
    patterns: DetectedEntity[];
    count: number;
}>;
/**
 * 3. Redacts PHI/PII from document using specified strategy.
 *
 * @param {Buffer} document - Document to redact
 * @param {RedactionConfig} config - Redaction configuration
 * @returns {Promise<Buffer>} Redacted document
 * @throws {BadRequestException} If document is empty or config invalid
 *
 * @example
 * ```typescript
 * const redacted = await redactPHI(documentBuffer, {
 *   strategy: RedactionStrategy.REVERSIBLE,
 *   categories: [RedactionCategory.PHI],
 *   entityTypes: [EntityType.SSN, EntityType.MRN],
 *   replacement: '[REDACTED]',
 *   preserveLength: false,
 *   auditTrail: true
 * });
 * ```
 */
export declare const redactPHI: (document: Buffer, config: RedactionConfig) => Promise<Buffer>;
/**
 * 4. Calculates similarity score between two documents.
 *
 * @param {Buffer} document1 - First document
 * @param {Buffer} document2 - Second document
 * @returns {Promise<number>} Similarity score (0-100)
 * @throws {BadRequestException} If documents are empty
 *
 * @example
 * ```typescript
 * const similarity = await calculateSimilarity(doc1, doc2);
 * console.log(`Documents are ${similarity}% similar`);
 * ```
 */
export declare const calculateSimilarity: (document1: Buffer, document2: Buffer) => Promise<number>;
/**
 * 5. Generates visual diff highlighting for document comparison.
 *
 * @param {Buffer} document1 - Original document
 * @param {Buffer} document2 - Modified document
 * @returns {Promise<string>} HTML diff visualization
 * @throws {BadRequestException} If documents are empty
 *
 * @example
 * ```typescript
 * const htmlDiff = await generateVisualDiff(originalDoc, modifiedDoc);
 * // Returns HTML with <span class="added">, <span class="deleted">, etc.
 * ```
 */
export declare const generateVisualDiff: (document1: Buffer, document2: Buffer) => Promise<string>;
/**
 * 6. Creates a new version of a document.
 *
 * @param {string} documentId - Document identifier
 * @param {Buffer} data - Document content
 * @param {string} createdBy - User creating version
 * @param {string} [changes] - Description of changes
 * @returns {Promise<{ versionId: string; versionNumber: number }>} Version information
 * @throws {BadRequestException} If document data is empty
 *
 * @example
 * ```typescript
 * const version = await createVersion('doc-123', updatedContent, 'user-456', 'Updated diagnosis section');
 * console.log(`Created version ${version.versionNumber}`);
 * ```
 */
export declare const createVersion: (documentId: string, data: Buffer, createdBy: string, changes?: string) => Promise<{
    versionId: string;
    versionNumber: number;
}>;
/**
 * 7. Tracks and logs document changes for audit trail.
 *
 * @param {DocumentChange[]} changes - Changes to track
 * @param {string} documentId - Document identifier
 * @param {string} userId - User making changes
 * @returns {Promise<{ logId: string; changeCount: number }>} Change log information
 * @throws {BadRequestException} If changes array is empty
 *
 * @example
 * ```typescript
 * const log = await trackChanges(detectedChanges, 'doc-123', 'user-456');
 * console.log(`Logged ${log.changeCount} changes`);
 * ```
 */
export declare const trackChanges: (changes: DocumentChange[], documentId: string, userId: string) => Promise<{
    logId: string;
    changeCount: number;
}>;
/**
 * 8. Merges two document versions into one.
 *
 * @param {Buffer} baseDocument - Base document
 * @param {Buffer} version1 - First version to merge
 * @param {Buffer} version2 - Second version to merge
 * @param {VersionMergeConfig} [config] - Merge configuration
 * @returns {Promise<Buffer>} Merged document
 * @throws {BadRequestException} If documents are empty or merge conflicts exist
 *
 * @example
 * ```typescript
 * const merged = await mergeVersions(base, v1, v2, {
 *   conflictResolution: 'AUTO',
 *   preserveHistory: true
 * });
 * ```
 */
export declare const mergeVersions: (baseDocument: Buffer, version1: Buffer, version2: Buffer, config?: Partial<VersionMergeConfig>) => Promise<Buffer>;
/**
 * 9. Rolls back document to a previous version.
 *
 * @param {string} documentId - Document identifier
 * @param {string} versionId - Version to rollback to
 * @returns {Promise<{ success: boolean; versionNumber: number }>} Rollback result
 * @throws {NotFoundException} If version not found
 *
 * @example
 * ```typescript
 * const rollback = await rollbackVersion('doc-123', 'version-456');
 * console.log(`Rolled back to version ${rollback.versionNumber}`);
 * ```
 */
export declare const rollbackVersion: (documentId: string, versionId: string) => Promise<{
    success: boolean;
    versionNumber: number;
}>;
/**
 * 10. Creates a reusable redaction template.
 *
 * @param {string} name - Template name
 * @param {RedactionPattern[]} patterns - Redaction patterns
 * @returns {Promise<{ templateId: string; patternCount: number }>} Template information
 * @throws {BadRequestException} If patterns array is empty
 *
 * @example
 * ```typescript
 * const template = await createRedactionTemplate('HIPAA-PHI', [
 *   { pattern: /\d{3}-\d{2}-\d{4}/, entityType: EntityType.SSN, category: RedactionCategory.PHI },
 *   { pattern: /\d{10}/, entityType: EntityType.MRN, category: RedactionCategory.PHI }
 * ]);
 * ```
 */
export declare const createRedactionTemplate: (name: string, patterns: Omit<RedactionPattern, "id">[]) => Promise<{
    templateId: string;
    patternCount: number;
}>;
/**
 * 11. Applies redaction template to document.
 *
 * @param {Buffer} document - Document to redact
 * @param {string} templateId - Template identifier
 * @returns {Promise<Buffer>} Redacted document
 * @throws {NotFoundException} If template not found
 *
 * @example
 * ```typescript
 * const redacted = await applyTemplate(document, 'template-123');
 * ```
 */
export declare const applyTemplate: (document: Buffer, templateId: string) => Promise<Buffer>;
/**
 * 12. Verifies completeness of redaction.
 *
 * @param {Buffer} document - Redacted document
 * @param {RedactionCategory[]} categories - Categories to verify
 * @returns {Promise<{ complete: boolean; remainingPII: number }>} Verification result
 *
 * @example
 * ```typescript
 * const verification = await verifyRedaction(redactedDoc, [RedactionCategory.PHI]);
 * if (!verification.complete) {
 *   console.warn(`${verification.remainingPII} PII items remain`);
 * }
 * ```
 */
export declare const verifyRedaction: (document: Buffer, categories: RedactionCategory[]) => Promise<{
    complete: boolean;
    remainingPII: number;
}>;
/**
 * 13. Generates redaction compliance report.
 *
 * @param {string} redactionId - Redaction result identifier
 * @returns {Promise<{ reportId: string; summary: Record<string, any> }>} Compliance report
 * @throws {NotFoundException} If redaction result not found
 *
 * @example
 * ```typescript
 * const report = await generateReport('redaction-123');
 * console.log(report.summary);
 * ```
 */
export declare const generateReport: (redactionId: string) => Promise<{
    reportId: string;
    summary: Record<string, any>;
}>;
/**
 * 14. Compares original and redacted documents.
 *
 * @param {Buffer} original - Original document
 * @param {Buffer} redacted - Redacted document
 * @returns {Promise<{ coverage: number; redactedAreas: number }>} Comparison result
 *
 * @example
 * ```typescript
 * const comparison = await compareRedacted(originalDoc, redactedDoc);
 * console.log(`Redaction coverage: ${comparison.coverage}%`);
 * ```
 */
export declare const compareRedacted: (original: Buffer, redacted: Buffer) => Promise<{
    coverage: number;
    redactedAreas: number;
}>;
/**
 * 15. Performs bulk redaction on multiple documents.
 *
 * @param {string[]} documentIds - Document identifiers
 * @param {RedactionConfig} config - Redaction configuration
 * @returns {Promise<{ processed: number; failed: number }>} Bulk redaction result
 *
 * @example
 * ```typescript
 * const bulk = await bulkRedact(['doc1', 'doc2', 'doc3'], config);
 * console.log(`Processed ${bulk.processed} documents`);
 * ```
 */
export declare const bulkRedact: (documentIds: string[], config: RedactionConfig) => Promise<{
    processed: number;
    failed: number;
}>;
/**
 * 16. Sanitizes document metadata.
 *
 * @param {Record<string, any>} metadata - Document metadata
 * @param {EntityType[]} entityTypes - Entity types to sanitize
 * @returns {Promise<Record<string, any>>} Sanitized metadata
 *
 * @example
 * ```typescript
 * const clean = await sanitizeMeta(docMetadata, [EntityType.EMAIL, EntityType.PHONE]);
 * ```
 */
export declare const sanitizeMeta: (metadata: Record<string, any>, entityTypes: EntityType[]) => Promise<Record<string, any>>;
/**
 * 17. Detects version conflicts during merge.
 *
 * @param {DocumentVersion} version1 - First version
 * @param {DocumentVersion} version2 - Second version
 * @returns {Promise<{ conflicts: VersionConflict[] }>} Detected conflicts
 *
 * @example
 * ```typescript
 * const result = await detectConflicts(v1, v2);
 * if (result.conflicts.length > 0) {
 *   console.log('Manual resolution required');
 * }
 * ```
 */
export declare const detectConflicts: (version1: DocumentVersion, version2: DocumentVersion) => Promise<{
    conflicts: VersionConflict[];
}>;
/**
 * 18. Highlights changes in document for visualization.
 *
 * @param {DocumentChange[]} changes - Changes to highlight
 * @returns {Promise<string>} HTML with highlighted changes
 *
 * @example
 * ```typescript
 * const html = await highlightChanges(comparisonResult.changes);
 * ```
 */
export declare const highlightChanges: (changes: DocumentChange[]) => Promise<string>;
/**
 * 19. Extracts text content from document for analysis.
 *
 * @param {Buffer} document - Document buffer
 * @returns {Promise<string>} Extracted text
 * @throws {BadRequestException} If document is empty
 *
 * @example
 * ```typescript
 * const text = await extractContent(pdfBuffer);
 * ```
 */
export declare const extractContent: (document: Buffer) => Promise<string>;
/**
 * 20. Validates document integrity after redaction.
 *
 * @param {Buffer} document - Redacted document
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateIntegrity(redactedDoc);
 * if (!validation.valid) {
 *   console.error(validation.errors);
 * }
 * ```
 */
export declare const validateIntegrity: (document: Buffer) => Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * 21. Creates comparison report document.
 *
 * @param {ComparisonResult} result - Comparison result
 * @returns {Promise<{ id: string; report: Buffer }>} Report document
 *
 * @example
 * ```typescript
 * const report = await createReport(comparisonResult);
 * ```
 */
export declare const createReport: (result: ComparisonResult) => Promise<{
    id: string;
    report: Buffer;
}>;
/**
 * 22. Creates a new version branch.
 *
 * @param {string} documentId - Document identifier
 * @param {string} branchName - Branch name
 * @param {string} sourceVersionId - Source version
 * @returns {Promise<{ branchId: string; versionId: string }>} Branch information
 * @throws {NotFoundException} If source version not found
 *
 * @example
 * ```typescript
 * const branch = await branchVersion('doc-123', 'feature-updates', 'version-456');
 * ```
 */
export declare const branchVersion: (documentId: string, branchName: string, sourceVersionId: string) => Promise<{
    branchId: string;
    versionId: string;
}>;
/**
 * 23. Gets version history for document.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<DocumentVersion[]>} Version history
 *
 * @example
 * ```typescript
 * const history = await getHistory('doc-123');
 * history.forEach(v => console.log(`Version ${v.versionNumber}: ${v.changes}`));
 * ```
 */
export declare const getHistory: (documentId: string) => Promise<DocumentVersion[]>;
/**
 * 24. Compares multiple documents simultaneously.
 *
 * @param {Buffer[]} documents - Documents to compare
 * @returns {Promise<ComparisonResult[]>} Pairwise comparison results
 *
 * @example
 * ```typescript
 * const comparisons = await compareMultiple([doc1, doc2, doc3]);
 * ```
 */
export declare const compareMultiple: (documents: Buffer[]) => Promise<ComparisonResult[]>;
/**
 * 25. Automatically detects areas requiring redaction.
 *
 * @param {Buffer} document - Document to analyze
 * @param {RedactionCategory[]} categories - Categories to detect
 * @returns {Promise<DetectedEntity[]>} Detected sensitive areas
 *
 * @example
 * ```typescript
 * const areas = await autoDetectAreas(document, [RedactionCategory.PHI]);
 * ```
 */
export declare const autoDetectAreas: (document: Buffer, categories: RedactionCategory[]) => Promise<DetectedEntity[]>;
/**
 * 26. Performs permanent redaction (irreversible).
 *
 * @param {Buffer} document - Document to redact
 * @param {DetectedEntity[]} entities - Entities to redact
 * @returns {Promise<{ irreversible: true; redactedCount: number }>} Redaction result
 *
 * @example
 * ```typescript
 * const result = await permanentRedact(document, detectedEntities);
 * ```
 */
export declare const permanentRedact: (document: Buffer, entities: DetectedEntity[]) => Promise<{
    irreversible: true;
    redactedCount: number;
}>;
/**
 * 27. Performs temporary redaction (reversible with key).
 *
 * @param {Buffer} document - Document to redact
 * @param {DetectedEntity[]} entities - Entities to redact
 * @returns {Promise<{ key: string; redactedDocument: Buffer }>} Redaction with reversal key
 *
 * @example
 * ```typescript
 * const result = await temporaryRedact(document, entities);
 * // Later: revertRedaction(result.redactedDocument, result.key);
 * ```
 */
export declare const temporaryRedact: (document: Buffer, entities: DetectedEntity[]) => Promise<{
    key: string;
    redactedDocument: Buffer;
}>;
/**
 * 28. Reverts temporary redaction using key.
 *
 * @param {Buffer} document - Redacted document
 * @param {string} key - Reversal key
 * @returns {Promise<Buffer>} Original document
 * @throws {BadRequestException} If key is invalid
 *
 * @example
 * ```typescript
 * const original = await revertRedaction(redactedDoc, reversalKey);
 * ```
 */
export declare const revertRedaction: (document: Buffer, key: string) => Promise<Buffer>;
/**
 * 29. Compares different redaction methods for effectiveness.
 *
 * @param {Buffer} document - Original document
 * @param {RedactionStrategy[]} methods - Methods to compare
 * @returns {Promise<{ method: RedactionStrategy; score: number }[]>} Method effectiveness scores
 *
 * @example
 * ```typescript
 * const comparison = await compareMethods(doc, [RedactionStrategy.PERMANENT, RedactionStrategy.REVERSIBLE]);
 * ```
 */
export declare const compareMethods: (document: Buffer, methods: RedactionStrategy[]) => Promise<Array<{
    method: RedactionStrategy;
    score: number;
}>>;
/**
 * 30. Performs batch document comparison.
 *
 * @param {Array<{ doc1: Buffer; doc2: Buffer }>} pairs - Document pairs to compare
 * @returns {Promise<ComparisonResult[]>} Comparison results
 *
 * @example
 * ```typescript
 * const results = await batchCompare([{doc1: a, doc2: b}, {doc1: c, doc2: d}]);
 * ```
 */
export declare const batchCompare: (pairs: Array<{
    doc1: Buffer;
    doc2: Buffer;
}>) => Promise<ComparisonResult[]>;
/**
 * 31. Performs semantic document comparison.
 *
 * @param {Buffer} document1 - First document
 * @param {Buffer} document2 - Second document
 * @returns {Promise<{ score: number; semanticChanges: number }>} Semantic comparison result
 *
 * @example
 * ```typescript
 * const semantic = await semanticCompare(doc1, doc2);
 * console.log(`Semantic similarity: ${semantic.score}%`);
 * ```
 */
export declare const semanticCompare: (document1: Buffer, document2: Buffer) => Promise<{
    score: number;
    semanticChanges: number;
}>;
/**
 * 32. Compares document structure and layout.
 *
 * @param {Buffer} document1 - First document
 * @param {Buffer} document2 - Second document
 * @returns {Promise<{ match: number; structuralDifferences: number }>} Structural comparison
 *
 * @example
 * ```typescript
 * const structural = await structuralCompare(doc1, doc2);
 * ```
 */
export declare const structuralCompare: (document1: Buffer, document2: Buffer) => Promise<{
    match: number;
    structuralDifferences: number;
}>;
/**
 * 33. Exports comparison data in multiple formats.
 *
 * @param {ComparisonResult} result - Comparison result
 * @param {'JSON' | 'CSV' | 'PDF'} format - Export format
 * @returns {Promise<Buffer>} Exported data
 *
 * @example
 * ```typescript
 * const csv = await exportData(result, 'CSV');
 * ```
 */
export declare const exportData: (result: ComparisonResult, format: "JSON" | "CSV" | "PDF") => Promise<Buffer>;
/**
 * 34. Schedules batch redaction job.
 *
 * @param {string[]} documentIds - Documents to redact
 * @param {RedactionConfig} config - Redaction configuration
 * @param {Date} scheduledTime - When to execute
 * @returns {Promise<{ jobId: string; scheduledFor: Date }>} Job information
 *
 * @example
 * ```typescript
 * const job = await scheduleJob(['doc1', 'doc2'], config, new Date('2025-12-01'));
 * ```
 */
export declare const scheduleJob: (documentIds: string[], config: RedactionConfig, scheduledTime: Date) => Promise<{
    jobId: string;
    scheduledFor: Date;
}>;
/**
 * 35. Monitors redaction job progress.
 *
 * @param {string} jobId - Job identifier
 * @returns {Promise<{ progress: number; completed: number; total: number }>} Progress information
 *
 * @example
 * ```typescript
 * const progress = await monitorProgress('job-123');
 * console.log(`${progress.progress}% complete`);
 * ```
 */
export declare const monitorProgress: (jobId: string) => Promise<{
    progress: number;
    completed: number;
    total: number;
}>;
/**
 * 36. Audits document for compliance violations.
 *
 * @param {string} documentId - Document identifier
 * @param {string[]} standards - Compliance standards (HIPAA, GDPR, etc.)
 * @returns {Promise<{ compliant: boolean; violations: string[] }>} Audit result
 *
 * @example
 * ```typescript
 * const audit = await auditCompliance('doc-123', ['HIPAA', 'GDPR']);
 * ```
 */
export declare const auditCompliance: (documentId: string, standards: string[]) => Promise<{
    compliant: boolean;
    violations: string[];
}>;
/**
 * 37. Generates statistics for comparison results.
 *
 * @param {ComparisonResult} result - Comparison result
 * @returns {Promise<Record<string, number>>} Statistical summary
 *
 * @example
 * ```typescript
 * const stats = await generateStats(comparisonResult);
 * ```
 */
export declare const generateStats: (result: ComparisonResult) => Promise<Record<string, number>>;
/**
 * 38. Creates approval workflow for changes.
 *
 * @param {DocumentChange[]} changes - Changes requiring approval
 * @param {string[]} approvers - User IDs of approvers
 * @returns {Promise<{ workflowId: string; status: string }>} Workflow information
 *
 * @example
 * ```typescript
 * const workflow = await createWorkflow(changes, ['user1', 'user2']);
 * ```
 */
export declare const createWorkflow: (changes: DocumentChange[], approvers: string[]) => Promise<{
    workflowId: string;
    status: string;
}>;
/**
 * 39. Finds similar documents based on content.
 *
 * @param {Buffer} document - Source document
 * @param {number} threshold - Similarity threshold (0-100)
 * @returns {Promise<Array<{ documentId: string; similarity: number }>>} Similar documents
 *
 * @example
 * ```typescript
 * const similar = await findSimilar(document, 80);
 * ```
 */
export declare const findSimilar: (document: Buffer, threshold?: number) => Promise<Array<{
    documentId: string;
    similarity: number;
}>>;
/**
 * 40. Applies conditional redaction based on rules.
 *
 * @param {Buffer} document - Document to redact
 * @param {Array<{ condition: string; action: string }>} rules - Redaction rules
 * @returns {Promise<Buffer>} Conditionally redacted document
 *
 * @example
 * ```typescript
 * const redacted = await conditionalRedact(doc, [
 *   { condition: 'role=external', action: 'redact-phi' },
 *   { condition: 'classification=public', action: 'no-redaction' }
 * ]);
 * ```
 */
export declare const conditionalRedact: (document: Buffer, rules: Array<{
    condition: string;
    action: string;
}>) => Promise<Buffer>;
/**
 * Document Comparison and Redaction Service
 * Production-ready NestJS service for document comparison, redaction, and version control
 */
export declare class DocumentComparisonRedactionService {
    /**
     * Compares two documents
     */
    compare(doc1: Buffer, doc2: Buffer, type?: ComparisonType): Promise<ComparisonResult>;
    /**
     * Redacts PII/PHI from document
     */
    redact(document: Buffer, config: RedactionConfig): Promise<RedactionResult>;
    /**
     * Creates document version
     */
    version(documentId: string, content: Buffer, createdBy: string, changes?: string): Promise<{
        versionId: string;
        versionNumber: number;
    }>;
    /**
     * Merges document versions
     */
    merge(base: Buffer, v1: Buffer, v2: Buffer, config?: Partial<VersionMergeConfig>): Promise<Buffer>;
}
declare const _default: {
    ComparisonResultModel: typeof ComparisonResultModel;
    RedactionResultModel: typeof RedactionResultModel;
    DocumentVersionModel: typeof DocumentVersionModel;
    RedactionPatternModel: typeof RedactionPatternModel;
    compareDocuments: (document1: Buffer, document2: Buffer, comparisonType?: ComparisonType) => Promise<ComparisonResult>;
    detectPII: (text: string, entityTypes?: EntityType[]) => Promise<{
        patterns: DetectedEntity[];
        count: number;
    }>;
    redactPHI: (document: Buffer, config: RedactionConfig) => Promise<Buffer>;
    calculateSimilarity: (document1: Buffer, document2: Buffer) => Promise<number>;
    generateVisualDiff: (document1: Buffer, document2: Buffer) => Promise<string>;
    createVersion: (documentId: string, data: Buffer, createdBy: string, changes?: string) => Promise<{
        versionId: string;
        versionNumber: number;
    }>;
    trackChanges: (changes: DocumentChange[], documentId: string, userId: string) => Promise<{
        logId: string;
        changeCount: number;
    }>;
    mergeVersions: (baseDocument: Buffer, version1: Buffer, version2: Buffer, config?: Partial<VersionMergeConfig>) => Promise<Buffer>;
    rollbackVersion: (documentId: string, versionId: string) => Promise<{
        success: boolean;
        versionNumber: number;
    }>;
    createRedactionTemplate: (name: string, patterns: Omit<RedactionPattern, "id">[]) => Promise<{
        templateId: string;
        patternCount: number;
    }>;
    applyTemplate: (document: Buffer, templateId: string) => Promise<Buffer>;
    verifyRedaction: (document: Buffer, categories: RedactionCategory[]) => Promise<{
        complete: boolean;
        remainingPII: number;
    }>;
    generateReport: (redactionId: string) => Promise<{
        reportId: string;
        summary: Record<string, any>;
    }>;
    compareRedacted: (original: Buffer, redacted: Buffer) => Promise<{
        coverage: number;
        redactedAreas: number;
    }>;
    bulkRedact: (documentIds: string[], config: RedactionConfig) => Promise<{
        processed: number;
        failed: number;
    }>;
    sanitizeMeta: (metadata: Record<string, any>, entityTypes: EntityType[]) => Promise<Record<string, any>>;
    detectConflicts: (version1: DocumentVersion, version2: DocumentVersion) => Promise<{
        conflicts: VersionConflict[];
    }>;
    highlightChanges: (changes: DocumentChange[]) => Promise<string>;
    extractContent: (document: Buffer) => Promise<string>;
    validateIntegrity: (document: Buffer) => Promise<{
        valid: boolean;
        errors: string[];
    }>;
    createReport: (result: ComparisonResult) => Promise<{
        id: string;
        report: Buffer;
    }>;
    branchVersion: (documentId: string, branchName: string, sourceVersionId: string) => Promise<{
        branchId: string;
        versionId: string;
    }>;
    getHistory: (documentId: string) => Promise<DocumentVersion[]>;
    compareMultiple: (documents: Buffer[]) => Promise<ComparisonResult[]>;
    autoDetectAreas: (document: Buffer, categories: RedactionCategory[]) => Promise<DetectedEntity[]>;
    permanentRedact: (document: Buffer, entities: DetectedEntity[]) => Promise<{
        irreversible: true;
        redactedCount: number;
    }>;
    temporaryRedact: (document: Buffer, entities: DetectedEntity[]) => Promise<{
        key: string;
        redactedDocument: Buffer;
    }>;
    revertRedaction: (document: Buffer, key: string) => Promise<Buffer>;
    compareMethods: (document: Buffer, methods: RedactionStrategy[]) => Promise<Array<{
        method: RedactionStrategy;
        score: number;
    }>>;
    batchCompare: (pairs: Array<{
        doc1: Buffer;
        doc2: Buffer;
    }>) => Promise<ComparisonResult[]>;
    semanticCompare: (document1: Buffer, document2: Buffer) => Promise<{
        score: number;
        semanticChanges: number;
    }>;
    structuralCompare: (document1: Buffer, document2: Buffer) => Promise<{
        match: number;
        structuralDifferences: number;
    }>;
    exportData: (result: ComparisonResult, format: "JSON" | "CSV" | "PDF") => Promise<Buffer>;
    scheduleJob: (documentIds: string[], config: RedactionConfig, scheduledTime: Date) => Promise<{
        jobId: string;
        scheduledFor: Date;
    }>;
    monitorProgress: (jobId: string) => Promise<{
        progress: number;
        completed: number;
        total: number;
    }>;
    auditCompliance: (documentId: string, standards: string[]) => Promise<{
        compliant: boolean;
        violations: string[];
    }>;
    generateStats: (result: ComparisonResult) => Promise<Record<string, number>>;
    createWorkflow: (changes: DocumentChange[], approvers: string[]) => Promise<{
        workflowId: string;
        status: string;
    }>;
    findSimilar: (document: Buffer, threshold?: number) => Promise<Array<{
        documentId: string;
        similarity: number;
    }>>;
    conditionalRedact: (document: Buffer, rules: Array<{
        condition: string;
        action: string;
    }>) => Promise<Buffer>;
    DocumentComparisonRedactionService: typeof DocumentComparisonRedactionService;
};
export default _default;
//# sourceMappingURL=document-comparison-redaction-composite.d.ts.map