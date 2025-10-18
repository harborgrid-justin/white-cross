/**
 * LOC: 50183C85C1
 * WC-TYP-EXP-064 | express.d.ts - Express Framework Type Extensions
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-TYP-EXP-064 | express.d.ts - Express Framework Type Extensions
 * Purpose: TypeScript declaration augmentation for Express Request interface with authentication context
 * Upstream: @types/express | Dependencies: Express framework types, authentication middleware
 * Downstream: All ../routes/*.ts, ../middleware/auth-sequelize.ts | Called by: authenticated route handlers
 * Related: ../middleware/rbac.ts, ../services/authService.ts, ../types/hapi.ts
 * Exports: Express.Request user property extension | Key Services: Authentication type safety
 * Last Updated: 2025-10-18 | File Type: .d.ts | Pattern: Type Declaration
 * Critical Path: Authentication → User context → Request augmentation → Route access
 * LLM Context: Express type extensions for healthcare platform authentication, user context in requests, role-based access control integration
 */

// Express type extensions for authentication
declare namespace Express {
  export interface Request {
    user?: {
      userId: string;
      email: string;
      role: string;
    };
  }
}
