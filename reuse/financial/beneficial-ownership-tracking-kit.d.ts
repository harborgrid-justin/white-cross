/**
 * LOC: BO-TRACK-001
 * File: /reuse/financial/beneficial-ownership-tracking-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (Model, DataTypes, Transaction, Op)
 *   - @nestjs/common (Injectable)
 *
 * DOWNSTREAM (imported by):
 *   - backend/compliance/beneficial-ownership-service.ts
 *   - backend/aml/ubo-verification.service.ts
 *   - backend/compliance/ownership-disclosure.service.ts
 *   - backend/controllers/beneficial-owner.controller.ts
 */
/**
 * Represents a beneficial owner with comprehensive identifying information
 */
interface BeneficialOwner {
    ownerId: string;
    entityId: string;
    ownerName: string;
    ownerType: 'individual' | 'corporate' | 'trust' | 'partnership' | 'other';
    nationalId?: string;
    taxId?: string;
    ownershipPercentage: number;
    votingRightsPercentage: number;
    controlRights: number;
    isUBO: boolean;
    uboProbability: number;
    disclosureDate: Date;
    verificationStatus: 'verified' | 'pending' | 'unverified' | 'failed';
    verificationDate?: Date;
    metadata?: Record<string, any>;
}
/**
 * Represents ownership structure hierarchy
 */
interface OwnershipNode {
    entityId: string;
    entityName: string;
    entityType: 'individual' | 'corporate' | 'trust' | 'partnership';
    ownershipPercentage: number;
    depth: number;
    parent?: string;
    children?: string[];
    isNominee?: boolean;
    isTrust?: boolean;
    jurisdictionOfIncorporation?: string;
}
/**
 * Ownership structure graph representation
 */
interface OwnershipStructure {
    entityId: string;
    nodes: OwnershipNode[];
    edges: {
        from: string;
        to: string;
        percentage: number;
    }[];
    depth: number;
    isComplex: boolean;
    complexityScore: number;
}
/**
 * Control determination analysis
 */
interface ControlAnalysis {
    entityId: string;
    controlPersonId: string;
    controlPersonName: string;
    controlMechanism: 'majority_ownership' | 'voting_agreement' | 'board_position' | 'contractual' | 'combination';
    controlPercentage: number;
    directControl: boolean;
    indirectControl: boolean;
    controlChainLength: number;
    certaintyLevel: number;
    verificationDate: Date;
    notes?: string;
}
/**
 * Layered ownership analysis result
 */
interface LayeredOwnershipAnalysis {
    entityId: string;
    analysisId: string;
    layer1: Map<string, number>;
    layer2: Map<string, number>;
    layer3: Map<string, number>;
    layer4Plus: Map<string, number>;
    cumulativeOwnership: Map<string, number>;
    analysisDate: Date;
    complexityIndicators: string[];
}
/**
 * Nominee shareholder detection result
 */
interface NomineeDetection {
    entityId: string;
    shareholderId: string;
    shareholderName: string;
    nomineeScore: number;
    suspiciousIndicators: string[];
    isLikelyNominee: boolean;
    confidenceLevel: number;
    analysisDate: Date;
    recommendations?: string[];
}
/**
 * Trust beneficiary information
 */
interface TrustBeneficiary {
    trustId: string;
    beneficiaryId: string;
    beneficiaryName: string;
    beneficiaryType: 'individual' | 'corporate' | 'other';
    beneficiaryStatus: 'current' | 'contingent' | 'residual';
    interestPercentage: number;
    controlRights: number;
    districtOfTrustee?: string;
    verificationDate?: Date;
    metadata?: Record<string, any>;
}
/**
 * Corporate veil penetration analysis
 */
interface CorporateVeilAnalysis {
    entityId: string;
    analysisId: string;
    veilScore: number;
    penalizedOwners: string[];
    liabilityIndicators: string[];
    hasVeilPenetrated: boolean;
    penetrationReasons: string[];
    regulatoryRisks: string[];
    analysisDate: Date;
    recommendations?: string[];
}
/**
 * Ultimate Beneficial Owner identification
 */
