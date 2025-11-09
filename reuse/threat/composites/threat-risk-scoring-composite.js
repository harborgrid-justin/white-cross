"use strict";
/**
 * LOC: THREATRISK1234567
 * File: /reuse/threat/composites/threat-risk-scoring-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../threat-scoring-kit
 *   - ../threat-prioritization-kit
 *   - ../risk-analysis-kit
 *   - ../threat-assessment-kit
 *   - ../threat-prediction-forecasting-kit
 *   - sequelize
 *
 * DOWNSTREAM (imported by):
 *   - Risk management services
 *   - Threat prioritization modules
 *   - Security operations centers (SOC)
 *   - Executive dashboards
 *   - Compliance reporting systems
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyTriageRules = exports.evaluateTriageRule = exports.requiresSLAEscalation = exports.calculateSLADueDate = exports.determinePriorityLevel = exports.calculateSLAStatus = exports.calculateAgingDecay = exports.adjustPriorityForTimeWindow = exports.calculateTimeUrgency = exports.calculateAssetBasedPriority = exports.calculateDependencyImpact = exports.calculateAssetPriorityMultiplier = exports.isInCriticalBusinessPeriod = exports.calculateStakeholderPriority = exports.adjustPriorityForBusinessContext = exports.calculateQueueStatistics = exports.getNextThreat = exports.rebalancePriorityQueue = exports.dequeueThreat = exports.enqueueThreat = exports.createPriorityQueue = exports.applyZScoreNormalization = exports.applyMinMaxNormalization = exports.normalizeCVSSScore = exports.normalizeScore = exports.calculateWeightedAverage = exports.aggregateCompositeScore = exports.calculateAttackProbability = exports.calculateComprehensiveLikelihood = exports.estimateFinancialImpact = exports.calculateBusinessImpact = exports.assessThreatImpact = exports.calculateSeverityTrend = exports.determineSeverityLevel = exports.aggregateIndicatorConfidence = exports.calculateSourceReliability = exports.computeConfidenceMetrics = exports.calculateResidualRisk = exports.calculateContextualRisk = exports.calculateRiskScore = exports.calculateConfidenceScore = exports.calculateUrgencyScore = exports.calculateLikelihoodScore = exports.calculateImpactScore = exports.calculateSeverityScore = exports.calculateThreatScore = exports.getRiskRegisterModelAttributes = exports.getVulnerabilityAssessmentModelAttributes = exports.getThreatPriorityQueueModelAttributes = exports.getThreatRiskScoreModelAttributes = void 0;
exports.assessThirdPartyRisk = exports.generateExecutiveRiskReport = exports.createRiskAlert = exports.generateRiskDashboard = exports.monitorRiskIndicators = exports.approveTreatmentPlan = exports.optimizeTreatmentCosts = exports.calculateTreatmentEffectiveness = exports.trackTreatmentProgress = exports.developRiskTreatmentPlan = exports.archiveClosedRisks = exports.exportRiskRegister = exports.searchRiskRegister = exports.updateRiskRegisterEntry = exports.createRiskRegisterEntry = exports.notifyAcceptanceExpiry = exports.getAcceptedRisks = exports.revokeRiskAcceptance = exports.reviewRiskAcceptance = exports.createRiskAcceptance = exports.generateAppetiteComplianceReport = exports.updateRiskToleranceLevels = exports.getRiskAppetiteStatement = exports.validateRiskAgainstAppetite = exports.configureRiskAppetite = exports.generateBIASummary = exports.identifyCriticalProcesses = exports.evaluateFinancialImpactAdvanced = exports.calculateRecoveryObjectives = exports.conductBusinessImpactAnalysis = exports.exportHeatMap = exports.compareHeatMapsOverTime = exports.generateDepartmentRiskHeatMap = exports.visualizeRiskMatrix = exports.generateRiskHeatMap = exports.generateVulnerabilityRemediationPlan = exports.prioritizeVulnerabilities = exports.scanAssetsForVulnerabilities = exports.calculateCVSS = exports.assessVulnerability = exports.generateRiskScoringReport = exports.aggregateRiskScoresByCategory = exports.calculateRiskVelocity = exports.prioritizeRisks = exports.calculateRiskScoreAdvanced = exports.calculateComprehensivePriority = exports.executeEscalationPolicy = exports.calculateEscalationLevel = exports.shouldEscalateThreat = exports.createAutoAssignmentRule = void 0;
exports.calculateThreatVelocity = exports.generateComprehensiveRiskScore = exports.validateThreatData = exports.shareThreatIntelligence = exports.validateThreatIntelligence = exports.queryThreatIntelligenceFeeds = exports.manageIndicatorOfCompromise = exports.enrichThreatIntelligence = exports.generateThreatForecast = exports.compareThreatLandscapeByRegion = exports.generateThreatTrendAnalysis = exports.identifyEmergingThreats = exports.analyzeThreatLandscape = exports.generateThreatCorrelationGraph = exports.analyzeThreatClustering = exports.linkThreatsToCampaign = exports.detectThreatPatterns = exports.correlateThreats = exports.reevaluateThreatSeverity = exports.prioritizeThreats = exports.calculateExploitabilityScore = exports.evaluateThreatImpact = exports.calculateThreatSeverityScore = exports.generateAttackVectorHeatMap = exports.analyzeAttackTechniques = exports.identifyEntryPoints = exports.mapAttackPath = exports.analyzeAttackVector = exports.compareThreatActors = exports.getThreatActorCapabilities = exports.attributeThreatToActor = exports.analyzeThreatActorMotivation = exports.profileThreatActor = exports.getThreatClassificationHistory = exports.updateThreatClassification = exports.categorizeThreatByFramework = exports.classifyThreat = exports.identifyThreat = void 0;
/**
 * File: /reuse/threat/composites/threat-risk-scoring-composite.ts
 * Locator: WC-THREAT-RISK-SCORING-COMPOSITE-001
 * Purpose: Comprehensive Threat Risk Scoring Composite - Risk quantification, prioritization, and impact assessment
 *
 * Upstream: Composes functions from threat-scoring-kit, threat-prioritization-kit, risk-analysis-kit,
 *           threat-assessment-kit, threat-prediction-forecasting-kit
 * Downstream: ../backend/*, Risk management, SOC operations, Executive reporting, Compliance systems
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize 6.x
 * Exports: 45+ utility functions for risk scoring, prioritization, impact assessment, vulnerability analysis
 *
 * LLM Context: Enterprise-grade threat risk scoring composite for White Cross healthcare platform.
 * Provides comprehensive risk quantification, threat prioritization algorithms, impact assessment,
 * vulnerability scoring, business impact analysis, risk appetite management, treatment planning, and
 * HIPAA-compliant risk analytics for healthcare systems. Includes Sequelize models for risk scores,
 * priority queues, vulnerability assessments, and risk registers.
 */
// ============================================================================
// IMPORTS - Composed from existing threat intelligence kits
// ============================================================================
const threat_scoring_kit_1 = require("../threat-scoring-kit");
Object.defineProperty(exports, "calculateThreatScore", { enumerable: true, get: function () { return 
    // Scoring Functions
    threat_scoring_kit_1.calculateThreatScore; } });
Object.defineProperty(exports, "calculateSeverityScore", { enumerable: true, get: function () { return threat_scoring_kit_1.calculateSeverityScore; } });
Object.defineProperty(exports, "calculateImpactScore", { enumerable: true, get: function () { return threat_scoring_kit_1.calculateImpactScore; } });
Object.defineProperty(exports, "calculateLikelihoodScore", { enumerable: true, get: function () { return threat_scoring_kit_1.calculateLikelihoodScore; } });
Object.defineProperty(exports, "calculateUrgencyScore", { enumerable: true, get: function () { return threat_scoring_kit_1.calculateUrgencyScore; } });
Object.defineProperty(exports, "calculateConfidenceScore", { enumerable: true, get: function () { return threat_scoring_kit_1.calculateConfidenceScore; } });
Object.defineProperty(exports, "calculateRiskScore", { enumerable: true, get: function () { return threat_scoring_kit_1.calculateRiskScore; } });
Object.defineProperty(exports, "calculateContextualRisk", { enumerable: true, get: function () { return threat_scoring_kit_1.calculateContextualRisk; } });
Object.defineProperty(exports, "calculateResidualRisk", { enumerable: true, get: function () { return threat_scoring_kit_1.calculateResidualRisk; } });
Object.defineProperty(exports, "computeConfidenceMetrics", { enumerable: true, get: function () { return 
    // Confidence & Reliability
    threat_scoring_kit_1.computeConfidenceMetrics; } });
