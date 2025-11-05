/**
 * @fileoverview Compliance Navigation Sidebar Component
 * @module app/(dashboard)/compliance/@sidebar
 * @category Compliance - Navigation
 *
 * Comprehensive navigation sidebar for compliance management pages.
 * Provides quick access to audit logs, reports, policies, training,
 * and compliance-related features across different modules.
 *
 * **Navigation Structure:**
 * - Compliance Dashboard
 * - Audit Logs (HIPAA compliant)
 * - Compliance Reports
 * - Policies & Procedures
 * - Training & Certification
 * - Module-Specific Compliance
 *   - Medications Compliance
 *   - Immunizations Compliance
 *
 * **HIPAA Requirements:**
 * - Quick access to audit logs (§ 164.312(b))
 * - Compliance reporting capabilities
 * - Policy acknowledgment tracking
 * - Training verification records
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Shield,
  Activity,
  FileText,
  BookOpen,
  GraduationCap,
  Pill,
  Syringe,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

const complianceNavItems: NavItem[] = [
  {
    name: 'Compliance Dashboard',
    href: '/compliance',
    icon: Shield,
    description: 'Overview and status'
  },
  {
    name: 'Audit Logs',
    href: '/compliance/audits',
    icon: Activity,
    description: 'HIPAA audit trail',
    badge: 'Critical',
    badgeVariant: 'destructive'
  },
  {
    name: 'Compliance Reports',
    href: '/compliance/reports',
    icon: FileText,
    description: 'Generate reports'
  },
  {
    name: 'Policies & Procedures',
    href: '/compliance/policies',
    icon: BookOpen,
    description: 'Policy management'
  },
  {
    name: 'Training & Certification',
    href: '/compliance/training',
    icon: GraduationCap,
    description: 'Staff training'
  }
];

const moduleComplianceItems: NavItem[] = [
  {
    name: 'Medication Compliance',
    href: '/medications/reports/compliance',
    icon: Pill,
    description: 'Medication adherence'
  },
  {
    name: 'Immunization Compliance',
    href: '/immunizations/compliance',
    icon: Syringe,
    description: 'Vaccine requirements'
  }
];

const quickStatsItems = [
  {
    label: 'Compliance Score',
    value: '94%',
    icon: TrendingUp,
    trend: 'up',
    color: 'text-green-600'
  },
  {
    label: 'Open Issues',
    value: '3',
    icon: AlertTriangle,
    trend: 'neutral',
    color: 'text-yellow-600'
  },
  {
    label: 'Audit Logs Today',
    value: '1,247',
    icon: Activity,
    trend: 'up',
    color: 'text-blue-600'
  },
  {
    label: 'Policy Updates',
    value: '2',
    icon: Clock,
    trend: 'neutral',
    color: 'text-purple-600'
  }
];

export default function ComplianceSidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-full bg-gray-50 border-l border-gray-200 overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
            Compliance Navigation
          </h3>
          <p className="text-xs text-gray-600">
            HIPAA-compliant audit and reporting
          </p>
        </div>

        {/* Quick Stats */}
        <Card className="p-3 space-y-3">
          <h4 className="text-xs font-medium text-gray-700 uppercase">Quick Stats</h4>
          <div className="space-y-2">
            {quickStatsItems.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={cn('h-3.5 w-3.5', stat.color)} />
                    <span className="text-xs text-gray-600">{stat.label}</span>
                  </div>
                  <span className={cn('text-xs font-semibold', stat.color)}>
                    {stat.value}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Main Compliance Navigation */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-700 uppercase px-2">
            Core Compliance
          </h4>
          <nav className="space-y-1">
            {complianceNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-start gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                    'hover:bg-white hover:shadow-sm',
                    isActive
                      ? 'bg-white shadow-sm border border-blue-100 text-blue-700'
                      : 'text-gray-700 hover:text-gray-900'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4 mt-0.5 flex-shrink-0',
                      isActive ? 'text-blue-600' : 'text-gray-500'
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn('font-medium', isActive && 'text-blue-700')}>
                        {item.name}
                      </span>
                      {item.badge && (
                        <Badge
                          variant={item.badgeVariant || 'default'}
                          className="text-[10px] px-1.5 py-0"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Module-Specific Compliance */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-700 uppercase px-2">
            Module Compliance
          </h4>
          <nav className="space-y-1">
            {moduleComplianceItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-start gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                    'hover:bg-white hover:shadow-sm',
                    isActive
                      ? 'bg-white shadow-sm border border-blue-100 text-blue-700'
                      : 'text-gray-700 hover:text-gray-900'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4 mt-0.5 flex-shrink-0',
                      isActive ? 'text-blue-600' : 'text-gray-500'
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <span className={cn('font-medium block', isActive && 'text-blue-700')}>
                      {item.name}
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* HIPAA Compliance Notice */}
        <Card className="p-3 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-blue-900">
                HIPAA Compliance
              </h4>
              <p className="text-xs text-blue-700 leading-relaxed">
                All actions are logged for audit purposes. Audit logs are tamper-proof
                and retained for 6 years per HIPAA requirements.
              </p>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-700 uppercase px-2">
            Quick Actions
          </h4>
          <div className="space-y-1">
            <Link
              href="/compliance/reports?action=generate"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-white hover:text-gray-900 rounded-lg transition-colors"
            >
              <FileText className="h-4 w-4 text-gray-500" />
              Generate Report
            </Link>
            <Link
              href="/compliance/audits?filter=today"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-white hover:text-gray-900 rounded-lg transition-colors"
            >
              <Activity className="h-4 w-4 text-gray-500" />
              View Today&apos;s Logs
            </Link>
            <Link
              href="/compliance/policies?status=requires_acknowledgment"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-white hover:text-gray-900 rounded-lg transition-colors"
            >
              <CheckCircle className="h-4 w-4 text-gray-500" />
              Pending Acknowledgments
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
