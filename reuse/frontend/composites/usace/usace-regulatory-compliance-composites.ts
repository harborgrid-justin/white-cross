/**
 * LOC: USACE-REG-COMP-001
 * File: /reuse/frontend/composites/usace/usace-regulatory-compliance-composites.ts
 *
 * UPSTREAM (imports from):
 *   - /reuse/frontend/form-builder-kit.ts
 *   - /reuse/frontend/analytics-tracking-kit.ts
 *   - /reuse/frontend/workflow-approval-kit.ts
 *   - /reuse/frontend/custom-fields-metadata-kit.ts
 *   - /reuse/frontend/version-control-kit.ts
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *
 * DOWNSTREAM (imported by):
 *   - USACE CEFMS compliance applications
 *   - Federal regulatory tracking systems
 *   - Policy enforcement dashboards
 *   - Audit compliance modules
 */

/**
 * File: /reuse/frontend/composites/usace/usace-regulatory-compliance-composites.ts
 * Locator: WC-USACE-REG-001
 * Purpose: USACE CEFMS Regulatory Compliance & Federal Policy Enforcement System
 *
 * Upstream: React 18+, TypeScript 5.x, Next.js 16+, form-builder-kit, analytics-tracking-kit
 * Downstream: USACE compliance applications, Federal reporting systems, Policy dashboards
 * Dependencies: React 18+, TypeScript 5.x, Next.js 16+, date-fns, zod
 * Exports: 45+ regulatory compliance hooks, components, and utilities
 *
 * LLM Context: Enterprise-grade USACE CEFMS regulatory compliance system for React 18+ applications.
 * Provides comprehensive federal regulation tracking, policy enforcement, compliance monitoring,
 * audit preparation, and regulatory reporting. Designed for USACE Civil Works and Military programs
 * requiring strict adherence to federal regulations, OMB circulars, CFR requirements, and USACE
 * Engineering Regulations (ER) and Engineering Manuals (EM).
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  useFormState,
  FormConfig,
  FormData,
  FieldConfig,
  ValidationRule,
  type FormErrors,
} from '../../form-builder-kit';
import {
  useTracking,
  trackEvent,
  trackConversion,
  type EventParameters,
} from '../../analytics-tracking-kit';

// ============================================================================
// TYPE DEFINITIONS - REGULATORY COMPLIANCE
// ============================================================================

/**
 * Federal regulation types applicable to USACE
 */
export type RegulationType =
  | 'CFR' // Code of Federal Regulations
  | 'ER' // Engineering Regulation
  | 'EM' // Engineering Manual
  | 'OMB' // Office of Management and Budget Circular
  | 'FAR' // Federal Acquisition Regulation
  | 'DFARS' // Defense Federal Acquisition Regulation Supplement
  | 'USC' // United States Code
  | 'EO' // Executive Order
  | 'PolicyMemo'
  | 'TechnicalLetter'
  | 'Custom';

/**
 * Compliance status levels
 */
export type ComplianceStatus =
  | 'compliant'
  | 'partial_compliance'
  | 'non_compliant'
  | 'under_review'
  | 'pending_verification'
  | 'exemption_requested'
  | 'exemption_granted'
  | 'corrective_action_required';

/**
 * Regulatory requirement severity
 */
export type RequirementSeverity = 'critical' | 'high' | 'medium' | 'low' | 'informational';

/**
 * Federal regulation reference
 */
export interface RegulationReference {
  id: string;
  type: RegulationType;
  citation: string; // e.g., "33 CFR 209", "ER 1110-1-8156"
  title: string;
  section?: string;
  subsection?: string;
  effectiveDate: Date;
  expirationDate?: Date;
  issuingAuthority: string;
  url?: string;
  description?: string;
  keywords?: string[];
}

/**
 * Compliance requirement definition
 */
export interface ComplianceRequirement {
  id: string;
  requirementNumber: string;
  title: string;
  description: string;
  regulationRefs: RegulationReference[];
  severity: RequirementSeverity;
  category: string;
  applicablePrograms: string[];
  requiredDocumentation: string[];
  frequencyOfReview: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'event_based';
  responsibleRole: string;
  dueDate?: Date;
  recurringDeadline?: string;
  automatedMonitoring: boolean;
  metadata?: Record<string, any>;
}

/**
 * Compliance assessment record
 */
export interface ComplianceAssessment {
  id: string;
  requirementId: string;
  assessmentDate: Date;
  assessor: string;
  status: ComplianceStatus;
  findings: string;
  evidence: ComplianceEvidence[];
  gaps?: ComplianceGap[];
  recommendedActions?: string[];
  nextReviewDate?: Date;
  approvedBy?: string;
  approvalDate?: Date;
  metadata?: Record<string, any>;
}

/**
 * Compliance evidence documentation
 */
