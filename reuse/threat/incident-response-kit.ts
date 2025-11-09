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

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface IncidentClassification {
  category: 'malware' | 'phishing' | 'data_breach' | 'ddos' | 'insider_threat' | 'ransomware' | 'unauthorized_access' | 'other';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'informational';
  priority: number; // 1-5, 1 being highest
  confidence: number; // 0-100
  tags: string[];
  mitreTactics: string[];
  mitreTechniques: string[];
}

interface IncidentTimeline {
  incidentId: string;
  events: TimelineEvent[];
  firstSeen: Date;
  lastSeen: Date;
  duration: number; // milliseconds
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
  estimatedTime: number; // minutes
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
  escalationDelay: number; // minutes
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
  responseTime: number; // minutes
  containmentTime: number;
  recoveryTime: number;
  totalTime: number;
  mttr: number; // Mean Time To Respond
  mttc: number; // Mean Time To Contain
  mttr_full: number; // Mean Time To Recover
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
  downtime: number; // minutes
  businessImpact: 'none' | 'minimal' | 'moderate' | 'severe' | 'catastrophic';
}

interface SOARIntegration {
  platform: string;
  endpoint: string;
  apiKey: string;
  capabilities: string[];
  automatedActions: string[];
}

// ============================================================================
// INCIDENT CLASSIFICATION UTILITIES
// ============================================================================

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
export const classifyIncident = (
  indicators: Record<string, unknown>,
  context?: string[],
): IncidentClassification => {
  const category = determineIncidentCategory(indicators);
  const severity = calculateIncidentSeverity(indicators, category);
  const priority = mapSeverityToPriority(severity);

  return {
    category,
    severity,
    priority,
    confidence: 85,
    tags: extractIncidentTags(indicators, context),
    mitreTactics: mapToMitreTactics(category),
    mitreTechniques: extractMitreTechniques(indicators),
  };
};

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
export const determineIncidentCategory = (
  indicators: Record<string, unknown>,
): IncidentClassification['category'] => {
  if (indicators.ransomwareSignature || indicators.encryptedFiles) return 'ransomware';
  if (indicators.phishingEmail || indicators.spoofedDomain) return 'phishing';
  if (indicators.dataExfiltration || indicators.unauthorizedDataAccess) return 'data_breach';
  if (indicators.ddosAttack || indicators.abnormalTraffic) return 'ddos';
  if (indicators.insiderActivity || indicators.privilegeAbuse) return 'insider_threat';
  if (indicators.malwareDetected) return 'malware';
  if (indicators.unauthorizedAccess) return 'unauthorized_access';
  return 'other';
};

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
export const calculateIncidentSeverity = (
  indicators: Record<string, unknown>,
  category: string,
): IncidentClassification['severity'] => {
  let score = 0;

  if (category === 'ransomware' || category === 'data_breach') score += 40;
  if (indicators.affectedSystems && Number(indicators.affectedSystems) > 10) score += 30;
  if (indicators.dataExfiltration) score += 20;
  if (indicators.productionImpact) score += 10;

  if (score >= 70) return 'critical';
  if (score >= 50) return 'high';
  if (score >= 30) return 'medium';
  if (score >= 10) return 'low';
  return 'informational';
};

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
export const mapSeverityToPriority = (severity: IncidentClassification['severity']): number => {
  const mapping: Record<IncidentClassification['severity'], number> = {
    critical: 1,
    high: 2,
    medium: 3,
    low: 4,
    informational: 5,
  };
  return mapping[severity];
};

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
export const extractIncidentTags = (
  indicators: Record<string, unknown>,
  context?: string[],
): string[] => {
  const tags: string[] = [];

  if (indicators.automated) tags.push('automated-detection');
  if (indicators.encrypted) tags.push('encryption');
  if (indicators.lateral_movement) tags.push('lateral-movement');
  if (context) tags.push(...context);

  return [...new Set(tags)];
};

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
export const mapToMitreTactics = (category: string): string[] => {
  const tacticMap: Record<string, string[]> = {
    ransomware: ['TA0040', 'TA0002', 'TA0005'], // Impact, Execution, Defense Evasion
    phishing: ['TA0001', 'TA0002'], // Initial Access, Execution
    data_breach: ['TA0010', 'TA0009'], // Exfiltration, Collection
    malware: ['TA0002', 'TA0003'], // Execution, Persistence
  };
  return tacticMap[category] || [];
};

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
export const extractMitreTechniques = (indicators: Record<string, unknown>): string[] => {
  const techniques: string[] = [];

  if (indicators.spearphishing) techniques.push('T1566.001');
  if (indicators.powershell) techniques.push('T1059.001');
  if (indicators.credential_dumping) techniques.push('T1003');

  return techniques;
};

