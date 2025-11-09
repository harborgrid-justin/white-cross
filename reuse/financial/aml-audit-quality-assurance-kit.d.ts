/**
 * AML Audit Quality Assurance Kit
 *
 * Enterprise-grade Anti-Money Laundering (AML) audit management system with
 * comprehensive audit planning, execution, and quality assurance capabilities.
 *
 * Features:
 * - Strategic audit planning and risk-based scheduling
 * - Scope definition and documentation
 * - Statistical sampling methodologies
 * - Comprehensive testing procedures
 * - Detailed finding documentation and classification
 * - Root cause analysis frameworks
 * - Corrective action tracking and remediation
 * - Validation testing and control effectiveness
 * - Professional audit report generation
 * - Quality review and peer verification
 * - Regulatory examination preparation
 * - Independent testing coordination
 * - Control effectiveness assessment
 * - Issue remediation tracking
 * - Follow-up procedures and closure
 * - Audit metrics and KPI calculation
 * - Trend analysis and pattern detection
 * - Best practice benchmarking
 *
 * @module aml-audit-quality-assurance-kit
 */
/**
 * Audit score type (0-100 scale)
 */
export type AuditScore = number & {
    readonly __brand: 'AuditScore';
};
/**
 * Audit severity rating
 */
export type AuditSeverity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Observation';
/**
 * Control effectiveness rating
 */
export type ControlEffectiveness = 'Effective' | 'Effective with Deficiency' | 'Ineffective';
/**
 * Audit status enumeration
 */
export declare enum AuditStatus {
    Planned = "PLANNED",
    InProgress = "IN_PROGRESS",
    Testing = "TESTING",
    ClosingProcedures = "CLOSING_PROCEDURES",
    DraftReport = "DRAFT_REPORT",
    QualityReview = "QUALITY_REVIEW",
    RegulatoryReview = "REGULATORY_REVIEW",
    Closed = "CLOSED",
    Deferred = "DEFERRED"
}
/**
 * Finding classification types
 */
export declare enum FindingType {
    ControlDeficiency = "CONTROL_DEFICIENCY",
    ComplianceViolation = "COMPLIANCE_VIOLATION",
    OperationalIssue = "OPERATIONAL_ISSUE",
    ProcessGap = "PROCESS_GAP",
    DocumentationDeficiency = "DOCUMENTATION_DEFICIENCY",
    SystemsIssue = "SYSTEMS_ISSUE",
    TrainingGap = "TRAINING_GAP",
    Observation = "OBSERVATION"
}
/**
 * Sampling method types
 */
export declare enum SamplingMethod {
    StatisticalRandom = "STATISTICAL_RANDOM",
    StratifiedRandom = "STRATIFIED_RANDOM",
    SystematicSampling = "SYSTEMATIC_SAMPLING",
    RiskBasedSelection = "RISK_BASED_SELECTION",
    HighValueItems = "HIGH_VALUE_ITEMS",
    HoneyPot = "HONEY_POT",
    Judgmental = "JUDGMENTAL"
}
/**
 * Audit plan interface
 */
