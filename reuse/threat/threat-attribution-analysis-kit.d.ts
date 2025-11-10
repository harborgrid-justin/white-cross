/**
 * LOC: THATA1234567
 * File: /reuse/threat/threat-attribution-analysis-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence services
 *   - Actor profiling modules
 *   - Security operations centers
 */
/**
 * File: /reuse/threat/threat-attribution-analysis-kit.ts
 * Locator: WC-UTL-THATA-001
 * Purpose: Advanced Threat Attribution Analysis - multi-factor attribution scoring, infrastructure analysis,
 *          code similarity, linguistic analysis, geolocation intelligence, confidence scoring, evidence management
 *
 * Upstream: Independent utility module for threat attribution analysis
 * Downstream: ../backend/*, Threat intelligence services, Attribution engines, Forensics teams
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Swagger/OpenAPI, bcrypt, helmet
 * Exports: 40 utility functions for attribution analysis, evidence management, and source tracking
 *
 * LLM Context: Comprehensive threat attribution utilities for White Cross security platform.
 * Provides multi-factor attribution scoring, infrastructure correlation, code similarity analysis, linguistic patterns,
 * geolocation intelligence, attribution confidence calculation, evidence management with NestJS security patterns.
 */
interface AttributionAnalysis {
    id: string;
    targetId: string;
    targetType: 'campaign' | 'incident' | 'malware' | 'attack' | 'infrastructure';
    attributionScore: number;
    topCandidates: AttributionCandidate[];
    evidenceCollection: AttributionEvidence[];
    analysisMethod: 'automated' | 'manual' | 'hybrid';
    analysisDate: Date;
    analyst?: string;
    validatedBy?: string;
    validationDate?: Date;
    status: 'pending' | 'in-progress' | 'completed' | 'validated' | 'disputed';
    metadata?: Record<string, unknown>;
}
interface AttributionCandidate {
    actorId: string;
    actorName: string;
    attributionScore: number;
    confidence: number;
    evidenceCount: number;
    matchingFactors: AttributionFactor[];
    likelihood: 'very-low' | 'low' | 'medium' | 'high' | 'very-high';
    rank: number;
}
interface AttributionFactor {
    factorType: 'ttp' | 'infrastructure' | 'malware' | 'code-similarity' | 'linguistic' | 'geolocation' | 'timing' | 'target-pattern' | 'tool-fingerprint';
    score: number;
    weight: number;
    confidence: number;
    description: string;
    evidence: string[];
    source?: string;
    timestamp: Date;
}
interface AttributionEvidence {
    id: string;
    evidenceType: 'technical' | 'behavioral' | 'contextual' | 'intelligence' | 'forensic';
    category: string;
    description: string;
    reliability: 'low' | 'medium' | 'high' | 'verified';
    confidence: number;
    source: string;
    collectedAt: Date;
    collectedBy?: string;
    encryptedData?: string;
    relatedEvidence: string[];
    validationStatus: 'pending' | 'verified' | 'disputed' | 'rejected';
    metadata?: Record<string, unknown>;
}
interface InfrastructureCorrelation {
    infrastructureId: string;
    infrastructureType: 'domain' | 'ip' | 'url' | 'email' | 'certificate' | 'asn' | 'registrar';
    value: string;
    relatedActors: string[];
    correlationStrength: number;
    firstSeen: Date;
    lastSeen: Date;
    observationCount: number;
    registrationData?: RegistrationData;
    whoisData?: WhoisData;
    sslCertificate?: SSLCertificateData;
    dnsRecords?: DNSRecordData[];
    geolocationData?: GeolocationData;
}
interface RegistrationData {
    registrar: string;
    registrationDate?: Date;
    expirationDate?: Date;
    registrant?: string;
    registrantOrg?: string;
    registrantEmail?: string;
    nameservers: string[];
    privacyProtected: boolean;
}
interface WhoisData {
    domain: string;
    registrar: string;
    creationDate?: Date;
    updateDate?: Date;
    expirationDate?: Date;
    status: string[];
    nameservers: string[];
    dnssec: boolean;
}
interface SSLCertificateData {
    serialNumber: string;
    issuer: string;
    subject: string;
    validFrom: Date;
    validTo: Date;
    fingerprint: string;
    algorithm: string;
    subjectAltNames: string[];
}
interface DNSRecordData {
    recordType: 'A' | 'AAAA' | 'MX' | 'TXT' | 'NS' | 'CNAME' | 'SOA';
    value: string;
    ttl: number;
    firstSeen: Date;
    lastSeen: Date;
}
interface PassiveDNSData {
    domain: string;
    ipAddress: string;
    firstSeen: Date;
    lastSeen: Date;
    recordType: string;
    source: string;
}
interface CodeSimilarityAnalysis {
    sampleId: string;
    comparisonSampleId: string;
    similarityScore: number;
    matchingFunctions: CodeFunction[];
    matchingStrings: string[];
    sharedLibraries: string[];
    compilationSimilarity: number;
    behaviorSimilarity: number;
    cryptographicSimilarity: number;
    analysisMethod: 'fuzzy-hash' | 'ssdeep' | 'tlsh' | 'yara' | 'ml-based' | 'hybrid';
    analysisDate: Date;
}
interface CodeFunction {
    functionName: string;
    functionHash: string;
    matchPercentage: number;
    category: 'cryptographic' | 'network' | 'file-io' | 'persistence' | 'evasion' | 'payload';
}
interface LinguisticAnalysis {
    textId: string;
    textType: 'ransom-note' | 'command' | 'comment' | 'error-message' | 'ui-text';
    language: string;
    languageConfidence: number;
    dialectVariant?: string;
    writingStyle: WritingStyle;
    commonPhrases: string[];
    characteristicTerms: string[];
    grammarPatterns: GrammarPattern[];
    translationIndicators: TranslationIndicator[];
    attributionClues: string[];
    relatedSamples: string[];
}
interface WritingStyle {
    formality: 'very-informal' | 'informal' | 'neutral' | 'formal' | 'very-formal';
    tone: 'threatening' | 'professional' | 'casual' | 'technical' | 'mixed';
    vocabulary: 'basic' | 'intermediate' | 'advanced' | 'technical';
    sentenceComplexity: 'simple' | 'moderate' | 'complex';
    characteristicFeatures: string[];
}
interface GrammarPattern {
    pattern: string;
    frequency: number;
    significance: 'low' | 'medium' | 'high';
    examples: string[];
}
interface TranslationIndicator {
    indicatorType: 'machine-translation' | 'non-native' | 'literal-translation' | 'idiom-misuse';
    confidence: number;
    examples: string[];
    likelySourceLanguage?: string;
}
interface GeolocationIntelligence {
    infrastructureId: string;
    ipAddress?: string;
    country: string;
    countryCode: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    timezone?: string;
    isp?: string;
    organization?: string;
    asn?: string;
    asnOrganization?: string;
    connectionType?: 'broadband' | 'corporate' | 'hosting' | 'vpn' | 'tor' | 'mobile';
    vpnDetection: VPNDetection;
    proxyDetection: ProxyDetection;
    historicalLocations: HistoricalLocation[];
    confidence: number;
}
interface VPNDetection {
    isVPN: boolean;
    confidence: number;
    vpnProvider?: string;
    indicators: string[];
}
interface ProxyDetection {
    isProxy: boolean;
    proxyType?: 'transparent' | 'anonymous' | 'elite' | 'tor';
    confidence: number;
}
interface HistoricalLocation {
    country: string;
    city?: string;
    observedAt: Date;
    frequency: number;
}
interface AttributionConfidenceScore {
    overallConfidence: number;
    factorContributions: FactorContribution[];
    evidenceQuality: number;
    evidenceQuantity: number;
    evidenceDiversity: number;
    temporalConsistency: number;
    sourceCreditability: number;
    conflictingEvidence: number;
    confidenceLevel: 'very-low' | 'low' | 'medium' | 'high' | 'very-high';
    uncertaintyFactors: string[];
    recommendations: string[];
}
interface FactorContribution {
    factorType: string;
    contribution: number;
    weight: number;
    reliability: number;
}
interface TimingPatternAnalysis {
    actorId?: string;
    campaignId?: string;
    activityPattern: 'continuous' | 'business-hours' | 'off-hours' | 'weekend-focused' | 'intermittent';
    primaryTimezone?: string;
    timezoneConfidence: number;
    activityWindows: ActivityWindow[];
    observedHolidays: ObservedHoliday[];
    operationalTempo: 'slow' | 'moderate' | 'fast' | 'very-fast';
    downtimePeriods: DowntimePeriod[];
    correlatedActivities: CorrelatedActivity[];
}
interface ActivityWindow {
    startHour: number;
    endHour: number;
    daysOfWeek: number[];
    frequency: number;
    timezone: string;
}
interface ObservedHoliday {
    date: Date;
    holiday: string;
    country: string;
    activityLevel: 'none' | 'reduced' | 'normal';
}
interface DowntimePeriod {
    startDate: Date;
    endDate: Date;
    reason?: 'holiday' | 'maintenance' | 'retooling' | 'unknown';
    durationHours: number;
}
interface CorrelatedActivity {
    eventType: string;
    timestamp: Date;
    correlation: number;
    description: string;
}
interface TargetPatternAnalysis {
    actorId?: string;
    targetCategories: TargetCategory[];
    geographicFocus: GeographicFocus[];
    sectorFocus: SectorFocus[];
    victimProfile: VictimProfile;
    targetingStrategy: 'opportunistic' | 'selective' | 'highly-targeted' | 'indiscriminate';
    victimCount: number;
    successRate?: number;
    preferredVictimSize: 'small' | 'medium' | 'large' | 'enterprise' | 'mixed';
    temporalPattern: string;
}
interface TargetCategory {
    category: string;
    count: number;
    percentage: number;
    firstSeen: Date;
    lastSeen: Date;
}
interface GeographicFocus {
    country: string;
    countryCode: string;
    victimCount: number;
    percentage: number;
    priority: 'primary' | 'secondary' | 'tertiary';
}
interface SectorFocus {
    sector: string;
    victimCount: number;
    percentage: number;
    priority: 'primary' | 'secondary' | 'tertiary';
    rationale?: string;
}
interface VictimProfile {
    averageRevenue?: string;
    employeeCountRange?: string;
    securityPosture: 'weak' | 'moderate' | 'strong' | 'unknown';
    commonVulnerabilities: string[];
    commonWeaknesses: string[];
}
interface AttributionReport {
    reportId: string;
    analysisId: string;
    title: string;
    summary: string;
    attributedActor?: string;
    attributionConfidence: number;
    keyFindings: string[];
    evidenceSummary: EvidenceSummary;
    alternativeHypotheses: AlternativeHypothesis[];
    recommendations: string[];
    limitationsAndCaveats: string[];
    analysts: string[];
    reviewers: string[];
    createdAt: Date;
    publishedAt?: Date;
    classification: 'public' | 'tlp-white' | 'tlp-green' | 'tlp-amber' | 'tlp-red';
    distributionList: string[];
}
interface EvidenceSummary {
    totalEvidence: number;
    evidenceByType: Record<string, number>;
    highConfidenceEvidence: number;
    verifiedEvidence: number;
    disputedEvidence: number;
}
interface AlternativeHypothesis {
    actorId?: string;
    actorName?: string;
    hypothesis: string;
    supportingEvidence: string[];
    confidence: number;
    reasonsForRejection: string[];
}
/**
 * Creates a new attribution analysis.
 *
 * @param {Partial<AttributionAnalysis>} data - Analysis data
 * @returns {AttributionAnalysis} Created attribution analysis
 *
 * @example
 * ```typescript
 * const analysis = createAttributionAnalysis({
 *   targetId: 'campaign-123',
 *   targetType: 'campaign',
 *   analysisMethod: 'hybrid',
 *   analyst: 'user-456'
 * });
 * ```
 */
