/**
 * Wire Transfer Monitoring Kit
 * Enterprise-grade compliance and risk monitoring for international wire transfers
 *
 * Covers: SWIFT parsing, beneficiary/originator screening, Travel Rule compliance,
 * cross-border detection, sanctions filtering, wire stripping, incomplete info,
 * structured patterns, high-value alerts, velocity monitoring, sequential detection,
 * clustering, OFAC 50% rule, and recordkeeping.
 *
 * @module reuse/financial/wire-transfer-monitoring-kit
 */
interface SWIFTMessage {
    readonly messageType: string;
    readonly senderBIC: string;
    readonly receiverBIC: string;
    readonly messageId: string;
    readonly timestamp: Date;
    readonly instructionCode: string;
    readonly currency: string;
    readonly amount: number;
    readonly originatorAccount?: string;
    readonly beneficiaryAccount?: string;
    readonly originatorName?: string;
    readonly beneficiaryName?: string;
    readonly originatorAddress?: string;
    readonly beneficiaryAddress?: string;
    readonly intermediaryBank?: string;
    readonly purpose?: string;
    readonly rawMessage: string;
}
interface ScreeningResult {
    readonly isRisky: boolean;
    readonly riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    readonly reasons: readonly string[];
    readonly matchedEntities?: readonly MatchedEntity[];
    readonly confidenceScore: number;
}
interface MatchedEntity {
    readonly name: string;
    readonly type: 'SANCTIONED' | 'PEP' | 'WATCHLIST' | 'INTERNAL_BLOCK';
    readonly jurisdiction: string;
    readonly matchScore: number;
    readonly lastUpdated: Date;
}
interface TravelRuleData {
    readonly originatorName: string;
    readonly originatorAddress: string;
    readonly originatorAccountNumber: string;
    readonly beneficiaryName: string;
    readonly beneficiaryAddress: string;
    readonly beneficiaryAccountNumber: string;
    readonly amount: number;
    readonly currency: string;
    readonly orderingCustomer: string;
    readonly beneficiaryCustomer: string;
}
interface CrossBorderIndicators {
    readonly isInternational: boolean;
    readonly originCountry: string;
    readonly destinationCountry: string;
    readonly riskCountries: readonly string[];
    readonly requiresFilingThreshold: boolean;
}
interface WireStrippingIndicators {
    readonly isStrippingRisk: boolean;
    readonly missingOriginatorInfo: string[];
    readonly missingBeneficiaryInfo: string[];
    readonly obfuscationPatterns: readonly string[];
    readonly severity: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
}
interface VelocityMetrics {
    readonly transactionCount: number;
    readonly totalAmount: number;
    readonly timeWindowMinutes: number;
    readonly isAnomalous: boolean;
    readonly exceededThresholds: readonly string[];
}
interface SequentialPattern {
    readonly chainLength: number;
    readonly startAmount: number;
    readonly endAmount: number;
    readonly totalAmount: number;
    readonly timeSpan: number;
    readonly isSequential: boolean;
    readonly confidence: number;
}
interface ClusteringAnalysis {
    readonly clusterId: string;
    readonly clusterSize: number;
    readonly commonPatterns: readonly string[];
    readonly riskScore: number;
    readonly isSuspicious: boolean;
}
interface OFACRuleAnalysis {
    readonly directMatch: boolean;
    readonly fiftyPercentMatch: boolean;
    readonly entityName: string;
    readonly matchingCriteria: readonly string[];
    readonly actionRequired: 'NONE' | 'REVIEW' | 'BLOCK' | 'FILE_SAR';
}
interface RecordKeepingEntry {
    readonly transactionId: string;
    readonly timestamp: Date;
    readonly originAccount: string;
    readonly destinationAccount: string;
    readonly amount: number;
    readonly currency: string;
    readonly originatorName: string;
    readonly beneficiaryName: string;
    readonly purpose: string;
    readonly screeningResults: ScreeningResult;
    readonly complianceFlags: readonly string[];
    readonly auditTrail: readonly AuditLog[];
}
interface AuditLog {
    readonly action: string;
    readonly timestamp: Date;
    readonly actor: string;
    readonly details: string;
}
/**
 * Parse a raw SWIFT message into structured format
 *
 * @param rawMessage - The raw SWIFT MT103/MT202 message
 * @returns Parsed SWIFT message structure
 * @throws Error if message format is invalid
 */
