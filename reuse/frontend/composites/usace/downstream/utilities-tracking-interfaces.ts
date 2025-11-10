/**
 * LOC: USACE-DOWNSTREAM-UTIL-TRACK-003
 * File: /reuse/frontend/composites/usace/downstream/utilities-tracking-interfaces.ts
 *
 * UPSTREAM (imports from):
 *   - ../usace-facilities-operations-composites
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *
 * DOWNSTREAM (imported by):
 *   - USACE CEFMS utilities monitoring systems
 *   - Energy management applications
 *   - Cost allocation tools
 *   - Budget variance reporting
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  UtilityConsumption,
  UtilityType,
} from '../usace-facilities-operations-composites';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface UtilityTrend {
  period: string;
  consumption: number;
  cost: number;
  budgetAllocation: number;
  variance: number;
}

export interface UtilityAlert {
  alertId: string;
  utilityType: UtilityType;
  alertType: 'spike' | 'budget_exceeded' | 'meter_error' | 'unusual_pattern';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  detectedDate: Date;
  acknowledged: boolean;
}

// ============================================================================
// UTILITY TRACKING HOOKS
// ============================================================================

/**
 * Hook for utility consumption tracking
 *
 * @param {string} facilityId - Facility ID
 * @returns {object} Utility tracking operations
 *
 * @example
 * ```tsx
 * function UtilityMonitor({ facilityId }) {
 *   const { consumption, recordReading } = useUtilityTracking(facilityId);
 * }
 * ```
 */
export function useUtilityTracking(facilityId: string) {
  const [consumption, setConsumption] = useState<UtilityConsumption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadConsumption = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/facilities/${facilityId}/utilities`);
      const data = await response.json();
      setConsumption(data);
    } finally {
      setLoading(false);
    }
  }, [facilityId]);

  const recordReading = useCallback(async (reading: Partial<UtilityConsumption>) => {
    const response = await fetch(`/api/facilities/${facilityId}/utilities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reading),
    });
    const newReading = await response.json();
    setConsumption(prev => [newReading, ...prev]);
    return newReading;
  }, [facilityId]);

  return { consumption, loading, loadConsumption, recordReading };
}

/**
 * Calculates utility consumption trends
 *
 * @param {UtilityConsumption[]} consumption - Consumption records
 * @param {UtilityType} utilityType - Type of utility
 * @param {number} periods - Number of periods to analyze
 * @returns {UtilityTrend[]} Trend data
 *
 * @example
 * ```tsx
 * const trends = calculateUtilityTrends(consumption, 'electricity', 12);
 * ```
 */
export function calculateUtilityTrends(
  consumption: UtilityConsumption[],
  utilityType: UtilityType,
  periods: number = 12
): UtilityTrend[] {
  const filtered = consumption
    .filter(c => c.utilityType === utilityType)
    .sort((a, b) => new Date(a.readingDate).getTime() - new Date(b.readingDate).getTime())
    .slice(-periods);

  return filtered.map(c => ({
    period: `${c.fiscalYear}-${String(c.fiscalPeriod).padStart(2, '0')}`,
    consumption: c.consumption,
    cost: c.totalCost,
    budgetAllocation: c.budgetAllocation,
    variance: c.totalCost - c.budgetAllocation,
  }));
}

/**
 * Analyzes utility variance from budget
 *
 * @param {UtilityConsumption[]} consumption - Consumption records
 * @returns {object} Variance analysis
 *
 * @example
 * ```tsx
 * const analysis = analyzeUtilityVariance(consumption);
 * console.log(`Total variance: $${analysis.totalVariance}`);
 * ```
 */
export function analyzeUtilityVariance(consumption: UtilityConsumption[]): {
  totalVariance: number;
  overBudgetCount: number;
  averageVariancePercent: number;
  utilities: Record<string, { variance: number; percentVariance: number }>;
} {
  const totalVariance = consumption.reduce((sum, c) => sum + (c.totalCost - c.budgetAllocation), 0);
  const overBudgetCount = consumption.filter(c => c.totalCost > c.budgetAllocation).length;
  const avgVariancePercent = consumption.reduce((sum, c) => sum + c.variancePercent, 0) / consumption.length;

  const utilities: Record<string, { variance: number; percentVariance: number }> = {};
  const groupedByType = consumption.reduce((acc, c) => {
    if (!acc[c.utilityType]) acc[c.utilityType] = [];
    acc[c.utilityType].push(c);
    return acc;
  }, {} as Record<UtilityType, UtilityConsumption[]>);

  Object.entries(groupedByType).forEach(([type, records]) => {
    const variance = records.reduce((sum, r) => sum + (r.totalCost - r.budgetAllocation), 0);
    const percentVariance = records.reduce((sum, r) => sum + r.variancePercent, 0) / records.length;
    utilities[type] = { variance, percentVariance };
  });

  return {
    totalVariance: Math.round(totalVariance * 100) / 100,
    overBudgetCount,
    averageVariancePercent: Math.round(avgVariancePercent * 10) / 10,
    utilities,
  };
}