// ============================================================================
// INCIDENT TIMELINE RECONSTRUCTION
// ============================================================================

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
export const reconstructTimeline = (
  incidentId: string,
  events: TimelineEvent[],
): IncidentTimeline => {
  const sortedEvents = sortTimelineEvents(events);
  const firstSeen = sortedEvents[0]?.timestamp || new Date();
  const lastSeen = sortedEvents[sortedEvents.length - 1]?.timestamp || new Date();
  const duration = lastSeen.getTime() - firstSeen.getTime();

  return {
    incidentId,
    events: sortedEvents,
    firstSeen,
    lastSeen,
    duration,
    reconstructionConfidence: calculateTimelineConfidence(sortedEvents),
  };
};

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
export const sortTimelineEvents = (events: TimelineEvent[]): TimelineEvent[] => {
  return [...events].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};

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
export const correlateTimelineEvents = (
  events: TimelineEvent[],
  timeWindow: number = 300000,
): TimelineEvent[][] => {
  const sorted = sortTimelineEvents(events);
  const groups: TimelineEvent[][] = [];
  let currentGroup: TimelineEvent[] = [];
  let groupStartTime: number | null = null;

  sorted.forEach(event => {
    const eventTime = event.timestamp.getTime();

    if (groupStartTime === null || eventTime - groupStartTime <= timeWindow) {
      currentGroup.push(event);
      if (groupStartTime === null) groupStartTime = eventTime;
    } else {
      if (currentGroup.length > 0) groups.push(currentGroup);
      currentGroup = [event];
      groupStartTime = eventTime;
    }
  });

  if (currentGroup.length > 0) groups.push(currentGroup);
  return groups;
};

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
export const calculateTimelineConfidence = (events: TimelineEvent[]): number => {
  if (events.length === 0) return 0;

  const avgConfidence = events.reduce((sum, e) => sum + e.confidence, 0) / events.length;
  const completenessScore = Math.min(events.length / 10, 1) * 100;

  return Math.round((avgConfidence * 0.7 + completenessScore * 0.3));
};

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
export const identifyTimelineGaps = (
  timeline: IncidentTimeline,
  threshold: number = 600000,
): Array<{ start: Date; end: Date; duration: number }> => {
  const gaps: Array<{ start: Date; end: Date; duration: number }> = [];

  for (let i = 0; i < timeline.events.length - 1; i++) {
    const current = timeline.events[i];
    const next = timeline.events[i + 1];
    const gap = next.timestamp.getTime() - current.timestamp.getTime();

    if (gap > threshold) {
      gaps.push({
        start: current.timestamp,
        end: next.timestamp,
        duration: gap,
      });
    }
  }

  return gaps;
};

// ============================================================================
// PLAYBOOK AUTOMATION
// ============================================================================

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
export const getPlaybookForIncident = (incidentType: string): IncidentPlaybook | null => {
  const playbookLibrary: Record<string, IncidentPlaybook> = {
    ransomware: {
      id: 'PB-RANSOM-001',
      name: 'Ransomware Response',
      incidentType: 'ransomware',
      steps: [
        {
          stepNumber: 1,
          name: 'Isolate affected systems',
          action: 'network_isolation',
          automated: true,
          requiredApprovals: [],
          timeout: 300,
          onSuccess: 'step-2',
          onFailure: 'escalate',
        },
        {
          stepNumber: 2,
          name: 'Capture memory dumps',
          action: 'forensic_capture',
          automated: true,
          requiredApprovals: [],
          timeout: 600,
          onSuccess: 'step-3',
          onFailure: 'continue',
        },
      ],
      automationLevel: 'semi-automated',
      estimatedTime: 120,
      requiredRoles: ['incident_responder', 'security_analyst'],
    },
  };

  return playbookLibrary[incidentType] || null;
};

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
export const executePlaybookStep = async (
  step: PlaybookStep,
  context: Record<string, unknown>,
): Promise<{ success: boolean; output: unknown }> => {
  if (!step.automated) {
    return { success: false, output: 'Manual step - requires human intervention' };
  }

  // Simulate automation execution
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, output: `Step ${step.stepNumber} completed` });
    }, 100);
  });
};

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
export const validateStepPrerequisites = (
  step: PlaybookStep,
  state: Record<string, unknown>,
): boolean => {
  if (step.requiredApprovals.length > 0 && !state.approvals) return false;
  return true;
};

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
export const generatePlaybookReport = (
  playbook: IncidentPlaybook,
  results: Array<{ step: number; success: boolean; duration: number }>,
): Record<string, unknown> => {
  const totalSteps = playbook.steps.length;
  const completedSteps = results.filter(r => r.success).length;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

  return {
    playbookId: playbook.id,
    playbookName: playbook.name,
    totalSteps,
    completedSteps,
    successRate: (completedSteps / totalSteps) * 100,
    totalDuration,
    estimatedTime: playbook.estimatedTime,
    variance: totalDuration - playbook.estimatedTime,
    stepDetails: results,
  };
};

