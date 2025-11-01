/**
 * Messages API endpoints
 * Send and retrieve messages
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { withAuth } from '@/middleware/withAuth';
import { proxyToBackend } from '@/lib/apiProxy';
import { auditLog, createAuditContext } from '@/lib/audit';

/**
 * GET /communications/messages
 * List all messages
 */
export const GET = withAuth(async (request: NextRequest, context, auth) => {
  try {
    const response = await proxyToBackend(request, '/communications/messages', {
      cache: {
        revalidate: 10, // Short cache for real-time messaging
        tags: ['messages']
      }
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
});

/**
 * POST /communications/messages
 * Send new message
 */
export const POST = withAuth(async (request: NextRequest, context, auth) => {
  try {
    const response = await proxyToBackend(request, '/communications/messages');
    const data = await response.json();

    if (response.status === 201 && data.data) {
      const auditContext = createAuditContext(request, auth.user.userId);
      await auditLog({
        ...auditContext,
        action: 'SEND_MESSAGE',
        resource: 'Message',
        resourceId: data.data.id,
        details: 'Message sent'
      });

      revalidateTag('messages', {});
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
});
