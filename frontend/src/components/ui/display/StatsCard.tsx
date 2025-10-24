/**
 * WF-COMP-088 | StatsCard.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: functional component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * StatsCard Component Module
 *
 * Dashboard statistics card for displaying key metrics with trends and icons.
 * Supports interactive onClick behavior and optional trend indicators.
 *
 * @module components/ui/display/StatsCard
 */

/**
 * Props for the StatsCard component.
 *
 * @interface StatsCardProps
 *
 * @property {string} title - Card title describing the statistic
 * @property {string | number} value - Primary statistic value to display
 * @property {string} [description] - Optional description or subtitle
 * @property {React.ReactNode} icon - Icon element to display (typically from icon library)
 * @property {string} [iconColor='text-blue-600'] - Tailwind color class for icon
 * @property {Object} [trend] - Optional trend indicator
 * @property {number} trend.value - Percentage change value
 * @property {boolean} trend.isPositive - Whether trend is positive (green) or negative (red)
 * @property {string} trend.label - Label describing the trend period (e.g., "vs last month")
 * @property {() => void} [onClick] - Optional click handler making card interactive
 * @property {string} [className=''] - Additional CSS classes
 * @property {string} [testId] - Test identifier for automated testing
 */
interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: React.ReactNode
  iconColor?: string
  trend?: {
    value: number
    isPositive: boolean
    label: string
  }
  onClick?: () => void
  className?: string
  testId?: string
}

/**
 * StatsCard component for displaying dashboard statistics and metrics.
 *
 * Prominent card for showcasing key statistics with icon, value, optional trend,
 * and interactive capabilities. Commonly used in dashboards and analytics views.
 *
 * **Features:**
 * - Large, prominent value display
 * - Icon with customizable color
 * - Optional trend indicator with percentage change
 * - Interactive mode with onClick handler
 * - Keyboard accessible when interactive
 * - Hover effects and transitions
 * - Responsive layout
 *
 * **Accessibility:**
 * - Semantic role (button when interactive, article otherwise)
 * - Keyboard navigation support (Enter and Space)
 * - Tab index for focus management
 * - Visual hover states
 * - Clear visual hierarchy
 *
 * **Interactive Mode:**
 * When onClick is provided, card becomes clickable with appropriate
 * cursor, hover state, role, and keyboard support.
 *
 * @component
 * @param {StatsCardProps} props - Stats card props
 * @returns {JSX.Element} Rendered statistics card
 *
 * @example
 * ```tsx
 * import { Users } from 'lucide-react';
 *
 * // Basic stats card
 * <StatsCard
 *   title="Total Patients"
 *   value={1234}
 *   icon={<Users size={24} />}
 *   iconColor="text-blue-600"
 * />
 *
 * // Stats card with trend
 * <StatsCard
 *   title="Active Cases"
 *   value={856}
 *   description="Currently under treatment"
 *   icon={<Activity size={24} />}
 *   iconColor="text-green-600"
 *   trend={{
 *     value: 12.5,
 *     isPositive: true,
 *     label: "vs last month"
 *   }}
 * />
 *
 * // Interactive stats card
 * <StatsCard
 *   title="Pending Reviews"
 *   value={23}
 *   icon={<Clock size={24} />}
 *   iconColor="text-orange-600"
 *   onClick={() => navigate('/reviews')}
 *   testId="pending-reviews-card"
 * />
 *
 * // Negative trend example
 * <StatsCard
 *   title="Error Rate"
 *   value="2.3%"
 *   icon={<AlertTriangle size={24} />}
 *   iconColor="text-red-600"
 *   trend={{
 *     value: -15.2,
 *     isPositive: true, // Negative error rate is positive trend
 *     label: "improvement"
 *   }}
 * />
 * ```
 */
export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon,
  iconColor = 'text-blue-600',
  trend,
  onClick,
  className = '',
  testId
}) => {
  const baseClasses = 'card p-6 hover:shadow-lg transition-shadow'
  const interactiveClasses = onClick ? 'cursor-pointer hover:bg-gray-50' : ''
  
  return (
    <div 
      data-testid={testId}
      className={`${baseClasses} ${interactiveClasses} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : 'article'}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      } : undefined}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className={`${iconColor} mb-4`}>
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <span 
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-sm text-gray-500 ml-1">{trend.label}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
