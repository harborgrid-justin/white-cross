/**
 * Next.js Instrumentation
 *
 * This file is loaded once when the server starts.
 * Use it to initialize monitoring, tracing, and other instrumentation.
 */

import { initSentry } from './src/lib/monitoring/sentry';

/**
 * Register server instrumentation
 * Runs on server startup
 */
export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Initialize Sentry for error tracking
    initSentry();

    console.log('Server instrumentation initialized');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Initialize edge runtime instrumentation
    initSentry();

    console.log('Edge runtime instrumentation initialized');
  }
}

/**
 * Optional: Handler called on startup
 */
export async function onRequestError(
  error: Error,
  request: {
    path: string;
    method: string;
    headers: Record<string, string>;
  }
) {
  // Log error details
  console.error('Request error:', {
    error: error.message,
    path: request.path,
    method: request.method,
  });

  // Additional error handling can be added here
}

