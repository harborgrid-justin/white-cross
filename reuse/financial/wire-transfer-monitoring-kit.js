"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSWIFTMessage = parseSWIFTMessage;
exports.extractSWIFTField = extractSWIFTField;
exports.validateSWIFTStructure = validateSWIFTStructure;
exports.parseSWIFTTimestamp = parseSWIFTTimestamp;
exports.extractSWIFTSegments = extractSWIFTSegments;
exports.screenBeneficiary = screenBeneficiary;
exports.screenOriginator = screenOriginator;
exports.normalizeEntityName = normalizeEntityName;
exports.calculateNameSimilarity = calculateNameSimilarity;
exports.levenshteinDistance = levenshteinDistance;
exports.screenRecipientAccount = screenRecipientAccount;
exports.validateTravelRuleCompliance = validateTravelRuleCompliance;
exports.extractTravelRuleData = extractTravelRuleData;
exports.validateTravelRuleChain = validateTravelRuleChain;
exports.generateTravelRuleFiling = generateTravelRuleFiling;
exports.detectCrossBorderTransfer = detectCrossBorderTransfer;
exports.identifyOriginCountry = identifyOriginCountry;
exports.identifyDestinationCountry = identifyDestinationCountry;
exports.applySanctionsFilter = applySanctionsFilter;
exports.filterConsolidatedSanctions = filterConsolidatedSanctions;
exports.checkMultipleSanctionsList = checkMultipleSanctionsList;
exports.detectWireStripping = detectWireStripping;
exports.isObfuscated = isObfuscated;
exports.validateInformationCompleteness = validateInformationCompleteness;
exports.detectIncompleteInformation = detectIncompleteInformation;
exports.identifyStructuredPatterns = identifyStructuredPatterns;
exports.analyzeRoundNumberPattern = analyzeRoundNumberPattern;
exports.flagHighValueTransaction = flagHighValueTransaction;
exports.monitorVelocity = monitorVelocity;
exports.detectSequentialPattern = detectSequentialPattern;
exports.clusterTransactions = clusterTransactions;
exports.identifyRelatedTransactions = identifyRelatedTransactions;
exports.applyOFAC50PercentRule = applyOFAC50PercentRule;
exports.calculateOFACMatchScore = calculateOFACMatchScore;
exports.createComplianceRecord = createComplianceRecord;
exports.updateAuditTrail = updateAuditTrail;
exports.exportComplianceRecord = exportComplianceRecord;
exports.archiveComplianceRecords = archiveComplianceRecords;
exports.generateComplianceReport = generateComplianceReport;
// ============================================================================
// SWIFT PARSING FUNCTIONS (Functions 1-5)
// ============================================================================
/**
 * Parse a raw SWIFT message into structured format
 *
 * @param rawMessage - The raw SWIFT MT103/MT202 message
 * @returns Parsed SWIFT message structure
 * @throws Error if message format is invalid
 */
function parseSWIFTMessage(rawMessage) {
    if (!rawMessage || typeof rawMessage !== 'string') {
        throw new Error('Invalid SWIFT message: must be non-empty string');
    }
    const lines = rawMessage.split('\n').map(line => line.trim());
    const messageType = extractSWIFTField(lines, '0', 'messageType') || 'UNKNOWN';
    const swiftMessage = {
        messageType,
        senderBIC: extractSWIFTField(lines, '1', 'senderBIC') || '',
        receiverBIC: extractSWIFTField(lines, '1', 'receiverBIC') || '',
        messageId: extractSWIFTField(lines, '2', 'messageId') || '',
        timestamp: parseSWIFTTimestamp(extractSWIFTField(lines, '2', 'timestamp') || ''),
        instructionCode: extractSWIFTField(lines, '3', 'instructionCode') || '',
        currency: extractSWIFTField(lines, '32A', 'currency') || 'USD',
        amount: parseCurrency(extractSWIFTField(lines, '32A', 'amount') || '0'),
        originatorAccount: extractSWIFTField(lines, '50', 'originatorAccount'),
        beneficiaryAccount: extractSWIFTField(lines, '59', 'beneficiaryAccount'),
        originatorName: extractSWIFTField(lines, '50', 'originatorName'),
        beneficiaryName: extractSWIFTField(lines, '59', 'beneficiaryName'),
        originatorAddress: extractSWIFTField(lines, '50', 'originatorAddress'),
        beneficiaryAddress: extractSWIFTField(lines, '59', 'beneficiaryAddress'),
        intermediaryBank: extractSWIFTField(lines, '56', 'intermediaryBank'),
        purpose: extractSWIFTField(lines, '70', 'purpose'),
        rawMessage,
    };
    return swiftMessage;
}
/**
 * Extract specific SWIFT field from message
 *
 * @param lines - Parsed message lines
 * @param fieldTag - SWIFT tag to extract
 * @param subField - Sub-field identifier
 * @returns Extracted field value or null
 */
function extractSWIFTField(lines, fieldTag, subField) {
    if (!Array.isArray(lines) || lines.length === 0) {
        return null;
    }
    const pattern = new RegExp(`^${fieldTag}:(.+)$`, 'i');
    const matchedLine = lines.find(line => pattern.test(line));
    if (!matchedLine) {
        return null;
    }
    const match = matchedLine.match(pattern);
    return match?.[1]?.trim() || null;
}
/**
 * Validate SWIFT message structure
 *
 * @param message - SWIFT message object
 * @returns Validation result with error messages
 */
