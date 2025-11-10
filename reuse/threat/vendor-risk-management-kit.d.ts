/**
 * LOC: VNDRISK7890123
 * File: /reuse/threat/vendor-risk-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS vendor management services
 *   - Third-party risk assessment modules
 *   - Vendor security monitoring
 *   - Due diligence workflows
 *   - Contract security compliance
 */
import { Model, Sequelize } from 'sequelize';
interface VendorProfile {
    id?: string;
    vendorName: string;
    vendorType: 'saas' | 'infrastructure' | 'consulting' | 'hardware' | 'other';
    website?: string;
    primaryContact: string;
    contactEmail: string;
    contactPhone?: string;
    businessAddress?: string;
    taxId?: string;
    dunsNumber?: string;
    yearEstablished?: number;
    employeeCount?: number;
    annualRevenue?: number;
    description?: string;
    servicesProvided: string[];
    dataAccess: 'none' | 'limited' | 'full' | 'administrative';
    criticalityLevel: 'low' | 'medium' | 'high' | 'critical';
    status: 'prospect' | 'active' | 'suspended' | 'terminated';
    metadata?: Record<string, any>;
}
interface VendorRiskAssessment {
    id?: string;
    vendorId: string;
    assessmentDate: Date;
    assessmentType: 'initial' | 'annual' | 'ongoing' | 'incident_triggered';
    assessedBy: string;
    overallRiskScore: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    securityScore: number;
    privacyScore: number;
    complianceScore: number;
    financialScore: number;
    operationalScore: number;
    findings: string[];
    recommendations: string[];
    nextReviewDate?: Date;
    approvalStatus: 'pending' | 'approved' | 'rejected' | 'remediation_required';
    approvedBy?: string;
    approvedAt?: Date;
    metadata?: Record<string, any>;
}
interface SecurityQuestionnaire {
    id?: string;
    vendorId: string;
    questionnaireType: 'soc2' | 'iso27001' | 'hipaa' | 'custom';
    version: string;
    sentDate: Date;
    dueDate?: Date;
    completedDate?: Date;
    completedBy?: string;
    status: 'draft' | 'sent' | 'in_progress' | 'completed' | 'expired';
    questions: QuestionnaireQuestion[];
    overallScore?: number;
    gaps: string[];
    reviewedBy?: string;
    reviewedAt?: Date;
    metadata?: Record<string, any>;
}
interface QuestionnaireQuestion {
    questionId: string;
    category: string;
    question: string;
    answer?: string;
    evidence?: string[];
    score?: number;
    weight: number;
    compliant: boolean;
    notes?: string;
}
interface VendorDueDiligence {
    id?: string;
    vendorId: string;
    dueDiligenceType: 'initial' | 'enhanced' | 'simplified';
    initiatedDate: Date;
    completedDate?: Date;
    assignedTo: string;
    status: 'pending' | 'in_progress' | 'completed' | 'on_hold';
    checklistItems: DueDiligenceItem[];
    documentsCollected: string[];
    backgroundCheckCompleted: boolean;
    financialReviewCompleted: boolean;
    securityReviewCompleted: boolean;
    legalReviewCompleted: boolean;
    referenceCheckCompleted: boolean;
    overallResult: 'pass' | 'pass_with_conditions' | 'fail' | 'pending';
    conditions?: string[];
    reviewedBy?: string;
    metadata?: Record<string, any>;
}
interface DueDiligenceItem {
    itemId: string;
    category: string;
    description: string;
    required: boolean;
    completed: boolean;
    completedDate?: Date;
    result?: string;
    notes?: string;
}
interface VendorContract {
    id?: string;
    vendorId: string;
    contractNumber: string;
    contractType: 'msa' | 'sow' | 'nda' | 'dpa' | 'baa' | 'sla';
    effectiveDate: Date;
    expirationDate?: Date;
    autoRenewal: boolean;
    renewalNoticeDays?: number;
    contractValue?: number;
    currency?: string;
    paymentTerms?: string;
    securityRequirements: string[];
    complianceRequirements: string[];
    dataProtectionClauses: string[];
    breachNotificationSLA?: number;
    terminationClause?: string;
    liabilityLimit?: number;
    insuranceRequired?: boolean;
    insuranceCoverage?: number;
    status: 'draft' | 'pending_approval' | 'active' | 'expired' | 'terminated';
    metadata?: Record<string, any>;
}
interface VendorIncident {
    id?: string;
    vendorId: string;
    incidentDate: Date;
    reportedDate: Date;
    reportedBy: string;
    incidentType: 'security_breach' | 'data_loss' | 'service_outage' | 'compliance_violation' | 'other';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    impact: string;
    affectedSystems: string[];
    affectedDataTypes: string[];
    recordsAffected?: number;
    rootCause?: string;
    vendorResponse?: string;
    remediationSteps: string[];
    remediationStatus: 'pending' | 'in_progress' | 'completed' | 'verified';
    lessonsLearned?: string;
    closedDate?: Date;
    metadata?: Record<string, any>;
}
interface VendorScorecard {
    id?: string;
    vendorId: string;
    scoringPeriod: string;
    calculatedDate: Date;
    overallScore: number;
    performanceMetrics: ScoreMetric[];
    securityMetrics: ScoreMetric[];
    complianceMetrics: ScoreMetric[];
    financialMetrics: ScoreMetric[];
    trend: 'improving' | 'stable' | 'declining';
    benchmarkComparison?: number;
    recommendations: string[];
    metadata?: Record<string, any>;
}
interface ScoreMetric {
    metricName: string;
    category: string;
    value: number;
    weight: number;
    target?: number;
    threshold?: number;
    status: 'excellent' | 'good' | 'acceptable' | 'poor';
}
interface VendorMonitoring {
    id?: string;
    vendorId: string;
    monitoringType: 'continuous' | 'periodic' | 'event_based';
    frequency: 'realtime' | 'daily' | 'weekly' | 'monthly' | 'quarterly';
    lastCheckDate: Date;
    nextCheckDate?: Date;
    monitoringSources: string[];
    alerts: MonitoringAlert[];
    status: 'active' | 'paused' | 'inactive';
    metadata?: Record<string, any>;
}
interface MonitoringAlert {
    alertId: string;
    alertDate: Date;
    alertType: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    source: string;
    description: string;
    actionRequired: boolean;
    actionTaken?: string;
    resolved: boolean;
}
/**
 * Sequelize model for Vendor Profiles with comprehensive tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} VendorProfile model
 *
 * @example
 * const VendorProfile = defineVendorProfileModel(sequelize);
 * await VendorProfile.create({
 *   vendorName: 'Acme Cloud Services',
 *   vendorType: 'saas',
 *   primaryContact: 'John Doe',
 *   contactEmail: 'john@acme.com',
 *   criticalityLevel: 'high',
 *   status: 'active'
 * });
 */
