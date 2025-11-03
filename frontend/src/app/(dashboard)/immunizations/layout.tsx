/**
 * @fileoverview Immunizations Feature Layout with Comprehensive Sidebar Navigation
 *
 * Feature-specific layout for the immunizations section of the White Cross Healthcare Platform.
 * Provides CDC-compliant navigation for vaccine administration tracking, compliance monitoring,
 * exemption management, and CDC/ACIP schedule adherence.
 *
 * @module app/(dashboard)/immunizations/layout
 * @category Healthcare
 * @subcategory Immunizations
 * @see {@link https://www.cdc.gov/vaccines/schedules/index.html | CDC Vaccination Schedules}
 * @since 1.0.0
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Syringe,
  Calendar,
  AlertTriangle,
  CheckCircle,
  FileText,
  Shield,
  ClipboardList,
  Settings,
  BarChart3,
  Clock,
  XCircle,
  FileCheck,
  School,
  TrendingUp,
  Plus,
  ListChecks
} from 'lucide-react';

interface NavLink {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  description?: string;
}

interface NavSection {
  title: string;
  links: NavLink[];
}

export default function ImmunizationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navigationSections: NavSection[] = [
    {
      title: 'Main',
      links: [
        {
          href: '/immunizations',
          label: 'All Immunizations',
          icon: Syringe,
          description: 'View all vaccination records',
        },
        {
          href: '/immunizations/new',
          label: 'Record Vaccine',
          icon: Plus,
          description: 'Record new vaccine administration',
        },
      ],
    },
    {
      title: 'Administration',
      links: [
        {
          href: '/immunizations/due',
          label: 'Due Vaccines',
          icon: Clock,
          description: 'Vaccines due for administration',
        },
        {
          href: '/immunizations/overdue',
          label: 'Overdue Vaccines',
          icon: AlertTriangle,
          description: 'Past due vaccinations requiring action',
        },
        {
          href: '/immunizations/scheduled',
          label: 'Scheduled',
          icon: Calendar,
          description: 'Upcoming vaccination appointments',
        },
      ],
    },
    {
      title: 'Compliance',
      links: [
        {
          href: '/immunizations/compliance',
          label: 'Compliance Dashboard',
          icon: ListChecks,
          description: 'Overall immunization compliance tracking',
        },
        {
          href: '/immunizations/exemptions',
          label: 'Exemptions',
          icon: FileCheck,
          description: 'Manage vaccination exemptions',
        },
        {
          href: '/immunizations/school-entry',
          label: 'School Entry Requirements',
          icon: School,
          description: 'School entry compliance verification',
        },
      ],
    },
    {
      title: 'CDC Schedules',
      links: [
        {
          href: '/immunizations/schedules',
          label: 'Recommended Schedules',
          icon: ClipboardList,
          description: 'CDC recommended vaccination schedules',
        },
        {
          href: '/immunizations/schedules/catch-up',
          label: 'Catch-Up Schedules',
          icon: TrendingUp,
          description: 'Catch-up schedules for missed vaccines',
        },
        {
          href: '/immunizations/schedules/age-based',
          label: 'Age-Based Recommendations',
          icon: Calendar,
          description: 'Age-specific vaccination recommendations',
        },
      ],
    },
    {
      title: 'Reports',
      links: [
        {
          href: '/immunizations/reports',
          label: 'All Reports',
          icon: BarChart3,
          description: 'Comprehensive immunization reports',
        },
        {
          href: '/immunizations/reports/compliance',
          label: 'Compliance Report',
          icon: CheckCircle,
          description: 'Student compliance and vaccination rates',
        },
        {
          href: '/immunizations/reports/exemptions',
          label: 'Exemption Tracking',
          icon: XCircle,
          description: 'Exemption statistics and trends',
        },
        {
          href: '/immunizations/reports/state-reporting',
          label: 'State Reporting',
          icon: FileText,
          description: 'State immunization registry reports',
        },
      ],
    },
    {
      title: 'Settings',
      links: [
        {
          href: '/immunizations/settings',
          label: 'Configuration',
          icon: Settings,
          description: 'Immunization system settings',
        },
        {
          href: '/immunizations/settings/vaccines',
          label: 'Vaccine Catalog',
          icon: Shield,
          description: 'Manage vaccine inventory and CVX codes',
        },
      ],
    },
  ];

  const isActiveLink = (href: string): boolean => {
    if (href === '/immunizations') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <nav className="p-4 space-y-6 overflow-y-auto h-screen sticky top-0">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Syringe className="h-6 w-6" />
              <h2 className="text-lg font-semibold">Immunizations</h2>
            </div>
            <p className="text-xs text-gray-500">CDC-Compliant Vaccine Tracking</p>
          </div>

          {navigationSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                {section.title}
              </h3>
              <ul className="space-y-0.5">
                {section.links.map((link) => {
                  const Icon = link.icon;
                  const isActive = isActiveLink(link.href);

                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors group',
                          isActive
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        )}
                        title={link.description}
                      >
                        <Icon
                          className={cn(
                            'h-4 w-4 flex-shrink-0',
                            isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                          )}
                        />
                        <span className="flex-1 truncate">{link.label}</span>
                        {link.badge && (
                          <span
                            className={cn(
                              'px-2 py-0.5 text-xs font-medium rounded-full',
                              isActive
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-600'
                            )}
                          >
                            {link.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <div className="mt-8 px-3 py-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-start gap-2 mb-2">
              <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-semibold text-blue-900 mb-1">
                  CDC Compliant
                </h4>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Follows CDC/ACIP vaccination schedules and VIS requirements
                </p>
              </div>
            </div>
          </div>

          <div className="px-3 py-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-xs font-semibold text-gray-700 mb-3">Quick Stats</h4>
            <dl className="space-y-2">
              <div className="flex justify-between text-xs">
                <dt className="text-gray-600">Compliance Rate</dt>
                <dd className="font-semibold text-green-600">94.8%</dd>
              </div>
              <div className="flex justify-between text-xs">
                <dt className="text-gray-600">Due This Week</dt>
                <dd className="font-semibold text-orange-600">23</dd>
              </div>
              <div className="flex justify-between text-xs">
                <dt className="text-gray-600">Overdue</dt>
                <dd className="font-semibold text-red-600">7</dd>
              </div>
            </dl>
          </div>
        </nav>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}