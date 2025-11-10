/**
 * LOC: USACE-DOWN-WO-013
 * File: /reuse/frontend/composites/usace/downstream/work-order-management-ui.ts
 *
 * UPSTREAM (imports from):
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *   - ../usace-work-orders-composites
 *
 * DOWNSTREAM (imported by):
 *   - Work order management dashboards
 *   - Work order creation UI
 *   - Work order tracking systems
 *   - Maintenance management portals
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  useWorkOrderManagement,
  useWorkOrderCreationForm,
  useWorkOrderMetrics,
  type WorkOrder,
  type WorkOrderType,
  type WorkOrderPriority,
  type WorkOrderStatus,
} from '../usace-work-orders-composites';

export interface WorkOrderManagementUI {
  workOrders: WorkOrder[];
  openWorkOrders: WorkOrder[];
  emergencyWorkOrders: WorkOrder[];
  overdueWorkOrders: WorkOrder[];
  createWorkOrder: (data: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt'>) => Promise<any>;
  assignWorkOrder: (id: string, assignedTo: string, assignedTeam?: string) => Promise<any>;
  completeWorkOrder: (id: string, data: any) => Promise<any>;
  metrics: any;
}

export function useWorkOrderManagementUI(facilityId?: string): WorkOrderManagementUI {
  const {
    workOrders,
    openWorkOrders,
    emergencyWorkOrders,
    overdueWorkOrders,
    createWorkOrder,
    assignWorkOrder,
    completeWorkOrder,
  } = useWorkOrderManagement(facilityId);

  const { metrics } = useWorkOrderMetrics();

  return {
    workOrders,
    openWorkOrders,
    emergencyWorkOrders,
    overdueWorkOrders,
    createWorkOrder,
    assignWorkOrder,
    completeWorkOrder,
    metrics,
  };
}

export type { WorkOrder, WorkOrderType, WorkOrderPriority, WorkOrderStatus };
