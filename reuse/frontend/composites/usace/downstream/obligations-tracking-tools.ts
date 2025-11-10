/**
 * LOC: USACE-DOWNSTREAM-OBL-TRACK-003
 * File: /reuse/frontend/composites/usace/downstream/obligations-tracking-tools.ts
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  ObligationDocument,
  Deobligation,
  UndeliveredOrder,
  useObligationManagement,
  useUndeliveredOrders,
} from '../usace-fiscal-operations-composites';

export interface ObligationSummary {
  totalObligations: number;
  activeObligations: number;
  fullyExpended: number;
  partiallyExpended: number;
  unobligatedBalance: number;
  averageObligationAge: number;
}

export function useObligationTracking(appropriationId: string) {
  const { obligations, createObligation, modifyObligation, deobligate } = useObligationManagement();
  const { undeliveredOrders, trackUndelivered } = useUndeliveredOrders();

  const obligationsForAppropriation = useMemo(() =>
    obligations.filter(o => o.appropriationId === appropriationId),
    [obligations, appropriationId]
  );

  const summary = useMemo((): ObligationSummary => {
    const total = obligationsForAppropriation.length;
    const active = obligationsForAppropriation.filter(o => o.status === 'obligated').length;
    const fullyExpended = obligationsForAppropriation.filter(o => o.status === 'fully_expended').length;
    const partiallyExpended = obligationsForAppropriation.filter(o => o.status === 'partially_expended').length;
    const unobligated = obligationsForAppropriation.reduce((sum, o) => sum + o.unobligatedAmount, 0);

    const now = new Date();
    const totalAge = obligationsForAppropriation.reduce((sum, o) => {
      const ageInDays = (now.getTime() - new Date(o.obligationDate).getTime()) / (1000 * 60 * 60 * 24);
      return sum + ageInDays;
    }, 0);
    const avgAge = total > 0 ? totalAge / total : 0;

    return {
      totalObligations: total,
      activeObligations: active,
      fullyExpended,
      partiallyExpended,
      unobligatedBalance: Math.round(unobligated * 100) / 100,
      averageObligationAge: Math.round(avgAge),
    };
  }, [obligationsForAppropriation]);

  return {
    obligations: obligationsForAppropriation,
    summary,
    undeliveredOrders,
    createObligation,
    modifyObligation,
    deobligate,
  };
}

export function identifyAgedObligations(
  obligations: ObligationDocument[],
  daysThreshold: number = 90
): ObligationDocument[] {
  const now = new Date();
  return obligations.filter(o => {
    const ageInDays = (now.getTime() - new Date(o.obligationDate).getTime()) / (1000 * 60 * 60 * 24);
    return ageInDays > daysThreshold && o.remainingBalance > 0;
  }).sort((a, b) => {
    const ageA = (now.getTime() - new Date(a.obligationDate).getTime()) / (1000 * 60 * 60 * 24);
    const ageB = (now.getTime() - new Date(b.obligationDate).getTime()) / (1000 * 60 * 60 * 24);
    return ageB - ageA;
  });
}

export default {
  useObligationTracking,
  identifyAgedObligations,
};
