/**
 * WF-COMP-280 | incidentsApi.ts - Incidents API Service Module
 * Purpose: Complete API service for incident management system
 * Upstream: ../config/apiConfig, ../utils/apiUtils | Dependencies: ../config/apiConfig, ../utils/apiUtils
 * Downstream: Components, pages, hooks, state management | Called by: React component tree
 * Related: Witness statements, follow-up actions, evidence management
 * Exports: createIncidentsApi, IIncidentsApi | Key Features: Enterprise incident reporting
 * Last Updated: 2025-11-11 | File Type: .ts
 * Critical Path: User action → API call → Backend → Response → State update → UI render
 * LLM Context: Comprehensive incident reporting system with evidence, witnesses, and compliance tracking
 *
 * REFACTORED: Modular architecture with focused modules for maintainability
 * API PATH CORRECTED: /incident-reports/* → /incidents/*
 * Backend Alignment: /incidents/*
 *
 * @module services/modules/incidentsApi
 */

import { apiClient } from '../core/ApiClient.instance';
import { createIncidentsApi } from './incidentsApi/index';
import type { IIncidentsApi } from './incidentsApi/types';

// Re-export the singleton instance for backward compatibility
export const incidentsApi = createIncidentsApi(apiClient);

// Re-export factory function and types
export { createIncidentsApi } from './incidentsApi/index';
export type { IIncidentsApi } from './incidentsApi/types';

// Re-export all types for convenience
export type * from './incidentsApi/types';
