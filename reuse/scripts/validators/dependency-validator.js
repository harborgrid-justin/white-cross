"use strict";
/**
 * Dependency Analyzer
 * Detects circular dependencies and analyzes dependency structure
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
exports.analyzeDependencies = analyzeDependencies;
exports.findCircularDependencies = findCircularDependencies;
exports.validateDependencies = validateDependencies;
exports.printDependencyResults = printDependencyResults;
const ts = __importStar(require("typescript"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Analyzes dependencies in a TypeScript file
 * @param filePath - Path to the TypeScript file
 * @param baseDir - Base directory for resolving relative imports
 * @returns Dependency node
 */
function analyzeDependencies(filePath, baseDir) {
    const sourceFile = ts.createSourceFile(filePath, fs.readFileSync(filePath, 'utf-8'), ts.ScriptTarget.Latest, true);
    const imports = [];
    const exports = [];
    /**
     * Resolves import path to actual file path
     * @param importPath - Import path
     * @returns Resolved file path
     */
    function resolveImportPath(importPath) {
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
            }
            else if (fs.existsSync(path.join(resolved, 'index.ts'))) {
                resolved = path.join(resolved, 'index.ts');
            }
            else {
                return null;
            }
        }
        return path.relative(baseDir, resolved);
    }
    /**
     * Visits AST nodes to extract imports and exports
     * @param node - TypeScript AST node
     */
    function visit(node) {
        if (ts.isImportDeclaration(node)) {
            const moduleSpecifier = node.moduleSpecifier;
            if (ts.isStringLiteral(moduleSpecifier)) {
                const resolved = resolveImportPath(moduleSpecifier.text);
                if (resolved) {
                    imports.push(resolved);
                }
            }
        }
        else if (ts.isExportDeclaration(node)) {
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
function findCircularDependencies(graph) {
    const visited = new Set();
    const recursionStack = new Set();
    const cycles = [];
    /**
     * DFS to detect cycles
     * @param file - Current file
     * @param path - Current path
     * @returns True if cycle detected
     */
    function dfs(file, path) {
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
function validateDependencies(directory) {
    const files = fs
        .readdirSync(directory)
        .filter((f) => f.endsWith('.ts') && !f.endsWith('.spec.ts') && !f.endsWith('.d.ts'))
        .map((f) => path.join(directory, f));
    const dependencyGraph = new Map();
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
function printDependencyResults(result) {
    console.log('\n🔗 Dependency Analysis Report\n');
    console.log('='.repeat(80));
    console.log(`\nFiles analyzed: ${result.files}`);
    console.log(`Total dependencies: ${result.totalDependencies}`);
    console.log(`Average dependencies per file: ${(result.totalDependencies / result.files).toFixed(1)}\n`);
    if (result.circularDependencies.length === 0) {
        console.log('✅ No circular dependencies detected');
    }
    else {
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
//# sourceMappingURL=dependency-validator.js.map