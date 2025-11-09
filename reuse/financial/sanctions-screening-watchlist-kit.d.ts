/**
 * LOC: SANC-SCRN-WL-001
 * File: /reuse/financial/sanctions-screening-watchlist-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (Model, DataTypes, Transaction, Op, Sequelize)
 *   - @nestjs/common (Injectable)
 *   - crypto (createHash)
 *
 * DOWNSTREAM (imported by):
 *   - backend/compliance/sanctions-screening.service.ts
 *   - backend/aml/entity-screening.service.ts
 *   - backend/controllers/sanctions.controller.ts
 */
/**
 * File: /reuse/financial/sanctions-screening-watchlist-kit.ts
 * Locator: WC-SANC-SCRN-WL-001
 * Purpose: Enterprise-grade sanctions screening & watchlist management - OFAC/UN/EU compliance, PEP screening, fuzzy matching
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, Node 18+
 * Downstream: Sanctions services, entity screening, compliance controllers
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 40 production-ready functions for comprehensive sanctions screening
 *
 * LLM Context: Enterprise-grade sanctions screening and watchlist management for regulatory compliance.
 * Provides OFAC/UN/EU sanctions checking, fuzzy name matching, entity screening, hit evaluation,
 * false positive management, watchlist synchronization, country/sectoral sanctions, PEP cross-reference,
 * audit trails, batch screening, and investigation workflows.
 */
import { Sequelize } from 'sequelize';
interface SanctionsCheckResult {
    entityId: string;
    entityName: string;
    matched: boolean;
    hitType: 'exact' | 'fuzzy' | 'none';
    matchedLists: SanctionsList[];
    matchedRecords: SanctionsRecord[];
    confidenceScore: number;
    riskLevel: 'critical' | 'high' | 'medium' | 'low';
    checkedAt: Date;
}
interface SanctionsList {
    listId: string;
    listName: 'OFAC-SDN' | 'OFAC-Non-SDN' | 'UN-UNSC' | 'EU-Consolidated' | 'UK-OFS' | 'US-BIS-DPL' | 'CA-ISIL';
    listVersion: string;
    recordCount: number;
    lastUpdated: Date;
}
interface SanctionsRecord {
    recordId: string;
    listId: string;
    entityName: string;
    entityType: 'individual' | 'organization' | 'vessel' | 'aircraft';
    aliases: string[];
    dateOfBirth?: Date;
    nationality?: string[];
    addresses: SanctionAddress[];
    sanctionReason: string;
    sanctionProgram: string;
    listingDate: Date;
    sdnType?: string;
    remarks?: string;
}
interface SanctionAddress {
    address: string;
    city: string;
    country: string;
    postalCode?: string;
    addressType: 'primary' | 'alternate';
}
interface FuzzyMatchResult {
    matchedRecordId: string;
    matchedName: string;
    similarityScore: number;
    matchMethod: 'levenshtein' | 'phonetic' | 'token_set' | 'ngram';
    matchedFields: string[];
}
interface PepRecord {
    pepId: string;
    fullName: string;
    aliases: string[];
    position: string;
    country: string;
    institution: string;
    exposureLevel: 'direct' | 'family' | 'close_associate';
    riskScore: number;
    verificationDate: Date;
}
interface WatchlistSyncStatus {
    syncId: string;
    listId: string;
    listName: string;
    syncStatus: 'pending' | 'in_progress' | 'completed' | 'failed';
    recordsAdded: number;
    recordsUpdated: number;
    recordsRemoved: number;
    syncedAt: Date;
    nextSyncDue: Date;
    errorMessage?: string;
}
interface BatchScreeningJob {
    jobId: string;
    entityCount: number;
    processedCount: number;
    matchedCount: number;
    jobStatus: 'queued' | 'processing' | 'completed' | 'failed';
    startedAt: Date;
    completedAt?: Date;
    results: SanctionsCheckResult[];
}
interface AuditTrailEntry {
    entryId: string;
    action: string;
    entityType: string;
    entityId: string;
    userId: string;
    performedAt: Date;
    changes: Record<string, any>;
    ipAddress?: string;
    metadata?: Record<string, any>;
}
/**
 * Sanctions Records model - stores all sanctions list entries
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} SanctionsRecord model
 */