export declare const createAttributionAnalysis: (data: Partial<AttributionAnalysis>) => AttributionAnalysis;
/**
 * Calculates multi-factor attribution score.
 *
 * @param {AttributionFactor[]} factors - Attribution factors
 * @returns {{ score: number; confidence: number; breakdown: Record<string, number> }} Attribution score
 *
 * @example
 * ```typescript
 * const result = calculateMultiFactorAttribution(factors);
 * console.log(`Attribution score: ${result.score}, Confidence: ${result.confidence}`);
 * ```
 */
export declare const calculateMultiFactorAttribution: (factors: AttributionFactor[]) => {
    score: number;
    confidence: number;
    breakdown: Record<string, number>;
};
/**
 * Ranks attribution candidates by score and confidence.
 *
 * @param {AttributionCandidate[]} candidates - Attribution candidates
 * @returns {AttributionCandidate[]} Ranked candidates
 *
 * @example
 * ```typescript
 * const ranked = rankAttributionCandidates(candidates);
 * console.log(`Top candidate: ${ranked[0].actorName}`);
 * ```
 */
export declare const rankAttributionCandidates: (candidates: AttributionCandidate[]) => AttributionCandidate[];
/**
 * Creates attribution evidence entry.
 *
 * @param {Partial<AttributionEvidence>} data - Evidence data
 * @returns {AttributionEvidence} Attribution evidence
 *
 * @example
 * ```typescript
 * const evidence = createAttributionEvidence({
 *   evidenceType: 'technical',
 *   category: 'infrastructure-overlap',
 *   description: 'Domain registered with same registrar',
 *   reliability: 'high'
 * });
 * ```
 */
