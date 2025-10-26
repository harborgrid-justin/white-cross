/**
 * Message Detail Page
 *
 * View individual message or thread
 */

import React from 'react';
import { Metadata } from 'next';
import { MessageDetailContent } from './MessageDetailContent';

export const metadata: Metadata = {
  title: 'Message | Communications',
  description: 'View message details'
};

interface MessageDetailPageProps {
  params: {
    id: string;
  };
}

export default function MessageDetailPage({ params }: MessageDetailPageProps) {
  return <MessageDetailContent messageId={params.id} />;
}