export declare const createSanctionsRecordModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        listId: string;
        recordId: string;
        entityName: string;
        entityType: string;
        aliases: string[];
        dateOfBirth: Date | null;
        nationality: string[];
        addresses: SanctionAddress[];
        sanctionReason: string;
        sanctionProgram: string;
        listingDate: Date;
        sdnType: string | null;
        remarks: string | null;
        nameHash: string;
        isActive: boolean;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sanctions Hits model - tracks matched entities
 */
export declare const createSanctionsHitModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        screeningId: string;
        recordId: string;
        entityId: string;
        entityName: string;
        matchedName: string;
        matchType: string;
        confidenceScore: number;
        riskLevel: string;
        evaluationStatus: string;
        falsePositiveLikelihood: number;
        evaluatedAt: Date | null;
        evaluatedBy: string | null;
        evaluationNotes: string | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Investigations model - tracks investigation workflows
 */
export declare const createInvestigationModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        hitId: string;
        recordId: string;
        investigationStatus: string;
        investigationNotes: string[];
        assignedTo: string;
        createdAt: Date;
        closedAt: Date | null;
        closureReason: string | null;
        escalationReason: string | null;
    };
};
/**
 * PEP Records model - politically exposed persons database
 */
export declare const createPepRecordModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        pepId: string;
        fullName: string;
        aliases: string[];
        position: string;
        country: string;
        institution: string;
        exposureLevel: string;
        riskScore: number;
        verificationDate: Date;
        nameHash: string;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Audit Trail model
 */
export declare const createAuditTrailModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        action: string;
        entityType: string;
        entityId: string;
        userId: string;
        changes: Record<string, any>;
        ipAddress: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
    };
};
/**
 * Normalize entity name for consistent matching
 */
export declare function normalizeEntityName(name: string): string;
/**
 * Calculate hash for name-based indexing
 */
export declare function calculateNameHash(name: string): string;
/**
 * Calculate Levenshtein distance between two strings
 */
export declare function levenshteinDistance(a: string, b: string): number;
/**
 * Calculate similarity score (0-100) using Levenshtein
 */
export declare function calculateSimilarityScore(a: string, b: string): number;
/**
 * Phonetic matching using Soundex algorithm
 */
export declare function soundexCode(text: string): string;
/**
 * Token-based set matching
 */
export declare function tokenSetSimilarity(a: string, b: string): number;
/**
 * 1. Screen entity against all sanctions lists
 */
export declare function screenEntityAgainstWatchlists(entityName: string, entityType: 'individual' | 'organization' | 'vessel' | 'aircraft', additionalData?: {
    aliases?: string[];
    dateOfBirth?: Date;
    nationality?: string;
}, recordModel?: any): Promise<SanctionsCheckResult>;
/**
 * 2. Validate entity against consolidated list
 */
export declare function validateEntityConsolidatedList(entityId: string, entityName: string, recordModel?: any): Promise<{
    isListed: boolean;
    matchedRecords: SanctionsRecord[];
}>;
/**
 * 3. Check entity against specific sanctions program
 */
export declare function checkEntityAgainstProgram(entityName: string, sanctionProgram: string, recordModel?: any): Promise<SanctionsRecord[]>;
/**
 * 4. Retrieve sanctioned entity details
 */
export declare function getSanctionedEntityDetails(recordId: string, recordModel?: any): Promise<SanctionsRecord | null>;
/**
 * 5. List all active watchlist entries for audit
 */
export declare function getAllActiveWatchlistEntries(limit?: number, offset?: number, recordModel?: any): Promise<{
    records: SanctionsRecord[];
    total: number;
}>;
/**
 * 6. Search watchlist by partial name
 */
export declare function searchWatchlistByName(searchTerm: string, entityType?: string, recordModel?: any): Promise<SanctionsRecord[]>;
/**
 * 7. Perform rapid entity screening with caching
 */
export declare function rapidEntityScreening(entityName: string, entityType: string, cache?: Map<string, any>, recordModel?: any): Promise<SanctionsCheckResult>;
/**
 * 8. Cross-reference entity across multiple lists
 */
export declare function crossReferenceEntity(entityName: string, recordModel?: any): Promise<Map<string, SanctionsRecord[]>>;
/**
 * 9. Check against OFAC SDN list
 */
export declare function checkOFACSDNList(entityName: string, entityType: string, recordModel?: any): Promise<{
    matched: boolean;
    records: SanctionsRecord[];
}>;
/**
 * 10. Check against UN UNSC consolidated list
 */
