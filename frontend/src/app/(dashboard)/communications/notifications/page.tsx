/**
 * Notifications Page
 *
 * View all notifications
 */

import React from 'react';
import { Metadata } from 'next';
import { NotificationsContent } from './_components/NotificationsContent';

export const metadata: Metadata = {
  title: 'Notifications | Communications',
  description: 'View and manage your notifications'
};



export default function NotificationsPage() {
  return <NotificationsContent />;
}
