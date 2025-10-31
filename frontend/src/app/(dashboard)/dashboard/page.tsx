/**
 * Dashboard Page - Healthcare platform main dashboard
 *
 * Features:
 * - Comprehensive health statistics
 * - Real-time alerts and notifications
 * - Student health overview
 * - Quick access to common actions
 * - System status and recent activities
 */

import { Metadata } from 'next';
import DashboardContent from './_components/DashboardContent';
import DashboardSidebar from './_components/DashboardSidebar';

/**
 * Page metadata for SEO and browser display
 */
export const metadata: Metadata = {
  title: 'Dashboard | White Cross Healthcare',
  description: 'Healthcare dashboard with comprehensive student health management, real-time alerts, and system overview',
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Dynamic Rendering Configuration
 *
 * Force dynamic rendering to allow authentication checks and real-time data.
 * This page requires access to headers/cookies for user authentication,
 * and displays real-time health alerts and system status.
 */
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-auto">
        <DashboardContent />
      </div>
      <div className="w-80 border-l bg-gray-50/50 overflow-auto">
        <div className="p-6">
          <DashboardSidebar />
        </div>
      </div>
    </div>
  );
}
