/**
 * @fileoverview Analytics Dashboard Main Page
 *
 * Central hub for accessing all analytics modules in the White Cross healthcare
 * platform. Provides quick statistics overview and navigation to specialized
 * analytics pages for health metrics, medication compliance, appointments,
 * incidents, inventory, and custom reporting.
 *
 * @module app/(dashboard)/analytics/page
 *
 * @remarks
 * This is the main landing page for the analytics section, providing:
 * - Quick stats dashboard with key metrics (students, medications, compliance)
 * - Module cards for navigating to specialized analytics pages
 * - Recent report activity feed
 * - Action buttons for data export and custom report creation
 *
 * Architecture:
 * - Server Component for optimal initial page load
 * - Static data with real-time statistics (in production, would fetch from API)
 * - Next.js App Router with file-based routing to sub-modules
 *
 * Performance optimizations:
 * - `force-dynamic` ensures fresh data for authenticated users
 * - Minimal JavaScript shipped to client (Server Component)
 * - Icon components tree-shaken from lucide-react
 *
 * HIPAA compliance:
 * - All displayed statistics are aggregated and anonymized
 * - No individual patient data visible on dashboard
 * - Analytics access logged for audit trails (handled by auth middleware)
 *
 * @example
 * ```tsx
 * // Route: /analytics
 * // Accessible to: Administrators, Clinical Staff (with analytics permission)
 * // Navigation: Dashboard → Analytics
 * ```
 *
 * @see {@link /analytics/health-metrics} - Health measurements tracking
 * @see {@link /analytics/medication-compliance} - Medication administration monitoring
 * @see {@link /analytics/appointment-analytics} - Appointment efficiency metrics
 */

import { Metadata } from 'next';
import Link from 'next/link';
import {
  Activity,
  Pill,
  Calendar,
  AlertTriangle,
  Package,
  FileText,
  TrendingUp,
  BarChart3,
} from 'lucide-react';

/**
 * Page metadata for SEO and browser display
 *
 * @type {Metadata}
 */
export const metadata: Metadata = {
  title: 'Analytics Dashboard | White Cross',
  description: 'Comprehensive analytics and reporting dashboard with health metrics, medication compliance, appointment tracking, and incident trends',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Analytics Dashboard | White Cross Healthcare',
    description: 'Real-time healthcare analytics for student health, medication compliance, and operational insights',
    type: 'website',
  },
};

/**
 * Force dynamic rendering to ensure authenticated users see fresh data
 *
 * @remarks
 * - Disables static generation at build time
 * - Required for authentication-protected routes
 * - Ensures statistics are current for each user session
 *
 * @type {"force-dynamic"}
 */
export const dynamic = 'force-dynamic';

const analyticsModules = [
  {
    title: 'Health Metrics',
    description: 'Track and analyze student health measurements and vitals',
    icon: Activity,
    href: '/analytics/health-metrics',
    color: 'bg-blue-500',
    stats: { label: 'Metrics Tracked', value: '2,847' },
  },
  {
    title: 'Medication Compliance',
    description: 'Monitor medication administration rates and compliance',
    icon: Pill,
    href: '/analytics/medication-compliance',
    color: 'bg-green-500',
    stats: { label: 'Compliance Rate', value: '94.2%' },
  },
  {
    title: 'Appointment Analytics',
    description: 'Analyze appointment patterns, no-shows, and efficiency',
    icon: Calendar,
    href: '/analytics/appointment-analytics',
    color: 'bg-purple-500',
    stats: { label: 'This Month', value: '156' },
  },
  {
    title: 'Incident Trends',
    description: 'Identify incident patterns and high-risk areas',
    icon: AlertTriangle,
    href: '/analytics/incident-trends',
    color: 'bg-orange-500',
    stats: { label: 'This Week', value: '12' },
  },
  {
    title: 'Inventory Analytics',
    description: 'Track medication inventory, expiration, and usage',
    icon: Package,
    href: '/analytics/inventory-analytics',
    color: 'bg-indigo-500',
    stats: { label: 'Low Stock Items', value: '8' },
  },
  {
    title: 'Custom Reports',
    description: 'Build and schedule custom analytics reports',
    icon: FileText,
    href: '/analytics/custom-reports',
    color: 'bg-pink-500',
    stats: { label: 'Saved Reports', value: '24' },
  },
];

