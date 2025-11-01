/**
 * @fileoverview Immunizations Feature Layout
 */

import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: {
    template: '%s | Immunizations | White Cross',
    default: 'Immunizations | White Cross'
  },
  description: 'Student immunization tracking and management'
};

interface ImmunizationsLayoutProps {
  children: ReactNode;
}

export default function ImmunizationsLayout({ children }: ImmunizationsLayoutProps) {
  return (
    <div className="p-6">
      {children}
    </div>
  );
}