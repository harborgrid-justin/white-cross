/**
 * Message Detail Page
 *
 * View individual message or thread
 */

import React from 'react';
import { Metadata } from 'next';
import { MessageDetailContent } from './_components/MessageDetailContent';

export const metadata: Metadata = {
  title: 'Message | Communications',
  description: 'View message details'
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

interface MessageDetailPageProps {
  params: {
    id: string;
  };
}

export default function MessageDetailPage({ params }: MessageDetailPageProps) {
  return <MessageDetailContent messageId={params.id} />;
}
