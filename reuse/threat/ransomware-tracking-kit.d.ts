/**
 * LOC: RANS1234567
 * File: /reuse/threat/ransomware-tracking-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence services
 *   - Ransomware analysis modules
 *   - Incident response systems
 */
/**
 * File: /reuse/threat/ransomware-tracking-kit.ts
 * Locator: WC-UTL-RANS-001
 * Purpose: Comprehensive Ransomware Tracking Utilities - Family identification, ransom note analysis, Bitcoin tracking, victim tracking, decryption tools
 *
 * Upstream: Independent utility module for ransomware intelligence and tracking
 * Downstream: ../backend/*, threat intelligence services, incident response, malware analysis
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize, Blockchain APIs
 * Exports: 45 utility functions for ransomware tracking, analysis, and intelligence gathering
 *
 * LLM Context: Comprehensive ransomware tracking utilities for White Cross threat intelligence system.
 * Provides ransomware family identification, ransom note parsing, Bitcoin wallet tracking, victim correlation,
 * encryption algorithm detection, decryption tool availability checks, and campaign tracking. Essential for
 * ransomware incident response and threat intelligence operations.
 */
interface RansomwareFamily {
    id: string;
    name: string;
    aliases: string[];
    firstSeen: Date;
    lastSeen: Date;
    targetIndustries: string[];
    encryptionAlgorithm: string;
    fileExtension: string;
    ransomNoteSignature: string;
    ttps: string[];
    severity: 'low' | 'medium' | 'high' | 'critical';
}
interface RansomNote {
    id: string;
    content: string;
    language: string;
    contactMethod: 'email' | 'tor' | 'telegram' | 'other';
    contactInfo: string[];
    ransomAmount?: number;
    currency?: string;
    paymentAddress?: string;
    deadline?: Date;
    threats: string[];
    familySignatures: string[];
}
interface BitcoinWallet {
    address: string;
    firstSeen: Date;
    lastSeen: Date;
    totalReceived: number;
    totalSent: number;
    balance: number;
    transactionCount: number;
    associatedRansomware: string[];
    riskScore: number;
}
interface RansomwareVictim {
    id: string;
    organization: string;
    industry: string;
    country: string;
    detectionDate: Date;
    ransomwareFamily: string;
    paid: boolean;
    ransomAmount?: number;
    dataLeaked: boolean;
    recoveryMethod?: 'decryptor' | 'backup' | 'ransom' | 'none';
    impactSeverity: 'low' | 'medium' | 'high' | 'critical';
}
interface EncryptionSignature {
    algorithm: string;
    keyLength: number;
    mode: string;
    fileMarkers: string[];
    entropyThreshold: number;
    encryptedExtension: string;
}
interface DecryptionTool {
    id: string;
    name: string;
    vendor: string;
    supportedFamilies: string[];
    effectivenessRate: number;
    lastUpdated: Date;
    downloadUrl: string;
    requirements: string[];
    limitations: string[];
}
interface RansomwareCampaign {
    id: string;
    name: string;
    ransomwareFamily: string;
    startDate: Date;
    endDate?: Date;
    targetedRegions: string[];
    targetedIndustries: string[];
    victimCount: number;
    totalRevenue: number;
    distributionMethod: string[];
    iocs: string[];
    status: 'active' | 'dormant' | 'terminated';
}
interface BlockchainTransaction {
    txid: string;
    timestamp: Date;
    fromAddress: string;
    toAddress: string;
    amount: number;
    confirmations: number;
    associatedRansomware?: string;
}
/**
 * Identifies ransomware family based on file hash and behavioral indicators.
 *
 * @param {string} fileHash - SHA256 hash of the ransomware sample
 * @param {string[]} behaviors - Observed behavioral indicators
 * @returns {Promise<RansomwareFamily | null>} Identified family or null
 * @throws {Error} If hash is invalid
 *
 * @example
 * ```typescript
 * const family = await identifyRansomwareByHash(
 *   'a1b2c3d4e5f6...',
 *   ['file_encryption', 'ransom_note_drop', 'shadow_copy_deletion']
 * );
 * // Result: { name: 'LockBit', aliases: ['LockBit 3.0'], ... }
 * ```
 */
