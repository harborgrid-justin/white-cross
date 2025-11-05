/**
 * @fileoverview Settings Layout with Sidebar Navigation
 * @module app/(dashboard)/settings/layout
 * @category Settings
 *
 * Provides comprehensive settings management with tabbed navigation
 * for profile, security, notifications, privacy, integrations, and system settings.
 */

'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  User,
  Shield,
  Bell,
  Lock,
  Plug,
  Palette,
  Database,
  Key,
  CreditCard,
  FileText
} from 'lucide-react';

interface SettingsLayoutProps {
  children: ReactNode;
}

const settingsNavigation = [
  {
    name: 'Profile',
    href: '/settings/profile',
    icon: User,
    description: 'Manage your personal information',
    exact: false
  },
  {
    name: 'Account Security',
    href: '/settings/security',
    icon: Shield,
    description: 'Password, 2FA, and security settings'
  },
  {
    name: 'Notifications',
    href: '/settings/notifications',
    icon: Bell,
    description: 'Configure email and push notifications'
  },
  {
    name: 'Privacy',
    href: '/settings/privacy',
    icon: Lock,
    description: 'Data privacy and visibility settings'
  },
  {
    name: 'Appearance',
    href: '/settings/appearance',
    icon: Palette,
    description: 'Theme and display preferences'
  },
  {
    name: 'Integrations',
    href: '/settings/integrations',
    icon: Plug,
    description: 'Connected apps and services'
  },
  {
    name: 'Billing',
    href: '/settings/billing',
    icon: CreditCard,
    description: 'Subscription and payment methods'
  },
  {
    name: 'API Keys',
    href: '/settings/api-keys',
    icon: Key,
    description: 'Manage API access tokens'
  },
  {
    name: 'Data & Storage',
    href: '/settings/data',
    icon: Database,
    description: 'Data export and account management'
  }
];

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your account settings, preferences, and integrations
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              {settingsNavigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href, item.exact);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-start gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                      active
                        ? 'bg-blue-50 text-blue-700 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-5 w-5 mt-0.5 flex-shrink-0',
                        active ? 'text-blue-600' : 'text-gray-400'
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <div className={cn('font-medium', active && 'text-blue-700')}>
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Help Section */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-blue-900">Need Help?</h3>
                  <p className="text-xs text-blue-700 mt-1">
                    Visit our documentation or contact support for assistance.
                  </p>
                  <Link
                    href="/docs"
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium mt-2 inline-block"
                  >
                    View Documentation →
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
