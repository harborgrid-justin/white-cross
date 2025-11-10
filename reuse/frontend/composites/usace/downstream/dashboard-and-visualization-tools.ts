/**
 * LOC: USACE-DOWNSTREAM-DASH-VIZ-002
 * File: /reuse/frontend/composites/usace/downstream/dashboard-and-visualization-tools.ts
 */

'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  BudgetVsActualReport,
  ExecutionReport,
  ExecutionTrend,
} from '../usace-financial-reporting-composites';

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

export function generateBudgetVsActualChart(report: BudgetVsActualReport): ChartData {
  const labels = report.sections.map(s => s.appropriationCode);
  const budgetedData = report.sections.map(s => s.budgetedAmount);
  const actualData = report.sections.map(s => s.expendedAmount);

  return {
    labels,
    datasets: [
      {
        label: 'Budgeted',
        data: budgetedData,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
      },
      {
        label: 'Actual',
        data: actualData,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132)',
      },
    ],
  };
}

export function generateExecutionTrendChart(trends: ExecutionTrend[]): ChartData {
  return {
    labels: trends.map(t => t.period),
    datasets: [
      {
        label: 'Obligations',
        data: trends.map(t => t.cumulativeObligations),
        borderColor: 'rgb(75, 192, 192)',
      },
      {
        label: 'Expenditures',
        data: trends.map(t => t.cumulativeExpenditures),
        borderColor: 'rgb(153, 102, 255)',
      },
    ],
  };
}

export function calculateDashboardKPIs(report: ExecutionReport): {
  obligationRate: number;
  expenditureRate: number;
  burnRate: number;
  projectedUtilization: number;
} {
  const { summary } = report;
  const burnRate = summary.totalAppropriated > 0
    ? (summary.totalExpended / summary.totalAppropriated) * 100
    : 0;
  const projectedUtilization = summary.totalAppropriated > 0
    ? (summary.projectedYearEndExpenditures / summary.totalAppropriated) * 100
    : 0;

  return {
    obligationRate: Math.round(summary.overallObligationRate * 10) / 10,
    expenditureRate: Math.round(summary.overallExpenditureRate * 10) / 10,
    burnRate: Math.round(burnRate * 10) / 10,
    projectedUtilization: Math.round(projectedUtilization * 10) / 10,
  };
}

export default {
  generateBudgetVsActualChart,
  generateExecutionTrendChart,
  calculateDashboardKPIs,
};
