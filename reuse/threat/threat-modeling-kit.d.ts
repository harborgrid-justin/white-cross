/**
 * @fileoverview Threat Modeling Kit - Enterprise Security Architecture and Threat Analysis
 * @module reuse/threat/threat-modeling-kit
 * @description Comprehensive threat modeling toolkit for enterprise security architecture,
 * providing STRIDE, DREAD, PASTA methodologies, data flow analysis, attack tree generation,
 * and MITRE ATT&CK integration. Designed to compete with enterprise threat modeling solutions.
 *
 * Key Features:
 * - Multi-framework threat model creation (STRIDE, DREAD, PASTA, LINDDUN, VAST)
 * - Automated data flow diagram (DFD) analysis and generation
 * - Trust boundary identification and classification
 * - Attack tree generation with probability scoring
 * - Threat scenario modeling with impact assessment
 * - Security architecture review and validation
 * - Threat model validation and completeness checking
 * - Risk-based threat prioritization using multiple scoring systems
 * - Threat model versioning and maintenance workflows
 * - MITRE ATT&CK framework integration and mapping
 * - Collaborative threat modeling with team workflows
 * - Threat model report generation and documentation
 *
 * @target Enterprise Threat Modeling alternative (Microsoft Threat Modeling Tool, IriusRisk)
 * @framework NestJS 10.x, Sequelize 6.x, TypeScript 5.x
 *
 * @security
 * - Role-based access control for threat models
 * - Audit trails for threat model changes
 * - Sensitive threat data encryption
 * - SOC 2 Type II compliance
 * - Multi-tenant threat model isolation
 *
 * @example STRIDE threat modeling
 * ```typescript
 * import { createSTRIDEThreatModel, analyzeSTRIDEThreats } from './threat-modeling-kit';
 *
 * const model = await createSTRIDEThreatModel({
 *   applicationId: 'app-123',
 *   applicationName: 'Payment Processing API',
 *   scope: 'ENTIRE_APPLICATION',
 *   assets: ['customer-data', 'payment-info', 'authentication'],
 * }, sequelize);
 *
 * const threats = await analyzeSTRIDEThreats(model.id, sequelize);
 * ```
 *
 * @example Data flow diagram analysis
 * ```typescript
 * import { generateDataFlowDiagram, analyzeTrustBoundaries } from './threat-modeling-kit';
 *
 * const dfd = await generateDataFlowDiagram({
 *   applicationId: 'app-123',
 *   components: ['web-app', 'api', 'database'],
 *   dataFlows: [
 *     { from: 'web-app', to: 'api', data: 'user-credentials' },
 *     { from: 'api', to: 'database', data: 'encrypted-data' },
 *   ],
 * }, sequelize);
 *
 * const boundaries = await analyzeTrustBoundaries(dfd.id, sequelize);
 * ```
 *
 * LOC: THREAT-MODEL-014
 * UPSTREAM: sequelize, @nestjs/*, swagger, date-fns
 * DOWNSTREAM: security-operations, risk-management, compliance, architecture
 *
 * @version 1.0.0
 * @since 2025-01-09
 */
import { Model, Sequelize, Transaction } from 'sequelize';
/**
 * @enum ThreatModelFramework
 * @description Threat modeling frameworks
 */
export declare enum ThreatModelFramework {
    STRIDE = "STRIDE",
    DREAD = "DREAD",
    PASTA = "PASTA",
    LINDDUN = "LINDDUN",
    VAST = "VAST",
    OCTAVE = "OCTAVE",
    TRIKE = "TRIKE"
}
/**
 * @enum STRIDECategory
 * @description STRIDE threat categories
 */
export declare enum STRIDECategory {
    SPOOFING = "SPOOFING",
    TAMPERING = "TAMPERING",
    REPUDIATION = "REPUDIATION",
    INFORMATION_DISCLOSURE = "INFORMATION_DISCLOSURE",
    DENIAL_OF_SERVICE = "DENIAL_OF_SERVICE",
    ELEVATION_OF_PRIVILEGE = "ELEVATION_OF_PRIVILEGE"
}
/**
 * @enum DREADFactor
 * @description DREAD risk factors
 */
export declare enum DREADFactor {
    DAMAGE = "DAMAGE",
    REPRODUCIBILITY = "REPRODUCIBILITY",
    EXPLOITABILITY = "EXPLOITABILITY",
    AFFECTED_USERS = "AFFECTED_USERS",
    DISCOVERABILITY = "DISCOVERABILITY"
}
/**
 * @enum PASTAStage
 * @description PASTA methodology stages
 */
export declare enum PASTAStage {
    DEFINE_OBJECTIVES = "DEFINE_OBJECTIVES",
    DEFINE_TECHNICAL_SCOPE = "DEFINE_TECHNICAL_SCOPE",
    APPLICATION_DECOMPOSITION = "APPLICATION_DECOMPOSITION",
    THREAT_ANALYSIS = "THREAT_ANALYSIS",
    VULNERABILITY_DETECTION = "VULNERABILITY_DETECTION",
    ATTACK_MODELING = "ATTACK_MODELING",
    RISK_IMPACT_ANALYSIS = "RISK_IMPACT_ANALYSIS"
}
/**
 * @enum ThreatModelStatus
 * @description Threat model lifecycle status
 */
export declare enum ThreatModelStatus {
    DRAFT = "DRAFT",
    IN_REVIEW = "IN_REVIEW",
    APPROVED = "APPROVED",
    PUBLISHED = "PUBLISHED",
    DEPRECATED = "DEPRECATED",
    ARCHIVED = "ARCHIVED"
}
/**
 * @enum TrustBoundaryType
 * @description Types of trust boundaries
 */
export declare enum TrustBoundaryType {
    NETWORK = "NETWORK",
    PROCESS = "PROCESS",
    PHYSICAL = "PHYSICAL",
    DATA_STORE = "DATA_STORE",
    AUTHENTICATION = "AUTHENTICATION",
    AUTHORIZATION = "AUTHORIZATION"
}
/**
 * @enum ComponentType
 * @description DFD component types
 */
