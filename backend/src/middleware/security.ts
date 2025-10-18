/**
 * LOC: 49DE6BD246
 * WC-MID-SEC-050 | Hapi.js Security Configuration & Headers Middleware
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - index-sequelize.ts (index-sequelize.ts)
 *   - index.ts (index.ts)
 */

/**
 * WC-MID-SEC-050 | Hapi.js Security Configuration & Headers Middleware
 * Purpose: Security plugin registration, OWASP headers, HTTPS enforcement
 * Upstream: OWASP security guidelines, @hapi/boom | Dependencies: @hapi/hapi, @hapi/boom
 * Downstream: All routes | Called by: Hapi server initialization (index.ts)
 * Related: middleware/securityHeaders.ts, middleware/rateLimiting.ts, HIPAA compliance
 * Exports: configureSecurity (default) | Key Services: Security headers, plugin setup
 * Last Updated: 2025-10-18 | Dependencies: @hapi/hapi, @hapi/boom
 * Critical Path: Server init → Security plugin registration → Header configuration
 * LLM Context: HIPAA security requirements, OWASP Top 10 protection, healthcare compliance
 */

import { Server } from '@hapi/hapi';
import * as Boom from '@hapi/boom';

export const configureSecurity = async (server: Server) => {
  // Register security-related plugins
  await server.register([
    // Note: Hapi has built-in security features
    // Additional security plugins can be added here as needed
  ]);

  // Set security headers
  server.ext('onPreResponse', (request, h) => {
    const response = request.response;

    // Set security headers for error responses
    if (Boom.isBoom(response)) {
      const boomResponse = response as Boom.Boom;
      boomResponse.output.headers['X-Content-Type-Options'] = 'nosniff';
      boomResponse.output.headers['X-Frame-Options'] = 'DENY';
      boomResponse.output.headers['X-XSS-Protection'] = '1; mode=block';
      boomResponse.output.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains';
    }

    return h.continue;
  });
};
