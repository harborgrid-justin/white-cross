/**
 * TypeScript Strict Mode Compliance Validator
 * Ensures all kit files comply with strict TypeScript settings
 */

import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';

interface ValidationResult {
  file: string;
  compliant: boolean;
  issues: string[];
}

interface StrictModeConfig {
  strict: boolean;
  noImplicitAny: boolean;
  strictNullChecks: boolean;
  strictFunctionTypes: boolean;
  strictBindCallApply: boolean;
  strictPropertyInitialization: boolean;
  noImplicitThis: boolean;
  alwaysStrict: boolean;
}

/**
 * Validates TypeScript strict mode compliance across all kit files
 * @param directory - Directory to validate
 * @returns Array of validation results
 */
export function validateTypeScriptStrict(directory: string): ValidationResult[] {
  const results: ValidationResult[] = [];
  const tsConfigPath = path.join(directory, 'tsconfig.json');

  if (!fs.existsSync(tsConfigPath)) {
    console.error('❌ tsconfig.json not found');
    return results;
  }

  // Read and parse tsconfig
  const configFile = ts.readConfigFile(tsConfigPath, ts.sys.readFile);
  const parsedConfig = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    directory,
  );

  // Check strict mode settings
  const strictConfig: StrictModeConfig = {
    strict: parsedConfig.options.strict ?? false,
    noImplicitAny: parsedConfig.options.noImplicitAny ?? false,
    strictNullChecks: parsedConfig.options.strictNullChecks ?? false,
    strictFunctionTypes: parsedConfig.options.strictFunctionTypes ?? false,
    strictBindCallApply: parsedConfig.options.strictBindCallApply ?? false,
    strictPropertyInitialization: parsedConfig.options.strictPropertyInitialization ?? false,
    noImplicitThis: parsedConfig.options.noImplicitThis ?? false,
    alwaysStrict: parsedConfig.options.alwaysStrict ?? false,
  };

  // Validate tsconfig has strict mode enabled
  const configIssues: string[] = [];
  if (!strictConfig.strict) {
    configIssues.push('strict mode is not enabled in tsconfig.json');
  }

  if (configIssues.length > 0) {
    results.push({
      file: 'tsconfig.json',
      compliant: false,
      issues: configIssues,
    });
  }

  // Get all .ts files
  const files = parsedConfig.fileNames.filter((f) => f.endsWith('.ts') && !f.endsWith('.spec.ts'));

  // Create program
  const program = ts.createProgram(files, parsedConfig.options);
  const diagnostics = ts.getPreEmitDiagnostics(program);

  // Group diagnostics by file
  const diagnosticsByFile = new Map<string, ts.Diagnostic[]>();
  diagnostics.forEach((diagnostic) => {
    if (diagnostic.file) {
      const fileName = diagnostic.file.fileName;
      if (!diagnosticsByFile.has(fileName)) {
        diagnosticsByFile.set(fileName, []);
      }
      diagnosticsByFile.get(fileName)!.push(diagnostic);
    }
  });

  // Process each file
  files.forEach((file) => {
    const fileDiagnostics = diagnosticsByFile.get(file) || [];
    const issues: string[] = [];

    fileDiagnostics.forEach((diagnostic) => {
      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
      const line = diagnostic.file
        ? diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!).line + 1
        : 0;
      issues.push(`Line ${line}: ${message}`);
    });

    results.push({
      file: path.relative(directory, file),
      compliant: issues.length === 0,
      issues,
    });
  });

  return results;
}

/**
 * Prints validation results to console
 * @param results - Validation results
 */
export function printStrictModeResults(results: ValidationResult[]): void {
  console.log('\n📊 TypeScript Strict Mode Compliance Report\n');
  console.log('='.repeat(80));

  const compliant = results.filter((r) => r.compliant).length;
  const total = results.length;

  console.log(`\nCompliance: ${compliant}/${total} files (${((compliant / total) * 100).toFixed(1)}%)\n`);

  const issues = results.filter((r) => !r.compliant);
  if (issues.length === 0) {
    console.log('✅ All files comply with TypeScript strict mode');
  } else {
    console.log(`❌ ${issues.length} files have strict mode issues:\n`);
    issues.forEach((result) => {
      console.log(`\n📄 ${result.file}`);
      result.issues.forEach((issue) => {
        console.log(`   - ${issue}`);
      });
    });
  }

  console.log('\n' + '='.repeat(80) + '\n');
}

// CLI execution
if (require.main === module) {
  const directory = process.argv[2] || process.cwd();
  const results = validateTypeScriptStrict(directory);
  printStrictModeResults(results);

  // Exit with error code if any issues found
  const hasIssues = results.some((r) => !r.compliant);
  process.exit(hasIssues ? 1 : 0);
}
