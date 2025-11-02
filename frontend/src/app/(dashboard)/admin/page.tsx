/**
 * @fileoverview Admin Dashboard Page - System administration interface
 * @module app/(dashboard)/admin/page
 * @category Admin - Pages
 */

import { Metadata } from 'next';
import { AdminContent } from './_components/AdminContent';

/**
 * Metadata for the admin dashboard page
 */
export const metadata: Metadata = {
  title: 'System Administration',
  description: 'Comprehensive system administration dashboard for healthcare platform management, user oversight, security monitoring, and HIPAA compliance tracking.',
  keywords: [
    'system administration',
    'healthcare management',
    'user management',
    'security monitoring',
    'system health',
    'audit logs',
    'platform oversight',
    'HIPAA compliance',
    'access control'
  ],
  openGraph: {
    title: 'System Administration | White Cross Healthcare',
    description: 'Advanced healthcare platform administration with comprehensive oversight, security monitoring, and compliance management.',
    type: 'website',
  },
  robots: {
    index: false,
    follow: false
  }
};

/**
 * Admin Dashboard Page Component
 * 
 * Main administrative interface providing comprehensive system oversight including:
 * - System health monitoring and metrics
 * - User management and role administration
 * - Security alerts and threat monitoring
 * - Audit logging and compliance tracking
 * - Quick administrative actions and tools
 * - Real-time system performance data
 * 
 * @returns Server component with admin dashboard content
 */
interface AdminPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function AdminPage({ searchParams }: AdminPageProps) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            System Administration
          </h1>
          <p className="text-gray-600 mt-1">
            Comprehensive healthcare platform management and oversight
          </p>
        </div>
        
        {/* Admin Status Indicators */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            System Healthy
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Admin Active
          </div>
        </div>
      </div>

      {/* Main Admin Content */}
      <AdminContent searchParams={searchParams} />

      {/* Footer Information */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg border">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span>Platform Version: 2.1.4</span>
            <span>•</span>
            <span>Last System Check: Just now</span>
            <span>•</span>
            <span>Uptime: 99.8%</span>
          </div>
          <div className="flex items-center gap-4">
            <span>HIPAA Compliant</span>
            <span>•</span>
            <span>SOC 2 Type II</span>
            <span>•</span>
            <span className="text-green-600 font-medium">All Systems Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}