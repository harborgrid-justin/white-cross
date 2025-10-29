/**
 * API proxy utilities for forwarding requests to Hapi.js backend
 * Handles request transformation, authentication, and error handling
 */

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

/**
 * Proxy configuration
 */
export interface ProxyConfig {
  /** Whether to forward authentication headers */
  forwardAuth?: boolean;
  /** Custom headers to add */
  headers?: Record<string, string>;
  /** Cache configuration for Next.js */
  cache?: {
    revalidate?: number;
    tags?: string[];
  };
  /** Timeout in milliseconds */
  timeout?: number;
}

/**
 * Proxy request to backend
 *
 * Returns standard Response type for maximum compatibility with route handlers
 */
export async function proxyToBackend(
  request: NextRequest,
  path: string,
  config: ProxyConfig = {}
): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const backendUrl = `${BACKEND_URL}${path}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers
    };

    // Forward authentication if enabled
    if (config.forwardAuth !== false) {
      const authHeader = request.headers.get('authorization');
      if (authHeader) {
        headers['Authorization'] = authHeader;
      }
    }

    // Copy relevant headers
    const relevantHeaders = ['user-agent', 'x-real-ip', 'x-forwarded-for'];
    relevantHeaders.forEach(header => {
      const value = request.headers.get(header);
      if (value) {
        headers[header] = value;
      }
    });

    // Get request body for POST/PUT/PATCH
    let body: string | undefined;
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      try {
        body = await request.text();
      } catch (error) {
        // Body might not exist
      }
    }

    // Make request to backend with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout || 30000);

    const response = await fetch(backendUrl, {
      method: request.method,
      headers,
      body,
      signal: controller.signal,
      ...(config.cache && {
        next: {
          revalidate: config.cache.revalidate,
          tags: config.cache.tags
        }
      })
    });

    clearTimeout(timeoutId);

    // Get response body
    const responseBody = await response.text();

    // Create response headers
    const responseHeaders = new Headers();

    // Copy relevant response headers
    ['content-type', 'cache-control', 'etag', 'last-modified'].forEach(header => {
      const value = response.headers.get(header);
      if (value) {
        responseHeaders.set(header, value);
      }
    });

    return new Response(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders
    });
  } catch (error) {
    console.error('Backend proxy error:', error);

    if (error instanceof Error && error.name === 'AbortError') {
      return new Response(
        JSON.stringify({ error: 'Request timeout' }),
        {
          status: 504,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({
        error: 'Backend service unavailable',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

/**
 * Create a simple proxy handler
 */
export function createProxyHandler(
  basePath: string,
  config?: ProxyConfig
) {
  return async (request: NextRequest, context: { params: any }) => {
    const path = `${basePath}/${context.params?.path?.join('/') || ''}`;
    return proxyToBackend(request, path, config);
  };
}
