/**
 * Emergency Contacts API Routes
 * Handles emergency contact operations for students
 *
 * @module app/api/students/[id]/emergency-contacts/route
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

/**
 * GET /api/students/[id]/emergency-contacts
 * Retrieve emergency contacts for a student
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const headersInstance = await headers();

    // Forward request to backend API
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/${id}/emergency-contacts`,
      {
        method: 'GET',
        headers: {
          'Authorization': headersInstance.get('Authorization') || '',
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to fetch emergency contacts' },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Emergency contacts API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/students/[id]/emergency-contacts
 * Create a new emergency contact for a student
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const headersInstance = await headers();
    const body = await request.json();

    // Forward request to backend API
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/${id}/emergency-contacts`,
      {
        method: 'POST',
        headers: {
          'Authorization': headersInstance.get('Authorization') || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to create emergency contact' },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Emergency contact creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}