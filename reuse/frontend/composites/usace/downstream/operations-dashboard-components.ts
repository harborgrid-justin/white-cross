/**
 * LOC: USACE-DOWNSTREAM-OPS-DASH-002
 * File: /reuse/frontend/composites/usace/downstream/operations-dashboard-components.ts
 */

'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  OperationsDashboardMetrics,
  FacilityInspection,
  UtilityConsumption,
} from '../usace-facilities-operations-composites';

export interface DashboardWidget {
  id: string;
  title: string;
  type: 'metric' | 'chart' | 'list' | 'map';
  size: 'small' | 'medium' | 'large';
  refreshInterval?: number;
  data: any;
}

export function useOperationsDashboard() {
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [layout, setLayout] = useState<string>('grid');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const addWidget = useCallback((widget: DashboardWidget) => {
    setWidgets(prev => [...prev, widget]);
  }, []);

  const removeWidget = useCallback((widgetId: string) => {
    setWidgets(prev => prev.filter(w => w.id !== widgetId));
  }, []);

  const refreshDashboard = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all(widgets.map(w => fetch(`/api/widgets/${w.id}/refresh`)));
    } finally {
      setRefreshing(false);
    }
  }, [widgets]);

  return { widgets, layout, setLayout, addWidget, removeWidget, refreshDashboard, refreshing };
}

export function calculateDashboardMetrics(
  facilities: any[],
  inspections: FacilityInspection[],
  utilities: UtilityConsumption[]
): OperationsDashboardMetrics {
  const totalFacilities = facilities.length;
  const activeFacilities = facilities.filter(f => f.status === 'active').length;
  const totalSquareFeet = facilities.reduce((sum, f) => sum + (f.dimensions?.squareFeet || 0), 0);

  const totalCapacity = facilities.reduce((sum, f) => sum + (f.occupancyCapacity || 0), 0);
  const totalOccupancy = facilities.reduce((sum, f) => sum + (f.currentOccupancy || 0), 0);
  const occupancyRate = totalCapacity > 0 ? (totalOccupancy / totalCapacity) * 100 : 0;

  const currentUtilityCosts = utilities.reduce((sum, u) => sum + u.totalCost, 0);
  const previousPeriodCosts = 0;
  const percentChange = previousPeriodCosts > 0
    ? ((currentUtilityCosts - previousPeriodCosts) / previousPeriodCosts) * 100
    : 0;

  const scheduledInspections = inspections.filter(i => i.status === 'scheduled').length;
  const completedInspections = inspections.filter(i => i.status === 'completed').length;
  const overdueInspections = inspections.filter(i => {
    if (i.status !== 'completed' && i.scheduledDate) {
      return new Date(i.scheduledDate) < new Date();
    }
    return false;
  }).length;
  const totalInspections = inspections.length;
  const complianceRate = totalInspections > 0
    ? (inspections.filter(i => i.complianceStatus === 'compliant').length / totalInspections) * 100
    : 100;

  const costPerSquareFoot = totalSquareFeet > 0
    ? currentUtilityCosts / totalSquareFeet
    : 0;

  return {
    totalFacilities,
    activeFacilities,
    totalSquareFeet: Math.round(totalSquareFeet),
    occupancyRate: Math.round(occupancyRate * 10) / 10,
    utilityCosts: {
      current: Math.round(currentUtilityCosts * 100) / 100,
      previousPeriod: Math.round(previousPeriodCosts * 100) / 100,
      percentChange: Math.round(percentChange * 10) / 10,
    },
    maintenanceWorkOrders: {
      open: 0,
      inProgress: 0,
      completed: 0,
      overdue: 0,
    },
    inspections: {
      scheduled: scheduledInspections,
      completed: completedInspections,
      overdue: overdueInspections,
      complianceRate: Math.round(complianceRate * 10) / 10,
    },
    energyEfficiency: {
      currentUsageKWh: 0,
      targetUsageKWh: 0,
      efficiencyRating: 0,
    },
    costPerSquareFoot: Math.round(costPerSquareFoot * 100) / 100,
    spaceUtilization: Math.round(occupancyRate * 10) / 10,
  };
}

export function generateAlertsSummary(metrics: OperationsDashboardMetrics): {
  critical: string[];
  warnings: string[];
  info: string[];
} {
  const critical: string[] = [];
  const warnings: string[] = [];
  const info: string[] = [];

  if (metrics.occupancyRate > 95) {
    critical.push('Facility occupancy critical - over 95%');
  } else if (metrics.occupancyRate > 85) {
    warnings.push('Facility occupancy high - approaching capacity');
  }

  if (metrics.inspections.overdue > 0) {
    critical.push(`${metrics.inspections.overdue} inspections overdue`);
  }

  if (metrics.inspections.complianceRate < 90) {
    warnings.push(`Compliance rate below target: ${metrics.inspections.complianceRate}%`);
  }

  if (metrics.utilityCosts.percentChange > 15) {
    warnings.push(`Utility costs increased ${metrics.utilityCosts.percentChange}% from last period`);
  }

  if (metrics.maintenanceWorkOrders.overdue > 0) {
    critical.push(`${metrics.maintenanceWorkOrders.overdue} work orders overdue`);
  }

  return { critical, warnings, info };
}

export default {
  useOperationsDashboard,
  calculateDashboardMetrics,
  generateAlertsSummary,
};
