# Page Refactoring Guide

## Overview
This guide provides a standardized approach for refactoring large TSX page files into modular, maintainable components following enterprise React patterns.

## Completed Refactoring
- IncidentReports.tsx ✅

## Remaining Files to Refactor
1. IncidentReportDetail.tsx (1506 lines)
2. HealthRecords.tsx
3. EmergencyContacts.tsx (755 lines)
4. Students.tsx
5. StudentHealthRecordsPage.tsx
6. Inventory.tsx
7. Medications.tsx

## Refactoring Pattern (Based on IncidentReports.tsx)

### Directory Structure
For each page, create the following structure:

```
frontend/src/pages/[PageName]/
├── index.tsx                       # Main orchestrator (imports/exports)
├── index.main.tsx                  # Page component logic
├── types.ts                        # Page-specific TypeScript interfaces
├── components/                     # UI components
│   ├── [PageName]Header.tsx
│   ├── [PageName]Filters.tsx
│   ├── [PageName]Statistics.tsx    # If applicable
│   ├── [PageName]Table.tsx        # Or [PageName]List.tsx
│   ├── [PageName]EmptyState.tsx
│   ├── [PageName]ErrorState.tsx
│   └── [PageName]LoadingState.tsx
└── hooks/                          # Custom hooks
    ├── use[PageName]Data.ts
    └── use[PageName]Filters.ts     # If applicable
```

### Step-by-Step Refactoring Process

#### 1. Create Directory Structure
```bash
mkdir -p "C:\temp\white-cross\frontend\src\pages\[PageName]\components"
mkdir -p "C:\temp\white-cross\frontend\src\pages\[PageName]\hooks"
```

#### 2. Extract Types (types.ts)
Move page-specific interfaces and type definitions to a separate file.

**Example:**
```typescript
/**
 * [PageName] Page Type Definitions
 */

export interface [PageName]FiltersForm {
  search: string;
  // ... other filter fields
}

export type [PageName]SortColumn = 'field1' | 'field2' | 'field3';
```

#### 3. Create Data Hook (hooks/use[PageName]Data.ts)
Extract data fetching logic and Redux/API interactions.

**Template:**
```typescript
/**
 * use[PageName]Data Hook
 * Manages data fetching and state for [PageName]
 */

import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../stores/hooks/reduxHooks';
// Import necessary actions and selectors

interface Use[PageName]DataParams {
  localFilters: [PageName]FiltersForm;
  page: number;
  pageSize: number;
  isRestored: boolean;
}

export function use[PageName]Data({
  localFilters,
  page,
  pageSize,
  isRestored,
}: Use[PageName]DataParams) {
  const dispatch = useAppDispatch();

  // Redux selectors
  const data = useAppSelector(selectData);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  /**
   * Fetch data with current filters
   */
  const loadData = useCallback(() => {
    // Build API filters and dispatch actions
  }, [dispatch, page, pageSize, localFilters]);

  /**
   * Initial load and reload on changes
   */
  useEffect(() => {
    if (!isRestored) return;
    loadData();
  }, [isRestored, page, pageSize, localFilters, loadData]);

  return {
    data,
    isLoading,
    error,
    loadData,
  };
}
```

#### 4. Create Filters Hook (hooks/use[PageName]Filters.ts)
Extract filter state management logic.

**Template:**
```typescript
/**
 * use[PageName]Filters Hook
 * Manages filter state and logic
 */

import { useMemo, useCallback, useState } from 'react';
import { usePersistedFilters } from '../../../hooks/useRouteState';
import type { [PageName]FiltersForm } from '../types';

interface Use[PageName]FiltersParams {
  onFilterChange?: () => void;
}

export function use[PageName]Filters({
  onFilterChange,
}: Use[PageName]FiltersParams = {}) {
  const {
    filters: localFilters,
    updateFilter,
    clearFilters: clearLocalFilters,
    isRestored,
  } = usePersistedFilters<[PageName]FiltersForm>({
    storageKey: '[page-name]-filters',
    defaultFilters: {
      search: '',
      // ... other default values
    },
    debounceMs: 500,
    syncWithUrl: true,
  });

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    // Logic to check active filters
    return false;
  }, [localFilters]);

  const handleFilterChange = useCallback((
    field: keyof [PageName]FiltersForm,
    value: string
  ) => {
    updateFilter(field, value);
    onFilterChange?.();
  }, [updateFilter, onFilterChange]);

  const handleClearFilters = useCallback(() => {
    clearLocalFilters();
    onFilterChange?.();
  }, [clearLocalFilters, onFilterChange]);

  return {
    localFilters,
    hasActiveFilters,
    isRestored,
    handleFilterChange,
    handleClearFilters,
  };
}
```

#### 5. Create Component Files

