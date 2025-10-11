/**
 * State Management Type Examples
 *
 * This file demonstrates proper usage of state management types.
 * Use these examples as reference when implementing Redux slices and React contexts.
 *
 * @module types/state.examples
 */

import type {
  RootState,
  IncidentReportsState,
  LoadingState,
  ErrorState,
  EntityState,
  FilterState,
  SelectionState,
  PaginationState,
  FormState,
  RequestStatus,
  AppAsyncThunk,
  AsyncThunkConfig,
} from './state';
import {
  isLoadingState,
  isErrorState,
  hasData,
  isStale,
  createInitialLoadingState,
  createInitialEntityState,
  createInitialPaginationState,
  createInitialSelectionState,
  createInitialFilterState,
} from './state';
import type { IncidentReport, IncidentType, IncidentSeverity } from './incidents';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

// =====================
// EXAMPLE 1: Creating a Redux Slice with State Types
// =====================

/**
 * Example: Incident Reports Redux Slice
 *
 * This example demonstrates how to create a properly typed Redux slice
 * using the state management types.
 */

// Initial state using helper functions
const initialIncidentReportsState: IncidentReportsState = {
  entities: createInitialEntityState<IncidentReport>(),
  loading: createInitialLoadingState<ErrorState>(),
  pagination: createInitialPaginationState(20),
  sort: {
    field: 'occurredAt',
    direction: 'DESC',
  },
  filters: createInitialFilterState<{
    type?: IncidentType;
    severity?: IncidentSeverity;
  }>(),
  selection: createInitialSelectionState<IncidentReport>(),
  currentIncidentId: null,
  searchQuery: '',
  cacheTimestamp: null,
};

// Async thunk with proper typing
const fetchIncidents: AppAsyncThunk<
  { incidents: IncidentReport[]; pagination: PaginationState },
  { page?: number; limit?: number }
> = createAsyncThunk<
  { incidents: IncidentReport[]; pagination: PaginationState },
  { page?: number; limit?: number },
  AsyncThunkConfig
>(
  'incidentReports/fetchIncidents',
  async (params, { getState, rejectWithValue }) => {
    try {
      // Example API call
      const response = await fetch(`/api/incidents?page=${params.page}&limit=${params.limit}`);
      const data = await response.json();

      // Access state with proper typing
      const state = getState();
      const currentFilters = state.incidentReports.filters.filters;

      return {
        incidents: data.incidents,
        pagination: data.pagination,
      };
    } catch (error) {
      // Return typed error
      return rejectWithValue({
        message: 'Failed to fetch incidents',
        code: 'FETCH_ERROR',
        statusCode: 500,
        timestamp: Date.now(),
      });
    }
  }
);

// Slice with proper typing
const incidentReportsSlice = createSlice({
  name: 'incidentReports',
  initialState: initialIncidentReportsState,
  reducers: {
    setFilters: (
      state,
      action: PayloadAction<IncidentReportsState['filters']['filters']>
    ) => {
      state.filters.filters = action.payload;
      state.filters.activeFilters = Object.keys(action.payload) as Array<
        keyof typeof action.payload
      >;
      state.filters.isFiltered = state.filters.activeFilters.length > 0;
    },
    selectIncident: (state, action: PayloadAction<string>) => {
      const incident = state.entities.entities[action.payload];
      if (incident && !state.selection.selectedIds.includes(action.payload)) {
        state.selection.selectedIds.push(action.payload);
        state.selection.selectedItems.push(incident);
        state.selection.count = state.selection.selectedIds.length;
      }
    },
    clearSelection: (state) => {
      state.selection = createInitialSelectionState<IncidentReport>();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncidents.pending, (state) => {
        state.loading.status = 'pending';
        state.loading.isLoading = true;
        state.loading.startedAt = Date.now();
        state.loading.error = null;
      })
      .addCase(fetchIncidents.fulfilled, (state, action) => {
        // Normalize data into entity state
        const { incidents, pagination } = action.payload;

        state.entities.ids = incidents.map((i) => i.id);
        state.entities.entities = incidents.reduce((acc, incident) => {
          acc[incident.id] = incident;
          return acc;
        }, {} as Record<string, IncidentReport>);

        state.pagination = pagination;
        state.loading.status = 'succeeded';
        state.loading.isLoading = false;
        state.loading.lastFetch = Date.now();
        state.loading.completedAt = Date.now();
        state.cacheTimestamp = Date.now();
      })
      .addCase(fetchIncidents.rejected, (state, action) => {
        state.loading.status = 'failed';
        state.loading.isLoading = false;
        state.loading.error = action.payload as ErrorState;
        state.loading.completedAt = Date.now();
      });
  },
});

