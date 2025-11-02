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
  modal: ReactNode;
  sidebar: ReactNode;
}

export default function TransactionsLayout({ children, modal, sidebar }: TransactionsLayoutProps) {
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