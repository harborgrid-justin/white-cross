/**
 * Export Consistency Validator
 * Ensures all functions, classes, and types are properly exported
 */
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
export declare function validateExports(filePath: string): ExportValidationResult;
/**
 * Validates exports across all files in a directory
 * @param directory - Directory to scan
 * @returns Aggregated validation results
 */
export declare function validateExportsInDirectory(directory: string): ExportValidationResult;
/**
 * Prints export validation results
 * @param result - Validation result
 */
export declare function printExportResults(result: ExportValidationResult): void;
export {};
//# sourceMappingURL=export-validator.d.ts.map