export declare function defineVendorProfileModel(sequelize: Sequelize): typeof Model;
/**
 * Sequelize model for Vendor Risk Assessments.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} VendorRiskAssessment model
 *
 * @example
 * const VendorRiskAssessment = defineVendorRiskAssessmentModel(sequelize);
 * await VendorRiskAssessment.create({
 *   vendorId: 'vendor-123',
 *   assessmentDate: new Date(),
 *   assessmentType: 'annual',
 *   assessedBy: 'user-456',
 *   overallRiskScore: 75,
 *   riskLevel: 'medium'
 * });
 */
export declare function defineVendorRiskAssessmentModel(sequelize: Sequelize): typeof Model;
/**
 * Sequelize model for Security Questionnaires.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} SecurityQuestionnaire model
 *
 * @example
 * const SecurityQuestionnaire = defineSecurityQuestionnaireModel(sequelize);
 * await SecurityQuestionnaire.create({
 *   vendorId: 'vendor-123',
 *   questionnaireType: 'soc2',
 *   version: '2024.1',
 *   sentDate: new Date(),
 *   status: 'sent'
 * });
 */
export declare function defineSecurityQuestionnaireModel(sequelize: Sequelize): typeof Model;
/**
 * Sequelize model for Vendor Incidents.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} VendorIncident model
 *
 * @example
 * const VendorIncident = defineVendorIncidentModel(sequelize);
 * await VendorIncident.create({
 *   vendorId: 'vendor-123',
 *   incidentDate: new Date(),
 *   reportedDate: new Date(),
 *   reportedBy: 'user-456',
 *   incidentType: 'security_breach',
 *   severity: 'high'
 * });
 */
