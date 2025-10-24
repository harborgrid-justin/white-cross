/**
 * Display Components Module
 *
 * Visual display components for presenting data, status, and user information
 * in the White Cross healthcare platform. Provides badges, avatars, and statistics cards
 * with consistent styling and behavior.
 *
 * **Components:**
 * - Badge: Status indicators and labels with variants
 * - Avatar: User profile images with fallbacks and status
 * - AvatarGroup: Multiple overlapping avatars with overflow
 * - StatsCard: Dashboard statistics with trends and icons
 *
 * **Features:**
 * - Multiple visual variants and sizes
 * - Dark mode support
 * - Accessibility-first design
 * - Responsive layouts
 * - TypeScript type safety
 *
 * @module components/ui/display
 *
 * @example
 * ```tsx
 * import { Badge, Avatar, AvatarGroup, StatsCard } from '@/components/ui/display';
 *
 * function UserProfile() {
 *   return (
 *     <div>
 *       <Avatar
 *         src="/user.jpg"
 *         alt="John Doe"
 *         status="online"
 *         showStatus
 *       />
 *       <Badge variant="success">Active</Badge>
 *     </div>
 *   );
 * }
 *
 * function Dashboard() {
 *   return (
 *     <StatsCard
 *       title="Total Users"
 *       value={1234}
 *       icon={<Users />}
 *       trend={{ value: 12, isPositive: true, label: "vs last month" }}
 *     />
 *   );
 * }
 * ```
 */

export { Badge, type BadgeProps } from './Badge';
export { Avatar, AvatarGroup, type AvatarProps } from './Avatar';
export { StatsCard, type StatsCardProps } from './StatsCard';
