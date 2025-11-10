/**
 * LOC: USACE-DOWNSTREAM-COMPL-RPT-004
 * File: /reuse/frontend/composites/usace/downstream/compliance-reporting-tools.ts
 */

'use client';

import React, { useState, useCallback } from 'react';
import {
  SF133Report,
  FinancialReport,
} from '../usace-financial-reporting-composites';

export interface ComplianceCheck {
  checkName: string;
  passed: boolean;
  severity: 'error' | 'warning' | 'info';
  message: string;
  regulation: string;
}

export function validateSF133Report(report: SF133Report): ComplianceCheck[] {
  const checks: ComplianceCheck[] = [];

  if (!report.certifiedBy) {
    checks.push({
      checkName: 'Certification',
      passed: false,
      severity: 'error',
      message: 'Report must be certified before submission',
      regulation: 'OMB Circular A-11',
    });
  }

  const totalBudgetAuthority = report.lines
    .filter(l => l.lineNumber.startsWith('1'))
    .reduce((sum, l) => sum + l.amount, 0);

  const totalObligations = report.lines
    .filter(l => l.lineNumber.startsWith('2'))
    .reduce((sum, l) => sum + l.amount, 0);

  if (totalObligations > totalBudgetAuthority) {
    checks.push({
      checkName: 'Anti-Deficiency',
      passed: false,
      severity: 'error',
      message: 'Obligations exceed budget authority',
      regulation: 'Anti-Deficiency Act',
    });
  } else {
    checks.push({
      checkName: 'Anti-Deficiency',
      passed: true,
      severity: 'info',
      message: 'Obligations within budget authority',
      regulation: 'Anti-Deficiency Act',
    });
  }

  return checks;
}

export function generateComplianceReport(
  financialReports: FinancialReport[]
): {
  compliantReports: number;
  nonCompliantReports: number;
  pendingReviews: number;
  complianceRate: number;
} {
  const compliantReports = financialReports.filter(r => r.status === 'completed').length;
  const nonCompliantReports = financialReports.filter(r => r.status === 'failed').length;
  const pendingReviews = financialReports.filter(r => r.status === 'generating').length;
  const total = financialReports.length;
  const complianceRate = total > 0 ? (compliantReports / total) * 100 : 100;

  return {
    compliantReports,
    nonCompliantReports,
    pendingReviews,
    complianceRate: Math.round(complianceRate * 10) / 10,
  };
}

export default {
  validateSF133Report,
  generateComplianceReport,
};
