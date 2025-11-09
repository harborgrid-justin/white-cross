/**
 * LOC: THAC1234567
 * File: /reuse/threat/threat-actors-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Threat intelligence services
 *   - Security analysis modules
 *   - Attribution engines
 */
/**
 * File: /reuse/threat/threat-actors-kit.ts
 * Locator: WC-UTL-THAC-001
 * Purpose: Comprehensive Threat Actor Intelligence - profiling, attribution, TTP mapping, capability assessment
 *
 * Upstream: Independent utility module for threat actor analysis
 * Downstream: ../backend/*, Threat intelligence services, Security modules, Attribution engines
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Swagger/OpenAPI
 * Exports: 42 utility functions for threat actor profiling, capability assessment, TTP mapping, attribution
 *
 * LLM Context: Comprehensive threat actor intelligence utilities for White Cross security platform.
 * Provides actor profiling, capability assessment, motivation analysis, infrastructure tracking, TTP mapping,
 * attribution confidence scoring, relationship graphs, and actor intelligence management.
 */
interface ThreatActor {
    id: string;
    name: string;
    aliases: string[];
    type: 'nation-state' | 'criminal' | 'hacktivist' | 'insider' | 'terrorist' | 'unknown';
    sophistication: 'minimal' | 'low' | 'medium' | 'high' | 'advanced' | 'expert';
    motivation: ActorMotivation[];
    firstSeen: Date;
    lastSeen: Date;
    active: boolean;
    confidence: number;
    description?: string;
    metadata?: Record<string, unknown>;
}
interface ActorMotivation {
    type: 'financial' | 'espionage' | 'sabotage' | 'ideology' | 'revenge' | 'notoriety' | 'unknown';
    description?: string;
    confidence: number;
}
interface ActorCapability {
    actorId: string;
    category: 'malware' | 'exploit' | 'infrastructure' | 'social-engineering' | 'cryptography' | 'evasion';
    name: string;
    description: string;
    proficiencyLevel: 'basic' | 'intermediate' | 'advanced' | 'expert';
    evidence: string[];
    confidence: number;
    lastObserved: Date;
}
interface ActorTTP {
    actorId: string;
    mitreAttackId: string;
    tactic: string;
    technique: string;
    procedureDescription?: string;
    frequency: 'rare' | 'occasional' | 'common' | 'frequent';
    confidence: number;
    observationCount: number;
    firstObserved: Date;
    lastObserved: Date;
}
interface ActorInfrastructure {
    actorId: string;
    type: 'domain' | 'ip' | 'url' | 'email' | 'certificate' | 'asn' | 'registrar';
    value: string;
    role: 'c2' | 'phishing' | 'malware-distribution' | 'data-exfiltration' | 'staging' | 'reconnaissance';
    active: boolean;
    confidence: number;
    firstSeen: Date;
    lastSeen: Date;
    metadata?: Record<string, unknown>;
}
interface ActorAttribution {
    actorId: string;
    campaignId?: string;
    incidentId?: string;
    confidence: number;
    evidenceScore: number;
    attributionMethod: 'ttp-match' | 'infrastructure-overlap' | 'malware-analysis' | 'intelligence-report' | 'collaborative';
    evidence: AttributionEvidence[];
    analyst?: string;
    timestamp: Date;
    notes?: string;
}
interface AttributionEvidence {
    type: 'ttp' | 'infrastructure' | 'malware' | 'target' | 'timing' | 'linguistic' | 'tooling';
    description: string;
    weight: number;
    source?: string;
}
interface ActorRelationship {
    sourceActorId: string;
    targetActorId: string;
    relationshipType: 'parent' | 'subsidiary' | 'partner' | 'competitor' | 'shares-infrastructure' | 'shares-tools';
    confidence: number;
    evidence: string[];
    active: boolean;
    firstObserved: Date;
    lastObserved: Date;
}
interface ActorProfile {
    actor: ThreatActor;
    capabilities: ActorCapability[];
    ttps: ActorTTP[];
    infrastructure: ActorInfrastructure[];
    relationships: ActorRelationship[];
    attributions: ActorAttribution[];
    targetSectors: string[];
    targetGeographies: string[];
    timeline: ActorTimelineEvent[];
}
interface ActorTimelineEvent {
    timestamp: Date;
    eventType: 'campaign' | 'capability-acquisition' | 'infrastructure-change' | 'ttp-evolution' | 'attribution';
    description: string;
    confidence: number;
    references?: string[];
}
interface ActorSearchCriteria {
    name?: string;
    type?: ThreatActor['type'];
    sophistication?: ThreatActor['sophistication'];
    motivations?: ActorMotivation['type'][];
    minConfidence?: number;
    active?: boolean;
    hasInfrastructure?: boolean;
    targetSector?: string;
    targetGeography?: string;
}
/**
 * Creates a new threat actor profile with validation.
 *
 * @param {Partial<ThreatActor>} actorData - Actor data
 * @returns {ThreatActor} Validated threat actor
 * @throws {Error} If required fields are missing or invalid
 *
 * @example
 * ```typescript
 * const actor = createThreatActor({
 *   name: 'APT28',
 *   aliases: ['Fancy Bear', 'Sofacy', 'Strontium'],
 *   type: 'nation-state',
 *   sophistication: 'advanced',
 *   motivation: [{ type: 'espionage', confidence: 95 }]
 * });
 * // Result: { id: 'uuid', name: 'APT28', ... }
 * ```
 */
