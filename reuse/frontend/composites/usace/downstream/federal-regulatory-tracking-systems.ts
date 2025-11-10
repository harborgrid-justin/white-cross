/**
 * LOC: USACE-DOWN-FREG-006
 * File: /reuse/frontend/composites/usace/downstream/federal-regulatory-tracking-systems.ts
 *
 * UPSTREAM (imports from):
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *   - ../usace-regulatory-compliance-composites
 *
 * DOWNSTREAM (imported by):
 *   - Federal regulation tracking UI
 *   - Regulatory change management systems
 *   - Citation management dashboards
 *   - Compliance monitoring applications
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  useRegulatoryRequirements,
  validateRegulationCitation,
  parseRegulationReference,
  filterRequirementsByDate,
  type RegulationReference,
  type RegulationType,
  type ComplianceRequirement,
} from '../usace-regulatory-compliance-composites';

export interface RegulationTracker {
  requirements: ComplianceRequirement[];
  trackRegulation: (citation: string, type: RegulationType) => void;
  validateCitation: (citation: string, type: RegulationType) => boolean;
  getActiveRegulations: () => ComplianceRequirement[];
}

export function useFederalRegulatoryTracking(): RegulationTracker {
  const { requirements, addRequirement, getByRegulation } = useRegulatoryRequirements();

  const trackRegulation = useCallback((citation: string, type: RegulationType) => {
    const isValid = validateRegulationCitation(citation, type);
    if (!isValid) throw new Error('Invalid citation format');

    const parsed = parseRegulationReference(citation, type);
    console.log('Tracking regulation:', parsed);
  }, []);

  const getActiveRegulations = useCallback(() => {
    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    return filterRequirementsByDate(requirements, oneYearAgo, now);
  }, [requirements]);

  return {
    requirements,
    trackRegulation,
    validateCitation: validateRegulationCitation,
    getActiveRegulations,
  };
}

export type { RegulationReference, RegulationType, ComplianceRequirement };