export declare function defineVendorIncidentModel(sequelize: Sequelize): typeof Model;
/**
 * Sequelize model for Vendor Scorecards.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} VendorScorecard model
 *
 * @example
 * const VendorScorecard = defineVendorScorecardModel(sequelize);
 * await VendorScorecard.create({
 *   vendorId: 'vendor-123',
 *   scoringPeriod: '2024-Q1',
 *   calculatedDate: new Date(),
 *   overallScore: 85,
 *   trend: 'improving'
 * });
 */
export declare function defineVendorScorecardModel(sequelize: Sequelize): typeof Model;
/**
 * Zod schema for vendor profile validation.
 */
export declare const vendorProfileSchema: any;
/**
 * Zod schema for risk assessment validation.
 */
export declare const riskAssessmentSchema: any;
/**
 * Zod schema for security questionnaire validation.
 */
export declare const securityQuestionnaireSchema: any;
/**
 * Zod schema for vendor incident validation.
 */
export declare const vendorIncidentSchema: any;
/**
 * Zod schema for vendor scorecard validation.
 */
export declare const vendorScorecardSchema: any;
/**
 * Creates a new vendor profile.
 *
 * @param {typeof Model} vendorModel - Vendor profile model
 * @param {VendorProfile} profile - Vendor profile data
 * @returns {Promise<any>} Created vendor profile
 *
 * @example
 * await createVendorProfile(VendorProfile, {
 *   vendorName: 'Acme Cloud Services',
 *   vendorType: 'saas',
 *   primaryContact: 'John Doe',
 *   contactEmail: 'john@acme.com',
 *   servicesProvided: ['Cloud Storage', 'Computing'],
 *   dataAccess: 'limited',
 *   criticalityLevel: 'high',
 *   status: 'active'
 * });
 */
export declare function createVendorProfile(vendorModel: typeof Model, profile: VendorProfile): Promise<any>;
/**
 * Updates vendor profile information.
 *
 * @param {typeof Model} vendorModel - Vendor profile model
 * @param {string} vendorId - Vendor ID
 * @param {Partial<VendorProfile>} updates - Profile updates
 * @returns {Promise<any>} Updated vendor profile
 *
 * @example
 * await updateVendorProfile(VendorProfile, 'vendor-123', {
 *   status: 'suspended',
 *   criticalityLevel: 'critical'
 * });
 */
export declare function updateVendorProfile(vendorModel: typeof Model, vendorId: string, updates: Partial<VendorProfile>): Promise<any>;
/**
 * Retrieves vendor profile by ID with full details.
 *
 * @param {typeof Model} vendorModel - Vendor profile model
 * @param {string} vendorId - Vendor ID
 * @returns {Promise<any>} Vendor profile
 *
 * @example
 * const vendor = await getVendorProfile(VendorProfile, 'vendor-123');
 */
export declare function getVendorProfile(vendorModel: typeof Model, vendorId: string): Promise<any>;
/**
 * Lists vendors with filtering and pagination.
 *
 * @param {typeof Model} vendorModel - Vendor profile model
 * @param {Record<string, any>} filters - Query filters
 * @param {number} limit - Result limit
 * @param {number} offset - Result offset
 * @returns {Promise<{rows: any[], count: number}>} Vendor list
 *
 * @example
 * const vendors = await listVendors(VendorProfile, {
 *   status: 'active',
 *   criticalityLevel: 'high',
 *   vendorType: 'saas'
 * }, 50, 0);
 */
export declare function listVendors(vendorModel: typeof Model, filters?: Record<string, any>, limit?: number, offset?: number): Promise<{
    rows: any[];
    count: number;
}>;
/**
 * Archives/terminates a vendor.
 *
 * @param {typeof Model} vendorModel - Vendor profile model
 * @param {string} vendorId - Vendor ID
 * @param {string} reason - Termination reason
 * @returns {Promise<any>} Updated vendor
 *
 * @example
 * await archiveVendor(VendorProfile, 'vendor-123', 'Contract expired');
 */
export declare function archiveVendor(vendorModel: typeof Model, vendorId: string, reason: string): Promise<any>;
/**
 * Gets vendors by criticality level.
 *
 * @param {typeof Model} vendorModel - Vendor profile model
 * @param {'low' | 'medium' | 'high' | 'critical'} level - Criticality level
 * @returns {Promise<any[]>} Vendors at criticality level
 *
 * @example
 * const criticalVendors = await getVendorsByCriticality(VendorProfile, 'critical');
 */
