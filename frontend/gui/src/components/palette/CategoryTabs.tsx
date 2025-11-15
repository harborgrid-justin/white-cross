/**
 * CategoryTabs Component
 *
 * Category navigation for the component palette.
 * Features:
 * - Tabs for each ComponentCategory
 * - Active state styling
 * - Count badges
 * - Accessibility support with Radix UI
 */

'use client';

import React, { useMemo } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import * as LucideIcons from 'lucide-react';
import { ComponentCategory } from '../../types';
import { cn } from '../../utils/cn';

export interface CategoryTabsProps {
  /**
   * Currently active category
   */
  activeCategory: ComponentCategory | 'all';

  /**
   * Callback when category changes
   */
  onCategoryChange: (category: ComponentCategory | 'all') => void;

  /**
   * Component counts per category
   */
  categoryCounts: Array<{
    category: ComponentCategory;
    count: number;
  }>;

  /**
   * Optional custom className
   */
  className?: string;
}

/**
 * Category configuration with icons
 */
const CATEGORY_CONFIG: Record<
  ComponentCategory | 'all',
  {
    label: string;
    icon: keyof typeof LucideIcons;
  }
> = {
  all: {
    label: 'All',
    icon: 'LayoutGrid',
  },
  [ComponentCategory.Layout]: {
    label: 'Layout',
    icon: 'LayoutDashboard',
  },
  [ComponentCategory.Navigation]: {
    label: 'Navigation',
    icon: 'Navigation',
  },
  [ComponentCategory.Form]: {
    label: 'Forms',
    icon: 'FormInput',
  },
  [ComponentCategory.DataDisplay]: {
    label: 'Display',
    icon: 'Eye',
  },
  [ComponentCategory.Media]: {
    label: 'Media',
    icon: 'Image',
  },
  [ComponentCategory.NextJS]: {
    label: 'Next.js',
    icon: 'Zap',
  },
  [ComponentCategory.Custom]: {
    label: 'Custom',
    icon: 'Blocks',
  },
};

/**
 * CategoryTabs - Category navigation component
 *
 * Provides tab navigation for filtering components by category.
 * Shows component counts per category.
 *
 * @example
 * ```tsx
 * <CategoryTabs
 *   activeCategory={activeCategory}
 *   onCategoryChange={setActiveCategory}
 *   categoryCounts={categoryCounts}
 * />
 * ```
 */
export function CategoryTabs({
  activeCategory,
  onCategoryChange,
  categoryCounts,
  className,
}: CategoryTabsProps) {
  // Calculate total count for "All" tab
  const totalCount = useMemo(
    () => categoryCounts.reduce((sum, { count }) => sum + count, 0),
    [categoryCounts]
  );

  // Get count for a specific category
  const getCategoryCount = (category: ComponentCategory | 'all'): number => {
    if (category === 'all') return totalCount;
    return categoryCounts.find((c) => c.category === category)?.count || 0;
  };

  // Categories to display (only show categories with components + "all")
  const visibleCategories = useMemo(() => {
    const categories: Array<ComponentCategory | 'all'> = ['all'];

    categoryCounts.forEach(({ category, count }) => {
      if (count > 0) {
        categories.push(category);
      }
    });

    return categories;
  }, [categoryCounts]);

  return (
    <Tabs.Root
      value={activeCategory}
      onValueChange={(value) =>
        onCategoryChange(value as ComponentCategory | 'all')
      }
      className={className}
    >
      <Tabs.List
        className={cn(
          'flex flex-wrap gap-1 p-1 rounded-lg',
          'bg-muted/50'
        )}
        aria-label="Component categories"
      >
        {visibleCategories.map((category) => {
          const config = CATEGORY_CONFIG[category];
          const IconComponent = (LucideIcons as any)[config.icon];
          const count = getCategoryCount(category);

          return (
            <Tabs.Trigger
              key={category}
              value={category}
              className={cn(
                // Base styles
                'group flex items-center gap-2 px-3 py-2 rounded-md',
                'text-sm font-medium transition-all duration-150',

                // Default state
                'text-muted-foreground hover:text-foreground',
                'hover:bg-background/50',

                // Active state
                'data-[state=active]:bg-background',
                'data-[state=active]:text-foreground',
                'data-[state=active]:shadow-sm',

                // Focus state
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                'focus:ring-offset-muted/50'
              )}
              aria-label={`${config.label} category, ${count} component${
                count !== 1 ? 's' : ''
              }`}
            >
              {/* Icon */}
              <IconComponent
                className={cn(
                  'w-4 h-4 transition-colors',
                  'group-data-[state=active]:text-primary'
                )}
                aria-hidden="true"
              />

              {/* Label */}
              <span>{config.label}</span>

              {/* Count badge */}
              {count > 0 && (
                <span
                  className={cn(
                    'px-1.5 py-0.5 text-xs font-semibold rounded-full',
                    'transition-colors',

                    // Default state
                    'bg-muted text-muted-foreground',

                    // Active state
                    'group-data-[state=active]:bg-primary/10',
                    'group-data-[state=active]:text-primary'
                  )}
                  aria-hidden="true"
                >
                  {count}
                </span>
              )}
            </Tabs.Trigger>
          );
        })}
      </Tabs.List>
    </Tabs.Root>
  );
}

/**
 * Memoized version to prevent unnecessary re-renders
 */
export const MemoizedCategoryTabs = React.memo(CategoryTabs);
