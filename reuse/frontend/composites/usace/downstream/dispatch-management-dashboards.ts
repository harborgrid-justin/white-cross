/**
 * LOC: USACE-DOWN-DISPATCH-014
 * File: /reuse/frontend/composites/usace/downstream/dispatch-management-dashboards.ts
 *
 * UPSTREAM (imports from):
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *   - ../usace-work-orders-composites
 *
 * DOWNSTREAM (imported by):
 *   - Dispatch center UI
 *   - Technician dispatch systems
 *   - Real-time dispatch tracking
 *   - Route optimization dashboards
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  useWorkOrderDispatch,
  useWorkOrderAssignments,
  type WorkOrderDispatch,
  type WorkOrderAssignment,
} from '../usace-work-orders-composites';

export interface DispatchDashboard {
  dispatches: WorkOrderDispatch[];
  activeDispatches: WorkOrderDispatch[];
  dispatchWorkOrder: (data: Omit<WorkOrderDispatch, 'id'>) => Promise<any>;
  updateDispatchStatus: (id: string, status: any, notes?: string) => Promise<any>;
}

export function useDispatchManagementDashboard(): DispatchDashboard {
  const {
    dispatches,
    activeDispatches,
    dispatchWorkOrder,
    updateDispatchStatus,
  } = useWorkOrderDispatch();

  return {
    dispatches,
    activeDispatches,
    dispatchWorkOrder,
    updateDispatchStatus,
  };
}

export type { WorkOrderDispatch, WorkOrderAssignment };
