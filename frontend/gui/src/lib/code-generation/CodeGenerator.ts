/**
 * Code Generator
 *
 * Main code generation engine that converts visual page builder state
 * into production-ready Next.js code.
 *
 * Features:
 * - Convert component tree to JSX
 * - Generate Next.js 16 app router pages
 * - Auto-detect server vs client components
 * - Smart import management
 * - Tailwind class generation
 * - Prettier formatting
 * - Full TypeScript support
 */

import type {
  ComponentInstance,
  NextJSPageConfig,
  CodeGenerationOptions,
  GeneratedCode,
} from '@/types';

import { PageGenerator, type PageGenerationResult } from './generators/PageGenerator';
import { ComponentGenerator } from './generators/ComponentGenerator';
import { ImportManager } from './generators/ImportManager';
import { StyleGenerator, stylesToTailwind } from './generators/StyleGenerator';
import {
  detectRenderMode,
  analyzeComponentTree,
  hasClientComponents,
  suggestOptimizations,
} from './utils/component-detector';
import { formatTSX, formatTypeScript } from './utils/prettier-format';
import {
  generateComponentTemplate,
  generateComponentWithDestructuredProps,
  generateComponentWithState,
} from './templates/component-template';
import {
  generateServerAction,
  generateFormDataServerAction,
  generateValidatedServerAction,
} from './templates/server-action-template';
import {
  generateStaticMetadata,
  generateDynamicMetadata,
  generateCompleteMetadata,
} from './templates/metadata-template';

/**
 * Code generation context
 */
export interface CodeGenerationContext {
  components: ComponentInstance[];
  options: CodeGenerationOptions;
  targetPath?: string;
}

/**
 * Generation result with metadata
 */
export interface CodeGenerationResult {
  files: GeneratedCode[];
  stats: {
    totalComponents: number;
    clientComponents: number;
    serverComponents: number;
    totalFiles: number;
  };
  suggestions?: string[];
}

/**
 * Main Code Generator class
 *
 * Orchestrates all code generation operations.
 */
export class CodeGenerator {
  private context: CodeGenerationContext;

  constructor(context: CodeGenerationContext) {
    this.context = {
      ...context,
      options: {
        useTypeScript: true,
        useServerComponents: true,
        useTailwind: true,
        prettier: true,
        eslint: false,
        ...context.options,
      },
    };
  }

  /**
   * Generate a complete Next.js page
   *
   * @param config - Page configuration
   * @returns Generation result
   */
  async generatePage(config: NextJSPageConfig): Promise<CodeGenerationResult> {
    const generator = new PageGenerator(config, this.context.options);

    // Validate configuration
    const validation = generator.validate();
    if (!validation.valid) {
      throw new Error(`Page validation failed: ${validation.errors.join(', ')}`);
    }

    // Generate page files
    const pageResult = await generator.generatePage();

    // Convert to GeneratedCode format
    const files: GeneratedCode[] = [
      {
        type: 'page',
        path: pageResult.page.path,
        content: pageResult.page.code,
        language: this.context.options.useTypeScript ? 'tsx' : 'jsx',
      },
    ];

    // Add additional files
    if (pageResult.additionalFiles) {
      pageResult.additionalFiles.forEach((file) => {
        files.push({
          type: 'page',
          path: file.path,
          content: file.code,
          language: this.context.options.useTypeScript ? 'tsx' : 'jsx',
        });
      });
    }

    // Get statistics
    const stats = generator.getComponentStats();

    // Get optimization suggestions
    const suggestions = suggestOptimizations(config.components).map(
      (s) => `${s.componentId}: ${s.suggestion}`
    );

    return {
      files,
      stats: {
        totalComponents: stats.total,
        clientComponents: stats.client,
        serverComponents: stats.server,
        totalFiles: files.length,
      },
      suggestions,
    };
  }

  /**
   * Generate a standalone React component
   *
   * @param components - Component instances
   * @param componentName - Name of the component
   * @param rootIds - Root component IDs
   * @returns Generated component code
   */
  async generateComponent(
    components: ComponentInstance[],
    componentName: string,
    rootIds: string[]
  ): Promise<GeneratedCode> {
    const importManager = new ImportManager();
    const generator = new ComponentGenerator(components, importManager);

    // Check if client component is needed
    const componentMap = new Map(components.map((c) => [c.id, c]));
    const needsClient = rootIds.some((id) => {
      const component = componentMap.get(id);
      return component
        ? detectRenderMode(component, componentMap) === 'client'
        : false;
    });

    // Analyze imports
    generator.analyzeImports(rootIds);

    // Generate JSX
    const jsx = generator.generateComponentTree(rootIds, {
      indentLevel: 1,
      useTailwind: this.context.options.useTailwind,
    });

    // Generate imports
    const imports = importManager.generateImportStatements();

    // Generate component code
    let code = generateComponentTemplate(
      {
        name: componentName,
        imports,
        useClient: needsClient,
        description: `Generated component: ${componentName}`,
      },
      jsx
    );

    // Format code
    if (this.context.options.prettier) {
      code = await formatTSX(code);
    }

    return {
      type: 'component',
      path: `components/${componentName}.tsx`,
      content: code,
      language: this.context.options.useTypeScript ? 'tsx' : 'jsx',
    };
  }

