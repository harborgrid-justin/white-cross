'use client';

/**
 * Breadcrumbs Component - Auto-generated breadcrumb navigation
 *
 * Features:
 * - Auto-generates breadcrumbs from current pathname
 * - Clickable breadcrumb links
 * - Proper ARIA labels for accessibility
 * - Responsive text truncation
 * - Screen reader support
 * - Custom labels via prop override
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { useMemo } from 'react';

interface BreadcrumbsProps {
  customLabels?: Record<string, string>;
  className?: string;
}

// Default label mappings for common routes
const defaultLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  students: 'Students',
  'health-records': 'Health Records',
  medications: 'Medications',
  appointments: 'Appointments',
  incidents: 'Incident Reports',
  inventory: 'Inventory',
  budget: 'Budget & Finance',
  'purchase-orders': 'Purchase Orders',
  vendors: 'Vendors',
  communication: 'Messages',
  notifications: 'Notifications',
  reminders: 'Reminders',
  documents: 'Documents',
  reports: 'Reports',
  analytics: 'Analytics',
  admin: 'Administration',
  settings: 'Settings',
  profile: 'My Profile',
  new: 'New',
  edit: 'Edit',
  view: 'View',
};

export function Breadcrumbs({ customLabels = {}, className = '' }: BreadcrumbsProps) {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // Split pathname and filter empty strings
    const paths = pathname.split('/').filter(Boolean);

    // Build breadcrumb items
    const items = paths.map((path, index) => {
      const href = '/' + paths.slice(0, index + 1).join('/');
      const labels = { ...defaultLabels, ...customLabels };

      // Try to get a friendly label, otherwise use the path segment with formatting
      const label = labels[path] || path
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      return {
        label,
        href,
        isLast: index === paths.length - 1,
      };
    });

    return items;
  }, [pathname, customLabels]);

  // Don't show breadcrumbs on homepage or if no breadcrumbs
  if (pathname === '/' || breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center space-x-2 text-sm ${className}`}
    >
      {/* Home link */}
      <Link
        href="/dashboard"
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
        aria-label="Home"
      >
        <Home className="h-4 w-4" />
      </Link>

      {/* Breadcrumb items */}
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-600" aria-hidden="true" />

          {crumb.isLast ? (
            <span
              className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-xs"
              aria-current="page"
            >
              {crumb.label}
            </span>
          ) : (
            <Link
              href={crumb.href}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors truncate max-w-xs"
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
