/**
 * LOC: USACE-DOWNSTREAM-EXEC-RPT-003
 * File: /reuse/frontend/composites/usace/downstream/executive-reporting-systems.ts
 */

'use client';

import React, { useState, useCallback } from 'react';
import {
  FinancialReport,
  ExecutionReport,
  ProjectStatusReport,
} from '../usace-financial-reporting-composites';

export interface ExecutiveSummary {
  fiscalYear: number;
  period: string;
  financialHealth: 'excellent' | 'good' | 'concerning' | 'critical';
  totalAppropriations: number;
  totalObligations: number;
  totalExpenditures: number;
  obligationRate: number;
  expenditureRate: number;
  keyMetrics: Record<string, number>;
  alerts: string[];
  recommendations: string[];
}

export function generateExecutiveSummary(
  executionReport: ExecutionReport
): ExecutiveSummary {
  const { summary, appropriations } = executionReport;
  const alerts: string[] = [];
  const recommendations: string[] = [];

  if (summary.overallObligationRate < 50) {
    alerts.push('Obligation rate below 50% - acceleration needed');
  }

  if (summary.overallExpenditureRate < 40) {
    alerts.push('Expenditure rate low - review project execution');
  }

  appropriations.forEach(app => {
    if (app.burnRate > 1.1) {
      alerts.push(`${app.appropriationCode}: Burn rate exceeds budget`);
    }
  });

  let financialHealth: 'excellent' | 'good' | 'concerning' | 'critical';
  if (alerts.length === 0 && summary.overallObligationRate >= 70) {
    financialHealth = 'excellent';
  } else if (alerts.length <= 2) {
    financialHealth = 'good';
  } else if (alerts.length <= 5) {
    financialHealth = 'concerning';
  } else {
    financialHealth = 'critical';
  }

  return {
    fiscalYear: executionReport.fiscalYear,
    period: executionReport.reportPeriod,
    financialHealth,
    totalAppropriations: summary.totalAppropriated,
    totalObligations: summary.totalObligated,
    totalExpenditures: summary.totalExpended,
    obligationRate: summary.overallObligationRate,
    expenditureRate: summary.overallExpenditureRate,
    keyMetrics: {
      projectedYearEnd: summary.projectedYearEndExpenditures,
      unobligated: summary.totalAppropriated - summary.totalObligated,
    },
    alerts,
    recommendations,
  };
}

export default {
  generateExecutiveSummary,
};
