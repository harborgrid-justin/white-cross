/**
 * @fileoverview Student Statistics Card Component
 * @module app/(dashboard)/students/_components/StudentStatsCard
 * @category Students - Components
 *
 * A reusable statistics card component for displaying student metrics
 * with an icon and label. Used in the student dashboard overview.
 *
 * PERFORMANCE: Memoized to prevent unnecessary re-renders
 *
 * @example
 * ```tsx
 * <StudentStatsCard
 *   label="Total Students"
 *   value={120}
 *   icon={Users}
 *   iconColor="text-blue-600"
 * />
 * ```
 */

'use client';

import { memo, type FC } from 'react';
import { Card } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

/**
 * Props for the StudentStatsCard component
 */
export interface StudentStatsCardProps {
  /**
   * Label text for the statistic (e.g., "Total Students")
   */
  label: string;

  /**
   * The numeric or string value to display
   */
  value: number | string;

  /**
   * Lucide icon component to display
   */
  icon: LucideIcon;

  /**
   * Tailwind CSS color class for the icon (e.g., "text-blue-600")
   */
  iconColor: string;
}

/**
 * StudentStatsCard Component
 * Displays a single statistic with icon and label in a card format
 *
 * ACCESSIBILITY:
 * - Uses semantic HTML structure
 * - Proper contrast ratios for text and icons
 * - Screen reader friendly layout
 */
const StudentStatsCard: FC<StudentStatsCardProps> = memo(({ label, value, icon: Icon, iconColor }) => (
  <Card>
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <Icon className={`h-8 w-8 ${iconColor}`} aria-hidden="true" />
      </div>
    </div>
  </Card>
));

StudentStatsCard.displayName = 'StudentStatsCard';

export { StudentStatsCard };
