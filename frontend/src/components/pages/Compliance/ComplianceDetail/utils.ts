import {
  CheckCircle,
  AlertCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { ComplianceStatus, ComplianceCategory, CompliancePriority } from '../ComplianceCard';

/**
 * Status configuration for visual representation
 */
export interface StatusConfig {
  color: string;
  icon: typeof CheckCircle;
  label: string;
}

/**
 * Category configuration for visual representation
 */
export interface CategoryConfig {
  label: string;
  color: string;
}

/**
 * Priority configuration for visual representation
 */
export interface PriorityConfig {
  color: string;
  dot: string;
  label: string;
}

/**
 * Gets status configuration including color, icon, and label
 *
 * @param status - Compliance status
 * @returns Status configuration object
 */
export const getStatusConfig = (status: ComplianceStatus): StatusConfig => {
  const configs: Record<ComplianceStatus, StatusConfig> = {
    compliant: {
      color: 'text-green-600 bg-green-100 border-green-200',
      icon: CheckCircle,
      label: 'Compliant'
    },
    'non-compliant': {
      color: 'text-red-600 bg-red-100 border-red-200',
      icon: AlertCircle,
      label: 'Non-Compliant'
    },
    pending: {
      color: 'text-yellow-600 bg-yellow-100 border-yellow-200',
      icon: Clock,
      label: 'Pending'
    },
    expired: {
      color: 'text-red-600 bg-red-100 border-red-200',
      icon: AlertTriangle,
      label: 'Expired'
    },
    warning: {
      color: 'text-orange-600 bg-orange-100 border-orange-200',
      icon: AlertTriangle,
      label: 'Warning'
    }
  };
  return configs[status];
};

/**
 * Gets category configuration including label and color
 *
 * @param category - Compliance category
 * @returns Category configuration object
 */
export const getCategoryConfig = (category: ComplianceCategory): CategoryConfig => {
  const configs: Record<ComplianceCategory, CategoryConfig> = {
    hipaa: { label: 'HIPAA', color: 'bg-blue-100 text-blue-800' },
    ferpa: { label: 'FERPA', color: 'bg-purple-100 text-purple-800' },
    clia: { label: 'CLIA', color: 'bg-green-100 text-green-800' },
    osha: { label: 'OSHA', color: 'bg-orange-100 text-orange-800' },
    state: { label: 'State', color: 'bg-indigo-100 text-indigo-800' },
    federal: { label: 'Federal', color: 'bg-red-100 text-red-800' },
    local: { label: 'Local', color: 'bg-gray-100 text-gray-800' },
    internal: { label: 'Internal', color: 'bg-teal-100 text-teal-800' }
  };
  return configs[category];
};

/**
 * Gets priority configuration including color, dot color, and label
 *
 * @param priority - Compliance priority
 * @returns Priority configuration object
 */
export const getPriorityConfig = (priority: CompliancePriority): PriorityConfig => {
  const configs: Record<CompliancePriority, PriorityConfig> = {
    low: { color: 'text-gray-600', dot: 'bg-gray-400', label: 'Low' },
    medium: { color: 'text-yellow-600', dot: 'bg-yellow-400', label: 'Medium' },
    high: { color: 'text-orange-600', dot: 'bg-orange-400', label: 'High' },
    critical: { color: 'text-red-600', dot: 'bg-red-400', label: 'Critical' }
  };
  return configs[priority];
};

/**
 * Calculates the number of days until a due date
 *
 * @param dueDate - Due date as ISO string
 * @returns Number of days until due (negative if overdue)
 */
export const getDaysUntilDue = (dueDate: string): number => {
  const due = new Date(dueDate);
  const now = new Date();
  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Formats a date string to localized date
 *
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

/**
 * Gets color class for days until due
 *
 * @param daysUntilDue - Number of days until due date
 * @returns Tailwind color class
 */
export const getDueDateColorClass = (daysUntilDue: number): string => {
  if (daysUntilDue <= 0) return 'text-red-600';
  if (daysUntilDue <= 7) return 'text-orange-600';
  return 'text-gray-500';
};

/**
 * Gets formatted due date message
 *
 * @param daysUntilDue - Number of days until due date
 * @returns Formatted message
 */
export const getDueDateMessage = (daysUntilDue: number): string => {
  if (daysUntilDue <= 0) return 'Overdue';
  if (daysUntilDue === 1) return '1 day left';
  return `${daysUntilDue} days left`;
};

/**
 * Gets color class for risk level
 *
 * @param level - Risk level (low, medium, high, critical)
 * @returns Tailwind color class
 */
export const getRiskLevelColorClass = (level: string): string => {
  switch (level) {
    case 'critical':
      return 'text-red-600';
    case 'high':
      return 'text-orange-600';
    case 'medium':
      return 'text-yellow-600';
    default:
      return 'text-green-600';
  }
};
