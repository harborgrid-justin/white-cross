/**
 * Communications Inbox Page
 *
 * Main inbox with message threads
 */

import React from 'react';
import { Metadata } from 'next';
import { InboxContent } from './InboxContent';

export const metadata: Metadata = {
  title: 'Inbox | Communications',
  description: 'View and manage your messages'
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

export default function CommunicationsPage() {
  return <InboxContent />;
}
