/**
 * Appointment Statistics Component
 * Displays statistics cards for appointments overview
 */

'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  CalendarDays,
  Timer,
  Users,
  Activity,
  TrendingUp 
} from 'lucide-react';

interface AppointmentStatsProps {
  stats: {
    totalAppointments: number;
    todayAppointments: number;
    upcomingAppointments: number;
    completedToday: number;
    cancelledToday: number;
    noShowRate: number;
    averageDuration: number;
  };
}

export const AppointmentStats: React.FC<AppointmentStatsProps> = ({ stats }) => {
  const statCards = [
    {
      title: 'Today\'s Appointments',
      value: stats.todayAppointments,
      subtitle: `${stats.completedToday} completed`,
      icon: CalendarDays,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Upcoming',
      value: stats.upcomingAppointments,
      subtitle: 'Next 7 days',
      icon: Timer,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Scheduled',
      value: stats.totalAppointments,
      subtitle: 'This month',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Avg Duration',
      value: `${stats.averageDuration}m`,
      subtitle: 'Per appointment',
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'No-Show Rate',
      value: `${stats.noShowRate}%`,
      subtitle: `${stats.cancelledToday} cancelled today`,
      icon: TrendingUp,
      color: stats.noShowRate > 10 ? 'text-red-600' : 'text-gray-600',
      bgColor: stats.noShowRate > 10 ? 'bg-red-50' : 'bg-gray-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
              </div>
              <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
