/**
 * LOC: IRTK1234567
 * File: /reuse/threat/incident-response-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Security incident response services
 *   - SOAR platform integrations
 *   - SOC automation workflows
 */
/**
 * File: /reuse/threat/incident-response-kit.ts
 * Locator: WC-UTL-IRTK-001
 * Purpose: Comprehensive Incident Response Toolkit - Classification, timeline reconstruction, playbooks, escalation, evidence collection
 *
 * Upstream: Independent utility module for incident response operations
 * Downstream: ../backend/security/*, SOC services, SOAR integrations, incident management APIs
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize, Swagger/OpenAPI
 * Exports: 47 utility functions for incident classification, playbook automation, evidence chain, metrics, post-incident analysis
 *
 * LLM Context: Production-grade incident response utilities for White Cross security operations.
 * Provides incident classification, timeline reconstruction, automated playbooks, escalation workflows,
 * evidence collection with chain of custody, response metrics, and post-incident analysis capabilities.
 */
interface IncidentClassification {
    category: 'malware' | 'phishing' | 'data_breach' | 'ddos' | 'insider_threat' | 'ransomware' | 'unauthorized_access' | 'other';
    severity: 'critical' | 'high' | 'medium' | 'low' | 'informational';
    priority: number;
    confidence: number;
    tags: string[];
    mitreTactics: string[];
    mitreTechniques: string[];
}
interface IncidentTimeline {
    incidentId: string;
    events: TimelineEvent[];
    firstSeen: Date;
    lastSeen: Date;
    duration: number;
    reconstructionConfidence: number;
}
interface TimelineEvent {
    id: string;
    timestamp: Date;
    eventType: string;
    source: string;
    description: string;
    severity: string;
    artifacts: string[];
    correlationId?: string;
    confidence: number;
}
interface IncidentPlaybook {
    id: string;
    name: string;
    incidentType: string;
    steps: PlaybookStep[];
    automationLevel: 'manual' | 'semi-automated' | 'fully-automated';
    estimatedTime: number;
    requiredRoles: string[];
}
interface PlaybookStep {
    stepNumber: number;
    name: string;
    action: string;
    automated: boolean;
    requiredApprovals: string[];
    timeout: number;
    onSuccess: string;
    onFailure: string;
    runbook?: string;
}
interface EscalationRule {
    id: string;
    condition: string;
    severityThreshold: string;
    escalateTo: string[];
    escalationDelay: number;
    notificationChannels: string[];
    requiresAcknowledgment: boolean;
}
interface EvidenceItem {
    id: string;
    incidentId: string;
    type: 'log' | 'file' | 'memory_dump' | 'network_capture' | 'screenshot' | 'artifact' | 'other';
    source: string;
    hash: string;
    size: number;
    collectionTime: Date;
    collectedBy: string;
    chainOfCustody: CustodyEntry[];
    integrity: boolean;
    metadata: Record<string, unknown>;
}
interface CustodyEntry {
    timestamp: Date;
    action: 'collected' | 'transferred' | 'analyzed' | 'stored' | 'destroyed';
    handler: string;
    location: string;
    notes?: string;
    signature?: string;
}
interface IncidentMetrics {
    incidentId: string;
    detectionTime: Date;
    responseTime: number;
    containmentTime: number;
    recoveryTime: number;
    totalTime: number;
    mttr: number;
    mttc: number;
    mttr_full: number;
    falsePositiveRate?: number;
}
interface PostIncidentReport {
    incidentId: string;
    summary: string;
    rootCause: string;
    impactAssessment: ImpactAssessment;
    timeline: IncidentTimeline;
    actionsToken: string[];
    lessonsLearned: string[];
    recommendations: string[];
    affectedAssets: string[];
    estimatedCost?: number;
    createdBy: string;
    createdAt: Date;
}
interface ImpactAssessment {
    scope: 'isolated' | 'departmental' | 'organizational' | 'industry-wide';
    affectedUsers: number;
    affectedSystems: number;
    dataExfiltrated: boolean;
    estimatedRecords?: number;
    downtime: number;
    businessImpact: 'none' | 'minimal' | 'moderate' | 'severe' | 'catastrophic';
}
interface SOARIntegration {
    platform: string;
    endpoint: string;
    apiKey: string;
    capabilities: string[];
    automatedActions: string[];
}
/**
 * Classifies an incident based on indicators and context.
 *
 * @param {Record<string, unknown>} indicators - Incident indicators
 * @param {string[]} [context] - Additional context information
 * @returns {IncidentClassification} Classification result
 *
 * @example
 * ```typescript
 * const classification = classifyIncident({
 *   alertType: 'ransomware_detected',
 *   affectedHosts: 15,
 *   encryptedFiles: true
 * });
 * // Result: { category: 'ransomware', severity: 'critical', priority: 1, ... }
 * ```
 */
