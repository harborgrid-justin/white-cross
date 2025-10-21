/**
 * WF-IDX-209 | index.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: named exports | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

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

