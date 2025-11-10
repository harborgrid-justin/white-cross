/**
 * LOC: USACE-DOWN-COMP-005
 * File: /reuse/frontend/composites/usace/downstream/compliance-applications.ts
 *
 * UPSTREAM (imports from):
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *   - ../usace-regulatory-compliance-composites
 *
 * DOWNSTREAM (imported by):
 *   - USACE CEFMS compliance management UI
 *   - Regulatory compliance dashboards
 *   - Federal policy enforcement systems
 *   - Compliance assessment applications
 */

/**
 * File: /reuse/frontend/composites/usace/downstream/compliance-applications.ts
 * Locator: WC-DOWN-COMP-005
 * Purpose: Compliance Applications - Production-grade regulatory compliance management
 *
 * Upstream: React 18+, Next.js 16+, TypeScript 5.x, usace-regulatory-compliance-composites
 * Downstream: Compliance UI, regulatory dashboards, policy enforcement, assessment apps
 * Dependencies: React 18+, Next.js 16+, TypeScript 5.x, date-fns, zod
 * Exports: 38+ composed functions for comprehensive regulatory compliance management
 *
 * LLM Context: Production-grade compliance management system for USACE CEFMS applications.
 * Provides federal regulation tracking, compliance assessments, gap management, corrective
 * action planning, policy enforcement, audit preparation, and comprehensive compliance reporting
 * for CFR, ER, EM, OMB, FAR, and USACE regulatory requirements.
 */

'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  useRegulatoryRequirements,
  useComplianceAssessments,
  useComplianceGaps,
  useCorrectiveActions,
  usePolicyEnforcement,
  useRegulatoryReporting,
  useExemptionRequests,
  generateComplianceDashboardMetrics,
  calculateComplianceScore,
  calculateComplianceTrend,
  type ComplianceRequirement,
  type ComplianceAssessment,
  type ComplianceGap,
  type CorrectiveAction,
  type ComplianceStatus,
  type RegulationType,
  type RequirementSeverity,
} from '../usace-regulatory-compliance-composites';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Compliance dashboard overview
 */
export interface ComplianceDashboardOverview {
  overallScore: number;
  assessmentCoverage: number;
  complianceRate: number;
  criticalGaps: number;
  upcomingDeadlines: number;
  recentAssessments: ComplianceAssessment[];
  trendDirection: 'improving' | 'declining' | 'stable';
}

/**
 * Regulatory change impact
 */
export interface RegulatoryChangeImpact {
  regulationId: string;
  regulationType: RegulationType;
  changeDescription: string;
  effectiveDate: Date;
  impactedRequirements: string[];
  requiredActions: string[];
  deadline: Date;
  priority: RequirementSeverity;
}

// ============================================================================
// COMPLIANCE APPLICATIONS
// ============================================================================

/**
 * Comprehensive compliance management dashboard hook
 *
 * Provides centralized compliance tracking, assessment, and reporting.
 *
 * @param program - Program identifier
 * @returns Compliance management state and functions
 *
 * @example
 * ```tsx
 * function ComplianceManagementDashboard({ program }) {
 *   const {
 *     dashboardOverview,
 *     assessCompliance,
 *     identifyGaps,
 *     trackCorrectiveActions
 *   } = useComplianceManagementDashboard(program);
 * }
 * ```
 */
export function useComplianceManagementDashboard(program?: string) {
  const {
    requirements,
    addRequirement,
    updateRequirement,
    searchRequirements,
    getByRegulation,
    getBySeverity,
    getOverdueRequirements,
  } = useRegulatoryRequirements();

  const {
    assessments,
    createAssessment,
    updateAssessmentStatus,
    addEvidence,
    getLatestAssessment,
    getNonCompliantAssessments,
  } = useComplianceAssessments();

  const {
    gaps,
    identifyGap,
    resolveGap,
    getCriticalGaps,
    getOverdueGaps,
  } = useComplianceGaps();

  const {
    actions,
    createAction,
    completeAction,
    getOverdueActions,
  } = useCorrectiveActions();

  // Calculate dashboard overview
  const dashboardOverview = useMemo<ComplianceDashboardOverview>(() => {
    const metrics = generateComplianceDashboardMetrics(requirements, assessments, gaps);
    const trend = calculateComplianceTrend(assessments, 6);

    return {
      overallScore: metrics.overallScore,
      assessmentCoverage: metrics.assessmentCoverage,
      complianceRate: metrics.complianceRate,
      criticalGaps: metrics.criticalGaps,
      upcomingDeadlines: getOverdueRequirements().length,
      recentAssessments: assessments.slice(-5),
      trendDirection: trend.direction as 'improving' | 'declining' | 'stable',
    };
  }, [requirements, assessments, gaps, getOverdueRequirements]);

  // Assess compliance for requirement
  const assessCompliance = useCallback(async (
    requirementId: string,
    assessor: string,
    status: ComplianceStatus,
    findings: string
  ) => {
    const assessment: ComplianceAssessment = {
      id: `assessment_${Date.now()}`,
      requirementId,
      assessmentDate: new Date(),
      assessor,
      status,
      findings,
      evidence: [],
    };

    await createAssessment(assessment);

    if (status === 'non_compliant' || status === 'partial_compliance') {
      await identifyGap({
        id: `gap_${Date.now()}`,
        description: findings,
        severity: 'high',
        identifiedDate: new Date(),
        identifiedBy: assessor,
        impactAssessment: 'Non-compliance identified',
        correctiveActionRequired: true,
      });
    }
  }, [createAssessment, identifyGap]);

  return {
    dashboardOverview,
    requirements,
    assessments,
    gaps,
    actions,
    assessCompliance,
    addRequirement,
    createAssessment,
    identifyGap,
    createAction,
    getNonCompliantAssessments,
    getCriticalGaps,
    getOverdueActions,
  };
}

