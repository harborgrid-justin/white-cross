/**
 * LOC: USACE-DOWN-AUDIT-008
 * File: /reuse/frontend/composites/usace/downstream/audit-compliance-modules.ts
 *
 * UPSTREAM (imports from):
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *   - ../usace-regulatory-compliance-composites
 *
 * DOWNSTREAM (imported by):
 *   - Audit preparation UI
 *   - Compliance audit systems
 *   - Audit findings dashboards
 *   - Remediation tracking tools
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  useComplianceAssessments,
  useComplianceGaps,
  exportComplianceReport,
  generateComplianceDashboardMetrics,
  type ComplianceAssessment,
  type ComplianceGap,
} from '../usace-regulatory-compliance-composites';

export interface AuditModule {
  assessments: ComplianceAssessment[];
  gaps: ComplianceGap[];
  prepareAudit: () => any;
  generateAuditReport: (format: 'json' | 'csv') => string;
  identifyAuditRisks: () => string[];
}

export function useAuditComplianceModule(): AuditModule {
  const { assessments, getNonCompliantAssessments } = useComplianceAssessments();
  const { gaps, getCriticalGaps } = useComplianceGaps();

  const prepareAudit = useCallback(() => {
    return {
      nonCompliantAssessments: getNonCompliantAssessments(),
      criticalGaps: getCriticalGaps(),
      readiness: getCriticalGaps().length === 0,
    };
  }, [getNonCompliantAssessments, getCriticalGaps]);

  const generateAuditReport = useCallback((format: 'json' | 'csv') => {
    return exportComplianceReport(assessments, format);
  }, [assessments]);

  const identifyAuditRisks = useCallback(() => {
    const risks: string[] = [];
    if (getNonCompliantAssessments().length > 0) {
      risks.push('Non-compliant assessments identified');
    }
    if (getCriticalGaps().length > 0) {
      risks.push('Critical compliance gaps exist');
    }
    return risks;
  }, [getNonCompliantAssessments, getCriticalGaps]);

  return {
    assessments,
    gaps,
    prepareAudit,
    generateAuditReport,
    identifyAuditRisks,
  };
}

export type { ComplianceAssessment, ComplianceGap };