export declare const identifyRansomwareByHash: (fileHash: string, behaviors: string[]) => Promise<RansomwareFamily | null>;
/**
 * Identifies ransomware family from ransom note content and signature.
 *
 * @param {string} noteContent - Content of the ransom note
 * @returns {Promise<RansomwareFamily[]>} Possible ransomware families ranked by confidence
 * @throws {Error} If note content is empty
 *
 * @example
 * ```typescript
 * const families = await identifyRansomwareByNote(
 *   'Your files have been encrypted. Contact us at...'
 * );
 * // Result: [{ name: 'Conti', confidence: 0.95, ... }, ...]
 * ```
 */
export declare const identifyRansomwareByNote: (noteContent: string) => Promise<Array<RansomwareFamily & {
    confidence: number;
}>>;
/**
 * Identifies ransomware by file extension pattern.
 *
 * @param {string} extension - File extension added by ransomware
 * @returns {Promise<RansomwareFamily[]>} Matching ransomware families
 *
 * @example
 * ```typescript
 * const families = await identifyRansomwareByExtension('.lockbit');
 * // Result: [{ name: 'LockBit', ... }]
 * ```
 */
export declare const identifyRansomwareByExtension: (extension: string) => Promise<RansomwareFamily[]>;
/**
 * Identifies ransomware by encryption algorithm signature.
 *
 * @param {EncryptionSignature} signature - Encryption signature details
 * @returns {Promise<RansomwareFamily[]>} Matching families
 * @throws {Error} If signature is incomplete
 *
 * @example
 * ```typescript
 * const families = await identifyRansomwareByEncryption({
 *   algorithm: 'AES',
 *   keyLength: 256,
 *   mode: 'CBC',
 *   fileMarkers: ['0xDEADBEEF'],
 *   entropyThreshold: 7.9,
 *   encryptedExtension: '.encrypted'
 * });
 * ```
 */
export declare const identifyRansomwareByEncryption: (signature: EncryptionSignature) => Promise<RansomwareFamily[]>;
/**
 * Identifies ransomware by TTP (Tactics, Techniques, and Procedures).
 *
 * @param {string[]} ttps - MITRE ATT&CK technique IDs
 * @returns {Promise<Array<RansomwareFamily & { matchScore: number }>>} Families with match scores
 *
 * @example
 * ```typescript
 * const families = await identifyRansomwareByTTP([
 *   'T1486', // Data Encrypted for Impact
 *   'T1490', // Inhibit System Recovery
 *   'T1489'  // Service Stop
 * ]);
 * // Result: [{ name: 'Conti', matchScore: 0.87, ... }]
 * ```
 */
export declare const identifyRansomwareByTTP: (ttps: string[]) => Promise<Array<RansomwareFamily & {
    matchScore: number;
}>>;
/**
 * Creates a comprehensive ransomware family profile from multiple indicators.
 *
 * @param {object} indicators - Collection of ransomware indicators
 * @returns {Promise<RansomwareFamily>} Complete family profile
 * @throws {Error} If minimum indicators not provided
 *
 * @example
 * ```typescript
 * const profile = await createRansomwareFamilyProfile({
 *   name: 'NewRansomware',
 *   fileHash: 'abc123...',
 *   extension: '.newrans',
 *   noteContent: 'Pay us...',
 *   ttps: ['T1486', 'T1490']
 * });
 * ```
 */
export declare const createRansomwareFamilyProfile: (indicators: {
    name: string;
    fileHash?: string;
    extension?: string;
    noteContent?: string;
    ttps?: string[];
    encryptionAlgo?: string;
}) => Promise<RansomwareFamily>;
/**
 * Parses ransom note content to extract structured information.
 *
 * @param {string} noteContent - Raw ransom note content
 * @returns {Promise<RansomNote>} Parsed ransom note data
 * @throws {Error} If parsing fails
 *
 * @example
 * ```typescript
 * const note = await parseRansomNote(ransomNoteText);
 * // Result: {
 * //   contactMethod: 'tor',
 * //   contactInfo: ['http://...onion'],
 * //   ransomAmount: 5,
 * //   currency: 'BTC',
 * //   ...
 * // }
 * ```
 */
