/**
 * QuickActionsWidget Component - Common Action Buttons
 *
 * Displays a grid of quick action buttons for frequently used features.
 * Supports icons, labels, permission-based visibility, and click handlers.
 *
 * @module components/features/dashboard/QuickActionsWidget
 */

import React, { useMemo } from 'react';
import { LucideIcon } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Quick action button configuration
 * @interface QuickAction
 * @property {string} id - Unique identifier
 * @property {string} label - Action button label
 * @property {string} [description] - Optional description text
 * @property {LucideIcon} icon - Lucide icon component
 * @property {() => void} onClick - Click handler
 * @property {'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo' | 'pink'} [color] - Button color theme
 * @property {boolean} [disabled] - Whether button is disabled
 * @property {string | number} [badge] - Badge to show count or notification
 */
export interface QuickAction {
  id: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  onClick: () => void;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo' | 'pink';
  disabled?: boolean;
  badge?: string | number;
}

/**
 * Props for QuickActionsWidget component
 * @interface QuickActionsWidgetProps
 * @property {string} [title='Quick Actions'] - Widget title
 * @property {string} [subtitle] - Optional subtitle
 * @property {QuickAction[]} actions - Array of action configurations
 * @property {boolean} [darkMode=false] - Enable dark theme
 * @property {string} [className=''] - Additional CSS classes
 * @property {2 | 3 | 4} [columns=3] - Number of columns in grid
 * @property {'sm' | 'md' | 'lg'} [size='md'] - Button size
 */
export interface QuickActionsWidgetProps {
  title?: string;
  subtitle?: string;
  actions: QuickAction[];
  darkMode?: boolean;
  className?: string;
  columns?: 2 | 3 | 4;
  size?: 'sm' | 'md' | 'lg';
}

// ============================================================================
// HELPERS
// ============================================================================

const getColorClasses = (color: QuickAction['color'], darkMode: boolean) => {
  const colors = {
    blue: {
      bg: darkMode ? 'bg-blue-900/20' : 'bg-blue-50',
      hover: darkMode ? 'hover:bg-blue-900/30' : 'hover:bg-blue-100',
      icon: darkMode ? 'text-blue-400' : 'text-blue-600',
      text: darkMode ? 'text-blue-400' : 'text-blue-700'
    },
    green: {
      bg: darkMode ? 'bg-green-900/20' : 'bg-green-50',
      hover: darkMode ? 'hover:bg-green-900/30' : 'hover:bg-green-100',
      icon: darkMode ? 'text-green-400' : 'text-green-600',
      text: darkMode ? 'text-green-400' : 'text-green-700'
    },
    red: {
      bg: darkMode ? 'bg-red-900/20' : 'bg-red-50',
      hover: darkMode ? 'hover:bg-red-900/30' : 'hover:bg-red-100',
      icon: darkMode ? 'text-red-400' : 'text-red-600',
      text: darkMode ? 'text-red-400' : 'text-red-700'
    },
    yellow: {
      bg: darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50',
      hover: darkMode ? 'hover:bg-yellow-900/30' : 'hover:bg-yellow-100',
      icon: darkMode ? 'text-yellow-400' : 'text-yellow-600',
      text: darkMode ? 'text-yellow-400' : 'text-yellow-700'
    },
    purple: {
      bg: darkMode ? 'bg-purple-900/20' : 'bg-purple-50',
      hover: darkMode ? 'hover:bg-purple-900/30' : 'hover:bg-purple-100',
      icon: darkMode ? 'text-purple-400' : 'text-purple-600',
      text: darkMode ? 'text-purple-400' : 'text-purple-700'
    },
    indigo: {
      bg: darkMode ? 'bg-indigo-900/20' : 'bg-indigo-50',
      hover: darkMode ? 'hover:bg-indigo-900/30' : 'hover:bg-indigo-100',
      icon: darkMode ? 'text-indigo-400' : 'text-indigo-600',
      text: darkMode ? 'text-indigo-400' : 'text-indigo-700'
    },
    pink: {
      bg: darkMode ? 'bg-pink-900/20' : 'bg-pink-50',
      hover: darkMode ? 'hover:bg-pink-900/30' : 'hover:bg-pink-100',
      icon: darkMode ? 'text-pink-400' : 'text-pink-600',
      text: darkMode ? 'text-pink-400' : 'text-pink-700'
    }
  };

  return colors[color || 'blue'];
};

