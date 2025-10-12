# Testing Guide

## Table of Contents

- [Overview](#overview)
- [Testing Philosophy](#testing-philosophy)
- [Testing Strategy](#testing-strategy)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [End-to-End Testing](#end-to-end-testing)
- [Testing Redux](#testing-redux)
- [Testing Context API](#testing-context-api)
- [Testing Navigation Guards](#testing-navigation-guards)
- [Testing TanStack Query](#testing-tanstack-query)
- [Mock Data Patterns](#mock-data-patterns)
- [Test Coverage Goals](#test-coverage-goals)
- [Testing Checklist](#testing-checklist)
- [Common Testing Patterns](#common-testing-patterns)
- [Troubleshooting](#troubleshooting)

---

## Overview

This guide provides comprehensive testing strategies for the White Cross platform's state management and routing features. It covers unit testing, integration testing, and end-to-end testing approaches.

### Testing Technologies

- **Vitest**: Unit and integration testing framework
- **React Testing Library**: Component testing utilities
- **MSW (Mock Service Worker)**: API mocking
- **Cypress**: End-to-end testing
- **Testing Library User Event**: User interaction simulation

---

## Testing Philosophy

### Testing Pyramid

```
                    /\
                   /  \
                  /    \
                 /  E2E \        10% - End-to-End Tests
                /--------\         - Full user workflows
               /          \        - Critical paths only
              /            \       - Slow, expensive
             /  Integration \
            /----------------\   30% - Integration Tests
           /                  \    - Feature interactions
          /    Component Tests \   - API integration
         /----------------------\  - Context providers
        /                        \
       /        Unit Tests        \ 60% - Unit Tests
      /----------------------------\  - Pure functions
                                      - Utilities
                                      - Selectors
                                      - Business logic
```

### Testing Principles

1. **Test Behavior, Not Implementation**: Focus on what the code does, not how it does it
2. **Write Tests That Resemble User Interactions**: Use Testing Library best practices
3. **Avoid Testing Third-Party Libraries**: Don't test React, Redux, or TanStack Query
4. **Mock at the Network Layer**: Use MSW for API mocking
5. **Keep Tests Fast**: Unit tests should run in milliseconds
6. **Test Error States**: Verify error handling and edge cases
7. **Maintain Test Independence**: Each test should be isolated

---

## Testing Strategy

### What to Test

#### High Priority (Must Test)
- Business logic functions
- Redux slices (actions, reducers, selectors)
- Context providers and hooks
- Navigation guards
- Custom hooks
- API service functions
- Form validation logic
- Permission checking functions

#### Medium Priority (Should Test)
- Component rendering
- User interactions
- Error boundaries
- Data transformations
- State synchronization
- Optimistic updates
- Cache invalidation logic

#### Low Priority (Can Skip)
- UI styling
- Third-party library behavior
- Simple presentational components
- Configuration files
- Type definitions

### What NOT to Test
- External libraries (React, Redux, TanStack Query)
- Browser APIs
- CSS and styling (unless critical to function)
- Configuration without logic
- Auto-generated code

---

## Unit Testing

### Testing Pure Functions

```typescript
// utils/dateUtils.ts
export function formatIncidentDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// utils/dateUtils.test.ts
import { describe, it, expect } from 'vitest';
import { formatIncidentDate } from './dateUtils';

describe('formatIncidentDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2025-10-11T14:30:00Z');
    const result = formatIncidentDate(date);
    expect(result).toContain('October');
    expect(result).toContain('2025');
  });

  it('should handle invalid dates', () => {
    const invalidDate = new Date('invalid');
    expect(() => formatIncidentDate(invalidDate)).not.toThrow();
  });
});
```

### Testing Custom Hooks

```typescript
// hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// hooks/useDebounce.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  it('should debounce value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    // Change value multiple times
    rerender({ value: 'change1', delay: 500 });
    rerender({ value: 'change2', delay: 500 });
    rerender({ value: 'change3', delay: 500 });

    // Should still be initial value
    expect(result.current).toBe('initial');

    // Wait for debounce
    await waitFor(() => {
      expect(result.current).toBe('change3');
    }, { timeout: 600 });
  });

  it('should update immediately if delay is 0', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 0),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });
    expect(result.current).toBe('updated');
  });
});
```

---

## Integration Testing

### Testing Components with State

```typescript
// components/IncidentReportCard.tsx
import React from 'react';
import { IncidentReport } from '@/types';

interface Props {
  report: IncidentReport;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export function IncidentReportCard({ report, onDelete, onEdit }: Props) {
  return (
    <div data-testid={`report-card-${report.id}`}>
      <h3>{report.type}</h3>
      <p>{report.description}</p>
      <p>Severity: {report.severity}</p>
      <button onClick={() => onEdit(report.id)}>Edit</button>
      <button onClick={() => onDelete(report.id)}>Delete</button>
    </div>
  );
}

// components/IncidentReportCard.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IncidentReportCard } from './IncidentReportCard';

describe('IncidentReportCard', () => {
  const mockReport = {
    id: '123',
    type: 'INJURY',
    description: 'Student fell on playground',
    severity: 'MEDIUM',
    occurredAt: new Date().toISOString(),
    studentId: 'student-1',
  };

  it('should render report details', () => {
    const onDelete = vi.fn();
    const onEdit = vi.fn();

    render(
      <IncidentReportCard
        report={mockReport}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );

    expect(screen.getByText('INJURY')).toBeInTheDocument();
    expect(screen.getByText('Student fell on playground')).toBeInTheDocument();
    expect(screen.getByText('Severity: MEDIUM')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    const onEdit = vi.fn();

    render(
      <IncidentReportCard
        report={mockReport}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );

    await user.click(screen.getByText('Edit'));
    expect(onEdit).toHaveBeenCalledWith('123');
  });

  it('should call onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    const onEdit = vi.fn();

    render(
      <IncidentReportCard
        report={mockReport}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );

    await user.click(screen.getByText('Delete'));
    expect(onDelete).toHaveBeenCalledWith('123');
  });
});
```

---

## End-to-End Testing

### Cypress E2E Tests

```typescript
// cypress/e2e/incident-reports.cy.ts
describe('Incident Reports', () => {
  beforeEach(() => {
    // Login
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type('nurse@school.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();

    // Wait for redirect
    cy.url().should('include', '/dashboard');
  });

  it('should create a new incident report', () => {
    // Navigate to incident reports
    cy.visit('/incident-reports');
    cy.get('[data-testid="create-report-button"]').click();

    // Fill out form
    cy.get('[data-testid="incident-type-select"]').select('INJURY');
    cy.get('[data-testid="severity-select"]').select('MEDIUM');
    cy.get('[data-testid="description-textarea"]').type(
      'Student fell on playground during recess'
    );
    cy.get('[data-testid="student-select"]').select('John Doe');
    cy.get('[data-testid="location-input"]').type('Main Playground');

    // Submit form
    cy.get('[data-testid="submit-button"]').click();

    // Verify success
    cy.get('[data-testid="success-toast"]').should('be.visible');
    cy.contains('Student fell on playground during recess').should('be.visible');
  });

  it('should filter incident reports by severity', () => {
    cy.visit('/incident-reports');

    // Apply filter
    cy.get('[data-testid="severity-filter"]').select('HIGH');

    // Verify filtered results
    cy.get('[data-testid="report-card"]').each(($el) => {
      cy.wrap($el).should('contain', 'HIGH');
    });
  });

  it('should add witness statement to incident report', () => {
    cy.visit('/incident-reports');

    // Open incident details
    cy.get('[data-testid="report-card"]').first().click();

    // Navigate to witness statements tab
    cy.get('[data-testid="witness-statements-tab"]').click();

    // Add witness statement
    cy.get('[data-testid="add-witness-button"]').click();
    cy.get('[data-testid="witness-name-input"]').type('Jane Smith');
    cy.get('[data-testid="witness-type-select"]').select('TEACHER');
    cy.get('[data-testid="witness-statement-textarea"]').type(
      'I saw the student trip and fall.'
    );
    cy.get('[data-testid="submit-witness-button"]').click();

    // Verify witness statement added
    cy.contains('Jane Smith').should('be.visible');
    cy.contains('I saw the student trip and fall.').should('be.visible');
  });

  it('should handle navigation guards correctly', () => {
    // Logout
    cy.get('[data-testid="user-menu"]').click();
    cy.get('[data-testid="logout-button"]').click();

    // Try to access protected route
    cy.visit('/incident-reports');

    // Should redirect to login
    cy.url().should('include', '/login');
  });
});
```

---

## Testing Redux

### Testing Slices

```typescript
// stores/slices/incidentReportsSlice.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import incidentReportsReducer, {
  setFilters,
  setSortOrder,
  clearSelectedIncident,
  selectIncidentReports,
  selectFilteredAndSortedReports,
} from './incidentReportsSlice';

describe('incidentReportsSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        incidentReports: incidentReportsReducer,
      },
    });
  });

  describe('reducers', () => {
    it('should set filters', () => {
      const filters = { severity: 'HIGH', status: 'OPEN' };
      store.dispatch(setFilters(filters));

      const state = store.getState().incidentReports;
      expect(state.filters.severity).toBe('HIGH');
      expect(state.filters.status).toBe('OPEN');
      expect(state.cacheInvalidated).toBe(true);
    });

    it('should set sort order', () => {
      const sortConfig = { column: 'severity', order: 'asc' };
      store.dispatch(setSortOrder(sortConfig));

      const state = store.getState().incidentReports;
      expect(state.sortConfig).toEqual(sortConfig);
    });

    it('should clear selected incident', () => {
      // Set selected incident
      const report = { id: '123', type: 'INJURY' };
      store.dispatch({ type: 'incidentReports/setSelectedIncidentReport', payload: report });

      // Clear it
      store.dispatch(clearSelectedIncident());

      const state = store.getState().incidentReports;
      expect(state.selectedReport).toBeNull();
      expect(state.witnessStatements).toEqual([]);
      expect(state.followUpActions).toEqual([]);
    });
  });

  describe('selectors', () => {
    it('should select all incident reports', () => {
      const mockReports = [
        { id: '1', type: 'INJURY', severity: 'HIGH' },
        { id: '2', type: 'ILLNESS', severity: 'LOW' },
      ];

      store.dispatch({
        type: 'incidentReports/fetchIncidentReports/fulfilled',
        payload: { reports: mockReports, pagination: {} },
      });

      const reports = selectIncidentReports(store.getState());
      expect(reports).toHaveLength(2);
      expect(reports[0].id).toBe('1');
    });

    it('should select filtered and sorted reports', () => {
      const mockReports = [
        { id: '1', type: 'INJURY', severity: 'LOW', occurredAt: '2025-10-10' },
        { id: '2', type: 'ILLNESS', severity: 'HIGH', occurredAt: '2025-10-11' },
        { id: '3', type: 'INJURY', severity: 'MEDIUM', occurredAt: '2025-10-09' },
      ];

      store.dispatch({
        type: 'incidentReports/fetchIncidentReports/fulfilled',
        payload: { reports: mockReports, pagination: {} },
      });

      // Set sort order
      store.dispatch(setSortOrder({ column: 'severity', order: 'desc' }));

      const sorted = selectFilteredAndSortedReports(store.getState());
      expect(sorted[0].severity).toBe('HIGH');
      expect(sorted[1].severity).toBe('MEDIUM');
      expect(sorted[2].severity).toBe('LOW');
    });
  });
});
```

### Testing Async Thunks

```typescript
// stores/slices/incidentReportsSlice.test.ts (continued)
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchIncidentReports, createIncidentReport } from './incidentReportsSlice';
import { incidentReportsApi } from '@/services/modules/incidentReportsApi';

vi.mock('@/services/modules/incidentReportsApi');

describe('incidentReports async thunks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchIncidentReports', () => {
    it('should fetch reports successfully', async () => {
      const mockReports = [
        { id: '1', type: 'INJURY' },
        { id: '2', type: 'ILLNESS' },
      ];

      const mockResponse = {
        reports: mockReports,
        pagination: { page: 1, limit: 20, total: 2, pages: 1 },
      };

      vi.mocked(incidentReportsApi.getAll).mockResolvedValueOnce(mockResponse);

      const store = configureStore({
        reducer: { incidentReports: incidentReportsReducer },
      });

      await store.dispatch(fetchIncidentReports({ status: 'OPEN' }));

      const state = store.getState().incidentReports;
      expect(state.reports).toHaveLength(2);
      expect(state.loading.list).toBe(false);
      expect(state.errors.list).toBeNull();
    });

    it('should handle fetch error', async () => {
      vi.mocked(incidentReportsApi.getAll).mockRejectedValueOnce(
        new Error('Network error')
      );

      const store = configureStore({
        reducer: { incidentReports: incidentReportsReducer },
      });

      await store.dispatch(fetchIncidentReports());

      const state = store.getState().incidentReports;
      expect(state.loading.list).toBe(false);
      expect(state.errors.list).toContain('Network error');
    });
  });

  describe('createIncidentReport', () => {
    it('should create report successfully', async () => {
      const newReport = {
        type: 'INJURY',
        severity: 'MEDIUM',
        description: 'Test incident',
        studentId: 'student-1',
      };

      const createdReport = {
        ...newReport,
        id: '123',
        occurredAt: new Date().toISOString(),
      };

      vi.mocked(incidentReportsApi.create).mockResolvedValueOnce({
        report: createdReport,
      });

      const store = configureStore({
        reducer: { incidentReports: incidentReportsReducer },
      });

      await store.dispatch(createIncidentReport(newReport));

      const state = store.getState().incidentReports;
      expect(state.reports).toHaveLength(1);
      expect(state.reports[0].id).toBe('123');
      expect(state.loading.creating).toBe(false);
    });
  });
});
```

---

## Testing Context API

### Testing Context Providers

```typescript
// contexts/WitnessStatementContext.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  WitnessStatementProvider,
  useWitnessStatements,
} from './WitnessStatementContext';
import { incidentReportsApi } from '@/services';

vi.mock('@/services', () => ({
  incidentReportsApi: {
    getWitnessStatements: vi.fn(),
    addWitnessStatement: vi.fn(),
    updateWitnessStatement: vi.fn(),
    deleteWitnessStatement: vi.fn(),
    verifyWitnessStatement: vi.fn(),
  },
}));

describe('WitnessStatementContext', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <WitnessStatementProvider incidentId="incident-1">
        {children}
      </WitnessStatementProvider>
    </QueryClientProvider>
  );

  it('should load witness statements', async () => {
    const mockStatements = [
      { id: '1', witnessName: 'John Doe', statement: 'I saw it happen' },
      { id: '2', witnessName: 'Jane Smith', statement: 'I heard the noise' },
    ];

    vi.mocked(incidentReportsApi.getWitnessStatements).mockResolvedValueOnce({
      statements: mockStatements,
    });

    const { result } = renderHook(() => useWitnessStatements(), { wrapper });

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.statements).toHaveLength(2);
    expect(result.current.statements[0].witnessName).toBe('John Doe');
  });

  it('should create witness statement', async () => {
    const mockStatements = [];

    vi.mocked(incidentReportsApi.getWitnessStatements).mockResolvedValueOnce({
      statements: mockStatements,
    });

    const newStatement = {
      incidentReportId: 'incident-1',
      witnessName: 'New Witness',
      witnessType: 'STUDENT',
      statement: 'New statement',
    };

    const createdStatement = { ...newStatement, id: '3' };

    vi.mocked(incidentReportsApi.addWitnessStatement).mockResolvedValueOnce({
      statement: createdStatement,
    });

    const { result } = renderHook(() => useWitnessStatements(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Create statement
    await result.current.createWitnessStatement(newStatement);

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.statements).toHaveLength(1);
    });

    expect(result.current.statements[0].witnessName).toBe('New Witness');
  });

  it('should handle errors when creating statement', async () => {
    vi.mocked(incidentReportsApi.getWitnessStatements).mockResolvedValueOnce({
      statements: [],
    });

    vi.mocked(incidentReportsApi.addWitnessStatement).mockRejectedValueOnce(
      new Error('Failed to create')
    );

    const { result } = renderHook(() => useWitnessStatements(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Attempt to create statement
    await expect(
      result.current.createWitnessStatement({
        incidentReportId: 'incident-1',
        witnessName: 'Test',
        witnessType: 'STUDENT',
        statement: 'Test statement',
      })
    ).rejects.toThrow('Failed to create');
  });

  it('should throw error when used outside provider', () => {
    expect(() => {
      renderHook(() => useWitnessStatements());
    }).toThrow('useWitnessStatements must be used within a WitnessStatementProvider');
  });
});
```

---

## Testing Navigation Guards

### Testing Guard HOCs

```typescript
// guards/navigationGuards.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import {
  withAuthGuard,
  withRoleGuard,
  withPermissionGuard,
} from './navigationGuards';

// Mock components
function TestComponent() {
  return <div>Protected Content</div>;
}

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Navigation Guards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('withAuthGuard', () => {
    it('should render component when user is authenticated', () => {
      const ProtectedComponent = withAuthGuard(TestComponent);
      const mockUser = { id: '1', role: 'NURSE', email: 'nurse@school.com' };

      render(
        <BrowserRouter>
          <AuthProvider initialUser={mockUser}>
            <ProtectedComponent />
          </AuthProvider>
        </BrowserRouter>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should redirect to login when user is not authenticated', async () => {
      const ProtectedComponent = withAuthGuard(TestComponent);

      render(
        <BrowserRouter>
          <AuthProvider initialUser={null}>
            <ProtectedComponent />
          </AuthProvider>
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          expect.stringContaining('/login'),
          expect.any(Object)
        );
      });
    });
  });

  describe('withRoleGuard', () => {
    it('should render component when user has required role', () => {
      const ProtectedComponent = withRoleGuard(['NURSE', 'ADMIN'])(TestComponent);
      const mockUser = { id: '1', role: 'NURSE', email: 'nurse@school.com' };

      render(
        <BrowserRouter>
          <AuthProvider initialUser={mockUser}>
            <ProtectedComponent />
          </AuthProvider>
        </BrowserRouter>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should show access denied when user lacks required role', () => {
      const ProtectedComponent = withRoleGuard(['ADMIN'])(TestComponent);
      const mockUser = { id: '1', role: 'READ_ONLY', email: 'user@school.com' };

      render(
        <BrowserRouter>
          <AuthProvider initialUser={mockUser}>
            <ProtectedComponent />
          </AuthProvider>
        </BrowserRouter>
      );

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      expect(screen.getByText(/access denied/i)).toBeInTheDocument();
    });
  });

  describe('withPermissionGuard', () => {
    it('should render component when user has required permissions', () => {
      const ProtectedComponent = withPermissionGuard([
        { resource: 'students', action: 'update' },
      ])(TestComponent);
      const mockUser = { id: '1', role: 'NURSE', email: 'nurse@school.com' };

      render(
        <BrowserRouter>
          <AuthProvider initialUser={mockUser}>
            <ProtectedComponent />
          </AuthProvider>
        </BrowserRouter>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should show access denied when user lacks permissions', () => {
      const ProtectedComponent = withPermissionGuard([
        { resource: 'admin', action: 'manage' },
      ])(TestComponent);
      const mockUser = { id: '1', role: 'READ_ONLY', email: 'user@school.com' };

      render(
        <BrowserRouter>
          <AuthProvider initialUser={mockUser}>
            <ProtectedComponent />
          </AuthProvider>
        </BrowserRouter>
      );

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      expect(screen.getByText(/access denied/i)).toBeInTheDocument();
    });
  });
});
```

---

## Testing TanStack Query

### Testing Query Hooks

```typescript
// hooks/useIncidentReports.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useIncidentReports } from './useIncidentReports';
import { incidentReportsApi } from '@/services';

vi.mock('@/services');

describe('useIncidentReports', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should fetch incident reports', async () => {
    const mockReports = [
      { id: '1', type: 'INJURY' },
      { id: '2', type: 'ILLNESS' },
    ];

    vi.mocked(incidentReportsApi.getAll).mockResolvedValueOnce({
      reports: mockReports,
      pagination: {},
    });

    const { result } = renderHook(() => useIncidentReports(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.reports).toHaveLength(2);
  });

  it('should handle fetch errors', async () => {
    vi.mocked(incidentReportsApi.getAll).mockRejectedValueOnce(
      new Error('Network error')
    );

    const { result } = renderHook(() => useIncidentReports(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });

  it('should refetch on filter change', async () => {
    const mockReports = [{ id: '1', type: 'INJURY' }];

    vi.mocked(incidentReportsApi.getAll).mockResolvedValue({
      reports: mockReports,
      pagination: {},
    });

    const { result, rerender } = renderHook(
      ({ filters }) => useIncidentReports(filters),
      {
        wrapper,
        initialProps: { filters: { severity: 'HIGH' } },
      }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(incidentReportsApi.getAll).toHaveBeenCalledWith({ severity: 'HIGH' });

    // Change filters
    rerender({ filters: { severity: 'LOW' } });

    await waitFor(() => {
      expect(incidentReportsApi.getAll).toHaveBeenCalledWith({ severity: 'LOW' });
    });
  });
});
```

---

## Mock Data Patterns

### Creating Mock Data Factories

```typescript
// test/factories/incidentReportFactory.ts
import { IncidentReport, IncidentType, IncidentSeverity } from '@/types';

let idCounter = 1;

export function createMockIncidentReport(
  overrides?: Partial<IncidentReport>
): IncidentReport {
  return {
    id: `report-${idCounter++}`,
    type: IncidentType.INJURY,
    severity: IncidentSeverity.MEDIUM,
    description: 'Mock incident description',
    location: 'Main Playground',
    occurredAt: new Date().toISOString(),
    reportedAt: new Date().toISOString(),
    studentId: 'student-1',
    reportedById: 'nurse-1',
    status: 'OPEN',
    followUpRequired: false,
    parentNotified: false,
    ...overrides,
  };
}

export function createMockIncidentReports(count: number): IncidentReport[] {
  return Array.from({ length: count }, (_, i) =>
    createMockIncidentReport({
      id: `report-${i + 1}`,
      description: `Incident ${i + 1}`,
    })
  );
}

// Usage
const mockReport = createMockIncidentReport({ severity: 'HIGH' });
const mockReports = createMockIncidentReports(5);
```

### MSW Request Handlers

```typescript
// test/mocks/handlers.ts
import { rest } from 'msw';
import { createMockIncidentReports } from '../factories';

export const handlers = [
  // Get all incident reports
  rest.get('/api/incident-reports', (req, res, ctx) => {
    const severity = req.url.searchParams.get('severity');
    let reports = createMockIncidentReports(10);

    if (severity) {
      reports = reports.filter((r) => r.severity === severity);
    }

    return res(
      ctx.status(200),
      ctx.json({
        reports,
        pagination: { page: 1, limit: 20, total: reports.length, pages: 1 },
      })
    );
  }),

  // Get single incident report
  rest.get('/api/incident-reports/:id', (req, res, ctx) => {
    const { id } = req.params;
    const report = createMockIncidentReport({ id: id as string });

    return res(ctx.status(200), ctx.json({ report }));
  }),

  // Create incident report
  rest.post('/api/incident-reports', async (req, res, ctx) => {
    const body = await req.json();
    const newReport = createMockIncidentReport({ ...body, id: 'new-report' });

    return res(ctx.status(201), ctx.json({ report: newReport }));
  }),

  // Error scenario
  rest.get('/api/incident-reports/error', (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({ error: 'Internal server error' })
    );
  }),
];

// test/setup.ts
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

export const server = setupServer(...handlers);

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Clean up after all tests
afterAll(() => server.close());
```

---

## Test Coverage Goals

### Coverage Targets

```
Overall Coverage:   >= 80%
  Statements:       >= 80%
  Branches:         >= 75%
  Functions:        >= 80%
  Lines:            >= 80%

Critical Modules:   >= 90%
  - Redux slices
  - Navigation guards
  - Permission checking
  - API services
  - Business logic

Medium Priority:    >= 80%
  - Context providers
  - Custom hooks
  - Utilities
  - Components with logic

Low Priority:       >= 60%
  - Presentational components
  - UI components
  - Type definitions
```

### Running Coverage

```bash
# Run tests with coverage
npm run test:coverage

# View coverage report
open coverage/index.html

# CI/CD coverage check
npm run test:coverage -- --reporter=json --reporter=text
```

---

## Testing Checklist

### Feature Testing Checklist

When implementing a new feature, ensure you test:

- [ ] **Happy Path**: Feature works as expected under normal conditions
- [ ] **Error Handling**: Errors are caught and displayed appropriately
- [ ] **Loading States**: Loading indicators show during async operations
- [ ] **Empty States**: Empty data states render correctly
- [ ] **Edge Cases**: Boundary conditions are handled (0, null, undefined)
- [ ] **Permissions**: Access control works correctly
- [ ] **Validation**: Input validation catches invalid data
- [ ] **Side Effects**: State updates, API calls, cache invalidation work
- [ ] **Cleanup**: Resources are cleaned up (event listeners, subscriptions)
- [ ] **Accessibility**: Screen readers, keyboard navigation work

### Redux Testing Checklist

- [ ] All reducers handle actions correctly
- [ ] Initial state is correct
- [ ] Selectors return expected data
- [ ] Async thunks handle success cases
- [ ] Async thunks handle error cases
- [ ] Async thunks update loading states
- [ ] Optimistic updates work and rollback on error
- [ ] Cache invalidation triggers correctly

### Context Testing Checklist

- [ ] Provider renders children correctly
- [ ] Context values update correctly
- [ ] Hook throws error when used outside provider
- [ ] Memoization prevents unnecessary re-renders
- [ ] Async operations complete successfully
- [ ] Error states are handled
- [ ] Cleanup functions run on unmount

### Component Testing Checklist

- [ ] Component renders without crashing
- [ ] Props are handled correctly
- [ ] Event handlers are called with correct arguments
- [ ] Conditional rendering works
- [ ] Loading and error states render
- [ ] User interactions trigger expected behavior
- [ ] Form validation works
- [ ] Accessibility attributes are present

---

## Common Testing Patterns

### Pattern 1: Testing Async Operations

```typescript
it('should handle async operation', async () => {
  const { result } = renderHook(() => useCustomHook());

  // Trigger async operation
  act(() => {
    result.current.fetchData();
  });

  // Wait for loading to complete
  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.data).toBeDefined();
});
```

### Pattern 2: Testing User Interactions

```typescript
it('should handle user interaction', async () => {
  const user = userEvent.setup();
  const handleClick = vi.fn();

  render(<Button onClick={handleClick}>Click Me</Button>);

  await user.click(screen.getByText('Click Me'));

  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Pattern 3: Testing Form Submissions

```typescript
it('should submit form with valid data', async () => {
  const user = userEvent.setup();
  const handleSubmit = vi.fn();

  render(<Form onSubmit={handleSubmit} />);

  // Fill form
  await user.type(screen.getByLabelText('Name'), 'John Doe');
  await user.type(screen.getByLabelText('Email'), 'john@example.com');

  // Submit
  await user.click(screen.getByText('Submit'));

  expect(handleSubmit).toHaveBeenCalledWith({
    name: 'John Doe',
    email: 'john@example.com',
  });
});
```

### Pattern 4: Testing Error Boundaries

```typescript
it('should catch errors in error boundary', () => {
  const ThrowError = () => {
    throw new Error('Test error');
  };

  const { container } = render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  );

  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
});
```

---

## Troubleshooting

### Common Issues

#### Issue: Tests timing out

```typescript
// Problem: Async operation never completes
it('should load data', async () => {
  const { result } = renderHook(() => useData());
  await waitFor(() => {
    expect(result.current.data).toBeDefined();
  }); // Times out
});

// Solution: Check that mock is resolving
vi.mocked(api.getData).mockResolvedValueOnce({ data: [] });
```

#### Issue: State updates not reflecting

```typescript
// Problem: State update not wrapped in act()
it('should update state', () => {
  const { result } = renderHook(() => useCounter());
  result.current.increment(); // Warning: not wrapped in act()
});

// Solution: Wrap in act()
import { act } from '@testing-library/react';

it('should update state', () => {
  const { result } = renderHook(() => useCounter());
  act(() => {
    result.current.increment();
  });
  expect(result.current.count).toBe(1);
});
```

#### Issue: Memory leaks in tests

```typescript
// Problem: Subscriptions not cleaned up
useEffect(() => {
  const subscription = observable.subscribe();
  // Missing cleanup
}, []);

// Solution: Return cleanup function
useEffect(() => {
  const subscription = observable.subscribe();
  return () => subscription.unsubscribe();
}, []);
```

#### Issue: Flaky tests

```typescript
// Problem: Race conditions
it('should load data', () => {
  render(<Component />);
  expect(screen.getByText('Data loaded')).toBeInTheDocument(); // Flaky
});

// Solution: Wait for element to appear
it('should load data', async () => {
  render(<Component />);
  await screen.findByText('Data loaded');
  expect(screen.getByText('Data loaded')).toBeInTheDocument();
});
```

---

## Summary

This testing guide provides comprehensive coverage of testing strategies for the White Cross platform. Key takeaways:

1. **Follow the Testing Pyramid**: More unit tests, fewer integration tests, minimal E2E tests
2. **Test Behavior**: Focus on what users see and do, not implementation details
3. **Mock at Boundaries**: Use MSW for API mocking, avoid mocking internal modules
4. **Keep Tests Fast**: Unit tests should run in milliseconds
5. **Maintain High Coverage**: Aim for 80%+ overall, 90%+ for critical code
6. **Test Error States**: Don't just test happy paths
7. **Use Factories**: Create reusable mock data factories
8. **Follow Checklists**: Ensure comprehensive test coverage

---

**Related Documentation:**
- [Integration Complete Guide](./INTEGRATION_COMPLETE.md)
- [State Management Architecture](./STATE_MANAGEMENT_ARCHITECTURE.md)
- [Quick Start Guide](./QUICK_START.md)

**Last Updated:** October 11, 2025
**Version:** 1.0.0