export declare const createThreatActor: (actorData: Partial<ThreatActor>) => ThreatActor;
/**
 * Validates threat actor profile for completeness and consistency.
 *
 * @param {ThreatActor} actor - Actor to validate
 * @returns {boolean} True if valid
 * @throws {Error} If validation fails
 *
 * @example
 * ```typescript
 * const isValid = validateThreatActor(actor);
 * // Result: true (or throws error)
 * ```
 */
export declare const validateThreatActor: (actor: ThreatActor) => boolean;
/**
 * Enriches actor profile with additional intelligence data.
 *
 * @param {ThreatActor} actor - Base actor profile
 * @param {Partial<ActorProfile>} enrichmentData - Additional data to merge
 * @returns {ActorProfile} Enriched actor profile
 *
 * @example
 * ```typescript
 * const enriched = enrichActorProfile(actor, {
 *   capabilities: newCapabilities,
 *   infrastructure: discoveredInfrastructure
 * });
 * ```
 */
export declare const enrichActorProfile: (actor: ThreatActor, enrichmentData: Partial<ActorProfile>) => ActorProfile;
/**
 * Merges multiple actor profiles (deduplication for aliases).
 *
 * @param {ThreatActor[]} actors - Actors to merge
 * @returns {ThreatActor} Merged actor profile
 *
 * @example
 * ```typescript
 * const merged = mergeActorProfiles([actor1, actor2]);
 * // Combines aliases, takes highest confidence, most recent dates
 * ```
 */
export declare const mergeActorProfiles: (actors: ThreatActor[]) => ThreatActor;
/**
 * Assesses actor capability level based on observed capabilities.
 *
 * @param {ActorCapability[]} capabilities - Actor's capabilities
 * @returns {ThreatActor['sophistication']} Assessed sophistication level
 *
 * @example
 * ```typescript
 * const level = assessActorCapabilities(capabilities);
 * // Result: 'advanced'
 * ```
 */
export declare const assessActorCapabilities: (capabilities: ActorCapability[]) => ThreatActor["sophistication"];
/**
 * Adds capability to actor profile with evidence.
 *
 * @param {ActorCapability[]} capabilities - Existing capabilities
 * @param {Omit<ActorCapability, 'lastObserved'>} newCapability - New capability to add
 * @returns {ActorCapability[]} Updated capabilities list
 *
 * @example
 * ```typescript
 * const updated = addActorCapability(capabilities, {
 *   actorId: 'apt28',
 *   category: 'malware',
 *   name: 'Custom RAT Development',
 *   proficiencyLevel: 'advanced',
 *   evidence: ['incident-123', 'malware-sample-456'],
 *   confidence: 85
 * });
 * ```
 */
