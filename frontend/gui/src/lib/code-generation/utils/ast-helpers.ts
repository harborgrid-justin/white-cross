/**
 * AST Manipulation Helpers
 *
 * Provides utilities for manipulating Abstract Syntax Trees using ts-morph.
 * Used for programmatic code generation and transformation.
 */

import {
  Project,
  SourceFile,
  SyntaxKind,
  VariableDeclarationKind,
  type ImportDeclarationStructure,
  type OptionalKind,
  type VariableStatementStructure,
  type FunctionDeclarationStructure,
} from 'ts-morph';

/**
 * Create a new ts-morph project
 *
 * @returns Initialized ts-morph Project
 */
export function createProject(): Project {
  return new Project({
    compilerOptions: {
      target: 99, // ESNext
      module: 99, // ESNext
      jsx: 4, // React-JSX
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      moduleResolution: 2, // Node
    },
  });
}

/**
 * Create a new source file
 *
 * @param project - ts-morph Project
 * @param filePath - Path for the source file
 * @param content - Initial file content (optional)
 * @returns Created SourceFile
 */
export function createSourceFile(
  project: Project,
  filePath: string,
  content?: string
): SourceFile {
  return project.createSourceFile(filePath, content || '', {
    overwrite: true,
  });
}

/**
 * Add import declarations to a source file
 *
 * @param sourceFile - Target source file
 * @param imports - Array of import structures
 */
export function addImports(
  sourceFile: SourceFile,
  imports: OptionalKind<ImportDeclarationStructure>[]
): void {
  imports.forEach((importStruct) => {
    sourceFile.addImportDeclaration(importStruct);
  });
}

/**
 * Add a named import to a source file
 *
 * @param sourceFile - Target source file
 * @param moduleSpecifier - Module to import from
 * @param namedImports - Array of named imports
 */
export function addNamedImport(
  sourceFile: SourceFile,
  moduleSpecifier: string,
  namedImports: string[]
): void {
  sourceFile.addImportDeclaration({
    moduleSpecifier,
    namedImports,
  });
}

/**
 * Add a default import to a source file
 *
 * @param sourceFile - Target source file
 * @param moduleSpecifier - Module to import from
 * @param defaultImport - Default import name
 */
export function addDefaultImport(
  sourceFile: SourceFile,
  moduleSpecifier: string,
  defaultImport: string
): void {
  sourceFile.addImportDeclaration({
    moduleSpecifier,
    defaultImport,
  });
}

/**
 * Add 'use client' directive to a source file
 *
 * @param sourceFile - Target source file
 */
export function addUseClientDirective(sourceFile: SourceFile): void {
  // Add as the first statement
  sourceFile.insertStatements(0, "'use client';");
}

/**
 * Add 'use server' directive to a source file
 *
 * @param sourceFile - Target source file
 */
export function addUseServerDirective(sourceFile: SourceFile): void {
  // Add as the first statement
  sourceFile.insertStatements(0, "'use server';");
}

/**
 * Add a React functional component
 *
 * @param sourceFile - Target source file
 * @param componentName - Name of the component
 * @param props - Component props interface (optional)
 * @param body - Component JSX body
 * @param isExported - Whether to export the component
 */
export function addFunctionalComponent(
  sourceFile: SourceFile,
  componentName: string,
  props: string | null,
  body: string,
  isExported = true
): void {
  const propsDeclaration = props ? `props: ${props}` : '';

  const componentCode = `
${isExported ? 'export default ' : ''}function ${componentName}(${propsDeclaration}) {
  return (
    ${body}
  );
}`;

  sourceFile.addStatements(componentCode);
}

/**
 * Add a TypeScript interface
 *
 * @param sourceFile - Target source file
 * @param interfaceName - Name of the interface
 * @param properties - Interface properties
 * @param isExported - Whether to export the interface
 */
export function addInterface(
  sourceFile: SourceFile,
  interfaceName: string,
  properties: Record<string, string>,
  isExported = false
): void {
  const exportKeyword = isExported ? 'export ' : '';
  const props = Object.entries(properties)
    .map(([key, type]) => `  ${key}: ${type};`)
    .join('\n');

  const interfaceCode = `
${exportKeyword}interface ${interfaceName} {
${props}
}`;

  sourceFile.addStatements(interfaceCode);
}

/**
 * Add a TypeScript type alias
 *
 * @param sourceFile - Target source file
 * @param typeName - Name of the type
 * @param typeDefinition - Type definition
 * @param isExported - Whether to export the type
 */
export function addTypeAlias(
  sourceFile: SourceFile,
  typeName: string,
  typeDefinition: string,
  isExported = false
): void {
  const exportKeyword = isExported ? 'export ' : '';
  sourceFile.addStatements(
    `${exportKeyword}type ${typeName} = ${typeDefinition};`
  );
}

