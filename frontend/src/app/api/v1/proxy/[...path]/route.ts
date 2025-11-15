import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/constants/config';

// Use internal API URL for server-side requests in Docker
const API_BASE_URL = API_CONFIG.INTERNAL_API_URL;

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
    // Ensure path is properly handled - path should be an array of strings
    const backendPath = Array.isArray(path) && path.length > 0 ? path.join('/') : '';
    const searchParams = request.nextUrl.searchParams.toString();
    
    // Construct backend URL with proper path handling
    const backendUrl = backendPath 
      ? `${API_BASE_URL}/${backendPath}${searchParams ? `?${searchParams}` : ''}`
      : `${API_BASE_URL}${searchParams ? `?${searchParams}` : ''}`;

    // Streamlined body handling
    const body = (request.method !== 'GET' && request.method !== 'DELETE') 
      ? await request.text().catch(() => undefined)
      : undefined;

    // Minimal header forwarding - only essential headers
    const headers: HeadersInit = {
      'content-type': request.headers.get('content-type') || 'application/json',
      ...(request.headers.get('authorization') && { 
        'authorization': request.headers.get('authorization')! 
      }),
    };

    // Direct fetch with minimal processing
    const response = await fetch(backendUrl, {
      method: request.method,
      headers,
      body,
    });

    // Stream response directly without text conversion for better performance
    const responseHeaders = new Headers();
    
    // Copy only essential headers
    const contentType = response.headers.get('content-type');
    if (contentType) responseHeaders.set('content-type', contentType);
    
    // Essential CORS headers for development
    if (process.env.NODE_ENV === 'development') {
      responseHeaders.set('Access-Control-Allow-Origin', '*');
      responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    // Return response body as stream for better performance
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    // Minimal error response
    return new NextResponse(
      JSON.stringify({ error: 'Proxy error', message: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
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
