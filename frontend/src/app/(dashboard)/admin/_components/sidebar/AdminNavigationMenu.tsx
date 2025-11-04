/**
 * @fileoverview Admin Navigation Menu - Primary navigation for admin modules
 * @module app/(dashboard)/admin/_components/sidebar/AdminNavigationMenu
 * @category Admin - Components
 */

'use client';

import { usePathname } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';
import { AdminModule } from './types';
import { getStatusColor, getStatusBadgeVariant } from './utils';

interface AdminNavigationMenuProps {
  modules: AdminModule[];
  isExpanded: boolean;
  onToggle: () => void;
  onNavigate?: (href: string) => void;
  className?: string;
}

/**
 * Admin Navigation Menu Component
 *
 * Displays the primary navigation menu for admin modules with:
 * - Active state highlighting
 * - Module status badges
 * - Count indicators
 * - Expandable/collapsible section
 *
 * @param modules - Array of admin modules to display
 * @param isExpanded - Whether the section is expanded
 * @param onToggle - Handler for section toggle
 * @param onNavigate - Optional navigation handler
 */
export function AdminNavigationMenu({
  modules,
  isExpanded,
  onToggle,
  onNavigate,
  className = '',
}: AdminNavigationMenuProps) {
  const pathname = usePathname();

  const handleModuleClick = (module: AdminModule) => {
    if (onNavigate) {
      onNavigate(module.href);
    } else {
      console.log('Navigate to:', module.href);
    }
  };

  return (
    <Card className={className}>
      <div
        className="px-4 py-3 border-b border-gray-200 cursor-pointer flex items-center justify-between"
        onClick={onToggle}
      >
        <h3 className="text-sm font-semibold text-gray-900 flex items-center">
          <Shield className="h-4 w-4 mr-2 text-blue-600" />
          Admin Modules
        </h3>
        <Button variant="ghost" size="sm" aria-label={isExpanded ? 'Collapse' : 'Expand'}>
          {isExpanded ? '−' : '+'}
        </Button>
      </div>

      {isExpanded && (
        <div className="p-4">
          <div className="space-y-2">
            {modules.map((module) => {
              const Icon = module.icon;
              const isActive = pathname === module.href || pathname.startsWith(`${module.href}/`);

              return (
                <div
                  key={module.id}
                  onClick={() => handleModuleClick(module)}
                  className={`
                    flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all
                    ${isActive
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50 border border-transparent'
                    }
                  `}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleModuleClick(module);
                    }
                  }}
                >
                  <Icon
                    className={`h-5 w-5 mt-0.5 ${isActive ? 'text-blue-600' : getStatusColor(module.status)}`}
                    aria-hidden="true"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-sm font-medium ${isActive ? 'text-blue-900' : 'text-gray-900'} truncate`}>
                        {module.name}
                      </p>
                      {module.count !== undefined && (
                        <Badge
                          variant={isActive ? 'info' : getStatusBadgeVariant(module.status)}
                          className="text-xs ml-2"
                        >
                          {module.count}
                        </Badge>
                      )}
                    </div>
                    <p className={`text-xs ${isActive ? 'text-blue-700' : 'text-gray-600'}`}>
                      {module.description}
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
