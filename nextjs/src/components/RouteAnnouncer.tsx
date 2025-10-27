'use client';

/**
 * RouteAnnouncer Component
 *
 * Announces route changes to screen readers using ARIA live regions.
 * Provides accessibility for SPA navigation by notifying users when
 * the page content changes.
 *
 * WCAG 2.1 Level AA Compliance:
 * - 4.1.3 Status Messages (Level AA)
 *
 * @component
 */

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Mapping of route paths to human-readable announcements.
 * Add new routes here to customize screen reader announcements.
 */
const ROUTE_ANNOUNCEMENTS: Record<string, string> = {
  '/': 'Navigated to Home page',
  '/dashboard': 'Navigated to Dashboard',
  '/students': 'Navigated to Students page',
  '/students/new': 'Navigated to Add New Student page',
  '/medications': 'Navigated to Medication Management page',
  '/medications/new': 'Navigated to Add New Medication page',
  '/appointments': 'Navigated to Appointments page',
  '/appointments/new': 'Navigated to Schedule New Appointment page',
  '/incidents': 'Navigated to Incident Reports page',
  '/incidents/new': 'Navigated to Create New Incident Report page',
  '/health-records': 'Navigated to Health Records page',
  '/emergency-contacts': 'Navigated to Emergency Contacts page',
  '/reports': 'Navigated to Reports page',
  '/settings': 'Navigated to Settings page',
  '/profile': 'Navigated to Profile page',
  '/login': 'Navigated to Login page',
  '/register': 'Navigated to Registration page',
  '/forgot-password': 'Navigated to Password Recovery page',
};

/**
 * RouteAnnouncer component.
 *
 * Automatically announces navigation changes to screen reader users
 * using a polite ARIA live region. The announcement is cleared after
 * 1 second to prevent repeated announcements.
 *
 * @returns {JSX.Element} Hidden live region for announcements
 *
 * @example
 * ```tsx
 * // Add to root layout
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <RouteAnnouncer />
 *         {children}
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function RouteAnnouncer() {
  const pathname = usePathname();
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    // Get announcement for current route or create a generic one
    const message = ROUTE_ANNOUNCEMENTS[pathname] || `Navigated to ${pathname.slice(1) || 'home'}`;
    setAnnouncement(message);

    // Clear announcement after 1 second
    const timer = setTimeout(() => setAnnouncement(''), 1000);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
}
