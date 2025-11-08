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

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

// ============================================================================
// TYPE DEFINITIONS & INTERFACES
// ============================================================================

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
  similarityScore: number; // 0-100
  matchMethod: 'levenshtein' | 'phonetic' | 'token_set' | 'ngram';
  matchedFields: string[];
}

interface HitEvaluation {
  hitId: string;
  recordId: string;
  evaluationStatus: 'pending' | 'confirmed' | 'rejected' | 'under_review';
  falsePositiveLikelihood: number; // 0-100
  evaluatedAt: Date;
  evaluatedBy: string;
  evaluationNotes: string;
  resolutionDate?: Date;
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

interface InvestigationWorkflow {
  investigationId: string;
  hitId: string;
  recordId: string;
  investigationStatus: 'open' | 'under_review' | 'closed' | 'escalated';
  investigationNotes: string[];
  assignedTo: string;
  createdAt: Date;
  closedAt?: Date;
  closureReason?: string;
  escalationReason?: string;
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

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sanctions Records model - stores all sanctions list entries
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} SanctionsRecord model
 */
export const createSanctionsRecordModel = (sequelize: Sequelize) => {
  class SanctionsRecordModel extends Model {
    public id!: string;
    public listId!: string;
    public recordId!: string;
    public entityName!: string;
    public entityType!: string;
    public aliases!: string[];
    public dateOfBirth!: Date | null;
    public nationality!: string[];
    public addresses!: SanctionAddress[];
    public sanctionReason!: string;
    public sanctionProgram!: string;
    public listingDate!: Date;
    public sdnType!: string | null;
    public remarks!: string | null;
    public nameHash!: string;
    public isActive!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  SanctionsRecordModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      listId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        index: true,
      },
      recordId: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      entityName: {
        type: DataTypes.STRING(500),
        allowNull: false,
        index: true,
      },
      entityType: {
        type: DataTypes.ENUM('individual', 'organization', 'vessel', 'aircraft'),
        allowNull: false,
      },
      aliases: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      dateOfBirth: {
        type: DataTypes.DATE,
      },
      nationality: {
        type: DataTypes.ARRAY(DataTypes.STRING(2)),
        defaultValue: [],
      },
      addresses: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
      sanctionReason: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      sanctionProgram: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      listingDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      sdnType: {
        type: DataTypes.STRING(50),
      },
      remarks: {
        type: DataTypes.TEXT,
      },
      nameHash: {
        type: DataTypes.STRING(64),
        allowNull: false,
        index: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        index: true,
      },
    },
    {
      sequelize,
      tableName: 'sanctions_records',
      timestamps: true,
      indexes: [
        { fields: ['listId', 'entityName'] },
        { fields: ['nameHash'] },
        { fields: ['isActive'] },
      ],
    }
  );

  return SanctionsRecordModel;
};

/**
 * Sanctions Hits model - tracks matched entities
 */
export const createSanctionsHitModel = (sequelize: Sequelize) => {
  class SanctionsHit extends Model {
    public id!: string;
    public screeningId!: string;
    public recordId!: string;
    public entityId!: string;
    public entityName!: string;
    public matchedName!: string;
    public matchType!: string;
    public confidenceScore!: number;
    public riskLevel!: string;
    public evaluationStatus!: string;
    public falsePositiveLikelihood!: number;
    public evaluatedAt!: Date | null;
    public evaluatedBy!: string | null;
    public evaluationNotes!: string | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  SanctionsHit.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      screeningId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        index: true,
      },
      recordId: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      entityId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        index: true,
      },
      entityName: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      matchedName: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      matchType: {
        type: DataTypes.ENUM('exact', 'fuzzy', 'none'),
        allowNull: false,
      },
      confidenceScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      riskLevel: {
        type: DataTypes.ENUM('critical', 'high', 'medium', 'low'),
        allowNull: false,
      },
      evaluationStatus: {
        type: DataTypes.ENUM('pending', 'confirmed', 'rejected', 'under_review'),
        defaultValue: 'pending',
      },
      falsePositiveLikelihood: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
      },
      evaluatedAt: DataTypes.DATE,
      evaluatedBy: DataTypes.STRING(100),
      evaluationNotes: DataTypes.TEXT,
    },
    {
      sequelize,
      tableName: 'sanctions_hits',
      timestamps: true,
      indexes: [
        { fields: ['screeningId', 'evaluationStatus'] },
        { fields: ['entityId'] },
      ],
    }
  );

  return SanctionsHit;
};