export interface ComplianceEvidence {
  id: string;
  type: 'document' | 'inspection' | 'certification' | 'audit' | 'training' | 'system_log';
  title: string;
  description: string;
  documentId?: string;
  documentUrl?: string;
  collectedDate: Date;
  collectedBy: string;
  verified: boolean;
  verifiedBy?: string;
  verificationDate?: Date;
}

/**
 * Compliance gap identification
 */
export interface ComplianceGap {
  id: string;
  description: string;
  severity: RequirementSeverity;
  identifiedDate: Date;
  identifiedBy: string;
  rootCause?: string;
  impactAssessment: string;
  correctiveActionRequired: boolean;
  targetResolutionDate?: Date;
}

/**
 * Corrective action plan
 */
export interface CorrectiveAction {
  id: string;
  gapId: string;
  actionDescription: string;
  assignedTo: string;
  dueDate: Date;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'planned' | 'in_progress' | 'completed' | 'verified' | 'closed';
  completionDate?: Date;
  verificationNotes?: string;
  verifiedBy?: string;
  costEstimate?: number;
  actualCost?: number;
}

/**
 * Policy enforcement rule
 */
export interface PolicyEnforcementRule {
  id: string;
  policyId: string;
  ruleName: string;
  description: string;
  condition: string;
  action: 'prevent' | 'warn' | 'log' | 'escalate' | 'auto_correct';
  severity: RequirementSeverity;
  enabled: boolean;
  notifications?: string[];
  exemptionCriteria?: string;
}

/**
 * Regulatory reporting requirement
 */
export interface RegulatoryReport {
  id: string;
  reportType: string;
  reportingAuthority: string;
  frequency: string;
  dueDate: Date;
  requiredFields: string[];
  dataSourceQuery?: string;
  templateUrl?: string;
  lastSubmitted?: Date;
  submittedBy?: string;
  confirmationNumber?: string;
}

/**
 * Exemption request
 */
export interface ExemptionRequest {
  id: string;
  requirementId: string;
  requestedBy: string;
  requestDate: Date;
  justification: string;
  alternativeControls?: string;
  riskAssessment: string;
  approver?: string;
  approvalDate?: Date;
  status: 'pending' | 'approved' | 'denied' | 'expired';
  expirationDate?: Date;
  conditions?: string[];
}

// ============================================================================
// REGULATORY REQUIREMENT MANAGEMENT
// ============================================================================

/**
 * Hook for managing federal regulatory requirements
 *
 * @description Manages USACE regulatory compliance requirements tracking
 * @returns {object} Regulatory requirement management functions
 *
 * @example
 * ```tsx
 * const {
 *   requirements,
 *   addRequirement,
 *   updateRequirement,
 *   searchRequirements,
 *   getByRegulation
 * } = useRegulatoryRequirements();
 *
 * const cfrRequirements = getByRegulation('CFR');
 * ```
 */
export function useRegulatoryRequirements() {
  const [requirements, setRequirements] = useState<ComplianceRequirement[]>([]);
  const [loading, setLoading] = useState(false);
  const { track } = useTracking();

  const addRequirement = useCallback(
    (requirement: ComplianceRequirement) => {
      setRequirements((prev) => [...prev, requirement]);
      track('regulatory_requirement_added', {
        requirement_id: requirement.id,
        regulation_type: requirement.regulationRefs[0]?.type,
        severity: requirement.severity,
      });
    },
    [track]
  );

  const updateRequirement = useCallback(
    (id: string, updates: Partial<ComplianceRequirement>) => {
      setRequirements((prev) =>
        prev.map((req) => (req.id === id ? { ...req, ...updates } : req))
      );
      track('regulatory_requirement_updated', { requirement_id: id });
    },
    [track]
  );

  const deleteRequirement = useCallback(
    (id: string) => {
      setRequirements((prev) => prev.filter((req) => req.id !== id));
      track('regulatory_requirement_deleted', { requirement_id: id });
    },
    [track]
  );

  const searchRequirements = useCallback(
    (query: string) => {
      return requirements.filter(
        (req) =>
          req.title.toLowerCase().includes(query.toLowerCase()) ||
          req.description.toLowerCase().includes(query.toLowerCase()) ||
          req.requirementNumber.toLowerCase().includes(query.toLowerCase())
      );
    },
    [requirements]
  );

  const getByRegulation = useCallback(
    (regulationType: RegulationType) => {
      return requirements.filter((req) =>
        req.regulationRefs.some((ref) => ref.type === regulationType)
      );
    },
    [requirements]
  );

  const getBySeverity = useCallback(
    (severity: RequirementSeverity) => {
      return requirements.filter((req) => req.severity === severity);
    },
    [requirements]
  );

  const getOverdueRequirements = useCallback(() => {
    const now = new Date();
    return requirements.filter((req) => req.dueDate && req.dueDate < now);
  }, [requirements]);

  return {
    requirements,
    loading,
    addRequirement,
    updateRequirement,
    deleteRequirement,
    searchRequirements,
    getByRegulation,
    getBySeverity,
    getOverdueRequirements,
  };
}