export declare function getVendorsByCriticality(vendorModel: typeof Model, level: 'low' | 'medium' | 'high' | 'critical'): Promise<any[]>;
/**
 * Creates a new vendor risk assessment.
 *
 * @param {typeof Model} assessmentModel - Risk assessment model
 * @param {VendorRiskAssessment} assessment - Assessment data
 * @returns {Promise<any>} Created assessment
 *
 * @example
 * await createRiskAssessment(VendorRiskAssessment, {
 *   vendorId: 'vendor-123',
 *   assessmentDate: new Date(),
 *   assessmentType: 'annual',
 *   assessedBy: 'user-456',
 *   overallRiskScore: 75,
 *   riskLevel: 'medium',
 *   securityScore: 80,
 *   privacyScore: 70,
 *   complianceScore: 75,
 *   financialScore: 85,
 *   operationalScore: 70,
 *   findings: ['Incomplete encryption', 'Limited access controls'],
 *   recommendations: ['Implement full disk encryption', 'Enable MFA']
 * });
 */
export declare function createRiskAssessment(assessmentModel: typeof Model, assessment: VendorRiskAssessment): Promise<any>;
/**
 * Calculates overall risk score from component scores.
 *
 * @param {number} securityScore - Security score (0-100)
 * @param {number} privacyScore - Privacy score (0-100)
 * @param {number} complianceScore - Compliance score (0-100)
 * @param {number} financialScore - Financial score (0-100)
 * @param {number} operationalScore - Operational score (0-100)
 * @returns {number} Overall risk score
 *
 * @example
 * const score = calculateOverallRiskScore(80, 75, 70, 85, 78);
 * // Returns weighted average
 */
export declare function calculateOverallRiskScore(securityScore: number, privacyScore: number, complianceScore: number, financialScore: number, operationalScore: number): number;
/**
 * Determines risk level from risk score.
 *
 * @param {number} riskScore - Risk score (0-100)
 * @returns {'low' | 'medium' | 'high' | 'critical'} Risk level
 *
 * @example
 * const level = determineRiskLevel(75); // Returns 'medium'
 */
export declare function determineRiskLevel(riskScore: number): 'low' | 'medium' | 'high' | 'critical';
/**
 * Gets latest risk assessment for a vendor.
 *
 * @param {typeof Model} assessmentModel - Risk assessment model
 * @param {string} vendorId - Vendor ID
 * @returns {Promise<any>} Latest assessment
 *
 * @example
 * const latest = await getLatestAssessment(VendorRiskAssessment, 'vendor-123');
 */
export declare function getLatestAssessment(assessmentModel: typeof Model, vendorId: string): Promise<any>;
/**
 * Gets risk assessment history for a vendor.
 *
 * @param {typeof Model} assessmentModel - Risk assessment model
 * @param {string} vendorId - Vendor ID
 * @param {number} limit - Number of assessments to retrieve
 * @returns {Promise<any[]>} Assessment history
 *
 * @example
 * const history = await getRiskAssessmentHistory(VendorRiskAssessment, 'vendor-123', 10);
 */
export declare function getRiskAssessmentHistory(assessmentModel: typeof Model, vendorId: string, limit?: number): Promise<any[]>;
/**
 * Approves a risk assessment.
 *
 * @param {typeof Model} assessmentModel - Risk assessment model
 * @param {string} assessmentId - Assessment ID
 * @param {string} approvedBy - Approver user ID
 * @returns {Promise<any>} Approved assessment
 *
 * @example
 * await approveRiskAssessment(VendorRiskAssessment, 'assessment-123', 'user-456');
 */
export declare function approveRiskAssessment(assessmentModel: typeof Model, assessmentId: string, approvedBy: string): Promise<any>;
/**
 * Creates a new security questionnaire.
 *
 * @param {typeof Model} questionnaireModel - Questionnaire model
 * @param {SecurityQuestionnaire} questionnaire - Questionnaire data
 * @returns {Promise<any>} Created questionnaire
 *
 * @example
 * await createSecurityQuestionnaire(SecurityQuestionnaire, {
 *   vendorId: 'vendor-123',
 *   questionnaireType: 'soc2',
 *   version: '2024.1',
 *   sentDate: new Date(),
 *   dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
 *   status: 'sent',
 *   questions: []
 * });
 */
