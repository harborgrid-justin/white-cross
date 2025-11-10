"use strict";
/**
 * LOC: RISK_MANAGEMENT_INTERNAL_CONTROLS_KIT_001
 * File: /reuse/government/risk-management-internal-controls-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - crypto (Node.js built-in)
 *   - class-validator
 *
 * DOWNSTREAM (imported by):
 *   - Risk management services
 *   - Internal audit modules
 *   - Control testing systems
 *   - Enterprise risk dashboard
 *   - Compliance monitoring services
 *   - Third-party risk management
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskDashboardMetricsResponse = exports.RiskHeatMapResponse = exports.CreateInternalControlDto = exports.CreateRiskDto = exports.RiskManagementServiceExample = exports.IncidentResponseRecordModel = exports.WhistleblowerCaseModel = exports.ControlDeficiencyModel = exports.InternalControlModel = exports.IdentifiedRiskModel = exports.EnterpriseRiskAssessmentModel = exports.IncidentStatus = exports.IncidentSeverity = exports.IncidentType = exports.ThirdPartyAssessmentType = exports.FindingStatus = exports.AuditType = exports.WhistleblowerStatus = exports.AllegationType = exports.ReportingChannel = exports.FraudRiskScope = exports.RiskTrend = exports.TestConclusion = exports.TestType = exports.DeficiencyStatus = exports.DeficiencySeverity = exports.DeficiencyType = exports.COSOObjective = exports.COSOComponent = exports.ControlStatus = exports.AutomationLevel = exports.EffectivenessRating = exports.ControlFrequency = exports.ControlCategory = exports.ControlType = exports.MitigationStatus = exports.RiskStatus = exports.RiskResponse = exports.RiskAppetite = exports.ImpactLevel = exports.LikelihoodLevel = exports.RiskLevel = exports.RiskType = exports.RiskCategory = exports.AssessmentStatus = exports.AssessmentScope = exports.RiskFramework = void 0;
exports.createEnterpriseRiskAssessment = createEnterpriseRiskAssessment;
exports.updateAssessmentStatus = updateAssessmentStatus;
exports.approveRiskAssessment = approveRiskAssessment;
exports.calculateOverallRiskScore = calculateOverallRiskScore;
exports.determineOverallRiskLevel = determineOverallRiskLevel;
exports.identifyRisk = identifyRisk;
exports.calculateRiskScore = calculateRiskScore;
exports.categorizeRiskLevel = categorizeRiskLevel;
exports.updateResidualRisk = updateResidualRisk;
exports.escalateRisk = escalateRisk;
exports.filterRisksByCategory = filterRisksByCategory;
exports.getHighPriorityRisks = getHighPriorityRisks;
exports.createRiskMitigationPlan = createRiskMitigationPlan;
exports.addMitigationStrategy = addMitigationStrategy;
exports.updateMitigationProgress = updateMitigationProgress;
exports.calculateMitigationCompletion = calculateMitigationCompletion;
exports.createInternalControl = createInternalControl;
exports.linkControlToRisks = linkControlToRisks;
exports.updateControlEffectiveness = updateControlEffectiveness;
exports.getControlsByCOSOComponent = getControlsByCOSOComponent;
exports.validateCOSOCoverage = validateCOSOCoverage;
exports.createControlTestingRecord = createControlTestingRecord;
exports.addTestObservation = addTestObservation;
exports.recordTestException = recordTestException;
exports.concludeControlTesting = concludeControlTesting;
exports.calculateExceptionRate = calculateExceptionRate;
exports.createControlDeficiency = createControlDeficiency;
exports.updateDeficiencyRemediation = updateDeficiencyRemediation;
exports.closeDeficiency = closeDeficiency;
exports.getOpenDeficienciesBySeverity = getOpenDeficienciesBySeverity;
exports.getMaterialWeaknesses = getMaterialWeaknesses;
exports.createRiskRegisterEntry = createRiskRegisterEntry;
exports.updateRiskTrend = updateRiskTrend;
exports.filterRiskRegisterByCategory = filterRiskRegisterByCategory;
exports.getBoardReportingRisks = getBoardReportingRisks;
exports.generateRiskHeatMap = generateRiskHeatMap;
exports.createRiskPlotPoint = createRiskPlotPoint;
exports.getLikelihoodScore = getLikelihoodScore;
exports.getImpactScore = getImpactScore;
exports.generateRiskZones = generateRiskZones;
exports.categorizeRisksForHeatMap = categorizeRisksForHeatMap;
exports.createSODMatrix = createSODMatrix;
exports.addIncompatibleFunction = addIncompatibleFunction;
exports.recordSODViolation = recordSODViolation;
exports.validateUserSOD = validateUserSOD;
exports.createAuthorizationMatrix = createAuthorizationMatrix;
exports.addAuthorizationLevel = addAuthorizationLevel;
exports.validateAuthorization = validateAuthorization;
exports.createFraudRiskAssessment = createFraudRiskAssessment;
exports.addFraudScheme = addFraudScheme;
exports.analyzeFraudTriangle = analyzeFraudTriangle;
exports.createWhistleblowerCase = createWhistleblowerCase;
exports.generateWhistleblowerCaseNumber = generateWhistleblowerCaseNumber;
exports.determineCasePriority = determineCasePriority;
exports.assignInvestigator = assignInvestigator;
exports.closeWhistleblowerCase = closeWhistleblowerCase;
exports.createInternalAuditPlan = createInternalAuditPlan;
exports.addAuditableEntity = addAuditableEntity;
exports.scheduleAudit = scheduleAudit;
exports.prioritizeAuditUniverse = prioritizeAuditUniverse;
exports.createAuditFinding = createAuditFinding;
exports.recordManagementResponse = recordManagementResponse;
exports.updateFindingStatus = updateFindingStatus;
exports.verifyFindingRemediation = verifyFindingRemediation;
exports.getOverdueFindings = getOverdueFindings;
exports.createBusinessContinuityPlan = createBusinessContinuityPlan;
exports.createDisasterRecoveryPlan = createDisasterRecoveryPlan;
exports.createIncidentResponse = createIncidentResponse;
exports.generateIncidentNumber = generateIncidentNumber;
exports.updateIncidentStatus = updateIncidentStatus;
exports.closeIncident = closeIncident;
exports.generateRiskDashboardMetrics = generateRiskDashboardMetrics;
exports.categorizeRisksByLevel = categorizeRisksByLevel;
exports.categorizeRisksByCategory = categorizeRisksByCategory;
/**
 * File: /reuse/government/risk-management-internal-controls-kit.ts
 * Locator: WC-GOV-RISK-INTERNAL-CONTROLS-001
 * Purpose: Comprehensive Risk Management and Internal Controls for Government Operations
 *
 * Upstream: @nestjs/common, @nestjs/swagger, sequelize-typescript, crypto, class-validator
 * Downstream: Risk services, Internal audit, Control testing, ERM dashboard, Compliance
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10+, Sequelize 6+
 * Exports: 50+ enterprise risk management and internal control functions
 *
 * LLM Context: Enterprise-grade risk management and internal controls for government agencies.
 * Provides comprehensive risk assessment, risk identification, mitigation planning, control
 * framework implementation, control testing, deficiency tracking, risk registers, heat maps,
 * COSO compliance, fraud risk, whistleblower management, internal audit, business continuity,
 * disaster recovery, incident response, and extensive NestJS/Sequelize integration.
 */
const crypto = __importStar(require("crypto"));
/**
 * Risk frameworks
 */
var RiskFramework;
(function (RiskFramework) {
    RiskFramework["COSO_ERM"] = "COSO_ERM";
    RiskFramework["ISO_31000"] = "ISO_31000";
    RiskFramework["NIST_RMF"] = "NIST_RMF";
    RiskFramework["FAIR"] = "FAIR";
    RiskFramework["OMB_CIRCULAR_A123"] = "OMB_CIRCULAR_A123";
    RiskFramework["GAO_GREEN_BOOK"] = "GAO_GREEN_BOOK";
    RiskFramework["COBIT"] = "COBIT";
    RiskFramework["CUSTOM"] = "CUSTOM";
})(RiskFramework || (exports.RiskFramework = RiskFramework = {}));
/**
 * Assessment scope
 */
var AssessmentScope;
(function (AssessmentScope) {
    AssessmentScope["STRATEGIC"] = "STRATEGIC";
    AssessmentScope["OPERATIONAL"] = "OPERATIONAL";
    AssessmentScope["FINANCIAL"] = "FINANCIAL";
    AssessmentScope["COMPLIANCE"] = "COMPLIANCE";
    AssessmentScope["REPUTATIONAL"] = "REPUTATIONAL";
    AssessmentScope["TECHNOLOGICAL"] = "TECHNOLOGICAL";
    AssessmentScope["ENVIRONMENTAL"] = "ENVIRONMENTAL";
    AssessmentScope["LEGAL"] = "LEGAL";
    AssessmentScope["CYBERSECURITY"] = "CYBERSECURITY";
    AssessmentScope["THIRD_PARTY"] = "THIRD_PARTY";
})(AssessmentScope || (exports.AssessmentScope = AssessmentScope = {}));
/**
 * Assessment status
 */
var AssessmentStatus;
(function (AssessmentStatus) {
    AssessmentStatus["PLANNING"] = "PLANNING";
    AssessmentStatus["IN_PROGRESS"] = "IN_PROGRESS";
    AssessmentStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    AssessmentStatus["COMPLETED"] = "COMPLETED";
    AssessmentStatus["APPROVED"] = "APPROVED";
    AssessmentStatus["ARCHIVED"] = "ARCHIVED";
})(AssessmentStatus || (exports.AssessmentStatus = AssessmentStatus = {}));
/**
 * Risk categories
 */
var RiskCategory;
(function (RiskCategory) {
    RiskCategory["STRATEGIC_RISK"] = "STRATEGIC_RISK";
    RiskCategory["OPERATIONAL_RISK"] = "OPERATIONAL_RISK";
    RiskCategory["FINANCIAL_RISK"] = "FINANCIAL_RISK";
    RiskCategory["COMPLIANCE_RISK"] = "COMPLIANCE_RISK";
    RiskCategory["FRAUD_RISK"] = "FRAUD_RISK";
    RiskCategory["REPUTATION_RISK"] = "REPUTATION_RISK";
    RiskCategory["CYBERSECURITY_RISK"] = "CYBERSECURITY_RISK";
    RiskCategory["TECHNOLOGY_RISK"] = "TECHNOLOGY_RISK";
    RiskCategory["HUMAN_CAPITAL_RISK"] = "HUMAN_CAPITAL_RISK";
    RiskCategory["THIRD_PARTY_RISK"] = "THIRD_PARTY_RISK";
    RiskCategory["BUSINESS_CONTINUITY_RISK"] = "BUSINESS_CONTINUITY_RISK";
    RiskCategory["ENVIRONMENTAL_RISK"] = "ENVIRONMENTAL_RISK";
})(RiskCategory || (exports.RiskCategory = RiskCategory = {}));
/**
 * Risk types
 */