export declare const classifyIncident: (indicators: Record<string, unknown>, context?: string[]) => IncidentClassification;
/**
 * Determines incident category from indicators.
 *
 * @param {Record<string, unknown>} indicators - Incident indicators
 * @returns {IncidentClassification['category']} Incident category
 *
 * @example
 * ```typescript
 * const category = determineIncidentCategory({ ransomwareSignature: true });
 * // Result: 'ransomware'
 * ```
 */
export declare const determineIncidentCategory: (indicators: Record<string, unknown>) => IncidentClassification["category"];
/**
 * Calculates incident severity based on impact factors.
 *
 * @param {Record<string, unknown>} indicators - Incident indicators
 * @param {string} category - Incident category
 * @returns {IncidentClassification['severity']} Severity level
 *
 * @example
 * ```typescript
 * const severity = calculateIncidentSeverity(
 *   { affectedSystems: 50, dataExfiltration: true },
 *   'data_breach'
 * );
 * // Result: 'critical'
 * ```
 */
export declare const calculateIncidentSeverity: (indicators: Record<string, unknown>, category: string) => IncidentClassification["severity"];
/**
 * Maps severity level to priority number.
 *
 * @param {IncidentClassification['severity']} severity - Severity level
 * @returns {number} Priority (1-5)
 *
 * @example
 * ```typescript
 * const priority = mapSeverityToPriority('critical');
 * // Result: 1
 * ```
 */
export declare const mapSeverityToPriority: (severity: IncidentClassification["severity"]) => number;
/**
 * Extracts relevant tags from incident indicators.
 *
 * @param {Record<string, unknown>} indicators - Incident indicators
 * @param {string[]} [context] - Additional context
 * @returns {string[]} Extracted tags
 *
 * @example
 * ```typescript
 * const tags = extractIncidentTags({ encrypted: true, network: 'dmz' });
 * // Result: ['encryption', 'network-dmz', 'automated-detection']
 * ```
 */
export declare const extractIncidentTags: (indicators: Record<string, unknown>, context?: string[]) => string[];
/**
 * Maps incident category to MITRE ATT&CK tactics.
 *
 * @param {string} category - Incident category
 * @returns {string[]} MITRE tactics
 *
 * @example
 * ```typescript
 * const tactics = mapToMitreTactics('ransomware');
 * // Result: ['TA0040', 'TA0002', 'TA0005']
 * ```
 */
export declare const mapToMitreTactics: (category: string) => string[];
/**
 * Extracts MITRE ATT&CK techniques from indicators.
 *
 * @param {Record<string, unknown>} indicators - Incident indicators
 * @returns {string[]} MITRE techniques
 *
 * @example
 * ```typescript
 * const techniques = extractMitreTechniques({ spearphishing: true });
 * // Result: ['T1566.001']
 * ```
 */
export declare const extractMitreTechniques: (indicators: Record<string, unknown>) => string[];
/**
 * Reconstructs incident timeline from events.
 *
 * @param {string} incidentId - Incident identifier
 * @param {TimelineEvent[]} events - Timeline events
 * @returns {IncidentTimeline} Reconstructed timeline
 *
 * @example
 * ```typescript
 * const timeline = reconstructTimeline('INC-2024-001', events);
 * // Result: { incidentId: 'INC-2024-001', events: [...], duration: 3600000, ... }
 * ```
 */
