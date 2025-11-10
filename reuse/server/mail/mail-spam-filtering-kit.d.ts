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
import { Model, ModelStatic, Sequelize, Transaction } from 'sequelize';
/**
 * Email message for spam analysis
 */
export interface EmailMessage {
    messageId: string;
    from: EmailAddress;
    to: EmailAddress[];
    cc?: EmailAddress[];
    subject: string;
    body: string;
    headers: Record<string, string | string[]>;
    attachments?: EmailAttachment[];
    receivedDate: Date;
    sourceIp?: string;
    receivedPath?: string[];
}
/**
 * Email address structure
 */
export interface EmailAddress {
    name?: string;
    address: string;
    domain?: string;
}
/**
 * Email attachment information
 */
export interface EmailAttachment {
    filename: string;
    contentType: string;
    size: number;
    hash?: string;
    isExecutable?: boolean;
}
/**
 * Spam analysis result
 */
export interface SpamAnalysisResult {
    isSpam: boolean;
    spamScore: number;
    confidence: number;
    reasons: SpamReason[];
    actions: SpamAction[];
    filterResults: {
        bayesian?: BayesianResult;
        spf?: SPFResult;
        dkim?: DKIMResult;
        dmarc?: DMARCResult;
        rbl?: RBLResult;
        content?: ContentAnalysisResult;
        url?: URLAnalysisResult;
    };
    metadata?: Record<string, any>;
}
/**
 * Spam detection reason
 */
export interface SpamReason {
    category: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    score: number;
    evidence?: string;
}
/**
 * Spam action to take
 */
export interface SpamAction {
    action: 'allow' | 'quarantine' | 'reject' | 'tag' | 'redirect';
    priority: number;
    reason: string;
    metadata?: Record<string, any>;
}
/**
 * Bayesian spam classification result
 */
export interface BayesianResult {
    isSpam: boolean;
    spamProbability: number;
    hamProbability: number;
    tokenCount: number;
    significantTokens: Array<{
        token: string;
        spamProbability: number;
    }>;
}
/**
 * SPF validation result
 */
export interface SPFResult {
    valid: boolean;
    result: 'pass' | 'fail' | 'softfail' | 'neutral' | 'none' | 'temperror' | 'permerror';
    domain: string;
    ip: string;
    spfRecord?: string;
    explanation?: string;
}
/**
 * DKIM signature verification result
 */
export interface DKIMResult {
    valid: boolean;
    signatures: Array<{
        domain: string;
        selector: string;
        algorithm: string;
        verified: boolean;
        error?: string;
    }>;
    bodyHashValid?: boolean;
    headerHashValid?: boolean;
}
/**
 * DMARC policy enforcement result
 */
export interface DMARCResult {
    valid: boolean;
    policy: 'none' | 'quarantine' | 'reject';
    alignment: {
        spfAligned: boolean;
        dkimAligned: boolean;
    };
    dmarcRecord?: string;
    percentage?: number;
    reportingAddresses?: string[];
}
/**
 * RBL/DNSBL check result
 */
export interface RBLResult {
    listed: boolean;
    blacklists: Array<{
        name: string;
        listed: boolean;
        reason?: string;
        listing?: string;
    }>;
    score: number;
}
/**
 * Content analysis result
 */
export interface ContentAnalysisResult {
    suspiciousPatterns: Array<{
        pattern: string;
        matches: number;
        severity: 'low' | 'medium' | 'high';
    }>;
    languageScore: number;
    phishingIndicators: string[];
    maliciousKeywords: string[];
    htmlComplexity?: number;
    imageRatio?: number;
}
/**
 * URL analysis result
 */
export interface URLAnalysisResult {
    urls: Array<{
        url: string;
        domain: string;
        blacklisted: boolean;
        suspicious: boolean;
        redirectCount?: number;
        reputation?: number;
    }>;
    totalUrls: number;
    blacklistedCount: number;
    suspiciousCount: number;
}
/**
 * Spam rule configuration
 */