interface UBOIdentification {
    entityId: string;
    uboId: string;
    uboName: string;
    ubotype: 'individual' | 'multiple_entities';
    ownershipChain: {
        entityId: string;
        entityName: string;
        percentage: number;
    }[];
    cumulativeOwnershipPercentage: number;
    controlPercentage: number;
    identificationMethod: 'ownership' | 'voting_control' | 'board_position' | 'combination';
    verificationStatus: 'verified' | 'pending' | 'partially_verified';
    riskRating: 'low' | 'medium' | 'high' | 'critical';
    identificationDate: Date;
    reviewDate?: Date;
    confidence: number;
}
/**
 * Ownership chain validation result
 */
interface OwnershipChainValidation {
    entityId: string;
    validationId: string;
    chainLength: number;
    isValid: boolean;
    inconsistencies: string[];
    missingDocumentation: string[];
    conflictingOwnership: string[];
    totalPercentageOwned: number;
    validationDate: Date;
    reviewStatus: 'passed' | 'failed' | 'needs_review';
}
/**
 * Voting rights structure
 */
interface VotingRightsAnalysis {
    entityId: string;
    analysisId: string;
    shareholders: {
        shareholderId: string;
        votingRights: number;
    }[];
    totalVotingRights: number;
    majorityThreshold: number;
    hasVotingAgreement: boolean;
    votingAgreementTerms?: string;
    supermajorityRequired: boolean;
    votingPowerConcentration: number;
    analysisDate: Date;
}
/**
 * Control change detection
 */
interface ControlChange {
    entityId: string;
    changeId: string;
    previousControlPerson: string;
    newControlPerson: string;
    changeType: 'transfer' | 'acquisition' | 'merger' | 'restructuring';
    changeDate: Date;
    notificationDate?: Date;
    regulatoryNotified: boolean;
    disclosureDate?: Date;
    documentationComplete: boolean;
}
/**
 * Ownership transparency score
 */
interface TransparencyScore {
    entityId: string;
    scoreId: string;
    overallScore: number;
    ownershipDisclosureScore: number;
    documentationCompleteScore: number;
    beneficiaryIdentificationScore: number;
    controlIdentificationScore: number;
    uboVerificationScore: number;
    riskIndicators: string[];
    recommendations: string[];
    scoringDate: Date;
    nextReviewDate: Date;
}
/**
 * Shell company detection analysis
 */
interface ShellCompanyAnalysis {
    entityId: string;
    analysisId: string;
    shellScore: number;
    isLikelyShell: boolean;
    suspiciousFeatures: string[];
    noSignificantAssets: boolean;
    noActiveOperations: boolean;
    miniminalEmployees: boolean;
    obscuredBeneficialOwnership: boolean;
    unusualOwnershipStructure: boolean;
    analysisDate: Date;
    recommendations?: string[];
}
/**
 * Complex ownership structure analysis
 */
interface ComplexStructureAnalysis {
    entityId: string;
    analysisId: string;
    totalLayers: number;
    totalNodes: number;
    totalEdges: number;
    cycleDetected: boolean;
    cyclePaths?: string[][];
    averageChainLength: number;
    maxChainLength: number;
    jurisdictionalDiversity: string[];
    trusts: number;
    partnerships: number;
    complexityRating: 'simple' | 'moderate' | 'complex' | 'highly_complex';
    analysisDate: Date;
}
/**
 * Identifies and validates beneficial owners for an entity
 * @param entityId - The entity identifier
 * @param ownershipRecords - Array of ownership records
 * @returns Array of identified beneficial owners
 */
export declare function identifyBeneficialOwners(entityId: string, ownershipRecords: any[]): BeneficialOwner[];
/**
 * Registers a new beneficial owner
 * @param ownerData - Beneficial owner data
 * @returns Registered beneficial owner with ID
 */