export declare enum ComponentType {
    EXTERNAL_ENTITY = "EXTERNAL_ENTITY",
    PROCESS = "PROCESS",
    DATA_STORE = "DATA_STORE",
    DATA_FLOW = "DATA_FLOW",
    TRUST_BOUNDARY = "TRUST_BOUNDARY"
}
/**
 * @enum ThreatSeverity
 * @description Threat severity levels
 */
export declare enum ThreatSeverity {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    INFORMATIONAL = "INFORMATIONAL"
}
/**
 * @interface ThreatModel
 * @description Core threat model data structure
 */
export interface ThreatModel {
    id: string;
    applicationId: string;
    applicationName: string;
    framework: ThreatModelFramework;
    version: string;
    scope: string;
    assets: string[];
    stakeholders: string[];
    status: ThreatModelStatus;
    createdBy: string;
    reviewedBy?: string[];
    metadata?: Record<string, any>;
}
/**
 * @interface STRIDEThreat
 * @description STRIDE threat entry
 */
export interface STRIDEThreat {
    category: STRIDECategory;
    threatId: string;
    description: string;
    affectedAsset: string;
    attackVector: string;
    impact: string;
    likelihood: number;
    severity: ThreatSeverity;
    mitigations: string[];
    status: 'IDENTIFIED' | 'MITIGATED' | 'ACCEPTED' | 'TRANSFERRED';
}
/**
 * @interface DREADScore
 * @description DREAD risk scoring
 */
export interface DREADScore {
    damage: number;
    reproducibility: number;
    exploitability: number;
    affectedUsers: number;
    discoverability: number;
    totalScore: number;
    riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}
/**
 * @interface DataFlowDiagram
 * @description Data flow diagram structure
 */
export interface DataFlowDiagram {
    id: string;
    applicationId: string;
    components: Array<{
        id: string;
        type: ComponentType;
        name: string;
        trustLevel: number;
        metadata?: Record<string, any>;
    }>;
    dataFlows: Array<{
        id: string;
        from: string;
        to: string;
        dataClassification: string;
        protocol?: string;
        encrypted: boolean;
    }>;
    trustBoundaries: Array<{
        id: string;
        type: TrustBoundaryType;
        components: string[];
    }>;
}
/**
 * @interface AttackTree
 * @description Attack tree structure
 */
export interface AttackTree {
    id: string;
    threatId: string;
    rootGoal: string;
    nodes: Array<{
        id: string;
        parentId?: string;
        goal: string;
        type: 'AND' | 'OR';
        attackVector: string;
        probability: number;
        cost: number;
        skill: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXPERT';
        mitigations: string[];
    }>;
    criticalPaths: string[][];
}
/**
 * @interface ThreatScenario
 * @description Threat scenario modeling
 */
export interface ThreatScenario {
    id: string;
    scenarioName: string;
    threatActorProfile: string;
    attackNarrative: string;
    preconditions: string[];
    attackSteps: Array<{
        step: number;
        action: string;
        technique: string;
        detection: string[];
    }>;
    impact: {
        confidentiality: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
        integrity: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
        availability: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
    };
    businessImpact: string;
    likelihood: number;
}
/**
 * @interface MITREMapping
 * @description MITRE ATT&CK framework mapping
 */
export interface MITREMapping {
    threatId: string;
    tactics: string[];
    techniques: Array<{
        techniqueId: string;
        techniqueName: string;
        subTechniques?: string[];
    }>;
    mitigations: Array<{
        mitigationId: string;
        mitigationName: string;
    }>;
    detections: string[];
}
/**
 * @class ThreatModelDto
 * @description DTO for threat model
 */
export declare class ThreatModelDto {
    id: string;
    applicationId: string;
    applicationName: string;
    framework: ThreatModelFramework;
    version: string;
    scope: string;
    assets: string[];
    stakeholders: string[];
    status: ThreatModelStatus;
    createdBy: string;
    reviewedBy?: string[];
    createdAt: Date;
    updatedAt: Date;
}
/**
 * @class STRIDEThreatDto
 * @description DTO for STRIDE threat
 */
export declare class STRIDEThreatDto {
    category: STRIDECategory;
    threatId: string;
    description: string;
    affectedAsset: string;
    attackVector: string;
    impact: string;
    likelihood: number;
    severity: ThreatSeverity;
    mitigations: string[];
    status: string;
}
/**
 * @class DREADScoreDto
 * @description DTO for DREAD score
 */
export declare class DREADScoreDto {
    damage: number;
    reproducibility: number;
    exploitability: number;
    affectedUsers: number;
    discoverability: number;
    totalScore: number;
    riskLevel: string;
}
/**
 * @class DataFlowDiagramDto
 * @description DTO for data flow diagram
 */
export declare class DataFlowDiagramDto {
    id: string;
    applicationId: string;
    components: Array<{
        id: string;
        type: ComponentType;
        name: string;
        trustLevel: number;
    }>;
    dataFlows: Array<{
        id: string;
        from: string;
        to: string;
        dataClassification: string;
        protocol?: string;
        encrypted: boolean;
    }>;
    trustBoundaries: Array<{
        id: string;
        type: TrustBoundaryType;
        components: string[];
    }>;
}
/**
 * @class AttackTreeDto
 * @description DTO for attack tree
 */
export declare class AttackTreeDto {
    id: string;
    threatId: string;
    rootGoal: string;
    nodes: Array<{
        id: string;
        parentId?: string;
        goal: string;
        type: 'AND' | 'OR';
        probability: number;
        cost: number;
    }>;
    criticalPaths: string[][];
}
/**
 * @class MITREMappingDto
 * @description DTO for MITRE ATT&CK mapping
 */
