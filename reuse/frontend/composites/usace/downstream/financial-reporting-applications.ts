/**
 * LOC: USACE-DOWNSTREAM-FIN-RPT-001
 * File: /reuse/frontend/composites/usace/downstream/financial-reporting-applications.ts
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  FinancialReport,
  ReportParameters,
  BudgetVsActualReport,
  ExecutionReport,
} from '../usace-financial-reporting-composites';

export function useFinancialReportGeneration() {
  const [reports, setReports] = useState<FinancialReport[]>([]);
  const [generating, setGenerating] = useState<boolean>(false);

  const generateReport = useCallback(async (
    reportType: string,
    parameters: ReportParameters
  ) => {
    setGenerating(true);
    try {
      const response = await fetch(`/api/usace/financial-reports/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportType, parameters }),
      });
      const report = await response.json();
      setReports(prev => [report, ...prev]);
      return report;
    } finally {
      setGenerating(false);
    }
  }, []);

  return { reports, generating, generateReport };
}

export function calculateBudgetVariances(report: BudgetVsActualReport): {
  unfavorableVariances: number;
  favorableVariances: number;
  netVariance: number;
  varianceRate: number;
} {
  let unfavorableVariances = 0;
  let favorableVariances = 0;

  report.sections.forEach(section => {
    section.lineItems.forEach(item => {
      if (item.varianceType === 'unfavorable') {
        unfavorableVariances += Math.abs(item.variance);
      } else if (item.varianceType === 'favorable') {
        favorableVariances += Math.abs(item.variance);
      }
    });
  });

  const netVariance = favorableVariances - unfavorableVariances;
  const varianceRate = report.totals.totalBudgeted > 0
    ? (netVariance / report.totals.totalBudgeted) * 100
    : 0;

  return {
    unfavorableVariances: Math.round(unfavorableVariances * 100) / 100,
    favorableVariances: Math.round(favorableVariances * 100) / 100,
    netVariance: Math.round(netVariance * 100) / 100,
    varianceRate: Math.round(varianceRate * 100) / 100,
  };
}

export function formatReportData(data: any, format: 'csv' | 'json' | 'excel'): string {
  if (format === 'json') {
    return JSON.stringify(data, null, 2);
  }

  if (format === 'csv' && Array.isArray(data)) {
    if (data.length === 0) return '';
    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(h => row[h] || '').join(','));
    return [headers.join(','), ...rows].join('\n');
  }

  return JSON.stringify(data);
}

export default {
  useFinancialReportGeneration,
  calculateBudgetVariances,
  formatReportData,
};