export declare const reconstructTimeline: (incidentId: string, events: TimelineEvent[]) => IncidentTimeline;
/**
 * Sorts timeline events chronologically.
 *
 * @param {TimelineEvent[]} events - Timeline events
 * @returns {TimelineEvent[]} Sorted events
 *
 * @example
 * ```typescript
 * const sorted = sortTimelineEvents(events);
 * // Events sorted by timestamp ascending
 * ```
 */
export declare const sortTimelineEvents: (events: TimelineEvent[]) => TimelineEvent[];
/**
 * Correlates related timeline events.
 *
 * @param {TimelineEvent[]} events - Timeline events
 * @param {number} [timeWindow] - Correlation time window in ms
 * @returns {TimelineEvent[][]} Correlated event groups
 *
 * @example
 * ```typescript
 * const correlated = correlateTimelineEvents(events, 60000);
 * // Groups events within 60 second windows
 * ```
 */
export declare const correlateTimelineEvents: (events: TimelineEvent[], timeWindow?: number) => TimelineEvent[][];
/**
 * Calculates timeline reconstruction confidence.
 *
 * @param {TimelineEvent[]} events - Timeline events
 * @returns {number} Confidence score (0-100)
 *
 * @example
 * ```typescript
 * const confidence = calculateTimelineConfidence(events);
 * // Result: 87
 * ```
 */
export declare const calculateTimelineConfidence: (events: TimelineEvent[]) => number;
/**
 * Identifies gaps in incident timeline.
 *
 * @param {IncidentTimeline} timeline - Incident timeline
 * @param {number} [threshold] - Gap threshold in ms
 * @returns {Array<{ start: Date; end: Date; duration: number }>} Timeline gaps
 *
 * @example
 * ```typescript
 * const gaps = identifyTimelineGaps(timeline, 600000);
 * // Finds gaps > 10 minutes
 * ```
 */
export declare const identifyTimelineGaps: (timeline: IncidentTimeline, threshold?: number) => Array<{
    start: Date;
    end: Date;
    duration: number;
}>;
/**
 * Retrieves incident playbook by type.
 *
 * @param {string} incidentType - Incident type
 * @returns {IncidentPlaybook | null} Playbook or null
 *
 * @example
 * ```typescript
 * const playbook = getPlaybookForIncident('ransomware');
 * // Returns ransomware response playbook
 * ```
 */
export declare const getPlaybookForIncident: (incidentType: string) => IncidentPlaybook | null;
/**
 * Executes automated playbook step.
 *
 * @param {PlaybookStep} step - Playbook step
 * @param {Record<string, unknown>} context - Execution context
 * @returns {Promise<{ success: boolean; output: unknown }>} Execution result
 *
 * @example
 * ```typescript
 * const result = await executePlaybookStep(step, { incidentId: 'INC-001' });
 * // Executes automation action
 * ```
 */
export declare const executePlaybookStep: (step: PlaybookStep, context: Record<string, unknown>) => Promise<{
    success: boolean;
    output: unknown;
}>;
/**
 * Validates playbook step prerequisites.
 *
 * @param {PlaybookStep} step - Playbook step
 * @param {Record<string, unknown>} state - Current state
 * @returns {boolean} Validation result
 *
 * @example
 * ```typescript
 * const valid = validateStepPrerequisites(step, currentState);
 * // Result: true if prerequisites met
 * ```
 */
export declare const validateStepPrerequisites: (step: PlaybookStep, state: Record<string, unknown>) => boolean;
/**
 * Generates playbook execution report.
 *
 * @param {IncidentPlaybook} playbook - Executed playbook
 * @param {Array<{ step: number; success: boolean; duration: number }>} results - Step results
 * @returns {Record<string, unknown>} Execution report
 *
 * @example
 * ```typescript
 * const report = generatePlaybookReport(playbook, stepResults);
 * // Detailed execution report
 * ```
 */
export declare const generatePlaybookReport: (playbook: IncidentPlaybook, results: Array<{
    step: number;
    success: boolean;
    duration: number;
}>) => Record<string, unknown>;
/**
 * Evaluates if incident should be escalated.
 *
 * @param {IncidentClassification} classification - Incident classification
 * @param {EscalationRule[]} rules - Escalation rules
 * @returns {EscalationRule[]} Matching escalation rules
 *
 * @example
 * ```typescript
 * const escalations = evaluateEscalation(classification, rules);
 * // Returns rules that match incident criteria
 * ```
 */