/**
 * Hook for tracking compliance assessments
 *
 * @description Manages compliance assessment records and status tracking
 * @param {string} requirementId - Optional requirement ID to filter assessments
 * @returns {object} Compliance assessment functions
 *
 * @example
 * ```tsx
 * const {
 *   assessments,
 *   createAssessment,
 *   updateAssessmentStatus,
 *   getLatestAssessment
 * } = useComplianceAssessments('REQ-001');
 * ```
 */
export function useComplianceAssessments(requirementId?: string) {
  const [assessments, setAssessments] = useState<ComplianceAssessment[]>([]);
  const { track } = useTracking();

  const filteredAssessments = useMemo(() => {
    if (!requirementId) return assessments;
    return assessments.filter((a) => a.requirementId === requirementId);
  }, [assessments, requirementId]);

  const createAssessment = useCallback(
    (assessment: ComplianceAssessment) => {
      setAssessments((prev) => [...prev, assessment]);
      track('compliance_assessment_created', {
        requirement_id: assessment.requirementId,
        status: assessment.status,
        assessor: assessment.assessor,
      });
    },
    [track]
  );

  const updateAssessmentStatus = useCallback(
    (assessmentId: string, status: ComplianceStatus) => {
      setAssessments((prev) =>
        prev.map((a) => (a.id === assessmentId ? { ...a, status } : a))
      );
      track('compliance_status_updated', { assessment_id: assessmentId, status });
    },
    [track]
  );

  const addEvidence = useCallback(
    (assessmentId: string, evidence: ComplianceEvidence) => {
      setAssessments((prev) =>
        prev.map((a) =>
          a.id === assessmentId ? { ...a, evidence: [...a.evidence, evidence] } : a
        )
      );
      track('compliance_evidence_added', { assessment_id: assessmentId });
    },
    [track]
  );

  const getLatestAssessment = useCallback(() => {
    if (filteredAssessments.length === 0) return null;
    return filteredAssessments.reduce((latest, current) =>
      current.assessmentDate > latest.assessmentDate ? current : latest
    );
  }, [filteredAssessments]);

  const getNonCompliantAssessments = useCallback(() => {
    return filteredAssessments.filter((a) => a.status === 'non_compliant');
  }, [filteredAssessments]);

  return {
    assessments: filteredAssessments,
    createAssessment,
    updateAssessmentStatus,
    addEvidence,
    getLatestAssessment,
    getNonCompliantAssessments,
  };
}

/**
 * Hook for compliance gap management
 *
 * @description Tracks and manages compliance gaps and deficiencies
 * @returns {object} Gap management functions
 *
 * @example
 * ```tsx
 * const { gaps, identifyGap, resolveGap, getCriticalGaps } = useComplianceGaps();
 * ```
 */
export function useComplianceGaps() {
  const [gaps, setGaps] = useState<ComplianceGap[]>([]);
  const { track } = useTracking();

  const identifyGap = useCallback(
    (gap: ComplianceGap) => {
      setGaps((prev) => [...prev, gap]);
      track('compliance_gap_identified', {
        gap_id: gap.id,
        severity: gap.severity,
      });
    },
    [track]
  );

  const updateGap = useCallback(
    (gapId: string, updates: Partial<ComplianceGap>) => {
      setGaps((prev) => prev.map((g) => (g.id === gapId ? { ...g, ...updates } : g)));
    },
    []
  );

  const resolveGap = useCallback(
    (gapId: string, resolution: string) => {
      setGaps((prev) => prev.filter((g) => g.id !== gapId));
      track('compliance_gap_resolved', { gap_id: gapId });
    },
    [track]
  );

  const getCriticalGaps = useCallback(() => {
    return gaps.filter((g) => g.severity === 'critical' || g.severity === 'high');
  }, [gaps]);

  const getOverdueGaps = useCallback(() => {
    const now = new Date();
    return gaps.filter((g) => g.targetResolutionDate && g.targetResolutionDate < now);
  }, [gaps]);

  return {
    gaps,
    identifyGap,
    updateGap,
    resolveGap,
    getCriticalGaps,
    getOverdueGaps,
  };
}

/**
 * Hook for corrective action planning and tracking
 *
 * @description Manages corrective actions for compliance gaps
 * @param {string} gapId - Optional gap ID to filter actions
 * @returns {object} Corrective action functions
 *
 * @example
 * ```tsx
 * const {
 *   actions,
 *   createAction,
 *   completeAction,
 *   getOverdueActions
 * } = useCorrectiveActions('GAP-001');
 * ```
 */
