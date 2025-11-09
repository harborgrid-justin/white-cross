"use strict";
/**
 * Export Consistency Validator
 * Ensures all functions, classes, and types are properly exported
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
exports.validateExports = validateExports;
exports.validateExportsInDirectory = validateExportsInDirectory;
exports.printExportResults = printExportResults;
const ts = __importStar(require("typescript"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Validates exports in a TypeScript file
 * @param filePath - Path to the TypeScript file
 * @returns Validation result
 */
function validateExports(filePath) {
    const sourceFile = ts.createSourceFile(filePath, fs.readFileSync(filePath, 'utf-8'), ts.ScriptTarget.Latest, true);
    const issues = [];
    let totalDeclarations = 0;
    let exported = 0;
    /**
     * Checks if a node is exported
     * @param node - TypeScript AST node
     * @returns True if exported
     */
    function isExported(node) {
        return ((node.modifiers || []).some((mod) => mod.kind === ts.SyntaxKind.ExportKeyword) ||
            false);
    }
    /**
     * Gets element type string
     * @param node - TypeScript AST node
     * @returns Element type description
     */
    function getElementType(node) {
        if (ts.isFunctionDeclaration(node))
            return 'function';
        if (ts.isClassDeclaration(node))
            return 'class';
        if (ts.isInterfaceDeclaration(node))
            return 'interface';
        if (ts.isTypeAliasDeclaration(node))
            return 'type';
        if (ts.isEnumDeclaration(node))
            return 'enum';
        if (ts.isVariableStatement(node))
            return 'variable';
        return 'declaration';
    }
    /**
     * Validates a node for export
     * @param node - TypeScript AST node
     */
    function validateNode(node) {
        const name = node.name?.text ||
            node.declarationList?.declarations[0]?.name?.text ||
            'anonymous';
        // Skip private and internal declarations
        if (name.startsWith('_'))
            return;
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
        }
        else {
            exported++;
        }
    }
    /**
     * Visits AST nodes recursively
     * @param node - TypeScript AST node
     */
    function visit(node) {
        // Check top-level declarations
        if (node.parent && ts.isSourceFile(node.parent)) {
            if (ts.isFunctionDeclaration(node) && node.name) {
                validateNode(node);
            }
            else if (ts.isClassDeclaration(node) && node.name) {
                validateNode(node);
            }
            else if (ts.isInterfaceDeclaration(node)) {
                validateNode(node);
            }
            else if (ts.isTypeAliasDeclaration(node)) {
                validateNode(node);
            }
            else if (ts.isEnumDeclaration(node)) {
                validateNode(node);
            }
            else if (ts.isVariableStatement(node)) {
                // Check if it's a constant or important variable
                const declarations = node.declarationList.declarations;
                declarations.forEach((decl) => {
                    const name = decl.name.text;
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
function validateExportsInDirectory(directory) {
    const files = fs
        .readdirSync(directory)
        .filter((f) => f.endsWith('.ts') && !f.endsWith('.spec.ts') && !f.endsWith('.d.ts'))
        .map((f) => path.join(directory, f));
    const aggregateResult = {
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
function printExportResults(result) {
    console.log('\n📤 Export Consistency Report\n');
    console.log('='.repeat(80));
    const coverage = result.totalDeclarations > 0
        ? ((result.exported / result.totalDeclarations) * 100).toFixed(1)
        : '0.0';
    console.log(`\nExport Coverage: ${result.exported}/${result.totalDeclarations} declarations (${coverage}%)\n`);
    if (result.issues.length === 0) {
        console.log('✅ All public declarations are properly exported');
    }
    else {
        console.log(`❌ ${result.issues.length} export issues found:\n`);
        // Group by file
        const issuesByFile = new Map();
        result.issues.forEach((issue) => {
            if (!issuesByFile.has(issue.file)) {
                issuesByFile.set(issue.file, []);
            }
            issuesByFile.get(issue.file).push(issue);
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
//# sourceMappingURL=export-validator.js.map