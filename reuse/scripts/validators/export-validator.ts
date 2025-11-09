/**
 * Export Consistency Validator
 * Ensures all functions, classes, and types are properly exported
 */

import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';

interface ExportIssue {
  file: string;
  element: string;
  elementType: string;
  issue: string;
  line: number;
}

interface ExportValidationResult {
  totalDeclarations: number;
  exported: number;
  issues: ExportIssue[];
}

/**
 * Validates exports in a TypeScript file
 * @param filePath - Path to the TypeScript file
 * @returns Validation result
 */
export function validateExports(filePath: string): ExportValidationResult {
  const sourceFile = ts.createSourceFile(
    filePath,
    fs.readFileSync(filePath, 'utf-8'),
    ts.ScriptTarget.Latest,
    true,
  );

  const issues: ExportIssue[] = [];
  let totalDeclarations = 0;
  let exported = 0;

  /**
   * Checks if a node is exported
   * @param node - TypeScript AST node
   * @returns True if exported
   */
  function isExported(node: ts.Node): boolean {
    return (
      (node.modifiers || []).some((mod) => mod.kind === ts.SyntaxKind.ExportKeyword) ||
      false
    );
  }

  /**
   * Gets element type string
   * @param node - TypeScript AST node
   * @returns Element type description
   */
  function getElementType(node: ts.Node): string {
    if (ts.isFunctionDeclaration(node)) return 'function';
    if (ts.isClassDeclaration(node)) return 'class';
    if (ts.isInterfaceDeclaration(node)) return 'interface';
    if (ts.isTypeAliasDeclaration(node)) return 'type';
    if (ts.isEnumDeclaration(node)) return 'enum';
    if (ts.isVariableStatement(node)) return 'variable';
    return 'declaration';
  }

  /**
   * Validates a node for export
   * @param node - TypeScript AST node
   */
  function validateNode(node: ts.Node): void {
    const name =
      (node as any).name?.text ||
      ((node as ts.VariableStatement).declarationList?.declarations[0] as any)?.name?.text ||
      'anonymous';

    // Skip private and internal declarations
    if (name.startsWith('_')) return;

    const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
    const elementType = getElementType(node);

    totalDeclarations++;

    if (!isExported(node)) {
      issues.push({
        file: path.basename(filePath),
        element: name,
        elementType,
        issue: 'Declaration is not exported',
        line: line + 1,
      });
    } else {
      exported++;
    }
  }

  /**
   * Visits AST nodes recursively
   * @param node - TypeScript AST node
   */
  function visit(node: ts.Node): void {
    // Check top-level declarations
    if (node.parent && ts.isSourceFile(node.parent)) {
      if (ts.isFunctionDeclaration(node) && node.name) {
        validateNode(node);
      } else if (ts.isClassDeclaration(node) && node.name) {
        validateNode(node);
      } else if (ts.isInterfaceDeclaration(node)) {
        validateNode(node);
      } else if (ts.isTypeAliasDeclaration(node)) {
        validateNode(node);
      } else if (ts.isEnumDeclaration(node)) {
        validateNode(node);
      } else if (ts.isVariableStatement(node)) {
        // Check if it's a constant or important variable
        const declarations = node.declarationList.declarations;
        declarations.forEach((decl) => {
          const name = (decl.name as any).text;
          // Only validate important variables (uppercase or starting with capital)
          if (name && (name === name.toUpperCase() || /^[A-Z]/.test(name))) {
            validateNode(node);
          }
        });
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return {
    totalDeclarations,
    exported,
    issues,
  };
}

/**
 * Validates exports across all files in a directory
 * @param directory - Directory to scan
 * @returns Aggregated validation results
 */
export function validateExportsInDirectory(directory: string): ExportValidationResult {
  const files = fs
    .readdirSync(directory)
    .filter((f) => f.endsWith('.ts') && !f.endsWith('.spec.ts') && !f.endsWith('.d.ts'))
    .map((f) => path.join(directory, f));

  const aggregateResult: ExportValidationResult = {
    totalDeclarations: 0,
    exported: 0,
    issues: [],
  };

  files.forEach((file) => {
    const result = validateExports(file);
    aggregateResult.totalDeclarations += result.totalDeclarations;
    aggregateResult.exported += result.exported;
    aggregateResult.issues.push(...result.issues);
  });

  return aggregateResult;
}

/**
 * Prints export validation results
 * @param result - Validation result
 */
export function printExportResults(result: ExportValidationResult): void {
  console.log('\n📤 Export Consistency Report\n');
  console.log('='.repeat(80));

  const coverage = result.totalDeclarations > 0
    ? ((result.exported / result.totalDeclarations) * 100).toFixed(1)
    : '0.0';

  console.log(
    `\nExport Coverage: ${result.exported}/${result.totalDeclarations} declarations (${coverage}%)\n`,
  );

  if (result.issues.length === 0) {
    console.log('✅ All public declarations are properly exported');
  } else {
    console.log(`❌ ${result.issues.length} export issues found:\n`);

    // Group by file
    const issuesByFile = new Map<string, ExportIssue[]>();
    result.issues.forEach((issue) => {
      if (!issuesByFile.has(issue.file)) {
        issuesByFile.set(issue.file, []);
      }
      issuesByFile.get(issue.file)!.push(issue);
    });

    issuesByFile.forEach((fileIssues, file) => {
      console.log(`\n📄 ${file} (${fileIssues.length} issues)`);
      fileIssues.forEach((issue) => {
        console.log(`   Line ${issue.line} - ${issue.elementType}: ${issue.element}`);
        console.log(`      • ${issue.issue}`);
      });
    });
  }

  console.log('\n' + '='.repeat(80) + '\n');
}

// CLI execution
if (require.main === module) {
  const directory = process.argv[2] || process.cwd();
  const result = validateExportsInDirectory(directory);
  printExportResults(result);

  // Exit with error code if any issues found
  process.exit(result.issues.length > 0 ? 1 : 0);
}