##### Header Component (components/[PageName]Header.tsx)
```typescript
/**
 * [PageName] Header Component
 * Displays the page header with title and action buttons
 */

import React from 'react';
import { Plus, RefreshCw } from 'lucide-react';

interface [PageName]HeaderProps {
  totalItems: number;
  isLoading: boolean;
  onRefresh: () => void;
  onCreateNew: () => void;
}

export default function [PageName]Header({
  totalItems,
  isLoading,
  onRefresh,
  onCreateNew,
}: [PageName]HeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">[Page Title]</h1>
        <p className="text-gray-600">
          {totalItems} total item{totalItems !== 1 ? 's' : ''}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          className="btn-secondary flex items-center"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
        <button
          onClick={onCreateNew}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New
        </button>
      </div>
    </div>
  );
}
```

##### Empty State Component (components/[PageName]EmptyState.tsx)
```typescript
/**
 * [PageName] Empty State Component
 * Displays empty state when no data exists
 */

import React from 'react';
import { Icon, Plus, Search } from 'lucide-react';

interface [PageName]EmptyStateProps {
  hasActiveFilters: boolean;
  onCreateNew: () => void;
  onClearFilters: () => void;
}

export default function [PageName]EmptyState({
  hasActiveFilters,
  onCreateNew,
  onClearFilters,
}: [PageName]EmptyStateProps) {
  if (hasActiveFilters) {
    return (
      <div className="card p-12 text-center">
        <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Results Found
        </h3>
        <p className="text-gray-600 mb-4">
          Try adjusting your filters or search query
        </p>
        <button onClick={onClearFilters} className="btn-secondary">
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <div className="card p-12 text-center">
      <Icon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No Items Yet
      </h3>
      <p className="text-gray-600 mb-6">
        Get started by creating your first item
      </p>
      <button
        onClick={onCreateNew}
        className="btn-primary inline-flex items-center"
      >
        <Plus className="h-5 w-5 mr-2" />
        Create First Item
      </button>
    </div>
  );
}
```

##### Error State Component (components/[PageName]ErrorState.tsx)
```typescript
/**
 * [PageName] Error State Component
 * Displays error state when data loading fails
 */

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface [PageName]ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export default function [PageName]ErrorState({
  error,
  onRetry,
}: [PageName]ErrorStateProps) {
  return (
    <div className="card p-12 text-center">
      <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Failed to Load Data
      </h3>
      <p className="text-gray-600 mb-4">{error}</p>
      <button onClick={onRetry} className="btn-primary inline-flex items-center">
        <RefreshCw className="h-4 w-4 mr-2" />
        Try Again
      </button>
    </div>
  );
}
```

##### Loading State Component (components/[PageName]LoadingState.tsx)
```typescript
/**
 * [PageName] Loading State Component
 * Displays loading state while fetching data
 */

import React from 'react';
import { RefreshCw } from 'lucide-react';

export default function [PageName]LoadingState() {
  return (
    <div className="card p-12 text-center">
      <RefreshCw className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
      <p className="text-gray-600">Loading data...</p>
    </div>
  );
}
```

#### 6. Create Main Page Component (index.main.tsx)
The main component should only orchestrate other components.