export declare const addActorCapability: (capabilities: ActorCapability[], newCapability: Omit<ActorCapability, "lastObserved">) => ActorCapability[];
/**
 * Calculates capability coverage across categories.
 *
 * @param {ActorCapability[]} capabilities - Actor's capabilities
 * @returns {Record<ActorCapability['category'], number>} Coverage percentage by category
 *
 * @example
 * ```typescript
 * const coverage = calculateCapabilityCoverage(capabilities);
 * // Result: { malware: 80, exploit: 60, infrastructure: 40, ... }
 * ```
 */
export declare const calculateCapabilityCoverage: (capabilities: ActorCapability[]) => Record<ActorCapability["category"], number>;
/**
 * Analyzes actor motivations and determines primary intent.
 *
 * @param {ActorMotivation[]} motivations - Actor's motivations
 * @returns {{ primary: ActorMotivation['type']; secondary: ActorMotivation['type'][]; confidence: number }}
 *
 * @example
 * ```typescript
 * const intent = analyzeActorIntent(motivations);
 * // Result: { primary: 'espionage', secondary: ['financial'], confidence: 85 }
 * ```
 */
export declare const analyzeActorIntent: (motivations: ActorMotivation[]) => {
    primary: ActorMotivation["type"];
    secondary: ActorMotivation["type"][];
    confidence: number;
};
/**
 * Infers actor motivation from observed behavior patterns.
 *
 * @param {ActorTTP[]} ttps - Actor's TTPs
 * @param {string[]} targetSectors - Targeted sectors
 * @returns {ActorMotivation[]} Inferred motivations
 *
 * @example
 * ```typescript
 * const motivations = inferActorMotivation(ttps, ['finance', 'government']);
 * // Result: [{ type: 'financial', confidence: 70 }, { type: 'espionage', confidence: 80 }]
 * ```
 */
export declare const inferActorMotivation: (ttps: ActorTTP[], targetSectors: string[]) => ActorMotivation[];
/**
 * Updates actor motivation based on new evidence.
 *
 * @param {ActorMotivation[]} current - Current motivations
 * @param {ActorMotivation} newMotivation - New motivation evidence
 * @returns {ActorMotivation[]} Updated motivations
 *
 * @example
 * ```typescript
 * const updated = updateActorMotivation(motivations, {
 *   type: 'financial',
 *   confidence: 90,
 *   description: 'Observed ransomware deployment'
 * });
 * ```
 */
export declare const updateActorMotivation: (current: ActorMotivation[], newMotivation: ActorMotivation) => ActorMotivation[];
/**
 * Tracks actor infrastructure with lifecycle management.
 *
 * @param {ActorInfrastructure} infrastructure - Infrastructure to track
 * @returns {ActorInfrastructure} Tracked infrastructure with metadata
 *
 * @example
 * ```typescript
 * const tracked = trackActorInfrastructure({
 *   actorId: 'apt28',
 *   type: 'domain',
 *   value: 'evil.example.com',
 *   role: 'c2',
 *   active: true,
 *   confidence: 85
 * });
 * ```
 */
export declare const trackActorInfrastructure: (infrastructure: Omit<ActorInfrastructure, "firstSeen" | "lastSeen">) => ActorInfrastructure;
/**
 * Identifies infrastructure overlaps between actors.
 *
 * @param {ActorInfrastructure[]} actor1Infra - First actor's infrastructure
 * @param {ActorInfrastructure[]} actor2Infra - Second actor's infrastructure
 * @returns {ActorInfrastructure[]} Overlapping infrastructure
 *
 * @example
 * ```typescript
 * const overlaps = findInfrastructureOverlap(apt28Infra, apt29Infra);
 * // Result: [{ type: 'domain', value: 'shared-c2.com', ... }]
 * ```
 */