// =====================
// EXAMPLE 2: Using State Guard Functions
// =====================

/**
 * Example: Component with state guards
 *
 * This demonstrates how to use state guard functions in components.
 */
function IncidentListExample() {
  // Assume we have state from useSelector
  const state: IncidentReportsState = {} as any; // Placeholder

  // Check loading state
  if (isLoadingState(state.loading)) {
    return 'Loading incidents...';
  }

  // Check error state
  if (isErrorState(state.loading)) {
    return `Error: ${state.loading.error.message}${
      state.loading.error.code ? ` (${state.loading.error.code})` : ''
    }`;
  }

  // Check if we have data
  if (!hasData(state.loading)) {
    return 'No data available';
  }

  // Check if data is stale (older than 5 minutes)
  if (isStale(state.loading, 5 * 60 * 1000)) {
    console.log('Data is stale, consider refetching');
  }

  // Render list - return JSX (in actual component)
  // For this example, just return null
  return null;
}

// =====================
// EXAMPLE 3: React Context with State Types
// =====================

/**
 * Example: Filter Context Implementation
 *
 * This demonstrates how to create a typed React Context for filters.
 */

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';

interface IncidentFilters {
  type?: IncidentType;
  severity?: IncidentSeverity;
  dateFrom?: string;
  dateTo?: string;
}

interface IncidentFilterContextType {
  filters: Partial<IncidentFilters>;
  setFilters: (filters: Partial<IncidentFilters>) => void;
  clearFilters: () => void;
  updateFilter: <K extends keyof IncidentFilters>(
    key: K,
    value: IncidentFilters[K] | undefined
  ) => void;
  activeFilterCount: number;
  isFiltered: boolean;
}

const IncidentFilterContext = createContext<IncidentFilterContextType | undefined>(
  undefined
);

export function IncidentFilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState<Partial<IncidentFilters>>({});

  const setFilters = (newFilters: Partial<IncidentFilters>) => {
    setFiltersState(newFilters);
  };

  const clearFilters = () => {
    setFiltersState({});
  };

  const updateFilter = <K extends keyof IncidentFilters>(
    key: K,
    value: IncidentFilters[K] | undefined
  ) => {
    setFiltersState((prev) => {
      if (value === undefined) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: value };
    });
  };

  const activeFilterCount = Object.keys(filters).length;
  const isFiltered = activeFilterCount > 0;

  // In actual implementation, would return JSX
  // For type checking purposes, return null
  return null as any;
}

export function useIncidentFilters() {
  const context = useContext(IncidentFilterContext);
  if (!context) {
    throw new Error('useIncidentFilters must be used within IncidentFilterProvider');
  }
  return context;
}

// =====================
// EXAMPLE 4: Form State Management
// =====================

/**
 * Example: Form with FormState type
 *
 * This demonstrates how to use FormState for form management.
 */

// import { useState } from 'react'; // Already imported above

interface CreateIncidentFormData {
  studentId: string;
  type: IncidentType;
  severity: IncidentSeverity;
  description: string;
  location: string;
  occurredAt: string;
}

