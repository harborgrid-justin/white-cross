import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Appointments - White Cross Healthcare',
  description: 'Schedule and manage student health appointments with calendar view and waitlist management',
};

interface AppointmentsLayoutProps {
  children: React.ReactNode;
}

/**
 * Appointments Layout
 *
 * Shared layout for all appointment-related pages including:
 * - Appointment calendar and list view
 * - Individual appointment details
 * - Appointment scheduling workflow
 * - Waitlist management
 *
 * Provides consistent navigation and availability display across appointment pages.
 *
 * @remarks
 * - All appointment operations are subject to HIPAA audit logging
 * - Scheduling respects nurse availability and appointment duration
 * - PHI data is not persisted to localStorage
 */
export default function AppointmentsLayout({ children }: AppointmentsLayoutProps) {
  return (
    <div className="appointments-layout min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
