/**
 * Component Generator
 *
 * Generates JSX code from component instances.
 * Handles component hierarchy, props, styles, and children.
 */

import type { ComponentInstance } from '@/types';
import { StyleGenerator } from './StyleGenerator';
import { ImportManager } from './ImportManager';

/**
 * Component generation options
 */
export interface ComponentGenerationOptions {
  indentLevel?: number;
  indentSize?: number;
  useTailwind?: boolean;
  includeComments?: boolean;
}

/**
 * Component Generator class
 *
 * Generates JSX code from component instances.
 */
export class ComponentGenerator {
  private importManager: ImportManager;
  private componentMap: Map<string, ComponentInstance>;

  constructor(
    components: ComponentInstance[],
    importManager?: ImportManager
  ) {
    this.importManager = importManager || new ImportManager();
    this.componentMap = new Map(components.map((c) => [c.id, c]));
  }

  /**
   * Generate JSX for a single component
   *
   * @param component - Component instance
   * @param options - Generation options
   * @returns JSX code string
   */
  generateComponent(
    component: ComponentInstance,
    options: ComponentGenerationOptions = {}
  ): string {
    const {
      indentLevel = 0,
      indentSize = 2,
      useTailwind = true,
      includeComments = false,
    } = options;

    const indent = ' '.repeat(indentLevel * indentSize);

    // Generate component opening tag
    const tagName = this.getComponentTagName(component);
    const attributes = this.generateAttributes(component, useTailwind);
    const hasChildren = component.childIds.length > 0;

    // Add comment if enabled
    const comment = includeComments
      ? `${indent}{/* ${component.name} */}\n`
      : '';

    // Generate opening tag
    let jsx = `${comment}${indent}<${tagName}`;

    // Add attributes
    if (attributes.length > 0) {
      if (attributes.length === 1 && attributes[0].length < 40) {
        // Single line if short
        jsx += ` ${attributes.join(' ')}`;
      } else {
        // Multi-line for readability
        jsx += '\n';
        attributes.forEach((attr) => {
          jsx += `${indent}  ${attr}\n`;
        });
        jsx += `${indent}`;
      }
    }

    // Handle children or self-closing
    if (hasChildren) {
      jsx += '>\n';

      // Generate children
      component.childIds.forEach((childId) => {
        const child = this.componentMap.get(childId);
        if (child) {
          jsx += this.generateComponent(child, {
            ...options,
            indentLevel: indentLevel + 1,
          });
          jsx += '\n';
        }
      });

      jsx += `${indent}</${tagName}>`;
    } else if (this.hasTextContent(component)) {
      // Text content
      jsx += '>';
      jsx += this.getTextContent(component);
      jsx += `</${tagName}>`;
    } else {
      // Self-closing
      jsx += ' />';
    }

    return jsx;
  }

  /**
   * Generate JSX for component tree
   *
   * @param rootComponentIds - Array of root component IDs
   * @param options - Generation options
   * @returns JSX code string
   */
  generateComponentTree(
    rootComponentIds: string[],
    options: ComponentGenerationOptions = {}
  ): string {
    const jsxParts: string[] = [];

    rootComponentIds.forEach((id) => {
      const component = this.componentMap.get(id);
      if (component) {
        jsxParts.push(this.generateComponent(component, options));
      }
    });

    return jsxParts.join('\n');
  }

  /**
   * Get component tag name
   *
   * @param component - Component instance
   * @returns HTML/React tag name
   */
  private getComponentTagName(component: ComponentInstance): string {
    // Map component types to HTML/React tags
    const tagMap: Record<string, string> = {
      Container: 'div',
      Section: 'section',
      Box: 'div',
      Flex: 'div',
      Grid: 'div',
      Text: 'p',
      Heading: 'h1',
      Paragraph: 'p',
      Button: 'button',
      Link: 'a',
      Image: 'img',
      Input: 'input',
      Textarea: 'textarea',
      Select: 'select',
      Form: 'form',
      List: 'ul',
      ListItem: 'li',
      Card: 'div',
      CardHeader: 'div',
      CardContent: 'div',
      CardFooter: 'div',
    };

    // Check if it's a Next.js component that needs import
    if (component.type === 'Link') {
      this.importManager.addNextImports({ Link: true });
      return 'Link';
    }

    if (component.type === 'Image') {
      this.importManager.addNextImports({ Image: true });
      return 'Image';
    }

    return tagMap[component.type] || 'div';
  }

  /**
   * Generate component attributes
   *
   * @param component - Component instance
   * @param useTailwind - Use Tailwind for styling
   * @returns Array of attribute strings
   */
  private generateAttributes(
    component: ComponentInstance,
    useTailwind: boolean
  ): string[] {
    const attributes: string[] = [];

    // Add id if present
    if (component.properties.id) {
      attributes.push(`id="${component.properties.id}"`);
    }

    // Add className from styles
    const styleAttr = this.generateStyleAttributes(component, useTailwind);
    if (styleAttr.className) {
      attributes.push(styleAttr.className);
    }

    // Add custom style if needed
    if (styleAttr.style) {
      attributes.push(styleAttr.style);
    }

    // Add other props
    const props = this.generateProps(component);
    attributes.push(...props);

    // Add event handlers
    const events = this.generateEventHandlers(component);
    attributes.push(...events);

    return attributes;
  }

