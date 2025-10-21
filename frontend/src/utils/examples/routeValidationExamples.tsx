/**
 * WF-COMP-340 | routeValidationExamples.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../routeValidation, ../../types/incidents | Dependencies: react, react-router-dom, zod
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, functions | Key Features: component, arrow component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Route Validation System - Practical Examples
 *
 * This file contains real-world examples of using the route validation system
 * in the White Cross healthcare platform. Copy and adapt these examples for your components.
 */

import React from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import {
  // Schemas
  UUIDParamSchema,
  IncidentIdParamSchema,
  StudentIdParamSchema,
  IncidentTypeParamSchema,
  IncidentSeverityParamSchema,
  IncidentStatusParamSchema,
  DateParamSchema,
  DateRangeParamSchema,
  PaginationParamSchema,
  CompositeParamSchema,
  EnumParamSchema,

  // Hooks
  useValidatedParams,
  useValidatedQueryParams,
  useParamValidator,

  // Validation Functions
  validateRouteParams,
  validateQueryParams,

  // Transformation
  parseDate,
  parseBoolean,
  parseArray,
  parseJSON,
  parseParams,

  // Error Handling
  RouteValidationError,
  handleValidationError,
  redirectOnInvalidParams,
} from '../routeValidation';

import { IncidentType, IncidentSeverity } from '../../types/incidents';

// ============================================================================
// EXAMPLE 1: Simple UUID Validation
// Route: /incidents/:id
// ============================================================================

