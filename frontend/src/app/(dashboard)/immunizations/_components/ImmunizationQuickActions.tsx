/**
 * @fileoverview Immunization Quick Actions Component
 * @module app/(dashboard)/immunizations/_components/ImmunizationQuickActions
 * @category Healthcare - Immunizations
 */

'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { 
  Plus,
  Calendar,
  FileText,
  Upload,
  Bell,
  BarChart3,
  ClipboardList,
  Users,
  Settings
} from 'lucide-react';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  bgColor: string;
  href: string;
}

export default function ImmunizationQuickActions() {
  const router = useRouter();

  const quickActions: QuickAction[] = [
    {
      title: 'Record Vaccine',
      description: 'Document new immunization',
      icon: Plus,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      href: '/immunizations/new'
    },
    {
      title: 'Schedule Clinic',
      description: 'Plan vaccination event',
      icon: Calendar,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      href: '/immunizations/schedule-clinic'
    },
    {
      title: 'Generate Report',
      description: 'Create compliance report',
      icon: FileText,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      href: '/immunizations/reports'
    },
    {
      title: 'Import Records',
      description: 'Bulk upload vaccine data',
      icon: Upload,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      href: '/immunizations/import'
    },
    {
      title: 'Send Reminders',
      description: 'Notify parents/guardians',
      icon: Bell,
      iconColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      href: '/immunizations/reminders'
    },
    {
      title: 'View Analytics',
      description: 'Immunization trends',
      icon: BarChart3,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      href: '/immunizations/analytics'
    },
    {
      title: 'Audit Logs',
      description: 'Review access history',
      icon: ClipboardList,
      iconColor: 'text-pink-600',
      bgColor: 'bg-pink-50',
      href: '/immunizations/audit-logs'
    },
    {
      title: 'Manage Students',
      description: 'Update student info',
      icon: Users,
      iconColor: 'text-teal-600',
      bgColor: 'bg-teal-50',
      href: '/students?view=immunizations'
    }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          <p className="text-sm text-gray-600 mt-1">
            Common immunization management tasks
          </p>
        </div>
        <button
          onClick={() => router.push('/immunizations/settings')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Immunization settings"
        >
          <Settings className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={() => router.push(action.href)}
              className="group flex flex-col items-center p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-center bg-white"
            >
              <div
                className={`p-3 rounded-full ${action.bgColor} group-hover:scale-110 transition-transform duration-200 mb-3`}
              >
                <Icon className={`h-6 w-6 ${action.iconColor}`} />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                {action.title}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2">
                {action.description}
              </p>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
