/**
 * Root Page - Redirects to Dashboard
 *
 * The root page (/) redirects authenticated users to the dashboard
 * and unauthenticated users to the login page.
 */

import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect to dashboard - authentication will be handled by middleware
  redirect('/dashboard');
}
