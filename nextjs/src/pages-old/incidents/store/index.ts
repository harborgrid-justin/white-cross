/**
 * Incidents Page Store - Export Module
 *
 * Centralized re-export point for all incident-related Redux state management.
 * Provides a clean interface for consuming components to access incident state,
 * actions, and selectors without needing to know internal structure.
 *
 * @module pages/incidents/store
 *
 * @remarks
 * This barrel export simplifies imports throughout the application by providing
 * a single entry point for all incident store functionality including:
 * - Redux slice reducer
 * - Async thunk actions (CRUD operations)
 * - Synchronous actions (filters, UI state)
 * - Memoized selectors
 * - TypeScript type definitions
 *
 * HIPAA Compliance:
 * - All incident data handling includes audit logging
 * - PHI is never persisted to localStorage
 * - State is managed in secure session memory only
 *
 * @example
 * ```typescript
 * // Import everything from incidents store
 * import {
 *   fetchIncidentReports,
 *   createIncidentReport,
 *   selectIncidentReports,
 *   selectCriticalIncidents
 * } from '@/pages/incidents/store';
 *
 * // Use in components
 * const incidents = useSelector(selectIncidentReports);
 * dispatch(fetchIncidentReports({ severity: 'HIGH' }));
 * ```
 *
 * @see {@link module:pages/incidents/store/incidentReportsSlice} for full implementation
 */

export * from './incidentReportsSlice';
