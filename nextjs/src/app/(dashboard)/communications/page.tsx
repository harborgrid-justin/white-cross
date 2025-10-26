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

export default function CommunicationsPage() {
  return <InboxContent />;
}
