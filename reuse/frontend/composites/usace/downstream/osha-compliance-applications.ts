/**
 * LOC: USACE-DOWN-OSHA-012
 * File: /reuse/frontend/composites/usace/downstream/osha-compliance-applications.ts
 *
 * UPSTREAM (imports from):
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *   - ../usace-safety-management-composites
 *
 * DOWNSTREAM (imported by):
 *   - OSHA recordkeeping UI
 *   - OSHA reporting systems
 *   - OSHA compliance dashboards
 *   - Regulatory reporting tools
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  useOSHACompliance,
  useSafetyMetrics,
  type SafetyIncident,
  type OSHARecordability,
} from '../usace-safety-management-composites';

export interface OSHAComplianceApp {
  recordableIncidents: SafetyIncident[];
  generate300: () => any;
  generate300A: () => any;
  generate301: (incidentId: string) => any;
  getOSHAMetrics: () => any;
}

export function useOSHAComplianceApplication(year: number): OSHAComplianceApp {
  const { recordableIncidents, generateOSHA300, generateOSHA300A, generateOSHA301 } = useOSHACompliance(year);
  const { metrics } = useSafetyMetrics();

  const getOSHAMetrics = useCallback(() => {
    return {
      totalRecordable: recordableIncidents.length,
      lostTimeIncidents: recordableIncidents.filter(i => i.lostWorkDays > 0).length,
      metrics,
    };
  }, [recordableIncidents, metrics]);

  return {
    recordableIncidents,
    generate300: generateOSHA300,
    generate300A: generateOSHA300A,
    generate301: generateOSHA301,
    getOSHAMetrics,
  };
}

export type { SafetyIncident, OSHARecordability };
