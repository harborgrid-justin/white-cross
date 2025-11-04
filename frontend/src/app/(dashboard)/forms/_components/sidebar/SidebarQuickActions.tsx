'use client';

/**
 * Quick Actions component for Forms Sidebar
 * Displays a list of quick action buttons for common form operations
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { QuickAction } from './sidebar.types';

interface SidebarQuickActionsProps {
  actions: QuickAction[];
}

export function SidebarQuickActions({ actions }: SidebarQuickActionsProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
      <div className="space-y-2">
        {actions.map((action) => (
          <div key={action.id}>
            {action.href ? (
              <a href={action.href} className="block">
                <Button
                  variant={action.variant}
                  className="w-full justify-start"
                  size="sm"
                >
                  <action.icon className="h-4 w-4 mr-2" />
                  {action.label}
                  {action.count && (
                    <Badge className="ml-auto bg-gray-100 text-gray-800">
                      {action.count}
                    </Badge>
                  )}
                </Button>
              </a>
            ) : (
              <Button
                variant={action.variant}
                onClick={action.action}
                className="w-full justify-start"
                size="sm"
              >
                <action.icon className="h-4 w-4 mr-2" />
                {action.label}
                {action.count && (
                  <Badge className="ml-auto bg-gray-100 text-gray-800">
                    {action.count}
                  </Badge>
                )}
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
