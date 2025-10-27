/**
 * Analytics Events API Endpoint
 *
 * Receives and processes client-side analytics events
 * Protected with optional auth and rate limiting
 */

import { NextRequest, NextResponse } from 'next/server';
import { withOptionalAuth } from '@/app/api/middleware/withAuth';
import type { AnalyticsEvent } from '@/monitoring/types';

// In-memory rate limiting for analytics endpoint
// In production, use Redis or a proper rate limiting service
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

/**
 * Simple rate limiting for analytics endpoint
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
