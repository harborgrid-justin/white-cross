/**
 * Component Detector Utilities
 *
 * Detects whether components should be Server or Client components
 * based on their properties, events, and children.
 */

import type { ComponentInstance, RenderMode } from '@/types';

/**
 * Features that require client-side rendering
 */
const CLIENT_SIDE_FEATURES = {
  events: [
    'onClick',
    'onChange',
    'onSubmit',
    'onFocus',
    'onBlur',
    'onKeyDown',
    'onKeyUp',
    'onMouseEnter',
    'onMouseLeave',
    'onMouseMove',
    'onScroll',
    'onDrag',
    'onDrop',
  ],
  hooks: [
    'useState',
    'useEffect',
    'useReducer',
    'useCallback',
    'useMemo',
    'useRef',
    'useContext',
  ],
  browserAPIs: [
    'window',
    'document',
    'localStorage',
    'sessionStorage',
    'navigator',
  ],
};

/**
 * Component types that are always client-side
 */
const CLIENT_COMPONENT_TYPES = new Set([
  'Button',
  'Input',
  'Textarea',
  'Select',
  'Checkbox',
  'Radio',
  'Switch',
  'Slider',
  'Form',
  'Modal',
  'Dialog',
  'Dropdown',
  'Tabs',
  'Accordion',
  'Carousel',
  'Drawer',
  'Toast',
  'Popover',
  'Tooltip',
]);

/**
 * Component types that can be server-side
 */
const SERVER_COMPONENT_TYPES = new Set([
  'Container',
  'Section',
  'Grid',
  'Flex',
  'Box',
  'Text',
  'Heading',
  'Paragraph',
  'Image',
  'Link',
  'List',
  'ListItem',
  'Card',
  'CardHeader',
  'CardContent',
  'CardFooter',
  'Divider',
  'Spacer',
]);

/**
 * Detect if a component requires client-side rendering
 *
 * @param component - Component instance to analyze
 * @param allComponents - All components in the tree (for child analysis)
 * @returns True if component requires 'use client' directive
 */
export function requiresClientComponent(
  component: ComponentInstance,
  allComponents: Map<string, ComponentInstance>
): boolean {
  // Check if component type is inherently client-side
  if (CLIENT_COMPONENT_TYPES.has(component.type)) {
    return true;
  }

  // Check for client-side event handlers
  if (hasClientSideEvents(component)) {
    return true;
  }

  // Check for browser-specific properties
  if (hasBrowserAPIs(component)) {
    return true;
  }

  // Check if any children require client-side rendering
  if (hasClientSideChildren(component, allComponents)) {
    return true;
  }

  // Check for state management
  if (hasStateManagement(component)) {
    return true;
  }

  return false;
}

/**
 * Check if component has client-side event handlers
 *
 * @param component - Component instance
 * @returns True if component has client-side events
 */
function hasClientSideEvents(component: ComponentInstance): boolean {
  const props = component.properties;

  return CLIENT_SIDE_FEATURES.events.some((event) =>
    Object.keys(props).some((prop) => prop.toLowerCase() === event.toLowerCase())
  );
}

/**
 * Check if component uses browser APIs
 *
 * @param component - Component instance
 * @returns True if component uses browser APIs
 */
function hasBrowserAPIs(component: ComponentInstance): boolean {
  const propsString = JSON.stringify(component.properties);

  return CLIENT_SIDE_FEATURES.browserAPIs.some((api) =>
    propsString.includes(api)
  );
}

/**
 * Check if any children require client-side rendering
 *
 * @param component - Component instance
 * @param allComponents - All components in the tree
 * @returns True if any child requires client-side rendering
 */
function hasClientSideChildren(
  component: ComponentInstance,
  allComponents: Map<string, ComponentInstance>
): boolean {
  return component.childIds.some((childId) => {
    const child = allComponents.get(childId);
    if (!child) return false;

    return requiresClientComponent(child, allComponents);
  });
}

/**
 * Check if component has state management
 *
 * @param component - Component instance
 * @returns True if component has state management
 */
function hasStateManagement(component: ComponentInstance): boolean {
  const props = component.properties;

  // Check for state-related properties
  return (
    props.hasState ||
    props.useState ||
    props.initialState ||
    props.defaultValue !== undefined
  );
}

/**
 * Determine the render mode for a component
 *
 * @param component - Component instance
 * @param allComponents - All components in the tree
 * @returns Render mode (server or client)
 */
export function detectRenderMode(
  component: ComponentInstance,
  allComponents: Map<string, ComponentInstance>
): RenderMode {
  if (requiresClientComponent(component, allComponents)) {
    return 'client' as RenderMode;
  }

  return 'server' as RenderMode;
}

/**
 * Analyze all components and return client/server classification
 *
 * @param components - Array of component instances
 * @returns Map of component IDs to render modes
 */
export function analyzeComponentTree(
  components: ComponentInstance[]
): Map<string, RenderMode> {
  const componentMap = new Map(
    components.map((c) => [c.id, c])
  );

  const renderModes = new Map<string, RenderMode>();

  components.forEach((component) => {
    renderModes.set(
      component.id,
      detectRenderMode(component, componentMap)
    );
  });

  return renderModes;
}

/**
 * Get all client components from a tree
 *
 * @param components - Array of component instances
 * @returns Array of component IDs that require client-side rendering
 */
export function getClientComponents(
  components: ComponentInstance[]
): string[] {
  const renderModes = analyzeComponentTree(components);

  return Array.from(renderModes.entries())
    .filter(([_, mode]) => mode === 'client')
    .map(([id]) => id);
}

/**
 * Get all server components from a tree
 *
 * @param components - Array of component instances
 * @returns Array of component IDs that can be server-side rendered
 */
export function getServerComponents(
  components: ComponentInstance[]
): string[] {
  const renderModes = analyzeComponentTree(components);

  return Array.from(renderModes.entries())
    .filter(([_, mode]) => mode === 'server')
    .map(([id]) => id);
}

/**
 * Check if a component tree has any client components
 *
 * @param components - Array of component instances
 * @returns True if tree contains at least one client component
 */
export function hasClientComponents(
  components: ComponentInstance[]
): boolean {
  return getClientComponents(components).length > 0;
}

/**
 * Suggest optimizations for component tree
 *
 * @param components - Array of component instances
 * @returns Array of optimization suggestions
 */
export function suggestOptimizations(
  components: ComponentInstance[]
): Array<{ componentId: string; suggestion: string }> {
  const suggestions: Array<{ componentId: string; suggestion: string }> = [];
  const componentMap = new Map(components.map((c) => [c.id, c]));

  components.forEach((component) => {
    // Suggest moving client components down the tree
    if (requiresClientComponent(component, componentMap)) {
      const hasServerChildren = component.childIds.some((childId) => {
        const child = componentMap.get(childId);
        return child && !requiresClientComponent(child, componentMap);
      });

      if (hasServerChildren) {
        suggestions.push({
          componentId: component.id,
          suggestion:
            'Consider splitting this component to keep server components separate from client interactivity',
        });
      }
    }
  });

  return suggestions;
}
