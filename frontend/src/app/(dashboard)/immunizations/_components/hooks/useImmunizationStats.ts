/**
 * @fileoverview Immunization Statistics Hook
 * @module app/immunizations/components/hooks
 *
 * Custom hook for calculating immunization statistics and compliance metrics.
 * Provides real-time stats based on current immunization data.
 */

import { useMemo } from 'react';
import type { Immunization, ImmunizationStats } from '../types/immunization.types';

/**
 * Custom hook for calculating immunization statistics
 * @param immunizations - Array of immunizations to analyze
 * @returns Calculated statistics including compliance rate and due counts
 */
export const useImmunizationStats = (immunizations: Immunization[]): ImmunizationStats => {
  return useMemo(() => {
    const uniqueStudents = new Set(immunizations.map((imm) => imm.studentId));
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const upToDate = immunizations.filter(
      (imm) => imm.status === 'administered' || imm.status === 'completed'
    ).length;

    const overdue = immunizations.filter((imm) => imm.status === 'overdue').length;

    const scheduled = immunizations.filter((imm) => imm.status === 'scheduled').length;

    const declined = immunizations.filter((imm) => imm.status === 'declined').length;

    const dueThisWeek = immunizations.filter((imm) => {
      const dueDate = new Date(imm.dueDate);
      return dueDate <= weekFromNow && ['scheduled', 'overdue'].includes(imm.status);
    }).length;

    const dueThisMonth = immunizations.filter((imm) => {
      const dueDate = new Date(imm.dueDate);
      return dueDate <= monthFromNow && ['scheduled', 'overdue'].includes(imm.status);
    }).length;

    const complianceRate =
      uniqueStudents.size > 0
        ? (upToDate / uniqueStudents.size) * 100
        : 0;

    return {
      totalStudents: uniqueStudents.size,
      upToDate,
      overdue,
      scheduled,
      declined,
      complianceRate,
      dueThisWeek,
      dueThisMonth,
    };
  }, [immunizations]);
};
