/**
 * Type definitions for Forms Sidebar components
 */

import type { LucideIcon } from 'lucide-react';

export type FormType =
  | 'enrollment'
  | 'health_screening'
  | 'incident_report'
  | 'permission_slip'
  | 'medical_consent'
  | 'emergency_contact'
  | 'allergy_form'
  | 'medication_authorization'
  | 'assessment'
  | 'survey'
  | 'other';

export type FormStatus = 'draft' | 'published' | 'paused' | 'archived';

export type ActivityType =
  | 'form_created'
  | 'form_published'
  | 'response_received'
  | 'form_shared'
  | 'form_archived';

export interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  action?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  count?: number;
}

export interface FormTemplate {
  id: string;
  title: string;
  description: string;
  type: FormType;
  category: 'healthcare' | 'administrative' | 'emergency' | 'assessment';
  fields: number;
  estimatedTime: number; // minutes
  icon: LucideIcon;
  isPopular: boolean;
  isRequired: boolean;
}

export interface RecentActivity {
  id: string;
  type: ActivityType;
  formTitle: string;
  formId: string;
  timestamp: Date;
  user: {
    name: string;
    role: string;
  };
  details?: string;
}

export interface FormFilter {
  status?: FormStatus;
  type?: FormType;
}

export interface SidebarStat {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export type SidebarSection = 'templates' | 'activity' | 'stats' | null;
