/**
 * LOC: USACE-DOWN-TRAIN-011
 * File: /reuse/frontend/composites/usace/downstream/safety-training-interfaces.ts
 *
 * UPSTREAM (imports from):
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *   - ../usace-safety-management-composites
 *
 * DOWNSTREAM (imported by):
 *   - Training management UI
 *   - Employee training portals
 *   - Certification tracking systems
 *   - Training compliance dashboards
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  useSafetyTrainingManagement,
  useEmployeeTrainingRecords,
  type SafetyTrainingProgram,
  type TrainingSession,
  type EmployeeTrainingRecord,
  type TrainingStatus,
} from '../usace-safety-management-composites';

export interface TrainingInterface {
  programs: SafetyTrainingProgram[];
  sessions: TrainingSession[];
  activePrograms: SafetyTrainingProgram[];
  oshaRequiredPrograms: SafetyTrainingProgram[];
  createProgram: (data: Omit<SafetyTrainingProgram, 'id'>) => Promise<any>;
  scheduleSession: (data: Omit<TrainingSession, 'id'>) => Promise<any>;
}

export function useSafetyTrainingInterface(): TrainingInterface {
  const {
    programs,
    sessions,
    activePrograms,
    oshaRequiredPrograms,
    createProgram,
    scheduleSession,
  } = useSafetyTrainingManagement();

  return {
    programs,
    sessions,
    activePrograms,
    oshaRequiredPrograms,
    createProgram,
    scheduleSession,
  };
}

export function useEmployeeTrainingInterface(employeeId: string) {
  const {
    trainingRecord,
    isCompliant,
    expiringTrainings,
    overdueTrainings,
    recordTrainingCompletion,
  } = useEmployeeTrainingRecords(employeeId);

  return {
    trainingRecord,
    isCompliant,
    expiringTrainings,
    overdueTrainings,
    recordTrainingCompletion,
  };
}

export type { SafetyTrainingProgram, TrainingSession, EmployeeTrainingRecord, TrainingStatus };
