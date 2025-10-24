/**
 * Backward Compatibility Wrapper for incidentReportsApi
 *
 * This file provides backward compatibility for code that still imports
 * from 'incidentReportsApi'. It re-exports everything from the new 'incidentsApi'.
 *
 * @deprecated Use incidentsApi instead
 * @see incidentsApi.ts
 */

// Re-export everything from the new incidentsApi
export * from './incidentsApi';

// Import the factory function and types
import { createIncidentsApi } from './incidentsApi';
import type { IIncidentsApi } from './incidentsApi';
import { apiClient } from '../core/ApiClient';

// Create an instance for backward compatibility
export const incidentReportsApi = createIncidentsApi(apiClient);

// Type alias for backward compatibility
export type IIncidentReportsApi = IIncidentsApi;
