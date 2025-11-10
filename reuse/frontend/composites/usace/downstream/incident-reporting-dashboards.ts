/**
 * LOC: USACE-DOWN-INCIDENT-010
 * File: /reuse/frontend/composites/usace/downstream/incident-reporting-dashboards.ts
 *
 * UPSTREAM (imports from):
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *   - ../usace-safety-management-composites
 *
 * DOWNSTREAM (imported by):
 *   - Incident reporting UI
 *   - Incident tracking dashboards
 *   - Investigation management systems
 *   - Corrective action tracking
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  useSafetyIncidentManagement,
  useSafetyIncidentReportForm,
  useCorrectiveActions,
  type SafetyIncident,
  type IncidentType,
  type IncidentSeverity,
} from '../usace-safety-management-composites';

export interface IncidentDashboard {
  incidents: SafetyIncident[];
  openIncidents: SafetyIncident[];
  recordableIncidents: SafetyIncident[];
  reportIncident: (data: Omit<SafetyIncident, 'id' | 'createdAt' | 'updatedAt'>) => Promise<any>;
  assignInvestigator: (id: string, investigator: string) => Promise<any>;
  closeIncident: (id: string, notes: string) => Promise<any>;
}

export function useIncidentReportingDashboard(facilityId?: string): IncidentDashboard {
  const {
    incidents,
    openIncidents,
    recordableIncidents,
    createIncident,
    assignInvestigator,
    closeIncident,
  } = useSafetyIncidentManagement(facilityId);

  return {
    incidents,
    openIncidents,
    recordableIncidents,
    reportIncident: createIncident,
    assignInvestigator,
    closeIncident,
  };
}

export type { SafetyIncident, IncidentType, IncidentSeverity };
