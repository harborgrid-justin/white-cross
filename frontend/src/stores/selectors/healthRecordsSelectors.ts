/**
 * Health Records Selectors
 *
 * Memoized selectors for health record data with filtering and grouping.
 * Uses Reselect for performance optimization.
 *
 * @module stores/selectors/healthRecordsSelectors
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../reduxStore';
import { createGroupBySelector, createSortSelector, createDateRangeSelector } from '../utils/selectors';

/**
 * Base selector - select health records state
 */
export const selectHealthRecordsState = (state: RootState) => state.healthRecords;

/**
 * Select all health records array
 */
export const selectAllHealthRecords = createSelector(
  [selectHealthRecordsState],
  (healthRecordsState) => Object.values(healthRecordsState.entities || {}).filter(Boolean)
);

/**
 * Select health records loading state
 */
export const selectHealthRecordsLoading = createSelector(
  [selectHealthRecordsState],
  (healthRecordsState) => healthRecordsState.isLoading || false
);

/**
 * Select health records error
 */
export const selectHealthRecordsError = createSelector(
  [selectHealthRecordsState],
  (healthRecordsState) => healthRecordsState.error
);

/**
 * Select health record by ID
 */
export const selectHealthRecordById = createSelector(
  [selectHealthRecordsState, (_state: RootState, recordId: string) => recordId],
  (healthRecordsState, recordId) => healthRecordsState.entities?.[recordId] || null
);

/**
 * Select health records by student ID
 */
export const selectHealthRecordsByStudent = createSelector(
  [selectAllHealthRecords, (_state: RootState, studentId: string) => studentId],
  (healthRecords, studentId) => healthRecords.filter(record => record.studentId === studentId)
);

/**
 * Select health records by type
 */
export const selectHealthRecordsByType = createSelector(
  [selectAllHealthRecords, (_state: RootState, recordType: string) => recordType],
  (healthRecords, recordType) => healthRecords.filter(record => record.type === recordType)
);

/**
 * Select recent health records (last 30 days)
 */
export const selectRecentHealthRecords = createSelector(
  [selectAllHealthRecords],
  (healthRecords) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return healthRecords.filter(record =>
      record.createdAt && new Date(record.createdAt) >= thirtyDaysAgo
    );
  }
);

/**
 * Select health records by date range
 */
export const selectHealthRecordsByDateRange = createSelector(
  [
    selectAllHealthRecords,
    (_state: RootState, startDate: Date | null) => startDate,
    (_state: RootState, _startDate: Date | null, endDate: Date | null) => endDate
  ],
  (healthRecords, startDate, endDate) => {
    return healthRecords.filter(record => {
      if (!record.createdAt) return false;
      const recordDate = new Date(record.createdAt);

      if (startDate && recordDate < startDate) return false;
      if (endDate && recordDate > endDate) return false;

      return true;
    });
  }
);

/**
 * Group health records by type
 */
export const selectHealthRecordsGroupedByType = createGroupBySelector(
  selectAllHealthRecords,
  (record) => record.type || 'Unknown'
);

/**
 * Group health records by student
 */
export const selectHealthRecordsGroupedByStudent = createGroupBySelector(
  selectAllHealthRecords,
  (record) => record.studentId
);

/**
 * Sort health records by date (most recent first)
 */
export const selectHealthRecordsSortedByDate = createSortSelector(
  selectAllHealthRecords,
  (a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA; // Descending order
  }
);

/**
 * Select health records requiring follow-up
 */
export const selectHealthRecordsRequiringFollowUp = createSelector(
  [selectAllHealthRecords],
  (healthRecords) => healthRecords.filter(record =>
    record.requiresFollowUp && !record.followUpCompleted
  )
);

/**
 * Select health records with attachments
 */
export const selectHealthRecordsWithAttachments = createSelector(
  [selectAllHealthRecords],
  (healthRecords) => healthRecords.filter(record =>
    record.attachments && record.attachments.length > 0
  )
);

/**
 * Select immunization records
 */
export const selectImmunizationRecords = createSelector(
  [selectAllHealthRecords],
  (healthRecords) => healthRecords.filter(record =>
    record.type === 'immunization' || record.category === 'immunization'
  )
);

