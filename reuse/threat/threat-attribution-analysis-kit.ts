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

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface AttributionAnalysis {
  id: string;
  targetId: string; // Campaign, incident, or malware sample ID
  targetType: 'campaign' | 'incident' | 'malware' | 'attack' | 'infrastructure';
  attributionScore: number; // 0-100, overall attribution confidence
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
  attributionScore: number; // 0-100
  confidence: number; // 0-100
  evidenceCount: number;
  matchingFactors: AttributionFactor[];
  likelihood: 'very-low' | 'low' | 'medium' | 'high' | 'very-high';
  rank: number;
}

interface AttributionFactor {
  factorType: 'ttp' | 'infrastructure' | 'malware' | 'code-similarity' | 'linguistic' | 'geolocation' | 'timing' | 'target-pattern' | 'tool-fingerprint';
  score: number; // 0-100
  weight: number; // 0-100, importance in attribution
  confidence: number; // 0-100
  description: string;
  evidence: string[];
  source?: string;
  timestamp: Date;
}

interface AttributionEvidence {
  id: string;
  evidenceType: 'technical' | 'behavioral' | 'contextual' | 'intelligence' | 'forensic';
  category: string; // More specific categorization
  description: string;
  reliability: 'low' | 'medium' | 'high' | 'verified';
  confidence: number; // 0-100
  source: string;
  collectedAt: Date;
  collectedBy?: string;
  encryptedData?: string; // Encrypted sensitive evidence
  relatedEvidence: string[]; // IDs of related evidence
  validationStatus: 'pending' | 'verified' | 'disputed' | 'rejected';
  metadata?: Record<string, unknown>;
}

interface InfrastructureCorrelation {
  infrastructureId: string;
  infrastructureType: 'domain' | 'ip' | 'url' | 'email' | 'certificate' | 'asn' | 'registrar';
  value: string;
  relatedActors: string[]; // Actor IDs
  correlationStrength: number; // 0-100
  firstSeen: Date;
  lastSeen: Date;
  observationCount: number;
  registrationData?: RegistrationData;
  whoisData?: WhoisData;
  sslCertificate?: SSLCertificateData;
  dnsRecords?: DNSRecordData[];
  geolocationData?: GeolocationData;
  passive DNS?: PassiveDNSData[];
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
  similarityScore: number; // 0-100
  matchingFunctions: CodeFunction[];
  matchingStrings: string[];
  sharedLibraries: string[];
  compilationSimilarity: number; // 0-100
  behaviorSimilarity: number; // 0-100
  cryptographicSimilarity: number; // 0-100
  analysisMethod: 'fuzzy-hash' | 'ssdeep' | 'tlsh' | 'yara' | 'ml-based' | 'hybrid';
  analysisDate: Date;
}

interface CodeFunction {
  functionName: string;
  functionHash: string;
  matchPercentage: number; // 0-100
  category: 'cryptographic' | 'network' | 'file-io' | 'persistence' | 'evasion' | 'payload';
}

interface LinguisticAnalysis {
  textId: string;
  textType: 'ransom-note' | 'command' | 'comment' | 'error-message' | 'ui-text';
  language: string;
  languageConfidence: number; // 0-100
  dialectVariant?: string;
  writingStyle: WritingStyle;
  commonPhrases: string[];
  characteristicTerms: string[];
  grammarPatterns: GrammarPattern[];
  translationIndicators: TranslationIndicator[];
  attributionClues: string[];
  relatedSamples: string[]; // IDs of samples with similar linguistic patterns
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
  confidence: number; // 0-100
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
  confidence: number; // 0-100
}

interface VPNDetection {
  isVPN: boolean;
  confidence: number; // 0-100
  vpnProvider?: string;
  indicators: string[];
}

interface ProxyDetection {
  isProxy: boolean;
  proxyType?: 'transparent' | 'anonymous' | 'elite' | 'tor';
  confidence: number; // 0-100
}

interface HistoricalLocation {
  country: string;
  city?: string;
  observedAt: Date;
  frequency: number;
}

interface AttributionConfidenceScore {
  overallConfidence: number; // 0-100
  factorContributions: FactorContribution[];
  evidenceQuality: number; // 0-100
  evidenceQuantity: number; // Count of evidence items
  evidenceDiversity: number; // 0-100, variety of evidence types
  temporalConsistency: number; // 0-100
  sourceCreditability: number; // 0-100
  conflictingEvidence: number; // Count of conflicting items
  confidenceLevel: 'very-low' | 'low' | 'medium' | 'high' | 'very-high';
  uncertaintyFactors: string[];
  recommendations: string[];
}

interface FactorContribution {
  factorType: string;
  contribution: number; // 0-100
  weight: number; // 0-100
  reliability: number; // 0-100
}

interface TimingPatternAnalysis {
  actorId?: string;
  campaignId?: string;
  activityPattern: 'continuous' | 'business-hours' | 'off-hours' | 'weekend-focused' | 'intermittent';
  primaryTimezone?: string;
  timezoneConfidence: number; // 0-100
  activityWindows: ActivityWindow[];
  observedHolidays: ObservedHoliday[];
  operationalTempo: 'slow' | 'moderate' | 'fast' | 'very-fast';
  downtimePeriods: DowntimePeriod[];
  correlatedActivities: CorrelatedActivity[];
}

