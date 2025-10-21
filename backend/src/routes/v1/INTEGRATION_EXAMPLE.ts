/**
 * INTEGRATION EXAMPLE
 *
 * This file shows how to integrate the new v1 routes into the main server index.ts
 * DO NOT RUN THIS FILE - it's documentation only
 */

// ============================================================================
// STEP 1: Import v1 routes in your main index.ts
// ============================================================================

import { v1Routes } from './routes/v1';

// ============================================================================
// STEP 2: Register v1 routes alongside existing routes (PARALLEL RUN)
// ============================================================================

// Register existing routes (unchanged)
server.route([
  ...authRoutes,           // OLD: /api/auth/*
  ...studentRoutes,         // OLD: /api/students/*
  ...medicationRoutes,      // OLD: /api/medications/*
  // ... all other existing routes
]);

// Register NEW v1 routes
server.route(v1Routes);   // NEW: /api/v1/*

// ============================================================================
// RESULT: Both old and new routes work simultaneously
// ============================================================================

// Old routes still work:
// POST /api/auth/login         ✅ Works
// GET  /api/students           ✅ Works

// New routes also work:
// POST /api/v1/auth/login      ✅ Works (new implementation)
// GET  /api/v1/students        ✅ Works (when migrated)

// ============================================================================
// STEP 3: Frontend Migration (Gradual)
// ============================================================================

// Update frontend API client to use v1:
/*
// OLD
const response = await axios.post('/api/auth/login', { email, password });

// NEW
const response = await axios.post('/api/v1/auth/login', { email, password });
*/

// ============================================================================
// STEP 4: After 100% migration, remove old routes
// ============================================================================

// BEFORE (during migration):
server.route([
  ...authRoutes,           // OLD - remove when v1 complete
  ...studentRoutes,         // OLD - remove when v1 complete
  ...v1Routes               // NEW - keep
]);

// AFTER (migration complete):
server.route(v1Routes);    // Only v1 routes

// ============================================================================
// MONITORING & METRICS
// ============================================================================

// Track usage of old vs new routes
server.events.on('response', (request) => {
  const isV1 = request.path.includes('/api/v1/');
  const isOld = request.path.includes('/api/') && !isV1;

  if (isOld) {
    console.warn(`Legacy route accessed: ${request.path}`);
    // Optionally add deprecation header
    // request.response.header('Warning', '299 - "API version deprecated. Please migrate to /api/v1/"');
  }
});

// ============================================================================
// ROLLBACK PLAN
// ============================================================================

// If issues occur with v1 routes, simply comment them out:
// server.route(v1Routes);  // Commented = disabled

// Old routes continue to work unaffected

export {};
