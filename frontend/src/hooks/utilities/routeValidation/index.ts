/**
 * WF-COMP-350 | index.ts - Route validation module exports
 * Purpose: Central export point for route validation system
 * Upstream: All routeValidation modules | Dependencies: All sub-modules
 * Downstream: Application components and pages | Called by: Import statements
 * Related: All routeValidation modules
 * Exports: All types, schemas, hooks, utilities | Key Features: Backward compatibility
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Import resolution → Module re-export → Consumer access
 * LLM Context: Main entry point for route validation, maintains backward compatibility
 */

'use client';

// =====================
// TYPE DEFINITIONS & ERRORS
// =====================
export type {
  ParamValidator,
  ValidationResult,
  ParamSchema,
  ValidationError,
  ValidationHookOptions,
} from './routeValidationTypes';

export {
  RouteValidationError,
} from './routeValidationTypes';

// =====================
// VALIDATION SCHEMAS
// =====================
export {
  // Base schemas
  UUIDParamSchema,
  NumericParamSchema,
  PositiveIntegerParamSchema,
  DateParamSchema,
  EnumParamSchema,
  CompositeParamSchema,

  // Predefined entity schemas
  StudentIdParamSchema,
  IncidentIdParamSchema,
  IncidentTypeParamSchema,
  IncidentSeverityParamSchema,
  IncidentStatusParamSchema,
  ActionPriorityParamSchema,
  ActionStatusParamSchema,
  MedicationIdParamSchema,
  AppointmentIdParamSchema,
  DocumentIdParamSchema,
  EmergencyContactIdParamSchema,
  HealthRecordIdParamSchema,

  // Composite schemas
  StudentHealthRecordParamSchema,
  StudentDocumentParamSchema,
  StudentEmergencyContactParamSchema,
  DateRangeParamSchema,
  PaginationParamSchema,
} from './routeValidationSchemas';

// =====================
// SECURITY UTILITIES
// =====================
export {
  detectXSS,
  detectSQLInjection,
  detectPathTraversal,
  performSecurityChecks,
  sanitizeSpecialCharacters,
} from './routeValidationSecurity';

// =====================
// PARAMETER TRANSFORMERS
// =====================
export {
  parseDate,
  parseBoolean,
  parseArray,
  parseJSON,
  parseParams,
} from './routeValidationTransformers';

// =====================
// VALIDATION UTILITIES
// =====================
export {
  // Sanitization
  sanitizeParams,

  // Validation
  validateRouteParams,
  validateQueryParams,

  // Error handling
  handleValidationError,
  redirectOnInvalidParams,
} from './routeValidationUtils';

// =====================
// REACT HOOKS
// =====================
export {
  useValidatedParams,
  useValidatedQueryParams,
  useParamValidator,
} from './routeValidationHooks';

// =====================
// USAGE EXAMPLES (Documentation)
// =====================

/**
 * @example Basic UUID validation
 *
 * import { useValidatedParams, IncidentIdParamSchema } from '@/hooks/utilities/routeValidation';
 *
 * function IncidentDetailPage() {
 *   const { data, loading, error } = useValidatedParams(
 *     IncidentIdParamSchema,
 *     { fallbackRoute: '/incidents' }
 *   );
 *
 *   if (loading) return <LoadingSpinner />;
 *   if (error) return <ErrorPage error={error.userMessage} />;
 *
 *   return <IncidentDetails incidentId={data.id} />;
 * }
 */

/**
 * @example Query parameter validation with pagination
 *
 * import { useValidatedQueryParams, PaginationParamSchema } from '@/hooks/utilities/routeValidation';
 *
 * function IncidentListPage() {
 *   const { data } = useValidatedQueryParams(
 *     PaginationParamSchema,
 *     { silent: true } // Don't show errors for invalid pagination
 *   );
 *
 *   const page = data?.page ?? 1;
 *   const limit = data?.limit ?? 20;
 *
 *   return <IncidentList page={page} limit={limit} />;
 * }
 */

/**
 * @example Complex composite validation
 *
 * import {
 *   useValidatedParams,
 *   CompositeParamSchema,
 *   UUIDParamSchema,
 *   IncidentTypeParamSchema
 * } from '@/hooks/utilities/routeValidation';
 *
 * function FilteredIncidentPage() {
 *   const schema = CompositeParamSchema({
 *     studentId: UUIDParamSchema,
 *     type: IncidentTypeParamSchema,
 *   });
 *
 *   const { data, loading, error } = useValidatedParams(schema);
 *
 *   if (loading) return <LoadingSpinner />;
 *   if (error) return <ErrorPage error={error.userMessage} />;
 *
 *   return (
 *     <IncidentList
 *       studentId={data.studentId}
 *       type={data.type}
 *     />
 *   );
 * }
 */

/**
 * @example Custom validation with business logic
 *
 * import { useParamValidator, RouteValidationError, parseDate } from '@/hooks/utilities/routeValidation';
 *
 * function ReportGeneratorPage() {
 *   const { data, error } = useParamValidator((params) => {
 *     const startDate = parseDate(params.startDate);
 *     const endDate = parseDate(params.endDate);
 *
 *     if (!startDate || !endDate) {
 *       return {
 *         success: false,
 *         error: new RouteValidationError(
 *           'Invalid date range',
 *           'dateRange',
 *           'INVALID_DATE'
 *         )
 *       };
 *     }
 *
 *     const daysDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
 *     if (daysDiff > 365) {
 *       return {
 *         success: false,
 *         error: new RouteValidationError(
 *           'Date range cannot exceed 1 year',
 *           'dateRange',
 *           'OUT_OF_RANGE'
 *         )
 *       };
 *     }
 *
 *     return { success: true, data: { startDate, endDate } };
 *   });
 *
 *   if (error) return <ErrorPage error={error.userMessage} />;
 *
 *   return <Report startDate={data.startDate} endDate={data.endDate} />;
 * }
 */