var RiskType;
(function (RiskType) {
    RiskType["INTERNAL"] = "INTERNAL";
    RiskType["EXTERNAL"] = "EXTERNAL";
    RiskType["EMERGING"] = "EMERGING";
    RiskType["RESIDUAL"] = "RESIDUAL";
    RiskType["INHERENT"] = "INHERENT";
})(RiskType || (exports.RiskType = RiskType = {}));
/**
 * Risk level
 */
var RiskLevel;
(function (RiskLevel) {
    RiskLevel["CRITICAL"] = "CRITICAL";
    RiskLevel["HIGH"] = "HIGH";
    RiskLevel["MEDIUM"] = "MEDIUM";
    RiskLevel["LOW"] = "LOW";
    RiskLevel["NEGLIGIBLE"] = "NEGLIGIBLE";
})(RiskLevel || (exports.RiskLevel = RiskLevel = {}));
/**
 * Likelihood level
 */
var LikelihoodLevel;
(function (LikelihoodLevel) {
    LikelihoodLevel["VERY_LIKELY"] = "VERY_LIKELY";
    LikelihoodLevel["LIKELY"] = "LIKELY";
    LikelihoodLevel["POSSIBLE"] = "POSSIBLE";
    LikelihoodLevel["UNLIKELY"] = "UNLIKELY";
    LikelihoodLevel["RARE"] = "RARE";
})(LikelihoodLevel || (exports.LikelihoodLevel = LikelihoodLevel = {}));
/**
 * Impact level
 */
var ImpactLevel;
(function (ImpactLevel) {
    ImpactLevel["CATASTROPHIC"] = "CATASTROPHIC";
    ImpactLevel["MAJOR"] = "MAJOR";
    ImpactLevel["MODERATE"] = "MODERATE";
    ImpactLevel["MINOR"] = "MINOR";
    ImpactLevel["INSIGNIFICANT"] = "INSIGNIFICANT";
})(ImpactLevel || (exports.ImpactLevel = ImpactLevel = {}));
/**
 * Risk appetite
 */
var RiskAppetite;
(function (RiskAppetite) {
    RiskAppetite["ZERO_TOLERANCE"] = "ZERO_TOLERANCE";
    RiskAppetite["LOW"] = "LOW";
    RiskAppetite["MODERATE"] = "MODERATE";
    RiskAppetite["HIGH"] = "HIGH";
    RiskAppetite["AGGRESSIVE"] = "AGGRESSIVE";
})(RiskAppetite || (exports.RiskAppetite = RiskAppetite = {}));
/**
 * Risk response strategy
 */
var RiskResponse;
(function (RiskResponse) {
    RiskResponse["AVOID"] = "AVOID";
    RiskResponse["MITIGATE"] = "MITIGATE";
    RiskResponse["TRANSFER"] = "TRANSFER";
    RiskResponse["ACCEPT"] = "ACCEPT";
    RiskResponse["MONITOR"] = "MONITOR";
})(RiskResponse || (exports.RiskResponse = RiskResponse = {}));
/**
 * Risk status
 */
var RiskStatus;
(function (RiskStatus) {
    RiskStatus["ACTIVE"] = "ACTIVE";
    RiskStatus["MONITORING"] = "MONITORING";
    RiskStatus["MITIGATING"] = "MITIGATING";
    RiskStatus["MITIGATED"] = "MITIGATED";
    RiskStatus["ACCEPTED"] = "ACCEPTED";
    RiskStatus["CLOSED"] = "CLOSED";
    RiskStatus["ESCALATED"] = "ESCALATED";
})(RiskStatus || (exports.RiskStatus = RiskStatus = {}));
/**
 * Mitigation status
 */
var MitigationStatus;
(function (MitigationStatus) {
    MitigationStatus["NOT_STARTED"] = "NOT_STARTED";
    MitigationStatus["PLANNING"] = "PLANNING";
    MitigationStatus["IN_PROGRESS"] = "IN_PROGRESS";
    MitigationStatus["ON_HOLD"] = "ON_HOLD";
    MitigationStatus["COMPLETED"] = "COMPLETED";
    MitigationStatus["CANCELLED"] = "CANCELLED";
})(MitigationStatus || (exports.MitigationStatus = MitigationStatus = {}));
/**
 * Control type
 */
var ControlType;
(function (ControlType) {
    ControlType["PREVENTIVE"] = "PREVENTIVE";
    ControlType["DETECTIVE"] = "DETECTIVE";
    ControlType["CORRECTIVE"] = "CORRECTIVE";
    ControlType["DIRECTIVE"] = "DIRECTIVE";
    ControlType["COMPENSATING"] = "COMPENSATING";
})(ControlType || (exports.ControlType = ControlType = {}));
/**
 * Control category
 */
var ControlCategory;
(function (ControlCategory) {
    ControlCategory["AUTHORIZATION"] = "AUTHORIZATION";
    ControlCategory["SEGREGATION_OF_DUTIES"] = "SEGREGATION_OF_DUTIES";
    ControlCategory["PHYSICAL_CONTROL"] = "PHYSICAL_CONTROL";
    ControlCategory["RECONCILIATION"] = "RECONCILIATION";
    ControlCategory["REVIEW"] = "REVIEW";
    ControlCategory["ACCESS_CONTROL"] = "ACCESS_CONTROL";
    ControlCategory["INFORMATION_PROCESSING"] = "INFORMATION_PROCESSING";
    ControlCategory["PERFORMANCE_INDICATOR"] = "PERFORMANCE_INDICATOR";
    ControlCategory["DOCUMENTATION"] = "DOCUMENTATION";
})(ControlCategory || (exports.ControlCategory = ControlCategory = {}));
/**
 * Control frequency
 */
var ControlFrequency;
(function (ControlFrequency) {
    ControlFrequency["CONTINUOUS"] = "CONTINUOUS";
    ControlFrequency["DAILY"] = "DAILY";
    ControlFrequency["WEEKLY"] = "WEEKLY";
    ControlFrequency["MONTHLY"] = "MONTHLY";
    ControlFrequency["QUARTERLY"] = "QUARTERLY";
    ControlFrequency["ANNUALLY"] = "ANNUALLY";
    ControlFrequency["EVENT_DRIVEN"] = "EVENT_DRIVEN";
})(ControlFrequency || (exports.ControlFrequency = ControlFrequency = {}));
/**
 * Effectiveness rating
 */
var EffectivenessRating;
(function (EffectivenessRating) {
    EffectivenessRating["EFFECTIVE"] = "EFFECTIVE";
    EffectivenessRating["PARTIALLY_EFFECTIVE"] = "PARTIALLY_EFFECTIVE";
    EffectivenessRating["INEFFECTIVE"] = "INEFFECTIVE";
    EffectivenessRating["NOT_TESTED"] = "NOT_TESTED";
    EffectivenessRating["NOT_APPLICABLE"] = "NOT_APPLICABLE";
})(EffectivenessRating || (exports.EffectivenessRating = EffectivenessRating = {}));
/**
 * Automation level
 */
var AutomationLevel;
(function (AutomationLevel) {
    AutomationLevel["FULLY_AUTOMATED"] = "FULLY_AUTOMATED";
    AutomationLevel["SEMI_AUTOMATED"] = "SEMI_AUTOMATED";
    AutomationLevel["MANUAL"] = "MANUAL";
    AutomationLevel["MANUAL_WITH_IT"] = "MANUAL_WITH_IT";
})(AutomationLevel || (exports.AutomationLevel = AutomationLevel = {}));
/**
 * Control status
 */
var ControlStatus;
(function (ControlStatus) {
    ControlStatus["ACTIVE"] = "ACTIVE";
    ControlStatus["INACTIVE"] = "INACTIVE";
    ControlStatus["IN_DESIGN"] = "IN_DESIGN";
    ControlStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    ControlStatus["NEEDS_REMEDIATION"] = "NEEDS_REMEDIATION";
    ControlStatus["RETIRED"] = "RETIRED";
})(ControlStatus || (exports.ControlStatus = ControlStatus = {}));
/**
 * COSO components
 */
var COSOComponent;
(function (COSOComponent) {
    COSOComponent["CONTROL_ENVIRONMENT"] = "CONTROL_ENVIRONMENT";
    COSOComponent["RISK_ASSESSMENT"] = "RISK_ASSESSMENT";
    COSOComponent["CONTROL_ACTIVITIES"] = "CONTROL_ACTIVITIES";
    COSOComponent["INFORMATION_COMMUNICATION"] = "INFORMATION_COMMUNICATION";
    COSOComponent["MONITORING_ACTIVITIES"] = "MONITORING_ACTIVITIES";
})(COSOComponent || (exports.COSOComponent = COSOComponent = {}));
/**
 * COSO objectives
 */
var COSOObjective;
(function (COSOObjective) {
    COSOObjective["OPERATIONS"] = "OPERATIONS";
    COSOObjective["REPORTING"] = "REPORTING";
    COSOObjective["COMPLIANCE"] = "COMPLIANCE";
})(COSOObjective || (exports.COSOObjective = COSOObjective = {}));
/**
 * Deficiency type
 */
var DeficiencyType;
(function (DeficiencyType) {
    DeficiencyType["DESIGN_DEFICIENCY"] = "DESIGN_DEFICIENCY";
    DeficiencyType["OPERATING_DEFICIENCY"] = "OPERATING_DEFICIENCY";
    DeficiencyType["BOTH"] = "BOTH";
})(DeficiencyType || (exports.DeficiencyType = DeficiencyType = {}));
/**
 * Deficiency severity
 */
var DeficiencySeverity;
(function (DeficiencySeverity) {
    DeficiencySeverity["MATERIAL_WEAKNESS"] = "MATERIAL_WEAKNESS";
    DeficiencySeverity["SIGNIFICANT_DEFICIENCY"] = "SIGNIFICANT_DEFICIENCY";
    DeficiencySeverity["DEFICIENCY"] = "DEFICIENCY";
    DeficiencySeverity["OBSERVATION"] = "OBSERVATION";
})(DeficiencySeverity || (exports.DeficiencySeverity = DeficiencySeverity = {}));
/**
 * Deficiency status
 */
var DeficiencyStatus;
(function (DeficiencyStatus) {
    DeficiencyStatus["OPEN"] = "OPEN";
    DeficiencyStatus["IN_REMEDIATION"] = "IN_REMEDIATION";
    DeficiencyStatus["REMEDIATED"] = "REMEDIATED";
    DeficiencyStatus["VERIFIED"] = "VERIFIED";
    DeficiencyStatus["CLOSED"] = "CLOSED";
    DeficiencyStatus["ACCEPTED"] = "ACCEPTED";
})(DeficiencyStatus || (exports.DeficiencyStatus = DeficiencyStatus = {}));
/**
 * Test type
 */