export declare const createAttributionEvidence: (data: Partial<AttributionEvidence>) => AttributionEvidence;
/**
 * Validates attribution evidence quality and consistency.
 *
 * @param {AttributionEvidence[]} evidence - Evidence to validate
 * @returns {{ valid: boolean; quality: number; issues: string[]; conflicts: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateAttributionEvidence(evidence);
 * console.log(`Evidence quality: ${validation.quality}`);
 * ```
 */
export declare const validateAttributionEvidence: (evidence: AttributionEvidence[]) => {
    valid: boolean;
    quality: number;
    issues: string[];
    conflicts: string[];
};
/**
 * Analyzes evidence diversity for attribution strength.
 *
 * @param {AttributionEvidence[]} evidence - Evidence collection
 * @returns {{ diversityScore: number; types: Record<string, number>; categories: Record<string, number> }} Diversity analysis
 *
 * @example
 * ```typescript
 * const diversity = analyzeEvidenceDiversity(evidence);
 * console.log(`Diversity score: ${diversity.diversityScore}`);
 * ```
 */
export declare const analyzeEvidenceDiversity: (evidence: AttributionEvidence[]) => {
    diversityScore: number;
    types: Record<string, number>;
    categories: Record<string, number>;
};
/**
 * Creates infrastructure correlation entry.
 *
 * @param {Partial<InfrastructureCorrelation>} data - Infrastructure data
 * @returns {InfrastructureCorrelation} Infrastructure correlation
 *
 * @example
 * ```typescript
 * const infra = createInfrastructureCorrelation({
 *   infrastructureType: 'domain',
 *   value: 'evil-c2.com',
 *   relatedActors: ['apt28', 'apt29']
 * });
 * ```
 */
export declare const createInfrastructureCorrelation: (data: Partial<InfrastructureCorrelation>) => InfrastructureCorrelation;
/**
 * Analyzes infrastructure correlation for attribution.
 *
 * @param {InfrastructureCorrelation[]} infrastructure - Infrastructure data
 * @param {string} actorId - Actor to correlate
 * @returns {{ correlation: number; sharedInfra: string[]; patterns: string[] }} Correlation analysis
 *
 * @example
 * ```typescript
 * const correlation = analyzeInfrastructureCorrelation(infrastructure, 'apt28');
 * console.log(`Correlation strength: ${correlation.correlation}`);
 * ```
 */
export declare const analyzeInfrastructureCorrelation: (infrastructure: InfrastructureCorrelation[], actorId: string) => {
    correlation: number;
    sharedInfra: string[];
    patterns: string[];
};
/**
 * Identifies infrastructure pivot points for investigation.
 *
 * @param {InfrastructureCorrelation[]} infrastructure - Infrastructure data
 * @returns {{ pivots: string[]; clusters: Record<string, string[]>; confidence: number }} Pivot points
 *
 * @example
 * ```typescript
 * const pivots = identifyInfrastructurePivots(infrastructure);
 * console.log(`Found ${pivots.pivots.length} pivot points`);
 * ```
 */
export declare const identifyInfrastructurePivots: (infrastructure: InfrastructureCorrelation[]) => {
    pivots: string[];
    clusters: Record<string, string[]>;
    confidence: number;
};
/**
 * Analyzes passive DNS data for attribution.
 *
 * @param {PassiveDNSData[]} passiveDNS - Passive DNS records
 * @returns {{ ipHistory: Record<string, number>; domainAge: number; rotationRate: number }} DNS analysis
 *
 * @example
 * ```typescript
 * const dnsAnalysis = analyzePassiveDNS(passiveDNSRecords);
 * console.log(`Domain age: ${dnsAnalysis.domainAge} days`);
 * ```
 */