function validateSWIFTStructure(message) {
    const errors = [];
    if (!message.senderBIC || !/^[A-Z0-9]{6,11}$/.test(message.senderBIC)) {
        errors.push('Invalid sender BIC code');
    }
    if (!message.receiverBIC || !/^[A-Z0-9]{6,11}$/.test(message.receiverBIC)) {
        errors.push('Invalid receiver BIC code');
    }
    if (!message.messageType || !['MT103', 'MT202', 'MT300'].includes(message.messageType)) {
        errors.push('Unsupported message type');
    }
    if (message.amount <= 0) {
        errors.push('Invalid or missing transfer amount');
    }
    if (!message.currency || !/^[A-Z]{3}$/.test(message.currency)) {
        errors.push('Invalid currency code');
    }
    return {
        isValid: errors.length === 0,
        errors: errors,
    };
}
/**
 * Parse SWIFT timestamp format
 *
 * @param timestamp - SWIFT formatted timestamp (YYMMDDHHmm)
 * @returns Parsed date object
 */
function parseSWIFTTimestamp(timestamp) {
    if (!timestamp || timestamp.length < 10) {
        return new Date();
    }
    const year = parseInt(timestamp.substring(0, 2), 10);
    const month = parseInt(timestamp.substring(2, 4), 10);
    const day = parseInt(timestamp.substring(4, 6), 10);
    const hours = parseInt(timestamp.substring(6, 8), 10);
    const minutes = parseInt(timestamp.substring(8, 10), 10);
    const fullYear = year < 50 ? 2000 + year : 1900 + year;
    return new Date(fullYear, month - 1, day, hours, minutes);
}
/**
 * Extract SWIFT message field segments
 *
 * @param swiftMessage - Raw SWIFT message text
 * @returns Map of field tags to values
 */
function extractSWIFTSegments(swiftMessage) {
    const segments = new Map();
    if (!swiftMessage) {
        return segments;
    }
    const fieldPattern = /^:([0-9A-Z]+):(.*?)(?=\n:|$)/gm;
    let match;
    while ((match = fieldPattern.exec(swiftMessage)) !== null) {
        const tag = match[1];
        const value = match[2].trim();
        segments.set(tag, value);
    }
    return segments;
}
// ============================================================================
// BENEFICIARY & ORIGINATOR SCREENING (Functions 6-12)
// ============================================================================
/**
 * Screen beneficiary against sanctions lists
 *
 * @param beneficiaryName - Name of beneficiary
 * @param beneficiaryAddress - Address of beneficiary
 * @param beneficiaryCountry - Country of beneficiary
 * @param sanctionsList - List of sanctioned entities
 * @returns Screening result
 */
function screenBeneficiary(beneficiaryName, beneficiaryAddress, beneficiaryCountry, sanctionsList) {
    if (!beneficiaryName || typeof beneficiaryName !== 'string') {
        return {
            isRisky: true,
            riskLevel: 'HIGH',
            reasons: ['Missing or invalid beneficiary name'],
            confidenceScore: 0.95,
        };
    }
    const normalizedName = normalizeEntityName(beneficiaryName);
    const matchedEntities = [];
    let maxConfidence = 0;
    for (const entity of sanctionsList) {
        const similarity = calculateNameSimilarity(normalizedName, normalizeEntityName(entity.name));
        if (similarity > 0.75) {
            matchedEntities.push(entity);
            maxConfidence = Math.max(maxConfidence, similarity);
        }
    }
    const isRisky = matchedEntities.length > 0;
    const riskLevel = isRisky
        ? maxConfidence > 0.95
            ? 'CRITICAL'
            : maxConfidence > 0.85
                ? 'HIGH'
                : 'MEDIUM'
        : 'LOW';
    const reasons = [];
    if (isRisky) {
        reasons.push(`Matched ${matchedEntities.length} sanctioned entit${matchedEntities.length > 1 ? 'ies' : 'y'}`);
    }
    return {
        isRisky,
        riskLevel,
        reasons,
        matchedEntities,
        confidenceScore: maxConfidence,
    };
}
/**
 * Screen originator against sanctions lists
 *
 * @param originatorName - Name of originator
 * @param originatorAddress - Address of originator
 * @param originatorCountry - Country of originator
 * @param sanctionsList - List of sanctioned entities
 * @returns Screening result
 */
function screenOriginator(originatorName, originatorAddress, originatorCountry, sanctionsList) {
    if (!originatorName || typeof originatorName !== 'string') {
        return {
            isRisky: true,
            riskLevel: 'HIGH',
            reasons: ['Missing or invalid originator name'],
            confidenceScore: 0.95,
        };
    }
    const normalizedName = normalizeEntityName(originatorName);
    const matchedEntities = [];
    let maxConfidence = 0;
    for (const entity of sanctionsList) {
        const similarity = calculateNameSimilarity(normalizedName, normalizeEntityName(entity.name));
        if (similarity > 0.70) {
            matchedEntities.push(entity);
            maxConfidence = Math.max(maxConfidence, similarity);
        }
    }
    const isRisky = matchedEntities.length > 0;
    const riskLevel = isRisky
        ? maxConfidence > 0.95
            ? 'CRITICAL'
            : maxConfidence > 0.85
                ? 'HIGH'
                : 'MEDIUM'
        : 'LOW';
    const reasons = [];
    if (isRisky) {
        reasons.push(`Originator matched ${matchedEntities.length} entity list entit${matchedEntities.length > 1 ? 'ies' : 'y'}`);
    }
    return {
        isRisky,
        riskLevel,
        reasons,
        matchedEntities,
        confidenceScore: maxConfidence,
    };
}
/**
 * Normalize entity name for comparison
 *
 * @param name - Entity name to normalize
 * @returns Normalized name
 */
function normalizeEntityName(name) {
    if (!name || typeof name !== 'string') {
        return '';
    }
    return name
        .toUpperCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}