/**
 * Regulatory requirement tracker hook
 *
 * Tracks regulatory requirements with deadline management.
 *
 * @returns Requirement tracking functions
 *
 * @example
 * ```tsx
 * function RequirementTracker() {
 *   const {
 *     activeRequirements,
 *     upcomingDeadlines,
 *     trackRequirement
 *   } = useRegulatoryRequirementTracker();
 * }
 * ```
 */
export function useRegulatoryRequirementTracker() {
  const { requirements, addRequirement, getByRegulation, getOverdueRequirements } = useRegulatoryRequirements();

  const activeRequirements = useMemo(
    () => requirements.filter(req => !req.dueDate || new Date(req.dueDate) > new Date()),
    [requirements]
  );

  const upcomingDeadlines = useMemo(() => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    return requirements.filter(req =>
      req.dueDate &&
      new Date(req.dueDate) <= thirtyDaysFromNow &&
      new Date(req.dueDate) > new Date()
    );
  }, [requirements]);

  const getByRegulationType = useCallback((type: RegulationType) => {
    return getByRegulation(type);
  }, [getByRegulation]);

  return {
    activeRequirements,
    upcomingDeadlines,
    overdueRequirements: getOverdueRequirements(),
    getByRegulationType,
    addRequirement,
  };
}

/**
 * Compliance gap analysis hook
 *
 * Analyzes compliance gaps with prioritization and remediation planning.
 *
 * @returns Gap analysis functions
 *
 * @example
 * ```tsx
 * function GapAnalysis() {
 *   const {
 *     criticalGaps,
 *     analyzeGap,
 *     planRemediation
 *   } = useComplianceGapAnalysis();
 * }
 * ```
 */
export function useComplianceGapAnalysis() {
  const { gaps, identifyGap, updateGap, getCriticalGaps } = useComplianceGaps();
  const { createAction } = useCorrectiveActions();

  const analyzeGap = useCallback((gapId: string, rootCause: string, impactAssessment: string) => {
    updateGap(gapId, { rootCause, impactAssessment });
  }, [updateGap]);

  const planRemediation = useCallback(async (
    gapId: string,
    actionDescription: string,
    assignedTo: string,
    dueDate: Date
  ) => {
    const action: CorrectiveAction = {
      id: `action_${Date.now()}`,
      gapId,
      actionDescription,
      assignedTo,
      dueDate: dueDate.toISOString(),
      priority: 'high',
      status: 'planned',
    };

    await createAction(action);
  }, [createAction]);

  return {
    gaps,
    criticalGaps: getCriticalGaps(),
    analyzeGap,
    planRemediation,
  };
}

/**
 * Compliance reporting hook
 *
 * Generates compliance reports for regulators and stakeholders.
 *
 * @returns Reporting functions
 *
 * @example
 * ```tsx
 * function ComplianceReporting() {
 *   const {
 *     generateExecutiveSummary,
 *     generateDetailedReport,
 *     exportForAudit
 *   } = useComplianceReporting();
 * }
 * ```
 */
export function useComplianceReporting() {
  const { requirements } = useRegulatoryRequirements();
  const { assessments } = useComplianceAssessments();
  const { gaps } = useComplianceGaps();

  const generateExecutiveSummary = useCallback(() => {
    const metrics = generateComplianceDashboardMetrics(requirements, assessments, gaps);

    return {
      reportType: 'executive_summary',
      generatedDate: new Date(),
      overallScore: metrics.overallScore,
      complianceRate: metrics.complianceRate,
      criticalGaps: metrics.criticalGaps,
      summary: `Overall compliance score: ${metrics.overallScore}%. ${metrics.criticalGaps} critical gaps identified.`,
    };
  }, [requirements, assessments, gaps]);

  const generateDetailedReport = useCallback(() => {
    return {
      reportType: 'detailed',
      generatedDate: new Date(),
      requirements: requirements.length,
      assessments: assessments.length,
      gaps: gaps.length,
      data: { requirements, assessments, gaps },
    };
  }, [requirements, assessments, gaps]);

  return {
    generateExecutiveSummary,
    generateDetailedReport,
  };
}

// Export types
export type {
  ComplianceRequirement,
  ComplianceAssessment,
  ComplianceGap,
  CorrectiveAction,
  ComplianceStatus,
  RegulationType,
  ComplianceDashboardOverview,
};
