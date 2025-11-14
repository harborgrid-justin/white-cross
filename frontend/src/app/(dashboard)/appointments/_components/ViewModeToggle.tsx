/**
 * View Mode Toggle Component
 * Toggle between calendar, list, and agenda views
 */

'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, List, Grid3x3 } from 'lucide-react';

type ViewMode = 'calendar' | 'list' | 'agenda';

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  viewMode,
  onViewModeChange
}) => {
  const modes: Array<{ value: ViewMode; icon: typeof Calendar; label: string }> = [
    { value: 'calendar', icon: Calendar, label: 'Calendar' },
    { value: 'list', icon: List, label: 'List' },
    { value: 'agenda', icon: Grid3x3, label: 'Agenda' },
  ];

  return (
    <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
      {modes.map((mode) => {
        const Icon = mode.icon;
        return (
          <Button
            key={mode.value}
            variant={viewMode === mode.value ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange(mode.value)}
            className="gap-2"
            aria-label={`${mode.label} view`}
            aria-pressed={viewMode === mode.value}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{mode.label}</span>
          </Button>
        );
      })}
    </div>
  );
};
