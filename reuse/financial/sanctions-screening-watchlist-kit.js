"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuditTrailModel = exports.createPepRecordModel = exports.createInvestigationModel = exports.createSanctionsHitModel = exports.createSanctionsRecordModel = void 0;
exports.normalizeEntityName = normalizeEntityName;
exports.calculateNameHash = calculateNameHash;
exports.levenshteinDistance = levenshteinDistance;
exports.calculateSimilarityScore = calculateSimilarityScore;
exports.soundexCode = soundexCode;
exports.tokenSetSimilarity = tokenSetSimilarity;
exports.screenEntityAgainstWatchlists = screenEntityAgainstWatchlists;
exports.validateEntityConsolidatedList = validateEntityConsolidatedList;
exports.checkEntityAgainstProgram = checkEntityAgainstProgram;
exports.getSanctionedEntityDetails = getSanctionedEntityDetails;
exports.getAllActiveWatchlistEntries = getAllActiveWatchlistEntries;
exports.searchWatchlistByName = searchWatchlistByName;
exports.rapidEntityScreening = rapidEntityScreening;
exports.crossReferenceEntity = crossReferenceEntity;
exports.checkOFACSDNList = checkOFACSDNList;
exports.checkUNUNSCList = checkUNUNSCList;
exports.checkEUConsolidatedList = checkEUConsolidatedList;
exports.checkBISDeniedPersonsList = checkBISDeniedPersonsList;
exports.checkUKOFSList = checkUKOFSList;
exports.checkMultipleListsParallel = checkMultipleListsParallel;
exports.determineSanctionsRisk = determineSanctionsRisk;
exports.verifySanctionsDataFreshness = verifySanctionsDataFreshness;
exports.findSimilarNames = findSimilarNames;
exports.phoneticallyMatchName = phoneticallyMatchName;
exports.weightedFuzzyMatch = weightedFuzzyMatch;
exports.fuzzyMatchWithFieldBoosting = fuzzyMatchWithFieldBoosting;
exports.generateNameVariants = generateNameVariants;
exports.evaluateSanctionsHit = evaluateSanctionsHit;
exports.calculateFalsePositiveProbability = calculateFalsePositiveProbability;
exports.getHitReviewQueue = getHitReviewQueue;
exports.bulkUpdateHitEvaluations = bulkUpdateHitEvaluations;
exports.calculateHitStatistics = calculateHitStatistics;
exports.registerFalsePositive = registerFalsePositive;
exports.suppressFalsePositive = suppressFalsePositive;
exports.analyzeFalsePositivePatterns = analyzeFalsePositivePatterns;
exports.createFalsePositiveWhitelist = createFalsePositiveWhitelist;
exports.screenAgainstPEPList = screenAgainstPEPList;
exports.checkPEPRelatedParties = checkPEPRelatedParties;
exports.calculatePEPRiskScore = calculatePEPRiskScore;
exports.checkCountrySanctions = checkCountrySanctions;
exports.checkSectoralSanctions = checkSectoralSanctions;
exports.validateTransactionSectoralCompliance = validateTransactionSectoralCompliance;
exports.getEmbargoCountries = getEmbargoCountries;
exports.submitBatchScreeningJob = submitBatchScreeningJob;
exports.getBatchJobStatus = getBatchJobStatus;
exports.exportBatchScreeningResults = exportBatchScreeningResults;
exports.createAuditTrailEntry = createAuditTrailEntry;
exports.retrieveAuditTrail = retrieveAuditTrail;
exports.exportAuditTrail = exportAuditTrail;
exports.openInvestigation = openInvestigation;
exports.addInvestigationNote = addInvestigationNote;
exports.closeInvestigation = closeInvestigation;
exports.syncExternalSanctionsList = syncExternalSanctionsList;
exports.validateRegulatoryDataIntegrity = validateRegulatoryDataIntegrity;
exports.generateSanctionsScreeningReport = generateSanctionsScreeningReport;
exports.handleScreeningError = handleScreeningError;
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
const sequelize_1 = require("sequelize");
const crypto_1 = require("crypto");
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sanctions Records model - stores all sanctions list entries
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} SanctionsRecord model
 */
const createSanctionsRecordModel = (sequelize) => {
    class SanctionsRecordModel extends sequelize_1.Model {
    }
    SanctionsRecordModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        listId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            index: true,
        },
        recordId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        entityName: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            index: true,
        },
        entityType: {
            type: sequelize_1.DataTypes.ENUM('individual', 'organization', 'vessel', 'aircraft'),
            allowNull: false,
        },
        aliases: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            defaultValue: [],
        },
        dateOfBirth: {
            type: sequelize_1.DataTypes.DATE,
        },
        nationality: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING(2)),
            defaultValue: [],
        },
        addresses: {
            type: sequelize_1.DataTypes.JSONB,
            defaultValue: [],
        },
        sanctionReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        sanctionProgram: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
        },
        listingDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        sdnType: {
            type: sequelize_1.DataTypes.STRING(50),
        },
        remarks: {
            type: sequelize_1.DataTypes.TEXT,
        },
        nameHash: {
            type: sequelize_1.DataTypes.STRING(64),
            allowNull: false,
            index: true,
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: true,
            index: true,
        },
    }, {
        sequelize,
        tableName: 'sanctions_records',
        timestamps: true,
        indexes: [
            { fields: ['listId', 'entityName'] },
            { fields: ['nameHash'] },
            { fields: ['isActive'] },
        ],
    });
    return SanctionsRecordModel;
};
exports.createSanctionsRecordModel = createSanctionsRecordModel;
/**
 * Sanctions Hits model - tracks matched entities
 */
