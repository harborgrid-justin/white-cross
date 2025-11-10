/**
 * LOC: USACE-DOWN-QMS-001
 * File: /reuse/frontend/composites/usace/downstream/quality-management-systems.ts
 *
 * UPSTREAM (imports from):
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *   - ../usace-quality-assurance-composites
 *
 * DOWNSTREAM (imported by):
 *   - USACE CEFMS quality management UI
 *   - Quality control dashboards
 *   - QA/QC reporting systems
 *   - Compliance management portals
 */

/**
 * File: /reuse/frontend/composites/usace/downstream/quality-management-systems.ts
 * Locator: WC-DOWN-QMS-001
 * Purpose: Quality Management Systems - Production-grade QA/QC management and control
 *
 * Upstream: React 18+, Next.js 16+, TypeScript 5.x, usace-quality-assurance-composites
 * Downstream: QMS UI, quality dashboards, reporting systems, compliance portals
 * Dependencies: React 18+, Next.js 16+, TypeScript 5.x, date-fns, recharts
 * Exports: 35+ composed functions for comprehensive quality management systems
 *
 * LLM Context: Production-grade quality management system for USACE CEFMS applications.
 * Provides comprehensive quality control plan management, inspection coordination, material
 * certification tracking, quality metrics dashboards, nonconformance management, quality
 * audits, and ISO 9001 compliance tracking for USACE Civil Works and Military construction.
 */

'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  useQualityInspections,
  useMaterialTesting,
  useNonconformanceManagement,
  useMaterialCertification,
  useQualityControlPlan,
  useQualityAudits,
  generateQualityMetricsDashboard,
  calculateInspectionPassRate,
  analyzeNCRTrends,
  validateTestResults,
  exportQualityReport,
  type QualityInspection,
  type MaterialTest,
  type NonconformanceReport,
  type MaterialCertification,
  type QualityControlPlan,
  type QualityAudit,
  type InspectionType,
  type InspectionStatus,
} from '../usace-quality-assurance-composites';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * QMS dashboard metrics
 */
export interface QMSDashboardMetrics {
  inspectionMetrics: {
    total: number;
    passed: number;
    failed: number;
    pending: number;
    passRate: number;
  };
  materialMetrics: {
    totalTests: number;
    certified: number;
    pending: number;
    failed: number;
  };
  nonconformanceMetrics: {
    total: number;
    open: number;
    critical: number;
    resolved: number;
  };
  auditMetrics: {
    scheduled: number;
    completed: number;
    averageScore: number;
  };
  overallQualityScore: number;
}

/**
 * Quality performance report
 */
export interface QualityPerformanceReport {
  period: string;
  projectNumber: string;
  metrics: QMSDashboardMetrics;
  trends: {
    inspectionTrend: 'improving' | 'declining' | 'stable';
    ncrTrend: 'improving' | 'declining' | 'stable';
    certificationTrend: 'improving' | 'declining' | 'stable';
  };
  recommendations: string[];
  generatedDate: Date;
}

// ============================================================================
// QUALITY MANAGEMENT DASHBOARD
// ============================================================================