export declare const parseRansomNote: (noteContent: string) => Promise<RansomNote>;
/**
 * Extracts Bitcoin wallet addresses from ransom note.
 *
 * @param {string} noteContent - Ransom note content
 * @returns {string[]} Extracted Bitcoin addresses
 *
 * @example
 * ```typescript
 * const wallets = extractWalletAddresses(note);
 * // Result: ['1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', ...]
 * ```
 */
export declare const extractWalletAddresses: (noteContent: string) => string[];
/**
 * Extracts contact information (emails, Tor URLs, Telegram) from ransom note.
 *
 * @param {string} noteContent - Ransom note content
 * @returns {object} Extracted contact information by type
 *
 * @example
 * ```typescript
 * const contacts = extractContactInfo(note);
 * // Result: {
 * //   emails: ['attacker@example.com'],
 * //   torUrls: ['http://abc123.onion'],
 * //   telegram: ['@attackerbot']
 * // }
 * ```
 */
export declare const extractContactInfo: (noteContent: string) => {
    emails: string[];
    torUrls: string[];
    telegram: string[];
};
/**
 * Detects ransom note language using NLP.
 *
 * @param {string} noteContent - Ransom note content
 * @returns {Promise<string>} Detected language code (ISO 639-1)
 *
 * @example
 * ```typescript
 * const lang = await detectNoteLanguage(note);
 * // Result: 'en' or 'ru' or 'es'
 * ```
 */
export declare const detectNoteLanguage: (noteContent: string) => Promise<string>;
/**
 * Extracts ransom amount and currency from note.
 *
 * @param {string} noteContent - Ransom note content
 * @returns {object | null} Ransom amount and currency or null
 *
 * @example
 * ```typescript
 * const ransom = extractRansomAmount(note);
 * // Result: { amount: 5, currency: 'BTC' }
 * ```
 */
export declare const extractRansomAmount: (noteContent: string) => {
    amount: number;
    currency: string;
} | null;
/**
 * Generates ransom note signature for family identification.
 *
 * @param {string} noteContent - Ransom note content
 * @returns {string} Unique signature hash
 *
 * @example
 * ```typescript
 * const signature = generateNoteSignature(note);
 * // Result: 'a1b2c3d4e5f6...' (SHA256 of normalized content)
 * ```
 */
export declare const generateNoteSignature: (noteContent: string) => string;
/**
 * Tracks Bitcoin wallet associated with ransomware campaigns.
 *
 * @param {string} address - Bitcoin wallet address
 * @returns {Promise<BitcoinWallet>} Wallet tracking data
 * @throws {Error} If address is invalid
 *
 * @example
 * ```typescript
 * const wallet = await trackBitcoinWallet('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa');
 * // Result: {
 * //   address: '1A1z...',
 * //   balance: 50.5,
 * //   transactionCount: 125,
 * //   associatedRansomware: ['LockBit', 'Conti']
 * // }
 * ```
 */
export declare const trackBitcoinWallet: (address: string) => Promise<BitcoinWallet>;
/**
 * Retrieves transaction history for a Bitcoin wallet.
 *
 * @param {string} address - Bitcoin wallet address
 * @param {number} [limit] - Maximum number of transactions to retrieve
 * @returns {Promise<BlockchainTransaction[]>} Transaction history
 *
 * @example
 * ```typescript
 * const txs = await getWalletTransactions('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 50);
 * // Result: [{ txid: '...', amount: 5.5, timestamp: ... }, ...]
 * ```
 */
export declare const getWalletTransactions: (address: string, limit?: number) => Promise<BlockchainTransaction[]>;
/**
 * Calculates total revenue for a ransomware campaign from wallet addresses.
 *
 * @param {string[]} walletAddresses - Array of wallet addresses
 * @returns {Promise<number>} Total revenue in BTC
 *
 * @example
 * ```typescript
 * const revenue = await calculateCampaignRevenue([
 *   '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
 *   '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2'
 * ]);
 * // Result: 125.75
 * ```
 */