/**
 * Investigations model - tracks investigation workflows
 */
export const createInvestigationModel = (sequelize: Sequelize) => {
  class Investigation extends Model {
    public id!: string;
    public hitId!: string;
    public recordId!: string;
    public investigationStatus!: string;
    public investigationNotes!: string[];
    public assignedTo!: string;
    public createdAt!: Date;
    public closedAt!: Date | null;
    public closureReason!: string | null;
    public escalationReason!: string | null;
  }

  Investigation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      hitId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        index: true,
      },
      recordId: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      investigationStatus: {
        type: DataTypes.ENUM('open', 'under_review', 'closed', 'escalated'),
        defaultValue: 'open',
      },
      investigationNotes: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        defaultValue: [],
      },
      assignedTo: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      closedAt: DataTypes.DATE,
      closureReason: DataTypes.TEXT,
      escalationReason: DataTypes.TEXT,
    },
    {
      sequelize,
      tableName: 'investigations',
      timestamps: true,
    }
  );

  return Investigation;
};

/**
 * PEP Records model - politically exposed persons database
 */
export const createPepRecordModel = (sequelize: Sequelize) => {
  class PepRecordModel extends Model {
    public id!: string;
    public pepId!: string;
    public fullName!: string;
    public aliases!: string[];
    public position!: string;
    public country!: string;
    public institution!: string;
    public exposureLevel!: string;
    public riskScore!: number;
    public verificationDate!: Date;
    public nameHash!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  PepRecordModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      pepId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      fullName: {
        type: DataTypes.STRING(500),
        allowNull: false,
        index: true,
      },
      aliases: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      position: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING(2),
        allowNull: false,
      },
      institution: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      exposureLevel: {
        type: DataTypes.ENUM('direct', 'family', 'close_associate'),
        allowNull: false,
      },
      riskScore: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      verificationDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      nameHash: {
        type: DataTypes.STRING(64),
        index: true,
      },
    },
    {
      sequelize,
      tableName: 'pep_records',
      timestamps: true,
    }
  );

  return PepRecordModel;
};

/**
 * Audit Trail model
 */
export const createAuditTrailModel = (sequelize: Sequelize) => {
  class AuditTrail extends Model {
    public id!: string;
    public action!: string;
    public entityType!: string;
    public entityId!: string;
    public userId!: string;
    public changes!: Record<string, any>;
    public ipAddress!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
  }

  AuditTrail.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      action: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      entityType: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      entityId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        index: true,
      },
      userId: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      changes: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
      ipAddress: DataTypes.STRING(45),
      metadata: {
        type: DataTypes.JSONB,
        defaultValue: {},
      },
    },
    {
      sequelize,
      tableName: 'audit_trails',
      timestamps: true,
    }
  );

  return AuditTrail;
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Normalize entity name for consistent matching
 */
