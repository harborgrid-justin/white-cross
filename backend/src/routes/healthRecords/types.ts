/**
 * LOC: 7C22A5A149
 * WC-RTE-HLT-001 | types.ts - Health Records Type Definitions and Interfaces
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - allergies.ts (routes/healthRecords/handlers/allergies.ts)
 *   - chronicConditions.ts (routes/healthRecords/handlers/chronicConditions.ts)
 *   - growthMeasurements.ts (routes/healthRecords/handlers/growthMeasurements.ts)
 *   - mainHealthRecords.ts (routes/healthRecords/handlers/mainHealthRecords.ts)
 *   - screenings.ts (routes/healthRecords/handlers/screenings.ts)
 *   - ... and 3 more
 */

/**
 * WC-RTE-HLT-001 | types.ts - Health Records Type Definitions and Interfaces
 * Purpose: Centralized type definitions for health records API requests/responses, authentication, and payloads
 * Upstream: @hapi/hapi | Dependencies: TypeScript type system
 * Downstream: All healthRecords/* modules | Called by: routes/healthRecords/*, middleware/auth
 * Related: ../../services/healthRecordService, ../../database/models, ../../types/express.d.ts
 * Exports: AuthCredentials, PayloadData, HealthRecordRequest, AllergyRequest, VaccinationRequest interfaces
 * Last Updated: 2025-10-18 | File Type: .ts - Type Definitions Only (No Runtime Code)
 * Critical Path: Interface definition → Type checking → Compile-time validation → Runtime type safety
 * LLM Context: Core type system for health records routes - defines all request/response shapes, auth context, and payload structures
 */

// Type definitions for authenticated requests
export interface AuthCredentials {
  userId: string;
  role: string;
  schoolId?: string;
}

export interface PayloadData {
  [key: string]: any;
}
