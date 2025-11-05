/**
 * @fileoverview Immunizations Reports Layout - Advanced Analytics & Compliance Reporting
 * @module app/(dashboard)/immunizations/reports/layout
 * @category Healthcare Reporting
 *
 * Specialized layout for immunization reporting and analytics section.
 * Provides navigation between different report types and analytics views.
 */

import React from 'react';
import Link from 'next/link';
import { BarChart3, FileText, TrendingUp, Calendar, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReportsLayoutProps {
  children: React.ReactNode;
}

export default function ReportsLayout({ children }: ReportsLayoutProps) {
  const reportNavigation = [
    {
      href: '/immunizations/reports',
      label: 'Overview',
      icon: BarChart3,
      description: 'General reporting dashboard'
    },
    {
      href: '/immunizations/reports/compliance',
      label: 'Compliance Reports',
      icon: CheckCircle,
      description: 'CDC compliance tracking'
    },
    {
      href: '/immunizations/reports/analytics',
      label: 'Analytics',
      icon: TrendingUp,
      description: 'Trend analysis and insights'
    },
    {
      href: '/immunizations/reports/scheduled',
      label: 'Schedule Reports',
      icon: Calendar,
      description: 'Upcoming immunizations'
    },
    {
      href: '/immunizations/reports/students',
      label: 'Student Reports',
      icon: Users,
      description: 'Individual student tracking'
    },
    {
      href: '/immunizations/reports/overdue',
      label: 'Overdue Reports',
      icon: AlertTriangle,
      description: 'Missing immunizations'
    },
    {
      href: '/immunizations/reports/export',
      label: 'Export Center',
      icon: FileText,
      description: 'Download and export data'
    }
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Reports Navigation Sidebar */}
      <aside className="w-full lg:w-64 bg-white border-r border-gray-200 p-6">
        <div className="mb-6">
          <Link 
            href="/immunizations"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2"
          >
            ← Back to Immunizations
          </Link>
          <h2 className="text-lg font-semibold text-gray-900">Reports & Analytics</h2>
          <p className="text-sm text-gray-600 mt-1">
            Comprehensive immunization reporting and compliance tracking
          </p>
        </div>

        <nav className="space-y-2">
          {reportNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-start gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  "hover:bg-gray-50 hover:text-gray-900",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500"
                )}
              >
                <Icon className="w-5 h-5 mt-0.5 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{item.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-tight">
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Quick Stats Widget */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Quick Stats</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-blue-700">Total Reports</span>
              <span className="font-medium text-blue-900">24</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">This Month</span>
              <span className="font-medium text-blue-900">8</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Overdue Items</span>
              <span className="font-medium text-red-600">3</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 bg-gray-50">
        {children}
      </main>
    </div>
  );
}