export declare const analyzePassiveDNS: (passiveDNS: PassiveDNSData[]) => {
    ipHistory: Record<string, number>;
    domainAge: number;
    rotationRate: number;
};
/**
 * Performs code similarity analysis between samples.
 *
 * @param {string} sampleId - Primary sample ID
 * @param {string} comparisonId - Comparison sample ID
 * @param {object} data - Analysis data
 * @returns {CodeSimilarityAnalysis} Similarity analysis
 *
 * @example
 * ```typescript
 * const similarity = performCodeSimilarity('sample1', 'sample2', {
 *   matchingFunctions: functions,
 *   analysisMethod: 'fuzzy-hash'
 * });
 * ```
 */
export declare const performCodeSimilarity: (sampleId: string, comparisonId: string, data: {
    matchingFunctions?: CodeFunction[];
    matchingStrings?: string[];
    sharedLibraries?: string[];
    compilationSimilarity?: number;
    behaviorSimilarity?: number;
    cryptographicSimilarity?: number;
    analysisMethod?: CodeSimilarityAnalysis["analysisMethod"];
}) => CodeSimilarityAnalysis;
/**
 * Calculates code similarity confidence for attribution.
 *
 * @param {CodeSimilarityAnalysis} analysis - Similarity analysis
 * @returns {{ confidence: number; attributionWeight: number; reasons: string[] }} Confidence calculation
 *
 * @example
 * ```typescript
 * const confidence = calculateCodeSimilarityConfidence(analysis);
 * console.log(`Confidence: ${confidence.confidence}`);
 * ```
 */
export declare const calculateCodeSimilarityConfidence: (analysis: CodeSimilarityAnalysis) => {
    confidence: number;
    attributionWeight: number;
    reasons: string[];
};
/**
 * Identifies code families based on similarity.
 *
 * @param {CodeSimilarityAnalysis[]} analyses - Similarity analyses
 * @param {number} threshold - Similarity threshold for grouping
 * @returns {{ families: string[][]; singletons: string[] }} Code families
 *
 * @example
 * ```typescript
 * const families = identifyCodeFamilies(analyses, 70);
 * console.log(`Found ${families.families.length} code families`);
 * ```
 */
export declare const identifyCodeFamilies: (analyses: CodeSimilarityAnalysis[], threshold?: number) => {
    families: string[][];
    singletons: string[];
};
/**
 * Performs linguistic analysis on text for attribution.
 *
 * @param {string} textId - Text identifier
 * @param {string} text - Text to analyze
 * @param {string} textType - Type of text
 * @returns {LinguisticAnalysis} Linguistic analysis
 *
 * @example
 * ```typescript
 * const analysis = performLinguisticAnalysis('ransom-1', ransomNote, 'ransom-note');
 * console.log(`Language: ${analysis.language}`);
 * ```
 */
export declare const performLinguisticAnalysis: (textId: string, text: string, textType: LinguisticAnalysis["textType"]) => LinguisticAnalysis;
/**
 * Compares linguistic patterns between texts.
 *
 * @param {LinguisticAnalysis} analysis1 - First analysis
 * @param {LinguisticAnalysis} analysis2 - Second analysis
 * @returns {{ similarity: number; commonFeatures: string[] }} Comparison result
 *
 * @example
 * ```typescript
 * const comparison = compareLinguisticPatterns(analysis1, analysis2);
 * console.log(`Linguistic similarity: ${comparison.similarity}`);
 * ```
 */
export declare const compareLinguisticPatterns: (analysis1: LinguisticAnalysis, analysis2: LinguisticAnalysis) => {
    similarity: number;
    commonFeatures: string[];
};
/**
 * Creates geolocation intelligence entry.
 *
 * @param {Partial<GeolocationIntelligence>} data - Geolocation data
 * @returns {GeolocationIntelligence} Geolocation intelligence
 *
 * @example
 * ```typescript
 * const geo = createGeolocationIntelligence({
 *   ipAddress: '192.0.2.1',
 *   country: 'United States',
 *   countryCode: 'US'
 * });
 * ```
 */
export declare const createGeolocationIntelligence: (data: Partial<GeolocationIntelligence>) => GeolocationIntelligence;
/**
 * Analyzes geolocation patterns for attribution.
 *
 * @param {GeolocationIntelligence[]} geoData - Geolocation data
 * @returns {{ primaryCountries: string[]; suspiciousIndicators: string[]; confidence: number }} Geolocation analysis
 *
 * @example
 * ```typescript
 * const geoAnalysis = analyzeGeolocationPatterns(geoData);
 * console.log(`Primary countries: ${geoAnalysis.primaryCountries}`);
 * ```
 */
export declare const analyzeGeolocationPatterns: (geoData: GeolocationIntelligence[]) => {
    primaryCountries: string[];
    suspiciousIndicators: string[];
    confidence: number;
};
/**
 * Correlates geolocation with known actor patterns.
 *
 * @param {GeolocationIntelligence[]} geoData - Geolocation data
 * @param {Record<string, string[]>} actorPatterns - Known actor country patterns
 * @returns {{ matches: Record<string, number>; confidence: number }} Correlation result
 *
 * @example
 * ```typescript
 * const correlation = correlateGeolocationWithActors(geoData, actorPatterns);
 * console.log(`Actor matches:`, correlation.matches);
 * ```
 */
export declare const correlateGeolocationWithActors: (geoData: GeolocationIntelligence[], actorPatterns: Record<string, string[]>) => {
    matches: Record<string, number>;
    confidence: number;
};
/**
 * Calculates overall attribution confidence score.
 *
 * @param {object} data - Attribution data
 * @returns {AttributionConfidenceScore} Confidence score
 *
 * @example
 * ```typescript
 * const confidence = calculateAttributionConfidence({
 *   evidence: evidenceArray,
 *   factors: factorsArray
 * });
 * console.log(`Confidence level: ${confidence.confidenceLevel}`);
 * ```
 */
