/**
 * JSDoc Completeness Validator
 * Ensures all exported functions, classes, and interfaces have proper JSDoc documentation
 */
interface JSDocIssue {
    file: string;
    line: number;
    element: string;
    elementType: string;
    issues: string[];
}
interface JSDocValidationResult {
    totalElements: number;
    documented: number;
    issues: JSDocIssue[];
}
/**
 * Validates JSDoc completeness in a TypeScript file
 * @param filePath - Path to the TypeScript file
 * @returns Validation result with issues
 */
export declare function validateJSDoc(filePath: string): JSDocValidationResult;
/**
 * Validates JSDoc across all files in a directory
 * @param directory - Directory to scan
 * @returns Aggregated validation results
 */
export declare function validateJSDocInDirectory(directory: string): JSDocValidationResult;
/**
 * Prints JSDoc validation results
 * @param result - Validation result
 */
export declare function printJSDocResults(result: JSDocValidationResult): void;
export {};
//# sourceMappingURL=jsdoc-validator.d.ts.map