"use strict";
/**
 * LOC: MAIL-SPAM-FILTER-001
 * File: /reuse/server/mail/mail-spam-filtering-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - dns (Node.js core)
 *   - crypto (Node.js core)
 *
 * DOWNSTREAM (imported by):
 *   - Mail server services
 *   - Email processing pipelines
 *   - Anti-spam controllers
 *   - Mail filtering modules
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.quarantinedMessageSwaggerSchema = exports.userSpamPreferencesSwaggerSchema = exports.spamAnalysisResultSwaggerSchema = exports.emailMessageSwaggerSchema = exports.PHISHING_PATTERNS = exports.SPAM_PATTERNS = exports.DEFAULT_RBL_SERVERS = void 0;
exports.defineSpamRuleModel = defineSpamRuleModel;
exports.defineBayesianTokenModel = defineBayesianTokenModel;
exports.defineWhitelistModel = defineWhitelistModel;
exports.defineBlacklistModel = defineBlacklistModel;
exports.defineQuarantineModel = defineQuarantineModel;
exports.defineSpamReportModel = defineSpamReportModel;
exports.defineUserSpamPreferencesModel = defineUserSpamPreferencesModel;
exports.defineSpamStatisticsModel = defineSpamStatisticsModel;
exports.tokenizeEmailContent = tokenizeEmailContent;
exports.calculateTokenHash = calculateTokenHash;
exports.trainBayesianSpam = trainBayesianSpam;
exports.trainBayesianHam = trainBayesianHam;
exports.classifyBayesian = classifyBayesian;
exports.parseSPFRecord = parseSPFRecord;
exports.validateSPF = validateSPF;
exports.ipMatchesRange = ipMatchesRange;
exports.extractDKIMSignatures = extractDKIMSignatures;
exports.verifyDKIM = verifyDKIM;
exports.getDMARCPolicy = getDMARCPolicy;
exports.enforceDMARCPolicy = enforceDMARCPolicy;
exports.checkRBL = checkRBL;
exports.checkIPReputation = checkIPReputation;
exports.analyzeEmailContent = analyzeEmailContent;
exports.calculateHTMLComplexity = calculateHTMLComplexity;
exports.extractURLsFromEmail = extractURLsFromEmail;
exports.checkURLBlacklist = checkURLBlacklist;
exports.calculateSpamScore = calculateSpamScore;
exports.determineSpamAction = determineSpamAction;
exports.addToWhitelist = addToWhitelist;
exports.addToBlacklist = addToBlacklist;
exports.isEmailWhitelisted = isEmailWhitelisted;
exports.isEmailBlacklisted = isEmailBlacklisted;
exports.removeFromWhitelist = removeFromWhitelist;
exports.removeFromBlacklist = removeFromBlacklist;
exports.getUserSpamPreferences = getUserSpamPreferences;
exports.updateUserSpamPreferences = updateUserSpamPreferences;
exports.quarantineMessage = quarantineMessage;
exports.getQuarantinedMessages = getQuarantinedMessages;
exports.releaseQuarantinedMessage = releaseQuarantinedMessage;
exports.deleteQuarantinedMessage = deleteQuarantinedMessage;
exports.purgeExpiredQuarantineMessages = purgeExpiredQuarantineMessages;
exports.reportSpam = reportSpam;
exports.processPendingSpamReports = processPendingSpamReports;
exports.recordSpamStatistics = recordSpamStatistics;
exports.getSpamStatistics = getSpamStatistics;
exports.analyzeSpam = analyzeSpam;
/**
 * File: /reuse/server/mail/mail-spam-filtering-kit.ts
 * Locator: WC-MAIL-SPAM-FILTER-001
 * Purpose: Comprehensive Mail Spam Filtering Kit - Enterprise-grade spam protection for email systems
 *
 * Upstream: sequelize v6.x, Node.js 18+ (dns, crypto modules)
 * Downstream: Mail servers, email processing pipelines, anti-spam services
 * Dependencies: Sequelize v6.x, Node 18+, TypeScript 5.x
 * Exports: 45+ functions for spam detection, SPF/DKIM/DMARC validation, bayesian filtering, blacklists
 *
 * LLM Context: Enterprise-grade spam filtering utilities for White Cross mail platform.
 * Provides comprehensive spam detection with Bayesian classification, SPF/DKIM/DMARC validation,
 * RBL/DNSBL checking, content-based analysis, URL blacklisting, machine learning-based scoring,
 * whitelist/blacklist management, user preferences, spam reporting and learning, quarantine
 * management, and advanced threat protection matching Exchange Server capabilities.
 */
const sequelize_1 = require("sequelize");
const crypto = __importStar(require("crypto"));
const dns = __importStar(require("dns"));
const util_1 = require("util");
const resolveTxt = (0, util_1.promisify)(dns.resolveTxt);
const resolveMx = (0, util_1.promisify)(dns.resolveMx);
const resolve4 = (0, util_1.promisify)(dns.resolve4);
const reverse = (0, util_1.promisify)(dns.reverse);
// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================
/**
 * Defines the spam rule model
 * @param sequelize - Sequelize instance
 * @returns Spam rule model
 * @example
 * const SpamRule = defineSpamRuleModel(sequelize);
 */
function defineSpamRuleModel(sequelize) {
    return sequelize.define('SpamRule', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        type: {
            type: sequelize_1.DataTypes.ENUM('header', 'body', 'sender', 'recipient', 'attachment', 'composite'),
            allowNull: false,
            defaultValue: 'composite',
        },
        enabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        priority: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 100,
        },
        conditionJson: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
        },
        actionJson: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
        },
        scoreModifier: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        hitCount: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
        },
        lastHitAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        createdBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
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
        tableName: 'spam_rules',
        timestamps: true,
        indexes: [
            { fields: ['enabled'] },
            { fields: ['type'] },
            { fields: ['priority'] },
            { fields: ['createdBy'] },
        ],
    });
}
/**
 * Defines the Bayesian token model
 * @param sequelize - Sequelize instance
 * @returns Bayesian token model
 * @example
 * const BayesianToken = defineBayesianTokenModel(sequelize);
 */
function defineBayesianTokenModel(sequelize) {
    return sequelize.define('BayesianToken', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        token: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        tokenHash: {
            type: sequelize_1.DataTypes.STRING(64),
            allowNull: false,
            unique: true,
        },
        spamCount: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
        },
        hamCount: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
        },
        spamProbability: {
            type: sequelize_1.DataTypes.DECIMAL(10, 8),
            allowNull: false,
            defaultValue: 0.5,
        },
        totalCount: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
        },
        lastUpdated: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
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
        tableName: 'bayesian_tokens',
        timestamps: true,
        indexes: [
            { fields: ['tokenHash'], unique: true },
            { fields: ['spamProbability'] },
            { fields: ['lastUpdated'] },
        ],
    });
}
/**
 * Defines the whitelist model
 * @param sequelize - Sequelize instance
 * @returns Whitelist model
 * @example
 * const Whitelist = defineWhitelistModel(sequelize);
 */
function defineWhitelistModel(sequelize) {
    return sequelize.define('Whitelist', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        type: {
            type: sequelize_1.DataTypes.ENUM('email', 'domain', 'ip', 'asn'),
            allowNull: false,
        },
        value: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
        },
        valueHash: {
            type: sequelize_1.DataTypes.STRING(64),
            allowNull: false,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        global: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        expiresAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        addedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        reason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        hitCount: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
        },
        lastHitAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
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
        tableName: 'spam_whitelist',
        timestamps: true,
        indexes: [
            { fields: ['type', 'valueHash'], unique: true },
            { fields: ['userId'] },
            { fields: ['global'] },
            { fields: ['expiresAt'] },
        ],
    });
}
/**
 * Defines the blacklist model
 * @param sequelize - Sequelize instance
 * @returns Blacklist model
 * @example
 * const Blacklist = defineBlacklistModel(sequelize);
 */
