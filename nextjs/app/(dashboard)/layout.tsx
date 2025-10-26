/**
 * Dashboard Layout - Protected Application Shell
 *
 * This layout wraps all protected dashboard pages with:
 * - Authentication guard (redirects to login if not authenticated)
 * - Sidebar navigation
 * - Header with user menu
 * - Role-based access control
 *
 * @remarks
 * This layout applies to all routes under (dashboard) route group.
 * It provides the main application shell with persistent navigation.
 */

import type { Metadata } from 'next';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { AuthGuard } from '@/components/auth/AuthGuard';

export const metadata: Metadata = {
  title: {
    template: '%s | Dashboard | White Cross',
    default: 'Dashboard | White Cross',
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar - Fixed navigation */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header - Fixed top bar */}
          <Header />

          {/* Page Content - Scrollable */}
          <main className="flex-1 overflow-y-auto bg-gray-50 custom-scrollbar">
            <div className="animate-fadeIn">{children}</div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
