/**
 * Incident Reports Redux Slice - Unit Tests
 *
 * Demonstrates testing patterns for the incident reports slice
 * Tests reducers, async thunks, and selectors
 */

import { configureStore } from '@reduxjs/toolkit';
import incidentReportsReducer, {
  // Async Thunks
  fetchIncidentReports,
  fetchIncidentReportById,
  createIncidentReport,
  updateIncidentReport,
  deleteIncidentReport,
  searchIncidentReports,
  // Actions
  setFilters,
  setSearchQuery,
  setSelectedIncidentReport,
  clearSelectedIncident,
  setSortOrder,
  setViewMode,
  clearErrors,
  clearError,
  resetState,
  invalidateCache,
  optimisticUpdateReport,
  // Selectors
  selectIncidentReports,
  selectCurrentIncident,
  selectPagination,
  selectFilters,
  selectSearchQuery,
  selectSortConfig,
  selectViewMode,
  selectIsLoading,
  selectError,
  selectFilteredAndSortedReports,
  selectIncidentsByType,
  selectIncidentsBySeverity,
  selectIncidentsByStatus,
  selectIncidentsRequiringFollowUp,
  selectIncidentsWithUnnotifiedParents,
  selectCriticalIncidents,
  selectReportStatistics,
} from './incidentReportsSlice';
import type {
  IncidentReport,
  IncidentType,
  IncidentSeverity,
  IncidentStatus,
  IncidentReportFilters,
} from '../../types/incidents';

// =====================
// TEST HELPERS
// =====================

/**
 * Create a test store with the incident reports reducer
 */
function createTestStore() {
  return configureStore({
    reducer: {
      incidentReports: incidentReportsReducer,
    },
  });
}

/**
 * Mock incident report factory
 */
function createMockIncidentReport(
  overrides?: Partial<IncidentReport>
): IncidentReport {
  return {
    id: 'incident-1',
    studentId: 'student-1',
    reportedById: 'nurse-1',
    type: IncidentType.INJURY,
    severity: IncidentSeverity.MEDIUM,
    status: IncidentStatus.OPEN,
    description: 'Student fell during recess',
    location: 'Playground',
    occurredAt: '2024-01-15T10:30:00Z',
    reportedAt: '2024-01-15T10:45:00Z',
    actionsTaken: 'Applied ice pack, observed for 30 minutes',
    parentNotified: false,
    followUpRequired: true,
    createdAt: '2024-01-15T10:45:00Z',
    updatedAt: '2024-01-15T10:45:00Z',
    ...overrides,
  };
}

// =====================
// REDUCER TESTS
// =====================

