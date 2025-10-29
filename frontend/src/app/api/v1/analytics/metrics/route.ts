/**
 * Analytics Metrics API endpoints
 * Retrieve health metrics and analytics data
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';

/**
 * GET /api/v1/analytics/metrics
 * Get analytics metrics
 */
export const GET = withAuth(async (request: NextRequest, context, auth) => {
  try {
    const response = await proxyToBackend(request, '/api/v1/analytics/metrics', {
      cache: {
        revalidate: 300, // Cache for 5 minutes
        tags: ['analytics-metrics']
      }
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching analytics metrics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics metrics' }, { status: 500 });
  }
});