export declare function registerBeneficialOwner(ownerData: Partial<BeneficialOwner>): BeneficialOwner;
/**
 * Updates beneficial owner information
 * @param ownerId - Beneficial owner ID
 * @param updates - Partial updates to apply
 * @returns Updated beneficial owner
 */
export declare function updateBeneficialOwner(ownerId: string, updates: Partial<BeneficialOwner>): BeneficialOwner;
/**
 * Verifies beneficial owner identity and documentation
 * @param ownerId - Beneficial owner ID
 * @param verificationData - Verification documents and information
 * @returns Verification result
 */
export declare function verifyBeneficialOwnerIdentity(ownerId: string, verificationData: any): {
    verified: boolean;
    status: string;
    score: number;
    issues?: string[];
};
/**
 * Calculates UBO probability based on ownership characteristics
 * @param ownershipRecord - Ownership record data
 * @returns Probability score (0-1)
 */
export declare function calculateUBOProbability(ownershipRecord: any): number;
/**
 * Maps ownership structure from flat records into hierarchical nodes
 * @param entityId - Primary entity ID
 * @param ownershipRecords - Flat list of ownership records
 * @returns OwnershipStructure with nodes and edges
 */
export declare function mapOwnershipStructure(entityId: string, ownershipRecords: any[]): OwnershipStructure;
/**
 * Builds ownership hierarchy tree structure
 * @param ownershipStructure - Base ownership structure
 * @returns Tree representation suitable for traversal
 */
export declare function buildOwnershipHierarchy(ownershipStructure: OwnershipStructure): Map<string, OwnershipNode[]>;
/**
 * Traces ownership path from entity to owner
 * @param entityId - Starting entity ID
 * @param ownerId - Target owner ID
 * @param structure - Ownership structure
 * @returns Path array showing ownership chain
 */
export declare function traceOwnershipPath(entityId: string, ownerId: string, structure: OwnershipStructure): {
    entityId: string;
    percentage: number;
}[];
/**
 * Identifies all direct owners of an entity
 * @param entityId - Entity to find owners for
 * @param structure - Ownership structure
 * @returns Array of direct owners
 */
export declare function getDirectOwners(entityId: string, structure: OwnershipStructure): OwnershipNode[];
/**
 * Retrieves all indirect owners through specified layers
 * @param entityId - Entity to analyze
 * @param structure - Ownership structure
 * @param maxLayers - Maximum layers to traverse
 * @returns Map of owners by depth
 */
export declare function getIndirectOwners(entityId: string, structure: OwnershipStructure, maxLayers?: number): Map<number, OwnershipNode[]>;
/**
 * Determines the control person(s) of an entity
 * @param entityId - Entity to analyze
 * @param ownershipData - Ownership and control data
 * @returns ControlAnalysis result
 */
export declare function determineControlPerson(entityId: string, ownershipData: any): ControlAnalysis;
/**
 * Analyzes multiple control mechanisms
 * @param entityId - Entity to analyze
 * @param controlMechanisms - Array of control mechanisms
 * @returns Array of control analyses ranked by strength
 */
export declare function analyzeControlMechanisms(entityId: string, controlMechanisms: any[]): ControlAnalysis[];
/**
 * Verifies control person authority and rights
 * @param controlPersonId - Control person ID
 * @param entityId - Controlled entity ID
 * @param authorityDocuments - Supporting documentation
 * @returns Authority verification result
 */
export declare function verifyControlAuthority(controlPersonId: string, entityId: string, authorityDocuments: any[]): {
    isAuthorized: boolean;
    authority: string[];
    validationScore: number;
};
/**
 * Identifies beneficial owners with significant control
 * @param entityId - Entity to analyze
 * @param ownershipRecords - Ownership records
 * @param controlThreshold - Threshold percentage (default 25%)
 * @returns Array of controlling beneficial owners
 */