interface ActivityWindow {
  startHour: number; // 0-23
  endHour: number; // 0-23
  daysOfWeek: number[]; // 0-6 (Sunday-Saturday)
  frequency: number; // How often this window is used
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
  correlation: number; // 0-100
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
  successRate?: number; // 0-100
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

interface ToolFingerprintAnalysis {
  toolId: string;
  toolName: string;
  toolType: 'malware' | 'exploit' | 'loader' | 'backdoor' | 'ransomware' | 'stealer' | 'rat';
  fingerprint: string;
  fingerprintType: 'hash' | 'behavioral' | 'network-signature' | 'code-pattern';
  relatedActors: string[];
  firstSeen: Date;
  lastSeen: Date;
  observationCount: number;
  uniqueCharacteristics: string[];
  variantAnalysis: VariantAnalysis[];
  evolutionTracking: ToolEvolution[];
}

interface VariantAnalysis {
  variantId: string;
  similarity: number; // 0-100
  differences: string[];
  firstSeen: Date;
  prevalence: 'rare' | 'uncommon' | 'common' | 'widespread';
}

interface ToolEvolution {
  version: string;
  changes: string[];
  detectedAt: Date;
  sophisticationChange: 'decreased' | 'stable' | 'increased';
}

interface AttributionReport {
  reportId: string;
  analysisId: string;
  title: string;
  summary: string;
  attributedActor?: string;
  attributionConfidence: number; // 0-100
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
  confidence: number; // 0-100
  reasonsForRejection: string[];
}

// ============================================================================
// ATTRIBUTION ANALYSIS FUNCTIONS
// ============================================================================

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
export const createAttributionAnalysis = (data: Partial<AttributionAnalysis>): AttributionAnalysis => {
  const now = new Date();
  return {
    id: data.id || `attr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    targetId: data.targetId || '',
    targetType: data.targetType || 'incident',
    attributionScore: Math.min(100, Math.max(0, data.attributionScore || 0)),
    topCandidates: data.topCandidates || [],
    evidenceCollection: data.evidenceCollection || [],
    analysisMethod: data.analysisMethod || 'automated',
    analysisDate: data.analysisDate || now,
    analyst: data.analyst,
    validatedBy: data.validatedBy,
    validationDate: data.validationDate,
    status: data.status || 'pending',
    metadata: data.metadata || {},
  };
};

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
export const calculateMultiFactorAttribution = (
  factors: AttributionFactor[],
): { score: number; confidence: number; breakdown: Record<string, number> } => {
  if (factors.length === 0) {
    return { score: 0, confidence: 0, breakdown: {} };
  }

  let totalWeightedScore = 0;
  let totalWeight = 0;
  let totalConfidence = 0;
  const breakdown: Record<string, number> = {};

  factors.forEach(factor => {
    const weightedScore = factor.score * factor.weight;
    totalWeightedScore += weightedScore;
    totalWeight += factor.weight;
    totalConfidence += factor.confidence;
    breakdown[factor.factorType] = factor.score;
  });

  const score = totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0;
  const avgConfidence = Math.round(totalConfidence / factors.length);

  // Bonus for multiple high-quality factors
  const highQualityFactors = factors.filter(f => f.confidence > 70 && f.score > 70).length;
  const diversityBonus = Math.min(10, highQualityFactors * 2);

  const finalConfidence = Math.min(100, avgConfidence + diversityBonus);

  return { score, confidence: finalConfidence, breakdown };
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
export const rankAttributionCandidates = (candidates: AttributionCandidate[]): AttributionCandidate[] => {
  const ranked = [...candidates].sort((a, b) => {
    // Primary sort by attribution score
    if (b.attributionScore !== a.attributionScore) {
      return b.attributionScore - a.attributionScore;
    }
    // Secondary sort by confidence
    if (b.confidence !== a.confidence) {
      return b.confidence - a.confidence;
    }
    // Tertiary sort by evidence count
    return b.evidenceCount - a.evidenceCount;
  });

  // Update ranks
  ranked.forEach((candidate, index) => {
    candidate.rank = index + 1;

    // Determine likelihood based on score and confidence
    const avgScore = (candidate.attributionScore + candidate.confidence) / 2;
    if (avgScore >= 80) candidate.likelihood = 'very-high';
    else if (avgScore >= 60) candidate.likelihood = 'high';
    else if (avgScore >= 40) candidate.likelihood = 'medium';
    else if (avgScore >= 20) candidate.likelihood = 'low';
    else candidate.likelihood = 'very-low';
  });

  return ranked;
};

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
export const createAttributionEvidence = (data: Partial<AttributionEvidence>): AttributionEvidence => {
  return {
    id: data.id || `ev-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    evidenceType: data.evidenceType || 'technical',
    category: data.category || '',
    description: data.description || '',
    reliability: data.reliability || 'medium',
    confidence: Math.min(100, Math.max(0, data.confidence || 50)),
    source: data.source || '',
    collectedAt: data.collectedAt || new Date(),
    collectedBy: data.collectedBy,
    encryptedData: data.encryptedData,
    relatedEvidence: data.relatedEvidence || [],
    validationStatus: data.validationStatus || 'pending',
    metadata: data.metadata || {},
  };
};

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
export const validateAttributionEvidence = (
  evidence: AttributionEvidence[],
): { valid: boolean; quality: number; issues: string[]; conflicts: string[] } => {
  const issues: string[] = [];
  const conflicts: string[] = [];

  if (evidence.length === 0) {
    issues.push('No evidence provided');
    return { valid: false, quality: 0, issues, conflicts };
  }

  let totalReliability = 0;
  const reliabilityScores = { low: 25, medium: 50, high: 75, verified: 100 };

  evidence.forEach((ev, idx) => {
    totalReliability += reliabilityScores[ev.reliability];

    if (!ev.source || ev.source.trim().length === 0) {
      issues.push(`Evidence ${idx + 1}: Missing source`);
    }

    if (ev.confidence < 30) {
      issues.push(`Evidence ${idx + 1}: Low confidence (${ev.confidence}%)`);
    }

    if (ev.validationStatus === 'disputed') {
      conflicts.push(`Evidence ${idx + 1}: Disputed - ${ev.description}`);
    }

    if (ev.validationStatus === 'rejected') {
      issues.push(`Evidence ${idx + 1}: Rejected evidence included`);
    }
  });

  const quality = Math.round(totalReliability / evidence.length);
  const valid = issues.length === 0 && conflicts.length === 0 && quality >= 50;

  return { valid, quality, issues, conflicts };
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
export const analyzeEvidenceDiversity = (
  evidence: AttributionEvidence[],
): { diversityScore: number; types: Record<string, number>; categories: Record<string, number> } => {
  const types: Record<string, number> = {};
  const categories: Record<string, number> = {};

  evidence.forEach(ev => {
    types[ev.evidenceType] = (types[ev.evidenceType] || 0) + 1;
    categories[ev.category] = (categories[ev.category] || 0) + 1;
  });

  const typeCount = Object.keys(types).length;
  const categoryCount = Object.keys(categories).length;

  // More diversity = stronger attribution
  const maxExpectedTypes = 5; // technical, behavioral, contextual, intelligence, forensic
  const maxExpectedCategories = 10;

  const typeDiversity = Math.min(100, (typeCount / maxExpectedTypes) * 100);
  const categoryDiversity = Math.min(100, (categoryCount / maxExpectedCategories) * 100);

  const diversityScore = Math.round((typeDiversity + categoryDiversity) / 2);

  return { diversityScore, types, categories };
};

// ============================================================================
// INFRASTRUCTURE ANALYSIS FUNCTIONS
// ============================================================================

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
export const createInfrastructureCorrelation = (data: Partial<InfrastructureCorrelation>): InfrastructureCorrelation => {
  const now = new Date();
  return {
    infrastructureId: data.infrastructureId || `infra-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    infrastructureType: data.infrastructureType || 'domain',
    value: data.value || '',
    relatedActors: data.relatedActors || [],
    correlationStrength: Math.min(100, Math.max(0, data.correlationStrength || 0)),
    firstSeen: data.firstSeen || now,
    lastSeen: data.lastSeen || now,
    observationCount: data.observationCount || 1,
    registrationData: data.registrationData,
    whoisData: data.whoisData,
    sslCertificate: data.sslCertificate,
    dnsRecords: data.dnsRecords || [],
    geolocationData: data.geolocationData,
    passiveDNS: data.passiveDNS || [],
  };
};

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
export const analyzeInfrastructureCorrelation = (
  infrastructure: InfrastructureCorrelation[],
  actorId: string,
): { correlation: number; sharedInfra: string[]; patterns: string[] } => {
  const actorInfra = infrastructure.filter(i => i.relatedActors.includes(actorId));
  const sharedInfra = actorInfra.map(i => i.value);

  const patterns: string[] = [];

  // Check for registration patterns
  const registrars: Record<string, number> = {};
  actorInfra.forEach(i => {
    if (i.registrationData?.registrar) {
      registrars[i.registrationData.registrar] = (registrars[i.registrationData.registrar] || 0) + 1;
    }
  });

  Object.entries(registrars).forEach(([registrar, count]) => {
    if (count > 2) {
      patterns.push(`Frequent use of registrar: ${registrar}`);
    }
  });

  // Check for nameserver patterns
  const nameservers: Record<string, number> = {};
  actorInfra.forEach(i => {
    i.registrationData?.nameservers.forEach(ns => {
      nameservers[ns] = (nameservers[ns] || 0) + 1;
    });
  });

  Object.entries(nameservers).forEach(([ns, count]) => {
    if (count > 2) {
      patterns.push(`Common nameserver: ${ns}`);
    }
  });

  // Calculate correlation based on shared infrastructure and patterns
  const baseCorrelation = Math.min(100, actorInfra.length * 10);
  const patternBonus = Math.min(20, patterns.length * 5);
  const correlation = Math.min(100, baseCorrelation + patternBonus);

  return { correlation, sharedInfra, patterns };
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
export const identifyInfrastructurePivots = (
  infrastructure: InfrastructureCorrelation[],
): { pivots: string[]; clusters: Record<string, string[]>; confidence: number } => {
  const pivots: string[] = [];
  const clusters: Record<string, string[]> = {};

  // Registrar pivots
  const registrarMap: Record<string, string[]> = {};
  infrastructure.forEach(i => {
    if (i.registrationData?.registrar) {
      const reg = i.registrationData.registrar;
      if (!registrarMap[reg]) registrarMap[reg] = [];
      registrarMap[reg].push(i.value);
    }
  });

  Object.entries(registrarMap).forEach(([registrar, domains]) => {
    if (domains.length >= 3) {
      const pivotKey = `REGISTRAR:${registrar}`;
      pivots.push(pivotKey);
      clusters[pivotKey] = domains;
    }
  });

  // SSL certificate pivots
  const certMap: Record<string, string[]> = {};
  infrastructure.forEach(i => {
    if (i.sslCertificate?.fingerprint) {
      const fp = i.sslCertificate.fingerprint;
      if (!certMap[fp]) certMap[fp] = [];
      certMap[fp].push(i.value);
    }
  });

  Object.entries(certMap).forEach(([fingerprint, domains]) => {
    if (domains.length >= 2) {
      const pivotKey = `SSL:${fingerprint.substring(0, 16)}`;
      pivots.push(pivotKey);
      clusters[pivotKey] = domains;
    }
  });

  // ASN pivots
  const asnMap: Record<string, string[]> = {};
  infrastructure.forEach(i => {
    if (i.geolocationData?.asn) {
      const asn = i.geolocationData.asn;
      if (!asnMap[asn]) asnMap[asn] = [];
      asnMap[asn].push(i.value);
    }
  });

  Object.entries(asnMap).forEach(([asn, items]) => {
    if (items.length >= 3) {
      const pivotKey = `ASN:${asn}`;
      pivots.push(pivotKey);
      clusters[pivotKey] = items;
    }
  });

  const confidence = pivots.length > 0 ? Math.min(100, pivots.length * 15) : 0;

  return { pivots, clusters, confidence };
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
export const analyzePassiveDNS = (
  passiveDNS: PassiveDNSData[],
): { ipHistory: Record<string, number>; domainAge: number; rotationRate: number } => {
  const ipHistory: Record<string, number> = {};

  passiveDNS.forEach(record => {
    ipHistory[record.ipAddress] = (ipHistory[record.ipAddress] || 0) + 1;
  });

  // Calculate domain age
  const sortedRecords = [...passiveDNS].sort((a, b) => a.firstSeen.getTime() - b.firstSeen.getTime());
  const oldestRecord = sortedRecords[0];
  const newestRecord = sortedRecords[sortedRecords.length - 1];

  const domainAge = oldestRecord && newestRecord
    ? Math.floor((newestRecord.lastSeen.getTime() - oldestRecord.firstSeen.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  // Calculate IP rotation rate
  const uniqueIPs = Object.keys(ipHistory).length;
  const rotationRate = domainAge > 0 ? uniqueIPs / (domainAge / 30) : 0; // IPs per month

  return { ipHistory, domainAge, rotationRate: Math.round(rotationRate * 10) / 10 };
};

// ============================================================================
// CODE SIMILARITY ANALYSIS FUNCTIONS
// ============================================================================

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
export const performCodeSimilarity = (
  sampleId: string,
  comparisonId: string,
  data: {
    matchingFunctions?: CodeFunction[];
    matchingStrings?: string[];
    sharedLibraries?: string[];
    compilationSimilarity?: number;
    behaviorSimilarity?: number;
    cryptographicSimilarity?: number;
    analysisMethod?: CodeSimilarityAnalysis['analysisMethod'];
  },
): CodeSimilarityAnalysis => {
  const matchingFunctions = data.matchingFunctions || [];
  const matchingStrings = data.matchingStrings || [];
  const sharedLibraries = data.sharedLibraries || [];

  // Calculate overall similarity
  const funcScore = matchingFunctions.length > 0
    ? matchingFunctions.reduce((sum, f) => sum + f.matchPercentage, 0) / matchingFunctions.length
    : 0;

  const stringScore = matchingStrings.length > 0 ? Math.min(100, matchingStrings.length * 10) : 0;
  const libraryScore = sharedLibraries.length > 0 ? Math.min(100, sharedLibraries.length * 15) : 0;

  const compilationSimilarity = data.compilationSimilarity || 0;
  const behaviorSimilarity = data.behaviorSimilarity || 0;
  const cryptographicSimilarity = data.cryptographicSimilarity || 0;

  const similarityScore = Math.round(
    funcScore * 0.3 +
    stringScore * 0.15 +
    libraryScore * 0.1 +
    compilationSimilarity * 0.15 +
    behaviorSimilarity * 0.2 +
    cryptographicSimilarity * 0.1,
  );

  return {
    sampleId,
    comparisonSampleId: comparisonId,
    similarityScore,
    matchingFunctions,
    matchingStrings,
    sharedLibraries,
    compilationSimilarity,
    behaviorSimilarity,
    cryptographicSimilarity,
    analysisMethod: data.analysisMethod || 'hybrid',
    analysisDate: new Date(),
  };
};

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
export const calculateCodeSimilarityConfidence = (
  analysis: CodeSimilarityAnalysis,
): { confidence: number; attributionWeight: number; reasons: string[] } => {
  const reasons: string[] = [];
  let confidence = analysis.similarityScore;

  // High function matching is very strong evidence
  if (analysis.matchingFunctions.length > 5) {
    confidence += 10;
    reasons.push(`${analysis.matchingFunctions.length} matching functions found`);
  }

  // Unique string matches are valuable
  if (analysis.matchingStrings.length > 10) {
    confidence += 5;
    reasons.push(`${analysis.matchingStrings.length} unique strings matched`);
  }

  // Compilation similarity indicates same toolchain
  if (analysis.compilationSimilarity > 80) {
    confidence += 5;
    reasons.push('High compilation similarity (same toolchain)');
  }

  // Cryptographic similarity is strong indicator
  if (analysis.cryptographicSimilarity > 70) {
    confidence += 10;
    reasons.push('Cryptographic implementation similarity');
  }

  confidence = Math.min(100, confidence);

  // Attribution weight based on analysis method reliability
  const methodWeights = {
    'fuzzy-hash': 70,
    'ssdeep': 75,
    'tlsh': 75,
    'yara': 80,
    'ml-based': 85,
    'hybrid': 90,
  };

  const attributionWeight = methodWeights[analysis.analysisMethod] || 70;

  return { confidence, attributionWeight, reasons };
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
export const identifyCodeFamilies = (
  analyses: CodeSimilarityAnalysis[],
  threshold: number = 70,
): { families: string[][]; singletons: string[] } => {
  const adjacencyMap: Record<string, Set<string>> = {};

  // Build similarity graph
  analyses.forEach(analysis => {
    if (analysis.similarityScore >= threshold) {
      if (!adjacencyMap[analysis.sampleId]) {
        adjacencyMap[analysis.sampleId] = new Set();
      }
      if (!adjacencyMap[analysis.comparisonSampleId]) {
        adjacencyMap[analysis.comparisonSampleId] = new Set();
      }

      adjacencyMap[analysis.sampleId].add(analysis.comparisonSampleId);
      adjacencyMap[analysis.comparisonSampleId].add(analysis.sampleId);
    }
  });

  // Find connected components (families)
  const visited = new Set<string>();
  const families: string[][] = [];

  const dfs = (sampleId: string, family: string[]) => {
    if (visited.has(sampleId)) return;
    visited.add(sampleId);
    family.push(sampleId);

    const neighbors = adjacencyMap[sampleId] || new Set();
    neighbors.forEach(neighbor => {
      dfs(neighbor, family);
    });
  };

  Object.keys(adjacencyMap).forEach(sampleId => {
    if (!visited.has(sampleId)) {
      const family: string[] = [];
      dfs(sampleId, family);
      if (family.length > 1) {
        families.push(family);
      }
    }
  });

  // Identify singletons
  const allSamplesInFamilies = new Set(families.flat());
  const allSamples = new Set(Object.keys(adjacencyMap));
  const singletons = [...allSamples].filter(s => !allSamplesInFamilies.has(s));

  return { families, singletons };
};

// ============================================================================
// LINGUISTIC ANALYSIS FUNCTIONS
// ============================================================================

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
export const performLinguisticAnalysis = (
  textId: string,
  text: string,
  textType: LinguisticAnalysis['textType'],
): LinguisticAnalysis => {
  // Simplified language detection (in production, use library like franc or cld)
  const language = detectLanguage(text);
  const languageConfidence = 85; // Placeholder

  const writingStyle = analyzeWritingStyle(text);
  const commonPhrases = extractCommonPhrases(text);
  const characteristicTerms = extractCharacteristicTerms(text);
  const grammarPatterns = analyzeGrammarPatterns(text);
  const translationIndicators = detectTranslationIndicators(text);

  return {
    textId,
    textType,
    language,
    languageConfidence,
    writingStyle,
    commonPhrases,
    characteristicTerms,
    grammarPatterns,
    translationIndicators,
    attributionClues: [],
    relatedSamples: [],
  };
};

/**
 * Detects language from text.
 *
 * @param {string} text - Text to analyze
 * @returns {string} Detected language
 */
const detectLanguage = (text: string): string => {
  // Simplified detection - in production use proper library
  const englishIndicators = /\b(the|and|is|to|in|of|for|that|this|with)\b/gi;
  const russianIndicators = /[а-яА-Я]{3,}/g;
  const chineseIndicators = /[\u4e00-\u9fa5]/g;

  const englishMatches = (text.match(englishIndicators) || []).length;
  const russianMatches = (text.match(russianIndicators) || []).length;
  const chineseMatches = (text.match(chineseIndicators) || []).length;

  if (englishMatches > russianMatches && englishMatches > chineseMatches) return 'English';
  if (russianMatches > englishMatches && russianMatches > chineseMatches) return 'Russian';
  if (chineseMatches > 0) return 'Chinese';

  return 'Unknown';
};

/**
 * Analyzes writing style characteristics.
 *
 * @param {string} text - Text to analyze
 * @returns {WritingStyle} Writing style analysis
 */
const analyzeWritingStyle = (text: string): WritingStyle => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(' ').length, 0) / sentences.length;

  let sentenceComplexity: WritingStyle['sentenceComplexity'] = 'simple';
  if (avgSentenceLength > 20) sentenceComplexity = 'complex';
  else if (avgSentenceLength > 12) sentenceComplexity = 'moderate';

  const hasThreats = /\b(pay|decrypt|deadline|bitcoin|lose|delete|leak)\b/i.test(text);
  const hasProfessional = /\b(organization|enterprise|security|infrastructure)\b/i.test(text);
  const hasTechnical = /\b(encryption|algorithm|protocol|network|server)\b/i.test(text);

  let tone: WritingStyle['tone'] = 'casual';
  if (hasThreats) tone = 'threatening';
  else if (hasTechnical) tone = 'technical';
  else if (hasProfessional) tone = 'professional';

  return {
    formality: 'neutral',
    tone,
    vocabulary: hasTechnical ? 'technical' : 'intermediate',
    sentenceComplexity,
    characteristicFeatures: [],
  };
};

/**
 * Extracts common phrases from text.
 *
 * @param {string} text - Text to analyze
 * @returns {string[]} Common phrases
 */
const extractCommonPhrases = (text: string): string[] => {
  // Simplified - in production use NLP library
  const commonPatterns = [
    /your (files|data) (have been|are) encrypted/gi,
    /pay.*bitcoin/gi,
    /contact.*email/gi,
    /deadline.*hours/gi,
  ];

  const phrases: string[] = [];
  commonPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      phrases.push(...matches);
    }
  });

  return phrases.slice(0, 10);
};

/**
 * Extracts characteristic terms from text.
 *
 * @param {string} text - Text to analyze
 * @returns {string[]} Characteristic terms
 */
const extractCharacteristicTerms = (text: string): string[] => {
  const words = text.toLowerCase().match(/\b\w{4,}\b/g) || [];
  const frequency: Record<string, number> = {};

  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word]) => word);
};

/**
 * Analyzes grammar patterns.
 *
 * @param {string} text - Text to analyze
 * @returns {GrammarPattern[]} Grammar patterns
 */
const analyzeGrammarPatterns = (text: string): GrammarPattern[] => {
  const patterns: GrammarPattern[] = [];

  // Check for common non-native patterns
  const articleErrors = (text.match(/\b(a|an|the)\s+(is|are|was|were)\b/gi) || []).length;
  if (articleErrors > 0) {
    patterns.push({
      pattern: 'Article usage errors',
      frequency: articleErrors,
      significance: articleErrors > 2 ? 'high' : 'medium',
      examples: [],
    });
  }

  return patterns;
};

/**
 * Detects translation indicators.
 *
 * @param {string} text - Text to analyze
 * @returns {TranslationIndicator[]} Translation indicators
 */
const detectTranslationIndicators = (text: string): TranslationIndicator[] => {
  const indicators: TranslationIndicator[] = [];

  // Check for literal translations
  const literalPatterns = [
    { pattern: /make payment/gi, confidence: 60 },
    { pattern: /your computer is encrypted/gi, confidence: 70 },
  ];

  literalPatterns.forEach(({ pattern, confidence }) => {
    if (pattern.test(text)) {
      indicators.push({
        indicatorType: 'literal-translation',
        confidence,
        examples: [],
      });
    }
  });

  return indicators;
};

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
export const compareLinguisticPatterns = (
  analysis1: LinguisticAnalysis,
  analysis2: LinguisticAnalysis,
): { similarity: number; commonFeatures: string[] } => {
  const commonFeatures: string[] = [];
  let similarity = 0;

  // Language match
  if (analysis1.language === analysis2.language) {
    similarity += 30;
    commonFeatures.push(`Same language: ${analysis1.language}`);
  }

  // Writing style match
  if (analysis1.writingStyle.tone === analysis2.writingStyle.tone) {
    similarity += 20;
    commonFeatures.push(`Similar tone: ${analysis1.writingStyle.tone}`);
  }

  if (analysis1.writingStyle.sentenceComplexity === analysis2.writingStyle.sentenceComplexity) {
    similarity += 10;
    commonFeatures.push('Similar sentence complexity');
  }

  // Common phrases
  const phrases1 = new Set(analysis1.commonPhrases.map(p => p.toLowerCase()));
  const phrases2 = new Set(analysis2.commonPhrases.map(p => p.toLowerCase()));
  const commonPhrases = new Set([...phrases1].filter(p => phrases2.has(p)));

  if (commonPhrases.size > 2) {
    similarity += 20;
    commonFeatures.push(`${commonPhrases.size} common phrases`);
  }

  // Characteristic terms
  const terms1 = new Set(analysis1.characteristicTerms);
  const terms2 = new Set(analysis2.characteristicTerms);
  const commonTerms = new Set([...terms1].filter(t => terms2.has(t)));

  if (commonTerms.size > 5) {
    similarity += 20;
    commonFeatures.push(`${commonTerms.size} common terms`);
  }

  return { similarity: Math.min(100, similarity), commonFeatures };
};

// ============================================================================
// GEOLOCATION INTELLIGENCE FUNCTIONS
// ============================================================================

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
export const createGeolocationIntelligence = (data: Partial<GeolocationIntelligence>): GeolocationIntelligence => {
  return {
    infrastructureId: data.infrastructureId || '',
    ipAddress: data.ipAddress,
    country: data.country || '',
    countryCode: data.countryCode || '',
    region: data.region,
    city: data.city,
    latitude: data.latitude,
    longitude: data.longitude,
    timezone: data.timezone,
    isp: data.isp,
    organization: data.organization,
    asn: data.asn,
    asnOrganization: data.asnOrganization,
    connectionType: data.connectionType,
    vpnDetection: data.vpnDetection || { isVPN: false, confidence: 0, indicators: [] },
    proxyDetection: data.proxyDetection || { isProxy: false, confidence: 0 },
    historicalLocations: data.historicalLocations || [],
    confidence: Math.min(100, Math.max(0, data.confidence || 50)),
  };
};

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
export const analyzeGeolocationPatterns = (
  geoData: GeolocationIntelligence[],
): { primaryCountries: string[]; suspiciousIndicators: string[]; confidence: number } => {
  const countryFrequency: Record<string, number> = {};
  const suspiciousIndicators: string[] = [];

  geoData.forEach(geo => {
    countryFrequency[geo.country] = (countryFrequency[geo.country] || 0) + 1;

    if (geo.vpnDetection.isVPN && geo.vpnDetection.confidence > 70) {
      suspiciousIndicators.push(`VPN detected: ${geo.vpnDetection.vpnProvider || 'unknown provider'}`);
    }

    if (geo.proxyDetection.isProxy && geo.proxyDetection.confidence > 70) {
      suspiciousIndicators.push(`Proxy detected: ${geo.proxyDetection.proxyType || 'unknown type'}`);
    }

    if (geo.connectionType === 'hosting') {
      suspiciousIndicators.push(`Hosting provider connection: ${geo.organization || 'unknown'}`);
    }
  });

  const primaryCountries = Object.entries(countryFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([country]) => country);

  // Confidence decreases with VPN/proxy usage
  const vpnProxyCount = geoData.filter(g => g.vpnDetection.isVPN || g.proxyDetection.isProxy).length;
  const vpnProxyRatio = vpnProxyCount / geoData.length;
  const confidence = Math.round(100 * (1 - vpnProxyRatio * 0.5));

  return { primaryCountries, suspiciousIndicators, confidence };
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
export const correlateGeolocationWithActors = (
  geoData: GeolocationIntelligence[],
  actorPatterns: Record<string, string[]>, // actorId -> countries
): { matches: Record<string, number>; confidence: number } => {
  const observedCountries = new Set(geoData.map(g => g.country));
  const matches: Record<string, number> = {};

  Object.entries(actorPatterns).forEach(([actorId, countries]) => {
    const matchCount = countries.filter(c => observedCountries.has(c)).length;
    const matchPercentage = Math.round((matchCount / countries.length) * 100);
    if (matchPercentage > 0) {
      matches[actorId] = matchPercentage;
    }
  });

  const bestMatch = Math.max(...Object.values(matches), 0);
  const confidence = Math.min(100, bestMatch);

  return { matches, confidence };
};

// ============================================================================
// ATTRIBUTION CONFIDENCE FUNCTIONS
// ============================================================================

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
export const calculateAttributionConfidence = (data: {
  evidence: AttributionEvidence[];
  factors: AttributionFactor[];
  temporalConsistency?: number;
}): AttributionConfidenceScore => {
  const evidenceValidation = validateAttributionEvidence(data.evidence);
  const evidenceQuality = evidenceValidation.quality;
  const evidenceQuantity = data.evidence.length;

  const diversityAnalysis = analyzeEvidenceDiversity(data.evidence);
  const evidenceDiversity = diversityAnalysis.diversityScore;

  const temporalConsistency = data.temporalConsistency || 50;

  // Calculate source creditability
  const verifiedEvidence = data.evidence.filter(e => e.validationStatus === 'verified').length;
  const sourceCreditability = evidenceQuantity > 0
    ? Math.round((verifiedEvidence / evidenceQuantity) * 100)
    : 0;

  const conflictingEvidence = data.evidence.filter(e => e.validationStatus === 'disputed').length;

  // Calculate factor contributions
  const factorContributions: FactorContribution[] = data.factors.map(factor => ({
    factorType: factor.factorType,
    contribution: factor.score,
    weight: factor.weight,
    reliability: factor.confidence,
  }));

  // Calculate overall confidence
  const overallConfidence = Math.round(
    evidenceQuality * 0.3 +
    evidenceDiversity * 0.2 +
    temporalConsistency * 0.15 +
    sourceCreditability * 0.2 +
    Math.min(100, evidenceQuantity * 5) * 0.15,
  );

  let confidenceLevel: AttributionConfidenceScore['confidenceLevel'] = 'very-low';
  if (overallConfidence >= 80) confidenceLevel = 'very-high';
  else if (overallConfidence >= 60) confidenceLevel = 'high';
  else if (overallConfidence >= 40) confidenceLevel = 'medium';
  else if (overallConfidence >= 20) confidenceLevel = 'low';

  const uncertaintyFactors: string[] = [];
  if (evidenceQuality < 50) uncertaintyFactors.push('Low evidence quality');
  if (evidenceQuantity < 3) uncertaintyFactors.push('Insufficient evidence');
  if (evidenceDiversity < 40) uncertaintyFactors.push('Limited evidence diversity');
  if (conflictingEvidence > 0) uncertaintyFactors.push(`${conflictingEvidence} conflicting evidence items`);

  const recommendations: string[] = [];
  if (evidenceQuantity < 5) recommendations.push('Gather additional evidence');
  if (evidenceDiversity < 50) recommendations.push('Seek diverse evidence types');
  if (verifiedEvidence < evidenceQuantity * 0.5) recommendations.push('Validate existing evidence');

  return {
    overallConfidence,
    factorContributions,
    evidenceQuality,
    evidenceQuantity,
    evidenceDiversity,
    temporalConsistency,
    sourceCreditability,
    conflictingEvidence,
    confidenceLevel,
    uncertaintyFactors,
    recommendations,
  };
};

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
export const analyzeTemporalConsistency = (
  evidence: AttributionEvidence[],
): { consistency: number; timeline: Date[]; gaps: number } => {
  if (evidence.length === 0) {
    return { consistency: 0, timeline: [], gaps: 0 };
  }

  const timeline = evidence.map(e => e.collectedAt).sort((a, b) => a.getTime() - b.getTime());

  // Calculate gaps between evidence collection
  let gaps = 0;
  const maxGapDays = 30;

  for (let i = 1; i < timeline.length; i++) {
    const gapDays = (timeline[i].getTime() - timeline[i - 1].getTime()) / (1000 * 60 * 60 * 24);
    if (gapDays > maxGapDays) {
      gaps++;
    }
  }

  // Consistency is higher with more recent, evenly distributed evidence
  const totalSpan = timeline.length > 1
    ? (timeline[timeline.length - 1].getTime() - timeline[0].getTime()) / (1000 * 60 * 60 * 24)
    : 0;

  const expectedGaps = totalSpan > maxGapDays ? Math.floor(totalSpan / maxGapDays) : 0;
  const gapPenalty = expectedGaps > 0 ? (gaps / expectedGaps) * 30 : 0;

  const consistency = Math.max(0, Math.min(100, 100 - gapPenalty));

  return { consistency: Math.round(consistency), timeline, gaps };
};

// ============================================================================
// TIMING PATTERN ANALYSIS FUNCTIONS
// ============================================================================

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
export const analyzeTimingPatterns = (data: {
  activities: Array<{ timestamp: Date; type: string }>;
  actorId?: string;
  campaignId?: string;
}): TimingPatternAnalysis => {
  const activities = data.activities;

  // Analyze hour distribution
  const hourFrequency: Record<number, number> = {};
  activities.forEach(activity => {
    const hour = activity.timestamp.getHours();
    hourFrequency[hour] = (hourFrequency[hour] || 0) + 1;
  });

  // Determine activity windows
  const activityWindows: ActivityWindow[] = [];
  let currentWindow: { start: number; end: number; count: number } | null = null;

  for (let hour = 0; hour < 24; hour++) {
    const count = hourFrequency[hour] || 0;
    if (count > 0) {
      if (!currentWindow) {
        currentWindow = { start: hour, end: hour, count };
      } else {
        currentWindow.end = hour;
        currentWindow.count += count;
      }
    } else if (currentWindow) {
      activityWindows.push({
        startHour: currentWindow.start,
        endHour: currentWindow.end,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // Simplified
        frequency: currentWindow.count,
        timezone: 'UTC', // Simplified
      });
      currentWindow = null;
    }
  }

  // Determine activity pattern
  let activityPattern: TimingPatternAnalysis['activityPattern'] = 'intermittent';
  const totalHours = Object.keys(hourFrequency).length;

  if (totalHours === 24) activityPattern = 'continuous';
  else if (totalHours >= 8 && totalHours <= 12) activityPattern = 'business-hours';

  return {
    actorId: data.actorId,
    campaignId: data.campaignId,
    activityPattern,
    timezoneConfidence: 50,
    activityWindows,
    observedHolidays: [],
    operationalTempo: 'moderate',
    downtimePeriods: [],
    correlatedActivities: [],
  };
};

// ============================================================================
// TARGET PATTERN ANALYSIS FUNCTIONS
// ============================================================================

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
export const analyzeTargetPatterns = (data: {
  victims: Array<{ sector: string; country: string; size: string }>;
  actorId?: string;
}): TargetPatternAnalysis => {
  const victims = data.victims;

  const sectorCounts: Record<string, number> = {};
  const countryCounts: Record<string, number> = {};

  victims.forEach(victim => {
    sectorCounts[victim.sector] = (sectorCounts[victim.sector] || 0) + 1;
    countryCounts[victim.country] = (countryCounts[victim.country] || 0) + 1;
  });

  const targetCategories: TargetCategory[] = Object.entries(sectorCounts).map(([sector, count]) => ({
    category: sector,
    count,
    percentage: Math.round((count / victims.length) * 100),
    firstSeen: new Date(),
    lastSeen: new Date(),
  }));

  const geographicFocus: GeographicFocus[] = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([country, count], idx) => ({
      country,
      countryCode: country.substring(0, 2).toUpperCase(),
      victimCount: count,
      percentage: Math.round((count / victims.length) * 100),
      priority: idx === 0 ? 'primary' : idx === 1 ? 'secondary' : 'tertiary',
    }));

  const sectorFocus: SectorFocus[] = Object.entries(sectorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([sector, count], idx) => ({
      sector,
      victimCount: count,
      percentage: Math.round((count / victims.length) * 100),
      priority: idx === 0 ? 'primary' : idx === 1 ? 'secondary' : 'tertiary',
    }));

  // Determine targeting strategy
  const topSectorPercentage = sectorFocus[0]?.percentage || 0;
  let targetingStrategy: TargetPatternAnalysis['targetingStrategy'] = 'opportunistic';

  if (topSectorPercentage > 70) targetingStrategy = 'highly-targeted';
  else if (topSectorPercentage > 40) targetingStrategy = 'selective';
  else if (victims.length > 100) targetingStrategy = 'indiscriminate';

  return {
    actorId: data.actorId,
    targetCategories,
    geographicFocus,
    sectorFocus,
    victimProfile: {
      securityPosture: 'unknown',
      commonVulnerabilities: [],
      commonWeaknesses: [],
    },
    targetingStrategy,
    victimCount: victims.length,
    preferredVictimSize: 'mixed',
    temporalPattern: 'continuous',
  };
};

// ============================================================================
// ATTRIBUTION REPORT FUNCTIONS
// ============================================================================

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
export const generateAttributionReport = (data: {
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
  classification?: AttributionReport['classification'];
}): AttributionReport => {
  return {
    reportId: `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    analysisId: data.analysisId,
    title: data.title,
    summary: data.summary,
    attributedActor: data.attributedActor,
    attributionConfidence: data.attributionConfidence,
    keyFindings: data.keyFindings,
    evidenceSummary: data.evidenceSummary,
    alternativeHypotheses: data.alternativeHypotheses || [],
    recommendations: data.recommendations,
    limitationsAndCaveats: [],
    analysts: data.analysts,
    reviewers: [],
    createdAt: new Date(),
    classification: data.classification || 'tlp-amber',
    distributionList: [],
  };
};

// ============================================================================
// NESTJS SERVICE EXAMPLES
// ============================================================================

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
export const createAttributionAnalysisService = (): string => {
  return 'ThreatAttributionAnalysisService template - see example above';
};

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

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
export const createAttributionModels = (): string => {
  return 'Attribution Sequelize models - see example above';
};

// ============================================================================
// SWAGGER/OPENAPI DOCUMENTATION
// ============================================================================

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
export const createAttributionSwaggerDocs = (): string => {
  return 'Swagger API documentation - see example above';
};

// ============================================================================
// ADDITIONAL ATTRIBUTION FUNCTIONS
// ============================================================================

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
export const calculateAttributionProbability = (
  candidates: AttributionCandidate[],
): { distribution: Record<string, number>; entropy: number } => {
  const totalScore = candidates.reduce((sum, c) => sum + c.attributionScore, 0);
  const distribution: Record<string, number> = {};

  candidates.forEach(candidate => {
    const probability = totalScore > 0 ? candidate.attributionScore / totalScore : 0;
    distribution[candidate.actorId] = Math.round(probability * 100);
  });

  // Calculate Shannon entropy
  let entropy = 0;
  Object.values(distribution).forEach(prob => {
    if (prob > 0) {
      const p = prob / 100;
      entropy -= p * Math.log2(p);
    }
  });

  return { distribution, entropy: Math.round(entropy * 100) / 100 };
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
export const identifyFalsePositiveRisks = (
  analysis: AttributionAnalysis,
): { riskLevel: 'low' | 'medium' | 'high'; indicators: string[]; mitigation: string[] } => {
  const indicators: string[] = [];
  const mitigation: string[] = [];
  let riskScore = 0;

  // Low evidence diversity
  const diversity = analyzeEvidenceDiversity(analysis.evidenceCollection);
  if (diversity.diversityScore < 40) {
    riskScore += 30;
    indicators.push('Low evidence diversity');
    mitigation.push('Gather evidence from multiple source types');
  }

  // Single high-confidence candidate
  const highConfCandidates = analysis.topCandidates.filter(c => c.confidence > 70).length;
  if (highConfCandidates === 1 && analysis.topCandidates.length > 1) {
    const topScore = analysis.topCandidates[0].attributionScore;
    const secondScore = analysis.topCandidates[1].attributionScore;
    if (topScore - secondScore < 20) {
      riskScore += 20;
      indicators.push('Close scoring between top candidates');
      mitigation.push('Collect additional discriminating evidence');
    }
  }

  // Unverified evidence
  const unverified = analysis.evidenceCollection.filter(e => e.validationStatus === 'pending').length;
  if (unverified > analysis.evidenceCollection.length * 0.5) {
    riskScore += 25;
    indicators.push('Majority of evidence unverified');
    mitigation.push('Verify evidence sources and reliability');
  }

  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (riskScore >= 50) riskLevel = 'high';
  else if (riskScore >= 25) riskLevel = 'medium';

  return { riskLevel, indicators, mitigation };
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
export const generateAlternativeHypotheses = (
  analysis: AttributionAnalysis,
): AlternativeHypothesis[] => {
  const hypotheses: AlternativeHypothesis[] = [];

  // Second and third candidates as alternatives
  analysis.topCandidates.slice(1, 3).forEach(candidate => {
    hypotheses.push({
      actorId: candidate.actorId,
      actorName: candidate.actorName,
      hypothesis: `Attribution to ${candidate.actorName} based on matching factors`,
      supportingEvidence: candidate.matchingFactors.map(f => f.description),
      confidence: candidate.confidence,
      reasonsForRejection: [
        `Lower attribution score (${candidate.attributionScore} vs ${analysis.topCandidates[0].attributionScore})`,
        `Fewer matching factors (${candidate.matchingFactors.length})`,
      ],
    });
  });

  // False flag hypothesis
  if (analysis.attributionScore < 80) {
    hypotheses.push({
      hypothesis: 'False flag operation by unknown actor',
      supportingEvidence: [
        'Attribution confidence below 80%',
        'Potential for intentional misdirection',
      ],
      confidence: 100 - analysis.attributionScore,
      reasonsForRejection: [
        'No concrete evidence of false flag tactics',
        'Pattern matches known actor behavior',
      ],
    });
  }

  return hypotheses;
};

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
export const compareAttributionAnalyses = (
  analyses: AttributionAnalysis[],
): { consensus: string | null; divergence: number; agreements: string[]; conflicts: string[] } => {
  const actorCounts: Record<string, number> = {};
  const agreements: string[] = [];
  const conflicts: string[] = [];

  analyses.forEach(analysis => {
    const topActor = analysis.topCandidates[0]?.actorId;
    if (topActor) {
      actorCounts[topActor] = (actorCounts[topActor] || 0) + 1;
    }
  });

  // Find consensus
  let consensus: string | null = null;
  let maxCount = 0;
  Object.entries(actorCounts).forEach(([actorId, count]) => {
    if (count > maxCount) {
      maxCount = count;
      consensus = actorId;
    }
  });

  const consensusPercentage = analyses.length > 0 ? (maxCount / analyses.length) * 100 : 0;
  const divergence = 100 - consensusPercentage;

  if (consensusPercentage >= 75) {
    agreements.push(`Strong consensus on ${consensus} (${Math.round(consensusPercentage)}%)`);
  } else if (consensusPercentage >= 50) {
    agreements.push(`Moderate consensus on ${consensus} (${Math.round(consensusPercentage)}%)`);
    conflicts.push('Significant divergence in attribution conclusions');
  } else {
    conflicts.push('No clear consensus among analyses');
  }

  return { consensus, divergence: Math.round(divergence), agreements, conflicts };
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
export const calculateAttributionDecay = (
  analysis: AttributionAnalysis,
  daysSinceAnalysis: number,
): { decayedConfidence: number; freshness: 'fresh' | 'aging' | 'stale' | 'outdated'; recommendations: string[] } => {
  const recommendations: string[] = [];

  // Confidence decays over time
  const decayRate = 0.1; // 10% per 90 days
  const decayPeriods = daysSinceAnalysis / 90;
  const decayFactor = Math.pow(1 - decayRate, decayPeriods);

  const decayedConfidence = Math.round(analysis.attributionScore * decayFactor);

  let freshness: 'fresh' | 'aging' | 'stale' | 'outdated' = 'fresh';
  if (daysSinceAnalysis > 365) {
    freshness = 'outdated';
    recommendations.push('Attribution severely outdated - requires comprehensive re-analysis');
  } else if (daysSinceAnalysis > 180) {
    freshness = 'stale';
    recommendations.push('Attribution is stale - recommend re-validation');
  } else if (daysSinceAnalysis > 90) {
    freshness = 'aging';
    recommendations.push('Attribution aging - consider updating with recent intelligence');
  }

  return { decayedConfidence, freshness, recommendations };
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
export const generateAttributionConfidenceInterval = (
  analysis: AttributionAnalysis,
  confidenceLevel: number = 95,
): { lower: number; upper: number; mean: number } => {
  const mean = analysis.attributionScore;

  // Simplified confidence interval based on evidence quality
  const evidenceValidation = validateAttributionEvidence(analysis.evidenceCollection);
  const uncertainty = (100 - evidenceValidation.quality) / 2;

  // Z-score for confidence level (simplified)
  const zScore = confidenceLevel >= 95 ? 1.96 : 1.645;
  const margin = uncertainty * zScore;

  const lower = Math.max(0, Math.round(mean - margin));
  const upper = Math.min(100, Math.round(mean + margin));

  return { lower, upper, mean };
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
export const identifyAttributionBias = (
  analysis: AttributionAnalysis,
  context: { analyst?: string; previousAttributions?: AttributionAnalysis[] },
): { biases: string[]; severity: 'low' | 'medium' | 'high'; mitigation: string[] } => {
  const biases: string[] = [];
  const mitigation: string[] = [];

  // Confirmation bias - same analyst, same conclusion
  if (context.previousAttributions && context.analyst) {
    const analystPreviousAttrs = context.previousAttributions.filter(a => a.analyst === context.analyst);
    const topActor = analysis.topCandidates[0]?.actorId;

    const sameActorCount = analystPreviousAttrs.filter(
      a => a.topCandidates[0]?.actorId === topActor,
    ).length;

    if (sameActorCount >= 3) {
      biases.push('Potential confirmation bias - analyst repeatedly attributes to same actor');
      mitigation.push('Have independent analyst review attribution');
    }
  }

  // Availability bias - over-reliance on recent/available evidence
  const recentEvidence = analysis.evidenceCollection.filter(e => {
    const daysSince = (Date.now() - e.collectedAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysSince < 30;
  }).length;

  if (recentEvidence === analysis.evidenceCollection.length && analysis.evidenceCollection.length < 5) {
    biases.push('Availability bias - all evidence is recent, may be missing historical context');
    mitigation.push('Review historical intelligence on target and actors');
  }

  // Anchoring bias - first candidate heavily influences final attribution
  if (analysis.topCandidates.length > 1) {
    const firstScore = analysis.topCandidates[0].attributionScore;
    const secondScore = analysis.topCandidates[1].attributionScore;

    if (firstScore > 80 && secondScore > 60 && firstScore - secondScore < 15) {
      biases.push('Anchoring bias risk - close candidates, first may be anchoring judgment');
      mitigation.push('Re-evaluate evidence for second candidate objectively');
    }
  }

  let severity: 'low' | 'medium' | 'high' = 'low';
  if (biases.length >= 3) severity = 'high';
  else if (biases.length >= 1) severity = 'medium';

  return { biases, severity, mitigation };
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
export const exportAttributionToJSON = (
  analysis: AttributionAnalysis,
  includeEvidence: boolean = true,
): object => {
  return {
    id: analysis.id,
    targetId: analysis.targetId,
    targetType: analysis.targetType,
    attributionScore: analysis.attributionScore,
    topCandidate: analysis.topCandidates[0],
    allCandidates: analysis.topCandidates,
    evidenceSummary: {
      count: analysis.evidenceCollection.length,
      types: analyzeEvidenceDiversity(analysis.evidenceCollection).types,
    },
    evidence: includeEvidence ? analysis.evidenceCollection : undefined,
    analysisMethod: analysis.analysisMethod,
    analysisDate: analysis.analysisDate.toISOString(),
    analyst: analysis.analyst,
    status: analysis.status,
  };
};

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
export const validateAttributionMethodology = (
  analysis: AttributionAnalysis,
): { valid: boolean; issues: string[]; score: number } => {
  const issues: string[] = [];
  let score = 100;

  // Check for minimum evidence
  if (analysis.evidenceCollection.length < 3) {
    issues.push('Insufficient evidence (minimum 3 required)');
    score -= 30;
  }

  // Check for evidence validation
  const validation = validateAttributionEvidence(analysis.evidenceCollection);
  if (!validation.valid) {
    issues.push(...validation.issues);
    score -= 20;
  }

  // Check for multiple attribution factors
  const topCandidate = analysis.topCandidates[0];
  if (topCandidate && topCandidate.matchingFactors.length < 3) {
    issues.push('Insufficient attribution factors (minimum 3 recommended)');
    score -= 15;
  }

  // Check for analyst assignment
  if (!analysis.analyst && analysis.analysisMethod !== 'automated') {
    issues.push('No analyst assigned to manual/hybrid analysis');
    score -= 10;
  }

  // Check for evidence diversity
  const diversity = analyzeEvidenceDiversity(analysis.evidenceCollection);
  if (diversity.diversityScore < 40) {
    issues.push('Low evidence diversity');
    score -= 15;
  }

  const valid = issues.length === 0 && score >= 70;

  return { valid, issues, score: Math.max(0, score) };
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
export const generateAttributionTimeline = (
  evidence: AttributionEvidence[],
): { events: Array<{ date: Date; type: string; description: string }>; span: number } => {
  const events = evidence
    .map(ev => ({
      date: ev.collectedAt,
      type: ev.evidenceType,
      description: ev.description,
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const span = events.length > 1
    ? Math.floor((events[events.length - 1].date.getTime() - events[0].date.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return { events, span };
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
export const calculateAttributionROI = (
  analysis: AttributionAnalysis,
  costs: { analystHours?: number; toolCosts?: number; externalIntelCosts?: number },
): { roi: number; value: number; cost: number; worthwhile: boolean } => {
  // Calculate costs
  const analystCost = (costs.analystHours || 0) * 150; // $150/hour
  const toolCost = costs.toolCosts || 0;
  const intelCost = costs.externalIntelCosts || 0;
  const totalCost = analystCost + toolCost + intelCost;

  // Estimate value based on attribution quality and confidence
  const baseValue = 10000; // Base value of attribution
  const confidenceMultiplier = analysis.attributionScore / 100;
  const qualityMultiplier = analysis.evidenceCollection.length >= 5 ? 1.5 : 1.0;

  const estimatedValue = baseValue * confidenceMultiplier * qualityMultiplier;

  const roi = totalCost > 0 ? ((estimatedValue - totalCost) / totalCost) * 100 : 0;
  const worthwhile = roi > 100 || analysis.attributionScore > 80;

  return {
    roi: Math.round(roi),
    value: Math.round(estimatedValue),
    cost: totalCost,
    worthwhile,
  };
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
export const generateAttributionPlaybook = (
  analysis: AttributionAnalysis,
): { defensive: string[]; offensive: string[]; intelligence: string[] } => {
  const defensive: string[] = [];
  const offensive: string[] = [];
  const intelligence: string[] = [];

  if (analysis.attributionScore > 70) {
    defensive.push('Deploy actor-specific detection signatures');
    defensive.push('Harden defenses against known TTPs');
    defensive.push('Block attributed infrastructure');

    offensive.push('Conduct proactive threat hunting for actor indicators');
    offensive.push('Deploy deception technology targeting actor methods');

    intelligence.push('Monitor actor for evolution and new campaigns');
    intelligence.push('Share attribution with threat intelligence community');
    intelligence.push('Develop actor-specific intelligence requirements');
  } else {
    defensive.push('Implement general hardening measures');
    defensive.push('Enhance monitoring and detection capabilities');

    intelligence.push('Collect additional evidence for attribution refinement');
    intelligence.push('Monitor for additional activity matching partial attribution');
  }

  return { defensive, offensive, intelligence };
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
export const identifyAttributionKnowledgeGaps = (
  analysis: AttributionAnalysis,
): { gaps: string[]; priorities: string[]; recommendations: string[] } => {
  const gaps: string[] = [];
  const priorities: string[] = [];
  const recommendations: string[] = [];

  const evidenceTypes = new Set(analysis.evidenceCollection.map(e => e.evidenceType));

  // Missing evidence types
  const allTypes = ['technical', 'behavioral', 'contextual', 'intelligence', 'forensic'];
  allTypes.forEach(type => {
    if (!evidenceTypes.has(type)) {
      gaps.push(`Missing ${type} evidence`);
      recommendations.push(`Collect ${type} evidence to strengthen attribution`);
    }
  });

  // Low confidence areas
  const lowConfEvidence = analysis.evidenceCollection.filter(e => e.confidence < 50);
  if (lowConfEvidence.length > 0) {
    gaps.push('Low confidence evidence present');
    priorities.push('Verify and strengthen low-confidence evidence');
  }

  // Factor coverage
  const topCandidate = analysis.topCandidates[0];
  if (topCandidate) {
    const factorTypes = new Set(topCandidate.matchingFactors.map(f => f.factorType));
    if (!factorTypes.has('infrastructure')) {
      gaps.push('No infrastructure attribution factor');
      priorities.push('Analyze infrastructure correlation');
    }
    if (!factorTypes.has('ttp')) {
      gaps.push('No TTP attribution factor');
      priorities.push('Map TTPs to known actors');
    }
  }

  return { gaps, priorities, recommendations };
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
export const generateAttributionExecutiveSummary = (
  analysis: AttributionAnalysis,
  report?: AttributionReport,
): { executiveSummary: string; keyPoints: string[]; riskLevel: 'low' | 'medium' | 'high' | 'critical'; recommendations: string[] } => {
  const topCandidate = analysis.topCandidates[0];
  const keyPoints: string[] = [];
  const recommendations: string[] = [];

  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'medium';
  if (analysis.attributionScore >= 80) {
    riskLevel = topCandidate?.actorName ? 'high' : 'medium';
  } else if (analysis.attributionScore >= 60) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'low';
  }

  // Build executive summary
  let executiveSummary = '';
  if (topCandidate && analysis.attributionScore >= 70) {
    executiveSummary = `Attribution analysis with ${analysis.attributionScore}% confidence identifies ${topCandidate.actorName} as the threat actor responsible for ${analysis.targetType} ${analysis.targetId}. `;
    executiveSummary += `Analysis based on ${analysis.evidenceCollection.length} pieces of evidence across ${topCandidate.matchingFactors.length} attribution factors. `;

    keyPoints.push(`Attributed to: ${topCandidate.actorName}`);
    keyPoints.push(`Confidence level: ${analysis.attributionScore}%`);
    keyPoints.push(`Evidence collected: ${analysis.evidenceCollection.length} items`);
    keyPoints.push(`Attribution factors: ${topCandidate.matchingFactors.length}`);

    recommendations.push('Deploy actor-specific detection and prevention measures');
    recommendations.push('Monitor for similar activity patterns');
    recommendations.push('Share intelligence with security community');
  } else {
    executiveSummary = `Attribution analysis for ${analysis.targetType} ${analysis.targetId} remains inconclusive with ${analysis.attributionScore}% confidence. `;
    executiveSummary += `${analysis.topCandidates.length} potential actors identified, requiring additional evidence for definitive attribution. `;

    keyPoints.push(`Analysis status: Inconclusive`);
    keyPoints.push(`Potential actors: ${analysis.topCandidates.length}`);
    keyPoints.push(`Evidence collected: ${analysis.evidenceCollection.length} items`);

    recommendations.push('Gather additional evidence for definitive attribution');
    recommendations.push('Implement general threat detection measures');
    recommendations.push('Continue monitoring for attribution indicators');
  }

  if (report) {
    executiveSummary += `Full technical report available (ID: ${report.reportId}).`;
  }

  return { executiveSummary, keyPoints, riskLevel, recommendations };
};