export declare class MITREMappingDto {
    threatId: string;
    tactics: string[];
    techniques: Array<{
        techniqueId: string;
        techniqueName: string;
    }>;
    mitigations: Array<{
        mitigationId: string;
        mitigationName: string;
    }>;
    detections: string[];
}
/**
 * Creates a STRIDE-based threat model
 *
 * @param {Object} modelData - Threat model data
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created threat model
 *
 * @example
 * ```typescript
 * const model = await createSTRIDEThreatModel({
 *   applicationId: 'app-123',
 *   applicationName: 'E-commerce Platform',
 *   scope: 'CHECKOUT_PROCESS',
 *   assets: ['payment-data', 'user-credentials'],
 *   createdBy: 'architect-456',
 * }, sequelize);
 * ```
 */
export declare const createSTRIDEThreatModel: (modelData: {
    applicationId: string;
    applicationName: string;
    scope: string;
    assets: string[];
    stakeholders?: string[];
    createdBy: string;
}, sequelize: Sequelize, transaction?: Transaction) => Promise<Model>;
/**
 * Analyzes STRIDE threats for a threat model
 *
 * @param {string} modelId - Threat model ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<STRIDEThreat[]>} Identified STRIDE threats
 *
 * @example
 * ```typescript
 * const threats = await analyzeSTRIDEThreats('tm-stride-123', sequelize);
 * console.log(`Found ${threats.length} STRIDE threats`);
 * ```
 */
export declare const analyzeSTRIDEThreats: (modelId: string, sequelize: Sequelize) => Promise<STRIDEThreat[]>;
/**
 * Creates a DREAD-based risk scoring model
 *
 * @param {Object} modelData - DREAD model data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model>} Created DREAD model
 *
 * @example
 * ```typescript
 * const model = await createDREADModel({
 *   applicationId: 'app-123',
 *   applicationName: 'Customer Portal',
 *   createdBy: 'security-456',
 * }, sequelize);
 * ```
 */
export declare const createDREADModel: (modelData: {
    applicationId: string;
    applicationName: string;
    scope: string;
    createdBy: string;
}, sequelize: Sequelize) => Promise<Model>;
/**
 * Calculates DREAD score for a threat
 *
 * @param {string} threatId - Threat identifier
 * @param {Object} scores - DREAD factor scores
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<DREADScore>} Calculated DREAD score
 *
 * @example
 * ```typescript
 * const score = await calculateDREADScore('threat-123', {
 *   damage: 8,
 *   reproducibility: 9,
 *   exploitability: 6,
 *   affectedUsers: 10,
 *   discoverability: 7,
 * }, sequelize);
 * console.log(`DREAD Score: ${score.totalScore}, Risk: ${score.riskLevel}`);
 * ```
 */
export declare const calculateDREADScore: (threatId: string, scores: {
    damage: number;
    reproducibility: number;
    exploitability: number;
    affectedUsers: number;
    discoverability: number;
}, sequelize: Sequelize) => Promise<DREADScore>;
/**
 * Creates a PASTA (Process for Attack Simulation and Threat Analysis) model
 *
 * @param {Object} modelData - PASTA model data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model>} Created PASTA model
 *
 * @example
 * ```typescript
 * const model = await createPASTAModel({
 *   applicationId: 'app-123',
 *   applicationName: 'Healthcare API',
 *   businessObjectives: ['Protect patient data', 'Ensure HIPAA compliance'],
 *   createdBy: 'architect-789',
 * }, sequelize);
 * ```
 */
export declare const createPASTAModel: (modelData: {
    applicationId: string;
    applicationName: string;
    businessObjectives: string[];
    createdBy: string;
}, sequelize: Sequelize) => Promise<Model>;
/**
 * Executes PASTA stage analysis
 *
 * @param {string} modelId - PASTA model ID
 * @param {PASTAStage} stage - PASTA stage to execute
 * @param {Record<string, any>} stageData - Stage-specific data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Stage analysis results
 *
 * @example
 * ```typescript
 * const analysis = await executePASTAStage(
 *   'tm-pasta-123',
 *   PASTAStage.APPLICATION_DECOMPOSITION,
 *   {
 *     components: ['web-ui', 'api-gateway', 'database'],
 *     dependencies: ['oauth-provider', 'payment-processor'],
 *   },
 *   sequelize
 * );
 * ```
 */
export declare const executePASTAStage: (modelId: string, stage: PASTAStage, stageData: Record<string, any>, sequelize: Sequelize) => Promise<Record<string, any>>;
/**
 * Gets threat model by ID with full details
 *
 * @param {string} modelId - Threat model ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model>} Threat model details
 *
 * @example
 * ```typescript
 * const model = await getThreatModelById('tm-stride-123', sequelize);
 * console.log(model.framework, model.status);
 * ```
 */
export declare const getThreatModelById: (modelId: string, sequelize: Sequelize) => Promise<Model>;
/**
 * Updates threat model status
 *
 * @param {string} modelId - Threat model ID
 * @param {ThreatModelStatus} newStatus - New status
 * @param {string} updatedBy - User ID performing update
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model>} Updated threat model
 *
 * @example
 * ```typescript
 * const updated = await updateThreatModelStatus(
 *   'tm-stride-123',
 *   ThreatModelStatus.APPROVED,
 *   'reviewer-456',
 *   sequelize
 * );
 * ```
 */
export declare const updateThreatModelStatus: (modelId: string, newStatus: ThreatModelStatus, updatedBy: string, sequelize: Sequelize) => Promise<Model>;
/**
 * Generates data flow diagram for application
 *
 * @param {Object} dfdData - DFD generation data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<DataFlowDiagram>} Generated DFD
 *
 * @example
 * ```typescript
 * const dfd = await generateDataFlowDiagram({
 *   applicationId: 'app-123',
 *   components: [
 *     { id: 'web-ui', type: ComponentType.EXTERNAL_ENTITY, name: 'Web Browser', trustLevel: 1 },
 *     { id: 'api', type: ComponentType.PROCESS, name: 'API Server', trustLevel: 5 },
 *     { id: 'db', type: ComponentType.DATA_STORE, name: 'Database', trustLevel: 8 },
 *   ],
 *   dataFlows: [
 *     { from: 'web-ui', to: 'api', dataClassification: 'CONFIDENTIAL', encrypted: true },
 *   ],
 * }, sequelize);
 * ```
 */