export declare const calculateCampaignRevenue: (walletAddresses: string[]) => Promise<number>;
/**
 * Identifies wallet clustering and related addresses.
 *
 * @param {string} seedAddress - Starting wallet address
 * @param {number} [depth] - Clustering depth level
 * @returns {Promise<string[]>} Related wallet addresses
 *
 * @example
 * ```typescript
 * const cluster = await identifyWalletCluster('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 2);
 * // Result: ['1BvBMS...', '3J98t1...', ...]
 * ```
 */
export declare const identifyWalletCluster: (seedAddress: string, depth?: number) => Promise<string[]>;
/**
 * Monitors Bitcoin wallet for new transactions.
 *
 * @param {string} address - Wallet address to monitor
 * @param {(tx: BlockchainTransaction) => void} callback - Callback for new transactions
 * @returns {Promise<() => void>} Cleanup function to stop monitoring
 *
 * @example
 * ```typescript
 * const stopMonitoring = await monitorWalletActivity(
 *   '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
 *   (tx) => console.log('New transaction:', tx)
 * );
 * // Later: stopMonitoring();
 * ```
 */
export declare const monitorWalletActivity: (address: string, callback: (tx: BlockchainTransaction) => void) => Promise<() => void>;
/**
 * Calculates risk score for Bitcoin wallet based on ransomware associations.
 *
 * @param {BitcoinWallet} wallet - Wallet data
 * @returns {number} Risk score (0-100)
 *
 * @example
 * ```typescript
 * const risk = calculateWalletRiskScore(walletData);
 * // Result: 85 (high risk)
 * ```
 */
export declare const calculateWalletRiskScore: (wallet: BitcoinWallet) => number;
/**
 * Records a new ransomware victim in the database.
 *
 * @param {Omit<RansomwareVictim, 'id'>} victimData - Victim information
 * @returns {Promise<RansomwareVictim>} Created victim record
 * @throws {Error} If required fields are missing
 *
 * @example
 * ```typescript
 * const victim = await recordRansomwareVictim({
 *   organization: 'Acme Corp',
 *   industry: 'healthcare',
 *   country: 'US',
 *   detectionDate: new Date(),
 *   ransomwareFamily: 'LockBit',
 *   paid: false,
 *   dataLeaked: false,
 *   impactSeverity: 'high'
 * });
 * ```
 */
export declare const recordRansomwareVictim: (victimData: Omit<RansomwareVictim, "id">) => Promise<RansomwareVictim>;
/**
 * Retrieves victims by ransomware family.
 *
 * @param {string} familyName - Ransomware family name
 * @param {object} [filters] - Optional filters
 * @returns {Promise<RansomwareVictim[]>} List of victims
 *
 * @example
 * ```typescript
 * const victims = await getVictimsByFamily('LockBit', {
 *   industry: 'healthcare',
 *   dateRange: { start: new Date('2024-01-01'), end: new Date('2024-12-31') }
 * });
 * ```
 */
export declare const getVictimsByFamily: (familyName: string, filters?: {
    industry?: string;
    country?: string;
    dateRange?: {
        start: Date;
        end: Date;
    };
}) => Promise<RansomwareVictim[]>;
/**
 * Analyzes victim industry trends for threat intelligence.
 *
 * @param {string} ransomwareFamily - Optional family filter
 * @param {number} [months] - Number of months to analyze
 * @returns {Promise<Record<string, number>>} Industry distribution
 *
 * @example
 * ```typescript
 * const trends = await analyzeVictimIndustryTrends('LockBit', 6);
 * // Result: { healthcare: 45, finance: 30, manufacturing: 25 }
 * ```
 */
