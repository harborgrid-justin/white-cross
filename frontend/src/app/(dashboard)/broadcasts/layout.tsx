/**
 * @fileoverview Broadcasts Feature Layout with Sidebar Navigation
 *
 * Feature-specific layout for the broadcasts section of the White Cross Healthcare Platform.
 * Provides comprehensive sidebar navigation for broadcast message management, emergency
 * notifications, and communication analytics. This layout wraps all broadcast-related pages.
 *
 * @module app/(dashboard)/broadcasts/layout
 * @category Communications
 * @subcategory Broadcasts
 *
 * @since 1.0.0
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: {
    template: '%s | Broadcasts | White Cross',
    default: 'Broadcasts | White Cross'
  },
  description: 'Broadcast messaging and emergency notifications'
};

interface BroadcastsLayoutProps {
  children: ReactNode;
}

export default function BroadcastsLayout({ children }: BroadcastsLayoutProps) {
  return (
    <div className="flex h-full">
      {/* Sidebar Navigation */}
      <aside className="hidden w-64 border-r border-gray-200 bg-white lg:block">
        <nav className="flex h-full flex-col">
          <div className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            <h2 className="mb-4 px-4 text-lg font-semibold text-gray-900">
              Broadcasts
            </h2>

            {/* Main Navigation */}
            <div className="space-y-1">
              <NavLink href="/broadcasts">All Broadcasts</NavLink>
              <NavLink href="/broadcasts/new">New Broadcast</NavLink>
            </div>

            {/* By Status */}
            <div className="pt-6">
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                By Status
              </h3>
              <div className="space-y-1">
                <NavLink href="/broadcasts/draft">Draft</NavLink>
                <NavLink href="/broadcasts/scheduled">Scheduled</NavLink>
                <NavLink href="/broadcasts/sent">Sent</NavLink>
                <NavLink href="/broadcasts/failed">Failed</NavLink>
              </div>
            </div>

            {/* By Type */}
            <div className="pt-6">
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                By Type
              </h3>
              <div className="space-y-1">
                <NavLink href="/broadcasts/emergency">Emergency</NavLink>
                <NavLink href="/broadcasts/announcements">Announcements</NavLink>
                <NavLink href="/broadcasts/health-alerts">Health Alerts</NavLink>
                <NavLink href="/broadcasts/reminders">Reminders</NavLink>
              </div>
            </div>

            {/* By Audience */}
            <div className="pt-6">
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                By Audience
              </h3>
              <div className="space-y-1">
                <NavLink href="/broadcasts/parents">Parents</NavLink>
                <NavLink href="/broadcasts/staff">Staff</NavLink>
                <NavLink href="/broadcasts/students">Students</NavLink>
                <NavLink href="/broadcasts/all">All Recipients</NavLink>
              </div>
            </div>

            {/* Analytics */}
            <div className="pt-6">
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Analytics
              </h3>
              <div className="space-y-1">
                <NavLink href="/broadcasts/analytics">Overview</NavLink>
                <NavLink href="/broadcasts/delivery-rates">Delivery Rates</NavLink>
                <NavLink href="/broadcasts/engagement">Engagement</NavLink>
              </div>
            </div>

            {/* Settings */}
            <div className="pt-6">
              <NavLink href="/broadcasts/settings">Settings</NavLink>
              <NavLink href="/broadcasts/templates">Templates</NavLink>
              <NavLink href="/broadcasts/contacts">Contact Groups</NavLink>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-t border-gray-200 p-4">
            <Link
              href="/broadcasts/emergency"
              className="block rounded-lg bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700 hover:bg-red-100"
            >
              Emergency Broadcast
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