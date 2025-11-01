/**
 * @fileoverview Reminders Feature Layout
 */

import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: {
    template: '%s | Reminders | White Cross',
    default: 'Reminders | White Cross'
  },
  description: 'Reminder management and scheduling'
};

interface RemindersLayoutProps {
  children: ReactNode;
}

export default function RemindersLayout({ children }: RemindersLayoutProps) {
  return (
    <div className="p-6">
      {children}
    </div>
  );
}