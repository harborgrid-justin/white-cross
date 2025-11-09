"use strict";
/**
 * LOC: LGCL1234567
 * File: /reuse/legal/case-law-research-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Legal services and controllers
 *   - Case law research modules
 *   - Citation validation systems
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLegalCaseExample = exports.createCaseSearchSwaggerOperation = exports.createCitationValidationSwaggerSchema = exports.createLegalCaseSwaggerSchema = exports.findCitationPath = exports.identifyCitationClusters = exports.calculatePageRank = exports.calculateNetworkMetrics = exports.buildCitationNetwork = exports.getSubordinateCourts = exports.getCourtsInJurisdiction = exports.determinePrecedentialWeight = exports.getCourtHierarchy = exports.isBindingPrecedent = exports.scoreCaseRelevance = exports.calculateTemporalRelevance = exports.findSimilarCases = exports.calculateCaseSimilarity = exports.formatCitation = exports.extractCitationsFromText = exports.normalizeCitation = exports.generateCitationSuggestions = exports.validateCitation = exports.parseAPACitation = exports.parseBluebookCitation = exports.defineCourtModel = exports.defineCitationModel = exports.defineLegalCaseModel = exports.CitationType = exports.CourtLevel = exports.CitationFormat = exports.PrecedentialValue = exports.CaseStatus = exports.CaseType = void 0;
/**
 * File: /reuse/legal/case-law-research-kit.ts
 * Locator: WC-UTL-LGCL-001
 * Purpose: Comprehensive Case Law Research Utilities - Legal case management, citation validation, precedent analysis
 *
 * Upstream: Independent utility module for legal case research
 * Downstream: ../backend/*, Legal services, Citation validators, Court hierarchy systems
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x, @nestjs/*, class-validator
 * Exports: 45 utility functions for case law research, citation parsing, precedent analysis, court hierarchy
 *
 * LLM Context: Comprehensive case law research utilities for legal citation management, case similarity analysis,
 * court hierarchy handling, citation format validation (Bluebook, APA, etc.), precedent matching, and legal
 * citation graph analysis. Essential for legal research systems requiring robust case law management and citation
 * validation capabilities. Supports multiple citation formats, court jurisdictions, and legal precedent tracking.
 */
const sequelize_1 = require("sequelize");
/**
 * Types of legal cases.
 */
var CaseType;
(function (CaseType) {
    CaseType["CIVIL"] = "civil";
    CaseType["CRIMINAL"] = "criminal";
    CaseType["ADMINISTRATIVE"] = "administrative";
    CaseType["CONSTITUTIONAL"] = "constitutional";
    CaseType["FAMILY"] = "family";
    CaseType["BANKRUPTCY"] = "bankruptcy";
    CaseType["TAX"] = "tax";
    CaseType["IMMIGRATION"] = "immigration";
    CaseType["LABOR"] = "labor";
    CaseType["INTELLECTUAL_PROPERTY"] = "intellectual_property";
    CaseType["ENVIRONMENTAL"] = "environmental";
    CaseType["HEALTHCARE"] = "healthcare";
    CaseType["OTHER"] = "other";
})(CaseType || (exports.CaseType = CaseType = {}));
/**
 * Status of a legal case.
 */
var CaseStatus;
(function (CaseStatus) {
    CaseStatus["PENDING"] = "pending";
    CaseStatus["ACTIVE"] = "active";
    CaseStatus["DECIDED"] = "decided";
    CaseStatus["APPEALED"] = "appealed";
    CaseStatus["DISMISSED"] = "dismissed";
    CaseStatus["SETTLED"] = "settled";
    CaseStatus["WITHDRAWN"] = "withdrawn";
})(CaseStatus || (exports.CaseStatus = CaseStatus = {}));
/**
 * Precedential value of a case.
 */
var PrecedentialValue;
(function (PrecedentialValue) {
    PrecedentialValue["BINDING"] = "binding";
    PrecedentialValue["PERSUASIVE"] = "persuasive";
    PrecedentialValue["INFORMATIVE"] = "informative";
    PrecedentialValue["UNPUBLISHED"] = "unpublished";
    PrecedentialValue["SUPERSEDED"] = "superseded";
})(PrecedentialValue || (exports.PrecedentialValue = PrecedentialValue = {}));
/**
 * Supported citation formats.
 */
var CitationFormat;
(function (CitationFormat) {
    CitationFormat["BLUEBOOK"] = "bluebook";
    CitationFormat["APA"] = "apa";
    CitationFormat["MLA"] = "mla";
    CitationFormat["CHICAGO"] = "chicago";
    CitationFormat["OSCOLA"] = "oscola";
    CitationFormat["AGLC"] = "aglc";
    CitationFormat["NEUTRAL"] = "neutral";
})(CitationFormat || (exports.CitationFormat = CitationFormat = {}));
/**
 * Court hierarchy levels.
 */
var CourtLevel;
(function (CourtLevel) {
    CourtLevel["SUPREME"] = "supreme";
    CourtLevel["APPELLATE"] = "appellate";
    CourtLevel["TRIAL"] = "trial";
    CourtLevel["DISTRICT"] = "district";
    CourtLevel["MUNICIPAL"] = "municipal";
    CourtLevel["SPECIALIZED"] = "specialized";
})(CourtLevel || (exports.CourtLevel = CourtLevel = {}));
/**
 * Types of citation relationships.
 */
var CitationType;
(function (CitationType) {
    CitationType["FOLLOWED"] = "followed";
    CitationType["DISTINGUISHED"] = "distinguished";
    CitationType["OVERRULED"] = "overruled";
    CitationType["QUESTIONED"] = "questioned";
    CitationType["CITED_WITH_APPROVAL"] = "cited_with_approval";
    CitationType["CITED_NEUTRALLY"] = "cited_neutrally";
})(CitationType || (exports.CitationType = CitationType = {}));
/**
 * Defines Sequelize model for legal cases.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} Legal case model
 *
 * @example
 * ```typescript
 * const LegalCaseModel = defineLegalCaseModel(sequelize);
 * const newCase = await LegalCaseModel.create({
 *   caseNumber: '2024-CV-1234',
 *   caseName: 'Smith v. Jones',
 *   // ... other fields
 * });
 * ```
 */
