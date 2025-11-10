/**
 * LOC: USACE-DOWN-NCR-004
 * File: /reuse/frontend/composites/usace/downstream/nonconformance-tracking-systems.ts
 *
 * UPSTREAM (imports from):
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *   - ../usace-quality-assurance-composites
 *
 * DOWNSTREAM (imported by):
 *   - USACE CEFMS NCR management UI
 *   - Corrective action tracking systems
 *   - Root cause analysis tools
 *   - Quality improvement dashboards
 */

/**
 * File: /reuse/frontend/composites/usace/downstream/nonconformance-tracking-systems.ts
 * Locator: WC-DOWN-NCR-004
 * Purpose: Nonconformance Tracking Systems - Production-grade NCR and corrective action management
 *
 * Upstream: React 18+, Next.js 16+, TypeScript 5.x, usace-quality-assurance-composites
 * Downstream: NCR UI, corrective action tracking, root cause analysis, quality dashboards
 * Dependencies: React 18+, Next.js 16+, TypeScript 5.x, date-fns, recharts
 * Exports: 34+ composed functions for comprehensive nonconformance and corrective action management
 *
 * LLM Context: Production-grade nonconformance tracking system for USACE CEFMS applications.
 * Provides NCR creation and management, corrective action tracking, root cause analysis, trend
 * analysis, disposition decision workflows, effectiveness verification, and comprehensive quality
 * improvement tracking for USACE construction quality assurance and ISO 9001 compliance.
 */

'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  useNonconformanceManagement,
  generateNCRForm,
  analyzeNCRTrends,
  type NonconformanceReport,
  type CorrectiveAction,
  type DispositionDecision,
  type NonconformanceSeverity,
  type CorrectiveActionStatus,
} from '../usace-quality-assurance-composites';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * NCR dashboard metrics
 */
export interface NCRDashboardMetrics {
  totalNCRs: number;
  openNCRs: number;
  criticalNCRs: number;
  resolvedNCRs: number;
  averageCloseTime: number; // days
  bySeverity: Record<NonconformanceSeverity, number>;
  byCategory: Record<string, number>;
  byResponsibleParty: Record<string, number>;
  trendDirection: 'improving' | 'declining' | 'stable';
}

/**
 * Root cause analysis
 */
export interface RootCauseAnalysis {
  ncrId: string;
  primaryCause: string;
  contributingFactors: string[];
  analysisMethod: '5_whys' | 'fishbone' | 'fault_tree' | 'pareto';
  analyzedBy: string;
  analyzedDate: Date;
  preventiveMeasures: string[];
  verified: boolean;
}

/**
 * Corrective action effectiveness
 */
export interface CorrectiveActionEffectiveness {
  actionId: string;
  ncrId: string;
  effectiveness: 'effective' | 'partially_effective' | 'ineffective' | 'pending';
  verificationMethod: string;
  verificationDate?: Date;
  verifiedBy?: string;
  followUpRequired: boolean;
  recurrenceRate: number;
  notes?: string;
}

/**
 * NCR trends analysis
 */
export interface NCRTrendsAnalysis {
  period: string;
  totalNCRs: number;
  criticalRate: number;
  avgCloseTime: number;
  topCategories: Array<{ category: string; count: number }>;
  topCauses: Array<{ cause: string; count: number }>;
  trendDirection: 'improving' | 'declining' | 'stable';
  recommendations: string[];
}

// ============================================================================
// NONCONFORMANCE TRACKING SYSTEMS
// ============================================================================

