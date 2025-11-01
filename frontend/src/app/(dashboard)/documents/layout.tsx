/**
 * @fileoverview Documents Feature Layout with Sidebar Navigation
 *
 * Feature-specific layout for the documents section of the White Cross Healthcare Platform.
 * Provides comprehensive sidebar navigation for document management, file uploads,
 * and document organization. This layout wraps all document-related pages.
 *
 * @module app/(dashboard)/documents/layout
 * @category Healthcare
 * @subcategory Documents
 *
 * @since 1.0.0
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: {
    template: '%s | Documents | White Cross',
    default: 'Documents | White Cross'
  },
  description: 'Document management and file organization'
};

interface DocumentsLayoutProps {
  children: ReactNode;
}

export default function DocumentsLayout({ children }: DocumentsLayoutProps) {
  return (
    <div className="flex h-full">
      {/* Sidebar Navigation */}
      <aside className="hidden w-64 border-r border-gray-200 bg-white lg:block">
        <nav className="flex h-full flex-col">
          <div className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            <h2 className="mb-4 px-4 text-lg font-semibold text-gray-900">
              Documents
            </h2>

            {/* Main Navigation */}
            <div className="space-y-1">
              <NavLink href="/documents">All Documents</NavLink>
              <NavLink href="/documents/upload">Upload Document</NavLink>
            </div>

            {/* By Type */}
            <div className="pt-6">
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                By Type
              </h3>
              <div className="space-y-1">
                <NavLink href="/documents/medical-records">Medical Records</NavLink>
                <NavLink href="/documents/forms">Forms</NavLink>
                <NavLink href="/documents/consents">Consents</NavLink>
                <NavLink href="/documents/reports">Reports</NavLink>
                <NavLink href="/documents/images">Images</NavLink>
              </div>
            </div>

            {/* Organization */}
            <div className="pt-6">
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Organization
              </h3>
              <div className="space-y-1">
                <NavLink href="/documents/folders">Folders</NavLink>
                <NavLink href="/documents/recent">Recent</NavLink>
                <NavLink href="/documents/shared">Shared</NavLink>
                <NavLink href="/documents/archived">Archived</NavLink>
              </div>
            </div>

            {/* Security */}
            <div className="pt-6">
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Security
              </h3>
              <div className="space-y-1">
                <NavLink href="/documents/permissions">Permissions</NavLink>
                <NavLink href="/documents/audit-log">Audit Log</NavLink>
                <NavLink href="/documents/encryption">Encryption Status</NavLink>
              </div>
            </div>

            {/* Settings */}
            <div className="pt-6">
              <NavLink href="/documents/settings">Settings</NavLink>
              <NavLink href="/documents/templates">Templates</NavLink>
              <NavLink href="/documents/storage">Storage</NavLink>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-t border-gray-200 p-4">
            <Link
              href="/documents/emergency-forms"
              className="block rounded-lg bg-blue-50 px-4 py-3 text-center text-sm font-medium text-blue-700 hover:bg-blue-100"
            >
              Emergency Forms
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