export declare const calculateAttributionConfidence: (data: {
    evidence: AttributionEvidence[];
    factors: AttributionFactor[];
    temporalConsistency?: number;
}) => AttributionConfidenceScore;
/**
 * Analyzes temporal consistency of attribution evidence.
 *
 * @param {AttributionEvidence[]} evidence - Evidence collection
 * @returns {{ consistency: number; timeline: Date[]; gaps: number }} Temporal analysis
 *
 * @example
 * ```typescript
 * const temporal = analyzeTemporalConsistency(evidence);
 * console.log(`Temporal consistency: ${temporal.consistency}`);
 * ```
 */
export declare const analyzeTemporalConsistency: (evidence: AttributionEvidence[]) => {
    consistency: number;
    timeline: Date[];
    gaps: number;
};
/**
 * Analyzes timing patterns of threat actor activity.
 *
 * @param {object} data - Activity data
 * @returns {TimingPatternAnalysis} Timing pattern analysis
 *
 * @example
 * ```typescript
 * const timingAnalysis = analyzeTimingPatterns({ activities, actorId: 'apt28' });
 * console.log(`Primary timezone: ${timingAnalysis.primaryTimezone}`);
 * ```
 */
export declare const analyzeTimingPatterns: (data: {
    activities: Array<{
        timestamp: Date;
        type: string;
    }>;
    actorId?: string;
    campaignId?: string;
}) => TimingPatternAnalysis;
/**
 * Analyzes target patterns for attribution.
 *
 * @param {object} data - Target data
 * @returns {TargetPatternAnalysis} Target pattern analysis
 *
 * @example
 * ```typescript
 * const targetAnalysis = analyzeTargetPatterns({ victims, actorId: 'apt28' });
 * console.log(`Targeting strategy: ${targetAnalysis.targetingStrategy}`);
 * ```
 */
export declare const analyzeTargetPatterns: (data: {
    victims: Array<{
        sector: string;
        country: string;
        size: string;
    }>;
    actorId?: string;
}) => TargetPatternAnalysis;
/**
 * Generates comprehensive attribution report.
 *
 * @param {object} data - Report data
 * @returns {AttributionReport} Attribution report
 *
 * @example
 * ```typescript
 * const report = generateAttributionReport({
 *   analysisId: 'analysis-123',
 *   title: 'APT28 Attribution Analysis',
 *   attributedActor: 'apt28',
 *   attributionConfidence: 85
 * });
 * ```
 */
export declare const generateAttributionReport: (data: {
    analysisId: string;
    title: string;
    summary: string;
    attributedActor?: string;
    attributionConfidence: number;
    keyFindings: string[];
    evidenceSummary: EvidenceSummary;
    alternativeHypotheses?: AlternativeHypothesis[];
    recommendations: string[];
    analysts: string[];
    classification?: AttributionReport["classification"];
}) => AttributionReport;
/**
 * NestJS service for threat attribution analysis operations.
 *
 * @example
 * ```typescript
 * import { Injectable, Logger, ForbiddenException, NotFoundException } from '@nestjs/common';
 * import { InjectModel } from '@nestjs/sequelize';
 * import { JwtService } from '@nestjs/jwt';
 *
 * @Injectable()
 * export class ThreatAttributionAnalysisService {
 *   private readonly logger = new Logger(ThreatAttributionAnalysisService.name);
 *
 *   constructor(
 *     @InjectModel(AttributionAnalysisModel) private analysisModel: typeof AttributionAnalysisModel,
 *     @InjectModel(AttributionEvidenceModel) private evidenceModel: typeof AttributionEvidenceModel,
 *     @InjectModel(InfrastructureCorrelationModel) private infraModel: typeof InfrastructureCorrelationModel,
 *     private jwtService: JwtService,
 *     private encryptionService: EncryptionService,
 *     private auditService: AuditService,
 *   ) {}
 *
 *   async performAttribution(
 *     targetId: string,
 *     targetType: string,
 *     user: AuthenticatedUser,
 *   ): Promise<AttributionAnalysis> {
 *     if (!user.permissions.includes('attribution:analyze')) {
 *       throw new ForbiddenException('Insufficient permissions');
 *     }
 *
 *     const analysis = createAttributionAnalysis({
 *       targetId,
 *       targetType,
 *       analysisMethod: 'hybrid',
 *       analyst: user.id,
 *       status: 'in-progress',
 *     });
 *
 *     // Gather evidence from multiple sources
 *     const evidence = await this.gatherEvidence(targetId, targetType);
 *     analysis.evidenceCollection = evidence;
 *
 *     // Perform multi-factor attribution
 *     const factors = await this.buildAttributionFactors(evidence, targetId);
 *     const candidates = await this.identifyAttributionCandidates(factors);
 *
 *     analysis.topCandidates = rankAttributionCandidates(candidates);
 *     const topCandidate = analysis.topCandidates[0];
 *
 *     if (topCandidate) {
 *       analysis.attributionScore = topCandidate.attributionScore;
 *     }
 *
 *     analysis.status = 'completed';
 *
 *     const created = await this.analysisModel.create(analysis);
 *
 *     await this.auditService.log({
 *       userId: user.id,
 *       action: 'PERFORM_ATTRIBUTION',
 *       resource: 'attribution-analysis',
 *       resourceId: created.id,
 *       details: {
 *         targetId,
 *         targetType,
 *         topCandidate: topCandidate?.actorId,
 *         score: analysis.attributionScore,
 *       },
 *       severity: 'high',
 *     });
 *
 *     return created;
 *   }
 *
 *   async analyzeInfrastructure(
 *     infrastructureId: string,
 *     user: AuthenticatedUser,
 *   ): Promise<InfrastructureCorrelation> {
 *     const infra = await this.infraModel.findByPk(infrastructureId);
 *     if (!infra) {
 *       throw new NotFoundException('Infrastructure not found');
 *     }
 *
 *     const correlation = analyzeInfrastructureCorrelation(
 *       await this.infraModel.findAll(),
 *       infrastructureId,
 *     );
 *
 *     return correlation;
 *   }
 *
 *   async generateReport(
 *     analysisId: string,
 *     user: AuthenticatedUser,
 *   ): Promise<AttributionReport> {
 *     const analysis = await this.analysisModel.findByPk(analysisId, {
 *       include: ['evidence', 'candidates'],
 *     });
 *
 *     if (!analysis) {
 *       throw new NotFoundException('Analysis not found');
 *     }
 *
 *     const evidenceSummary: EvidenceSummary = {
 *       totalEvidence: analysis.evidenceCollection.length,
 *       evidenceByType: {},
 *       highConfidenceEvidence: analysis.evidenceCollection.filter(e => e.confidence > 70).length,
 *       verifiedEvidence: analysis.evidenceCollection.filter(e => e.validationStatus === 'verified').length,
 *       disputedEvidence: analysis.evidenceCollection.filter(e => e.validationStatus === 'disputed').length,
 *     };
 *
 *     const report = generateAttributionReport({
 *       analysisId,
 *       title: `Attribution Analysis: ${analysis.targetId}`,
 *       summary: 'Comprehensive multi-factor attribution analysis',
 *       attributedActor: analysis.topCandidates[0]?.actorId,
 *       attributionConfidence: analysis.attributionScore,
 *       keyFindings: this.extractKeyFindings(analysis),
 *       evidenceSummary,
 *       recommendations: this.generateRecommendations(analysis),
 *       analysts: [user.id],
 *       classification: 'tlp-amber',
 *     });
 *
 *     return report;
 *   }
 *
 *   private async gatherEvidence(targetId: string, targetType: string): Promise<AttributionEvidence[]> {
 *     // Implementation...
 *     return [];
 *   }
 *
 *   private async buildAttributionFactors(evidence: AttributionEvidence[], targetId: string): Promise<AttributionFactor[]> {
 *     // Implementation...
 *     return [];
 *   }
 *
 *   private async identifyAttributionCandidates(factors: AttributionFactor[]): Promise<AttributionCandidate[]> {
 *     // Implementation...
 *     return [];
 *   }
 *
 *   private extractKeyFindings(analysis: AttributionAnalysis): string[] {
 *     return [
 *       `${analysis.evidenceCollection.length} pieces of evidence collected`,
 *       `Top candidate: ${analysis.topCandidates[0]?.actorName}`,
 *       `Attribution confidence: ${analysis.attributionScore}%`,
 *     ];
 *   }
 *
 *   private generateRecommendations(analysis: AttributionAnalysis): string[] {
 *     return [
 *       'Deploy detection rules for identified TTPs',
 *       'Block associated infrastructure',
 *       'Increase monitoring for similar activity patterns',
 *     ];
 *   }
 * }
 * ```
 */
