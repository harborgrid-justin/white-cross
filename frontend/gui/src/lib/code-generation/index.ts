/**
 * Next.js Code Generation Engine
 *
 * Comprehensive code generation system for converting visual page builder
 * state into production-ready Next.js code.
 *
 * @example
 * ```typescript
 * import { CodeGenerator, createCodeGenerator } from '@/lib/code-generation';
 *
 * const generator = createCodeGenerator(components, {
 *   useTypeScript: true,
 *   useTailwind: true,
 *   prettier: true,
 * });
 *
 * const result = await generator.generatePage(pageConfig);
 * ```
 */

// Main CodeGenerator class
export {
  CodeGenerator,
  createCodeGenerator,
  quickGenerateJSX,
  quickGeneratePage,
  type CodeGenerationContext,
  type CodeGenerationResult,
} from './CodeGenerator';

// Generators
export {
  ImportManager,
  type ImportType,
  type ImportStatement,
} from './generators/ImportManager';

export {
  StyleGenerator,
  stylesToTailwind,
  stylesToReactProps,
} from './generators/StyleGenerator';

export {
  ComponentGenerator,
  generateJSX,
  type ComponentGenerationOptions,
} from './generators/ComponentGenerator';

export {
  PageGenerator,
  generateNextJSPage,
  type PageGenerationResult,
} from './generators/PageGenerator';

// Templates - Page
export {
  generatePageTemplate,
  generatePageWithMetadata,
  generateDynamicPageTemplate,
  generatePageWithDataFetching,
  generateLoadingTemplate,
  generateErrorTemplate,
  generateNotFoundTemplate,
  generateLayoutTemplate,
} from './templates/page-template';

// Templates - Component
export {
  generateComponentTemplate,
  generateComponentWithDestructuredProps,
  generateForwardRefComponent,
  generateComponentWithState,
  generateMemoizedComponent,
  generateBarrelExport,
  type ComponentTemplateProps,
} from './templates/component-template';

// Templates - Server Actions
export {
  generateServerAction,
  generateFormDataServerAction,
  generateValidatedServerAction,
  generateDatabaseServerAction,
  generateFileUploadServerAction,
  generateServerActionsFile,
  generateRevalidationCode,
  wrapWithErrorHandling,
  type ServerActionTemplateProps,
} from './templates/server-action-template';

// Templates - Metadata
export {
  generateStaticMetadata,
  generateDynamicMetadata,
  generateMetadataFromPageConfig,
  generateOpenGraphMetadata,
  generateTwitterMetadata,
  generateRobotsMetadata,
  generateViewportConfig,
  generateCompleteMetadata,
  generateMetadataWithTemplate,
  generateSitemapMetadata,
  generateIconMetadata,
  generateManifestMetadata,
  type MetadataConfig,
} from './templates/metadata-template';

// Utilities - AST Helpers
export {
  createProject,
  createSourceFile,
  addImports,
  addNamedImport,
  addDefaultImport,
  addUseClientDirective,
  addUseServerDirective,
  addFunctionalComponent,
  addInterface,
  addTypeAlias,
  addConstVariable,
  addMetadataExport,
  addServerAction,
  getFormattedText,
  removeDuplicateImports,
  organizeImports,
  addJSDoc,
} from './utils/ast-helpers';

// Utilities - Prettier Format
export {
  formatCode,
  formatTypeScript,
  formatTSX,
  formatJSON,
  formatCSS,
  formatMultiple,
  isFormatted,
} from './utils/prettier-format';

// Utilities - Component Detector
export {
  requiresClientComponent,
  detectRenderMode,
  analyzeComponentTree,
  getClientComponents,
  getServerComponents,
  hasClientComponents,
  suggestOptimizations,
} from './utils/component-detector';