export interface SpamRule {
    id: string;
    name: string;
    description: string;
    type: 'header' | 'body' | 'sender' | 'recipient' | 'attachment' | 'composite';
    enabled: boolean;
    priority: number;
    condition: RuleCondition;
    action: RuleAction;
    scoreModifier?: number;
    metadata?: Record<string, any>;
}
/**
 * Rule condition
 */
export interface RuleCondition {
    field?: string;
    operator: 'equals' | 'contains' | 'matches' | 'startsWith' | 'endsWith' | 'regex' | 'exists';
    value?: string | number | boolean | string[];
    caseSensitive?: boolean;
    negate?: boolean;
    subConditions?: RuleCondition[];
    logic?: 'and' | 'or';
}
/**
 * Rule action
 */
export interface RuleAction {
    type: 'allow' | 'block' | 'quarantine' | 'tag' | 'score' | 'redirect';
    value?: string | number;
    metadata?: Record<string, any>;
}
/**
 * Bayesian token
 */
export interface BayesianToken {
    token: string;
    spamCount: number;
    hamCount: number;
    spamProbability: number;
    lastUpdated: Date;
}
/**
 * User spam preferences
 */
export interface UserSpamPreferences {
    userId: string;
    aggressiveness: 'low' | 'medium' | 'high' | 'custom';
    autoQuarantine: boolean;
    autoDelete: boolean;
    deleteAfterDays?: number;
    whitelistEnabled: boolean;
    blacklistEnabled: boolean;
    notifyOnQuarantine: boolean;
    customRules?: SpamRule[];
    threshold?: number;
}
/**
 * Whitelist entry
 */
export interface WhitelistEntry {
    type: 'email' | 'domain' | 'ip' | 'asn';
    value: string;
    userId?: string;
    global: boolean;
    expiresAt?: Date;
    addedBy?: string;
    reason?: string;
}
/**
 * Blacklist entry
 */
export interface BlacklistEntry {
    type: 'email' | 'domain' | 'ip' | 'url' | 'hash';
    value: string;
    category: 'spam' | 'phishing' | 'malware' | 'botnet' | 'other';
    severity: 'low' | 'medium' | 'high' | 'critical';
    source: string;
    global: boolean;
    expiresAt?: Date;
    addedBy?: string;
    reason?: string;
}
/**
 * Quarantined message
 */
export interface QuarantinedMessage {
    id: string;
    messageId: string;
    userId: string;
    from: string;
    to: string;
    subject: string;
    quarantineReason: string;
    spamScore: number;
    quarantinedAt: Date;
    expiresAt: Date;
    status: 'quarantined' | 'released' | 'deleted';
    releasedAt?: Date;
    deletedAt?: Date;
    message?: EmailMessage;
}
/**
 * Spam report
 */
export interface SpamReport {
    reportId: string;
    messageId: string;
    reportedBy: string;
    reportedAt: Date;
    reportType: 'spam' | 'phishing' | 'malware' | 'not-spam';
    comment?: string;
    processed: boolean;
    action?: string;
}
/**
 * Spam statistics
 */
export interface SpamStatistics {
    totalProcessed: number;
    spamDetected: number;
    hamDetected: number;
    quarantined: number;
    rejected: number;
    falsePositives: number;
    falseNegatives: number;
    accuracy?: number;
    period: {
        start: Date;
        end: Date;
    };
}
/**
 * Spam rule model
 */
