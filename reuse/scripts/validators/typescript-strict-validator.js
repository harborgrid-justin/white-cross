"use strict";
/**
 * TypeScript Strict Mode Compliance Validator
 * Ensures all kit files comply with strict TypeScript settings
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTypeScriptStrict = validateTypeScriptStrict;
exports.printStrictModeResults = printStrictModeResults;
const ts = __importStar(require("typescript"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Validates TypeScript strict mode compliance across all kit files
 * @param directory - Directory to validate
 * @returns Array of validation results
 */
function validateTypeScriptStrict(directory) {
    const results = [];
    const tsConfigPath = path.join(directory, 'tsconfig.json');
    if (!fs.existsSync(tsConfigPath)) {
        console.error('❌ tsconfig.json not found');
        return results;
    }
    // Read and parse tsconfig
    const configFile = ts.readConfigFile(tsConfigPath, ts.sys.readFile);
    const parsedConfig = ts.parseJsonConfigFileContent(configFile.config, ts.sys, directory);
    // Check strict mode settings
    const strictConfig = {
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
    const configIssues = [];
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
    const diagnosticsByFile = new Map();
    diagnostics.forEach((diagnostic) => {
        if (diagnostic.file) {
            const fileName = diagnostic.file.fileName;
            if (!diagnosticsByFile.has(fileName)) {
                diagnosticsByFile.set(fileName, []);
            }
            diagnosticsByFile.get(fileName).push(diagnostic);
        }
    });
    // Process each file
    files.forEach((file) => {
        const fileDiagnostics = diagnosticsByFile.get(file) || [];
        const issues = [];
        fileDiagnostics.forEach((diagnostic) => {
            const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
            const line = diagnostic.file
                ? diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start).line + 1
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
function printStrictModeResults(results) {
    console.log('\n📊 TypeScript Strict Mode Compliance Report\n');
    console.log('='.repeat(80));
    const compliant = results.filter((r) => r.compliant).length;
    const total = results.length;
    console.log(`\nCompliance: ${compliant}/${total} files (${((compliant / total) * 100).toFixed(1)}%)\n`);
    const issues = results.filter((r) => !r.compliant);
    if (issues.length === 0) {
        console.log('✅ All files comply with TypeScript strict mode');
    }
    else {
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
//# sourceMappingURL=typescript-strict-validator.js.map