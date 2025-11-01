/**
 * @fileoverview Purchase Orders Feature Layout
 */

import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: {
    template: '%s | Purchase Orders | White Cross',
    default: 'Purchase Orders | White Cross'
  },
  description: 'Purchase order management and procurement'
};

interface PurchaseOrdersLayoutProps {
  children: ReactNode;
}

export default function PurchaseOrdersLayout({ children }: PurchaseOrdersLayoutProps) {
  return (
    <div className="p-6">
      {children}
    </div>
  );
}