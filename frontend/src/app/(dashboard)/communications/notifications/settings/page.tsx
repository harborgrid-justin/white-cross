/**
 * Notification Settings Page
 *
 * Configure notification preferences
 */

import React from 'react';
import { Metadata } from 'next';
import { NotificationSettingsContent } from './_components/NotificationSettingsContent';

export const metadata: Metadata = {
  title: 'Notification Settings | Communications',
  description: 'Configure your notification preferences'
};



export default function NotificationSettingsPage() {
  return <NotificationSettingsContent />;
}