var TestType;
(function (TestType) {
    TestType["DESIGN_TESTING"] = "DESIGN_TESTING";
    TestType["OPERATING_EFFECTIVENESS"] = "OPERATING_EFFECTIVENESS";
    TestType["WALKTHROUGH"] = "WALKTHROUGH";
    TestType["INQUIRY"] = "INQUIRY";
    TestType["OBSERVATION"] = "OBSERVATION";
    TestType["INSPECTION"] = "INSPECTION";
    TestType["REPERFORMANCE"] = "REPERFORMANCE";
})(TestType || (exports.TestType = TestType = {}));
/**
 * Test conclusion
 */
var TestConclusion;
(function (TestConclusion) {
    TestConclusion["NO_EXCEPTIONS"] = "NO_EXCEPTIONS";
    TestConclusion["MINOR_EXCEPTIONS"] = "MINOR_EXCEPTIONS";
    TestConclusion["SIGNIFICANT_EXCEPTIONS"] = "SIGNIFICANT_EXCEPTIONS";
    TestConclusion["CONTROL_NOT_OPERATING"] = "CONTROL_NOT_OPERATING";
    TestConclusion["INCONCLUSIVE"] = "INCONCLUSIVE";
})(TestConclusion || (exports.TestConclusion = TestConclusion = {}));
/**
 * Risk trend
 */
var RiskTrend;
(function (RiskTrend) {
    RiskTrend["INCREASING"] = "INCREASING";
    RiskTrend["STABLE"] = "STABLE";
    RiskTrend["DECREASING"] = "DECREASING";
    RiskTrend["NEW"] = "NEW";
    RiskTrend["EMERGING"] = "EMERGING";
})(RiskTrend || (exports.RiskTrend = RiskTrend = {}));
/**
 * Fraud risk scope
 */
var FraudRiskScope;
(function (FraudRiskScope) {
    FraudRiskScope["FINANCIAL_REPORTING"] = "FINANCIAL_REPORTING";
    FraudRiskScope["ASSET_MISAPPROPRIATION"] = "ASSET_MISAPPROPRIATION";
    FraudRiskScope["CORRUPTION"] = "CORRUPTION";
    FraudRiskScope["PROCUREMENT_FRAUD"] = "PROCUREMENT_FRAUD";
    FraudRiskScope["PAYROLL_FRAUD"] = "PAYROLL_FRAUD";
    FraudRiskScope["GRANT_FRAUD"] = "GRANT_FRAUD";
    FraudRiskScope["VENDOR_FRAUD"] = "VENDOR_FRAUD";
    FraudRiskScope["CYBERSECURITY_FRAUD"] = "CYBERSECURITY_FRAUD";
})(FraudRiskScope || (exports.FraudRiskScope = FraudRiskScope = {}));
/**
 * Reporting channel
 */
var ReportingChannel;
(function (ReportingChannel) {
    ReportingChannel["HOTLINE"] = "HOTLINE";
    ReportingChannel["EMAIL"] = "EMAIL";
    ReportingChannel["WEB_PORTAL"] = "WEB_PORTAL";
    ReportingChannel["IN_PERSON"] = "IN_PERSON";
    ReportingChannel["MAIL"] = "MAIL";
    ReportingChannel["THIRD_PARTY_SERVICE"] = "THIRD_PARTY_SERVICE";
})(ReportingChannel || (exports.ReportingChannel = ReportingChannel = {}));
/**
 * Allegation type
 */
var AllegationType;
(function (AllegationType) {
    AllegationType["FRAUD"] = "FRAUD";
    AllegationType["WASTE"] = "WASTE";
    AllegationType["ABUSE"] = "ABUSE";
    AllegationType["MISCONDUCT"] = "MISCONDUCT";
    AllegationType["ETHICS_VIOLATION"] = "ETHICS_VIOLATION";
    AllegationType["CONFLICT_OF_INTEREST"] = "CONFLICT_OF_INTEREST";
    AllegationType["SAFETY_VIOLATION"] = "SAFETY_VIOLATION";
    AllegationType["REGULATORY_VIOLATION"] = "REGULATORY_VIOLATION";
    AllegationType["RETALIATION"] = "RETALIATION";
})(AllegationType || (exports.AllegationType = AllegationType = {}));
/**
 * Whistleblower status
 */
var WhistleblowerStatus;
(function (WhistleblowerStatus) {
    WhistleblowerStatus["RECEIVED"] = "RECEIVED";
    WhistleblowerStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    WhistleblowerStatus["INVESTIGATION_ASSIGNED"] = "INVESTIGATION_ASSIGNED";
    WhistleblowerStatus["INVESTIGATING"] = "INVESTIGATING";
    WhistleblowerStatus["INVESTIGATION_COMPLETE"] = "INVESTIGATION_COMPLETE";
    WhistleblowerStatus["CLOSED_SUBSTANTIATED"] = "CLOSED_SUBSTANTIATED";
    WhistleblowerStatus["CLOSED_UNSUBSTANTIATED"] = "CLOSED_UNSUBSTANTIATED";
    WhistleblowerStatus["CLOSED_INSUFFICIENT_EVIDENCE"] = "CLOSED_INSUFFICIENT_EVIDENCE";
})(WhistleblowerStatus || (exports.WhistleblowerStatus = WhistleblowerStatus = {}));
/**
 * Audit type
 */
var AuditType;
(function (AuditType) {
    AuditType["FINANCIAL"] = "FINANCIAL";
    AuditType["OPERATIONAL"] = "OPERATIONAL";
    AuditType["COMPLIANCE"] = "COMPLIANCE";
    AuditType["IT"] = "IT";
    AuditType["PERFORMANCE"] = "PERFORMANCE";
    AuditType["FRAUD"] = "FRAUD";
    AuditType["INVESTIGATIVE"] = "INVESTIGATIVE";
    AuditType["FOLLOW_UP"] = "FOLLOW_UP";
    AuditType["ADVISORY"] = "ADVISORY";
})(AuditType || (exports.AuditType = AuditType = {}));
/**
 * Finding status
 */
var FindingStatus;
(function (FindingStatus) {
    FindingStatus["DRAFT"] = "DRAFT";
    FindingStatus["ISSUED"] = "ISSUED";
    FindingStatus["MANAGEMENT_RESPONSE_PENDING"] = "MANAGEMENT_RESPONSE_PENDING";
    FindingStatus["ACTION_PLAN_APPROVED"] = "ACTION_PLAN_APPROVED";
    FindingStatus["IN_REMEDIATION"] = "IN_REMEDIATION";
    FindingStatus["PENDING_VERIFICATION"] = "PENDING_VERIFICATION";
    FindingStatus["CLOSED"] = "CLOSED";
    FindingStatus["OVERDUE"] = "OVERDUE";
})(FindingStatus || (exports.FindingStatus = FindingStatus = {}));
/**
 * Third-party assessment type
 */
var ThirdPartyAssessmentType;
(function (ThirdPartyAssessmentType) {
    ThirdPartyAssessmentType["INITIAL"] = "INITIAL";
    ThirdPartyAssessmentType["PERIODIC_REVIEW"] = "PERIODIC_REVIEW";
    ThirdPartyAssessmentType["EVENT_DRIVEN"] = "EVENT_DRIVEN";
    ThirdPartyAssessmentType["CONTRACT_RENEWAL"] = "CONTRACT_RENEWAL";
    ThirdPartyAssessmentType["EXIT_ASSESSMENT"] = "EXIT_ASSESSMENT";
})(ThirdPartyAssessmentType || (exports.ThirdPartyAssessmentType = ThirdPartyAssessmentType = {}));
/**
 * Incident type
 */
var IncidentType;
(function (IncidentType) {
    IncidentType["CYBERSECURITY"] = "CYBERSECURITY";
    IncidentType["DATA_BREACH"] = "DATA_BREACH";
    IncidentType["SYSTEM_OUTAGE"] = "SYSTEM_OUTAGE";
    IncidentType["NATURAL_DISASTER"] = "NATURAL_DISASTER";
    IncidentType["OPERATIONAL_FAILURE"] = "OPERATIONAL_FAILURE";
    IncidentType["FRAUD"] = "FRAUD";
    IncidentType["PHYSICAL_SECURITY"] = "PHYSICAL_SECURITY";
    IncidentType["VENDOR_FAILURE"] = "VENDOR_FAILURE";
    IncidentType["HUMAN_ERROR"] = "HUMAN_ERROR";
})(IncidentType || (exports.IncidentType = IncidentType = {}));
/**
 * Incident severity
 */
var IncidentSeverity;
(function (IncidentSeverity) {
    IncidentSeverity["CRITICAL"] = "CRITICAL";
    IncidentSeverity["HIGH"] = "HIGH";
    IncidentSeverity["MEDIUM"] = "MEDIUM";
    IncidentSeverity["LOW"] = "LOW";
})(IncidentSeverity || (exports.IncidentSeverity = IncidentSeverity = {}));
/**
 * Incident status
 */
var IncidentStatus;
(function (IncidentStatus) {
    IncidentStatus["REPORTED"] = "REPORTED";
    IncidentStatus["ACKNOWLEDGED"] = "ACKNOWLEDGED";
    IncidentStatus["INVESTIGATING"] = "INVESTIGATING";
    IncidentStatus["CONTAINED"] = "CONTAINED";
    IncidentStatus["ERADICATED"] = "ERADICATED";
    IncidentStatus["RECOVERING"] = "RECOVERING";
    IncidentStatus["RESOLVED"] = "RESOLVED";
    IncidentStatus["CLOSED"] = "CLOSED";
})(IncidentStatus || (exports.IncidentStatus = IncidentStatus = {}));
// ============================================================================
// ENTERPRISE RISK ASSESSMENT FUNCTIONS
// ============================================================================
/**
 * Creates an enterprise risk assessment
 *
 * @example
 * ```typescript
 * const assessment = createEnterpriseRiskAssessment({
 *   assessmentName: 'FY2024 Enterprise Risk Assessment',
 *   assessmentPeriod: 'FY2024',
 *   fiscalYear: 2024,
 *   agencyId: 'AGY-001',
 *   performedBy: 'Risk Management Team',
 *   riskFramework: RiskFramework.COSO_ERM,
 *   scope: [AssessmentScope.STRATEGIC, AssessmentScope.OPERATIONAL],
 *   nextReviewDate: new Date('2024-12-31'),
 * });
 * ```
 */