export declare const findInfrastructureOverlap: (actor1Infra: ActorInfrastructure[], actor2Infra: ActorInfrastructure[]) => ActorInfrastructure[];
/**
 * Marks infrastructure as inactive based on age or intelligence.
 *
 * @param {ActorInfrastructure[]} infrastructure - Infrastructure list
 * @param {number} inactiveDays - Days to consider infrastructure inactive
 * @returns {ActorInfrastructure[]} Updated infrastructure list
 *
 * @example
 * ```typescript
 * const updated = markInactiveInfrastructure(infrastructure, 90);
 * // Marks infrastructure not seen in 90 days as inactive
 * ```
 */
export declare const markInactiveInfrastructure: (infrastructure: ActorInfrastructure[], inactiveDays: number) => ActorInfrastructure[];
/**
 * Maps actor TTPs to MITRE ATT&CK framework.
 *
 * @param {ActorTTP} ttp - TTP to map
 * @returns {ActorTTP} TTP with MITRE ATT&CK mapping
 *
 * @example
 * ```typescript
 * const mapped = mapTTPToMITRE({
 *   actorId: 'apt28',
 *   tactic: 'Initial Access',
 *   technique: 'Phishing: Spearphishing Attachment',
 *   mitreAttackId: 'T1566.001'
 * });
 * ```
 */
export declare const mapTTPToMITRE: (ttp: Omit<ActorTTP, "observationCount" | "firstObserved" | "lastObserved">) => ActorTTP;
/**
 * Calculates TTP similarity between two actors.
 *
 * @param {ActorTTP[]} actor1TTPs - First actor's TTPs
 * @param {ActorTTP[]} actor2TTPs - Second actor's TTPs
 * @returns {number} Similarity score (0-100)
 *
 * @example
 * ```typescript
 * const similarity = calculateTTPSimilarity(apt28TTPs, apt29TTPs);
 * // Result: 65 (65% similar)
 * ```
 */
export declare const calculateTTPSimilarity: (actor1TTPs: ActorTTP[], actor2TTPs: ActorTTP[]) => number;
/**
 * Identifies most common TTPs for an actor.
 *
 * @param {ActorTTP[]} ttps - Actor's TTPs
 * @param {number} topN - Number of top TTPs to return
 * @returns {ActorTTP[]} Most frequently observed TTPs
 *
 * @example
 * ```typescript
 * const commonTTPs = getCommonTTPs(ttps, 5);
 * // Returns top 5 most frequently used TTPs
 * ```
 */
export declare const getCommonTTPs: (ttps: ActorTTP[], topN?: number) => ActorTTP[];
/**
 * Updates TTP observation with new incident data.
 *
 * @param {ActorTTP[]} ttps - Current TTPs
 * @param {string} mitreAttackId - MITRE ATT&CK ID
 * @returns {ActorTTP[]} Updated TTPs
 *
 * @example
 * ```typescript
 * const updated = updateTTPObservation(ttps, 'T1566.001');
 * // Increments observation count and updates lastObserved
 * ```
 */
export declare const updateTTPObservation: (ttps: ActorTTP[], mitreAttackId: string) => ActorTTP[];
/**
 * Calculates attribution confidence based on evidence.
 *
 * @param {AttributionEvidence[]} evidence - Evidence for attribution
 * @returns {number} Confidence score (0-100)
 *
 * @example
 * ```typescript
 * const confidence = calculateAttributionConfidence(evidence);
 * // Result: 85
 * ```
 */
export declare const calculateAttributionConfidence: (evidence: AttributionEvidence[]) => number;
/**
 * Creates actor attribution with evidence and scoring.
 *
 * @param {Omit<ActorAttribution, 'confidence' | 'evidenceScore' | 'timestamp'>} attribution - Attribution data
 * @returns {ActorAttribution} Complete attribution
 *
 * @example
 * ```typescript
 * const attribution = createActorAttribution({
 *   actorId: 'apt28',
 *   campaignId: 'camp-123',
 *   attributionMethod: 'ttp-match',
 *   evidence: [{ type: 'ttp', description: 'Matches known APT28 TTPs', weight: 85 }]
 * });
 * ```
 */