const createSanctionsHitModel = (sequelize) => {
    class SanctionsHit extends sequelize_1.Model {
    }
    SanctionsHit.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        screeningId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            index: true,
        },
        recordId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        entityId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            index: true,
        },
        entityName: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
        },
        matchedName: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
        },
        matchType: {
            type: sequelize_1.DataTypes.ENUM('exact', 'fuzzy', 'none'),
            allowNull: false,
        },
        confidenceScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
        },
        riskLevel: {
            type: sequelize_1.DataTypes.ENUM('critical', 'high', 'medium', 'low'),
            allowNull: false,
        },
        evaluationStatus: {
            type: sequelize_1.DataTypes.ENUM('pending', 'confirmed', 'rejected', 'under_review'),
            defaultValue: 'pending',
        },
        falsePositiveLikelihood: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            defaultValue: 0,
        },
        evaluatedAt: sequelize_1.DataTypes.DATE,
        evaluatedBy: sequelize_1.DataTypes.STRING(100),
        evaluationNotes: sequelize_1.DataTypes.TEXT,
    }, {
        sequelize,
        tableName: 'sanctions_hits',
        timestamps: true,
        indexes: [
            { fields: ['screeningId', 'evaluationStatus'] },
            { fields: ['entityId'] },
        ],
    });
    return SanctionsHit;
};
exports.createSanctionsHitModel = createSanctionsHitModel;
/**
 * Investigations model - tracks investigation workflows
 */
const createInvestigationModel = (sequelize) => {
    class Investigation extends sequelize_1.Model {
    }
    Investigation.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        hitId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            index: true,
        },
        recordId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        investigationStatus: {
            type: sequelize_1.DataTypes.ENUM('open', 'under_review', 'closed', 'escalated'),
            defaultValue: 'open',
        },
        investigationNotes: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            defaultValue: [],
        },
        assignedTo: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        closedAt: sequelize_1.DataTypes.DATE,
        closureReason: sequelize_1.DataTypes.TEXT,
        escalationReason: sequelize_1.DataTypes.TEXT,
    }, {
        sequelize,
        tableName: 'investigations',
        timestamps: true,
    });
    return Investigation;
};
exports.createInvestigationModel = createInvestigationModel;
/**
 * PEP Records model - politically exposed persons database
 */
const createPepRecordModel = (sequelize) => {
    class PepRecordModel extends sequelize_1.Model {
    }
    PepRecordModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        pepId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        fullName: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            index: true,
        },
        aliases: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            defaultValue: [],
        },
        position: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        country: {
            type: sequelize_1.DataTypes.STRING(2),
            allowNull: false,
        },
        institution: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
        },
        exposureLevel: {
            type: sequelize_1.DataTypes.ENUM('direct', 'family', 'close_associate'),
            allowNull: false,
        },
        riskScore: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
        },
        verificationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        nameHash: {
            type: sequelize_1.DataTypes.STRING(64),
            index: true,
        },
    }, {
        sequelize,
        tableName: 'pep_records',
        timestamps: true,
    });
    return PepRecordModel;
};
exports.createPepRecordModel = createPepRecordModel;
/**
 * Audit Trail model
 */
const createAuditTrailModel = (sequelize) => {
    class AuditTrail extends sequelize_1.Model {
    }
    AuditTrail.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        action: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        entityType: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
        },
        entityId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            index: true,
        },
        userId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        changes: {
            type: sequelize_1.DataTypes.JSONB,
            defaultValue: {},
        },
        ipAddress: sequelize_1.DataTypes.STRING(45),
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            defaultValue: {},
        },
    }, {
        sequelize,
        tableName: 'audit_trails',
        timestamps: true,
    });
    return AuditTrail;
};
exports.createAuditTrailModel = createAuditTrailModel;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Normalize entity name for consistent matching
 */
function normalizeEntityName(name) {
    return name
        .toUpperCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}
/**
 * Calculate hash for name-based indexing
 */
function calculateNameHash(name) {
    return (0, crypto_1.createHash)('sha256').update(normalizeEntityName(name)).digest('hex');
}
/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(a, b) {
    const normA = normalizeEntityName(a);
    const normB = normalizeEntityName(b);
    const matrix = [];
    for (let i = 0; i <= normB.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= normA.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= normB.length; i++) {
        for (let j = 1; j <= normA.length; j++) {
            const cost = normA[j - 1] === normB[i - 1] ? 0 : 1;
            matrix[i][j] = Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1, matrix[i - 1][j - 1] + cost);
        }
    }
    return matrix[normB.length][normA.length];
}
/**
 * Calculate similarity score (0-100) using Levenshtein
 */