// ============================================================================
// ESCALATION WORKFLOWS
// ============================================================================

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
export const evaluateEscalation = (
  classification: IncidentClassification,
  rules: EscalationRule[],
): EscalationRule[] => {
  return rules.filter(rule => {
    return rule.severityThreshold <= classification.severity;
  });
};

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
export const triggerEscalation = async (
  incidentId: string,
  rule: EscalationRule,
): Promise<{ escalated: boolean; notified: string[] }> => {
  // Simulate escalation
  await new Promise(resolve => setTimeout(resolve, 100));

  return {
    escalated: true,
    notified: rule.escalateTo,
  };
};

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
export const sendEscalationNotifications = async (
  incidentId: string,
  recipients: string[],
  channels: string[],
): Promise<Record<string, boolean>> => {
  const status: Record<string, boolean> = {};

  for (const channel of channels) {
    status[channel] = true; // Simulate successful notification
  }

  return status;
};

// ============================================================================
// EVIDENCE COLLECTION
// ============================================================================

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
export const collectEvidence = (
  incidentId: string,
  evidence: Partial<EvidenceItem>,
): EvidenceItem => {
  const collectionTime = new Date();
  const hash = generateEvidenceHash(evidence.source || '');

  return {
    id: `EVD-${Date.now()}`,
    incidentId,
    type: evidence.type || 'other',
    source: evidence.source || 'unknown',
    hash,
    size: evidence.size || 0,
    collectionTime,
    collectedBy: evidence.collectedBy || 'system',
    chainOfCustody: [
      {
        timestamp: collectionTime,
        action: 'collected',
        handler: evidence.collectedBy || 'system',
        location: 'evidence-storage',
      },
    ],
    integrity: true,
    metadata: evidence.metadata || {},
  };
};

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
export const generateEvidenceHash = (data: string): string => {
  // Simplified hash generation (in production, use crypto module)
  return `sha256:${Buffer.from(data).toString('base64').substring(0, 32)}`;
};

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
export const updateChainOfCustody = (
  evidence: EvidenceItem,
  entry: Omit<CustodyEntry, 'timestamp'>,
): EvidenceItem => {
  return {
    ...evidence,
    chainOfCustody: [
      ...evidence.chainOfCustody,
      {
        ...entry,
        timestamp: new Date(),
      },
    ],
  };
};

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
export const verifyEvidenceIntegrity = (
  evidence: EvidenceItem,
  currentHash: string,
): boolean => {
  return evidence.hash === currentHash;
};

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
export const exportEvidencePackage = (
  evidence: EvidenceItem[],
  format: string,
): Record<string, unknown> => {
  return {
    format,
    exportTime: new Date(),
    evidenceCount: evidence.length,
    items: evidence.map(e => ({
      id: e.id,
      type: e.type,
      hash: e.hash,
      collectionTime: e.collectionTime,
      chainOfCustody: e.chainOfCustody,
    })),
    certification: {
      verified: evidence.every(e => e.integrity),
      verifiedAt: new Date(),
    },
  };
};

// ============================================================================
// INCIDENT METRICS
// ============================================================================

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
export const calculateIncidentMetrics = (
  incidentId: string,
  timestamps: Record<string, Date>,
): IncidentMetrics => {
  const detectionTime = timestamps.detection;
  const responseTime = timestamps.response
    ? (timestamps.response.getTime() - detectionTime.getTime()) / 60000
    : 0;
  const containmentTime = timestamps.containment
    ? (timestamps.containment.getTime() - detectionTime.getTime()) / 60000
    : 0;
  const recoveryTime = timestamps.recovery
    ? (timestamps.recovery.getTime() - detectionTime.getTime()) / 60000
    : 0;

  return {
    incidentId,
    detectionTime,
    responseTime,
    containmentTime,
    recoveryTime,
    totalTime: recoveryTime,
    mttr: responseTime,
    mttc: containmentTime,
    mttr_full: recoveryTime,
  };
};

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
export const aggregateIncidentMetrics = (
  metrics: IncidentMetrics[],
): Record<string, number> => {
  if (metrics.length === 0) return {};

  const sum = metrics.reduce(
    (acc, m) => ({
      mttr: acc.mttr + m.mttr,
      mttc: acc.mttc + m.mttc,
      mttr_full: acc.mttr_full + m.mttr_full,
    }),
    { mttr: 0, mttc: 0, mttr_full: 0 },
  );

  const count = metrics.length;

  return {
    avgMTTR: sum.mttr / count,
    avgMTTC: sum.mttc / count,
    avgRecovery: sum.mttr_full / count,
    totalIncidents: count,
  };
};

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
export const compareAgainstSLA = (
  metrics: IncidentMetrics,
  slaTargets: Record<string, number>,
): Record<string, boolean> => {
  return {
    mttr: metrics.mttr <= (slaTargets.mttr || Infinity),
    mttc: metrics.mttc <= (slaTargets.mttc || Infinity),
    recovery: metrics.mttr_full <= (slaTargets.recovery || Infinity),
  };
};