const defineLegalCaseModel = (sequelize) => {
    class LegalCaseModel extends sequelize_1.Model {
    }
    LegalCaseModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        caseNumber: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
            },
        },
        caseName: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        partyNames: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: { plaintiff: [], defendant: [] },
        },
        courtId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'courts',
                key: 'id',
            },
        },
        courtName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
        },
        jurisdiction: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        decisionDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        filingDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        judgeNames: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            defaultValue: [],
        },
        caseType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(CaseType)),
            allowNull: false,
        },
        caseStatus: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(CaseStatus)),
            allowNull: false,
            defaultValue: CaseStatus.PENDING,
        },
        summary: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        fullTextUrl: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
            validate: {
                isUrl: true,
            },
        },
        pdfUrl: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
            validate: {
                isUrl: true,
            },
        },
        keyPoints: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            defaultValue: [],
        },
        legalIssues: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            defaultValue: [],
        },
        holdings: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
            defaultValue: [],
        },
        precedentialValue: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(PrecedentialValue)),
            allowNull: false,
            defaultValue: PrecedentialValue.INFORMATIVE,
        },
        citedCases: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.UUID),
            defaultValue: [],
        },
        citingCases: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.UUID),
            defaultValue: [],
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            defaultValue: {},
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'legal_cases',
        timestamps: true,
        indexes: [
            { fields: ['caseNumber'] },
            { fields: ['courtId'] },
            { fields: ['jurisdiction'] },
            { fields: ['decisionDate'] },
            { fields: ['caseType'] },
            { fields: ['caseStatus'] },
            { fields: ['precedentialValue'] },
            { using: 'gin', fields: ['partyNames'] },
            { using: 'gin', fields: ['citedCases'] },
            { using: 'gin', fields: ['metadata'] },
        ],
    });
    return LegalCaseModel;
};
exports.defineLegalCaseModel = defineLegalCaseModel;
/**
 * Defines Sequelize model for legal citations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} Citation model
 *
 * @example
 * ```typescript
 * const CitationModel = defineCitationModel(sequelize);
 * const citation = await CitationModel.create({
 *   caseId: 'case-uuid',
 *   citationString: '410 U.S. 113 (1973)',
 *   format: CitationFormat.BLUEBOOK,
 *   reporter: 'U.S.',
 *   page: '113',
 *   year: 1973
 * });
 * ```
 */
const defineCitationModel = (sequelize) => {
    class CitationModel extends sequelize_1.Model {
    }
    CitationModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        caseId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'legal_cases',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        citationString: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
        },
        format: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(CitationFormat)),
            allowNull: false,
        },
        volume: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
        reporter: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        page: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
        },
        year: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1700,
                max: 2100,
            },
        },
        court: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        parallelCitations: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            defaultValue: [],
        },
        isCanonical: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            defaultValue: {},
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'citations',
        timestamps: true,
        indexes: [
            { fields: ['caseId'] },
            { fields: ['format'] },
            { fields: ['year'] },
            { fields: ['reporter'] },
            { fields: ['isCanonical'] },
            { unique: true, fields: ['caseId', 'citationString'] },
        ],
    });
    return CitationModel;
};
exports.defineCitationModel = defineCitationModel;
/**
 * Defines Sequelize model for courts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} Court model
 *
 * @example
 * ```typescript
 * const CourtModel = defineCourtModel(sequelize);
 * const court = await CourtModel.create({
 *   name: 'Supreme Court of the United States',
 *   shortName: 'SCOTUS',
 *   level: CourtLevel.SUPREME,
 *   jurisdiction: 'federal',
 *   isActive: true
 * });
 * ```
 */
const defineCourtModel = (sequelize) => {
    class CourtModel extends sequelize_1.Model {
    }
    CourtModel.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(300),
            allowNull: false,
            unique: true,
        },
        shortName: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        level: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(CourtLevel)),
            allowNull: false,
        },
        jurisdiction: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        parentCourtId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'courts',
                key: 'id',
            },
        },
        childCourtIds: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.UUID),
            defaultValue: [],
        },
        bindingJurisdictions: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            defaultValue: [],
        },
        persuasiveJurisdictions: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            defaultValue: [],
        },
        establishedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            defaultValue: {},
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'courts',
        timestamps: true,
        indexes: [
            { fields: ['jurisdiction'] },
            { fields: ['level'] },
            { fields: ['isActive'] },
            { fields: ['parentCourtId'] },
            { using: 'gin', fields: ['childCourtIds'] },
        ],
    });
    return CourtModel;
};
exports.defineCourtModel = defineCourtModel;
// ============================================================================
// CITATION PARSING AND VALIDATION
// ============================================================================
/**
 * Parses a Bluebook format citation into components.
 *
 * @param {string} citation - Bluebook citation string
 * @returns {ParsedCitation | null} Parsed citation or null if invalid
 *
 * @example
 * ```typescript
 * const parsed = parseBluebookCitation('410 U.S. 113, 120 (1973)');
 * // Result: { volume: '410', reporter: 'U.S.', page: '113', pinpoint: '120', year: 1973 }
 * ```
 */