export declare const generateDataFlowDiagram: (dfdData: {
    applicationId: string;
    components: Array<{
        id: string;
        type: ComponentType;
        name: string;
        trustLevel: number;
        metadata?: Record<string, any>;
    }>;
    dataFlows: Array<{
        from: string;
        to: string;
        dataClassification: string;
        protocol?: string;
        encrypted: boolean;
    }>;
}, sequelize: Sequelize) => Promise<DataFlowDiagram>;
/**
 * Analyzes data flows for security risks
 *
 * @param {string} dfdId - DFD identifier
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<Record<string, any>>>} Identified risks
 *
 * @example
 * ```typescript
 * const risks = await analyzeDataFlowRisks('dfd-123', sequelize);
 * console.log(`Found ${risks.length} data flow risks`);
 * ```
 */
export declare const analyzeDataFlowRisks: (dfdId: string, sequelize: Sequelize) => Promise<Array<Record<string, any>>>;
/**
 * Identifies trust boundaries in DFD
 *
 * @param {string} dfdId - DFD identifier
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<Record<string, any>>>} Trust boundaries
 *
 * @example
 * ```typescript
 * const boundaries = await analyzeTrustBoundaries('dfd-123', sequelize);
 * ```
 */
export declare const analyzeTrustBoundaries: (dfdId: string, sequelize: Sequelize) => Promise<Array<Record<string, any>>>;
/**
 * Validates data flow diagram completeness
 *
 * @param {string} dfdId - DFD identifier
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{valid: boolean, issues: string[]}>} Validation results
 *
 * @example
 * ```typescript
 * const validation = await validateDataFlowDiagram('dfd-123', sequelize);
 * if (!validation.valid) {
 *   console.log('DFD issues:', validation.issues);
 * }
 * ```
 */
export declare const validateDataFlowDiagram: (dfdId: string, sequelize: Sequelize) => Promise<{
    valid: boolean;
    issues: string[];
}>;
/**
 * Exports DFD to standard format (JSON, GraphML)
 *
 * @param {string} dfdId - DFD identifier
 * @param {string} format - Export format ('JSON' | 'GRAPHML')
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{exportId: string, exportPath: string}>} Export details
 *
 * @example
 * ```typescript
 * const exportResult = await exportDataFlowDiagram('dfd-123', 'JSON', sequelize);
 * console.log('Exported to:', exportResult.exportPath);
 * ```
 */
export declare const exportDataFlowDiagram: (dfdId: string, format: "JSON" | "GRAPHML", sequelize: Sequelize) => Promise<{
    exportId: string;
    exportPath: string;
}>;
/**
 * Updates data flow diagram components
 *
 * @param {string} dfdId - DFD identifier
 * @param {Object} updates - Component updates
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model>} Updated DFD
 *
 * @example
 * ```typescript
 * const updated = await updateDataFlowDiagram('dfd-123', {
 *   components: [...updatedComponents],
 *   dataFlows: [...updatedFlows],
 * }, sequelize);
 * ```
 */
export declare const updateDataFlowDiagram: (dfdId: string, updates: {
    components?: Array<any>;
    dataFlows?: Array<any>;
    trustBoundaries?: Array<any>;
}, sequelize: Sequelize) => Promise<Model>;
/**
 * Identifies trust boundaries based on component analysis
 *
 * @param {string} applicationId - Application identifier
 * @param {Array<any>} components - Application components
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<Record<string, any>>>} Identified trust boundaries
 *
 * @example
 * ```typescript
 * const boundaries = await identifyTrustBoundaries('app-123', [
 *   { id: 'web', trustLevel: 1 },
 *   { id: 'api', trustLevel: 5 },
 *   { id: 'db', trustLevel: 9 },
 * ], sequelize);
 * ```
 */
export declare const identifyTrustBoundaries: (applicationId: string, components: Array<any>, sequelize: Sequelize) => Promise<Array<Record<string, any>>>;
/**
 * Classifies trust boundary type based on characteristics
 *
 * @param {Object} boundaryData - Boundary characteristics
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<TrustBoundaryType>} Classified boundary type
 *
 * @example
 * ```typescript
 * const type = await classifyTrustBoundaryType({
 *   separates: ['internal-network', 'external-network'],
 *   protocol: 'HTTPS',
 *   authentication: true,
 * }, sequelize);
 * ```
 */
export declare const classifyTrustBoundaryType: (boundaryData: {
    separates: string[];
    protocol?: string;
    authentication?: boolean;
    dataStore?: boolean;
}, sequelize: Sequelize) => Promise<TrustBoundaryType>;
/**
 * Analyzes data crossing trust boundaries
 *
 * @param {string} boundaryId - Trust boundary ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<Record<string, any>>>} Cross-boundary data flows
 *
 * @example
 * ```typescript
 * const crossings = await analyzeBoundaryCrossings('boundary-123', sequelize);
 * console.log(`Found ${crossings.length} cross-boundary flows`);
 * ```
 */
export declare const analyzeBoundaryCrossings: (boundaryId: string, sequelize: Sequelize) => Promise<Array<Record<string, any>>>;
/**
 * Validates trust boundary security controls
 *
 * @param {string} boundaryId - Trust boundary ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{valid: boolean, issues: string[]}>} Validation results
 *
 * @example
 * ```typescript
 * const validation = await validateTrustBoundaryControls('boundary-123', sequelize);
 * ```
 */