**Template:**
```typescript
/**
 * [PageName] Page - Enterprise Implementation
 *
 * Features:
 * - Redux state management
 * - Advanced filtering with persistence
 * - Pagination and sorting
 * - HIPAA-compliant data handling
 * - Comprehensive error handling
 */

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageState, useSortState } from '../../hooks/useRouteState';
import { use[PageName]Data } from './hooks/use[PageName]Data';
import { use[PageName]Filters } from './hooks/use[PageName]Filters';
import [PageName]Header from './components/[PageName]Header';
import [PageName]Filters from './components/[PageName]Filters';
import [PageName]Table from './components/[PageName]Table';
import [PageName]EmptyState from './components/[PageName]EmptyState';
import [PageName]ErrorState from './components/[PageName]ErrorState';
import [PageName]LoadingState from './components/[PageName]LoadingState';
import type { [PageName]SortColumn } from './types';
import toast from 'react-hot-toast';

export default function [PageName]() {
  const navigate = useNavigate();

  // Pagination state
  const {
    page,
    pageSize,
    setPage,
    setPageSize,
    resetPage,
    pageSizeOptions,
  } = usePageState({
    defaultPage: 1,
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
    resetOnFilterChange: true,
  });

  // Sort state
  const {
    column: sortColumn,
    direction: sortDirection,
    toggleSort,
    getSortIndicator,
  } = useSortState<[PageName]SortColumn>({
    validColumns: ['field1', 'field2', 'field3'],
    defaultColumn: 'field1',
    defaultDirection: 'desc',
    persistPreference: true,
    storageKey: '[page-name]-sort',
  });

  // Filters state
  const {
    localFilters,
    hasActiveFilters,
    isRestored,
    handleFilterChange,
    handleClearFilters: clearFilters,
  } = use[PageName]Filters({
    onFilterChange: resetPage,
  });

  // Data fetching
  const {
    data,
    isLoading,
    error,
    loadData,
  } = use[PageName]Data({
    localFilters,
    page,
    pageSize,
    isRestored,
  });

  // Event handlers
  const handleRefresh = useCallback(() => {
    loadData();
    toast.success('Data refreshed');
  }, [loadData]);

  const handleCreateNew = useCallback(() => {
    navigate('/[page-route]/new');
  }, [navigate]);

  const handleClearFilters = useCallback(() => {
    clearFilters();
    resetPage();
  }, [clearFilters, resetPage]);

  // Render: Error state
  if (error && !isLoading) {
    return (
      <div className="space-y-6">
        <[PageName]Header
          totalItems={0}
          isLoading={isLoading}
          onRefresh={handleRefresh}
          onCreateNew={handleCreateNew}
        />
        <[PageName]ErrorState
          error={error}
          onRetry={handleRefresh}
        />
      </div>
    );
  }

  // Render: Empty state
  if (!isLoading && data.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">[Page Title]</h1>
            <p className="text-gray-600">[Description]</p>
          </div>
        </div>
        <[PageName]EmptyState
          hasActiveFilters={hasActiveFilters}
          onCreateNew={handleCreateNew}
          onClearFilters={handleClearFilters}
        />
      </div>
    );
  }

  // Render: Main view
  return (
    <div className="space-y-6">
      <[PageName]Header
        totalItems={data.length}
        isLoading={isLoading}
        onRefresh={handleRefresh}
        onCreateNew={handleCreateNew}
      />

      <[PageName]Filters
        filters={localFilters}
        hasActiveFilters={hasActiveFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {isLoading && data.length === 0 ? (
        <[PageName]LoadingState />
      ) : (
        <[PageName]Table
          data={data}
          isLoading={isLoading}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          onSort={toggleSort}
          getSortIndicator={getSortIndicator}
        />
      )}
    </div>
  );
}
```

#### 7. Create Index File (index.tsx)
```typescript
/**
 * [PageName] Module Main Export
 * Exports the main page component and any sub-components
 */

// Main page component (default export for routing)
export { default } from './index.main';

// Sub-components (if needed for sub-routes)
// export { default as SubComponent } from './SubComponent';
```

#### 8. Delete Original File
```bash
rm "C:\temp\white-cross\frontend\src\pages\[PageName].tsx"
```

## Special Considerations

### Multi-Tab Pages (IncidentReportDetail, EmergencyContacts)
For pages with multiple tabs:
- Create a separate component for each tab
- Extract tab-specific logic into dedicated components
- Use context providers if tabs share state

**Example structure:**
```
[PageName]/
├── components/
│   ├── [PageName]Tabs.tsx              # Tab navigation
│   ├── [Tab1Name]Tab.tsx               # Tab 1 content
│   ├── [Tab2Name]Tab.tsx               # Tab 2 content
│   └── ...
```

### Forms and Modals
Extract complex forms and modals into separate components:
- `[PageName]Form.tsx` - Main form component
- `[PageName]Modal.tsx` - Modal wrapper

### HIPAA Compliance
Maintain all HIPAA compliance comments and audit logging:
- Keep comments like "HIPAA Compliance: ..."
- Preserve audit logging code
- Maintain secure data handling patterns

## Testing After Refactoring
1. Verify all imports work correctly
2. Test all user interactions (filters, sorting, pagination)
3. Verify state persistence
4. Check error states and loading states
5. Ensure HIPAA compliance features still work

## Checklist for Each Page
- [ ] Create directory structure
- [ ] Extract types to types.ts
- [ ] Create data hook
- [ ] Create filters hook (if applicable)
- [ ] Create Header component
- [ ] Create Filters component (if applicable)
- [ ] Create Statistics component (if applicable)
- [ ] Create Table/List component
- [ ] Create Empty State component
- [ ] Create Error State component
- [ ] Create Loading State component
- [ ] Create main page component (index.main.tsx)
- [ ] Create index.tsx export file
- [ ] Delete original file
- [ ] Test all functionality
- [ ] Verify routing still works

## Benefits of This Refactoring
1. **Modularity**: Each component has a single responsibility
2. **Reusability**: Components can be reused across pages
3. **Testability**: Smaller components are easier to test
4. **Maintainability**: Changes are localized to specific files
5. **Type Safety**: TypeScript interfaces are clearly defined
6. **Performance**: Can optimize individual components
7. **Developer Experience**: Easier to navigate and understand code

## Example: Completed Refactoring
See `C:\temp\white-cross\frontend\src\pages\IncidentReports\` for a complete example of this refactoring pattern in action.