export declare function createSecurityQuestionnaire(questionnaireModel: typeof Model, questionnaire: SecurityQuestionnaire): Promise<any>;
/**
 * Adds questions to a security questionnaire.
 *
 * @param {typeof Model} questionnaireModel - Questionnaire model
 * @param {string} questionnaireId - Questionnaire ID
 * @param {QuestionnaireQuestion[]} questions - Questions to add
 * @returns {Promise<any>} Updated questionnaire
 *
 * @example
 * await addQuestions(SecurityQuestionnaire, 'questionnaire-123', [
 *   {
 *     questionId: 'q1',
 *     category: 'encryption',
 *     question: 'Do you encrypt data at rest?',
 *     weight: 10,
 *     compliant: false
 *   }
 * ]);
 */
export declare function addQuestions(questionnaireModel: typeof Model, questionnaireId: string, questions: QuestionnaireQuestion[]): Promise<any>;
/**
 * Scores a completed questionnaire.
 *
 * @param {QuestionnaireQuestion[]} questions - Answered questions
 * @returns {number} Overall questionnaire score
 *
 * @example
 * const score = scoreQuestionnaire(answeredQuestions);
 */
export declare function scoreQuestionnaire(questions: QuestionnaireQuestion[]): number;
/**
 * Identifies gaps in questionnaire responses.
 *
 * @param {QuestionnaireQuestion[]} questions - Answered questions
 * @returns {string[]} List of identified gaps
 *
 * @example
 * const gaps = identifyQuestionnaireGaps(answeredQuestions);
 */
export declare function identifyQuestionnaireGaps(questions: QuestionnaireQuestion[]): string[];
/**
 * Gets overdue questionnaires.
 *
 * @param {typeof Model} questionnaireModel - Questionnaire model
 * @returns {Promise<any[]>} Overdue questionnaires
 *
 * @example
 * const overdue = await getOverdueQuestionnaires(SecurityQuestionnaire);
 */
export declare function getOverdueQuestionnaires(questionnaireModel: typeof Model): Promise<any[]>;
/**
 * Records a vendor incident.
 *
 * @param {typeof Model} incidentModel - Incident model
 * @param {VendorIncident} incident - Incident data
 * @returns {Promise<any>} Created incident
 *
 * @example
 * await recordVendorIncident(VendorIncident, {
 *   vendorId: 'vendor-123',
 *   incidentDate: new Date(),
 *   reportedDate: new Date(),
 *   reportedBy: 'user-456',
 *   incidentType: 'security_breach',
 *   severity: 'high',
 *   description: 'Unauthorized access detected',
 *   impact: 'Potential data exposure',
 *   affectedSystems: ['API Server'],
 *   affectedDataTypes: ['Customer PII'],
 *   remediationSteps: ['Reset credentials', 'Enable MFA']
 * });
 */
export declare function recordVendorIncident(incidentModel: typeof Model, incident: VendorIncident): Promise<any>;
/**
 * Updates incident remediation status.
 *
 * @param {typeof Model} incidentModel - Incident model
 * @param {string} incidentId - Incident ID
 * @param {'pending' | 'in_progress' | 'completed' | 'verified'} status - New status
 * @param {string} notes - Status update notes
 * @returns {Promise<any>} Updated incident
 *
 * @example
 * await updateIncidentStatus(VendorIncident, 'incident-123', 'completed', 'All remediation steps completed');
 */
export declare function updateIncidentStatus(incidentModel: typeof Model, incidentId: string, status: 'pending' | 'in_progress' | 'completed' | 'verified', notes: string): Promise<any>;
/**
 * Gets critical incidents for a vendor.
 *
 * @param {typeof Model} incidentModel - Incident model
 * @param {string} vendorId - Vendor ID
 * @returns {Promise<any[]>} Critical incidents
 *
 * @example
 * const critical = await getCriticalIncidents(VendorIncident, 'vendor-123');
 */