export declare const validateTrustBoundaryControls: (boundaryId: string, sequelize: Sequelize) => Promise<{
    valid: boolean;
    issues: string[];
}>;
/**
 * Generates trust boundary threat report
 *
 * @param {string} boundaryId - Trust boundary ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Boundary threat report
 *
 * @example
 * ```typescript
 * const report = await generateBoundaryThreatReport('boundary-123', sequelize);
 * ```
 */
export declare const generateBoundaryThreatReport: (boundaryId: string, sequelize: Sequelize) => Promise<Record<string, any>>;
/**
 * Generates attack tree for a threat
 *
 * @param {string} threatId - Threat identifier
 * @param {string} rootGoal - Root attack goal
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<AttackTree>} Generated attack tree
 *
 * @example
 * ```typescript
 * const attackTree = await generateAttackTree(
 *   'threat-123',
 *   'Compromise customer database',
 *   sequelize
 * );
 * ```
 */
export declare const generateAttackTree: (threatId: string, rootGoal: string, sequelize: Sequelize) => Promise<AttackTree>;
/**
 * Calculates attack tree probabilities
 *
 * @param {string} attackTreeId - Attack tree ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{totalProbability: number, criticalPathProbabilities: number[]}>} Probability calculations
 *
 * @example
 * ```typescript
 * const probabilities = await calculateAttackTreeProbabilities('atree-123', sequelize);
 * console.log('Total attack probability:', probabilities.totalProbability);
 * ```
 */
export declare const calculateAttackTreeProbabilities: (attackTreeId: string, sequelize: Sequelize) => Promise<{
    totalProbability: number;
    criticalPathProbabilities: number[];
}>;
/**
 * Identifies most likely attack path
 *
 * @param {string} attackTreeId - Attack tree ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{path: string[], probability: number, cost: number}>} Most likely attack path
 *
 * @example
 * ```typescript
 * const path = await identifyMostLikelyAttackPath('atree-123', sequelize);
 * console.log('Most likely path:', path.path, 'Probability:', path.probability);
 * ```
 */
export declare const identifyMostLikelyAttackPath: (attackTreeId: string, sequelize: Sequelize) => Promise<{
    path: string[];
    probability: number;
    cost: number;
}>;
/**
 * Analyzes attack tree node mitigations
 *
 * @param {string} attackTreeId - Attack tree ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, string[]>>} Node mitigations map
 *
 * @example
 * ```typescript
 * const mitigations = await analyzeAttackTreeMitigations('atree-123', sequelize);
 * ```
 */
export declare const analyzeAttackTreeMitigations: (attackTreeId: string, sequelize: Sequelize) => Promise<Record<string, string[]>>;
/**
 * Exports attack tree visualization data
 *
 * @param {string} attackTreeId - Attack tree ID
 * @param {string} format - Export format ('JSON' | 'DOT')
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{exportId: string, exportPath: string}>} Export details
 *
 * @example
 * ```typescript
 * const exportResult = await exportAttackTree('atree-123', 'DOT', sequelize);
 * ```
 */
export declare const exportAttackTree: (attackTreeId: string, format: "JSON" | "DOT", sequelize: Sequelize) => Promise<{
    exportId: string;
    exportPath: string;
}>;
/**
 * Creates threat scenario with attack narrative
 *
 * @param {Object} scenarioData - Threat scenario data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<ThreatScenario>} Created threat scenario
 *
 * @example
 * ```typescript
 * const scenario = await createThreatScenario({
 *   scenarioName: 'Ransomware Attack',
 *   threatActorProfile: 'Organized cybercrime group',
 *   attackNarrative: 'Attackers gain initial access via phishing...',
 *   preconditions: ['Unpatched systems', 'Weak email security'],
 *   attackSteps: [
 *     { step: 1, action: 'Phishing email', technique: 'T1566', detection: ['Email filtering'] },
 *   ],
 *   impact: { confidentiality: 'HIGH', integrity: 'HIGH', availability: 'HIGH' },
 *   businessImpact: '$2M estimated loss',
 *   likelihood: 0.65,
 * }, sequelize);
 * ```
 */
export declare const createThreatScenario: (scenarioData: {
    scenarioName: string;
    threatActorProfile: string;
    attackNarrative: string;
    preconditions: string[];
    attackSteps: Array<{
        step: number;
        action: string;
        technique: string;
        detection: string[];
    }>;
    impact: {
        confidentiality: "NONE" | "LOW" | "MEDIUM" | "HIGH";
        integrity: "NONE" | "LOW" | "MEDIUM" | "HIGH";
        availability: "NONE" | "LOW" | "MEDIUM" | "HIGH";
    };
    businessImpact: string;
    likelihood: number;
}, sequelize: Sequelize) => Promise<ThreatScenario>;
/**
 * Analyzes threat scenario impact
 *
 * @param {string} scenarioId - Threat scenario ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Impact analysis
 *
 * @example
 * ```typescript
 * const impact = await analyzeThreatScenarioImpact('scenario-123', sequelize);
 * console.log('Business impact:', impact.businessImpact);
 * ```
 */
export declare const analyzeThreatScenarioImpact: (scenarioId: string, sequelize: Sequelize) => Promise<Record<string, any>>;
/**
 * Simulates threat scenario execution
 *
 * @param {string} scenarioId - Threat scenario ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{success: boolean, detectedAt: number[], mitigatedBy: string[]}>} Simulation results
 *
 * @example
 * ```typescript
 * const simulation = await simulateThreatScenario('scenario-123', sequelize);
 * console.log('Attack detected at steps:', simulation.detectedAt);
 * ```
 */
export declare const simulateThreatScenario: (scenarioId: string, sequelize: Sequelize) => Promise<{
    success: boolean;
    detectedAt: number[];
    mitigatedBy: string[];
}>;
/**
 * Compares multiple threat scenarios
 *
 * @param {string[]} scenarioIds - Threat scenario IDs to compare
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<Record<string, any>>>} Comparison results
 *
 * @example
 * ```typescript
 * const comparison = await compareThreatScenarios(['scenario-1', 'scenario-2'], sequelize);
 * ```
 */
