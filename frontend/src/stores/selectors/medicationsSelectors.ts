/**
 * Medications Selectors
 *
 * Memoized selectors for medication data with safety checks and scheduling logic.
 * Uses Reselect for performance optimization.
 *
 * @module stores/selectors/medicationsSelectors
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../reduxStore';
import { createFilterSelector, createGroupBySelector, createSortSelector } from '../utils/selectors';

/**
 * Base selector - select medications state
 */
export const selectMedicationsState = (state: RootState) => state.medications;

/**
 * Select all medications array
 */
export const selectAllMedications = createSelector(
  [selectMedicationsState],
  (medicationsState) => Object.values(medicationsState.entities || {}).filter(Boolean)
);

/**
 * Select medications loading state
 */
export const selectMedicationsLoading = createSelector(
  [selectMedicationsState],
  (medicationsState) => medicationsState.isLoading || false
);

/**
 * Select medications error
 */
export const selectMedicationsError = createSelector(
  [selectMedicationsState],
  (medicationsState) => medicationsState.error
);

/**
 * Select medication by ID
 */
export const selectMedicationById = createSelector(
  [selectMedicationsState, (_state: RootState, medicationId: string) => medicationId],
  (medicationsState, medicationId) => medicationsState.entities?.[medicationId] || null
);

/**
 * Select active medications only
 */
export const selectActiveMedications = createSelector(
  [selectAllMedications],
  (medications) => medications.filter(med =>
    med.status === 'active' && !med.discontinued && !med.isPaused
  )
);

/**
 * Select medications by student ID
 */
export const selectMedicationsByStudent = createSelector(
  [selectAllMedications, (_state: RootState, studentId: string) => studentId],
  (medications, studentId) => medications.filter(med => med.studentId === studentId)
);

/**
 * Select active medications for a student
 */
export const selectActiveMedicationsByStudent = createSelector(
  [selectActiveMedications, (_state: RootState, studentId: string) => studentId],
  (activeMedications, studentId) => activeMedications.filter(med => med.studentId === studentId)
);

/**
 * Select medications due today
 */
export const selectMedicationsDueToday = createSelector(
  [selectActiveMedications],
  (medications) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return medications.filter(med => {
      if (!med.scheduledTimes) return false;

      return med.scheduledTimes.some(time => {
        const scheduleDate = new Date(time);
        return scheduleDate >= today && scheduleDate < tomorrow;
      });
    });
  }
);

/**
 * Select medications due now (within next 30 minutes)
 */
export const selectMedicationsDueNow = createSelector(
  [selectActiveMedications],
  (medications) => {
    const now = new Date();
    const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);

    return medications.filter(med => {
      if (!med.nextDoseTime) return false;
      const nextDose = new Date(med.nextDoseTime);
      return nextDose >= now && nextDose <= thirtyMinutesFromNow;
    });
  }
);

/**
 * Select overdue medications
 */
export const selectOverdueMedications = createSelector(
  [selectActiveMedications],
  (medications) => {
    const now = new Date();

    return medications.filter(med => {
      if (!med.nextDoseTime) return false;
      const nextDose = new Date(med.nextDoseTime);
      return nextDose < now && !med.lastAdministeredAt;
    });
  }
);

/**
 * Select PRN (as needed) medications
 */
export const selectPRNMedications = createSelector(
  [selectActiveMedications],
  (medications) => medications.filter(med => med.frequency === 'PRN' || med.asNeeded)
);

/**
 * Select scheduled medications
 */
export const selectScheduledMedications = createSelector(
  [selectActiveMedications],
  (medications) => medications.filter(med => med.frequency !== 'PRN' && !med.asNeeded)
);

/**
 * Group medications by student
 */
export const selectMedicationsGroupedByStudent = createGroupBySelector(
  selectAllMedications,
  (medication) => medication.studentId
);

/**
 * Group medications by frequency
 */
export const selectMedicationsGroupedByFrequency = createGroupBySelector(
  selectActiveMedications,
  (medication) => medication.frequency || 'Unknown'
);

/**
 * Sort medications by next dose time
 */
export const selectMedicationsSortedByNextDose = createSortSelector(
  selectActiveMedications,
  (a, b) => {
    if (!a.nextDoseTime) return 1;
    if (!b.nextDoseTime) return -1;
    return new Date(a.nextDoseTime).getTime() - new Date(b.nextDoseTime).getTime();
  }
);

/**
 * Select medications requiring pharmacy refill
 */
