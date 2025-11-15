/**
 * Component Definitions Index
 *
 * Central export point for all component definitions organized by category.
 */

import { ComponentDefinition, ComponentCatalog, ComponentGroup } from '../types';

// Import component definitions by category
import { LayoutComponents } from './layout.definitions';
import { NavigationComponents } from './navigation.definitions';
import { FormComponents } from './form.definitions';
import { DataDisplayComponents } from './data-display.definitions';
import { NextJsComponents } from './nextjs.definitions';

// Export individual component arrays
export { LayoutComponents } from './layout.definitions';
export { NavigationComponents } from './navigation.definitions';
export { FormComponents } from './form.definitions';
export { DataDisplayComponents } from './data-display.definitions';
export { NextJsComponents } from './nextjs.definitions';

/**
 * All component definitions combined
 */
export const AllComponents: ComponentDefinition[] = [
  ...LayoutComponents,
  ...NavigationComponents,
  ...FormComponents,
  ...DataDisplayComponents,
  ...NextJsComponents,
];

/**
 * Component groups for organization in the builder UI
 */
export const ComponentGroups: ComponentGroup[] = [
  {
    id: 'group-layout',
    name: 'Layout',
    description: 'Container and layout components for page structure',
    icon: 'LayoutTemplate',
    components: LayoutComponents.map(c => c.id),
    order: 1,
  },
  {
    id: 'group-navigation',
    name: 'Navigation',
    description: 'Navigation components for site navigation',
    icon: 'Navigation',
    components: NavigationComponents.map(c => c.id),
    order: 2,
  },
  {
    id: 'group-form',
    name: 'Forms',
    description: 'Form input components with validation',
    icon: 'FileInput',
    components: FormComponents.map(c => c.id),
    order: 3,
  },
  {
    id: 'group-data-display',
    name: 'Data Display',
    description: 'Components for displaying data',
    icon: 'Table',
    components: DataDisplayComponents.map(c => c.id),
    order: 4,
  },
  {
    id: 'group-nextjs',
    name: 'Next.js',
    description: 'Next.js-specific components and optimizations',
    icon: 'Zap',
    components: NextJsComponents.map(c => c.id),
    order: 5,
  },
];

/**
 * Default component catalog
 */
export const DefaultComponentCatalog: ComponentCatalog = {
  version: '1.0.0',
  components: AllComponents,
  groups: ComponentGroups,
  templates: [], // Can be populated with pre-built templates
  presets: [], // Can be populated with property presets
  customComponents: [],
};

/**
 * Component lookup by ID
 */
export const ComponentRegistry = new Map<string, ComponentDefinition>(
  AllComponents.map(component => [component.id, component])
);

/**
 * Get component by ID
 */
export function getComponentById(id: string): ComponentDefinition | undefined {
  return ComponentRegistry.get(id);
}

/**
 * Get components by category
 */
export function getComponentsByCategory(category: ComponentDefinition['category']): ComponentDefinition[] {
  return AllComponents.filter(c => c.category === category);
}

/**
 * Get components by tag
 */
export function getComponentsByTag(tag: string): ComponentDefinition[] {
  return AllComponents.filter(c => c.tags?.includes(tag));
}

/**
 * Get components by render mode
 */
export function getComponentsByRenderMode(renderMode: ComponentDefinition['renderMode']): ComponentDefinition[] {
  return AllComponents.filter(c => c.renderMode === renderMode);
}

/**
 * Search components
 */
export function searchComponents(query: string): ComponentDefinition[] {
  const lowercaseQuery = query.toLowerCase();

  return AllComponents.filter(component => {
    return (
      component.name.toLowerCase().includes(lowercaseQuery) ||
      component.displayName.toLowerCase().includes(lowercaseQuery) ||
      component.description.toLowerCase().includes(lowercaseQuery) ||
      component.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  });
}

/**
 * Component statistics
 */
export const ComponentStats = {
  total: AllComponents.length,
  byCategory: {
    layout: LayoutComponents.length,
    navigation: NavigationComponents.length,
    form: FormComponents.length,
    dataDisplay: DataDisplayComponents.length,
    nextjs: NextJsComponents.length,
  },
  byRenderMode: {
    server: AllComponents.filter(c => c.renderMode === 'server').length,
    client: AllComponents.filter(c => c.renderMode === 'client').length,
    hybrid: AllComponents.filter(c => c.renderMode === 'hybrid').length,
  },
};
