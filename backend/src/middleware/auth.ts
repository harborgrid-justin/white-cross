/**
 * Authentication middleware
 * 
 * @deprecated This file is being migrated to shared utilities.
 * Import from '../shared/auth' instead for new code.
 */

// Re-export from shared auth utilities for backward compatibility
export { configureAuth, authMiddleware, AuthRequest } from '../shared/auth/jwt';
export { auth, requireRole, ExpressAuthRequest } from '../shared/auth/middleware';
