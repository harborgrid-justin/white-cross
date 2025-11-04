/**
 * @fileoverview Immunization Compliance Checking
 * @module lib/actions/immunizations/compliance
 *
 * Functions for checking immunization compliance and requirements.
 * Used to validate student immunization status against grade requirements.
 */

'use server';

import { cache } from 'react';
import { getStudentImmunizations, getImmunizationRequirements } from './immunizations.cache';

// ==========================================
// COMPLIANCE CHECKING
// ==========================================

/**
 * Get student immunization compliance
 * Calculates compliance status against grade-level requirements
 */
export const getStudentImmunizationCompliance = cache(async (
  studentId: string,
  grade: string
): Promise<{
  required: number;
  completed: number;
  pending: number;
  exempt: number;
  complianceRate: number;
}> => {
  try {
    const [records, requirements] = await Promise.all([
      getStudentImmunizations(studentId),
      getImmunizationRequirements(grade)
    ]);

    const required = requirements.filter(req => req.required).length;
    const completed = records.filter(record => record.seriesComplete).length;
    const pending = required - completed;
    const exempt = 0; // Would need to fetch exemptions
    const complianceRate = required > 0 ? (completed / required) * 100 : 100;

    return {
      required,
      completed,
      pending,
      exempt,
      complianceRate
    };
  } catch {
    return {
      required: 0,
      completed: 0,
      pending: 0,
      exempt: 0,
      complianceRate: 0
    };
  }
});