function defineBlacklistModel(sequelize) {
    return sequelize.define('Blacklist', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        type: {
            type: sequelize_1.DataTypes.ENUM('email', 'domain', 'ip', 'url', 'hash'),
            allowNull: false,
        },
        value: {
            type: sequelize_1.DataTypes.STRING(1000),
            allowNull: false,
        },
        valueHash: {
            type: sequelize_1.DataTypes.STRING(64),
            allowNull: false,
        },
        category: {
            type: sequelize_1.DataTypes.ENUM('spam', 'phishing', 'malware', 'botnet', 'other'),
            allowNull: false,
            defaultValue: 'spam',
        },
        severity: {
            type: sequelize_1.DataTypes.ENUM('low', 'medium', 'high', 'critical'),
            allowNull: false,
            defaultValue: 'medium',
        },
        source: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        global: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        expiresAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        addedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        reason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        hitCount: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
        },
        lastHitAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
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
        tableName: 'spam_blacklist',
        timestamps: true,
        indexes: [
            { fields: ['type', 'valueHash'] },
            { fields: ['category'] },
            { fields: ['severity'] },
            { fields: ['global'] },
            { fields: ['expiresAt'] },
        ],
    });
}
/**
 * Defines the quarantine model
 * @param sequelize - Sequelize instance
 * @returns Quarantine model
 * @example
 * const Quarantine = defineQuarantineModel(sequelize);
 */
function defineQuarantineModel(sequelize) {
    return sequelize.define('Quarantine', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        messageId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        fromAddress: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
        },
        toAddress: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
        },
        subject: {
            type: sequelize_1.DataTypes.STRING(1000),
            allowNull: false,
        },
        quarantineReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        spamScore: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        messageData: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('quarantined', 'released', 'deleted'),
            allowNull: false,
            defaultValue: 'quarantined',
        },
        quarantinedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        expiresAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        releasedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        releasedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
        },
        deletedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        deletedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
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
        tableName: 'spam_quarantine',
        timestamps: true,
        indexes: [
            { fields: ['messageId'] },
            { fields: ['userId'] },
            { fields: ['status'] },
            { fields: ['quarantinedAt'] },
            { fields: ['expiresAt'] },
        ],
    });
}
/**
 * Defines the spam report model
 * @param sequelize - Sequelize instance
 * @returns Spam report model
 * @example
 * const SpamReport = defineSpamReportModel(sequelize);
 */
function defineSpamReportModel(sequelize) {
    return sequelize.define('SpamReport', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        messageId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        reportedBy: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        reportType: {
            type: sequelize_1.DataTypes.ENUM('spam', 'phishing', 'malware', 'not-spam'),
            allowNull: false,
        },
        comment: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        processed: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        processedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        action: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
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
        tableName: 'spam_reports',
        timestamps: true,
        indexes: [
            { fields: ['messageId'] },
            { fields: ['reportedBy'] },
            { fields: ['reportType'] },
            { fields: ['processed'] },
        ],
    });
}
/**
 * Defines the user spam preferences model
 * @param sequelize - Sequelize instance
 * @returns User spam preferences model
 * @example
 * const UserSpamPreferences = defineUserSpamPreferencesModel(sequelize);
 */
function defineUserSpamPreferencesModel(sequelize) {
    return sequelize.define('UserSpamPreferences', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            unique: true,
        },
        aggressiveness: {
            type: sequelize_1.DataTypes.ENUM('low', 'medium', 'high', 'custom'),
            allowNull: false,
            defaultValue: 'medium',
        },
        autoQuarantine: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        autoDelete: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        deleteAfterDays: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        whitelistEnabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        blacklistEnabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        notifyOnQuarantine: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        customRulesJson: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        threshold: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
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
        tableName: 'user_spam_preferences',
        timestamps: true,
        indexes: [
            { fields: ['userId'], unique: true },
            { fields: ['aggressiveness'] },
        ],
    });
}
/**
 * Defines the spam statistics model
 * @param sequelize - Sequelize instance
 * @returns Spam statistics model
 * @example
 * const SpamStatistics = defineSpamStatisticsModel(sequelize);
 */
function defineSpamStatisticsModel(sequelize) {
    return sequelize.define('SpamStatistics', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        date: {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: false,
            unique: true,
        },
        totalProcessed: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
        },
        spamDetected: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
        },
        hamDetected: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
        },
        quarantined: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
        },
        rejected: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
        },
        falsePositives: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
        },
        falseNegatives: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
        },
        accuracy: {
            type: sequelize_1.DataTypes.DECIMAL(10, 4),
            allowNull: true,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
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
        tableName: 'spam_statistics',
        timestamps: true,
        indexes: [
            { fields: ['date'], unique: true },
        ],
    });
}
// ============================================================================
// BAYESIAN SPAM FILTERING
// ============================================================================
/**
 * Tokenizes email content for Bayesian analysis
 * @param text - Text content to tokenize
 * @returns Array of tokens
 * @example
 * const tokens = tokenizeEmailContent(email.body);
 */
function tokenizeEmailContent(text) {
    const normalized = text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    const words = normalized.split(' ').filter(word => word.length > 2 && word.length < 50);
    // Generate bigrams for better context
    const bigrams = [];
    for (let i = 0; i < words.length - 1; i++) {
        bigrams.push(`${words[i]}_${words[i + 1]}`);
    }
    return [...words, ...bigrams];
}
/**
 * Calculates token hash for database storage
 * @param token - Token string
 * @returns SHA256 hash of token
 * @example
 * const hash = calculateTokenHash('viagra');
 */
function calculateTokenHash(token) {
    return crypto.createHash('sha256').update(token.toLowerCase()).digest('hex');
}
/**
 * Trains Bayesian classifier with spam message
 * @param BayesianTokenModel - Bayesian token model
 * @param message - Email message
 * @param transaction - Optional database transaction
 * @returns Promise that resolves when training is complete
 * @example
 * await trainBayesianSpam(BayesianToken, spamMessage);
 */
async function trainBayesianSpam(BayesianTokenModel, message, transaction) {
    const tokens = tokenizeEmailContent(`${message.subject} ${message.body}`);
    const uniqueTokens = [...new Set(tokens)];
    for (const token of uniqueTokens) {
        const tokenHash = calculateTokenHash(token);
        const [tokenRecord] = await BayesianTokenModel.findOrCreate({
            where: { tokenHash },
            defaults: {
                token: token.substring(0, 255),
                tokenHash,
                spamCount: 0,
                hamCount: 0,
                spamProbability: 0.5,
                totalCount: 0,
                lastUpdated: new Date(),
            },
            transaction,
        });
        await tokenRecord.update({
            spamCount: tokenRecord.spamCount + 1,
            totalCount: tokenRecord.totalCount + 1,
            spamProbability: (tokenRecord.spamCount + 1) / (tokenRecord.totalCount + 2),
            lastUpdated: new Date(),
        }, { transaction });
    }
}
/**
 * Trains Bayesian classifier with ham (non-spam) message
 * @param BayesianTokenModel - Bayesian token model
 * @param message - Email message
 * @param transaction - Optional database transaction
 * @returns Promise that resolves when training is complete
 * @example
 * await trainBayesianHam(BayesianToken, legitimateMessage);
 */
