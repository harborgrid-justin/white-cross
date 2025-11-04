/**
 * WF-COMP-350 | routeValidationHooks.ts - React validation hooks
 * Purpose: React hooks for route parameter validation
 * Upstream: routeValidationTypes, routeValidationUtils | Dependencies: react, next/navigation, zod
 * Downstream: React components and pages | Called by: Component lifecycle
 * Related: routeValidationSchemas, routeValidationUtils
 * Exports: React hooks | Key Features: useValidatedParams, useValidatedQueryParams
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Component mount → Hook execution → Validation → State update
 * LLM Context: React hooks for validating route parameters with error handling
 */

'use client';

import { z } from 'zod';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import {
  ValidationHookOptions,
  RouteValidationError,
  ParamValidator,
} from './routeValidationTypes';
import {
  validateRouteParams,
  validateQueryParams,
  handleValidationError,
  redirectOnInvalidParams,
} from './routeValidationUtils';

// =====================
// REACT HOOKS
// =====================

/**
 * React hook for validating route parameters with Zod schema
 * Automatically validates params and provides loading/error states
 *
 * @param schema - Zod schema to validate params against
 * @param options - Validation options including redirect and error handling
 * @returns Validated params, loading state, and error
 *
 * @example
 * function IncidentDetailPage() {
 *   const { data, loading, error } = useValidatedParams(
 *     IncidentIdParamSchema,
 *     { fallbackRoute: '/incidents' }
 *   );
 *
 *   if (loading) return <Spinner />;
 *   if (error) return <ErrorMessage error={error} />;
 *
 *   return <IncidentDetail incidentId={data.id} />;
 * }
 */
export function useValidatedParams<T>(
  schema: z.ZodSchema<T>,
  options: ValidationHookOptions = {}
): {
  data: T | null;
  loading: boolean;
  error: RouteValidationError | null;
} {
  const params = useParams();
  const router = useRouter();
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: RouteValidationError | null;
  }>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const result = validateRouteParams(params as Record<string, string | undefined>, schema);

    if (result.success && result.data) {
      setState({
        data: result.data,
        loading: false,
        error: null,
      });
    } else if (result.error) {
      setState({
        data: null,
        loading: false,
        error: result.error,
      });

      // Handle error based on options
      if (!options.silent) {
        handleValidationError(result.error, 'useValidatedParams');
      }

      if (options.onError) {
        options.onError(result.error);
      }

      if (options.fallbackRoute || options.redirect) {
        redirectOnInvalidParams(
          result.error,
          options.fallbackRoute || options.redirect || '/',
          router
        );
      }
    }
  }, [params, schema, options, router]);

  return state;
}

/**
 * React hook for validating query parameters with Zod schema
 *
 * @param schema - Zod schema to validate query params against
 * @param options - Validation options
 * @returns Validated query params, loading state, and error
 *
 * @example
 * function IncidentListPage() {
 *   const { data, loading, error } = useValidatedQueryParams(
 *     z.object({
 *       page: z.coerce.number().min(1).optional(),
 *       type: IncidentTypeParamSchema.optional(),
 *       severity: IncidentSeverityParamSchema.optional(),
 *     })
 *   );
 *
 *   if (loading) return <Spinner />;
 *
 *   return <IncidentList filters={data} />;
 * }
 */
export function useValidatedQueryParams<T>(
  schema: z.ZodSchema<T>,
  options: ValidationHookOptions = {}
): {
  data: T | null;
  loading: boolean;
  error: RouteValidationError | null;
} {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: RouteValidationError | null;
  }>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const result = validateQueryParams(searchParams, schema);

    if (result.success && result.data) {
      setState({
        data: result.data,
        loading: false,
        error: null,
      });
    } else if (result.error) {
      setState({
        data: null,
        loading: false,
        error: result.error,
      });

      // Handle error based on options
      if (!options.silent) {
        handleValidationError(result.error, 'useValidatedQueryParams');
      }

      if (options.onError) {
        options.onError(result.error);
      }

      if (options.fallbackRoute || options.redirect) {
        redirectOnInvalidParams(
          result.error,
          options.fallbackRoute || options.redirect || '/',
          router
        );
      }
    }
  }, [searchParams, schema, options, router]);

  return state;
}

/**
 * React hook for parameter validation with custom validator function
 * Provides more flexibility than schema-based validation
 *
 * @param validator - Custom validation function
 * @param options - Validation options
 * @returns Validated data, loading state, and error
 *
 * @example
 * function CustomValidationPage() {
 *   const { data, loading, error } = useParamValidator(
 *     (params) => {
 *       const id = params.id;
 *       if (!id || id.length < 5) {
 *         return {
 *           success: false,
 *           error: new RouteValidationError('Invalid ID', 'id', 'INVALID_ID')
 *         };
 *       }
 *       return { success: true, data: { id } };
 *     },
 *     { fallbackRoute: '/home' }
 *   );
 *
 *   if (loading) return <Spinner />;
 *   return <div>ID: {data?.id}</div>;
 * }
 */
export function useParamValidator<T>(
  validator: ParamValidator<T>,
  options: ValidationHookOptions = {}
): {
  data: T | null;
  loading: boolean;
  error: RouteValidationError | null;
  revalidate: () => void;
} {
  const params = useParams();
  const router = useRouter();
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: RouteValidationError | null;
  }>({
    data: null,
    loading: true,
    error: null,
  });

  const validate = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true }));

    const result = validator(params as Record<string, string | undefined>);

    if (result.success && result.data) {
      setState({
        data: result.data,
        loading: false,
        error: null,
      });
    } else if (result.error) {
      setState({
        data: null,
        loading: false,
        error: result.error,
      });

      // Handle error based on options
      if (!options.silent) {
        handleValidationError(result.error, 'useParamValidator');
      }

      if (options.onError) {
        options.onError(result.error);
      }

      if (options.fallbackRoute || options.redirect) {
        redirectOnInvalidParams(
          result.error,
          options.fallbackRoute || options.redirect || '/',
          router
        );
      }
    }
  }, [params, validator, options, router]);

  useEffect(() => {
    validate();
  }, [validate]);

  return {
    ...state,
    revalidate: validate,
  };
}
