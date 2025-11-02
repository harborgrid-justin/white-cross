/**
 * AdminStatusIndicator Component
 *
 * Visual indicator for system and service status.
 *
 * @module components/admin/AdminStatusIndicator
 * @since 2025-10-26
 */

'use client'

import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react'

export interface AdminStatusIndicatorProps {
  status: 'operational' | 'degraded' | 'down' | 'pending'
  label?: string
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const statusConfig = {
  operational: {
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-200',
    icon: CheckCircle,
    label: 'Operational',
  },
  degraded: {
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-200',
    icon: AlertTriangle,
    label: 'Degraded',
  },
  down: {
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-200',
    icon: XCircle,
    label: 'Down',
  },
  pending: {
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    borderColor: 'border-gray-200',
    icon: Clock,
    label: 'Pending',
  },
} as const

const sizeClasses = {
  sm: {
    text: 'text-xs',
    padding: 'px-2 py-1',
    icon: 'h-3 w-3',
    dot: 'h-2 w-2',
  },
  md: {
    text: 'text-sm',
    padding: 'px-3 py-1.5',
    icon: 'h-4 w-4',
    dot: 'h-2.5 w-2.5',
  },
  lg: {
    text: 'text-base',
    padding: 'px-4 py-2',
    icon: 'h-5 w-5',
    dot: 'h-3 w-3',
  },
} as const

export function AdminStatusIndicator({
  status,
  label,
  showIcon = true,
  size = 'md',
  className = '',
}: AdminStatusIndicatorProps) {
  const config = statusConfig[status]
  const sizes = sizeClasses[size]
  const Icon = config.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${sizes.padding} ${config.bgColor} ${config.textColor} ${config.borderColor} border rounded-full font-medium ${sizes.text} ${className}`}
    >
      {showIcon ? (
        <Icon className={sizes.icon} />
      ) : (
        <span className={`${sizes.dot} rounded-full bg-current`}></span>
      )}
      <span>{label || config.label}</span>
    </span>
  )
}
