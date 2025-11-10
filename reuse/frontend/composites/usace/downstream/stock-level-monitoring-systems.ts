/**
 * LOC: USACE-DOWNSTREAM-STOCK-MON-002
 * File: /reuse/frontend/composites/usace/downstream/stock-level-monitoring-systems.ts
 *
 * UPSTREAM (imports from):
 *   - ../usace-inventory-systems-composites
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *
 * DOWNSTREAM (imported by):
 *   - USACE CEFMS stock monitoring dashboards
 *   - Automated reorder systems
 *   - Inventory alert services
 *   - Supply chain analytics
 */

'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  StockLevel,
  ReorderRecommendation,
  InventoryItem,
  useStockLevels,
  useReorderRecommendations,
  calculateStockoutProbability,
} from '../usace-inventory-systems-composites';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface StockAlert {
  alertId: string;
  itemId: string;
  itemNumber: string;
  alertType: 'stockout' | 'low_stock' | 'overstock' | 'expiring' | 'no_movement';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  currentQuantity: number;
  reorderPoint: number;
  locationId: string;
  createdDate: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedDate?: Date;
}

export interface StockMonitoringDashboard {
  totalItems: number;
  itemsInStock: number;
  itemsOutOfStock: number;
  itemsBelowReorder: number;
  criticalAlerts: number;
  totalValue: number;
  alerts: StockAlert[];
}

export interface StockForecast {
  itemId: string;
  forecastPeriods: {
    period: string;
    projectedDemand: number;
    projectedQuantity: number;
    reorderSuggested: boolean;
  }[];
}

// ============================================================================
// STOCK MONITORING HOOKS
// ============================================================================

/**
 * Hook for real-time stock level monitoring
 *
 * @param {string} locationId - Optional location filter
 * @returns {object} Stock monitoring data and operations
 *
 * @example
 * ```tsx
 * function StockMonitor({ locationId }) {
 *   const {
 *     dashboard,
 *     alerts,
 *     acknowledgeAlert,
 *     refreshMonitoring
 *   } = useStockMonitoring(locationId);
 * }
 * ```
 */
