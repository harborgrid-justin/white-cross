"use strict";
/**
 * JSDoc Completeness Validator
 * Ensures all exported functions, classes, and interfaces have proper JSDoc documentation
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
exports.validateJSDoc = validateJSDoc;
exports.validateJSDocInDirectory = validateJSDocInDirectory;
exports.printJSDocResults = printJSDocResults;
const ts = __importStar(require("typescript"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Required JSDoc tags for different element types
 */
const REQUIRED_TAGS = {
    function: ['@param', '@returns', '@description'],
    class: ['@description'],
    interface: ['@description'],
    type: ['@description'],
    enum: ['@description'],
};
/**
 * Validates JSDoc completeness in a TypeScript file
 * @param filePath - Path to the TypeScript file
 * @returns Validation result with issues
 */
function validateJSDoc(filePath) {
    const sourceFile = ts.createSourceFile(filePath, fs.readFileSync(filePath, 'utf-8'), ts.ScriptTarget.Latest, true);
    const issues = [];
    let totalElements = 0;
    let documented = 0;
    /**
     * Checks if a node has JSDoc comments
     * @param node - TypeScript AST node
     * @returns True if node has JSDoc
     */
    function hasJSDoc(node) {
        return ts.getJSDocCommentsAndTags(node).length > 0;
    }
    /**
     * Gets JSDoc tags from a node
     * @param node - TypeScript AST node
     * @returns Array of JSDoc tag names
     */
    function getJSDocTags(node) {
        const tags = [];
        const jsDocTags = ts.getJSDocTags(node);
        jsDocTags.forEach((tag) => {
            tags.push(`@${tag.tagName.text}`);
        });
        return tags;
    }
    /**
     * Validates a node's JSDoc documentation
     * @param node - TypeScript AST node
     * @param elementType - Type of element (function, class, etc.)
     */
    function validateNode(node, elementType) {
        const name = node.name?.text || 'anonymous';
        const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
        const elementIssues = [];
        totalElements++;
        if (!hasJSDoc(node)) {
            elementIssues.push('Missing JSDoc comment');
        }
        else {
            const tags = getJSDocTags(node);
            const requiredTags = REQUIRED_TAGS[elementType];
            requiredTags.forEach((requiredTag) => {
                if (!tags.includes(requiredTag)) {
                    elementIssues.push(`Missing required tag: ${requiredTag}`);
                }
            });
            // Check for description
            const jsDocComments = ts.getJSDocCommentsAndTags(node);
            const hasDescription = jsDocComments.some((comment) => {
                if (ts.isJSDoc(comment)) {
                    return comment.comment && comment.comment.toString().trim().length > 0;
                }
                return false;
            });
            if (!hasDescription) {
                elementIssues.push('Missing description text');
            }
            // For functions, validate parameters
            if (elementType === 'function' &&
                (ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node))) {
                const params = node.parameters;
                params.forEach((param) => {
                    const paramName = param.name.getText();
                    const hasParamDoc = tags.some((tag) => tag.includes(`@param ${paramName}`));
                    if (!hasParamDoc) {
                        elementIssues.push(`Missing @param documentation for: ${paramName}`);
                    }
                });
            }
        }
        if (elementIssues.length === 0) {
            documented++;
        }
        else {
            issues.push({
                file: path.basename(filePath),
                line: line + 1,
                element: name,
                elementType,
                issues: elementIssues,
            });
        }
    }
    /**
     * Visits AST nodes recursively
     * @param node - TypeScript AST node
     */
    function visit(node) {
        // Only check exported elements
        const isExported = (node.modifiers || []).some((mod) => mod.kind === ts.SyntaxKind.ExportKeyword);
        if (isExported || ts.isSourceFile(node.parent)) {
            if (ts.isFunctionDeclaration(node) && node.name) {
                validateNode(node, 'function');
            }
            else if (ts.isClassDeclaration(node) && node.name) {
                validateNode(node, 'class');
                // Check class methods
                node.members.forEach((member) => {
                    if (ts.isMethodDeclaration(member) && member.name) {
                        const isPublic = !member.modifiers?.some((mod) => mod.kind === ts.SyntaxKind.PrivateKeyword ||
                            mod.kind === ts.SyntaxKind.ProtectedKeyword);
                        if (isPublic) {
                            validateNode(member, 'function');
                        }
                    }
                });
            }
            else if (ts.isInterfaceDeclaration(node)) {
                validateNode(node, 'interface');
            }
            else if (ts.isTypeAliasDeclaration(node)) {
                validateNode(node, 'type');
            }
            else if (ts.isEnumDeclaration(node)) {
                validateNode(node, 'enum');
            }
        }
        ts.forEachChild(node, visit);
    }
    visit(sourceFile);
    return {
        totalElements,
        documented,
        issues,
    };
}
/**
 * Validates JSDoc across all files in a directory
 * @param directory - Directory to scan
 * @returns Aggregated validation results
 */
function validateJSDocInDirectory(directory) {
    const files = fs
        .readdirSync(directory)
        .filter((f) => f.endsWith('.ts') && !f.endsWith('.spec.ts') && !f.endsWith('.d.ts'))
        .map((f) => path.join(directory, f));
    const aggregateResult = {
        totalElements: 0,
        documented: 0,
        issues: [],
    };
    files.forEach((file) => {
        const result = validateJSDoc(file);
        aggregateResult.totalElements += result.totalElements;
        aggregateResult.documented += result.documented;
        aggregateResult.issues.push(...result.issues);
    });
    return aggregateResult;
}
/**
 * Prints JSDoc validation results
 * @param result - Validation result
 */
function printJSDocResults(result) {
    console.log('\n📚 JSDoc Completeness Report\n');
    console.log('='.repeat(80));
    const coverage = result.totalElements > 0
        ? ((result.documented / result.totalElements) * 100).toFixed(1)
        : '0.0';
    console.log(`\nDocumentation Coverage: ${result.documented}/${result.totalElements} elements (${coverage}%)\n`);
    if (result.issues.length === 0) {
        console.log('✅ All exported elements have complete JSDoc documentation');
    }
    else {
        console.log(`❌ ${result.issues.length} documentation issues found:\n`);
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
                issue.issues.forEach((i) => {
                    console.log(`      • ${i}`);
                });
            });
        });
    }
    console.log('\n' + '='.repeat(80) + '\n');
}
// CLI execution
if (require.main === module) {
    const directory = process.argv[2] || process.cwd();
    const result = validateJSDocInDirectory(directory);
    printJSDocResults(result);
    // Exit with error code if coverage is below 90%
    const coverage = result.totalElements > 0
        ? (result.documented / result.totalElements) * 100
        : 0;
    process.exit(coverage < 90 ? 1 : 0);
}
//# sourceMappingURL=jsdoc-validator.js.map