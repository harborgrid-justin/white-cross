/**
 * TypeBadge Component
 *
 * Badge component displaying incident types with category-specific icons and styling.
 * Supports multiple incident categories from injuries to medical emergencies.
 *
 * @module pages/incidents/components/TypeBadge
 */

import React from 'react';
import {
  Bandage,
  Thermometer,
  AlertTriangle,
  Shield,
  Siren,
  FileText,
  LucideIcon
} from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * Incident type categories
 */
export type IncidentType =
  | 'INJURY'
  | 'ILLNESS'
  | 'BEHAVIORAL'
  | 'SAFETY'
  | 'MEDICAL_EMERGENCY'
  | 'OTHER';

/**
 * Props for the TypeBadge component
 *
 * @interface TypeBadgeProps
 *
 * @property {IncidentType} type - Type/category of the incident
 * @property {('sm' | 'md' | 'lg')} [size='md'] - Size variant of the badge
 * @property {boolean} [showIcon=true] - Whether to display the type icon
 * @property {string} [className] - Additional CSS classes
 */
export interface TypeBadgeProps {
  /** Type/category of the incident */
  type: IncidentType;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show icon for incident type */
  showIcon?: boolean;
  /** Custom className */
  className?: string;
}

/**
 * Configuration object for incident types
 * Maps each type to its visual properties (label, colors, icon)
 */
const typeConfig: Record<
  IncidentType,
  {
    label: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
    icon: LucideIcon;
  }
> = {
  INJURY: {
    label: 'Injury',
    bgColor: 'bg-red-50 dark:bg-red-950',
    textColor: 'text-red-700 dark:text-red-300',
    borderColor: 'border-red-200 dark:border-red-800',
    icon: Bandage
  },
  ILLNESS: {
    label: 'Illness',
    bgColor: 'bg-orange-50 dark:bg-orange-950',
    textColor: 'text-orange-700 dark:text-orange-300',
    borderColor: 'border-orange-200 dark:border-orange-800',
    icon: Thermometer
  },
  BEHAVIORAL: {
    label: 'Behavioral',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950',
    textColor: 'text-yellow-800 dark:text-yellow-300',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    icon: AlertTriangle
  },
  SAFETY: {
    label: 'Safety',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    textColor: 'text-blue-700 dark:text-blue-300',
    borderColor: 'border-blue-200 dark:border-blue-800',
    icon: Shield
  },
  MEDICAL_EMERGENCY: {
    label: 'Medical Emergency',
    bgColor: 'bg-rose-50 dark:bg-rose-950',
    textColor: 'text-rose-700 dark:text-rose-300',
    borderColor: 'border-rose-200 dark:border-rose-800',
    icon: Siren
  },
  OTHER: {
    label: 'Other',
    bgColor: 'bg-gray-50 dark:bg-gray-900',
    textColor: 'text-gray-700 dark:text-gray-300',
    borderColor: 'border-gray-200 dark:border-gray-700',
    icon: FileText
  }
};

/**
 * Size configuration for the badge
 */
const sizeConfig = {
  sm: {
    container: 'px-2 py-0.5 text-xs gap-1',
    icon: 12
  },
  md: {
    container: 'px-2.5 py-0.5 text-sm gap-1.5',
    icon: 14
  },
  lg: {
    container: 'px-3 py-1 text-base gap-2',
    icon: 16
  }
};

/**
 * TypeBadge - Display incident type with category-specific icons and styling
 *
 * Visual badge component for incident categorization. Helps quickly identify
 * the nature of an incident with appropriate icons and subtle color coding.
 *
 * **Features:**
 * - Type-specific icons for quick recognition
 * - Subtle background colors for differentiation
 * - Three size variants
 * - Compact, rounded design
 * - Dark mode support
 * - Full accessibility with ARIA labels
 *
 * **Incident Types:**
 * - INJURY: Physical injuries requiring medical attention
 * - ILLNESS: Illness or health-related incidents
 * - BEHAVIORAL: Behavioral or disciplinary incidents
 * - SAFETY: Safety concerns or hazards
 * - MEDICAL_EMERGENCY: Critical medical emergencies
 * - OTHER: Miscellaneous or uncategorized incidents
 *
 * @component
 * @param {TypeBadgeProps} props - Component props
 * @returns {JSX.Element} Rendered type badge
 *
 * @example
 * ```tsx
 * // Basic injury type badge
 * <TypeBadge type="INJURY" />
 *
 * // Small medical emergency badge without icon
 * <TypeBadge type="MEDICAL_EMERGENCY" size="sm" showIcon={false} />
 *
 * // Large safety badge with custom class
 * <TypeBadge type="SAFETY" size="lg" className="shadow-sm" />
 * ```
 */
export const TypeBadge: React.FC<TypeBadgeProps> = ({
  type,
  size = 'md',
  showIcon = true,
  className
}) => {
  const config = typeConfig[type];
  const sizeStyles = sizeConfig[size];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium border rounded-md transition-colors duration-200',
        config.bgColor,
        config.textColor,
        config.borderColor,
        sizeStyles.container,
        className
      )}
      role="img"
      aria-label={`Incident type: ${config.label}`}
    >
      {showIcon && (
        <Icon
          size={sizeStyles.icon}
          className="flex-shrink-0"
          aria-hidden="true"
        />
      )}
      <span className="leading-none">{config.label}</span>
    </span>
  );
};

TypeBadge.displayName = 'TypeBadge';

export default React.memo(TypeBadge);
