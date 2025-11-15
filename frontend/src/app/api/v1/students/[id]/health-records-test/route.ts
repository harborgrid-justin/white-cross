/**
 * Simple test for student health records route
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  console.log(`[Health Records Test] Student ID: ${params.id}`);
  console.log(`[Health Records Test] URL: ${request.url}`);
  
  return NextResponse.json({
    message: 'Health records route test working',
    studentId: params.id,
    timestamp: new Date().toISOString()
  });
}