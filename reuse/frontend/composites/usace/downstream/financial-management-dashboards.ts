/**
 * LOC: USACE-BP-FIN-001
 * File: /reuse/frontend/composites/usace/downstream/financial-management-dashboards.ts
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useTracking } from '../../analytics-tracking-kit';
import {
  useFiscalYearBudget,
  useBudgetAnalytics,
} from '../usace-budget-planning-composites';

export function useFinancialDashboard(fiscalYear: number) {
  const {
    fiscalYearData,
    totalBudget,
    remainingBalance,
  } = useFiscalYearBudget(fiscalYear);
  
  const {
    kpis,
    budgetUtilization,
    generateKPIReport,
  } = useBudgetAnalytics(fiscalYear);
  
  const [dateRange, setDateRange] = useState({
    start: new Date(fiscalYear - 1, 9, 1),
    end: new Date(fiscalYear, 8, 30),
  });
  const { track } = useTracking();
  
  const refreshDashboard = useCallback(() => {
    track('financial_dashboard_refresh', { fiscal_year: fiscalYear });
  }, [fiscalYear, track]);

  const dashboardMetrics = useMemo(() => {
    return {
      totalBudget,
      remainingBalance,
      utilizationRate: totalBudget > 0 ? ((totalBudget - remainingBalance) / totalBudget) * 100 : 0,
      kpis,
    };
  }, [totalBudget, remainingBalance, kpis]);

  return {
    fiscalYearData,
    dashboardMetrics,
    dateRange,
    setDateRange,
    refreshDashboard,
    generateKPIReport,
  };
}

export function useFinancialTrendAnalysis(fiscalYear: number) {
  const [trends, setTrends] = useState<any[]>([]);
  const { track } = useTracking();
  
  const analyzeTrends = useCallback(() => {
    track('financial_trends_analyze', { fiscal_year: fiscalYear });
    const mockTrends = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      budget: Math.random() * 1000000,
      actual: Math.random() * 900000,
    }));
    setTrends(mockTrends);
  }, [fiscalYear, track]);

  return { trends, analyzeTrends };
}

export default {
  useFinancialDashboard,
  useFinancialTrendAnalysis,
};
