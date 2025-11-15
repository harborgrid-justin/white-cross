/**
 * Component Catalog Registry
 *
 * Advanced registry system for managing component catalog,
 * including custom components, filtering, and search.
 */

import {
  ComponentDefinition,
  ComponentCatalog,
  CatalogFilter,
  CatalogSort,
  ComponentSearchResult,
  CustomComponentRegistration,
} from '../types';
import { DefaultComponentCatalog, AllComponents } from '../components';

/**
 * Component Catalog Registry Class
 */
export class ComponentCatalogRegistry {
  private catalog: ComponentCatalog;
  private customComponents: Map<string, CustomComponentRegistration>;

  constructor(initialCatalog: ComponentCatalog = DefaultComponentCatalog) {
    this.catalog = initialCatalog;
    this.customComponents = new Map();
  }

  /**
   * Get the full catalog
   */
  getCatalog(): ComponentCatalog {
    return {
      ...this.catalog,
      customComponents: Array.from(this.customComponents.values()).map(reg => reg.definition),
    };
  }

  /**
   * Get all components (built-in + custom)
   */
  getAllComponents(): ComponentDefinition[] {
    const customDefs = Array.from(this.customComponents.values()).map(reg => reg.definition);
    return [...this.catalog.components, ...customDefs];
  }

  /**
   * Get component by ID
   */
  getComponentById(id: string): ComponentDefinition | undefined {
    // Check built-in components first
    const builtIn = this.catalog.components.find(c => c.id === id);
    if (builtIn) return builtIn;

    // Check custom components
    const custom = this.customComponents.get(id);
    return custom?.definition;
  }

  /**
   * Register a custom component
   */
  registerCustomComponent(registration: CustomComponentRegistration): void {
    const { definition } = registration;

    // Validate component ID doesn't conflict with built-in components
    if (this.catalog.components.some(c => c.id === definition.id)) {
      throw new Error(`Component ID '${definition.id}' conflicts with a built-in component`);
    }

    this.customComponents.set(definition.id, registration);
  }

  /**
   * Unregister a custom component
   */
  unregisterCustomComponent(id: string): boolean {
    return this.customComponents.delete(id);
  }

  /**
   * Get custom components only
   */
  getCustomComponents(): ComponentDefinition[] {
    return Array.from(this.customComponents.values()).map(reg => reg.definition);
  }

  /**
   * Filter components
   */
  filterComponents(filter: CatalogFilter): ComponentDefinition[] {
    let components = this.getAllComponents();

    // Filter by categories
    if (filter.categories && filter.categories.length > 0) {
      components = components.filter(c => filter.categories!.includes(c.category));
    }

    // Filter by tags
    if (filter.tags && filter.tags.length > 0) {
      components = components.filter(c =>
        c.tags?.some(tag => filter.tags!.includes(tag))
      );
    }

    // Filter by render mode
    if (filter.renderMode && filter.renderMode.length > 0) {
      components = components.filter(c => filter.renderMode!.includes(c.renderMode));
    }

    // Filter by search query
    if (filter.search) {
      const query = filter.search.toLowerCase();
      components = components.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.displayName.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter deprecated
    if (filter.deprecated !== undefined) {
      components = components.filter(c => c.deprecated === filter.deprecated);
    }

    // Filter custom only
    if (filter.customOnly) {
      const customIds = new Set(this.customComponents.keys());
      components = components.filter(c => customIds.has(c.id));
    }

    return components;
  }

  /**
   * Sort components
   */
  sortComponents(components: ComponentDefinition[], sort: CatalogSort): ComponentDefinition[] {
    const sorted = [...components];

    sorted.sort((a, b) => {
      let comparison = 0;

      switch (sort.by) {
        case 'name':
          comparison = a.displayName.localeCompare(b.displayName);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'custom':
          // Custom sorting would require additional metadata
          comparison = 0;
          break;
        default:
          comparison = 0;
      }

      return sort.direction === 'desc' ? -comparison : comparison;
    });

    return sorted;
  }

  /**
   * Search components with scoring
   */
  searchComponents(query: string): ComponentSearchResult[] {
    if (!query.trim()) {
      return [];
    }

    const lowercaseQuery = query.toLowerCase();
    const results: ComponentSearchResult[] = [];

    for (const component of this.getAllComponents()) {
      let score = 0;
      const matchedFields: string[] = [];

      // Exact name match (highest score)
      if (component.name.toLowerCase() === lowercaseQuery) {
        score += 100;
        matchedFields.push('name');
      } else if (component.name.toLowerCase().includes(lowercaseQuery)) {
        score += 50;
        matchedFields.push('name');
      }

      // Display name match
      if (component.displayName.toLowerCase().includes(lowercaseQuery)) {
        score += 40;
        matchedFields.push('displayName');
      }

      // Description match
      if (component.description.toLowerCase().includes(lowercaseQuery)) {
        score += 20;
        matchedFields.push('description');
      }

      // Tag match
      if (component.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))) {
        score += 30;
        matchedFields.push('tags');
      }

      // Category match
      if (component.category.toLowerCase().includes(lowercaseQuery)) {
        score += 25;
        matchedFields.push('category');
      }

      if (score > 0) {
        results.push({
          component,
          score,
          matchedFields,
        });
      }
    }