export function useStockMonitoring(locationId?: string) {
  const [allStockLevels, setAllStockLevels] = useState<StockLevel[]>([]);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadStockLevels = useCallback(async () => {
    setLoading(true);
    try {
      const url = locationId
        ? `/api/usace/inventory/stock-levels?locationId=${locationId}`
        : `/api/usace/inventory/stock-levels`;
      const response = await fetch(url);
      const data = await response.json();
      setAllStockLevels(data);
    } finally {
      setLoading(false);
    }
  }, [locationId]);

  const generateAlerts = useCallback((stockLevels: StockLevel[]) => {
    const newAlerts: StockAlert[] = [];

    stockLevels.forEach(sl => {
      // Stockout alert
      if (sl.quantityOnHand === 0) {
        newAlerts.push({
          alertId: `alert_${Date.now()}_${sl.itemId}_stockout`,
          itemId: sl.itemId,
          itemNumber: '', // Would be populated from item data
          alertType: 'stockout',
          severity: 'critical',
          message: 'Item is out of stock',
          currentQuantity: sl.quantityOnHand,
          reorderPoint: sl.reorderPoint,
          locationId: sl.locationId,
          createdDate: new Date(),
          acknowledged: false,
        });
      }
      // Low stock alert
      else if (sl.quantityAvailable <= sl.reorderPoint) {
        newAlerts.push({
          alertId: `alert_${Date.now()}_${sl.itemId}_low`,
          itemId: sl.itemId,
          itemNumber: '',
          alertType: 'low_stock',
          severity: sl.quantityAvailable <= sl.safetyStock ? 'high' : 'medium',
          message: `Stock level below reorder point (${sl.quantityAvailable} units)`,
          currentQuantity: sl.quantityAvailable,
          reorderPoint: sl.reorderPoint,
          locationId: sl.locationId,
          createdDate: new Date(),
          acknowledged: false,
        });
      }
      // Overstock alert
      else if (sl.quantityOnHand > sl.maximumLevel * 1.2) {
        newAlerts.push({
          alertId: `alert_${Date.now()}_${sl.itemId}_over`,
          itemId: sl.itemId,
          itemNumber: '',
          alertType: 'overstock',
          severity: 'low',
          message: `Stock level exceeds maximum (${sl.quantityOnHand} units)`,
          currentQuantity: sl.quantityOnHand,
          reorderPoint: sl.reorderPoint,
          locationId: sl.locationId,
          createdDate: new Date(),
          acknowledged: false,
        });
      }
    });

    setAlerts(newAlerts);
    return newAlerts;
  }, []);

  const dashboard = useMemo((): StockMonitoringDashboard => {
    const totalItems = allStockLevels.length;
    const itemsInStock = allStockLevels.filter(sl => sl.quantityOnHand > 0).length;
    const itemsOutOfStock = allStockLevels.filter(sl => sl.quantityOnHand === 0).length;
    const itemsBelowReorder = allStockLevels.filter(sl =>
      sl.quantityAvailable <= sl.reorderPoint && sl.quantityOnHand > 0
    ).length;
    const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length;
    const totalValue = allStockLevels.reduce((sum, sl) => sum + sl.valuationAmount, 0);

    return {
      totalItems,
      itemsInStock,
      itemsOutOfStock,
      itemsBelowReorder,
      criticalAlerts,
      totalValue: Math.round(totalValue * 100) / 100,
      alerts,
    };
  }, [allStockLevels, alerts]);

  const acknowledgeAlert = useCallback((alertId: string, acknowledgedBy: string) => {
    setAlerts(prev => prev.map(a =>
      a.alertId === alertId
        ? { ...a, acknowledged: true, acknowledgedBy, acknowledgedDate: new Date() }
        : a
    ));
  }, []);

  useEffect(() => {
    loadStockLevels();
  }, [loadStockLevels]);

  useEffect(() => {
    if (allStockLevels.length > 0) {
      generateAlerts(allStockLevels);
    }
  }, [allStockLevels, generateAlerts]);

  return {
    dashboard,
    stockLevels: allStockLevels,
    alerts,
    loading,
    acknowledgeAlert,
    refreshMonitoring: loadStockLevels,
  };
}

/**
 * Generates stock level forecast
 *
 * @param {string} itemId - Item to forecast
 * @param {StockLevel} currentStock - Current stock level
 * @param {number} averageDailyUsage - Average daily usage
 * @param {number} forecastDays - Days to forecast
 * @returns {StockForecast} Stock forecast
 *
 * @example
 * ```tsx
 * const forecast = generateStockForecast('item-123', stockLevel, 5.5, 90);
 * ```
 */
export function generateStockForecast(
  itemId: string,
  currentStock: StockLevel,
  averageDailyUsage: number,
  forecastDays: number = 90
): StockForecast {
  const periods: StockForecast['forecastPeriods'] = [];
  const periodsCount = Math.ceil(forecastDays / 30);

  let runningQuantity = currentStock.quantityAvailable;

  for (let i = 0; i < periodsCount; i++) {
    const periodStart = i * 30;
    const periodEnd = Math.min((i + 1) * 30, forecastDays);
    const periodDays = periodEnd - periodStart;
    const periodDemand = averageDailyUsage * periodDays;

    runningQuantity -= periodDemand;
    const reorderSuggested = runningQuantity <= currentStock.reorderPoint;

    if (reorderSuggested && runningQuantity < currentStock.reorderPoint) {
      runningQuantity += currentStock.reorderQuantity;
    }

    periods.push({
      period: `Month ${i + 1}`,
      projectedDemand: Math.round(periodDemand),
      projectedQuantity: Math.round(runningQuantity),
      reorderSuggested,
    });
  }

  return {
    itemId,
    forecastPeriods: periods,
  };
}

