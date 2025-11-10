/**
 * Naming Convention Validator
 * Ensures consistent naming conventions across all kit files
 */
interface NamingIssue {
    file: string;
    element: string;
    elementType: string;
    issue: string;
    line: number;
    suggestion?: string;
}
interface NamingValidationResult {
    totalElements: number;
    compliant: number;
    issues: NamingIssue[];
}
/**
 * Validates naming conventions in a TypeScript file
 * @param filePath - Path to the TypeScript file
 * @returns Validation result
 */
export declare function validateNaming(filePath: string): NamingValidationResult;
/**
 * Validates naming conventions across all files in a directory
 * @param directory - Directory to scan
 * @returns Aggregated validation results
 */
export declare function validateNamingInDirectory(directory: string): NamingValidationResult;
/**
 * Prints naming validation results
 * @param result - Validation result
 */
export declare function printNamingResults(result: NamingValidationResult): void;
export {};
//# sourceMappingURL=naming-validator.d.ts.map