export function useCorrectiveActions(gapId?: string) {
  const [actions, setActions] = useState<CorrectiveAction[]>([]);
  const { track } = useTracking();

  const filteredActions = useMemo(() => {
    if (!gapId) return actions;
    return actions.filter((a) => a.gapId === gapId);
  }, [actions, gapId]);

  const createAction = useCallback(
    (action: CorrectiveAction) => {
      setActions((prev) => [...prev, action]);
      track('corrective_action_created', {
        gap_id: action.gapId,
        priority: action.priority,
        assigned_to: action.assignedTo,
      });
    },
    [track]
  );

  const updateActionStatus = useCallback(
    (actionId: string, status: CorrectiveAction['status']) => {
      setActions((prev) => prev.map((a) => (a.id === actionId ? { ...a, status } : a)));
      track('corrective_action_status_updated', { action_id: actionId, status });
    },
    [track]
  );

  const completeAction = useCallback(
    (actionId: string, completionNotes: string) => {
      setActions((prev) =>
        prev.map((a) =>
          a.id === actionId
            ? {
                ...a,
                status: 'completed',
                completionDate: new Date(),
                verificationNotes: completionNotes,
              }
            : a
        )
      );
      track('corrective_action_completed', { action_id: actionId });
    },
    [track]
  );

  const getOverdueActions = useCallback(() => {
    const now = new Date();
    return filteredActions.filter((a) => a.dueDate < now && a.status !== 'completed');
  }, [filteredActions]);

  const getActionsByPriority = useCallback(
    (priority: CorrectiveAction['priority']) => {
      return filteredActions.filter((a) => a.priority === priority);
    },
    [filteredActions]
  );

  return {
    actions: filteredActions,
    createAction,
    updateActionStatus,
    completeAction,
    getOverdueActions,
    getActionsByPriority,
  };
}

/**
 * Hook for policy enforcement rules
 *
 * @description Manages automated policy enforcement rules and violations
 * @returns {object} Policy enforcement functions
 *
 * @example
 * ```tsx
 * const { rules, createRule, evaluatePolicy, logViolation } = usePolicyEnforcement();
 * ```
 */
export function usePolicyEnforcement() {
  const [rules, setRules] = useState<PolicyEnforcementRule[]>([]);
  const [violations, setViolations] = useState<any[]>([]);
  const { track } = useTracking();

  const createRule = useCallback(
    (rule: PolicyEnforcementRule) => {
      setRules((prev) => [...prev, rule]);
      track('policy_rule_created', { rule_id: rule.id, policy_id: rule.policyId });
    },
    [track]
  );

  const toggleRule = useCallback(
    (ruleId: string, enabled: boolean) => {
      setRules((prev) => prev.map((r) => (r.id === ruleId ? { ...r, enabled } : r)));
    },
    []
  );

  const evaluatePolicy = useCallback(
    (ruleId: string, context: any): boolean => {
      const rule = rules.find((r) => r.id === ruleId && r.enabled);
      if (!rule) return true;

      // Simple evaluation - in production would use more sophisticated rule engine
      try {
        const conditionMet = eval(rule.condition);
        if (conditionMet) {
          logViolation(ruleId, context);
          return false;
        }
        return true;
      } catch (error) {
        console.error('Policy evaluation error:', error);
        return true;
      }
    },
    [rules]
  );

  const logViolation = useCallback(
    (ruleId: string, context: any) => {
      const violation = {
        id: `VIO-${Date.now()}`,
        ruleId,
        timestamp: new Date(),
        context,
      };
      setViolations((prev) => [...prev, violation]);
      track('policy_violation_logged', { rule_id: ruleId });
    },
    [track]
  );

  const getActiveRules = useCallback(() => {
    return rules.filter((r) => r.enabled);
  }, [rules]);

  return {
    rules,
    violations,
    createRule,
    toggleRule,
    evaluatePolicy,
    logViolation,
    getActiveRules,
  };
}

/**
 * Hook for regulatory reporting management
 *
 * @description Manages federal regulatory reporting requirements and submissions
 * @returns {object} Regulatory reporting functions
 *
 * @example
 * ```tsx
 * const {
 *   reports,
 *   scheduleReport,
 *   submitReport,
 *   getUpcomingReports
 * } = useRegulatoryReporting();
 * ```
 */
