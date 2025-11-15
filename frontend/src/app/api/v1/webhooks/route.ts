/**
 * Webhooks API endpoints
 * Handle incoming webhooks from external services
 */

import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';

/**
 * GET /api/webhooks
 * Get webhook configuration or history
 */
export const GET = async (request: NextRequest) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/webhooks');

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching webhooks:', error);

    return NextResponse.json(
      { error: 'Failed to fetch webhooks' },
      { status: 500 }
    );
  }
};

/**
 * POST /api/webhooks
 * Handle incoming webhook from external service
 */
export const POST = async (request: NextRequest) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/webhooks');

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error processing webhook:', error);

    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
};