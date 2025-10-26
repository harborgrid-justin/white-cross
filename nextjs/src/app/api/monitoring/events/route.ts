/**
 * Analytics Events API Endpoint
 *
 * Receives and processes client-side analytics events
 */

import { NextRequest, NextResponse } from 'next/server';
import type { AnalyticsEvent } from '@/monitoring/types';

export async function POST(request: NextRequest) {
  try {
    const { events, session } = await request.json();

    if (!Array.isArray(events)) {
      return NextResponse.json(
        { error: 'Invalid request: events must be an array' },
        { status: 400 }
      );
    }

    // Process events (send to analytics service)
    if (process.env.NODE_ENV === 'development') {
      console.log(`Received ${events.length} analytics events for session ${session.sessionId}`);
      events.forEach((event: AnalyticsEvent) => {
        console.log(`[ANALYTICS] ${event.category}: ${event.name}`, event.properties || '');
      });
    }

    // In production, send to analytics service like:
    // - Google Analytics
    // - Mixpanel
    // - Amplitude
    // - Your backend analytics endpoint

    // Example: Send to backend
    if (process.env.NEXT_PUBLIC_API_URL) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/monitoring/events`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ events, session }),
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
}