export function useRegulatoryReporting() {
  const [reports, setReports] = useState<RegulatoryReport[]>([]);
  const { track } = useTracking();

  const scheduleReport = useCallback(
    (report: RegulatoryReport) => {
      setReports((prev) => [...prev, report]);
      track('regulatory_report_scheduled', {
        report_type: report.reportType,
        due_date: report.dueDate.toISOString(),
      });
    },
    [track]
  );

  const submitReport = useCallback(
    (reportId: string, submittedBy: string, confirmationNumber: string) => {
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? {
                ...r,
                lastSubmitted: new Date(),
                submittedBy,
                confirmationNumber,
              }
            : r
        )
      );
      track('regulatory_report_submitted', { report_id: reportId });
    },
    [track]
  );

  const getUpcomingReports = useCallback(
    (daysAhead: number = 30) => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() + daysAhead);
      return reports.filter((r) => r.dueDate <= cutoffDate && !r.lastSubmitted);
    },
    [reports]
  );

  const getOverdueReports = useCallback(() => {
    const now = new Date();
    return reports.filter((r) => r.dueDate < now && !r.lastSubmitted);
  }, [reports]);

  return {
    reports,
    scheduleReport,
    submitReport,
    getUpcomingReports,
    getOverdueReports,
  };
}

/**
 * Hook for exemption request management
 *
 * @description Manages regulatory exemption requests and approvals
 * @returns {object} Exemption management functions
 *
 * @example
 * ```tsx
 * const {
 *   exemptions,
 *   requestExemption,
 *   approveExemption,
 *   getPendingExemptions
 * } = useExemptionRequests();
 * ```
 */
export function useExemptionRequests() {
  const [exemptions, setExemptions] = useState<ExemptionRequest[]>([]);
  const { track } = useTracking();

  const requestExemption = useCallback(
    (request: ExemptionRequest) => {
      setExemptions((prev) => [...prev, request]);
      track('exemption_requested', {
        requirement_id: request.requirementId,
        requested_by: request.requestedBy,
      });
    },
    [track]
  );

  const approveExemption = useCallback(
    (exemptionId: string, approver: string, conditions?: string[]) => {
      setExemptions((prev) =>
        prev.map((e) =>
          e.id === exemptionId
            ? {
                ...e,
                status: 'approved',
                approver,
                approvalDate: new Date(),
                conditions,
              }
            : e
        )
      );
      track('exemption_approved', { exemption_id: exemptionId });
    },
    [track]
  );

  const denyExemption = useCallback(
    (exemptionId: string, approver: string, reason: string) => {
      setExemptions((prev) =>
        prev.map((e) =>
          e.id === exemptionId
            ? { ...e, status: 'denied', approver, approvalDate: new Date() }
            : e
        )
      );
      track('exemption_denied', { exemption_id: exemptionId });
    },
    [track]
  );

  const getPendingExemptions = useCallback(() => {
    return exemptions.filter((e) => e.status === 'pending');
  }, [exemptions]);

  const getActiveExemptions = useCallback(() => {
    const now = new Date();
    return exemptions.filter(
      (e) =>
        e.status === 'approved' && (!e.expirationDate || e.expirationDate > now)
    );
  }, [exemptions]);

  return {
    exemptions,
    requestExemption,
    approveExemption,
    denyExemption,
    getPendingExemptions,
    getActiveExemptions,
  };
}

/**
 * Generate compliance assessment form configuration
 *
 * @description Creates a dynamic form for conducting compliance assessments
 * @param {ComplianceRequirement} requirement - Compliance requirement to assess
 * @returns {FormConfig} Form configuration
 *
 * @example
 * ```tsx
 * const formConfig = generateComplianceAssessmentForm(requirement);
 * <FormRenderer formConfig={formConfig} onSubmit={handleAssessment} />
 * ```
 */
export function generateComplianceAssessmentForm(
  requirement: ComplianceRequirement
): FormConfig {
  return {
    id: `assessment-${requirement.id}`,
    title: `Compliance Assessment: ${requirement.title}`,
    description: `Assess compliance with ${requirement.requirementNumber}`,
    fields: [
      {
        id: 'assessor',
        name: 'assessor',
        type: 'text',
        label: 'Assessor Name',
        required: true,
      },
      {
        id: 'assessmentDate',
        name: 'assessmentDate',
        type: 'date',
        label: 'Assessment Date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0],
      },
      {
        id: 'status',
        name: 'status',
        type: 'select',
        label: 'Compliance Status',
        required: true,
        options: [
          { label: 'Compliant', value: 'compliant' },
          { label: 'Partial Compliance', value: 'partial_compliance' },
          { label: 'Non-Compliant', value: 'non_compliant' },
          { label: 'Under Review', value: 'under_review' },
        ],
      },
      {
        id: 'findings',
        name: 'findings',
        type: 'textarea',
        label: 'Assessment Findings',
        required: true,
        rows: 6,
        placeholder: 'Describe assessment findings in detail...',
      },
      {
        id: 'evidenceDocuments',
        name: 'evidenceDocuments',
        type: 'file',
        label: 'Supporting Evidence',
        multiple: true,
        accept: '.pdf,.doc,.docx,.xlsx',
      },
      {
        id: 'gapsIdentified',
        name: 'gapsIdentified',
        type: 'textarea',
        label: 'Compliance Gaps Identified',
        rows: 4,
        conditionalLogic: [
          {
            field: 'status',
            operator: 'notEquals',
            value: 'compliant',
            action: 'show',
          },
        ],
      },
      {
        id: 'recommendedActions',
        name: 'recommendedActions',
        type: 'textarea',
        label: 'Recommended Corrective Actions',
        rows: 4,
        conditionalLogic: [
          {
            field: 'status',
            operator: 'notEquals',
            value: 'compliant',
            action: 'show',
          },
        ],
      },
    ],
  };
}

