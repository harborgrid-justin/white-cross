/**
 * @fileoverview Medications Layout
 * @module app/(dashboard)/medications/layout
 *
 * Layout wrapper for all medication pages with navigation and context.
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: {
    template: '%s | Medications | White Cross',
    default: 'Medications | White Cross'
  },
  description: 'Medication management and administration tracking'
};

interface MedicationsLayoutProps {
  children: ReactNode;
}

/**
 * Medications Layout Component
 *
 * Provides consistent layout and navigation for medication pages.
 */
export default function MedicationsLayout({ children }: MedicationsLayoutProps) {
  return (
    <div className="flex h-full">
      {/* Sidebar Navigation */}
      <aside className="hidden w-64 border-r border-gray-200 bg-white lg:block">
        <nav className="flex h-full flex-col">
          <div className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            <h2 className="mb-4 px-4 text-lg font-semibold text-gray-900">
              Medications
            </h2>

            {/* Main Navigation */}
            <div className="space-y-1">
              <NavLink href="/medications">All Medications</NavLink>
              <NavLink href="/medications/new">Add Medication</NavLink>
            </div>

            {/* Administration */}
            <div className="pt-6">
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Administration
              </h3>
              <div className="space-y-1">
                <NavLink href="/medications/administration-due">
                  Due Now
                </NavLink>
                <NavLink href="/medications/administration-overdue">
                  Overdue
                </NavLink>
                <NavLink href="/medications/administration-missed">
                  Missed
                </NavLink>
                <NavLink href="/medications/administration-completed">
                  Completed
                </NavLink>
                <NavLink href="/medications/administration-calendar">
                  Calendar
                </NavLink>
                <NavLink href="/medications/administration-schedule">
                  Schedule
                </NavLink>
              </div>
            </div>

            {/* Medication Types */}
            <div className="pt-6">
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                By Type
              </h3>
              <div className="space-y-1">
                <NavLink href="/medications/prescriptions">
                  Prescriptions
                </NavLink>
                <NavLink href="/medications/controlled-substances">
                  Controlled Substances
                </NavLink>
                <NavLink href="/medications/over-the-counter">
                  Over-the-Counter
                </NavLink>
                <NavLink href="/medications/as-needed">As Needed</NavLink>
                <NavLink href="/medications/emergency">Emergency</NavLink>
              </div>
            </div>

            {/* Inventory */}
            <div className="pt-6">
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Inventory
              </h3>
              <div className="space-y-1">
                <NavLink href="/medications/inventory">
                  All Inventory
                </NavLink>
                <NavLink href="/medications/inventory/low-stock">
                  Low Stock
                </NavLink>
                <NavLink href="/medications/inventory/expiring">
                  Expiring Soon
                </NavLink>
              </div>
            </div>

            {/* Reports */}
            <div className="pt-6">
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Reports
              </h3>
              <div className="space-y-1">
                <NavLink href="/medications/reports">All Reports</NavLink>
                <NavLink href="/medications/reports/administration">
                  Administration
                </NavLink>
                <NavLink href="/medications/reports/compliance">
                  Compliance
                </NavLink>
                <NavLink href="/medications/reports/inventory">
                  Inventory
                </NavLink>
                <NavLink href="/medications/reports/refills">
                  Refills
                </NavLink>
              </div>
            </div>

            {/* Settings */}
            <div className="pt-6">
              <NavLink href="/medications/settings">Settings</NavLink>
              <NavLink href="/medications/categories">Categories</NavLink>
              <NavLink href="/medications/administration-rules">
                Administration Rules
              </NavLink>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-t border-gray-200 p-4">
            <Link
              href="/medications/interactions"
              className="block rounded-lg bg-blue-50 px-4 py-3 text-center text-sm font-medium text-blue-700 hover:bg-blue-100"
            >
              Check Drug Interactions
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="mx-auto max-w-7xl p-6">{children}</div>
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
