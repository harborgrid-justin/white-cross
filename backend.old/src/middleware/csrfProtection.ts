/**
 * @fileoverview CSRF Protection Middleware
 * @module middleware/csrfProtection
 * @description Express middleware for CSRF token validation on state-changing requests.
 * Protects against Cross-Site Request Forgery attacks.
 *
 * SECURITY: CSRF attack prevention
 * SECURITY: Token validation for POST/PUT/DELETE/PATCH requests
 *
 * @security CSRF protection middleware
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { ValidationError } from '../errors/ServiceError';
import {
  generateCSRFToken,
  validateCSRFToken,
  getCSRFTokenFromRequest,
  getCSRFConfig
} from '../utils/csrfUtils';

/**
 * HTTP methods that require CSRF protection
 */
const CSRF_PROTECTED_METHODS = new Set(['POST', 'PUT', 'DELETE', 'PATCH']);

/**
 * Paths that should skip CSRF validation (e.g., API endpoints with other auth)
 */
const CSRF_SKIP_PATHS = new Set([
  '/api/auth/login', // Login uses different protection (rate limiting)
  '/api/auth/logout',
  '/api/webhook', // Webhooks use signature validation instead
  '/api/public' // Public API endpoints
]);

/**
 * CSRF Protection Middleware
 *
 * For GET/HEAD/OPTIONS requests: Generates and attaches CSRF token to response
 * For POST/PUT/DELETE/PATCH requests: Validates CSRF token
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 *
 * @example
 * // Apply to all routes
 * app.use(csrfProtection);
 *
 * // Or apply to specific routes
 * app.post('/api/data', csrfProtection, dataHandler);
 */
export function csrfProtection(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const method = req.method.toUpperCase();

    // Skip CSRF for certain paths
    if (shouldSkipCSRF(req.path)) {
      return next();
    }

    // GET/HEAD/OPTIONS: Generate and send token
    if (!CSRF_PROTECTED_METHODS.has(method)) {
      handleSafeMethod(req, res);
      return next();
    }

    // POST/PUT/DELETE/PATCH: Validate token
    handleUnsafeMethod(req, res);
    next();
  } catch (error) {
    if (error instanceof ValidationError) {
      logger.warn('[CSRF] Validation failed', {
        path: req.path,
        method: req.method,
        ip: req.ip,
        user: (req as any).user?.id,
        error: error.message
      });

      res.status(403).json({
        error: 'CSRF validation failed',
        code: 'CSRF_ERROR',
        message: error.message
      });
    } else {
      logger.error('[CSRF] Unexpected error', { error });
      next(error);
    }
  }
}

/**
 * Check if path should skip CSRF validation
 *
 * @param path - Request path
 * @returns True if should skip CSRF
 * @private
 */
function shouldSkipCSRF(path: string): boolean {
  // Check exact matches
  if (CSRF_SKIP_PATHS.has(path)) {
    return true;
  }

  // Check path prefixes
  for (const skipPath of CSRF_SKIP_PATHS) {
    if (path.startsWith(skipPath)) {
      return true;
    }
  }

  return false;
}

/**
 * Handle safe HTTP methods (GET, HEAD, OPTIONS)
 * Generate CSRF token and attach to response
 *
 * @param req - Express request object
 * @param res - Express response object
 * @private
 */
function handleSafeMethod(req: Request, res: Response): void {
  const user = (req as any).user;

  // Only generate token for authenticated users
  if (!user || !user.id) {
    return;
  }

  const userId = user.id;
  const sessionId = (req as any).session?.id || 'no-session';

  // Generate CSRF token
  const csrfToken = generateCSRFToken(userId, sessionId);

  // Attach token to response
  const config = getCSRFConfig();

  // Set as cookie (HttpOnly, SameSite for security)
  res.cookie(config.cookieName, csrfToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict',
    maxAge: config.tokenLifetimeMs
  });

  // Also set as response header for SPA convenience
  res.setHeader(config.headerName, csrfToken);

  // Make token available to templates
  (res as any).locals.csrfToken = csrfToken;
}

/**
 * Handle unsafe HTTP methods (POST, PUT, DELETE, PATCH)
 * Validate CSRF token from request
 *
 * @param req - Express request object
 * @param res - Express response object
 * @throws {ValidationError} If CSRF token is invalid
 * @private
 */
function handleUnsafeMethod(req: Request, res: Response): void {
  const user = (req as any).user;

  // Require authentication for CSRF-protected operations
  if (!user || !user.id) {
    throw new ValidationError('Authentication required for this operation');
  }

  const userId = user.id;
  const sessionId = (req as any).session?.id || 'no-session';

  // Get CSRF token from request
  const token = getCSRFTokenFromRequest(req);

  if (!token) {
    throw new ValidationError('CSRF token required. Please include X-CSRF-Token header or _csrf form field.');
  }

  // Validate token
  validateCSRFToken(token, userId, sessionId);

  // Token is valid - proceed with request
  logger.debug('[CSRF] Token validated successfully', {
    userId,
    path: req.path,
    method: req.method
  });
}

/**
 * Create CSRF protection middleware with custom options
 *
 * @param options - Middleware options
 * @returns Configured CSRF middleware
 *
 * @example
 * const csrf = createCSRFProtection({ skipPaths: ['/api/custom'] });
 * app.use(csrf);
 */
export function createCSRFProtection(options: {
  skipPaths?: string[];
  requireAuth?: boolean;
} = {}): (req: Request, res: Response, next: NextFunction) => void {
  const { skipPaths = [], requireAuth = true } = options;

  // Add custom skip paths to global set
  skipPaths.forEach(path => CSRF_SKIP_PATHS.add(path));

  return (req: Request, res: Response, next: NextFunction) => {
    if (requireAuth && !(req as any).user) {
      logger.warn('[CSRF] Unauthenticated request to CSRF-protected endpoint', {
        path: req.path,
        method: req.method,
        ip: req.ip
      });
      return res.status(401).json({
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    csrfProtection(req, res, next);
  };
}

/**
 * Export CSRF middleware
 */
export default csrfProtection;