const parseBluebookCitation = (citation) => {
    // Regex for Bluebook format: Volume Reporter Page, Pinpoint (Year)
    const regex = /^(\d+)\s+([A-Z][A-Za-z.\s]+?)\s+(\d+)(?:,\s*(\d+))?\s*\((\d{4})\)$/;
    const match = citation.trim().match(regex);
    if (!match) {
        return null;
    }
    return {
        volume: match[1],
        reporter: match[2].trim(),
        page: match[3],
        pinpoint: match[4] || undefined,
        year: parseInt(match[5], 10),
    };
};
exports.parseBluebookCitation = parseBluebookCitation;
/**
 * Parses an APA format legal citation.
 *
 * @param {string} citation - APA citation string
 * @returns {ParsedCitation | null} Parsed citation or null if invalid
 *
 * @example
 * ```typescript
 * const parsed = parseAPACitation('Roe v. Wade, 410 U.S. 113 (1973)');
 * // Result: { partyNames: 'Roe v. Wade', volume: '410', reporter: 'U.S.', page: '113', year: 1973 }
 * ```
 */
const parseAPACitation = (citation) => {
    // Regex for APA format: Party Names, Volume Reporter Page (Year)
    const regex = /^(.+?),\s*(\d+)\s+([A-Z][A-Za-z.\s]+?)\s+(\d+)\s*\((\d{4})\)$/;
    const match = citation.trim().match(regex);
    if (!match) {
        return null;
    }
    return {
        partyNames: match[1].trim(),
        volume: match[2],
        reporter: match[3].trim(),
        page: match[4],
        year: parseInt(match[5], 10),
    };
};
exports.parseAPACitation = parseAPACitation;
/**
 * Validates a legal citation against a specific format.
 *
 * @param {string} citation - Citation string to validate
 * @param {CitationFormat} format - Expected citation format
 * @returns {CitationValidationResult} Validation result with errors and suggestions
 *
 * @example
 * ```typescript
 * const result = validateCitation('410 U.S. 113 (1973)', CitationFormat.BLUEBOOK);
 * if (result.isValid) {
 *   console.log('Valid citation:', result.parsedComponents);
 * }
 * ```
 */
const validateCitation = (citation, format) => {
    const errors = [];
    let parsedComponents = null;
    if (!citation || citation.trim().length === 0) {
        errors.push({
            field: 'citation',
            message: 'Citation cannot be empty',
            severity: 'error',
        });
        return {
            isValid: false,
            format,
            parsedComponents: {},
            errors,
        };
    }
    switch (format) {
        case CitationFormat.BLUEBOOK:
            parsedComponents = (0, exports.parseBluebookCitation)(citation);
            break;
        case CitationFormat.APA:
            parsedComponents = (0, exports.parseAPACitation)(citation);
            break;
        default:
            errors.push({
                field: 'format',
                message: `Citation format ${format} not yet implemented`,
                severity: 'error',
            });
    }
    if (!parsedComponents) {
        errors.push({
            field: 'citation',
            message: `Invalid ${format} citation format`,
            severity: 'error',
        });
    }
    return {
        isValid: errors.length === 0 && parsedComponents !== null,
        format,
        parsedComponents: parsedComponents || {},
        errors,
        suggestions: errors.length > 0 ? (0, exports.generateCitationSuggestions)(citation, format) : undefined,
    };
};
exports.validateCitation = validateCitation;
/**
 * Generates citation format suggestions based on input.
 *
 * @param {string} citation - Original citation string
 * @param {CitationFormat} format - Target citation format
 * @returns {string[]} Array of suggested corrections
 *
 * @example
 * ```typescript
 * const suggestions = generateCitationSuggestions('410US113', CitationFormat.BLUEBOOK);
 * // Result: ['410 U.S. 113 (Year needed)', 'Add spacing between components']
 * ```
 */
const generateCitationSuggestions = (citation, format) => {
    const suggestions = [];
    if (format === CitationFormat.BLUEBOOK) {
        if (!/\d+\s+[A-Z]/.test(citation)) {
            suggestions.push('Add space between volume and reporter (e.g., "410 U.S.")');
        }
        if (!/\(\d{4}\)/.test(citation)) {
            suggestions.push('Include year in parentheses at the end (e.g., "(1973)")');
        }
        if (!/\d+$|\d+\)$/.test(citation.replace(/\s*\(\d{4}\)$/, ''))) {
            suggestions.push('Ensure page number is included');
        }
    }
    if (format === CitationFormat.APA) {
        if (!/^[^,]+,/.test(citation)) {
            suggestions.push('Start with party names followed by comma (e.g., "Roe v. Wade,")');
        }
    }
    return suggestions;
};
exports.generateCitationSuggestions = generateCitationSuggestions;
/**
 * Normalizes a citation to a standard format.
 *
 * @param {string} citation - Citation to normalize
 * @param {CitationFormat} targetFormat - Target format
 * @returns {string} Normalized citation string
 *
 * @example
 * ```typescript
 * const normalized = normalizeCitation('410US113(1973)', CitationFormat.BLUEBOOK);
 * // Result: '410 U.S. 113 (1973)'
 * ```
 */