  /**
   * Generate server action
   *
   * @param actionName - Action name
   * @param params - Action parameters
   * @param body - Action body code
   * @param options - Action options
   * @returns Generated action code
   */
  async generateServerAction(
    actionName: string,
    params: Record<string, string>,
    body: string,
    options?: {
      returnType?: string;
      description?: string;
      validation?: boolean;
    }
  ): Promise<GeneratedCode> {
    let code = generateServerAction(
      {
        name: actionName,
        params,
        returnType: options?.returnType,
        description: options?.description,
        validation: options?.validation,
      },
      body
    );

    if (this.context.options.prettier) {
      code = await formatTypeScript(code);
    }

    return {
      type: 'action',
      path: `actions/${actionName}.ts`,
      content: code,
      language: 'typescript',
    };
  }

  /**
   * Generate form action with validation
   *
   * @param actionName - Action name
   * @param schemaName - Zod schema name
   * @param body - Action body code
   * @returns Generated action code
   */
  async generateFormAction(
    actionName: string,
    schemaName: string,
    body: string
  ): Promise<GeneratedCode> {
    let code = generateValidatedServerAction(
      {
        name: actionName,
        params: {},
      },
      schemaName,
      body
    );

    if (this.context.options.prettier) {
      code = await formatTypeScript(code);
    }

    return {
      type: 'action',
      path: `actions/${actionName}.ts`,
      content: code,
      language: 'typescript',
    };
  }

  /**
   * Generate metadata export
   *
   * @param config - Metadata configuration
   * @param isDynamic - Whether metadata is dynamic
   * @returns Generated metadata code
   */
  async generateMetadata(
    config: {
      title: string;
      description: string;
      keywords?: string[];
      openGraph?: any;
      twitter?: any;
    },
    isDynamic = false
  ): Promise<GeneratedCode> {
    let code: string;

    if (isDynamic) {
      code = generateDynamicMetadata(config);
    } else {
      code = generateStaticMetadata(config);
    }

    if (this.context.options.prettier) {
      code = await formatTypeScript(code);
    }

    return {
      type: 'type',
      path: 'lib/metadata.ts',
      content: code,
      language: 'typescript',
    };
  }

  /**
   * Generate multiple pages from configurations
   *
   * @param configs - Array of page configurations
   * @returns Combined generation result
   */
  async generatePages(
    configs: NextJSPageConfig[]
  ): Promise<CodeGenerationResult> {
    const allFiles: GeneratedCode[] = [];
    let totalComponents = 0;
    let clientComponents = 0;
    let serverComponents = 0;
    const allSuggestions: string[] = [];

    for (const config of configs) {
      const result = await this.generatePage(config);
      allFiles.push(...result.files);
      totalComponents += result.stats.totalComponents;
      clientComponents += result.stats.clientComponents;
      serverComponents += result.stats.serverComponents;

      if (result.suggestions) {
        allSuggestions.push(...result.suggestions);
      }
    }

    return {
      files: allFiles,
      stats: {
        totalComponents,
        clientComponents,
        serverComponents,
        totalFiles: allFiles.length,
      },
      suggestions: allSuggestions,
    };
  }

  /**
   * Generate TypeScript types for components
   *
   * @param components - Component instances
   * @returns Generated types code
   */
  async generateComponentTypes(
    components: ComponentInstance[]
  ): Promise<GeneratedCode> {
    const types: string[] = [];

    // Generate interface for each unique component type
    const componentTypes = new Set(components.map((c) => c.type));

    componentTypes.forEach((type) => {
      const component = components.find((c) => c.type === type);
      if (!component) return;

      const propTypes = Object.entries(component.properties)
        .map(([key, value]) => {
          const valueType = typeof value;
          return `  ${key}?: ${valueType === 'object' ? 'any' : valueType};`;
        })
        .join('\n');

      types.push(`export interface ${type}Props {
${propTypes}
  children?: React.ReactNode;
}`);
    });

    let code = types.join('\n\n');

    if (this.context.options.prettier) {
      code = await formatTypeScript(code);
    }

    return {
      type: 'type',
      path: 'types/components.ts',
      content: code,
      language: 'typescript',
    };
  }