function calculateSimilarityScore(a, b) {
    const maxLen = Math.max(normalizeEntityName(a).length, normalizeEntityName(b).length);
    if (maxLen === 0)
        return 100;
    const distance = levenshteinDistance(a, b);
    return Math.round(((maxLen - distance) / maxLen) * 100);
}
/**
 * Phonetic matching using Soundex algorithm
 */
function soundexCode(text) {
    const normalized = normalizeEntityName(text).replace(/\s+/g, '');
    if (!normalized)
        return '';
    const firstChar = normalized[0];
    const codes = {
        B: '1', F: '1', P: '1', V: '1',
        C: '2', G: '2', J: '2', K: '2', Q: '2', S: '2', X: '2', Z: '2',
        D: '3', T: '3',
        L: '4',
        M: '5', N: '5',
        R: '6',
    };
    let code = firstChar;
    let lastCode = codes[firstChar] || '0';
    for (let i = 1; i < normalized.length && code.length < 4; i++) {
        const currentCode = codes[normalized[i]] || '0';
        if (currentCode !== '0' && currentCode !== lastCode) {
            code += currentCode;
            lastCode = currentCode;
        }
        else if (currentCode === '0') {
            lastCode = '0';
        }
    }
    return code.padEnd(4, '0');
}
/**
 * Token-based set matching
 */
function tokenSetSimilarity(a, b) {
    const tokensA = new Set(normalizeEntityName(a).split(/\s+/));
    const tokensB = new Set(normalizeEntityName(b).split(/\s+/));
    const intersection = new Set([...tokensA].filter(x => tokensB.has(x)));
    const union = new Set([...tokensA, ...tokensB]);
    return union.size === 0 ? 0 : Math.round((intersection.size / union.size) * 100);
}
// ============================================================================
// WATCHLIST & ENTITY SCREENING FUNCTIONS (8)
// ============================================================================
/**
 * 1. Screen entity against all sanctions lists
 */
async function screenEntityAgainstWatchlists(entityName, entityType, additionalData, recordModel) {
    const startTime = Date.now();
    const nameHash = calculateNameHash(entityName);
    const matchedRecords = [];
    // Exact match query
    const exactMatches = await (recordModel?.findAll({
        where: {
            [sequelize_1.Op.or]: [
                { nameHash },
                { aliases: { [sequelize_1.Op.contains]: [entityName] } },
            ],
            isActive: true,
        },
    })) || [];
    // Fuzzy match if no exact matches
    const fuzzyMatches = exactMatches.length === 0 && recordModel
        ? await recordModel.findAll({
            where: { isActive: true, entityType },
            limit: 50,
        })
        : [];
    const hitType = exactMatches.length > 0 ? 'exact' : fuzzyMatches.length > 0 ? 'fuzzy' : 'none';
    const candidates = [...exactMatches, ...fuzzyMatches];
    let maxConfidence = 0;
    let matchedRecords_ = [];
    for (const candidate of candidates) {
        const similarity = calculateSimilarityScore(entityName, candidate.entityName);
        if (similarity >= 80) {
            maxConfidence = Math.max(maxConfidence, similarity);
            matchedRecords_.push(candidate);
        }
    }
    return {
        entityId: `${entityType}-${nameHash.substring(0, 16)}`,
        entityName,
        matched: matchedRecords_.length > 0,
        hitType,
        matchedLists: [],
        matchedRecords: matchedRecords_,
        confidenceScore: maxConfidence,
        riskLevel: maxConfidence >= 90 ? 'critical' : maxConfidence >= 75 ? 'high' : 'low',
        checkedAt: new Date(),
    };
}
/**
 * 2. Validate entity against consolidated list
 */
async function validateEntityConsolidatedList(entityId, entityName, recordModel) {
    const hash = calculateNameHash(entityName);
    const records = await (recordModel?.findAll({
        where: { nameHash: hash, isActive: true },
    })) || [];
    return {
        isListed: records.length > 0,
        matchedRecords: records,
    };
}
/**
 * 3. Check entity against specific sanctions program
 */
async function checkEntityAgainstProgram(entityName, sanctionProgram, recordModel) {
    return await (recordModel?.findAll({
        where: {
            entityName: { [sequelize_1.Op.iLike]: `%${entityName}%` },
            sanctionProgram,
            isActive: true,
        },
    })) || [];
}
/**
 * 4. Retrieve sanctioned entity details
 */
async function getSanctionedEntityDetails(recordId, recordModel) {
    return await (recordModel?.findOne({
        where: { recordId, isActive: true },
    })) || null;
}
/**
 * 5. List all active watchlist entries for audit
 */
async function getAllActiveWatchlistEntries(limit = 1000, offset = 0, recordModel) {
    const { count, rows } = await (recordModel?.findAndCountAll({
        where: { isActive: true },
        limit,
        offset,
        order: [['listingDate', 'DESC']],
    })) || { count: 0, rows: [] };
    return { records: rows, total: count };
}
/**
 * 6. Search watchlist by partial name
 */