const normalizeCitation = (citation, targetFormat) => {
    const cleaned = citation.trim().replace(/\s+/g, ' ');
    // Basic normalization for Bluebook
    if (targetFormat === CitationFormat.BLUEBOOK) {
        return cleaned
            .replace(/(\d+)([A-Z])/g, '$1 $2') // Add space after volume number
            .replace(/([A-Z]\.?)(\d)/g, '$1 $2') // Add space after reporter
            .replace(/,\s*(\d+)\s*\(/g, ', $1 (') // Normalize pinpoint spacing
            .replace(/\(\s*(\d{4})\s*\)/, '($1)'); // Normalize year
    }
    return cleaned;
};
exports.normalizeCitation = normalizeCitation;
/**
 * Extracts all citations from a legal document text.
 *
 * @param {string} text - Document text to analyze
 * @param {CitationFormat[]} [formats] - Citation formats to detect
 * @returns {ParsedCitation[]} Array of parsed citations
 *
 * @example
 * ```typescript
 * const text = "As held in 410 U.S. 113 (1973), the court found...";
 * const citations = extractCitationsFromText(text, [CitationFormat.BLUEBOOK]);
 * ```
 */
const extractCitationsFromText = (text, formats = [CitationFormat.BLUEBOOK]) => {
    const citations = [];
    // Bluebook pattern
    const bluebookPattern = /\d+\s+[A-Z][A-Za-z.\s]+?\s+\d+(?:,\s*\d+)?\s*\(\d{4}\)/g;
    if (formats.includes(CitationFormat.BLUEBOOK)) {
        const matches = text.match(bluebookPattern);
        if (matches) {
            matches.forEach((match) => {
                const parsed = (0, exports.parseBluebookCitation)(match);
                if (parsed) {
                    citations.push(parsed);
                }
            });
        }
    }
    return citations;
};
exports.extractCitationsFromText = extractCitationsFromText;
/**
 * Formats a parsed citation into a specific citation style.
 *
 * @param {ParsedCitation} parsed - Parsed citation components
 * @param {CitationFormat} format - Target citation format
 * @returns {string} Formatted citation string
 *
 * @example
 * ```typescript
 * const citation = formatCitation({
 *   volume: '410', reporter: 'U.S.', page: '113', year: 1973
 * }, CitationFormat.BLUEBOOK);
 * // Result: '410 U.S. 113 (1973)'
 * ```
 */
const formatCitation = (parsed, format) => {
    switch (format) {
        case CitationFormat.BLUEBOOK:
            let bluebook = `${parsed.volume || ''} ${parsed.reporter} ${parsed.page}`;
            if (parsed.pinpoint) {
                bluebook += `, ${parsed.pinpoint}`;
            }
            if (parsed.year) {
                bluebook += ` (${parsed.year})`;
            }
            return bluebook.trim();
        case CitationFormat.APA:
            let apa = '';
            if (parsed.partyNames) {
                apa = `${parsed.partyNames}, `;
            }
            apa += `${parsed.volume || ''} ${parsed.reporter} ${parsed.page}`;
            if (parsed.year) {
                apa += ` (${parsed.year})`;
            }
            return apa.trim();
        default:
            return `${parsed.volume || ''} ${parsed.reporter} ${parsed.page} (${parsed.year || ''})`.trim();
    }
};
exports.formatCitation = formatCitation;
// ============================================================================
// CASE SIMILARITY AND RELEVANCE ANALYSIS
// ============================================================================
/**
 * Calculates similarity score between two legal cases.
 *
 * @param {LegalCase} case1 - First case
 * @param {LegalCase} case2 - Second case
 * @returns {number} Similarity score between 0 and 1
 *
 * @example
 * ```typescript
 * const similarity = calculateCaseSimilarity(caseA, caseB);
 * if (similarity > 0.7) {
 *   console.log('Highly similar cases');
 * }
 * ```
 */
const calculateCaseSimilarity = (case1, case2) => {
    let score = 0;
    let weights = 0;
    // Citation overlap (weight: 0.3)
    if (case1.citedCases && case2.citedCases) {
        const intersection = case1.citedCases.filter((id) => case2.citedCases?.includes(id));
        const union = new Set([...case1.citedCases, ...case2.citedCases]);
        const citationSimilarity = union.size > 0 ? intersection.length / union.size : 0;
        score += citationSimilarity * 0.3;
        weights += 0.3;
    }
    // Legal issues overlap (weight: 0.25)
    if (case1.legalIssues && case2.legalIssues) {
        const issueIntersection = case1.legalIssues.filter((issue) => case2.legalIssues?.some((issue2) => issue.toLowerCase().includes(issue2.toLowerCase())));
        const issueSimilarity = case1.legalIssues.length + case2.legalIssues.length > 0
            ? (2 * issueIntersection.length) / (case1.legalIssues.length + case2.legalIssues.length)
            : 0;
        score += issueSimilarity * 0.25;
        weights += 0.25;
    }
    // Same court type (weight: 0.15)
    if (case1.courtId === case2.courtId) {
        score += 0.15;
    }
    weights += 0.15;
    // Same case type (weight: 0.15)
    if (case1.caseType === case2.caseType) {
        score += 0.15;
    }
    weights += 0.15;
    // Temporal proximity (weight: 0.15)
    const yearDiff = Math.abs(case1.decisionDate.getFullYear() - case2.decisionDate.getFullYear());
    const temporalScore = Math.max(0, 1 - yearDiff / 50); // Decreases over 50 years
    score += temporalScore * 0.15;
    weights += 0.15;
    return weights > 0 ? score / weights : 0;
};
exports.calculateCaseSimilarity = calculateCaseSimilarity;
/**
 * Finds similar cases based on various criteria.
 *
 * @param {LegalCase} targetCase - Case to find similarities for
 * @param {LegalCase[]} candidateCases - Pool of cases to compare against
 * @param {number} [threshold=0.5] - Minimum similarity threshold
 * @param {number} [limit=10] - Maximum number of results
 * @returns {SimilarCase[]} Array of similar cases sorted by similarity
 *
 * @example
 * ```typescript
 * const similar = findSimilarCases(myCase, allCases, 0.6, 5);
 * similar.forEach(sc => console.log(`${sc.caseName}: ${sc.similarity}`));
 * ```
 */
const findSimilarCases = (targetCase, candidateCases, threshold = 0.5, limit = 10) => {
    const similarCases = [];
    for (const candidate of candidateCases) {
        if (candidate.id === targetCase.id)
            continue;
        const similarity = (0, exports.calculateCaseSimilarity)(targetCase, candidate);
        if (similarity >= threshold) {
            const sharedCitations = targetCase.citedCases?.filter((id) => candidate.citedCases?.includes(id)).length || 0;
            const sharedIssues = targetCase.legalIssues?.filter((issue) => candidate.legalIssues?.some((ci) => ci.toLowerCase().includes(issue.toLowerCase()))) || [];
            similarCases.push({
                caseId: candidate.id,
                caseName: candidate.caseName,
                similarity,
                sharedCitations,
                sharedIssues,
                sharedKeywords: [], // Could be enhanced with keyword extraction
                temporalRelevance: (0, exports.calculateTemporalRelevance)(targetCase.decisionDate, candidate.decisionDate),
                jurisdictionalAlignment: targetCase.jurisdiction === candidate.jurisdiction ? 1 : 0.5,
            });
        }
    }
    return similarCases
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);
};
exports.findSimilarCases = findSimilarCases;
/**
 * Calculates temporal relevance between two dates.
 *
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {number} Relevance score between 0 and 1
 *
 * @example
 * ```typescript
 * const relevance = calculateTemporalRelevance(new Date('2020-01-01'), new Date('2021-01-01'));
 * // Result: ~0.98 (recent cases score higher)
 * ```
 */