export interface ISpamRule extends Model {
    id: string;
    name: string;
    description?: string;
    type: string;
    enabled: boolean;
    priority: number;
    conditionJson: any;
    actionJson: any;
    scoreModifier?: number;
    hitCount: number;
    lastHitAt?: Date;
    metadata?: any;
    createdBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Bayesian token model
 */
export interface IBayesianToken extends Model {
    id: string;
    token: string;
    tokenHash: string;
    spamCount: number;
    hamCount: number;
    spamProbability: number;
    totalCount: number;
    lastUpdated: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Whitelist model
 */
export interface IWhitelist extends Model {
    id: string;
    type: string;
    value: string;
    valueHash: string;
    userId?: string;
    global: boolean;
    expiresAt?: Date;
    addedBy?: string;
    reason?: string;
    hitCount: number;
    lastHitAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Blacklist model
 */
export interface IBlacklist extends Model {
    id: string;
    type: string;
    value: string;
    valueHash: string;
    category: string;
    severity: string;
    source: string;
    global: boolean;
    expiresAt?: Date;
    addedBy?: string;
    reason?: string;
    hitCount: number;
    lastHitAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Quarantine model
 */
export interface IQuarantine extends Model {
    id: string;
    messageId: string;
    userId: string;
    fromAddress: string;
    toAddress: string;
    subject: string;
    quarantineReason: string;
    spamScore: number;
    messageData: any;
    status: string;
    quarantinedAt: Date;
    expiresAt: Date;
    releasedAt?: Date;
    releasedBy?: string;
    deletedAt?: Date;
    deletedBy?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Spam report model
 */
export interface ISpamReport extends Model {
    id: string;
    messageId: string;
    reportedBy: string;
    reportType: string;
    comment?: string;
    processed: boolean;
    processedAt?: Date;
    action?: string;
    metadata?: any;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * User spam preferences model
 */
export interface IUserSpamPreferences extends Model {
    id: string;
    userId: string;
    aggressiveness: string;
    autoQuarantine: boolean;
    autoDelete: boolean;
    deleteAfterDays?: number;
    whitelistEnabled: boolean;
    blacklistEnabled: boolean;
    notifyOnQuarantine: boolean;
    customRulesJson?: any;
    threshold?: number;
    metadata?: any;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Spam statistics model
 */
export interface ISpamStatistics extends Model {
    id: string;
    date: Date;
    totalProcessed: number;
    spamDetected: number;
    hamDetected: number;
    quarantined: number;
    rejected: number;
    falsePositives: number;
    falseNegatives: number;
    accuracy?: number;
    metadata?: any;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Defines the spam rule model
 * @param sequelize - Sequelize instance
 * @returns Spam rule model
 * @example
 * const SpamRule = defineSpamRuleModel(sequelize);
 */
export declare function defineSpamRuleModel(sequelize: Sequelize): ModelStatic<ISpamRule>;
/**
 * Defines the Bayesian token model
 * @param sequelize - Sequelize instance
 * @returns Bayesian token model
 * @example
 * const BayesianToken = defineBayesianTokenModel(sequelize);
 */
export declare function defineBayesianTokenModel(sequelize: Sequelize): ModelStatic<IBayesianToken>;
/**
 * Defines the whitelist model
 * @param sequelize - Sequelize instance
 * @returns Whitelist model
 * @example
 * const Whitelist = defineWhitelistModel(sequelize);
 */
export declare function defineWhitelistModel(sequelize: Sequelize): ModelStatic<IWhitelist>;
/**
 * Defines the blacklist model
 * @param sequelize - Sequelize instance
 * @returns Blacklist model
 * @example
 * const Blacklist = defineBlacklistModel(sequelize);
 */
export declare function defineBlacklistModel(sequelize: Sequelize): ModelStatic<IBlacklist>;
/**
 * Defines the quarantine model
 * @param sequelize - Sequelize instance
 * @returns Quarantine model
 * @example
 * const Quarantine = defineQuarantineModel(sequelize);
 */
export declare function defineQuarantineModel(sequelize: Sequelize): ModelStatic<IQuarantine>;
/**
 * Defines the spam report model
 * @param sequelize - Sequelize instance
 * @returns Spam report model
 * @example
 * const SpamReport = defineSpamReportModel(sequelize);
 */
export declare function defineSpamReportModel(sequelize: Sequelize): ModelStatic<ISpamReport>;
/**
 * Defines the user spam preferences model
 * @param sequelize - Sequelize instance
 * @returns User spam preferences model
 * @example
 * const UserSpamPreferences = defineUserSpamPreferencesModel(sequelize);
 */
export declare function defineUserSpamPreferencesModel(sequelize: Sequelize): ModelStatic<IUserSpamPreferences>;
/**
 * Defines the spam statistics model
 * @param sequelize - Sequelize instance
 * @returns Spam statistics model
 * @example
 * const SpamStatistics = defineSpamStatisticsModel(sequelize);
 */
export declare function defineSpamStatisticsModel(sequelize: Sequelize): ModelStatic<ISpamStatistics>;
/**
 * Tokenizes email content for Bayesian analysis
 * @param text - Text content to tokenize
 * @returns Array of tokens
 * @example
 * const tokens = tokenizeEmailContent(email.body);
 */
export declare function tokenizeEmailContent(text: string): string[];
/**
 * Calculates token hash for database storage
 * @param token - Token string
 * @returns SHA256 hash of token
 * @example
 * const hash = calculateTokenHash('viagra');
 */
export declare function calculateTokenHash(token: string): string;
/**
 * Trains Bayesian classifier with spam message
 * @param BayesianTokenModel - Bayesian token model
 * @param message - Email message
 * @param transaction - Optional database transaction
 * @returns Promise that resolves when training is complete
 * @example
 * await trainBayesianSpam(BayesianToken, spamMessage);
 */
export declare function trainBayesianSpam(BayesianTokenModel: ModelStatic<IBayesianToken>, message: EmailMessage, transaction?: Transaction): Promise<void>;
/**
 * Trains Bayesian classifier with ham (non-spam) message
 * @param BayesianTokenModel - Bayesian token model
 * @param message - Email message
 * @param transaction - Optional database transaction
 * @returns Promise that resolves when training is complete
 * @example
 * await trainBayesianHam(BayesianToken, legitimateMessage);
 */
export declare function trainBayesianHam(BayesianTokenModel: ModelStatic<IBayesianToken>, message: EmailMessage, transaction?: Transaction): Promise<void>;
/**
 * Classifies message using Bayesian spam filter
 * @param BayesianTokenModel - Bayesian token model
 * @param message - Email message to classify
 * @returns Bayesian classification result
 * @example
 * const result = await classifyBayesian(BayesianToken, message);
 * console.log(`Spam probability: ${result.spamProbability}`);
 */
export declare function classifyBayesian(BayesianTokenModel: ModelStatic<IBayesianToken>, message: EmailMessage): Promise<BayesianResult>;
/**
 * Parses SPF record
 * @param spfRecord - Raw SPF record string
 * @returns Parsed SPF mechanisms
 * @example
 * const mechanisms = parseSPFRecord('v=spf1 ip4:192.0.2.0/24 -all');
 */
export declare function parseSPFRecord(spfRecord: string): string[];
/**
 * Validates sender IP against SPF record
 * @param domain - Sender domain
 * @param ip - Sender IP address
 * @returns SPF validation result
 * @example
 * const result = await validateSPF('example.com', '192.0.2.1');
 * console.log(`SPF result: ${result.result}`);
 */
export declare function validateSPF(domain: string, ip: string): Promise<SPFResult>;
/**
 * Checks if IP matches CIDR range
 * @param ip - IP address
 * @param range - CIDR range
 * @returns True if IP is in range
 * @example
 * const matches = ipMatchesRange('192.0.2.10', '192.0.2.0/24');
 */
export declare function ipMatchesRange(ip: string, range: string): boolean;
/**
 * Extracts DKIM signature from headers
 * @param headers - Email headers
 * @returns Array of DKIM signature objects
 * @example
 * const signatures = extractDKIMSignatures(message.headers);
 */
export declare function extractDKIMSignatures(headers: Record<string, string | string[]>): Array<{
    domain: string;
    selector: string;
    algorithm: string;
    headers: string[];
    signature: string;
}>;
/**
 * Verifies DKIM signature
 * @param message - Email message
 * @returns DKIM verification result
 * @example
 * const result = await verifyDKIM(message);
 * console.log(`DKIM valid: ${result.valid}`);
 */
export declare function verifyDKIM(message: EmailMessage): Promise<DKIMResult>;
/**
 * Retrieves DMARC policy for domain
 * @param domain - Email domain
 * @returns DMARC policy result
 * @example
 * const result = await getDMARCPolicy('example.com');
 * console.log(`DMARC policy: ${result.policy}`);
 */
export declare function getDMARCPolicy(domain: string): Promise<DMARCResult>;
/**
 * Enforces DMARC policy
 * @param spfResult - SPF validation result
 * @param dkimResult - DKIM verification result
 * @param dmarcResult - DMARC policy
 * @returns Updated DMARC result with alignment
 * @example
 * const enforcedPolicy = enforceDMARCPolicy(spfResult, dkimResult, dmarcPolicy);
 */
export declare function enforceDMARCPolicy(spfResult: SPFResult, dkimResult: DKIMResult, dmarcResult: DMARCResult): DMARCResult;
/**
 * Default RBL/DNSBL servers
 */
export declare const DEFAULT_RBL_SERVERS: string[];
/**
 * Checks IP against RBL/DNSBL servers
 * @param ip - IP address to check
 * @param rblServers - Array of RBL server domains
 * @returns RBL check result
 * @example
 * const result = await checkRBL('192.0.2.1');
 * console.log(`IP listed: ${result.listed}`);
 */
export declare function checkRBL(ip: string, rblServers?: string[]): Promise<RBLResult>;
/**
 * Checks IP reputation
 * @param ip - IP address
 * @returns Reputation score (0-100, higher is better)
 * @example
 * const reputation = await checkIPReputation('192.0.2.1');
 */
export declare function checkIPReputation(ip: string): Promise<number>;
/**
 * Common spam patterns
 */
export declare const SPAM_PATTERNS: RegExp[];
/**
 * Phishing indicators
 */
export declare const PHISHING_PATTERNS: RegExp[];
/**
 * Analyzes email content for spam indicators
 * @param message - Email message
 * @returns Content analysis result
 * @example
 * const analysis = analyzeEmailContent(message);
 * console.log(`Suspicious patterns: ${analysis.suspiciousPatterns.length}`);
 */
export declare function analyzeEmailContent(message: EmailMessage): ContentAnalysisResult;
/**
 * Calculates HTML complexity score
 * @param html - HTML content
 * @returns Complexity score (0-100)
 * @example
 * const complexity = calculateHTMLComplexity(message.body);
 */
export declare function calculateHTMLComplexity(html: string): number;
/**
 * Extracts URLs from email content
 * @param text - Email body
 * @returns Array of extracted URLs
 * @example
 * const urls = extractURLsFromEmail(message.body);
 */
export declare function extractURLsFromEmail(text: string): string[];
/**
 * Checks URLs against blacklist
 * @param BlacklistModel - Blacklist model
 * @param urls - Array of URLs to check
 * @returns URL analysis result
 * @example
 * const result = await checkURLBlacklist(Blacklist, urls);
 */
export declare function checkURLBlacklist(BlacklistModel: ModelStatic<IBlacklist>, urls: string[]): Promise<URLAnalysisResult>;
/**
 * Calculates overall spam score
 * @param analysisResult - Spam analysis result
 * @returns Spam score (0-100)
 * @example
 * const score = calculateSpamScore(analysisResult);
 */
export declare function calculateSpamScore(analysisResult: SpamAnalysisResult): number;
/**
 * Determines spam action based on score
 * @param score - Spam score
 * @param threshold - User threshold
 * @returns Recommended action
 * @example
 * const action = determineSpamAction(score, 50);
 */
export declare function determineSpamAction(score: number, threshold?: number): SpamAction;
/**
 * Adds entry to whitelist
 * @param WhitelistModel - Whitelist model
 * @param entry - Whitelist entry
 * @param transaction - Optional database transaction
 * @returns Created whitelist entry
 * @example
 * await addToWhitelist(Whitelist, { type: 'email', value: 'user@example.com', global: false });
 */
export declare function addToWhitelist(WhitelistModel: ModelStatic<IWhitelist>, entry: WhitelistEntry, transaction?: Transaction): Promise<IWhitelist>;
/**
 * Adds entry to blacklist
 * @param BlacklistModel - Blacklist model
 * @param entry - Blacklist entry
 * @param transaction - Optional database transaction
 * @returns Created blacklist entry
 * @example
 * await addToBlacklist(Blacklist, { type: 'email', value: 'spam@example.com', category: 'spam', severity: 'high', source: 'manual', global: true });
 */
export declare function addToBlacklist(BlacklistModel: ModelStatic<IBlacklist>, entry: BlacklistEntry, transaction?: Transaction): Promise<IBlacklist>;
/**
 * Checks if email address is whitelisted
 * @param WhitelistModel - Whitelist model
 * @param email - Email address
 * @param userId - Optional user ID
 * @returns True if whitelisted
 * @example
 * const isWhitelisted = await isEmailWhitelisted(Whitelist, 'user@example.com', userId);
 */
export declare function isEmailWhitelisted(WhitelistModel: ModelStatic<IWhitelist>, email: string, userId?: string): Promise<boolean>;
/**
 * Checks if email address is blacklisted
 * @param BlacklistModel - Blacklist model
 * @param email - Email address
 * @returns Blacklist entry if found, null otherwise
 * @example
 * const blacklisted = await isEmailBlacklisted(Blacklist, 'spam@example.com');
 */
export declare function isEmailBlacklisted(BlacklistModel: ModelStatic<IBlacklist>, email: string): Promise<IBlacklist | null>;
/**
 * Removes entry from whitelist
 * @param WhitelistModel - Whitelist model
 * @param id - Whitelist entry ID
 * @returns True if removed successfully
 * @example
 * await removeFromWhitelist(Whitelist, 'entry-id');
 */
export declare function removeFromWhitelist(WhitelistModel: ModelStatic<IWhitelist>, id: string): Promise<boolean>;
/**
 * Removes entry from blacklist
 * @param BlacklistModel - Blacklist model
 * @param id - Blacklist entry ID
 * @returns True if removed successfully
 * @example
 * await removeFromBlacklist(Blacklist, 'entry-id');
 */
export declare function removeFromBlacklist(BlacklistModel: ModelStatic<IBlacklist>, id: string): Promise<boolean>;
/**
 * Gets user spam preferences
 * @param UserSpamPreferencesModel - User spam preferences model
 * @param userId - User ID
 * @returns User spam preferences
 * @example
 * const prefs = await getUserSpamPreferences(UserSpamPreferences, userId);
 */
export declare function getUserSpamPreferences(UserSpamPreferencesModel: ModelStatic<IUserSpamPreferences>, userId: string): Promise<UserSpamPreferences>;
/**
 * Updates user spam preferences
 * @param UserSpamPreferencesModel - User spam preferences model
 * @param userId - User ID
 * @param preferences - Updated preferences
 * @returns Updated preferences
 * @example
 * await updateUserSpamPreferences(UserSpamPreferences, userId, { aggressiveness: 'high', threshold: 40 });
 */
export declare function updateUserSpamPreferences(UserSpamPreferencesModel: ModelStatic<IUserSpamPreferences>, userId: string, preferences: Partial<UserSpamPreferences>): Promise<UserSpamPreferences>;
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
export declare function quarantineMessage(QuarantineModel: ModelStatic<IQuarantine>, message: EmailMessage, userId: string, reason: string, spamScore: number, expiryDays?: number, transaction?: Transaction): Promise<IQuarantine>;
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
export declare function getQuarantinedMessages(QuarantineModel: ModelStatic<IQuarantine>, userId: string, status?: 'quarantined' | 'released' | 'deleted', limit?: number, offset?: number): Promise<QuarantinedMessage[]>;
/**
 * Releases message from quarantine
 * @param QuarantineModel - Quarantine model
 * @param quarantineId - Quarantine entry ID
 * @param releasedBy - User ID who released the message
 * @returns Released message
 * @example
 * const message = await releaseQuarantinedMessage(Quarantine, 'quarantine-id', userId);
 */
export declare function releaseQuarantinedMessage(QuarantineModel: ModelStatic<IQuarantine>, quarantineId: string, releasedBy: string): Promise<EmailMessage | null>;
/**
 * Deletes message from quarantine
 * @param QuarantineModel - Quarantine model
 * @param quarantineId - Quarantine entry ID
 * @param deletedBy - User ID who deleted the message
 * @returns True if deleted successfully
 * @example
 * await deleteQuarantinedMessage(Quarantine, 'quarantine-id', userId);
 */
export declare function deleteQuarantinedMessage(QuarantineModel: ModelStatic<IQuarantine>, quarantineId: string, deletedBy: string): Promise<boolean>;
/**
 * Purges expired quarantined messages
 * @param QuarantineModel - Quarantine model
 * @returns Number of messages purged
 * @example
 * const count = await purgeExpiredQuarantineMessages(Quarantine);
 */
export declare function purgeExpiredQuarantineMessages(QuarantineModel: ModelStatic<IQuarantine>): Promise<number>;
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
export declare function reportSpam(SpamReportModel: ModelStatic<ISpamReport>, BayesianTokenModel: ModelStatic<IBayesianToken>, messageId: string, reportedBy: string, reportType: 'spam' | 'phishing' | 'malware' | 'not-spam', message?: EmailMessage, comment?: string): Promise<ISpamReport>;
/**
 * Processes pending spam reports
 * @param SpamReportModel - Spam report model
 * @param limit - Maximum number to process
 * @returns Number of reports processed
 * @example
 * const processed = await processPendingSpamReports(SpamReport);
 */
export declare function processPendingSpamReports(SpamReportModel: ModelStatic<ISpamReport>, limit?: number): Promise<number>;
/**
 * Records spam detection statistics
 * @param SpamStatisticsModel - Spam statistics model
 * @param date - Date for statistics
 * @param stats - Statistics to record
 * @returns Updated statistics
 * @example
 * await recordSpamStatistics(SpamStatistics, new Date(), { totalProcessed: 100, spamDetected: 25, hamDetected: 75 });
 */
export declare function recordSpamStatistics(SpamStatisticsModel: ModelStatic<ISpamStatistics>, date: Date, stats: Partial<SpamStatistics>): Promise<ISpamStatistics>;
/**
 * Gets spam statistics for date range
 * @param SpamStatisticsModel - Spam statistics model
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Array of statistics
 * @example
 * const stats = await getSpamStatistics(SpamStatistics, startDate, endDate);
 */
export declare function getSpamStatistics(SpamStatisticsModel: ModelStatic<ISpamStatistics>, startDate: Date, endDate: Date): Promise<SpamStatistics[]>;
/**
 * Performs comprehensive spam analysis on email message
 * @param models - Object containing all required models
 * @param message - Email message to analyze
 * @param userId - User ID
 * @returns Complete spam analysis result
 * @example
 * const result = await analyzeSpam({ BayesianToken, Whitelist, Blacklist, UserSpamPreferences }, message, userId);
 */
export declare function analyzeSpam(models: {
    BayesianToken: ModelStatic<IBayesianToken>;
    Whitelist: ModelStatic<IWhitelist>;
    Blacklist: ModelStatic<IBlacklist>;
    UserSpamPreferences: ModelStatic<IUserSpamPreferences>;
}, message: EmailMessage, userId: string): Promise<SpamAnalysisResult>;
/**
 * Swagger schema for EmailMessage
 * @example
 * @ApiProperty(emailMessageSwaggerSchema)
 */
export declare const emailMessageSwaggerSchema: {
    type: string;
    properties: {
        messageId: {
            type: string;
            description: string;
        };
        from: {
            type: string;
            properties: {
                name: {
                    type: string;
                };
                address: {
                    type: string;
                    format: string;
                };
                domain: {
                    type: string;
                };
            };
        };
        to: {
            type: string;
            items: {
                type: string;
                properties: {
                    name: {
                        type: string;
                    };
                    address: {
                        type: string;
                        format: string;
                    };
                    domain: {
                        type: string;
                    };
                };
            };
        };
        subject: {
            type: string;
        };
        body: {
            type: string;
        };
        headers: {
            type: string;
        };
        receivedDate: {
            type: string;
            format: string;
        };
        sourceIp: {
            type: string;
        };
    };
    required: string[];
};
/**
 * Swagger schema for SpamAnalysisResult
 * @example
 * @ApiResponse({ schema: spamAnalysisResultSwaggerSchema })
 */
export declare const spamAnalysisResultSwaggerSchema: {
    type: string;
    properties: {
        isSpam: {
            type: string;
            description: string;
        };
        spamScore: {
            type: string;
            description: string;
        };
        confidence: {
            type: string;
            description: string;
        };
        reasons: {
            type: string;
            items: {
                type: string;
                properties: {
                    category: {
                        type: string;
                    };
                    description: {
                        type: string;
                    };
                    severity: {
                        type: string;
                        enum: string[];
                    };
                    score: {
                        type: string;
                    };
                };
            };
        };
        actions: {
            type: string;
            items: {
                type: string;
                properties: {
                    action: {
                        type: string;
                        enum: string[];
                    };
                    priority: {
                        type: string;
                    };
                    reason: {
                        type: string;
                    };
                };
            };
        };
        filterResults: {
            type: string;
        };
    };
};
/**
 * Swagger schema for UserSpamPreferences
 * @example
 * @ApiProperty(userSpamPreferencesSwaggerSchema)
 */
export declare const userSpamPreferencesSwaggerSchema: {
    type: string;
    properties: {
        userId: {
            type: string;
            format: string;
        };
        aggressiveness: {
            type: string;
            enum: string[];
        };
        autoQuarantine: {
            type: string;
        };
        autoDelete: {
            type: string;
        };
        deleteAfterDays: {
            type: string;
        };
        whitelistEnabled: {
            type: string;
        };
        blacklistEnabled: {
            type: string;
        };
        notifyOnQuarantine: {
            type: string;
        };
        threshold: {
            type: string;
            minimum: number;
            maximum: number;
        };
    };
};
/**
 * Swagger schema for QuarantinedMessage
 * @example
 * @ApiResponse({ schema: quarantinedMessageSwaggerSchema })
 */
export declare const quarantinedMessageSwaggerSchema: {
    type: string;
    properties: {
        id: {
            type: string;
            format: string;
        };
        messageId: {
            type: string;
        };
        userId: {
            type: string;
            format: string;
        };
        from: {
            type: string;
            format: string;
        };
        to: {
            type: string;
            format: string;
        };
        subject: {
            type: string;
        };
        quarantineReason: {
            type: string;
        };
        spamScore: {
            type: string;
        };
        quarantinedAt: {
            type: string;
            format: string;
        };
        expiresAt: {
            type: string;
            format: string;
        };
        status: {
            type: string;
            enum: string[];
        };
    };
};
//# sourceMappingURL=mail-spam-filtering-kit.d.ts.map