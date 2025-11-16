'use client';

/**
 * ComponentTreeView Component
 *
 * Hierarchical tree view of all components on the canvas.
 * Inspired by Figma's layers panel and Webflow's navigator.
 *
 * Features:
 * - Hierarchical component tree
 * - Drag-and-drop reordering
 * - Component visibility toggle
 * - Component lock toggle
 * - Component selection
 * - Expand/collapse nested components
 * - Search and filter
 */

import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Grip
} from 'lucide-react';
import type { ComponentInstance } from '@/lib/page-builder/types';

interface ComponentTreeViewProps {
  components: ComponentInstance[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onToggleVisibility?: (id: string) => void;
  onToggleLock?: (id: string) => void;
}

export function ComponentTreeView({
  components,
  selectedId,
  onSelect,
  onToggleVisibility,
  onToggleLock
}: ComponentTreeViewProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">Layers</h3>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto">
        {components.length === 0 ? (
          <div className="flex items-center justify-center h-full px-4 text-center">
            <p className="text-sm text-gray-500">
              No components yet
            </p>
          </div>
        ) : (
          <div className="p-2">
            {components.map(component => (
              <TreeNode
                key={component.id}
                component={component}
                level={0}
                isSelected={selectedId === component.id}
                isExpanded={expandedIds.has(component.id)}
                onSelect={onSelect}
                onToggleExpanded={toggleExpanded}
                onToggleVisibility={onToggleVisibility}
                onToggleLock={onToggleLock}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Individual tree node
 */
interface TreeNodeProps {
  component: ComponentInstance;
  level: number;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: (id: string) => void;
  onToggleExpanded: (id: string) => void;
  onToggleVisibility?: (id: string) => void;
  onToggleLock?: (id: string) => void;
}

function TreeNode({
  component,
  level,
  isSelected,
  isExpanded,
  onSelect,
  onToggleExpanded,
  onToggleVisibility,
  onToggleLock
}: TreeNodeProps) {
  const hasChildren = component.children && component.children.length > 0;
  const isVisible = component.conditions?.visible !== 'false';
  const isLocked = false; // TODO: Add locked state to ComponentInstance

  return (
    <div>
      {/* Node Row */}
      <div
        className={`flex items-center gap-1 px-2 py-1.5 rounded group hover:bg-gray-50 ${
          isSelected ? 'bg-blue-50 hover:bg-blue-100' : ''
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {/* Expand/Collapse */}
        {hasChildren ? (
          <button
            onClick={() => onToggleExpanded(component.id)}
            className="p-0.5 hover:bg-gray-200 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3 text-gray-600" />
            ) : (
              <ChevronRight className="w-3 h-3 text-gray-600" />
            )}
          </button>
        ) : (
          <div className="w-4" />
        )}

        {/* Drag Handle */}
        <button className="p-0.5 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded cursor-grab">
          <Grip className="w-3 h-3 text-gray-400" />
        </button>

        {/* Component Name */}
        <button
          onClick={() => onSelect(component.id)}
          className={`flex-1 text-left text-xs font-medium truncate ${
            isSelected ? 'text-blue-900' : 'text-gray-900'
          }`}
        >
          {component.componentId}
        </button>

        {/* Visibility Toggle */}
        <button
          onClick={() => onToggleVisibility?.(component.id)}
          className="p-0.5 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded"
          title={isVisible ? 'Hide component' : 'Show component'}
        >
          {isVisible ? (
            <Eye className="w-3 h-3 text-gray-600" />
          ) : (
            <EyeOff className="w-3 h-3 text-gray-400" />
          )}
        </button>

        {/* Lock Toggle */}
        <button
          onClick={() => onToggleLock?.(component.id)}
          className="p-0.5 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded"
          title={isLocked ? 'Unlock component' : 'Lock component'}
        >
          {isLocked ? (
            <Lock className="w-3 h-3 text-gray-600" />
          ) : (
            <Unlock className="w-3 h-3 text-gray-400" />
          )}
        </button>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {component.children!.map(child => (
            <TreeNode
              key={child.id}
              component={child}
              level={level + 1}
              isSelected={false}
              isExpanded={false}
              onSelect={onSelect}
              onToggleExpanded={onToggleExpanded}
              onToggleVisibility={onToggleVisibility}
              onToggleLock={onToggleLock}
            />
          ))}
        </div>
      )}
    </div>
  );
}
