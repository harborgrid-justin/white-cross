/**
 * Healthcare Module Routes
 * Aggregates all healthcare module routes (medications, health records, etc.)
 */

import { ServerRoute } from '@hapi/hapi';
import { medicationsRoutes } from './routes/medications.routes';
import { healthRecordsRoutes } from './routes/healthRecords.routes';
import { healthAssessmentsRoutes } from './routes/healthAssessments.routes';

/**
 * All healthcare module routes
 *
 * Currently includes:
 * - Medications (17 endpoints) - Complete
 * - Health Records (27 endpoints) - Complete (general, allergies, conditions, vaccinations, vitals, summaries)
 * - Health Assessments (11 endpoints) - Complete (risk assessment, screenings, growth, immunizations, emergency notifications)
 *
 * Migrated from enhancedFeatures.ts:
 * - Health Risk Assessment (2 routes)
 * - Health Screenings (2 routes)
 * - Growth Tracking (2 routes)
 * - Immunization Forecast (1 route)
 * - Emergency Notifications (2 routes)
 * - Extended Medication Interactions (2 routes)
 */
export const healthcareRoutes: ServerRoute[] = [
  ...medicationsRoutes,
  ...healthRecordsRoutes,
  ...healthAssessmentsRoutes
];
