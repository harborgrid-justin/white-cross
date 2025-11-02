/**
 * Billing Management Route Group Layout
 * 
 * Advanced layout using Next.js route groups for better organization
 * and parallel route support for complex billing management interfaces.
 */

import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Management | Billing | White Cross',
    default: 'Management | Billing | White Cross'
  },
  description: 'Advanced billing management interface with parallel route support'
};

interface BillingManagementLayoutProps {
  children: ReactNode;
  overview?: ReactNode;  // Parallel route slot
  analytics?: ReactNode; // Parallel route slot
  actions?: ReactNode;   // Parallel route slot
}

export default function BillingManagementLayout({
  children,
  overview,
  analytics,
  actions
}: BillingManagementLayoutProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Primary Content */}
        <div className="lg:col-span-2">
          {children}
        </div>

        {/* Parallel Route: Overview */}
        <div className="lg:col-span-1">
          {overview && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Overview
              </h3>
              {overview}
            </div>
          )}
        </div>

        {/* Parallel Route: Actions */}
        <div className="lg:col-span-1">
          {actions && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Quick Actions
              </h3>
              {actions}
            </div>
          )}
        </div>
      </div>

      {/* Parallel Route: Analytics - Full Width */}
      {analytics && (
        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Analytics Dashboard
          </h3>
          {analytics}
        </div>
      )}
    </div>
  );
}
