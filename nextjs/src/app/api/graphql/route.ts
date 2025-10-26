/**
 * GraphQL API endpoint
 * Proxies GraphQL requests to Hapi.js backend with authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '../middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';

/**
 * POST /api/graphql
 * Execute GraphQL query or mutation
 */
export const POST = withAuth(async (request: NextRequest, context, auth) => {
  try {
    // Proxy GraphQL request to backend
    const response = await proxyToBackend(request, '/graphql', {
      forwardAuth: true,
      timeout: 60000 // 60 second timeout for complex queries
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('GraphQL proxy error:', error);

    return NextResponse.json(
      {
        errors: [
          {
            message: 'GraphQL request failed',
            extensions: {
              code: 'INTERNAL_SERVER_ERROR'
            }
          }
        ]
      },
      { status: 500 }
    );
  }
});

/**
 * GET /api/graphql
 * GraphQL introspection queries (development only)
 */
export const GET = withAuth(async (request: NextRequest, context, auth) => {
  // Only allow GET in development for GraphQL Playground
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      {
        errors: [
          {
            message: 'GET requests not supported in production',
            extensions: {
              code: 'METHOD_NOT_ALLOWED'
            }
          }
        ]
      },
      { status: 405 }
    );
  }

  try {
    // Proxy GraphQL request to backend
    const response = await proxyToBackend(request, '/graphql', {
      forwardAuth: true
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('GraphQL proxy error:', error);

    return NextResponse.json(
      {
        errors: [
          {
            message: 'GraphQL request failed',
            extensions: {
              code: 'INTERNAL_SERVER_ERROR'
            }
          }
        ]
      },
      { status: 500 }
    );
  }
});

/**
 * OPTIONS /api/graphql
 * CORS preflight for GraphQL
 */
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
}