export declare function checkUNUNSCList(entityName: string, recordModel?: any): Promise<{
    matched: boolean;
    records: SanctionsRecord[];
}>;
/**
 * 11. Check against EU consolidated list
 */
export declare function checkEUConsolidatedList(entityName: string, recordModel?: any): Promise<{
    matched: boolean;
    records: SanctionsRecord[];
}>;
/**
 * 12. Check against US BIS Denied Persons List
 */
export declare function checkBISDeniedPersonsList(entityName: string, recordModel?: any): Promise<{
    matched: boolean;
    records: SanctionsRecord[];
}>;
/**
 * 13. Check against UK OFS list
 */
export declare function checkUKOFSList(entityName: string, recordModel?: any): Promise<{
    matched: boolean;
    records: SanctionsRecord[];
}>;
/**
 * 14. Check for multi-list hits
 */
export declare function checkMultipleListsParallel(entityName: string, recordModel?: any): Promise<Map<string, SanctionsRecord[]>>;
/**
 * 15. Determine overall sanctions risk
 */
export declare function determineSanctionsRisk(entityName: string, sanctionRecords: SanctionsRecord[]): Promise<{
    riskLevel: string;
    score: number;
    justification: string;
}>;
/**
 * 16. Verify sanctions list data freshness
 */
export declare function verifySanctionsDataFreshness(maxAgeDays?: number, recordModel?: any): Promise<{
    isFresh: boolean;
    lastUpdate: Date | null;
    ageInDays: number;
}>;
/**
 * 17. Find similar names using multiple algorithms
 */
export declare function findSimilarNames(entityName: string, threshold?: number, recordModel?: any): Promise<FuzzyMatchResult[]>;
/**
 * 18. Phonetic name matching
 */
export declare function phoneticallyMatchName(entityName: string, candidateNames: string[]): Array<{
    name: string;
    score: number;
}>;
/**
 * 19. Weighted fuzzy match combining multiple methods
 */
export declare function weightedFuzzyMatch(entityName: string, candidateName: string): {
    score: number;
    methods: Record<string, number>;
};
/**
 * 20. Fuzzy match with field boosting
 */
export declare function fuzzyMatchWithFieldBoosting(entityData: {
    name: string;
    aliases?: string[];
    country?: string;
}, recordModel?: any): Promise<FuzzyMatchResult[]>;
/**
 * 21. Name variant generation and matching
 */
export declare function generateNameVariants(entityName: string): string[];
/**
 * 22. Evaluate sanctions hit for accuracy
 */
export declare function evaluateSanctionsHit(hitId: string, evaluationStatus: 'confirmed' | 'rejected' | 'under_review', falsePositiveLikelihood: number, evaluatedBy: string, notes: string, hitModel?: any): Promise<{
    success: boolean;
    updatedHit: any;
}>;
/**
 * 23. Calculate false positive probability
 */
export declare function calculateFalsePositiveProbability(similarityScore: number, matchMethod: string, entityTypeMatch: boolean): number;
/**
 * 24. Get hit review queue
 */
export declare function getHitReviewQueue(limit?: number, hitModel?: any): Promise<any[]>;
/**
 * 25. Bulk update hit evaluations
 */
export declare function bulkUpdateHitEvaluations(hitIds: string[], evaluationStatus: string, hitModel?: any): Promise<{
    updated: number;
    failed: number;
}>;
/**
 * 26. Calculate aggregate hit statistics
 */
export declare function calculateHitStatistics(timeRange: {
    from: Date;
    to: Date;
}, hitModel?: any): Promise<{
    totalHits: number;
    confirmedHits: number;
    rejectedHits: number;
    pendingHits: number;
    avgConfidenceScore: number;
}>;
/**
 * 27. Register false positive
 */
export declare function registerFalsePositive(hitId: string, recordId: string, reason: string, auditModel?: any): Promise<{
    registered: boolean;
}>;
/**
 * 28. Suppress false positive from screening
 */
export declare function suppressFalsePositive(recordId: string, entityId: string, suppressionReason: string, recordModel?: any): Promise<{
    suppressed: boolean;
}>;
/**
 * 29. Analyze false positive patterns
 */
export declare function analyzeFalsePositivePatterns(hitModel?: any): Promise<{
    commonFalsePositiveTypes: Array<{
        type: string;
        count: number;
    }>;
    highestFalsePositiveRate: string;
}>;
/**
 * 30. Create false positive whitelist
 */