async function searchWatchlistByName(searchTerm, entityType, recordModel) {
    const where = {
        [sequelize_1.Op.or]: [
            { entityName: { [sequelize_1.Op.iLike]: `%${searchTerm}%` } },
            { aliases: { [sequelize_1.Op.contains]: [searchTerm] } },
        ],
        isActive: true,
    };
    if (entityType) {
        where.entityType = entityType;
    }
    return await (recordModel?.findAll({ where, limit: 100 })) || [];
}
/**
 * 7. Perform rapid entity screening with caching
 */
async function rapidEntityScreening(entityName, entityType, cache, recordModel) {
    const cacheKey = `${entityType}:${calculateNameHash(entityName)}`;
    if (cache?.has(cacheKey)) {
        return cache.get(cacheKey);
    }
    const result = await screenEntityAgainstWatchlists(entityName, entityType, undefined, recordModel);
    cache?.set(cacheKey, result);
    return result;
}
/**
 * 8. Cross-reference entity across multiple lists
 */
async function crossReferenceEntity(entityName, recordModel) {
    const listMap = new Map();
    const records = await (recordModel?.findAll({
        where: {
            [sequelize_1.Op.or]: [
                { entityName: { [sequelize_1.Op.iLike]: `%${entityName}%` } },
            ],
            isActive: true,
        },
    })) || [];
    for (const record of records) {
        if (!listMap.has(record.listId)) {
            listMap.set(record.listId, []);
        }
        listMap.get(record.listId).push(record);
    }
    return listMap;
}
// ============================================================================
// SANCTIONS CHECKING - OFAC/UN/EU FUNCTIONS (8)
// ============================================================================
/**
 * 9. Check against OFAC SDN list
 */
async function checkOFACSDNList(entityName, entityType, recordModel) {
    const records = await (recordModel?.findAll({
        where: {
            listId: 'OFAC-SDN',
            entityType,
            isActive: true,
            [sequelize_1.Op.or]: [
                { nameHash: calculateNameHash(entityName) },
                { aliases: { [sequelize_1.Op.contains]: [entityName] } },
            ],
        },
    })) || [];
    return { matched: records.length > 0, records };
}
/**
 * 10. Check against UN UNSC consolidated list
 */
async function checkUNUNSCList(entityName, recordModel) {
    const records = await (recordModel?.findAll({
        where: {
            listId: 'UN-UNSC',
            isActive: true,
            entityName: { [sequelize_1.Op.iLike]: `%${entityName}%` },
        },
        limit: 50,
    })) || [];
    return { matched: records.length > 0, records };
}
/**
 * 11. Check against EU consolidated list
 */
async function checkEUConsolidatedList(entityName, recordModel) {
    const records = await (recordModel?.findAll({
        where: {
            listId: 'EU-Consolidated',
            isActive: true,
            [sequelize_1.Op.or]: [
                { entityName: { [sequelize_1.Op.iLike]: `%${entityName}%` } },
                { nameHash: calculateNameHash(entityName) },
            ],
        },
    })) || [];
    return { matched: records.length > 0, records };
}
/**
 * 12. Check against US BIS Denied Persons List
 */
async function checkBISDeniedPersonsList(entityName, recordModel) {
    const records = await (recordModel?.findAll({
        where: {
            listId: 'US-BIS-DPL',
            isActive: true,
            entityName: { [sequelize_1.Op.iLike]: `%${entityName}%` },
        },
    })) || [];
    return { matched: records.length > 0, records };
}
/**
 * 13. Check against UK OFS list
 */
async function checkUKOFSList(entityName, recordModel) {
    const records = await (recordModel?.findAll({
        where: {
            listId: 'UK-OFS',
            isActive: true,
            entityName: { [sequelize_1.Op.iLike]: `%${entityName}%` },
        },
    })) || [];
    return { matched: records.length > 0, records };
}
/**
 * 14. Check for multi-list hits
 */
async function checkMultipleListsParallel(entityName, recordModel) {
    const lists = ['OFAC-SDN', 'UN-UNSC', 'EU-Consolidated', 'US-BIS-DPL', 'UK-OFS'];
    const results = new Map();
    for (const list of lists) {
        const records = await (recordModel?.findAll({
            where: {
                listId: list,
                entityName: { [sequelize_1.Op.iLike]: `%${entityName}%` },
                isActive: true,
            },
        })) || [];
        if (records.length > 0) {
            results.set(list, records);
        }
    }
    return results;
}
/**
 * 15. Determine overall sanctions risk
 */
async function determineSanctionsRisk(entityName, sanctionRecords) {
    if (sanctionRecords.length === 0) {
        return { riskLevel: 'low', score: 0, justification: 'No sanctions match found' };
    }
    const hasHighProfileProgram = sanctionRecords.some(r => ['SDGT', 'OFAC SDN'].includes(r.sanctionProgram));
    const score = hasHighProfileProgram ? 95 : 75;
    const riskLevel = score >= 90 ? 'critical' : 'high';
    return {
        riskLevel,
        score,
        justification: `Found ${sanctionRecords.length} match(es) on sanctions lists`,
    };
}
/**
 * 16. Verify sanctions list data freshness
 */
