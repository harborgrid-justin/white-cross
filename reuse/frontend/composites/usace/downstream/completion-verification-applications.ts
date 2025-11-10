/**
 * LOC: USACE-DOWN-VERIFY-016
 * File: /reuse/frontend/composites/usace/downstream/completion-verification-applications.ts
 *
 * UPSTREAM (imports from):
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *   - ../usace-work-orders-composites
 *
 * DOWNSTREAM (imported by):
 *   - Completion verification UI
 *   - Quality assurance systems
 *   - Customer satisfaction surveys
 *   - Final inspection dashboards
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  useWorkOrderVerification,
  useCustomerSatisfaction,
  type VerificationStatus,
  type SatisfactionSurvey,
} from '../usace-work-orders-composites';

export interface CompletionVerificationApp {
  verifyCompletion: (notes?: string) => Promise<void>;
  rejectCompletion: (reason: string) => Promise<void>;
  requestRework: (instructions: string) => Promise<void>;
  submitSurvey: (data: Omit<SatisfactionSurvey, 'id'>) => Promise<any>;
  surveys: SatisfactionSurvey[];
}

export function useCompletionVerificationApplication(workOrderId: string): CompletionVerificationApp {
  const { verifyCompletion, rejectCompletion, requestRework } = useWorkOrderVerification(workOrderId);
  const { surveys, submitSurvey } = useCustomerSatisfaction(workOrderId);

  return {
    verifyCompletion,
    rejectCompletion,
    requestRework,
    submitSurvey,
    surveys,
  };
}

export type { VerificationStatus, SatisfactionSurvey };
