/**
 * PaletteItem Component
 *
 * Individual draggable component in the component palette.
 * Features:
 * - Drag source using @dnd-kit
 * - Component icon and name
 * - Hover preview state
 * - Description tooltip
 * - Accessibility support
 */

'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as LucideIcons from 'lucide-react';
import { ComponentDefinition } from '../../types';
import { cn } from '../../utils/cn';

export interface PaletteItemProps {
  /**
   * Component definition to display
   */
  component: ComponentDefinition;

  /**
   * Optional custom className
   */
  className?: string;

  /**
   * Callback when component is clicked (alternative to drag)
   */
  onClick?: (component: ComponentDefinition) => void;
}

/**
 * PaletteItem - Draggable component in the palette
 *
 * Displays a component with its icon, name, and description tooltip.
 * Can be dragged to the canvas to add to the page.
 *
 * @example
 * ```tsx
 * <PaletteItem
 *   component={componentDefinition}
 *   onClick={(comp) => console.log('Clicked', comp.name)}
 * />
 * ```
 */
export function PaletteItem({ component, className, onClick }: PaletteItemProps) {
  const { attributes, listeners, setNodeRef, isDragging, transform } = useDraggable({
    id: `palette-${component.id}`,
    data: {
      type: 'component-definition',
      component,
    },
  });

  // Get the Lucide icon component dynamically
  const IconComponent = (LucideIcons as any)[component.icon] || LucideIcons.Box;

  // Apply transform styles when dragging
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const handleClick = () => {
    onClick?.(component);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Space or Enter triggers click
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div
            ref={setNodeRef}
            style={style}
            className={cn(
              // Base styles
              'group relative flex items-center gap-3 px-3 py-2.5 rounded-lg',
              'transition-all duration-150 cursor-grab active:cursor-grabbing',

              // Interactive states
              'hover:bg-accent hover:shadow-sm',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',

              // Dragging state
              isDragging && 'opacity-50 scale-95 shadow-lg',

              // Custom className
              className
            )}
            {...attributes}
            {...listeners}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`Add ${component.name} component`}
            aria-describedby={`tooltip-${component.id}`}
          >
            {/* Icon */}
            <div
              className={cn(
                'flex items-center justify-center w-10 h-10 rounded-md',
                'bg-primary/10 text-primary',
                'group-hover:bg-primary/20 transition-colors'
              )}
              aria-hidden="true"
            >
              <IconComponent className="w-5 h-5" />
            </div>

            {/* Name and render mode badge */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground truncate">
                  {component.name}
                </p>

                {/* Render mode badge */}
                {component.renderMode === 'client' && (
                  <span
                    className="px-1.5 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    aria-label="Client component"
                  >
                    C
                  </span>
                )}
                {component.renderMode === 'server' && (
                  <span
                    className="px-1.5 py-0.5 text-xs font-medium rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    aria-label="Server component"
                  >
                    S
                  </span>
                )}
              </div>

              {/* Container indicator */}
              {component.isContainer && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Container
                </p>
              )}
            </div>

            {/* Drag handle indicator */}
            <div
              className={cn(
                'opacity-0 group-hover:opacity-100 transition-opacity',
                'text-muted-foreground'
              )}
              aria-hidden="true"
            >
              <LucideIcons.GripVertical className="w-4 h-4" />
            </div>
          </div>
        </Tooltip.Trigger>

        {/* Tooltip with description */}
        <Tooltip.Portal>
          <Tooltip.Content
            id={`tooltip-${component.id}`}
            className={cn(
              'z-50 max-w-xs px-3 py-2 text-sm rounded-md shadow-md',
              'bg-popover text-popover-foreground border border-border',
              'animate-in fade-in-0 zoom-in-95',
              'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
              'data-[side=bottom]:slide-in-from-top-2',
              'data-[side=left]:slide-in-from-right-2',
              'data-[side=right]:slide-in-from-left-2',
              'data-[side=top]:slide-in-from-bottom-2'
            )}
            sideOffset={5}
            side="right"
          >
            <div className="space-y-1">
              <p className="font-semibold">{component.name}</p>
              <p className="text-xs text-muted-foreground">
                {component.description}
              </p>
              {component.isContainer && (
                <p className="text-xs text-muted-foreground italic">
                  Can contain child components
                </p>
              )}
            </div>
            <Tooltip.Arrow className="fill-border" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

/**
 * Memoized version to prevent unnecessary re-renders
 */
export const MemoizedPaletteItem = React.memo(PaletteItem);