describe('incidentReportsSlice - Reducers', () => {
  describe('setFilters', () => {
    it('should update filters', () => {
      const store = createTestStore();

      store.dispatch(setFilters({
        severity: IncidentSeverity.HIGH,
        type: IncidentType.INJURY,
      }));

      const filters = selectFilters(store.getState());
      expect(filters.severity).toBe(IncidentSeverity.HIGH);
      expect(filters.type).toBe(IncidentType.INJURY);
    });

    it('should invalidate cache when filters change', () => {
      const store = createTestStore();

      store.dispatch(setFilters({ page: 2 }));

      const state = store.getState().incidentReports;
      expect(state.cacheInvalidated).toBe(true);
    });
  });

  describe('setSearchQuery', () => {
    it('should update search query', () => {
      const store = createTestStore();
      const query = 'concussion';

      store.dispatch(setSearchQuery(query));

      const searchQuery = selectSearchQuery(store.getState());
      expect(searchQuery).toBe(query);
    });
  });

  describe('setSelectedIncidentReport', () => {
    it('should set selected incident report', () => {
      const store = createTestStore();
      const report = createMockIncidentReport();

      store.dispatch(setSelectedIncidentReport(report));

      const selected = selectCurrentIncident(store.getState());
      expect(selected).toEqual(report);
    });
  });

  describe('clearSelectedIncident', () => {
    it('should clear selected incident and related data', () => {
      const store = createTestStore();
      const report = createMockIncidentReport();

      store.dispatch(setSelectedIncidentReport(report));
      store.dispatch(clearSelectedIncident());

      const state = store.getState().incidentReports;
      expect(state.selectedReport).toBeNull();
      expect(state.witnessStatements).toEqual([]);
      expect(state.followUpActions).toEqual([]);
      expect(state.errors.detail).toBeNull();
    });
  });

  describe('setSortOrder', () => {
    it('should update sort configuration', () => {
      const store = createTestStore();

      store.dispatch(setSortOrder({
        column: 'severity',
        order: 'asc',
      }));

      const sortConfig = selectSortConfig(store.getState());
      expect(sortConfig.column).toBe('severity');
      expect(sortConfig.order).toBe('asc');
    });
  });

  describe('setViewMode', () => {
    it('should update view mode', () => {
      const store = createTestStore();

      store.dispatch(setViewMode('grid'));

      const viewMode = selectViewMode(store.getState());
      expect(viewMode).toBe('grid');
    });
  });

  describe('clearErrors', () => {
    it('should clear all errors', () => {
      const store = createTestStore();

      // Simulate some errors (in real scenario, these would come from failed thunks)
      store.dispatch(clearErrors());

      const errors = store.getState().incidentReports.errors;
      expect(Object.values(errors).every(e => e === null)).toBe(true);
    });
  });

  describe('clearError', () => {
    it('should clear specific error', () => {
      const store = createTestStore();

      store.dispatch(clearError('list'));

      const listError = selectError('list')(store.getState());
      expect(listError).toBeNull();
    });
  });

  describe('resetState', () => {
    it('should reset state to initial values', () => {
      const store = createTestStore();

      // Add some data
      store.dispatch(setSearchQuery('test'));
      store.dispatch(setFilters({ page: 5 }));

      // Reset
      store.dispatch(resetState());

      const state = store.getState().incidentReports;
      expect(state.searchQuery).toBe('');
      expect(state.filters.page).toBe(1);
      expect(state.reports).toEqual([]);
    });
  });

  describe('invalidateCache', () => {
    it('should invalidate cache', () => {
      const store = createTestStore();

      store.dispatch(invalidateCache());

      const state = store.getState().incidentReports;
      expect(state.cacheInvalidated).toBe(true);
      expect(state.lastFetched).toBeNull();
    });
  });

  describe('optimisticUpdateReport', () => {
    it('should update report in list', () => {
      const store = createTestStore();
      const report = createMockIncidentReport({ id: 'incident-1' });

      // Add report to state
      store.dispatch(
        fetchIncidentReports.fulfilled(
          {
            reports: [report],
            pagination: { page: 1, limit: 20, total: 1, pages: 1 },
          },
          '',
          {} as IncidentReportFilters
        )
      );

      // Optimistic update
      store.dispatch(optimisticUpdateReport({
        id: 'incident-1',
        data: { status: IncidentStatus.RESOLVED },
      }));

      const reports = selectIncidentReports(store.getState());
      expect(reports[0].status).toBe(IncidentStatus.RESOLVED);
    });

    it('should update selected report', () => {
      const store = createTestStore();
      const report = createMockIncidentReport({ id: 'incident-1' });

      store.dispatch(setSelectedIncidentReport(report));
      store.dispatch(optimisticUpdateReport({
        id: 'incident-1',
        data: { severity: IncidentSeverity.CRITICAL },
      }));

      const selected = selectCurrentIncident(store.getState());
      expect(selected?.severity).toBe(IncidentSeverity.CRITICAL);
    });
  });
});

// =====================
// ASYNC THUNK TESTS
// =====================

