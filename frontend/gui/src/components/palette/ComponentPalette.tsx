/**
 * ComponentPalette Component
 *
 * Main component palette/library panel for the page builder.
 * Features:
 * - Sidebar panel (280px width)
 * - Category tabs
 * - Search bar
 * - Virtualized component list
 * - Drag-and-drop sources
 * - Accessibility support
 */

'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { ComponentCategory, ComponentDefinition } from '../../types';
import { componentRegistry, getCategoriesWithCounts } from './componentRegistry';
import { SearchBar } from './SearchBar';
import { CategoryTabs } from './CategoryTabs';
import { PaletteItem } from './PaletteItem';
import { cn } from '../../utils/cn';

export interface ComponentPaletteProps {
  /**
   * Optional custom className
   */
  className?: string;

  /**
   * Height of the palette (defaults to full viewport)
   */
  height?: number | string;

  /**
   * Callback when a component is clicked (alternative to drag)
   */
  onComponentClick?: (component: ComponentDefinition) => void;

  /**
   * Optional header content
   */
  headerContent?: React.ReactNode;
}

// Component item height for virtualization
const ITEM_HEIGHT = 56;

// Palette width
const PALETTE_WIDTH = 280;

/**
 * ComponentPalette - Main palette container
 *
 * Provides a searchable, filterable component library panel.
 * Components can be dragged to the canvas or clicked to add.
 *
 * @example
 * ```tsx
 * <ComponentPalette
 *   height="calc(100vh - 64px)"
 *   onComponentClick={(comp) => console.log('Add', comp.name)}
 * />
 * ```
 */
export function ComponentPalette({
  className,
  height = '100vh',
  onComponentClick,
  headerContent,
}: ComponentPaletteProps) {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ComponentCategory | 'all'>('all');

  // Get category counts
  const categoryCounts = useMemo(() => getCategoriesWithCounts(), []);

  // Filter components based on search and category
  const filteredComponents = useMemo(() => {
    let components = componentRegistry;

    // Filter by search query
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      components = components.filter(
        (comp) =>
          comp.name.toLowerCase().includes(lowerQuery) ||
          comp.description.toLowerCase().includes(lowerQuery) ||
          comp.category.toLowerCase().includes(lowerQuery)
      );
    }

    // Filter by category
    if (activeCategory !== 'all') {
      components = components.filter((comp) => comp.category === activeCategory);
    }

    return components;
  }, [searchQuery, activeCategory]);

  // Render row for react-window
  const Row = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const component = filteredComponents[index];

      return (
        <div style={style}>
          <PaletteItem
            component={component}
            onClick={onComponentClick}
          />
        </div>
      );
    },
    [filteredComponents, onComponentClick]
  );

  // Calculate list height (subtract header height)
  const getListHeight = (): number => {
    if (typeof height === 'number') {
      return height - 180; // Header + search + tabs ≈ 180px
    }
    // For string heights like "100vh", use a reasonable default
    return 600;
  };

  return (
    <div
      className={cn(
        'flex flex-col bg-background border-r border-border',
        className
      )}
      style={{
        width: PALETTE_WIDTH,
        height: height,
      }}
    >
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-border">
        {headerContent || (
          <h2 className="text-lg font-semibold text-foreground">
            Components
          </h2>
        )}
      </div>

      {/* Search Bar */}
      <div className="flex-shrink-0 px-4 py-3">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search components..."
        />
      </div>

      {/* Category Tabs */}
      <div className="flex-shrink-0 px-4 py-2">
        <CategoryTabs
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          categoryCounts={categoryCounts}
        />
      </div>

      {/* Component List */}
      <div className="flex-1 overflow-hidden px-2">
        {filteredComponents.length > 0 ? (
          <List
            height={getListHeight()}
            itemCount={filteredComponents.length}
            itemSize={ITEM_HEIGHT}
            width="100%"
            className="scrollbar-thin"
            id="component-list"
            role="list"
            aria-label="Available components"
          >
            {Row}
          </List>
        ) : (
          // Empty state
          <div
            className="flex flex-col items-center justify-center h-64 text-center px-4"
            role="status"
          >
            <p className="text-sm text-muted-foreground">
              {searchQuery
                ? `No components found for "${searchQuery}"`
                : 'No components in this category'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={cn(
                  'mt-3 px-3 py-1.5 text-sm font-medium rounded-md',
                  'text-primary hover:text-primary/80',
                  'hover:bg-accent',
                  'focus:outline-none focus:ring-2 focus:ring-ring',
                  'transition-colors'
                )}
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer (optional) */}
      <div className="flex-shrink-0 px-4 py-2 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          {filteredComponents.length} component{filteredComponents.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}

/**
 * Memoized version to prevent unnecessary re-renders
 */
export const MemoizedComponentPalette = React.memo(ComponentPalette);