export declare const createAttributionAnalysisService: () => string;
/**
 * Sequelize models for threat attribution analysis.
 *
 * @example
 * ```typescript
 * import { Table, Column, Model, DataType, HasMany, PrimaryKey, Default } from 'sequelize-typescript';
 *
 * @Table({ tableName: 'attribution_analyses', timestamps: true })
 * export class AttributionAnalysisModel extends Model {
 *   @PrimaryKey
 *   @Default(DataType.UUIDV4)
 *   @Column(DataType.UUID)
 *   id: string;
 *
 *   @Column({ type: DataType.STRING, allowNull: false })
 *   targetId: string;
 *
 *   @Column({
 *     type: DataType.ENUM('campaign', 'incident', 'malware', 'attack', 'infrastructure'),
 *     allowNull: false,
 *   })
 *   targetType: string;
 *
 *   @Column({ type: DataType.INTEGER, defaultValue: 0, validate: { min: 0, max: 100 } })
 *   attributionScore: number;
 *
 *   @Column({ type: DataType.JSONB, defaultValue: [] })
 *   topCandidates: object[];
 *
 *   @Column({ type: DataType.JSONB, defaultValue: [] })
 *   evidenceCollection: object[];
 *
 *   @Column({
 *     type: DataType.ENUM('automated', 'manual', 'hybrid'),
 *     defaultValue: 'automated',
 *   })
 *   analysisMethod: string;
 *
 *   @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
 *   analysisDate: Date;
 *
 *   @Column(DataType.UUID)
 *   analyst: string;
 *
 *   @Column(DataType.UUID)
 *   validatedBy: string;
 *
 *   @Column(DataType.DATE)
 *   validationDate: Date;
 *
 *   @Column({
 *     type: DataType.ENUM('pending', 'in-progress', 'completed', 'validated', 'disputed'),
 *     defaultValue: 'pending',
 *   })
 *   status: string;
 *
 *   @Column({ type: DataType.JSONB, defaultValue: {} })
 *   metadata: object;
 * }
 *
 * @Table({ tableName: 'attribution_evidence', timestamps: true })
 * export class AttributionEvidenceModel extends Model {
 *   @PrimaryKey
 *   @Default(DataType.UUIDV4)
 *   @Column(DataType.UUID)
 *   id: string;
 *
 *   @Column({ type: DataType.UUID, allowNull: false })
 *   analysisId: string;
 *
 *   @Column({
 *     type: DataType.ENUM('technical', 'behavioral', 'contextual', 'intelligence', 'forensic'),
 *     allowNull: false,
 *   })
 *   evidenceType: string;
 *
 *   @Column({ type: DataType.STRING, allowNull: false })
 *   category: string;
 *
 *   @Column(DataType.TEXT)
 *   description: string;
 *
 *   @Column({
 *     type: DataType.ENUM('low', 'medium', 'high', 'verified'),
 *     defaultValue: 'medium',
 *   })
 *   reliability: string;
 *
 *   @Column({ type: DataType.INTEGER, defaultValue: 50, validate: { min: 0, max: 100 } })
 *   confidence: number;
 *
 *   @Column({ type: DataType.STRING, allowNull: false })
 *   source: string;
 *
 *   @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
 *   collectedAt: Date;
 *
 *   @Column(DataType.UUID)
 *   collectedBy: string;
 *
 *   @Column(DataType.TEXT)
 *   encryptedData: string;
 *
 *   @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
 *   relatedEvidence: string[];
 *
 *   @Column({
 *     type: DataType.ENUM('pending', 'verified', 'disputed', 'rejected'),
 *     defaultValue: 'pending',
 *   })
 *   validationStatus: string;
 *
 *   @Column({ type: DataType.JSONB, defaultValue: {} })
 *   metadata: object;
 * }
 * ```
 */