export function IncidentDetailPageExample() {
  const { data, loading, error } = useValidatedParams(
    IncidentIdParamSchema,
    {
      fallbackRoute: '/incidents',
      onError: (error) => {
        console.error('Invalid incident ID:', error);
      },
    }
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.userMessage}</div>;
  }

  return (
    <div>
      <h1>Incident Details</h1>
      <p>Incident ID: {data.id}</p>
      {/* Fetch and display incident using data.id */}
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Query Parameter Validation with Filters
// Route: /incidents?page=1&type=INJURY&severity=HIGH
// ============================================================================

export function IncidentListWithFiltersExample() {
  // Define schema for query parameters
  const querySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
    type: IncidentTypeParamSchema.optional(),
    severity: IncidentSeverityParamSchema.optional(),
    status: IncidentStatusParamSchema.optional(),
    search: z.string().optional(),
  });

  const { data: filters } = useValidatedQueryParams(querySchema, {
    silent: true, // Don't show errors for invalid filters
  });

  // Use default values if validation failed
  const safeFilters = filters || { page: 1, limit: 20 };

  return (
    <div>
      <h1>Incident List</h1>
      <div>
        <p>Page: {safeFilters.page}</p>
        <p>Type: {safeFilters.type || 'All'}</p>
        <p>Severity: {safeFilters.severity || 'All'}</p>
      </div>
      {/* Render list with filters */}
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: Pagination with Query Params
// Route: /students?page=2&limit=50
// ============================================================================

export function StudentListPaginationExample() {
  const { data: pagination } = useValidatedQueryParams(PaginationParamSchema, {
    silent: true,
  });

  const page = pagination?.page ?? 1;
  const limit = pagination?.limit ?? 20;

  const { data: students, isLoading } = useQuery({
    queryKey: ['students', page, limit],
    queryFn: () => fetchStudents({ page, limit }),
  });

  if (isLoading) {
    return <div>Loading students...</div>;
  }

  return (
    <div>
      <h1>Students (Page {page})</h1>
      <p>Showing {limit} students per page</p>
      {/* Render student list */}
      <div>
        <button disabled={page === 1}>Previous</button>
        <span>Page {page}</span>
        <button>Next</button>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: Multiple Route Parameters
// Route: /students/:studentId/incidents/:incidentId
// ============================================================================

export function StudentIncidentDetailExample() {
  const schema = CompositeParamSchema({
    studentId: UUIDParamSchema,
    incidentId: UUIDParamSchema,
  });

  const { data, loading, error } = useValidatedParams(schema, {
    fallbackRoute: '/students',
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.userMessage}</div>;

  return (
    <div>
      <h1>Student Incident</h1>
      <p>Student ID: {data.studentId}</p>
      <p>Incident ID: {data.incidentId}</p>
      {/* Fetch and display both student and incident */}
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: Custom Validation with Business Logic
// Route: /reports/:startDate/:endDate
// ============================================================================

export function DateRangeReportExample() {
  const { data, loading, error } = useParamValidator(
    (params) => {
      const startDate = parseDate(params.startDate);
      const endDate = parseDate(params.endDate);

      // Validate dates exist
      if (!startDate || !endDate) {
        return {
          success: false,
          error: new RouteValidationError(
            'Invalid date format',
            'dates',
            'INVALID_DATE'
          ),
        };
      }

      // Business rule: Start before end
      if (startDate >= endDate) {
        return {
          success: false,
          error: new RouteValidationError(
            'Start date must be before end date',
            'dateRange',
            'INVALID_RANGE'
          ),
        };
      }

      // Business rule: Max 1 year range
      const daysDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysDiff > 365) {
        return {
          success: false,
          error: new RouteValidationError(
            'Date range cannot exceed 1 year',
            'dateRange',
            'OUT_OF_RANGE'
          ),
        };
      }

      // Business rule: No future dates
      if (endDate > new Date()) {
        return {
          success: false,
          error: new RouteValidationError(
            'Cannot generate reports for future dates',
            'endDate',
            'FUTURE_DATE'
          ),
        };
      }

      return { success: true, data: { startDate, endDate } };
    },
    { fallbackRoute: '/reports' }
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.userMessage}</div>;

  return (
    <div>
      <h1>Report Generator</h1>
      <p>From: {data.startDate.toLocaleDateString()}</p>
      <p>To: {data.endDate.toLocaleDateString()}</p>
      {/* Generate and display report */}
    </div>
  );
}

// ============================================================================
// EXAMPLE 6: Advanced Query Params with Array Parsing
// Route: /search?types=INJURY,ILLNESS&severities=HIGH,CRITICAL&tags=urgent,reviewed
// ============================================================================

export function AdvancedSearchExample() {
  const [searchParams] = useSearchParams();

  const schema = z.object({
    types: z.string()
      .transform(val => parseArray(val))
      .optional(),
    severities: z.string()
      .transform(val => parseArray(val))
      .optional(),
    tags: z.string()
      .transform(val => parseArray(val))
      .optional(),
    resolved: z.string()
      .transform(val => parseBoolean(val))
      .optional(),
    search: z.string().optional(),
  });

  const { data: filters } = useValidatedQueryParams(schema, { silent: true });

  return (
    <div>
      <h1>Advanced Search</h1>
      <div>
        <h3>Filters:</h3>
        {filters?.types && (
          <p>Types: {filters.types.join(', ')}</p>
        )}
        {filters?.severities && (
          <p>Severities: {filters.severities.join(', ')}</p>
        )}
        {filters?.tags && (
          <p>Tags: {filters.tags.join(', ')}</p>
        )}
        {filters?.resolved !== undefined && (
          <p>Resolved: {filters.resolved ? 'Yes' : 'No'}</p>
        )}
      </div>
      {/* Display search results */}
    </div>
  );
}

// ============================================================================
// EXAMPLE 7: Manual Validation (Non-React Context)
// ============================================================================

export function manualValidationExample() {
  // Get params from somewhere (e.g., URL parsing, API call)
  const params = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    type: 'INJURY',
  };

  // Validate manually
  const schema = CompositeParamSchema({
    id: UUIDParamSchema,
    type: IncidentTypeParamSchema,
  });

  const result = validateRouteParams(params, schema);

  if (result.success) {
    console.log('Valid params:', result.data);
    // Use result.data.id and result.data.type
    return result.data;
  } else {
    console.error('Validation error:', result.error);
    handleValidationError(result.error, 'manualValidation');
    return null;
  }
}

// ============================================================================
// EXAMPLE 8: Handling Validation Errors with Toast Notifications
// ============================================================================

export function ValidationWithToastExample() {
  const { data, loading, error } = useValidatedParams(
    IncidentIdParamSchema,
    {
      fallbackRoute: '/incidents',
      onError: (error) => {
        // Log for debugging
        console.error('Validation error:', error);

        // Show user-friendly toast notification
        // Assuming you have a toast system
        // toast.error(error.userMessage, {
        //   description: 'Please check the URL and try again.',
        // });

        // Log security events
        if (['XSS_DETECTED', 'SQL_INJECTION_DETECTED', 'PATH_TRAVERSAL_DETECTED'].includes(error.code)) {
          console.warn('Security threat detected:', {
            code: error.code,
            field: error.field,
            url: window.location.href,
            timestamp: error.timestamp,
          });

          // In production, send to security monitoring service
          // sendSecurityAlert(error);
        }
      },
    }
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Invalid URL. Redirecting...</div>;

  return <div>Valid ID: {data.id}</div>;
}

// ============================================================================
// EXAMPLE 9: Enum Validation with Custom Enum
// ============================================================================

enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export function AppointmentStatusFilterExample() {
  const schema = z.object({
    status: EnumParamSchema(AppointmentStatus, 'Appointment Status').optional(),
    date: DateParamSchema.optional(),
  });

  const { data: filters } = useValidatedQueryParams(schema, { silent: true });

  return (
    <div>
      <h1>Appointments</h1>
      <div>
        <label>
          Status:
          <select value={filters?.status || ''}>
            <option value="">All</option>
            {Object.values(AppointmentStatus).map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>
      {/* Display filtered appointments */}
    </div>
  );
}

// ============================================================================
// EXAMPLE 10: Batch Parameter Transformation
// ============================================================================

export function BatchTransformationExample() {
  const [searchParams] = useSearchParams();

  // Convert URLSearchParams to object
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  // Define expected types
  const types = {
    page: 'number' as const,
    active: 'boolean' as const,
    tags: 'array' as const,
    startDate: 'date' as const,
    filters: 'json' as const,
  };

  // Parse all at once
  const parsed = parseParams(params, types);

  return (
    <div>
      <h1>Parsed Parameters</h1>
      <pre>{JSON.stringify(parsed, null, 2)}</pre>
    </div>
  );
}

// ============================================================================
// EXAMPLE 11: Protected Route with Validation
// ============================================================================

interface ProtectedRouteProps {
  children: React.ReactNode;
  schema: z.ZodSchema<any>;
  fallbackRoute?: string;
}

export function ProtectedRoute({ children, schema, fallbackRoute = '/' }: ProtectedRouteProps) {
  const { data, loading, error } = useValidatedParams(schema, {
    fallbackRoute,
    silent: false,
  });

  if (loading) {
    return <div>Validating route parameters...</div>;
  }

  if (error) {
    return null; // Will redirect automatically
  }

  // Pass validated data to children via context or props
  return <>{children}</>;
}

// Usage:
export function ProtectedIncidentPage() {
  return (
    <ProtectedRoute schema={IncidentIdParamSchema} fallbackRoute="/incidents">
      <div>
        <h1>Protected Incident Page</h1>
        {/* This will only render if params are valid */}
      </div>
    </ProtectedRoute>
  );
}

// ============================================================================
// EXAMPLE 12: Form with Pre-populated Query Params
// ============================================================================

export function SearchFormWithQueryParamsExample() {
  const [searchParams, setSearchParams] = useSearchParams();

  const schema = z.object({
    query: z.string().optional(),
    type: IncidentTypeParamSchema.optional(),
    severity: IncidentSeverityParamSchema.optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
  });

  const { data: filters } = useValidatedQueryParams(schema, { silent: true });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const params: Record<string, string> = {};
    formData.forEach((value, key) => {
      if (value) params[key] = value.toString();
    });

    setSearchParams(params);
  };

  return (
    <div>
      <h1>Search Incidents</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="query"
          placeholder="Search..."
          defaultValue={filters?.query || ''}
        />

        <select name="type" defaultValue={filters?.type || ''}>
          <option value="">All Types</option>
          {Object.values(IncidentType).map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select name="severity" defaultValue={filters?.severity || ''}>
          <option value="">All Severities</option>
          {Object.values(IncidentSeverity).map(severity => (
            <option key={severity} value={severity}>{severity}</option>
          ))}
        </select>

        <input
          type="date"
          name="dateFrom"
          defaultValue={filters?.dateFrom || ''}
        />

        <input
          type="date"
          name="dateTo"
          defaultValue={filters?.dateTo || ''}
        />

        <button type="submit">Search</button>
      </form>
    </div>
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Mock fetch functions for examples
async function fetchStudents({ page, limit }: { page: number; limit: number }) {
  // Implementation
  return [];
}

// Export all examples for documentation
export const examples = {
  IncidentDetailPageExample,
  IncidentListWithFiltersExample,
  StudentListPaginationExample,
  StudentIncidentDetailExample,
  DateRangeReportExample,
  AdvancedSearchExample,
  manualValidationExample,
  ValidationWithToastExample,
  AppointmentStatusFilterExample,
  BatchTransformationExample,
  ProtectedRoute,
  ProtectedIncidentPage,
  SearchFormWithQueryParamsExample,
};
