/**
 * WF-COMP-STUDENT-SHARED-001 | StatsCard.tsx
 * Purpose: Re-export of StatsCard component for student domain usage
 *
 * @module app/(dashboard)/students/components/shared/StatsCard
 */

/**
 * Re-export StatsCard from UI library for use in student components.
 * This allows for future customization specific to student statistics
 * while maintaining consistency with the base UI component.
 *
 * The StatsCard component is used throughout the student management
 * interface to display key metrics such as:
 * - Total students count
 * - Active enrollments
 * - Health compliance statistics
 * - Incident reports
 * - Medication administration stats
 *
 * @example
 * ```tsx
 * import { StatsCard } from './components/shared/StatsCard';
 * import { Users } from 'lucide-react';
 *
 * <StatsCard
 *   title="Total Students"
 *   value={1234}
 *   description="Currently enrolled"
 *   icon={<Users size={24} />}
 *   iconColor="text-blue-600"
 *   trend={{
 *     value: 5.2,
 *     isPositive: true,
 *     label: "vs last month"
 *   }}
 * />
 * ```
 */
export { StatsCard } from '@/components/ui/display/StatsCard';
