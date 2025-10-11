/**
 * Incident Reports Redux Slice - Usage Examples
 *
 * This file demonstrates how to use the incidentReportsSlice in your React components
 * and provides common patterns for incident report management.
 *
 * @example Component Usage Examples
 */

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import {
  // Async Thunks
  fetchIncidentReports,
  fetchIncidentReportById,
  createIncidentReport,
  updateIncidentReport,
  deleteIncidentReport,
  searchIncidentReports,
  fetchWitnessStatements,
  fetchFollowUpActions,
  createWitnessStatement,
  createFollowUpAction,
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
  selectWitnessStatements,
  selectFollowUpActions,
  selectSearchResults,
  selectPagination,
  selectFilters,
  selectSearchQuery,
  selectSortConfig,
  selectViewMode,
  selectLoadingStates,
  selectIsLoading,
  selectErrorStates,
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
  IncidentType,
  IncidentSeverity,
  IncidentStatus,
  CreateIncidentReportRequest,
  UpdateIncidentReportRequest,
} from '../../types/incidents';

// =====================================================
// EXAMPLE 1: Fetching and Displaying Incident Reports
// =====================================================

function IncidentReportsList() {
  const dispatch = useAppDispatch();

  // Select data from state
  const reports = useAppSelector(selectIncidentReports);
  const pagination = useAppSelector(selectPagination);
  const filters = useAppSelector(selectFilters);
  const isLoading = useAppSelector(selectIsLoading('list'));
  const error = useAppSelector(selectError('list'));

  // Fetch reports on mount
  useEffect(() => {
    dispatch(fetchIncidentReports(filters));
  }, [dispatch, filters]);

  // Handle pagination
  const handlePageChange = (page: number) => {
    dispatch(setFilters({ page }));
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: any) => {
    dispatch(setFilters(newFilters));
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Incident Reports ({pagination.total})</h1>
      {reports.map((report) => (
        <div key={report.id}>
          <h3>{report.type}</h3>
          <p>{report.description}</p>
        </div>
      ))}
    </div>
  );
}

// =====================================================
// EXAMPLE 2: Advanced Filtering and Sorting
// =====================================================

function FilteredIncidentReports() {
  const dispatch = useAppDispatch();

  // Use filtered and sorted selector
  const sortedReports = useAppSelector(selectFilteredAndSortedReports);
  const sortConfig = useAppSelector(selectSortConfig);

  // Filter by severity
  const handleSeverityFilter = (severity: IncidentSeverity) => {
    dispatch(setFilters({ severity }));
  };

  // Filter by date range
  const handleDateRangeFilter = (dateFrom: string, dateTo: string) => {
    dispatch(setFilters({ dateFrom, dateTo }));
  };

  // Filter by student
  const handleStudentFilter = (studentId: string) => {
    dispatch(setFilters({ studentId }));
  };

  // Change sort order
  const handleSort = (column: 'occurredAt' | 'severity' | 'type') => {
    const newOrder = sortConfig.column === column && sortConfig.order === 'asc' ? 'desc' : 'asc';
    dispatch(setSortOrder({ column, order: newOrder }));
  };

  return (
    <div>
      <div>
        <button onClick={() => handleSeverityFilter(IncidentSeverity.CRITICAL)}>
          Critical Only
        </button>
        <button onClick={() => handleSort('occurredAt')}>
          Sort by Date {sortConfig.column === 'occurredAt' && sortConfig.order === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      {sortedReports.map((report) => (
        <div key={report.id}>{/* Render report */}</div>
      ))}
    </div>
  );
}

// =====================================================
// EXAMPLE 3: Creating New Incident Report
// =====================================================

function CreateIncidentReportForm() {
  const dispatch = useAppDispatch();
  const isCreating = useAppSelector(selectIsLoading('creating'));
  const createError = useAppSelector(selectError('create'));

  const handleSubmit = async (formData: any) => {
    const newReport: CreateIncidentReportRequest = {
      studentId: formData.studentId,
      reportedById: formData.reportedById,
      type: formData.type,
      severity: formData.severity,
      description: formData.description,
      location: formData.location,
      actionsTaken: formData.actionsTaken,
      occurredAt: formData.occurredAt,
      witnesses: formData.witnesses,
      parentNotified: formData.parentNotified,
      followUpRequired: formData.followUpRequired,
    };

    const result = await dispatch(createIncidentReport(newReport));

    if (createIncidentReport.fulfilled.match(result)) {
      // Success - report created
      console.log('Report created:', result.payload);
      // Navigate to detail view or show success message
    } else {
      // Error - handle failure
      console.error('Failed to create report:', result.payload);
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); /* handle submit */ }}>
      {/* Form fields */}
      <button type="submit" disabled={isCreating}>
        {isCreating ? 'Creating...' : 'Create Report'}
      </button>
      {createError && <div className="error">{createError}</div>}
    </form>
  );
}