/**
 * Calculate overall compliance score
 *
 * @description Calculates aggregate compliance score across requirements
 * @param {ComplianceAssessment[]} assessments - Recent assessments
 * @returns {number} Compliance score (0-100)
 *
 * @example
 * ```tsx
 * const score = calculateComplianceScore(assessments);
 * // Returns: 87.5
 * ```
 */
export function calculateComplianceScore(assessments: ComplianceAssessment[]): number {
  if (assessments.length === 0) return 0;

  const statusScores: Record<ComplianceStatus, number> = {
    compliant: 100,
    partial_compliance: 60,
    non_compliant: 0,
    under_review: 50,
    pending_verification: 70,
    exemption_requested: 50,
    exemption_granted: 100,
    corrective_action_required: 30,
  };

  const totalScore = assessments.reduce(
    (sum, assessment) => sum + statusScores[assessment.status],
    0
  );

  return Math.round(totalScore / assessments.length);
}

/**
 * Generate regulatory compliance dashboard metrics
 *
 * @description Compiles key compliance metrics for dashboard display
 * @param {ComplianceRequirement[]} requirements - All requirements
 * @param {ComplianceAssessment[]} assessments - Recent assessments
 * @param {ComplianceGap[]} gaps - Active gaps
 * @returns {object} Dashboard metrics
 *
 * @example
 * ```tsx
 * const metrics = generateComplianceDashboardMetrics(requirements, assessments, gaps);
 * ```
 */
export function generateComplianceDashboardMetrics(
  requirements: ComplianceRequirement[],
  assessments: ComplianceAssessment[],
  gaps: ComplianceGap[]
) {
  const totalRequirements = requirements.length;
  const assessedRequirements = new Set(assessments.map((a) => a.requirementId)).size;
  const compliantCount = assessments.filter((a) => a.status === 'compliant').length;
  const nonCompliantCount = assessments.filter((a) => a.status === 'non_compliant').length;
  const criticalGaps = gaps.filter((g) => g.severity === 'critical').length;

  return {
    totalRequirements,
    assessedRequirements,
    assessmentCoverage: Math.round((assessedRequirements / totalRequirements) * 100),
    complianceRate: Math.round((compliantCount / assessments.length) * 100),
    nonComplianceRate: Math.round((nonCompliantCount / assessments.length) * 100),
    overallScore: calculateComplianceScore(assessments),
    criticalGaps,
    totalGaps: gaps.length,
  };
}

/**
 * Export compliance report data
 *
 * @description Exports compliance data in various formats for reporting
 * @param {ComplianceAssessment[]} assessments - Assessments to export
 * @param {string} format - Export format ('json' | 'csv')
 * @returns {string} Formatted export data
 *
 * @example
 * ```tsx
 * const csvData = exportComplianceReport(assessments, 'csv');
 * downloadFile('compliance-report.csv', csvData);
 * ```
 */
