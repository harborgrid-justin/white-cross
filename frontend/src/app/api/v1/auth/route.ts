/**
 * Auth API endpoints
 * Authentication, login, logout, password management
 */

import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';

/**
 * GET /api/auth
 * Get authentication status or user profile
 */
export const GET = async (request: NextRequest) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/auth');

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching auth data:', error);

    return NextResponse.json(
      { error: 'Failed to fetch auth data' },
      { status: 500 }
    );
  }
};

/**
 * POST /api/auth
 * Perform authentication action (login, register, etc.)
 */
export const POST = async (request: NextRequest) => {
  try {
    // Proxy request to backend
    const response = await proxyToBackend(request, '/auth');

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error performing auth action:', error);

    return NextResponse.json(
      { error: 'Failed to perform auth action' },
      { status: 500 }
    );
  }
};