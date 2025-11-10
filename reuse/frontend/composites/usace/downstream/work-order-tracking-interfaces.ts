/**
 * LOC: USACE-DOWN-WOTRACK-015
 * File: /reuse/frontend/composites/usace/downstream/work-order-tracking-interfaces.ts
 *
 * UPSTREAM (imports from):
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *   - ../usace-work-orders-composites
 *
 * DOWNSTREAM (imported by):
 *   - Work order tracking UI
 *   - Status tracking dashboards
 *   - Progress monitoring systems
 *   - Time tracking interfaces
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  useWorkOrderStatusTracking,
  useWorkOrderTimeTracking,
  useWorkOrderMaterials,
  type WorkOrder,
  type StatusHistory,
  type TimeEntry,
  type MaterialRequisition,
} from '../usace-work-orders-composites';

export interface WorkOrderTrackingInterface {
  statusHistory: StatusHistory[];
  changeStatus: (newStatus: any, reason?: string, notes?: string) => Promise<void>;
  timeEntries: TimeEntry[];
  startTimer: (description: string, billable?: boolean) => Promise<any>;
  stopTimer: (timeEntryId: string) => Promise<any>;
  materials: MaterialRequisition[];
}

export function useWorkOrderTrackingInterface(workOrderId: string): WorkOrderTrackingInterface {
  const { statusHistory, changeStatus } = useWorkOrderStatusTracking(workOrderId);
  const { timeEntries, startTimer, stopTimer } = useWorkOrderTimeTracking(workOrderId);
  const { materials } = useWorkOrderMaterials(workOrderId);

  return {
    statusHistory,
    changeStatus,
    timeEntries,
    startTimer,
    stopTimer,
    materials,
  };
}

export type { WorkOrder, StatusHistory, TimeEntry, MaterialRequisition };
