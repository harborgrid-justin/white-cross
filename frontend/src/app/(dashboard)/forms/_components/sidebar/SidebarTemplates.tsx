'use client';

/**
 * Healthcare Form Templates component for Forms Sidebar
 * Displays a list of available form templates with categories and metadata
 */

import React from 'react';
import { FileText, Star, Shield, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { FormTemplate } from './sidebar.types';
import { getCategoryBadgeColor } from './sidebar.utils';

interface SidebarTemplatesProps {
  templates: FormTemplate[];
  isExpanded: boolean;
  onToggle: () => void;
  maxVisible?: number;
}

export function SidebarTemplates({
  templates,
  isExpanded,
  onToggle,
  maxVisible = 4,
}: SidebarTemplatesProps) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-sm font-medium text-gray-900 mb-3 hover:text-gray-700"
        aria-expanded={isExpanded}
        aria-controls="sidebar-templates"
      >
        <span>Healthcare Templates</span>
        <FileText className="h-4 w-4" />
      </button>

      {isExpanded && (
        <div id="sidebar-templates" className="space-y-3">
          {templates.slice(0, maxVisible).map((template) => (
            <Card
              key={template.id}
              className="p-3 hover:shadow-sm transition-shadow cursor-pointer"
            >
              <a href={`/forms/new?template=${template.id}`}>
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <template.icon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                          {template.title}
                        </h4>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                    </div>
                    {template.isPopular && (
                      <Star className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge className={getCategoryBadgeColor(template.category)}>
                      {template.category}
                    </Badge>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{template.fields} fields</span>
                      <span aria-hidden="true">•</span>
                      <span>{template.estimatedTime}m</span>
                    </div>
                  </div>

                  {template.isRequired && (
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3 text-red-500" />
                      <span className="text-xs text-red-600">Required Form</span>
                    </div>
                  )}
                </div>
              </a>
            </Card>
          ))}

          <a href="/forms/templates">
            <Button variant="outline" size="sm" className="w-full">
              <Search className="h-4 w-4 mr-2" />
              View All Templates ({templates.length})
            </Button>
          </a>
        </div>
      )}
    </div>
  );
}