const calculateTemporalRelevance = (date1, date2) => {
    const yearDiff = Math.abs(date1.getFullYear() - date2.getFullYear());
    return Math.max(0, 1 - yearDiff / 100);
};
exports.calculateTemporalRelevance = calculateTemporalRelevance;
/**
 * Scores case relevance for a specific legal query.
 *
 * @param {LegalCase} legalCase - Case to score
 * @param {CaseLawSearchQuery} query - Search query criteria
 * @returns {number} Relevance score between 0 and 1
 *
 * @example
 * ```typescript
 * const score = scoreCaseRelevance(myCase, {
 *   keywords: ['negligence', 'medical'],
 *   jurisdictions: ['federal'],
 *   caseTypes: [CaseType.CIVIL]
 * });
 * ```
 */
const scoreCaseRelevance = (legalCase, query) => {
    let score = 0;
    let maxScore = 0;
    // Keyword matching
    if (query.keywords && query.keywords.length > 0) {
        const caseText = [
            legalCase.caseName,
            legalCase.summary || '',
            ...(legalCase.legalIssues || []),
            ...(legalCase.keyPoints || []),
        ].join(' ').toLowerCase();
        const matchedKeywords = query.keywords.filter((keyword) => caseText.includes(keyword.toLowerCase()));
        score += (matchedKeywords.length / query.keywords.length) * 0.4;
        maxScore += 0.4;
    }
    // Jurisdiction match
    if (query.jurisdictions && query.jurisdictions.length > 0) {
        if (query.jurisdictions.includes(legalCase.jurisdiction)) {
            score += 0.2;
        }
        maxScore += 0.2;
    }
    // Case type match
    if (query.caseTypes && query.caseTypes.length > 0) {
        if (query.caseTypes.includes(legalCase.caseType)) {
            score += 0.2;
        }
        maxScore += 0.2;
    }
    // Date range relevance
    if (query.dateFrom || query.dateTo) {
        const decisionTime = legalCase.decisionDate.getTime();
        const fromTime = query.dateFrom?.getTime() || 0;
        const toTime = query.dateTo?.getTime() || Date.now();
        if (decisionTime >= fromTime && decisionTime <= toTime) {
            score += 0.2;
        }
        maxScore += 0.2;
    }
    return maxScore > 0 ? score / maxScore : 0;
};
exports.scoreCaseRelevance = scoreCaseRelevance;
// ============================================================================
// COURT HIERARCHY AND JURISDICTION
// ============================================================================
/**
 * Determines if a court has binding precedent over another court.
 *
 * @param {Court} superiorCourt - Potentially superior court
 * @param {Court} inferiorCourt - Potentially inferior court
 * @returns {boolean} True if superior court binds inferior court
 *
 * @example
 * ```typescript
 * const isBinding = isBindingPrecedent(supremeCourt, districtCourt);
 * if (isBinding) {
 *   console.log('Supreme court decisions bind district court');
 * }
 * ```
 */
const isBindingPrecedent = (superiorCourt, inferiorCourt) => {
    // Same court binds itself
    if (superiorCourt.id === inferiorCourt.id) {
        return true;
    }
    // Check if inferior court is in superior court's binding jurisdictions
    if (superiorCourt.bindingJurisdictions?.includes(inferiorCourt.jurisdiction)) {
        return true;
    }
    // Check direct hierarchy
    if (inferiorCourt.parentCourtId === superiorCourt.id) {
        return true;
    }
    // Check if inferior court is in child hierarchy
    if (superiorCourt.childCourtIds?.includes(inferiorCourt.id)) {
        return true;
    }
    return false;
};
exports.isBindingPrecedent = isBindingPrecedent;
/**
 * Gets the court hierarchy path from a court to the supreme court.
 *
 * @param {Court} court - Starting court
 * @param {Map<string, Court>} courtMap - Map of all courts by ID
 * @returns {Court[]} Array of courts from given court to supreme court
 *
 * @example
 * ```typescript
 * const hierarchy = getCourtHierarchy(districtCourt, allCourtsMap);
 * hierarchy.forEach(c => console.log(c.name));
 * // Output: District Court -> Appellate Court -> Supreme Court
 * ```
 */
const getCourtHierarchy = (court, courtMap) => {
    const hierarchy = [court];
    let currentCourt = court;
    while (currentCourt.parentCourtId) {
        const parentCourt = courtMap.get(currentCourt.parentCourtId);
        if (!parentCourt)
            break;
        hierarchy.push(parentCourt);
        currentCourt = parentCourt;
        // Prevent infinite loops
        if (hierarchy.length > 10)
            break;
    }
    return hierarchy;
};
exports.getCourtHierarchy = getCourtHierarchy;
/**
 * Determines precedential weight of a case in a jurisdiction.
 *
 * @param {LegalCase} legalCase - Case to evaluate
 * @param {Court} targetCourt - Court where case will be cited
 * @param {Map<string, Court>} courtMap - Map of all courts
 * @returns {number} Precedential weight score (0-1)
 *
 * @example
 * ```typescript
 * const weight = determinePrecedentialWeight(case, targetCourt, courtsMap);
 * if (weight > 0.8) {
 *   console.log('This case has strong binding precedent');
 * }
 * ```
 */