Object.defineProperty(exports, "calculateSourceReliability", { enumerable: true, get: function () { return threat_scoring_kit_1.calculateSourceReliability; } });
Object.defineProperty(exports, "aggregateIndicatorConfidence", { enumerable: true, get: function () { return threat_scoring_kit_1.aggregateIndicatorConfidence; } });
Object.defineProperty(exports, "determineSeverityLevel", { enumerable: true, get: function () { return 
    // Severity & Impact Assessment
    threat_scoring_kit_1.determineSeverityLevel; } });
Object.defineProperty(exports, "calculateSeverityTrend", { enumerable: true, get: function () { return threat_scoring_kit_1.calculateSeverityTrend; } });
Object.defineProperty(exports, "assessThreatImpact", { enumerable: true, get: function () { return threat_scoring_kit_1.assessThreatImpact; } });
Object.defineProperty(exports, "calculateBusinessImpact", { enumerable: true, get: function () { return threat_scoring_kit_1.calculateBusinessImpact; } });
Object.defineProperty(exports, "estimateFinancialImpact", { enumerable: true, get: function () { return threat_scoring_kit_1.estimateFinancialImpact; } });
Object.defineProperty(exports, "calculateComprehensiveLikelihood", { enumerable: true, get: function () { return 
    // Likelihood Calculation
    threat_scoring_kit_1.calculateComprehensiveLikelihood; } });
Object.defineProperty(exports, "calculateAttackProbability", { enumerable: true, get: function () { return threat_scoring_kit_1.calculateAttackProbability; } });
Object.defineProperty(exports, "aggregateCompositeScore", { enumerable: true, get: function () { return 
    // Aggregation & Normalization
    threat_scoring_kit_1.aggregateCompositeScore; } });
Object.defineProperty(exports, "calculateWeightedAverage", { enumerable: true, get: function () { return threat_scoring_kit_1.calculateWeightedAverage; } });
Object.defineProperty(exports, "normalizeScore", { enumerable: true, get: function () { return threat_scoring_kit_1.normalizeScore; } });
Object.defineProperty(exports, "normalizeCVSSScore", { enumerable: true, get: function () { return threat_scoring_kit_1.normalizeCVSSScore; } });
Object.defineProperty(exports, "applyMinMaxNormalization", { enumerable: true, get: function () { return threat_scoring_kit_1.applyMinMaxNormalization; } });
Object.defineProperty(exports, "applyZScoreNormalization", { enumerable: true, get: function () { return threat_scoring_kit_1.applyZScoreNormalization; } });
const threat_prioritization_kit_1 = require("../threat-prioritization-kit");
Object.defineProperty(exports, "createPriorityQueue", { enumerable: true, get: function () { return 
    // Priority Queue Management
    threat_prioritization_kit_1.createPriorityQueue; } });
Object.defineProperty(exports, "enqueueThreat", { enumerable: true, get: function () { return threat_prioritization_kit_1.enqueueThreat; } });
Object.defineProperty(exports, "dequeueThreat", { enumerable: true, get: function () { return threat_prioritization_kit_1.dequeueThreat; } });
Object.defineProperty(exports, "rebalancePriorityQueue", { enumerable: true, get: function () { return threat_prioritization_kit_1.rebalancePriorityQueue; } });
Object.defineProperty(exports, "getNextThreat", { enumerable: true, get: function () { return threat_prioritization_kit_1.getNextThreat; } });
Object.defineProperty(exports, "calculateQueueStatistics", { enumerable: true, get: function () { return threat_prioritization_kit_1.calculateQueueStatistics; } });
Object.defineProperty(exports, "adjustPriorityForBusinessContext", { enumerable: true, get: function () { return 
    // Business Context Prioritization
    threat_prioritization_kit_1.adjustPriorityForBusinessContext; } });
Object.defineProperty(exports, "calculateStakeholderPriority", { enumerable: true, get: function () { return threat_prioritization_kit_1.calculateStakeholderPriority; } });
Object.defineProperty(exports, "isInCriticalBusinessPeriod", { enumerable: true, get: function () { return threat_prioritization_kit_1.isInCriticalBusinessPeriod; } });
Object.defineProperty(exports, "calculateAssetPriorityMultiplier", { enumerable: true, get: function () { return 
    // Asset-Based Prioritization
    threat_prioritization_kit_1.calculateAssetPriorityMultiplier; } });
Object.defineProperty(exports, "calculateDependencyImpact", { enumerable: true, get: function () { return threat_prioritization_kit_1.calculateDependencyImpact; } });
Object.defineProperty(exports, "calculateAssetBasedPriority", { enumerable: true, get: function () { return threat_prioritization_kit_1.calculateAssetBasedPriority; } });
Object.defineProperty(exports, "calculateTimeUrgency", { enumerable: true, get: function () { return 
    // Time-Based Prioritization
    threat_prioritization_kit_1.calculateTimeUrgency; } });
Object.defineProperty(exports, "adjustPriorityForTimeWindow", { enumerable: true, get: function () { return threat_prioritization_kit_1.adjustPriorityForTimeWindow; } });
Object.defineProperty(exports, "calculateAgingDecay", { enumerable: true, get: function () { return threat_prioritization_kit_1.calculateAgingDecay; } });
Object.defineProperty(exports, "calculateSLAStatus", { enumerable: true, get: function () { return 
    // SLA Management
    threat_prioritization_kit_1.calculateSLAStatus; } });
Object.defineProperty(exports, "determinePriorityLevel", { enumerable: true, get: function () { return threat_prioritization_kit_1.determinePriorityLevel; } });
Object.defineProperty(exports, "calculateSLADueDate", { enumerable: true, get: function () { return threat_prioritization_kit_1.calculateSLADueDate; } });
Object.defineProperty(exports, "requiresSLAEscalation", { enumerable: true, get: function () { return threat_prioritization_kit_1.requiresSLAEscalation; } });
Object.defineProperty(exports, "evaluateTriageRule", { enumerable: true, get: function () { return 
    // Triage & Escalation
    threat_prioritization_kit_1.evaluateTriageRule; } });
Object.defineProperty(exports, "applyTriageRules", { enumerable: true, get: function () { return threat_prioritization_kit_1.applyTriageRules; } });
Object.defineProperty(exports, "createAutoAssignmentRule", { enumerable: true, get: function () { return threat_prioritization_kit_1.createAutoAssignmentRule; } });
Object.defineProperty(exports, "shouldEscalateThreat", { enumerable: true, get: function () { return threat_prioritization_kit_1.shouldEscalateThreat; } });
Object.defineProperty(exports, "calculateEscalationLevel", { enumerable: true, get: function () { return threat_prioritization_kit_1.calculateEscalationLevel; } });
Object.defineProperty(exports, "executeEscalationPolicy", { enumerable: true, get: function () { return threat_prioritization_kit_1.executeEscalationPolicy; } });
Object.defineProperty(exports, "calculateComprehensivePriority", { enumerable: true, get: function () { return 
    // Comprehensive Prioritization
    threat_prioritization_kit_1.calculateComprehensivePriority; } });
const risk_analysis_kit_1 = require("../risk-analysis-kit");
Object.defineProperty(exports, "calculateRiskScoreAdvanced", { enumerable: true, get: function () { return risk_analysis_kit_1.calculateRiskScore; } });
Object.defineProperty(exports, "prioritizeRisks", { enumerable: true, get: function () { return risk_analysis_kit_1.prioritizeRisks; } });
Object.defineProperty(exports, "calculateRiskVelocity", { enumerable: true, get: function () { return risk_analysis_kit_1.calculateRiskVelocity; } });
Object.defineProperty(exports, "aggregateRiskScoresByCategory", { enumerable: true, get: function () { return risk_analysis_kit_1.aggregateRiskScoresByCategory; } });
Object.defineProperty(exports, "generateRiskScoringReport", { enumerable: true, get: function () { return risk_analysis_kit_1.generateRiskScoringReport; } });
Object.defineProperty(exports, "assessVulnerability", { enumerable: true, get: function () { return 
    // Vulnerability Assessment
    risk_analysis_kit_1.assessVulnerability; } });
