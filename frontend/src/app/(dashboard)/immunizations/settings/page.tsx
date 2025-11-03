/**
 * @fileoverview Immunization Settings Page
 * @module app/(dashboard)/immunizations/settings/page
 *
 * Immunization system configuration and settings.
 *
 * @since 1.0.0
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Shield, Bell, FileText, Database } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Settings | Immunizations',
  description: 'Immunization system configuration',
};

export default async function SettingsPage() {
  const settingsSections = [
    {
      title: 'Vaccine Catalog',
      description: 'Manage vaccine inventory and CVX codes',
      href: '/immunizations/settings/vaccines',
      icon: Shield,
    },
    {
      title: 'Notification Preferences',
      description: 'Configure immunization notifications and alerts',
      href: '/immunizations/settings/notifications',
      icon: Bell,
    },
    {
      title: 'VIS Templates',
      description: 'Manage Vaccine Information Statement templates',
      href: '/immunizations/settings/vis-templates',
      icon: FileText,
    },
    {
      title: 'State Registry',
      description: 'Configure state immunization registry connection',
      href: '/immunizations/settings/registry',
      icon: Database,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <PageHeader
          title="Immunization Settings"
          description="Configure immunization system preferences and integrations"
        />

        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              return (
                <Link key={section.href} href={section.href}>
                  <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-blue-50">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {section.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {section.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