async function verifySanctionsDataFreshness(maxAgeDays = 7, recordModel) {
    const latest = await (recordModel?.findOne({
        order: [['createdAt', 'DESC']],
    })) || null;
    if (!latest) {
        return { isFresh: false, lastUpdate: null, ageInDays: Number.MAX_SAFE_INTEGER };
    }
    const ageInDays = Math.floor((Date.now() - latest.createdAt.getTime()) / (1000 * 60 * 60 * 24));
    const isFresh = ageInDays <= maxAgeDays;
    return { isFresh, lastUpdate: latest.createdAt, ageInDays };
}
// ============================================================================
// FUZZY NAME MATCHING & SIMILARITY FUNCTIONS (5)
// ============================================================================
/**
 * 17. Find similar names using multiple algorithms
 */
async function findSimilarNames(entityName, threshold = 80, recordModel) {
    const records = await (recordModel?.findAll({
        where: { isActive: true },
        limit: 200,
    })) || [];
    const matches = [];
    for (const record of records) {
        const levenScore = calculateSimilarityScore(entityName, record.entityName);
        const tokenScore = tokenSetSimilarity(entityName, record.entityName);
        const avgScore = Math.round((levenScore + tokenScore) / 2);
        if (avgScore >= threshold) {
            matches.push({
                matchedRecordId: record.id,
                matchedName: record.entityName,
                similarityScore: avgScore,
                matchMethod: levenScore > tokenScore ? 'levenshtein' : 'token_set',
                matchedFields: ['entityName'],
            });
        }
    }
    return matches.sort((a, b) => b.similarityScore - a.similarityScore);
}
/**
 * 18. Phonetic name matching
 */
function phoneticallyMatchName(entityName, candidateNames) {
    const sourceCode = soundexCode(entityName);
    return candidateNames
        .map(name => ({
        name,
        score: soundexCode(name) === sourceCode ? 95 : calculateSimilarityScore(entityName, name),
    }))
        .filter(m => m.score >= 75)
        .sort((a, b) => b.score - a.score);
}
/**
 * 19. Weighted fuzzy match combining multiple methods
 */
function weightedFuzzyMatch(entityName, candidateName) {
    const levenScore = calculateSimilarityScore(entityName, candidateName);
    const tokenScore = tokenSetSimilarity(entityName, candidateName);
    const phoneticMatch = soundexCode(entityName) === soundexCode(candidateName) ? 100 : 0;
    const weights = { levenshtein: 0.4, tokenSet: 0.35, phonetic: 0.25 };
    const score = Math.round(levenScore * weights.levenshtein +
        tokenScore * weights.tokenSet +
        phoneticMatch * weights.phonetic);
    return {
        score,
        methods: { levenScore, tokenScore, phoneticMatch },
    };
}
/**
 * 20. Fuzzy match with field boosting
 */
async function fuzzyMatchWithFieldBoosting(entityData, recordModel) {
    const candidates = await (recordModel?.findAll({
        where: { isActive: true },
        limit: 300,
    })) || [];
    const results = [];
    for (const candidate of candidates) {
        let score = calculateSimilarityScore(entityData.name, candidate.entityName);
        // Boost score if aliases match
        if (entityData.aliases) {
            for (const alias of entityData.aliases) {
                const aliasScore = calculateSimilarityScore(alias, candidate.entityName);
                if (aliasScore > score) {
                    score = aliasScore;
                }
            }
        }
        if (score >= 75) {
            results.push({
                matchedRecordId: candidate.id,
                matchedName: candidate.entityName,
                similarityScore: score,
                matchMethod: 'levenshtein',
                matchedFields: ['entityName'],
            });
        }
    }
    return results.sort((a, b) => b.similarityScore - a.similarityScore);
}
/**
 * 21. Name variant generation and matching
 */
function generateNameVariants(entityName) {
    const normalized = normalizeEntityName(entityName);
    const variants = new Set([entityName, normalized]);
    const words = normalized.split(/\s+/);
    if (words.length > 1) {
        variants.add(words.join(''));
        variants.add(words.reverse().join(' '));
    }
    const tokens = entityName.match(/\b\w+\b/g) || [];
    if (tokens.length > 2) {
        for (let i = 0; i < tokens.length; i++) {
            variants.add(tokens.slice(0, i + 1).join(' '));
        }
    }
    return Array.from(variants);
}
// ============================================================================
// HIT EVALUATION & MANAGEMENT FUNCTIONS (5)
// ============================================================================
/**
 * 22. Evaluate sanctions hit for accuracy
 */
async function evaluateSanctionsHit(hitId, evaluationStatus, falsePositiveLikelihood, evaluatedBy, notes, hitModel) {
    try {
        const hit = await hitModel?.update({
            evaluationStatus,
            falsePositiveLikelihood,
            evaluatedAt: new Date(),
            evaluatedBy,
            evaluationNotes: notes,
        }, { where: { id: hitId } });
        return { success: !!hit, updatedHit: hit };
    }
    catch (error) {
        return { success: false, updatedHit: null };
    }
}
/**
 * 23. Calculate false positive probability
 */