export declare const analyzeVictimIndustryTrends: (ransomwareFamily?: string, months?: number) => Promise<Record<string, number>>;
/**
 * Correlates victims to identify coordinated campaigns.
 *
 * @param {string[]} victimIds - Array of victim IDs
 * @returns {Promise<object>} Correlation analysis results
 *
 * @example
 * ```typescript
 * const correlation = await correlateVictims(['vic1', 'vic2', 'vic3']);
 * // Result: {
 * //   commonFamily: 'LockBit',
 * //   timeProximity: true,
 * //   geographicCluster: true,
 * //   campaignId: 'camp_123'
 * // }
 * ```
 */
export declare const correlateVictims: (victimIds: string[]) => Promise<{
    commonFamily?: string;
    timeProximity: boolean;
    geographicCluster: boolean;
    campaignId?: string;
}>;
/**
 * Calculates payment statistics for ransomware victims.
 *
 * @param {string} [familyName] - Optional family filter
 * @returns {Promise<object>} Payment statistics
 *
 * @example
 * ```typescript
 * const stats = await calculatePaymentStatistics('LockBit');
 * // Result: {
 * //   totalVictims: 150,
 * //   paidCount: 45,
 * //   paymentRate: 0.30,
 * //   averageRansom: 2.5,
 * //   totalRevenue: 112.5
 * // }
 * ```
 */
export declare const calculatePaymentStatistics: (familyName?: string) => Promise<{
    totalVictims: number;
    paidCount: number;
    paymentRate: number;
    averageRansom: number;
    totalRevenue: number;
}>;
/**
 * Detects encryption algorithm from encrypted file sample.
 *
 * @param {Buffer} fileBuffer - Encrypted file buffer
 * @returns {Promise<EncryptionSignature>} Detected encryption signature
 * @throws {Error} If detection fails
 *
 * @example
 * ```typescript
 * const signature = await detectEncryptionAlgorithm(encryptedFileBuffer);
 * // Result: {
 * //   algorithm: 'AES',
 * //   keyLength: 256,
 * //   mode: 'CBC',
 * //   fileMarkers: ['0x52534132'],
 * //   entropyThreshold: 7.95
 * // }
 * ```
 */
export declare const detectEncryptionAlgorithm: (fileBuffer: Buffer) => Promise<EncryptionSignature>;
/**
 * Calculates file entropy to detect encryption.
 *
 * @param {Buffer} fileBuffer - File buffer
 * @returns {number} Shannon entropy score (0-8)
 *
 * @example
 * ```typescript
 * const entropy = calculateFileEntropy(fileBuffer);
 * // Result: 7.95 (high entropy indicates encryption)
 * ```
 */
export declare const calculateFileEntropy: (fileBuffer: Buffer) => number;
/**
 * Extracts encryption markers from file header.
 *
 * @param {Buffer} fileBuffer - File buffer
 * @param {number} [headerSize] - Header size to analyze (default: 512 bytes)
 * @returns {string[]} Detected marker patterns
 *
 * @example
 * ```typescript
 * const markers = extractEncryptionMarkers(fileBuffer, 1024);
 * // Result: ['0xDEADBEEF', '0x52534132']
 * ```
 */
export declare const extractEncryptionMarkers: (fileBuffer: Buffer, headerSize?: number) => string[];
/**
 * Identifies encryption mode from ciphertext patterns.
 *
 * @param {Buffer} ciphertext - Encrypted data
 * @returns {string} Detected encryption mode (CBC, ECB, CTR, etc.)
 *
 * @example
 * ```typescript
 * const mode = identifyEncryptionMode(encryptedData);
 * // Result: 'CBC'
 * ```
 */
export declare const identifyEncryptionMode: (ciphertext: Buffer) => string;
/**
 * Compares encryption signature against known ransomware families.
 *
 * @param {EncryptionSignature} signature - Encryption signature
 * @returns {Promise<Array<RansomwareFamily & { matchScore: number }>>} Matching families
 *
 * @example
 * ```typescript
 * const matches = await matchEncryptionSignature(detectedSignature);
 * // Result: [{ name: 'LockBit', matchScore: 0.92, ... }]
 * ```
 */
