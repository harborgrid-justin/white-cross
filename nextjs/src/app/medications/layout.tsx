import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Medications - White Cross Healthcare',
  description: 'Manage student medications, prescriptions, and medication administration with Five Rights safety verification',
};

interface MedicationsLayoutProps {
  children: React.ReactNode;
}

/**
 * Medications Layout
 *
 * Shared layout for all medication-related pages including:
 * - Medication list and overview
 * - Individual medication details
 * - Medication administration workflow
 *
 * Provides consistent navigation and statistics display across medication pages.
 *
 * @remarks
 * - All medication operations are subject to HIPAA audit logging
 * - Critical safety features enforce Five Rights of Medication Administration
 * - PHI data is not persisted to localStorage
 */
export default function MedicationsLayout({ children }: MedicationsLayoutProps) {
  return (
    <div className="medications-layout min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