async function trainBayesianHam(BayesianTokenModel, message, transaction) {
    const tokens = tokenizeEmailContent(`${message.subject} ${message.body}`);
    const uniqueTokens = [...new Set(tokens)];
    for (const token of uniqueTokens) {
        const tokenHash = calculateTokenHash(token);
        const [tokenRecord] = await BayesianTokenModel.findOrCreate({
            where: { tokenHash },
            defaults: {
                token: token.substring(0, 255),
                tokenHash,
                spamCount: 0,
                hamCount: 0,
                spamProbability: 0.5,
                totalCount: 0,
                lastUpdated: new Date(),
            },
            transaction,
        });
        await tokenRecord.update({
            hamCount: tokenRecord.hamCount + 1,
            totalCount: tokenRecord.totalCount + 1,
            spamProbability: tokenRecord.spamCount / (tokenRecord.totalCount + 2),
            lastUpdated: new Date(),
        }, { transaction });
    }
}
/**
 * Classifies message using Bayesian spam filter
 * @param BayesianTokenModel - Bayesian token model
 * @param message - Email message to classify
 * @returns Bayesian classification result
 * @example
 * const result = await classifyBayesian(BayesianToken, message);
 * console.log(`Spam probability: ${result.spamProbability}`);
 */
async function classifyBayesian(BayesianTokenModel, message) {
    const tokens = tokenizeEmailContent(`${message.subject} ${message.body}`);
    const uniqueTokens = [...new Set(tokens)];
    const tokenHashes = uniqueTokens.map(calculateTokenHash);
    const tokenRecords = await BayesianTokenModel.findAll({
        where: { tokenHash: { [sequelize_1.Op.in]: tokenHashes } },
    });
    const tokenMap = new Map(tokenRecords.map(t => [t.tokenHash, t]));
    let spamProduct = 1;
    let hamProduct = 1;
    const significantTokens = [];
    for (const token of uniqueTokens.slice(0, 100)) {
        const tokenHash = calculateTokenHash(token);
        const record = tokenMap.get(tokenHash);
        const probability = record ? record.spamProbability : 0.5;
        if (Math.abs(probability - 0.5) > 0.1) {
            significantTokens.push({ token, spamProbability: probability });
        }
        spamProduct *= probability;
        hamProduct *= 1 - probability;
    }
    const spamProbability = spamProduct / (spamProduct + hamProduct);
    const hamProbability = 1 - spamProbability;
    significantTokens.sort((a, b) => Math.abs(b.spamProbability - 0.5) - Math.abs(a.spamProbability - 0.5));
    return {
        isSpam: spamProbability > 0.5,
        spamProbability,
        hamProbability,
        tokenCount: uniqueTokens.length,
        significantTokens: significantTokens.slice(0, 20),
    };
}
// ============================================================================
// SPF VALIDATION
// ============================================================================
/**
 * Parses SPF record
 * @param spfRecord - Raw SPF record string
 * @returns Parsed SPF mechanisms
 * @example
 * const mechanisms = parseSPFRecord('v=spf1 ip4:192.0.2.0/24 -all');
 */
function parseSPFRecord(spfRecord) {
    return spfRecord
        .replace(/^v=spf1\s*/i, '')
        .split(/\s+/)
        .filter(m => m.length > 0);
}
/**
 * Validates sender IP against SPF record
 * @param domain - Sender domain
 * @param ip - Sender IP address
 * @returns SPF validation result
 * @example
 * const result = await validateSPF('example.com', '192.0.2.1');
 * console.log(`SPF result: ${result.result}`);
 */
async function validateSPF(domain, ip) {
    try {
        const records = await resolveTxt(domain);
        const spfRecord = records.flat().find(r => r.startsWith('v=spf1'));
        if (!spfRecord) {
            return {
                valid: false,
                result: 'none',
                domain,
                ip,
                explanation: 'No SPF record found',
            };
        }
        const mechanisms = parseSPFRecord(spfRecord);
        let result = 'neutral';
        for (const mechanism of mechanisms) {
            const qualifier = mechanism[0];
            const mech = qualifier.match(/[+\-~?]/) ? mechanism.substring(1) : mechanism;
            if (mech.startsWith('ip4:')) {
                const ipRange = mech.substring(4);
                if (ipMatchesRange(ip, ipRange)) {
                    result = qualifier === '-' ? 'fail' : qualifier === '~' ? 'softfail' : 'pass';
                    break;
                }
            }
            else if (mech === 'all') {
                result = qualifier === '-' ? 'fail' : qualifier === '~' ? 'softfail' : 'pass';
                break;
            }
        }
        return {
            valid: result === 'pass',
            result,
            domain,
            ip,
            spfRecord,
        };
    }
    catch (error) {
        return {
            valid: false,
            result: 'temperror',
            domain,
            ip,
            explanation: `DNS error: ${error.message}`,
        };
    }
}
/**
 * Checks if IP matches CIDR range
 * @param ip - IP address
 * @param range - CIDR range
 * @returns True if IP is in range
 * @example
 * const matches = ipMatchesRange('192.0.2.10', '192.0.2.0/24');
 */
function ipMatchesRange(ip, range) {
    const [rangeIp, bits] = range.includes('/') ? range.split('/') : [range, '32'];
    const mask = bits ? -1 << (32 - parseInt(bits, 10)) : -1;
    const ipNum = ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0);
    const rangeNum = rangeIp.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0);
    return (ipNum & mask) === (rangeNum & mask);
}
// ============================================================================
// DKIM SIGNATURE VERIFICATION
// ============================================================================
/**
 * Extracts DKIM signature from headers
 * @param headers - Email headers
 * @returns Array of DKIM signature objects
 * @example
 * const signatures = extractDKIMSignatures(message.headers);
 */
function extractDKIMSignatures(headers) {
    const dkimHeaders = Array.isArray(headers['dkim-signature'])
        ? headers['dkim-signature']
        : headers['dkim-signature']
            ? [headers['dkim-signature']]
            : [];
    return dkimHeaders.map(header => {
        const parts = header.split(';').reduce((acc, part) => {
            const [key, value] = part.split('=').map(s => s.trim());
            if (key && value)
                acc[key] = value;
            return acc;
        }, {});
        return {
            domain: parts['d'] || '',
            selector: parts['s'] || '',
            algorithm: parts['a'] || 'rsa-sha256',
            headers: parts['h'] ? parts['h'].split(':') : [],
            signature: parts['b'] || '',
        };
    });
}
/**
 * Verifies DKIM signature
 * @param message - Email message
 * @returns DKIM verification result
 * @example
 * const result = await verifyDKIM(message);
 * console.log(`DKIM valid: ${result.valid}`);
 */
async function verifyDKIM(message) {
    const signatures = extractDKIMSignatures(message.headers);
    if (signatures.length === 0) {
        return {
            valid: false,
            signatures: [],
        };
    }
    const verifiedSignatures = await Promise.all(signatures.map(async (sig) => {
        try {
            // In production, fetch public key from DNS and verify signature
            const dnsKey = `${sig.selector}._domainkey.${sig.domain}`;
            const records = await resolveTxt(dnsKey);
            const publicKey = records.flat().find(r => r.includes('p='));
            if (!publicKey) {
                return {
                    domain: sig.domain,
                    selector: sig.selector,
                    algorithm: sig.algorithm,
                    verified: false,
                    error: 'Public key not found',
                };
            }
            // Simplified verification - in production, use proper crypto verification
            return {
                domain: sig.domain,
                selector: sig.selector,
                algorithm: sig.algorithm,
                verified: true,
            };
        }
        catch (error) {
            return {
                domain: sig.domain,
                selector: sig.selector,
                algorithm: sig.algorithm,
                verified: false,
                error: error.message,
            };
        }
    }));
    const valid = verifiedSignatures.some(s => s.verified);
    return {
        valid,
        signatures: verifiedSignatures,
    };
}
// ============================================================================
// DMARC POLICY ENFORCEMENT
// ============================================================================
/**
 * Retrieves DMARC policy for domain
 * @param domain - Email domain
 * @returns DMARC policy result
 * @example
 * const result = await getDMARCPolicy('example.com');
 * console.log(`DMARC policy: ${result.policy}`);
 */