export declare const matchEncryptionSignature: (signature: EncryptionSignature) => Promise<Array<RansomwareFamily & {
    matchScore: number;
}>>;
/**
 * Checks if a decryption tool exists for a ransomware family.
 *
 * @param {string} ransomwareFamily - Ransomware family name
 * @returns {Promise<DecryptionTool | null>} Available decryption tool or null
 *
 * @example
 * ```typescript
 * const tool = await checkDecryptionToolAvailability('GandCrab');
 * // Result: {
 * //   name: 'GandCrab Decryptor',
 * //   vendor: 'Bitdefender',
 * //   effectivenessRate: 0.95,
 * //   downloadUrl: 'https://...'
 * // }
 * ```
 */
export declare const checkDecryptionToolAvailability: (ransomwareFamily: string) => Promise<DecryptionTool | null>;
/**
 * Retrieves all available decryption tools from known sources.
 *
 * @returns {Promise<DecryptionTool[]>} List of available tools
 *
 * @example
 * ```typescript
 * const tools = await getAvailableDecryptionTools();
 * // Result: [{ name: 'Tool1', supportedFamilies: [...], ... }, ...]
 * ```
 */
export declare const getAvailableDecryptionTools: () => Promise<DecryptionTool[]>;
/**
 * Recommends decryption tool based on ransomware sample analysis.
 *
 * @param {object} analysisData - Ransomware analysis data
 * @returns {Promise<DecryptionTool[]>} Recommended tools ranked by effectiveness
 *
 * @example
 * ```typescript
 * const recommendations = await recommendDecryptionTool({
 *   family: 'GandCrab',
 *   version: '5.2',
 *   encryptionSignature: {...}
 * });
 * ```
 */
export declare const recommendDecryptionTool: (analysisData: {
    family?: string;
    version?: string;
    encryptionSignature?: EncryptionSignature;
}) => Promise<DecryptionTool[]>;
/**
 * Validates decryption tool effectiveness against encrypted sample.
 *
 * @param {string} toolId - Decryption tool ID
 * @param {Buffer} encryptedSample - Encrypted file sample
 * @returns {Promise<{ success: boolean; confidence: number }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateDecryptionTool('tool_123', encryptedBuffer);
 * // Result: { success: true, confidence: 0.87 }
 * ```
 */
export declare const validateDecryptionTool: (toolId: string, encryptedSample: Buffer) => Promise<{
    success: boolean;
    confidence: number;
}>;
/**
 * Tracks decryption tool update status and version changes.
 *
 * @param {string} toolId - Decryption tool ID
 * @returns {Promise<object>} Tool update information
 *
 * @example
 * ```typescript
 * const updates = await trackDecryptionToolUpdates('tool_123');
 * // Result: {
 * //   currentVersion: '2.1.0',
 * //   lastUpdated: '2025-01-15',
 * //   changelog: [...],
 * //   newFamiliesSupported: ['NewRansomware']
 * // }
 * ```
 */
export declare const trackDecryptionToolUpdates: (toolId: string) => Promise<{
    currentVersion: string;
    lastUpdated: string;
    changelog: string[];
    newFamiliesSupported: string[];
}>;
/**
 * Creates a new ransomware campaign record.
 *
 * @param {Omit<RansomwareCampaign, 'id'>} campaignData - Campaign information
 * @returns {Promise<RansomwareCampaign>} Created campaign
 * @throws {Error} If required fields are missing
 *
 * @example
 * ```typescript
 * const campaign = await createRansomwareCampaign({
 *   name: 'LockBit Winter 2025',
 *   ransomwareFamily: 'LockBit',
 *   startDate: new Date('2025-01-01'),
 *   targetedRegions: ['US', 'EU'],
 *   targetedIndustries: ['healthcare', 'finance'],
 *   distributionMethod: ['phishing', 'RDP'],
 *   status: 'active'
 * });
 * ```
 */
export declare const createRansomwareCampaign: (campaignData: Omit<RansomwareCampaign, "id" | "victimCount" | "totalRevenue" | "iocs">) => Promise<RansomwareCampaign>;
/**
 * Links victim to a ransomware campaign.
 *
 * @param {string} campaignId - Campaign ID
 * @param {string} victimId - Victim ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await linkVictimToCampaign('campaign_123', 'victim_456');
 * ```
 */
