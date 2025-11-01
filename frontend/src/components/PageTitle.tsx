'use client';

/**
 * PageTitle Component
 *
 * Dynamically updates the document title based on the current route.
 * Ensures screen readers announce page changes when navigating in SPA.
 *
 * WCAG 2.1 Level A Compliance:
 * - 2.4.2 Page Titled (Level A)
 *
 * @component
 */

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Mapping of route paths to page titles.
 * Add new routes here to customize page titles.
 */
const ROUTE_TITLES: Record<string, string> = {
  '/': 'Home',
  '/dashboard': 'Dashboard',
  '/students': 'Students',
  '/students/new': 'Add New Student',
  '/medications': 'Medication Management',
  '/medications/new': 'Add New Medication',
  '/appointments': 'Appointments',
  '/appointments/new': 'Schedule Appointment',
  '/incidents': 'Incident Reports',
  '/incidents/new': 'Create Incident Report',
  '/health-records': 'Health Records',
  '/emergency-contacts': 'Emergency Contacts',
  '/reports': 'Reports',
  '/settings': 'Settings',
  '/profile': 'Profile',
  '/login': 'Login',
  '/register': 'Registration',
  '/forgot-password': 'Password Recovery',
};

/**
 * Default title suffix for all pages.
 */
const DEFAULT_TITLE_SUFFIX = 'White Cross Healthcare Platform';

/**
 * PageTitle component.
 *
 * Updates document.title when the route changes. Screen readers
 * automatically announce the new page title when it changes.
 *
 * @returns {null} This component renders nothing
 *
 * @example
 * ```tsx
 * // Add to root layout
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <PageTitle />
 *         {children}
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function PageTitle() {
  const pathname = usePathname();

  useEffect(() => {
    // Get title for current route
    const pageTitle = ROUTE_TITLES[pathname];

    // Update document title
    if (pageTitle) {
      document.title = `${pageTitle} - ${DEFAULT_TITLE_SUFFIX}`;
    } else {
      // Fallback for routes not in mapping
      const segments = pathname.split('/').filter(Boolean);
      const dynamicTitle = segments.length > 0
        ? segments[segments.length - 1]
            .split('-')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        : 'Home';

      document.title = `${dynamicTitle} - ${DEFAULT_TITLE_SUFFIX}`;
    }
  }, [pathname]);

  return null;
}