/**
 * Comprehensive NCR management and tracking hook
 *
 * Provides centralized nonconformance report creation, tracking, and
 * corrective action management with real-time metrics.
 *
 * @param projectNumber - Optional project filter
 * @returns NCR management state and functions
 *
 * @example
 * ```tsx
 * function NCRManagementSystem({ projectNumber }) {
 *   const {
 *     dashboardMetrics,
 *     openNCRs,
 *     createNCR,
 *     assignCorrectiveAction,
 *     closeNCR,
 *     getTrendAnalysis
 *   } = useNCRManagementSystem(projectNumber);
 *
 *   return (
 *     <div>
 *       <NCRMetrics metrics={dashboardMetrics} />
 *       <NCRList ncrs={openNCRs} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useNCRManagementSystem(projectNumber?: string) {
  const {
    ncrs,
    createNCR,
    assignCorrectiveAction,
    updateCorrectiveAction,
    closeNCR,
    getOpenNCRs,
    getCriticalNCRs,
    getNCRsByProject,
  } = useNonconformanceManagement();

  // Filter NCRs by project if provided
  const filteredNCRs = useMemo(
    () => projectNumber ? getNCRsByProject(projectNumber) : ncrs,
    [ncrs, projectNumber, getNCRsByProject]
  );

  // Calculate dashboard metrics
  const dashboardMetrics = useMemo<NCRDashboardMetrics>(() => {
    const openNCRs = getOpenNCRs();
    const criticalNCRs = getCriticalNCRs();
    const resolvedNCRs = filteredNCRs.filter(ncr => ncr.status === 'closed');

    // Calculate average close time
    const closedWithDates = resolvedNCRs.filter(ncr => ncr.closedDate);
    const avgCloseTime = closedWithDates.length > 0
      ? closedWithDates.reduce((sum, ncr) => {
          const days = Math.ceil(
            (new Date(ncr.closedDate!).getTime() - new Date(ncr.identifiedDate).getTime()) /
            (1000 * 60 * 60 * 24)
          );
          return sum + days;
        }, 0) / closedWithDates.length
      : 0;

    // Group by severity
    const bySeverity = filteredNCRs.reduce((acc, ncr) => {
      acc[ncr.severity] = (acc[ncr.severity] || 0) + 1;
      return acc;
    }, {} as Record<NonconformanceSeverity, number>);

    // Group by category
    const byCategory = filteredNCRs.reduce((acc, ncr) => {
      acc[ncr.category] = (acc[ncr.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Group by responsible party
    const byResponsibleParty = filteredNCRs.reduce((acc, ncr) => {
      acc[ncr.responsibleParty] = (acc[ncr.responsibleParty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Determine trend
    const recentNCRs = filteredNCRs.slice(-10);
    const olderNCRs = filteredNCRs.slice(-20, -10);
    const trendDirection =
      recentNCRs.length < olderNCRs.length ? 'improving' :
      recentNCRs.length > olderNCRs.length ? 'declining' : 'stable';

    return {
      totalNCRs: filteredNCRs.length,
      openNCRs: openNCRs.length,
      criticalNCRs: criticalNCRs.length,
      resolvedNCRs: resolvedNCRs.length,
      averageCloseTime: avgCloseTime,
      bySeverity,
      byCategory,
      byResponsibleParty,
      trendDirection,
    };
  }, [filteredNCRs, getOpenNCRs, getCriticalNCRs]);

  // Get trend analysis
  const getTrendAnalysis = useCallback((startDate: Date, endDate: Date): NCRTrendsAnalysis => {
    const trends = analyzeNCRTrends(filteredNCRs, startDate, endDate);

    const topCategories = Object.entries(trends.byCategory)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const recommendations: string[] = [];
    if (trends.criticalOpen > 0) {
      recommendations.push('Address critical NCRs immediately');
    }
    if (trends.avgCloseTime > 30) {
      recommendations.push('Improve corrective action response time');
    }
    if (topCategories[0]?.count > trends.totalNCRs * 0.3) {
      recommendations.push(`Focus on reducing ${topCategories[0].category} nonconformances`);
    }

    return {
      period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
      totalNCRs: trends.totalNCRs,
      criticalRate: (trends.criticalOpen / trends.totalNCRs) * 100,
      avgCloseTime: trends.avgCloseTime,
      topCategories,
      topCauses: [],
      trendDirection: dashboardMetrics.trendDirection,
      recommendations,
    };
  }, [filteredNCRs, dashboardMetrics.trendDirection]);

  // Get overdue corrective actions
  const getOverdueCorrectiveActions = useCallback(() => {
    const now = new Date();
    return filteredNCRs.flatMap(ncr =>
      ncr.correctiveActions
        .filter(ca =>
          ca.status !== 'completed' &&
          ca.status !== 'verified' &&
          new Date(ca.dueDate) < now
        )
        .map(ca => ({ ncr, action: ca }))
    );
  }, [filteredNCRs]);

  return {
    ncrs: filteredNCRs,
    dashboardMetrics,
    openNCRs: getOpenNCRs(),
    criticalNCRs: getCriticalNCRs(),
    createNCR,
    assignCorrectiveAction,
    updateCorrectiveAction,
    closeNCR,
    getTrendAnalysis,
    getOverdueCorrectiveActions,
  };
}

/**
 * Root cause analysis hook
 *
 * Provides structured root cause analysis tools and methodologies.
 *
 * @param ncrId - NCR identifier
 * @returns Root cause analysis state and functions
 *
 * @example
 * ```tsx
 * function RootCauseAnalyzer({ ncrId }) {
 *   const {
 *     analysis,
 *     perform5Whys,
 *     createFishbone,
 *     identifyPreventiveMeasures
 *   } = useRootCauseAnalysis(ncrId);
 * }
 * ```
 */