  /**
   * Generate style attributes
   *
   * @param component - Component instance
   * @param useTailwind - Use Tailwind for styling
   * @returns Style attributes object
   */
  private generateStyleAttributes(
    component: ComponentInstance,
    useTailwind: boolean
  ): { className?: string; style?: string } {
    if (!useTailwind) {
      // Use inline styles
      const styleEntries = Object.entries(component.styles)
        .map(([key, value]) => `${key}: '${value}'`)
        .join(', ');

      return {
        style: styleEntries ? `style={{ ${styleEntries} }}` : undefined,
      };
    }

    // Use Tailwind
    const styleGenerator = new StyleGenerator();
    styleGenerator.addStyles(component.styles);

    const className = styleGenerator.getClassName();
    const customStyles = styleGenerator.getCustomStyles();

    return {
      className: className ? `className="${className}"` : undefined,
      style: Object.keys(customStyles).length > 0
        ? `style={{ ${Object.entries(customStyles)
            .map(([k, v]) => `${k}: '${v}'`)
            .join(', ')} }}`
        : undefined,
    };
  }

  /**
   * Generate component props
   *
   * @param component - Component instance
   * @returns Array of prop strings
   */
  private generateProps(component: ComponentInstance): string[] {
    const props: string[] = [];
    const { properties } = component;

    // Filter out special properties
    const specialProps = ['id', 'className', 'style', 'children'];

    Object.entries(properties).forEach(([key, value]) => {
      if (specialProps.includes(key)) return;

      // Skip event handlers (handled separately)
      if (key.startsWith('on')) return;

      // Handle different value types
      if (typeof value === 'string') {
        props.push(`${key}="${value}"`);
      } else if (typeof value === 'boolean') {
        if (value) {
          props.push(key); // Boolean true
        }
      } else if (typeof value === 'number') {
        props.push(`${key}={${value}}`);
      } else if (value !== null && value !== undefined) {
        // Object or array
        props.push(`${key}={${JSON.stringify(value)}}`);
      }
    });

    return props;
  }

  /**
   * Generate event handlers
   *
   * @param component - Component instance
   * @returns Array of event handler strings
   */
  private generateEventHandlers(component: ComponentInstance): string[] {
    const handlers: string[] = [];
    const { properties } = component;

    Object.entries(properties).forEach(([key, value]) => {
      if (key.startsWith('on') && typeof value === 'function') {
        handlers.push(`${key}={${value.toString()}}`);
      } else if (key.startsWith('on') && typeof value === 'string') {
        // Inline handler
        handlers.push(`${key}={() => { ${value} }}`);
      }
    });

    return handlers;
  }

  /**
   * Check if component has text content
   *
   * @param component - Component instance
   * @returns True if component has text content
   */
  private hasTextContent(component: ComponentInstance): boolean {
    return !!(
      component.properties.text ||
      component.properties.label ||
      component.properties.children
    );
  }

  /**
   * Get text content
   *
   * @param component - Component instance
   * @returns Text content string
   */
  private getTextContent(component: ComponentInstance): string {
    return (
      component.properties.text ||
      component.properties.label ||
      component.properties.children ||
      ''
    );
  }

  /**
   * Get the ImportManager
   *
   * @returns ImportManager instance
   */
  getImportManager(): ImportManager {
    return this.importManager;
  }

  /**
   * Generate complete component code with imports
   *
   * @param rootComponentIds - Root component IDs
   * @param componentName - Component name
   * @param options - Generation options
   * @returns Complete component code
   */
  generateCompleteComponent(
    rootComponentIds: string[],
    componentName: string,
    options: ComponentGenerationOptions = {}
  ): string {
    const jsx = this.generateComponentTree(rootComponentIds, {
      ...options,
      indentLevel: 1,
    });

    const imports = this.importManager.generateImportStatements();
    const importsSection = imports.length > 0 ? imports.join('\n') + '\n\n' : '';

    return `${importsSection}export default function ${componentName}() {
  return (
${jsx}
  );
}`;
  }

  /**
   * Analyze component tree for required imports
   *
   * @param rootComponentIds - Root component IDs
   */
  analyzeImports(rootComponentIds: string[]): void {
    const processComponent = (component: ComponentInstance) => {
      // Add imports based on component type
      if (component.type === 'Link') {
        this.importManager.addNextImports({ Link: true });
      } else if (component.type === 'Image') {
        this.importManager.addNextImports({ Image: true });
      }

      // Check for hooks in properties
      const propsString = JSON.stringify(component.properties);
      if (propsString.includes('useState')) {
        this.importManager.addReactHooks(['useState']);
      }
      if (propsString.includes('useEffect')) {
        this.importManager.addReactHooks(['useEffect']);
      }

      // Process children
      component.childIds.forEach((childId) => {
        const child = this.componentMap.get(childId);
        if (child) processComponent(child);
      });
    };

    rootComponentIds.forEach((id) => {
      const component = this.componentMap.get(id);
      if (component) processComponent(component);
    });
  }
}

/**
 * Generate JSX from components
 *
 * @param components - Array of component instances
 * @param rootIds - Root component IDs
 * @param options - Generation options
 * @returns JSX code string
 */
export function generateJSX(
  components: ComponentInstance[],
  rootIds: string[],
  options?: ComponentGenerationOptions
): string {
  const generator = new ComponentGenerator(components);
  return generator.generateComponentTree(rootIds, options);
}