export declare function parseSWIFTMessage(rawMessage: string): SWIFTMessage;
/**
 * Extract specific SWIFT field from message
 *
 * @param lines - Parsed message lines
 * @param fieldTag - SWIFT tag to extract
 * @param subField - Sub-field identifier
 * @returns Extracted field value or null
 */
export declare function extractSWIFTField(lines: readonly string[], fieldTag: string, subField: string): string | null;
/**
 * Validate SWIFT message structure
 *
 * @param message - SWIFT message object
 * @returns Validation result with error messages
 */
export declare function validateSWIFTStructure(message: SWIFTMessage): {
    readonly isValid: boolean;
    readonly errors: readonly string[];
};
/**
 * Parse SWIFT timestamp format
 *
 * @param timestamp - SWIFT formatted timestamp (YYMMDDHHmm)
 * @returns Parsed date object
 */
export declare function parseSWIFTTimestamp(timestamp: string): Date;
/**
 * Extract SWIFT message field segments
 *
 * @param swiftMessage - Raw SWIFT message text
 * @returns Map of field tags to values
 */
export declare function extractSWIFTSegments(swiftMessage: string): Map<string, string>;
/**
 * Screen beneficiary against sanctions lists
 *
 * @param beneficiaryName - Name of beneficiary
 * @param beneficiaryAddress - Address of beneficiary
 * @param beneficiaryCountry - Country of beneficiary
 * @param sanctionsList - List of sanctioned entities
 * @returns Screening result
 */
export declare function screenBeneficiary(beneficiaryName: string, beneficiaryAddress: string, beneficiaryCountry: string, sanctionsList: readonly MatchedEntity[]): ScreeningResult;
/**
 * Screen originator against sanctions lists
 *
 * @param originatorName - Name of originator
 * @param originatorAddress - Address of originator
 * @param originatorCountry - Country of originator
 * @param sanctionsList - List of sanctioned entities
 * @returns Screening result
 */
export declare function screenOriginator(originatorName: string, originatorAddress: string, originatorCountry: string, sanctionsList: readonly MatchedEntity[]): ScreeningResult;
/**
 * Normalize entity name for comparison
 *
 * @param name - Entity name to normalize
 * @returns Normalized name
 */
export declare function normalizeEntityName(name: string): string;
/**
 * Calculate similarity between two names
 *
 * @param name1 - First name
 * @param name2 - Second name
 * @returns Similarity score 0-1
 */
export declare function calculateNameSimilarity(name1: string, name2: string): number;
/**
 * Calculate Levenshtein distance between two strings
 *
 * @param s1 - First string
 * @param s2 - Second string
 * @returns Distance metric
 */
export declare function levenshteinDistance(s1: string, s2: string): number;
/**
 * Screen recipient account against patterns
 *
 * @param accountNumber - Recipient account number
 * @param bankCode - Bank code
 * @param blocklistAccounts - Blocked account patterns
 * @returns Whether account is blocked
 */
export declare function screenRecipientAccount(accountNumber: string, bankCode: string, blocklistAccounts: readonly string[]): boolean;
/**
 * Validate Travel Rule compliance data
 *
 * @param data - Travel Rule data to validate
 * @param threshold - Amount threshold (e.g., $3000)
 * @returns Validation result
 */
export declare function validateTravelRuleCompliance(data: TravelRuleData, threshold?: number): {
    readonly isCompliant: boolean;
    readonly missingFields: readonly string[];
    readonly requiresFilingThreshold: boolean;
};
/**
 * Extract Travel Rule data from SWIFT message
 *
 * @param swiftMessage - Parsed SWIFT message
 * @returns Travel Rule data structure
 */