/**
 * Analyzes stock turnover rate
 *
 * @param {StockLevel} stockLevel - Stock level data
 * @param {number} annualUsage - Annual usage quantity
 * @returns {object} Turnover analysis
 *
 * @example
 * ```tsx
 * const turnover = analyzeStockTurnover(stockLevel, 1200);
 * console.log(`Turnover rate: ${turnover.turnoverRate}x per year`);
 * ```
 */
export function analyzeStockTurnover(
  stockLevel: StockLevel,
  annualUsage: number
): {
  turnoverRate: number;
  daysOfSupply: number;
  turnoverCategory: 'fast' | 'medium' | 'slow';
  recommendation: string;
} {
  const averageInventory = (stockLevel.quantityOnHand + stockLevel.reorderPoint) / 2;
  const turnoverRate = averageInventory > 0 ? annualUsage / averageInventory : 0;
  const daysOfSupply = turnoverRate > 0 ? 365 / turnoverRate : 365;

  let turnoverCategory: 'fast' | 'medium' | 'slow';
  let recommendation: string;

  if (turnoverRate >= 12) {
    turnoverCategory = 'fast';
    recommendation = 'Fast-moving item - consider increasing safety stock';
  } else if (turnoverRate >= 4) {
    turnoverCategory = 'medium';
    recommendation = 'Normal turnover - current levels appropriate';
  } else {
    turnoverCategory = 'slow';
    recommendation = 'Slow-moving item - consider reducing stock levels';
  }

  return {
    turnoverRate: Math.round(turnoverRate * 100) / 100,
    daysOfSupply: Math.round(daysOfSupply),
    turnoverCategory,
    recommendation,
  };
}

/**
 * Prioritizes reorder recommendations
 *
 * @param {ReorderRecommendation[]} recommendations - Reorder recommendations
 * @returns {ReorderRecommendation[]} Prioritized recommendations
 *
 * @example
 * ```tsx
 * const prioritized = prioritizeReorders(recommendations);
 * prioritized.slice(0, 10).forEach(r => processReorder(r));
 * ```
 */
export function prioritizeReorders(
  recommendations: ReorderRecommendation[]
): ReorderRecommendation[] {
  return [...recommendations].sort((a, b) => {
    // First priority: Critical items
    if (a.priority === 'critical' && b.priority !== 'critical') return -1;
    if (b.priority === 'critical' && a.priority !== 'critical') return 1;

    // Second priority: Days until stockout
    if (a.daysUntilStockout !== b.daysUntilStockout) {
      return a.daysUntilStockout - b.daysUntilStockout;
    }

    // Third priority: Estimated cost (higher cost items first)
    return b.estimatedCost - a.estimatedCost;
  });
}

/**
 * Calculates optimal order quantity using EOQ model
 *
 * @param {number} annualDemand - Annual demand quantity
 * @param {number} orderingCost - Cost per order
 * @param {number} holdingCost - Annual holding cost per unit
 * @returns {object} EOQ calculation results
 *
 * @example
 * ```tsx
 * const eoq = calculateEconomicOrderQuantity(12000, 50, 2.5);
 * console.log(`Optimal order quantity: ${eoq.orderQuantity} units`);
 * ```
 */
export function calculateEconomicOrderQuantity(
  annualDemand: number,
  orderingCost: number,
  holdingCost: number
): {
  orderQuantity: number;
  ordersPerYear: number;
  totalAnnualCost: number;
  averageInventory: number;
} {
  const orderQuantity = Math.sqrt((2 * annualDemand * orderingCost) / holdingCost);
  const ordersPerYear = annualDemand / orderQuantity;
  const totalAnnualCost = (ordersPerYear * orderingCost) + ((orderQuantity / 2) * holdingCost);
  const averageInventory = orderQuantity / 2;

  return {
    orderQuantity: Math.ceil(orderQuantity),
    ordersPerYear: Math.round(ordersPerYear * 100) / 100,
    totalAnnualCost: Math.round(totalAnnualCost * 100) / 100,
    averageInventory: Math.round(averageInventory),
  };
}

// Export all functions
export default {
  useStockMonitoring,
  generateStockForecast,
  analyzeStockTurnover,
  prioritizeReorders,
  calculateEconomicOrderQuantity,
};
