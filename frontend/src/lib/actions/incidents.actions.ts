/**
 * Incident Actions
 * Main entry point for comprehensive incident management
 * This file re-exports all incident-related functions from specialized modules
 *
 * NOTE: This barrel file does NOT have 'use server' directive.
 * The 'use server' directive is present in implementation files that define
 * actual Server Actions. Barrel files cannot have 'use server' when re-exporting.
 */

// ==========================================
// CONSTANTS
// ==========================================

export { API_BASE } from './incidents.constants';

// ==========================================
// TYPE EXPORTS
// ==========================================

export type {
  IncidentReport,
  IncidentsResponse,
  IncidentAnalytics,
  FollowUpAction,
  FollowUpStatistics,
  WitnessStatement,
  SeverityTrend
} from './incidents.types';

// ==========================================
// CRUD OPERATIONS
// ==========================================

export {
  getIncidents,
  getIncident,
  createIncident,
  updateIncident,
  deleteIncident,
  getIncidentsRequiringFollowUp,
  getStudentRecentIncidents,
  listIncidents
} from './incidents.crud';

// ==========================================
// FOLLOW-UP ACTIONS
// ==========================================

export {
  getFollowUpActions,
  addFollowUpAction,
  updateFollowUpAction,
  deleteFollowUpAction,
  getOverdueActions,
  getUrgentActions,
  getUserPendingActions,
  getFollowUpStatistics,
  addFollowUpNotes,
  createFollowUpAction,
  listFollowUpActions
} from './incidents.followup';

// ==========================================
// WITNESS STATEMENTS
// ==========================================

export {
  getWitnessStatements,
  addWitnessStatement,
  updateWitnessStatement,
  deleteWitnessStatement,
  verifyWitnessStatement,
  getUnverifiedStatements,
  submitWitnessStatement
} from './incidents.witnesses';

// ==========================================
// INCIDENT OPERATIONS
// ==========================================

export {
  markParentNotified,
  addEvidence,
  updateInsuranceClaim,
  updateComplianceStatus,
  notifyEmergencyContacts,
  notifyParent
} from './incidents.operations';

// ==========================================
// ANALYTICS & STATISTICS
// ==========================================

export {
  getIncidentAnalytics,
  getIncidentsByType,
  getIncidentsBySeverity,
  getSeverityTrends,
  getTrendingIncidents
} from './incidents.analytics';