export declare function extractTravelRuleData(swiftMessage: SWIFTMessage): TravelRuleData;
/**
 * Check if Travel Rule chain is complete
 *
 * @param intermediaryChain - Intermediary bank chain
 * @param minimumChainElements - Minimum expected elements
 * @returns Whether chain is complete
 */
export declare function validateTravelRuleChain(intermediaryChain: readonly string[], minimumChainElements?: number): boolean;
/**
 * Generate Travel Rule filing for cross-border transfer
 *
 * @param data - Travel Rule data
 * @param jurisdiction - Regulatory jurisdiction
 * @returns Filing record
 */
export declare function generateTravelRuleFiling(data: TravelRuleData, jurisdiction: string): {
    readonly filingId: string;
    readonly timestamp: Date;
    readonly data: TravelRuleData;
    readonly jurisdiction: string;
};
/**
 * Detect cross-border transfer indicators
 *
 * @param originCountry - Origin country code
 * @param destinationCountry - Destination country code
 * @param riskCountries - List of high-risk countries
 * @param highValueThreshold - Amount threshold for high-value flag
 * @param amount - Transfer amount
 * @returns Cross-border indicators
 */
export declare function detectCrossBorderTransfer(originCountry: string, destinationCountry: string, riskCountries: readonly string[], highValueThreshold: number, amount: number): CrossBorderIndicators;
/**
 * Identify originating country from bank code
 *
 * @param senderBIC - SWIFT BIC code of sending bank
 * @returns Country code (ISO 3166-1 alpha-2)
 */
export declare function identifyOriginCountry(senderBIC: string): string;
/**
 * Identify destination country from bank code
 *
 * @param receiverBIC - SWIFT BIC code of receiving bank
 * @returns Country code (ISO 3166-1 alpha-2)
 */
export declare function identifyDestinationCountry(receiverBIC: string): string;
/**
 * Apply comprehensive sanctions filtering
 *
 * @param transaction - Transaction details
 * @param sanctionsList - List of sanctioned entities
 * @param pepList - List of PEPs
 * @returns Screening result
 */
export declare function applySanctionsFilter(transaction: {
    readonly originatorName: string;
    readonly beneficiaryName: string;
    readonly amount: number;
    readonly originCountry: string;
    readonly destinationCountry: string;
}, sanctionsList: readonly MatchedEntity[], pepList: readonly MatchedEntity[]): ScreeningResult;
/**
 * Filter transaction against consolidated sanctions list
 *
 * @param transactionId - Transaction identifier
 * @param recipientName - Name of transaction recipient
 * @param consolidatedList - Consolidated sanctions database
 * @returns Whether transaction passes filter
 */
export declare function filterConsolidatedSanctions(transactionId: string, recipientName: string, consolidatedList: readonly MatchedEntity[]): boolean;
/**
 * Check entity against multiple lists (OFAC, EU, UN)
 *
 * @param entityName - Entity name to check
 * @param lists - Map of list names to entities
 * @returns Matches across all lists
 */
export declare function checkMultipleSanctionsList(entityName: string, lists: ReadonlyMap<string, readonly MatchedEntity[]>): Map<string, MatchedEntity[]>;
/**
 * Detect wire stripping and information removal patterns
 *
 * @param swiftMessage - Parsed SWIFT message
 * @returns Wire stripping indicators
 */
export declare function detectWireStripping(swiftMessage: SWIFTMessage): WireStrippingIndicators;
/**
 * Check if string contains obfuscation indicators
 *
 * @param text - Text to analyze
 * @returns Whether obfuscation is detected
 */
export declare function isObfuscated(text: string): boolean;
/**
 * Validate information completeness for transaction
 *
 * @param message - SWIFT message
 * @param minimumRequired - Minimum required fields
 * @returns Completeness assessment
 */
