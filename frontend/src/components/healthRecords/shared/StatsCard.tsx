import React from 'react'

interface StatsCardProps {
  title: string
  value: string | number
  icon?: React.ComponentType<{ className?: string }>
  iconColor?: string
  testId?: string
  trend?: string
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  iconColor = 'text-blue-600',
  testId,
  trend
}) => {
  return (
    <div className="card p-6" data-testid={testId}>
      <div className="flex items-center">
        <div className="flex-1">
          <p className="text-sm text-gray-600" data-testid="stat-label">{title}</p>
          <p className="text-2xl font-bold text-gray-900" data-testid="stat-value">{value}</p>
          {trend && (
            <p className="text-xs text-gray-500 mt-1" data-testid="stat-trend">{trend}</p>
          )}
        </div>
        {Icon && <Icon className={`h-8 w-8 ${iconColor} ml-4`} />}
      </div>
    </div>
  )
}