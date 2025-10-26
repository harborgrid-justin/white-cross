/**
 * Broadcasts List Page
 *
 * View all broadcasts
 */

import React from 'react';
import { Metadata } from 'next';
import { BroadcastsContent } from './BroadcastsContent';

export const metadata: Metadata = {
  title: 'Broadcasts | Communications',
  description: 'View and manage broadcasts'
};

export default function BroadcastsPage() {
  return <BroadcastsContent />;
}