export declare function validateInformationCompleteness(message: SWIFTMessage, minimumRequired?: number): {
    readonly isComplete: boolean;
    readonly completenessScore: number;
    readonly missingFields: readonly string[];
};
/**
 * Detect missing required information
 *
 * @param transaction - Transaction data
 * @returns Missing fields and severity
 */
export declare function detectIncompleteInformation(transaction: {
    readonly originatorName?: string;
    readonly originatorAddress?: string;
    readonly originatorAccountNumber?: string;
    readonly beneficiaryName?: string;
    readonly beneficiaryAddress?: string;
    readonly beneficiaryAccountNumber?: string;
    readonly amount?: number;
    readonly currency?: string;
    readonly purpose?: string;
}): {
    readonly hasIncompleteInfo: boolean;
    readonly missingFields: readonly string[];
    readonly riskSeverity: string;
};
/**
 * Identify structured payment patterns
 *
 * @param transactions - Array of transactions
 * @param timeWindowDays - Time window for pattern detection
 * @returns Identified patterns
 */
export declare function identifyStructuredPatterns(transactions: readonly {
    readonly amount: number;
    readonly timestamp: Date;
    readonly originatorName: string;
    readonly beneficiaryName: string;
}[], timeWindowDays?: number): {
    readonly hasStructuredPattern: boolean;
    readonly patterns: readonly {
        readonly type: string;
        readonly count: number;
        readonly totalAmount: number;
        readonly confidence: number;
    }[];
};
/**
 * Analyze transaction for round-number pattern
 *
 * @param amount - Transaction amount
 * @param threshold - Threshold for "just-below" detection (e.g., 10000)
 * @returns Pattern analysis
 */
export declare function analyzeRoundNumberPattern(amount: number, threshold?: number): {
    readonly isJustBelowThreshold: boolean;
    readonly distanceFromThreshold: number;
    readonly suspicionLevel: string;
};
/**
 * Flag high-value transactions
 *
 * @param amount - Transaction amount
 * @param highValueThreshold - Threshold for high-value flag
 * @param veryHighValueThreshold - Threshold for very high-value flag
 * @returns High-value alert
 */
export declare function flagHighValueTransaction(amount: number, highValueThreshold?: number, veryHighValueThreshold?: number): {
    readonly isHighValue: boolean;
    readonly isCritical: boolean;
    readonly threshold: number;
    readonly excess: number;
};
/**
 * Monitor transaction velocity for an entity
 *
 * @param transactions - Array of transactions
 * @param timeWindowMinutes - Time window to analyze
 * @param velocityThresholds - Thresholds for count and amount
 * @returns Velocity metrics
 */
export declare function monitorVelocity(transactions: readonly {
    readonly amount: number;
    readonly timestamp: Date;
}[], timeWindowMinutes?: number, velocityThresholds?: {
    readonly countThreshold: number;
    readonly amountThreshold: number;
}): VelocityMetrics;
/**
 * Detect sequential amount pattern (e.g., ascending amounts)
 *
 * @param transactions - Ordered list of transactions
 * @returns Sequential pattern analysis
 */
export declare function detectSequentialPattern(transactions: readonly {
    readonly amount: number;
    readonly timestamp: Date;
}[]): SequentialPattern;
/**
 * Perform transaction clustering for pattern detection
 *
 * @param transactions - Array of transactions
 * @param clusteringStrategy - Strategy for clustering ('amount' | 'destination' | 'originator')
 * @returns Clustering analysis results
 */
export declare function clusterTransactions(transactions: readonly {
    readonly amount: number;
    readonly timestamp: Date;
    readonly originatorName: string;
    readonly beneficiaryName: string;
}[], clusteringStrategy?: 'amount' | 'destination' | 'originator'): readonly ClusteringAnalysis[];
/**
 * Identify related transactions for investigation
 *
 * @param referenceTransaction - Transaction to find related ones
 * @param allTransactions - All available transactions
 * @param relationshipThreshold - Similarity threshold 0-1
 * @returns Related transactions
 */
