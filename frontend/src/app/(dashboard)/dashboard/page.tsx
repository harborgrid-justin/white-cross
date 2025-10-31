/**
 * Dashboard Page - Main application dashboard
 *
 * Features:
 * - Overview statistics cards
 * - Recent activity
 * - Quick actions
 * - Responsive grid layout
 */

import { Metadata } from 'next';
import { Container } from '@/components/layouts/Container';
import {
  Users,
  Pill,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Activity,
} from 'lucide-react';

/**
 * Page metadata for SEO and browser display
 */
export const metadata: Metadata = {
  title: 'Dashboard | White Cross',
  description: 'Healthcare dashboard with student statistics, medication tracking, appointment scheduling, and incident monitoring',
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Dynamic Rendering Configuration
 *
 * Force dynamic rendering to allow authentication checks at request time.
 * This page requires access to headers/cookies for user authentication,
 * which is only available during request-time rendering, not at build time.
 */
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const stats = [
    {
      name: 'Total Students',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
    },
    {
      name: 'Active Medications',
      value: '87',
      change: '-3%',
      changeType: 'negative',
      icon: Pill,
    },
    {
      name: 'Appointments Today',
      value: '23',
      change: '+5%',
      changeType: 'positive',
      icon: Calendar,
    },
    {
      name: 'Pending Incidents',
      value: '4',
      change: '0%',
      changeType: 'neutral',
      icon: AlertTriangle,
    },
  ];

  return (
    <Container>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Welcome back! Here's what's happening in your healthcare facility.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.name}
                className="relative bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Icon
                        className="h-6 w-6 text-gray-400 dark:text-gray-500"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          {stat.name}
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                            {stat.value}
                          </div>
                          <div
                            className={`ml-2 flex items-baseline text-sm font-semibold ${
                              stat.changeType === 'positive'
                                ? 'text-green-600 dark:text-green-400'
                                : stat.changeType === 'negative'
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-gray-500 dark:text-gray-400'
                            }`}
                          >
                            {stat.change}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity & Quick Actions Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {[
                  {
                    action: 'Medication administered',
                    student: 'John Smith',
                    time: '10 minutes ago',
                  },
                  {
                    action: 'Health record updated',
                    student: 'Emily Johnson',
                    time: '1 hour ago',
                  },
                  {
                    action: 'Appointment scheduled',
                    student: 'Michael Brown',
                    time: '2 hours ago',
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 text-sm"
                  >
                    <div className="flex-shrink-0">
                      <Activity className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 dark:text-gray-100">
                        {activity.action}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        {activity.student}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Add Student', href: '/students/new', icon: Users },
                  { name: 'Log Medication', href: '/medications/new', icon: Pill },
                  {
                    name: 'Schedule Appointment',
                    href: '/appointments/new',
                    icon: Calendar,
                  },
                  {
                    name: 'Report Incident',
                    href: '/incidents/new',
                    icon: AlertTriangle,
                  },
                ].map((action) => {
                  const Icon = action.icon;
                  return (
                    <a
                      key={action.name}
                      href={action.href}
                      className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400 mb-2" />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100 text-center">
                        {action.name}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Alerts/Notices */}
        <div className="bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-20 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle
                className="h-5 w-5 text-yellow-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-200">
                You have <strong className="font-medium">3 medication orders</strong> expiring
                within the next 7 days. Review them to ensure continuity of care.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