export declare const createActorAttribution: (attribution: Omit<ActorAttribution, "confidence" | "evidenceScore" | "timestamp">) => ActorAttribution;
/**
 * Validates attribution evidence quality.
 *
 * @param {AttributionEvidence[]} evidence - Evidence to validate
 * @returns {{ valid: boolean; issues: string[] }}
 *
 * @example
 * ```typescript
 * const validation = validateAttributionEvidence(evidence);
 * // Result: { valid: true, issues: [] }
 * ```
 */
export declare const validateAttributionEvidence: (evidence: AttributionEvidence[]) => {
    valid: boolean;
    issues: string[];
};
/**
 * Compares attribution confidence across multiple actors.
 *
 * @param {ActorAttribution[]} attributions - Attributions to compare
 * @returns {ActorAttribution[]} Sorted by confidence (highest first)
 *
 * @example
 * ```typescript
 * const ranked = rankAttributionConfidence(attributions);
 * // Result: [{ actorId: 'apt28', confidence: 95 }, { actorId: 'apt29', confidence: 70 }]
 * ```
 */
export declare const rankAttributionConfidence: (attributions: ActorAttribution[]) => ActorAttribution[];
/**
 * Creates relationship between two actors.
 *
 * @param {Omit<ActorRelationship, 'firstObserved' | 'lastObserved'>} relationship - Relationship data
 * @returns {ActorRelationship} Complete relationship
 *
 * @example
 * ```typescript
 * const relationship = createActorRelationship({
 *   sourceActorId: 'apt28',
 *   targetActorId: 'apt29',
 *   relationshipType: 'shares-infrastructure',
 *   confidence: 80,
 *   evidence: ['domain-overlap-report.pdf'],
 *   active: true
 * });
 * ```
 */
export declare const createActorRelationship: (relationship: Omit<ActorRelationship, "firstObserved" | "lastObserved">) => ActorRelationship;
/**
 * Builds actor relationship graph.
 *
 * @param {ActorRelationship[]} relationships - All relationships
 * @param {string} rootActorId - Root actor to build graph from
 * @returns {Record<string, string[]>} Adjacency list representation
 *
 * @example
 * ```typescript
 * const graph = buildActorRelationshipGraph(relationships, 'apt28');
 * // Result: { 'apt28': ['apt29', 'apt32'], 'apt29': ['apt28'] }
 * ```
 */
export declare const buildActorRelationshipGraph: (relationships: ActorRelationship[], rootActorId: string) => Record<string, string[]>;
/**
 * Finds related actors within N degrees of separation.
 *
 * @param {ActorRelationship[]} relationships - All relationships
 * @param {string} actorId - Starting actor
 * @param {number} degrees - Degrees of separation
 * @returns {string[]} Related actor IDs
 *
 * @example
 * ```typescript
 * const related = findRelatedActors(relationships, 'apt28', 2);
 * // Returns actors within 2 degrees of separation from APT28
 * ```
 */