export declare function identifyRelatedTransactions(referenceTransaction: {
    readonly originatorName: string;
    readonly beneficiaryName: string;
    readonly amount: number;
}, allTransactions: readonly {
    readonly originatorName: string;
    readonly beneficiaryName: string;
    readonly amount: number;
    readonly timestamp: Date;
}[], relationshipThreshold?: number): readonly {
    readonly transaction: typeof allTransactions[0];
    readonly similarity: number;
}[];
/**
 * Apply OFAC 50% rule for entity matching
 *
 * @param entityName - Entity name to check
 * @param sanctionedEntities - List of sanctioned entities
 * @returns OFAC rule analysis
 */
export declare function applyOFAC50PercentRule(entityName: string, sanctionedEntities: readonly MatchedEntity[]): OFACRuleAnalysis;
/**
 * Calculate entity match score under OFAC criteria
 *
 * @param transactionEntity - Entity from transaction
 * @param sanctionedEntity - Entity from sanctions list
 * @returns Match score and reasoning
 */
export declare function calculateOFACMatchScore(transactionEntity: {
    readonly name: string;
    readonly country?: string;
    readonly alternate_names?: readonly string[];
}, sanctionedEntity: MatchedEntity): {
    readonly score: number;
    readonly reasoning: readonly string[];
    readonly matchLevel: 'DIRECT' | 'FIFTY_PERCENT' | 'PARTIAL' | 'NONE';
};
/**
 * Create compliance record for transaction
 *
 * @param transaction - Transaction details
 * @param screeningResults - Results from screening
 * @param complianceFlags - Any compliance flags raised
 * @returns Record keeping entry
 */
export declare function createComplianceRecord(transaction: {
    readonly transactionId: string;
    readonly timestamp: Date;
    readonly originatorName: string;
    readonly originatorAccount: string;
    readonly beneficiaryName: string;
    readonly beneficiaryAccount: string;
    readonly amount: number;
    readonly currency: string;
    readonly purpose?: string;
}, screeningResults: ScreeningResult, complianceFlags: readonly string[]): RecordKeepingEntry;
/**
 * Update audit trail for compliance record
 *
 * @param record - Existing record
 * @param action - Action performed
 * @param actor - User/system performing action
 * @param details - Action details
 * @returns Updated record
 */
export declare function updateAuditTrail(record: RecordKeepingEntry, action: string, actor: string, details: string): RecordKeepingEntry;
/**
 * Export compliance record for regulatory filing
 *
 * @param record - Record to export
 * @param format - Export format ('JSON' | 'CSV' | 'XML')
 * @returns Exported record as string
 */
export declare function exportComplianceRecord(record: RecordKeepingEntry, format?: 'JSON' | 'CSV' | 'XML'): string;
/**
 * Archive compliance records by date range
 *
 * @param records - Records to archive
 * @param startDate - Archive start date
 * @param endDate - Archive end date
 * @returns Archived records and metadata
 */
export declare function archiveComplianceRecords(records: readonly RecordKeepingEntry[], startDate: Date, endDate: Date): {
    readonly archivedCount: number;
    readonly totalAmount: number;
    readonly riskDistribution: {
        readonly [key: string]: number;
    };
    readonly archiveId: string;
    readonly metadata: {
        readonly startDate: Date;
        readonly endDate: Date;
        readonly createdAt: Date;
    };
};
/**
 * Generate compliance report from records
 *
 * @param records - Records to report on
 * @param reportPeriod - Period for report ('DAILY' | 'WEEKLY' | 'MONTHLY')
 * @returns Compliance report
 */
export declare function generateComplianceReport(records: readonly RecordKeepingEntry[], reportPeriod?: 'DAILY' | 'WEEKLY' | 'MONTHLY'): {
    readonly reportId: string;
    readonly period: string;
    readonly totalTransactions: number;
    readonly totalAmount: number;
    readonly riskBreakdown: {
        readonly [key: string]: number;
    };
    readonly flaggedTransactions: number;
    readonly generatedAt: Date;
};
export {};
//# sourceMappingURL=wire-transfer-monitoring-kit.d.ts.map