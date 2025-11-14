/**
 * Configuration utilities for ComplianceAudit module
 *
 * Provides configuration objects and helper functions for rendering
 * audit status, types, priorities, and finding severities with
 * appropriate styling and icons.
 *
 * @module ComplianceAudit/configs
 */

import {
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Shield,
  Building,
  Globe,
  Award,
  Target,
  Flag,
  Eye
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { AuditStatus, AuditType, AuditPriority, FindingSeverity } from './types';

/**
 * Status configuration interface
 */
export interface StatusConfig {
  /** CSS color classes for styling */
  color: string;
  /** Lucide icon component */
  icon: LucideIcon;
  /** Display label */
  label: string;
}

/**
 * Type configuration interface
 */
export interface TypeConfig {
  /** Display label */
  label: string;
  /** CSS color classes for styling */
  color: string;
  /** Lucide icon component */
  icon: LucideIcon;
}

/**
 * Priority configuration interface
 */
export interface PriorityConfig {
  /** Text color class */
  color: string;
  /** Dot background color class */
  dot: string;
}

/**
 * Finding severity configuration interface
 */
export interface FindingSeverityConfig {
  /** CSS color classes for styling */
  color: string;
  /** Display label */
  label: string;
  /** Lucide icon component */
  icon: LucideIcon;
}

/**
 * Gets configuration for audit status
 *
 * Returns styling, icon, and label information for rendering
 * an audit status badge or indicator.
 *
 * @param status - The audit status
 * @returns Configuration object with color, icon, and label
 *
 * @example
 * ```tsx
 * const config = getStatusConfig('in-progress');
 * const Icon = config.icon;
 * return <span className={config.color}><Icon /> {config.label}</span>;
 * ```
 */
export const getStatusConfig = (status: AuditStatus): StatusConfig => {
  const configs: Record<AuditStatus, StatusConfig> = {
    scheduled: {
      color: 'text-blue-600 bg-blue-100 border-blue-200',
      icon: Calendar,
      label: 'Scheduled'
    },
    'in-progress': {
      color: 'text-yellow-600 bg-yellow-100 border-yellow-200',
      icon: Clock,
      label: 'In Progress'
    },
    completed: {
      color: 'text-green-600 bg-green-100 border-green-200',
      icon: CheckCircle,
      label: 'Completed'
    },
    cancelled: {
      color: 'text-gray-600 bg-gray-100 border-gray-200',
      icon: AlertCircle,
      label: 'Cancelled'
    },
    overdue: {
      color: 'text-red-600 bg-red-100 border-red-200',
      icon: AlertTriangle,
      label: 'Overdue'
    }
  };
  return configs[status];
};

/**
 * Gets configuration for audit type
 *
 * Returns styling, icon, and label information for rendering
 * an audit type badge or indicator.
 *
 * @param type - The audit type
 * @returns Configuration object with label, color, and icon
 *
 * @example
 * ```tsx
 * const config = getTypeConfig('regulatory');
 * const Icon = config.icon;
 * return <span className={config.color}><Icon /> {config.label}</span>;
 * ```
 */
export const getTypeConfig = (type: AuditType): TypeConfig => {
  const configs: Record<AuditType, TypeConfig> = {
    internal: {
      label: 'Internal',
      color: 'bg-blue-100 text-blue-800',
      icon: Building
    },
    external: {
      label: 'External',
      color: 'bg-purple-100 text-purple-800',
      icon: Globe
    },
    regulatory: {
      label: 'Regulatory',
      color: 'bg-red-100 text-red-800',
      icon: Shield
    },
    certification: {
      label: 'Certification',
      color: 'bg-green-100 text-green-800',
      icon: Award
    },
    compliance: {
      label: 'Compliance',
      color: 'bg-orange-100 text-orange-800',
      icon: Target
    },
    risk: {
      label: 'Risk',
      color: 'bg-yellow-100 text-yellow-800',
      icon: Flag
    }
  };
  return configs[type];
};

/**
 * Gets configuration for audit priority
 *
 * Returns styling information for rendering priority indicators.
 *
 * @param priority - The audit priority level
 * @returns Configuration object with color classes
 *
 * @example
 * ```tsx
 * const config = getPriorityConfig('high');
 * return (
 *   <>
 *     <div className={config.dot} />
 *     <span className={config.color}>High</span>
 *   </>
 * );
 * ```
 */
export const getPriorityConfig = (priority: AuditPriority): PriorityConfig => {
  const configs: Record<AuditPriority, PriorityConfig> = {
    low: {
      color: 'text-gray-600',
      dot: 'bg-gray-400'
    },
    medium: {
      color: 'text-yellow-600',
      dot: 'bg-yellow-400'
    },
    high: {
      color: 'text-orange-600',
      dot: 'bg-orange-400'
    },
    critical: {
      color: 'text-red-600',
      dot: 'bg-red-400'
    }
  };
  return configs[priority];
};

/**
 * Gets configuration for finding severity
 *
 * Returns styling, icon, and label information for rendering
 * finding severity badges.
 *
 * @param severity - The finding severity level
 * @returns Configuration object with color, label, and icon
 *
 * @example
 * ```tsx
 * const config = getFindingSeverityConfig('critical');
 * const Icon = config.icon;
 * return <span className={config.color}><Icon /> {config.label}</span>;
 * ```
 */
export const getFindingSeverityConfig = (severity: FindingSeverity): FindingSeverityConfig => {
  const configs: Record<FindingSeverity, FindingSeverityConfig> = {
    critical: {
      color: 'text-red-600 bg-red-100',
      label: 'Critical',
      icon: AlertTriangle
    },
    major: {
      color: 'text-orange-600 bg-orange-100',
      label: 'Major',
      icon: AlertCircle
    },
    minor: {
      color: 'text-yellow-600 bg-yellow-100',
      label: 'Minor',
      icon: Flag
    },
    observation: {
      color: 'text-blue-600 bg-blue-100',
      label: 'Observation',
      icon: Eye
    }
  };
  return configs[severity];
};