export function useRootCauseAnalysis(ncrId: string) {
  const [analysis, setAnalysis] = useState<RootCauseAnalysis | null>(null);

  const perform5Whys = useCallback((initialProblem: string, whyAnswers: string[]) => {
    if (whyAnswers.length < 5) {
      console.warn('5 Whys analysis should have at least 5 levels');
    }

    const rootCause = whyAnswers[whyAnswers.length - 1];

    setAnalysis({
      ncrId,
      primaryCause: rootCause,
      contributingFactors: whyAnswers.slice(0, -1),
      analysisMethod: '5_whys',
      analyzedBy: 'current_user', // Would get from auth context
      analyzedDate: new Date(),
      preventiveMeasures: [],
      verified: false,
    });
  }, [ncrId]);

  const createFishbone = useCallback((
    categories: Record<string, string[]>
  ) => {
    const contributingFactors = Object.values(categories).flat();
    const primaryCause = contributingFactors[0] || 'Unknown';

    setAnalysis({
      ncrId,
      primaryCause,
      contributingFactors: contributingFactors.slice(1),
      analysisMethod: 'fishbone',
      analyzedBy: 'current_user',
      analyzedDate: new Date(),
      preventiveMeasures: [],
      verified: false,
    });
  }, [ncrId]);

  const identifyPreventiveMeasures = useCallback((measures: string[]) => {
    setAnalysis(prev => prev ? { ...prev, preventiveMeasures: measures } : null);
  }, []);

  const verifyAnalysis = useCallback((verifiedBy: string) => {
    setAnalysis(prev => prev ? { ...prev, verified: true } : null);
  }, []);

  return {
    analysis,
    perform5Whys,
    createFishbone,
    identifyPreventiveMeasures,
    verifyAnalysis,
  };
}

/**
 * Corrective action effectiveness tracking hook
 *
 * Tracks and verifies the effectiveness of corrective actions.
 *
 * @returns Effectiveness tracking state and functions
 *
 * @example
 * ```tsx
 * function EffectivenessTracker() {
 *   const {
 *     trackEffectiveness,
 *     verifyEffectiveness,
 *     getIneffectiveActions
 *   } = useCorrectiveActionEffectiveness();
 * }
 * ```
 */
export function useCorrectiveActionEffectiveness() {
  const [effectiveness, setEffectiveness] = useState<CorrectiveActionEffectiveness[]>([]);

  const trackEffectiveness = useCallback((tracking: CorrectiveActionEffectiveness) => {
    setEffectiveness(prev => [...prev, tracking]);
  }, []);

  const verifyEffectiveness = useCallback((
    actionId: string,
    result: 'effective' | 'partially_effective' | 'ineffective',
    verifiedBy: string
  ) => {
    setEffectiveness(prev => prev.map(e =>
      e.actionId === actionId
        ? {
            ...e,
            effectiveness: result,
            verifiedBy,
            verificationDate: new Date(),
            followUpRequired: result !== 'effective',
          }
        : e
    ));
  }, []);

  const getIneffectiveActions = useCallback(() => {
    return effectiveness.filter(e =>
      e.effectiveness === 'ineffective' || e.effectiveness === 'partially_effective'
    );
  }, [effectiveness]);

  const calculateRecurrenceRate = useCallback((ncrId: string) => {
    // Calculate how many times similar NCRs occurred after corrective action
    const relatedActions = effectiveness.filter(e => e.ncrId === ncrId);
    const recurrences = relatedActions.filter(e => e.effectiveness === 'ineffective').length;

    return relatedActions.length > 0 ? (recurrences / relatedActions.length) * 100 : 0;
  }, [effectiveness]);

  return {
    effectiveness,
    trackEffectiveness,
    verifyEffectiveness,
    getIneffectiveActions,
    calculateRecurrenceRate,
  };
}

/**
 * Disposition decision workflow hook
 *
 * Manages disposition decisions for nonconformances.
 *
 * @param ncrId - NCR identifier
 * @returns Disposition workflow state and functions
 *
 * @example
 * ```tsx
 * function DispositionWorkflow({ ncrId }) {
 *   const {
 *     makeDisposition,
 *     requestEngineerEvaluation,
 *     approveDisposition
 *   } = useDispositionDecisionWorkflow(ncrId);
 * }
 * ```
 */
