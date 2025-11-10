/**
 * Dependency Analyzer
 * Detects circular dependencies and analyzes dependency structure
 */

import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';

interface DependencyNode {
  file: string;
  imports: string[];
  exports: string[];
}

interface CircularDependency {
  cycle: string[];
}

interface DependencyValidationResult {
  files: number;
  totalDependencies: number;
  circularDependencies: CircularDependency[];
  dependencyGraph: Map<string, DependencyNode>;
}

/**
 * Analyzes dependencies in a TypeScript file
 * @param filePath - Path to the TypeScript file
 * @param baseDir - Base directory for resolving relative imports
 * @returns Dependency node
 */
export function analyzeDependencies(filePath: string, baseDir: string): DependencyNode {
  const sourceFile = ts.createSourceFile(
    filePath,
    fs.readFileSync(filePath, 'utf-8'),
    ts.ScriptTarget.Latest,
    true,
  );

  const imports: string[] = [];
  const exports: string[] = [];

  /**
   * Resolves import path to actual file path
   * @param importPath - Import path
   * @returns Resolved file path
   */
  function resolveImportPath(importPath: string): string | null {
    // Skip external modules
    if (!importPath.startsWith('.')) {
      return null;
    }

    const dir = path.dirname(filePath);
    let resolved = path.resolve(dir, importPath);

    // Try adding .ts extension
    if (!fs.existsSync(resolved)) {
      if (fs.existsSync(resolved + '.ts')) {
        resolved = resolved + '.ts';
      } else if (fs.existsSync(path.join(resolved, 'index.ts'))) {
        resolved = path.join(resolved, 'index.ts');
      } else {
        return null;
      }
    }

    return path.relative(baseDir, resolved);
  }

  /**
   * Visits AST nodes to extract imports and exports
   * @param node - TypeScript AST node
   */
  function visit(node: ts.Node): void {
    if (ts.isImportDeclaration(node)) {
      const moduleSpecifier = node.moduleSpecifier;
      if (ts.isStringLiteral(moduleSpecifier)) {
        const resolved = resolveImportPath(moduleSpecifier.text);
        if (resolved) {
          imports.push(resolved);
        }
      }
    } else if (ts.isExportDeclaration(node)) {
      if (node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
        const resolved = resolveImportPath(node.moduleSpecifier.text);
        if (resolved) {
          exports.push(resolved);
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return {
    file: path.relative(baseDir, filePath),
    imports: [...new Set(imports)],
    exports: [...new Set(exports)],
  };
}

/**
 * Finds circular dependencies using DFS
 * @param graph - Dependency graph
 * @returns Array of circular dependencies
 */
export function findCircularDependencies(
  graph: Map<string, DependencyNode>,
): CircularDependency[] {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const cycles: CircularDependency[] = [];

  /**
   * DFS to detect cycles
   * @param file - Current file
   * @param path - Current path
   * @returns True if cycle detected
   */
  function dfs(file: string, path: string[]): boolean {
    if (recursionStack.has(file)) {
      // Found a cycle
      const cycleStart = path.indexOf(file);
      const cycle = [...path.slice(cycleStart), file];
      cycles.push({ cycle });
      return true;
    }

    if (visited.has(file)) {
      return false;
    }

    visited.add(file);
    recursionStack.add(file);
    path.push(file);

    const node = graph.get(file);
    if (node) {
      for (const dep of node.imports) {
        dfs(dep, [...path]);
      }
    }

    path.pop();
    recursionStack.delete(file);

    return false;
  }

  // Check each file
  Array.from(graph.keys()).forEach((file) => {
    if (!visited.has(file)) {
      dfs(file, []);
    }
  });

  return cycles;
}

/**
 * Validates dependencies across all files in a directory
 * @param directory - Directory to scan
 * @returns Validation result
 */
export function validateDependencies(directory: string): DependencyValidationResult {
  const files = fs
    .readdirSync(directory)
    .filter((f) => f.endsWith('.ts') && !f.endsWith('.spec.ts') && !f.endsWith('.d.ts'))
    .map((f) => path.join(directory, f));

  const dependencyGraph = new Map<string, DependencyNode>();
  let totalDependencies = 0;

  files.forEach((file) => {
    const node = analyzeDependencies(file, directory);
    dependencyGraph.set(node.file, node);
    totalDependencies += node.imports.length;
  });

  const circularDependencies = findCircularDependencies(dependencyGraph);

  return {
    files: files.length,
    totalDependencies,
    circularDependencies,
    dependencyGraph,
  };
}

/**
 * Prints dependency validation results
 * @param result - Validation result
 */
export function printDependencyResults(result: DependencyValidationResult): void {
  console.log('\n🔗 Dependency Analysis Report\n');
  console.log('='.repeat(80));

  console.log(`\nFiles analyzed: ${result.files}`);
  console.log(`Total dependencies: ${result.totalDependencies}`);
  console.log(
    `Average dependencies per file: ${(result.totalDependencies / result.files).toFixed(1)}\n`,
  );

  if (result.circularDependencies.length === 0) {
    console.log('✅ No circular dependencies detected');
  } else {
    console.log(`❌ ${result.circularDependencies.length} circular dependencies found:\n`);

    result.circularDependencies.forEach((circular, index) => {
      console.log(`\n${index + 1}. Circular dependency chain:`);
      circular.cycle.forEach((file, i) => {
        const arrow = i < circular.cycle.length - 1 ? ' → ' : '';
        console.log(`   ${file}${arrow}`);
      });
    });
  }

  // Show top dependencies
  console.log('\n📊 Most dependent files (top 10):');
  const sorted = Array.from(result.dependencyGraph.values())
    .sort((a, b) => b.imports.length - a.imports.length)
    .slice(0, 10);

  sorted.forEach((node, index) => {
    console.log(`   ${index + 1}. ${node.file} (${node.imports.length} imports)`);
  });

  console.log('\n' + '='.repeat(80) + '\n');
}

// CLI execution
if (require.main === module) {
  const directory = process.argv[2] || process.cwd();
  const result = validateDependencies(directory);
  printDependencyResults(result);

  // Exit with error code if circular dependencies found
  process.exit(result.circularDependencies.length > 0 ? 1 : 0);
}
