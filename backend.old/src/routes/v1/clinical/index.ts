/**
 * Clinical Operations Module Routes
 * Features 17 & 48: Clinic Visit Tracking and Drug Interaction Checking
 *
 * Module Overview:
 * - Clinic Visits: Complete check-in/out workflow with analytics (13 routes)
 * - Drug Interactions: FDA drug database with interaction checking (19 routes)
 *
 * Total Routes: 32
 *
 * Clinical Features:
 * - Real-time clinic visit tracking
 * - Visit frequency analytics
 * - Drug interaction checking with RxNorm integration
 * - Student allergy cross-reference
 * - Risk level calculation (NONE → CRITICAL)
 * - Controlled substance tracking
 */

import { ServerRoute } from '@hapi/hapi';
import clinicVisitRoutes from './clinic-visits';
import drugInteractionRoutes from './drug-interactions';

/**
 * All clinical operation routes
 */
export const clinicalRoutes: ServerRoute[] = [
  ...clinicVisitRoutes,        // 13 clinic visit routes
  ...drugInteractionRoutes,    // 19 drug interaction routes
];

/**
 * Route counts for tracking
 */
export const clinicalModuleStats = {
  totalRoutes: clinicalRoutes.length,
  clinicVisitRoutes: clinicVisitRoutes.length,
  drugInteractionRoutes: drugInteractionRoutes.length,
  module: 'Clinical Operations',
  version: 'v1',
  features: ['Clinic Visit Tracking', 'Drug Interaction Checking', 'RxNorm Integration'],
};