Object.defineProperty(exports, "calculateCVSS", { enumerable: true, get: function () { return risk_analysis_kit_1.calculateCVSS; } });
Object.defineProperty(exports, "scanAssetsForVulnerabilities", { enumerable: true, get: function () { return risk_analysis_kit_1.scanAssetsForVulnerabilities; } });
Object.defineProperty(exports, "prioritizeVulnerabilities", { enumerable: true, get: function () { return risk_analysis_kit_1.prioritizeVulnerabilities; } });
Object.defineProperty(exports, "generateVulnerabilityRemediationPlan", { enumerable: true, get: function () { return risk_analysis_kit_1.generateVulnerabilityRemediationPlan; } });
Object.defineProperty(exports, "generateRiskHeatMap", { enumerable: true, get: function () { return 
    // Risk Heat Maps
    risk_analysis_kit_1.generateRiskHeatMap; } });
Object.defineProperty(exports, "visualizeRiskMatrix", { enumerable: true, get: function () { return risk_analysis_kit_1.visualizeRiskMatrix; } });
Object.defineProperty(exports, "generateDepartmentRiskHeatMap", { enumerable: true, get: function () { return risk_analysis_kit_1.generateDepartmentRiskHeatMap; } });
Object.defineProperty(exports, "compareHeatMapsOverTime", { enumerable: true, get: function () { return risk_analysis_kit_1.compareHeatMapsOverTime; } });
Object.defineProperty(exports, "exportHeatMap", { enumerable: true, get: function () { return risk_analysis_kit_1.exportHeatMap; } });
Object.defineProperty(exports, "conductBusinessImpactAnalysis", { enumerable: true, get: function () { return 
    // Business Impact Analysis
    risk_analysis_kit_1.conductBusinessImpactAnalysis; } });
Object.defineProperty(exports, "calculateRecoveryObjectives", { enumerable: true, get: function () { return risk_analysis_kit_1.calculateRecoveryObjectives; } });
Object.defineProperty(exports, "evaluateFinancialImpactAdvanced", { enumerable: true, get: function () { return risk_analysis_kit_1.evaluateFinancialImpact; } });
Object.defineProperty(exports, "identifyCriticalProcesses", { enumerable: true, get: function () { return risk_analysis_kit_1.identifyCriticalProcesses; } });
Object.defineProperty(exports, "generateBIASummary", { enumerable: true, get: function () { return risk_analysis_kit_1.generateBIASummary; } });
Object.defineProperty(exports, "configureRiskAppetite", { enumerable: true, get: function () { return 
    // Risk Appetite Management
    risk_analysis_kit_1.configureRiskAppetite; } });
Object.defineProperty(exports, "validateRiskAgainstAppetite", { enumerable: true, get: function () { return risk_analysis_kit_1.validateRiskAgainstAppetite; } });
Object.defineProperty(exports, "getRiskAppetiteStatement", { enumerable: true, get: function () { return risk_analysis_kit_1.getRiskAppetiteStatement; } });
Object.defineProperty(exports, "updateRiskToleranceLevels", { enumerable: true, get: function () { return risk_analysis_kit_1.updateRiskToleranceLevels; } });
Object.defineProperty(exports, "generateAppetiteComplianceReport", { enumerable: true, get: function () { return risk_analysis_kit_1.generateAppetiteComplianceReport; } });
Object.defineProperty(exports, "createRiskAcceptance", { enumerable: true, get: function () { return 
    // Risk Acceptance
    risk_analysis_kit_1.createRiskAcceptance; } });
Object.defineProperty(exports, "reviewRiskAcceptance", { enumerable: true, get: function () { return risk_analysis_kit_1.reviewRiskAcceptance; } });
Object.defineProperty(exports, "revokeRiskAcceptance", { enumerable: true, get: function () { return risk_analysis_kit_1.revokeRiskAcceptance; } });
Object.defineProperty(exports, "getAcceptedRisks", { enumerable: true, get: function () { return risk_analysis_kit_1.getAcceptedRisks; } });
Object.defineProperty(exports, "notifyAcceptanceExpiry", { enumerable: true, get: function () { return risk_analysis_kit_1.notifyAcceptanceExpiry; } });
Object.defineProperty(exports, "createRiskRegisterEntry", { enumerable: true, get: function () { return 
    // Risk Register Management
    risk_analysis_kit_1.createRiskRegisterEntry; } });
Object.defineProperty(exports, "updateRiskRegisterEntry", { enumerable: true, get: function () { return risk_analysis_kit_1.updateRiskRegisterEntry; } });
Object.defineProperty(exports, "searchRiskRegister", { enumerable: true, get: function () { return risk_analysis_kit_1.searchRiskRegister; } });
Object.defineProperty(exports, "exportRiskRegister", { enumerable: true, get: function () { return risk_analysis_kit_1.exportRiskRegister; } });
Object.defineProperty(exports, "archiveClosedRisks", { enumerable: true, get: function () { return risk_analysis_kit_1.archiveClosedRisks; } });
Object.defineProperty(exports, "developRiskTreatmentPlan", { enumerable: true, get: function () { return 
    // Risk Treatment Planning
    risk_analysis_kit_1.developRiskTreatmentPlan; } });
Object.defineProperty(exports, "trackTreatmentProgress", { enumerable: true, get: function () { return risk_analysis_kit_1.trackTreatmentProgress; } });
Object.defineProperty(exports, "calculateTreatmentEffectiveness", { enumerable: true, get: function () { return risk_analysis_kit_1.calculateTreatmentEffectiveness; } });
Object.defineProperty(exports, "optimizeTreatmentCosts", { enumerable: true, get: function () { return risk_analysis_kit_1.optimizeTreatmentCosts; } });
Object.defineProperty(exports, "approveTreatmentPlan", { enumerable: true, get: function () { return risk_analysis_kit_1.approveTreatmentPlan; } });
Object.defineProperty(exports, "monitorRiskIndicators", { enumerable: true, get: function () { return 
    // Risk Monitoring & Reporting
    risk_analysis_kit_1.monitorRiskIndicators; } });
Object.defineProperty(exports, "generateRiskDashboard", { enumerable: true, get: function () { return risk_analysis_kit_1.generateRiskDashboard; } });
Object.defineProperty(exports, "createRiskAlert", { enumerable: true, get: function () { return risk_analysis_kit_1.createRiskAlert; } });
Object.defineProperty(exports, "generateExecutiveRiskReport", { enumerable: true, get: function () { return risk_analysis_kit_1.generateExecutiveRiskReport; } });
Object.defineProperty(exports, "assessThirdPartyRisk", { enumerable: true, get: function () { return 
    // Third-Party Risk
    risk_analysis_kit_1.assessThirdPartyRisk; } });
const threat_assessment_kit_1 = require("../threat-assessment-kit");
Object.defineProperty(exports, "identifyThreat", { enumerable: true, get: function () { return 
    // Threat Identification & Classification
    threat_assessment_kit_1.identifyThreat; } });
Object.defineProperty(exports, "classifyThreat", { enumerable: true, get: function () { return threat_assessment_kit_1.classifyThreat; } });
Object.defineProperty(exports, "categorizeThreatByFramework", { enumerable: true, get: function () { return threat_assessment_kit_1.categorizeThreatByFramework; } });
Object.defineProperty(exports, "updateThreatClassification", { enumerable: true, get: function () { return threat_assessment_kit_1.updateThreatClassification; } });
Object.defineProperty(exports, "getThreatClassificationHistory", { enumerable: true, get: function () { return threat_assessment_kit_1.getThreatClassificationHistory; } });
Object.defineProperty(exports, "profileThreatActor", { enumerable: true, get: function () { return 
    // Threat Actor Profiling
    threat_assessment_kit_1.profileThreatActor; } });
Object.defineProperty(exports, "analyzeThreatActorMotivation", { enumerable: true, get: function () { return threat_assessment_kit_1.analyzeThreatActorMotivation; } });
Object.defineProperty(exports, "attributeThreatToActor", { enumerable: true, get: function () { return threat_assessment_kit_1.attributeThreatToActor; } });
Object.defineProperty(exports, "getThreatActorCapabilities", { enumerable: true, get: function () { return threat_assessment_kit_1.getThreatActorCapabilities; } });
Object.defineProperty(exports, "compareThreatActors", { enumerable: true, get: function () { return threat_assessment_kit_1.compareThreatActors; } });
Object.defineProperty(exports, "analyzeAttackVector", { enumerable: true, get: function () { return 
    // Attack Vector Analysis
    threat_assessment_kit_1.analyzeAttackVector; } });
