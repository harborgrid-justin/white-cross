/**
 * Page Generator
 *
 * Generates complete Next.js page files from component instances.
 * Handles metadata, server/client components, and app router structure.
 */

import type { ComponentInstance, NextJSPageConfig, CodeGenerationOptions } from '@/types';
import { ComponentGenerator } from './ComponentGenerator';
import { ImportManager } from './ImportManager';
import { detectRenderMode, analyzeComponentTree } from '../utils/component-detector';
import {
  generatePageTemplate,
  generatePageWithMetadata,
  generateDynamicPageTemplate,
  generatePageWithDataFetching,
  generateLoadingTemplate,
  generateErrorTemplate,
  generateNotFoundTemplate,
} from '../templates/page-template';
import { formatTSX } from '../utils/prettier-format';

/**
 * Page generation result
 */
export interface PageGenerationResult {
  page: {
    path: string;
    code: string;
  };
  additionalFiles?: Array<{
    path: string;
    code: string;
  }>;
}

/**
 * Page Generator class
 *
 * Generates Next.js page files from component instances.
 */
export class PageGenerator {
  private config: NextJSPageConfig;
  private options: CodeGenerationOptions;
  private importManager: ImportManager;
  private componentGenerator: ComponentGenerator;

  constructor(
    config: NextJSPageConfig,
    options: CodeGenerationOptions = {
      useTypeScript: true,
      useServerComponents: true,
      useTailwind: true,
      prettier: true,
      eslint: false,
    }
  ) {
    this.config = config;
    this.options = options;
    this.importManager = new ImportManager();
    this.componentGenerator = new ComponentGenerator(
      config.components,
      this.importManager
    );
  }

  /**
   * Generate page file
   *
   * @returns Page generation result
   */
  async generatePage(): Promise<PageGenerationResult> {
    // Analyze components for server/client requirements
    const renderModes = analyzeComponentTree(this.config.components);
    const hasClientComponents = Array.from(renderModes.values()).some(
      (mode) => mode === 'client'
    );

    // Generate JSX content
    const rootComponentIds = this.config.components
      .filter((c) => c.parentId === null)
      .map((c) => c.id);

    // Analyze and add required imports
    this.componentGenerator.analyzeImports(rootComponentIds);

    const jsxContent = this.componentGenerator.generateComponentTree(
      rootComponentIds,
      {
        indentLevel: 2,
        useTailwind: this.options.useTailwind,
        includeComments: false,
      }
    );

    // Generate imports
    const imports = this.importManager.generateImportStatements();

    // Generate page code
    let pageCode: string;

    if (this.config.dataFetching) {
      // Page with data fetching
      pageCode = generatePageWithDataFetching(
        this.config,
        jsxContent,
        imports,
        '// Fetch your data here'
      );
    } else if (this.config.metadata) {
      // Page with metadata
      pageCode = generatePageWithMetadata(this.config, jsxContent, imports);
    } else {
      // Basic page
      pageCode = generatePageTemplate(
        this.config,
        jsxContent,
        imports,
        hasClientComponents
      );
    }

    // Format code if prettier is enabled
    if (this.options.prettier) {
      pageCode = await formatTSX(pageCode);
    }

    // Generate additional files (loading, error, etc.)
    const additionalFiles = await this.generateAdditionalFiles();

    return {
      page: {
        path: this.getPagePath(),
        code: pageCode,
      },
      additionalFiles,
    };
  }

  /**
   * Generate additional page files (loading, error, not-found)
   *
   * @returns Array of additional files
   */
  private async generateAdditionalFiles(): Promise<
    Array<{ path: string; code: string }>
  > {
    const files: Array<{ path: string; code: string }> = [];

    // Generate loading.tsx
    let loadingCode = generateLoadingTemplate();
    if (this.options.prettier) {
      loadingCode = await formatTSX(loadingCode);
    }

    files.push({
      path: this.getPageDirectory() + '/loading.tsx',
      code: loadingCode,
    });

    // Generate error.tsx
    let errorCode = generateErrorTemplate();
    if (this.options.prettier) {
      errorCode = await formatTSX(errorCode);
    }

    files.push({
      path: this.getPageDirectory() + '/error.tsx',
      code: errorCode,
    });

    return files;
  }

  /**
   * Get page file path
   *
   * @returns Page file path
   */
  private getPagePath(): string {
    const basePath = this.getPageDirectory();
    const extension = this.options.useTypeScript ? 'tsx' : 'jsx';
    return `${basePath}/page.${extension}`;
  }

  /**
   * Get page directory path
   *
   * @returns Directory path
   */
  private getPageDirectory(): string {
    // Convert /about to app/about
    // Convert /blog/[slug] to app/blog/[slug]
    const cleanPath = this.config.path.startsWith('/')
      ? this.config.path.slice(1)
      : this.config.path;

    return cleanPath ? `app/${cleanPath}` : 'app';
  }