export declare function identifyControllingOwners(entityId: string, ownershipRecords: any[], controlThreshold?: number): BeneficialOwner[];
/**
 * Performs multi-layer ownership analysis
 * @param entityId - Entity to analyze
 * @param ownershipStructure - Complete ownership structure
 * @returns LayeredOwnershipAnalysis result
 */
export declare function analyzeLayeredOwnership(entityId: string, ownershipStructure: OwnershipStructure): LayeredOwnershipAnalysis;
/**
 * Calculates ultimate owners by accumulating ownership through layers
 * @param entityId - Entity to analyze
 * @param analysis - Layered ownership analysis
 * @param ownershipThreshold - Minimum ownership percentage (default 5%)
 * @returns Map of ultimate owners with accumulated percentages
 */
export declare function calculateUltimateOwners(entityId: string, analysis: LayeredOwnershipAnalysis, ownershipThreshold?: number): Map<string, number>;
/**
 * Detects circular ownership patterns
 * @param ownershipStructure - Complete ownership structure
 * @returns Array of circular ownership paths if detected
 */
export declare function detectCircularOwnership(ownershipStructure: OwnershipStructure): string[][];
/**
 * Analyzes ownership risk based on structure complexity
 * @param analysis - Layered ownership analysis
 * @param structure - Ownership structure
 * @returns Risk assessment with recommendations
 */
export declare function analyzeOwnershipRisk(analysis: LayeredOwnershipAnalysis, structure: OwnershipStructure): {
    riskLevel: 'low' | 'medium' | 'high';
    riskFactors: string[];
    recommendations: string[];
};
/**
 * Detects potential nominee shareholders
 * @param entityId - Entity to analyze
 * @param shareholders - Array of shareholder records
 * @returns Array of nominee detection results
 */
export declare function detectNomineeShareholders(entityId: string, shareholders: any[]): NomineeDetection[];
/**
 * Verifies nominee shareholder claims
 * @param shareholderId - Shareholder to verify
 * @param verificationDocuments - Supporting documents
 * @returns Verification result
 */
export declare function verifyNomineeStatus(shareholderId: string, verificationDocuments: any[]): {
    isNominee: boolean;
    supportingEvidence: string[];
    verificationScore: number;
};
/**
 * Identifies the true beneficial owner behind a nominee
 * @param nomineeId - Nominee shareholder ID
 * @param ownershipRecords - Related ownership records
 * @returns Identified beneficial owner information
 */
export declare function identifyBeneficialOwnerBehindNominee(nomineeId: string, ownershipRecords: any[]): BeneficialOwner | null;
/**
 * Tracks and identifies trust beneficiaries
 * @param trustId - Trust entity ID
 * @param trustDocuments - Trust documentation
 * @returns Array of identified beneficiaries
 */
export declare function trackTrustBeneficiaries(trustId: string, trustDocuments: any[]): TrustBeneficiary[];
/**
 * Analyzes trust control and beneficial interests
 * @param trustId - Trust entity ID
 * @param trustBeneficiaries - Array of beneficiaries
 * @returns Analysis of control and economic interests
 */
export declare function analyzeTrustControl(trustId: string, trustBeneficiaries: TrustBeneficiary[]): {
    trusteeControl: number;
    beneficiaryControl: number;
    economicInterest: Map<string, number>;
    hasConflict: boolean;
};
/**
 * Identifies discretionary trust elements that affect beneficial ownership
 * @param trustDeed - Trust deed document
 * @returns Discretionary elements analysis
 */
export declare function analyzeDiscretionaryTrustElements(trustDeed: any): {
    isDiscretionary: boolean;
    distributions: string[];
    beneficiaryClass: string[];
    trusteeDiscretion: number;
    protectorRole: boolean;
};
/**
 * Calculates effective beneficial ownership through trust structures
 * @param trustId - Trust entity ID
 * @param trustBeneficiaries - Array of beneficiaries
 * @param trustBeneficiaryPercentage - Ownership percentage of trust
 * @returns Effective ownership calculation
 */
