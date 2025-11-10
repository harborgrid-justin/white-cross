/**
 * LOC: USACE-DOWN-SAFETY-009
 * File: /reuse/frontend/composites/usace/downstream/safety-management-ui.ts
 *
 * UPSTREAM (imports from):
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *   - ../usace-safety-management-composites
 *
 * DOWNSTREAM (imported by):
 *   - Safety management dashboards
 *   - Safety program UI
 *   - Safety metrics visualization
 *   - Safety compliance portals
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  useSafetyIncidentManagement,
  useSafetyTrainingManagement,
  useSafetyAuditManagement,
  useSafetyMetrics,
  type SafetyIncident,
  type SafetyTrainingProgram,
  type SafetyAudit,
  type SafetyMetrics,
} from '../usace-safety-management-composites';

export interface SafetyManagementUI {
  incidents: SafetyIncident[];
  programs: SafetyTrainingProgram[];
  audits: SafetyAudit[];
  metrics: SafetyMetrics | null;
  createIncident: (data: Omit<SafetyIncident, 'id' | 'createdAt' | 'updatedAt'>) => Promise<any>;
  scheduleTraining: (data: any) => Promise<any>;
  scheduleAudit: (data: Omit<SafetyAudit, 'id'>) => Promise<any>;
}

export function useSafetyManagementUI(facilityId?: string): SafetyManagementUI {
  const { incidents, createIncident, openIncidents } = useSafetyIncidentManagement(facilityId);
  const { programs, scheduleSession } = useSafetyTrainingManagement();
  const { audits, createAudit } = useSafetyAuditManagement(facilityId);
  const { metrics } = useSafetyMetrics();

  return {
    incidents,
    programs,
    audits,
    metrics,
    createIncident,
    scheduleTraining: scheduleSession,
    scheduleAudit: createAudit,
  };
}

export type { SafetyIncident, SafetyTrainingProgram, SafetyAudit, SafetyMetrics };