const determinePrecedentialWeight = (legalCase, targetCourt, courtMap) => {
    const caseCourt = courtMap.get(legalCase.courtId);
    if (!caseCourt)
        return 0;
    // Maximum weight for binding precedent
    if (legalCase.precedentialValue === PrecedentialValue.BINDING) {
        if ((0, exports.isBindingPrecedent)(caseCourt, targetCourt)) {
            return 1.0;
        }
    }
    // High weight for same court
    if (caseCourt.id === targetCourt.id) {
        return 0.9;
    }
    // Medium-high weight for persuasive precedent in same jurisdiction
    if (legalCase.precedentialValue === PrecedentialValue.PERSUASIVE) {
        if (caseCourt.jurisdiction === targetCourt.jurisdiction) {
            return 0.7;
        }
        if (targetCourt.persuasiveJurisdictions?.includes(caseCourt.jurisdiction)) {
            return 0.6;
        }
    }
    // Medium weight for informative cases
    if (legalCase.precedentialValue === PrecedentialValue.INFORMATIVE) {
        return 0.4;
    }
    // Low weight for unpublished opinions
    if (legalCase.precedentialValue === PrecedentialValue.UNPUBLISHED) {
        return 0.2;
    }
    // No weight for superseded cases
    if (legalCase.precedentialValue === PrecedentialValue.SUPERSEDED) {
        return 0.0;
    }
    return 0.3; // Default weight
};
exports.determinePrecedentialWeight = determinePrecedentialWeight;
/**
 * Finds all courts within a jurisdiction.
 *
 * @param {string} jurisdiction - Jurisdiction identifier
 * @param {Court[]} courts - Array of all courts
 * @returns {Court[]} Courts in the jurisdiction
 *
 * @example
 * ```typescript
 * const federalCourts = getCourtsInJurisdiction('federal', allCourts);
 * ```
 */
const getCourtsInJurisdiction = (jurisdiction, courts) => {
    return courts.filter((court) => court.jurisdiction === jurisdiction && court.isActive);
};
exports.getCourtsInJurisdiction = getCourtsInJurisdiction;
/**
 * Gets all subordinate courts in a hierarchy.
 *
 * @param {Court} court - Superior court
 * @param {Map<string, Court>} courtMap - Map of all courts
 * @returns {Court[]} All subordinate courts
 *
 * @example
 * ```typescript
 * const subordinates = getSubordinateCourts(appealsCourt, courtsMap);
 * ```
 */
const getSubordinateCourts = (court, courtMap) => {
    const subordinates = [];
    if (!court.childCourtIds)
        return subordinates;
    for (const childId of court.childCourtIds) {
        const childCourt = courtMap.get(childId);
        if (childCourt) {
            subordinates.push(childCourt);
            // Recursively get children of children
            subordinates.push(...(0, exports.getSubordinateCourts)(childCourt, courtMap));
        }
    }
    return subordinates;
};
exports.getSubordinateCourts = getSubordinateCourts;
// ============================================================================
// CITATION NETWORK ANALYSIS
// ============================================================================
/**
 * Builds a citation network graph from a set of cases.
 *
 * @param {LegalCase[]} cases - Cases to include in network
 * @returns {CitationNetwork} Citation network graph
 *
 * @example
 * ```typescript
 * const network = buildCitationNetwork(relevantCases);
 * console.log(`Network has ${network.metrics.totalNodes} nodes`);
 * ```
 */
const buildCitationNetwork = (cases) => {
    const nodes = [];
    const edges = [];
    const caseMap = new Map();
    // Create nodes
    cases.forEach((c) => {
        caseMap.set(c.id, c);
        nodes.push({
            id: c.id,
            caseId: c.id,
            caseName: c.caseName,
            year: c.decisionDate.getFullYear(),
            importance: 0,
            inDegree: 0,
            outDegree: 0,
        });
    });
    // Create edges
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    cases.forEach((c) => {
        const sourceNode = nodeMap.get(c.id);
        if (!sourceNode || !c.citedCases)
            return;
        c.citedCases.forEach((citedId) => {
            const targetNode = nodeMap.get(citedId);
            if (!targetNode)
                return;
            edges.push({
                sourceId: c.id,
                targetId: citedId,
                weight: 1,
                citationType: CitationType.CITED_NEUTRALLY,
            });
            sourceNode.outDegree++;
            targetNode.inDegree++;
        });
    });
    // Calculate importance scores (based on in-degree)
    const maxInDegree = Math.max(...nodes.map((n) => n.inDegree), 1);
    nodes.forEach((node) => {
        node.importance = node.inDegree / maxInDegree;
    });
    // Calculate metrics
    const metrics = (0, exports.calculateNetworkMetrics)(nodes, edges);
    return { nodes, edges, metrics };
};
exports.buildCitationNetwork = buildCitationNetwork;
/**
 * Calculates network metrics for a citation graph.
 *
 * @param {CitationNode[]} nodes - Graph nodes
 * @param {CitationEdge[]} edges - Graph edges
 * @returns {NetworkMetrics} Calculated network metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateNetworkMetrics(nodes, edges);
 * console.log(`Network density: ${metrics.density}`);
 * ```
 */