    // Sort by score descending
    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * Get component suggestions based on current context
   */
  getSuggestions(context: {
    currentComponent?: string;
    parentComponent?: string;
    recentlyUsed?: string[];
  }): ComponentDefinition[] {
    const suggestions = new Set<ComponentDefinition>();

    // If there's a parent component, suggest compatible children
    if (context.parentComponent) {
      const parent = this.getComponentById(context.parentComponent);
      if (parent?.childrenTypes) {
        parent.childrenTypes.forEach(childId => {
          const child = this.getComponentById(childId);
          if (child) suggestions.add(child);
        });
      }
    }

    // Add recently used components
    if (context.recentlyUsed) {
      context.recentlyUsed.forEach(id => {
        const component = this.getComponentById(id);
        if (component) suggestions.add(component);
      });
    }

    // If no suggestions yet, return popular layout components
    if (suggestions.size === 0) {
      const popular = ['layout-container', 'layout-flex', 'layout-grid', 'data-card'];
      popular.forEach(id => {
        const component = this.getComponentById(id);
        if (component) suggestions.add(component);
      });
    }

    return Array.from(suggestions);
  }

  /**
   * Validate component instance against definition
   */
  validateComponent(componentId: string, props: Record<string, unknown>): {
    valid: boolean;
    errors: string[];
  } {
    const definition = this.getComponentById(componentId);
    if (!definition) {
      return {
        valid: false,
        errors: [`Component '${componentId}' not found in catalog`],
      };
    }

    const errors: string[] = [];

    // Check required props
    if (definition.requiredProps) {
      for (const requiredProp of definition.requiredProps) {
        if (!(requiredProp in props)) {
          errors.push(`Required prop '${requiredProp}' is missing`);
        }
      }
    }

    // Validate prop types (basic validation)
    for (const propDef of definition.props) {
      if (propDef.name in props) {
        const value = props[propDef.name];
        const expectedType = propDef.type;

        // Basic type checking
        if (expectedType === 'string' && typeof value !== 'string') {
          errors.push(`Prop '${propDef.name}' should be a string`);
        } else if (expectedType === 'number' && typeof value !== 'number') {
          errors.push(`Prop '${propDef.name}' should be a number`);
        } else if (expectedType === 'boolean' && typeof value !== 'boolean') {
          errors.push(`Prop '${propDef.name}' should be a boolean`);
        } else if (expectedType === 'array' && !Array.isArray(value)) {
          errors.push(`Prop '${propDef.name}' should be an array`);
        } else if (expectedType === 'object' && (typeof value !== 'object' || Array.isArray(value))) {
          errors.push(`Prop '${propDef.name}' should be an object`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Export catalog
   */
  exportCatalog(): string {
    return JSON.stringify(this.getCatalog(), null, 2);
  }

  /**
   * Import catalog (merge with existing)
   */
  importCatalog(catalogJson: string): {
    success: boolean;
    imported: number;
    errors: string[];
  } {
    try {
      const imported: ComponentCatalog = JSON.parse(catalogJson);
      const errors: string[] = [];
      let importedCount = 0;

      // Import custom components
      if (imported.customComponents) {
        for (const component of imported.customComponents) {
          try {
            this.registerCustomComponent({
              definition: component,
              source: 'remote',
            });
            importedCount++;
          } catch (error) {
            errors.push(`Failed to import component '${component.id}': ${error}`);
          }
        }
      }

      return {
        success: errors.length === 0,
        imported: importedCount,
        errors,
      };
    } catch (error) {
      return {
        success: false,
        imported: 0,
        errors: [`Failed to parse catalog JSON: ${error}`],
      };
    }
  }
}

/**
 * Global registry instance
 */
export const globalRegistry = new ComponentCatalogRegistry();

/**
 * Get the global registry
 */
export function getGlobalRegistry(): ComponentCatalogRegistry {
  return globalRegistry;
}