export declare function getCriticalIncidents(incidentModel: typeof Model, vendorId: string): Promise<any[]>;
/**
 * Gets incident statistics for a vendor.
 *
 * @param {typeof Model} incidentModel - Incident model
 * @param {string} vendorId - Vendor ID
 * @param {Date} startDate - Start date for statistics
 * @param {Date} endDate - End date for statistics
 * @returns {Promise<Record<string, any>>} Incident statistics
 *
 * @example
 * const stats = await getIncidentStats(VendorIncident, 'vendor-123', startDate, endDate);
 */
export declare function getIncidentStats(incidentModel: typeof Model, vendorId: string, startDate: Date, endDate: Date): Promise<Record<string, any>>;
/**
 * Closes a vendor incident.
 *
 * @param {typeof Model} incidentModel - Incident model
 * @param {string} incidentId - Incident ID
 * @param {string} lessonsLearned - Lessons learned from incident
 * @returns {Promise<any>} Closed incident
 *
 * @example
 * await closeIncident(VendorIncident, 'incident-123', 'Enhanced monitoring needed');
 */
export declare function closeIncident(incidentModel: typeof Model, incidentId: string, lessonsLearned: string): Promise<any>;
/**
 * Generates a vendor scorecard.
 *
 * @param {typeof Model} scorecardModel - Scorecard model
 * @param {VendorScorecard} scorecard - Scorecard data
 * @returns {Promise<any>} Created scorecard
 *
 * @example
 * await generateVendorScorecard(VendorScorecard, {
 *   vendorId: 'vendor-123',
 *   scoringPeriod: '2024-Q1',
 *   calculatedDate: new Date(),
 *   overallScore: 85,
 *   performanceMetrics: [],
 *   securityMetrics: [],
 *   complianceMetrics: [],
 *   financialMetrics: [],
 *   trend: 'improving',
 *   recommendations: []
 * });
 */
export declare function generateVendorScorecard(scorecardModel: typeof Model, scorecard: VendorScorecard): Promise<any>;
/**
 * Calculates scorecard metrics from vendor data.
 *
 * @param {any} vendor - Vendor data
 * @param {any[]} assessments - Risk assessments
 * @param {any[]} incidents - Vendor incidents
 * @returns {ScoreMetric[]} Calculated metrics
 *
 * @example
 * const metrics = calculateScorecardMetrics(vendor, assessments, incidents);
 */
export declare function calculateScorecardMetrics(vendor: any, assessments: any[], incidents: any[]): ScoreMetric[];
/**
 * Determines performance trend from scorecard history.
 *
 * @param {any[]} scorecards - Historical scorecards
 * @returns {'improving' | 'stable' | 'declining'} Trend
 *
 * @example
 * const trend = determineTrend(historicalScorecards);
 */
export declare function determineTrend(scorecards: any[]): 'improving' | 'stable' | 'declining';
/**
 * Compares vendor score to benchmark.
 *
 * @param {number} vendorScore - Vendor's score
 * @param {number[]} peerScores - Peer vendor scores
 * @returns {number} Percentile ranking
 *
 * @example
 * const percentile = compareToBenchmark(85, [70, 75, 80, 90, 95]);
 */
export declare function compareToBenchmark(vendorScore: number, peerScores: number[]): number;
/**
 * Gets latest scorecard for a vendor.
 *
 * @param {typeof Model} scorecardModel - Scorecard model
 * @param {string} vendorId - Vendor ID
 * @returns {Promise<any>} Latest scorecard
 *
 * @example
 * const latest = await getLatestScorecard(VendorScorecard, 'vendor-123');
 */
export declare function getLatestScorecard(scorecardModel: typeof Model, vendorId: string): Promise<any>;
/**
 * Gets scorecard history for trend analysis.
 *
 * @param {typeof Model} scorecardModel - Scorecard model
 * @param {string} vendorId - Vendor ID
 * @param {number} periods - Number of periods to retrieve
 * @returns {Promise<any[]>} Scorecard history
 *
 * @example
 * const history = await getScorecardHistory(VendorScorecard, 'vendor-123', 12);
 */