const getSizeClasses = (size?: 'sm' | 'md' | 'lg') => {
  const sizes = {
    sm: {
      icon: 'w-5 h-5',
      padding: 'p-3',
      text: 'text-xs',
      badge: 'text-xs'
    },
    md: {
      icon: 'w-6 h-6',
      padding: 'p-4',
      text: 'text-sm',
      badge: 'text-xs'
    },
    lg: {
      icon: 'w-8 h-8',
      padding: 'p-5',
      text: 'text-base',
      badge: 'text-sm'
    }
  };

  return sizes[size || 'md'];
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * QuickActionsWidget Component - Common action buttons grid
 *
 * Displays a responsive grid of frequently-used action buttons with icons,
 * labels, and notification badges. Ideal for dashboard quick actions.
 *
 * @component
 * @param {QuickActionsWidgetProps} props - Component props
 * @returns {React.ReactElement} Rendered quick actions widget
 *
 * @example
 * ```tsx
 * <QuickActionsWidget
 *   actions={[
 *     {
 *       id: 'new-student',
 *       label: 'New Student',
 *       icon: UserPlus,
 *       onClick: () => navigate('/students/new'),
 *       color: 'blue'
 *     }
 *   ]}
 * />
 * ```
 */
export const QuickActionsWidget = React.memo<QuickActionsWidgetProps>(({
  title = 'Quick Actions',
  subtitle,
  actions,
  darkMode = false,
  className = '',
  columns = 3,
  size = 'md'
}) => {
  // Theme classes
  const themeClasses = useMemo(() => ({
    container: darkMode
      ? 'bg-gray-800 border-gray-700 text-gray-200'
      : 'bg-white border-gray-200 text-gray-900',
    subtitle: darkMode ? 'text-gray-400' : 'text-gray-600'
  }), [darkMode]);

  const sizeClasses = getSizeClasses(size);

  // Grid columns class
  const gridCols = useMemo(() => {
    const cols = {
      2: 'grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-2 lg:grid-cols-4'
    };
    return cols[columns];
  }, [columns]);

  return (
    <div
      className={`rounded-lg border shadow-sm ${themeClasses.container} ${className}`}
    >
      {/* Header */}
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {subtitle && (
            <p className={`text-sm mt-1 ${themeClasses.subtitle}`}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Actions Grid */}
      <div className={`p-6 grid ${gridCols} gap-4`}>
        {actions.map((action) => {
          const Icon = action.icon;
          const colorClasses = getColorClasses(action.color, darkMode);

          return (
            <button
              key={action.id}
              onClick={action.onClick}
              disabled={action.disabled}
              className={`relative flex flex-col items-center justify-center ${sizeClasses.padding} rounded-lg border transition-all duration-200 ${
                action.disabled
                  ? darkMode
                    ? 'bg-gray-700 border-gray-600 opacity-50 cursor-not-allowed'
                    : 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed'
                  : `${colorClasses.bg} ${colorClasses.hover} border-transparent hover:shadow-md active:scale-[0.98]`
              }`}
              aria-label={action.label}
            >
              {/* Badge */}
              {action.badge !== undefined && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  {action.badge}
                </span>
              )}

              {/* Icon */}
              <Icon className={`${sizeClasses.icon} ${colorClasses.icon} mb-2`} />

              {/* Label */}
              <span className={`${sizeClasses.text} font-medium ${colorClasses.text} text-center`}>
                {action.label}
              </span>

              {/* Description */}
              {action.description && (
                <span className={`text-xs ${themeClasses.subtitle} text-center mt-1`}>
                  {action.description}
                </span>
              )}
            </button>
          );
        })}

        {actions.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className={themeClasses.subtitle}>No actions available</p>
          </div>
        )}
      </div>
    </div>
  );
});

QuickActionsWidget.displayName = 'QuickActionsWidget';

export default QuickActionsWidget;