function useCreateIncidentForm() {
  const [formState, setFormState] = useState<FormState<CreateIncidentFormData>>({
    data: {
      studentId: '',
      type: 'INJURY' as IncidentType,
      severity: 'LOW' as IncidentSeverity,
      description: '',
      location: '',
      occurredAt: new Date().toISOString(),
    },
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: false,
    isDirty: false,
  });

  const updateField = <K extends keyof CreateIncidentFormData>(
    field: K,
    value: CreateIncidentFormData[K]
  ) => {
    setFormState((prev) => ({
      ...prev,
      data: { ...prev.data, [field]: value },
      touched: { ...prev.touched, [field]: true },
      isDirty: true,
    }));
  };

  const setError = <K extends keyof CreateIncidentFormData>(field: K, error: string) => {
    setFormState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [field]: error },
      isValid: false,
    }));
  };

  const clearError = <K extends keyof CreateIncidentFormData>(field: K) => {
    setFormState((prev) => {
      const { [field]: _, ...restErrors } = prev.errors;
      return {
        ...prev,
        errors: restErrors,
      };
    });
  };

  const validate = (): boolean => {
    const errors: Partial<Record<keyof CreateIncidentFormData, string>> = {};

    if (!formState.data.studentId) {
      errors.studentId = 'Student is required';
    }
    if (!formState.data.description.trim()) {
      errors.description = 'Description is required';
    }
    if (!formState.data.location.trim()) {
      errors.location = 'Location is required';
    }

    setFormState((prev) => ({
      ...prev,
      errors,
      isValid: Object.keys(errors).length === 0,
    }));

    return Object.keys(errors).length === 0;
  };

  const submit = async () => {
    if (!validate()) {
      return;
    }

    setFormState((prev) => ({ ...prev, isSubmitting: true }));

    try {
      // Example API call
      const response = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState.data),
      });

      if (!response.ok) {
        throw new Error('Failed to create incident');
      }

      // Reset form on success
      setFormState({
        data: {
          studentId: '',
          type: 'INJURY' as IncidentType,
          severity: 'LOW' as IncidentSeverity,
          description: '',
          location: '',
          occurredAt: new Date().toISOString(),
        },
        errors: {},
        touched: {},
        isSubmitting: false,
        isValid: false,
        isDirty: false,
      });
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        formError: error instanceof Error ? error.message : 'An error occurred',
      }));
    }
  };

  return {
    formState,
    updateField,
    setError,
    clearError,
    validate,
    submit,
  };
}

// =====================
// EXAMPLE 5: Selector Functions with State Types
// =====================

/**
 * Example: Typed Redux selectors
 *
 * This demonstrates how to create strongly-typed selector functions.
 */

// Simple selectors
export const selectIncidentEntities = (state: RootState) => state.incidentReports.entities;
export const selectIncidentLoading = (state: RootState) => state.incidentReports.loading;
export const selectIncidentPagination = (state: RootState) =>
  state.incidentReports.pagination;
export const selectIncidentFilters = (state: RootState) => state.incidentReports.filters;

// Derived selectors
export const selectAllIncidents = (state: RootState): IncidentReport[] => {
  const { ids, entities } = state.incidentReports.entities;
  return ids.map((id) => entities[id]).filter((incident): incident is IncidentReport => !!incident);
};

export const selectIncidentById = (state: RootState, id: string): IncidentReport | undefined => {
  return state.incidentReports.entities.entities[id];
};

export const selectFilteredIncidents = (state: RootState): IncidentReport[] => {
  const incidents = selectAllIncidents(state);
  const { filters } = state.incidentReports.filters;

  return incidents.filter((incident) => {
    if (filters.type && incident.type !== filters.type) return false;
    if (filters.severity && incident.severity !== filters.severity) return false;
    if (filters.studentId && incident.studentId !== filters.studentId) return false;
    return true;
  });
};

export const selectSelectedIncidents = (state: RootState): IncidentReport[] => {
  return state.incidentReports.selection.selectedItems;
};

