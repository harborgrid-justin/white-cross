/**
 * Import Manager
 *
 * Manages import statements for generated code.
 * Handles deduplication, organization, and optimization.
 */

/**
 * Import type
 */
export type ImportType = 'default' | 'named' | 'namespace' | 'side-effect';

/**
 * Import statement
 */
export interface ImportStatement {
  type: ImportType;
  moduleSpecifier: string;
  defaultImport?: string;
  namedImports?: string[];
  namespaceImport?: string;
}

/**
 * Import Manager class
 *
 * Manages and organizes imports for generated code.
 */
export class ImportManager {
  private imports: Map<string, ImportStatement> = new Map();

  /**
   * Add a default import
   *
   * @param defaultImport - Default import name
   * @param moduleSpecifier - Module to import from
   */
  addDefaultImport(defaultImport: string, moduleSpecifier: string): void {
    const key = `${moduleSpecifier}:default`;

    if (this.imports.has(key)) {
      // Update existing import
      const existing = this.imports.get(key)!;
      existing.defaultImport = defaultImport;
    } else {
      this.imports.set(key, {
        type: 'default',
        moduleSpecifier,
        defaultImport,
      });
    }
  }

  /**
   * Add named imports
   *
   * @param namedImports - Array of named imports
   * @param moduleSpecifier - Module to import from
   */
  addNamedImports(namedImports: string[], moduleSpecifier: string): void {
    const key = `${moduleSpecifier}:named`;

    if (this.imports.has(key)) {
      // Merge with existing named imports
      const existing = this.imports.get(key)!;
      const combined = new Set([
        ...(existing.namedImports || []),
        ...namedImports,
      ]);
      existing.namedImports = Array.from(combined);
    } else {
      this.imports.set(key, {
        type: 'named',
        moduleSpecifier,
        namedImports,
      });
    }
  }

  /**
   * Add a single named import
   *
   * @param namedImport - Named import
   * @param moduleSpecifier - Module to import from
   */
  addNamedImport(namedImport: string, moduleSpecifier: string): void {
    this.addNamedImports([namedImport], moduleSpecifier);
  }

  /**
   * Add a namespace import
   *
   * @param namespaceImport - Namespace import name
   * @param moduleSpecifier - Module to import from
   */
  addNamespaceImport(namespaceImport: string, moduleSpecifier: string): void {
    const key = `${moduleSpecifier}:namespace`;

    this.imports.set(key, {
      type: 'namespace',
      moduleSpecifier,
      namespaceImport,
    });
  }

  /**
   * Add a side-effect import
   *
   * @param moduleSpecifier - Module to import
   */
  addSideEffectImport(moduleSpecifier: string): void {
    const key = `${moduleSpecifier}:side-effect`;

    this.imports.set(key, {
      type: 'side-effect',
      moduleSpecifier,
    });
  }

  /**
   * Add a mixed import (default + named)
   *
   * @param defaultImport - Default import name
   * @param namedImports - Array of named imports
   * @param moduleSpecifier - Module to import from
   */
  addMixedImport(
    defaultImport: string,
    namedImports: string[],
    moduleSpecifier: string
  ): void {
    const key = `${moduleSpecifier}:mixed`;

    this.imports.set(key, {
      type: 'default',
      moduleSpecifier,
      defaultImport,
      namedImports,
    });
  }

  /**
   * Add React import (commonly used)
   */
  addReactImport(): void {
    this.addDefaultImport('React', 'react');
  }

  /**
   * Add Next.js imports
   */
  addNextImports(imports: {
    Link?: boolean;
    Image?: boolean;
    useRouter?: boolean;
    usePathname?: boolean;
    useSearchParams?: boolean;
    redirect?: boolean;
    notFound?: boolean;
  }): void {
    if (imports.Link) {
      this.addDefaultImport('Link', 'next/link');
    }

    if (imports.Image) {
      this.addDefaultImport('Image', 'next/image');
    }

    const navigationImports: string[] = [];
    if (imports.useRouter) navigationImports.push('useRouter');
    if (imports.usePathname) navigationImports.push('usePathname');
    if (imports.useSearchParams) navigationImports.push('useSearchParams');
    if (imports.redirect) navigationImports.push('redirect');
    if (imports.notFound) navigationImports.push('notFound');

    if (navigationImports.length > 0) {
      this.addNamedImports(navigationImports, 'next/navigation');
    }
  }

  /**
   * Add common React hooks
   */
  addReactHooks(hooks: string[]): void {
    this.addNamedImports(hooks, 'react');
  }

  /**
   * Check if an import exists
   *
   * @param moduleSpecifier - Module specifier to check
   * @returns True if import exists
   */
  hasImport(moduleSpecifier: string): boolean {
    return Array.from(this.imports.values()).some(
      (imp) => imp.moduleSpecifier === moduleSpecifier
    );
  }