export declare const findRelatedActors: (relationships: ActorRelationship[], actorId: string, degrees: number) => string[];
/**
 * NestJS service for threat actor management.
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class ThreatActorService {
 *   constructor(
 *     @InjectModel(ThreatActor) private actorModel: typeof ThreatActor,
 *     private logger: Logger
 *   ) {}
 *
 *   async createActor(dto: CreateActorDto): Promise<ThreatActor> {
 *     const actor = createThreatActor(dto);
 *     validateThreatActor(actor);
 *     return this.actorModel.create(actor);
 *   }
 *
 *   async getActorProfile(actorId: string): Promise<ActorProfile> {
 *     const actor = await this.actorModel.findByPk(actorId, {
 *       include: ['capabilities', 'ttps', 'infrastructure']
 *     });
 *     return enrichActorProfile(actor, {
 *       capabilities: actor.capabilities,
 *       ttps: actor.ttps,
 *       infrastructure: actor.infrastructure
 *     });
 *   }
 *
 *   async analyzeActor(actorId: string): Promise<ActorAnalysisReport> {
 *     const profile = await this.getActorProfile(actorId);
 *     const sophistication = assessActorCapabilities(profile.capabilities);
 *     const intent = analyzeActorIntent(profile.actor.motivation);
 *
 *     return {
 *       actor: profile.actor,
 *       riskScore: calculateActorRiskScore(profile),
 *       threatLevel: determineThreatLevel(sophistication, intent.confidence),
 *       capabilityAssessment: {
 *         overallLevel: sophistication,
 *         strengths: identifyStrengths(profile.capabilities),
 *         weaknesses: identifyWeaknesses(profile.capabilities)
 *       },
 *       activityTrend: analyzeActivityTrend(profile.timeline),
 *       recommendations: generateRecommendations(profile),
 *       generatedAt: new Date()
 *     };
 *   }
 * }
 * ```
 */
export declare const createThreatActorService: () => string;
/**
 * NestJS provider for actor attribution analysis.
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class ActorAttributionProvider {
 *   async attributeCampaign(
 *     campaignId: string,
 *     potentialActors: string[]
 *   ): Promise<ActorAttribution[]> {
 *     const attributions: ActorAttribution[] = [];
 *
 *     for (const actorId of potentialActors) {
 *       const evidence = await this.gatherEvidence(campaignId, actorId);
 *       const attribution = createActorAttribution({
 *         actorId,
 *         campaignId,
 *         attributionMethod: 'ttp-match',
 *         evidence,
 *         analyst: 'system'
 *       });
 *
 *       const validation = validateAttributionEvidence(attribution.evidence);
 *       if (validation.valid && attribution.confidence > 50) {
 *         attributions.push(attribution);
 *       }
 *     }
 *
 *     return rankAttributionConfidence(attributions);
 *   }
 * }
 * ```
 */
export declare const createAttributionProvider: () => string;
/**
 * Sequelize model definition for ThreatActor.
 *
 * @example
 * ```typescript
 * @Table({ tableName: 'threat_actors', timestamps: true })
 * export class ThreatActorModel extends Model {
 *   @PrimaryKey
 *   @Default(DataType.UUIDV4)
 *   @Column(DataType.UUID)
 *   id: string;
 *
 *   @Column({ type: DataType.STRING, allowNull: false })
 *   name: string;
 *
 *   @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
 *   aliases: string[];
 *
 *   @Column({
 *     type: DataType.ENUM('nation-state', 'criminal', 'hacktivist', 'insider', 'terrorist', 'unknown'),
 *     defaultValue: 'unknown'
 *   })
 *   type: string;
 *
 *   @Column({
 *     type: DataType.ENUM('minimal', 'low', 'medium', 'high', 'advanced', 'expert'),
 *     defaultValue: 'medium'
 *   })
 *   sophistication: string;
 *
 *   @Column({ type: DataType.JSONB, defaultValue: [] })
 *   motivation: ActorMotivation[];
 *
 *   @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
 *   firstSeen: Date;
 *
 *   @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
 *   lastSeen: Date;
 *
 *   @Column({ type: DataType.BOOLEAN, defaultValue: true })
 *   active: boolean;
 *
 *   @Column({ type: DataType.INTEGER, defaultValue: 50, validate: { min: 0, max: 100 } })
 *   confidence: number;
 *
 *   @Column(DataType.TEXT)
 *   description: string;
 *
 *   @Column({ type: DataType.JSONB, defaultValue: {} })
 *   metadata: Record<string, unknown>;
 *
 *   @HasMany(() => ActorCapabilityModel)
 *   capabilities: ActorCapabilityModel[];
 *
 *   @HasMany(() => ActorTTPModel)
 *   ttps: ActorTTPModel[];
 *
 *   @HasMany(() => ActorInfrastructureModel)
 *   infrastructure: ActorInfrastructureModel[];
 * }
 * ```
 */
