/**
 * Broadcast Detail Page
 *
 * View broadcast details and statistics
 */

import React from 'react';
import { Metadata } from 'next';
import { BroadcastDetailContent } from './_components/BroadcastDetailContent';

export const metadata: Metadata = {
  title: 'Broadcast Details | Communications',
  description: 'View broadcast details and statistics'
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

interface BroadcastDetailPageProps {
  params: {
    id: string;
  };
}

export default function BroadcastDetailPage({ params }: BroadcastDetailPageProps) {
  return <BroadcastDetailContent broadcastId={params.id} />;
}
