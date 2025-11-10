/**
 * LOC: USACE-DOWNSTREAM-APPROP-002
 * File: /reuse/frontend/composites/usace/downstream/appropriations-management-systems.ts
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  Apportionment,
  Allotment,
  ObligationAuthority,
  useApportionmentManagement,
  useAllotmentManagement,
} from '../usace-fiscal-operations-composites';

export interface AppropriationPlan {
  appropriationId: string;
  appropriationCode: string;
  fiscalYear: number;
  totalAuthorized: number;
  apportionments: Apportionment[];
  allotments: Allotment[];
  quarterlyTargets: Record<number, number>;
  executionStrategy: string;
}

export function useAppropriationPlanning(fiscalYear: number) {
  const { apportionments, createApportionment } = useApportionmentManagement(fiscalYear);
  const { allotments, createAllotment } = useAllotmentManagement();
  const [plans, setPlans] = useState<AppropriationPlan[]>([]);

  const createExecutionPlan = useCallback(async (
    appropriationId: string,
    totalAuthorized: number
  ): Promise<AppropriationPlan> => {
    const quarterlyTargets: Record<number, number> = {
      1: totalAuthorized * 0.20,
      2: totalAuthorized * 0.25,
      3: totalAuthorized * 0.30,
      4: totalAuthorized * 0.25,
    };

    const plan: AppropriationPlan = {
      appropriationId,
      appropriationCode: `APPROP-${appropriationId}`,
      fiscalYear,
      totalAuthorized,
      apportionments: [],
      allotments: [],
      quarterlyTargets,
      executionStrategy: 'balanced',
    };

    setPlans(prev => [...prev, plan]);
    return plan;
  }, [fiscalYear]);

  return {
    plans,
    apportionments,
    allotments,
    createExecutionPlan,
  };
}

export function calculateQuarterlyTargets(
  totalAppropriation: number,
  strategy: 'front_loaded' | 'back_loaded' | 'balanced'
): Record<number, number> {
  const targets: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };

  switch (strategy) {
    case 'front_loaded':
      targets[1] = totalAppropriation * 0.35;
      targets[2] = totalAppropriation * 0.30;
      targets[3] = totalAppropriation * 0.20;
      targets[4] = totalAppropriation * 0.15;
      break;
    case 'back_loaded':
      targets[1] = totalAppropriation * 0.15;
      targets[2] = totalAppropriation * 0.20;
      targets[3] = totalAppropriation * 0.30;
      targets[4] = totalAppropriation * 0.35;
      break;
    case 'balanced':
    default:
      targets[1] = totalAppropriation * 0.25;
      targets[2] = totalAppropriation * 0.25;
      targets[3] = totalAppropriation * 0.25;
      targets[4] = totalAppropriation * 0.25;
      break;
  }

  return targets;
}

export default {
  useAppropriationPlanning,
  calculateQuarterlyTargets,
};