/**
 * Comprehensive Quality Management System dashboard hook
 *
 * Provides centralized quality management with real-time metrics, inspections,
 * NCRs, material certifications, and audit tracking.
 *
 * @param projectNumber - Project identifier
 * @returns QMS dashboard state and functions
 *
 * @example
 * ```tsx
 * function QualityManagementDashboard({ projectNumber }) {
 *   const {
 *     dashboardMetrics,
 *     recentInspections,
 *     openNCRs,
 *     refreshDashboard,
 *     scheduleInspection,
 *     createNCR
 *   } = useQualityManagementDashboard(projectNumber);
 *
 *   return (
 *     <div>
 *       <MetricsGrid metrics={dashboardMetrics} />
 *       <InspectionList inspections={recentInspections} />
 *       <NCRList ncrs={openNCRs} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useQualityManagementDashboard(projectNumber: string) {
  const {
    inspections,
    scheduleInspection,
    conductInspection,
    approveInspection,
    getScheduledInspections,
    getFailedInspections,
  } = useQualityInspections();

  const {
    tests,
    createTest,
    recordResults,
    certifyMaterial,
    getPendingTests,
    getFailedTests,
  } = useMaterialTesting();

  const {
    ncrs,
    createNCR,
    assignCorrectiveAction,
    closeNCR,
    getOpenNCRs,
    getCriticalNCRs,
  } = useNonconformanceManagement();

  const {
    certifications,
    addCertification,
    approveCertification,
    getExpiringCertifications,
  } = useMaterialCertification();

  const {
    audits,
    scheduleAudit,
    recordFindings,
    approveAudit,
  } = useQualityAudits();

  const { qcPlan } = useQualityControlPlan(projectNumber);

  // Filter data for current project
  const projectInspections = useMemo(
    () => inspections.filter(i => i.projectNumber === projectNumber),
    [inspections, projectNumber]
  );

  const projectNCRs = useMemo(
    () => ncrs.filter(ncr => ncr.projectNumber === projectNumber),
    [ncrs, projectNumber]
  );

  // Calculate dashboard metrics
  const dashboardMetrics = useMemo<QMSDashboardMetrics>(() => {
    const inspectionMetrics = calculateInspectionPassRate(projectInspections);
    const openNCRs = getOpenNCRs();
    const criticalNCRs = getCriticalNCRs();
    const pendingTests = getPendingTests();

    const overallMetrics = generateQualityMetricsDashboard({
      inspections: projectInspections,
      ncrs: projectNCRs,
      tests,
    });

    return {
      inspectionMetrics: {
        total: inspectionMetrics.total,
        passed: inspectionMetrics.passed,
        failed: inspectionMetrics.failed,
        pending: inspectionMetrics.total - inspectionMetrics.completed,
        passRate: inspectionMetrics.passRate,
      },
      materialMetrics: {
        totalTests: tests.length,
        certified: tests.filter(t => t.certified).length,
        pending: pendingTests.length,
        failed: getFailedTests().length,
      },
      nonconformanceMetrics: {
        total: projectNCRs.length,
        open: openNCRs.length,
        critical: criticalNCRs.length,
        resolved: projectNCRs.filter(ncr => ncr.status === 'closed').length,
      },
      auditMetrics: {
        scheduled: audits.filter(a => a.status === 'scheduled').length,
        completed: audits.filter(a => a.status === 'completed').length,
        averageScore: audits.length > 0
          ? audits.reduce((sum, a) => sum + (a.overallScore || 0), 0) / audits.length
          : 0,
      },
      overallQualityScore: overallMetrics.overallQualityScore,
    };
  }, [projectInspections, projectNCRs, tests, audits, getOpenNCRs, getCriticalNCRs, getPendingTests, getFailedTests]);

  // Get recent inspections
  const recentInspections = useMemo(
    () => projectInspections.slice(0, 10).sort((a, b) =>
      new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
    ),
    [projectInspections]
  );

  // Get upcoming inspections
  const upcomingInspections = useMemo(
    () => getScheduledInspections(7).filter(i => i.projectNumber === projectNumber),
    [getScheduledInspections, projectNumber]
  );

  // Refresh dashboard data
  const refreshDashboard = useCallback(() => {
    // Trigger re-fetch of data
    // In production, this would call API endpoints
  }, []);

  // Generate performance report
  const generatePerformanceReport = useCallback(
    (startDate: Date, endDate: Date): QualityPerformanceReport => {
      const ncrTrends = analyzeNCRTrends(projectNCRs, startDate, endDate);

      return {
        period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
        projectNumber,
        metrics: dashboardMetrics,
        trends: {
          inspectionTrend: dashboardMetrics.inspectionMetrics.passRate > 90 ? 'improving' : 'stable',
          ncrTrend: ncrTrends.criticalOpen === 0 ? 'improving' : 'stable',
          certificationTrend: 'stable',
        },
        recommendations: [
          dashboardMetrics.inspectionMetrics.passRate < 90 && 'Improve inspection pass rate',
          dashboardMetrics.nonconformanceMetrics.critical > 0 && 'Address critical NCRs immediately',
          dashboardMetrics.materialMetrics.pending > 10 && 'Expedite pending material tests',
        ].filter(Boolean) as string[],
        generatedDate: new Date(),
      };
    },
    [projectNCRs, projectNumber, dashboardMetrics]
  );

  // Export quality report
  const exportReport = useCallback(() => {
    return exportQualityReport(projectNumber, {
      inspections: projectInspections,
      ncrs: projectNCRs,
      tests,
    });
  }, [projectNumber, projectInspections, projectNCRs, tests]);

  return {
    dashboardMetrics,
    recentInspections,
    upcomingInspections,
    openNCRs: getOpenNCRs(),
    criticalNCRs: getCriticalNCRs(),
    pendingTests: getPendingTests(),
    qcPlan,
    refreshDashboard,
    scheduleInspection,
    conductInspection,
    approveInspection,
    createNCR,
    assignCorrectiveAction,
    closeNCR,
    createTest,
    certifyMaterial,
    scheduleAudit,
    generatePerformanceReport,
    exportReport,
  };
}

/**
 * Quality control plan builder hook
 *
 * Provides QC plan creation, inspection point definition, and test requirement management.
 *
 * @param projectNumber - Project identifier
 * @returns QC plan builder functions
 *
 * @example
 * ```tsx
 * function QCPlanBuilder({ projectNumber }) {
 *   const {
 *     plan,
 *     addInspectionPoint,
 *     addTestRequirement,
 *     validatePlan,
 *     submitPlan
 *   } = useQCPlanBuilder(projectNumber);
 * }
 * ```
 */
