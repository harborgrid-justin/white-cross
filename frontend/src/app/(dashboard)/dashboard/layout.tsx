/**
 * @fileoverview Dashboard Main Layout with Navigation
 *
 * Main dashboard layout for the White Cross Healthcare Platform.
 * Provides primary navigation and overview functionality.
 *
 * @module app/(dashboard)/dashboard/layout
 * @category Dashboard
 *
 * @since 1.0.0
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: {
    template: '%s | Dashboard | White Cross',
    default: 'Dashboard | White Cross'
  },
  description: 'Healthcare platform dashboard and overview'
};

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-full">
      {/* Sidebar Navigation */}
      <aside className="hidden w-64 border-r border-gray-200 bg-white lg:block">
        <nav className="flex h-full flex-col">
          <div className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            <h2 className="mb-4 px-4 text-lg font-semibold text-gray-900">
              Dashboard
            </h2>

            {/* Main Navigation */}
            <div className="space-y-1">
              <NavLink href="/dashboard">Overview</NavLink>
              <NavLink href="/dashboard/quick-stats">Quick Stats</NavLink>
            </div>

            {/* Recent Activity */}
            <div className="pt-6">
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Recent Activity
              </h3>
              <div className="space-y-1">
                <NavLink href="/dashboard/recent-visits">Recent Visits</NavLink>
                <NavLink href="/dashboard/alerts">Alerts</NavLink>
                <NavLink href="/dashboard/notifications">Notifications</NavLink>
              </div>
            </div>

            {/* Quick Access */}
            <div className="pt-6">
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Quick Access
              </h3>
              <div className="space-y-1">
                <NavLink href="/students">Students</NavLink>
                <NavLink href="/appointments">Appointments</NavLink>
                <NavLink href="/medications">Medications</NavLink>
                <NavLink href="/incidents">Incidents</NavLink>
              </div>
            </div>

            {/* Reports */}
            <div className="pt-6">
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Reports
              </h3>
              <div className="space-y-1">
                <NavLink href="/dashboard/reports">All Reports</NavLink>
                <NavLink href="/dashboard/analytics">Analytics</NavLink>
                <NavLink href="/dashboard/trends">Health Trends</NavLink>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-t border-gray-200 p-4">
            <Link
              href="/dashboard/emergency"
              className="block rounded-lg bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700 hover:bg-red-100"
            >
              Emergency Protocol
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