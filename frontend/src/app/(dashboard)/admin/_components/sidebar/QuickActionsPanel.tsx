/**
 * @fileoverview Quick Actions Panel - Fast access to common admin tasks
 * @module app/(dashboard)/admin/_components/sidebar/QuickActionsPanel
 * @category Admin - Components
 */

'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { QuickAction } from './types';

interface QuickActionsPanelProps {
  actions: QuickAction[];
  isExpanded: boolean;
  onToggle: () => void;
  onActionClick?: (action: QuickAction) => void;
  className?: string;
}

/**
 * Quick Actions Panel Component
 *
 * Provides fast access to frequently used admin tasks:
 * - User creation
 * - System backup
 * - Security scans
 * - Health checks
 * - Notifications
 *
 * Features:
 * - One-click action execution
 * - Navigation or callback support
 * - Expandable/collapsible section
 *
 * @param actions - Array of quick actions
 * @param isExpanded - Whether the section is expanded
 * @param onToggle - Handler for section toggle
 * @param onActionClick - Optional handler for action clicks
 */
export function QuickActionsPanel({
  actions,
  isExpanded,
  onToggle,
  onActionClick,
  className = '',
}: QuickActionsPanelProps) {
  const handleActionClick = (action: QuickAction) => {
    if (onActionClick) {
      onActionClick(action);
    } else if (action.href) {
      console.log('Navigating to:', action.href);
    } else if (action.action) {
      action.action();
    }
  };

  return (
    <Card className={className}>
      <div
        className="px-4 py-3 border-b border-gray-200 cursor-pointer flex items-center justify-between"
        onClick={onToggle}
      >
        <h3 className="text-sm font-semibold text-gray-900 flex items-center">
          <Zap className="h-4 w-4 mr-2 text-purple-600" />
          Quick Actions
        </h3>
        <Button variant="ghost" size="sm" aria-label={isExpanded ? 'Collapse' : 'Expand'}>
          {isExpanded ? '−' : '+'}
        </Button>
      </div>

      {isExpanded && (
        <div className="p-4">
          <div className="space-y-2">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <div
                  key={action.id}
                  onClick={() => handleActionClick(action)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleActionClick(action);
                    }
                  }}
                >
                  <Icon className="h-4 w-4 text-gray-600" aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {action.label}
                    </p>
                    <p className="text-xs text-gray-600">
                      {action.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}
