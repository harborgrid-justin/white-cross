/**
 * Token verification endpoint
 * Validates JWT token and returns user information
 */

import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';

export async function GET(request: NextRequest) {
  try {
    // Proxy verification request to backend
    const response = await proxyToBackend(request, '/api/v1/auth/verify');

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Token verification error:', error);

    return NextResponse.json(
      { error: 'Verification failed', message: 'Invalid or expired token' },
      { status: 401 }
    );
  }
}

export const POST = GET;