  /**
   * Generate a dynamic page with params
   *
   * @param paramTypes - Dynamic parameter types
   * @returns Page code
   */
  async generateDynamicPage(
    paramTypes: Record<string, string>
  ): Promise<string> {
    const rootComponentIds = this.config.components
      .filter((c) => c.parentId === null)
      .map((c) => c.id);

    this.componentGenerator.analyzeImports(rootComponentIds);

    const jsxContent = this.componentGenerator.generateComponentTree(
      rootComponentIds,
      {
        indentLevel: 2,
        useTailwind: this.options.useTailwind,
      }
    );

    const imports = this.importManager.generateImportStatements();

    let pageCode = generateDynamicPageTemplate(
      this.config,
      jsxContent,
      imports,
      paramTypes
    );

    if (this.options.prettier) {
      pageCode = await formatTSX(pageCode);
    }

    return pageCode;
  }

  /**
   * Generate page with server actions
   *
   * @param actions - Server actions to include
   * @returns Page generation result with actions
   */
  async generatePageWithActions(
    actions: Array<{ name: string; code: string }>
  ): Promise<PageGenerationResult> {
    const pageResult = await this.generatePage();

    // Generate actions file
    const actionsCode = `'use server';

${actions.map((action) => action.code).join('\n\n')}`;

    const formattedActionsCode = this.options.prettier
      ? await formatTSX(actionsCode)
      : actionsCode;

    const additionalFiles = pageResult.additionalFiles || [];
    additionalFiles.push({
      path: this.getPageDirectory() + '/actions.ts',
      code: formattedActionsCode,
    });

    return {
      ...pageResult,
      additionalFiles,
    };
  }

  /**
   * Generate complete app router structure
   *
   * @returns All generated files
   */
  async generateAppRouterStructure(): Promise<
    Array<{ path: string; code: string }>
  > {
    const files: Array<{ path: string; code: string }> = [];

    // Generate main page
    const pageResult = await this.generatePage();
    files.push(pageResult.page);

    // Add additional files
    if (pageResult.additionalFiles) {
      files.push(...pageResult.additionalFiles);
    }

    return files;
  }

  /**
   * Split client and server components
   *
   * @returns Separated component files
   */
  async splitClientServerComponents(): Promise<
    Array<{ path: string; code: string; isClient: boolean }>
  > {
    const files: Array<{ path: string; code: string; isClient: boolean }> = [];
    const renderModes = analyzeComponentTree(this.config.components);

    // Group components by render mode
    const clientComponentIds: string[] = [];
    const serverComponentIds: string[] = [];

    this.config.components.forEach((component) => {
      const mode = renderModes.get(component.id);
      if (mode === 'client') {
        clientComponentIds.push(component.id);
      } else {
        serverComponentIds.push(component.id);
      }
    });

    // Generate client components file
    if (clientComponentIds.length > 0) {
      const clientImportManager = new ImportManager();
      const clientGenerator = new ComponentGenerator(
        this.config.components.filter((c) =>
          clientComponentIds.includes(c.id)
        ),
        clientImportManager
      );

      clientGenerator.analyzeImports(clientComponentIds);

      const clientJSX = clientGenerator.generateComponentTree(
        clientComponentIds,
        {
          indentLevel: 1,
          useTailwind: this.options.useTailwind,
        }
      );

      const clientImports = clientImportManager.generateImportStatements();

      let clientCode = `'use client';

${clientImports.join('\n')}

export default function ClientComponents() {
  return (
${clientJSX}
  );
}`;

      if (this.options.prettier) {
        clientCode = await formatTSX(clientCode);
      }

      files.push({
        path: this.getPageDirectory() + '/client-components.tsx',
        code: clientCode,
        isClient: true,
      });
    }

    return files;
  }

  /**
   * Get component statistics
   *
   * @returns Component statistics
   */
  getComponentStats(): {
    total: number;
    client: number;
    server: number;
    components: ComponentInstance[];
  } {
    const renderModes = analyzeComponentTree(this.config.components);
    let clientCount = 0;
    let serverCount = 0;

    renderModes.forEach((mode) => {
      if (mode === 'client') {
        clientCount++;
      } else {
        serverCount++;
      }
    });

    return {
      total: this.config.components.length,
      client: clientCount,
      server: serverCount,
      components: this.config.components,
    };
  }

  /**
   * Validate page configuration
   *
   * @returns Validation result
   */
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.config.path) {
      errors.push('Page path is required');
    }

    if (!this.config.title) {
      errors.push('Page title is required');
    }

    if (!this.config.components || this.config.components.length === 0) {
      errors.push('At least one component is required');
    }

    // Validate component tree
    const componentIds = new Set(this.config.components.map((c) => c.id));
    this.config.components.forEach((component) => {
      component.childIds.forEach((childId) => {
        if (!componentIds.has(childId)) {
          errors.push(`Component ${component.id} references missing child ${childId}`);
        }
      });
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

/**
 * Generate a Next.js page from configuration
 *
 * @param config - Page configuration
 * @param options - Code generation options
 * @returns Page generation result
 */
export async function generateNextJSPage(
  config: NextJSPageConfig,
  options?: CodeGenerationOptions
): Promise<PageGenerationResult> {
  const generator = new PageGenerator(config, options);
  return generator.generatePage();
}