export declare const compareThreatScenarios: (scenarioIds: string[], sequelize: Sequelize) => Promise<Array<Record<string, any>>>;
/**
 * Generates threat scenario report
 *
 * @param {string} scenarioId - Threat scenario ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Scenario report
 *
 * @example
 * ```typescript
 * const report = await generateThreatScenarioReport('scenario-123', sequelize);
 * ```
 */
export declare const generateThreatScenarioReport: (scenarioId: string, sequelize: Sequelize) => Promise<Record<string, any>>;
/**
 * Performs security architecture review
 *
 * @param {string} applicationId - Application identifier
 * @param {Object} architectureData - Architecture components and design
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{reviewId: string, findings: string[], recommendations: string[]}>} Review results
 *
 * @example
 * ```typescript
 * const review = await performSecurityArchitectureReview('app-123', {
 *   layers: ['presentation', 'business', 'data'],
 *   components: [...],
 *   securityControls: [...],
 * }, sequelize);
 * ```
 */
export declare const performSecurityArchitectureReview: (applicationId: string, architectureData: {
    layers: string[];
    components: Array<any>;
    securityControls: string[];
}, sequelize: Sequelize) => Promise<{
    reviewId: string;
    findings: string[];
    recommendations: string[];
}>;
/**
 * Validates security design patterns
 *
 * @param {string} applicationId - Application identifier
 * @param {string[]} patterns - Security design patterns to validate
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, boolean>>} Pattern validation results
 *
 * @example
 * ```typescript
 * const validation = await validateSecurityDesignPatterns('app-123', [
 *   'Defense in Depth',
 *   'Least Privilege',
 *   'Zero Trust',
 * ], sequelize);
 * ```
 */
export declare const validateSecurityDesignPatterns: (applicationId: string, patterns: string[], sequelize: Sequelize) => Promise<Record<string, boolean>>;
/**
 * Analyzes security control coverage
 *
 * @param {string} applicationId - Application identifier
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{coverage: number, gaps: string[]}>} Coverage analysis
 *
 * @example
 * ```typescript
 * const coverage = await analyzeSecurityControlCoverage('app-123', sequelize);
 * console.log(`Security control coverage: ${coverage.coverage}%`);
 * ```
 */
export declare const analyzeSecurityControlCoverage: (applicationId: string, sequelize: Sequelize) => Promise<{
    coverage: number;
    gaps: string[];
}>;
/**
 * Generates architecture security scorecard
 *
 * @param {string} applicationId - Application identifier
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Security scorecard
 *
 * @example
 * ```typescript
 * const scorecard = await generateArchitectureSecurityScorecard('app-123', sequelize);
 * ```
 */
export declare const generateArchitectureSecurityScorecard: (applicationId: string, sequelize: Sequelize) => Promise<Record<string, any>>;
/**
 * Validates threat model completeness
 *
 * @param {string} modelId - Threat model ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{valid: boolean, issues: string[], completeness: number}>} Validation results
 *
 * @example
 * ```typescript
 * const validation = await validateThreatModelCompleteness('tm-stride-123', sequelize);
 * if (!validation.valid) {
 *   console.log('Issues:', validation.issues);
 * }
 * ```
 */
export declare const validateThreatModelCompleteness: (modelId: string, sequelize: Sequelize) => Promise<{
    valid: boolean;
    issues: string[];
    completeness: number;
}>;
/**
 * Checks threat model coverage against assets
 *
 * @param {string} modelId - Threat model ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{assetsCovered: number, totalAssets: number, uncoveredAssets: string[]}>} Coverage check
 *
 * @example
 * ```typescript
 * const coverage = await checkThreatModelCoverage('tm-stride-123', sequelize);
 * console.log(`Asset coverage: ${coverage.assetsCovered}/${coverage.totalAssets}`);
 * ```
 */
export declare const checkThreatModelCoverage: (modelId: string, sequelize: Sequelize) => Promise<{
    assetsCovered: number;
    totalAssets: number;
    uncoveredAssets: string[];
}>;
/**
 * Validates threat mitigations are defined
 *
 * @param {string} modelId - Threat model ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{threatsWithMitigations: number, threatsWithoutMitigations: number}>} Mitigation validation
 *
 * @example
 * ```typescript
 * const validation = await validateThreatMitigations('tm-stride-123', sequelize);
 * ```
 */
export declare const validateThreatMitigations: (modelId: string, sequelize: Sequelize) => Promise<{
    threatsWithMitigations: number;
    threatsWithoutMitigations: number;
}>;
/**
 * Generates threat model validation report
 *
 * @param {string} modelId - Threat model ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} Validation report
 *
 * @example
 * ```typescript
 * const report = await generateThreatModelValidationReport('tm-stride-123', sequelize);
 * ```
 */
export declare const generateThreatModelValidationReport: (modelId: string, sequelize: Sequelize) => Promise<Record<string, any>>;
/**
 * Prioritizes threats using risk-based scoring
 *
 * @param {string} modelId - Threat model ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array<Record<string, any>>>} Prioritized threats
 *
 * @example
 * ```typescript
 * const prioritized = await prioritizeThreatsbyRisk('tm-stride-123', sequelize);
 * console.log('Top threat:', prioritized[0]);
 * ```
 */
export declare const prioritizeThreatsByRisk: (modelId: string, sequelize: Sequelize) => Promise<Array<Record<string, any>>>;
/**
 * Generates risk matrix for threats
 *
 * @param {string} modelId - Threat model ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, Array<string>>>} Risk matrix
 *
 * @example
 * ```typescript
 * const matrix = await generateThreatRiskMatrix('tm-stride-123', sequelize);
 * console.log('Critical risks:', matrix.CRITICAL);
 * ```
 */
