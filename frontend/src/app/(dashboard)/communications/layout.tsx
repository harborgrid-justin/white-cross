/**
 * @fileoverview Communications Layout Component - Healthcare messaging system layout
 * @module app/(dashboard)/communications/layout
 * @category Communications - Layout
 */

import type { ReactNode } from 'react';
import { Metadata } from 'next';
import { CommunicationsLayoutClient } from './_components/CommunicationsLayoutClient';

export const metadata: Metadata = {
  title: 'Communications | White Cross',
  description: 'Comprehensive healthcare communication management system',
};

interface CommunicationsLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  modal: ReactNode;
}

export default function CommunicationsLayout({
  children,
  sidebar,
  modal
}: CommunicationsLayoutProps) {
  return (
    <CommunicationsLayoutClient
      sidebar={sidebar}
      modal={modal}
    >
      {children}
    </CommunicationsLayoutClient>
  );
}