export declare function calculateTrustBeneficialOwnership(trustId: string, trustBeneficiaries: TrustBeneficiary[], trustBeneficiaryPercentage: number): Map<string, number>;
/**
 * Analyzes corporate veil penetration risk
 * @param entityId - Entity to analyze
 * @param corporateRecords - Corporate structure records
 * @returns Corporate veil analysis result
 */
export declare function analyzeCorporateVeil(entityId: string, corporateRecords: any): CorporateVeilAnalysis;
/**
 * Identifies entities at risk of veil penetration
 * @param structure - Ownership structure
 * @returns Array of at-risk entities with risk factors
 */
export declare function identifyVeilPenetrationRisk(structure: OwnershipStructure): {
    entityId: string;
    riskScore: number;
    riskFactors: string[];
}[];
/**
 * Validates legitimate corporate structures against veil penetration
 * @param entityId - Entity to validate
 * @param structureDocumentation - Supporting documentation
 * @returns Validation result with recommendations
 */
export declare function validateCorporateStructureIntegrity(entityId: string, structureDocumentation: any[]): {
    isLegitimate: boolean;
    issues: string[];
    recommendations: string[];
};
/**
 * Identifies Ultimate Beneficial Owners
 * @param entityId - Entity to analyze
 * @param ownershipStructure - Complete ownership structure
 * @param ownershipThreshold - Minimum ownership threshold (default 25%)
 * @returns Identified UBOs
 */
export declare function identifyUBOs(entityId: string, ownershipStructure: OwnershipStructure, ownershipThreshold?: number): UBOIdentification[];
/**
 * Verifies UBO identity and control
 * @param uboIdentification - UBO identification record
 * @param verificationDocuments - Supporting documents
 * @returns Verification result
 */
export declare function verifyUBOIdentity(uboIdentification: UBOIdentification, verificationDocuments: any[]): {
    verified: boolean;
    verificationStatus: 'verified' | 'pending' | 'partially_verified';
    score: number;
    issues?: string[];
};
/**
 * Generates UBO report with findings and recommendations
 * @param ubos - Array of identified UBOs
 * @param riskAssessment - Risk assessment data
 * @returns UBO report
 */
export declare function generateUBOReport(ubos: UBOIdentification[], riskAssessment?: any): {
    ubos: UBOIdentification[];
    totalUBOs: number;
    reportDate: Date;
    riskLevel: string;
    recommendations: string[];
};
/**
 * Validates complete ownership chain integrity
 * @param entityId - Entity to validate
 * @param ownershipStructure - Ownership structure
 * @returns Validation result
 */
export declare function validateOwnershipChain(entityId: string, ownershipStructure: OwnershipStructure): OwnershipChainValidation;
/**
 * Reconciles ownership data from multiple sources
 * @param entityId - Entity to reconcile
 * @param sourcesData - Ownership data from different sources
 * @returns Reconciliation result with discrepancies
 */
export declare function reconcileOwnershipSources(entityId: string, sourcesData: {
    source: string;
    owners: any[];
}[]): {
    reconciled: boolean;
    discrepancies: string[];
    consensusOwners: BeneficialOwner[];
    conflictingRecords: any[];
};
/**
 * Documents all ownership changes in chronological order
 * @param entityId - Entity to track
 * @param changeHistory - Historical change records
 * @returns Validated change history with audit trail
 */
export declare function documentOwnershipChangeHistory(entityId: string, changeHistory: any[]): {
    validHistory: ControlChange[];
    anomalies: string[];
    auditTrail: {
        date: Date;
        change: string;
    }[];
};
/**
 * Calculates total ownership percentage including all layers
 * @param entityId - Entity to analyze
 * @param ownershipStructure - Ownership structure
 * @param targetOwnerId - ID of owner to calculate percentage for
 * @returns Total ownership percentage
 */