export declare const generateThreatRiskMatrix: (modelId: string, sequelize: Sequelize) => Promise<Record<string, Array<string>>>;
/**
 * Calculates residual risk after mitigations
 *
 * @param {string} threatId - Threat identifier
 * @param {number} mitigationEffectiveness - Effectiveness of mitigations (0-1)
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{originalRisk: number, residualRisk: number}>} Risk calculation
 *
 * @example
 * ```typescript
 * const risk = await calculateResidualRisk('threat-123', 0.8, sequelize);
 * console.log(`Residual risk: ${risk.residualRisk}`);
 * ```
 */
export declare const calculateResidualRisk: (threatId: string, mitigationEffectiveness: number, sequelize: Sequelize) => Promise<{
    originalRisk: number;
    residualRisk: number;
}>;
/**
 * Updates threat model with new version
 *
 * @param {string} modelId - Threat model ID
 * @param {Object} updates - Model updates
 * @param {string} updatedBy - User ID performing update
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model>} Updated threat model
 *
 * @example
 * ```typescript
 * const updated = await updateThreatModel('tm-stride-123', {
 *   assets: [...newAssets],
 *   scope: 'EXPANDED_SCOPE',
 * }, 'architect-456', sequelize);
 * ```
 */
export declare const updateThreatModel: (modelId: string, updates: {
    assets?: string[];
    scope?: string;
    stakeholders?: string[];
    metadata?: Record<string, any>;
}, updatedBy: string, sequelize: Sequelize) => Promise<Model>;
/**
 * Archives outdated threat model
 *
 * @param {string} modelId - Threat model ID
 * @param {string} archivedBy - User ID archiving the model
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Model>} Archived threat model
 *
 * @example
 * ```typescript
 * const archived = await archiveThreatModel('tm-stride-old-123', 'admin-456', sequelize);
 * ```
 */
export declare const archiveThreatModel: (modelId: string, archivedBy: string, sequelize: Sequelize) => Promise<Model>;
/**
 * Maps threat to MITRE ATT&CK framework
 *
 * @param {string} threatId - Threat identifier
 * @param {Object} mitreData - MITRE ATT&CK mapping data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<MITREMapping>} MITRE mapping
 *
 * @example
 * ```typescript
 * const mapping = await mapThreatToMITREATTACK('threat-123', {
 *   tactics: ['Initial Access', 'Execution'],
 *   techniques: [
 *     { techniqueId: 'T1566', techniqueName: 'Phishing' },
 *     { techniqueId: 'T1059', techniqueName: 'Command and Scripting Interpreter' },
 *   ],
 *   mitigations: [
 *     { mitigationId: 'M1049', mitigationName: 'Antivirus/Antimalware' },
 *   ],
 *   detections: ['Email filtering', 'Endpoint detection'],
 * }, sequelize);
 * ```
 */
export declare const mapThreatToMITREATTACK: (threatId: string, mitreData: {
    tactics: string[];
    techniques: Array<{
        techniqueId: string;
        techniqueName: string;
        subTechniques?: string[];
    }>;
    mitigations: Array<{
        mitigationId: string;
        mitigationName: string;
    }>;
    detections: string[];
}, sequelize: Sequelize) => Promise<MITREMapping>;
/**
 * Generates MITRE ATT&CK coverage report
 *
 * @param {string} modelId - Threat model ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Record<string, any>>} MITRE coverage report
 *
 * @example
 * ```typescript
 * const report = await generateMITRECoverageReport('tm-stride-123', sequelize);
 * console.log('Tactics covered:', report.tacticsCovered);
 * ```
 */
