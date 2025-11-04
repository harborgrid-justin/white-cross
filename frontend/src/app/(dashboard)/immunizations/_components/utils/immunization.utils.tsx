/**
 * @fileoverview Immunization Utility Functions
 * @module app/immunizations/components/utils
 *
 * Helper functions for immunization data display and formatting.
 * Extracted from ImmunizationsContent for reusability.
 */

import React from 'react';
import {
  Shield,
  Thermometer,
  Heart,
  Activity,
  Syringe,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type {
  ImmunizationType,
  ImmunizationStatus,
  ImmunizationPriority,
} from '../types/immunization.types';

/**
 * Get badge component for immunization status
 * @param status - Current immunization status
 * @returns React badge component with appropriate styling
 */
export const getStatusBadge = (status: ImmunizationStatus): React.ReactNode => {
  const variants: Record<ImmunizationStatus, string> = {
    scheduled: 'bg-blue-100 text-blue-800',
    administered: 'bg-green-100 text-green-800',
    declined: 'bg-red-100 text-red-800',
    deferred: 'bg-yellow-100 text-yellow-800',
    overdue: 'bg-orange-100 text-orange-800',
    completed: 'bg-gray-100 text-gray-800',
    contraindicated: 'bg-purple-100 text-purple-800',
  };

  return (
    <Badge className={variants[status]}>
      {status.replace('_', ' ')}
    </Badge>
  );
};

/**
 * Get badge component for immunization priority
 * @param priority - Priority level of the immunization
 * @returns React badge component with appropriate styling
 */
export const getPriorityBadge = (priority: ImmunizationPriority): React.ReactNode => {
  const variants: Record<ImmunizationPriority, string> = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  };

  return (
    <Badge className={variants[priority]}>
      {priority}
    </Badge>
  );
};

/**
 * Get icon component for vaccine/immunization type
 * @param type - Type of immunization
 * @returns React icon component
 */
export const getTypeIcon = (type: ImmunizationType): React.ReactNode => {
  const icons: Record<ImmunizationType, React.ComponentType<{ className?: string }>> = {
    covid19: Shield,
    flu: Thermometer,
    hepatitis_b: Heart,
    measles: Activity,
    mumps: Activity,
    rubella: Activity,
    polio: Activity,
    tetanus: Shield,
    diphtheria: Shield,
    pertussis: Shield,
    varicella: Activity,
    meningococcal: Shield,
    hpv: Shield,
    pneumococcal: Shield,
  };

  const IconComponent = icons[type] || Syringe;
  return <IconComponent className="h-4 w-4" />;
};

/**
 * Format date string to readable format
 * @param dateStr - ISO date string
 * @returns Formatted date string (e.g., "Jan 15, 2024")
 */
export const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Check if an immunization is overdue
 * @param dueDate - Due date string
 * @param status - Current status of the immunization
 * @returns True if immunization is overdue
 */
export const isOverdue = (dueDate: string, status: ImmunizationStatus): boolean => {
  const excludedStatuses: ImmunizationStatus[] = [
    'administered',
    'completed',
    'declined',
    'contraindicated',
  ];

  return new Date(dueDate) < new Date() && !excludedStatuses.includes(status);
};