export declare const createAttributionModels: () => string;
/**
 * Swagger API documentation for threat attribution endpoints.
 *
 * @example
 * ```typescript
 * import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
 * import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
 * import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
 * import { RolesGuard } from '../auth/guards/roles.guard';
 * import { Roles } from '../auth/decorators/roles.decorator';
 *
 * @ApiTags('Threat Attribution Analysis')
 * @ApiBearerAuth()
 * @Controller('api/v1/attribution')
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * export class ThreatAttributionController {
 *   constructor(private readonly attributionService: ThreatAttributionAnalysisService) {}
 *
 *   @Post('analyze')
 *   @Roles('analyst', 'admin')
 *   @ApiOperation({ summary: 'Perform threat attribution analysis' })
 *   @ApiResponse({ status: 201, description: 'Attribution analysis completed' })
 *   async performAttribution(
 *     @Body() dto: PerformAttributionDto,
 *     @CurrentUser() user: AuthenticatedUser,
 *   ): Promise<AttributionAnalysis> {
 *     return this.attributionService.performAttribution(dto.targetId, dto.targetType, user);
 *   }
 *
 *   @Get(':id/report')
 *   @Roles('analyst', 'viewer', 'admin')
 *   @ApiOperation({ summary: 'Generate attribution report' })
 *   @ApiResponse({ status: 200, description: 'Report generated successfully' })
 *   async generateReport(
 *     @Param('id') analysisId: string,
 *     @CurrentUser() user: AuthenticatedUser,
 *   ): Promise<AttributionReport> {
 *     return this.attributionService.generateReport(analysisId, user);
 *   }
 * }
 * ```
 */
export declare const createAttributionSwaggerDocs: () => string;
/**
 * Calculates attribution probability distribution.
 *
 * @param {AttributionCandidate[]} candidates - Attribution candidates
 * @returns {{ distribution: Record<string, number>; entropy: number }} Probability distribution
 *
 * @example
 * ```typescript
 * const distribution = calculateAttributionProbability(candidates);
 * console.log(`Entropy: ${distribution.entropy}`);
 * ```
 */
export declare const calculateAttributionProbability: (candidates: AttributionCandidate[]) => {
    distribution: Record<string, number>;
    entropy: number;
};
/**
 * Identifies false positive risks in attribution.
 *
 * @param {AttributionAnalysis} analysis - Attribution analysis
 * @returns {{ riskLevel: string; indicators: string[]; mitigation: string[] }} False positive analysis
 *
 * @example
 * ```typescript
 * const fpRisk = identifyFalsePositiveRisks(analysis);
 * console.log(`False positive risk: ${fpRisk.riskLevel}`);
 * ```
 */
export declare const identifyFalsePositiveRisks: (analysis: AttributionAnalysis) => {
    riskLevel: "low" | "medium" | "high";
    indicators: string[];
    mitigation: string[];
};
/**
 * Generates alternative attribution hypotheses.
 *
 * @param {AttributionAnalysis} analysis - Attribution analysis
 * @returns {AlternativeHypothesis[]} Alternative hypotheses
 *
 * @example
 * ```typescript
 * const alternatives = generateAlternativeHypotheses(analysis);
 * console.log(`Generated ${alternatives.length} alternative hypotheses`);
 * ```
 */
export declare const generateAlternativeHypotheses: (analysis: AttributionAnalysis) => AlternativeHypothesis[];
/**
 * Compares multiple attribution analyses.
 *
 * @param {AttributionAnalysis[]} analyses - Analyses to compare
 * @returns {{ consensus: string | null; divergence: number; agreements: string[] }} Comparison result
 *
 * @example
 * ```typescript
 * const comparison = compareAttributionAnalyses([analysis1, analysis2, analysis3]);
 * console.log(`Consensus: ${comparison.consensus}`);
 * ```
 */
export declare const compareAttributionAnalyses: (analyses: AttributionAnalysis[]) => {
    consensus: string | null;
    divergence: number;
    agreements: string[];
    conflicts: string[];
};
/**
 * Calculates attribution decay over time.
 *
 * @param {AttributionAnalysis} analysis - Attribution analysis
 * @param {number} daysSinceAnalysis - Days since analysis performed
 * @returns {{ decayedConfidence: number; freshness: string; recommendations: string[] }} Decay calculation
 *
 * @example
 * ```typescript
 * const decay = calculateAttributionDecay(analysis, 180);
 * console.log(`Decayed confidence: ${decay.decayedConfidence}`);
 * ```
 */
