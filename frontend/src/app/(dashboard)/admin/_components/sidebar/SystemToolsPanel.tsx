/**
 * @fileoverview System Tools Panel - Administrative utilities and tools
 * @module app/(dashboard)/admin/_components/sidebar/SystemToolsPanel
 * @category Admin - Components
 */

'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Server } from 'lucide-react';
import { SystemTool } from './types';

interface SystemToolsPanelProps {
  tools: SystemTool[];
  className?: string;
}

/**
 * System Tools Panel Component
 *
 * Provides access to administrative utilities:
 * - Data export/import
 * - Advanced search
 * - System logs
 * - Database management
 * - Configuration tools
 *
 * Features:
 * - Button-based tool access
 * - Clear tool descriptions via icons
 * - Consistent styling
 *
 * @param tools - Array of system tools
 */
export function SystemToolsPanel({
  tools,
  className = '',
}: SystemToolsPanelProps) {
  const handleToolClick = (tool: SystemTool) => {
    tool.action();
  };

  return (
    <Card className={className}>
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center">
          <Server className="h-4 w-4 mr-2 text-indigo-600" />
          System Tools
        </h3>
      </div>

      <div className="p-4">
        <div className="space-y-2">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Button
                key={tool.id}
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => handleToolClick(tool)}
              >
                <Icon className="h-3 w-3 mr-2" />
                {tool.label}
              </Button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
