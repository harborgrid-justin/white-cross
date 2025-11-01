/**
 * @fileoverview Notifications Feature Layout
 */

import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: {
    template: '%s | Notifications | White Cross',
    default: 'Notifications | White Cross'
  },
  description: 'Notification management and alerts'
};

interface NotificationsLayoutProps {
  children: ReactNode;
}

export default function NotificationsLayout({ children }: NotificationsLayoutProps) {
  return (
    <div className="p-6">
      {children}
    </div>
  );
}