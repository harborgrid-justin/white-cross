/**
 * Message Detail Page
 *
 * View individual message or thread with dynamic metadata
 */

import React from 'react';
import { Metadata } from 'next';
import { MessageDetailContent } from './_components/MessageDetailContent';
import { getMessageById } from '@/lib/actions/communications.actions';

/**
 * Generate dynamic metadata for message detail page
 *
 * Creates page title and description based on message data, improving browser
 * tab UX and navigation history. Includes message subject and sender info.
 */
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  // Fetch message data to populate metadata
  const result = await getMessageById(params.id);

  // Handle not found or error cases
  if (!result.success || !result.data) {
    return {
      title: 'Message Not Found | Communications | White Cross',
      description: 'The requested message could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const message = result.data;

  // Truncate subject if too long for title
  const truncatedSubject = message.subject.length > 50
    ? `${message.subject.substring(0, 50)}...`
    : message.subject;

  return {
    title: `${truncatedSubject} | Communications | White Cross`,
    description: `Message from ${message.senderName} - ${message.priority} priority`,
    robots: {
      index: false, // HIPAA compliance - prevent search indexing
      follow: false,
    },
  };
}

// Force dynamic rendering due to auth requirements
export const dynamic = 'force-dynamic';

interface MessageDetailPageProps {
  params: {
    id: string;
  };
}

export default function MessageDetailPage({ params }: MessageDetailPageProps) {
  return <MessageDetailContent messageId={params.id} />;
}