function calculateFalsePositiveProbability(similarityScore, matchMethod, entityTypeMatch) {
    let baseProbability = 100 - similarityScore;
    if (matchMethod === 'fuzzy') {
        baseProbability += 15;
    }
    if (!entityTypeMatch) {
        baseProbability += 20;
    }
    return Math.min(100, Math.max(0, baseProbability));
}
/**
 * 24. Get hit review queue
 */
async function getHitReviewQueue(limit = 50, hitModel) {
    return await (hitModel?.findAll({
        where: { evaluationStatus: 'pending' },
        order: [['confidenceScore', 'DESC']],
        limit,
    })) || [];
}
/**
 * 25. Bulk update hit evaluations
 */
async function bulkUpdateHitEvaluations(hitIds, evaluationStatus, hitModel) {
    const result = await (hitModel?.update({ evaluationStatus }, { where: { id: hitIds } })) || [0];
    return { updated: result[0] || 0, failed: hitIds.length - (result[0] || 0) };
}
/**
 * 26. Calculate aggregate hit statistics
 */
async function calculateHitStatistics(timeRange, hitModel) {
    const hits = await (hitModel?.findAll({
        where: {
            createdAt: { [sequelize_1.Op.between]: [timeRange.from, timeRange.to] },
        },
    })) || [];
    const total = hits.length;
    const confirmed = hits.filter((h) => h.evaluationStatus === 'confirmed').length;
    const rejected = hits.filter((h) => h.evaluationStatus === 'rejected').length;
    const pending = hits.filter((h) => h.evaluationStatus === 'pending').length;
    const avgScore = total > 0
        ? Math.round(hits.reduce((sum, h) => sum + h.confidenceScore, 0) / total)
        : 0;
    return {
        totalHits: total,
        confirmedHits: confirmed,
        rejectedHits: rejected,
        pendingHits: pending,
        avgConfidenceScore: avgScore,
    };
}
// ============================================================================
// FALSE POSITIVE MANAGEMENT FUNCTIONS (4)
// ============================================================================
/**
 * 27. Register false positive
 */
async function registerFalsePositive(hitId, recordId, reason, auditModel) {
    try {
        await auditModel?.create({
            action: 'false_positive_registered',
            entityType: 'sanctions_hit',
            entityId: hitId,
            userId: 'system',
            changes: { reason },
        });
        return { registered: true };
    }
    catch (error) {
        return { registered: false };
    }
}
/**
 * 28. Suppress false positive from screening
 */
async function suppressFalsePositive(recordId, entityId, suppressionReason, recordModel) {
    try {
        await recordModel?.update({ isActive: false }, { where: { recordId, entityId } });
        return { suppressed: true };
    }
    catch (error) {
        return { suppressed: false };
    }
}
/**
 * 29. Analyze false positive patterns
 */
async function analyzeFalsePositivePatterns(hitModel) {
    const falsePositives = await (hitModel?.findAll({
        where: { evaluationStatus: 'rejected' },
    })) || [];
    const typeCount = {};
    for (const fp of falsePositives) {
        const key = fp.matchType || 'unknown';
        typeCount[key] = (typeCount[key] || 0) + 1;
    }
    const patterns = Object.entries(typeCount)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count);
    return {
        commonFalsePositiveTypes: patterns.slice(0, 5),
        highestFalsePositiveRate: patterns[0]?.type || 'none',
    };
}
/**
 * 30. Create false positive whitelist
 */
async function createFalsePositiveWhitelist(entityName, recordId, reason, recordModel) {
    try {
        const whitelistId = `WL-${Date.now()}`;
        await recordModel?.create({
            listId: 'WHITELIST-FP',
            recordId: whitelistId,
            entityName,
            entityType: 'organization',
            sanctionReason: `False positive: ${reason}`,
            sanctionProgram: 'WHITELIST',
            listingDate: new Date(),
            isActive: true,
        });
        return { whitelisted: true, whitelistId };
    }
    catch (error) {
        return { whitelisted: false, whitelistId: '' };
    }
}
// ============================================================================
// PEP CROSS-REFERENCE FUNCTIONS (3)
// ============================================================================
/**
 * 31. Screen entity against PEP records
 */
async function screenAgainstPEPList(entityName, country, pepModel) {
    const matches = await (pepModel?.findAll({
        where: {
            [sequelize_1.Op.or]: [
                { fullName: { [sequelize_1.Op.iLike]: `%${entityName}%` } },
                { aliases: { [sequelize_1.Op.contains]: [entityName] } },
            ],
            country,
        },
    })) || [];
    return { matched: matches.length > 0, pepRecords: matches };
}
/**
 * 32. Check for related parties of PEPs
 */
async function checkPEPRelatedParties(entityName, pepModel) {
    return await (pepModel?.findAll({
        where: {
            exposureLevel: { [sequelize_1.Op.in]: ['family', 'close_associate'] },
            [sequelize_1.Op.or]: [
                { fullName: { [sequelize_1.Op.iLike]: `%${entityName}%` } },
                { aliases: { [sequelize_1.Op.contains]: [entityName] } },
            ],
        },
    })) || [];
}
/**
 * 33. Calculate PEP risk score
 */
