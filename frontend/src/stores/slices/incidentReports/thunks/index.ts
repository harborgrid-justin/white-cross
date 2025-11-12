/**
 * Incident Reports Store - Thunks Index
 *
 * Re-exports all async thunks from modular files
 *
 * @module stores/slices/incidentReports/thunks
 */

// Report CRUD operations
export {
  fetchIncidentReports,
  fetchIncidentReportById,
  createIncidentReport,
  updateIncidentReport,
  deleteIncidentReport,
  searchIncidentReports,
} from './reportThunks';

// Witness statement operations
export {
  fetchWitnessStatements,
  createWitnessStatement,
} from './witnessThunks';

// Follow-up action operations
export {
  fetchFollowUpActions,
  createFollowUpAction,
} from './followUpThunks';