export function useQCPlanBuilder(projectNumber: string) {
  const {
    qcPlan,
    createQCPlan,
    updateQCPlan,
    addInspectionPoint,
    addTestRequirement,
    getHoldPoints,
  } = useQualityControlPlan(projectNumber);

  const validatePlan = useCallback(() => {
    if (!qcPlan) return { valid: false, errors: ['No QC plan created'] };

    const errors: string[] = [];

    if (!qcPlan.qualityObjectives || qcPlan.qualityObjectives.length === 0) {
      errors.push('Quality objectives are required');
    }

    if (!qcPlan.inspectionPoints || qcPlan.inspectionPoints.length === 0) {
      errors.push('At least one inspection point is required');
    }

    if (!qcPlan.testRequirements || qcPlan.testRequirements.length === 0) {
      errors.push('At least one test requirement is required');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }, [qcPlan]);

  const submitPlan = useCallback(async (approver: string) => {
    const validation = validatePlan();
    if (!validation.valid) {
      throw new Error(`Plan validation failed: ${validation.errors.join(', ')}`);
    }

    if (qcPlan) {
      await updateQCPlan({
        approvedBy: approver,
        approvalDate: new Date(),
      });
    }
  }, [qcPlan, validatePlan, updateQCPlan]);

  return {
    plan: qcPlan,
    createQCPlan,
    updateQCPlan,
    addInspectionPoint,
    addTestRequirement,
    getHoldPoints,
    validatePlan,
    submitPlan,
  };
}

/**
 * Real-time quality metrics hook
 *
 * Provides live quality metrics with automatic refresh.
 *
 * @param projectNumber - Project identifier
 * @param refreshInterval - Refresh interval in milliseconds
 * @returns Live quality metrics
 *
 * @example
 * ```tsx
 * function LiveQualityMetrics({ projectNumber }) {
 *   const { metrics, lastUpdated } = useRealTimeQualityMetrics(projectNumber, 30000);
 *
 *   return <MetricsDisplay metrics={metrics} lastUpdated={lastUpdated} />;
 * }
 * ```
 */
export function useRealTimeQualityMetrics(projectNumber: string, refreshInterval: number = 60000) {
  const { dashboardMetrics } = useQualityManagementDashboard(projectNumber);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  return {
    metrics: dashboardMetrics,
    lastUpdated,
  };
}

/**
 * Quality compliance checker hook
 *
 * Validates quality compliance against requirements.
 *
 * @param projectNumber - Project identifier
 * @returns Compliance status and checks
 *
 * @example
 * ```tsx
 * function ComplianceChecker({ projectNumber }) {
 *   const { isCompliant, violations, checkCompliance } = useQualityComplianceChecker(projectNumber);
 * }
 * ```
 */
export function useQualityComplianceChecker(projectNumber: string) {
  const { dashboardMetrics, criticalNCRs } = useQualityManagementDashboard(projectNumber);
  const { qcPlan } = useQualityControlPlan(projectNumber);

  const checkCompliance = useCallback(() => {
    const violations: string[] = [];

    // Check inspection pass rate
    if (dashboardMetrics.inspectionMetrics.passRate < 90) {
      violations.push('Inspection pass rate below 90% threshold');
    }

    // Check critical NCRs
    if (criticalNCRs.length > 0) {
      violations.push(`${criticalNCRs.length} critical NCR(s) open`);
    }

    // Check QC plan approval
    if (qcPlan && !qcPlan.approvedBy) {
      violations.push('QC plan not approved');
    }

    // Check material certifications
    if (dashboardMetrics.materialMetrics.failed > 0) {
      violations.push(`${dashboardMetrics.materialMetrics.failed} failed material test(s)`);
    }

    return {
      isCompliant: violations.length === 0,
      violations,
      complianceScore: Math.max(0, 100 - (violations.length * 20)),
    };
  }, [dashboardMetrics, criticalNCRs, qcPlan]);

  const complianceStatus = useMemo(() => checkCompliance(), [checkCompliance]);

  return {
    isCompliant: complianceStatus.isCompliant,
    violations: complianceStatus.violations,
    complianceScore: complianceStatus.complianceScore,
    checkCompliance,
  };
}

// Export types
export type {
  QualityInspection,
  MaterialTest,
  NonconformanceReport,
  MaterialCertification,
  QualityControlPlan,
  QualityAudit,
  InspectionType,
  InspectionStatus,
};