const calculateNetworkMetrics = (nodes, edges) => {
    const totalNodes = nodes.length;
    const totalEdges = edges.length;
    const maxPossibleEdges = totalNodes * (totalNodes - 1);
    const density = maxPossibleEdges > 0 ? totalEdges / maxPossibleEdges : 0;
    const averageDegree = totalNodes > 0 ? (2 * totalEdges) / totalNodes : 0;
    // Find central nodes (top 10% by in-degree)
    const sortedByInDegree = [...nodes].sort((a, b) => b.inDegree - a.inDegree);
    const centralCount = Math.max(1, Math.floor(totalNodes * 0.1));
    const centralNodes = sortedByInDegree.slice(0, centralCount).map((n) => n.id);
    return {
        totalNodes,
        totalEdges,
        density,
        averageDegree,
        centralNodes,
    };
};
exports.calculateNetworkMetrics = calculateNetworkMetrics;
/**
 * Calculates PageRank scores for cases in citation network.
 *
 * @param {CitationNetwork} network - Citation network
 * @param {number} [dampingFactor=0.85] - PageRank damping factor
 * @param {number} [maxIterations=100] - Maximum iterations
 * @returns {Map<string, number>} PageRank scores by case ID
 *
 * @example
 * ```typescript
 * const pageRanks = calculatePageRank(network);
 * const topCase = Array.from(pageRanks.entries())
 *   .sort((a, b) => b[1] - a[1])[0];
 * console.log(`Most important case: ${topCase[0]}`);
 * ```
 */
const calculatePageRank = (network, dampingFactor = 0.85, maxIterations = 100) => {
    const { nodes, edges } = network;
    const pageRanks = new Map();
    const newPageRanks = new Map();
    // Initialize PageRank scores
    const initialScore = 1 / nodes.length;
    nodes.forEach((node) => {
        pageRanks.set(node.id, initialScore);
    });
    // Build adjacency information
    const outLinks = new Map();
    edges.forEach((edge) => {
        if (!outLinks.has(edge.sourceId)) {
            outLinks.set(edge.sourceId, []);
        }
        outLinks.get(edge.sourceId).push(edge.targetId);
    });
    // Iterative PageRank calculation
    for (let iter = 0; iter < maxIterations; iter++) {
        nodes.forEach((node) => {
            let sum = 0;
            // Sum contributions from incoming links
            edges.forEach((edge) => {
                if (edge.targetId === node.id) {
                    const sourceOutDegree = outLinks.get(edge.sourceId)?.length || 1;
                    sum += (pageRanks.get(edge.sourceId) || 0) / sourceOutDegree;
                }
            });
            const newScore = (1 - dampingFactor) / nodes.length + dampingFactor * sum;
            newPageRanks.set(node.id, newScore);
        });
        // Update scores
        newPageRanks.forEach((score, id) => {
            pageRanks.set(id, score);
        });
    }
    return pageRanks;
};
exports.calculatePageRank = calculatePageRank;
/**
 * Identifies citation clusters in the network.
 *
 * @param {CitationNetwork} network - Citation network
 * @param {number} [minClusterSize=3] - Minimum cluster size
 * @returns {string[][]} Array of clusters (case ID arrays)
 *
 * @example
 * ```typescript
 * const clusters = identifyCitationClusters(network, 5);
 * console.log(`Found ${clusters.length} citation clusters`);
 * ```
 */
const identifyCitationClusters = (network, minClusterSize = 3) => {
    const { nodes, edges } = network;
    const clusters = [];
    const visited = new Set();
    // Build adjacency list (undirected)
    const adjacency = new Map();
    nodes.forEach((node) => adjacency.set(node.id, new Set()));
    edges.forEach((edge) => {
        adjacency.get(edge.sourceId)?.add(edge.targetId);
        adjacency.get(edge.targetId)?.add(edge.sourceId);
    });
    // DFS to find connected components
    const dfs = (nodeId, cluster) => {
        if (visited.has(nodeId))
            return;
        visited.add(nodeId);
        cluster.push(nodeId);
        const neighbors = adjacency.get(nodeId);
        if (neighbors) {
            neighbors.forEach((neighborId) => {
                if (!visited.has(neighborId)) {
                    dfs(neighborId, cluster);
                }
            });
        }
    };
    // Find all clusters
    nodes.forEach((node) => {
        if (!visited.has(node.id)) {
            const cluster = [];
            dfs(node.id, cluster);
            if (cluster.length >= minClusterSize) {
                clusters.push(cluster);
            }
        }
    });
    return clusters;
};
exports.identifyCitationClusters = identifyCitationClusters;
/**
 * Finds the shortest citation path between two cases.
 *
 * @param {string} sourceCaseId - Starting case ID
 * @param {string} targetCaseId - Target case ID
 * @param {CitationNetwork} network - Citation network
 * @returns {string[] | null} Array of case IDs representing path, or null if no path
 *
 * @example
 * ```typescript
 * const path = findCitationPath(caseA.id, caseB.id, network);
 * if (path) {
 *   console.log(`Citation path: ${path.join(' -> ')}`);
 * }
 * ```
 */
const findCitationPath = (sourceCaseId, targetCaseId, network) => {
    const { edges } = network;
    // Build adjacency list
    const adjacency = new Map();
    edges.forEach((edge) => {
        if (!adjacency.has(edge.sourceId)) {
            adjacency.set(edge.sourceId, []);
        }
        adjacency.get(edge.sourceId).push(edge.targetId);
    });
    // BFS to find shortest path
    const queue = [{ nodeId: sourceCaseId, path: [sourceCaseId] }];
    const visited = new Set([sourceCaseId]);
    while (queue.length > 0) {
        const { nodeId, path } = queue.shift();
        if (nodeId === targetCaseId) {
            return path;
        }
        const neighbors = adjacency.get(nodeId) || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push({ nodeId: neighbor, path: [...path, neighbor] });
            }
        }
    }
    return null; // No path found
};
exports.findCitationPath = findCitationPath;
// ============================================================================
// SWAGGER API DOCUMENTATION HELPERS
// ============================================================================
/**
 * Creates Swagger schema for legal case response.
 *
 * @returns {Record<string, any>} OpenAPI schema object
 *
 * @example
 * ```typescript
 * const schema = createLegalCaseSwaggerSchema();
 * // Use in @ApiResponse decorator
 * ```
 */
