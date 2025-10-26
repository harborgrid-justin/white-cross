/**
 * Incidents Domain - Module Exports
 *
 * Centralized export module for the entire incidents domain, providing a clean
 * interface for accessing all incident management functionality including pages,
 * components, state management, and routing configuration.
 *
 * @module pages/incidents
 *
 * @remarks
 * Domain Architecture:
 * - **Pages**: Main incident list and detail pages
 * - **Components**: 90+ specialized components for incident workflows
 * - **Store**: Redux state management with async thunks
 * - **Routes**: Complete routing configuration with RBAC
 *
 * Feature Domains:
 * - Incident report CRUD operations
 * - Witness statement collection and management
 * - Follow-up action tracking with assignments
 * - Parent notification workflows
 * - Statistical analysis and reporting
 * - Document attachment and viewing
 * - Timeline and history tracking
 * - Export and print functionality
 *
 * Healthcare Context:
 * This module handles sensitive student health and safety incidents requiring:
 * - HIPAA compliance for PHI handling
 * - FERPA compliance for student records
 * - Audit logging for all access and modifications
 * - Secure parent communication
 * - Legal documentation requirements
 *
 * @example
 * ```typescript
 * // Import entire domain
 * import {
 *   IncidentReports,
 *   IncidentReportDetail,
 *   IncidentRoutes,
 *   fetchIncidentReports,
 *   createIncidentReport,
 *   selectCriticalIncidents
 * } from '@/pages/incidents';
 *
 * // Use in routing
 * <Route path="/incidents/*" element={<IncidentRoutes />} />
 *
 * // Use components and state management
 * const incidents = useSelector(selectCriticalIncidents);
 * dispatch(fetchIncidentReports({ severity: 'HIGH' }));
 * ```
 *
 * @see {@link module:pages/incidents/store} for state management
 * @see {@link module:pages/incidents/components} for UI components
 * @see {@link module:pages/incidents/routes} for routing configuration
 */

// Page Components
export { default as IncidentReports } from './IncidentReports';
export { default as IncidentReportDetail } from './IncidentReportDetail';

// Page-specific Components
export * from './components';

// Page-specific Store
export * from './store';

// Page Routes
export { IncidentRoutes } from './routes';