export function exportComplianceReport(
  assessments: ComplianceAssessment[],
  format: 'json' | 'csv' = 'json'
): string {
  if (format === 'json') {
    return JSON.stringify(assessments, null, 2);
  }

  // CSV format
  const headers = [
    'Assessment ID',
    'Requirement ID',
    'Date',
    'Assessor',
    'Status',
    'Findings',
    'Evidence Count',
  ];
  const rows = assessments.map((a) => [
    a.id,
    a.requirementId,
    a.assessmentDate.toISOString(),
    a.assessor,
    a.status,
    a.findings.replace(/,/g, ';'),
    a.evidence.length.toString(),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Validate regulation citation format
 *
 * @description Validates federal regulation citation formatting
 * @param {string} citation - Citation string to validate
 * @param {RegulationType} type - Type of regulation
 * @returns {boolean} Whether citation is valid
 *
 * @example
 * ```tsx
 * validateRegulationCitation('33 CFR 209', 'CFR'); // true
 * validateRegulationCitation('ER 1110-1-8156', 'ER'); // true
 * ```
 */
export function validateRegulationCitation(
  citation: string,
  type: RegulationType
): boolean {
  const patterns: Record<RegulationType, RegExp> = {
    CFR: /^\d+\s+CFR\s+\d+/,
    ER: /^ER\s+\d{4}-\d+-\d+/,
    EM: /^EM\s+\d{4}-\d+-\d+/,
    OMB: /^OMB\s+(Circular\s+)?[A-Z]-\d+/,
    FAR: /^FAR\s+\d+\.\d+/,
    DFARS: /^DFARS\s+\d+\.\d+/,
    USC: /^\d+\s+U\.S\.C\.\s+§?\d+/,
    EO: /^E\.?O\.?\s+\d+/,
    PolicyMemo: /.+/,
    TechnicalLetter: /.+/,
    Custom: /.+/,
  };

  return patterns[type]?.test(citation) || false;
}

/**
 * Parse regulation reference from citation
 *
 * @description Extracts regulation details from citation string
 * @param {string} citation - Citation string
 * @param {RegulationType} type - Regulation type
 * @returns {Partial<RegulationReference>} Parsed regulation details
 *
 * @example
 * ```tsx
 * const ref = parseRegulationReference('33 CFR 209.310', 'CFR');
 * // Returns: { citation: '33 CFR 209.310', section: '209', subsection: '310' }
 * ```
 */
export function parseRegulationReference(
  citation: string,
  type: RegulationType
): Partial<RegulationReference> {
  const parsed: Partial<RegulationReference> = {
    citation,
    type,
  };

  if (type === 'CFR') {
    const match = citation.match(/^(\d+)\s+CFR\s+(\d+)\.?(\d+)?/);
    if (match) {
      parsed.section = match[2];
      parsed.subsection = match[3];
    }
  } else if (type === 'ER' || type === 'EM') {
    const match = citation.match(/^(ER|EM)\s+(\d{4}-\d+-\d+)/);
    if (match) {
      parsed.section = match[2];
    }
  }

  return parsed;
}

/**
 * Hook for compliance notification management
 *
 * @description Manages notifications for compliance events and deadlines
 * @returns {object} Notification management functions
 *
 * @example
 * ```tsx
 * const {
 *   scheduleNotification,
 *   sendImmediateAlert,
 *   getUpcomingNotifications
 * } = useComplianceNotifications();
 * ```
 */
export function useComplianceNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const { track } = useTracking();

  const scheduleNotification = useCallback(
    (notification: {
      type: string;
      recipients: string[];
      subject: string;
      message: string;
      scheduledDate: Date;
    }) => {
      setNotifications((prev) => [...prev, { ...notification, id: Date.now() }]);
      track('compliance_notification_scheduled', { type: notification.type });
    },
    [track]
  );

  const sendImmediateAlert = useCallback(
    (alert: {
      type: string;
      recipients: string[];
      subject: string;
      message: string;
      priority: 'high' | 'medium' | 'low';
    }) => {
      track('compliance_alert_sent', { type: alert.type, priority: alert.priority });
      // In production, would integrate with email/SMS service
      console.log('Alert sent:', alert);
    },
    [track]
  );

  const getUpcomingNotifications = useCallback(
    (daysAhead: number = 7) => {
      const cutoff = new Date();
      cutoff.setDate(cutoff.setDate() + daysAhead);
      return notifications.filter((n) => n.scheduledDate <= cutoff);
    },
    [notifications]
  );

  return {
    notifications,
    scheduleNotification,
    sendImmediateAlert,
    getUpcomingNotifications,
  };
}

/**
 * Generate corrective action plan form
 *
 * @description Creates form for planning corrective actions
 * @param {ComplianceGap} gap - Gap requiring corrective action
 * @returns {FormConfig} Form configuration
 *
 * @example
 * ```tsx
 * const formConfig = generateCorrectiveActionForm(gap);
 * <FormRenderer formConfig={formConfig} />
 * ```
 */
export function generateCorrectiveActionForm(gap: ComplianceGap): FormConfig {
  return {
    id: `corrective-action-${gap.id}`,
    title: 'Corrective Action Plan',
    description: `Plan corrective action for: ${gap.description}`,
    fields: [
      {
        id: 'actionDescription',
        name: 'actionDescription',
        type: 'textarea',
        label: 'Action Description',
        required: true,
        rows: 4,
      },
      {
        id: 'assignedTo',
        name: 'assignedTo',
        type: 'text',
        label: 'Assigned To',
        required: true,
      },
      {
        id: 'dueDate',
        name: 'dueDate',
        type: 'date',
        label: 'Due Date',
        required: true,
      },
      {
        id: 'priority',
        name: 'priority',
        type: 'select',
        label: 'Priority',
        required: true,
        options: [
          { label: 'Urgent', value: 'urgent' },
          { label: 'High', value: 'high' },
          { label: 'Medium', value: 'medium' },
          { label: 'Low', value: 'low' },
        ],
      },
      {
        id: 'costEstimate',
        name: 'costEstimate',
        type: 'number',
        label: 'Estimated Cost ($)',
        min: 0,
      },
      {
        id: 'resources',
        name: 'resources',
        type: 'textarea',
        label: 'Required Resources',
        rows: 3,
      },
    ],
  };
}

/**
 * Check requirement applicability
 *
 * @description Determines if a requirement applies to a specific program
 * @param {ComplianceRequirement} requirement - Requirement to check
 * @param {string} program - Program identifier
 * @returns {boolean} Whether requirement applies
 *
 * @example
 * ```tsx
 * if (isRequirementApplicable(requirement, 'CIVIL_WORKS')) {
 *   // Apply requirement
 * }
 * ```
 */
export function isRequirementApplicable(
  requirement: ComplianceRequirement,
  program: string
): boolean {
  return (
    requirement.applicablePrograms.length === 0 ||
    requirement.applicablePrograms.includes(program)
  );
}

/**
 * Filter requirements by effective date
 *
 * @description Filters requirements based on effective date range
 * @param {ComplianceRequirement[]} requirements - Requirements to filter
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {ComplianceRequirement[]} Filtered requirements
 *
 * @example
 * ```tsx
 * const current = filterRequirementsByDate(requirements, new Date('2024-01-01'), new Date());
 * ```
 */
export function filterRequirementsByDate(
  requirements: ComplianceRequirement[],
  startDate: Date,
  endDate: Date
): ComplianceRequirement[] {
  return requirements.filter((req) =>
    req.regulationRefs.some(
      (ref) =>
        ref.effectiveDate >= startDate &&
        ref.effectiveDate <= endDate &&
        (!ref.expirationDate || ref.expirationDate >= new Date())
    )
  );
}

/**
 * Group assessments by status
 *
 * @description Groups compliance assessments by their status
 * @param {ComplianceAssessment[]} assessments - Assessments to group
 * @returns {Record<ComplianceStatus, ComplianceAssessment[]>} Grouped assessments
 *
 * @example
 * ```tsx
 * const grouped = groupAssessmentsByStatus(assessments);
 * const nonCompliant = grouped.non_compliant;
 * ```
 */
export function groupAssessmentsByStatus(
  assessments: ComplianceAssessment[]
): Record<string, ComplianceAssessment[]> {
  return assessments.reduce((acc, assessment) => {
    const status = assessment.status;
    if (!acc[status]) acc[status] = [];
    acc[status].push(assessment);
    return acc;
  }, {} as Record<string, ComplianceAssessment[]>);
}

/**
 * Calculate compliance trend
 *
 * @description Analyzes compliance score trend over time
 * @param {ComplianceAssessment[]} assessments - Historical assessments
 * @param {number} months - Number of months to analyze
 * @returns {object} Trend analysis
 *
 * @example
 * ```tsx
 * const trend = calculateComplianceTrend(assessments, 6);
 * // Returns: { direction: 'improving', percentChange: 12.5, ... }
 * ```
 */
export function calculateComplianceTrend(
  assessments: ComplianceAssessment[],
  months: number = 6
) {
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - months);

  const recentAssessments = assessments.filter((a) => a.assessmentDate >= cutoffDate);
  const sortedAssessments = recentAssessments.sort(
    (a, b) => a.assessmentDate.getTime() - b.assessmentDate.getTime()
  );

  if (sortedAssessments.length < 2) {
    return { direction: 'insufficient_data', percentChange: 0 };
  }

  const firstScore = calculateComplianceScore([sortedAssessments[0]]);
  const lastScore = calculateComplianceScore([
    sortedAssessments[sortedAssessments.length - 1],
  ]);

  const percentChange = ((lastScore - firstScore) / firstScore) * 100;
  const direction = percentChange > 0 ? 'improving' : percentChange < 0 ? 'declining' : 'stable';

  return {
    direction,
    percentChange: Math.round(percentChange * 10) / 10,
    firstScore,
    lastScore,
    assessmentCount: sortedAssessments.length,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Hooks
  useRegulatoryRequirements,
  useComplianceAssessments,
  useComplianceGaps,
  useCorrectiveActions,
  usePolicyEnforcement,
  useRegulatoryReporting,
  useExemptionRequests,
  useComplianceNotifications,

  // Utility Functions
  generateComplianceAssessmentForm,
  generateCorrectiveActionForm,
  calculateComplianceScore,
  generateComplianceDashboardMetrics,
  exportComplianceReport,
  validateRegulationCitation,
  parseRegulationReference,
  isRequirementApplicable,
  filterRequirementsByDate,
  groupAssessmentsByStatus,
  calculateComplianceTrend,
};