export declare const evaluateEscalation: (classification: IncidentClassification, rules: EscalationRule[]) => EscalationRule[];
/**
 * Triggers incident escalation.
 *
 * @param {string} incidentId - Incident ID
 * @param {EscalationRule} rule - Escalation rule
 * @returns {Promise<{ escalated: boolean; notified: string[] }>} Escalation result
 *
 * @example
 * ```typescript
 * const result = await triggerEscalation('INC-001', escalationRule);
 * // Escalates and notifies stakeholders
 * ```
 */
export declare const triggerEscalation: (incidentId: string, rule: EscalationRule) => Promise<{
    escalated: boolean;
    notified: string[];
}>;
/**
 * Sends escalation notifications.
 *
 * @param {string} incidentId - Incident ID
 * @param {string[]} recipients - Notification recipients
 * @param {string[]} channels - Notification channels
 * @returns {Promise<Record<string, boolean>>} Notification status
 *
 * @example
 * ```typescript
 * const status = await sendEscalationNotifications('INC-001', ['user1', 'user2'], ['email', 'sms']);
 * // Sends notifications via specified channels
 * ```
 */
export declare const sendEscalationNotifications: (incidentId: string, recipients: string[], channels: string[]) => Promise<Record<string, boolean>>;
/**
 * Collects incident evidence item.
 *
 * @param {string} incidentId - Incident ID
 * @param {Partial<EvidenceItem>} evidence - Evidence details
 * @returns {EvidenceItem} Collected evidence
 *
 * @example
 * ```typescript
 * const evidence = collectEvidence('INC-001', {
 *   type: 'log',
 *   source: '/var/log/auth.log',
 *   collectedBy: 'analyst1'
 * });
 * ```
 */
export declare const collectEvidence: (incidentId: string, evidence: Partial<EvidenceItem>) => EvidenceItem;
/**
 * Generates evidence hash for integrity verification.
 *
 * @param {string} data - Evidence data
 * @returns {string} SHA-256 hash
 *
 * @example
 * ```typescript
 * const hash = generateEvidenceHash('/path/to/file');
 * // Returns hash of the data
 * ```
 */
export declare const generateEvidenceHash: (data: string) => string;
/**
 * Updates evidence chain of custody.
 *
 * @param {EvidenceItem} evidence - Evidence item
 * @param {Omit<CustodyEntry, 'timestamp'>} entry - Custody entry
 * @returns {EvidenceItem} Updated evidence
 *
 * @example
 * ```typescript
 * const updated = updateChainOfCustody(evidence, {
 *   action: 'transferred',
 *   handler: 'analyst2',
 *   location: 'forensics-lab'
 * });
 * ```
 */
export declare const updateChainOfCustody: (evidence: EvidenceItem, entry: Omit<CustodyEntry, "timestamp">) => EvidenceItem;
/**
 * Verifies evidence integrity.
 *
 * @param {EvidenceItem} evidence - Evidence item
 * @param {string} currentHash - Current hash to verify
 * @returns {boolean} Integrity status
 *
 * @example
 * ```typescript
 * const valid = verifyEvidenceIntegrity(evidence, computedHash);
 * // Result: true if hashes match
 * ```
 */
export declare const verifyEvidenceIntegrity: (evidence: EvidenceItem, currentHash: string) => boolean;
/**
 * Exports evidence package for legal/forensic purposes.
 *
 * @param {EvidenceItem[]} evidence - Evidence items
 * @param {string} format - Export format
 * @returns {Record<string, unknown>} Evidence package
 *
 * @example
 * ```typescript
 * const package = exportEvidencePackage(evidenceItems, 'legal');
 * // Complete evidence package with chain of custody
 * ```
 */
