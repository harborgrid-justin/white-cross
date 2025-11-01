/**
 * @fileoverview Reports Feature Layout
 */

import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: {
    template: '%s | Reports | White Cross',
    default: 'Reports | White Cross'
  },
  description: 'Healthcare reports and analytics'
};

interface ReportsLayoutProps {
  children: ReactNode;
}

export default function ReportsLayout({ children }: ReportsLayoutProps) {
  return (
    <div className="p-6">
      {children}
    </div>
  );
}