export interface AuditPlan {
    auditId: string;
    auditName: string;
    auditType: 'Annual' | 'Special' | 'Regulatory' | 'Follow-up' | 'Targeted';
    fiscalYear: number;
    status: AuditStatus;
    scope: string[];
    riskRating: 'High' | 'Medium' | 'Low';
    estimatedDays: number;
    actualDays?: number;
    startDate: Date;
    plannedEndDate: Date;
    actualEndDate?: Date;
    auditTeam: string[];
    leadAuditor: string;
    objectives: string[];
    riskAreas: string[];
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Audit scope definition
 */
export interface AuditScope {
    scopeId: string;
    auditId: string;
    scopeArea: string;
    description: string;
    riskRating: number;
    includedProcesses: string[];
    excludedProcesses: string[];
    populationSize?: number;
    sampleSize?: number;
    controlsToTest: string[];
    testingStrategy: string;
    estimatedHours: number;
    status: 'Defined' | 'Approved' | 'InExecution' | 'Completed';
    approvedBy?: string;
    approvalDate?: Date;
}
/**
 * Sampling information
 */
export interface SamplingPlan {
    samplingId: string;
    scopeId: string;
    auditId: string;
    populationCount: number;
    desiredConfidenceLevel: number;
    acceptableErrorRate: number;
    calculatedSampleSize: number;
    samplingMethod: SamplingMethod;
    stratificationFields?: string[];
    selectionCriteria: string[];
    itemsSelected: string[];
    itemsTested: string[];
    testingCompletionDate?: Date;
    exceptionsFound: number;
    exceptionRate: number;
}
/**
 * Audit finding
 */
export interface AuditFinding {
    findingId: string;
    auditId: string;
    scopeId: string;
    title: string;
    description: string;
    findingType: FindingType;
    severity: AuditSeverity;
    location: string;
    dateIdentified: Date;
    rootCauseAnalysis?: string;
    businessImpact: string;
    recommendedAction: string;
    affectedControls: string[];
    relatedRegulations: string[];
    status: 'Open' | 'Under Remediation' | 'Remediated' | 'Closed';
    assignedTo?: string;
    dueDate?: Date;
    reviewedBy?: string;
    reviewDate?: Date;
}
/**
 * Corrective action
 */
export interface CorrectiveAction {
    actionId: string;
    findingId: string;
    auditId: string;
    description: string;
    owner: string;
    dueDate: Date;
    priority: 'Critical' | 'High' | 'Medium' | 'Low';
    status: 'Open' | 'InProgress' | 'Completed' | 'Verified' | 'Closed';
    targetCompletionDate: Date;
    actualCompletionDate?: Date;
    implementationDetails?: string;
    verifiedBy?: string;
    verificationDate?: Date;
    preventiveMeasures?: string[];
}
/**
 * Test procedures result
 */
export interface TestResult {
    testId: string;
    auditId: string;
    scopeId: string;
    controlId: string;
    testDescription: string;
    expectedResult: string;
    actualResult: string;
    testDate: Date;
    testedBy: string;
    passed: boolean;
    exceptions: string[];
    evidenceId?: string;
    reviewedBy?: string;
    reviewDate?: Date;
}
/**
 * Audit report
 */
export interface AuditReport {
    reportId: string;
    auditId: string;
    reportDate: Date;
    reportingPeriod: string;
    executiveSummary: string;
    totalFindingsCount: number;
    criticalFindingsCount: number;
    highFindingsCount: number;
    overallAuditScore: AuditScore;
    auditConclusion: string;
    findings: AuditFinding[];
    recommendedActions: string[];
    managementResponses?: Map<string, string>;
    approvedBy: string;
    approvalDate: Date;
    distributionList: string[];
}
/**
 * Quality review
 */
export interface QualityReview {
    reviewId: string;
    auditId: string;
    reportId?: string;
    reviewType: 'Supervisory' | 'Peer' | 'Final' | 'Regulatory';
    reviewedBy: string;
    reviewDate: Date;
    completeness: number;
    technicalAccuracy: number;
    evidenceSufficiency: number;
    conclusionSupport: number;
    overallScore: number;
    comments: string;
    exceptions: string[];
    status: 'Approved' | 'Approved with Comments' | 'Needs Revision' | 'Rejected';
    requiresRework: boolean;
    reworkItems?: string[];
}
/**
 * Control effectiveness assessment
 */
export interface ControlEffectivenessAssessment {
    assessmentId: string;
    auditId: string;
    controlId: string;
    controlName: string;
    controlObjective: string;
    designEffectiveness: ControlEffectiveness;
    operationalEffectiveness: ControlEffectiveness;
    overallEffectiveness: ControlEffectiveness;
    testingEvidence: string[];
    testingCoverage: number;
    deviationsFound: number;
    deviationRate: number;
    assessmentDate: Date;
    reviewedBy: string;
    recommendations: string[];
}
/**
 * Audit metric
 */
export interface AuditMetric {
    metricId: string;
    auditId: string;
    metricType: string;
    metricName: string;
    metricValue: number;
    unit: string;
    targetValue?: number;
    variance?: number;
    trend?: 'Improving' | 'Stable' | 'Deteriorating';
    periodCovered: string;
    dataSource: string;
    calculatedDate: Date;
}
/**
 * Trend analysis result
 */
export interface TrendAnalysis {
    trendId: string;
    analysisType: string;
    period: string;
    dataPoints: Array<{
        year: number;
        value: number;
        count?: number;
    }>;
    trend: 'Improving' | 'Stable' | 'Deteriorating' | 'Volatile';
    changePercentage: number;
    significanceLevel: number;
    observations: string;
    recommendations: string[];
    analysisDate: Date;
    analyzedBy: string;
}
/**
 * Create valid audit score from number
 * @param score - Numeric score 0-100
 * @returns AuditScore branded type
 * @throws Error if score is invalid
 */
export declare function createAuditScore(score: number): AuditScore;
/**
 * Calculate audit score from multiple component scores
 * @param components - Map of component name to score
 * @param weights - Optional weights for each component
 * @returns Weighted audit score
 */
export declare function calculateCompositeAuditScore(components: Map<string, number>, weights?: Map<string, number>): AuditScore;
/**
 * Validate audit finding data
 * @param finding - Partial finding to validate
 * @returns Validation result with errors
 */
export declare function validateAuditFinding(finding: Partial<AuditFinding>): {
    valid: boolean;
    errors: string[];
};
/**
 * Map severity level to numeric value
 * @param severity - AuditSeverity value
 * @returns Numeric severity (5=Critical, 1=Observation)
 */
export declare function severityToNumeric(severity: AuditSeverity): number;
/**
 * Calculate statistical sample size
 * @param populationSize - Total population
 * @param confidenceLevel - Desired confidence (e.g., 95)
 * @param marginOfError - Acceptable error rate (e.g., 5)
 * @returns Calculated sample size
 */
export declare function calculateSampleSize(populationSize: number, confidenceLevel: number, marginOfError: number): number;
/**
 * Create annual audit plan based on risk assessment
 * @param fiscalYear - Fiscal year for plan
 * @param riskAreas - High-risk areas identified
 * @param auditBudget - Total audit budget in days
 * @returns Complete annual audit plan
 */
export declare function createAnnualAuditPlan(fiscalYear: number, riskAreas: string[], auditBudget: number): AuditPlan;
/**
 * Assign audit team members to audit plan
 * @param auditId - Audit ID
 * @param teamMembers - Array of team member names/IDs
 * @param leadAuditor - Lead auditor assignment
 * @param auditPlan - Existing audit plan to update
 * @returns Updated audit plan with team assignments
 */
export declare function assignAuditTeam(auditId: string, teamMembers: string[], leadAuditor: string, auditPlan: AuditPlan): AuditPlan;
/**
 * Calculate audit resource requirements
 * @param scopeAreas - Number of scope areas
 * @param estimatedDays - Total days available
 * @param specializations - Required skill sets
 * @returns Resource allocation plan
 */
export declare function calculateResourceRequirements(scopeAreas: number, estimatedDays: number, specializations: string[]): {
    resourceNeeds: Map<string, number>;
    totalHeadcount: number;
};
/**
 * Schedule audit execution phases
 * @param auditPlan - Audit plan with dates
 * @param numPhases - Number of phases to create
 * @returns Array of phase definitions with dates
 */
export declare function scheduleAuditPhases(auditPlan: AuditPlan, numPhases: number): Array<{
    phase: number;
    name: string;
    startDate: Date;
    endDate: Date;
    activities: string[];
}>;
/**
 * Define audit scope area with risk assessment
 * @param auditId - Associated audit ID
 * @param scopeArea - Process/area to audit
 * @param description - Detailed scope description
 * @param riskRating - Inherent risk 0-100
 * @returns Defined audit scope
 */
export declare function defineAuditScope(auditId: string, scopeArea: string, description: string, riskRating: number): AuditScope;
/**
 * Add controls to be tested in scope
 * @param scope - Scope to update
 * @param controls - Array of control IDs/names
 * @returns Updated scope with controls
 */
export declare function addScopeControls(scope: AuditScope, controls: string[]): AuditScope;
/**
 * Approve audit scope definition
 * @param scope - Scope to approve
 * @param approver - Approver name/ID
 * @returns Approved scope
 * @throws Error if scope incomplete
 */
export declare function approveAuditScope(scope: AuditScope, approver: string): AuditScope;
/**
 * Design statistical sampling plan for scope
 * @param scopeId - Scope being tested
 * @param populationCount - Total items in population
 * @param confidenceLevel - Desired confidence percentage
 * @param acceptableErrorRate - Acceptable error percentage
 * @param method - Sampling method to use
 * @returns Sampling plan with calculated sample size
 */
export declare function designSamplingPlan(scopeId: string, populationCount: number, confidenceLevel: number, acceptableErrorRate: number, method: SamplingMethod): SamplingPlan;
/**
 * Select sample items using stratified random sampling
 * @param samplingPlan - Sampling plan
 * @param strata - Map of stratum to item population
 * @returns Updated plan with selected items
 */
export declare function selectStratifiedSample(samplingPlan: SamplingPlan, strata: Map<string, string[]>): SamplingPlan;
/**
 * Calculate exception rate and extrapolate findings
 * @param samplingPlan - Completed sampling plan
 * @param exceptionsFound - Number of exceptions in sample
 * @returns Updated plan with exception analysis
 */
export declare function analyzeExceptionRate(samplingPlan: SamplingPlan, exceptionsFound: number): SamplingPlan;
/**
 * Create standardized test procedure
 * @param controlId - Control being tested
 * @param testDescription - What the test validates
 * @param testSteps - Steps to execute test
 * @param expectedResult - Expected successful result
 * @param evidenceRequirements - What evidence is needed
 * @returns Test procedure definition
 */
export declare function createTestProcedure(controlId: string, testDescription: string, testSteps: string[], expectedResult: string, evidenceRequirements: string[]): {
    procedureId: string;
    controlId: string;
    description: string;
    steps: string[];
    expectedResult: string;
    evidenceNeeded: string[];
    createdDate: Date;
};
/**
 * Execute test procedure and record results
 * @param testId - Test procedure ID
 * @param actualResult - Observed result of test
 * @param passed - Whether test passed
 * @param exceptions - Any exceptions found
 * @param testedBy - Who performed test
 * @returns Test result record
 */
export declare function recordTestResult(testId: string, actualResult: string, passed: boolean, exceptions: string[], testedBy: string): TestResult;
/**
 * Perform control walkthrough testing
 * @param controlId - Control to walkthrough
 * @param businessProcess - Process the control operates in
 * @param sampleSize - Number of transactions to review
 * @returns Walkthrough findings
 */
export declare function performControlWalkthrough(controlId: string, businessProcess: string, sampleSize: number): {
    walkthroughId: string;
    controlId: string;
    processUnderstanding: string[];
    transactionsReviewed: number;
    controlPointsValidated: string[];
    deviationsFound: string[];
    overallAssessment: 'Effective' | 'Effective with Gaps' | 'Ineffective';
};
/**
 * Validate test evidence completeness
 * @param testResult - Test result to validate
 * @param requiredEvidence - Required evidence types
 * @returns Evidence validation result
 */
export declare function validateTestEvidence(testResult: TestResult, requiredEvidence: string[]): {
    complete: boolean;
    missingEvidence: string[];
    sufficientForConclusion: boolean;
};
/**
 * Document audit finding with all required details
 * @param auditId - Associated audit
 * @param title - Finding title
 * @param description - Detailed description
 * @param severity - Severity classification
 * @param findingType - Type of finding
 * @param businessImpact - Impact description
 * @returns Documented finding
 */
export declare function documentAuditFinding(auditId: string, title: string, description: string, severity: AuditSeverity, findingType: FindingType, businessImpact: string): AuditFinding;
/**
 * Classify finding severity and type
 * @param description - Finding description
 * @param impactArea - Area affected
 * @param controlsAffected - Number of controls impacted
 * @returns Recommended severity and type
 */
export declare function classifyFinding(description: string, impactArea: string, controlsAffected: number): {
    recommendedSeverity: AuditSeverity;
    recommendedType: FindingType;
    justification: string;
};
/**
 * Add root cause analysis to finding
 * @param finding - Finding to update
 * @param rootCause - Root cause description
 * @param contributingFactors - Additional factors
 * @returns Finding with RCA
 */
export declare function addRootCauseAnalysis(finding: AuditFinding, rootCause: string, contributingFactors: string[]): AuditFinding;
/**
 * Perform formal root cause analysis (5-Why method)
 * @param problemStatement - Initial issue identified
 * @returns Five-why analysis results
 */
export declare function performFiveWhyAnalysis(problemStatement: string): {
    level: number;
    question: string;
    answer: string;
}[];
/**
 * Analyze process inefficiencies to identify root causes
 * @param processName - Process being analyzed
 * @param inefficiencies - Observed issues
 * @param businessContext - Context information
 * @returns Root cause analysis report
 */
export declare function analyzeProcessInefficiencies(processName: string, inefficiencies: string[], businessContext: string): {
    process: string;
    issues: string[];
    potentialRootCauses: string[];
    controlGaps: string[];
    severity: AuditSeverity;
    recommendations: string[];
};
/**
 * Link findings to systemic issues
 * @param findings - Array of findings
 * @param auditId - Associated audit
 * @returns Grouped systemic issues
 */
export declare function identifySystemicIssues(findings: AuditFinding[], auditId: string): {
    systemicIssueId: string;
    relatedFindings: string[];
    commonRootCause: string;
    severity: AuditSeverity;
    affectedProcesses: string[];
    priority: number;
};
/**
 * Create corrective action plan for finding
 * @param findingId - Associated finding
 * @param description - Corrective action description
 * @param owner - Responsible party
 * @param dueDate - Target completion date
 * @param priority - Action priority
 * @returns Corrective action plan
 */
export declare function createCorrectiveAction(findingId: string, description: string, owner: string, dueDate: Date, priority: 'Critical' | 'High' | 'Medium' | 'Low'): CorrectiveAction;
/**
 * Track corrective action progress
 * @param action - Action to update
 * @param status - Current status
 * @param progressNotes - Implementation notes
 * @returns Updated action
 */
export declare function updateActionProgress(action: CorrectiveAction, status: 'Open' | 'InProgress' | 'Completed' | 'Verified' | 'Closed', progressNotes: string): CorrectiveAction;
/**
 * Verify corrective action implementation
 * @param action - Action to verify
 * @param verifier - Person verifying
 * @param verificationEvidence - Supporting evidence
 * @returns Verification result
 */
export declare function verifyCorrectiveAction(action: CorrectiveAction, verifier: string, verificationEvidence: string[]): {
    actionId: string;
    verified: boolean;
    verifiedBy: string;
    verificationDate: Date;
    evidenceFiles: string[];
    effectiveness: 'Effective' | 'Partially Effective' | 'Ineffective';
};
/**
 * Design validation test for remediated control
 * @param controlId - Control being validated
 * @param originalFinding - Related finding
 * @param testSize - Sample size for validation
 * @returns Validation test plan
 */
export declare function designValidationTest(controlId: string, originalFinding: AuditFinding, testSize: number): {
    validationTestId: string;
    controlId: string;
    relatedFinding: string;
    testPeriod: Date;
    sampleSize: number;
    testProcedures: string[];
    expectedResults: string;
};
/**
 * Execute validation testing on remediated control
 * @param validationTestId - Validation test ID
 * @param sampledItems - Items tested
 * @param exceptionsFound - Exceptions in sample
 * @returns Validation results
 */
export declare function executeValidationTest(validationTestId: string, sampledItems: number, exceptionsFound: number): {
    testId: string;
    itemsTested: number;
    exceptionsFound: number;
    exceptionRate: number;
    controlOperating: boolean;
    conclusions: string;
    testDate: Date;
};
/**
 * Assess control operating effectiveness
 * @param controlId - Control to assess
 * @param testResults - Array of test results
 * @param designTests - Design effectiveness results
 * @returns Overall effectiveness assessment
 */
export declare function assessControlEffectiveness(controlId: string, testResults: TestResult[], designTests: {
    effective: boolean;
}[]): {
    controlId: string;
    assessmentDate: Date;
    designEffectiveness: ControlEffectiveness;
    operationalEffectiveness: ControlEffectiveness;
    overallEffectiveness: ControlEffectiveness;
    testCoverage: number;
    supportingEvidence: string[];
};
/**
 * Generate draft audit report
 * @param auditId - Completed audit
 * @param findings - Identified findings
 * @param auditScore - Overall audit score
 * @param executiveSummary - Key conclusions
 * @returns Draft audit report
 */
export declare function generateDraftAuditReport(auditId: string, findings: AuditFinding[], auditScore: AuditScore, executiveSummary: string): AuditReport;
/**
 * Add management responses to audit report
 * @param report - Draft report
 * @param responses - Management response map
 * @returns Report with management responses
 */
export declare function addManagementResponses(report: AuditReport, responses: Map<string, string>): AuditReport;
/**
 * Finalize and format audit report for distribution
 * @param report - Completed report
 * @param approver - Final approver
 * @param distributionList - Distribution recipients
 * @returns Final audit report
 */
export declare function finalizeAuditReport(report: AuditReport, approver: string, distributionList: string[]): AuditReport;
/**
 * Perform supervisory quality review of audit work
 * @param auditId - Audit being reviewed
 * @param reviewer - Reviewing supervisor
 * @param workPaperSamples - Sample of work papers reviewed
 * @returns Quality review results
 */
export declare function performSupervisoryReview(auditId: string, reviewer: string, workPaperSamples: string[]): QualityReview;
/**
 * Perform peer review of audit findings and conclusions
 * @param auditId - Audit being reviewed
 * @param peerReviewer - Independent peer reviewer
 * @param findings - Findings being reviewed
 * @returns Peer review assessment
 */
export declare function performPeerReview(auditId: string, peerReviewer: string, findings: AuditFinding[]): QualityReview;
/**
 * Conduct final quality assurance review before report release
 * @param report - Audit report to review
 * @param qaReviewer - QA reviewer
 * @returns Final QA review
 */
export declare function conductFinalQAReview(report: AuditReport, qaReviewer: string): QualityReview;
/**
 * Prepare audit documentation package for regulatory examination
 * @param auditId - Audit to prepare
 * @param workPapersPath - Path to work papers
 * @param findings - Audit findings
 * @returns Regulatory examination package
 */
export declare function prepareRegulatoryExaminationPackage(auditId: string, workPapersPath: string, findings: AuditFinding[]): {
    packageId: string;
    auditId: string;
    preparationDate: Date;
    workPaperIndex: string[];
    findingsSummary: {
        total: number;
        critical: number;
        high: number;
        medium: number;
        low: number;
    };
    documentationStatus: 'Complete' | 'Incomplete' | 'Needs Revision';
    readyForExamination: boolean;
};
/**
 * Create response document to regulatory examination findings
 * @param examinationFindings - Findings from examiner
 * @param managementResponses - Management responses to each finding
 * @returns Response submission document
 */
export declare function createRegulatoryResponseDocument(examinationFindings: string[], managementResponses: Map<string, string>): {
    responseId: string;
    submissionDate: Date;
    findingsAddressed: number;
    responsesProvided: number;
    correctiveActionsProposed: number;
    completenessPercentage: number;
};
/**
 * Coordinate independent testing by external auditors
 * @param auditId - Associated audit
 * @param auditorFirm - External auditor firm
 * @param scopeAreas - Areas for independent testing
 * @returns Independent testing engagement
 */
export declare function coordinateIndependentTesting(auditId: string, auditorFirm: string, scopeAreas: string[]): {
    engagementId: string;
    auditId: string;
    auditorFirm: string;
    engagementDate: Date;
    expectedCompletionDate: Date;
    scopeAreas: string[];
    status: 'Initiated' | 'In Progress' | 'Completed';
    findings: AuditFinding[];
};
/**
 * Validate independent testing results against internal audit findings
 * @param internalFindings - Internal audit findings
 * @param externalFindings - External auditor findings
 * @returns Comparison and validation results
 */
export declare function validateIndependentTestingResults(internalFindings: AuditFinding[], externalFindings: AuditFinding[]): {
    consistencyPercentage: number;
    matchedFindings: number;
    uniqueInternalFindings: AuditFinding[];
    uniqueExternalFindings: AuditFinding[];
    discrepancyAnalysis: string;
};
/**
 * Perform comprehensive control effectiveness assessment
 * @param controlId - Control being assessed
 * @param designTests - Design effectiveness test results
 * @param operationalTests - Operational effectiveness test results
 * @returns Control effectiveness assessment
 */
export declare function performControlEffectivenessAssessment(controlId: string, designTests: {
    passed: boolean;
}[], operationalTests: {
    passed: boolean;
}[]): ControlEffectivenessAssessment;
/**
 * Create control deficiency remediation plan
 * @param assessment - Control effectiveness assessment
 * @param deficiencyDescription - Description of deficiency
 * @returns Remediation plan
 */
export declare function createControlRemediationPlan(assessment: ControlEffectivenessAssessment, deficiencyDescription: string): {
    remediationId: string;
    controlId: string;
    deficiency: string;
    rootCause: string;
    remediationSteps: string[];
    ownerAssignedDate: Date;
    targetCompletionDate: Date;
    estimatedCost: number;
};
/**
 * Calculate key audit metrics for audit portfolio
 * @param auditId - Audit for metrics
 * @param findings - Audit findings
 * @param actualDays - Days spent on audit
 * @param budgetedDays - Days budgeted
 * @returns Audit metrics
 */
export declare function calculateAuditMetrics(auditId: string, findings: AuditFinding[], actualDays: number, budgetedDays: number): AuditMetric[];
/**
 * Aggregate audit metrics across portfolio
 * @param auditMetrics - Array of metric collections
 * @returns Portfolio-level metrics
 */
export declare function aggregatePortfolioMetrics(auditMetrics: AuditMetric[][]): {
    totalAudits: number;
    totalFindings: number;
    averageFindingRate: number;
    criticalFindingsTotal: number;
    budgetVariance: number;
    scheduleVariance: number;
    qualityScore: AuditScore;
};
/**
 * Perform trend analysis on audit findings over multiple years
 * @param historicalFindings - Findings from prior audits
 * @param currentFindings - Current audit findings
 * @returns Trend analysis
 */
export declare function analyzeFindingsTrend(historicalFindings: Map<number, AuditFinding[]>, currentFindings: AuditFinding[]): TrendAnalysis;
/**
 * Analyze control remediation effectiveness trends
 * @param remediatedControls - Controls remediated in prior periods
 * @param currentAudit - Current audit period
 * @returns Remediation effectiveness trend
 */
export declare function analyzeRemediationTrend(remediatedControls: Array<{
    controlId: string;
    remediationDate: Date;
    reTestedDate: Date;
    effective: boolean;
}>, currentAudit: string): {
    trendAnalysis: TrendAnalysis;
    firstTimeFixRate: number;
    recurrenceRate: number;
    recommendations: string[];
};
/**
 * Compare audit metrics against industry benchmarks
 * @param internalMetrics - Organization's audit metrics
 * @param industryBenchmarks - Industry benchmark data
 * @returns Benchmarking analysis
 */
export declare function benchmarkAgainstIndustry(internalMetrics: {
    findingRate: number;
    criticalFindingPercentage: number;
    budgetUtilization: number;
}, industryBenchmarks: {
    findingRate: number;
    criticalFindingPercentage: number;
    budgetUtilization: number;
}): {
    metricComparisons: Array<{
        metric: string;
        internal: number;
        benchmark: number;
        variance: number;
        performanceLevel: 'Exceeds' | 'Meets' | 'Below' | 'Significantly Below';
    }>;
    overallPerformance: 'Superior' | 'Comparable' | 'Needs Improvement';
    recommendations: string[];
};
/**
 * Develop audit process improvement plan based on best practices
 * @param currentProcesses - Current audit processes
 * @param bestPractices - Industry best practices
 * @returns Process improvement roadmap
 */
export declare function developAuditProcessImprovements(currentProcesses: string[], bestPractices: string[]): {
    improvementId: string;
    gapAnalysis: Array<{
        process: string;
        currentState: string;
        bestPracticeState: string;
        gap: string;
        priority: 'Critical' | 'High' | 'Medium' | 'Low';
    }>;
    implementationRoadmap: Array<{
        phase: number;
        improvements: string[];
        timeline: string;
        resources: string[];
    }>;
    expectedBenefits: string[];
};
/**
 * Execute follow-up audit procedures for prior findings
 * @param priorFindings - Findings from previous audits
 * @param auditId - Current audit ID
 * @returns Follow-up procedures results
 */
export declare function executeFollowUpProcedures(priorFindings: AuditFinding[], auditId: string): {
    followUpId: string;
    auditId: string;
    findingsReviewed: number;
    findingsRemediateFully: number;
    findingsPartiallyRemediated: number;
    findingsNotRemediated: number;
    newIssuesIdentified: AuditFinding[];
    remediationRate: number;
};
/**
 * Track remediation milestone achievements
 * @param actionId - Corrective action ID
 * @param milestone - Milestone description
 * @param completionDate - Actual completion date
 * @returns Milestone tracking record
 */
export declare function trackRemediationMilestone(actionId: string, milestone: string, completionDate: Date): {
    milestoneId: string;
    actionId: string;
    description: string;
    plannedDate: Date;
    actualDate: Date;
    onTime: boolean;
    evidence: string[];
};
/**
 * Generate remediation status summary
 * @param actions - Corrective actions
 * @returns Summary of remediation progress
 */
export declare function generateRemediationSummary(actions: CorrectiveAction[]): {
    totalActions: number;
    openActions: number;
    inProgressActions: number;
    completedActions: number;
    verifiedActions: number;
    closedActions: number;
    overdueActions: number;
    averageImplementationDays: number;
};
declare const _default: {
    createAuditScore: typeof createAuditScore;
    calculateCompositeAuditScore: typeof calculateCompositeAuditScore;
    validateAuditFinding: typeof validateAuditFinding;
    severityToNumeric: typeof severityToNumeric;
    calculateSampleSize: typeof calculateSampleSize;
    createAnnualAuditPlan: typeof createAnnualAuditPlan;
    assignAuditTeam: typeof assignAuditTeam;
    calculateResourceRequirements: typeof calculateResourceRequirements;
    scheduleAuditPhases: typeof scheduleAuditPhases;
    defineAuditScope: typeof defineAuditScope;
    addScopeControls: typeof addScopeControls;
    approveAuditScope: typeof approveAuditScope;
    designSamplingPlan: typeof designSamplingPlan;
    selectStratifiedSample: typeof selectStratifiedSample;
    analyzeExceptionRate: typeof analyzeExceptionRate;
    createTestProcedure: typeof createTestProcedure;
    recordTestResult: typeof recordTestResult;
    performControlWalkthrough: typeof performControlWalkthrough;
    validateTestEvidence: typeof validateTestEvidence;
    documentAuditFinding: typeof documentAuditFinding;
    classifyFinding: typeof classifyFinding;
    addRootCauseAnalysis: typeof addRootCauseAnalysis;
    performFiveWhyAnalysis: typeof performFiveWhyAnalysis;
    analyzeProcessInefficiencies: typeof analyzeProcessInefficiencies;
    identifySystemicIssues: typeof identifySystemicIssues;
    createCorrectiveAction: typeof createCorrectiveAction;
    updateActionProgress: typeof updateActionProgress;
    verifyCorrectiveAction: typeof verifyCorrectiveAction;
    designValidationTest: typeof designValidationTest;
    executeValidationTest: typeof executeValidationTest;
    assessControlEffectiveness: typeof assessControlEffectiveness;
    generateDraftAuditReport: typeof generateDraftAuditReport;
    addManagementResponses: typeof addManagementResponses;
    finalizeAuditReport: typeof finalizeAuditReport;
    performSupervisoryReview: typeof performSupervisoryReview;
    performPeerReview: typeof performPeerReview;
    conductFinalQAReview: typeof conductFinalQAReview;
    prepareRegulatoryExaminationPackage: typeof prepareRegulatoryExaminationPackage;
    createRegulatoryResponseDocument: typeof createRegulatoryResponseDocument;
    coordinateIndependentTesting: typeof coordinateIndependentTesting;
    validateIndependentTestingResults: typeof validateIndependentTestingResults;
    performControlEffectivenessAssessment: typeof performControlEffectivenessAssessment;
    createControlRemediationPlan: typeof createControlRemediationPlan;
    calculateAuditMetrics: typeof calculateAuditMetrics;
    aggregatePortfolioMetrics: typeof aggregatePortfolioMetrics;
    analyzeFindingsTrend: typeof analyzeFindingsTrend;
    analyzeRemediationTrend: typeof analyzeRemediationTrend;
    benchmarkAgainstIndustry: typeof benchmarkAgainstIndustry;
    developAuditProcessImprovements: typeof developAuditProcessImprovements;
    executeFollowUpProcedures: typeof executeFollowUpProcedures;
    trackRemediationMilestone: typeof trackRemediationMilestone;
    generateRemediationSummary: typeof generateRemediationSummary;
};
export default _default;
//# sourceMappingURL=aml-audit-quality-assurance-kit.d.ts.map