'use client';

/**
 * Statistics component for Forms Sidebar
 * Displays form statistics in a collapsible section
 */

import React from 'react';
import { BarChart3 } from 'lucide-react';
import type { SidebarStat } from './sidebar.types';

interface SidebarStatisticsProps {
  stats: SidebarStat[];
  isExpanded: boolean;
  onToggle: () => void;
}

export function SidebarStatistics({
  stats,
  isExpanded,
  onToggle,
}: SidebarStatisticsProps) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-sm font-medium text-gray-900 mb-3 hover:text-gray-700"
        aria-expanded={isExpanded}
        aria-controls="sidebar-statistics"
      >
        <span>Form Statistics</span>
        <BarChart3 className="h-4 w-4" />
      </button>

      {isExpanded && (
        <div id="sidebar-statistics" className="space-y-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center justify-between p-2 rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded ${stat.bgColor}`}>
                  <stat.icon className={`h-3 w-3 ${stat.color}`} />
                </div>
                <span className="text-sm text-gray-600">{stat.label}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