// =====================================================
// EXAMPLE 4: Incident Detail View with Witnesses and Actions
// =====================================================

function IncidentReportDetail({ reportId }: { reportId: string }) {
  const dispatch = useAppDispatch();

  // Select data
  const incident = useAppSelector(selectCurrentIncident);
  const witnesses = useAppSelector(selectWitnessStatements);
  const actions = useAppSelector(selectFollowUpActions);
  const isLoadingDetail = useAppSelector(selectIsLoading('detail'));
  const isLoadingWitnesses = useAppSelector(selectIsLoading('witnesses'));
  const isLoadingActions = useAppSelector(selectIsLoading('actions'));

  // Fetch incident and related data
  useEffect(() => {
    dispatch(fetchIncidentReportById(reportId));
    dispatch(fetchWitnessStatements(reportId));
    dispatch(fetchFollowUpActions(reportId));

    // Cleanup on unmount
    return () => {
      dispatch(clearSelectedIncident());
    };
  }, [dispatch, reportId]);

  if (isLoadingDetail) return <div>Loading incident...</div>;
  if (!incident) return <div>Incident not found</div>;

  return (
    <div>
      <h1>Incident Report</h1>
      <div>
        <h2>Type: {incident.type}</h2>
        <p>Severity: {incident.severity}</p>
        <p>Description: {incident.description}</p>
        <p>Location: {incident.location}</p>
      </div>

      <div>
        <h2>Witness Statements ({witnesses.length})</h2>
        {isLoadingWitnesses ? (
          <div>Loading witnesses...</div>
        ) : (
          witnesses.map((witness) => (
            <div key={witness.id}>
              <p><strong>{witness.witnessName}</strong> ({witness.witnessType})</p>
              <p>{witness.statement}</p>
            </div>
          ))
        )}
      </div>

      <div>
        <h2>Follow-up Actions ({actions.length})</h2>
        {isLoadingActions ? (
          <div>Loading actions...</div>
        ) : (
          actions.map((action) => (
            <div key={action.id}>
              <p><strong>{action.action}</strong></p>
              <p>Priority: {action.priority}</p>
              <p>Status: {action.status}</p>
              <p>Due: {action.dueDate}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// =====================================================
// EXAMPLE 5: Optimistic Updates
// =====================================================

function QuickIncidentUpdate({ incidentId }: { incidentId: string }) {
  const dispatch = useAppDispatch();

  const handleQuickStatusUpdate = async (newStatus: IncidentStatus) => {
    // Optimistically update UI
    dispatch(optimisticUpdateReport({
      id: incidentId,
      data: { status: newStatus }
    }));

    // Send update to server
    const result = await dispatch(updateIncidentReport({
      id: incidentId,
      data: { status: newStatus }
    }));

    // If failed, the reducer will revert to server state
    if (updateIncidentReport.rejected.match(result)) {
      // Could show error message or revert UI manually
      console.error('Update failed');
    }
  };

  return (
    <div>
      <button onClick={() => handleQuickStatusUpdate(IncidentStatus.INVESTIGATING)}>
        Mark as Investigating
      </button>
      <button onClick={() => handleQuickStatusUpdate(IncidentStatus.RESOLVED)}>
        Mark as Resolved
      </button>
      <button onClick={() => handleQuickStatusUpdate(IncidentStatus.CLOSED)}>
        Close Incident
      </button>
    </div>
  );
}

// =====================================================
// EXAMPLE 6: Search Functionality
// =====================================================

function IncidentSearch() {
  const dispatch = useAppDispatch();

  const searchQuery = useAppSelector(selectSearchQuery);
  const searchResults = useAppSelector(selectSearchResults);
  const isSearching = useAppSelector(selectIsLoading('searching'));

  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query));

    if (query.length >= 3) {
      dispatch(searchIncidentReports({ query, page: 1, limit: 20 }));
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search incidents..."
      />

      {isSearching && <div>Searching...</div>}

      <div>
        {searchResults.map((report) => (
          <div key={report.id}>
            <h3>{report.type}</h3>
            <p>{report.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// =====================================================
// EXAMPLE 7: Dashboard with Statistics
// =====================================================

function IncidentDashboard() {
  const dispatch = useAppDispatch();

  // Use specialized selectors
  const criticalIncidents = useAppSelector(selectCriticalIncidents);
  const incidentsNeedingFollowUp = useAppSelector(selectIncidentsRequiringFollowUp);
  const unnotifiedParents = useAppSelector(selectIncidentsWithUnnotifiedParents);
  const statistics = useAppSelector(selectReportStatistics);

  useEffect(() => {
    dispatch(fetchIncidentReports({ limit: 100 }));
  }, [dispatch]);

  return (
    <div>
      <h1>Incident Dashboard</h1>

      <div className="stats">
        <div>
          <h3>Total Incidents</h3>
          <p>{statistics.total}</p>
        </div>
        <div>
          <h3>Critical Incidents</h3>
          <p>{criticalIncidents.length}</p>
        </div>
        <div>
          <h3>Pending Follow-ups</h3>
          <p>{incidentsNeedingFollowUp.length}</p>
        </div>
        <div>
          <h3>Parents Not Notified</h3>
          <p>{unnotifiedParents.length}</p>
        </div>
      </div>

      <div className="charts">
        <div>
          <h3>By Type</h3>
          {Object.entries(statistics.byType).map(([type, count]) => (
            <div key={type}>
              {type}: {count}
            </div>
          ))}
        </div>
        <div>
          <h3>By Severity</h3>
          {Object.entries(statistics.bySeverity).map(([severity, count]) => (
            <div key={severity}>
              {severity}: {count}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =====================================================
// EXAMPLE 8: Adding Witness Statements
// =====================================================

function AddWitnessStatementForm({ incidentId }: { incidentId: string }) {
  const dispatch = useAppDispatch();

  const handleAddWitness = async (formData: any) => {
    const result = await dispatch(createWitnessStatement({
      incidentReportId: incidentId,
      witnessName: formData.witnessName,
      witnessType: formData.witnessType,
      witnessContact: formData.witnessContact,
      statement: formData.statement,
    }));

    if (createWitnessStatement.fulfilled.match(result)) {
      console.log('Witness statement added:', result.payload);
      // Form will automatically update via Redux state
    }
  };

  return (
    <form>
      {/* Form fields */}
      <button type="submit">Add Witness Statement</button>
    </form>
  );
}

// =====================================================
// EXAMPLE 9: View Mode Switching
// =====================================================

function IncidentViewControls() {
  const dispatch = useAppDispatch();
  const viewMode = useAppSelector(selectViewMode);

  return (
    <div className="view-controls">
      <button
        className={viewMode === 'list' ? 'active' : ''}
        onClick={() => dispatch(setViewMode('list'))}
      >
        List View
      </button>
      <button
        className={viewMode === 'grid' ? 'active' : ''}
        onClick={() => dispatch(setViewMode('grid'))}
      >
        Grid View
      </button>
      <button
        className={viewMode === 'detail' ? 'active' : ''}
        onClick={() => dispatch(setViewMode('detail'))}
      >
        Detail View
      </button>
    </div>
  );
}

// =====================================================
// EXAMPLE 10: Error Handling
// =====================================================

function ErrorHandlingExample() {
  const dispatch = useAppDispatch();
  const errors = useAppSelector(selectErrorStates);

  // Clear all errors
  const handleClearAllErrors = () => {
    dispatch(clearErrors());
  };

  // Clear specific error
  const handleClearError = (errorKey: keyof typeof errors) => {
    dispatch(clearError(errorKey));
  };

  return (
    <div>
      {errors.list && (
        <div className="error">
          {errors.list}
          <button onClick={() => handleClearError('list')}>Dismiss</button>
        </div>
      )}

      {errors.create && (
        <div className="error">
          {errors.create}
          <button onClick={() => handleClearError('create')}>Dismiss</button>
        </div>
      )}

      {Object.values(errors).some(e => e) && (
        <button onClick={handleClearAllErrors}>Clear All Errors</button>
      )}
    </div>
  );
}

// =====================================================
// EXAMPLE 11: Cleanup on Unmount
// =====================================================

function CleanupExample() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Fetch data on mount
    dispatch(fetchIncidentReports());

    // Cleanup on unmount
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  return <div>Component content</div>;
}

// =====================================================
// EXAMPLE 12: Cache Invalidation
// =====================================================

function CacheInvalidationExample() {
  const dispatch = useAppDispatch();

  // Force refresh data
  const handleRefresh = () => {
    dispatch(invalidateCache());
    dispatch(fetchIncidentReports());
  };

  return (
    <div>
      <button onClick={handleRefresh}>Refresh Data</button>
    </div>
  );
}

// =====================================================
// BEST PRACTICES
// =====================================================

/**
 * BEST PRACTICES FOR USING THE INCIDENT REPORTS SLICE:
 *
 * 1. ALWAYS use selectors to access state
 *    ✅ const reports = useAppSelector(selectIncidentReports);
 *    ❌ const reports = useAppSelector(state => state.incidentReports.reports);
 *
 * 2. Use typed hooks from reduxHooks.ts
 *    ✅ const dispatch = useAppDispatch();
 *    ❌ const dispatch = useDispatch();
 *
 * 3. Handle async thunks properly with .unwrap()
 *    const result = await dispatch(createIncidentReport(data)).unwrap();
 *
 * 4. Clean up on unmount for detail views
 *    useEffect(() => {
 *      return () => dispatch(clearSelectedIncident());
 *    }, []);
 *
 * 5. Use optimistic updates for better UX
 *    dispatch(optimisticUpdateReport({ id, data }));
 *    dispatch(updateIncidentReport({ id, data }));
 *
 * 6. Leverage specialized selectors
 *    const criticalIncidents = useAppSelector(selectCriticalIncidents);
 *
 * 7. Handle errors gracefully
 *    const error = useAppSelector(selectError('create'));
 *    if (error) { /* show error message */ }
 *
 * 8. Use loading states for better UX
 *    const isLoading = useAppSelector(selectIsLoading('list'));
 *    if (isLoading) return <Spinner />;
 *
 * 9. Invalidate cache when needed
 *    dispatch(invalidateCache());
 *
 * 10. Follow HIPAA compliance
 *     - Never log PHI in production
 *     - Use debug logger (automatically disabled in production)
 *     - Implement proper access controls
 *     - Audit all data access
 */

export {
  IncidentReportsList,
  FilteredIncidentReports,
  CreateIncidentReportForm,
  IncidentReportDetail,
  QuickIncidentUpdate,
  IncidentSearch,
  IncidentDashboard,
  AddWitnessStatementForm,
  IncidentViewControls,
  ErrorHandlingExample,
  CleanupExample,
  CacheInvalidationExample,
};
