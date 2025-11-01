/**
 * @fileoverview Transactions Feature Layout
 */

import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: {
    template: '%s | Transactions | White Cross',
    default: 'Transactions | White Cross'
  },
  description: 'Financial transaction management'
};

interface TransactionsLayoutProps {
  children: ReactNode;
}

export default function TransactionsLayout({ children }: TransactionsLayoutProps) {
  return (
    <div className="p-6">
      {children}
    </div>
  );
}