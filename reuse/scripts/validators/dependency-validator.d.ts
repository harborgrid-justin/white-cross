/**
 * Dependency Analyzer
 * Detects circular dependencies and analyzes dependency structure
 */
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
export declare function analyzeDependencies(filePath: string, baseDir: string): DependencyNode;
/**
 * Finds circular dependencies using DFS
 * @param graph - Dependency graph
 * @returns Array of circular dependencies
 */
export declare function findCircularDependencies(graph: Map<string, DependencyNode>): CircularDependency[];
/**
 * Validates dependencies across all files in a directory
 * @param directory - Directory to scan
 * @returns Validation result
 */
export declare function validateDependencies(directory: string): DependencyValidationResult;
/**
 * Prints dependency validation results
 * @param result - Validation result
 */
export declare function printDependencyResults(result: DependencyValidationResult): void;
export {};
//# sourceMappingURL=dependency-validator.d.ts.map