/**
 * Select allergy records
 */
export const selectAllergyRecords = createSelector(
  [selectAllHealthRecords],
  (healthRecords) => healthRecords.filter(record =>
    record.type === 'allergy' || record.category === 'allergy'
  )
);

/**
 * Select diagnosis records
 */
export const selectDiagnosisRecords = createSelector(
  [selectAllHealthRecords],
  (healthRecords) => healthRecords.filter(record =>
    record.type === 'diagnosis' || record.category === 'diagnosis'
  )
);

/**
 * Select visit records
 */
export const selectVisitRecords = createSelector(
  [selectAllHealthRecords],
  (healthRecords) => healthRecords.filter(record =>
    record.type === 'visit' || record.category === 'visit'
  )
);

/**
 * Select health record statistics
 */
export const selectHealthRecordStatistics = createSelector(
  [selectAllHealthRecords],
  (healthRecords) => {
    const typeDistribution = healthRecords.reduce((acc, record) => {
      const type = record.type || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recent = healthRecords.filter(r => {
      if (!r.createdAt) return false;
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return new Date(r.createdAt) >= thirtyDaysAgo;
    });

    return {
      total: healthRecords.length,
      recentRecords: recent.length,
      typeDistribution,
      requiresFollowUp: healthRecords.filter(r => r.requiresFollowUp && !r.followUpCompleted).length,
      withAttachments: healthRecords.filter(r => r.attachments?.length > 0).length,
      immunizations: healthRecords.filter(r => r.type === 'immunization').length,
      allergies: healthRecords.filter(r => r.type === 'allergy').length,
    };
  }
);

/**
 * Select student health summary
 */
export const selectStudentHealthSummary = createSelector(
  [selectHealthRecordsByStudent],
  (studentRecords) => {
    const immunizations = studentRecords.filter(r => r.type === 'immunization');
    const allergies = studentRecords.filter(r => r.type === 'allergy');
    const diagnoses = studentRecords.filter(r => r.type === 'diagnosis');
    const visits = studentRecords.filter(r => r.type === 'visit');
    const requiresFollowUp = studentRecords.filter(r => r.requiresFollowUp && !r.followUpCompleted);

    return {
      totalRecords: studentRecords.length,
      immunizations: immunizations.length,
      allergies: allergies.length,
      diagnoses: diagnoses.length,
      visits: visits.length,
      requiresFollowUp: requiresFollowUp.length,
      lastVisit: visits.length > 0
        ? visits.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())[0]
        : null,
      activeAllergies: allergies.filter(a => a.status === 'active'),
      activeDiagnoses: diagnoses.filter(d => d.status === 'active'),
    };
  }
);

/**
 * Complex filter: Health records with multiple conditions
 */
export const selectHealthRecordsFiltered = createSelector(
  [
    selectAllHealthRecords,
    (_state: RootState, filters: {
      studentId?: string;
      type?: string;
      category?: string;
      startDate?: Date | null;
      endDate?: Date | null;
      requiresFollowUp?: boolean;
      hasAttachments?: boolean;
      searchQuery?: string;
    }) => filters
  ],
  (healthRecords, filters) => {
    let filtered = healthRecords;

    if (filters.studentId) {
      filtered = filtered.filter(r => r.studentId === filters.studentId);
    }

    if (filters.type) {
      filtered = filtered.filter(r => r.type === filters.type);
    }

    if (filters.category) {
      filtered = filtered.filter(r => r.category === filters.category);
    }

    if (filters.startDate) {
      filtered = filtered.filter(r =>
        r.createdAt && new Date(r.createdAt) >= filters.startDate!
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(r =>
        r.createdAt && new Date(r.createdAt) <= filters.endDate!
      );
    }

    if (filters.requiresFollowUp) {
      filtered = filtered.filter(r => r.requiresFollowUp && !r.followUpCompleted);
    }

    if (filters.hasAttachments) {
      filtered = filtered.filter(r => r.attachments && r.attachments.length > 0);
    }

    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.notes?.toLowerCase().includes(query) ||
        r.diagnosis?.toLowerCase().includes(query) ||
        r.provider?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }
);
