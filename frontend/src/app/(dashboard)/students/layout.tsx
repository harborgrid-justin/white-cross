/**
 * @fileoverview Students Layout - Parallel routes layout for sidebar and modal
 * @module app/(dashboard)/students/layout
 * @category Students - Layout
 */

import type { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Students | White Cross',
  description: 'Comprehensive student management system',
};

interface StudentsLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  modal: ReactNode;
}

export default function StudentsLayout({
  children,
  sidebar,
  modal
}: StudentsLayoutProps) {
  return (
    <div className="flex gap-6">
      <div className="flex-1">
        {children}
      </div>
      <div className="w-80 flex-shrink-0">
        {sidebar}
      </div>
      {modal}
    </div>
  );
}