export declare const generateMITRECoverageReport: (modelId: string, sequelize: Sequelize) => Promise<Record<string, any>>;
declare const _default: {
    createSTRIDEThreatModel: (modelData: {
        applicationId: string;
        applicationName: string;
        scope: string;
        assets: string[];
        stakeholders?: string[];
        createdBy: string;
    }, sequelize: Sequelize, transaction?: Transaction) => Promise<Model>;
    analyzeSTRIDEThreats: (modelId: string, sequelize: Sequelize) => Promise<STRIDEThreat[]>;
    createDREADModel: (modelData: {
        applicationId: string;
        applicationName: string;
        scope: string;
        createdBy: string;
    }, sequelize: Sequelize) => Promise<Model>;
    calculateDREADScore: (threatId: string, scores: {
        damage: number;
        reproducibility: number;
        exploitability: number;
        affectedUsers: number;
        discoverability: number;
    }, sequelize: Sequelize) => Promise<DREADScore>;
    createPASTAModel: (modelData: {
        applicationId: string;
        applicationName: string;
        businessObjectives: string[];
        createdBy: string;
    }, sequelize: Sequelize) => Promise<Model>;
    executePASTAStage: (modelId: string, stage: PASTAStage, stageData: Record<string, any>, sequelize: Sequelize) => Promise<Record<string, any>>;
    getThreatModelById: (modelId: string, sequelize: Sequelize) => Promise<Model>;
    updateThreatModelStatus: (modelId: string, newStatus: ThreatModelStatus, updatedBy: string, sequelize: Sequelize) => Promise<Model>;
    generateDataFlowDiagram: (dfdData: {
        applicationId: string;
        components: Array<{
            id: string;
            type: ComponentType;
            name: string;
            trustLevel: number;
            metadata?: Record<string, any>;
        }>;
        dataFlows: Array<{
            from: string;
            to: string;
            dataClassification: string;
            protocol?: string;
            encrypted: boolean;
        }>;
    }, sequelize: Sequelize) => Promise<DataFlowDiagram>;
    analyzeDataFlowRisks: (dfdId: string, sequelize: Sequelize) => Promise<Array<Record<string, any>>>;
    analyzeTrustBoundaries: (dfdId: string, sequelize: Sequelize) => Promise<Array<Record<string, any>>>;
    validateDataFlowDiagram: (dfdId: string, sequelize: Sequelize) => Promise<{
        valid: boolean;
        issues: string[];
    }>;
    exportDataFlowDiagram: (dfdId: string, format: "JSON" | "GRAPHML", sequelize: Sequelize) => Promise<{
        exportId: string;
        exportPath: string;
    }>;
    updateDataFlowDiagram: (dfdId: string, updates: {
        components?: Array<any>;
        dataFlows?: Array<any>;
        trustBoundaries?: Array<any>;
    }, sequelize: Sequelize) => Promise<Model>;
    identifyTrustBoundaries: (applicationId: string, components: Array<any>, sequelize: Sequelize) => Promise<Array<Record<string, any>>>;
    classifyTrustBoundaryType: (boundaryData: {
        separates: string[];
        protocol?: string;
        authentication?: boolean;
        dataStore?: boolean;
    }, sequelize: Sequelize) => Promise<TrustBoundaryType>;
    analyzeBoundaryCrossings: (boundaryId: string, sequelize: Sequelize) => Promise<Array<Record<string, any>>>;
    validateTrustBoundaryControls: (boundaryId: string, sequelize: Sequelize) => Promise<{
        valid: boolean;
        issues: string[];
    }>;
    generateBoundaryThreatReport: (boundaryId: string, sequelize: Sequelize) => Promise<Record<string, any>>;
    generateAttackTree: (threatId: string, rootGoal: string, sequelize: Sequelize) => Promise<AttackTree>;
    calculateAttackTreeProbabilities: (attackTreeId: string, sequelize: Sequelize) => Promise<{
        totalProbability: number;
        criticalPathProbabilities: number[];
    }>;
    identifyMostLikelyAttackPath: (attackTreeId: string, sequelize: Sequelize) => Promise<{
        path: string[];
        probability: number;
        cost: number;
    }>;
    analyzeAttackTreeMitigations: (attackTreeId: string, sequelize: Sequelize) => Promise<Record<string, string[]>>;
    exportAttackTree: (attackTreeId: string, format: "JSON" | "DOT", sequelize: Sequelize) => Promise<{
        exportId: string;
        exportPath: string;
    }>;
    createThreatScenario: (scenarioData: {
        scenarioName: string;
        threatActorProfile: string;
        attackNarrative: string;
        preconditions: string[];
        attackSteps: Array<{
            step: number;
            action: string;
            technique: string;
            detection: string[];
        }>;
        impact: {
            confidentiality: "NONE" | "LOW" | "MEDIUM" | "HIGH";
            integrity: "NONE" | "LOW" | "MEDIUM" | "HIGH";
            availability: "NONE" | "LOW" | "MEDIUM" | "HIGH";
        };
        businessImpact: string;
        likelihood: number;
    }, sequelize: Sequelize) => Promise<ThreatScenario>;
    analyzeThreatScenarioImpact: (scenarioId: string, sequelize: Sequelize) => Promise<Record<string, any>>;
    simulateThreatScenario: (scenarioId: string, sequelize: Sequelize) => Promise<{
        success: boolean;
        detectedAt: number[];
        mitigatedBy: string[];
    }>;
    compareThreatScenarios: (scenarioIds: string[], sequelize: Sequelize) => Promise<Array<Record<string, any>>>;
    generateThreatScenarioReport: (scenarioId: string, sequelize: Sequelize) => Promise<Record<string, any>>;
    performSecurityArchitectureReview: (applicationId: string, architectureData: {
        layers: string[];
        components: Array<any>;
        securityControls: string[];
    }, sequelize: Sequelize) => Promise<{
        reviewId: string;
        findings: string[];
        recommendations: string[];
    }>;
    validateSecurityDesignPatterns: (applicationId: string, patterns: string[], sequelize: Sequelize) => Promise<Record<string, boolean>>;
    analyzeSecurityControlCoverage: (applicationId: string, sequelize: Sequelize) => Promise<{
        coverage: number;
        gaps: string[];
    }>;
    generateArchitectureSecurityScorecard: (applicationId: string, sequelize: Sequelize) => Promise<Record<string, any>>;
    validateThreatModelCompleteness: (modelId: string, sequelize: Sequelize) => Promise<{
        valid: boolean;
        issues: string[];
        completeness: number;
    }>;
    checkThreatModelCoverage: (modelId: string, sequelize: Sequelize) => Promise<{
        assetsCovered: number;
        totalAssets: number;
        uncoveredAssets: string[];
    }>;
    validateThreatMitigations: (modelId: string, sequelize: Sequelize) => Promise<{
        threatsWithMitigations: number;
        threatsWithoutMitigations: number;
    }>;
    generateThreatModelValidationReport: (modelId: string, sequelize: Sequelize) => Promise<Record<string, any>>;
    prioritizeThreatsByRisk: (modelId: string, sequelize: Sequelize) => Promise<Array<Record<string, any>>>;
    generateThreatRiskMatrix: (modelId: string, sequelize: Sequelize) => Promise<Record<string, Array<string>>>;
    calculateResidualRisk: (threatId: string, mitigationEffectiveness: number, sequelize: Sequelize) => Promise<{
        originalRisk: number;
        residualRisk: number;
    }>;
    updateThreatModel: (modelId: string, updates: {
        assets?: string[];
        scope?: string;
        stakeholders?: string[];
        metadata?: Record<string, any>;
    }, updatedBy: string, sequelize: Sequelize) => Promise<Model>;
    archiveThreatModel: (modelId: string, archivedBy: string, sequelize: Sequelize) => Promise<Model>;
    mapThreatToMITREATTACK: (threatId: string, mitreData: {
        tactics: string[];
        techniques: Array<{
            techniqueId: string;
            techniqueName: string;
            subTechniques?: string[];
        }>;
        mitigations: Array<{
            mitigationId: string;
            mitigationName: string;
        }>;
        detections: string[];
    }, sequelize: Sequelize) => Promise<MITREMapping>;
    generateMITRECoverageReport: (modelId: string, sequelize: Sequelize) => Promise<Record<string, any>>;
};
export default _default;
//# sourceMappingURL=threat-modeling-kit.d.ts.map