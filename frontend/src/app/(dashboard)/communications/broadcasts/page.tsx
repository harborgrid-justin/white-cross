/**
 * Broadcasts List Page
 *
 * View all broadcasts
 */

import React from 'react';
import { Metadata } from 'next';
import { BroadcastsContent } from './_components/BroadcastsContent';

export const metadata: Metadata = {
  title: 'Broadcasts | Communications',
  description: 'View and manage broadcasts'
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

export default function BroadcastsPage() {
  return <BroadcastsContent />;
}