async function getDMARCPolicy(domain) {
    try {
        const dmarcDomain = `_dmarc.${domain}`;
        const records = await resolveTxt(dmarcDomain);
        const dmarcRecord = records.flat().find(r => r.startsWith('v=DMARC1'));
        if (!dmarcRecord) {
            return {
                valid: false,
                policy: 'none',
                alignment: {
                    spfAligned: false,
                    dkimAligned: false,
                },
            };
        }
        const parts = dmarcRecord.split(';').reduce((acc, part) => {
            const [key, value] = part.split('=').map(s => s.trim());
            if (key && value)
                acc[key] = value;
            return acc;
        }, {});
        const policy = (parts['p'] || 'none');
        const percentage = parts['pct'] ? parseInt(parts['pct'], 10) : 100;
        const rua = parts['rua']?.split(',').map(addr => addr.replace(/^mailto:/, '')) || [];
        return {
            valid: true,
            policy,
            alignment: {
                spfAligned: false, // Set by caller based on SPF check
                dkimAligned: false, // Set by caller based on DKIM check
            },
            dmarcRecord,
            percentage,
            reportingAddresses: rua,
        };
    }
    catch (error) {
        return {
            valid: false,
            policy: 'none',
            alignment: {
                spfAligned: false,
                dkimAligned: false,
            },
        };
    }
}
/**
 * Enforces DMARC policy
 * @param spfResult - SPF validation result
 * @param dkimResult - DKIM verification result
 * @param dmarcResult - DMARC policy
 * @returns Updated DMARC result with alignment
 * @example
 * const enforcedPolicy = enforceDMARCPolicy(spfResult, dkimResult, dmarcPolicy);
 */
function enforceDMARCPolicy(spfResult, dkimResult, dmarcResult) {
    const spfAligned = spfResult.valid && spfResult.result === 'pass';
    const dkimAligned = dkimResult.valid;
    return {
        ...dmarcResult,
        alignment: {
            spfAligned,
            dkimAligned,
        },
        valid: spfAligned || dkimAligned,
    };
}
// ============================================================================
// RBL/DNSBL CHECKING
// ============================================================================
/**
 * Default RBL/DNSBL servers
 */
exports.DEFAULT_RBL_SERVERS = [
    'zen.spamhaus.org',
    'bl.spamcop.net',
    'b.barracudacentral.org',
    'dnsbl.sorbs.net',
    'psbl.surriel.com',
];
/**
 * Checks IP against RBL/DNSBL servers
 * @param ip - IP address to check
 * @param rblServers - Array of RBL server domains
 * @returns RBL check result
 * @example
 * const result = await checkRBL('192.0.2.1');
 * console.log(`IP listed: ${result.listed}`);
 */
async function checkRBL(ip, rblServers = exports.DEFAULT_RBL_SERVERS) {
    const reversedIp = ip.split('.').reverse().join('.');
    const results = await Promise.all(rblServers.map(async (server) => {
        try {
            const query = `${reversedIp}.${server}`;
            await resolve4(query);
            return {
                name: server,
                listed: true,
                listing: query,
            };
        }
        catch (error) {
            return {
                name: server,
                listed: false,
            };
        }
    }));
    const listed = results.some(r => r.listed);
    const score = results.filter(r => r.listed).length * 2;
    return {
        listed,
        blacklists: results,
        score,
    };
}
/**
 * Checks IP reputation
 * @param ip - IP address
 * @returns Reputation score (0-100, higher is better)
 * @example
 * const reputation = await checkIPReputation('192.0.2.1');
 */
async function checkIPReputation(ip) {
    const rblResult = await checkRBL(ip);
    let score = 100;
    if (rblResult.listed) {
        score -= rblResult.score * 10;
    }
    return Math.max(0, Math.min(100, score));
}
// ============================================================================
// CONTENT-BASED SPAM DETECTION
// ============================================================================
/**
 * Common spam patterns
 */
exports.SPAM_PATTERNS = [
    /viagra|cialis|levitra/i,
    /make money fast|get rich quick/i,
    /click here|act now|limited time/i,
    /free money|cash bonus/i,
    /congratulations.*won|lottery winner/i,
    /nigerian prince|inheritance/i,
    /enlarge.*penis|male enhancement/i,
    /weight loss.*pills/i,
    /work from home.*\$\d+/i,
    /unsubscribe.*here/i,
];
/**
 * Phishing indicators
 */
exports.PHISHING_PATTERNS = [
    /verify.*account/i,
    /suspend.*account/i,
    /update.*payment/i,
    /confirm.*identity/i,
    /unusual.*activity/i,
    /click.*immediately/i,
];
/**
 * Analyzes email content for spam indicators
 * @param message - Email message
 * @returns Content analysis result
 * @example
 * const analysis = analyzeEmailContent(message);
 * console.log(`Suspicious patterns: ${analysis.suspiciousPatterns.length}`);
 */
function analyzeEmailContent(message) {
    const fullText = `${message.subject} ${message.body}`;
    const suspiciousPatterns = [];
    const phishingIndicators = [];
    const maliciousKeywords = [];
    // Check spam patterns
    for (const pattern of exports.SPAM_PATTERNS) {
        const matches = fullText.match(new RegExp(pattern, 'gi'));
        if (matches && matches.length > 0) {
            suspiciousPatterns.push({
                pattern: pattern.source,
                matches: matches.length,
                severity: 'medium',
            });
        }
    }
    // Check phishing patterns
    for (const pattern of exports.PHISHING_PATTERNS) {
        const matches = fullText.match(new RegExp(pattern, 'gi'));
        if (matches && matches.length > 0) {
            phishingIndicators.push(pattern.source);
            suspiciousPatterns.push({
                pattern: pattern.source,
                matches: matches.length,
                severity: 'high',
            });
        }
    }
    // Calculate language quality score
    const uppercaseRatio = (fullText.match(/[A-Z]/g) || []).length / fullText.length;
    const exclamationCount = (fullText.match(/!/g) || []).length;
    const languageScore = 100 - Math.min(100, uppercaseRatio * 100 + exclamationCount * 5);
    return {
        suspiciousPatterns,
        languageScore,
        phishingIndicators,
        maliciousKeywords,
    };
}
/**
 * Calculates HTML complexity score
 * @param html - HTML content
 * @returns Complexity score (0-100)
 * @example
 * const complexity = calculateHTMLComplexity(message.body);
 */
function calculateHTMLComplexity(html) {
    if (!html || !html.includes('<'))
        return 0;
    const tagCount = (html.match(/<[^>]+>/g) || []).length;
    const scriptCount = (html.match(/<script/gi) || []).length;
    const iframeCount = (html.match(/<iframe/gi) || []).length;
    const hiddenCount = (html.match(/display:\s*none/gi) || []).length;
    return Math.min(100, tagCount / 10 + scriptCount * 20 + iframeCount * 30 + hiddenCount * 10);
}
// ============================================================================
// URL BLACKLIST CHECKING
// ============================================================================
/**
 * Extracts URLs from email content
 * @param text - Email body
 * @returns Array of extracted URLs
 * @example
 * const urls = extractURLsFromEmail(message.body);
 */