export declare function getScorecardHistory(scorecardModel: typeof Model, vendorId: string, periods?: number): Promise<any[]>;
/**
 * Creates vendor due diligence workflow.
 *
 * @param {typeof Model} dueDiligenceModel - Due diligence model (custom model)
 * @param {VendorDueDiligence} dueDiligence - Due diligence data
 * @returns {Promise<any>} Created due diligence record
 *
 * @example
 * await createDueDiligence(VendorDueDiligence, {
 *   vendorId: 'vendor-123',
 *   dueDiligenceType: 'enhanced',
 *   initiatedDate: new Date(),
 *   assignedTo: 'user-456',
 *   status: 'pending',
 *   checklistItems: [],
 *   documentsCollected: [],
 *   backgroundCheckCompleted: false,
 *   financialReviewCompleted: false,
 *   securityReviewCompleted: false,
 *   legalReviewCompleted: false,
 *   referenceCheckCompleted: false,
 *   overallResult: 'pending'
 * });
 */
export declare function createDueDiligence(dueDiligenceModel: typeof Model, dueDiligence: VendorDueDiligence): Promise<any>;
/**
 * Validates vendor contract security requirements.
 *
 * @param {VendorContract} contract - Contract to validate
 * @param {string[]} requiredClauses - Required security clauses
 * @returns {boolean} Whether contract meets requirements
 *
 * @example
 * const valid = validateContractSecurity(contract, [
 *   'data_encryption',
 *   'breach_notification',
 *   'right_to_audit'
 * ]);
 */
export declare function validateContractSecurity(contract: VendorContract, requiredClauses: string[]): boolean;
/**
 * Schedules continuous vendor monitoring.
 *
 * @param {typeof Model} monitoringModel - Monitoring model (custom model)
 * @param {VendorMonitoring} monitoring - Monitoring configuration
 * @returns {Promise<any>} Created monitoring schedule
 *
 * @example
 * await scheduleVendorMonitoring(VendorMonitoring, {
 *   vendorId: 'vendor-123',
 *   monitoringType: 'continuous',
 *   frequency: 'daily',
 *   lastCheckDate: new Date(),
 *   monitoringSources: ['SecurityScorecard', 'BitSight'],
 *   alerts: [],
 *   status: 'active'
 * });
 */
export declare function scheduleVendorMonitoring(monitoringModel: typeof Model, monitoring: VendorMonitoring): Promise<any>;
/**
 * Executes vendor onboarding workflow.
 *
 * @param {typeof Model} vendorModel - Vendor model
 * @param {typeof Model} assessmentModel - Assessment model
 * @param {VendorProfile} vendor - Vendor profile
 * @returns {Promise<Record<string, any>>} Onboarding result
 *
 * @example
 * const result = await onboardVendor(VendorProfile, VendorRiskAssessment, {
 *   vendorName: 'New Vendor',
 *   vendorType: 'saas',
 *   primaryContact: 'Contact Name',
 *   contactEmail: 'contact@vendor.com',
 *   servicesProvided: ['Service1'],
 *   dataAccess: 'limited',
 *   criticalityLevel: 'medium',
 *   status: 'prospect'
 * });
 */
export declare function onboardVendor(vendorModel: typeof Model, assessmentModel: typeof Model, vendor: VendorProfile): Promise<Record<string, any>>;
/**
 * Executes vendor offboarding workflow.
 *
 * @param {typeof Model} vendorModel - Vendor model
 * @param {string} vendorId - Vendor ID
 * @param {string} offboardingReason - Reason for offboarding
 * @param {string} userId - User executing offboarding
 * @returns {Promise<Record<string, any>>} Offboarding result
 *
 * @example
 * const result = await offboardVendor(VendorProfile, 'vendor-123', 'Contract expired', 'user-456');
 */
export declare function offboardVendor(vendorModel: typeof Model, vendorId: string, offboardingReason: string, userId: string): Promise<Record<string, any>>;
export declare class CreateVendorDto {
    vendorName: string;
    vendorType: string;
    primaryContact: string;
    contactEmail: string;
    servicesProvided: string[];
    dataAccess: string;
    criticalityLevel: string;
}
export declare class CreateRiskAssessmentDto {
    vendorId: string;
    assessmentType: string;
    assessedBy: string;
    overallRiskScore: number;
    riskLevel: string;
}
export declare class CreateIncidentDto {
    vendorId: string;
    incidentDate: Date;
    incidentType: string;
    severity: string;
    description: string;
    impact: string;
}
export {};
//# sourceMappingURL=vendor-risk-management-kit.d.ts.map