/**
 * @fileoverview Students Layout - Parallel routes layout for sidebar and modal
 * @module app/(dashboard)/students/layout
 * @category Students - Layout
 */

import type { ReactNode } from 'react';
import { Metadata } from 'next';
import { StudentsLayoutClient } from './_components/StudentsLayoutClient';

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
    <StudentsLayoutClient
      sidebar={sidebar}
      modal={modal}
    >
      {children}
    </StudentsLayoutClient>
  );
}
