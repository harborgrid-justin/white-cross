/**
 * New Broadcast Page
 *
 * Create a new broadcast
 */

import React from 'react';
import { Metadata } from 'next';
import { NewBroadcastContent } from './NewBroadcastContent';

export const metadata: Metadata = {
  title: 'New Broadcast | Communications',
  description: 'Create a new broadcast announcement'
};

export default function NewBroadcastPage() {
  return <NewBroadcastContent />;
}