export declare function calculateTotalOwnershipPercentage(entityId: string, ownershipStructure: OwnershipStructure, targetOwnerId: string): number;
/**
 * Calculates diluted ownership accounting for options and warrants
 * @param entityId - Entity to analyze
 * @param baseOwnership - Base ownership percentage
 * @param dilutiveInstruments - Options, warrants, convertibles
 * @returns Fully diluted ownership percentage
 */
export declare function calculateFullyDilutedOwnership(entityId: string, baseOwnership: number, dilutiveInstruments: any[]): {
    baseOwnership: number;
    fullyDilutedOwnership: number;
    dilutionImpact: number;
};
/**
 * Analyzes voting rights structure and concentration
 * @param entityId - Entity to analyze
 * @param shareholders - Shareholder records with voting information
 * @returns Voting rights analysis
 */
export declare function analyzeVotingRights(entityId: string, shareholders: any[]): VotingRightsAnalysis;
/**
 * Detects differential voting structures (different classes of shares)
 * @param entityId - Entity to analyze
 * @param shareClasses - Share class definitions
 * @returns Analysis of voting disparities
 */
export declare function detectDifferentialVoting(entityId: string, shareClasses: any[]): {
    hasDifferentialVoting: boolean;
    shareClasses: {
        class: string;
        votingRights: number;
        economicRights: number;
    }[];
    votingDisparityRatio: number;
    riskLevel: string;
};
/**
 * Detects and analyzes changes in control
 * @param entityId - Entity to monitor
 * @param historicalOwnership - Historical ownership records
 * @returns Detected control changes
 */
export declare function detectControlChanges(entityId: string, historicalOwnership: any[]): ControlChange[];
/**
 * Monitors for changes exceeding regulatory thresholds
 * @param entityId - Entity to monitor
 * @param currentOwnership - Current ownership structure
 * @param previousOwnership - Previous ownership structure
 * @param thresholds - Regulatory thresholds to monitor (default [5%, 10%, 25%, 50%])
 * @returns Threshold breaches and required notifications
 */
export declare function monitorThresholdBreaches(entityId: string, currentOwnership: Map<string, number>, previousOwnership: Map<string, number>, thresholds?: number[]): {
    breaches: string[];
    notificationRequired: boolean;
    disclosureDeadline: Date;
};
/**
 * Calculates ownership transparency score
 * @param entityId - Entity to score
 * @param ownershipData - Ownership disclosure data
 * @returns Transparency score and recommendations
 */
export declare function calculateTransparencyScore(entityId: string, ownershipData: any): TransparencyScore;
/**
 * Generates transparency improvement plan
 * @param transparencyScore - Current transparency score
 * @returns Prioritized improvement recommendations
 */
export declare function generateTransparencyImprovementPlan(transparencyScore: TransparencyScore): {
    plan: {
        priority: number;
        action: string;
        targetDate: Date;
        owner: string;
    }[];
    estimatedCompletionDate: Date;
    targetScore: number;
};
/**
 * Analyzes entity characteristics to detect shell company indicators
 * @param entityId - Entity to analyze
 * @param entityData - Entity information and operations
 * @returns Shell company analysis result
 */
export declare function analyzeShellCompanyIndicators(entityId: string, entityData: any): ShellCompanyAnalysis;
/**
 * Compares entity against known shell company patterns
 * @param entityData - Entity information
 * @param patternLibrary - Known shell company patterns
 * @returns Pattern match analysis
 */
export declare function matchShellCompanyPatterns(entityData: any, patternLibrary: any[]): {
    matchedPatterns: string[];
    matchScore: number;
    riskRating: string;
};
/**
 * Analyzes complexity of ownership structure
 * @param ownershipStructure - Complete ownership structure
 * @returns Complex structure analysis
 */
