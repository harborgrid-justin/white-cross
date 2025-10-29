/**
 * Communications Settings Page
 *
 * General communications settings
 */

import React from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Settings | Communications',
  description: 'Configure communications settings'
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

export default function CommunicationsSettingsPage() {
  // Redirect to notification settings for now
  redirect('/communications/notifications/settings');
}
