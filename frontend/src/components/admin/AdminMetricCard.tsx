'use client';

/**
 * AdminMetricCard Component
 *
 * Displays key metrics and statistics in the admin dashboard.
 *
 * @module components/admin/AdminMetricCard
 * @since 2025-10-26
 */

'use client'

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'

export interface AdminMetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: string | number
    direction: 'up' | 'down'
    positive?: boolean
  }
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray'
  onClick?: () => void
  className?: string
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    border: 'border-blue-200',
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-600',
    border: 'border-green-200',
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    border: 'border-purple-200',
  },
  orange: {
    bg: 'bg-orange-100',
    text: 'text-orange-600',
    border: 'border-orange-200',
  },
  red: {
    bg: 'bg-red-100',
    text: 'text-red-600',
    border: 'border-red-200',
  },
  gray: {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    border: 'border-gray-200',
  },
} as const

export function AdminMetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'blue',
  onClick,
  className = '',
}: AdminMetricCardProps) {
  const colors = colorClasses[color]

  return (
    <div
      className={`bg-white rounded-lg shadow p-6 ${
        onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
      } ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {/* Title */}
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>

          {/* Value */}
          <p className="text-3xl font-bold text-gray-900">{value}</p>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}

          {/* Trend */}
          {trend && (
            <div
              className={`flex items-center gap-1 mt-2 text-sm ${
                trend.positive !== undefined
                  ? trend.positive
                    ? 'text-green-600'
                    : 'text-red-600'
                  : trend.direction === 'up'
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {trend.direction === 'up' ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{trend.value}</span>
            </div>
          )}
        </div>

        {/* Icon */}
        <div className={`p-3 rounded-lg ${colors.bg}`}>
          <Icon className={`h-6 w-6 ${colors.text}`} />
        </div>
      </div>
    </div>
  )
}