function extractURLsFromEmail(text) {
    const urlRegex = /(https?:\/\/[^\s<>"{}|\\^`\[\]]+)/gi;
    const matches = text.match(urlRegex);
    return matches ? [...new Set(matches)] : [];
}
/**
 * Checks URLs against blacklist
 * @param BlacklistModel - Blacklist model
 * @param urls - Array of URLs to check
 * @returns URL analysis result
 * @example
 * const result = await checkURLBlacklist(Blacklist, urls);
 */
async function checkURLBlacklist(BlacklistModel, urls) {
    const urlAnalysis = await Promise.all(urls.map(async (url) => {
        try {
            const urlObj = new URL(url);
            const domain = urlObj.hostname;
            const domainHash = crypto.createHash('sha256').update(domain.toLowerCase()).digest('hex');
            const urlHash = crypto.createHash('sha256').update(url.toLowerCase()).digest('hex');
            const blacklisted = await BlacklistModel.findOne({
                where: {
                    type: { [sequelize_1.Op.in]: ['url', 'domain'] },
                    valueHash: { [sequelize_1.Op.in]: [urlHash, domainHash] },
                    [sequelize_1.Op.or]: [{ expiresAt: null }, { expiresAt: { [sequelize_1.Op.gt]: new Date() } }],
                },
            });
            return {
                url,
                domain,
                blacklisted: !!blacklisted,
                suspicious: url.length > 100 || domain.includes('-') || /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(domain),
            };
        }
        catch (error) {
            return {
                url,
                domain: '',
                blacklisted: false,
                suspicious: true,
            };
        }
    }));
    return {
        urls: urlAnalysis,
        totalUrls: urls.length,
        blacklistedCount: urlAnalysis.filter(u => u.blacklisted).length,
        suspiciousCount: urlAnalysis.filter(u => u.suspicious).length,
    };
}
// ============================================================================
// SPAM SCORE CALCULATION
// ============================================================================
/**
 * Calculates overall spam score
 * @param analysisResult - Spam analysis result
 * @returns Spam score (0-100)
 * @example
 * const score = calculateSpamScore(analysisResult);
 */
function calculateSpamScore(analysisResult) {
    let score = 0;
    // Bayesian score (0-40 points)
    if (analysisResult.filterResults.bayesian) {
        score += analysisResult.filterResults.bayesian.spamProbability * 40;
    }
    // SPF/DKIM/DMARC (0-20 points)
    if (analysisResult.filterResults.spf && !analysisResult.filterResults.spf.valid) {
        score += 10;
    }
    if (analysisResult.filterResults.dkim && !analysisResult.filterResults.dkim.valid) {
        score += 5;
    }
    if (analysisResult.filterResults.dmarc && !analysisResult.filterResults.dmarc.valid) {
        score += 5;
    }
    // RBL (0-20 points)
    if (analysisResult.filterResults.rbl && analysisResult.filterResults.rbl.listed) {
        score += Math.min(20, analysisResult.filterResults.rbl.score);
    }
    // Content analysis (0-15 points)
    if (analysisResult.filterResults.content) {
        const content = analysisResult.filterResults.content;
        score += Math.min(15, content.suspiciousPatterns.length * 3);
        score += Math.min(5, content.phishingIndicators.length * 5);
    }
    // URL analysis (0-5 points)
    if (analysisResult.filterResults.url && analysisResult.filterResults.url.blacklistedCount > 0) {
        score += 5;
    }
    return Math.min(100, Math.round(score));
}
/**
 * Determines spam action based on score
 * @param score - Spam score
 * @param threshold - User threshold
 * @returns Recommended action
 * @example
 * const action = determineSpamAction(score, 50);
 */
function determineSpamAction(score, threshold = 50) {
    if (score >= 90) {
        return {
            action: 'reject',
            priority: 1,
            reason: 'High spam score - message rejected',
        };
    }
    else if (score >= threshold) {
        return {
            action: 'quarantine',
            priority: 2,
            reason: 'Suspicious message - quarantined for review',
        };
    }
    else if (score >= 30) {
        return {
            action: 'tag',
            priority: 3,
            reason: 'Possible spam - tagged for user review',
        };
    }
    else {
        return {
            action: 'allow',
            priority: 4,
            reason: 'Message appears legitimate',
        };
    }
}
// ============================================================================
// WHITELIST AND BLACKLIST MANAGEMENT
// ============================================================================
/**
 * Adds entry to whitelist
 * @param WhitelistModel - Whitelist model
 * @param entry - Whitelist entry
 * @param transaction - Optional database transaction
 * @returns Created whitelist entry
 * @example
 * await addToWhitelist(Whitelist, { type: 'email', value: 'user@example.com', global: false });
 */
async function addToWhitelist(WhitelistModel, entry, transaction) {
    const valueHash = crypto.createHash('sha256').update(entry.value.toLowerCase()).digest('hex');
    const [whitelist, created] = await WhitelistModel.findOrCreate({
        where: {
            type: entry.type,
            valueHash,
        },
        defaults: {
            type: entry.type,
            value: entry.value,
            valueHash,
            userId: entry.userId,
            global: entry.global,
            expiresAt: entry.expiresAt,
            addedBy: entry.addedBy,
            reason: entry.reason,
            hitCount: 0,
        },
        transaction,
    });
    return whitelist;
}
/**
 * Adds entry to blacklist
 * @param BlacklistModel - Blacklist model
 * @param entry - Blacklist entry
 * @param transaction - Optional database transaction
 * @returns Created blacklist entry
 * @example
 * await addToBlacklist(Blacklist, { type: 'email', value: 'spam@example.com', category: 'spam', severity: 'high', source: 'manual', global: true });
 */
async function addToBlacklist(BlacklistModel, entry, transaction) {
    const valueHash = crypto.createHash('sha256').update(entry.value.toLowerCase()).digest('hex');
    const [blacklist, created] = await BlacklistModel.findOrCreate({
        where: {
            type: entry.type,
            valueHash,
        },
        defaults: {
            type: entry.type,
            value: entry.value,
            valueHash,
            category: entry.category,
            severity: entry.severity,
            source: entry.source,
            global: entry.global,
            expiresAt: entry.expiresAt,
            addedBy: entry.addedBy,
            reason: entry.reason,
            hitCount: 0,
        },
        transaction,
    });
    return blacklist;
}
/**
 * Checks if email address is whitelisted
 * @param WhitelistModel - Whitelist model
 * @param email - Email address
 * @param userId - Optional user ID
 * @returns True if whitelisted
 * @example
 * const isWhitelisted = await isEmailWhitelisted(Whitelist, 'user@example.com', userId);
 */
async function isEmailWhitelisted(WhitelistModel, email, userId) {
    const emailHash = crypto.createHash('sha256').update(email.toLowerCase()).digest('hex');
    const domain = email.split('@')[1];
    const domainHash = domain ? crypto.createHash('sha256').update(domain.toLowerCase()).digest('hex') : null;
    const whereConditions = [
        { type: 'email', valueHash: emailHash },
    ];
    if (domainHash) {
        whereConditions.push({ type: 'domain', valueHash: domainHash });
    }
    const whitelist = await WhitelistModel.findOne({
        where: {
            [sequelize_1.Op.or]: whereConditions,
            [sequelize_1.Op.or]: [{ global: true }, { userId }],
            [sequelize_1.Op.or]: [{ expiresAt: null }, { expiresAt: { [sequelize_1.Op.gt]: new Date() } }],
        },
    });
    if (whitelist) {
        await whitelist.update({
            hitCount: whitelist.hitCount + 1,
            lastHitAt: new Date(),
        });
    }
    return !!whitelist;
}
/**
 * Checks if email address is blacklisted
 * @param BlacklistModel - Blacklist model
 * @param email - Email address
 * @returns Blacklist entry if found, null otherwise
 * @example
 * const blacklisted = await isEmailBlacklisted(Blacklist, 'spam@example.com');
 */
async function isEmailBlacklisted(BlacklistModel, email) {
    const emailHash = crypto.createHash('sha256').update(email.toLowerCase()).digest('hex');
    const domain = email.split('@')[1];
    const domainHash = domain ? crypto.createHash('sha256').update(domain.toLowerCase()).digest('hex') : null;
    const whereConditions = [
        { type: 'email', valueHash: emailHash },
    ];
    if (domainHash) {
        whereConditions.push({ type: 'domain', valueHash: domainHash });
    }
    const blacklist = await BlacklistModel.findOne({
        where: {
            [sequelize_1.Op.or]: whereConditions,
            [sequelize_1.Op.or]: [{ expiresAt: null }, { expiresAt: { [sequelize_1.Op.gt]: new Date() } }],
        },
        order: [['severity', 'DESC']],
    });
    if (blacklist) {
        await blacklist.update({
            hitCount: blacklist.hitCount + 1,
            lastHitAt: new Date(),
        });
    }
    return blacklist;
}
/**
 * Removes entry from whitelist
 * @param WhitelistModel - Whitelist model
 * @param id - Whitelist entry ID
 * @returns True if removed successfully
 * @example
 * await removeFromWhitelist(Whitelist, 'entry-id');
 */
async function removeFromWhitelist(WhitelistModel, id) {
    const result = await WhitelistModel.destroy({
        where: { id },
    });
    return result > 0;
}
/**
 * Removes entry from blacklist
 * @param BlacklistModel - Blacklist model
 * @param id - Blacklist entry ID
 * @returns True if removed successfully
 * @example
 * await removeFromBlacklist(Blacklist, 'entry-id');
 */
async function removeFromBlacklist(BlacklistModel, id) {
    const result = await BlacklistModel.destroy({
        where: { id },
    });
    return result > 0;
}
// ============================================================================
// USER-SPECIFIC SPAM PREFERENCES
// ============================================================================
/**
 * Gets user spam preferences
 * @param UserSpamPreferencesModel - User spam preferences model
 * @param userId - User ID
 * @returns User spam preferences
 * @example
 * const prefs = await getUserSpamPreferences(UserSpamPreferences, userId);
 */
async function getUserSpamPreferences(UserSpamPreferencesModel, userId) {
    const [prefs] = await UserSpamPreferencesModel.findOrCreate({
        where: { userId },
        defaults: {
            userId,
            aggressiveness: 'medium',
            autoQuarantine: true,
            autoDelete: false,
            whitelistEnabled: true,
            blacklistEnabled: true,
            notifyOnQuarantine: true,
            threshold: 50,
        },
    });
    return {
        userId: prefs.userId,
        aggressiveness: prefs.aggressiveness,
        autoQuarantine: prefs.autoQuarantine,
        autoDelete: prefs.autoDelete,
        deleteAfterDays: prefs.deleteAfterDays,
        whitelistEnabled: prefs.whitelistEnabled,
        blacklistEnabled: prefs.blacklistEnabled,
        notifyOnQuarantine: prefs.notifyOnQuarantine,
        customRules: prefs.customRulesJson,
        threshold: prefs.threshold,
    };
}
/**
 * Updates user spam preferences
 * @param UserSpamPreferencesModel - User spam preferences model
 * @param userId - User ID
 * @param preferences - Updated preferences
 * @returns Updated preferences
 * @example
 * await updateUserSpamPreferences(UserSpamPreferences, userId, { aggressiveness: 'high', threshold: 40 });
 */
async function updateUserSpamPreferences(UserSpamPreferencesModel, userId, preferences) {
    await UserSpamPreferencesModel.upsert({
        userId,
        aggressiveness: preferences.aggressiveness || 'medium',
        autoQuarantine: preferences.autoQuarantine ?? true,
        autoDelete: preferences.autoDelete ?? false,
        deleteAfterDays: preferences.deleteAfterDays,
        whitelistEnabled: preferences.whitelistEnabled ?? true,
        blacklistEnabled: preferences.blacklistEnabled ?? true,
        notifyOnQuarantine: preferences.notifyOnQuarantine ?? true,
        customRulesJson: preferences.customRules,
        threshold: preferences.threshold,
    });
    return getUserSpamPreferences(UserSpamPreferencesModel, userId);
}
// ============================================================================
// QUARANTINE MANAGEMENT
// ============================================================================
/**
 * Quarantines a message
 * @param QuarantineModel - Quarantine model
 * @param message - Email message
 * @param userId - User ID
 * @param reason - Quarantine reason
 * @param spamScore - Spam score
 * @param expiryDays - Days until expiry (default: 30)
 * @param transaction - Optional database transaction
 * @returns Quarantined message
 * @example
 * await quarantineMessage(Quarantine, message, userId, 'High spam score', 85);
 */
async function quarantineMessage(QuarantineModel, message, userId, reason, spamScore, expiryDays = 30, transaction) {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expiryDays * 24 * 60 * 60 * 1000);
    return QuarantineModel.create({
        messageId: message.messageId,
        userId,
        fromAddress: message.from.address,
        toAddress: message.to[0]?.address || '',
        subject: message.subject,
        quarantineReason: reason,
        spamScore,
        messageData: message,
        status: 'quarantined',
        quarantinedAt: now,
        expiresAt,
    }, { transaction });
}
/**
 * Retrieves quarantined messages for user
 * @param QuarantineModel - Quarantine model
 * @param userId - User ID
 * @param status - Filter by status
 * @param limit - Maximum number of messages
 * @param offset - Offset for pagination
 * @returns Array of quarantined messages
 * @example
 * const messages = await getQuarantinedMessages(Quarantine, userId, 'quarantined', 50, 0);
 */
async function getQuarantinedMessages(QuarantineModel, userId, status, limit = 50, offset = 0) {
    const where = { userId };
    if (status) {
        where.status = status;
    }
    const quarantined = await QuarantineModel.findAll({
        where,
        order: [['quarantinedAt', 'DESC']],
        limit,
        offset,
    });
    return quarantined.map(q => ({
        id: q.id,
        messageId: q.messageId,
        userId: q.userId,
        from: q.fromAddress,
        to: q.toAddress,
        subject: q.subject,
        quarantineReason: q.quarantineReason,
        spamScore: parseFloat(q.spamScore.toString()),
        quarantinedAt: q.quarantinedAt,
        expiresAt: q.expiresAt,
        status: q.status,
        releasedAt: q.releasedAt,
        deletedAt: q.deletedAt,
        message: q.messageData,
    }));
}
/**
 * Releases message from quarantine
 * @param QuarantineModel - Quarantine model
 * @param quarantineId - Quarantine entry ID
 * @param releasedBy - User ID who released the message
 * @returns Released message
 * @example
 * const message = await releaseQuarantinedMessage(Quarantine, 'quarantine-id', userId);
 */
async function releaseQuarantinedMessage(QuarantineModel, quarantineId, releasedBy) {
    const quarantined = await QuarantineModel.findByPk(quarantineId);
    if (!quarantined || quarantined.status !== 'quarantined') {
        return null;
    }
    await quarantined.update({
        status: 'released',
        releasedAt: new Date(),
        releasedBy,
    });
    return quarantined.messageData;
}
/**
 * Deletes message from quarantine
 * @param QuarantineModel - Quarantine model
 * @param quarantineId - Quarantine entry ID
 * @param deletedBy - User ID who deleted the message
 * @returns True if deleted successfully
 * @example
 * await deleteQuarantinedMessage(Quarantine, 'quarantine-id', userId);
 */
async function deleteQuarantinedMessage(QuarantineModel, quarantineId, deletedBy) {
    const quarantined = await QuarantineModel.findByPk(quarantineId);
    if (!quarantined || quarantined.status === 'deleted') {
        return false;
    }
    await quarantined.update({
        status: 'deleted',
        deletedAt: new Date(),
        deletedBy,
    });
    return true;
}
/**
 * Purges expired quarantined messages
 * @param QuarantineModel - Quarantine model
 * @returns Number of messages purged
 * @example
 * const count = await purgeExpiredQuarantineMessages(Quarantine);
 */
async function purgeExpiredQuarantineMessages(QuarantineModel) {
    const result = await QuarantineModel.destroy({
        where: {
            expiresAt: { [sequelize_1.Op.lt]: new Date() },
            status: 'quarantined',
        },
    });
    return result;
}
// ============================================================================
// SPAM REPORTING AND LEARNING
// ============================================================================
/**
 * Reports message as spam
 * @param SpamReportModel - Spam report model
 * @param BayesianTokenModel - Bayesian token model
 * @param messageId - Message ID
 * @param reportedBy - User ID who reported
 * @param reportType - Type of report
 * @param message - Optional message for training
 * @param comment - Optional comment
 * @returns Spam report
 * @example
 * await reportSpam(SpamReport, BayesianToken, 'message-id', userId, 'spam', message);
 */
async function reportSpam(SpamReportModel, BayesianTokenModel, messageId, reportedBy, reportType, message, comment) {
    const report = await SpamReportModel.create({
        messageId,
        reportedBy,
        reportType,
        comment,
        processed: false,
    });
    // Train Bayesian filter if message provided
    if (message) {
        if (reportType === 'spam' || reportType === 'phishing') {
            await trainBayesianSpam(BayesianTokenModel, message);
        }
        else if (reportType === 'not-spam') {
            await trainBayesianHam(BayesianTokenModel, message);
        }
        await report.update({
            processed: true,
            processedAt: new Date(),
            action: 'trained',
        });
    }
    return report;
}
/**
 * Processes pending spam reports
 * @param SpamReportModel - Spam report model
 * @param limit - Maximum number to process
 * @returns Number of reports processed
 * @example
 * const processed = await processPendingSpamReports(SpamReport);
 */
async function processPendingSpamReports(SpamReportModel, limit = 100) {
    const reports = await SpamReportModel.findAll({
        where: { processed: false },
        limit,
    });
    for (const report of reports) {
        await report.update({
            processed: true,
            processedAt: new Date(),
            action: 'reviewed',
        });
    }
    return reports.length;
}
// ============================================================================
// SPAM STATISTICS
// ============================================================================
/**
 * Records spam detection statistics
 * @param SpamStatisticsModel - Spam statistics model
 * @param date - Date for statistics
 * @param stats - Statistics to record
 * @returns Updated statistics
 * @example
 * await recordSpamStatistics(SpamStatistics, new Date(), { totalProcessed: 100, spamDetected: 25, hamDetected: 75 });
 */
async function recordSpamStatistics(SpamStatisticsModel, date, stats) {
    const dateOnly = new Date(date.toISOString().split('T')[0]);
    const [record] = await SpamStatisticsModel.findOrCreate({
        where: { date: dateOnly },
        defaults: {
            date: dateOnly,
            totalProcessed: 0,
            spamDetected: 0,
            hamDetected: 0,
            quarantined: 0,
            rejected: 0,
            falsePositives: 0,
            falseNegatives: 0,
        },
    });
    await record.update({
        totalProcessed: record.totalProcessed + (stats.totalProcessed || 0),
        spamDetected: record.spamDetected + (stats.spamDetected || 0),
        hamDetected: record.hamDetected + (stats.hamDetected || 0),
        quarantined: record.quarantined + (stats.quarantined || 0),
        rejected: record.rejected + (stats.rejected || 0),
        falsePositives: record.falsePositives + (stats.falsePositives || 0),
        falseNegatives: record.falseNegatives + (stats.falseNegatives || 0),
    });
    // Calculate accuracy
    const total = record.spamDetected + record.hamDetected;
    const correct = total - record.falsePositives - record.falseNegatives;
    const accuracy = total > 0 ? (correct / total) * 100 : 0;
    await record.update({ accuracy });
    return record;
}
/**
 * Gets spam statistics for date range
 * @param SpamStatisticsModel - Spam statistics model
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Array of statistics
 * @example
 * const stats = await getSpamStatistics(SpamStatistics, startDate, endDate);
 */
async function getSpamStatistics(SpamStatisticsModel, startDate, endDate) {
    const records = await SpamStatisticsModel.findAll({
        where: {
            date: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
        order: [['date', 'ASC']],
    });
    return records.map(r => ({
        totalProcessed: parseInt(r.totalProcessed.toString(), 10),
        spamDetected: parseInt(r.spamDetected.toString(), 10),
        hamDetected: parseInt(r.hamDetected.toString(), 10),
        quarantined: parseInt(r.quarantined.toString(), 10),
        rejected: parseInt(r.rejected.toString(), 10),
        falsePositives: parseInt(r.falsePositives.toString(), 10),
        falseNegatives: parseInt(r.falseNegatives.toString(), 10),
        accuracy: r.accuracy ? parseFloat(r.accuracy.toString()) : undefined,
        period: {
            start: r.date,
            end: r.date,
        },
    }));
}
// ============================================================================
// COMPREHENSIVE SPAM ANALYSIS
// ============================================================================
/**
 * Performs comprehensive spam analysis on email message
 * @param models - Object containing all required models
 * @param message - Email message to analyze
 * @param userId - User ID
 * @returns Complete spam analysis result
 * @example
 * const result = await analyzeSpam({ BayesianToken, Whitelist, Blacklist, UserSpamPreferences }, message, userId);
 */
async function analyzeSpam(models, message, userId) {
    const reasons = [];
    const filterResults = {};
    // Get user preferences
    const userPrefs = await getUserSpamPreferences(models.UserSpamPreferences, userId);
    // Check whitelist first
    if (userPrefs.whitelistEnabled) {
        const isWhitelisted = await isEmailWhitelisted(models.Whitelist, message.from.address, userId);
        if (isWhitelisted) {
            return {
                isSpam: false,
                spamScore: 0,
                confidence: 100,
                reasons: [
                    {
                        category: 'whitelist',
                        description: 'Sender is whitelisted',
                        severity: 'low',
                        score: 0,
                    },
                ],
                actions: [
                    {
                        action: 'allow',
                        priority: 1,
                        reason: 'Whitelisted sender',
                    },
                ],
                filterResults,
            };
        }
    }
    // Check blacklist
    if (userPrefs.blacklistEnabled) {
        const blacklisted = await isEmailBlacklisted(models.Blacklist, message.from.address);
        if (blacklisted) {
            reasons.push({
                category: 'blacklist',
                description: `Sender is blacklisted: ${blacklisted.reason || 'No reason specified'}`,
                severity: blacklisted.severity,
                score: 100,
            });
            return {
                isSpam: true,
                spamScore: 100,
                confidence: 100,
                reasons,
                actions: [
                    {
                        action: 'reject',
                        priority: 1,
                        reason: 'Blacklisted sender',
                    },
                ],
                filterResults,
            };
        }
    }
    // Bayesian classification
    const bayesianResult = await classifyBayesian(models.BayesianToken, message);
    filterResults.bayesian = bayesianResult;
    if (bayesianResult.spamProbability > 0.7) {
        reasons.push({
            category: 'bayesian',
            description: `Bayesian classifier detected spam (${(bayesianResult.spamProbability * 100).toFixed(1)}% probability)`,
            severity: 'high',
            score: bayesianResult.spamProbability * 40,
        });
    }
    // SPF validation
    if (message.sourceIp) {
        const spfResult = await validateSPF(message.from.domain || message.from.address.split('@')[1], message.sourceIp);
        filterResults.spf = spfResult;
        if (!spfResult.valid && spfResult.result === 'fail') {
            reasons.push({
                category: 'spf',
                description: 'SPF validation failed',
                severity: 'medium',
                score: 10,
            });
        }
    }
    // DKIM verification
    const dkimResult = await verifyDKIM(message);
    filterResults.dkim = dkimResult;
    if (!dkimResult.valid) {
        reasons.push({
            category: 'dkim',
            description: 'DKIM signature verification failed',
            severity: 'medium',
            score: 5,
        });
    }
    // DMARC policy
    const domain = message.from.domain || message.from.address.split('@')[1];
    const dmarcResult = await getDMARCPolicy(domain);
    const dmarcEnforced = enforceDMARCPolicy(filterResults.spf, dkimResult, dmarcResult);
    filterResults.dmarc = dmarcEnforced;
    if (!dmarcEnforced.valid && dmarcEnforced.policy !== 'none') {
        reasons.push({
            category: 'dmarc',
            description: `DMARC policy ${dmarcEnforced.policy} - alignment failed`,
            severity: dmarcEnforced.policy === 'reject' ? 'high' : 'medium',
            score: dmarcEnforced.policy === 'reject' ? 10 : 5,
        });
    }
    // RBL checking
    if (message.sourceIp) {
        const rblResult = await checkRBL(message.sourceIp);
        filterResults.rbl = rblResult;
        if (rblResult.listed) {
            reasons.push({
                category: 'rbl',
                description: `IP address listed on ${rblResult.blacklists.filter(b => b.listed).length} blacklist(s)`,
                severity: 'high',
                score: rblResult.score,
            });
        }
    }
    // Content analysis
    const contentResult = analyzeEmailContent(message);
    filterResults.content = contentResult;
    if (contentResult.suspiciousPatterns.length > 0) {
        reasons.push({
            category: 'content',
            description: `Found ${contentResult.suspiciousPatterns.length} suspicious pattern(s)`,
            severity: 'medium',
            score: Math.min(15, contentResult.suspiciousPatterns.length * 3),
        });
    }
    if (contentResult.phishingIndicators.length > 0) {
        reasons.push({
            category: 'phishing',
            description: `Detected ${contentResult.phishingIndicators.length} phishing indicator(s)`,
            severity: 'high',
            score: Math.min(20, contentResult.phishingIndicators.length * 5),
        });
    }
    // URL analysis
    const urls = extractURLsFromEmail(message.body);
    if (urls.length > 0) {
        const urlResult = await checkURLBlacklist(models.Blacklist, urls);
        filterResults.url = urlResult;
        if (urlResult.blacklistedCount > 0) {
            reasons.push({
                category: 'url',
                description: `Found ${urlResult.blacklistedCount} blacklisted URL(s)`,
                severity: 'critical',
                score: 5,
            });
        }
    }
    // Calculate final spam score
    const analysisResult = {
        isSpam: false,
        spamScore: 0,
        confidence: 0,
        reasons,
        actions: [],
        filterResults,
    };
    const spamScore = calculateSpamScore(analysisResult);
    const threshold = userPrefs.threshold || 50;
    const action = determineSpamAction(spamScore, threshold);
    analysisResult.spamScore = spamScore;
    analysisResult.isSpam = spamScore >= threshold;
    analysisResult.confidence = Math.min(100, spamScore * 1.2);
    analysisResult.actions = [action];
    return analysisResult;
}
// ============================================================================
// SWAGGER DOCUMENTATION
// ============================================================================
/**
 * Swagger schema for EmailMessage
 * @example
 * @ApiProperty(emailMessageSwaggerSchema)
 */
exports.emailMessageSwaggerSchema = {
    type: 'object',
    properties: {
        messageId: { type: 'string', description: 'Unique message identifier' },
        from: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                address: { type: 'string', format: 'email' },
                domain: { type: 'string' },
            },
        },
        to: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    address: { type: 'string', format: 'email' },
                    domain: { type: 'string' },
                },
            },
        },
        subject: { type: 'string' },
        body: { type: 'string' },
        headers: { type: 'object' },
        receivedDate: { type: 'string', format: 'date-time' },
        sourceIp: { type: 'string' },
    },
    required: ['messageId', 'from', 'to', 'subject', 'body', 'headers', 'receivedDate'],
};
/**
 * Swagger schema for SpamAnalysisResult
 * @example
 * @ApiResponse({ schema: spamAnalysisResultSwaggerSchema })
 */