export declare const defineThreatActorModel: () => string;
/**
 * Sequelize model for ActorCapability.
 *
 * @example
 * ```typescript
 * @Table({ tableName: 'actor_capabilities', timestamps: true })
 * export class ActorCapabilityModel extends Model {
 *   @ForeignKey(() => ThreatActorModel)
 *   @Column(DataType.UUID)
 *   actorId: string;
 *
 *   @BelongsTo(() => ThreatActorModel)
 *   actor: ThreatActorModel;
 *
 *   @Column({
 *     type: DataType.ENUM('malware', 'exploit', 'infrastructure', 'social-engineering', 'cryptography', 'evasion')
 *   })
 *   category: string;
 *
 *   @Column(DataType.STRING)
 *   name: string;
 *
 *   @Column(DataType.TEXT)
 *   description: string;
 *
 *   @Column({
 *     type: DataType.ENUM('basic', 'intermediate', 'advanced', 'expert')
 *   })
 *   proficiencyLevel: string;
 *
 *   @Column({ type: DataType.ARRAY(DataType.STRING), defaultValue: [] })
 *   evidence: string[];
 *
 *   @Column({ type: DataType.INTEGER, validate: { min: 0, max: 100 } })
 *   confidence: number;
 *
 *   @Column(DataType.DATE)
 *   lastObserved: Date;
 * }
 * ```
 */
export declare const defineActorCapabilityModel: () => string;
/**
 * Swagger API endpoint for creating threat actor.
 *
 * @example
 * ```typescript
 * @ApiTags('Threat Actors')
 * @Controller('threat-actors')
 * export class ThreatActorsController {
 *   @Post()
 *   @ApiOperation({ summary: 'Create new threat actor profile' })
 *   @ApiBody({ type: CreateActorDto })
 *   @ApiResponse({ status: 201, description: 'Actor created', type: ThreatActorDto })
 *   @ApiResponse({ status: 400, description: 'Invalid input' })
 *   async create(@Body() dto: CreateActorDto): Promise<ThreatActorDto> {
 *     const actor = createThreatActor(dto);
 *     validateThreatActor(actor);
 *     return this.actorService.create(actor);
 *   }
 *
 *   @Get(':id/profile')
 *   @ApiOperation({ summary: 'Get comprehensive actor profile' })
 *   @ApiParam({ name: 'id', description: 'Actor ID' })
 *   @ApiResponse({ status: 200, type: ActorProfileDto })
 *   async getProfile(@Param('id') id: string): Promise<ActorProfileDto> {
 *     return this.actorService.getActorProfile(id);
 *   }
 *
 *   @Post(':id/capabilities')
 *   @ApiOperation({ summary: 'Add capability to actor' })
 *   async addCapability(
 *     @Param('id') id: string,
 *     @Body() dto: AddCapabilityDto
 *   ): Promise<void> {
 *     const actor = await this.actorService.findById(id);
 *     const updated = addActorCapability(actor.capabilities, dto);
 *     await this.actorService.updateCapabilities(id, updated);
 *   }
 * }
 * ```
 */
export declare const defineActorAPI: () => string;
/**
 * Generates unique actor ID.
 *
 * @returns {string} Unique actor identifier
 *
 * @example
 * ```typescript
 * const id = generateActorId();
 * // Result: 'actor-uuid-v4'
 * ```
 */
export declare const generateActorId: () => string;
/**
 * Calculates actor risk score based on profile.
 *
 * @param {ActorProfile} profile - Actor profile
 * @returns {number} Risk score (0-100)
 *
 * @example
 * ```typescript
 * const risk = calculateActorRiskScore(profile);
 * // Result: 85
 * ```
 */