Object.defineProperty(exports, "mapAttackPath", { enumerable: true, get: function () { return threat_assessment_kit_1.mapAttackPath; } });
Object.defineProperty(exports, "identifyEntryPoints", { enumerable: true, get: function () { return threat_assessment_kit_1.identifyEntryPoints; } });
Object.defineProperty(exports, "analyzeAttackTechniques", { enumerable: true, get: function () { return threat_assessment_kit_1.analyzeAttackTechniques; } });
Object.defineProperty(exports, "generateAttackVectorHeatMap", { enumerable: true, get: function () { return threat_assessment_kit_1.generateAttackVectorHeatMap; } });
Object.defineProperty(exports, "calculateThreatSeverityScore", { enumerable: true, get: function () { return 
    // Severity & Impact Scoring
    threat_assessment_kit_1.calculateThreatSeverityScore; } });
Object.defineProperty(exports, "evaluateThreatImpact", { enumerable: true, get: function () { return threat_assessment_kit_1.evaluateThreatImpact; } });
Object.defineProperty(exports, "calculateExploitabilityScore", { enumerable: true, get: function () { return threat_assessment_kit_1.calculateExploitabilityScore; } });
Object.defineProperty(exports, "prioritizeThreats", { enumerable: true, get: function () { return threat_assessment_kit_1.prioritizeThreats; } });
Object.defineProperty(exports, "reevaluateThreatSeverity", { enumerable: true, get: function () { return threat_assessment_kit_1.reevaluateThreatSeverity; } });
Object.defineProperty(exports, "correlateThreats", { enumerable: true, get: function () { return 
    // Threat Correlation & Patterns
    threat_assessment_kit_1.correlateThreats; } });
Object.defineProperty(exports, "detectThreatPatterns", { enumerable: true, get: function () { return threat_assessment_kit_1.detectThreatPatterns; } });
Object.defineProperty(exports, "linkThreatsToCampaign", { enumerable: true, get: function () { return threat_assessment_kit_1.linkThreatsToCampaign; } });
Object.defineProperty(exports, "analyzeThreatClustering", { enumerable: true, get: function () { return threat_assessment_kit_1.analyzeThreatClustering; } });
Object.defineProperty(exports, "generateThreatCorrelationGraph", { enumerable: true, get: function () { return threat_assessment_kit_1.generateThreatCorrelationGraph; } });
Object.defineProperty(exports, "analyzeThreatLandscape", { enumerable: true, get: function () { return 
    // Threat Landscape Analysis
    threat_assessment_kit_1.analyzeThreatLandscape; } });
Object.defineProperty(exports, "identifyEmergingThreats", { enumerable: true, get: function () { return threat_assessment_kit_1.identifyEmergingThreats; } });
Object.defineProperty(exports, "generateThreatTrendAnalysis", { enumerable: true, get: function () { return threat_assessment_kit_1.generateThreatTrendAnalysis; } });
Object.defineProperty(exports, "compareThreatLandscapeByRegion", { enumerable: true, get: function () { return threat_assessment_kit_1.compareThreatLandscapeByRegion; } });
Object.defineProperty(exports, "generateThreatForecast", { enumerable: true, get: function () { return threat_assessment_kit_1.generateThreatForecast; } });
Object.defineProperty(exports, "enrichThreatIntelligence", { enumerable: true, get: function () { return 
    // Threat Intelligence Management
    threat_assessment_kit_1.enrichThreatIntelligence; } });
Object.defineProperty(exports, "manageIndicatorOfCompromise", { enumerable: true, get: function () { return threat_assessment_kit_1.manageIndicatorOfCompromise; } });
Object.defineProperty(exports, "queryThreatIntelligenceFeeds", { enumerable: true, get: function () { return threat_assessment_kit_1.queryThreatIntelligenceFeeds; } });
Object.defineProperty(exports, "validateThreatIntelligence", { enumerable: true, get: function () { return threat_assessment_kit_1.validateThreatIntelligence; } });
Object.defineProperty(exports, "shareThreatIntelligence", { enumerable: true, get: function () { return threat_assessment_kit_1.shareThreatIntelligence; } });
Object.defineProperty(exports, "validateThreatData", { enumerable: true, get: function () { return threat_assessment_kit_1.validateThreatData; } });
const threat_prediction_forecasting_kit_1 = require("../threat-prediction-forecasting-kit");
Object.defineProperty(exports, "generateComprehensiveRiskScore", { enumerable: true, get: function () { return 
    // Additional Risk Scoring
    threat_prediction_forecasting_kit_1.generateComprehensiveRiskScore; } });
Object.defineProperty(exports, "calculateThreatVelocity", { enumerable: true, get: function () { return threat_prediction_forecasting_kit_1.calculateThreatVelocity; } });
// ============================================================================
// SEQUELIZE MODEL ATTRIBUTES - Risk Scoring Models
// ============================================================================
/**
 * Comprehensive risk score model for storing calculated risk assessments.
 * Tracks risk scores across multiple dimensions with full audit trail.
 *
 * @example
 * ```typescript
 * class ThreatRiskScore extends Model {}
 * ThreatRiskScore.init(getThreatRiskScoreModelAttributes(), {
 *   sequelize,
 *   tableName: 'threat_risk_scores',
 *   timestamps: true,
 *   paranoid: true,
 *   indexes: [
 *     { fields: ['threatId', 'calculatedAt'] },
 *     { fields: ['riskLevel', 'status'] },
 *     { fields: ['assetId', 'businessUnit'] },
 *     { fields: ['compositeScore', 'priorityScore'] }
 *   ]
 * });
 * ```
 */
const getThreatRiskScoreModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    scoreId: {
        type: 'STRING',
        allowNull: false,
        unique: true,
        comment: 'Unique risk score identifier',
    },
    threatId: {
        type: 'UUID',
        allowNull: false,
        comment: 'Reference to threat',
    },
    assetId: {
        type: 'UUID',
        allowNull: true,
        comment: 'Reference to affected asset',
    },
    businessUnit: {
        type: 'STRING',
        allowNull: true,
        comment: 'Business unit affected',
    },
    calculatedAt: {
        type: 'DATE',
        allowNull: false,
    },
    calculationMethod: {
        type: 'STRING',
        allowNull: false,
        comment: 'Method: QUANTITATIVE, QUALITATIVE, HYBRID, ML_BASED',
    },
    // Core Risk Components
    likelihood: {
        type: 'FLOAT',
        allowNull: false,
        validate: {
            min: 0.0,
            max: 1.0,
        },
        comment: 'Likelihood score (0.0-1.0)',
    },
    impact: {
        type: 'FLOAT',
        allowNull: false,
        validate: {
            min: 0.0,
            max: 10.0,
        },
        comment: 'Impact score (0-10)',
    },
    severity: {
        type: 'FLOAT',
        allowNull: false,
        validate: {
            min: 0.0,
            max: 10.0,
        },
        comment: 'Severity score (0-10)',
    },
    urgency: {
        type: 'FLOAT',
        allowNull: false,
        validate: {
            min: 0.0,
            max: 10.0,
        },
        comment: 'Urgency score (0-10)',
    },
    confidence: {
        type: 'FLOAT',
        allowNull: false,
        validate: {
            min: 0.0,
            max: 1.0,
        },
        comment: 'Confidence in assessment (0.0-1.0)',
    },
    // Composite Scores
    compositeScore: {
        type: 'FLOAT',
        allowNull: false,
        validate: {
            min: 0.0,
            max: 100.0,
        },
        comment: 'Overall composite risk score (0-100)',
    },
    priorityScore: {
        type: 'FLOAT',
        allowNull: false,
        validate: {
            min: 0.0,
            max: 100.0,
        },
        comment: 'Priority score for ordering (0-100)',
    },
    cvssScore: {
        type: 'FLOAT',
        allowNull: true,
        validate: {
            min: 0.0,
            max: 10.0,
        },
        comment: 'CVSS score if applicable',
    },
    cvssVector: {
        type: 'STRING',
        allowNull: true,
        comment: 'CVSS vector string',
    },
    // Risk Classification
    riskLevel: {
        type: 'STRING',
        allowNull: false,
        comment: 'Level: CRITICAL, HIGH, MEDIUM, LOW, MINIMAL',
    },
    riskCategory: {
        type: 'STRING',
        allowNull: false,
        comment: 'Category: OPERATIONAL, FINANCIAL, REPUTATIONAL, COMPLIANCE, STRATEGIC',
    },
    riskType: {
        type: 'STRING',
        allowNull: false,
        comment: 'Type: TECHNICAL, PROCESS, PEOPLE, EXTERNAL',
    },
    // Business Impact
    businessImpact: {
        type: 'JSONB',
        defaultValue: {},
        comment: 'Business impact assessment',
    },
    financialImpact: {
        type: 'JSONB',
        defaultValue: {},
        comment: 'Financial impact estimates',
    },
    operationalImpact: {
        type: 'JSONB',
        defaultValue: {},
        comment: 'Operational impact details',
    },
    complianceImpact: {
        type: 'JSONB',
        defaultValue: {},
        comment: 'Regulatory/compliance impact',
    },
    reputationalImpact: {
        type: 'JSONB',
        defaultValue: {},
        comment: 'Reputational damage estimates',
    },
    // Contextual Factors
    contextualFactors: {
        type: 'JSONB',
        defaultValue: {},
        comment: 'Environmental and situational factors',
    },
    assetCriticality: {
        type: 'FLOAT',
        allowNull: true,
        validate: {
            min: 0.0,
            max: 10.0,
        },
    },
    dataClassification: {
        type: 'STRING',
        allowNull: true,
        comment: 'Data sensitivity classification',
    },
    businessPeriodMultiplier: {
        type: 'FLOAT',
        defaultValue: 1.0,
        comment: 'Multiplier for critical business periods',
    },
    // Risk Treatment
    inherentRisk: {
        type: 'FLOAT',
        allowNull: false,
        comment: 'Risk before controls',
    },
    residualRisk: {
        type: 'FLOAT',
        allowNull: false,
        comment: 'Risk after controls',
    },
    controlEffectiveness: {
        type: 'FLOAT',
        allowNull: true,
        validate: {
            min: 0.0,
            max: 1.0,
        },
        comment: 'Effectiveness of controls (0.0-1.0)',
    },
    mitigationStatus: {
        type: 'STRING',
        allowNull: false,
        defaultValue: 'UNMITIGATED',
        comment: 'Status: UNMITIGATED, PARTIALLY_MITIGATED, MITIGATED, ACCEPTED',
    },
    // Risk Velocity & Trends
    riskVelocity: {
        type: 'FLOAT',
        allowNull: true,
        comment: 'Rate of risk change',
    },
    trendDirection: {
        type: 'STRING',
        allowNull: true,
        comment: 'Direction: INCREASING, DECREASING, STABLE',
    },
    historicalScores: {
        type: 'JSONB',
        defaultValue: [],
        comment: 'Historical score changes',
    },
    // Validation & Confidence
    validationStatus: {
        type: 'STRING',
        allowNull: false,
        defaultValue: 'PENDING',
        comment: 'Status: PENDING, VALIDATED, DISPUTED, OVERRIDDEN',
    },
    validatedBy: {
        type: 'UUID',
        allowNull: true,
    },
    validatedAt: {
        type: 'DATE',
        allowNull: true,
    },
    overrideReason: {
        type: 'TEXT',
        allowNull: true,
    },
    // Status & Lifecycle
    status: {
        type: 'STRING',
        allowNull: false,
        defaultValue: 'ACTIVE',
        comment: 'Status: ACTIVE, ARCHIVED, SUPERSEDED',
    },
    expiresAt: {
        type: 'DATE',
        allowNull: true,
        comment: 'When score becomes stale',
    },
    nextReviewDate: {
        type: 'DATE',
        allowNull: true,
    },
    metadata: {
        type: 'JSONB',
        defaultValue: {},
    },
    createdAt: {
        type: 'DATE',
        allowNull: false,
    },
    updatedAt: {
        type: 'DATE',
        allowNull: false,
    },
    deletedAt: {
        type: 'DATE',
        allowNull: true,
    },
});
exports.getThreatRiskScoreModelAttributes = getThreatRiskScoreModelAttributes;
/**
 * Threat priority queue model for managing prioritized threat response.
 * Implements dynamic priority queue with SLA tracking and auto-escalation.
 *
 * @example
 * ```typescript
 * class ThreatPriorityQueue extends Model {}
 * ThreatPriorityQueue.init(getThreatPriorityQueueModelAttributes(), {
 *   sequelize,
 *   tableName: 'threat_priority_queue',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['priorityScore', 'status'] },
 *     { fields: ['slaStatus', 'slaDueDate'] },
 *     { fields: ['assignedTo', 'status'] },
 *     { fields: ['queuePosition'] }
 *   ]
 * });
 * ```
 */
const getThreatPriorityQueueModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    queueId: {
        type: 'STRING',
        allowNull: false,
        unique: true,
    },
    threatId: {
        type: 'UUID',
        allowNull: false,
    },
    riskScoreId: {
        type: 'UUID',
        allowNull: true,
        comment: 'Reference to risk score',
    },
    enqueuedAt: {
        type: 'DATE',
        allowNull: false,
    },
    queuePosition: {
        type: 'INTEGER',
        allowNull: false,
        comment: 'Position in priority queue',
    },
    priorityScore: {
        type: 'FLOAT',
        allowNull: false,
        validate: {
            min: 0.0,
            max: 100.0,
        },
        comment: 'Overall priority score (0-100)',
    },
    priorityLevel: {
        type: 'STRING',
        allowNull: false,
        comment: 'Level: P0_CRITICAL, P1_HIGH, P2_MEDIUM, P3_LOW',
    },
    priorityFactors: {
        type: 'JSONB',
        defaultValue: {},
        comment: 'Factors contributing to priority',
    },
    // SLA Management
    slaStatus: {
        type: 'STRING',
        allowNull: false,
        defaultValue: 'ON_TRACK',
        comment: 'Status: ON_TRACK, AT_RISK, BREACHED',
    },
    slaTier: {
        type: 'STRING',
        allowNull: false,
        comment: 'SLA tier: CRITICAL, HIGH, MEDIUM, LOW',
    },
    slaStartDate: {
        type: 'DATE',
        allowNull: false,
    },
    slaDueDate: {
        type: 'DATE',
        allowNull: false,
    },
    slaResponseTime: {
        type: 'INTEGER',
        allowNull: false,
        comment: 'Required response time in minutes',
    },
    slaResolutionTime: {
        type: 'INTEGER',
        allowNull: false,
        comment: 'Required resolution time in minutes',
    },
    timeInQueue: {
        type: 'INTEGER',
        allowNull: false,
        defaultValue: 0,
        comment: 'Time in queue in minutes',
    },
    timeToSLABreach: {
        type: 'INTEGER',
        allowNull: true,
        comment: 'Minutes until SLA breach',
    },
    // Assignment & Routing
    assignedTo: {
        type: 'UUID',
        allowNull: true,
        comment: 'Assigned analyst/team',
    },
    assignedTeam: {
        type: 'STRING',
        allowNull: true,
    },
    assignmentMethod: {
        type: 'STRING',
        allowNull: true,
        comment: 'Method: MANUAL, AUTO_ROUND_ROBIN, AUTO_SKILL_BASED, AUTO_LOAD_BALANCED',
    },
    assignedAt: {
        type: 'DATE',
        allowNull: true,
    },
    // Escalation
    escalationLevel: {
        type: 'INTEGER',
        defaultValue: 0,
        comment: 'Current escalation level',
    },
    escalationHistory: {
        type: 'JSONB',
        defaultValue: [],
    },
    requiresEscalation: {
        type: 'BOOLEAN',
        defaultValue: false,
    },
    nextEscalationDate: {
        type: 'DATE',
        allowNull: true,
    },
    // Status & Lifecycle
    status: {
        type: 'STRING',
        allowNull: false,
        defaultValue: 'QUEUED',
        comment: 'Status: QUEUED, ASSIGNED, IN_PROGRESS, ON_HOLD, RESOLVED, CLOSED',
    },
    lastStatusChange: {
        type: 'DATE',
        allowNull: false,
    },
    resolution: {
        type: 'TEXT',
        allowNull: true,
    },
    resolvedAt: {
        type: 'DATE',
        allowNull: true,
    },
    resolvedBy: {
        type: 'UUID',
        allowNull: true,
    },
    resolutionTime: {
        type: 'INTEGER',
        allowNull: true,
        comment: 'Total resolution time in minutes',
    },
    // Business Context
    businessImpact: {
        type: 'STRING',
        allowNull: true,
        comment: 'Impact: CRITICAL, HIGH, MEDIUM, LOW',
    },
    affectedSystems: {
        type: 'JSONB',
        defaultValue: [],
    },
    stakeholders: {
        type: 'JSONB',
        defaultValue: [],
    },
    // Aging & Decay
    agingMultiplier: {
        type: 'FLOAT',
        defaultValue: 1.0,
        comment: 'Priority multiplier based on age',
    },
    lastRebalance: {
        type: 'DATE',
        allowNull: true,
    },
    rebalanceCount: {
        type: 'INTEGER',
        defaultValue: 0,
    },
    metadata: {
        type: 'JSONB',
        defaultValue: {},
    },
    createdAt: {
        type: 'DATE',
        allowNull: false,
    },
    updatedAt: {
        type: 'DATE',
        allowNull: false,
    },
});
exports.getThreatPriorityQueueModelAttributes = getThreatPriorityQueueModelAttributes;
/**
 * Vulnerability assessment model for tracking vulnerability risk scores.
 * Comprehensive vulnerability management with CVSS scoring and remediation tracking.
 *
 * @example
 * ```typescript
 * class VulnerabilityAssessment extends Model {}
 * VulnerabilityAssessment.init(getVulnerabilityAssessmentModelAttributes(), {
 *   sequelize,
 *   tableName: 'vulnerability_assessments',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['cvssScore', 'exploitability'] },
 *     { fields: ['vulnerabilityType', 'status'] },
 *     { fields: ['remediationStatus', 'priority'] }
 *   ]
 * });
 * ```
 */
const getVulnerabilityAssessmentModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    assessmentId: {
        type: 'STRING',
        allowNull: false,
        unique: true,
    },
    vulnerabilityId: {
        type: 'STRING',
        allowNull: false,
        comment: 'CVE ID or internal vulnerability ID',
    },
    assetId: {
        type: 'UUID',
        allowNull: false,
    },
    discoveredAt: {
        type: 'DATE',
        allowNull: false,
    },
    discoveryMethod: {
        type: 'STRING',
        allowNull: false,
        comment: 'Method: SCAN, MANUAL, INTELLIGENCE, DISCLOSURE',
    },
    vulnerabilityType: {
        type: 'STRING',
        allowNull: false,
        comment: 'Type: INJECTION, XSS, AUTHENTICATION, AUTHORIZATION, etc.',
    },
    description: {
        type: 'TEXT',
        allowNull: false,
    },
    // CVSS Scoring
    cvssScore: {
        type: 'FLOAT',
        allowNull: false,
        validate: {
            min: 0.0,
            max: 10.0,
        },
    },
    cvssVersion: {
        type: 'STRING',
        allowNull: false,
        comment: 'Version: 2.0, 3.0, 3.1',
    },
    cvssVector: {
        type: 'STRING',
        allowNull: false,
    },
    cvssBaseScore: {
        type: 'FLOAT',
        allowNull: false,
    },
    cvssTemporalScore: {
        type: 'FLOAT',
        allowNull: true,
    },
    cvssEnvironmentalScore: {
        type: 'FLOAT',
        allowNull: true,
    },
    // Exploitability
    exploitability: {
        type: 'FLOAT',
        allowNull: false,
        validate: {
            min: 0.0,
            max: 10.0,
        },
    },
    attackComplexity: {
        type: 'STRING',
        allowNull: false,
        comment: 'Complexity: LOW, MEDIUM, HIGH',
    },
    attackVector: {
        type: 'STRING',
        allowNull: false,
        comment: 'Vector: NETWORK, ADJACENT, LOCAL, PHYSICAL',
    },
    privilegesRequired: {
        type: 'STRING',
        allowNull: false,
        comment: 'Privileges: NONE, LOW, HIGH',
    },
    userInteraction: {
        type: 'STRING',
        allowNull: false,
        comment: 'Interaction: NONE, REQUIRED',
    },
    exploitAvailable: {
        type: 'BOOLEAN',
        defaultValue: false,
    },
    exploitMaturity: {
        type: 'STRING',
        allowNull: true,
        comment: 'Maturity: UNPROVEN, POC, FUNCTIONAL, HIGH',
    },
    // Impact
    confidentialityImpact: {
        type: 'STRING',
        allowNull: false,
        comment: 'Impact: NONE, LOW, HIGH',
    },
    integrityImpact: {
        type: 'STRING',
        allowNull: false,
        comment: 'Impact: NONE, LOW, HIGH',
    },
    availabilityImpact: {
        type: 'STRING',
        allowNull: false,
        comment: 'Impact: NONE, LOW, HIGH',
    },
    // Risk Assessment
    riskScore: {
        type: 'FLOAT',
        allowNull: false,
        validate: {
            min: 0.0,
            max: 100.0,
        },
    },
    riskLevel: {
        type: 'STRING',
        allowNull: false,
        comment: 'Level: CRITICAL, HIGH, MEDIUM, LOW',
    },
    priority: {
        type: 'INTEGER',
        allowNull: false,
        comment: 'Remediation priority (1=highest)',
    },
    // Remediation
    remediationStatus: {
        type: 'STRING',
        allowNull: false,
        defaultValue: 'OPEN',
        comment: 'Status: OPEN, IN_PROGRESS, MITIGATED, RESOLVED, ACCEPTED, FALSE_POSITIVE',
    },
    remediationPlan: {
        type: 'JSONB',
        allowNull: true,
    },
    remediationDueDate: {
        type: 'DATE',
        allowNull: true,
    },
    remediationEffort: {
        type: 'STRING',
        allowNull: true,
        comment: 'Effort: TRIVIAL, MODERATE, SIGNIFICANT, EXTENSIVE',
    },
    remediationCost: {
        type: 'FLOAT',
        allowNull: true,
    },
    patchAvailable: {
        type: 'BOOLEAN',
        defaultValue: false,
    },
    patchDetails: {
        type: 'JSONB',
        allowNull: true,
    },
    workaroundAvailable: {
        type: 'BOOLEAN',
        defaultValue: false,
    },
    workaroundDetails: {
        type: 'TEXT',
        allowNull: true,
    },
    resolvedAt: {
        type: 'DATE',
        allowNull: true,
    },
    verifiedAt: {
        type: 'DATE',
        allowNull: true,
    },
    // References & Intelligence
    cveReferences: {
        type: 'JSONB',
        defaultValue: [],
    },
    cweReferences: {
        type: 'JSONB',
        defaultValue: [],
    },
    advisories: {
        type: 'JSONB',
        defaultValue: [],
    },
    status: {
        type: 'STRING',
        allowNull: false,
        defaultValue: 'ACTIVE',
    },
    metadata: {
        type: 'JSONB',
        defaultValue: {},
    },
    createdAt: {
        type: 'DATE',
        allowNull: false,
    },
    updatedAt: {
        type: 'DATE',
        allowNull: false,
    },
});
exports.getVulnerabilityAssessmentModelAttributes = getVulnerabilityAssessmentModelAttributes;
/**
 * Risk register model for comprehensive risk tracking and management.
 * Enterprise risk register with treatment plans and continuous monitoring.
 *
 * @example
 * ```typescript
 * class RiskRegister extends Model {}
 * RiskRegister.init(getRiskRegisterModelAttributes(), {
 *   sequelize,
 *   tableName: 'risk_register',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['riskLevel', 'status'] },
 *     { fields: ['riskCategory', 'owner'] },
 *     { fields: ['reviewDate', 'status'] }
 *   ]
 * });
 * ```
 */