/**
 * Calculate similarity between two names
 *
 * @param name1 - First name
 * @param name2 - Second name
 * @returns Similarity score 0-1
 */
function calculateNameSimilarity(name1, name2) {
    if (!name1 || !name2) {
        return 0;
    }
    if (name1 === name2) {
        return 1;
    }
    // Levenshtein distance approach
    const maxLen = Math.max(name1.length, name2.length);
    const distance = levenshteinDistance(name1, name2);
    const similarity = 1 - distance / maxLen;
    return Math.max(0, Math.min(1, similarity));
}
/**
 * Calculate Levenshtein distance between two strings
 *
 * @param s1 - First string
 * @param s2 - Second string
 * @returns Distance metric
 */
function levenshteinDistance(s1, s2) {
    const m = s1.length;
    const n = s2.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++)
        dp[i][0] = i;
    for (let j = 0; j <= n; j++)
        dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
        }
    }
    return dp[m][n];
}
/**
 * Screen recipient account against patterns
 *
 * @param accountNumber - Recipient account number
 * @param bankCode - Bank code
 * @param blocklistAccounts - Blocked account patterns
 * @returns Whether account is blocked
 */
function screenRecipientAccount(accountNumber, bankCode, blocklistAccounts) {
    if (!accountNumber || typeof accountNumber !== 'string') {
        return false;
    }
    const normalizedAccount = normalizeAccountNumber(accountNumber);
    return blocklistAccounts.some(blocked => {
        const normalizedBlocked = normalizeAccountNumber(blocked);
        return normalizedAccount === normalizedBlocked;
    });
}
// ============================================================================
// TRAVEL RULE COMPLIANCE (Functions 13-16)
// ============================================================================
/**
 * Validate Travel Rule compliance data
 *
 * @param data - Travel Rule data to validate
 * @param threshold - Amount threshold (e.g., $3000)
 * @returns Validation result
 */
function validateTravelRuleCompliance(data, threshold = 3000) {
    const missingFields = [];
    if (data.amount >= threshold) {
        // Originator information required
        if (!data.originatorName)
            missingFields.push('originatorName');
        if (!data.originatorAddress)
            missingFields.push('originatorAddress');
        if (!data.originatorAccountNumber)
            missingFields.push('originatorAccountNumber');
        // Beneficiary information required
        if (!data.beneficiaryName)
            missingFields.push('beneficiaryName');
        if (!data.beneficiaryAccountNumber)
            missingFields.push('beneficiaryAccountNumber');
    }
    return {
        isCompliant: missingFields.length === 0,
        missingFields,
        requiresFilingThreshold: data.amount >= threshold,
    };
}
/**
 * Extract Travel Rule data from SWIFT message
 *
 * @param swiftMessage - Parsed SWIFT message
 * @returns Travel Rule data structure
 */
function extractTravelRuleData(swiftMessage) {
    return {
        originatorName: swiftMessage.originatorName || '',
        originatorAddress: swiftMessage.originatorAddress || '',
        originatorAccountNumber: swiftMessage.originatorAccount || '',
        beneficiaryName: swiftMessage.beneficiaryName || '',
        beneficiaryAddress: swiftMessage.beneficiaryAddress || '',
        beneficiaryAccountNumber: swiftMessage.beneficiaryAccount || '',
        amount: swiftMessage.amount,
        currency: swiftMessage.currency,
        orderingCustomer: swiftMessage.originatorName || '',
        beneficiaryCustomer: swiftMessage.beneficiaryName || '',
    };
}
/**
 * Check if Travel Rule chain is complete
 *
 * @param intermediaryChain - Intermediary bank chain
 * @param minimumChainElements - Minimum expected elements
 * @returns Whether chain is complete
 */
function validateTravelRuleChain(intermediaryChain, minimumChainElements = 2) {
    if (!Array.isArray(intermediaryChain)) {
        return false;
    }
    return intermediaryChain.length >= minimumChainElements && intermediaryChain.every(link => link && link.length > 0);
}
/**
 * Generate Travel Rule filing for cross-border transfer
 *
 * @param data - Travel Rule data
 * @param jurisdiction - Regulatory jurisdiction
 * @returns Filing record
 */