export declare const exportEvidencePackage: (evidence: EvidenceItem[], format: string) => Record<string, unknown>;
/**
 * Calculates incident response metrics.
 *
 * @param {string} incidentId - Incident ID
 * @param {Record<string, Date>} timestamps - Key event timestamps
 * @returns {IncidentMetrics} Calculated metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateIncidentMetrics('INC-001', {
 *   detection: new Date('2024-01-01T10:00:00Z'),
 *   response: new Date('2024-01-01T10:05:00Z'),
 *   containment: new Date('2024-01-01T10:30:00Z'),
 *   recovery: new Date('2024-01-01T12:00:00Z')
 * });
 * ```
 */
export declare const calculateIncidentMetrics: (incidentId: string, timestamps: Record<string, Date>) => IncidentMetrics;
/**
 * Aggregates metrics across multiple incidents.
 *
 * @param {IncidentMetrics[]} metrics - Individual incident metrics
 * @returns {Record<string, number>} Aggregated metrics
 *
 * @example
 * ```typescript
 * const aggregated = aggregateIncidentMetrics(allMetrics);
 * // Result: { avgMTTR: 5.2, avgMTTC: 25.8, avgRecovery: 90.5, ... }
 * ```
 */
export declare const aggregateIncidentMetrics: (metrics: IncidentMetrics[]) => Record<string, number>;
/**
 * Compares current metrics against SLA targets.
 *
 * @param {IncidentMetrics} metrics - Incident metrics
 * @param {Record<string, number>} slaTargets - SLA targets in minutes
 * @returns {Record<string, boolean>} SLA compliance status
 *
 * @example
 * ```typescript
 * const compliance = compareAgainstSLA(metrics, {
 *   mttr: 15,
 *   mttc: 60,
 *   recovery: 240
 * });
 * // Result: { mttr: true, mttc: false, recovery: true }
 * ```
 */
export declare const compareAgainstSLA: (metrics: IncidentMetrics, slaTargets: Record<string, number>) => Record<string, boolean>;
/**
 * Creates post-incident report.
 *
 * @param {string} incidentId - Incident ID
 * @param {Partial<PostIncidentReport>} reportData - Report data
 * @returns {PostIncidentReport} Complete report
 *
 * @example
 * ```typescript
 * const report = createPostIncidentReport('INC-001', {
 *   summary: 'Ransomware attack contained',
 *   rootCause: 'Phishing email with malicious attachment',
 *   recommendations: ['Implement email filtering', 'Security awareness training']
 * });
 * ```
 */
export declare const createPostIncidentReport: (incidentId: string, reportData: Partial<PostIncidentReport>) => PostIncidentReport;
/**
 * Extracts lessons learned from incident.
 *
 * @param {IncidentTimeline} timeline - Incident timeline
 * @param {Record<string, unknown>} responseActions - Response actions taken
 * @returns {string[]} Lessons learned
 *
 * @example
 * ```typescript
 * const lessons = extractLessonsLearned(timeline, actions);
 * // Result: ['Early detection crucial', 'Automated response effective', ...]
 * ```
 */
export declare const extractLessonsLearned: (timeline: IncidentTimeline, responseActions: Record<string, unknown>) => string[];
/**
 * Generates remediation recommendations.
 *
 * @param {IncidentClassification} classification - Incident classification
 * @param {string} rootCause - Root cause analysis
 * @returns {string[]} Recommendations
 *
 * @example
 * ```typescript
 * const recommendations = generateRecommendations(classification, 'weak passwords');
 * // Result: ['Enforce MFA', 'Implement password policy', ...]
 * ```
 */
export declare const generateRecommendations: (classification: IncidentClassification, rootCause: string) => string[];
/**
 * Integrates with SOAR platform.
 *
 * @param {SOARIntegration} config - SOAR configuration
 * @param {string} incidentId - Incident ID
 * @param {string} action - Action to perform
 * @returns {Promise<Record<string, unknown>>} Integration result
 *
 * @example
 * ```typescript
 * const result = await integrateWithSOAR(soarConfig, 'INC-001', 'automate_containment');
 * // Triggers SOAR workflow
 * ```
 */
