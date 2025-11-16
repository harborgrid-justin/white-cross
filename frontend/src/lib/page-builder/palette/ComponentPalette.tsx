/**
 * Component Palette
 *
 * Visual palette for browsing and selecting components in the page builder
 */

'use client';

import React, { useState, useMemo } from 'react';
import { ComponentDefinition, ComponentCategory } from '../types/component.types';
import { CatalogFilter } from '../types/catalog.types';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export interface ComponentPaletteProps {
  /** Available components */
  components: ComponentDefinition[];

  /** Selected category filter */
  selectedCategory?: ComponentCategory;

  /** Search query */
  searchQuery?: string;

  /** Custom filter */
  filter?: CatalogFilter;

  /** Callback when component is selected */
  onComponentSelect?: (component: ComponentDefinition) => void;

  /** Callback when component is dragged */
  onComponentDragStart?: (component: ComponentDefinition, e: React.DragEvent) => void;

  /** View mode */
  viewMode?: 'grid' | 'list';

  /** Show component previews */
  showPreviews?: boolean;

  /** Custom className */
  className?: string;
}

/**
 * Component Palette
 */
export function ComponentPalette({
  components,
  selectedCategory,
  searchQuery: initialSearchQuery = '',
  filter,
  onComponentSelect,
  onComponentDragStart,
  viewMode = 'grid',
  showPreviews = false,
  className,
}: ComponentPaletteProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [activeCategory, setActiveCategory] = useState<ComponentCategory | 'all'>(
    selectedCategory || 'all'
  );

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set<ComponentCategory>();
    components.forEach((c) => cats.add(c.category));
    return Array.from(cats).sort();
  }, [components]);

  // Filter components
  const filteredComponents = useMemo(() => {
    let filtered = components;

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter((c) => c.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.displayName.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Apply custom filter
    if (filter) {
      if (filter.categories && filter.categories.length > 0) {
        filtered = filtered.filter((c) => filter.categories!.includes(c.category));
      }
      if (filter.tags && filter.tags.length > 0) {
        filtered = filtered.filter((c) =>
          c.tags?.some((tag) => filter.tags!.includes(tag))
        );
      }
      if (filter.renderMode && filter.renderMode.length > 0) {
        filtered = filtered.filter((c) => filter.renderMode!.includes(c.renderMode));
      }
      if (filter.deprecated !== undefined) {
        filtered = filtered.filter((c) => c.deprecated === filter.deprecated);
      }
    }

    return filtered;
  }, [components, activeCategory, searchQuery, filter]);

  // Group components by category
  const groupedComponents = useMemo(() => {
    const groups: Record<ComponentCategory, ComponentDefinition[]> = {} as any;
    filteredComponents.forEach((component) => {
      if (!groups[component.category]) {
        groups[component.category] = [];
      }
      groups[component.category].push(component);
    });
    return groups;
  }, [filteredComponents]);

  const handleDragStart = (component: ComponentDefinition, e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('application/json', JSON.stringify(component));
    onComponentDragStart?.(component, e);
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Search */}
      <div className="p-4 border-b">
        <Input
          type="search"
          placeholder="Search components..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Categories */}
      <Tabs
        value={activeCategory}
        onValueChange={(value) => setActiveCategory(value as ComponentCategory | 'all')}
        className="flex-1 flex flex-col"
      >
        <TabsList className="w-full justify-start overflow-x-auto border-b rounded-none h-auto p-2">
          <TabsTrigger value="all" className="rounded-md">
            All
          </TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="rounded-md capitalize">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="all" className="m-0 p-4">
            <ComponentGrid
              components={filteredComponents}
              viewMode={viewMode}
              showPreviews={showPreviews}
              onSelect={onComponentSelect}
              onDragStart={handleDragStart}
            />
          </TabsContent>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="m-0 p-4">
              <ComponentGrid
                components={groupedComponents[category] || []}
                viewMode={viewMode}
                showPreviews={showPreviews}
                onSelect={onComponentSelect}
                onDragStart={handleDragStart}
              />
            </TabsContent>
          ))}
        </ScrollArea>
      </Tabs>
    </div>
  );
}

/**
 * Component Grid/List View
 */
interface ComponentGridProps {
  components: ComponentDefinition[];
  viewMode: 'grid' | 'list';
  showPreviews: boolean;
  onSelect?: (component: ComponentDefinition) => void;
  onDragStart?: (component: ComponentDefinition, e: React.DragEvent) => void;
}

function ComponentGrid({
  components,
  viewMode,
  showPreviews,
  onSelect,
  onDragStart,
}: ComponentGridProps) {
  if (components.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        No components found
      </div>
    );
  }

  return (
    <div
      className={cn(
        viewMode === 'grid'
          ? 'grid grid-cols-2 gap-3'
          : 'flex flex-col space-y-2'
      )}
    >
      {components.map((component) => (
        <ComponentCard
          key={component.id}
          component={component}
          viewMode={viewMode}
          showPreview={showPreviews}
          onSelect={onSelect}
          onDragStart={onDragStart}
        />
      ))}
    </div>
  );
}

/**
 * Component Card
 */
interface ComponentCardProps {
  component: ComponentDefinition;
  viewMode: 'grid' | 'list';
  showPreview: boolean;
  onSelect?: (component: ComponentDefinition) => void;
  onDragStart?: (component: ComponentDefinition, e: React.DragEvent) => void;
}

function ComponentCard({
  component,
  viewMode,
  showPreview,
  onSelect,
  onDragStart,
}: ComponentCardProps) {
  const isDeprecated = component.deprecated;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart?.(component, e)}
      onClick={() => onSelect?.(component)}
      className={cn(
        'group relative cursor-move rounded-lg border p-3 transition-all',
        'hover:border-primary hover:shadow-md',
        'active:scale-95',
        isDeprecated && 'opacity-50',
        viewMode === 'list' && 'flex items-start space-x-3'
      )}
    >
      {/* Icon */}
      {component.icon && (
        <div className="flex-shrink-0 mb-2">
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
            {/* Icon would be rendered here */}
            <span className="text-xs">{component.icon.slice(0, 2)}</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Title */}
        <div className="font-medium text-sm mb-1 truncate">
          {component.displayName}
        </div>

        {/* Description */}
        <div className="text-xs text-muted-foreground line-clamp-2 mb-2">
          {component.description}
        </div>

        {/* Tags */}
        {component.tags && component.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {component.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                {tag}
              </Badge>
            ))}
            {component.tags.length > 2 && (
              <span className="text-xs text-muted-foreground">
                +{component.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Deprecated badge */}
        {isDeprecated && (
          <Badge variant="destructive" className="absolute top-2 right-2 text-xs">
            Deprecated
          </Badge>
        )}
      </div>

      {/* Preview */}
      {showPreview && component.thumbnail && (
        <div className="mt-2 border rounded overflow-hidden">
          <img
            src={component.thumbnail}
            alt={component.displayName}
            className="w-full h-auto"
          />
        </div>
      )}
    </div>
  );
}