export declare function createFalsePositiveWhitelist(entityName: string, recordId: string, reason: string, recordModel?: any): Promise<{
    whitelisted: boolean;
    whitelistId: string;
}>;
/**
 * 31. Screen entity against PEP records
 */
export declare function screenAgainstPEPList(entityName: string, country: string, pepModel?: any): Promise<{
    matched: boolean;
    pepRecords: PepRecord[];
}>;
/**
 * 32. Check for related parties of PEPs
 */
export declare function checkPEPRelatedParties(entityName: string, pepModel?: any): Promise<PepRecord[]>;
/**
 * 33. Calculate PEP risk score
 */
export declare function calculatePEPRiskScore(entityName: string, pepModel?: any): Promise<number>;
/**
 * 34. Check country-based sanctions
 */
export declare function checkCountrySanctions(countryCode: string, recordModel?: any): Promise<{
    isSanctioned: boolean;
    programs: string[];
}>;
/**
 * 35. Check sectoral sanctions
 */
export declare function checkSectoralSanctions(sectorCode: string, recordModel?: any): Promise<{
    records: SanctionsRecord[];
}>;
/**
 * 36. Validate transaction for sectoral compliance
 */
export declare function validateTransactionSectoralCompliance(entityName: string, sector: string, transactionAmount: number, recordModel?: any): Promise<{
    compliant: boolean;
    reason: string;
}>;
/**
 * 37. Get embargo countries list
 */
export declare function getEmbargoCountries(): string[];
/**
 * 38. Submit batch screening job
 */
export declare function submitBatchScreeningJob(jobId: string, entities: Array<{
    entityId: string;
    name: string;
    type: string;
}>, recordModel?: any): Promise<BatchScreeningJob>;
/**
 * 39. Get batch job status
 */
export declare function getBatchJobStatus(job: BatchScreeningJob): {
    status: string;
    progress: number;
    matchRate: number;
};
/**
 * 40. Export batch screening results
 */
export declare function exportBatchScreeningResults(job: BatchScreeningJob, format?: 'csv' | 'json'): string;
/**
 * Additional: Create audit trail entry
 */
export declare function createAuditTrailEntry(action: string, entityType: string, entityId: string, userId: string, changes: Record<string, any>, auditModel?: any): Promise<{
    entryId: string;
    success: boolean;
}>;
/**
 * Additional: Retrieve audit trail for entity
 */
export declare function retrieveAuditTrail(entityId: string, limit?: number, auditModel?: any): Promise<AuditTrailEntry[]>;
/**
 * Additional: Export audit trail
 */
export declare function exportAuditTrail(entries: AuditTrailEntry[], format?: 'csv' | 'json'): string;
/**
 * Additional: Open investigation
 */
export declare function openInvestigation(hitId: string, recordId: string, assignedTo: string, investigationModel?: any): Promise<{
    investigationId: string;
    success: boolean;
}>;
/**
 * Additional: Add investigation note
 */
export declare function addInvestigationNote(investigationId: string, note: string, investigationModel?: any): Promise<{
    success: boolean;
}>;
/**
 * Additional: Close investigation
 */
export declare function closeInvestigation(investigationId: string, closureReason: string, investigationModel?: any): Promise<{
    success: boolean;
}>;
/**
 * Additional: Sync external sanctions list
 */
export declare function syncExternalSanctionsList(listId: string, records: SanctionsRecord[], recordModel?: any): Promise<WatchlistSyncStatus>;
/**
 * Additional: Validate regulatory data integrity
 */
export declare function validateRegulatoryDataIntegrity(recordModel?: any): Promise<{
    totalRecords: number;
    invalidRecords: number;
    integrityScore: number;
    issues: string[];
}>;
/**
 * Additional: Generate sanctions screening report
 */
export declare function generateSanctionsScreeningReport(jobId: string, job: BatchScreeningJob, timeRange: {
    from: Date;
    to: Date;
}): string;
/**
 * Additional: Handle screening errors gracefully
 */
export declare function handleScreeningError(error: Error, context: {
    entityName: string;
    operation: string;
}, auditModel?: any): Promise<{
    handled: boolean;
    errorId: string;
}>;
export {};
//# sourceMappingURL=sanctions-screening-watchlist-kit.d.ts.map