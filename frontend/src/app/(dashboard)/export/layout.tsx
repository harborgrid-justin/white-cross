/**
 * @fileoverview Export Feature Layout
 */

import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: {
    template: '%s | Export | White Cross',
    default: 'Export | White Cross'
  },
  description: 'Data export and reporting tools'
};

interface ExportLayoutProps {
  children: ReactNode;
}

export default function ExportLayout({ children }: ExportLayoutProps) {
  return (
    <div className="p-6">
      {children}
    </div>
  );
}