/**
 * @fileoverview Report Templates Component - Template selection and quick access
 * @module app/(dashboard)/reports/_components/ReportTemplates
 * @category Reports - Components
 */

'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Shield,
  AlertTriangle,
  Pill,
  Users,
  BarChart3,
  Play
} from 'lucide-react';
import type { ReportTemplatesProps, ReportTemplate } from './types';

/**
 * Mock templates data - Replace with actual data source
 */
const mockTemplates: ReportTemplate[] = [
  {
    id: '1',
    name: 'Health Metrics Dashboard',
    description: 'Comprehensive student health indicators and wellness trends',
    category: 'Health Reports',
    icon: Heart,
    parameters: 8,
    lastUsed: '2025-01-15T09:00:00Z',
    useCount: 45
  },
  {
    id: '2',
    name: 'Compliance Audit Report',
    description: 'Regulatory compliance assessment and adherence tracking',
    category: 'Compliance Reports',
    icon: Shield,
    parameters: 12,
    lastUsed: '2025-01-14T16:30:00Z',
    useCount: 23
  },
  {
    id: '3',
    name: 'Incident Analysis Report',
    description: 'Safety incident patterns, response times, and prevention metrics',
    category: 'Safety Reports',
    icon: AlertTriangle,
    parameters: 10,
    lastUsed: '2025-01-13T14:15:00Z',
    useCount: 67
  },
  {
    id: '4',
    name: 'Medication Management',
    description: 'Prescription tracking, adherence rates, and safety monitoring',
    category: 'Medication Reports',
    icon: Pill,
    parameters: 15,
    lastUsed: '2025-01-12T11:00:00Z',
    useCount: 34
  },
  {
    id: '5',
    name: 'Student Population Health',
    description: 'Demographics, health trends, and population-level insights',
    category: 'Population Reports',
    icon: Users,
    parameters: 6,
    lastUsed: '2025-01-11T10:30:00Z',
    useCount: 29
  },
  {
    id: '6',
    name: 'Performance Analytics',
    description: 'Operational efficiency, resource utilization, and KPI tracking',
    category: 'Analytics Reports',
    icon: BarChart3,
    parameters: 20,
    lastUsed: '2025-01-10T15:45:00Z',
    useCount: 56
  }
];

/**
 * ReportTemplates Component
 *
 * Displays popular report templates with quick access functionality.
 *
 * Features:
 * - Template preview cards
 * - Usage count display
 * - Quick generate action
 * - View all templates link
 * - Loading skeleton states
 *
 * @example
 * ```tsx
 * <ReportTemplates
 *   templates={templates}
 *   onTemplateSelect={(id) => console.log('Selected:', id)}
 * />
 * ```
 */
export function ReportTemplates({
  templates: providedTemplates,
  loading = false,
  onTemplateSelect
}: ReportTemplatesProps) {
  // Use provided templates or fallback to mock data
  const templates = providedTemplates.length > 0 ? providedTemplates : mockTemplates;

  // Loading skeleton
  if (loading) {
    return (
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Popular Templates</h3>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const handleTemplateClick = (templateId: string) => {
    if (onTemplateSelect) {
      onTemplateSelect(templateId);
    }
  };

  return (
    <Card>
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Popular Templates</h3>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {templates.slice(0, 3).map((template) => {
            const Icon = template.icon;
            return (
              <div
                key={template.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => handleTemplateClick(template.id)}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{template.name}</p>
                    <p className="text-xs text-gray-600">{template.useCount} uses</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTemplateClick(template.id);
                  }}
                >
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Button variant="ghost" className="w-full text-sm">
            View All Templates
          </Button>
        </div>
      </div>
    </Card>
  );
}