export const selectIsIncidentSelected = (state: RootState, id: string): boolean => {
  return state.incidentReports.selection.selectedIds.includes(id);
};

// Complex derived selector with memoization (would typically use reselect)
export const selectIncidentStatistics = (state: RootState) => {
  const incidents = selectAllIncidents(state);

  return {
    total: incidents.length,
    byType: incidents.reduce((acc, incident) => {
      acc[incident.type] = (acc[incident.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    bySeverity: incidents.reduce((acc, incident) => {
      acc[incident.severity] = (acc[incident.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };
};

// =====================
// EXAMPLE 6: Custom Hook with State Types
// =====================

/**
 * Example: Custom hook for incident operations
 *
 * This demonstrates how to create a custom hook that uses state types.
 */

// import { useSelector, useDispatch } from 'react-redux'; // Would be used in actual implementation

export function useIncidents() {
  // In actual implementation, would use real useSelector and useDispatch
  // For type checking, we'll mock the values

  // Select state with proper types (mocked for example)
  const entities = {} as ReturnType<typeof selectIncidentEntities>;
  const loading = createInitialLoadingState<ErrorState>();
  const pagination = createInitialPaginationState();
  const filters = createInitialFilterState();
  const selection = createInitialSelectionState<IncidentReport>();

  // Derived values (mocked for example)
  const incidents: IncidentReport[] = [];
  const filteredIncidents: IncidentReport[] = [];
  const selectedIncidents: IncidentReport[] = [];

  // Check states using guard functions
  const isLoading = isLoadingState(loading);
  const hasError = isErrorState(loading);
  const hasLoadedData = hasData(loading);
  const isDataStale = isStale(loading);

  // Actions
  const fetchIncidents = (params: { page?: number; limit?: number }) => {
    // dispatch(fetchIncidents(params));
  };

  const selectIncident = (id: string) => {
    // dispatch(incidentReportsSlice.actions.selectIncident(id));
  };

  const clearSelection = () => {
    // dispatch(incidentReportsSlice.actions.clearSelection());
  };

  return {
    // State
    incidents,
    filteredIncidents,
    selectedIncidents,
    pagination,
    filters,
    selection,

    // Status flags
    isLoading,
    hasError,
    hasLoadedData,
    isDataStale,
    error: loading.error,

    // Actions
    fetchIncidents,
    selectIncident,
    clearSelection,
  };
}

// =====================
// TYPE-SAFE EVENT HANDLERS
// =====================

/**
 * Example: Type-safe event handlers
 */

interface IncidentActionHandlers {
  onView: (incident: IncidentReport) => void;
  onEdit: (incident: IncidentReport) => void;
  onDelete: (incidentId: string) => void;
  onSelect: (incidentId: string) => void;
}

function createIncidentHandlers(dispatch: any): IncidentActionHandlers {
  return {
    onView: (incident) => {
      console.log('Viewing incident:', incident.id);
    },
    onEdit: (incident) => {
      console.log('Editing incident:', incident.id);
    },
    onDelete: (incidentId) => {
      if (confirm('Are you sure you want to delete this incident?')) {
        console.log('Deleting incident:', incidentId);
      }
    },
    onSelect: (incidentId) => {
      // dispatch(selectIncident(incidentId));
    },
  };
}

// =====================
// CONCLUSION
// =====================

/**
 * Key Takeaways:
 *
 * 1. Always use the state type definitions from state.ts
 * 2. Use helper functions to create initial states
 * 3. Use state guard functions for conditional rendering
 * 4. Create strongly-typed selectors
 * 5. Use AsyncThunkConfig for async thunk typing
 * 6. Create custom hooks that encapsulate state logic
 * 7. Use FormState for complex form management
 * 8. Create typed context providers for shared state
 *
 * These patterns ensure type safety, better IntelliSense support,
 * and catch errors at compile time rather than runtime.
 */

export {};
