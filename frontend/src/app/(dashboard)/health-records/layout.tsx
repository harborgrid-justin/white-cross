/**
 * @fileoverview Health Records Layout - Parallel routes layout for sidebar and modal
 * @module app/(dashboard)/health-records/layout
 * @category Health Records - Layout
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Health Records | White Cross',
  description: 'Comprehensive health record management system',
};

interface HealthRecordsLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  modal: React.ReactNode;
}

export default function HealthRecordsLayout({
  children,
  sidebar,
  modal
}: HealthRecordsLayoutProps) {
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