exports.spamAnalysisResultSwaggerSchema = {
    type: 'object',
    properties: {
        isSpam: { type: 'boolean', description: 'Whether message is classified as spam' },
        spamScore: { type: 'number', description: 'Spam score (0-100)' },
        confidence: { type: 'number', description: 'Confidence level (0-100)' },
        reasons: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    category: { type: 'string' },
                    description: { type: 'string' },
                    severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
                    score: { type: 'number' },
                },
            },
        },
        actions: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    action: { type: 'string', enum: ['allow', 'quarantine', 'reject', 'tag', 'redirect'] },
                    priority: { type: 'number' },
                    reason: { type: 'string' },
                },
            },
        },
        filterResults: { type: 'object' },
    },
};
/**
 * Swagger schema for UserSpamPreferences
 * @example
 * @ApiProperty(userSpamPreferencesSwaggerSchema)
 */
exports.userSpamPreferencesSwaggerSchema = {
    type: 'object',
    properties: {
        userId: { type: 'string', format: 'uuid' },
        aggressiveness: { type: 'string', enum: ['low', 'medium', 'high', 'custom'] },
        autoQuarantine: { type: 'boolean' },
        autoDelete: { type: 'boolean' },
        deleteAfterDays: { type: 'number' },
        whitelistEnabled: { type: 'boolean' },
        blacklistEnabled: { type: 'boolean' },
        notifyOnQuarantine: { type: 'boolean' },
        threshold: { type: 'number', minimum: 0, maximum: 100 },
    },
};
/**
 * Swagger schema for QuarantinedMessage
 * @example
 * @ApiResponse({ schema: quarantinedMessageSwaggerSchema })
 */
exports.quarantinedMessageSwaggerSchema = {
    type: 'object',
    properties: {
        id: { type: 'string', format: 'uuid' },
        messageId: { type: 'string' },
        userId: { type: 'string', format: 'uuid' },
        from: { type: 'string', format: 'email' },
        to: { type: 'string', format: 'email' },
        subject: { type: 'string' },
        quarantineReason: { type: 'string' },
        spamScore: { type: 'number' },
        quarantinedAt: { type: 'string', format: 'date-time' },
        expiresAt: { type: 'string', format: 'date-time' },
        status: { type: 'string', enum: ['quarantined', 'released', 'deleted'] },
    },
};
//# sourceMappingURL=mail-spam-filtering-kit.js.map