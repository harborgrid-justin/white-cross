/**
 * Notifications Page
 *
 * View all notifications
 */

import React from 'react';
import { Metadata } from 'next';
import { NotificationsContent } from './NotificationsContent';

export const metadata: Metadata = {
  title: 'Notifications | Communications',
  description: 'View and manage your notifications'
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

export default function NotificationsPage() {
  return <NotificationsContent />;
}