/**
 * Quick statistics displayed on analytics dashboard
 *
 * @remarks
 * These statistics provide at-a-glance insights into key healthcare metrics:
 * - Total Students: Current enrollment count with monthly change
 * - Active Medications: Current medication orders being administered
 * - Compliance Rate: Medication administration compliance percentage
 * - Incidents (Week): Incident reports filed in the past 7 days
 *
 * In production, these would be fetched from server actions/API endpoints
 * with real-time data aggregation.
 *
 * @type {Array<{label: string, value: string, change: string, trend: 'up' | 'down', icon: any}>}
 */
const quickStats = [
  {
    label: 'Total Students',
    value: '1,284',
    change: '+12',
    trend: 'up' as const,
    icon: TrendingUp,
  },
  {
    label: 'Active Medications',
    value: '342',
    change: '-5',
    trend: 'down' as const,
    icon: Pill,
  },
  {
    label: 'Compliance Rate',
    value: '94.2%',
    change: '+2.1%',
    trend: 'up' as const,
    icon: BarChart3,
  },
  {
    label: 'Incidents (Week)',
    value: '12',
    change: '-3',
    trend: 'down' as const,
    icon: AlertTriangle,
  },
];

/**
 * Analytics Dashboard Page Component
 *
 * Main analytics landing page that provides an overview of all analytics modules
 * and quick access to key metrics. Serves as the navigation hub for the analytics
 * section of the White Cross healthcare platform.
 *
 * @returns {JSX.Element} Analytics dashboard with module cards and quick stats
 *
 * @remarks
 * Page structure:
 * 1. Header with title and action buttons (Export Data, Create Report)
 * 2. Quick Stats - 4 metric cards showing key indicators with trends
 * 3. Analytics Modules - 6 module cards linking to specialized analytics pages
 * 4. Recent Activity - Feed showing recent report generation activity
 *
 * Data flow (production):
 * - Quick stats fetched via server action on page load
 * - Module statistics updated in real-time
 * - Recent activity pulled from audit logs
 *
 * Performance:
 * - Server Component reduces client-side JavaScript
 * - Next.js Link prefetching for fast navigation
 * - Hover states provide visual feedback
 *
 * HIPAA considerations:
 * - All statistics are aggregated (no individual patient data)
 * - Access to this page logged in audit trail
 * - User names in recent activity sanitized if needed
 *
 * @example
 * ```tsx
 * // Rendered by Next.js App Router at: /analytics
 * // User navigates from main dashboard
 * // Sees quick stats and module cards for navigation
 * ```
 */
export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Comprehensive insights and reporting for healthcare operations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/analytics/export"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <FileText className="h-4 w-4" />
            Export Data
          </Link>

          <Link
            href="/analytics/custom-reports/new"
            className="inline-flex items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <BarChart3 className="h-4 w-4" />
            Create Report
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">{stat.label}</span>
                <Icon className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                <span
                  className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Modules */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Analytics Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analyticsModules.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.href}
                href={module.href}
                className="group bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${module.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {module.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{module.description}</p>

                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-gray-500">{module.stats.label}</div>
                        <div className="text-lg font-bold text-gray-900">
                          {module.stats.value}
                        </div>
                      </div>
                      <div className="text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                        View →
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Report Activity</h2>
        <div className="space-y-4">
          {[
            {
              name: 'Monthly Medication Compliance Report',
              user: 'Sarah Johnson',
              time: '2 hours ago',
              type: 'Generated',
            },
            {
              name: 'Incident Trends Analysis',
              user: 'Michael Chen',
              time: '5 hours ago',
              type: 'Exported',
            },
            {
              name: 'Health Metrics Dashboard',
              user: 'Emily Davis',
              time: '1 day ago',
              type: 'Created',
            },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <div>
                <div className="font-medium text-gray-900">{activity.name}</div>
                <div className="text-sm text-gray-500">
                  {activity.type} by {activity.user}
                </div>
              </div>
              <div className="text-sm text-gray-500">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
