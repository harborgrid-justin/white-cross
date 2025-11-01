/**
 * @fileoverview Import Feature Layout
 */

import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: {
    template: '%s | Import | White Cross',
    default: 'Import | White Cross'
  },
  description: 'Data import and bulk operations'
};

interface ImportLayoutProps {
  children: ReactNode;
}

export default function ImportLayout({ children }: ImportLayoutProps) {
  return (
    <div className="p-6">
      {children}
    </div>
  );
}