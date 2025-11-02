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
  modal: ReactNode;
  sidebar: ReactNode;
}

export default function ReportsLayout({ children, modal, sidebar }: ReportsLayoutProps) {
  return (
    <>
      <div className="p-6">
        {children}
      </div>
      {/* Parallel Route Slots */}
      {modal}
      {sidebar}
    </>
  );
}