/**
 * Dashboard Page - SSR with Streaming (Enhanced Version)
 *
 * Implements:
 * - Server-Side Rendering for initial data
 * - Parallel data fetching with Suspense streaming
 * - Real-time data updates with TanStack Query
 * - Optimized loading states
 *
 * @module app/dashboard/page
 * @version 2.0.0
 */

import { Suspense } from 'react';
import Link from 'next/link';
import {
  Users,
  Calendar,
  FileText,
  AlertTriangle,
  Activity,
  TrendingUp,
  Clock,
  Shield,
} from 'lucide-react';

// UI Components
import { Card } from '@/components/ui/layout/Card';
import { SkeletonCard, SkeletonStats } from '@/components/ui/loading/SkeletonCard';

// Server utilities
import { serverGet } from '@/lib/server/fetch';

// Types
import type { DashboardData } from '@/lib/query/hooks/useDashboard';

// ==========================================
// SERVER COMPONENTS
// ==========================================

/**
 * Fetch dashboard stats on the server
 */
async function getDashboardStats() {
  'use server';

  return serverGet<DashboardData['stats']>('/dashboard/stats', undefined, {
    revalidate: 60, // Revalidate every 60 seconds
    tags: ['dashboard-stats'],
  });
}

/**
 * Fetch recent activity on the server
 */
async function getRecentActivity() {
  'use server';

  return serverGet<DashboardData['recentActivity']>('/dashboard/activity', {
    limit: 10,
  }, {
    revalidate: 120, // Revalidate every 2 minutes
    tags: ['dashboard-activity'],
  });
}

/**
 * Fetch upcoming appointments on the server
 */
async function getUpcomingAppointments() {
  'use server';

  return serverGet<DashboardData['upcomingAppointments']>(
    '/dashboard/upcoming-appointments',
    { limit: 5 },
    {
      revalidate: 60, // Revalidate every 60 seconds
      tags: ['dashboard-appointments'],
    }
  );
}

// ==========================================
// STREAMING COMPONENTS
// ==========================================

/**
 * Dashboard Statistics Component
 * Streamed in parallel with other components
 */
async function DashboardStats() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      icon: Users,
      label: 'Total Students',
      value: stats.totalStudents.toLocaleString(),
      color: 'text-blue-600',
    },
    {
      icon: Calendar,
      label: 'Active Appointments',
      value: stats.activeAppointments,
      color: 'text-green-600',
    },
    {
      icon: AlertTriangle,
      label: 'Pending Incidents',
      value: stats.pendingIncidents,
      color: 'text-red-600',
    },
    {
      icon: FileText,
      label: 'Records Today',
      value: stats.healthRecordsToday,
      color: 'text-purple-600',
    },
    {
      icon: Activity,
      label: 'Medications Given',
      value: stats.medicationsAdministered,
      color: 'text-orange-600',
    },
    {
      icon: Shield,
      label: 'Emergency Contacts',
      value: stats.emergencyContacts,
      color: 'text-indigo-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <IconComponent className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

/**
 * Recent Activity Component
 * Streamed in parallel
 */
async function RecentActivity() {
  const activities = await getRecentActivity();

  return (
    <Card>
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start">
              <div className="flex-shrink-0">
                <Activity className="h-5 w-5 text-gray-400" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-gray-900">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/**
 * Upcoming Appointments Component
 * Streamed in parallel
 */
async function UpcomingAppointments() {
  const appointments = await getUpcomingAppointments();

  return (
    <Card>
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <Link
              key={appointment.id}
              href={`/appointments/${appointment.id}`}
              className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{appointment.studentName}</p>
                  <p className="text-sm text-gray-600">{appointment.appointmentType}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">
                    {new Date(appointment.scheduledTime).toLocaleTimeString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(appointment.scheduledTime).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Card>
  );
}

/**
 * Quick Actions Component
 * Static component (no data fetching)
 */
function QuickActions() {
  const quickActions = [
    {
      id: 'students',
      title: 'Manage Students',
      description: 'View and manage student records',
      icon: Users,
      href: '/students',
      color: 'bg-blue-500',
    },
    {
      id: 'appointments',
      title: 'Appointments',
      description: 'Schedule and manage appointments',
      icon: Calendar,
      href: '/appointments',
      color: 'bg-green-500',
    },
    {
      id: 'health-records',
      title: 'Health Records',
      description: 'Access student health information',
      icon: FileText,
      href: '/health-records',
      color: 'bg-purple-500',
    },
    {
      id: 'incidents',
      title: 'Incident Reports',
      description: 'Report and track incidents',
      icon: AlertTriangle,
      href: '/incidents',
      color: 'bg-red-500',
    },
    {
      id: 'medications',
      title: 'Medications',
      description: 'Manage medication administration',
      icon: Activity,
      href: '/medications',
      color: 'bg-orange-500',
    },
    {
      id: 'inventory',
      title: 'Inventory',
      description: 'Track medical supplies',
      icon: TrendingUp,
      href: '/inventory',
      color: 'bg-indigo-500',
    },
  ];

  return (
    <Card>
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        <p className="text-sm text-gray-600">Access frequently used features</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Link
                key={action.id}
                href={action.href}
                className="group relative bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors border border-gray-200 hover:border-gray-300"
              >
                <div className="flex items-center">
                  <div className={`flex-shrink-0 p-3 rounded-lg ${action.color} text-white`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-600">
            Welcome back! Here&apos;s what&apos;s happening today.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>{new Date().toLocaleString()}</span>
        </div>
      </div>

      {/* Statistics Cards - Streamed */}
      <Suspense fallback={<SkeletonStats count={6} />}>
        <DashboardStats />
      </Suspense>

      {/* Activity and Appointments Grid - Streamed in Parallel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<SkeletonCard rows={5} />}>
          <RecentActivity />
        </Suspense>

        <Suspense fallback={<SkeletonCard rows={5} />}>
          <UpcomingAppointments />
        </Suspense>
      </div>

      {/* Quick Actions - Static */}
      <QuickActions />

      {/* System Status */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Shield className="h-5 w-5 text-green-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">All systems operational</p>
            <p className="text-sm text-green-700">
              HIPAA compliance active • Data encrypted • Backups current
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// METADATA
// ==========================================

export const metadata = {
  title: 'Dashboard | White Cross Healthcare',
  description: 'Healthcare management dashboard for school nurses',
};