export declare function analyzeComplexStructure(ownershipStructure: OwnershipStructure): ComplexStructureAnalysis;
/**
 * Generates recommendations for simplifying complex structures
 * @param analysis - Complex structure analysis
 * @returns Simplification recommendations
 */
export declare function generateSimplificationRecommendations(analysis: ComplexStructureAnalysis): {
    recommendations: string[];
    potentialBenefits: string[];
    implementationComplexity: 'low' | 'medium' | 'high';
    estimatedTimeline: string;
};
declare const _default: {
    identifyBeneficialOwners: typeof identifyBeneficialOwners;
    registerBeneficialOwner: typeof registerBeneficialOwner;
    updateBeneficialOwner: typeof updateBeneficialOwner;
    verifyBeneficialOwnerIdentity: typeof verifyBeneficialOwnerIdentity;
    calculateUBOProbability: typeof calculateUBOProbability;
    mapOwnershipStructure: typeof mapOwnershipStructure;
    buildOwnershipHierarchy: typeof buildOwnershipHierarchy;
    traceOwnershipPath: typeof traceOwnershipPath;
    getDirectOwners: typeof getDirectOwners;
    getIndirectOwners: typeof getIndirectOwners;
    determineControlPerson: typeof determineControlPerson;
    analyzeControlMechanisms: typeof analyzeControlMechanisms;
    verifyControlAuthority: typeof verifyControlAuthority;
    identifyControllingOwners: typeof identifyControllingOwners;
    analyzeLayeredOwnership: typeof analyzeLayeredOwnership;
    calculateUltimateOwners: typeof calculateUltimateOwners;
    detectCircularOwnership: typeof detectCircularOwnership;
    analyzeOwnershipRisk: typeof analyzeOwnershipRisk;
    detectNomineeShareholders: typeof detectNomineeShareholders;
    verifyNomineeStatus: typeof verifyNomineeStatus;
    identifyBeneficialOwnerBehindNominee: typeof identifyBeneficialOwnerBehindNominee;
    trackTrustBeneficiaries: typeof trackTrustBeneficiaries;
    analyzeTrustControl: typeof analyzeTrustControl;
    analyzeDiscretionaryTrustElements: typeof analyzeDiscretionaryTrustElements;
    calculateTrustBeneficialOwnership: typeof calculateTrustBeneficialOwnership;
    analyzeCorporateVeil: typeof analyzeCorporateVeil;
    identifyVeilPenetrationRisk: typeof identifyVeilPenetrationRisk;
    validateCorporateStructureIntegrity: typeof validateCorporateStructureIntegrity;
    identifyUBOs: typeof identifyUBOs;
    verifyUBOIdentity: typeof verifyUBOIdentity;
    generateUBOReport: typeof generateUBOReport;
    validateOwnershipChain: typeof validateOwnershipChain;
    reconcileOwnershipSources: typeof reconcileOwnershipSources;
    documentOwnershipChangeHistory: typeof documentOwnershipChangeHistory;
    calculateTotalOwnershipPercentage: typeof calculateTotalOwnershipPercentage;
    calculateFullyDilutedOwnership: typeof calculateFullyDilutedOwnership;
    analyzeVotingRights: typeof analyzeVotingRights;
    detectDifferentialVoting: typeof detectDifferentialVoting;
    detectControlChanges: typeof detectControlChanges;
    monitorThresholdBreaches: typeof monitorThresholdBreaches;
    calculateTransparencyScore: typeof calculateTransparencyScore;
    generateTransparencyImprovementPlan: typeof generateTransparencyImprovementPlan;
    analyzeShellCompanyIndicators: typeof analyzeShellCompanyIndicators;
    matchShellCompanyPatterns: typeof matchShellCompanyPatterns;
    analyzeComplexStructure: typeof analyzeComplexStructure;
    generateSimplificationRecommendations: typeof generateSimplificationRecommendations;
};
export default _default;
//# sourceMappingURL=beneficial-ownership-tracking-kit.d.ts.map