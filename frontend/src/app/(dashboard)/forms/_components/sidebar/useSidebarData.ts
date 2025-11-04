/**
 * Custom hook providing mock data for sidebar components
 * In a real application, this would fetch data from APIs
 */

import { useMemo } from 'react';
import {
  Plus,
  BarChart3,
  Settings,
  Archive,
  Play,
  Clock,
  TrendingUp,
  AlertCircle,
  Users,
  Shield,
  FileCheck,
  CheckCircle,
  Activity,
} from 'lucide-react';
import type {
  QuickAction,
  FormTemplate,
  RecentActivity,
  SidebarStat,
} from './sidebar.types';

export interface UseSidebarDataReturn {
  quickActions: QuickAction[];
  templates: FormTemplate[];
  recentActivity: RecentActivity[];
  sidebarStats: SidebarStat[];
  weeklySummary: {
    formResponses: number;
    avgCompletion: string;
    newForms: number;
  };
}

/**
 * Hook to provide all sidebar data
 * Memoized for performance
 */
export function useSidebarData(): UseSidebarDataReturn {
  const quickActions: QuickAction[] = useMemo(
    () => [
      {
        id: 'create-form',
        label: 'Create New Form',
        icon: Plus,
        href: '/forms/new',
        variant: 'primary',
      },
      {
        id: 'form-analytics',
        label: 'View Analytics',
        icon: BarChart3,
        href: '/forms/analytics',
        variant: 'outline',
      },
      {
        id: 'form-settings',
        label: 'Form Settings',
        icon: Settings,
        href: '/forms/settings',
        variant: 'outline',
      },
      {
        id: 'archived-forms',
        label: 'Archived Forms',
        icon: Archive,
        href: '/forms?status=archived',
        variant: 'outline',
        count: 12,
      },
    ],
    []
  );

  const templates: FormTemplate[] = useMemo(
    () => [
      {
        id: 'enrollment-template',
        title: 'Student Enrollment Form',
        description:
          'Comprehensive enrollment with health information and emergency contacts',
        type: 'enrollment',
        category: 'administrative',
        fields: 12,
        estimatedTime: 15,
        icon: Users,
        isPopular: true,
        isRequired: true,
      },
      {
        id: 'health-screening-template',
        title: 'Daily Health Screening',
        description: 'COVID-19 and general health screening for students and staff',
        type: 'health_screening',
        category: 'healthcare',
        fields: 6,
        estimatedTime: 3,
        icon: Shield,
        isPopular: true,
        isRequired: true,
      },
      {
        id: 'incident-report-template',
        title: 'Incident Report Form',
        description: 'Document accidents, injuries, or behavioral incidents',
        type: 'incident_report',
        category: 'emergency',
        fields: 8,
        estimatedTime: 10,
        icon: AlertCircle,
        isPopular: false,
        isRequired: true,
      },
      {
        id: 'medication-auth-template',
        title: 'Medication Authorization',
        description: 'Parent authorization for school medication administration',
        type: 'medical_consent',
        category: 'healthcare',
        fields: 7,
        estimatedTime: 8,
        icon: FileCheck,
        isPopular: true,
        isRequired: true,
      },
      {
        id: 'permission-slip-template',
        title: 'Field Trip Permission',
        description: 'Permission form for field trips and off-campus activities',
        type: 'permission_slip',
        category: 'administrative',
        fields: 6,
        estimatedTime: 5,
        icon: CheckCircle,
        isPopular: false,
        isRequired: false,
      },
      {
        id: 'allergy-form-template',
        title: 'Allergy Information Form',
        description: 'Detailed allergy and dietary restriction information',
        type: 'allergy_form',
        category: 'healthcare',
        fields: 9,
        estimatedTime: 12,
        icon: Shield,
        isPopular: false,
        isRequired: true,
      },
      {
        id: 'emergency-contact-template',
        title: 'Emergency Contact Update',
        description: 'Update emergency contact information and medical alerts',
        type: 'emergency_contact',
        category: 'emergency',
        fields: 5,
        estimatedTime: 7,
        icon: AlertCircle,
        isPopular: false,
        isRequired: true,
      },
      {
        id: 'health-assessment-template',
        title: 'Annual Health Assessment',
        description: 'Comprehensive health evaluation and screening results',
        type: 'assessment',
        category: 'assessment',
        fields: 15,
        estimatedTime: 20,
        icon: Activity,
        isPopular: false,
        isRequired: true,
      },
    ],
    []
  );

  const recentActivity: RecentActivity[] = useMemo(
    () => [
      {
        id: 'activity-001',
        type: 'response_received',
        formTitle: 'Daily Health Screening',
        formId: 'form-001',
        timestamp: new Date('2024-10-31T08:45:00'),
        user: { name: 'Parent Johnson', role: 'Parent' },
        details: 'Temperature: 98.6°F, No symptoms',
      },
      {
        id: 'activity-002',
        type: 'form_published',
        formTitle: 'Medication Authorization Form',
        formId: 'form-004',
        timestamp: new Date('2024-10-30T14:20:00'),
        user: { name: 'Jennifer Smith', role: 'School Nurse' },
        details: 'Form published and shared with parents',
      },
      {
        id: 'activity-003',
        type: 'response_received',
        formTitle: 'Student Enrollment Form',
        formId: 'form-002',
        timestamp: new Date('2024-10-30T11:15:00'),
        user: { name: 'Parent Wilson', role: 'Parent' },
        details: 'New student enrollment completed',
      },
      {
        id: 'activity-004',
        type: 'form_created',
        formTitle: 'Field Trip Permission Slip',
        formId: 'form-005',
        timestamp: new Date('2024-10-29T16:30:00'),
        user: { name: 'Teacher Wilson', role: 'Teacher' },
        details: 'Draft created for Science Museum trip',
      },
      {
        id: 'activity-005',
        type: 'response_received',
        formTitle: 'Incident Report Form',
        formId: 'form-003',
        timestamp: new Date('2024-10-29T13:45:00'),
        user: { name: 'Jennifer Smith', role: 'School Nurse' },
        details: 'Minor playground incident documented',
      },
    ],
    []
  );

  const sidebarStats: SidebarStat[] = useMemo(
    () => [
      {
        label: 'Active Forms',
        value: '15',
        icon: Play,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
      },
      {
        label: 'Draft Forms',
        value: '3',
        icon: Clock,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
      },
      {
        label: "Today's Responses",
        value: '42',
        icon: TrendingUp,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
      },
      {
        label: 'Critical Forms',
        value: '2',
        icon: AlertCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
      },
    ],
    []
  );

  const weeklySummary = useMemo(
    () => ({
      formResponses: 127,
      avgCompletion: '84.2%',
      newForms: 3,
    }),
    []
  );

  return {
    quickActions,
    templates,
    recentActivity,
    sidebarStats,
    weeklySummary,
  };
}