const createLegalCaseSwaggerSchema = () => {
    return {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid', description: 'Unique case identifier' },
            caseNumber: { type: 'string', description: 'Official case number' },
            caseName: { type: 'string', description: 'Full case name' },
            partyNames: {
                type: 'object',
                properties: {
                    plaintiff: { type: 'array', items: { type: 'string' } },
                    defendant: { type: 'array', items: { type: 'string' } },
                },
            },
            courtId: { type: 'string', format: 'uuid' },
            courtName: { type: 'string' },
            jurisdiction: { type: 'string' },
            decisionDate: { type: 'string', format: 'date-time' },
            caseType: { type: 'string', enum: Object.values(CaseType) },
            caseStatus: { type: 'string', enum: Object.values(CaseStatus) },
            precedentialValue: { type: 'string', enum: Object.values(PrecedentialValue) },
            summary: { type: 'string', nullable: true },
            legalIssues: { type: 'array', items: { type: 'string' } },
            holdings: { type: 'array', items: { type: 'string' } },
        },
    };
};
exports.createLegalCaseSwaggerSchema = createLegalCaseSwaggerSchema;
/**
 * Creates Swagger schema for citation validation response.
 *
 * @returns {Record<string, any>} OpenAPI schema object
 *
 * @example
 * ```typescript
 * const schema = createCitationValidationSwaggerSchema();
 * ```
 */
const createCitationValidationSwaggerSchema = () => {
    return {
        type: 'object',
        properties: {
            isValid: { type: 'boolean', description: 'Whether citation is valid' },
            format: { type: 'string', enum: Object.values(CitationFormat) },
            parsedComponents: {
                type: 'object',
                properties: {
                    volume: { type: 'string', nullable: true },
                    reporter: { type: 'string' },
                    page: { type: 'string' },
                    year: { type: 'integer', nullable: true },
                    court: { type: 'string', nullable: true },
                },
            },
            errors: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        field: { type: 'string' },
                        message: { type: 'string' },
                        severity: { type: 'string', enum: ['error', 'warning', 'info'] },
                    },
                },
            },
            suggestions: {
                type: 'array',
                items: { type: 'string' },
                nullable: true,
            },
        },
    };
};
exports.createCitationValidationSwaggerSchema = createCitationValidationSwaggerSchema;
/**
 * Creates Swagger operation documentation for case search endpoint.
 *
 * @returns {Record<string, any>} OpenAPI operation object
 *
 * @example
 * ```typescript
 * const operation = createCaseSearchSwaggerOperation();
 * // Use with @ApiOperation decorator
 * ```
 */
const createCaseSearchSwaggerOperation = () => {
    return {
        summary: 'Search legal cases',
        description: 'Performs comprehensive search across legal cases with advanced filtering and relevance scoring',
        tags: ['Case Law Research'],
        parameters: [
            {
                name: 'query',
                in: 'query',
                description: 'Full-text search query',
                required: false,
                schema: { type: 'string' },
            },
            {
                name: 'jurisdiction',
                in: 'query',
                description: 'Filter by jurisdiction',
                required: false,
                schema: { type: 'string' },
            },
            {
                name: 'caseType',
                in: 'query',
                description: 'Filter by case type',
                required: false,
                schema: { type: 'string', enum: Object.values(CaseType) },
            },
            {
                name: 'dateFrom',
                in: 'query',
                description: 'Filter cases from this date',
                required: false,
                schema: { type: 'string', format: 'date' },
            },
            {
                name: 'dateTo',
                in: 'query',
                description: 'Filter cases to this date',
                required: false,
                schema: { type: 'string', format: 'date' },
            },
            {
                name: 'limit',
                in: 'query',
                description: 'Maximum results to return',
                required: false,
                schema: { type: 'integer', default: 20, minimum: 1, maximum: 100 },
            },
        ],
        responses: {
            '200': {
                description: 'Search results returned successfully',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                cases: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/LegalCase' },
                                },
                                total: { type: 'integer' },
                                page: { type: 'integer' },
                                pageSize: { type: 'integer' },
                            },
                        },
                    },
                },
            },
        },
    };
};
exports.createCaseSearchSwaggerOperation = createCaseSearchSwaggerOperation;
/**
 * Creates example legal case for Swagger documentation.
 *
 * @returns {Record<string, any>} Example case object
 *
 * @example
 * ```typescript
 * const example = createLegalCaseExample();
 * // Use in @ApiResponse examples
 * ```
 */
const createLegalCaseExample = () => {
    return {
        id: '550e8400-e29b-41d4-a716-446655440000',
        caseNumber: '410 U.S. 113',
        caseName: 'Roe v. Wade',
        partyNames: {
            plaintiff: ['Jane Roe'],
            defendant: ['Henry Wade'],
        },
        courtId: '660e8400-e29b-41d4-a716-446655440001',
        courtName: 'Supreme Court of the United States',
        jurisdiction: 'federal',
        decisionDate: '1973-01-22T00:00:00.000Z',
        filingDate: '1970-03-03T00:00:00.000Z',
        judgeNames: ['Harry Blackmun', 'Warren Burger'],
        caseType: CaseType.CONSTITUTIONAL,
        caseStatus: CaseStatus.DECIDED,
        summary: 'Landmark decision on reproductive rights and privacy.',
        precedentialValue: PrecedentialValue.BINDING,
        legalIssues: ['Right to privacy', 'Due process', 'Reproductive rights'],
        holdings: ['Right to privacy extends to abortion decision'],
        citedCases: [],
        citingCases: [],
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
    };
};
exports.createLegalCaseExample = createLegalCaseExample;
//# sourceMappingURL=case-law-research-kit.js.map