export declare const calculateActorRiskScore: (profile: ActorProfile) => number;
/**
 * Searches actors by criteria with filtering.
 *
 * @param {ThreatActor[]} actors - Actor list
 * @param {ActorSearchCriteria} criteria - Search criteria
 * @returns {ThreatActor[]} Matching actors
 *
 * @example
 * ```typescript
 * const results = searchActors(allActors, {
 *   type: 'nation-state',
 *   minConfidence: 70,
 *   active: true
 * });
 * ```
 */
export declare const searchActors: (actors: ThreatActor[], criteria: ActorSearchCriteria) => ThreatActor[];
declare const _default: {
    createThreatActor: (actorData: Partial<ThreatActor>) => ThreatActor;
    validateThreatActor: (actor: ThreatActor) => boolean;
    enrichActorProfile: (actor: ThreatActor, enrichmentData: Partial<ActorProfile>) => ActorProfile;
    mergeActorProfiles: (actors: ThreatActor[]) => ThreatActor;
    assessActorCapabilities: (capabilities: ActorCapability[]) => ThreatActor["sophistication"];
    addActorCapability: (capabilities: ActorCapability[], newCapability: Omit<ActorCapability, "lastObserved">) => ActorCapability[];
    calculateCapabilityCoverage: (capabilities: ActorCapability[]) => Record<ActorCapability["category"], number>;
    analyzeActorIntent: (motivations: ActorMotivation[]) => {
        primary: ActorMotivation["type"];
        secondary: ActorMotivation["type"][];
        confidence: number;
    };
    inferActorMotivation: (ttps: ActorTTP[], targetSectors: string[]) => ActorMotivation[];
    updateActorMotivation: (current: ActorMotivation[], newMotivation: ActorMotivation) => ActorMotivation[];
    trackActorInfrastructure: (infrastructure: Omit<ActorInfrastructure, "firstSeen" | "lastSeen">) => ActorInfrastructure;
    findInfrastructureOverlap: (actor1Infra: ActorInfrastructure[], actor2Infra: ActorInfrastructure[]) => ActorInfrastructure[];
    markInactiveInfrastructure: (infrastructure: ActorInfrastructure[], inactiveDays: number) => ActorInfrastructure[];
    mapTTPToMITRE: (ttp: Omit<ActorTTP, "observationCount" | "firstObserved" | "lastObserved">) => ActorTTP;
    calculateTTPSimilarity: (actor1TTPs: ActorTTP[], actor2TTPs: ActorTTP[]) => number;
    getCommonTTPs: (ttps: ActorTTP[], topN?: number) => ActorTTP[];
    updateTTPObservation: (ttps: ActorTTP[], mitreAttackId: string) => ActorTTP[];
    calculateAttributionConfidence: (evidence: AttributionEvidence[]) => number;
    createActorAttribution: (attribution: Omit<ActorAttribution, "confidence" | "evidenceScore" | "timestamp">) => ActorAttribution;
    validateAttributionEvidence: (evidence: AttributionEvidence[]) => {
        valid: boolean;
        issues: string[];
    };
    rankAttributionConfidence: (attributions: ActorAttribution[]) => ActorAttribution[];
    createActorRelationship: (relationship: Omit<ActorRelationship, "firstObserved" | "lastObserved">) => ActorRelationship;
    buildActorRelationshipGraph: (relationships: ActorRelationship[], rootActorId: string) => Record<string, string[]>;
    findRelatedActors: (relationships: ActorRelationship[], actorId: string, degrees: number) => string[];
    createThreatActorService: () => string;
    createAttributionProvider: () => string;
    defineThreatActorModel: () => string;
    defineActorCapabilityModel: () => string;
    defineActorAPI: () => string;
    generateActorId: () => string;
    calculateActorRiskScore: (profile: ActorProfile) => number;
    searchActors: (actors: ThreatActor[], criteria: ActorSearchCriteria) => ThreatActor[];
};
export default _default;
//# sourceMappingURL=threat-actors-kit.d.ts.map