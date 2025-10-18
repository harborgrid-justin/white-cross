/**
 * LOC: FFA8084CE0
 * WC-MID-AUTH-011 | Authentication Middleware
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (index.ts)
 *   - accessControl.ts (routes/accessControl.ts)
 *   - administration.ts (routes/administration.ts)
 *   - audit.ts (routes/audit.ts)
 *   - compliance.ts (routes/compliance.ts)
 *   - ... and 4 more
 */

/**
 * WC-MID-AUTH-011 | Authentication Middleware
 * Purpose: JWT token validation, user authentication, and session management
 * Upstream: shared/auth/jwt, database/models/User | Dependencies: @hapi/hapi, jsonwebtoken
 * Downstream: All protected routes | Called by: Hapi.js route authentication
 * Related: jwt.ts, userService.ts, rbac.ts, securityHeaders.ts
 * Exports: configureAuth function | Key Services: JWT validation, user loading, session management
 * Last Updated: 2025-10-17 | Dependencies: @hapi/hapi, jsonwebtoken, bcrypt
 * Critical Path: Token extraction → JWT verification → User loading → Role assignment
 * LLM Context: HIPAA-compliant authentication, role-based access control, audit logging
 */

/**
 * Authentication middleware
 * 
 * @deprecated This file is being migrated to shared utilities.
 * Import from '../shared/auth' instead for new code.
 */

// Re-export from shared auth utilities for backward compatibility
export { configureAuth, authMiddleware, AuthRequest } from '../shared/auth/jwt';
export { auth, requireRole, ExpressAuthRequest } from '../shared/auth/middleware';