  /**
   * Remove an import
   *
   * @param moduleSpecifier - Module specifier to remove
   */
  removeImport(moduleSpecifier: string): void {
    const keysToRemove: string[] = [];

    for (const [key, imp] of this.imports.entries()) {
      if (imp.moduleSpecifier === moduleSpecifier) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => this.imports.delete(key));
  }

  /**
   * Clear all imports
   */
  clear(): void {
    this.imports.clear();
  }

  /**
   * Get all imports sorted and organized
   *
   * @returns Array of import statements
   */
  getImports(): ImportStatement[] {
    return this.organizeImports(Array.from(this.imports.values()));
  }

  /**
   * Generate import code strings
   *
   * @returns Array of import code strings
   */
  generateImportStatements(): string[] {
    const imports = this.getImports();

    return imports.map((imp) => this.generateImportStatement(imp));
  }

  /**
   * Generate a single import statement
   *
   * @param imp - Import statement
   * @returns Import code string
   */
  private generateImportStatement(imp: ImportStatement): string {
    switch (imp.type) {
      case 'default':
        if (imp.namedImports && imp.namedImports.length > 0) {
          // Mixed import: default + named
          return `import ${imp.defaultImport}, { ${imp.namedImports.join(', ')} } from '${imp.moduleSpecifier}';`;
        }
        return `import ${imp.defaultImport} from '${imp.moduleSpecifier}';`;

      case 'named':
        return `import { ${imp.namedImports!.join(', ')} } from '${imp.moduleSpecifier}';`;

      case 'namespace':
        return `import * as ${imp.namespaceImport} from '${imp.moduleSpecifier}';`;

      case 'side-effect':
        return `import '${imp.moduleSpecifier}';`;

      default:
        return '';
    }
  }

  /**
   * Organize imports by type and module
   *
   * @param imports - Array of imports to organize
   * @returns Organized imports
   */
  private organizeImports(imports: ImportStatement[]): ImportStatement[] {
    // Merge imports from the same module
    const merged = this.mergeImports(imports);

    // Sort imports: external, internal (@/), relative (.)
    return merged.sort((a, b) => {
      const aScore = this.getImportScore(a.moduleSpecifier);
      const bScore = this.getImportScore(b.moduleSpecifier);

      if (aScore !== bScore) {
        return aScore - bScore;
      }

      // Within same category, sort alphabetically
      return a.moduleSpecifier.localeCompare(b.moduleSpecifier);
    });
  }

  /**
   * Merge imports from the same module
   *
   * @param imports - Array of imports
   * @returns Merged imports
   */
  private mergeImports(imports: ImportStatement[]): ImportStatement[] {
    const merged = new Map<string, ImportStatement>();

    for (const imp of imports) {
      const key = imp.moduleSpecifier;

      if (!merged.has(key)) {
        merged.set(key, { ...imp });
      } else {
        const existing = merged.get(key)!;

        // Merge default import
        if (imp.defaultImport) {
          existing.defaultImport = imp.defaultImport;
        }

        // Merge named imports
        if (imp.namedImports) {
          const combined = new Set([
            ...(existing.namedImports || []),
            ...imp.namedImports,
          ]);
          existing.namedImports = Array.from(combined);
        }

        // Merge namespace import
        if (imp.namespaceImport) {
          existing.namespaceImport = imp.namespaceImport;
          existing.type = 'namespace';
        }
      }
    }

    return Array.from(merged.values());
  }

  /**
   * Get import priority score for sorting
   *
   * @param moduleSpecifier - Module specifier
   * @returns Priority score (lower = higher priority)
   */
  private getImportScore(moduleSpecifier: string): number {
    // React and Next.js imports first
    if (moduleSpecifier === 'react' || moduleSpecifier.startsWith('react/')) {
      return 0;
    }

    if (
      moduleSpecifier === 'next' ||
      moduleSpecifier.startsWith('next/')
    ) {
      return 1;
    }

    // External packages
    if (!moduleSpecifier.startsWith('.') && !moduleSpecifier.startsWith('@/')) {
      return 2;
    }

    // Internal (@/) imports
    if (moduleSpecifier.startsWith('@/')) {
      return 3;
    }

    // Relative imports
    return 4;
  }

  /**
   * Get formatted import code
   *
   * @returns Formatted import code string
   */
  toString(): string {
    return this.generateImportStatements().join('\n');
  }

  /**
   * Create a copy of the import manager
   *
   * @returns New ImportManager with same imports
   */
  clone(): ImportManager {
    const newManager = new ImportManager();
    this.imports.forEach((value, key) => {
      newManager.imports.set(key, { ...value });
    });
    return newManager;
  }
}
