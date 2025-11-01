/**
 * @fileoverview Appointments Feature Layout with Sidebar Navigation
 *
 * Feature-specific layout for the appointments section of the White Cross Healthcare Platform.
 * Provides comprehensive sidebar navigation for appointment management, scheduling, calendar views,
 * and appointment-related reports. This layout wraps all appointment-related pages and enables
 * easy access to appointment workflows.
 *
 * @module app/(dashboard)/appointments/layout
 * @category Healthcare
 * @subcategory Appointments
 *
 * **Layout Hierarchy:**
 * ```
 * RootLayout
 * └── DashboardLayout
 *     └── AppointmentsLayout (this file)
 *         ├── /appointments (All Appointments)
 *         ├── /appointments/new (Schedule Appointment)
 *         ├── /appointments/calendar (Calendar View)
 *         └── /appointments/reports/* (Reports)
 * ```
 *
 * **Navigation Sections:**
 * 1. Main Navigation: All appointments, Schedule appointment
 * 2. Views: Calendar, Today's appointments, Upcoming
 * 3. Status: Pending, Confirmed, Completed, Cancelled
 * 4. Types: Check-ups, Medications, Emergency, Follow-ups
 * 5. Reports: Attendance, No-shows, Scheduling analytics
 * 6. Settings: Appointment types, Scheduling rules
 *
 * **HIPAA Compliance:**
 * - All appointment data considered PHI (Protected Health Information)
 * - Access control enforced at route level
 * - Audit logging for all appointment operations
 *
 * @since 1.0.0
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: {
    template: '%s | Appointments | White Cross',
    default: 'Appointments | White Cross'
  },
  description: 'Student appointment scheduling and management'
};

interface AppointmentsLayoutProps {
  children: ReactNode;
}

export default function AppointmentsLayout({ children }: AppointmentsLayoutProps) {
  return (
    <div className="flex h-full">
      {/* Sidebar Navigation */}
      <aside className="hidden w-64 border-r border-gray-200 bg-white lg:block">
        <nav className="flex h-full flex-col">
          <div className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            <h2 className="mb-4 px-4 text-lg font-semibold text-gray-900">
              Appointments
            </h2>

            {/* Main Navigation */}
            <div className="space-y-1">
              <NavLink href="/appointments">All Appointments</NavLink>
              <NavLink href="/appointments/new">Schedule Appointment</NavLink>
            </div>

            {/* Views */}
            <div className="pt-6">
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Views
              </h3>
              <div className="space-y-1">
                <NavLink href="/appointments/calendar">Calendar</NavLink>
                <NavLink href="/appointments/today">Today</NavLink>
                <NavLink href="/appointments/upcoming">Upcoming</NavLink>
              </div>
            </div>

            {/* By Status */}
            <div className="pt-6">
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                By Status
              </h3>
              <div className="space-y-1">
                <NavLink href="/appointments/pending">Pending</NavLink>
                <NavLink href="/appointments/confirmed">Confirmed</NavLink>
                <NavLink href="/appointments/completed">Completed</NavLink>
                <NavLink href="/appointments/cancelled">Cancelled</NavLink>
              </div>
            </div>

            {/* By Type */}
            <div className="pt-6">
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                By Type
              </h3>
              <div className="space-y-1">
                <NavLink href="/appointments/check-ups">Check-ups</NavLink>
                <NavLink href="/appointments/medications">Medications</NavLink>
                <NavLink href="/appointments/emergency">Emergency</NavLink>
                <NavLink href="/appointments/follow-ups">Follow-ups</NavLink>
              </div>
            </div>

            {/* Reports */}
            <div className="pt-6">
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Reports
              </h3>
              <div className="space-y-1">
                <NavLink href="/appointments/reports">All Reports</NavLink>
                <NavLink href="/appointments/reports/attendance">Attendance</NavLink>
                <NavLink href="/appointments/reports/no-shows">No-shows</NavLink>
                <NavLink href="/appointments/reports/analytics">Analytics</NavLink>
              </div>
            </div>

            {/* Settings */}
            <div className="pt-6">
              <NavLink href="/appointments/settings">Settings</NavLink>
              <NavLink href="/appointments/types">Appointment Types</NavLink>
              <NavLink href="/appointments/scheduling-rules">Scheduling Rules</NavLink>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-t border-gray-200 p-4">
            <Link
              href="/appointments/emergency"
              className="block rounded-lg bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700 hover:bg-red-100"
            >
              Emergency Appointment
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

/**
 * Navigation Link Component
 */
function NavLink({
  href,
  children
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    >
      {children}
    </Link>
  );
}