/**
 * Add a const variable
 *
 * @param sourceFile - Target source file
 * @param variableName - Name of the variable
 * @param initializer - Variable value
 * @param isExported - Whether to export the variable
 */
export function addConstVariable(
  sourceFile: SourceFile,
  variableName: string,
  initializer: string,
  isExported = false
): void {
  const exportKeyword = isExported ? 'export ' : '';
  sourceFile.addStatements(
    `${exportKeyword}const ${variableName} = ${initializer};`
  );
}

/**
 * Add metadata export for Next.js
 *
 * @param sourceFile - Target source file
 * @param metadata - Metadata object
 */
export function addMetadataExport(
  sourceFile: SourceFile,
  metadata: Record<string, any>
): void {
  const metadataJson = JSON.stringify(metadata, null, 2);
  sourceFile.addStatements(`export const metadata = ${metadataJson};`);
}

/**
 * Add a server action function
 *
 * @param sourceFile - Target source file
 * @param actionName - Name of the action
 * @param params - Function parameters
 * @param body - Function body
 */
export function addServerAction(
  sourceFile: SourceFile,
  actionName: string,
  params: string,
  body: string
): void {
  const actionCode = `
export async function ${actionName}(${params}) {
  'use server';
  ${body}
}`;

  sourceFile.addStatements(actionCode);
}

/**
 * Format and get source file text
 *
 * @param sourceFile - Source file to format
 * @returns Formatted source code
 */
export function getFormattedText(sourceFile: SourceFile): string {
  sourceFile.formatText({
    indentSize: 2,
    convertTabsToSpaces: true,
  });

  return sourceFile.getFullText();
}

/**
 * Remove duplicate imports from a source file
 *
 * @param sourceFile - Source file to clean
 */
export function removeDuplicateImports(sourceFile: SourceFile): void {
  const imports = sourceFile.getImportDeclarations();
  const seen = new Map<string, Set<string>>();

  imports.forEach((importDecl) => {
    const moduleSpecifier = importDecl.getModuleSpecifierValue();
    const namedImports = importDecl.getNamedImports().map((ni) => ni.getName());

    if (!seen.has(moduleSpecifier)) {
      seen.set(moduleSpecifier, new Set(namedImports));
    } else {
      // Check if this is a duplicate
      const existingImports = seen.get(moduleSpecifier)!;
      const isDuplicate = namedImports.every((imp) =>
        existingImports.has(imp)
      );

      if (isDuplicate) {
        importDecl.remove();
      } else {
        namedImports.forEach((imp) => existingImports.add(imp));
      }
    }
  });
}

/**
 * Organize imports in a source file
 *
 * @param sourceFile - Source file to organize
 */
export function organizeImports(sourceFile: SourceFile): void {
  const imports = sourceFile.getImportDeclarations();

  // Group imports by type
  const externalImports: typeof imports = [];
  const internalImports: typeof imports = [];
  const relativeImports: typeof imports = [];

  imports.forEach((importDecl) => {
    const moduleSpecifier = importDecl.getModuleSpecifierValue();

    if (moduleSpecifier.startsWith('.')) {
      relativeImports.push(importDecl);
    } else if (moduleSpecifier.startsWith('@/')) {
      internalImports.push(importDecl);
    } else {
      externalImports.push(importDecl);
    }
  });

  // Remove all imports
  imports.forEach((imp) => imp.remove());

  // Re-add in order: external, internal, relative
  [...externalImports, ...internalImports, ...relativeImports].forEach(
    (imp, index) => {
      sourceFile.insertImportDeclaration(index, imp.getStructure());
    }
  );
}

/**
 * Add JSDoc comment to a function or component
 *
 * @param sourceFile - Source file
 * @param functionName - Name of the function
 * @param description - JSDoc description
 * @param params - Parameter descriptions
 * @param returns - Return value description
 */
export function addJSDoc(
  sourceFile: SourceFile,
  functionName: string,
  description: string,
  params?: Record<string, string>,
  returns?: string
): void {
  const functions = sourceFile.getFunctions();
  const targetFunction = functions.find((f) => f.getName() === functionName);

  if (!targetFunction) return;

  const paramDocs = params
    ? Object.entries(params)
        .map(([name, desc]) => ` * @param ${name} - ${desc}`)
        .join('\n')
    : '';

  const returnDoc = returns ? ` * @returns ${returns}` : '';

  const jsDoc = `/**
 * ${description}
${paramDocs}${returnDoc ? '\n' + returnDoc : ''}
 */`;

  targetFunction.insertText(0, jsDoc + '\n');
}
