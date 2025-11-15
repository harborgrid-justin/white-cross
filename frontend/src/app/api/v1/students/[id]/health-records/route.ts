/**
 * Student health records API endpoints
 * Get health records for specific student
 */

import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/apiProxy';

/**
 * GET /api/students/:id/health-records
 * Get all health records for a student
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    console.log(`[Health Records API] Processing request for student ${id}`);
    console.log(`[Health Records API] Request URL: ${request.url}`);

    // Proxy request to backend with caching (match other student routes pattern)
    const response = await proxyToBackend(request, `/students/${id}/health-records`, {
      cache: {
        revalidate: 30,
        tags: [`student-${id}-health-records`, 'health-records']
      }
    });

    console.log(`[Health Records API] Backend response status: ${response.status}`);

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching student health records:', error);

    return NextResponse.json(
      { error: 'Failed to fetch health records' },
      { status: 500 }
    );
  }
}
