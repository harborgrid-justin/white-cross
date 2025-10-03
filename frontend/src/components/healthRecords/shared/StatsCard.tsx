import React from 'react'
import type { HealthSummaryCard } from '@/types/healthRecords'

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  iconColor?: string
  testId?: string
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  iconColor = 'text-blue-600',
  testId 
}) => {
  return (
    <div className="card p-6" data-testid={testId}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600" data-testid="stat-label">{title}</p>
          <p className="text-2xl font-bold text-gray-900" data-testid="stat-value">{value}</p>
        </div>
        <Icon className={`h-8 w-8 ${iconColor}`} />
      </div>
    </div>
  )
}