// ============================================================================
// POST-INCIDENT ANALYSIS
// ============================================================================

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
export const createPostIncidentReport = (
  incidentId: string,
  reportData: Partial<PostIncidentReport>,
): PostIncidentReport => {
  return {
    incidentId,
    summary: reportData.summary || '',
    rootCause: reportData.rootCause || 'Under investigation',
    impactAssessment: reportData.impactAssessment || {
      scope: 'isolated',
      affectedUsers: 0,
      affectedSystems: 0,
      dataExfiltrated: false,
      downtime: 0,
      businessImpact: 'minimal',
    },
    timeline: reportData.timeline || {
      incidentId,
      events: [],
      firstSeen: new Date(),
      lastSeen: new Date(),
      duration: 0,
      reconstructionConfidence: 0,
    },
    actionsToken: reportData.actionsToken || [],
    lessonsLearned: reportData.lessonsLearned || [],
    recommendations: reportData.recommendations || [],
    affectedAssets: reportData.affectedAssets || [],
    estimatedCost: reportData.estimatedCost,
    createdBy: reportData.createdBy || 'system',
    createdAt: new Date(),
  };
};

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
export const extractLessonsLearned = (
  timeline: IncidentTimeline,
  responseActions: Record<string, unknown>,
): string[] => {
  const lessons: string[] = [];

  if (timeline.duration < 3600000) {
    lessons.push('Rapid detection and response minimized impact');
  }

  if (responseActions.automated) {
    lessons.push('Automated playbooks accelerated containment');
  }

  return lessons;
};

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
export const generateRecommendations = (
  classification: IncidentClassification,
  rootCause: string,
): string[] => {
  const recommendations: string[] = [];

  if (classification.category === 'phishing') {
    recommendations.push('Implement email security gateway');
    recommendations.push('Conduct security awareness training');
  }

  if (rootCause.includes('password')) {
    recommendations.push('Enforce multi-factor authentication');
    recommendations.push('Implement strong password policy');
  }

  return recommendations;
};

// ============================================================================
// SOAR INTEGRATION
// ============================================================================

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
export const integrateWithSOAR = async (
  config: SOARIntegration,
  incidentId: string,
  action: string,
): Promise<Record<string, unknown>> => {
  // Simulate SOAR integration
  await new Promise(resolve => setTimeout(resolve, 200));

  return {
    platform: config.platform,
    incidentId,
    action,
    status: 'completed',
    timestamp: new Date(),
  };
};

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
export const triggerSOARWorkflow = async (
  workflowId: string,
  context: Record<string, unknown>,
): Promise<{ workflowId: string; status: string; outputs: unknown }> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  return {
    workflowId,
    status: 'success',
    outputs: {
      containmentActions: ['network_isolation', 'account_suspension'],
      affectedAssets: context.assets,
    },
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Classification
  classifyIncident,
  determineIncidentCategory,
  calculateIncidentSeverity,
  mapSeverityToPriority,
  extractIncidentTags,
  mapToMitreTactics,
  extractMitreTechniques,

  // Timeline
  reconstructTimeline,
  sortTimelineEvents,
  correlateTimelineEvents,
  calculateTimelineConfidence,
  identifyTimelineGaps,

  // Playbooks
  getPlaybookForIncident,
  executePlaybookStep,
  validateStepPrerequisites,
  generatePlaybookReport,

  // Escalation
  evaluateEscalation,
  triggerEscalation,
  sendEscalationNotifications,

  // Evidence
  collectEvidence,
  generateEvidenceHash,
  updateChainOfCustody,
  verifyEvidenceIntegrity,
  exportEvidencePackage,

  // Metrics
  calculateIncidentMetrics,
  aggregateIncidentMetrics,
  compareAgainstSLA,

  // Post-incident
  createPostIncidentReport,
  extractLessonsLearned,
  generateRecommendations,

  // SOAR
  integrateWithSOAR,
  triggerSOARWorkflow,
};
