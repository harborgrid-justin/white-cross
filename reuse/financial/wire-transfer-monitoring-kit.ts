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

// ============================================================================
// TYPE DEFINITIONS & INTERFACES
// ============================================================================

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
export function parseSWIFTMessage(rawMessage: string): SWIFTMessage {
  if (!rawMessage || typeof rawMessage !== 'string') {
    throw new Error('Invalid SWIFT message: must be non-empty string');
  }

  const lines = rawMessage.split('\n').map(line => line.trim());
  const messageType = extractSWIFTField(lines, '0', 'messageType') || 'UNKNOWN';

  const swiftMessage: SWIFTMessage = {
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
export function extractSWIFTField(
  lines: readonly string[],
  fieldTag: string,
  subField: string,
): string | null {
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
export function validateSWIFTStructure(message: SWIFTMessage): {
  readonly isValid: boolean;
  readonly errors: readonly string[];
} {
  const errors: string[] = [];

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
    errors: errors as readonly string[],
  };
}

/**
 * Parse SWIFT timestamp format
 *
 * @param timestamp - SWIFT formatted timestamp (YYMMDDHHmm)
 * @returns Parsed date object
 */
export function parseSWIFTTimestamp(timestamp: string): Date {
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
export function extractSWIFTSegments(swiftMessage: string): Map<string, string> {
  const segments = new Map<string, string>();

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
export function screenBeneficiary(
  beneficiaryName: string,
  beneficiaryAddress: string,
  beneficiaryCountry: string,
  sanctionsList: readonly MatchedEntity[],
): ScreeningResult {
  if (!beneficiaryName || typeof beneficiaryName !== 'string') {
    return {
      isRisky: true,
      riskLevel: 'HIGH',
      reasons: ['Missing or invalid beneficiary name'],
      confidenceScore: 0.95,
    };
  }

  const normalizedName = normalizeEntityName(beneficiaryName);
  const matchedEntities: MatchedEntity[] = [];
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

  const reasons: string[] = [];
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
export function screenOriginator(
  originatorName: string,
  originatorAddress: string,
  originatorCountry: string,
  sanctionsList: readonly MatchedEntity[],
): ScreeningResult {
  if (!originatorName || typeof originatorName !== 'string') {
    return {
      isRisky: true,
      riskLevel: 'HIGH',
      reasons: ['Missing or invalid originator name'],
      confidenceScore: 0.95,
    };
  }

  const normalizedName = normalizeEntityName(originatorName);
  const matchedEntities: MatchedEntity[] = [];
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

  const reasons: string[] = [];
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
export function normalizeEntityName(name: string): string {
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
export function calculateNameSimilarity(name1: string, name2: string): number {
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
export function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      );
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
export function screenRecipientAccount(
  accountNumber: string,
  bankCode: string,
  blocklistAccounts: readonly string[],
): boolean {
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
export function validateTravelRuleCompliance(
  data: TravelRuleData,
  threshold: number = 3000,
): {
  readonly isCompliant: boolean;
  readonly missingFields: readonly string[];
  readonly requiresFilingThreshold: boolean;
} {
  const missingFields: string[] = [];

  if (data.amount >= threshold) {
    // Originator information required
    if (!data.originatorName) missingFields.push('originatorName');
    if (!data.originatorAddress) missingFields.push('originatorAddress');
    if (!data.originatorAccountNumber) missingFields.push('originatorAccountNumber');

    // Beneficiary information required
    if (!data.beneficiaryName) missingFields.push('beneficiaryName');
    if (!data.beneficiaryAccountNumber) missingFields.push('beneficiaryAccountNumber');
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
export function extractTravelRuleData(swiftMessage: SWIFTMessage): TravelRuleData {
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
export function validateTravelRuleChain(
  intermediaryChain: readonly string[],
  minimumChainElements: number = 2,
): boolean {
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
export function generateTravelRuleFiling(
  data: TravelRuleData,
  jurisdiction: string,
): {
  readonly filingId: string;
  readonly timestamp: Date;
  readonly data: TravelRuleData;
  readonly jurisdiction: string;
} {
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
export function detectCrossBorderTransfer(
  originCountry: string,
  destinationCountry: string,
  riskCountries: readonly string[],
  highValueThreshold: number,
  amount: number,
): CrossBorderIndicators {
  const isInternational = originCountry !== destinationCountry;
  const riskCountriesMatched = [originCountry, destinationCountry].filter(country =>
    riskCountries.some(risk => risk.toUpperCase() === country.toUpperCase()),
  );

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
export function identifyOriginCountry(senderBIC: string): string {
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
export function identifyDestinationCountry(receiverBIC: string): string {
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
export function applySanctionsFilter(
  transaction: {
    readonly originatorName: string;
    readonly beneficiaryName: string;
    readonly amount: number;
    readonly originCountry: string;
    readonly destinationCountry: string;
  },
  sanctionsList: readonly MatchedEntity[],
  pepList: readonly MatchedEntity[],
): ScreeningResult {
  const reasons: string[] = [];
  const matchedEntities: MatchedEntity[] = [];
  let maxConfidence = 0;

  // Check originator
  const originatorMatches = sanctionsList.filter(entity =>
    calculateNameSimilarity(normalizeEntityName(transaction.originatorName), normalizeEntityName(entity.name)) >
    0.75,
  );
  if (originatorMatches.length > 0) {
    reasons.push(`Originator matched ${originatorMatches.length} sanctioned entit${originatorMatches.length > 1 ? 'ies' : 'y'}`);
    matchedEntities.push(...originatorMatches);
    maxConfidence = Math.max(maxConfidence, 0.95);
  }

  // Check beneficiary
  const beneficiaryMatches = sanctionsList.filter(entity =>
    calculateNameSimilarity(normalizeEntityName(transaction.beneficiaryName), normalizeEntityName(entity.name)) >
    0.75,
  );
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
  const riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = isRisky
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
export function filterConsolidatedSanctions(
  transactionId: string,
  recipientName: string,
  consolidatedList: readonly MatchedEntity[],
): boolean {
  if (!recipientName || !Array.isArray(consolidatedList)) {
    return true;
  }

  const normalized = normalizeEntityName(recipientName);
  const isMatched = consolidatedList.some(
    entity => calculateNameSimilarity(normalized, normalizeEntityName(entity.name)) > 0.85,
  );

  return !isMatched;
}

/**
 * Check entity against multiple lists (OFAC, EU, UN)
 *
 * @param entityName - Entity name to check
 * @param lists - Map of list names to entities
 * @returns Matches across all lists
 */
export function checkMultipleSanctionsList(
  entityName: string,
  lists: ReadonlyMap<string, readonly MatchedEntity[]>,
): Map<string, MatchedEntity[]> {
  const matches = new Map<string, MatchedEntity[]>();
  const normalized = normalizeEntityName(entityName);

  for (const [listName, entities] of lists) {
    const listMatches = entities.filter(
      entity => calculateNameSimilarity(normalized, normalizeEntityName(entity.name)) > 0.80,
    );
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
export function detectWireStripping(swiftMessage: SWIFTMessage): WireStrippingIndicators {
  const missingOriginatorInfo: string[] = [];
  const missingBeneficiaryInfo: string[] = [];
  const obfuscationPatterns: string[] = [];

  // Check originator information
  if (!swiftMessage.originatorName) missingOriginatorInfo.push('name');
  if (!swiftMessage.originatorAddress) missingOriginatorInfo.push('address');
  if (!swiftMessage.originatorAccount) missingOriginatorInfo.push('account');

  // Check beneficiary information
  if (!swiftMessage.beneficiaryName) missingBeneficiaryInfo.push('name');
  if (!swiftMessage.beneficiaryAddress) missingBeneficiaryInfo.push('address');
  if (!swiftMessage.beneficiaryAccount) missingBeneficiaryInfo.push('account');

  // Detect obfuscation patterns
  if (swiftMessage.originatorName && isObfuscated(swiftMessage.originatorName)) {
    obfuscationPatterns.push('Originator name uses obfuscation');
  }
  if (swiftMessage.beneficiaryName && isObfuscated(swiftMessage.beneficiaryName)) {
    obfuscationPatterns.push('Beneficiary name uses obfuscation');
  }

  const missingCount = missingOriginatorInfo.length + missingBeneficiaryInfo.length;
  const severity: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' =
    missingCount === 0 && obfuscationPatterns.length === 0
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
export function isObfuscated(text: string): boolean {
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
export function validateInformationCompleteness(
  message: SWIFTMessage,
  minimumRequired: number = 6,
): {
  readonly isComplete: boolean;
  readonly completenessScore: number;
  readonly missingFields: readonly string[];
} {
  const requiredFields = [
    'senderBIC',
    'receiverBIC',
    'amount',
    'currency',
    'originatorName',
    'beneficiaryName',
  ];

  const missingFields: string[] = [];

  for (const field of requiredFields) {
    const value = (message as Record<string, unknown>)[field];
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
export function detectIncompleteInformation(transaction: {
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
} {
  const missingFields: string[] = [];

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
    const value = (transaction as Record<string, unknown>)[field];
    if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '') || (typeof value === 'number' && value === 0)) {
      missingFields.push(field);
    }
  }

  const missingCount = missingFields.length;
  const riskSeverity =
    missingCount === 0 ? 'NONE' : missingCount <= 2 ? 'LOW' : missingCount <= 4 ? 'MEDIUM' : 'HIGH';

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
export function identifyStructuredPatterns(
  transactions: readonly {
    readonly amount: number;
    readonly timestamp: Date;
    readonly originatorName: string;
    readonly beneficiaryName: string;
  }[],
  timeWindowDays: number = 30,
): {
  readonly hasStructuredPattern: boolean;
  readonly patterns: readonly {
    readonly type: string;
    readonly count: number;
    readonly totalAmount: number;
    readonly confidence: number;
  }[];
} {
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

  const patterns: {
    readonly type: string;
    readonly count: number;
    readonly totalAmount: number;
    readonly confidence: number;
  }[] = [];

  // Detect just-below-threshold pattern (e.g., multiple $9,900 transfers)
  const amountGroups = new Map<number, number>();
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
export function analyzeRoundNumberPattern(amount: number, threshold: number = 10000): {
  readonly isJustBelowThreshold: boolean;
  readonly distanceFromThreshold: number;
  readonly suspicionLevel: string;
} {
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
export function flagHighValueTransaction(
  amount: number,
  highValueThreshold: number = 100000,
  veryHighValueThreshold: number = 500000,
): {
  readonly isHighValue: boolean;
  readonly isCritical: boolean;
  readonly threshold: number;
  readonly excess: number;
} {
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
export function monitorVelocity(
  transactions: readonly {
    readonly amount: number;
    readonly timestamp: Date;
  }[],
  timeWindowMinutes: number = 60,
  velocityThresholds: { readonly countThreshold: number; readonly amountThreshold: number } = {
    countThreshold: 10,
    amountThreshold: 1000000,
  },
): VelocityMetrics {
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

  const exceededThresholds: string[] = [];
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
export function detectSequentialPattern(
  transactions: readonly {
    readonly amount: number;
    readonly timestamp: Date;
  }[],
): SequentialPattern {
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
    if (amounts[i] <= amounts[i - 1]) isAscending = false;
    if (amounts[i] >= amounts[i - 1]) isDescending = false;
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
export function clusterTransactions(
  transactions: readonly {
    readonly amount: number;
    readonly timestamp: Date;
    readonly originatorName: string;
    readonly beneficiaryName: string;
  }[],
  clusteringStrategy: 'amount' | 'destination' | 'originator' = 'destination',
): readonly ClusteringAnalysis[] {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return [];
  }

  const clusters = new Map<string, typeof transactions>();

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

  const analyses: ClusteringAnalysis[] = [];

  for (const [key, clusterTxs] of clusters) {
    const totalAmount = clusterTxs.reduce((sum, t) => sum + t.amount, 0);
    const commonPatterns: string[] = [];

    // Detect patterns
    if (clusterTxs.length > 5) {
      commonPatterns.push('High frequency cluster');
    }
    if (totalAmount > 500000) {
      commonPatterns.push('High-value cluster');
    }

    const avgAmount = totalAmount / clusterTxs.length;
    const variance = clusterTxs.reduce((sum, t) => sum + Math.pow(t.amount - avgAmount, 2), 0) / clusterTxs.length;

    const riskScore = Math.min(
      1,
      (clusterTxs.length / 10) * 0.5 + (totalAmount / 1000000) * 0.3 + (Math.sqrt(variance) / avgAmount) * 0.2,
    );

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
export function identifyRelatedTransactions(
  referenceTransaction: {
    readonly originatorName: string;
    readonly beneficiaryName: string;
    readonly amount: number;
  },
  allTransactions: readonly {
    readonly originatorName: string;
    readonly beneficiaryName: string;
    readonly amount: number;
    readonly timestamp: Date;
  }[],
  relationshipThreshold: number = 0.7,
): readonly {
  readonly transaction: typeof allTransactions[0];
  readonly similarity: number;
}[] {
  const related: {
    readonly transaction: typeof allTransactions[0];
    readonly similarity: number;
  }[] = [];

  for (const tx of allTransactions) {
    let similarity = 0;

    // Compare originators
    if (normalizeEntityName(referenceTransaction.originatorName) === normalizeEntityName(tx.originatorName)) {
      similarity += 0.4;
    } else {
      similarity +=
        calculateNameSimilarity(referenceTransaction.originatorName, tx.originatorName) * 0.4;
    }

    // Compare beneficiaries
    if (normalizeEntityName(referenceTransaction.beneficiaryName) === normalizeEntityName(tx.beneficiaryName)) {
      similarity += 0.4;
    } else {
      similarity +=
        calculateNameSimilarity(referenceTransaction.beneficiaryName, tx.beneficiaryName) * 0.4;
    }

    // Compare amounts (within 10% range)
    const amountDiff = Math.abs(referenceTransaction.amount - tx.amount) / referenceTransaction.amount;
    if (amountDiff < 0.1) {
      similarity += 0.2;
    } else if (amountDiff < 0.5) {
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
export function applyOFAC50PercentRule(
  entityName: string,
  sanctionedEntities: readonly MatchedEntity[],
): OFACRuleAnalysis {
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
  const matchingCriteria: string[] = [];
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

  const actionRequired: 'NONE' | 'REVIEW' | 'BLOCK' | 'FILE_SAR' = directMatch
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
export function calculateOFACMatchScore(
  transactionEntity: {
    readonly name: string;
    readonly country?: string;
    readonly alternate_names?: readonly string[];
  },
  sanctionedEntity: MatchedEntity,
): {
  readonly score: number;
  readonly reasoning: readonly string[];
  readonly matchLevel: 'DIRECT' | 'FIFTY_PERCENT' | 'PARTIAL' | 'NONE';
} {
  let score = 0;
  const reasoning: string[] = [];

  const normalizedTx = normalizeEntityName(transactionEntity.name);
  const normalizedSanctioned = normalizeEntityName(sanctionedEntity.name);

  // Primary name match
  const primarySimilarity = calculateNameSimilarity(normalizedTx, normalizedSanctioned);
  if (primarySimilarity === 1.0) {
    score = 1.0;
    reasoning.push('Exact primary name match');
  } else if (primarySimilarity >= 0.95) {
    score = 0.95;
    reasoning.push('Near-exact primary name match');
  } else if (primarySimilarity >= 0.75) {
    score = 0.75;
    reasoning.push('High-confidence primary name match');
  }

  // Alternate names
  if (
    transactionEntity.alternate_names &&
    transactionEntity.alternate_names.some(
      alt => calculateNameSimilarity(normalizeEntityName(alt), normalizedSanctioned) > 0.9,
    )
  ) {
    score = Math.max(score, 0.85);
    reasoning.push('Matched alternate name');
  }

  // Country match
  if (transactionEntity.country && transactionEntity.country === sanctionedEntity.jurisdiction) {
    score = Math.min(score + 0.1, 1.0);
    reasoning.push('Country jurisdiction match');
  }

  const matchLevel: 'DIRECT' | 'FIFTY_PERCENT' | 'PARTIAL' | 'NONE' =
    score >= 0.95 ? 'DIRECT' : score >= 0.7 ? 'FIFTY_PERCENT' : score >= 0.5 ? 'PARTIAL' : 'NONE';

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
export function createComplianceRecord(
  transaction: {
    readonly transactionId: string;
    readonly timestamp: Date;
    readonly originatorName: string;
    readonly originatorAccount: string;
    readonly beneficiaryName: string;
    readonly beneficiaryAccount: string;
    readonly amount: number;
    readonly currency: string;
    readonly purpose?: string;
  },
  screeningResults: ScreeningResult,
  complianceFlags: readonly string[],
): RecordKeepingEntry {
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
export function updateAuditTrail(
  record: RecordKeepingEntry,
  action: string,
  actor: string,
  details: string,
): RecordKeepingEntry {
  const newAuditLog: AuditLog = {
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
export function exportComplianceRecord(
  record: RecordKeepingEntry,
  format: 'JSON' | 'CSV' | 'XML' = 'JSON',
): string {
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
export function archiveComplianceRecords(
  records: readonly RecordKeepingEntry[],
  startDate: Date,
  endDate: Date,
): {
  readonly archivedCount: number;
  readonly totalAmount: number;
  readonly riskDistribution: { readonly [key: string]: number };
  readonly archiveId: string;
  readonly metadata: {
    readonly startDate: Date;
    readonly endDate: Date;
    readonly createdAt: Date;
  };
} {
  const filtered = records.filter(r => r.timestamp >= startDate && r.timestamp <= endDate);

  const riskDistribution: { [key: string]: number } = {
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
export function generateComplianceReport(
  records: readonly RecordKeepingEntry[],
  reportPeriod: 'DAILY' | 'WEEKLY' | 'MONTHLY' = 'DAILY',
): {
  readonly reportId: string;
  readonly period: string;
  readonly totalTransactions: number;
  readonly totalAmount: number;
  readonly riskBreakdown: { readonly [key: string]: number };
  readonly flaggedTransactions: number;
  readonly generatedAt: Date;
} {
  const riskBreakdown: { [key: string]: number } = {
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
function parseCurrency(amount: string): number {
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
function normalizeAccountNumber(account: string): string {
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
function escapeXML(str: string): string {
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
