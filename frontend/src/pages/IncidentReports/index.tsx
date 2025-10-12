/**
 * Incident Reports Module Main Export
 *
 * Exports the main incident reports page component and all sub-components
 */

// Main page component (default export for routing)
export { default } from './index.main';

// Sub-components (named exports for sub-routes)
export { default as IncidentWitnesses } from './IncidentWitnesses';
export { default as IncidentActions } from './IncidentActions';
export { default as IncidentEvidence } from './IncidentEvidence';
export { default as IncidentTimeline } from './IncidentTimeline';
export { default as IncidentExport } from './IncidentExport';