function generateTravelRuleFiling(data, jurisdiction) {
    return {
        filingId: `TR-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        timestamp: new Date(),
        data,
        jurisdiction,
    };
}
// ============================================================================
// CROSS-BORDER DETECTION (Functions 17-19)
// ============================================================================
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
function detectCrossBorderTransfer(originCountry, destinationCountry, riskCountries, highValueThreshold, amount) {
    const isInternational = originCountry !== destinationCountry;
    const riskCountriesMatched = [originCountry, destinationCountry].filter(country => riskCountries.some(risk => risk.toUpperCase() === country.toUpperCase()));
    return {
        isInternational,
        originCountry,
        destinationCountry,
        riskCountries: riskCountriesMatched,
        requiresFilingThreshold: isInternational && amount >= highValueThreshold,
    };
}
/**
 * Identify originating country from bank code
 *
 * @param senderBIC - SWIFT BIC code of sending bank
 * @returns Country code (ISO 3166-1 alpha-2)
 */
function identifyOriginCountry(senderBIC) {
    if (!senderBIC || senderBIC.length < 2) {
        return 'UNKNOWN';
    }
    // BIC code positions 5-6 contain country code
    return senderBIC.substring(4, 6).toUpperCase();
}
/**
 * Identify destination country from bank code
 *
 * @param receiverBIC - SWIFT BIC code of receiving bank
 * @returns Country code (ISO 3166-1 alpha-2)
 */
function identifyDestinationCountry(receiverBIC) {
    if (!receiverBIC || receiverBIC.length < 2) {
        return 'UNKNOWN';
    }
    // BIC code positions 5-6 contain country code
    return receiverBIC.substring(4, 6).toUpperCase();
}
// ============================================================================
// SANCTIONS & FILTERING (Functions 20-22)
// ============================================================================
/**
 * Apply comprehensive sanctions filtering
 *
 * @param transaction - Transaction details
 * @param sanctionsList - List of sanctioned entities
 * @param pepList - List of PEPs
 * @returns Screening result
 */
function applySanctionsFilter(transaction, sanctionsList, pepList) {
    const reasons = [];
    const matchedEntities = [];
    let maxConfidence = 0;
    // Check originator
    const originatorMatches = sanctionsList.filter(entity => calculateNameSimilarity(normalizeEntityName(transaction.originatorName), normalizeEntityName(entity.name)) >
        0.75);
    if (originatorMatches.length > 0) {
        reasons.push(`Originator matched ${originatorMatches.length} sanctioned entit${originatorMatches.length > 1 ? 'ies' : 'y'}`);
        matchedEntities.push(...originatorMatches);
        maxConfidence = Math.max(maxConfidence, 0.95);
    }
    // Check beneficiary
    const beneficiaryMatches = sanctionsList.filter(entity => calculateNameSimilarity(normalizeEntityName(transaction.beneficiaryName), normalizeEntityName(entity.name)) >
        0.75);
    if (beneficiaryMatches.length > 0) {
        reasons.push(`Beneficiary matched ${beneficiaryMatches.length} sanctioned entit${beneficiaryMatches.length > 1 ? 'ies' : 'y'}`);
        matchedEntities.push(...beneficiaryMatches);
        maxConfidence = Math.max(maxConfidence, 0.95);
    }
    // Check countries
    const sanctionedCountries = ['KP', 'IR', 'SY', 'CU']; // Example OFAC countries
    if (sanctionedCountries.includes(transaction.originCountry) || sanctionedCountries.includes(transaction.destinationCountry)) {
        reasons.push('Transaction involves sanctioned country');
        maxConfidence = 1.0;
    }
    const isRisky = reasons.length > 0;
    const riskLevel = isRisky
        ? maxConfidence > 0.95
            ? 'CRITICAL'
            : 'HIGH'
        : 'LOW';
    return {
        isRisky,
        riskLevel,
        reasons,
        matchedEntities,
        confidenceScore: maxConfidence,
    };
}
/**
 * Filter transaction against consolidated sanctions list
 *
 * @param transactionId - Transaction identifier
 * @param recipientName - Name of transaction recipient
 * @param consolidatedList - Consolidated sanctions database
 * @returns Whether transaction passes filter
 */
function filterConsolidatedSanctions(transactionId, recipientName, consolidatedList) {
    if (!recipientName || !Array.isArray(consolidatedList)) {
        return true;
    }
    const normalized = normalizeEntityName(recipientName);
    const isMatched = consolidatedList.some(entity => calculateNameSimilarity(normalized, normalizeEntityName(entity.name)) > 0.85);
    return !isMatched;
}
/**
 * Check entity against multiple lists (OFAC, EU, UN)
 *
 * @param entityName - Entity name to check
 * @param lists - Map of list names to entities
 * @returns Matches across all lists
 */
function checkMultipleSanctionsList(entityName, lists) {
    const matches = new Map();
    const normalized = normalizeEntityName(entityName);
    for (const [listName, entities] of lists) {
        const listMatches = entities.filter(entity => calculateNameSimilarity(normalized, normalizeEntityName(entity.name)) > 0.80);
        if (listMatches.length > 0) {
            matches.set(listName, listMatches);
        }
    }
    return matches;
}
// ============================================================================
// WIRE STRIPPING DETECTION (Functions 23-25)
// ============================================================================
/**
 * Detect wire stripping and information removal patterns
 *
 * @param swiftMessage - Parsed SWIFT message
 * @returns Wire stripping indicators
 */
function detectWireStripping(swiftMessage) {
    const missingOriginatorInfo = [];
    const missingBeneficiaryInfo = [];
    const obfuscationPatterns = [];
    // Check originator information
    if (!swiftMessage.originatorName)
        missingOriginatorInfo.push('name');
    if (!swiftMessage.originatorAddress)
        missingOriginatorInfo.push('address');
    if (!swiftMessage.originatorAccount)
        missingOriginatorInfo.push('account');
    // Check beneficiary information
    if (!swiftMessage.beneficiaryName)
        missingBeneficiaryInfo.push('name');
    if (!swiftMessage.beneficiaryAddress)
        missingBeneficiaryInfo.push('address');
    if (!swiftMessage.beneficiaryAccount)
        missingBeneficiaryInfo.push('account');
    // Detect obfuscation patterns
    if (swiftMessage.originatorName && isObfuscated(swiftMessage.originatorName)) {
        obfuscationPatterns.push('Originator name uses obfuscation');
    }
    if (swiftMessage.beneficiaryName && isObfuscated(swiftMessage.beneficiaryName)) {
        obfuscationPatterns.push('Beneficiary name uses obfuscation');
    }
    const missingCount = missingOriginatorInfo.length + missingBeneficiaryInfo.length;
    const severity = missingCount === 0 && obfuscationPatterns.length === 0
        ? 'NONE'
        : missingCount <= 2 && obfuscationPatterns.length <= 1
            ? 'LOW'
            : missingCount <= 4 && obfuscationPatterns.length <= 2
                ? 'MEDIUM'
                : 'HIGH';
    return {
        isStrippingRisk: severity !== 'NONE',
        missingOriginatorInfo,
        missingBeneficiaryInfo,
        obfuscationPatterns,
        severity,
    };
}
/**
 * Check if string contains obfuscation indicators
 *
 * @param text - Text to analyze
 * @returns Whether obfuscation is detected
 */
function isObfuscated(text) {
    if (!text || typeof text !== 'string') {
        return false;
    }
    // Check for common obfuscation patterns
    const patterns = [/^[X\*]+$/i, /^[A-Z0-9]{1,3}$/i, /SHELL|DUMMY|INTERMEDIARY|TRANSIT/i];
    return patterns.some(pattern => pattern.test(text));
}
/**
 * Validate information completeness for transaction
 *
 * @param message - SWIFT message
 * @param minimumRequired - Minimum required fields
 * @returns Completeness assessment
 */
function validateInformationCompleteness(message, minimumRequired = 6) {
    const requiredFields = [
        'senderBIC',
        'receiverBIC',
        'amount',
        'currency',
        'originatorName',
        'beneficiaryName',
    ];
    const missingFields = [];
    for (const field of requiredFields) {
        const value = message[field];
        if (!value || (typeof value === 'string' && value.trim() === '') || (typeof value === 'number' && value === 0)) {
            missingFields.push(field);
        }
    }
    const completenessScore = (requiredFields.length - missingFields.length) / requiredFields.length;
    return {
        isComplete: missingFields.length === 0 && completenessScore >= minimumRequired / 10,
        completenessScore,
        missingFields,
    };
}
// ============================================================================
// INCOMPLETE INFO & STRUCTURED PATTERNS (Functions 26-28)
// ============================================================================
/**
 * Detect missing required information
 *
 * @param transaction - Transaction data
 * @returns Missing fields and severity
 */
function detectIncompleteInformation(transaction) {
    const missingFields = [];
    const requiredFields = [
        'originatorName',
        'originatorAddress',
        'originatorAccountNumber',
        'beneficiaryName',
        'beneficiaryAddress',
        'beneficiaryAccountNumber',
        'amount',
        'currency',
    ];
    for (const field of requiredFields) {
        const value = transaction[field];
        if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '') || (typeof value === 'number' && value === 0)) {
            missingFields.push(field);
        }
    }
    const missingCount = missingFields.length;
    const riskSeverity = missingCount === 0 ? 'NONE' : missingCount <= 2 ? 'LOW' : missingCount <= 4 ? 'MEDIUM' : 'HIGH';
    return {
        hasIncompleteInfo: missingCount > 0,
        missingFields,
        riskSeverity,
    };
}
/**
 * Identify structured payment patterns
 *
 * @param transactions - Array of transactions
 * @param timeWindowDays - Time window for pattern detection
 * @returns Identified patterns
 */
function identifyStructuredPatterns(transactions, timeWindowDays = 30) {
    if (!Array.isArray(transactions) || transactions.length < 2) {
        return {
            hasStructuredPattern: false,
            patterns: [],
        };
    }
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeWindowDays);
    const filteredTransactions = transactions.filter(t => t.timestamp >= cutoffDate);
    if (filteredTransactions.length < 2) {
        return {
            hasStructuredPattern: false,
            patterns: [],
        };
    }
    // Sort by amount
    const sortedByAmount = [...filteredTransactions].sort((a, b) => a.amount - b.amount);
    const patterns = [];
    // Detect just-below-threshold pattern (e.g., multiple $9,900 transfers)
    const amountGroups = new Map();
    for (const tx of sortedByAmount) {
        const key = Math.round(tx.amount / 100) * 100;
        amountGroups.set(key, (amountGroups.get(key) || 0) + 1);
    }
    for (const [amount, count] of amountGroups) {
        if (count >= 3) {
            patterns.push({
                type: `Multiple transfers of approximately $${amount}`,
                count,
                totalAmount: amount * count,
                confidence: Math.min(1, count / 10),
            });
        }
    }
    return {
        hasStructuredPattern: patterns.length > 0,
        patterns,
    };
}
/**
 * Analyze transaction for round-number pattern
 *
 * @param amount - Transaction amount
 * @param threshold - Threshold for "just-below" detection (e.g., 10000)
 * @returns Pattern analysis
 */
function analyzeRoundNumberPattern(amount, threshold = 10000) {
    if (amount <= 0) {
        return {
            isJustBelowThreshold: false,
            distanceFromThreshold: 0,
            suspicionLevel: 'NONE',
        };
    }
    const distanceFromThreshold = threshold - amount;
    const isJustBelowThreshold = distanceFromThreshold > 0 && distanceFromThreshold < 100;
    const suspicionLevel = isJustBelowThreshold ? 'HIGH' : distanceFromThreshold === 0 ? 'LOW' : 'NONE';
    return {
        isJustBelowThreshold,
        distanceFromThreshold,
        suspicionLevel,
    };
}
// ============================================================================
// HIGH-VALUE & VELOCITY MONITORING (Functions 29-31)
// ============================================================================
/**
 * Flag high-value transactions
 *
 * @param amount - Transaction amount
 * @param highValueThreshold - Threshold for high-value flag
 * @param veryHighValueThreshold - Threshold for very high-value flag
 * @returns High-value alert
 */
function flagHighValueTransaction(amount, highValueThreshold = 100000, veryHighValueThreshold = 500000) {
    if (amount >= veryHighValueThreshold) {
        return {
            isHighValue: true,
            isCritical: true,
            threshold: veryHighValueThreshold,
            excess: amount - veryHighValueThreshold,
        };
    }
    if (amount >= highValueThreshold) {
        return {
            isHighValue: true,
            isCritical: false,
            threshold: highValueThreshold,
            excess: amount - highValueThreshold,
        };
    }
    return {
        isHighValue: false,
        isCritical: false,
        threshold: highValueThreshold,
        excess: 0,
    };
}
/**
 * Monitor transaction velocity for an entity
 *
 * @param transactions - Array of transactions
 * @param timeWindowMinutes - Time window to analyze
 * @param velocityThresholds - Thresholds for count and amount
 * @returns Velocity metrics
 */
function monitorVelocity(transactions, timeWindowMinutes = 60, velocityThresholds = {
    countThreshold: 10,
    amountThreshold: 1000000,
}) {
    if (!Array.isArray(transactions) || transactions.length === 0) {
        return {
            transactionCount: 0,
            totalAmount: 0,
            timeWindowMinutes,
            isAnomalous: false,
            exceededThresholds: [],
        };
    }
    const cutoffTime = new Date();
    cutoffTime.setMinutes(cutoffTime.getMinutes() - timeWindowMinutes);
    const windowTransactions = transactions.filter(t => t.timestamp >= cutoffTime);
    const transactionCount = windowTransactions.length;
    const totalAmount = windowTransactions.reduce((sum, t) => sum + t.amount, 0);
    const exceededThresholds = [];
    if (transactionCount > velocityThresholds.countThreshold) {
        exceededThresholds.push(`transaction count (${transactionCount})`);
    }
    if (totalAmount > velocityThresholds.amountThreshold) {
        exceededThresholds.push(`total amount (${totalAmount})`);
    }
    return {
        transactionCount,
        totalAmount,
        timeWindowMinutes,
        isAnomalous: exceededThresholds.length > 0,
        exceededThresholds,
    };
}
/**
 * Detect sequential amount pattern (e.g., ascending amounts)
 *
 * @param transactions - Ordered list of transactions
 * @returns Sequential pattern analysis
 */
function detectSequentialPattern(transactions) {
    if (!Array.isArray(transactions) || transactions.length < 3) {
        return {
            chainLength: 0,
            startAmount: 0,
            endAmount: 0,
            totalAmount: 0,
            timeSpan: 0,
            isSequential: false,
            confidence: 0,
        };
    }
    // Check for ascending or descending pattern
    const sorted = [...transactions].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const amounts = sorted.map(t => t.amount);
    let isAscending = true;
    let isDescending = true;
    for (let i = 1; i < amounts.length; i++) {
        if (amounts[i] <= amounts[i - 1])
            isAscending = false;
        if (amounts[i] >= amounts[i - 1])
            isDescending = false;
    }
    const isSequential = isAscending || isDescending;
    const confidence = isSequential ? 0.85 : 0;
    const timeSpan = sorted[sorted.length - 1].timestamp.getTime() - sorted[0].timestamp.getTime();
    const totalAmount = amounts.reduce((a, b) => a + b, 0);
    return {
        chainLength: transactions.length,
        startAmount: amounts[0],
        endAmount: amounts[amounts.length - 1],
        totalAmount,
        timeSpan: Math.floor(timeSpan / (1000 * 60)), // Convert to minutes
        isSequential,
        confidence,
    };
}
// ============================================================================
// CLUSTERING & PATTERN ANALYSIS (Functions 32-33)
// ============================================================================
/**
 * Perform transaction clustering for pattern detection
 *
 * @param transactions - Array of transactions
 * @param clusteringStrategy - Strategy for clustering ('amount' | 'destination' | 'originator')
 * @returns Clustering analysis results
 */
function clusterTransactions(transactions, clusteringStrategy = 'destination') {
    if (!Array.isArray(transactions) || transactions.length === 0) {
        return [];
    }
    const clusters = new Map();
    for (const tx of transactions) {
        let key = '';
        switch (clusteringStrategy) {
            case 'amount':
                key = Math.round(tx.amount / 1000).toString();
                break;
            case 'destination':
                key = tx.beneficiaryName;
                break;
            case 'originator':
                key = tx.originatorName;
                break;
        }
        const existing = clusters.get(key) || [];
        clusters.set(key, [...existing, tx]);
    }
    const analyses = [];
    for (const [key, clusterTxs] of clusters) {
        const totalAmount = clusterTxs.reduce((sum, t) => sum + t.amount, 0);
        const commonPatterns = [];
        // Detect patterns
        if (clusterTxs.length > 5) {
            commonPatterns.push('High frequency cluster');
        }
        if (totalAmount > 500000) {
            commonPatterns.push('High-value cluster');
        }
        const avgAmount = totalAmount / clusterTxs.length;
        const variance = clusterTxs.reduce((sum, t) => sum + Math.pow(t.amount - avgAmount, 2), 0) / clusterTxs.length;
        const riskScore = Math.min(1, (clusterTxs.length / 10) * 0.5 + (totalAmount / 1000000) * 0.3 + (Math.sqrt(variance) / avgAmount) * 0.2);
        analyses.push({
            clusterId: `CLUSTER-${key}-${Date.now()}`,
            clusterSize: clusterTxs.length,
            commonPatterns,
            riskScore,
            isSuspicious: clusterTxs.length > 5 || totalAmount > 1000000,
        });
    }
    return analyses;
}
/**
 * Identify related transactions for investigation
 *
 * @param referenceTransaction - Transaction to find related ones
 * @param allTransactions - All available transactions
 * @param relationshipThreshold - Similarity threshold 0-1
 * @returns Related transactions
 */
function identifyRelatedTransactions(referenceTransaction, allTransactions, relationshipThreshold = 0.7) {
    const related = [];
    for (const tx of allTransactions) {
        let similarity = 0;
        // Compare originators
        if (normalizeEntityName(referenceTransaction.originatorName) === normalizeEntityName(tx.originatorName)) {
            similarity += 0.4;
        }
        else {
            similarity +=
                calculateNameSimilarity(referenceTransaction.originatorName, tx.originatorName) * 0.4;
        }
        // Compare beneficiaries
        if (normalizeEntityName(referenceTransaction.beneficiaryName) === normalizeEntityName(tx.beneficiaryName)) {
            similarity += 0.4;
        }
        else {
            similarity +=
                calculateNameSimilarity(referenceTransaction.beneficiaryName, tx.beneficiaryName) * 0.4;
        }
        // Compare amounts (within 10% range)
        const amountDiff = Math.abs(referenceTransaction.amount - tx.amount) / referenceTransaction.amount;
        if (amountDiff < 0.1) {
            similarity += 0.2;
        }
        else if (amountDiff < 0.5) {
            similarity += 0.1;
        }
        if (similarity >= relationshipThreshold) {
            related.push({ transaction: tx, similarity });
        }
    }
    return related.sort((a, b) => b.similarity - a.similarity);
}
// ============================================================================
// OFAC 50% RULE (Functions 34-35)
// ============================================================================
/**
 * Apply OFAC 50% rule for entity matching
 *
 * @param entityName - Entity name to check
 * @param sanctionedEntities - List of sanctioned entities
 * @returns OFAC rule analysis
 */
function applyOFAC50PercentRule(entityName, sanctionedEntities) {
    if (!entityName || !Array.isArray(sanctionedEntities)) {
        return {
            directMatch: false,
            fiftyPercentMatch: false,
            entityName: entityName || '',
            matchingCriteria: [],
            actionRequired: 'NONE',
        };
    }
    const normalizedName = normalizeEntityName(entityName);
    const matchingCriteria = [];
    let directMatch = false;
    let fiftyPercentMatch = false;
    for (const sanctionedEntity of sanctionedEntities) {
        const normalizedSanctioned = normalizeEntityName(sanctionedEntity.name);
        const similarity = calculateNameSimilarity(normalizedName, normalizedSanctioned);
        // Direct match - 100% identical
        if (similarity === 1.0) {
            directMatch = true;
            matchingCriteria.push('Exact name match');
        }
        // 50% Rule - at least 50% of words match
        const nameWords = normalizedName.split(/\s+/);
        const sanctionedWords = normalizedSanctioned.split(/\s+/);
        const matchedWords = nameWords.filter(word => sanctionedWords.includes(word)).length;
        const matchPercentage = matchedWords / Math.max(nameWords.length, sanctionedWords.length);
        if (matchPercentage >= 0.5 && similarity >= 0.7) {
            fiftyPercentMatch = true;
            matchingCriteria.push(`50% word match (${Math.round(matchPercentage * 100)}%)`);
        }
    }
    const actionRequired = directMatch
        ? 'BLOCK'
        : fiftyPercentMatch
            ? 'REVIEW'
            : 'NONE';
    return {
        directMatch,
        fiftyPercentMatch,
        entityName,
        matchingCriteria,
        actionRequired,
    };
}
/**
 * Calculate entity match score under OFAC criteria
 *
 * @param transactionEntity - Entity from transaction
 * @param sanctionedEntity - Entity from sanctions list
 * @returns Match score and reasoning
 */
function calculateOFACMatchScore(transactionEntity, sanctionedEntity) {
    let score = 0;
    const reasoning = [];
    const normalizedTx = normalizeEntityName(transactionEntity.name);
    const normalizedSanctioned = normalizeEntityName(sanctionedEntity.name);
    // Primary name match
    const primarySimilarity = calculateNameSimilarity(normalizedTx, normalizedSanctioned);
    if (primarySimilarity === 1.0) {
        score = 1.0;
        reasoning.push('Exact primary name match');
    }
    else if (primarySimilarity >= 0.95) {
        score = 0.95;
        reasoning.push('Near-exact primary name match');
    }
    else if (primarySimilarity >= 0.75) {
        score = 0.75;
        reasoning.push('High-confidence primary name match');
    }
    // Alternate names
    if (transactionEntity.alternate_names &&
        transactionEntity.alternate_names.some(alt => calculateNameSimilarity(normalizeEntityName(alt), normalizedSanctioned) > 0.9)) {
        score = Math.max(score, 0.85);
        reasoning.push('Matched alternate name');
    }
    // Country match
    if (transactionEntity.country && transactionEntity.country === sanctionedEntity.jurisdiction) {
        score = Math.min(score + 0.1, 1.0);
        reasoning.push('Country jurisdiction match');
    }
    const matchLevel = score >= 0.95 ? 'DIRECT' : score >= 0.7 ? 'FIFTY_PERCENT' : score >= 0.5 ? 'PARTIAL' : 'NONE';
    return {
        score,
        reasoning,
        matchLevel,
    };
}
// ============================================================================
// RECORDKEEPING & AUDIT (Functions 36-40)
// ============================================================================
/**
 * Create compliance record for transaction
 *
 * @param transaction - Transaction details
 * @param screeningResults - Results from screening
 * @param complianceFlags - Any compliance flags raised
 * @returns Record keeping entry
 */
function createComplianceRecord(transaction, screeningResults, complianceFlags) {
    return {
        transactionId: transaction.transactionId,
        timestamp: transaction.timestamp,
        originAccount: transaction.originatorAccount,
        destinationAccount: transaction.beneficiaryAccount,
        amount: transaction.amount,
        currency: transaction.currency,
        originatorName: transaction.originatorName,
        beneficiaryName: transaction.beneficiaryName,
        purpose: transaction.purpose || 'Not specified',
        screeningResults,
        complianceFlags,
        auditTrail: [
            {
                action: 'RECORD_CREATED',
                timestamp: new Date(),
                actor: 'SYSTEM',
                details: `Compliance record created for transaction ${transaction.transactionId}`,
            },
        ],
    };
}
/**
 * Update audit trail for compliance record
 *
 * @param record - Existing record
 * @param action - Action performed
 * @param actor - User/system performing action
 * @param details - Action details
 * @returns Updated record
 */
function updateAuditTrail(record, action, actor, details) {
    const newAuditLog = {
        action,
        timestamp: new Date(),
        actor,
        details,
    };
    return {
        ...record,
        auditTrail: [...record.auditTrail, newAuditLog],
    };
}
/**
 * Export compliance record for regulatory filing
 *
 * @param record - Record to export
 * @param format - Export format ('JSON' | 'CSV' | 'XML')
 * @returns Exported record as string
 */
function exportComplianceRecord(record, format = 'JSON') {
    switch (format) {
        case 'JSON':
            return JSON.stringify(record, null, 2);
        case 'CSV':
            return [
                `Transaction ID,Timestamp,Origin Account,Destination Account,Amount,Currency,Originator,Beneficiary,Risk Level,Flags`,
                `"${record.transactionId}","${record.timestamp.toISOString()}","${record.originAccount}","${record.destinationAccount}","${record.amount}","${record.currency}","${record.originatorName}","${record.beneficiaryName}","${record.screeningResults.riskLevel}","${record.complianceFlags.join(';')}"`,
            ].join('\n');
        case 'XML':
            return `<?xml version="1.0" encoding="UTF-8"?>
<ComplianceRecord>
  <TransactionId>${escapeXML(record.transactionId)}</TransactionId>
  <Timestamp>${record.timestamp.toISOString()}</Timestamp>
  <OriginAccount>${escapeXML(record.originAccount)}</OriginAccount>
  <DestinationAccount>${escapeXML(record.destinationAccount)}</DestinationAccount>
  <Amount>${record.amount}</Amount>
  <Currency>${record.currency}</Currency>
  <OriginatorName>${escapeXML(record.originatorName)}</OriginatorName>
  <BeneficiaryName>${escapeXML(record.beneficiaryName)}</BeneficiaryName>
  <RiskLevel>${record.screeningResults.riskLevel}</RiskLevel>
  <Flags>${record.complianceFlags.map(f => `<Flag>${escapeXML(f)}</Flag>`).join('')}</Flags>
</ComplianceRecord>`;
        default:
            return JSON.stringify(record);
    }
}
/**
 * Archive compliance records by date range
 *
 * @param records - Records to archive
 * @param startDate - Archive start date
 * @param endDate - Archive end date
 * @returns Archived records and metadata
 */
function archiveComplianceRecords(records, startDate, endDate) {
    const filtered = records.filter(r => r.timestamp >= startDate && r.timestamp <= endDate);
    const riskDistribution = {
        CRITICAL: 0,
        HIGH: 0,
        MEDIUM: 0,
        LOW: 0,
    };
    let totalAmount = 0;
    for (const record of filtered) {
        const riskLevel = record.screeningResults.riskLevel;
        riskDistribution[riskLevel] = (riskDistribution[riskLevel] || 0) + 1;
        totalAmount += record.amount;
    }
    return {
        archivedCount: filtered.length,
        totalAmount,
        riskDistribution,
        archiveId: `ARCHIVE-${startDate.toISOString()}-${endDate.toISOString()}-${Math.random().toString(36).substring(7)}`,
        metadata: {
            startDate,
            endDate,
            createdAt: new Date(),
        },
    };
}
/**
 * Generate compliance report from records
 *
 * @param records - Records to report on
 * @param reportPeriod - Period for report ('DAILY' | 'WEEKLY' | 'MONTHLY')
 * @returns Compliance report
 */
function generateComplianceReport(records, reportPeriod = 'DAILY') {
    const riskBreakdown = {
        CRITICAL: 0,
        HIGH: 0,
        MEDIUM: 0,
        LOW: 0,
    };
    let totalAmount = 0;
    let flaggedCount = 0;
    for (const record of records) {
        const riskLevel = record.screeningResults.riskLevel;
        riskBreakdown[riskLevel] = (riskBreakdown[riskLevel] || 0) + 1;
        totalAmount += record.amount;
        if (record.complianceFlags.length > 0) {
            flaggedCount++;
        }
    }
    return {
        reportId: `REPORT-${reportPeriod}-${Date.now()}`,
        period: reportPeriod,
        totalTransactions: records.length,
        totalAmount,
        riskBreakdown,
        flaggedTransactions: flaggedCount,
        generatedAt: new Date(),
    };
}
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Parse currency amount string to number
 *
 * @param amount - Currency amount string
 * @returns Parsed numeric amount
 */
function parseCurrency(amount) {
    if (!amount || typeof amount !== 'string') {
        return 0;
    }
    const cleaned = amount.replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
}
/**
 * Normalize account number
 *
 * @param account - Account number to normalize
 * @returns Normalized account
 */
function normalizeAccountNumber(account) {
    if (!account || typeof account !== 'string') {
        return '';
    }
    return account.replace(/[^A-Z0-9]/g, '').toUpperCase();
}
/**
 * Escape XML special characters
 *
 * @param str - String to escape
 * @returns Escaped string
 */
function escapeXML(str) {
    if (!str || typeof str !== 'string') {
        return '';
    }
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}
//# sourceMappingURL=wire-transfer-monitoring-kit.js.map