export declare const integrateWithSOAR: (config: SOARIntegration, incidentId: string, action: string) => Promise<Record<string, unknown>>;
/**
 * Triggers SOAR automated response workflow.
 *
 * @param {string} workflowId - Workflow identifier
 * @param {Record<string, unknown>} context - Execution context
 * @returns {Promise<{ workflowId: string; status: string; outputs: unknown }>} Workflow result
 *
 * @example
 * ```typescript
 * const result = await triggerSOARWorkflow('WF-CONTAIN-01', { incidentId: 'INC-001' });
 * // Executes automated containment workflow
 * ```
 */
export declare const triggerSOARWorkflow: (workflowId: string, context: Record<string, unknown>) => Promise<{
    workflowId: string;
    status: string;
    outputs: unknown;
}>;
declare const _default: {
    classifyIncident: (indicators: Record<string, unknown>, context?: string[]) => IncidentClassification;
    determineIncidentCategory: (indicators: Record<string, unknown>) => IncidentClassification["category"];
    calculateIncidentSeverity: (indicators: Record<string, unknown>, category: string) => IncidentClassification["severity"];
    mapSeverityToPriority: (severity: IncidentClassification["severity"]) => number;
    extractIncidentTags: (indicators: Record<string, unknown>, context?: string[]) => string[];
    mapToMitreTactics: (category: string) => string[];
    extractMitreTechniques: (indicators: Record<string, unknown>) => string[];
    reconstructTimeline: (incidentId: string, events: TimelineEvent[]) => IncidentTimeline;
    sortTimelineEvents: (events: TimelineEvent[]) => TimelineEvent[];
    correlateTimelineEvents: (events: TimelineEvent[], timeWindow?: number) => TimelineEvent[][];
    calculateTimelineConfidence: (events: TimelineEvent[]) => number;
    identifyTimelineGaps: (timeline: IncidentTimeline, threshold?: number) => Array<{
        start: Date;
        end: Date;
        duration: number;
    }>;
    getPlaybookForIncident: (incidentType: string) => IncidentPlaybook | null;
    executePlaybookStep: (step: PlaybookStep, context: Record<string, unknown>) => Promise<{
        success: boolean;
        output: unknown;
    }>;
    validateStepPrerequisites: (step: PlaybookStep, state: Record<string, unknown>) => boolean;
    generatePlaybookReport: (playbook: IncidentPlaybook, results: Array<{
        step: number;
        success: boolean;
        duration: number;
    }>) => Record<string, unknown>;
    evaluateEscalation: (classification: IncidentClassification, rules: EscalationRule[]) => EscalationRule[];
    triggerEscalation: (incidentId: string, rule: EscalationRule) => Promise<{
        escalated: boolean;
        notified: string[];
    }>;
    sendEscalationNotifications: (incidentId: string, recipients: string[], channels: string[]) => Promise<Record<string, boolean>>;
    collectEvidence: (incidentId: string, evidence: Partial<EvidenceItem>) => EvidenceItem;
    generateEvidenceHash: (data: string) => string;
    updateChainOfCustody: (evidence: EvidenceItem, entry: Omit<CustodyEntry, "timestamp">) => EvidenceItem;
    verifyEvidenceIntegrity: (evidence: EvidenceItem, currentHash: string) => boolean;
    exportEvidencePackage: (evidence: EvidenceItem[], format: string) => Record<string, unknown>;
    calculateIncidentMetrics: (incidentId: string, timestamps: Record<string, Date>) => IncidentMetrics;
    aggregateIncidentMetrics: (metrics: IncidentMetrics[]) => Record<string, number>;
    compareAgainstSLA: (metrics: IncidentMetrics, slaTargets: Record<string, number>) => Record<string, boolean>;
    createPostIncidentReport: (incidentId: string, reportData: Partial<PostIncidentReport>) => PostIncidentReport;
    extractLessonsLearned: (timeline: IncidentTimeline, responseActions: Record<string, unknown>) => string[];
    generateRecommendations: (classification: IncidentClassification, rootCause: string) => string[];
    integrateWithSOAR: (config: SOARIntegration, incidentId: string, action: string) => Promise<Record<string, unknown>>;
    triggerSOARWorkflow: (workflowId: string, context: Record<string, unknown>) => Promise<{
        workflowId: string;
        status: string;
        outputs: unknown;
    }>;
};
export default _default;
//# sourceMappingURL=incident-response-kit.d.ts.map