async function calculatePEPRiskScore(entityName, pepModel) {
    const pepRecords = await (pepModel?.findAll({
        where: {
            [sequelize_1.Op.or]: [
                { fullName: { [sequelize_1.Op.iLike]: `%${entityName}%` } },
            ],
        },
    })) || [];
    if (pepRecords.length === 0)
        return 0;
    const avgScore = pepRecords.reduce((sum, pep) => sum + (pep.riskScore || 0), 0) / pepRecords.length;
    return Math.round(avgScore);
}
// ============================================================================
// COUNTRY & SECTORAL SANCTIONS FUNCTIONS (4)
// ============================================================================
/**
 * 34. Check country-based sanctions
 */
async function checkCountrySanctions(countryCode, recordModel) {
    const records = await (recordModel?.findAll({
        where: {
            nationality: { [sequelize_1.Op.contains]: [countryCode] },
            isActive: true,
        },
    })) || [];
    const programs = [...new Set(records.map((r) => r.sanctionProgram))];
    return {
        isSanctioned: records.length > 0,
        programs,
    };
}
/**
 * 35. Check sectoral sanctions
 */
async function checkSectoralSanctions(sectorCode, recordModel) {
    const sectorProgramMap = {
        'ENERGY': ['OFAC-VENEZUELA-OIL', 'OFAC-IRAN-OIL'],
        'TECH': ['OFAC-IRAN-TECH', 'OFAC-N-KOREA-TECH'],
        'FINANCE': ['OFAC-SECONDARY-SANCTIONS', 'OFAC-FSOC'],
    };
    const programs = sectorProgramMap[sectorCode] || [];
    const records = await (recordModel?.findAll({
        where: {
            sanctionProgram: { [sequelize_1.Op.in]: programs },
            isActive: true,
        },
    })) || [];
    return { records };
}
/**
 * 36. Validate transaction for sectoral compliance
 */
async function validateTransactionSectoralCompliance(entityName, sector, transactionAmount, recordModel) {
    const { records } = await checkSectoralSanctions(sector, recordModel);
    const hasMatch = records.some((r) => calculateSimilarityScore(entityName, r.entityName) > 80);
    if (!hasMatch) {
        return { compliant: true, reason: 'No sectoral sanctions match' };
    }
    return {
        compliant: false,
        reason: `Entity matches sectoral sanctions for ${sector}`,
    };
}
/**
 * 37. Get embargo countries list
 */
function getEmbargoCountries() {
    return ['IR', 'KP', 'SY', 'CU'];
}
// ============================================================================
// BATCH SCREENING FUNCTIONS (3)
// ============================================================================
/**
 * 38. Submit batch screening job
 */
async function submitBatchScreeningJob(jobId, entities, recordModel) {
    const results = [];
    for (const entity of entities) {
        const result = await screenEntityAgainstWatchlists(entity.name, entity.type, undefined, recordModel);
        results.push(result);
    }
    const matched = results.filter(r => r.matched).length;
    return {
        jobId,
        entityCount: entities.length,
        processedCount: entities.length,
        matchedCount: matched,
        jobStatus: 'completed',
        startedAt: new Date(),
        completedAt: new Date(),
        results,
    };
}
/**
 * 39. Get batch job status
 */
function getBatchJobStatus(job) {
    const progress = job.entityCount > 0 ? Math.round((job.processedCount / job.entityCount) * 100) : 0;
    const matchRate = job.processedCount > 0 ? Math.round((job.matchedCount / job.processedCount) * 100) : 0;
    return { status: job.jobStatus, progress, matchRate };
}
/**
 * 40. Export batch screening results
 */