const getRiskRegisterModelAttributes = () => ({
    id: {
        type: 'UUID',
        defaultValue: 'UUIDV4',
        primaryKey: true,
    },
    registerId: {
        type: 'STRING',
        allowNull: false,
        unique: true,
    },
    riskId: {
        type: 'STRING',
        allowNull: false,
        unique: true,
        comment: 'Business risk identifier',
    },
    riskTitle: {
        type: 'STRING',
        allowNull: false,
    },
    riskDescription: {
        type: 'TEXT',
        allowNull: false,
    },
    riskCategory: {
        type: 'STRING',
        allowNull: false,
        comment: 'Category: OPERATIONAL, FINANCIAL, STRATEGIC, COMPLIANCE, REPUTATIONAL',
    },
    riskType: {
        type: 'STRING',
        allowNull: false,
    },
    identifiedAt: {
        type: 'DATE',
        allowNull: false,
    },
    identifiedBy: {
        type: 'UUID',
        allowNull: false,
    },
    owner: {
        type: 'UUID',
        allowNull: false,
        comment: 'Risk owner responsible for management',
    },
    // Risk Scores
    inherentLikelihood: {
        type: 'FLOAT',
        allowNull: false,
    },
    inherentImpact: {
        type: 'FLOAT',
        allowNull: false,
    },
    inherentRiskScore: {
        type: 'FLOAT',
        allowNull: false,
    },
    residualLikelihood: {
        type: 'FLOAT',
        allowNull: false,
    },
    residualImpact: {
        type: 'FLOAT',
        allowNull: false,
    },
    residualRiskScore: {
        type: 'FLOAT',
        allowNull: false,
    },
    riskLevel: {
        type: 'STRING',
        allowNull: false,
        comment: 'Level: CRITICAL, HIGH, MEDIUM, LOW',
    },
    // Risk Appetite
    riskAppetite: {
        type: 'STRING',
        allowNull: false,
        comment: 'Appetite: AVERSE, MINIMAL, CAUTIOUS, OPEN, SEEKING',
    },
    exceedsAppetite: {
        type: 'BOOLEAN',
        defaultValue: false,
    },
    // Treatment
    treatmentStrategy: {
        type: 'STRING',
        allowNull: false,
        comment: 'Strategy: AVOID, MITIGATE, TRANSFER, ACCEPT',
    },
    treatmentPlan: {
        type: 'JSONB',
        allowNull: true,
    },
    treatmentStatus: {
        type: 'STRING',
        allowNull: false,
        defaultValue: 'PLANNED',
        comment: 'Status: PLANNED, IN_PROGRESS, IMPLEMENTED, MONITORING',
    },
    treatmentCost: {
        type: 'FLOAT',
        allowNull: true,
    },
    treatmentEffectiveness: {
        type: 'FLOAT',
        allowNull: true,
    },
    controls: {
        type: 'JSONB',
        defaultValue: [],
    },
    // Monitoring
    reviewFrequency: {
        type: 'STRING',
        allowNull: false,
        comment: 'Frequency: DAILY, WEEKLY, MONTHLY, QUARTERLY, ANNUALLY',
    },
    lastReviewDate: {
        type: 'DATE',
        allowNull: true,
    },
    nextReviewDate: {
        type: 'DATE',
        allowNull: false,
    },
    reviewHistory: {
        type: 'JSONB',
        defaultValue: [],
    },
    kris: {
        type: 'JSONB',
        defaultValue: [],
        comment: 'Key Risk Indicators',
    },
    // Status & Lifecycle
    status: {
        type: 'STRING',
        allowNull: false,
        defaultValue: 'ACTIVE',
        comment: 'Status: ACTIVE, MONITORING, CLOSED, ACCEPTED',
    },
    closedAt: {
        type: 'DATE',
        allowNull: true,
    },
    closedBy: {
        type: 'UUID',
        allowNull: true,
    },
    closureReason: {
        type: 'TEXT',
        allowNull: true,
    },
    metadata: {
        type: 'JSONB',
        defaultValue: {},
    },
    createdAt: {
        type: 'DATE',
        allowNull: false,
    },
    updatedAt: {
        type: 'DATE',
        allowNull: false,
    },
});
exports.getRiskRegisterModelAttributes = getRiskRegisterModelAttributes;
// ============================================================================
// DEFAULT EXPORT
// ============================================================================
exports.default = {
    // Sequelize Models
    getThreatRiskScoreModelAttributes: exports.getThreatRiskScoreModelAttributes,
    getThreatPriorityQueueModelAttributes: exports.getThreatPriorityQueueModelAttributes,
    getVulnerabilityAssessmentModelAttributes: exports.getVulnerabilityAssessmentModelAttributes,
    getRiskRegisterModelAttributes: exports.getRiskRegisterModelAttributes,
    // Scoring Functions (9)
    calculateThreatScore: threat_scoring_kit_1.calculateThreatScore,
    calculateSeverityScore: threat_scoring_kit_1.calculateSeverityScore,
    calculateImpactScore: threat_scoring_kit_1.calculateImpactScore,
    calculateLikelihoodScore: threat_scoring_kit_1.calculateLikelihoodScore,
    calculateUrgencyScore: threat_scoring_kit_1.calculateUrgencyScore,
    calculateConfidenceScore: threat_scoring_kit_1.calculateConfidenceScore,
    calculateRiskScore: threat_scoring_kit_1.calculateRiskScore,
    calculateContextualRisk: threat_scoring_kit_1.calculateContextualRisk,
    calculateResidualRisk: threat_scoring_kit_1.calculateResidualRisk,
    // Confidence & Reliability (3)
    computeConfidenceMetrics: threat_scoring_kit_1.computeConfidenceMetrics,
    calculateSourceReliability: threat_scoring_kit_1.calculateSourceReliability,
    aggregateIndicatorConfidence: threat_scoring_kit_1.aggregateIndicatorConfidence,
    // Severity & Impact Assessment (5)
    determineSeverityLevel: threat_scoring_kit_1.determineSeverityLevel,
    calculateSeverityTrend: threat_scoring_kit_1.calculateSeverityTrend,
    assessThreatImpact: threat_scoring_kit_1.assessThreatImpact,
    calculateBusinessImpact: threat_scoring_kit_1.calculateBusinessImpact,
    estimateFinancialImpact: threat_scoring_kit_1.estimateFinancialImpact,
    // Likelihood Calculation (2)
    calculateComprehensiveLikelihood: threat_scoring_kit_1.calculateComprehensiveLikelihood,
    calculateAttackProbability: threat_scoring_kit_1.calculateAttackProbability,
    // Aggregation & Normalization (6)
    aggregateCompositeScore: threat_scoring_kit_1.aggregateCompositeScore,
    calculateWeightedAverage: threat_scoring_kit_1.calculateWeightedAverage,
    normalizeScore: threat_scoring_kit_1.normalizeScore,
    normalizeCVSSScore: threat_scoring_kit_1.normalizeCVSSScore,
    applyMinMaxNormalization: threat_scoring_kit_1.applyMinMaxNormalization,
    applyZScoreNormalization: threat_scoring_kit_1.applyZScoreNormalization,
    // Priority Queue Management (6)
    createPriorityQueue: threat_prioritization_kit_1.createPriorityQueue,
    enqueueThreat: threat_prioritization_kit_1.enqueueThreat,
    dequeueThreat: threat_prioritization_kit_1.dequeueThreat,
    rebalancePriorityQueue: threat_prioritization_kit_1.rebalancePriorityQueue,
    getNextThreat: threat_prioritization_kit_1.getNextThreat,
    calculateQueueStatistics: threat_prioritization_kit_1.calculateQueueStatistics,
    // Business Context Prioritization (3)
    adjustPriorityForBusinessContext: threat_prioritization_kit_1.adjustPriorityForBusinessContext,
    calculateStakeholderPriority: threat_prioritization_kit_1.calculateStakeholderPriority,
    isInCriticalBusinessPeriod: threat_prioritization_kit_1.isInCriticalBusinessPeriod,
    // Asset-Based Prioritization (3)
    calculateAssetPriorityMultiplier: threat_prioritization_kit_1.calculateAssetPriorityMultiplier,
    calculateDependencyImpact: threat_prioritization_kit_1.calculateDependencyImpact,
    calculateAssetBasedPriority: threat_prioritization_kit_1.calculateAssetBasedPriority,
    // Time-Based Prioritization (3)
    calculateTimeUrgency: threat_prioritization_kit_1.calculateTimeUrgency,
    adjustPriorityForTimeWindow: threat_prioritization_kit_1.adjustPriorityForTimeWindow,
    calculateAgingDecay: threat_prioritization_kit_1.calculateAgingDecay,
    // SLA Management (4)
    calculateSLAStatus: threat_prioritization_kit_1.calculateSLAStatus,
    determinePriorityLevel: threat_prioritization_kit_1.determinePriorityLevel,
    calculateSLADueDate: threat_prioritization_kit_1.calculateSLADueDate,
    requiresSLAEscalation: threat_prioritization_kit_1.requiresSLAEscalation,
    // Triage & Escalation (6)
    evaluateTriageRule: threat_prioritization_kit_1.evaluateTriageRule,
    applyTriageRules: threat_prioritization_kit_1.applyTriageRules,
    createAutoAssignmentRule: threat_prioritization_kit_1.createAutoAssignmentRule,
    shouldEscalateThreat: threat_prioritization_kit_1.shouldEscalateThreat,
    calculateEscalationLevel: threat_prioritization_kit_1.calculateEscalationLevel,
    executeEscalationPolicy: threat_prioritization_kit_1.executeEscalationPolicy,
    // Comprehensive Prioritization (1)
    calculateComprehensivePriority: threat_prioritization_kit_1.calculateComprehensivePriority,
    // Risk Scoring & Analysis (5)
    calculateRiskScoreAdvanced: risk_analysis_kit_1.calculateRiskScore,
    prioritizeRisks: risk_analysis_kit_1.prioritizeRisks,
    calculateRiskVelocity: risk_analysis_kit_1.calculateRiskVelocity,
    aggregateRiskScoresByCategory: risk_analysis_kit_1.aggregateRiskScoresByCategory,
    generateRiskScoringReport: risk_analysis_kit_1.generateRiskScoringReport,
    // Vulnerability Assessment (5)
    assessVulnerability: risk_analysis_kit_1.assessVulnerability,
    calculateCVSS: risk_analysis_kit_1.calculateCVSS,
    scanAssetsForVulnerabilities: risk_analysis_kit_1.scanAssetsForVulnerabilities,
    prioritizeVulnerabilities: risk_analysis_kit_1.prioritizeVulnerabilities,
    generateVulnerabilityRemediationPlan: risk_analysis_kit_1.generateVulnerabilityRemediationPlan,
    // Risk Heat Maps (5)
    generateRiskHeatMap: risk_analysis_kit_1.generateRiskHeatMap,
    visualizeRiskMatrix: risk_analysis_kit_1.visualizeRiskMatrix,
    generateDepartmentRiskHeatMap: risk_analysis_kit_1.generateDepartmentRiskHeatMap,
    compareHeatMapsOverTime: risk_analysis_kit_1.compareHeatMapsOverTime,
    exportHeatMap: risk_analysis_kit_1.exportHeatMap,
    // Business Impact Analysis (5)
    conductBusinessImpactAnalysis: risk_analysis_kit_1.conductBusinessImpactAnalysis,
    calculateRecoveryObjectives: risk_analysis_kit_1.calculateRecoveryObjectives,
    evaluateFinancialImpactAdvanced: risk_analysis_kit_1.evaluateFinancialImpact,
    identifyCriticalProcesses: risk_analysis_kit_1.identifyCriticalProcesses,
    generateBIASummary: risk_analysis_kit_1.generateBIASummary,
    // Risk Appetite Management (5)
    configureRiskAppetite: risk_analysis_kit_1.configureRiskAppetite,
    validateRiskAgainstAppetite: risk_analysis_kit_1.validateRiskAgainstAppetite,
    getRiskAppetiteStatement: risk_analysis_kit_1.getRiskAppetiteStatement,
    updateRiskToleranceLevels: risk_analysis_kit_1.updateRiskToleranceLevels,
    generateAppetiteComplianceReport: risk_analysis_kit_1.generateAppetiteComplianceReport,
    // Risk Acceptance (5)
    createRiskAcceptance: risk_analysis_kit_1.createRiskAcceptance,
    reviewRiskAcceptance: risk_analysis_kit_1.reviewRiskAcceptance,
    revokeRiskAcceptance: risk_analysis_kit_1.revokeRiskAcceptance,
    getAcceptedRisks: risk_analysis_kit_1.getAcceptedRisks,
    notifyAcceptanceExpiry: risk_analysis_kit_1.notifyAcceptanceExpiry,
    // Risk Register Management (5)
    createRiskRegisterEntry: risk_analysis_kit_1.createRiskRegisterEntry,
    updateRiskRegisterEntry: risk_analysis_kit_1.updateRiskRegisterEntry,
    searchRiskRegister: risk_analysis_kit_1.searchRiskRegister,
    exportRiskRegister: risk_analysis_kit_1.exportRiskRegister,
    archiveClosedRisks: risk_analysis_kit_1.archiveClosedRisks,
    // Risk Treatment Planning (5)
    developRiskTreatmentPlan: risk_analysis_kit_1.developRiskTreatmentPlan,
    trackTreatmentProgress: risk_analysis_kit_1.trackTreatmentProgress,
    calculateTreatmentEffectiveness: risk_analysis_kit_1.calculateTreatmentEffectiveness,
    optimizeTreatmentCosts: risk_analysis_kit_1.optimizeTreatmentCosts,
    approveTreatmentPlan: risk_analysis_kit_1.approveTreatmentPlan,
    // Risk Monitoring & Reporting (4)
    monitorRiskIndicators: risk_analysis_kit_1.monitorRiskIndicators,
    generateRiskDashboard: risk_analysis_kit_1.generateRiskDashboard,
    createRiskAlert: risk_analysis_kit_1.createRiskAlert,
    generateExecutiveRiskReport: risk_analysis_kit_1.generateExecutiveRiskReport,
    // Third-Party Risk (1)
    assessThirdPartyRisk: risk_analysis_kit_1.assessThirdPartyRisk,
    // Threat Identification & Classification (5)
    identifyThreat: threat_assessment_kit_1.identifyThreat,
    classifyThreat: threat_assessment_kit_1.classifyThreat,
    categorizeThreatByFramework: threat_assessment_kit_1.categorizeThreatByFramework,
    updateThreatClassification: threat_assessment_kit_1.updateThreatClassification,
    getThreatClassificationHistory: threat_assessment_kit_1.getThreatClassificationHistory,
    // Threat Actor Profiling (5)
    profileThreatActor: threat_assessment_kit_1.profileThreatActor,
    analyzeThreatActorMotivation: threat_assessment_kit_1.analyzeThreatActorMotivation,
    attributeThreatToActor: threat_assessment_kit_1.attributeThreatToActor,
    getThreatActorCapabilities: threat_assessment_kit_1.getThreatActorCapabilities,
    compareThreatActors: threat_assessment_kit_1.compareThreatActors,
    // Attack Vector Analysis (5)
    analyzeAttackVector: threat_assessment_kit_1.analyzeAttackVector,
    mapAttackPath: threat_assessment_kit_1.mapAttackPath,
    identifyEntryPoints: threat_assessment_kit_1.identifyEntryPoints,
    analyzeAttackTechniques: threat_assessment_kit_1.analyzeAttackTechniques,
    generateAttackVectorHeatMap: threat_assessment_kit_1.generateAttackVectorHeatMap,
    // Threat Severity & Impact Scoring (5)
    calculateThreatSeverityScore: threat_assessment_kit_1.calculateThreatSeverityScore,
    evaluateThreatImpact: threat_assessment_kit_1.evaluateThreatImpact,
    calculateExploitabilityScore: threat_assessment_kit_1.calculateExploitabilityScore,
    prioritizeThreats: threat_assessment_kit_1.prioritizeThreats,
    reevaluateThreatSeverity: threat_assessment_kit_1.reevaluateThreatSeverity,
    // Threat Correlation & Patterns (5)
    correlateThreats: threat_assessment_kit_1.correlateThreats,
    detectThreatPatterns: threat_assessment_kit_1.detectThreatPatterns,
    linkThreatsToCampaign: threat_assessment_kit_1.linkThreatsToCampaign,
    analyzeThreatClustering: threat_assessment_kit_1.analyzeThreatClustering,
    generateThreatCorrelationGraph: threat_assessment_kit_1.generateThreatCorrelationGraph,
    // Threat Landscape Analysis (5)
    analyzeThreatLandscape: threat_assessment_kit_1.analyzeThreatLandscape,
    identifyEmergingThreats: threat_assessment_kit_1.identifyEmergingThreats,
    generateThreatTrendAnalysis: threat_assessment_kit_1.generateThreatTrendAnalysis,
    compareThreatLandscapeByRegion: threat_assessment_kit_1.compareThreatLandscapeByRegion,
    generateThreatForecast: threat_assessment_kit_1.generateThreatForecast,
    // Threat Intelligence Management (6)
    enrichThreatIntelligence: threat_assessment_kit_1.enrichThreatIntelligence,
    manageIndicatorOfCompromise: threat_assessment_kit_1.manageIndicatorOfCompromise,
    queryThreatIntelligenceFeeds: threat_assessment_kit_1.queryThreatIntelligenceFeeds,
    validateThreatIntelligence: threat_assessment_kit_1.validateThreatIntelligence,
    shareThreatIntelligence: threat_assessment_kit_1.shareThreatIntelligence,
    validateThreatData: threat_assessment_kit_1.validateThreatData,
    // Additional Risk Scoring from Prediction Kit (2)
    generateComprehensiveRiskScore: threat_prediction_forecasting_kit_1.generateComprehensiveRiskScore,
    calculateThreatVelocity: threat_prediction_forecasting_kit_1.calculateThreatVelocity,
};
//# sourceMappingURL=threat-risk-scoring-composite.js.map