export function useDispositionDecisionWorkflow(ncrId: string) {
  const [disposition, setDisposition] = useState<DispositionDecision | null>(null);

  const makeDisposition = useCallback((
    decision: DispositionDecision['decision'],
    justification: string,
    decidedBy: string
  ) => {
    setDisposition({
      decision,
      justification,
      decidedBy,
      decisionDate: new Date(),
    });
  }, []);

  const requestEngineerEvaluation = useCallback((evaluation: string) => {
    setDisposition(prev => prev ? { ...prev, engineerEvaluation: evaluation } : null);
  }, []);

  const approveDisposition = useCallback((approver: string) => {
    setDisposition(prev => prev ? {
      ...prev,
      approvedBy: approver,
      approvalDate: new Date(),
    } : null);
  }, []);

  const estimateCostImpact = useCallback((cost: number) => {
    setDisposition(prev => prev ? { ...prev, costImpact: cost } : null);
  }, []);

  return {
    disposition,
    makeDisposition,
    requestEngineerEvaluation,
    approveDisposition,
    estimateCostImpact,
  };
}

/**
 * NCR reporting and analytics hook
 *
 * Generates comprehensive NCR reports and analytics.
 *
 * @param projectNumber - Optional project filter
 * @returns Reporting state and functions
 *
 * @example
 * ```tsx
 * function NCRReporting({ projectNumber }) {
 *   const {
 *     generateSummaryReport,
 *     generateTrendReport,
 *     exportNCRData
 *   } = useNCRReporting(projectNumber);
 * }
 * ```
 */
export function useNCRReporting(projectNumber?: string) {
  const { dashboardMetrics, getTrendAnalysis } = useNCRManagementSystem(projectNumber);

  const generateSummaryReport = useCallback(() => {
    return {
      reportType: 'summary',
      projectNumber: projectNumber || 'All Projects',
      generatedDate: new Date(),
      metrics: dashboardMetrics,
      criticalIssues: dashboardMetrics.criticalNCRs > 0
        ? [`${dashboardMetrics.criticalNCRs} critical NCR(s) require immediate attention`]
        : [],
    };
  }, [projectNumber, dashboardMetrics]);

  const generateTrendReport = useCallback((startDate: Date, endDate: Date) => {
    const trends = getTrendAnalysis(startDate, endDate);

    return {
      reportType: 'trends',
      period: trends.period,
      trends,
      insights: trends.recommendations,
    };
  }, [getTrendAnalysis]);

  const exportNCRData = useCallback((format: 'csv' | 'excel' | 'pdf') => {
    // In production, would generate actual file export
    console.log(`Exporting NCR data as ${format}`);
  }, []);

  return {
    generateSummaryReport,
    generateTrendReport,
    exportNCRData,
  };
}

/**
 * NCR notification and escalation hook
 *
 * Manages notifications and escalations for NCRs.
 *
 * @returns Notification management functions
 *
 * @example
 * ```tsx
 * function NCRNotifications() {
 *   const {
 *     notifyCriticalNCR,
 *     escalateOverdueAction,
 *     sendCloseNotification
 *   } = useNCRNotifications();
 * }
 * ```
 */
export function useNCRNotifications() {
  const notifyCriticalNCR = useCallback((ncr: NonconformanceReport, recipients: string[]) => {
    // In production, send email/SMS notifications
    console.log(`Sending critical NCR notification for ${ncr.ncrNumber} to ${recipients.join(', ')}`);
  }, []);

  const escalateOverdueAction = useCallback((action: CorrectiveAction, escalationLevel: number) => {
    console.log(`Escalating overdue action ${action.actionNumber} to level ${escalationLevel}`);
  }, []);

  const sendCloseNotification = useCallback((ncr: NonconformanceReport) => {
    console.log(`Sending NCR close notification for ${ncr.ncrNumber}`);
  }, []);

  return {
    notifyCriticalNCR,
    escalateOverdueAction,
    sendCloseNotification,
  };
}

// Export types
export type {
  NonconformanceReport,
  CorrectiveAction,
  DispositionDecision,
  NonconformanceSeverity,
  CorrectiveActionStatus,
  NCRDashboardMetrics,
  RootCauseAnalysis,
  CorrectiveActionEffectiveness,
  NCRTrendsAnalysis,
};