describe('incidentReportsSlice - Async Thunks', () => {
  describe('fetchIncidentReports', () => {
    it('should handle pending state', () => {
      const store = createTestStore();

      store.dispatch({ type: fetchIncidentReports.pending.type });

      const isLoading = selectIsLoading('list')(store.getState());
      const error = selectError('list')(store.getState());
      expect(isLoading).toBe(true);
      expect(error).toBeNull();
    });

    it('should handle fulfilled state', () => {
      const store = createTestStore();
      const reports = [
        createMockIncidentReport({ id: 'incident-1' }),
        createMockIncidentReport({ id: 'incident-2' }),
      ];
      const pagination = { page: 1, limit: 20, total: 2, pages: 1 };

      store.dispatch(
        fetchIncidentReports.fulfilled(
          { reports, pagination },
          '',
          {} as IncidentReportFilters
        )
      );

      const stateReports = selectIncidentReports(store.getState());
      const statePagination = selectPagination(store.getState());
      const isLoading = selectIsLoading('list')(store.getState());
      const state = store.getState().incidentReports;

      expect(stateReports).toHaveLength(2);
      expect(statePagination.total).toBe(2);
      expect(isLoading).toBe(false);
      expect(state.lastFetched).toBeTruthy();
      expect(state.cacheInvalidated).toBe(false);
    });

    it('should handle rejected state', () => {
      const store = createTestStore();
      const errorMessage = 'Failed to fetch reports';

      store.dispatch(
        fetchIncidentReports.rejected(
          new Error(errorMessage),
          '',
          {} as IncidentReportFilters,
          errorMessage
        )
      );

      const isLoading = selectIsLoading('list')(store.getState());
      const error = selectError('list')(store.getState());
      expect(isLoading).toBe(false);
      expect(error).toBe(errorMessage);
    });
  });

  describe('createIncidentReport', () => {
    it('should handle fulfilled state', () => {
      const store = createTestStore();
      const newReport = createMockIncidentReport({ id: 'incident-new' });

      store.dispatch(
        createIncidentReport.fulfilled(
          { report: newReport },
          '',
          {} as Parameters<typeof createIncidentReport>[0]
        )
      );

      const reports = selectIncidentReports(store.getState());
      const pagination = selectPagination(store.getState());
      const isCreating = selectIsLoading('creating')(store.getState());

      expect(reports).toHaveLength(1);
      expect(reports[0].id).toBe('incident-new');
      expect(pagination.total).toBe(1);
      expect(isCreating).toBe(false);
    });
  });

  describe('updateIncidentReport', () => {
    it('should update report in list', () => {
      const store = createTestStore();
      const report = createMockIncidentReport({ id: 'incident-1' });

      // Add initial report
      store.dispatch(
        fetchIncidentReports.fulfilled(
          {
            reports: [report],
            pagination: { page: 1, limit: 20, total: 1, pages: 1 },
          },
          '',
          {} as IncidentReportFilters
        )
      );

      // Update report
      const updatedReport = { ...report, status: IncidentStatus.RESOLVED };
      store.dispatch(
        updateIncidentReport.fulfilled(
          { report: updatedReport },
          '',
          { id: 'incident-1', data: { status: IncidentStatus.RESOLVED } }
        )
      );

      const reports = selectIncidentReports(store.getState());
      expect(reports[0].status).toBe(IncidentStatus.RESOLVED);
    });
  });

  describe('deleteIncidentReport', () => {
    it('should remove report from list', () => {
      const store = createTestStore();
      const reports = [
        createMockIncidentReport({ id: 'incident-1' }),
        createMockIncidentReport({ id: 'incident-2' }),
      ];

      // Add reports
      store.dispatch(
        fetchIncidentReports.fulfilled(
          {
            reports,
            pagination: { page: 1, limit: 20, total: 2, pages: 1 },
          },
          '',
          {} as IncidentReportFilters
        )
      );

      // Delete one report
      store.dispatch(
        deleteIncidentReport.fulfilled({ success: true }, '', 'incident-1')
      );

      const stateReports = selectIncidentReports(store.getState());
      const pagination = selectPagination(store.getState());
      expect(stateReports).toHaveLength(1);
      expect(stateReports[0].id).toBe('incident-2');
      expect(pagination.total).toBe(1);
    });

    it('should clear selected report if deleted', () => {
      const store = createTestStore();
      const report = createMockIncidentReport({ id: 'incident-1' });

      store.dispatch(setSelectedIncidentReport(report));
      store.dispatch(
        deleteIncidentReport.fulfilled({ success: true }, '', 'incident-1')
      );

      const selected = selectCurrentIncident(store.getState());
      expect(selected).toBeNull();
    });
  });
});

// =====================
// SELECTOR TESTS
// =====================