export declare const linkVictimToCampaign: (campaignId: string, victimId: string) => Promise<void>;
/**
 * Retrieves active ransomware campaigns.
 *
 * @param {object} [filters] - Optional filters
 * @returns {Promise<RansomwareCampaign[]>} Active campaigns
 *
 * @example
 * ```typescript
 * const campaigns = await getActiveCampaigns({
 *   ransomwareFamily: 'LockBit',
 *   targetedRegion: 'US'
 * });
 * ```
 */
export declare const getActiveCampaigns: (filters?: {
    ransomwareFamily?: string;
    targetedRegion?: string;
    targetedIndustry?: string;
}) => Promise<RansomwareCampaign[]>;
/**
 * Analyzes campaign effectiveness and victim conversion rate.
 *
 * @param {string} campaignId - Campaign ID
 * @returns {Promise<object>} Campaign analytics
 *
 * @example
 * ```typescript
 * const analytics = await analyzeCampaignEffectiveness('campaign_123');
 * // Result: {
 * //   victimCount: 150,
 * //   paymentRate: 0.30,
 * //   averageRansom: 2.5,
 * //   totalRevenue: 112.5,
 * //   peakActivity: '2025-01-15'
 * // }
 * ```
 */
export declare const analyzeCampaignEffectiveness: (campaignId: string) => Promise<{
    victimCount: number;
    paymentRate: number;
    averageRansom: number;
    totalRevenue: number;
    peakActivity: string;
}>;
/**
 * Correlates IOCs across multiple campaigns to identify operators.
 *
 * @param {string[]} campaignIds - Array of campaign IDs
 * @returns {Promise<object>} Correlation results
 *
 * @example
 * ```typescript
 * const correlation = await correlateCampaignIOCs(['camp1', 'camp2', 'camp3']);
 * // Result: {
 * //   sharedInfrastructure: ['192.168.1.1', 'evil.com'],
 * //   commonTTPs: ['T1486', 'T1490'],
 * //   operatorConfidence: 0.85
 * // }
 * ```
 */
export declare const correlateCampaignIOCs: (campaignIds: string[]) => Promise<{
    sharedInfrastructure: string[];
    commonTTPs: string[];
    operatorConfidence: number;
}>;
/**
 * Updates campaign status based on activity monitoring.
 *
 * @param {string} campaignId - Campaign ID
 * @param {'active' | 'dormant' | 'terminated'} status - New status
 * @returns {Promise<RansomwareCampaign>} Updated campaign
 *
 * @example
 * ```typescript
 * const updated = await updateCampaignStatus('campaign_123', 'dormant');
 * ```
 */
