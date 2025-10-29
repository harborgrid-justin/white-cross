/**
 * Monitoring Logs API Endpoint
 *
 * Receives and processes client-side logs
 */

import { NextRequest, NextResponse } from 'next/server';
import type { LogEntry } from '@/monitoring/types';

export async function POST(request: NextRequest) {
  try {
    const { logs } = await request.json();

    if (!Array.isArray(logs)) {
      return NextResponse.json(
        { error: 'Invalid request: logs must be an array' },
        { status: 400 }
      );
    }

    // Process logs (you would typically send these to your logging service)
    // For now, we'll just log to console in development
    if (process.env.NODE_ENV === 'development') {
      logs.forEach((log: LogEntry) => {
        const timestamp = new Date(log.timestamp).toISOString();
        console.log(`[${timestamp}] [${log.level.toUpperCase()}] ${log.message}`, log.context || '');
      });
    }

    // In production, you would send to a logging service like:
    // - DataDog Logs
    // - Elasticsearch
    // - CloudWatch Logs
    // - Your backend logging endpoint

    // Example: Send to backend
    if (process.env.NEXT_PUBLIC_API_URL) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/monitoring/logs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ logs }),
        });
      } catch (error) {
        console.error('Failed to send logs to backend:', error);
      }
    }

    return NextResponse.json({ success: true, count: logs.length });
  } catch (error) {
    console.error('Error processing logs:', error);
    return NextResponse.json(
      { error: 'Failed to process logs' },
      { status: 500 }
    );
  }
}
