/**
 * @fileoverview Billing Feature Layout with Sidebar Navigation
 *
 * Feature-specific layout for the billing section of the White Cross Healthcare Platform.
 * Provides comprehensive sidebar navigation for billing management, payment processing,
 * insurance claims, and financial reporting. This layout wraps all billing-related pages.
 *
 * @module app/(dashboard)/billing/layout
 * @category Healthcare
 * @subcategory Billing
 *
 * @since 1.0.0
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: {
    template: '%s | Billing | White Cross',
    default: 'Billing | White Cross'
  },
  description: 'Billing and payment management for healthcare services'
};

interface BillingLayoutProps {
  children: ReactNode;
}

export default function BillingLayout({ children }: BillingLayoutProps) {
  return (
    <div className="flex h-full">
      {/* Sidebar Navigation */}
      <aside className="hidden w-64 border-r border-gray-200 bg-white lg:block">
        <nav className="flex h-full flex-col">
          <div className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            <h2 className="mb-4 px-4 text-lg font-semibold text-gray-900">
              Billing
            </h2>

            {/* Main Navigation */}
            <div className="space-y-1">
              <NavLink href="/billing">All Billing</NavLink>
              <NavLink href="/billing/new">New Invoice</NavLink>
            </div>

            {/* Invoices */}
            <div className="pt-6">
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Invoices
              </h3>
              <div className="space-y-1">
                <NavLink href="/billing/pending">Pending</NavLink>
                <NavLink href="/billing/overdue">Overdue</NavLink>
                <NavLink href="/billing/paid">Paid</NavLink>
                <NavLink href="/billing/cancelled">Cancelled</NavLink>
              </div>
            </div>

            {/* Payments */}
            <div className="pt-6">
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Payments
              </h3>
              <div className="space-y-1">
                <NavLink href="/billing/payments">All Payments</NavLink>
                <NavLink href="/billing/payment-plans">Payment Plans</NavLink>
                <NavLink href="/billing/refunds">Refunds</NavLink>
              </div>
            </div>

            {/* Insurance */}
            <div className="pt-6">
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Insurance
              </h3>
              <div className="space-y-1">
                <NavLink href="/billing/insurance">Insurance Claims</NavLink>
                <NavLink href="/billing/coverage">Coverage Verification</NavLink>
                <NavLink href="/billing/reimbursements">Reimbursements</NavLink>
              </div>
            </div>

            {/* Reports */}
            <div className="pt-6">
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Reports
              </h3>
              <div className="space-y-1">
                <NavLink href="/billing/reports">All Reports</NavLink>
                <NavLink href="/billing/reports/revenue">Revenue</NavLink>
                <NavLink href="/billing/reports/collections">Collections</NavLink>
                <NavLink href="/billing/reports/tax">Tax Reports</NavLink>
              </div>
            </div>

            {/* Settings */}
            <div className="pt-6">
              <NavLink href="/billing/settings">Settings</NavLink>
              <NavLink href="/billing/payment-methods">Payment Methods</NavLink>
              <NavLink href="/billing/tax-settings">Tax Settings</NavLink>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-t border-gray-200 p-4">
            <Link
              href="/billing/emergency-billing"
              className="block rounded-lg bg-orange-50 px-4 py-3 text-center text-sm font-medium text-orange-700 hover:bg-orange-100"
            >
              Emergency Billing
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

function NavLink({
  href,
  children
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    >
      {children}
    </Link>
  );
}