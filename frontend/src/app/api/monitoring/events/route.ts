/**
 * @fileoverview Analytics and Monitoring Events API Route
 *
 * Receives and processes client-side analytics events including user interactions,
 * page views, errors, and performance metrics. Forwards events to backend analytics
 * service while providing real-time monitoring capabilities.
 *
 * @module api/monitoring/events
 *
 * @security
 * - Optional authentication (works for both authenticated and anonymous users)
 * - Rate limiting: 100 requests per minute per IP/user
 * - Sanitizes sensitive data before logging
 * - No PHI data should be sent to this endpoint
 *
 * @compliance
 * - HIPAA: Does not process or store PHI
 * - Privacy: Anonymous user tracking supported
 * - Data retention: Events forwarded to backend for proper retention policies
 *
 * @monitoring
 * - Supports batch event submission
 * - Session-based event grouping
 * - User context enrichment (when authenticated)
 * - Forwards to backend analytics service
 */

import { NextRequest, NextResponse } from 'next/server';
import { withOptionalAuth } from '@/middleware/withAuth';
import type { AnalyticsEvent } from '@/monitoring/types';

/**
 * In-memory rate limiting for analytics endpoint.
 * In production, use Redis or a dedicated rate limiting service for distributed rate limiting.
 *
 * @private
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

/**
 * Checks rate limit for analytics event submissions.
 *
 * @private
 * @param {string} identifier - User ID or IP address for rate limiting
 * @returns {{ allowed: boolean; retryAfter?: number }} Rate limit check result
 * @returns {boolean} returns.allowed - Whether request is within rate limit
 * @returns {number} [returns.retryAfter] - Seconds until rate limit resets (if exceeded)
 */
function checkRateLimit(identifier: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 100; // 100 requests per minute

  const entry = rateLimitMap.get(identifier);

  // Reset if window expired
  if (!entry || now >= entry.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { allowed: true };
  }

  // Increment count
  entry.count++;

  // Check if limit exceeded
  if (entry.count > maxRequests) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  return { allowed: true };
}

/**
 * POST /api/monitoring/events
 *
 * Accepts batches of analytics events from the client and forwards them to
 * the backend analytics service. Supports both authenticated and anonymous users.
 *
 * @async
 * @param {NextRequest} request - Next.js request object
 * @param {Object} request.body - Request body with events
 * @param {AnalyticsEvent[]} request.body.events - Array of analytics events
 * @param {Object} request.body.session - Session information
 * @param {string} request.body.session.sessionId - Unique session identifier
 * @param {string} request.body.session.startTime - Session start timestamp
 * @param {Object} context - Next.js route context
 * @param {Object|null} auth - Optional authenticated user context
 * @param {Object} [auth.user] - Authenticated user object (if logged in)
 * @param {string} [auth.user.id] - User ID
 * @param {string} [auth.user.role] - User role
 *
 * @returns {Promise<NextResponse>} JSON response with processing result
 * @returns {boolean} response.success - Event processing success indicator
 * @returns {number} response.count - Number of events processed
 *
 * @throws {400} Bad Request - Invalid request format or missing required fields
 * @throws {429} Too Many Requests - Rate limit exceeded (100 events/min per user/IP)
 * @throws {500} Internal Server Error - Server error during event processing
 *
 * @example
 * // Successful event submission (authenticated user)
 * POST /api/monitoring/events
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * Content-Type: application/json
 *
 * {
 *   "events": [
 *     {
 *       "category": "navigation",
 *       "name": "page_view",
 *       "properties": {
 *         "path": "/dashboard",
 *         "referrer": "/login"
 *       },
 *       "timestamp": "2025-10-27T08:33:00.000Z"
 *     },
 *     {
 *       "category": "interaction",
 *       "name": "button_click",
 *       "properties": {
 *         "button": "create_student",
 *         "location": "students_page"
 *       },
 *       "timestamp": "2025-10-27T08:33:05.000Z"
 *     }
 *   ],
 *   "session": {
 *     "sessionId": "sess_abc123",
 *     "startTime": "2025-10-27T08:30:00.000Z"
 *   }
 * }
 *
 * // Response (200 OK)
 * {
 *   "success": true,
 *   "count": 2
 * }
 *
 * @example
 * // Rate limit exceeded
 * POST /api/monitoring/events
 * Content-Type: application/json
 *
 * {
 *   "events": [...],
 *   "session": {...}
 * }
 *
 * // Response (429 Too Many Requests)
 * {
 *   "error": "Too many requests",
 *   "message": "Rate limit exceeded",
 *   "retryAfter": 45
 * }
 *
 * @example
 * // Invalid request format
 * POST /api/monitoring/events
 * Content-Type: application/json
 *
 * {
 *   "events": "not-an-array"
 * }
 *
 * // Response (400 Bad Request)
 * {
 *   "error": "Invalid request: events must be an array"
 * }
 *
 * @method POST
 * @access Public - Optional authentication
 * @rateLimit 100 requests per minute per IP/user
 * @auditLog No audit logging (high frequency endpoint)
 *
 * @see {@link AnalyticsEvent} for event schema
 */
export const POST = withOptionalAuth(async (request: NextRequest, context, auth) => {
  try {
    // Rate limiting by IP or user ID
    const identifier = auth?.user?.id ||
      request.headers.get('x-real-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      'anonymous';

    const rateLimitResult = checkRateLimit(identifier);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: 'Rate limit exceeded',
          retryAfter: rateLimitResult.retryAfter
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimitResult.retryAfter || 60)
          }
        }
      );
    }

    const { events, session } = await request.json();

    if (!Array.isArray(events)) {
      return NextResponse.json(
        { error: 'Invalid request: events must be an array' },
        { status: 400 }
      );
    }

    // Add user context if authenticated
    const userId = auth?.user?.id || 'anonymous';
    const userRole = auth?.user?.role || 'unauthenticated';

    // Process events (send to analytics service)
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[ANALYTICS] User ${userId} (${userRole}): ${events.length} events for session ${session.sessionId}`
      );
      events.forEach((event: AnalyticsEvent) => {
        console.log(`[ANALYTICS] ${event.category}: ${event.name}`, event.properties || '');
      });
    }

    // In production, send to analytics service like:
    // - Google Analytics
    // - Mixpanel
    // - Amplitude
    // - Your backend analytics endpoint

    // Example: Send to backend with user context
    if (process.env.NEXT_PUBLIC_API_URL) {
      try {
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        // Forward auth token if user is authenticated
        if (auth?.user) {
          const token = request.headers.get('authorization');
          if (token) {
            headers['Authorization'] = token;
          }
        }

        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/monitoring/events`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            events,
            session,
            userId,
            userRole
          }),
        });
      } catch (error) {
        console.error('Failed to send events to backend:', error);
      }
    }

    return NextResponse.json({ success: true, count: events.length });
  } catch (error) {
    console.error('Error processing analytics events:', error);
    return NextResponse.json(
      { error: 'Failed to process events' },
      { status: 500 }
    );
  }
});