function exportBatchScreeningResults(job, format = 'json') {
    if (format === 'json') {
        return JSON.stringify(job, null, 2);
    }
    const headers = ['Entity ID', 'Entity Name', 'Matched', 'Confidence Score', 'Risk Level'];
    const rows = job.results.map(r => [
        r.entityId,
        r.entityName,
        r.matched ? 'Yes' : 'No',
        r.confidenceScore.toString(),
        r.riskLevel,
    ]);
    return [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');
}
// ============================================================================
// AUDIT TRAILS & LOGGING FUNCTIONS (3)
// ============================================================================
/**
 * Additional: Create audit trail entry
 */
async function createAuditTrailEntry(action, entityType, entityId, userId, changes, auditModel) {
    try {
        const entry = await auditModel?.create({
            action,
            entityType,
            entityId,
            userId,
            changes,
            ipAddress: '0.0.0.0',
        });
        return { entryId: entry?.id || '', success: !!entry };
    }
    catch (error) {
        return { entryId: '', success: false };
    }
}
/**
 * Additional: Retrieve audit trail for entity
 */
async function retrieveAuditTrail(entityId, limit = 100, auditModel) {
    return await (auditModel?.findAll({
        where: { entityId },
        order: [['createdAt', 'DESC']],
        limit,
    })) || [];
}
/**
 * Additional: Export audit trail
 */
function exportAuditTrail(entries, format = 'json') {
    if (format === 'json') {
        return JSON.stringify(entries, null, 2);
    }
    const headers = ['Entry ID', 'Action', 'Entity Type', 'Entity ID', 'User', 'Date'];
    const rows = entries.map(e => [
        e.entryId,
        e.action,
        e.entityType,
        e.entityId,
        e.userId,
        e.performedAt.toISOString(),
    ]);
    return [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');
}
// ============================================================================
// INVESTIGATION WORKFLOWS FUNCTIONS (3)
// ============================================================================
/**
 * Additional: Open investigation
 */
async function openInvestigation(hitId, recordId, assignedTo, investigationModel) {
    try {
        const investigation = await investigationModel?.create({
            hitId,
            recordId,
            investigationStatus: 'open',
            investigationNotes: [],
            assignedTo,
        });
        return { investigationId: investigation?.id || '', success: !!investigation };
    }
    catch (error) {
        return { investigationId: '', success: false };
    }
}
/**
 * Additional: Add investigation note
 */
async function addInvestigationNote(investigationId, note, investigationModel) {
    try {
        const investigation = await investigationModel?.findByPk(investigationId);
        if (!investigation)
            return { success: false };
        const notes = investigation.investigationNotes || [];
        notes.push(`[${new Date().toISOString()}] ${note}`);
        await investigation.update({ investigationNotes: notes });
        return { success: true };
    }
    catch (error) {
        return { success: false };
    }
}
/**
 * Additional: Close investigation
 */
async function closeInvestigation(investigationId, closureReason, investigationModel) {
    try {
        await investigationModel?.update({
            investigationStatus: 'closed',
            closureReason,
            closedAt: new Date(),
        }, { where: { id: investigationId } });
        return { success: true };
    }
    catch (error) {
        return { success: false };
    }
}
// ============================================================================
// REGULATORY LIST INTEGRATION FUNCTIONS (2)
// ============================================================================
/**
 * Additional: Sync external sanctions list
 */
async function syncExternalSanctionsList(listId, records, recordModel) {
    const syncId = `SYNC-${Date.now()}`;
    try {
        let added = 0, updated = 0;
        for (const record of records) {
            const existing = await recordModel?.findOne({
                where: { recordId: record.recordId, listId },
            });
            if (existing) {
                await existing.update(record);
                updated++;
            }
            else {
                await recordModel?.create({
                    ...record,
                    listId,
                    nameHash: calculateNameHash(record.entityName),
                    isActive: true,
                });
                added++;
            }
        }
        return {
            syncId,
            listId,
            listName: listId || 'CUSTOM',
            syncStatus: 'completed',
            recordsAdded: added,
            recordsUpdated: updated,
            recordsRemoved: 0,
            syncedAt: new Date(),
            nextSyncDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        };
    }
    catch (error) {
        return {
            syncId,
            listId,
            listName: listId || 'CUSTOM',
            syncStatus: 'failed',
            recordsAdded: 0,
            recordsUpdated: 0,
            recordsRemoved: 0,
            syncedAt: new Date(),
            nextSyncDue: new Date(),
            errorMessage: String(error),
        };
    }
}
/**
 * Additional: Validate regulatory data integrity
 */
async function validateRegulatoryDataIntegrity(recordModel) {
    const records = await (recordModel?.findAll()) || [];
    const issues = [];
    let invalidCount = 0;
    for (const record of records) {
        if (!record.entityName || record.entityName.trim().length === 0) {
            issues.push(`Record ${record.id}: Missing entity name`);
            invalidCount++;
        }
        if (!record.sanctionProgram) {
            issues.push(`Record ${record.id}: Missing sanction program`);
            invalidCount++;
        }
    }
    const integrityScore = records.length > 0
        ? Math.round(((records.length - invalidCount) / records.length) * 100)
        : 100;
    return {
        totalRecords: records.length,
        invalidRecords: invalidCount,
        integrityScore,
        issues,
    };
}
// ============================================================================
// EXCEPTION HANDLING & REPORTING FUNCTIONS (2)
// ============================================================================
/**
 * Additional: Generate sanctions screening report
 */
function generateSanctionsScreeningReport(jobId, job, timeRange) {
    const report = {
        jobId,
        generatedAt: new Date().toISOString(),
        timeRange,
        summary: {
            totalEntitiesScreened: job.entityCount,
            totalHits: job.matchedCount,
            hitRate: job.entityCount > 0 ? `${Math.round((job.matchedCount / job.entityCount) * 100)}%` : '0%',
        },
        statusBreakdown: {
            critical: job.results.filter(r => r.riskLevel === 'critical').length,
            high: job.results.filter(r => r.riskLevel === 'high').length,
            medium: job.results.filter(r => r.riskLevel === 'medium').length,
            low: job.results.filter(r => r.riskLevel === 'low').length,
        },
    };
    return JSON.stringify(report, null, 2);
}
/**
 * Additional: Handle screening errors gracefully
 */
async function handleScreeningError(error, context, auditModel) {
    const errorId = `ERR-${Date.now()}`;
    try {
        await auditModel?.create({
            action: 'screening_error',
            entityType: 'error',
            entityId: errorId,
            userId: 'system',
            changes: {
                errorMessage: error.message,
                context,
            },
        });
        return { handled: true, errorId };
    }
    catch (logError) {
        return { handled: false, errorId };
    }
}
//# sourceMappingURL=sanctions-screening-watchlist-kit.js.map