export function normalizeEntityName(name: string): string {
  return name
    .toUpperCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculate hash for name-based indexing
 */
export function calculateNameHash(name: string): string {
  return createHash('sha256').update(normalizeEntityName(name)).digest('hex');
}

/**
 * Calculate Levenshtein distance between two strings
 */
export function levenshteinDistance(a: string, b: string): number {
  const normA = normalizeEntityName(a);
  const normB = normalizeEntityName(b);
  const matrix: number[][] = [];

  for (let i = 0; i <= normB.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= normA.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= normB.length; i++) {
    for (let j = 1; j <= normA.length; j++) {
      const cost = normA[j - 1] === normB[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i][j - 1] + 1,
        matrix[i - 1][j] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[normB.length][normA.length];
}

/**
 * Calculate similarity score (0-100) using Levenshtein
 */
export function calculateSimilarityScore(a: string, b: string): number {
  const maxLen = Math.max(normalizeEntityName(a).length, normalizeEntityName(b).length);
  if (maxLen === 0) return 100;
  const distance = levenshteinDistance(a, b);
  return Math.round(((maxLen - distance) / maxLen) * 100);
}

/**
 * Phonetic matching using Soundex algorithm
 */
export function soundexCode(text: string): string {
  const normalized = normalizeEntityName(text).replace(/\s+/g, '');
  if (!normalized) return '';

  const firstChar = normalized[0];
  const codes: Record<string, string> = {
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
    } else if (currentCode === '0') {
      lastCode = '0';
    }
  }

  return code.padEnd(4, '0');
}

/**
 * Token-based set matching
 */
export function tokenSetSimilarity(a: string, b: string): number {
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
export async function screenEntityAgainstWatchlists(
  entityName: string,
  entityType: 'individual' | 'organization' | 'vessel' | 'aircraft',
  additionalData?: { aliases?: string[]; dateOfBirth?: Date; nationality?: string },
  recordModel?: any
): Promise<SanctionsCheckResult> {
  const startTime = Date.now();
  const nameHash = calculateNameHash(entityName);
  const matchedRecords: SanctionsRecord[] = [];

  // Exact match query
  const exactMatches = await (recordModel?.findAll({
    where: {
      [Op.or]: [
        { nameHash },
        { aliases: { [Op.contains]: [entityName] } },
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
  let matchedRecords_: SanctionsRecord[] = [];

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
export async function validateEntityConsolidatedList(
  entityId: string,
  entityName: string,
  recordModel?: any
): Promise<{ isListed: boolean; matchedRecords: SanctionsRecord[] }> {
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
export async function checkEntityAgainstProgram(
  entityName: string,
  sanctionProgram: string,
  recordModel?: any
): Promise<SanctionsRecord[]> {
  return await (recordModel?.findAll({
    where: {
      entityName: { [Op.iLike]: `%${entityName}%` },
      sanctionProgram,
      isActive: true,
    },
  })) || [];
}

/**
 * 4. Retrieve sanctioned entity details
 */
export async function getSanctionedEntityDetails(
  recordId: string,
  recordModel?: any
): Promise<SanctionsRecord | null> {
  return await (recordModel?.findOne({
    where: { recordId, isActive: true },
  })) || null;
}

/**
 * 5. List all active watchlist entries for audit
 */
export async function getAllActiveWatchlistEntries(
  limit: number = 1000,
  offset: number = 0,
  recordModel?: any
): Promise<{ records: SanctionsRecord[]; total: number }> {
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
export async function searchWatchlistByName(
  searchTerm: string,
  entityType?: string,
  recordModel?: any
): Promise<SanctionsRecord[]> {
  const where: any = {
    [Op.or]: [
      { entityName: { [Op.iLike]: `%${searchTerm}%` } },
      { aliases: { [Op.contains]: [searchTerm] } },
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
export async function rapidEntityScreening(
  entityName: string,
  entityType: string,
  cache?: Map<string, any>,
  recordModel?: any
): Promise<SanctionsCheckResult> {
  const cacheKey = `${entityType}:${calculateNameHash(entityName)}`;

  if (cache?.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const result = await screenEntityAgainstWatchlists(entityName, entityType as any, undefined, recordModel);

  cache?.set(cacheKey, result);

  return result;
}

/**
 * 8. Cross-reference entity across multiple lists
 */
export async function crossReferenceEntity(
  entityName: string,
  recordModel?: any
): Promise<Map<string, SanctionsRecord[]>> {
  const listMap = new Map<string, SanctionsRecord[]>();
  const records = await (recordModel?.findAll({
    where: {
      [Op.or]: [
        { entityName: { [Op.iLike]: `%${entityName}%` } },
      ],
      isActive: true,
    },
  })) || [];

  for (const record of records) {
    if (!listMap.has(record.listId)) {
      listMap.set(record.listId, []);
    }
    listMap.get(record.listId)!.push(record);
  }

  return listMap;
}

// ============================================================================
// SANCTIONS CHECKING - OFAC/UN/EU FUNCTIONS (8)
// ============================================================================

/**
 * 9. Check against OFAC SDN list
 */
export async function checkOFACSDNList(
  entityName: string,
  entityType: string,
  recordModel?: any
): Promise<{ matched: boolean; records: SanctionsRecord[] }> {
  const records = await (recordModel?.findAll({
    where: {
      listId: 'OFAC-SDN',
      entityType,
      isActive: true,
      [Op.or]: [
        { nameHash: calculateNameHash(entityName) },
        { aliases: { [Op.contains]: [entityName] } },
      ],
    },
  })) || [];

  return { matched: records.length > 0, records };
}

/**
 * 10. Check against UN UNSC consolidated list
 */
export async function checkUNUNSCList(
  entityName: string,
  recordModel?: any
): Promise<{ matched: boolean; records: SanctionsRecord[] }> {
  const records = await (recordModel?.findAll({
    where: {
      listId: 'UN-UNSC',
      isActive: true,
      entityName: { [Op.iLike]: `%${entityName}%` },
    },
    limit: 50,
  })) || [];

  return { matched: records.length > 0, records };
}

/**
 * 11. Check against EU consolidated list
 */
export async function checkEUConsolidatedList(
  entityName: string,
  recordModel?: any
): Promise<{ matched: boolean; records: SanctionsRecord[] }> {
  const records = await (recordModel?.findAll({
    where: {
      listId: 'EU-Consolidated',
      isActive: true,
      [Op.or]: [
        { entityName: { [Op.iLike]: `%${entityName}%` } },
        { nameHash: calculateNameHash(entityName) },
      ],
    },
  })) || [];

  return { matched: records.length > 0, records };
}

/**
 * 12. Check against US BIS Denied Persons List
 */
export async function checkBISDeniedPersonsList(
  entityName: string,
  recordModel?: any
): Promise<{ matched: boolean; records: SanctionsRecord[] }> {
  const records = await (recordModel?.findAll({
    where: {
      listId: 'US-BIS-DPL',
      isActive: true,
      entityName: { [Op.iLike]: `%${entityName}%` },
    },
  })) || [];

  return { matched: records.length > 0, records };
}

/**
 * 13. Check against UK OFS list
 */
export async function checkUKOFSList(
  entityName: string,
  recordModel?: any
): Promise<{ matched: boolean; records: SanctionsRecord[] }> {
  const records = await (recordModel?.findAll({
    where: {
      listId: 'UK-OFS',
      isActive: true,
      entityName: { [Op.iLike]: `%${entityName}%` },
    },
  })) || [];

  return { matched: records.length > 0, records };
}

/**
 * 14. Check for multi-list hits
 */
export async function checkMultipleListsParallel(
  entityName: string,
  recordModel?: any
): Promise<Map<string, SanctionsRecord[]>> {
  const lists = ['OFAC-SDN', 'UN-UNSC', 'EU-Consolidated', 'US-BIS-DPL', 'UK-OFS'];
  const results = new Map<string, SanctionsRecord[]>();

  for (const list of lists) {
    const records = await (recordModel?.findAll({
      where: {
        listId: list,
        entityName: { [Op.iLike]: `%${entityName}%` },
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
export async function determineSanctionsRisk(
  entityName: string,
  sanctionRecords: SanctionsRecord[]
): Promise<{ riskLevel: string; score: number; justification: string }> {
  if (sanctionRecords.length === 0) {
    return { riskLevel: 'low', score: 0, justification: 'No sanctions match found' };
  }

  const hasHighProfileProgram = sanctionRecords.some(r =>
    ['SDGT', 'OFAC SDN'].includes(r.sanctionProgram)
  );

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
export async function verifySanctionsDataFreshness(
  maxAgeDays: number = 7,
  recordModel?: any
): Promise<{ isFresh: boolean; lastUpdate: Date | null; ageInDays: number }> {
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
export async function findSimilarNames(
  entityName: string,
  threshold: number = 80,
  recordModel?: any
): Promise<FuzzyMatchResult[]> {
  const records = await (recordModel?.findAll({
    where: { isActive: true },
    limit: 200,
  })) || [];

  const matches: FuzzyMatchResult[] = [];

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
export function phoneticallyMatchName(
  entityName: string,
  candidateNames: string[]
): Array<{ name: string; score: number }> {
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
export function weightedFuzzyMatch(
  entityName: string,
  candidateName: string
): { score: number; methods: Record<string, number> } {
  const levenScore = calculateSimilarityScore(entityName, candidateName);
  const tokenScore = tokenSetSimilarity(entityName, candidateName);
  const phoneticMatch = soundexCode(entityName) === soundexCode(candidateName) ? 100 : 0;

  const weights = { levenshtein: 0.4, tokenSet: 0.35, phonetic: 0.25 };
  const score = Math.round(
    levenScore * weights.levenshtein +
    tokenScore * weights.tokenSet +
    phoneticMatch * weights.phonetic
  );

  return {
    score,
    methods: { levenScore, tokenScore, phoneticMatch },
  };
}

/**
 * 20. Fuzzy match with field boosting
 */
export async function fuzzyMatchWithFieldBoosting(
  entityData: { name: string; aliases?: string[]; country?: string },
  recordModel?: any
): Promise<FuzzyMatchResult[]> {
  const candidates = await (recordModel?.findAll({
    where: { isActive: true },
    limit: 300,
  })) || [];

  const results: FuzzyMatchResult[] = [];

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
export function generateNameVariants(entityName: string): string[] {
  const normalized = normalizeEntityName(entityName);
  const variants = new Set<string>([entityName, normalized]);

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
export async function evaluateSanctionsHit(
  hitId: string,
  evaluationStatus: 'confirmed' | 'rejected' | 'under_review',
  falsePositiveLikelihood: number,
  evaluatedBy: string,
  notes: string,
  hitModel?: any
): Promise<{ success: boolean; updatedHit: any }> {
  try {
    const hit = await hitModel?.update(
      {
        evaluationStatus,
        falsePositiveLikelihood,
        evaluatedAt: new Date(),
        evaluatedBy,
        evaluationNotes: notes,
      },
      { where: { id: hitId } }
    );

    return { success: !!hit, updatedHit: hit };
  } catch (error) {
    return { success: false, updatedHit: null };
  }
}

/**
 * 23. Calculate false positive probability
 */
export function calculateFalsePositiveProbability(
  similarityScore: number,
  matchMethod: string,
  entityTypeMatch: boolean
): number {
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
export async function getHitReviewQueue(
  limit: number = 50,
  hitModel?: any
): Promise<any[]> {
  return await (hitModel?.findAll({
    where: { evaluationStatus: 'pending' },
    order: [['confidenceScore', 'DESC']],
    limit,
  })) || [];
}

/**
 * 25. Bulk update hit evaluations
 */
export async function bulkUpdateHitEvaluations(
  hitIds: string[],
  evaluationStatus: string,
  hitModel?: any
): Promise<{ updated: number; failed: number }> {
  const result = await (hitModel?.update(
    { evaluationStatus },
    { where: { id: hitIds } }
  )) || [0];

  return { updated: result[0] || 0, failed: hitIds.length - (result[0] || 0) };
}

/**
 * 26. Calculate aggregate hit statistics
 */
export async function calculateHitStatistics(
  timeRange: { from: Date; to: Date },
  hitModel?: any
): Promise<{
  totalHits: number;
  confirmedHits: number;
  rejectedHits: number;
  pendingHits: number;
  avgConfidenceScore: number;
}> {
  const hits = await (hitModel?.findAll({
    where: {
      createdAt: { [Op.between]: [timeRange.from, timeRange.to] },
    },
  })) || [];

  const total = hits.length;
  const confirmed = hits.filter((h: any) => h.evaluationStatus === 'confirmed').length;
  const rejected = hits.filter((h: any) => h.evaluationStatus === 'rejected').length;
  const pending = hits.filter((h: any) => h.evaluationStatus === 'pending').length;

  const avgScore = total > 0
    ? Math.round(hits.reduce((sum: number, h: any) => sum + h.confidenceScore, 0) / total)
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
export async function registerFalsePositive(
  hitId: string,
  recordId: string,
  reason: string,
  auditModel?: any
): Promise<{ registered: boolean }> {
  try {
    await auditModel?.create({
      action: 'false_positive_registered',
      entityType: 'sanctions_hit',
      entityId: hitId,
      userId: 'system',
      changes: { reason },
    });

    return { registered: true };
  } catch (error) {
    return { registered: false };
  }
}

/**
 * 28. Suppress false positive from screening
 */
export async function suppressFalsePositive(
  recordId: string,
  entityId: string,
  suppressionReason: string,
  recordModel?: any
): Promise<{ suppressed: boolean }> {
  try {
    await recordModel?.update(
      { isActive: false },
      { where: { recordId, entityId } }
    );

    return { suppressed: true };
  } catch (error) {
    return { suppressed: false };
  }
}

/**
 * 29. Analyze false positive patterns
 */
export async function analyzeFalsePositivePatterns(
  hitModel?: any
): Promise<{
  commonFalsePositiveTypes: Array<{ type: string; count: number }>;
  highestFalsePositiveRate: string;
}> {
  const falsePositives = await (hitModel?.findAll({
    where: { evaluationStatus: 'rejected' },
  })) || [];

  const typeCount: Record<string, number> = {};

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
export async function createFalsePositiveWhitelist(
  entityName: string,
  recordId: string,
  reason: string,
  recordModel?: any
): Promise<{ whitelisted: boolean; whitelistId: string }> {
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
  } catch (error) {
    return { whitelisted: false, whitelistId: '' };
  }
}

// ============================================================================
// PEP CROSS-REFERENCE FUNCTIONS (3)
// ============================================================================

/**
 * 31. Screen entity against PEP records
 */
export async function screenAgainstPEPList(
  entityName: string,
  country: string,
  pepModel?: any
): Promise<{ matched: boolean; pepRecords: PepRecord[] }> {
  const matches = await (pepModel?.findAll({
    where: {
      [Op.or]: [
        { fullName: { [Op.iLike]: `%${entityName}%` } },
        { aliases: { [Op.contains]: [entityName] } },
      ],
      country,
    },
  })) || [];

  return { matched: matches.length > 0, pepRecords: matches };
}

/**
 * 32. Check for related parties of PEPs
 */
export async function checkPEPRelatedParties(
  entityName: string,
  pepModel?: any
): Promise<PepRecord[]> {
  return await (pepModel?.findAll({
    where: {
      exposureLevel: { [Op.in]: ['family', 'close_associate'] },
      [Op.or]: [
        { fullName: { [Op.iLike]: `%${entityName}%` } },
        { aliases: { [Op.contains]: [entityName] } },
      ],
    },
  })) || [];
}

/**
 * 33. Calculate PEP risk score
 */
export async function calculatePEPRiskScore(
  entityName: string,
  pepModel?: any
): Promise<number> {
  const pepRecords = await (pepModel?.findAll({
    where: {
      [Op.or]: [
        { fullName: { [Op.iLike]: `%${entityName}%` } },
      ],
    },
  })) || [];

  if (pepRecords.length === 0) return 0;

  const avgScore = pepRecords.reduce((sum: number, pep: any) => sum + (pep.riskScore || 0), 0) / pepRecords.length;
  return Math.round(avgScore);
}

// ============================================================================
// COUNTRY & SECTORAL SANCTIONS FUNCTIONS (4)
// ============================================================================

/**
 * 34. Check country-based sanctions
 */
export async function checkCountrySanctions(
  countryCode: string,
  recordModel?: any
): Promise<{ isSanctioned: boolean; programs: string[] }> {
  const records = await (recordModel?.findAll({
    where: {
      nationality: { [Op.contains]: [countryCode] },
      isActive: true,
    },
  })) || [];

  const programs = [...new Set(records.map((r: any) => r.sanctionProgram))];

  return {
    isSanctioned: records.length > 0,
    programs,
  };
}

/**
 * 35. Check sectoral sanctions
 */
export async function checkSectoralSanctions(
  sectorCode: string,
  recordModel?: any
): Promise<{ records: SanctionsRecord[] }> {
  const sectorProgramMap: Record<string, string[]> = {
    'ENERGY': ['OFAC-VENEZUELA-OIL', 'OFAC-IRAN-OIL'],
    'TECH': ['OFAC-IRAN-TECH', 'OFAC-N-KOREA-TECH'],
    'FINANCE': ['OFAC-SECONDARY-SANCTIONS', 'OFAC-FSOC'],
  };

  const programs = sectorProgramMap[sectorCode] || [];
  const records = await (recordModel?.findAll({
    where: {
      sanctionProgram: { [Op.in]: programs },
      isActive: true,
    },
  })) || [];

  return { records };
}

/**
 * 36. Validate transaction for sectoral compliance
 */
export async function validateTransactionSectoralCompliance(
  entityName: string,
  sector: string,
  transactionAmount: number,
  recordModel?: any
): Promise<{ compliant: boolean; reason: string }> {
  const { records } = await checkSectoralSanctions(sector, recordModel);

  const hasMatch = records.some((r: any) =>
    calculateSimilarityScore(entityName, r.entityName) > 80
  );

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
export function getEmbargoCountries(): string[] {
  return ['IR', 'KP', 'SY', 'CU'];
}

// ============================================================================
// BATCH SCREENING FUNCTIONS (3)
// ============================================================================

/**
 * 38. Submit batch screening job
 */
export async function submitBatchScreeningJob(
  jobId: string,
  entities: Array<{ entityId: string; name: string; type: string }>,
  recordModel?: any
): Promise<BatchScreeningJob> {
  const results: SanctionsCheckResult[] = [];

  for (const entity of entities) {
    const result = await screenEntityAgainstWatchlists(entity.name, entity.type as any, undefined, recordModel);
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
export function getBatchJobStatus(job: BatchScreeningJob): {
  status: string;
  progress: number;
  matchRate: number;
} {
  const progress = job.entityCount > 0 ? Math.round((job.processedCount / job.entityCount) * 100) : 0;
  const matchRate = job.processedCount > 0 ? Math.round((job.matchedCount / job.processedCount) * 100) : 0;

  return { status: job.jobStatus, progress, matchRate };
}

/**
 * 40. Export batch screening results
 */
export function exportBatchScreeningResults(
  job: BatchScreeningJob,
  format: 'csv' | 'json' = 'json'
): string {
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
export async function createAuditTrailEntry(
  action: string,
  entityType: string,
  entityId: string,
  userId: string,
  changes: Record<string, any>,
  auditModel?: any
): Promise<{ entryId: string; success: boolean }> {
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
  } catch (error) {
    return { entryId: '', success: false };
  }
}

/**
 * Additional: Retrieve audit trail for entity
 */
export async function retrieveAuditTrail(
  entityId: string,
  limit: number = 100,
  auditModel?: any
): Promise<AuditTrailEntry[]> {
  return await (auditModel?.findAll({
    where: { entityId },
    order: [['createdAt', 'DESC']],
    limit,
  })) || [];
}

/**
 * Additional: Export audit trail
 */
export function exportAuditTrail(entries: AuditTrailEntry[], format: 'csv' | 'json' = 'json'): string {
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
export async function openInvestigation(
  hitId: string,
  recordId: string,
  assignedTo: string,
  investigationModel?: any
): Promise<{ investigationId: string; success: boolean }> {
  try {
    const investigation = await investigationModel?.create({
      hitId,
      recordId,
      investigationStatus: 'open',
      investigationNotes: [],
      assignedTo,
    });

    return { investigationId: investigation?.id || '', success: !!investigation };
  } catch (error) {
    return { investigationId: '', success: false };
  }
}

/**
 * Additional: Add investigation note
 */
export async function addInvestigationNote(
  investigationId: string,
  note: string,
  investigationModel?: any
): Promise<{ success: boolean }> {
  try {
    const investigation = await investigationModel?.findByPk(investigationId);
    if (!investigation) return { success: false };

    const notes = investigation.investigationNotes || [];
    notes.push(`[${new Date().toISOString()}] ${note}`);

    await investigation.update({ investigationNotes: notes });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

/**
 * Additional: Close investigation
 */
export async function closeInvestigation(
  investigationId: string,
  closureReason: string,
  investigationModel?: any
): Promise<{ success: boolean }> {
  try {
    await investigationModel?.update(
      {
        investigationStatus: 'closed',
        closureReason,
        closedAt: new Date(),
      },
      { where: { id: investigationId } }
    );

    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

// ============================================================================
// REGULATORY LIST INTEGRATION FUNCTIONS (2)
// ============================================================================

/**
 * Additional: Sync external sanctions list
 */
export async function syncExternalSanctionsList(
  listId: string,
  records: SanctionsRecord[],
  recordModel?: any
): Promise<WatchlistSyncStatus> {
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
      } else {
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
      listName: (listId as any) || 'CUSTOM',
      syncStatus: 'completed',
      recordsAdded: added,
      recordsUpdated: updated,
      recordsRemoved: 0,
      syncedAt: new Date(),
      nextSyncDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
  } catch (error) {
    return {
      syncId,
      listId,
      listName: (listId as any) || 'CUSTOM',
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
export async function validateRegulatoryDataIntegrity(
  recordModel?: any
): Promise<{
  totalRecords: number;
  invalidRecords: number;
  integrityScore: number;
  issues: string[];
}> {
  const records = await (recordModel?.findAll()) || [];
  const issues: string[] = [];
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
export function generateSanctionsScreeningReport(
  jobId: string,
  job: BatchScreeningJob,
  timeRange: { from: Date; to: Date }
): string {
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
export async function handleScreeningError(
  error: Error,
  context: { entityName: string; operation: string },
  auditModel?: any
): Promise<{ handled: boolean; errorId: string }> {
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
  } catch (logError) {
    return { handled: false, errorId };
  }
}
