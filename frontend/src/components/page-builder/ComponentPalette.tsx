'use client';

/**
 * ComponentPalette Component
 *
 * Left sidebar displaying categorized component library with search and drag-to-canvas.
 * Inspired by Webflow's component panel and Framer's insert menu.
 *
 * Features:
 * - Categorized components (Layout, Navigation, Forms, Data Display, Next.js)
 * - Search and filter functionality
 * - Component preview thumbnails
 * - Drag-to-canvas interaction
 * - Collapsible categories
 * - Component metadata display
 * - Server/Client component badges
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  ChevronRight,
  LayoutTemplate,
  Navigation,
  FileInput,
  Table,
  Zap,
  Server,
  Monitor,
  Info
} from 'lucide-react';
import { ComponentGroups, AllComponents } from '@/lib/page-builder/components';
import type { ComponentDefinition } from '@/lib/page-builder/types';

// Icon mapping for component groups
const ICON_MAP: Record<string, React.ReactNode> = {
  LayoutTemplate: <LayoutTemplate className="w-4 h-4" />,
  Navigation: <Navigation className="w-4 h-4" />,
  FileInput: <FileInput className="w-4 h-4" />,
  Table: <Table className="w-4 h-4" />,
  Zap: <Zap className="w-4 h-4" />
};

export function ComponentPalette() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(ComponentGroups.map(g => g.id))
  );

  // Filter components based on search
  const filteredComponents = useMemo(() => {
    if (!searchQuery.trim()) return AllComponents;

    const query = searchQuery.toLowerCase();
    return AllComponents.filter(component =>
      component.displayName.toLowerCase().includes(query) ||
      component.description.toLowerCase().includes(query) ||
      component.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  // Group filtered components by category
  const groupedComponents = useMemo(() => {
    const groups: Record<string, ComponentDefinition[]> = {};

    ComponentGroups.forEach(group => {
      groups[group.id] = filteredComponents.filter(component =>
        group.components.includes(component.id)
      );
    });

    return groups;
  }, [filteredComponents]);

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  // Handle component drag start
  const handleDragStart = (e: React.DragEvent, component: ComponentDefinition) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'component',
      componentId: component.id,
      componentName: component.displayName
    }));

    // Add visual feedback class
    (e.target as HTMLElement).classList.add('opacity-50');
  };

  // Handle drag end
  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).classList.remove('opacity-50');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Components</h2>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Search components"
          />
        </div>
      </div>

      {/* Component List */}
      <div className="flex-1 overflow-y-auto">
        {ComponentGroups.map(group => {
          const components = groupedComponents[group.id];
          if (!components || components.length === 0) return null;

          const isExpanded = expandedCategories.has(group.id);

          return (
            <div key={group.id} className="border-b border-gray-200">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(group.id)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                aria-expanded={isExpanded}
                aria-label={`${group.name} category`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">
                    {ICON_MAP[group.icon || ''] || <LayoutTemplate className="w-4 h-4" />}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {group.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({components.length})
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {/* Component Cards */}
              {isExpanded && (
                <div className="px-2 pb-2 space-y-1">
                  {components.map(component => (
                    <ComponentCard
                      key={component.id}
                      component={component}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* No Results */}
        {filteredComponents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Search className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-sm text-gray-600 mb-1">No components found</p>
            <p className="text-xs text-gray-500">
              Try a different search term
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Individual component card in the palette
 */
interface ComponentCardProps {
  component: ComponentDefinition;
  onDragStart: (e: React.DragEvent, component: ComponentDefinition) => void;
  onDragEnd: (e: React.DragEvent) => void;
}

function ComponentCard({ component, onDragStart, onDragEnd }: ComponentCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        draggable
        onDragStart={(e) => onDragStart(e, component)}
        onDragEnd={onDragEnd}
        className="flex items-start gap-3 p-3 rounded-md border border-gray-200 bg-white hover:border-blue-400 hover:shadow-sm cursor-move transition-all"
        role="button"
        tabIndex={0}
        aria-label={`Add ${component.displayName} component`}
      >
        {/* Component Icon/Preview */}
        <div className="flex-shrink-0 w-10 h-10 rounded-md bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center">
          <LayoutTemplate className="w-5 h-5 text-blue-600" />
        </div>

        {/* Component Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {component.displayName}
            </h4>
            {/* Render Mode Badge */}
            <span
              className={`flex-shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                component.renderMode === 'server'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
              title={component.renderMode === 'server' ? 'Server Component' : 'Client Component'}
            >
              {component.renderMode === 'server' ? (
                <Server className="w-3 h-3" />
              ) : (
                <Monitor className="w-3 h-3" />
              )}
            </span>
          </div>
          <p className="text-xs text-gray-500 line-clamp-2">
            {component.description}
          </p>
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute left-full ml-2 top-0 z-50 w-64 p-3 bg-gray-900 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="flex items-start gap-2 mb-2">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">{component.displayName}</p>
              <p className="text-gray-300 mb-2">{component.description}</p>
              {component.tags && component.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {component.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 bg-gray-800 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <p className="text-gray-400 text-xs">
            Drag onto canvas to add
          </p>
        </div>
      )}
    </div>
  );
}