describe('incidentReportsSlice - Selectors', () => {
  describe('selectFilteredAndSortedReports', () => {
    it('should sort reports by occurredAt descending', () => {
      const store = createTestStore();
      const reports = [
        createMockIncidentReport({ id: '1', occurredAt: '2024-01-15T10:00:00Z' }),
        createMockIncidentReport({ id: '2', occurredAt: '2024-01-16T10:00:00Z' }),
        createMockIncidentReport({ id: '3', occurredAt: '2024-01-14T10:00:00Z' }),
      ];

      store.dispatch(
        fetchIncidentReports.fulfilled(
          {
            reports,
            pagination: { page: 1, limit: 20, total: 3, pages: 1 },
          },
          '',
          {} as IncidentReportFilters
        )
      );

      store.dispatch(setSortOrder({ column: 'occurredAt', order: 'desc' }));

      const sorted = selectFilteredAndSortedReports(store.getState());
      expect(sorted[0].id).toBe('2'); // Most recent
      expect(sorted[1].id).toBe('1');
      expect(sorted[2].id).toBe('3'); // Oldest
    });

    it('should sort reports by severity ascending', () => {
      const store = createTestStore();
      const reports = [
        createMockIncidentReport({ id: '1', severity: IncidentSeverity.CRITICAL }),
        createMockIncidentReport({ id: '2', severity: IncidentSeverity.LOW }),
        createMockIncidentReport({ id: '3', severity: IncidentSeverity.HIGH }),
      ];

      store.dispatch(
        fetchIncidentReports.fulfilled(
          {
            reports,
            pagination: { page: 1, limit: 20, total: 3, pages: 1 },
          },
          '',
          {} as IncidentReportFilters
        )
      );

      store.dispatch(setSortOrder({ column: 'severity', order: 'asc' }));

      const sorted = selectFilteredAndSortedReports(store.getState());
      expect(sorted[0].severity).toBe(IncidentSeverity.LOW);
      expect(sorted[1].severity).toBe(IncidentSeverity.HIGH);
      expect(sorted[2].severity).toBe(IncidentSeverity.CRITICAL);
    });
  });

  describe('selectIncidentsByType', () => {
    it('should filter reports by type', () => {
      const store = createTestStore();
      const reports = [
        createMockIncidentReport({ id: '1', type: IncidentType.INJURY }),
        createMockIncidentReport({ id: '2', type: IncidentType.ILLNESS }),
        createMockIncidentReport({ id: '3', type: IncidentType.INJURY }),
      ];

      store.dispatch(
        fetchIncidentReports.fulfilled(
          {
            reports,
            pagination: { page: 1, limit: 20, total: 3, pages: 1 },
          },
          '',
          {} as IncidentReportFilters
        )
      );

      const injuries = selectIncidentsByType(IncidentType.INJURY)(store.getState());
      expect(injuries).toHaveLength(2);
      expect(injuries.every(r => r.type === IncidentType.INJURY)).toBe(true);
    });
  });

  describe('selectIncidentsBySeverity', () => {
    it('should filter reports by severity', () => {
      const store = createTestStore();
      const reports = [
        createMockIncidentReport({ id: '1', severity: IncidentSeverity.CRITICAL }),
        createMockIncidentReport({ id: '2', severity: IncidentSeverity.LOW }),
        createMockIncidentReport({ id: '3', severity: IncidentSeverity.CRITICAL }),
      ];

      store.dispatch(
        fetchIncidentReports.fulfilled(
          {
            reports,
            pagination: { page: 1, limit: 20, total: 3, pages: 1 },
          },
          '',
          {} as IncidentReportFilters
        )
      );

      const critical = selectIncidentsBySeverity(IncidentSeverity.CRITICAL)(store.getState());
      expect(critical).toHaveLength(2);
      expect(critical.every(r => r.severity === IncidentSeverity.CRITICAL)).toBe(true);
    });
  });

  describe('selectIncidentsRequiringFollowUp', () => {
    it('should filter reports requiring follow-up', () => {
      const store = createTestStore();
      const reports = [
        createMockIncidentReport({ id: '1', followUpRequired: true }),
        createMockIncidentReport({ id: '2', followUpRequired: false }),
        createMockIncidentReport({ id: '3', followUpRequired: true }),
      ];

      store.dispatch(
        fetchIncidentReports.fulfilled(
          {
            reports,
            pagination: { page: 1, limit: 20, total: 3, pages: 1 },
          },
          '',
          {} as IncidentReportFilters
        )
      );

      const needsFollowUp = selectIncidentsRequiringFollowUp(store.getState());
      expect(needsFollowUp).toHaveLength(2);
      expect(needsFollowUp.every(r => r.followUpRequired)).toBe(true);
    });
  });

  describe('selectIncidentsWithUnnotifiedParents', () => {
    it('should filter reports with unnotified parents', () => {
      const store = createTestStore();
      const reports = [
        createMockIncidentReport({ id: '1', parentNotified: false }),
        createMockIncidentReport({ id: '2', parentNotified: true }),
        createMockIncidentReport({ id: '3', parentNotified: false }),
      ];

      store.dispatch(
        fetchIncidentReports.fulfilled(
          {
            reports,
            pagination: { page: 1, limit: 20, total: 3, pages: 1 },
          },
          '',
          {} as IncidentReportFilters
        )
      );

      const unnotified = selectIncidentsWithUnnotifiedParents(store.getState());
      expect(unnotified).toHaveLength(2);
      expect(unnotified.every(r => !r.parentNotified)).toBe(true);
    });
  });

  describe('selectCriticalIncidents', () => {
    it('should filter high and critical severity incidents', () => {
      const store = createTestStore();
      const reports = [
        createMockIncidentReport({ id: '1', severity: IncidentSeverity.CRITICAL }),
        createMockIncidentReport({ id: '2', severity: IncidentSeverity.LOW }),
        createMockIncidentReport({ id: '3', severity: IncidentSeverity.HIGH }),
        createMockIncidentReport({ id: '4', severity: IncidentSeverity.MEDIUM }),
      ];

      store.dispatch(
        fetchIncidentReports.fulfilled(
          {
            reports,
            pagination: { page: 1, limit: 20, total: 4, pages: 1 },
          },
          '',
          {} as IncidentReportFilters
        )
      );

      const critical = selectCriticalIncidents(store.getState());
      expect(critical).toHaveLength(2);
      expect(
        critical.every(
          r => r.severity === IncidentSeverity.HIGH || r.severity === IncidentSeverity.CRITICAL
        )
      ).toBe(true);
    });
  });

  describe('selectReportStatistics', () => {
    it('should calculate statistics correctly', () => {
      const store = createTestStore();
      const reports = [
        createMockIncidentReport({
          id: '1',
          type: IncidentType.INJURY,
          severity: IncidentSeverity.CRITICAL,
          parentNotified: true,
          followUpRequired: true,
        }),
        createMockIncidentReport({
          id: '2',
          type: IncidentType.ILLNESS,
          severity: IncidentSeverity.LOW,
          parentNotified: false,
          followUpRequired: false,
        }),
        createMockIncidentReport({
          id: '3',
          type: IncidentType.INJURY,
          severity: IncidentSeverity.HIGH,
          parentNotified: true,
          followUpRequired: true,
        }),
      ];

      store.dispatch(
        fetchIncidentReports.fulfilled(
          {
            reports,
            pagination: { page: 1, limit: 20, total: 3, pages: 1 },
          },
          '',
          {} as IncidentReportFilters
        )
      );

      const stats = selectReportStatistics(store.getState());

      expect(stats.total).toBe(3);
      expect(stats.byType[IncidentType.INJURY]).toBe(2);
      expect(stats.byType[IncidentType.ILLNESS]).toBe(1);
      expect(stats.bySeverity[IncidentSeverity.CRITICAL]).toBe(1);
      expect(stats.bySeverity[IncidentSeverity.HIGH]).toBe(1);
      expect(stats.bySeverity[IncidentSeverity.LOW]).toBe(1);
      expect(stats.parentNotificationRate).toBeCloseTo(66.67, 1);
      expect(stats.followUpRate).toBeCloseTo(66.67, 1);
    });
  });
});
