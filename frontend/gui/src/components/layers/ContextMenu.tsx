/**
 * ContextMenu Component
 *
 * Right-click context menu for layer tree items.
 * Provides quick access to common component actions.
 */

import React from 'react';
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import {
  Copy,
  Scissors,
  Clipboard,
  Trash2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Files,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import type { ComponentId } from '../../types';
import { usePageBuilderStore } from '../../store';

// ============================================================================
// TYPES
// ============================================================================

interface ContextMenuProps {
  children: React.ReactNode;
  componentId: ComponentId;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const ContextMenu: React.FC<ContextMenuProps> = ({ children, componentId }) => {
  // Store hooks
  const component = usePageBuilderStore((state) => state.canvas.components.byId[componentId]);
  const selectedIds = usePageBuilderStore((state) => state.selection.selectedIds);
  const copyAction = usePageBuilderStore((state) => state.copy);
  const cutAction = usePageBuilderStore((state) => state.cut);
  const pasteAction = usePageBuilderStore((state) => state.paste);
  const deleteComponent = usePageBuilderStore((state) => state.deleteComponent);
  const duplicateComponent = usePageBuilderStore((state) => state.duplicateComponent);
  const updateComponent = usePageBuilderStore((state) => state.updateComponent);
  const selectComponent = usePageBuilderStore((state) => state.selectComponent);
  const clipboardHasData = usePageBuilderStore((state) => state.clipboard.components.length > 0);

  if (!component) {
    return <>{children}</>;
  }

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleCopy = () => {
    if (!selectedIds.includes(componentId)) {
      selectComponent(componentId, false);
    }
    copyAction();
  };

  const handleCut = () => {
    if (!selectedIds.includes(componentId)) {
      selectComponent(componentId, false);
    }
    cutAction();
  };

  const handlePaste = () => {
    pasteAction();
  };

  const handleDuplicate = () => {
    duplicateComponent(componentId);
  };

  const handleDelete = () => {
    deleteComponent(componentId);
  };

  const handleToggleLock = () => {
    updateComponent(componentId, { locked: !component.locked });
  };

  const handleToggleVisibility = () => {
    updateComponent(componentId, { hidden: !component.hidden });
  };

  const handleMoveUp = () => {
    // TODO: Implement move up in sibling order
    console.log('Move up not yet implemented');
  };

  const handleMoveDown = () => {
    // TODO: Implement move down in sibling order
    console.log('Move down not yet implemented');
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <ContextMenuPrimitive.Root>
      <ContextMenuPrimitive.Trigger asChild>
        {children}
      </ContextMenuPrimitive.Trigger>

      <ContextMenuPrimitive.Portal>
        <ContextMenuPrimitive.Content
          className="min-w-[200px] bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
          sideOffset={5}
        >
          {/* Duplicate */}
          <ContextMenuPrimitive.Item
            className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer outline-none"
            onSelect={handleDuplicate}
          >
            <Files className="w-4 h-4 mr-3" />
            <span>Duplicate</span>
            <span className="ml-auto text-xs text-gray-500">⌘D</span>
          </ContextMenuPrimitive.Item>

          <ContextMenuPrimitive.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

          {/* Copy */}
          <ContextMenuPrimitive.Item
            className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer outline-none"
            onSelect={handleCopy}
          >
            <Copy className="w-4 h-4 mr-3" />
            <span>Copy</span>
            <span className="ml-auto text-xs text-gray-500">⌘C</span>
          </ContextMenuPrimitive.Item>

          {/* Cut */}
          <ContextMenuPrimitive.Item
            className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer outline-none"
            onSelect={handleCut}
          >
            <Scissors className="w-4 h-4 mr-3" />
            <span>Cut</span>
            <span className="ml-auto text-xs text-gray-500">⌘X</span>
          </ContextMenuPrimitive.Item>

          {/* Paste */}
          <ContextMenuPrimitive.Item
            className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            onSelect={handlePaste}
            disabled={!clipboardHasData}
          >
            <Clipboard className="w-4 h-4 mr-3" />
            <span>Paste</span>
            <span className="ml-auto text-xs text-gray-500">⌘V</span>
          </ContextMenuPrimitive.Item>

          <ContextMenuPrimitive.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

          {/* Delete */}
          <ContextMenuPrimitive.Item
            className="flex items-center px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer outline-none"
            onSelect={handleDelete}
          >
            <Trash2 className="w-4 h-4 mr-3" />
            <span>Delete</span>
            <span className="ml-auto text-xs text-gray-500">⌫</span>
          </ContextMenuPrimitive.Item>

          <ContextMenuPrimitive.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

          {/* Lock/Unlock */}
          <ContextMenuPrimitive.Item
            className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer outline-none"
            onSelect={handleToggleLock}
          >
            {component.locked ? (
              <>
                <Unlock className="w-4 h-4 mr-3" />
                <span>Unlock</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-3" />
                <span>Lock</span>
              </>
            )}
          </ContextMenuPrimitive.Item>

          {/* Show/Hide */}
          <ContextMenuPrimitive.Item
            className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer outline-none"
            onSelect={handleToggleVisibility}
          >
            {component.hidden ? (
              <>
                <Eye className="w-4 h-4 mr-3" />
                <span>Show</span>
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4 mr-3" />
                <span>Hide</span>
              </>
            )}
          </ContextMenuPrimitive.Item>

          <ContextMenuPrimitive.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

          {/* Move Up */}
          <ContextMenuPrimitive.Item
            className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer outline-none"
            onSelect={handleMoveUp}
          >
            <ArrowUp className="w-4 h-4 mr-3" />
            <span>Move Up</span>
          </ContextMenuPrimitive.Item>

          {/* Move Down */}
          <ContextMenuPrimitive.Item
            className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer outline-none"
            onSelect={handleMoveDown}
          >
            <ArrowDown className="w-4 h-4 mr-3" />
            <span>Move Down</span>
          </ContextMenuPrimitive.Item>
        </ContextMenuPrimitive.Content>
      </ContextMenuPrimitive.Portal>
    </ContextMenuPrimitive.Root>
  );
};