export declare const updateCampaignStatus: (campaignId: string, status: "active" | "dormant" | "terminated") => Promise<RansomwareCampaign>;
declare const _default: {
    identifyRansomwareByHash: (fileHash: string, behaviors: string[]) => Promise<RansomwareFamily | null>;
    identifyRansomwareByNote: (noteContent: string) => Promise<Array<RansomwareFamily & {
        confidence: number;
    }>>;
    identifyRansomwareByExtension: (extension: string) => Promise<RansomwareFamily[]>;
    identifyRansomwareByEncryption: (signature: EncryptionSignature) => Promise<RansomwareFamily[]>;
    identifyRansomwareByTTP: (ttps: string[]) => Promise<Array<RansomwareFamily & {
        matchScore: number;
    }>>;
    createRansomwareFamilyProfile: (indicators: {
        name: string;
        fileHash?: string;
        extension?: string;
        noteContent?: string;
        ttps?: string[];
        encryptionAlgo?: string;
    }) => Promise<RansomwareFamily>;
    parseRansomNote: (noteContent: string) => Promise<RansomNote>;
    extractWalletAddresses: (noteContent: string) => string[];
    extractContactInfo: (noteContent: string) => {
        emails: string[];
        torUrls: string[];
        telegram: string[];
    };
    detectNoteLanguage: (noteContent: string) => Promise<string>;
    extractRansomAmount: (noteContent: string) => {
        amount: number;
        currency: string;
    } | null;
    generateNoteSignature: (noteContent: string) => string;
    trackBitcoinWallet: (address: string) => Promise<BitcoinWallet>;
    getWalletTransactions: (address: string, limit?: number) => Promise<BlockchainTransaction[]>;
    calculateCampaignRevenue: (walletAddresses: string[]) => Promise<number>;
    identifyWalletCluster: (seedAddress: string, depth?: number) => Promise<string[]>;
    monitorWalletActivity: (address: string, callback: (tx: BlockchainTransaction) => void) => Promise<() => void>;
    calculateWalletRiskScore: (wallet: BitcoinWallet) => number;
    recordRansomwareVictim: (victimData: Omit<RansomwareVictim, "id">) => Promise<RansomwareVictim>;
    getVictimsByFamily: (familyName: string, filters?: {
        industry?: string;
        country?: string;
        dateRange?: {
            start: Date;
            end: Date;
        };
    }) => Promise<RansomwareVictim[]>;
    analyzeVictimIndustryTrends: (ransomwareFamily?: string, months?: number) => Promise<Record<string, number>>;
    correlateVictims: (victimIds: string[]) => Promise<{
        commonFamily?: string;
        timeProximity: boolean;
        geographicCluster: boolean;
        campaignId?: string;
    }>;
    calculatePaymentStatistics: (familyName?: string) => Promise<{
        totalVictims: number;
        paidCount: number;
        paymentRate: number;
        averageRansom: number;
        totalRevenue: number;
    }>;
    detectEncryptionAlgorithm: (fileBuffer: Buffer) => Promise<EncryptionSignature>;
    calculateFileEntropy: (fileBuffer: Buffer) => number;
    extractEncryptionMarkers: (fileBuffer: Buffer, headerSize?: number) => string[];
    identifyEncryptionMode: (ciphertext: Buffer) => string;
    matchEncryptionSignature: (signature: EncryptionSignature) => Promise<Array<RansomwareFamily & {
        matchScore: number;
    }>>;
    checkDecryptionToolAvailability: (ransomwareFamily: string) => Promise<DecryptionTool | null>;
    getAvailableDecryptionTools: () => Promise<DecryptionTool[]>;
    recommendDecryptionTool: (analysisData: {
        family?: string;
        version?: string;
        encryptionSignature?: EncryptionSignature;
    }) => Promise<DecryptionTool[]>;
    validateDecryptionTool: (toolId: string, encryptedSample: Buffer) => Promise<{
        success: boolean;
        confidence: number;
    }>;
    trackDecryptionToolUpdates: (toolId: string) => Promise<{
        currentVersion: string;
        lastUpdated: string;
        changelog: string[];
        newFamiliesSupported: string[];
    }>;
    createRansomwareCampaign: (campaignData: Omit<RansomwareCampaign, "id" | "victimCount" | "totalRevenue" | "iocs">) => Promise<RansomwareCampaign>;
    linkVictimToCampaign: (campaignId: string, victimId: string) => Promise<void>;
    getActiveCampaigns: (filters?: {
        ransomwareFamily?: string;
        targetedRegion?: string;
        targetedIndustry?: string;
    }) => Promise<RansomwareCampaign[]>;
    analyzeCampaignEffectiveness: (campaignId: string) => Promise<{
        victimCount: number;
        paymentRate: number;
        averageRansom: number;
        totalRevenue: number;
        peakActivity: string;
    }>;
    correlateCampaignIOCs: (campaignIds: string[]) => Promise<{
        sharedInfrastructure: string[];
        commonTTPs: string[];
        operatorConfidence: number;
    }>;
    updateCampaignStatus: (campaignId: string, status: "active" | "dormant" | "terminated") => Promise<RansomwareCampaign>;
};
export default _default;
//# sourceMappingURL=ransomware-tracking-kit.d.ts.map