function createEnterpriseRiskAssessment(params) {
    return {
        id: crypto.randomUUID(),
        assessmentName: params.assessmentName,
        assessmentPeriod: params.assessmentPeriod,
        fiscalYear: params.fiscalYear,
        agencyId: params.agencyId,
        performedBy: params.performedBy,
        assessmentDate: new Date(),
        riskFramework: params.riskFramework,
        scope: params.scope,
        objectives: [],
        risks: [],
        overallRiskLevel: RiskLevel.MEDIUM,
        overallRiskScore: 0,
        nextReviewDate: params.nextReviewDate,
        status: AssessmentStatus.PLANNING,
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
/**
 * Updates assessment status
 */
function updateAssessmentStatus(assessment, status) {
    return {
        ...assessment,
        status,
        updatedAt: new Date(),
    };
}
/**
 * Approves enterprise risk assessment
 */
function approveRiskAssessment(assessment, approvedBy) {
    return {
        ...assessment,
        approvedBy,
        approvalDate: new Date(),
        status: AssessmentStatus.APPROVED,
        updatedAt: new Date(),
    };
}
/**
 * Calculates overall risk score from identified risks
 */
function calculateOverallRiskScore(risks) {
    if (risks.length === 0)
        return 0;
    const totalScore = risks.reduce((sum, risk) => sum + risk.residualRiskScore, 0);
    return Math.round(totalScore / risks.length);
}
/**
 * Determines overall risk level from score
 */
function determineOverallRiskLevel(score) {
    if (score >= 20)
        return RiskLevel.CRITICAL;
    if (score >= 15)
        return RiskLevel.HIGH;
    if (score >= 9)
        return RiskLevel.MEDIUM;
    if (score >= 4)
        return RiskLevel.LOW;
    return RiskLevel.NEGLIGIBLE;
}
// ============================================================================
// RISK IDENTIFICATION AND CATEGORIZATION
// ============================================================================
/**
 * Creates an identified risk
 *
 * @example
 * ```typescript
 * const risk = identifyRisk({
 *   riskCode: 'RISK-OPS-001',
 *   riskTitle: 'System Downtime Risk',
 *   riskDescription: 'Critical system may experience unplanned downtime',
 *   riskCategory: RiskCategory.OPERATIONAL_RISK,
 *   ownerDepartment: 'IT Operations',
 *   riskOwner: 'CIO',
 *   likelihood: LikelihoodLevel.POSSIBLE,
 *   impact: ImpactLevel.MAJOR,
 * });
 * ```
 */
function identifyRisk(params) {
    const inherentRiskScore = calculateRiskScore(params.likelihood, params.impact);
    return {
        id: crypto.randomUUID(),
        riskCode: params.riskCode,
        riskTitle: params.riskTitle,
        riskDescription: params.riskDescription,
        riskCategory: params.riskCategory,
        riskType: RiskType.INHERENT,
        identifiedDate: new Date(),
        identifiedBy: params.identifiedBy || 'System',
        ownerDepartment: params.ownerDepartment,
        riskOwner: params.riskOwner,
        likelihood: params.likelihood,
        impact: params.impact,
        inherentRiskScore,
        currentControls: [],
        residualLikelihood: params.likelihood,
        residualImpact: params.impact,
        residualRiskScore: inherentRiskScore,
        riskAppetite: RiskAppetite.MODERATE,
        riskResponse: RiskResponse.MONITOR,
        status: RiskStatus.ACTIVE,
        nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        escalated: false,
        tags: [],
        metadata: {},
    };
}
/**
 * Calculates risk score from likelihood and impact
 */
function calculateRiskScore(likelihood, impact) {
    const likelihoodValues = {
        [LikelihoodLevel.VERY_LIKELY]: 5,
        [LikelihoodLevel.LIKELY]: 4,
        [LikelihoodLevel.POSSIBLE]: 3,
        [LikelihoodLevel.UNLIKELY]: 2,
        [LikelihoodLevel.RARE]: 1,
    };
    const impactValues = {
        [ImpactLevel.CATASTROPHIC]: 5,
        [ImpactLevel.MAJOR]: 4,
        [ImpactLevel.MODERATE]: 3,
        [ImpactLevel.MINOR]: 2,
        [ImpactLevel.INSIGNIFICANT]: 1,
    };
    return likelihoodValues[likelihood] * impactValues[impact];
}
/**
 * Categorizes risk level from score
 */
function categorizeRiskLevel(score) {
    if (score >= 20)
        return RiskLevel.CRITICAL;
    if (score >= 15)
        return RiskLevel.HIGH;
    if (score >= 9)
        return RiskLevel.MEDIUM;
    if (score >= 4)
        return RiskLevel.LOW;
    return RiskLevel.NEGLIGIBLE;
}
/**
 * Updates residual risk after control implementation
 */
function updateResidualRisk(risk, residualLikelihood, residualImpact, controlsImplemented) {
    const residualRiskScore = calculateRiskScore(residualLikelihood, residualImpact);
    return {
        ...risk,
        currentControls: [...new Set([...risk.currentControls, ...controlsImplemented])],
        residualLikelihood,
        residualImpact,
        residualRiskScore,
        lastReviewDate: new Date(),
    };
}
/**
 * Escalates risk to higher management
 */
function escalateRisk(risk, reason) {
    return {
        ...risk,
        escalated: true,
        status: RiskStatus.ESCALATED,
        metadata: {
            ...risk.metadata,
            escalationReason: reason,
            escalationDate: new Date().toISOString(),
        },
    };
}
/**
 * Filters risks by category
 */
function filterRisksByCategory(risks, category) {
    return risks.filter((risk) => risk.riskCategory === category);
}
/**
 * Gets high-priority risks requiring immediate attention
 */
function getHighPriorityRisks(risks) {
    return risks.filter((risk) => risk.residualRiskScore >= 15 &&
        risk.status !== RiskStatus.CLOSED &&
        risk.status !== RiskStatus.MITIGATED);
}
// ============================================================================
// RISK MITIGATION PLANNING
// ============================================================================
/**
 * Creates a risk mitigation plan
 *
 * @example
 * ```typescript
 * const plan = createRiskMitigationPlan({
 *   riskId: 'risk-123',
 *   planName: 'Cybersecurity Enhancement Plan',
 *   objectives: ['Reduce vulnerability exposure', 'Improve detection capabilities'],
 *   targetRiskLevel: RiskLevel.LOW,
 *   targetCompletionDate: new Date('2024-12-31'),
 *   assignedTo: ['CISO', 'IT Security Manager'],
 * });
 * ```
 */
function createRiskMitigationPlan(params) {
    return {
        id: crypto.randomUUID(),
        riskId: params.riskId,
        planName: params.planName,
        objectives: params.objectives,
        strategies: [],
        targetRiskLevel: params.targetRiskLevel,
        targetCompletionDate: params.targetCompletionDate,
        budget: params.budget,
        resources: [],
        assignedTo: params.assignedTo,
        progress: 0,
        status: MitigationStatus.NOT_STARTED,
        controlsToImplement: [],
        milestones: [],
        barriers: [],
        metadata: {},
    };
}
/**
 * Adds mitigation strategy to plan
 */
function addMitigationStrategy(plan, strategy) {
    return {
        ...plan,
        strategies: [...plan.strategies, strategy],
    };
}
/**
 * Updates mitigation plan progress
 */
function updateMitigationProgress(plan, progress) {
    const status = progress === 100
        ? MitigationStatus.COMPLETED
        : progress > 0
            ? MitigationStatus.IN_PROGRESS
            : plan.status;
    return {
        ...plan,
        progress: Math.min(100, Math.max(0, progress)),
        status,
    };
}
/**
 * Calculates mitigation plan completion percentage
 */
function calculateMitigationCompletion(plan) {
    if (plan.strategies.length === 0)
        return 0;
    const completedStrategies = plan.strategies.filter((s) => s.status === 'completed').length;
    return (completedStrategies / plan.strategies.length) * 100;
}
// ============================================================================
// CONTROL FRAMEWORK IMPLEMENTATION
// ============================================================================
/**
 * Creates an internal control
 *
 * @example
 * ```typescript
 * const control = createInternalControl({
 *   controlCode: 'CTRL-FIN-001',
 *   controlName: 'Budget Approval Authorization',
 *   controlDescription: 'All budgets must be approved by authorized personnel',
 *   controlObjective: 'Ensure proper authorization of budget allocations',
 *   controlType: ControlType.PREVENTIVE,
 *   controlCategory: ControlCategory.AUTHORIZATION,
 *   controlFrequency: ControlFrequency.EVENT_DRIVEN,
 *   ownerDepartment: 'Finance',
 *   controlOwner: 'CFO',
 * });
 * ```
 */
function createInternalControl(params) {
    return {
        id: crypto.randomUUID(),
        controlCode: params.controlCode,
        controlName: params.controlName,
        controlDescription: params.controlDescription,
        controlObjective: params.controlObjective,
        controlType: params.controlType,
        controlCategory: params.controlCategory,
        controlFrequency: params.controlFrequency,
        ownerDepartment: params.ownerDepartment,
        controlOwner: params.controlOwner,
        designEffectiveness: EffectivenessRating.NOT_TESTED,
        operatingEffectiveness: EffectivenessRating.NOT_TESTED,
        automationLevel: AutomationLevel.MANUAL,
        relatedRisks: [],
        testingProcedures: [],
        nextTestDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        deficiencies: [],
        status: ControlStatus.ACTIVE,
        implementationDate: new Date(),
        cosoComponent: params.cosoComponent,
        cosoObjective: params.cosoObjective,
        metadata: {},
    };
}
/**
 * Links control to risks
 */
function linkControlToRisks(control, riskIds) {
    return {
        ...control,
        relatedRisks: [...new Set([...control.relatedRisks, ...riskIds])],
    };
}
/**
 * Updates control effectiveness rating
 */
function updateControlEffectiveness(control, designEffectiveness, operatingEffectiveness) {
    return {
        ...control,
        designEffectiveness,
        operatingEffectiveness,
    };
}
/**
 * Gets controls by COSO component
 */
function getControlsByCOSOComponent(controls, component) {
    return controls.filter((control) => control.cosoComponent === component);
}
/**
 * Validates COSO framework coverage
 */
function validateCOSOCoverage(controls) {
    const allComponents = Object.values(COSOComponent);
    const covered = [...new Set(controls.map((c) => c.cosoComponent).filter(Boolean))];
    const missing = allComponents.filter((comp) => !covered.includes(comp));
    return {
        covered,
        missing,
        coveragePercentage: (covered.length / allComponents.length) * 100,
    };
}
// ============================================================================
// INTERNAL CONTROL TESTING
// ============================================================================
/**
 * Creates a control testing record
 *
 * @example
 * ```typescript
 * const testRecord = createControlTestingRecord({
 *   controlId: 'ctrl-123',
 *   testingPeriod: 'Q1 2024',
 *   testType: TestType.OPERATING_EFFECTIVENESS,
 *   testScope: 'Full population testing',
 *   testerName: 'John Auditor',
 *   testerRole: 'Senior Internal Auditor',
 *   procedures: ['Sample selection', 'Evidence review', 'Conclusion documentation'],
 * });
 * ```
 */
function createControlTestingRecord(params) {
    return {
        id: crypto.randomUUID(),
        controlId: params.controlId,
        testingPeriod: params.testingPeriod,
        testDate: new Date(),
        testType: params.testType,
        testScope: params.testScope,
        sampleSize: params.sampleSize,
        populationSize: params.populationSize,
        testerName: params.testerName,
        testerRole: params.testerRole,
        procedures: params.procedures,
        observations: [],
        exceptions: 0,
        exceptionDetails: [],
        conclusion: TestConclusion.NO_EXCEPTIONS,
        operatingEffectiveness: EffectivenessRating.NOT_TESTED,
        recommendations: [],
        followUpRequired: false,
        metadata: {},
    };
}
/**
 * Adds test observation
 */
function addTestObservation(testRecord, observation) {
    return {
        ...testRecord,
        observations: [...testRecord.observations, observation],
    };
}
/**
 * Records test exception
 */
function recordTestException(testRecord, exception) {
    return {
        ...testRecord,
        exceptions: testRecord.exceptions + 1,
        exceptionDetails: [...(testRecord.exceptionDetails || []), exception],
    };
}
/**
 * Concludes control testing
 */
function concludeControlTesting(testRecord, conclusion, effectiveness, recommendations) {
    return {
        ...testRecord,
        conclusion,
        operatingEffectiveness: effectiveness,
        recommendations,
        followUpRequired: conclusion !== TestConclusion.NO_EXCEPTIONS,
    };
}
/**
 * Calculates control testing exception rate
 */
function calculateExceptionRate(testRecord) {
    if (!testRecord.sampleSize || testRecord.sampleSize === 0)
        return 0;
    return (testRecord.exceptions / testRecord.sampleSize) * 100;
}
// ============================================================================
// CONTROL DEFICIENCY TRACKING
// ============================================================================
/**
 * Creates a control deficiency
 *
 * @example
 * ```typescript
 * const deficiency = createControlDeficiency({
 *   controlId: 'ctrl-123',
 *   deficiencyType: DeficiencyType.OPERATING_DEFICIENCY,
 *   severity: DeficiencySeverity.SIGNIFICANT_DEFICIENCY,
 *   description: 'Control not performed consistently throughout the period',
 *   impact: 'Potential for unauthorized transactions',
 *   identifiedBy: 'Internal Audit',
 *   targetRemediationDate: new Date('2024-12-31'),
 * });
 * ```
 */
function createControlDeficiency(params) {
    return {
        id: crypto.randomUUID(),
        controlId: params.controlId,
        deficiencyType: params.deficiencyType,
        severity: params.severity,
        description: params.description,
        identifiedDate: new Date(),
        identifiedBy: params.identifiedBy,
        impact: params.impact,
        remediation: {
            planId: crypto.randomUUID(),
            description: '',
            targetDate: params.targetRemediationDate,
            assignedTo: '',
            actions: [],
            progress: 0,
        },
        status: DeficiencyStatus.OPEN,
        relatedFindings: [],
        metadata: {},
    };
}
/**
 * Updates deficiency remediation plan
 */
function updateDeficiencyRemediation(deficiency, remediation) {
    return {
        ...deficiency,
        remediation,
        status: DeficiencyStatus.IN_REMEDIATION,
    };
}
/**
 * Closes deficiency after remediation
 */
function closeDeficiency(deficiency, verifiedBy) {
    return {
        ...deficiency,
        status: DeficiencyStatus.CLOSED,
        remediation: {
            ...deficiency.remediation,
            completionDate: new Date(),
            verificationDate: new Date(),
            verifiedBy,
            progress: 100,
        },
    };
}
/**
 * Gets open deficiencies by severity
 */
function getOpenDeficienciesBySeverity(deficiencies, severity) {
    return deficiencies.filter((d) => d.severity === severity && d.status !== DeficiencyStatus.CLOSED);
}
/**
 * Gets material weaknesses requiring immediate attention
 */
function getMaterialWeaknesses(deficiencies) {
    return deficiencies.filter((d) => d.severity === DeficiencySeverity.MATERIAL_WEAKNESS &&
        d.status !== DeficiencyStatus.CLOSED);
}
// ============================================================================
// RISK REGISTER MANAGEMENT
// ============================================================================
/**
 * Creates risk register entry
 */
function createRiskRegisterEntry(risk) {
    return {
        id: crypto.randomUUID(),
        riskId: risk.id,
        registrationDate: new Date(),
        riskTitle: risk.riskTitle,
        riskCategory: risk.riskCategory,
        inherentRiskScore: risk.inherentRiskScore,
        residualRiskScore: risk.residualRiskScore,
        riskTrend: RiskTrend.NEW,
        controlsInPlace: risk.currentControls,
        riskOwner: risk.riskOwner,
        status: risk.status,
        lastUpdateDate: new Date(),
        lastReviewDate: risk.lastReviewDate,
        nextReviewDate: risk.nextReviewDate,
        escalationRequired: risk.escalated,
        boardReporting: risk.residualRiskScore >= 15,
        metadata: {},
    };
}
/**
 * Updates risk register entry trend
 */
function updateRiskTrend(entry, previousScore, currentScore) {
    let trend;
    if (currentScore > previousScore) {
        trend = RiskTrend.INCREASING;
    }
    else if (currentScore < previousScore) {
        trend = RiskTrend.DECREASING;
    }
    else {
        trend = RiskTrend.STABLE;
    }
    return {
        ...entry,
        riskTrend: trend,
        residualRiskScore: currentScore,
        lastUpdateDate: new Date(),
    };
}
/**
 * Filters risk register by category
 */
function filterRiskRegisterByCategory(entries, category) {
    return entries.filter((entry) => entry.riskCategory === category);
}
/**
 * Gets risks requiring board reporting
 */
function getBoardReportingRisks(entries) {
    return entries.filter((entry) => entry.boardReporting);
}
// ============================================================================
// RISK HEAT MAP AND SCORING
// ============================================================================
/**
 * Generates risk heat map
 *
 * @example
 * ```typescript
 * const heatMap = generateRiskHeatMap({
 *   periodCovered: 'Q1 2024',
 *   generatedBy: 'Risk Manager',
 *   risks: identifiedRisks,
 * });
 * ```
 */
function generateRiskHeatMap(params) {
    const plotPoints = params.risks.map((risk) => createRiskPlotPoint(risk));
    const riskCounts = categorizeRisksForHeatMap(plotPoints);
    return {
        id: crypto.randomUUID(),
        generatedDate: new Date(),
        generatedBy: params.generatedBy,
        periodCovered: params.periodCovered,
        riskPlotPoints: plotPoints,
        riskZones: generateRiskZones(),
        totalRisks: params.risks.length,
        criticalRisks: riskCounts.critical,
        highRisks: riskCounts.high,
        mediumRisks: riskCounts.medium,
        lowRisks: riskCounts.low,
        metadata: {},
    };
}
/**
 * Creates risk plot point for heat map
 */
function createRiskPlotPoint(risk) {
    const likelihoodScore = getLikelihoodScore(risk.residualLikelihood);
    const impactScore = getImpactScore(risk.residualImpact);
    return {
        riskId: risk.id,
        riskTitle: risk.riskTitle,
        likelihoodScore,
        impactScore,
        riskScore: risk.residualRiskScore,
        riskLevel: categorizeRiskLevel(risk.residualRiskScore),
        category: risk.riskCategory,
        owner: risk.riskOwner,
    };
}
/**
 * Gets numeric likelihood score
 */
function getLikelihoodScore(likelihood) {
    const scores = {
        [LikelihoodLevel.VERY_LIKELY]: 5,
        [LikelihoodLevel.LIKELY]: 4,
        [LikelihoodLevel.POSSIBLE]: 3,
        [LikelihoodLevel.UNLIKELY]: 2,
        [LikelihoodLevel.RARE]: 1,
    };
    return scores[likelihood];
}
/**
 * Gets numeric impact score
 */
function getImpactScore(impact) {
    const scores = {
        [ImpactLevel.CATASTROPHIC]: 5,
        [ImpactLevel.MAJOR]: 4,
        [ImpactLevel.MODERATE]: 3,
        [ImpactLevel.MINOR]: 2,
        [ImpactLevel.INSIGNIFICANT]: 1,
    };
    return scores[impact];
}
/**
 * Generates standard risk zones for heat map
 */
function generateRiskZones() {
    return [
        {
            zoneName: 'Critical Risk',
            riskLevel: RiskLevel.CRITICAL,
            color: '#8B0000',
            minLikelihood: 4,
            maxLikelihood: 5,
            minImpact: 4,
            maxImpact: 5,
            actionRequired: 'Immediate executive attention and mitigation required',
        },
        {
            zoneName: 'High Risk',
            riskLevel: RiskLevel.HIGH,
            color: '#FF4500',
            minLikelihood: 3,
            maxLikelihood: 5,
            minImpact: 3,
            maxImpact: 5,
            actionRequired: 'Senior management attention and mitigation plan required',
        },
        {
            zoneName: 'Medium Risk',
            riskLevel: RiskLevel.MEDIUM,
            color: '#FFD700',
            minLikelihood: 2,
            maxLikelihood: 4,
            minImpact: 2,
            maxImpact: 4,
            actionRequired: 'Management oversight and monitoring required',
        },
        {
            zoneName: 'Low Risk',
            riskLevel: RiskLevel.LOW,
            color: '#32CD32',
            minLikelihood: 1,
            maxLikelihood: 3,
            minImpact: 1,
            maxImpact: 3,
            actionRequired: 'Routine monitoring sufficient',
        },
    ];
}
/**
 * Categorizes risks for heat map summary
 */
function categorizeRisksForHeatMap(plotPoints) {
    return {
        critical: plotPoints.filter((p) => p.riskLevel === RiskLevel.CRITICAL).length,
        high: plotPoints.filter((p) => p.riskLevel === RiskLevel.HIGH).length,
        medium: plotPoints.filter((p) => p.riskLevel === RiskLevel.MEDIUM).length,
        low: plotPoints.filter((p) => p.riskLevel === RiskLevel.LOW).length,
    };
}
// ============================================================================
// SEGREGATION OF DUTIES VALIDATION
// ============================================================================
/**
 * Creates segregation of duties matrix
 */
function createSODMatrix(params) {
    return {
        id: crypto.randomUUID(),
        matrixName: params.matrixName,
        department: params.department,
        processArea: params.processArea,
        incompatibleFunctions: [],
        violations: [],
        lastReviewDate: new Date(),
        reviewedBy: params.reviewedBy,
        nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        status: 'compliant',
        metadata: {},
    };
}
/**
 * Adds incompatible function pair
 */
function addIncompatibleFunction(matrix, incompatibleFunction) {
    return {
        ...matrix,
        incompatibleFunctions: [...matrix.incompatibleFunctions, incompatibleFunction],
    };
}
/**
 * Records SOD violation
 */
function recordSODViolation(matrix, violation) {
    return {
        ...matrix,
        violations: [...matrix.violations, violation],
        status: 'violations_identified',
    };
}
/**
 * Validates user access against SOD matrix
 */
function validateUserSOD(matrix, userId, userName, userRoles) {
    for (const incompatible of matrix.incompatibleFunctions) {
        const conflictingRoles = userRoles.filter((role) => incompatible.functionPair.includes(role));
        if (conflictingRoles.length > 1) {
            return {
                violationId: crypto.randomUUID(),
                userId,
                userName,
                conflictingRoles,
                identifiedDate: new Date(),
                riskLevel: incompatible.riskLevel,
                status: 'open',
            };
        }
    }
    return null;
}
// ============================================================================
// AUTHORIZATION MATRIX MANAGEMENT
// ============================================================================
/**
 * Creates authorization matrix
 */
function createAuthorizationMatrix(params) {
    return {
        id: crypto.randomUUID(),
        matrixName: params.matrixName,
        processArea: params.processArea,
        department: params.department,
        authorizationLevels: [],
        effectiveDate: new Date(),
        approvedBy: params.approvedBy,
        approvalDate: new Date(),
        lastReviewDate: new Date(),
        nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        version: 1,
        status: 'active',
        metadata: {},
    };
}
/**
 * Adds authorization level
 */
function addAuthorizationLevel(matrix, level) {
    return {
        ...matrix,
        authorizationLevels: [...matrix.authorizationLevels, level],
    };
}
/**
 * Validates authorization for transaction
 */
function validateAuthorization(matrix, userRole, transactionAmount) {
    for (const level of matrix.authorizationLevels) {
        if (!level.authorizedRoles.includes(userRole)) {
            continue;
        }
        if (transactionAmount !== undefined && level.dollarThreshold !== undefined) {
            if (transactionAmount <= level.dollarThreshold) {
                return { authorized: true, level };
            }
        }
        else {
            return { authorized: true, level };
        }
    }
    return {
        authorized: false,
        reason: 'User role not authorized or amount exceeds threshold',
    };
}
// ============================================================================
// FRAUD RISK ASSESSMENT
// ============================================================================
/**
 * Creates fraud risk assessment
 */
function createFraudRiskAssessment(params) {
    return {
        id: crypto.randomUUID(),
        assessmentDate: new Date(),
        assessmentPeriod: params.assessmentPeriod,
        performedBy: params.performedBy,
        scope: params.scope,
        fraudSchemes: [],
        overallFraudRisk: RiskLevel.MEDIUM,
        fraudTriangle: {
            pressureFactors: [],
            opportunityFactors: [],
            rationalizationFactors: [],
            overallFraudRisk: RiskLevel.MEDIUM,
        },
        antifraudControls: [],
        controlGaps: [],
        recommendations: [],
        nextAssessmentDate: params.nextAssessmentDate,
        metadata: {},
    };
}
/**
 * Adds fraud scheme to assessment
 */
function addFraudScheme(assessment, scheme) {
    return {
        ...assessment,
        fraudSchemes: [...assessment.fraudSchemes, scheme],
    };
}
/**
 * Analyzes fraud triangle
 */
function analyzeFraudTriangle(pressureFactors, opportunityFactors, rationalizationFactors) {
    const totalFactors = pressureFactors.length + opportunityFactors.length + rationalizationFactors.length;
    let overallFraudRisk;
    if (totalFactors >= 9) {
        overallFraudRisk = RiskLevel.CRITICAL;
    }
    else if (totalFactors >= 6) {
        overallFraudRisk = RiskLevel.HIGH;
    }
    else if (totalFactors >= 3) {
        overallFraudRisk = RiskLevel.MEDIUM;
    }
    else {
        overallFraudRisk = RiskLevel.LOW;
    }
    return {
        pressureFactors,
        opportunityFactors,
        rationalizationFactors,
        overallFraudRisk,
    };
}
// ============================================================================
// WHISTLEBLOWER CASE MANAGEMENT
// ============================================================================
/**
 * Creates whistleblower case
 */
function createWhistleblowerCase(params) {
    return {
        id: crypto.randomUUID(),
        caseNumber: generateWhistleblowerCaseNumber(),
        receivedDate: new Date(),
        reportingChannel: params.reportingChannel,
        anonymousReport: params.anonymousReport,
        reporterContact: params.reporterContact,
        allegationType: params.allegationType,
        allegationSummary: params.allegationSummary,
        departments: params.departments,
        individualsInvolved: [],
        priority: determineCasePriority(params.allegationType),
        status: WhistleblowerStatus.RECEIVED,
        substantiated: false,
        correctiveActions: [],
        confidentialityMaintained: true,
        retaliationConcerns: false,
        metadata: {},
    };
}
/**
 * Generates unique case number
 */
function generateWhistleblowerCaseNumber() {
    const year = new Date().getFullYear();
    const random = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `WB-${year}-${random}`;
}
/**
 * Determines case priority from allegation type
 */
function determineCasePriority(allegationType) {
    const criticalTypes = [AllegationType.FRAUD, AllegationType.SAFETY_VIOLATION];
    const highTypes = [
        AllegationType.ABUSE,
        AllegationType.ETHICS_VIOLATION,
        AllegationType.REGULATORY_VIOLATION,
    ];
    if (criticalTypes.includes(allegationType))
        return 'critical';
    if (highTypes.includes(allegationType))
        return 'high';
    return 'medium';
}
/**
 * Assigns investigator to case
 */
function assignInvestigator(caseRecord, investigatorId) {
    return {
        ...caseRecord,
        assignedInvestigator: investigatorId,
        investigationStartDate: new Date(),
        status: WhistleblowerStatus.INVESTIGATION_ASSIGNED,
    };
}
/**
 * Closes whistleblower case
 */
function closeWhistleblowerCase(caseRecord, substantiated, findings) {
    const status = substantiated
        ? WhistleblowerStatus.CLOSED_SUBSTANTIATED
        : WhistleblowerStatus.CLOSED_UNSUBSTANTIATED;
    return {
        ...caseRecord,
        status,
        substantiated,
        findings,
        investigationEndDate: new Date(),
        closedDate: new Date(),
    };
}
// ============================================================================
// INTERNAL AUDIT PLANNING
// ============================================================================
/**
 * Creates internal audit plan
 */
function createInternalAuditPlan(params) {
    return {
        id: crypto.randomUUID(),
        planName: params.planName,
        fiscalYear: params.fiscalYear,
        approvedBy: params.approvedBy,
        approvalDate: new Date(),
        riskBasedApproach: params.riskBasedApproach ?? true,
        auditUniverse: [],
        plannedAudits: [],
        totalAuditHours: 0,
        status: 'draft',
        metadata: {},
    };
}
/**
 * Adds auditable entity to audit universe
 */
function addAuditableEntity(plan, entity) {
    return {
        ...plan,
        auditUniverse: [...plan.auditUniverse, entity],
    };
}
/**
 * Schedules audit based on risk
 */
function scheduleAudit(plan, audit) {
    return {
        ...plan,
        plannedAudits: [...plan.plannedAudits, audit],
        totalAuditHours: plan.totalAuditHours + audit.estimatedHours,
    };
}
/**
 * Prioritizes audit universe by risk
 */
function prioritizeAuditUniverse(entities) {
    const riskOrder = [
        RiskLevel.CRITICAL,
        RiskLevel.HIGH,
        RiskLevel.MEDIUM,
        RiskLevel.LOW,
        RiskLevel.NEGLIGIBLE,
    ];
    return [...entities].sort((a, b) => {
        const aIndex = riskOrder.indexOf(a.inherentRisk);
        const bIndex = riskOrder.indexOf(b.inherentRisk);
        return aIndex - bIndex;
    });
}
// ============================================================================
// AUDIT FINDING REMEDIATION
// ============================================================================
/**
 * Creates audit finding
 */
function createAuditFinding(params) {
    return {
        id: crypto.randomUUID(),
        findingNumber: params.findingNumber,
        auditId: params.auditId,
        findingTitle: params.findingTitle,
        condition: params.condition,
        criteria: params.criteria,
        cause: params.cause,
        effect: params.effect,
        recommendation: params.recommendation,
        severity: params.severity,
        riskRating: params.riskRating,
        status: FindingStatus.DRAFT,
        metadata: {},
    };
}
/**
 * Records management response
 */
function recordManagementResponse(finding, managementResponse, agreedUponAction, responsibleParty, targetCompletionDate) {
    return {
        ...finding,
        managementResponse,
        agreedUponAction,
        responsibleParty,
        targetCompletionDate,
        status: FindingStatus.ACTION_PLAN_APPROVED,
    };
}
/**
 * Updates finding remediation status
 */
function updateFindingStatus(finding, status) {
    return {
        ...finding,
        status,
    };
}
/**
 * Verifies finding remediation
 */
function verifyFindingRemediation(finding, verificationEvidence) {
    return {
        ...finding,
        verificationEvidence,
        actualCompletionDate: new Date(),
        status: FindingStatus.CLOSED,
    };
}
/**
 * Gets overdue audit findings
 */
function getOverdueFindings(findings, currentDate = new Date()) {
    return findings.filter((f) => f.targetCompletionDate &&
        f.targetCompletionDate < currentDate &&
        f.status !== FindingStatus.CLOSED);
}
// ============================================================================
// BUSINESS CONTINUITY AND DISASTER RECOVERY
// ============================================================================
/**
 * Creates business continuity plan
 */
function createBusinessContinuityPlan(params) {
    return {
        id: crypto.randomUUID(),
        planName: params.planName,
        department: params.department,
        planOwner: params.planOwner,
        approvedBy: params.approvedBy,
        approvalDate: new Date(),
        effectiveDate: new Date(),
        lastReviewDate: new Date(),
        nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        criticalProcesses: [],
        recoveryStrategies: [],
        resourceRequirements: [],
        communicationPlan: {
            stakeholders: [],
            communicationMethods: [],
            escalationProcedure: [],
            emergencyContacts: [],
        },
        testingSchedule: {
            frequency: 'annual',
            testTypes: ['tabletop'],
            nextScheduledTest: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
            participantsRequired: [],
        },
        status: 'active',
        metadata: {},
    };
}
/**
 * Creates disaster recovery plan
 */
function createDisasterRecoveryPlan(params) {
    return {
        id: crypto.randomUUID(),
        planName: params.planName,
        systemName: params.systemName,
        systemOwner: params.systemOwner,
        approvedBy: params.approvedBy,
        approvalDate: new Date(),
        effectiveDate: new Date(),
        rto: params.rto,
        rpo: params.rpo,
        recoveryPhases: [],
        backupStrategy: {
            backupType: 'full',
            backupFrequency: ControlFrequency.DAILY,
            backupLocation: [],
            retentionPeriod: 30,
            encryptionUsed: true,
            verificationFrequency: ControlFrequency.WEEKLY,
        },
        alternativeSites: [],
        testingResults: [],
        lastReviewDate: new Date(),
        nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        status: 'active',
        metadata: {},
    };
}
// ============================================================================
// INCIDENT RESPONSE MANAGEMENT
// ============================================================================
/**
 * Creates incident response record
 */
function createIncidentResponse(params) {
    return {
        id: crypto.randomUUID(),
        incidentNumber: generateIncidentNumber(),
        incidentDate: new Date(),
        detectedDate: new Date(),
        reportedDate: new Date(),
        reportedBy: params.reportedBy,
        incidentType: params.incidentType,
        severity: params.severity,
        affectedSystems: params.affectedSystems,
        affectedDepartments: params.affectedDepartments,
        incidentDescription: params.incidentDescription,
        initialAssessment: '',
        responseTeam: [],
        responsePhases: [],
        containmentActions: [],
        eradicationActions: [],
        recoveryActions: [],
        regulatoryNotificationRequired: params.severity === IncidentSeverity.CRITICAL,
        notificationsSent: [],
        status: IncidentStatus.REPORTED,
        metadata: {},
    };
}
/**
 * Generates unique incident number
 */
function generateIncidentNumber() {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const random = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `INC-${year}${month}-${random}`;
}
/**
 * Updates incident status
 */
function updateIncidentStatus(incident, status) {
    return {
        ...incident,
        status,
    };
}
/**
 * Closes incident
 */
function closeIncident(incident, lessonsLearned, preventativeMeasures) {
    return {
        ...incident,
        lessonsLearned,
        preventativeMeasures,
        status: IncidentStatus.CLOSED,
        resolvedDate: new Date(),
        closedDate: new Date(),
    };
}
// ============================================================================
// RISK DASHBOARD METRICS
// ============================================================================
/**
 * Generates risk dashboard metrics
 */
function generateRiskDashboardMetrics(params) {
    const risksByLevel = categorizeRisksByLevel(params.risks);
    const risksByCategory = categorizeRisksByCategory(params.risks);
    const effectiveControls = params.controls.filter((c) => c.operatingEffectiveness === EffectivenessRating.EFFECTIVE).length;
    const controlEffectivenessRate = params.controls.length > 0 ? (effectiveControls / params.controls.length) * 100 : 0;
    const openDeficiencies = params.deficiencies.filter((d) => d.status !== DeficiencyStatus.CLOSED).length;
    const materialWeaknesses = params.deficiencies.filter((d) => d.severity === DeficiencySeverity.MATERIAL_WEAKNESS &&
        d.status !== DeficiencyStatus.CLOSED).length;
    const significantDeficiencies = params.deficiencies.filter((d) => d.severity === DeficiencySeverity.SIGNIFICANT_DEFICIENCY &&
        d.status !== DeficiencyStatus.CLOSED).length;
    const openAuditFindings = params.findings.filter((f) => f.status !== FindingStatus.CLOSED).length;
    const overdueFindings = getOverdueFindings(params.findings).length;
    const topRisks = [...params.registerEntries]
        .sort((a, b) => b.residualRiskScore - a.residualRiskScore)
        .slice(0, 10);
    return {
        generatedDate: new Date(),
        period: params.period,
        totalRisks: params.risks.length,
        risksByLevel,
        risksByCategory,
        riskTrend: 'stable',
        totalControls: params.controls.length,
        effectiveControls,
        controlEffectivenessRate,
        openDeficiencies,
        materialWeaknesses,
        significantDeficiencies,
        openAuditFindings,
        overdueFindings,
        controlTestingCompletionRate: 0,
        riskAppetiteCompliance: 0,
        topRisks,
        recentIncidents: 0,
        openWhistleblowerCases: 0,
        thirdPartyRiskExposure: 0,
    };
}
/**
 * Categorizes risks by level
 */
function categorizeRisksByLevel(risks) {
    return {
        [RiskLevel.CRITICAL]: risks.filter((r) => categorizeRiskLevel(r.residualRiskScore) === RiskLevel.CRITICAL).length,
        [RiskLevel.HIGH]: risks.filter((r) => categorizeRiskLevel(r.residualRiskScore) === RiskLevel.HIGH).length,
        [RiskLevel.MEDIUM]: risks.filter((r) => categorizeRiskLevel(r.residualRiskScore) === RiskLevel.MEDIUM).length,
        [RiskLevel.LOW]: risks.filter((r) => categorizeRiskLevel(r.residualRiskScore) === RiskLevel.LOW).length,
        [RiskLevel.NEGLIGIBLE]: risks.filter((r) => categorizeRiskLevel(r.residualRiskScore) === RiskLevel.NEGLIGIBLE).length,
    };
}
/**
 * Categorizes risks by category
 */
function categorizeRisksByCategory(risks) {
    const result = {};
    Object.values(RiskCategory).forEach((category) => {
        result[category] = risks.filter((r) => r.riskCategory === category).length;
    });
    return result;
}
// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================
/**
 * Sequelize model for EnterpriseRiskAssessment
 */
exports.EnterpriseRiskAssessmentModel = {
    tableName: 'enterprise_risk_assessments',
    columns: {
        id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
        assessmentName: { type: 'STRING', allowNull: false },
        assessmentPeriod: { type: 'STRING', allowNull: false },
        fiscalYear: { type: 'INTEGER', allowNull: false },
        agencyId: { type: 'UUID', allowNull: false },
        performedBy: { type: 'STRING', allowNull: false },
        assessmentDate: { type: 'DATE', allowNull: false },
        approvedBy: { type: 'STRING', allowNull: true },
        approvalDate: { type: 'DATE', allowNull: true },
        riskFramework: { type: 'ENUM', values: Object.values(RiskFramework) },
        scope: { type: 'JSON', defaultValue: [] },
        objectives: { type: 'JSON', defaultValue: [] },
        risks: { type: 'JSON', defaultValue: [] },
        overallRiskLevel: { type: 'ENUM', values: Object.values(RiskLevel) },
        overallRiskScore: { type: 'INTEGER', defaultValue: 0 },
        executiveSummary: { type: 'TEXT', allowNull: true },
        nextReviewDate: { type: 'DATE', allowNull: false },
        status: { type: 'ENUM', values: Object.values(AssessmentStatus) },
        metadata: { type: 'JSON', defaultValue: {} },
        createdAt: { type: 'DATE', allowNull: false },
        updatedAt: { type: 'DATE', allowNull: false },
    },
    indexes: [
        { fields: ['agencyId'] },
        { fields: ['fiscalYear'] },
        { fields: ['status'] },
        { fields: ['assessmentDate'] },
    ],
};
/**
 * Sequelize model for IdentifiedRisk
 */
exports.IdentifiedRiskModel = {
    tableName: 'identified_risks',
    columns: {
        id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
        riskCode: { type: 'STRING', allowNull: false, unique: true },
        riskTitle: { type: 'STRING', allowNull: false },
        riskDescription: { type: 'TEXT', allowNull: false },
        riskCategory: { type: 'ENUM', values: Object.values(RiskCategory) },
        riskType: { type: 'ENUM', values: Object.values(RiskType) },
        identifiedDate: { type: 'DATE', allowNull: false },
        identifiedBy: { type: 'STRING', allowNull: false },
        ownerDepartment: { type: 'STRING', allowNull: false },
        riskOwner: { type: 'STRING', allowNull: false },
        likelihood: { type: 'ENUM', values: Object.values(LikelihoodLevel) },
        impact: { type: 'ENUM', values: Object.values(ImpactLevel) },
        inherentRiskScore: { type: 'INTEGER', allowNull: false },
        currentControls: { type: 'JSON', defaultValue: [] },
        residualLikelihood: { type: 'ENUM', values: Object.values(LikelihoodLevel) },
        residualImpact: { type: 'ENUM', values: Object.values(ImpactLevel) },
        residualRiskScore: { type: 'INTEGER', allowNull: false },
        riskAppetite: { type: 'ENUM', values: Object.values(RiskAppetite) },
        riskResponse: { type: 'ENUM', values: Object.values(RiskResponse) },
        status: { type: 'ENUM', values: Object.values(RiskStatus) },
        lastReviewDate: { type: 'DATE', allowNull: true },
        nextReviewDate: { type: 'DATE', allowNull: false },
        escalated: { type: 'BOOLEAN', defaultValue: false },
        tags: { type: 'JSON', defaultValue: [] },
        metadata: { type: 'JSON', defaultValue: {} },
    },
    indexes: [
        { fields: ['riskCode'] },
        { fields: ['riskCategory'] },
        { fields: ['riskOwner'] },
        { fields: ['status'] },
        { fields: ['residualRiskScore'] },
    ],
};
/**
 * Sequelize model for InternalControl
 */
exports.InternalControlModel = {
    tableName: 'internal_controls',
    columns: {
        id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
        controlCode: { type: 'STRING', allowNull: false, unique: true },
        controlName: { type: 'STRING', allowNull: false },
        controlDescription: { type: 'TEXT', allowNull: false },
        controlObjective: { type: 'TEXT', allowNull: false },
        controlType: { type: 'ENUM', values: Object.values(ControlType) },
        controlCategory: { type: 'ENUM', values: Object.values(ControlCategory) },
        controlFrequency: { type: 'ENUM', values: Object.values(ControlFrequency) },
        ownerDepartment: { type: 'STRING', allowNull: false },
        controlOwner: { type: 'STRING', allowNull: false },
        designEffectiveness: { type: 'ENUM', values: Object.values(EffectivenessRating) },
        operatingEffectiveness: { type: 'ENUM', values: Object.values(EffectivenessRating) },
        automationLevel: { type: 'ENUM', values: Object.values(AutomationLevel) },
        relatedRisks: { type: 'JSON', defaultValue: [] },
        testingProcedures: { type: 'JSON', defaultValue: [] },
        lastTestDate: { type: 'DATE', allowNull: true },
        nextTestDate: { type: 'DATE', allowNull: false },
        deficiencies: { type: 'JSON', defaultValue: [] },
        compensatingControls: { type: 'JSON', defaultValue: [] },
        status: { type: 'ENUM', values: Object.values(ControlStatus) },
        implementationDate: { type: 'DATE', allowNull: false },
        cosoComponent: { type: 'ENUM', values: Object.values(COSOComponent), allowNull: true },
        cosoObjective: { type: 'ENUM', values: Object.values(COSOObjective), allowNull: true },
        metadata: { type: 'JSON', defaultValue: {} },
    },
    indexes: [
        { fields: ['controlCode'] },
        { fields: ['controlType'] },
        { fields: ['controlOwner'] },
        { fields: ['status'] },
        { fields: ['cosoComponent'] },
    ],
};
/**
 * Sequelize model for ControlDeficiency
 */
exports.ControlDeficiencyModel = {
    tableName: 'control_deficiencies',
    columns: {
        id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
        controlId: { type: 'UUID', allowNull: false },
        deficiencyType: { type: 'ENUM', values: Object.values(DeficiencyType) },
        severity: { type: 'ENUM', values: Object.values(DeficiencySeverity) },
        description: { type: 'TEXT', allowNull: false },
        rootCause: { type: 'TEXT', allowNull: true },
        identifiedDate: { type: 'DATE', allowNull: false },
        identifiedBy: { type: 'STRING', allowNull: false },
        impact: { type: 'TEXT', allowNull: false },
        remediation: { type: 'JSON', allowNull: false },
        status: { type: 'ENUM', values: Object.values(DeficiencyStatus) },
        relatedFindings: { type: 'JSON', defaultValue: [] },
        metadata: { type: 'JSON', defaultValue: {} },
    },
    indexes: [
        { fields: ['controlId'] },
        { fields: ['severity'] },
        { fields: ['status'] },
        { fields: ['identifiedDate'] },
    ],
};
/**
 * Sequelize model for WhistleblowerCase
 */
exports.WhistleblowerCaseModel = {
    tableName: 'whistleblower_cases',
    columns: {
        id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
        caseNumber: { type: 'STRING', allowNull: false, unique: true },
        receivedDate: { type: 'DATE', allowNull: false },
        reportingChannel: { type: 'ENUM', values: Object.values(ReportingChannel) },
        anonymousReport: { type: 'BOOLEAN', defaultValue: false },
        reporterContact: { type: 'STRING', allowNull: true },
        allegationType: { type: 'ENUM', values: Object.values(AllegationType) },
        allegationSummary: { type: 'TEXT', allowNull: false },
        departments: { type: 'JSON', defaultValue: [] },
        individualsInvolved: { type: 'JSON', defaultValue: [] },
        assignedInvestigator: { type: 'STRING', allowNull: true },
        priority: { type: 'STRING', allowNull: false },
        status: { type: 'ENUM', values: Object.values(WhistleblowerStatus) },
        investigationStartDate: { type: 'DATE', allowNull: true },
        investigationEndDate: { type: 'DATE', allowNull: true },
        findings: { type: 'TEXT', allowNull: true },
        substantiated: { type: 'BOOLEAN', defaultValue: false },
        correctiveActions: { type: 'JSON', defaultValue: [] },
        confidentialityMaintained: { type: 'BOOLEAN', defaultValue: true },
        retaliationConcerns: { type: 'BOOLEAN', defaultValue: false },
        closedDate: { type: 'DATE', allowNull: true },
        metadata: { type: 'JSON', defaultValue: {} },
    },
    indexes: [
        { fields: ['caseNumber'] },
        { fields: ['status'] },
        { fields: ['priority'] },
        { fields: ['receivedDate'] },
    ],
};
/**
 * Sequelize model for IncidentResponseRecord
 */
exports.IncidentResponseRecordModel = {
    tableName: 'incident_response_records',
    columns: {
        id: { type: 'UUID', primaryKey: true, defaultValue: 'UUIDV4' },
        incidentNumber: { type: 'STRING', allowNull: false, unique: true },
        incidentDate: { type: 'DATE', allowNull: false },
        detectedDate: { type: 'DATE', allowNull: false },
        reportedDate: { type: 'DATE', allowNull: false },
        reportedBy: { type: 'STRING', allowNull: false },
        incidentType: { type: 'ENUM', values: Object.values(IncidentType) },
        severity: { type: 'ENUM', values: Object.values(IncidentSeverity) },
        affectedSystems: { type: 'JSON', defaultValue: [] },
        affectedDepartments: { type: 'JSON', defaultValue: [] },
        incidentDescription: { type: 'TEXT', allowNull: false },
        initialAssessment: { type: 'TEXT', allowNull: true },
        responseTeam: { type: 'JSON', defaultValue: [] },
        responsePhases: { type: 'JSON', defaultValue: [] },
        containmentActions: { type: 'JSON', defaultValue: [] },
        eradicationActions: { type: 'JSON', defaultValue: [] },
        recoveryActions: { type: 'JSON', defaultValue: [] },
        lessonsLearned: { type: 'JSON', defaultValue: [] },
        rootCause: { type: 'TEXT', allowNull: true },
        preventativeMeasures: { type: 'JSON', defaultValue: [] },
        estimatedCost: { type: 'DECIMAL(15,2)', allowNull: true },
        regulatoryNotificationRequired: { type: 'BOOLEAN', defaultValue: false },
        notificationsSent: { type: 'JSON', defaultValue: [] },
        status: { type: 'ENUM', values: Object.values(IncidentStatus) },
        resolvedDate: { type: 'DATE', allowNull: true },
        closedDate: { type: 'DATE', allowNull: true },
        metadata: { type: 'JSON', defaultValue: {} },
    },
    indexes: [
        { fields: ['incidentNumber'] },
        { fields: ['incidentType'] },
        { fields: ['severity'] },
        { fields: ['status'] },
        { fields: ['incidentDate'] },
    ],
};
// ============================================================================
// NESTJS SERVICE CLASS EXAMPLE
// ============================================================================
/**
 * Example NestJS service for risk management
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class RiskManagementService {
 *   constructor(
 *     @InjectModel(IdentifiedRiskModel)
 *     private riskRepo: Repository<IdentifiedRisk>,
 *     @InjectModel(InternalControlModel)
 *     private controlRepo: Repository<InternalControl>,
 *   ) {}
 *
 *   async createRisk(dto: CreateRiskDto): Promise<IdentifiedRisk> {
 *     const risk = identifyRisk(dto);
 *     return this.riskRepo.save(risk);
 *   }
 *
 *   async getRiskDashboard(period: string): Promise<RiskDashboardMetrics> {
 *     const risks = await this.riskRepo.find();
 *     const controls = await this.controlRepo.find();
 *     return generateRiskDashboardMetrics({ period, risks, controls, ... });
 *   }
 * }
 * ```
 */
exports.RiskManagementServiceExample = `
@Injectable()
export class RiskManagementService {
  constructor(
    @InjectModel(IdentifiedRiskModel)
    private riskRepo: Repository<IdentifiedRisk>,
    @InjectModel(InternalControlModel)
    private controlRepo: Repository<InternalControl>,
    @InjectModel(ControlDeficiencyModel)
    private deficiencyRepo: Repository<ControlDeficiency>,
  ) {}

  async createEnterpriseAssessment(dto: CreateAssessmentDto): Promise<EnterpriseRiskAssessment> {
    const assessment = createEnterpriseRiskAssessment(dto);
    return this.assessmentRepo.save(assessment);
  }

  async identifyRisk(dto: CreateRiskDto): Promise<IdentifiedRisk> {
    const risk = identifyRisk(dto);
    const saved = await this.riskRepo.save(risk);

    // Create risk register entry
    const registerEntry = createRiskRegisterEntry(saved);
    await this.registerRepo.save(registerEntry);

    return saved;
  }

  async generateHeatMap(period: string): Promise<RiskHeatMap> {
    const risks = await this.riskRepo.find({ where: { status: RiskStatus.ACTIVE } });
    return generateRiskHeatMap({ periodCovered: period, generatedBy: 'System', risks });
  }

  async getDashboardMetrics(period: string): Promise<RiskDashboardMetrics> {
    const risks = await this.riskRepo.find();
    const controls = await this.controlRepo.find();
    const deficiencies = await this.deficiencyRepo.find();

    return generateRiskDashboardMetrics({
      period,
      risks,
      controls,
      deficiencies,
      findings: [],
      testingRecords: [],
      registerEntries: [],
    });
  }
}
`;
// ============================================================================
// SWAGGER API SCHEMA DEFINITIONS
// ============================================================================
/**
 * Swagger DTO for creating risk
 */
exports.CreateRiskDto = {
    schema: {
        type: 'object',
        required: [
            'riskCode',
            'riskTitle',
            'riskDescription',
            'riskCategory',
            'ownerDepartment',
            'riskOwner',
            'likelihood',
            'impact',
        ],
        properties: {
            riskCode: { type: 'string', example: 'RISK-OPS-001' },
            riskTitle: { type: 'string', example: 'System Downtime Risk' },
            riskDescription: { type: 'string', example: 'Risk of unplanned system outage' },
            riskCategory: { type: 'string', enum: Object.values(RiskCategory) },
            ownerDepartment: { type: 'string', example: 'IT Operations' },
            riskOwner: { type: 'string', example: 'CIO' },
            likelihood: { type: 'string', enum: Object.values(LikelihoodLevel) },
            impact: { type: 'string', enum: Object.values(ImpactLevel) },
            identifiedBy: { type: 'string', example: 'Risk Manager' },
        },
    },
};
/**
 * Swagger DTO for creating internal control
 */
exports.CreateInternalControlDto = {
    schema: {
        type: 'object',
        required: [
            'controlCode',
            'controlName',
            'controlDescription',
            'controlObjective',
            'controlType',
            'controlCategory',
            'controlFrequency',
            'ownerDepartment',
            'controlOwner',
        ],
        properties: {
            controlCode: { type: 'string', example: 'CTRL-FIN-001' },
            controlName: { type: 'string', example: 'Budget Approval Authorization' },
            controlDescription: { type: 'string', example: 'All budgets must be approved' },
            controlObjective: { type: 'string', example: 'Ensure proper authorization' },
            controlType: { type: 'string', enum: Object.values(ControlType) },
            controlCategory: { type: 'string', enum: Object.values(ControlCategory) },
            controlFrequency: { type: 'string', enum: Object.values(ControlFrequency) },
            ownerDepartment: { type: 'string', example: 'Finance' },
            controlOwner: { type: 'string', example: 'CFO' },
            cosoComponent: { type: 'string', enum: Object.values(COSOComponent), nullable: true },
            cosoObjective: { type: 'string', enum: Object.values(COSOObjective), nullable: true },
        },
    },
};
/**
 * Swagger response schema for risk heat map
 */
exports.RiskHeatMapResponse = {
    schema: {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid' },
            generatedDate: { type: 'string', format: 'date-time' },
            generatedBy: { type: 'string', example: 'Risk Manager' },
            periodCovered: { type: 'string', example: 'Q1 2024' },
            totalRisks: { type: 'number', example: 45 },
            criticalRisks: { type: 'number', example: 3 },
            highRisks: { type: 'number', example: 12 },
            mediumRisks: { type: 'number', example: 20 },
            lowRisks: { type: 'number', example: 10 },
            riskPlotPoints: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        riskId: { type: 'string', format: 'uuid' },
                        riskTitle: { type: 'string' },
                        likelihoodScore: { type: 'number', minimum: 1, maximum: 5 },
                        impactScore: { type: 'number', minimum: 1, maximum: 5 },
                        riskScore: { type: 'number' },
                        riskLevel: { type: 'string', enum: Object.values(RiskLevel) },
                    },
                },
            },
        },
    },
};
/**
 * Swagger response schema for risk dashboard
 */
exports.RiskDashboardMetricsResponse = {
    schema: {
        type: 'object',
        properties: {
            generatedDate: { type: 'string', format: 'date-time' },
            period: { type: 'string', example: 'Q1 2024' },
            totalRisks: { type: 'number', example: 45 },
            risksByLevel: {
                type: 'object',
                properties: {
                    CRITICAL: { type: 'number', example: 3 },
                    HIGH: { type: 'number', example: 12 },
                    MEDIUM: { type: 'number', example: 20 },
                    LOW: { type: 'number', example: 10 },
                },
            },
            totalControls: { type: 'number', example: 120 },
            effectiveControls: { type: 'number', example: 105 },
            controlEffectivenessRate: { type: 'number', example: 87.5 },
            openDeficiencies: { type: 'number', example: 8 },
            materialWeaknesses: { type: 'number', example: 1 },
            significantDeficiencies: { type: 'number', example: 3 },
            openAuditFindings: { type: 'number', example: 12 },
            overdueFindings: { type: 'number', example: 2 },
        },
    },
};
//# sourceMappingURL=risk-management-internal-controls-kit.js.map