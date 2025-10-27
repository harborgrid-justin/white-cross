/**
 * Compose Message Page
 *
 * Page for composing new messages
 */

import React from 'react';
import { Metadata } from 'next';
import { ComposeContent } from './ComposeContent';

export const metadata: Metadata = {
  title: 'Compose Message | Communications',
  description: 'Compose a new message'
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

export default function ComposePage() {
  return <ComposeContent />;
}