/**
 * Detects utility consumption anomalies
 *
 * @param {UtilityConsumption[]} consumption - Consumption records
 * @param {UtilityType} utilityType - Type of utility
 * @returns {UtilityAlert[]} Detected alerts
 *
 * @example
 * ```tsx
 * const alerts = detectUtilityAnomalies(consumption, 'electricity');
 * ```
 */
export function detectUtilityAnomalies(
  consumption: UtilityConsumption[],
  utilityType: UtilityType
): UtilityAlert[] {
  const alerts: UtilityAlert[] = [];
  const filtered = consumption.filter(c => c.utilityType === utilityType).sort((a, b) =>
    new Date(a.readingDate).getTime() - new Date(b.readingDate).getTime()
  );

  if (filtered.length < 3) return alerts;

  // Calculate average consumption
  const avgConsumption = filtered.reduce((sum, c) => sum + c.consumption, 0) / filtered.length;
  const stdDev = Math.sqrt(
    filtered.reduce((sum, c) => sum + Math.pow(c.consumption - avgConsumption, 2), 0) / filtered.length
  );

  // Check latest reading for spike
  const latest = filtered[filtered.length - 1];
  if (latest.consumption > avgConsumption + 2 * stdDev) {
    alerts.push({
      alertId: `alert_${Date.now()}`,
      utilityType,
      alertType: 'spike',
      severity: 'warning',
      message: `Consumption spike detected: ${latest.consumption} ${latest.unit} (${Math.round((latest.consumption / avgConsumption - 1) * 100)}% above average)`,
      detectedDate: new Date(),
      acknowledged: false,
    });
  }

  // Check budget exceeded
  if (latest.totalCost > latest.budgetAllocation * 1.1) {
    alerts.push({
      alertId: `alert_${Date.now()}_budget`,
      utilityType,
      alertType: 'budget_exceeded',
      severity: 'critical',
      message: `Budget exceeded by ${Math.round(latest.variancePercent)}%`,
      detectedDate: new Date(),
      acknowledged: false,
    });
  }

  return alerts;
}

/**
 * Calculates utility cost per square foot
 *
 * @param {UtilityConsumption[]} consumption - Consumption records
 * @param {number} squareFeet - Facility square footage
 * @returns {object} Cost metrics per square foot
 *
 * @example
 * ```tsx
 * const costMetrics = calculateUtilityCostPerSqFt(consumption, 50000);
 * ```
 */
export function calculateUtilityCostPerSqFt(
  consumption: UtilityConsumption[],
  squareFeet: number
): {
  totalCostPerSqFt: number;
  byUtilityType: Record<string, number>;
  comparison: 'above_average' | 'average' | 'below_average';
} {
  const totalCost = consumption.reduce((sum, c) => sum + c.totalCost, 0);
  const totalCostPerSqFt = squareFeet > 0 ? totalCost / squareFeet : 0;

  const byUtilityType: Record<string, number> = {};
  const groupedByType = consumption.reduce((acc, c) => {
    if (!acc[c.utilityType]) acc[c.utilityType] = 0;
    acc[c.utilityType] += c.totalCost;
    return acc;
  }, {} as Record<string, number>);

  Object.entries(groupedByType).forEach(([type, cost]) => {
    byUtilityType[type] = squareFeet > 0 ? cost / squareFeet : 0;
  });

  // Industry average for commercial buildings: ~$2-$3 per sq ft per year
  let comparison: 'above_average' | 'average' | 'below_average';
  if (totalCostPerSqFt > 3) {
    comparison = 'above_average';
  } else if (totalCostPerSqFt > 2) {
    comparison = 'average';
  } else {
    comparison = 'below_average';
  }

  return {
    totalCostPerSqFt: Math.round(totalCostPerSqFt * 100) / 100,
    byUtilityType,
    comparison,
  };
}

export default {
  useUtilityTracking,
  calculateUtilityTrends,
  analyzeUtilityVariance,
  detectUtilityAnomalies,
  calculateUtilityCostPerSqFt,
};