  /**
   * Analyze component tree
   *
   * @param components - Component instances
   * @returns Analysis result
   */
  analyzeComponents(components: ComponentInstance[]): {
    renderModes: Map<string, 'server' | 'client'>;
    hasClientComponents: boolean;
    suggestions: Array<{ componentId: string; suggestion: string }>;
  } {
    const renderModes = analyzeComponentTree(components);
    const hasClient = hasClientComponents(components);
    const suggestions = suggestOptimizations(components);

    return {
      renderModes,
      hasClientComponents: hasClient,
      suggestions,
    };
  }

  /**
   * Convert CSS styles to Tailwind classes
   *
   * @param styles - CSS properties
   * @returns Tailwind class string
   */
  convertStylesToTailwind(styles: Record<string, any>): string {
    return stylesToTailwind(styles);
  }

  /**
   * Generate complete project structure
   *
   * @param pages - Page configurations
   * @returns All generated files
   */
  async generateProject(
    pages: NextJSPageConfig[]
  ): Promise<CodeGenerationResult> {
    const result = await this.generatePages(pages);

    // Generate root layout if needed
    const rootLayout = await this.generateRootLayout();
    result.files.push(rootLayout);

    // Generate global types
    const allComponents = pages.flatMap((p) => p.components);
    if (allComponents.length > 0) {
      const types = await this.generateComponentTypes(allComponents);
      result.files.push(types);
    }

    result.stats.totalFiles = result.files.length;

    return result;
  }

  /**
   * Generate root layout file
   *
   * @returns Root layout code
   */
  private async generateRootLayout(): Promise<GeneratedCode> {
    let code = `import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'My App',
  description: 'Generated with Next.js Page Builder',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`;

    if (this.context.options.prettier) {
      code = await formatTSX(code);
    }

    return {
      type: 'page',
      path: 'app/layout.tsx',
      content: code,
      language: 'tsx',
    };
  }

  /**
   * Export project as files
   *
   * @param result - Generation result
   * @returns Map of file paths to content
   */
  exportAsFiles(result: CodeGenerationResult): Map<string, string> {
    const fileMap = new Map<string, string>();

    result.files.forEach((file) => {
      fileMap.set(file.path, file.content);
    });

    return fileMap;
  }

  /**
   * Get generation statistics
   *
   * @param components - Component instances
   * @returns Statistics object
   */
  getStatistics(components: ComponentInstance[]): {
    total: number;
    byType: Record<string, number>;
    byRenderMode: Record<string, number>;
    depth: number;
  } {
    const renderModes = analyzeComponentTree(components);

    const byType: Record<string, number> = {};
    const byRenderMode: Record<string, number> = { server: 0, client: 0 };

    components.forEach((component) => {
      // Count by type
      byType[component.type] = (byType[component.type] || 0) + 1;

      // Count by render mode
      const mode = renderModes.get(component.id);
      if (mode) {
        byRenderMode[mode]++;
      }
    });

    // Calculate tree depth
    const depth = this.calculateTreeDepth(components);

    return {
      total: components.length,
      byType,
      byRenderMode,
      depth,
    };
  }

  /**
   * Calculate component tree depth
   *
   * @param components - Component instances
   * @returns Maximum depth
   */
  private calculateTreeDepth(components: ComponentInstance[]): number {
    const componentMap = new Map(components.map((c) => [c.id, c]));

    const getDepth = (componentId: string, currentDepth = 0): number => {
      const component = componentMap.get(componentId);
      if (!component || component.childIds.length === 0) {
        return currentDepth;
      }

      return Math.max(
        ...component.childIds.map((childId) =>
          getDepth(childId, currentDepth + 1)
        )
      );
    };

    const rootComponents = components.filter((c) => c.parentId === null);
    return Math.max(...rootComponents.map((c) => getDepth(c.id)));
  }
}

/**
 * Create a code generator instance
 *
 * @param components - Component instances
 * @param options - Code generation options
 * @returns CodeGenerator instance
 */
export function createCodeGenerator(
  components: ComponentInstance[],
  options?: Partial<CodeGenerationOptions>
): CodeGenerator {
  return new CodeGenerator({
    components,
    options: options || {},
  });
}

/**
 * Quick generate: Convert components to JSX string
 *
 * @param components - Component instances
 * @param rootIds - Root component IDs
 * @returns JSX string
 */
export async function quickGenerateJSX(
  components: ComponentInstance[],
  rootIds: string[]
): Promise<string> {
  const generator = new ComponentGenerator(components);
  return generator.generateComponentTree(rootIds, {
    indentLevel: 0,
    useTailwind: true,
  });
}

/**
 * Quick generate: Convert components to Next.js page
 *
 * @param config - Page configuration
 * @returns Page code
 */
export async function quickGeneratePage(
  config: NextJSPageConfig
): Promise<string> {
  const codeGenerator = new CodeGenerator({
    components: config.components,
    options: {},
  });

  const result = await codeGenerator.generatePage(config);
  return result.files[0].content;
}