export const selectMedicationsRequiringRefill = createSelector(
  [selectActiveMedications],
  (medications) => medications.filter(med =>
    med.quantityRemaining !== undefined &&
    med.quantityRemaining <= (med.refillThreshold || 5)
  )
);

/**
 * Select medications with potential interactions
 */
export const selectMedicationsWithInteractions = createSelector(
  [selectAllMedications, (_state: RootState, studentId: string) => studentId],
  (medications, studentId) => {
    const studentMeds = medications.filter(med => med.studentId === studentId && med.status === 'active');

    return studentMeds.filter(med =>
      med.interactions && med.interactions.length > 0
    );
  }
);

/**
 * Select medications with contraindications
 */
export const selectMedicationsWithContraindications = createSelector(
  [selectAllMedications, (_state: RootState, studentId: string) => studentId],
  (medications, studentId) => {
    const studentMeds = medications.filter(med => med.studentId === studentId && med.status === 'active');

    return studentMeds.filter(med =>
      med.contraindications && med.contraindications.length > 0
    );
  }
);

/**
 * Select medication statistics
 */
export const selectMedicationStatistics = createSelector(
  [selectAllMedications],
  (medications) => {
    const active = medications.filter(m => m.status === 'active');
    const due = active.filter(m => {
      if (!m.nextDoseTime) return false;
      const next = new Date(m.nextDoseTime);
      const now = new Date();
      const thirtyMins = new Date(now.getTime() + 30 * 60 * 1000);
      return next >= now && next <= thirtyMins;
    });

    const overdue = active.filter(m => {
      if (!m.nextDoseTime) return false;
      return new Date(m.nextDoseTime) < new Date() && !m.lastAdministeredAt;
    });

    const needRefill = active.filter(m =>
      m.quantityRemaining !== undefined && m.quantityRemaining <= (m.refillThreshold || 5)
    );

    return {
      total: medications.length,
      active: active.length,
      dueNow: due.length,
      overdue: overdue.length,
      needRefill: needRefill.length,
      prn: active.filter(m => m.frequency === 'PRN').length,
      scheduled: active.filter(m => m.frequency !== 'PRN').length,
    };
  }
);

/**
 * Select medication administration history for a student
 */
export const selectMedicationHistoryByStudent = createSelector(
  [selectMedicationsByStudent],
  (medications) => {
    return medications
      .filter(med => med.administrationHistory && med.administrationHistory.length > 0)
      .flatMap(med =>
        med.administrationHistory?.map(history => ({
          ...history,
          medicationId: med.id,
          medicationName: med.name,
        })) || []
      )
      .sort((a, b) => new Date(b.administeredAt).getTime() - new Date(a.administeredAt).getTime());
  }
);

/**
 * Select medications with alerts or warnings
 */
export const selectMedicationsWithAlerts = createSelector(
  [selectActiveMedications],
  (medications) => medications.filter(med =>
    med.alerts && med.alerts.length > 0 ||
    med.warnings && med.warnings.length > 0
  )
);

/**
 * Complex filter: Medications with multiple conditions
 */
export const selectMedicationsFiltered = createSelector(
  [
    selectAllMedications,
    (_state: RootState, filters: {
      studentId?: string;
      status?: 'active' | 'inactive' | 'discontinued';
      frequency?: string;
      dueToday?: boolean;
      overdue?: boolean;
      needsRefill?: boolean;
      searchQuery?: string;
    }) => filters
  ],
  (medications, filters) => {
    let filtered = medications;

    if (filters.studentId) {
      filtered = filtered.filter(m => m.studentId === filters.studentId);
    }

    if (filters.status) {
      filtered = filtered.filter(m => m.status === filters.status);
    }

    if (filters.frequency) {
      filtered = filtered.filter(m => m.frequency === filters.frequency);
    }

    if (filters.dueToday) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      filtered = filtered.filter(m => {
        if (!m.scheduledTimes) return false;
        return m.scheduledTimes.some(time => {
          const scheduleDate = new Date(time);
          return scheduleDate >= today && scheduleDate < tomorrow;
        });
      });
    }

    if (filters.overdue) {
      const now = new Date();
      filtered = filtered.filter(m => {
        if (!m.nextDoseTime) return false;
        return new Date(m.nextDoseTime) < now && !m.lastAdministeredAt;
      });
    }

    if (filters.needsRefill) {
      filtered = filtered.filter(m =>
        m.quantityRemaining !== undefined &&
        m.quantityRemaining <= (m.refillThreshold || 5)
      );
    }

    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(m =>
        m.name?.toLowerCase().includes(query) ||
        m.genericName?.toLowerCase().includes(query) ||
        m.brandName?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }
);
