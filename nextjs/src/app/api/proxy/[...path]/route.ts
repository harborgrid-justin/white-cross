import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/constants/config';

// Use internal API URL for server-side requests in Docker
const API_BASE_URL = API_CONFIG.INTERNAL_API_URL.replace('/api/v1', '');

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return proxyRequest(request, resolvedParams);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return proxyRequest(request, resolvedParams);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return proxyRequest(request, resolvedParams);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return proxyRequest(request, resolvedParams);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return proxyRequest(request, resolvedParams);
}

async function proxyRequest(
  request: NextRequest,
  { path }: { path: string[] }
) {
  try {
    const backendPath = path.join('/');
    const searchParams = request.nextUrl.searchParams.toString();
    const backendUrl = `${API_BASE_URL}/api/v1/${backendPath}${
      searchParams ? `?${searchParams}` : ''
    }`;

    // Get the request body if it exists
    let body: string | undefined;
    if (request.method !== 'GET' && request.method !== 'DELETE') {
      try {
        body = await request.text();
      } catch (error) {
        // Body might not exist or be readable
      }
    }

    // Forward headers from the original request
    const headers: Record<string, string> = {};
    
    // Copy relevant headers
    request.headers.forEach((value, key) => {
      if (
        key.toLowerCase() !== 'host' &&
        key.toLowerCase() !== 'content-length' &&
        !key.toLowerCase().startsWith('x-forwarded') &&
        !key.toLowerCase().startsWith('x-real-ip')
      ) {
        headers[key] = value;
      }
    });

    // Set content-type if we have a body
    if (body && !headers['content-type']) {
      headers['content-type'] = 'application/json';
    }

    console.log(`Proxying ${request.method} request to:`, backendUrl);

    const response = await fetch(backendUrl, {
      method: request.method,
      headers,
      body,
    });

    // Get response body
    const responseBody = await response.text();
    
    // Create response headers
    const responseHeaders = new Headers();
    
    // Copy response headers from backend
    response.headers.forEach((value, key) => {
      // Skip certain headers that Next.js should handle
      if (
        !key.toLowerCase().startsWith('x-powered-by') &&
        key.toLowerCase() !== 'server' &&
        key.toLowerCase() !== 'date'
      ) {
        responseHeaders.set(key, value);
      }
    });

    // Add CORS headers for development
    if (process.env.NODE_ENV === 'development') {
      responseHeaders.set('Access-Control-Allow-Origin', '*');
      responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    return new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    
    return new NextResponse(
      JSON.stringify({
        error: 'Proxy error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}