export declare const calculateAttributionDecay: (analysis: AttributionAnalysis, daysSinceAnalysis: number) => {
    decayedConfidence: number;
    freshness: "fresh" | "aging" | "stale" | "outdated";
    recommendations: string[];
};
/**
 * Generates attribution confidence interval.
 *
 * @param {AttributionAnalysis} analysis - Attribution analysis
 * @param {number} confidenceLevel - Confidence level (e.g., 95)
 * @returns {{ lower: number; upper: number; mean: number }} Confidence interval
 *
 * @example
 * ```typescript
 * const interval = generateAttributionConfidenceInterval(analysis, 95);
 * console.log(`95% CI: [${interval.lower}, ${interval.upper}]`);
 * ```
 */
export declare const generateAttributionConfidenceInterval: (analysis: AttributionAnalysis, confidenceLevel?: number) => {
    lower: number;
    upper: number;
    mean: number;
};
/**
 * Identifies attribution bias risks.
 *
 * @param {AttributionAnalysis} analysis - Attribution analysis
 * @param {object} context - Analysis context
 * @returns {{ biases: string[]; severity: string; mitigation: string[] }} Bias analysis
 *
 * @example
 * ```typescript
 * const biasRisk = identifyAttributionBias(analysis, { analyst: 'user-123' });
 * console.log(`Identified ${biasRisk.biases.length} potential biases`);
 * ```
 */
export declare const identifyAttributionBias: (analysis: AttributionAnalysis, context: {
    analyst?: string;
    previousAttributions?: AttributionAnalysis[];
}) => {
    biases: string[];
    severity: "low" | "medium" | "high";
    mitigation: string[];
};
/**
 * Exports attribution analysis to JSON format.
 *
 * @param {AttributionAnalysis} analysis - Attribution analysis
 * @param {boolean} includeEvidence - Include full evidence
 * @returns {object} JSON export
 *
 * @example
 * ```typescript
 * const exported = exportAttributionToJSON(analysis, true);
 * console.log(JSON.stringify(exported, null, 2));
 * ```
 */
export declare const exportAttributionToJSON: (analysis: AttributionAnalysis, includeEvidence?: boolean) => object;
/**
 * Validates attribution methodology.
 *
 * @param {AttributionAnalysis} analysis - Attribution analysis
 * @returns {{ valid: boolean; issues: string[]; score: number }} Methodology validation
 *
 * @example
 * ```typescript
 * const validation = validateAttributionMethodology(analysis);
 * console.log(`Methodology score: ${validation.score}`);
 * ```
 */
export declare const validateAttributionMethodology: (analysis: AttributionAnalysis) => {
    valid: boolean;
    issues: string[];
    score: number;
};
/**
 * Generates attribution timeline visualization data.
 *
 * @param {AttributionEvidence[]} evidence - Evidence collection
 * @returns {{ events: Array<{ date: Date; type: string; description: string }>; span: number }} Timeline data
 *
 * @example
 * ```typescript
 * const timeline = generateAttributionTimeline(evidence);
 * console.log(`Timeline spans ${timeline.span} days`);
 * ```
 */
export declare const generateAttributionTimeline: (evidence: AttributionEvidence[]) => {
    events: Array<{
        date: Date;
        type: string;
        description: string;
    }>;
    span: number;
};
/**
 * Calculates attribution ROI (Return on Investment).
 *
 * @param {AttributionAnalysis} analysis - Attribution analysis
 * @param {object} costs - Analysis costs
 * @returns {{ roi: number; value: number; cost: number; worthwhile: boolean }} ROI calculation
 *
 * @example
 * ```typescript
 * const roi = calculateAttributionROI(analysis, { analystHours: 40, toolCosts: 5000 });
 * console.log(`Attribution ROI: ${roi.roi}%`);
 * ```
 */
export declare const calculateAttributionROI: (analysis: AttributionAnalysis, costs: {
    analystHours?: number;
    toolCosts?: number;
    externalIntelCosts?: number;
}) => {
    roi: number;
    value: number;
    cost: number;
    worthwhile: boolean;
};
/**
 * Generates attribution playbook recommendations.
 *
 * @param {AttributionAnalysis} analysis - Attribution analysis
 * @returns {{ defensive: string[]; offensive: string[]; intelligence: string[] }} Playbook recommendations
 *
 * @example
 * ```typescript
 * const playbook = generateAttributionPlaybook(analysis);
 * console.log(`Defensive actions: ${playbook.defensive.length}`);
 * ```
 */
export declare const generateAttributionPlaybook: (analysis: AttributionAnalysis) => {
    defensive: string[];
    offensive: string[];
    intelligence: string[];
};
/**
 * Identifies attribution knowledge gaps.
 *
 * @param {AttributionAnalysis} analysis - Attribution analysis
 * @returns {{ gaps: string[]; priorities: string[]; recommendations: string[] }} Knowledge gap analysis
 *
 * @example
 * ```typescript
 * const gaps = identifyAttributionKnowledgeGaps(analysis);
 * console.log(`Identified ${gaps.gaps.length} knowledge gaps`);
 * ```
 */
export declare const identifyAttributionKnowledgeGaps: (analysis: AttributionAnalysis) => {
    gaps: string[];
    priorities: string[];
    recommendations: string[];
};
/**
 * Generates attribution summary for executive reporting.
 *
 * @param {AttributionAnalysis} analysis - Attribution analysis
 * @param {AttributionReport} report - Attribution report
 * @returns {{ executiveSummary: string; keyPoints: string[]; riskLevel: string; recommendations: string[] }} Executive summary
 *
 * @example
 * ```typescript
 * const summary = generateAttributionExecutiveSummary(analysis, report);
 * console.log(summary.executiveSummary);
 * ```
 */
export declare const generateAttributionExecutiveSummary: (analysis: AttributionAnalysis, report?: AttributionReport) => {
    executiveSummary: string;
    keyPoints: string[];
    riskLevel: "low" | "medium" | "high" | "critical";
    recommendations: string[];
};
export {};
//# sourceMappingURL=threat-attribution-analysis-kit.d.ts.map