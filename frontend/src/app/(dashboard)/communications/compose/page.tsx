/**
 * Compose Message Page
 *
 * Page for composing new messages
 */

import React from 'react';
import { Metadata } from 'next';
import { ComposeContent } from './_components/ComposeContent';

export const metadata: Metadata = {
  title: 'Compose Message | Communications',
  description: 'Compose a new message'
};



export default function ComposePage() {
  return <ComposeContent />;
}
